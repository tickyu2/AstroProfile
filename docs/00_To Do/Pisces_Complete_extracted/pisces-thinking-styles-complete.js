// PISCES THINKING STYLES - COMPLETE IMPLEMENTATION
// Water Sign: Transcendent, spiritual, compassionate, dissolving
// THE FINAL SIGN - COMPLETING THE ZODIAC WHEEL

export const piscesThinkingStyles = [
  {
    zoneId: 1,
    name: "Visionary-Mystical Thinking",
    archetype: "The Spiritual Innovator",
    degreeRange: { start: 0, end: 4.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 75,
      abstractionTolerance: 95,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 90
    },
    
    motivation: {
      primary: "Manifesting spiritual vision",
      drivers: [
        { factor: "Channeling mystical innovation", weight: 40 },
        { factor: "Spiritual revolutionary vision", weight: 30 },
        { factor: "Universal compassion", weight: 20 },
        { factor: "Transcendent creativity", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium-fast (intuitive leaps)",
      impulsivity: 60,
      planningTendency: 40,
      immediateActions: 45,
      shortTermActions: 40,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Channel mystical vision" },
      mediumTerm: { weight: 40, focus: "Manifest spiritual innovation" },
      longTerm: { weight: 10, focus: "Transcendent unity" }
    },
    
    decisionWeights: [
      { factor: "Spiritually visionary", weight: 45 },
      { factor: "Revolutionary compassion", weight: 25 },
      { factor: "Mystically guided", weight: 20 },
      { factor: "Innovative transcendence", weight: 7 },
      { factor: "Practical execution", weight: 2 },
      { factor: "Material concerns", weight: 1 }
    ],
    
    behavior: {
      conflict: "Detached spiritual innovation",
      stress: "Escapes to mystical vision",
      success: "Shares with humanity, continues",
      failure: "Reframes as spiritual lesson"
    },
    
    motto: "I channel the future through divine vision"
  },

  {
    zoneId: 2,
    name: "Pure Transcendent-Dissolving Thinking",
    archetype: "The Divine Channel",
    degreeRange: { start: 5, end: 9.99 },
    
    cognition: {
      processingSpeed: 70,           // Slow (timeless)
      verbalIntelligence: 65,        // Hard to articulate mysticism
      abstractionTolerance: 100,     // MAXIMUM (pure spiritual)
      metaCognition: 60,             // Lost in transcendence
      focus: 50,                     // Very low (boundaryless)
      cognitiveFlexibility: 100      // MAXIMUM (flows everywhere)
    },
    
    motivation: {
      primary: "Merging with divine universal consciousness",
      drivers: [
        { factor: "Transcending ego/self", weight: 45 },
        { factor: "Universal love for all", weight: 30 },
        { factor: "Spiritual unity", weight: 15 },
        { factor: "Divine channeling", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Very slow (waits for divine timing)",
      impulsivity: 40,
      planningTendency: 60,
      immediateActions: 30,
      shortTermActions: 40,
      mediumTermActions: 25,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 45, focus: "Flow with divine will" },
      mediumTerm: { weight: 40, focus: "Dissolve ego completely" },
      longTerm: { weight: 15, focus: "Merge with divine source" }
    },
    
    decisionWeights: [
      { factor: "Divinely guided", weight: 50 },
      { factor: "Serves universal love", weight: 30 },
      { factor: "Transcends ego", weight: 15 },
      { factor: "Reduces suffering", weight: 4 },
      { factor: "Personal benefit", weight: 1 },
      { factor: "Material world", weight: 0 }
    },
    
    behavior: {
      conflict: "Dissolves in universal love",
      stress: "Escapes to spiritual realms completely",
      success: "Humbly channels, continues flowing",
      failure: "Accepts as divine will, surrenders"
    },
    
    motto: "I am nothing, I am everything, I am love"
  },

  {
    zoneId: 3,
    name: "Nurturing-Spiritual Thinking",
    archetype: "The Divine Mother",
    degreeRange: { start: 10, end: 14.99 },
    
    cognition: {
      processingSpeed: 65,
      verbalIntelligence: 70,
      abstractionTolerance: 85,
      metaCognition: 70,
      focus: 75,
      cognitiveFlexibility: 85
    },
    
    motivation: {
      primary: "Healing all beings through spiritual nurturing",
      drivers: [
        { factor: "Nurturing universal family", weight: 45 },
        { factor: "Healing emotional wounds spiritually", weight: 30 },
        { factor: "Creating sacred sanctuary", weight: 15 },
        { factor: "Divine mothering", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow (emotional-spiritual processing)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 30,
      shortTermActions: 45,
      mediumTermActions: 20,
      longTermActions: 5
    },
    
    goals: {
      shortTerm: { weight: 50, focus: "Nurture spiritually today" },
      mediumTerm: { weight: 40, focus: "Heal collective wounds" },
      longTerm: { weight: 10, focus: "Divine mother to all" }
    },
    
    decisionWeights: [
      { factor: "Nurtures/heals spiritually", weight: 50 },
      { factor: "Creates sacred safety", weight: 25 },
      { factor: "Emotionally compassionate", weight: 15 },
      { factor: "Divinely guided", weight: 7 },
      { factor: "Practical concerns", weight: 2 },
      { factor: "Self-protection", weight: 1 }
    },
    
    behavior: {
      conflict: "Spiritual nurturing resolution",
      stress: "Absorbs all pain, retreats to heal",
      success: "Shares healing, continues nurturing",
      failure: "Martyrs self, continues giving"
    },
    
    motto: "I nurture all through divine love"
  },

  {
    zoneId: 4,
    name: "Alchemical-Mystical Thinking",
    archetype: "The Spiritual Alchemist",
    degreeRange: { start: 15, end: 19.99 },
    
    cognition: {
      processingSpeed: 60,
      verbalIntelligence: 70,
      abstractionTolerance: 90,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 80
    },
    
    motivation: {
      primary: "Transforming darkness into spiritual light",
      drivers: [
        { factor: "Spiritual alchemy/transformation", weight: 45 },
        { factor: "Redeeming collective shadow", weight: 30 },
        { factor: "Mystical depth healing", weight: 15 },
        { factor: "Transcendent regeneration", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Slow (deep spiritual processing)",
      impulsivity: 35,
      planningTendency: 65,
      immediateActions: 25,
      shortTermActions: 40,
      mediumTermActions: 25,
      longTermActions: 10
    },
    
    goals: {
      shortTerm: { weight: 40, focus: "Transform current darkness" },
      mediumTerm: { weight: 45, focus: "Spiritual alchemy mastery" },
      longTerm: { weight: 15, focus: "Redeem collective shadow" }
    },
    
    decisionWeights: [
      { factor: "Transforms spiritually", weight: 50 },
      { factor: "Redeems darkness", weight: 25 },
      { factor: "Heals deep wounds", weight: 15 },
      { factor: "Divinely guided", weight: 7 },
      { factor: "Practical world", weight: 2 },
      { factor: "Personal safety", weight: 1 }
    },
    
    behavior: {
      conflict: "Transforms through compassion",
      stress: "Descends to heal shadow",
      success: "Humbly continues transformation",
      failure: "Spiritual death-rebirth"
    },
    
    motto: "I transform all darkness into divine light"
  },

  {
    zoneId: 5,
    name: "Creative-Transcendent Thinking",
    archetype: "The Divine Artist",
    degreeRange: { start: 20, end: 24.99 },
    
    cognition: {
      processingSpeed: 65,
      verbalIntelligence: 75,
      abstractionTolerance: 95,
      metaCognition: 70,
      focus: 70,
      cognitiveFlexibility: 90
    },
    
    motivation: {
      primary: "Channeling divine creativity",
      drivers: [
        { factor: "Creating transcendent art", weight: 45 },
        { factor: "Channeling divine beauty", weight: 30 },
        { factor: "Healing through creativity", weight: 15 },
        { factor: "Expressing universal love", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Medium (creative flow timing)",
      impulsivity: 50,
      planningTendency: 50,
      immediateActions: 40,
      shortTermActions: 45,
      mediumTermActions: 12,
      longTermActions: 3
    },
    
    goals: {
      shortTerm: { weight: 55, focus: "Channel divine art today" },
      mediumTerm: { weight: 35, focus: "Create transcendent beauty" },
      longTerm: { weight: 10, focus: "Art as spiritual legacy" }
    },
    
    decisionWeights: [
      { factor: "Channels divine creativity", weight: 50 },
      { factor: "Transcendent beauty", weight: 25 },
      { factor: "Heals through art", weight: 15 },
      { factor: "Expresses universal love", weight: 7 },
      { factor: "Practical concerns", weight: 2 },
      { factor: "Commercial success", weight: 1 }
    },
    
    behavior: {
      conflict: "Creates beauty from pain",
      stress: "Escapes to artistic creation",
      success: "Shares art humbly, continues",
      failure: "Sees as muse's lesson"
    },
    
    motto: "I channel the divine through sacred art"
  },

  {
    zoneId: 6,
    name: "Courageous-Mystical Thinking",
    archetype: "The Spiritual Warrior",
    degreeRange: { start: 25, end: 29.99 },
    
    cognition: {
      processingSpeed: 80,
      verbalIntelligence: 75,
      abstractionTolerance: 85,
      metaCognition: 75,
      focus: 80,
      cognitiveFlexibility: 85
    },
    
    motivation: {
      primary: "Courageously manifesting spiritual vision",
      drivers: [
        { factor: "Acting on divine guidance", weight: 45 },
        { factor: "Pioneering spiritual paths", weight: 30 },
        { factor: "Compassionate warrior service", weight: 15 },
        { factor: "Initiating transcendence", weight: 10 }
      ]
    },
    
    actionTiming: {
      decisionSpeed: "Fast (spiritual warrior decisiveness)",
      impulsivity: 70,
      planningTendency: 30,
      immediateActions: 55,
      shortTermActions: 35,
      mediumTermActions: 8,
      longTermActions: 2
    },
    
    goals: {
      shortTerm: { weight: 65, focus: "Act on spiritual guidance NOW" },
      mediumTerm: { weight: 30, focus: "Pioneer mystical movement" },
      longTerm: { weight: 5, focus: "Spiritual warrior legacy" }
    },
    
    decisionWeights: [
      { factor: "Divinely guided action", weight: 50 },
      { factor: "Courageous spiritual service", weight: 25 },
      { factor: "Pioneers transcendence", weight: 15 },
      { factor: "Compassionate impact", weight: 7 },
      { factor: "Practical safety", weight: 2 },
      { factor: "Fear/doubt", weight: 1 }
    },
    
    behavior: {
      conflict: "Spiritual warrior confrontation",
      stress: "Charges into spiritual battle",
      success: "Victory lap, next mission",
      failure: "Martyrdom for spiritual cause"
    },
    
    motto: "I fight for the divine with fearless love"
  }
];

export default piscesThinkingStyles;
