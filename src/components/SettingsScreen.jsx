// ==========================================================
// SettingsScreen
// Opened from the round profile button on Home.
// - PROFILE: the user's name (with CHANGE NAME) and email status
// - CONNECTIONS: email and calendar accounts, all coming soon
// - APPEARANCE: the dark / light switch
// - SENT: emails sent from Nudge (e.g. reschedule requests)
// - DEMO CONTROLS: the demo clock's time, SKIP TO NEXT NUDGE,
//   SKIP 6 HOURS / 1 DAY, SIMULATE REPLY (while a reschedule is
//   waiting for an answer) and RESET DEMO
// ==========================================================
import { useState } from 'react'
import { formatDemoTime } from '../logic/formatDates.js'
import BackLink from './BackLink.jsx'
import ThemeToggle from './ThemeToggle.jsx'

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
  userName,
  onChangeName,
  theme,
  sentEmails,
  backLabel,
  onToggleTheme,
  onSkip,
  onSkipToNextNudge,
  hasNextNudge,
  awaitingReplyFrom,
  onSimulateReply,
  onReset,
  onBack,
}) {
  // ---- CHANGE NAME: edit the name in place ----
  const [isEditingName, setIsEditingName] = useState(false)
  const [draftName, setDraftName] = useState(userName)

  function startEditingName() {
    setDraftName(userName)
    setIsEditingName(true)
  }

  function saveName(formEvent) {
    formEvent.preventDefault()
    onChangeName(draftName)
    setIsEditingName(false)
  }

  // ---- Layout ----
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20 animate-fade-in lg:mx-0 lg:max-w-3xl lg:px-16 lg:pt-14">
      <BackLink desktopLabel={backLabel} onClick={onBack} />

      <h1 className="mt-16 font-serif text-[clamp(3rem,15vw,4.5rem)] leading-none tracking-tight text-paper lg:text-[6rem]">
        Settings
      </h1>

      {/* ---- Profile ---- */}
      <Section title="Profile">
        {isEditingName ? (
          // The name row becomes a small form
          <form onSubmit={saveName} className="border-t border-line py-5 lg:py-6">
            <label htmlFor="settings-name" className="text-[12px] uppercase tracking-[0.3em] text-paper lg:text-[13px]">
              Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={draftName}
              onChange={(changeEvent) => setDraftName(changeEvent.target.value)}
              maxLength={40}
              autoFocus
              className="mt-4 w-full border-b border-line bg-transparent pb-2 text-[15px] text-paper outline-none focus:border-paper lg:text-[17px]"
            />
            <div className="mt-5 flex gap-8 text-[12px] uppercase tracking-[0.35em] lg:text-[13px]">
              <button type="submit" className="uppercase text-paper hover:text-muted">
                Save
              </button>
              <button type="button" onClick={() => setIsEditingName(false)} className="uppercase text-muted hover:text-paper">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <Row label="Name">
            <span className="text-[13px] normal-case tracking-[0.1em] text-paper lg:text-[15px]">{userName}</span>
          </Row>
        )}
        <Row label="Email">Not connected yet</Row>
        {!isEditingName && <ActionRow label="Change name" onClick={startEditingName} />}
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
        {hasNextNudge ? (
          <ActionRow label="Skip to next nudge" onClick={onSkipToNextNudge} />
        ) : (
          <Row label="Skip to next nudge">No nudges left</Row>
        )}
        <ActionRow label="Skip 6 hours" onClick={() => onSkip(6)} />
        {/* Pretend the other person has answered the reschedule email */}
        {awaitingReplyFrom && (
          <div className="flex items-center justify-between gap-6 border-t border-line py-5 lg:py-6">
            <p className="text-[12px] uppercase tracking-[0.3em] text-paper lg:text-[13px]">
              Simulate reply · {awaitingReplyFrom}
            </p>
            <div className="flex gap-6 text-[12px] uppercase tracking-[0.3em] lg:text-[13px]">
              <button type="button" onClick={() => onSimulateReply(true)} className="uppercase text-paper hover:text-muted">
                Accept
              </button>
              <button type="button" onClick={() => onSimulateReply(false)} className="uppercase text-paper hover:text-muted">
                Decline
              </button>
            </div>
          </div>
        )}
        <ActionRow label="Skip 1 day" onClick={() => onSkip(24)} />
        <ActionRow label="Reset demo" onClick={onReset} />
      </Section>
    </main>
  )
}
