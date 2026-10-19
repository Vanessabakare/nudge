// ==========================================================
// DesktopSidebar
// The left column on wide screens (1024px and up): a large
// serif title, a small subtitle, and the navigation as a
// numbered list. On desktop it replaces the bottom nav; on
// phones it is hidden entirely.
// ==========================================================

const tabs = ['Inbox', 'Calendar']

// Turns 0 into "01", 1 into "02"
function formatIndex(position) {
  return String(position + 1).padStart(2, '0')
}

export default function DesktopSidebar({ activeTab, subtitle, onSelectTab }) {
  return (
    <aside className="hidden lg:sticky lg:top-9 lg:block lg:h-[calc(100vh-2.25rem)] lg:w-[26%] lg:shrink-0 lg:border-r lg:border-line lg:px-10 lg:pt-20 xl:px-14">
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
    </aside>
  )
}
