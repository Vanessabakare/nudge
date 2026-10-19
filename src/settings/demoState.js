// ==========================================================
// demoState
// Anything saved in the browser for the demo uses keys that
// start with "nudge-demo". RESET DEMO (and opening the site with
// ?reset) clears them, so the demo always starts fresh.
// Right now the demo saves nothing, so this is a safety net;
// the theme choice ("nudge-theme") is a preference and is kept.
// ==========================================================

const demoKeyPrefix = 'nudge-demo'

export function clearSavedDemoState() {
  try {
    const demoKeys = Object.keys(localStorage).filter((key) => key.startsWith(demoKeyPrefix))
    demoKeys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage blocked: there is nothing saved to clear
  }
}

// True when the page was opened with ?reset in the address.
// Also tidies the address afterwards, so a refresh doesn't reset again.
export function takeResetRequestFromUrl() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('reset')) {
    return false
  }
  url.searchParams.delete('reset')
  window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  return true
}
