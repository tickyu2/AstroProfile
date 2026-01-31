/**
 * ============================================================================
 * MICRO-TIMING ENGINE (微时序引擎)
 * ============================================================================
 *
 * Main engine for computing micro-timing (sub-hourly) analysis.
 *
 * The finest temporal layer in the BaZi timing hierarchy:
 *   Luck Pillars → Years → Months → Days → Hours → Micro-Segments
 *
 * Features:
 * - 15-minute resolution (96 segments/day) - default, recommended
 * - 5-minute resolution (288 segments/day) - high precision, optional
 * - Context-specific scoring (relationship, action, wealth, health, etc.)
 * - Peak window detection
 * - Narrative generation
 *
 * Use Cases:
 * - Best window for important conversations
 * - Optimal timing for key messages/calls
 * - Avoiding micro-clashes during sensitive moments
 * - Fine-tuning within already-favorable days
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ComputeMicroTimingOptions,
  MicroContext,
  MicroDaySummary,
  MicroResolution,
  MicroSegment,
  MicroTimeWindow,
  MicroTimingDay,
  MicroTimingResult,
  MicroTimingSubject,
  MicroQualityTier,
  SEGMENTS_PER_DAY,
  MINUTES_PER_SEGMENT
} from './microTimingTypes';

import {
  deriveMicroPillar,
  getDayStemIndex,
  getDayPillar,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from './microPillarDerivation';

import {
  scoreMicroSegment,
  generateSegmentNarrative,
  getTierFromScore
} from './microTimingScoring';

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

/**
 * Compute complete micro-timing analysis for a single day
 */
export function computeMicroTimingDay(
  options: ComputeMicroTimingOptions
): MicroTimingResult {
  try {
    const {
      date,
      resolution = 'minute15',
      subject,
      primaryContext,
      timezone = 'UTC',
      includeNarrative = true
    } = options;

    // Validate date
    if (!isValidDate(date)) {
      return { success: false, error: `Invalid date format: ${date}` };
    }

    // Get day pillar info
    const dayPillar = getDayPillar(date);
    const dayStemIndex = getDayStemIndex(date);

    // Calculate segment parameters
    const segmentsPerHour = resolution === 'minute15' ? 4 : 12;
    const totalSegments = 24 * segmentsPerHour;
    const minutesPerSegment = 60 / segmentsPerHour;

    // Generate all segments
    const segments: MicroSegment[] = [];

    for (let i = 0; i < totalSegments; i++) {
      const segment = computeSingleSegment(
        date,
        i,
        resolution,
        dayStemIndex,
        subject,
        primaryContext,
        includeNarrative
      );
      segments.push(segment);
    }

    // Generate day summary
    const summary = generateDaySummary(segments, primaryContext);

    // Build complete result
    const microTimingDay: MicroTimingDay = {
      date,
      resolution,
      dayPillar: {
        stem: dayPillar.stem,
        branch: dayPillar.branch,
        element: dayPillar.element
      },
      segments,
      summary
    };

    return {
      success: true,
      data: microTimingDay
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Compute a single segment
 */
function computeSingleSegment(
  date: string,
  segmentIndex: number,
  resolution: MicroResolution,
  dayStemIndex: number,
  subject: MicroTimingSubject,
  primaryContext?: MicroContext,
  includeNarrative: boolean = true
): MicroSegment {
  const segmentsPerHour = resolution === 'minute15' ? 4 : 12;
  const minutesPerSegment = 60 / segmentsPerHour;

  // Calculate time
  const hour = Math.floor(segmentIndex / segmentsPerHour);
  const segmentInHour = segmentIndex % segmentsPerHour;
  const minute = segmentInHour * minutesPerSegment;

  // Build ISO timestamps
  const start = formatISOTime(date, hour, minute);
  const endMinute = minute + minutesPerSegment;
  const endHour = endMinute >= 60 ? hour + 1 : hour;
  const endMinuteAdjusted = endMinute >= 60 ? 0 : endMinute;
  const end = formatISOTime(date, endHour % 24, endMinuteAdjusted);

  // Derive micro pillar
  const pillar = deriveMicroPillar(date, hour, minute, dayStemIndex, resolution);

  // Score the segment
  const scores = scoreMicroSegment(pillar, subject, primaryContext);

  // Generate narrative if requested
  let notes = scores.notes;
  let warnings = scores.warnings;

  if (includeNarrative) {
    const narrative = generateSegmentNarrative(scores, pillar, primaryContext);
    // Notes already populated by scoring
  }

  return {
    start,
    end,
    index: segmentIndex,
    pillar,
    relationshipScore: scores.relationshipScore,
    actionScore: scores.actionScore,
    wealthScore: scores.wealthScore,
    healthScore: scores.healthScore,
    communicationScore: scores.communicationScore,
    creativityScore: scores.creativityScore,
    restScore: scores.restScore,
    overallScore: scores.overallScore,
    tier: scores.tier,
    notes,
    warnings,
    elementSupport: scores.elementSupport,
    elementChallenge: scores.elementChallenge
  };
}

// ============================================================================
// DAY SUMMARY GENERATION
// ============================================================================

/**
 * Generate summary of micro-timing for a day
 */
function generateDaySummary(
  segments: MicroSegment[],
  primaryContext?: MicroContext
): MicroDaySummary {
  // Find peak windows for each context
  const peakRelationshipWindows = findPeakWindows(segments, 'relationship');
  const peakActionWindows = findPeakWindows(segments, 'action');
  const peakWealthWindows = findPeakWindows(segments, 'wealth');
  const peakCommunicationWindows = findPeakWindows(segments, 'communication');

  // Find caution windows
  const cautionWindows = findCautionWindows(segments);

  // Calculate statistics
  const avgRelationship = average(segments.map(s => s.relationshipScore));
  const avgAction = average(segments.map(s => s.actionScore));

  const bestOverall = segments.reduce(
    (best, s, i) => s.overallScore > segments[best].overallScore ? i : best,
    0
  );
  const worstOverall = segments.reduce(
    (worst, s, i) => s.overallScore < segments[worst].overallScore ? i : worst,
    0
  );

  // Generate narrative
  const { dayNarrative, dayNarrativeChinese } = generateDayNarrative(
    segments,
    peakRelationshipWindows,
    peakActionWindows,
    avgRelationship,
    primaryContext
  );

  return {
    peakRelationshipWindows,
    peakActionWindows,
    peakWealthWindows,
    peakCommunicationWindows,
    cautionWindows,
    averageRelationshipScore: Math.round(avgRelationship),
    averageActionScore: Math.round(avgAction),
    bestOverallSegmentIndex: bestOverall,
    worstOverallSegmentIndex: worstOverall,
    dayNarrative,
    dayNarrativeChinese
  };
}

/**
 * Find peak windows (contiguous excellent/good segments)
 */
function findPeakWindows(
  segments: MicroSegment[],
  context: MicroContext
): MicroTimeWindow[] {
  const scoreKey = `${context}Score` as keyof MicroSegment;
  const windows: MicroTimeWindow[] = [];

  let windowStart: number | null = null;
  let windowSegments: MicroSegment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const score = segments[i][scoreKey] as number;
    const isHigh = score >= 75; // "good" or better

    if (isHigh) {
      if (windowStart === null) {
        windowStart = i;
        windowSegments = [segments[i]];
      } else {
        windowSegments.push(segments[i]);
      }
    } else {
      // End of window
      if (windowStart !== null && windowSegments.length >= 2) {
        // Only keep windows with 2+ segments (30+ minutes for 15-min resolution)
        windows.push(createTimeWindow(
          windowStart,
          i - 1,
          windowSegments,
          context
        ));
      }
      windowStart = null;
      windowSegments = [];
    }
  }

  // Handle window at end of day
  if (windowStart !== null && windowSegments.length >= 2) {
    windows.push(createTimeWindow(
      windowStart,
      segments.length - 1,
      windowSegments,
      context
    ));
  }

  // Sort by average score (best first) and take top 3
  return windows
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3);
}

/**
 * Find caution windows (contiguous low-score segments)
 */
function findCautionWindows(segments: MicroSegment[]): MicroTimeWindow[] {
  const windows: MicroTimeWindow[] = [];

  let windowStart: number | null = null;
  let windowSegments: MicroSegment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const isLow = segments[i].overallScore < 40;

    if (isLow) {
      if (windowStart === null) {
        windowStart = i;
        windowSegments = [segments[i]];
      } else {
        windowSegments.push(segments[i]);
      }
    } else {
      if (windowStart !== null && windowSegments.length >= 2) {
        windows.push(createTimeWindow(
          windowStart,
          i - 1,
          windowSegments,
          'action' // Generic context for caution
        ));
      }
      windowStart = null;
      windowSegments = [];
    }
  }

  if (windowStart !== null && windowSegments.length >= 2) {
    windows.push(createTimeWindow(
      windowStart,
      segments.length - 1,
      windowSegments,
      'action'
    ));
  }

  return windows.slice(0, 3);
}

/**
 * Create a time window from contiguous segments
 */
function createTimeWindow(
  startIndex: number,
  endIndex: number,
  segments: MicroSegment[],
  context: MicroContext
): MicroTimeWindow {
  const avgScore = average(segments.map(s => {
    const key = `${context}Score` as keyof MicroSegment;
    return s[key] as number;
  }));

  const tier = getTierFromScore(avgScore);

  const recommendation = generateWindowRecommendation(tier, context);
  const recommendationChinese = generateWindowRecommendationChinese(tier, context);

  return {
    startIndex,
    endIndex,
    startTime: segments[0].start,
    endTime: segments[segments.length - 1].end,
    averageScore: Math.round(avgScore),
    tier,
    context,
    recommendation,
    recommendationChinese
  };
}

// ============================================================================
// NARRATIVE HELPERS
// ============================================================================

/**
 * Generate window recommendation text
 */
function generateWindowRecommendation(
  tier: MicroQualityTier,
  context: MicroContext
): string {
  const contextLabels: Record<MicroContext, string> = {
    relationship: 'relationship conversations',
    action: 'decisive action',
    wealth: 'financial matters',
    health: 'self-care',
    communication: 'important messages',
    creativity: 'creative work',
    rest: 'relaxation'
  };

  switch (tier) {
    case 'excellent':
      return `Peak window for ${contextLabels[context]}. Maximize this time.`;
    case 'good':
      return `Favorable for ${contextLabels[context]}.`;
    case 'neutral':
      return `Average conditions for ${contextLabels[context]}.`;
    case 'caution':
      return `Exercise patience with ${contextLabels[context]}.`;
    case 'avoid':
      return `Best to wait or focus on rest.`;
  }
}

/**
 * Generate window recommendation in Chinese
 */
function generateWindowRecommendationChinese(
  tier: MicroQualityTier,
  context: MicroContext
): string {
  const contextLabels: Record<MicroContext, string> = {
    relationship: '感情沟通',
    action: '重要决策',
    wealth: '财务事项',
    health: '养生调理',
    communication: '重要交流',
    creativity: '创意工作',
    rest: '休息放松'
  };

  switch (tier) {
    case 'excellent':
      return `${contextLabels[context]}的最佳时段，把握机会。`;
    case 'good':
      return `适合${contextLabels[context]}。`;
    case 'neutral':
      return `${contextLabels[context]}的普通时段。`;
    case 'caution':
      return `${contextLabels[context]}需谨慎。`;
    case 'avoid':
      return `建议休息或等待更好时机。`;
  }
}

/**
 * Generate day-level narrative
 */
function generateDayNarrative(
  segments: MicroSegment[],
  peakRelationship: MicroTimeWindow[],
  peakAction: MicroTimeWindow[],
  avgRelationship: number,
  primaryContext?: MicroContext
): { dayNarrative: string; dayNarrativeChinese: string } {
  const excellentCount = segments.filter(s => s.tier === 'excellent').length;
  const goodCount = segments.filter(s => s.tier === 'good').length;
  const cautionCount = segments.filter(s => s.tier === 'caution' || s.tier === 'avoid').length;

  let dayNarrative = '';
  let dayNarrativeChinese = '';

  // Overall day quality
  if (excellentCount >= 10) {
    dayNarrative = 'A day with abundant peak windows. ';
    dayNarrativeChinese = '今日吉时充裕。';
  } else if (excellentCount + goodCount >= 20) {
    dayNarrative = 'A day with good overall energy. ';
    dayNarrativeChinese = '今日整体能量良好。';
  } else if (cautionCount >= 30) {
    dayNarrative = 'A day requiring careful timing. ';
    dayNarrativeChinese = '今日需注意择时。';
  } else {
    dayNarrative = 'A day with mixed energy. ';
    dayNarrativeChinese = '今日能量起伏。';
  }

  // Best windows
  if (peakRelationship.length > 0) {
    const best = peakRelationship[0];
    const startHour = new Date(best.startTime).getHours();
    const endHour = new Date(best.endTime).getHours();
    dayNarrative += `Best for relationship: ${formatHour(startHour)}-${formatHour(endHour)}. `;
    dayNarrativeChinese += `感情最佳时段：${startHour}时-${endHour}时。`;
  }

  if (peakAction.length > 0) {
    const best = peakAction[0];
    const startHour = new Date(best.startTime).getHours();
    const endHour = new Date(best.endTime).getHours();
    dayNarrative += `Best for action: ${formatHour(startHour)}-${formatHour(endHour)}.`;
    dayNarrativeChinese += `行动最佳时段：${startHour}时-${endHour}时。`;
  }

  return { dayNarrative, dayNarrativeChinese };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate date string format
 */
function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Format ISO timestamp
 */
function formatISOTime(date: string, hour: number, minute: number): string {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');
  return `${date}T${h}:${m}:00Z`;
}

/**
 * Format hour for display
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

/**
 * Calculate average of numbers
 */
function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export {
  computeSingleSegment,
  generateDaySummary,
  findPeakWindows,
  findCautionWindows
};

