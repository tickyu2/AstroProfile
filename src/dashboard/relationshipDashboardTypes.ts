/**
 * ============================================================================
 * RELATIONSHIP DASHBOARD TYPES (关系仪表盘类型)
 * ============================================================================
 *
 * Type definitions for the Relationship Dashboard - the single-screen view
 * showing the living state of a relationship.
 *
 * Components:
 * - Synastry Heatmap
 * - Composite Chart Summary
 * - Lifecycle Phase
 * - Event Windows
 * - Destiny Curve
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// ELEMENT TYPES
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

// ============================================================================
// SYNASTRY TYPES
// ============================================================================

/**
 * Single cell in synastry heatmap
 */
export interface SynastryCell {
  rowIndex: number;
  colIndex: number;
  aPillar: string;
  bPillar: string;
  aPillarChinese: string;
  bPillarChinese: string;
  score: number;
  harmony: string[];
  tension: string[];
  totalScore: number;
  summary?: string;
}

/**
 * Complete synastry heatmap
 */
export interface SynastryHeatmapData {
  grid: SynastryCell[][];
  overallScore: number;
  strongestHarmony: SynastryCell | null;
  strongestTension: SynastryCell | null;
  romanceHotspots: SynastryCell[];
}

/**
 * Synastry summary
 */
export interface SynastrySummaryData {
  harmonyScore: number;
  tensionScore: number;
  overallScore: number;
  keyInsights: string[];
  compatibilityTier: 'exceptional' | 'strong' | 'balanced' | 'growth' | 'challenging';
}

// ============================================================================
// COMPOSITE CHART TYPES
// ============================================================================

/**
 * Day Master info
 */
export interface DayMasterInfo {
  element: ElementName;
  chineseName: string;
  strengthScore: number;
  strengthCategory: 'very_strong' | 'strong' | 'balanced' | 'weak' | 'very_weak';
}

/**
 * Element distribution
 */
export interface ElementDistributionData {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: ElementName;
  weakest: ElementName;
}

/**
 * Useful God info
 */
export interface UsefulGodInfo {
  element: ElementName;
  chineseName: string;
  reason: string;
}

/**
 * Archetype info
 */
export interface ArchetypeInfo {
  name: string;
  chineseName: string;
  description: string;
  score: number;
}

/**
 * Composite chart summary for dashboard
 */
export interface CompositeChartSummaryData {
  dayMaster: DayMasterInfo;
  elementDistribution: ElementDistributionData;
  usefulGod: UsefulGodInfo;
  archetype: ArchetypeInfo | null;
  coreStrengths: string[];
  growthEdges: string[];
}

// ============================================================================
// LIFECYCLE TYPES
// ============================================================================

/**
 * Lifecycle phase IDs
 */
export type LifecyclePhaseId =
  | 'initiation'
  | 'exploration'
  | 'consolidation'
  | 'deepening'
  | 'transformation'
  | 'integration'
  | 'maturation';

/**
 * Lifecycle phase info
 */
export interface LifecyclePhaseInfo {
  id: LifecyclePhaseId;
  name: string;
  chineseName: string;
  theme: string;
  purpose: string;
  challenge: string;
  gift: string;
  icon: string;
}

/**
 * Lifecycle result for dashboard
 */
export interface LifecycleData {
  currentPhase: LifecyclePhaseInfo;
  currentPhaseScore: number;
  upcomingPhase: LifecyclePhaseInfo | null;
  upcomingPhaseYear: number | null;
  advice: string[];
  progress: number; // 0-100 through current phase
}

// ============================================================================
// EVENT WINDOW TYPES
// ============================================================================

/**
 * Event type
 */
export type EventType =
  | 'relationship'
  | 'commitment'
  | 'growth'
  | 'challenge'
  | 'milestone'
  | 'breakthrough'
  | 'healing'
  | 'transition';

/**
 * Event tier
 */
export type EventTier = 'strong' | 'likely' | 'mild' | 'none';

/**
 * Single event window
 */
export interface EventWindow {
  year: number;
  month?: number;
  quarter?: number;
  type: EventType;
  typeChinese: string;
  score: number;
  tier: EventTier;
  label: string;
  description: string;
  probability: number;
}

/**
 * Composite events for dashboard
 */
export interface CompositeEventsData {
  currentYear: number;
  strongWindows: EventWindow[];
  likelyWindows: EventWindow[];
  mildWindows: EventWindow[];
  nextStrongEvent: EventWindow | null;
  totalEventsNext5Years: number;
}

// ============================================================================
// TRAJECTORY TYPES
// ============================================================================

/**
 * Single point on trajectory curve
 */
export interface TrajectoryPoint {
  t: number;       // Year or age
  score: number;   // 0-100
  label?: string;
}

/**
 * Trajectory curve data
 */
export interface TrajectoryCurveData {
  domain: string;
  domainChinese: string;
  points: TrajectoryPoint[];
  peaks: TrajectoryPoint[];
  valleys: TrajectoryPoint[];
  overallTrend: 'ascending' | 'descending' | 'stable' | 'volatile';
  currentScore: number;
  currentYear: number;
  narrative?: string;
}

/**
 * Multiple trajectory curves
 */
export interface TrajectoryData {
  overall: TrajectoryCurveData;
  relationship?: TrajectoryCurveData;
  wealth?: TrajectoryCurveData;
  career?: TrajectoryCurveData;
  health?: TrajectoryCurveData;
}

// ============================================================================
// DECISION GUIDANCE TYPES
// ============================================================================

/**
 * Decision tier
 */
export type DecisionTier = 'excellent' | 'good' | 'neutral' | 'caution' | 'wait';

/**
 * Decision guidance for dashboard
 */
export interface DecisionGuidanceData {
  overallScore: number;
  tier: DecisionTier;
  currentAdvice: string;
  optimalTiming: string;
  cautions: string[];
}

// ============================================================================
// PARTNER INFO
// ============================================================================

/**
 * Partner information
 */
export interface PartnerInfo {
  name: string;
  birthDate: string;
  dayMasterElement: ElementName;
  dayMasterChinese: string;
}

// ============================================================================
// COMPLETE DASHBOARD DATA
// ============================================================================

/**
 * Complete data for relationship dashboard
 */
export interface RelationshipDashboardData {
  // Partners
  partnerA: PartnerInfo;
  partnerB: PartnerInfo;

  // Core analysis
  synastryHeatmap: SynastryHeatmapData;
  synastrySummary: SynastrySummaryData;
  compositeChart: CompositeChartSummaryData;

  // Lifecycle
  lifecycle: LifecycleData;

  // Timing
  compositeEvents: CompositeEventsData;
  trajectory: TrajectoryData;

  // Guidance
  decision: DecisionGuidanceData;

  // Meta
  generatedAt: Date;
  dataVersion: string;
}

// ============================================================================
// DASHBOARD VIEW OPTIONS
// ============================================================================

/**
 * Dashboard view mode
 */
export type DashboardViewMode = 'overview' | 'detailed' | 'compact';

/**
 * Dashboard section visibility
 */
export interface DashboardSectionVisibility {
  synastry: boolean;
  composite: boolean;
  lifecycle: boolean;
  events: boolean;
  trajectory: boolean;
  guidance: boolean;
}

/**
 * Dashboard options
 */
export interface DashboardOptions {
  viewMode: DashboardViewMode;
  sections: DashboardSectionVisibility;
  showChinese: boolean;
  theme: 'light' | 'dark' | 'celestial';
  animateTransitions: boolean;
}

/**
 * Default dashboard options
 */
export const DEFAULT_DASHBOARD_OPTIONS: DashboardOptions = {
  viewMode: 'overview',
  sections: {
    synastry: true,
    composite: true,
    lifecycle: true,
    events: true,
    trajectory: true,
    guidance: true
  },
  showChinese: true,
  theme: 'light',
  animateTransitions: true
};

// ============================================================================
// CHART CONFIG TYPES
// ============================================================================

/**
 * Heatmap color scale
 */
export interface HeatmapColorScale {
  min: string;      // Color for lowest value
  mid: string;      // Color for middle value
  max: string;      // Color for highest value
  neutral: string;  // Color for zero
}

/**
 * Trajectory chart config
 */
export interface TrajectoryChartConfig {
  width: number;
  height: number;
  showPeaks: boolean;
  showValleys: boolean;
  showCurrentYear: boolean;
  lineColor: string;
  areaFill: boolean;
  areaColor: string;
}

/**
 * Dashboard chart configs
 */
export interface DashboardChartConfigs {
  heatmapColors: HeatmapColorScale;
  trajectoryConfig: TrajectoryChartConfig;
}

/**
 * Default chart configs
 */
export const DEFAULT_CHART_CONFIGS: DashboardChartConfigs = {
  heatmapColors: {
    min: '#ef4444',   // Red for negative
    mid: '#f59e0b',   // Amber for low positive
    max: '#22c55e',   // Green for high positive
    neutral: '#e5e7eb' // Gray for zero
  },
  trajectoryConfig: {
    width: 600,
    height: 200,
    showPeaks: true,
    showValleys: true,
    showCurrentYear: true,
    lineColor: '#6366f1',
    areaFill: true,
    areaColor: 'rgba(99, 102, 241, 0.1)'
  }
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Tier to color mapping
 */
export const TIER_COLORS: Record<EventTier, string> = {
  strong: '#22c55e',
  likely: '#f59e0b',
  mild: '#94a3b8',
  none: '#e5e7eb'
};

/**
 * Decision tier to color mapping
 */
export const DECISION_TIER_COLORS: Record<DecisionTier, string> = {
  excellent: '#22c55e',
  good: '#84cc16',
  neutral: '#f59e0b',
  caution: '#f97316',
  wait: '#ef4444'
};

/**
 * Element to color mapping
 */
export const ELEMENT_COLORS: Record<ElementName, string> = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#94a3b8',
  Water: '#3b82f6'
};

/**
 * Lifecycle phase icons
 */
export const LIFECYCLE_PHASE_ICONS: Record<LifecyclePhaseId, string> = {
  initiation: '🌱',
  exploration: '🔍',
  consolidation: '🏗️',
  deepening: '💎',
  transformation: '🔥',
  integration: '🤝',
  maturation: '🌳'
};
