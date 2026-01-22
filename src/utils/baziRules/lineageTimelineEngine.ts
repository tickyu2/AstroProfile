/**
 * ============================================
 * LINEAGE TIMELINE ENGINE
 * Chronological mapping of generational events,
 * themes, and arcs across time
 *
 * This engine produces:
 * - Timeline of generations
 * - Timeline of themes
 * - Timeline of ancestral arcs
 * - Timeline of pilgrim transformation
 * - Visual rendering data for timeline UI
 * ============================================
 */

import { GenerationalLadder, GenerationNode, GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export interface TimelineEvent {
  id: string;
  generationIndex: number;
  generationLabel: string;
  label: string;
  labelZh?: string;
  startAge: number;
  endAge: number;
  themes: string[];
  intensity: number; // 0-100
  eventType: 'storyBeat' | 'thread' | 'pattern' | 'ritual' | 'transformation';
  color?: string;
}

export interface TimelineArc {
  id: string;
  name: string;
  nameZh?: string;
  startGeneration: number;
  endGeneration: number;
  theme: string;
  evolution: 'ascending' | 'descending' | 'stable' | 'breaking';
  intensity: number;
}

export interface TimelinePilgrimMoment {
  id: string;
  age: number;
  label: string;
  labelZh?: string;
  type: 'inheritance' | 'breaking' | 'founding' | 'healing' | 'integration';
  linkedThreads: string[];
  significance: number;
}

export interface LineageTimeline {
  lineageId: string;
  events: TimelineEvent[];
  arcs: TimelineArc[];
  pilgrimMoments: TimelinePilgrimMoment[];
  totalGenerations: number;
  timespan: {
    earliestGeneration: number;
    latestGeneration: number;
    estimatedYears: number;
  };
}

export interface TimelineRenderData {
  generations: {
    index: number;
    label: string;
    events: TimelineEvent[];
    x: number; // Normalized 0-1 position
  }[];
  arcs: {
    arc: TimelineArc;
    startX: number;
    endX: number;
    y: number;
  }[];
  pilgrimMarkers: {
    moment: TimelinePilgrimMoment;
    x: number;
    y: number;
  }[];
}

// ==================== TIMELINE BUILDER ====================

/**
 * Build lineage timeline from generational ladder
 */
export function buildLineageTimeline(ladder: GenerationalLadder): LineageTimeline {
  const events: TimelineEvent[] = [];
  const arcs: TimelineArc[] = [];
  const pilgrimMoments: TimelinePilgrimMoment[] = [];
  let eventId = 0;

  // Extract events from each generation
  ladder.generations.forEach(gen => {
    // Story beats as events
    if (gen.groupNarrative?.storyBeats) {
      gen.groupNarrative.storyBeats.forEach(beat => {
        events.push({
          id: `event-${eventId++}`,
          generationIndex: gen.generationIndex,
          generationLabel: gen.label,
          label: beat.label,
          startAge: beat.startAge,
          endAge: beat.endAge,
          themes: beat.dominantThemes,
          intensity: beat.intensity,
          eventType: 'storyBeat',
          color: getColorForIntensity(beat.intensity)
        });
      });
    }
  });

  // Extract arcs from threads
  ladder.threads.forEach(thread => {
    const arc: TimelineArc = {
      id: `arc-${thread.theme}`,
      name: thread.theme,
      startGeneration: Math.min(...thread.generationIndices),
      endGeneration: Math.max(...thread.generationIndices),
      theme: thread.theme,
      evolution: determineEvolution(thread, ladder),
      intensity: thread.intensity
    };
    arcs.push(arc);
  });

  // Find pilgrim generation and extract moments
  const selfGen = ladder.generations.find(g => g.generationIndex === 0);
  if (selfGen && selfGen.groupNarrative) {
    selfGen.groupNarrative.storyBeats.forEach(beat => {
      const type = determineStepType(beat.label);
      pilgrimMoments.push({
        id: `pilgrim-${eventId++}`,
        age: beat.startAge,
        label: beat.label,
        type,
        linkedThreads: beat.dominantThemes,
        significance: beat.intensity
      });
    });
  }

  // Calculate timespan
  const genIndices = ladder.generations.map(g => g.generationIndex);
  const earliestGeneration = Math.min(...genIndices);
  const latestGeneration = Math.max(...genIndices);
  const estimatedYears = Math.abs(earliestGeneration - latestGeneration) * 30; // ~30 years per generation

  return {
    lineageId: ladder.lineageId,
    events,
    arcs,
    pilgrimMoments,
    totalGenerations: ladder.generations.length,
    timespan: {
      earliestGeneration,
      latestGeneration,
      estimatedYears
    }
  };
}

/**
 * Build render data for timeline visualization
 */
export function buildTimelineRenderData(timeline: LineageTimeline): TimelineRenderData {
  const totalGens = timeline.totalGenerations || 1;

  // Map generations to x positions
  const genXMap = new Map<number, number>();
  const sortedIndices = [...new Set(timeline.events.map(e => e.generationIndex))].sort((a, b) => a - b);
  sortedIndices.forEach((idx, i) => {
    genXMap.set(idx, i / (sortedIndices.length - 1 || 1));
  });

  // Build generation columns
  const generationMap = new Map<number, TimelineEvent[]>();
  timeline.events.forEach(event => {
    if (!generationMap.has(event.generationIndex)) {
      generationMap.set(event.generationIndex, []);
    }
    generationMap.get(event.generationIndex)!.push(event);
  });

  const generations = Array.from(generationMap.entries()).map(([index, events]) => ({
    index,
    label: events[0]?.generationLabel || `Gen ${index}`,
    events,
    x: genXMap.get(index) || 0
  }));

  // Build arc render data
  const arcs = timeline.arcs.map((arc, i) => ({
    arc,
    startX: genXMap.get(arc.startGeneration) || 0,
    endX: genXMap.get(arc.endGeneration) || 1,
    y: 0.1 + (i * 0.1) // Stack arcs vertically
  }));

  // Build pilgrim markers
  const maxAge = Math.max(...timeline.pilgrimMoments.map(m => m.age), 1);
  const pilgrimMarkers = timeline.pilgrimMoments.map(moment => ({
    moment,
    x: moment.age / maxAge,
    y: 0.5
  }));

  return {
    generations,
    arcs,
    pilgrimMarkers
  };
}

// ==================== TIMELINE QUERIES ====================

/**
 * Get events by generation
 */
export function getEventsByGeneration(
  timeline: LineageTimeline,
  generationIndex: number
): TimelineEvent[] {
  return timeline.events.filter(e => e.generationIndex === generationIndex);
}

/**
 * Get events by theme
 */
export function getEventsByTheme(
  timeline: LineageTimeline,
  theme: string
): TimelineEvent[] {
  const lower = theme.toLowerCase();
  return timeline.events.filter(e =>
    e.themes.some(t => t.toLowerCase().includes(lower))
  );
}

/**
 * Get events by intensity range
 */
export function getEventsByIntensity(
  timeline: LineageTimeline,
  minIntensity: number,
  maxIntensity: number = 100
): TimelineEvent[] {
  return timeline.events.filter(e =>
    e.intensity >= minIntensity && e.intensity <= maxIntensity
  );
}

/**
 * Get arcs by evolution type
 */
export function getArcsByEvolution(
  timeline: LineageTimeline,
  evolution: TimelineArc['evolution']
): TimelineArc[] {
  return timeline.arcs.filter(a => a.evolution === evolution);
}

/**
 * Get pilgrim moments by type
 */
export function getPilgrimMomentsByType(
  timeline: LineageTimeline,
  type: TimelinePilgrimMoment['type']
): TimelinePilgrimMoment[] {
  return timeline.pilgrimMoments.filter(m => m.type === type);
}

/**
 * Get timeline summary
 */
export function getTimelineSummary(timeline: LineageTimeline): {
  totalEvents: number;
  totalArcs: number;
  dominantThemes: string[];
  criticalMoments: TimelineEvent[];
  ascendingArcs: number;
  breakingArcs: number;
} {
  // Count themes
  const themeCounts = new Map<string, number>();
  timeline.events.forEach(e => {
    e.themes.forEach(t => {
      themeCounts.set(t, (themeCounts.get(t) || 0) + 1);
    });
  });

  // Sort themes by frequency
  const dominantThemes = [...themeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  // Find critical moments (high intensity)
  const criticalMoments = timeline.events
    .filter(e => e.intensity >= 80)
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 5);

  return {
    totalEvents: timeline.events.length,
    totalArcs: timeline.arcs.length,
    dominantThemes,
    criticalMoments,
    ascendingArcs: timeline.arcs.filter(a => a.evolution === 'ascending').length,
    breakingArcs: timeline.arcs.filter(a => a.evolution === 'breaking').length
  };
}

// ==================== HELPER FUNCTIONS ====================

function getColorForIntensity(intensity: number): string {
  if (intensity >= 80) return '#ff6b6b';
  if (intensity >= 60) return '#ffa502';
  if (intensity >= 40) return '#7bed9f';
  return '#a8d8ea';
}

function determineEvolution(
  thread: GenerationalThread,
  ladder: GenerationalLadder
): TimelineArc['evolution'] {
  if (thread.generationIndices.length < 2) return 'stable';

  // Check if intensity changes across generations
  const intensities: number[] = [];
  thread.generationIndices.forEach(idx => {
    const gen = ladder.generations.find(g => g.generationIndex === idx);
    if (gen?.groupNarrative?.storyBeats) {
      const relevantBeats = gen.groupNarrative.storyBeats.filter(b =>
        b.dominantThemes.some(t => t.toLowerCase().includes(thread.theme.toLowerCase()))
      );
      const avgIntensity = relevantBeats.length > 0
        ? relevantBeats.reduce((sum, b) => sum + b.intensity, 0) / relevantBeats.length
        : 50;
      intensities.push(avgIntensity);
    }
  });

  if (intensities.length < 2) return 'stable';

  const firstHalf = intensities.slice(0, Math.ceil(intensities.length / 2));
  const secondHalf = intensities.slice(Math.ceil(intensities.length / 2));

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const diff = secondAvg - firstAvg;
  if (diff > 15) return 'ascending';
  if (diff < -15) return 'descending';
  if (Math.abs(diff) <= 15 && thread.intensity < 30) return 'breaking';
  return 'stable';
}

function determineStepType(label: string): TimelinePilgrimMoment['type'] {
  const lower = label.toLowerCase();
  if (lower.includes('inherit') || lower.includes('carry') || lower.includes('continue')) {
    return 'inheritance';
  }
  if (lower.includes('break') || lower.includes('release') || lower.includes('end')) {
    return 'breaking';
  }
  if (lower.includes('begin') || lower.includes('found') || lower.includes('start') || lower.includes('seed')) {
    return 'founding';
  }
  if (lower.includes('heal') || lower.includes('transform') || lower.includes('recover')) {
    return 'healing';
  }
  return 'integration';
}

// ==================== FORMATTING ====================

/**
 * Format timeline for display
 */
export function formatTimelineForDisplay(
  timeline: LineageTimeline,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push(lang === 'zh' ? '血脉时间线' : 'LINEAGE TIMELINE');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(`Generations: ${timeline.totalGenerations}`);
  lines.push(`Estimated span: ~${timeline.timespan.estimatedYears} years`);
  lines.push(`Total events: ${timeline.events.length}`);
  lines.push(`Arcs: ${timeline.arcs.length}`);
  lines.push('');
  lines.push('---');

  // Group events by generation
  const genGroups = new Map<number, TimelineEvent[]>();
  timeline.events.forEach(e => {
    if (!genGroups.has(e.generationIndex)) {
      genGroups.set(e.generationIndex, []);
    }
    genGroups.get(e.generationIndex)!.push(e);
  });

  const sortedGens = [...genGroups.entries()].sort((a, b) => a[0] - b[0]);
  sortedGens.forEach(([genIndex, events]) => {
    const genLabel = events[0]?.generationLabel || `Generation ${genIndex}`;
    lines.push('');
    lines.push(`【${genLabel}】`);
    events.forEach(event => {
      const label = (lang === 'zh' && event.labelZh) ? event.labelZh : event.label;
      lines.push(`  • ${label} (ages ${event.startAge}-${event.endAge}) [${event.intensity}%]`);
    });
  });

  lines.push('');
  lines.push('--- ARCS ---');
  timeline.arcs.forEach(arc => {
    const name = (lang === 'zh' && arc.nameZh) ? arc.nameZh : arc.name;
    lines.push(`  ${name}: Gen ${arc.startGeneration} → Gen ${arc.endGeneration} (${arc.evolution})`);
  });

  lines.push('');
  lines.push('--- PILGRIM MOMENTS ---');
  timeline.pilgrimMoments.forEach(moment => {
    const label = (lang === 'zh' && moment.labelZh) ? moment.labelZh : moment.label;
    lines.push(`  Age ${moment.age}: ${label} [${moment.type}]`);
  });

  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  buildLineageTimeline,
  buildTimelineRenderData,
  getEventsByGeneration,
  getEventsByTheme,
  getEventsByIntensity,
  getArcsByEvolution,
  getPilgrimMomentsByType,
  getTimelineSummary,
  formatTimelineForDisplay
};
