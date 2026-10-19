// ==========================================================
// checkNudges
// Given all events and the current time, "sends" any nudge
// whose time has come, and moves each event's status along:
//   spotted -> nudged   once its first nudge has been sent
//   -> expired          once the event starts with no answer
// Returns a NEW array of events; the originals are not changed.
//
// The other route to "expired" — all nudges sent and the last
// one ignored with NOT NOW — happens in respondToNudge, because
// it is triggered by the user, not by the clock.
// ==========================================================

// Only events still waiting for an answer are affected
const waitingStatuses = ['spotted', 'nudged']

export function checkNudges(events, now) {
  const currentTime = new Date(now)

  return events.map((event) => {
    if (!waitingStatuses.includes(event.status)) {
      return event
    }

    // ---- Send any nudge whose time has passed ----
    // sentAt is set to the time it was due, as if sent on time
    const nudges = event.nudges.map((nudge) => {
      const isDue = new Date(nudge.scheduledFor) <= currentTime
      if (isDue && !nudge.sentAt) {
        return { ...nudge, sentAt: nudge.scheduledFor }
      }
      return nudge
    })

    // ---- Work out the new status ----
    let status = event.status
    if (nudges.some((nudge) => nudge.sentAt)) {
      status = 'nudged'
    }
    if (new Date(event.startTime) <= currentTime) {
      status = 'expired'
    }

    return { ...event, nudges, status }
  })
}
