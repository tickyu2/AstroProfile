/**
 * ============================================
 * MING PAN PRO → ANCESTRAL TEMPLE SYNC
 * Synchronizes:
 * - Technical BaZi (Ming Pan Pro)
 * - Generational Ladder
 * - Ancestral Threads
 * - Pilgrim Position
 * - Ritual Timing
 * - Mythos Hypergraph
 *
 * The bridge between technical chart and ancestral temple.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread } from './generationalLadder';
import { RitualTimingWindow } from './ritualTiming';

// ==================== DATA MODEL ====================

export interface ProTempleSyncPoint {
  id: string;
  rule: string;
  ruleZh?: string;
  technical: string;
  technicalZh?: string;
  ancestralTheme: AncestralTheme;
  generationalImpact: string;
  generationalImpactZh: string;
  ritualTrigger?: string;
  affectedGenerations: number[];
  threadIds: string[];
  hypergraphNodeIds: string[];
}

export type AncestralTheme =
  | 'tension'
  | 'wounding'
  | 'support'
  | 'reckoning'
  | 'transition'
  | 'inheritance'
  | 'breaking'
  | 'healing'
  | 'blessing'
  | 'shadow';

export interface InteractionInput {
  type: string;
  pillarA: string;
  pillarB: string;
  description: string;
  descriptionZh?: string;
}

export interface AnnualInput {
  year: number;
  pillar: string;
  notes: string;
  notesZh?: string;
}

export interface ProTempleSync {
  syncPoints: ProTempleSyncPoint[];
  affectedThreads: AffectedThread[];
  ritualActivations: RitualActivation[];
  summary: ProTempleSyncSummary;
}

export interface AffectedThread {
  threadId: string;
  theme: string;
  syncPointIds: string[];
  resonanceStrength: number;
}

export interface RitualActivation {
  theme: string;
  type: string;
  triggeredBy: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProTempleSyncSummary {
  totalSyncPoints: number;
  dominantTheme: AncestralTheme;
  activatedThreads: number;
  ritualActivations: number;
  generationalDepth: number;
  insight: string;
  insightZh: string;
}

// ==================== THEME MAPPING ====================

/**
 * Map interaction type to ancestral theme
 */
export function mapInteractionToAncestralTheme(type: string): AncestralTheme {
  const typeLower = type.toLowerCase();

  if (typeLower.includes('clash') || typeLower.includes('冲')) {
    return 'tension';
  }
  if (typeLower.includes('harm') || typeLower.includes('害')) {
    return 'wounding';
  }
  if (typeLower.includes('combination') || typeLower.includes('合')) {
    return 'support';
  }
  if (typeLower.includes('punishment') || typeLower.includes('刑')) {
    return 'reckoning';
  }
  if (typeLower.includes('destruction') || typeLower.includes('破')) {
    return 'breaking';
  }
  if (typeLower.includes('fu_yin') || typeLower.includes('伏吟')) {
    return 'shadow';
  }
  if (typeLower.includes('nobleman') || typeLower.includes('贵人')) {
    return 'blessing';
  }

  return 'transition';
}

/**
 * Get ancestral theme label
 */
export function getAncestralThemeLabel(theme: AncestralTheme, lang: 'en' | 'zh' = 'en'): string {
  const labels: Record<AncestralTheme, { en: string; zh: string }> = {
    'tension': { en: 'Tension', zh: '张力' },
    'wounding': { en: 'Wounding', zh: '伤痛' },
    'support': { en: 'Support', zh: '支持' },
    'reckoning': { en: 'Reckoning', zh: '清算' },
    'transition': { en: 'Transition', zh: '过渡' },
    'inheritance': { en: 'Inheritance', zh: '传承' },
    'breaking': { en: 'Breaking', zh: '破局' },
    'healing': { en: 'Healing', zh: '疗愈' },
    'blessing': { en: 'Blessing', zh: '祝福' },
    'shadow': { en: 'Shadow', zh: '阴影' }
  };

  return labels[theme][lang];
}

// ==================== SYNC ENGINE ====================

/**
 * Synchronize Ming Pan Pro data to Ancestral Temple
 */
export function syncProToTemple(
  interactions: InteractionInput[],
  annual: AnnualInput[],
  ladder: GenerationalLadder,
  threads: GenerationalThread[],
  ritualWindows: RitualTimingWindow[]
): ProTempleSync {
  const syncPoints: ProTempleSyncPoint[] = [];

  // Process interactions
  interactions.forEach((i, idx) => {
    const theme = mapInteractionToAncestralTheme(i.type);
    const matchingThreads = threads.filter(t =>
      t.theme.toLowerCase() === theme || matchesTheme(t.theme, theme)
    );
    const affectedGens = matchingThreads.flatMap(t => t.generations || []);
    const ritualTrigger = ritualWindows.find(w =>
      w.theme === theme || matchesTheme(w.theme, theme)
    )?.type;

    syncPoints.push({
      id: `interaction-sync-${idx}`,
      rule: i.type,
      technical: i.description,
      technicalZh: i.descriptionZh,
      ancestralTheme: theme,
      generationalImpact: buildGenerationalImpact(theme, matchingThreads, 'en'),
      generationalImpactZh: buildGenerationalImpact(theme, matchingThreads, 'zh'),
      ritualTrigger,
      affectedGenerations: [...new Set(affectedGens)],
      threadIds: matchingThreads.map(t => t.id),
      hypergraphNodeIds: [] // Would be populated by hypergraph lookup
    });
  });

  // Process annual influences
  annual.forEach((a, idx) => {
    syncPoints.push({
      id: `annual-sync-${idx}`,
      rule: 'annual',
      ruleZh: '流年',
      technical: a.notes,
      technicalZh: a.notesZh,
      ancestralTheme: 'transition',
      generationalImpact: 'Annual shifts influence the pilgrim\'s position in the lineage timeline.',
      generationalImpactZh: '流年变化影响行者在血脉时间线中的位置。',
      affectedGenerations: [0], // Current generation
      threadIds: [],
      hypergraphNodeIds: []
    });
  });

  // Calculate affected threads
  const affectedThreads = calculateAffectedThreads(syncPoints, threads);

  // Calculate ritual activations
  const ritualActivations = calculateRitualActivations(syncPoints, ritualWindows);

  // Generate summary
  const summary = generateSyncSummary(syncPoints, affectedThreads, ritualActivations, ladder);

  return {
    syncPoints,
    affectedThreads,
    ritualActivations,
    summary
  };
}

/**
 * Check if themes match (fuzzy matching)
 */
function matchesTheme(theme1: string, theme2: string | AncestralTheme): boolean {
  const t1 = theme1.toLowerCase();
  const t2 = theme2.toLowerCase();

  // Direct match
  if (t1 === t2) return true;

  // Related themes
  const relatedThemes: Record<string, string[]> = {
    'tension': ['conflict', 'clash', 'opposition', 'friction'],
    'wounding': ['harm', 'hurt', 'pain', 'injury'],
    'support': ['help', 'combination', 'alliance', 'cooperation'],
    'reckoning': ['punishment', 'consequence', 'judgment', 'karma'],
    'transition': ['change', 'shift', 'movement', 'transformation'],
    'inheritance': ['legacy', 'passing', 'tradition'],
    'breaking': ['destruction', 'ending', 'release'],
    'healing': ['recovery', 'restoration', 'integration'],
    'blessing': ['fortune', 'grace', 'gift'],
    'shadow': ['hidden', 'unconscious', 'repressed']
  };

  const related1 = relatedThemes[t1] || [];
  const related2 = relatedThemes[t2] || [];

  return related1.includes(t2) || related2.includes(t1);
}

/**
 * Build generational impact description
 */
function buildGenerationalImpact(
  theme: AncestralTheme,
  threads: GenerationalThread[],
  lang: 'en' | 'zh'
): string {
  if (threads.length === 0) {
    return lang === 'zh'
      ? '此主题暂未连接到明确的代际线索。'
      : 'This theme does not yet connect to identified generational threads.';
  }

  const gens = [...new Set(threads.flatMap(t => t.generations || []))].sort((a, b) => a - b);
  const genStr = gens.join(' → ');

  return lang === 'zh'
    ? `此主题「${getAncestralThemeLabel(theme, 'zh')}」跨代回响：${genStr}`
    : `This theme of ${getAncestralThemeLabel(theme, 'en').toLowerCase()} echoes across generations: ${genStr}`;
}

/**
 * Calculate affected threads from sync points
 */
function calculateAffectedThreads(
  syncPoints: ProTempleSyncPoint[],
  threads: GenerationalThread[]
): AffectedThread[] {
  const threadMap = new Map<string, { syncPointIds: string[]; resonanceSum: number }>();

  syncPoints.forEach(sp => {
    sp.threadIds.forEach(tid => {
      const existing = threadMap.get(tid) || { syncPointIds: [], resonanceSum: 0 };
      existing.syncPointIds.push(sp.id);
      existing.resonanceSum += 1;
      threadMap.set(tid, existing);
    });
  });

  return threads
    .filter(t => threadMap.has(t.id))
    .map(t => {
      const data = threadMap.get(t.id)!;
      return {
        threadId: t.id,
        theme: t.theme,
        syncPointIds: data.syncPointIds,
        resonanceStrength: Math.min(100, data.resonanceSum * 25)
      };
    });
}

/**
 * Calculate ritual activations from sync points
 */
function calculateRitualActivations(
  syncPoints: ProTempleSyncPoint[],
  ritualWindows: RitualTimingWindow[]
): RitualActivation[] {
  const activations: RitualActivation[] = [];
  const themeToSyncPoints = new Map<string, string[]>();

  // Group sync points by ritual trigger
  syncPoints.forEach(sp => {
    if (sp.ritualTrigger) {
      const existing = themeToSyncPoints.get(sp.ancestralTheme) || [];
      existing.push(sp.rule);
      themeToSyncPoints.set(sp.ancestralTheme, existing);
    }
  });

  themeToSyncPoints.forEach((triggers, theme) => {
    const window = ritualWindows.find(w => matchesTheme(w.theme, theme));
    if (window) {
      activations.push({
        theme,
        type: window.type,
        triggeredBy: triggers,
        urgency: triggers.length >= 3 ? 'critical' :
                 triggers.length >= 2 ? 'high' :
                 triggers.length >= 1 ? 'medium' : 'low'
      });
    }
  });

  return activations;
}

/**
 * Generate sync summary
 */
function generateSyncSummary(
  syncPoints: ProTempleSyncPoint[],
  affectedThreads: AffectedThread[],
  ritualActivations: RitualActivation[],
  ladder: GenerationalLadder
): ProTempleSyncSummary {
  // Count themes
  const themeCounts = new Map<AncestralTheme, number>();
  syncPoints.forEach(sp => {
    themeCounts.set(sp.ancestralTheme, (themeCounts.get(sp.ancestralTheme) || 0) + 1);
  });

  let dominantTheme: AncestralTheme = 'transition';
  let maxCount = 0;
  themeCounts.forEach((count, theme) => {
    if (count > maxCount) {
      maxCount = count;
      dominantTheme = theme;
    }
  });

  // Calculate generational depth
  const allGens = syncPoints.flatMap(sp => sp.affectedGenerations);
  const generationalDepth = allGens.length > 0 ? Math.max(...allGens) - Math.min(...allGens) + 1 : 0;

  // Generate insight
  const { insight, insightZh } = generateInsight(dominantTheme, affectedThreads.length, ritualActivations.length);

  return {
    totalSyncPoints: syncPoints.length,
    dominantTheme,
    activatedThreads: affectedThreads.length,
    ritualActivations: ritualActivations.length,
    generationalDepth,
    insight,
    insightZh
  };
}

/**
 * Generate insight text
 */
function generateInsight(
  theme: AncestralTheme,
  threadCount: number,
  ritualCount: number
): { insight: string; insightZh: string } {
  const themeEn = getAncestralThemeLabel(theme, 'en').toLowerCase();
  const themeZh = getAncestralThemeLabel(theme, 'zh');

  if (ritualCount > 0 && threadCount > 2) {
    return {
      insight: `The theme of ${themeEn} resonates deeply through your lineage. ${ritualCount} ritual(s) have been activated to address ancestral patterns.`,
      insightZh: `「${themeZh}」主题在你的血脉中深深共振。${ritualCount}个仪式已被激活，以处理祖先模式。`
    };
  } else if (threadCount > 0) {
    return {
      insight: `The ${themeEn} theme connects your technical chart to ${threadCount} generational thread(s). The ancestors speak through your pillars.`,
      insightZh: `「${themeZh}」主题将你的命盘连接到${threadCount}条代际线索。祖先通过你的四柱说话。`
    };
  } else {
    return {
      insight: `Your chart's ${themeEn} patterns are establishing new threads in the lineage. You are the founding generation.`,
      insightZh: `你命盘中的「${themeZh}」模式正在血脉中建立新线索。你是开创的一代。`
    };
  }
}

// ==================== RENDERING ====================

/**
 * Render sync as markdown
 */
export function renderProTempleSyncMarkdown(
  sync: ProTempleSync,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '专业版→庙堂同步' : 'Pro → Temple Sync'}`);
  lines.push('');

  // Summary
  lines.push(`## ${lang === 'zh' ? '摘要' : 'Summary'}`);
  lines.push(`- ${lang === 'zh' ? '同步点' : 'Sync Points'}: ${sync.summary.totalSyncPoints}`);
  lines.push(`- ${lang === 'zh' ? '主导主题' : 'Dominant Theme'}: ${getAncestralThemeLabel(sync.summary.dominantTheme, lang)}`);
  lines.push(`- ${lang === 'zh' ? '激活线索' : 'Activated Threads'}: ${sync.summary.activatedThreads}`);
  lines.push(`- ${lang === 'zh' ? '仪式激活' : 'Ritual Activations'}: ${sync.summary.ritualActivations}`);
  lines.push(`- ${lang === 'zh' ? '代际深度' : 'Generational Depth'}: ${sync.summary.generationalDepth}`);
  lines.push('');
  lines.push(`> ${lang === 'zh' ? sync.summary.insightZh : sync.summary.insight}`);
  lines.push('');

  // Sync points
  lines.push(`## ${lang === 'zh' ? '同步点' : 'Sync Points'}`);
  sync.syncPoints.forEach(sp => {
    const rule = lang === 'zh' && sp.ruleZh ? sp.ruleZh : sp.rule;
    const impact = lang === 'zh' ? sp.generationalImpactZh : sp.generationalImpact;
    lines.push(`### ${rule} → ${getAncestralThemeLabel(sp.ancestralTheme, lang)}`);
    lines.push(impact);
    if (sp.ritualTrigger) {
      lines.push(`${lang === 'zh' ? '仪式触发' : 'Ritual Trigger'}: ${sp.ritualTrigger}`);
    }
    lines.push('');
  });

  // Ritual activations
  if (sync.ritualActivations.length > 0) {
    lines.push(`## ${lang === 'zh' ? '仪式激活' : 'Ritual Activations'}`);
    sync.ritualActivations.forEach(ra => {
      lines.push(`- **${ra.theme}** [${ra.type}] — ${lang === 'zh' ? '紧急度' : 'Urgency'}: ${ra.urgency}`);
    });
  }

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  syncProToTemple,
  mapInteractionToAncestralTheme,
  getAncestralThemeLabel,
  renderProTempleSyncMarkdown
};
