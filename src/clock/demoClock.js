// ==========================================================
// demoClock
// The app's sense of "now". It normally equals the real time,
// but for the demo it can be skipped forward so all three
// nudges can be shown live. Later this is replaced by real
// scheduled jobs (AWS EventBridge Scheduler), and getNow()
// will simply return the real time.
// ==========================================================

const hourInMs = 60 * 60 * 1000

// How far ahead of the real time the demo clock has been moved
let skippedMs = 0

// The current (demo) time, as a Date
export function getNow() {
  return new Date(Date.now() + skippedMs)
}

// Move the demo clock forward by a number of hours
export function skipAhead(hours) {
  skippedMs += hours * hourInMs
}
