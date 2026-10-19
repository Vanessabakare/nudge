// ==========================================================
// ThemeToggle
// A sliding switch between dark (moon, left) and light (sun,
// right). A square block slides behind the active side.
// Sharp edges and 1px lines, to match the rest of Nudge.
// size: "regular" (Settings) or "small" (desktop left column).
// ==========================================================

// ---- The two small line drawings ----
function MoonIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5Z" />
    </svg>
  )
}

function SunIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="8" cy="8" r="2.75" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06" />
    </svg>
  )
}

const sizes = {
  regular: { track: 'h-9 w-[4.5rem]', half: 'w-9', icon: 'h-4 w-4' },
  small: { track: 'h-7 w-14', half: 'w-7', icon: 'h-3.5 w-3.5' },
}

export default function ThemeToggle({ theme, onToggle, size = 'regular' }) {
  const isLight = theme === 'light'
  const sizing = sizes[size]

  // The active side's icon sits on the solid block, so it uses the background colour
  const iconColour = (isActive) => (isActive ? 'text-ink' : 'text-muted')

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Light mode"
      onClick={onToggle}
      className={`relative flex shrink-0 border border-paper/50 ${sizing.track}`}
    >
      {/* The sliding block */}
      <span
        className={`absolute inset-y-0 left-0 bg-paper transition-transform duration-300 ease-out ${sizing.half} ${
          isLight ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Moon on the left, sun on the right */}
      <span className={`relative flex items-center justify-center ${sizing.half} ${iconColour(!isLight)}`}>
        <MoonIcon className={sizing.icon} />
      </span>
      <span className={`relative flex items-center justify-center ${sizing.half} ${iconColour(isLight)}`}>
        <SunIcon className={sizing.icon} />
      </span>
    </button>
  )
}
