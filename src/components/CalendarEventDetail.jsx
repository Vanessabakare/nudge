// ==========================================================
// CalendarEventDetail
// A simple view of an event that was already in the calendar
// (not one Nudge found): date, title, time, location.
// If a reschedule request is out for it, it also shows where
// that stands, with the next step:
// - proposed: the time asked for, awaiting their reply
// - agreed:   UPDATE CALENDAR
// - declined: PICK ANOTHER TIME
// ==========================================================
import { formatDayMonth, formatShortDate, formatTimeRange, formatWeekday } from '../logic/formatDates.js'
import { rescheduleLabel } from '../logic/rescheduleStatus.js'
import BackLink from './BackLink.jsx'

export default function CalendarEventDetail({ event, backLabel, onUpdate, onPickAnother, onBack }) {
  const reschedule = event.reschedule
  const statusLine = rescheduleLabel(event)

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20 animate-fade-in lg:mx-0 lg:max-w-3xl lg:px-16 lg:pt-14">
      {/* ---- Back link ---- */}
      <BackLink desktopLabel={backLabel} onClick={onBack} />

      {/* ---- The date, set large ---- */}
      <p className="mt-16 text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
        {formatWeekday(event.startTime)}
      </p>
      <h1 className="mt-3 font-serif text-[clamp(4rem,22vw,7rem)] leading-none tracking-tight text-paper lg:text-[8rem]">
        {formatDayMonth(event.startTime)}
      </h1>

      {/* ---- Event details ---- */}
      <h2 className="mt-12 text-[14px] uppercase leading-relaxed tracking-[0.25em] text-paper lg:text-[18px]">
        {event.title}
      </h2>
      <div className="mt-6 space-y-2 text-[12px] uppercase tracking-[0.3em] text-muted lg:text-[13px]">
        <p>{formatTimeRange(event.startTime, event.endTime)}</p>
        <p>{event.location}</p>
        <p>{event.isVirtual ? 'Virtual' : 'In person'}</p>
      </div>

      {/* ---- Reschedule status, if a request is out ---- */}
      {reschedule ? (
        <section className="mt-14">
          <p className="inline-block border border-dashed border-paper/50 px-2 py-1 text-[12px] uppercase tracking-[0.35em] text-paper lg:text-[12px]">
            {statusLine}
          </p>
          <p className="mt-5 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[13px]">
            {reschedule.status === 'declined' ? 'Asked for' : 'Proposed'} ·{' '}
            {formatShortDate(reschedule.proposedSlot.startTime)} ·{' '}
            {formatTimeRange(reschedule.proposedSlot.startTime, reschedule.proposedSlot.endTime)}
          </p>
          <p className="mt-2 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[13px]">
            Still at its original time until you update it
          </p>

          {reschedule.status === 'accepted' && (
            <button
              type="button"
              onClick={onUpdate}
              className="mt-8 w-full border-y border-line py-5 text-[12px] uppercase tracking-[0.3em] text-paper hover:bg-paper hover:text-ink lg:py-6 lg:text-[13px]"
            >
              Update calendar
            </button>
          )}
          {reschedule.status === 'declined' && (
            <button
              type="button"
              onClick={onPickAnother}
              className="mt-8 w-full border-y border-line py-5 text-[12px] uppercase tracking-[0.3em] text-paper hover:bg-paper hover:text-ink lg:py-6 lg:text-[13px]"
            >
              Pick another time
            </button>
          )}
        </section>
      ) : (
        <p className="mt-14 border-t border-line pt-6 text-[12px] uppercase tracking-[0.35em] text-muted lg:text-[13px]">
          In your calendar
        </p>
      )}
    </main>
  )
}
