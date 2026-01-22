/**
 * ============================================
 * FOLLOW STRUCTURE ENGINE (从格)
 * Detection of Special Follow Patterns
 *
 * When the Day Master is extremely weak and has
 * no root or support, it may "follow" the dominant
 * force in the chart.
 *
 * Types:
 * - 从强格 (Follow Strong) - DM follows strong resource/companion
 * - 从弱格 (Follow Weak) - DM follows overwhelming opposition
 * - 从财格 (Follow Wealth) - DM follows dominant wealth
 * - 从杀格 (Follow Kill) - DM follows dominant authority/kill
 * - 从儿格 (Follow Child/Output) - DM follows strong output
 * ============================================
 */

// ==================== TYPES ====================

export type FollowStructureType =
  | 'FollowStrong'    // 从强格 - follows resource/companion
  | 'FollowWeak'      // 从弱格 - follows opposition
  | 'FollowWealth'    // 从财格 - follows wealth
  | 'FollowKill'      // 从杀格 - follows authority/kill
  | 'FollowChild'     // 从儿格 - follows output
  | 'QuasiFollow'     // 假从格 - impure follow
  | 'None';           // No follow structure

export interface FollowStructureResult {
  type: FollowStructureType;
  confidence: number; // 0-100
  isPure: boolean;
  notes: string;
  notesZh: string;
  favorableElements: string[];
  unfavorableElements: string[];
  lifeTheme: string;
  lifeThemeZh: string;
}

export interface TenGodCounts {
  Companion?: number;      // 比肩 - same element, same polarity
  Rob?: number;            // 劫财 - same element, different polarity
  Resource?: number;       // 正印 - produces DM, different polarity
  IndirectResource?: number; // 偏印 - produces DM, same polarity
  Output?: number;         // 食神 - DM produces, same polarity
  Hurting?: number;        // 伤官 - DM produces, different polarity
  Wealth?: number;         // 正财 - DM controls, different polarity
  IndirectWealth?: number; // 偏财 - DM controls, same polarity
  Authority?: number;      // 正官 - controls DM, different polarity
  SevenKillings?: number;  // 七杀 - controls DM, same polarity
}

export interface FollowAnalysisInput {
  dayMasterStrength: number; // -100 to 100
  tenGodCounts: TenGodCounts;
  hasRoot: boolean;
  hasSupportInBranches: boolean;
  monthCommander: string;
  seasonSupports: boolean;
}

// ==================== CONSTANTS ====================

const FOLLOW_THRESHOLDS = {
  VERY_WEAK: -50,
  WEAK: -30,
  STRONG: 30,
  VERY_STRONG: 50
};

const DOMINANCE_THRESHOLD = 3; // Need at least 3 of a god type to dominate

// ==================== DETECTION FUNCTIONS ====================

/**
 * Main function to detect follow structure
 */
export function detectFollowStructure(input: FollowAnalysisInput): FollowStructureResult {
  const {
    dayMasterStrength,
    tenGodCounts,
    hasRoot,
    hasSupportInBranches,
    seasonSupports
  } = input;

  // Check for Follow Strong (从强格)
  if (dayMasterStrength > FOLLOW_THRESHOLDS.VERY_STRONG) {
    const resourceCount = (tenGodCounts.Resource ?? 0) + (tenGodCounts.IndirectResource ?? 0);
    const companionCount = (tenGodCounts.Companion ?? 0) + (tenGodCounts.Rob ?? 0);

    if (resourceCount + companionCount >= DOMINANCE_THRESHOLD) {
      return buildFollowStrong(resourceCount, companionCount, hasRoot);
    }
  }

  // For follow structures, DM must be weak
  if (dayMasterStrength > FOLLOW_THRESHOLDS.WEAK) {
    return buildNoFollow();
  }

  // Check if DM has any root - if yes, it's not a pure follow
  const isPure = !hasRoot && !hasSupportInBranches;

  // Check for Follow Wealth (从财格)
  const wealthCount = (tenGodCounts.Wealth ?? 0) + (tenGodCounts.IndirectWealth ?? 0);
  if (wealthCount >= DOMINANCE_THRESHOLD && dayMasterStrength < FOLLOW_THRESHOLDS.VERY_WEAK) {
    return buildFollowWealth(wealthCount, isPure);
  }

  // Check for Follow Kill (从杀格)
  const killCount = (tenGodCounts.SevenKillings ?? 0) + (tenGodCounts.Authority ?? 0);
  if (killCount >= DOMINANCE_THRESHOLD && dayMasterStrength < FOLLOW_THRESHOLDS.VERY_WEAK) {
    return buildFollowKill(killCount, isPure);
  }

  // Check for Follow Child/Output (从儿格)
  const outputCount = (tenGodCounts.Output ?? 0) + (tenGodCounts.Hurting ?? 0);
  if (outputCount >= DOMINANCE_THRESHOLD && dayMasterStrength < FOLLOW_THRESHOLDS.VERY_WEAK) {
    return buildFollowChild(outputCount, isPure);
  }

  // Check for general Follow Weak (从弱格)
  if (dayMasterStrength < FOLLOW_THRESHOLDS.VERY_WEAK && !hasRoot) {
    // Find what dominates
    const maxGod = findDominantGod(tenGodCounts);
    if (maxGod) {
      return buildFollowWeak(maxGod, isPure);
    }
  }

  // Check for Quasi-Follow (假从格)
  if (dayMasterStrength < FOLLOW_THRESHOLDS.WEAK && hasRoot) {
    const dominant = findDominantCategory(tenGodCounts);
    if (dominant) {
      return buildQuasiFollow(dominant);
    }
  }

  return buildNoFollow();
}

// ==================== BUILDER FUNCTIONS ====================

function buildFollowStrong(resourceCount: number, companionCount: number, hasRoot: boolean): FollowStructureResult {
  return {
    type: 'FollowStrong',
    confidence: Math.min(90, 60 + resourceCount * 5 + companionCount * 5),
    isPure: hasRoot,
    notes: `Day Master follows its own strength with ${resourceCount} resource and ${companionCount} companion stars.`,
    notesZh: `日主从强，有${resourceCount}个印星和${companionCount}个比劫。`,
    favorableElements: ['Resource', 'Companion', 'Rob', 'IndirectResource'],
    unfavorableElements: ['Wealth', 'Authority', 'SevenKillings'],
    lifeTheme: 'Self-reliance, building personal power, supporting others from strength.',
    lifeThemeZh: '自力更生，建立个人力量，从强势位置支持他人。'
  };
}

function buildFollowWealth(wealthCount: number, isPure: boolean): FollowStructureResult {
  return {
    type: 'FollowWealth',
    confidence: isPure ? 85 : 60,
    isPure,
    notes: `Day Master follows wealth with ${wealthCount} wealth stars. ${isPure ? 'Pure structure.' : 'Has some root - quasi follow.'}`,
    notesZh: `日主从财，有${wealthCount}个财星。${isPure ? '纯从格。' : '有根气——假从格。'}`,
    favorableElements: ['Wealth', 'IndirectWealth', 'Output', 'Hurting'],
    unfavorableElements: ['Resource', 'IndirectResource', 'Companion', 'Rob'],
    lifeTheme: 'Pursuing resources, financial focus, material success through surrender.',
    lifeThemeZh: '追求资源，专注财务，通过顺从获得物质成功。'
  };
}

function buildFollowKill(killCount: number, isPure: boolean): FollowStructureResult {
  return {
    type: 'FollowKill',
    confidence: isPure ? 85 : 60,
    isPure,
    notes: `Day Master follows authority/kill with ${killCount} authority stars. ${isPure ? 'Pure structure.' : 'Has some root - quasi follow.'}`,
    notesZh: `日主从杀，有${killCount}个官杀。${isPure ? '纯从格。' : '有根气——假从格。'}`,
    favorableElements: ['SevenKillings', 'Authority', 'Wealth', 'IndirectWealth'],
    unfavorableElements: ['Resource', 'IndirectResource', 'Output', 'Hurting'],
    lifeTheme: 'Serving power, working within structures, achieving through discipline.',
    lifeThemeZh: '服务权力，在结构中工作，通过纪律获得成就。'
  };
}

function buildFollowChild(outputCount: number, isPure: boolean): FollowStructureResult {
  return {
    type: 'FollowChild',
    confidence: isPure ? 85 : 60,
    isPure,
    notes: `Day Master follows output/child with ${outputCount} output stars. ${isPure ? 'Pure structure.' : 'Has some root - quasi follow.'}`,
    notesZh: `日主从儿，有${outputCount}个食伤。${isPure ? '纯从格。' : '有根气——假从格。'}`,
    favorableElements: ['Output', 'Hurting', 'Wealth', 'IndirectWealth'],
    unfavorableElements: ['Resource', 'IndirectResource', 'Authority', 'SevenKillings'],
    lifeTheme: 'Creative expression, nurturing creations, success through output.',
    lifeThemeZh: '创意表达，培育创造，通过产出获得成功。'
  };
}

function buildFollowWeak(dominantGod: string, isPure: boolean): FollowStructureResult {
  return {
    type: 'FollowWeak',
    confidence: isPure ? 75 : 50,
    isPure,
    notes: `Day Master follows the dominant ${dominantGod} energy.`,
    notesZh: `日主从弱，跟随主导的${dominantGod}能量。`,
    favorableElements: [dominantGod],
    unfavorableElements: ['Resource', 'IndirectResource', 'Companion', 'Rob'],
    lifeTheme: 'Adapting to circumstances, flowing with dominant forces.',
    lifeThemeZh: '适应环境，顺应主导力量。'
  };
}

function buildQuasiFollow(dominant: string): FollowStructureResult {
  return {
    type: 'QuasiFollow',
    confidence: 50,
    isPure: false,
    notes: `Quasi-follow structure - Day Master appears to follow ${dominant} but has hidden root.`,
    notesZh: `假从格——日主表面从${dominant}但有暗根。`,
    favorableElements: [dominant],
    unfavorableElements: [],
    lifeTheme: 'Dual nature - sometimes following, sometimes asserting. Adaptable but unpredictable.',
    lifeThemeZh: '双重性格——时而顺从，时而自主。适应性强但不可预测。'
  };
}

function buildNoFollow(): FollowStructureResult {
  return {
    type: 'None',
    confidence: 100,
    isPure: false,
    notes: 'No follow structure detected. Day Master maintains independence.',
    notesZh: '未检测到从格。日主保持独立。',
    favorableElements: [],
    unfavorableElements: [],
    lifeTheme: 'Standard structure - analyze based on strength and useful god.',
    lifeThemeZh: '标准格局——根据强弱和用神分析。'
  };
}

// ==================== HELPER FUNCTIONS ====================

function findDominantGod(counts: TenGodCounts): string | null {
  const entries = Object.entries(counts).filter(([_, v]) => (v ?? 0) >= DOMINANCE_THRESHOLD);
  if (entries.length === 0) return null;

  entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  return entries[0][0];
}

function findDominantCategory(counts: TenGodCounts): string | null {
  const categories = {
    Wealth: (counts.Wealth ?? 0) + (counts.IndirectWealth ?? 0),
    Authority: (counts.Authority ?? 0) + (counts.SevenKillings ?? 0),
    Output: (counts.Output ?? 0) + (counts.Hurting ?? 0),
    Resource: (counts.Resource ?? 0) + (counts.IndirectResource ?? 0),
    Companion: (counts.Companion ?? 0) + (counts.Rob ?? 0)
  };

  const max = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  return max[1] >= DOMINANCE_THRESHOLD ? max[0] : null;
}

/**
 * Get narrative implications of follow structure
 */
export function getFollowStructureNarrative(result: FollowStructureResult, lang: 'en' | 'zh' = 'en'): string {
  if (result.type === 'None') {
    return lang === 'zh'
      ? '您的命盘显示独立的日主，不需要从任何外在力量。'
      : 'Your chart shows an independent Day Master that doesn\'t need to follow external forces.';
  }

  const typeLabels: Record<FollowStructureType, { en: string; zh: string }> = {
    FollowStrong: { en: 'Follow Strong', zh: '从强' },
    FollowWeak: { en: 'Follow Weak', zh: '从弱' },
    FollowWealth: { en: 'Follow Wealth', zh: '从财' },
    FollowKill: { en: 'Follow Authority', zh: '从杀' },
    FollowChild: { en: 'Follow Output', zh: '从儿' },
    QuasiFollow: { en: 'Quasi-Follow', zh: '假从' },
    None: { en: '', zh: '' }
  };

  return lang === 'zh'
    ? `您的命盘显示${typeLabels[result.type].zh}格局。${result.lifeThemeZh}`
    : `Your chart shows a ${typeLabels[result.type].en} structure. ${result.lifeTheme}`;
}

/**
 * Check if a year/luck pillar disrupts the follow structure
 */
export function checkFollowDisruption(
  followResult: FollowStructureResult,
  incomingElement: string
): { disrupted: boolean; impact: string; impactZh: string } {
  if (followResult.type === 'None') {
    return { disrupted: false, impact: '', impactZh: '' };
  }

  const isDisruptor = followResult.unfavorableElements.includes(incomingElement);

  if (isDisruptor) {
    return {
      disrupted: true,
      impact: `The incoming ${incomingElement} energy disrupts your follow structure, potentially causing instability.`,
      impactZh: `来临的${incomingElement}能量打破了从格，可能造成不稳定。`
    };
  }

  return {
    disrupted: false,
    impact: `The incoming ${incomingElement} energy supports your follow structure.`,
    impactZh: `来临的${incomingElement}能量支持从格。`
  };
}

// ==================== EXPORTS ====================

export {
  detectFollowStructure,
  getFollowStructureNarrative,
  checkFollowDisruption
};
