// ==========================================================
// App
// Holds the app's shared state (emails, spotted events, the
// calendar and the current demo time) and decides which screen
// to show: splash -> home (HOME, INBOX or CALENDAR tab) <-> detail
// screens, Reschedule and Settings. When a nudge is waiting for an
// answer, a nudge card appears over the home screens.
//
// Phone: one column, bottom nav, detail screens fill the screen.
// Desktop (1024px+): a left column with title and numbered nav;
// everything else appears in the right column.
// ==========================================================
import { useEffect, useState } from 'react'
import { getEmails } from './sources/mockEmailSource.js'
import { buildSampleCalendar } from './data/sampleCalendar.js'
import { getNow, skipAhead, startAt } from './clock/demoClock.js'
import { planNudgeTimes } from './logic/planNudgeTimes.js'
import { checkNudges } from './logic/checkNudges.js'
import { respondToNudge } from './logic/respondToNudge.js'
import { findLatestWaitingNudge } from './logic/findLatestWaitingNudge.js'
import { findNextNudgeTime } from './logic/findNextNudgeTime.js'
import { formatMonthYear } from './logic/formatDates.js'
import { isWaitingForAnswer } from './logic/statusLabel.js'
import { findConflicts } from './logic/findConflicts.js'
import { sendEmail } from './sources/mockEmailSender.js'
import { applyTheme, getSavedTheme, saveTheme } from './settings/theme.js'
import { clearSavedDemoState, takeResetRequestFromUrl } from './settings/demoState.js'
import { getUserName, guestName, setUserName } from './settings/userProfile.js'
import SplashScreen from './components/SplashScreen.jsx'
import OnboardingScreen from './components/OnboardingScreen.jsx'
import DesktopSidebar from './components/DesktopSidebar.jsx'
import NudgeCard from './components/NudgeCard.jsx'
import SettingsScreen from './components/SettingsScreen.jsx'
import RescheduleScreen from './components/RescheduleScreen.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import InboxList from './components/InboxList.jsx'
import CalendarView from './components/CalendarView.jsx'
import MonthGrid from './components/MonthGrid.jsx'
import EventDetail from './components/EventDetail.jsx'
import CalendarEventDetail from './components/CalendarEventDetail.jsx'
import ConfirmationScreen from './components/ConfirmationScreen.jsx'
import BottomNav from './components/BottomNav.jsx'

// How often the clock refreshes on its own, in ms
const clockRefreshMs = 30 * 1000

// Gives an event its three planned nudges (none sent or answered yet)
function withPlannedNudges(event, email) {
  const times = planNudgeTimes(email.receivedAt, event.startTime)
  const nudges = times.map((time) => ({ scheduledFor: time, sentAt: null, response: null }))
  return { ...event, nudges }
}

export default function App() {
  // ---- Shared state ----
  const [emails, setEmails] = useState([])
  const [events, setEvents] = useState([])
  const [calendarEvents, setCalendarEvents] = useState(buildSampleCalendar)
  const [now, setNow] = useState(() => getNow().toISOString())

  // Emails sent from Nudge (shown under SENT in Settings), newest first
  const [sentEmails, setSentEmails] = useState([])

  // ---- The user's name (asked once, remembered in the browser) ----
  // null means a first visit: show the onboarding screen
  const [userName, setUserNameState] = useState(getUserName)

  function saveUserName(name) {
    setUserNameState(setUserName(name))
  }

  // ---- Dark or light mode (remembered in the browser) ----
  const [theme, setTheme] = useState(getSavedTheme)

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  // ---- Which screen is showing ----
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('Home') // "Home" | "Inbox" | "Calendar"
  const [screen, setScreen] = useState('home') // "home" | "detail" | "calendarEvent" | "reschedule" | "confirmation" | "settings"
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [selectedCalendarEventId, setSelectedCalendarEventId] = useState(null)

  // The "done" moment: { event, response: "add" | "dismiss" | "sent", returnTo: "home" | "detail" }
  const [confirmation, setConfirmation] = useState(null)

  // Rescheduling: which new event caused the clash, and where to go
  // back to afterwards ("home" from a nudge card, "detail" from EventDetail)
  const [rescheduleFor, setRescheduleFor] = useState(null) // { newEventId, returnTo }

  // The day picked in the month grid (null = show the grid)
  const [selectedDay, setSelectedDay] = useState(null)

  // Nudge cards the user has closed, e.g. "event-001-nudge-1"
  const [closedNudges, setClosedNudges] = useState([])

  // ---- Start (or restart) the demo ----
  // Starts the demo clock at the real current time, loads the emails
  // (which arrived earlier today, so no nudge is due yet), and plans
  // each event's nudges.
  function startDemo() {
    getEmails().then((loadedEmails) => {
      startAt(new Date().toISOString())
      const demoNow = getNow().toISOString()

      const plannedEvents = loadedEmails
        .filter((email) => email.extractedEvent)
        .map((email) => withPlannedNudges(email.extractedEvent, email))

      setEmails(loadedEmails)
      setNow(demoNow)
      setEvents(checkNudges(plannedEvents, demoNow))
    })
  }

  // On first load, also honour ?reset in the address
  useEffect(() => {
    if (takeResetRequestFromUrl()) {
      clearSavedDemoState()
    }
    startDemo()
  }, [])

  // RESET DEMO in Settings: back to the very start, without the splash.
  // The name and the dark/light choice are preferences, so they are kept.
  function resetDemo() {
    clearSavedDemoState()
    setCalendarEvents(buildSampleCalendar())
    setSentEmails([])
    setClosedNudges([])
    setActiveTab('Home')
    setSelectedDay(null)
    setScreen('home')
    window.scrollTo(0, 0)
    startDemo()
  }

  // ---- Keep the clock ticking, and send nudges as they fall due ----
  function refreshClock() {
    const newNow = getNow().toISOString()
    setNow(newNow)
    setEvents((current) => checkNudges(current, newNow))
  }

  useEffect(() => {
    const timer = setInterval(refreshClock, clockRefreshMs)
    return () => clearInterval(timer)
  }, [])

  function skip(hours) {
    skipAhead(hours)
    refreshClock()
  }

  // SKIP TO NEXT NUDGE: move the clock to one minute after the next
  // nudge is due (does nothing if no nudges are left)
  function skipToNextNudge() {
    const nextTime = findNextNudgeTime(events, now)
    if (!nextTime) return
    const hoursAway = (new Date(nextTime) - getNow()) / (60 * 60 * 1000)
    skip(hoursAway + 1 / 60)
  }

  // ---- Things worked out from state ----
  const selectedEvent = events.find((event) => event.id === selectedEventId)
  const selectedEmail =
    selectedEvent && emails.find((email) => email.id === selectedEvent.sourceEmailId)
  const selectedCalendarEvent = calendarEvents.find(
    (calendarEvent) => calendarEvent.id === selectedCalendarEventId,
  )
  const waitingNudge = findLatestWaitingNudge(events, closedNudges)

  // While rescheduling: the new event, and the calendar event it clashes with
  const rescheduleNewEvent = rescheduleFor && events.find((event) => event.id === rescheduleFor.newEventId)
  const eventToMove = rescheduleNewEvent && findConflicts(rescheduleNewEvent, calendarEvents)[0]

  // Desktop left column subtitle, e.g. "4 NEED YOUR ANSWER", "4 EVENTS SPOTTED", "OCTOBER 2026"
  const sidebarSubtitles = {
    Home: `${events.filter(isWaitingForAnswer).length} need your answer`,
    Inbox: `${events.length} events spotted`,
    Calendar: formatMonthYear(now),
  }
  const sidebarSubtitle = sidebarSubtitles[activeTab]

  // ---- Actions ----
  function showScreen(name) {
    setScreen(name)
    window.scrollTo(0, 0)
  }

  // Back to whichever tab the user was on
  function goHome() {
    showScreen('home')
  }

  function selectTab(tab) {
    setActiveTab(tab)
    setSelectedDay(null)
    showScreen('home')
  }

  // A Nudge event (from Home, the inbox or the calendar)
  function openEvent(eventId) {
    setSelectedEventId(eventId)
    showScreen('detail')
  }

  // Something tapped in the calendar view
  function openCalendarEvent(calendarEvent) {
    if (calendarEvent.sourceEmailId) {
      // Added through Nudge: show the full event detail screen
      openEvent(calendarEvent.id)
    } else {
      // Already in the calendar before Nudge: show it simply
      setSelectedCalendarEventId(calendarEvent.id)
      showScreen('calendarEvent')
    }
  }

  // Month grid: pick a day, or go back to the grid (null)
  function selectDay(dayIso) {
    setSelectedDay(dayIso)
    window.scrollTo(0, 0)
  }

  // ADD or NOT FOR ME, from the detail screen or a nudge card
  function respond(eventId, response) {
    const event = events.find((item) => item.id === eventId)
    const updatedEvent = respondToNudge(event, response)

    // Replace the old version of this event with the updated one
    setEvents((current) =>
      current.map((item) => (item.id === updatedEvent.id ? updatedEvent : item)),
    )
    if (response === 'add') {
      setCalendarEvents((current) => [...current, updatedEvent])
    }

    setSelectedEventId(eventId)
    setConfirmation({ event: updatedEvent, response, returnTo: 'home' })
    showScreen('confirmation')
  }

  // RESCHEDULE, from a nudge card ("home") or EventDetail ("detail")
  function openReschedule(newEventId, returnTo) {
    setRescheduleFor({ newEventId, returnTo })
    showScreen('reschedule')
  }

  // Back from Reschedule (or after "Sent."), to wherever it was opened from
  function leaveReschedule(returnTo) {
    if (returnTo === 'detail') {
      setSelectedEventId(rescheduleFor.newEventId)
      showScreen('detail')
    } else {
      goHome()
    }
  }

  // SEND EMAIL on the Reschedule screen: send through the email doorway,
  // record it, and move the clashing event to the chosen slot
  async function sendReschedule({ email, newSlot }) {
    const sent = await sendEmail(email)
    setSentEmails((current) => [{ ...email, id: sent.id, sentAt: getNow().toISOString() }, ...current])

    const movedEvent = { ...eventToMove, startTime: newSlot.startTime, endTime: newSlot.endTime }
    setCalendarEvents((current) =>
      current.map((item) => (item.id === movedEvent.id ? movedEvent : item)),
    )

    setConfirmation({ event: movedEvent, response: 'sent', returnTo: rescheduleFor.returnTo })
    showScreen('confirmation')
  }

  // NOT NOW on the nudge card (or a tap outside it): close the card,
  // and count the nudge as ignored
  function ignoreNudge() {
    setClosedNudges((current) => [...current, waitingNudge.key])
    setEvents((current) =>
      current.map((item) =>
        item.id === waitingNudge.event.id ? respondToNudge(item, 'ignore') : item,
      ),
    )
  }

  // ---- Screens ----
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  // First visit: ask for a name before anything else
  if (userName === null) {
    return <OnboardingScreen onContinue={saveUserName} onSkip={() => saveUserName(guestName)} />
  }

  let content
  if (screen === 'detail' && selectedEvent) {
    content = (
      <EventDetail
        event={selectedEvent}
        email={selectedEmail}
        calendarEvents={calendarEvents}
        backLabel={activeTab}
        onRespond={(response) => respond(selectedEvent.id, response)}
        onReschedule={() => openReschedule(selectedEvent.id, 'detail')}
        onBack={goHome}
      />
    )
  } else if (screen === 'reschedule' && eventToMove) {
    content = (
      <RescheduleScreen
        eventToMove={eventToMove}
        newEvent={rescheduleNewEvent}
        calendarEvents={calendarEvents}
        now={now}
        userName={userName}
        onSend={sendReschedule}
        onBack={() => leaveReschedule(rescheduleFor.returnTo)}
      />
    )
  } else if (screen === 'calendarEvent' && selectedCalendarEvent) {
    content = (
      <CalendarEventDetail event={selectedCalendarEvent} backLabel={activeTab} onBack={goHome} />
    )
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        now={now}
        userName={userName}
        onChangeName={saveUserName}
        theme={theme}
        sentEmails={sentEmails}
        backLabel={activeTab}
        onToggleTheme={toggleTheme}
        onSkip={skip}
        onSkipToNextNudge={skipToNextNudge}
        hasNextNudge={Boolean(findNextNudgeTime(events, now))}
        onReset={resetDemo}
        onBack={goHome}
      />
    )
  } else if (screen === 'confirmation' && confirmation) {
    content = (
      <ConfirmationScreen
        event={confirmation.event}
        response={confirmation.response}
        onFinish={() => (confirmation.response === 'sent' ? leaveReschedule(confirmation.returnTo) : goHome())}
      />
    )
  } else {
    content = (
      <>
        {waitingNudge && (
          <NudgeCard
            key={waitingNudge.key}
            event={waitingNudge.event}
            nudgeNumber={waitingNudge.nudgeNumber}
            now={now}
            calendarEvents={calendarEvents}
            onAdd={() => respond(waitingNudge.event.id, 'add')}
            onReschedule={() => openReschedule(waitingNudge.event.id, 'home')}
            onNotNow={ignoreNudge}
          />
        )}

        {activeTab === 'Home' && (
          <HomeScreen
            now={now}
            userName={userName}
            events={events}
            calendarEvents={calendarEvents}
            emailCount={emails.length}
            onOpenEvent={openEvent}
            onOpenCalendarEvent={openCalendarEvent}
            onShowInbox={() => selectTab('Inbox')}
            onOpenSettings={() => showScreen('settings')}
          />
        )}

        {activeTab === 'Inbox' && (
          <InboxList emails={emails} events={events} now={now} onOpenEvent={openEvent} />
        )}

        {/* Calendar: the month grid, or the agenda from a picked day */}
        {activeTab === 'Calendar' &&
          (selectedDay ? (
            <CalendarView
              calendarEvents={calendarEvents}
              now={selectedDay}
              onOpenEvent={openCalendarEvent}
              onBack={() => selectDay(null)}
            />
          ) : (
            <MonthGrid now={now} calendarEvents={calendarEvents} onSelectDay={selectDay} />
          ))}

        <BottomNav activeTab={activeTab} onSelectTab={selectTab} />
      </>
    )
  }

  return (
    <div className="lg:flex">
      <DesktopSidebar
        activeTab={activeTab}
        subtitle={sidebarSubtitle}
        theme={theme}
        onSelectTab={selectTab}
        onToggleTheme={toggleTheme}
      />
      <div className="lg:min-w-0 lg:flex-1">{content}</div>
    </div>
  )
}
