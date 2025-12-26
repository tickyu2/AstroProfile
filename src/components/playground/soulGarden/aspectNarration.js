/**
 * Aspect Soul Dialogues System
 *
 * Aspects are conversations between parts of the soul.
 * Each aspect is a dialogue - planets talking to each other as voices.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

/**
 * Core aspect voices - the dialogues between planetary energies
 * Key format: "Planet1-aspectType-Planet2" (alphabetically sorted)
 */
const aspectVoices = {
  // ═══════════════════════════════════════════
  // MOON-SATURN ASPECTS (emotional safety vs structure)
  // ═══════════════════════════════════════════
  'Moon-square-Saturn': () =>
    `A cautious voice lives inside you: one part of you longs to feel freely, another part worries about being too much. This tension is not punishment — it is the slow art of learning how to feel and still be safe.`,

  'Moon-opposition-Saturn': () =>
    `Feelings and duties pull from opposite ends — you may swing between emotional need and cold responsibility. Integration comes when you realize both voices want the same thing: lasting security.`,

  'Moon-conjunction-Saturn': () =>
    `Your emotional nature and your sense of duty are fused — you carry feelings with unusual seriousness. This is the mark of someone who can be trusted with what matters.`,

  'Moon-trine-Saturn': () =>
    `Your emotional life and your sense of duty can harmonize — you're capable of holding feelings with maturity instead of collapsing under them.`,

  'Moon-sextile-Saturn': () =>
    `Opportunities arise when you blend feeling with form — emotions that find structure become lasting contributions.`,

  // ═══════════════════════════════════════════
  // SUN-SATURN ASPECTS (identity vs limitation)
  // ═══════════════════════════════════════════
  'Saturn-square-Sun': () =>
    `Part of you doubts your right to shine; another part inspects every step for flaws. This friction is the forge where your integrity and confidence are being tempered together.`,

  'Saturn-opposition-Sun': () =>
    `Your sense of self and external demands pull in opposite directions — authority figures may have challenged your light. Mastery comes when you become your own authority.`,

  'Saturn-conjunction-Sun': () =>
    `Your identity is built on discipline and earned achievement — you may have felt old as a child. With time, you grow younger as your efforts finally bear fruit.`,

  'Saturn-trine-Sun': () =>
    `Your sense of self and your sense of responsibility can support each other — you're built to grow into a solid, dependable radiance.`,

  'Saturn-sextile-Sun': () =>
    `Opportunities for growth come through taking responsibility — your light strengthens when you commit to something larger.`,

  // ═══════════════════════════════════════════
  // SUN-URANUS ASPECTS (identity vs liberation)
  // ═══════════════════════════════════════════
  'Sun-conjunction-Uranus': () =>
    `Your identity and your need for freedom are fused — you can't be yourself without also disrupting something that has grown too rigid.`,

  'Sun-square-Uranus': () =>
    `Your sense of self clashes with your need for independence — you may rebel against authorities, including parts of yourself. The tension sparks originality.`,

  'Sun-opposition-Uranus': () =>
    `Who you are and who you want to become pull from opposite ends — others may experience you as unpredictable. Balance comes through conscious innovation.`,

  'Sun-trine-Uranus': () =>
    `Your individuality and your progressive instincts flow together — being different feels natural, not forced.`,

  // ═══════════════════════════════════════════
  // MOON-NEPTUNE ASPECTS (feeling vs transcendence)
  // ═══════════════════════════════════════════
  'Moon-trine-Neptune': () =>
    `Your feelings and your imagination flow together — intuition can feel like a soft, reliable tide within you.`,

  'Moon-conjunction-Neptune': () =>
    `Your emotional nature is deeply permeable — you absorb the feelings of others and may struggle to know which emotions are yours. This is the mark of the empath.`,

  'Moon-square-Neptune': () =>
    `Feelings and fantasy can blur together — you may idealize nurturing or escape through imagination. Clarity comes through gentle discernment.`,

  'Moon-opposition-Neptune': () =>
    `Your emotional needs and your spiritual longings pull apart — you may seek escape from feelings or drown in them. Integration asks for grounded mysticism.`,

  // ═══════════════════════════════════════════
  // VENUS-PLUTO ASPECTS (love vs power)
  // ═══════════════════════════════════════════
  'Pluto-square-Venus': () =>
    `Love wakes your underworld — relationships may stir intense desire, fear, and transformation. This is not a curse; it's the place where your heart learns its real power.`,

  'Pluto-conjunction-Venus': () =>
    `Love and power are fused in you — attraction can feel overwhelming, even obsessive. You're learning to love without possession, to desire without devouring.`,

  'Pluto-opposition-Venus': () =>
    `What you love and what controls you pull from opposite ends — power struggles in relationships teach you about your own depths.`,

  'Pluto-trine-Venus': () =>
    `Love and transformation cooperate — you can go deep in relationships without losing yourself. Intimacy renews rather than destroys.`,

  // ═══════════════════════════════════════════
  // MARS-NEPTUNE ASPECTS (will vs dissolution)
  // ═══════════════════════════════════════════
  'Mars-opposition-Neptune': () =>
    `Action and fantasy tug at each other — sometimes you feel driven, other times dissolved. Your work is to let vision guide your will without erasing it.`,

  'Mars-square-Neptune': () =>
    `Your will and your dreams can confuse each other — anger may feel forbidden, or action may dissipate into fantasy. The path is inspired action, not passive dreaming.`,

  'Mars-conjunction-Neptune': () =>
    `Your drive and your imagination are fused — you may fight for spiritual causes or struggle to act decisively. Creative action is your resolution.`,

  'Mars-trine-Neptune': () =>
    `Action and intuition flow together — you can pursue dreams with both vision and vigor.`,

  // ═══════════════════════════════════════════
  // MERCURY-NEPTUNE ASPECTS (mind vs mystery)
  // ═══════════════════════════════════════════
  'Mercury-square-Neptune': () =>
    `Your mind can blur with dreams — confusion and inspiration live close together. Learning to question gently without killing the magic is part of your path.`,

  'Mercury-conjunction-Neptune': () =>
    `Your thinking and your imagination are inseparable — you may be poetic, musical, or prone to mental fog. The gift is creative thought; the challenge is clarity.`,

  'Mercury-opposition-Neptune': () =>
    `Logic and intuition pull apart — you may distrust your own perceptions or others' words. Integration comes through trusting discernment.`,

  'Mercury-trine-Neptune': () =>
    `Your mind and your imagination cooperate — creative thinking, artistic communication, and intuitive understanding flow naturally.`,

  // ═══════════════════════════════════════════
  // JUPITER-PLUTO ASPECTS (expansion vs transformation)
  // ═══════════════════════════════════════════
  'Jupiter-trine-Pluto': () =>
    `Expansion and deep transformation cooperate in you — growth and power can arrive hand in hand when you commit to your truth.`,

  'Jupiter-conjunction-Pluto': () =>
    `Your faith and your power are fused — you may attract intense opportunities or become a force for large-scale change.`,

  'Jupiter-square-Pluto': () =>
    `Growth and power can clash — ambition may overreach, or transformation may disrupt what you've built. The tension breeds resilience.`,

  // ═══════════════════════════════════════════
  // VENUS-MARS ASPECTS (love vs desire)
  // ═══════════════════════════════════════════
  'Mars-conjunction-Venus': () =>
    `Love and desire are fused — your affections are passionate, your attractions direct. You don't separate wanting from having.`,

  'Mars-square-Venus': () =>
    `What you want and what you love don't always align — tension between assertiveness and receptivity creates dynamic relationships.`,

  'Mars-opposition-Venus': () =>
    `Desire and affection pull from opposite ends — you may attract what you pursue or pursue what attracts. Balance comes through integration.`,

  'Mars-trine-Venus': () =>
    `Love and desire cooperate — passion and affection blend naturally. Relationships feel both exciting and harmonious.`,

  // ═══════════════════════════════════════════
  // SUN-MOON ASPECTS (conscious vs unconscious)
  // ═══════════════════════════════════════════
  'Moon-conjunction-Sun': () =>
    `Your conscious self and your emotional nature are unified — you act from the heart with unusual wholeness. New Moon souls begin fresh cycles.`,

  'Moon-opposition-Sun': () =>
    `Your outer self and inner feelings illuminate each other from opposite ends — Full Moon souls see themselves clearly through relationship.`,

  'Moon-square-Sun': () =>
    `Your will and your needs create internal friction — what you want and what you feel may conflict. Quarter Moon souls learn through tension.`,

  'Moon-trine-Sun': () =>
    `Your conscious purpose and emotional nature support each other — you feel at home in your own skin.`
};

/**
 * Generate a key for aspect lookup (alphabetically sorted planets)
 * @param {string} planetA - First planet name
 * @param {string} planetB - Second planet name
 * @param {string} type - Aspect type (conjunction, square, trine, etc.)
 * @returns {string} Lookup key
 */
function keyForAspect(planetA, planetB, type) {
  const [p1, p2] = [planetA, planetB].sort();
  return `${p1}-${type}-${p2}`;
}

/**
 * Generate narration for aspects in a slice
 * @param {Object} slice - Timeline slice with aspects array
 * @param {Object} options - Configuration options
 * @param {number} options.maxAspects - Maximum aspects to narrate (default: 3)
 * @param {string[]} options.priorityTypes - Aspect types to prioritize (default: ['conjunction', 'square', 'opposition'])
 * @returns {string[]} Array of narration lines
 */
export function narrateAspects(slice, options = {}) {
  if (!slice || !slice.aspects) return [];

  const {
    maxAspects = 3,
    priorityTypes = ['conjunction', 'square', 'opposition']
  } = options;

  const lines = [];

  // Sort by priority (hard aspects first)
  const sorted = [...slice.aspects].sort((a, b) => {
    const aIdx = priorityTypes.indexOf(a.type);
    const bIdx = priorityTypes.indexOf(b.type);
    const aPriority = aIdx >= 0 ? aIdx : 99;
    const bPriority = bIdx >= 0 ? bIdx : 99;
    return aPriority - bPriority;
  });

  sorted.slice(0, maxAspects).forEach(asp => {
    const key = keyForAspect(asp.a, asp.b, asp.type);
    const fn = aspectVoices[key];
    if (!fn) return;
    lines.push(fn());
  });

  return lines;
}

/**
 * Get the dialogue for a specific aspect
 * @param {string} planetA - First planet
 * @param {string} planetB - Second planet
 * @param {string} type - Aspect type
 * @returns {string|null} Dialogue or null
 */
export function getAspectDialogue(planetA, planetB, type) {
  const key = keyForAspect(planetA, planetB, type);
  const fn = aspectVoices[key];
  return fn ? fn() : null;
}

/**
 * Check if an aspect has a defined dialogue
 * @param {string} planetA - First planet
 * @param {string} planetB - Second planet
 * @param {string} type - Aspect type
 * @returns {boolean} True if dialogue exists
 */
export function hasAspectDialogue(planetA, planetB, type) {
  const key = keyForAspect(planetA, planetB, type);
  return !!aspectVoices[key];
}

/**
 * Get all aspects in a slice that have dialogues
 * @param {Object} slice - Timeline slice
 * @returns {Object[]} Aspects with dialogues
 */
export function getAspectsWithDialogues(slice) {
  if (!slice || !slice.aspects) return [];

  return slice.aspects.filter(asp =>
    hasAspectDialogue(asp.a, asp.b, asp.type)
  );
}

/**
 * Count aspects by type in a slice
 * @param {Object} slice - Timeline slice
 * @returns {Object} Counts by aspect type
 */
export function countAspectsByType(slice) {
  if (!slice || !slice.aspects) return {};

  const counts = {};
  slice.aspects.forEach(asp => {
    counts[asp.type] = (counts[asp.type] || 0) + 1;
  });
  return counts;
}

/**
 * Generate a summary of aspect energy
 * @param {Object} slice - Timeline slice
 * @returns {string|null} Summary line
 */
export function summarizeAspects(slice) {
  const counts = countAspectsByType(slice);
  const total = slice?.aspects?.length || 0;

  if (total === 0) return null;

  const squares = counts.square || 0;
  const oppositions = counts.opposition || 0;
  const trines = counts.trine || 0;
  const conjunctions = counts.conjunction || 0;

  const tension = squares + oppositions;
  const harmony = trines;

  if (tension > harmony * 2) {
    return 'The chart speaks in tension — friction creates the energy for growth.';
  } else if (harmony > tension * 2) {
    return 'The chart flows with ease — talents and gifts emerge naturally.';
  } else if (conjunctions >= 3) {
    return 'Multiple conjunctions concentrate energy — focused power awaits direction.';
  }

  return null;
}

/**
 * Get all available aspect dialogue keys
 * @returns {string[]} Array of aspect keys
 */
export function getAvailableAspectDialogues() {
  return Object.keys(aspectVoices);
}
