// ==========================================================
// App
// Shows the splash screen first, then the inbox with the
// bottom navigation.
// ==========================================================
import { useState } from 'react'
import SplashScreen from './components/SplashScreen.jsx'
import InboxList from './components/InboxList.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  // ---- Is the splash still showing? ----
  const [showSplash, setShowSplash] = useState(true)

  // ---- Screens ----
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }
  return (
    <>
      <InboxList />
      <BottomNav activeTab="Inbox" />
    </>
  )
}
