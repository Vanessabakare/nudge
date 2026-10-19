// ==========================================================
// InboxList
// The inbox screen: a numbered |01| list of emails showing
// sender and subject. Emails where Nudge found an event get a
// small status label and can be tapped to open the event.
// ==========================================================

// Turns 0 into "01", 4 into "05", and so on.
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

// The small label shown for an event, based on its status
function statusLabel(event) {
  if (event.status === 'added') return 'Added'
  if (event.status === 'dismissed') return 'Dismissed'
  if (event.status === 'expired') return 'Expired'
  return 'Event spotted'
}

export default function InboxList({ emails, events, onOpenEvent }) {
  // Finds the event that came from a given email (if any)
  function eventForEmail(email) {
    return events.find((event) => event.sourceEmailId === email.id)
  }

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-16 pb-32 animate-fade-in">
      <h2 className="text-[11px] font-light uppercase tracking-[0.4em] text-paper">
        Inbox
      </h2>

      <ol className="mt-14 border-b border-line">
        {emails.map((email, position) => {
          const event = eventForEmail(email)
          const isSpotted = event && (event.status === 'spotted' || event.status === 'nudged')

          // The row's contents: index, sender, subject, and label
          const rowContents = (
            <>
              {/* Index number, e.g. |01| */}
              <span className="w-9 shrink-0 pt-px text-[11px] tracking-[0.2em] text-muted">
                |{formatIndex(position)}|
              </span>

              <div className="min-w-0">
                {/* Sender */}
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
                  {email.sender}
                </p>

                {/* Subject */}
                <p className="mt-2 text-[13px] uppercase leading-relaxed tracking-[0.15em] text-paper">
                  {email.subject}
                </p>

                {/* Only shown when Nudge found an event in this email.
                    Outlined while waiting for an answer; plain once answered. */}
                {event && (
                  <p
                    className={
                      'mt-4 inline-block text-[9px] uppercase tracking-[0.35em] ' +
                      (isSpotted ? 'border border-paper/50 px-2 py-1 text-paper' : 'py-1 text-muted')
                    }
                  >
                    {statusLabel(event)}
                  </p>
                )}
              </div>
            </>
          )

          return (
            <li key={email.id} className="border-t border-line">
              {event ? (
                <button
                  type="button"
                  onClick={() => onOpenEvent(event.id)}
                  className="flex w-full gap-5 py-7 text-left"
                >
                  {rowContents}
                </button>
              ) : (
                <div className="flex gap-5 py-7">{rowContents}</div>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
