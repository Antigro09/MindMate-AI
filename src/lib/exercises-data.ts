import { Exercise } from './types'

export const EXERCISES: Exercise[] = [
  {
    id: 'breathing-4-7-8',
    title: '4-7-8 Breathing',
    description: 'A calming breathing technique to reduce anxiety and promote relaxation',
    duration: 5,
    category: 'breathing',
    instructions: [
      'Sit comfortably with your back straight',
      'Exhale completely through your mouth',
      'Close your mouth and inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat this cycle 3-4 times'
    ]
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'A simple technique used by Navy SEALs to stay calm under pressure',
    duration: 10,
    category: 'breathing',
    instructions: [
      'Sit upright in a comfortable chair',
      'Exhale all air from your lungs',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 4 counts', 
      'Exhale through your mouth for 4 counts',
      'Hold empty for 4 counts',
      'Repeat for 5-10 cycles'
    ]
  },
  {
    id: 'body-scan',
    title: 'Progressive Body Scan',
    description: 'Release tension and increase awareness of your physical state',
    duration: 15,
    category: 'meditation',
    instructions: [
      'Lie down or sit comfortably',
      'Close your eyes and take three deep breaths',
      'Start at the top of your head',
      'Notice any sensations without trying to change them',
      'Slowly move your attention down your body',
      'Spend 30 seconds on each body part',
      'End at your toes, then rest for a moment'
    ]
  },
  {
    id: 'thought-challenging',
    title: 'Thought Challenging',
    description: 'Question negative thoughts and find more balanced perspectives',
    duration: 10,
    category: 'cbt',
    instructions: [
      'Identify the negative thought you\'re having',
      'Ask: "Is this thought realistic?"',
      'Ask: "What evidence supports this thought?"',
      'Ask: "What evidence contradicts this thought?"',
      'Ask: "What would I tell a friend having this thought?"',
      'Create a more balanced, realistic thought',
      'Practice the new thought when the old one arises'
    ]
  },
  {
    id: '5-4-3-2-1-grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to ground yourself in the present moment',
    duration: 5,
    category: 'grounding',
    instructions: [
      'Look around and name 5 things you can see',
      'Notice 4 things you can touch',
      'Listen for 3 things you can hear',
      'Identify 2 things you can smell',
      'Think of 1 thing you can taste',
      'Take three deep breaths',
      'Notice how you feel now compared to when you started'
    ]
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others',
    duration: 12,
    category: 'meditation',
    instructions: [
      'Sit comfortably and close your eyes',
      'Begin with yourself: "May I be happy, may I be healthy, may I be at peace"',
      'Picture someone you love and repeat the phrases for them',
      'Think of a neutral person and extend the same wishes',
      'Consider someone difficult and offer them the same kindness',
      'Extend to all beings: "May all beings be happy and free"',
      'Rest in the feeling of loving-kindness'
    ]
  }
]