// ==========================================================
// ConfirmationScreen
// A brief, calm "done" moment, e.g. "Added." in the serif with
// a short line beneath. Fades out and calls onFinish.
// response: "add" | "dismiss" | "sent" (a reschedule request went
// out; nothing has moved yet) | "updated" (the event moved after
// the other person agreed).
// ==========================================================
import { useEffect } from 'react'
import { formatDayMonth, formatShortDate, formatTimeRange } from '../logic/formatDates.js'

// How long the confirmation stays, in ms.
// Keep in step with --animate-confirm-out in index.css (1.6s delay + 0.5s fade).
const confirmationDuration = 2100

// The big word and the line under it, for each kind of response
function wordingFor(event, response) {
  if (response === 'add') {
    return { heading: 'Added.', line: `${event.title} · ${formatDayMonth(event.startTime)}` }
  }
  if (response === 'sent') {
    const name = event.reschedule?.contactName || 'they'
    return { heading: 'Sent.', line: `We'll let you know when ${name} replies.` }
  }
  if (response === 'updated') {
    const newTime = `${formatShortDate(event.startTime)} · ${formatTimeRange(event.startTime, event.endTime)}`
    return { heading: 'Updated.', line: `${event.title} moved to ${newTime}` }
  }
  return { heading: 'Noted.', line: 'No more nudges about this one' }
}

export default function ConfirmationScreen({ event, response, onFinish }) {
  // ---- Move on after a moment ----
  useEffect(() => {
    const timer = setTimeout(onFinish, confirmationDuration)
    return () => clearTimeout(timer)
  }, [onFinish])

  const { heading, line } = wordingFor(event, response)

  // ---- Layout ----
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-ink px-6 text-center animate-confirm-out">
      <div className="animate-fade-in">
        <h1 className="font-serif text-[clamp(3.5rem,18vw,6rem)] leading-none text-paper">{heading}</h1>
        <p className="mt-8 text-[12px] uppercase leading-relaxed tracking-[0.35em] text-muted lg:text-[13px]">
          {line}
        </p>
      </div>
    </div>
  )
}
