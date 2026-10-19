// ==========================================================
// DesktopSidebar
// The left column on wide screens (1024px and up): a large
// serif title, a small subtitle, and the navigation as a
// numbered list. On desktop it replaces the bottom nav; on
// phones it is hidden entirely.
// At the bottom: a small version of the dark / light switch.
// ==========================================================
import ThemeToggle from './ThemeToggle.jsx'

const tabs = ['Home', 'Inbox', 'Calendar']

// Turns 0 into "01", 1 into "02", and so on
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

export default function DesktopSidebar({ activeTab, subtitle, theme, onSelectTab, onToggleTheme }) {
  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[26%] lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:px-10 lg:pt-20 lg:pb-10 xl:px-14">
      {/* ---- Title and subtitle ---- */}
      <h1 className="font-serif text-[clamp(2.75rem,4.2vw,5rem)] leading-none tracking-tight text-paper">
        {activeTab}
      </h1>
      <p className="mt-5 text-[12px] uppercase tracking-[0.35em] text-muted">{subtitle}</p>

      {/* ---- Navigation, e.g. |01| INBOX ---- */}
      <nav className="mt-20">
        <ol className="space-y-5">
          {tabs.map((tab, position) => {
            const isActive = tab === activeTab
            return (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => onSelectTab(tab)}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    'flex gap-5 text-[13px] uppercase tracking-[0.4em] ' +
                    (isActive ? 'text-paper' : 'text-muted hover:text-paper')
                  }
                >
                  <span className="tracking-[0.2em]">|{formatIndex(position)}|</span>
                  <span>{tab}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* ---- Small dark / light switch, pinned to the bottom ---- */}
      <div className="mt-auto flex items-center gap-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} size="small" />
        <span className="text-[12px] uppercase tracking-[0.35em] text-muted">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      </div>
    </aside>
  )
}
