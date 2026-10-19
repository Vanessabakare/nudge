// ==========================================================
// userProfile
// The user's name, asked for on their first visit and kept in
// the browser (localStorage). Storage can be blocked, so every
// read and write is wrapped in try/catch.
//
// Later this will come from sign-in instead (Amazon Cognito,
// with Google or Microsoft accounts) — keep these function
// names so the rest of the app doesn't change. See FUTURE.md.
// ==========================================================

const storageKey = 'nudge-user-name'

// The name used when someone chooses SKIP
export const guestName = 'Guest'

const maxLength = 40

// The saved name, or null if this is a first visit
export function getUserName() {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved && saved.trim() ? saved : null
  } catch {
    return null
  }
}

// Tidies and saves a name; an empty name counts as Guest.
// Returns the name that was saved.
export function setUserName(name) {
  const tidy = (name || '').trim().replace(/\s+/g, ' ').slice(0, maxLength) || guestName
  try {
    localStorage.setItem(storageKey, tidy)
  } catch {
    // Storage blocked: the name still works until the page is closed
  }
  return tidy
}

export function isGuest(name) {
  return !name || name === guestName
}

// "Sam Okoro" -> "Sam" (empty for Guest), used in the greeting
export function firstNameOf(name) {
  return isGuest(name) ? '' : name.split(' ')[0]
}

// "Sam" -> "S" for the profile circle; a neutral dot for Guest
export function initialOf(name) {
  return isGuest(name) ? '·' : name.charAt(0).toUpperCase()
}
