import { useState } from 'react'
import { Header } from '@/components/Header'
import { Overview } from '@/pages/Overview'
import { MenuPerformance } from '@/pages/MenuPerformance'
import { Occupancy } from '@/pages/Occupancy'
import { GuestIntelligence } from '@/pages/GuestIntelligence'

type Tab = 'overview' | 'menu' | 'occupancy' | 'guests'

export default function App() {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={tab} onTabChange={setTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === 'overview' ? <Overview /> :
         tab === 'menu' ? <MenuPerformance /> :
         tab === 'occupancy' ? <Occupancy /> :
         <GuestIntelligence />}
      </main>
    </div>
  )
}
