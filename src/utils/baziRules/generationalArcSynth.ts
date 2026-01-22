/**
 * ============================================
 * GENERATIONAL ARC SYNTHESIZER
 * Synthesizes multi-generation macro-arcs from:
 * - Story beats
 * - Emotional arcs
 * - Timing curves
 * - Threads
 * - Archetypes
 *
 * Produces narrative arcs like:
 * - "Three generations of migration"
 * - "A lineage healing arc around expression"
 * - "A rising arc of relationship stability"
 * ============================================
 */

import { GenerationalLadder, GenerationalThread, GenerationNode } from './generationalLadder';
import { AncestralArchetype } from './mythosLayer';
import { EmotionalProfile } from './advancedDialogue';

// ==================== DATA MODEL ====================

export type ArcType = 'rising' | 'falling' | 'cyclical' | 'resolved' | 'emerging' | 'plateau' | 'crisis';

export interface GenerationalArc {
  id: string;
  theme: string;
  arcType: ArcType;
  generations: number[];
  startIntensity: number;
  endIntensity: number;
  peakGeneration?: number;
  summary: string;
  summaryZh: string;
  emotionalTone: EmotionalProfile;
}

export interface ArcCluster {
  id: string;
  name: string;
  nameZh: string;
  arcs: GenerationalArc[];
  dominantArcType: ArcType;
  sharedThemes: string[];
}

export interface ArcSynthesis {
  lineageId: string;
  arcs: GenerationalArc[];
  clusters: ArcCluster[];
  overallTrajectory: ArcType;
  summary: string;
  summaryZh: string;
}

// ==================== ARC DETECTION ====================

/**
 * Detect arc type from intensity values across generations
 */
function detectArcType(intensities: number[]): ArcType {
  if (intensities.length === 0) return 'emerging';
  if (intensities.length === 1) return 'emerging';

  const first = intensities[0];
  const last = intensities[intensities.length - 1];
  const max = Math.max(...intensities);
  const min = Math.min(...intensities);
  const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  const range = max - min;

  // Check for plateau (low variance)
  if (range < 15) return 'plateau';

  // Check for crisis (sharp drop then rise, or vice versa)
  const midIndex = Math.floor(intensities.length / 2);
  const firstHalfAvg = intensities.slice(0, midIndex).reduce((a, b) => a + b, 0) / midIndex;
  const secondHalfAvg = intensities.slice(midIndex).reduce((a, b) => a + b, 0) / (intensities.length - midIndex);
  if (Math.abs(firstHalfAvg - secondHalfAvg) > 30 && range > 40) return 'crisis';

  // Check for cyclical (returns close to start)
  if (Math.abs(first - last) < 15 && range > 25) return 'cyclical';

  // Check for resolved (ends high after being low)
  if (last > first + 20 && min < avg - 10) return 'resolved';

  // Rising or falling
  if (last > first + 15) return 'rising';
  if (last < first - 15) return 'falling';

  return 'plateau';
}

/**
 * Get emotional tone for an arc
 */
function getArcEmotionalTone(arc: GenerationalArc): EmotionalProfile {
  const toneMap: Record<ArcType, EmotionalProfile> = {
    rising: { valence: 60, intensity: 65, tone: 'warm' },
    falling: { valence: -30, intensity: 55, tone: 'solemn' },
    cyclical: { valence: 10, intensity: 50, tone: 'reverent' },
    resolved: { valence: 70, intensity: 60, tone: 'warm' },
    emerging: { valence: 30, intensity: 40, tone: 'soft' },
    plateau: { valence: 20, intensity: 35, tone: 'gentle' },
    crisis: { valence: -20, intensity: 75, tone: 'firm' }
  };

  return toneMap[arc.arcType];
}

// ==================== ARC SYNTHESIZER ====================

/**
 * Synthesize generational arcs from threads
 */
export function synthesizeGenerationalArcs(
  ladder: GenerationalLadder,
  threads: GenerationalThread[]
): GenerationalArc[] {
  const arcs: GenerationalArc[] = [];

  threads.forEach((thread, idx) => {
    const gens = thread.generationIndices;
    if (gens.length === 0) return;

    // Get intensity values for each generation
    const intensities = gens.map(genIdx => {
      const gen = ladder.generations.find(g => g.generationIndex === genIdx);
      return gen ? thread.intensity : 50;
    });

    const arcType = detectArcType(intensities);
    const startIntensity = intensities[0] || 50;
    const endIntensity = intensities[intensities.length - 1] || 50;

    // Find peak generation
    const maxIntensity = Math.max(...intensities);
    const peakIndex = intensities.indexOf(maxIntensity);
    const peakGeneration = gens[peakIndex];

    // Generate summary
    const genRange = gens.length === 1
      ? `generation ${gens[0]}`
      : `generations ${gens[0]} → ${gens[gens.length - 1]}`;

    const arcTypeLabel = getArcTypeLabel(arcType);
    const summary = `Theme "${thread.theme}" spans ${genRange}, forming a ${arcTypeLabel} arc.`;
    const summaryZh = `主题「${thread.theme}」跨越${genRange}，形成${getArcTypeLabelZh(arcType)}弧线。`;

    const arc: GenerationalArc = {
      id: `arc-${idx}-${thread.theme}`,
      theme: thread.theme,
      arcType,
      generations: gens,
      startIntensity,
      endIntensity,
      peakGeneration,
      summary,
      summaryZh,
      emotionalTone: { valence: 0, intensity: 50, tone: 'solemn' }
    };

    arc.emotionalTone = getArcEmotionalTone(arc);
    arcs.push(arc);
  });

  return arcs;
}

/**
 * Synthesize arcs from archetypes
 */
export function synthesizeArchetypeArcs(
  archetypes: AncestralArchetype[],
  ladder: GenerationalLadder
): GenerationalArc[] {
  const arcs: GenerationalArc[] = [];

  // Group archetypes by their primary theme
  const themeGroups = new Map<string, AncestralArchetype[]>();
  archetypes.forEach(arch => {
    const primaryTheme = arch.themes[0] || 'unknown';
    if (!themeGroups.has(primaryTheme)) {
      themeGroups.set(primaryTheme, []);
    }
    themeGroups.get(primaryTheme)!.push(arch);
  });

  // Create arcs from theme groups
  themeGroups.forEach((archs, theme) => {
    if (archs.length === 0) return;

    const generations = archs.map(a => a.generationIndex ?? 0).sort((a, b) => a - b);
    const uniqueGens = [...new Set(generations)];

    // Estimate intensity based on archetype presence
    const intensities = uniqueGens.map(gen =>
      archs.filter(a => (a.generationIndex ?? 0) === gen).length * 30 + 40
    );

    const arcType = detectArcType(intensities);

    const arc: GenerationalArc = {
      id: `archetype-arc-${theme}`,
      theme,
      arcType,
      generations: uniqueGens,
      startIntensity: intensities[0] || 50,
      endIntensity: intensities[intensities.length - 1] || 50,
      summary: `Archetype theme "${theme}" manifests across ${uniqueGens.length} generation(s) as a ${getArcTypeLabel(arcType)} pattern.`,
      summaryZh: `原型主题「${theme}」在${uniqueGens.length}代中显现，形成${getArcTypeLabelZh(arcType)}模式。`,
      emotionalTone: { valence: 0, intensity: 50, tone: 'solemn' }
    };

    arc.emotionalTone = getArcEmotionalTone(arc);
    arcs.push(arc);
  });

  return arcs;
}

// ==================== ARC CLUSTERING ====================

/**
 * Cluster related arcs together
 */
export function clusterArcs(arcs: GenerationalArc[]): ArcCluster[] {
  const clusters: ArcCluster[] = [];

  // Group by shared themes
  const themeArcs = new Map<string, GenerationalArc[]>();
  arcs.forEach(arc => {
    const theme = arc.theme.toLowerCase();
    if (!themeArcs.has(theme)) {
      themeArcs.set(theme, []);
    }
    themeArcs.get(theme)!.push(arc);
  });

  // Create clusters from theme groups
  let clusterIdx = 0;
  themeArcs.forEach((clusterArcs, theme) => {
    if (clusterArcs.length === 0) return;

    // Determine dominant arc type
    const arcTypeCounts = clusterArcs.reduce((acc, arc) => {
      acc[arc.arcType] = (acc[arc.arcType] || 0) + 1;
      return acc;
    }, {} as Record<ArcType, number>);

    const dominantArcType = Object.entries(arcTypeCounts)
      .sort((a, b) => b[1] - a[1])[0][0] as ArcType;

    clusters.push({
      id: `cluster-${clusterIdx++}`,
      name: `${theme} Cluster`,
      nameZh: `${theme}集群`,
      arcs: clusterArcs,
      dominantArcType,
      sharedThemes: [theme]
    });
  });

  return clusters;
}

// ==================== FULL SYNTHESIS ====================

/**
 * Perform complete arc synthesis
 */
export function synthesizeFullArcAnalysis(
  ladder: GenerationalLadder,
  threads: GenerationalThread[],
  archetypes?: AncestralArchetype[]
): ArcSynthesis {
  // Synthesize arcs from threads
  const threadArcs = synthesizeGenerationalArcs(ladder, threads);

  // Synthesize arcs from archetypes if provided
  const archetypeArcs = archetypes ? synthesizeArchetypeArcs(archetypes, ladder) : [];

  // Combine all arcs
  const allArcs = [...threadArcs, ...archetypeArcs];

  // Cluster the arcs
  const clusters = clusterArcs(allArcs);

  // Determine overall trajectory
  const arcTypeCounts = allArcs.reduce((acc, arc) => {
    acc[arc.arcType] = (acc[arc.arcType] || 0) + 1;
    return acc;
  }, {} as Record<ArcType, number>);

  const overallTrajectory = Object.entries(arcTypeCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as ArcType || 'emerging';

  // Generate summary
  const summary = `This lineage shows ${allArcs.length} distinct arcs across ${clusters.length} thematic clusters. The overall trajectory is ${getArcTypeLabel(overallTrajectory)}.`;
  const summaryZh = `这条血脉展现了${allArcs.length}个独特弧线，跨越${clusters.length}个主题集群。整体轨迹为${getArcTypeLabelZh(overallTrajectory)}。`;

  return {
    lineageId: ladder.lineageId,
    arcs: allArcs,
    clusters,
    overallTrajectory,
    summary,
    summaryZh
  };
}

// ==================== FORMATTING ====================

/**
 * Get arc type label
 */
function getArcTypeLabel(arcType: ArcType): string {
  const labels: Record<ArcType, string> = {
    rising: 'rising',
    falling: 'falling',
    cyclical: 'cyclical',
    resolved: 'resolved',
    emerging: 'emerging',
    plateau: 'plateau',
    crisis: 'crisis'
  };
  return labels[arcType];
}

/**
 * Get arc type label in Chinese
 */
function getArcTypeLabelZh(arcType: ArcType): string {
  const labels: Record<ArcType, string> = {
    rising: '上升',
    falling: '下降',
    cyclical: '循环',
    resolved: '化解',
    emerging: '萌芽',
    plateau: '平稳',
    crisis: '危机'
  };
  return labels[arcType];
}

/**
 * Format arc synthesis for display
 */
export function formatArcSynthesisForDisplay(
  synthesis: ArcSynthesis,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push(lang === 'zh' ? '🌊 代际弧线分析' : '🌊 Generational Arc Analysis');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  lines.push(lang === 'zh' ? synthesis.summaryZh : synthesis.summary);
  lines.push('');

  lines.push('---');
  lines.push(lang === 'zh' ? '## 弧线' : '## Arcs');
  lines.push('');

  synthesis.arcs.forEach((arc, idx) => {
    lines.push(`${idx + 1}. ${arc.theme}`);
    lines.push(`   ${lang === 'zh' ? '类型' : 'Type'}: ${lang === 'zh' ? getArcTypeLabelZh(arc.arcType) : arc.arcType}`);
    lines.push(`   ${lang === 'zh' ? '代数' : 'Generations'}: ${arc.generations.join(' → ')}`);
    lines.push(`   ${lang === 'zh' ? arc.summaryZh : arc.summary}`);
    lines.push('');
  });

  lines.push('---');
  lines.push(lang === 'zh' ? '## 主题集群' : '## Thematic Clusters');
  lines.push('');

  synthesis.clusters.forEach((cluster, idx) => {
    lines.push(`${idx + 1}. ${lang === 'zh' ? cluster.nameZh : cluster.name}`);
    lines.push(`   ${lang === 'zh' ? '主导类型' : 'Dominant Type'}: ${lang === 'zh' ? getArcTypeLabelZh(cluster.dominantArcType) : cluster.dominantArcType}`);
    lines.push(`   ${lang === 'zh' ? '弧线数' : 'Arc Count'}: ${cluster.arcs.length}`);
    lines.push('');
  });

  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

// ==================== QUERY FUNCTIONS ====================

/**
 * Get arcs by type
 */
export function getArcsByType(
  synthesis: ArcSynthesis,
  arcType: ArcType
): GenerationalArc[] {
  return synthesis.arcs.filter(arc => arc.arcType === arcType);
}

/**
 * Get arcs involving a specific generation
 */
export function getArcsByGeneration(
  synthesis: ArcSynthesis,
  generationIndex: number
): GenerationalArc[] {
  return synthesis.arcs.filter(arc => arc.generations.includes(generationIndex));
}

/**
 * Get the most intense arcs
 */
export function getMostIntenseArcs(
  synthesis: ArcSynthesis,
  topN: number = 5
): GenerationalArc[] {
  return [...synthesis.arcs]
    .sort((a, b) => Math.max(a.startIntensity, a.endIntensity) - Math.max(b.startIntensity, b.endIntensity))
    .reverse()
    .slice(0, topN);
}

/**
 * Get arcs with peak at a specific generation
 */
export function getArcsPeakingAt(
  synthesis: ArcSynthesis,
  generationIndex: number
): GenerationalArc[] {
  return synthesis.arcs.filter(arc => arc.peakGeneration === generationIndex);
}

// ==================== EXPORTS ====================

export {
  synthesizeGenerationalArcs,
  synthesizeArchetypeArcs,
  clusterArcs,
  synthesizeFullArcAnalysis,
  formatArcSynthesisForDisplay,
  getArcsByType,
  getArcsByGeneration,
  getMostIntenseArcs,
  getArcsPeakingAt,
  getArcTypeLabel,
  getArcTypeLabelZh
};
