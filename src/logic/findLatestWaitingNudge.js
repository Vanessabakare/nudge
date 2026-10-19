// ==========================================================
// findLatestWaitingNudge
// Finds the most recently sent nudge that is still waiting for
// an answer, so the app can show it as a nudge card.
// - Only each event's LATEST sent nudge counts; older ones have
//   been replaced by it.
// - Nudges the user has already closed are skipped
//   (closedNudges holds their keys, e.g. "event-001-nudge-2").
// Returns { key, event, nudgeNumber, sentAt } or null if none.
// ==========================================================

export function findLatestWaitingNudge(events, closedNudges) {
  let latest = null

  for (const event of events) {
    if (event.status !== 'nudged') continue

    // This event's most recent sent nudge
    const sentCount = event.nudges.filter((nudge) => nudge.sentAt).length
    const nudge = event.nudges[sentCount - 1]
    const key = `${event.id}-nudge-${sentCount}`

    const isWaiting = nudge && nudge.response === null
    if (!isWaiting || closedNudges.includes(key)) continue

    if (!latest || new Date(nudge.sentAt) > new Date(latest.sentAt)) {
      latest = { key, event, nudgeNumber: sentCount, sentAt: nudge.sentAt }
    }
  }

  return latest
}
