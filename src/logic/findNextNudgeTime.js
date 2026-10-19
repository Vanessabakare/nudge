// ==========================================================
// findNextNudgeTime
// The time of the next nudge OR reminder still to be sent, or null
// if there isn't one:
// - nudges for events waiting for an answer
// - reminders for events in the calendar that haven't started
// Used by the demo's SKIP TO NEXT NUDGE control, so the presenter
// can always jump straight to the next card, whatever the time.
// ==========================================================
import { isWaitingForAnswer } from './statusLabel.js'

export function findNextNudgeTime(events, calendarEvents, now) {
  const currentTime = new Date(now)

  const nudgeTimes = events
    .filter(isWaitingForAnswer)
    .flatMap((event) => event.nudges)
    .filter((nudge) => !nudge.sentAt)
    .map((nudge) => nudge.scheduledFor)

  const reminderTimes = calendarEvents
    .filter((event) => new Date(event.startTime) > currentTime)
    .flatMap((event) => event.reminders || [])
    .filter((reminder) => !reminder.sentAt)
    .map((reminder) => reminder.scheduledFor)

  const upcoming = [...nudgeTimes, ...reminderTimes]
    .filter((time) => new Date(time) > currentTime)
    .sort((a, b) => new Date(a) - new Date(b))

  return upcoming[0] || null
}
