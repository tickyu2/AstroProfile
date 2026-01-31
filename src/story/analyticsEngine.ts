/**
 * Cathedral Analytics Engine (大教堂分析引擎)
 *
 * The observatory tower of the cathedral — the intelligence layer that
 * reads all flows, stories, timing cycles, rituals, simulations, and
 * relationships to produce insight.
 *
 * This is where the architecture becomes self-interpreting.
 */

import type {
  TimingLayerType,
  TimingVolatility,
  TimingResonance,
  TimingRiskWindow,
  TimingRiskFactor,
  TimingOpportunityCluster,
  TimingOpportunityFactor,
  TimingStoryAlignment,
  TimingIntelligenceReport,
  TimingInsight,
  TimingForecast,
  StoryArcStability,
  EmotionalArcPredictability,
  TurningPointAnalysis,
  TurningPoint,
  TurningPointPattern,
  ArchetypeDominance,
  ArchetypeScore,
  NarrativeCoherence,
  NarrativeGap,
  StoryIntelligenceReport,
  CrossStoryResonance,
  StoryInsight,
  RelationshipStabilityIndex,
  RelationshipRiskFactor,
  ResonanceScoreAnalysis,
  ResonanceDimension,
  ConflictSignature,
  ConflictTrigger,
  HealingSignature,
  HealingPattern,
  CommitmentReadiness,
  RelationshipIntelligenceReport,
  LifecyclePosition,
  RitualWindowAnalysis,
  RelationshipInsight,
  SystemType,
  SystemicTensionMap,
  SystemicTension,
  TensionHotspot,
  TensionReliefPoint,
  GenerationalEchoAnalysis,
  GenerationalEcho,
  TeamSynergyCycle,
  RoleDistribution,
  PolyculeEmotionalFlowMap,
  EmotionalFlowNode,
  EmotionalFlowEdge,
  EmotionalBlockage,
  FamilyKarmicLoop,
  KarmicManifestation,
  SystemicIntelligenceReport,
  SystemicTurningPoint,
  SystemicInsight,
  PatternType,
  DetectedPattern,
  PatternOccurrence,
  PatternCluster,
  PatternForecast,
  PatternAnomaly,
  PatternEvolution,
  PatternMutation,
  PatternStoryAlignment,
  PatternTimingAlignment,
  PatternIntelligenceReport,
  PatternInsight,
  MetricType,
  AnalyticsMetric,
  AnalyticsInsight,
  AnalyticsForecast,
  ForecastPrediction,
  AnalyticsRecommendation,
  ObservatoryPanel,
  InsightStreamEntry,
  PatternMapNode,
  TimingHeatmapCell,
  ObservatoryState,
  ObservatoryFilters,
  AnalyticsPipelineConfig,
  AnalyticsEngineState,
} from './analyticsTypes';

import {
  DEFAULT_ANALYTICS_PIPELINE_CONFIG,
  DEFAULT_OBSERVATORY_FILTERS,
} from './analyticsTypes';

// ============================================================================
// INTERNAL STATE
// ============================================================================

// Reports storage
let timingReport: TimingIntelligenceReport | undefined;
let storyReport: StoryIntelligenceReport | undefined;
const relationshipReports: Map<string, RelationshipIntelligenceReport> = new Map();
const systemicReports: Map<string, SystemicIntelligenceReport> = new Map();
let patternReport: PatternIntelligenceReport | undefined;

// Pattern detection
const detectedPatterns: Map<string, DetectedPattern> = new Map();
const patternClusters: PatternCluster[] = [];

// Insights
const insightStream: InsightStreamEntry[] = [];
const allInsights: AnalyticsInsight[] = [];
const allForecasts: AnalyticsForecast[] = [];
const allRecommendations: AnalyticsRecommendation[] = [];

// Observatory state
let observatoryState: ObservatoryState | null = null;

// Engine state
let engineState: AnalyticsEngineState | null = null;
let pipelineConfig: AnalyticsPipelineConfig = { ...DEFAULT_ANALYTICS_PIPELINE_CONFIG };
let refreshInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;
let totalInsightsGenerated = 0;
let totalPatternsDetected = 0;
let lastRefresh: Date = new Date();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current timestamp
 */
function now(): Date {
  return new Date();
}

/**
 * Calculate standard deviation
 */
function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(v => Math.pow(v - mean, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * Normalize value to 0-1 range
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// ============================================================================
// 🜁 1. TIMING INTELLIGENCE (时序智能)
// ============================================================================

/**
 * Analyze timing volatility for a layer
 */
export function analyzeTimingVolatility(
  layer: TimingLayerType,
  scores: { date: Date; score: number }[],
  period: { start: Date; end: Date }
): TimingVolatility {
  if (scores.length === 0) {
    return {
      layer,
      period,
      volatilityScore: 0,
      swingAmplitude: 0,
      swingFrequency: 0,
      peakMoments: [],
      troughMoments: [],
      stability: 'stable',
    };
  }

  const values = scores.map(s => s.score);
  const volatilityScore = normalize(standardDeviation(values), 0, 50);

  // Find peaks and troughs
  const peakMoments: Date[] = [];
  const troughMoments: Date[] = [];

  for (let i = 1; i < scores.length - 1; i++) {
    if (scores[i].score > scores[i - 1].score && scores[i].score > scores[i + 1].score) {
      peakMoments.push(scores[i].date);
    }
    if (scores[i].score < scores[i - 1].score && scores[i].score < scores[i + 1].score) {
      troughMoments.push(scores[i].date);
    }
  }

  const swingAmplitude = Math.max(...values) - Math.min(...values);
  const swingFrequency = peakMoments.length + troughMoments.length;

  let stability: 'stable' | 'moderate' | 'volatile' | 'chaotic';
  if (volatilityScore < 0.2) stability = 'stable';
  else if (volatilityScore < 0.4) stability = 'moderate';
  else if (volatilityScore < 0.7) stability = 'volatile';
  else stability = 'chaotic';

  return {
    layer,
    period,
    volatilityScore,
    swingAmplitude,
    swingFrequency,
    peakMoments,
    troughMoments,
    stability,
  };
}

/**
 * Analyze timing resonance between two layers
 */
export function analyzeTimingResonance(
  layer1: TimingLayerType,
  layer2: TimingLayerType,
  scores1: { date: Date; score: number }[],
  scores2: { date: Date; score: number }[]
): TimingResonance {
  const harmonicPoints: Date[] = [];
  const dissonantPoints: Date[] = [];

  // Compare scores at matching timestamps
  for (const s1 of scores1) {
    const s2 = scores2.find(s => s.date.getTime() === s1.date.getTime());
    if (s2) {
      const diff = Math.abs(s1.score - s2.score);
      if (diff < 10) {
        harmonicPoints.push(s1.date);
      } else if (diff > 30) {
        dissonantPoints.push(s1.date);
      }
    }
  }

  const total = harmonicPoints.length + dissonantPoints.length;
  const resonanceScore = total > 0 ? harmonicPoints.length / total : 0.5;

  // Determine dominant layer
  const avg1 = scores1.reduce((a, b) => a + b.score, 0) / scores1.length || 0;
  const avg2 = scores2.reduce((a, b) => a + b.score, 0) / scores2.length || 0;
  const dominantLayer = avg1 > avg2 ? layer1 : layer2;

  return {
    layer1,
    layer2,
    resonanceScore,
    harmonicPoints,
    dissonantPoints,
    dominantLayer,
    resonancePattern: resonanceScore > 0.7 ? 'Strong alignment' :
                      resonanceScore > 0.4 ? 'Moderate alignment' :
                      'Weak alignment',
  };
}

/**
 * Detect timing risk windows
 */
export function detectTimingRiskWindows(
  timingData: { date: Date; score: number; factors: string[] }[]
): TimingRiskWindow[] {
  const riskWindows: TimingRiskWindow[] = [];
  let currentWindow: TimingRiskWindow | null = null;

  for (const data of timingData) {
    const isRisky = data.score < 40;

    if (isRisky) {
      if (!currentWindow) {
        currentWindow = {
          id: generateId(),
          start: data.date,
          end: data.date,
          riskLevel: 'low',
          riskFactors: [],
          affectedDomains: [],
          mitigationSuggestions: [],
        };
      }
      currentWindow.end = data.date;

      // Add risk factors
      for (const factor of data.factors) {
        if (!currentWindow.riskFactors.find(f => f.source === factor)) {
          currentWindow.riskFactors.push({
            type: 'weakness',
            source: factor,
            target: 'general',
            severity: normalize(40 - data.score, 0, 40),
            description: `Weakness in ${factor}`,
          });
        }
      }
    } else if (currentWindow) {
      // Determine risk level
      const avgSeverity = currentWindow.riskFactors.reduce((a, b) => a + b.severity, 0) /
                          (currentWindow.riskFactors.length || 1);
      currentWindow.riskLevel = avgSeverity > 0.7 ? 'critical' :
                                avgSeverity > 0.5 ? 'high' :
                                avgSeverity > 0.3 ? 'moderate' : 'low';

      riskWindows.push(currentWindow);
      currentWindow = null;
    }
  }

  if (currentWindow) {
    const avgSeverity = currentWindow.riskFactors.reduce((a, b) => a + b.severity, 0) /
                        (currentWindow.riskFactors.length || 1);
    currentWindow.riskLevel = avgSeverity > 0.7 ? 'critical' :
                              avgSeverity > 0.5 ? 'high' :
                              avgSeverity > 0.3 ? 'moderate' : 'low';
    riskWindows.push(currentWindow);
  }

  return riskWindows;
}

/**
 * Detect timing opportunity clusters
 */
export function detectTimingOpportunityClusters(
  timingData: { date: Date; score: number; factors: string[] }[]
): TimingOpportunityCluster[] {
  const clusters: TimingOpportunityCluster[] = [];
  let currentCluster: TimingOpportunityCluster | null = null;

  for (const data of timingData) {
    const isOpportunity = data.score > 70;

    if (isOpportunity) {
      if (!currentCluster) {
        currentCluster = {
          id: generateId(),
          start: data.date,
          end: data.date,
          opportunityLevel: 'minor',
          opportunityFactors: [],
          optimalDomains: [],
          peakMoment: data.date,
          confidence: 0.7,
        };
      }
      currentCluster.end = data.date;

      // Track peak
      if (data.score > 80) {
        currentCluster.peakMoment = data.date;
      }

      // Add opportunity factors
      for (const factor of data.factors) {
        if (!currentCluster.opportunityFactors.find(f => f.source === factor)) {
          currentCluster.opportunityFactors.push({
            type: 'element_support',
            source: factor,
            strength: normalize(data.score - 70, 0, 30),
            description: `Support from ${factor}`,
          });
        }
      }
    } else if (currentCluster) {
      // Determine opportunity level
      const avgStrength = currentCluster.opportunityFactors.reduce((a, b) => a + b.strength, 0) /
                          (currentCluster.opportunityFactors.length || 1);
      currentCluster.opportunityLevel = avgStrength > 0.8 ? 'major' :
                                         avgStrength > 0.6 ? 'significant' :
                                         avgStrength > 0.4 ? 'moderate' : 'minor';

      clusters.push(currentCluster);
      currentCluster = null;
    }
  }

  if (currentCluster) {
    const avgStrength = currentCluster.opportunityFactors.reduce((a, b) => a + b.strength, 0) /
                        (currentCluster.opportunityFactors.length || 1);
    currentCluster.opportunityLevel = avgStrength > 0.8 ? 'major' :
                                       avgStrength > 0.6 ? 'significant' :
                                       avgStrength > 0.4 ? 'moderate' : 'minor';
    clusters.push(currentCluster);
  }

  return clusters;
}

/**
 * Generate timing intelligence report
 */
export function generateTimingIntelligenceReport(
  period: { start: Date; end: Date },
  timingLayers: Map<TimingLayerType, { date: Date; score: number; factors: string[] }[]>
): TimingIntelligenceReport {
  const volatility: TimingVolatility[] = [];
  const resonances: TimingResonance[] = [];
  const riskWindows: TimingRiskWindow[] = [];
  const opportunityClusters: TimingOpportunityCluster[] = [];
  const keyInsights: TimingInsight[] = [];

  // Analyze each layer
  for (const [layer, data] of timingLayers) {
    const scores = data.map(d => ({ date: d.date, score: d.score }));
    volatility.push(analyzeTimingVolatility(layer, scores, period));
    riskWindows.push(...detectTimingRiskWindows(data));
    opportunityClusters.push(...detectTimingOpportunityClusters(data));
  }

  // Analyze resonances between layers
  const layers = Array.from(timingLayers.keys());
  for (let i = 0; i < layers.length; i++) {
    for (let j = i + 1; j < layers.length; j++) {
      const data1 = timingLayers.get(layers[i])!.map(d => ({ date: d.date, score: d.score }));
      const data2 = timingLayers.get(layers[j])!.map(d => ({ date: d.date, score: d.score }));
      resonances.push(analyzeTimingResonance(layers[i], layers[j], data1, data2));
    }
  }

  // Generate insights
  if (riskWindows.filter(r => r.riskLevel === 'critical').length > 0) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'risk',
      severity: 'critical',
      title: 'Critical Risk Windows Detected',
      description: `${riskWindows.filter(r => r.riskLevel === 'critical').length} critical risk windows identified`,
      affectedLayers: layers,
      confidence: 0.85,
    });
  }

  if (opportunityClusters.filter(o => o.opportunityLevel === 'major').length > 0) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'opportunity',
      severity: 'important',
      title: 'Major Opportunity Clusters Detected',
      description: `${opportunityClusters.filter(o => o.opportunityLevel === 'major').length} major opportunity windows identified`,
      affectedLayers: layers,
      confidence: 0.8,
    });
  }

  const report: TimingIntelligenceReport = {
    generatedAt: now(),
    period,
    volatility,
    resonances,
    riskWindows,
    opportunityClusters,
    storyAlignment: [],
    keyInsights,
    forecast: {
      horizon: 'month',
      nextPeaks: [],
      nextTroughs: [],
      nextCycleShift: { date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), from: 'current', to: 'next' },
      overallTrend: 'stable',
      confidence: 0.7,
    },
  };

  timingReport = report;
  return report;
}

// ============================================================================
// 🜂 2. STORY INTELLIGENCE (故事智能)
// ============================================================================

/**
 * Analyze story arc stability
 */
export function analyzeStoryArcStability(
  arcId: string,
  arcType: string,
  emotionalValues: { position: number; value: number }[]
): StoryArcStability {
  const values = emotionalValues.map(e => e.value);
  const volatilityIndex = standardDeviation(values) / 100;
  const stabilityScore = 1 - normalize(volatilityIndex, 0, 1);

  // Count turning points
  let turningPoints = 0;
  for (let i = 1; i < emotionalValues.length - 1; i++) {
    const prev = emotionalValues[i - 1].value;
    const curr = emotionalValues[i].value;
    const next = emotionalValues[i + 1].value;
    if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
      turningPoints++;
    }
  }

  const turningPointDensity = turningPoints / (emotionalValues.length || 1);

  return {
    arcId,
    arcType,
    stabilityScore,
    volatilityIndex,
    predictability: stabilityScore * 0.8 + (1 - turningPointDensity) * 0.2,
    turningPointDensity,
    emotionalRange: {
      min: Math.min(...values, 0),
      max: Math.max(...values, 0),
    },
    dominantEmotion: values.reduce((a, b) => a + b, 0) / values.length > 50 ? 'positive' : 'negative',
  };
}

/**
 * Analyze turning points
 */
export function analyzeTurningPoints(
  storyId: string,
  beats: { id: string; date: Date; type: string; emotionalValue: number }[],
  period: { start: Date; end: Date }
): TurningPointAnalysis {
  const turningPoints: TurningPoint[] = [];
  const patterns: TurningPointPattern[] = [];

  // Detect turning points
  for (let i = 1; i < beats.length - 1; i++) {
    const prev = beats[i - 1];
    const curr = beats[i];
    const next = beats[i + 1];

    const emotionalShift = Math.abs(curr.emotionalValue - prev.emotionalValue);
    if (emotionalShift > 20) {
      let type: TurningPoint['type'] = 'decision';
      if (curr.emotionalValue < prev.emotionalValue && curr.emotionalValue < next.emotionalValue) {
        type = 'crisis';
      } else if (curr.emotionalValue > prev.emotionalValue && curr.emotionalValue > next.emotionalValue) {
        type = 'opportunity';
      } else if (curr.type === 'revelation') {
        type = 'revelation';
      } else if (Math.abs(curr.emotionalValue - prev.emotionalValue) > 40) {
        type = 'transformation';
      }

      turningPoints.push({
        id: generateId(),
        date: curr.date,
        type,
        intensity: normalize(emotionalShift, 0, 100),
        emotionalShift: { from: prev.emotionalValue, to: curr.emotionalValue },
        triggerFactors: [curr.type],
        archetypeInvolved: curr.type,
        outcome: curr.emotionalValue > prev.emotionalValue ? 'positive' : 'negative',
      });
    }
  }

  // Calculate metrics
  const periodDays = (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24);
  const density = turningPoints.length / (periodDays / 30); // Per month

  return {
    storyId,
    period,
    turningPoints,
    density,
    averageIntensity: turningPoints.length > 0
      ? turningPoints.reduce((a, b) => a + b.intensity, 0) / turningPoints.length
      : 0,
    patterns,
    nextPredicted: turningPoints.length > 0 ? {
      id: generateId(),
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      type: 'decision',
      intensity: 0.5,
      emotionalShift: { from: 50, to: 60 },
      triggerFactors: [],
      archetypeInvolved: 'unknown',
      outcome: 'neutral',
    } : undefined,
  };
}

/**
 * Analyze archetype dominance
 */
export function analyzeArchetypeDominance(
  beats: { date: Date; archetype: string; strength: number }[],
  period: { start: Date; end: Date }
): ArchetypeDominance {
  const archetypeScores: Map<string, { total: number; count: number; trend: number[] }> = new Map();

  for (const beat of beats) {
    const existing = archetypeScores.get(beat.archetype) || { total: 0, count: 0, trend: [] };
    existing.total += beat.strength;
    existing.count++;
    existing.trend.push(beat.strength);
    archetypeScores.set(beat.archetype, existing);
  }

  const archetypes: ArchetypeScore[] = [];
  for (const [archetype, data] of archetypeScores) {
    const avgScore = data.total / data.count;
    const trendSlope = data.trend.length > 1
      ? (data.trend[data.trend.length - 1] - data.trend[0]) / data.trend.length
      : 0;

    archetypes.push({
      archetype,
      score: avgScore,
      trend: trendSlope > 0.1 ? 'rising' : trendSlope < -0.1 ? 'falling' : 'stable',
      peakMoments: [],
      alignedStoryBeats: [],
    });
  }

  archetypes.sort((a, b) => b.score - a.score);

  return {
    period,
    archetypes,
    dominantArchetype: archetypes[0]?.archetype || 'unknown',
    emergingArchetype: archetypes.find(a => a.trend === 'rising')?.archetype || 'unknown',
    fadingArchetype: archetypes.find(a => a.trend === 'falling')?.archetype || 'unknown',
    archetypeFlow: beats.map(b => ({ date: b.date, archetype: b.archetype, strength: b.strength })),
  };
}

/**
 * Analyze narrative coherence
 */
export function analyzeNarrativeCoherence(
  storyId: string,
  chapters: { id: string; theme: string; emotionalValue: number; archetypes: string[] }[]
): NarrativeCoherence {
  const plotHoles: NarrativeGap[] = [];

  // Check thematic consistency
  const themes = new Set(chapters.map(c => c.theme));
  const thematicConsistency = 1 - normalize(themes.size, 1, chapters.length);

  // Check emotional flow
  let emotionalJumps = 0;
  for (let i = 1; i < chapters.length; i++) {
    if (Math.abs(chapters[i].emotionalValue - chapters[i - 1].emotionalValue) > 40) {
      emotionalJumps++;
      plotHoles.push({
        id: generateId(),
        type: 'emotional',
        location: { chapter: chapters[i].id, position: i },
        severity: 'moderate',
        description: 'Abrupt emotional shift',
        suggestedResolution: 'Add transitional content',
      });
    }
  }
  const emotionalFlow = 1 - normalize(emotionalJumps, 0, chapters.length);

  // Check archetype consistency
  const archetypeUsage = new Map<string, number>();
  for (const chapter of chapters) {
    for (const arch of chapter.archetypes) {
      archetypeUsage.set(arch, (archetypeUsage.get(arch) || 0) + 1);
    }
  }
  const archetypeConsistency = archetypeUsage.size > 0
    ? 1 - normalize(archetypeUsage.size, 1, chapters.length * 2)
    : 0.5;

  const coherenceScore = (thematicConsistency + emotionalFlow + archetypeConsistency) / 3;

  return {
    storyId,
    coherenceScore,
    thematicConsistency,
    emotionalFlow,
    archetypeConsistency,
    plotHoles,
    strengthAreas: coherenceScore > 0.7 ? ['Overall narrative flow', 'Character consistency'] : [],
    weaknessAreas: plotHoles.length > 0 ? ['Emotional transitions'] : [],
  };
}

/**
 * Generate story intelligence report
 */
export function generateStoryIntelligenceReport(
  storyId: string,
  storyData: {
    arcs: { id: string; type: string; emotionalValues: { position: number; value: number }[] }[];
    beats: { id: string; date: Date; type: string; emotionalValue: number; archetype: string }[];
    chapters: { id: string; theme: string; emotionalValue: number; archetypes: string[] }[];
    period: { start: Date; end: Date };
  }
): StoryIntelligenceReport {
  const arcStability = storyData.arcs.map(arc =>
    analyzeStoryArcStability(arc.id, arc.type, arc.emotionalValues)
  );

  const emotionalPredictability: EmotionalArcPredictability = {
    arcId: storyId,
    period: storyData.period,
    predictabilityScore: arcStability.reduce((a, b) => a + b.predictability, 0) / (arcStability.length || 1),
    patternType: 'cyclical',
    nextPredictedPeak: { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), value: 70, confidence: 0.6 },
    nextPredictedTrough: { date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), value: 30, confidence: 0.6 },
    deviationHistory: [],
  };

  const turningPointAnalysis = analyzeTurningPoints(storyId, storyData.beats, storyData.period);

  const archetypeDominance = analyzeArchetypeDominance(
    storyData.beats.map(b => ({ date: b.date, archetype: b.archetype, strength: b.emotionalValue })),
    storyData.period
  );

  const narrativeCoherence = analyzeNarrativeCoherence(storyId, storyData.chapters);

  const keyInsights: StoryInsight[] = [];

  if (narrativeCoherence.coherenceScore < 0.5) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'coherence',
      severity: 'important',
      title: 'Narrative Coherence Needs Attention',
      description: 'Story coherence is below optimal levels',
      affectedChapters: narrativeCoherence.plotHoles.map(h => h.location.chapter),
      confidence: 0.8,
    });
  }

  const report: StoryIntelligenceReport = {
    generatedAt: now(),
    storyId,
    arcStability,
    emotionalPredictability,
    turningPointAnalysis,
    archetypeDominance,
    narrativeCoherence,
    crossStoryResonance: [],
    keyInsights,
  };

  storyReport = report;
  return report;
}

// ============================================================================
// 🜃 3. RELATIONSHIP INTELLIGENCE (关系智能)
// ============================================================================

/**
 * Calculate relationship stability index
 */
export function calculateRelationshipStability(
  relationshipId: string,
  metrics: { date: Date; stability: number; volatility: number; growth: number }[]
): RelationshipStabilityIndex {
  const avgStability = metrics.reduce((a, b) => a + b.stability, 0) / (metrics.length || 1);
  const avgVolatility = metrics.reduce((a, b) => a + b.volatility, 0) / (metrics.length || 1);
  const avgGrowth = metrics.reduce((a, b) => a + b.growth, 0) / (metrics.length || 1);

  // Calculate trend
  const recentMetrics = metrics.slice(-10);
  const olderMetrics = metrics.slice(0, -10);
  const recentAvg = recentMetrics.reduce((a, b) => a + b.stability, 0) / (recentMetrics.length || 1);
  const olderAvg = olderMetrics.reduce((a, b) => a + b.stability, 0) / (olderMetrics.length || 1);

  const riskFactors: RelationshipRiskFactor[] = [];
  if (avgVolatility > 0.6) {
    riskFactors.push({
      type: 'timing_stress',
      severity: avgVolatility,
      description: 'High volatility in relationship dynamics',
      mitigation: 'Focus on stabilizing routines and communication',
    });
  }

  return {
    relationshipId,
    stabilityScore: avgStability,
    volatilityIndex: avgVolatility,
    resilienceScore: 1 - avgVolatility,
    growthPotential: avgGrowth,
    riskFactors,
    stabilityTrend: recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable',
  };
}

/**
 * Analyze resonance score
 */
export function analyzeResonanceScore(
  relationshipId: string,
  dimensions: { name: string; scores: { date: Date; score: number }[] }[]
): ResonanceScoreAnalysis {
  const analyzedDimensions: ResonanceDimension[] = dimensions.map(dim => {
    const avgScore = dim.scores.reduce((a, b) => a + b.score, 0) / (dim.scores.length || 1);
    const recentScores = dim.scores.slice(-5);
    const olderScores = dim.scores.slice(0, -5);
    const recentAvg = recentScores.reduce((a, b) => a + b.score, 0) / (recentScores.length || 1);
    const olderAvg = olderScores.reduce((a, b) => a + b.score, 0) / (olderScores.length || 1);

    return {
      name: dim.name,
      score: avgScore,
      trend: recentAvg > olderAvg + 5 ? 'rising' : recentAvg < olderAvg - 5 ? 'falling' : 'stable',
      strengthFactors: avgScore > 70 ? ['Strong connection', 'Good communication'] : [],
      weaknessFactors: avgScore < 40 ? ['Needs attention', 'Room for growth'] : [],
    };
  });

  const overallResonance = analyzedDimensions.reduce((a, b) => a + b.score, 0) / (analyzedDimensions.length || 1);

  return {
    relationshipId,
    overallResonance,
    dimensions: analyzedDimensions,
    harmonicPeaks: [],
    dissonantTroughs: [],
    resonancePattern: overallResonance > 70 ? 'Strong harmony' :
                      overallResonance > 50 ? 'Moderate harmony' : 'Developing harmony',
  };
}

/**
 * Analyze conflict signature
 */
export function analyzeConflictSignature(
  relationshipId: string,
  conflicts: { date: Date; trigger: string; element: string; duration: number; intensity: number }[]
): ConflictSignature {
  // Find primary element
  const elementCounts = new Map<string, number>();
  for (const conflict of conflicts) {
    elementCounts.set(conflict.element, (elementCounts.get(conflict.element) || 0) + 1);
  }
  let primaryElement = 'Metal'; // Default
  let maxCount = 0;
  for (const [element, count] of elementCounts) {
    if (count > maxCount) {
      maxCount = count;
      primaryElement = element;
    }
  }

  // Analyze triggers
  const triggerCounts = new Map<string, number>();
  for (const conflict of conflicts) {
    triggerCounts.set(conflict.trigger, (triggerCounts.get(conflict.trigger) || 0) + 1);
  }
  const triggerPatterns: ConflictTrigger[] = Array.from(triggerCounts.entries()).map(([trigger, count]) => ({
    trigger,
    frequency: count,
  }));

  const avgDuration = conflicts.reduce((a, b) => a + b.duration, 0) / (conflicts.length || 1);
  const avgIntensity = conflicts.reduce((a, b) => a + b.intensity, 0) / (conflicts.length || 1);

  return {
    relationshipId,
    primaryElement,
    triggerPatterns,
    escalationPattern: avgIntensity > 0.7 ? 'Rapid escalation' : 'Gradual build',
    resolutionStyle: primaryElement === 'Water' ? 'Softening' :
                     primaryElement === 'Fire' ? 'Direct' : 'Structural',
    averageDuration: avgDuration,
    frequency: conflicts.length / 30, // Per month
    intensity: avgIntensity,
  };
}

/**
 * Analyze healing signature
 */
export function analyzeHealingSignature(
  relationshipId: string,
  healingEvents: { date: Date; approach: string; element: string; effectiveness: number }[]
): HealingSignature {
  // Find primary element
  const elementEffectiveness = new Map<string, { total: number; count: number }>();
  for (const event of healingEvents) {
    const existing = elementEffectiveness.get(event.element) || { total: 0, count: 0 };
    existing.total += event.effectiveness;
    existing.count++;
    elementEffectiveness.set(event.element, existing);
  }

  let primaryElement = 'Water'; // Default
  let maxEffectiveness = 0;
  for (const [element, data] of elementEffectiveness) {
    const avg = data.total / data.count;
    if (avg > maxEffectiveness) {
      maxEffectiveness = avg;
      primaryElement = element;
    }
  }

  // Analyze patterns
  const approachEffectiveness = new Map<string, { total: number; count: number }>();
  for (const event of healingEvents) {
    const existing = approachEffectiveness.get(event.approach) || { total: 0, count: 0 };
    existing.total += event.effectiveness;
    existing.count++;
    approachEffectiveness.set(event.approach, existing);
  }

  const healingPatterns: HealingPattern[] = Array.from(approachEffectiveness.entries()).map(([approach, data]) => ({
    pattern: approach,
    effectiveness: data.total / data.count,
    elementalSupport: [primaryElement],
  }));

  return {
    relationshipId,
    primaryElement,
    healingPatterns,
    optimalApproach: healingPatterns.sort((a, b) => b.effectiveness - a.effectiveness)[0]?.pattern || 'unknown',
    healingSpeed: maxEffectiveness > 0.7 ? 0.8 : 0.5,
    deepHealingCapacity: maxEffectiveness,
  };
}

/**
 * Generate relationship intelligence report
 */
export function generateRelationshipIntelligenceReport(
  relationshipId: string,
  data: {
    metrics: { date: Date; stability: number; volatility: number; growth: number }[];
    dimensions: { name: string; scores: { date: Date; score: number }[] }[];
    conflicts: { date: Date; trigger: string; element: string; duration: number; intensity: number }[];
    healingEvents: { date: Date; approach: string; element: string; effectiveness: number }[];
  }
): RelationshipIntelligenceReport {
  const stabilityIndex = calculateRelationshipStability(relationshipId, data.metrics);
  const resonanceAnalysis = analyzeResonanceScore(relationshipId, data.dimensions);
  const conflictSignature = analyzeConflictSignature(relationshipId, data.conflicts);
  const healingSignature = analyzeHealingSignature(relationshipId, data.healingEvents);

  const commitmentReadiness: CommitmentReadiness = {
    relationshipId,
    readinessScore: stabilityIndex.stabilityScore * 0.4 + resonanceAnalysis.overallResonance / 100 * 0.6,
    individualReadiness: [],
    blockingFactors: stabilityIndex.riskFactors.map(f => f.description),
    supportingFactors: resonanceAnalysis.dimensions.filter(d => d.score > 70).map(d => d.name),
    recommendation: stabilityIndex.stabilityScore > 0.7 ? 'Ready for deeper commitment' : 'Continue building foundation',
  };

  const lifecyclePosition: LifecyclePosition = {
    currentPhase: stabilityIndex.stabilityScore > 0.8 ? 'Integration' :
                  stabilityIndex.stabilityScore > 0.6 ? 'Growth' :
                  stabilityIndex.stabilityScore > 0.4 ? 'Exploration' : 'Formation',
    phaseProgress: stabilityIndex.stabilityScore,
    nextPhase: 'Deepening',
    phaseHealth: stabilityIndex.stabilityScore > 0.7 ? 'thriving' :
                 stabilityIndex.stabilityScore > 0.5 ? 'healthy' :
                 stabilityIndex.stabilityScore > 0.3 ? 'struggling' : 'critical',
  };

  const keyInsights: RelationshipInsight[] = [];

  if (conflictSignature.intensity > 0.7) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'conflict',
      severity: 'important',
      title: 'High Conflict Intensity',
      description: `Conflicts tend to be ${conflictSignature.primaryElement}-driven with ${conflictSignature.escalationPattern.toLowerCase()}`,
      actionable: true,
      confidence: 0.8,
    });
  }

  if (healingSignature.deepHealingCapacity > 0.7) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'healing',
      severity: 'notable',
      title: 'Strong Healing Capacity',
      description: `Best healing through ${healingSignature.optimalApproach} with ${healingSignature.primaryElement} support`,
      actionable: true,
      confidence: 0.75,
    });
  }

  const report: RelationshipIntelligenceReport = {
    generatedAt: now(),
    relationshipId,
    stabilityIndex,
    resonanceAnalysis,
    conflictSignature,
    healingSignature,
    commitmentReadiness,
    lifecyclePosition,
    ritualWindows: [],
    keyInsights,
  };

  relationshipReports.set(relationshipId, report);
  return report;
}

// ============================================================================
// 🜄 4. SYSTEMIC INTELLIGENCE (系统智能)
// ============================================================================

/**
 * Map systemic tensions
 */
export function mapSystemicTensions(
  systemId: string,
  systemType: SystemType,
  nodes: { id: string; name: string; element: string }[],
  edges: { from: string; to: string; tension: number; type: string }[]
): SystemicTensionMap {
  const tensions: SystemicTension[] = edges.filter(e => e.tension > 0.3).map(e => ({
    id: generateId(),
    between: [e.from, e.to],
    type: e.type as SystemicTension['type'],
    intensity: e.tension,
    duration: 0, // Would track actual duration
    trend: e.tension > 0.6 ? 'escalating' : 'stable',
    rootCause: `${e.type} tension between nodes`,
  }));

  // Calculate tension load per node
  const tensionLoads = new Map<string, number>();
  for (const tension of tensions) {
    for (const nodeId of tension.between) {
      tensionLoads.set(nodeId, (tensionLoads.get(nodeId) || 0) + tension.intensity);
    }
  }

  const hotspots: TensionHotspot[] = nodes
    .map(n => ({
      nodeId: n.id,
      nodeName: n.name,
      tensionLoad: tensionLoads.get(n.id) || 0,
      connectedTensions: tensions.filter(t => t.between.includes(n.id)).map(t => t.id),
      risk: ((tensionLoads.get(n.id) || 0) > 1.5 ? 'critical' :
             (tensionLoads.get(n.id) || 0) > 1 ? 'high' :
             (tensionLoads.get(n.id) || 0) > 0.5 ? 'moderate' : 'low') as TensionHotspot['risk'],
    }))
    .filter(h => h.tensionLoad > 0.3);

  // Find relief points (nodes with low tension that connect to high tension nodes)
  const reliefPoints: TensionReliefPoint[] = nodes
    .filter(n => (tensionLoads.get(n.id) || 0) < 0.3)
    .map(n => ({
      nodeId: n.id,
      nodeName: n.name,
      reliefCapacity: 1 - (tensionLoads.get(n.id) || 0),
      connectedNodes: edges.filter(e => e.from === n.id || e.to === n.id)
        .map(e => e.from === n.id ? e.to : e.from),
      role: n.element === 'Water' ? 'harmonizer' as const :
            n.element === 'Earth' ? 'grounding' as const : 'mediator' as const,
    }));

  return {
    systemId,
    systemType,
    tensions,
    overallTensionLevel: tensions.reduce((a, b) => a + b.intensity, 0) / (tensions.length || 1),
    hotspots,
    reliefPoints,
  };
}

/**
 * Detect generational echoes
 */
export function detectGenerationalEchoes(
  systemId: string,
  generations: { id: string; patterns: string[]; elements: string[] }[]
): GenerationalEchoAnalysis {
  const echos: GenerationalEcho[] = [];

  // Find repeating patterns
  const patternCounts = new Map<string, string[]>();
  for (const gen of generations) {
    for (const pattern of gen.patterns) {
      const existing = patternCounts.get(pattern) || [];
      existing.push(gen.id);
      patternCounts.set(pattern, existing);
    }
  }

  for (const [pattern, genList] of patternCounts) {
    if (genList.length >= 2) {
      echos.push({
        id: generateId(),
        pattern,
        generations: genList,
        elementalSignature: 'Mixed',
        manifestations: genList.map(g => `Pattern manifests in generation ${g}`),
        healing: 'Awareness and conscious choice to break cycle',
      });
    }
  }

  return {
    systemId,
    echos,
    cycleLength: 3, // Default 3-generation cycle
    currentPosition: generations[generations.length - 1]?.id || 'unknown',
    breakingPoints: [],
    reinforcingFactors: echos.map(e => e.pattern),
  };
}

/**
 * Analyze team synergy cycle
 */
export function analyzeTeamSynergyCycle(
  teamId: string,
  members: { id: string; element: string; role: string }[]
): TeamSynergyCycle {
  // Calculate elemental balance
  const elementCounts: Record<string, number> = {};
  for (const member of members) {
    elementCounts[member.element] = (elementCounts[member.element] || 0) + 1;
  }

  // Calculate role distribution
  const roleCounts = new Map<string, string[]>();
  for (const member of members) {
    const existing = roleCounts.get(member.role) || [];
    existing.push(member.id);
    roleCounts.set(member.role, existing);
  }

  const roleDistribution: RoleDistribution[] = Array.from(roleCounts.entries()).map(([role, members]) => ({
    role,
    filledBy: members,
    coverage: members.length > 0 ? 1 : 0,
    gaps: [],
  }));

  // Calculate synergy score
  const uniqueElements = Object.keys(elementCounts).length;
  const elementBalance = uniqueElements / 5; // 5 elements ideal
  const roleBalance = roleDistribution.length / 5; // Assuming 5 key roles

  return {
    teamId,
    currentPhase: 'performing',
    phaseHealth: (elementBalance + roleBalance) / 2,
    synergyScore: (elementBalance + roleBalance) / 2,
    elementalBalance: elementCounts,
    roleDistribution,
    optimizationSuggestions: uniqueElements < 3 ? ['Consider adding members with different elements'] : [],
  };
}

/**
 * Generate systemic intelligence report
 */
export function generateSystemicIntelligenceReport(
  systemId: string,
  systemType: SystemType,
  data: {
    nodes: { id: string; name: string; element: string }[];
    edges: { from: string; to: string; tension: number; type: string }[];
    generations?: { id: string; patterns: string[]; elements: string[] }[];
  }
): SystemicIntelligenceReport {
  const tensionMap = mapSystemicTensions(systemId, systemType, data.nodes, data.edges);

  const generationalEchos = data.generations
    ? detectGenerationalEchoes(systemId, data.generations)
    : undefined;

  const keyInsights: SystemicInsight[] = [];

  if (tensionMap.overallTensionLevel > 0.6) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'tension',
      severity: 'important',
      title: 'High Systemic Tension',
      description: `System has ${tensionMap.hotspots.length} tension hotspots`,
      affectedNodes: tensionMap.hotspots.map(h => h.nodeId),
      confidence: 0.8,
    });
  }

  if (generationalEchos && generationalEchos.echos.length > 0) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'echo',
      severity: 'notable',
      title: 'Generational Patterns Detected',
      description: `${generationalEchos.echos.length} repeating patterns across generations`,
      affectedNodes: generationalEchos.echos.flatMap(e => e.generations),
      confidence: 0.75,
    });
  }

  const report: SystemicIntelligenceReport = {
    generatedAt: now(),
    systemId,
    systemType,
    tensionMap,
    generationalEchos,
    systemicTurningPoints: [],
    keyInsights,
  };

  systemicReports.set(systemId, report);
  return report;
}

// ============================================================================
// 🜅 5. PATTERN INTELLIGENCE (模式智能)
// ============================================================================

/**
 * Detect patterns from data
 */
export function detectPatterns(
  dataPoints: { date: Date; type: PatternType; context: string; value: number }[]
): DetectedPattern[] {
  const patternMap = new Map<string, PatternOccurrence[]>();

  for (const point of dataPoints) {
    const key = `${point.type}:${point.context}`;
    const occurrences = patternMap.get(key) || [];
    occurrences.push({
      date: point.date,
      context: point.context,
      strength: point.value / 100,
    });
    patternMap.set(key, occurrences);
  }

  const patterns: DetectedPattern[] = [];

  for (const [key, occurrences] of patternMap) {
    if (occurrences.length >= 2) {
      const [typeStr, context] = key.split(':');
      const type = typeStr as PatternType;
      const avgStrength = occurrences.reduce((a, b) => a + b.strength, 0) / occurrences.length;

      // Calculate frequency (occurrences per 30 days)
      const timeSpan = occurrences[occurrences.length - 1].date.getTime() - occurrences[0].date.getTime();
      const days = timeSpan / (1000 * 60 * 60 * 24) || 30;
      const frequency = occurrences.length / (days / 30);

      // Detect if cyclical
      let cycleDuration: number | undefined;
      if (occurrences.length >= 3) {
        const intervals: number[] = [];
        for (let i = 1; i < occurrences.length; i++) {
          intervals.push(occurrences[i].date.getTime() - occurrences[i - 1].date.getTime());
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const intervalVariance = standardDeviation(intervals) / avgInterval;
        if (intervalVariance < 0.3) {
          cycleDuration = avgInterval / (1000 * 60 * 60 * 24); // Convert to days
        }
      }

      // Determine trend
      const recentStrength = occurrences.slice(-3).reduce((a, b) => a + b.strength, 0) / 3;
      const olderStrength = occurrences.slice(0, -3).reduce((a, b) => a + b.strength, 0) / (occurrences.length - 3 || 1);

      patterns.push({
        id: generateId(),
        type,
        name: context,
        description: `${type} pattern: ${context}`,
        occurrences,
        frequency,
        cycleDuration,
        confidence: Math.min(0.5 + occurrences.length * 0.1, 0.95),
        firstDetected: occurrences[0].date,
        lastOccurrence: occurrences[occurrences.length - 1].date,
        strength: avgStrength,
        trend: recentStrength > olderStrength + 0.1 ? 'strengthening' :
               recentStrength < olderStrength - 0.1 ? 'weakening' :
               occurrences.length < 3 ? 'emerging' : 'stable',
      });
    }
  }

  // Update global pattern storage
  for (const pattern of patterns) {
    detectedPatterns.set(pattern.id, pattern);
  }
  totalPatternsDetected = detectedPatterns.size;

  return patterns;
}

/**
 * Cluster related patterns
 */
export function clusterPatterns(patterns: DetectedPattern[]): PatternCluster[] {
  const clusters: PatternCluster[] = [];

  // Group by type
  const byType = new Map<PatternType, DetectedPattern[]>();
  for (const pattern of patterns) {
    const existing = byType.get(pattern.type) || [];
    existing.push(pattern);
    byType.set(pattern.type, existing);
  }

  for (const [type, typePatterns] of byType) {
    if (typePatterns.length >= 2) {
      clusters.push({
        id: generateId(),
        name: `${type} Pattern Cluster`,
        patterns: typePatterns.map(p => p.id),
        cohesion: typePatterns.length / patterns.length,
        sharedFactors: [type],
        interpretation: `Related ${type} patterns that may influence each other`,
      });
    }
  }

  return clusters;
}

/**
 * Forecast pattern occurrences
 */
export function forecastPatterns(patterns: DetectedPattern[]): PatternForecast[] {
  return patterns
    .filter(p => p.cycleDuration && p.trend !== 'weakening')
    .map(p => ({
      patternId: p.id,
      patternName: p.name,
      nextOccurrence: new Date(p.lastOccurrence.getTime() + (p.cycleDuration! * 24 * 60 * 60 * 1000)),
      confidence: p.confidence * (p.trend === 'strengthening' ? 1.1 : 1),
      expectedStrength: p.strength * (p.trend === 'strengthening' ? 1.1 : 0.9),
      contextPrediction: p.description,
      preparationSuggestions: ['Monitor for pattern emergence', 'Prepare appropriate response'],
    }));
}

/**
 * Generate pattern intelligence report
 */
export function generatePatternIntelligenceReport(
  period: { start: Date; end: Date },
  dataPoints: { date: Date; type: PatternType; context: string; value: number }[]
): PatternIntelligenceReport {
  const patterns = detectPatterns(dataPoints);
  const clusters = clusterPatterns(patterns);
  const forecasts = forecastPatterns(patterns);

  const keyInsights: PatternInsight[] = [];

  // Strong patterns
  const strongPatterns = patterns.filter(p => p.strength > 0.7);
  if (strongPatterns.length > 0) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'discovery',
      severity: 'notable',
      title: 'Strong Patterns Identified',
      description: `${strongPatterns.length} patterns with strength above 70%`,
      affectedPatterns: strongPatterns.map(p => p.id),
      confidence: 0.8,
    });
  }

  // Emerging patterns
  const emergingPatterns = patterns.filter(p => p.trend === 'emerging');
  if (emergingPatterns.length > 0) {
    keyInsights.push({
      id: generateId(),
      timestamp: now(),
      type: 'discovery',
      severity: 'info',
      title: 'Emerging Patterns',
      description: `${emergingPatterns.length} new patterns forming`,
      affectedPatterns: emergingPatterns.map(p => p.id),
      confidence: 0.6,
    });
  }

  const report: PatternIntelligenceReport = {
    generatedAt: now(),
    period,
    detectedPatterns: patterns,
    patternClusters: clusters,
    forecasts,
    anomalies: [],
    evolutions: [],
    storyAlignments: [],
    timingAlignments: [],
    keyInsights,
  };

  patternReport = report;
  return report;
}

// ============================================================================
// OBSERVATORY (天文台)
// ============================================================================

/**
 * Initialize observatory
 */
export function initializeObservatory(): ObservatoryState {
  observatoryState = {
    activePanel: 'insight_stream',
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: now(),
    },
    filters: { ...DEFAULT_OBSERVATORY_FILTERS },
    insightStream: [],
    patternMap: [],
    timingHeatmap: [],
    metrics: [],
    forecasts: [],
    recommendations: [],
  };

  return observatoryState;
}

/**
 * Add insight to stream
 */
export function addToInsightStream(insight: AnalyticsInsight): void {
  const entry: InsightStreamEntry = {
    insight,
    acknowledged: false,
    pinned: false,
    relatedInsights: [],
  };

  insightStream.unshift(entry);
  allInsights.push(insight);
  totalInsightsGenerated++;

  // Keep stream manageable
  while (insightStream.length > 100) {
    insightStream.pop();
  }

  if (observatoryState) {
    observatoryState.insightStream = insightStream;
  }
}

/**
 * Generate pattern map nodes
 */
export function generatePatternMapNodes(): PatternMapNode[] {
  const nodes: PatternMapNode[] = [];

  for (const pattern of detectedPatterns.values()) {
    nodes.push({
      patternId: pattern.id,
      patternName: pattern.name,
      type: pattern.type,
      size: pattern.strength * 50,
      color: getPatternColor(pattern.type),
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      connections: [], // Would calculate actual connections
    });
  }

  return nodes;
}

/**
 * Get pattern color by type
 */
function getPatternColor(type: PatternType): string {
  const colors: Record<PatternType, string> = {
    timing: '#4A90A4',
    emotional: '#E74C3C',
    relationship: '#9B59B6',
    ritual_outcome: '#F1C40F',
    simulation_outcome: '#2ECC71',
    generational: '#E67E22',
    archetypal: '#1ABC9C',
  };
  return colors[type] || '#95A5A6';
}

/**
 * Set active observatory panel
 */
export function setActivePanel(panel: ObservatoryPanel): void {
  if (observatoryState) {
    observatoryState.activePanel = panel;
  }
}

/**
 * Update observatory filters
 */
export function updateObservatoryFilters(filters: Partial<ObservatoryFilters>): void {
  if (observatoryState) {
    observatoryState.filters = { ...observatoryState.filters, ...filters };
  }
}

/**
 * Acknowledge insight
 */
export function acknowledgeInsight(insightId: string): void {
  const entry = insightStream.find(e => e.insight.id === insightId);
  if (entry) {
    entry.acknowledged = true;
  }
}

/**
 * Pin insight
 */
export function pinInsight(insightId: string): void {
  const entry = insightStream.find(e => e.insight.id === insightId);
  if (entry) {
    entry.pinned = !entry.pinned;
  }
}

/**
 * Get observatory state
 */
export function getObservatoryState(): ObservatoryState | null {
  return observatoryState;
}

// ============================================================================
// ANALYTICS METRICS & RECOMMENDATIONS
// ============================================================================

/**
 * Calculate analytics metric
 */
export function calculateMetric(type: MetricType): AnalyticsMetric {
  let value = 0;
  let trend: 'rising' | 'stable' | 'falling' = 'stable';

  switch (type) {
    case 'timing_strength':
      if (timingReport) {
        const volatilities = timingReport.volatility;
        value = 100 - (volatilities.reduce((a, b) => a + b.volatilityScore, 0) / volatilities.length * 100);
      }
      break;
    case 'story_coherence':
      if (storyReport) {
        value = storyReport.narrativeCoherence.coherenceScore * 100;
      }
      break;
    case 'relationship_stability':
      if (relationshipReports.size > 0) {
        const reports = Array.from(relationshipReports.values());
        value = reports.reduce((a, b) => a + b.stabilityIndex.stabilityScore, 0) / reports.length * 100;
      }
      break;
    case 'systemic_tension':
      if (systemicReports.size > 0) {
        const reports = Array.from(systemicReports.values());
        value = 100 - (reports.reduce((a, b) => a + b.tensionMap.overallTensionLevel, 0) / reports.length * 100);
      }
      break;
    case 'pattern_density':
      value = Math.min(100, detectedPatterns.size * 10);
      break;
    case 'ritual_alignment':
      value = 75; // Placeholder
      break;
  }

  return {
    type,
    value,
    unit: '%',
    timestamp: now(),
    trend,
  };
}

/**
 * Generate recommendation
 */
export function generateRecommendation(
  lens: 'timing' | 'story' | 'relationship' | 'systemic' | 'pattern',
  insight: AnalyticsInsight
): AnalyticsRecommendation {
  const recommendation: AnalyticsRecommendation = {
    id: generateId(),
    timestamp: now(),
    lens,
    type: insight.severity === 'critical' ? 'caution' :
          insight.type === 'opportunity' ? 'opportunity' :
          insight.type === 'risk' ? 'caution' : 'awareness',
    title: `Regarding: ${insight.title}`,
    description: insight.recommendation || `Be aware of ${insight.description}`,
    basedOn: [insight.id],
    priority: insight.severity === 'critical' ? 'high' :
              insight.severity === 'important' ? 'medium' : 'low',
  };

  allRecommendations.push(recommendation);
  return recommendation;
}

// ============================================================================
// ENGINE INITIALIZATION
// ============================================================================

/**
 * Configure analytics pipeline
 */
export function configureAnalyticsPipeline(
  config: Partial<AnalyticsPipelineConfig>
): AnalyticsPipelineConfig {
  pipelineConfig = { ...pipelineConfig, ...config };

  // Update refresh interval
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }

  if (pipelineConfig.enabled && pipelineConfig.autoRefresh) {
    refreshInterval = setInterval(refreshAnalytics, pipelineConfig.refreshIntervalMs);
  }

  return pipelineConfig;
}

/**
 * Refresh all analytics
 */
export function refreshAnalytics(): void {
  lastRefresh = now();

  // Update observatory
  if (observatoryState) {
    observatoryState.patternMap = generatePatternMapNodes();
    observatoryState.metrics = [
      calculateMetric('timing_strength'),
      calculateMetric('story_coherence'),
      calculateMetric('relationship_stability'),
      calculateMetric('systemic_tension'),
      calculateMetric('pattern_density'),
    ];
  }
}

/**
 * Initialize analytics engine
 */
export function initializeAnalyticsEngine(): AnalyticsEngineState {
  // Initialize observatory
  initializeObservatory();

  // Start refresh interval
  if (pipelineConfig.enabled && pipelineConfig.autoRefresh) {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshAnalytics, pipelineConfig.refreshIntervalMs);
  }

  isRunning = true;
  lastRefresh = now();

  engineState = {
    pipelineConfig,
    timingReport,
    storyReport,
    relationshipReports,
    systemicReports,
    patternReport,
    observatory: observatoryState!,
    isRunning,
    lastRefresh,
    totalInsightsGenerated,
    totalPatternsDetected,
  };

  return engineState;
}

/**
 * Get analytics engine state
 */
export function getAnalyticsEngineState(): AnalyticsEngineState | null {
  if (!engineState) return null;

  // Update dynamic fields
  engineState.timingReport = timingReport;
  engineState.storyReport = storyReport;
  engineState.patternReport = patternReport;
  engineState.observatory = observatoryState!;
  engineState.isRunning = isRunning;
  engineState.lastRefresh = lastRefresh;
  engineState.totalInsightsGenerated = totalInsightsGenerated;
  engineState.totalPatternsDetected = totalPatternsDetected;

  return engineState;
}

/**
 * Shutdown analytics engine
 */
export function shutdownAnalyticsEngine(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  isRunning = false;
}

/**
 * Get all insights
 */
export function getAllInsights(
  filter?: { lens?: string; severity?: string; limit?: number }
): AnalyticsInsight[] {
  let filtered = [...allInsights];

  if (filter?.lens) {
    filtered = filtered.filter(i => i.lens === filter.lens);
  }
  if (filter?.severity) {
    filtered = filtered.filter(i => i.severity === filter.severity);
  }
  if (filter?.limit) {
    filtered = filtered.slice(-filter.limit);
  }

  return filtered;
}

/**
 * Get all forecasts
 */
export function getAllForecasts(): AnalyticsForecast[] {
  return [...allForecasts];
}

/**
 * Get all recommendations
 */
export function getAllRecommendations(): AnalyticsRecommendation[] {
  return [...allRecommendations];
}

/**
 * Get timing intelligence report
 */
export function getTimingReport(): TimingIntelligenceReport | undefined {
  return timingReport;
}

/**
 * Get story intelligence report
 */
export function getStoryReport(): StoryIntelligenceReport | undefined {
  return storyReport;
}

/**
 * Get relationship intelligence report
 */
export function getRelationshipReport(relationshipId: string): RelationshipIntelligenceReport | undefined {
  return relationshipReports.get(relationshipId);
}

/**
 * Get systemic intelligence report
 */
export function getSystemicReport(systemId: string): SystemicIntelligenceReport | undefined {
  return systemicReports.get(systemId);
}

/**
 * Get pattern intelligence report
 */
export function getPatternReport(): PatternIntelligenceReport | undefined {
  return patternReport;
}
