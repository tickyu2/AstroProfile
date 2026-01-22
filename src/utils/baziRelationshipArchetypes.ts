/**
 * ============================================================================
 * BAZI RELATIONSHIP ARCHETYPES ENGINE (关系原型)
 * ============================================================================
 *
 * The mythic, archetypal layer where the relationship becomes a story-being,
 * an archetype, a living pattern of meaning.
 *
 * This module maps composite charts, synastry, and life themes into one of
 * 12 classical relationship archetypes — symbolic patterns that transcend
 * the technical and enter the mythic.
 *
 * The 12 Classical Relationship Archetypes:
 * 1. The Sacred Grove (神木之缘) - Wood growth & healing
 * 2. The Twin Flames (双火之契) - Fire passion & transformation
 * 3. The Mountain Pact (山盟之契) - Earth stability & commitment
 * 4. The Metal Mirror (金镜之缘) - Metal clarity & refinement
 * 5. The River Bond (水流之契) - Water depth & intuition
 * 6. The Phoenix Union (凤火之缘) - Rebirth & renewal
 * 7. The Builder's Alliance (土木之盟) - Construction & legacy
 * 8. The Prosperity Pair (财星之契) - Wealth & material growth
 * 9. The Scholar's Bond (文昌之缘) - Learning & intellect
 * 10. The Nobleman Union (贵人之契) - Protection & fate
 * 11. The Karmic Mirror (因缘之镜) - Shadow work & transformation
 * 12. The Destiny Weavers (命织之缘) - Interwoven life paths
 *
 * Based on: Classical 命理 archetypal mapping
 * Aligned with: Jungian symbolic interpretation
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

import type { SynastryHeatmap } from './baziSynastryHeatmap';

import type { LifeThemes } from './baziLifeThemes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

/**
 * Archetype identifier
 */
export type ArchetypeId =
  | 'sacred_grove'
  | 'twin_flames'
  | 'mountain_pact'
  | 'metal_mirror'
  | 'river_bond'
  | 'phoenix_union'
  | 'builders_alliance'
  | 'prosperity_pair'
  | 'scholars_bond'
  | 'nobleman_union'
  | 'karmic_mirror'
  | 'destiny_weavers';

/**
 * Archetype definition
 */
export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: string;
  chineseName: string;
  element: ElementName | 'Mixed';
  theme: string;
  signature: string;
  keywords: string[];
  strengths: string[];
  challenges: string[];
  growthPath: string;
  mythicImage: string;
  affirmation: string;
}

/**
 * Archetype score result
 */
export interface ArchetypeScore {
  id: ArchetypeId;
  score: number;
  matchFactors: string[];
}

/**
 * Complete archetype analysis
 */
export interface RelationshipArchetypeResult {
  primary: ArchetypeDefinition;
  primaryScore: number;
  primaryMatchFactors: string[];

  secondary: ArchetypeDefinition;
  secondaryScore: number;
  secondaryMatchFactors: string[];

  tertiary: ArchetypeDefinition | null;
  tertiaryScore: number;

  allScores: ArchetypeScore[];

  interpretation: string;
  mythicNarrative: string;
  elementalSignature: string;
  karmicPattern: string;
  growthOpportunity: string;

  computedAt: string;
}

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

/**
 * The 12 Classical Relationship Archetypes
 */
export const ARCHETYPE_DEFINITIONS: Record<ArchetypeId, ArchetypeDefinition> = {
  sacred_grove: {
    id: 'sacred_grove',
    name: 'The Sacred Grove',
    chineseName: '神木之缘',
    element: 'Wood',
    theme: 'Growth, healing, emotional resonance',
    signature: 'Gentle expansion, shared evolution',
    keywords: ['growth', 'healing', 'nurturing', 'evolution', 'sensitivity', 'flexibility'],
    strengths: [
      'Deep emotional understanding',
      'Capacity for mutual healing',
      'Continuous growth together',
      'Flexibility in the face of challenges',
      'Natural communication flow'
    ],
    challenges: [
      'May avoid necessary confrontation',
      'Can become too intertwined',
      'Risk of enabling unhealthy patterns',
      'May lack decisive action'
    ],
    growthPath: 'Learn to maintain individual identity while growing together. Practice healthy boundaries alongside deep connection.',
    mythicImage: 'Two trees whose roots intertwine beneath the earth while their branches reach separately toward the sky.',
    affirmation: 'We grow together, our roots deepening as our branches reach for light.'
  },

  twin_flames: {
    id: 'twin_flames',
    name: 'The Twin Flames',
    chineseName: '双火之契',
    element: 'Fire',
    theme: 'Passion, visibility, transformation',
    signature: 'Intensity, creativity, shared purpose',
    keywords: ['passion', 'intensity', 'creativity', 'visibility', 'transformation', 'purpose'],
    strengths: [
      'Powerful mutual attraction',
      'Shared creative energy',
      'Capacity for great achievements',
      'Inspirational presence together',
      'Transformative love'
    ],
    challenges: [
      'Risk of burnout from intensity',
      'May compete for attention',
      'Can be volatile during conflicts',
      'May exhaust each other'
    ],
    growthPath: 'Learn to balance passion with peace. Create space for quiet intimacy alongside visible achievements.',
    mythicImage: 'Two flames that dance together, sometimes merging into one brilliant light, sometimes flickering separately.',
    affirmation: 'Our passion illuminates each other and lights the way for others.'
  },

  mountain_pact: {
    id: 'mountain_pact',
    name: 'The Mountain Pact',
    chineseName: '山盟之契',
    element: 'Earth',
    theme: 'Stability, duty, long-term commitment',
    signature: 'Reliability, shared responsibility',
    keywords: ['stability', 'commitment', 'loyalty', 'duty', 'reliability', 'endurance'],
    strengths: [
      'Rock-solid commitment',
      'Practical partnership',
      'Long-term thinking',
      'Reliable presence for each other',
      'Strong family orientation'
    ],
    challenges: [
      'May become too routine',
      'Risk of emotional stagnation',
      'Can prioritize duty over joy',
      'May resist necessary change'
    ],
    growthPath: 'Learn to keep the spark alive within stability. Embrace adventure alongside reliability.',
    mythicImage: 'Two mountains standing side by side, weathering all seasons together, unmoved by storms.',
    affirmation: 'We stand together, our commitment as enduring as the mountains.'
  },

  metal_mirror: {
    id: 'metal_mirror',
    name: 'The Metal Mirror',
    chineseName: '金镜之缘',
    element: 'Metal',
    theme: 'Clarity, refinement, truth',
    signature: 'Mutual sharpening, honesty, precision',
    keywords: ['clarity', 'truth', 'refinement', 'precision', 'honesty', 'excellence'],
    strengths: [
      'Radical honesty and transparency',
      'Mutual improvement and refinement',
      'High standards together',
      'Clear communication',
      'Elegant partnership'
    ],
    challenges: [
      'Can be overly critical',
      'May wound with sharp words',
      'Risk of perfectionism',
      'May struggle with emotional messiness'
    ],
    growthPath: 'Learn to soften sharpness with compassion. Balance truth-telling with tenderness.',
    mythicImage: 'Two polished mirrors reflecting each other\'s light, revealing truth with brilliant clarity.',
    affirmation: 'We reflect each other\'s truth and polish each other\'s brilliance.'
  },

  river_bond: {
    id: 'river_bond',
    name: 'The River Bond',
    chineseName: '水流之契',
    element: 'Water',
    theme: 'Depth, intuition, emotional fusion',
    signature: 'Psychic connection, fluidity',
    keywords: ['depth', 'intuition', 'emotion', 'fluidity', 'mystery', 'connection'],
    strengths: [
      'Deep emotional intimacy',
      'Intuitive understanding',
      'Adaptability together',
      'Rich inner life shared',
      'Psychic-like connection'
    ],
    challenges: [
      'May drown in emotions',
      'Risk of losing boundaries',
      'Can be overwhelmed by feelings',
      'May struggle with practical matters'
    ],
    growthPath: 'Learn to navigate emotional depths without drowning. Build practical foundations alongside spiritual connection.',
    mythicImage: 'Two rivers merging into one, flowing together toward the ocean of consciousness.',
    affirmation: 'We flow together, our depths merging in the great ocean of love.'
  },

  phoenix_union: {
    id: 'phoenix_union',
    name: 'The Phoenix Union',
    chineseName: '凤火之缘',
    element: 'Fire',
    theme: 'Renewal, rebirth, shared destiny',
    signature: 'Rising together after challenges',
    keywords: ['rebirth', 'renewal', 'transformation', 'destiny', 'resilience', 'rising'],
    strengths: [
      'Capacity to overcome any challenge',
      'Transformative love',
      'Ability to reinvent the relationship',
      'Strong comeback energy',
      'Destined feeling'
    ],
    challenges: [
      'May create drama for transformation',
      'Risk of cycles of destruction/rebuilding',
      'Can be exhausting',
      'May not appreciate stable times'
    ],
    growthPath: 'Learn to transform without burning down. Embrace evolution alongside stability.',
    mythicImage: 'Two phoenixes rising together from shared ashes, their wings creating a single flame.',
    affirmation: 'From every ending we rise stronger, our love reborn in greater beauty.'
  },

  builders_alliance: {
    id: 'builders_alliance',
    name: 'The Builder\'s Alliance',
    chineseName: '土木之盟',
    element: 'Earth',
    theme: 'Construction, stability, shared projects',
    signature: 'Building a life together',
    keywords: ['building', 'construction', 'legacy', 'projects', 'foundation', 'creation'],
    strengths: [
      'Excellent at manifesting together',
      'Strong practical partnership',
      'Ability to create lasting legacy',
      'Shared vision for the future',
      'Complementary skills'
    ],
    challenges: [
      'May focus too much on doing vs. being',
      'Risk of becoming business partners only',
      'Can neglect emotional intimacy',
      'May define success too narrowly'
    ],
    growthPath: 'Learn to build inner connection alongside outer achievements. Value being together as much as doing together.',
    mythicImage: 'Two master builders constructing a temple together, each knowing their role perfectly.',
    affirmation: 'Together we build something greater than either could create alone.'
  },

  prosperity_pair: {
    id: 'prosperity_pair',
    name: 'The Prosperity Pair',
    chineseName: '财星之契',
    element: 'Mixed',
    theme: 'Material growth, shared ambition',
    signature: 'Business partnership + romance',
    keywords: ['prosperity', 'abundance', 'ambition', 'success', 'wealth', 'achievement'],
    strengths: [
      'Excellent at creating abundance',
      'Strong shared ambition',
      'Mutual support for success',
      'Financial harmony',
      'Goal-oriented partnership'
    ],
    challenges: [
      'May prioritize wealth over love',
      'Risk of competitive dynamics',
      'Can neglect non-material needs',
      'May measure love in achievements'
    ],
    growthPath: 'Learn to value inner riches alongside outer wealth. Cultivate spiritual abundance.',
    mythicImage: 'Two golden fish swimming together, attracting abundance wherever they go.',
    affirmation: 'Together we attract abundance, our shared vision manifesting prosperity.'
  },

  scholars_bond: {
    id: 'scholars_bond',
    name: 'The Scholar\'s Bond',
    chineseName: '文昌之缘',
    element: 'Mixed',
    theme: 'Learning, intellectual intimacy',
    signature: 'Growth through knowledge',
    keywords: ['learning', 'intellect', 'wisdom', 'study', 'teaching', 'discovery'],
    strengths: [
      'Deep intellectual connection',
      'Continuous learning together',
      'Shared love of knowledge',
      'Mental stimulation',
      'Wisdom cultivation'
    ],
    challenges: [
      'May intellectualize emotions',
      'Risk of being too "in the head"',
      'Can debate instead of connect',
      'May neglect physical/emotional intimacy'
    ],
    growthPath: 'Learn to balance head and heart. Let wisdom serve love, not replace it.',
    mythicImage: 'Two scholars studying the same scroll, their minds meeting in the space between words.',
    affirmation: 'Together we seek wisdom, our minds dancing in the joy of discovery.'
  },

  nobleman_union: {
    id: 'nobleman_union',
    name: 'The Nobleman Union',
    chineseName: '贵人之契',
    element: 'Mixed',
    theme: 'Protection, fate, guidance',
    signature: 'A relationship that feels "helped"',
    keywords: ['protection', 'fate', 'guidance', 'nobility', 'blessing', 'guardian'],
    strengths: [
      'Feels destined and protected',
      'Mutual guardian energy',
      'Attracts helpful circumstances',
      'Noble quality to the bond',
      'Elevated purpose'
    ],
    challenges: [
      'May expect constant good fortune',
      'Risk of passivity ("fate will handle it")',
      'Can feel pressure to be "noble"',
      'May not develop resilience'
    ],
    growthPath: 'Learn to co-create with destiny. Be active participants in your blessed fortune.',
    mythicImage: 'Two noble beings recognizing each other across lifetimes, their reunion blessed by heaven.',
    affirmation: 'We are each other\'s noble guardian, blessed by forces greater than ourselves.'
  },

  karmic_mirror: {
    id: 'karmic_mirror',
    name: 'The Karmic Mirror',
    chineseName: '因缘之镜',
    element: 'Mixed',
    theme: 'Shadow work, transformation',
    signature: 'Deep karmic lessons',
    keywords: ['karma', 'shadow', 'transformation', 'healing', 'mirror', 'awakening'],
    strengths: [
      'Profound growth potential',
      'Deep soul-level connection',
      'Capacity for transformation',
      'Healing of old patterns',
      'Awakening through relationship'
    ],
    challenges: [
      'Can be intensely challenging',
      'May trigger deep wounds',
      'Risk of staying for karma only',
      'Can feel like constant work'
    ],
    growthPath: 'Learn to embrace the mirror while maintaining self-love. Transform without losing yourself.',
    mythicImage: 'Two mirrors facing each other, reflecting infinite depths where shadow becomes light.',
    affirmation: 'We mirror each other\'s depths, transforming shadow into wisdom.'
  },

  destiny_weavers: {
    id: 'destiny_weavers',
    name: 'The Destiny Weavers',
    chineseName: '命织之缘',
    element: 'Mixed',
    theme: 'Shared life path',
    signature: 'Two destinies interwoven',
    keywords: ['destiny', 'weaving', 'path', 'journey', 'alignment', 'purpose'],
    strengths: [
      'Deep alignment of life paths',
      'Synchronized timing',
      'Mutual destiny fulfillment',
      'Shared life purpose',
      'Natural flow together'
    ],
    challenges: [
      'May lose individual destiny',
      'Risk of over-dependence',
      'Can feel fated rather than chosen',
      'May not appreciate the choice aspect'
    ],
    growthPath: 'Learn to weave destinies while honoring individual threads. Choose the fate you\'re given.',
    mythicImage: 'Two threads being woven by cosmic hands into a single tapestry of meaning.',
    affirmation: 'Our destinies weave together, creating a tapestry neither could make alone.'
  }
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Score Wood archetype (Sacred Grove)
 */
function scoreWoodArchetype(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Day Master element
  if (dayMaster.element === 'Wood') {
    score += 35;
    matchFactors.push(`Composite DM is ${dayMaster.polarity} Wood`);
  }

  // Element distribution
  if (elementDist.dominant === 'Wood') {
    score += 25;
    matchFactors.push(`Wood is dominant element (${elementDist.Wood}%)`);
  } else if (elementDist.Wood >= 25) {
    score += 15;
    matchFactors.push(`Strong Wood presence (${elementDist.Wood}%)`);
  }

  // Water support (produces Wood)
  if (elementDist.Water >= 20) {
    score += 10;
    matchFactors.push(`Water supports Wood growth (${elementDist.Water}%)`);
  }

  // Balanced nature
  if (elementDist.balance === 'balanced') {
    score += 5;
    matchFactors.push('Balanced elemental ecosystem');
  }

  return { id: 'sacred_grove', score, matchFactors };
}

/**
 * Score Fire archetype (Twin Flames)
 */
function scoreFireArchetype(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  if (dayMaster.element === 'Fire') {
    score += 35;
    matchFactors.push(`Composite DM is ${dayMaster.polarity} Fire`);
  }

  if (elementDist.dominant === 'Fire') {
    score += 25;
    matchFactors.push(`Fire is dominant element (${elementDist.Fire}%)`);
  } else if (elementDist.Fire >= 25) {
    score += 15;
    matchFactors.push(`Strong Fire presence (${elementDist.Fire}%)`);
  }

  // Strong DM suggests intensity
  if (dayMaster.strengthCategory === 'very_strong' || dayMaster.strengthCategory === 'strong') {
    score += 10;
    matchFactors.push('Strong DM indicates intensity');
  }

  return { id: 'twin_flames', score, matchFactors };
}

/**
 * Score Earth archetype (Mountain Pact)
 */
function scoreEarthArchetype(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  if (dayMaster.element === 'Earth') {
    score += 35;
    matchFactors.push(`Composite DM is ${dayMaster.polarity} Earth`);
  }

  if (elementDist.dominant === 'Earth') {
    score += 25;
    matchFactors.push(`Earth is dominant element (${elementDist.Earth}%)`);
  } else if (elementDist.Earth >= 25) {
    score += 15;
    matchFactors.push(`Strong Earth presence (${elementDist.Earth}%)`);
  }

  // Balanced strength suggests stability
  if (dayMaster.strengthCategory === 'balanced') {
    score += 10;
    matchFactors.push('Balanced DM suggests stability');
  }

  return { id: 'mountain_pact', score, matchFactors };
}

/**
 * Score Metal archetype (Metal Mirror)
 */
function scoreMetalArchetype(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  if (dayMaster.element === 'Metal') {
    score += 35;
    matchFactors.push(`Composite DM is ${dayMaster.polarity} Metal`);
  }

  if (elementDist.dominant === 'Metal') {
    score += 25;
    matchFactors.push(`Metal is dominant element (${elementDist.Metal}%)`);
  } else if (elementDist.Metal >= 25) {
    score += 15;
    matchFactors.push(`Strong Metal presence (${elementDist.Metal}%)`);
  }

  // Yin Metal particularly suggests mirror quality
  if (dayMaster.stem === '辛') {
    score += 10;
    matchFactors.push('Yin Metal (辛) embodies mirror quality');
  }

  return { id: 'metal_mirror', score, matchFactors };
}

/**
 * Score Water archetype (River Bond)
 */
function scoreWaterArchetype(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  if (dayMaster.element === 'Water') {
    score += 35;
    matchFactors.push(`Composite DM is ${dayMaster.polarity} Water`);
  }

  if (elementDist.dominant === 'Water') {
    score += 25;
    matchFactors.push(`Water is dominant element (${elementDist.Water}%)`);
  } else if (elementDist.Water >= 25) {
    score += 15;
    matchFactors.push(`Strong Water presence (${elementDist.Water}%)`);
  }

  // Weak DM suggests depth/flow
  if (dayMaster.strengthCategory === 'weak' || dayMaster.strengthCategory === 'very_weak') {
    score += 5;
    matchFactors.push('Softer DM suggests emotional depth');
  }

  return { id: 'river_bond', score, matchFactors };
}

/**
 * Score Phoenix Union archetype
 */
function scorePhoenixArchetype(
  usefulGod: CompositeUsefulGod,
  shenSha: CompositeShenSha[],
  luckPillars: CompositeLuckPillar[]
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Fire as Useful God
  if (usefulGod.element === 'Fire') {
    score += 30;
    matchFactors.push('Fire is the Useful God');
  }

  // Romantic Shen Sha
  const hasRedMatchmaker = shenSha.some(s => s.chineseName === '红鸾');
  const hasSkyHappiness = shenSha.some(s => s.chineseName === '天喜');

  if (hasRedMatchmaker) {
    score += 15;
    matchFactors.push('Red Matchmaker (红鸾) present');
  }
  if (hasSkyHappiness) {
    score += 10;
    matchFactors.push('Sky Happiness (天喜) present');
  }

  // Challenging periods followed by excellent (rebirth pattern)
  let hasRebirthPattern = false;
  for (let i = 1; i < luckPillars.length; i++) {
    const prev = luckPillars[i - 1];
    const curr = luckPillars[i];
    if ((prev.favorability === 'challenging' || prev.favorability === 'difficult') &&
        (curr.favorability === 'excellent' || curr.favorability === 'good')) {
      hasRebirthPattern = true;
      break;
    }
  }

  if (hasRebirthPattern) {
    score += 15;
    matchFactors.push('Luck cycles show rebirth pattern');
  }

  return { id: 'phoenix_union', score, matchFactors };
}

/**
 * Score Builder's Alliance archetype
 */
function scoreBuildersArchetype(
  usefulGod: CompositeUsefulGod,
  elementDist: CompositeElementDistribution,
  tenGods: CompositeTenGods
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Earth as Useful God
  if (usefulGod.element === 'Earth') {
    score += 25;
    matchFactors.push('Earth is the Useful God');
  }

  // Strong Earth presence
  if (elementDist.Earth >= 20) {
    score += 15;
    matchFactors.push(`Solid Earth foundation (${elementDist.Earth}%)`);
  }

  // Wealth stars present (building resources)
  if (tenGods.directWealth || tenGods.indirectWealth) {
    score += 15;
    matchFactors.push('Wealth stars support building');
  }

  // Officer stars (structure)
  if (tenGods.directOfficer) {
    score += 10;
    matchFactors.push('Officer star provides structure');
  }

  // Wood + Earth combination (construction)
  if (elementDist.Wood >= 15 && elementDist.Earth >= 15) {
    score += 10;
    matchFactors.push('Wood-Earth combination supports construction');
  }

  return { id: 'builders_alliance', score, matchFactors };
}

/**
 * Score Prosperity Pair archetype
 */
function scoreProsperityArchetype(
  tenGods: CompositeTenGods,
  usefulGod: CompositeUsefulGod
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Strong Wealth stars
  const hasDirectWealth = tenGods.directWealth !== null;
  const hasIndirectWealth = tenGods.indirectWealth !== null;

  if (hasDirectWealth && hasIndirectWealth) {
    score += 30;
    matchFactors.push('Both Wealth stars present');
  } else if (hasDirectWealth || hasIndirectWealth) {
    score += 20;
    matchFactors.push('Wealth star present');
  }

  // Wealth as dominant
  if (tenGods.dominant === 'Direct Wealth' || tenGods.dominant === 'Indirect Wealth') {
    score += 25;
    matchFactors.push(`${tenGods.dominant} is dominant Ten God`);
  }

  // Useful God supports wealth accumulation
  if (usefulGod.element === 'Metal' || usefulGod.element === 'Earth') {
    score += 10;
    matchFactors.push(`${usefulGod.element} Useful God supports prosperity`);
  }

  return { id: 'prosperity_pair', score, matchFactors };
}

/**
 * Score Scholar's Bond archetype
 */
function scoreScholarsArchetype(
  shenSha: CompositeShenSha[],
  tenGods: CompositeTenGods
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Academic Star
  const hasAcademicStar = shenSha.some(s => s.chineseName === '文昌');
  if (hasAcademicStar) {
    score += 35;
    matchFactors.push('Academic Star (文昌) present');
  }

  // Resource stars (learning)
  if (tenGods.directResource || tenGods.indirectResource) {
    score += 20;
    matchFactors.push('Resource stars support learning');
  }

  // Resource as dominant
  if (tenGods.dominant === 'Direct Resource' || tenGods.dominant === 'Indirect Resource') {
    score += 15;
    matchFactors.push(`${tenGods.dominant} is dominant`);
  }

  return { id: 'scholars_bond', score, matchFactors };
}

/**
 * Score Nobleman Union archetype
 */
function scoreNoblemanArchetype(
  shenSha: CompositeShenSha[]
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Nobleman star
  const hasNobleman = shenSha.some(s => s.chineseName === '天乙贵人');
  if (hasNobleman) {
    score += 40;
    matchFactors.push('Heavenly Nobleman (天乙贵人) present');
  }

  // General Star (nobility/leadership)
  const hasGeneralStar = shenSha.some(s => s.chineseName === '将星');
  if (hasGeneralStar) {
    score += 15;
    matchFactors.push('General Star (将星) adds nobility');
  }

  // Multiple auspicious Shen Sha
  const auspiciousCount = shenSha.filter(s => s.nature === 'auspicious').length;
  if (auspiciousCount >= 3) {
    score += 15;
    matchFactors.push(`Multiple blessings (${auspiciousCount} auspicious stars)`);
  } else if (auspiciousCount >= 2) {
    score += 10;
    matchFactors.push(`Blessed with ${auspiciousCount} auspicious stars`);
  }

  return { id: 'nobleman_union', score, matchFactors };
}

/**
 * Score Karmic Mirror archetype
 */
function scoreKarmicArchetype(
  synastry?: SynastryHeatmap,
  shenSha?: CompositeShenSha[]
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  if (synastry) {
    // Flatten the 2D grid for easier iteration
    const flatGrid = synastry.grid.flat();

    // High harmony AND high tension (karmic pattern)
    const hasHighHarmony = synastry.overallScore >= 60;
    const hasHighTension = flatGrid.some(cell =>
      cell.interactions.some(i => i.type === 'clash' || i.type === 'punishment')
    );

    if (hasHighHarmony && hasHighTension) {
      score += 35;
      matchFactors.push('Strong harmony AND tension indicates karmic bond');
    }

    // Multiple clash/punishment interactions
    let conflictCount = 0;
    for (const cell of flatGrid) {
      conflictCount += cell.interactions.filter(i =>
        i.type === 'clash' || i.type === 'punishment' || i.type === 'harm'
      ).length;
    }

    if (conflictCount >= 3) {
      score += 20;
      matchFactors.push(`Multiple karmic triggers (${conflictCount} conflicts)`);
    } else if (conflictCount >= 1) {
      score += 10;
      matchFactors.push('Karmic tension present');
    }
  }

  // Challenging Shen Sha (karmic lessons)
  if (shenSha) {
    const challengingShenSha = shenSha.filter(s => s.nature === 'inauspicious');
    if (challengingShenSha.length > 0) {
      score += 15;
      matchFactors.push(`Karmic lessons via ${challengingShenSha.map(s => s.chineseName).join(', ')}`);
    }
  }

  return { id: 'karmic_mirror', score, matchFactors };
}

/**
 * Score Destiny Weavers archetype
 */
function scoreDestinyArchetype(
  luckPillars: CompositeLuckPillar[],
  themes?: LifeThemes
): ArchetypeScore {
  let score = 0;
  const matchFactors: string[] = [];

  // High luck pillar alignment
  const excellentPillars = luckPillars.filter(p =>
    p.favorability === 'excellent' || p.favorability === 'good'
  ).length;

  const alignmentRatio = excellentPillars / luckPillars.length;

  if (alignmentRatio >= 0.6) {
    score += 30;
    matchFactors.push(`High destiny alignment (${Math.round(alignmentRatio * 100)}% favorable periods)`);
  } else if (alignmentRatio >= 0.4) {
    score += 15;
    matchFactors.push(`Moderate destiny alignment (${Math.round(alignmentRatio * 100)}% favorable)`);
  }

  // Strong Useful God activation across luck pillars
  const usefulGodActive = luckPillars.filter(p => p.usefulGodActive).length;
  if (usefulGodActive >= luckPillars.length * 0.5) {
    score += 20;
    matchFactors.push(`Useful God active in ${usefulGodActive} pillars`);
  }

  // Life themes indicate interwoven paths
  if (themes) {
    const hasDestinyArc = themes.destinyArc.phases.length >= 2;
    if (hasDestinyArc) {
      score += 15;
      matchFactors.push('Multi-phase destiny arc present');
    }

    // Karmic patterns suggest destiny
    if (themes.karmic.patterns.length >= 2) {
      score += 10;
      matchFactors.push('Multiple karmic threads weaving');
    }
  }

  return { id: 'destiny_weavers', score, matchFactors };
}

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Compute relationship archetype from composite chart and related data
 */
export function computeRelationshipArchetype(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  themes?: LifeThemes
): RelationshipArchetypeResult {
  // Compute all archetype scores
  const allScores: ArchetypeScore[] = [
    scoreWoodArchetype(composite.dayMaster, composite.elementDistribution),
    scoreFireArchetype(composite.dayMaster, composite.elementDistribution),
    scoreEarthArchetype(composite.dayMaster, composite.elementDistribution),
    scoreMetalArchetype(composite.dayMaster, composite.elementDistribution),
    scoreWaterArchetype(composite.dayMaster, composite.elementDistribution),
    scorePhoenixArchetype(composite.usefulGod, composite.shenSha, composite.luckPillars),
    scoreBuildersArchetype(composite.usefulGod, composite.elementDistribution, composite.tenGods),
    scoreProsperityArchetype(composite.tenGods, composite.usefulGod),
    scoreScholarsArchetype(composite.shenSha, composite.tenGods),
    scoreNoblemanArchetype(composite.shenSha),
    scoreKarmicArchetype(synastry, composite.shenSha),
    scoreDestinyArchetype(composite.luckPillars, themes)
  ];

  // Sort by score
  allScores.sort((a, b) => b.score - a.score);

  // Get top three
  const primary = ARCHETYPE_DEFINITIONS[allScores[0].id];
  const secondary = ARCHETYPE_DEFINITIONS[allScores[1].id];
  const tertiary = allScores[2].score >= 20 ? ARCHETYPE_DEFINITIONS[allScores[2].id] : null;

  // Build interpretation
  const interpretation = buildInterpretation(primary, secondary, composite);
  const mythicNarrative = buildMythicNarrative(primary, secondary);
  const elementalSignature = buildElementalSignature(composite.dayMaster, composite.elementDistribution);
  const karmicPattern = buildKarmicPattern(primary, secondary, composite.shenSha);
  const growthOpportunity = buildGrowthOpportunity(primary, secondary);

  return {
    primary,
    primaryScore: allScores[0].score,
    primaryMatchFactors: allScores[0].matchFactors,

    secondary,
    secondaryScore: allScores[1].score,
    secondaryMatchFactors: allScores[1].matchFactors,

    tertiary,
    tertiaryScore: allScores[2]?.score || 0,

    allScores,

    interpretation,
    mythicNarrative,
    elementalSignature,
    karmicPattern,
    growthOpportunity,

    computedAt: new Date().toISOString()
  };
}

// ============================================================================
// INTERPRETATION BUILDERS
// ============================================================================

/**
 * Build interpretation from archetypes
 */
function buildInterpretation(
  primary: ArchetypeDefinition,
  secondary: ArchetypeDefinition,
  composite: CompositeChart
): string {
  const parts: string[] = [];

  parts.push(`This relationship embodies the archetype of **${primary.name}** (${primary.chineseName}).`);
  parts.push(primary.theme + '.');

  parts.push(`The secondary archetype, **${secondary.name}** (${secondary.chineseName}), adds nuance: ${secondary.signature.toLowerCase()}.`);

  // Day Master context
  parts.push(`With ${composite.dayMaster.chineseName} as the composite Day Master, the relationship expresses its archetype through ${composite.dayMaster.element.toLowerCase()} energy.`);

  // Strengths summary
  parts.push(`Core strengths include: ${primary.strengths.slice(0, 2).join(', ').toLowerCase()}.`);

  return parts.join(' ');
}

/**
 * Build mythic narrative
 */
function buildMythicNarrative(
  primary: ArchetypeDefinition,
  secondary: ArchetypeDefinition
): string {
  const parts: string[] = [];

  parts.push(`**The Mythic Story**`);
  parts.push('');
  parts.push(primary.mythicImage);
  parts.push('');

  if (primary.element !== secondary.element) {
    parts.push(`Yet within this image, another story unfolds: ${secondary.mythicImage.toLowerCase()}`);
  }

  parts.push('');
  parts.push(`*"${primary.affirmation}"*`);

  return parts.join('\n');
}

/**
 * Build elemental signature
 */
function buildElementalSignature(
  dayMaster: CompositeDayMaster,
  elementDist: CompositeElementDistribution
): string {
  const dmElement = dayMaster.element;
  const dominant = elementDist.dominant;
  const secondary = Object.entries(elementDist)
    .filter(([k, v]) => typeof v === 'number' && k !== dominant)
    .sort((a, b) => (b[1] as number) - (a[1] as number))[0][0];

  if (dmElement === dominant) {
    return `Pure ${dmElement} signature with ${secondary} undertones`;
  } else {
    return `${dmElement} core expressed through ${dominant} dominance, seasoned with ${secondary}`;
  }
}

/**
 * Build karmic pattern description
 */
function buildKarmicPattern(
  primary: ArchetypeDefinition,
  _secondary: ArchetypeDefinition,
  shenSha: CompositeShenSha[]
): string {
  const parts: string[] = [];

  // Archetype karmic implications
  if (primary.id === 'karmic_mirror') {
    parts.push('This relationship carries deep karmic work — a mirror reflecting shadow into light.');
  } else if (primary.id === 'phoenix_union') {
    parts.push('This relationship carries patterns of rebirth — transformation through love.');
  } else if (primary.id === 'nobleman_union') {
    parts.push('This relationship feels destined, protected by higher forces.');
  } else {
    parts.push(`The ${primary.name} archetype suggests karmic patterns around ${primary.keywords.slice(0, 3).join(', ')}.`);
  }

  // Shen Sha karmic indicators
  const auspicious = shenSha.filter(s => s.nature === 'auspicious');
  const challenging = shenSha.filter(s => s.nature === 'inauspicious');

  if (auspicious.length > challenging.length) {
    parts.push('Karmic blessings outweigh lessons in this bond.');
  } else if (challenging.length > auspicious.length) {
    parts.push('Karmic lessons provide growth opportunities through challenge.');
  } else {
    parts.push('Karmic blessings and lessons are balanced.');
  }

  return parts.join(' ');
}

/**
 * Build growth opportunity description
 */
function buildGrowthOpportunity(
  primary: ArchetypeDefinition,
  secondary: ArchetypeDefinition
): string {
  const parts: string[] = [];

  parts.push(primary.growthPath);

  if (secondary.element !== primary.element) {
    parts.push(`The ${secondary.name} influence suggests also: ${secondary.growthPath.toLowerCase()}`);
  }

  return parts.join(' ');
}

// ============================================================================
// STORY FORMATTERS
// ============================================================================

/**
 * Format archetype result as narrative story
 */
export function formatArchetypeStory(result: RelationshipArchetypeResult): string {
  const lines: string[] = [];

  lines.push(`## Relationship Archetype (关系原型)`);
  lines.push('');

  // Primary Archetype
  lines.push(`### Primary Archetype: ${result.primary.name} (${result.primary.chineseName})`);
  lines.push('');
  lines.push(`*${result.primary.theme}*`);
  lines.push('');
  lines.push(`**Signature:** ${result.primary.signature}`);
  lines.push('');
  lines.push(`**Match Score:** ${result.primaryScore}/100`);
  lines.push(`**Match Factors:** ${result.primaryMatchFactors.join('; ')}`);
  lines.push('');

  // Mythic Image
  lines.push(`**Mythic Image**`);
  lines.push(result.primary.mythicImage);
  lines.push('');

  // Keywords
  lines.push(`**Keywords:** ${result.primary.keywords.join(', ')}`);
  lines.push('');

  // Strengths
  lines.push(`**Strengths**`);
  for (const strength of result.primary.strengths) {
    lines.push(`- ${strength}`);
  }
  lines.push('');

  // Challenges
  lines.push(`**Challenges**`);
  for (const challenge of result.primary.challenges) {
    lines.push(`- ${challenge}`);
  }
  lines.push('');

  // Secondary Archetype
  lines.push(`### Secondary Archetype: ${result.secondary.name} (${result.secondary.chineseName})`);
  lines.push('');
  lines.push(`*${result.secondary.theme}*`);
  lines.push('');
  lines.push(`**Match Score:** ${result.secondaryScore}/100`);
  lines.push(`**Match Factors:** ${result.secondaryMatchFactors.join('; ')}`);
  lines.push('');
  lines.push(result.secondary.mythicImage);
  lines.push('');

  // Tertiary if present
  if (result.tertiary) {
    lines.push(`### Tertiary Influence: ${result.tertiary.name} (${result.tertiary.chineseName})`);
    lines.push('');
    lines.push(`*${result.tertiary.theme}* (Score: ${result.tertiaryScore})`);
    lines.push('');
  }

  // Interpretation
  lines.push(`### Interpretation`);
  lines.push('');
  lines.push(result.interpretation);
  lines.push('');

  // Elemental Signature
  lines.push(`**Elemental Signature:** ${result.elementalSignature}`);
  lines.push('');

  // Karmic Pattern
  lines.push(`**Karmic Pattern:** ${result.karmicPattern}`);
  lines.push('');

  // Growth Opportunity
  lines.push(`### Growth Path`);
  lines.push('');
  lines.push(result.growthOpportunity);
  lines.push('');

  // Affirmation
  lines.push(`### Affirmation`);
  lines.push('');
  lines.push(`*"${result.primary.affirmation}"*`);

  return lines.join('\n');
}

/**
 * Format for UI display (structured data)
 */
export function formatArchetypeForUI(result: RelationshipArchetypeResult): {
  primary: {
    name: string;
    chinese: string;
    theme: string;
    signature: string;
    score: number;
    keywords: string[];
    strengths: string[];
    challenges: string[];
    mythicImage: string;
    affirmation: string;
  };
  secondary: {
    name: string;
    chinese: string;
    theme: string;
    score: number;
    mythicImage: string;
  };
  tertiary: { name: string; chinese: string; score: number } | null;
  interpretation: string;
  elementalSignature: string;
  karmicPattern: string;
  growthPath: string;
  radarData: Array<{ archetype: string; score: number }>;
} {
  return {
    primary: {
      name: result.primary.name,
      chinese: result.primary.chineseName,
      theme: result.primary.theme,
      signature: result.primary.signature,
      score: result.primaryScore,
      keywords: result.primary.keywords,
      strengths: result.primary.strengths,
      challenges: result.primary.challenges,
      mythicImage: result.primary.mythicImage,
      affirmation: result.primary.affirmation
    },
    secondary: {
      name: result.secondary.name,
      chinese: result.secondary.chineseName,
      theme: result.secondary.theme,
      score: result.secondaryScore,
      mythicImage: result.secondary.mythicImage
    },
    tertiary: result.tertiary ? {
      name: result.tertiary.name,
      chinese: result.tertiary.chineseName,
      score: result.tertiaryScore
    } : null,
    interpretation: result.interpretation,
    elementalSignature: result.elementalSignature,
    karmicPattern: result.karmicPattern,
    growthPath: result.growthOpportunity,
    radarData: result.allScores.map(s => ({
      archetype: ARCHETYPE_DEFINITIONS[s.id].chineseName,
      score: s.score
    }))
  };
}

/**
 * Format brief summary for cards/previews
 */
export function formatArchetypeBrief(result: RelationshipArchetypeResult): string {
  return `**${result.primary.name}** (${result.primary.chineseName})

*${result.primary.signature}*

Keywords: ${result.primary.keywords.slice(0, 4).join(', ')}

Secondary: ${result.secondary.name} (${result.secondary.chineseName})

*"${result.primary.affirmation}"*`;
}

/**
 * Get archetype by ID
 */
export function getArchetypeById(id: ArchetypeId): ArchetypeDefinition {
  return ARCHETYPE_DEFINITIONS[id];
}

/**
 * Get all archetype definitions
 */
export function getAllArchetypes(): ArchetypeDefinition[] {
  return Object.values(ARCHETYPE_DEFINITIONS);
}

// All functions and constants are exported inline with 'export' keyword
