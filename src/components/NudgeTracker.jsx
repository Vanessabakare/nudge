// ==========================================================
// NudgeTracker
// A thin line with five stages, like a delivery tracker:
// SPOTTED -> NUDGE 1 -> NUDGE 2 -> NUDGE 3 -> ADDED
// Stages already passed are filled; the current stage is
// highlighted; stages still to come are faint.
// ==========================================================

// Works out which stage (0 to 4) an event has reached
function currentStageIndex(event) {
  if (event.status === 'added') return 4
  const sentNudges = event.nudges.filter((nudge) => nudge.sentAt).length
  return sentNudges // 0 = spotted, 1–3 = that many nudges sent
}

export default function NudgeTracker({ event }) {
  const current = currentStageIndex(event)

  // The last stage reads ADDED, unless the event was turned down
  let lastLabel = 'Added'
  if (event.status === 'dismissed') lastLabel = 'Dismissed'
  if (event.status === 'expired') lastLabel = 'Expired'

  const stages = ['Spotted', 'Nudge 1', 'Nudge 2', 'Nudge 3', lastLabel]

  // How far along the line is filled in (stage centres sit at 10%, 30% ... 90%)
  const filledWidth = `${current * 20}%`

  // ---- Layout ----
  return (
    <div className="relative grid grid-cols-5">
      {/* The faint full line, from the first stage to the last */}
      <div className="absolute top-[3px] left-[10%] right-[10%] h-px bg-line" />
      {/* The filled part of the line, up to the current stage */}
      <div className="absolute top-[3px] left-[10%] h-px bg-paper" style={{ width: filledWidth }} />

      {stages.map((label, index) => {
        const isPassed = index < current
        const isCurrent = index === current

        let markerClass = 'border border-line bg-ink' // still to come
        if (isPassed) markerClass = 'bg-paper'
        if (isCurrent) markerClass = 'bg-paper outline outline-1 outline-offset-2 outline-paper'

        let labelClass = 'text-muted/50'
        if (isPassed) labelClass = 'text-muted'
        if (isCurrent) labelClass = 'text-paper'

        return (
          <div key={label} className="relative flex flex-col items-center">
            <span className={`h-[7px] w-[7px] ${markerClass}`} />
            <span className={`mt-4 text-center text-[8px] uppercase tracking-[0.2em] ${labelClass}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
