// GEMINI THINKING STYLE - COMPLETE IMPLEMENTATION
// Covers cognition, motivation, behavior, goals, and decision-making

export const geminiThinkingStyles = [
  {
    zoneId: 1,
    name: "Grounded-Communicative Thinking",
    archetype: "The Practical Translator",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 100,
      verbalIntelligence: 70,
      abstractionTolerance: 45,
      metaCognition: 55,
      focus: 65,
      cognitiveFlexibility: 65
    },
    
    motivation: {
      primary: "Understanding through communication",
      drivers: [
        { factor: "Making things clear", weight: 40 },
        { factor: "Practical application", weight: 30 },
        { factor: "Building bridges", weight: 20 },
        { factor: "Teaching", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Moderate (minutes-hours)",
      impulsivity: 45,
      planningTendency: 55,
      immediateActions: 30,
      shortTermActions: 50,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Understand and apply" },
      mediumTerm: { weight: 40, focus: "Master and teach" },
      longTerm: { weight: 15, focus: "Knowledge infrastructure" }
    },
    
    decisionWeights: [
      { factor: "Can I explain it", weight: 35 },
      { factor: "Practical value", weight: 25 },
      { factor: "Logical sense", weight: 20 },
      { factor: "Helps others understand", weight: 10 },
      { factor: "Speed", weight: 7 },
      { factor: "Financial", weight: 3 }
    ],
    
    behavior: {
      conflict: "Discuss thoroughly",
      stress: "Talk faster, seek grounding",
      success: "Explain how it works",
      failure: "Reframe and retry"
    },
    
    motto: "I understand by explaining practically"
  },

  {
    zoneId: 2,
    name: "Pure Information-Flow Thinking",
    archetype: "The Messenger",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 150,
      verbalIntelligence: 95,
      abstractionTolerance: 55,
      metaCognition: 40,
      focus: 35,
      cognitiveFlexibility: 95
    },
    
    motivation: {
      primary: "Information novelty + connection",
      drivers: [
        { factor: "New information", weight: 50 },
        { factor: "Social connection", weight: 25 },
        { factor: "Being first to share", weight: 15 },
        { factor: "Variety", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Instant",
      impulsivity: 90,
      planningTendency: 10,
      immediateActions: 75,
      shortTermActions: 20,
      mediumTermActions: 4,
      longTermActions: 1
    },
    
    goals: {
      shortTerm: { weight: 80, focus: "Next piece of info" },
      mediumTerm: { weight: 18, focus: "Be information hub" },
      longTerm: { weight: 2, focus: "???" }
    },
    
    decisionWeights: [
      { factor: "Is it new/exciting", weight: 45 },
      { factor: "Can share socially", weight: 25 },
      { factor: "Connects to other things", weight: 15 },
      { factor: "Fun/interesting", weight: 10 },
      { factor: "Practical value", weight: 3 },
      { factor: "Long-term impact", weight: 2 }
    ],
    
    behavior: {
      conflict: "Talk way out or leave",
      stress: "Info-dump faster",
      success: "Share immediately, move on",
      failure: "Forget instantly"
    },
    
    motto: "So much to know, tell me everything NOW!"
  },

  {
    zoneId: 3,
    name: "Harmonious-Diplomatic Thinking",
    archetype: "The Mediator",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 120,
      verbalIntelligence: 85,
      abstractionTolerance: 70,
      metaCognition: 65,
      focus: 60,
      cognitiveFlexibility: 80
    },
    
    motivation: {
      primary: "Creating harmony through communication",
      drivers: [
        { factor: "Resolving conflicts", weight: 40 },
        { factor: "Intellectual beauty", weight: 30 },
        { factor: "Win-win solutions", weight: 20 },
        { factor: "Appreciation", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Moderate (hours-days)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 25,
      shortTermActions: 50,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Resolve this conflict" },
      mediumTerm: { weight: 45, focus: "Build harmonious systems" },
      longTerm: { weight: 15, focus: "Lasting peace" }
    },
    
    decisionWeights: [
      { factor: "Creates harmony", weight: 40 },
      { factor: "Objectively fair", weight: 25 },
      { factor: "All parties satisfied", weight: 20 },
      { factor: "Aesthetically elegant", weight: 10 },
      { factor: "Practical", weight: 3 },
      { factor: "Personal gain", weight: 2 }
    ],
    
    behavior: {
      conflict: "Mediate immediately",
      stress: "Indecisive, seek input",
      success: "Share credit equally",
      failure: "Find new balance"
    },
    
    motto: "There are two sides, beauty lies in synthesis"
  },

  {
    zoneId: 4,
    name: "Strategic-Network Thinking",
    archetype: "The Connector",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 130,
      verbalIntelligence: 80,
      abstractionTolerance: 65,
      metaCognition: 70,
      focus: 65,
      cognitiveFlexibility: 75
    },
    
    motivation: {
      primary: "Building valuable networks",
      drivers: [
        { factor: "Network value", weight: 40 },
        { factor: "Being connector", weight: 30 },
        { factor: "Strategic positioning", weight: 20 },
        { factor: "Social capital", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast but strategic (minutes-hours)",
      impulsivity: 50,
      planningTendency: 50,
      immediateActions: 40,
      shortTermActions: 45,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Make strategic connections" },
      mediumTerm: { weight: 40, focus: "Become network hub" },
      longTerm: { weight: 15, focus: "Network infrastructure" }
    },
    
    decisionWeights: [
      { factor: "Network value", weight: 40 },
      { factor: "Strategic positioning", weight: 25 },
      { factor: "Relationship ROI", weight: 20 },
      { factor: "Social capital gain", weight: 10 },
      { factor: "Practical logistics", weight: 3 },
      { factor: "Emotional connection", weight: 2 }
    ],
    
    behavior: {
      conflict: "Use network influence",
      stress: "Network frantically",
      success: "Credit the network",
      failure: "Find new connections"
    },
    
    motto: "It's who you know, and I know everyone"
  },

  {
    zoneId: 5,
    name: "Innovative-Abstract Thinking",
    archetype: "The Visionary",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 140,
      verbalIntelligence: 85,
      abstractionTolerance: 90,
      metaCognition: 80,
      focus: 50,
      cognitiveFlexibility: 95
    },
    
    motivation: {
      primary: "Revolutionary innovation",
      drivers: [
        { factor: "Solving impossible", weight: 40 },
        { factor: "Humanitarian impact", weight: 30 },
        { factor: "Intellectual freedom", weight: 20 },
        { factor: "Future possibilities", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (variable)",
      impulsivity: 70,
      planningTendency: 30,
      immediateActions: 45,
      shortTermActions: 40,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Explore new idea" },
      mediumTerm: { weight: 35, focus: "Develop revolutionary concept" },
      longTerm: { weight: 15, focus: "Change paradigm" }
    },
    
    decisionWeights: [
      { factor: "Humanitarian impact", weight: 40 },
      { factor: "Systemic logic", weight: 30 },
      { factor: "Innovation potential", weight: 20 },
      { factor: "Future importance", weight: 7 },
      { factor: "Practical today", weight: 2 },
      { factor: "Emotional comfort", weight: 1 }
    },
    
    behavior: {
      conflict: "Detach, debate rationally",
      stress: "Abstract theorizing",
      success: "Share vision widely",
      failure: "Data for next experiment"
    },
    
    motto: "The future is imagined and built"
  },

  {
    zoneId: 6,
    name: "Emotionally-Intelligent Thinking",
    archetype: "The Empathic Communicator",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 95,
      verbalIntelligence: 85,
      abstractionTolerance: 60,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 70
    },
    
    motivation: {
      primary: "Emotional understanding + nurturing",
      drivers: [
        { factor: "Deep emotional connection", weight: 45 },
        { factor: "Helping others feel heard", weight: 30 },
        { factor: "Nurturing growth", weight: 15 },
        { factor: "Preserving memories", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Moderate (processes emotions first)",
      impulsivity: 40,
      planningTendency: 60,
      immediateActions: 30,
      shortTermActions: 45,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Create emotional understanding" },
      mediumTerm: { weight: 40, focus: "Build rich relationships" },
      longTerm: { weight: 15, focus: "Emotional legacy" }
    },
    
    decisionWeights: [
      { factor: "How does it FEEL", weight: 50 },
      { factor: "Is it emotionally right", weight: 25 },
      { factor: "Protects emotional safety", weight: 15 },
      { factor: "Creates connection", weight: 7 },
      { factor: "Logical sense", weight: 2 },
      { factor: "Financial", weight: 1 }
    ],
    
    behavior: {
      conflict: "Hurt but seeks resolution",
      stress: "Emotionally reactive",
      success: "Nurture others with it",
      failure: "Process deeply, forgive"
    },
    
    motto: "I understand what you feel, not just what you say"
  }
];
