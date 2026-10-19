// ==========================================================
// checkReminders
// Given the calendar and the current time, "sends" any reminder
// whose time has come (sets sentAt, as if sent on time).
// Returns a NEW array of events; the originals are not changed.
// The partner of checkNudges, for events already in the calendar.
// ==========================================================

export function checkReminders(calendarEvents, now) {
  const currentTime = new Date(now)

  return calendarEvents.map((event) => {
    if (!event.reminders) return event

    const reminders = event.reminders.map((reminder) => {
      const isDue = new Date(reminder.scheduledFor) <= currentTime
      return isDue && !reminder.sentAt ? { ...reminder, sentAt: reminder.scheduledFor } : reminder
    })
    return { ...event, reminders }
  })
}
