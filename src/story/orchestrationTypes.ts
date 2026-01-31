/**
 * ============================================================================
 * CATHEDRAL ORCHESTRATION LAYER - TYPE DEFINITIONS (大教堂编排层类型)
 * ============================================================================
 *
 * The clockwork beneath the cathedral floor.
 * The hidden machinery that makes the metaphysics OS move on its own.
 *
 * Four Orchestration Modes:
 * - Linear (线性编排) - Sequential steps
 * - Conditional (条件编排) - Branching based on context
 * - Parallel (并行编排) - Simultaneous execution
 * - Recursive (递归编排) - Self-calling for systems
 *
 * This is where your cathedral becomes a living ritual machine.
 *
 * Created: January 2026
 * ============================================================================
 */

import type { LifecyclePhase } from './ritualTypes';
import type { ActionType } from './actionTypes';
import type { EmotionalTone } from './storyTypes';

// ============================================================================
// ORCHESTRATION MODES
// ============================================================================

export type OrchestrationMode = 'linear' | 'conditional' | 'parallel' | 'recursive';

export const ORCHESTRATION_MODE_CHINESE: Record<OrchestrationMode, string> = {
  linear: '线性编排',
  conditional: '条件编排',
  parallel: '并行编排',
  recursive: '递归编排'
};

export const ORCHESTRATION_MODE_DESCRIPTIONS: Record<OrchestrationMode, {
  en: string;
  zh: string;
  useCase: string;
}> = {
  linear: {
    en: 'Linear Pipeline',
    zh: '线性编排',
    useCase: 'Simple sequences: natal → synastry → timing → story'
  },
  conditional: {
    en: 'Conditional Pipeline',
    zh: '条件编排',
    useCase: 'Branching based on lifecycle phase, timing score, etc.'
  },
  parallel: {
    en: 'Parallel Pipeline',
    zh: '并行编排',
    useCase: 'Run timing, environment, and story engines simultaneously'
  },
  recursive: {
    en: 'Recursive Pipeline',
    zh: '递归编排',
    useCase: 'Multi-relationship weaving, generational arcs, team systems'
  }
};

// ============================================================================
// MODULE REGISTRY
// ============================================================================

/**
 * Known module identifiers (from Knowledge Graph)
 */
export type ModuleId =
  // Chart modules
  | 'natalChartEngine'
  | 'synastryEngine'
  | 'compositeChartEngine'
  // Timing modules
  | 'daYunEngine'
  | 'liuNianEngine'
  | 'liuYueEngine'
  | 'liuRiEngine'
  | 'compositeTimingEngine'
  | 'microTimingEngine'
  // Environment modules
  | 'fengShuiEngine'
  | 'qiMenEngine'
  | 'environmentalEngine'
  // Story modules
  | 'storyBeatEngine'
  | 'storyChapterEngine'
  | 'predictiveStoryEngine'
  | 'storyWeavingEngine'
  // Lifecycle modules
  | 'lifecycleEngine'
  | 'eventTriggerEngine'
  | 'trajectoryEngine'
  // Action modules
  | 'ritualTimingEngine'
  | 'simulationEngine'
  | 'fateToActionEngine'
  // Memory modules
  | 'memoryWriteEngine'
  | 'memoryReadEngine'
  | 'patternExtractionEngine'
  | 'predictiveRecallEngine'
  // Utility modules
  | 'validationEngine'
  | 'transformationEngine'
  | 'aggregationEngine';

export const MODULE_CHINESE: Record<ModuleId, string> = {
  natalChartEngine: '本命盘引擎',
  synastryEngine: '合盘引擎',
  compositeChartEngine: '组合盘引擎',
  daYunEngine: '大运引擎',
  liuNianEngine: '流年引擎',
  liuYueEngine: '流月引擎',
  liuRiEngine: '流日引擎',
  compositeTimingEngine: '组合时序引擎',
  microTimingEngine: '微时序引擎',
  fengShuiEngine: '风水引擎',
  qiMenEngine: '奇门引擎',
  environmentalEngine: '环境引擎',
  storyBeatEngine: '节拍引擎',
  storyChapterEngine: '章节引擎',
  predictiveStoryEngine: '预测故事引擎',
  storyWeavingEngine: '故事编织引擎',
  lifecycleEngine: '生命周期引擎',
  eventTriggerEngine: '事件触发引擎',
  trajectoryEngine: '轨迹引擎',
  ritualTimingEngine: '仪式时机引擎',
  simulationEngine: '模拟引擎',
  fateToActionEngine: '命运行动引擎',
  memoryWriteEngine: '记忆写入引擎',
  memoryReadEngine: '记忆读取引擎',
  patternExtractionEngine: '模式提取引擎',
  predictiveRecallEngine: '预测回忆引擎',
  validationEngine: '验证引擎',
  transformationEngine: '转换引擎',
  aggregationEngine: '聚合引擎'
};

// ============================================================================
// ORCHESTRATION CONTEXT
// ============================================================================

/**
 * The shared context passed through pipeline execution
 */
export interface OrchestrationContext {
  // Original inputs
  inputs: Record<string, unknown>;

  // Accumulated outputs from each step
  outputs: Record<string, unknown>;

  // Metadata about the execution
  meta: OrchestrationMeta;

  // Error tracking
  errors: OrchestrationError[];

  // Execution state
  state: OrchestrationState;
}

export interface OrchestrationMeta {
  pipelineId: string;
  pipelineLabel: string;
  startedAt: string;
  completedAt?: string;
  currentStep?: string;
  stepsCompleted: number;
  stepsTotal: number;
  executionMode: OrchestrationMode;
}

export interface OrchestrationState {
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number;           // 0-100
  currentStepId?: string;
  pausedAtStep?: string;
  failedAtStep?: string;
}

export interface OrchestrationError {
  stepId: string;
  module: ModuleId;
  error: string;
  timestamp: string;
  recoverable: boolean;
}

// ============================================================================
// ORCHESTRATION STEP
// ============================================================================

/**
 * A single step in a pipeline
 */
export interface OrchestrationStep {
  id: string;

  // Module to execute
  module: ModuleId;
  moduleChinese?: string;

  // Step label
  label: string;
  labelChinese?: string;

  // Input specification
  input: StepInput;

  // Output key in context.outputs
  outputKey: string;

  // Execution options
  options?: StepOptions;

  // Condition for execution
  condition?: StepCondition;

  // Error handling
  onError?: ErrorHandler;

  // Hooks
  hooks?: StepHooks;
}

/**
 * How to resolve input for a step
 */
export type StepInput =
  | { type: 'static'; value: unknown }
  | { type: 'context'; path: string }
  | { type: 'transform'; source: string; transformer: string }
  | { type: 'merge'; sources: string[] }
  | { type: 'function'; resolver: (ctx: OrchestrationContext) => unknown };

/**
 * Execution options for a step
 */
export interface StepOptions {
  // Timeout in milliseconds
  timeout?: number;

  // Retry configuration
  retry?: {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier?: number;
  };

  // Caching
  cache?: {
    enabled: boolean;
    ttlMs?: number;
    keyGenerator?: (input: unknown) => string;
  };

  // Execution mode
  async?: boolean;

  // Priority (for parallel execution)
  priority?: number;
}

/**
 * Condition for step execution
 */
export type StepCondition =
  | { type: 'always' }
  | { type: 'never' }
  | { type: 'equals'; path: string; value: unknown }
  | { type: 'notEquals'; path: string; value: unknown }
  | { type: 'exists'; path: string }
  | { type: 'notExists'; path: string }
  | { type: 'greaterThan'; path: string; value: number }
  | { type: 'lessThan'; path: string; value: number }
  | { type: 'in'; path: string; values: unknown[] }
  | { type: 'custom'; predicate: (ctx: OrchestrationContext) => boolean };

/**
 * Error handling configuration
 */
export interface ErrorHandler {
  strategy: 'fail' | 'skip' | 'retry' | 'fallback';
  fallbackValue?: unknown;
  fallbackStep?: string;
  logError?: boolean;
  notifyUser?: boolean;
}

/**
 * Hooks for step lifecycle
 */
export interface StepHooks {
  beforeExecute?: (ctx: OrchestrationContext, step: OrchestrationStep) => void | Promise<void>;
  afterExecute?: (ctx: OrchestrationContext, step: OrchestrationStep, result: unknown) => void | Promise<void>;
  onError?: (ctx: OrchestrationContext, step: OrchestrationStep, error: Error) => void | Promise<void>;
}

// ============================================================================
// ORCHESTRATION PIPELINE
// ============================================================================

/**
 * A complete pipeline definition
 */
export interface OrchestrationPipeline {
  id: string;

  // Descriptive info
  label: string;
  labelChinese?: string;
  description?: string;
  descriptionChinese?: string;

  // Execution mode
  mode: OrchestrationMode;

  // Pipeline steps
  steps: OrchestrationStep[];

  // For parallel mode: step groups
  parallelGroups?: ParallelGroup[];

  // For recursive mode: recursion config
  recursionConfig?: RecursionConfig;

  // For conditional mode: branches
  branches?: ConditionalBranch[];

  // Pipeline-level options
  options?: PipelineOptions;

  // Pipeline-level hooks
  hooks?: PipelineHooks;

  // Input schema (for validation)
  inputSchema?: Record<string, InputSchemaField>;

  // Output keys to expose
  outputKeys?: string[];

  // Metadata
  metadata?: {
    version: string;
    author?: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
  };
}

export interface InputSchemaField {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
  required: boolean;
  description?: string;
  default?: unknown;
}

/**
 * Group of steps to execute in parallel
 */
export interface ParallelGroup {
  id: string;
  label: string;
  stepIds: string[];
  waitForAll: boolean;          // Wait for all to complete before continuing
  failOnAny: boolean;           // Fail if any step fails
}

/**
 * Recursion configuration for recursive pipelines
 */
export interface RecursionConfig {
  // Path to collection in context
  collectionPath: string;

  // Max recursion depth
  maxDepth: number;

  // Steps to run for each item
  itemSteps: OrchestrationStep[];

  // How to aggregate results
  aggregation: 'collect' | 'merge' | 'reduce';

  // Reducer function (for 'reduce' mode)
  reducer?: (accumulated: unknown, current: unknown) => unknown;
}

/**
 * Conditional branch definition
 */
export interface ConditionalBranch {
  id: string;
  label: string;
  condition: StepCondition;
  steps: OrchestrationStep[];
  isDefault?: boolean;
}

/**
 * Pipeline-level options
 */
export interface PipelineOptions {
  // Global timeout
  timeout?: number;

  // Execution settings
  stopOnFirstError?: boolean;
  parallelism?: number;           // Max parallel steps

  // Memory integration
  saveToMemory?: boolean;
  memoryEntityType?: 'person' | 'relationship' | 'system';
  memoryEntityIdPath?: string;

  // Pattern extraction
  extractPatterns?: boolean;

  // Logging
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';

  // Scheduling
  schedule?: PipelineSchedule;
}

/**
 * Schedule configuration
 */
export interface PipelineSchedule {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'cron';
  cronExpression?: string;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  enabled: boolean;
}

/**
 * Pipeline-level hooks
 */
export interface PipelineHooks {
  beforePipeline?: (ctx: OrchestrationContext) => void | Promise<void>;
  afterPipeline?: (ctx: OrchestrationContext) => void | Promise<void>;
  onStepComplete?: (ctx: OrchestrationContext, step: OrchestrationStep, result: unknown) => void | Promise<void>;
  onError?: (ctx: OrchestrationContext, error: OrchestrationError) => void | Promise<void>;
  onProgress?: (ctx: OrchestrationContext, progress: number) => void | Promise<void>;
}

// ============================================================================
// ORCHESTRATION RESULT
// ============================================================================

/**
 * Result of pipeline execution
 */
export interface OrchestrationResult {
  success: boolean;

  // Pipeline info
  pipelineId: string;
  pipelineLabel: string;

  // Timing
  startedAt: string;
  completedAt: string;
  durationMs: number;

  // Outputs
  outputs: Record<string, unknown>;

  // Steps executed
  stepsExecuted: StepExecutionRecord[];

  // Errors
  errors: OrchestrationError[];

  // Summary
  summary: {
    totalSteps: number;
    completedSteps: number;
    skippedSteps: number;
    failedSteps: number;
  };

  // Memory integration
  memorySaved?: {
    snapshotIds: string[];
    patternsExtracted: number;
  };
}

export interface StepExecutionRecord {
  stepId: string;
  module: ModuleId;
  status: 'completed' | 'skipped' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  outputKey?: string;
  error?: string;
  skippedReason?: string;
}

// ============================================================================
// PIPELINE TEMPLATES
// ============================================================================

/**
 * Predefined pipeline template IDs
 */
export type PipelineTemplateId =
  | 'relationshipForecast'
  | 'personalStory'
  | 'ritualCalendar'
  | 'destinySimulation'
  | 'multiRelationshipWeaving'
  | 'familySystemAnalysis'
  | 'dailyGuidance'
  | 'monthlyForecast'
  | 'yearlyOverview'
  | 'actionRecommendation';

export const PIPELINE_TEMPLATE_CHINESE: Record<PipelineTemplateId, string> = {
  relationshipForecast: '关系预测',
  personalStory: '个人故事',
  ritualCalendar: '仪式日历',
  destinySimulation: '命运模拟',
  multiRelationshipWeaving: '多关系编织',
  familySystemAnalysis: '家庭系统分析',
  dailyGuidance: '每日指南',
  monthlyForecast: '月度预测',
  yearlyOverview: '年度概览',
  actionRecommendation: '行动建议'
};

export const PIPELINE_TEMPLATE_DESCRIPTIONS: Record<PipelineTemplateId, {
  en: string;
  zh: string;
  mode: OrchestrationMode;
  modules: ModuleId[];
}> = {
  relationshipForecast: {
    en: 'Complete relationship analysis with story and ritual timing',
    zh: '完整的关系分析，包含故事和仪式时机',
    mode: 'linear',
    modules: ['natalChartEngine', 'synastryEngine', 'compositeChartEngine', 'compositeTimingEngine', 'predictiveStoryEngine', 'ritualTimingEngine']
  },
  personalStory: {
    en: 'Individual story generation with lifecycle analysis',
    zh: '个人故事生成与生命周期分析',
    mode: 'linear',
    modules: ['natalChartEngine', 'daYunEngine', 'lifecycleEngine', 'predictiveStoryEngine']
  },
  ritualCalendar: {
    en: 'Monthly ritual timing calendar generation',
    zh: '月度仪式时机日历生成',
    mode: 'linear',
    modules: ['natalChartEngine', 'environmentalEngine', 'ritualTimingEngine']
  },
  destinySimulation: {
    en: 'What-if branching timeline simulation',
    zh: '假设情景分支时间线模拟',
    mode: 'conditional',
    modules: ['natalChartEngine', 'lifecycleEngine', 'simulationEngine']
  },
  multiRelationshipWeaving: {
    en: 'Weave stories across multiple relationships',
    zh: '跨多段关系编织故事',
    mode: 'recursive',
    modules: ['synastryEngine', 'compositeChartEngine', 'storyWeavingEngine']
  },
  familySystemAnalysis: {
    en: 'Generational pattern analysis for family systems',
    zh: '家庭系统的代际模式分析',
    mode: 'recursive',
    modules: ['natalChartEngine', 'patternExtractionEngine']
  },
  dailyGuidance: {
    en: 'Daily action and ritual recommendations',
    zh: '每日行动和仪式建议',
    mode: 'parallel',
    modules: ['microTimingEngine', 'environmentalEngine', 'fateToActionEngine']
  },
  monthlyForecast: {
    en: 'Monthly timing and story forecast',
    zh: '月度时机和故事预测',
    mode: 'linear',
    modules: ['liuYueEngine', 'predictiveStoryEngine', 'ritualTimingEngine']
  },
  yearlyOverview: {
    en: 'Annual destiny overview with major cycles',
    zh: '年度命运概览与主要周期',
    mode: 'linear',
    modules: ['liuNianEngine', 'trajectoryEngine', 'predictiveStoryEngine']
  },
  actionRecommendation: {
    en: 'Contextual action recommendations',
    zh: '情境化行动建议',
    mode: 'conditional',
    modules: ['environmentalEngine', 'lifecycleEngine', 'fateToActionEngine']
  }
};

// ============================================================================
// ORCHESTRATION ENGINE INPUT/OUTPUT
// ============================================================================

/**
 * Input for orchestration engine
 */
export interface OrchestrationEngineInput {
  // Pipeline to run
  pipeline: OrchestrationPipeline | PipelineTemplateId;

  // Input data
  inputs: Record<string, unknown>;

  // Override options
  options?: Partial<PipelineOptions>;

  // Execution control
  control?: {
    dryRun?: boolean;           // Validate without executing
    startFromStep?: string;     // Resume from specific step
    stopAtStep?: string;        // Stop after specific step
    skipSteps?: string[];       // Steps to skip
  };
}

/**
 * Output from orchestration engine
 */
export interface OrchestrationEngineOutput {
  result: OrchestrationResult;

  // Validation (for dry run)
  validation?: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };

  // Introspection
  introspection?: {
    modulesUsed: ModuleId[];
    dataFlows: DataFlow[];
    estimatedDuration?: number;
  };
}

export interface DataFlow {
  from: string;           // Step ID or 'input'
  to: string;             // Step ID or 'output'
  dataKey: string;
  dataType?: string;
}

// ============================================================================
// VISUALIZATION DATA
// ============================================================================

/**
 * Data for pipeline visualization (Procession Map)
 */
export interface PipelineVisualizationData {
  pipelineId: string;
  pipelineLabel: string;
  mode: OrchestrationMode;

  // Nodes (steps)
  nodes: PipelineNode[];

  // Edges (data flows)
  edges: PipelineEdge[];

  // Lanes (for parallel mode)
  lanes?: PipelineLane[];

  // Current execution state (if running)
  execution?: {
    status: OrchestrationState['status'];
    currentNodeId?: string;
    completedNodeIds: string[];
    failedNodeIds: string[];
    progress: number;
  };
}

export interface PipelineNode {
  id: string;
  label: string;
  labelChinese?: string;
  module: ModuleId;
  moduleChinese: string;
  type: 'step' | 'condition' | 'merge' | 'fork' | 'input' | 'output';
  position: { x: number; y: number };
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  isConditional: boolean;
  laneId?: string;
}

export interface PipelineEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  dataKey?: string;
  isConditional: boolean;
  condition?: string;
}

export interface PipelineLane {
  id: string;
  label: string;
  nodeIds: string[];
  color: string;
}

/**
 * Data for execution timeline visualization
 */
export interface ExecutionTimelineData {
  pipelineId: string;
  startedAt: string;
  completedAt?: string;

  // Timeline entries
  entries: Array<{
    stepId: string;
    stepLabel: string;
    module: ModuleId;
    startTime: number;        // Relative ms from pipeline start
    endTime?: number;
    status: 'running' | 'completed' | 'failed' | 'skipped';
    durationMs?: number;
  }>;

  // Current progress
  progress: number;
  estimatedRemaining?: number;
}

