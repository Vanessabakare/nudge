// ==========================================================
// NudgeBanner
// A calm banner that slides down from the top when a nudge is
// waiting: which nudge it is, the event, how long until it,
// a terracotta note if it clashes, and ADD / NOT NOW / VIEW.
// Phone: floats over the top of the screen.
// Desktop: sits at the top of the right column and pushes the
// content down, so it never covers anything.
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatTimeRange, formatTimeUntil } from '../logic/formatDates.js'

export default function NudgeBanner({
  event,
  nudgeNumber,
  now,
  calendarEvents,
  onAdd,
  onNotNow,
  onView,
}) {
  const conflicts = findConflicts(event, calendarEvents)

  // ---- Layout ----
  return (
    <div className="fixed inset-x-0 top-9 z-20 border-b border-line bg-ink animate-slide-down lg:relative lg:inset-x-auto lg:top-auto lg:z-auto lg:mx-16 lg:mt-10 lg:max-w-3xl lg:border">
      <div className="mx-auto max-w-md px-6 pt-6 pb-5 lg:mx-0 lg:max-w-none lg:px-8 lg:pt-7 lg:pb-6">
        {/* Which nudge, and when the event is */}
        <p className="text-[9px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
          Nudge {nudgeNumber} of {event.nudges.length} · {formatTimeUntil(now, event.startTime)}
        </p>

        {/* The event */}
        <p className="mt-3 text-[13px] uppercase leading-relaxed tracking-[0.15em] text-paper lg:text-[15px]">
          {event.title}
        </p>

        {/* Clash note, only if there is one */}
        {conflicts.map((conflict) => (
          <p
            key={conflict.id}
            className="mt-2 text-[9px] uppercase leading-relaxed tracking-[0.3em] text-accent lg:text-[12px]"
          >
            Clashes with {conflict.title}, {formatTimeRange(conflict.startTime, conflict.endTime)}
          </p>
        ))}

        {/* The three choices */}
        <div className="mt-5 flex gap-8 text-[10px] uppercase tracking-[0.35em] lg:mt-6 lg:text-[12px]">
          <button type="button" onClick={onAdd} className="uppercase text-paper hover:underline">
            Add
          </button>
          <button type="button" onClick={onNotNow} className="uppercase text-muted hover:text-paper">
            Not now
          </button>
          <button type="button" onClick={onView} className="ml-auto uppercase text-muted hover:text-paper">
            View
          </button>
        </div>
      </div>
    </div>
  )
}
