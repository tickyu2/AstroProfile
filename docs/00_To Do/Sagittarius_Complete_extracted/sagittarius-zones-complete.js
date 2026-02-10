// SAGITTARIUS ZONES - COMPLETE IMPLEMENTATION
// Fire Sign: Adventurous, philosophical, optimistic, freedom-loving
// Ruled by Jupiter: Expansion, wisdom, optimism, adventure, luck

export const sagittariusZones = [
  {
    id: 1,
    name: "The Philosophical Transformer",
    degreeRange: { start: 0, end: 4.99 },
    description: "Scorpio-Sagittarius Cusp: Deep intensity meets expansive optimism",
    
    // Elemental Influence
    elementalMix: {
      fire: 75,     // Sagittarius adventurous spirit
      water: 25     // Scorpio emotional depth
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Jupiter", influence: 75, meaning: "Expansive wisdom" },
      secondary: { planet: "Pluto", influence: 15, meaning: "Transformative depth" },
      tertiary: { planet: "Mars", influence: 10, meaning: "Warrior courage" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // SAGITTARIUS CORE TRAITS
      adventurousness: 85,
      philosophicalDepth: 90,
      optimism: 80,
      honesty: 85,
      freedomLove: 80,
      restlessness: 80,
      teachingAbility: 85,
      bigPictureThinking: 85,
      tactlessness: 75,
      
      // SCORPIO CUSP INFLUENCE
      emotionalDepth: 65,           // Higher than pure Sag
      intensity: 70,                // Passionate about truth
      psychologicalInsight: 75,     // Deep understanding
      loyalty: 70,                  // More loyal than pure Sag
      
      // BEHAVIORAL
      speed: 80,                    // Fast (Fire + restless)
      independence: 90,             // Very high (freedom essential)
      patience: 50,                 // Medium-low
      stubbornness: 65,             // Medium-high (philosophical convictions)
      riskTolerance: 85             // Very high (fearless explorer)
    },
    
    strengths: [
      "Deep philosophical wisdom",
      "Transforms through adventure",
      "Passionate truth-seeking",
      "Loyal to philosophical mission",
      "Combines depth with expansion"
    ],
    
    challenges: [
      "Preachy about transformation",
      "Intense philosophical debates",
      "Commitment issues with depth work",
      "Blunt about psychological truths",
      "Restless even in meaningful work"
    ],
    
    famousExamples: [
      { name: "Bruce Lee", degree: 2.13, note: "Philosophical martial artist" },
      { name: "Jimi Hendrix", degree: 4.27, note: "Transformative musical exploration" }
    ],
    
    colorTheme: {
      primary: "#9B59B6",    // Amethyst
      secondary: "#8E44AD",  // Wisteria
      gradient: "linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Explorer",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Sagittarius: Maximum adventure, optimism, and philosophical freedom",
    
    elementalMix: {
      fire: 100     // Pure fire element
    },
    
    planetaryRulers: {
      primary: { planet: "Jupiter", influence: 100, meaning: "Pure Jupiterian energy - expansion, wisdom, luck, adventure" }
    },
    
    qualities: {
      // MAXIMUM SAGITTARIUS EXPRESSION
      adventurousness: 100,      // Must explore everything
      philosophicalDepth: 100,   // Ultimate truth-seeker
      optimism: 100,            // Boundless enthusiasm
      honesty: 100,             // Brutally truthful
      freedomLove: 100,         // Cannot be caged
      restlessness: 100,        // Never settles
      teachingAbility: 100,     // Born professor
      bigPictureThinking: 100,  // Sees grand vision
      tactlessness: 95,         // Foot-in-mouth disease
      
      // PURE JUPITER QUALITIES
      expansion: 100,           // Always growing
      generosity: 95,           // Gives abundantly
      luck: 90,                 // Fortune favors
      exaggeration: 90,         // Everything is HUGE
      
      // BEHAVIORAL
      speed: 95,                // Very fast (Fire + Mutable)
      independence: 95,         // Extremely high
      patience: 30,             // Very low (wants it NOW)
      stubbornness: 60,         // Medium (flexible but principled)
      riskTolerance: 95         // Extremely high (fearless)
    },
    
    strengths: [
      "Infinite optimism and enthusiasm",
      "Visionary philosophical insights",
      "Inspires through adventure",
      "Generosity of spirit",
      "Finds truth through exploration"
    ],
    
    challenges: [
      "Cannot commit to anything",
      "Brutally tactless honesty",
      "Overcommits and disappears",
      "Misses details completely",
      "Restless even when happy"
    ],
    
    famousExamples: [
      { name: "Brad Pitt", degree: 6.51, note: "Adventurous, freedom-loving, philosophical" },
      { name: "Taylor Swift", degree: 8.46, note: "Optimistic storytelling, adventurous creativity" }
    ],
    
    colorTheme: {
      primary: "#E67E22",    // Carrot Orange
      secondary: "#D35400",  // Pumpkin
      gradient: "linear-gradient(135deg, #E67E22 0%, #D35400 100%)"
    }
  },

  {
    id: 3,
    name: "The Visionary Leader",
    degreeRange: { start: 10, end: 14.99 },
    description: "Sagittarius-Aries blend: Philosophical expansion meets pioneering action",
    
    elementalMix: {
      fire: 85,
      martianFire: 15   // Aries warrior energy
    },
    
    planetaryRulers: {
      primary: { planet: "Jupiter", influence: 70, meaning: "Expansive vision" },
      secondary: { planet: "Mars", influence: 30, meaning: "Warrior action, courage" }
    },
    
    qualities: {
      adventurousness: 95,
      philosophicalDepth: 85,
      optimism: 95,
      honesty: 90,
      freedomLove: 95,
      restlessness: 95,
      teachingAbility: 85,
      bigPictureThinking: 90,
      tactlessness: 85,
      
      // ARIES INFLUENCE
      courage: 95,              // Fearless action
      pioneering: 90,           // First to explore
      competitiveness: 75,      // Wins at adventure
      directness: 95,           // Brutally direct
      
      // BEHAVIORAL
      speed: 100,               // MAXIMUM (double fire)
      independence: 95,         // Extremely high
      patience: 25,             // Very low
      stubbornness: 70,         // Medium-high
      riskTolerance: 100        // MAXIMUM (fearless)
    },
    
    strengths: [
      "Fearless visionary action",
      "Pioneers new philosophies",
      "Inspires through courage",
      "Direct honest leadership",
      "Conquers new frontiers"
    ],
    
    challenges: [
      "Recklessly impulsive",
      "Aggressive about beliefs",
      "Starts everything, finishes nothing",
      "Combative philosophical debates",
      "Cannot tolerate opposition"
    ],
    
    famousExamples: [
      { name: "Steven Spielberg", degree: 11.37, note: "Visionary pioneering filmmaker" },
      { name: "Billie Eilish", degree: 13.42, note: "Pioneering musical vision" }
    ],
    
    colorTheme: {
      primary: "#E74C3C",    // Alizarin
      secondary: "#C0392B",  // Pomegranate
      gradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)"
    }
  },

  {
    id: 4,
    name: "The Revolutionary Teacher",
    degreeRange: { start: 15, end: 19.99 },
    description: "Sagittarius-Aries decan: Peak fire energy - visionary wisdom meets warrior spirit",
    
    elementalMix: {
      fire: 70,
      martianFire: 30   // Strong Aries
    },
    
    planetaryRulers: {
      primary: { planet: "Jupiter", influence: 60, meaning: "Expansive teaching" },
      secondary: { planet: "Mars", influence: 40, meaning: "Revolutionary action" }
    },
    
    qualities: {
      adventurousness: 90,
      philosophicalDepth: 95,
      optimism: 90,
      honesty: 95,
      freedomLove: 100,         // MAXIMUM freedom
      restlessness: 90,
      teachingAbility: 100,     // MAXIMUM teaching
      bigPictureThinking: 95,
      tactlessness: 90,
      
      // MARS DOMINANCE
      revolutionarySpirit: 95,  // Changes paradigms
      warriorTeaching: 90,      // Fights for truth
      culturalImpact: 90,       // Transforms society
      fearlessness: 100,        // MAXIMUM courage
      
      // BEHAVIORAL
      speed: 95,                // Very fast
      independence: 100,        // MAXIMUM
      patience: 20,             // Very low
      stubbornness: 75,         // High (mission-driven)
      riskTolerance: 100        // MAXIMUM
    },
    
    strengths: [
      "Revolutionary philosophical vision",
      "Fearless truth warrior",
      "Transforms cultural thinking",
      "Inspires mass movements",
      "Ultimate freedom fighter"
    ],
    
    challenges: [
      "Reckless revolutionary action",
      "Preachy warrior complex",
      "Cannot tolerate disagreement",
      "Overestimates abilities",
      "Burns out from intensity"
    ],
    
    famousExamples: [
      { name: "Jane Fonda", degree: 16.23, note: "Revolutionary activist teacher" },
      { name: "Jay-Z", degree: 18.15, note: "Cultural revolutionary vision" }
    ],
    
    colorTheme: {
      primary: "#FF6347",    // Tomato
      secondary: "#DC143C",  // Crimson
      gradient: "linear-gradient(135deg, #FF6347 0%, #DC143C 100%)"
    }
  },

  {
    id: 5,
    name: "The Wild Optimist",
    degreeRange: { start: 20, end: 24.99 },
    description: "Sagittarius-Leo blend: Philosophical adventure meets creative expression",
    
    elementalMix: {
      fire: 85,
      solarFire: 15     // Leo creative confidence
    },
    
    planetaryRulers: {
      primary: { planet: "Jupiter", influence: 70, meaning: "Expansive optimism" },
      secondary: { planet: "Sun", influence: 30, meaning: "Creative self-expression" }
    },
    
    qualities: {
      adventurousness: 90,
      philosophicalDepth: 80,
      optimism: 100,            // MAXIMUM (Jupiter + Sun)
      honesty: 85,
      freedomLove: 90,
      restlessness: 85,
      teachingAbility: 90,
      bigPictureThinking: 85,
      tactlessness: 80,
      
      // LEO INFLUENCE
      creativity: 85,           // Creative philosophy
      charisma: 90,            // Magnetic teacher
      generosity: 100,         // MAXIMUM giving
      confidence: 90,          // Unshakeable
      
      // BEHAVIORAL
      speed: 90,               // Very fast
      independence: 85,        // High (but enjoys audience)
      patience: 35,            // Low
      stubbornness: 65,        // Medium-high
      riskTolerance: 90        // Very high
    },
    
    strengths: [
      "Boundless optimistic energy",
      "Charismatic inspiring teacher",
      "Generously shares wisdom",
      "Creative philosophical vision",
      "Joyful adventurous spirit"
    ],
    
    challenges: [
      "Overestimates everything",
      "Needs constant admiration",
      "Dramatic exaggeration",
      "Cannot handle criticism",
      "Commits then flees"
    ],
    
    famousExamples: [
      { name: "Samuel L. Jackson", degree: 21.36, note: "Charismatic bold presence" },
      { name: "Christina Aguilera", degree: 23.18, note: "Bold creative expression" }
    ],
    
    colorTheme: {
      primary: "#F39C12",    // Orange
      secondary: "#F1C40F",  // Sun Flower
      gradient: "linear-gradient(135deg, #F39C12 0%, #F1C40F 100%)"
    }
  },

  {
    id: 6,
    name: "The Ambitious Explorer",
    degreeRange: { start: 25, end: 29.99 },
    description: "Sagittarius-Capricorn cusp: Adventurous vision meets strategic ambition",
    
    elementalMix: {
      fire: 75,
      earth: 25     // Capricorn grounding
    },
    
    planetaryRulers: {
      primary: { planet: "Jupiter", influence: 70, meaning: "Expansive vision" },
      secondary: { planet: "Saturn", influence: 30, meaning: "Strategic discipline" }
    },
    
    qualities: {
      adventurousness: 80,
      philosophicalDepth: 85,
      optimism: 75,             // Tempered by Saturn
      honesty: 90,
      freedomLove: 80,          // Balanced with ambition
      restlessness: 70,         // More grounded
      teachingAbility: 85,
      bigPictureThinking: 90,
      tactlessness: 80,
      
      // CAPRICORN INFLUENCE
      ambition: 85,             // Strategic goals
      discipline: 70,           // More focused
      responsibility: 65,       // Takes commitments seriously
      strategicThinking: 80,    // Plans adventures
      
      // BEHAVIORAL
      speed: 75,                // Medium-fast (Earth slows Fire)
      independence: 80,         // High
      patience: 60,             // Medium (Saturn helps)
      stubbornness: 80,         // High
      riskTolerance: 70         // Medium-high (calculated)
    },
    
    strengths: [
      "Strategic visionary planning",
      "Disciplined adventure pursuit",
      "Builds philosophical empires",
      "Balances freedom with achievement",
      "Responsible truth-seeking"
    ],
    
    challenges: [
      "Workaholism in exploration",
      "Pragmatic dampens enthusiasm",
      "Control issues with freedom",
      "Judgmental about laziness",
      "Cannot purely enjoy (always goal-oriented)"
    ],
    
    famousExamples: [
      { name: "Woody Allen", degree: 26.05, note: "Philosophical filmmaker with disciplined output" },
      { name: "Sia", degree: 27.48, note: "Strategic creative vision" }
    ],
    
    colorTheme: {
      primary: "#D4A017",    // Metallic Gold
      secondary: "#B8860B",  // Dark Goldenrod
      gradient: "linear-gradient(135deg, #D4A017 0%, #B8860B 100%)"
    }
  }
];

export const getSagittariusZoneByDegree = (degree) => {
  return sagittariusZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default sagittariusZones;
