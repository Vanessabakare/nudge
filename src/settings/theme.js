// ==========================================================
// theme
// Dark or light mode. The choice is remembered in the browser
// (localStorage). Storage can be blocked — private windows,
// strict settings — so every read and write is wrapped in
// try/catch, and the app simply falls back to dark.
// The same key is read by the small script in index.html, which
// applies the theme before the page first draws (no flash).
// ==========================================================

const storageKey = 'nudge-theme'
const defaultTheme = 'dark'

// The browser bar colour for each theme (matches --color-ink)
const browserBarColours = {
  dark: '#0e0d0c',
  light: '#f6f2ec',
}

// "dark" or "light": the saved choice, or dark if there isn't one
export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved === 'light' || saved === 'dark' ? saved : defaultTheme
  } catch {
    return defaultTheme
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(storageKey, theme)
  } catch {
    // Storage blocked: the theme still works, it just isn't remembered
  }
}

// Switches every colour token at once (see index.css)
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  const browserBar = document.querySelector('meta[name="theme-color"]')
  if (browserBar) {
    browserBar.setAttribute('content', browserBarColours[theme])
  }
}
