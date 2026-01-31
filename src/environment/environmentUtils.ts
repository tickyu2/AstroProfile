/**
 * ============================================================================
 * ENVIRONMENTAL UTILITIES (环境工具)
 * ============================================================================
 *
 * Integration helpers for combining Environmental Layer with BaZi Timing.
 *
 * Features:
 * - Combined Time+Space scoring
 * - Best window finder with directional guidance
 * - Activity optimizer
 * - Dashboard integration helpers
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ActivityCategory,
  CompassDirection,
  EnvironmentalSnapshot,
  EnvironmentalSubject,
  EnvironmentalTier
} from './environmentTypes';

import { computeEnvironmentalSnapshot } from './environmentEngine';

// ============================================================================
// COMBINED TIME + SPACE SCORING
// ============================================================================

/**
 * Combined metaphysics score (BaZi Timing + Environmental)
 */
export interface CombinedMetaphysicsScore {
  timestamp: string;
  baziTimingScore: number;     // From timing engine
  environmentalScore: number;  // From environmental engine
  combinedScore: number;       // Weighted combination
  tier: 'peak' | 'excellent' | 'good' | 'mixed' | 'caution' | 'challenging';
  recommendation: string;
  recommendationChinese: string;
}

/**
 * Combine BaZi timing score with environmental score
 */
export function computeCombinedScore(
  baziTimingScore: number,
  environmentalScore: number,
  weights: { timing: number; environment: number } = { timing: 0.6, environment: 0.4 }
): CombinedMetaphysicsScore {
  const combinedScore = Math.round(
    weights.timing * baziTimingScore +
    weights.environment * environmentalScore
  );

  // Determine tier
  let tier: CombinedMetaphysicsScore['tier'];
  if (combinedScore >= 90 && baziTimingScore >= 85 && environmentalScore >= 85) {
    tier = 'peak';
  } else if (combinedScore >= 80) {
    tier = 'excellent';
  } else if (combinedScore >= 65) {
    tier = 'good';
  } else if (combinedScore >= 50) {
    tier = 'mixed';
  } else if (combinedScore >= 35) {
    tier = 'caution';
  } else {
    tier = 'challenging';
  }

  // Generate recommendation
  const { recommendation, recommendationChinese } = generateCombinedRecommendation(
    tier,
    baziTimingScore,
    environmentalScore
  );

  return {
    timestamp: new Date().toISOString(),
    baziTimingScore,
    environmentalScore,
    combinedScore,
    tier,
    recommendation,
    recommendationChinese
  };
}

/**
 * Generate recommendation based on combined scores
 */
function generateCombinedRecommendation(
  tier: CombinedMetaphysicsScore['tier'],
  timingScore: number,
  envScore: number
): { recommendation: string; recommendationChinese: string } {
  const tierRecommendations: Record<CombinedMetaphysicsScore['tier'], { en: string; zh: string }> = {
    peak: {
      en: 'Exceptional alignment of time and space. Ideal for major decisions.',
      zh: '时空完美对齐，重大决策的最佳时机。'
    },
    excellent: {
      en: 'Strong support from both timing and environment. Proceed with confidence.',
      zh: '时间与环境双重支持，可放心推进。'
    },
    good: {
      en: 'Favorable conditions overall. Good for most activities.',
      zh: '整体条件良好，适合大多数活动。'
    },
    mixed: {
      en: 'Mixed signals. Proceed with awareness; not ideal for critical matters.',
      zh: '信号混合，需谨慎行事，不宜关键事项。'
    },
    caution: {
      en: 'Exercise caution. Better to wait for improved conditions.',
      zh: '需要谨慎，建议等待更好时机。'
    },
    challenging: {
      en: 'Challenging conditions. Recommend postponing important matters.',
      zh: '条件不佳，建议推迟重要事项。'
    }
  };

  let base = tierRecommendations[tier];

  // Add specific insights
  if (timingScore > envScore + 20) {
    base.en += ' Timing is favorable but environment is weaker - stay flexible on location.';
    base.zh += '时间有利但环境较弱，位置选择需灵活。';
  } else if (envScore > timingScore + 20) {
    base.en += ' Environment is supportive but timing is weaker - be patient with timing.';
    base.zh += '环境支持但时间较弱，择时需耐心。';
  }

  return {
    recommendation: base.en,
    recommendationChinese: base.zh
  };
}

// ============================================================================
// BEST WINDOW FINDER WITH DIRECTIONS
// ============================================================================

/**
 * Complete guidance for a moment
 */
export interface MomentGuidance {
  timestamp: string;
  baziTimingScore: number;
  environmentalScore: number;
  combinedScore: number;
  tier: CombinedMetaphysicsScore['tier'];
  bestDirections: CompassDirection[];
  avoidDirections: CompassDirection[];
  bestActivities: ActivityCategory[];
  avoidActivities: ActivityCategory[];
  summary: string;
  summaryChinese: string;
}

/**
 * Get complete guidance for a specific moment
 */
export function getMomentGuidance(
  timestamp: string,
  subject: EnvironmentalSubject,
  baziTimingScore: number
): MomentGuidance | null {
  const envResult = computeEnvironmentalSnapshot({
    timestamp,
    subject
  });

  if (!envResult.success || !envResult.data) {
    return null;
  }

  const env = envResult.data;
  const combined = computeCombinedScore(baziTimingScore, env.environmentalScore);

  return {
    timestamp,
    baziTimingScore,
    environmentalScore: env.environmentalScore,
    combinedScore: combined.combinedScore,
    tier: combined.tier,
    bestDirections: env.bestDirections,
    avoidDirections: env.avoidDirections,
    bestActivities: env.bestActivities,
    avoidActivities: env.avoidActivities,
    summary: `${combined.recommendation} ${env.summary}`,
    summaryChinese: `${combined.recommendationChinese} ${env.summaryChinese}`
  };
}

/**
 * Find best windows in a day with environmental factors
 */
export function findBestWindowsWithEnvironment(
  date: string,
  subject: EnvironmentalSubject,
  baziHourlyScores: { hour: number; score: number }[]
): MomentGuidance[] {
  const results: MomentGuidance[] = [];

  for (const { hour, score } of baziHourlyScores) {
    const timestamp = `${date}T${hour.toString().padStart(2, '0')}:00:00Z`;
    const guidance = getMomentGuidance(timestamp, subject, score);

    if (guidance && guidance.tier !== 'challenging' && guidance.tier !== 'caution') {
      results.push(guidance);
    }
  }

  // Sort by combined score
  results.sort((a, b) => b.combinedScore - a.combinedScore);

  return results.slice(0, 5); // Return top 5
}

// ============================================================================
// ACTIVITY OPTIMIZER
// ============================================================================

/**
 * Activity timing recommendation
 */
export interface ActivityRecommendation {
  activity: ActivityCategory;
  timestamp: string;
  combinedScore: number;
  bestDirection: CompassDirection | null;
  notes: string;
  notesChinese: string;
}

/**
 * Find best time for a specific activity
 */
export function findBestTimeForActivity(
  date: string,
  activity: ActivityCategory,
  subject: EnvironmentalSubject,
  baziHourlyScores: { hour: number; score: number }[]
): ActivityRecommendation | null {
  let bestResult: ActivityRecommendation | null = null;
  let bestScore = -1;

  for (const { hour, score } of baziHourlyScores) {
    const timestamp = `${date}T${hour.toString().padStart(2, '0')}:00:00Z`;

    const envResult = computeEnvironmentalSnapshot({
      timestamp,
      subject
    });

    if (!envResult.success || !envResult.data) continue;

    const env = envResult.data;

    // Check if activity is suitable
    if (env.avoidActivities.includes(activity)) continue;

    // Calculate score with bonus for suitable activities
    let activityScore = (score + env.environmentalScore) / 2;
    if (env.bestActivities.includes(activity)) {
      activityScore += 10;
    }

    if (activityScore > bestScore) {
      bestScore = activityScore;
      bestResult = {
        activity,
        timestamp,
        combinedScore: Math.round(activityScore),
        bestDirection: env.bestDirections[0] || null,
        notes: `${env.summary} Recommended for ${activity}.`,
        notesChinese: `${env.summaryChinese} 适合${getActivityChinese(activity)}。`
      };
    }
  }

  return bestResult;
}

/**
 * Get Chinese name for activity
 */
function getActivityChinese(activity: ActivityCategory): string {
  const labels: Record<ActivityCategory, string> = {
    marriage: '嫁娶', engagement: '订婚', travel: '出行', move: '搬家',
    openBusiness: '开业', signing: '签约', meeting: '会见', renovation: '装修',
    medical: '就医', study: '学习', negotiation: '谈判', investment: '投资',
    celebration: '庆典', prayer: '祈福', burial: '安葬', rest: '休息'
  };
  return labels[activity] || activity;
}

// ============================================================================
// DASHBOARD INTEGRATION
// ============================================================================

/**
 * Dashboard environmental summary
 */
export interface DashboardEnvironmentalSummary {
  environmentalScore: number;
  tier: EnvironmentalTier;
  qiMenFormation: string;
  qiMenFormationChinese: string;
  dateOfficer: string;
  dateOfficerChinese: string;
  bestDirection: CompassDirection | null;
  avoidDirection: CompassDirection | null;
  topActivity: ActivityCategory | null;
  avoidActivity: ActivityCategory | null;
  shortSummary: string;
  shortSummaryChinese: string;
}

/**
 * Get environmental summary for dashboard display
 */
export function getDashboardEnvironmentalSummary(
  snapshot: EnvironmentalSnapshot
): DashboardEnvironmentalSummary {
  return {
    environmentalScore: snapshot.environmentalScore,
    tier: snapshot.tier,
    qiMenFormation: snapshot.qiMen.formation,
    qiMenFormationChinese: snapshot.qiMen.formationChinese,
    dateOfficer: snapshot.dateSelection.officer,
    dateOfficerChinese: snapshot.dateSelection.officerChinese,
    bestDirection: snapshot.bestDirections[0] || null,
    avoidDirection: snapshot.avoidDirections[0] || null,
    topActivity: snapshot.bestActivities[0] || null,
    avoidActivity: snapshot.avoidActivities[0] || null,
    shortSummary: `${snapshot.tier} day. ${snapshot.qiMen.formationChinese}. Face ${snapshot.bestDirections[0] || 'any'}.`,
    shortSummaryChinese: `${getTierChinese(snapshot.tier)}。${snapshot.qiMen.formationChinese}。宜面${getDirectionChinese(snapshot.bestDirections[0])}。`
  };
}

/**
 * Get Chinese tier name
 */
function getTierChinese(tier: EnvironmentalTier): string {
  const labels: Record<EnvironmentalTier, string> = {
    excellent: '极佳',
    good: '良好',
    mixed: '普通',
    caution: '谨慎',
    challenging: '挑战'
  };
  return labels[tier] || tier;
}

/**
 * Get Chinese direction name
 */
function getDirectionChinese(dir?: CompassDirection | null): string {
  if (!dir) return '任意方向';
  const labels: Record<CompassDirection, string> = {
    N: '北', NE: '东北', E: '东', SE: '东南',
    S: '南', SW: '西南', W: '西', NW: '西北'
  };
  return labels[dir] || dir;
}

// ============================================================================
// DECISION ENGINE INTEGRATION
// ============================================================================

/**
 * Environmental factor for decision
 */
export interface EnvironmentalDecisionFactor {
  score: number;
  supports: boolean;
  bestDirection: CompassDirection | null;
  avoidDirection: CompassDirection | null;
  notes: string[];
  notesChinese: string[];
}

/**
 * Get environmental factors for decision engine
 */
export function getEnvironmentalDecisionFactor(
  snapshot: EnvironmentalSnapshot,
  decisionContext: 'commitment' | 'conversation' | 'action' | 'wait'
): EnvironmentalDecisionFactor {
  const supports = snapshot.environmentalScore >= 55;

  const notes: string[] = [];
  const notesChinese: string[] = [];

  if (snapshot.qiMen.formation === 'FuYin' || snapshot.qiMen.formation === 'FanYin') {
    notes.push('Qi Men indicates potential delays/reversals');
    notesChinese.push('奇门显示可能有延误或反复');
  }

  if (snapshot.dateSelection.officerNature === 'inauspicious') {
    notes.push(`${snapshot.dateSelection.officer} day - not ideal for major decisions`);
    notesChinese.push(`${snapshot.dateSelection.officerChinese}日 - 不宜重大决定`);
  }

  if (snapshot.dateSelection.officerNature === 'auspicious') {
    notes.push(`${snapshot.dateSelection.officer} day - favorable for ${decisionContext}`);
    notesChinese.push(`${snapshot.dateSelection.officerChinese}日 - 利于${decisionContext}`);
  }

  return {
    score: snapshot.environmentalScore,
    supports,
    bestDirection: snapshot.bestDirections[0] || null,
    avoidDirection: snapshot.avoidDirections[0] || null,
    notes,
    notesChinese
  };
}

