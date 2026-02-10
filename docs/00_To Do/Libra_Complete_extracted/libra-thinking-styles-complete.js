// LIBRA THINKING STYLES - COMPLETE IMPLEMENTATION
// Air Sign: Balanced, diplomatic, aesthetic, relationship-oriented

export const libraThinkingStyles = [
  {
    zoneId: 1,
    name: "Analytical-Harmonious Thinking",
    archetype: "The Refined Diplomat",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 85,
      abstractionTolerance: 65,
      metaCognition: 80,
      focus: 75,
      cognitiveFlexibility: 75
    },
    
    motivation: {
      primary: "Perfect harmony through refined analysis",
      drivers: [
        { factor: "Creating aesthetic balance", weight: 35 },
        { factor: "Diplomatic problem-solving", weight: 30 },
        { factor: "Perfecting relationships", weight: 20 },
        { factor: "Maintaining standards", weight: 15 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-slow (analyzes for perfect balance)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 25,
      shortTermActions: 50,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Create refined harmony today" },
      mediumTerm: { weight: 40, focus: "Perfect aesthetic systems" },
      longTerm: { weight: 10, focus: "Be remembered for graceful excellence" }
    },
    
    decisionWeights: [
      { factor: "Creates harmony/balance", weight: 35 },
      { factor: "Meets aesthetic standards", weight: 25 },
      { factor: "Diplomatically sound", weight: 20 },
      { factor: "Analytically perfect", weight: 12 },
      { factor: "Practical execution", weight: 6 },
      { factor: "Quick/easy", weight: 2 }
    ],
    
    behavior: {
      conflict: "Analyzes diplomatically, seeks refined solution",
      stress: "Perfectionistic indecision, aesthetic anxiety",
      success: "Gracious satisfaction, notices imperfections",
      failure: "Tactful analysis, diplomatic retry"
    },
    
    motto: "I balance perfection with grace"
  },

  {
    zoneId: 2,
    name: "Pure Relational-Balance Thinking",
    archetype: "The Ultimate Harmonizer",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 75,        // Slowed by weighing all options
      verbalIntelligence: 90,
      abstractionTolerance: 70,
      metaCognition: 70,          // Aware but lost in reflection
      focus: 60,                  // Scattered by seeing all sides
      cognitiveFlexibility: 95    // Extremely flexible
    },
    
    motivation: {
      primary: "Perfect balance and harmonious relationships",
      drivers: [
        { factor: "Maintaining harmony", weight: 40 },
        { factor: "Being loved/liked by all", weight: 30 },
        { factor: "Creating beauty", weight: 20 },
        { factor: "Fair justice for everyone", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (paralyzed by options)",
      impulsivity: 20,
      planningTendency: 80,
      immediateActions: 15,
      shortTermActions: 40,
      mediumTermActions: 35,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Maintain peace today" },
      mediumTerm: { weight: 40, focus: "Build perfect relationships" },
      longTerm: { weight: 15, focus: "Create lasting harmony" }
    },
    
    decisionWeights: [
      { factor: "Creates harmony/peace", weight: 45 },
      { factor: "Everyone likes me", weight: 25 },
      { factor: "Aesthetically beautiful", weight: 15 },
      { factor: "Fair to all parties", weight: 10 },
      { factor: "Practical logistics", weight: 4 },
      { factor: "My authentic desire", weight: 1 }
    ],
    
    behavior: {
      conflict: "Avoids completely, people-pleases",
      stress: "Paralyzed indecision, seeks partner's opinion",
      success: "Generous sharing, ensures everyone happy",
      failure: "Blames imbalance, seeks new equilibrium"
    },
    
    motto: "I seek perfect harmony in all things"
  },

  {
    zoneId: 3,
    name: "Progressive-Social Thinking",
    archetype: "The Justice Advocate",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 85,
      verbalIntelligence: 90,
      abstractionTolerance: 85,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 90
    },
    
    motivation: {
      primary: "Social justice through innovative harmony",
      drivers: [
        { factor: "Fighting for equality", weight: 40 },
        { factor: "Innovative relationships", weight: 30 },
        { factor: "Intellectual connection", weight: 20 },
        { factor: "Progressive change", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-fast (principles guide decisions)",
      impulsivity: 50,
      planningTendency: 50,
      immediateActions: 40,
      shortTermActions: 40,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 55, focus: "Advocate for fairness today" },
      mediumTerm: { weight: 35, focus: "Build progressive community" },
      longTerm: { weight: 10, focus: "Transform social systems" }
    },
    
    decisionWeights: [
      { factor: "Promotes equality/justice", weight: 40 },
      { factor: "Intellectually sound", weight: 25 },
      { factor: "Progressive/innovative", weight: 20 },
      { factor: "Harmonious outcome", weight: 10 },
      { factor: "Practical feasibility", weight: 4 },
      { factor: "Emotional comfort", weight: 1 }
    ],
    
    behavior: {
      conflict: "Fights for principles diplomatically",
      stress: "Detached intellectual analysis",
      success: "Shares credit, continues activism",
      failure: "Idealistic reframe, tries new approach"
    },
    
    motto: "I balance justice with innovation"
  },

  {
    zoneId: 4,
    name: "Idealistic-Partnership Thinking",
    archetype: "The Equality Champion",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 90,
      verbalIntelligence: 90,
      abstractionTolerance: 90,
      metaCognition: 80,
      focus: 75,
      cognitiveFlexibility: 85
    },
    
    motivation: {
      primary: "Radical equality in all relationships",
      drivers: [
        { factor: "Perfect fairness for all", weight: 45 },
        { factor: "Revolutionary partnership models", weight: 30 },
        { factor: "Intellectual freedom", weight: 15 },
        { factor: "Social transformation", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (strong principles)",
      impulsivity: 60,
      planningTendency: 40,
      immediateActions: 45,
      shortTermActions: 40,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 60, focus: "Challenge unfairness today" },
      mediumTerm: { weight: 30, focus: "Build equal partnerships" },
      longTerm: { weight: 10, focus: "Transform relationship paradigms" }
    },
    
    decisionWeights: [
      { factor: "Perfectly fair/equal", weight: 50 },
      { factor: "Challenges injustice", weight: 25 },
      { factor: "Intellectually consistent", weight: 15 },
      { factor: "Innovative/radical", weight: 7 },
      { factor: "Harmonious", weight: 2 },
      { factor: "Emotionally safe", weight: 1 }
    ],
    
    behavior: {
      conflict: "Fights intellectually for justice",
      stress: "Righteously defends principles",
      success: "Celebrates equality, continues mission",
      failure: "Blames unfair systems, rebels"
    },
    
    motto: "I revolutionize through perfect equality"
  },

  {
    zoneId: 5,
    name: "Versatile-Diplomatic Thinking",
    archetype: "The Social Chameleon",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 95,        // Fast mental processing
      verbalIntelligence: 95,
      abstractionTolerance: 65,
      metaCognition: 65,
      focus: 60,                  // Scattered socially
      cognitiveFlexibility: 95    // Extremely adaptable
    },
    
    motivation: {
      primary: "Social harmony through versatile communication",
      drivers: [
        { factor: "Being liked by everyone", weight: 40 },
        { factor: "Smooth social interactions", weight: 30 },
        { factor: "Collecting relationships", weight: 20 },
        { factor: "Avoiding boredom", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (adapts quickly)",
      impulsivity: 55,
      planningTendency: 45,
      immediateActions: 50,
      shortTermActions: 40,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 65, focus: "Charm everyone today" },
      mediumTerm: { weight: 30, focus: "Build diverse social network" },
      longTerm: { weight: 5, focus: "Be universally loved" }
    },
    
    decisionWeights: [
      { factor: "Keeps everyone happy", weight: 40 },
      { factor: "Socially smooth", weight: 30 },
      { factor: "Interesting/fun", weight: 15 },
      { factor: "Avoids conflict", weight: 10 },
      { factor: "Practical concerns", weight: 4 },
      { factor: "My true feelings", weight: 1 }
    ],
    
    behavior: {
      conflict: "Charms and diverts, avoids",
      stress: "Scattered social activity",
      success: "Shares charisma, moves to next",
      failure: "Blames communication, adapts approach"
    },
    
    motto: "I charm all through graceful adaptation"
  },

  {
    zoneId: 6,
    name: "Intense-Diplomatic Thinking",
    archetype: "The Passionate Mediator",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 75,
      verbalIntelligence: 85,
      abstractionTolerance: 60,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 65
    },
    
    motivation: {
      primary: "Deep transformative harmony",
      drivers: [
        { factor: "Intense loyal partnerships", weight: 40 },
        { factor: "Transforming conflicts", weight: 30 },
        { factor: "Psychological justice", weight: 20 },
        { factor: "Passionate fairness", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (feels deeply first)",
      impulsivity: 45,
      planningTendency: 55,
      immediateActions: 35,
      shortTermActions: 45,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Transform this conflict" },
      mediumTerm: { weight: 40, focus: "Build intense loyal bonds" },
      longTerm: { weight: 10, focus: "Create deep lasting harmony" }
    },
    
    decisionWeights: [
      { factor: "Deepens connection", weight: 40 },
      { factor: "Psychologically true", weight: 25 },
      { factor: "Transforms conflict", weight: 20 },
      { factor: "Fair and just", weight: 10 },
      { factor: "Harmonious surface", weight: 4 },
      { factor: "Easy/comfortable", weight: 1 }
    ],
    
    behavior: {
      conflict: "Diplomatic but intense, transforms",
      stress: "Obsessive about fairness, vengeful if betrayed",
      success: "Deeply satisfied, fiercely loyal",
      failure: "Hurt but seeks transformation"
    },
    
    motto: "I balance with passionate intensity"
  }
];

export default libraThinkingStyles;
