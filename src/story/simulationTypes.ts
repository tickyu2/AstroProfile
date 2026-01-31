/**
 * ============================================================================
 * DESTINY SIMULATION ENGINE - TYPE DEFINITIONS (命运模拟引擎类型)
 * ============================================================================
 *
 * The astral observatory of the cathedral.
 * Types for branching-timeline modeling.
 *
 * Three Simulation Modes:
 * - Choice-Based (选择分支) - "What if I choose X?"
 * - Timing-Based (时机分支) - "What if at different time?"
 * - Path-Based (路径分支) - "What if different relationship path?"
 *
 * This is a metaphysical multiverse generator.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { PredictiveStory, StoryBeat, EmotionalTone } from './storyTypes';
import type { LifecyclePhase } from './ritualTypes';

// ============================================================================
// SIMULATION MODES
// ============================================================================

/**
 * The three simulation modes
 */
export type SimulationMode = 'choice' | 'timing' | 'path';

export const SIMULATION_MODE_CHINESE: Record<SimulationMode, string> = {
  choice: '选择分支',
  timing: '时机分支',
  path: '路径分支'
};

export const SIMULATION_MODE_DESCRIPTIONS: Record<SimulationMode, {
  en: string;
  zh: string;
  question: string;
}> = {
  choice: {
    en: 'Choice-Based Simulation',
    zh: '选择分支模拟',
    question: 'What happens if I choose X?'
  },
  timing: {
    en: 'Timing-Based Simulation',
    zh: '时机分支模拟',
    question: 'What if we do it at a different time?'
  },
  path: {
    en: 'Path-Based Simulation',
    zh: '路径分支模拟',
    question: 'What if we take a different relationship path?'
  }
};

// ============================================================================
// CHOICE TYPES
// ============================================================================

/**
 * Predefined choice categories for simulation
 */
export type ChoiceCategory =
  | 'commitment'    // Commit, propose, dedicate
  | 'delay'         // Wait, pause, postpone
  | 'separation'    // End, distance, divorce
  | 'expansion'     // Open, grow, include
  | 'relocation'    // Move, travel, migrate
  | 'initiation'    // Start, begin, create
  | 'confession'    // Reveal, express, admit
  | 'collaboration' // Partner, merge, join
  | 'healing'       // Reconcile, forgive, repair
  | 'transformation'; // Change, evolve, reinvent

export const CHOICE_CATEGORY_CHINESE: Record<ChoiceCategory, string> = {
  commitment: '承诺',
  delay: '延迟',
  separation: '分离',
  expansion: '扩展',
  relocation: '迁移',
  initiation: '启动',
  confession: '坦白',
  collaboration: '合作',
  healing: '疗愈',
  transformation: '蜕变'
};

export const CHOICE_EXAMPLES: Record<ChoiceCategory, string[]> = {
  commitment: ['Move in together', 'Get engaged', 'Sign contract', 'Make exclusive'],
  delay: ['Wait another year', 'Pause the relationship', 'Postpone decision'],
  separation: ['Break up', 'Take space', 'Divorce', 'End partnership'],
  expansion: ['Open relationship', 'Include new partner', 'Expand business'],
  relocation: ['Move abroad', 'Change cities', 'Long-distance transition'],
  initiation: ['Start a project', 'Have a child', 'Launch business'],
  confession: ['Share feelings', 'Reveal secret', 'Have difficult conversation'],
  collaboration: ['Become business partners', 'Joint venture', 'Merge companies'],
  healing: ['Reconcile', 'Go to therapy', 'Forgive past hurt'],
  transformation: ['Career change', 'Identity shift', 'Major lifestyle change']
};

/**
 * A specific choice to simulate
 */
export interface SimulationChoice {
  id: string;
  category: ChoiceCategory;
  categoryChinese: string;

  // Description of the choice
  description: string;
  descriptionChinese?: string;

  // What this choice modifies
  modifies: {
    lifecycle: boolean;
    timing: boolean;
    environment: boolean;
    composite: boolean;
    story: boolean;
  };

  // Custom parameters
  parameters?: Record<string, unknown>;
}

// ============================================================================
// TIMING OPTIONS
// ============================================================================

/**
 * When to simulate the choice occurring
 */
export type SimulationTiming = 'now' | 'soon' | 'later' | 'specific';

export const SIMULATION_TIMING_CHINESE: Record<SimulationTiming, string> = {
  now: '现在',
  soon: '近期',
  later: '以后',
  specific: '指定时间'
};

export interface TimingWindow {
  timing: SimulationTiming;

  // For 'specific' timing
  specificDate?: string;

  // Relative timing
  monthsFromNow?: number;

  // Seasonal alignment
  preferredSeason?: 'spring' | 'summer' | 'autumn' | 'winter';

  // Element alignment
  preferredElement?: string;
}

// ============================================================================
// PATH OPTIONS
// ============================================================================

/**
 * Alternative relationship paths
 */
export type RelationshipPath =
  | 'romantic'          // Romantic partnership
  | 'friendship'        // Platonic friendship
  | 'business'          // Business partnership
  | 'creative'          // Creative collaboration
  | 'mentorship'        // Mentor-mentee
  | 'open'              // Open/polyamorous
  | 'coparenting'       // Co-parents without romance
  | 'distant_caring';   // Caring from distance

export const RELATIONSHIP_PATH_CHINESE: Record<RelationshipPath, string> = {
  romantic: '浪漫关系',
  friendship: '友谊',
  business: '商业伙伴',
  creative: '创意合作',
  mentorship: '师徒关系',
  open: '开放关系',
  coparenting: '共同抚养',
  distant_caring: '远距关怀'
};

// ============================================================================
// SIMULATION INPUT
// ============================================================================

/**
 * Input for the simulation engine
 */
export interface SimulationInput {
  // Mode
  mode: SimulationMode;

  // The choice being simulated
  choice: SimulationChoice;

  // Timing for the choice
  timing: TimingWindow;

  // Alternative path (for path-based simulation)
  alternativePath?: RelationshipPath;

  // Context data
  context: SimulationContext;

  // Options
  options?: SimulationOptions;
}

export interface SimulationContext {
  // Subject's chart data
  subjectChart: ChartSummary;

  // Partner's chart data (if applicable)
  partnerChart?: ChartSummary;

  // Composite chart data
  compositeChart?: CompositeSummary;

  // Current lifecycle state
  currentLifecycle: {
    phase: LifecyclePhase;
    progress: number;
    destinyCurve: number;
  };

  // Current story state
  currentStory?: PredictiveStory;

  // Environmental context
  environment?: EnvironmentSummary;
}

export interface ChartSummary {
  dayMaster: string;
  dayMasterElement: string;
  usefulGod?: string;
  annoyingGod?: string;
  dominantElement: string;
  currentLuckPillar?: string;
}

export interface CompositeSummary {
  compositeTheme: string;
  synastryScore: number;
  harmonicElements: string[];
  conflictElements: string[];
}

export interface EnvironmentSummary {
  currentYear: string;
  currentMonth: string;
  qiMenDoor?: string;
  fengShuiDirection?: string;
}

export interface SimulationOptions {
  // Number of branches to generate
  branchCount?: number;

  // Include probability estimates
  includeProbability?: boolean;

  // Include story narrative
  includeNarrative?: boolean;

  // Compare against baseline
  compareToBaseline?: boolean;

  // Time horizon for simulation
  yearsAhead?: number;

  // Language preference
  language?: 'en' | 'zh' | 'bilingual';
}

// ============================================================================
// SIMULATED TIMELINE
// ============================================================================

/**
 * A single simulated timeline branch
 */
export interface SimulatedTimeline {
  id: string;
  branchIndex: number;

  // Branch identity
  label: string;
  labelChinese: string;
  description: string;

  // The choice that creates this branch
  choice: SimulationChoice;
  timing: TimingWindow;

  // Modified states
  modifiedLifecycle: ModifiedLifecycle;
  modifiedTimingCurve: ModifiedTimingCurve;
  modifiedEvents: ModifiedEvent[];
  modifiedStory: ModifiedStory;

  // Environmental alignment
  environmentalSupport: number; // 0-100

  // Probability estimate
  probability: number; // 0-1
  probabilityTier: 'high' | 'medium' | 'low';

  // Risks and opportunities
  opportunities: string[];
  risks: string[];

  // Key differences from baseline
  keyDifferences: string[];

  // Narrative summary
  narrativeSummary: string;
  storyBeatLabel: string;
}

export interface ModifiedLifecycle {
  newPhase: LifecyclePhase;
  phaseChinese: string;
  phaseShift: 'accelerated' | 'delayed' | 'redirected' | 'unchanged';
  transitionTiming: string;
  emotionalQuality: EmotionalTone;
}

export interface ModifiedTimingCurve {
  // Curve trajectory
  direction: 'rising' | 'falling' | 'stable' | 'volatile';

  // Peak timing
  peakYear?: number;
  peakMonth?: number;

  // Curve strength (0-100)
  strength: number;

  // Key inflection points
  inflectionPoints: Array<{
    date: string;
    type: 'peak' | 'trough' | 'crossing';
    significance: string;
  }>;

  // Comparison to baseline
  comparedToBaseline: 'stronger' | 'weaker' | 'similar' | 'different_shape';
}

export interface ModifiedEvent {
  originalEventId?: string;
  eventType: string;
  timing: string;
  probability: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface ModifiedStory {
  title: string;
  titleChinese: string;
  arc: string;
  arcChinese: string;

  // Key beats
  keyBeats: Array<{
    id: string;
    type: string;
    timing: string;
    description: string;
  }>;

  // Emotional trajectory
  emotionalTrajectory: Array<{
    timestamp: string;
    tone: EmotionalTone;
    intensity: number;
  }>;

  // Chapter summaries
  chapterSummaries: string[];
}

// ============================================================================
// SIMULATION RESULT
// ============================================================================

/**
 * Complete simulation result
 */
export interface DestinySimulationResult {
  id: string;

  // Input summary
  mode: SimulationMode;
  modeChinese: string;
  choiceSummary: string;

  // Baseline (current trajectory)
  baseline: BaselineTimeline;

  // Simulated branches
  simulations: SimulatedTimeline[];

  // Best branch recommendation
  recommendedBranch: SimulatedTimeline | null;
  recommendationReason: string;

  // Comparison summary
  comparisonSummary: ComparisonSummary;

  // Narrative overview
  narrativeOverview: string;

  // Metadata
  metadata: {
    generatedAt: string;
    version: string;
    yearsSimulated: number;
  };
}

export interface BaselineTimeline {
  label: string;
  labelChinese: string;

  // Current trajectory
  lifecyclePhase: LifecyclePhase;
  lifecyclePhaseChinese: string;
  destinyCurve: number;
  destinyCurveDirection: 'rising' | 'falling' | 'stable';

  // Story summary
  storySummary: string;
  keyBeats: string[];

  // Timeline events
  upcomingEvents: Array<{
    timing: string;
    event: string;
    probability: number;
  }>;
}

export interface ComparisonSummary {
  // Statistical comparison
  bestProbability: {
    branchId: string;
    probability: number;
  };

  bestEnvironmentalSupport: {
    branchId: string;
    support: number;
  };

  // Qualitative comparison
  keyTradeoffs: Array<{
    branchA: string;
    branchB: string;
    tradeoff: string;
  }>;

  // Timing analysis
  timingAnalysis: string;

  // Path analysis
  pathAnalysis?: string;

  // Bottom line
  bottomLine: string;
}

// ============================================================================
// VISUALIZATION DATA
// ============================================================================

/**
 * Data for branch comparison visualization
 */
export interface BranchComparisonData {
  // Branches to compare
  branches: Array<{
    id: string;
    label: string;
    color: string;
    probability: number;
  }>;

  // Timing curve comparison
  timingCurves: Array<{
    branchId: string;
    points: Array<{ x: string; y: number }>;
  }>;

  // Emotional arc comparison
  emotionalArcs: Array<{
    branchId: string;
    points: Array<{ x: string; y: number; tone: EmotionalTone }>;
  }>;

  // Key events timeline
  eventTimeline: Array<{
    branchId: string;
    events: Array<{
      date: string;
      label: string;
      impact: 'positive' | 'negative' | 'neutral';
    }>;
  }>;
}

/**
 * Data for probability wheel visualization
 */
export interface ProbabilityWheelData {
  segments: Array<{
    branchId: string;
    label: string;
    labelChinese: string;
    probability: number;
    color: string;
    startAngle: number;
    endAngle: number;
  }>;

  center: {
    totalBranches: number;
    highestProbability: number;
    recommendedLabel: string;
  };
}

/**
 * Data for timeline fork visualization
 */
export interface TimelineForkData {
  // The fork point
  forkPoint: {
    date: string;
    choice: string;
  };

  // Baseline continuation
  baseline: {
    label: string;
    points: Array<{ date: string; value: number }>;
    endpoint: { label: string; value: number };
  };

  // Branch timelines
  branches: Array<{
    id: string;
    label: string;
    color: string;
    points: Array<{ date: string; value: number }>;
    endpoint: { label: string; value: number };
  }>;
}
