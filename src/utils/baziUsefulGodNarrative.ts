/**
 * ============================================================================
 * USEFUL GOD NARRATIVE - Story Mode for Beginners
 * ============================================================================
 *
 * This module generates engaging, beginner-friendly narratives about
 * Useful God (用神) and Annoying God (忌神).
 *
 * Following the "Khan Academy Show Your Work" philosophy, we explain
 * complex BaZi concepts through relatable stories and metaphors.
 *
 * Created: January 2026
 * ============================================================================
 */

import {
  UsefulGodResult,
  ElementName,
  TenGodName
} from './baziUsefulGod';

// ============================================================================
// TYPES
// ============================================================================

export interface UsefulGodStory {
  title: string;
  introduction: string;
  dmAnalysis: string;
  usefulGodSection: string;
  annoyingGodSection: string;
  practicalAdvice: string;
  closingWisdom: string;
}

// ============================================================================
// ELEMENT METAPHORS
// ============================================================================

const ELEMENT_METAPHORS: Record<ElementName, {
  symbol: string;
  nature: string;
  asUseful: string;
  asAnnoying: string;
  activities: string[];
  colors: string[];
  directions: string;
}> = {
  Wood: {
    symbol: '🌳',
    nature: 'growth, expansion, kindness, planning',
    asUseful: 'brings growth opportunities, new beginnings, and creative expansion',
    asAnnoying: 'causes excessive growth, scattered energy, or impractical idealism',
    activities: ['gardening', 'hiking', 'starting new projects', 'learning'],
    colors: ['green', 'teal', 'turquoise'],
    directions: 'East'
  },
  Fire: {
    symbol: '🔥',
    nature: 'passion, recognition, warmth, expression',
    asUseful: 'brings visibility, enthusiasm, and transformative energy',
    asAnnoying: 'causes burnout, conflicts, or excessive attention',
    activities: ['public speaking', 'marketing', 'performing', 'leadership'],
    colors: ['red', 'orange', 'pink', 'purple'],
    directions: 'South'
  },
  Earth: {
    symbol: '🏔️',
    nature: 'stability, nurturing, reliability, grounding',
    asUseful: 'brings stability, resources, and a solid foundation',
    asAnnoying: 'causes stagnation, stubbornness, or excessive worry',
    activities: ['cooking', 'real estate', 'farming', 'meditation'],
    colors: ['yellow', 'brown', 'beige', 'terracotta'],
    directions: 'Center'
  },
  Metal: {
    symbol: '⚔️',
    nature: 'precision, justice, clarity, discipline',
    asUseful: 'brings clarity, discipline, and valuable connections',
    asAnnoying: 'causes harshness, criticism, or cutting off connections',
    activities: ['organizing', 'financial planning', 'jewelry', 'technology'],
    colors: ['white', 'silver', 'gold', 'metallic'],
    directions: 'West'
  },
  Water: {
    symbol: '🌊',
    nature: 'wisdom, adaptability, intuition, flow',
    asUseful: 'brings wisdom, flexibility, and opportunities for learning',
    asAnnoying: 'causes fear, excessive thinking, or emotional overwhelm',
    activities: ['travel', 'writing', 'research', 'swimming'],
    colors: ['black', 'blue', 'navy', 'dark grey'],
    directions: 'North'
  }
};

// ============================================================================
// TEN GOD PERSONALITIES
// ============================================================================

const TEN_GOD_PERSONALITIES: Record<TenGodName, {
  chineseName: string;
  character: string;
  asUseful: string;
  asAnnoying: string;
}> = {
  'Friend': {
    chineseName: '比肩',
    character: 'The Loyal Companion',
    asUseful: 'Supportive partnerships, collaboration, peer support that strengthens you',
    asAnnoying: 'Competition for resources, too many people pulling in different directions'
  },
  'Rob Wealth': {
    chineseName: '劫财',
    character: 'The Ambitious Rival',
    asUseful: 'Healthy competition that pushes you to excel, decisive action',
    asAnnoying: 'People taking what\'s yours, aggressive competition, financial losses'
  },
  'Eating God': {
    chineseName: '食神',
    character: 'The Creative Artist',
    asUseful: 'Creative expression, enjoyment of life, artistic talents flourishing',
    asAnnoying: 'Overindulgence, laziness, too much talk and not enough action'
  },
  'Hurting Officer': {
    chineseName: '伤官',
    character: 'The Rebellious Genius',
    asUseful: 'Innovation, challenging the status quo, unique self-expression',
    asAnnoying: 'Conflicts with authority, reputation damage, speaking out of turn'
  },
  'Direct Wealth': {
    chineseName: '正财',
    character: 'The Steady Provider',
    asUseful: 'Stable income, good relationships, material security through hard work',
    asAnnoying: 'Exhausting work for little gain, draining responsibilities'
  },
  'Indirect Wealth': {
    chineseName: '偏财',
    character: 'The Lucky Investor',
    asUseful: 'Unexpected gains, investment opportunities, networking rewards',
    asAnnoying: 'Risky ventures that backfire, unstable income, financial stress'
  },
  'Direct Officer': {
    chineseName: '正官',
    character: 'The Respected Authority',
    asUseful: 'Career advancement, recognition, discipline that creates success',
    asAnnoying: 'Overbearing bosses, too many rules, feeling constrained'
  },
  'Seven Killings': {
    chineseName: '七杀',
    character: 'The Powerful Warrior',
    asUseful: 'Breakthrough power, overcoming obstacles, leadership opportunities',
    asAnnoying: 'Aggressive competition, legal troubles, powerful enemies'
  },
  'Direct Resource': {
    chineseName: '正印',
    character: 'The Wise Teacher',
    asUseful: 'Education, mentorship, support from elders, inner peace',
    asAnnoying: 'Overthinking, dependency on others, lack of action'
  },
  'Indirect Resource': {
    chineseName: '偏印',
    character: 'The Unconventional Mentor',
    asUseful: 'Unique knowledge, alternative paths, specialized skills',
    asAnnoying: 'Loneliness, unusual problems, feeling misunderstood'
  }
};

// ============================================================================
// STORY GENERATION
// ============================================================================

/**
 * Build a complete story from Useful God result
 */
export function buildUsefulGodStory(
  result: UsefulGodResult,
  dayMasterElement: ElementName
): UsefulGodStory {
  const title = generateTitle(result, dayMasterElement);
  const introduction = generateIntroduction(result, dayMasterElement);
  const dmAnalysis = generateDMAnalysis(result, dayMasterElement);
  const usefulGodSection = generateUsefulSection(result, dayMasterElement);
  const annoyingGodSection = generateAnnoyingSection(result, dayMasterElement);
  const practicalAdvice = generatePracticalAdvice(result, dayMasterElement);
  const closingWisdom = generateClosingWisdom(result);

  return {
    title,
    introduction,
    dmAnalysis,
    usefulGodSection,
    annoyingGodSection,
    practicalAdvice,
    closingWisdom
  };
}

// ============================================================================
// SECTION GENERATORS
// ============================================================================

function generateTitle(result: UsefulGodResult, dm: ElementName): string {
  const dmInfo = ELEMENT_METAPHORS[dm];
  const primaryUseful = result.usefulElements[0];

  if (result.followInfluence) {
    return `${dmInfo.symbol} The Surrendered ${dm}: Following the Flow`;
  }

  if (result.dmCategory === 'strong') {
    return `${dmInfo.symbol} The Abundant ${dm}: Learning to Share`;
  }

  if (result.dmCategory === 'weak') {
    return `${dmInfo.symbol} The Growing ${dm}: Finding Your Support`;
  }

  return `${dmInfo.symbol} The Balanced ${dm}: Maintaining Harmony`;
}

function generateIntroduction(result: UsefulGodResult, dm: ElementName): string {
  const dmInfo = ELEMENT_METAPHORS[dm];

  const parts: string[] = [];
  parts.push(`Your Day Master is ${dm} ${dmInfo.symbol} - the element that represents your core self.`);
  parts.push(`${dm} embodies ${dmInfo.nature}.`);
  parts.push(``);
  parts.push(`In BaZi, every chart has a "Useful God" (用神) - the element that brings balance and harmony.`);
  parts.push(`Think of it as the medicine your chart needs to function at its best.`);
  parts.push(``);
  parts.push(`There's also an "Annoying God" (忌神) - the element that disrupts your chart's equilibrium.`);
  parts.push(`It's not "bad" - it's just not what your particular chart needs.`);

  return parts.join('\n');
}

function generateDMAnalysis(result: UsefulGodResult, dm: ElementName): string {
  const parts: string[] = [];

  parts.push(`## Your Day Master Condition`);
  parts.push(``);

  if (result.dmCategory === 'strong') {
    parts.push(`🔋 **Strong Day Master (身强)**`);
    parts.push(``);
    parts.push(`Your ${dm} energy is abundant - like a cup that's overflowing.`);
    parts.push(`When you have too much of something, the solution isn't to add more.`);
    parts.push(`Instead, you need outlets to channel this excess energy productively.`);
    parts.push(``);
    parts.push(`*Metaphor: You're like a river after heavy rain - powerful but needing channels to flow without flooding.*`);
  } else if (result.dmCategory === 'weak') {
    parts.push(`🌱 **Weak Day Master (身弱)**`);
    parts.push(``);
    parts.push(`Your ${dm} energy is delicate - like a young plant that needs nurturing.`);
    parts.push(`The solution isn't to demand more from you, but to provide support and nourishment.`);
    parts.push(`With the right care, even a small seed grows into a mighty tree.`);
    parts.push(``);
    parts.push(`*Metaphor: You're like a seedling - full of potential but needing sunlight, water, and protection to flourish.*`);
  } else if (result.dmCategory === 'follow') {
    parts.push(`🌀 **Follow Structure (从格)**`);
    parts.push(``);
    parts.push(`Your chart has surrendered to a dominant force - and that's actually powerful.`);
    parts.push(`Like bamboo bending in the wind, flexibility becomes your strength.`);
    parts.push(`The key is to continue flowing with this energy, not resist it.`);
    parts.push(``);
    parts.push(`*Metaphor: You're like a river that has found its course - the power comes from following the natural flow.*`);
  } else if (result.dmCategory === 'special') {
    parts.push(`🏛️ **Special Structure (格局)**`);
    parts.push(``);
    parts.push(`Your chart has formed a special configuration that has its own rules.`);
    parts.push(`Like a precision instrument, it works best when operated as designed.`);
    parts.push(`Understanding your structure is key to maximizing your potential.`);
    parts.push(``);
    parts.push(`*Metaphor: You're like a finely tuned violin - unique and capable of beautiful music when played correctly.*`);
  } else {
    parts.push(`⚖️ **Balanced Day Master (中和)**`);
    parts.push(``);
    parts.push(`Your ${dm} energy is in relative harmony - a rare and fortunate state.`);
    parts.push(`The goal is to maintain this equilibrium as life brings changes.`);
    parts.push(`Balance doesn't mean nothing happens - it means you can handle what comes.`);
    parts.push(``);
    parts.push(`*Metaphor: You're like a skilled surfer - balanced on the board, ready to ride whatever wave comes.*`);
  }

  return parts.join('\n');
}

function generateUsefulSection(result: UsefulGodResult, dm: ElementName): string {
  const parts: string[] = [];

  parts.push(`## Your Useful God (用神)`);
  parts.push(``);
  parts.push(`These are the elements that support your chart's optimal functioning:`);
  parts.push(``);

  result.usefulElements.forEach((element, index) => {
    const info = ELEMENT_METAPHORS[element];
    const priority = result.usefulPriority.find(p => p.element === element);
    const tenGod = priority?.tenGod;
    const tenGodInfo = tenGod ? TEN_GOD_PERSONALITIES[tenGod] : null;

    parts.push(`### ${index + 1}. ${element} ${info.symbol}`);
    parts.push(``);
    parts.push(`When ${element} energy comes into your life, it ${info.asUseful}.`);

    if (tenGodInfo) {
      parts.push(``);
      parts.push(`**As ${tenGodInfo.chineseName} (${tenGodInfo.character}):**`);
      parts.push(`${tenGodInfo.asUseful}`);
    }

    parts.push(``);
    parts.push(`*Ways to invite ${element} energy:*`);
    parts.push(`- Colors: ${info.colors.join(', ')}`);
    parts.push(`- Direction: ${info.directions}`);
    parts.push(`- Activities: ${info.activities.join(', ')}`);
    parts.push(``);
  });

  return parts.join('\n');
}

function generateAnnoyingSection(result: UsefulGodResult, dm: ElementName): string {
  const parts: string[] = [];

  parts.push(`## Your Annoying God (忌神)`);
  parts.push(``);
  parts.push(`These elements can create imbalance in your chart. This doesn't mean they're "evil" - they're just not what your particular chart needs:`);
  parts.push(``);

  result.annoyingElements.forEach((element, index) => {
    const info = ELEMENT_METAPHORS[element];
    const priority = result.annoyingPriority.find(p => p.element === element);
    const tenGod = priority?.tenGod;
    const tenGodInfo = tenGod ? TEN_GOD_PERSONALITIES[tenGod] : null;

    parts.push(`### ${index + 1}. ${element} ${info.symbol}`);
    parts.push(``);
    parts.push(`When ${element} energy dominates, it ${info.asAnnoying}.`);

    if (tenGodInfo) {
      parts.push(``);
      parts.push(`**As ${tenGodInfo.chineseName} (${tenGodInfo.character}):**`);
      parts.push(`${tenGodInfo.asAnnoying}`);
    }

    parts.push(``);
    parts.push(`*During ${element}-heavy periods:*`);
    parts.push(`- Be mindful of ${info.nature.split(',')[0]} becoming excessive`);
    parts.push(`- Balance with Useful God activities`);
    parts.push(`- This is temporary - ride it out with awareness`);
    parts.push(``);
  });

  return parts.join('\n');
}

function generatePracticalAdvice(result: UsefulGodResult, dm: ElementName): string {
  const parts: string[] = [];
  const primaryUseful = result.usefulElements[0];
  const primaryAnnoying = result.annoyingElements[0];

  parts.push(`## Practical Application`);
  parts.push(``);

  if (primaryUseful) {
    const info = ELEMENT_METAPHORS[primaryUseful];
    parts.push(`### Maximize Your Useful God (${primaryUseful})`);
    parts.push(``);
    parts.push(`1. **Environment**: Incorporate ${info.colors.join(' or ')} into your space`);
    parts.push(`2. **Activities**: Engage in ${info.activities[0]} or ${info.activities[1]}`);
    parts.push(`3. **Direction**: When making important decisions, consider the ${info.directions} direction`);
    parts.push(`4. **Timing**: ${primaryUseful} seasons and years tend to be favorable for you`);
    parts.push(``);
  }

  if (primaryAnnoying) {
    const info = ELEMENT_METAPHORS[primaryAnnoying];
    parts.push(`### Navigate Your Annoying God (${primaryAnnoying})`);
    parts.push(``);
    parts.push(`1. **Awareness**: During ${primaryAnnoying} periods, be extra mindful`);
    parts.push(`2. **Balance**: Counter with Useful God activities`);
    parts.push(`3. **Patience**: These periods are temporary; don't make major decisions impulsively`);
    parts.push(`4. **Growth**: Use challenges as opportunities for self-development`);
    parts.push(``);
  }

  return parts.join('\n');
}

function generateClosingWisdom(result: UsefulGodResult): string {
  const wisdoms = [
    'Remember: The goal is balance, not perfection. Your chart\'s needs will guide you to your optimal path.',
    'The ancient masters said: "Know yourself, know your timing." Your Useful God is your compass.',
    'Like water finding its level, your life naturally seeks balance. Trust the process.',
    'Your Useful God is not about avoiding challenges - it\'s about facing them with the right resources.',
    'Every element has its season. Understanding your chart helps you plant seeds at the right time.',
    'The bamboo that bends survives the storm. Flexibility within your nature is strength.'
  ];

  // Select based on category
  if (result.dmCategory === 'follow') {
    return wisdoms[5]; // Bamboo bending
  } else if (result.dmCategory === 'weak') {
    return wisdoms[4]; // Planting seeds
  } else if (result.dmCategory === 'strong') {
    return wisdoms[2]; // Water finding level
  }

  return wisdoms[0]; // Balance
}

// ============================================================================
// BRIEF SUMMARIES
// ============================================================================

/**
 * Generate a one-line summary
 */
export function getUsefulGodOneLiner(result: UsefulGodResult): string {
  const useful = result.usefulElements[0];
  const annoying = result.annoyingElements[0];

  if (result.followInfluence) {
    return `Follow Structure: Embrace ${useful}, avoid disrupting the flow.`;
  }

  if (result.dmCategory === 'strong') {
    return `Strong DM: Channel through ${useful}; avoid building more with ${annoying}.`;
  }

  if (result.dmCategory === 'weak') {
    return `Weak DM: Seek support from ${useful}; be cautious of ${annoying} draining you.`;
  }

  return `Balanced DM: Maintain equilibrium; ${useful} helps, ${annoying} disrupts.`;
}

/**
 * Generate a compact panel display
 */
export function getUsefulGodPanel(result: UsefulGodResult): string {
  const lines: string[] = [];

  lines.push(`╔═══════════════════════════════════════╗`);
  lines.push(`║      USEFUL GOD (用神) ANALYSIS       ║`);
  lines.push(`╠═══════════════════════════════════════╣`);
  lines.push(`║ DM Status: ${result.dmCategory.toUpperCase().padEnd(26)}║`);
  lines.push(`╠═══════════════════════════════════════╣`);
  lines.push(`║ ✅ USEFUL (用神):                      ║`);

  result.usefulElements.forEach(el => {
    const info = ELEMENT_METAPHORS[el];
    lines.push(`║   ${info.symbol} ${el.padEnd(32)}║`);
  });

  lines.push(`╠═══════════════════════════════════════╣`);
  lines.push(`║ ❌ ANNOYING (忌神):                    ║`);

  result.annoyingElements.forEach(el => {
    const info = ELEMENT_METAPHORS[el];
    lines.push(`║   ${info.symbol} ${el.padEnd(32)}║`);
  });

  lines.push(`╠═══════════════════════════════════════╣`);
  lines.push(`║ Confidence: ${(result.confidence * 100).toFixed(0)}%                       ║`);
  lines.push(`╚═══════════════════════════════════════╝`);

  return lines.join('\n');
}

// ============================================================================
// DEBUG OUTPUT
// ============================================================================

/**
 * Generate debug output with full reasoning
 */
export function getUsefulGodDebug(result: UsefulGodResult): string {
  const lines: string[] = [];

  lines.push(`=== USEFUL GOD (用神) DEBUG ===`);
  lines.push(``);
  lines.push(`DM Category: ${result.dmCategory}`);
  lines.push(`Structure Influence: ${result.structureInfluence || 'None'}`);
  lines.push(`Follow Influence: ${result.followInfluence || 'None'}`);
  lines.push(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  lines.push(``);
  lines.push(`--- USEFUL ---`);
  lines.push(`Elements: ${result.usefulElements.join(', ')}`);
  lines.push(`Ten Gods: ${result.usefulTenGods.join(', ')}`);
  lines.push(`Priority:`);
  result.usefulPriority.forEach((p, i) => {
    lines.push(`  ${i + 1}. ${p.element} (${p.tenGod}) - Score: ${p.score.toFixed(2)}`);
  });
  lines.push(``);
  lines.push(`--- ANNOYING ---`);
  lines.push(`Elements: ${result.annoyingElements.join(', ')}`);
  lines.push(`Ten Gods: ${result.annoyingTenGods.join(', ')}`);
  lines.push(`Priority:`);
  result.annoyingPriority.forEach((p, i) => {
    lines.push(`  ${i + 1}. ${p.element} (${p.tenGod}) - Score: ${p.score.toFixed(2)}`);
  });
  lines.push(``);
  lines.push(`--- REASONING ---`);
  result.reasoning.forEach(r => lines.push(r));
  lines.push(``);
  lines.push(`--- SUMMARY ---`);
  lines.push(result.summary);

  return lines.join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildUsefulGodStory,
  getUsefulGodOneLiner,
  getUsefulGodPanel,
  getUsefulGodDebug,
  ELEMENT_METAPHORS,
  TEN_GOD_PERSONALITIES
};
