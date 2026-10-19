// ==========================================================
// detectReplyOutcome
// Reads a reply to a reschedule request and decides what it says:
// "accepted", "declined" or "unclear".
//
// For the demo this is a simple keyword check. Later, AI (Amazon
// Bedrock) will read real replies instead, which copes with any
// wording ("Fri's fine but can we make it 7?"). Whatever it decides,
// the calendar only changes when the user taps UPDATE CALENDAR.
// ==========================================================

// Checked first, because a "no" often contains friendly words too
// ("So sorry, Friday's no good ... another evening?")
const declinePhrases = [
  "can't", 'cannot', 'can not', 'no good', "won't work", "doesn't work", 'does not work',
  'not free', 'busy', 'another time', 'another evening', 'another day', 'not possible',
]

const acceptPhrases = [
  'works', 'perfect', 'sounds good', 'see you', 'great', 'yes', 'fine by me', 'happy to',
]

export function detectReplyOutcome(replyText) {
  // Treat curly apostrophes like straight ones, and ignore capitals
  const text = (replyText || '').toLowerCase().replace(/’/g, "'")

  if (declinePhrases.some((phrase) => text.includes(phrase))) return 'declined'
  if (acceptPhrases.some((phrase) => text.includes(phrase))) return 'accepted'
  return 'unclear'
}
