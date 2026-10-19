// ==========================================================
// BackLink
// The small link at the top of detail screens.
// Phone: "← BACK" in quiet grey, as it has always been.
// Desktop: "← INBOX" (or CALENDAR / MONTH) in off-white and a
// little bigger, so it is always easy to see.
// ==========================================================

export default function BackLink({ desktopLabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] uppercase tracking-[0.4em] text-muted hover:text-paper lg:text-[13px] lg:text-paper"
    >
      <span className="lg:hidden">← Back</span>
      <span className="hidden lg:inline">← {desktopLabel}</span>
    </button>
  )
}
