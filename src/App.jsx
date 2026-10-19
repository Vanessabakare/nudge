// ==========================================================
// App
// Holds the app's shared state (emails, spotted events and the
// calendar) and decides which screen to show:
// splash -> home (INBOX or CALENDAR tab) <-> detail screens
// ==========================================================
import { useEffect, useState } from 'react'
import { getEmails } from './sources/mockEmailSource.js'
import { sampleCalendar } from './data/sampleCalendar.js'
import { respondToNudge } from './logic/respondToNudge.js'
import SplashScreen from './components/SplashScreen.jsx'
import InboxList from './components/InboxList.jsx'
import CalendarView from './components/CalendarView.jsx'
import EventDetail from './components/EventDetail.jsx'
import CalendarEventDetail from './components/CalendarEventDetail.jsx'
import ConfirmationScreen from './components/ConfirmationScreen.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  // ---- Shared state ----
  const [emails, setEmails] = useState([])
  const [events, setEvents] = useState([])
  const [calendarEvents, setCalendarEvents] = useState(sampleCalendar)

  // ---- Which screen is showing ----
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('Inbox') // "Inbox" | "Calendar"
  const [screen, setScreen] = useState('home') // "home" | "detail" | "calendarEvent" | "confirmation"
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [selectedCalendarEventId, setSelectedCalendarEventId] = useState(null)
  const [lastResponse, setLastResponse] = useState(null) // "add" | "dismiss"

  // ---- Load emails once, and pull out the events Nudge spotted ----
  useEffect(() => {
    getEmails().then((loadedEmails) => {
      setEmails(loadedEmails)
      setEvents(
        loadedEmails
          .filter((email) => email.extractedEvent)
          .map((email) => email.extractedEvent),
      )
    })
  }, [])

  const selectedEvent = events.find((event) => event.id === selectedEventId)
  const selectedEmail =
    selectedEvent && emails.find((email) => email.id === selectedEvent.sourceEmailId)
  const selectedCalendarEvent = calendarEvents.find(
    (calendarEvent) => calendarEvent.id === selectedCalendarEventId,
  )

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
    showScreen('home')
  }

  // A Nudge event (from the inbox, or from the calendar)
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

  function respond(response) {
    const updatedEvent = respondToNudge(selectedEvent, response)

    // Replace the old version of this event with the updated one
    setEvents((current) =>
      current.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)),
    )
    if (response === 'add') {
      setCalendarEvents((current) => [...current, updatedEvent])
    }

    setLastResponse(response)
    showScreen('confirmation')
  }

  // ---- Screens ----
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  if (screen === 'detail' && selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        email={selectedEmail}
        calendarEvents={calendarEvents}
        onRespond={respond}
        onBack={goHome}
      />
    )
  }

  if (screen === 'calendarEvent' && selectedCalendarEvent) {
    return <CalendarEventDetail event={selectedCalendarEvent} onBack={goHome} />
  }

  if (screen === 'confirmation' && selectedEvent) {
    return (
      <ConfirmationScreen
        event={selectedEvent}
        response={lastResponse}
        onFinish={goHome}
      />
    )
  }

  return (
    <>
      {activeTab === 'Inbox' ? (
        <InboxList emails={emails} events={events} onOpenEvent={openEvent} />
      ) : (
        <CalendarView calendarEvents={calendarEvents} onOpenEvent={openCalendarEvent} />
      )}
      <BottomNav activeTab={activeTab} onSelectTab={selectTab} />
    </>
  )
}
