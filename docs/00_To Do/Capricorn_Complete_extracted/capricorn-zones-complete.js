// CAPRICORN ZONES - COMPLETE IMPLEMENTATION
// Earth Sign: Ambitious, disciplined, strategic, masterful
// Ruled by Saturn: Structure, discipline, mastery, responsibility, time

export const capricornZones = [
  {
    id: 1,
    name: "The Visionary Builder",
    degreeRange: { start: 0, end: 4.99 },
    description: "Sagittarius-Capricorn Cusp: Philosophical vision meets strategic execution",
    
    // Elemental Influence
    elementalMix: {
      earth: 75,    // Capricorn strategic grounding
      fire: 25      // Sagittarius visionary enthusiasm
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Saturn", influence: 75, meaning: "Strategic discipline, mastery" },
      secondary: { planet: "Jupiter", influence: 25, meaning: "Expansive vision, optimism" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // CAPRICORN CORE TRAITS
      ambition: 90,
      discipline: 85,
      strategicThinking: 90,
      responsibility: 80,
      patience: 85,
      statusConsciousness: 75,
      workEthic: 90,
      emotionalReserve: 70,
      pessimism: 60,
      
      // SAGITTARIUS CUSP INFLUENCE
      philosophicalDepth: 70,      // Higher than pure Capricorn
      optimism: 60,                // Balances pessimism
      adventurousness: 55,         // Some risk-taking
      visionaryThinking: 85,       // Big picture + strategy
      
      // BEHAVIORAL
      speed: 70,                   // Medium (Earth + Fire balance)
      independence: 85,            // Very high (self-sufficient)
      patience: 85,                // Very high
      stubbornness: 85,            // Very high
      riskTolerance: 60            // Medium (calculated risks)
    },
    
    strengths: [
      "Strategic visionary planning",
      "Builds philosophical empires",
      "Optimistic about long-term goals",
      "Disciplined adventure pursuit",
      "Balances expansion with structure"
    ],
    
    challenges: [
      "Workaholic vision pursuit",
      "Pragmatic dampens enthusiasm",
      "Control issues with freedom",
      "Judgmental about 'unrealistic' dreams",
      "Cannot purely enjoy (always planning)"
    ],
    
    famousExamples: [
      { name: "Denzel Washington", degree: 1.48, note: "Strategic career mastery with philosophical depth" },
      { name: "Tiger Woods", degree: 3.15, note: "Disciplined visionary achievement" }
    ],
    
    colorTheme: {
      primary: "#5D4E37",    // Dark Brown
      secondary: "#704214",  // Sepia
      gradient: "linear-gradient(135deg, #5D4E37 0%, #704214 100%)"
    }
  },

  {
    id: 2,
    name: "The Master Strategist",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Capricorn: Maximum ambition, discipline, and strategic mastery",
    
    elementalMix: {
      earth: 100    // Pure earth element
    },
    
    planetaryRulers: {
      primary: { planet: "Saturn", influence: 100, meaning: "Pure Saturnian energy - discipline, time, mastery, structure" }
    },
    
    qualities: {
      // MAXIMUM CAPRICORN EXPRESSION
      ambition: 100,             // MAXIMUM - must reach summit
      discipline: 100,           // MAXIMUM - iron self-control
      strategicThinking: 100,    // MAXIMUM - chess master
      responsibility: 100,       // MAXIMUM - burden bearer
      patience: 100,             // MAXIMUM - plays long game
      statusConsciousness: 95,   // Very aware of hierarchy
      workEthic: 100,           // MAXIMUM - never stops
      emotionalReserve: 95,     // Almost impenetrable
      pessimism: 90,            // Expects worst
      
      // PURE SATURN QUALITIES
      mastery: 100,             // Achieves ultimate skill
      structure: 100,           // Perfect systems
      timeManagement: 100,      // Uses every moment
      authority: 95,            // Commands respect
      
      // BEHAVIORAL
      speed: 60,                // Medium-slow (methodical)
      independence: 90,         // Very high (self-reliant)
      patience: 100,            // MAXIMUM (eternal)
      stubbornness: 95,         // Extremely high (unmovable)
      riskTolerance: 35         // Low (only calculated risks)
    },
    
    strengths: [
      "Achieves impossible through discipline",
      "Builds empires methodically",
      "Master strategist - sees 20 moves ahead",
      "Unshakeable patience and persistence",
      "Commands respect through competence"
    ],
    
    challenges: [
      "Workaholic to point of burnout",
      "Emotionally cold and distant",
      "Cannot enjoy success (always next goal)",
      "Pessimistic worldview",
      "Control freak - cannot delegate"
    ],
    
    famousExamples: [
      { name: "Michelle Obama", degree: 6.51, note: "Strategic disciplined achievement" },
      { name: "Bradley Cooper", degree: 8.19, note: "Methodical career mastery" }
    ],
    
    colorTheme: {
      primary: "#36454F",    // Charcoal
      secondary: "#2C3E50",  // Midnight Blue
      gradient: "linear-gradient(135deg, #36454F 0%, #2C3E50 100%)"
    }
  },

  {
    id: 3,
    name: "The Practical Achiever",
    degreeRange: { start: 10, end: 14.99 },
    description: "Capricorn-Taurus blend: Strategic ambition meets sensory mastery",
    
    elementalMix: {
      earth: 85,
      venusianEarth: 15  // Taurus sensory appreciation
    },
    
    planetaryRulers: {
      primary: { planet: "Saturn", influence: 70, meaning: "Strategic discipline" },
      secondary: { planet: "Venus", influence: 30, meaning: "Aesthetic mastery, material pleasure" }
    },
    
    qualities: {
      ambition: 90,
      discipline: 90,
      strategicThinking: 90,
      responsibility: 90,
      patience: 100,            // MAXIMUM (double earth)
      statusConsciousness: 85,
      workEthic: 95,
      emotionalReserve: 85,
      pessimism: 75,
      
      // TAURUS INFLUENCE
      sensoryAppreciation: 80,  // Enjoys material success
      aestheticSense: 70,       // Quality matters
      loyalty: 95,              // Extremely loyal
      stubbornness: 100,        // MAXIMUM (double earth)
      
      // BEHAVIORAL
      speed: 55,                // Slow (double earth)
      independence: 85,         // Very high
      patience: 100,            // MAXIMUM
      stubbornness: 100,        // MAXIMUM
      riskTolerance: 30         // Low (very conservative)
    },
    
    strengths: [
      "Builds material empires patiently",
      "Enjoys fruits of labor",
      "Extremely loyal and reliable",
      "Masters practical crafts",
      "Creates lasting quality"
    ],
    
    challenges: [
      "Impossibly stubborn",
      "Materialistic focus",
      "Slow to adapt or change",
      "Possessive of achievements",
      "Cannot rush process"
    ],
    
    famousExamples: [
      { name: "Kate Middleton", degree: 11.03, note: "Graceful strategic positioning" },
      { name: "Timothée Chalamet", degree: 13.42, note: "Patient career mastery" }
    ],
    
    colorTheme: {
      primary: "#654321",    // Dark Brown
      secondary: "#8B4513",  // Saddle Brown
      gradient: "linear-gradient(135deg, #654321 0%, #8B4513 100%)"
    }
  },

  {
    id: 4,
    name: "The Empire Builder",
    degreeRange: { start: 15, end: 19.99 },
    description: "Capricorn-Taurus decan: Peak earth energy - strategic mastery meets material power",
    
    elementalMix: {
      earth: 70,
      venusianEarth: 30  // Strong Taurus
    },
    
    planetaryRulers: {
      primary: { planet: "Saturn", influence: 60, meaning: "Strategic structure" },
      secondary: { planet: "Venus", influence: 40, meaning: "Material mastery" }
    },
    
    qualities: {
      ambition: 95,
      discipline: 95,
      strategicThinking: 95,
      responsibility: 95,
      patience: 100,            // MAXIMUM
      statusConsciousness: 90,
      workEthic: 100,           // MAXIMUM
      emotionalReserve: 90,
      pessimism: 80,
      
      // VENUS DOMINANCE
      materialMastery: 95,      // Controls resources
      aestheticPower: 85,       // Power through beauty
      wealthBuilding: 100,      // MAXIMUM accumulation
      legacy: 95,               // Builds to last
      
      // BEHAVIORAL
      speed: 50,                // Slow (methodical empire building)
      independence: 90,         // Very high
      patience: 100,            // MAXIMUM
      stubbornness: 95,         // Extremely high
      riskTolerance: 35         // Low (protects empire)
    },
    
    strengths: [
      "Builds generational wealth",
      "Masters material world completely",
      "Strategic resource management",
      "Creates lasting dynasties",
      "Unstoppable patient accumulation"
    ],
    
    challenges: [
      "Ruthless in pursuit of power",
      "Emotionally unavailable",
      "Hoards resources",
      "Uses people strategically",
      "Never satisfied with wealth"
    ],
    
    famousExamples: [
      { name: "Jeff Bezos", degree: 16.42, note: "Empire builder through strategy" },
      { name: "Dolly Parton", degree: 18.29, note: "Built entertainment empire" }
    ],
    
    colorTheme: {
      primary: "#3E2723",    // Dark Brown
      secondary: "#1B1B1B",  // Almost Black
      gradient: "linear-gradient(135deg, #3E2723 0%, #1B1B1B 100%)"
    }
  },

  {
    id: 5,
    name: "The Perfectionist Leader",
    degreeRange: { start: 20, end: 24.99 },
    description: "Capricorn-Virgo blend: Strategic ambition meets analytical precision",
    
    elementalMix: {
      earth: 85,
      mercurialEarth: 15  // Virgo analytical precision
    },
    
    planetaryRulers: {
      primary: { planet: "Saturn", influence: 70, meaning: "Strategic mastery" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Analytical perfection" }
    },
    
    qualities: {
      ambition: 90,
      discipline: 95,
      strategicThinking: 95,
      responsibility: 95,
      patience: 95,
      statusConsciousness: 80,
      workEthic: 100,           // MAXIMUM
      emotionalReserve: 85,
      pessimism: 85,
      
      // VIRGO INFLUENCE
      analyticalThinking: 90,   // Strategic + analytical
      perfectionism: 95,        // Everything flawless
      attention: 95,           // Notices all details
      criticalThinking: 90,    // Sees all flaws
      
      // BEHAVIORAL
      speed: 65,                // Medium (Earth + Mercury)
      independence: 85,         // Very high
      patience: 95,             // Very high
      stubbornness: 90,         // Very high
      riskTolerance: 30         // Low (analyzes all risks)
    },
    
    strengths: [
      "Perfect strategic execution",
      "Analytical empire building",
      "Flawless systems creation",
      "Masters craft through discipline",
      "Combines vision with precision"
    ],
    
    challenges: [
      "Perfectionist paralysis",
      "Hyper-critical of self/others",
      "Anxiety from imperfection",
      "Workaholic burnout",
      "Cannot tolerate incompetence"
    ],
    
    famousExamples: [
      { name: "LeBron James", degree: 21.15, note: "Perfected craft through discipline" },
      { name: "Kate Moss", degree: 23.18, note: "Analytical career mastery" }
    ],
    
    colorTheme: {
      primary: "#4A4A4A",    // Dark Gray
      secondary: "#696969",  // Dim Gray
      gradient: "linear-gradient(135deg, #4A4A4A 0%, #696969 100%)"
    }
  },

  {
    id: 6,
    name: "The Revolutionary Pragmatist",
    degreeRange: { start: 25, end: 29.99 },
    description: "Capricorn-Aquarius cusp: Strategic mastery meets innovative vision",
    
    elementalMix: {
      earth: 75,
      air: 25       // Aquarius revolutionary thinking
    },
    
    planetaryRulers: {
      primary: { planet: "Saturn", influence: 70, meaning: "Strategic structure" },
      secondary: { planet: "Uranus", influence: 30, meaning: "Revolutionary innovation" }
    },
    
    qualities: {
      ambition: 90,
      discipline: 85,
      strategicThinking: 95,
      responsibility: 85,
      patience: 85,
      statusConsciousness: 70,     // Less traditional
      workEthic: 90,
      emotionalReserve: 80,
      pessimism: 70,               // Balanced by innovation
      
      // AQUARIUS INFLUENCE
      innovation: 85,              // Revolutionary methods
      intellectualDepth: 80,       // Abstract thinking
      humanitarianism: 65,         // Social responsibility
      unconventionality: 75,       // Breaks traditions
      
      // BEHAVIORAL
      speed: 70,                   // Medium (Air speeds Earth)
      independence: 95,            // Extremely high
      patience: 80,                // High
      stubbornness: 85,            // Very high (principled)
      riskTolerance: 55            // Medium (calculated innovation)
    },
    
    strengths: [
      "Innovates traditional systems",
      "Strategic revolutionary vision",
      "Builds future infrastructure",
      "Pragmatic idealism",
      "Reforms through discipline"
    ],
    
    challenges: [
      "Cold intellectual distance",
      "Rebels against own traditions",
      "Control issues with innovation",
      "Workaholic reformer",
      "Difficulty with emotions"
    ],
    
    famousExamples: [
      { name: "David Bowie", degree: 26.05, note: "Revolutionary with strategic career" },
      { name: "Elvis Presley", degree: 27.18, note: "Innovated while building empire" }
    ],
    
    colorTheme: {
      primary: "#2C3E50",    // Midnight Blue
      secondary: "#34495E",  // Wet Asphalt
      gradient: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)"
    }
  }
];

export const getCapricornZoneByDegree = (degree) => {
  return capricornZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default capricornZones;
