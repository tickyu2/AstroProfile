// PISCES ZONES - COMPLETE IMPLEMENTATION
// Water Sign: Transcendent, spiritual, compassionate, dissolving
// Ruled by Jupiter + Neptune: Expansion + dissolution, wisdom + mysticism

export const piscesZones = [
  {
    id: 1,
    name: "The Visionary Mystic",
    degreeRange: { start: 0, end: 4.99 },
    description: "Aquarius-Pisces Cusp: Revolutionary innovation meets spiritual transcendence",
    
    // Elemental Influence
    elementalMix: {
      water: 75,    // Pisces spiritual compassion
      air: 25       // Aquarius intellectual vision
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Neptune", influence: 60, meaning: "Spiritual transcendence, dissolution" },
      secondary: { planet: "Jupiter", influence: 15, meaning: "Expansive compassion" },
      tertiary: { planet: "Uranus", influence: 25, meaning: "Revolutionary spirituality" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // PISCES CORE TRAITS
      spiritualConnection: 90,
      compassion: 90,
      empathy: 90,
      intuition: 90,
      boundaryDissolution: 80,
      imagination: 85,
      artisticExpression: 85,
      escapism: 70,
      selflessness: 85,
      
      // AQUARIUS CUSP INFLUENCE
      intellectualDepth: 70,        // Higher than pure Pisces
      futureVision: 75,             // Sees spiritual future
      innovation: 65,               // Spiritual innovation
      detachment: 55,               // Some objectivity
      
      // BEHAVIORAL
      speed: 75,                    // Medium-fast (Air + Water)
      independence: 70,             // Medium-high (spiritual independence)
      patience: 85,                 // Very high (spiritual acceptance)
      stubbornness: 60,             // Medium (flexible ideals)
      riskTolerance: 75             // High (faith in vision)
    },
    
    strengths: [
      "Visionary spiritual innovation",
      "Compassionate revolutionary thought",
      "Mystical future sight",
      "Intellectual spirituality",
      "Transcendent humanitarian vision"
    ],
    
    challenges: [
      "Lost in utopian spiritual ideals",
      "Intellectualizes mysticism",
      "Detached from emotional reality",
      "Impractical visionary dreams",
      "Difficulty grounding insights"
    ],
    
    famousExamples: [
      { name: "Rihanna", degree: 0.82, note: "Visionary artistic innovation" },
      { name: "Steve Jobs", degree: 3.06, note: "Mystical visionary innovation" }
    ],
    
    colorTheme: {
      primary: "#9370DB",    // Medium Purple
      secondary: "#8A2BE2",  // Blue Violet
      gradient: "linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Mystic",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Pisces: Maximum spiritual transcendence and universal compassion",
    
    elementalMix: {
      water: 100    // Pure water element
    },
    
    planetaryRulers: {
      primary: { planet: "Neptune", influence: 70, meaning: "Pure Neptunian energy - dissolution, transcendence, mysticism" },
      secondary: { planet: "Jupiter", influence: 30, meaning: "Expansive universal love" }
    },
    
    qualities: {
      // MAXIMUM PISCES EXPRESSION
      spiritualConnection: 100,      // MAXIMUM - merged with divine
      compassion: 100,               // MAXIMUM - loves all beings
      empathy: 100,                  // MAXIMUM - feels everything
      intuition: 100,                // MAXIMUM - cosmic knowing
      boundaryDissolution: 100,      // MAXIMUM - no self/other
      imagination: 100,              // MAXIMUM - infinite creativity
      artisticExpression: 100,       // MAXIMUM - pure art
      escapism: 95,                  // Extreme avoidance
      selflessness: 100,             // MAXIMUM - ego death
      
      // PURE NEPTUNE-JUPITER QUALITIES
      transcendence: 100,            // Beyond all duality
      mysticism: 100,                // Direct divine experience
      universalLove: 100,            // Loves all equally
      sacrifice: 95,                 // Martyr tendency
      
      // BEHAVIORAL
      speed: 60,                     // Medium-slow (timeless flow)
      independence: 40,              // Low (merges with all)
      patience: 100,                 // MAXIMUM (infinite)
      stubbornness: 30,              // Very low (flows)
      riskTolerance: 80              // Very high (faith in divine)
    },
    
    strengths: [
      "Channels divine universal love",
      "Transcends all ego boundaries",
      "Creates transcendent art",
      "Infinite compassion for all",
      "Mystical healing presence"
    ],
    
    challenges: [
      "Lost in spiritual realms",
      "No boundaries - absorbs all pain",
      "Extreme escapism and avoidance",
      "Martyr complex - sacrifices self",
      "Cannot function in material world"
    ],
    
    famousExamples: [
      { name: "Kurt Cobain", degree: 6.57, note: "Mystical artist, transcendent pain" },
      { name: "Albert Einstein", degree: 8.11, note: "Transcendent cosmic vision" }
    ],
    
    colorTheme: {
      primary: "#7B68EE",    // Medium Slate Blue
      secondary: "#6A5ACD",  // Slate Blue
      gradient: "linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)"
    }
  },

  {
    id: 3,
    name: "The Emotional Healer",
    degreeRange: { start: 10, end: 14.99 },
    description: "Pisces-Cancer blend: Spiritual transcendence meets emotional nurturing",
    
    elementalMix: {
      water: 85,
      emotionalWater: 15  // Cancer nurturing instinct
    },
    
    planetaryRulers: {
      primary: { planet: "Neptune", influence: 60, meaning: "Spiritual dissolution" },
      secondary: { planet: "Jupiter", influence: 20, meaning: "Expansive compassion" },
      tertiary: { planet: "Moon", influence: 20, meaning: "Emotional nurturing" }
    },
    
    qualities: {
      spiritualConnection: 95,
      compassion: 100,               // MAXIMUM (Neptune + Moon)
      empathy: 100,                  // MAXIMUM
      intuition: 100,                // MAXIMUM (psychic + lunar)
      boundaryDissolution: 90,
      imagination: 90,
      artisticExpression: 90,
      escapism: 85,
      selflessness: 95,
      
      // CANCER INFLUENCE
      nurturingInstinct: 90,         // Spiritual mothering
      protectiveness: 75,            // Soft protection
      emotionalMemory: 85,           // Remembers wounds
      homeOrientation: 70,           // Creates sanctuary
      
      // BEHAVIORAL
      speed: 55,                     // Slow (emotional processing)
      independence: 35,              // Low (needs to nurture)
      patience: 100,                 // MAXIMUM
      stubbornness: 45,              // Low-medium
      riskTolerance: 65              // Medium-high (protective but faithful)
    },
    
    strengths: [
      "Heals emotional wounds spiritually",
      "Nurtures with universal compassion",
      "Creates sacred safe spaces",
      "Psychic emotional understanding",
      "Channels divine mothering"
    ],
    
    challenges: [
      "Smothers with spiritual care",
      "Absorbs others' emotional pain",
      "Martyrs self for family/humanity",
      "Cannot maintain boundaries",
      "Escapist when overwhelmed"
    ],
    
    famousExamples: [
      { name: "Bruce Willis", degree: 11.29, note: "Emotional protective roles" },
      { name: "Daniel Craig", degree: 13.42, note: "Emotional depth in characters" }
    ],
    
    colorTheme: {
      primary: "#9966CC",    // Amethyst
      secondary: "#BA55D3",  // Medium Orchid
      gradient: "linear-gradient(135deg, #9966CC 0%, #BA55D3 100%)"
    }
  },

  {
    id: 4,
    name: "The Compassionate Transformer",
    degreeRange: { start: 15, end: 19.99 },
    description: "Pisces-Scorpio blend: Spiritual transcendence meets emotional intensity",
    
    elementalMix: {
      water: 70,
      plutonicWater: 30  // Scorpio transformative depth
    },
    
    planetaryRulers: {
      primary: { planet: "Neptune", influence: 50, meaning: "Spiritual transcendence" },
      secondary: { planet: "Pluto", influence: 30, meaning: "Transformative power" },
      tertiary: { planet: "Jupiter", influence: 20, meaning: "Expansive wisdom" }
    },
    
    qualities: {
      spiritualConnection: 95,
      compassion: 95,
      empathy: 95,
      intuition: 100,                // MAXIMUM (Neptune + Pluto)
      boundaryDissolution: 85,
      imagination: 85,
      artisticExpression: 95,
      escapism: 80,
      selflessness: 90,
      
      // SCORPIO INFLUENCE
      emotionalIntensity: 90,        // Deep spiritual intensity
      transformativePower: 95,       // Spiritual alchemy
      psychologicalInsight: 95,      // Depth psychology
      regeneration: 90,              // Spiritual rebirth
      
      // BEHAVIORAL
      speed: 50,                     // Slow (deep processing)
      independence: 50,              // Medium (spiritual solitude)
      patience: 95,                  // Very high
      stubbornness: 55,              // Medium (transformative flow)
      riskTolerance: 80              // Very high (fearless in depths)
    },
    
    strengths: [
      "Transforms darkness into light",
      "Profound spiritual healing",
      "Psychic depth psychology",
      "Compassionate intensity",
      "Spiritual regeneration power"
    ],
    
    challenges: [
      "Lost in shadow depths",
      "Obsessive spiritual seeking",
      "Martyrdom through transformation",
      "Absorbs collective darkness",
      "Addictive spiritual escapes"
    ],
    
    famousExamples: [
      { name: "Johnny Cash", degree: 16.23, note: "Transformed darkness to redemption" },
      { name: "Michael Caine", degree: 18.47, note: "Deep transformative roles" }
    ],
    
    colorTheme: {
      primary: "#663399",    // Rebecca Purple
      secondary: "#4B0082",  // Indigo
      gradient: "linear-gradient(135deg, #663399 0%, #4B0082 100%)"
    }
  },

  {
    id: 5,
    name: "The Divine Artist",
    degreeRange: { start: 20, end: 24.99 },
    description: "Pisces-Cancer decan: Peak water energy - spiritual compassion meets emotional depth",
    
    elementalMix: {
      water: 70,
      emotionalWater: 30  // Strong Cancer
    },
    
    planetaryRulers: {
      primary: { planet: "Neptune", influence: 50, meaning: "Divine creativity" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional expression" },
      tertiary: { planet: "Jupiter", influence: 20, meaning: "Expansive art" }
    },
    
    qualities: {
      spiritualConnection: 90,
      compassion: 100,               // MAXIMUM
      empathy: 100,                  // MAXIMUM
      intuition: 95,
      boundaryDissolution: 95,
      imagination: 100,              // MAXIMUM (Neptune + Moon)
      artisticExpression: 100,       // MAXIMUM - divine art
      escapism: 90,
      selflessness: 95,
      
      // MOON DOMINANCE
      emotionalDepth: 95,            // Deep feeling
      sentimentality: 90,            // Deeply sentimental
      nurturingCreativity: 95,       // Nurtures through art
      emotionalMemory: 90,           // Remembers feelings
      
      // BEHAVIORAL
      speed: 55,                     // Slow (emotional/spiritual)
      independence: 40,              // Low (emotionally connected)
      patience: 100,                 // MAXIMUM
      stubbornness: 40,              // Low (emotional flow)
      riskTolerance: 70              // High (emotional courage)
    },
    
    strengths: [
      "Channels divine creativity",
      "Creates transcendent art from emotion",
      "Nurtures through spiritual beauty",
      "Infinite compassionate expression",
      "Heals through artistic presence"
    ],
    
    challenges: [
      "Lost in artistic dreamworld",
      "Extreme emotional sensitivity",
      "Cannot handle material reality",
      "Addictive artistic escapism",
      "Martyrs self for art"
    ],
    
    famousExamples: [
      { name: "Drew Barrymore", degree: 21.23, note: "Emotional artistic expression" },
      { name: "Queen Latifah", degree: 23.18, note: "Compassionate creative power" }
    ],
    
    colorTheme: {
      primary: "#DDA0DD",    // Plum
      secondary: "#EE82EE",  // Violet
      gradient: "linear-gradient(135deg, #DDA0DD 0%, #EE82EE 100%)"
    }
  },

  {
    id: 6,
    name: "The Cosmic Initiator",
    degreeRange: { start: 25, end: 29.99 },
    description: "Pisces-Aries cusp: Spiritual transcendence meets courageous action",
    
    elementalMix: {
      water: 75,
      fire: 25      // Aries warrior courage
    },
    
    planetaryRulers: {
      primary: { planet: "Neptune", influence: 60, meaning: "Spiritual transcendence" },
      secondary: { planet: "Mars", influence: 25, meaning: "Warrior action, courage" },
      tertiary: { planet: "Jupiter", influence: 15, meaning: "Expansive faith" }
    },
    
    qualities: {
      spiritualConnection: 85,
      compassion: 90,
      empathy: 90,
      intuition: 90,
      boundaryDissolution: 80,
      imagination: 90,
      artisticExpression: 85,
      escapism: 70,                  // Lower (Aries acts)
      selflessness: 85,
      
      // ARIES INFLUENCE
      courage: 85,                   // Spiritual warrior
      initiative: 80,                // Acts on mysticism
      pioneering: 75,                // Spiritual pioneer
      directness: 60,                // Some bluntness
      
      // BEHAVIORAL
      speed: 70,                     // Medium-fast (Fire speeds Water)
      independence: 65,              // Medium-high (spiritual warrior)
      patience: 75,                  // High (but acts when guided)
      stubbornness: 55,              // Medium (principled action)
      riskTolerance: 90              // Very high (fearless faith)
    },
    
    strengths: [
      "Courageously acts on spiritual vision",
      "Pioneers mystical paths",
      "Compassionate warrior",
      "Initiates spiritual movements",
      "Balances transcendence with action"
    ],
    
    challenges: [
      "Impulsive spiritual action",
      "Martyrs self in spiritual battles",
      "Aggressive about mysticism",
      "Difficulty integrating opposites",
      "Restless even in transcendence"
    ],
    
    famousExamples: [
      { name: "Lady Gaga", degree: 26.53, note: "Courageous artistic spiritual expression" },
      { name: "James Taylor", degree: 28.42, note: "Pioneering spiritual folk music" }
    ],
    
    colorTheme: {
      primary: "#DA70D6",    // Orchid
      secondary: "#FF69B4",  // Hot Pink
      gradient: "linear-gradient(135deg, #DA70D6 0%, #FF69B4 100%)"
    }
  }
];

export const getPiscesZoneByDegree = (degree) => {
  return piscesZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default piscesZones;
