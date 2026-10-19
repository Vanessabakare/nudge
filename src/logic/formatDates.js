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

// Start and end -> "7–9PM", or "11AM–1PM" when it crosses midday
export function formatTimeRange(startIso, endIso) {
  const start = timeParts(startIso)
  const end = timeParts(endIso)
  if (start.period === end.period) {
    return `${start.clock}–${end.clock}${end.period}`
  }
  return `${start.clock}${start.period}–${end.clock}${end.period}`
}
