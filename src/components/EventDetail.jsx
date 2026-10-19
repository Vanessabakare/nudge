// ==========================================================
// EventDetail
// The hero screen for one spotted event: the date set large in
// the serif, the event details, the nudge tracker, a clash
// warning if needed (with an offer to reschedule the clashing
// event), the two choices, and the original email.
// Phone: fills the screen. Desktop: fills the right column.
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatDayMonth, formatTimeRange, formatWeekday } from '../logic/formatDates.js'
import BackLink from './BackLink.jsx'
import NudgeTracker from './NudgeTracker.jsx'

// Builds the clash message, e.g.
// "YOU ALREADY HAVE DINNER WITH AMA, 7–9PM. ADD ANYWAY?"
function conflictMessage(conflict) {
  const timeRange = formatTimeRange(conflict.startTime, conflict.endTime)
  return `You already have ${conflict.title}, ${timeRange}. Add anyway?`
}

export default function EventDetail({
  event,
  email,
  calendarEvents,
  backLabel,
  onRespond,
  onReschedule,
  onBack,
}) {
  const conflicts = findConflicts(event, calendarEvents)
  const isAnswered = ['added', 'dismissed', 'expired'].includes(event.status)

  // The quiet line shown instead of the buttons once settled
  const settledMessages = {
    added: 'In your calendar',
    dismissed: 'Not for you — no more nudges',
    expired: 'No answer — Nudge has let this one go',
  }

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20 animate-fade-in lg:mx-0 lg:max-w-3xl lg:px-16 lg:pt-14">
      {/* ---- Back link ---- */}
      <BackLink desktopLabel={backLabel} onClick={onBack} />

      {/* ---- The date, set large ---- */}
      <p className="mt-16 text-[10px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
        {formatWeekday(event.startTime)}
      </p>
      <h1 className="mt-3 font-serif text-[clamp(4rem,22vw,7rem)] leading-none tracking-tight text-paper lg:text-[8rem]">
        {formatDayMonth(event.startTime)}
      </h1>

      {/* ---- Event details ---- */}
      <h2 className="mt-12 text-[14px] uppercase leading-relaxed tracking-[0.25em] text-paper lg:text-[18px]">
        {event.title}
      </h2>
      <div className="mt-6 space-y-2 text-[11px] uppercase tracking-[0.3em] text-muted lg:text-[13px]">
        <p>{formatTimeRange(event.startTime, event.endTime)}</p>
        <p>{event.location}</p>
        <p>{event.isVirtual ? 'Virtual' : 'In person'}</p>
      </div>

      {/* ---- Nudge progress ---- */}
      <div className="mt-14">
        <NudgeTracker event={event} />
      </div>

      {/* ---- Clash warning (only when there is one, and still undecided) ---- */}
      {!isAnswered &&
        conflicts.map((conflict) => (
          <p
            key={conflict.id}
            className="mt-14 border-l border-accent pl-4 text-[11px] uppercase leading-relaxed tracking-[0.25em] text-accent lg:text-[13px]"
          >
            {conflictMessage(conflict)}
          </p>
        ))}

      {/* ---- Offer to move the clashing event instead ---- */}
      {!isAnswered && conflicts.length > 0 && (
        <button
          type="button"
          onClick={onReschedule}
          className="mt-5 pl-4 text-[11px] uppercase tracking-[0.3em] text-paper hover:text-muted lg:text-[13px]"
        >
          Reschedule {conflicts[0].title} →
        </button>
      )}

      {/* ---- The two choices, or what was decided ---- */}
      {isAnswered ? (
        <p className="mt-14 border-t border-line pt-6 text-[11px] uppercase tracking-[0.35em] text-muted lg:text-[13px]">
          {settledMessages[event.status]}
        </p>
      ) : (
        <div className="mt-14 flex border-y border-line">
          <button
            type="button"
            onClick={() => onRespond('add')}
            className="flex-1 border-r border-line py-5 text-[11px] uppercase tracking-[0.3em] text-paper hover:bg-paper hover:text-ink lg:py-6 lg:text-[13px]"
          >
            Add to calendar
          </button>
          <button
            type="button"
            onClick={() => onRespond('dismiss')}
            className="flex-1 py-5 text-[11px] uppercase tracking-[0.3em] text-muted hover:text-paper lg:py-6 lg:text-[13px]"
          >
            Not for me
          </button>
        </div>
      )}

      {/* ---- The original email, kept quiet ---- */}
      {email && (
        <section className="mt-20">
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted/70 lg:text-[12px]">
            Original email · {email.sender}
          </p>
          <p className="mt-5 whitespace-pre-line text-[12px] leading-relaxed text-muted lg:text-[15px]">
            {email.body}
          </p>
        </section>
      )}
    </main>
  )
}
