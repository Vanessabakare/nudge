// ==========================================================
// OnboardingScreen
// Shown once, after the splash, when no name has been saved:
// "What should we call you?" with one input, CONTINUE, and a
// quieter SKIP (which carries on as Guest).
// ==========================================================
import { useState } from 'react'

export default function OnboardingScreen({ onContinue, onSkip }) {
  const [name, setName] = useState('')
  const hasName = name.trim().length > 0

  function submit(formEvent) {
    formEvent.preventDefault() // stay on the page; Enter also submits
    if (hasName) onContinue(name)
  }

  // ---- Layout ----
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16 animate-fade-in lg:max-w-xl">
      <p className="text-[12px] uppercase tracking-[0.4em] text-muted">Welcome to Nudge</p>
      <h1 className="mt-6 font-serif text-[clamp(2.75rem,12vw,4rem)] leading-[1.05] tracking-tight text-paper lg:text-[5rem]">
        What should we call you?
      </h1>

      <form onSubmit={submit} className="mt-14">
        <label htmlFor="user-name" className="sr-only">
          Your name
        </label>
        <input
          id="user-name"
          type="text"
          value={name}
          onChange={(changeEvent) => setName(changeEvent.target.value)}
          placeholder="Your first name"
          autoComplete="given-name"
          maxLength={40}
          autoFocus
          className="w-full border-b border-line bg-transparent pb-3 text-[18px] text-paper outline-none placeholder:text-muted focus:border-paper lg:text-[22px]"
        />

        <button
          type="submit"
          disabled={!hasName}
          className="mt-12 w-full border-y border-line py-5 text-[12px] uppercase tracking-[0.35em] text-paper hover:bg-paper hover:text-ink disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-paper lg:text-[13px]"
        >
          Continue
        </button>
      </form>

      <button
        type="button"
        onClick={onSkip}
        className="mt-6 self-center text-[12px] uppercase tracking-[0.35em] text-muted hover:text-paper lg:text-[13px]"
      >
        Skip
      </button>
    </main>
  )
}
