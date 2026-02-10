// ARIES THINKING STYLE - COMPLETE IMPLEMENTATION
// Covers cognition, motivation, behavior, goals, and decision-making

export const ariesThinkingStyles = [
  {
    zoneId: 1,
    name: "Instinctive-Compassionate Thinking",
    archetype: "The Mystic Warrior",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 120,
      verbalIntelligence: 50,
      abstractionTolerance: 40,
      metaCognition: 30,
      focus: 60,
      cognitiveFlexibility: 60
    },
    
    motivation: {
      primary: "Spiritual calling + compassion",
      drivers: [
        { factor: "Intuitive pull", weight: 40 },
        { factor: "Compassion for suffering", weight: 30 },
        { factor: "Courage test", weight: 20 },
        { factor: "Creative expression", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (hours)",
      impulsivity: 75,
      planningTendency: 25,
      immediateActions: 60,
      shortTermActions: 30,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 60, focus: "Immediate spiritual action" },
      mediumTerm: { weight: 30, focus: "Building healing practice" },
      longTerm: { weight: 10, focus: "Dharma fulfillment" }
    },
    
    decisionWeights: [
      { factor: "Feels spiritually right", weight: 35 },
      { factor: "Helps others", weight: 25 },
      { factor: "Courage test", weight: 20 },
      { factor: "Immediate feasibility", weight: 10 },
      { factor: "Logic", weight: 5 },
      { factor: "Money", weight: 5 }
    ],
    
    behavior: {
      conflict: "Avoidant then explosive",
      stress: "Spiritual retreat or fight",
      success: "Humble gratitude",
      failure: "Deep processing"
    },
    
    motto: "I feel the call, I act with heart"
  },

  {
    zoneId: 2,
    name: "Pure Instinctive Thinking",
    archetype: "The Unstoppable Force",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 150,
      verbalIntelligence: 40,
      abstractionTolerance: 20,
      metaCognition: 15,
      focus: 80,
      cognitiveFlexibility: 40
    },
    
    motivation: {
      primary: "Raw action + dominance",
      drivers: [
        { factor: "Immediate challenge", weight: 50 },
        { factor: "Physical sensation", weight: 25 },
        { factor: "Winning", weight: 20 },
        { factor: "Adrenaline", weight: 5 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Instant",
      impulsivity: 95,
      planningTendency: 5,
      immediateActions: 85,
      shortTermActions: 13,
      mediumTermActions: 2,
      longTermActions: 0
    },
    
    goals: {
      shortTerm: { weight: 90, focus: "Win THIS moment" },
      mediumTerm: { weight: 10, focus: "Maintain dominance" },
      longTerm: { weight: 0, focus: "N/A" }
    },
    
    decisionWeights: [
      { factor: "Can do RIGHT NOW", weight: 40 },
      { factor: "Will I win", weight: 30 },
      { factor: "Excitement", weight: 20 },
      { factor: "Ownership", weight: 5 },
      { factor: "Consequences", weight: 3 },
      { factor: "Others' feelings", weight: 2 }
    ],
    
    behavior: {
      conflict: "Immediate physical confrontation",
      stress: "Fight harder",
      success: "Next challenge",
      failure: "Rage then bounce"
    },
    
    motto: "I act, therefore I am"
  },

  {
    zoneId: 3,
    name: "Performance-Driven Thinking",
    archetype: "The Champion",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 135,
      verbalIntelligence: 60,
      abstractionTolerance: 35,
      metaCognition: 40,
      focus: 75,
      cognitiveFlexibility: 50
    },
    
    motivation: {
      primary: "Recognition + creative expression",
      drivers: [
        { factor: "Admiration", weight: 40 },
        { factor: "Creative challenge", weight: 30 },
        { factor: "Winning with style", weight: 20 },
        { factor: "Reputation", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (hours)",
      impulsivity: 70,
      planningTendency: 30,
      immediateActions: 50,
      shortTermActions: 40,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 60, focus: "Next performance" },
      mediumTerm: { weight: 30, focus: "Build reputation" },
      longTerm: { weight: 10, focus: "Creative legacy" }
    },
    
    decisionWeights: [
      { factor: "Look good doing it", weight: 35 },
      { factor: "Creative expression", weight: 25 },
      { factor: "Recognition", weight: 20 },
      { factor: "Winning", weight: 10 },
      { factor: "Practical", weight: 7 },
      { factor: "Others' needs", weight: 3 }
    ],
    
    behavior: {
      conflict: "Dramatic confrontation",
      stress: "Performative suffering",
      success: "Basks in glory",
      failure: "Dramatic comeback"
    },
    
    motto: "I shine, therefore I matter"
  },

  {
    zoneId: 4,
    name: "Strategic-Warrior Thinking",
    archetype: "The General",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 120,
      verbalIntelligence: 65,
      abstractionTolerance: 50,
      metaCognition: 60,
      focus: 85,
      cognitiveFlexibility: 40
    },
    
    motivation: {
      primary: "Victory through strategy",
      drivers: [
        { factor: "Strategic winning", weight: 40 },
        { factor: "Building empire", weight: 30 },
        { factor: "Honorable combat", weight: 20 },
        { factor: "Protection", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (hours-days)",
      impulsivity: 45,
      planningTendency: 55,
      immediateActions: 30,
      shortTermActions: 50,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Win current battle" },
      mediumTerm: { weight: 45, focus: "Build power structure" },
      longTerm: { weight: 15, focus: "Legacy of power" }
    },
    
    decisionWeights: [
      { factor: "Strategic advantage", weight: 35 },
      { factor: "Honor/reputation", weight: 25 },
      { factor: "Power increase", weight: 20 },
      { factor: "Protection", weight: 10 },
      { factor: "Financial", weight: 7 },
      { factor: "Others' welfare", weight: 3 }
    ],
    
    behavior: {
      conflict: "Strategic confrontation",
      stress: "Strategic withdrawal",
      success: "Dignified pride",
      failure: "Analyze and revenge"
    },
    
    motto: "I strategize, I conquer, I rule"
  },

  {
    zoneId: 5,
    name: "Philosophical-Adventurer Thinking",
    archetype: "The Explorer",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 140,
      verbalIntelligence: 70,
      abstractionTolerance: 65,
      metaCognition: 55,
      focus: 50,
      cognitiveFlexibility: 80
    },
    
    motivation: {
      primary: "Adventure + meaning",
      drivers: [
        { factor: "New experiences", weight: 35 },
        { factor: "Philosophical truth", weight: 30 },
        { factor: "Freedom", weight: 25 },
        { factor: "Excitement", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (minutes-hours)",
      impulsivity: 80,
      planningTendency: 20,
      immediateActions: 55,
      shortTermActions: 30,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 65, focus: "Next adventure" },
      mediumTerm: { weight: 30, focus: "Accumulate wisdom" },
      longTerm: { weight: 5, focus: "Become sage" }
    },
    
    decisionWeights: [
      { factor: "Is it adventure", weight: 35 },
      { factor: "Learn meaning", weight: 30 },
      { factor: "Expands freedom", weight: 20 },
      { factor: "Excitement", weight: 10 },
      { factor: "Financial", weight: 3 },
      { factor: "Security", weight: 2 }
    ],
    
    behavior: {
      conflict: "Joke or escape",
      stress: "Book flight away",
      success: "Share story widely",
      failure: "Find lesson, laugh"
    },
    
    motto: "I explore, I learn, I am free"
  },

  {
    zoneId: 6,
    name: "Grounded-Builder Thinking",
    archetype: "The Practical Warrior",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 110,
      verbalIntelligence: 55,
      abstractionTolerance: 35,
      metaCognition: 45,
      focus: 75,
      cognitiveFlexibility: 50
    },
    
    motivation: {
      primary: "Build real things",
      drivers: [
        { factor: "Tangible results", weight: 40 },
        { factor: "Physical mastery", weight: 30 },
        { factor: "Ownership", weight: 20 },
        { factor: "Practical value", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (hours-days)",
      impulsivity: 60,
      planningTendency: 40,
      immediateActions: 40,
      shortTermActions: 45,
      mediumTermActions: 13,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Build this NOW" },
      mediumTerm: { weight: 40, focus: "Build wealth/empire" },
      longTerm: { weight: 10, focus: "Tangible legacy" }
    },
    
    decisionWeights: [
      { factor: "Tangible value", weight: 35 },
      { factor: "Practical feasibility", weight: 25 },
      { factor: "Ownership gained", weight: 20 },
      { factor: "Physical appeal", weight: 10 },
      { factor: "Speed of results", weight: 7 },
      { factor: "Others' opinions", weight: 3 }
    ],
    
    behavior: {
      conflict: "Stubborn standoff",
      stress: "Dig in harder",
      success: "Quiet satisfaction",
      failure: "Stubborn retry"
    },
    
    motto: "I build, I own, I protect"
  }
];
