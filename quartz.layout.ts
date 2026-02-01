import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://ftlrecords.github.io/thecorpuscle/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.Flex({
      components: [
        { Component: Component.ArticleTitle(), grow: true, align: "start" },
        {
          Component: Component.CopyPageMarkdown(),
          align: "start",
        },
      ],
    }),
    Component.ArticleSubtitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        const folderOrder = ["blog", "notes", "research", "careers", "archive"]

        if (a.isFolder && b.isFolder) {
          const aIndex = folderOrder.indexOf(a.displayName.toLowerCase())
          const bIndex = folderOrder.indexOf(b.displayName.toLowerCase())
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
          if (aIndex !== -1) return -1
          if (bIndex !== -1) return 1
          return a.displayName.localeCompare(b.displayName)
        }

        if (a.isFolder) return -1
        if (b.isFolder) return 1

        // Files: sort by date (newest first)
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        return bDate - aDate || a.displayName.localeCompare(b.displayName)
      },
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.Graph({
        localGraph: {
          depth: -1,
          scale: 0.9,
          repelForce: 0.5,
          centerForce: 0.3,
          linkDistance: 30,
          fontSize: 0.6,
          opacityScale: 1,
          showTags: true,
        },
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        const folderOrder = ["blog", "notes", "research", "careers", "archive"]

        if (a.isFolder && b.isFolder) {
          const aIndex = folderOrder.indexOf(a.displayName.toLowerCase())
          const bIndex = folderOrder.indexOf(b.displayName.toLowerCase())
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
          if (aIndex !== -1) return -1
          if (bIndex !== -1) return 1
          return a.displayName.localeCompare(b.displayName)
        }

        if (a.isFolder) return -1
        if (b.isFolder) return 1

        // Files: sort by date (newest first)
        const aDate = a.data?.date ? new Date(a.data.date).getTime() : 0
        const bDate = b.data?.date ? new Date(b.data.date).getTime() : 0
        return bDate - aDate || a.displayName.localeCompare(b.displayName)
      },
    }),
  ],
  right: [],
}
