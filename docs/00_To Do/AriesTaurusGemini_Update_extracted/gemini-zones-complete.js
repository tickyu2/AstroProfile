// GEMINI ZONES - COMPLETE IMPLEMENTATION (UPDATED TO MATCH EVOLVED STRUCTURE)
// Air Sign: Communicative, versatile, curious, dual-natured
// Ruled by Mercury: Communication, intellect, information, adaptability

export const geminiZones = [
  {
    id: 1,
    name: "The Practical Communicator",
    degreeRange: { start: 0, end: 4.99 },
    description: "Taurus-Gemini Cusp: Material grounding meets mental agility",
    
    // Elemental Influence
    elementalMix: {
      air: 75,      // Gemini mental agility
      earth: 25     // Taurus practical grounding
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 75, meaning: "Communication, intellect, versatility" },
      secondary: { planet: "Venus", influence: 25, meaning: "Material values, aesthetic sense" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // GEMINI CORE TRAITS
      communication: 95,
      versatility: 90,
      curiosity: 90,
      adaptability: 90,
      intellectualAgility: 95,
      duality: 85,
      socialSkill: 90,
      restlessness: 80,
      superficiality: 70,
      
      // TAURUS CUSP INFLUENCE
      practicalSkills: 70,       // More grounded than pure Gemini
      sensoryAwareness: 65,      // Some material focus
      patience: 60,              // More patient
      loyalty: 65,               // More committed
      
      // BEHAVIORAL
      speed: 85,                 // Fast but grounded
      independence: 75,          // Medium-high
      patience: 60,              // Medium
      stubbornness: 60,          // Medium (ideas + values)
      riskTolerance: 55          // Medium
    },
    
    strengths: [
      "Articulates practical wisdom",
      "Grounded mental agility",
      "Communicates values clearly",
      "Versatile with follow-through",
      "Balances ideas with execution"
    ],
    
    challenges: [
      "Rationalizes material desires",
      "Stubborn about ideas",
      "Scattered between thinking/doing",
      "Difficulty with pure abstraction",
      "Possessive of information"
    ],
    
    famousExamples: [
      { name: "Clint Eastwood", degree: 1.23, note: "Practical versatile mastery" },
      { name: "Brooke Shields", degree: 3.42, note: "Articulate grounded presence" }
    ],
    
    colorTheme: {
      primary: "#FFD700",    // Gold
      secondary: "#FFA500",  // Orange
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Communicator",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Gemini: Maximum versatility, communication, and mental agility",
    
    elementalMix: {
      air: 100      // Pure air element
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 100, meaning: "Pure Mercurial energy - communication, intellect, speed, duality" }
    },
    
    qualities: {
      // MAXIMUM GEMINI EXPRESSION
      communication: 100,        // MAXIMUM - talks constantly
      versatility: 100,          // MAXIMUM - adapts to anything
      curiosity: 100,            // MAXIMUM - must know everything
      adaptability: 100,         // MAXIMUM - changes instantly
      intellectualAgility: 100,  // MAXIMUM - lightning quick mind
      duality: 100,              // MAXIMUM - twin personalities
      socialSkill: 100,          // MAXIMUM - charms everyone
      restlessness: 100,         // MAXIMUM - never still
      superficiality: 95,        // Very high (surface level)
      
      // PURE MERCURY QUALITIES
      informationProcessing: 100, // Processes data instantly
      networking: 100,           // Connects everyone
      wit: 100,                  // Ultimate cleverness
      multitasking: 100,         // Juggles infinite balls
      
      // BEHAVIORAL
      speed: 100,                // MAXIMUM (lightning thought)
      independence: 80,          // High (but needs social)
      patience: 20,              // Very low (bored instantly)
      stubbornness: 30,          // Very low (changes constantly)
      riskTolerance: 60          // Medium-high (curious risk)
    },
    
    strengths: [
      "Communicates anything to anyone",
      "Infinitely versatile and adaptable",
      "Learns and teaches everything",
      "Networks entire universes",
      "Ultimate mental agility"
    ],
    
    challenges: [
      "Completely superficial",
      "Cannot commit to anything",
      "Scattered across infinite interests",
      "Exhausts others with talking",
      "No depth or follow-through"
    ],
    
    famousExamples: [
      { name: "Marilyn Monroe", degree: 6.07, note: "Dual nature, versatile charm" },
      { name: "Stevie Nicks", degree: 8.23, note: "Communicative mystical duality" }
    ],
    
    colorTheme: {
      primary: "#00CED1",    // Dark Turquoise
      secondary: "#48D1CC",  // Medium Turquoise
      gradient: "linear-gradient(135deg, #00CED1 0%, #48D1CC 100%)"
    }
  },

  {
    id: 3,
    name: "The Balanced Diplomat",
    degreeRange: { start: 10, end: 14.99 },
    description: "Gemini-Libra blend: Mental agility meets harmonious balance",
    
    elementalMix: {
      air: 85,
      venusianAir: 15  // Libra harmonious balance
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Mental communication" },
      secondary: { planet: "Venus", influence: 30, meaning: "Harmonious diplomacy, aesthetic balance" }
    },
    
    qualities: {
      communication: 95,
      versatility: 90,
      curiosity: 85,
      adaptability: 90,
      intellectualAgility: 90,
      duality: 80,
      socialSkill: 100,          // MAXIMUM (Mercury + Venus)
      restlessness: 75,
      superficiality: 75,
      
      // LIBRA INFLUENCE
      diplomacy: 90,             // Tactful communication
      aestheticSense: 80,        // Beautiful ideas
      balanceSeeking: 80,        // Balanced perspective
      charm: 95,                 // Irresistible social grace
      
      // BEHAVIORAL
      speed: 95,                 // Very fast (double air)
      independence: 70,          // Medium-high (needs partnership)
      patience: 40,              // Low (but considers others)
      stubbornness: 50,          // Medium (seeks balance)
      riskTolerance: 55          // Medium
    },
    
    strengths: [
      "Diplomatic brilliant communication",
      "Charms everyone effortlessly",
      "Balances multiple perspectives",
      "Socially graceful versatility",
      "Creates harmonious connections"
    ],
    
    challenges: [
      "Superficial people-pleasing",
      "Cannot commit (weighs all options)",
      "Scattered social focus",
      "Says what people want to hear",
      "Indecisive mental loops"
    ],
    
    famousExamples: [
      { name: "Angelina Jolie", degree: 11.52, note: "Diplomatic versatile humanitarian" },
      { name: "Paul McCartney", degree: 13.15, note: "Charming musical communicator" }
    ],
    
    colorTheme: {
      primary: "#87CEEB",    // Sky Blue
      secondary: "#B0E0E6",  // Powder Blue
      gradient: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)"
    }
  },

  {
    id: 4,
    name: "The Intellectual Revolutionary",
    degreeRange: { start: 15, end: 19.99 },
    description: "Gemini-Aquarius blend: Mental agility meets revolutionary innovation",
    
    elementalMix: {
      air: 70,
      uranianAir: 30  // Aquarius revolutionary thinking
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 60, meaning: "Information processing" },
      secondary: { planet: "Uranus", influence: 40, meaning: "Revolutionary ideas, innovation" }
    },
    
    qualities: {
      communication: 90,
      versatility: 95,
      curiosity: 95,
      adaptability: 85,
      intellectualAgility: 95,
      duality: 75,
      socialSkill: 85,
      restlessness: 90,
      superficiality: 60,        // Less superficial (depth of ideas)
      
      // AQUARIUS INFLUENCE
      revolutionaryThinking: 90, // Innovates ideas
      intellectualDepth: 85,     // Abstract thinking
      innovation: 90,            // Breakthrough ideas
      humanitarianism: 75,       // Shares knowledge freely
      
      // BEHAVIORAL
      speed: 100,                // MAXIMUM (double air genius)
      independence: 90,          // Very high (intellectual freedom)
      patience: 30,              // Low (impatient with old ideas)
      stubbornness: 65,          // Medium-high (principled ideas)
      riskTolerance: 75          // High (intellectual courage)
    },
    
    strengths: [
      "Revolutionary idea generation",
      "Networks innovative thinkers",
      "Spreads progressive knowledge",
      "Intellectually brilliant",
      "Adapts to future instantly"
    ],
    
    challenges: [
      "Intellectually arrogant",
      "Detached from emotions",
      "Scattered across revolutions",
      "Cannot execute innovations",
      "Rebels against all tradition"
    ],
    
    famousExamples: [
      { name: "Tupac Shakur", degree: 16.05, note: "Revolutionary communication" },
      { name: "Tom Holland", degree: 18.23, note: "Innovative versatile performance" }
    ],
    
    colorTheme: {
      primary: "#4169E1",    // Royal Blue
      secondary: "#1E90FF",  // Dodger Blue
      gradient: "linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)"
    }
  },

  {
    id: 5,
    name: "The Emotional Messenger",
    degreeRange: { start: 20, end: 24.99 },
    description: "Gemini-Cancer blend: Mental agility meets emotional depth",
    
    elementalMix: {
      air: 75,
      water: 25      // Cancer emotional nurturing
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Communication" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional nurturing, intuition" }
    },
    
    qualities: {
      communication: 90,
      versatility: 85,
      curiosity: 85,
      adaptability: 85,
      intellectualAgility: 85,
      duality: 90,               // High (mind vs feeling)
      socialSkill: 90,
      restlessness: 70,
      superficiality: 65,
      
      // CANCER INFLUENCE
      emotionalDepth: 75,        // Feels while thinking
      intuition: 80,             // Intuitive communication
      nurturingInstinct: 70,     // Nurtures through words
      emotionalMemory: 75,       // Remembers feelings
      
      // BEHAVIORAL
      speed: 80,                 // Fast but emotional
      independence: 65,          // Medium-high (needs family)
      patience: 50,              // Medium (emotional patience)
      stubbornness: 55,          // Medium (emotional attachment)
      riskTolerance: 45          // Low-medium (protective)
    },
    
    strengths: [
      "Communicates emotions articulately",
      "Intuitive understanding of people",
      "Nurtures through conversation",
      "Balances mind and heart",
      "Creates emotional connections"
    ],
    
    challenges: [
      "Mood swings affect communication",
      "Rationalizes feelings",
      "Scattered emotional focus",
      "Difficulty with emotional depth",
      "Talks about feelings vs feeling them"
    ],
    
    famousExamples: [
      { name: "Nicole Kidman", degree: 21.18, note: "Emotional versatile artistry" },
      { name: "Liam Neeson", degree: 23.05, note: "Nurturing protective communication" }
    ],
    
    colorTheme: {
      primary: "#40E0D0",    // Turquoise
      secondary: "#AFEEEE",  // Pale Turquoise
      gradient: "linear-gradient(135deg, #40E0D0 0%, #AFEEEE 100%)"
    }
  },

  {
    id: 6,
    name: "The Expressive Teacher",
    degreeRange: { start: 25, end: 29.99 },
    description: "Gemini-Cancer cusp: Mental communication meets nurturing expression",
    
    elementalMix: {
      air: 75,
      water: 25      // Cancer emotional connection
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Teaching, communication" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional nurturing" }
    },
    
    qualities: {
      communication: 95,
      versatility: 85,
      curiosity: 80,
      adaptability: 80,
      intellectualAgility: 85,
      duality: 85,
      socialSkill: 85,
      restlessness: 70,
      superficiality: 60,
      
      // CANCER INFLUENCE
      teachingAbility: 90,       // Nurturing teacher
      emotionalExpression: 80,   // Expresses feelings
      protectiveness: 70,        // Protective of students
      homeOrientation: 60,       // Creates learning sanctuary
      
      // BEHAVIORAL
      speed: 80,                 // Fast but nurturing
      independence: 65,          // Medium-high
      patience: 55,              // Medium (with learners)
      stubbornness: 60,          // Medium
      riskTolerance: 50          // Medium
    },
    
    strengths: [
      "Nurturing brilliant teacher",
      "Expresses emotions clearly",
      "Creates safe learning spaces",
      "Versatile communication methods",
      "Balances intellect with heart"
    ],
    
    challenges: [
      "Emotional volatility in teaching",
      "Takes criticism personally",
      "Scattered nurturing focus",
      "Difficulty with boundaries",
      "Moody communication"
    ],
    
    famousExamples: [
      { name: "Prince (musician)", degree: 26.07, note: "Expressive versatile teacher" },
      { name: "Mel B", degree: 27.53, note: "Nurturing communicative presence" }
    ],
    
    colorTheme: {
      primary: "#5F9EA0",    // Cadet Blue
      secondary: "#7FFFD4",  // Aquamarine
      gradient: "linear-gradient(135deg, #5F9EA0 0%, #7FFFD4 100%)"
    }
  }
];

export const getGeminiZoneByDegree = (degree) => {
  return geminiZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default geminiZones;
