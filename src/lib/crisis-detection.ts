import { CrisisDetection, CrisisResource } from './types'

// Crisis resources with immediate professional help
export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: 'suicide-lifeline',
    name: '988 Suicide & Crisis Lifeline',
    type: 'hotline',
    contact: '988',
    description: '24/7 free and confidential emotional support for people in suicidal crisis or emotional distress',
    availability: '24/7',
    isEmergency: true
  },
  {
    id: 'crisis-text-line',
    name: 'Crisis Text Line',
    type: 'text',
    contact: 'Text HOME to 741741',
    description: '24/7 crisis support via text message with trained crisis counselors',
    availability: '24/7',
    isEmergency: true
  },
  {
    id: 'emergency-services',
    name: 'Emergency Services',
    type: 'emergency',
    contact: '911',
    description: 'For immediate medical emergencies or if you are in immediate danger',
    availability: '24/7',
    isEmergency: true
  },
  {
    id: 'nami-helpline',
    name: 'NAMI HelpLine',
    type: 'hotline',
    contact: '1-800-950-NAMI (6264)',
    description: 'Information, resource referrals and support for individuals and families affected by mental illness',
    availability: 'Mon-Fri 10am-10pm ET'
  },
  {
    id: 'samhsa-helpline',
    name: 'SAMHSA National Helpline',
    type: 'hotline',
    contact: '1-800-662-4357',
    description: '24/7 treatment referral and information service for mental health and substance use disorders',
    availability: '24/7'
  },
  {
    id: 'warmline-directory',
    name: 'Warmline Directory',
    type: 'chat',
    contact: 'warmline.org',
    description: 'Peer support warmlines staffed by people with lived experience of mental health challenges',
    availability: 'Varies by location'
  }
]

// Keywords and phrases that may indicate crisis situations
const CRISIS_KEYWORDS = {
  severe: [
    'kill myself', 'end my life', 'suicide', 'better off dead', 'no point living',
    'want to die', 'planning to hurt myself', 'goodbye forever', 'final message',
    'can\'t go on', 'nothing left', 'everyone would be better without me'
  ],
  high: [
    'self harm', 'hurt myself', 'cut myself', 'overdose', 'hopeless',
    'worthless', 'burden', 'can\'t take it', 'give up', 'end it all',
    'no way out', 'trapped', 'unbearable pain'
  ],
  moderate: [
    'depressed', 'anxious', 'panic', 'overwhelmed', 'struggling',
    'breaking down', 'can\'t cope', 'losing control', 'falling apart',
    'desperate', 'exhausted', 'numb'
  ]
}

/**
 * Analyzes text content for potential crisis indicators
 * Returns crisis detection results with appropriate resources
 */
export async function detectCrisisIndicators(content: string): Promise<CrisisDetection> {
  const lowerContent = content.toLowerCase()
  
  // Check for severe risk indicators
  const severeMatches = CRISIS_KEYWORDS.severe.filter(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  )
  
  if (severeMatches.length > 0) {
    return {
      isDetected: true,
      riskLevel: 'severe',
      recommendedResources: CRISIS_RESOURCES.filter(r => r.isEmergency),
      supportMessage: "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out to one of these crisis resources immediately - they have trained professionals who want to help you through this difficult time."
    }
  }
  
  // Check for high risk indicators
  const highMatches = CRISIS_KEYWORDS.high.filter(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  )
  
  if (highMatches.length > 0) {
    return {
      isDetected: true,
      riskLevel: 'high',
      recommendedResources: CRISIS_RESOURCES.slice(0, 4), // Include most immediate resources
      supportMessage: "I hear that you're going through an incredibly difficult time. You don't have to face this alone. Please consider reaching out to one of these professional support resources - they're specially trained to help people through crisis situations."
    }
  }
  
  // Check for moderate risk indicators
  const moderateMatches = CRISIS_KEYWORDS.moderate.filter(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  )
  
  if (moderateMatches.length >= 2) { // Require multiple moderate indicators
    return {
      isDetected: true,
      riskLevel: 'moderate',
      recommendedResources: CRISIS_RESOURCES.slice(1, 5), // Exclude emergency services
      supportMessage: "It sounds like you're dealing with some really challenging feelings right now. Remember that it's okay to ask for help, and there are people who want to support you through this."
    }
  }
  
  // Use AI for more nuanced detection
  try {
    const prompt = `You are a mental health crisis detection system. Analyze this message for signs of mental health crisis, suicidal ideation, self-harm, or severe distress.

Message: "${content}"

Respond with a JSON object containing:
{
  "isDetected": boolean,
  "riskLevel": "low" | "moderate" | "high" | "severe",
  "reasoning": "brief explanation of your assessment",
  "confidence": number between 0-1
}

Consider context, emotional language, expressions of hopelessness, isolation, or desperation. Be sensitive but thorough.`

    const aiResponse = await (window as any).spark.llm(prompt, 'gpt-4o', true)
    const analysis = JSON.parse(aiResponse)
    
    if (analysis.isDetected && analysis.confidence > 0.6) {
      let resources: CrisisResource[]
      let supportMessage: string
      
      switch (analysis.riskLevel) {
        case 'severe':
          resources = CRISIS_RESOURCES.filter(r => r.isEmergency)
          supportMessage = "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out to one of these crisis resources immediately."
          break
        case 'high':
          resources = CRISIS_RESOURCES.slice(0, 4)
          supportMessage = "I hear that you're going through an incredibly difficult time. You don't have to face this alone. Please consider reaching out to professional support."
          break
        case 'moderate':
          resources = CRISIS_RESOURCES.slice(0, 3)
          supportMessage = "It sounds like you're dealing with some challenging feelings. Remember that it's okay to ask for help when you need it."
          break
        default:
          resources = CRISIS_RESOURCES.slice(3, 6)
          supportMessage = "If you're feeling overwhelmed, these resources are available to provide support and guidance."
      }
      
      return {
        isDetected: true,
        riskLevel: analysis.riskLevel,
        recommendedResources: resources,
        supportMessage
      }
    }
  } catch (error) {
    console.error('AI crisis detection failed:', error)
  }
  
  // No crisis detected
  return {
    isDetected: false,
    riskLevel: 'low',
    recommendedResources: [],
    supportMessage: ''
  }
}

/**
 * Formats crisis resources for display
 */
export function formatCrisisResources(resources: CrisisResource[]): string {
  return resources.map(resource => {
    const urgencyIndicator = resource.isEmergency ? '🚨 ' : '💙 '
    return `${urgencyIndicator}**${resource.name}**\n${resource.contact}\n${resource.description}\nAvailable: ${resource.availability}`
  }).join('\n\n')
}