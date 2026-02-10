// SCORPIO ZONES - COMPLETE IMPLEMENTATION
// Water Sign: Intense, transformative, powerful, psychic
// Ruled by Mars + Pluto: Power, transformation, death-rebirth, intensity

export const scorpioZones = [
  {
    id: 1,
    name: "The Intense Diplomat",
    degreeRange: { start: 0, end: 4.99 },
    description: "Libra-Scorpio Cusp: Diplomatic grace meets transformative intensity",
    
    // Elemental Influence
    elementalMix: {
      water: 75,    // Scorpio emotional depth
      air: 25       // Libra balanced perspective
    },
    
    // Planetary Influence
    planetaryRulers: {
      primary: { planet: "Pluto", influence: 60, meaning: "Transformative power" },
      secondary: { planet: "Mars", influence: 15, meaning: "Warrior energy" },
      tertiary: { planet: "Venus", influence: 25, meaning: "Harmonious relationships" }
    },
    
    // Core Qualities (0-100 scale)
    qualities: {
      // SCORPIO CORE TRAITS
      emotionalIntensity: 85,
      transformativePower: 80,
      psychologicalInsight: 85,
      loyalty: 90,
      jealousy: 70,
      secretiveness: 75,
      obsessiveness: 70,
      magnetism: 85,
      regeneration: 75,
      
      // LIBRA CUSP INFLUENCE
      diplomacy: 70,            // High for Scorpio
      socialGrace: 65,          // More socially skilled
      aestheticSense: 70,       // Appreciates beauty
      balanceSeeking: 50,       // Some moderation
      
      // BEHAVIORAL
      speed: 60,               // Medium-slow (deliberate intensity)
      independence: 75,        // High (self-sufficient)
      patience: 75,            // High (waits strategically)
      stubbornness: 85,        // Very high (Fixed Water)
      riskTolerance: 65        // Medium-high (calculated risks)
    },
    
    strengths: [
      "Diplomatic psychological power",
      "Transforms conflicts gracefully",
      "Magnetism with social skill",
      "Strategic intensity",
      "Balances depth with charm"
    ],
    
    challenges: [
      "Manipulative diplomacy",
      "Passive-aggressive when hurt",
      "Jealous in relationships",
      "Uses charm to hide intensity",
      "Power struggles disguised as harmony"
    ],
    
    famousExamples: [
      { name: "Katy Perry", degree: 0.18, note: "Intense romantic themes with pop appeal" },
      { name: "Ryan Gosling", degree: 3.42, note: "Magnetic charm with depth" }
    ],
    
    colorTheme: {
      primary: "#8B0000",    // Dark Red
      secondary: "#800020",  // Burgundy
      gradient: "linear-gradient(135deg, #8B0000 0%, #800020 100%)"
    }
  },

  {
    id: 2,
    name: "The Pure Transformer",
    degreeRange: { start: 5, end: 9.99 },
    description: "Pure Scorpio: Maximum intensity, depth, and transformative power",
    
    elementalMix: {
      water: 100    // Pure water element
    },
    
    planetaryRulers: {
      primary: { planet: "Pluto", influence: 70, meaning: "Pure transformative death-rebirth power" },
      secondary: { planet: "Mars", influence: 30, meaning: "Warrior intensity" }
    },
    
    qualities: {
      // MAXIMUM SCORPIO EXPRESSION
      emotionalIntensity: 100,  // MAXIMUM - all or nothing
      transformativePower: 100, // MAXIMUM - phoenix energy
      psychologicalInsight: 100,// MAXIMUM - x-ray vision into souls
      loyalty: 100,             // MAXIMUM - ride or die
      jealousy: 95,             // Extreme possessiveness
      secretiveness: 100,       // Absolute mystery
      obsessiveness: 100,       // All-consuming focus
      magnetism: 100,           // Irresistible pull
      regeneration: 100,        // Rises from death
      
      // PURE PLUTO-MARS QUALITIES
      powerDrive: 100,          // Must have control
      penetration: 100,         // Sees through everything
      extremism: 100,           // No middle ground
      
      // BEHAVIORAL
      speed: 50,               // Slow (strategic patience)
      independence: 85,        // Very high (trusts no one)
      patience: 90,            // Very high (waits for perfect strike)
      stubbornness: 95,        // Extremely high (immovable)
      riskTolerance: 75        // High (fearless when obsessed)
    },
    
    strengths: [
      "Transforms anything through sheer will",
      "Psychic-level insight into people",
      "Unshakeable loyalty to chosen few",
      "Rises from any destruction",
      "Unstoppable when obsessed"
    ],
    
    challenges: [
      "Destroys self and others in transformation",
      "Paranoid trust issues",
      "Vengeful beyond reason",
      "Obsessive to point of madness",
      "Cannot forgive betrayal"
    ],
    
    famousExamples: [
      { name: "Leonardo DiCaprio", degree: 5.51, note: "Intense method acting, transformative roles" },
      { name: "Pablo Picasso", degree: 8.19, note: "Transformative artistic power" }
    ],
    
    colorTheme: {
      primary: "#660000",    // Blood Red
      secondary: "#330000",  // Almost Black Red
      gradient: "linear-gradient(135deg, #660000 0%, #330000 100%)"
    }
  },

  {
    id: 3,
    name: "The Mystical Healer",
    degreeRange: { start: 10, end: 14.99 },
    description: "Scorpio-Pisces blend: Transformative power meets spiritual transcendence",
    
    elementalMix: {
      water: 85,
      spiritualWater: 15  // Pisces mystical compassion
    },
    
    planetaryRulers: {
      primary: { planet: "Pluto", influence: 60, meaning: "Transformative depth" },
      secondary: { planet: "Mars", influence: 20, meaning: "Warrior energy" },
      tertiary: { planet: "Neptune", influence: 20, meaning: "Spiritual transcendence" }
    },
    
    qualities: {
      emotionalIntensity: 95,
      transformativePower: 95,
      psychologicalInsight: 95,
      loyalty: 90,
      jealousy: 75,          // Less possessive (Pisces softens)
      secretiveness: 85,
      obsessiveness: 85,
      magnetism: 90,
      regeneration: 95,
      
      // PISCES INFLUENCE
      spiritualConnection: 85,  // Transforms through spirit
      compassion: 80,          // Heals wounds
      boundaryDissolution: 70, // Merges in transformation
      artisticExpression: 80,  // Expresses depth through art
      
      // BEHAVIORAL
      speed: 45,               // Slow (spiritual timing)
      independence: 70,        // High but spiritually connected
      patience: 95,            // Infinite (spiritual time)
      stubbornness: 80,        // High but flows
      riskTolerance: 70        // High (faith in transformation)
    },
    
    strengths: [
      "Transforms pain into spiritual wisdom",
      "Heals deep trauma in self/others",
      "Compassionate psychological insight",
      "Mystical regenerative power",
      "Forgives through spiritual understanding"
    ],
    
    challenges: [
      "Lost in spiritual depths",
      "Martyrdom through transformation",
      "Escapist when intensity overwhelms",
      "Boundary confusion with others",
      "Addictive personality (transcendence-seeking)"
    ],
    
    famousExamples: [
      { name: "Whoopi Goldberg", degree: 11.15, note: "Transformative healing comedy" },
      { name: "Jodie Foster", degree: 13.28, note: "Deep psychological roles" }
    ],
    
    colorTheme: {
      primary: "#4B0082",    // Indigo
      secondary: "#483D8B",  // Dark Slate Blue
      gradient: "linear-gradient(135deg, #4B0082 0%, #483D8B 100%)"
    }
  },

  {
    id: 4,
    name: "The Deep Regenerator",
    degreeRange: { start: 15, end: 19.99 },
    description: "Scorpio-Pisces decan: Peak water energy - transformation meets redemption",
    
    elementalMix: {
      water: 70,
      spiritualWater: 30  // Strong Pisces
    },
    
    planetaryRulers: {
      primary: { planet: "Pluto", influence: 50, meaning: "Death-rebirth cycles" },
      secondary: { planet: "Neptune", influence: 30, meaning: "Spiritual dissolution" },
      tertiary: { planet: "Mars", influence: 20, meaning: "Life force" }
    },
    
    qualities: {
      emotionalIntensity: 90,
      transformativePower: 100,  // MAXIMUM regeneration
      psychologicalInsight: 90,
      loyalty: 85,
      jealousy: 65,              // Softened by spirituality
      secretiveness: 75,
      obsessiveness: 75,
      magnetism: 85,
      regeneration: 100,         // MAXIMUM phoenix power
      
      // NEPTUNE DOMINANCE
      spiritualConnection: 95,   // Deep mystical connection
      compassion: 90,            // Universal compassion
      redemption: 95,            // Transforms evil to good
      transcendence: 85,         // Goes beyond ego
      
      // BEHAVIORAL
      speed: 40,                 // Very slow (cosmic timing)
      independence: 65,          // Medium-high (spiritually connected)
      patience: 100,             // MAXIMUM (eternal patience)
      stubbornness: 70,          // Medium-high (flows with spirit)
      riskTolerance: 75          // High (faith in rebirth)
    },
    
    strengths: [
      "Redeems the unredeemable",
      "Transforms darkness into light",
      "Infinite regenerative capacity",
      "Spiritual depth psychology",
      "Forgives and transcends all wounds"
    ],
    
    challenges: [
      "Martyrdom complex",
      "Loses self in others' darkness",
      "Addictive escapism",
      "Cannot maintain boundaries",
      "Spiritual bypassing of real issues"
    ],
    
    famousExamples: [
      { name: "Martin Scorsese", degree: 16.23, note: "Transforms violence into art" },
      { name: "Joaquin Phoenix", degree: 18.47, note: "Deep redemptive performances" }
    ],
    
    colorTheme: {
      primary: "#191970",    // Midnight Blue
      secondary: "#000080",  // Navy
      gradient: "linear-gradient(135deg, #191970 0%, #000080 100%)"
    }
  },

  {
    id: 5,
    name: "The Protective Warrior",
    degreeRange: { start: 20, end: 24.99 },
    description: "Scorpio-Cancer blend: Transformative power meets nurturing protection",
    
    elementalMix: {
      water: 85,
      emotionalWater: 15  // Cancer nurturing instinct
    },
    
    planetaryRulers: {
      primary: { planet: "Pluto", influence: 55, meaning: "Transformative protection" },
      secondary: { planet: "Mars", influence: 25, meaning: "Warrior defense" },
      tertiary: { planet: "Moon", influence: 20, meaning: "Emotional nurturing" }
    },
    
    qualities: {
      emotionalIntensity: 95,
      transformativePower: 85,
      psychologicalInsight: 90,
      loyalty: 100,              // MAXIMUM family loyalty
      jealousy: 90,              // Very possessive
      secretiveness: 90,
      obsessiveness: 90,
      magnetism: 85,
      regeneration: 85,
      
      // CANCER INFLUENCE
      nurturingInstinct: 85,     // Fiercely protective nurturing
      protectiveness: 100,       // MAXIMUM - will kill for family
      emotionalMemory: 95,       // Never forgets wounds
      homeOrientation: 75,       // Safe fortress
      
      // BEHAVIORAL
      speed: 55,                 // Medium-slow
      independence: 70,          // High but needs family
      patience: 85,              // Very high (waits to protect)
      stubbornness: 95,          // Extremely high
      riskTolerance: 80          // High when protecting
    },
    
    strengths: [
      "Unstoppable protector of family",
      "Transforms threats into allies",
      "Nurtures through intensity",
      "Creates impenetrable safe space",
      "Loyal beyond death"
    ],
    
    challenges: [
      "Smothering overprotection",
      "Paranoid about threats",
      "Vengeful if family hurt",
      "Cannot let go of past wounds",
      "Possessive control of loved ones"
    ],
    
    famousExamples: [
      { name: "Scarlett Johansson", degree: 21.15, note: "Fierce protective roles" },
      { name: "Owen Wilson", degree: 23.42, note: "Loyal friend archetype" }
    ],
    
    colorTheme: {
      primary: "#8B0000",    // Dark Red
      secondary: "#4B0000",  // Very Dark Red
      gradient: "linear-gradient(135deg, #8B0000 0%, #4B0000 100%)"
    }
  },

  {
    id: 6,
    name: "The Alchemical Master",
    degreeRange: { start: 25, end: 29.99 },
    description: "Scorpio-Sagittarius cusp: Transformative depth meets philosophical expansion",
    
    elementalMix: {
      water: 75,
      fire: 25      // Sagittarius adventurous spirit
    },
    
    planetaryRulers: {
      primary: { planet: "Pluto", influence: 60, meaning: "Transformative power" },
      secondary: { planet: "Mars", influence: 20, meaning: "Warrior courage" },
      tertiary: { planet: "Jupiter", influence: 20, meaning: "Expansive wisdom" }
    },
    
    qualities: {
      emotionalIntensity: 85,
      transformativePower: 90,
      psychologicalInsight: 90,
      loyalty: 85,
      jealousy: 70,              // Less possessive (Sag freedom)
      secretiveness: 75,         // More open (Sag honesty)
      obsessiveness: 75,
      magnetism: 90,
      regeneration: 90,
      
      // SAGITTARIUS INFLUENCE
      philosophicalDepth: 85,    // Seeks meaning in transformation
      adventurousness: 75,       // Explores depths fearlessly
      optimism: 70,              // Faith in transformation
      teachingAbility: 80,       // Shares transformative wisdom
      
      // BEHAVIORAL
      speed: 65,                 // Medium (Fire speeds Water)
      independence: 80,          // Very high
      patience: 70,              // Medium-high
      stubbornness: 75,          // High
      riskTolerance: 85          // Very high (fearless explorer)
    },
    
    strengths: [
      "Transforms through adventure",
      "Philosophical depth psychology",
      "Teaches transformative wisdom",
      "Optimistic about regeneration",
      "Explores psychological depths fearlessly"
    ],
    
    challenges: [
      "Reckless transformation",
      "Preachy about darkness",
      "Restless with depth work",
      "Oversimplifies complex psychology",
      "Commitment issues (wants freedom)"
    ],
    
    famousExamples: [
      { name: "Scarlett Johansson", degree: 25.18, note: "Adventurous intensity" },
      { name: "Charles Manson", degree: 27.42, note: "Dark charismatic teaching (shadow)" }
    ],
    
    colorTheme: {
      primary: "#8B4513",    // Saddle Brown
      secondary: "#A0522D",  // Sienna
      gradient: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)"
    }
  }
];

export const getScorpioZoneByDegree = (degree) => {
  return scorpioZones.find(zone => 
    degree >= zone.degreeRange.start && degree <= zone.degreeRange.end
  );
};

export default scorpioZones;
