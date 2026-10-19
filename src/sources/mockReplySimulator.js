// ==========================================================
// mockReplySimulator
// Demo only: pretends the other person has replied to a
// reschedule email, so the presenter can show what happens next.
// Returns an email in the same shape as the inbox's emails.
//
// In the real app there is no simulator: the reply simply arrives
// through the email source (Gmail / Outlook), and Nudge recognises
// it because it is in the same thread as the email it sent.
// See FUTURE.md.
// ==========================================================

export function buildSimulatedReply({ sentEmail, contactName, proposedSlot, isAccepting, now }) {
  const dayName = new Date(proposedSlot.startTime).toLocaleDateString('en-GB', { weekday: 'long' })

  const body = isAccepting
    ? `${dayName} works perfectly, see you then!\n\n${contactName}`
    : `So sorry, ${dayName}'s no good for me. Could we try another evening?\n\n${contactName}`

  return {
    id: `reply-${sentEmail.id}-${Date.now()}`,
    sender: contactName,
    subject: `Re: ${sentEmail.subject}`,
    body,
    preview: body.split('\n')[0],
    receivedAt: now,
    inReplyTo: sentEmail.id, // the thread link a real email would carry
    extractedEvent: null,
  }
}
