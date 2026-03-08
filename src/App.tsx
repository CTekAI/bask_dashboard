import { useState } from 'react'
import { Header } from '@/components/Header'
import { Overview } from '@/pages/Overview'
import { MenuPerformance } from '@/pages/MenuPerformance'
import { Occupancy } from '@/pages/Occupancy'
import { GuestIntelligence } from '@/pages/GuestIntelligence'
import { Login } from '@/pages/Login'

type Tab = 'overview' | 'menu' | 'occupancy' | 'guests'

export default function App() {
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem('bask_auth') === 'true')
  const [tab, setTab] = useState<Tab>('overview')

  function handleLogin() {
    localStorage.setItem('bask_auth', 'true')
    setIsAuthed(true)
  }

  function handleLogout() {
    localStorage.removeItem('bask_auth')
    setIsAuthed(false)
  }

  if (!isAuthed) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-brand-blanco">
      <Header activeTab={tab} onTabChange={setTab} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === 'overview' ? <Overview /> :
         tab === 'menu' ? <MenuPerformance /> :
         tab === 'occupancy' ? <Occupancy /> :
         <GuestIntelligence />}
      </main>
    </div>
  )
}
