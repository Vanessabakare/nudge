// ==========================================================
// ConfirmationScreen
// A brief, calm "done" moment after the user answers, e.g.
// "Added." in the serif with the event title beneath.
// Fades out and calls onFinish to return to the inbox.
// ==========================================================
import { useEffect } from 'react'
import { formatDayMonth } from '../logic/formatDates.js'

// How long the confirmation stays, in ms.
// Keep in step with --animate-confirm-out in index.css (1.6s delay + 0.5s fade).
const confirmationDuration = 2100

export default function ConfirmationScreen({ event, response, onFinish }) {
  // ---- Return to the inbox after a moment ----
  useEffect(() => {
    const timer = setTimeout(onFinish, confirmationDuration)
    return () => clearTimeout(timer)
  }, [onFinish])

  const isAdded = response === 'add'

  // ---- Layout ----
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-ink px-6 text-center animate-confirm-out">
      <div className="animate-fade-in">
        <h1 className="font-serif text-[clamp(3.5rem,18vw,6rem)] leading-none text-paper">
          {isAdded ? 'Added.' : 'Noted.'}
        </h1>
        <p className="mt-8 text-[11px] uppercase leading-relaxed tracking-[0.35em] text-muted">
          {isAdded
            ? `${event.title} · ${formatDayMonth(event.startTime)}`
            : 'No more nudges about this one'}
        </p>
      </div>
    </div>
  )
}
