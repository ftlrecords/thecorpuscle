import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleSubtitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const subtitle = fileData.frontmatter?.subtitle
  if (subtitle) {
    return <h3 class={classNames(displayClass, "article-subtitle")}>{subtitle}</h3>
  } else {
    return null
  }
}

ArticleSubtitle.css = `
.article-subtitle {
  margin: 0.5rem 0 0 0;
  color: var(--gray);
  font-weight: normal;
}
`

export default (() => ArticleSubtitle) satisfies QuartzComponentConstructor