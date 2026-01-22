/**
 * ============================================
 * GENERATIONAL NARRATIVE LADDER
 * Stack narratives across ancestors, parents,
 * self, children, and beyond.
 *
 * Each generation is a fused group narrative.
 * Ladder reveals ancestral arcs and recurring
 * themes across time.
 * ============================================
 */

import {
  GroupNarrative,
  GroupStoryBeat,
  MemberNarrative,
  fuseNarratives,
  FusionOptions
} from './narrativeFusion';

// ==================== DATA MODEL ====================

export interface GenerationNode {
  id: string;                           // "gen_-2", "gen_-1", "gen_0", "gen_1"
  label: string;                        // "Grandparents", "Parents", "Self", "Children"
  labelZh?: string;                     // "祖父母", "父母", "自己", "子女"
  generationIndex: number;              // -2, -1, 0, +1, +2
  groupNarrative: GroupNarrative;
  memberCount: number;
  dominantTone: 'positive' | 'negative' | 'mixed';
}

export interface GenerationalLadder {
  lineageId: string;
  lineageName?: string;
  generations: GenerationNode[];        // sorted by generationIndex
  threads: GenerationalThread[];
  summary: LadderSummary;
}

export interface GenerationalThread {
  id: string;
  theme: string;                        // "career", "relationship", "migration"
  themeZh?: string;
  generations: number[];                // which generationIndices carry it
  intensity: number;                    // 0-100, how strong this thread is
  direction: 'ascending' | 'descending' | 'stable' | 'cyclical';
  notes: string;
}

export interface LadderSummary {
  totalGenerations: number;
  totalMembers: number;
  spanYears: number;                    // estimated years covered
  dominantThreads: string[];
  inheritedPatterns: InheritedPattern[];
  breakingPatterns: BreakingPattern[];
  narrativeArc: string;                 // overall family narrative arc description
}

export interface InheritedPattern {
  pattern: string;
  fromGeneration: number;
  toGeneration: number;
  strength: number;                     // 0-100
}

export interface BreakingPattern {
  pattern: string;
  generation: number;
  previousPattern?: string;
  significance: number;                 // 0-100
}

// ==================== INPUT TYPES ====================

export interface GenerationalInput {
  lineageId: string;
  lineageName?: string;
  generations: {
    generationIndex: number;            // -2, -1, 0, +1, ...
    label: string;
    labelZh?: string;
    members: MemberNarrative[];
  }[];
  fusionOptions?: FusionOptions;
}

// ==================== MAIN BUILDER ====================

/**
 * Build a generational ladder from member narratives
 */
export function buildGenerationalLadder(input: GenerationalInput): GenerationalLadder {
  const fusionOpts = input.fusionOptions || { strategy: 'union' };

  // Build each generation node
  const generations: GenerationNode[] = input.generations.map(g => {
    const groupNarrative = fuseNarratives(
      `${input.lineageId}_gen_${g.generationIndex}`,
      g.members,
      fusionOpts
    );

    // Determine dominant tone
    const posBeats = groupNarrative.storyBeats.filter(b => b.valence === 'positive').length;
    const negBeats = groupNarrative.storyBeats.filter(b => b.valence === 'negative').length;
    let dominantTone: 'positive' | 'negative' | 'mixed';
    if (posBeats > negBeats * 1.5) dominantTone = 'positive';
    else if (negBeats > posBeats * 1.5) dominantTone = 'negative';
    else dominantTone = 'mixed';

    return {
      id: `gen_${g.generationIndex}`,
      label: g.label,
      labelZh: g.labelZh,
      generationIndex: g.generationIndex,
      groupNarrative,
      memberCount: g.members.length,
      dominantTone
    };
  });

  // Sort by generation index (oldest first)
  generations.sort((a, b) => a.generationIndex - b.generationIndex);

  // Extract cross-generational threads
  const threads = extractGenerationalThreads(generations);

  // Build summary
  const summary = buildLadderSummary(generations, threads);

  return {
    lineageId: input.lineageId,
    lineageName: input.lineageName,
    generations,
    threads,
    summary
  };
}

// ==================== THREAD EXTRACTION ====================

/**
 * Extract recurring themes across generations
 */
function extractGenerationalThreads(generations: GenerationNode[]): GenerationalThread[] {
  const themeMap: Map<string, { gens: Set<number>; intensities: number[] }> = new Map();

  // Collect themes from story beats
  generations.forEach(gen => {
    gen.groupNarrative.storyBeats.forEach(beat => {
      beat.dominantThemes.forEach(theme => {
        if (!themeMap.has(theme)) {
          themeMap.set(theme, { gens: new Set(), intensities: [] });
        }
        const entry = themeMap.get(theme)!;
        entry.gens.add(gen.generationIndex);
        entry.intensities.push(beat.intensity);
      });
    });
  });

  // Convert to threads (only themes appearing in 2+ generations)
  const threads: GenerationalThread[] = [];
  let idx = 0;

  for (const [theme, data] of themeMap.entries()) {
    if (data.gens.size < 2) continue;

    const genArray = Array.from(data.gens).sort((a, b) => a - b);
    const avgIntensity = data.intensities.reduce((s, v) => s + v, 0) / data.intensities.length;

    // Determine direction
    let direction: 'ascending' | 'descending' | 'stable' | 'cyclical' = 'stable';
    if (genArray.length >= 3) {
      const firstHalf = genArray.slice(0, Math.floor(genArray.length / 2));
      const secondHalf = genArray.slice(Math.floor(genArray.length / 2));
      // Simple heuristic based on generation spread
      if (secondHalf[0] - firstHalf[firstHalf.length - 1] > 1) {
        direction = 'cyclical';
      }
    }

    threads.push({
      id: `thread_${idx++}`,
      theme,
      generations: genArray,
      intensity: Math.round(avgIntensity),
      direction,
      notes: `Theme "${theme}" spans ${genArray.length} generations (${genArray.join(' → ')})`
    });
  }

  // Sort by number of generations (most persistent first)
  return threads.sort((a, b) => b.generations.length - a.generations.length);
}

/**
 * Public function to extract threads from an existing ladder
 */
export function extractThreadsFromLadder(ladder: GenerationalLadder): GenerationalThread[] {
  return extractGenerationalThreads(ladder.generations);
}

// ==================== PATTERN DETECTION ====================

/**
 * Detect inherited patterns across generations
 */
function detectInheritedPatterns(generations: GenerationNode[]): InheritedPattern[] {
  const patterns: InheritedPattern[] = [];

  // Compare adjacent generations for shared story beats
  for (let i = 0; i < generations.length - 1; i++) {
    const current = generations[i];
    const next = generations[i + 1];

    const currentLabels = new Set(current.groupNarrative.storyBeats.map(b => b.label));
    const nextLabels = new Set(next.groupNarrative.storyBeats.map(b => b.label));

    // Find shared labels
    const shared = [...currentLabels].filter(l => nextLabels.has(l));

    shared.forEach(label => {
      const currentBeat = current.groupNarrative.storyBeats.find(b => b.label === label);
      const nextBeat = next.groupNarrative.storyBeats.find(b => b.label === label);

      if (currentBeat && nextBeat) {
        patterns.push({
          pattern: label,
          fromGeneration: current.generationIndex,
          toGeneration: next.generationIndex,
          strength: Math.round((currentBeat.intensity + nextBeat.intensity) / 2)
        });
      }
    });
  }

  // Extend patterns that span multiple generations
  const extendedPatterns: InheritedPattern[] = [];
  const patternsByName = new Map<string, InheritedPattern[]>();

  patterns.forEach(p => {
    if (!patternsByName.has(p.pattern)) {
      patternsByName.set(p.pattern, []);
    }
    patternsByName.get(p.pattern)!.push(p);
  });

  for (const [pattern, instances] of patternsByName.entries()) {
    if (instances.length === 1) {
      extendedPatterns.push(instances[0]);
    } else {
      // Merge consecutive patterns
      instances.sort((a, b) => a.fromGeneration - b.fromGeneration);
      const merged: InheritedPattern = {
        pattern,
        fromGeneration: instances[0].fromGeneration,
        toGeneration: instances[instances.length - 1].toGeneration,
        strength: Math.round(instances.reduce((s, p) => s + p.strength, 0) / instances.length)
      };
      extendedPatterns.push(merged);
    }
  }

  return extendedPatterns.sort((a, b) => b.strength - a.strength);
}

/**
 * Detect breaking patterns (where a generation diverges)
 */
function detectBreakingPatterns(generations: GenerationNode[]): BreakingPattern[] {
  const patterns: BreakingPattern[] = [];

  for (let i = 1; i < generations.length; i++) {
    const prev = generations[i - 1];
    const current = generations[i];

    // Check for tone shift
    if (prev.dominantTone !== current.dominantTone) {
      patterns.push({
        pattern: 'emotional_tone',
        generation: current.generationIndex,
        previousPattern: prev.dominantTone,
        significance: 70
      });
    }

    // Check for major beat absence (present in prev, absent in current)
    const prevLabels = new Set(prev.groupNarrative.storyBeats.map(b => b.label));
    const currentLabels = new Set(current.groupNarrative.storyBeats.map(b => b.label));

    const droppedBeats = [...prevLabels].filter(l => !currentLabels.has(l));
    const newBeats = [...currentLabels].filter(l => !prevLabels.has(l));

    // Significant if more new than dropped (breaking pattern)
    if (newBeats.length > droppedBeats.length + 2) {
      patterns.push({
        pattern: 'narrative_divergence',
        generation: current.generationIndex,
        previousPattern: `${droppedBeats.length} dropped patterns`,
        significance: Math.min(90, 50 + (newBeats.length - droppedBeats.length) * 10)
      });
    }
  }

  return patterns.sort((a, b) => b.significance - a.significance);
}

// ==================== SUMMARY BUILDER ====================

function buildLadderSummary(
  generations: GenerationNode[],
  threads: GenerationalThread[]
): LadderSummary {
  const totalMembers = generations.reduce((sum, g) => sum + g.memberCount, 0);
  const spanYears = generations.length * 25; // rough estimate

  const inheritedPatterns = detectInheritedPatterns(generations);
  const breakingPatterns = detectBreakingPatterns(generations);

  const dominantThreads = threads.slice(0, 3).map(t => t.theme);

  const narrativeArc = generateFamilyNarrativeArc(generations, threads, inheritedPatterns);

  return {
    totalGenerations: generations.length,
    totalMembers,
    spanYears,
    dominantThreads,
    inheritedPatterns,
    breakingPatterns,
    narrativeArc
  };
}

function generateFamilyNarrativeArc(
  generations: GenerationNode[],
  threads: GenerationalThread[],
  patterns: InheritedPattern[]
): string {
  if (generations.length === 0) {
    return 'No generational data available.';
  }

  if (generations.length === 1) {
    return `Single generation narrative with ${generations[0].groupNarrative.storyBeats.length} story beats.`;
  }

  const oldest = generations[0];
  const youngest = generations[generations.length - 1];

  // Determine overall arc
  const toneShift =
    oldest.dominantTone === youngest.dominantTone
      ? 'maintains emotional continuity'
      : `shifts from ${oldest.dominantTone} to ${youngest.dominantTone}`;

  const threadNote =
    threads.length > 0
      ? `Recurring themes of ${threads.slice(0, 2).map(t => t.theme).join(' and ')}`
      : 'Diverse individual paths';

  const patternNote =
    patterns.length > 0
      ? `with ${patterns.length} inherited patterns`
      : 'forging new narratives each generation';

  return `This lineage spans ${generations.length} generations and ${toneShift}. ${threadNote} ${patternNote}.`;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get a specific generation by index
 */
export function getGeneration(ladder: GenerationalLadder, index: number): GenerationNode | undefined {
  return ladder.generations.find(g => g.generationIndex === index);
}

/**
 * Get threads that span a specific generation
 */
export function getThreadsForGeneration(ladder: GenerationalLadder, index: number): GenerationalThread[] {
  return ladder.threads.filter(t => t.generations.includes(index));
}

/**
 * Compare two adjacent generations
 */
export function compareAdjacentGenerations(
  ladder: GenerationalLadder,
  olderIndex: number,
  youngerIndex: number
): {
  sharedBeats: string[];
  uniqueToOlder: string[];
  uniqueToYounger: string[];
  emotionalShift: number;
  timingAlignment: number;
} {
  const older = getGeneration(ladder, olderIndex);
  const younger = getGeneration(ladder, youngerIndex);

  if (!older || !younger) {
    return {
      sharedBeats: [],
      uniqueToOlder: [],
      uniqueToYounger: [],
      emotionalShift: 0,
      timingAlignment: 0
    };
  }

  const olderLabels = new Set(older.groupNarrative.storyBeats.map(b => b.label));
  const youngerLabels = new Set(younger.groupNarrative.storyBeats.map(b => b.label));

  const sharedBeats = [...olderLabels].filter(l => youngerLabels.has(l));
  const uniqueToOlder = [...olderLabels].filter(l => !youngerLabels.has(l));
  const uniqueToYounger = [...youngerLabels].filter(l => !olderLabels.has(l));

  // Calculate emotional shift
  const olderEmoAvg = older.groupNarrative.emotionalArc.reduce((s, p) => s + p.avgValue, 0) /
    (older.groupNarrative.emotionalArc.length || 1);
  const youngerEmoAvg = younger.groupNarrative.emotionalArc.reduce((s, p) => s + p.avgValue, 0) /
    (younger.groupNarrative.emotionalArc.length || 1);
  const emotionalShift = youngerEmoAvg - olderEmoAvg;

  // Calculate timing alignment
  const olderTimingAvg = older.groupNarrative.timingCurve.reduce((s, p) => s + p.synchronicity, 0) /
    (older.groupNarrative.timingCurve.length || 1);
  const youngerTimingAvg = younger.groupNarrative.timingCurve.reduce((s, p) => s + p.synchronicity, 0) /
    (younger.groupNarrative.timingCurve.length || 1);
  const timingAlignment = (olderTimingAvg + youngerTimingAvg) / 2;

  return {
    sharedBeats,
    uniqueToOlder,
    uniqueToYounger,
    emotionalShift: Math.round(emotionalShift),
    timingAlignment: Math.round(timingAlignment)
  };
}

/**
 * Get the "self" generation (index 0)
 */
export function getSelfGeneration(ladder: GenerationalLadder): GenerationNode | undefined {
  return getGeneration(ladder, 0);
}

/**
 * Get ancestor generations (negative indices)
 */
export function getAncestorGenerations(ladder: GenerationalLadder): GenerationNode[] {
  return ladder.generations.filter(g => g.generationIndex < 0);
}

/**
 * Get descendant generations (positive indices)
 */
export function getDescendantGenerations(ladder: GenerationalLadder): GenerationNode[] {
  return ladder.generations.filter(g => g.generationIndex > 0);
}

// ==================== EXPORTS ====================

export {
  buildGenerationalLadder,
  extractThreadsFromLadder,
  getGeneration,
  getThreadsForGeneration,
  compareAdjacentGenerations,
  getSelfGeneration,
  getAncestorGenerations,
  getDescendantGenerations
};
