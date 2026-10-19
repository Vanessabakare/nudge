// ==========================================================
// App
// Holds the app's shared state (emails, spotted events, the
// calendar and the current demo time) and decides which screen
// to show: splash -> home (INBOX or CALENDAR) <-> detail screens.
// A nudge banner slides in over the home screens when a nudge
// is waiting for an answer.
//
// Phone: one column, bottom nav, detail screens fill the screen.
// Desktop (1024px+): a left column with title and numbered nav;
// everything else appears in the right column.
// ==========================================================
import { useEffect, useState } from 'react'
import { getEmails } from './sources/mockEmailSource.js'
import { sampleCalendar } from './data/sampleCalendar.js'
import { getNow, skipAhead } from './clock/demoClock.js'
import { planNudgeTimes } from './logic/planNudgeTimes.js'
import { checkNudges } from './logic/checkNudges.js'
import { respondToNudge } from './logic/respondToNudge.js'
import { findLatestWaitingNudge } from './logic/findLatestWaitingNudge.js'
import { formatMonthYear } from './logic/formatDates.js'
import SplashScreen from './components/SplashScreen.jsx'
import DemoControl from './components/DemoControl.jsx'
import DesktopSidebar from './components/DesktopSidebar.jsx'
import NudgeBanner from './components/NudgeBanner.jsx'
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
  const [calendarEvents, setCalendarEvents] = useState(sampleCalendar)
  const [now, setNow] = useState(() => getNow().toISOString())

  // ---- Which screen is showing ----
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('Inbox') // "Inbox" | "Calendar"
  const [screen, setScreen] = useState('home') // "home" | "detail" | "calendarEvent" | "confirmation"
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [selectedCalendarEventId, setSelectedCalendarEventId] = useState(null)
  const [lastResponse, setLastResponse] = useState(null) // "add" | "dismiss"

  // Desktop only: the day picked in the month grid (null = show the grid)
  const [selectedDay, setSelectedDay] = useState(null)

  // Nudge banners the user has closed, e.g. "event-001-nudge-1"
  const [closedBanners, setClosedBanners] = useState([])

  // ---- Load emails once, plan each event's nudges, send any already due ----
  useEffect(() => {
    getEmails().then((loadedEmails) => {
      setEmails(loadedEmails)
      const plannedEvents = loadedEmails
        .filter((email) => email.extractedEvent)
        .map((email) => withPlannedNudges(email.extractedEvent, email))
      setEvents(checkNudges(plannedEvents, getNow().toISOString()))
    })
  }, [])

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

  // ---- Things worked out from state ----
  const selectedEvent = events.find((event) => event.id === selectedEventId)
  const selectedEmail =
    selectedEvent && emails.find((email) => email.id === selectedEvent.sourceEmailId)
  const selectedCalendarEvent = calendarEvents.find(
    (calendarEvent) => calendarEvent.id === selectedCalendarEventId,
  )
  const waitingNudge = findLatestWaitingNudge(events, closedBanners)

  // Desktop left column subtitle, e.g. "4 EVENTS SPOTTED" or "OCTOBER 2026"
  const sidebarSubtitle =
    activeTab === 'Inbox' ? `${events.length} events spotted` : formatMonthYear(now)

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

  // A Nudge event (from the inbox, the calendar or a banner)
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

  // Desktop month grid: pick a day, or go back to the grid
  function selectDay(dayIso) {
    setSelectedDay(dayIso)
    window.scrollTo(0, 0)
  }

  // ADD or NOT FOR ME, from the detail screen or a banner
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
    setLastResponse(response)
    showScreen('confirmation')
  }

  // Closes the current banner. NOT NOW also counts the nudge as ignored.
  function closeBanner(isIgnored) {
    setClosedBanners((current) => [...current, waitingNudge.key])
    if (isIgnored) {
      setEvents((current) =>
        current.map((item) =>
          item.id === waitingNudge.event.id ? respondToNudge(item, 'ignore') : item,
        ),
      )
    }
  }

  // ---- Screens ----
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
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
        onBack={goHome}
      />
    )
  } else if (screen === 'calendarEvent' && selectedCalendarEvent) {
    content = (
      <CalendarEventDetail event={selectedCalendarEvent} backLabel={activeTab} onBack={goHome} />
    )
  } else if (screen === 'confirmation' && selectedEvent) {
    content = (
      <ConfirmationScreen event={selectedEvent} response={lastResponse} onFinish={goHome} />
    )
  } else {
    content = (
      <>
        {waitingNudge && (
          <NudgeBanner
            key={waitingNudge.key}
            event={waitingNudge.event}
            nudgeNumber={waitingNudge.nudgeNumber}
            now={now}
            calendarEvents={calendarEvents}
            onAdd={() => respond(waitingNudge.event.id, 'add')}
            onNotNow={() => closeBanner(true)}
            onView={() => {
              closeBanner(false)
              openEvent(waitingNudge.event.id)
            }}
          />
        )}

        {activeTab === 'Inbox' && (
          <InboxList emails={emails} events={events} now={now} onOpenEvent={openEvent} />
        )}

        {activeTab === 'Calendar' && (
          <>
            {/* Phone: the agenda of the next 14 days */}
            <div className="lg:hidden">
              <CalendarView calendarEvents={calendarEvents} now={now} onOpenEvent={openCalendarEvent} />
            </div>

            {/* Desktop: the month grid, or the agenda from a picked day */}
            <div className="hidden lg:block">
              {selectedDay ? (
                <CalendarView
                  calendarEvents={calendarEvents}
                  now={selectedDay}
                  onOpenEvent={openCalendarEvent}
                  onBack={() => selectDay(null)}
                />
              ) : (
                <MonthGrid now={now} calendarEvents={calendarEvents} onSelectDay={selectDay} />
              )}
            </div>
          </>
        )}

        <BottomNav activeTab={activeTab} onSelectTab={selectTab} />
      </>
    )
  }

  // The demo control sits above every screen; content starts below it
  return (
    <>
      <DemoControl now={now} onSkip={skip} />
      <div className="pt-9 lg:flex">
        <DesktopSidebar activeTab={activeTab} subtitle={sidebarSubtitle} onSelectTab={selectTab} />
        <div className="lg:min-w-0 lg:flex-1">{content}</div>
      </div>
    </>
  )
}
