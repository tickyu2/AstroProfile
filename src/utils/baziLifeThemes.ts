/**
 * ============================================================================
 * BAZI LIFE THEME EXTRACTION ENGINE (人生主题)
 * ============================================================================
 *
 * The mythic, narrative-rich module where the composite 命盘 stops being a
 * technical object and becomes a story, a mythos, a living arc.
 *
 * This module answers:
 * - What is the relationship about?
 * - What is its karmic purpose?
 * - What is its mythic archetype?
 * - What are its long arcs of growth?
 * - What are its shadow patterns?
 * - What is the "lesson" or "medicine" of the bond?
 * - What is the relationship's life cycle?
 *
 * Five Life Theme Layers:
 * 1. Essence Theme (本质主题) - Core identity
 * 2. Dynamic Theme (动力主题) - Movement and growth
 * 3. Shadow Theme (阴影主题) - Recurring challenges
 * 4. Destiny Arc (命运弧线) - Long-term storyline
 * 5. Karmic Signature (因缘印记) - Spiritual patterns
 *
 * Based on: Classical 命理 narrative interpretation
 * Aligned with: Joey Yap storytelling methodology
 * Created: January 2026
 * ============================================================================
 */

import type {
  CompositeChart,
  CompositeDayMaster,
  CompositeElementDistribution,
  CompositeTenGods,
  CompositeUsefulGod,
  CompositeShenSha,
  CompositeLuckPillar
} from './baziCompositeChart';

import type { TrajectoryCurve } from './baziTrajectory';

import type { SynastryHeatmap } from './baziSynastryHeatmap';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';

/**
 * Essence Theme - The soul of the relationship
 */
export interface EssenceTheme {
  title: string;
  chineseTitle: string;
  coreElement: ElementName;
  corePolarity: Polarity;
  archetype: string;
  archetypeChinese: string;
  narrative: string;
  keywords: string[];
  elementalSignature: string;
}

/**
 * Dynamic Theme - How the relationship moves
 */
export interface DynamicTheme {
  title: string;
  chineseTitle: string;
  primaryDriver: string;
  primaryDriverChinese: string;
  movementPattern: 'expansion' | 'consolidation' | 'transformation' | 'nurturing' | 'creation';
  narrative: string;
  growthAreas: string[];
  optimalActivities: string[];
}

/**
 * Shadow Theme - The recurring challenge
 */
export interface ShadowTheme {
  title: string;
  chineseTitle: string;
  shadowElement: ElementName;
  shadowPattern: string;
  shadowPatternChinese: string;
  narrative: string;
  triggers: string[];
  healingPath: string;
  integrationAdvice: string;
}

/**
 * Destiny Arc Phase
 */
export interface DestinyPhase {
  name: string;
  chineseName: string;
  startYear: number;
  endYear: number;
  theme: string;
  energy: 'ascending' | 'peak' | 'descending' | 'stable' | 'transforming';
  keyLessons: string[];
  opportunities: string[];
  cautions: string[];
}

/**
 * Destiny Arc - The long storyline
 */
export interface DestinyArc {
  title: string;
  chineseTitle: string;
  overallNarrative: string;
  phases: DestinyPhase[];
  peakPeriods: Array<{ years: string; description: string }>;
  challengingPeriods: Array<{ years: string; description: string }>;
  majorTransitions: Array<{ year: number; description: string }>;
  lifeStageAdvice: {
    early: string;
    middle: string;
    mature: string;
  };
}

/**
 * Karmic Pattern
 */
export interface KarmicPattern {
  name: string;
  chineseName: string;
  nature: 'blessing' | 'lesson' | 'gift' | 'challenge' | 'mystery';
  description: string;
  pastLifeHint: string;
  currentLifePurpose: string;
}

/**
 * Karmic Signature - The deeper pattern
 */
export interface KarmicSignature {
  title: string;
  chineseTitle: string;
  overallNarrative: string;
  patterns: KarmicPattern[];
  soulContract: string;
  ancestralTheme: string;
  spiritualGift: string;
  karmicLesson: string;
}

/**
 * Complete Life Themes
 */
export interface LifeThemes {
  essence: EssenceTheme;
  dynamics: DynamicTheme;
  shadow: ShadowTheme;
  destinyArc: DestinyArc;
  karmic: KarmicSignature;

  // Summary
  oneLineSummary: string;
  mythicArchetype: string;
  relationshipMedicine: string;

  // Metadata
  computedAt: string;
  personAName: string;
  personBName: string;
}

// ============================================================================
// ARCHETYPE MAPPINGS
// ============================================================================

/**
 * Day Master archetypes for relationships
 */
const DM_ARCHETYPES: Record<string, {
  archetype: string;
  chinese: string;
  keywords: string[];
  essence: string;
}> = {
  '甲': {
    archetype: 'The Pioneer Couple',
    chinese: '先驱者',
    keywords: ['growth', 'leadership', 'ambition', 'vision', 'breakthrough'],
    essence: 'A relationship that breaks new ground, reaches for the sky, and leads others forward.'
  },
  '乙': {
    archetype: 'The Garden Tenders',
    chinese: '园丁',
    keywords: ['nurturing', 'flexibility', 'sensitivity', 'adaptation', 'grace'],
    essence: 'A relationship that cultivates beauty, bends without breaking, and grows through gentle persistence.'
  },
  '丙': {
    archetype: 'The Radiant Pair',
    chinese: '光明使者',
    keywords: ['passion', 'visibility', 'warmth', 'inspiration', 'generosity'],
    essence: 'A relationship that shines brightly, warms all it touches, and illuminates the path for others.'
  },
  '丁': {
    archetype: 'The Sacred Flame',
    chinese: '圣火守护者',
    keywords: ['intimacy', 'devotion', 'warmth', 'mystery', 'transformation'],
    essence: 'A relationship that burns with quiet intensity, transforms through love, and holds sacred space.'
  },
  '戊': {
    archetype: 'The Mountain Guardians',
    chinese: '山岳守护',
    keywords: ['stability', 'protection', 'reliability', 'endurance', 'foundation'],
    essence: 'A relationship built on solid ground, offering shelter and strength that withstands all storms.'
  },
  '己': {
    archetype: 'The Earth Nurturers',
    chinese: '大地母亲',
    keywords: ['nurturing', 'fertility', 'patience', 'cultivation', 'abundance'],
    essence: 'A relationship that nourishes growth, supports life, and creates abundance through care.'
  },
  '庚': {
    archetype: 'The Sword Forgers',
    chinese: '铸剑师',
    keywords: ['refinement', 'justice', 'clarity', 'strength', 'precision'],
    essence: 'A relationship that cuts through illusion, forges strength through challenge, and honors truth.'
  },
  '辛': {
    archetype: 'The Jewel Keepers',
    chinese: '珠宝守护',
    keywords: ['beauty', 'refinement', 'value', 'precision', 'elegance'],
    essence: 'A relationship that treasures beauty, polishes each other\'s gifts, and shines with inner light.'
  },
  '壬': {
    archetype: 'The Ocean Voyagers',
    chinese: '大洋航行者',
    keywords: ['flow', 'wisdom', 'adaptability', 'depth', 'momentum'],
    essence: 'A relationship that flows like the ocean, carries deep wisdom, and navigates all waters.'
  },
  '癸': {
    archetype: 'The Mystic Springs',
    chinese: '神秘之泉',
    keywords: ['intuition', 'mystery', 'healing', 'depth', 'renewal'],
    essence: 'A relationship that draws from hidden depths, heals through presence, and renews through mystery.'
  }
};

/**
 * Element combination narratives
 */
const ELEMENT_PAIR_NARRATIVES: Record<string, string> = {
  'Wood_Fire': 'growth feeding passion, vision becoming reality',
  'Wood_Earth': 'roots meeting stability, expansion with grounding',
  'Wood_Metal': 'growth meeting refinement, flexibility with structure',
  'Wood_Water': 'growth nourished by depth, intuition feeding vision',
  'Fire_Earth': 'passion creating substance, warmth building foundations',
  'Fire_Metal': 'passion meeting precision, warmth with clarity',
  'Fire_Water': 'passion balanced by depth, intensity with wisdom',
  'Earth_Metal': 'stability supporting refinement, foundation for excellence',
  'Earth_Water': 'stability embracing flow, grounding with adaptability',
  'Metal_Water': 'clarity feeding wisdom, structure supporting flow'
};

/**
 * Ten God driver narratives
 */
const TEN_GOD_DRIVERS: Record<string, {
  pattern: string;
  narrative: string;
  activities: string[];
}> = {
  'Direct Wealth': {
    pattern: 'consolidation',
    narrative: 'This relationship grows through building tangible assets, creating security, and manifesting shared dreams into reality.',
    activities: ['financial planning', 'home building', 'business ventures', 'practical projects']
  },
  'Indirect Wealth': {
    pattern: 'expansion',
    narrative: 'This relationship attracts unexpected opportunities and grows through serendipity, luck, and openness to new possibilities.',
    activities: ['investing', 'networking', 'speculative ventures', 'opportunity seeking']
  },
  'Direct Officer': {
    pattern: 'consolidation',
    narrative: 'This relationship grows through commitment, responsibility, and honoring the structures that support it.',
    activities: ['shared duties', 'formal commitments', 'career building', 'social responsibilities']
  },
  'Seven Killings': {
    pattern: 'transformation',
    narrative: 'This relationship grows through overcoming challenges, facing fears, and transforming pressure into power.',
    activities: ['competitive pursuits', 'challenging goals', 'crisis management', 'breakthrough projects']
  },
  'Direct Resource': {
    pattern: 'nurturing',
    narrative: 'This relationship grows through mutual care, emotional support, and creating a nurturing sanctuary.',
    activities: ['learning together', 'spiritual practices', 'self-care rituals', 'wisdom seeking']
  },
  'Indirect Resource': {
    pattern: 'transformation',
    narrative: 'This relationship grows through unconventional wisdom, unique perspectives, and embracing the unusual.',
    activities: ['alternative studies', 'creative problem-solving', 'metaphysical exploration', 'innovation']
  },
  'Rob Wealth': {
    pattern: 'expansion',
    narrative: 'This relationship grows through healthy competition, mutual challenge, and pushing each other to excel.',
    activities: ['competitive sports', 'business rivalry', 'skill development', 'mutual challenge']
  },
  'Friend': {
    pattern: 'consolidation',
    narrative: 'This relationship grows through equality, mutual respect, and walking the path as true companions.',
    activities: ['shared hobbies', 'team activities', 'mutual support', 'equal partnership']
  },
  'Eating God': {
    pattern: 'creation',
    narrative: 'This relationship grows through creative expression, joy, and bringing beautiful things into the world.',
    activities: ['artistic creation', 'cooking together', 'entertainment', 'pleasure seeking']
  },
  'Hurting Officer': {
    pattern: 'creation',
    narrative: 'This relationship grows through authentic self-expression, breaking rules, and creative rebellion.',
    activities: ['innovative projects', 'artistic expression', 'challenging norms', 'unique creation']
  }
};

/**
 * Shadow element patterns
 */
const SHADOW_PATTERNS: Record<ElementName, {
  pattern: string;
  chinese: string;
  triggers: string[];
  healing: string;
}> = {
  Wood: {
    pattern: 'Stagnation and Rigidity',
    chinese: '僵化停滞',
    triggers: ['lack of growth', 'feeling trapped', 'blocked creativity', 'indecision'],
    healing: 'Create space for movement, new experiences, and fresh perspectives. Plant seeds of change.'
  },
  Fire: {
    pattern: 'Burnout and Coldness',
    chinese: '燃尽冷漠',
    triggers: ['overwork', 'lost passion', 'emotional withdrawal', 'lack of joy'],
    healing: 'Rekindle warmth through play, celebration, and shared laughter. Protect the flame.'
  },
  Earth: {
    pattern: 'Instability and Worry',
    chinese: '不安焦虑',
    triggers: ['financial stress', 'lack of routine', 'overthinking', 'groundlessness'],
    healing: 'Build routines, create physical comfort, and practice presence. Return to the body.'
  },
  Metal: {
    pattern: 'Chaos and Boundary Loss',
    chinese: '混乱边界模糊',
    triggers: ['unclear agreements', 'broken promises', 'disorganization', 'enmeshment'],
    healing: 'Establish clear boundaries, honor commitments, and create structure. Define the edges.'
  },
  Water: {
    pattern: 'Overwhelm and Disconnection',
    chinese: '情感泛滥',
    triggers: ['emotional flooding', 'communication breakdown', 'fear', 'isolation'],
    healing: 'Create safe spaces for emotional expression. Flow with feelings rather than drowning.'
  }
};

/**
 * Shen Sha karmic interpretations
 */
const SHENSHA_KARMIC: Record<string, KarmicPattern> = {
  '红鸾': {
    name: 'Red Matchmaker',
    chineseName: '红鸾',
    nature: 'blessing',
    description: 'A karmic romantic bond that feels fated and magnetically drawn together.',
    pastLifeHint: 'You may have been lovers, partners, or deeply bonded in a past life.',
    currentLifePurpose: 'To experience and express romantic love at its highest potential.'
  },
  '天喜': {
    name: 'Sky Happiness',
    chineseName: '天喜',
    nature: 'gift',
    description: 'A relationship blessed with joy, celebration, and happy occasions.',
    pastLifeHint: 'You may have shared celebrations, festivals, or joyful occasions in past lives.',
    currentLifePurpose: 'To bring joy and celebration into each other\'s lives and the world.'
  },
  '天乙贵人': {
    name: 'Heavenly Nobleman',
    chineseName: '天乙贵人',
    nature: 'blessing',
    description: 'A protective bond where partners serve as noble helpers for each other.',
    pastLifeHint: 'One may have saved or protected the other in a past life.',
    currentLifePurpose: 'To be guardians and guides for each other\'s highest path.'
  },
  '文昌': {
    name: 'Academic Star',
    chineseName: '文昌',
    nature: 'gift',
    description: 'A relationship that supports intellectual growth and shared wisdom.',
    pastLifeHint: 'You may have been teacher and student, or fellow scholars.',
    currentLifePurpose: 'To learn, grow, and share wisdom together.'
  },
  '将星': {
    name: 'General Star',
    chineseName: '将星',
    nature: 'gift',
    description: 'A relationship with leadership potential and commanding presence.',
    pastLifeHint: 'You may have led together, served together, or fought side by side.',
    currentLifePurpose: 'To lead, inspire, and command respect as a united force.'
  },
  '桃花': {
    name: 'Peach Blossom',
    chineseName: '桃花',
    nature: 'mystery',
    description: 'A relationship with strong romantic and attraction energy.',
    pastLifeHint: 'The attraction may carry echoes of passionate past-life connections.',
    currentLifePurpose: 'To explore the mysteries of attraction, beauty, and desire.'
  },
  '驿马': {
    name: 'Traveling Horse',
    chineseName: '驿马',
    nature: 'lesson',
    description: 'A relationship that involves movement, travel, or constant change.',
    pastLifeHint: 'You may have been travelers, traders, or nomads together.',
    currentLifePurpose: 'To grow through movement, change, and shared adventures.'
  },
  '孤辰': {
    name: 'Loneliness Star',
    chineseName: '孤辰',
    nature: 'challenge',
    description: 'A relationship that must navigate periods of isolation or distance.',
    pastLifeHint: 'There may be karmic patterns of separation to heal.',
    currentLifePurpose: 'To find togetherness within independence, and heal isolation patterns.'
  },
  '寡宿': {
    name: 'Widow Star',
    chineseName: '寡宿',
    nature: 'challenge',
    description: 'A relationship that faces challenges around separation or independence.',
    pastLifeHint: 'There may be past-life patterns of loss or premature separation.',
    currentLifePurpose: 'To build a bond strong enough to transcend all forms of separation.'
  }
};

// ============================================================================
// ESSENCE THEME EXTRACTION
// ============================================================================

/**
 * Extract the Essence Theme from composite chart
 */
export function extractEssenceTheme(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): EssenceTheme {
  const archetype = DM_ARCHETYPES[dayMaster.stem];
  const dominant = elementDist.dominant;
  const secondary = getSecondaryElement(elementDist);

  // Build elemental signature narrative
  const pairKey = [dayMaster.element, dominant].sort().join('_');
  const pairNarrative = ELEMENT_PAIR_NARRATIVES[pairKey] ||
    `${dayMaster.element.toLowerCase()} meeting ${dominant.toLowerCase()}`;

  const narrative = buildEssenceNarrative(dayMaster, elementDist, archetype, pairNarrative);

  return {
    title: archetype.archetype,
    chineseTitle: archetype.chinese,
    coreElement: dayMaster.element,
    corePolarity: dayMaster.polarity,
    archetype: archetype.archetype,
    archetypeChinese: archetype.chinese,
    narrative,
    keywords: archetype.keywords,
    elementalSignature: `${dayMaster.element} core with ${dominant} dominance and ${secondary} support`
  };
}

/**
 * Get secondary element from distribution
 */
function getSecondaryElement(dist: CompositeElementDistribution): ElementName {
  const elements: Array<[ElementName, number]> = [
    ['Wood', dist.Wood],
    ['Fire', dist.Fire],
    ['Earth', dist.Earth],
    ['Metal', dist.Metal],
    ['Water', dist.Water]
  ];
  elements.sort((a, b) => b[1] - a[1]);
  return elements[1][0];
}

/**
 * Build essence narrative
 */
function buildEssenceNarrative(
  dm: CompositeDayMaster,
  dist: CompositeElementDistribution,
  archetype: typeof DM_ARCHETYPES[string],
  pairNarrative: string
): string {
  const parts: string[] = [];

  // Opening with archetype
  parts.push(`This relationship embodies the archetype of ${archetype.archetype} (${archetype.chinese}).`);

  // Core essence
  parts.push(archetype.essence);

  // Elemental character
  const balanceDesc = dist.balance === 'balanced' ? 'harmoniously balanced' :
                      dist.balance === 'slightly_imbalanced' ? 'dynamically textured' :
                      dist.balance === 'imbalanced' ? 'distinctly characterized' : 'intensely focused';

  parts.push(`The elemental ecosystem is ${balanceDesc}, with ${dist.dominant} energy leading (${dist[dist.dominant]}%) and ${dist.weakest} as the quieter voice (${dist[dist.weakest]}%).`);

  // Pair narrative
  parts.push(`At its heart, this is a story of ${pairNarrative}.`);

  // Strength context
  if (dm.strengthCategory === 'very_strong' || dm.strengthCategory === 'strong') {
    parts.push('The relationship has strong vitality and presence, capable of weathering storms and making its mark on the world.');
  } else if (dm.strengthCategory === 'balanced') {
    parts.push('The relationship has balanced energy, neither overwhelming nor underwhelming, able to adapt to circumstances.');
  } else {
    parts.push('The relationship benefits from nurturing and external support, finding strength in gentleness.');
  }

  return parts.join(' ');
}

// ============================================================================
// DYNAMIC THEME EXTRACTION
// ============================================================================

/**
 * Extract the Dynamic Theme from composite chart
 */
export function extractDynamicTheme(
  tenGods: CompositeTenGods,
  usefulGod: CompositeUsefulGod
): DynamicTheme {
  const driver = TEN_GOD_DRIVERS[tenGods.dominant] || TEN_GOD_DRIVERS['Friend'];

  const narrative = buildDynamicNarrative(tenGods, usefulGod, driver);

  return {
    title: `The ${driver.pattern.charAt(0).toUpperCase() + driver.pattern.slice(1)} Path`,
    chineseTitle: getPatternChinese(driver.pattern),
    primaryDriver: tenGods.dominant,
    primaryDriverChinese: tenGods.dominantChinese,
    movementPattern: driver.pattern as DynamicTheme['movementPattern'],
    narrative,
    growthAreas: getGrowthAreas(tenGods, usefulGod),
    optimalActivities: driver.activities
  };
}

/**
 * Get Chinese name for movement pattern
 */
function getPatternChinese(pattern: string): string {
  const map: Record<string, string> = {
    'expansion': '扩展之道',
    'consolidation': '巩固之道',
    'transformation': '转化之道',
    'nurturing': '滋养之道',
    'creation': '创造之道'
  };
  return map[pattern] || '平衡之道';
}

/**
 * Build dynamic narrative
 */
function buildDynamicNarrative(
  tenGods: CompositeTenGods,
  usefulGod: CompositeUsefulGod,
  driver: typeof TEN_GOD_DRIVERS[string]
): string {
  const parts: string[] = [];

  // Primary driver
  parts.push(`With ${tenGods.dominant} (${tenGods.dominantChinese}) as the dominant Ten God, this relationship moves through ${driver.pattern}.`);

  // Driver narrative
  parts.push(driver.narrative);

  // Useful God integration
  parts.push(`The relationship's stabilizing force is ${usefulGod.element} (${usefulGod.chineseName}).`);
  parts.push(usefulGod.stabilizingAdvice);

  // Ten Gods interpretation
  parts.push(tenGods.interpretation);

  return parts.join(' ');
}

/**
 * Get growth areas from Ten Gods
 */
function getGrowthAreas(tenGods: CompositeTenGods, usefulGod: CompositeUsefulGod): string[] {
  const areas: string[] = [];

  if (tenGods.directWealth || tenGods.indirectWealth) {
    areas.push('Building shared resources and financial security');
  }
  if (tenGods.directOfficer || tenGods.sevenKillings) {
    areas.push('Developing structure, commitment, and shared responsibilities');
  }
  if (tenGods.directResource || tenGods.indirectResource) {
    areas.push('Nurturing each other and creating supportive foundations');
  }
  if (tenGods.eatingGod || tenGods.hurtingOfficer) {
    areas.push('Creative expression and bringing ideas to life');
  }
  if (tenGods.friend || tenGods.robWealth) {
    areas.push('Equal partnership and mutual empowerment');
  }

  areas.push(`Cultivating ${usefulGod.element} energy for balance`);

  return areas.slice(0, 4);
}

// ============================================================================
// SHADOW THEME EXTRACTION
// ============================================================================

/**
 * Extract the Shadow Theme from composite chart
 */
export function extractShadowTheme(
  elementDist: CompositeElementDistribution,
  usefulGod: CompositeUsefulGod,
  conflicts?: Array<{ type: string; description: string }>
): ShadowTheme {
  const shadowElement = elementDist.weakest;
  const shadow = SHADOW_PATTERNS[shadowElement];

  const annoyingElements = usefulGod.avoidElements;
  const primaryAnnoying = annoyingElements[0] || shadowElement;

  const narrative = buildShadowNarrative(shadowElement, shadow, primaryAnnoying, elementDist, conflicts);

  return {
    title: shadow.pattern,
    chineseTitle: shadow.chinese,
    shadowElement,
    shadowPattern: shadow.pattern,
    shadowPatternChinese: shadow.chinese,
    narrative,
    triggers: shadow.triggers,
    healingPath: shadow.healing,
    integrationAdvice: buildIntegrationAdvice(shadowElement, primaryAnnoying)
  };
}

/**
 * Build shadow narrative
 */
function buildShadowNarrative(
  weakest: ElementName,
  shadow: typeof SHADOW_PATTERNS[ElementName],
  annoying: ElementName,
  dist: CompositeElementDistribution,
  conflicts?: Array<{ type: string; description: string }>
): string {
  const parts: string[] = [];

  // Opening
  parts.push(`Every relationship has its shadow — the recurring challenge that calls for conscious work.`);

  // Weak element
  parts.push(`With ${weakest} as the weakest element (${dist[weakest]}%), this relationship's shadow manifests as ${shadow.pattern.toLowerCase()}.`);

  // Triggers
  parts.push(`The shadow awakens when: ${shadow.triggers.slice(0, 3).join(', ')}.`);

  // Annoying element
  if (annoying !== weakest) {
    parts.push(`${annoying} energy can also destabilize the bond when present in excess.`);
  }

  // Conflicts
  if (conflicts && conflicts.length > 0) {
    parts.push(`Structural tensions (${conflicts.slice(0, 2).map(c => c.type).join(', ')}) may amplify these shadow patterns.`);
  }

  // Healing
  parts.push(shadow.healing);

  return parts.join(' ');
}

/**
 * Build integration advice
 */
function buildIntegrationAdvice(shadow: ElementName, annoying: ElementName): string {
  const elementAdvice: Record<ElementName, string> = {
    Wood: 'Introduce more Wood energy through nature, growth activities, learning, and forward movement.',
    Fire: 'Rekindle Fire through celebration, passion projects, warmth, and shared joy.',
    Earth: 'Strengthen Earth through routines, physical comfort, practical projects, and grounding practices.',
    Metal: 'Cultivate Metal through clear communication, boundaries, organization, and honoring commitments.',
    Water: 'Invite Water through emotional depth, intuitive practices, rest, and fluid communication.'
  };

  let advice = elementAdvice[shadow];

  if (annoying !== shadow) {
    advice += ` Be mindful of excess ${annoying} energy which can overwhelm the bond.`;
  }

  return advice;
}

// ============================================================================
// DESTINY ARC EXTRACTION
// ============================================================================

/**
 * Extract the Destiny Arc from luck pillars and trajectory
 */
export function extractDestinyArc(
  luckPillars: CompositeLuckPillar[],
  trajectory?: TrajectoryCurve
): DestinyArc {
  const phases = buildDestinyPhases(luckPillars);
  const peakPeriods = findPeakPeriods(luckPillars);
  const challengingPeriods = findChallengingPeriods(luckPillars);
  const majorTransitions = findMajorTransitions(luckPillars, trajectory);

  const overallNarrative = buildDestinyNarrative(phases, peakPeriods, challengingPeriods);

  return {
    title: 'The Journey Together',
    chineseTitle: '共同旅程',
    overallNarrative,
    phases,
    peakPeriods,
    challengingPeriods,
    majorTransitions,
    lifeStageAdvice: buildLifeStageAdvice(phases)
  };
}

/**
 * Build destiny phases from luck pillars
 */
function buildDestinyPhases(luckPillars: CompositeLuckPillar[]): DestinyPhase[] {
  const phases: DestinyPhase[] = [];

  // Early phase (first 2-3 luck pillars)
  const earlyPillars = luckPillars.slice(0, 3);
  if (earlyPillars.length > 0) {
    phases.push({
      name: 'Foundation',
      chineseName: '基础期',
      startYear: 0,
      endYear: Math.min(30, earlyPillars[earlyPillars.length - 1]?.endAge || 30),
      theme: buildPhaseTheme(earlyPillars),
      energy: getPhaseEnergy(earlyPillars),
      keyLessons: ['Building trust', 'Establishing patterns', 'Learning each other'],
      opportunities: ['Deep bonding', 'Foundation building', 'Identity formation'],
      cautions: ['Rushing commitment', 'Ignoring red flags', 'Losing individuality']
    });
  }

  // Middle phase (pillars 3-5)
  const middlePillars = luckPillars.slice(3, 6);
  if (middlePillars.length > 0) {
    phases.push({
      name: 'Development',
      chineseName: '发展期',
      startYear: middlePillars[0]?.startAge || 30,
      endYear: middlePillars[middlePillars.length - 1]?.endAge || 60,
      theme: buildPhaseTheme(middlePillars),
      energy: getPhaseEnergy(middlePillars),
      keyLessons: ['Deepening commitment', 'Navigating challenges', 'Building together'],
      opportunities: ['Shared achievements', 'Family building', 'Legacy creation'],
      cautions: ['Complacency', 'Taking each other for granted', 'External pressures']
    });
  }

  // Mature phase (pillars 6+)
  const maturePillars = luckPillars.slice(6);
  if (maturePillars.length > 0) {
    phases.push({
      name: 'Harvest',
      chineseName: '收获期',
      startYear: maturePillars[0]?.startAge || 60,
      endYear: maturePillars[maturePillars.length - 1]?.endAge || 80,
      theme: buildPhaseTheme(maturePillars),
      energy: getPhaseEnergy(maturePillars),
      keyLessons: ['Wisdom integration', 'Letting go', 'Spiritual deepening'],
      opportunities: ['Legacy fulfillment', 'Wisdom sharing', 'Peaceful companionship'],
      cautions: ['Health neglect', 'Unresolved issues', 'Disconnection']
    });
  }

  return phases;
}

/**
 * Build phase theme from pillars
 */
function buildPhaseTheme(pillars: CompositeLuckPillar[]): string {
  const favorablePillars = pillars.filter(p => p.favorability === 'excellent' || p.favorability === 'good');
  const challengingPillars = pillars.filter(p => p.favorability === 'challenging' || p.favorability === 'difficult');

  if (favorablePillars.length > challengingPillars.length) {
    return 'A period of growth, opportunity, and favorable energy supporting the relationship.';
  } else if (challengingPillars.length > favorablePillars.length) {
    return 'A period requiring conscious work, patience, and mutual support through challenges.';
  } else {
    return 'A balanced period with both opportunities and tests, calling for adaptability.';
  }
}

/**
 * Get phase energy from pillars
 */
function getPhaseEnergy(pillars: CompositeLuckPillar[]): DestinyPhase['energy'] {
  const favorable = pillars.filter(p => p.favorability === 'excellent' || p.favorability === 'good').length;
  const challenging = pillars.filter(p => p.favorability === 'challenging' || p.favorability === 'difficult').length;

  if (favorable > challenging * 2) return 'ascending';
  if (challenging > favorable * 2) return 'descending';
  if (pillars.some(p => p.favorability === 'excellent')) return 'peak';
  if (pillars.some(p => p.favorability === 'difficult')) return 'transforming';
  return 'stable';
}

/**
 * Find peak periods
 */
function findPeakPeriods(luckPillars: CompositeLuckPillar[]): Array<{ years: string; description: string }> {
  const peaks: Array<{ years: string; description: string }> = [];

  for (const pillar of luckPillars) {
    if (pillar.favorability === 'excellent') {
      peaks.push({
        years: `${pillar.startAge}-${pillar.endAge}`,
        description: `${pillar.stem}${pillar.branch} (${pillar.element}) brings ${pillar.description}`
      });
    }
  }

  return peaks.slice(0, 3);
}

/**
 * Find challenging periods
 */
function findChallengingPeriods(luckPillars: CompositeLuckPillar[]): Array<{ years: string; description: string }> {
  const challenges: Array<{ years: string; description: string }> = [];

  for (const pillar of luckPillars) {
    if (pillar.favorability === 'challenging' || pillar.favorability === 'difficult') {
      challenges.push({
        years: `${pillar.startAge}-${pillar.endAge}`,
        description: pillar.description
      });
    }
  }

  return challenges.slice(0, 3);
}

/**
 * Find major transitions
 */
function findMajorTransitions(
  luckPillars: CompositeLuckPillar[],
  trajectory?: TrajectoryCurve
): Array<{ year: number; description: string }> {
  const transitions: Array<{ year: number; description: string }> = [];

  // From luck pillars - transitions between favorable and challenging
  for (let i = 1; i < luckPillars.length; i++) {
    const prev = luckPillars[i - 1];
    const curr = luckPillars[i];

    const prevGood = prev.favorability === 'excellent' || prev.favorability === 'good';
    const currGood = curr.favorability === 'excellent' || curr.favorability === 'good';

    if (prevGood !== currGood) {
      transitions.push({
        year: curr.startAge,
        description: prevGood
          ? `Transition from favorable to testing period at year ${curr.startAge}`
          : `Transition from challenging to supportive period at year ${curr.startAge}`
      });
    }
  }

  // From trajectory - significant peaks and valleys
  if (trajectory?.peaks) {
    for (const peak of trajectory.peaks.slice(0, 2)) {
      if (!transitions.some(t => Math.abs(t.year - peak.t) < 5)) {
        transitions.push({
          year: Math.round(peak.t),
          description: `Peak energy period around year ${Math.round(peak.t)} (score: ${Math.round(peak.score)})`
        });
      }
    }
  }

  if (trajectory?.valleys) {
    for (const valley of trajectory.valleys.slice(0, 2)) {
      if (!transitions.some(t => Math.abs(t.year - valley.t) < 5)) {
        transitions.push({
          year: Math.round(valley.t),
          description: `Valley period around year ${Math.round(valley.t)} requiring extra support`
        });
      }
    }
  }

  return transitions.sort((a, b) => a.year - b.year).slice(0, 5);
}

/**
 * Build destiny narrative
 */
function buildDestinyNarrative(
  phases: DestinyPhase[],
  peaks: Array<{ years: string; description: string }>,
  challenges: Array<{ years: string; description: string }>
): string {
  const parts: string[] = [];

  parts.push('Every relationship has its seasons — times of planting, growth, harvest, and rest.');

  if (phases.length > 0) {
    const energyMap: Record<string, string> = {
      'ascending': 'rising energy',
      'peak': 'peak potential',
      'descending': 'consolidating energy',
      'stable': 'steady flow',
      'transforming': 'transformative force'
    };

    parts.push(`The journey begins with ${phases[0].name.toLowerCase()} (${phases[0].chineseName}), characterized by ${energyMap[phases[0].energy]}.`);
  }

  if (peaks.length > 0) {
    parts.push(`Golden periods appear at years ${peaks.map(p => p.years).join(', ')}, when cosmic energy particularly supports the bond.`);
  }

  if (challenges.length > 0) {
    parts.push(`Testing periods at years ${challenges.map(c => c.years).join(', ')} call for patience, communication, and mutual support.`);
  }

  parts.push('The arc of this relationship is not predetermined — it is a dance between destiny and choice.');

  return parts.join(' ');
}

/**
 * Build life stage advice
 */
function buildLifeStageAdvice(phases: DestinyPhase[]): DestinyArc['lifeStageAdvice'] {
  const early = phases.find(p => p.name === 'Foundation');
  const middle = phases.find(p => p.name === 'Development');
  const mature = phases.find(p => p.name === 'Harvest');

  return {
    early: early
      ? `During the foundation years: ${early.keyLessons.join(', ')}. Watch for: ${early.cautions[0]}.`
      : 'Build trust, establish healthy patterns, and learn each other deeply. Avoid rushing.',
    middle: middle
      ? `During the development years: ${middle.keyLessons.join(', ')}. Watch for: ${middle.cautions[0]}.`
      : 'Deepen commitment, navigate challenges together, and build lasting foundations.',
    mature: mature
      ? `During the harvest years: ${mature.keyLessons.join(', ')}. Watch for: ${mature.cautions[0]}.`
      : 'Integrate wisdom, enjoy the fruits of your journey, and deepen spiritual connection.'
  };
}

// ============================================================================
// KARMIC SIGNATURE EXTRACTION
// ============================================================================

/**
 * Extract the Karmic Signature from Shen Sha and synastry
 */
export function extractKarmicSignature(
  shenSha: CompositeShenSha[],
  _synastry?: SynastryHeatmap
): KarmicSignature {
  const patterns = buildKarmicPatterns(shenSha);
  const soulContract = buildSoulContract(patterns);
  const ancestralTheme = buildAncestralTheme(shenSha);
  const spiritualGift = findSpiritualGift(patterns);
  const karmicLesson = findKarmicLesson(patterns);

  const overallNarrative = buildKarmicNarrative(patterns, soulContract);

  return {
    title: 'The Soul Agreement',
    chineseTitle: '灵魂契约',
    overallNarrative,
    patterns,
    soulContract,
    ancestralTheme,
    spiritualGift,
    karmicLesson
  };
}

/**
 * Build karmic patterns from Shen Sha
 */
function buildKarmicPatterns(shenSha: CompositeShenSha[]): KarmicPattern[] {
  const patterns: KarmicPattern[] = [];

  for (const sha of shenSha) {
    const karmicInfo = SHENSHA_KARMIC[sha.chineseName];
    if (karmicInfo) {
      patterns.push(karmicInfo);
    } else {
      // Generic pattern for unknown Shen Sha
      patterns.push({
        name: sha.name,
        chineseName: sha.chineseName,
        nature: sha.nature === 'auspicious' ? 'blessing' : sha.nature === 'inauspicious' ? 'challenge' : 'mystery',
        description: sha.relationshipMeaning,
        pastLifeHint: 'This pattern carries echoes from previous connections.',
        currentLifePurpose: `To work with the energy of ${sha.name} in this relationship.`
      });
    }
  }

  return patterns;
}

/**
 * Build soul contract from patterns
 */
function buildSoulContract(patterns: KarmicPattern[]): string {
  const blessings = patterns.filter(p => p.nature === 'blessing' || p.nature === 'gift');
  const lessons = patterns.filter(p => p.nature === 'lesson' || p.nature === 'challenge');

  if (blessings.length > lessons.length * 2) {
    return 'A soul contract of mutual blessing, support, and shared joy. You came together to experience love at its highest.';
  } else if (lessons.length > blessings.length * 2) {
    return 'A soul contract of mutual growth through challenge. You came together to heal, transform, and transcend limitations.';
  } else if (blessings.length > 0 && lessons.length > 0) {
    return 'A soul contract balancing blessing and lesson. You came together to both enjoy love\'s gifts and grow through its tests.';
  } else {
    return 'A soul contract of mystery and discovery. Your karmic connection unfolds through lived experience.';
  }
}

/**
 * Build ancestral theme
 */
function buildAncestralTheme(shenSha: CompositeShenSha[]): string {
  const hasRomantic = shenSha.some(s => s.chineseName === '红鸾' || s.chineseName === '天喜');
  const hasNobleman = shenSha.some(s => s.chineseName === '天乙贵人');
  const hasAcademic = shenSha.some(s => s.chineseName === '文昌');
  const hasGeneral = shenSha.some(s => s.chineseName === '将星');
  const hasChallenging = shenSha.some(s => s.nature === 'inauspicious');

  if (hasRomantic && hasNobleman) {
    return 'Your ancestral lineages carry patterns of fated love and noble protection. This bond may heal generational relationship wounds.';
  } else if (hasAcademic && hasGeneral) {
    return 'Your ancestral lineages carry patterns of wisdom and leadership. This bond may fulfill a collective mission.';
  } else if (hasChallenging) {
    return 'Your ancestral lineages may carry patterns requiring healing. This bond offers opportunity for generational transformation.';
  } else if (hasRomantic) {
    return 'Your ancestral lineages carry the thread of romantic destiny. This bond continues a story written long ago.';
  } else {
    return 'Your ancestral lineages intersect in this moment, bringing together unique gifts and wisdom for this bond.';
  }
}

/**
 * Find spiritual gift from patterns
 */
function findSpiritualGift(patterns: KarmicPattern[]): string {
  const gifts = patterns.filter(p => p.nature === 'blessing' || p.nature === 'gift');

  if (gifts.length === 0) {
    return 'The spiritual gift of this relationship is the opportunity for growth and transformation through love.';
  }

  const giftNames = gifts.map(g => g.name).slice(0, 3).join(', ');
  return `The spiritual gifts of this relationship include ${giftNames}. These blessings flow naturally when the bond is honored.`;
}

/**
 * Find karmic lesson from patterns
 */
function findKarmicLesson(patterns: KarmicPattern[]): string {
  const lessons = patterns.filter(p => p.nature === 'lesson' || p.nature === 'challenge');

  if (lessons.length === 0) {
    return 'The karmic lesson is to fully receive and appreciate the blessings of this connection without taking them for granted.';
  }

  const lessonPattern = lessons[0];
  return `The primary karmic lesson involves ${lessonPattern.name.toLowerCase()}: ${lessonPattern.currentLifePurpose}`;
}

/**
 * Build karmic narrative
 */
function buildKarmicNarrative(patterns: KarmicPattern[], soulContract: string): string {
  const parts: string[] = [];

  parts.push('Beyond the visible patterns of compatibility lies a deeper dimension — the karmic signature of this bond.');

  parts.push(soulContract);

  if (patterns.length > 0) {
    const patternNames = patterns.slice(0, 3).map(p => `${p.chineseName} (${p.name})`).join(', ');
    parts.push(`Key karmic markers include: ${patternNames}.`);
  }

  // Past life hint from first pattern
  if (patterns.length > 0) {
    parts.push(patterns[0].pastLifeHint);
  }

  parts.push('This karmic signature is not fate — it is an invitation. How you respond shapes the story.');

  return parts.join(' ');
}

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

/**
 * Extract complete Life Themes from composite chart and related data
 */
export function extractLifeThemes(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  trajectory?: TrajectoryCurve
): LifeThemes {
  // Extract each theme layer
  const essence = extractEssenceTheme(composite.dayMaster, composite.elementDistribution);
  const dynamics = extractDynamicTheme(composite.tenGods, composite.usefulGod);
  const shadow = extractShadowTheme(composite.elementDistribution, composite.usefulGod);
  const destinyArc = extractDestinyArc(composite.luckPillars, trajectory);
  const karmic = extractKarmicSignature(composite.shenSha, synastry);

  // Build summary elements
  const oneLineSummary = buildOneLineSummary(essence, dynamics, karmic);
  const mythicArchetype = `${essence.archetype} on the ${dynamics.movementPattern} path`;
  const relationshipMedicine = buildRelationshipMedicine(shadow, karmic);

  return {
    essence,
    dynamics,
    shadow,
    destinyArc,
    karmic,
    oneLineSummary,
    mythicArchetype,
    relationshipMedicine,
    computedAt: new Date().toISOString(),
    personAName: composite.personAName,
    personBName: composite.personBName
  };
}

/**
 * Build one-line summary
 */
function buildOneLineSummary(
  essence: EssenceTheme,
  dynamics: DynamicTheme,
  karmic: KarmicSignature
): string {
  const blessings = karmic.patterns.filter(p => p.nature === 'blessing' || p.nature === 'gift');
  const hasBlessings = blessings.length > 0;

  if (hasBlessings) {
    return `${essence.archetype} — a ${dynamics.movementPattern} bond blessed with ${blessings[0].name.toLowerCase()}.`;
  } else {
    return `${essence.archetype} — a ${dynamics.movementPattern} bond with deep growth potential.`;
  }
}

/**
 * Build relationship medicine
 */
function buildRelationshipMedicine(shadow: ShadowTheme, karmic: KarmicSignature): string {
  const lessons = karmic.patterns.filter(p => p.nature === 'lesson' || p.nature === 'challenge');

  if (lessons.length > 0) {
    return `The medicine for this relationship is addressing ${shadow.shadowPattern.toLowerCase()} through ${lessons[0].currentLifePurpose.toLowerCase()}.`;
  } else {
    return `The medicine for this relationship is ${shadow.healingPath.toLowerCase()}.`;
  }
}

// ============================================================================
// STORY FORMATTERS
// ============================================================================

/**
 * Format Life Themes as narrative story
 */
export function formatLifeThemesStory(themes: LifeThemes): string {
  const lines: string[] = [];

  lines.push(`## Life Themes (人生主题)`);
  lines.push(`### ${themes.personAName} & ${themes.personBName}`);
  lines.push('');

  // One-line summary
  lines.push(`*${themes.oneLineSummary}*`);
  lines.push('');

  // Essence Theme
  lines.push(`### Essence Theme — The Soul of the Relationship`);
  lines.push(`**${themes.essence.title}** (${themes.essence.chineseTitle})`);
  lines.push('');
  lines.push(themes.essence.narrative);
  lines.push('');
  lines.push(`*Keywords: ${themes.essence.keywords.join(', ')}*`);
  lines.push('');

  // Dynamic Theme
  lines.push(`### Dynamic Theme — How the Relationship Moves`);
  lines.push(`**${themes.dynamics.title}** (${themes.dynamics.chineseTitle})`);
  lines.push('');
  lines.push(themes.dynamics.narrative);
  lines.push('');
  lines.push(`**Growth Areas:**`);
  for (const area of themes.dynamics.growthAreas) {
    lines.push(`- ${area}`);
  }
  lines.push('');
  lines.push(`**Optimal Activities:** ${themes.dynamics.optimalActivities.join(', ')}`);
  lines.push('');

  // Shadow Theme
  lines.push(`### Shadow Theme — The Recurring Challenge`);
  lines.push(`**${themes.shadow.title}** (${themes.shadow.chineseTitle})`);
  lines.push('');
  lines.push(themes.shadow.narrative);
  lines.push('');
  lines.push(`**Triggers:** ${themes.shadow.triggers.join(', ')}`);
  lines.push('');
  lines.push(`**Integration Advice:** ${themes.shadow.integrationAdvice}`);
  lines.push('');

  // Destiny Arc
  lines.push(`### Destiny Arc — The Long Storyline`);
  lines.push(`**${themes.destinyArc.title}** (${themes.destinyArc.chineseTitle})`);
  lines.push('');
  lines.push(themes.destinyArc.overallNarrative);
  lines.push('');

  if (themes.destinyArc.peakPeriods.length > 0) {
    lines.push(`**Golden Periods:**`);
    for (const peak of themes.destinyArc.peakPeriods) {
      lines.push(`- Years ${peak.years}: ${peak.description}`);
    }
    lines.push('');
  }

  if (themes.destinyArc.challengingPeriods.length > 0) {
    lines.push(`**Testing Periods:**`);
    for (const challenge of themes.destinyArc.challengingPeriods) {
      lines.push(`- Years ${challenge.years}: ${challenge.description}`);
    }
    lines.push('');
  }

  lines.push(`**Life Stage Guidance:**`);
  lines.push(`- *Early:* ${themes.destinyArc.lifeStageAdvice.early}`);
  lines.push(`- *Middle:* ${themes.destinyArc.lifeStageAdvice.middle}`);
  lines.push(`- *Mature:* ${themes.destinyArc.lifeStageAdvice.mature}`);
  lines.push('');

  // Karmic Signature
  lines.push(`### Karmic Signature — The Deeper Pattern`);
  lines.push(`**${themes.karmic.title}** (${themes.karmic.chineseTitle})`);
  lines.push('');
  lines.push(themes.karmic.overallNarrative);
  lines.push('');

  if (themes.karmic.patterns.length > 0) {
    lines.push(`**Karmic Patterns:**`);
    for (const pattern of themes.karmic.patterns) {
      const icon = pattern.nature === 'blessing' ? '✧' :
                   pattern.nature === 'gift' ? '✦' :
                   pattern.nature === 'challenge' ? '◇' : '○';
      lines.push(`- ${icon} **${pattern.chineseName} (${pattern.name})**: ${pattern.description}`);
    }
    lines.push('');
  }

  lines.push(`**Soul Contract:** ${themes.karmic.soulContract}`);
  lines.push('');
  lines.push(`**Ancestral Theme:** ${themes.karmic.ancestralTheme}`);
  lines.push('');
  lines.push(`**Spiritual Gift:** ${themes.karmic.spiritualGift}`);
  lines.push('');
  lines.push(`**Karmic Lesson:** ${themes.karmic.karmicLesson}`);
  lines.push('');

  // Closing
  lines.push(`---`);
  lines.push(`**Mythic Archetype:** ${themes.mythicArchetype}`);
  lines.push('');
  lines.push(`**Relationship Medicine:** ${themes.relationshipMedicine}`);

  return lines.join('\n');
}

/**
 * Format for UI display (structured data)
 */
export function formatLifeThemesForUI(themes: LifeThemes): {
  summary: { oneLine: string; archetype: string; medicine: string };
  essence: { title: string; titleChinese: string; narrative: string; keywords: string[] };
  dynamics: { title: string; titleChinese: string; narrative: string; growthAreas: string[]; activities: string[] };
  shadow: { title: string; titleChinese: string; narrative: string; triggers: string[]; healing: string };
  destiny: { narrative: string; peaks: Array<{ years: string; desc: string }>; challenges: Array<{ years: string; desc: string }>; advice: { early: string; middle: string; mature: string } };
  karmic: { narrative: string; patterns: Array<{ name: string; chinese: string; nature: string; desc: string }>; soulContract: string; gift: string; lesson: string };
} {
  return {
    summary: {
      oneLine: themes.oneLineSummary,
      archetype: themes.mythicArchetype,
      medicine: themes.relationshipMedicine
    },
    essence: {
      title: themes.essence.title,
      titleChinese: themes.essence.chineseTitle,
      narrative: themes.essence.narrative,
      keywords: themes.essence.keywords
    },
    dynamics: {
      title: themes.dynamics.title,
      titleChinese: themes.dynamics.chineseTitle,
      narrative: themes.dynamics.narrative,
      growthAreas: themes.dynamics.growthAreas,
      activities: themes.dynamics.optimalActivities
    },
    shadow: {
      title: themes.shadow.title,
      titleChinese: themes.shadow.chineseTitle,
      narrative: themes.shadow.narrative,
      triggers: themes.shadow.triggers,
      healing: themes.shadow.integrationAdvice
    },
    destiny: {
      narrative: themes.destinyArc.overallNarrative,
      peaks: themes.destinyArc.peakPeriods.map(p => ({ years: p.years, desc: p.description })),
      challenges: themes.destinyArc.challengingPeriods.map(c => ({ years: c.years, desc: c.description })),
      advice: themes.destinyArc.lifeStageAdvice
    },
    karmic: {
      narrative: themes.karmic.overallNarrative,
      patterns: themes.karmic.patterns.map(p => ({
        name: p.name,
        chinese: p.chineseName,
        nature: p.nature,
        desc: p.description
      })),
      soulContract: themes.karmic.soulContract,
      gift: themes.karmic.spiritualGift,
      lesson: themes.karmic.karmicLesson
    }
  };
}

/**
 * Format brief summary for cards/previews
 */
export function formatLifeThemesBrief(themes: LifeThemes): string {
  return `**${themes.essence.archetype}**

${themes.oneLineSummary}

*Essence:* ${themes.essence.coreElement} ${themes.essence.corePolarity} — ${themes.essence.keywords.slice(0, 3).join(', ')}

*Dynamic:* ${themes.dynamics.primaryDriver} drives ${themes.dynamics.movementPattern}

*Shadow:* ${themes.shadow.shadowPattern} when ${themes.shadow.triggers[0]}

*Gift:* ${themes.karmic.patterns.filter(p => p.nature === 'blessing' || p.nature === 'gift')[0]?.name || 'Growth through love'}`;
}

// All functions are exported inline with 'export' keyword
