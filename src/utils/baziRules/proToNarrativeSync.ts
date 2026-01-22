/**
 * ============================================
 * MING PAN PRO → NARRATIVE COCKPIT SYNC
 * Synchronizes:
 * - Technical BaZi chart
 * - Luck Pillars
 * - Annual analysis
 * - Interactions
 * - Useful God logic
 *
 * with:
 * - Story beats
 * - Emotional arcs
 * - Timing curves
 * - Narrative cockpit themes
 *
 * This is the bridge between "math" and "story".
 * ============================================
 */

import { NarrativeTheme, getThemeForRule } from './techToNarrativeBridge';

// ==================== DATA MODEL ====================

export interface ProToNarrativeSyncPoint {
  id: string;
  rule: string;
  ruleZh?: string;
  technical: string;
  technicalZh?: string;
  narrativeTheme: NarrativeTheme;
  narrativeImpact: string;
  narrativeImpactZh: string;
  storyBeatId?: string;
  emotionalArcPoint?: EmotionalArcSyncPoint;
  timingCurvePoint?: TimingCurveSyncPoint;
}

export interface EmotionalArcSyncPoint {
  valence: number;
  intensity: number;
  label: string;
  labelZh: string;
}

export interface TimingCurveSyncPoint {
  phase: 'rising' | 'peak' | 'falling' | 'trough' | 'stable';
  momentum: number; // -100 to +100
  label: string;
  labelZh: string;
}

export interface InteractionData {
  type: string;
  pillarA: string;
  pillarB: string;
  description: string;
  descriptionZh?: string;
}

export interface UsefulGodData {
  element: string;
  elementZh?: string;
  strength: 'strong' | 'moderate' | 'weak';
  explanation: string;
  explanationZh?: string;
}

export interface AnnualData {
  year: number;
  pillar: string;
  notes: string;
  notesZh?: string;
}

export interface NarrativeCockpitData {
  storyBeats: StoryBeat[];
  emotionalArc: EmotionalArcPoint[];
  timingCurves: TimingCurvePoint[];
}

export interface StoryBeat {
  id: string;
  label: string;
  labelZh?: string;
  themes: NarrativeTheme[];
}

export interface EmotionalArcPoint {
  timestamp: number;
  valence: number;
  intensity: number;
}

export interface TimingCurvePoint {
  timestamp: number;
  value: number;
  phase: string;
}

export interface ProNarrativeSync {
  syncPoints: ProToNarrativeSyncPoint[];
  mappedStoryBeats: MappedStoryBeat[];
  emotionalArcOverlay: EmotionalArcOverlay;
  timingCurveOverlay: TimingCurveOverlay;
  summary: SyncSummary;
}

export interface MappedStoryBeat {
  beat: StoryBeat;
  technicalSources: string[];
  syncStrength: number; // 0-100
}

export interface EmotionalArcOverlay {
  technicalPoints: { timestamp: number; valence: number; source: string }[];
  narrativePoints: { timestamp: number; valence: number }[];
  correlation: number; // -1 to 1
}

export interface TimingCurveOverlay {
  technicalPoints: { timestamp: number; value: number; source: string }[];
  narrativePoints: { timestamp: number; value: number }[];
  alignment: number; // 0-100
}

export interface SyncSummary {
  totalSyncPoints: number;
  dominantTheme: NarrativeTheme;
  overallAlignment: number;
  keyInsight: string;
  keyInsightZh: string;
}

// ==================== SYNC ENGINE ====================

/**
 * Sync Ming Pan Pro data to Narrative Cockpit
 */
export function syncProToNarrative(
  interactions: InteractionData[],
  usefulGods: UsefulGodData[],
  annual: AnnualData[],
  narrativeCockpit: NarrativeCockpitData
): ProNarrativeSync {
  const syncPoints: ProToNarrativeSyncPoint[] = [];

  // Process interactions
  interactions.forEach((i, idx) => {
    const theme = mapRuleToTheme(i.type);
    const impact = deriveNarrativeImpact(i.type, narrativeCockpit);

    syncPoints.push({
      id: `interaction-${idx}`,
      rule: i.type,
      technical: i.description,
      technicalZh: i.descriptionZh,
      narrativeTheme: theme,
      narrativeImpact: impact.en,
      narrativeImpactZh: impact.zh,
      storyBeatId: findMatchingStoryBeat(theme, narrativeCockpit.storyBeats)?.id,
      emotionalArcPoint: mapToEmotionalArc(theme),
      timingCurvePoint: mapToTimingCurve(i.type)
    });
  });

  // Process useful gods
  usefulGods.forEach((u, idx) => {
    const theme: NarrativeTheme = u.strength === 'strong' ? 'growth' : u.strength === 'weak' ? 'challenge' : 'support';

    syncPoints.push({
      id: `useful-god-${idx}`,
      rule: 'useful_god',
      ruleZh: '用神',
      technical: u.explanation,
      technicalZh: u.explanationZh,
      narrativeTheme: theme,
      narrativeImpact: `This period amplifies your ${u.element} qualities, affecting your ability to attract resources and opportunities.`,
      narrativeImpactZh: `这段时期放大你的${u.elementZh || u.element}特质，影响你吸引资源和机会的能力。`,
      emotionalArcPoint: mapToEmotionalArc(theme),
      timingCurvePoint: {
        phase: u.strength === 'strong' ? 'peak' : u.strength === 'weak' ? 'trough' : 'stable',
        momentum: u.strength === 'strong' ? 60 : u.strength === 'weak' ? -40 : 0,
        label: `Useful God ${u.strength}`,
        labelZh: `用神${u.strength === 'strong' ? '旺' : u.strength === 'weak' ? '弱' : '平'}`
      }
    });
  });

  // Process annual influences
  annual.forEach((a, idx) => {
    syncPoints.push({
      id: `annual-${idx}`,
      rule: 'annual',
      ruleZh: '流年',
      technical: a.notes,
      technicalZh: a.notesZh,
      narrativeTheme: 'transition',
      narrativeImpact: `Year ${a.year} shifts your story toward new developments: ${a.notes}`,
      narrativeImpactZh: `${a.year}年将你的故事转向新发展：${a.notesZh || a.notes}`,
      timingCurvePoint: {
        phase: 'rising',
        momentum: 30,
        label: `Year ${a.year}`,
        labelZh: `${a.year}年`
      }
    });
  });

  // Build mapped story beats
  const mappedStoryBeats = mapStoryBeats(syncPoints, narrativeCockpit.storyBeats);

  // Build overlays
  const emotionalArcOverlay = buildEmotionalArcOverlay(syncPoints, narrativeCockpit.emotionalArc);
  const timingCurveOverlay = buildTimingCurveOverlay(syncPoints, narrativeCockpit.timingCurves);

  // Generate summary
  const summary = generateSyncSummary(syncPoints, mappedStoryBeats, emotionalArcOverlay, timingCurveOverlay);

  return {
    syncPoints,
    mappedStoryBeats,
    emotionalArcOverlay,
    timingCurveOverlay,
    summary
  };
}

/**
 * Map rule to narrative theme
 */
function mapRuleToTheme(rule: string): NarrativeTheme {
  return getThemeForRule(rule);
}

/**
 * Derive narrative impact
 */
function deriveNarrativeImpact(
  rule: string,
  cockpit: NarrativeCockpitData
): { en: string; zh: string } {
  const beat = cockpit.storyBeats[0];
  const beatLabel = beat?.label || 'your current chapter';
  const beatLabelZh = beat?.labelZh || '当前篇章';

  const impacts: Record<string, { en: string; zh: string }> = {
    'clash': {
      en: `This clash energy influences the narrative beat: ${beatLabel}. Expect tension that catalyzes change.`,
      zh: `这冲的能量影响叙事节拍：${beatLabelZh}。预期催化改变的张力。`
    },
    'harm': {
      en: `The harm pattern connects to: ${beatLabel}. Hidden vulnerabilities surface for healing.`,
      zh: `害的模式连接到：${beatLabelZh}。隐藏的脆弱浮现以待疗愈。`
    },
    'punishment': {
      en: `The punishment energy echoes in: ${beatLabel}. Past patterns return for resolution.`,
      zh: `刑的能量在${beatLabelZh}中回响。过去的模式回来寻求解决。`
    },
    'combination': {
      en: `This combination harmonizes with: ${beatLabel}. Support arrives from unexpected directions.`,
      zh: `这合的能量与${beatLabelZh}和谐。支持从意想不到的方向到来。`
    }
  };

  const ruleLower = rule.toLowerCase();
  for (const [key, impact] of Object.entries(impacts)) {
    if (ruleLower.includes(key)) {
      return impact;
    }
  }

  return {
    en: `This energy influences: ${beatLabel}. Observe how it manifests.`,
    zh: `这能量影响：${beatLabelZh}。观察它如何显现。`
  };
}

/**
 * Find matching story beat for theme
 */
function findMatchingStoryBeat(
  theme: NarrativeTheme,
  storyBeats: StoryBeat[]
): StoryBeat | undefined {
  return storyBeats.find(beat => beat.themes.includes(theme));
}

/**
 * Map theme to emotional arc point
 */
function mapToEmotionalArc(theme: NarrativeTheme): EmotionalArcSyncPoint {
  const arcMap: Record<NarrativeTheme, EmotionalArcSyncPoint> = {
    'tension': { valence: -40, intensity: 70, label: 'Tension', labelZh: '张力' },
    'vulnerability': { valence: -30, intensity: 50, label: 'Vulnerability', labelZh: '脆弱' },
    'support': { valence: 60, intensity: 60, label: 'Support', labelZh: '支持' },
    'growth': { valence: 70, intensity: 80, label: 'Growth', labelZh: '成长' },
    'transition': { valence: 0, intensity: 50, label: 'Transition', labelZh: '过渡' },
    'challenge': { valence: -20, intensity: 60, label: 'Challenge', labelZh: '挑战' },
    'opportunity': { valence: 50, intensity: 70, label: 'Opportunity', labelZh: '机会' },
    'reckoning': { valence: -50, intensity: 80, label: 'Reckoning', labelZh: '清算' },
    'blessing': { valence: 80, intensity: 70, label: 'Blessing', labelZh: '祝福' },
    'shadow': { valence: -40, intensity: 60, label: 'Shadow', labelZh: '阴影' },
    'integration': { valence: 40, intensity: 50, label: 'Integration', labelZh: '整合' },
    'emergence': { valence: 30, intensity: 65, label: 'Emergence', labelZh: '涌现' }
  };

  return arcMap[theme] || arcMap['transition'];
}

/**
 * Map rule to timing curve point
 */
function mapToTimingCurve(rule: string): TimingCurveSyncPoint {
  const ruleLower = rule.toLowerCase();

  if (ruleLower.includes('clash') || ruleLower.includes('punishment')) {
    return { phase: 'falling', momentum: -50, label: 'Disruption', labelZh: '扰动' };
  }
  if (ruleLower.includes('combination')) {
    return { phase: 'rising', momentum: 40, label: 'Convergence', labelZh: '汇聚' };
  }
  if (ruleLower.includes('harm')) {
    return { phase: 'trough', momentum: -30, label: 'Vulnerability', labelZh: '脆弱' };
  }

  return { phase: 'stable', momentum: 0, label: 'Neutral', labelZh: '中性' };
}

/**
 * Map story beats to sync points
 */
function mapStoryBeats(
  syncPoints: ProToNarrativeSyncPoint[],
  storyBeats: StoryBeat[]
): MappedStoryBeat[] {
  return storyBeats.map(beat => {
    const matchingSyncPoints = syncPoints.filter(sp =>
      beat.themes.includes(sp.narrativeTheme)
    );

    return {
      beat,
      technicalSources: matchingSyncPoints.map(sp => sp.rule),
      syncStrength: Math.min(100, matchingSyncPoints.length * 25)
    };
  });
}

/**
 * Build emotional arc overlay
 */
function buildEmotionalArcOverlay(
  syncPoints: ProToNarrativeSyncPoint[],
  narrativeArc: EmotionalArcPoint[]
): EmotionalArcOverlay {
  const technicalPoints = syncPoints
    .filter(sp => sp.emotionalArcPoint)
    .map((sp, idx) => ({
      timestamp: idx,
      valence: sp.emotionalArcPoint!.valence,
      source: sp.rule
    }));

  const narrativePoints = narrativeArc.map(p => ({
    timestamp: p.timestamp,
    valence: p.valence
  }));

  // Calculate correlation (simplified)
  const correlation = calculateCorrelation(
    technicalPoints.map(p => p.valence),
    narrativePoints.slice(0, technicalPoints.length).map(p => p.valence)
  );

  return { technicalPoints, narrativePoints, correlation };
}

/**
 * Build timing curve overlay
 */
function buildTimingCurveOverlay(
  syncPoints: ProToNarrativeSyncPoint[],
  narrativeCurves: TimingCurvePoint[]
): TimingCurveOverlay {
  const technicalPoints = syncPoints
    .filter(sp => sp.timingCurvePoint)
    .map((sp, idx) => ({
      timestamp: idx,
      value: sp.timingCurvePoint!.momentum,
      source: sp.rule
    }));

  const narrativePoints = narrativeCurves.map(p => ({
    timestamp: p.timestamp,
    value: p.value
  }));

  // Calculate alignment (simplified)
  const alignment = calculateAlignment(
    technicalPoints.map(p => p.value),
    narrativePoints.slice(0, technicalPoints.length).map(p => p.value)
  );

  return { technicalPoints, narrativePoints, alignment };
}

/**
 * Calculate correlation between two arrays
 */
function calculateCorrelation(arr1: number[], arr2: number[]): number {
  if (arr1.length === 0 || arr2.length === 0) return 0;

  const n = Math.min(arr1.length, arr2.length);
  const mean1 = arr1.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.slice(0, n).reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  if (denom1 === 0 || denom2 === 0) return 0;
  return numerator / Math.sqrt(denom1 * denom2);
}

/**
 * Calculate alignment between two arrays
 */
function calculateAlignment(arr1: number[], arr2: number[]): number {
  if (arr1.length === 0 || arr2.length === 0) return 50;

  const n = Math.min(arr1.length, arr2.length);
  let alignedCount = 0;

  for (let i = 0; i < n; i++) {
    const sign1 = Math.sign(arr1[i]);
    const sign2 = Math.sign(arr2[i]);
    if (sign1 === sign2 || sign1 === 0 || sign2 === 0) {
      alignedCount++;
    }
  }

  return Math.round((alignedCount / n) * 100);
}

/**
 * Generate sync summary
 */
function generateSyncSummary(
  syncPoints: ProToNarrativeSyncPoint[],
  mappedStoryBeats: MappedStoryBeat[],
  emotionalArcOverlay: EmotionalArcOverlay,
  timingCurveOverlay: TimingCurveOverlay
): SyncSummary {
  // Count themes
  const themeCounts = new Map<NarrativeTheme, number>();
  syncPoints.forEach(sp => {
    themeCounts.set(sp.narrativeTheme, (themeCounts.get(sp.narrativeTheme) || 0) + 1);
  });

  let dominantTheme: NarrativeTheme = 'transition';
  let maxCount = 0;
  themeCounts.forEach((count, theme) => {
    if (count > maxCount) {
      maxCount = count;
      dominantTheme = theme;
    }
  });

  // Calculate overall alignment
  const storyBeatAlignment = mappedStoryBeats.reduce((sum, mb) => sum + mb.syncStrength, 0) / (mappedStoryBeats.length || 1);
  const overallAlignment = Math.round((storyBeatAlignment + timingCurveOverlay.alignment + ((emotionalArcOverlay.correlation + 1) * 50)) / 3);

  // Generate key insight
  const { insight, insightZh } = generateKeyInsight(dominantTheme, overallAlignment);

  return {
    totalSyncPoints: syncPoints.length,
    dominantTheme,
    overallAlignment,
    keyInsight: insight,
    keyInsightZh: insightZh
  };
}

/**
 * Generate key insight
 */
function generateKeyInsight(
  theme: NarrativeTheme,
  alignment: number
): { insight: string; insightZh: string } {
  if (alignment > 70) {
    return {
      insight: `Your technical chart and narrative arc are highly aligned around the theme of ${theme}. Trust this direction.`,
      insightZh: `你的技术命盘与叙事弧高度对齐于「${theme}」主题。信任这个方向。`
    };
  } else if (alignment > 40) {
    return {
      insight: `The ${theme} theme weaves through both your chart and story, with room for deeper integration.`,
      insightZh: `「${theme}」主题贯穿你的命盘和故事，有更深整合的空间。`
    };
  } else {
    return {
      insight: `There is creative tension between your technical indicators and narrative flow. This invites conscious attention.`,
      insightZh: `你的技术指标与叙事流之间存在创造性张力。这邀请有意识的关注。`
    };
  }
}

// ==================== RENDERING ====================

/**
 * Render sync as markdown
 */
export function renderProNarrativeSyncMarkdown(
  sync: ProNarrativeSync,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '专业版→叙事同步' : 'Pro → Narrative Sync'}`);
  lines.push('');

  // Summary
  lines.push(`## ${lang === 'zh' ? '同步摘要' : 'Sync Summary'}`);
  lines.push(`- ${lang === 'zh' ? '同步点总数' : 'Total Sync Points'}: ${sync.summary.totalSyncPoints}`);
  lines.push(`- ${lang === 'zh' ? '主导主题' : 'Dominant Theme'}: ${sync.summary.dominantTheme}`);
  lines.push(`- ${lang === 'zh' ? '整体对齐度' : 'Overall Alignment'}: ${sync.summary.overallAlignment}%`);
  lines.push('');
  lines.push(`> ${lang === 'zh' ? sync.summary.keyInsightZh : sync.summary.keyInsight}`);
  lines.push('');

  // Sync points
  lines.push(`## ${lang === 'zh' ? '同步点' : 'Sync Points'}`);
  sync.syncPoints.forEach(sp => {
    const rule = lang === 'zh' && sp.ruleZh ? sp.ruleZh : sp.rule;
    const impact = lang === 'zh' ? sp.narrativeImpactZh : sp.narrativeImpact;
    lines.push(`### ${rule} → ${sp.narrativeTheme}`);
    lines.push(impact);
    lines.push('');
  });

  // Mapped story beats
  lines.push(`## ${lang === 'zh' ? '故事节拍映射' : 'Story Beat Mapping'}`);
  sync.mappedStoryBeats.forEach(mb => {
    const label = lang === 'zh' && mb.beat.labelZh ? mb.beat.labelZh : mb.beat.label;
    lines.push(`- **${label}**: ${mb.syncStrength}% ${lang === 'zh' ? '同步强度' : 'sync strength'}`);
    lines.push(`  ${lang === 'zh' ? '来源' : 'Sources'}: ${mb.technicalSources.join(', ')}`);
  });

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  syncProToNarrative,
  renderProNarrativeSyncMarkdown
};
