// ==========================================================
// App
// Shows the splash screen first, then the home screen.
// ==========================================================
import { useState } from 'react'
import SplashScreen from './components/SplashScreen.jsx'
import HomeScreen from './components/HomeScreen.jsx'

export default function App() {
  // ---- Is the splash still showing? ----
  const [showSplash, setShowSplash] = useState(true)

  // ---- Screens ----
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }
  return <HomeScreen />
}
