/**
 * ============================================
 * CONSTELLATION NARRATIVE DIFF
 * Relationship-level narrative comparison
 *
 * Compares how two people's narratives interact,
 * not just their individual charts - for use in
 * the Constellation chamber.
 * ============================================
 */

import {
  NarrativeCockpitData,
  StoryBeat,
  EmotionalArcPoint,
  TimingCurvePoint,
  EnvironmentalOverlay
} from './narrativeCockpitModel';

// ==================== RELATIONSHIP DIFF TYPES ====================

export interface RelationshipNarrativeDiff {
  relationshipId: string;
  personAId: string;
  personBId: string;
  personAName?: string;
  personBName?: string;
  storyBeatDiff: RelStoryBeatDiff[];
  emotionalDiff: RelEmotionalDiffPoint[];
  timingDiff: RelTimingDiffPoint[];
  overlayDiff: RelOverlayDiff[];
  summary: RelationshipDiffSummary;
}

export interface RelStoryBeatDiff {
  type: 'A-only' | 'B-only' | 'shared' | 'conflicting';
  source: 'A' | 'B' | 'both';
  beatLabel: string;
  beatLabelZh?: string;
  startAge: number;
  endAge: number;
  intensityA?: number;
  intensityB?: number;
  valenceA?: string;
  valenceB?: string;
  narrativeNote?: string;
}

export interface RelEmotionalDiffPoint {
  age: number;
  valueA?: number;
  valueB?: number;
  delta?: number;
  type: 'missing' | 'delta' | 'aligned';
  resonanceLevel: 'high' | 'medium' | 'low' | 'none';
}

export interface RelTimingDiffPoint {
  age: number;
  luckA?: number;
  luckB?: number;
  luckDelta?: number;
  volatilityA?: number;
  volatilityB?: number;
  volatilityDelta?: number;
  type: 'missing' | 'delta' | 'aligned';
  synchronicity: 'synced' | 'offset' | 'opposed';
}

export interface RelOverlayDiff {
  type: 'A-only' | 'B-only' | 'shared';
  source: 'A' | 'B' | 'both';
  label: string;
  startAge: number;
  endAge: number;
  overlayType?: string;
  intensity?: number;
}

export interface RelationshipDiffSummary {
  totalDifferences: number;
  sharedBeats: number;
  uniqueBeatsA: number;
  uniqueBeatsB: number;
  emotionalResonance: number; // 0-100
  timingSynchronicity: number; // 0-100
  overallHarmony: number; // 0-100
  dominantDynamicType: string;
  narrativeInsight: string;
}

// ==================== CORE DIFF FUNCTION ====================

/**
 * Generate relationship-level narrative diff between two people
 */
export function diffRelationshipNarrative(
  relationshipId: string,
  personAId: string,
  personBId: string,
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData,
  personAName?: string,
  personBName?: string
): RelationshipNarrativeDiff {
  const storyBeatDiff = diffRelStoryBeats(cockpitA, cockpitB);
  const emotionalDiff = diffRelEmotionalArc(cockpitA, cockpitB);
  const timingDiff = diffRelTimingCurve(cockpitA, cockpitB);
  const overlayDiff = diffRelOverlays(cockpitA, cockpitB);

  const summary = computeRelationshipSummary(
    storyBeatDiff,
    emotionalDiff,
    timingDiff,
    overlayDiff,
    personAName || personAId,
    personBName || personBId
  );

  return {
    relationshipId,
    personAId,
    personBId,
    personAName,
    personBName,
    storyBeatDiff,
    emotionalDiff,
    timingDiff,
    overlayDiff,
    summary
  };
}

// ==================== STORY BEAT DIFF ====================

function diffRelStoryBeats(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData
): RelStoryBeatDiff[] {
  const diffs: RelStoryBeatDiff[] = [];
  const processedLabels = new Set<string>();

  // Find A-only and shared beats
  for (const beatA of cockpitA.storyBeats) {
    const matchB = cockpitB.storyBeats.find(b =>
      b.label === beatA.label ||
      (Math.abs(b.timeRange.startAge - beatA.timeRange.startAge) < 5 &&
       Math.abs(b.timeRange.endAge - beatA.timeRange.endAge) < 5)
    );

    if (!matchB) {
      diffs.push({
        type: 'A-only',
        source: 'A',
        beatLabel: beatA.label,
        beatLabelZh: beatA.labelZh,
        startAge: beatA.timeRange.startAge,
        endAge: beatA.timeRange.endAge,
        intensityA: beatA.intensity,
        valenceA: beatA.valence,
        narrativeNote: `Unique experience in ${beatA.label}`
      });
    } else {
      // Check if shared or conflicting
      const valenceDiffers = beatA.valence !== matchB.valence;
      const intensityDelta = Math.abs(beatA.intensity - matchB.intensity);

      diffs.push({
        type: valenceDiffers || intensityDelta > 30 ? 'conflicting' : 'shared',
        source: 'both',
        beatLabel: beatA.label,
        beatLabelZh: beatA.labelZh,
        startAge: Math.min(beatA.timeRange.startAge, matchB.timeRange.startAge),
        endAge: Math.max(beatA.timeRange.endAge, matchB.timeRange.endAge),
        intensityA: beatA.intensity,
        intensityB: matchB.intensity,
        valenceA: beatA.valence,
        valenceB: matchB.valence,
        narrativeNote: valenceDiffers
          ? `Different experiences: ${beatA.valence} vs ${matchB.valence}`
          : `Shared resonance in ${beatA.label}`
      });
      processedLabels.add(matchB.label);
    }
    processedLabels.add(beatA.label);
  }

  // Find B-only beats
  for (const beatB of cockpitB.storyBeats) {
    if (processedLabels.has(beatB.label)) continue;

    const hasOverlap = cockpitA.storyBeats.some(a =>
      Math.abs(a.timeRange.startAge - beatB.timeRange.startAge) < 5 &&
      Math.abs(a.timeRange.endAge - beatB.timeRange.endAge) < 5
    );

    if (!hasOverlap) {
      diffs.push({
        type: 'B-only',
        source: 'B',
        beatLabel: beatB.label,
        beatLabelZh: beatB.labelZh,
        startAge: beatB.timeRange.startAge,
        endAge: beatB.timeRange.endAge,
        intensityB: beatB.intensity,
        valenceB: beatB.valence,
        narrativeNote: `Unique experience in ${beatB.label}`
      });
    }
  }

  return diffs.sort((a, b) => a.startAge - b.startAge);
}

// ==================== EMOTIONAL ARC DIFF ====================

function diffRelEmotionalArc(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData
): RelEmotionalDiffPoint[] {
  const diffs: RelEmotionalDiffPoint[] = [];
  const ages = new Set([
    ...cockpitA.emotionalArc.map(p => p.age),
    ...cockpitB.emotionalArc.map(p => p.age)
  ]);

  for (const age of ages) {
    const pointA = cockpitA.emotionalArc.find(p => p.age === age);
    const pointB = cockpitB.emotionalArc.find(p => p.age === age);

    if (!pointA || !pointB) {
      diffs.push({
        age,
        valueA: pointA?.intensity,
        valueB: pointB?.intensity,
        type: 'missing',
        resonanceLevel: 'none'
      });
      continue;
    }

    const delta = pointA.intensity - pointB.intensity;
    const absDelta = Math.abs(delta);

    let resonanceLevel: 'high' | 'medium' | 'low' | 'none';
    if (absDelta <= 15) resonanceLevel = 'high';
    else if (absDelta <= 35) resonanceLevel = 'medium';
    else if (absDelta <= 55) resonanceLevel = 'low';
    else resonanceLevel = 'none';

    diffs.push({
      age,
      valueA: pointA.intensity,
      valueB: pointB.intensity,
      delta,
      type: absDelta > 20 ? 'delta' : 'aligned',
      resonanceLevel
    });
  }

  return diffs.sort((a, b) => a.age - b.age);
}

// ==================== TIMING CURVE DIFF ====================

function diffRelTimingCurve(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData
): RelTimingDiffPoint[] {
  const diffs: RelTimingDiffPoint[] = [];
  const ages = new Set([
    ...cockpitA.timingCurve.map(p => p.age),
    ...cockpitB.timingCurve.map(p => p.age)
  ]);

  for (const age of ages) {
    const pointA = cockpitA.timingCurve.find(p => p.age === age);
    const pointB = cockpitB.timingCurve.find(p => p.age === age);

    if (!pointA || !pointB) {
      diffs.push({
        age,
        luckA: pointA?.luckLevel,
        luckB: pointB?.luckLevel,
        volatilityA: pointA?.volatility,
        volatilityB: pointB?.volatility,
        type: 'missing',
        synchronicity: 'offset'
      });
      continue;
    }

    const luckDelta = pointA.luckLevel - pointB.luckLevel;
    const volDelta = pointA.volatility - pointB.volatility;
    const absLuckDelta = Math.abs(luckDelta);
    const absVolDelta = Math.abs(volDelta);

    // Determine synchronicity
    let synchronicity: 'synced' | 'offset' | 'opposed';
    if (absLuckDelta <= 15 && absVolDelta <= 15) {
      synchronicity = 'synced';
    } else if (
      (pointA.luckLevel > 60 && pointB.luckLevel < 40) ||
      (pointA.luckLevel < 40 && pointB.luckLevel > 60)
    ) {
      synchronicity = 'opposed';
    } else {
      synchronicity = 'offset';
    }

    diffs.push({
      age,
      luckA: pointA.luckLevel,
      luckB: pointB.luckLevel,
      luckDelta,
      volatilityA: pointA.volatility,
      volatilityB: pointB.volatility,
      volatilityDelta: volDelta,
      type: absLuckDelta > 15 || absVolDelta > 15 ? 'delta' : 'aligned',
      synchronicity
    });
  }

  return diffs.sort((a, b) => a.age - b.age);
}

// ==================== OVERLAY DIFF ====================

function diffRelOverlays(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData
): RelOverlayDiff[] {
  const diffs: RelOverlayDiff[] = [];
  const processedLabels = new Set<string>();

  // Find A-only and shared overlays
  for (const overlayA of cockpitA.overlays) {
    const matchB = cockpitB.overlays.find(o =>
      o.label === overlayA.label || o.id === overlayA.id
    );

    if (!matchB) {
      diffs.push({
        type: 'A-only',
        source: 'A',
        label: overlayA.label,
        startAge: overlayA.activeAges?.[0] || 0,
        endAge: overlayA.activeAges?.[overlayA.activeAges.length - 1] || 100,
        overlayType: overlayA.type,
        intensity: overlayA.intensity
      });
    } else {
      diffs.push({
        type: 'shared',
        source: 'both',
        label: overlayA.label,
        startAge: Math.min(
          overlayA.activeAges?.[0] || 0,
          matchB.activeAges?.[0] || 0
        ),
        endAge: Math.max(
          overlayA.activeAges?.[overlayA.activeAges.length - 1] || 100,
          matchB.activeAges?.[matchB.activeAges.length - 1] || 100
        ),
        overlayType: overlayA.type,
        intensity: (overlayA.intensity + matchB.intensity) / 2
      });
      processedLabels.add(matchB.label);
    }
    processedLabels.add(overlayA.label);
  }

  // Find B-only overlays
  for (const overlayB of cockpitB.overlays) {
    if (processedLabels.has(overlayB.label)) continue;

    diffs.push({
      type: 'B-only',
      source: 'B',
      label: overlayB.label,
      startAge: overlayB.activeAges?.[0] || 0,
      endAge: overlayB.activeAges?.[overlayB.activeAges.length - 1] || 100,
      overlayType: overlayB.type,
      intensity: overlayB.intensity
    });
  }

  return diffs;
}

// ==================== SUMMARY COMPUTATION ====================

function computeRelationshipSummary(
  storyDiffs: RelStoryBeatDiff[],
  emoDiffs: RelEmotionalDiffPoint[],
  timingDiffs: RelTimingDiffPoint[],
  overlayDiffs: RelOverlayDiff[],
  nameA: string,
  nameB: string
): RelationshipDiffSummary {
  const sharedBeats = storyDiffs.filter(d => d.type === 'shared').length;
  const conflictingBeats = storyDiffs.filter(d => d.type === 'conflicting').length;
  const uniqueBeatsA = storyDiffs.filter(d => d.type === 'A-only').length;
  const uniqueBeatsB = storyDiffs.filter(d => d.type === 'B-only').length;

  // Emotional resonance: percentage of aligned/high resonance points
  const alignedEmo = emoDiffs.filter(d =>
    d.type === 'aligned' || d.resonanceLevel === 'high'
  ).length;
  const emotionalResonance = emoDiffs.length > 0
    ? Math.round((alignedEmo / emoDiffs.length) * 100)
    : 50;

  // Timing synchronicity: percentage of synced points
  const syncedTiming = timingDiffs.filter(d => d.synchronicity === 'synced').length;
  const timingSynchronicity = timingDiffs.length > 0
    ? Math.round((syncedTiming / timingDiffs.length) * 100)
    : 50;

  // Overall harmony: weighted average
  const storyHarmony = storyDiffs.length > 0
    ? (sharedBeats / storyDiffs.length) * 100
    : 50;
  const overallHarmony = Math.round(
    (storyHarmony * 0.3) +
    (emotionalResonance * 0.35) +
    (timingSynchronicity * 0.35)
  );

  // Dominant dynamic type
  let dominantDynamicType = 'balanced';
  if (emotionalResonance > timingSynchronicity + 20) {
    dominantDynamicType = 'emotional_bond';
  } else if (timingSynchronicity > emotionalResonance + 20) {
    dominantDynamicType = 'timing_alignment';
  } else if (sharedBeats > uniqueBeatsA + uniqueBeatsB) {
    dominantDynamicType = 'shared_journey';
  } else if (conflictingBeats > sharedBeats) {
    dominantDynamicType = 'complementary_contrast';
  }

  // Generate narrative insight
  const narrativeInsight = generateRelationshipInsight(
    nameA, nameB,
    overallHarmony,
    dominantDynamicType,
    emotionalResonance,
    timingSynchronicity
  );

  return {
    totalDifferences: storyDiffs.length + overlayDiffs.filter(d => d.type !== 'shared').length,
    sharedBeats,
    uniqueBeatsA,
    uniqueBeatsB,
    emotionalResonance,
    timingSynchronicity,
    overallHarmony,
    dominantDynamicType,
    narrativeInsight
  };
}

function generateRelationshipInsight(
  nameA: string,
  nameB: string,
  harmony: number,
  dynamicType: string,
  emoRes: number,
  timingSync: number
): string {
  if (harmony >= 80) {
    return `${nameA} and ${nameB} share a deeply resonant narrative journey. Their stories weave together naturally, with emotional peaks and valleys aligning across key life phases.`;
  }

  if (harmony >= 60) {
    if (dynamicType === 'emotional_bond') {
      return `${nameA} and ${nameB} connect through emotional resonance (${emoRes}%). While their timing may differ, their hearts beat to similar rhythms.`;
    }
    if (dynamicType === 'timing_alignment') {
      return `${nameA} and ${nameB} walk parallel paths with ${timingSync}% timing synchronicity. Key life phases align, creating natural opportunities for shared growth.`;
    }
    return `${nameA} and ${nameB} share meaningful narrative connections with complementary differences that enrich their relationship.`;
  }

  if (harmony >= 40) {
    return `${nameA} and ${nameB} bring distinct narratives that create dynamic tension. Their differences offer opportunities for mutual learning and growth.`;
  }

  return `${nameA} and ${nameB} walk unique paths that intersect in unexpected ways. Their contrasting narratives create a relationship of discovery and adaptation.`;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get peak resonance periods between two people
 */
export function getPeakResonancePeriods(
  diff: RelationshipNarrativeDiff
): { startAge: number; endAge: number; type: string }[] {
  const periods: { startAge: number; endAge: number; type: string }[] = [];

  // Find consecutive ages with high resonance
  let currentPeriod: { startAge: number; endAge: number; type: string } | null = null;

  for (const point of diff.emotionalDiff) {
    if (point.resonanceLevel === 'high' || point.type === 'aligned') {
      if (!currentPeriod) {
        currentPeriod = { startAge: point.age, endAge: point.age, type: 'emotional_resonance' };
      } else {
        currentPeriod.endAge = point.age;
      }
    } else {
      if (currentPeriod && currentPeriod.endAge - currentPeriod.startAge >= 5) {
        periods.push(currentPeriod);
      }
      currentPeriod = null;
    }
  }

  if (currentPeriod && currentPeriod.endAge - currentPeriod.startAge >= 5) {
    periods.push(currentPeriod);
  }

  return periods;
}

/**
 * Get conflict periods between two people
 */
export function getConflictPeriods(
  diff: RelationshipNarrativeDiff
): { startAge: number; endAge: number; type: string }[] {
  const periods: { startAge: number; endAge: number; type: string }[] = [];

  // From story beats
  diff.storyBeatDiff
    .filter(d => d.type === 'conflicting')
    .forEach(d => {
      periods.push({
        startAge: d.startAge,
        endAge: d.endAge,
        type: 'narrative_conflict'
      });
    });

  // From timing
  diff.timingDiff
    .filter(d => d.synchronicity === 'opposed')
    .forEach(d => {
      periods.push({
        startAge: d.age,
        endAge: d.age + 1,
        type: 'timing_opposition'
      });
    });

  return periods.sort((a, b) => a.startAge - b.startAge);
}

// ==================== EXPORTS ====================

export {
  diffRelationshipNarrative,
  getPeakResonancePeriods,
  getConflictPeriods
};
