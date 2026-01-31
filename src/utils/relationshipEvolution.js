/**
 * Relationship Archetype Evolution Engine
 * ========================================
 *
 * Based on Liz Greene's "Relating" - Chapter on Relationship Development
 *
 * "Relationships are not static entities but living organisms that evolve
 * through predictable developmental stages. Each stage brings its own
 * challenges, gifts, and opportunities for deeper union or dissolution."
 *
 * This engine tracks how a relationship's myth, psyche, and contract
 * evolve across Saturn cycles, composite shifts, and synastry activations.
 *
 * The 7 Stages of Relationship Evolution:
 * 1. Birth of the Bond (Year 0) - Projection paradise
 * 2. First Saturn Square (Year 7) - Reality testing
 * 3. Opposition Phase (Year 14) - Crisis of meaning
 * 4. Second Square (Year 21) - Mature restructuring
 * 5. First Saturn Return (Year 29) - Death and rebirth
 * 6. Uranus Opposition Overlay (Year 44) - Midlife transformation
 * 7. Second Saturn Return (Year 58) - Elder wisdom integration
 */

// ============================================================================
// SATURN CYCLE STAGES - The 7 Gates of Relationship Evolution
// ============================================================================

const EVOLUTION_STAGES = {
  birthOfBond: {
    yearRange: [0, 7],
    title: 'Birth of the Bond',
    saturnPhase: 'Conjunction to First Square',
    archetype: 'The Lovers',
    myth: 'Paradise Found',
    psychologicalTask: 'Establishing the container',
    shiftReason: 'Initial projection creates the bond',
    growthTheme: 'Learning to see the other as separate self',
    shadowTheme: 'Merger anxiety, loss of individual identity',
    compositeActivation: 'Sun-Moon conjunction energy dominates',
    keyQuestions: [
      'What dream are we building together?',
      'What am I projecting onto my partner?',
      'Can I love the real person emerging?'
    ],
    rituals: [
      'Create shared vision board',
      'Establish communication rituals',
      'Define relationship values together'
    ],
    dangers: [
      'Confusing projection with reality',
      'Losing self in the other',
      'Avoiding difficult conversations'
    ],
    gifts: [
      'Joy of discovery',
      'Expansion of self through other',
      'Foundation for lasting bond'
    ]
  },

  firstSaturnSquare: {
    yearRange: [7, 14],
    title: 'First Saturn Square',
    saturnPhase: 'First Square',
    archetype: 'The Builders',
    myth: 'Paradise Lost',
    psychologicalTask: 'Reality testing the dream',
    shiftReason: 'Projections begin to fail, real person emerges',
    growthTheme: 'Accepting limitations while honoring potential',
    shadowTheme: 'Disappointment, blame, escape fantasies',
    compositeActivation: 'Saturn aspects become prominent',
    keyQuestions: [
      'Can I love who they actually are?',
      'What must I accept vs. what must change?',
      'Is this relationship worth the work?'
    ],
    rituals: [
      'Honest inventory of relationship',
      'Renegotiate unspoken contracts',
      'Establish new boundaries'
    ],
    dangers: [
      'Chronic disappointment',
      'Bitter resignation',
      'Seeking excitement elsewhere'
    ],
    gifts: [
      'Authentic intimacy',
      'Mature love replacing infatuation',
      'Stronger foundation through truth'
    ]
  },

  oppositionPhase: {
    yearRange: [14, 21],
    title: 'Opposition Phase',
    saturnPhase: 'Opposition',
    archetype: 'The Warriors',
    myth: 'The Dark Night',
    psychologicalTask: 'Confronting the shadow of the bond',
    shiftReason: 'Full projection return - seeing what was hidden',
    growthTheme: 'Integration of opposites within relationship',
    shadowTheme: 'Power struggles, mutual projection, crisis',
    compositeActivation: 'Pluto and 8th house themes emerge',
    keyQuestions: [
      'What shadow am I seeing in my partner?',
      'What part of myself have I denied?',
      'Can we transform together?'
    ],
    rituals: [
      'Shadow work together',
      'Conscious conflict resolution',
      'Renewal of vows with awareness'
    ],
    dangers: [
      'Destructive conflict',
      'Projection warfare',
      'Complete breakdown'
    ],
    gifts: [
      'Deep psychological intimacy',
      'Individual and relational wholeness',
      'Unshakeable bond through crisis'
    ]
  },

  secondSquare: {
    yearRange: [21, 29],
    title: 'Second Saturn Square',
    saturnPhase: 'Last Square',
    archetype: 'The Elders-in-Training',
    myth: 'The Reconstruction',
    psychologicalTask: 'Mature restructuring of the bond',
    shiftReason: 'Wisdom from crisis enables conscious redesign',
    growthTheme: 'Building sustainable structures for long-term',
    shadowTheme: 'Rigidity, fear of change, stagnation',
    compositeActivation: 'Jupiter-Saturn balance becomes key',
    keyQuestions: [
      'What structure serves our growth now?',
      'How do we honor both security and freedom?',
      'What legacy are we building?'
    ],
    rituals: [
      'Create new shared goals',
      'Release outdated patterns',
      'Plan for the future together'
    ],
    dangers: [
      'Settling for less',
      'Avoiding necessary evolution',
      'Living parallel lives'
    ],
    gifts: [
      'Sustainable love',
      'Conscious partnership',
      'Mentor capacity emerging'
    ]
  },

  firstSaturnReturn: {
    yearRange: [29, 44],
    title: 'First Saturn Return of the Bond',
    saturnPhase: 'Return',
    archetype: 'The Phoenix',
    myth: 'Death and Rebirth',
    psychologicalTask: 'Complete transformation or dissolution',
    shiftReason: 'Saturn return forces ultimate reckoning',
    growthTheme: 'Choosing the relationship anew or releasing it',
    shadowTheme: 'Fear of death (of relationship or self within it)',
    compositeActivation: 'All composite planets re-evaluated',
    keyQuestions: [
      'Do we choose each other again?',
      'What must die for us to be reborn?',
      'Are we still growing together?'
    ],
    rituals: [
      'Formal recommitment ceremony',
      'Complete relationship review',
      'Phoenix ritual - release and renewal'
    ],
    dangers: [
      'Staying from fear not love',
      'Premature dissolution',
      'Missing the rebirth opportunity'
    ],
    gifts: [
      'Relationship 2.0 - conscious union',
      'Freedom within commitment',
      'Elder wisdom beginning'
    ]
  },

  uranusOpposition: {
    yearRange: [44, 58],
    title: 'Uranus Opposition Overlay',
    saturnPhase: 'Between Returns',
    archetype: 'The Liberators',
    myth: 'The Great Awakening',
    psychologicalTask: 'Integrating individual awakening within bond',
    shiftReason: 'Midlife crisis demands authenticity',
    growthTheme: 'Finding new aliveness while honoring commitment',
    shadowTheme: 'Affairs, sudden departures, crisis of meaning',
    compositeActivation: 'Uranus transits shake all fixed patterns',
    keyQuestions: [
      'Who am I becoming at this life stage?',
      'Can our relationship hold my awakening?',
      'What adventure awaits us together?'
    ],
    rituals: [
      'Individual vision quests shared',
      'Radical honesty practices',
      'New adventures together'
    ],
    dangers: [
      'Destructive acting out',
      'Throwing away the good with the stale',
      'Midlife affair as escape'
    ],
    gifts: [
      'Renewed passion and purpose',
      'Authentic union of two whole selves',
      'Creative renaissance together'
    ]
  },

  secondSaturnReturn: {
    yearRange: [58, 100],
    title: 'Second Saturn Return',
    saturnPhase: 'Second Return',
    archetype: 'The Wise Ones',
    myth: 'The Harvest',
    psychologicalTask: 'Integration and legacy',
    shiftReason: 'Mortality awareness deepens all relating',
    growthTheme: 'Harvesting wisdom, preparing legacy',
    shadowTheme: 'Regret, unlived life, fear of death',
    compositeActivation: 'North Node purpose becomes central',
    keyQuestions: [
      'What wisdom have we gathered together?',
      'What legacy do we leave?',
      'How do we face mortality together?'
    ],
    rituals: [
      'Life review and gratitude',
      'Legacy planning',
      'Transmission to younger couples'
    ],
    dangers: [
      'Bitter regret',
      'Waiting for death',
      'Missing the harvest'
    ],
    gifts: [
      'Profound peace',
      'Overflowing gratitude',
      'Wisdom to share with others'
    ]
  }
};

// ============================================================================
// ARCHETYPE EVOLUTION BY ELEMENT COMBINATION
// ============================================================================

const ELEMENT_ARCHETYPE_EVOLUTION = {
  'Fire-Fire': {
    birthOfBond: { archetype: 'Twin Flames', expression: 'Explosive passion' },
    firstSaturnSquare: { archetype: 'Competitive Partners', expression: 'Learning to not burn each other' },
    oppositionPhase: { archetype: 'Warring Gods', expression: 'Power struggles peak' },
    secondSquare: { archetype: 'Co-Champions', expression: 'Channeling fire outward together' },
    firstSaturnReturn: { archetype: 'Wise Warriors', expression: 'Fire tempered by experience' },
    uranusOpposition: { archetype: 'Phoenix Couple', expression: 'Rebirth through fire' },
    secondSaturnReturn: { archetype: 'Eternal Flames', expression: 'Fire that warms others' }
  },

  'Fire-Earth': {
    birthOfBond: { archetype: 'Flame and Ground', expression: 'Passionate building' },
    firstSaturnSquare: { archetype: 'Frustrated Opposites', expression: 'Speed vs. patience conflict' },
    oppositionPhase: { archetype: 'Forge and Anvil', expression: 'Transformation through friction' },
    secondSquare: { archetype: 'Sustainable Fire', expression: 'Learning to tend the flame' },
    firstSaturnReturn: { archetype: 'Volcanic Union', expression: 'Depth meets height' },
    uranusOpposition: { archetype: 'Mountain Beacon', expression: 'Guiding light, solid ground' },
    secondSaturnReturn: { archetype: 'Eternal Hearth', expression: 'Fire that builds empires' }
  },

  'Fire-Air': {
    birthOfBond: { archetype: 'Wildfire', expression: 'Ideas igniting passion' },
    firstSaturnSquare: { archetype: 'Scattered Flames', expression: 'Focus vs. expansion tension' },
    oppositionPhase: { archetype: 'Storm System', expression: 'Creative chaos peaks' },
    secondSquare: { archetype: 'Directed Wind', expression: 'Channeling inspiration' },
    firstSaturnReturn: { archetype: 'Creative Dynamo', expression: 'Sustainable innovation' },
    uranusOpposition: { archetype: 'Lightning Strikers', expression: 'Genius awakened' },
    secondSaturnReturn: { archetype: 'Inspiring Elders', expression: 'Wisdom that ignites others' }
  },

  'Fire-Water': {
    birthOfBond: { archetype: 'Steam Rising', expression: 'Passion meets depth' },
    firstSaturnSquare: { archetype: 'Doused Flames', expression: 'Emotion overwhelming action' },
    oppositionPhase: { archetype: 'Tsunami-Fire', expression: 'Destructive or transformative' },
    secondSquare: { archetype: 'Hot Springs', expression: 'Healing warmth found' },
    firstSaturnReturn: { archetype: 'Alchemical Marriage', expression: 'Opposites fully integrated' },
    uranusOpposition: { archetype: 'Geyser Force', expression: 'Powerful creative release' },
    secondSaturnReturn: { archetype: 'Sacred Hot Spring', expression: 'Healing others through union' }
  },

  'Earth-Earth': {
    birthOfBond: { archetype: 'Mountain Range', expression: 'Solid foundation' },
    firstSaturnSquare: { archetype: 'Stuck in Mud', expression: 'Resistance to change' },
    oppositionPhase: { archetype: 'Earthquake', expression: 'Forced movement' },
    secondSquare: { archetype: 'Terraced Gardens', expression: 'Productive structure' },
    firstSaturnReturn: { archetype: 'Ancient Mountains', expression: 'Enduring presence' },
    uranusOpposition: { archetype: 'Volcanic Awakening', expression: 'Hidden depths revealed' },
    secondSaturnReturn: { archetype: 'Sacred Land', expression: 'Legacy that nourishes' }
  },

  'Earth-Air': {
    birthOfBond: { archetype: 'Kite Anchored', expression: 'Ideas grounded' },
    firstSaturnSquare: { archetype: 'Suffocation/Abstraction', expression: 'Heaviness vs. lightness' },
    oppositionPhase: { archetype: 'Sandstorm', expression: 'Abrasive transformation' },
    secondSquare: { archetype: 'Windmill', expression: 'Productive differences' },
    firstSaturnReturn: { archetype: 'Weather System', expression: 'Understanding patterns' },
    uranusOpposition: { archetype: 'Flying Mountain', expression: 'Impossible made real' },
    secondSaturnReturn: { archetype: 'Teaching Garden', expression: 'Wisdom made practical' }
  },

  'Earth-Water': {
    birthOfBond: { archetype: 'River Valley', expression: 'Nurturing flow' },
    firstSaturnSquare: { archetype: 'Mudslide', expression: 'Emotional overwhelm' },
    oppositionPhase: { archetype: 'Dam Breaking', expression: 'Release of suppressed feeling' },
    secondSquare: { archetype: 'Fertile Delta', expression: 'Productive emotion' },
    firstSaturnReturn: { archetype: 'Sacred Oasis', expression: 'Life-giving union' },
    uranusOpposition: { archetype: 'Underground River', expression: 'Hidden depths discovered' },
    secondSaturnReturn: { archetype: 'Ancient Lake', expression: 'Deep wisdom, calm presence' }
  },

  'Air-Air': {
    birthOfBond: { archetype: 'Whirlwind Romance', expression: 'Mental excitement' },
    firstSaturnSquare: { archetype: 'Parallel Winds', expression: 'Connection without depth' },
    oppositionPhase: { archetype: 'Tornado', expression: 'Destructive intellectualization' },
    secondSquare: { archetype: 'Trade Winds', expression: 'Reliable exchange' },
    firstSaturnReturn: { archetype: 'Atmosphere', expression: 'Invisible but essential' },
    uranusOpposition: { archetype: 'Aurora', expression: 'Beauty from electricity' },
    secondSaturnReturn: { archetype: 'Wisdom Wind', expression: 'Ideas that seed others' }
  },

  'Air-Water': {
    birthOfBond: { archetype: 'Sea Breeze', expression: 'Refreshing connection' },
    firstSaturnSquare: { archetype: 'Fog', expression: 'Confusion, miscommunication' },
    oppositionPhase: { archetype: 'Hurricane', expression: 'Powerful but chaotic' },
    secondSquare: { archetype: 'Rain Clouds', expression: 'Ideas become feelings, feelings become ideas' },
    firstSaturnReturn: { archetype: 'Climate', expression: 'Sustainable emotional-mental balance' },
    uranusOpposition: { archetype: 'Lightning Storm', expression: 'Illumination through crisis' },
    secondSaturnReturn: { archetype: 'Gentle Rain', expression: 'Nourishing wisdom' }
  },

  'Water-Water': {
    birthOfBond: { archetype: 'Ocean Merger', expression: 'Boundless feeling' },
    firstSaturnSquare: { archetype: 'Drowning', expression: 'Too much emotion, no boundaries' },
    oppositionPhase: { archetype: 'Tidal Waves', expression: 'Overwhelming emotional power' },
    secondSquare: { archetype: 'Channeled River', expression: 'Emotion with direction' },
    firstSaturnReturn: { archetype: 'Deep Sea', expression: 'Mysteries explored together' },
    uranusOpposition: { archetype: 'Breaking Wave', expression: 'Creative release' },
    secondSaturnReturn: { archetype: 'Sacred Well', expression: 'Source of healing for others' }
  }
};

// ============================================================================
// MYTHIC EVOLUTION - Story Arc Across Time
// ============================================================================

const MYTHIC_EVOLUTION_ARCS = {
  herosJourney: {
    name: 'The Hero\'s Journey Together',
    description: 'Relationship as shared adventure and transformation',
    stageMapping: {
      birthOfBond: 'Call to Adventure - Meeting the Other',
      firstSaturnSquare: 'Crossing the Threshold - Committing to the Quest',
      oppositionPhase: 'The Ordeal - Facing the Dragon Together',
      secondSquare: 'The Reward - Wisdom Gained Through Trial',
      firstSaturnReturn: 'The Return - Bringing Gifts Back',
      uranusOpposition: 'Master of Two Worlds - Integration',
      secondSaturnReturn: 'Freedom to Live - Completed Journey'
    }
  },

  alchemicalMarriage: {
    name: 'The Alchemical Marriage',
    description: 'Relationship as transformation of lead to gold',
    stageMapping: {
      birthOfBond: 'Conjunction - Union of Opposites',
      firstSaturnSquare: 'Nigredo - The Blackening, Death of Illusions',
      oppositionPhase: 'Separatio - Distinguishing Elements',
      secondSquare: 'Albedo - The Whitening, Purification',
      firstSaturnReturn: 'Citrinitas - The Yellowing, Dawn of Gold',
      uranusOpposition: 'Rubedo - The Reddening, Full Transformation',
      secondSaturnReturn: 'Philosopher\'s Stone - Completed Work'
    }
  },

  gardenGrowing: {
    name: 'The Sacred Garden',
    description: 'Relationship as cultivation and harvest',
    stageMapping: {
      birthOfBond: 'Planting Seeds - New Growth Begins',
      firstSaturnSquare: 'Weeding and Pruning - Hard Work of Tending',
      oppositionPhase: 'Storm Season - Survival of the Roots',
      secondSquare: 'Mature Garden - Established Patterns',
      firstSaturnReturn: 'First Great Harvest - Fruits of Labor',
      uranusOpposition: 'Wild Growth - New Life in Old Garden',
      secondSaturnReturn: 'Elder Garden - Seeds for Future Generations'
    }
  },

  oceanVoyage: {
    name: 'The Ocean Voyage',
    description: 'Relationship as journey across unknown waters',
    stageMapping: {
      birthOfBond: 'Setting Sail - Leaving the Shore',
      firstSaturnSquare: 'First Storm - Testing the Vessel',
      oppositionPhase: 'The Deep Sea - Monsters and Mysteries',
      secondSquare: 'Finding the Current - Wise Navigation',
      firstSaturnReturn: 'New Land Sighted - Destination Approaches',
      uranusOpposition: 'The Transformation - Becoming the Ocean',
      secondSaturnReturn: 'Safe Harbor - Journey Complete'
    }
  }
};

// ============================================================================
// CRISIS POINTS AND OPPORTUNITIES
// ============================================================================

const CRISIS_OPPORTUNITY_MAP = {
  yearSeven: {
    crisis: 'The Seven-Year Itch',
    description: 'Projections begin to fail, boredom or restlessness emerges',
    opportunity: 'Build authentic intimacy based on truth not fantasy',
    healingPath: 'Honest communication about disappointments and renewed commitment to reality',
    lunaGuidance: 'This restlessness is a call to deeper truth. What you\'re really seeking is the authentic person behind your projections.'
  },

  yearFourteen: {
    crisis: 'The Opposition Crisis',
    description: 'Full shadow projection, power struggles, potential breakdown',
    opportunity: 'Integrate shadow, achieve psychological wholeness together',
    healingPath: 'Shadow work, therapy, conscious conflict as vehicle for growth',
    lunaGuidance: 'Everything you\'re fighting about is really about you. Your partner is your mirror. Can you see yourself?'
  },

  yearTwentyOne: {
    crisis: 'The Stagnation Fear',
    description: 'Relationship feels too settled, fear of missing out',
    opportunity: 'Build sustainable structures that include room for growth',
    healingPath: 'Create new shared goals while honoring what works',
    lunaGuidance: 'Stability is not the enemy of growth. You can build a house with windows and doors.'
  },

  yearTwentyNine: {
    crisis: 'The Saturn Return Reckoning',
    description: 'Complete evaluation of the relationship, stay or go',
    opportunity: 'Conscious recommitment or conscious release',
    healingPath: 'Deep honest evaluation, ritual marking of choice',
    lunaGuidance: 'This is the moment of truth. Not staying from fear, not leaving from boredom. What does your soul choose?'
  },

  yearFortyFour: {
    crisis: 'The Midlife Awakening',
    description: 'Individual awakenings threaten the bond',
    opportunity: 'Two whole people choosing each other anew',
    healingPath: 'Support individual growth while strengthening bond',
    lunaGuidance: 'You\'re both becoming new people. Can you fall in love with who you\'re each becoming?'
  },

  yearFiftyEight: {
    crisis: 'The Mortality Confrontation',
    description: 'Facing death, illness, loss together',
    opportunity: 'Profound peace and gratitude for the journey',
    healingPath: 'Life review, gratitude practices, legacy work',
    lunaGuidance: 'Every moment now is precious. What gratitude can you speak? What love can you express?'
  }
};

// ============================================================================
// SYNASTRY ACTIVATION BY STAGE
// ============================================================================

const SYNASTRY_ACTIVATION_BY_STAGE = {
  birthOfBond: {
    dominant: ['venus-mars', 'sun-moon', 'venus-venus'],
    emerging: ['saturn-personal'],
    dormant: ['pluto-aspects', 'node-aspects'],
    focus: 'Attraction and initial bonding aspects dominate'
  },

  firstSaturnSquare: {
    dominant: ['saturn-personal', 'saturn-saturn'],
    emerging: ['pluto-aspects'],
    dormant: ['neptune-aspects'],
    focus: 'Reality-testing aspects come forward'
  },

  oppositionPhase: {
    dominant: ['pluto-aspects', 'mars-mars', 'saturn-personal'],
    emerging: ['node-aspects'],
    dormant: ['jupiter-aspects'],
    focus: 'Power and transformation aspects peak'
  },

  secondSquare: {
    dominant: ['saturn-saturn', 'jupiter-saturn'],
    emerging: ['node-aspects'],
    dormant: ['pluto-aspects'],
    focus: 'Structure and growth balance'
  },

  firstSaturnReturn: {
    dominant: ['node-aspects', 'saturn-saturn', 'pluto-aspects'],
    emerging: ['uranus-aspects'],
    dormant: ['venus-mars'],
    focus: 'Fate and transformation in spotlight'
  },

  uranusOpposition: {
    dominant: ['uranus-aspects', 'uranus-personal'],
    emerging: ['neptune-aspects'],
    dormant: ['saturn-aspects'],
    focus: 'Liberation and awakening aspects'
  },

  secondSaturnReturn: {
    dominant: ['node-aspects', 'saturn-saturn', 'neptune-aspects'],
    emerging: ['jupiter-aspects'],
    dormant: ['mars-aspects'],
    focus: 'Spiritual and karmic aspects dominate'
  }
};

// ============================================================================
// GROWTH TASKS BY STAGE
// ============================================================================

const GROWTH_TASKS = {
  birthOfBond: [
    'Establish clear communication patterns',
    'Learn each other\'s attachment styles',
    'Create shared rituals and traditions',
    'Define relationship values together',
    'Practice seeing partner as separate self'
  ],

  firstSaturnSquare: [
    'Have honest conversation about disappointments',
    'Renegotiate unconscious contracts',
    'Establish healthy boundaries',
    'Develop conflict resolution skills',
    'Accept human limitations in each other'
  ],

  oppositionPhase: [
    'Engage in shadow work together or individually',
    'Learn to fight fairly and repair after conflict',
    'Identify and own your projections',
    'Seek professional support if needed',
    'Practice compassion for each other\'s wounds'
  ],

  secondSquare: [
    'Create new shared goals and projects',
    'Balance security with growth needs',
    'Release outdated relationship patterns',
    'Develop mentor relationships with younger couples',
    'Plan for long-term future together'
  ],

  firstSaturnReturn: [
    'Complete honest relationship inventory',
    'Make conscious choice to stay or release',
    'If staying, create formal recommitment ritual',
    'Grieve what the relationship is not',
    'Celebrate what the relationship has become'
  ],

  uranusOpposition: [
    'Support each other\'s individual awakenings',
    'Try new adventures together',
    'Have radical honesty conversations',
    'Revisit and update relationship agreements',
    'Embrace change as growth, not threat'
  ],

  secondSaturnReturn: [
    'Conduct life review together with gratitude',
    'Create legacy plans and projects',
    'Share wisdom with others',
    'Practice presence and appreciation',
    'Prepare for eventual loss with love'
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get element from zodiac sign
 */
function getElement(sign) {
  const elements = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };
  return elements[sign] || 'Unknown';
}

/**
 * Get element combination key (normalized)
 */
function getElementCombination(element1, element2) {
  const order = ['Fire', 'Earth', 'Air', 'Water'];
  const sorted = [element1, element2].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return `${sorted[0]}-${sorted[1]}`;
}

/**
 * Determine current stage based on relationship years
 */
function getCurrentStage(relationshipYears) {
  if (relationshipYears < 7) return 'birthOfBond';
  if (relationshipYears < 14) return 'firstSaturnSquare';
  if (relationshipYears < 21) return 'oppositionPhase';
  if (relationshipYears < 29) return 'secondSquare';
  if (relationshipYears < 44) return 'firstSaturnReturn';
  if (relationshipYears < 58) return 'uranusOpposition';
  return 'secondSaturnReturn';
}

/**
 * Calculate years until next stage
 */
function yearsUntilNextStage(relationshipYears) {
  const thresholds = [7, 14, 21, 29, 44, 58];
  for (const threshold of thresholds) {
    if (relationshipYears < threshold) {
      return threshold - relationshipYears;
    }
  }
  return null; // Already in final stage
}

/**
 * Select appropriate mythic arc based on composite
 */
function selectMythicArc(compositeData) {
  const sunElement = getElement(compositeData?.sun?.sign || 'Aries');
  const moonElement = getElement(compositeData?.moon?.sign || 'Cancer');

  // Fire-dominant: Hero's Journey
  if (sunElement === 'Fire' || moonElement === 'Fire') {
    return 'herosJourney';
  }

  // Water-dominant: Ocean Voyage
  if (sunElement === 'Water' && moonElement === 'Water') {
    return 'oceanVoyage';
  }

  // Earth-dominant: Garden Growing
  if (sunElement === 'Earth' || moonElement === 'Earth') {
    return 'gardenGrowing';
  }

  // Air or mixed: Alchemical Marriage
  return 'alchemicalMarriage';
}

// ============================================================================
// MAIN EVOLUTION ANALYSIS FUNCTION
// ============================================================================

/**
 * Build the relationship evolution analysis
 *
 * @param {Object} compositeData - Composite chart data
 * @param {Object} synastryData - Synastry analysis data
 * @param {Date} relationshipStartDate - When relationship began
 * @returns {Object} Complete evolution analysis
 */
export function buildRelationshipEvolution(compositeData, synastryData, relationshipStartDate) {
  // Calculate relationship age
  const startDate = new Date(relationshipStartDate);
  const now = new Date();
  const relationshipYears = (now - startDate) / (1000 * 60 * 60 * 24 * 365.25);
  const relationshipMonths = Math.floor((relationshipYears % 1) * 12);
  const fullYears = Math.floor(relationshipYears);

  // Determine current and upcoming stages
  const currentStageKey = getCurrentStage(relationshipYears);
  const currentStage = EVOLUTION_STAGES[currentStageKey];
  const yearsToNext = yearsUntilNextStage(relationshipYears);

  // Get element combination for archetype evolution
  const sunElement = getElement(compositeData?.sun?.sign || 'Aries');
  const moonElement = getElement(compositeData?.moon?.sign || 'Cancer');
  const elementCombo = getElementCombination(sunElement, moonElement);
  const archetypeEvolution = ELEMENT_ARCHETYPE_EVOLUTION[elementCombo] || ELEMENT_ARCHETYPE_EVOLUTION['Fire-Water'];

  // Select mythic arc
  const mythicArcKey = selectMythicArc(compositeData);
  const mythicArc = MYTHIC_EVOLUTION_ARCS[mythicArcKey];

  // Get synastry activation for current stage
  const synastryActivation = SYNASTRY_ACTIVATION_BY_STAGE[currentStageKey];

  // Get growth tasks for current stage
  const currentGrowthTasks = GROWTH_TASKS[currentStageKey];

  // Find relevant crisis point
  let relevantCrisis = null;
  if (fullYears >= 5 && fullYears <= 9) relevantCrisis = CRISIS_OPPORTUNITY_MAP.yearSeven;
  else if (fullYears >= 12 && fullYears <= 16) relevantCrisis = CRISIS_OPPORTUNITY_MAP.yearFourteen;
  else if (fullYears >= 19 && fullYears <= 23) relevantCrisis = CRISIS_OPPORTUNITY_MAP.yearTwentyOne;
  else if (fullYears >= 27 && fullYears <= 31) relevantCrisis = CRISIS_OPPORTUNITY_MAP.yearTwentyNine;
  else if (fullYears >= 42 && fullYears <= 46) relevantCrisis = CRISIS_OPPORTUNITY_MAP.yearFortyFour;
  else if (fullYears >= 56 && fullYears <= 60) relevantCrisis = CRISIS_OPPORTUNITY_MAP.yearFiftyEight;

  // Build evolution timeline
  const evolutionTimeline = Object.entries(EVOLUTION_STAGES).map(([key, stage]) => ({
    stageKey: key,
    ...stage,
    currentArchetype: archetypeEvolution[key],
    mythicPhase: mythicArc.stageMapping[key],
    isCurrent: key === currentStageKey,
    isPast: stage.yearRange[1] <= relationshipYears,
    isFuture: stage.yearRange[0] > relationshipYears
  }));

  // Build the complete evolution profile
  return {
    relationshipAge: {
      years: fullYears,
      months: relationshipMonths,
      totalYears: Math.round(relationshipYears * 100) / 100,
      startDate: startDate.toISOString().split('T')[0]
    },

    currentStage: {
      key: currentStageKey,
      title: currentStage.title,
      saturnPhase: currentStage.saturnPhase,
      archetype: currentStage.archetype,
      myth: currentStage.myth,
      elementArchetype: archetypeEvolution[currentStageKey],
      mythicPhase: mythicArc.stageMapping[currentStageKey],
      psychologicalTask: currentStage.psychologicalTask,
      growthTheme: currentStage.growthTheme,
      shadowTheme: currentStage.shadowTheme,
      yearsInStage: relationshipYears - currentStage.yearRange[0],
      yearsUntilNextStage: yearsToNext
    },

    elementalEvolution: {
      combination: elementCombo,
      sunElement,
      moonElement,
      fullArc: archetypeEvolution,
      currentExpression: archetypeEvolution[currentStageKey]?.expression
    },

    mythicArc: {
      name: mythicArc.name,
      description: mythicArc.description,
      fullTimeline: mythicArc.stageMapping,
      currentPhase: mythicArc.stageMapping[currentStageKey]
    },

    synastryActivation: {
      dominant: synastryActivation.dominant,
      emerging: synastryActivation.emerging,
      dormant: synastryActivation.dormant,
      focus: synastryActivation.focus
    },

    currentGrowthWork: {
      tasks: currentGrowthTasks,
      keyQuestions: currentStage.keyQuestions,
      rituals: currentStage.rituals,
      dangers: currentStage.dangers,
      gifts: currentStage.gifts
    },

    crisisOpportunity: relevantCrisis ? {
      isActive: true,
      crisis: relevantCrisis.crisis,
      description: relevantCrisis.description,
      opportunity: relevantCrisis.opportunity,
      healingPath: relevantCrisis.healingPath,
      lunaGuidance: relevantCrisis.lunaGuidance
    } : {
      isActive: false,
      message: 'No major crisis point currently active. Focus on current stage growth work.'
    },

    evolutionTimeline,

    nextStagePreview: yearsToNext !== null ? {
      yearsUntil: yearsToNext,
      stageKey: Object.keys(EVOLUTION_STAGES)[Object.keys(EVOLUTION_STAGES).indexOf(currentStageKey) + 1],
      preview: EVOLUTION_STAGES[Object.keys(EVOLUTION_STAGES)[Object.keys(EVOLUTION_STAGES).indexOf(currentStageKey) + 1]]
    } : {
      message: 'You are in the final stage of relationship evolution. Focus on harvest and legacy.'
    },

    lunaWisdom: {
      currentStage: generateLunaWisdom(currentStageKey, relationshipYears),
      crisisGuidance: relevantCrisis?.lunaGuidance || null
    },

    metadata: {
      generatedAt: new Date().toISOString(),
      framework: 'Liz Greene Relationship Evolution',
      version: '1.0.0'
    }
  };
}

/**
 * Generate Luna wisdom for current stage
 */
function generateLunaWisdom(stageKey, years) {
  const wisdomByStage = {
    birthOfBond: `At ${Math.floor(years)} years together, you're still in the honeymoon of the soul. The projections feel so real, so true. And they are—but they're truths about YOU, not your partner. Enjoy this magic while knowing deeper treasures await when you learn to see clearly.`,

    firstSaturnSquare: `The seven-year mark approaches or has passed. The veil is lifting. What you see now may disappoint—but what you can build on truth will last forever. This disillusionment is actually the greatest gift: the chance for authentic love.`,

    oppositionPhase: `You're in the crucible now. Everything you've avoided seeing is demanding to be seen. Every fight is really about your own shadow. This is the hardest stage—and the most transformative. Stay. Look. Own your part. Gold awaits on the other side.`,

    secondSquare: `The fires of opposition have tempered you. Now comes the work of building something sustainable from the ashes of your illusions. Not exciting, perhaps—but profound. True love isn't fireworks; it's choosing to build a home together, brick by brick.`,

    firstSaturnReturn: `The Saturn return of your relationship asks the ultimate question: knowing everything you now know, do you choose each other? Not from habit, not from fear—from love. Whatever you decide, decide consciously. This is the most important choice of your relational life.`,

    uranusOpposition: `You're both becoming new people. The question isn't whether to change—that's inevitable. The question is whether you can change together, whether your bond can stretch to hold the people you're becoming. This is where either adventure or tragedy awaits.`,

    secondSaturnReturn: `You've walked the long road together. How precious this is. How rare. The work now is gratitude, presence, and legacy. What wisdom have you gathered? What can you give to others? How can you treasure these remaining moments together?`
  };

  return wisdomByStage[stageKey] || 'Your relationship is a journey of souls. Trust the process.';
}

/**
 * Quick function to get just the current stage analysis
 */
export function getCurrentEvolutionStage(relationshipYears) {
  const stageKey = getCurrentStage(relationshipYears);
  const stage = EVOLUTION_STAGES[stageKey];

  return {
    key: stageKey,
    title: stage.title,
    archetype: stage.archetype,
    myth: stage.myth,
    psychologicalTask: stage.psychologicalTask,
    growthTheme: stage.growthTheme,
    yearsInStage: relationshipYears - stage.yearRange[0]
  };
}

/**
 * Get growth tasks for a specific stage
 */
export function getGrowthTasksForStage(stageKey) {
  return GROWTH_TASKS[stageKey] || [];
}

/**
 * Get crisis information if applicable
 */
export function getCrisisInfo(relationshipYears) {
  const fullYears = Math.floor(relationshipYears);

  if (fullYears >= 5 && fullYears <= 9) return CRISIS_OPPORTUNITY_MAP.yearSeven;
  if (fullYears >= 12 && fullYears <= 16) return CRISIS_OPPORTUNITY_MAP.yearFourteen;
  if (fullYears >= 19 && fullYears <= 23) return CRISIS_OPPORTUNITY_MAP.yearTwentyOne;
  if (fullYears >= 27 && fullYears <= 31) return CRISIS_OPPORTUNITY_MAP.yearTwentyNine;
  if (fullYears >= 42 && fullYears <= 46) return CRISIS_OPPORTUNITY_MAP.yearFortyFour;
  if (fullYears >= 56 && fullYears <= 60) return CRISIS_OPPORTUNITY_MAP.yearFiftyEight;

  return null;
}

// Export constants for external use
export {
  EVOLUTION_STAGES,
  ELEMENT_ARCHETYPE_EVOLUTION,
  MYTHIC_EVOLUTION_ARCS,
  CRISIS_OPPORTUNITY_MAP,
  SYNASTRY_ACTIVATION_BY_STAGE,
  GROWTH_TASKS
};
