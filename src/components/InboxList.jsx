// ==========================================================
// InboxList
// The inbox screen: a numbered |01| list of emails showing
// sender and subject. Emails where Nudge found an event get
// a small EVENT SPOTTED label.
// ==========================================================
import { useEffect, useState } from 'react'
import { getEmails } from '../sources/mockEmailSource.js'

// Turns 0 into "01", 4 into "05", and so on.
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

export default function InboxList() {
  // ---- Load emails from the email source ----
  const [emails, setEmails] = useState([])

  useEffect(() => {
    getEmails().then(setEmails)
  }, [])

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-16 pb-32 animate-fade-in">
      <h2 className="text-[11px] font-light uppercase tracking-[0.4em] text-paper">
        Inbox
      </h2>

      <ol className="mt-14 border-b border-line">
        {emails.map((email, position) => (
          <li
            key={email.id}
            className="flex gap-5 border-t border-line py-7"
          >
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

              {/* Only shown when Nudge found an event in this email */}
              {email.extractedEvent && (
                <p className="mt-4 inline-block border border-paper/50 px-2 py-1 text-[9px] uppercase tracking-[0.35em] text-paper">
                  Event spotted
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
