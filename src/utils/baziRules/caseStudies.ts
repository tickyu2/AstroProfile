/**
 * ============================================
 * CASE STUDIES MODULE
 * Educational Examples with Teaching Points
 *
 * Provides structured case studies for learning:
 * - Famous historical figures
 * - Classic pattern examples
 * - Teaching annotations
 * - Progressive difficulty levels
 * ============================================
 */

import { ChartData } from './multiChartCompare';
import { FollowStructureType } from './followStructure';
import { ShenShaHit } from './shenSha';

// ==================== TYPES ====================

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type CaseCategory =
  | 'element_balance'
  | 'structure_pattern'
  | 'follow_structure'
  | 'shen_sha'
  | 'timing_luck'
  | 'compatibility'
  | 'special_pattern'
  | 'historical_figure';

export interface TeachingPoint {
  id: string;
  concept: string;
  conceptZh: string;
  explanation: string;
  explanationZh: string;
  importance: 'critical' | 'important' | 'supplementary';
  relatedConcepts: string[];
}

export interface CaseStudyChart {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
  birthDate?: string;
  birthTime?: string;
  gender?: 'male' | 'female';
}

export interface AnalysisSection {
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
  highlights: string[];
  highlightsZh: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  titleZh: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  chart: CaseStudyChart;

  // Analysis
  summary: string;
  summaryZh: string;
  analysisSections: AnalysisSection[];

  // Teaching
  teachingPoints: TeachingPoint[];
  keyTakeaways: string[];
  keyTakeawaysZh: string[];

  // Metadata
  historicalContext?: string;
  historicalContextZh?: string;
  source?: string;
  tags: string[];
}

export interface CaseStudyCollection {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  cases: CaseStudy[];
  difficulty: DifficultyLevel;
  prerequisites: string[];
}

export interface CaseStudyProgress {
  caseId: string;
  completed: boolean;
  score?: number;
  notes?: string;
  completedAt?: Date;
}

// ==================== SAMPLE CASE STUDIES ====================

/**
 * Classic Five Element Balance Case
 */
export const CASE_BALANCED_ELEMENTS: CaseStudy = {
  id: 'balanced-elements-01',
  title: 'The Balanced Scholar',
  titleZh: '平衡学者',
  category: 'element_balance',
  difficulty: 'beginner',
  chart: {
    yearStem: 'Jia',
    yearBranch: 'Yin',
    monthStem: 'Bing',
    monthBranch: 'Wu',
    dayStem: 'Wu',
    dayBranch: 'Shen',
    hourStem: 'Ren',
    hourBranch: 'Zi'
  },
  summary: 'This chart demonstrates excellent five element balance with all elements represented. The Wu Earth Day Master is supported by seasonal Fire and has outlets through Metal and Water.',
  summaryZh: '此命盘展示了五行俱全的优秀平衡。戊土日主得夏火相生，有金水泄秀。',
  analysisSections: [
    {
      title: 'Day Master Analysis',
      titleZh: '日主分析',
      content: 'Wu Earth born in summer (Wu month) receives strong support from Fire. The Day Master sits on Shen (Metal), providing a natural outlet for the abundant energy.',
      contentZh: '戊土生于仲夏（午月），得火之生扶。日主坐申（金），为旺气提供自然出路。',
      highlights: ['Strong seasonal support', 'Natural energy outlet', 'Balanced strength'],
      highlightsZh: ['季节支持强', '能量自然流通', '力量平衡']
    },
    {
      title: 'Element Flow',
      titleZh: '五行流通',
      content: 'The chart shows a complete productive cycle: Wood (Yin) → Fire (Wu) → Earth (Day Master) → Metal (Shen) → Water (Zi). This creates smooth energy flow.',
      contentZh: '命盘展示完整的相生循环：木（寅）→火（午）→土（日主）→金（申）→水（子）。形成顺畅的能量流动。',
      highlights: ['Complete production cycle', 'Smooth energy flow', 'No blockages'],
      highlightsZh: ['相生循环完整', '能量顺畅流动', '无阻塞']
    }
  ],
  teachingPoints: [
    {
      id: 'tp-balance-01',
      concept: 'Five Element Balance',
      conceptZh: '五行平衡',
      explanation: 'When all five elements are present and flowing naturally, the chart has inherent stability. This person can adapt to various situations.',
      explanationZh: '当五行俱全且自然流通时，命盘具有内在稳定性。此人能适应各种情况。',
      importance: 'critical',
      relatedConcepts: ['element_cycle', 'production_cycle', 'day_master_strength']
    },
    {
      id: 'tp-balance-02',
      concept: 'Seasonal Support',
      conceptZh: '令支得气',
      explanation: 'The month branch represents the season, which significantly influences element strength. Here, Fire month supports Earth.',
      explanationZh: '月支代表季节，对五行强弱有重大影响。此处火月生土。',
      importance: 'important',
      relatedConcepts: ['month_commander', 'seasonal_strength']
    }
  ],
  keyTakeaways: [
    'Balanced charts indicate adaptability and stability',
    'Seasonal support is a major strength factor',
    'Complete element cycles create smooth energy flow'
  ],
  keyTakeawaysZh: [
    '平衡的命盘表示适应性和稳定性',
    '季节支持是重要的力量因素',
    '完整的五行循环创造顺畅的能量流动'
  ],
  tags: ['balance', 'beginner', 'five-elements', 'seasonal']
};

/**
 * Follow Structure Case
 */
export const CASE_FOLLOW_WEALTH: CaseStudy = {
  id: 'follow-wealth-01',
  title: 'The Follow Wealth Pattern',
  titleZh: '从财格典范',
  category: 'follow_structure',
  difficulty: 'advanced',
  chart: {
    yearStem: 'Geng',
    yearBranch: 'Shen',
    monthStem: 'Geng',
    monthBranch: 'Shen',
    dayStem: 'Yi',
    dayBranch: 'You',
    hourStem: 'Xin',
    hourBranch: 'You'
  },
  summary: 'Classic Follow Wealth (从财格) pattern where the Yi Wood Day Master is extremely weak, surrounded by overwhelming Metal. Instead of fighting, the Day Master yields to and follows the Wealth element.',
  summaryZh: '典型的从财格。乙木日主极弱，被金气包围。日主不与之抗争，而是顺从财星。',
  analysisSections: [
    {
      title: 'Day Master Condition',
      titleZh: '日主状态',
      content: 'Yi Wood is born in Autumn (Shen month) when Wood is at its weakest. The chart has 4 Metal elements and no Water or Wood support. The Day Master has no choice but to follow.',
      contentZh: '乙木生于秋季（申月），木最弱之时。命盘有4个金，无水木相助。日主别无选择只能从财。',
      highlights: ['Out-of-season birth', 'No support elements', 'Overwhelming Metal'],
      highlightsZh: ['失令出生', '无相助五行', '金气过旺']
    },
    {
      title: 'Follow Wealth Dynamics',
      titleZh: '从财格运作',
      content: 'In Follow Wealth, Metal (which Wood controls for wealth) dominates. The native prospers through business, finance, and material pursuits rather than through personal strength.',
      contentZh: '从财格中，金（木克为财）主导。命主通过商业、金融和物质追求获得成功，而非依靠个人力量。',
      highlights: ['Wealth through yielding', 'Business success potential', 'Material focus'],
      highlightsZh: ['顺从得财', '商业成功潜力', '物质导向']
    }
  ],
  teachingPoints: [
    {
      id: 'tp-follow-01',
      concept: 'Follow Structure Requirements',
      conceptZh: '从格条件',
      explanation: 'Follow patterns require: (1) Extremely weak Day Master, (2) Dominant element overwhelming, (3) No support for Day Master, (4) No disrupting elements.',
      explanationZh: '从格需要：（1）日主极弱，（2）某五行过旺，（3）日主无相助，（4）无破格之物。',
      importance: 'critical',
      relatedConcepts: ['day_master_strength', 'element_dominance', 'pattern_breaking']
    },
    {
      id: 'tp-follow-02',
      concept: 'Follow Wealth Life Path',
      conceptZh: '从财格人生路径',
      explanation: 'Those with Follow Wealth succeed by working with money, business, and wealth rather than through personal achievement. They should embrace wealth-generating activities.',
      explanationZh: '从财格者通过经商理财获得成功，而非个人成就。应该拥抱生财之道。',
      importance: 'important',
      relatedConcepts: ['career_path', 'wealth_element', 'life_strategy']
    }
  ],
  keyTakeaways: [
    'Extreme weakness can become strength through following',
    'Follow Wealth indicates success through business and finance',
    'Breaking the follow pattern brings misfortune'
  ],
  keyTakeawaysZh: [
    '极弱可通过顺从转化为力量',
    '从财格表示通过商业金融获得成功',
    '破坏从格会带来不顺'
  ],
  tags: ['follow-structure', 'advanced', 'wealth', 'special-pattern']
};

/**
 * Shen Sha Star Case
 */
export const CASE_NOBLEMAN_STAR: CaseStudy = {
  id: 'nobleman-star-01',
  title: 'The Nobleman\'s Protection',
  titleZh: '贵人护佑',
  category: 'shen_sha',
  difficulty: 'intermediate',
  chart: {
    yearStem: 'Jia',
    yearBranch: 'Chou',
    monthStem: 'Ding',
    monthBranch: 'Mao',
    dayStem: 'Jia',
    dayBranch: 'Wu',
    hourStem: 'Bing',
    hourBranch: 'Yin'
  },
  summary: 'This chart features the Heavenly Nobleman star (天乙贵人) in the Year Branch. The Jia stem looks to Chou as its Nobleman, indicating help from influential people throughout life.',
  summaryZh: '此命盘年支带天乙贵人。甲以丑为贵人，表示一生得贵人相助。',
  analysisSections: [
    {
      title: 'Nobleman Star Location',
      titleZh: '贵人星位置',
      content: 'The Nobleman in the Year Pillar suggests help from elders, ancestors, or early life benefactors. This protection manifests particularly in youth and through family connections.',
      contentZh: '贵人在年柱表示得长辈、祖先或早年贵人相助。此护佑尤其在青年期和通过家族关系体现。',
      highlights: ['Year Pillar = early life', 'Elder benefactors', 'Family connections'],
      highlightsZh: ['年柱=早年', '长辈贵人', '家族关系']
    },
    {
      title: 'How Nobleman Manifests',
      titleZh: '贵人如何显现',
      content: 'The Nobleman star brings timely help during difficulties. People with this star often find that someone appears to help just when needed most.',
      contentZh: '天乙贵人在困难时带来及时帮助。有此星者常在最需要时遇到帮助自己的人。',
      highlights: ['Timely assistance', 'Crisis resolution', 'Beneficial encounters'],
      highlightsZh: ['及时援助', '化解危机', '有益相遇']
    }
  ],
  teachingPoints: [
    {
      id: 'tp-shensha-01',
      concept: 'Shen Sha Star Interpretation',
      conceptZh: '神煞星解读',
      explanation: 'Shen Sha stars add color and nuance to chart interpretation. They should be considered alongside, not instead of, the main five-element analysis.',
      explanationZh: '神煞星为命盘解读增添色彩和细微差别。应与五行分析结合考虑，而非替代。',
      importance: 'important',
      relatedConcepts: ['auxiliary_stars', 'pillar_placement', 'timing_activation']
    },
    {
      id: 'tp-shensha-02',
      concept: 'Star Pillar Placement',
      conceptZh: '星曜柱位',
      explanation: 'Where a star appears matters: Year = ancestors/youth, Month = career/peers, Day = self/spouse, Hour = children/later life.',
      explanationZh: '星曜出现的位置很重要：年=祖先/青年，月=事业/同辈，日=自己/配偶，时=子女/晚年。',
      importance: 'critical',
      relatedConcepts: ['four_pillars', 'life_phases', 'star_location']
    }
  ],
  keyTakeaways: [
    'Nobleman star indicates help from influential people',
    'Star placement in pillars determines life phase of influence',
    'Multiple auspicious stars amplify positive effects'
  ],
  keyTakeawaysZh: [
    '天乙贵人表示得贵人相助',
    '星曜在柱位决定影响的人生阶段',
    '多吉星会放大正面效果'
  ],
  tags: ['shen-sha', 'nobleman', 'intermediate', 'auspicious-star']
};

// ==================== CASE STUDY COLLECTIONS ====================

export const BEGINNER_COLLECTION: CaseStudyCollection = {
  id: 'beginner-fundamentals',
  name: 'BaZi Fundamentals',
  nameZh: '八字基础',
  description: 'Essential concepts for understanding BaZi charts. Start here if you are new to Chinese astrology.',
  descriptionZh: '理解八字命盘的基本概念。如果您是中国命理学新手，请从这里开始。',
  cases: [CASE_BALANCED_ELEMENTS],
  difficulty: 'beginner',
  prerequisites: []
};

export const ADVANCED_PATTERNS_COLLECTION: CaseStudyCollection = {
  id: 'advanced-patterns',
  name: 'Special Patterns',
  nameZh: '特殊格局',
  description: 'Advanced structural patterns including Follow structures and special formations.',
  descriptionZh: '高级结构格局，包括从格和特殊组合。',
  cases: [CASE_FOLLOW_WEALTH],
  difficulty: 'advanced',
  prerequisites: ['beginner-fundamentals']
};

export const SHEN_SHA_COLLECTION: CaseStudyCollection = {
  id: 'shen-sha-stars',
  name: 'Shen Sha Stars',
  nameZh: '神煞星曜',
  description: 'Understanding auxiliary stars and their influence on destiny.',
  descriptionZh: '理解辅助星曜及其对命运的影响。',
  cases: [CASE_NOBLEMAN_STAR],
  difficulty: 'intermediate',
  prerequisites: ['beginner-fundamentals']
};

// ==================== CORE FUNCTIONS ====================

/**
 * Get all case studies
 */
export function getAllCaseStudies(): CaseStudy[] {
  return [
    CASE_BALANCED_ELEMENTS,
    CASE_FOLLOW_WEALTH,
    CASE_NOBLEMAN_STAR
  ];
}

/**
 * Get case studies by category
 */
export function getCaseStudiesByCategory(category: CaseCategory): CaseStudy[] {
  return getAllCaseStudies().filter(c => c.category === category);
}

/**
 * Get case studies by difficulty
 */
export function getCaseStudiesByDifficulty(difficulty: DifficultyLevel): CaseStudy[] {
  return getAllCaseStudies().filter(c => c.difficulty === difficulty);
}

/**
 * Get case study by ID
 */
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return getAllCaseStudies().find(c => c.id === id);
}

/**
 * Get all collections
 */
export function getAllCollections(): CaseStudyCollection[] {
  return [
    BEGINNER_COLLECTION,
    ADVANCED_PATTERNS_COLLECTION,
    SHEN_SHA_COLLECTION
  ];
}

/**
 * Get collection by ID
 */
export function getCollectionById(id: string): CaseStudyCollection | undefined {
  return getAllCollections().find(c => c.id === id);
}

/**
 * Get recommended next case studies based on progress
 */
export function getRecommendedCases(
  completedCaseIds: string[],
  currentLevel: DifficultyLevel
): CaseStudy[] {
  const allCases = getAllCaseStudies();
  const incomplete = allCases.filter(c => !completedCaseIds.includes(c.id));

  // Prioritize current level, then one level up
  const levelOrder: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'master'];
  const currentIndex = levelOrder.indexOf(currentLevel);

  return incomplete.sort((a, b) => {
    const aIndex = levelOrder.indexOf(a.difficulty);
    const bIndex = levelOrder.indexOf(b.difficulty);

    // Prefer current level
    if (aIndex === currentIndex && bIndex !== currentIndex) return -1;
    if (bIndex === currentIndex && aIndex !== currentIndex) return 1;

    // Then prefer next level up
    if (aIndex === currentIndex + 1 && bIndex > currentIndex + 1) return -1;
    if (bIndex === currentIndex + 1 && aIndex > currentIndex + 1) return 1;

    return aIndex - bIndex;
  }).slice(0, 3);
}

/**
 * Extract teaching points from a case study
 */
export function extractTeachingPoints(caseStudy: CaseStudy): TeachingPoint[] {
  return caseStudy.teachingPoints.sort((a, b) => {
    const importance = { critical: 0, important: 1, supplementary: 2 };
    return importance[a.importance] - importance[b.importance];
  });
}

/**
 * Get all teaching points across all cases for a concept
 */
export function getTeachingPointsByConcept(concept: string): TeachingPoint[] {
  const allCases = getAllCaseStudies();
  const points: TeachingPoint[] = [];

  allCases.forEach(caseStudy => {
    caseStudy.teachingPoints.forEach(tp => {
      if (tp.relatedConcepts.includes(concept) ||
          tp.concept.toLowerCase().includes(concept.toLowerCase())) {
        points.push(tp);
      }
    });
  });

  return points;
}

/**
 * Generate a study path based on learning goals
 */
export function generateStudyPath(
  goals: CaseCategory[],
  startLevel: DifficultyLevel = 'beginner'
): CaseStudy[] {
  const allCases = getAllCaseStudies();
  const levelOrder: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'master'];
  const startIndex = levelOrder.indexOf(startLevel);

  return allCases
    .filter(c => goals.includes(c.category))
    .filter(c => levelOrder.indexOf(c.difficulty) >= startIndex)
    .sort((a, b) => {
      const aLevel = levelOrder.indexOf(a.difficulty);
      const bLevel = levelOrder.indexOf(b.difficulty);
      return aLevel - bLevel;
    });
}

/**
 * Calculate completion percentage for a collection
 */
export function getCollectionProgress(
  collectionId: string,
  completedCaseIds: string[]
): { completed: number; total: number; percentage: number } {
  const collection = getCollectionById(collectionId);
  if (!collection) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = collection.cases.filter(c => completedCaseIds.includes(c.id)).length;
  const total = collection.cases.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

// ==================== EXPORTS ====================

export {
  getAllCaseStudies,
  getCaseStudiesByCategory,
  getCaseStudiesByDifficulty,
  getCaseStudyById,
  getAllCollections,
  getCollectionById,
  getRecommendedCases,
  extractTeachingPoints,
  getTeachingPointsByConcept,
  generateStudyPath,
  getCollectionProgress,
  CASE_BALANCED_ELEMENTS,
  CASE_FOLLOW_WEALTH,
  CASE_NOBLEMAN_STAR,
  BEGINNER_COLLECTION,
  ADVANCED_PATTERNS_COLLECTION,
  SHEN_SHA_COLLECTION
};
