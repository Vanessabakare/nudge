// ==========================================================
// rescheduleStatus
// When Nudge asks someone to move an event, the calendar event
// carries a "reschedule" state until it is settled:
//   reschedule: {
//     status,          // "proposed" | "accepted" | "declined"
//     proposedSlot,    // { startTime, endTime } that was asked for
//     sentEmailId,     // the email that asked
//     contactName,     // who was asked, e.g. "Ama"
//     forEventId,      // the new event that caused the clash
//     declinedSlots,   // slots already turned down (never offered again)
//     replyEmailId,    // their reply, once it arrives
//   }
// The event does NOT move until the other person agrees and the
// user taps UPDATE CALENDAR. These helpers read that state.
// ==========================================================

// Still waiting for things to settle (asked, or agreed but not yet updated)
export function isReschedulePending(calendarEvent) {
  const status = calendarEvent.reschedule?.status
  return status === 'proposed' || status === 'accepted'
}

// The status line shown on the event, or null if there isn't one
export function rescheduleLabel(calendarEvent) {
  const reschedule = calendarEvent.reschedule
  if (!reschedule) return null
  const name = reschedule.contactName || 'them'
  if (reschedule.status === 'proposed') return `Reschedule proposed · awaiting ${name}`
  if (reschedule.status === 'accepted') return `${name} agreed · update your calendar`
  if (reschedule.status === 'declined') return `${name} can't make it`
  return null
}

// Does a clash involve an event whose reschedule is pending?
// (Used to show "CLASH · RESCHEDULE PENDING" instead of plain "CLASH".)
export function isClashPending(conflictingEvents) {
  return conflictingEvents.some(isReschedulePending)
}

// Tentative placeholders for proposed times, shown in the calendar
// with a dashed border. They are display-only: never part of clash checks.
export function proposedPlaceholders(calendarEvents) {
  return calendarEvents.filter(isReschedulePending).map((event) => ({
    ...event,
    id: `${event.id}-proposed`,
    placeholderFor: event.id,
    startTime: event.reschedule.proposedSlot.startTime,
    endTime: event.reschedule.proposedSlot.endTime,
    isPlaceholder: true,
  }))
}
