// ==========================================================
// findFreeSlots
// Finds free times to move an event to.
//
// THE RULE, IN PLAIN ENGLISH
// - Look at the next 7 days, starting from "now".
// - Only look inside sensible hours:
//     social events (dinners, drinks): 6pm–9pm
//     work-type events (meetings):      9am–5pm
// - Walk through each day in 30-minute steps. A slot is free
//   if it starts after "now", ends inside those hours, and does
//   not overlap anything in the calendar.
// - Take the FIRST free slot on each day, so the choices are
//   genuinely different (not 6:00, 6:30 and 7:00 on one evening).
// - Stop once 3 slots have been found.
// Returns [{ startTime, endTime }] as ISO strings, soonest first.
// ==========================================================
import { findConflicts } from './findConflicts.js'

const minuteInMs = 60 * 1000

// Sensible hours for each kind of event (24-hour clock)
const hoursByKind = {
  social: { startHour: 18, endHour: 21 },
  work: { startHour: 9, endHour: 17 },
}

// A simple guess: things that start at 5pm or later are social
export function slotKindFor(event) {
  return new Date(event.startTime).getHours() >= 17 ? 'social' : 'work'
}

export function findFreeSlots(calendarEvents, durationMinutes, options = {}) {
  const {
    from = new Date().toISOString(), // when to start looking (the demo clock's "now")
    kind = 'work', // "social" or "work"
    days = 7, // how far ahead to look
    count = 3, // how many slots to return
    stepMinutes = 30, // how finely to check start times
  } = options

  const { startHour, endHour } = hoursByKind[kind]
  const earliest = new Date(from)
  const slots = []

  for (let dayOffset = 0; dayOffset < days && slots.length < count; dayOffset++) {
    // This day's window, e.g. 6pm–9pm
    const windowStart = new Date(earliest)
    windowStart.setDate(windowStart.getDate() + dayOffset)
    windowStart.setHours(startHour, 0, 0, 0)
    const windowEnd = new Date(windowStart)
    windowEnd.setHours(endHour, 0, 0, 0)

    // Try each start time in the window until one is free
    for (
      let start = new Date(windowStart);
      start.getTime() + durationMinutes * minuteInMs <= windowEnd.getTime();
      start = new Date(start.getTime() + stepMinutes * minuteInMs)
    ) {
      if (start < earliest) continue // already in the past

      const candidate = {
        startTime: start.toISOString(),
        endTime: new Date(start.getTime() + durationMinutes * minuteInMs).toISOString(),
      }
      if (findConflicts(candidate, calendarEvents).length === 0) {
        slots.push(candidate)
        break // one slot per day
      }
    }
  }

  return slots
}
