// LIBRA ZONES - COMPLETE IMPLEMENTATION
// Air Sign: Balanced, diplomatic, aesthetic, relationship-oriented
// Ruled by Venus: Harmony, beauty, partnership, justice

export const libraZones = [
  {
    id: 1,
    name: "The Graceful Perfectionist",
    degreeRange: { start: 0, end: 4.99 },
    description: "Virgo-Libra Cusp: Analytical precision meets aesthetic harmony",
    
    // Elemental Influence
    elementalMix: {
      air: 75,      // Libra social harmony
      earth: 25     // Virgo analytical precision
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Venus", influence: 75, meaning: "Aesthetic harmony, relationships" },
      secondary: { planet: "Mercury", influence: 25, meaning: "Analytical refinement" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // LIBRA CORE TRAITS
      diplomacy: 85,
      charm: 80,
      aestheticSense: 90,
      balanceSeeking: 85,
      relationshipFocus: 80,
      fairness: 90,
      indecisiveness: 80,
      conflictAvoidance: 75,
      socialGrace: 85,
      
      // VIRGO CUSP INFLUENCE
      analyticalThinking: 70,    // Higher than pure Libra
      attentionToDetail: 80,     // Notices aesthetic flaws
      perfectionism: 75,         // Perfectionist about beauty/harmony
      practicalSkills: 60,       // Some grounding
      
      // BEHAVIORAL
      speed: 70,                 // Medium (Air + Earth)
      independence: 50,          // Medium-low (needs partnership)
      patience: 70,              // Medium-high
      stubbornness: 60,          // Medium (wants harmony but has standards)
      riskTolerance: 45          // Low-medium (analyzes + seeks safety)
    },
    
    strengths: [
      "Perfect aesthetic judgment",
      "Tactful problem-solving",
      "Creates beautiful harmonious systems",
      "Diplomatic with high standards",
      "Balances art and analysis"
    ],
    
    challenges: [
      "Indecisive perfectionism",
      "Critical of aesthetic imperfection",
      "Overthinks social interactions",
      "People-pleasing despite standards",
      "Anxious when things aren't 'just right'"
    ],
    
    famousExamples: [
      { name: "Will Smith", degree: 0.53, note: "Charming perfectionist performer" },
      { name: "Gwyneth Paltrow", degree: 3.42, note: "Aesthetic precision, wellness focus" }
    ],
    
    colorTheme: {
      primary: "#FFB6C1",    // Light Pink
      secondary: "#FFC0CB",  // Pink
      gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Harmonizer",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Libra: Maximum balance, beauty, and diplomatic grace",
    
    elementalMix: {
      air: 100      // Pure air element
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 100, meaning: "Pure Venusian energy - harmony, beauty, love, balance" }
    },
    
    qualities: {
      // MAXIMUM LIBRA EXPRESSION
      diplomacy: 100,            // Ultimate peacemaker
      charm: 100,                // Irresistible social grace
      aestheticSense: 100,       // Perfect taste
      balanceSeeking: 100,       // Cannot tolerate imbalance
      relationshipFocus: 100,    // Needs partnership to exist
      fairness: 100,             // Justice obsessed
      indecisiveness: 95,        // Paralyzed by seeing all sides
      conflictAvoidance: 95,     // Will do anything to avoid discord
      socialGrace: 100,          // Perfectly smooth socially
      
      // PURE VENUS QUALITIES
      beautyCreation: 95,        // Creates aesthetic perfection
      lovingness: 95,            // Radiates love and acceptance
      refinement: 100,           // Ultimate sophistication
      
      // BEHAVIORAL
      speed: 60,                 // Medium-slow (weighs everything)
      independence: 30,          // Very low (needs partnership)
      patience: 75,              // High (waits for balance)
      stubbornness: 50,          // Medium (flexible for harmony)
      riskTolerance: 40          // Low-medium (avoids disruption)
    },
    
    strengths: [
      "Creates perfect harmony anywhere",
      "Sees all perspectives equally",
      "Ultimate diplomatic skill",
      "Exquisite aesthetic taste",
      "Makes everyone feel valued"
    ],
    
    challenges: [
      "Cannot make decisions (sees all sides)",
      "Lost without partnership",
      "Avoids necessary conflict",
      "Superficial peacekeeping",
      "Identity crisis (mirrors others)"
    ],
    
    famousExamples: [
      { name: "John Lennon", degree: 6.03, note: "Peace and harmony advocate" },
      { name: "Kim Kardashian", degree: 8.42, note: "Aesthetic perfection, relationship-focused" }
    ],
    
    colorTheme: {
      primary: "#FF69B4",    // Hot Pink
      secondary: "#FFB6C1",  // Light Pink
      gradient: "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)"
    }
  },

  {
    id: 3,
    name: "The Social Innovator",
    degreeRange: { start: 10, end: 14.99 },
    description: "Libra-Aquarius blend: Harmonious relationships meet intellectual innovation",
    
    elementalMix: {
      air: 85,
      uranianAir: 15  // Aquarius revolutionary thinking
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Harmonious beauty" },
      secondary: { planet: "Uranus", influence: 30, meaning: "Revolutionary ideas, innovation" }
    },
    
    qualities: {
      diplomacy: 85,
      charm: 90,
      aestheticSense: 85,
      balanceSeeking: 80,
      relationshipFocus: 75,
      fairness: 95,              // Heightened justice sense
      indecisiveness: 70,        // Less indecisive (Uranus decisiveness)
      conflictAvoidance: 65,     // More willing to challenge
      socialGrace: 85,
      
      // AQUARIUS INFLUENCE
      intellectualDepth: 85,     // Abstract thinking
      innovation: 80,            // Progressive ideas
      independence: 65,          // More independent
      humanitarianism: 90,       // Justice for all
      
      // BEHAVIORAL
      speed: 75,                 // Medium-fast (Air + Uranus)
      independence: 55,          // Medium (balanced)
      patience: 65,              // Medium-high
      stubbornness: 65,          // Medium-high (principles)
      riskTolerance: 55          // Medium (idealistic courage)
    },
    
    strengths: [
      "Progressive diplomatic vision",
      "Fights for social justice",
      "Innovative relationship models",
      "Intellectual charm",
      "Balances tradition with progress"
    ],
    
    challenges: [
      "Detached from emotions",
      "Idealistic about relationships",
      "Judgmental of 'unfair' people",
      "Erratic commitment (freedom vs partnership)",
      "Can be coldly intellectual"
    ],
    
    famousExamples: [
      { name: "Eleanor Roosevelt", degree: 11.18, note: "Social justice advocate" },
      { name: "Bruno Mars", degree: 13.47, note: "Innovative musical harmony" }
    ],
    
    colorTheme: {
      primary: "#DDA0DD",    // Plum
      secondary: "#DA70D6",  // Orchid
      gradient: "linear-gradient(135deg, #DDA0DD 0%, #DA70D6 100%)"
    }
  },

  {
    id: 4,
    name: "The Idealistic Partner",
    degreeRange: { start: 15, end: 19.99 },
    description: "Libra-Aquarius decan: Peak air energy - social harmony meets radical equality",
    
    elementalMix: {
      air: 70,
      uranianAir: 30  // Strong Aquarius
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 60, meaning: "Relationship harmony" },
      secondary: { planet: "Uranus", influence: 40, meaning: "Revolutionary partnership ideals" }
    },
    
    qualities: {
      diplomacy: 80,
      charm: 85,
      aestheticSense: 75,        // Less focused on aesthetics
      balanceSeeking: 90,        // Extreme fairness
      relationshipFocus: 85,
      fairness: 100,             // MAXIMUM justice obsession
      indecisiveness: 60,        // More decisive (principles)
      conflictAvoidance: 50,     // Willing to fight for justice
      socialGrace: 80,
      
      // URANUS DOMINANCE
      intellectualDepth: 95,     // Highly abstract
      innovation: 90,            // Radical relationship models
      independence: 70,          // High (paradox: independent partnership)
      humanitarianism: 100,      // MAXIMUM social justice
      rebellion: 75,             // Against unfair norms
      
      // BEHAVIORAL
      speed: 80,                 // Fast (double air)
      independence: 65,          // Medium-high
      patience: 60,              // Medium (impatient with injustice)
      stubbornness: 75,          // High (principles)
      riskTolerance: 60          // Medium-high (idealistic courage)
    },
    
    strengths: [
      "Champions equality in relationships",
      "Intellectually brilliant partnerships",
      "Fights systemic injustice",
      "Progressive social vision",
      "Balances freedom with connection"
    ],
    
    challenges: [
      "Emotionally detached in relationships",
      "Idealistic to the point of impractical",
      "Judgmental of 'unfair' behavior",
      "Cannot commit to 'imperfect' partnership",
      "Rebels against relationship norms"
    ],
    
    famousExamples: [
      { name: "Eminem", degree: 17.29, note: "Justice themes in artistry" },
      { name: "Snoop Dogg", degree: 18.55, note: "Smooth social innovator" }
    ],
    
    colorTheme: {
      primary: "#BA55D3",    // Medium Orchid
      secondary: "#9370DB",  // Medium Purple
      gradient: "linear-gradient(135deg, #BA55D3 0%, #9370DB 100%)"
    }
  },

  {
    id: 5,
    name: "The Diplomatic Leader",
    degreeRange: { start: 20, end: 24.99 },
    description: "Libra-Gemini blend: Social harmony meets versatile communication",
    
    elementalMix: {
      air: 85,
      mercurialAir: 15  // Gemini adaptability
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Harmonious relationships" },
      secondary: { planet: "Mercury", influence: 30, meaning: "Versatile communication, adaptability" }
    },
    
    qualities: {
      diplomacy: 95,             // Enhanced by Mercury
      charm: 95,                 // Verbally charming
      aestheticSense: 80,
      balanceSeeking: 85,
      relationshipFocus: 80,
      fairness: 85,
      indecisiveness: 85,        // Worse (more options)
      conflictAvoidance: 80,
      socialGrace: 95,           // Peak social skill
      
      // GEMINI INFLUENCE
      communication: 95,         // Highly articulate
      versatility: 90,           // Adapts to anyone
      curiosity: 80,             // Interested in people
      mentalAgility: 85,         // Quick social processing
      
      // BEHAVIORAL
      speed: 85,                 // Fast (double air)
      independence: 45,          // Low-medium (social needs)
      patience: 65,              // Medium-high
      stubbornness: 50,          // Low-medium (flexible)
      riskTolerance: 50          // Medium (social risks)
    },
    
    strengths: [
      "Masterful social diplomat",
      "Communicates harmony brilliantly",
      "Adapts to any social situation",
      "Bridges diverse perspectives",
      "Charming mediator"
    ],
    
    challenges: [
      "Superficial charm (no depth)",
      "Scattered social focus",
      "Says what people want to hear",
      "Indecisive communication",
      "Lacks authenticity (mirrors everyone)"
    ],
    
    famousExamples: [
      { name: "Carrie Fisher", degree: 21.15, note: "Witty diplomatic charm" },
      { name: "Serena Williams", degree: 23.42, note: "Graceful competitive communication" }
    ],
    
    colorTheme: {
      primary: "#FFB6D9",    // Carnation Pink
      secondary: "#FFE4E1",  // Misty Rose
      gradient: "linear-gradient(135deg, #FFB6D9 0%, #FFE4E1 100%)"
    }
  },

  {
    id: 6,
    name: "The Passionate Peacemaker",
    degreeRange: { start: 25, end: 29.99 },
    description: "Libra-Scorpio cusp: Diplomatic grace meets emotional intensity",
    
    elementalMix: {
      air: 75,
      water: 25     // Scorpio emotional depth
    },
    
    planetaryRulers: {
      primary: { planet: "Venus", influence: 70, meaning: "Harmonious beauty" },
      secondary: { planet: "Pluto", influence: 30, meaning: "Transformative depth, intensity" }
    },
    
    qualities: {
      diplomacy: 85,
      charm: 90,                 // Magnetic intensity
      aestheticSense: 85,
      balanceSeeking: 75,        // Less balanced (Scorpio intensity)
      relationshipFocus: 95,     // VERY relationship-focused
      fairness: 90,
      indecisiveness: 60,        // More decisive (Scorpio knows)
      conflictAvoidance: 50,     // Less avoidant (Scorpio confronts)
      socialGrace: 85,
      
      // SCORPIO INFLUENCE
      emotionalDepth: 80,        // Deep feelings
      intensity: 85,             // Passionate about harmony
      psychologicalInsight: 85,  // Sees hidden dynamics
      loyalty: 90,               // Fiercely loyal in partnership
      jealousy: 70,              // Possessive in relationships
      
      // BEHAVIORAL
      speed: 65,                 // Medium (Air slowed by Water)
      independence: 40,          // Low (needs deep partnership)
      patience: 70,              // Medium-high
      stubbornness: 75,          // High (strong convictions)
      riskTolerance: 55          // Medium (intense but cautious)
    },
    
    strengths: [
      "Deep psychological diplomacy",
      "Passionate about justice",
      "Transforms conflicts powerfully",
      "Loyal intense partnerships",
      "Sees hidden relationship dynamics"
    ],
    
    challenges: [
      "Manipulative for harmony",
      "Jealous in relationships",
      "Passive-aggressive when hurt",
      "Obsessive about fairness",
      "Power struggles disguised as diplomacy"
    ],
    
    famousExamples: [
      { name: "Katy Perry", degree: 25.18, note: "Intense romantic themes" },
      { name: "Emilia Clarke", degree: 27.42, note: "Passionate graceful intensity" }
    ],
    
    colorTheme: {
      primary: "#C71585",    // Medium Violet Red
      secondary: "#8B008B",  // Dark Magenta
      gradient: "linear-gradient(135deg, #C71585 0%, #8B008B 100%)"
    }
  }
];

export const getLibraZoneByDegree = (degree) => {
  return libraZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default libraZones;
