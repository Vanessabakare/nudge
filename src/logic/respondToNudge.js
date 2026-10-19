// ==========================================================
// respondToNudge
// Records the user's answer to an event:
//   "add"     -> status "added"
//   "dismiss" -> status "dismissed"
//   "ignore"  -> NOT NOW: nothing is recorded (an ignored nudge
//                keeps response: null). But if every nudge has
//                now been sent and ignored, Nudge lets the event
//                go: status "expired".
// Returns an UPDATED COPY of the event — it never changes the
// original. Putting the event into the calendar is the caller's
// job, so this function stays simple and easy to test.
// ==========================================================

const statusForResponse = {
  add: 'added',
  dismiss: 'dismissed',
}

export function respondToNudge(event, response) {
  // ---- NOT NOW ----
  if (response === 'ignore') {
    const allSent = event.nudges.length > 0 && event.nudges.every((nudge) => nudge.sentAt)
    return allSent ? { ...event, status: 'expired' } : event
  }

  // ---- ADD or NOT FOR ME ----
  const newStatus = statusForResponse[response]
  if (!newStatus) {
    throw new Error(`Unknown response: ${response}`)
  }

  // If a nudge has been sent and is still waiting for an answer,
  // record the answer on that nudge.
  const nudges = event.nudges.map((nudge) => ({ ...nudge }))
  const waitingNudge = nudges.findLast(
    (nudge) => nudge.sentAt && nudge.response === null,
  )
  if (waitingNudge) {
    waitingNudge.response = response
  }

  return { ...event, status: newStatus, nudges }
}
