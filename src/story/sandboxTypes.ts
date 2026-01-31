/**
 * Cathedral Simulation Sandbox Types (大教堂沙盒类型)
 *
 * The inner sanctum where new engines are born, tested, refined, and blessed
 * before they enter the living cathedral.
 *
 * A safe, isolated, fully instrumented environment for testing modules,
 * flows, narratives, and orchestration pipelines.
 *
 * Four Chambers:
 * 1. Module Chamber (模块沙盒) - Test single modules in isolation
 * 2. Flow Chamber (流动沙盒) - Test module interactions
 * 3. Orchestration Chamber (编排沙盒) - Test pipelines
 * 4. Narrative Chamber (叙事沙盒) - Test story generation
 */

// ============================================================================
// CORE SANDBOX TYPES
// ============================================================================

/**
 * Sandbox environment state
 */
export type SandboxState =
  | 'idle'        // Ready for use
  | 'running'     // Simulation in progress
  | 'paused'      // Paused mid-simulation
  | 'completed'   // Simulation finished
  | 'error';      // Error occurred

/**
 * Sandbox chamber types
 */
export type SandboxChamber =
  | 'module'        // 模块沙盒
  | 'flow'          // 流动沙盒
  | 'orchestration' // 编排沙盒
  | 'narrative';    // 叙事沙盒

/**
 * A sandbox environment instance
 */
export interface SandboxEnvironment {
  id: string;
  name: string;
  chamber: SandboxChamber;
  state: SandboxState;
  createdAt: Date;
  lastActiveAt: Date;
  config: SandboxConfig;
  memory: SandboxMemory;
  snapshots: SandboxSnapshot[];
  currentSimulation?: SandboxSimulation;
  history: SandboxSimulation[];
}

/**
 * Sandbox configuration
 */
export interface SandboxConfig {
  // Isolation settings
  isolated: boolean;              // Fully isolated from production
  inheritProductionData: boolean; // Copy production data as starting point

  // Instrumentation
  enableTracing: boolean;
  enableProfiling: boolean;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

  // Limits
  maxSimulations: number;
  maxSnapshots: number;
  maxMemoryMB: number;
  timeoutMs: number;

  // Features
  enableMutation: boolean;        // Allow modifying formulas/logic
  enableReplay: boolean;          // Allow replaying simulations
  enableComparison: boolean;      // Allow comparing results

  // Seed for reproducibility
  randomSeed?: number;
}

/**
 * Default sandbox configuration
 */
export const DEFAULT_SANDBOX_CONFIG: SandboxConfig = {
  isolated: true,
  inheritProductionData: false,
  enableTracing: true,
  enableProfiling: true,
  logLevel: 'info',
  maxSimulations: 100,
  maxSnapshots: 50,
  maxMemoryMB: 256,
  timeoutMs: 60000,
  enableMutation: true,
  enableReplay: true,
  enableComparison: true,
};

// ============================================================================
// 🜁 MODULE CHAMBER TYPES (模块沙盒)
// ============================================================================

/**
 * Available modules for sandbox testing
 */
export type SandboxModuleType =
  | 'natalChartEngine'
  | 'synastryEngine'
  | 'compositeChartEngine'
  | 'compositeTimingEngine'
  | 'usefulGodEngine'
  | 'conflictsEngine'
  | 'luckPillarEngine'
  | 'annualLuckEngine'
  | 'monthlyLuckEngine'
  | 'predictiveStoryEngine'
  | 'ritualTimingEngine'
  | 'destinySimulationEngine'
  | 'environmentalEngine'
  | 'qiMenEngine'
  | 'fengShuiEngine'
  | 'memoryEngine'
  | 'storyEngine'
  | 'orchestrationEngine';

/**
 * Module test configuration
 */
export interface ModuleTestConfig {
  moduleType: SandboxModuleType;
  inputs: Record<string, unknown>;
  expectedOutputs?: Record<string, unknown>;
  mutations?: ModuleMutation[];
  iterations?: number;
  compareWithProduction?: boolean;
}

/**
 * A mutation to apply to a module
 */
export interface ModuleMutation {
  id: string;
  name: string;
  description: string;
  target: string;              // Path to the value to mutate
  originalValue: unknown;
  mutatedValue: unknown;
  enabled: boolean;
}

/**
 * Module test result
 */
export interface ModuleTestResult {
  moduleType: SandboxModuleType;
  success: boolean;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  intermediateValues: Record<string, unknown>;
  expectedOutputs?: Record<string, unknown>;
  matchesExpected?: boolean;
  diffs?: ModuleOutputDiff[];
  performance: ModulePerformance;
  mutations: ModuleMutation[];
  errors: SandboxError[];
  warnings: string[];
  trace: SandboxTraceEntry[];
}

/**
 * Difference between expected and actual output
 */
export interface ModuleOutputDiff {
  path: string;
  expected: unknown;
  actual: unknown;
  diffType: 'missing' | 'extra' | 'changed' | 'type_mismatch';
}

/**
 * Module performance metrics
 */
export interface ModulePerformance {
  executionTimeMs: number;
  memoryUsedBytes: number;
  cpuTimeMs?: number;
  callCount: number;
  averageTimeMs: number;
  p95TimeMs: number;
  p99TimeMs: number;
}

// ============================================================================
// 🜂 FLOW CHAMBER TYPES (流动沙盒)
// ============================================================================

/**
 * Flow types for testing
 */
export type SandboxFlowType =
  | 'data'          // Types → Modules → Types
  | 'timing'        // Year → Month → Day → Hour → Micro
  | 'narrative'     // Beats → Chapters → Arcs
  | 'environmental' // Qi Men → Feng Shui → Date Selection
  | 'ritual'        // Timing → Environment → Windows → Actions
  | 'relationship'  // Full relationship forecast
  | 'destiny';      // Full destiny simulation

/**
 * Flow test configuration
 */
export interface FlowTestConfig {
  flowType: SandboxFlowType;
  entryPoint: string;
  inputs: Record<string, unknown>;
  breakpoints?: FlowBreakpoint[];
  mutations?: FlowMutation[];
  maxDepth?: number;
}

/**
 * A breakpoint in the flow
 */
export interface FlowBreakpoint {
  id: string;
  moduleId: string;
  condition?: string;
  action: 'pause' | 'log' | 'snapshot';
}

/**
 * A mutation in the flow
 */
export interface FlowMutation {
  id: string;
  moduleId: string;
  inputMutation?: Record<string, unknown>;
  outputMutation?: Record<string, unknown>;
  skipModule?: boolean;
  replaceWith?: string;
}

/**
 * Flow test result
 */
export interface FlowTestResult {
  flowType: SandboxFlowType;
  success: boolean;
  entryPoint: string;
  finalOutputs: Record<string, unknown>;
  moduleResults: ModuleTestResult[];
  flowPath: FlowPathNode[];
  bottlenecks: string[];
  performance: FlowPerformance;
  mutations: FlowMutation[];
  errors: SandboxError[];
  trace: SandboxTraceEntry[];
}

/**
 * A node in the flow path
 */
export interface FlowPathNode {
  moduleId: string;
  moduleName: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  duration: number;
  order: number;
  children: FlowPathNode[];
}

/**
 * Flow performance metrics
 */
export interface FlowPerformance {
  totalExecutionTimeMs: number;
  totalMemoryUsedBytes: number;
  moduleCount: number;
  criticalPathMs: number;
  parallelizableMs: number;
  bottleneckModules: { moduleId: string; timeMs: number }[];
}

// ============================================================================
// 🜃 ORCHESTRATION CHAMBER TYPES (编排沙盒)
// ============================================================================

/**
 * Pipeline test configuration
 */
export interface PipelineTestConfig {
  pipelineId: string;
  pipelineName: string;
  mode: 'linear' | 'conditional' | 'parallel' | 'recursive';
  steps: PipelineStepConfig[];
  inputs: Record<string, unknown>;
  mutations?: PipelineMutation[];
}

/**
 * A step in the test pipeline
 */
export interface PipelineStepConfig {
  stepId: string;
  stepName: string;
  moduleId: string;
  condition?: string;
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
  timeout?: number;
  retries?: number;
  parallel?: PipelineStepConfig[];
  recursive?: {
    maxDepth: number;
    terminationCondition: string;
  };
}

/**
 * A mutation to the pipeline
 */
export interface PipelineMutation {
  id: string;
  type: 'add_step' | 'remove_step' | 'reorder' | 'modify_condition' | 'add_hook';
  target: string;
  value: unknown;
  description: string;
}

/**
 * Pipeline test result
 */
export interface PipelineTestResult {
  pipelineId: string;
  pipelineName: string;
  success: boolean;
  mode: 'linear' | 'conditional' | 'parallel' | 'recursive';
  stepResults: PipelineStepResult[];
  finalOutputs: Record<string, unknown>;
  performance: PipelinePerformance;
  mutations: PipelineMutation[];
  errors: SandboxError[];
  trace: SandboxTraceEntry[];
}

/**
 * Result of a single pipeline step
 */
export interface PipelineStepResult {
  stepId: string;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  conditionMet?: boolean;
  duration: number;
  retryCount: number;
  parallelResults?: PipelineStepResult[];
  recursiveDepth?: number;
  error?: string;
}

/**
 * Pipeline performance metrics
 */
export interface PipelinePerformance {
  totalExecutionTimeMs: number;
  stepCount: number;
  stepsExecuted: number;
  stepsSkipped: number;
  stepsFailed: number;
  parallelEfficiency: number;  // 0-1, how well parallelization was utilized
  averageStepTimeMs: number;
  longestStepTimeMs: number;
  longestStepId: string;
}

// ============================================================================
// 🜄 NARRATIVE CHAMBER TYPES (叙事沙盒)
// ============================================================================

/**
 * Story generation test configuration
 */
export interface StoryTestConfig {
  templateId?: string;
  inputData: Record<string, unknown>;
  archetypes?: string[];
  emotionalTargets?: EmotionalTarget[];
  chapterCount?: number;
  beatCount?: number;
  variations?: number;         // Generate N variations
  compareTemplates?: string[]; // Compare against other templates
  mutations?: StoryMutation[];
}

/**
 * Emotional target for story
 */
export interface EmotionalTarget {
  position: number;            // 0-1 position in story
  emotion: string;
  intensity: number;           // 0-1
}

/**
 * A mutation to story logic
 */
export interface StoryMutation {
  id: string;
  type: 'archetype' | 'tone' | 'pacing' | 'theme' | 'weaving' | 'grouping';
  target: string;
  value: unknown;
  description: string;
}

/**
 * Story test result
 */
export interface StoryTestResult {
  success: boolean;
  templateId?: string;
  generatedStories: GeneratedStory[];
  comparison?: SandboxStoryComparison;
  bestStory?: GeneratedStory;
  worstStory?: GeneratedStory;
  averageMetrics: StoryMetrics;
  mutations: StoryMutation[];
  errors: SandboxError[];
  trace: SandboxTraceEntry[];
}

/**
 * A generated story
 */
export interface GeneratedStory {
  id: string;
  beats: SandboxStoryBeat[];
  chapters: SandboxStoryChapter[];
  arcs: SandboxStoryArc[];
  emotionalArc: { position: number; value: number }[];
  metrics: StoryMetrics;
  archetypesUsed: string[];
  toneUsed: string;
}

/**
 * A story beat
 */
export interface SandboxStoryBeat {
  id: string;
  type: string;
  content: string;
  emotionalValue: number;
  position: number;
}

/**
 * A story chapter
 */
export interface SandboxStoryChapter {
  id: string;
  type: string;
  title: string;
  beatIds: string[];
  emotionalRange: { min: number; max: number };
}

/**
 * A story arc
 */
export interface SandboxStoryArc {
  id: string;
  type: string;
  chapterIds: string[];
  pattern: string;
}

/**
 * Story quality metrics
 */
export interface StoryMetrics {
  coherenceScore: number;
  emotionalRange: number;
  pacing: number;
  archetypeConsistency: number;
  engagementPrediction: number;
  uniquenessScore: number;
  overallScore: number;
}

/**
 * Comparison between stories
 */
export interface SandboxStoryComparison {
  stories: { id: string; score: number }[];
  bestTemplateId?: string;
  worstTemplateId?: string;
  significantDifferences: {
    aspect: string;
    storyA: unknown;
    storyB: unknown;
    winner: string;
  }[];
}

// ============================================================================
// SANDBOX MEMORY (Ephemeral, Inspectable)
// ============================================================================

/**
 * Sandbox memory - isolated from production
 */
export interface SandboxMemory {
  structural: Map<string, unknown>;
  temporal: Map<string, unknown>;
  narrative: Map<string, unknown>;
  pattern: Map<string, unknown>;

  // Metadata
  size: number;
  lastModified: Date;
  writeCount: number;
  readCount: number;
}

/**
 * Memory diff between two states
 */
export interface SandboxMemoryDiff {
  added: { layer: string; key: string; value: unknown }[];
  removed: { layer: string; key: string; value: unknown }[];
  modified: { layer: string; key: string; oldValue: unknown; newValue: unknown }[];
  unchanged: number;
}

// ============================================================================
// SANDBOX SNAPSHOTS
// ============================================================================

/**
 * A snapshot of sandbox state
 */
export interface SandboxSnapshot {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  state: SandboxState;
  memory: SandboxMemory;
  simulations: SandboxSimulation[];
  mutations: ModuleMutation[];
  config: SandboxConfig;
  size: number;
}

/**
 * Snapshot comparison result
 */
export interface SnapshotComparison {
  snapshotA: string;
  snapshotB: string;
  memoryDiff: SandboxMemoryDiff;
  configDiff: { key: string; a: unknown; b: unknown }[];
  simulationCountDiff: number;
  mutationDiff: {
    added: ModuleMutation[];
    removed: ModuleMutation[];
    modified: { original: ModuleMutation; modified: ModuleMutation }[];
  };
}

// ============================================================================
// SANDBOX SIMULATIONS
// ============================================================================

/**
 * A simulation run in the sandbox
 */
export interface SandboxSimulation {
  id: string;
  name: string;
  chamber: SandboxChamber;
  state: SandboxState;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;

  // Configuration
  config: ModuleTestConfig | FlowTestConfig | PipelineTestConfig | StoryTestConfig;

  // Results
  result?: ModuleTestResult | FlowTestResult | PipelineTestResult | StoryTestResult;

  // Metadata
  tags: string[];
  notes?: string;
  parentSimulationId?: string; // For variations
  reproducible: boolean;
  seed?: number;
}

/**
 * Simulation replay options
 */
export interface SimulationReplayOptions {
  simulationId: string;
  applyMutations?: boolean;
  modifyInputs?: Record<string, unknown>;
  changeRandomSeed?: number;
  pauseAtBreakpoints?: boolean;
}

// ============================================================================
// SANDBOX TRACING & ERRORS
// ============================================================================

/**
 * A trace entry
 */
export interface SandboxTraceEntry {
  timestamp: Date;
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error';
  source: string;
  message: string;
  data?: Record<string, unknown>;
  duration?: number;
  memoryDelta?: number;
}

/**
 * A sandbox error
 */
export interface SandboxError {
  id: string;
  timestamp: Date;
  source: string;
  type: 'validation' | 'execution' | 'timeout' | 'memory' | 'mutation' | 'unknown';
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
}

// ============================================================================
// SANDBOX COMPARISON
// ============================================================================

/**
 * Comparison between two simulation runs
 */
export interface SimulationComparison {
  simulationA: string;
  simulationB: string;
  chamber: SandboxChamber;

  // Output differences
  outputDiffs: {
    path: string;
    valueA: unknown;
    valueB: unknown;
    percentDiff?: number;
  }[];

  // Performance differences
  performanceDiff: {
    executionTimeDiff: number;
    memoryDiff: number;
    throughputDiff: number;
  };

  // Quality differences (for narrative chamber)
  qualityDiff?: {
    metric: string;
    scoreA: number;
    scoreB: number;
    winner: 'A' | 'B' | 'tie';
  }[];

  // Summary
  overallSimilarity: number; // 0-1
  significantDifferences: string[];
  recommendation: string;
}

// ============================================================================
// SYNTHETIC DATA GENERATION
// ============================================================================

/**
 * Configuration for generating synthetic test data
 */
export interface SyntheticDataConfig {
  type: 'chart' | 'timing' | 'story' | 'relationship' | 'ritual';
  count: number;
  constraints?: SyntheticDataConstraints;
  seed?: number;
}

/**
 * Constraints for synthetic data
 */
export interface SyntheticDataConstraints {
  // For charts
  birthDateRange?: { start: Date; end: Date };
  specificElements?: string[];
  dayMasters?: string[];

  // For timing
  dateRange?: { start: Date; end: Date };
  includeClashes?: boolean;
  includeBlessings?: boolean;

  // For stories
  archetypes?: string[];
  tones?: string[];
  emotionalRanges?: { min: number; max: number };

  // For relationships
  compatibilityRange?: { min: number; max: number };
  includeConflicts?: boolean;
}

/**
 * Generated synthetic data
 */
export interface SyntheticData {
  id: string;
  type: SyntheticDataConfig['type'];
  data: unknown;
  constraints: SyntheticDataConstraints;
  seed: number;
  generatedAt: Date;
}

// ============================================================================
// SANDBOX UI STATE
// ============================================================================

/**
 * The Alchemist's Table UI state
 */
export interface AlchemistTableState {
  activeChamber: SandboxChamber;
  activeEnvironment?: string;

  // Panel states
  modulePanel: ModulePanelState;
  flowPanel: FlowPanelState;
  orchestrationPanel: OrchestrationPanelState;
  storyPanel: StoryPanelState;

  // Shared state
  memoryViewer: MemoryViewerState;
  traceViewer: TraceViewerState;
  comparisonViewer: ComparisonViewerState;
}

/**
 * Module panel state
 */
export interface ModulePanelState {
  selectedModule?: SandboxModuleType;
  testConfig?: ModuleTestConfig;
  lastResult?: ModuleTestResult;
  mutations: ModuleMutation[];
  showIntermediates: boolean;
  showPerformance: boolean;
}

/**
 * Flow panel state
 */
export interface FlowPanelState {
  selectedFlow?: SandboxFlowType;
  testConfig?: FlowTestConfig;
  lastResult?: FlowTestResult;
  breakpoints: FlowBreakpoint[];
  visualizationMode: 'graph' | 'timeline' | 'tree';
}

/**
 * Orchestration panel state
 */
export interface OrchestrationPanelState {
  testConfig?: PipelineTestConfig;
  lastResult?: PipelineTestResult;
  mutations: PipelineMutation[];
  viewMode: 'steps' | 'timeline' | 'diagram';
}

/**
 * Story panel state
 */
export interface StoryPanelState {
  testConfig?: StoryTestConfig;
  lastResult?: StoryTestResult;
  selectedStoryId?: string;
  comparisonMode: boolean;
  showEmotionalArc: boolean;
}

/**
 * Memory viewer state
 */
export interface MemoryViewerState {
  selectedLayer?: 'structural' | 'temporal' | 'narrative' | 'pattern';
  searchQuery?: string;
  showDiff: boolean;
  compareSnapshotId?: string;
}

/**
 * Trace viewer state
 */
export interface TraceViewerState {
  filterLevel: SandboxTraceEntry['level'] | 'all';
  filterSource?: string;
  searchQuery?: string;
  autoScroll: boolean;
  showTimestamps: boolean;
}

/**
 * Comparison viewer state
 */
export interface ComparisonViewerState {
  mode: 'simulations' | 'snapshots' | 'production';
  itemA?: string;
  itemB?: string;
  comparison?: SimulationComparison | SnapshotComparison;
}

// ============================================================================
// SANDBOX EVENTS
// ============================================================================

/**
 * Sandbox event types
 */
export type SandboxEventType =
  | 'environmentCreated'
  | 'environmentDestroyed'
  | 'simulationStarted'
  | 'simulationCompleted'
  | 'simulationFailed'
  | 'breakpointHit'
  | 'snapshotCreated'
  | 'snapshotRestored'
  | 'mutationApplied'
  | 'memoryModified'
  | 'traceLogged';

/**
 * A sandbox event
 */
export interface SandboxEvent {
  type: SandboxEventType;
  timestamp: Date;
  environmentId: string;
  data: Record<string, unknown>;
}

/**
 * Sandbox event listener
 */
export type SandboxEventListener = (event: SandboxEvent) => void;

// ============================================================================
// CHINESE LABELS
// ============================================================================

export const SANDBOX_CHAMBER_CHINESE: Record<SandboxChamber, string> = {
  module: '模块沙盒',
  flow: '流动沙盒',
  orchestration: '编排沙盒',
  narrative: '叙事沙盒',
};

export const SANDBOX_CHAMBER_DESCRIPTIONS: Record<SandboxChamber, string> = {
  module: 'Test single modules in isolation',
  flow: 'Test how modules interact in flows',
  orchestration: 'Test orchestration pipelines',
  narrative: 'Test story generation and templates',
};

export const SANDBOX_STATE_CHINESE: Record<SandboxState, string> = {
  idle: '就绪',
  running: '运行中',
  paused: '已暂停',
  completed: '已完成',
  error: '错误',
};

export const SANDBOX_MODULE_CHINESE: Partial<Record<SandboxModuleType, string>> = {
  natalChartEngine: '本命引擎',
  synastryEngine: '合盘引擎',
  compositeChartEngine: '组合盘引擎',
  compositeTimingEngine: '复合时序引擎',
  usefulGodEngine: '用神引擎',
  conflictsEngine: '冲害刑破引擎',
  luckPillarEngine: '大运引擎',
  annualLuckEngine: '流年引擎',
  monthlyLuckEngine: '流月引擎',
  predictiveStoryEngine: '预测故事引擎',
  ritualTimingEngine: '仪式时序引擎',
  destinySimulationEngine: '命运模拟引擎',
  environmentalEngine: '环境引擎',
  qiMenEngine: '奇门引擎',
  fengShuiEngine: '风水引擎',
  memoryEngine: '记忆引擎',
  storyEngine: '故事引擎',
  orchestrationEngine: '编排引擎',
};
