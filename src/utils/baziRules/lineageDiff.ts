/**
 * ============================================
 * LINEAGE DIFF ENGINE
 * Compares two entire lineages across:
 * - Generational ladders
 * - Threads
 * - Patterns
 * - Group narratives
 * - Ancestral arcs
 *
 * Perfect for:
 * - Partner lineage comparison
 * - Family systems analysis
 * - Ancestral healing collaboration
 * ============================================
 */

import { GenerationalLadder, GenerationalThread, GenerationNode } from './generationalLadder';
import { PilgrimPosition } from './journeyWithGenerations';

// ==================== DATA MODEL ====================

export interface LineageDiff {
  lineageA: string;
  lineageB: string;
  generatedAt: Date;
  generationDiffs: GenerationDiff[];
  threadDiffs: ThreadDiff[];
  patternDiffs: PatternDiff[];
  summary: LineageDiffSummary;
}

export interface GenerationDiff {
  generationIndex: number;
  labelA?: string;
  labelB?: string;
  labelAZh?: string;
  labelBZh?: string;
  memberCountA: number;
  memberCountB: number;
  inA: boolean;
  inB: boolean;
  storyBeatDelta?: number;     // difference count
  emotionalDelta?: number;     // difference magnitude
  timingDelta?: number;        // difference magnitude
}

export interface ThreadDiff {
  theme: string;
  inA: boolean;
  inB: boolean;
  strengthA?: number;
  strengthB?: number;
  strengthDelta?: number;
  generationsInA: number[];
  generationsInB: number[];
  overlap: 'full' | 'partial' | 'none';
}

export interface PatternDiff {
  theme: string;
  type: 'inherited' | 'broken' | 'new';
  inA: boolean;
  inB: boolean;
}

export interface LineageDiffSummary {
  totalGenerationsA: number;
  totalGenerationsB: number;
  sharedGenerationIndices: number[];
  threadsOnlyInA: string[];
  threadsOnlyInB: string[];
  sharedThreads: string[];
  patternsOnlyInA: string[];
  patternsOnlyInB: string[];
  sharedPatterns: string[];
  overallSimilarity: number;     // 0-1
  resonanceLevel: 'high' | 'moderate' | 'low' | 'none';
  narrativeSummary: string;
  narrativeSummaryZh?: string;
}

// ==================== DIFF ENGINE ====================

/**
 * Compare two lineages and generate a comprehensive diff
 */
export function diffLineages(
  ladderA: GenerationalLadder,
  ladderB: GenerationalLadder,
  positionA?: PilgrimPosition,
  positionB?: PilgrimPosition
): LineageDiff {
  const generationDiffs = diffGenerations(ladderA, ladderB);
  const threadDiffs = diffThreads(ladderA.threads, ladderB.threads);
  const patternDiffs = positionA && positionB
    ? diffPatterns(positionA, positionB)
    : [];

  const summary = generateDiffSummary(ladderA, ladderB, generationDiffs, threadDiffs, patternDiffs);

  return {
    lineageA: ladderA.lineageId || 'Lineage A',
    lineageB: ladderB.lineageId || 'Lineage B',
    generatedAt: new Date(),
    generationDiffs,
    threadDiffs,
    patternDiffs,
    summary
  };
}

/**
 * Diff generations between two ladders
 */
function diffGenerations(ladderA: GenerationalLadder, ladderB: GenerationalLadder): GenerationDiff[] {
  const diffs: GenerationDiff[] = [];

  // Get all unique generation indices
  const allIndices = new Set<number>();
  ladderA.generations.forEach(g => allIndices.add(g.generationIndex));
  ladderB.generations.forEach(g => allIndices.add(g.generationIndex));

  Array.from(allIndices).sort((a, b) => a - b).forEach(idx => {
    const genA = ladderA.generations.find(g => g.generationIndex === idx);
    const genB = ladderB.generations.find(g => g.generationIndex === idx);

    diffs.push({
      generationIndex: idx,
      labelA: genA?.label,
      labelB: genB?.label,
      labelAZh: genA?.labelZh,
      labelBZh: genB?.labelZh,
      memberCountA: genA?.members.length ?? 0,
      memberCountB: genB?.members.length ?? 0,
      inA: !!genA,
      inB: !!genB
    });
  });

  return diffs;
}

/**
 * Diff threads between two ladders
 */
function diffThreads(threadsA: GenerationalThread[], threadsB: GenerationalThread[]): ThreadDiff[] {
  const diffs: ThreadDiff[] = [];

  // Get all unique themes
  const allThemes = new Set<string>();
  threadsA.forEach(t => allThemes.add(t.theme.toLowerCase()));
  threadsB.forEach(t => allThemes.add(t.theme.toLowerCase()));

  allThemes.forEach(theme => {
    const threadA = threadsA.find(t => t.theme.toLowerCase() === theme);
    const threadB = threadsB.find(t => t.theme.toLowerCase() === theme);

    const gensA = threadA?.generations ?? [];
    const gensB = threadB?.generations ?? [];

    // Calculate overlap
    const gensASet = new Set(gensA);
    const gensBSet = new Set(gensB);
    const intersection = gensA.filter(g => gensBSet.has(g));
    let overlap: 'full' | 'partial' | 'none' = 'none';

    if (threadA && threadB) {
      if (intersection.length === Math.max(gensA.length, gensB.length)) {
        overlap = 'full';
      } else if (intersection.length > 0) {
        overlap = 'partial';
      }
    }

    diffs.push({
      theme: threadA?.theme ?? threadB?.theme ?? theme,
      inA: !!threadA,
      inB: !!threadB,
      strengthA: threadA?.strength,
      strengthB: threadB?.strength,
      strengthDelta: threadA && threadB ? threadB.strength - threadA.strength : undefined,
      generationsInA: gensA,
      generationsInB: gensB,
      overlap
    });
  });

  return diffs;
}

/**
 * Diff patterns between two pilgrim positions
 */
function diffPatterns(positionA: PilgrimPosition, positionB: PilgrimPosition): PatternDiff[] {
  const diffs: PatternDiff[] = [];

  // Compare inherited themes
  const allInherited = new Set([...positionA.inheritedThemes, ...positionB.inheritedThemes]);
  allInherited.forEach(theme => {
    diffs.push({
      theme,
      type: 'inherited',
      inA: positionA.inheritedThemes.includes(theme),
      inB: positionB.inheritedThemes.includes(theme)
    });
  });

  // Compare broken patterns
  const allBroken = new Set([...positionA.brokenPatterns, ...positionB.brokenPatterns]);
  allBroken.forEach(theme => {
    diffs.push({
      theme,
      type: 'broken',
      inA: positionA.brokenPatterns.includes(theme),
      inB: positionB.brokenPatterns.includes(theme)
    });
  });

  // Compare new patterns
  const allNew = new Set([...positionA.newPatterns, ...positionB.newPatterns]);
  allNew.forEach(theme => {
    diffs.push({
      theme,
      type: 'new',
      inA: positionA.newPatterns.includes(theme),
      inB: positionB.newPatterns.includes(theme)
    });
  });

  return diffs;
}

/**
 * Generate diff summary
 */
function generateDiffSummary(
  ladderA: GenerationalLadder,
  ladderB: GenerationalLadder,
  generationDiffs: GenerationDiff[],
  threadDiffs: ThreadDiff[],
  patternDiffs: PatternDiff[]
): LineageDiffSummary {
  // Generation overlap
  const sharedGenerationIndices = generationDiffs
    .filter(d => d.inA && d.inB)
    .map(d => d.generationIndex);

  // Thread analysis
  const threadsOnlyInA = threadDiffs.filter(d => d.inA && !d.inB).map(d => d.theme);
  const threadsOnlyInB = threadDiffs.filter(d => !d.inA && d.inB).map(d => d.theme);
  const sharedThreads = threadDiffs.filter(d => d.inA && d.inB).map(d => d.theme);

  // Pattern analysis
  const patternsOnlyInA = patternDiffs.filter(d => d.inA && !d.inB).map(d => `${d.theme}(${d.type})`);
  const patternsOnlyInB = patternDiffs.filter(d => !d.inA && d.inB).map(d => `${d.theme}(${d.type})`);
  const sharedPatterns = patternDiffs.filter(d => d.inA && d.inB).map(d => `${d.theme}(${d.type})`);

  // Calculate overall similarity
  const totalItems = threadDiffs.length + patternDiffs.length;
  const sharedItems = sharedThreads.length + sharedPatterns.length;
  const overallSimilarity = totalItems > 0 ? sharedItems / totalItems : 0;

  // Determine resonance level
  let resonanceLevel: 'high' | 'moderate' | 'low' | 'none';
  if (overallSimilarity >= 0.7) resonanceLevel = 'high';
  else if (overallSimilarity >= 0.4) resonanceLevel = 'moderate';
  else if (overallSimilarity > 0) resonanceLevel = 'low';
  else resonanceLevel = 'none';

  // Generate narrative summary
  const narrativeSummary = generateNarrativeSummary(
    ladderA.lineageId,
    ladderB.lineageId,
    sharedThreads,
    threadsOnlyInA,
    threadsOnlyInB,
    resonanceLevel,
    'en'
  );

  const narrativeSummaryZh = generateNarrativeSummary(
    ladderA.lineageId,
    ladderB.lineageId,
    sharedThreads,
    threadsOnlyInA,
    threadsOnlyInB,
    resonanceLevel,
    'zh'
  );

  return {
    totalGenerationsA: ladderA.generations.length,
    totalGenerationsB: ladderB.generations.length,
    sharedGenerationIndices,
    threadsOnlyInA,
    threadsOnlyInB,
    sharedThreads,
    patternsOnlyInA,
    patternsOnlyInB,
    sharedPatterns,
    overallSimilarity,
    resonanceLevel,
    narrativeSummary,
    narrativeSummaryZh
  };
}

/**
 * Generate narrative summary of the diff
 */
function generateNarrativeSummary(
  lineageA: string | undefined,
  lineageB: string | undefined,
  shared: string[],
  onlyA: string[],
  onlyB: string[],
  resonance: 'high' | 'moderate' | 'low' | 'none',
  lang: 'en' | 'zh'
): string {
  const nameA = lineageA || (lang === 'zh' ? '血脉A' : 'Lineage A');
  const nameB = lineageB || (lang === 'zh' ? '血脉B' : 'Lineage B');

  if (lang === 'zh') {
    if (resonance === 'high' && shared.length > 0) {
      return `${nameA}与${nameB}之间存在深层祖系共鸣。共享的丝线包括：${shared.join('、')}。两条血脉在核心主题上高度契合。`;
    }
    if (resonance === 'moderate') {
      return `${nameA}与${nameB}展现出中等程度的祖系交织。共享主题：${shared.join('、') || '无'}。各自独特的丝线为联结带来互补的能量。`;
    }
    if (resonance === 'low') {
      return `${nameA}与${nameB}之间的祖系连接较为微弱。${nameA}独有：${onlyA.join('、') || '无'}。${nameB}独有：${onlyB.join('、') || '无'}。`;
    }
    return `${nameA}与${nameB}展现出截然不同的祖系路径。两条血脉各自承载独特的主题与模式。`;
  }

  // English
  if (resonance === 'high' && shared.length > 0) {
    return `${nameA} and ${nameB} share deep ancestral resonance. Shared threads: ${shared.join(', ')}. The two lineages are highly aligned in their core themes.`;
  }
  if (resonance === 'moderate') {
    return `${nameA} and ${nameB} show moderate ancestral weaving. Shared themes: ${shared.join(', ') || 'none'}. Each brings unique threads that complement the connection.`;
  }
  if (resonance === 'low') {
    return `${nameA} and ${nameB} have faint ancestral connections. Unique to ${nameA}: ${onlyA.join(', ') || 'none'}. Unique to ${nameB}: ${onlyB.join(', ') || 'none'}.`;
  }
  return `${nameA} and ${nameB} walk distinctly different ancestral paths. Each lineage carries its own unique themes and patterns.`;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get threads unique to lineage A
 */
export function getThreadsUniqueToA(diff: LineageDiff): ThreadDiff[] {
  return diff.threadDiffs.filter(d => d.inA && !d.inB);
}

/**
 * Get threads unique to lineage B
 */
export function getThreadsUniqueToB(diff: LineageDiff): ThreadDiff[] {
  return diff.threadDiffs.filter(d => !d.inA && d.inB);
}

/**
 * Get shared threads
 */
export function getSharedThreads(diff: LineageDiff): ThreadDiff[] {
  return diff.threadDiffs.filter(d => d.inA && d.inB);
}

/**
 * Get patterns unique to lineage A
 */
export function getPatternsUniqueToA(diff: LineageDiff): PatternDiff[] {
  return diff.patternDiffs.filter(d => d.inA && !d.inB);
}

/**
 * Get patterns unique to lineage B
 */
export function getPatternsUniqueToB(diff: LineageDiff): PatternDiff[] {
  return diff.patternDiffs.filter(d => !d.inA && d.inB);
}

/**
 * Get shared patterns
 */
export function getSharedPatterns(diff: LineageDiff): PatternDiff[] {
  return diff.patternDiffs.filter(d => d.inA && d.inB);
}

/**
 * Calculate healing potential (areas where lineages can help each other)
 */
export function calculateHealingPotential(diff: LineageDiff): {
  fromAtoB: string[];
  fromBtoA: string[];
  mutual: string[];
} {
  // Threads that A has (strong) that B lacks → A can help B
  const fromAtoB = diff.threadDiffs
    .filter(d => d.inA && !d.inB && (d.strengthA ?? 0) >= 0.5)
    .map(d => d.theme);

  // Threads that B has (strong) that A lacks → B can help A
  const fromBtoA = diff.threadDiffs
    .filter(d => !d.inA && d.inB && (d.strengthB ?? 0) >= 0.5)
    .map(d => d.theme);

  // Shared threads where both can grow together
  const mutual = diff.threadDiffs
    .filter(d => d.inA && d.inB)
    .map(d => d.theme);

  return { fromAtoB, fromBtoA, mutual };
}

// ==================== EXPORTS ====================

export {
  diffLineages,
  getThreadsUniqueToA,
  getThreadsUniqueToB,
  getSharedThreads,
  getPatternsUniqueToA,
  getPatternsUniqueToB,
  getSharedPatterns,
  calculateHealingPotential
};
