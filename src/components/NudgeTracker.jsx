// ==========================================================
// NudgeTracker
// A thin line with five stages, like a delivery tracker:
// SPOTTED -> NUDGE 1 -> NUDGE 2 -> NUDGE 3 -> ADDED
// Each nudge lights up once it has been sent, with its planned
// time underneath. The last stage reads ADDED, DISMISSED or
// EXPIRED once the event is settled.
// ==========================================================
import { formatShortDayTime } from '../logic/formatDates.js'

const finishedStatuses = ['added', 'dismissed', 'expired']

const lastStageLabels = {
  added: 'Added',
  dismissed: 'Dismissed',
  expired: 'Expired',
}

export default function NudgeTracker({ event }) {
  const isFinished = finishedStatuses.includes(event.status)
  const sentCount = event.nudges.filter((nudge) => nudge.sentAt).length

  // ---- The five stages, and which ones have been reached ----
  const nudgeStages = [0, 1, 2].map((index) => {
    const nudge = event.nudges[index]
    return {
      label: `Nudge ${index + 1}`,
      time: nudge ? formatShortDayTime(nudge.scheduledFor) : null,
      isReached: Boolean(nudge && nudge.sentAt),
    }
  })
  const stages = [
    { label: 'Spotted', time: null, isReached: true },
    ...nudgeStages,
    { label: lastStageLabels[event.status] || 'Added', time: null, isReached: isFinished },
  ]

  // The current stage: the last one if settled, otherwise the latest nudge sent
  const current = isFinished ? 4 : sentCount

  // How far along the line is filled in (stage centres sit at 10%, 30% ... 90%)
  const filledWidth = `${current * 20}%`

  // ---- Layout ----
  return (
    <div className="relative grid grid-cols-5">
      {/* The faint full line, from the first stage to the last */}
      <div className="absolute top-[3px] left-[10%] right-[10%] h-px bg-line" />
      {/* The filled part of the line, up to the current stage */}
      <div
        className="absolute top-[3px] left-[10%] h-px bg-paper transition-[width] duration-700"
        style={{ width: filledWidth }}
      />

      {stages.map((stage, index) => {
        const isCurrent = index === current

        let markerClass = 'border border-line bg-ink' // not reached
        if (stage.isReached) markerClass = 'bg-paper'
        if (isCurrent) markerClass = 'bg-paper outline outline-1 outline-offset-2 outline-paper'

        // Stages not reached yet are the one place text is faded further
        let labelClass = 'text-muted/50'
        if (stage.isReached) labelClass = 'text-muted'
        if (isCurrent) labelClass = 'text-paper'

        return (
          <div key={index} className="relative flex flex-col items-center">
            <span className={`h-[7px] w-[7px] ${markerClass}`} />
            <span className={`mt-4 whitespace-nowrap text-center text-[12px] uppercase tracking-[0.04em] lg:tracking-[0.2em] ${labelClass}`}>
              {stage.label}
            </span>
            {/* Planned time: day and clock on two lines on phone, one on desktop */}
            {stage.time && (
              <span className="mt-1 text-center text-[12px] uppercase leading-snug tracking-[0.04em] text-muted lg:mt-2 lg:tracking-[0.15em]">
                <span className="block lg:inline">{stage.time.split(' ')[0]}</span>{' '}
                <span className="block lg:inline">{stage.time.split(' ')[1]}</span>
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
