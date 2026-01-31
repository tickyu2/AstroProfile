/**
 * Useful God Overlay (用神 Yong Shen)
 *
 * The Useful God is the stabilizing element of a BaZi chart -
 * the element that balances the chart and brings harmony.
 *
 * This overlay determines the Useful God and its influence
 * on relationship timing and compatibility.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export type BaZiElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export interface BaZiChartForUsefulGod {
  dayMaster: string;
  dayMasterElement: BaZiElement;
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
  elementCounts: Record<BaZiElement, number>;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'earth_season';
  monthBranch: string;
}

export interface UsefulGodOverlayResult {
  usefulGod: BaZiElement;
  annoyingGod: BaZiElement;         // 忌神 Ji Shen
  favorability: number;             // 0..1 how well supported
  usefulGodDelta: number;           // contribution to decision
  balanceType: ChartBalance;
  supportElements: BaZiElement[];
  avoidElements: BaZiElement[];
  narrative: string;
  strengths: string[];
  challenges: string[];
  relationshipAdvice: string;
}

export type ChartBalance =
  | 'Well Balanced'
  | 'Day Master Strong'
  | 'Day Master Weak'
  | 'Following Pattern'
  | 'Special Pattern';

// ========================================
// ELEMENT RELATIONSHIPS
// ========================================

const ELEMENT_PRODUCES: Record<BaZiElement, BaZiElement> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

const ELEMENT_CONTROLS: Record<BaZiElement, BaZiElement> = {
  Wood: 'Earth',
  Earth: 'Water',
  Water: 'Fire',
  Fire: 'Metal',
  Metal: 'Wood'
};

const ELEMENT_SAME: Record<BaZiElement, BaZiElement> = {
  Wood: 'Wood',
  Fire: 'Fire',
  Earth: 'Earth',
  Metal: 'Metal',
  Water: 'Water'
};

const ELEMENT_PRODUCES_REVERSE: Record<BaZiElement, BaZiElement> = {
  Fire: 'Wood',
  Earth: 'Fire',
  Metal: 'Earth',
  Water: 'Metal',
  Wood: 'Water'
};

const ELEMENT_CONTROLS_REVERSE: Record<BaZiElement, BaZiElement> = {
  Earth: 'Wood',
  Water: 'Earth',
  Fire: 'Water',
  Metal: 'Fire',
  Wood: 'Metal'
};

// Seasonal strength
const SEASON_STRONG_ELEMENTS: Record<string, BaZiElement[]> = {
  spring: ['Wood'],
  summer: ['Fire'],
  autumn: ['Metal'],
  winter: ['Water'],
  earth_season: ['Earth']
};

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Determine the Useful God (用神) for a BaZi chart
 */
export function computeUsefulGodOverlay(chart: BaZiChartForUsefulGod): UsefulGodOverlayResult {
  const dm = chart.dayMasterElement;
  const strength = chart.dayMasterStrength;

  // Determine Useful God based on chart balance
  let usefulGod: BaZiElement;
  let annoyingGod: BaZiElement;
  let balanceType: ChartBalance;
  let supportElements: BaZiElement[] = [];
  let avoidElements: BaZiElement[] = [];

  if (strength === 'strong') {
    // Strong Day Master needs to be weakened
    // Useful God: elements that weaken DM
    // - Element DM produces (drains)
    // - Element that controls DM
    // - Element controlled by DM (but weaker option)

    balanceType = 'Day Master Strong';
    usefulGod = ELEMENT_PRODUCES[dm]; // Draining is gentler
    annoyingGod = ELEMENT_PRODUCES_REVERSE[dm]; // Resource strengthens

    supportElements = [
      ELEMENT_PRODUCES[dm],           // Drain
      ELEMENT_CONTROLS_REVERSE[dm],   // Control
      ELEMENT_CONTROLS[dm]            // Output (wealth)
    ];

    avoidElements = [
      dm,                              // Same element strengthens
      ELEMENT_PRODUCES_REVERSE[dm]     // Resource strengthens
    ];

  } else if (strength === 'weak') {
    // Weak Day Master needs support
    // Useful God: elements that strengthen DM
    // - Same element
    // - Element that produces DM (resource)

    balanceType = 'Day Master Weak';
    usefulGod = ELEMENT_PRODUCES_REVERSE[dm]; // Resource best
    annoyingGod = ELEMENT_CONTROLS_REVERSE[dm]; // Controller weakens

    supportElements = [
      dm,                              // Same element
      ELEMENT_PRODUCES_REVERSE[dm]     // Resource
    ];

    avoidElements = [
      ELEMENT_CONTROLS_REVERSE[dm],    // Controller
      ELEMENT_PRODUCES[dm],            // Drain
      ELEMENT_CONTROLS[dm]             // Output (wealth) - drains
    ];

  } else {
    // Balanced chart - maintain balance
    balanceType = 'Well Balanced';

    // Find what's missing or low
    const minElement = findLowestElement(chart.elementCounts);
    usefulGod = minElement;
    annoyingGod = findHighestElement(chart.elementCounts);

    supportElements = [minElement, dm];
    avoidElements = [annoyingGod];
  }

  // Calculate favorability based on current element counts
  const usefulGodCount = chart.elementCounts[usefulGod] || 0;
  const totalElements = Object.values(chart.elementCounts).reduce((a, b) => a + b, 0);
  const favorability = totalElements > 0
    ? Math.min(1, usefulGodCount / (totalElements / 5) * 0.5 + 0.25)
    : 0.5;

  // Calculate delta
  const usefulGodDelta = favorability * 0.07;

  // Build narrative
  const narrative = buildUsefulGodNarrative(usefulGod, annoyingGod, balanceType, favorability);

  // Get traits
  const { strengths, challenges, relationshipAdvice } = getUsefulGodTraits(
    usefulGod, annoyingGod, balanceType, strength
  );

  return {
    usefulGod,
    annoyingGod,
    favorability,
    usefulGodDelta,
    balanceType,
    supportElements,
    avoidElements,
    narrative,
    strengths,
    challenges,
    relationshipAdvice
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function findLowestElement(counts: Record<BaZiElement, number>): BaZiElement {
  let min: BaZiElement = 'Wood';
  let minCount = Infinity;

  for (const [element, count] of Object.entries(counts) as [BaZiElement, number][]) {
    if (count < minCount) {
      minCount = count;
      min = element;
    }
  }

  return min;
}

function findHighestElement(counts: Record<BaZiElement, number>): BaZiElement {
  let max: BaZiElement = 'Wood';
  let maxCount = -Infinity;

  for (const [element, count] of Object.entries(counts) as [BaZiElement, number][]) {
    if (count > maxCount) {
      maxCount = count;
      max = element;
    }
  }

  return max;
}

// ========================================
// NARRATIVE BUILDER
// ========================================

function buildUsefulGodNarrative(
  usefulGod: BaZiElement,
  annoyingGod: BaZiElement,
  balanceType: ChartBalance,
  favorability: number
): string {
  const elementDescriptions: Record<BaZiElement, string> = {
    Wood: 'growth, flexibility, and new beginnings',
    Fire: 'passion, visibility, and transformation',
    Earth: 'stability, nurturing, and grounding',
    Metal: 'clarity, refinement, and decisiveness',
    Water: 'wisdom, flow, and adaptability'
  };

  const balanceNarratives: Record<ChartBalance, string> = {
    'Day Master Strong': `Your strong Day Master benefits from release and expression. ${usefulGod} becomes your Useful God, channeling excess energy into productive outlets.`,
    'Day Master Weak': `Your Day Master needs support and nourishment. ${usefulGod} becomes your Useful God, providing the resource and strength you need to flourish.`,
    'Well Balanced': `Your chart maintains natural equilibrium. ${usefulGod} fine-tunes this balance, ensuring continued harmony.`,
    'Following Pattern': `Your chart follows a special pattern. ${usefulGod} aligns with this natural flow, enhancing rather than opposing it.`,
    'Special Pattern': `Your chart carries a special configuration. ${usefulGod} supports this unique structure.`
  };

  let narrative = balanceNarratives[balanceType];
  narrative += ` ${usefulGod} brings ${elementDescriptions[usefulGod]} to your relational field.`;

  if (favorability > 0.6) {
    narrative += ' Your Useful God is well-supported, indicating favorable timing for relationship decisions.';
  } else if (favorability < 0.4) {
    narrative += ' Your Useful God needs strengthening—seek environments and partners who bring this element.';
  }

  return narrative;
}

// ========================================
// TRAITS
// ========================================

function getUsefulGodTraits(
  usefulGod: BaZiElement,
  annoyingGod: BaZiElement,
  balanceType: ChartBalance,
  strength: 'strong' | 'weak' | 'balanced'
): { strengths: string[]; challenges: string[]; relationshipAdvice: string } {
  const elementStrengths: Record<BaZiElement, string[]> = {
    Wood: ['Growth mindset', 'Flexibility', 'Vision', 'Kindness'],
    Fire: ['Passion', 'Charisma', 'Warmth', 'Inspiration'],
    Earth: ['Stability', 'Reliability', 'Nurturing', 'Groundedness'],
    Metal: ['Clarity', 'Integrity', 'Precision', 'Refinement'],
    Water: ['Wisdom', 'Adaptability', 'Depth', 'Intuition']
  };

  const elementChallenges: Record<BaZiElement, string[]> = {
    Wood: ['Overextension', 'Anger when blocked', 'Scattered growth'],
    Fire: ['Burnout', 'Impulsivity', 'Need for attention'],
    Earth: ['Stubbornness', 'Worry', 'Over-caretaking'],
    Metal: ['Rigidity', 'Grief', 'Excessive criticism'],
    Water: ['Fear', 'Overwhelm', 'Escapism']
  };

  const strengths = [...elementStrengths[usefulGod]];
  const challenges = [...elementChallenges[annoyingGod]];

  let relationshipAdvice: string;
  if (strength === 'strong') {
    relationshipAdvice = `Partners who embody ${usefulGod} energy help balance your strong presence. Avoid relationships that feed your existing strength without providing outlet.`;
  } else if (strength === 'weak') {
    relationshipAdvice = `Partners who support and nurture you with ${usefulGod} energy are most beneficial. Be cautious of relationships that drain rather than replenish.`;
  } else {
    relationshipAdvice = `Your balanced nature allows flexibility in partner selection. Seek those who complement without disrupting your natural equilibrium.`;
  }

  return {
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 3),
    relationshipAdvice
  };
}

// ========================================
// COMPATIBILITY
// ========================================

/**
 * Calculate Useful God compatibility between two charts
 */
export function calculateUsefulGodCompatibility(
  chart1: UsefulGodOverlayResult,
  chart2: UsefulGodOverlayResult
): {
  score: number;
  analysis: string;
  dynamics: string[];
} {
  const dynamics: string[] = [];
  let score = 0.5;

  // Same Useful God = deep resonance
  if (chart1.usefulGod === chart2.usefulGod) {
    score += 0.2;
    dynamics.push(`Shared ${chart1.usefulGod} Useful God creates deep resonance`);
  }

  // One supplies the other's Useful God
  if (chart1.supportElements.includes(chart2.usefulGod)) {
    score += 0.15;
    dynamics.push(`You naturally support partner's ${chart2.usefulGod} needs`);
  }

  if (chart2.supportElements.includes(chart1.usefulGod)) {
    score += 0.15;
    dynamics.push(`Partner naturally supports your ${chart1.usefulGod} needs`);
  }

  // One is the other's Annoying God = friction
  if (chart1.usefulGod === chart2.annoyingGod) {
    score -= 0.1;
    dynamics.push(`Your strength may challenge partner's balance`);
  }

  if (chart2.usefulGod === chart1.annoyingGod) {
    score -= 0.1;
    dynamics.push(`Partner's strength may challenge your balance`);
  }

  // Both strong or both weak
  if (chart1.balanceType === chart2.balanceType) {
    if (chart1.balanceType === 'Day Master Strong') {
      dynamics.push('Two strong Day Masters may compete for dominance');
    } else if (chart1.balanceType === 'Day Master Weak') {
      dynamics.push('Two weak Day Masters may need external support');
      score -= 0.05;
    } else {
      dynamics.push('Both balanced - harmonious baseline');
      score += 0.1;
    }
  }

  // Combined favorability
  const avgFavorability = (chart1.favorability + chart2.favorability) / 2;
  score += (avgFavorability - 0.5) * 0.2;

  score = Math.max(0, Math.min(1, score));

  const analysis = score >= 0.65
    ? 'Your Useful God configurations complement each other well, supporting mutual balance.'
    : score >= 0.45
    ? 'Your Useful God patterns can work together with awareness of each other\'s needs.'
    : 'Your Useful God patterns may create friction—conscious balancing required.';

  return { score, analysis, dynamics };
}

// ========================================
// PERSONA VOICES
// ========================================

export const UsefulGodPersonaVoices: Record<BaZiElement, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  Wood: {
    mentor: 'Growth is your medicine. Seek partners and environments that allow expansion without forcing bloom.',
    oracle: 'The green force stirs within you, seeking light. Your balance comes through becoming, not arriving.',
    companion: 'You need room to grow! Make sure your relationships give you space to evolve.',
    mirror: 'Notice your need for growth and possibility. That hunger for expansion is your compass.'
  },
  Fire: {
    mentor: 'Expression is your medicine. Share your light without burning yourself out.',
    oracle: 'The flame within seeks witness. Your balance comes through shining, not smoldering.',
    companion: 'You need to be seen and appreciated! Find people who celebrate your spark.',
    mirror: 'Notice your need for warmth and recognition. That desire to shine is legitimate.'
  },
  Earth: {
    mentor: 'Stability is your medicine. Build foundations before reaching for heights.',
    oracle: 'The ground beneath calls you home. Your balance comes through settling, not striving.',
    companion: 'You need security and groundedness! Prioritize relationships that feel safe.',
    mirror: 'Notice your need for stability and nurturing. That desire for solid ground is wisdom.'
  },
  Metal: {
    mentor: 'Clarity is your medicine. Refine rather than accumulate; quality over quantity.',
    oracle: 'The blade within seeks truth. Your balance comes through cutting away, not gathering.',
    companion: 'You need precision and authenticity! Don\'t settle for relationships that feel murky.',
    mirror: 'Notice your need for clarity and integrity. That desire for refinement guides you well.'
  },
  Water: {
    mentor: 'Wisdom is your medicine. Trust your depths; stillness reveals more than motion.',
    oracle: 'The deep waters hold your answers. Your balance comes through flowing, not forcing.',
    companion: 'You need depth and understanding! Surface-level connections won\'t satisfy.',
    mirror: 'Notice your need for depth and intuition. That pull toward understanding is your gift.'
  }
};

/**
 * Get Useful God persona voice
 */
export function getUsefulGodPersonaVoice(
  result: UsefulGodOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return UsefulGodPersonaVoices[result.usefulGod][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface UsefulGodChamber {
  id: string;
  name: string;
  description: string;
  element: BaZiElement;
}

export const UsefulGodChambers: Record<BaZiElement, UsefulGodChamber> = {
  Wood: {
    id: 'grove-of-useful-wood',
    name: 'The Grove of Useful Wood',
    description: 'You enter the Grove of Useful Wood, where ancient trees reach toward light and saplings push through stone. Here, growth is medicine, and your Useful God speaks through every upward-reaching branch.',
    element: 'Wood'
  },
  Fire: {
    id: 'hearth-of-useful-fire',
    name: 'The Hearth of Useful Fire',
    description: 'You step into the Hearth of Useful Fire, where flames dance in perfect warmth—neither scorching nor fading. Here, expression is medicine, and your Useful God speaks through every illuminating spark.',
    element: 'Fire'
  },
  Earth: {
    id: 'cavern-of-useful-earth',
    name: 'The Cavern of Useful Earth',
    description: 'You descend into the Cavern of Useful Earth, where crystals form in patient silence and the ground holds memory. Here, stability is medicine, and your Useful God speaks through lasting foundations.',
    element: 'Earth'
  },
  Metal: {
    id: 'forge-of-useful-metal',
    name: 'The Forge of Useful Metal',
    description: 'You enter the Forge of Useful Metal, where raw ore becomes refined blade through careful tempering. Here, clarity is medicine, and your Useful God speaks through every purified edge.',
    element: 'Metal'
  },
  Water: {
    id: 'spring-of-useful-water',
    name: 'The Spring of Useful Water',
    description: 'You come to the Spring of Useful Water, where still depths mirror truth and flowing streams carry wisdom. Here, understanding is medicine, and your Useful God speaks through every reflective surface.',
    element: 'Water'
  }
};

/**
 * Get Useful God chamber narrative
 */
export function getUsefulGodChamberNarrative(result: UsefulGodOverlayResult): string {
  const chamber = UsefulGodChambers[result.usefulGod];
  return `${chamber.description} Your chart's balance point resonates here.`;
}
