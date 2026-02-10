// SCORPIO THINKING STYLES - COMPLETE IMPLEMENTATION
// Water Sign: Intense, transformative, psychological, obsessive

export const scorpioThinkingStyles = [
  {
    zoneId: 1,
    name: "Strategic-Intense Thinking",
    archetype: "The Magnetic Strategist",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 75,
      verbalIntelligence: 80,
      abstractionTolerance: 70,
      metaCognition: 85,
      focus: 90,
      cognitiveFlexibility: 65
    },
    
    motivation: {
      primary: "Power through strategic transformation",
      drivers: [
        { factor: "Gaining psychological power", weight: 40 },
        { factor: "Transforming relationships", weight: 30 },
        { factor: "Maintaining control", weight: 20 },
        { factor: "Creating harmony (superficial)", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-slow (strategic calculation)",
      impulsivity: 40,
      planningTendency: 60,
      immediateActions: 30,
      shortTermActions: 45,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Gain strategic advantage" },
      mediumTerm: { weight: 45, focus: "Transform power dynamics" },
      longTerm: { weight: 10, focus: "Maintain lasting control" }
    },
    
    decisionWeights: [
      { factor: "Gives me power/control", weight: 40 },
      { factor: "Transforms dynamics", weight: 25 },
      { factor: "Appears harmonious", weight: 15 },
      { factor: "Psychologically deep", weight: 12 },
      { factor: "Practical execution", weight: 6 },
      { factor: "Others' comfort", weight: 2 }
    ],
    
    behavior: {
      conflict: "Strategic manipulation, passive-aggressive",
      stress: "Intensifies control, becomes obsessive",
      success: "Quietly powerful, plans next move",
      failure: "Vengeful transformation strategy"
    },
    
    motto: "I transform through strategic power"
  },

  {
    zoneId: 2,
    name: "Pure Obsessive-Transformative Thinking",
    archetype: "The Phoenix",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 70,        // Slow (intense depth)
      verbalIntelligence: 75,
      abstractionTolerance: 75,
      metaCognition: 95,          // Extreme self-awareness
      focus: 100,                 // MAXIMUM obsessive focus
      cognitiveFlexibility: 40    // Low (obsessive rigidity)
    },
    
    motivation: {
      primary: "Total transformation through intensity",
      drivers: [
        { factor: "Psychological dominance", weight: 45 },
        { factor: "Death-rebirth transformation", weight: 30 },
        { factor: "Uncovering all secrets", weight: 15 },
        { factor: "Absolute loyalty/betrayal", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (obsessive analysis)",
      impulsivity: 25,
      planningTendency: 75,
      immediateActions: 20,
      shortTermActions: 35,
      mediumTermActions: 30,
      longTermActions: 15
    },
    
    goals: {
      shortTerm: { weight: 35, focus: "Gain complete understanding" },
      mediumTerm: { weight: 50, focus: "Total transformation" },
      longTerm: { weight: 15, focus: "Eternal loyalty or revenge" }
    },
    
    decisionWeights: [
      { factor: "Gives total power/control", weight: 50 },
      { factor: "Leads to transformation", weight: 25 },
      { factor: "Reveals hidden truth", weight: 15 },
      { factor: "Tests loyalty", weight: 7 },
      { factor: "Practical concerns", weight: 2 },
      { factor: "Surface harmony", weight: 1 }
    ],
    
    behavior: {
      conflict: "All-or-nothing warfare, destroys",
      stress: "Obsessive paranoia, total control",
      success: "Rises stronger, plans domination",
      failure: "Dies and regenerates transformed"
    },
    
    motto: "I destroy, I transform, I rise"
  },

  {
    zoneId: 3,
    name: "Mystical-Healing Thinking",
    archetype: "The Wounded Healer",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 65,
      verbalIntelligence: 75,
      abstractionTolerance: 85,
      metaCognition: 90,
      focus: 90,
      cognitiveFlexibility: 70
    },
    
    motivation: {
      primary: "Spiritual transformation and healing",
      drivers: [
        { factor: "Healing deep wounds", weight: 40 },
        { factor: "Spiritual transformation", weight: 30 },
        { factor: "Compassionate depth", weight: 20 },
        { factor: "Mystical understanding", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow (spiritual timing)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 25,
      shortTermActions: 40,
      mediumTermActions: 25,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Heal current wounds" },
      mediumTerm: { weight: 45, focus: "Transform pain to wisdom" },
      longTerm: { weight: 15, focus: "Spiritual redemption" }
    },
    
    decisionWeights: [
      { factor: "Heals/transforms wounds", weight: 45 },
      { factor: "Spiritually aligned", weight: 25 },
      { factor: "Compassionate depth", weight: 20 },
      { factor: "Reveals truth", weight: 7 },
      { factor: "Practical logistics", weight: 2 },
      { factor: "Ego gratification", weight: 1 }
    },
    
    behavior: {
      conflict: "Transforms through compassion",
      stress: "Escapes to spiritual depths",
      success: "Humbly heals others",
      failure: "Martyrdom, spiritual transcendence"
    },
    
    motto: "I heal through transformative love"
  },

  {
    zoneId: 4,
    name: "Redemptive-Regenerative Thinking",
    archetype: "The Eternal Phoenix",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 60,
      verbalIntelligence: 70,
      abstractionTolerance: 90,
      metaCognition: 85,
      focus: 95,
      cognitiveFlexibility: 75
    },
    
    motivation: {
      primary: "Infinite regeneration and redemption",
      drivers: [
        { factor: "Rising from death", weight: 40 },
        { factor: "Redeeming darkness", weight: 30 },
        { factor: "Spiritual transcendence", weight: 20 },
        { factor: "Compassionate transformation", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (cosmic timing)",
      impulsivity: 30,
      planningTendency: 70,
      immediateActions: 20,
      shortTermActions: 30,
      mediumTermActions: 35,
      longTermActions: 15
    },
    
    goals: {
      shortTerm: { weight: 30, focus: "Accept current death" },
      mediumTerm: { weight: 50, focus: "Complete transformation" },
      longTerm: { weight: 20, focus: "Eternal regeneration cycle" }
    },
    
    decisionWeights: [
      { factor: "Enables rebirth", weight: 45 },
      { factor: "Redeems darkness", weight: 25 },
      { factor: "Spiritually transcendent", weight: 20 },
      { factor: "Compassionate", weight: 7 },
      { factor: "Practical world", weight: 2 },
      { factor: "Personal safety", weight: 1 }
    },
    
    behavior: {
      conflict: "Accepts death, transforms",
      stress: "Surrenders to destruction",
      success: "Rises anew, shares wisdom",
      failure: "Dies completely, rebirths transformed"
    },
    
    motto: "I die infinitely, I rise eternally"
  },

  {
    zoneId: 5,
    name: "Protective-Warrior Thinking",
    archetype: "The Fierce Guardian",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 70,
      verbalIntelligence: 70,
      abstractionTolerance: 60,
      metaCognition: 85,
      focus: 100,                 // MAXIMUM when protecting
      cognitiveFlexibility: 50
    },
    
    motivation: {
      primary: "Protecting loved ones at all costs",
      drivers: [
        { factor: "Defending family/tribe", weight: 50 },
        { factor: "Eliminating threats", weight: 30 },
        { factor: "Nurturing through power", weight: 15 },
        { factor: "Building fortress", weight: 5 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast when protecting, slow otherwise",
      impulsivity: 45,
      planningTendency: 55,
      immediateActions: 35,
      shortTermActions: 45,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 55, focus: "Eliminate current threats" },
      mediumTerm: { weight: 35, focus: "Build impenetrable safety" },
      longTerm: { weight: 10, focus: "Protect future generations" }
    },
    
    decisionWeights: [
      { factor: "Protects family/loved ones", weight: 55 },
      { factor: "Eliminates threats", weight: 25 },
      { factor: "Increases power", weight: 12 },
      { factor: "Nurtures clan", weight: 5 },
      { factor: "Practical execution", weight: 2 },
      { factor: "Mercy for enemies", weight: 1 }
    ],
    
    behavior: {
      conflict: "Destroys threats without mercy",
      stress: "Paranoid protection, smothering",
      success: "Fortifies defenses, stays vigilant",
      failure: "Vengeful rage, intensifies protection"
    },
    
    motto: "I protect fiercely, I destroy threats"
  },

  {
    zoneId: 6,
    name: "Philosophical-Transformative Thinking",
    archetype: "The Dark Sage",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 75,
      verbalIntelligence: 85,
      abstractionTolerance: 80,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 75
    },
    
    motivation: {
      primary: "Understanding transformation through philosophy",
      drivers: [
        { factor: "Seeking transformative truth", weight: 40 },
        { factor: "Teaching depth wisdom", weight: 30 },
        { factor: "Adventurous exploration", weight: 20 },
        { factor: "Psychological mastery", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (philosophical consideration)",
      impulsivity: 50,
      planningTendency: 50,
      immediateActions: 40,
      shortTermActions: 40,
      mediumTermActions: 15,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 55, focus: "Explore psychological depths" },
      mediumTerm: { weight: 35, focus: "Master transformation philosophy" },
      longTerm: { weight: 10, focus: "Teach transformative wisdom" }
    },
    
    decisionWeights: [
      { factor: "Reveals deep truth", weight: 40 },
      { factor: "Philosophical meaning", weight: 30 },
      { factor: "Adventurous exploration", weight: 15 },
      { factor: "Transforms understanding", weight: 10 },
      { factor: "Practical concerns", weight: 4 },
      { factor: "Emotional safety", weight: 1 }
    },
    
    behavior: {
      conflict: "Teaches through confrontation",
      stress: "Escapes to adventure/philosophy",
      success: "Shares wisdom, seeks next depth",
      failure: "Philosophical reframe, explores further"
    },
    
    motto: "I seek truth through fearless transformation"
  }
];

export default scorpioThinkingStyles;
