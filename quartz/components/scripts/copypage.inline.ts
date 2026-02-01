const svgCopy =
  '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>'
const svgCheck =
  '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>'

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for mobile browsers
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.cssText = "position:fixed;left:-9999px;top:0"
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  }
}

async function copyPageMarkdown(slug: string): Promise<boolean> {
  try {
    const llmsUrl = slug === "index" ? `/llms-full.txt` : `/${slug}/llms.txt`
    const response = await fetch(llmsUrl)
    if (!response.ok) return false
    return copyToClipboard(await response.text())
  } catch {
    return false
  }
}

function getLlmsUrl(slug: string): string {
  // Use full blog content for home page, individual page content otherwise
  const path = slug === "index" ? `/llms-full.txt` : `/${slug}/llms.txt`
  return `${window.location.origin}${path}`
}

document.addEventListener("nav", () => {
  const containers = document.querySelectorAll<HTMLElement>(".copy-page-container")

  containers.forEach((container) => {
    const mainButton = container.querySelector<HTMLButtonElement>(".copy-page-button")
    const dropdown = container.querySelector<HTMLElement>(".copy-page-dropdown")
    const copyBtn = container.querySelector<HTMLButtonElement>(".copy-markdown-btn")
    const honchoLink = container.querySelector<HTMLAnchorElement>(".honcho-link")
    const chatgptLink = container.querySelector<HTMLAnchorElement>(".chatgpt-link")
    const claudeLink = container.querySelector<HTMLAnchorElement>(".claude-link")
    const textSpan = mainButton?.querySelector<HTMLElement>(".copy-page-text")
    const iconSpan = mainButton?.querySelector("svg:first-child")

    if (!mainButton || !dropdown || !copyBtn) return

    const slug = mainButton.dataset.slug || ""
    const llmsUrl = getLlmsUrl(slug)

    // Set the correct hrefs for Honcho, ChatGPT and Claude links
    if (honchoLink) {
      const prompt = `Read this page and answer questions about it: ${llmsUrl}`
      honchoLink.href = `https://honcho.chat/?hints=search&q=${encodeURIComponent(prompt)}`
    }
    if (chatgptLink) {
      const prompt = `Read this page and answer questions about it: ${llmsUrl}`
      chatgptLink.href = `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`
    }
    if (claudeLink) {
      const prompt = `Read this page and answer questions about it: ${llmsUrl}`
      claudeLink.href = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
    }

    // Toggle dropdown on main button click
    function toggleDropdown(e: MouseEvent) {
      e.stopPropagation()
      const isOpen = dropdown!.classList.contains("show")
      // Close all other dropdowns first
      document.querySelectorAll(".copy-page-dropdown.show").forEach((d) => {
        if (d !== dropdown) d.classList.remove("show")
      })
      dropdown!.classList.toggle("show", !isOpen)
    }

    // Copy markdown from dropdown button
    async function handleCopy(e: MouseEvent) {
      e.stopPropagation()
      const success = await copyPageMarkdown(slug)
      if (success && textSpan && iconSpan) {
        const isHomePage = slug === "index"
        const originalText = isHomePage ? "Copy all blog content" : "Copy page"

        textSpan.textContent = "Copied!"
        iconSpan.outerHTML = svgCheck
        dropdown!.classList.remove("show")

        setTimeout(() => {
          textSpan.textContent = originalText
          const newIcon = mainButton!.querySelector("svg:first-child")
          if (newIcon) {
            newIcon.outerHTML = svgCopy
          }
        }, 2000)
      }
    }

    // Close dropdown when clicking outside
    function closeDropdown(e: MouseEvent) {
      if (!container.contains(e.target as Node)) {
        dropdown!.classList.remove("show")
      }
    }

    mainButton.addEventListener("click", toggleDropdown)
    copyBtn.addEventListener("click", handleCopy)
    document.addEventListener("click", closeDropdown)

    window.addCleanup(() => {
      mainButton.removeEventListener("click", toggleDropdown)
      copyBtn.removeEventListener("click", handleCopy)
      document.removeEventListener("click", closeDropdown)
    })
  })
})



