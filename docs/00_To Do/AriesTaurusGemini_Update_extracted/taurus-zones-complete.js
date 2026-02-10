// TAURUS ZONES - COMPLETE IMPLEMENTATION (UPDATED TO MATCH EVOLVED STRUCTURE)
// Earth Sign: Grounded, sensory, practical, possessive, persistent
// Ruled by Venus: Beauty, pleasure, material comfort, values

export const taurusZones = [
  {
    id: 1,
    name: "The Determined Builder",
    degreeRange: { start: 0, end: 4.99 },
    description: "Aries-Taurus Cusp: Pioneering action meets grounded manifestation",
    
    // Elemental Influence
    elementalMix: {
      earth: 75,    // Taurus grounding
      fire: 25      // Aries initiative
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Venus", influence: 75, meaning: "Material beauty, sensory pleasure" },
      secondary: { planet: "Mars", influence: 25, meaning: "Initiating action, courage" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // TAURUS CORE TRAITS
      practicalSkills: 90,
      sensoryAwareness: 90,
      patience: 85,
      loyalty: 85,
      stubbornness: 90,
      materialFocus: 85,
      aestheticSense: 90,
      possessiveness: 80,
      reliability: 90,
      
      // ARIES CUSP INFLUENCE
      courage: 70,               // More courageous than pure Taurus
      impulsivity: 55,           // Some spontaneity
      pioneering: 65,            // Initiates practically
      independence: 75,          // Higher independence
      
      // BEHAVIORAL
      speed: 70,                 // Medium-fast (Fire speeds Earth)
      independence: 75,          // Medium-high
      patience: 85,              // Very high
      stubbornness: 90,          // Very high
      riskTolerance: 55          // Medium (calculated risks)
    },
    
    strengths: [
      "Courageously manifests vision",
      "Determined persistent builder",
      "Takes action on practical goals",
      "Independent yet grounded",
      "Initiates with follow-through"
    ],
    
    challenges: [
      "Impulsively stubborn",
      "Possessive of initiatives",
      "Aggressive about comfort",
      "Difficulty compromising",
      "Hot-tempered when pushed"
    ],
    
    famousExamples: [
      { name: "David Beckham", degree: 1.48, note: "Determined athletic builder" },
      { name: "Dwayne 'The Rock' Johnson", degree: 3.15, note: "Courageous persistent success" }
    ],
    
    colorTheme: {
      primary: "#8B4513",    // Saddle Brown
      secondary: "#A0522D",  // Sienna
      gradient: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)"
    }
  },

  {
    id: 2,
    name: "The Sensory Master",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Taurus: Maximum groundedness, sensory awareness, and material mastery",
    
    elementalMix: {
      earth: 100    // Pure earth element
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 100, meaning: "Pure Venusian energy - beauty, pleasure, material comfort, values" }
    },
    
    qualities: {
      // MAXIMUM TAURUS EXPRESSION
      practicalSkills: 100,      // MAXIMUM - master craftsperson
      sensoryAwareness: 100,     // MAXIMUM - exquisite taste
      patience: 100,             // MAXIMUM - infinite persistence
      loyalty: 100,              // MAXIMUM - unmovable devotion
      stubbornness: 100,         // MAXIMUM - absolutely immovable
      materialFocus: 100,        // MAXIMUM - masters physical world
      aestheticSense: 100,       // MAXIMUM - perfect taste
      possessiveness: 95,        // Extreme ownership
      reliability: 100,          // MAXIMUM - never fails
      
      // PURE VENUS-EARTH QUALITIES
      sensualPleasure: 100,      // Ultimate hedonist
      qualityAppreciation: 100,  // Knows finest things
      resourceAccumulation: 100, // Builds wealth methodically
      groundedness: 100,         // Most stable sign
      
      // BEHAVIORAL
      speed: 50,                 // Slow (methodical thoroughness)
      independence: 70,          // Medium-high (self-sufficient)
      patience: 100,             // MAXIMUM
      stubbornness: 100,         // MAXIMUM
      riskTolerance: 25          // Very low (conservative security)
    },
    
    strengths: [
      "Masters material world completely",
      "Exquisite sensory refinement",
      "Infinite patient persistence",
      "Absolutely reliable and loyal",
      "Creates lasting beauty and wealth"
    ],
    
    challenges: [
      "Impossibly stubborn - cannot change",
      "Possessive to point of controlling",
      "Hedonistic material obsession",
      "Lazy when comfortable",
      "Explosive rage when pushed"
    ],
    
    famousExamples: [
      { name: "Adele", degree: 6.42, note: "Sensory vocal mastery, loyal" },
      { name: "Cher", degree: 8.15, note: "Material beauty, persistent longevity" }
    ],
    
    colorTheme: {
      primary: "#228B22",    // Forest Green
      secondary: "#006400",  // Dark Green
      gradient: "linear-gradient(135deg, #228B22 0%, #006400 100%)"
    }
  },

  {
    id: 3,
    name: "The Practical Perfectionist",
    degreeRange: { start: 10, end: 14.99 },
    description: "Taurus-Virgo blend: Material mastery meets analytical precision",
    
    elementalMix: {
      earth: 85,
      mercurialEarth: 15  // Virgo analytical precision
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Material beauty" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Analytical precision, skill" }
    },
    
    qualities: {
      practicalSkills: 100,      // MAXIMUM (Venus + Mercury)
      sensoryAwareness: 95,
      patience: 100,             // MAXIMUM (double earth)
      loyalty: 95,
      stubbornness: 95,
      materialFocus: 90,
      aestheticSense: 90,
      possessiveness: 80,
      reliability: 100,          // MAXIMUM
      
      // VIRGO INFLUENCE
      analyticalThinking: 85,    // Analyzes quality
      perfectionism: 90,         // Perfect craftsmanship
      attentionToDetail: 95,     // Notices flaws
      criticalThinking: 80,      // Discerns quality
      
      // BEHAVIORAL
      speed: 55,                 // Slow (double earth)
      independence: 75,          // Medium-high
      patience: 100,             // MAXIMUM
      stubbornness: 100,         // MAXIMUM (double earth)
      riskTolerance: 20          // Very low (analyzes all risks)
    },
    
    strengths: [
      "Perfects material craft",
      "Analytical quality mastery",
      "Patient meticulous builder",
      "Reliable precise execution",
      "Creates flawless beauty"
    ],
    
    challenges: [
      "Perfectionist paralysis",
      "Impossibly stubborn standards",
      "Critical of imperfection",
      "Slow methodical process",
      "Cannot tolerate waste"
    ],
    
    famousExamples: [
      { name: "Mark Zuckerberg", degree: 11.23, note: "Analytical practical builder" },
      { name: "Megan Fox", degree: 13.05, note: "Perfectionist aesthetic precision" }
    ],
    
    colorTheme: {
      primary: "#556B2F",    // Dark Olive Green
      secondary: "#6B8E23",  // Olive Drab
      gradient: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)"
    }
  },

  {
    id: 4,
    name: "The Wealth Builder",
    degreeRange: { start: 15, end: 19.99 },
    description: "Taurus-Capricorn blend: Sensory pleasure meets strategic ambition",
    
    elementalMix: {
      earth: 70,
      saturnianEarth: 30  // Capricorn strategic discipline
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 60, meaning: "Material comfort" },
      secondary: { planet: "Saturn", influence: 40, meaning: "Strategic accumulation, mastery" }
    },
    
    qualities: {
      practicalSkills: 95,
      sensoryAwareness: 85,
      patience: 100,             // MAXIMUM (Earth + Saturn)
      loyalty: 90,
      stubbornness: 95,
      materialFocus: 100,        // MAXIMUM (wealth obsessed)
      aestheticSense: 80,
      possessiveness: 90,
      reliability: 100,          // MAXIMUM
      
      // CAPRICORN INFLUENCE
      strategicThinking: 90,     // Strategic accumulation
      ambition: 90,              // Climbs through wealth
      discipline: 85,            // Controlled accumulation
      statusConsciousness: 85,   // Material status
      
      // BEHAVIORAL
      speed: 50,                 // Slow (methodical empire building)
      independence: 80,          // High (self-made)
      patience: 100,             // MAXIMUM
      stubbornness: 95,          // Extremely high
      riskTolerance: 30          // Low (protects wealth)
    },
    
    strengths: [
      "Builds generational wealth",
      "Strategic material mastery",
      "Patient methodical accumulation",
      "Disciplined sensory pleasure",
      "Creates lasting empire"
    ],
    
    challenges: [
      "Ruthlessly materialistic",
      "Hoards resources",
      "Uses people for wealth",
      "Workaholic accumulation",
      "Never satisfied with enough"
    ],
    
    famousExamples: [
      { name: "George Clooney", degree: 16.29, note: "Strategic wealth builder" },
      { name: "Gigi Hadid", degree: 18.05, note: "Disciplined material success" }
    ],
    
    colorTheme: {
      primary: "#2F4F2F",    // Dark Slate Gray
      secondary: "#3C5A3C",  // Hunter Green
      gradient: "linear-gradient(135deg, #2F4F2F 0%, #3C5A3C 100%)"
    }
  },

  {
    id: 5,
    name: "The Loyal Nurturer",
    degreeRange: { start: 20, end: 24.99 },
    description: "Taurus-Cancer blend: Material security meets emotional nurturing",
    
    elementalMix: {
      earth: 75,
      water: 25      // Cancer emotional nurturing
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Material comfort" },
      secondary: { planet: "Moon", influence: 30, meaning: "Emotional nurturing, home" }
    },
    
    qualities: {
      practicalSkills: 90,
      sensoryAwareness: 90,
      patience: 100,             // MAXIMUM
      loyalty: 100,              // MAXIMUM (Venus + Moon)
      stubbornness: 90,
      materialFocus: 85,
      aestheticSense: 85,
      possessiveness: 95,        // Very high (protects loved ones)
      reliability: 100,          // MAXIMUM
      
      // CANCER INFLUENCE
      nurturingInstinct: 90,     // Nurtures through comfort
      emotionalDepth: 75,        // Feeling grounding
      protectiveness: 90,        // Fiercely protective
      homeOrientation: 95,       // Home is sanctuary
      
      // BEHAVIORAL
      speed: 55,                 // Slow
      independence: 60,          // Medium (needs family)
      patience: 100,             // MAXIMUM
      stubbornness: 95,          // Extremely high
      riskTolerance: 30          // Low (protects security)
    },
    
    strengths: [
      "Nurtures through material comfort",
      "Creates beautiful safe homes",
      "Fiercely loyal protector",
      "Patient emotional grounding",
      "Reliable family foundation"
    ],
    
    challenges: [
      "Smotheringly possessive",
      "Hoards for emotional security",
      "Stubborn about family ways",
      "Difficulty letting go",
      "Materialistic nurturing"
    ],
    
    famousExamples: [
      { name: "Pierce Brosnan", degree: 21.15, note: "Loyal nurturing presence" },
      { name: "Penélope Cruz", degree: 23.42, note: "Sensory emotional artistry" }
    ],
    
    colorTheme: {
      primary: "#8FBC8F",    // Dark Sea Green
      secondary: "#90EE90",  // Light Green
      gradient: "linear-gradient(135deg, #8FBC8F 0%, #90EE90 100%)"
    }
  },

  {
    id: 6,
    name: "The Versatile Builder",
    degreeRange: { start: 25, end: 29.99 },
    description: "Taurus-Gemini cusp: Material mastery meets mental agility",
    
    elementalMix: {
      earth: 75,
      air: 25       // Gemini mental versatility
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Material beauty" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Communication, versatility" }
    },
    
    qualities: {
      practicalSkills: 90,
      sensoryAwareness: 85,
      patience: 80,              // Lower than pure Taurus
      loyalty: 75,               // More flexible
      stubbornness: 75,          // Less rigid
      materialFocus: 80,
      aestheticSense: 90,
      possessiveness: 70,        // Less possessive
      reliability: 85,
      
      // GEMINI INFLUENCE
      communication: 85,         // Articulates values
      versatility: 75,           // More adaptable
      curiosity: 70,             // Explores ideas
      mentalAgility: 80,         // Quick thinking
      
      // BEHAVIORAL
      speed: 65,                 // Medium (Air speeds Earth)
      independence: 75,          // Medium-high
      patience: 80,              // High
      stubbornness: 75,          // High but flexible
      riskTolerance: 40          // Low-medium
    },
    
    strengths: [
      "Communicates practical wisdom",
      "Versatile material skills",
      "Articulates values clearly",
      "Adapts while staying grounded",
      "Balances security with exploration"
    ],
    
    challenges: [
      "Scattered material focus",
      "Less committed than pure Taurus",
      "Rationalizes indulgence",
      "Difficulty with depth",
      "Wants both security and variety"
    ],
    
    famousExamples: [
      { name: "Bing Crosby", degree: 26.05, note: "Versatile practical artistry" },
      { name: "Tina Fey", degree: 27.18, note: "Smart grounded communication" }
    ],
    
    colorTheme: {
      primary: "#9ACD32",    // Yellow Green
      secondary: "#ADFF2F",  // Green Yellow
      gradient: "linear-gradient(135deg, #9ACD32 0%, #ADFF2F 100%)"
    }
  }
];

export const getTaurusZoneByDegree = (degree) => {
  return taurusZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default taurusZones;
