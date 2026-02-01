import { GlobalConfiguration } from "../../cfg"
import { getDate } from "../../components/Date"
import { FullSlug, SimpleSlug, joinSegments, simplifySlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"

export type LLMSContentMap = Map<FullSlug, LLMSContentDetails>
export type LLMSContentDetails = {
  slug: FullSlug
  title: string
  tags: string[]
  content: string
  date?: Date
  description?: string
}

interface Options {
  includeEmptyFiles: boolean
}

const defaultOptions: Options = {
  includeEmptyFiles: false,
}

function generateLLMSFullTxt(cfg: GlobalConfiguration, idx: LLMSContentMap): string {
  const base = cfg.baseUrl ?? ""
  const pageTitle = cfg.pageTitle ?? "Blog"

  let output = `# ${pageTitle}\n\n`
  output += `> ${cfg.description ?? "A blog"}\n\n`

  if (base) {
    output += `Website: https://${base}\n\n`
  }

  output += `## Contents\n\n`

  // Sort by date (newest first)
  const sortedEntries = Array.from(idx).sort(([_, a], [__, b]) => {
    if (a.date && b.date) {
      return b.date.getTime() - a.date.getTime()
    } else if (a.date && !b.date) {
      return -1
    } else if (!a.date && b.date) {
      return 1
    }
    return a.title.localeCompare(b.title)
  })

  for (const [slug, content] of sortedEntries) {
    const simpleSlug = simplifySlug(slug)
    const url = `https://${joinSegments(base, simpleSlug)}`

    output += `### ${content.title}\n\n`

    if (content.description) {
      output += `${content.description}\n\n`
    }

    if (content.date) {
      output += `Date: ${content.date.toISOString().split('T')[0]}\n`
    }

    output += `URL: ${url}\n`

    if (content.tags && content.tags.length > 0) {
      output += `Tags: ${content.tags.join(', ')}\n`
    }

    output += `\n${content.content}\n\n`
    output += `---\n\n`
  }

  return output
}

function generatePageLLMSTxt(content: LLMSContentDetails, cfg: GlobalConfiguration): string {
  const base = cfg.baseUrl ?? ""
  const simpleSlug = simplifySlug(content.slug)
  const url = `https://${joinSegments(base, simpleSlug)}`

  let output = `# ${content.title}\n\n`

  if (content.description) {
    output += `${content.description}\n\n`
  }

  if (content.date) {
    output += `Date: ${content.date.toISOString().split('T')[0]}\n`
  }

  output += `URL: ${url}\n`

  if (content.tags && content.tags.length > 0) {
    output += `Tags: ${content.tags.join(', ')}\n`
  }

  output += `\n---\n\n`
  output += `${content.content}\n`

  return output
}

export const LLMSTxt: QuartzEmitterPlugin<Partial<Options>> = (opts) => {
  opts = { ...defaultOptions, ...opts }
  return {
    name: "LLMSTxt",
    async *emit(ctx, content) {
      const cfg = ctx.cfg.configuration
      const llmsIndex: LLMSContentMap = new Map()

      // Build the content index
      for (const [_tree, file] of content) {
        const slug = file.data.slug!
        const date = getDate(ctx.cfg.configuration, file.data) ?? undefined

        // Only include files with content
        if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          llmsIndex.set(slug, {
            slug,
            title: file.data.frontmatter?.title ?? "Untitled",
            tags: file.data.frontmatter?.tags ?? [],
            content: file.data.text ?? "",
            date: date,
            description: file.data.description ?? file.data.frontmatter?.description ?? "",
          })
        }
      }

      // Generate llms-full.txt at the root
      yield write({
        ctx,
        content: generateLLMSFullTxt(cfg, llmsIndex),
        slug: "llms-full" as FullSlug,
        ext: ".txt",
      })

      // Generate individual llms.txt for each page
      for (const [slug, contentDetails] of llmsIndex) {
        yield write({
          ctx,
          content: generatePageLLMSTxt(contentDetails, cfg),
          slug: `${slug}/llms` as FullSlug,
          ext: ".txt",
        })
      }
    },
  }
}
