// ==========================================================
// InboxList
// The inbox screen. Emails where Nudge found an event get a
// status label and can be tapped to open the event.
//
// Phone: "Inbox" large in the serif, an ALL · N / EVENTS · N
// filter, and Gmail-style rows — sender and time, the subject in
// sentence case, a one-line preview, then any tags (status,
// terracotta CLASH, RESCHEDULE PROPOSED).
//
// Desktop (1024px+): unchanged — a numbered |01| list with the
// first line of each email, and on the right the time it arrived
// with the status label underneath. The filter is phone-only.
// ==========================================================
import { findConflicts } from '../logic/findConflicts.js'
import { formatReceived, formatReceivedShort } from '../logic/formatDates.js'
import { isWaitingForAnswer, statusLabel } from '../logic/statusLabel.js'

// Turns 0 into "01", 4 into "05", and so on.
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

// The status label itself. Outlined while waiting for an answer;
// plain once answered. extraClasses sets where it shows.
function StatusLabel({ event, extraClasses }) {
  const isWaiting = isWaitingForAnswer(event)
  return (
    <p
      className={
        `inline-block text-[12px] uppercase tracking-[0.35em] lg:text-[12px] ${extraClasses} ` +
        (isWaiting ? 'border border-paper/50 px-2 py-1 text-paper' : 'py-1 text-muted')
      }
    >
      {statusLabel(event)}
    </p>
  )
}

// Phone: the tags under a row — status, then CLASH and any reschedule
// in progress for the event it clashes with
function PhoneTags({ event, calendarEvents }) {
  const isSettled = event.status === 'dismissed' || event.status === 'expired'
  const conflicts = isSettled ? [] : findConflicts(event, calendarEvents)
  const reschedule = conflicts.find((conflict) => conflict.reschedule)?.reschedule
  const isPending = reschedule && (reschedule.status === 'proposed' || reschedule.status === 'accepted')

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <StatusLabel event={event} extraClasses="" />
      {conflicts.length > 0 && (
        <span
          className={
            'border px-2 py-1 text-[12px] uppercase tracking-[0.35em] text-accent ' +
            (isPending ? 'border-dashed border-accent' : 'border-accent')
          }
        >
          Clash
        </span>
      )}
      {isPending && (
        <span className="border border-dashed border-paper/50 px-2 py-1 text-[12px] uppercase tracking-[0.35em] text-paper">
          {reschedule.status === 'accepted' ? 'Reschedule agreed' : 'Reschedule proposed'}
        </span>
      )}
    </div>
  )
}

export default function InboxList({ emails, events, calendarEvents, now, filter, onChangeFilter, onOpenEvent }) {
  // Finds the event that came from a given email (if any)
  function eventForEmail(email) {
    return events.find((event) => event.sourceEmailId === email.id)
  }

  // ---- Phone filter: ALL or only emails with an event in them ----
  const eventEmailCount = emails.filter((email) => email.extractedEvent).length
  const filters = [
    { key: 'all', label: `All · ${emails.length}` },
    { key: 'events', label: `Events · ${eventEmailCount}` },
  ]

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-16 pb-32 animate-fade-in lg:mx-0 lg:max-w-5xl lg:px-16 lg:pt-20 lg:pb-20">
      {/* ---- Phone header (on desktop the left column carries the title) ---- */}
      <div className="lg:hidden">
        <h2 className="font-serif text-[clamp(3rem,15vw,4.5rem)] leading-none tracking-tight text-paper">Inbox</h2>
        <div className="mt-8 flex gap-8" role="tablist" aria-label="Show">
          {filters.map(({ key, label }) => {
            const isActive = filter === key
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChangeFilter(key)}
                className={
                  'border-b pb-1 text-[12px] uppercase tracking-[0.35em] ' +
                  (isActive ? 'border-paper text-paper' : 'border-transparent text-muted hover:text-paper')
                }
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <ol className="mt-8 border-b border-line lg:mt-0">
        {emails.map((email, position) => {
          const event = eventForEmail(email)
          // Hidden on phone when EVENTS is chosen and this email has no event;
          // desktop always shows every email
          const isFilteredOut = filter === 'events' && !email.extractedEvent

          // ---- Phone row: sender and time, subject, preview, tags ----
          const phoneRow = (
            <div className="py-6 lg:hidden">
              <div className="flex items-baseline justify-between gap-4">
                <p className="min-w-0 truncate text-[12px] uppercase tracking-[0.3em] text-muted">{email.sender}</p>
                <p className="shrink-0 text-[13px] text-muted">{formatReceivedShort(now, email.receivedAt)}</p>
              </div>
              <p className="mt-2 text-[15px] leading-snug text-paper">{email.subject}</p>
              <p className="mt-1 truncate text-[13px] text-muted">{email.preview}</p>
              {event && <PhoneTags event={event} calendarEvents={calendarEvents} />}
            </div>
          )

          // ---- Desktop row (unchanged): index, sender, subject, preview, time and label ----
          const desktopRow = (
            <div className="hidden lg:flex lg:gap-6 lg:py-8">
              {/* Index number, e.g. |01| */}
              <span className="w-9 shrink-0 pt-px text-[12px] tracking-[0.2em] text-muted lg:w-12 lg:text-[12px]">
                |{formatIndex(position)}|
              </span>

              <div className="min-w-0 lg:flex-1">
                {/* Sender */}
                <p className="text-[12px] uppercase tracking-[0.35em] text-muted lg:text-[12px]">
                  {email.sender}
                </p>

                {/* Subject */}
                <p className="mt-2 text-[13px] uppercase leading-relaxed tracking-[0.15em] text-paper lg:text-[15px]">
                  {email.subject}
                </p>

                {/* The first line of the email, cut off with … */}
                <p className="lg:mt-2 lg:block lg:truncate lg:text-[15px] lg:text-muted">{email.preview}</p>
              </div>

              {/* Time received, with the label under it */}
              <div className="lg:flex lg:shrink-0 lg:flex-col lg:items-end lg:gap-3 lg:pl-8">
                <p className="text-[12px] uppercase tracking-[0.3em] text-muted">
                  {formatReceived(now, email.receivedAt)}
                </p>
                {event && <StatusLabel event={event} extraClasses="" />}
              </div>
            </div>
          )

          return (
            <li key={email.id} className={'border-t border-line ' + (isFilteredOut ? 'hidden lg:block' : '')}>
              {event ? (
                <button
                  type="button"
                  onClick={() => onOpenEvent(event.id)}
                  className="block w-full text-left lg:hover:bg-paper/[0.03]"
                >
                  {phoneRow}
                  {desktopRow}
                </button>
              ) : (
                <div>
                  {phoneRow}
                  {desktopRow}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
