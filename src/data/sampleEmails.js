// ==========================================================
// Sample emails (fake data for the demo)
// Each event email carries an "extractedEvent" in the shape
// set out in CLAUDE.md. Later, Bedrock will produce these
// from the real email text. Emails with no event have null.
// "preview" is a short opening line for the inbox, like the
// snippet Gmail provides.
//
// Arrival times are chosen for the demo: every event email came
// in yesterday, so each first nudge is due at 8am today. The
// newest email (the newsletter, early this morning) has no
// event, and the demo clock starts just after it, so on a fresh
// load nothing has been nudged yet.
// ==========================================================
import { daysFromNow } from './dateHelpers.js'

export const sampleEmails = [
  // ---- 01: Mandatory department meeting (in person, 2 days) ----
  {
    id: 'email-001',
    sender: 'Dr. Helen Okafor',
    subject: 'Mandatory department meeting — please attend',
    body:
      'Dear all,\n\nThis is a reminder that attendance at the department meeting is mandatory. ' +
      'We will cover next term\'s timetable and assessment changes.\n\n' +
      'Room 3.14, Arts Building, 2:00pm–3:00pm.\n\nBest,\nHelen',
    preview: "Attendance is mandatory — we will cover next term's timetable and assessment changes.",
    receivedAt: daysFromNow(-1, 17, 48), // yesterday evening
    extractedEvent: {
      id: 'event-001',
      title: 'Department meeting',
      startTime: daysFromNow(2, 14),
      endTime: daysFromNow(2, 15),
      location: 'Room 3.14, Arts Building',
      isVirtual: false,
      sourceEmailId: 'email-001',
      status: 'spotted',
      nudges: [],
    },
  },

  // ---- 02: Virtual workshop (5 days) ----
  {
    id: 'email-002',
    sender: 'Learning & Development',
    subject: 'You\'re registered: Presenting with Confidence workshop',
    body:
      'Hi,\n\nThanks for signing up to Presenting with Confidence. ' +
      'The session runs online from 10:00am to 12:00pm. ' +
      'Your Zoom link will be sent the day before.\n\nSee you there,\nThe L&D team',
    preview: 'Thanks for signing up to Presenting with Confidence. Your Zoom link will follow.',
    receivedAt: daysFromNow(-1, 14, 40), // yesterday afternoon
    extractedEvent: {
      id: 'event-002',
      title: 'Presenting with Confidence workshop',
      startTime: daysFromNow(5, 10),
      endTime: daysFromNow(5, 12),
      location: 'Zoom',
      isVirtual: true,
      sourceEmailId: 'email-002',
      status: 'spotted',
      nudges: [],
    },
  },

  // ---- 03: Networking event (3 days, 6pm) — clashes with dinner ----
  {
    id: 'email-003',
    sender: 'Women in Tech London',
    subject: 'Autumn networking evening — save your spot',
    body:
      'Join us for drinks, short talks and plenty of time to meet people from across the industry.\n\n' +
      '6:00pm–8:00pm at The Loft, 12 Shoreditch High Street.\n\n' +
      'Spaces are limited, so do come if you\'ve registered.',
    preview: 'Join us for drinks, short talks and plenty of time to meet people across the industry.',
    receivedAt: daysFromNow(-1, 9, 12), // yesterday morning
    extractedEvent: {
      id: 'event-003',
      title: 'Women in Tech networking evening',
      startTime: daysFromNow(3, 18),
      endTime: daysFromNow(3, 20),
      location: 'The Loft, 12 Shoreditch High Street',
      isVirtual: false,
      sourceEmailId: 'email-003',
      status: 'spotted',
      nudges: [],
    },
  },

  // ---- 04: Shop newsletter (no event — Nudge ignores it) ----
  {
    id: 'email-004',
    sender: 'Marlow & Finch',
    subject: 'New season knitwear is here',
    body:
      'Soft wool, quiet colours, made to last. Discover the new autumn collection ' +
      'online and in store now. Free delivery on orders over £50.',
    preview: 'Soft wool, quiet colours, made to last. Discover the new autumn collection.',
    receivedAt: daysFromNow(0, 6, 10), // early this morning (the newest email)
    extractedEvent: null,
  },

  // ---- 05: Careers fair (9 days) ----
  {
    id: 'email-005',
    sender: 'Careers Service',
    subject: 'Graduate Careers Fair — over 60 employers attending',
    body:
      'Meet employers from tech, finance, media and the public sector. ' +
      'Bring copies of your CV.\n\nMain Hall, Student Union, 11:00am–4:00pm.',
    preview: 'Meet employers from tech, finance, media and the public sector. Bring copies of your CV.',
    receivedAt: daysFromNow(-1, 11, 2), // yesterday late morning
    extractedEvent: {
      id: 'event-005',
      title: 'Graduate Careers Fair',
      startTime: daysFromNow(9, 11),
      endTime: daysFromNow(9, 16),
      location: 'Main Hall, Student Union',
      isVirtual: false,
      sourceEmailId: 'email-005',
      status: 'spotted',
      nudges: [],
    },
  },
]
