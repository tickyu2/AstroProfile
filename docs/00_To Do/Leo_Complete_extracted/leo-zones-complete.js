// LEO ZONES - COMPLETE IMPLEMENTATION
// Fire Sign: Creative, passionate, dramatic, regal
// Ruled by Sun: Identity, ego, vitality, self-expression, creativity

export const leoZones = [
  {
    id: 1,
    name: "The Warm Leader",
    degreeRange: { start: 0, end: 4.99 },
    description: "Cancer-Leo Cusp: Emotional warmth meets creative confidence",
    
    // Elemental Influence
    elementalMix: {
      fire: 75,     // Leo creative passion
      water: 25     // Cancer emotional depth
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Sun", influence: 75, meaning: "Creative vitality, ego strength" },
      secondary: { planet: "Moon", influence: 25, meaning: "Emotional nurturing, intuition" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // LEO CORE TRAITS
      creativity: 85,
      charisma: 80,
      confidence: 75,
      generosity: 85,
      leadership: 80,
      dramaticFlair: 70,
      needForRecognition: 75,
      pride: 70,
      loyalty: 90,
      
      // CANCER CUSP INFLUENCE
      emotionalIntelligence: 75,    // High for Leo
      nurturingLeadership: 80,      // Leads with care
      sensitivity: 60,              // More sensitive than pure Leo
      homeOrientation: 55,          // Values family/home
      
      // BEHAVIORAL
      speed: 70,                    // Medium-fast (Fire + Water balance)
      independence: 65,             // Medium-high (wants support too)
      patience: 60,                 // Medium (Fire wants action, Water waits)
      stubbornness: 75,             // High (Fixed sign)
      riskTolerance: 60             // Medium-high (confident but protective)
    },
    
    strengths: [
      "Leads with warmth and care",
      "Emotionally intelligent performer",
      "Protects while inspiring",
      "Creates emotional safety through charisma",
      "Balances strength with sensitivity"
    ],
    
    challenges: [
      "Wounded when care isn't appreciated",
      "Moody when recognition delayed",
      "Can smother with protective leadership",
      "Needs emotional validation constantly"
    ],
    
    famousExamples: [
      { name: "Barack Obama", degree: 3.48, note: "Charismatic leader with emotional intelligence" },
      { name: "J.K. Rowling", degree: 1.25, note: "Creative warmth, protective of her world" }
    ],
    
    colorTheme: {
      primary: "#FFD700",    // Gold
      secondary: "#FFA500",  // Orange
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
    }
  },

  {
    id: 2,
    name: "The Radiant King/Queen",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Leo: Maximum creative expression and regal presence",
    
    elementalMix: {
      fire: 100    // Pure fire element
    },
    
    planetaryRulers: {
      primary: { planet: "Sun", influence: 100, meaning: "Pure solar energy - vitality, creativity, ego" }
    },
    
    qualities: {
      // MAXIMUM LEO EXPRESSION
      creativity: 100,           // Peak creative power
      charisma: 100,            // Magnetic presence
      confidence: 95,           // Unshakeable self-belief
      generosity: 95,           // Lavish giving
      leadership: 95,           // Natural ruler
      dramaticFlair: 100,       // Maximum theatrical expression
      needForRecognition: 95,   // Requires constant admiration
      pride: 95,                // Cannot tolerate disrespect
      loyalty: 95,              // Fiercely loyal to inner circle
      
      // PURE SUN QUALITIES
      vitalityEnergy: 100,      // Boundless life force
      selfExpression: 100,      // Must create/perform
      regalPresence: 100,       // Born ruler energy
      
      // BEHAVIORAL
      speed: 85,                // Fast (Fire element)
      independence: 80,         // High (rules own kingdom)
      patience: 40,             // Low (Fire wants NOW)
      stubbornness: 90,         // Very stubborn (Fixed Fire)
      riskTolerance: 75         // High (confident in own abilities)
    },
    
    strengths: [
      "Inspires through sheer presence",
      "Creates magnificent experiences",
      "Unshakeable confidence",
      "Generous beyond measure",
      "Natural born leader"
    ],
    
    challenges: [
      "Ego can overshadow others",
      "Requires constant admiration",
      "Cannot tolerate being ignored",
      "Dramatic when wounded",
      "Pride prevents vulnerability"
    ],
    
    famousExamples: [
      { name: "Madonna", degree: 6.07, note: "Pure creative self-expression" },
      { name: "Mick Jagger", degree: 7.31, note: "Charismatic performer, regal stage presence" }
    ],
    
    colorTheme: {
      primary: "#FF8C00",    // Dark Orange
      secondary: "#FF4500",  // Orange Red
      gradient: "linear-gradient(135deg, #FF8C00 0%, #FF4500 100%)"
    }
  },

  {
    id: 3,
    name: "The Passionate Creator",
    degreeRange: { start: 10, end: 14.99 },
    description: "Leo-Sagittarius blend: Creative fire meets adventurous spirit",
    
    elementalMix: {
      fire: 85,
      philosophicalFire: 15  // Sagittarius quest for meaning
    },
    
    planetaryRulers: {
      primary: { planet: "Sun", influence: 70, meaning: "Creative identity" },
      secondary: { planet: "Jupiter", influence: 30, meaning: "Expansive vision, philosophy" }
    },
    
    qualities: {
      creativity: 95,
      charisma: 90,
      confidence: 90,
      generosity: 100,          // MAXIMUM (Jupiter expands)
      leadership: 85,
      dramaticFlair: 85,
      needForRecognition: 80,
      pride: 80,
      loyalty: 85,
      
      // SAGITTARIUS INFLUENCE
      adventurousness: 80,      // Explores creatively
      philosophicalDepth: 70,   // Seeks meaning in creation
      optimism: 95,            // Boundless enthusiasm
      freedom: 75,             // Needs creative freedom
      
      // BEHAVIORAL
      speed: 90,               // Very fast (Double fire)
      independence: 85,        // High (needs freedom)
      patience: 35,            // Low (wants it all NOW)
      stubbornness: 75,        // Medium-high
      riskTolerance: 90        // Very high (adventurous confidence)
    },
    
    strengths: [
      "Inspires through visionary creation",
      "Boundless creative energy",
      "Generous philosophical leader",
      "Adventurous performer",
      "Optimistic even in failure"
    ],
    
    challenges: [
      "Overcommits to creative projects",
      "Restless with routine",
      "Can be preachy about own vision",
      "Scattered creative focus",
      "Takes on too much"
    ],
    
    famousExamples: [
      { name: "Jennifer Lopez", degree: 11.18, note: "Adventurous creative expression" },
      { name: "Robert De Niro", degree: 13.51, note: "Philosophical depth in performance" }
    ],
    
    colorTheme: {
      primary: "#FF6347",    // Tomato Red
      secondary: "#FF7F50",  // Coral
      gradient: "linear-gradient(135deg, #FF6347 0%, #FF7F50 100%)"
    }
  },

  {
    id: 4,
    name: "The Bold Visionary",
    degreeRange: { start: 15, end: 19.99 },
    description: "Leo-Sagittarius decan: Peak fire energy - creative vision meets action",
    
    elementalMix: {
      fire: 70,
      philosophicalFire: 30  // Strong Sagittarius
    },
    
    planetaryRulers: {
      primary: { planet: "Sun", influence: 60, meaning: "Creative core" },
      secondary: { planet: "Jupiter", influence: 40, meaning: "Expansive manifestation" }
    },
    
    qualities: {
      creativity: 90,
      charisma: 95,
      confidence: 100,          // MAXIMUM
      generosity: 95,
      leadership: 100,          // MAXIMUM - visionary leader
      dramaticFlair: 80,
      needForRecognition: 75,
      pride: 85,
      loyalty: 80,
      
      // JUPITER DOMINANCE
      visionaryThinking: 95,    // Sees big picture
      expansiveness: 90,        // Thinks/acts BIG
      teachingAbility: 85,      // Shares vision
      culturalImpact: 90,       // Influences society
      
      // BEHAVIORAL
      speed: 95,               // Very fast
      independence: 90,        // Very high
      patience: 30,            // Very low
      stubbornness: 70,        // Medium-high
      riskTolerance: 95        // Very high (fearless)
    },
    
    strengths: [
      "Visionary leader of movements",
      "Fearless creative pioneer",
      "Inspires cultural change",
      "Teaches through example",
      "Unstoppable confidence"
    ],
    
    challenges: [
      "Overestimates abilities",
      "Can be arrogant",
      "Impatient with followers",
      "Scattered by too many visions",
      "Difficulty with details"
    ],
    
    famousExamples: [
      { name: "Napoleon Bonaparte", degree: 16.24, note: "Visionary leader, cultural impact" },
      { name: "Whitney Houston", degree: 18.53, note: "Bold vocal performance" }
    ],
    
    colorTheme: {
      primary: "#DC143C",    // Crimson
      secondary: "#B22222",  // Fire Brick
      gradient: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)"
    }
  },

  {
    id: 5,
    name: "The Dignified Performer",
    degreeRange: { start: 20, end: 24.99 },
    description: "Leo-Aries blend: Creative expression meets warrior courage",
    
    elementalMix: {
      fire: 85,
      martianFire: 15  // Aries fighting spirit
    },
    
    planetaryRulers: {
      primary: { planet: "Sun", influence: 70, meaning: "Creative identity" },
      secondary: { planet: "Mars", influence: 30, meaning: "Warrior courage, action" }
    },
    
    qualities: {
      creativity: 85,
      charisma: 85,
      confidence: 95,
      generosity: 80,
      leadership: 90,           // Commanding presence
      dramaticFlair: 90,
      needForRecognition: 85,
      pride: 90,               // Cannot tolerate disrespect
      loyalty: 90,
      
      // ARIES INFLUENCE
      courage: 95,             // Fearless performer
      competitiveness: 85,     // Must be #1
      directness: 80,          // No games
      pioneering: 75,          // First to try
      
      // BEHAVIORAL
      speed: 90,               // Very fast
      independence: 85,        // High
      patience: 35,            // Low
      stubbornness: 85,        // High
      riskTolerance: 85        // High (courage + confidence)
    },
    
    strengths: [
      "Courageous creative pioneer",
      "Direct leadership style",
      "Fights for creative vision",
      "Inspires through bravery",
      "Competitive excellence"
    ],
    
    challenges: [
      "Combative when challenged",
      "Must win at all costs",
      "Impatient with process",
      "Can be aggressive",
      "Difficulty compromising"
    ],
    
    famousExamples: [
      { name: "Bill Clinton", degree: 20.24, note: "Charismatic fighter" },
      { name: "Jacqueline Kennedy", degree: 22.03, note: "Dignified courage" }
    ],
    
    colorTheme: {
      primary: "#CD5C5C",    // Indian Red
      secondary: "#8B0000",  // Dark Red
      gradient: "linear-gradient(135deg, #CD5C5C 0%, #8B0000 100%)"
    }
  },

  {
    id: 6,
    name: "The Perfectionist Star",
    degreeRange: { start: 25, end: 29.99 },
    description: "Leo-Virgo cusp: Creative expression meets analytical precision",
    
    elementalMix: {
      fire: 75,
      earth: 25  // Virgo analytical grounding
    },
    
    planetaryRulers: {
      primary: { planet: "Sun", influence: 70, meaning: "Creative identity" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Analytical perfection" }
    },
    
    qualities: {
      creativity: 90,
      charisma: 85,
      confidence: 80,           // Slightly tempered by analysis
      generosity: 85,
      leadership: 85,
      dramaticFlair: 75,        // More restrained
      needForRecognition: 80,
      pride: 85,
      loyalty: 95,              // Very loyal
      
      // VIRGO INFLUENCE
      perfectionism: 90,        // Everything must be flawless
      analyticalThinking: 80,   // Thinks through performance
      attention: 90,            // Notices every detail
      serviceOrientation: 70,   // Serves through excellence
      
      // BEHAVIORAL
      speed: 75,               // Medium-fast (Earth slows Fire)
      independence: 70,        // Medium-high
      patience: 55,            // Medium (more than pure Leo)
      stubbornness: 80,        // High
      riskTolerance: 55        // Medium (analysis creates caution)
    },
    
    strengths: [
      "Perfects creative craft",
      "Analytical performance",
      "Reliable excellence",
      "Serves through quality",
      "Combines vision with precision"
    ],
    
    challenges: [
      "Overly critical of self/others",
      "Perfectionism delays creation",
      "Anxious about imperfection",
      "Can be controlling",
      "Struggles with spontaneity"
    ],
    
    famousExamples: [
      { name: "Mother Teresa", degree: 26.55, note: "Service through disciplined compassion" },
      { name: "Sean Connery", degree: 27.18, note: "Perfected craft of performance" }
    ],
    
    colorTheme: {
      primary: "#DAA520",    // Goldenrod
      secondary: "#B8860B",  // Dark Goldenrod
      gradient: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)"
    }
  }
];

export const getLeoZoneByDegree = (degree) => {
  return leoZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default leoZones;
