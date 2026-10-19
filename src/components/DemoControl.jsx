// ==========================================================
// DemoControl
// A discreet strip at the very top for the demo: shows the
// demo clock's time and lets the presenter skip ahead so the
// nudges can be shown live. Removed once real scheduling exists.
// ==========================================================
import { formatDemoTime } from '../logic/formatDates.js'

export default function DemoControl({ now, onSkip }) {
  // Buttons don't inherit "uppercase" from their parent, so it's set here
  const buttonClass = 'uppercase text-muted/70 hover:text-paper'

  return (
    <div className="fixed inset-x-0 top-0 z-30 h-9 border-b border-line bg-ink">
      <div className="mx-auto flex h-full max-w-md items-center justify-between px-6 text-[8px] uppercase tracking-[0.25em] text-muted/70 lg:max-w-none lg:px-10 lg:text-[12px] xl:px-14">
        <span>Demo · {formatDemoTime(now)}</span>
        <span className="flex gap-4 lg:gap-10">
          <button type="button" onClick={() => onSkip(6)} className={buttonClass}>
            Skip 6 hours
          </button>
          <button type="button" onClick={() => onSkip(24)} className={buttonClass}>
            Skip 1 day
          </button>
        </span>
      </div>
    </div>
  )
}
