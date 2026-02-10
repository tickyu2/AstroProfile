// CANCER THINKING STYLES - COMPLETE IMPLEMENTATION
// Water Sign: Emotional processing, memory-based, protective, intuitive

export const cancerThinkingStyles = [
  {
    zoneId: 1,
    name: "Articulate-Emotional Thinking",
    archetype: "The Feeling Communicator",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 80,
      abstractionTolerance: 50,
      metaCognition: 70,
      focus: 65,
      cognitiveFlexibility: 70
    },
    
    motivation: {
      primary: "Understanding emotions through communication",
      drivers: [
        { factor: "Creating emotional connection", weight: 35 },
        { factor: "Teaching emotional intelligence", weight: 30 },
        { factor: "Protecting through words", weight: 20 },
        { factor: "Emotional variety and expression", weight: 15 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (processes emotionally, then articulates)",
      impulsivity: 45,
      planningTendency: 55,
      immediateActions: 35,
      shortTermActions: 45,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Express feelings clearly today" },
      mediumTerm: { weight: 35, focus: "Build emotional vocabulary/community" },
      longTerm: { weight: 15, focus: "Become emotional wisdom teacher" }
    },
    
    decisionWeights: [
      { factor: "How does it FEEL", weight: 35 },
      { factor: "Can I explain it clearly", weight: 25 },
      { factor: "Creates emotional safety", weight: 20 },
      { factor: "Protects loved ones", weight: 10 },
      { factor: "Practical logistics", weight: 7 },
      { factor: "Financial security", weight: 3 }
    ],
    
    behavior: {
      conflict: "Talks through feelings, seeks understanding",
      stress: "Verbally processes emotions",
      success: "Shares emotional journey",
      failure: "Analyzes lessons, teaches from it"
    },
    
    motto: "I feel deeply and speak clearly"
  },

  {
    zoneId: 2,
    name: "Pure Emotional-Memory Thinking",
    archetype: "The Feeling Archive",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 55,
      verbalIntelligence: 40,
      abstractionTolerance: 25,
      metaCognition: 45,
      focus: 90,
      cognitiveFlexibility: 30
    },
    
    motivation: {
      primary: "Emotional security and deep connection",
      drivers: [
        { factor: "Creating safe space", weight: 40 },
        { factor: "Nurturing loved ones", weight: 35 },
        { factor: "Preserving memories", weight: 15 },
        { factor: "Protecting family", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (needs emotional safety first)",
      impulsivity: 20,
      planningTendency: 80,
      immediateActions: 15,
      shortTermActions: 40,
      mediumTermActions: 35,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 35, focus: "Maintain emotional equilibrium" },
      mediumTerm: { weight: 50, focus: "Build secure home/family" },
      longTerm: { weight: 15, focus: "Create emotional legacy" }
    },
    
    decisionWeights: [
      { factor: "Is it emotionally SAFE", weight: 45 },
      { factor: "Protects family/home", weight: 30 },
      { factor: "Feels familiar/comfortable", weight: 15 },
      { factor: "Honors emotional history", weight: 7 },
      { factor: "Financial security", weight: 2 },
      { factor: "Logical reasoning", weight: 1 }
    ],
    
    behavior: {
      conflict: "Withdraws to shell, processes privately",
      stress: "Retreats to safe space, comfort rituals",
      success: "Quiet satisfaction, shares with inner circle",
      failure: "Deep wound, never forgets"
    },
    
    motto: "I feel everything, I remember forever"
  },

  {
    zoneId: 3,
    name: "Protective-Intuitive Thinking",
    archetype: "The Psychic Guardian",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 65,
      verbalIntelligence: 50,
      abstractionTolerance: 45,
      metaCognition: 75,
      focus: 95,
      cognitiveFlexibility: 40
    },
    
    motivation: {
      primary: "Protecting loved ones from all threats",
      drivers: [
        { factor: "Detecting/eliminating threats", weight: 45 },
        { factor: "Creating impenetrable safety", weight: 30 },
        { factor: "Deep emotional bonding", weight: 15 },
        { factor: "Transforming pain", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow unless protecting (then instant)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 30,
      shortTermActions: 45,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Eliminate current threats" },
      mediumTerm: { weight: 40, focus: "Build fortress security" },
      longTerm: { weight: 10, focus: "Protect future generations" }
    },
    
    decisionWeights: [
      { factor: "Threat to family?", weight: 50 },
      { factor: "Strengthens boundaries", weight: 25 },
      { factor: "Deepens emotional bonds", weight: 15 },
      { factor: "Transforms vulnerability", weight: 7 },
      { factor: "Practical considerations", weight: 2 },
      { factor: "Others' opinions", weight: 1 }
    ],
    
    behavior: {
      conflict: "Fierce attack if threatened, else retreat",
      stress: "Paranoid vigilance, aggressive protection",
      success: "Quiet satisfaction, strengthens fortress",
      failure: "Rage, intensified protection"
    },
    
    motto: "I sense danger, I protect fiercely"
  },

  {
    zoneId: 4,
    name: "Transformative-Emotional Thinking",
    archetype: "The Depth Alchemist",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 50,
      verbalIntelligence: 55,
      abstractionTolerance: 65,
      metaCognition: 90,
      focus: 100,
      cognitiveFlexibility: 45
    },
    
    motivation: {
      primary: "Emotional transformation and regeneration",
      drivers: [
        { factor: "Transforming pain", weight: 40 },
        { factor: "Psychological understanding", weight: 30 },
        { factor: "Powerful connection", weight: 20 },
        { factor: "Regenerating from wounds", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (waits for deep knowing)",
      impulsivity: 25,
      planningTendency: 75,
      immediateActions: 20,
      shortTermActions: 35,
      mediumTermActions: 35,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 30, focus: "Process current crisis" },
      mediumTerm: { weight: 50, focus: "Transform wounds to wisdom" },
      longTerm: { weight: 20, focus: "Master emotional alchemy" }
    },
    
    decisionWeights: [
      { factor: "Leads to transformation", weight: 45 },
      { factor: "Deepens understanding", weight: 25 },
      { factor: "Psychological truth", weight: 20 },
      { factor: "Honors intensity", weight: 7 },
      { factor: "Practical outcomes", weight: 2 },
      { factor: "Comfort/ease", weight: 1 }
    ],
    
    behavior: {
      conflict: "Goes to depths, seeks transformation",
      stress: "Obsessive processing, crisis as fuel",
      success: "Quiet power, shares wisdom",
      failure: "Phoenix moment - dies and rises"
    },
    
    motto: "I die emotionally and rise transformed"
  },

  {
    zoneId: 5,
    name: "Mystic-Compassionate Thinking",
    archetype: "The Universal Heart",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 45,
      verbalIntelligence: 60,
      abstractionTolerance: 80,
      metaCognition: 60,
      focus: 50,
      cognitiveFlexibility: 85
    },
    
    motivation: {
      primary: "Universal love and spiritual connection",
      drivers: [
        { factor: "Oneness with all beings", weight: 40 },
        { factor: "Healing universal suffering", weight: 30 },
        { factor: "Creating sacred beauty", weight: 20 },
        { factor: "Transcending ego", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (waits for divine timing)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 30,
      shortTermActions: 40,
      mediumTermActions: 25,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Express spiritual love today" },
      mediumTerm: { weight: 40, focus: "Heal collective wounds" },
      longTerm: { weight: 15, focus: "Merge with divine love" }
    },
    
    decisionWeights: [
      { factor: "Serves universal love", weight: 45 },
      { factor: "Reduces suffering", weight: 25 },
      { factor: "Honors sacred/spiritual", weight: 20 },
      { factor: "Feels compassionate", weight: 7 },
      { factor: "Practical logistics", weight: 2 },
      { factor: "Self-interest", weight: 1 }
    ],
    
    behavior: {
      conflict: "Seeks spiritual resolution, forgives",
      stress: "Escapes to spiritual realm",
      success: "Shares blessing with all",
      failure: "Sees as spiritual lesson"
    },
    
    motto: "I love all beings, I am all beings"
  },

  {
    zoneId: 6,
    name: "Radiant-Emotional Thinking",
    archetype: "The Joyful Nurturer",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 70,
      verbalIntelligence: 70,
      abstractionTolerance: 50,
      metaCognition: 65,
      focus: 75,
      cognitiveFlexibility: 65
    },
    
    motivation: {
      primary: "Joyful nurturing and creative expression",
      drivers: [
        { factor: "Spreading emotional warmth", weight: 35 },
        { factor: "Creative expression", weight: 30 },
        { factor: "Being appreciated", weight: 20 },
        { factor: "Building beautiful spaces", weight: 15 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (processes then acts warmly)",
      impulsivity: 50,
      planningTendency: 50,
      immediateActions: 40,
      shortTermActions: 45,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 60, focus: "Create joy and warmth today" },
      mediumTerm: { weight: 30, focus: "Build beautiful home/family" },
      longTerm: { weight: 10, focus: "Be remembered as loving" }
    },
    
    decisionWeights: [
      { factor: "Brings joy and warmth", weight: 40 },
      { factor: "Expresses love creatively", weight: 25 },
      { factor: "Gets appreciation", weight: 20 },
      { factor: "Creates beauty", weight: 10 },
      { factor: "Protects family", weight: 4 },
      { factor: "Practical concerns", weight: 1 }
    ],
    
    behavior: {
      conflict: "Dramatic expression, then forgiveness",
      stress: "Performance anxiety, needs reassurance",
      success: "Generous sharing, basks in love",
      failure: "Hurt pride, bounces back with warmth"
    },
    
    motto: "I nurture with joy, I shine with love"
  }
];

export default cancerThinkingStyles;
