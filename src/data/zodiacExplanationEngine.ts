/**
 * zodiacExplanationEngine.ts
 * ==========================
 *
 * Complete 84-day explanation engine for the Zodiac Blend Wheel.
 * Generates psychological micro-explanations for:
 *   - 12 pure sign days (archetypal expression)
 *   - 72 cusp days (6 days × 12 signs × 2 directions)
 *
 * Each day has its own psychological flavor based on the φ-curve blend:
 *   - Identity tone
 *   - Behavioral tendencies
 *   - Motivational drivers
 *   - Shadow patterns
 *   - Growth opportunities
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  DayBlend,
  ZodiacSign,
  SIGN_RANGES,
  CUSP_CURVE,
  CUSP_DAYS,
} from './zodiacBlendData';

// =============================================================================
// TYPES
// =============================================================================

export type ExplanationType = 'pure' | 'cusp';

export interface SignMeta {
  archetype: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  traits: string;
  motivation: string;
  shadow: string;
  growth: string;
  keywords: string[];
}

export interface DayExplanation {
  id: string;
  type: ExplanationType;
  primarySign: ZodiacSign;
  blendSign: ZodiacSign | null;
  cuspPhase: 'backward' | 'forward' | null;
  dayIndexInCusp: number | null;
  primaryPercent: number;
  blendPercent: number;
  title: string;
  subtitle: string;
  body: string;
  identityTone: string;
  behavior: string;
  motivation: string;
  shadow: string;
  growth: string;
  lunaInsight: string;
}

// =============================================================================
// SIGN METADATA - The 12 Archetypal Profiles
// =============================================================================

export const SIGN_META: Record<ZodiacSign, SignMeta> = {
  Aries: {
    archetype: 'The Initiator',
    element: 'Fire',
    modality: 'Cardinal',
    traits: 'boldness, directness, courage, and a drive to start things',
    motivation: 'taking action, proving yourself, and moving life forward',
    shadow: 'impulsiveness, impatience, and burning out before things are finished',
    growth: 'learning to pause, listen, and sustain your efforts',
    keywords: ['initiative', 'courage', 'independence', 'pioneering', 'assertive'],
  },
  Taurus: {
    archetype: 'The Builder',
    element: 'Earth',
    modality: 'Fixed',
    traits: 'steadiness, sensuality, patience, and grounded realism',
    motivation: 'creating stability, comfort, and tangible results',
    shadow: 'stubbornness, resistance to change, and over-attachment to comfort',
    growth: 'embracing change slowly while still honoring your need for security',
    keywords: ['stability', 'sensuality', 'patience', 'resourcefulness', 'determination'],
  },
  Gemini: {
    archetype: 'The Messenger',
    element: 'Air',
    modality: 'Mutable',
    traits: 'curiosity, mental agility, adaptability, and social connection',
    motivation: 'learning, sharing ideas, and staying mentally stimulated',
    shadow: 'scattered focus, inconsistency, and overthinking',
    growth: 'choosing a few meaningful threads to follow deeply',
    keywords: ['communication', 'curiosity', 'adaptability', 'wit', 'duality'],
  },
  Cancer: {
    archetype: 'The Nurturer',
    element: 'Water',
    modality: 'Cardinal',
    traits: 'emotional sensitivity, protectiveness, intuition, and care',
    motivation: 'creating emotional safety and belonging',
    shadow: 'moodiness, defensiveness, and clinging to the past',
    growth: 'expressing needs clearly and letting others support you too',
    keywords: ['nurturing', 'protection', 'intuition', 'emotional depth', 'home'],
  },
  Leo: {
    archetype: 'The Radiant',
    element: 'Fire',
    modality: 'Fixed',
    traits: 'warmth, creativity, confidence, and expressive presence',
    motivation: 'being seen, appreciated, and creatively engaged',
    shadow: 'ego fixation, drama, and needing constant validation',
    growth: 'shining from authenticity rather than performance',
    keywords: ['creativity', 'leadership', 'generosity', 'self-expression', 'pride'],
  },
  Virgo: {
    archetype: 'The Refiner',
    element: 'Earth',
    modality: 'Mutable',
    traits: 'discernment, service, practicality, and attention to detail',
    motivation: 'improving systems, being useful, and making things work better',
    shadow: 'perfectionism, self-criticism, and over-functioning',
    growth: 'accepting imperfection while still honoring your craft',
    keywords: ['analysis', 'service', 'precision', 'health', 'improvement'],
  },
  Libra: {
    archetype: 'The Balancer',
    element: 'Air',
    modality: 'Cardinal',
    traits: 'diplomacy, harmony, aesthetic sense, and relational awareness',
    motivation: 'creating fairness, beauty, and mutual understanding',
    shadow: 'indecision, people-pleasing, and avoiding conflict',
    growth: 'choosing your own truth even when it disrupts the peace',
    keywords: ['harmony', 'partnership', 'beauty', 'justice', 'diplomacy'],
  },
  Scorpio: {
    archetype: 'The Alchemist',
    element: 'Water',
    modality: 'Fixed',
    traits: 'intensity, depth, emotional x-ray vision, and transformative power',
    motivation: 'getting to the truth and experiencing real intimacy',
    shadow: 'control, secrecy, and all-or-nothing reactions',
    growth: 'trusting vulnerability and releasing what you cannot control',
    keywords: ['transformation', 'intensity', 'depth', 'power', 'regeneration'],
  },
  Sagittarius: {
    archetype: 'The Explorer',
    element: 'Fire',
    modality: 'Mutable',
    traits: 'optimism, adventure, big-picture thinking, and philosophical fire',
    motivation: 'seeking meaning, freedom, and new horizons',
    shadow: 'restlessness, bluntness, and over-promising',
    growth: 'grounding your vision in lived practice and responsibility',
    keywords: ['adventure', 'philosophy', 'freedom', 'optimism', 'expansion'],
  },
  Capricorn: {
    archetype: 'The Architect',
    element: 'Earth',
    modality: 'Cardinal',
    traits: 'discipline, ambition, realism, and long-term strategy',
    motivation: 'building structures that last and earning respect',
    shadow: 'rigidity, overwork, and emotional distance',
    growth: 'letting softness and support coexist with responsibility',
    keywords: ['ambition', 'discipline', 'structure', 'mastery', 'authority'],
  },
  Aquarius: {
    archetype: 'The Visionary',
    element: 'Air',
    modality: 'Fixed',
    traits: 'originality, detachment, idealism, and future-oriented thinking',
    motivation: 'improving systems, innovating, and serving the collective',
    shadow: 'aloofness, contrarianism, and over-intellectualizing feelings',
    growth: 'bringing your ideals into embodied, human connection',
    keywords: ['innovation', 'humanitarianism', 'independence', 'originality', 'progress'],
  },
  Pisces: {
    archetype: 'The Dreamer',
    element: 'Water',
    modality: 'Mutable',
    traits: 'empathy, imagination, spiritual sensitivity, and porous boundaries',
    motivation: 'merging with something larger than yourself—art, spirit, or love',
    shadow: 'escapism, confusion, and losing yourself in others',
    growth: 'holding gentle boundaries while staying open-hearted',
    keywords: ['intuition', 'compassion', 'imagination', 'spirituality', 'transcendence'],
  },
};

// =============================================================================
// CUSP DAY POSITION DESCRIPTIONS (φ-curve psychological shifts)
// =============================================================================

/**
 * Each of the 6 cusp days has its own psychological meaning based on the φ-curve.
 * These describe the BACKWARD cusp experience (emerging from previous sign).
 */
const BACKWARD_CUSP_DAY_DESCRIPTIONS: Record<number, { short: string; full: string }> = {
  1: {
    short: 'Whisper of the new',
    full: 'The previous sign is still dominant; the new sign is just whispering into your system. You feel the past strongly while sensing something unfamiliar stirring.',
  },
  2: {
    short: 'Awakening identity',
    full: 'The new sign is awakening, but the previous sign still shapes your emotional tone. Identity feels fluid—you are becoming, not yet arrived.',
  },
  3: {
    short: 'Crossing threshold',
    full: 'The new sign becomes clearly present; the previous sign is now a strong flavor, not the driver. You stand at the threshold between two ways of being.',
  },
  4: {
    short: 'New sign leads',
    full: 'The new sign is leading; the previous sign adds nuance and depth. Your identity has shifted, though traces of the past inform your wisdom.',
  },
  5: {
    short: 'Faint echo',
    full: 'The new sign is almost pure; the previous sign is a faint echo. Only in certain moments does the past flavor surface.',
  },
  6: {
    short: 'Ghost trace',
    full: 'The new sign is nearly fully embodied; the previous sign is just a ghost trace. You carry ancestral memory of where you came from.',
  },
};

/**
 * Forward cusp descriptions (transitioning toward next sign)
 */
const FORWARD_CUSP_DAY_DESCRIPTIONS: Record<number, { short: string; full: string }> = {
  1: {
    short: 'First pull forward',
    full: 'You are firmly in your sign, but the next sign begins its subtle pull. Something ahead calls to you—change is on the horizon.',
  },
  2: {
    short: 'Sensing the future',
    full: 'The next sign makes itself felt more clearly. You sense the coming transition in your thoughts, desires, and restlessness.',
  },
  3: {
    short: 'Dual citizenship',
    full: 'You hold dual citizenship between your sign and the next. Both feel true; neither dominates completely.',
  },
  4: {
    short: 'Loosening grip',
    full: 'Your primary sign begins loosening its grip. The next sign is no longer future—it is becoming present.',
  },
  5: {
    short: 'Threshold crossing',
    full: 'You are crossing the threshold. Your primary sign is becoming memory; the next sign is becoming identity.',
  },
  6: {
    short: 'Almost arrived',
    full: 'You are almost fully in the next sign. Only a whisper of your origin sign remains—a foundation beneath new ground.',
  },
};

// =============================================================================
// ELEMENTAL MEANINGS - Psychological Interpretations
// =============================================================================

/**
 * Psychological meaning of each element
 * These are used in the explanation panel and tooltip
 */
export const ELEMENT_MEANING: Record<string, string> = {
  fire: 'Instinct, courage, action, urgency.',
  earth: 'Stability, embodiment, patience, realism.',
  air: 'Ideas, communication, curiosity, movement.',
  water: 'Emotion, intuition, depth, sensitivity.',
};

/**
 * Extended elemental interpretations for deeper psychological insight
 */
export const ELEMENT_INTERPRETATION: Record<string, {
  short: string;
  psychological: string;
  active: string;
  shadow: string;
}> = {
  fire: {
    short: 'Instinct, courage, action, urgency.',
    psychological: 'Fire brings spontaneous energy, enthusiasm, and the courage to act without overthinking.',
    active: 'Your Fire is rising—courage, initiative, and instinct are active.',
    shadow: 'Watch for impatience, burnout, or acting before feeling.',
  },
  earth: {
    short: 'Stability, embodiment, patience, realism.',
    psychological: 'Earth brings grounded presence, practical wisdom, and the patience to build lasting things.',
    active: 'Your Earth is strong—stability, patience, and embodied presence guide you.',
    shadow: 'Watch for rigidity, resistance to change, or mistaking comfort for truth.',
  },
  air: {
    short: 'Ideas, communication, curiosity, movement.',
    psychological: 'Air brings mental clarity, social connection, and the ability to see multiple perspectives.',
    active: 'Your Air is moving—ideas, communication, and curiosity are flowing.',
    shadow: 'Watch for scattered focus, overthinking, or staying in your head.',
  },
  water: {
    short: 'Emotion, intuition, depth, sensitivity.',
    psychological: 'Water brings emotional intelligence, intuitive knowing, and the capacity for deep connection.',
    active: 'Your Water is deep—emotion, intuition, and sensitivity are heightened.',
    shadow: 'Watch for overwhelm, boundary confusion, or drowning in feelings.',
  },
};

// =============================================================================
// TUNED MYTHIC BOUNDARIES - The 12 Elemental Transitions
// =============================================================================

/**
 * Each sign boundary has its own distinct elemental alchemy and psychological transition.
 * These tuned descriptions replace generic template text with emotionally accurate,
 * mythically alive language specific to each pair.
 */
export interface BoundaryMeta {
  from: ZodiacSign;
  to: ZodiacSign;
  elementalShift: string;
  title: string;
  mythic: string;
  teaching: string;
}

export const MYTHIC_BOUNDARIES: BoundaryMeta[] = [
  {
    from: 'Aries',
    to: 'Taurus',
    elementalShift: 'Fire cooling into Earth',
    title: 'Impulse becoming Intention',
    mythic: 'This cusp is the moment where raw Aries fire begins to settle into Taurus earth. The warrior puts down the sword and picks up the hammer. The spark becomes a hearth. Psychologically, this is the shift from acting first to building something that lasts. Aries urgency softens into Taurus patience. The shadow of impulsiveness melts into grounded purpose.',
    teaching: 'Not every fire must burn—some fires are meant to warm.',
  },
  {
    from: 'Taurus',
    to: 'Gemini',
    elementalShift: 'Earth dissolving into Air',
    title: 'Stability becoming Curiosity',
    mythic: 'This cusp is the moment where Taurus solidity begins to lift into Gemini\'s breeze. The builder looks up from the soil and notices the world moving. Psychologically, this is the shift from comfort to connection, from sensory presence to mental play. Taurus\'s steadiness becomes Gemini\'s adaptability. The shadow of stubbornness loosens into curiosity.',
    teaching: 'What you\'ve built is strong enough—now explore.',
  },
  {
    from: 'Gemini',
    to: 'Cancer',
    elementalShift: 'Air softening into Water',
    title: 'Thought becoming Feeling',
    mythic: 'This cusp is the moment where Gemini\'s quicksilver mind melts into Cancer\'s tides. Words become moods. Ideas become memories. Psychologically, this is the shift from analysis to empathy, from talking to listening inward. Gemini\'s scattered curiosity finds emotional depth. The shadow of overthinking dissolves into intuition.',
    teaching: 'Not everything must be understood—some things must be felt.',
  },
  {
    from: 'Cancer',
    to: 'Leo',
    elementalShift: 'Water rising into Fire',
    title: 'Moon becoming Sun',
    mythic: 'This cusp is the moment where Cancer\'s inner tides rise into Leo\'s radiant fire. The private heart steps onto the stage. The whisper becomes a roar. Psychologically, this is the shift from protecting to expressing, from holding to shining. Cancer\'s sensitivity becomes Leo\'s confidence. The shadow of withdrawal transforms into creative courage.',
    teaching: 'Your feelings deserve a voice.',
  },
  {
    from: 'Leo',
    to: 'Virgo',
    elementalShift: 'Fire refining into Earth',
    title: 'Expression becoming Craft',
    mythic: 'This cusp is the moment where Leo\'s creative blaze narrows into Virgo\'s precise beam. The performance becomes a practice. The inspiration becomes a method. Psychologically, this is the shift from being seen to being useful, from radiance to refinement. Leo\'s boldness becomes Virgo\'s discernment. The shadow of ego softens into service.',
    teaching: 'Your light becomes stronger when you shape it.',
  },
  {
    from: 'Virgo',
    to: 'Libra',
    elementalShift: 'Earth balancing into Air',
    title: 'Discernment becoming Harmony',
    mythic: 'This cusp is the moment where Virgo\'s careful analysis lifts into Libra\'s graceful equilibrium. The critic becomes the diplomat. The detail becomes the design. Psychologically, this is the shift from fixing to relating, from precision to beauty. Virgo\'s refinement becomes Libra\'s elegance. The shadow of perfectionism dissolves into balance.',
    teaching: 'Not everything must be corrected—some things must be harmonized.',
  },
  {
    from: 'Libra',
    to: 'Scorpio',
    elementalShift: 'Air deepening into Water',
    title: 'Harmony becoming Truth',
    mythic: 'This cusp is the moment where Libra\'s surface harmony sinks into Scorpio\'s emotional underworld. The polite smile becomes an x-ray gaze. The conversation becomes a confession. Psychologically, this is the shift from connection to intimacy, from agreement to truth. Libra\'s diplomacy becomes Scorpio\'s depth. The shadow of avoidance transforms into courage.',
    teaching: 'Peace without truth is not peace.',
  },
  {
    from: 'Scorpio',
    to: 'Sagittarius',
    elementalShift: 'Water igniting into Fire',
    title: 'Depth becoming Meaning',
    mythic: 'This cusp is the moment where Scorpio\'s intensity bursts upward into Sagittarius\'s flame. The secret becomes a story. The wound becomes wisdom. Psychologically, this is the shift from transformation to exploration, from emotional gravity to philosophical freedom. Scorpio\'s depth becomes Sagittarius\'s perspective. The shadow of control melts into humor and expansion.',
    teaching: 'What you\'ve survived becomes the map for where you\'re going.',
  },
  {
    from: 'Sagittarius',
    to: 'Capricorn',
    elementalShift: 'Fire crystallizing into Earth',
    title: 'Vision becoming Structure',
    mythic: 'This cusp is the moment where Sagittarius\'s wild horizon narrows into Capricorn\'s mountain path. The dream becomes a plan. The enthusiasm becomes discipline. Psychologically, this is the shift from freedom to responsibility, from possibility to execution. Sagittarius\'s optimism becomes Capricorn\'s strategy. The shadow of excess becomes mastery.',
    teaching: 'A vision becomes real when you commit to the climb.',
  },
  {
    from: 'Capricorn',
    to: 'Aquarius',
    elementalShift: 'Earth breaking into Air',
    title: 'Structure becoming Innovation',
    mythic: 'This cusp is the moment where Capricorn\'s stone tower cracks open into Aquarius\'s lightning. The rule becomes the exception. The tradition becomes the experiment. Psychologically, this is the shift from duty to disruption, from authority to originality. Capricorn\'s discipline becomes Aquarius\'s invention. The shadow of rigidity transforms into liberation.',
    teaching: 'What you\'ve built must evolve.',
  },
  {
    from: 'Aquarius',
    to: 'Pisces',
    elementalShift: 'Air dissolving into Water',
    title: 'Idea becoming Spirit',
    mythic: 'This cusp is the moment where Aquarius\'s crystalline intellect melts into Pisces\'s oceanic intuition. The theory becomes a dream. The concept becomes compassion. Psychologically, this is the shift from thinking to feeling everything, from systems to soul. Aquarius\'s clarity becomes Pisces\'s empathy. The shadow of detachment softens into connection.',
    teaching: 'The mind opens the door, but the heart walks through.',
  },
  {
    from: 'Pisces',
    to: 'Aries',
    elementalShift: 'Water igniting into Fire',
    title: 'Dream becoming Action',
    mythic: 'This cusp is the moment where Pisces\'s infinite ocean sparks into Aries\'s first flame. The vision becomes a beginning. The longing becomes a leap. Psychologically, this is the shift from imagining to initiating, from surrender to assertion. Pisces\'s sensitivity becomes Aries\'s courage. The shadow of drifting transforms into direction.',
    teaching: 'Every dream deserves its first step.',
  },
];

/**
 * Get the mythic boundary for a sign transition
 */
export function getMythicBoundary(from: ZodiacSign, to: ZodiacSign): BoundaryMeta | null {
  return MYTHIC_BOUNDARIES.find(b => b.from === from && b.to === to) || null;
}

// =============================================================================
// SIGN RELATIONSHIP HELPERS
// =============================================================================

/**
 * Get the previous sign in the zodiac wheel
 */
function getPreviousSign(sign: ZodiacSign): ZodiacSign {
  const signs = Object.keys(SIGN_META) as ZodiacSign[];
  const index = signs.indexOf(sign);
  return signs[(index - 1 + 12) % 12];
}

/**
 * Get the next sign in the zodiac wheel
 */
function getNextSign(sign: ZodiacSign): ZodiacSign {
  const signs = Object.keys(SIGN_META) as ZodiacSign[];
  const index = signs.indexOf(sign);
  return signs[(index + 1) % 12];
}

/**
 * Generate Luna's insight for a sign combination
 */
function generateLunaInsight(primary: ZodiacSign, blend: ZodiacSign | null, cuspPhase: 'backward' | 'forward' | null): string {
  const primaryMeta = SIGN_META[primary];

  if (!blend || !cuspPhase) {
    // Pure sign
    const insights: Record<ZodiacSign, string> = {
      Aries: 'Your fire is pure today. Use it to begin what matters—but remember, the spark needs tending.',
      Taurus: 'Ground yourself in what is real and beautiful. Your steadiness is your superpower.',
      Gemini: 'Your mind dances between possibilities. Choose one thread to pull—see where it leads.',
      Cancer: 'Your heart knows things your mind cannot explain. Trust your emotional wisdom.',
      Leo: 'Shine not to be seen, but because shining is who you are. Authenticity outperforms performance.',
      Virgo: 'Excellence is a practice, not a destination. Serve with love, not obligation.',
      Libra: 'Harmony begins within. Balance your own scales before adjusting others.',
      Scorpio: 'Depth is your gift. Go beneath the surface—that is where transformation lives.',
      Sagittarius: 'Your arrow points toward meaning. Follow your curiosity; it knows the way.',
      Capricorn: 'Build with patience. The structures you create now will outlast the seasons.',
      Aquarius: 'Your vision serves the future. Ground your ideals in present connection.',
      Pisces: 'You feel everything. This is both wound and gift. Protect your sensitivity; it is medicine.',
    };
    return insights[primary];
  }

  const blendMeta = SIGN_META[blend];

  if (cuspPhase === 'backward') {
    return `You carry ${blend}'s wisdom as you step into ${primary}'s territory. Let the ${blendMeta.element.toLowerCase()} of ${blend} inform the ${primaryMeta.element.toLowerCase()} of ${primary}. This is not confusion—it is integration.`;
  } else {
    return `You are being called forward into ${blend}'s realm. Do not rush—${primary} has one more gift to give you. The transition itself is teacher.`;
  }
}

// =============================================================================
// EXPLANATION BUILDERS
// =============================================================================

/**
 * Build explanation for a pure sign day
 */
function buildPureExplanation(sign: ZodiacSign): DayExplanation {
  const meta = SIGN_META[sign];

  const title = `Pure ${sign}`;
  const subtitle = meta.archetype;

  const body = `You are in the pure field of ${sign}. This day expresses the full archetype: ${meta.archetype}. ` +
    `The ${meta.element} element burns (or flows, or grounds, or moves) without dilution. ` +
    `This is ${sign} at its most essential—both its gifts and its shadows are amplified.`;

  const identityTone = `Pure ${meta.archetype.toLowerCase()} energy. You embody ${meta.traits}. ` +
    `Your ${meta.modality.toLowerCase()} ${meta.element.toLowerCase()} nature expresses itself clearly.`;

  const behavior = `Expect ${meta.traits}. Your actions align with ${sign}'s fundamental drive: ${meta.motivation}.`;

  const motivation = `Your motivations lean toward ${meta.motivation}. ` +
    `This is the day to honor what ${sign} truly wants.`;

  const shadow = `Your shadow tendencies may involve ${meta.shadow}. ` +
    `Pure sign days intensify both light and dark—stay conscious.`;

  const growth = `This is a day for ${meta.growth}. ` +
    `The pure archetype offers its deepest lesson when you meet it directly.`;

  return {
    id: `pure-${sign}`,
    type: 'pure',
    primarySign: sign,
    blendSign: null,
    cuspPhase: null,
    dayIndexInCusp: null,
    primaryPercent: 1,
    blendPercent: 0,
    title,
    subtitle,
    body,
    identityTone,
    behavior,
    motivation,
    shadow,
    growth,
    lunaInsight: generateLunaInsight(sign, null, null),
  };
}

/**
 * Build explanation for a cusp day - NOW WITH TUNED MYTHIC BOUNDARIES
 */
function buildCuspExplanation(
  primary: ZodiacSign,
  blend: ZodiacSign,
  cuspPhase: 'backward' | 'forward',
  dayIndex: number
): DayExplanation {
  const primaryMeta = SIGN_META[primary];
  const blendMeta = SIGN_META[blend];

  // Get the tuned mythic boundary for this transition
  // For backward cusp: moving from blend → primary (e.g., Aries→Taurus means emerging into Taurus from Aries)
  // For forward cusp: moving from primary → blend (e.g., transitioning from Aries toward Taurus)
  const boundary = cuspPhase === 'backward'
    ? getMythicBoundary(blend, primary)  // emerging FROM blend INTO primary
    : getMythicBoundary(primary, blend); // transitioning FROM primary INTO blend

  // Calculate percentages from φ-curve (symmetric at boundary)
  // CUSP_CURVE[i] = primary sign % at cusp position i+1
  // For backward cusp: day 1 = 78% blend, day 6 = 4% blend
  // For forward cusp: day 1 (far) = 4% blend, day 6 (boundary) = 78% blend
  let primaryPercent: number;
  let blendPercent: number;

  if (cuspPhase === 'backward') {
    // Emerging FROM blend INTO primary
    // Day 1: primary 22%, blend 78%
    // Day 6: primary 96%, blend 4%
    primaryPercent = CUSP_CURVE[dayIndex - 1];
    blendPercent = 1 - primaryPercent;
  } else {
    // Transitioning FROM primary INTO blend
    // Day 1 (far from boundary): primary 96%, blend 4%
    // Day 6 (at boundary): primary 22%, blend 78%
    blendPercent = 1 - CUSP_CURVE[CUSP_DAYS - dayIndex];
    primaryPercent = 1 - blendPercent;
  }

  const dayDesc = cuspPhase === 'backward'
    ? BACKWARD_CUSP_DAY_DESCRIPTIONS[dayIndex]
    : FORWARD_CUSP_DAY_DESCRIPTIONS[dayIndex];

  // Use mythic boundary title if available, otherwise fallback to generic
  const title = boundary
    ? `${boundary.elementalShift} — ${boundary.title}`
    : (cuspPhase === 'backward'
      ? `${primary} emerging from ${blend}`
      : `${primary} transitioning toward ${blend}`);

  const subtitle = `Day ${dayIndex} of 6 — ${dayDesc.short}`;

  // Build the body with mythic content if available
  const mythicText = boundary ? boundary.mythic : '';
  const teachingText = boundary ? `This boundary teaches: "${boundary.teaching}"` : '';

  const phaseContext = cuspPhase === 'backward'
    ? `${primary} is just beginning to emerge, while ${blend} still drives much of your instinctive patterning.`
    : `${primary} is starting to dissolve, while ${blend} is already shaping where you are headed.`;

  const body = mythicText
    ? `${mythicText} ${dayDesc.full} ${teachingText}`
    : `This is a cusp-blend day between ${primary} and ${blend}. ` +
      `Your core expression is ${primary} at ${Math.round(primaryPercent * 100)}%, ` +
      `with ${blend} active at ${Math.round(blendPercent * 100)}%. ` +
      phaseContext + ' ' + dayDesc.full;

  const identityTone = cuspPhase === 'backward'
    ? `You feel like a ${primaryMeta.archetype.toLowerCase()} with a strong ${blendMeta.archetype.toLowerCase()} undertone. ` +
      `The ${blendMeta.element} of ${blend} still colors your ${primaryMeta.element} nature.`
    : `You feel like a ${primaryMeta.archetype.toLowerCase()} learning the lessons of ${blendMeta.archetype.toLowerCase()}. ` +
      `Something in you is already reaching toward ${blend}'s ${blendMeta.element.toLowerCase()} realm.`;

  const behavior = cuspPhase === 'backward'
    ? `You may act in ${blend} ways (${blendMeta.traits}) while slowly adopting ${primary} patterns (${primaryMeta.traits}).`
    : `You may still show ${primary} habits (${primaryMeta.traits}) but increasingly behave in ${blend} ways (${blendMeta.traits}).`;

  const motivation = `Your motivations blend ${primary}'s drive (${primaryMeta.motivation}) ` +
    `with ${blend}'s pull (${blendMeta.motivation}). Neither fully dominates—both speak.`;

  const shadow = `Shadow patterns can mix ${primary} shadows (${primaryMeta.shadow}) ` +
    `with ${blend} shadows (${blendMeta.shadow}). Watch for the compound effect.`;

  const growth = boundary
    ? `${boundary.teaching} Growth comes from consciously honoring both energies.`
    : `Growth comes from consciously honoring both energies: ` +
      `letting ${blend} teach ${primary} something essential, rather than fighting the blend.`;

  return {
    id: `cusp-${cuspPhase}-${primary}-${dayIndex}`,
    type: 'cusp',
    primarySign: primary,
    blendSign: blend,
    cuspPhase,
    dayIndexInCusp: dayIndex,
    primaryPercent,
    blendPercent,
    title,
    subtitle,
    body,
    identityTone,
    behavior,
    motivation,
    shadow,
    growth,
    lunaInsight: generateLunaInsight(primary, blend, cuspPhase),
  };
}

// =============================================================================
// GENERATE ALL 84 EXPLANATIONS
// =============================================================================

/**
 * Generate the complete set of 84 day explanations
 */
function generateAllExplanations(): DayExplanation[] {
  const result: DayExplanation[] = [];
  const signs = Object.keys(SIGN_META) as ZodiacSign[];

  // 12 pure sign explanations
  signs.forEach((sign) => {
    result.push(buildPureExplanation(sign));
  });

  // 72 cusp explanations (6 backward + 6 forward per sign = 12 × 6 × 2 = 144... wait)
  // Actually: 6 backward days per sign × 12 signs = 72 backward
  // But forward cusps of sign X = backward cusps of sign X+1
  // So we only need 72 total cusp explanations (6 per sign, backward only)
  // Forward lookups will map to the appropriate backward explanation

  // Generate 6 backward cusp days for each sign
  signs.forEach((sign) => {
    const prevSign = getPreviousSign(sign);
    for (let day = 1; day <= 6; day++) {
      result.push(buildCuspExplanation(sign, prevSign, 'backward', day));
    }
  });

  // Generate 6 forward cusp days for each sign
  signs.forEach((sign) => {
    const nextSign = getNextSign(sign);
    for (let day = 1; day <= 6; day++) {
      result.push(buildCuspExplanation(sign, nextSign, 'forward', day));
    }
  });

  return result;
}

/**
 * All 84+ explanations (12 pure + 72 backward + 72 forward = 156 total for direct lookup)
 * Note: We generate all combinations for direct O(1) lookup
 */
export const ALL_EXPLANATIONS: DayExplanation[] = generateAllExplanations();

// Create lookup maps for fast access
const explanationById = new Map<string, DayExplanation>();
const pureExplanations = new Map<ZodiacSign, DayExplanation>();

ALL_EXPLANATIONS.forEach((exp) => {
  explanationById.set(exp.id, exp);
  if (exp.type === 'pure') {
    pureExplanations.set(exp.primarySign, exp);
  }
});

// =============================================================================
// LOOKUP FUNCTIONS
// =============================================================================

/**
 * Get explanation for a DayBlend from the wheel
 */
export function getExplanationForDayBlend(day: DayBlend): DayExplanation {
  // Validate required properties
  if (!day || !day.primarySign) {
    console.warn('getExplanationForDayBlend: Invalid day object', day);
    return buildPureExplanation('Aries'); // Fallback
  }

  // Pure sign (not a cusp)
  if (day.cuspType === 'none' || !day.blendSign) {
    const pure = pureExplanations.get(day.primarySign);
    if (pure) return pure;
    // Fallback: generate on the fly
    return buildPureExplanation(day.primarySign);
  }

  // Validate cusp day is in valid range (1-6)
  const cuspDay = day.cuspDay;
  if (!cuspDay || cuspDay < 1 || cuspDay > 6) {
    console.warn('getExplanationForDayBlend: Invalid cuspDay', cuspDay, 'for day', day);
    // Treat as pure sign if cuspDay is invalid
    const pure = pureExplanations.get(day.primarySign);
    if (pure) return pure;
    return buildPureExplanation(day.primarySign);
  }

  // Cusp day
  const id = `cusp-${day.cuspType}-${day.primarySign}-${cuspDay}`;
  const cached = explanationById.get(id);
  if (cached) return cached;

  // Fallback: generate on the fly
  return buildCuspExplanation(
    day.primarySign,
    day.blendSign,
    day.cuspType as 'backward' | 'forward',
    cuspDay
  );
}

/**
 * Get pure sign explanation
 */
export function getPureSignExplanation(sign: ZodiacSign): DayExplanation {
  return pureExplanations.get(sign) || buildPureExplanation(sign);
}

/**
 * Get cusp explanation by parameters
 */
export function getCuspExplanation(
  primary: ZodiacSign,
  blend: ZodiacSign,
  phase: 'backward' | 'forward',
  dayIndex: number
): DayExplanation {
  const id = `cusp-${phase}-${primary}-${dayIndex}`;
  return explanationById.get(id) || buildCuspExplanation(primary, blend, phase, dayIndex);
}

/**
 * Get all explanations for a specific sign (pure + all cusp variations)
 */
export function getExplanationsForSign(sign: ZodiacSign): DayExplanation[] {
  return ALL_EXPLANATIONS.filter(
    (exp) => exp.primarySign === sign || exp.blendSign === sign
  );
}

/**
 * Get explanation statistics
 */
export function getExplanationStats(): {
  total: number;
  pure: number;
  backward: number;
  forward: number;
} {
  let pure = 0;
  let backward = 0;
  let forward = 0;

  ALL_EXPLANATIONS.forEach((exp) => {
    if (exp.type === 'pure') pure++;
    else if (exp.cuspPhase === 'backward') backward++;
    else if (exp.cuspPhase === 'forward') forward++;
  });

  return { total: ALL_EXPLANATIONS.length, pure, backward, forward };
}

// =============================================================================
// EXPORT AS JSON (for static generation)
// =============================================================================

/**
 * Export all explanations as JSON string
 */
export function exportExplanationsAsJSON(): string {
  return JSON.stringify(ALL_EXPLANATIONS, null, 2);
}

/**
 * Export pure sign explanations only
 */
export function exportPureExplanationsAsJSON(): string {
  const pure = ALL_EXPLANATIONS.filter((e) => e.type === 'pure');
  return JSON.stringify(pure, null, 2);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  SIGN_META,
  ALL_EXPLANATIONS,
  getExplanationForDayBlend,
  getPureSignExplanation,
  getCuspExplanation,
  getExplanationsForSign,
  getExplanationStats,
  exportExplanationsAsJSON,
  exportPureExplanationsAsJSON,
  getPreviousSign,
  getNextSign,
};
