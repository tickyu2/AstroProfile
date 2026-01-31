/**
 * ============================================================================
 * MICRO-TIMING TYPES (微时序类型)
 * ============================================================================
 *
 * Data model for sub-hourly timing resolution.
 *
 * The Micro-Timing Engine adds the finest temporal layer:
 * - 15-minute segments (96 per day)
 * - 5-minute segments (288 per day, optional)
 *
 * This enables precision timing for:
 * - Best window for important conversations
 * - Avoiding micro-clashes during sensitive moments
 * - Optimal moments for key messages, calls, rituals
 *
 * Timing Hierarchy:
 *   Luck Pillars → Years → Months → Days → Hours → Micro-Segments
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// RESOLUTION TYPES
// ============================================================================

/**
 * Micro-timing resolution
 * - minute15: 96 segments per day (default, recommended)
 * - minute5: 288 segments per day (high precision, optional)
 */
export type MicroResolution = 'minute15' | 'minute5';

/**
 * Context for which the micro-timing is being evaluated
 */
export type MicroContext =
  | 'relationship'
  | 'wealth'
  | 'health'
  | 'action'
  | 'communication'
  | 'creativity'
  | 'rest';

// ============================================================================
// ELEMENT & PILLAR TYPES
// ============================================================================

/**
 * Element name (五行)
 */
export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

/**
 * Micro pillar - derived from hour pillar + segment offset
 */
export interface MicroPillar {
  stem: string;           // 天干
  branch: string;         // 地支
  stemElement: ElementName;
  branchElement: ElementName;
  dominantElement: ElementName;
  stemChinese: string;
  branchChinese: string;
}

// ============================================================================
// MICRO-SEGMENT TYPES
// ============================================================================

/**
 * Quality tier for a micro-segment
 */
export type MicroQualityTier =
  | 'excellent'   // 85-100: Peak window
  | 'good'        // 70-84: Favorable
  | 'neutral'     // 50-69: Average
  | 'caution'     // 30-49: Less favorable
  | 'avoid';      // 0-29: Best to wait

/**
 * Single micro-segment within a day
 */
export interface MicroSegment {
  // Time boundaries
  start: string;          // ISO timestamp
  end: string;            // ISO timestamp
  index: number;          // 0..95 (15-min) or 0..287 (5-min)

  // Derived pillar
  pillar: MicroPillar;

  // Domain scores (0-100)
  relationshipScore: number;
  actionScore: number;
  wealthScore: number;
  healthScore: number;
  communicationScore: number;
  creativityScore: number;
  restScore: number;

  // Overall score (weighted average based on context)
  overallScore: number;
  tier: MicroQualityTier;

  // Insights
  notes: string[];
  warnings: string[];

  // Element interactions
  elementSupport: number;     // How much this segment supports the subject
  elementChallenge: number;   // Any challenging elements present
}

/**
 * Complete micro-timing analysis for a single day
 */
export interface MicroTimingDay {
  // Date info
  date: string;               // YYYY-MM-DD
  resolution: MicroResolution;

  // Day-level context
  dayPillar: {
    stem: string;
    branch: string;
    element: ElementName;
  };

  // All segments
  segments: MicroSegment[];

  // Aggregated insights
  summary: MicroDaySummary;
}

/**
 * Summary of micro-timing for a day
 */
export interface MicroDaySummary {
  // Peak windows
  peakRelationshipWindows: MicroTimeWindow[];
  peakActionWindows: MicroTimeWindow[];
  peakWealthWindows: MicroTimeWindow[];
  peakCommunicationWindows: MicroTimeWindow[];

  // Windows to avoid
  cautionWindows: MicroTimeWindow[];

  // Statistics
  averageRelationshipScore: number;
  averageActionScore: number;
  bestOverallSegmentIndex: number;
  worstOverallSegmentIndex: number;

  // Narrative
  dayNarrative: string;
  dayNarrativeChinese: string;
}

/**
 * A time window (contiguous segments)
 */
export interface MicroTimeWindow {
  startIndex: number;
  endIndex: number;
  startTime: string;
  endTime: string;
  averageScore: number;
  tier: MicroQualityTier;
  context: MicroContext;
  recommendation: string;
  recommendationChinese: string;
}

// ============================================================================
// INPUT/OUTPUT TYPES
// ============================================================================

/**
 * Subject chart data for micro-timing calculation
 */
export interface MicroTimingSubject {
  // Identity
  type: 'individual' | 'composite';
  name?: string;

  // Day Master
  dayMaster: {
    element: ElementName;
    stem: string;
    strengthScore: number;
    strengthCategory: 'very_strong' | 'strong' | 'balanced' | 'weak' | 'very_weak';
  };

  // Useful God (用神)
  usefulGod: {
    element: ElementName;
    supportingElements: ElementName[];
    avoidElements: ElementName[];
  };

  // Element distribution
  elementDistribution: {
    Wood: number;
    Fire: number;
    Earth: number;
    Metal: number;
    Water: number;
  };

  // Optional: Ten Gods emphasis
  tenGodsEmphasis?: {
    dominant: string;
    secondary: string;
  };
}

/**
 * Options for computing micro-timing
 */
export interface ComputeMicroTimingOptions {
  date: string;               // YYYY-MM-DD
  resolution: MicroResolution;
  subject: MicroTimingSubject;
  primaryContext?: MicroContext;  // Weight this context higher
  timezone?: string;          // Default: UTC
  includeNarrative?: boolean; // Generate narrative insights
}

/**
 * Result of micro-timing computation
 */
export interface MicroTimingResult {
  success: boolean;
  data?: MicroTimingDay;
  error?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Micro-timing recommendation
 */
export interface MicroRecommendation {
  context: MicroContext;
  bestWindow: MicroTimeWindow | null;
  alternativeWindows: MicroTimeWindow[];
  avoidWindows: MicroTimeWindow[];
  narrative: string;
  narrativeChinese: string;
}

/**
 * Multi-day micro-timing analysis
 */
export interface MicroTimingWeek {
  startDate: string;
  endDate: string;
  days: MicroTimingDay[];
  bestDayForRelationship: string;
  bestDayForAction: string;
  overallRecommendation: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Segments per resolution
 */
export const SEGMENTS_PER_DAY: Record<MicroResolution, number> = {
  minute15: 96,   // 24 * 4
  minute5: 288    // 24 * 12
};

/**
 * Minutes per segment
 */
export const MINUTES_PER_SEGMENT: Record<MicroResolution, number> = {
  minute15: 15,
  minute5: 5
};

/**
 * Quality tier thresholds
 */
export const TIER_THRESHOLDS: Record<MicroQualityTier, { min: number; max: number }> = {
  excellent: { min: 85, max: 100 },
  good: { min: 70, max: 84 },
  neutral: { min: 50, max: 69 },
  caution: { min: 30, max: 49 },
  avoid: { min: 0, max: 29 }
};

/**
 * Tier colors for UI
 */
export const TIER_COLORS: Record<MicroQualityTier, string> = {
  excellent: '#22c55e',  // Green
  good: '#84cc16',       // Lime
  neutral: '#f59e0b',    // Amber
  caution: '#f97316',    // Orange
  avoid: '#ef4444'       // Red
};

/**
 * Context labels
 */
export const CONTEXT_LABELS: Record<MicroContext, { en: string; zh: string }> = {
  relationship: { en: 'Relationship', zh: '关系' },
  wealth: { en: 'Wealth', zh: '财运' },
  health: { en: 'Health', zh: '健康' },
  action: { en: 'Action', zh: '行动' },
  communication: { en: 'Communication', zh: '沟通' },
  creativity: { en: 'Creativity', zh: '创意' },
  rest: { en: 'Rest', zh: '休息' }
};

/**
 * Element to Chinese mapping
 */
export const ELEMENT_CHINESE: Record<ElementName, string> = {
  Wood: '木',
  Fire: '火',
  Earth: '土',
  Metal: '金',
  Water: '水'
};

