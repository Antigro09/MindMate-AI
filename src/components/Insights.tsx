import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChartBar, Sparkle, TrendUp, Calendar, Heart } from '@phosphor-icons/react'
import { AppView, JournalEntry, MoodEntry, Insight } from '@/lib/types'
import { usePersistentState } from '@/hooks/usePersistentState'

interface InsightsProps {
  onNavigate: (view: AppView) => void
}

export function Insights({ onNavigate }: InsightsProps) {
  const [journalEntries] = usePersistentState<JournalEntry[]>('journal-entries', [])
  const [moodEntries] = usePersistentState<MoodEntry[]>('mood-entries', [])
  const [insights, setInsights] = usePersistentState<Insight[]>('generated-insights', [])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsights = async () => {
    if ((journalEntries || []).length === 0 && (moodEntries || []).length === 0) {
      return
    }

    setIsGenerating(true)
    
    try {
      const prompt = `You are an AI mental health analyst. Analyze the following user data and provide 3-5 personalized insights about patterns, trends, or recommendations.

Journal Entries: ${JSON.stringify((journalEntries || []).slice(0, 10))}
Mood Entries: ${JSON.stringify((moodEntries || []).slice(0, 20))}

Please provide insights in the following JSON format:
{
  "insights": [
    {
      "type": "pattern" | "recommendation" | "achievement",
      "title": "Brief insight title",
      "description": "Detailed, empathetic explanation that provides value to the user"
    }
  ]
}

Focus on:
1. Mood patterns over time
2. Connections between journal content and moods
3. Positive progress or achievements
4. Gentle, actionable recommendations
5. Encouraging observations

Be supportive, non-judgmental, and focus on growth and wellbeing.`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      const newInsights: Insight[] = data.insights.map((insight: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        createdAt: Date.now()
      }))

      setInsights(newInsights)
    } catch (error) {
      console.error('Failed to generate insights:', error)
      const fallbackInsights: Insight[] = [
        {
          id: Date.now().toString(),
          type: 'achievement',
          title: 'You\'re Building Healthy Habits',
          description: 'By regularly checking in with your mental health through journaling and mood tracking, you\'re developing valuable self-awareness skills.',
          createdAt: Date.now()
        }
      ]
      setInsights(fallbackInsights)
    } finally {
      setIsGenerating(false)
    }
  }

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'pattern': return TrendUp
      case 'recommendation': return Sparkle
      case 'achievement': return Heart
      default: return ChartBar
    }
  }

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'pattern': return 'text-blue-500'
      case 'recommendation': return 'text-primary'
      case 'achievement': return 'text-accent'
      default: return 'text-muted-foreground'
    }
  }

  const getStats = () => {
    const totalJournalEntries = (journalEntries || []).length
    const totalMoodEntries = (moodEntries || []).length
    const recentMoods = (moodEntries || []).slice(0, 7)
    
    const moodCounts = recentMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostCommonMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]
    
    return {
      totalJournalEntries,
      totalMoodEntries,
      mostCommonMood: mostCommonMood ? mostCommonMood[0] : null,
      daysSinceFirstEntry: journalEntries?.[journalEntries.length - 1] 
        ? Math.floor((Date.now() - journalEntries[journalEntries.length - 1].createdAt) / (1000 * 60 * 60 * 24))
        : 0
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <ChartBar className="w-6 h-6 text-primary" weight="regular" />
            <h1 className="text-2xl font-semibold">Insights</h1>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalJournalEntries}</div>
              <div className="text-sm text-muted-foreground">Journal Entries</div>
            </CardContent>
          </Card>
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stats.totalMoodEntries}</div>
              <div className="text-sm text-muted-foreground">Mood Logs</div>
            </CardContent>
          </Card>
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.daysSinceFirstEntry}</div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </CardContent>
          </Card>
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl">{stats.mostCommonMood === 'happy' ? '😊' : stats.mostCommonMood === 'sad' ? '😔' : '😐'}</div>
              <div className="text-sm text-muted-foreground">Recent Mood</div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Insights Button */}
        {(insights || []).length === 0 && (
          <Card className="mb-8 bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
            <CardContent className="p-8 text-center">
              <ChartBar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Discover Your Patterns</h3>
              <p className="text-muted-foreground mb-6">
                {stats.totalJournalEntries === 0 && stats.totalMoodEntries === 0
                  ? 'Start journaling and tracking your mood to see personalized insights about your mental health patterns.'
                  : 'Generate AI-powered insights based on your journal entries and mood data.'}
              </p>
              <Button
                onClick={generateInsights}
                disabled={isGenerating || (stats.totalJournalEntries === 0 && stats.totalMoodEntries === 0)}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkle className="w-4 h-4 animate-spin" />
                    Analyzing your data...
                  </>
                ) : (
                  <>
                    <Sparkle className="w-4 h-4" />
                    Generate Insights
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Insights Display */}
        {(insights || []).length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Personal Insights</h2>
              <Button
                variant="outline"
                onClick={generateInsights}
                disabled={isGenerating}
                size="sm"
                className="gap-2"
              >
                <Sparkle className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {(insights || []).map((insight) => {
              const IconComponent = getInsightIcon(insight.type)
              return (
                <Card key={insight.id} className="bg-card/70 backdrop-blur-sm border-border/50 shadow-md">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-muted/50`}>
                        <IconComponent className={`w-5 h-5 ${getInsightColor(insight.type)}`} weight="regular" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <span className="text-sm text-muted-foreground capitalize">{insight.type}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 leading-relaxed">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}