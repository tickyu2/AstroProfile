// VIRGO THINKING STYLES - COMPLETE IMPLEMENTATION
// Earth Sign: Analytical, practical, service-oriented, perfectionist

export const virgoThinkingStyles = [
  {
    zoneId: 1,
    name: "Confident-Analytical Thinking",
    archetype: "The Proud Perfectionist",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 85,
      verbalIntelligence: 85,
      abstractionTolerance: 55,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 60
    },
    
    motivation: {
      primary: "Recognition for perfect craft",
      drivers: [
        { factor: "Creating flawless work", weight: 40 },
        { factor: "Being respected for skill", weight: 30 },
        { factor: "Serving with excellence", weight: 20 },
        { factor: "Expressing through mastery", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (analyzes but with confidence)",
      impulsivity: 40,
      planningTendency: 60,
      immediateActions: 30,
      shortTermActions: 50,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Perfect today's work" },
      mediumTerm: { weight: 40, focus: "Master the craft" },
      longTerm: { weight: 10, focus: "Be respected for excellence" }
    },
    
    decisionWeights: [
      { factor: "Can I do it PERFECTLY", weight: 40 },
      { factor: "Will it showcase skill", weight: 25 },
      { factor: "Serves others well", weight: 15 },
      { factor: "Gets appreciation", weight: 12 },
      { factor: "Practical execution", weight: 6 },
      { factor: "Quick/easy", weight: 2 }
    ],
    
    behavior: {
      conflict: "Critiques flaws confidently",
      stress: "Anxious perfectionism, overworks",
      success: "Proud but notices imperfections",
      failure: "Self-critical, tries harder"
    },
    
    motto: "I perfect my craft with pride"
  },

  {
    zoneId: 2,
    name: "Pure Analytical-Systematic Thinking",
    archetype: "The Master Optimizer",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 95,        // Fast mental analysis
      verbalIntelligence: 90,
      abstractionTolerance: 60,
      metaCognition: 95,          // Extreme self-awareness
      focus: 100,                 // MAXIMUM concentration
      cognitiveFlexibility: 50    // Low (rigid standards)
    },
    
    motivation: {
      primary: "Perfect systems and helpful service",
      drivers: [
        { factor: "Eliminating all inefficiency", weight: 40 },
        { factor: "Solving complex problems", weight: 30 },
        { factor: "Helping others improve", weight: 20 },
        { factor: "Achieving mastery", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-fast (rapid analysis, then action)",
      impulsivity: 25,
      planningTendency: 75,
      immediateActions: 20,
      shortTermActions: 45,
      mediumTermActions: 25,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Optimize today's systems" },
      mediumTerm: { weight: 40, focus: "Build perfect infrastructure" },
      longTerm: { weight: 15, focus: "Leave legacy of excellence" }
    },
    
    decisionWeights: [
      { factor: "Is it PERFECT/optimal", weight: 45 },
      { factor: "Solves problem efficiently", weight: 25 },
      { factor: "Helps others", weight: 15 },
      { factor: "Meets high standards", weight: 10 },
      { factor: "Practical implementation", weight: 4 },
      { factor: "Emotional comfort", weight: 1 }
    ],
    
    behavior: {
      conflict: "Analyzes flaws systematically",
      stress: "Paralyzed by perfectionism",
      success: "Immediately finds next improvement",
      failure: "Deep analysis, relentless retry"
    },
    
    motto: "I analyze, I optimize, I perfect"
  },

  {
    zoneId: 3,
    name: "Disciplined-Service Thinking",
    archetype: "The Responsible Helper",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 85,
      abstractionTolerance: 65,
      metaCognition: 85,
      focus: 95,
      cognitiveFlexibility: 55
    },
    
    motivation: {
      primary: "Disciplined service and long-term mastery",
      drivers: [
        { factor: "Fulfilling responsibility", weight: 40 },
        { factor: "Building lasting systems", weight: 30 },
        { factor: "Achieving mastery through discipline", weight: 20 },
        { factor: "Serving with excellence", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-slow (thorough deliberation)",
      impulsivity: 30,
      planningTendency: 70,
      immediateActions: 25,
      shortTermActions: 40,
      mediumTermActions: 25,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Complete responsibilities perfectly" },
      mediumTerm: { weight: 45, focus: "Build structured mastery" },
      longTerm: { weight: 15, focus: "Create lasting infrastructure" }
    },
    
    decisionWeights: [
      { factor: "Fulfills duty/responsibility", weight: 40 },
      { factor: "Builds toward mastery", weight: 25 },
      { factor: "Creates lasting value", weight: 20 },
      { factor: "Meets standards", weight: 10 },
      { factor: "Practical feasibility", weight: 4 },
      { factor: "Fun/enjoyment", weight: 1 }
    ],
    
    behavior: {
      conflict: "Responsible analysis of duties",
      stress: "Burden of perfectionist responsibility",
      success: "Quiet satisfaction, next goal",
      failure: "Disciplined analysis, systematic retry"
    },
    
    motto: "I serve with disciplined excellence"
  },

  {
    zoneId: 4,
    name: "Systematic-Mastery Thinking",
    archetype: "The Efficiency Master",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 90,
      verbalIntelligence: 85,
      abstractionTolerance: 70,
      metaCognition: 90,
      focus: 100,                 // MAXIMUM
      cognitiveFlexibility: 50
    },
    
    motivation: {
      primary: "Achieving peak efficiency and mastery",
      drivers: [
        { factor: "Optimizing all systems", weight: 45 },
        { factor: "Achieving mastery", weight: 30 },
        { factor: "Building perfect infrastructure", weight: 15 },
        { factor: "Eliminating waste", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (rapid analysis, deliberate execution)",
      impulsivity: 25,
      planningTendency: 75,
      immediateActions: 20,
      shortTermActions: 35,
      mediumTermActions: 30,
      longTermActions: 15
    },
    
    goals: {
      shortTerm: { weight: 35, focus: "Optimize current systems" },
      mediumTerm: { weight: 45, focus: "Achieve systematic mastery" },
      longTerm: { weight: 20, focus: "Build optimal infrastructure" }
    },
    
    decisionWeights: [
      { factor: "Maximum efficiency achieved", weight: 45 },
      { factor: "Leads to mastery", weight: 25 },
      { factor: "Builds lasting systems", weight: 15 },
      { factor: "Meets perfection standards", weight: 10 },
      { factor: "Practical resources", weight: 4 },
      { factor: "Emotional satisfaction", weight: 1 }
    },
    
    behavior: {
      conflict: "Systematic problem decomposition",
      stress: "Extreme perfectionist paralysis",
      success: "Analyzes for further optimization",
      failure: "Methodical system redesign"
    },
    
    motto: "I systematize perfection into mastery"
  },

  {
    zoneId: 5,
    name: "Patient-Practical Thinking",
    archetype: "The Devoted Craftsperson",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 75,
      verbalIntelligence: 80,
      abstractionTolerance: 50,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 55
    },
    
    motivation: {
      primary: "Patient mastery through sensory perfection",
      drivers: [
        { factor: "Perfecting sensory details", weight: 40 },
        { factor: "Loyal devoted service", weight: 30 },
        { factor: "Creating lasting quality", weight: 20 },
        { factor: "Practical helpfulness", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow (thorough sensory analysis)",
      impulsivity: 25,
      planningTendency: 75,
      immediateActions: 20,
      shortTermActions: 40,
      mediumTermActions: 30,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Perfect today's sensory details" },
      mediumTerm: { weight: 45, focus: "Master craft through patience" },
      longTerm: { weight: 15, focus: "Create enduring quality" }
    },
    
    decisionWeights: [
      { factor: "Sensory/physical perfection", weight: 40 },
      { factor: "Loyal service to others", weight: 25 },
      { factor: "Creates lasting value", weight: 20 },
      { factor: "Practical execution", weight: 10 },
      { factor: "Efficiency", weight: 4 },
      { factor: "Change/novelty", weight: 1 }
    ],
    
    behavior: {
      conflict: "Stubborn defense of methods",
      stress: "Perfectionist paralysis, physical tension",
      success: "Quiet satisfaction, continues work",
      failure: "Patient persistent retry"
    },
    
    motto: "I perfect through patient devotion"
  },

  {
    zoneId: 6,
    name: "Diplomatic-Analytical Thinking",
    archetype: "The Graceful Helper",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 85,
      verbalIntelligence: 90,
      abstractionTolerance: 65,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 70
    },
    
    motivation: {
      primary: "Harmonious service through balanced analysis",
      drivers: [
        { factor: "Helping others diplomatically", weight: 35 },
        { factor: "Creating harmonious systems", weight: 30 },
        { factor: "Balanced perfectionism", weight: 20 },
        { factor: "Social contribution", weight: 15 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (weighs all perspectives)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 30,
      shortTermActions: 45,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Help harmoniously today" },
      mediumTerm: { weight: 40, focus: "Build balanced relationships/systems" },
      longTerm: { weight: 10, focus: "Be remembered as graceful helper" }
    },
    
    decisionWeights: [
      { factor: "Creates harmony", weight: 35 },
      { factor: "Helps others tactfully", weight: 30 },
      { factor: "Meets quality standards", weight: 20 },
      { factor: "Aesthetically pleasing", weight: 10 },
      { factor: "Practical execution", weight: 4 },
      { factor: "Conflict/disharmony", weight: 1 }
    ],
    
    behavior: {
      conflict: "Diplomatic analysis, seeks balance",
      stress: "Analysis paralysis from weighing options",
      success: "Gracious sharing, continues service",
      failure: "Tactful analysis, collaborative retry"
    },
    
    motto: "I serve with grace and balanced analysis"
  }
];

export default virgoThinkingStyles;
