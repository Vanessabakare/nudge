# Nudge — Project Briefing for Claude Code

## What Nudge is
Nudge reads a user's emails, spots ones about events (meetings, deadlines, things to attend),
and gently nudges the user — up to three times — to add the event to their calendar.
It is conflict-aware: if the new event clashes with something already in the calendar,
Nudge says so and asks what the user wants to do. If the user ignores all three nudges,
Nudge leaves the event alone.

The idea came from missing a mandatory meeting because the email was opened but never acted on.

## Current goal: a demo for Wednesday
We are building the core experience as a demo, deployed on AWS (free tier where possible).
Build in small stages. Do one stage at a time and stop when it is done.

### Faked for the demo (built behind swappable "doorways")
- **Emails**: come from `mockEmailSource` (hard-coded realistic sample emails). Later replaced by a Gmail source using Google OAuth. Do NOT build Gmail OAuth now.
- **Calendar**: Nudge's own calendar (local data first, DynamoDB later). Later replaced by a Google Calendar adapter.
- **Time**: a demo clock with a "skip ahead" control so all three nudges can be shown live. Later replaced by real scheduled jobs (AWS EventBridge Scheduler).

Every fake must have the same function names and return the same data shapes as its future
real version, so swapping it later does not touch the rest of the app.

## Data model (keep to this shape)
```js
event = {
  id,
  title,
  startTime,        // ISO string
  endTime,          // ISO string
  location,
  isVirtual,        // true or false
  sourceEmailId,
  status,           // "spotted" | "nudged" | "added" | "dismissed" | "expired"
  nudges: [         // maximum of three
    { scheduledFor, sentAt, response }   // response: "add" | "dismiss" | null
  ]
}
```

## Core logic (plain, testable functions)
- `findConflicts(newEvent, calendarEvents)` — returns events that overlap.
- `planNudgeTimes(emailReceivedAt, eventStartTime)` — spreads three nudges sensibly; closer events get tighter spacing. No nudge may be scheduled after the event starts.
- `respondToNudge(event, response)` — updates status and nudges.

## Tech stack
- Frontend: React + Vite + Tailwind CSS (mobile-first)
- Backend (Stage 3): AWS Lambda + API Gateway, DynamoDB for storage, Amazon Bedrock to extract event details from email text
- Hosting (Stage 4): AWS Amplify

## Design rules (editorial, minimal, classy)
Inspired by the feel of high-end fashion apps, but Nudge has its own original identity —
never copy another brand's logo, wordmark or fonts.
- Two typefaces with strict roles: a high-contrast serif (Bodoni Moda or Playfair Display) for big moments such as dates and the wordmark; a thin sans-serif (Jost) in UPPERCASE with wide letter-spacing for everything else.
- Huge amounts of empty space. Nothing crowded.
- No shadows, no rounded cards, no gradients. Sharp edges and thin 1px lines.
- Text labels instead of icons where possible (e.g. bottom nav says INBOX, CALENDAR).
- Numbered index lists in the style |01| TITLE.
- One accent colour (warm terracotta), used rarely — only for conflicts and "act now" moments.
- Nudge progress shown as a thin line with stages: SPOTTED → NUDGE 1 → NUDGE 2 → NUDGE 3 → ADDED.
- Splash screen: the "Nudge" wordmark in the serif, very large, that slides into place slightly off-line and then settles (a literal nudge).
- Colour palette: TO CONFIRM — either dark (near-black background, off-white text) or warm cream background with near-black text.

## Coding style
- Simple, readable code over clever abstractions. A beginner should be able to follow it.
- camelCase names. Clear section header comments in each file.
- Small files with one clear job each.
- Before making changes, briefly explain what you are about to do and why.
- After finishing a step, tell me how to run it and what I should see.
- Ask before installing any new library that isn't listed in the tech stack.
- Commit to git after each working step with a clear message.

## Folder structure (aim for this)
```
src/
  components/     # UI pieces (SplashScreen, InboxList, EventDetail, NudgeTracker, CalendarView)
  sources/        # mockEmailSource.js (later gmailEmailSource.js)
  calendar/       # localCalendar.js (later googleCalendar.js)
  logic/          # findConflicts.js, planNudgeTimes.js, respondToNudge.js
  clock/          # demoClock.js (later real scheduling)
  data/           # sample emails and starting calendar events
```

## Stage plan
0. Setup (tools, this file, AWS budget alert)
1. The look — splash, inbox, event detail with nudge tracker, calendar view (fake data)
2. The brain locally — conflict checking, nudge planning, responses
3. Into AWS — Lambda, API Gateway, DynamoDB, Bedrock extraction
4. Deploy on Amplify + demo "skip ahead" mode
5. Polish and rehearse

## After the demo (do not build yet)
Amazon Cognito login, Gmail + Google Calendar connections, real scheduled nudges with
EventBridge Scheduler, push notifications, voice context input.
