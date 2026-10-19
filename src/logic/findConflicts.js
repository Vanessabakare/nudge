// ==========================================================
// findConflicts
// Given a new event and the events already in the calendar,
// returns the calendar events whose times overlap the new one.
// Returns an empty array when there is no clash.
// ==========================================================

export function findConflicts(newEvent, calendarEvents) {
  const newStart = new Date(newEvent.startTime)
  const newEnd = new Date(newEvent.endTime)

  return calendarEvents.filter((calendarEvent) => {
    // An event can't clash with itself (e.g. once it has been added)
    if (calendarEvent.id === newEvent.id) {
      return false
    }

    const existingStart = new Date(calendarEvent.startTime)
    const existingEnd = new Date(calendarEvent.endTime)

    // Two events overlap when each one starts before the other ends.
    // Events that only touch (one ends at 3pm, the next starts at 3pm)
    // do not count as a clash.
    return newStart < existingEnd && existingStart < newEnd
  })
}
