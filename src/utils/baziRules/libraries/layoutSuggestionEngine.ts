/**
 * ============================================
 * LAYOUT SUGGESTION ENGINE (Designer 3.0)
 * AI-Assisted Report Layout Recommendations
 *
 * Given the full reading context, the engine proposes:
 * - Section order
 * - Section emphasis
 * - Section grouping
 * - Optional sections to include/exclude
 * - Recommended tone preset
 * ============================================
 */

import type { TonePreset } from './tonePresets';
import type { ReportContext2 } from './proReportDesigner2';

// ==================== TYPES ====================

export interface LayoutSuggestion {
  recommendedOrder: string[];
  recommendedTone: TonePreset;
  emphasize: string[];
  deEmphasize: string[];
  suggestedOmissions: string[];
  rationale: string[];
  rationaleZh: string[];
  confidence: number;
  focusAreas: string[];
  focusAreasZh: string[];
}

export interface LayoutContext {
  // From ReportContext2
  ctx: ReportContext2;

  // Additional context for suggestions
  userPreferences?: {
    wantsTiming?: boolean;
    wantsNarrative?: boolean;
    wantsGuidance?: boolean;
    isBeginner?: boolean;
    isBusinessContext?: boolean;
  };

  // Historical data
  hasAncestralData?: boolean;
  hasMythosData?: boolean;
  hasConstellationData?: boolean;
}

// ==================== SUGGESTION ENGINE ====================

/**
 * Generate layout suggestions based on chart context
 */
export function suggestLayout(input: LayoutContext): LayoutSuggestion {
  const { ctx, userPreferences } = input;
  const rationale: string[] = [];
  const rationaleZh: string[] = [];
  const emphasize: string[] = [];
  const deEmphasize: string[] = [];
  const suggestedOmissions: string[] = [];
  const focusAreas: string[] = [];
  const focusAreasZh: string[] = [];

  // ===== STRUCTURE-BASED SUGGESTIONS =====
  if (ctx.structure.type.includes('Wealth')) {
    emphasize.push('structure', 'useful_god', 'luck_pillars', 'annual');
    rationale.push('Wealth structures benefit from timing and resource analysis.');
    rationaleZh.push('财格结构受益于时机和资源分析。');
    focusAreas.push('Finance', 'Career timing', 'Resource management');
    focusAreasZh.push('财务', '事业时机', '资源管理');
  }

  if (ctx.structure.type.includes('Officer') || ctx.structure.type.includes('Authority')) {
    emphasize.push('structure', 'ten_gods', 'guidance');
    rationale.push('Officer structures emphasize leadership and career path.');
    rationaleZh.push('官格结构强调领导力和事业道路。');
    focusAreas.push('Leadership', 'Career advancement', 'Professional reputation');
    focusAreasZh.push('领导力', '事业晋升', '专业声誉');
  }

  if (ctx.structure.type.includes('Resource') || ctx.structure.type.includes('Print')) {
    emphasize.push('structure', 'ten_gods', 'shen_sha');
    rationale.push('Resource structures benefit from support network analysis.');
    rationaleZh.push('印格结构受益于支持网络分析。');
    focusAreas.push('Education', 'Mentorship', 'Support systems');
    focusAreasZh.push('教育', '导师', '支持系统');
  }

  if (ctx.structure.type.includes('Follow')) {
    emphasize.push('structure', 'useful_god', 'luck_pillars');
    rationale.push('Follow structures require careful timing alignment.');
    rationaleZh.push('从格结构需要仔细的时机配合。');
    focusAreas.push('Timing sensitivity', 'Adaptability', 'External support');
    focusAreasZh.push('时机敏感性', '适应性', '外部支持');
  }

  // ===== SHEN SHA-BASED SUGGESTIONS =====
  const shenShaIds = ctx.shenSha.map(s => s.id);

  if (shenShaIds.includes('peach_blossom') || shenShaIds.includes('red_matchmaker')) {
    emphasize.push('shen_sha', 'guidance');
    rationale.push('Relationship stars indicate relationship themes deserve emphasis.');
    rationaleZh.push('桃花星表明关系主题值得强调。');
    focusAreas.push('Relationships', 'Social connections', 'Romance');
    focusAreasZh.push('关系', '社交联系', '感情');
  }

  if (shenShaIds.includes('nobleman') || shenShaIds.includes('heavenly_virtue')) {
    emphasize.push('shen_sha');
    rationale.push('Nobleman stars provide important protection insights.');
    rationaleZh.push('贵人星提供重要的保护洞察。');
    focusAreas.push('Beneficial connections', 'Help from others', 'Protection');
    focusAreasZh.push('有益联系', '他人帮助', '保护');
  }

  if (shenShaIds.includes('literary_star') || shenShaIds.includes('academic_star')) {
    emphasize.push('shen_sha', 'ten_gods');
    rationale.push('Literary stars emphasize intellectual and creative pursuits.');
    rationaleZh.push('文昌星强调智力和创意追求。');
    focusAreas.push('Education', 'Writing', 'Intellectual growth');
    focusAreasZh.push('教育', '写作', '智力成长');
  }

  if (shenShaIds.includes('blade') || shenShaIds.includes('robbing_sha')) {
    emphasize.push('shen_sha', 'guidance');
    rationale.push('Challenging stars require attention and remedial guidance.');
    rationaleZh.push('凶星需要关注和化解指导。');
    focusAreas.push('Risk awareness', 'Caution periods', 'Protection strategies');
    focusAreasZh.push('风险意识', '谨慎时期', '保护策略');
  }

  // ===== TEN GODS-BASED SUGGESTIONS =====
  const tenGodIds = ctx.tenGods.map(t => t.id);

  if (tenGodIds.includes('HO') || tenGodIds.includes('EG')) {
    emphasize.push('ten_gods', 'guidance');
    rationale.push('Output gods suggest creative and expressive themes.');
    rationaleZh.push('食伤星表明创意和表达主题。');
    focusAreas.push('Creativity', 'Expression', 'Artistic pursuits');
    focusAreasZh.push('创造力', '表达', '艺术追求');
  }

  if (tenGodIds.includes('7K')) {
    emphasize.push('ten_gods', 'structure', 'guidance');
    rationale.push('Seven Killings indicates pressure and challenge themes.');
    rationaleZh.push('七杀表明压力和挑战主题。');
    focusAreas.push('Competition', 'Pressure management', 'Transformation');
    focusAreasZh.push('竞争', '压力管理', '转化');
  }

  // ===== USEFUL GOD-BASED SUGGESTIONS =====
  if (ctx.usefulGods.length === 0) {
    suggestedOmissions.push('useful_god');
    rationale.push('No clear Useful God detected - section may be less relevant.');
    rationaleZh.push('未检测到明确用神——该部分可能不太相关。');
  } else {
    emphasize.push('useful_god');
    rationale.push('Clear Useful God provides actionable guidance.');
    rationaleZh.push('明确的用神提供可操作的指导。');
  }

  // ===== TIMING-BASED SUGGESTIONS =====
  if (ctx.luckPillars.current) {
    emphasize.push('luck_pillars');
    rationale.push('Current luck pillar data available - timing analysis valuable.');
    rationaleZh.push('有当前大运数据——时机分析有价值。');
  }

  if (ctx.annual) {
    emphasize.push('annual');
    rationale.push('Annual data available - yearly forecast included.');
    rationaleZh.push('有流年数据——包含年度预测。');
  }

  // ===== NARRATIVE/MYTHOS SUGGESTIONS =====
  if (input.hasMythosData) {
    emphasize.push('mythos', 'narrative');
    rationale.push('Mythos data available - archetypal themes can be emphasized.');
    rationaleZh.push('有神话数据——可以强调原型主题。');
  }

  if (input.hasAncestralData) {
    emphasize.push('ancestral', 'lineage');
    rationale.push('Ancestral data available - lineage themes relevant.');
    rationaleZh.push('有祖先数据——血脉主题相关。');
  }

  // ===== USER PREFERENCE ADJUSTMENTS =====
  if (userPreferences?.isBeginner) {
    deEmphasize.push('shen_sha');
    rationale.push('Beginner mode - complex Shen Sha details de-emphasized.');
    rationaleZh.push('新手模式——复杂神煞细节降低强调。');
  }

  if (userPreferences?.wantsActionSteps !== false) {
    emphasize.push('guidance');
    rationale.push('Actionable guidance included by default.');
    rationaleZh.push('默认包含可操作的指导。');
  }

  // ===== DETERMINE RECOMMENDED TONE =====
  let recommendedTone: TonePreset = 'professional';

  if (userPreferences?.isBeginner) {
    recommendedTone = 'beginner';
    rationale.push('Beginner-friendly tone recommended for new users.');
    rationaleZh.push('为新用户推荐新手友好语调。');
  } else if (input.hasMythosData && ctx.structure.type.includes('Follow')) {
    recommendedTone = 'mythic';
    rationale.push('Mythic tone suits archetypal and follow structure themes.');
    rationaleZh.push('神话语调适合原型和从格主题。');
  } else if (userPreferences?.isBusinessContext) {
    recommendedTone = 'professional';
    rationale.push('Professional tone for business context.');
    rationaleZh.push('商务语境使用专业语调。');
  } else if (userPreferences?.wantsActionSteps) {
    recommendedTone = 'coaching';
    rationale.push('Coaching tone emphasizes practical action steps.');
    rationaleZh.push('教练语调强调实际行动步骤。');
  }

  // ===== DETERMINE RECOMMENDED ORDER =====
  const recommendedOrder = determineOrder(emphasize, deEmphasize, suggestedOmissions);

  // ===== CALCULATE CONFIDENCE =====
  const confidence = calculateConfidence(ctx, emphasize, rationale);

  return {
    recommendedOrder,
    recommendedTone,
    emphasize: [...new Set(emphasize)],
    deEmphasize: [...new Set(deEmphasize)],
    suggestedOmissions: [...new Set(suggestedOmissions)],
    rationale: [...new Set(rationale)],
    rationaleZh: [...new Set(rationaleZh)],
    confidence,
    focusAreas: [...new Set(focusAreas)],
    focusAreasZh: [...new Set(focusAreasZh)]
  };
}

/**
 * Determine optimal section order
 */
function determineOrder(
  emphasize: string[],
  deEmphasize: string[],
  omissions: string[]
): string[] {
  // Base order
  const baseOrder = [
    'core',
    'structure',
    'ten_gods',
    'useful_god',
    'shen_sha',
    'luck_pillars',
    'annual',
    'guidance'
  ];

  // Extended sections if available
  const extendedSections = [
    'narrative',
    'mythos',
    'ancestral',
    'lineage',
    'constellation',
    'simulation'
  ];

  // Filter out omissions
  let order = baseOrder.filter(s => !omissions.includes(s));

  // Move emphasized sections earlier (after core)
  for (const section of emphasize) {
    const idx = order.indexOf(section);
    if (idx > 1) {
      order.splice(idx, 1);
      order.splice(1, 0, section);
    }
  }

  // Move de-emphasized sections later (before guidance)
  for (const section of deEmphasize) {
    const idx = order.indexOf(section);
    const guidanceIdx = order.indexOf('guidance');
    if (idx !== -1 && idx < guidanceIdx - 1) {
      order.splice(idx, 1);
      order.splice(guidanceIdx - 1, 0, section);
    }
  }

  // Add extended sections at the end if emphasized
  for (const section of extendedSections) {
    if (emphasize.includes(section) && !order.includes(section)) {
      const guidanceIdx = order.indexOf('guidance');
      if (guidanceIdx !== -1) {
        order.splice(guidanceIdx, 0, section);
      } else {
        order.push(section);
      }
    }
  }

  return order;
}

/**
 * Calculate suggestion confidence
 */
function calculateConfidence(
  ctx: ReportContext2,
  emphasize: string[],
  rationale: string[]
): number {
  let confidence = 0.5; // Base confidence

  // More data = higher confidence
  if (ctx.tenGods.length > 0) confidence += 0.1;
  if (ctx.usefulGods.length > 0) confidence += 0.1;
  if (ctx.shenSha.length > 0) confidence += 0.1;
  if (ctx.luckPillars.current) confidence += 0.1;
  if (ctx.annual) confidence += 0.05;

  // More rationale = more confident
  confidence += Math.min(rationale.length * 0.02, 0.1);

  // More emphasis points = more confident
  confidence += Math.min(emphasize.length * 0.02, 0.1);

  return Math.min(confidence, 0.95);
}

// ==================== QUICK SUGGESTIONS ====================

/**
 * Quick layout suggestion for common cases
 */
export function quickSuggestLayout(structureType: string, hasTiming: boolean = true): LayoutSuggestion {
  const baseContext: LayoutContext = {
    ctx: {
      chart: {
        yearStem: '', yearBranch: '',
        monthStem: '', monthBranch: '',
        dayStem: '', dayBranch: ''
      },
      dayMaster: { element: 'Wood', strength: 'balanced' },
      structure: { type: structureType },
      tenGods: [],
      usefulGods: [],
      shenSha: [],
      luckPillars: {
        pillars: [],
        current: hasTiming ? { stem: 'Jia', branch: 'Zi', startAge: 30, endAge: 40 } : undefined
      }
    }
  };

  return suggestLayout(baseContext);
}

/**
 * Suggest emphasis based on life area focus
 */
export function suggestByLifeArea(area: 'career' | 'relationships' | 'health' | 'wealth' | 'spiritual'): {
  emphasize: string[];
  tone: TonePreset;
  rationale: string;
} {
  const suggestions: Record<string, { emphasize: string[]; tone: TonePreset; rationale: string }> = {
    career: {
      emphasize: ['structure', 'ten_gods', 'luck_pillars', 'guidance'],
      tone: 'professional',
      rationale: 'Career focus emphasizes structure and timing'
    },
    relationships: {
      emphasize: ['shen_sha', 'ten_gods', 'guidance'],
      tone: 'poetic',
      rationale: 'Relationship focus emphasizes connection stars'
    },
    health: {
      emphasize: ['useful_god', 'shen_sha', 'guidance'],
      tone: 'coaching',
      rationale: 'Health focus emphasizes element balance and guidance'
    },
    wealth: {
      emphasize: ['structure', 'useful_god', 'luck_pillars', 'annual'],
      tone: 'professional',
      rationale: 'Wealth focus emphasizes timing and resources'
    },
    spiritual: {
      emphasize: ['shen_sha', 'mythos', 'narrative', 'guidance'],
      tone: 'spiritual',
      rationale: 'Spiritual focus emphasizes deeper meaning'
    }
  };

  return suggestions[area] || suggestions.career;
}

// ==================== EXPORTS ====================

export {
  suggestLayout,
  quickSuggestLayout,
  suggestByLifeArea
};
