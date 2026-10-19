// ==========================================================
// HomeScreen
// The first screen after the splash. From top to bottom:
// - a top bar: the small "Nudge" wordmark and a round profile
//   button (it will open Settings in a later step)
// - a greeting for the time of day, and today's date, large
// - NEXT UP: the next event in the calendar
// - NEEDS YOUR ANSWER: events still waiting for ADD or NOT FOR ME
// - a folded inbox bar that opens the Inbox tab
// "Today" and "now" always come from the demo clock.
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatLongDate, formatShortDate, formatTimeRange } from '../logic/formatDates.js'
import { isWaitingForAnswer, statusLabel } from '../logic/statusLabel.js'

// Turns 0 into "01", 4 into "05", and so on.
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

// "Good morning" before noon, "Good afternoon" until 6pm, then "Good evening"
function greetingFor(isoString) {
  const hour = new Date(isoString).getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// The small section headings, e.g. NEXT UP
function SectionHeading({ children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">{children}</h2>
  )
}

// One numbered row: index, a time line, the title, and optional extras
function EventRow({ position, timeLine, title, onClick, children }) {
  return (
    <li className="border-t border-line">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full gap-5 py-6 text-left lg:gap-6 lg:py-7 lg:hover:bg-paper/[0.03]"
      >
        <span className="w-9 shrink-0 pt-px text-[11px] tracking-[0.2em] text-muted lg:w-12 lg:text-[12px]">
          |{formatIndex(position)}|
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted lg:text-[12px]">{timeLine}</p>
          <p className="mt-2 text-[13px] uppercase leading-relaxed tracking-[0.15em] text-paper lg:text-[15px]">
            {title}
          </p>
          {children}
        </div>
      </button>
    </li>
  )
}

export default function HomeScreen({
  now,
  events,
  calendarEvents,
  emailCount,
  onOpenEvent,
  onOpenCalendarEvent,
  onShowInbox,
}) {
  // ---- The next calendar event that hasn't started yet ----
  const nextUp = calendarEvents
    .filter((event) => new Date(event.startTime) > new Date(now))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0]

  // ---- Events still waiting for an answer, soonest first ----
  const waiting = events
    .filter(isWaitingForAnswer)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  // "TUE 20 OCT · 7:30–8:30AM"
  const timeLineFor = (event) =>
    `${formatShortDate(event.startTime)} · ${formatTimeRange(event.startTime, event.endTime)}`

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-8 pb-32 animate-fade-in lg:mx-0 lg:max-w-4xl lg:px-16 lg:pt-12 lg:pb-20">
      {/* ---- Top bar ---- */}
      <div className="flex items-center justify-between">
        <p className="font-serif text-[22px] leading-none text-paper lg:text-[26px]">Nudge</p>
        <button
          type="button"
          aria-label="Profile and settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/50 text-[12px] uppercase text-paper hover:bg-paper hover:text-ink lg:h-10 lg:w-10 lg:text-[13px]"
        >
          V
        </button>
      </div>

      {/* ---- Greeting and today's date ---- */}
      <p className="mt-16 text-[10px] uppercase tracking-[0.4em] text-muted lg:mt-20 lg:text-[12px]">
        {greetingFor(now)}
      </p>
      <h1 className="mt-4 font-serif text-[clamp(2.75rem,13vw,4rem)] leading-[1.05] tracking-tight text-paper lg:text-[5.5rem]">
        {formatLongDate(now)}
      </h1>

      {/* ---- Next up ---- */}
      <section className="mt-16 lg:mt-20">
        <SectionHeading>Next up</SectionHeading>
        {nextUp ? (
          <ol className="mt-6 border-b border-line">
            <EventRow
              position={0}
              timeLine={timeLineFor(nextUp)}
              title={nextUp.title}
              onClick={() => onOpenCalendarEvent(nextUp)}
            >
              <p className="mt-1 text-[10px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[12px]">
                {nextUp.location}
              </p>
            </EventRow>
          </ol>
        ) : (
          <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-muted lg:text-[13px]">
            Nothing planned.
          </p>
        )}
      </section>

      {/* ---- Needs your answer ---- */}
      <section className="mt-16">
        <SectionHeading>Needs your answer · {waiting.length}</SectionHeading>
        {waiting.length > 0 ? (
          <ol className="mt-6 border-b border-line">
            {waiting.map((event, position) => {
              const hasClash = findConflicts(event, calendarEvents).length > 0
              return (
                <EventRow
                  key={event.id}
                  position={position}
                  timeLine={timeLineFor(event)}
                  title={event.title}
                  onClick={() => onOpenEvent(event.id)}
                >
                  <div className="mt-4 flex gap-2">
                    <span className="border border-paper/50 px-2 py-1 text-[9px] uppercase tracking-[0.35em] text-paper lg:text-[12px]">
                      {statusLabel(event)}
                    </span>
                    {hasClash && (
                      <span className="border border-accent px-2 py-1 text-[9px] uppercase tracking-[0.35em] text-accent lg:text-[12px]">
                        Clash
                      </span>
                    )}
                  </div>
                </EventRow>
              )
            })}
          </ol>
        ) : (
          <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-muted lg:text-[13px]">
            All caught up.
          </p>
        )}
      </section>

      {/* ---- Folded inbox bar ---- */}
      <button
        type="button"
        onClick={onShowInbox}
        className="mt-16 flex w-full items-center justify-between border-y border-line py-5 text-[10px] uppercase tracking-[0.4em] lg:py-6 lg:text-[12px]"
      >
        <span className="text-paper">Inbox · {emailCount} emails</span>
        <span className="text-muted">Show +</span>
      </button>
    </main>
  )
}
