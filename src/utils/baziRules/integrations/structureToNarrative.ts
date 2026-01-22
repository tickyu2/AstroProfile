/**
 * ============================================
 * STRUCTURE TO NARRATIVE INTEGRATION
 * Map Technical Structures to Story Elements
 *
 * Transforms BaZi structural analysis into:
 * - Life narrative themes
 * - Character archetypes
 * - Story arcs
 * - Dramatic tensions
 * ============================================
 */

import { FollowStructureType, FollowStructureResult } from '../followStructure';

// ==================== TYPES ====================

export interface NarrativeTheme {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  archetype: string;
  archetypeZh: string;
  lifeQuest: string;
  lifeQuestZh: string;
  challenges: string[];
  challengesZh: string[];
  triumphs: string[];
  triumphsZh: string[];
}

export interface StoryArc {
  phase: 'beginning' | 'rising' | 'climax' | 'falling' | 'resolution';
  phaseName: string;
  phaseNameZh: string;
  description: string;
  descriptionZh: string;
  ageRange?: string;
}

export interface DramaticTension {
  source: string;
  sourceZh: string;
  nature: 'internal' | 'external' | 'cosmic';
  intensity: 'mild' | 'moderate' | 'intense';
  resolution: string;
  resolutionZh: string;
}

export interface StructureNarrative {
  structureType: string;
  theme: NarrativeTheme;
  storyArcs: StoryArc[];
  tensions: DramaticTension[];
  protagonistRole: string;
  protagonistRoleZh: string;
  supportingCast: string[];
  supportingCastZh: string[];
}

// ==================== NARRATIVE MAPPINGS ====================

const STRUCTURE_NARRATIVES: Record<string, NarrativeTheme> = {
  // Normal Structures
  'Normal': {
    id: 'normal',
    name: 'The Balanced Path',
    nameZh: '平衡之道',
    description: 'A life of steady growth and moderate fortune, with the wisdom to navigate both success and challenge.',
    descriptionZh: '稳步成长、运势平和的人生，有智慧应对成功与挑战。',
    archetype: 'The Everyman',
    archetypeZh: '普通人',
    lifeQuest: 'To find meaning through balance and harmony',
    lifeQuestZh: '通过平衡与和谐找到人生意义',
    challenges: ['Avoiding complacency', 'Finding passion', 'Standing out'],
    challengesZh: ['避免自满', '寻找热情', '脱颖而出'],
    triumphs: ['Lasting relationships', 'Sustainable success', 'Inner peace'],
    triumphsZh: ['持久的关系', '可持续的成功', '内心平静']
  },

  // Strong Day Master
  'Strong': {
    id: 'strong',
    name: 'The Hero\'s Journey',
    nameZh: '英雄之旅',
    description: 'A powerful spirit destined to lead, create, and leave a mark on the world.',
    descriptionZh: '强大的灵魂注定要领导、创造并在世界上留下印记。',
    archetype: 'The Hero',
    archetypeZh: '英雄',
    lifeQuest: 'To channel great power toward meaningful achievement',
    lifeQuestZh: '将强大力量引向有意义的成就',
    challenges: ['Overconfidence', 'Isolation', 'Finding worthy opponents'],
    challengesZh: ['过度自信', '孤立', '寻找对手'],
    triumphs: ['Leadership', 'Legacy building', 'Protecting others'],
    triumphsZh: ['领导力', '建立传承', '保护他人']
  },

  // Weak Day Master
  'Weak': {
    id: 'weak',
    name: 'The Underdog\'s Rise',
    nameZh: '弱者崛起',
    description: 'Starting from humble origins, this soul finds strength through alliance, adaptability, and wisdom.',
    descriptionZh: '从卑微的起点出发，这个灵魂通过联盟、适应性和智慧找到力量。',
    archetype: 'The Underdog',
    archetypeZh: '弱者',
    lifeQuest: 'To prove worth through cleverness and perseverance',
    lifeQuestZh: '通过聪明和毅力证明自己的价值',
    challenges: ['Self-doubt', 'Resource scarcity', 'Being overlooked'],
    challengesZh: ['自我怀疑', '资源匮乏', '被忽视'],
    triumphs: ['Unexpected success', 'Loyal allies', 'Inner resilience'],
    triumphsZh: ['意外的成功', '忠诚的盟友', '内在韧性']
  },

  // Follow Structures
  'FollowStrong': {
    id: 'follow-strong',
    name: 'The Sage\'s Surrender',
    nameZh: '智者的臣服',
    description: 'Wisdom lies not in fighting the current, but in flowing with it. This soul achieves through surrender.',
    descriptionZh: '智慧不在于对抗潮流，而在于顺势而为。这个灵魂通过臣服获得成就。',
    archetype: 'The Sage',
    archetypeZh: '智者',
    lifeQuest: 'To find power through yielding and alignment',
    lifeQuestZh: '通过顺从和协调找到力量',
    challenges: ['Maintaining identity', 'Avoiding parasitism', 'Finding purpose'],
    challengesZh: ['保持身份', '避免依赖', '寻找目的'],
    triumphs: ['Effortless achievement', 'Natural flow', 'Spiritual peace'],
    triumphsZh: ['毫不费力的成就', '自然流动', '精神平静']
  },

  'FollowWealth': {
    id: 'follow-wealth',
    name: 'The Merchant Prince',
    nameZh: '商业王子',
    description: 'Destined to flow with wealth, this soul finds meaning through material mastery.',
    descriptionZh: '注定与财富同行，这个灵魂通过物质掌控找到意义。',
    archetype: 'The Merchant',
    archetypeZh: '商人',
    lifeQuest: 'To master the flow of resources and abundance',
    lifeQuestZh: '掌握资源和丰富的流动',
    challenges: ['Materialism trap', 'Losing soul', 'Wealth fluctuations'],
    challengesZh: ['物质主义陷阱', '失去灵魂', '财富波动'],
    triumphs: ['Financial mastery', 'Generosity', 'Creating opportunity'],
    triumphsZh: ['财务掌控', '慷慨', '创造机会']
  },

  'FollowKill': {
    id: 'follow-kill',
    name: 'The Dark Knight',
    nameZh: '黑暗骑士',
    description: 'Walking a dangerous path, this soul transforms challenge into strength, opposition into opportunity.',
    descriptionZh: '走在危险的道路上，这个灵魂将挑战转化为力量，将反对转化为机会。',
    archetype: 'The Transformer',
    archetypeZh: '变革者',
    lifeQuest: 'To transform adversity into power',
    lifeQuestZh: '将逆境转化为力量',
    challenges: ['Destructive tendencies', 'Trust issues', 'Self-sabotage'],
    challengesZh: ['破坏性倾向', '信任问题', '自我破坏'],
    triumphs: ['Rebirth from ashes', 'Unlikely alliances', 'Deep transformation'],
    triumphsZh: ['浴火重生', '意外联盟', '深刻转变']
  },

  'FollowChild': {
    id: 'follow-child',
    name: 'The Creative Genius',
    nameZh: '创意天才',
    description: 'Expression is everything. This soul lives to create, inspire, and leave beauty in the world.',
    descriptionZh: '表达就是一切。这个灵魂活着就是为了创造、激励并在世界上留下美丽。',
    archetype: 'The Creator',
    archetypeZh: '创造者',
    lifeQuest: 'To express inner vision and inspire others',
    lifeQuestZh: '表达内在愿景并激励他人',
    challenges: ['Impracticality', 'Burnout', 'Recognition seeking'],
    challengesZh: ['不切实际', '倦怠', '寻求认可'],
    triumphs: ['Artistic legacy', 'Inspiring others', 'Authentic expression'],
    triumphsZh: ['艺术遗产', '激励他人', '真实表达']
  }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Map a structure type to its narrative theme
 */
export function getStructureNarrative(structureType: string): StructureNarrative {
  const theme = STRUCTURE_NARRATIVES[structureType] || STRUCTURE_NARRATIVES['Normal'];

  return {
    structureType,
    theme,
    storyArcs: generateStoryArcs(structureType),
    tensions: generateTensions(structureType),
    protagonistRole: theme.archetype,
    protagonistRoleZh: theme.archetypeZh,
    supportingCast: getSupportingCast(structureType),
    supportingCastZh: getSupportingCastZh(structureType)
  };
}

/**
 * Map follow structure result to narrative
 */
export function mapFollowToNarrative(followResult: FollowStructureResult): StructureNarrative | null {
  if (followResult.type === 'None') {
    return null;
  }

  return getStructureNarrative(followResult.type);
}

/**
 * Generate story arcs based on structure
 */
function generateStoryArcs(structureType: string): StoryArc[] {
  const baseArcs: StoryArc[] = [
    {
      phase: 'beginning',
      phaseName: 'The Awakening',
      phaseNameZh: '觉醒',
      description: 'Discovery of innate nature and initial challenges',
      descriptionZh: '发现内在本性和初始挑战',
      ageRange: '0-20'
    },
    {
      phase: 'rising',
      phaseName: 'The Ascent',
      phaseNameZh: '上升',
      description: 'Building skills, facing tests, gathering allies',
      descriptionZh: '建立技能、面对考验、聚集盟友',
      ageRange: '20-40'
    },
    {
      phase: 'climax',
      phaseName: 'The Crucible',
      phaseNameZh: '熔炉',
      description: 'Major life tests, defining moments, peak challenges',
      descriptionZh: '重大人生考验、决定性时刻、巅峰挑战',
      ageRange: '40-55'
    },
    {
      phase: 'falling',
      phaseName: 'The Integration',
      phaseNameZh: '整合',
      description: 'Harvesting wisdom, teaching others, legacy building',
      descriptionZh: '收获智慧、教导他人、建立传承',
      ageRange: '55-70'
    },
    {
      phase: 'resolution',
      phaseName: 'The Completion',
      phaseNameZh: '完成',
      description: 'Full circle, peace with journey, transcendence',
      descriptionZh: '回归圆满、与旅程和解、超越',
      ageRange: '70+'
    }
  ];

  // Customize based on structure type
  if (structureType.includes('Follow')) {
    baseArcs[0].description = 'Realizing the need to align with greater forces';
    baseArcs[0].descriptionZh = '意识到需要与更大力量协调';
    baseArcs[2].description = 'The test of maintaining surrender under pressure';
    baseArcs[2].descriptionZh = '在压力下保持顺从的考验';
  }

  return baseArcs;
}

/**
 * Generate dramatic tensions based on structure
 */
function generateTensions(structureType: string): DramaticTension[] {
  const tensions: DramaticTension[] = [];

  if (structureType === 'Strong') {
    tensions.push({
      source: 'Excess Power',
      sourceZh: '过剩力量',
      nature: 'internal',
      intensity: 'intense',
      resolution: 'Channel energy into creation rather than destruction',
      resolutionZh: '将能量引导到创造而非破坏'
    });
  }

  if (structureType === 'Weak') {
    tensions.push({
      source: 'Resource Scarcity',
      sourceZh: '资源匮乏',
      nature: 'external',
      intensity: 'moderate',
      resolution: 'Build alliances and leverage timing',
      resolutionZh: '建立联盟并利用时机'
    });
  }

  if (structureType.includes('Follow')) {
    tensions.push({
      source: 'Identity vs. Surrender',
      sourceZh: '身份与臣服',
      nature: 'internal',
      intensity: 'intense',
      resolution: 'Find authentic self within the yielding',
      resolutionZh: '在顺从中找到真实自我'
    });
    tensions.push({
      source: 'Pattern Disruption',
      sourceZh: '格局破坏',
      nature: 'cosmic',
      intensity: 'intense',
      resolution: 'Maintain alignment during challenging transits',
      resolutionZh: '在困难运势中保持协调'
    });
  }

  // Universal tension
  tensions.push({
    source: 'Destiny vs. Free Will',
    sourceZh: '命运与自由意志',
    nature: 'cosmic',
    intensity: 'moderate',
    resolution: 'Embrace the dance between fate and choice',
    resolutionZh: '拥抱命运与选择之间的舞蹈'
  });

  return tensions;
}

function getSupportingCast(structureType: string): string[] {
  const baseCast = ['Mentors', 'Rivals', 'Allies', 'Shadows'];

  if (structureType.includes('Follow')) {
    return ['The Dominant Force', 'Guardians of the Pattern', 'Temptations to Resist', 'Fellow Travelers'];
  }

  if (structureType === 'Strong') {
    return ['Worthy Opponents', 'Loyal Followers', 'Wise Counselors', 'The Humbled'];
  }

  if (structureType === 'Weak') {
    return ['Unexpected Helpers', 'Patient Teachers', 'Hidden Resources', 'Catalysts of Growth'];
  }

  return baseCast;
}

function getSupportingCastZh(structureType: string): string[] {
  if (structureType.includes('Follow')) {
    return ['主导力量', '格局守护者', '抵抗的诱惑', '同路人'];
  }

  if (structureType === 'Strong') {
    return ['强大对手', '忠诚追随者', '智慧顾问', '被征服者'];
  }

  if (structureType === 'Weak') {
    return ['意外的帮助者', '耐心的老师', '隐藏的资源', '成长的催化剂'];
  }

  return ['导师', '对手', '盟友', '阴影'];
}

/**
 * Generate narrative summary for a chart
 */
export function generateNarrativeSummary(
  structureType: string,
  dayMasterElement: string,
  dayMasterStrength: number
): { summary: string; summaryZh: string } {
  const narrative = getStructureNarrative(structureType);

  let summary = `Your life unfolds as "${narrative.theme.name}" - ${narrative.theme.description} `;
  summary += `As ${narrative.theme.archetype}, your quest is ${narrative.theme.lifeQuest}. `;
  summary += `Key challenges include: ${narrative.theme.challenges.join(', ')}. `;
  summary += `Your greatest triumphs await in: ${narrative.theme.triumphs.join(', ')}.`;

  let summaryZh = `您的人生展开为"${narrative.theme.nameZh}"——${narrative.theme.descriptionZh} `;
  summaryZh += `作为${narrative.theme.archetypeZh}，您的使命是${narrative.theme.lifeQuestZh}。`;
  summaryZh += `主要挑战包括：${narrative.theme.challengesZh.join('、')}。`;
  summaryZh += `您最伟大的胜利将在：${narrative.theme.triumphsZh.join('、')}。`;

  return { summary, summaryZh };
}

// ==================== EXPORTS ====================

export {
  getStructureNarrative,
  mapFollowToNarrative,
  generateStoryArcs,
  generateNarrativeSummary,
  STRUCTURE_NARRATIVES
};
