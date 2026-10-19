// ==========================================================
// mockEmailSender
// The "doorway" Nudge uses to send an email. For the demo it
// pretends: it waits a moment (like a real network call) and
// hands back an id. Nothing actually leaves the browser.
//
// Later, gmailEmailSender.js / outlookEmailSender.js will offer
// the same sendEmail({ to, subject, body }) and return the same
// shape, so nothing else in the app needs to change.
// The app keeps the list of sent emails itself (in App state).
// See FUTURE.md for how to make this real.
// ==========================================================

const pretendNetworkDelayMs = 900

let sentCount = 0

// Returns a Promise of { id }
export async function sendEmail({ to, subject, body }) {
  if (!to) {
    throw new Error('An email needs someone to send it to')
  }
  if (!subject || !body) {
    throw new Error('An email needs a subject and a message')
  }

  await new Promise((resolve) => setTimeout(resolve, pretendNetworkDelayMs))

  sentCount += 1
  return { id: `mock-sent-${sentCount}` }
}
