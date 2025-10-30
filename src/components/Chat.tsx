import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, PaperPlaneRight, Heart, Warning, Phone, Trash } from '@phosphor-icons/react'
import { ChatMessage, AppView, CrisisDetection } from '@/lib/types'
import { detectCrisisIndicators } from '@/lib/crisis-detection'
import { CrisisResourcesAlert } from './CrisisResourcesAlert'
import { toast } from 'sonner'
import { usePersistentState } from '@/hooks/usePersistentState'

interface ChatProps {
  onNavigate: (view: AppView) => void
}

export function Chat({ onNavigate }: ChatProps) {
  const [messages, setMessages] = usePersistentState<ChatMessage[]>('chat-messages', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeCrisis, setActiveCrisis] = useState<CrisisDetection | null>(null)
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateLLMResponse = async (prompt: string, models: string[] = ['gpt-4o', 'gpt-4o-mini']) => {
    let lastError: unknown = null
    for (const model of models) {
      try {
        return await window.spark.llm(prompt, model)
      } catch (error) {
        lastError = error
        console.error(`LLM call failed for ${model}:`, error)
      }
    }
    throw lastError ?? new Error('All LLM calls failed')
  }

  const fallbackEmpathy =
    "Thank you for sharing that with me. I'm still here with you, even while I'm having connection trouble, and your feelings truly matter."
  const fallbackCrisis =
    "I'm really glad you told me. This sounds very heavy, and I want you to have support right away. Please reach out to someone you trust or a crisis professional as soon as possible."

  const generateEmpathicResponse = async (userMessage: string): Promise<string> => {
    const recentMessages = messages.slice(-6)
    const conversationContext = recentMessages
      .map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n')

    const prompt = `You are MindMate, a compassionate AI companion specialized in mental health support. You provide empathetic, non-judgmental responses that validate feelings and offer gentle guidance. 

Key principles:
- Always validate the user's feelings first
- Use warm, caring language
- Ask thoughtful follow-up questions when appropriate
- Offer practical coping strategies when relevant
- Never diagnose or replace professional therapy
- Be concise but heartfelt (2-4 sentences usually)
- Use "I" statements to show personal engagement
- Acknowledge when situations are genuinely difficult

Previous conversation context:
${conversationContext}

User's latest message: ${userMessage}

Respond with genuine empathy and support. If this is the first message or seems like a greeting, warmly welcome them and ask how they're feeling today.`

    try {
      return await generateLLMResponse(prompt)
    } catch (error) {
      toast.error('Connection issue. Showing offline support.')
      return fallbackEmpathy
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue.trim(),
      isUser: true,
      timestamp: Date.now()
    }

    const crisisDetection = await detectCrisisIndicators(userMessage.content)
    userMessage.crisisAlert = crisisDetection.isDetected
    if (crisisDetection.isDetected) {
      setActiveCrisis(crisisDetection)
    }

    setMessages(current => [...current, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      let aiResponseContent: string

      if (crisisDetection.isDetected) {
        const crisisPrompt = `You are MindMate, a compassionate AI companion. The user has shared something that indicates they may be in crisis (risk level: ${crisisDetection.riskLevel}). 

Your response should:
1. Acknowledge their pain with deep empathy
2. Emphasize that they are not alone and that help is available
3. Gently encourage them to reach out to professional resources
4. Be warm and supportive, not clinical or alarming
5. Keep it concise but heartfelt

User's message: ${userMessage.content}

Important: Do NOT list specific crisis resources in your response - those will be shown separately. Focus on emotional support and gentle encouragement to seek help.`

        try {
          aiResponseContent = await generateLLMResponse(crisisPrompt)
        } catch (error) {
          console.error('Crisis response generation failed:', error)
          aiResponseContent = fallbackCrisis
        }

        setMessages(current => [
          ...current,
          {
            id: `ai-${Date.now()}`,
            content: aiResponseContent,
            isUser: false,
            timestamp: Date.now()
          }
        ])
      } else {
        aiResponseContent = await generateEmpathicResponse(userMessage.content)

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          content: aiResponseContent,
          isUser: false,
          timestamp: Date.now()
        }

        setMessages(current => [...current, aiMessage])
      }
    } catch (error) {
      toast.error('Unable to generate response. Please try again.')
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearMessages = () => {
    setMessages([])
    setActiveCrisis(null)
    setShowConfirmClear(false)
    toast.success('Chat history cleared')
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('home')}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-2">
          <Heart className="text-accent" size={24} />
          <h1 className="text-2xl font-semibold text-foreground">AI Companion</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!showConfirmClear ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmClear(true)}
              className="gap-2"
            >
              <Trash size={16} />
              Clear Chat
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Delete all messages?</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearMessages}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-2xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          {/* Crisis Resources Alert */}
          {activeCrisis && (
            <div className="p-4 border-b">
              <CrisisResourcesAlert
                crisisDetection={activeCrisis}
                onDismiss={() => setActiveCrisis(null)}
              />
            </div>
          )}

          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="p-6 text-center text-muted-foreground border-b">
              <Heart className="mx-auto mb-3 text-accent" size={32} />
              <h3 className="font-medium mb-2">Welcome to your AI Companion</h3>
              <p className="text-sm">
                I'm here to listen, support, and offer gentle guidance. 
                Share whatever is on your mind - I'm here for you.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                <div key={message.id}>
                  {/* Crisis Alert for user messages */}
                  {message.isUser && message.crisisAlert && (
                    <Alert className="mb-3 border-red-200 bg-red-50">
                      <Warning className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        I'm concerned about what you've shared. Please know that you're not alone and help is available.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.crisisAlert && !message.isUser
                          ? 'bg-red-50 border border-red-200 text-red-900'
                          : message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {/* Crisis icon for crisis resource messages */}
                      {message.crisisAlert && !message.isUser && (
                        <div className="flex items-center gap-2 mb-2 text-red-700">
                          <Phone size={16} />
                          <span className="text-sm font-medium">Crisis Support Resources</span>
                        </div>
                      )}
                      
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </div>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <PaperPlaneRight size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • This AI is for support, not professional therapy
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}