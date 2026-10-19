// ==========================================================
// CalendarView
// An agenda of 14 days, showing only days that have events.
// Each day: the date large in the serif, then its events in
// the numbered |01| style. Events added through Nudge are
// labelled VIA NUDGE; events that overlap on the same day are
// both labelled CLASH in the accent colour.
//
// Opened from the month grid (phone and desktop), starting on
// the picked day, with a "← MONTH" link back to the grid (onBack).
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatDayMonth, formatTimeRange, formatWeekday } from '../logic/formatDates.js'
import BackLink from './BackLink.jsx'

const daysToShow = 14

// Turns 0 into "01", 4 into "05", and so on.
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

// A key for the calendar day an event falls on, e.g. "Thu Oct 22 2026"
function dayKey(isoString) {
  return new Date(isoString).toDateString()
}

// Picks the events in the 14 days from the start of the given day,
// sorts them by time, and groups them by day:
// [{ key, events: [...] }, ...]
function groupByDay(calendarEvents, fromIso) {
  const windowStart = new Date(fromIso)
  windowStart.setHours(0, 0, 0, 0)
  const windowEnd = new Date(windowStart)
  windowEnd.setDate(windowEnd.getDate() + daysToShow)

  const upcoming = calendarEvents
    .filter((event) => {
      const start = new Date(event.startTime)
      return start >= windowStart && start < windowEnd
    })
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  const days = []
  for (const event of upcoming) {
    const key = dayKey(event.startTime)
    const lastDay = days[days.length - 1]
    if (lastDay && lastDay.key === key) {
      lastDay.events.push(event)
    } else {
      days.push({ key, events: [event] })
    }
  }
  return days
}

// "now" is the day the agenda starts from
export default function CalendarView({ calendarEvents, now, onOpenEvent, onBack }) {
  const days = groupByDay(calendarEvents, now)

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-32 animate-fade-in lg:mx-0 lg:max-w-3xl lg:px-16 lg:pt-14 lg:pb-20">
      {/* ---- Back to the month grid ---- */}
      <BackLink desktopLabel="Month" phoneLabel="Month" onClick={onBack} />
      <p className="mt-6 text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
        {daysToShow} days from {formatDayMonth(now)}
      </p>

      {/* ---- Empty state ---- */}
      {days.length === 0 && (
        <p className="mt-40 text-center text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[13px]">
          Nothing planned.
        </p>
      )}

      {/* ---- One section per day ---- */}
      {days.map((day) => {
        const firstEvent = day.events[0]
        return (
          <section key={day.key} className="mt-16">
            <p className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
              {formatWeekday(firstEvent.startTime)}
            </p>
            <h3 className="mt-2 font-serif text-[clamp(3rem,15vw,4.5rem)] leading-none tracking-tight text-paper lg:text-[5.5rem]">
              {formatDayMonth(firstEvent.startTime)}
            </h3>

            <ol className="mt-8 border-b border-line">
              {day.events.map((event, position) => {
                const hasClash = findConflicts(event, day.events).length > 0
                const isViaNudge = Boolean(event.sourceEmailId)

                return (
                  <li key={event.id} className="border-t border-line">
                    <button
                      type="button"
                      onClick={() => onOpenEvent(event)}
                      className="flex w-full gap-5 py-6 text-left lg:gap-6 lg:py-7 lg:hover:bg-paper/[0.03]"
                    >
                      {/* Index number, e.g. |01| */}
                      <span className="w-9 shrink-0 pt-px text-[12px] tracking-[0.2em] text-muted lg:w-12 lg:text-[12px]">
                        |{formatIndex(position)}|
                      </span>

                      <div className="min-w-0">
                        {/* Time */}
                        <p className="text-[12px] uppercase tracking-[0.35em] text-muted lg:text-[12px]">
                          {formatTimeRange(event.startTime, event.endTime)}
                        </p>

                        {/* Title */}
                        <p className="mt-2 text-[13px] uppercase leading-relaxed tracking-[0.15em] text-paper lg:text-[15px]">
                          {event.title}
                        </p>

                        {/* Location */}
                        <p className="mt-1 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[12px]">
                          {event.location}
                        </p>

                        {/* Labels, only when they apply */}
                        {(isViaNudge || hasClash) && (
                          <div className="mt-4 flex gap-2">
                            {isViaNudge && (
                              <span className="border border-paper/50 px-2 py-1 text-[12px] uppercase tracking-[0.35em] text-paper lg:text-[12px]">
                                Via Nudge
                              </span>
                            )}
                            {hasClash && (
                              <span className="border border-accent px-2 py-1 text-[12px] uppercase tracking-[0.35em] text-accent lg:text-[12px]">
                                Clash
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </main>
  )
}
