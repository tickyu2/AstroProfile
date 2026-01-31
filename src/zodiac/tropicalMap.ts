/**
 * Tropical Zodiac Map - Educational Data
 *
 * A single canonical dataset that powers wheel labels, info boxes,
 * and Khan Academy-style angle lessons.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type SignKey =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface AcademyBox {
  headline: string;
  seasonalMeaning: string;
  energyFlow: string;        // Spark/Fuel/Smoke teaching
  beginnerTakeaway: string;  // one-liner
}

export interface SignLesson {
  sign: SignKey;
  symbol: string;
  season: Season;
  element: Element;
  modality: Modality;
  seasonRoleNumber: 1 | 2 | 3; // 1=Cardinal (Spark), 2=Fixed (Fuel), 3=Mutable (Smoke)
  shortMantra: string;
  academyBox: AcademyBox;
}

// =============================================================================
// TROPICAL ORDER
// =============================================================================

export const TROPICAL_ORDER: SignKey[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// =============================================================================
// SIGN LESSONS DATA
// =============================================================================

export const SIGN_LESSONS: Record<SignKey, SignLesson> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING: Aries → Taurus → Gemini
  // ═══════════════════════════════════════════════════════════════════════════
  Aries: {
    sign: 'Aries',
    symbol: '♈',
    season: 'Spring',
    element: 'Fire',
    modality: 'Cardinal',
    seasonRoleNumber: 1,
    shortMantra: 'The Spark',
    academyBox: {
      headline: 'Aries initiates Spring: the spark of emergence.',
      seasonalMeaning:
        'This is the astrological New Year — life breaks the seal and declares: "I am." The vernal equinox marks the moment when light overtakes darkness, and Aries carries this breakthrough energy.',
      energyFlow:
        'Cardinal (1): The Spark. Aries starts the fire — initiative, courage, first steps. Like the first green shoot pushing through frozen soil, Aries energy is about beginning without guarantee.',
      beginnerTakeaway:
        'Aries energy teaches clean beginnings: act first, refine later.',
    },
  },

  Taurus: {
    sign: 'Taurus',
    symbol: '♉',
    season: 'Spring',
    element: 'Earth',
    modality: 'Fixed',
    seasonRoleNumber: 2,
    shortMantra: 'The Fuel',
    academyBox: {
      headline: 'Taurus stabilizes Spring: the fuel of growth.',
      seasonalMeaning:
        'What Aries starts, Taurus sustains. This is mid-spring — roots deepen, growth becomes reliable. The burst of emergence needs grounding to become something lasting.',
      energyFlow:
        'Fixed (2): The Fuel. Taurus makes it steady — endurance, embodiment, value. The fire needs wood to keep burning; Taurus provides that steady supply.',
      beginnerTakeaway:
        'Taurus teaches: build it, keep it, nourish it.',
    },
  },

  Gemini: {
    sign: 'Gemini',
    symbol: '♊',
    season: 'Spring',
    element: 'Air',
    modality: 'Mutable',
    seasonRoleNumber: 3,
    shortMantra: 'The Smoke',
    academyBox: {
      headline: 'Gemini completes Spring: the smoke of movement.',
      seasonalMeaning:
        'Growth spreads — ideas, connection, curiosity. Late spring is alive with activity: pollination, birdsong, movement in all directions. Gemini carries this distributed, communicative energy.',
      energyFlow:
        'Mutable (3): The Smoke. Gemini distributes — adaptation, communication, transition. Like smoke rising and dispersing, Gemini energy spreads, connects, and prepares for change.',
      beginnerTakeaway:
        'Gemini teaches: learn fast, connect widely, pivot easily.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMER: Cancer → Leo → Virgo
  // ═══════════════════════════════════════════════════════════════════════════
  Cancer: {
    sign: 'Cancer',
    symbol: '♋',
    season: 'Summer',
    element: 'Water',
    modality: 'Cardinal',
    seasonRoleNumber: 1,
    shortMantra: 'The Spark',
    academyBox: {
      headline: 'Cancer initiates Summer: the spark of belonging.',
      seasonalMeaning:
        'Life protects what it\'s grown. The summer solstice — longest day — marks a turning inward even as light peaks. Cancer begins the season of nurturing what has emerged.',
      energyFlow:
        'Cardinal (1): The Spark. Cancer begins the season of care — home, bonds, safety. This is initiative directed toward protection, a fierce tenderness that creates sanctuary.',
      beginnerTakeaway:
        'Cancer teaches: protect the core.',
    },
  },

  Leo: {
    sign: 'Leo',
    symbol: '♌',
    season: 'Summer',
    element: 'Fire',
    modality: 'Fixed',
    seasonRoleNumber: 2,
    shortMantra: 'The Fuel',
    academyBox: {
      headline: 'Leo is peak Summer: the fuel of radiance.',
      seasonalMeaning:
        'Abundance expresses itself. Mid-summer is unapologetically bright — crops reach full height, days are long and warm. Leo embodies this confident, generous fullness.',
      energyFlow:
        'Fixed (2): The Fuel. Leo sustains heat — presence, loyalty, creative power. The summer sun at its steadiest, warming everything in its reach without apology.',
      beginnerTakeaway:
        'Leo teaches: be seen, warm others, lead with heart.',
    },
  },

  Virgo: {
    sign: 'Virgo',
    symbol: '♍',
    season: 'Summer',
    element: 'Earth',
    modality: 'Mutable',
    seasonRoleNumber: 3,
    shortMantra: 'The Smoke',
    academyBox: {
      headline: 'Virgo completes Summer: the smoke of refinement.',
      seasonalMeaning:
        'The harvest is prepared through care. Late summer is about readiness — separating wheat from chaff, preparing for the transition ahead. Virgo brings discernment to abundance.',
      energyFlow:
        'Mutable (3): The Smoke. Virgo adjusts — repair, skill, improvement. The season\'s energy disperses into useful work, refining what was created into something serviceable.',
      beginnerTakeaway:
        'Virgo teaches: refine what you made.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTUMN: Libra → Scorpio → Sagittarius
  // ═══════════════════════════════════════════════════════════════════════════
  Libra: {
    sign: 'Libra',
    symbol: '♎',
    season: 'Autumn',
    element: 'Air',
    modality: 'Cardinal',
    seasonRoleNumber: 1,
    shortMantra: 'The Spark',
    academyBox: {
      headline: 'Libra initiates Autumn: the spark of relationship.',
      seasonalMeaning:
        'Self meets Other. The autumn equinox — day and night equal — marks the moment of balance. Libra carries this awareness that we exist in relation to others.',
      energyFlow:
        'Cardinal (1): The Spark. Libra begins the social season — balance, fairness, partnership. Initiative directed toward connection, creating bridges between separate selves.',
      beginnerTakeaway:
        'Libra teaches: relate consciously.',
    },
  },

  Scorpio: {
    sign: 'Scorpio',
    symbol: '♏',
    season: 'Autumn',
    element: 'Water',
    modality: 'Fixed',
    seasonRoleNumber: 2,
    shortMantra: 'The Fuel',
    academyBox: {
      headline: 'Scorpio is peak Autumn: the fuel of depth.',
      seasonalMeaning:
        'Bonding becomes transformation. Mid-autumn strips away pretense — leaves fall, life prepares for darkness. Scorpio holds the power of this necessary descent.',
      energyFlow:
        'Fixed (2): The Fuel. Scorpio sustains intensity — trust, power, renewal. The deep fire that burns in the dark, transforming what it touches through unwavering focus.',
      beginnerTakeaway:
        'Scorpio teaches: go deep, don\'t pretend.',
    },
  },

  Sagittarius: {
    sign: 'Sagittarius',
    symbol: '♐',
    season: 'Autumn',
    element: 'Fire',
    modality: 'Mutable',
    seasonRoleNumber: 3,
    shortMantra: 'The Smoke',
    academyBox: {
      headline: 'Sagittarius completes Autumn: the smoke of meaning.',
      seasonalMeaning:
        'Experience becomes wisdom. Late autumn looks toward the horizon — the harvest is in, and now we ask what it all meant. Sagittarius seeks the larger pattern.',
      energyFlow:
        'Mutable (3): The Smoke. Sagittarius expands — truth, travel, perspective. Energy disperses outward seeking meaning, preparing for winter\'s consolidation through exploration.',
      beginnerTakeaway:
        'Sagittarius teaches: widen the horizon.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WINTER: Capricorn → Aquarius → Pisces
  // ═══════════════════════════════════════════════════════════════════════════
  Capricorn: {
    sign: 'Capricorn',
    symbol: '♑',
    season: 'Winter',
    element: 'Earth',
    modality: 'Cardinal',
    seasonRoleNumber: 1,
    shortMantra: 'The Spark',
    academyBox: {
      headline: 'Capricorn initiates Winter: the spark of structure.',
      seasonalMeaning:
        'Energy conserves and commits. The winter solstice — shortest day — marks the return of light within darkness. Capricorn begins the work of building what will last.',
      energyFlow:
        'Cardinal (1): The Spark. Capricorn begins winter work — build, endure, plan. Initiative directed toward achievement, creating structures that outlast the builder.',
      beginnerTakeaway:
        'Capricorn teaches: do what lasts.',
    },
  },

  Aquarius: {
    sign: 'Aquarius',
    symbol: '♒',
    season: 'Winter',
    element: 'Air',
    modality: 'Fixed',
    seasonRoleNumber: 2,
    shortMantra: 'The Fuel',
    academyBox: {
      headline: 'Aquarius is peak Winter: the fuel of vision.',
      seasonalMeaning:
        'The future is imagined in cold clarity. Mid-winter\'s stillness creates space for seeing what could be. Aquarius holds visions that transcend present limitations.',
      energyFlow:
        'Fixed (2): The Fuel. Aquarius sustains ideas — systems, community, innovation. The steady flame of conviction that lights the way forward through the darkest season.',
      beginnerTakeaway:
        'Aquarius teaches: redesign the world.',
    },
  },

  Pisces: {
    sign: 'Pisces',
    symbol: '♓',
    season: 'Winter',
    element: 'Water',
    modality: 'Mutable',
    seasonRoleNumber: 3,
    shortMantra: 'The Smoke',
    academyBox: {
      headline: 'Pisces completes Winter: the smoke of dissolution.',
      seasonalMeaning:
        'The cycle releases, dreams, and resets. Late winter holds the paradox of ending and beginning — ice melts, boundaries soften, the wheel prepares to turn again.',
      energyFlow:
        'Mutable (3): The Smoke. Pisces transitions — mercy, imagination, surrender. The final dispersal before renewal, where separate streams merge back into the cosmic ocean.',
      beginnerTakeaway:
        'Pisces teaches: release so rebirth can happen.',
    },
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the index (0-11) for a sign in tropical order
 */
export function getSignIndex(sign: SignKey): number {
  return TROPICAL_ORDER.indexOf(sign);
}

/**
 * Get the sign at a given index (wraps around)
 */
export function getSignAtIndex(index: number): SignKey {
  const normalized = ((index % 12) + 12) % 12;
  return TROPICAL_ORDER[normalized];
}

/**
 * Get the sign N steps away (positive = clockwise)
 */
export function getSignOffset(from: SignKey, steps: number): SignKey {
  const fromIndex = getSignIndex(from);
  return getSignAtIndex(fromIndex + steps);
}

/**
 * Get the opposite sign (180° away)
 */
export function getOppositeSign(sign: SignKey): SignKey {
  return getSignOffset(sign, 6);
}

/**
 * Get signs that share the same element
 */
export function getSameElementSigns(sign: SignKey): SignKey[] {
  const lesson = SIGN_LESSONS[sign];
  return TROPICAL_ORDER.filter(s => SIGN_LESSONS[s].element === lesson.element);
}

/**
 * Get signs that share the same modality
 */
export function getSameModalitySigns(sign: SignKey): SignKey[] {
  const lesson = SIGN_LESSONS[sign];
  return TROPICAL_ORDER.filter(s => SIGN_LESSONS[s].modality === lesson.modality);
}

/**
 * Get signs in the same season
 */
export function getSameSeasonSigns(sign: SignKey): SignKey[] {
  const lesson = SIGN_LESSONS[sign];
  return TROPICAL_ORDER.filter(s => SIGN_LESSONS[s].season === lesson.season);
}

// =============================================================================
// SEASONAL TEACHING CONSTANTS
// =============================================================================

export const SEASON_EMOJI: Record<Season, string> = {
  Spring: '🌸',
  Summer: '☀️',
  Autumn: '🍂',
  Winter: '❄️',
};

export const ELEMENT_EMOJI: Record<Element, string> = {
  Fire: '🔥',
  Earth: '🌍',
  Air: '💨',
  Water: '💧',
};

export const MODALITY_ROLE: Record<Modality, { number: number; name: string; verb: string }> = {
  Cardinal: { number: 1, name: 'The Spark', verb: 'initiates' },
  Fixed: { number: 2, name: 'The Fuel', verb: 'sustains' },
  Mutable: { number: 3, name: 'The Smoke', verb: 'transitions' },
};

// =============================================================================
// EXPORTS
// =============================================================================

export default SIGN_LESSONS;
