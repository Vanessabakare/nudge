// ==========================================================
// respondToNudge
// Records the user's answer to an event: "add" or "dismiss".
// Returns an UPDATED COPY of the event — it never changes the
// original. Putting the event into the calendar is the caller's
// job, so this function stays simple and easy to test.
// ==========================================================

const statusForResponse = {
  add: 'added',
  dismiss: 'dismissed',
}

export function respondToNudge(event, response) {
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
