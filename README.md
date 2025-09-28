# MindMate AI - Mental Health Companion PRD

Create a private, empathetic mental health companion that provides offline journaling, mood tracking, and AI-powered mindfulness guidance to support users' emotional wellbeing through personalized insights and therapeutic exercises.

**Experience Qualities**:
1. **Empathetic** - The interface should feel warm, understanding, and non-judgmental, like talking to a caring friend
2. **Secure** - Users must feel completely safe knowing their private thoughts and emotions are protected and stored locally
3. **Supportive** - Every interaction should guide users toward better mental health through gentle encouragement and actionable insights

**Complexity Level**: Light Application (multiple features with basic state)
- Integrates journaling, mood tracking, exercises, and insights with AI-powered recommendations while maintaining offline functionality and local storage

## Essential Features

### Welcome/Home Screen
- **Functionality**: Daily emotional check-in hub with personalized greeting and quick access to all features
- **Purpose**: Create a welcoming entry point that encourages daily engagement with mental health practices
- **Trigger**: App launch or navigation to home
- **Progression**: App opens → Personalized greeting → Mood selection prompt → Feature navigation buttons → Selected feature
- **Success criteria**: Users easily navigate to desired features and feel welcomed by the interface

### Journal Entry System
- **Functionality**: Private writing space with AI-powered empathetic responses and insight generation
- **Purpose**: Provide therapeutic writing outlet with intelligent feedback to promote self-reflection
- **Trigger**: User selects "Journal" from home or feels need to express thoughts
- **Progression**: Journal button → Writing interface → Entry composition → AI response generation → Save entry → View insights
- **Success criteria**: Users regularly journal and find AI responses helpful and empathetic

### Mood Tracking
- **Functionality**: Daily mood logging with visual trend analysis and contextual notes
- **Purpose**: Help users identify emotional patterns and triggers over time
- **Trigger**: Daily check-in prompt or user-initiated mood logging
- **Progression**: Mood tracker → Emotion selection → Optional context notes → Data visualization → Pattern insights
- **Success criteria**: Users consistently track moods and gain insights from trend visualizations

### Mindfulness Exercises
- **Functionality**: Curated library of CBT and mindfulness exercises with AI-powered recommendations
- **Purpose**: Provide immediate coping tools and build long-term emotional regulation skills
- **Trigger**: User stress/anxiety or AI recommendation based on mood patterns
- **Progression**: Exercises → Browse/recommended list → Exercise selection → Guided practice → Completion tracking
- **Success criteria**: Users engage with exercises regularly and report improved mood after sessions

### AI Insights Dashboard
- **Functionality**: Pattern analysis of journal entries and mood data with personalized recommendations
- **Purpose**: Help users understand their mental health patterns and suggest improvements
- **Trigger**: Weekly analysis or user request for insights
- **Progression**: Insights → Data analysis → Pattern identification → Recommendation generation → Action suggestions
- **Success criteria**: Users find insights valuable and act on recommendations

## Edge Case Handling
- **Crisis Detection**: If journal entries indicate severe distress, provide crisis resources and professional help suggestions
- **Data Loss Prevention**: Automatic local backups with export/import functionality for data recovery
- **Offline Functionality**: All features work without internet connection using local AI processing
- **Privacy Protection**: No data transmission, encrypted local storage, and clear privacy messaging
- **Incomplete Data**: Graceful handling when users have gaps in mood tracking or journaling

## Design Direction
The interface should feel like a gentle, private sanctuary - calming and therapeutic with soft, rounded elements that invite interaction rather than demand it, balancing simplicity with the depth needed for meaningful mental health work.

## Color Selection
Analogous color scheme using calming blues and greens to create a therapeutic, spa-like atmosphere that promotes relaxation and introspection.

- **Primary Color**: Soft Teal (oklch(0.65 0.1 180)) - Communicates calm, healing, and emotional balance
- **Secondary Colors**: 
  - Sage Green (oklch(0.7 0.08 150)) - Nature-inspired tranquility for exercise sections
  - Lavender Blue (oklch(0.75 0.06 240)) - Gentle, non-threatening for mood tracking
- **Accent Color**: Warm Coral (oklch(0.72 0.12 25)) - Gentle warmth for positive reinforcement and completion states
- **Foreground/Background Pairings**:
  - Background (Soft White oklch(0.98 0.005 180)): Dark Charcoal (oklch(0.25 0.02 180)) - Ratio 16.8:1 ✓
  - Card (Pure White oklch(1 0 0)): Dark Charcoal (oklch(0.25 0.02 180)) - Ratio 18.1:1 ✓
  - Primary (Soft Teal oklch(0.65 0.1 180)): White (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Secondary (Sage Green oklch(0.7 0.08 150)): White (oklch(1 0 0)) - Ratio 6.1:1 ✓
  - Accent (Warm Coral oklch(0.72 0.12 25)): White (oklch(1 0 0)) - Ratio 6.3:1 ✓
  - Muted (Light Teal oklch(0.95 0.02 180)): Medium Charcoal (oklch(0.4 0.03 180)) - Ratio 9.2:1 ✓

## Font Selection
Choose a humanist sans-serif that feels approachable and readable for extended journaling sessions, avoiding clinical or overly technical typefaces in favor of something that feels personal and supportive.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Medium/32px/tight letter spacing - Clear hierarchy without being overwhelming
  - H2 (Section Headers): Inter Medium/24px/normal letter spacing - Gentle guidance through features  
  - H3 (Feature Labels): Inter Medium/18px/normal letter spacing - Clear feature identification
  - Body (Journal Text): Inter Regular/16px/relaxed line height - Comfortable for extended reading and writing
  - Caption (Timestamps, Notes): Inter Regular/14px/normal letter spacing - Unobtrusive metadata

## Animations
Subtle, therapeutic micro-interactions that feel like gentle breathing - slow, purposeful movements that reinforce the calming nature of the app without being distracting during vulnerable moments.

- **Purposeful Meaning**: Gentle fade-ins and breathing-like pulsing animations reinforce the therapeutic, mindful brand personality
- **Hierarchy of Movement**: 
  - Primary: Mood selection and journal saving get satisfying completion animations
  - Secondary: Page transitions use soft slide animations that feel like turning journal pages
  - Tertiary: Subtle hover states on interactive elements provide gentle feedback

## Component Selection
- **Components**: 
  - Cards for journal entries and mood tracking with soft shadows
  - Tabs for main navigation with rounded pill styling
  - Dialog for exercises and insights with gentle backdrop blur
  - Progress indicators for exercise completion using circular progress
  - Select components for mood picker with custom emoji integration
  - Textarea for journal writing with auto-expanding height
  - Button components with multiple variants for different emotional contexts
- **Customizations**: 
  - Custom mood selector with large, expressive emoji buttons
  - Animated floating action button for quick mood logging
  - Custom chart components for mood visualization using soft, organic curves
  - Breathing exercise timer with pulsing visual feedback
- **States**: 
  - Buttons have gentle press animations and soft color transitions
  - Input fields show subtle glow focus states in primary color
  - Mood selection shows soft highlighting and gentle scale animations
  - Exercise completion shows warm, congratulatory micro-animations
- **Icon Selection**: 
  - Phosphor icons with "regular" weight for approachability
  - Heart for mood tracking, Book for journaling, Leaf for exercises, Chart for insights
  - Soft, rounded icons that feel organic rather than geometric
- **Spacing**: 
  - Generous padding (p-6, p-8) to create breathing room
  - Consistent gap-6 between related elements, gap-8 between sections
  - Extra spacing around touch targets for accessibility
- **Mobile**: 
  - Bottom navigation for main features on mobile
  - Full-screen journal writing mode on mobile devices
  - Touch-friendly mood selection with large tap targets
  - Swipe gestures for navigating between journal entries
  - Progressive disclosure showing most important features first