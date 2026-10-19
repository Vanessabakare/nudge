// ==========================================================
// planEventReminders
// Decides when to remind the user about an event that is already
// in their calendar. Returns up to three reminders, earliest first:
//   { type, scheduledFor, sentAt: null, dismissed: false }
//
// THE RULE, IN PLAIN ENGLISH
// - "dayBefore": 7pm the evening before.
// - "morningOf": 8am on the day — but not for events that start
//   before 9am (the evening-before reminder covers those).
// - "soon": just before it starts — 1 hour before for in-person
//   events (time to travel), 10 minutes before for virtual ones.
// - Never in the past, and never at or after the event's start.
// - If the morning reminder would land at or after the "soon" one
//   (e.g. a 9am event), it is dropped so the two don't double up.
// ==========================================================

const dayBeforeHour = 19 // 7pm
const morningOfHour = 8 // 8am
const earlyEventHour = 9 // events starting before 9am get no morning reminder
const soonMinutesInPerson = 60
const soonMinutesVirtual = 10

const minuteInMs = 60 * 1000

export function planEventReminders(event, now) {
  const start = new Date(event.startTime)
  const currentTime = new Date(now)

  // ---- 7pm the day before ----
  const dayBefore = new Date(start)
  dayBefore.setDate(dayBefore.getDate() - 1)
  dayBefore.setHours(dayBeforeHour, 0, 0, 0)

  // ---- 8am on the day ----
  const morningOf = new Date(start)
  morningOf.setHours(morningOfHour, 0, 0, 0)
  const startsEarly = start.getHours() < earlyEventHour

  // ---- Just before it starts ----
  const soonMinutes = event.isVirtual ? soonMinutesVirtual : soonMinutesInPerson
  const soon = new Date(start.getTime() - soonMinutes * minuteInMs)

  const candidates = [{ type: 'dayBefore', time: dayBefore }]
  if (!startsEarly && morningOf < soon) {
    candidates.push({ type: 'morningOf', time: morningOf })
  }
  candidates.push({ type: 'soon', time: soon })

  return candidates
    .filter(({ time }) => time > currentTime && time < start)
    .sort((a, b) => a.time - b.time)
    .map(({ type, time }) => ({
      type,
      scheduledFor: time.toISOString(),
      sentAt: null,
      dismissed: false,
    }))
}

// Gives an event its reminders (replacing any it had, e.g. after a move)
export function withReminders(event, now) {
  return { ...event, reminders: planEventReminders(event, now) }
}
