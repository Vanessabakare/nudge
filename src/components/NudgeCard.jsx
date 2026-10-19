// ==========================================================
// NudgeCard
// A nudge waiting for an answer, shown as a card in the middle
// of the screen. Everything behind it is blurred and dimmed.
// - Phone: the blur covers the whole screen.
// - Desktop: the left column stays sharp; only the right-hand
//   content area is blurred, with the card centred in it.
// Tapping outside the card (or pressing Escape) counts as NOT NOW.
// ==========================================================
import { useEffect } from 'react'
import { findConflicts } from '../logic/findConflicts.js'
import { isClashPending } from '../logic/rescheduleStatus.js'
import {
  formatDayMonth,
  formatTimeRange,
  formatTimeUntil,
  formatWeekday,
} from '../logic/formatDates.js'

export default function NudgeCard({
  event,
  nudgeNumber,
  now,
  calendarEvents,
  onAdd,
  onReschedule,
  onNotNow,
}) {
  const conflicts = findConflicts(event, calendarEvents)
  const hasClash = conflicts.length > 0
  // A reschedule request is already out: no second RESCHEDULE
  const clashIsPending = isClashPending(conflicts)

  // ---- Escape key = NOT NOW ----
  useEffect(() => {
    function handleKey(keyEvent) {
      if (keyEvent.key === 'Escape') onNotNow()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNotNow])

  const buttonClass =
    'w-full border-t border-line py-4 text-[12px] uppercase tracking-[0.35em] lg:py-5 lg:text-[12px]'

  // ---- Layout ----
  return (
    // The blurred, dimmed backdrop. Clicking it counts as NOT NOW.
    <div
      onClick={onNotNow}
      className="fixed inset-0 z-40 flex items-center justify-center bg-scrim px-6 backdrop-blur-md animate-overlay-in lg:left-[26%]"
    >
      {/* The card itself; clicks inside don't reach the backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nudge-card-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="w-full max-w-sm border border-paper/40 bg-ink animate-card-in lg:max-w-md"
      >
        <div className="px-7 pt-8 pb-7 lg:px-10 lg:pt-10">
          {/* Which nudge, and how long until the event */}
          <p className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
            Nudge {nudgeNumber} of {event.nudges.length} · {formatTimeUntil(now, event.startTime)}
          </p>

          {/* The date, large */}
          <p className="mt-8 text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
            {formatWeekday(event.startTime)}
          </p>
          <p className="mt-2 font-serif text-[clamp(3.5rem,16vw,4.5rem)] leading-none tracking-tight text-paper lg:text-[5rem]">
            {formatDayMonth(event.startTime)}
          </p>

          {/* Title, time and location */}
          <h2
            id="nudge-card-title"
            className="mt-8 text-[13px] uppercase leading-relaxed tracking-[0.2em] text-paper lg:text-[15px]"
          >
            {event.title}
          </h2>
          <p className="mt-3 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[12px]">
            {formatTimeRange(event.startTime, event.endTime)} · {event.location}
          </p>

          {/* Clash line, only if there is one */}
          {conflicts.map((conflict) => (
            <p
              key={conflict.id}
              className="mt-5 border-l border-accent pl-3 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-accent lg:text-[12px]"
            >
              Clashes with {conflict.title},{' '}
              {formatTimeRange(conflict.startTime, conflict.endTime)}
              {clashIsPending && ' · reschedule pending'}
            </p>
          ))}
        </div>

        {/* Stacked text buttons */}
        <div>
          <button type="button" onClick={onAdd} className={`${buttonClass} text-paper hover:bg-paper hover:text-ink`}>
            {hasClash ? 'Add anyway' : 'Add'}
          </button>
          {hasClash && !clashIsPending && (
            <button type="button" onClick={onReschedule} className={`${buttonClass} text-muted hover:text-paper`}>
              Reschedule
            </button>
          )}
          <button type="button" onClick={onNotNow} className={`${buttonClass} text-muted hover:text-paper`}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
