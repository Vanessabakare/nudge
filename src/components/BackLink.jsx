// ==========================================================
// BackLink
// The small link at the top of detail screens.
// Phone: "← BACK" in quiet grey, as it has always been — or,
// when phoneLabel is given (e.g. "Month"), that word in
// off-white so it is easy to spot.
// Desktop: "← INBOX" (or HOME / CALENDAR / MONTH) in off-white
// and a little bigger, so it is always easy to see.
// ==========================================================

export default function BackLink({ desktopLabel, phoneLabel, onClick }) {
  const phoneColour = phoneLabel ? 'text-paper' : 'text-muted hover:text-paper'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[12px] uppercase tracking-[0.4em] ${phoneColour} lg:text-[13px] lg:text-paper`}
    >
      <span className="lg:hidden">← {phoneLabel || 'Back'}</span>
      <span className="hidden lg:inline">← {desktopLabel}</span>
    </button>
  )
}
