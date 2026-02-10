// CAPRICORN THINKING STYLES - COMPLETE IMPLEMENTATION
// Earth Sign: Strategic, ambitious, disciplined, masterful

export const capricornThinkingStyles = [
  {
    zoneId: 1,
    name: "Strategic-Visionary Thinking",
    archetype: "The Philosophical Executive",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 85,
      abstractionTolerance: 75,
      metaCognition: 85,
      focus: 90,
      cognitiveFlexibility: 70
    },
    
    motivation: {
      primary: "Building visionary empires through strategy",
      drivers: [
        { factor: "Achieving strategic vision", weight: 40 },
        { factor: "Building lasting legacy", weight: 30 },
        { factor: "Philosophical meaning in success", weight: 20 },
        { factor: "Climbing to summit", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (strategic vision + planning)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 25,
      shortTermActions: 40,
      mediumTermActions: 25,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Execute strategic step" },
      mediumTerm: { weight: 45, focus: "Build philosophical empire" },
      longTerm: { weight: 15, focus: "Leave visionary legacy" }
    },
    
    decisionWeights: [
      { factor: "Advances strategic vision", weight: 40 },
      { factor: "Builds lasting structure", weight: 25 },
      { factor: "Philosophically meaningful", weight: 20 },
      { factor: "Increases status/power", weight: 10 },
      { factor: "Immediate pleasure", weight: 4 },
      { factor: "Risk of failure", weight: 1 }
    ],
    
    behavior: {
      conflict: "Strategic positioning, philosophical framing",
      stress: "Works harder on vision",
      success: "Plans next summit, continues climb",
      failure: "Strategic analysis, disciplined retry"
    },
    
    motto: "I build empires through visionary strategy"
  },

  {
    zoneId: 2,
    name: "Pure Strategic-Disciplined Thinking",
    archetype: "The Master Builder",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 75,        // Slow (methodical)
      verbalIntelligence: 80,
      abstractionTolerance: 70,
      metaCognition: 90,
      focus: 100,                 // MAXIMUM concentration
      cognitiveFlexibility: 50    // Low (rigid structure)
    },
    
    motivation: {
      primary: "Ultimate mastery and achievement",
      drivers: [
        { factor: "Reaching summit/peak", weight: 45 },
        { factor: "Achieving mastery", weight: 30 },
        { factor: "Building lasting empire", weight: 15 },
        { factor: "Gaining respect through competence", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (methodical calculation)",
      impulsivity: 15,
      planningTendency: 85,
      immediateActions: 15,
      shortTermActions: 30,
      mediumTermActions: 35,
      longTermActions: 20
    },
    
    goals: {
      shortTerm: { weight: 30, focus: "Execute daily discipline" },
      mediumTerm: { weight: 50, focus: "Build systematic mastery" },
      longTerm: { weight: 20, focus: "Reach ultimate summit" }
    },
    
    decisionWeights: [
      { factor: "Builds toward mastery", weight: 50 },
      { factor: "Strategic advantage", weight: 25 },
      { factor: "Increases power/status", weight: 15 },
      { factor: "Responsible/dutiful", weight: 7 },
      { factor: "Enjoyment/pleasure", weight: 2 },
      { factor: "Others' feelings", weight: 1 }
    },
    
    behavior: {
      conflict: "Cold strategic calculation",
      stress: "Intensifies work discipline",
      success: "Immediate focus on next goal",
      failure: "Methodical analysis, relentless retry"
    },
    
    motto: "I climb methodically to absolute mastery"
  },

  {
    zoneId: 3,
    name: "Patient-Material Thinking",
    archetype: "The Wealth Builder",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 70,
      verbalIntelligence: 75,
      abstractionTolerance: 60,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 55
    },
    
    motivation: {
      primary: "Building material wealth and security",
      drivers: [
        { factor: "Accumulating resources/wealth", weight: 45 },
        { factor: "Creating material security", weight: 30 },
        { factor: "Enjoying quality/beauty", weight: 15 },
        { factor: "Leaving inheritance", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (patient accumulation)",
      impulsivity: 20,
      planningTendency: 80,
      immediateActions: 15,
      shortTermActions: 35,
      mediumTermActions: 35,
      longTermActions: 15
    },
    
    goals: {
      shortTerm: { weight: 35, focus: "Build wealth steadily" },
      mediumTerm: { weight: 50, focus: "Accumulate material empire" },
      longTerm: { weight: 15, focus: "Generational wealth legacy" }
    },
    
    decisionWeights: [
      { factor: "Increases wealth/resources", weight: 50 },
      { factor: "Material security", weight: 25 },
      { factor: "Quality/aesthetic value", weight: 15 },
      { factor: "Strategic positioning", weight: 7 },
      { factor: "Risk to resources", weight: 2 },
      { factor: "Impulsive pleasure", weight: 1 }
    ],
    
    behavior: {
      conflict: "Protects resources strategically",
      stress: "Hoards and controls tighter",
      success: "Enjoys briefly, continues accumulating",
      failure: "Patient retry, never gives up"
    },
    
    motto: "I build wealth through patient mastery"
  },

  {
    zoneId: 4,
    name: "Empire-Building Thinking",
    archetype: "The Dynasty Founder",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 70,
      verbalIntelligence: 80,
      abstractionTolerance: 65,
      metaCognition: 85,
      focus: 100,                 // MAXIMUM
      cognitiveFlexibility: 50
    },
    
    motivation: {
      primary: "Building generational empires",
      drivers: [
        { factor: "Creating dynasty/legacy", weight: 50 },
        { factor: "Controlling resources/power", weight: 30 },
        { factor: "Material dominance", weight: 15 },
        { factor: "Eternal achievement", weight: 5 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow (empire-building timeframe)",
      impulsivity: 15,
      planningTendency: 85,
      immediateActions: 10,
      shortTermActions: 25,
      mediumTermActions: 40,
      longTermActions: 25
    },
    
    goals: {
      shortTerm: { weight: 25, focus: "Execute empire plan" },
      mediumTerm: { weight: 50, focus: "Build dynasty infrastructure" },
      longTerm: { weight: 25, focus: "Eternal legacy of power" }
    },
    
    decisionWeights: [
      { factor: "Builds dynasty/empire", weight: 55 },
      { factor: "Increases power/control", weight: 25 },
      { factor: "Material dominance", weight: 12 },
      { factor: "Strategic mastery", weight: 6 },
      { factor: "Immediate comfort", weight: 1 },
      { factor: "Others' needs", weight: 1 }
    },
    
    behavior: {
      conflict: "Ruthless strategic domination",
      stress: "Works harder on empire",
      success: "Expands empire, never satisfied",
      failure: "Methodical empire rebuilding"
    },
    
    motto: "I build empires that outlast time"
  },

  {
    zoneId: 5,
    name: "Perfectionist-Strategic Thinking",
    archetype: "The Flawless Executive",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 75,
      verbalIntelligence: 90,
      abstractionTolerance: 65,
      metaCognition: 95,
      focus: 100,                 // MAXIMUM
      cognitiveFlexibility: 55
    },
    
    motivation: {
      primary: "Perfect strategic execution",
      drivers: [
        { factor: "Flawless systematic achievement", weight: 45 },
        { factor: "Strategic mastery", weight: 30 },
        { factor: "Analytical perfection", weight: 15 },
        { factor: "Respected competence", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow (analyzes for perfection)",
      impulsivity: 20,
      planningTendency: 80,
      immediateActions: 20,
      shortTermActions: 35,
      mediumTermActions: 30,
      longTermActions: 15
    },
    
    goals: {
      shortTerm: { weight: 35, focus: "Execute perfectly today" },
      mediumTerm: { weight: 50, focus: "Build flawless systems" },
      longTerm: { weight: 15, focus: "Master perfection" }
    },
    
    decisionWeights: [
      { factor: "Can be done PERFECTLY", weight: 50 },
      { factor: "Strategic advantage", weight: 25 },
      { factor: "Analytical soundness", weight: 15 },
      { factor: "Meets standards", weight: 7 },
      { factor: "Practical execution", weight: 2 },
      { factor: "Emotional comfort", weight: 1 }
    },
    
    behavior: {
      conflict: "Criticizes flaws systematically",
      stress: "Perfectionist paralysis",
      success: "Notices imperfections, continues",
      failure: "Analytical dissection, perfect retry"
    },
    
    motto: "I achieve through flawless discipline"
  },

  {
    zoneId: 6,
    name: "Innovative-Strategic Thinking",
    archetype: "The Revolutionary Builder",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 85,
      abstractionTolerance: 80,
      metaCognition: 85,
      focus: 90,
      cognitiveFlexibility: 75
    },
    
    motivation: {
      primary: "Innovating systems and structures",
      drivers: [
        { factor: "Revolutionary infrastructure", weight: 40 },
        { factor: "Strategic innovation", weight: 30 },
        { factor: "Reforming systems", weight: 20 },
        { factor: "Building future", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (strategic innovation)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 30,
      shortTermActions: 40,
      mediumTermActions: 22,
      longTermActions: 8
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Implement innovation" },
      mediumTerm: { weight: 45, focus: "Reform systems strategically" },
      longTerm: { weight: 15, focus: "Revolutionary legacy" }
    },
    
    decisionWeights: [
      { factor: "Innovates systems", weight: 45 },
      { factor: "Strategic advancement", weight: 25 },
      { factor: "Revolutionary impact", weight: 20 },
      { factor: "Practical feasibility", weight: 7 },
      { factor: "Traditional approval", weight: 2 },
      { factor: "Emotional warmth", weight: 1 }
    },
    
    behavior: {
      conflict: "Cold revolutionary logic",
      stress: "Works on systematic innovation",
      success: "Plans next revolution",
      failure: "Strategic innovation pivot"
    },
    
    motto: "I revolutionize through strategic discipline"
  }
];

export default capricornThinkingStyles;
