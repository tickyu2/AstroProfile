/**
 * ============================================
 * NARRATIVE DIFF ENGINE
 * Compare two narrative cockpits and compute
 * differences across all narrative layers
 *
 * Features:
 * 1. Reverse Mapping - Story Beat → Rules
 * 2. Narrative Diff - Compare two charts
 * ============================================
 */

import { CodexEntry } from './codexTypes';
import {
  NarrativeCockpitData,
  StoryBeat,
  EmotionalArcPoint,
  TimingCurvePoint,
  EnvironmentalOverlay,
  LifeChapter
} from './narrativeCockpitModel';

// ==================== REVERSE MAPPING TYPES ====================

export interface StoryBeatReverseMap {
  beatId: string;
  beatLabel: string;
  beatLabelZh: string;
  timeRange: { startAge: number; endAge: number };
  intensity: number;
  valence: string;
  description: string;
  personaHook?: string;
  relatedRules: RuleDetail[];
  relatedCodexEntries: CodexEntry[];
  journeyStepHints: string[];
  totalRuleImpact: number;
}

export interface RuleDetail {
  ruleId: string;
  ruleName: string;
  category: string;
  severity: string;
  effect: string;
  explanation: string;
  personaHook: string;
}

// ==================== DIFF TYPES ====================

export interface NarrativeDiff {
  storyBeatDiffs: StoryBeatDiff[];
  emotionalArcDiffs: EmotionalArcDiff[];
  timingCurveDiffs: TimingCurveDiff[];
  overlayDiffs: OverlayDiff[];
  chapterDiffs: ChapterDiff[];
  summary: DiffSummary;
}

export interface StoryBeatDiff {
  type: 'A-only' | 'B-only' | 'both-different' | 'identical';
  beatLabel: string;
  beatA?: StoryBeat;
  beatB?: StoryBeat;
  intensityDelta?: number;
  valenceDifference?: boolean;
  description?: string;
}

export interface EmotionalArcDiff {
  age: number;
  type: 'A-only' | 'B-only' | 'delta' | 'missing';
  pointA?: EmotionalArcPoint;
  pointB?: EmotionalArcPoint;
  intensityDelta?: number;
  valenceDifference?: boolean;
}

export interface TimingCurveDiff {
  age: number;
  type: 'A-only' | 'B-only' | 'delta' | 'missing';
  pointA?: TimingCurvePoint;
  pointB?: TimingCurvePoint;
  luckDelta?: number;
  volatilityDelta?: number;
  phaseDifference?: boolean;
}

export interface OverlayDiff {
  type: 'A-only' | 'B-only' | 'different' | 'identical';
  overlayA?: EnvironmentalOverlay;
  overlayB?: EnvironmentalOverlay;
  label: string;
  intensityDelta?: number;
  typeDifference?: boolean;
}

export interface ChapterDiff {
  type: 'A-only' | 'B-only' | 'different' | 'identical';
  chapterId: string;
  chapterA?: LifeChapter;
  chapterB?: LifeChapter;
  toneDifference?: boolean;
  keyBeatsDifference?: number;
}

export interface DiffSummary {
  totalDifferences: number;
  storyBeatDifferenceCount: number;
  emotionalArcDifferenceCount: number;
  timingCurveDifferenceCount: number;
  overlayDifferenceCount: number;
  chapterDifferenceCount: number;
  overallSimilarity: number; // 0-100%
  dominantDifferenceType: string;
  narrativeToneDifference: string;
}

// ==================== REVERSE MAPPING ENGINE ====================

/**
 * Build reverse mapping: Story Beat → Rules that created it
 */
export function buildStoryBeatReverseMap(
  cockpit: NarrativeCockpitData,
  codexEntries: CodexEntry[]
): StoryBeatReverseMap[] {
  const reverseMaps: StoryBeatReverseMap[] = [];

  for (const beat of cockpit.storyBeats) {
    // Find all codex entries referenced by this beat
    const relatedEntries = codexEntries.filter(entry =>
      beat.keyRules.includes(entry.rule.id)
    );

    // Build rule details
    const relatedRules: RuleDetail[] = relatedEntries.map(entry => ({
      ruleId: entry.rule.id,
      ruleName: entry.rule.name || entry.explanation.title,
      category: entry.rule.category,
      severity: entry.severity,
      effect: entry.effect,
      explanation: entry.explanation.summary,
      personaHook: entry.personaHook
    }));

    // Collect journey step hints
    const journeyStepHints = relatedEntries
      .map(e => e.journeyStepHint)
      .filter(Boolean) as string[];

    // Calculate total rule impact
    const severityScores: Record<string, number> = {
      'major': 50, 'significant': 40, 'moderate': 25, 'minor': 15, 'info': 5
    };
    const totalRuleImpact = relatedRules.reduce((sum, r) =>
      sum + (severityScores[r.severity] || 20), 0
    );

    reverseMaps.push({
      beatId: beat.id,
      beatLabel: beat.label,
      beatLabelZh: beat.labelZh,
      timeRange: beat.timeRange,
      intensity: beat.intensity,
      valence: beat.valence,
      description: beat.description,
      personaHook: beat.personaHook,
      relatedRules,
      relatedCodexEntries: relatedEntries,
      journeyStepHints,
      totalRuleImpact
    });
  }

  return reverseMaps;
}

/**
 * Get reverse map for a specific story beat
 */
export function getStoryBeatReverseMap(
  beatId: string,
  cockpit: NarrativeCockpitData,
  codexEntries: CodexEntry[]
): StoryBeatReverseMap | undefined {
  const allMaps = buildStoryBeatReverseMap(cockpit, codexEntries);
  return allMaps.find(m => m.beatId === beatId);
}

// ==================== NARRATIVE DIFF ENGINE ====================

/**
 * Compare two narrative cockpits and compute all differences
 */
export function diffNarratives(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData
): NarrativeDiff {
  const storyBeatDiffs = diffStoryBeats(cockpitA.storyBeats, cockpitB.storyBeats);
  const emotionalArcDiffs = diffEmotionalArc(cockpitA.emotionalArc, cockpitB.emotionalArc);
  const timingCurveDiffs = diffTimingCurve(cockpitA.timingCurve, cockpitB.timingCurve);
  const overlayDiffs = diffOverlays(cockpitA.overlays, cockpitB.overlays);
  const chapterDiffs = diffChapters(cockpitA.lifeChapters, cockpitB.lifeChapters);

  const summary = computeDiffSummary(
    storyBeatDiffs,
    emotionalArcDiffs,
    timingCurveDiffs,
    overlayDiffs,
    chapterDiffs
  );

  return {
    storyBeatDiffs,
    emotionalArcDiffs,
    timingCurveDiffs,
    overlayDiffs,
    chapterDiffs,
    summary
  };
}

/**
 * Diff story beats between two cockpits
 */
function diffStoryBeats(beatsA: StoryBeat[], beatsB: StoryBeat[]): StoryBeatDiff[] {
  const diffs: StoryBeatDiff[] = [];

  // Find beats only in A
  for (const a of beatsA) {
    const matchInB = beatsB.find(b =>
      b.label === a.label || b.id === a.id ||
      (Math.abs(b.timeRange.startAge - a.timeRange.startAge) < 5)
    );

    if (!matchInB) {
      diffs.push({
        type: 'A-only',
        beatLabel: a.label,
        beatA: a,
        description: `Beat "${a.label}" exists only in Chart A`
      });
    } else {
      // Compare the matched beats
      const intensityDelta = a.intensity - matchInB.intensity;
      const valenceDifference = a.valence !== matchInB.valence;

      if (Math.abs(intensityDelta) > 15 || valenceDifference) {
        diffs.push({
          type: 'both-different',
          beatLabel: a.label,
          beatA: a,
          beatB: matchInB,
          intensityDelta,
          valenceDifference,
          description: `Beat "${a.label}" differs: intensity Δ${intensityDelta}, valence ${valenceDifference ? 'differs' : 'same'}`
        });
      }
    }
  }

  // Find beats only in B
  for (const b of beatsB) {
    const matchInA = beatsA.find(a =>
      a.label === b.label || a.id === b.id ||
      (Math.abs(a.timeRange.startAge - b.timeRange.startAge) < 5)
    );

    if (!matchInA) {
      diffs.push({
        type: 'B-only',
        beatLabel: b.label,
        beatB: b,
        description: `Beat "${b.label}" exists only in Chart B`
      });
    }
  }

  return diffs;
}

/**
 * Diff emotional arc between two cockpits
 */
function diffEmotionalArc(arcA: EmotionalArcPoint[], arcB: EmotionalArcPoint[]): EmotionalArcDiff[] {
  const diffs: EmotionalArcDiff[] = [];

  // Collect all unique ages
  const ages = new Set([...arcA.map(p => p.age), ...arcB.map(p => p.age)]);

  for (const age of ages) {
    const pointA = arcA.find(p => p.age === age);
    const pointB = arcB.find(p => p.age === age);

    if (!pointA && pointB) {
      diffs.push({ age, type: 'B-only', pointB });
    } else if (pointA && !pointB) {
      diffs.push({ age, type: 'A-only', pointA });
    } else if (pointA && pointB) {
      const intensityDelta = pointA.intensity - pointB.intensity;
      const valenceDifference = pointA.valence !== pointB.valence;

      if (Math.abs(intensityDelta) > 20 || valenceDifference) {
        diffs.push({
          age,
          type: 'delta',
          pointA,
          pointB,
          intensityDelta,
          valenceDifference
        });
      }
    }
  }

  return diffs.sort((a, b) => a.age - b.age);
}

/**
 * Diff timing curve between two cockpits
 */
function diffTimingCurve(curveA: TimingCurvePoint[], curveB: TimingCurvePoint[]): TimingCurveDiff[] {
  const diffs: TimingCurveDiff[] = [];

  const ages = new Set([...curveA.map(p => p.age), ...curveB.map(p => p.age)]);

  for (const age of ages) {
    const pointA = curveA.find(p => p.age === age);
    const pointB = curveB.find(p => p.age === age);

    if (!pointA && pointB) {
      diffs.push({ age, type: 'B-only', pointB });
    } else if (pointA && !pointB) {
      diffs.push({ age, type: 'A-only', pointA });
    } else if (pointA && pointB) {
      const luckDelta = pointA.luckLevel - pointB.luckLevel;
      const volatilityDelta = pointA.volatility - pointB.volatility;
      const phaseDifference = pointA.phase !== pointB.phase;

      if (Math.abs(luckDelta) > 15 || Math.abs(volatilityDelta) > 15 || phaseDifference) {
        diffs.push({
          age,
          type: 'delta',
          pointA,
          pointB,
          luckDelta,
          volatilityDelta,
          phaseDifference
        });
      }
    }
  }

  return diffs.sort((a, b) => a.age - b.age);
}

/**
 * Diff overlays between two cockpits
 */
function diffOverlays(overlaysA: EnvironmentalOverlay[], overlaysB: EnvironmentalOverlay[]): OverlayDiff[] {
  const diffs: OverlayDiff[] = [];

  // Find overlays only in A
  for (const a of overlaysA) {
    const matchInB = overlaysB.find(b => b.label === a.label || b.id === a.id);

    if (!matchInB) {
      diffs.push({
        type: 'A-only',
        overlayA: a,
        label: a.label
      });
    } else {
      const intensityDelta = a.intensity - matchInB.intensity;
      const typeDifference = a.type !== matchInB.type;

      if (Math.abs(intensityDelta) > 20 || typeDifference) {
        diffs.push({
          type: 'different',
          overlayA: a,
          overlayB: matchInB,
          label: a.label,
          intensityDelta,
          typeDifference
        });
      }
    }
  }

  // Find overlays only in B
  for (const b of overlaysB) {
    const matchInA = overlaysA.find(a => a.label === b.label || a.id === b.id);

    if (!matchInA) {
      diffs.push({
        type: 'B-only',
        overlayB: b,
        label: b.label
      });
    }
  }

  return diffs;
}

/**
 * Diff life chapters between two cockpits
 */
function diffChapters(chaptersA: LifeChapter[], chaptersB: LifeChapter[]): ChapterDiff[] {
  const diffs: ChapterDiff[] = [];

  for (const a of chaptersA) {
    const matchInB = chaptersB.find(b => b.id === a.id || b.name === a.name);

    if (!matchInB) {
      diffs.push({
        type: 'A-only',
        chapterId: a.id,
        chapterA: a
      });
    } else {
      const toneDifference = a.overallTone !== matchInB.overallTone;
      const keyBeatsDifference = Math.abs(a.keyBeats.length - matchInB.keyBeats.length);

      if (toneDifference || keyBeatsDifference > 2) {
        diffs.push({
          type: 'different',
          chapterId: a.id,
          chapterA: a,
          chapterB: matchInB,
          toneDifference,
          keyBeatsDifference
        });
      }
    }
  }

  // Find chapters only in B
  for (const b of chaptersB) {
    const matchInA = chaptersA.find(a => a.id === b.id || a.name === b.name);

    if (!matchInA) {
      diffs.push({
        type: 'B-only',
        chapterId: b.id,
        chapterB: b
      });
    }
  }

  return diffs;
}

/**
 * Compute summary statistics for the diff
 */
function computeDiffSummary(
  storyDiffs: StoryBeatDiff[],
  emoDiffs: EmotionalArcDiff[],
  timingDiffs: TimingCurveDiff[],
  overlayDiffs: OverlayDiff[],
  chapterDiffs: ChapterDiff[]
): DiffSummary {
  const storyBeatDifferenceCount = storyDiffs.length;
  const emotionalArcDifferenceCount = emoDiffs.length;
  const timingCurveDifferenceCount = timingDiffs.length;
  const overlayDifferenceCount = overlayDiffs.length;
  const chapterDifferenceCount = chapterDiffs.length;

  const totalDifferences =
    storyBeatDifferenceCount +
    emotionalArcDifferenceCount +
    timingCurveDifferenceCount +
    overlayDifferenceCount +
    chapterDifferenceCount;

  // Calculate overall similarity (inverse of normalized differences)
  const maxPossibleDiffs = 50; // Rough estimate
  const overallSimilarity = Math.max(0, Math.round(100 - (totalDifferences / maxPossibleDiffs) * 100));

  // Determine dominant difference type
  const maxDiff = Math.max(
    storyBeatDifferenceCount,
    emotionalArcDifferenceCount,
    timingCurveDifferenceCount,
    overlayDifferenceCount,
    chapterDifferenceCount
  );

  let dominantDifferenceType = 'balanced';
  if (maxDiff === storyBeatDifferenceCount && storyBeatDifferenceCount > 0) {
    dominantDifferenceType = 'story_structure';
  } else if (maxDiff === emotionalArcDifferenceCount && emotionalArcDifferenceCount > 0) {
    dominantDifferenceType = 'emotional_trajectory';
  } else if (maxDiff === timingCurveDifferenceCount && timingCurveDifferenceCount > 0) {
    dominantDifferenceType = 'timing_luck';
  } else if (maxDiff === overlayDifferenceCount && overlayDifferenceCount > 0) {
    dominantDifferenceType = 'environmental_context';
  } else if (maxDiff === chapterDifferenceCount && chapterDifferenceCount > 0) {
    dominantDifferenceType = 'life_chapters';
  }

  // Determine narrative tone difference
  let narrativeToneDifference = 'similar';
  const emotionalDeltas = emoDiffs.filter(d => d.intensityDelta).map(d => d.intensityDelta!);
  if (emotionalDeltas.length > 0) {
    const avgDelta = emotionalDeltas.reduce((a, b) => a + b, 0) / emotionalDeltas.length;
    if (avgDelta > 20) narrativeToneDifference = 'A more positive';
    else if (avgDelta < -20) narrativeToneDifference = 'B more positive';
    else narrativeToneDifference = 'similar emotional tone';
  }

  return {
    totalDifferences,
    storyBeatDifferenceCount,
    emotionalArcDifferenceCount,
    timingCurveDifferenceCount,
    overlayDifferenceCount,
    chapterDifferenceCount,
    overallSimilarity,
    dominantDifferenceType,
    narrativeToneDifference
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get rules that are unique to Chart A
 */
export function getRulesUniqueToA(
  codexA: CodexEntry[],
  codexB: CodexEntry[]
): CodexEntry[] {
  return codexA.filter(a => !codexB.some(b => b.rule.id === a.rule.id));
}

/**
 * Get rules that are unique to Chart B
 */
export function getRulesUniqueToB(
  codexA: CodexEntry[],
  codexB: CodexEntry[]
): CodexEntry[] {
  return codexB.filter(b => !codexA.some(a => a.rule.id === b.rule.id));
}

/**
 * Get shared rules between both charts
 */
export function getSharedRules(
  codexA: CodexEntry[],
  codexB: CodexEntry[]
): { ruleId: string; entryA: CodexEntry; entryB: CodexEntry }[] {
  const shared: { ruleId: string; entryA: CodexEntry; entryB: CodexEntry }[] = [];

  for (const a of codexA) {
    const matchB = codexB.find(b => b.rule.id === a.rule.id);
    if (matchB) {
      shared.push({ ruleId: a.rule.id, entryA: a, entryB: matchB });
    }
  }

  return shared;
}

/**
 * Generate narrative comparison summary text
 */
export function generateDiffNarrativeSummary(diff: NarrativeDiff, nameA: string, nameB: string): string {
  const { summary } = diff;

  if (summary.totalDifferences === 0) {
    return `${nameA} and ${nameB} share remarkably similar narrative structures.`;
  }

  if (summary.overallSimilarity > 80) {
    return `${nameA} and ${nameB} have highly compatible narratives with ${summary.overallSimilarity}% similarity. Their life stories resonate on similar frequencies.`;
  }

  if (summary.overallSimilarity > 50) {
    return `${nameA} and ${nameB} share meaningful narrative connections (${summary.overallSimilarity}% similar) with notable differences in ${summary.dominantDifferenceType.replace('_', ' ')}. ${summary.narrativeToneDifference}.`;
  }

  return `${nameA} and ${nameB} walk distinct narrative paths (${summary.overallSimilarity}% similar). Primary divergence: ${summary.dominantDifferenceType.replace('_', ' ')}. This difference creates complementary dynamics.`;
}

// ==================== EXPORTS ====================

export {
  buildStoryBeatReverseMap,
  getStoryBeatReverseMap,
  diffNarratives,
  diffStoryBeats,
  diffEmotionalArc,
  diffTimingCurve,
  diffOverlays,
  diffChapters,
  getRulesUniqueToA,
  getRulesUniqueToB,
  getSharedRules,
  generateDiffNarrativeSummary
};
