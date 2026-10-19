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

// A moment N hours before now, as an ISO string.
// Used for when each email arrived.
export function hoursAgo(hours) {
  const date = new Date()
  date.setTime(date.getTime() - hours * 60 * 60 * 1000)
  return date.toISOString()
}
