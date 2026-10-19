// ==========================================================
// CalendarEventDetail
// A simple read-only view of an event that was already in the
// calendar (not one Nudge found): date, title, time, location.
// No tracker, no choices, no email.
// ==========================================================
import { formatDayMonth, formatTimeRange, formatWeekday } from '../logic/formatDates.js'
import BackLink from './BackLink.jsx'

export default function CalendarEventDetail({ event, backLabel, onBack }) {
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

      <p className="mt-14 border-t border-line pt-6 text-[11px] uppercase tracking-[0.35em] text-muted lg:text-[13px]">
        In your calendar
      </p>
    </main>
  )
}
