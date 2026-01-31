/**
 * House Overlay
 *
 * Models house emphasis from planetary placements:
 * - Angular (1, 4, 7, 10) → initiative, visibility, action
 * - Succedent (2, 5, 8, 11) → stability, resources, consolidation
 * - Cadent (3, 6, 9, 12) → adaptation, learning, transition
 *
 * Also tracks individual house themes for nuanced interpretation.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface ChartDataForHouse {
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
  }>;
  ascendant: {
    sign: string;
    degree: number;
  };
  houses?: Array<{
    number: number;
    sign: string;
    degree: number;
  }>;
}

export interface HouseOverlayResult {
  angularScore: number;      // 0..1
  succedentScore: number;    // 0..1
  cadentScore: number;       // 0..1
  dominantMode: HouseMode;
  houseDelta: number;        // contribution to final decision
  lifeEmphasis: LifeEmphasis;
  narrative: string;
  strengths: string[];
  challenges: string[];
  houseHighlights: HouseHighlight[];
}

export type HouseMode = 'Angular' | 'Succedent' | 'Cadent' | 'Balanced';

export type LifeEmphasis =
  | 'Action & Visibility'
  | 'Resources & Pleasure'
  | 'Learning & Service'
  | 'Well-Rounded Expression';

export interface HouseHighlight {
  house: number;
  planets: string[];
  theme: string;
  strength: 'strong' | 'moderate' | 'light';
}

// ========================================
// HOUSE CLASSIFICATIONS
// ========================================

const ANGULAR_HOUSES = [1, 4, 7, 10];
const SUCCEDENT_HOUSES = [2, 5, 8, 11];
const CADENT_HOUSES = [3, 6, 9, 12];

const HOUSE_THEMES: Record<number, { name: string; theme: string; keywords: string[] }> = {
  1: {
    name: 'House of Self',
    theme: 'Identity, appearance, and how you present yourself to the world',
    keywords: ['identity', 'self-image', 'beginnings', 'first impressions']
  },
  2: {
    name: 'House of Value',
    theme: 'Resources, money, possessions, and self-worth',
    keywords: ['finances', 'possessions', 'values', 'self-worth']
  },
  3: {
    name: 'House of Communication',
    theme: 'Communication, siblings, short journeys, and early learning',
    keywords: ['communication', 'siblings', 'local travel', 'learning']
  },
  4: {
    name: 'House of Home',
    theme: 'Home, family, roots, and emotional foundation',
    keywords: ['home', 'family', 'roots', 'private life']
  },
  5: {
    name: 'House of Pleasure',
    theme: 'Creativity, romance, children, and self-expression',
    keywords: ['creativity', 'romance', 'children', 'joy']
  },
  6: {
    name: 'House of Service',
    theme: 'Work, health, daily routines, and service to others',
    keywords: ['health', 'work', 'routines', 'service']
  },
  7: {
    name: 'House of Partnership',
    theme: 'Marriage, partnerships, contracts, and open enemies',
    keywords: ['partnerships', 'marriage', 'contracts', 'others']
  },
  8: {
    name: 'House of Transformation',
    theme: 'Shared resources, intimacy, death/rebirth, and the occult',
    keywords: ['transformation', 'intimacy', 'shared resources', 'depth']
  },
  9: {
    name: 'House of Philosophy',
    theme: 'Higher learning, travel, philosophy, and expansion',
    keywords: ['philosophy', 'travel', 'higher education', 'expansion']
  },
  10: {
    name: 'House of Career',
    theme: 'Career, public image, authority, and life direction',
    keywords: ['career', 'reputation', 'authority', 'achievement']
  },
  11: {
    name: 'House of Community',
    theme: 'Friends, groups, hopes, and humanitarian concerns',
    keywords: ['friends', 'groups', 'hopes', 'humanity']
  },
  12: {
    name: 'House of the Unconscious',
    theme: 'Hidden matters, spirituality, endings, and self-undoing',
    keywords: ['spirituality', 'secrets', 'solitude', 'transcendence']
  }
};

// Planet weights for house calculation
const PLANET_WEIGHTS: Record<string, number> = {
  Sun: 1.5,
  Moon: 1.5,
  Mercury: 1.0,
  Venus: 1.0,
  Mars: 1.2,
  Jupiter: 1.1,
  Saturn: 1.1,
  Uranus: 0.9,
  Neptune: 0.9,
  Pluto: 0.9
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute House Overlay from chart data
 */
export function computeHouseOverlay(chart: ChartDataForHouse): HouseOverlayResult {
  // Initialize mode scores
  const rawScores = {
    angular: 0,
    succedent: 0,
    cadent: 0
  };

  // Track planets per house
  const housePlanets: Map<number, string[]> = new Map();
  for (let i = 1; i <= 12; i++) {
    housePlanets.set(i, []);
  }

  let totalWeight = 0;

  // Calculate from planets
  for (const planet of chart.planets) {
    const house = planet.house;
    if (house >= 1 && house <= 12) {
      const weight = PLANET_WEIGHTS[planet.name] || 1.0;

      if (ANGULAR_HOUSES.includes(house)) {
        rawScores.angular += weight;
      } else if (SUCCEDENT_HOUSES.includes(house)) {
        rawScores.succedent += weight;
      } else if (CADENT_HOUSES.includes(house)) {
        rawScores.cadent += weight;
      }

      housePlanets.get(house)!.push(planet.name);
      totalWeight += weight;
    }
  }

  // Normalize scores to 0..1
  const angularScore = totalWeight > 0 ? rawScores.angular / totalWeight : 0.33;
  const succedentScore = totalWeight > 0 ? rawScores.succedent / totalWeight : 0.33;
  const cadentScore = totalWeight > 0 ? rawScores.cadent / totalWeight : 0.33;

  // Determine dominant mode
  const dominantMode = determineDominantMode(angularScore, succedentScore, cadentScore);

  // Determine life emphasis
  const lifeEmphasis = getLifeEmphasis(dominantMode);

  // Calculate house delta for decision engine
  // Angular emphasis slightly boosts action-oriented decisions
  const houseDelta = dominantMode === 'Angular' ? 0.04 :
                     dominantMode === 'Succedent' ? 0.02 :
                     dominantMode === 'Cadent' ? -0.02 : 0;

  // Build house highlights
  const houseHighlights = buildHouseHighlights(housePlanets);

  // Build narrative
  const narrative = buildHouseNarrative(dominantMode, houseHighlights);

  // Get strengths and challenges
  const { strengths, challenges } = getHouseTraits(dominantMode, houseHighlights);

  return {
    angularScore,
    succedentScore,
    cadentScore,
    dominantMode,
    houseDelta,
    lifeEmphasis,
    narrative,
    strengths,
    challenges,
    houseHighlights
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function determineDominantMode(
  angular: number,
  succedent: number,
  cadent: number
): HouseMode {
  const threshold = 0.4;
  const balanceThreshold = 0.1;

  // Check for strong dominance
  if (angular > threshold && angular > succedent + 0.1 && angular > cadent + 0.1) {
    return 'Angular';
  }
  if (succedent > threshold && succedent > angular + 0.1 && succedent > cadent + 0.1) {
    return 'Succedent';
  }
  if (cadent > threshold && cadent > angular + 0.1 && cadent > succedent + 0.1) {
    return 'Cadent';
  }

  // Check for balance
  const variance = calculateVariance([angular, succedent, cadent]);
  if (variance < balanceThreshold) {
    return 'Balanced';
  }

  // Return dominant
  const max = Math.max(angular, succedent, cadent);
  if (max === angular) return 'Angular';
  if (max === succedent) return 'Succedent';
  return 'Cadent';
}

function calculateVariance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

function getLifeEmphasis(mode: HouseMode): LifeEmphasis {
  switch (mode) {
    case 'Angular': return 'Action & Visibility';
    case 'Succedent': return 'Resources & Pleasure';
    case 'Cadent': return 'Learning & Service';
    default: return 'Well-Rounded Expression';
  }
}

function buildHouseHighlights(housePlanets: Map<number, string[]>): HouseHighlight[] {
  const highlights: HouseHighlight[] = [];

  for (const [house, planets] of housePlanets) {
    if (planets.length === 0) continue;

    let strength: 'strong' | 'moderate' | 'light';
    if (planets.length >= 3 || planets.includes('Sun') || planets.includes('Moon')) {
      strength = 'strong';
    } else if (planets.length === 2) {
      strength = 'moderate';
    } else {
      strength = 'light';
    }

    const houseInfo = HOUSE_THEMES[house];

    highlights.push({
      house,
      planets,
      theme: houseInfo.theme,
      strength
    });
  }

  // Sort by strength
  const strengthOrder = { strong: 0, moderate: 1, light: 2 };
  highlights.sort((a, b) => strengthOrder[a.strength] - strengthOrder[b.strength]);

  return highlights;
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildHouseNarrative(mode: HouseMode, highlights: HouseHighlight[]): string {
  const modeNarratives: Record<HouseMode, string> = {
    Angular: 'Your chart emphasizes the Angular houses—the axes of initiative and action. You are built to make an impact, to be visible, and to take decisive action in the world. Life places you at pivotal points.',

    Succedent: 'Your chart emphasizes the Succedent houses—the realms of resources and consolidation. You are built to build, to enjoy, and to accumulate. Life rewards your patient cultivation.',

    Cadent: 'Your chart emphasizes the Cadent houses—the zones of learning and transition. You are built to learn, to serve, and to adapt. Life presents you with endless opportunities for growth and understanding.',

    Balanced: 'Your chart distributes energy evenly across house types, giving you a well-rounded approach to life. You can initiate, consolidate, and adapt as circumstances require.'
  };

  let narrative = modeNarratives[mode];

  // Add strongest house highlight
  const strongHighlights = highlights.filter(h => h.strength === 'strong');
  if (strongHighlights.length > 0) {
    const strongest = strongHighlights[0];
    const houseInfo = HOUSE_THEMES[strongest.house];
    narrative += ` The ${houseInfo.name} (${strongest.house}) is particularly emphasized, drawing your attention to ${houseInfo.keywords.slice(0, 2).join(' and ')}.`;
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getHouseTraits(
  mode: HouseMode,
  highlights: HouseHighlight[]
): { strengths: string[]; challenges: string[] } {
  const modeStrengths: Record<HouseMode, string[]> = {
    Angular: ['Initiative', 'Leadership', 'Visibility', 'Direct action'],
    Succedent: ['Resourcefulness', 'Steadiness', 'Enjoyment', 'Building wealth'],
    Cadent: ['Adaptability', 'Learning ability', 'Service orientation', 'Mental agility'],
    Balanced: ['Versatility', 'Well-rounded approach', 'Adaptable strategies']
  };

  const modeChallenges: Record<HouseMode, string[]> = {
    Angular: ['Impatience', 'Overexposure', 'Need for constant action'],
    Succedent: ['Possessiveness', 'Resistance to change', 'Comfort-seeking'],
    Cadent: ['Difficulty taking action', 'Overthinking', 'Self-doubt'],
    Balanced: ['Lack of strong focus', 'Jack of all trades syndrome']
  };

  const strengths = [...modeStrengths[mode]];
  const challenges = [...modeChallenges[mode]];

  // Add highlight-specific traits
  const strongHighlights = highlights.filter(h => h.strength === 'strong');
  for (const highlight of strongHighlights.slice(0, 2)) {
    const houseInfo = HOUSE_THEMES[highlight.house];
    strengths.push(`Strong ${houseInfo.keywords[0]} focus`);
  }

  return {
    strengths: strengths.slice(0, 5),
    challenges: challenges.slice(0, 4)
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const HousePersonaVoices: Record<HouseMode, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  Angular: {
    mentor: 'You are positioned for impact. Use your visibility wisely—what the world sees, it remembers. Lead with intention.',
    oracle: 'The cardinal points of destiny align for you. You stand at the crossroads where action shapes fate.',
    companion: 'You really know how to make things happen! Just remember that sometimes stepping back is powerful too.',
    mirror: 'Notice how naturally you gravitate to positions of initiative. That capacity for action is your gift—use it consciously.'
  },
  Succedent: {
    mentor: 'Your power lies in building lasting structures. Do not rush—what you create slowly, endures. Value what you cultivate.',
    oracle: 'The treasure houses open for you. You are keeper of resources both tangible and invisible.',
    companion: 'You really know how to create comfort and stability. Just don't forget to shake things up sometimes!',
    mirror: 'Notice how you naturally build and consolidate. That capacity for sustaining is your gift—appreciate its worth.'
  },
  Cadent: {
    mentor: 'Your wisdom comes through learning and service. Do not underestimate the power of preparation—action will follow understanding.',
    oracle: 'The mutable paths of transformation open to you. You are student of all, servant of the mystery.',
    companion: 'Your mind is always growing! Remember that action is also learning—sometimes you just have to jump in.',
    mirror: 'Notice how naturally you learn and adapt. That flexibility is your gift—trust it to lead you forward.'
  },
  Balanced: {
    mentor: 'Your chart gifts you versatility. The challenge is focus—choose where to direct this well-rounded energy.',
    oracle: 'All houses call equally to you. You are pilgrim of the whole wheel, lacking nothing, mastering through breadth.',
    companion: 'You can really do anything! The question is what you most want to do. What lights you up?',
    mirror: 'Notice your ability to engage with any life area. That versatility is freedom—if you choose your focus.'
  }
};

/**
 * Get house persona voice
 */
export function getHousePersonaVoice(
  result: HouseOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return HousePersonaVoices[result.dominantMode][role];
}

// ========================================
// HOUSE COMPATIBILITY
// ========================================

/**
 * Calculate house compatibility between two charts
 */
export function calculateHouseCompatibility(
  chart1: HouseOverlayResult,
  chart2: HouseOverlayResult
): {
  score: number;
  analysis: string;
  dynamics: string[];
} {
  const mode1 = chart1.dominantMode;
  const mode2 = chart2.dominantMode;

  let score = 0.5; // Neutral base
  const dynamics: string[] = [];

  // Same mode = understanding but potential competition
  if (mode1 === mode2) {
    score += 0.1;
    dynamics.push(`Shared ${mode1} emphasis creates mutual understanding`);
    if (mode1 === 'Angular') {
      dynamics.push('May compete for visibility');
    }
  }

  // Angular + Succedent = good partnership (action + stability)
  if ((mode1 === 'Angular' && mode2 === 'Succedent') ||
      (mode1 === 'Succedent' && mode2 === 'Angular')) {
    score += 0.2;
    dynamics.push('Action meets stability—strong partnership potential');
  }

  // Succedent + Cadent = building + learning
  if ((mode1 === 'Succedent' && mode2 === 'Cadent') ||
      (mode1 === 'Cadent' && mode2 === 'Succedent')) {
    score += 0.15;
    dynamics.push('Stability meets adaptability—complementary growth');
  }

  // Angular + Cadent = action + analysis (can work but needs balance)
  if ((mode1 === 'Angular' && mode2 === 'Cadent') ||
      (mode1 === 'Cadent' && mode2 === 'Angular')) {
    score += 0.05;
    dynamics.push('Action meets analysis—requires patience');
    dynamics.push('Angular partner may need to slow down');
  }

  // Balanced with anything is generally good
  if (mode1 === 'Balanced' || mode2 === 'Balanced') {
    score += 0.1;
    dynamics.push('Balanced partner provides flexibility');
  }

  // Check for complementary house highlights
  const strongHouses1 = chart1.houseHighlights.filter(h => h.strength === 'strong').map(h => h.house);
  const strongHouses2 = chart2.houseHighlights.filter(h => h.strength === 'strong').map(h => h.house);

  // 7th house emphasis in either chart is good for partnership
  if (strongHouses1.includes(7) || strongHouses2.includes(7)) {
    score += 0.1;
    dynamics.push('Partnership house emphasized—relationship focus');
  }

  // Axis activations (1-7, 4-10) create strong dynamics
  if ((strongHouses1.includes(1) && strongHouses2.includes(7)) ||
      (strongHouses1.includes(7) && strongHouses2.includes(1))) {
    score += 0.1;
    dynamics.push('Self-Other axis activated between charts');
  }

  score = Math.max(0, Math.min(1, score));

  // Generate analysis
  let analysis: string;
  if (score >= 0.7) {
    analysis = `${mode1} and ${mode2} emphases complement each other well, creating potential for balanced partnership dynamics.`;
  } else if (score >= 0.5) {
    analysis = `${mode1} and ${mode2} can work together with mutual understanding of different pacing and priorities.`;
  } else {
    analysis = `${mode1} and ${mode2} represent different life rhythms. Success requires appreciating contrasting approaches.`;
  }

  return { score, analysis, dynamics };
}

// ========================================
// PILGRIM JOURNEY CHAMBERS
// ========================================

export interface HouseChamber {
  id: string;
  name: string;
  description: string;
  mode: HouseMode;
  ritualHour: string;
}

export const HouseChambers: Record<HouseMode, HouseChamber> = {
  Angular: {
    id: 'hall-of-cardinal-action',
    name: 'The Hall of Cardinal Action',
    description: 'You stand in the Hall of Cardinal Action, where four great doors open to the compass points. Here, every step is the first step, every decision shapes destiny. The energy crackles with potential.',
    mode: 'Angular',
    ritualHour: 'Sunrise, Noon, Sunset, Midnight'
  },
  Succedent: {
    id: 'treasury-of-fixed-earth',
    name: 'The Treasury of Fixed Earth',
    description: 'You enter the Treasury of Fixed Earth, where wealth beyond gold accumulates in patient silence. Here, value is created through persistence, and pleasure is earned through cultivation.',
    mode: 'Succedent',
    ritualHour: 'Between the hours'
  },
  Cadent: {
    id: 'library-of-mutable-wisdom',
    name: 'The Library of Mutable Wisdom',
    description: 'You wander through the Library of Mutable Wisdom, where scrolls rearrange themselves and every answer leads to deeper questions. Here, learning never ends and service is the highest calling.',
    mode: 'Cadent',
    ritualHour: 'The changing hours'
  },
  Balanced: {
    id: 'rotunda-of-the-complete-wheel',
    name: 'The Rotunda of the Complete Wheel',
    description: 'You stand in the Rotunda where all twelve houses are represented equally. The wheel turns around you, and you are its still center—capable of engaging with any direction.',
    mode: 'Balanced',
    ritualHour: 'All hours equally'
  }
};

/**
 * Get house chamber narrative
 */
export function getHouseChamberNarrative(result: HouseOverlayResult): string {
  const chamber = HouseChambers[result.dominantMode];
  return `${chamber.description} Your ${result.lifeEmphasis.toLowerCase()} orientation finds its temple here.`;
}

// ========================================
// EXPORTS
// ========================================

export {
  HOUSE_THEMES,
  ANGULAR_HOUSES,
  SUCCEDENT_HOUSES,
  CADENT_HOUSES
};
