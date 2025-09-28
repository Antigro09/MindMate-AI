# MindMate AI - Mental Health Companion App

## Core Purpose & Success

**Mission Statement**: MindMate AI provides compassionate, accessible mental health support through AI-powered tools for mood tracking, journaling, exercises, insights, and real-time empathetic conversations.

**Success Indicators**: 
- Users return daily for mood tracking or journaling
- AI companions provide meaningful, supportive responses that users find helpful
- Users complete mindfulness exercises regularly
- Overall sense of emotional awareness and coping improves over time

**Experience Qualities**: Calming, Supportive, Trustworthy

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with persistent state and AI interaction)

**Primary User Activity**: Interacting - Users actively engage with AI companions, track moods, write journal entries, and participate in exercises

## Essential Features

### 1. AI Companion Chat
**What it does**: Real-time chat interface with an empathetic AI that provides emotional support, validation, and gentle guidance
**Why it matters**: Immediate access to non-judgmental support when users need someone to talk to
**Success criteria**: Users feel heard, supported, and emotionally validated after conversations

### 2. Mood Tracking
**What it does**: Daily mood logging with visual tracking over time
**Why it matters**: Helps users recognize emotional patterns and triggers
**Success criteria**: Users can identify trends and correlations in their emotional states

### 3. Journal with AI Insights
**What it does**: Private journaling with optional AI-generated supportive responses
**Why it matters**: Provides safe space for reflection with intelligent feedback
**Success criteria**: Users find AI responses helpful and feel encouraged to continue writing

### 4. Mindfulness Exercises
**What it does**: Guided breathing, meditation, CBT techniques, and grounding exercises
**Why it matters**: Gives users practical tools for managing stress and anxiety
**Success criteria**: Users complete exercises and report feeling calmer afterward

### 5. Personal Insights
**What it does**: AI-generated analysis of mood patterns, journal themes, and suggestions
**Why it matters**: Helps users understand their mental health patterns
**Success criteria**: Insights feel accurate and actionable to users

### 6. Crisis Intervention Detection
**What it does**: Automatically detects concerning language in chat and journal entries that may indicate crisis situations (suicidal ideation, self-harm, severe distress) and immediately provides professional crisis resources
**Why it matters**: Ensures users in crisis get immediate access to professional help and life-saving resources
**Success criteria**: Crisis indicators are accurately detected without false positives, and users receive appropriate professional resources immediately

### 7. Settings & Privacy
**What it does**: Data management, notification preferences, privacy controls
**Why it matters**: Users need control over their sensitive mental health data
**Success criteria**: Users feel secure and in control of their information

## Design Direction

### Visual Tone & Identity

**Emotional Response**: Users should feel immediately calmed, welcomed, and safe when opening the app

**Design Personality**: Gentle, therapeutic, trustworthy, and modern - like a warm, professional therapy office

**Visual Metaphors**: Soft natural elements, healing colors, organic shapes that suggest growth and wellness

**Simplicity Spectrum**: Minimal interface that reduces cognitive load and promotes focus

### Color Strategy

**Color Scheme Type**: Analogous (adjacent therapeutic colors)

**Primary Color**: Soft Teal (oklch(0.65 0.1 180)) - healing, balance, trustworthiness
**Secondary Color**: Sage Green (oklch(0.7 0.08 150)) - tranquility, nature, growth  
**Accent Color**: Warm Coral (oklch(0.72 0.12 25)) - positive reinforcement, gentle energy
**Background**: Nearly White (oklch(0.98 0.005 180)) - spaciousness, clarity
**Foreground**: Soft Charcoal (oklch(0.25 0.02 180)) - readable, non-harsh

**Color Psychology**: These colors are scientifically associated with reduced anxiety, improved focus, and emotional balance

**Foreground/Background Pairings**:
- Primary text (charcoal) on background (near-white): High contrast for readability
- White text on primary (teal): Clean, professional feeling
- White text on accent (coral): Energizing for call-to-action buttons
- Muted text on cards: Gentle hierarchy without being stark

### Typography System

**Font Pairing Strategy**: Single font family (Inter) with varied weights for consistency and simplicity
**Typographic Hierarchy**: Clear distinction between headings (600 weight), subheadings (500 weight), and body text (400 weight)
**Font Personality**: Inter conveys clarity, accessibility, and modern professionalism
**Which fonts**: Inter from Google Fonts - optimized for screen reading and international accessibility
**Legibility Check**: Inter is specifically designed for user interface legibility

### Visual Hierarchy & Layout

**Attention Direction**: Gentle visual flow using spacing, color intensity, and subtle shadows
**White Space Philosophy**: Generous spacing to reduce visual overwhelm and promote calm
**Grid System**: Consistent spacing using Tailwind's spacing scale for mathematical harmony
**Responsive Approach**: Mobile-first design with comfortable touch targets
**Content Density**: Prioritizes breathing room over information density

### Animations

**Purposeful Meaning**: Subtle transitions that feel therapeutic rather than flashy
**Hierarchy of Movement**: Focus on state changes and feedback rather than decorative animation
**Contextual Appropriateness**: Gentle, calming motions that support the therapeutic context

### UI Elements & Component Selection

**Component Usage**: 
- Cards for content grouping with soft shadows
- Buttons with clear hierarchy (primary/secondary/ghost)
- Input fields with gentle focus states
- Dialogs for important interactions
- Scroll areas for chat and long content

**Component Customization**: Rounded corners (0.75rem radius) for softer, more approachable feeling
**Icon Selection**: Phosphor icons for consistency, with meaningful symbols (Heart, BookOpen, Leaf, ChatCircle)
**Spacing System**: Consistent use of Tailwind spacing scale (4, 6, 8, 12 for primary spacing)

### Accessibility & Readability

**Contrast Goal**: All text meets WCAG AA standards with minimum 4.5:1 contrast ratios
**Focus Management**: Clear focus indicators for keyboard navigation
**Screen Reader Support**: Semantic HTML and proper ARIA labels
**Color Independence**: Information conveyed through multiple visual cues, not color alone

## Implementation Considerations

**Scalability Needs**: Designed to handle growing conversation history and data insights
**Privacy Focus**: All data stored locally using useKV, no external data transmission except AI calls
**AI Integration**: Uses spark.llm API for empathetic responses with careful prompt engineering
**Testing Focus**: AI response quality, emotional appropriateness, user feeling supported

## Reflection

This approach uniquely combines immediate AI companionship with structured mental health tools, creating a comprehensive support system that's always available. The gentle, therapeutic design language reinforces the app's core mission of providing safe, non-judgmental support for mental wellness.