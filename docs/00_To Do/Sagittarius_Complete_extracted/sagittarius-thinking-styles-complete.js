// SAGITTARIUS THINKING STYLES - COMPLETE IMPLEMENTATION
// Fire Sign: Adventurous, philosophical, optimistic, freedom-loving

export const sagittariusThinkingStyles = [
  {
    zoneId: 1,
    name: "Deep-Expansive Thinking",
    archetype: "The Philosophical Warrior",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 85,
      verbalIntelligence: 85,
      abstractionTolerance: 90,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 80
    },
    
    motivation: {
      primary: "Seeking transformative truth through adventure",
      drivers: [
        { factor: "Discovering deep philosophical truth", weight: 40 },
        { factor: "Transforming through exploration", weight: 30 },
        { factor: "Teaching profound wisdom", weight: 20 },
        { factor: "Adventurous freedom", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (intuitive philosophical leaps)",
      impulsivity: 70,
      planningTendency: 30,
      immediateActions: 55,
      shortTermActions: 35,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 60, focus: "Explore profound truth today" },
      mediumTerm: { weight: 30, focus: "Transform understanding" },
      longTerm: { weight: 10, focus: "Achieve philosophical mastery" }
    },
    
    decisionWeights: [
      { factor: "Reveals deep truth", weight: 40 },
      { factor: "Transforms understanding", weight: 25 },
      { factor: "Adventurous/free", weight: 20 },
      { factor: "Philosophically meaningful", weight: 10 },
      { factor: "Practical concerns", weight: 4 },
      { factor: "Safe/comfortable", weight: 1 }
    ],
    
    behavior: {
      conflict: "Debates intensely, seeks truth",
      stress: "Escapes to philosophical adventure",
      success: "Shares wisdom, seeks next depth",
      failure: "Philosophical reframe, explores further"
    },
    
    motto: "I seek truth through fearless exploration"
  },

  {
    zoneId: 2,
    name: "Pure Adventurous-Philosophical Thinking",
    archetype: "The Eternal Explorer",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 100,       // MAXIMUM (Fire + Mutable)
      verbalIntelligence: 90,
      abstractionTolerance: 100,  // MAXIMUM (big picture only)
      metaCognition: 60,
      focus: 50,                  // Low (scattered by possibilities)
      cognitiveFlexibility: 100   // MAXIMUM (adapts instantly)
    },
    
    motivation: {
      primary: "Infinite exploration and philosophical freedom",
      drivers: [
        { factor: "Exploring new horizons", weight: 45 },
        { factor: "Understanding ultimate truth", weight: 30 },
        { factor: "Teaching/sharing wisdom", weight: 15 },
        { factor: "Experiencing freedom", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very fast (leaps before looking)",
      impulsivity: 90,
      planningTendency: 10,
      immediateActions: 70,
      shortTermActions: 25,
      mediumTermActions: 4,
      longTermActions: 1
    },
    
    goals: {
      shortTerm: { weight: 75, focus: "Explore something new TODAY" },
      mediumTerm: { weight: 20, focus: "Understand bigger truth" },
      longTerm: { weight: 5, focus: "Ultimate wisdom (vague)" }
    },
    
    decisionWeights: [
      { factor: "Is it NEW/EXCITING", weight: 45 },
      { factor: "Expands understanding", weight: 25 },
      { factor: "Gives FREEDOM", weight: 20 },
      { factor: "Philosophical meaning", weight: 7 },
      { factor: "Practical logistics", weight: 2 },
      { factor: "Commitment required", weight: 1 }
    ],
    
    behavior: {
      conflict: "Laughs it off, finds meaning, moves on",
      stress: "Books plane ticket, disappears",
      success: "Celebrates briefly, seeks next adventure",
      failure: "Optimistic reframe, tries something else"
    },
    
    motto: "I explore infinitely, I am free"
  },

  {
    zoneId: 3,
    name: "Pioneering-Visionary Thinking",
    archetype: "The Courageous Prophet",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 100,       // MAXIMUM
      verbalIntelligence: 85,
      abstractionTolerance: 90,
      metaCognition: 65,
      focus: 75,                  // Higher (Aries focus)
      cognitiveFlexibility: 85
    },
    
    motivation: {
      primary: "Pioneering new philosophical frontiers",
      drivers: [
        { factor: "Being FIRST to discover", weight: 40 },
        { factor: "Conquering new territories", weight: 30 },
        { factor: "Visionary leadership", weight: 20 },
        { factor: "Winning at exploration", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Instant (acts on vision NOW)",
      impulsivity: 95,
      planningTendency: 5,
      immediateActions: 75,
      shortTermActions: 22,
      mediumTermActions: 3,
      longTermActions: 0
    },
    
    goals: {
      shortTerm: { weight: 80, focus: "Pioneer something NEW" },
      mediumTerm: { weight: 18, focus: "Lead visionary movement" },
      longTerm: { weight: 2, focus: "Be remembered as first" }
    },
    
    decisionWeights: [
      { factor: "Am I FIRST", weight: 45 },
      { factor: "Is it visionary/bold", weight: 30 },
      { factor: "Do I WIN", weight: 15 },
      { factor: "Philosophical meaning", weight: 7 },
      { factor: "Practical feasibility", weight: 2 },
      { factor: "Risk level", weight: 1 }
    ],
    
    behavior: {
      conflict: "Fights directly for vision",
      stress: "Charges into new adventure",
      success: "Victory lap, finds next frontier",
      failure: "Instant pivot to new territory"
    },
    
    motto: "I pioneer boldly, I conquer new worlds"
  },

  {
    zoneId: 4,
    name: "Revolutionary-Teaching Thinking",
    archetype: "The Freedom Fighter",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 95,
      verbalIntelligence: 90,
      abstractionTolerance: 95,
      metaCognition: 70,
      focus: 80,
      cognitiveFlexibility: 80
    },
    
    motivation: {
      primary: "Revolutionary philosophical transformation",
      drivers: [
        { factor: "Freeing others through truth", weight: 45 },
        { factor: "Revolutionary teaching", weight: 30 },
        { factor: "Fighting for philosophy", weight: 15 },
        { factor: "Cultural transformation", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very fast (mission-driven)",
      impulsivity: 85,
      planningTendency: 15,
      immediateActions: 70,
      shortTermActions: 25,
      mediumTermActions: 4,
      longTermActions: 1
    },
    
    goals: {
      shortTerm: { weight: 70, focus: "Spread revolutionary truth" },
      mediumTerm: { weight: 25, focus: "Transform cultural thinking" },
      longTerm: { weight: 5, focus: "Philosophical revolution legacy" }
    },
    
    decisionWeights: [
      { factor: "Liberates/frees others", weight: 50 },
      { factor: "Revolutionary impact", weight: 25 },
      { factor: "Teaches truth", weight: 15 },
      { factor: "Adventurous/bold", weight: 7 },
      { factor: "Practical concerns", weight: 2 },
      { factor: "Personal safety", weight: 1 }
    },
    
    behavior: {
      conflict: "Fights passionately for freedom",
      stress: "Intensifies revolutionary mission",
      success: "Inspires masses, continues fight",
      failure: "Martyrdom narrative, fights harder"
    },
    
    motto: "I fight for freedom, I teach revolution"
  },

  {
    zoneId: 5,
    name: "Optimistic-Creative Thinking",
    archetype: "The Joyful Sage",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 95,
      verbalIntelligence: 90,
      abstractionTolerance: 85,
      metaCognition: 65,
      focus: 65,
      cognitiveFlexibility: 90
    },
    
    motivation: {
      primary: "Joyful creative philosophical expression",
      drivers: [
        { factor: "Inspiring through joy", weight: 40 },
        { factor: "Creative wisdom sharing", weight: 30 },
        { factor: "Being admired teacher", weight: 20 },
        { factor: "Adventurous fun", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (enthusiastic leaps)",
      impulsivity: 80,
      planningTendency: 20,
      immediateActions: 65,
      shortTermActions: 30,
      mediumTermActions: 4,
      longTermActions: 1
    },
    
    goals: {
      shortTerm: { weight: 70, focus: "Create joyful inspiration" },
      mediumTerm: { weight: 25, focus: "Build creative legacy" },
      longTerm: { weight: 5, focus: "Be beloved sage" }
    },
    
    decisionWeights: [
      { factor: "Is it JOYFUL/FUN", weight: 40 },
      { factor: "Inspires/uplifts others", weight: 30 },
      { factor: "Gets me admiration", weight: 15 },
      { factor: "Creative expression", weight: 10 },
      { factor: "Practical concerns", weight: 4 },
      { factor: "Boring/routine", weight: 1 }
    },
    
    behavior: {
      conflict: "Laughs it off, reframes positively",
      stress: "Throws party, finds adventure",
      success: "Generous celebration, shares joy",
      failure: "Dramatic story, finds silver lining"
    },
    
    motto: "I inspire joy, I share wisdom generously"
  },

  {
    zoneId: 6,
    name: "Strategic-Philosophical Thinking",
    archetype: "The Ambitious Visionary",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 85,
      verbalIntelligence: 85,
      abstractionTolerance: 85,
      metaCognition: 75,
      focus: 80,
      cognitiveFlexibility: 70
    },
    
    motivation: {
      primary: "Strategic achievement of philosophical vision",
      drivers: [
        { factor: "Building visionary empire", weight: 40 },
        { factor: "Strategic truth-seeking", weight: 30 },
        { factor: "Responsible exploration", weight: 20 },
        { factor: "Disciplined freedom", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-fast (plans then acts)",
      impulsivity: 60,
      planningTendency: 40,
      immediateActions: 45,
      shortTermActions: 40,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Execute strategic vision step" },
      mediumTerm: { weight: 40, focus: "Build philosophical empire" },
      longTerm: { weight: 10, focus: "Leave structured legacy" }
    },
    
    decisionWeights: [
      { factor: "Builds toward vision", weight: 40 },
      { factor: "Strategically sound", weight: 30 },
      { factor: "Philosophically meaningful", weight: 15 },
      { factor: "Responsible/practical", weight: 10 },
      { factor: "Immediate gratification", weight: 4 },
      { factor: "Pure fun/freedom", weight: 1 }
    },
    
    behavior: {
      conflict: "Strategic philosophical debate",
      stress: "Workaholic exploration planning",
      success: "Builds next level, continues climb",
      failure: "Strategic analysis, disciplined retry"
    },
    
    motto: "I build empires through visionary wisdom"
  }
];

export default sagittariusThinkingStyles;
