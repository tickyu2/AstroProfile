/**
 * ============================================================================
 * FATE-TO-ACTION ENGINE - TYPE DEFINITIONS (命运行动引擎类型)
 * ============================================================================
 *
 * The walkway from the cathedral into the world.
 * Types for translating metaphysics into behavior.
 *
 * Four Action Archetypes:
 * - Initiate (启动) - Start, propose, begin
 * - Deepen (深化) - Connect, bond, strengthen
 * - Heal (疗愈) - Repair, integrate, reflect
 * - Release (放下) - Close, boundary, let go
 *
 * This is where destiny becomes practice.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { EmotionalTone, BeatType } from './storyTypes';
import type { LifecyclePhase, RitualType, QiMenDoor, DayOfficer } from './ritualTypes';

// ============================================================================
// ACTION ARCHETYPES
// ============================================================================

/**
 * The four fundamental action modes
 */
export type ActionType = 'initiate' | 'deepen' | 'heal' | 'release';

export const ACTION_TYPE_CHINESE: Record<ActionType, string> = {
  initiate: '启动',
  deepen: '深化',
  heal: '疗愈',
  release: '放下'
};

export const ACTION_TYPE_COLORS: Record<ActionType, string> = {
  initiate: '#ef4444',  // Red - Fire
  deepen: '#f59e0b',    // Amber - Earth
  heal: '#3b82f6',      // Blue - Water
  release: '#6b7280'    // Gray - Metal
};

export const ACTION_TYPE_ELEMENTS: Record<ActionType, string[]> = {
  initiate: ['Wood', 'Fire'],
  deepen: ['Earth'],
  heal: ['Water'],
  release: ['Metal']
};

export const ACTION_DESCRIPTIONS: Record<ActionType, {
  en: string;
  zh: string;
  purpose: string;
  keywords: string[];
  avoidWhen: string[];
}> = {
  initiate: {
    en: 'Initiate',
    zh: '启动',
    purpose: 'Start conversations, begin projects, make proposals, take bold steps',
    keywords: ['start', 'begin', 'propose', 'launch', 'bold', 'forward'],
    avoidWhen: ['falling curve', 'Death Door', 'Metal dominance', 'Challenge phase']
  },
  deepen: {
    en: 'Deepen',
    zh: '深化',
    purpose: 'Build intimacy, strengthen bonds, clarify intentions, collaborate',
    keywords: ['connect', 'bond', 'intimacy', 'collaborate', 'share', 'trust'],
    avoidWhen: ['volatile curve', 'Harm Door', 'conflict Shen Sha', 'Turning phase']
  },
  heal: {
    en: 'Heal',
    zh: '疗愈',
    purpose: 'Repair, apologize, integrate, slow down, reflect',
    keywords: ['repair', 'apologize', 'integrate', 'reflect', 'soften', 'patience'],
    avoidWhen: ['rising fast', 'Open Door', 'initiation signals', 'Awakening phase']
  },
  release: {
    en: 'Release',
    zh: '放下',
    purpose: 'Set boundaries, close cycles, let go, redefine roles',
    keywords: ['boundary', 'close', 'let go', 'release', 'end', 'redefine'],
    avoidWhen: ['rising curve', 'Life Door', 'Wood dominance', 'Deepening phase']
  }
};

// ============================================================================
// ACTION SIGNALS
// ============================================================================

/**
 * Signals that inform action classification
 */
export interface ActionSignals {
  // Timing signals
  timing: {
    curveDirection: 'rising' | 'falling' | 'stable' | 'volatile';
    curveValue: number;        // 0-100
    usefulGodActive: boolean;
    annoyingGodActive: boolean;
    dayOfficer: DayOfficer;
  };

  // Story signals
  story: {
    currentBeat: BeatType;
    emotionalTone: EmotionalTone;
    chapterArc: string;
    isClimax: boolean;
    isTurningPoint: boolean;
  };

  // Lifecycle signals
  lifecycle: {
    phase: LifecyclePhase;
    progress: number;          // 0-100 within phase
    trajectoryDirection: 'rising' | 'falling' | 'stable';
  };

  // Environmental signals
  environment: {
    qiMenDoor: QiMenDoor;
    dominantElement: string;
    supportingElements: string[];
    bestDirection: string;
    bestDirectionChinese: string;
    avoidDirection?: string;
    environmentalTier: 'excellent' | 'good' | 'neutral' | 'challenging';
  };

  // Ritual signals
  ritual: {
    activeRitualType: RitualType | null;
    ritualScore: number;
    isRitualWindow: boolean;
  };
}

// ============================================================================
// ACTION STEP
// ============================================================================

/**
 * A single actionable step
 */
export interface ActionStep {
  id: string;

  // Action type
  actionType: ActionType;
  actionTypeChinese: string;

  // Description
  description: string;
  descriptionChinese?: string;

  // Imperative form (what to do)
  imperative: string;
  imperativeChinese?: string;

  // Timing
  timing: {
    start: string;       // ISO datetime
    end: string;         // ISO datetime
    duration: string;    // Human-readable
  };

  // Micro-timing (15-minute precision)
  microWindow?: {
    start: string;       // ISO datetime
    end: string;         // ISO datetime
    quality: 'excellent' | 'good' | 'neutral';
  };

  // Directional guidance
  direction?: {
    best: string;
    bestChinese: string;
    explanation: string;
  };

  // Ritual integration
  ritualType?: RitualType;
  ritualTypeChinese?: string;

  // Confidence and reasoning
  confidence: number;    // 0-100
  confidenceTier: 'high' | 'medium' | 'low';
  reasons: ActionReason[];

  // Contraindications
  cautions: string[];

  // Emotional quality
  emotionalQuality: EmotionalTone;

  // Narrative framing
  narrativeFrame: string;
}

export interface ActionReason {
  factor: string;
  factorChinese: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;        // 0-1
  description: string;
}

// ============================================================================
// ACTION RESULT
// ============================================================================

/**
 * Complete fate-to-action result for a date
 */
export interface FateToActionResult {
  id: string;

  // Query date
  date: string;
  dateChinese: string;

  // Input signals summary
  signalsSummary: {
    timingScore: number;
    storyPhase: string;
    lifecyclePhase: LifecyclePhase;
    environmentalTier: string;
  };

  // Recommended actions (sorted by confidence)
  recommended: ActionStep[];

  // Best action
  bestAction: ActionStep | null;

  // Secondary actions
  secondaryActions: ActionStep[];

  // Actions to avoid
  avoidActions: Array<{
    actionType: ActionType;
    actionTypeChinese: string;
    reason: string;
    confidence: number;
  }>;

  // Daily action summary
  dailySummary: DailyActionSummary;

  // Narrative summary
  narrativeSummary: string;
  narrativeSummaryChinese?: string;

  // Metadata
  metadata: {
    generatedAt: string;
    version: string;
  };
}

/**
 * Summary of actions for a day
 */
export interface DailyActionSummary {
  date: string;
  dateChinese: string;

  // Primary mode for the day
  primaryMode: ActionType;
  primaryModeChinese: string;
  primaryModeConfidence: number;

  // Action distribution
  actionDistribution: Record<ActionType, number>;

  // Key windows
  keyWindows: Array<{
    time: string;
    action: ActionType;
    confidence: number;
  }>;

  // Day theme
  dayTheme: string;
  dayThemeChinese?: string;

  // Simple guidance
  doThis: string[];
  avoidThis: string[];
}

// ============================================================================
// ACTION CALENDAR
// ============================================================================

/**
 * Action calendar for a month
 */
export interface ActionCalendarMonth {
  year: number;
  month: number;
  monthChinese: string;

  days: ActionCalendarDay[];

  // Monthly patterns
  initiateWindows: string[];      // Best dates for initiating
  deepenWindows: string[];        // Best dates for deepening
  healWindows: string[];          // Best dates for healing
  releaseWindows: string[];       // Best dates for releasing

  // Monthly theme
  monthTheme: string;
  monthThemeChinese?: string;
}

export interface ActionCalendarDay {
  date: string;
  dateChinese: string;

  // Primary action for the day
  primaryAction: ActionType;
  primaryActionChinese: string;
  confidence: number;

  // Action scores
  scores: Record<ActionType, number>;

  // Best window
  bestWindow?: {
    start: string;
    end: string;
    action: ActionType;
  };

  // Day quality
  quality: 'excellent' | 'good' | 'neutral' | 'challenging';

  // Quick note
  note: string;
}

// ============================================================================
// ENGINE INPUT
// ============================================================================

/**
 * Input for the fate-to-action engine
 */
export interface ActionEngineInput {
  // Target date
  date: string;

  // Pre-computed signals (if available)
  signals?: Partial<ActionSignals>;

  // Context for personalization
  context?: {
    // Subject's chart summary
    dayMaster?: string;
    usefulGod?: string;
    annoyingGod?: string;

    // Relationship context
    isRelationshipContext?: boolean;
    partnerDayMaster?: string;
    compositeTheme?: string;

    // Current story
    currentStoryId?: string;
    currentChapterId?: string;
    currentBeatId?: string;
  };

  // Options
  options?: ActionEngineOptions;
}

export interface ActionEngineOptions {
  // Include micro-timing
  includeMicroTiming?: boolean;

  // Include directional guidance
  includeDirectional?: boolean;

  // Include ritual integration
  includeRituals?: boolean;

  // Maximum action steps to return
  maxSteps?: number;

  // Confidence threshold
  minConfidence?: number;

  // Language preference
  language?: 'en' | 'zh' | 'bilingual';
}

// ============================================================================
// VISUALIZATION DATA
// ============================================================================

/**
 * Data for action compass visualization
 */
export interface ActionCompassData {
  // Current date
  date: string;

  // Four quadrants
  quadrants: Array<{
    action: ActionType;
    actionChinese: string;
    score: number;
    isActive: boolean;
    color: string;
    angle: number;
  }>;

  // Center highlight
  center: {
    bestAction: ActionType;
    bestActionChinese: string;
    confidence: number;
    direction: string;
    directionChinese: string;
  };

  // Pointer position (0-360 degrees)
  pointerAngle: number;
}

/**
 * Data for micro-timing display
 */
export interface MicroTimingDisplayData {
  date: string;

  // Hour slots
  hourSlots: Array<{
    hour: number;
    quarterSlots: Array<{
      start: string;       // HH:MM
      end: string;         // HH:MM
      action: ActionType;
      quality: 'excellent' | 'good' | 'neutral' | 'avoid';
      isActive: boolean;
    }>;
  }>;

  // Best window highlight
  bestWindow: {
    start: string;
    end: string;
    action: ActionType;
    quality: 'excellent';
  } | null;

  // Avoid windows
  avoidWindows: Array<{
    start: string;
    end: string;
    reason: string;
  }>;
}

/**
 * Data for directional guidance display
 */
export interface DirectionalGuidanceData {
  date: string;

  // Eight directions
  directions: Array<{
    direction: string;
    directionChinese: string;
    degree: number;
    suitability: Record<ActionType, 'excellent' | 'good' | 'neutral' | 'avoid'>;
    specialEnergies: string[];
    isBest: boolean;
    isAvoid: boolean;
  }>;

  // Best direction for today
  todayBest: {
    direction: string;
    directionChinese: string;
    reason: string;
  };

  // Qi Men overlay
  qiMenPalace: number;
  qiMenDoor: QiMenDoor;
  qiMenDoorChinese: string;
}

/**
 * Data for action card UI
 */
export interface ActionCardData {
  action: ActionType;
  actionChinese: string;

  // Current state
  isActive: boolean;
  confidence: number;

  // Best window
  bestWindow: {
    start: string;
    end: string;
  } | null;

  // Direction
  direction: string;
  directionChinese: string;

  // Imperative
  imperative: string;
  imperativeChinese?: string;

  // Reasons
  reasons: string[];

  // Cautions
  cautions: string[];

  // Color
  color: string;
}
