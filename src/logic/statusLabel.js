// ==========================================================
// statusLabel
// The short label shown for an event, based on its status,
// e.g. "Event spotted", "Nudge 2 of 3", "Added".
// Shared by the inbox and the home screen.
// ==========================================================

// Is the event still waiting for the user to answer?
export function isWaitingForAnswer(event) {
  return event.status === 'spotted' || event.status === 'nudged'
}

export function statusLabel(event) {
  if (event.status === 'added') return 'Added'
  if (event.status === 'dismissed') return 'Dismissed'
  if (event.status === 'expired') return 'Expired'
  if (event.status === 'nudged') {
    const sentCount = event.nudges.filter((nudge) => nudge.sentAt).length
    return `Nudge ${sentCount} of ${event.nudges.length}`
  }
  return 'Event spotted'
}
