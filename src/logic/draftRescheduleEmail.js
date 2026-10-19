// ==========================================================
// draftRescheduleEmail
// Writes a short, polite email asking to move an event to a
// new time. Returns { to, subject, body }.
//
// This is a fixed template for the demo. Later, AI drafting
// (Amazon Bedrock) will replace it, writing in the user's own
// tone and using the context of the original email thread.
// The user always reads, can edit, and must tap SEND themselves.
// ==========================================================
import { formatLongDate, formatTimeRange } from './formatDates.js'

// "7–9pm" — the email reads better in lower case
function timeRangeForEmail(startIso, endIso) {
  return formatTimeRange(startIso, endIso).toLowerCase()
}

// How a slot is written in the email, e.g. "Tuesday 20 October, 6–8pm".
// Exported so the Reschedule screen can swap it if the user picks
// another slot after editing the message by hand.
export function slotPhrase(slot) {
  return `${formatLongDate(slot.startTime)}, ${timeRangeForEmail(slot.startTime, slot.endTime)}`
}

export function draftRescheduleEmail({ event, newSlot, senderName }) {
  const greetingName = event.organiserName || 'there'
  const oldDay = formatLongDate(event.startTime) // e.g. "Thursday 22 October"
  const oldTime = timeRangeForEmail(event.startTime, event.endTime)

  return {
    to: event.organiserEmail || '',
    subject: `Could we move our plans on ${oldDay}?`,
    body:
      `Hi ${greetingName},\n\n` +
      `Something has come up that clashes with our plans on ${oldDay} (${oldTime}). ` +
      `Would ${slotPhrase(newSlot)} work for you instead?\n\n` +
      `Sorry for the shuffle, and thank you.\n\n` +
      `${senderName}`,
  }
}
