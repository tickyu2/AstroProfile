/**
 * ============================================
 * SEASONAL STRENGTH ENGINE
 * Month Commander + Elemental Seasonal Power
 *
 * Each season empowers certain elements and
 * weakens others. The Month Branch determines
 * the "Season Commander" which heavily influences
 * the entire chart's energy.
 * ============================================
 */

// ==================== TYPES ====================

export interface SeasonalStrength {
  element: string;
  strength: number;        // 0-100
  status: 'prosperous' | 'strong' | 'moderate' | 'weak' | 'dead';
  statusZh: string;
}

export interface MonthCommander {
  monthBranch: string;
  commanderElement: string;
  season: string;
  seasonZh: string;
  characteristics: string;
  characteristicsZh: string;
}

export interface SeasonalAnalysis {
  commander: MonthCommander;
  elementStrengths: SeasonalStrength[];
  prosperousElement: string;
  deadElement: string;
  interpretation: string;
  interpretationZh: string;
}

// ==================== CONSTANTS ====================

/**
 * Month Commander mapping
 * Each branch has a dominant element that "commands" the season
 */
export const MONTH_COMMANDER_MAP: Record<string, { element: string; season: string; seasonZh: string }> = {
  // Spring - Wood prospers
  'Yin': { element: 'Wood', season: 'Early Spring', seasonZh: '初春' },
  'Mao': { element: 'Wood', season: 'Mid Spring', seasonZh: '仲春' },
  'Chen': { element: 'Earth', season: 'Late Spring', seasonZh: '季春' },

  // Summer - Fire prospers
  'Si': { element: 'Fire', season: 'Early Summer', seasonZh: '初夏' },
  'Wu': { element: 'Fire', season: 'Mid Summer', seasonZh: '仲夏' },
  'Wei': { element: 'Earth', season: 'Late Summer', seasonZh: '季夏' },

  // Autumn - Metal prospers
  'Shen': { element: 'Metal', season: 'Early Autumn', seasonZh: '初秋' },
  'You': { element: 'Metal', season: 'Mid Autumn', seasonZh: '仲秋' },
  'Xu': { element: 'Earth', season: 'Late Autumn', seasonZh: '季秋' },

  // Winter - Water prospers
  'Hai': { element: 'Water', season: 'Early Winter', seasonZh: '初冬' },
  'Zi': { element: 'Water', season: 'Mid Winter', seasonZh: '仲冬' },
  'Chou': { element: 'Earth', season: 'Late Winter', seasonZh: '季冬' }
};

/**
 * Seasonal strength table
 * Rows: Season (by commander element)
 * Cols: Element being evaluated
 *
 * States: 旺(prosperous)=100, 相(strong)=80, 休(moderate)=50, 囚(weak)=30, 死(dead)=10
 */
const SEASONAL_STRENGTH_TABLE: Record<string, Record<string, number>> = {
  // Wood season (Spring)
  'Wood': {
    'Wood': 100,  // 旺 - Prosperous (self)
    'Fire': 80,   // 相 - Strong (produces)
    'Water': 50,  // 休 - Moderate (produced by)
    'Metal': 30,  // 囚 - Weak (controlled by)
    'Earth': 10   // 死 - Dead (controls)
  },
  // Fire season (Summer)
  'Fire': {
    'Fire': 100,
    'Earth': 80,
    'Wood': 50,
    'Water': 30,
    'Metal': 10
  },
  // Earth season (Transition periods)
  'Earth': {
    'Earth': 100,
    'Metal': 80,
    'Fire': 50,
    'Wood': 30,
    'Water': 10
  },
  // Metal season (Autumn)
  'Metal': {
    'Metal': 100,
    'Water': 80,
    'Earth': 50,
    'Fire': 30,
    'Wood': 10
  },
  // Water season (Winter)
  'Water': {
    'Water': 100,
    'Wood': 80,
    'Metal': 50,
    'Earth': 30,
    'Fire': 10
  }
};

const STATUS_MAP: Record<number, { en: string; zh: string }> = {
  100: { en: 'prosperous', zh: '旺' },
  80: { en: 'strong', zh: '相' },
  50: { en: 'moderate', zh: '休' },
  30: { en: 'weak', zh: '囚' },
  10: { en: 'dead', zh: '死' }
};

const CHARACTERISTICS: Record<string, { en: string; zh: string }> = {
  'Wood': {
    en: 'Growth, expansion, creativity, flexibility',
    zh: '生长、扩展、创造力、灵活性'
  },
  'Fire': {
    en: 'Passion, visibility, transformation, warmth',
    zh: '热情、可见性、转化、温暖'
  },
  'Earth': {
    en: 'Stability, transition, grounding, nurturing',
    zh: '稳定、过渡、扎根、滋养'
  },
  'Metal': {
    en: 'Refinement, harvest, structure, precision',
    zh: '精炼、收获、结构、精确'
  },
  'Water': {
    en: 'Rest, storage, wisdom, depth',
    zh: '休息、储藏、智慧、深度'
  }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Get the Month Commander for a given month branch
 */
export function getMonthCommander(monthBranch: string): MonthCommander {
  const info = MONTH_COMMANDER_MAP[monthBranch];

  if (!info) {
    throw new Error(`Invalid month branch: ${monthBranch}`);
  }

  return {
    monthBranch,
    commanderElement: info.element,
    season: info.season,
    seasonZh: info.seasonZh,
    characteristics: CHARACTERISTICS[info.element].en,
    characteristicsZh: CHARACTERISTICS[info.element].zh
  };
}

/**
 * Compute seasonal strength for all elements
 */
export function computeSeasonalStrength(monthBranch: string): SeasonalStrength[] {
  const commander = getMonthCommander(monthBranch);
  const table = SEASONAL_STRENGTH_TABLE[commander.commanderElement];

  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  return elements.map(element => {
    const strength = table[element];
    const statusInfo = STATUS_MAP[strength];

    return {
      element,
      strength,
      status: statusInfo.en as SeasonalStrength['status'],
      statusZh: statusInfo.zh
    };
  });
}

/**
 * Full seasonal analysis
 */
export function analyzeSeasonalInfluence(monthBranch: string): SeasonalAnalysis {
  const commander = getMonthCommander(monthBranch);
  const elementStrengths = computeSeasonalStrength(monthBranch);

  const prosperous = elementStrengths.find(e => e.strength === 100)!;
  const dead = elementStrengths.find(e => e.strength === 10)!;

  const interpretation = `Born in ${commander.season}, the ${commander.commanderElement} element dominates. ` +
    `${prosperous.element} is at peak strength while ${dead.element} is at its weakest. ` +
    `The season favors ${commander.characteristics}.`;

  const interpretationZh = `出生于${commander.seasonZh}，${getElementZh(commander.commanderElement)}主令。` +
    `${getElementZh(prosperous.element)}最旺而${getElementZh(dead.element)}最弱。` +
    `当季有利于${commander.characteristicsZh}。`;

  return {
    commander,
    elementStrengths,
    prosperousElement: prosperous.element,
    deadElement: dead.element,
    interpretation,
    interpretationZh
  };
}

/**
 * Get strength of a specific element in a given season
 */
export function getElementSeasonalStrength(
  element: string,
  monthBranch: string
): SeasonalStrength {
  const strengths = computeSeasonalStrength(monthBranch);
  const found = strengths.find(s => s.element === element);

  if (!found) {
    throw new Error(`Invalid element: ${element}`);
  }

  return found;
}

/**
 * Check if an element is in season (prosperous or strong)
 */
export function isElementInSeason(element: string, monthBranch: string): boolean {
  const strength = getElementSeasonalStrength(element, monthBranch);
  return strength.strength >= 80;
}

/**
 * Check if an element is out of season (weak or dead)
 */
export function isElementOutOfSeason(element: string, monthBranch: string): boolean {
  const strength = getElementSeasonalStrength(element, monthBranch);
  return strength.strength <= 30;
}

/**
 * Calculate seasonal modifier for Day Master strength
 */
export function calculateSeasonalModifier(
  dayMasterElement: string,
  monthBranch: string
): { modifier: number; description: string; descriptionZh: string } {
  const strength = getElementSeasonalStrength(dayMasterElement, monthBranch);

  // Convert to a modifier (-40 to +40)
  const modifier = (strength.strength - 50) * 0.8;

  let description: string;
  let descriptionZh: string;

  if (strength.strength >= 100) {
    description = 'Day Master is prosperous in this season, gaining significant strength.';
    descriptionZh = '日主当令，获得显著力量。';
  } else if (strength.strength >= 80) {
    description = 'Day Master is strong in this season, well supported.';
    descriptionZh = '日主得气，支持良好。';
  } else if (strength.strength >= 50) {
    description = 'Day Master is moderate in this season, neither strong nor weak.';
    descriptionZh = '日主休囚，既不强也不弱。';
  } else if (strength.strength >= 30) {
    description = 'Day Master is weak in this season, needing support.';
    descriptionZh = '日主失令，需要支持。';
  } else {
    description = 'Day Master is at its weakest in this season.';
    descriptionZh = '日主在此季节最弱。';
  }

  return { modifier, description, descriptionZh };
}

function getElementZh(element: string): string {
  const map: Record<string, string> = {
    Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水'
  };
  return map[element] || element;
}

/**
 * Get all elements ranked by seasonal strength
 */
export function getSeasonalRanking(monthBranch: string): string[] {
  const strengths = computeSeasonalStrength(monthBranch);
  return strengths
    .sort((a, b) => b.strength - a.strength)
    .map(s => s.element);
}

/**
 * Determine best timing activities based on season
 */
export function getSeasonalActivities(monthBranch: string): {
  favorable: string[];
  unfavorable: string[];
  favorableZh: string[];
  unfavorableZh: string[];
} {
  const commander = getMonthCommander(monthBranch);

  const activities: Record<string, { fav: string[]; unfav: string[]; favZh: string[]; unfavZh: string[] }> = {
    'Wood': {
      fav: ['Starting new projects', 'Growth initiatives', 'Creative endeavors', 'Education'],
      unfav: ['Endings', 'Cutting ties', 'Rigid structures'],
      favZh: ['开始新项目', '成长计划', '创意活动', '教育'],
      unfavZh: ['结束', '断绝关系', '僵化结构']
    },
    'Fire': {
      fav: ['Public events', 'Marketing', 'Celebrations', 'Networking'],
      unfav: ['Hiding', 'Cold negotiations', 'Long-term storage'],
      favZh: ['公共活动', '营销', '庆祝', '社交'],
      unfavZh: ['隐藏', '冷漠谈判', '长期储存']
    },
    'Earth': {
      fav: ['Consolidation', 'Real estate', 'Foundation building', 'Transitions'],
      unfav: ['Rapid expansion', 'Taking big risks', 'Uprooting'],
      favZh: ['整合', '房地产', '打基础', '过渡'],
      unfavZh: ['快速扩张', '大冒险', '连根拔起']
    },
    'Metal': {
      fav: ['Harvesting results', 'Refining processes', 'Financial matters', 'Organization'],
      unfav: ['Soft negotiations', 'Emotional decisions', 'Scattering energy'],
      favZh: ['收获成果', '优化流程', '财务事项', '组织'],
      unfavZh: ['软弱谈判', '感情用事', '分散精力']
    },
    'Water': {
      fav: ['Planning', 'Research', 'Rest and recovery', 'Deep thinking'],
      unfav: ['Aggressive action', 'Public exposure', 'Overexertion'],
      favZh: ['规划', '研究', '休息恢复', '深度思考'],
      unfavZh: ['激进行动', '公开曝光', '过度劳累']
    }
  };

  const a = activities[commander.commanderElement];
  return {
    favorable: a.fav,
    unfavorable: a.unfav,
    favorableZh: a.favZh,
    unfavorableZh: a.unfavZh
  };
}

// ==================== EXPORTS ====================

export {
  getMonthCommander,
  computeSeasonalStrength,
  analyzeSeasonalInfluence,
  getElementSeasonalStrength,
  isElementInSeason,
  isElementOutOfSeason,
  calculateSeasonalModifier,
  getSeasonalRanking,
  getSeasonalActivities,
  MONTH_COMMANDER_MAP,
  SEASONAL_STRENGTH_TABLE
};
