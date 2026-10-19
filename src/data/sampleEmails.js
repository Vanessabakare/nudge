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

  // ==========================================================
  // Everyday emails with no event in them (Nudge ignores these).
  // None arrives later than the newsletter above, so the demo
  // still starts just after 6:10am today.
  // ==========================================================

  // ---- 06: News briefing ----
  {
    id: 'email-006',
    sender: 'The Observer',
    subject: 'Your morning briefing',
    body:
      'Good morning. Here are the stories you need to know today: the latest from Westminster, ' +
      'a new report on city housing, and the weekend\'s best reads.',
    preview: 'Good morning. Here are the stories you need to know today, from Westminster to housing.',
    receivedAt: daysFromNow(0, 6, 0), // early this morning
    extractedEvent: null,
  },

  // ---- 07: Order shipped ----
  {
    id: 'email-007',
    sender: 'ASOS',
    subject: 'Your order is on its way',
    body:
      'Good news — your order #48213 has shipped and should arrive within 2–3 working days. ' +
      'Track your parcel any time in My Account.',
    preview: 'Good news — your order #48213 has shipped and should arrive within 2–3 working days.',
    receivedAt: daysFromNow(-1, 20, 21), // last night
    extractedEvent: null,
  },

  // ---- 08: Food delivery receipt ----
  {
    id: 'email-008',
    sender: 'Deliveroo',
    subject: 'Your receipt from Dishoom',
    body:
      'Thanks for ordering with Deliveroo. Total paid: £24.60. ' +
      'We hope you enjoyed your meal — rate your order in the app.',
    preview: 'Thanks for ordering with Deliveroo. Total paid: £24.60.',
    receivedAt: daysFromNow(-1, 19, 42), // yesterday evening
    extractedEvent: null,
  },

  // ---- 09: Bank statement ----
  {
    id: 'email-009',
    sender: 'Monzo',
    subject: 'Your monthly statement is ready',
    body:
      'Your statement for last month is now available. ' +
      'Open the app to view or download it as a PDF.',
    preview: 'Your statement for last month is now available to view in the app.',
    receivedAt: daysFromNow(-1, 8, 30), // yesterday morning
    extractedEvent: null,
  },

  // ---- 10: Library reminder (no event: the loan renews itself) ----
  {
    id: 'email-010',
    sender: 'University Library',
    subject: 'Your loans have been renewed',
    body:
      'Good news: the 3 books on your account have been renewed automatically. ' +
      'There is nothing you need to do. You can see your loans any time in My Library.',
    preview: 'The 3 books on your account have been renewed automatically. Nothing to do.',
    receivedAt: daysFromNow(-2, 16, 5), // two days ago
    extractedEvent: null,
  },

  // ---- 11: Weekly playlist ----
  {
    id: 'email-011',
    sender: 'Spotify',
    subject: 'Your Discover Weekly is ready',
    body:
      'Thirty new songs picked just for you, refreshed every Monday. ' +
      'Press play and find your next favourite.',
    preview: 'Thirty new songs picked just for you, refreshed every week.',
    receivedAt: daysFromNow(-2, 9, 0), // two days ago
    extractedEvent: null,
  },

  // ---- 12: Professional network ----
  {
    id: 'email-012',
    sender: 'LinkedIn',
    subject: 'You appeared in 9 searches this week',
    body:
      'Recruiters and people in your network found your profile 9 times this week. ' +
      'See who\'s been looking.',
    preview: 'Recruiters and people in your network found your profile 9 times this week.',
    receivedAt: daysFromNow(-3, 12, 15), // three days ago
    extractedEvent: null,
  },

  // ---- 13: Train ticket (a renewal, nothing to add) ----
  {
    id: 'email-013',
    sender: 'Trainline',
    subject: 'Your season ticket renewal is confirmed',
    body:
      'Your monthly season ticket has been renewed and is ready in the app. ' +
      'It is valid on all routes covered by your current ticket.',
    preview: 'Your monthly season ticket has been renewed and is ready in the app.',
    receivedAt: daysFromNow(-3, 7, 45), // three days ago
    extractedEvent: null,
  },

  // ---- 14: Fitness summary ----
  {
    id: 'email-014',
    sender: 'Strava',
    subject: 'Your weekly summary',
    body:
      'You were active on 4 days last week and covered 23.4 km in total. ' +
      'Keep the streak going.',
    preview: 'You were active on 4 days last week and covered 23.4 km in total.',
    receivedAt: daysFromNow(-4, 18, 30), // four days ago
    extractedEvent: null,
  },
]
