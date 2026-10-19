// ==========================================================
// Sample calendar (fake data for the demo)
// Events already in the user's calendar, in the same shape as
// events Nudge spots. "Dinner with Ama" deliberately overlaps
// the networking evening (3 days from now, 6pm–8pm).
// Calendar events may also carry organiserName / organiserEmail
// (optional), used when Nudge drafts a reschedule email.
// Built fresh each time (buildSampleCalendar), so the dates are
// right whenever the demo is loaded or reset.
// ==========================================================
import { daysFromNow } from './dateHelpers.js'

export function buildSampleCalendar() {
  return [
    // ---- Gym class tomorrow morning (no clash) ----
    {
      id: 'cal-001',
      title: 'Spin class',
      startTime: daysFromNow(1, 7, 30),
      endTime: daysFromNow(1, 8, 30),
      location: 'Third Space, Soho',
      isVirtual: false,
      sourceEmailId: null,
      status: 'added',
      nudges: [],
    },

    // ---- Dinner in 3 days, 7pm–9pm (clashes with networking) ----
    {
      id: 'cal-002',
      title: 'Dinner with Ama',
      startTime: daysFromNow(3, 19),
      endTime: daysFromNow(3, 21),
      location: 'Dishoom, Kings Cross',
      isVirtual: false,
      sourceEmailId: null,
      // Optional: who arranged it, so Nudge can offer to reschedule by email
      organiserName: 'Ama',
      organiserEmail: 'ama.mensah@example.com',
      status: 'added',
      nudges: [],
    },
  ]
}
