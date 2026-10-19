// ==========================================================
// InboxList
// The inbox screen: a numbered |01| list of emails showing
// sender and subject. Emails where Nudge found an event get a
// small status label and can be tapped to open the event.
//
// On desktop (1024px+) each row also shows the first line of
// the email, and on the right the time it arrived with the
// status label underneath.
// ==========================================================
import { formatReceived } from '../logic/formatDates.js'
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
        `inline-block text-[9px] uppercase tracking-[0.35em] lg:text-[12px] ${extraClasses} ` +
        (isWaiting ? 'border border-paper/50 px-2 py-1 text-paper' : 'py-1 text-muted')
      }
    >
      {statusLabel(event)}
    </p>
  )
}

export default function InboxList({ emails, events, now, onOpenEvent }) {
  // Finds the event that came from a given email (if any)
  function eventForEmail(email) {
    return events.find((event) => event.sourceEmailId === email.id)
  }

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-16 pb-32 animate-fade-in lg:mx-0 lg:max-w-5xl lg:px-16 lg:pt-20 lg:pb-20">
      {/* On desktop the left column carries the title instead */}
      <h2 className="text-[11px] font-light uppercase tracking-[0.4em] text-paper lg:hidden">
        Inbox
      </h2>

      <ol className="mt-14 border-b border-line lg:mt-0">
        {emails.map((email, position) => {
          const event = eventForEmail(email)

          // The row's contents: index, sender, subject, and label
          const rowContents = (
            <>
              {/* Index number, e.g. |01| */}
              <span className="w-9 shrink-0 pt-px text-[11px] tracking-[0.2em] text-muted lg:w-12 lg:text-[12px]">
                |{formatIndex(position)}|
              </span>

              <div className="min-w-0 lg:flex-1">
                {/* Sender */}
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted lg:text-[12px]">
                  {email.sender}
                </p>

                {/* Subject */}
                <p className="mt-2 text-[13px] uppercase leading-relaxed tracking-[0.15em] text-paper lg:text-[15px]">
                  {email.subject}
                </p>

                {/* Desktop: the first line of the email, cut off with … */}
                <p className="hidden lg:mt-2 lg:block lg:truncate lg:text-[15px] lg:text-muted">
                  {email.preview}
                </p>

                {/* Phone: the label sits under the subject */}
                {event && <StatusLabel event={event} extraClasses="mt-4 lg:hidden" />}
              </div>

              {/* Desktop: time received, with the label under it */}
              <div className="hidden lg:flex lg:shrink-0 lg:flex-col lg:items-end lg:gap-3 lg:pl-8">
                <p className="text-[12px] uppercase tracking-[0.3em] text-muted">
                  {formatReceived(now, email.receivedAt)}
                </p>
                {event && <StatusLabel event={event} extraClasses="" />}
              </div>
            </>
          )

          return (
            <li key={email.id} className="border-t border-line">
              {event ? (
                <button
                  type="button"
                  onClick={() => onOpenEvent(event.id)}
                  className="flex w-full gap-5 py-7 text-left lg:gap-6 lg:py-8 lg:hover:bg-paper/[0.03]"
                >
                  {rowContents}
                </button>
              ) : (
                <div className="flex gap-5 py-7 lg:gap-6 lg:py-8">{rowContents}</div>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
