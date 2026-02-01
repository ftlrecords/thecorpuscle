import { Root as HTMLRoot } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"
import { FilePath, joinSegments, pathToRoot, isRelativeURL } from "../../util/path"

export interface Options {
  defaultImage: string
}

const defaultOptions: Options = {
  defaultImage: "/og-image.png",
}

function coalesceImageAliases(data: { [key: string]: any }, aliases: string[]): string | undefined {
  for (const alias of aliases) {
    if (data[alias] !== undefined && data[alias] !== null && typeof data[alias] === "string") {
      return data[alias]
    }
  }
  return undefined
}

export const OpenGraphImage: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  return {
    name: "OpenGraphImage",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            let opengraphImage: string | undefined
            
            // Priority 1: Check frontmatter for opengraph image
            const frontmatterImage = coalesceImageAliases(
              file.data.frontmatter || {}, 
              ["opengraph_image", "og_image", "opengraphImage", "ogImage"]
            )
            
            if (frontmatterImage) {
              opengraphImage = frontmatterImage
            } else {
              // Priority 2: Find first image in content
              let firstImage: string | undefined
              
              visit(tree, "element", (node) => {
                if (firstImage) return // Already found one
                
                if (node.tagName === "img" && node.properties?.src) {
                  const src = node.properties.src.toString()
                  firstImage = src
                }
              })
              
              if (firstImage) {
                opengraphImage = firstImage
              } else {
                // Priority 3: Use default image
                opengraphImage = opts.defaultImage
              }
            }
            
            // Convert relative URLs to absolute paths from site root
            if (opengraphImage && isRelativeURL(opengraphImage)) {
              // If the image starts with "/" it's already relative to root, keep as-is
              if (opengraphImage.startsWith("/")) {
                // Already absolute path from root
                opengraphImage = opengraphImage
              } else {
                // Relative path like "../assets/image.png" - convert to absolute
                // Images in content are typically in the assets directory
                if (opengraphImage.includes("../assets/")) {
                  opengraphImage = opengraphImage.replace(/\.\.\/+assets\//, "/assets/")
                } else if (opengraphImage.includes("assets/")) {
                  opengraphImage = "/" + opengraphImage.replace(/^\.\/+/, "")
                } else {
                  // Other relative paths - assume they're relative to content root
                  opengraphImage = "/" + opengraphImage.replace(/^\.\.\/+/, "")
                }
              }
            }
            
            // Store the opengraph image in file data for use by Head component
            file.data.opengraphImage = opengraphImage
            // Also set for Twitter cards (same image)
            file.data.twitterImage = opengraphImage
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    opengraphImage: string
    twitterImage: string
  }
}
