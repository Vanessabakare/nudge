// ==========================================================
// MonthGrid
// Desktop only: the month that contains the demo clock's "now",
// as a grid of square days drawn with thin 1px lines.
// - Day numbers in the serif; past days faded; today underlined.
// - Days with events get a small off-white dot, or a terracotta
//   dot if two of that day's events clash.
// - Days with more than one event show the count in the corner.
// Clicking a marked day calls onSelectDay with that day.
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatMonthName } from '../logic/formatDates.js'

const weekdayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// The days to draw for the month containing "now": a list of Dates,
// with null for the empty squares before the 1st and after the last day,
// so that every row runs Monday to Sunday.
function buildMonthDays(nowIso) {
  const now = new Date(nowIso)
  const year = now.getFullYear()
  const month = now.getMonth()
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

export default function MonthGrid({ now, calendarEvents, onSelectDay }) {
  const days = buildMonthDays(now)
  const todayKey = new Date(now).toDateString()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  // ---- Layout ----
  return (
    <main className="px-16 pt-14 pb-20 animate-fade-in">
      {/* ---- Month name ---- */}
      <h2 className="font-serif text-[clamp(4rem,6vw,6.5rem)] leading-none tracking-tight text-paper">
        {formatMonthName(now)}
      </h2>

      {/* ---- Weekday headers ---- */}
      <div className="mt-12 grid grid-cols-7 pb-4">
        {weekdayHeaders.map((name) => (
          <p key={name} className="text-[12px] uppercase tracking-[0.35em] text-muted">
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
                  'font-serif text-[clamp(1.25rem,1.8vw,2rem)] leading-none text-paper ' +
                  (isToday ? 'underline decoration-1 underline-offset-[10px]' : '')
                }
              >
                {date.getDate()}
              </span>

              {/* Count, only when there is more than one event */}
              {dayEvents.length > 1 && (
                <span className="absolute top-3 right-3 text-[12px] tracking-[0.2em] text-muted">
                  {dayEvents.length}
                </span>
              )}

              {/* Dot: terracotta if there's a clash */}
              {hasEvents && (
                <span
                  className={
                    'absolute bottom-4 left-4 h-1.5 w-1.5 ' + (hasClash ? 'bg-accent' : 'bg-paper')
                  }
                />
              )}
            </>
          )

          // Flex + items-start keeps the number at the top: buttons
          // otherwise centre their contents vertically
          const squareClasses =
            'relative flex h-full w-full items-start p-4 text-left ' + (isPast ? 'opacity-35' : '')

          return (
            <div key={position} className="aspect-square border-r border-b border-line">
              {hasEvents ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(date.toISOString())}
                  aria-label={`${date.toDateString()}, ${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'}`}
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
