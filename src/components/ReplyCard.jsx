// ==========================================================
// ReplyCard
// When someone answers a reschedule request, this card appears
// in the middle of the screen (same style as the nudge card):
// - agreed:  "AMA AGREED", the new date large, "Update your
//            calendar?"  UPDATE CALENDAR / NOT NOW
// - declined: "AMA CAN'T MAKE IT", "Suggest another time?"
//            PICK ANOTHER TIME / NOT NOW
// Nothing in the calendar changes until the user taps UPDATE.
// Tapping outside the card (or Escape) counts as NOT NOW.
// ==========================================================
import { useEffect } from 'react'
import { formatDayMonth, formatTimeRange, formatWeekday } from '../logic/formatDates.js'

export default function ReplyCard({ calendarEvent, onUpdate, onPickAnother, onNotNow }) {
  const { status, contactName, proposedSlot } = calendarEvent.reschedule
  const hasAgreed = status === 'accepted'

  // ---- Escape key = NOT NOW ----
  useEffect(() => {
    function handleKey(keyEvent) {
      if (keyEvent.key === 'Escape') onNotNow()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNotNow])

  const buttonClass =
    'w-full border-t border-line py-4 text-[12px] uppercase tracking-[0.35em] lg:py-5 lg:text-[12px]'

  // ---- Layout ----
  return (
    // The blurred, dimmed backdrop. Clicking it counts as NOT NOW.
    <div
      onClick={onNotNow}
      className="fixed inset-0 z-40 flex items-center justify-center bg-scrim px-6 backdrop-blur-md animate-overlay-in lg:left-[26%]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reply-card-question"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="w-full max-w-sm border border-paper/40 bg-ink animate-card-in lg:max-w-md"
      >
        <div className="px-7 pt-8 pb-7 lg:px-10 lg:pt-10">
          {/* Who replied, and what they said */}
          <p className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
            {hasAgreed ? `${contactName} agreed` : `${contactName} can't make it`}
          </p>

          {/* The time that was proposed, large */}
          <p className="mt-8 text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">
            {formatWeekday(proposedSlot.startTime)}
          </p>
          <p
            className={
              'mt-2 font-serif text-[clamp(3.5rem,16vw,4.5rem)] leading-none tracking-tight lg:text-[5rem] ' +
              (hasAgreed ? 'text-paper' : 'text-muted line-through decoration-1')
            }
          >
            {formatDayMonth(proposedSlot.startTime)}
          </p>

          <p className="mt-8 text-[13px] uppercase leading-relaxed tracking-[0.2em] text-paper lg:text-[15px]">
            {calendarEvent.title}
          </p>
          <p className="mt-3 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[12px]">
            {formatTimeRange(proposedSlot.startTime, proposedSlot.endTime)} · {calendarEvent.location}
          </p>

          <h2
            id="reply-card-question"
            className="mt-8 font-serif text-[26px] leading-tight text-paper lg:text-[30px]"
          >
            {hasAgreed ? 'Update your calendar?' : 'Suggest another time?'}
          </h2>
        </div>

        {/* Stacked text buttons */}
        <div>
          <button
            type="button"
            onClick={hasAgreed ? onUpdate : onPickAnother}
            className={`${buttonClass} text-paper hover:bg-paper hover:text-ink`}
          >
            {hasAgreed ? 'Update calendar' : 'Pick another time'}
          </button>
          <button type="button" onClick={onNotNow} className={`${buttonClass} text-muted hover:text-paper`}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
