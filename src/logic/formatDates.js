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

// When an email arrived, relative to now (used in the desktop inbox):
// today -> "9:12 AM", the day before -> "YESTERDAY",
// this past week -> "SAT", older -> "12 OCT"
export function formatReceived(nowIso, receivedIso) {
  const startOfToday = new Date(nowIso)
  startOfToday.setHours(0, 0, 0, 0)
  const startOfReceivedDay = new Date(receivedIso)
  startOfReceivedDay.setHours(0, 0, 0, 0)
  const daysAgo = Math.round((startOfToday - startOfReceivedDay) / (24 * 60 * 60 * 1000))

  if (daysAgo <= 0) {
    const { clock, period } = timeParts(receivedIso)
    return `${clock} ${period}`
  }
  if (daysAgo === 1) return 'YESTERDAY'
  if (daysAgo < 7) {
    return new Date(receivedIso).toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  }
  return formatDayMonth(receivedIso)
}

// -> "Monday 19 October" (as written; used large in the serif on Home)
export function formatLongDate(isoString) {
  const date = new Date(isoString)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' })
  const month = date.toLocaleDateString('en-GB', { month: 'long' })
  return `${weekday} ${date.getDate()} ${month}`
}

// -> "TUE 20 OCT"
export function formatShortDate(isoString) {
  const date = new Date(isoString)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()
  return `${weekday} ${formatDayMonth(isoString)}`
}

// When an email arrived, short and in sentence case (the phone inbox):
// today -> "9:12" (24-hour clock), the day before -> "Yesterday",
// this past week -> "Sun", older -> "12 Oct"
export function formatReceivedShort(nowIso, receivedIso) {
  const startOfToday = new Date(nowIso)
  startOfToday.setHours(0, 0, 0, 0)
  const received = new Date(receivedIso)
  const startOfReceivedDay = new Date(received)
  startOfReceivedDay.setHours(0, 0, 0, 0)
  const daysAgo = Math.round((startOfToday - startOfReceivedDay) / (24 * 60 * 60 * 1000))

  if (daysAgo <= 0) {
    return `${received.getHours()}:${String(received.getMinutes()).padStart(2, '0')}`
  }
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return received.toLocaleDateString('en-GB', { weekday: 'short' })
  return received.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// -> "October" (the month name, as written; used large in the serif)
export function formatMonthName(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', { month: 'long' })
}

// -> "OCTOBER 2026"
export function formatMonthYear(isoString) {
  return new Date(isoString)
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    .toUpperCase()
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
