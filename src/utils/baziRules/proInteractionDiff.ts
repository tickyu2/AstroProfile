/**
 * ============================================
 * MING PAN PRO INTERACTION DIFF ENGINE
 * Professional-grade diff engine comparing:
 * - Clashes (冲)
 * - Harms (害)
 * - Punishments (刑)
 * - Combinations (合)
 * - Fu Yin (伏吟)
 * - Death & Emptiness (空亡)
 * - Seasonal strength
 * - Useful God shifts
 * - Luck Pillar transitions
 *
 * This mirrors Joey Yap's "Interaction Analysis"
 * with enhanced clarity and structure.
 * ============================================
 */

// ==================== DATA MODEL ====================

export type InteractionType =
  | 'clash'           // 冲
  | 'harm'            // 害
  | 'punishment'      // 刑
  | 'combination'     // 合
  | 'destruction'     // 破
  | 'fu_yin'          // 伏吟
  | 'fan_yin'         // 反吟
  | 'death_emptiness' // 空亡
  | 'seasonal'        // 季节强弱
  | 'useful_god'      // 用神变化
  | 'luck_transition' // 大运转换
  | 'annual'          // 流年影响
  | 'monthly';        // 流月影响

export interface InteractionEvent {
  type: InteractionType;
  pillarA: string;
  pillarB: string;
  description: string;
  descriptionZh?: string;
  severity: 'mild' | 'moderate' | 'strong' | 'critical';
  element?: string;
  timestamp?: number;
}

export interface InteractionDiff {
  added: InteractionEvent[];
  removed: InteractionEvent[];
  unchanged: InteractionEvent[];
  summary: DiffSummary;
}

export interface DiffSummary {
  totalAdded: number;
  totalRemoved: number;
  totalUnchanged: number;
  netChange: number;
  dominantChangeType?: InteractionType;
  overallTrend: 'positive' | 'negative' | 'neutral' | 'mixed';
}

export interface InteractionSnapshot {
  timestamp: number;
  label: string;
  labelZh?: string;
  interactions: InteractionEvent[];
}

export interface InteractionTimeline {
  snapshots: InteractionSnapshot[];
  diffs: { from: number; to: number; diff: InteractionDiff }[];
}

// ==================== DIFF ENGINE ====================

/**
 * Generate a unique key for an interaction event
 */
function getInteractionKey(e: InteractionEvent): string {
  return `${e.type}:${e.pillarA}:${e.pillarB}`;
}

/**
 * Diff two sets of interactions
 */
export function diffInteractions(
  before: InteractionEvent[],
  after: InteractionEvent[]
): InteractionDiff {
  const beforeMap = new Map(before.map(e => [getInteractionKey(e), e]));
  const afterMap = new Map(after.map(e => [getInteractionKey(e), e]));

  const added: InteractionEvent[] = [];
  const removed: InteractionEvent[] = [];
  const unchanged: InteractionEvent[] = [];

  // Find added and unchanged
  afterMap.forEach((ev, k) => {
    if (!beforeMap.has(k)) {
      added.push(ev);
    } else {
      unchanged.push(ev);
    }
  });

  // Find removed
  beforeMap.forEach((ev, k) => {
    if (!afterMap.has(k)) {
      removed.push(ev);
    }
  });

  // Calculate summary
  const summary = calculateDiffSummary(added, removed, unchanged);

  return { added, removed, unchanged, summary };
}

/**
 * Calculate diff summary statistics
 */
function calculateDiffSummary(
  added: InteractionEvent[],
  removed: InteractionEvent[],
  unchanged: InteractionEvent[]
): DiffSummary {
  const totalAdded = added.length;
  const totalRemoved = removed.length;
  const totalUnchanged = unchanged.length;
  const netChange = totalAdded - totalRemoved;

  // Find dominant change type
  const typeCount = new Map<InteractionType, number>();
  [...added, ...removed].forEach(e => {
    typeCount.set(e.type, (typeCount.get(e.type) || 0) + 1);
  });

  let dominantChangeType: InteractionType | undefined;
  let maxCount = 0;
  typeCount.forEach((count, type) => {
    if (count > maxCount) {
      maxCount = count;
      dominantChangeType = type;
    }
  });

  // Determine overall trend
  const addedSeverityScore = added.reduce((sum, e) => sum + getSeverityScore(e.severity), 0);
  const removedSeverityScore = removed.reduce((sum, e) => sum + getSeverityScore(e.severity), 0);

  let overallTrend: 'positive' | 'negative' | 'neutral' | 'mixed';
  if (netChange === 0 && totalAdded === 0) {
    overallTrend = 'neutral';
  } else if (removedSeverityScore > addedSeverityScore) {
    overallTrend = 'positive'; // Removing negative interactions is positive
  } else if (addedSeverityScore > removedSeverityScore) {
    overallTrend = 'negative'; // Adding interactions is typically challenging
  } else {
    overallTrend = 'mixed';
  }

  return {
    totalAdded,
    totalRemoved,
    totalUnchanged,
    netChange,
    dominantChangeType,
    overallTrend
  };
}

/**
 * Get numeric score for severity
 */
function getSeverityScore(severity: InteractionEvent['severity']): number {
  switch (severity) {
    case 'mild': return 1;
    case 'moderate': return 2;
    case 'strong': return 3;
    case 'critical': return 4;
    default: return 1;
  }
}

// ==================== TIMELINE ANALYSIS ====================

/**
 * Build a timeline of interaction snapshots
 */
export function buildInteractionTimeline(
  snapshots: InteractionSnapshot[]
): InteractionTimeline {
  const diffs: { from: number; to: number; diff: InteractionDiff }[] = [];

  for (let i = 0; i < snapshots.length - 1; i++) {
    const from = snapshots[i];
    const to = snapshots[i + 1];

    diffs.push({
      from: from.timestamp,
      to: to.timestamp,
      diff: diffInteractions(from.interactions, to.interactions)
    });
  }

  return { snapshots, diffs };
}

/**
 * Get the most significant changes in a timeline
 */
export function getSignificantChanges(
  timeline: InteractionTimeline,
  limit: number = 5
): { timestamp: number; event: InteractionEvent; action: 'added' | 'removed' }[] {
  const changes: { timestamp: number; event: InteractionEvent; action: 'added' | 'removed' }[] = [];

  timeline.diffs.forEach(d => {
    d.diff.added.forEach(e => {
      changes.push({ timestamp: d.to, event: e, action: 'added' });
    });
    d.diff.removed.forEach(e => {
      changes.push({ timestamp: d.to, event: e, action: 'removed' });
    });
  });

  // Sort by severity and return top N
  return changes
    .sort((a, b) => getSeverityScore(b.event.severity) - getSeverityScore(a.event.severity))
    .slice(0, limit);
}

// ==================== COMPARISON UTILITIES ====================

/**
 * Compare two charts' interactions
 */
export function compareChartInteractions(
  chartA: { label: string; interactions: InteractionEvent[] },
  chartB: { label: string; interactions: InteractionEvent[] }
): {
  onlyInA: InteractionEvent[];
  onlyInB: InteractionEvent[];
  shared: InteractionEvent[];
  compatibility: number;
} {
  const diff = diffInteractions(chartA.interactions, chartB.interactions);

  // Compatibility is based on shared vs unique
  const total = diff.added.length + diff.removed.length + diff.unchanged.length;
  const compatibility = total > 0 ? Math.round((diff.unchanged.length / total) * 100) : 100;

  return {
    onlyInA: diff.removed,
    onlyInB: diff.added,
    shared: diff.unchanged,
    compatibility
  };
}

/**
 * Find interaction patterns across multiple snapshots
 */
export function findRecurringPatterns(
  timeline: InteractionTimeline
): { pattern: InteractionType; frequency: number; avgSeverity: number }[] {
  const patternCounts = new Map<InteractionType, { count: number; severitySum: number }>();

  timeline.snapshots.forEach(snapshot => {
    snapshot.interactions.forEach(i => {
      const existing = patternCounts.get(i.type) || { count: 0, severitySum: 0 };
      patternCounts.set(i.type, {
        count: existing.count + 1,
        severitySum: existing.severitySum + getSeverityScore(i.severity)
      });
    });
  });

  const patterns: { pattern: InteractionType; frequency: number; avgSeverity: number }[] = [];
  patternCounts.forEach((data, type) => {
    patterns.push({
      pattern: type,
      frequency: data.count,
      avgSeverity: data.count > 0 ? data.severitySum / data.count : 0
    });
  });

  return patterns.sort((a, b) => b.frequency - a.frequency);
}

// ==================== RENDERING UTILITIES ====================

/**
 * Get icon for interaction type
 */
export function getInteractionIcon(type: InteractionType): string {
  switch (type) {
    case 'clash': return '⚔️';
    case 'harm': return '💔';
    case 'punishment': return '⚠️';
    case 'combination': return '🤝';
    case 'destruction': return '💥';
    case 'fu_yin': return '🔄';
    case 'fan_yin': return '↩️';
    case 'death_emptiness': return '🌑';
    case 'seasonal': return '🌿';
    case 'useful_god': return '⭐';
    case 'luck_transition': return '🔀';
    case 'annual': return '📅';
    case 'monthly': return '📆';
    default: return '•';
  }
}

/**
 * Get color for severity
 */
export function getSeverityColor(severity: InteractionEvent['severity']): string {
  switch (severity) {
    case 'mild': return '#6b8e23';
    case 'moderate': return '#daa520';
    case 'strong': return '#cd853f';
    case 'critical': return '#dc143c';
    default: return '#808080';
  }
}

/**
 * Format interaction for display
 */
export function formatInteraction(e: InteractionEvent, lang: 'en' | 'zh' = 'en'): string {
  const icon = getInteractionIcon(e.type);
  const desc = lang === 'zh' && e.descriptionZh ? e.descriptionZh : e.description;
  return `${icon} ${e.type}: ${e.pillarA} ↔ ${e.pillarB} — ${desc}`;
}

/**
 * Render interaction diff as markdown
 */
export function renderInteractionDiffMarkdown(
  diff: InteractionDiff,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`## ${lang === 'zh' ? '互动变化分析' : 'Interaction Changes Analysis'}`);
  lines.push('');

  // Summary
  lines.push(`### ${lang === 'zh' ? '摘要' : 'Summary'}`);
  lines.push(`- ${lang === 'zh' ? '新增' : 'Added'}: ${diff.summary.totalAdded}`);
  lines.push(`- ${lang === 'zh' ? '移除' : 'Removed'}: ${diff.summary.totalRemoved}`);
  lines.push(`- ${lang === 'zh' ? '不变' : 'Unchanged'}: ${diff.summary.totalUnchanged}`);
  lines.push(`- ${lang === 'zh' ? '净变化' : 'Net Change'}: ${diff.summary.netChange > 0 ? '+' : ''}${diff.summary.netChange}`);
  lines.push(`- ${lang === 'zh' ? '总体趋势' : 'Overall Trend'}: ${diff.summary.overallTrend}`);
  lines.push('');

  // Added
  if (diff.added.length > 0) {
    lines.push(`### ${lang === 'zh' ? '新增互动' : 'Added Interactions'}`);
    diff.added.forEach(e => {
      lines.push(`+ ${formatInteraction(e, lang)}`);
    });
    lines.push('');
  }

  // Removed
  if (diff.removed.length > 0) {
    lines.push(`### ${lang === 'zh' ? '移除互动' : 'Removed Interactions'}`);
    diff.removed.forEach(e => {
      lines.push(`- ${formatInteraction(e, lang)}`);
    });
    lines.push('');
  }

  // Unchanged
  if (diff.unchanged.length > 0) {
    lines.push(`### ${lang === 'zh' ? '持续互动' : 'Continuing Interactions'}`);
    diff.unchanged.forEach(e => {
      lines.push(`= ${formatInteraction(e, lang)}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Render interaction diff as HTML
 */
export function renderInteractionDiffHtml(
  diff: InteractionDiff,
  lang: 'en' | 'zh' = 'en'
): string {
  const renderEvent = (e: InteractionEvent, prefix: string) => {
    const color = getSeverityColor(e.severity);
    const icon = getInteractionIcon(e.type);
    const desc = lang === 'zh' && e.descriptionZh ? e.descriptionZh : e.description;
    return `
      <div class="interaction-event" style="border-left: 3px solid ${color}; padding-left: 12px; margin: 8px 0;">
        <span class="prefix">${prefix}</span>
        <span class="icon">${icon}</span>
        <strong>${e.type}</strong>: ${e.pillarA} ↔ ${e.pillarB}
        <p style="margin: 4px 0; color: #666;">${desc}</p>
      </div>
    `;
  };

  return `
<div class="interaction-diff">
  <h2>${lang === 'zh' ? '互动变化分析' : 'Interaction Changes Analysis'}</h2>

  <div class="diff-summary" style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
    <h3>${lang === 'zh' ? '摘要' : 'Summary'}</h3>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
      <div style="text-align: center;">
        <div style="font-size: 24px; color: #4CAF50;">+${diff.summary.totalAdded}</div>
        <div>${lang === 'zh' ? '新增' : 'Added'}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: #f44336;">-${diff.summary.totalRemoved}</div>
        <div>${lang === 'zh' ? '移除' : 'Removed'}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; color: #9e9e9e;">${diff.summary.totalUnchanged}</div>
        <div>${lang === 'zh' ? '不变' : 'Unchanged'}</div>
      </div>
    </div>
    <div style="margin-top: 12px; text-align: center;">
      ${lang === 'zh' ? '总体趋势' : 'Overall Trend'}:
      <strong>${diff.summary.overallTrend}</strong>
    </div>
  </div>

  ${diff.added.length > 0 ? `
  <div class="added-section">
    <h3 style="color: #4CAF50;">${lang === 'zh' ? '新增互动' : 'Added Interactions'}</h3>
    ${diff.added.map(e => renderEvent(e, '+')).join('')}
  </div>
  ` : ''}

  ${diff.removed.length > 0 ? `
  <div class="removed-section">
    <h3 style="color: #f44336;">${lang === 'zh' ? '移除互动' : 'Removed Interactions'}</h3>
    ${diff.removed.map(e => renderEvent(e, '-')).join('')}
  </div>
  ` : ''}

  ${diff.unchanged.length > 0 ? `
  <div class="unchanged-section">
    <h3 style="color: #9e9e9e;">${lang === 'zh' ? '持续互动' : 'Continuing Interactions'}</h3>
    ${diff.unchanged.map(e => renderEvent(e, '=')).join('')}
  </div>
  ` : ''}
</div>
  `.trim();
}

// ==================== EXPORTS ====================

export {
  diffInteractions,
  buildInteractionTimeline,
  getSignificantChanges,
  compareChartInteractions,
  findRecurringPatterns,
  getInteractionIcon,
  getSeverityColor,
  formatInteraction,
  renderInteractionDiffMarkdown,
  renderInteractionDiffHtml
};
