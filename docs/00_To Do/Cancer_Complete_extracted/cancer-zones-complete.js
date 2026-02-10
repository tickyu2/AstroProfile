// CANCER ZONES - COMPLETE IMPLEMENTATION
// Water Sign: Emotional, nurturing, protective, intuitive
// Ruled by Moon: Emotions, cycles, home, family, memory

export const cancerZones = [
  {
    id: 1,
    name: "The Communicative Nurturer",
    degreeRange: { start: 0, end: 4.99 },
    description: "Gemini-Cancer Cusp: Mental agility meets emotional depth",
    
    // Elemental Influence
    elementalMix: {
      water: 75,    // Cancer emotional core
      air: 25       // Gemini mental agility
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Moon", influence: 75, meaning: "Emotional nurturing, intuition" },
      secondary: { planet: "Mercury", influence: 25, meaning: "Emotional articulation" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // CANCER CORE TRAITS
      emotionalDepth: 85,
      nurturingInstinct: 80,
      protectiveness: 75,
      intuition: 80,
      homeOrientation: 70,
      sentimentality: 75,
      moodiness: 70,
      empathy: 80,
      memoryRetention: 85,
      
      // GEMINI CUSP INFLUENCE
      verbalEmotionalExpression: 80,  // High for Cancer
      mentalAgility: 70,
      socialComfort: 65,
      adaptability: 70,
      
      // BEHAVIORAL
      speed: 60,
      independence: 35,
      patience: 75,
      stubbornness: 55,
      riskTolerance: 30
    },
    
    strengths: [
      "Articulates emotions clearly",
      "Balances feeling and thinking",
      "Socially nurturing",
      "Adaptable caretaker",
      "Teaches emotional intelligence"
    ],
    
    challenges: [
      "Overthinks feelings",
      "Mental defense against vulnerability",
      "Scattered emotional focus",
      "May talk instead of feel"
    ],
    
    famousExamples: [
      { name: "Meryl Streep", degree: 0.85, note: "Emotional range + articulation" },
      { name: "Ariana Grande", degree: 0.48, note: "Expressive emotional music" }
    ],
    
    colorTheme: {
      primary: "#B0E0E6",
      secondary: "#E0FFFF",
      gradient: "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Empath",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Cancer: Maximum emotional sensitivity and nurturing power",
    
    elementalMix: {
      water: 100    // Pure water element
    },
    
    planetaryRulers: {
      primary: { planet: "Moon", influence: 100, meaning: "Pure lunar energy - emotions, mothering, cycles" }
    },
    
    qualities: {
      // MAXIMUM CANCER EXPRESSION
      emotionalDepth: 100,
      nurturingInstinct: 100,
      protectiveness: 95,
      intuition: 95,
      homeOrientation: 100,
      sentimentality: 100,
      moodiness: 95,
      empathy: 100,
      memoryRetention: 100,
      
      // PURE MOON QUALITIES
      maternalInstinct: 100,
      emotionalIntelligence: 95,
      psychicSensitivity: 90,
      
      // BEHAVIORAL
      speed: 40,
      independence: 20,
      patience: 90,
      stubbornness: 75,
      riskTolerance: 15
    },
    
    strengths: [
      "Deepest emotional capacity",
      "Ultimate safe space creator",
      "Psychic-level intuition",
      "Unconditional love",
      "Perfect memory of emotional moments"
    ],
    
    challenges: [
      "Overwhelmed by emotions",
      "Cannot function outside safe space",
      "Smothering care",
      "Takes everything personally",
      "Holds onto past hurts"
    ],
    
    famousExamples: [
      { name: "Princess Diana", degree: 7.58, note: "Ultimate nurturer" },
      { name: "Tom Hanks", degree: 8.44, note: "America's dad" }
    ],
    
    colorTheme: {
      primary: "#ADD8E6",
      secondary: "#F0F8FF",
      gradient: "linear-gradient(135deg, #ADD8E6 0%, #6495ED 100%)"
    }
  },

  {
    id: 3,
    name: "The Fierce Protector",
    degreeRange: { start: 10, end: 14.99 },
    description: "Cancer-Scorpio blend: Emotional depth meets protective intensity",
    
    elementalMix: {
      water: 85,
      plutonicWater: 15  // Scorpio transformative power
    },
    
    planetaryRulers: {
      primary: { planet: "Moon", influence: 70, meaning: "Emotional core" },
      secondary: { planet: "Pluto", influence: 30, meaning: "Transformative protection" }
    },
    
    qualities: {
      emotionalDepth: 100,
      nurturingInstinct: 85,
      protectiveness: 100,      // MAXIMUM
      intuition: 100,           // Psychic + penetrating
      homeOrientation: 85,
      sentimentality: 80,
      moodiness: 85,
      empathy: 90,
      memoryRetention: 100,
      
      // SCORPIO INFLUENCE
      intensity: 95,
      boundaryStrength: 95,
      transformativePower: 80,
      psychologicalInsight: 90,
      vengefulness: 75,
      
      // BEHAVIORAL
      speed: 45,
      independence: 35,
      patience: 70,
      stubbornness: 90,
      riskTolerance: 25
    },
    
    strengths: [
      "Unstoppable protector",
      "Psychic threat detection",
      "Transforms pain to power",
      "Sees through manipulation",
      "Impenetrable boundaries"
    ],
    
    challenges: [
      "Paranoid vigilance",
      "Eternal grudges",
      "Overprotective smothering",
      "Emotional manipulation when threatened",
      "Trust issues"
    ],
    
    famousExamples: [
      { name: "Frida Kahlo", degree: 11.85, note: "Transformed pain into art" },
      { name: "Solange", degree: 13.2, note: "Fierce family protector" }
    ],
    
    colorTheme: {
      primary: "#4682B4",
      secondary: "#483D8B",
      gradient: "linear-gradient(135deg, #4682B4 0%, #483D8B 100%)"
    }
  },

  {
    id: 4,
    name: "The Emotional Healer",
    degreeRange: { start: 15, end: 19.99 },
    description: "Cancer-Scorpio decan: Deep transformation through emotional alchemy",
    
    elementalMix: {
      water: 70,
      plutonicWater: 30
    },
    
    planetaryRulers: {
      primary: { planet: "Moon", influence: 60, meaning: "Emotional foundation" },
      secondary: { planet: "Pluto", influence: 40, meaning: "Death-rebirth cycles" }
    },
    
    qualities: {
      emotionalDepth: 100,
      nurturingInstinct: 80,
      protectiveness: 90,
      intuition: 95,
      homeOrientation: 75,
      sentimentality: 75,
      moodiness: 90,
      empathy: 85,
      memoryRetention: 95,
      
      // SCORPIO DOMINANCE
      intensity: 100,
      transformativePower: 95,
      psychologicalInsight: 100,
      regenerativeCapacity: 90,
      secretiveness: 85,
      
      // BEHAVIORAL
      speed: 40,
      independence: 45,
      patience: 65,
      stubbornness: 95,
      riskTolerance: 30
    },
    
    strengths: [
      "Transforms trauma into healing",
      "Profound psychological wisdom",
      "Regenerates from emotional death",
      "Heals deep wounds in others",
      "Fearless in emotional depths"
    ],
    
    challenges: [
      "Obsessed with intensity",
      "Wounds others during transformation",
      "Extreme trust issues",
      "Addicted to crisis",
      "Cannot do 'light'"
    ],
    
    famousExamples: [
      { name: "Nelson Mandela", degree: 18.9, note: "Transformed hatred to forgiveness" },
      { name: "Ernest Hemingway", degree: 13.26, note: "Deep emotional intensity" }
    ],
    
    colorTheme: {
      primary: "#191970",
      secondary: "#4B0082",
      gradient: "linear-gradient(135deg, #191970 0%, #4B0082 100%)"
    }
  },

  {
    id: 5,
    name: "The Mystic Caregiver",
    degreeRange: { start: 20, end: 24.99 },
    description: "Cancer-Pisces blend: Emotional nurturing meets spiritual transcendence",
    
    elementalMix: {
      water: 70,
      spiritualWater: 30  // Pisces cosmic compassion
    },
    
    planetaryRulers: {
      primary: { planet: "Moon", influence: 65, meaning: "Emotional security" },
      secondary: { planet: "Neptune", influence: 35, meaning: "Universal love" }
    },
    
    qualities: {
      emotionalDepth: 95,
      nurturingInstinct: 95,
      protectiveness: 70,
      intuition: 100,           // Cosmic-level
      homeOrientation: 65,
      sentimentality: 90,
      moodiness: 85,
      empathy: 100,
      memoryRetention: 80,
      
      // PISCES INFLUENCE
      spiritualConnection: 95,
      universalCompassion: 100,
      artisticExpression: 85,
      boundaryDissolution: 90,
      
      // BEHAVIORAL
      speed: 35,
      independence: 25,
      patience: 100,
      stubbornness: 40,
      riskTolerance: 20
    },
    
    strengths: [
      "Universal compassion",
      "Spiritual healing presence",
      "Artistic emotional expression",
      "Accepts all without judgment",
      "Creates sacred spaces"
    ],
    
    challenges: [
      "No boundaries - absorbs all pain",
      "Lost in spiritual realms",
      "Escapist tendencies",
      "Martyr complex",
      "Confusion of self/other"
    ],
    
    famousExamples: [
      { name: "Dalai Lama", degree: 21.5, note: "Universal compassion" },
      { name: "Cat Stevens", degree: 18.92, note: "Spiritual music journey" }
    ],
    
    colorTheme: {
      primary: "#B0C4DE",
      secondary: "#E0B0FF",
      gradient: "linear-gradient(135deg, #B0C4DE 0%, #E0B0FF 100%)"
    }
  },

  {
    id: 6,
    name: "The Radiant Nurturer",
    degreeRange: { start: 25, end: 29.99 },
    description: "Cancer-Leo cusp: Emotional depth meets creative warmth",
    
    elementalMix: {
      water: 75,
      fire: 25  // Leo radiance
    },
    
    planetaryRulers: {
      primary: { planet: "Moon", influence: 70, meaning: "Emotional foundation" },
      secondary: { planet: "Sun", influence: 30, meaning: "Creative self-expression" }
    },
    
    qualities: {
      emotionalDepth: 85,
      nurturingInstinct: 90,
      protectiveness: 85,
      intuition: 85,
      homeOrientation: 80,
      sentimentality: 80,
      moodiness: 65,
      empathy: 85,
      memoryRetention: 85,
      
      // LEO INFLUENCE
      creativeExpression: 85,
      warmth: 95,
      generosity: 90,
      charisma: 80,
      confidence: 75,
      
      // BEHAVIORAL
      speed: 55,
      independence: 40,
      patience: 75,
      stubbornness: 60,
      riskTolerance: 35
    },
    
    strengths: [
      "Joyful warm nurturing",
      "Creates beautiful homes",
      "Confident caretaker",
      "Expresses emotions creatively",
      "Inspires emotional courage"
    ],
    
    challenges: [
      "Needs appreciation for care",
      "Dramatic emotional expression",
      "Wounded when unrecognized",
      "Can be controlling through nurturing"
    ],
    
    famousExamples: [
      { name: "Robin Williams", degree: 26.3, note: "Joyful emotional generosity" },
      { name: "Tom Cruise", degree: 27.84, note: "Charismatic protector" }
    ],
    
    colorTheme: {
      primary: "#FFB6C1",
      secondary: "#FFD700",
      gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFD700 100%)"
    }
  }
];

export const getCancerZoneByDegree = (degree) => {
  return cancerZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default cancerZones;
