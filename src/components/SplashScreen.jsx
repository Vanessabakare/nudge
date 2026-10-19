// ==========================================================
// SplashScreen
// Shows the "Nudge" wordmark sliding in slightly off-line,
// settling into place, then fading out. When it has finished
// it calls onFinish so the app can show the home screen.
// ==========================================================
import { useEffect } from 'react'

// How long the whole splash lasts (slide + pause + fade), in ms.
// Keep in step with --animate-splash-out in index.css (2.4s delay + 0.6s fade).
const splashDuration = 3000

export default function SplashScreen({ onFinish }) {
  // ---- Tell the app when the splash is done ----
  useEffect(() => {
    const timer = setTimeout(onFinish, splashDuration)
    return () => clearTimeout(timer)
  }, [onFinish])

  // ---- Layout ----
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-ink animate-splash-out">
      <h1 className="font-serif font-normal leading-none tracking-tight text-paper text-[clamp(5rem,28vw,16rem)] animate-nudge-in">
        Nudge
      </h1>
    </div>
  )
}
