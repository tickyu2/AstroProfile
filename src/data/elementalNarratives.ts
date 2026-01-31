/**
 * elementalNarratives.ts
 * ======================
 *
 * Complete narrative library for all 16 elemental pair combinations.
 * Each narrative provides psychological insight into relationship chemistry,
 * communication patterns, love languages, conflict dynamics, and growth edges.
 *
 * Grade System:
 * - A (Natural Harmony): Fire-Air, Earth-Water
 * - B (Growth Potential): Fire-Earth, Air-Water, Fire-Water, Earth-Air
 * - Neutral (Same Element): Fire-Fire, Earth-Earth, Air-Air, Water-Water
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  ElementPairNarrative,
  CompatibilityGrade,
  Element,
} from './compatibilityTypes';

// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Create a consistent pair ID by sorting elements alphabetically
 */
function makePairId(a: string, b: string): string {
  return [a, b].sort().join('-');
}

// =============================================================================
// GRADE A PAIRS - NATURAL HARMONY
// =============================================================================

const FIRE_AIR: ElementPairNarrative = {
  pairId: makePairId('fire', 'air'),
  grade: 'A',
  title: 'Fire & Air — Spark and Wind',
  emoji: '🔥💨',
  chemistry:
    'Fire ignites Air; Air lifts Fire. Together you create momentum, ideas, and possibility. This is a bright, fast, future-oriented chemistry that feels like destiny in motion.',
  communication:
    'Communication is quick, direct, and mentally stimulating. You riff off each other\'s ideas and rarely run out of things to talk about. Conversations spark new adventures.',
  loveLanguage:
    'Shared adventure, passion, humor, and intellectual play. You show love by doing things together, exploring the unknown, and dreaming out loud. Spontaneity is your oxygen.',
  conflict:
    'Conflicts can flare up quickly but also burn out fast. There\'s a risk of glossing over deeper emotional needs in favor of excitement. Neither wants to slow down to process.',
  growth:
    'Your growth edge is slowing down enough to feel, not just move. Bringing in emotional depth and grounding makes this bond sustainable. Sometimes the best adventure is stillness together.',
};

const EARTH_WATER: ElementPairNarrative = {
  pairId: makePairId('earth', 'water'),
  grade: 'A',
  title: 'Earth & Water — Garden and Rain',
  emoji: '🌍💧',
  chemistry:
    'Water nourishes Earth; Earth contains Water. This is a deeply stabilizing, emotionally safe chemistry with long-term potential. Together you grow things that last.',
  communication:
    'Communication tends to be slower, thoughtful, and emotionally attuned. You value trust, consistency, and sincerity over clever words. Silence can be comfortable.',
  loveLanguage:
    'Touch, presence, shared routines, and emotional intimacy. You show love by being there—reliably, quietly, and without fanfare. Home is wherever you both are.',
  conflict:
    'Conflicts may be subtle or unspoken. Resentment can build if feelings aren\'t expressed clearly. Passive patterns may emerge if neither initiates difficult conversations.',
  growth:
    'Your growth edge is inviting novelty and movement so the relationship doesn\'t stagnate. A little Fire or Air energy helps keep things alive. Comfort is beautiful—but so is adventure.',
};

// =============================================================================
// GRADE B PAIRS - GROWTH POTENTIAL
// =============================================================================

const FIRE_EARTH: ElementPairNarrative = {
  pairId: makePairId('fire', 'earth'),
  grade: 'B',
  title: 'Fire & Earth — Flame and Stone',
  emoji: '🔥🌍',
  chemistry:
    'Fire warms Earth; Earth shapes Fire. This is a powerful builder-pair when you respect each other\'s pace. Fire brings vision; Earth brings form. Together you can manifest dreams into reality.',
  communication:
    'Fire pushes for action; Earth asks for caution. You may clash over timing and risk, but you also balance each other. Learning to translate your rhythms is key.',
  loveLanguage:
    'Fire seeks excitement and passion; Earth seeks reliability and tangible care. When both are honored, this bond feels both solid and alive. Actions speak louder than words here.',
  conflict:
    'Impatience vs. caution is the core tension. Fire may feel slowed down or stifled; Earth may feel rushed, pressured, or destabilized. Neither is wrong—just different.',
  growth:
    'Your growth edge is learning to meet in the middle: bold moves with realistic plans, passion with stability. When Fire respects Earth\'s pace and Earth trusts Fire\'s vision, magic happens.',
};

const AIR_WATER: ElementPairNarrative = {
  pairId: makePairId('air', 'water'),
  grade: 'B',
  title: 'Air & Water — Breeze and Tide',
  emoji: '💨💧',
  chemistry:
    'Air stirs Water; Water softens Air. This is a poetic but sometimes challenging chemistry that blends mind and emotion. When it works, it\'s deeply wise and intuitive.',
  communication:
    'Air leans on logic and language; Water leans on feeling and tone. Misunderstandings can arise if you don\'t translate for each other. One speaks in thoughts, the other in moods.',
  loveLanguage:
    'Air shows love through conversation, ideas, and shared curiosity. Water shows love through emotional presence, attunement, and depth. Both are valid—both need honoring.',
  conflict:
    'One may feel the other is "too emotional" or "too detached." Tone and timing matter a lot here. Air\'s logic can feel cold to Water; Water\'s intensity can feel overwhelming to Air.',
  growth:
    'Your growth edge is learning each other\'s emotional dialect. When mind and heart collaborate, this pair becomes deeply wise. You teach each other how to think and feel simultaneously.',
};

const FIRE_WATER: ElementPairNarrative = {
  pairId: makePairId('fire', 'water'),
  grade: 'B',
  title: 'Fire & Water — Steam and Storm',
  emoji: '🔥💧',
  chemistry:
    'Fire heats Water; Water cools Fire. This is a passionate, emotionally charged chemistry full of intensity. When harnessed, you create transformative steam—the power that moves engines.',
  communication:
    'Intense, reactive, and often emotionally loaded. You can trigger each other\'s deepest feelings—for better or worse. Nothing stays on the surface with this pair.',
  loveLanguage:
    'Fire shows love through action, passion, and bold gestures. Water shows love through emotional depth, devotion, and intuitive care. Both crave intensity but express it differently.',
  conflict:
    'Emotional flareups are common. One may feel the other is "too much" or "not enough." Fire\'s directness can wound Water; Water\'s emotional currents can confuse Fire.',
  growth:
    'Your growth edge is learning to regulate intensity and create emotional safety. When balanced, this pair is transformative—capable of profound healing and passionate creativity.',
};

const EARTH_AIR: ElementPairNarrative = {
  pairId: makePairId('earth', 'air'),
  grade: 'B',
  title: 'Earth & Air — Stone and Sky',
  emoji: '🌍💨',
  chemistry:
    'Earth grounds; Air opens. This is a growth-oriented chemistry that blends practicality with possibility. You challenge each other to expand while staying real.',
  communication:
    'Air wants to explore possibilities; Earth wants to know what\'s realistic. You can challenge each other in useful ways—or frustrate each other endlessly.',
  loveLanguage:
    'Earth shows love through reliability, tangible support, and consistent presence. Air shows love through conversation, shared curiosity, and mental connection.',
  conflict:
    'Earth may see Air as flaky, unrealistic, or "all talk." Air may see Earth as rigid, boring, or resistant to change. Both perspectives have merit.',
  growth:
    'Your growth edge is respecting both stability and freedom. When you collaborate, you can build smart, flexible structures that last. Dreams need plans; plans need dreams.',
};

// =============================================================================
// NEUTRAL PAIRS - SAME ELEMENT
// =============================================================================

const FIRE_FIRE: ElementPairNarrative = {
  pairId: makePairId('fire', 'fire'),
  grade: 'Neutral',
  title: 'Fire & Fire — Twin Flames',
  emoji: '🔥🔥',
  chemistry:
    'Two Fires together create intensity, passion, and momentum. This can feel exhilarating or exhausting—sometimes both in the same day. You amplify each other\'s heat.',
  communication:
    'Direct, blunt, and fast. You rarely hold back, which can be refreshing or overwhelming. Both want to lead; both want to be heard first.',
  loveLanguage:
    'Adventure, passion, shared challenges, and bold gestures. You thrive on movement, excitement, and conquest. Boredom is the enemy.',
  conflict:
    'Fights can be explosive. If neither cools down, things can burn out quickly. Competition can turn from playful to destructive if unchecked.',
  growth:
    'Your growth edge is learning to cool the flames—bringing in patience, listening, and emotional regulation. Sometimes the bravest thing is to pause.',
};

const EARTH_EARTH: ElementPairNarrative = {
  pairId: makePairId('earth', 'earth'),
  grade: 'Neutral',
  title: 'Earth & Earth — Two Mountains',
  emoji: '🌍🌍',
  chemistry:
    'Two Earths together create stability, reliability, and long-term focus. This can feel safe and secure—or stuck and immovable. You build lasting structures together.',
  communication:
    'Practical, grounded, and often focused on responsibilities and plans. You value substance over style, actions over words.',
  loveLanguage:
    'Acts of service, consistency, shared routines, and building a life together. You show love by being dependable and present through all seasons.',
  conflict:
    'Change can be hard. You may resist necessary shifts or avoid emotional conversations in favor of "keeping things stable." Stubbornness meets stubbornness.',
  growth:
    'Your growth edge is inviting flexibility, play, and emotional expression into the relationship. Stability is beautiful—but so is dancing in the rain.',
};

const AIR_AIR: ElementPairNarrative = {
  pairId: makePairId('air', 'air'),
  grade: 'Neutral',
  title: 'Air & Air — Two Winds',
  emoji: '💨💨',
  chemistry:
    'Two Airs together create a world of ideas, conversation, and possibility. This can feel stimulating and exciting—or ungrounded and scattered. You never run out of things to discuss.',
  communication:
    'Endless talking, analyzing, and imagining. You understand each other mentally and can spend hours in conversation. Words are your playground.',
  loveLanguage:
    'Words, shared interests, intellectual companionship, and mental stimulation. You show love through attention, curiosity, and verbal affirmation.',
  conflict:
    'You may avoid emotional depth or practical follow-through. Analysis can replace action; talking can replace feeling. Neither wants to be "pinned down."',
  growth:
    'Your growth edge is grounding your ideas in action and allowing feelings to be part of the dialogue. Some things are better felt than understood.',
};

const WATER_WATER: ElementPairNarrative = {
  pairId: makePairId('water', 'water'),
  grade: 'Neutral',
  title: 'Water & Water — Two Oceans',
  emoji: '💧💧',
  chemistry:
    'Two Waters together create deep emotional resonance and intuitive understanding. This can feel soulful and profound—or overwhelming and boundaryless. You merge easily.',
  communication:
    'Nonverbal cues, moods, and emotional undercurrents are strong. You often "just know" how the other feels without words. Empathy flows naturally.',
  loveLanguage:
    'Emotional presence, vulnerability, shared inner worlds, and deep attunement. You show love through understanding, holding space, and emotional availability.',
  conflict:
    'Boundaries can blur. You may absorb each other\'s pain or get lost in emotional loops. Neither knows where one ends and the other begins.',
  growth:
    'Your growth edge is bringing in structure, clarity, and grounding so the connection doesn\'t drown you. Sometimes love means knowing where you end.',
};

// =============================================================================
// COMPLETE NARRATIVE LIBRARY
// =============================================================================

export const ELEMENT_PAIR_NARRATIVES: ElementPairNarrative[] = [
  // Grade A
  FIRE_AIR,
  EARTH_WATER,
  // Grade B
  FIRE_EARTH,
  AIR_WATER,
  FIRE_WATER,
  EARTH_AIR,
  // Neutral (same element)
  FIRE_FIRE,
  EARTH_EARTH,
  AIR_AIR,
  WATER_WATER,
];

// Create lookup map for fast access
const narrativeMap = new Map<string, ElementPairNarrative>();
ELEMENT_PAIR_NARRATIVES.forEach((n) => narrativeMap.set(n.pairId, n));

// =============================================================================
// FALLBACK NARRATIVE
// =============================================================================

const FALLBACK_NARRATIVE: ElementPairNarrative = {
  pairId: 'unknown',
  grade: 'Neutral',
  title: 'Elemental Mystery',
  emoji: '✨✨',
  chemistry:
    'This elemental pairing has its own unique rhythm, not fully captured by standard archetypes. Your chemistry is yours to discover.',
  communication:
    'Communication style depends heavily on the individuals and their specific charts. Pay attention to what works for you.',
  loveLanguage:
    'Love is expressed in personal, specific ways beyond pure elemental patterns. Notice how you each feel most loved.',
  conflict:
    'Conflicts will follow your personal histories more than elemental scripts. Be curious about patterns rather than assuming them.',
  growth:
    'Your growth edge is discovering how your energies actually interact, beyond labels. You are writing a new story together.',
};

// =============================================================================
// LOOKUP FUNCTIONS
// =============================================================================

/**
 * Get narrative for any elemental pair
 * Always returns a valid narrative (falls back to generic if not found)
 */
export function getNarrativeForElements(a: Element, b: Element): ElementPairNarrative {
  const id = makePairId(a, b);
  return narrativeMap.get(id) ?? { ...FALLBACK_NARRATIVE, pairId: id };
}

/**
 * Get all narratives for a specific grade
 */
export function getNarrativesByGrade(grade: CompatibilityGrade): ElementPairNarrative[] {
  return ELEMENT_PAIR_NARRATIVES.filter((n) => n.grade === grade);
}

/**
 * Get all narratives involving a specific element
 */
export function getNarrativesForElement(element: Element): ElementPairNarrative[] {
  return ELEMENT_PAIR_NARRATIVES.filter((n) => n.pairId.includes(element));
}

/**
 * Get the compatibility grade for an element pair without full narrative
 */
export function getGradeForElements(a: Element, b: Element): CompatibilityGrade {
  const id = makePairId(a, b);
  const narrative = narrativeMap.get(id);
  return narrative?.grade ?? 'Neutral';
}

// =============================================================================
// GRADE EXPLANATIONS
// =============================================================================

export const GRADE_EXPLANATIONS: Record<CompatibilityGrade, {
  label: string;
  description: string;
  color: string;
}> = {
  A: {
    label: 'Natural Harmony',
    description: 'These elements naturally support and energize each other. The chemistry flows easily, though growth still requires intention.',
    color: '#ffd700',
  },
  B: {
    label: 'Growth Potential',
    description: 'These elements challenge and stretch each other. With mutual respect, this friction creates diamonds.',
    color: '#87ceeb',
  },
  Neutral: {
    label: 'Mirror Energy',
    description: 'Same-element pairs amplify shared qualities—for better or worse. Self-awareness is key.',
    color: '#888888',
  },
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  ELEMENT_PAIR_NARRATIVES,
  getNarrativeForElements,
  getNarrativesByGrade,
  getNarrativesForElement,
  getGradeForElements,
  GRADE_EXPLANATIONS,
};
