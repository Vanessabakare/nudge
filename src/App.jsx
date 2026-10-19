// ==========================================================
// App
// Holds the app's shared state (emails, spotted events and the
// calendar) and decides which screen to show:
// splash -> inbox <-> event detail -> confirmation -> inbox
// ==========================================================
import { useEffect, useState } from 'react'
import { getEmails } from './sources/mockEmailSource.js'
import { sampleCalendar } from './data/sampleCalendar.js'
import { respondToNudge } from './logic/respondToNudge.js'
import SplashScreen from './components/SplashScreen.jsx'
import InboxList from './components/InboxList.jsx'
import EventDetail from './components/EventDetail.jsx'
import ConfirmationScreen from './components/ConfirmationScreen.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  // ---- Shared state ----
  const [emails, setEmails] = useState([])
  const [events, setEvents] = useState([])
  const [calendarEvents, setCalendarEvents] = useState(sampleCalendar)

  // ---- Which screen is showing ----
  const [showSplash, setShowSplash] = useState(true)
  const [screen, setScreen] = useState('inbox') // "inbox" | "detail" | "confirmation"
  const [selectedEventId, setSelectedEventId] = useState(null)
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

  // ---- Actions ----
  function openEvent(eventId) {
    setSelectedEventId(eventId)
    setScreen('detail')
    window.scrollTo(0, 0)
  }

  function goToInbox() {
    setScreen('inbox')
    window.scrollTo(0, 0)
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
    setScreen('confirmation')
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
        onBack={goToInbox}
      />
    )
  }

  if (screen === 'confirmation' && selectedEvent) {
    return (
      <ConfirmationScreen
        event={selectedEvent}
        response={lastResponse}
        onFinish={goToInbox}
      />
    )
  }

  return (
    <>
      <InboxList emails={emails} events={events} onOpenEvent={openEvent} />
      <BottomNav activeTab="Inbox" />
    </>
  )
}
