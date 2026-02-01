// @ts-ignore
import copypageScript from "./scripts/copypage.inline"
import styles from "./styles/copypage.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const CopyPageMarkdown: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug
  const isHomePage = slug === "index"
  const buttonText = isHomePage ? "Copy all blog content" : "Copy page"
  const ariaLabel = isHomePage ? "Copy all blog content" : "Copy page as Markdown"

  return (
    <div class={classNames(displayClass, "copy-page-container")}>
      <button class="copy-page-button" data-slug={slug} aria-label={ariaLabel}>
        <svg
          aria-hidden="true"
          height="16"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
        >
          <path
            fill-rule="evenodd"
            d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
          ></path>
          <path
            fill-rule="evenodd"
            d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
          ></path>
        </svg>
        <span class="copy-page-text">{buttonText}</span>
        <svg
          class="dropdown-arrow"
          aria-hidden="true"
          height="12"
          viewBox="0 0 12 12"
          version="1.1"
          width="12"
        >
          <path d="M6 8.5L2 4.5h8L6 8.5z"></path>
        </svg>
      </button>
      <div class="copy-page-dropdown">
        <button class="dropdown-item copy-markdown-btn" data-slug={slug}>
          <svg
            aria-hidden="true"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
          >
            <path
              fill-rule="evenodd"
              d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
            ></path>
            <path
              fill-rule="evenodd"
              d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
            ></path>
          </svg>
          <div class="dropdown-item-content">
            <span class="dropdown-item-title">{isHomePage ? "Copy all blog content" : "Copy page as Markdown"}</span>
          </div>
        </button>
        <a class="dropdown-item view-markdown-link external" href={isHomePage ? `/llms-full.txt` : `/${slug}/llms.txt`} target="_blank" data-no-popover="true">
          <svg
            aria-hidden="true"
            height="16"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
          >
            <path
              fill-rule="evenodd"
              d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75zm6.75.062V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.272.272 0 00-.013-.011z"
            ></path>
          </svg>
          <div class="dropdown-item-content">
            <span class="dropdown-item-title">View as Markdown <span class="external-arrow">↗</span></span>
          </div>
        </a>
        <a
          class="dropdown-item honcho-link external"
          data-slug={slug}
          href="#"
          target="_blank"
          data-no-popover="true"
        >
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="16"
            width="16"
            viewBox="0 0 87 77"
          >
            <path d="M55.29 0H38.77V6.89H55.29V0Z"></path>
            <path d="M65.95 6.89H55.29V13.69H65.95V6.89Z"></path>
            <path d="M72.66 13.69H65.95V20.4H72.66V13.69Z"></path>
            <path d="M79.54 20.4H72.66V30.17H79.54V20.4Z"></path>
            <path d="M86.33 30.16H79.54V46.54H86.33V30.16Z"></path>
            <path d="M79.54 46.55H72.67V56.32H79.54V46.55Z"></path>
            <path d="M72.67 56.31H65.95V63.11H72.67V56.31Z"></path>
            <path d="M65.95 63.11H55.29V69.96H65.95V63.11Z"></path>
            <path d="M55.29 69.96H35.84V76.65H55.29V69.96Z"></path>
            <path d="M35.84 63.11H25.18V69.96H35.84V63.11Z"></path>
            <path d="M25.18 56.31H18.39V63.11H25.18V56.31Z"></path>
            <path d="M18.39 46.55H11.52V56.32H18.39V46.55Z"></path>
            <path d="M4.87 33.97V20.4H0V40.8H4.87V46.55H11.52V33.97H4.87Z"></path>
            <path d="M18.31 27.17H11.52V33.96H18.31V27.17Z"></path>
            <path d="M38.77 6.89H18.39V13.69H38.77V6.89Z"></path>
            <path d="M45.5 13.69H38.79V20.4H45.5V13.69Z"></path>
            <path d="M18.32 27.17H38.79V20.4H18.39V13.69H4.87V20.4H18.32V27.17Z"></path>
            <path d="M38.79 30.16H31.98V36.87H38.79V30.16Z"></path>
            <path d="M59.09 30.16H52.28V36.87H59.09V30.16Z"></path>
            <path d="M59.16 50.47H31.98V56.31H59.16V50.47Z"></path>
          </svg>
          <div class="dropdown-item-content">
            <span class="dropdown-item-title">{isHomePage ? "Ask Honcho Chat about this blog" : "Ask Honcho Chat about this page"} <span class="external-arrow">↗</span></span>
          </div>
        </a>
        <a
          class="dropdown-item chatgpt-link external"
          data-slug={slug}
          href="#"
          target="_blank"
          data-no-popover="true"
        >
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="16"
            width="16"
            viewBox="0 0 320 320"
          >
            <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"></path>
          </svg>
          <div class="dropdown-item-content">
            <span class="dropdown-item-title">{isHomePage ? "Ask ChatGPT about this blog" : "Ask ChatGPT about this page"} <span class="external-arrow">↗</span></span>
          </div>
        </a>
        <a
          class="dropdown-item claude-link external"
          data-slug={slug}
          href="#"
          target="_blank"
          data-no-popover="true"
        >
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="16"
            width="16"
            viewBox="0 0 24 24"
          >
            <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"></path>
          </svg>
          <div class="dropdown-item-content">
            <span class="dropdown-item-title">{isHomePage ? "Ask Claude about this blog" : "Ask Claude about this page"} <span class="external-arrow">↗</span></span>
          </div>
        </a>
      </div>
    </div>
  )
}

CopyPageMarkdown.afterDOMLoaded = copypageScript
CopyPageMarkdown.css = styles

export default (() => CopyPageMarkdown) satisfies QuartzComponentConstructor


