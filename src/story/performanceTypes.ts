/**
 * Cathedral Performance Engine Types (大教堂性能引擎类型)
 *
 * The forging furnace beneath the cathedral — where raw power becomes
 * effortless flow. A unified system for optimizing speed, caching,
 * throughput, and latency across the entire metaphysics OS.
 *
 * Five Pillars:
 * 1. Multi-Layer Caching System (多层缓存系统)
 * 2. Performance-Optimized Data Structures (性能数据结构)
 * 3. Engine-Level Optimizations (引擎级优化)
 * 4. Orchestration-Level Optimizations (编排级优化)
 * 5. Performance Monitoring & Auto-Tuning (性能监控与自调优)
 */

// ============================================================================
// 🜁 1. MULTI-LAYER CACHING SYSTEM (多层缓存系统)
// ============================================================================

/**
 * Cache layer types
 */
export type CacheLayer =
  | 'input'     // 输入缓存 - Natal charts, composites, synastry
  | 'derived'   // 派生缓存 - Lifecycle, story beats, emotional arcs
  | 'pipeline'  // 流水线缓存 - Full orchestration outputs
  | 'micro';    // 微时缓存 - 15m/5m timing windows

/**
 * Cache entry status
 */
export type CacheStatus =
  | 'fresh'     // Just computed, within TTL
  | 'stale'     // Past TTL but still usable
  | 'expired'   // Must recompute
  | 'invalid';  // Invalidated, must discard

/**
 * A cached value entry
 */
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  layer: CacheLayer;
  createdAt: Date;
  accessedAt: Date;
  expiresAt: Date;
  accessCount: number;
  size: number;              // Approximate bytes
  status: CacheStatus;
  dependencies: string[];    // Keys this depends on
  dependents: string[];      // Keys that depend on this
  metadata: {
    source: string;          // Module that created it
    inputHash: string;       // Hash of inputs
    version: number;
    tags: string[];
  };
}

/**
 * Cache configuration per layer
 */
export interface CacheLayerConfig {
  layer: CacheLayer;
  enabled: boolean;
  maxEntries: number;
  maxSizeBytes: number;
  defaultTTLMs: number;
  staleWhileRevalidate: boolean;
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'adaptive';
  compressionEnabled: boolean;
  persistToDisk: boolean;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  layer: CacheLayer;
  entries: number;
  sizeBytes: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  evictionCount: number;
  staleHitCount: number;
  avgAccessTime: number;
  avgEntryAge: number;
  hotKeys: { key: string; accessCount: number }[];
}

/**
 * Cache operation result
 */
export interface CacheResult<T> {
  hit: boolean;
  value?: T;
  status: CacheStatus;
  fromLayer: CacheLayer;
  computeTime?: number;
  cacheTime?: number;
}

/**
 * Multi-layer cache configuration
 */
export interface MultiLayerCacheConfig {
  layers: CacheLayerConfig[];
  globalMaxSizeBytes: number;
  enableCrossLayerDependencies: boolean;
  enableAdaptiveTTL: boolean;
  cleanupIntervalMs: number;
  statsCollectionEnabled: boolean;
}

/**
 * Default cache layer configurations
 */
export const DEFAULT_CACHE_LAYER_CONFIGS: CacheLayerConfig[] = [
  {
    layer: 'input',
    enabled: true,
    maxEntries: 10000,
    maxSizeBytes: 100 * 1024 * 1024, // 100MB
    defaultTTLMs: 24 * 60 * 60 * 1000, // 24 hours
    staleWhileRevalidate: true,
    evictionPolicy: 'lru',
    compressionEnabled: false,
    persistToDisk: true,
  },
  {
    layer: 'derived',
    enabled: true,
    maxEntries: 50000,
    maxSizeBytes: 200 * 1024 * 1024, // 200MB
    defaultTTLMs: 60 * 60 * 1000, // 1 hour
    staleWhileRevalidate: true,
    evictionPolicy: 'lfu',
    compressionEnabled: true,
    persistToDisk: false,
  },
  {
    layer: 'pipeline',
    enabled: true,
    maxEntries: 5000,
    maxSizeBytes: 500 * 1024 * 1024, // 500MB
    defaultTTLMs: 30 * 60 * 1000, // 30 minutes
    staleWhileRevalidate: true,
    evictionPolicy: 'adaptive',
    compressionEnabled: true,
    persistToDisk: false,
  },
  {
    layer: 'micro',
    enabled: true,
    maxEntries: 100000,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    defaultTTLMs: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: false,
    evictionPolicy: 'fifo',
    compressionEnabled: false,
    persistToDisk: false,
  },
];

// ============================================================================
// 🜂 2. PERFORMANCE-OPTIMIZED DATA STRUCTURES (性能数据结构)
// ============================================================================

/**
 * Precomputed lookup table types
 */
export type LookupTableType =
  | 'heavenlyStems'    // 天干
  | 'earthlyBranches'  // 地支
  | 'tenGods'          // 十神
  | 'shenSha'          // 神煞
  | 'qiMenPalaces'     // 奇门宫位
  | 'fengShuiDirections' // 风水方位
  | 'elementRelations' // 五行关系
  | 'clashRelations'   // 冲关系
  | 'harmRelations'    // 害关系
  | 'punishRelations'; // 刑关系

/**
 * A precomputed lookup table
 */
export interface LookupTable<K = string, V = unknown> {
  type: LookupTableType;
  data: Map<K, V>;
  size: number;
  builtAt: Date;
  version: number;
  frozen: boolean;
}

/**
 * Sparse matrix for heatmaps and grids
 */
export interface SparseMatrix<T = number> {
  rows: number;
  cols: number;
  defaultValue: T;
  data: Map<string, T>; // "row,col" → value
  density: number;      // Percentage of non-default values
}

/**
 * Compressed story graph node
 */
export interface CompressedStoryNode {
  id: number;           // Numeric ID for compression
  type: number;         // Type enum index
  emotionalValue: number;
  transitions: number[]; // IDs of connected nodes
  memoizedPaths?: number[][]; // Precomputed paths from this node
}

/**
 * Compressed story graph
 */
export interface CompressedStoryGraph {
  nodes: CompressedStoryNode[];
  typeIndex: string[];  // Type enum for decompression
  nodeIndex: Map<string, number>; // String ID → numeric ID
  builtAt: Date;
  compressed: boolean;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Immutable timing layer with structural sharing
 */
export interface ImmutableTimingLayer {
  readonly version: number;
  readonly stem: string;
  readonly branch: string;
  readonly element: string;
  readonly score: number;
  readonly factors: ReadonlyArray<{ name: string; value: number }>;
  readonly hash: string;

  // Structural sharing
  withScore(newScore: number): ImmutableTimingLayer;
  withFactor(name: string, value: number): ImmutableTimingLayer;
}

/**
 * Bitmask for clash/harm/punishment detection
 */
export interface RelationBitmask {
  type: 'clash' | 'harm' | 'punishment' | 'destruction';
  mask: number;        // 12-bit mask for branches
  lookup: number[];    // Branch index → related branch indices
}

// ============================================================================
// 🜃 3. ENGINE-LEVEL OPTIMIZATIONS (引擎级优化)
// ============================================================================

/**
 * Engine types that can be optimized
 */
export type OptimizableEngine =
  | 'chart'       // Natal, synastry, composite
  | 'timing'      // All timing layers
  | 'story'       // Beat classification, chapter grouping
  | 'ritual'      // Ritual scoring
  | 'simulation'  // Destiny simulation
  | 'environmental'; // Qi Men, Feng Shui

/**
 * Engine optimization configuration
 */
export interface EngineOptimizationConfig {
  engine: OptimizableEngine;
  enabled: boolean;

  // Precomputation
  precomputeStems: boolean;
  precomputeBranches: boolean;
  precomputeElements: boolean;
  precomputeTenGods: boolean;
  precomputeShenSha: boolean;

  // Memoization
  memoizationEnabled: boolean;
  memoizationMaxEntries: number;

  // Batching
  batchingEnabled: boolean;
  batchSize: number;

  // Streaming
  streamingEnabled: boolean;

  // Lookup tables
  useLookupTables: boolean;
  useBitmasks: boolean;
}

/**
 * Engine optimization metrics
 */
export interface EngineOptimizationMetrics {
  engine: OptimizableEngine;
  precomputeTime: number;
  lookupTableSize: number;
  memoizationHitRate: number;
  avgExecutionTime: number;
  p95ExecutionTime: number;
  p99ExecutionTime: number;
  throughput: number;        // Operations per second
  memoryUsage: number;
}

/**
 * Memoization entry for engine functions
 */
export interface MemoizationEntry<T = unknown> {
  inputHash: string;
  output: T;
  computeTime: number;
  accessCount: number;
  lastAccessed: Date;
}

// ============================================================================
// 🜄 4. ORCHESTRATION-LEVEL OPTIMIZATIONS (编排级优化)
// ============================================================================

/**
 * Orchestration optimization mode
 */
export type OrchestrationOptimizationMode =
  | 'none'          // No optimization
  | 'parallel'      // Parallel execution
  | 'lazy'          // Lazy execution
  | 'shortCircuit'  // Short-circuit on cache hit
  | 'prune'         // Dependency pruning
  | 'full';         // All optimizations

/**
 * Orchestration optimization configuration
 */
export interface OrchestrationOptimizationConfig {
  mode: OrchestrationOptimizationMode;

  // Parallelism
  parallelEnabled: boolean;
  maxParallelism: number;
  parallelThreshold: number;  // Min steps to enable parallelism

  // Lazy execution
  lazyEnabled: boolean;
  lazyThreshold: number;      // Min unused outputs to enable

  // Short-circuiting
  shortCircuitEnabled: boolean;
  shortCircuitOnStale: boolean; // Use stale cache

  // Dependency pruning
  pruningEnabled: boolean;
  pruneUnusedOutputs: boolean;
  pruneUnreachableSteps: boolean;

  // Profiling
  profilingEnabled: boolean;
  profileSampleRate: number;
}

/**
 * Pipeline execution plan
 */
export interface PipelineExecutionPlan {
  pipelineId: string;
  originalSteps: number;
  optimizedSteps: number;
  parallelGroups: ParallelGroup[];
  skippedSteps: string[];
  prunedSteps: string[];
  cacheableSteps: string[];
  estimatedTime: number;
  estimatedParallelTime: number;
  speedup: number;
}

/**
 * A group of steps that can run in parallel
 */
export interface ParallelGroup {
  groupId: string;
  stepIds: string[];
  dependencies: string[];     // Must complete before this group
  estimatedTime: number;
}

/**
 * Pipeline profiling result
 */
export interface PipelineProfile {
  pipelineId: string;
  totalTime: number;
  stepProfiles: StepProfile[];
  criticalPath: string[];
  criticalPathTime: number;
  parallelEfficiency: number;
  cacheHitRate: number;
  bottlenecks: { stepId: string; time: number; reason: string }[];
}

/**
 * Profile of a single step
 */
export interface StepProfile {
  stepId: string;
  executionTime: number;
  waitTime: number;
  cacheHit: boolean;
  memoryUsage: number;
  inputSize: number;
  outputSize: number;
}

// ============================================================================
// 🜅 5. PERFORMANCE MONITORING & AUTO-TUNING (性能监控与自调优)
// ============================================================================

/**
 * Performance metric types
 */
export type PerformanceMetricType =
  | 'latency'
  | 'throughput'
  | 'cacheHitRate'
  | 'memoryUsage'
  | 'cpuUsage'
  | 'errorRate'
  | 'queueDepth';

/**
 * A performance metric data point
 */
export interface PerformanceDataPoint {
  timestamp: Date;
  metric: PerformanceMetricType;
  value: number;
  unit: string;
  source: string;
  tags: Record<string, string>;
}

/**
 * Performance dashboard data
 */
export interface PerformanceDashboard {
  timestamp: Date;

  // Latency
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;

  // Throughput
  requestsPerSecond: number;
  operationsPerSecond: number;

  // Cache
  cacheHitRate: number;
  cacheStats: CacheStats[];

  // Memory
  memoryUsed: number;
  memoryTotal: number;
  memoryPressure: number;

  // Engines
  engineMetrics: EngineOptimizationMetrics[];

  // Hot paths
  hotPaths: { path: string; calls: number; avgTime: number }[];

  // Alerts
  alerts: PerformanceAlert[];
}

/**
 * A performance alert
 */
export interface PerformanceAlert {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  metric: PerformanceMetricType;
  message: string;
  currentValue: number;
  threshold: number;
  source: string;
  acknowledged: boolean;
}

/**
 * Auto-tuning configuration
 */
export interface AutoTuningConfig {
  enabled: boolean;
  tuningInterval: number;

  // What to tune
  tuneCacheTTL: boolean;
  tuneParallelism: boolean;
  tunePrecomputation: boolean;
  tuneBatching: boolean;
  tuneSimulationLimits: boolean;

  // Constraints
  minCacheTTL: number;
  maxCacheTTL: number;
  minParallelism: number;
  maxParallelism: number;
  minBatchSize: number;
  maxBatchSize: number;

  // Targets
  targetLatency: number;
  targetCacheHitRate: number;
  targetMemoryUsage: number;
}

/**
 * Auto-tuning decision
 */
export interface AutoTuningDecision {
  timestamp: Date;
  parameter: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  expectedImprovement: number;
  applied: boolean;
}

/**
 * Adaptive caching configuration
 */
export interface AdaptiveCachingConfig {
  enabled: boolean;
  learningRate: number;
  windowSize: number;           // Time window for learning
  minAccessCount: number;       // Min accesses before adapting
  aggressivenessThreshold: number; // Access rate to cache aggressively
}

/**
 * Predictive prefetching configuration
 */
export interface PredictivePrefetchConfig {
  enabled: boolean;
  maxPrefetchItems: number;
  prefetchAhead: number;        // Time ahead to prefetch (ms)

  // What to prefetch
  prefetchTiming: boolean;      // Tomorrow's timing
  prefetchRitualWindows: boolean; // Next week's windows
  prefetchStoryBeats: boolean;  // Predicted story beats

  // Learning
  usagePatternLearning: boolean;
  patternWindowDays: number;
}

/**
 * Prefetch prediction
 */
export interface PrefetchPrediction {
  key: string;
  layer: CacheLayer;
  predictedAccessTime: Date;
  confidence: number;
  reason: string;
  prefetched: boolean;
  prefetchedAt?: Date;
}

// ============================================================================
// PERFORMANCE RITUALS (性能仪式)
// ============================================================================

/**
 * Performance ritual types
 */
export type PerformanceRitualType =
  | 'purification'   // 净化仪式 - Clear stale caches
  | 'acceleration'   // 加速仪式 - Enable optimizations
  | 'calibration';   // 校准仪式 - Rebalance and rebuild

/**
 * A performance ritual definition
 */
export interface PerformanceRitual {
  type: PerformanceRitualType;
  name: string;
  nameChinese: string;
  description: string;
  steps: PerformanceRitualStep[];
  estimatedDuration: number;
  impact: 'low' | 'medium' | 'high';
  requiresDowntime: boolean;
}

/**
 * A step in a performance ritual
 */
export interface PerformanceRitualStep {
  id: string;
  name: string;
  action: string;
  order: number;
  critical: boolean;
  rollbackable: boolean;
}

/**
 * Performance ritual execution
 */
export interface PerformanceRitualExecution {
  ritualType: PerformanceRitualType;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'rolled_back';
  stepsCompleted: string[];
  stepsFailed: string[];
  beforeMetrics: PerformanceDashboard;
  afterMetrics?: PerformanceDashboard;
  improvement?: {
    latencyReduction: number;
    cacheHitImprovement: number;
    memoryFreed: number;
  };
  initiatedBy: string;
  notes?: string;
}

/**
 * Predefined performance rituals
 */
export const PERFORMANCE_RITUALS: PerformanceRitual[] = [
  {
    type: 'purification',
    name: 'Purification Ritual',
    nameChinese: '净化仪式',
    description: 'Clear stale caches, rebuild precomputed tables, reindex memory',
    steps: [
      { id: 'clear-expired', name: 'Clear Expired Cache', action: 'clearExpiredCache', order: 1, critical: true, rollbackable: false },
      { id: 'clear-stale', name: 'Clear Stale Cache', action: 'clearStaleCache', order: 2, critical: false, rollbackable: false },
      { id: 'rebuild-lookup', name: 'Rebuild Lookup Tables', action: 'rebuildLookupTables', order: 3, critical: true, rollbackable: true },
      { id: 'reindex-memory', name: 'Reindex Memory', action: 'reindexMemory', order: 4, critical: false, rollbackable: true },
      { id: 'compact-storage', name: 'Compact Storage', action: 'compactStorage', order: 5, critical: false, rollbackable: false },
    ],
    estimatedDuration: 30000,
    impact: 'medium',
    requiresDowntime: false,
  },
  {
    type: 'acceleration',
    name: 'Acceleration Ritual',
    nameChinese: '加速仪式',
    description: 'Enable parallelism, prefetching, and memoization for maximum speed',
    steps: [
      { id: 'enable-parallel', name: 'Enable Parallelism', action: 'enableParallelism', order: 1, critical: true, rollbackable: true },
      { id: 'enable-prefetch', name: 'Enable Prefetching', action: 'enablePrefetching', order: 2, critical: false, rollbackable: true },
      { id: 'enable-memo', name: 'Enable Memoization', action: 'enableMemoization', order: 3, critical: true, rollbackable: true },
      { id: 'warmup-cache', name: 'Warm Up Cache', action: 'warmupCache', order: 4, critical: false, rollbackable: false },
      { id: 'optimize-paths', name: 'Optimize Hot Paths', action: 'optimizeHotPaths', order: 5, critical: false, rollbackable: true },
    ],
    estimatedDuration: 60000,
    impact: 'high',
    requiresDowntime: false,
  },
  {
    type: 'calibration',
    name: 'Calibration Ritual',
    nameChinese: '校准仪式',
    description: 'Rebalance weights, recompute patterns, rebuild story graphs',
    steps: [
      { id: 'analyze-usage', name: 'Analyze Usage Patterns', action: 'analyzeUsagePatterns', order: 1, critical: true, rollbackable: false },
      { id: 'rebalance-cache', name: 'Rebalance Cache Weights', action: 'rebalanceCacheWeights', order: 2, critical: true, rollbackable: true },
      { id: 'rebuild-graphs', name: 'Rebuild Story Graphs', action: 'rebuildStoryGraphs', order: 3, critical: false, rollbackable: true },
      { id: 'tune-params', name: 'Tune Parameters', action: 'tuneParameters', order: 4, critical: true, rollbackable: true },
      { id: 'validate', name: 'Validate Performance', action: 'validatePerformance', order: 5, critical: true, rollbackable: false },
    ],
    estimatedDuration: 120000,
    impact: 'high',
    requiresDowntime: false,
  },
];

// ============================================================================
// PERFORMANCE ENGINE STATE
// ============================================================================

/**
 * Complete performance engine state
 */
export interface PerformanceEngineState {
  // Configuration
  cacheConfig: MultiLayerCacheConfig;
  engineConfigs: Map<OptimizableEngine, EngineOptimizationConfig>;
  orchestrationConfig: OrchestrationOptimizationConfig;
  autoTuningConfig: AutoTuningConfig;
  adaptiveCachingConfig: AdaptiveCachingConfig;
  prefetchConfig: PredictivePrefetchConfig;

  // Runtime state
  isRunning: boolean;
  lastTuningRun: Date;
  lastRitualRun: Date;
  activeRitual?: PerformanceRitualExecution;

  // Metrics
  currentDashboard: PerformanceDashboard;
  tuningHistory: AutoTuningDecision[];
  ritualHistory: PerformanceRitualExecution[];

  // Predictions
  activePredictions: PrefetchPrediction[];
}

// ============================================================================
// CHINESE LABELS
// ============================================================================

export const CACHE_LAYER_CHINESE: Record<CacheLayer, string> = {
  input: '输入缓存',
  derived: '派生缓存',
  pipeline: '流水线缓存',
  micro: '微时缓存',
};

export const CACHE_LAYER_DESCRIPTIONS: Record<CacheLayer, string> = {
  input: 'Natal charts, composites, synastry - rarely change',
  derived: 'Lifecycle, story beats, emotional arcs - per composite + date',
  pipeline: 'Full orchestration outputs - dashboard level',
  micro: '15-minute and 5-minute timing windows',
};

export const ENGINE_CHINESE: Record<OptimizableEngine, string> = {
  chart: '图表引擎',
  timing: '时序引擎',
  story: '故事引擎',
  ritual: '仪式引擎',
  simulation: '模拟引擎',
  environmental: '环境引擎',
};

export const RITUAL_TYPE_CHINESE: Record<PerformanceRitualType, string> = {
  purification: '净化仪式',
  acceleration: '加速仪式',
  calibration: '校准仪式',
};

export const RITUAL_TYPE_DESCRIPTIONS: Record<PerformanceRitualType, string> = {
  purification: 'Clear stale caches, rebuild tables, reindex memory',
  acceleration: 'Enable parallelism, prefetching, and memoization',
  calibration: 'Rebalance weights, recompute patterns, rebuild graphs',
};

// ============================================================================
// PERFORMANCE EVENTS
// ============================================================================

/**
 * Performance event types
 */
export type PerformanceEventType =
  | 'cacheHit'
  | 'cacheMiss'
  | 'cacheEviction'
  | 'optimizationApplied'
  | 'tuningDecision'
  | 'alertTriggered'
  | 'ritualStarted'
  | 'ritualCompleted'
  | 'prefetchCompleted'
  | 'thresholdExceeded';

/**
 * A performance event
 */
export interface PerformanceEvent {
  type: PerformanceEventType;
  timestamp: Date;
  source: string;
  data: Record<string, unknown>;
}

/**
 * Performance event listener
 */
export type PerformanceEventListener = (event: PerformanceEvent) => void;
