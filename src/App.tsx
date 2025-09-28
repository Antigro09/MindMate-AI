import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { Home } from '@/components/Home'
import { Journal } from '@/components/Journal'
import { MoodTracker } from '@/components/MoodTracker'
import { Exercises } from '@/components/Exercises'
import { Insights } from '@/components/Insights'
import { Settings } from '@/components/Settings'
import { Chat } from '@/components/Chat'
import { AppView } from '@/lib/types'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home')

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />
      case 'journal':
        return <Journal onNavigate={setCurrentView} />
      case 'mood':
        return <MoodTracker onNavigate={setCurrentView} />
      case 'exercises':
        return <Exercises onNavigate={setCurrentView} />
      case 'insights':
        return <Insights onNavigate={setCurrentView} />
      case 'settings':
        return <Settings onNavigate={setCurrentView} />
      case 'chat':
        return <Chat onNavigate={setCurrentView} />
      default:
        return <Home onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderView()}
      <Toaster />
    </div>
  )
}

export default App