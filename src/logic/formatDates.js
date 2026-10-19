// ==========================================================
// Date formatting helpers
// Turn ISO date strings into the short labels the screens use.
// All output is uppercase to suit the design.
// ==========================================================

// "2026-10-21T13:00:00.000Z" -> "21 OCT"
export function formatDayMonth(isoString) {
  const date = new Date(isoString)
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  return `${date.getDate()} ${month}`.toUpperCase()
}

// -> "WEDNESDAY"
export function formatWeekday(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase()
}

// Splits a time into its parts, e.g. 7:30pm -> { clock: "7:30", period: "PM" }
function timeParts(isoString) {
  const date = new Date(isoString)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const clockHour = hours % 12 === 0 ? 12 : hours % 12
  const clock = minutes === 0 ? `${clockHour}` : `${clockHour}:${String(minutes).padStart(2, '0')}`
  const period = hours < 12 ? 'AM' : 'PM'
  return { clock, period }
}

// -> "2:15PM"
export function formatClock(isoString) {
  const { clock, period } = timeParts(isoString)
  return `${clock}${period}`
}

// -> "WED 8AM" (used under each nudge in the tracker)
export function formatShortDayTime(isoString) {
  const date = new Date(isoString)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  return `${weekday} ${formatClock(isoString)}`
}

// -> "TUE 20 OCT · 2:15PM" (used by the demo clock)
export function formatDemoTime(isoString) {
  const date = new Date(isoString)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  return `${weekday} ${formatDayMonth(isoString)} · ${formatClock(isoString)}`
}

// How long from now until a moment -> "IN 40 MINUTES", "IN 5 HOURS", "IN 2 DAYS"
export function formatTimeUntil(nowIso, targetIso) {
  const minutes = Math.round((new Date(targetIso) - new Date(nowIso)) / 60000)
  if (minutes <= 0) return 'NOW'

  const plural = (count, word) => `IN ${count} ${word}${count === 1 ? '' : 'S'}`
  if (minutes < 60) return plural(minutes, 'MINUTE')
  if (minutes < 48 * 60) return plural(Math.round(minutes / 60), 'HOUR')
  return plural(Math.round(minutes / (24 * 60)), 'DAY')
}

// Start and end -> "7–9PM", or "11AM–1PM" when it crosses midday
export function formatTimeRange(startIso, endIso) {
  const start = timeParts(startIso)
  const end = timeParts(endIso)
  if (start.period === end.period) {
    return `${start.clock}–${end.clock}${end.period}`
  }
  return `${start.clock}${start.period}–${end.clock}${end.period}`
}
