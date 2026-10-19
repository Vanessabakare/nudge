// ==========================================================
// demoClock
// The app's sense of "now". For the demo it can be started at
// a chosen moment (just after the newest email arrived) and
// skipped forward, so all three nudges can be shown live.
// Between skips it ticks along in real time.
// Until startAt() is called, it simply equals the real time.
// Later this is replaced by real scheduled jobs (AWS EventBridge
// Scheduler), and getNow() will just return the real time.
// ==========================================================

const hourInMs = 60 * 60 * 1000

// The demo time the clock was started at, and the real time when
// that happened. null means "not started: use the real time".
let demoStartMs = null
let realStartMs = null

// How far the clock has been skipped forward since it started
let skippedMs = 0

// The current (demo) time, as a Date
export function getNow() {
  if (demoStartMs === null) {
    return new Date(Date.now() + skippedMs)
  }
  const realTimePassed = Date.now() - realStartMs
  return new Date(demoStartMs + realTimePassed + skippedMs)
}

// Start (or restart) the demo clock at a given moment (ISO string)
export function startAt(isoString) {
  demoStartMs = new Date(isoString).getTime()
  realStartMs = Date.now()
  skippedMs = 0
}

// Move the demo clock forward by a number of hours
export function skipAhead(hours) {
  skippedMs += hours * hourInMs
}
