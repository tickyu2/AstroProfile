/**
 * =============================================================================
 * BAZI DESTINY TRAJECTORY CURVES ENGINE (运势曲线)
 * =============================================================================
 *
 * This module transforms all timing layers into living, flowing graphs that
 * show how life rises and falls across decades, revealing peaks, valleys,
 * and the rhythm of destiny.
 *
 * MATHEMATICAL MODEL:
 *   Composite Curve C(t) = LP(t) + AN(t) + MO(t) + DA(t) + EV(t)
 *
 *   Where:
 *     LP(t) = Luck Pillar Wave (10-year cycle) - slow, foundational
 *     AN(t) = Annual Wave (1-year cycle) - yearly rhythm
 *     MO(t) = Monthly Wave (1/12-year cycle) - monthly modulation
 *     DA(t) = Daily Wave (1/365-year cycle) - fine texture
 *     EV(t) = Event Trigger Spikes - Gaussian peaks for major events
 *
 * FIVE DOMAIN CURVES:
 *   1. Overall Destiny (总运势)
 *   2. Wealth (财运)
 *   3. Career (事业)
 *   4. Relationship (感情)
 *   5. Health (健康)
 *
 * FEATURES:
 *   - Smooth Catmull-Rom spline interpolation
 *   - Peak and valley detection
 *   - Phase alignment analysis
 *   - Multi-curve synchronization detection
 *   - UI-ready data structures for Nivo/ECharts
 *
 * Author: Brother Opus & Ticky
 * Version: 1.0.0
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type DomainType = 'overall' | 'wealth' | 'career' | 'relationship' | 'health';

export interface TrajectoryPoint {
  t: number;           // Time (age or year fraction)
  score: number;       // Normalized score (0-100)
  rawScore: number;    // Raw composite score before normalization
}

export interface TimingLayerData {
  scores: number[];    // Array of scores for this layer
  period: number;      // Period length (10 for luck pillar, 1 for annual, etc.)
  weight: number;      // Weight in composite calculation
  phase: number;       // Phase offset
}

export interface EventSpike {
  t: number;           // Time of event
  amplitude: number;   // Intensity (can be positive or negative)
  sigma: number;       // Width of Gaussian spread
  label?: string;      // Optional description
}

export interface PeakValley {
  type: 'peak' | 'valley';
  t: number;
  score: number;
  significance: 'major' | 'moderate' | 'minor';
  description: string;
}

export interface TrajectorySegment {
  startAge: number;
  endAge: number;
  trend: 'rising' | 'falling' | 'stable';
  averageScore: number;
  dominantInfluence: string;
}

export interface TrajectoryCurve {
  domain: DomainType;
  domainChinese: string;
  points: TrajectoryPoint[];
  peaks: PeakValley[];
  valleys: PeakValley[];
  segments: TrajectorySegment[];
  overallTrend: 'ascending' | 'descending' | 'cyclical' | 'stable';
  averageScore: number;
  highestPoint: TrajectoryPoint;
  lowestPoint: TrajectoryPoint;
}

export interface MultiDomainTrajectory {
  overall: TrajectoryCurve;
  wealth: TrajectoryCurve;
  career: TrajectoryCurve;
  relationship: TrajectoryCurve;
  health: TrajectoryCurve;
  synchronizations: SynchronizationEvent[];
  lifeSummary: LifeSummary;
}

export interface SynchronizationEvent {
  age: number;
  domains: DomainType[];
  type: 'convergence' | 'divergence';
  description: string;
}

export interface LifeSummary {
  goldenPeriods: Array<{ startAge: number; endAge: number; description: string }>;
  challengingPeriods: Array<{ startAge: number; endAge: number; description: string }>;
  majorTransitions: Array<{ age: number; description: string }>;
  lifeTheme: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const DOMAIN_CONFIG: Record<DomainType, { chinese: string; color: string }> = {
  overall: { chinese: '总运势', color: '#6366f1' },    // Indigo
  wealth: { chinese: '财运', color: '#22c55e' },       // Green
  career: { chinese: '事业', color: '#3b82f6' },       // Blue
  relationship: { chinese: '感情', color: '#ec4899' }, // Pink
  health: { chinese: '健康', color: '#f59e0b' }        // Amber
};

export const DEFAULT_LAYER_WEIGHTS: Record<string, number> = {
  luckPillar: 0.30,
  annual: 0.30,
  monthly: 0.25,
  daily: 0.15
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERPOLATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Linear interpolation between two values
 * (Available for future use in trajectory smoothing)
 */
function _lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Catmull-Rom spline interpolation for smooth curves
 */
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;

  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Smooth interpolation through an array of scores
 */
export function smoothInterpolate(
  scores: number[],
  t: number,
  period: number
): number {
  if (scores.length === 0) return 50;
  if (scores.length === 1) return scores[0];

  const scaledT = t / period;
  const index = Math.floor(scaledT);
  const frac = scaledT - index;

  // Get four points for Catmull-Rom (with boundary handling)
  const p0 = scores[Math.max(0, index - 1)] ?? scores[0];
  const p1 = scores[index] ?? scores[scores.length - 1];
  const p2 = scores[Math.min(scores.length - 1, index + 1)] ?? scores[scores.length - 1];
  const p3 = scores[Math.min(scores.length - 1, index + 2)] ?? scores[scores.length - 1];

  return catmullRom(p0, p1, p2, p3, frac);
}

/**
 * Simple step interpolation (for coarse data)
 */
export function stepInterpolate(
  scores: number[],
  t: number,
  period: number
): number {
  if (scores.length === 0) return 50;

  const index = Math.floor(t / period);
  const clampedIndex = Math.max(0, Math.min(scores.length - 1, index));
  return scores[clampedIndex];
}

// ─────────────────────────────────────────────────────────────────────────────
// WAVE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a sine wave component
 */
export function sineWave(
  t: number,
  amplitude: number,
  period: number,
  phase: number = 0
): number {
  return amplitude * Math.sin((2 * Math.PI / period) * (t - phase));
}

/**
 * Gaussian spike function for event triggers
 */
export function gaussianSpike(
  t: number,
  center: number,
  amplitude: number,
  sigma: number = 0.5
): number {
  const exponent = -Math.pow(t - center, 2) / (2 * sigma * sigma);
  return amplitude * Math.exp(exponent);
}

/**
 * Compute all event spikes at a given time
 */
export function computeEventSpikes(
  t: number,
  spikes: EventSpike[]
): number {
  let total = 0;
  for (const spike of spikes) {
    total += gaussianSpike(t, spike.t, spike.amplitude, spike.sigma);
  }
  return total;
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE TRAJECTORY COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

export interface TrajectoryInput {
  luckPillarScores: number[];    // 10-year cycle scores
  annualScores: number[];         // Yearly scores
  monthlyScores?: number[];       // Monthly scores (optional, for fine detail)
  eventSpikes?: EventSpike[];     // Major event triggers
  startAge: number;
  endAge: number;
  resolution?: number;            // Points per year (default: 12)
  weights?: Record<string, number>;
}

/**
 * Compute a single domain trajectory curve
 */
export function computeTrajectoryCurve(
  input: TrajectoryInput,
  domain: DomainType = 'overall'
): TrajectoryCurve {
  const {
    luckPillarScores,
    annualScores,
    monthlyScores = [],
    eventSpikes = [],
    startAge,
    endAge,
    resolution = 12,
    weights = DEFAULT_LAYER_WEIGHTS
  } = input;

  const points: TrajectoryPoint[] = [];
  const step = 1 / resolution;

  // Compute all points
  for (let age = startAge; age <= endAge; age += step) {
    // Luck Pillar component (10-year cycles)
    const lpScore = smoothInterpolate(luckPillarScores, age, 10);

    // Annual component
    const annualIndex = Math.floor(age);
    const anScore = annualScores[annualIndex - startAge] ?? 50;

    // Monthly component (if available)
    let moScore = 50;
    if (monthlyScores.length > 0) {
      const monthIndex = Math.floor(age * 12);
      moScore = monthlyScores[monthIndex] ?? 50;
    }

    // Event spikes
    const evScore = computeEventSpikes(age, eventSpikes);

    // Composite score with weights
    const rawScore =
      lpScore * weights.luckPillar +
      anScore * weights.annual +
      moScore * weights.monthly +
      evScore; // Event spikes are additive bonuses/penalties

    // Normalize to 0-100
    const score = Math.max(0, Math.min(100, rawScore));

    points.push({
      t: Math.round(age * 100) / 100, // Round to 2 decimal places
      score: Math.round(score * 10) / 10,
      rawScore: Math.round(rawScore * 10) / 10
    });
  }

  // Detect peaks and valleys
  const { peaks, valleys } = detectPeaksAndValleys(points);

  // Analyze segments
  const segments = analyzeSegments(points, peaks, valleys);

  // Calculate statistics
  const allScores = points.map(p => p.score);
  const averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

  const highestPoint = points.reduce((max, p) => p.score > max.score ? p : max, points[0]);
  const lowestPoint = points.reduce((min, p) => p.score < min.score ? p : min, points[0]);

  // Determine overall trend
  const overallTrend = determineOverallTrend(points, peaks, valleys);

  return {
    domain,
    domainChinese: DOMAIN_CONFIG[domain].chinese,
    points,
    peaks,
    valleys,
    segments,
    overallTrend,
    averageScore: Math.round(averageScore * 10) / 10,
    highestPoint,
    lowestPoint
  };
}

/**
 * Detect peaks and valleys in the trajectory
 */
function detectPeaksAndValleys(
  points: TrajectoryPoint[],
  minProminence: number = 5
): { peaks: PeakValley[]; valleys: PeakValley[] } {
  const peaks: PeakValley[] = [];
  const valleys: PeakValley[] = [];

  if (points.length < 3) return { peaks, valleys };

  // Use a sliding window to find local extrema
  const windowSize = 12; // 1 year of data at resolution 12

  for (let i = windowSize; i < points.length - windowSize; i++) {
    const current = points[i].score;
    const windowLeft = points.slice(i - windowSize, i);
    const windowRight = points.slice(i + 1, i + windowSize + 1);

    const maxLeft = Math.max(...windowLeft.map(p => p.score));
    const maxRight = Math.max(...windowRight.map(p => p.score));
    const minLeft = Math.min(...windowLeft.map(p => p.score));
    const minRight = Math.min(...windowRight.map(p => p.score));

    // Peak detection
    if (current > maxLeft && current > maxRight) {
      const prominence = current - Math.max(minLeft, minRight);
      if (prominence >= minProminence) {
        peaks.push({
          type: 'peak',
          t: points[i].t,
          score: current,
          significance: prominence >= 20 ? 'major' : prominence >= 10 ? 'moderate' : 'minor',
          description: `Peak at age ${Math.round(points[i].t)} (score: ${current.toFixed(1)})`
        });
      }
    }

    // Valley detection
    if (current < minLeft && current < minRight) {
      const prominence = Math.min(maxLeft, maxRight) - current;
      if (prominence >= minProminence) {
        valleys.push({
          type: 'valley',
          t: points[i].t,
          score: current,
          significance: prominence >= 20 ? 'major' : prominence >= 10 ? 'moderate' : 'minor',
          description: `Valley at age ${Math.round(points[i].t)} (score: ${current.toFixed(1)})`
        });
      }
    }
  }

  // Filter to keep only significant peaks/valleys (avoid clustering)
  const filteredPeaks = filterClusteredExtrema(peaks, 3);
  const filteredValleys = filterClusteredExtrema(valleys, 3);

  return { peaks: filteredPeaks, valleys: filteredValleys };
}

/**
 * Filter clustered extrema to keep only the most significant
 */
function filterClusteredExtrema(extrema: PeakValley[], minDistance: number): PeakValley[] {
  if (extrema.length <= 1) return extrema;

  const sorted = [...extrema].sort((a, b) => {
    const sigOrder = { major: 3, moderate: 2, minor: 1 };
    return sigOrder[b.significance] - sigOrder[a.significance];
  });

  const filtered: PeakValley[] = [];

  for (const ext of sorted) {
    const tooClose = filtered.some(f => Math.abs(f.t - ext.t) < minDistance);
    if (!tooClose) {
      filtered.push(ext);
    }
  }

  return filtered.sort((a, b) => a.t - b.t);
}

/**
 * Analyze trajectory segments
 */
function analyzeSegments(
  points: TrajectoryPoint[],
  peaks: PeakValley[],
  valleys: PeakValley[]
): TrajectorySegment[] {
  const segments: TrajectorySegment[] = [];

  // Combine and sort all extrema
  const allExtrema = [...peaks, ...valleys].sort((a, b) => a.t - b.t);

  if (allExtrema.length === 0) {
    // Single segment for entire range
    const avgScore = points.reduce((sum, p) => sum + p.score, 0) / points.length;
    segments.push({
      startAge: points[0].t,
      endAge: points[points.length - 1].t,
      trend: 'stable',
      averageScore: avgScore,
      dominantInfluence: 'steady'
    });
    return segments;
  }

  // Create segments between extrema
  let prevT = points[0].t;
  let prevScore = points[0].score;

  for (const ext of allExtrema) {
    const segmentPoints = points.filter(p => p.t >= prevT && p.t <= ext.t);
    if (segmentPoints.length > 0) {
      const avgScore = segmentPoints.reduce((sum, p) => sum + p.score, 0) / segmentPoints.length;
      const scoreDiff = ext.score - prevScore;

      segments.push({
        startAge: Math.round(prevT),
        endAge: Math.round(ext.t),
        trend: scoreDiff > 5 ? 'rising' : scoreDiff < -5 ? 'falling' : 'stable',
        averageScore: Math.round(avgScore * 10) / 10,
        dominantInfluence: ext.type === 'peak' ? 'ascending momentum' : 'recalibration'
      });
    }

    prevT = ext.t;
    prevScore = ext.score;
  }

  // Final segment to end
  const finalPoints = points.filter(p => p.t >= prevT);
  if (finalPoints.length > 0) {
    const avgScore = finalPoints.reduce((sum, p) => sum + p.score, 0) / finalPoints.length;
    const scoreDiff = finalPoints[finalPoints.length - 1].score - prevScore;

    segments.push({
      startAge: Math.round(prevT),
      endAge: Math.round(finalPoints[finalPoints.length - 1].t),
      trend: scoreDiff > 5 ? 'rising' : scoreDiff < -5 ? 'falling' : 'stable',
      averageScore: Math.round(avgScore * 10) / 10,
      dominantInfluence: 'late-life phase'
    });
  }

  return segments;
}

/**
 * Determine overall trajectory trend
 */
function determineOverallTrend(
  points: TrajectoryPoint[],
  peaks: PeakValley[],
  valleys: PeakValley[]
): 'ascending' | 'descending' | 'cyclical' | 'stable' {
  if (points.length < 10) return 'stable';

  const firstQuarter = points.slice(0, Math.floor(points.length / 4));
  const lastQuarter = points.slice(Math.floor(points.length * 3 / 4));

  const firstAvg = firstQuarter.reduce((sum, p) => sum + p.score, 0) / firstQuarter.length;
  const lastAvg = lastQuarter.reduce((sum, p) => sum + p.score, 0) / lastQuarter.length;

  const diff = lastAvg - firstAvg;

  if (peaks.length + valleys.length >= 4) {
    return 'cyclical';
  } else if (diff > 10) {
    return 'ascending';
  } else if (diff < -10) {
    return 'descending';
  } else {
    return 'stable';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-DOMAIN TRAJECTORY
// ─────────────────────────────────────────────────────────────────────────────

export interface MultiDomainInput {
  overall: TrajectoryInput;
  wealth: TrajectoryInput;
  career: TrajectoryInput;
  relationship: TrajectoryInput;
  health: TrajectoryInput;
}

/**
 * Compute trajectories for all life domains
 */
export function computeMultiDomainTrajectory(
  input: MultiDomainInput
): MultiDomainTrajectory {
  const overall = computeTrajectoryCurve(input.overall, 'overall');
  const wealth = computeTrajectoryCurve(input.wealth, 'wealth');
  const career = computeTrajectoryCurve(input.career, 'career');
  const relationship = computeTrajectoryCurve(input.relationship, 'relationship');
  const health = computeTrajectoryCurve(input.health, 'health');

  // Detect synchronization events
  const synchronizations = detectSynchronizations(
    overall, wealth, career, relationship, health
  );

  // Generate life summary
  const lifeSummary = generateLifeSummary(
    overall, wealth, career, relationship, health
  );

  return {
    overall,
    wealth,
    career,
    relationship,
    health,
    synchronizations,
    lifeSummary
  };
}

/**
 * Detect when multiple domains converge or diverge
 */
function detectSynchronizations(
  overall: TrajectoryCurve,
  wealth: TrajectoryCurve,
  career: TrajectoryCurve,
  relationship: TrajectoryCurve,
  health: TrajectoryCurve
): SynchronizationEvent[] {
  const events: SynchronizationEvent[] = [];
  const curves = [wealth, career, relationship, health];

  // Sample at yearly intervals
  const startAge = overall.points[0]?.t ?? 0;
  const endAge = overall.points[overall.points.length - 1]?.t ?? 100;

  for (let age = startAge; age <= endAge; age++) {
    const scores = curves.map(c => {
      const point = c.points.find(p => Math.abs(p.t - age) < 0.5);
      return point?.score ?? 50;
    });

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Convergence: all domains score similarly
    if (stdDev < 5 && avg > 65) {
      const existingEvent = events.find(e => Math.abs(e.age - age) < 2);
      if (!existingEvent) {
        events.push({
          age,
          domains: ['wealth', 'career', 'relationship', 'health'],
          type: 'convergence',
          description: `All life domains align favorably around age ${age}`
        });
      }
    }

    // Divergence: domains pull in different directions
    if (stdDev > 20) {
      const highDomains: DomainType[] = [];
      const lowDomains: DomainType[] = [];

      ['wealth', 'career', 'relationship', 'health'].forEach((domain, i) => {
        if (scores[i] > avg + 10) highDomains.push(domain as DomainType);
        if (scores[i] < avg - 10) lowDomains.push(domain as DomainType);
      });

      if (highDomains.length > 0 && lowDomains.length > 0) {
        const existingEvent = events.find(e => Math.abs(e.age - age) < 2);
        if (!existingEvent) {
          events.push({
            age,
            domains: [...highDomains, ...lowDomains],
            type: 'divergence',
            description: `${highDomains.join(', ')} strong while ${lowDomains.join(', ')} need attention around age ${age}`
          });
        }
      }
    }
  }

  return events;
}

/**
 * Generate comprehensive life summary
 */
function generateLifeSummary(
  overall: TrajectoryCurve,
  wealth: TrajectoryCurve,
  career: TrajectoryCurve,
  _relationship: TrajectoryCurve,
  _health: TrajectoryCurve
): LifeSummary {
  const goldenPeriods: Array<{ startAge: number; endAge: number; description: string }> = [];
  const challengingPeriods: Array<{ startAge: number; endAge: number; description: string }> = [];
  const majorTransitions: Array<{ age: number; description: string }> = [];

  // Find golden periods (overall score > 70 for extended time)
  let goldenStart: number | null = null;
  for (let i = 0; i < overall.points.length; i++) {
    const point = overall.points[i];
    if (point.score >= 70 && goldenStart === null) {
      goldenStart = point.t;
    } else if (point.score < 70 && goldenStart !== null) {
      if (point.t - goldenStart >= 2) { // At least 2 years
        goldenPeriods.push({
          startAge: Math.round(goldenStart),
          endAge: Math.round(point.t),
          description: `High potential period with sustained favorable energy`
        });
      }
      goldenStart = null;
    }
  }

  // Find challenging periods (overall score < 40 for extended time)
  let challengeStart: number | null = null;
  for (let i = 0; i < overall.points.length; i++) {
    const point = overall.points[i];
    if (point.score < 40 && challengeStart === null) {
      challengeStart = point.t;
    } else if (point.score >= 40 && challengeStart !== null) {
      if (point.t - challengeStart >= 1) { // At least 1 year
        challengingPeriods.push({
          startAge: Math.round(challengeStart),
          endAge: Math.round(point.t),
          description: `Recalibration period requiring patience and adaptation`
        });
      }
      challengeStart = null;
    }
  }

  // Major transitions from peaks and valleys
  const allMajorExtrema = [
    ...overall.peaks.filter(p => p.significance === 'major'),
    ...overall.valleys.filter(v => v.significance === 'major')
  ].sort((a, b) => a.t - b.t);

  for (const ext of allMajorExtrema) {
    majorTransitions.push({
      age: Math.round(ext.t),
      description: ext.type === 'peak'
        ? `Major breakthrough and activation point`
        : `Significant transition and restructuring phase`
    });
  }

  // Determine life theme
  let lifeTheme: string;
  const trends = [
    overall.overallTrend,
    wealth.overallTrend,
    career.overallTrend
  ];

  if (trends.filter(t => t === 'ascending').length >= 2) {
    lifeTheme = 'Rising trajectory with continuous growth and expansion';
  } else if (trends.filter(t => t === 'cyclical').length >= 2) {
    lifeTheme = 'Cyclical rhythm with multiple peaks and renewal phases';
  } else if (trends.filter(t => t === 'descending').length >= 2) {
    lifeTheme = 'Early bloom pattern with gradual transition to stability';
  } else {
    lifeTheme = 'Balanced journey with steady evolution across life domains';
  }

  return {
    goldenPeriods,
    challengingPeriods,
    majorTransitions,
    lifeTheme
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI-READY DATA FORMATTERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format trajectory for Nivo Line chart
 */
export function formatForNivoLine(curves: TrajectoryCurve[]): Array<{
  id: string;
  color: string;
  data: Array<{ x: number; y: number }>;
}> {
  return curves.map(curve => ({
    id: curve.domainChinese,
    color: DOMAIN_CONFIG[curve.domain].color,
    data: curve.points.map(p => ({
      x: p.t,
      y: p.score
    }))
  }));
}

/**
 * Format trajectory for ECharts
 */
export function formatForECharts(curves: TrajectoryCurve[]): {
  xAxis: { type: string; data: number[] };
  yAxis: { type: string; min: number; max: number };
  series: Array<{
    name: string;
    type: string;
    smooth: boolean;
    data: number[];
    itemStyle: { color: string };
  }>;
  legend: { data: string[] };
} {
  const xData = curves[0]?.points.map(p => Math.round(p.t)) ?? [];
  const uniqueX = Array.from(new Set(xData));

  return {
    xAxis: { type: 'category', data: uniqueX },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: curves.map(curve => ({
      name: curve.domainChinese,
      type: 'line',
      smooth: true,
      data: uniqueX.map(x => {
        const point = curve.points.find(p => Math.round(p.t) === x);
        return point?.score ?? 50;
      }),
      itemStyle: { color: DOMAIN_CONFIG[curve.domain].color }
    })),
    legend: { data: curves.map(c => c.domainChinese) }
  };
}

/**
 * Format peak/valley annotations for charts
 */
export function formatAnnotations(curve: TrajectoryCurve): Array<{
  type: 'peak' | 'valley';
  x: number;
  y: number;
  label: string;
  significance: string;
}> {
  const annotations = [];

  for (const peak of curve.peaks) {
    annotations.push({
      type: 'peak' as const,
      x: peak.t,
      y: peak.score,
      label: `Peak (${Math.round(peak.t)})`,
      significance: peak.significance
    });
  }

  for (const valley of curve.valleys) {
    annotations.push({
      type: 'valley' as const,
      x: valley.t,
      y: valley.score,
      label: `Valley (${Math.round(valley.t)})`,
      significance: valley.significance
    });
  }

  return annotations;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY MODE FORMATTERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate story mode narrative for a trajectory curve
 */
export function formatTrajectoryStory(curve: TrajectoryCurve): string {
  const lines: string[] = [];

  lines.push(`### ${curve.domainChinese} Trajectory (${curve.domain})`);
  lines.push('');
  lines.push(`**Overall Trend:** ${curve.overallTrend}`);
  lines.push(`**Average Score:** ${curve.averageScore}`);
  lines.push(`**Highest Point:** Age ${Math.round(curve.highestPoint.t)} (${curve.highestPoint.score})`);
  lines.push(`**Lowest Point:** Age ${Math.round(curve.lowestPoint.t)} (${curve.lowestPoint.score})`);
  lines.push('');

  // Peaks
  if (curve.peaks.length > 0) {
    lines.push('**Major Peaks:**');
    for (const peak of curve.peaks.filter(p => p.significance !== 'minor').slice(0, 3)) {
      lines.push(`- Age ${Math.round(peak.t)}: ${peak.score.toFixed(1)} (${peak.significance})`);
    }
    lines.push('');
  }

  // Valleys
  if (curve.valleys.length > 0) {
    lines.push('**Notable Valleys:**');
    for (const valley of curve.valleys.filter(v => v.significance !== 'minor').slice(0, 3)) {
      lines.push(`- Age ${Math.round(valley.t)}: ${valley.score.toFixed(1)} (${valley.significance})`);
    }
    lines.push('');
  }

  // Segments
  lines.push('**Life Phases:**');
  for (const segment of curve.segments.slice(0, 5)) {
    lines.push(`- Ages ${segment.startAge}-${segment.endAge}: ${segment.trend} (avg: ${segment.averageScore})`);
  }

  return lines.join('\n');
}

/**
 * Generate comprehensive multi-domain story
 */
export function formatMultiDomainStory(trajectory: MultiDomainTrajectory): string {
  const lines: string[] = [];

  lines.push('# 运势曲线 Destiny Trajectory Analysis');
  lines.push('');

  // Life Summary
  lines.push('## Life Theme');
  lines.push(trajectory.lifeSummary.lifeTheme);
  lines.push('');

  // Golden Periods
  if (trajectory.lifeSummary.goldenPeriods.length > 0) {
    lines.push('## Golden Periods (高峰期)');
    for (const period of trajectory.lifeSummary.goldenPeriods) {
      lines.push(`- **Ages ${period.startAge}-${period.endAge}:** ${period.description}`);
    }
    lines.push('');
  }

  // Challenging Periods
  if (trajectory.lifeSummary.challengingPeriods.length > 0) {
    lines.push('## Challenging Periods (调整期)');
    for (const period of trajectory.lifeSummary.challengingPeriods) {
      lines.push(`- **Ages ${period.startAge}-${period.endAge}:** ${period.description}`);
    }
    lines.push('');
  }

  // Major Transitions
  if (trajectory.lifeSummary.majorTransitions.length > 0) {
    lines.push('## Major Life Transitions');
    for (const transition of trajectory.lifeSummary.majorTransitions) {
      lines.push(`- **Age ${transition.age}:** ${transition.description}`);
    }
    lines.push('');
  }

  // Synchronizations
  if (trajectory.synchronizations.length > 0) {
    lines.push('## Domain Synchronizations');
    for (const sync of trajectory.synchronizations.slice(0, 5)) {
      lines.push(`- **Age ${sync.age} (${sync.type}):** ${sync.description}`);
    }
    lines.push('');
  }

  // Quick comparison table
  lines.push('## Domain Comparison');
  lines.push('| Domain | Trend | Avg Score | Highest | Lowest |');
  lines.push('|--------|-------|-----------|---------|--------|');

  const domains: TrajectoryCurve[] = [
    trajectory.overall,
    trajectory.wealth,
    trajectory.career,
    trajectory.relationship,
    trajectory.health
  ];

  for (const d of domains) {
    lines.push(`| ${d.domainChinese} | ${d.overallTrend} | ${d.averageScore} | ${Math.round(d.highestPoint.t)} | ${Math.round(d.lowestPoint.t)} |`);
  }
  lines.push('');

  // Detailed domain sections
  lines.push('---');
  lines.push(formatTrajectoryStory(trajectory.overall));
  lines.push('');
  lines.push('---');
  lines.push(formatTrajectoryStory(trajectory.wealth));
  lines.push('');
  lines.push('---');
  lines.push(formatTrajectoryStory(trajectory.career));
  lines.push('');
  lines.push('---');
  lines.push(formatTrajectoryStory(trajectory.relationship));
  lines.push('');
  lines.push('---');
  lines.push(formatTrajectoryStory(trajectory.health));

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: GENERATE SAMPLE DATA FROM SCORES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quick trajectory generation from simple score arrays
 */
export function quickTrajectory(
  luckPillarScores: number[],
  annualScores: number[],
  domain: DomainType = 'overall'
): TrajectoryCurve {
  return computeTrajectoryCurve({
    luckPillarScores,
    annualScores,
    startAge: 0,
    endAge: luckPillarScores.length * 10,
    resolution: 4 // 4 points per year for quick view
  }, domain);
}

/**
 * Generate trajectory with event highlights
 */
export function trajectoryWithEvents(
  luckPillarScores: number[],
  annualScores: number[],
  events: Array<{ age: number; intensity: number; label?: string }>,
  domain: DomainType = 'overall'
): TrajectoryCurve {
  return computeTrajectoryCurve({
    luckPillarScores,
    annualScores,
    eventSpikes: events.map(e => ({
      t: e.age,
      amplitude: e.intensity,
      sigma: 0.8,
      label: e.label
    })),
    startAge: 0,
    endAge: Math.max(luckPillarScores.length * 10, 100),
    resolution: 12
  }, domain);
}
