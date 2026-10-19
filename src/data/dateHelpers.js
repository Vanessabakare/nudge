// ==========================================================
// Date helpers for the fake data
// Every sample date is worked out relative to "now", so the
// demo looks right whatever day it is run on.
// ==========================================================

// A date N days from today at a set time (local time), as an ISO string.
// Example: daysFromNow(2, 14) -> the day after tomorrow at 2:00pm
export function daysFromNow(days, hour, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

// A moment earlier TODAY, as an ISO string — always after midnight
// and before now, whatever time it is.
// Normally it is idealMinutesAgo minutes ago. If it's so early in the
// day that this would cross midnight, it is placed shareOfToday of the
// way back towards midnight instead (e.g. 0.5 = halfway).
// Example at 3pm: earlierToday(25, 0.15) -> 2:35pm
// Example at 1:00am: earlierToday(150, 0.6) -> 12:24am
export function earlierToday(idealMinutesAgo, shareOfToday) {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(0, 0, 0, 0)
  const minutesSinceMidnight = (now - midnight) / 60000
  const minutesAgo = Math.min(idealMinutesAgo, minutesSinceMidnight * shareOfToday)
  return new Date(now.getTime() - minutesAgo * 60000).toISOString()
}

// A moment N hours before now, as an ISO string.
// Used for when each email arrived.
export function hoursAgo(hours) {
  const date = new Date()
  date.setTime(date.getTime() - hours * 60 * 60 * 1000)
  return date.toISOString()
}
