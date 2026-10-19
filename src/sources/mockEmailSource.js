// ==========================================================
// mockEmailSource
// The "doorway" Nudge uses to get emails. For the demo it
// hands back hard-coded sample emails. Later, gmailEmailSource.js
// will offer the same getEmails() function and return the same
// shape, so nothing else in the app needs to change.
// ==========================================================
import { buildSampleEmails } from '../data/sampleEmails.js'

// Returns a Promise of an array of emails, newest first.
// It is async because the real Gmail version will have to wait
// for the network; keeping the fake async too makes the swap painless.
export async function getEmails() {
  return buildSampleEmails().sort(
    (a, b) => new Date(b.receivedAt) - new Date(a.receivedAt),
  )
}
