// VIRGO ZONES - COMPLETE IMPLEMENTATION
// Earth Sign: Analytical, practical, service-oriented, perfectionist
// Ruled by Mercury: Analysis, discernment, detail, communication

export const virgoZones = [
  {
    id: 1,
    name: "The Perfectionist Star",
    degreeRange: { start: 0, end: 4.99 },
    description: "Leo-Virgo Cusp: Creative passion meets analytical precision",
    
    // Elemental Influence
    elementalMix: {
      earth: 75,    // Virgo analytical grounding
      fire: 25      // Leo creative confidence
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 75, meaning: "Analytical precision, detail mastery" },
      secondary: { planet: "Sun", influence: 25, meaning: "Creative confidence, self-expression" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // VIRGO CORE TRAITS
      analyticalThinking: 90,
      attention: 95,
      perfectionism: 95,
      serviceOrientation: 80,
      practicalSkills: 85,
      criticalThinking: 90,
      organization: 90,
      healthConsciousness: 75,
      modesty: 65,              // Lower (Leo influence)
      
      // LEO CUSP INFLUENCE
      creativity: 70,           // Higher than pure Virgo
      confidence: 65,           // More confident
      charisma: 60,            // Some stage presence
      needForRecognition: 70,  // Wants respect for craft
      
      // BEHAVIORAL
      speed: 75,               // Medium-fast (Mercury speed)
      independence: 70,        // Medium-high
      patience: 65,            // Medium (wants perfection NOW)
      stubbornness: 75,        // High (perfectionist standards)
      riskTolerance: 45        // Low-medium (analyzes risks)
    },
    
    strengths: [
      "Combines vision with precision",
      "Confident in analytical abilities",
      "Creates perfect performances",
      "Serves with pride and skill",
      "Balances art and craft"
    ],
    
    challenges: [
      "Harsh self-criticism",
      "Needs appreciation for perfectionism",
      "Anxious when imperfect",
      "Can be controlling about quality",
      "Struggles with 'good enough'"
    ],
    
    famousExamples: [
      { name: "Mother Teresa", degree: 1.55, note: "Perfect service with dignity" },
      { name: "Sean Connery", degree: 2.18, note: "Perfected craft of performance" }
    ],
    
    colorTheme: {
      primary: "#8B7355",    // Burlywood
      secondary: "#D2B48C",  // Tan
      gradient: "linear-gradient(135deg, #8B7355 0%, #D2B48C 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Analyst",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Virgo: Maximum analytical precision and service dedication",
    
    elementalMix: {
      earth: 100    // Pure earth element
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 100, meaning: "Pure analytical Mercury - precision, discernment, detail" }
    },
    
    qualities: {
      // MAXIMUM VIRGO EXPRESSION
      analyticalThinking: 100,  // Peak analytical capacity
      attention: 100,           // Sees EVERY detail
      perfectionism: 100,       // Nothing less than perfect
      serviceOrientation: 95,   // Lives to serve/help
      practicalSkills: 100,     // Master of craft
      criticalThinking: 100,    // Sees all flaws
      organization: 100,        // Perfect systems
      healthConsciousness: 90,  // Body as temple
      modesty: 95,              // Humble servant
      
      // PURE MERCURY-EARTH QUALITIES
      discernment: 100,         // Distinguishes quality instantly
      efficiency: 95,           // Optimizes everything
      reliability: 100,         // Never fails commitments
      
      // BEHAVIORAL
      speed: 85,               // Fast mental processing
      independence: 60,        // Medium (needs to serve)
      patience: 80,            // High (persistent perfecting)
      stubbornness: 85,        // Very high (standards non-negotiable)
      riskTolerance: 25        // Very low (analyzes all risks)
    },
    
    strengths: [
      "Ultimate problem-solving ability",
      "Creates flawless systems",
      "Reliable beyond measure",
      "Serves with total dedication",
      "Sees solutions others miss"
    ],
    
    challenges: [
      "Paralyzed by perfectionism",
      "Hyper-critical of self/others",
      "Anxiety from imperfection",
      "Cannot relax or let go",
      "Health anxiety (hyperaware)"
    ],
    
    famousExamples: [
      { name: "Warren Buffett", degree: 6.57, note: "Analytical precision in investing" },
      { name: "Stephen King", degree: 8.44, note: "Meticulous craft, prolific output" }
    ],
    
    colorTheme: {
      primary: "#6B8E23",    // Olive Drab
      secondary: "#556B2F",  // Dark Olive Green
      gradient: "linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)"
    }
  },

  {
    id: 3,
    name: "The Practical Helper",
    degreeRange: { start: 10, end: 14.99 },
    description: "Virgo-Capricorn blend: Analytical service meets structured ambition",
    
    elementalMix: {
      earth: 85,
      saturnianEarth: 15  // Capricorn discipline
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Analytical precision" },
      secondary: { planet: "Saturn", influence: 30, meaning: "Discipline, structure, mastery" }
    },
    
    qualities: {
      analyticalThinking: 95,
      attention: 95,
      perfectionism: 90,
      serviceOrientation: 85,
      practicalSkills: 95,
      criticalThinking: 95,
      organization: 100,        // MAXIMUM (Saturn structure)
      healthConsciousness: 80,
      modesty: 85,
      
      // CAPRICORN INFLUENCE
      ambition: 75,            // Career-focused service
      discipline: 95,          // Iron discipline
      responsibility: 95,      // Takes on burden
      longTermThinking: 85,    // Builds lasting systems
      
      // BEHAVIORAL
      speed: 70,               // Medium (deliberate precision)
      independence: 75,        // Medium-high (self-sufficient)
      patience: 85,            // Very high (long-term view)
      stubbornness: 90,        // Very high (discipline + standards)
      riskTolerance: 30        // Low (conservative approach)
    },
    
    strengths: [
      "Builds perfect lasting systems",
      "Disciplined mastery of craft",
      "Responsible reliable leadership",
      "Strategic service orientation",
      "Climbs through competence"
    ],
    
    challenges: [
      "Workaholic perfectionism",
      "Overly serious, no fun",
      "Burden of responsibility",
      "Judgmental of imperfection",
      "Difficulty delegating"
    ],
    
    famousExamples: [
      { name: "Amy Poehler", degree: 11.23, note: "Disciplined craft mastery" },
      { name: "Tim Burton", degree: 13.45, note: "Meticulous creative systems" }
    ],
    
    colorTheme: {
      primary: "#8B4513",    // Saddle Brown
      secondary: "#654321",  // Dark Brown
      gradient: "linear-gradient(135deg, #8B4513 0%, #654321 100%)"
    }
  },

  {
    id: 4,
    name: "The Efficient Organizer",
    degreeRange: { start: 15, end: 19.99 },
    description: "Virgo-Capricorn decan: Peak earth mastery - precision meets structure",
    
    elementalMix: {
      earth: 70,
      saturnianEarth: 30  // Strong Capricorn
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 60, meaning: "Analytical systems" },
      secondary: { planet: "Saturn", influence: 40, meaning: "Masterful structure" }
    },
    
    qualities: {
      analyticalThinking: 95,
      attention: 100,           // MAXIMUM detail awareness
      perfectionism: 95,
      serviceOrientation: 80,
      practicalSkills: 100,     // MAXIMUM mastery
      criticalThinking: 100,    // MAXIMUM discernment
      organization: 100,        // MAXIMUM systematization
      healthConsciousness: 85,
      modesty: 90,
      
      // SATURN DOMINANCE
      mastery: 100,            // Peak skill achievement
      efficiency: 100,         // MAXIMUM optimization
      systematization: 100,    // Perfect systems
      achievement: 85,         // Builds empire through skill
      
      // BEHAVIORAL
      speed: 75,               // Medium-fast (efficient)
      independence: 80,        // High (self-mastery)
      patience: 90,            // Very high (mastery takes time)
      stubbornness: 95,        // Extremely high (method + standards)
      riskTolerance: 25        // Very low (calculated only)
    },
    
    strengths: [
      "Creates optimal efficient systems",
      "Master of craft and skill",
      "Reliable organizational genius",
      "Achieves through competence",
      "Builds lasting infrastructure"
    ],
    
    challenges: [
      "Extreme perfectionism paralyzes",
      "Cannot accept imperfection",
      "Workaholic to exhaustion",
      "Cold efficiency over warmth",
      "Difficulty with spontaneity"
    ],
    
    famousExamples: [
      { name: "Agatha Christie", degree: 16.23, note: "Systematic mastery of mystery craft" },
      { name: "Prince Harry", degree: 18.47, note: "Service with structure" }
    ],
    
    colorTheme: {
      primary: "#5F4C0B",    // Dark Khaki
      secondary: "#4A4A4A",  // Dark Gray
      gradient: "linear-gradient(135deg, #5F4C0B 0%, #4A4A4A 100%)"
    }
  },

  {
    id: 5,
    name: "The Grounded Communicator",
    degreeRange: { start: 20, end: 24.99 },
    description: "Virgo-Taurus blend: Analytical precision meets sensory mastery",
    
    elementalMix: {
      earth: 85,
      venusianEarth: 15  // Taurus sensory awareness
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Analytical communication" },
      secondary: { planet: "Venus", influence: 30, meaning: "Aesthetic precision, sensory detail" }
    },
    
    qualities: {
      analyticalThinking: 90,
      attention: 95,
      perfectionism: 90,
      serviceOrientation: 85,
      practicalSkills: 95,
      criticalThinking: 90,
      organization: 90,
      healthConsciousness: 85,
      modesty: 80,
      
      // TAURUS INFLUENCE
      sensoryAwareness: 85,    // Notices physical details
      aestheticSense: 75,      // Creates beautiful systems
      patience: 95,            // MAXIMUM (Taurus stubbornness)
      loyalty: 90,             // Devoted service
      
      // BEHAVIORAL
      speed: 65,               // Medium-slow (deliberate)
      independence: 65,        // Medium (collaborative)
      patience: 95,            // Very high (persistent)
      stubbornness: 90,        // Very high (Taurus + Virgo)
      riskTolerance: 30        // Low (practical caution)
    },
    
    strengths: [
      "Perfects sensory experiences",
      "Creates beautiful practical systems",
      "Patient persistent mastery",
      "Loyal dedicated service",
      "Combines aesthetics with function"
    ],
    
    challenges: [
      "Stubborn about methods",
      "Slow to adapt (too thorough)",
      "Possessive of systems",
      "Resistant to change",
      "Perfectionist paralysis"
    ],
    
    famousExamples: [
      { name: "Keanu Reeves", degree: 20.13, note: "Humble perfectionist, sensory craft" },
      { name: "Cameron Diaz", degree: 22.35, note: "Practical beauty, wellness focus" }
    ],
    
    colorTheme: {
      primary: "#9C8B7A",    // Light Brown
      secondary: "#8B7D6B",  // Warm Gray
      gradient: "linear-gradient(135deg, #9C8B7A 0%, #8B7D6B 100%)"
    }
  },

  {
    id: 6,
    name: "The Balanced Analyzer",
    degreeRange: { start: 25, end: 29.99 },
    description: "Virgo-Libra cusp: Analytical precision meets diplomatic grace",
    
    elementalMix: {
      earth: 75,
      air: 25  // Libra balance and harmony
    },
    
    planetaryRulers: {
      primary: { planet: "Mercury", influence: 70, meaning: "Analytical communication" },
      secondary: { planet: "Venus", influence: 30, meaning: "Diplomatic harmony, aesthetic balance" }
    },
    
    qualities: {
      analyticalThinking: 90,
      attention: 90,
      perfectionism: 85,        // Slightly lower (balanced)
      serviceOrientation: 90,
      practicalSkills: 85,
      criticalThinking: 90,
      organization: 85,
      healthConsciousness: 80,
      modesty: 75,
      
      // LIBRA INFLUENCE
      diplomacy: 80,           // Tactful criticism
      harmony: 75,             // Seeks balanced solutions
      aestheticSense: 80,      // Beautiful organization
      socialGrace: 70,         // More socially comfortable
      
      // BEHAVIORAL
      speed: 80,               // Medium-fast (Mercury + Venus)
      independence: 60,        // Medium (needs balance with others)
      patience: 75,            // High (but wants harmony)
      stubbornness: 70,        // Medium-high
      riskTolerance: 40        // Low-medium (analytical caution)
    },
    
    strengths: [
      "Tactful helpful analysis",
      "Creates harmonious systems",
      "Diplomatic service orientation",
      "Balances precision with grace",
      "Socially skilled helper"
    ],
    
    challenges: [
      "Analysis paralysis from weighing options",
      "People-pleasing perfectionism",
      "Difficulty making decisions (too balanced)",
      "Anxious about criticism (wants harmony)",
      "Perfectionistic about relationships"
    ],
    
    famousExamples: [
      { name: "Will Smith", degree: 25.53, note: "Charming perfectionist, balanced service" },
      { name: "Macaulay Culkin", degree: 27.42, note: "Analytical performance with charm" }
    ],
    
    colorTheme: {
      primary: "#C9A871",    // Khaki
      secondary: "#E6D5B8",  // Beige
      gradient: "linear-gradient(135deg, #C9A871 0%, #E6D5B8 100%)"
    }
  }
];

export const getVirgoZoneByDegree = (degree) => {
  return virgoZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default virgoZones;
