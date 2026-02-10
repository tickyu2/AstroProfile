// AQUARIUS ZONES - COMPLETE IMPLEMENTATION
// Air Sign: Revolutionary, innovative, humanitarian, intellectual
// Ruled by Saturn + Uranus: Structure + revolution, discipline + innovation

export const aquariusZones = [
  {
    id: 1,
    name: "The Pragmatic Innovator",
    degreeRange: { start: 0, end: 4.99 },
    description: "Capricorn-Aquarius Cusp: Strategic structure meets revolutionary vision",
    
    // Elemental Influence
    elementalMix: {
      air: 75,      // Aquarius revolutionary thinking
      earth: 25     // Capricorn strategic grounding
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Uranus", influence: 60, meaning: "Revolutionary innovation" },
      secondary: { planet: "Saturn", influence: 40, meaning: "Strategic structure, discipline" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // AQUARIUS CORE TRAITS
      revolutionaryThinking: 85,
      intellectualDepth: 90,
      humanitarianism: 80,
      unconventionality: 75,
      detachment: 75,
      innovation: 90,
      groupOrientation: 75,
      rebelliousness: 70,
      futureVision: 85,
      
      // CAPRICORN CUSP INFLUENCE
      strategicThinking: 80,        // Higher than pure Aquarius
      discipline: 70,               // Some structure
      ambition: 65,                 // Goal-oriented innovation
      responsibility: 60,           // Takes ideas seriously
      
      // BEHAVIORAL
      speed: 80,                    // Fast (Air + strategic)
      independence: 95,             // Extremely high
      patience: 70,                 // Medium-high (Saturn helps)
      stubbornness: 85,             // Very high (Fixed + principled)
      riskTolerance: 70             // High (calculated revolutionary risks)
    },
    
    strengths: [
      "Strategic revolutionary planning",
      "Builds innovative systems",
      "Pragmatic idealism",
      "Disciplined innovation",
      "Reforms structures effectively"
    ],
    
    challenges: [
      "Cold intellectual distance",
      "Control issues with innovation",
      "Workaholic revolutionary",
      "Judgmental of 'old ways'",
      "Difficulty with emotions"
    ],
    
    famousExamples: [
      { name: "Oprah Winfrey", degree: 0.52, note: "Strategic humanitarian empire" },
      { name: "Christian Bale", degree: 3.18, note: "Disciplined method innovation" }
    ],
    
    colorTheme: {
      primary: "#4169E1",    // Royal Blue
      secondary: "#1E90FF",  // Dodger Blue
      gradient: "linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Revolutionary",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Aquarius: Maximum innovation, humanitarianism, and revolutionary vision",
    
    elementalMix: {
      air: 100      // Pure air element
    },
    
    planetaryRulers: {
      primary: { planet: "Uranus", influence: 70, meaning: "Pure revolutionary innovation, lightning insight" },
      secondary: { planet: "Saturn", influence: 30, meaning: "Structural rebellion" }
    },
    
    qualities: {
      // MAXIMUM AQUARIUS EXPRESSION
      revolutionaryThinking: 100,    // MAXIMUM - sees future
      intellectualDepth: 100,        // MAXIMUM - abstract genius
      humanitarianism: 100,          // MAXIMUM - for all humanity
      unconventionality: 100,        // MAXIMUM - completely unique
      detachment: 100,               // MAXIMUM - emotionally distant
      innovation: 100,               // MAXIMUM - constant breakthroughs
      groupOrientation: 95,          // Very focused on collective
      rebelliousness: 95,            // Rebels against all authority
      futureVision: 100,             // MAXIMUM - sees decades ahead
      
      // PURE URANUS-SATURN QUALITIES
      genius: 95,                    // Lightning insights
      egalitarianism: 100,           // Everyone equal
      objectivity: 100,              // Purely logical
      eccentricity: 100,             // Completely unique
      
      // BEHAVIORAL
      speed: 90,                     // Very fast (lightning thought)
      independence: 100,             // MAXIMUM (alone in future)
      patience: 60,                  // Medium (Fixed but impatient for change)
      stubbornness: 95,              // Extremely high (Fixed ideals)
      riskTolerance: 85              // Very high (revolutionary courage)
    },
    
    strengths: [
      "Visionary genius - sees future clearly",
      "Revolutionary humanitarian impact",
      "Completely objective and logical",
      "Innovates impossible solutions",
      "Unites humanity through ideas"
    ],
    
    challenges: [
      "Emotionally alien and distant",
      "Cannot relate to 'normal' people",
      "Stubborn about revolutionary ideals",
      "Rebels even against allies",
      "Lost in future, ignores present"
    ],
    
    famousExamples: [
      { name: "Thomas Edison", degree: 6.25, note: "Revolutionary inventor" },
      { name: "Charles Darwin", degree: 8.43, note: "Revolutionary scientific vision" }
    ],
    
    colorTheme: {
      primary: "#00BFFF",    // Deep Sky Blue
      secondary: "#87CEEB",  // Sky Blue
      gradient: "linear-gradient(135deg, #00BFFF 0%, #87CEEB 100%)"
    }
  },

  {
    id: 3,
    name: "The Social Innovator",
    degreeRange: { start: 10, end: 14.99 },
    description: "Aquarius-Gemini blend: Revolutionary vision meets versatile communication",
    
    elementalMix: {
      air: 85,
      mercurialAir: 15  // Gemini communication agility
    },
    
    planetaryRulers: {
      primary: { planet: "Uranus", influence: 70, meaning: "Revolutionary innovation" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Versatile communication, mental agility" }
    },
    
    qualities: {
      revolutionaryThinking: 90,
      intellectualDepth: 90,
      humanitarianism: 85,
      unconventionality: 90,
      detachment: 85,
      innovation: 95,
      groupOrientation: 90,
      rebelliousness: 80,
      futureVision: 85,
      
      // GEMINI INFLUENCE
      communication: 95,             // Spreads revolutionary ideas
      versatility: 90,               // Adapts innovation
      curiosity: 85,                 // Explores all ideas
      socialConnection: 80,          // Networks innovators
      
      // BEHAVIORAL
      speed: 95,                     // Very fast (double air)
      independence: 90,              // Very high
      patience: 55,                  // Medium (restless innovation)
      stubbornness: 80,              // High (principled)
      riskTolerance: 80              // Very high
    },
    
    strengths: [
      "Communicates revolution brilliantly",
      "Networks diverse innovators",
      "Spreads progressive ideas widely",
      "Adapts innovation to audience",
      "Bridges different revolutionary groups"
    ],
    
    challenges: [
      "Scattered revolutionary focus",
      "Superficial idea hopping",
      "Intellectualizes everything",
      "Cannot commit to one cause",
      "Emotionally detached networking"
    ],
    
    famousExamples: [
      { name: "Ashton Kutcher", degree: 11.37, note: "Tech innovation + communication" },
      { name: "Ed Sheeran", degree: 13.15, note: "Musical innovation spread widely" }
    ],
    
    colorTheme: {
      primary: "#40E0D0",    // Turquoise
      secondary: "#48D1CC",  // Medium Turquoise
      gradient: "linear-gradient(135deg, #40E0D0 0%, #48D1CC 100%)"
    }
  },

  {
    id: 4,
    name: "The Equality Crusader",
    degreeRange: { start: 15, end: 19.99 },
    description: "Aquarius-Gemini decan: Peak air energy - revolutionary ideas meet mass communication",
    
    elementalMix: {
      air: 70,
      mercurialAir: 30  // Strong Gemini
    },
    
    planetaryRulers: {
      primary: { planet: "Uranus", influence: 60, meaning: "Revolutionary equality" },
      secondary: { planet: "Mercury", influence: 40, meaning: "Idea dissemination" }
    },
    
    qualities: {
      revolutionaryThinking: 95,
      intellectualDepth: 85,
      humanitarianism: 100,          // MAXIMUM - equality for ALL
      unconventionality: 90,
      detachment: 90,
      innovation: 90,
      groupOrientation: 100,         // MAXIMUM - collective focus
      rebelliousness: 90,
      futureVision: 90,
      
      // MERCURY DOMINANCE
      ideaDissemination: 95,         // Spreads equality
      networking: 100,               // MAXIMUM connection
      intellectualAgility: 95,       // Quick adaptations
      teaching: 90,                  // Educates masses
      
      // BEHAVIORAL
      speed: 100,                    // MAXIMUM (double air at peak)
      independence: 85,              // High (but needs collective)
      patience: 50,                  // Medium (impatient for equality)
      stubbornness: 90,              // Very high (equality principles)
      riskTolerance: 85              // Very high
    },
    
    strengths: [
      "Unites humanity for equality",
      "Networks massive movements",
      "Spreads revolutionary ideas globally",
      "Intellectually brilliant activism",
      "Teaches future to masses"
    ],
    
    challenges: [
      "Intellectually arrogant",
      "Emotionally detached from individuals",
      "Scattered across too many causes",
      "Cannot execute (only ideates)",
      "Judges 'unenlightened' people"
    ],
    
    famousExamples: [
      { name: "Abraham Lincoln", degree: 16.48, note: "Equality crusader" },
      { name: "Rosa Parks", degree: 18.23, note: "Revolutionary equality action" }
    ],
    
    colorTheme: {
      primary: "#5F9EA0",    // Cadet Blue
      secondary: "#4682B4",  // Steel Blue
      gradient: "linear-gradient(135deg, #5F9EA0 0%, #4682B4 100%)"
    }
  },

  {
    id: 5,
    name: "The Diplomatic Revolutionary",
    degreeRange: { start: 20, end: 24.99 },
    description: "Aquarius-Libra blend: Revolutionary innovation meets harmonious balance",
    
    elementalMix: {
      air: 85,
      venusianAir: 15  // Libra diplomatic harmony
    },
    
    planetaryRulers: {
      primary: { planet: "Uranus", influence: 70, meaning: "Revolutionary vision" },
      secondary: { planet: "Venus", influence: 30, meaning: "Harmonious reform, aesthetic innovation" }
    },
    
    qualities: {
      revolutionaryThinking: 85,
      intellectualDepth: 85,
      humanitarianism: 90,
      unconventionality: 80,
      detachment: 80,
      innovation: 85,
      groupOrientation: 90,
      rebelliousness: 70,            // Less rebellious (diplomatic)
      futureVision: 80,
      
      // LIBRA INFLUENCE
      diplomacy: 85,                 // Tactful revolution
      aestheticSense: 75,            // Beautiful innovation
      balanceSeeking: 70,            // Balanced reform
      socialGrace: 80,               // Graceful activism
      
      // BEHAVIORAL
      speed: 85,                     // Fast
      independence: 80,              // High (but values partnership)
      patience: 65,                  // Medium-high
      stubbornness: 75,              // High (principled but flexible)
      riskTolerance: 70              // High
    },
    
    strengths: [
      "Diplomatic revolutionary change",
      "Beautiful innovative solutions",
      "Balances progress with harmony",
      "Tactful humanitarian activism",
      "Unites opposing sides"
    ],
    
    challenges: [
      "Compromises revolutionary ideals",
      "Indecisive about radical action",
      "Too diplomatic with oppressors",
      "Intellectualizes emotions",
      "Aesthetic over substance"
    ],
    
    famousExamples: [
      { name: "Ellen DeGeneres", degree: 21.42, note: "Diplomatic LGBTQ+ revolution" },
      { name: "Paris Hilton", degree: 23.18, note: "Aesthetic innovation" }
    ],
    
    colorTheme: {
      primary: "#87CEFA",    // Light Sky Blue
      secondary: "#B0E0E6",  // Powder Blue
      gradient: "linear-gradient(135deg, #87CEFA 0%, #B0E0E6 100%)"
    }
  },

  {
    id: 6,
    name: "The Mystical Futurist",
    degreeRange: { start: 25, end: 29.99 },
    description: "Aquarius-Pisces cusp: Revolutionary innovation meets spiritual transcendence",
    
    elementalMix: {
      air: 75,
      water: 25     // Pisces spiritual compassion
    },
    
    planetaryRulers: {
      primary: { planet: "Uranus", influence: 65, meaning: "Revolutionary vision" },
      secondary: { planet: "Neptune", influence: 35, meaning: "Spiritual transcendence, universal love" }
    },
    
    qualities: {
      revolutionaryThinking: 80,
      intellectualDepth: 80,
      humanitarianism: 95,
      unconventionality: 90,
      detachment: 70,                // Less detached (Pisces feeling)
      innovation: 80,
      groupOrientation: 85,
      rebelliousness: 75,
      futureVision: 95,              // Mystical future sight
      
      // PISCES INFLUENCE
      spiritualConnection: 85,       // Spiritual revolution
      compassion: 90,                // Universal love
      intuition: 85,                 // Psychic innovation
      artisticExpression: 80,        // Visionary art
      
      // BEHAVIORAL
      speed: 75,                     // Medium-fast (Water slows Air)
      independence: 80,              // High
      patience: 75,                  // High (spiritual acceptance)
      stubbornness: 70,              // Medium-high
      riskTolerance: 75              // High (faith in vision)
    },
    
    strengths: [
      "Mystical revolutionary vision",
      "Compassionate innovation",
      "Spiritual humanitarian work",
      "Visionary artistic creation",
      "Transcendent future sight"
    ],
    
    challenges: [
      "Lost in utopian dreams",
      "Impractical visionary ideals",
      "Escapist tendencies",
      "Confused boundaries",
      "Martyrdom for humanity"
    ],
    
    famousExamples: [
      { name: "Shakira", degree: 26.05, note: "Visionary artistic humanitarian" },
      { name: "Alicia Keys", degree: 27.42, note: "Spiritual revolutionary music" }
    ],
    
    colorTheme: {
      primary: "#B0C4DE",    // Light Steel Blue
      secondary: "#E0B0FF",  // Mauve (spiritual purple-blue)
      gradient: "linear-gradient(135deg, #B0C4DE 0%, #E0B0FF 100%)"
    }
  }
];

export const getAquariusZoneByDegree = (degree) => {
  return aquariusZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default aquariusZones;
