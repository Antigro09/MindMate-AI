import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, BookOpen, Leaf, ChartBar, Gear, Sparkle, ChatCircle } from '@phosphor-icons/react'
import { AppView } from '@/lib/types'

interface HomeProps {
  onNavigate: (view: AppView) => void
}

export function Home({ onNavigate }: HomeProps) {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  const features = [
    {
      icon: ChatCircle,
      title: 'AI Companion',
      description: 'Chat with your empathetic AI supporter',
      view: 'chat' as AppView,
      color: 'accent'
    },
    {
      icon: BookOpen,
      title: 'Journal',
      description: 'Write your thoughts and get AI insights',
      view: 'journal' as AppView,
      color: 'primary'
    },
    {
      icon: Heart,
      title: 'Mood Tracker',
      description: 'Track how you\'re feeling today',
      view: 'mood' as AppView,
      color: 'accent'
    },
    {
      icon: Leaf,
      title: 'Exercises',
      description: 'Mindfulness and breathing exercises',
      view: 'exercises' as AppView,
      color: 'secondary'
    },
    {
      icon: ChartBar,
      title: 'Insights',
      description: 'Discover your emotional patterns',
      view: 'insights' as AppView,
      color: 'primary'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkle className="text-primary w-8 h-8" weight="fill" />
            <h1 className="text-3xl font-semibold text-foreground">MindMate AI</h1>
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-4">
            {greeting}! How are you feeling today?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your private mental health companion is here to support your wellbeing journey
          </p>
        </div>

        {/* Quick Mood Check */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-center">Quick Check-in</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {['😊', '😐', '😔', '😰', '😤'].map((emoji, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="text-2xl hover:scale-105 transition-transform duration-200"
                  onClick={() => onNavigate('mood')}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card 
                key={feature.view}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-card/70 backdrop-blur-sm border-border/50 hover:border-primary/20"
                onClick={() => onNavigate(feature.view)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${feature.color}/10 group-hover:bg-${feature.color}/20 transition-colors`}>
                      <IconComponent 
                        className={`w-6 h-6 text-${feature.color}`} 
                        weight="regular"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Settings Link */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate('settings')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Gear className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}