// ==========================================================
// MonthGrid
// A month as a grid of square days drawn with thin 1px lines
// (phone and desktop). It opens on the demo clock's month; the
// ‹ › arrows move to earlier or later months (monthOffset).
// - Day numbers in the serif; past days faded; today underlined.
// - Days with events get a small off-white dot, or a terracotta
//   dot if two of that day's events clash.
// - Days with more than one event show the count in the corner.
// - A day holding only a proposed (not yet agreed) time gets a
//   hollow dashed marker instead of a dot.
// Clicking a marked day calls onSelectDay with that day.
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatMonthName, formatMonthYear } from '../logic/formatDates.js'
import { proposedPlaceholders } from '../logic/rescheduleStatus.js'
import { shownMonthStart } from '../logic/shownMonthStart.js'

const weekdayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// The days to draw for the month starting at monthStart: a list of Dates,
// with null for the empty squares before the 1st and after the last day,
// so that every row runs Monday to Sunday.
function buildMonthDays(monthStart) {
  const year = monthStart.getFullYear()
  const month = monthStart.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // getDay() counts from Sunday = 0; we want Monday = 0
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7

  const days = Array(firstWeekday).fill(null)
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }
  while (days.length % 7 !== 0) {
    days.push(null)
  }
  return days
}

export default function MonthGrid({ now, monthOffset = 0, calendarEvents, onSelectDay, onChangeMonth }) {
  const monthStart = shownMonthStart(now, monthOffset)
  const days = buildMonthDays(monthStart)
  const todayKey = new Date(now).toDateString()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-16 pb-32 animate-fade-in lg:mx-0 lg:max-w-none lg:px-16 lg:pt-14 lg:pb-20">
      {/* Phone: the small section heading, as on the inbox */}
      <p className="mb-10 text-[12px] uppercase tracking-[0.4em] text-paper lg:hidden">
        Calendar
      </p>

      {/* ---- The year with ‹ › to move between months, then the month name ---- */}
      <div className="flex items-center justify-between gap-6">
        <p className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
          {formatMonthYear(monthStart.toISOString()).split(' ')[1]}
        </p>
        <div className="flex shrink-0 border border-line">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            aria-label="Previous month"
            className="h-11 w-11 border-r border-line font-serif text-[24px] leading-none text-paper hover:bg-paper hover:text-ink lg:h-12 lg:w-12"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            aria-label="Next month"
            className="h-11 w-11 font-serif text-[24px] leading-none text-paper hover:bg-paper hover:text-ink lg:h-12 lg:w-12"
          >
            ›
          </button>
        </div>
      </div>
      <h2 className="mt-4 font-serif text-[clamp(3rem,15vw,4.5rem)] leading-none tracking-tight text-paper lg:text-[clamp(4rem,6vw,6.5rem)]">
        {formatMonthName(monthStart.toISOString())}
      </h2>

      {/* ---- Weekday headers ---- */}
      <div className="mt-10 grid grid-cols-7 pb-3 lg:mt-12 lg:pb-4">
        {weekdayHeaders.map((name) => (
          <p key={name} className="text-[12px] uppercase tracking-[0.2em] text-muted lg:text-[12px] lg:tracking-[0.35em]">
            {name}
          </p>
        ))}
      </div>

      {/* ---- The grid of days ---- */}
      <div className="grid grid-cols-7 border-t border-l border-line">
        {days.map((date, position) => {
          // An empty square before the 1st or after the last day
          if (!date) {
            return <div key={position} className="aspect-square border-r border-b border-line" />
          }

          const dayEvents = calendarEvents.filter(
            (event) => new Date(event.startTime).toDateString() === date.toDateString(),
          )
          const hasProposed = proposedPlaceholders(calendarEvents).some(
            (placeholder) => new Date(placeholder.startTime).toDateString() === date.toDateString(),
          )
          const hasEvents = dayEvents.length > 0
          const hasClash = dayEvents.some((event) => findConflicts(event, dayEvents).length > 0)
          const isToday = date.toDateString() === todayKey
          const isPast = date < startOfToday

          // What goes inside the square
          const squareContents = (
            <>
              {/* Day number, underlined if today */}
              <span
                className={
                  'font-serif text-[15px] leading-none text-paper lg:text-[clamp(1.25rem,1.8vw,2rem)] ' +
                  (isToday ? 'underline decoration-1 underline-offset-4 lg:underline-offset-[10px]' : '')
                }
              >
                {date.getDate()}
              </span>

              {/* Count, only when there is more than one event */}
              {dayEvents.length > 1 && (
                <span className="absolute top-1 right-1.5 text-[12px] text-muted lg:top-3 lg:right-3 lg:text-[12px] lg:tracking-[0.2em]">
                  {dayEvents.length}
                </span>
              )}

              {/* Hollow dashed marker: a proposed time, not yet agreed */}
              {!hasEvents && hasProposed && (
                <span className="absolute bottom-2 left-2 h-1.5 w-1.5 border border-dashed border-paper lg:bottom-4 lg:left-4 lg:h-2 lg:w-2" />
              )}

              {/* Dot: terracotta if there's a clash */}
              {hasEvents && (
                <span
                  className={
                    'absolute bottom-2 left-2 h-1 w-1 lg:bottom-4 lg:left-4 lg:h-1.5 lg:w-1.5 ' +
                    (hasClash ? 'bg-accent' : 'bg-paper')
                  }
                />
              )}
            </>
          )

          // Flex + items-start keeps the number at the top: buttons
          // otherwise centre their contents vertically
          const squareClasses =
            'relative flex h-full w-full items-start p-2 text-left lg:p-4 ' + (isPast ? 'opacity-35' : '')

          return (
            <div key={position} className="aspect-square border-r border-b border-line">
              {hasEvents || hasProposed ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(date.toISOString())}
                  aria-label={`${date.toDateString()}, ${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'}${hasProposed ? ', proposed time' : ''}`}
                  className={squareClasses + ' hover:bg-paper/[0.04]'}
                >
                  {squareContents}
                </button>
              ) : (
                <div className={squareClasses}>{squareContents}</div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
