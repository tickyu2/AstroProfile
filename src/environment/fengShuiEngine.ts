/**
 * ============================================================================
 * FENG SHUI DIRECTIONS ENGINE (风水方位引擎)
 * ============================================================================
 *
 * Computes directional energies based on BaZi and annual/monthly influences.
 *
 * Directions Calculated:
 * - Nobleman (贵人) - Help and support
 * - Wealth (财位) - Financial opportunity
 * - Peach Blossom (桃花) - Romance and relationships
 * - Academic (文昌) - Study and career
 * - Health (天医) - Health and healing
 * - Conflict (五鬼) - Obstacles and conflicts
 * - Sha (煞位) - Harmful energies
 * - Grand Duke (太岁) - Annual restriction
 * - Three Sha (三煞) - Annual harmful directions
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  CompassDirection,
  DirectionalEnergy,
  DirectionalEnergyType,
  ElementName,
  EnvironmentalSubject,
  FengShuiDirections
} from './environmentTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Earthly Branches
 */
const EARTHLY_BRANCHES = [
  'Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si',
  'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'
];

// Branch Chinese names available for future use
const _BRANCH_CHINESE: Record<string, string> = {
  Zi: '子', Chou: '丑', Yin: '寅', Mao: '卯',
  Chen: '辰', Si: '巳', Wu: '午', Wei: '未',
  Shen: '申', You: '酉', Xu: '戌', Hai: '亥'
};
void _BRANCH_CHINESE; // Suppress unused warning

/**
 * Branch to direction mapping
 */
const BRANCH_DIRECTION: Record<string, CompassDirection> = {
  Zi: 'N', Chou: 'NE', Yin: 'NE', Mao: 'E',
  Chen: 'SE', Si: 'SE', Wu: 'S', Wei: 'SW',
  Shen: 'SW', You: 'W', Xu: 'NW', Hai: 'NW'
};

/**
 * Direction Chinese names
 */
const DIRECTION_CHINESE: Record<CompassDirection, string> = {
  N: '北', NE: '东北', E: '东', SE: '东南',
  S: '南', SW: '西南', W: '西', NW: '西北'
};

/**
 * Nobleman directions by Day Stem
 * 甲戊庚 - 丑未, 乙己 - 子申, 丙丁 - 亥酉, 壬癸 - 卯巳, 辛 - 寅午
 */
const NOBLEMAN_BY_DAY_STEM: Record<string, string[]> = {
  Jia: ['Chou', 'Wei'],
  Yi: ['Zi', 'Shen'],
  Bing: ['Hai', 'You'],
  Ding: ['Hai', 'You'],
  Wu: ['Chou', 'Wei'],
  Ji: ['Zi', 'Shen'],
  Geng: ['Chou', 'Wei'],
  Xin: ['Yin', 'Wu'],
  Ren: ['Mao', 'Si'],
  Gui: ['Mao', 'Si']
};

/**
 * Peach Blossom directions by Year Branch group
 * 寅午戌 - 卯, 巳酉丑 - 午, 申子辰 - 酉, 亥卯未 - 子
 */
const PEACH_BLOSSOM_BY_YEAR_GROUP: Record<string, string> = {
  'Yin,Wu,Xu': 'Mao',
  'Si,You,Chou': 'Wu',
  'Shen,Zi,Chen': 'You',
  'Hai,Mao,Wei': 'Zi'
};

/**
 * Academic (文昌) directions by Year Branch
 */
const ACADEMIC_BY_YEAR_BRANCH: Record<string, string> = {
  Zi: 'Si', Chou: 'Wu', Yin: 'Shen', Mao: 'You',
  Chen: 'Shen', Si: 'You', Wu: 'Hai', Wei: 'Zi',
  Shen: 'Yin', You: 'Mao', Xu: 'Si', Hai: 'Wu'
};

/**
 * Health (天医) directions by Year Branch
 */
const HEALTH_BY_YEAR_BRANCH: Record<string, string> = {
  Zi: 'Chou', Chou: 'Yin', Yin: 'Mao', Mao: 'Chen',
  Chen: 'Si', Si: 'Wu', Wu: 'Wei', Wei: 'Shen',
  Shen: 'You', You: 'Xu', Xu: 'Hai', Hai: 'Zi'
};

/**
 * Grand Duke (太岁) follows the year branch
 */
function getGrandDukeDirection(yearBranch: string): CompassDirection {
  return BRANCH_DIRECTION[yearBranch];
}

/**
 * Three Sha (三煞) by year branch group
 * 寅午戌年 - 北 (亥子丑)
 * 申子辰年 - 南 (巳午未)
 * 巳酉丑年 - 东 (寅卯辰)
 * 亥卯未年 - 西 (申酉戌)
 */
const THREE_SHA_BY_YEAR_GROUP: Record<string, CompassDirection> = {
  'Yin,Wu,Xu': 'N',
  'Shen,Zi,Chen': 'S',
  'Si,You,Chou': 'E',
  'Hai,Mao,Wei': 'W'
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Get year group for a branch
 */
function getYearGroup(branch: string): string {
  const groups = [
    ['Yin', 'Wu', 'Xu'],
    ['Si', 'You', 'Chou'],
    ['Shen', 'Zi', 'Chen'],
    ['Hai', 'Mao', 'Wei']
  ];

  for (const group of groups) {
    if (group.includes(branch)) {
      return group.join(',');
    }
  }
  return '';
}

/**
 * Create a directional energy object
 */
function createDirectionalEnergy(
  type: DirectionalEnergyType,
  direction: CompassDirection,
  strength: 'strong' | 'moderate' | 'mild',
  nature: 'auspicious' | 'inauspicious' | 'neutral'
): DirectionalEnergy {
  const typeLabels: Record<DirectionalEnergyType, { en: string; zh: string }> = {
    nobleman: { en: 'Nobleman', zh: '贵人' },
    wealth: { en: 'Wealth', zh: '财位' },
    peachBlossom: { en: 'Peach Blossom', zh: '桃花' },
    academic: { en: 'Academic', zh: '文昌' },
    health: { en: 'Health', zh: '天医' },
    conflict: { en: 'Conflict', zh: '五鬼' },
    sha: { en: 'Sha', zh: '煞位' },
    grandDuke: { en: 'Grand Duke', zh: '太岁' },
    threeSha: { en: 'Three Sha', zh: '三煞' }
  };

  const adviceMap: Record<DirectionalEnergyType, { en: string; zh: string }> = {
    nobleman: {
      en: 'Face this direction when seeking help or making important requests.',
      zh: '求助或重要请求时面向此方。'
    },
    wealth: {
      en: 'Place important financial items here or face this direction for wealth matters.',
      zh: '财务物品置于此方或财务事宜面向此方。'
    },
    peachBlossom: {
      en: 'Enhance this direction for romance and relationship harmony.',
      zh: '增强此方位可促进感情和谐。'
    },
    academic: {
      en: 'Study or work facing this direction for better focus and achievement.',
      zh: '学习或工作面向此方可提升效率。'
    },
    health: {
      en: 'Rest or recuperate facing this direction for better healing.',
      zh: '休息或养病时面向此方有助康复。'
    },
    conflict: {
      en: 'Avoid sitting or sleeping facing this direction.',
      zh: '避免坐卧面向此方。'
    },
    sha: {
      en: 'Do not disturb this direction with renovation or loud activities.',
      zh: '此方位勿动土或有噪音活动。'
    },
    grandDuke: {
      en: 'Do not sit facing or oppose this direction this year.',
      zh: '今年勿坐向或冲犯此方。'
    },
    threeSha: {
      en: 'Avoid major activities or construction in this direction this year.',
      zh: '今年此方位勿有重大活动或施工。'
    }
  };

  return {
    type,
    typeChinese: typeLabels[type].zh,
    direction,
    directionChinese: DIRECTION_CHINESE[direction],
    strength,
    nature,
    advice: adviceMap[type].en,
    adviceChinese: adviceMap[type].zh
  };
}

/**
 * Compute Nobleman directions
 */
function computeNoblemanDirections(
  dayStem: string,
  personalDirections: CompassDirection[]
): DirectionalEnergy[] {
  const results: DirectionalEnergy[] = [];

  // From day stem formula
  const branches = NOBLEMAN_BY_DAY_STEM[dayStem] || [];
  for (const branch of branches) {
    const dir = BRANCH_DIRECTION[branch];
    results.push(createDirectionalEnergy('nobleman', dir, 'strong', 'auspicious'));
  }

  // Add personal nobleman directions if different
  for (const dir of personalDirections) {
    if (!results.some(r => r.direction === dir)) {
      results.push(createDirectionalEnergy('nobleman', dir, 'moderate', 'auspicious'));
    }
  }

  return results;
}

/**
 * Compute Wealth direction
 */
function computeWealthDirections(
  dayMasterElement: ElementName,
  personalWealthDir: CompassDirection
): DirectionalEnergy[] {
  const results: DirectionalEnergy[] = [];

  // Wealth element is what Day Master controls
  const wealthElementMap: Record<ElementName, ElementName> = {
    Wood: 'Earth',
    Fire: 'Metal',
    Earth: 'Water',
    Metal: 'Wood',
    Water: 'Fire'
  };

  const wealthElement = wealthElementMap[dayMasterElement];

  // Element to direction mapping
  const elementDirections: Record<ElementName, CompassDirection[]> = {
    Wood: ['E', 'SE'],
    Fire: ['S'],
    Earth: ['SW', 'NE'],
    Metal: ['W', 'NW'],
    Water: ['N']
  };

  const dirs = elementDirections[wealthElement];
  for (const dir of dirs) {
    results.push(createDirectionalEnergy('wealth', dir, 'strong', 'auspicious'));
  }

  // Add personal wealth direction if different
  if (!dirs.includes(personalWealthDir)) {
    results.push(createDirectionalEnergy('wealth', personalWealthDir, 'moderate', 'auspicious'));
  }

  return results;
}

/**
 * Compute Peach Blossom direction
 */
function computePeachBlossomDirections(
  yearBranch: string,
  personalPeachDir: CompassDirection
): DirectionalEnergy[] {
  const results: DirectionalEnergy[] = [];

  const group = getYearGroup(yearBranch);
  const peachBranch = PEACH_BLOSSOM_BY_YEAR_GROUP[group];

  if (peachBranch) {
    const dir = BRANCH_DIRECTION[peachBranch];
    results.push(createDirectionalEnergy('peachBlossom', dir, 'strong', 'auspicious'));
  }

  // Add personal peach blossom if different
  if (personalPeachDir && !results.some(r => r.direction === personalPeachDir)) {
    results.push(createDirectionalEnergy('peachBlossom', personalPeachDir, 'moderate', 'auspicious'));
  }

  return results;
}

/**
 * Compute Academic direction
 */
function computeAcademicDirections(yearBranch: string): DirectionalEnergy[] {
  const branch = ACADEMIC_BY_YEAR_BRANCH[yearBranch];
  if (!branch) return [];

  const dir = BRANCH_DIRECTION[branch];
  return [createDirectionalEnergy('academic', dir, 'strong', 'auspicious')];
}

/**
 * Compute Health direction
 */
function computeHealthDirections(yearBranch: string): DirectionalEnergy[] {
  const branch = HEALTH_BY_YEAR_BRANCH[yearBranch];
  if (!branch) return [];

  const dir = BRANCH_DIRECTION[branch];
  return [createDirectionalEnergy('health', dir, 'strong', 'auspicious')];
}

/**
 * Compute Conflict (五鬼) direction
 * Opposite of the nobleman direction
 */
function computeConflictDirections(noblemanDirections: DirectionalEnergy[]): DirectionalEnergy[] {
  const opposites: Record<CompassDirection, CompassDirection> = {
    N: 'S', S: 'N', E: 'W', W: 'E',
    NE: 'SW', SW: 'NE', SE: 'NW', NW: 'SE'
  };

  const results: DirectionalEnergy[] = [];
  for (const noble of noblemanDirections) {
    const oppositeDir = opposites[noble.direction];
    if (!results.some(r => r.direction === oppositeDir)) {
      results.push(createDirectionalEnergy('conflict', oppositeDir, 'moderate', 'inauspicious'));
    }
  }

  return results;
}

/**
 * Compute Grand Duke direction for the year
 */
function computeGrandDuke(yearBranch: string): DirectionalEnergy | null {
  const dir = getGrandDukeDirection(yearBranch);
  return createDirectionalEnergy('grandDuke', dir, 'strong', 'inauspicious');
}

/**
 * Compute Three Sha direction for the year
 */
function computeThreeSha(yearBranch: string): DirectionalEnergy | null {
  const group = getYearGroup(yearBranch);
  const dir = THREE_SHA_BY_YEAR_GROUP[group];

  if (dir) {
    return createDirectionalEnergy('threeSha', dir, 'strong', 'inauspicious');
  }
  return null;
}

/**
 * Get current year's earthly branch
 */
function getCurrentYearBranch(timestamp: string): string {
  const year = new Date(timestamp).getFullYear();
  // Year branch calculation: (year - 4) % 12
  // 1984 was Zi (Rat) year
  const branchIndex = (year - 4) % 12;
  return EARTHLY_BRANCHES[branchIndex];
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Compute complete Feng Shui directional analysis
 */
export function computeFengShuiDirections(
  subject: EnvironmentalSubject,
  timestamp: string
): FengShuiDirections {
  const currentYearBranch = getCurrentYearBranch(timestamp);

  // Compute all directional energies
  const nobleman = computeNoblemanDirections(
    'Jia', // Would need actual day stem from subject
    subject.personalNoblemanDirections
  );

  const wealth = computeWealthDirections(
    subject.dayMasterElement,
    subject.personalWealthDirection
  );

  const peachBlossom = computePeachBlossomDirections(
    subject.yearBranch,
    subject.personalPeachBlossomDirection
  );

  const academic = computeAcademicDirections(subject.yearBranch);
  const health = computeHealthDirections(subject.yearBranch);

  const conflict = computeConflictDirections(nobleman);
  const sha: DirectionalEnergy[] = []; // Would compute based on monthly flying stars

  const grandDuke = computeGrandDuke(currentYearBranch);
  const threeSha = computeThreeSha(currentYearBranch);

  // Aggregate best and avoid directions
  const bestSet = new Set<CompassDirection>();
  const avoidSet = new Set<CompassDirection>();

  for (const e of [...nobleman, ...wealth, ...peachBlossom, ...academic, ...health]) {
    bestSet.add(e.direction);
  }

  for (const e of conflict) {
    avoidSet.add(e.direction);
  }
  if (grandDuke) avoidSet.add(grandDuke.direction);
  if (threeSha) avoidSet.add(threeSha.direction);

  // Remove overlaps (avoid takes precedence)
  Array.from(avoidSet).forEach(dir => {
    bestSet.delete(dir);
  });

  // Generate notes
  const notes: string[] = [];
  if (nobleman.length > 0) {
    notes.push(`Nobleman directions: ${nobleman.map(n => n.directionChinese).join(', ')}`);
  }
  if (grandDuke) {
    notes.push(`Grand Duke (太岁) in ${grandDuke.directionChinese} - avoid opposing`);
  }
  if (threeSha) {
    notes.push(`Three Sha (三煞) in ${threeSha.directionChinese} - avoid major activities`);
  }

  return {
    nobleman,
    wealth,
    peachBlossom,
    academic,
    health,
    conflict,
    sha,
    grandDuke,
    threeSha,
    bestDirections: Array.from(bestSet),
    avoidDirections: Array.from(avoidSet),
    notes
  };
}

/**
 * Score Feng Shui alignment (0-100)
 */
export function scoreFengShuiAlignment(
  directions: FengShuiDirections,
  subject: EnvironmentalSubject
): number {
  let score = 50; // Base score

  // Bonus for strong nobleman directions
  score += directions.nobleman.filter(n => n.strength === 'strong').length * 8;

  // Bonus for wealth alignment with useful god
  const wealthElementMatch = directions.wealth.some(_w => {
    // Check if wealth direction element matches useful god
    return true; // Simplified - would check element match
  });
  if (wealthElementMatch) score += 10;

  // Penalty for Grand Duke in personal directions
  if (directions.grandDuke) {
    if (subject.personalNoblemanDirections.includes(directions.grandDuke.direction)) {
      score -= 15;
    }
  }

  // Penalty for Three Sha in important directions
  if (directions.threeSha) {
    if (directions.bestDirections.includes(directions.threeSha.direction)) {
      score -= 10;
    }
  }

  return Math.max(0, Math.min(100, score));
}

