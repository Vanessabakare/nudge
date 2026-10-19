// ==========================================================
// RescheduleScreen
// When a new event clashes with something already in the
// calendar, this screen offers to move the existing event:
// - the event being moved, large in the serif
// - FREE SLOTS FOR YOU: three free times to choose from
// - DRAFT TO …: a ready-written email, which can be edited
// - SEND EMAIL | EDIT
// Sending is always the user's own tap; nothing goes automatically.
// ==========================================================
import { useEffect, useRef, useState } from 'react'
import { findFreeSlots, slotKindFor } from '../logic/findFreeSlots.js'
import { draftRescheduleEmail, slotPhrase } from '../logic/draftRescheduleEmail.js'
import { formatShortDate, formatTimeRange } from '../logic/formatDates.js'
import { firstNameOf } from '../settings/userProfile.js'
import BackLink from './BackLink.jsx'

const minuteInMs = 60 * 1000

// Turns 0 into "01", 2 into "03", and so on.
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

// "TUE 20 OCT · 6–8PM"
function slotLabel(slot) {
  return `${formatShortDate(slot.startTime)} · ${formatTimeRange(slot.startTime, slot.endTime)}`
}

export default function RescheduleScreen({
  eventToMove,
  newEvent,
  calendarEvents,
  now,
  userName,
  onSend,
  onBack,
}) {
  // Sign the email with the user's first name (no signature for Guest)
  const senderName = firstNameOf(userName)

  // ---- Free slots: the calendar without the event being moved,
  // plus the new event, so the move can't create a fresh clash ----
  const durationMinutes = (new Date(eventToMove.endTime) - new Date(eventToMove.startTime)) / minuteInMs
  const busy = [...calendarEvents.filter((event) => event.id !== eventToMove.id), newEvent]
  const slots = findFreeSlots(busy, durationMinutes, { from: now, kind: slotKindFor(eventToMove) })

  // ---- Which slot is chosen, and the email draft ----
  const [chosenIndex, setChosenIndex] = useState(0)
  const chosenSlot = slots[chosenIndex]

  const [draft, setDraft] = useState(() =>
    chosenSlot ? draftRescheduleEmail({ event: eventToMove, newSlot: chosenSlot, senderName }) : null,
  )
  const [isEditing, setIsEditing] = useState(false)
  const [hasEdited, setHasEdited] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const bodyBox = useRef(null)

  // Set when an edited message no longer names the chosen time
  const [timeWarning, setTimeWarning] = useState(false)

  // Choosing a different slot rewrites the draft. If the user has
  // edited it, keep their words and just swap the old time for the
  // new one; if the old time can't be found, ask them to check.
  function chooseSlot(index) {
    const newSlot = slots[index]
    setChosenIndex(index)
    if (!hasEdited) {
      setDraft(draftRescheduleEmail({ event: eventToMove, newSlot, senderName }))
      return
    }
    const oldPhrase = slotPhrase(chosenSlot)
    if (draft.body.includes(oldPhrase)) {
      setDraft({ ...draft, body: draft.body.replace(oldPhrase, slotPhrase(newSlot)) })
      setTimeWarning(false)
    } else {
      setTimeWarning(true)
    }
  }

  // EDIT unlocks the message and puts the cursor in it
  useEffect(() => {
    if (isEditing && bodyBox.current) {
      bodyBox.current.focus()
    }
  }, [isEditing])

  async function send() {
    setIsSending(true)
    setSendError('')
    try {
      await onSend({ email: draft, newSlot: chosenSlot })
    } catch (error) {
      setSendError(error.message || 'Could not send')
      setIsSending(false)
    }
  }

  const recipientName = eventToMove.organiserName || 'organiser'

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20 animate-fade-in lg:mx-0 lg:max-w-3xl lg:px-16 lg:pt-14">
      <BackLink desktopLabel="Back" onClick={onBack} />

      {/* ---- The event being moved ---- */}
      <p className="mt-16 text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">Reschedule</p>
      <h1 className="mt-4 font-serif text-[clamp(2.75rem,12vw,4rem)] leading-[1.05] tracking-tight text-paper lg:text-[5.5rem]">
        {eventToMove.title}
      </h1>
      <p className="mt-6 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-muted lg:text-[12px]">
        {slotLabel(eventToMove)} · {eventToMove.location}
      </p>
      <p className="mt-4 border-l border-accent pl-3 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-accent lg:text-[12px]">
        Clashes with {newEvent.title}, {formatTimeRange(newEvent.startTime, newEvent.endTime)}
      </p>

      {/* ---- Free slots ---- */}
      <section className="mt-16">
        <h2 className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">Free slots for you</h2>
        {slots.length === 0 ? (
          <p className="mt-6 text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[13px]">
            No free slots in the next 7 days.
          </p>
        ) : (
          <ol role="radiogroup" aria-label="Free slots" className="mt-6 border-b border-line">
            {slots.map((slot, position) => {
              const isChosen = position === chosenIndex
              return (
                <li key={slot.startTime} className="border-t border-line">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isChosen}
                    onClick={() => chooseSlot(position)}
                    className="flex w-full items-center gap-5 py-5 text-left lg:gap-6 lg:py-6"
                  >
                    <span className="w-9 shrink-0 text-[12px] tracking-[0.2em] text-muted lg:w-12 lg:text-[12px]">
                      |{formatIndex(position)}|
                    </span>
                    <span
                      className={
                        'flex-1 text-[12px] uppercase tracking-[0.25em] lg:text-[15px] ' +
                        (isChosen ? 'text-paper' : 'text-muted')
                      }
                    >
                      {slotLabel(slot)}
                    </span>
                    {/* A filled square marks the chosen slot */}
                    <span
                      className={'h-2 w-2 shrink-0 border ' + (isChosen ? 'border-paper bg-paper' : 'border-line')}
                    />
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      {/* ---- The drafted email ---- */}
      {draft && (
        <section className="mt-16">
          <h2 className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">Draft to {recipientName}</h2>

          <div className="mt-6 space-y-2 border-t border-line pt-5 text-[12px] uppercase tracking-[0.3em] text-muted lg:text-[12px]">
            <p>
              To · <span className="text-[13px] normal-case tracking-[0.05em] text-paper lg:text-[15px]">{draft.to}</span>
            </p>
            <p>
              Subject · <span className="text-[13px] normal-case tracking-[0.05em] text-paper lg:text-[15px]">{draft.subject}</span>
            </p>
          </div>

          <label htmlFor="draft-body" className="sr-only">
            Email message
          </label>
          <textarea
            id="draft-body"
            ref={bodyBox}
            value={draft.body}
            readOnly={!isEditing}
            onChange={(changeEvent) => {
              setDraft({ ...draft, body: changeEvent.target.value })
              setHasEdited(true)
            }}
            rows={9}
            className={
              'mt-5 w-full resize-y border bg-transparent p-4 text-[13px] leading-relaxed text-paper outline-none lg:p-5 lg:text-[15px] ' +
              (isEditing ? 'border-paper/60' : 'border-line')
            }
          />

          {timeWarning && (
            <p className="mt-4 text-[12px] uppercase leading-relaxed tracking-[0.3em] text-accent lg:text-[12px]">
              Check the message mentions {slotLabel(chosenSlot)}
            </p>
          )}

          {sendError && (
            <p className="mt-4 text-[12px] uppercase tracking-[0.3em] text-accent lg:text-[12px]">{sendError}</p>
          )}

          {/* ---- SEND EMAIL | EDIT ---- */}
          <div className="mt-8 flex border-y border-line">
            <button
              type="button"
              onClick={send}
              disabled={isSending || !chosenSlot}
              className="flex-1 border-r border-line py-5 text-[12px] uppercase tracking-[0.3em] text-paper hover:bg-paper hover:text-ink disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-paper lg:py-6 lg:text-[13px]"
            >
              {isSending ? 'Sending…' : 'Send email'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSending}
              className="flex-1 py-5 text-[12px] uppercase tracking-[0.3em] text-muted hover:text-paper lg:py-6 lg:text-[13px]"
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
