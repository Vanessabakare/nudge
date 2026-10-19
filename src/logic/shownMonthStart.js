// ==========================================================
// shownMonthStart
// The first day of the month the calendar grid is showing:
// the demo clock's month, moved monthOffset months forward
// (or back, if negative). Used by the month grid and by the
// desktop left column's "NOVEMBER 2026" subtitle.
// ==========================================================

export function shownMonthStart(nowIso, monthOffset) {
  const date = new Date(nowIso)
  return new Date(date.getFullYear(), date.getMonth() + monthOffset, 1)
}
