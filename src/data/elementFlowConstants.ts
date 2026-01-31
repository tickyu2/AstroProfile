/**
 * Element × Season Flow Constants
 *
 * How elements move through the year - emergence, peak, transition, absence.
 * This is NOT about zodiac signs. It's about elemental WISDOM moving through time.
 *
 * The Pattern:
 * - Fire: Burns Spring → Summer → Autumn, then dies in Winter (no Fire sign in Winter)
 * - Water: Emerges in Summer → Autumn → Winter, absent in Spring (no Water sign in Spring)
 * - Earth: Grounds Spring → Summer → Winter, absent in Autumn (no Earth sign in Autumn)
 * - Air: Flows Spring → Autumn → Winter, absent in Summer (no Air sign in Summer)
 */

import { Season, getCurrentSeason } from './tropicalConstants';

// =============================================================================
// ELEMENT × SEASON FLOW - How Elements Move Through the Year
// =============================================================================

export type ElementFlowPhase = 'emergence' | 'peak' | 'transition' | 'absence';

export interface ElementSeasonPhase {
  phase: ElementFlowPhase;
  sign: string | null;
  description: string;
  survivalGift: string;
  intensity: number; // 0-100
}

export interface ElementFlowData {
  element: string;
  icon: string;
  color: string;
  arc: {
    Spring: ElementSeasonPhase;
    Summer: ElementSeasonPhase;
    Autumn: ElementSeasonPhase;
    Winter: ElementSeasonPhase;
  };
  absenceSeason: Season;
  absenceTeaching: string;
  fullCycleNarrative: string;
}

export const ELEMENT_FLOWS: Record<string, ElementFlowData> = {
  Fire: {
    element: 'Fire',
    icon: '🔥',
    color: '#ef4444',
    arc: {
      Spring: {
        phase: 'emergence',
        sign: 'Aries',
        description: 'Fire ignites with spring. Raw, explosive, breaking through frozen ground.',
        survivalGift: 'The courage to begin',
        intensity: 85,
      },
      Summer: {
        phase: 'peak',
        sign: 'Leo',
        description: 'Fire blazes at full power. Sustained radiance, creative expression, warmth.',
        survivalGift: 'The warmth to nurture',
        intensity: 100,
      },
      Autumn: {
        phase: 'transition',
        sign: 'Sagittarius',
        description: 'Fire spreads outward seeking new fuel. Wisdom-fire, traveling light.',
        survivalGift: 'The light to explore',
        intensity: 70,
      },
      Winter: {
        phase: 'absence',
        sign: null,
        description: 'Fire dies. No Fire sign exists in winter. The flame must rest.',
        survivalGift: 'Learning to find warmth within',
        intensity: 0,
      },
    },
    absenceSeason: 'Winter',
    absenceTeaching: 'In winter, external fire cannot sustain you. You must find the spark within—discipline, vision, and inner warmth replace outward action.',
    fullCycleNarrative: 'Fire ignites in Spring (Aries courage), blazes through Summer (Leo radiance), spreads in Autumn (Sagittarius wisdom), then dies in Winter. This teaches us that action must rest, passion must renew, and even fire needs to sleep.',
  },
  Water: {
    element: 'Water',
    icon: '💧',
    color: '#8b5cf6',
    arc: {
      Spring: {
        phase: 'absence',
        sign: null,
        description: 'Water is absent in spring. No Water sign exists here. Emotion steps back.',
        survivalGift: 'Learning to act without overthinking',
        intensity: 0,
      },
      Summer: {
        phase: 'emergence',
        sign: 'Cancer',
        description: 'Water emerges to protect. Emotional depth awakens, nurturing begins.',
        survivalGift: 'The depth to protect',
        intensity: 85,
      },
      Autumn: {
        phase: 'peak',
        sign: 'Scorpio',
        description: 'Water runs deepest. Transformation, intensity, emotional truth.',
        survivalGift: 'The power to transform',
        intensity: 100,
      },
      Winter: {
        phase: 'transition',
        sign: 'Pisces',
        description: 'Water dissolves boundaries. Preparing for the cycle to renew.',
        survivalGift: 'The surrender to renew',
        intensity: 70,
      },
    },
    absenceSeason: 'Spring',
    absenceTeaching: 'In spring, there is no Water sign. Action happens without emotional processing. This teaches us that sometimes we must leap before we feel ready.',
    fullCycleNarrative: 'Water emerges in Summer (Cancer nurturing), deepens in Autumn (Scorpio intensity), dissolves in Winter (Pisces transcendence), then disappears in Spring. This teaches us that emotion needs rest, and action sometimes requires setting feelings aside.',
  },
  Earth: {
    element: 'Earth',
    icon: '🌿',
    color: '#22c55e',
    arc: {
      Spring: {
        phase: 'emergence',
        sign: 'Taurus',
        description: 'Earth stabilizes spring growth. Making the spark tangible and lasting.',
        survivalGift: 'The patience to build',
        intensity: 85,
      },
      Summer: {
        phase: 'peak',
        sign: 'Virgo',
        description: 'Earth refines and harvests. Practical mastery, preparing abundance.',
        survivalGift: 'The skill to perfect',
        intensity: 100,
      },
      Autumn: {
        phase: 'absence',
        sign: null,
        description: 'Earth is absent in autumn. No Earth sign exists here. Stability steps aside.',
        survivalGift: 'Learning to trust without proof',
        intensity: 0,
      },
      Winter: {
        phase: 'transition',
        sign: 'Capricorn',
        description: 'Earth builds structures for survival. Discipline becomes achievement.',
        survivalGift: 'The discipline to endure',
        intensity: 70,
      },
    },
    absenceSeason: 'Autumn',
    absenceTeaching: 'In autumn, there is no Earth sign. This is the season of relationship and depth, not practical results. Trust bonds over balance sheets.',
    fullCycleNarrative: 'Earth stabilizes Spring (Taurus abundance), perfects Summer (Virgo harvest), disappears in Autumn, then builds Winter (Capricorn structure). This teaches us that practical concerns must sometimes yield to emotional truth.',
  },
  Air: {
    element: 'Air',
    icon: '⚡',
    color: '#38bdf8',
    arc: {
      Spring: {
        phase: 'emergence',
        sign: 'Gemini',
        description: 'Air connects and adapts. Communication bridges spring to summer.',
        survivalGift: 'The curiosity to learn',
        intensity: 85,
      },
      Summer: {
        phase: 'absence',
        sign: null,
        description: 'Air is absent in summer. No Air sign exists here. Thought yields to feeling.',
        survivalGift: 'Learning to feel without analyzing',
        intensity: 0,
      },
      Autumn: {
        phase: 'peak',
        sign: 'Libra',
        description: 'Air seeks balance and harmony. Relationship intelligence at its height.',
        survivalGift: 'The wisdom to relate',
        intensity: 100,
      },
      Winter: {
        phase: 'transition',
        sign: 'Aquarius',
        description: 'Air envisions the future. Innovative thinking, collective progress.',
        survivalGift: 'The vision to transcend',
        intensity: 70,
      },
    },
    absenceSeason: 'Summer',
    absenceTeaching: 'In summer, there is no Air sign. Feeling replaces thinking. This teaches us that some truths are understood through the heart, not the mind.',
    fullCycleNarrative: 'Air connects in Spring (Gemini adaptation), disappears in Summer, harmonizes in Autumn (Libra balance), and envisions in Winter (Aquarius innovation). This teaches us that communication must sometimes pause for feeling.',
  },
};

// =============================================================================
// ELEMENT × SEASON PRESENCE MATRIX
// =============================================================================

/**
 * Which elements are present in each season.
 * Notice: Each season has exactly 3 elements. One is ALWAYS missing.
 */
export const ELEMENT_SEASON_PRESENCE: Record<Season, {
  present: string[];
  absent: string;
  absenceReason: string;
}> = {
  Spring: {
    present: ['Fire', 'Earth', 'Air'],
    absent: 'Water',
    absenceReason: 'Spring is for action, not reflection. Water\'s emotional depth would slow the necessary burst of growth.',
  },
  Summer: {
    present: ['Fire', 'Earth', 'Water'],
    absent: 'Air',
    absenceReason: 'Summer is for feeling, not thinking. Air\'s analytical nature would cool the necessary warmth of protection.',
  },
  Autumn: {
    present: ['Fire', 'Air', 'Water'],
    absent: 'Earth',
    absenceReason: 'Autumn is for relationship and meaning, not material results. Earth\'s practicality would ground the necessary flight into depth.',
  },
  Winter: {
    present: ['Earth', 'Air', 'Water'],
    absent: 'Fire',
    absenceReason: 'Winter is for endurance, not action. Fire\'s impulse would burn precious resources needed for survival.',
  },
};

// =============================================================================
// SEASONAL IMBALANCE INSIGHTS - What Each Season Lacks
// =============================================================================

export interface SeasonalImbalanceData {
  season: Season;
  missingElement: string;
  missingIcon: string;
  psychologicalEffect: string;
  collectiveChallenge: string;
  survivalWisdom: string;
  compensationStrategy: string[];
  whatToWatch: string;
}

export const SEASONAL_IMBALANCE_INSIGHTS: Record<Season, SeasonalImbalanceData> = {
  Spring: {
    season: 'Spring',
    missingElement: 'Water',
    missingIcon: '💧',
    psychologicalEffect: 'Without Water, spring lacks emotional depth. Action happens without reflection. People may feel driven but disconnected from their feelings.',
    collectiveChallenge: 'Society rushes to start things without considering emotional consequences. Relationships suffer from "just do it" mentality.',
    survivalWisdom: 'Spring\'s absence of Water is intentional—you cannot grow if you\'re drowning in feelings. Action first, reflection later.',
    compensationStrategy: [
      'Schedule deliberate emotional check-ins',
      'Water sign friends become essential mirrors',
      'Evening journaling compensates for daytime action',
      'Don\'t mistake momentum for meaning',
    ],
    whatToWatch: 'Burnout from action without emotional processing. Starting things you don\'t actually want.',
  },
  Summer: {
    season: 'Summer',
    missingElement: 'Air',
    missingIcon: '⚡',
    psychologicalEffect: 'Without Air, summer lacks objectivity. Decisions are made from the heart without mental clarity. Analysis paralysis gives way to feeling everything.',
    collectiveChallenge: 'Society becomes emotionally reactive. Logical solutions are dismissed. "How does this feel?" replaces "Does this make sense?"',
    survivalWisdom: 'Summer\'s absence of Air is intentional—you cannot nurture through analysis. Feel first, understand later.',
    compensationStrategy: [
      'Seek Air sign counsel for major decisions',
      'Write things down to externalize thought',
      'Don\'t dismiss logical feedback as "cold"',
      'Balance heart wisdom with head wisdom',
    ],
    whatToWatch: 'Emotional decisions that don\'t survive rational scrutiny. Confusing intensity for truth.',
  },
  Autumn: {
    season: 'Autumn',
    missingElement: 'Earth',
    missingIcon: '🌿',
    psychologicalEffect: 'Without Earth, autumn lacks grounding. Relationships and meanings float without practical anchor. Ideas and bonds form without tangible foundation.',
    collectiveChallenge: 'Society focuses on connection without building infrastructure. Partnerships form without practical planning. Depth without stability.',
    survivalWisdom: 'Autumn\'s absence of Earth is intentional—you cannot bond through spreadsheets. Connect first, build later.',
    compensationStrategy: [
      'Ground relationships with practical commitments',
      'Earth sign partners provide missing stability',
      'Don\'t let depth become an excuse for inaction',
      'Transform emotional bonds into tangible support',
    ],
    whatToWatch: 'Beautiful relationships without structural support. Meaning without manifestation.',
  },
  Winter: {
    season: 'Winter',
    missingElement: 'Fire',
    missingIcon: '🔥',
    psychologicalEffect: 'Without Fire, winter lacks warmth and spontaneity. Life becomes about endurance, not inspiration. Discipline replaces passion.',
    collectiveChallenge: 'Society becomes cold and strategic. Joy is postponed for survival. "Later" becomes the answer to every impulse.',
    survivalWisdom: 'Winter\'s absence of Fire is intentional—you cannot survive scarcity through impulse. Endure first, ignite later.',
    compensationStrategy: [
      'Deliberately create warmth and celebration',
      'Fire sign friends bring essential spark',
      'Don\'t mistake discipline for depression',
      'Small joys prevent the spirit from freezing',
    ],
    whatToWatch: 'Functionality without vitality. Surviving but not living.',
  },
};

// =============================================================================
// ELEMENT COMPENSATION TIPS - Personal Guidance by Element
// =============================================================================

export interface ElementCompensationTip {
  forElement: string;
  inSeason: Season;
  situation: 'home' | 'absent';
  headline: string;
  guidance: string;
  practicalTips: string[];
  affirmation: string;
}

export const ELEMENT_COMPENSATION_TIPS: ElementCompensationTip[] = [
  // FIRE - Absent in Winter
  {
    forElement: 'Fire',
    inSeason: 'Winter',
    situation: 'absent',
    headline: 'Your Element Is Sleeping',
    guidance: 'Fire signs (Aries, Leo, Sagittarius) may feel depleted in winter. Your natural fuel—action, warmth, spontaneity—isn\'t supported by the environment.',
    practicalTips: [
      'Honor your need to rest without guilt',
      'Create internal fire through creative projects',
      'Seek warm environments and warm people',
      'Plan spring adventures to give hope through the cold',
      'Your passion isn\'t gone—it\'s composting',
    ],
    affirmation: 'I am the ember waiting for spring. My fire will return.',
  },
  // WATER - Absent in Spring
  {
    forElement: 'Water',
    inSeason: 'Spring',
    situation: 'absent',
    headline: 'Your Element Is Waiting',
    guidance: 'Water signs (Cancer, Scorpio, Pisces) may feel overwhelmed by spring\'s action energy. Your natural depth isn\'t supported by the environment.',
    practicalTips: [
      'Don\'t force yourself to match others\' pace',
      'Create private emotional sanctuaries',
      'Use evening time for emotional processing',
      'Trust that depth will be valued again in summer',
      'Your sensitivity isn\'t weakness—it\'s early',
    ],
    affirmation: 'I am the deep well in a rushing world. My time will come.',
  },
  // EARTH - Absent in Autumn
  {
    forElement: 'Earth',
    inSeason: 'Autumn',
    situation: 'absent',
    headline: 'Your Element Is Resting',
    guidance: 'Earth signs (Taurus, Virgo, Capricorn) may feel ungrounded in autumn. Your natural stability isn\'t supported by the environment.',
    practicalTips: [
      'Focus on relationships, not results',
      'Trust bonds over balance sheets this season',
      'Create small stable routines as anchors',
      'Let go of measuring everything',
      'Your practicality isn\'t wrong—it\'s just not the season\'s language',
    ],
    affirmation: 'I am the mountain in the mist. My solidity remains.',
  },
  // AIR - Absent in Summer
  {
    forElement: 'Air',
    inSeason: 'Summer',
    situation: 'absent',
    headline: 'Your Element Is Quiet',
    guidance: 'Air signs (Gemini, Libra, Aquarius) may feel mentally foggy in summer. Your natural clarity isn\'t supported by the environment.',
    practicalTips: [
      'Don\'t fight the feeling-first energy',
      'Use journaling to externalize thoughts',
      'Find shade—literal and metaphorical',
      'Trust autumn will bring clarity again',
      'Your logic isn\'t cold—it\'s just not the season\'s currency',
    ],
    affirmation: 'I am the cool breeze waiting for autumn. My clarity will return.',
  },
];

// =============================================================================
// ELEMENT FLOW TIMELINE HELPERS
// =============================================================================

/**
 * Get the flow phase for a specific element in a specific season
 */
export function getElementFlowPhase(element: string, season: Season): ElementSeasonPhase | null {
  const flow = ELEMENT_FLOWS[element];
  if (!flow) return null;
  return flow.arc[season];
}

/**
 * Get all elements present in a season with their phases
 */
export function getSeasonElementBreakdown(season: Season): Array<{
  element: string;
  icon: string;
  color: string;
  phase: ElementSeasonPhase;
}> {
  const result: Array<{
    element: string;
    icon: string;
    color: string;
    phase: ElementSeasonPhase;
  }> = [];

  for (const [element, flow] of Object.entries(ELEMENT_FLOWS)) {
    result.push({
      element,
      icon: flow.icon,
      color: flow.color,
      phase: flow.arc[season],
    });
  }

  return result.sort((a, b) => b.phase.intensity - a.phase.intensity);
}

/**
 * Get compensation tips for a user based on their element and current season
 */
export function getPersonalCompensationTip(
  userElement: string,
  currentSeason: Season
): ElementCompensationTip | null {
  const flow = ELEMENT_FLOWS[userElement];
  if (!flow) return null;

  const phase = flow.arc[currentSeason];
  if (phase.phase !== 'absence') return null;

  return ELEMENT_COMPENSATION_TIPS.find(
    tip => tip.forElement === userElement && tip.inSeason === currentSeason
  ) || null;
}

/**
 * Get the seasonal imbalance insight for the current season
 */
export function getCurrentSeasonalImbalance(
  currentDate: Date = new Date()
): SeasonalImbalanceData {
  const season = getCurrentSeason(currentDate);
  return SEASONAL_IMBALANCE_INSIGHTS[season];
}

// =============================================================================
// ELEMENT DORMANT SEASON - The Personal Hook
// =============================================================================
// "This is huge psychologically. Zero astrology jargon required."
// =============================================================================

/**
 * ELEMENT_DORMANT_SEASON - Simple map of when each element rests
 *
 * This single map enables:
 * - Personal compensation logic
 * - "Your element is dormant right now"
 * - Immediate understanding without astrology jargon
 */
export const ELEMENT_DORMANT_SEASON: Record<string, Season> = {
  Fire: 'Winter',   // No Fire sign in Winter
  Earth: 'Autumn',  // No Earth sign in Autumn
  Air: 'Summer',    // No Air sign in Summer
  Water: 'Spring',  // No Water sign in Spring
};

// =============================================================================
// PERSONAL SEASONAL STATE RESOLVER - The Mirror Moment
// =============================================================================
// "This single function powers everything."
// =============================================================================

export interface PersonalSeasonalState {
  /** User's element */
  element: string;
  /** Current season */
  currentSeason: Season;
  /** Is the user's element supported this season? */
  supported: boolean;
  /** Is the user's element dormant this season? */
  dormant: boolean;
  /** What element is missing from the current season? */
  missingElement: string;
  /** Compensation tips if dormant */
  compensation: ElementCompensationTip | null;
  /** The seasonal imbalance data for this season */
  seasonalImbalance: SeasonalImbalanceData;
}

/**
 * getPersonalSeasonalState - The Complete Mirror
 *
 * This single function powers:
 * - Seasonal Resonance Panel
 * - Personal Compensation Panel
 * - Compatibility explanations
 * - Pod-level planning
 *
 * @param userElement - The user's dominant element (Fire, Earth, Air, Water)
 * @param currentDate - Date to calculate current season (defaults to now)
 * @returns Complete seasonal state for this user
 */
export function getPersonalSeasonalState(
  userElement: string,
  currentDate: Date = new Date()
): PersonalSeasonalState {
  const currentSeason = getCurrentSeason(currentDate);
  const dormantSeason = ELEMENT_DORMANT_SEASON[userElement];
  const seasonalImbalance = SEASONAL_IMBALANCE_INSIGHTS[currentSeason];

  const isDormant = dormantSeason === currentSeason;

  // Get compensation tips if dormant
  const compensation = isDormant
    ? ELEMENT_COMPENSATION_TIPS.find(
        tip => tip.forElement === userElement && tip.inSeason === currentSeason
      ) || null
    : null;

  return {
    element: userElement,
    currentSeason,
    supported: !isDormant,
    dormant: isDormant,
    missingElement: seasonalImbalance.missingElement,
    compensation,
    seasonalImbalance,
  };
}

/**
 * getSeasonalImbalance - Diagnostic engine for any season
 *
 * Returns what's present and what's missing, enabling:
 * - "Why does this season feel off?"
 * - "What is missing right now?"
 * - "Why do Fire people struggle in Winter?"
 */
export function getSeasonalImbalance(season: Season): {
  season: Season;
  present: string[];
  missing: string;
} {
  const presence = ELEMENT_SEASON_PRESENCE[season];
  return {
    season,
    present: presence.present,
    missing: presence.absent,
  };
}
