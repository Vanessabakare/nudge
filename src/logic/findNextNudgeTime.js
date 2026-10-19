// ==========================================================
// findNextNudgeTime
// The time of the next nudge still to be sent, across all events
// waiting for an answer — or null if there isn't one.
// Used by the demo's SKIP TO NEXT NUDGE control, so the presenter
// can always jump straight to the next nudge, whatever the time.
// ==========================================================
import { isWaitingForAnswer } from './statusLabel.js'

export function findNextNudgeTime(events, now) {
  const upcoming = events
    .filter(isWaitingForAnswer)
    .flatMap((event) => event.nudges)
    .filter((nudge) => !nudge.sentAt && new Date(nudge.scheduledFor) > new Date(now))
    .map((nudge) => nudge.scheduledFor)
    .sort((a, b) => new Date(a) - new Date(b))

  return upcoming[0] || null
}
