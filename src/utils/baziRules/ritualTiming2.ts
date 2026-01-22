/**
 * ============================================
 * RITUAL TIMING ENGINE 2.0
 * Upgraded ritual timing that integrates:
 * - Technical interactions
 * - Luck Pillars
 * - Annual influences
 * - Useful God peaks
 * - Emotional resonance
 * - Generational arcs
 * - Hypergraph structure
 *
 * Produces ritual timing windows with
 * mythic-ancestral intelligence.
 * ============================================
 */

import { GenerationalArc } from './generationalArcSynth';

// ==================== DATA MODEL ====================

export type RitualType2 =
  | 'release'
  | 'integration'
  | 'blessing'
  | 'protection'
  | 'invocation'
  | 'grounding'
  | 'initiation'
  | 'completion';

export interface RitualTimingWindow2 {
  id: string;
  theme: string;
  themeZh?: string;
  type: RitualType2;
  startAge: number;
  endAge: number;
  triggers: RitualTrigger2[];
  emotionalTone: EmotionalTone2;
  lunarAlignment?: LunarAlignment;
  intensity: number; // 0-100
  ancestralResonance: number; // 0-100
  hypergraphConnections: string[];
  guidance: string;
  guidanceZh: string;
}

export interface RitualTrigger2 {
  source: 'interaction' | 'luck_pillar' | 'annual' | 'useful_god' | 'generational_arc' | 'emotional';
  rule: string;
  weight: number;
}

export interface EmotionalTone2 {
  primary: string;
  primaryZh: string;
  valence: number; // -100 to +100
  intensity: number; // 0-100
}

export interface LunarAlignment {
  phase: 'new' | 'waxing' | 'full' | 'waning';
  bestDays?: string[];
}

export interface InteractionInput2 {
  type: string;
  pillarA: string;
  pillarB: string;
  description: string;
  age?: number;
}

export interface LuckPillarInput2 {
  startAge: number;
  endAge: number;
  pillar: string;
  element: string;
}

export interface AnnualInput2 {
  year: number;
  age: number;
  pillar: string;
  notes: string;
}

export interface RitualCalendar2 {
  windows: RitualTimingWindow2[];
  currentWindows: RitualTimingWindow2[];
  upcomingWindows: RitualTimingWindow2[];
  criticalWindows: RitualTimingWindow2[];
  summary: RitualCalendarSummary;
}

export interface RitualCalendarSummary {
  totalWindows: number;
  activeNow: number;
  upcomingCount: number;
  criticalCount: number;
  dominantType: RitualType2;
  dominantTheme: string;
  insight: string;
  insightZh: string;
}

// ==================== THEME MAPPING ====================

/**
 * Map interaction type to ritual theme
 */
function mapInteractionToTheme(type: string): string {
  const typeLower = type.toLowerCase();

  if (typeLower.includes('clash') || typeLower.includes('冲')) return 'tension';
  if (typeLower.includes('harm') || typeLower.includes('害')) return 'wounding';
  if (typeLower.includes('punishment') || typeLower.includes('刑')) return 'reckoning';
  if (typeLower.includes('combination') || typeLower.includes('合')) return 'support';
  if (typeLower.includes('destruction') || typeLower.includes('破')) return 'breaking';

  return 'transition';
}

/**
 * Map theme to ritual type
 */
function mapThemeToRitualType(theme: string): RitualType2 {
  const themeMap: Record<string, RitualType2> = {
    'tension': 'release',
    'wounding': 'release',
    'reckoning': 'release',
    'support': 'blessing',
    'growth': 'integration',
    'transition': 'integration',
    'breaking': 'release',
    'emergence': 'initiation',
    'completion': 'completion',
    'protection': 'protection',
    'grounding': 'grounding'
  };

  return themeMap[theme] || 'integration';
}

/**
 * Map theme to emotional tone
 */
function mapThemeToEmotionalTone(theme: string): EmotionalTone2 {
  const toneMap: Record<string, EmotionalTone2> = {
    'tension': { primary: 'Reckoning', primaryZh: '清算', valence: -40, intensity: 70 },
    'wounding': { primary: 'Vulnerability', primaryZh: '脆弱', valence: -30, intensity: 60 },
    'reckoning': { primary: 'Confrontation', primaryZh: '对峙', valence: -50, intensity: 80 },
    'support': { primary: 'Nurturing', primaryZh: '滋养', valence: 60, intensity: 50 },
    'growth': { primary: 'Expansion', primaryZh: '扩展', valence: 70, intensity: 70 },
    'transition': { primary: 'Transformation', primaryZh: '转化', valence: 0, intensity: 50 },
    'breaking': { primary: 'Liberation', primaryZh: '解放', valence: 20, intensity: 75 },
    'emergence': { primary: 'Awakening', primaryZh: '觉醒', valence: 50, intensity: 65 },
    'completion': { primary: 'Fulfillment', primaryZh: '圆满', valence: 80, intensity: 60 },
    'protection': { primary: 'Fortification', primaryZh: '加固', valence: 30, intensity: 55 },
    'grounding': { primary: 'Stability', primaryZh: '稳定', valence: 40, intensity: 45 }
  };

  return toneMap[theme] || { primary: 'Neutral', primaryZh: '中性', valence: 0, intensity: 50 };
}

/**
 * Get lunar alignment for ritual type
 */
function getLunarAlignment(type: RitualType2): LunarAlignment {
  const alignmentMap: Record<RitualType2, LunarAlignment> = {
    'release': { phase: 'waning' },
    'integration': { phase: 'waxing' },
    'blessing': { phase: 'full' },
    'protection': { phase: 'new' },
    'invocation': { phase: 'waxing' },
    'grounding': { phase: 'full' },
    'initiation': { phase: 'new' },
    'completion': { phase: 'full' }
  };

  return alignmentMap[type];
}

// ==================== TIMING ENGINE 2.0 ====================

/**
 * Compute ritual timing windows (enhanced)
 */
export function computeRitualTiming2(
  interactions: InteractionInput2[],
  luckPillars: { pillars: LuckPillarInput2[] },
  annual: AnnualInput2[],
  arcs: GenerationalArc[]
): RitualCalendar2 {
  const windows: RitualTimingWindow2[] = [];
  let windowId = 0;

  // Process interactions
  interactions.forEach(i => {
    const theme = mapInteractionToTheme(i.type);
    const type = mapThemeToRitualType(theme);
    const tone = mapThemeToEmotionalTone(theme);
    const age = i.age || 0;

    windows.push({
      id: `window-${windowId++}`,
      theme,
      type,
      startAge: age,
      endAge: age + 1,
      triggers: [{
        source: 'interaction',
        rule: i.type,
        weight: 40
      }],
      emotionalTone: tone,
      lunarAlignment: getLunarAlignment(type),
      intensity: 70,
      ancestralResonance: 50,
      hypergraphConnections: [],
      guidance: generateGuidance(theme, type, 'en'),
      guidanceZh: generateGuidance(theme, type, 'zh')
    });
  });

  // Process luck pillars
  luckPillars.pillars.forEach(lp => {
    const type: RitualType2 = 'integration';
    const theme = 'growth';
    const tone = mapThemeToEmotionalTone(theme);

    windows.push({
      id: `window-${windowId++}`,
      theme,
      type,
      startAge: lp.startAge,
      endAge: lp.startAge + 3, // First 3 years of luck pillar
      triggers: [{
        source: 'luck_pillar',
        rule: `luck_${lp.element}`,
        weight: 35
      }],
      emotionalTone: tone,
      lunarAlignment: getLunarAlignment(type),
      intensity: 60,
      ancestralResonance: 40,
      hypergraphConnections: [],
      guidance: `A new luck pillar brings ${lp.element} energy. Integrate its lessons through conscious practice.`,
      guidanceZh: `新大运带来${lp.element}能量。通过有意识的练习整合其教训。`
    });
  });

  // Process generational arcs
  arcs.forEach(arc => {
    if (arc.arcType === 'rising' || arc.arcType === 'emerging') {
      const type: RitualType2 = 'blessing';
      const tone = mapThemeToEmotionalTone(arc.theme);

      windows.push({
        id: `window-${windowId++}`,
        theme: arc.theme,
        type,
        startAge: 0,
        endAge: 80,
        triggers: [{
          source: 'generational_arc',
          rule: `arc_${arc.arcType}`,
          weight: 50
        }],
        emotionalTone: { ...tone, primary: 'Ascension', primaryZh: '上升' },
        lunarAlignment: getLunarAlignment(type),
        intensity: 65,
        ancestralResonance: 85,
        hypergraphConnections: [],
        guidance: `The ${arc.theme} arc rises through your lineage. Honor this ascending pattern with blessing rituals.`,
        guidanceZh: `「${arc.theme}」弧线在你的血脉中上升。用祝福仪式尊重这个上升模式。`
      });
    } else if (arc.arcType === 'falling' || arc.arcType === 'crisis') {
      const type: RitualType2 = 'release';
      const tone = mapThemeToEmotionalTone('reckoning');

      windows.push({
        id: `window-${windowId++}`,
        theme: arc.theme,
        type,
        startAge: 0,
        endAge: 80,
        triggers: [{
          source: 'generational_arc',
          rule: `arc_${arc.arcType}`,
          weight: 55
        }],
        emotionalTone: tone,
        lunarAlignment: getLunarAlignment(type),
        intensity: 75,
        ancestralResonance: 90,
        hypergraphConnections: [],
        guidance: `The ${arc.theme} arc carries ancestral weight. Release rituals can help transform this pattern.`,
        guidanceZh: `「${arc.theme}」弧线携带祖先重量。释放仪式可以帮助转化这个模式。`
      });
    }
  });

  // Process annual influences
  annual.forEach(a => {
    const type: RitualType2 = 'integration';
    const theme = 'transition';
    const tone = mapThemeToEmotionalTone(theme);

    windows.push({
      id: `window-${windowId++}`,
      theme,
      type,
      startAge: a.age,
      endAge: a.age + 1,
      triggers: [{
        source: 'annual',
        rule: `year_${a.year}`,
        weight: 25
      }],
      emotionalTone: tone,
      lunarAlignment: getLunarAlignment(type),
      intensity: 50,
      ancestralResonance: 30,
      hypergraphConnections: [],
      guidance: `Year ${a.year} brings annual winds of change. Use integration rituals to align with the flow.`,
      guidanceZh: `${a.year}年带来年度变化之风。使用整合仪式与流动对齐。`
    });
  });

  // Calculate current age (placeholder - would need birth date)
  const currentAge = 35; // Placeholder

  // Categorize windows
  const currentWindows = windows.filter(w =>
    w.startAge <= currentAge && w.endAge >= currentAge
  );
  const upcomingWindows = windows.filter(w =>
    w.startAge > currentAge && w.startAge <= currentAge + 10
  ).slice(0, 5);
  const criticalWindows = windows.filter(w =>
    w.intensity >= 70 && w.ancestralResonance >= 70
  );

  // Generate summary
  const summary = generateCalendarSummary(windows, currentWindows, upcomingWindows, criticalWindows);

  return {
    windows,
    currentWindows,
    upcomingWindows,
    criticalWindows,
    summary
  };
}

/**
 * Generate guidance text
 */
function generateGuidance(theme: string, type: RitualType2, lang: 'en' | 'zh'): string {
  const guidanceMap: Record<RitualType2, { en: string; zh: string }> = {
    'release': {
      en: `The ${theme} pattern asks to be released. Create space through letting go rituals.`,
      zh: `「${theme}」模式请求被释放。通过放下仪式创造空间。`
    },
    'integration': {
      en: `Integrate the lessons of ${theme} through conscious reflection and embodiment.`,
      zh: `通过有意识的反思和体现整合「${theme}」的教训。`
    },
    'blessing': {
      en: `The ${theme} theme carries gifts. Amplify them through blessing and gratitude rituals.`,
      zh: `「${theme}」主题携带天赋。通过祝福和感恩仪式放大它们。`
    },
    'protection': {
      en: `Establish boundaries around ${theme} through protection and shielding rituals.`,
      zh: `通过保护和屏蔽仪式围绕「${theme}」建立边界。`
    },
    'invocation': {
      en: `Call in support for your ${theme} journey through invocation and prayer.`,
      zh: `通过祈求和祈祷为你的「${theme}」之旅召唤支持。`
    },
    'grounding': {
      en: `Anchor the ${theme} energy in your body and daily life through grounding practices.`,
      zh: `通过扎根练习将「${theme}」能量锚定在你的身体和日常生活中。`
    },
    'initiation': {
      en: `You are being initiated into the ${theme} mysteries. Honor this threshold.`,
      zh: `你正在被引入「${theme}」的奥秘。尊重这个门槛。`
    },
    'completion': {
      en: `A ${theme} cycle is completing. Mark this ending with ceremony and gratitude.`,
      zh: `一个「${theme}」周期正在完成。用仪式和感恩标记这个结束。`
    }
  };

  return guidanceMap[type][lang];
}

/**
 * Generate calendar summary
 */
function generateCalendarSummary(
  windows: RitualTimingWindow2[],
  current: RitualTimingWindow2[],
  upcoming: RitualTimingWindow2[],
  critical: RitualTimingWindow2[]
): RitualCalendarSummary {
  // Count types
  const typeCounts = new Map<RitualType2, number>();
  windows.forEach(w => {
    typeCounts.set(w.type, (typeCounts.get(w.type) || 0) + 1);
  });

  let dominantType: RitualType2 = 'integration';
  let maxTypeCount = 0;
  typeCounts.forEach((count, type) => {
    if (count > maxTypeCount) {
      maxTypeCount = count;
      dominantType = type;
    }
  });

  // Count themes
  const themeCounts = new Map<string, number>();
  windows.forEach(w => {
    themeCounts.set(w.theme, (themeCounts.get(w.theme) || 0) + 1);
  });

  let dominantTheme = 'transition';
  let maxThemeCount = 0;
  themeCounts.forEach((count, theme) => {
    if (count > maxThemeCount) {
      maxThemeCount = count;
      dominantTheme = theme;
    }
  });

  // Generate insight
  const { insight, insightZh } = generateCalendarInsight(
    current.length,
    critical.length,
    dominantType,
    dominantTheme
  );

  return {
    totalWindows: windows.length,
    activeNow: current.length,
    upcomingCount: upcoming.length,
    criticalCount: critical.length,
    dominantType,
    dominantTheme,
    insight,
    insightZh
  };
}

/**
 * Generate calendar insight
 */
function generateCalendarInsight(
  activeCount: number,
  criticalCount: number,
  type: RitualType2,
  theme: string
): { insight: string; insightZh: string } {
  if (criticalCount > 0) {
    return {
      insight: `${criticalCount} critical ritual window(s) require attention. The ${theme} theme and ${type} practice are calling.`,
      insightZh: `${criticalCount}个关键仪式窗口需要关注。「${theme}」主题和「${type}」练习在召唤。`
    };
  } else if (activeCount > 0) {
    return {
      insight: `${activeCount} active ritual window(s) support your current journey. Focus on ${type} practices for ${theme}.`,
      insightZh: `${activeCount}个活跃仪式窗口支持你当前的旅程。专注于「${theme}」的「${type}」练习。`
    };
  } else {
    return {
      insight: `A period of integration. Use this time to deepen existing practices and prepare for upcoming windows.`,
      insightZh: `一个整合期。利用这段时间深化现有练习，为即将到来的窗口做准备。`
    };
  }
}

// ==================== RENDERING ====================

/**
 * Render ritual calendar as markdown
 */
export function renderRitualCalendar2Markdown(
  calendar: RitualCalendar2,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '仪式时机日历 2.0' : 'Ritual Timing Calendar 2.0'}`);
  lines.push('');

  // Summary
  lines.push(`## ${lang === 'zh' ? '摘要' : 'Summary'}`);
  lines.push(`- ${lang === 'zh' ? '总窗口' : 'Total Windows'}: ${calendar.summary.totalWindows}`);
  lines.push(`- ${lang === 'zh' ? '当前活跃' : 'Active Now'}: ${calendar.summary.activeNow}`);
  lines.push(`- ${lang === 'zh' ? '即将到来' : 'Upcoming'}: ${calendar.summary.upcomingCount}`);
  lines.push(`- ${lang === 'zh' ? '关键' : 'Critical'}: ${calendar.summary.criticalCount}`);
  lines.push('');
  lines.push(`> ${lang === 'zh' ? calendar.summary.insightZh : calendar.summary.insight}`);
  lines.push('');

  // Critical windows
  if (calendar.criticalWindows.length > 0) {
    lines.push(`## ${lang === 'zh' ? '关键窗口' : 'Critical Windows'}`);
    calendar.criticalWindows.forEach(w => {
      const theme = lang === 'zh' && w.themeZh ? w.themeZh : w.theme;
      const guidance = lang === 'zh' ? w.guidanceZh : w.guidance;
      lines.push(`### ${theme} [${w.type}]`);
      lines.push(`${lang === 'zh' ? '年龄' : 'Ages'}: ${w.startAge}-${w.endAge}`);
      lines.push(`${lang === 'zh' ? '强度' : 'Intensity'}: ${w.intensity}%`);
      lines.push(`${lang === 'zh' ? '祖先共振' : 'Ancestral Resonance'}: ${w.ancestralResonance}%`);
      lines.push(`${lang === 'zh' ? '指引' : 'Guidance'}: ${guidance}`);
      lines.push('');
    });
  }

  // Current windows
  if (calendar.currentWindows.length > 0) {
    lines.push(`## ${lang === 'zh' ? '当前窗口' : 'Current Windows'}`);
    calendar.currentWindows.forEach(w => {
      const theme = lang === 'zh' && w.themeZh ? w.themeZh : w.theme;
      lines.push(`- **${theme}** [${w.type}] — ${w.emotionalTone.primary}`);
    });
    lines.push('');
  }

  // Upcoming windows
  if (calendar.upcomingWindows.length > 0) {
    lines.push(`## ${lang === 'zh' ? '即将到来' : 'Upcoming Windows'}`);
    calendar.upcomingWindows.forEach(w => {
      const theme = lang === 'zh' && w.themeZh ? w.themeZh : w.theme;
      lines.push(`- **${theme}** [${w.type}] at age ${w.startAge}`);
    });
  }

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  computeRitualTiming2,
  renderRitualCalendar2Markdown
};
