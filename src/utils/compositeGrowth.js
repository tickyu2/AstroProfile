/**
 * Composite Growth Path Engine
 *
 * Based on Liz Greene's concept of the chart as a map of psychological development.
 * Every relationship has a growth path — a journey from unconscious patterns
 * to conscious partnership. This module maps that path.
 *
 * The relationship is not static. It is alive, evolving, becoming.
 * This engine reveals what it is becoming.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH PHASES BY COMPOSITE SUN
// The overarching developmental journey
// ═══════════════════════════════════════════════════════════════════════════

const GROWTH_PATH_BY_SUN = {
  Aries: {
    phase1: {
      name: 'The Spark',
      description: 'Initial attraction through excitement and challenge',
      task: 'Discovering shared courage and the thrill of beginning together',
      duration: 'First 6 months to 2 years'
    },
    phase2: {
      name: 'The Battle',
      description: 'Conflict emerges over leadership and independence',
      task: 'Learning to fight fairly without destroying the bond',
      duration: '2-5 years'
    },
    phase3: {
      name: 'The Alliance',
      description: 'Mature partnership through respect for each other\'s fire',
      task: 'Becoming warriors FOR each other rather than against',
      duration: '5+ years'
    },
    ultimateGrowth: 'From selfish courage to shared heroism'
  },
  Taurus: {
    phase1: {
      name: 'The Attraction',
      description: 'Initial bonding through pleasure, comfort, and security',
      task: 'Building the physical and material foundation',
      duration: 'First 1-3 years'
    },
    phase2: {
      name: 'The Settling',
      description: 'Risk of stagnation as comfort becomes complacency',
      task: 'Maintaining growth within stability',
      duration: '3-7 years'
    },
    phase3: {
      name: 'The Abundance',
      description: 'Mature partnership as source of genuine wealth',
      task: 'Creating lasting value that nourishes beyond yourselves',
      duration: '7+ years'
    },
    ultimateGrowth: 'From possessive attachment to generous stewardship'
  },
  Gemini: {
    phase1: {
      name: 'The Connection',
      description: 'Initial bonding through mental stimulation and communication',
      task: 'Discovering the joy of endless conversation',
      duration: 'First 6 months to 2 years'
    },
    phase2: {
      name: 'The Dispersal',
      description: 'Risk of scattering energy and avoiding depth',
      task: 'Learning to go deep while staying curious',
      duration: '2-5 years'
    },
    phase3: {
      name: 'The Wisdom',
      description: 'Mature partnership through integrated understanding',
      task: 'Becoming wisdom-partners who teach and learn together',
      duration: '5+ years'
    },
    ultimateGrowth: 'From scattered curiosity to integrated wisdom'
  },
  Cancer: {
    phase1: {
      name: 'The Nesting',
      description: 'Initial bonding through emotional security and nurturing',
      task: 'Creating the "us" against the world',
      duration: 'First 1-3 years'
    },
    phase2: {
      name: 'The Enmeshment',
      description: 'Risk of emotional fusion and dependency',
      task: 'Learning to nurture without suffocating',
      duration: '3-7 years'
    },
    phase3: {
      name: 'The Sanctuary',
      description: 'Mature partnership as emotional home for both',
      task: 'Creating family that supports individual growth',
      duration: '7+ years'
    },
    ultimateGrowth: 'From emotional dependency to emotional mastery'
  },
  Leo: {
    phase1: {
      name: 'The Romance',
      description: 'Initial bonding through admiration and dramatic love',
      task: 'Celebrating each other\'s specialness',
      duration: 'First 1-2 years'
    },
    phase2: {
      name: 'The Competition',
      description: 'Risk of ego battles and attention competition',
      task: 'Learning to shine together rather than compete for spotlight',
      duration: '2-5 years'
    },
    phase3: {
      name: 'The Co-Creation',
      description: 'Mature partnership through shared creative expression',
      task: 'Creating something together that outlasts you both',
      duration: '5+ years'
    },
    ultimateGrowth: 'From needing admiration to generating warmth'
  },
  Virgo: {
    phase1: {
      name: 'The Helping',
      description: 'Initial bonding through service and mutual improvement',
      task: 'Discovering the joy of being useful to each other',
      duration: 'First 1-2 years'
    },
    phase2: {
      name: 'The Criticism',
      description: 'Risk of perfectionism destroying acceptance',
      task: 'Learning to accept imperfection while still growing',
      duration: '2-5 years'
    },
    phase3: {
      name: 'The Healing',
      description: 'Mature partnership as mutual healing and refinement',
      task: 'Becoming healers together, for each other and the world',
      duration: '5+ years'
    },
    ultimateGrowth: 'From critical perfectionism to compassionate service'
  },
  Libra: {
    phase1: {
      name: 'The Pairing',
      description: 'Initial bonding through romantic idealization and balance',
      task: 'Discovering the art of being a couple',
      duration: 'First 1-3 years'
    },
    phase2: {
      name: 'The Imbalance',
      description: 'Risk of losing self in pursuit of harmony',
      task: 'Learning that real balance includes conflict',
      duration: '3-7 years'
    },
    phase3: {
      name: 'The Partnership',
      description: 'Mature partnership modeling conscious relating',
      task: 'Becoming a model of what partnership can be',
      duration: '7+ years'
    },
    ultimateGrowth: 'From codependent harmony to interdependent love'
  },
  Scorpio: {
    phase1: {
      name: 'The Intensity',
      description: 'Initial bonding through magnetic attraction and depth',
      task: 'Surrendering to the transformative power of intimacy',
      duration: 'First 1-2 years'
    },
    phase2: {
      name: 'The Crisis',
      description: 'Power struggles and the confrontation with shadow',
      task: 'Surviving the dark night without destroying each other',
      duration: '2-7 years'
    },
    phase3: {
      name: 'The Rebirth',
      description: 'Mature partnership forged in the fires of transformation',
      task: 'Becoming midwives for each other\'s ongoing rebirth',
      duration: '7+ years'
    },
    ultimateGrowth: 'From controlling intensity to transformative intimacy'
  },
  Sagittarius: {
    phase1: {
      name: 'The Adventure',
      description: 'Initial bonding through shared enthusiasm and exploration',
      task: 'Discovering that life together is an adventure',
      duration: 'First 1-3 years'
    },
    phase2: {
      name: 'The Restlessness',
      description: 'Risk of commitment avoidance and perpetual seeking',
      task: 'Learning that depth is found by staying, not leaving',
      duration: '3-7 years'
    },
    phase3: {
      name: 'The Quest',
      description: 'Mature partnership as shared journey toward meaning',
      task: 'Becoming fellow pilgrims on the path of truth',
      duration: '7+ years'
    },
    ultimateGrowth: 'From escapist seeking to grounded wisdom'
  },
  Capricorn: {
    phase1: {
      name: 'The Building',
      description: 'Initial bonding through shared ambition and structure',
      task: 'Creating the foundation and working toward shared goals',
      duration: 'First 2-5 years'
    },
    phase2: {
      name: 'The Coldness',
      description: 'Risk of duty replacing love, achievement replacing intimacy',
      task: 'Learning that success means nothing without connection',
      duration: '5-10 years'
    },
    phase3: {
      name: 'The Legacy',
      description: 'Mature partnership as vehicle for lasting contribution',
      task: 'Building something that matters beyond yourselves',
      duration: '10+ years'
    },
    ultimateGrowth: 'From achievement-obsessed to meaningful contribution'
  },
  Aquarius: {
    phase1: {
      name: 'The Friendship',
      description: 'Initial bonding through intellectual connection and ideals',
      task: 'Discovering that you are friends as well as lovers',
      duration: 'First 1-3 years'
    },
    phase2: {
      name: 'The Distance',
      description: 'Risk of emotional detachment and commitment avoidance',
      task: 'Learning that intimacy and freedom can coexist',
      duration: '3-7 years'
    },
    phase3: {
      name: 'The Vision',
      description: 'Mature partnership serving humanitarian ideals',
      task: 'Becoming a force for positive change together',
      duration: '7+ years'
    },
    ultimateGrowth: 'From detached idealism to engaged compassion'
  },
  Pisces: {
    phase1: {
      name: 'The Merging',
      description: 'Initial bonding through spiritual-romantic fusion',
      task: 'Experiencing the transcendence of boundary dissolution',
      duration: 'First 1-2 years'
    },
    phase2: {
      name: 'The Disillusionment',
      description: 'Risk of escapism, victimhood, or losing reality',
      task: 'Learning to love the real person, not the fantasy',
      duration: '2-5 years'
    },
    phase3: {
      name: 'The Sacred',
      description: 'Mature partnership as spiritual practice',
      task: 'Making the relationship a vehicle for awakening',
      duration: '5+ years'
    },
    ultimateGrowth: 'From escapist merging to grounded transcendence'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH EDGE BY COMPOSITE MOON
// The emotional work required for growth
// ═══════════════════════════════════════════════════════════════════════════

const EMOTIONAL_GROWTH_BY_MOON = {
  Aries: {
    growthEdge: 'Learning to pause before reacting emotionally',
    emotionalWork: 'The relationship grows by developing patience with feelings',
    practice: 'Count to ten before responding to emotional triggers'
  },
  Taurus: {
    growthEdge: 'Learning to let go of emotional possessiveness',
    emotionalWork: 'The relationship grows by allowing change within security',
    practice: 'Practice releasing attachment to how things "should" feel'
  },
  Gemini: {
    growthEdge: 'Learning to feel without analyzing',
    emotionalWork: 'The relationship grows by sitting with emotions before explaining them',
    practice: 'Spend time just feeling together without words'
  },
  Cancer: {
    growthEdge: 'Learning to nurture without enabling',
    emotionalWork: 'The relationship grows by supporting independence within closeness',
    practice: 'Allow each other to struggle when growth requires it'
  },
  Leo: {
    growthEdge: 'Learning to feel ordinary feelings',
    emotionalWork: 'The relationship grows by accepting undramatic emotions',
    practice: 'Honor quiet contentment as much as passionate highs'
  },
  Virgo: {
    growthEdge: 'Learning to accept imperfect emotions',
    emotionalWork: 'The relationship grows by not trying to fix every feeling',
    practice: 'Allow messy emotions without immediate improvement plans'
  },
  Libra: {
    growthEdge: 'Learning to tolerate emotional disharmony',
    emotionalWork: 'The relationship grows by allowing conflict to exist',
    practice: 'Stay with discord without immediately smoothing it over'
  },
  Scorpio: {
    growthEdge: 'Learning to trust without proof',
    emotionalWork: 'The relationship grows by releasing emotional surveillance',
    practice: 'Practice trusting without needing to know everything'
  },
  Sagittarius: {
    growthEdge: 'Learning to stay with difficult emotions',
    emotionalWork: 'The relationship grows by not escaping into meaning',
    practice: 'Feel the sadness without finding the silver lining immediately'
  },
  Capricorn: {
    growthEdge: 'Learning to feel without controlling',
    emotionalWork: 'The relationship grows by allowing emotional vulnerability',
    practice: 'Express need without framing it as strength'
  },
  Aquarius: {
    growthEdge: 'Learning to be emotionally warm',
    emotionalWork: 'The relationship grows by dropping intellectual distance',
    practice: 'Express feelings directly without ironic detachment'
  },
  Pisces: {
    growthEdge: 'Learning to feel without drowning',
    emotionalWork: 'The relationship grows by developing emotional boundaries',
    practice: 'Know whose feelings are whose without disconnecting'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH CATALYSTS BY JUPITER
// What expands and develops the relationship
// ═══════════════════════════════════════════════════════════════════════════

const GROWTH_CATALYSTS_BY_JUPITER = {
  Aries: { catalyst: 'New beginnings and bold ventures', activity: 'Starting projects together, taking risks' },
  Taurus: { catalyst: 'Building wealth and enjoying pleasure', activity: 'Creating beauty, enjoying nature, financial growth' },
  Gemini: { catalyst: 'Learning and communication', activity: 'Taking classes together, endless conversations, travel' },
  Cancer: { catalyst: 'Family and emotional depth', activity: 'Creating home, family activities, nurturing projects' },
  Leo: { catalyst: 'Creative expression and celebration', activity: 'Art projects, performances, celebrations' },
  Virgo: { catalyst: 'Service and health improvement', activity: 'Volunteer work together, health regimens, organizing' },
  Libra: { catalyst: 'Partnership activities and aesthetics', activity: 'Couple activities, art appreciation, social events' },
  Scorpio: { catalyst: 'Deep exploration and transformation', activity: 'Therapy together, occult studies, facing fears' },
  Sagittarius: { catalyst: 'Travel and philosophical exploration', activity: 'Long journeys, spiritual seeking, higher education' },
  Capricorn: { catalyst: 'Achievement and structure building', activity: 'Business ventures, career collaboration, legacy building' },
  Aquarius: { catalyst: 'Innovation and humanitarian work', activity: 'Community involvement, technology projects, social causes' },
  Pisces: { catalyst: 'Spiritual practice and artistic creation', activity: 'Meditation together, artistic collaboration, compassion work' }
};

// ═══════════════════════════════════════════════════════════════════════════
// NORTH NODE GROWTH DIRECTION
// Where the relationship needs to go
// ═══════════════════════════════════════════════════════════════════════════

const NORTH_NODE_DIRECTION = {
  Aries: { direction: 'Independence', growth: 'Developing courage and initiative together' },
  Taurus: { direction: 'Stability', growth: 'Building lasting value and peace' },
  Gemini: { direction: 'Communication', growth: 'Learning to truly hear each other' },
  Cancer: { direction: 'Nurturing', growth: 'Creating genuine emotional home' },
  Leo: { direction: 'Expression', growth: 'Shining your unique light together' },
  Virgo: { direction: 'Service', growth: 'Being genuinely useful in the world' },
  Libra: { direction: 'Partnership', growth: 'Mastering the art of conscious relating' },
  Scorpio: { direction: 'Depth', growth: 'Facing shadow and transforming together' },
  Sagittarius: { direction: 'Meaning', growth: 'Finding and living shared truth' },
  Capricorn: { direction: 'Achievement', growth: 'Building something lasting together' },
  Aquarius: { direction: 'Vision', growth: 'Serving humanity while loving each other' },
  Pisces: { direction: 'Transcendence', growth: 'Making love a spiritual practice' }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the growth path profile of a composite chart
 *
 * @param {Object} compositeChart - Composite chart from compositeGenerator
 * @returns {Object} Growth path profile of the relationship
 */
export function buildCompositeGrowth(compositeChart) {
  if (!compositeChart || !compositeChart.planets) {
    return null;
  }

  const planets = compositeChart.planets;

  // Extract key placements
  const sunSign = planets.Sun?.sign;
  const moonSign = planets.Moon?.sign;
  const jupiterSign = planets.Jupiter?.sign;
  const northNodeSign = planets['North Node']?.sign;

  const growth = {
    // Developmental Path (Sun)
    developmentalPath: sunSign ? {
      sign: sunSign,
      ...GROWTH_PATH_BY_SUN[sunSign]
    } : null,

    // Emotional Growth Work (Moon)
    emotionalGrowth: moonSign ? {
      sign: moonSign,
      ...EMOTIONAL_GROWTH_BY_MOON[moonSign]
    } : null,

    // Growth Catalysts (Jupiter)
    catalysts: jupiterSign ? {
      sign: jupiterSign,
      ...GROWTH_CATALYSTS_BY_JUPITER[jupiterSign]
    } : null,

    // North Node Direction
    evolutionaryDirection: northNodeSign ? {
      sign: northNodeSign,
      ...NORTH_NODE_DIRECTION[northNodeSign]
    } : null,

    // Integrated Growth Summary
    integratedPath: generateIntegratedPath(sunSign, moonSign, northNodeSign),

    // Current Phase Estimate
    phaseGuidance: generatePhaseGuidance(sunSign),

    // Growth Practices
    practices: generateGrowthPractices(sunSign, moonSign, jupiterSign)
  };

  return growth;
}

/**
 * Generate integrated growth path
 */
function generateIntegratedPath(sunSign, moonSign, northNodeSign) {
  if (!sunSign) return null;

  const parts = [];

  if (sunSign) {
    const path = GROWTH_PATH_BY_SUN[sunSign];
    parts.push(`This relationship is on a journey ${path?.ultimateGrowth?.toLowerCase() || 'of growth'}.`);
  }

  if (moonSign) {
    const edge = EMOTIONAL_GROWTH_BY_MOON[moonSign];
    parts.push(`The emotional work involves ${edge?.growthEdge?.toLowerCase() || 'development'}.`);
  }

  if (northNodeSign) {
    const direction = NORTH_NODE_DIRECTION[northNodeSign];
    parts.push(`The ultimate direction is toward ${direction?.direction?.toLowerCase() || 'evolution'}.`);
  }

  return parts.join(' ');
}

/**
 * Generate phase guidance
 */
function generatePhaseGuidance(sunSign) {
  if (!sunSign) return null;

  const path = GROWTH_PATH_BY_SUN[sunSign];
  if (!path) return null;

  return {
    phases: [
      { number: 1, ...path.phase1 },
      { number: 2, ...path.phase2 },
      { number: 3, ...path.phase3 }
    ],
    note: 'These phases are approximate. Real relationships don\'t follow linear timelines. Use this as a map, not a schedule.'
  };
}

/**
 * Generate growth practices
 */
function generateGrowthPractices(sunSign, moonSign, jupiterSign) {
  const practices = [];

  if (moonSign && EMOTIONAL_GROWTH_BY_MOON[moonSign]) {
    practices.push({
      category: 'Emotional',
      practice: EMOTIONAL_GROWTH_BY_MOON[moonSign].practice
    });
  }

  if (jupiterSign && GROWTH_CATALYSTS_BY_JUPITER[jupiterSign]) {
    practices.push({
      category: 'Expansion',
      practice: GROWTH_CATALYSTS_BY_JUPITER[jupiterSign].activity
    });
  }

  // Add Sun-based practice
  const sunPractices = {
    Aries: 'Take on new challenges together regularly',
    Taurus: 'Create something tangible together each season',
    Gemini: 'Schedule weekly learning adventures',
    Cancer: 'Build traditions that deepen belonging',
    Leo: 'Celebrate each other\'s victories publicly',
    Virgo: 'Find a shared service project',
    Libra: 'Practice conflict resolution as an art',
    Scorpio: 'Do shadow work together regularly',
    Sagittarius: 'Plan annual adventures to new places',
    Capricorn: 'Set and review shared goals quarterly',
    Aquarius: 'Contribute to causes together',
    Pisces: 'Develop a shared spiritual practice'
  };

  if (sunSign && sunPractices[sunSign]) {
    practices.push({
      category: 'Identity',
      practice: sunPractices[sunSign]
    });
  }

  return practices;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the growth phases
 */
export function getGrowthPhases(compositeChart) {
  const sunSign = compositeChart?.planets?.Sun?.sign;
  if (!sunSign) return null;

  const path = GROWTH_PATH_BY_SUN[sunSign];
  return path ? [path.phase1, path.phase2, path.phase3] : null;
}

/**
 * Get the ultimate growth goal
 */
export function getUltimateGrowth(compositeChart) {
  const sunSign = compositeChart?.planets?.Sun?.sign;
  if (!sunSign) return null;

  return GROWTH_PATH_BY_SUN[sunSign]?.ultimateGrowth || null;
}

/**
 * Get emotional growth edge
 */
export function getEmotionalGrowthEdge(compositeChart) {
  const moonSign = compositeChart?.planets?.Moon?.sign;
  if (!moonSign) return null;

  return EMOTIONAL_GROWTH_BY_MOON[moonSign]?.growthEdge || null;
}

/**
 * Get growth catalysts
 */
export function getGrowthCatalysts(compositeChart) {
  const jupiterSign = compositeChart?.planets?.Jupiter?.sign;
  if (!jupiterSign) return null;

  return GROWTH_CATALYSTS_BY_JUPITER[jupiterSign] || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositeGrowth,
  getGrowthPhases,
  getUltimateGrowth,
  getEmotionalGrowthEdge,
  getGrowthCatalysts,
  // Export data for customization
  GROWTH_PATH_BY_SUN,
  EMOTIONAL_GROWTH_BY_MOON,
  GROWTH_CATALYSTS_BY_JUPITER,
  NORTH_NODE_DIRECTION
};
