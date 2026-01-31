/**
 * ============================================================================
 * MICRO-TIMING UTILITIES (微时序工具)
 * ============================================================================
 *
 * Convenience functions for working with micro-timing data.
 *
 * Features:
 * - Best window finder for specific contexts
 * - Multi-day analysis
 * - Time slot recommendations
 * - Integration helpers for Dashboard and Decision Engine
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  MicroContext,
  MicroRecommendation,
  MicroSegment,
  MicroTimeWindow,
  MicroTimingDay,
  MicroTimingSubject,
  MicroTimingWeek,
  MicroQualityTier
} from './microTimingTypes';

import { computeMicroTimingDay } from './microTimingEngine';

// ============================================================================
// BEST WINDOW FINDERS
// ============================================================================

/**
 * Find the single best window for a given context
 */
export function findBestWindow(
  day: MicroTimingDay,
  context: MicroContext
): MicroTimeWindow | null {
  const windows = day.summary[`peak${capitalize(context)}Windows` as keyof typeof day.summary] as MicroTimeWindow[] | undefined;

  if (windows && windows.length > 0) {
    return windows[0];
  }

  // Fallback: find best individual segment
  const scoreKey = `${context}Score` as keyof MicroSegment;
  let bestSegment: MicroSegment | null = null;
  let bestScore = -1;

  for (const segment of day.segments) {
    const score = segment[scoreKey] as number;
    if (score > bestScore) {
      bestScore = score;
      bestSegment = segment;
    }
  }

  if (bestSegment && bestScore >= 60) {
    return {
      startIndex: bestSegment.index,
      endIndex: bestSegment.index,
      startTime: bestSegment.start,
      endTime: bestSegment.end,
      averageScore: bestScore,
      tier: bestSegment.tier,
      context,
      recommendation: `Best available ${context} window.`,
      recommendationChinese: `可用的最佳${getContextChinese(context)}时段。`
    };
  }

  return null;
}

/**
 * Find all windows above a threshold for a context
 */
export function findWindowsAboveThreshold(
  day: MicroTimingDay,
  context: MicroContext,
  threshold: number = 70
): MicroTimeWindow[] {
  const scoreKey = `${context}Score` as keyof MicroSegment;
  const windows: MicroTimeWindow[] = [];

  let windowStart: number | null = null;
  let windowSegments: MicroSegment[] = [];

  for (let i = 0; i < day.segments.length; i++) {
    const score = day.segments[i][scoreKey] as number;
    const isAbove = score >= threshold;

    if (isAbove) {
      if (windowStart === null) {
        windowStart = i;
        windowSegments = [day.segments[i]];
      } else {
        windowSegments.push(day.segments[i]);
      }
    } else {
      if (windowStart !== null) {
        windows.push(createWindow(windowStart, windowSegments, context));
      }
      windowStart = null;
      windowSegments = [];
    }
  }

  if (windowStart !== null) {
    windows.push(createWindow(windowStart, windowSegments, context));
  }

  return windows.sort((a, b) => b.averageScore - a.averageScore);
}

/**
 * Get recommendation for a specific context
 */
export function getMicroRecommendation(
  day: MicroTimingDay,
  context: MicroContext
): MicroRecommendation {
  const bestWindow = findBestWindow(day, context);
  const allWindows = findWindowsAboveThreshold(day, context, 70);
  const avoidWindows = findWindowsAboveThreshold(day, context, 0)
    .filter(w => w.averageScore < 40);

  let narrative: string;
  let narrativeChinese: string;

  if (bestWindow && bestWindow.tier === 'excellent') {
    narrative = `Today has excellent ${context} windows. Best time: ${formatTimeRange(bestWindow)}.`;
    narrativeChinese = `今日${getContextChinese(context)}时机极佳。最佳时段：${formatTimeRangeChinese(bestWindow)}。`;
  } else if (bestWindow && bestWindow.tier === 'good') {
    narrative = `Today has favorable ${context} opportunities. Recommended: ${formatTimeRange(bestWindow)}.`;
    narrativeChinese = `今日${getContextChinese(context)}时机良好。推荐时段：${formatTimeRangeChinese(bestWindow)}。`;
  } else if (bestWindow) {
    narrative = `Today's ${context} energy is moderate. Consider: ${formatTimeRange(bestWindow)}.`;
    narrativeChinese = `今日${getContextChinese(context)}能量一般。可考虑：${formatTimeRangeChinese(bestWindow)}。`;
  } else {
    narrative = `Today may not be ideal for ${context}. Consider waiting for a better day.`;
    narrativeChinese = `今日${getContextChinese(context)}时机欠佳，建议择日。`;
  }

  return {
    context,
    bestWindow,
    alternativeWindows: allWindows.slice(1, 4), // Top 3 alternatives
    avoidWindows: avoidWindows.slice(0, 2),
    narrative,
    narrativeChinese
  };
}

// ============================================================================
// MULTI-DAY ANALYSIS
// ============================================================================

/**
 * Analyze micro-timing for a week
 */
export function computeMicroTimingWeek(
  startDate: string,
  subject: MicroTimingSubject,
  primaryContext?: MicroContext
): MicroTimingWeek {
  const days: MicroTimingDay[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const result = computeMicroTimingDay({
      date: dateStr,
      resolution: 'minute15',
      subject,
      primaryContext
    });

    if (result.success && result.data) {
      days.push(result.data);
    }
  }

  // Find best days for each context
  let bestRelationshipDay = '';
  let bestRelationshipScore = -1;
  let bestActionDay = '';
  let bestActionScore = -1;

  for (const day of days) {
    const relScore = day.summary.averageRelationshipScore;
    const actScore = day.summary.averageActionScore;

    if (relScore > bestRelationshipScore) {
      bestRelationshipScore = relScore;
      bestRelationshipDay = day.date;
    }
    if (actScore > bestActionScore) {
      bestActionScore = actScore;
      bestActionDay = day.date;
    }
  }

  // Generate overall recommendation
  const excellentDays = days.filter(d => {
    const excellent = d.segments.filter(s => s.tier === 'excellent').length;
    return excellent >= 8; // At least 2 hours of excellent time
  });

  let overallRecommendation: string;
  if (excellentDays.length >= 3) {
    overallRecommendation = `A favorable week with ${excellentDays.length} excellent days.`;
  } else if (excellentDays.length >= 1) {
    overallRecommendation = `This week has ${excellentDays.length} day(s) with strong windows.`;
  } else {
    overallRecommendation = `This week requires careful timing. Focus on the best available windows.`;
  }

  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + 6);

  return {
    startDate,
    endDate: endDate.toISOString().split('T')[0],
    days,
    bestDayForRelationship: bestRelationshipDay,
    bestDayForAction: bestActionDay,
    overallRecommendation
  };
}

/**
 * Find the best day in a range for a specific context
 */
export function findBestDayInRange(
  days: MicroTimingDay[],
  context: MicroContext
): { date: string; score: number; bestWindow: MicroTimeWindow | null } | null {
  if (days.length === 0) return null;

  const scoreKey = context === 'relationship'
    ? 'averageRelationshipScore'
    : 'averageActionScore';

  let bestDay: MicroTimingDay | null = null;
  let bestScore = -1;

  for (const day of days) {
    const score = day.summary[scoreKey as keyof typeof day.summary] as number;
    if (score > bestScore) {
      bestScore = score;
      bestDay = day;
    }
  }

  if (!bestDay) return null;

  return {
    date: bestDay.date,
    score: bestScore,
    bestWindow: findBestWindow(bestDay, context)
  };
}

// ============================================================================
// DASHBOARD INTEGRATION HELPERS
// ============================================================================

/**
 * Get today's micro-timing highlights for dashboard display
 */
export function getDashboardMicroTimingHighlights(
  day: MicroTimingDay
): {
  topRelationshipWindow: MicroTimeWindow | null;
  topActionWindow: MicroTimeWindow | null;
  currentSegmentTier: MicroQualityTier;
  hoursUntilNextPeak: number | null;
  dayQuality: 'excellent' | 'good' | 'mixed' | 'challenging';
} {
  const topRelationshipWindow = findBestWindow(day, 'relationship');
  const topActionWindow = findBestWindow(day, 'action');

  // Get current segment (based on current time)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentIndex = currentHour * 4 + Math.floor(currentMinute / 15);
  const currentSegment = day.segments[currentIndex] || day.segments[0];

  // Find next peak
  let hoursUntilNextPeak: number | null = null;
  for (let i = currentIndex + 1; i < day.segments.length; i++) {
    if (day.segments[i].tier === 'excellent') {
      hoursUntilNextPeak = (i - currentIndex) / 4; // Convert segments to hours
      break;
    }
  }

  // Determine day quality
  const excellentCount = day.segments.filter(s => s.tier === 'excellent').length;
  const goodCount = day.segments.filter(s => s.tier === 'good').length;
  const cautionCount = day.segments.filter(s => s.tier === 'caution' || s.tier === 'avoid').length;

  let dayQuality: 'excellent' | 'good' | 'mixed' | 'challenging';
  if (excellentCount >= 12) {
    dayQuality = 'excellent';
  } else if (excellentCount + goodCount >= 24) {
    dayQuality = 'good';
  } else if (cautionCount >= 40) {
    dayQuality = 'challenging';
  } else {
    dayQuality = 'mixed';
  }

  return {
    topRelationshipWindow,
    topActionWindow,
    currentSegmentTier: currentSegment.tier,
    hoursUntilNextPeak,
    dayQuality
  };
}

/**
 * Get micro-timing recommendation for Decision Engine integration
 */
export function getMicroTimingForDecision(
  day: MicroTimingDay,
  decisionContext: 'commitment' | 'conversation' | 'action' | 'wait'
): {
  shouldProceed: boolean;
  bestWindowToday: MicroTimeWindow | null;
  confidence: number;
  advice: string;
  adviceChinese: string;
} {
  // Map decision context to micro-timing context
  const contextMap: Record<string, MicroContext> = {
    commitment: 'relationship',
    conversation: 'communication',
    action: 'action',
    wait: 'rest'
  };

  const context = contextMap[decisionContext] || 'action';
  const bestWindow = findBestWindow(day, context);

  // Calculate confidence based on best window quality
  let confidence: number;
  let shouldProceed: boolean;
  let advice: string;
  let adviceChinese: string;

  if (bestWindow && bestWindow.tier === 'excellent') {
    shouldProceed = true;
    confidence = 90;
    advice = `Today has an excellent window at ${formatTimeRange(bestWindow)}. Highly recommended.`;
    adviceChinese = `今日${formatTimeRangeChinese(bestWindow)}时段极佳，强烈推荐。`;
  } else if (bestWindow && bestWindow.tier === 'good') {
    shouldProceed = true;
    confidence = 75;
    advice = `Today has a good window at ${formatTimeRange(bestWindow)}. Proceed with confidence.`;
    adviceChinese = `今日${formatTimeRangeChinese(bestWindow)}时段良好，可放心进行。`;
  } else if (bestWindow && bestWindow.tier === 'neutral') {
    shouldProceed = true;
    confidence = 55;
    advice = `Today's windows are moderate. If urgent, consider ${formatTimeRange(bestWindow)}.`;
    adviceChinese = `今日时机一般。如紧急，可考虑${formatTimeRangeChinese(bestWindow)}。`;
  } else {
    shouldProceed = false;
    confidence = 30;
    advice = `Today's micro-timing is not favorable. Consider waiting for a better day.`;
    adviceChinese = `今日微时序不佳，建议择日。`;
  }

  return {
    shouldProceed,
    bestWindowToday: bestWindow,
    confidence,
    advice,
    adviceChinese
  };
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Format time window as readable range
 */
function formatTimeRange(window: MicroTimeWindow): string {
  const start = new Date(window.startTime);
  const end = new Date(window.endTime);
  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Format time window in Chinese
 */
function formatTimeRangeChinese(window: MicroTimeWindow): string {
  const start = new Date(window.startTime);
  const end = new Date(window.endTime);
  return `${start.getHours()}时${start.getMinutes() || ''}至${end.getHours()}时${end.getMinutes() || ''}`;
}

/**
 * Format time for display
 */
function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : '';
  return `${displayHours}${displayMinutes}${ampm}`;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get Chinese name for context
 */
function getContextChinese(context: MicroContext): string {
  const map: Record<MicroContext, string> = {
    relationship: '感情',
    action: '行动',
    wealth: '财运',
    health: '健康',
    communication: '沟通',
    creativity: '创意',
    rest: '休息'
  };
  return map[context] || context;
}

/**
 * Create time window from segments
 */
function createWindow(
  startIndex: number,
  segments: MicroSegment[],
  context: MicroContext
): MicroTimeWindow {
  const scoreKey = `${context}Score` as keyof MicroSegment;
  const scores = segments.map(s => s[scoreKey] as number);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  let tier: MicroQualityTier;
  if (avgScore >= 85) tier = 'excellent';
  else if (avgScore >= 70) tier = 'good';
  else if (avgScore >= 50) tier = 'neutral';
  else if (avgScore >= 30) tier = 'caution';
  else tier = 'avoid';

  return {
    startIndex,
    endIndex: startIndex + segments.length - 1,
    startTime: segments[0].start,
    endTime: segments[segments.length - 1].end,
    averageScore: Math.round(avgScore),
    tier,
    context,
    recommendation: `${capitalize(tier)} window for ${context}.`,
    recommendationChinese: `${getContextChinese(context)}的${getTierChinese(tier)}时段。`
  };
}

/**
 * Get Chinese name for tier
 */
function getTierChinese(tier: MicroQualityTier): string {
  const map: Record<MicroQualityTier, string> = {
    excellent: '极佳',
    good: '良好',
    neutral: '普通',
    caution: '谨慎',
    avoid: '避开'
  };
  return map[tier] || tier;
}

