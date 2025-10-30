import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, PaperPlaneTilt, Sparkle, BookOpen } from '@phosphor-icons/react'
import { AppView, JournalEntry } from '@/lib/types'
import { detectCrisisIndicators } from '@/lib/crisis-detection'
import { CrisisResourcesAlert } from './CrisisResourcesAlert'
import { toast } from 'sonner'
import { usePersistentState } from '@/hooks/usePersistentState'

interface JournalProps {
  onNavigate: (view: AppView) => void
}

export function Journal({ onNavigate }: JournalProps) {
  const [entries, setEntries] = usePersistentState<JournalEntry[]>('journal-entries', [])
  const [currentEntry, setCurrentEntry] = useState('')
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [crisisDetected, setCrisisDetected] = useState<any>(null)

  const generateAIResponse = async (entryText: string): Promise<string> => {
    try {
      const prompt = `You are a compassionate mental health companion. The user has written the following journal entry: "${entryText}"

Please provide an empathetic, supportive response that:
1. Acknowledges their feelings without judgment
2. Offers gentle insights or reflections
3. Provides encouragement where appropriate
4. Is warm and human-like, not clinical
5. Keeps response to 2-3 sentences

Respond as if you're a caring friend who truly understands.`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini')
      return response
    } catch (error) {
      console.error('AI response generation failed:', error)
      return "Thank you for sharing your thoughts with me. I'm here to listen and support you on your journey. Your feelings are valid, and taking time to reflect through journaling is a wonderful step toward self-awareness."
    }
  }

  const handleSaveEntry = async () => {
    if (!currentEntry.trim()) {
      toast.error('Please write something before saving')
      return
    }

    setIsGeneratingResponse(true)
    
    try {
      // Check for crisis indicators first
      const crisisDetection = await detectCrisisIndicators(currentEntry)
      setCrisisDetected(crisisDetection.isDetected ? crisisDetection : null)

      let aiResponse: string
      
      if (crisisDetection.isDetected) {
        // Generate crisis-aware response
        const crisisPrompt = `You are a compassionate mental health companion. The user has written a journal entry that indicates they may be in crisis (risk level: ${crisisDetection.riskLevel}). 

Their journal entry: "${currentEntry}"

Provide a response that:
1. Acknowledges their pain with deep empathy
2. Validates their feelings without judgment
3. Gently encourages seeking professional support
4. Emphasizes they are not alone
5. Keeps it warm and supportive, not clinical
6. 2-3 sentences maximum

Do NOT list crisis resources - those will be shown separately.`

        aiResponse = await window.spark.llm(crisisPrompt, 'gpt-4o')
      } else {
        aiResponse = await generateAIResponse(currentEntry)
      }
      
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        entry: currentEntry,
        aiResponse,
        createdAt: Date.now()
      }

      setEntries(current => [newEntry, ...current])
      setCurrentEntry('')
      
      if (crisisDetection.isDetected) {
        toast.success('Journal entry saved. Please see the important resources below.')
      } else {
        toast.success('Journal entry saved with AI insights')
      }
    } catch (error) {
      toast.error('Failed to save entry')
    } finally {
      setIsGeneratingResponse(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

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
            <BookOpen className="w-6 h-6 text-primary" weight="regular" />
            <h1 className="text-2xl font-semibold">Journal</h1>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="hover:bg-primary/10"
            >
              {showHistory ? 'Write New' : 'View History'}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          <>
            {/* Writing Interface */}
            <Card className="mb-6 bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  What's on your mind today?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Write about your thoughts, feelings, or anything that's important to you today..."
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="min-h-[200px] resize-none border-border/50 focus:border-primary/50"
                  disabled={isGeneratingResponse}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {currentEntry.length} characters
                  </span>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!currentEntry.trim() || isGeneratingResponse}
                    className="gap-2"
                  >
                    {isGeneratingResponse ? (
                      <>
                        <Sparkle className="w-4 h-4 animate-spin" />
                        Generating insights...
                      </>
                    ) : (
                      <>
                        <PaperPlaneTilt className="w-4 h-4" />
                        Save & Get Insights
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Alert */}
            {crisisDetected && (
              <CrisisResourcesAlert
                crisisDetection={crisisDetected}
                onDismiss={() => setCrisisDetected(null)}
                className="mb-6"
              />
            )}
          </>
        ) : (
          /* History View */
          <div className="space-y-6">
            {(entries || []).length === 0 ? (
              <Card className="bg-card/70 backdrop-blur-sm border-border/50">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No journal entries yet. Start writing to begin your journey!
                  </p>
                </CardContent>
              </Card>
            ) : (
              (entries || []).map((entry) => (
                <Card key={entry.id} className="bg-card/70 backdrop-blur-sm border-border/50 shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{formatDate(entry.date)}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground leading-relaxed">
                        {entry.entry}
                      </p>
                    </div>
                    {entry.aiResponse && (
                      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                        <div className="flex items-start gap-2">
                          <Sparkle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" weight="fill" />
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            {entry.aiResponse}
                          </p>
                        </div>
                      </div>
                    )}
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