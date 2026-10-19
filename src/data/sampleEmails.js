// ==========================================================
// Sample emails (fake data for the demo)
// Each event email carries an "extractedEvent" in the shape
// set out in CLAUDE.md. Later, Bedrock will produce these
// from the real email text. Emails with no event have null.
// "preview" is a short opening line for the inbox, like the
// snippet Gmail provides.
//
// Arrival times are chosen for the demo, which starts at the real
// current time: all 10 event emails arrived earlier TODAY (always
// after midnight and before now), so each first nudge — 8am the
// morning after — is still ahead, and every event starts as
// EVENT SPOTTED. Everyday emails arrived on earlier days.
// The list is built fresh each time (buildSampleEmails), so the
// times are right whenever the demo is loaded or reset.
// ==========================================================
import { daysFromNow, earlierToday } from './dateHelpers.js'

export function buildSampleEmails() {
  return [
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
      receivedAt: earlierToday(25, 0.15), // earlier today: the newest email
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
      receivedAt: earlierToday(70, 0.35), // earlier today
      extractedEvent: {
        id: 'event-002',
        title: 'Presenting with Confidence workshop',
        startTime: daysFromNow(5, 10),
        endTime: daysFromNow(5, 12),
        location: 'Zoom',
        isVirtual: true,
        // Optional: where to join a virtual event (a harmless sample link)
        meetingLink: 'https://example.com/join/presenting-with-confidence',
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
      receivedAt: earlierToday(150, 0.6), // earlier today
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
      receivedAt: daysFromNow(-1, 6, 10), // yesterday morning
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
      receivedAt: earlierToday(245, 0.85), // earlier today
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
    // More event emails, 12–38 days ahead, so the next month has
    // things in it too. They also arrived earlier today, so they
    // start as EVENT SPOTTED. The birthday dinner clashes with the
    // family call in the calendar: a second clash, in the later month.
    // ==========================================================

    // ---- 15: Dentist appointment (in person, 20 minutes, 12 days) ----
    {
      id: 'email-015',
      sender: 'Smile Studio Dental',
      subject: 'Appointment confirmed — check-up and clean',
      body:
        'Hello,\n\nThis is to confirm your check-up and clean with Dr. Patel. ' +
        'Please arrive 5 minutes early and bring a list of any medicines you take.\n\n' +
        'Smile Studio Dental, 48 Upper Street, 9:40am–10:00am.\n\n' +
        'To change your appointment, please give us 24 hours\' notice.',
      preview: 'This is to confirm your check-up and clean with Dr. Patel. Please arrive 5 minutes early.',
      receivedAt: earlierToday(40, 0.25), // earlier today
      extractedEvent: {
        id: 'event-015',
        title: 'Dentist check-up',
        startTime: daysFromNow(12, 9, 40),
        endTime: daysFromNow(12, 10, 0),
        location: 'Smile Studio Dental, 48 Upper Street',
        isVirtual: false,
        sourceEmailId: 'email-015',
        status: 'spotted',
        nudges: [],
      },
    },

    // ---- 16: Job interview (virtual on Teams, 45 minutes, 16 days) ----
    {
      id: 'email-016',
      sender: 'Northlight Studio · Talent Team',
      subject: 'Interview invitation — Junior Product Designer',
      body:
        'Hi,\n\nThank you for applying for the Junior Product Designer role. ' +
        'We would love to invite you to a 45-minute video interview with our design lead.\n\n' +
        'Microsoft Teams, 11:00am–11:45am. The joining link is in the calendar invite.\n\n' +
        'Best wishes,\nThe Talent Team',
      preview: 'We would love to invite you to a 45-minute video interview with our design lead.',
      receivedAt: earlierToday(95, 0.45), // earlier today
      extractedEvent: {
        id: 'event-016',
        title: 'Interview · Junior Product Designer',
        startTime: daysFromNow(16, 11),
        endTime: daysFromNow(16, 11, 45),
        location: 'Microsoft Teams',
        isVirtual: true,
        // A harmless sample link for JOIN
        meetingLink: 'https://example.com/join/northlight-interview',
        sourceEmailId: 'email-016',
        status: 'spotted',
        nudges: [],
      },
    },

    // ---- 17: Birthday dinner (in person, evening, 22 days) — clashes with the family call ----
    {
      id: 'email-017',
      sender: 'Zara Ahmed',
      subject: 'Come celebrate my birthday!',
      body:
        'Hey you!\n\nI\'m turning 30 and doing a dinner with my favourite people. ' +
        'Would love you to be there.\n\n' +
        'Bancone, Covent Garden, from 7:30pm until late (we\'ll head off around 10).\n\n' +
        'Let me know!\nZara x',
      preview: "I'm turning 30 and doing a dinner with my favourite people. Would love you to be there.",
      receivedAt: earlierToday(130, 0.5), // earlier today
      extractedEvent: {
        id: 'event-017',
        title: "Zara's birthday dinner",
        startTime: daysFromNow(22, 19, 30),
        endTime: daysFromNow(22, 22),
        location: 'Bancone, Covent Garden',
        isVirtual: false,
        sourceEmailId: 'email-017',
        status: 'spotted',
        nudges: [],
      },
    },

    // ---- 18: Guest lecture (in person, afternoon, 27 days) ----
    {
      id: 'email-018',
      sender: 'School of Computing',
      subject: 'Guest lecture: Designing for Trust in AI',
      body:
        'Dear students,\n\nWe are delighted to welcome Professor Lina Osei for a guest lecture on ' +
        'designing trustworthy AI products, followed by questions.\n\n' +
        'Lecture Theatre B, Main Building, 2:00pm–3:30pm. All welcome.',
      preview: 'We are delighted to welcome Professor Lina Osei for a guest lecture on trustworthy AI.',
      receivedAt: earlierToday(190, 0.7), // earlier today
      extractedEvent: {
        id: 'event-018',
        title: 'Guest lecture · Designing for Trust in AI',
        startTime: daysFromNow(27, 14),
        endTime: daysFromNow(27, 15, 30),
        location: 'Lecture Theatre B, Main Building',
        isVirtual: false,
        sourceEmailId: 'email-018',
        status: 'spotted',
        nudges: [],
      },
    },

    // ---- 19: Volunteer induction (in person, morning, 33 days) ----
    {
      id: 'email-019',
      sender: 'Islington Community Food Bank',
      subject: 'Welcome! Your volunteer induction',
      body:
        'Hi there,\n\nThank you so much for signing up to volunteer. Your induction covers safety, ' +
        'how the warehouse works and meeting the team. Wear comfortable shoes.\n\n' +
        'Community Food Bank, 9 Mill Lane, 10:00am–12:00pm.\n\nSee you soon,\nKemi',
      preview: 'Thank you so much for signing up to volunteer. Your induction covers safety and the team.',
      receivedAt: earlierToday(280, 0.9), // earlier today
      extractedEvent: {
        id: 'event-019',
        title: 'Volunteer induction',
        startTime: daysFromNow(33, 10),
        endTime: daysFromNow(33, 12),
        location: 'Community Food Bank, 9 Mill Lane',
        isVirtual: false,
        sourceEmailId: 'email-019',
        status: 'spotted',
        nudges: [],
      },
    },

    // ---- 20: Cloud computing webinar (virtual, 1 hour, 38 days) ----
    {
      id: 'email-020',
      sender: 'Cloud Skills Hub',
      subject: 'Your place is booked: Cloud Computing for Beginners',
      body:
        'Thanks for registering for Cloud Computing for Beginners, a free one-hour webinar ' +
        'covering servers, storage and serverless in plain English.\n\n' +
        'Online, 1:00pm–2:00pm. Your joining link will work 10 minutes before the start.',
      preview: 'Thanks for registering for Cloud Computing for Beginners, a free one-hour webinar.',
      receivedAt: earlierToday(330, 0.95), // earlier today
      extractedEvent: {
        id: 'event-020',
        title: 'Webinar · Cloud Computing for Beginners',
        startTime: daysFromNow(38, 13),
        endTime: daysFromNow(38, 14),
        location: 'Online webinar',
        isVirtual: true,
        // A harmless sample link for JOIN
        meetingLink: 'https://example.com/join/cloud-computing-webinar',
        sourceEmailId: 'email-020',
        status: 'spotted',
        nudges: [],
      },
    },

    // ==========================================================
    // Everyday emails with no event in them (Nudge ignores these).
    // They all arrived on earlier days.
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
      receivedAt: daysFromNow(-1, 6, 0), // yesterday morning
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
}
