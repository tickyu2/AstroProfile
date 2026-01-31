/**
 * pureSignArchetypes.ts
 * =====================
 *
 * The 12 Pure Sign Archetypes — the Temples of the Zodiac.
 * These are the mythic cores, the unblended essences, the pillars
 * that anchor the 72 cusp-day archetypes.
 *
 * Written in mythic, Academy-consistent voice.
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export type PureSignStory = {
  mythicOrigin: string;
  psychologicalMetaphor: string;
  modernExpression: string;
};

export type PureSignArchetype = {
  sign: string;
  symbol: string;
  element: string;
  modality: string;
  polarity: string;
  rulingPlanet: string;
  mythicName: string;
  title: string;
  psychologicalProfile: string;
  coreMotivation: string;
  strengths: string[];
  shadows: string[];
  lifeTheme: string;
  seasonalArc: string;
  dateRange: string;
  story: PureSignStory;
};

// =============================================================================
// ELEMENT & MODALITY CONSTANTS
// =============================================================================

export const ELEMENTS = {
  Fire: { emoji: '🔥', color: '#ef4444', quality: 'Active, Expressive, Warm' },
  Earth: { emoji: '🌍', color: '#22c55e', quality: 'Receptive, Stable, Practical' },
  Air: { emoji: '💨', color: '#38bdf8', quality: 'Active, Mental, Connective' },
  Water: { emoji: '💧', color: '#8b5cf6', quality: 'Receptive, Emotional, Intuitive' },
};

export const MODALITIES = {
  Cardinal: { description: 'Initiating energy — begins seasons and cycles' },
  Fixed: { description: 'Stabilizing energy — sustains and deepens' },
  Mutable: { description: 'Transitional energy — adapts and transforms' },
};

export const POLARITIES = {
  Yang: { description: 'Outward, active, expressive' },
  Yin: { description: 'Inward, receptive, reflective' },
};

// =============================================================================
// PURE SIGN ARCHETYPE DATA
// =============================================================================

export const PURE_SIGNS: PureSignArchetype[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ♈ ARIES — The First Fire
  // Cardinal Fire | Yang | Mars
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    polarity: 'Yang',
    rulingPlanet: 'Mars',
    mythicName: 'The Sacred Flame',
    title: 'The First Spark of Being',
    psychologicalProfile: 'Aries is pure ignition — the soul\'s instinct to begin, to leap, to declare itself. It is courage without calculation, motion without hesitation, life discovering its own will.',
    coreMotivation: 'To exist fully, to act decisively, to be first.',
    strengths: ['Fearless initiative', 'Direct honesty', 'Life-force vitality'],
    shadows: ['Impulsiveness', 'Short temper', 'Difficulty with patience'],
    lifeTheme: 'Learning to channel raw will into meaningful beginnings.',
    seasonalArc: 'Spring Equinox — the world awakens, and Aries leads the charge.',
    dateRange: 'March 21 - April 19',
    story: {
      mythicOrigin: 'Born from the cosmic spark that ignited creation, Aries is the flame that leapt first into existence — the primal "Yes!" that shattered the void.',
      psychologicalMetaphor: 'A match struck in darkness — brief, bright, undeniable. The courage to exist before knowing why.',
      modernExpression: 'The entrepreneur, the activist, the first to volunteer, the one who says "I\'ll go" before the sentence is finished.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♉ TAURUS — The First Earth
  // Fixed Earth | Yin | Venus
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    polarity: 'Yin',
    rulingPlanet: 'Venus',
    mythicName: 'The Rooted One',
    title: 'The Keeper of the Garden',
    psychologicalProfile: 'Taurus is pure embodiment — the instinct to stabilize, savor, and protect. It is the wisdom of the body, the devotion to what is real, and the art of making life beautiful.',
    coreMotivation: 'To possess, to preserve, to enjoy.',
    strengths: ['Patience', 'Endurance', 'Sensual appreciation'],
    shadows: ['Stubbornness', 'Resistance to change', 'Possessiveness'],
    lifeTheme: 'Cultivating a life of beauty, security, and steady growth.',
    seasonalArc: 'Mid-Spring — when the earth softens and seeds take root.',
    dateRange: 'April 20 - May 20',
    story: {
      mythicOrigin: 'Formed from the first clay that held its shape, Taurus is the earth that learned to endure — the mountain that remembers every rain.',
      psychologicalMetaphor: 'A garden tended for decades — patient, rich, bearing fruit in its own time.',
      modernExpression: 'The craftsperson, the chef, the collector, the one who builds wealth through persistence and knows the value of waiting.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♊ GEMINI — The First Air
  // Mutable Air | Yang | Mercury
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    polarity: 'Yang',
    rulingPlanet: 'Mercury',
    mythicName: 'The Twin Winds',
    title: 'The Messenger of Possibility',
    psychologicalProfile: 'Gemini is pure curiosity — the mind\'s delight in movement, language, and connection. It is the spark of thought that leaps, questions, and plays.',
    coreMotivation: 'To know, to communicate, to connect.',
    strengths: ['Adaptability', 'Communication', 'Quick learning'],
    shadows: ['Scattered focus', 'Inconsistency', 'Surface-level engagement'],
    lifeTheme: 'Exploring the world through ideas, stories, and conversation.',
    seasonalArc: 'Late Spring — the air warms, breezes carry pollen and promise.',
    dateRange: 'May 21 - June 20',
    story: {
      mythicOrigin: 'Born as the first echo, Gemini split into two to carry messages between worlds — the trickster who learned that language itself is magic.',
      psychologicalMetaphor: 'A butterfly moving between flowers — brief at each, but pollinating everything it touches.',
      modernExpression: 'The journalist, the teacher, the networker, the one who knows someone in every field and connects dots others cannot see.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♋ CANCER — The First Water
  // Cardinal Water | Yin | Moon
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    polarity: 'Yin',
    rulingPlanet: 'Moon',
    mythicName: 'The Moon-Bearer',
    title: 'The Keeper of Tides',
    psychologicalProfile: 'Cancer is pure feeling — the instinct to protect, nurture, and remember. It is the emotional hearth, the ancestral memory, the pulse of belonging.',
    coreMotivation: 'To nurture, to protect, to belong.',
    strengths: ['Empathy', 'Intuition', 'Protective devotion'],
    shadows: ['Moodiness', 'Defensiveness', 'Clinging to the past'],
    lifeTheme: 'Learning to care deeply without losing oneself.',
    seasonalArc: 'Summer Solstice — the longest light before the turning.',
    dateRange: 'June 21 - July 22',
    story: {
      mythicOrigin: 'Formed from the first tear of the Moon, Cancer carries the memory of every creature that ever needed shelter — the tide that returns home.',
      psychologicalMetaphor: 'A shell — protective armor on the outside, soft vulnerability within, always carrying home on its back.',
      modernExpression: 'The therapist, the mother, the historian, the one whose home feels like a sanctuary and who remembers every birthday.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♌ LEO — The Solar Heart
  // Fixed Fire | Yang | Sun
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    polarity: 'Yang',
    rulingPlanet: 'Sun',
    mythicName: 'The Solar Child',
    title: 'The Radiant Self',
    psychologicalProfile: 'Leo is pure expression — the soul\'s desire to shine, create, and be seen. It is the warmth of authenticity, the courage of joy, the fire of identity.',
    coreMotivation: 'To create, to express, to be recognized.',
    strengths: ['Confidence', 'Creativity', 'Generosity'],
    shadows: ['Pride', 'Attention-seeking', 'Dramatic reactions'],
    lifeTheme: 'Expressing the true self with courage and heart.',
    seasonalArc: 'High Summer — the sun at its most radiant and bold.',
    dateRange: 'July 23 - August 22',
    story: {
      mythicOrigin: 'Born from the heart of the Sun itself, Leo is the light that refuses to dim — the royal flame that warms all who approach.',
      psychologicalMetaphor: 'A bonfire at night — everyone gathers around, drawn by warmth and light they cannot generate alone.',
      modernExpression: 'The performer, the leader, the creative director, the one who walks into a room and somehow becomes its center.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♍ VIRGO — The Sacred Craft
  // Mutable Earth | Yin | Mercury
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    polarity: 'Yin',
    rulingPlanet: 'Mercury',
    mythicName: 'The Quiet Artisan',
    title: 'The Devotee of Refinement',
    psychologicalProfile: 'Virgo is pure discernment — the instinct to improve, heal, and serve. It is the sacred craft of making life cleaner, clearer, and more whole.',
    coreMotivation: 'To perfect, to serve, to heal.',
    strengths: ['Precision', 'Service', 'Analytical clarity'],
    shadows: ['Perfectionism', 'Self-criticism', 'Overthinking'],
    lifeTheme: 'Honoring the sacredness of detail and devotion.',
    seasonalArc: 'Late Summer harvest — gathering what has grown.',
    dateRange: 'August 23 - September 22',
    story: {
      mythicOrigin: 'Born from the first grain that was sorted from chaff, Virgo is the wisdom that knows which seed to save — the sacred craft of discernment.',
      psychologicalMetaphor: 'A healer\'s hands — they notice what others miss, mend what others break, perfect what others accept.',
      modernExpression: 'The editor, the analyst, the nurse, the one who quietly fixes everything and asks for nothing in return.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♎ LIBRA — The Sacred Balance
  // Cardinal Air | Yang | Venus
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    polarity: 'Yang',
    rulingPlanet: 'Venus',
    mythicName: 'The Harmonist',
    title: 'The Weaver of Worlds',
    psychologicalProfile: 'Libra is pure harmony — the instinct to balance, relate, and beautify. It is the art of connection, the grace of diplomacy, the pursuit of fairness.',
    coreMotivation: 'To harmonize, to relate, to create beauty.',
    strengths: ['Social intelligence', 'Aesthetic sense', 'Diplomacy'],
    shadows: ['Indecision', 'People-pleasing', 'Avoiding conflict'],
    lifeTheme: 'Creating harmony without losing authenticity.',
    seasonalArc: 'Autumn Equinox — when day and night find balance.',
    dateRange: 'September 23 - October 22',
    story: {
      mythicOrigin: 'Forged from the scale that weighs souls, Libra is justice made beautiful — the first creature to see that relationship creates meaning.',
      psychologicalMetaphor: 'A bridge between two cliffs — necessary, graceful, always seeking to connect what would otherwise be divided.',
      modernExpression: 'The mediator, the designer, the partner, the one who makes every room more beautiful and every conflict less painful.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♏ SCORPIO — The Sacred Depth
  // Fixed Water | Yin | Pluto (Mars traditional)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    polarity: 'Yin',
    rulingPlanet: 'Pluto',
    mythicName: 'The Depth-Bearer',
    title: 'The Keeper of Shadows',
    psychologicalProfile: 'Scorpio is pure intensity — the instinct to merge, transform, and uncover truth. It is emotional x-ray vision, the courage to face the underworld.',
    coreMotivation: 'To transform, to merge, to uncover truth.',
    strengths: ['Depth', 'Loyalty', 'Transformative power'],
    shadows: ['Control', 'Jealousy', 'Fear of vulnerability'],
    lifeTheme: 'Transforming through truth, intimacy, and courage.',
    seasonalArc: 'Deep Autumn — when leaves fall and life turns inward.',
    dateRange: 'October 23 - November 21',
    story: {
      mythicOrigin: 'Born from the first secret whispered in darkness, Scorpio is the keeper of what others fear to name — the phoenix that chooses fire.',
      psychologicalMetaphor: 'Deep water — what lies beneath the surface is far more powerful than what shows. Still, yet capable of drowning or healing.',
      modernExpression: 'The detective, the surgeon, the psychologist, the one who sees through every mask and loves anyway.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♐ SAGITTARIUS — The Sacred Quest
  // Mutable Fire | Yang | Jupiter
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    polarity: 'Yang',
    rulingPlanet: 'Jupiter',
    mythicName: 'The Arrow of Truth',
    title: 'The Seeker of Horizons',
    psychologicalProfile: 'Sagittarius is pure expansion — the instinct to explore, question, and liberate. It is the fire of meaning, the joy of discovery, the hunger for truth.',
    coreMotivation: 'To explore, to understand, to be free.',
    strengths: ['Optimism', 'Wisdom', 'Adventurous spirit'],
    shadows: ['Restlessness', 'Dogmatism', 'Escapism'],
    lifeTheme: 'Seeking truth through experience and exploration.',
    seasonalArc: 'Late Autumn — preparing for the long journey ahead.',
    dateRange: 'November 22 - December 21',
    story: {
      mythicOrigin: 'Born from the first arrow shot at the horizon, Sagittarius is the soul\'s refusal to accept boundaries — the centaur who became the teacher.',
      psychologicalMetaphor: 'An arrow in flight — committed, directional, impossible to call back. It believes in what it aims for.',
      modernExpression: 'The philosopher, the traveler, the professor, the one who makes you laugh while teaching you something profound.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♑ CAPRICORN — The Sacred Mountain
  // Cardinal Earth | Yin | Saturn
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    polarity: 'Yin',
    rulingPlanet: 'Saturn',
    mythicName: 'The Mountain-Bearer',
    title: 'The Architect of Reality',
    psychologicalProfile: 'Capricorn is pure structure — the instinct to build, endure, and master. It is responsibility made sacred, ambition made meaningful.',
    coreMotivation: 'To achieve, to master, to build.',
    strengths: ['Discipline', 'Resilience', 'Strategic thinking'],
    shadows: ['Pessimism', 'Workaholism', 'Emotional reserve'],
    lifeTheme: 'Climbing toward mastery with integrity and patience.',
    seasonalArc: 'Winter Solstice — the longest night, the slow return of light.',
    dateRange: 'December 22 - January 19',
    story: {
      mythicOrigin: 'Carved from the first mountain that refused to erode, Capricorn is time\'s wisdom made flesh — the goat that climbs where eagles fear.',
      psychologicalMetaphor: 'A stone staircase — each step was labor, each rise was earned. No shortcuts, no excuses, only patient ascent.',
      modernExpression: 'The CEO, the architect, the elder, the one who started with nothing and built an empire through sheer will.'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♒ AQUARIUS — The Sacred Vision
  // Fixed Air | Yang | Uranus (Saturn traditional)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    polarity: 'Yang',
    rulingPlanet: 'Uranus',
    mythicName: 'The Sky-Bearer',
    title: 'The Architect of the Future',
    psychologicalProfile: 'Aquarius is pure vision — the instinct to innovate, liberate, and reimagine. It is the mind that sees beyond the present, the rebel with a blueprint.',
    coreMotivation: 'To innovate, to liberate, to serve humanity.',
    strengths: ['Originality', 'Humanitarian ideals', 'Independent thought'],
    shadows: ['Detachment', 'Rebellion for its own sake', 'Alienation'],
    lifeTheme: 'Reinventing the world with clarity and courage.',
    seasonalArc: 'Deep Winter — when survival requires ingenuity.',
    dateRange: 'January 20 - February 18',
    story: {
      mythicOrigin: 'Born from the first lightning bolt of original thought, Aquarius is the future remembered — the water-bearer who pours consciousness onto barren ground.',
      psychologicalMetaphor: 'A radio signal from the future — strange, clear, impossible to ignore, carrying information no one asked for but everyone needs.',
      modernExpression: 'The inventor, the activist, the coder, the one who sees systems others accept and asks: "But what if we tried something completely different?"'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ♓ PISCES — The Sacred Ocean
  // Mutable Water | Yin | Neptune (Jupiter traditional)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    polarity: 'Yin',
    rulingPlanet: 'Neptune',
    mythicName: 'The Dream-Bearer',
    title: 'The Ocean of Souls',
    psychologicalProfile: 'Pisces is pure dissolution — the instinct to merge, imagine, and transcend. It is the mystic\'s heart, the poet\'s vision, the healer\'s compassion.',
    coreMotivation: 'To transcend, to heal, to dream.',
    strengths: ['Empathy', 'Creativity', 'Spiritual depth'],
    shadows: ['Escapism', 'Boundary loss', 'Emotional overwhelm'],
    lifeTheme: 'Learning to dream without disappearing.',
    seasonalArc: 'Late Winter — when the world softens before spring\'s return.',
    dateRange: 'February 19 - March 20',
    story: {
      mythicOrigin: 'Formed from the last waters of the primordial ocean, Pisces carries the memory of every soul before it — the tide that knows every shore but belongs to none.',
      psychologicalMetaphor: 'A tide that knows every shore — formless, feeling everything, capable of healing or drowning in its own depth.',
      modernExpression: 'The artist, the healer, the dreamer, the one who feels the world before they understand it and loves without conditions.'
    }
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a pure sign archetype by sign name
 */
export function getPureSign(sign: string): PureSignArchetype | undefined {
  return PURE_SIGNS.find((s) => s.sign.toLowerCase() === sign.toLowerCase());
}

/**
 * Get a pure sign archetype by symbol
 */
export function getPureSignBySymbol(symbol: string): PureSignArchetype | undefined {
  return PURE_SIGNS.find((s) => s.symbol === symbol);
}

/**
 * Get all pure signs as a list
 */
export function listPureSigns(): PureSignArchetype[] {
  return PURE_SIGNS;
}

/**
 * Get signs by element
 */
export function getSignsByElement(element: string): PureSignArchetype[] {
  return PURE_SIGNS.filter((s) => s.element.toLowerCase() === element.toLowerCase());
}

/**
 * Get signs by modality
 */
export function getSignsByModality(modality: string): PureSignArchetype[] {
  return PURE_SIGNS.filter((s) => s.modality.toLowerCase() === modality.toLowerCase());
}

/**
 * Get signs by polarity
 */
export function getSignsByPolarity(polarity: string): PureSignArchetype[] {
  return PURE_SIGNS.filter((s) => s.polarity.toLowerCase() === polarity.toLowerCase());
}

/**
 * Get the opposite sign (180 degrees across the wheel)
 */
export function getOppositeSign(sign: string): PureSignArchetype | undefined {
  const index = PURE_SIGNS.findIndex((s) => s.sign.toLowerCase() === sign.toLowerCase());
  if (index === -1) return undefined;
  const oppositeIndex = (index + 6) % 12;
  return PURE_SIGNS[oppositeIndex];
}

/**
 * Get the sign index (0-11) for ordering
 */
export function getSignIndex(sign: string): number {
  return PURE_SIGNS.findIndex((s) => s.sign.toLowerCase() === sign.toLowerCase());
}

/**
 * Get sign by index
 */
export function getSignByIndex(index: number): PureSignArchetype | undefined {
  if (index < 0 || index >= 12) return undefined;
  return PURE_SIGNS[index];
}

/**
 * Get neighboring signs (previous and next in the wheel)
 */
export function getNeighboringSigns(sign: string): { previous: PureSignArchetype; next: PureSignArchetype } | undefined {
  const index = PURE_SIGNS.findIndex((s) => s.sign.toLowerCase() === sign.toLowerCase());
  if (index === -1) return undefined;
  const prevIndex = (index - 1 + 12) % 12;
  const nextIndex = (index + 1) % 12;
  return {
    previous: PURE_SIGNS[prevIndex],
    next: PURE_SIGNS[nextIndex],
  };
}

/**
 * Get elemental triplicity (same element signs)
 */
export function getElementalTriplicity(sign: string): PureSignArchetype[] {
  const signData = getPureSign(sign);
  if (!signData) return [];
  return PURE_SIGNS.filter((s) => s.element === signData.element);
}

/**
 * Get modal quadruplicity (same modality signs)
 */
export function getModalQuadruplicity(sign: string): PureSignArchetype[] {
  const signData = getPureSign(sign);
  if (!signData) return [];
  return PURE_SIGNS.filter((s) => s.modality === signData.modality);
}

// =============================================================================
// ELEMENTAL COMPATIBILITY MATRIX
// =============================================================================

export type ElementalGrade = 'A' | 'B' | 'Neutral';

export const ELEMENTAL_COMPATIBILITY: Record<string, Record<string, ElementalGrade>> = {
  Fire: { Fire: 'Neutral', Earth: 'B', Air: 'A', Water: 'B' },
  Earth: { Fire: 'B', Earth: 'Neutral', Air: 'B', Water: 'A' },
  Air: { Fire: 'A', Earth: 'B', Air: 'Neutral', Water: 'B' },
  Water: { Fire: 'B', Earth: 'A', Air: 'B', Water: 'Neutral' },
};

/**
 * Get elemental compatibility grade between two signs
 */
export function getElementalCompatibility(sign1: string, sign2: string): ElementalGrade | undefined {
  const s1 = getPureSign(sign1);
  const s2 = getPureSign(sign2);
  if (!s1 || !s2) return undefined;
  return ELEMENTAL_COMPATIBILITY[s1.element][s2.element];
}

// =============================================================================
// EXPORTS
// =============================================================================

export default PURE_SIGNS;
