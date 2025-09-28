export interface JournalEntry {
  id: string
  date: string
  entry: string
  aiResponse?: string
  createdAt: number
}

export interface MoodEntry {
  id: string
  date: string
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'anxious' | 'stressed' | 'angry'
  notes?: string
  createdAt: number
}

export interface Exercise {
  id: string
  title: string
  description: string
  duration: number
  category: 'breathing' | 'meditation' | 'cbt' | 'grounding'
  instructions: string[]
  completedCount?: number
}

export interface Insight {
  id: string
  type: 'pattern' | 'recommendation' | 'achievement'
  title: string
  description: string
  createdAt: number
  data?: any
}

export interface UserSettings {
  darkMode: boolean
  notifications: boolean
  dataRetention: number
  aiResponses: boolean
}

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: number
  crisisAlert?: boolean
}

export interface CrisisResource {
  id: string
  name: string
  type: 'hotline' | 'text' | 'chat' | 'emergency'
  contact: string
  description: string
  availability: string
  isEmergency?: boolean
}

export interface CrisisDetection {
  isDetected: boolean
  riskLevel: 'low' | 'moderate' | 'high' | 'severe'
  recommendedResources: CrisisResource[]
  supportMessage: string
}

export type AppView = 'home' | 'journal' | 'mood' | 'exercises' | 'insights' | 'settings' | 'chat'