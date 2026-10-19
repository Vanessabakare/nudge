// ==========================================================
// findLatestReminder
// Finds the most recently sent reminder that hasn't been dismissed,
// so the app can show it as a card.
// - Only each event's LATEST sent reminder counts: if the clock
//   skipped past "tomorrow" and "today", only "today" is shown.
// - Nothing is shown for an event that has already started.
// Returns { event, reminder } or null if none.
// ==========================================================

export function findLatestReminder(calendarEvents, now) {
  let latest = null

  for (const event of calendarEvents) {
    if (!event.reminders || new Date(event.startTime) <= new Date(now)) continue

    const sent = event.reminders.filter((reminder) => reminder.sentAt)
    const reminder = sent[sent.length - 1]
    if (!reminder || reminder.dismissed) continue

    if (!latest || new Date(reminder.sentAt) > new Date(latest.reminder.sentAt)) {
      latest = { event, reminder }
    }
  }

  return latest
}
