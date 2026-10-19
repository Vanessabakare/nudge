// ==========================================================
// planNudgeTimes
// Decides when Nudge should remind the user about an event.
// Returns up to three ISO time strings, earliest first.
//
// THE RULE, IN PLAIN ENGLISH
// 1. Work out when nudging may begin:
//    - normally 8am on the morning after the email arrived
//      (so nobody is nagged the moment an email lands);
//    - but if the event is less than 24 hours away, straight away.
// 2. Look only at waking hours (8am to 8pm) between that start
//    and the event, and imagine them laid end to end.
// 3. Place the three nudges at the start, halfway, and 85% of
//    the way through that waking time.
//    Because the spacing is proportional, an event nine days
//    away gets nudges days apart, while one tomorrow gets them
//    hours apart: closer events get tighter spacing.
// 4. Tidy up: round each time up to the next 5 minutes, and
//    drop any that would land at or after the event's start.
// ==========================================================

const wakingStartHour = 8 // 8am
const wakingEndHour = 20 // 8pm
const nudgeFractions = [0, 0.5, 0.85] // where each nudge sits in the waking time
const roundToMinutes = 5

const minuteInMs = 60 * 1000
const hourInMs = 60 * minuteInMs

// ---- Step 1: when may nudging begin? ----
function findNudgingStart(received, eventStart) {
  const hoursUntilEvent = (eventStart - received) / hourInMs
  if (hoursUntilEvent < 24) {
    return received
  }
  const nextMorning = new Date(received)
  nextMorning.setDate(nextMorning.getDate() + 1)
  nextMorning.setHours(wakingStartHour, 0, 0, 0)
  return nextMorning
}

// ---- Step 2: the waking-hour stretches between two moments ----
// Returns e.g. [{ start, end }, { start, end }], one per day.
function listWakingStretches(from, to) {
  const stretches = []
  const day = new Date(from)
  day.setHours(0, 0, 0, 0)

  while (day < to) {
    const dayStart = new Date(day)
    dayStart.setHours(wakingStartHour, 0, 0, 0)
    const dayEnd = new Date(day)
    dayEnd.setHours(wakingEndHour, 0, 0, 0)

    // Only the part of today's waking hours that falls inside from..to
    const start = new Date(Math.max(dayStart, from))
    const end = new Date(Math.min(dayEnd, to))
    if (start < end) {
      stretches.push({ start, end })
    }

    day.setDate(day.getDate() + 1)
  }
  return stretches
}

// ---- Step 3 helper: the real clock time a set number of waking
// minutes into the stretches ----
function timeAtWakingMinute(stretches, minutesIn) {
  let remaining = minutesIn
  for (const stretch of stretches) {
    const length = (stretch.end - stretch.start) / minuteInMs
    if (remaining <= length) {
      return new Date(stretch.start.getTime() + remaining * minuteInMs)
    }
    remaining -= length
  }
  return stretches[stretches.length - 1].end
}

// ---- Step 4 helper: round up to the next 5 minutes ----
function roundUp(date) {
  const step = roundToMinutes * minuteInMs
  return new Date(Math.ceil(date.getTime() / step) * step)
}

// ---- The main function ----
export function planNudgeTimes(emailReceivedAt, eventStartTime) {
  const received = new Date(emailReceivedAt)
  const eventStart = new Date(eventStartTime)

  // No point nudging about something that has already started
  if (eventStart <= received) {
    return []
  }

  const nudgingStart = findNudgingStart(received, eventStart)
  const stretches = listWakingStretches(nudgingStart, eventStart)
  const totalWakingMinutes = stretches.reduce(
    (total, stretch) => total + (stretch.end - stretch.start) / minuteInMs,
    0,
  )

  // No waking hours left before the event (e.g. a 6am event tomorrow
  // from an email at 10pm): nothing sensible to schedule
  if (totalWakingMinutes === 0) {
    return []
  }

  const times = []
  for (const fraction of nudgeFractions) {
    const time = roundUp(timeAtWakingMinute(stretches, fraction * totalWakingMinutes))
    const previous = times[times.length - 1]

    const isBeforeEvent = time < eventStart
    const isAfterPrevious = !previous || time > previous
    if (isBeforeEvent && isAfterPrevious) {
      times.push(time)
    }
  }

  return times.map((time) => time.toISOString())
}
