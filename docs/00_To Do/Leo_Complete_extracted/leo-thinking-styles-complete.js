// LEO THINKING STYLES - COMPLETE IMPLEMENTATION
// Fire Sign: Creative, self-expressive, recognition-seeking, generous

export const leoThinkingStyles = [
  {
    zoneId: 1,
    name: "Nurturing-Creative Thinking",
    archetype: "The Caring Star",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 75,
      abstractionTolerance: 60,
      metaCognition: 65,
      focus: 70,
      cognitiveFlexibility: 65
    },
    
    motivation: {
      primary: "Recognition for caring leadership",
      drivers: [
        { factor: "Being appreciated for warmth", weight: 35 },
        { factor: "Creative self-expression", weight: 30 },
        { factor: "Protecting/nurturing others", weight: 20 },
        { factor: "Building emotional legacy", weight: 15 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-fast (considers emotional impact)",
      impulsivity: 55,
      planningTendency: 45,
      immediateActions: 40,
      shortTermActions: 45,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 55, focus: "Create warmth and be recognized" },
      mediumTerm: { weight: 35, focus: "Build caring legacy" },
      longTerm: { weight: 10, focus: "Be remembered as loving leader" }
    },
    
    decisionWeights: [
      { factor: "Will I be appreciated", weight: 35 },
      { factor: "Can I express creatively", weight: 25 },
      { factor: "Protects loved ones", weight: 20 },
      { factor: "Feels emotionally right", weight: 10 },
      { factor: "Practical logistics", weight: 7 },
      { factor: "Financial gain", weight: 3 }
    ],
    
    behavior: {
      conflict: "Dramatic defense, then warm reconciliation",
      stress: "Needs reassurance and appreciation",
      success: "Generous sharing, humble pride",
      failure: "Wounded but bounces back warmly"
    },
    
    motto: "I lead with heart and shine with love"
  },

  {
    zoneId: 2,
    name: "Pure Creative-Expressive Thinking",
    archetype: "The Radiant Monarch",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 90,
      verbalIntelligence: 80,
      abstractionTolerance: 55,
      metaCognition: 60,
      focus: 75,
      cognitiveFlexibility: 60
    },
    
    motivation: {
      primary: "Creative self-expression and recognition",
      drivers: [
        { factor: "Being center of attention", weight: 40 },
        { factor: "Creating magnificent experiences", weight: 30 },
        { factor: "Receiving admiration", weight: 20 },
        { factor: "Expressing unique identity", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (confident and decisive)",
      impulsivity: 70,
      planningTendency: 30,
      immediateActions: 55,
      shortTermActions: 35,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 65, focus: "Shine today, be admired" },
      mediumTerm: { weight: 30, focus: "Build creative empire" },
      longTerm: { weight: 5, focus: "Legendary status" }
    },
    
    decisionWeights: [
      { factor: "Will I be admired", weight: 40 },
      { factor: "Is it creative/expressive", weight: 30 },
      { factor: "Am I center stage", weight: 15 },
      { factor: "Does it feel regal", weight: 10 },
      { factor: "Practical considerations", weight: 4 },
      { factor: "Others' needs", weight: 1 }
    ],
    
    behavior: {
      conflict: "Dramatic confrontation, demands respect",
      stress: "Withdraws majestically, sulks",
      success: "Generous celebration, basks in glory",
      failure: "Wounded pride, dramatic recovery"
    },
    
    motto: "I create, I shine, I rule"
  },

  {
    zoneId: 3,
    name: "Visionary-Expansive Thinking",
    archetype: "The Inspired Leader",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 95,
      verbalIntelligence: 85,
      abstractionTolerance: 70,
      metaCognition: 65,
      focus: 65,
      cognitiveFlexibility: 80
    },
    
    motivation: {
      primary: "Inspiring others through grand vision",
      drivers: [
        { factor: "Creating visionary impact", weight: 35 },
        { factor: "Adventurous expression", weight: 30 },
        { factor: "Teaching/inspiring others", weight: 20 },
        { factor: "Recognition as leader", weight: 15 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very fast (confident vision)",
      impulsivity: 80,
      planningTendency: 20,
      immediateActions: 60,
      shortTermActions: 30,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 60, focus: "Launch next big idea" },
      mediumTerm: { weight: 30, focus: "Build visionary movement" },
      longTerm: { weight: 10, focus: "Change culture/society" }
    },
    
    decisionWeights: [
      { factor: "Is it visionary/BIG", weight: 40 },
      { factor: "Will it inspire others", weight: 25 },
      { factor: "Is it adventurous", weight: 20 },
      { factor: "Gives me recognition", weight: 10 },
      { factor: "Practical feasibility", weight: 4 },
      { factor: "Risk level", weight: 1 }
    ],
    
    behavior: {
      conflict: "Preaches vision, then moves on",
      stress: "Escapes into new adventure",
      success: "Shares generously, aims higher",
      failure: "Optimistic reframe, next vision"
    },
    
    motto: "I inspire greatness, I create the future"
  },

  {
    zoneId: 4,
    name: "Bold-Visionary Thinking",
    archetype: "The Cultural Pioneer",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 100,
      verbalIntelligence: 85,
      abstractionTolerance: 75,
      metaCognition: 70,
      focus: 70,
      cognitiveFlexibility: 85
    },
    
    motivation: {
      primary: "Leading cultural transformation",
      drivers: [
        { factor: "Changing society/culture", weight: 40 },
        { factor: "Being visionary leader", weight: 30 },
        { factor: "Fearless self-expression", weight: 20 },
        { factor: "Building empire/legacy", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very fast (fearless decisiveness)",
      impulsivity: 85,
      planningTendency: 15,
      immediateActions: 65,
      shortTermActions: 28,
      mediumTermActions: 6,
      longTermActions: 1
    },
    
    goals: {
      shortTerm: { weight: 65, focus: "Make bold move today" },
      mediumTerm: { weight: 28, focus: "Lead movement/revolution" },
      longTerm: { weight: 7, focus: "Historical legacy" }
    },
    
    decisionWeights: [
      { factor: "Cultural/societal impact", weight: 40 },
      { factor: "Establishes me as leader", weight: 30 },
      { factor: "Is it bold/fearless", weight: 20 },
      { factor: "Visionary scope", weight: 7 },
      { factor: "Practical concerns", weight: 2 },
      { factor: "Others' approval", weight: 1 }
    ],
    
    behavior: {
      conflict: "Dominates with vision, no compromise",
      stress: "Doubles down on boldness",
      success: "Magnanimous, aims even higher",
      failure: "Reframes as lesson, charges ahead"
    },
    
    motto: "I lead revolutions, I transform culture"
  },

  {
    zoneId: 5,
    name: "Courageous-Competitive Thinking",
    archetype: "The Warrior Performer",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 95,
      verbalIntelligence: 75,
      abstractionTolerance: 50,
      metaCognition: 60,
      focus: 85,
      cognitiveFlexibility: 55
    },
    
    motivation: {
      primary: "Winning recognition through courage",
      drivers: [
        { factor: "Being #1, winning", weight: 40 },
        { factor: "Proving courage/strength", weight: 30 },
        { factor: "Competitive excellence", weight: 20 },
        { factor: "Respected for bravery", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (acts on courage)",
      impulsivity: 75,
      planningTendency: 25,
      immediateActions: 60,
      shortTermActions: 32,
      mediumTermActions: 7,
      longTermActions: 1
    },
    
    goals: {
      shortTerm: { weight: 70, focus: "Win today's battle" },
      mediumTerm: { weight: 25, focus: "Dominate competition" },
      longTerm: { weight: 5, focus: "Be remembered as champion" }
    },
    
    decisionWeights: [
      { factor: "Will I WIN", weight: 45 },
      { factor: "Proves my courage", weight: 25 },
      { factor: "Gains respect", weight: 15 },
      { factor: "Is it competitive", weight: 10 },
      { factor: "Practical logistics", weight: 4 },
      { factor: "Risk avoidance", weight: 1 }
    ],
    
    behavior: {
      conflict: "Fights directly, must win",
      stress: "Becomes more aggressive",
      success: "Proud celebration, next challenge",
      failure: "Wounded pride, trains harder"
    },
    
    motto: "I fight, I win, I dominate"
  },

  {
    zoneId: 6,
    name: "Perfectionist-Creative Thinking",
    archetype: "The Master Craftsperson",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 85,
      abstractionTolerance: 60,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 50
    },
    
    motivation: {
      primary: "Recognition for perfect craft",
      drivers: [
        { factor: "Creating flawless work", weight: 40 },
        { factor: "Being respected for skill", weight: 30 },
        { factor: "Serving through excellence", weight: 20 },
        { factor: "Mastering craft", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (analyzes before creating)",
      impulsivity: 45,
      planningTendency: 55,
      immediateActions: 35,
      shortTermActions: 45,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Perfect today's work" },
      mediumTerm: { weight: 40, focus: "Master the craft" },
      longTerm: { weight: 10, focus: "Be remembered for quality" }
    },
    
    decisionWeights: [
      { factor: "Can I do it PERFECTLY", weight: 40 },
      { factor: "Will it showcase skill", weight: 25 },
      { factor: "Is it worthy of my talent", weight: 20 },
      { factor: "Serves others well", weight: 10 },
      { factor: "Practical execution", weight: 4 },
      { factor: "Quick/easy option", weight: 1 }
    },
    
    behavior: {
      conflict: "Critiques flaws, demands standards",
      stress: "Anxious perfectionism, overworks",
      success: "Humble pride, notices imperfections",
      failure: "Self-critical analysis, tries again"
    },
    
    motto: "I perfect my craft, I serve through excellence"
  }
];

export default leoThinkingStyles;
