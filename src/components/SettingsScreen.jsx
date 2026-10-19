// ==========================================================
// SettingsScreen
// Opened from the round profile button on Home.
// - PROFILE: name and email (sample values for the demo)
// - CONNECTIONS: email and calendar accounts, all coming soon
// - APPEARANCE: the dark / light switch
// - SENT: emails sent from Nudge (e.g. reschedule requests)
// - DEMO CONTROLS: the demo clock's time, SKIP and RESET DEMO
// ==========================================================
import { formatDemoTime } from '../logic/formatDates.js'
import BackLink from './BackLink.jsx'
import ThemeToggle from './ThemeToggle.jsx'

// Sample profile for the demo (real accounts come with Cognito later)
const profile = {
  name: 'Vanessa',
  email: 'vanessa@example.com',
}

const connections = ['Gmail', 'Google Calendar', 'Outlook']

// ---- Small building blocks ----
function Section({ title, children }) {
  return (
    <section className="mt-16">
      <h2 className="text-[12px] uppercase tracking-[0.4em] text-muted lg:text-[12px]">{title}</h2>
      <div className="mt-6 border-b border-line">{children}</div>
    </section>
  )
}

// One line: a label on the left, something on the right
function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-line py-5 lg:py-6">
      <p className="text-[12px] uppercase tracking-[0.3em] text-paper lg:text-[13px]">{label}</p>
      <div className="text-right text-[12px] uppercase tracking-[0.3em] text-muted lg:text-[12px]">
        {children}
      </div>
    </div>
  )
}

// A full-width text button row, e.g. SKIP 6 HOURS
function ActionRow({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-t border-line py-5 text-left text-[12px] uppercase tracking-[0.3em] text-paper hover:text-muted lg:py-6 lg:text-[13px]"
    >
      <span>{label}</span>
      <span className="text-muted">→</span>
    </button>
  )
}

export default function SettingsScreen({
  now,
  theme,
  sentEmails,
  backLabel,
  onToggleTheme,
  onSkip,
  onReset,
  onBack,
}) {
  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20 animate-fade-in lg:mx-0 lg:max-w-3xl lg:px-16 lg:pt-14">
      <BackLink desktopLabel={backLabel} onClick={onBack} />

      <h1 className="mt-16 font-serif text-[clamp(3rem,15vw,4.5rem)] leading-none tracking-tight text-paper lg:text-[6rem]">
        Settings
      </h1>

      {/* ---- Profile ---- */}
      <Section title="Profile">
        <Row label="Name">
          <span className="text-[13px] normal-case tracking-[0.1em] text-paper lg:text-[15px]">{profile.name}</span>
        </Row>
        <Row label="Email">
          <span className="text-[13px] normal-case tracking-[0.05em] lg:text-[15px]">{profile.email}</span>
        </Row>
      </Section>

      {/* ---- Connections ---- */}
      <Section title="Connections">
        {connections.map((name) => (
          <Row key={name} label={name}>
            Coming soon
          </Row>
        ))}
      </Section>

      {/* ---- Appearance ---- */}
      <Section title="Appearance">
        <Row label={theme === 'light' ? 'Light mode' : 'Dark mode'}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </Row>
      </Section>

      {/* ---- Sent emails (so the demo can show the email went) ---- */}
      <Section title={`Sent · ${sentEmails.length}`}>
        {sentEmails.length === 0 ? (
          <p className="border-t border-line py-5 text-[12px] uppercase tracking-[0.3em] text-muted lg:py-6 lg:text-[12px]">
            Nothing sent yet.
          </p>
        ) : (
          sentEmails.map((email) => (
            <div key={email.id} className="border-t border-line py-5 lg:py-6">
              <div className="flex items-baseline justify-between gap-4 text-[12px] uppercase tracking-[0.3em] text-muted lg:text-[12px]">
                <span className="text-[13px] normal-case tracking-[0.05em] lg:text-[15px]">To {email.to}</span>
                <span className="shrink-0">{formatDemoTime(email.sentAt)}</span>
              </div>
              <p className="mt-2 text-[13px] text-paper lg:text-[15px]">{email.subject}</p>
            </div>
          ))
        )}
      </Section>

      {/* ---- Demo controls ---- */}
      <Section title="Demo controls">
        <Row label="Demo time">{formatDemoTime(now)}</Row>
        <ActionRow label="Skip 6 hours" onClick={() => onSkip(6)} />
        <ActionRow label="Skip 1 day" onClick={() => onSkip(24)} />
        <ActionRow label="Reset demo" onClick={onReset} />
      </Section>
    </main>
  )
}
