import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title

  return (
    <div class="page-title-wrapper">
      {/* Desktop Logo (stacked) */}
      <img src="/logo.png" alt="Site Logo" class="page-title-logo-desktop" />

      {/* Title */}
      <h2 class={classNames(displayClass, "page-title")}>
        <a href="/" class="page-title-link">
          {/* Mobile Logo (inline) */}
          <img src="/logo.png" alt="Site Logo" class="page-title-logo-mobile" />
          {title}
        </a>
      </h2>
    </div>
  )
}

PageTitle.css = `
.page-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

/* Desktop stacked logo */
.page-title-logo-desktop {
  width: 110px;
  height: auto;
  border-radius: 12px;
}

/* Title */
.page-title {
  font-size: 1.55rem;
  margin: 0;
  font-family: var(--titleFont);
  text-align: center;
}

/* Mobile inline layout */
.page-title-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Hidden on desktop */
.page-title-logo-mobile {
  display: none;
}

/* 📱 Mobile Rules */
@media (max-width: 600px) {
  /* Hide big logo */
  .page-title-logo-desktop {
    display: none;
  }

  /* Show small inline logo */
  .page-title-logo-mobile {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 6px;
  }

  /* Make title smaller and align with logo */
  .page-title {
    font-size: 0.9rem;
    text-align: left;
  }

  /* Slight spacing tweak */
  .page-title-wrapper {
    margin-top: 0.4rem;
  }
}
`


export default (() => PageTitle) satisfies QuartzComponentConstructor
