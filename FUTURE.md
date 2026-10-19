# Nudge — making the doorways real

The demo fakes email, calendar, time and AI behind small "doorway" files.
Each real version must keep **the same function names and return the same
data shapes**, so swapping one in does not touch the rest of the app.
This file says exactly how to replace each one.

| Doorway | Demo version (today) | Real version(s) |
|---|---|---|
| Reading email | `src/sources/mockEmailSource.js` | `gmailEmailSource.js`, `outlookEmailSource.js` |
| Sending email | `src/sources/mockEmailSender.js` | `gmailEmailSender.js`, `outlookEmailSender.js` |
| Calendar | sample data held in `App` state | `src/calendar/localCalendar.js` → `googleCalendar.js`, `outlookCalendar.js` |
| Time and nudges | `src/clock/demoClock.js` + `checkNudges` | EventBridge Scheduler |
| Event details from email | hand-written `extractedEvent` in sample data | Amazon Bedrock extraction |
| Reschedule email text | `src/logic/draftRescheduleEmail.js` (template) | Amazon Bedrock drafting |
| Replies to a reschedule | `src/sources/mockReplySimulator.js` + `src/logic/detectReplyOutcome.js` (keywords) | watch the sent email's thread + Bedrock |
| Who the user is | `src/settings/userProfile.js` (name typed on first visit) | Amazon Cognito |

**Golden rule:** the browser never holds Gmail/Outlook tokens. All provider
calls go through our own backend (Lambda + API Gateway). The doorway files
in `src/` call *our* API, which calls Google or Microsoft.

---

## 1. Login — Amazon Cognito

- Create a Cognito **user pool** with the managed login pages.
- Add **Google** and **Microsoft** (OIDC) as sign-in options, plus email/password.
- The frontend gets Cognito tokens; every call to our API sends the ID token,
  and API Gateway checks it with a Cognito authorizer.
- **Important:** signing in *with* Google through Cognito proves who the user is,
  but does **not** give us permission to read their Gmail. Connecting Gmail or
  Outlook is a separate step (the CONNECTIONS rows in Settings), described below.
- Make `getUserName()` in `src/settings/userProfile.js` return the signed-in user's
  name (from the Cognito ID token) instead of the one typed on the onboarding screen.
  Once sign-in exists, the onboarding screen can be skipped for signed-in users.

## 2. Connecting an account (shared by Gmail, Outlook and both calendars)

1. User taps CONNECT in Settings → our API starts an OAuth "authorization code"
   flow with the provider, asking only for the scopes listed below.
2. The provider redirects back to an API Gateway route; a Lambda swaps the code
   for an **access token + refresh token**.
3. Store the refresh token **encrypted** (AWS KMS) in DynamoDB, keyed by the
   Cognito user id. Never send it to the browser.
4. Later Lambdas use the refresh token to get short-lived access tokens.
5. A DISCONNECT button revokes the token with the provider and deletes it.

## 3. Reading email — `gmailEmailSource.js` / `outlookEmailSource.js`

Must export `async getEmails()` returning the same array shape as today:
`{ id, sender, subject, body, preview, receivedAt, extractedEvent }`, newest first.

- **Gmail:** Gmail API `users.messages.list` + `users.messages.get`.
  `preview` = Gmail's `snippet`. Scope: `gmail.readonly`.
  For new mail, use `users.watch` (Gmail push via Google Cloud Pub/Sub) or poll
  with `users.history.list`.
- **Outlook:** Microsoft Graph `GET /me/messages` (`bodyPreview` = `preview`).
  Permission: `Mail.Read` (+ `offline_access` for refresh tokens).
  For new mail, use Graph change notifications (subscriptions) or delta queries.
- `extractedEvent` is filled by the Bedrock extraction step (section 7), not by the source.
- Only read what we need; don't store full email bodies longer than necessary.

## 4. Sending email — `gmailEmailSender.js` / `outlookEmailSender.js`

Must export `async sendEmail({ to, subject, body })` returning `{ id }`, exactly
like `mockEmailSender.js`.

- **The user must always tap SEND.** Nudge drafts; it never sends on its own.
  Keep the Reschedule screen's SEND EMAIL button as the only trigger.
- **Gmail:** `users.messages.send` with a base64url-encoded RFC 2822 message.
  Scope: `gmail.send` (send only — it cannot read the mailbox).
- **Outlook:** Graph `POST /me/sendMail`. Permission: `Mail.Send`.
- Errors (expired token, bad address) should throw with a readable message;
  the Reschedule screen already shows it in terracotta and lets the user retry.
- Optionally reply in the original thread (Gmail `threadId`, Graph `createReply`)
  so the organiser sees the context.

## 4b. Detecting replies to a reschedule request

In the demo, Settings → SIMULATE REPLY creates the reply (`mockReplySimulator.js`)
and `detectReplyOutcome.js` reads it with a keyword check. In the real app:

- When `sendEmail` sends the request, keep the provider's ids on the event's
  `reschedule` state: Gmail's message `id` and **`threadId`**, or Outlook's
  `id` and **`conversationId`**. (Today `sentEmailId` holds the mock id.)
- **Watch that thread** for new messages from the other person: Gmail
  `users.watch` (Pub/Sub) or `users.history.list`, filtered to the thread;
  Outlook change notifications or `GET /me/messages?$filter=conversationId eq '…'`.
- When a reply arrives, a Lambda passes its text to `detectReplyOutcome`, which
  becomes a Bedrock call (section 7) returning `"accepted" | "declined" | "unclear"`
  (and, ideally, any new time they suggest). "unclear" leaves the request as
  proposed and simply shows the reply in the inbox.
- Then set the event's `reschedule.status` and push a notification; the app shows
  the same reply card as the demo.
- **Never change the calendar on a reply alone.** The event only moves when the
  user taps UPDATE CALENDAR (`updateCalendar` → the calendar adapter's
  `updateEvent`). If they decline, PICK ANOTHER TIME offers new slots, leaving
  out every slot already turned down (`reschedule.declinedSlots`).

## 5. Calendar — `localCalendar.js` → `googleCalendar.js` / `outlookCalendar.js`

Today the calendar is sample data held in `App` state (`calendarEvents`).
First pull it out into `src/calendar/localCalendar.js` with:

```js
async getEvents({ from, to })        // -> [event]  (same shape as sampleCalendar)
async addEvent(event)                // -> event
async updateEvent(eventId, changes)  // -> event   (used by rescheduling)
async removeEvent(eventId)           // -> void
```

Then `App` calls these instead of `setCalendarEvents` directly
(`respond('add')` → `addEvent`, `updateCalendar` → `updateEvent`; `sendReschedule` only sends the email and records the proposal).

- **Google Calendar:** Calendar API `events.list / insert / patch / delete` on
  the `primary` calendar. Scope: `calendar.events`. Map `summary` → `title`,
  `start.dateTime` → `startTime`, `organizer.email` → `organiserEmail`.
- **Outlook:** Graph `/me/calendarView`, `POST /me/events`, `PATCH /me/events/{id}`.
  Permission: `Calendars.ReadWrite`. Map `subject` → `title`,
  `organizer.emailAddress` → `organiserName` / `organiserEmail`.
- Store Nudge's own fields (`status`, `nudges`, `sourceEmailId`) in DynamoDB,
  not in the user's calendar.
- `findConflicts` and `findFreeSlots` stay exactly as they are: they only need
  the event list.

## 6. Real nudges — Amazon EventBridge Scheduler

Replaces `demoClock.js` and the 30-second `checkNudges` tick.

- When an event is spotted, run `planNudgeTimes` on the server and create
  **one one-time schedule per nudge**: `at(2026-10-20T08:00:00)` with the user's
  time zone, target = a "send nudge" Lambda, payload = `{ userId, eventId, nudgeIndex }`,
  and "delete after completion" turned on.
- The Lambda sets that nudge's `sentAt`, moves the status to `nudged`, and sends a
  push notification (Web Push for the web app; Amazon SNS for mobile later).
- On ADD / NOT FOR ME, delete the event's remaining schedules.
- One more schedule at the event's start time marks it `expired` if unanswered
  (this is what `checkNudges` does today).
- `demoClock.getNow()` becomes simply `new Date()`; remove the demo controls from Settings.

## 7. AI with Amazon Bedrock

**Extraction (Stage 3):** a Lambda sends each new email's text to a Claude model
on Bedrock and asks for JSON in the exact `extractedEvent` shape (or `null`).
Validate the JSON before saving; if it doesn't parse or a date is missing, treat it as `null`.

**Drafting reschedule emails:** replace the template in `draftRescheduleEmail.js`
with a Bedrock call that is given the event, the chosen slot, the organiser's
name and the original thread, and returns `{ to, subject, body }`.
Keep the same function name and shape (it becomes `async`). Rules:
- the user always sees the draft, can EDIT it, and must tap SEND;
- `to` always comes from the calendar data, never from the model;
- keep the template as a fallback if Bedrock is unavailable.

## 8. Google verification (needed before real users)

Set up in Google Cloud Console → OAuth consent screen.

- **Reading Gmail (`gmail.readonly`) is a *restricted* scope.** Going public needs
  Google's OAuth verification **and an annual third-party security assessment**
  (CASA), because Nudge reads mail on its servers. Budget time and money for this.
- **Sending (`gmail.send`) is a *sensitive* scope.** It needs OAuth verification
  (privacy policy, home page, a demo video, a reason for each scope) but **not**
  the security assessment.
- **Google Calendar (`calendar.events`) is also sensitive.**
- **Testing mode** lets you use these scopes before verification with **up to
  100 test users** (added by email in the console). Users see an "unverified app"
  warning, and refresh tokens expire after 7 days, so test users will need to
  reconnect weekly.
- Ask for the fewest scopes possible; every extra scope slows verification.

## 9. Microsoft (Outlook) notes

- Register the app in **Microsoft Entra ID**, choose personal + work accounts,
  and request delegated permissions `Mail.Read`, `Mail.Send`, `Calendars.ReadWrite`, `offline_access`.
- Complete **publisher verification** so users don't see an unverified warning.
- Some work or school accounts need an administrator to approve the permissions.

## 10. Checklist when swapping a doorway

1. Create the real file next to the mock, with the same exports.
2. Change one import line (e.g. in `App.jsx`) from the mock to the real file.
3. Check the returned shape matches the mock exactly (same field names, ISO date strings).
4. Keep the mock for the demo and for testing.
