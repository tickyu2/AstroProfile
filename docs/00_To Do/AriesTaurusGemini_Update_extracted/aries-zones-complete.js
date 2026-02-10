// ARIES ZONES - COMPLETE IMPLEMENTATION (UPDATED TO MATCH EVOLVED STRUCTURE)
// Fire Sign: Pioneering, courageous, impulsive, initiating
// Ruled by Mars: Action, courage, warrior energy, assertiveness

export const ariesZones = [
  {
    id: 1,
    name: "The Dreamy Pioneer",
    degreeRange: { start: 0, end: 4.99 },
    description: "Pisces-Aries Cusp: Spiritual compassion meets courageous action",
    
    // Elemental Influence
    elementalMix: {
      fire: 75,     // Aries warrior courage
      water: 25     // Pisces spiritual intuition
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Mars", influence: 75, meaning: "Warrior action, courage, initiative" },
      secondary: { planet: "Neptune", influence: 15, meaning: "Spiritual intuition" },
      tertiary: { planet: "Jupiter", influence: 10, meaning: "Compassionate expansion" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // ARIES CORE TRAITS
      courage: 90,
      impulsivity: 85,
      independence: 90,
      competitiveness: 80,
      directness: 85,
      pioneering: 90,
      assertiveness: 85,
      impatience: 80,
      aggression: 75,
      
      // PISCES CUSP INFLUENCE
      spiritualConnection: 65,      // Higher than pure Aries
      compassion: 70,               // Softens warrior
      intuition: 75,                // Spiritual guidance
      artisticExpression: 65,       // Creative action
      
      // BEHAVIORAL
      speed: 90,                    // Very fast (Fire + action)
      independence: 90,             // Very high
      patience: 30,                 // Very low
      stubbornness: 70,             // High (determined)
      riskTolerance: 90             // Very high (fearless)
    },
    
    strengths: [
      "Spiritual warrior courage",
      "Intuitive pioneering action",
      "Compassionate leadership",
      "Fights for idealistic causes",
      "Balances vision with action"
    ],
    
    challenges: [
      "Impulsive spiritual martyrdom",
      "Confused between doing/being",
      "Aggressive about compassion",
      "Difficulty sustaining action",
      "Restless even when peaceful"
    ],
    
    famousExamples: [
      { name: "Lady Gaga", degree: 3.47, note: "Spiritual artistic pioneering" },
      { name: "Elton John", degree: 1.23, note: "Compassionate creative courage" }
    ],
    
    colorTheme: {
      primary: "#FF6347",    // Tomato Red
      secondary: "#FF4500",  // Orange Red
      gradient: "linear-gradient(135deg, #FF6347 0%, #FF4500 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Warrior",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Aries: Maximum courage, initiative, and pioneering action",
    
    elementalMix: {
      fire: 100     // Pure fire element
    },
    
    planetaryRulers: {
      primary: { planet: "Mars", influence: 100, meaning: "Pure Martian energy - raw action, courage, conquest" }
    },
    
    qualities: {
      // MAXIMUM ARIES EXPRESSION
      courage: 100,              // MAXIMUM - absolutely fearless
      impulsivity: 100,          // MAXIMUM - instant action
      independence: 100,         // MAXIMUM - lone wolf
      competitiveness: 100,      // MAXIMUM - must win
      directness: 100,           // MAXIMUM - brutally honest
      pioneering: 100,           // MAXIMUM - first always
      assertiveness: 100,        // MAXIMUM - demands
      impatience: 100,           // MAXIMUM - NOW
      aggression: 95,            // Very high combat energy
      
      // PURE MARS QUALITIES
      warriorSpirit: 100,        // Born fighter
      leadershipDrive: 100,      // Natural commander
      survivalInstinct: 100,     // Primal life force
      dominance: 95,             // Must be first/best
      
      // BEHAVIORAL
      speed: 100,                // MAXIMUM (instant action)
      independence: 100,         // MAXIMUM
      patience: 10,              // Minimal (wants it NOW)
      stubbornness: 85,          // Very high (determined)
      riskTolerance: 100         // MAXIMUM (fearless)
    },
    
    strengths: [
      "Absolutely fearless courage",
      "Instant decisive action",
      "Natural born leader",
      "Pioneering trailblazer",
      "Unstoppable when committed"
    ],
    
    challenges: [
      "Recklessly impulsive",
      "Cannot work with others",
      "Aggressive to point of destructive",
      "Zero patience",
      "Burns out from constant fighting"
    ],
    
    famousExamples: [
      { name: "Leonardo da Vinci", degree: 5.01, note: "Pioneering genius in everything" },
      { name: "Mariah Carey", degree: 6.48, note: "Competitive fearless diva" }
    ],
    
    colorTheme: {
      primary: "#DC143C",    // Crimson
      secondary: "#B22222",  // Fire Brick
      gradient: "linear-gradient(135deg, #DC143C 0%, #B22222 100%)"
    }
  },

  {
    id: 3,
    name: "The Bold Innovator",
    degreeRange: { start: 10, end: 14.99 },
    description: "Aries-Leo blend: Pioneering courage meets creative confidence",
    
    elementalMix: {
      fire: 85,
      solarFire: 15  // Leo creative fire
    },
    
    planetaryRulers: {
      primary: { planet: "Mars", influence: 70, meaning: "Warrior courage" },
      secondary: { planet: "Sun", influence: 30, meaning: "Creative confidence, self-expression" }
    },
    
    qualities: {
      courage: 95,
      impulsivity: 90,
      independence: 90,
      competitiveness: 90,
      directness: 90,
      pioneering: 95,
      assertiveness: 90,
      impatience: 85,
      aggression: 80,
      
      // LEO INFLUENCE
      creativity: 80,            // Creative pioneering
      charisma: 85,              // Magnetic leadership
      confidence: 95,            // Unshakeable self-belief
      generosity: 70,            // Shares victories
      
      // BEHAVIORAL
      speed: 100,                // MAXIMUM (double fire)
      independence: 90,          // Very high
      patience: 20,              // Very low
      stubbornness: 85,          // Very high
      riskTolerance: 100         // MAXIMUM
    },
    
    strengths: [
      "Charismatic bold leadership",
      "Creative pioneering vision",
      "Confident fearless action",
      "Inspires through courage",
      "Generous victor"
    ],
    
    challenges: [
      "Egotistical competitive need",
      "Must be center of attention",
      "Dramatic impulsive action",
      "Cannot handle criticism",
      "Overestimates abilities"
    ],
    
    famousExamples: [
      { name: "Emma Watson", degree: 11.23, note: "Bold creative activist" },
      { name: "Sarah Jessica Parker", degree: 13.42, note: "Confident pioneering style icon" }
    ],
    
    colorTheme: {
      primary: "#FF0000",    // Pure Red
      secondary: "#FF8C00",  // Dark Orange
      gradient: "linear-gradient(135deg, #FF0000 0%, #FF8C00 100%)"
    }
  },

  {
    id: 4,
    name: "The Adventurous Warrior",
    degreeRange: { start: 15, end: 19.99 },
    description: "Aries-Sagittarius blend: Pioneering action meets philosophical vision",
    
    elementalMix: {
      fire: 70,
      jupiterianFire: 30  // Sagittarius philosophical fire
    },
    
    planetaryRulers: {
      primary: { planet: "Mars", influence: 60, meaning: "Warrior action" },
      secondary: { planet: "Jupiter", influence: 40, meaning: "Expansive vision, optimism" }
    },
    
    qualities: {
      courage: 95,
      impulsivity: 95,
      independence: 95,
      competitiveness: 85,
      directness: 95,
      pioneering: 100,           // MAXIMUM (explorer)
      assertiveness: 90,
      impatience: 90,
      aggression: 75,
      
      // SAGITTARIUS INFLUENCE
      philosophicalDepth: 75,    // Seeks meaning in action
      optimism: 90,              // Boundless enthusiasm
      adventurousness: 100,      // MAXIMUM exploration
      teachingAbility: 70,       // Shares discoveries
      
      // BEHAVIORAL
      speed: 100,                // MAXIMUM
      independence: 95,          // Extremely high
      patience: 25,              // Very low
      stubbornness: 75,          // High
      riskTolerance: 100         // MAXIMUM
    },
    
    strengths: [
      "Fearless adventurous exploration",
      "Philosophical warrior wisdom",
      "Optimistic pioneering spirit",
      "Inspires through bold vision",
      "Conquers new frontiers"
    ],
    
    challenges: [
      "Recklessly overcommits",
      "Scattered adventurous focus",
      "Preachy about experiences",
      "Cannot sustain commitment",
      "Restless even when winning"
    ],
    
    famousExamples: [
      { name: "Jackie Chan", degree: 16.15, note: "Adventurous fearless performer" },
      { name: "Kate Hudson", degree: 18.29, note: "Optimistic bold spirit" }
    ],
    
    colorTheme: {
      primary: "#FF4500",    // Orange Red
      secondary: "#FF6347",  // Tomato
      gradient: "linear-gradient(135deg, #FF4500 0%, #FF6347 100%)"
    }
  },

  {
    id: 5,
    name: "The Strategic Fighter",
    degreeRange: { start: 20, end: 24.99 },
    description: "Aries-Capricorn blend: Warrior courage meets strategic discipline",
    
    elementalMix: {
      fire: 75,
      earth: 25      // Capricorn strategic grounding
    },
    
    planetaryRulers: {
      primary: { planet: "Mars", influence: 70, meaning: "Warrior action" },
      secondary: { planet: "Saturn", influence: 30, meaning: "Strategic discipline, mastery" }
    },
    
    qualities: {
      courage: 90,
      impulsivity: 70,           // Tempered by Saturn
      independence: 90,
      competitiveness: 95,       // Must win strategically
      directness: 85,
      pioneering: 80,
      assertiveness: 90,
      impatience: 65,            // More patient than pure Aries
      aggression: 85,            // Controlled aggression
      
      // CAPRICORN INFLUENCE
      strategicThinking: 85,     // Plans battles
      discipline: 80,            // Controlled warrior
      ambition: 90,              // Climbs through conquest
      patience: 65,              // Medium-high (waits for victory)
      
      // BEHAVIORAL
      speed: 85,                 // Fast but calculated
      independence: 90,          // Very high
      patience: 65,              // Medium-high
      stubbornness: 90,          // Very high (determined)
      riskTolerance: 75          // High but calculated
    },
    
    strengths: [
      "Strategic warrior leadership",
      "Disciplined courageous action",
      "Climbs to victory methodically",
      "Controlled powerful aggression",
      "Builds through conquest"
    ],
    
    challenges: [
      "Cold calculated aggression",
      "Uses people strategically",
      "Workaholic warrior",
      "Ruthless ambition",
      "Difficulty with spontaneity"
    ],
    
    famousExamples: [
      { name: "Robert Downey Jr.", degree: 21.05, note: "Strategic career comeback warrior" },
      { name: "Reese Witherspoon", degree: 22.18, note: "Disciplined ambitious leader" }
    ],
    
    colorTheme: {
      primary: "#8B0000",    // Dark Red
      secondary: "#800000",  // Maroon
      gradient: "linear-gradient(135deg, #8B0000 0%, #800000 100%)"
    }
  },

  {
    id: 6,
    name: "The Grounded Initiator",
    degreeRange: { start: 25, end: 29.99 },
    description: "Aries-Taurus cusp: Pioneering action meets practical manifestation",
    
    elementalMix: {
      fire: 75,
      earth: 25      // Taurus grounding
    },
    
    planetaryRulers: {
      primary: { planet: "Mars", influence: 70, meaning: "Initiating action" },
      secondary: { planet: "Venus", influence: 30, meaning: "Material manifestation, sensory pleasure" }
    },
    
    qualities: {
      courage: 85,
      impulsivity: 75,           // More grounded
      independence: 85,
      competitiveness: 80,
      directness: 80,
      pioneering: 80,
      assertiveness: 85,
      impatience: 70,            // More patient
      aggression: 70,            // Softened
      
      // TAURUS INFLUENCE
      practicalSkills: 75,       // Manifests vision
      sensoryAwareness: 70,      // Enjoys conquest
      patience: 70,              // Higher than pure Aries
      loyalty: 75,               // More committed
      
      // BEHAVIORAL
      speed: 80,                 // Fast but grounded
      independence: 85,          // High
      patience: 70,              // Medium-high
      stubbornness: 95,          // Extremely high (Mars + Venus)
      riskTolerance: 75          // High but practical
    },
    
    strengths: [
      "Manifests pioneering vision practically",
      "Patient persistent courage",
      "Enjoys fruits of conquest",
      "Loyal determined warrior",
      "Balances action with grounding"
    ],
    
    challenges: [
      "Impossibly stubborn",
      "Possessive of victories",
      "Slow to pivot after commitment",
      "Materialistic conquest",
      "Difficulty with change"
    ],
    
    famousExamples: [
      { name: "Jessica Alba", degree: 26.42, note: "Grounded entrepreneurial warrior" },
      { name: "Keira Knightley", degree: 28.15, note: "Persistent practical determination" }
    ],
    
    colorTheme: {
      primary: "#CD5C5C",    // Indian Red
      secondary: "#A0522D",  // Sienna
      gradient: "linear-gradient(135deg, #CD5C5C 0%, #A0522D 100%)"
    }
  }
];

export const getAriesZoneByDegree = (degree) => {
  return ariesZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default ariesZones;
