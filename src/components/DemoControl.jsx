// ==========================================================
// DemoControl
// A discreet strip at the very top for the demo: shows the
// demo clock's time, lets the presenter skip ahead so the
// nudges can be shown live, and RESET starts the demo again.
// Removed once real scheduling exists.
// ==========================================================
import { formatDemoTime } from '../logic/formatDates.js'

export default function DemoControl({ now, onSkip, onReset }) {
  // Buttons don't inherit "uppercase" from their parent, so it's set here
  const buttonClass = 'uppercase text-muted/70 hover:text-paper'

  return (
    <div className="fixed inset-x-0 top-0 z-30 h-9 border-b border-line bg-ink">
      <div className="mx-auto flex h-full max-w-md items-center justify-between whitespace-nowrap px-6 text-[8px] uppercase tracking-[0.2em] text-muted/70 lg:max-w-none lg:px-10 lg:text-[12px] lg:tracking-[0.25em] xl:px-14">
        {/* "DEMO ·" only where there's room for it */}
        <span>
          <span className="hidden lg:inline">Demo · </span>
          {formatDemoTime(now)}
        </span>
        <span className="flex gap-3 lg:gap-10">
          <button type="button" onClick={() => onSkip(6)} className={buttonClass}>
            Skip 6 hours
          </button>
          <button type="button" onClick={() => onSkip(24)} className={buttonClass}>
            Skip 1 day
          </button>
          <button type="button" onClick={onReset} className={buttonClass}>
            Reset
          </button>
        </span>
      </div>
    </div>
  )
}
