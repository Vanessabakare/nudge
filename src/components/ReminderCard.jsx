// ==========================================================
// ReminderCard
// A reminder about an event already in the calendar, shown in
// the same centred card as nudges, over a blurred background:
// - dayBefore: "TOMORROW"
// - morningOf: "TODAY"
// - soon, in person: "LEAVE SOON" · "Starts at 2pm · Room 3.14"
// - soon, virtual: "STARTING IN 10 MINUTES", with JOIN
// OK (or a tap outside, or Escape) closes it.
// ==========================================================
import { useEffect } from 'react'
import { formatClock, formatTimeRange } from '../logic/formatDates.js'

// The small heading for each kind of reminder
function headingFor(reminder, event) {
  if (reminder.type === 'dayBefore') return 'Tomorrow'
  if (reminder.type === 'morningOf') return 'Today'
  return event.isVirtual ? 'Starting in 10 minutes' : 'Leave soon'
}

export default function ReminderCard({ event, reminder, onOk }) {
  const isLeaveSoon = reminder.type === 'soon' && !event.isVirtual
  const canJoin = reminder.type === 'soon' && event.isVirtual && event.meetingLink

  // ---- Escape key = OK ----
  useEffect(() => {
    function handleKey(keyEvent) {
      if (keyEvent.key === 'Escape') onOk()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onOk])

  const buttonClass =
    'block w-full border-t border-line py-4 text-center text-[12px] uppercase tracking-[0.35em] lg:py-5 lg:text-[12px]'

  // ---- Layout ----
  return (
    // The blurred, dimmed backdrop. Clicking it counts as OK.
    <div
      onClick={onOk}
      className="fixed inset-0 z-40 flex items-center justify-center bg-scrim px-6 backdrop-blur-md animate-overlay-in lg:left-[26%]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-card-title"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="w-full max-w-sm border border-paper/40 bg-ink animate-card-in lg:max-w-md"
      >
        <div className="px-7 pt-8 pb-7 lg:px-10 lg:pt-10">
          {/* TOMORROW / TODAY / LEAVE SOON / STARTING IN 10 MINUTES */}
          <p className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
            {headingFor(reminder, event)}
          </p>

          {/* The event, large */}
          <h2
            id="reminder-card-title"
            className="mt-6 font-serif text-[clamp(2.25rem,10vw,3rem)] leading-[1.05] tracking-tight text-paper lg:text-[3.25rem]"
          >
            {event.title}
          </h2>

          {/* When and where */}
          <p className="mt-6 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[13px]">
            {isLeaveSoon
              ? `Starts at ${formatClock(event.startTime)} · ${event.location}`
              : `${formatTimeRange(event.startTime, event.endTime)} · ${event.location}`}
          </p>
        </div>

        {/* JOIN (virtual, about to start) and OK */}
        <div>
          {canJoin && (
            <a
              href={event.meetingLink}
              target="_blank"
              rel="noreferrer"
              onClick={onOk}
              className={`${buttonClass} text-paper hover:bg-paper hover:text-ink`}
            >
              Join
            </a>
          )}
          <button
            type="button"
            onClick={onOk}
            className={`${buttonClass} ${canJoin ? 'text-muted hover:text-paper' : 'text-paper hover:bg-paper hover:text-ink'}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
