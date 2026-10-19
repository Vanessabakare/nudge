// ==========================================================
// BottomNav
// Text-only navigation fixed to the bottom of the screen.
// The active tab is off-white and underlined; the others are muted.
// Tapping a tab tells the app to switch to it.
// Phone only: on desktop the DesktopSidebar takes its place.
// ==========================================================

const tabs = ['Home', 'Inbox', 'Calendar']

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-ink lg:hidden">
      <div className="mx-auto flex max-w-md justify-around py-6">
        {tabs.map((tab) => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectTab(tab)}
              aria-current={isActive ? 'page' : undefined}
              className={
                'border-b pb-1 text-[12px] uppercase tracking-[0.4em] ' +
                (isActive ? 'border-paper text-paper' : 'border-transparent text-muted hover:text-paper')
              }
            >
              {tab}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
