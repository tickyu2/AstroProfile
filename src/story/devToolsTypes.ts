/**
 * Cathedral DevTools Types (大教堂开发工具类型)
 *
 * The ritual instruments for debugging destiny, inspecting story flows,
 * tracing timing pipelines, and visualizing the cathedral's internal architecture.
 *
 * Seven Pillars:
 * 1. Module Debugger (模块调试器) - Real-time engine inspection
 * 2. Flow Inspector (流动检查器) - Data flow visualization
 * 3. Knowledge Graph Explorer (知识图谱浏览器) - Graph navigation
 * 4. Timing Analyzer (时序分析器) - Timing layer inspection
 * 5. Story & Ritual Debugger (故事与仪式调试器) - Narrative inspection
 * 6. DevTools Console (开发者控制台) - Unified logging
 * 7. DevTools UI (建筑师之室) - The Architect's Chamber
 */

// ============================================================================
// 🜁 1. MODULE DEBUGGER TYPES (模块调试器)
// ============================================================================

/**
 * Debug log levels
 */
export type DebugLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Breakpoint types for step-through debugging
 */
export type BreakpointType =
  | 'module'      // Break on specific module
  | 'type'        // Break on data type
  | 'flow'        // Break on flow transition
  | 'event'       // Break on event trigger
  | 'lifecycle'   // Break on lifecycle change
  | 'timing'      // Break on timing calculation
  | 'story'       // Break on story transformation
  | 'ritual';     // Break on ritual evaluation

/**
 * A breakpoint definition
 */
export interface DebugBreakpoint {
  id: string;
  type: BreakpointType;
  target: string;               // Module name, type name, flow ID, etc.
  condition?: string;           // Optional condition expression
  enabled: boolean;
  hitCount: number;
  description?: string;
}

/**
 * Debug session state
 */
export type DebugSessionState =
  | 'inactive'
  | 'running'
  | 'paused'
  | 'stepping'
  | 'completed';

/**
 * A debug session
 */
export interface DebugSession {
  id: string;
  state: DebugSessionState;
  startedAt: Date;
  pausedAt?: Date;
  currentBreakpoint?: DebugBreakpoint;
  breakpoints: DebugBreakpoint[];
  callStack: DebugStackFrame[];
  watchedValues: WatchedValue[];
  logs: DebugLogEntry[];
}

/**
 * A stack frame in the debug call stack
 */
export interface DebugStackFrame {
  id: string;
  moduleName: string;
  functionName: string;
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  intermediateValues: Record<string, unknown>;
  timestamp: Date;
  duration?: number;            // ms
  children: DebugStackFrame[];
}

/**
 * A watched value in the debugger
 */
export interface WatchedValue {
  id: string;
  expression: string;
  value: unknown;
  previousValue?: unknown;
  hasChanged: boolean;
  type: string;
}

/**
 * A debug log entry
 */
export interface DebugLogEntry {
  id: string;
  timestamp: Date;
  level: DebugLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
  stackFrame?: string;
}

/**
 * Module debug info - what the debugger reveals
 */
export interface ModuleDebugInfo {
  moduleName: string;
  moduleType: string;
  inputs: Record<string, { type: string; value: unknown }>;
  outputs: Record<string, { type: string; value: unknown }>;
  intermediateValues: Record<string, { step: number; value: unknown }>;
  calculationPipeline: CalculationStep[];
  timingLayers: TimingLayerDebug[];
  eventTriggers: EventTriggerDebug[];
  lifecycleTransitions: LifecycleTransitionDebug[];
  storyTransformations: StoryTransformationDebug[];
  duration: number;
  memoryUsage: number;
}

/**
 * A calculation step in a module pipeline
 */
export interface CalculationStep {
  stepNumber: number;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  duration: number;
  formula?: string;             // Optional formula display
}

/**
 * Timing layer debug info
 */
export interface TimingLayerDebug {
  layer: 'year' | 'month' | 'day' | 'hour' | 'micro';
  stem?: string;
  branch?: string;
  element?: string;
  score: number;
  factors: { name: string; value: number; reason: string }[];
}

/**
 * Event trigger debug info
 */
export interface EventTriggerDebug {
  eventType: string;
  triggered: boolean;
  conditions: { name: string; met: boolean; value: unknown }[];
  timestamp?: Date;
}

/**
 * Lifecycle transition debug info
 */
export interface LifecycleTransitionDebug {
  from: string;
  to: string;
  reason: string;
  timestamp: Date;
  score: number;
}

/**
 * Story transformation debug info
 */
export interface StoryTransformationDebug {
  inputBeat: string;
  outputBeat: string;
  transformationType: string;
  emotionalShift: number;
  arcPosition: number;
}

/**
 * Debug overlay configuration
 */
export interface DebugOverlayConfig {
  enabled: boolean;
  showInputs: boolean;
  showOutputs: boolean;
  showIntermediates: boolean;
  showTiming: boolean;
  showMemory: boolean;
  showDiffs: boolean;
  highlightChanges: boolean;
  compactMode: boolean;
}

/**
 * Expected vs actual diff result
 */
export interface DebugDiff {
  path: string;
  expected: unknown;
  actual: unknown;
  match: boolean;
  diffType: 'missing' | 'extra' | 'changed' | 'type_mismatch';
}

// ============================================================================
// 🜂 2. FLOW INSPECTOR TYPES (流动检查器)
// ============================================================================

/**
 * Flow view types
 */
export type FlowViewType =
  | 'data'        // Types → Modules → Types
  | 'timing'      // Year → Month → Day → Hour → Micro
  | 'narrative'   // Beats → Chapters → Arcs
  | 'environmental' // Qi Men → Feng Shui → Date Selection
  | 'ritual'      // Timing → Environment → Windows → Actions
  | 'orchestration'; // Pipeline flows

/**
 * A flow node in the visualization
 */
export interface FlowNode {
  id: string;
  type: 'module' | 'type' | 'timing' | 'beat' | 'chapter' | 'arc' | 'ritual' | 'environment';
  label: string;
  labelChinese?: string;
  category: string;
  data: Record<string, unknown>;
  position?: { x: number; y: number };
  isBottleneck: boolean;
  isMissing: boolean;
  isCircular: boolean;
  performance?: {
    avgDuration: number;
    callCount: number;
    errorRate: number;
  };
}

/**
 * A flow edge connecting nodes
 */
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  dataType?: string;
  transformations: string[];
  isBottleneck: boolean;
  isMissing: boolean;
  isCircular: boolean;
  weight: number;               // Data volume or importance
}

/**
 * A complete flow graph
 */
export interface FlowGraph {
  viewType: FlowViewType;
  nodes: FlowNode[];
  edges: FlowEdge[];
  bottlenecks: string[];        // Node IDs
  missingDependencies: string[];
  circularFlows: string[][];    // Arrays of node IDs forming cycles
  metadata: {
    totalNodes: number;
    totalEdges: number;
    maxDepth: number;
    generatedAt: Date;
  };
}

/**
 * Flow inspection options
 */
export interface FlowInspectionOptions {
  viewType: FlowViewType;
  rootModule?: string;          // Start from specific module
  depth: number;                // How deep to traverse
  includePerformance: boolean;
  detectBottlenecks: boolean;
  detectMissing: boolean;
  detectCircular: boolean;
  filterByCategory?: string[];
}

/**
 * Flow transformation details (shown on hover)
 */
export interface FlowTransformationDetail {
  edgeId: string;
  sourceType: string;
  targetType: string;
  transformations: {
    step: number;
    operation: string;
    description: string;
    formula?: string;
  }[];
}

// ============================================================================
// 🜃 3. KNOWLEDGE GRAPH EXPLORER TYPES (知识图谱浏览器)
// ============================================================================

/**
 * Knowledge graph view modes
 */
export type GraphViewMode =
  | 'module'      // Module dependencies
  | 'type'        // Type relationships
  | 'flow'        // Data flows
  | 'narrative'   // Story connections
  | 'system';     // Full system view

/**
 * Knowledge graph node types
 */
export type GraphNodeType =
  | 'engine'      // Core engine (natal, synastry, etc.)
  | 'calculator'  // Calculation module
  | 'transformer' // Data transformer
  | 'type'        // Data type
  | 'flow'        // Flow definition
  | 'beat'        // Story beat
  | 'chapter'     // Story chapter
  | 'arc'         // Story arc
  | 'ritual'      // Ritual type
  | 'timing'      // Timing layer
  | 'environment' // Environmental module
  | 'orchestration'; // Pipeline

/**
 * A node in the knowledge graph
 */
export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  labelChinese?: string;
  description?: string;
  category: string;
  module?: string;              // Parent module if applicable
  dependencies: string[];       // IDs of nodes this depends on
  dependents: string[];         // IDs of nodes that depend on this
  narrativeConnections: string[]; // Story/narrative links
  orchestrationPipelines: string[]; // Pipelines using this
  metadata: Record<string, unknown>;
  position?: { x: number; y: number };
  expanded: boolean;
  visible: boolean;
  highlighted: boolean;
}

/**
 * An edge in the knowledge graph
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'dataFlow' | 'narrative' | 'orchestration' | 'inheritance';
  label?: string;
  weight: number;
  bidirectional: boolean;
  metadata: Record<string, unknown>;
}

/**
 * The complete knowledge graph
 */
export interface KnowledgeGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  viewMode: GraphViewMode;
  selectedNodes: Set<string>;
  expandedNodes: Set<string>;
  searchResults: string[];
  layout: GraphLayout;
  metadata: {
    totalNodes: number;
    totalEdges: number;
    lastUpdated: Date;
  };
}

/**
 * Graph layout configuration
 */
export interface GraphLayout {
  type: 'force' | 'hierarchical' | 'circular' | 'grid';
  forceParams?: {
    linkDistance: number;
    chargeStrength: number;
    centerStrength: number;
  };
  hierarchicalParams?: {
    direction: 'TB' | 'BT' | 'LR' | 'RL';
    levelSeparation: number;
    nodeSeparation: number;
  };
}

/**
 * Graph search query
 */
export interface GraphSearchQuery {
  query: string;
  searchType: 'natural' | 'regex' | 'path';
  filters?: {
    nodeTypes?: GraphNodeType[];
    categories?: string[];
    hasNarrativeConnections?: boolean;
    inPipeline?: string;
  };
  limit?: number;
}

/**
 * Graph search result
 */
export interface KnowledgeGraphSearchResult {
  query: GraphSearchQuery;
  matchedNodes: GraphNode[];
  matchedEdges: GraphEdge[];
  paths: GraphNode[][];         // For path queries
  executionTime: number;
}

// ============================================================================
// 🜄 4. TIMING ANALYZER TYPES (时序分析器)
// ============================================================================

/**
 * Timing layer types
 */
export type TimingLayer =
  | 'annual'      // 流年
  | 'monthly'     // 流月
  | 'daily'       // 流日
  | 'hourly'      // 流时
  | 'micro15'     // 15-minute windows
  | 'micro5'      // 5-minute windows
  | 'composite';  // Combined timing

/**
 * Timing analysis result for a specific moment
 */
export interface TimingAnalysis {
  timestamp: Date;
  layers: {
    annual: TimingLayerAnalysis;
    monthly: TimingLayerAnalysis;
    daily: TimingLayerAnalysis;
    hourly: TimingLayerAnalysis;
    micro: TimingLayerAnalysis;
  };
  compositeScore: number;
  usefulGodAlignment: number;
  annoyingGodAvoidance: number;
  eventTriggers: TimingEventTrigger[];
  destinyCurve: DestinyCurvePoint[];
  bestWindows: MicroWindow[];
  warnings: TimingWarning[];
}

/**
 * Analysis of a single timing layer
 */
export interface TimingLayerAnalysis {
  layer: TimingLayer;
  stem: string;
  branch: string;
  element: string;
  score: number;
  breakdown: TimingScoreBreakdown;
  clashes: ClashHarmAnalysis[];
  noblemen: NoblemanAnalysis[];
  stars: StarAnalysis[];
}

/**
 * Breakdown of timing score components
 */
export interface TimingScoreBreakdown {
  baseScore: number;
  elementSupport: number;
  usefulGodBonus: number;
  annoyingGodPenalty: number;
  clashPenalty: number;
  harmPenalty: number;
  punishmentPenalty: number;
  noblemanBonus: number;
  starInfluence: number;
  environmentalModifier: number;
  finalScore: number;
  factors: { name: string; value: number; description: string }[];
}

/**
 * Clash/Harm/Punishment analysis
 */
export interface ClashHarmAnalysis {
  type: 'clash' | 'harm' | 'punishment' | 'destruction';
  typeChinese: '冲' | '害' | '刑' | '破';
  source: string;               // Branch causing it
  target: string;               // Branch affected
  severity: number;             // 0-100
  description: string;
  mitigation?: string;
}

/**
 * Nobleman (贵人) analysis
 */
export interface NoblemanAnalysis {
  type: string;                 // Type of nobleman
  typeChinese: string;
  active: boolean;
  source: string;               // What activates it
  benefit: string;
  score: number;
}

/**
 * Star analysis
 */
export interface StarAnalysis {
  name: string;
  nameChinese: string;
  category: 'auspicious' | 'inauspicious' | 'neutral';
  active: boolean;
  influence: number;
  description: string;
}

/**
 * Timing event trigger
 */
export interface TimingEventTrigger {
  eventType: string;
  triggered: boolean;
  triggerConditions: string[];
  timestamp: Date;
  significance: number;
  description: string;
}

/**
 * Point on the destiny curve
 */
export interface DestinyCurvePoint {
  timestamp: Date;
  score: number;
  trend: 'rising' | 'falling' | 'stable';
  significantEvents: string[];
}

/**
 * Micro timing window
 */
export interface MicroWindow {
  start: Date;
  end: Date;
  score: number;
  qiMenDoor?: string;
  qiMenPalace?: string;
  recommendation: string;
  activities: string[];
}

/**
 * Timing warning
 */
export interface TimingWarning {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  affectedLayers: TimingLayer[];
  mitigation?: string;
}

/**
 * Timing heatmap data
 */
export interface TimingHeatmap {
  startDate: Date;
  endDate: Date;
  granularity: 'hour' | 'day' | 'week' | 'month';
  cells: TimingHeatmapCell[];
  legend: { min: number; max: number; colorScale: string[] };
}

/**
 * A cell in the timing heatmap
 */
export interface TimingHeatmapCell {
  timestamp: Date;
  score: number;
  color: string;
  events: string[];
  tooltip: string;
}

// ============================================================================
// 🜅 5. STORY & RITUAL DEBUGGER TYPES (故事与仪式调试器)
// ============================================================================

/**
 * Story debugger analysis
 */
export interface StoryDebugAnalysis {
  beatAnalysis: BeatDebugInfo[];
  chapterAnalysis: ChapterDebugInfo[];
  arcAnalysis: ArcDebugInfo[];
  emotionalArc: EmotionalArcDebug;
  narrativeTone: NarrativeToneDebug;
  archetypeTransformations: ArchetypeTransformDebug[];
  storyWeavingLogic: StoryWeavingDebug;
}

/**
 * Beat classification debug info
 */
export interface BeatDebugInfo {
  beatId: string;
  beatType: string;
  classification: {
    method: string;
    confidence: number;
    alternatives: { type: string; score: number }[];
  };
  reasons: BeatClassificationReason[];
  timing: {
    score: number;
    dip: boolean;
    dipMagnitude?: number;
  };
  environment: {
    clashes: string[];
    support: string[];
  };
  lifecycle: {
    current: string;
    transition?: string;
  };
}

/**
 * Reason for beat classification
 */
export interface BeatClassificationReason {
  factor: string;
  factorChinese?: string;
  weight: number;
  value: unknown;
  contribution: number;
  description: string;
}

/**
 * Chapter grouping debug info
 */
export interface ChapterDebugInfo {
  chapterId: string;
  chapterType: string;
  beats: string[];              // Beat IDs
  groupingLogic: {
    method: string;
    thresholds: Record<string, number>;
    boundaryReasons: string[];
  };
  emotionalRange: { min: number; max: number };
  narrativeCoherence: number;
}

/**
 * Arc analysis debug info
 */
export interface ArcDebugInfo {
  arcId: string;
  arcType: string;
  chapters: string[];           // Chapter IDs
  arcPattern: string;           // e.g., "Hero's Journey", "Transformation"
  patternMatch: number;
  keyMoments: { position: number; type: string; description: string }[];
}

/**
 * Emotional arc debug info
 */
export interface EmotionalArcDebug {
  dataPoints: { position: number; value: number; label: string }[];
  peaks: number[];
  valleys: number[];
  trend: 'ascending' | 'descending' | 'fluctuating' | 'stable';
  emotionalRange: number;
  catharsisMoments: number[];
}

/**
 * Narrative tone debug info
 */
export interface NarrativeToneDebug {
  primaryTone: string;
  secondaryTones: string[];
  toneSelection: {
    factors: { name: string; weight: number; value: unknown }[];
    alternatives: { tone: string; score: number }[];
  };
  toneShifts: { position: number; from: string; to: string; reason: string }[];
}

/**
 * Archetype transformation debug info
 */
export interface ArchetypeTransformDebug {
  fromArchetype: string;
  toArchetype: string;
  transformationType: string;
  triggerConditions: string[];
  progress: number;             // 0-1
  milestones: { name: string; completed: boolean; timestamp?: Date }[];
}

/**
 * Story weaving logic debug
 */
export interface StoryWeavingDebug {
  weavingMethod: string;
  threadCount: number;
  threads: {
    id: string;
    type: string;
    elements: string[];
    weight: number;
  }[];
  intersections: {
    threads: string[];
    position: number;
    type: string;
  }[];
  coherenceScore: number;
}

/**
 * Ritual debugger analysis
 */
export interface RitualDebugAnalysis {
  ritualId: string;
  ritualType: string;
  overallScore: number;
  breakdown: RitualScoreBreakdown;
  environmentalAlignment: EnvironmentalAlignmentDebug;
  directionalGuidance: DirectionalGuidanceDebug;
  qiMenSelection: QiMenSelectionDebug;
  microTimingIntegration: MicroTimingDebug;
  recommendations: RitualRecommendation[];
}

/**
 * Ritual score breakdown
 */
export interface RitualScoreBreakdown {
  timingScore: number;
  environmentalScore: number;
  directionalScore: number;
  qiMenScore: number;
  personalScore: number;        // Based on user's chart
  compositeScore: number;
  factors: { name: string; score: number; weight: number; contribution: number }[];
}

/**
 * Environmental alignment debug
 */
export interface EnvironmentalAlignmentDebug {
  yearSha: { direction: string; active: boolean };
  monthSha: { direction: string; active: boolean };
  daySha: { direction: string; active: boolean };
  fengShuiFactors: { name: string; direction: string; influence: number }[];
  alignmentScore: number;
  warnings: string[];
}

/**
 * Directional guidance debug
 */
export interface DirectionalGuidanceDebug {
  auspiciousDirections: { direction: string; score: number; reason: string }[];
  inauspiciousDirections: { direction: string; score: number; reason: string }[];
  selectedDirection: string;
  selectionReason: string;
}

/**
 * Qi Men selection debug
 */
export interface QiMenSelectionDebug {
  palace: number;
  door: string;
  star: string;
  deity: string;
  score: number;
  selectionLogic: {
    doorScore: number;
    starScore: number;
    deityScore: number;
    palaceScore: number;
    combinedScore: number;
  };
  alternatives: { palace: number; score: number }[];
}

/**
 * Micro timing integration debug
 */
export interface MicroTimingDebug {
  selectedWindow: MicroWindow;
  allWindows: MicroWindow[];
  selectionCriteria: string[];
  optimizationApplied: boolean;
  originalWindow?: MicroWindow;
}

/**
 * Ritual recommendation
 */
export interface RitualRecommendation {
  type: 'do' | 'avoid' | 'consider';
  action: string;
  reason: string;
  priority: number;
}

// ============================================================================
// 🜅 6. DEVTOOLS CONSOLE TYPES (开发者控制台)
// ============================================================================

/**
 * Console log types
 */
export type ConsoleLogType =
  | 'log'
  | 'info'
  | 'warn'
  | 'error'
  | 'trace'
  | 'performance'
  | 'memory'
  | 'pattern'
  | 'orchestration'
  | 'api';

/**
 * A console log entry
 */
export interface ConsoleEntry {
  id: string;
  timestamp: Date;
  type: ConsoleLogType;
  source: string;               // Module or system generating the log
  message: string;
  data?: unknown;
  stackTrace?: string;
  duration?: number;            // For performance logs
  memoryUsage?: number;         // For memory logs
  tags: string[];
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  timestamp: Date;
  moduleName: string;
  operation: string;
  duration: number;             // ms
  memoryBefore: number;
  memoryAfter: number;
  memoryDelta: number;
  cpuUsage?: number;
  callCount: number;
  avgDuration: number;
  p95Duration: number;
  p99Duration: number;
}

/**
 * Memory usage snapshot
 */
export interface MemorySnapshot {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  byModule: Record<string, number>;
  largestObjects: { type: string; size: number; count: number }[];
}

/**
 * Pattern extraction summary (from memory engine)
 */
export interface PatternExtractionSummary {
  timestamp: Date;
  patternsExtracted: number;
  patternTypes: Record<string, number>;
  confidence: number;
  significantPatterns: { pattern: string; confidence: number; frequency: number }[];
}

/**
 * Orchestration trace
 */
export interface OrchestrationTrace {
  pipelineId: string;
  pipelineName: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  steps: OrchestrationStepTrace[];
  totalDuration?: number;
  errors: { step: string; error: string }[];
}

/**
 * A single step in an orchestration trace
 */
export interface OrchestrationStepTrace {
  stepNumber: number;
  stepId: string;
  stepName: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  error?: string;
  children?: OrchestrationStepTrace[];  // For parallel/recursive steps
}

/**
 * API call trace
 */
export interface ApiCallTrace {
  id: string;
  timestamp: Date;
  method: string;
  endpoint: string;
  requestData?: unknown;
  responseData?: unknown;
  statusCode: number;
  duration: number;
  success: boolean;
  error?: string;
  source: string;               // Module that made the call
}

/**
 * Console filter options
 */
export interface ConsoleFilterOptions {
  types?: ConsoleLogType[];
  sources?: string[];
  minLevel?: DebugLevel;
  searchText?: string;
  startTime?: Date;
  endTime?: Date;
  tags?: string[];
}

// ============================================================================
// 🜅 7. DEVTOOLS UI TYPES (建筑师之室)
// ============================================================================

/**
 * DevTools panel types
 */
export type DevToolsPanelType =
  | 'moduleInspector'
  | 'flowExplorer'
  | 'graphViewer'
  | 'timingAnalyzer'
  | 'storyDebugger'
  | 'ritualDebugger'
  | 'orchestrationViewer'
  | 'memoryVaultInspector'
  | 'console';

/**
 * DevTools panel state
 */
export interface DevToolsPanelState {
  type: DevToolsPanelType;
  isOpen: boolean;
  isPinned: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings: Record<string, unknown>;
}

/**
 * DevTools workspace configuration
 */
export interface DevToolsWorkspace {
  id: string;
  name: string;
  panels: DevToolsPanelState[];
  layout: 'tabs' | 'split' | 'floating';
  theme: 'light' | 'dark' | 'system';
  activePanel?: DevToolsPanelType;
  savedAt: Date;
}

/**
 * Module inspector state
 */
export interface ModuleInspectorState {
  selectedModule?: string;
  debugInfo?: ModuleDebugInfo;
  overlayConfig: DebugOverlayConfig;
  expandedSections: string[];
  searchQuery?: string;
}

/**
 * Flow explorer state
 */
export interface FlowExplorerState {
  viewType: FlowViewType;
  graph?: FlowGraph;
  selectedNode?: string;
  hoveredNode?: string;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  showLabels: boolean;
  showPerformance: boolean;
}

/**
 * Graph viewer state
 */
export interface GraphViewerState {
  viewMode: GraphViewMode;
  graph?: KnowledgeGraph;
  searchQuery?: GraphSearchQuery;
  searchResults?: KnowledgeGraphSearchResult;
  layout: GraphLayout;
  selectedNodes: string[];
  expandedNodes: string[];
}

/**
 * Timing analyzer state
 */
export interface TimingAnalyzerState {
  selectedDate?: Date;
  analysis?: TimingAnalysis;
  heatmap?: TimingHeatmap;
  heatmapRange: { start: Date; end: Date };
  granularity: 'hour' | 'day' | 'week' | 'month';
  showEnvironmental: boolean;
  showQiMen: boolean;
}

/**
 * Story debugger state
 */
export interface StoryDebuggerState {
  analysis?: StoryDebugAnalysis;
  selectedBeat?: string;
  selectedChapter?: string;
  expandedSections: string[];
  showEmotionalArc: boolean;
  showArchetypes: boolean;
}

/**
 * Ritual debugger state
 */
export interface RitualDebuggerState {
  analysis?: RitualDebugAnalysis;
  selectedRitual?: string;
  expandedSections: string[];
  showEnvironmental: boolean;
  showQiMen: boolean;
}

/**
 * Orchestration viewer state
 */
export interface OrchestrationViewerState {
  traces: OrchestrationTrace[];
  selectedTrace?: string;
  autoRefresh: boolean;
  refreshInterval: number;
  filterStatus?: 'running' | 'completed' | 'failed';
}

/**
 * Memory vault inspector state
 */
export interface MemoryVaultInspectorState {
  selectedLayer?: 'structural' | 'temporal' | 'narrative' | 'pattern';
  memories: unknown[];
  searchQuery?: string;
  sortBy: 'timestamp' | 'importance' | 'layer';
  sortOrder: 'asc' | 'desc';
}

/**
 * Console state
 */
export interface ConsoleState {
  entries: ConsoleEntry[];
  filter: ConsoleFilterOptions;
  isPaused: boolean;
  maxEntries: number;
  autoScroll: boolean;
}

/**
 * Complete DevTools state
 */
export interface DevToolsState {
  isOpen: boolean;
  workspace: DevToolsWorkspace;
  debugSession?: DebugSession;
  moduleInspector: ModuleInspectorState;
  flowExplorer: FlowExplorerState;
  graphViewer: GraphViewerState;
  timingAnalyzer: TimingAnalyzerState;
  storyDebugger: StoryDebuggerState;
  ritualDebugger: RitualDebuggerState;
  orchestrationViewer: OrchestrationViewerState;
  memoryVaultInspector: MemoryVaultInspectorState;
  console: ConsoleState;
}

// ============================================================================
// DEVTOOLS CONFIGURATION
// ============================================================================

/**
 * DevTools configuration options
 */
export interface DevToolsConfig {
  enabled: boolean;
  autoOpen: boolean;
  persistState: boolean;
  maxLogEntries: number;
  maxTraceHistory: number;
  performanceThreshold: number; // ms - highlight slow operations
  memoryThreshold: number;      // bytes - highlight high memory usage
  defaultWorkspace?: string;
  shortcuts: Record<string, string>;
  integrations: {
    enableReactDevTools: boolean;
    enableReduxDevTools: boolean;
    enableNetworkInspector: boolean;
  };
}

/**
 * Default DevTools configuration
 */
export const DEFAULT_DEVTOOLS_CONFIG: DevToolsConfig = {
  enabled: true,
  autoOpen: false,
  persistState: true,
  maxLogEntries: 10000,
  maxTraceHistory: 100,
  performanceThreshold: 100,
  memoryThreshold: 10 * 1024 * 1024, // 10MB
  shortcuts: {
    toggleDevTools: 'Ctrl+Shift+D',
    openConsole: 'Ctrl+Shift+C',
    openModuleInspector: 'Ctrl+Shift+M',
    openFlowExplorer: 'Ctrl+Shift+F',
    openGraphViewer: 'Ctrl+Shift+G',
    openTimingAnalyzer: 'Ctrl+Shift+T',
    clearConsole: 'Ctrl+L',
    pauseConsole: 'Ctrl+P',
  },
  integrations: {
    enableReactDevTools: true,
    enableReduxDevTools: false,
    enableNetworkInspector: true,
  },
};

// ============================================================================
// DEVTOOLS EVENTS
// ============================================================================

/**
 * DevTools event types
 */
export type DevToolsEventType =
  | 'breakpointHit'
  | 'stepCompleted'
  | 'flowNodeSelected'
  | 'graphNodeSelected'
  | 'timingAnalyzed'
  | 'storyBeatInspected'
  | 'ritualAnalyzed'
  | 'pipelineTraced'
  | 'errorCaught'
  | 'performanceWarning'
  | 'memoryWarning';

/**
 * A DevTools event
 */
export interface DevToolsEvent {
  type: DevToolsEventType;
  timestamp: Date;
  source: string;
  data: Record<string, unknown>;
}

/**
 * DevTools event listener
 */
export type DevToolsEventListener = (event: DevToolsEvent) => void;
