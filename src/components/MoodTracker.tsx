import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Heart, Plus } from '@phosphor-icons/react'
import { AppView, MoodEntry } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface MoodTrackerProps {
  onNavigate: (view: AppView) => void
}

const MOODS = [
  { id: 'very-happy', emoji: '😊', label: 'Very Happy', color: 'text-green-500' },
  { id: 'happy', emoji: '🙂', label: 'Happy', color: 'text-green-400' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: 'text-blue-500' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'text-yellow-500' },
  { id: 'stressed', emoji: '😫', label: 'Stressed', color: 'text-orange-500' },
  { id: 'angry', emoji: '😤', label: 'Angry', color: 'text-red-500' }
] as const

export function MoodTracker({ onNavigate }: MoodTrackerProps) {
  const [moodEntries, setMoodEntries] = useKV<MoodEntry[]>('mood-entries', [])
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first')
      return
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      mood: selectedMood as MoodEntry['mood'],
      notes: notes.trim() || undefined,
      createdAt: Date.now()
    }

    setMoodEntries(current => [newEntry, ...(current || [])])
    setSelectedMood(null)
    setNotes('')
    toast.success('Mood logged successfully!')
  }

  const getMoodEmoji = (moodId: string) => {
    return MOODS.find(m => m.id === moodId)?.emoji || '😐'
  }

  const getMoodLabel = (moodId: string) => {
    return MOODS.find(m => m.id === moodId)?.label || 'Unknown'
  }

  const getRecentMoods = () => {
    const recent = (moodEntries || []).slice(0, 7)
    return recent.reverse()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-accent" weight="fill" />
            <h1 className="text-2xl font-semibold">Mood Tracker</h1>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="hover:bg-accent/10"
            >
              {showHistory ? 'Log Mood' : 'View History'}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          /* Mood Logging Interface */
          <div className="space-y-6">
            {/* Mood Selection */}
            <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>How are you feeling right now?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MOODS.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      className={`h-auto py-4 flex flex-col gap-2 transition-all duration-200 ${
                        selectedMood === mood.id 
                          ? 'bg-accent hover:bg-accent/90 scale-105' 
                          : 'hover:scale-105 hover:bg-accent/10'
                      }`}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>What's contributing to this feeling? (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe what happened today, what you're thinking about, or any context for your mood..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] resize-none border-border/50 focus:border-accent/50"
                />
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleSaveMood}
                    disabled={!selectedMood}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Log Mood
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Mood Trend */}
            {(moodEntries || []).length > 0 && (
              <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Mood Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 py-4">
                    {getRecentMoods().map((entry, index) => (
                      <div key={entry.id} className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* History View */
          <div className="space-y-4">
            {(moodEntries || []).length === 0 ? (
              <Card className="bg-card/70 backdrop-blur-sm border-border/50">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No mood entries yet. Start tracking your emotions!
                  </p>
                </CardContent>
              </Card>
            ) : (
              (moodEntries || []).map((entry) => (
                <Card key={entry.id} className="bg-card/70 backdrop-blur-sm border-border/50 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{getMoodLabel(entry.mood)}</h3>
                          <div className="text-sm text-muted-foreground text-right">
                            <div>{entry.date}</div>
                            <div>
                              {new Date(entry.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}