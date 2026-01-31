/**
 * ============================================================================
 * PREDICTIVE STORY ENGINE - BARREL EXPORTS
 * ============================================================================
 *
 * The crown jewel of the cathedral.
 * Transforms structure into living myth.
 *
 * Usage:
 * ```typescript
 * import {
 *   generatePredictiveStory,
 *   generateStoryCard,
 *   generateQuickStory,
 *   transformStory,
 *   getAllTemplates
 * } from '../story';
 *
 * // Generate full story from engine inputs
 * const result = generatePredictiveStory({
 *   timing: daYunWindows,
 *   environment: envSnapshot,
 *   lifecycle: currentPhase,
 *   events: triggers
 * });
 *
 * // Quick generation from simplified input
 * const story = generateQuickStory({
 *   yearlyScores: [{ year: 2025, score: 72 }, ...],
 *   currentPhase: 'Expansion'
 * });
 *
 * // Generate UI card
 * const card = generateStoryCard(story);
 *
 * // Transform into archetypal templates (叙事原型模板)
 * const mythicStory = transformStory(story, 'mythic');     // 神话体
 * const romanticStory = transformStory(story, 'romantic'); // 浪漫体
 * const psychStory = transformStory(story, 'psychological'); // 心理体
 * const cinematicStory = transformStory(story, 'cinematic'); // 电影体
 * const poeticStory = transformStory(story, 'poetic');     // 诗意体
 *
 * // Get all available templates
 * const templates = getAllTemplates();
 * ```
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Beat types
  BeatType,
  EmotionalTone,
  StoryBeat,

  // Chapter types
  ChapterArc,
  EmotionalShift,
  StoryChapter,

  // Story types
  OverallArc,
  PredictiveStory,

  // Input types
  TimingWindow,
  EnvironmentalContext,
  LifecycleContext,
  EventTriggerContext,
  StoryEngineInput,

  // Output types
  StoryResult,
  StoryError,
  StoryEngineResult,

  // Style types
  NarrativeStyle
} from './storyTypes';

export { NARRATIVE_STYLES } from './storyTypes';

// ============================================================================
// STORY BEATS
// ============================================================================

export {
  classifyBeat,
  deriveTone,
  summarizeBeat,
  calculateBeatIntensity,
  buildStoryBeats,
  findPeakBeats,
  findTurningPoints,
  getEmotionalArc,
  calculateBeatTrajectory,
  TONE_CHINESE
} from './storyBeats';

// ============================================================================
// STORY CHAPTERS
// ============================================================================

export {
  deriveChapterArc,
  deriveEmotionalShift,
  deriveChapterTitle,
  extractChapterThemes,
  generateForeshadowing,
  buildChapter,
  groupBeatsIntoChapters,
  findClimaticChapter,
  getChapterAtDate,
  calculateStoryProgression,
  ARC_CHINESE
} from './storyChapters';

// ============================================================================
// STORY NARRATIVE
// ============================================================================

export {
  writeChapterNarrative,
  generatePrologue,
  generateEpilogue,
  generateStoryTitle
} from './storyNarrative';

// ============================================================================
// STORY ENGINE
// ============================================================================

export {
  generatePredictiveStory,
  getStorySummary,
  getCurrentChapterNarrative,
  getUpcomingTurningPoints,
  getTrajectory
} from './storyEngine';

// ============================================================================
// STORY UTILITIES
// ============================================================================

export type {
  StoryCard,
  TimelineSegment,
  QuickStoryInput,
  StoryComparison,
  StoryInsight
} from './storyUtils';

export {
  generateStoryCard,
  generateTimelineData,
  generateQuickStory,
  exportStoryAsMarkdown,
  exportStoryAsJSON,
  compareStories,
  extractStoryInsights
} from './storyUtils';

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export type {
  EmotionalArcPoint,
  EmotionalArcData,
  TimingCurvePoint,
  TrajectoryCurve,
  QiMenPalaceDisplay,
  FengShuiDirectionDisplay,
  EnvironmentalSnapshot,
  EnvironmentalOverlayData,
  StoryDashboardData,
  TimelineBeatMarker,
  TimelineChapterSpan,
  TimelineData,
  DashboardSelection,
  DashboardCallbacks,
  DashboardTheme
} from './storyDashboardTypes';

export { CATHEDRAL_THEME } from './storyDashboardTypes';

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

export {
  StoryDashboard,
  StoryTimeline,
  EmotionalArcChart,
  TimingCurveChart,
  QiMenGrid,
  FengShuiCompass
} from './components';

// ============================================================================
// ARCHETYPAL STORY TEMPLATES (叙事原型模板)
// ============================================================================

export type {
  TemplateStyle,
  TemplateConfig,
  TemplateVocabulary,
  TransformedStory,
  TransformedChapter,
  TransformedBeat
} from './storyTemplates';

export {
  // Template configurations
  TEMPLATE_CONFIGS,
  TEMPLATE_VOCABULARIES,
  TEMPLATE_CHINESE,
  TEMPLATE_DESCRIPTIONS_CHINESE,

  // Main transformation functions
  transformStory,
  transformBeatText,
  transformEnvironmental,
  generateTemplatedNarrative,

  // Utility functions
  getTemplateInfo,
  getAllTemplates
} from './storyTemplates';

// ============================================================================
// MULTI-RELATIONSHIP STORY WEAVING (多关系故事编织)
// ============================================================================

export type {
  // Weaving modes
  WeavingMode,

  // Participant types
  WeavingParticipant,
  ParticipantRole,
  WeavingEdge,
  RelationshipType,

  // Woven beat types
  WovenStoryBeat,
  WovenBeatType,
  BeatPattern,

  // Woven chapter types
  WovenStoryChapter,
  CollectiveArc,

  // Woven story types
  WovenStory,
  WovenTheme,
  SystemicArc,
  SystemicArcType,

  // Engine input/output
  WeavingEngineInput,
  WeavingEngineResult,
  WeavingOptions,
  WeavingError,

  // Visualization data
  WeavingNetworkData,
  WeavingNetworkNode,
  WeavingNetworkEdge,
  CollectiveTimelineData,
  GenerationalLadderData
} from './weavingTypes';

export {
  // Chinese labels
  WEAVING_MODE_CHINESE,
  WOVEN_BEAT_TYPE_CHINESE,
  COLLECTIVE_ARC_CHINESE,
  SYSTEMIC_ARC_TYPE_CHINESE,
  ROLE_CHINESE,
  BEAT_COLORS,

  // Main weaving engine
  weaveStories,

  // Visualization generators
  generateNetworkGraphData,
  generateCollectiveTimelineData,
  generateGenerationalLadderData
} from './storyWeaving';

// ============================================================================
// RITUAL TIMING ENGINE (仪式时机引擎)
// ============================================================================

export type {
  // Ritual types
  RitualType,
  RitualWindow,
  RitualTier,
  RitualFactor,

  // Timing signals
  BaZiTimingSignals,
  DayOfficer,
  ShenShaPresent,

  // Environmental signals
  QiMenSignals,
  QiMenDoor,
  FengShuiSignals,
  RitualEnvironment,

  // Lifecycle signals
  LifecyclePhase,
  LifecycleSignals,

  // Engine input/output
  RitualEngineInput,
  RitualEngineOptions,
  RitualTimingResult,
  DailyRitualSummary,

  // Calendar types
  RitualCalendarMonth,
  RitualCalendarDay,

  // Visualization data
  RitualCompassData,
  RitualCardData
} from './ritualTypes';

export {
  // Chinese labels
  RITUAL_CHINESE,
  RITUAL_TIER_CHINESE,
  DAY_OFFICER_CHINESE,
  QI_MEN_DOOR_CHINESE,
  LIFECYCLE_CHINESE,
  RITUAL_DESCRIPTIONS,

  // Main engine functions
  generateRitualTiming,
  generateRitualCalendar,
  calculateRitualScore,
  scoreTier,

  // Visualization generators
  generateRitualCompassData,
  generateRitualCardData
} from './ritualEngine';

// ============================================================================
// DESTINY SIMULATION ENGINE (命运模拟引擎)
// ============================================================================

export type {
  // Simulation modes
  SimulationMode,
  ChoiceCategory,
  SimulationChoice,

  // Timing types
  SimulationTiming,
  TimingWindow as SimulationTimingWindow,

  // Path types
  RelationshipPath,

  // Input types
  SimulationInput,
  SimulationContext,
  ChartSummary,
  CompositeSummary,
  EnvironmentSummary,
  SimulationOptions,

  // Output types
  SimulatedTimeline,
  ModifiedLifecycle,
  ModifiedTimingCurve,
  ModifiedEvent,
  ModifiedStory,
  DestinySimulationResult,
  BaselineTimeline,
  ComparisonSummary,

  // Visualization data
  BranchComparisonData,
  ProbabilityWheelData,
  TimelineForkData
} from './simulationTypes';

export {
  // Chinese labels
  SIMULATION_MODE_CHINESE,
  SIMULATION_MODE_DESCRIPTIONS,
  CHOICE_CATEGORY_CHINESE,
  CHOICE_EXAMPLES,
  SIMULATION_TIMING_CHINESE,
  RELATIONSHIP_PATH_CHINESE,

  // Main engine function
  simulateDestiny,

  // Visualization generators
  generateBranchComparisonData,
  generateProbabilityWheelData,
  generateTimelineForkData,

  // Utility functions
  computeBaseline,
  generateBranches,
  calculateProbability
} from './simulationEngine';

// ============================================================================
// CATHEDRAL KNOWLEDGE GRAPH (大教堂知识图谱)
// ============================================================================

export type {
  // Node types
  NodeCategory,
  ModuleSubcategory,
  KGNode,

  // Edge types
  EdgeRelation,
  KGEdge,

  // Graph structure
  CathedralKnowledgeGraph,
  GraphLayer,
  NamedSubgraph,

  // Query types
  GraphQueryOptions,
  GraphQueryResult,
  GraphPath,

  // Visualization types
  ForceGraphData,
  ForceGraphNode,
  ForceGraphLink,
  TreeData,
  SankeyData,

  // Inspection types
  NodeInspection,
  ModuleDocumentation,

  // Search types
  GraphSearchResult,
  GraphSearchOptions,

  // Diff types
  GraphDiff
} from './cathedralGraphTypes';

export {
  // Chinese labels
  NODE_CATEGORY_CHINESE,
  NODE_CATEGORY_COLORS,
  NODE_CATEGORY_ICONS,
  MODULE_SUBCATEGORY_CHINESE,
  EDGE_RELATION_CHINESE,
  EDGE_RELATION_COLORS
} from './cathedralGraphTypes';

export {
  // Graph data
  CATHEDRAL_KNOWLEDGE_GRAPH,
  MODULE_NODES,
  TYPE_NODES,
  FLOW_NODES,
  NARRATIVE_NODES,
  UI_NODES,
  ALL_NODES,
  EDGES,
  LAYERS,
  SUBGRAPHS
} from './cathedralGraph';

export {
  // Basic retrieval
  getNode,
  getNodes,
  getEdge,
  getNodesByCategory,
  getEdgesByRelation,
  getSubgraph,
  getSubgraphData,

  // Graph traversal
  getNeighbors,
  getReachable,
  findPath,
  findAllPaths,

  // Query engine
  query,

  // Search
  search,

  // Inspection
  inspect,
  generateModuleDoc,

  // Visualization generators
  generateForceGraphData,
  generateTreeData,
  generateSankeyData,

  // Diff functions
  diffGraphs,

  // Utility functions
  getGraphStats,
  validateGraph
} from './cathedralGraphService';

// ============================================================================
// FATE-TO-ACTION ENGINE (命运行动引擎)
// ============================================================================

export type {
  // Action types
  ActionType,
  ActionSignals,
  ActionStep,
  ActionReason,

  // Result types
  FateToActionResult,
  DailyActionSummary,

  // Calendar types
  ActionCalendarMonth,
  ActionCalendarDay,

  // Input types
  ActionEngineInput,
  ActionEngineOptions,

  // Visualization types
  ActionCompassData,
  MicroTimingDisplayData,
  DirectionalGuidanceData,
  ActionCardData
} from './actionTypes';

export {
  // Chinese labels
  ACTION_TYPE_CHINESE,
  ACTION_TYPE_COLORS,
  ACTION_TYPE_ELEMENTS,
  ACTION_DESCRIPTIONS
} from './actionTypes';

export {
  // Classification
  classifyAction,

  // Step generation
  generateActionSteps,

  // Main engine function
  generateFateToAction,

  // Calendar generation
  generateActionCalendar,

  // Visualization generators
  generateActionCompassData,
  generateMicroTimingData,
  generateDirectionalGuidanceData,
  generateActionCardData
} from './actionEngine';

// ============================================================================
// CATHEDRAL API LAYER (大教堂 API 层)
// ============================================================================

export type {
  // Configuration
  ApiConfig,
  ApiResponse,
  ApiMeta,
  ApiDebug,
  ApiError,
  ApiErrorCode,

  // Input types - Chart
  BirthData,
  NatalChartInput,
  SynastryInput,
  CompositeChartInput,

  // Input types - Timing
  TimingInput,
  CompositeTimingInput,
  MicroTimingInput,
  TrajectoryInput,

  // Input types - Environment
  EnvironmentInput,
  DateSelectionInput,

  // Input types - Story
  StoryInput,
  ArchetypeInput,
  WeavingInput,

  // Input types - Ritual/Simulation/Action
  RitualInput,
  SimulationApiInput,
  ActionApiInput,
  DashboardInput,

  // Output types - Chart
  NatalChartResult,
  SynastryResult,
  CompositeChartResult,

  // Output types - Timing
  TimingLayersResult,
  CompositeTimingResult,
  MicroTimingResult,
  TrajectoryResult,

  // Output types - Environment
  FengShuiResult,
  QiMenResult,
  DateSelectionResult,

  // Output types - Story
  PredictiveStoryResult,
  ArchetypeStoryResult,
  WeavingResult,

  // Output types - Dashboard
  RelationshipDashboardResult,
  StoryDashboardResult,
  RitualDashboardResult,

  // API interface
  CathedralAPI,
  EndpointDefinition
} from './cathedralApiTypes';

export {
  // Configuration
  API_VERSION,
  API_BASE_PATH,
  DEFAULT_API_CONFIG,
  API_ERROR_MESSAGES,
  ENDPOINT_REGISTRY
} from './cathedralApiTypes';

export {
  // API client factory
  createCathedralApi,

  // Default API instance
  cathedralApi,

  // Utilities
  generateRequestId,
  createMeta,
  success,
  error,
  validateBirthData
} from './cathedralApi';

// ============================================================================
// CATHEDRAL MEMORY ENGINE (大教堂记忆引擎)
// ============================================================================

export type {
  // Memory layer types
  MemoryLayer,

  // Master container
  CathedralMemory,
  MemoryMetadata,

  // Structural memory
  StructuralMemory,
  ChartMemory,
  RelationshipMemory,
  SystemMemory,

  // Temporal memory
  TemporalMemory,
  TimingSnapshot,
  EnvironmentalSnapshot as MemoryEnvironmentalSnapshot,
  RitualOutcome,
  DecisionRecord,

  // Narrative memory
  NarrativeMemory,
  StoryBeatRecord,
  StoryChapterRecord,
  EmotionalArcRecord,
  TurningPointRecord,
  SimulationBranchRecord,

  // Pattern memory
  PatternMemory,
  TimingPattern,
  EmotionalPattern,
  RelationshipPattern,
  GenerationalPattern,
  ArchetypePattern,

  // Query types
  MemoryQueryOptions,
  MemoryQueryResult,
  MemoryItem,

  // Extraction types
  PatternExtractionOptions,
  PatternExtractionResult,
  PatternInsight,

  // Prediction types
  PredictiveRecallInput,
  PredictiveRecallResult,
  Prediction,

  // Engine I/O
  MemoryEngineInput,
  MemoryEngineResult,

  // UI Data types
  MemoryTimelineData,
  PatternViewData,
  GenerationalLadderViewData,
  NarrativeArchiveData
} from './memoryTypes';

export {
  // Chinese labels
  MEMORY_LAYER_CHINESE,
  MEMORY_LAYER_DESCRIPTIONS
} from './memoryTypes';

export {
  // Write functions
  saveChart,
  saveRelationship,
  saveSystem,
  saveTimingSnapshot,
  saveEnvironmentalSnapshot,
  saveRitualOutcome,
  saveDecision,
  saveStoryBeat,
  saveStoryChapter,
  saveEmotionalArc,
  saveTurningPoint,
  saveSimulationBranch,

  // Read functions
  getMemory,
  getChart,
  getChartsByPerson,
  getRelationship,
  getRelationshipsByPerson,
  getTimingHistory,
  getStoryHistory,
  getPatternHistory,
  queryMemory,

  // Pattern extraction
  extractPatterns,

  // Predictive recall
  predictiveRecall,

  // Visualization generators
  generateMemoryTimelineData,
  generatePatternViewData,
  generateGenerationalLadderData as generateMemoryGenerationalLadderData,
  generateNarrativeArchiveData,

  // Memory management
  clearMemory,
  importMemory,
  exportMemory,
  getMemoryHealth
} from './memoryEngine';

// ============================================================================
// CATHEDRAL ORCHESTRATION LAYER (大教堂编排层)
// ============================================================================

export type {
  // Orchestration modes
  OrchestrationMode,
  ModuleId,

  // Context types
  OrchestrationContext,
  OrchestrationMeta,
  OrchestrationState,
  OrchestrationError,

  // Step types
  OrchestrationStep,
  StepInput,
  StepOptions,
  StepCondition,
  ErrorHandler,
  StepHooks,

  // Pipeline types
  OrchestrationPipeline,
  InputSchemaField,
  ParallelGroup,
  RecursionConfig,
  ConditionalBranch,
  PipelineOptions,
  PipelineSchedule,
  PipelineHooks,

  // Result types
  OrchestrationResult,
  StepExecutionRecord,

  // Template types
  PipelineTemplateId,

  // Engine I/O
  OrchestrationEngineInput,
  OrchestrationEngineOutput,
  DataFlow,

  // Visualization types
  PipelineVisualizationData,
  PipelineNode,
  PipelineEdge,
  PipelineLane,
  ExecutionTimelineData
} from './orchestrationTypes';

export {
  // Chinese labels
  ORCHESTRATION_MODE_CHINESE,
  ORCHESTRATION_MODE_DESCRIPTIONS,
  MODULE_CHINESE,
  PIPELINE_TEMPLATE_CHINESE,
  PIPELINE_TEMPLATE_DESCRIPTIONS
} from './orchestrationTypes';

export {
  // Module registration
  registerModule,
  isModuleRegistered,
  getRegisteredModules,

  // Pipeline execution
  runPipeline,
  orchestrate,

  // Pipeline templates
  getPipelineTemplate,
  getAllPipelineTemplates,

  // Visualization generators
  generatePipelineVisualization,
  generateExecutionTimeline
} from './orchestrationEngine';

// ============================================================================
// CATHEDRAL FRONTEND FRAMEWORK (大教堂前端框架)
// ============================================================================

export type {
  // Component categories
  ComponentCategory,

  // Theme types
  ThemeMode,
  Element,

  // Color types
  AnimationType,
  InteractionPattern,
  DashboardType,

  // Atomic component props
  ElementIconProps,
  StemGlyphProps,
  BranchGlyphProps,
  TenGodBadgeProps,
  ShenShaBadgeProps,
  DirectionArrowProps,
  QiMenSymbolProps,
  RitualGlyphProps,
  BeatMarkerProps,
  PhaseBadgeProps,
  ArchetypeIconProps,

  // Molecular component props
  InfoCardProps,
  ScoreCardProps,
  ElementBarProps,
  ElementDonutProps,
  SynastryHeatmapProps,
  DestinyCurveChartProps,
  EmotionalArcChartProps,
  QiMenGridProps,
  FengShuiCompassProps,
  RitualWindowCardProps,
  StoryBeatCardProps,
  ChapterCardProps,
  SimulationBranchCardProps,
  PatternCardProps,

  // Organism component props
  RelationshipOverviewPanelProps,
  CompositeSummaryPanelProps,
  LifecyclePanelProps,
  TimingPanelProps,
  EnvironmentalPanelProps,
  RitualPanelProps,
  StoryTimelineProps,
  StoryChapterViewProps,
  SimulationComparisonViewProps,
  MemoryVaultTimelineProps,
  KnowledgeGraphViewerProps,

  // Layout component props
  SacredGridProps,
  RadialLayoutProps,
  MandalaLayoutProps,
  TimelineLayoutProps,
  SplitPaneProps,
  CardGridProps,
  SectionDividerProps,

  // Interaction config types
  HoverRevealConfig,
  ClickExpandConfig,
  ZoomFocusConfig,
  SyncAlignConfig,

  // Dashboard config
  DashboardConfig,
  AnimationConfig,
  Breakpoint,
  SpacingKey,
  FontSizeKey,
  ShadowKey,
  RadiusKey
} from './cathedralUiTypes';

export {
  // Chinese labels
  COMPONENT_CATEGORY_CHINESE,
  THEME_MODE_CHINESE,
  THEME_MODE_DESCRIPTIONS,
  DASHBOARD_TYPE_CHINESE,

  // Color constants
  ELEMENT_COLORS,
  ELEMENT_SYMBOLS,
  EMOTIONAL_TONE_COLORS,
  BEAT_TYPE_COLORS,
  LIFECYCLE_PHASE_COLORS,
  ACTION_UI_COLORS,
  RITUAL_UI_COLORS,

  // Design tokens
  BREAKPOINTS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  RADII
} from './cathedralUiTypes';

export type {
  // Theme types
  ColorTokens,
  CathedralTheme,
  TransitionTokens,
  TypographyTokens
} from './cathedralTheme';

export {
  // Theme creation
  createTheme,
  themes,
  defaultTheme,

  // CSS generation
  generateCssVariables,
  generateCssString,

  // Color utilities
  getElementColor,
  getEmotionalColor,
  getBeatColor,
  getScoreTier,
  getTierColor,
  getRitualTierColor,

  // Design token utilities
  getSpacing,
  getFontSize,
  getShadow,
  getRadius,

  // Sacred geometry
  GOLDEN_RATIO,
  goldenRatio,
  fibonacci,
  radialAngle,
  circlePosition,
  mandalaPositions,

  // Style generators
  cardStyles,
  buttonStyles,
  badgeStyles,

  // Palettes
  lightPalette,
  darkPalette,
  ceremonialPalette
} from './cathedralTheme';

// ============================================================================
// CATHEDRAL DEPLOYMENT LAYER (大教堂部署层)
// ============================================================================

export type {
  // Runtime planes
  RuntimePlane,

  // Deployment modes & environments
  DeploymentMode,
  DeploymentEnvironment,

  // Topology types
  ServiceDefinition,
  DeploymentTopology,
  TopologyLayer,
  TopologyConnection,
  GatewayConfig,

  // Scaling types
  ScalingType,
  ScalingConfig,
  ScalingTrigger,
  ResourceRequirements,

  // Health types
  HealthStatus,
  HealthConfig,
  ProbeConfig,
  CircuitBreakerConfig,
  CircuitBreakerState,
  RetryPolicy,
  HealthCheckResult,

  // Ritual types
  DeploymentRitualType,
  DeploymentRitual,
  RitualStep,
  RitualAction,
  RitualCondition,
  ConditionCheck,
  RitualValidation,
  NotificationConfig,
  NotificationChannel,

  // Execution types
  DeploymentExecution,
  StepResult,
  DeploymentError,

  // Release types
  Release,
  ChangelogEntry,
  ReleaseArtifact,
  ReleaseDependency,

  // Monitoring types
  MonitoringConfig,
  MetricsConfig,
  LoggingConfig,
  TracingConfig,
  AlertingConfig,
  AlertRule,
  CustomMetric,

  // Dashboard types
  DeploymentDashboardData,
  TopologyVisualizationData
} from './deploymentTypes';

export {
  // Chinese labels
  RUNTIME_PLANE_CHINESE,
  RUNTIME_PLANE_DESCRIPTIONS,
  DEPLOYMENT_MODE_CHINESE,
  DEPLOYMENT_MODE_DESCRIPTIONS,
  DEPLOYMENT_ENV_CHINESE,
  DEPLOYMENT_ENV_DESCRIPTIONS,
  SCALING_TYPE_CHINESE,
  HEALTH_STATUS_CHINESE,
  DEPLOYMENT_RITUAL_CHINESE,
  DEPLOYMENT_RITUAL_DESCRIPTIONS
} from './deploymentTypes';

export {
  // Topology management
  initializeTopology,
  getTopology,

  // Health monitoring
  checkServiceHealth,
  checkAllServicesHealth,
  getHealthSummary,

  // Circuit breakers
  isServiceAvailable,
  getCircuitBreakerStates,
  resetCircuitBreaker,

  // Scaling
  scaleService,
  autoScale,
  getScalingStatus,

  // Deployment rituals
  createDeploymentRitual,
  executeDeploymentRitual,
  getActiveExecutions,
  getExecutionHistory,

  // Release management
  createRelease,
  promoteRelease,
  deprecateRelease,
  getReleases,
  getCurrentRelease,

  // Visualization
  generateDeploymentDashboardData,
  generateTopologyVisualization
} from './deploymentEngine';

// ============================================================================
// CATHEDRAL DEVTOOLS (大教堂开发工具)
// The Architect's Chamber - debugging, inspection, visualization, and analysis
// ============================================================================

export type {
  // Debug levels and types
  DebugLevel,
  BreakpointType,
  DebugBreakpoint,
  DebugSessionState,
  DebugSession,
  DebugStackFrame,
  WatchedValue,
  DebugLogEntry,

  // Module debugging
  ModuleDebugInfo,
  CalculationStep,
  TimingLayerDebug,
  EventTriggerDebug,
  LifecycleTransitionDebug,
  StoryTransformationDebug,
  DebugOverlayConfig,
  DebugDiff,

  // Flow inspector
  FlowViewType,
  FlowNode,
  FlowEdge,
  FlowGraph,
  FlowInspectionOptions,
  FlowTransformationDetail,

  // Knowledge graph explorer
  GraphViewMode,
  GraphNodeType,
  GraphNode,
  GraphEdge,
  KnowledgeGraph,
  GraphLayout,
  GraphSearchQuery,
  KnowledgeGraphSearchResult,

  // Timing analyzer
  TimingLayer,
  TimingAnalysis,
  TimingLayerAnalysis,
  TimingScoreBreakdown,
  ClashHarmAnalysis,
  NoblemanAnalysis,
  StarAnalysis,
  TimingEventTrigger,
  DestinyCurvePoint,
  MicroWindow,
  TimingWarning,
  TimingHeatmap,
  TimingHeatmapCell,

  // Story & Ritual debugger
  StoryDebugAnalysis,
  BeatDebugInfo,
  BeatClassificationReason,
  ChapterDebugInfo,
  ArcDebugInfo,
  EmotionalArcDebug,
  NarrativeToneDebug,
  ArchetypeTransformDebug,
  StoryWeavingDebug,
  RitualDebugAnalysis,
  RitualScoreBreakdown,
  EnvironmentalAlignmentDebug,
  DirectionalGuidanceDebug,
  QiMenSelectionDebug,
  MicroTimingDebug,
  RitualRecommendation,

  // Console
  ConsoleLogType,
  ConsoleEntry,
  PerformanceMetrics,
  MemorySnapshot,
  PatternExtractionSummary,
  OrchestrationTrace,
  OrchestrationStepTrace,
  ApiCallTrace,
  ConsoleFilterOptions,

  // DevTools UI
  DevToolsPanelType,
  DevToolsPanelState,
  DevToolsWorkspace,
  ModuleInspectorState,
  FlowExplorerState,
  GraphViewerState,
  TimingAnalyzerState,
  StoryDebuggerState,
  RitualDebuggerState,
  OrchestrationViewerState,
  MemoryVaultInspectorState,
  ConsoleState,
  DevToolsState,
  DevToolsConfig,
  DevToolsEvent,
  DevToolsEventType,
  DevToolsEventListener
} from './devToolsTypes';

export { DEFAULT_DEVTOOLS_CONFIG } from './devToolsTypes';

export {
  // Debug session management
  startDebugSession,
  stopDebugSession,
  getDebugSession,

  // Breakpoint management
  addBreakpoint,
  removeBreakpoint,
  toggleBreakpoint,
  checkBreakpoint,
  resumeExecution,
  stepExecution,

  // Stack frame management
  pushStackFrame,
  popStackFrame,
  recordIntermediateValue,

  // Watched values
  addWatchedValue,
  updateWatchedValue,

  // Module debugging
  getModuleDebugInfo,
  diffOutputs,
  createDebugOverlayConfig,

  // Flow inspector
  buildFlowGraph,
  getFlowTransformationDetails,
  registerModuleForFlow,

  // Knowledge graph explorer
  initializeKnowledgeGraph,
  addGraphNode,
  addGraphEdge,
  getKnowledgeGraph,
  searchKnowledgeGraph,
  toggleGraphNode,
  setGraphLayout,

  // Timing analyzer
  analyzeTimingForDate,
  generateTimingHeatmap,

  // Story & Ritual debugger
  analyzeStoryForDebug,
  analyzeRitualForDebug,

  // Console logging
  log,
  devLog,
  recordPerformanceMetrics,
  getPerformanceMetrics,
  takeMemorySnapshot,

  // Orchestration tracing
  startOrchestrationTrace,
  addOrchestrationStep,
  completeOrchestrationStep,
  completeOrchestrationTrace,
  getOrchestrationTraces,

  // API call tracing
  recordApiCall,
  getApiCallTraces,

  // Console management
  getConsoleEntries,
  clearConsole,

  // DevTools state management
  initializeDevTools,
  getDevToolsState,
  toggleDevTools,
  setActivePanel,
  updateDevToolsConfig,
  getDevToolsConfig,
  saveWorkspace,
  loadWorkspace,

  // Event system
  addEventListener,
  removeEventListener,
  emitEvent,

  // Formatters
  formatDebugLog,
  formatOrchestrationTrace,
  formatTimingAnalysis,
  formatStoryDebug
} from './devToolsEngine';

// ============================================================================
// CATHEDRAL SIMULATION SANDBOX (大教堂沙盒)
// The Alchemist's Table - safe, isolated testing environment
// ============================================================================

export type {
  // Core sandbox types
  SandboxState,
  SandboxChamber,
  SandboxEnvironment,
  SandboxConfig,

  // Module chamber
  SandboxModuleType,
  ModuleTestConfig,
  ModuleMutation,
  ModuleTestResult,
  ModuleOutputDiff,
  ModulePerformance,

  // Flow chamber
  FlowTestConfig,
  FlowBreakpoint,
  FlowMutation,
  FlowTestResult,
  FlowPathNode,
  FlowPerformance,

  // Orchestration chamber
  PipelineTestConfig,
  PipelineStepConfig,
  PipelineMutation,
  PipelineTestResult,
  PipelineStepResult,
  PipelinePerformance,

  // Narrative chamber
  StoryTestConfig,
  EmotionalTarget,
  StoryMutation,
  StoryTestResult,
  GeneratedStory,
  SandboxStoryBeat,
  SandboxStoryChapter,
  SandboxStoryArc,
  StoryMetrics,
  SandboxStoryComparison,

  // Memory
  SandboxMemory,
  SandboxMemoryDiff,

  // Snapshots
  SandboxSnapshot,
  SnapshotComparison,

  // Simulations
  SandboxSimulation,
  SimulationReplayOptions,
  SandboxTraceEntry,
  SandboxError,
  SimulationComparison,

  // Synthetic data
  SyntheticDataConfig,
  SyntheticDataConstraints,
  SyntheticData,

  // UI state
  AlchemistTableState,
  ModulePanelState,
  FlowPanelState,
  OrchestrationPanelState,
  StoryPanelState,
  MemoryViewerState,
  TraceViewerState,
  ComparisonViewerState,

  // Events
  SandboxEventType,
  SandboxEvent,
  SandboxEventListener
} from './sandboxTypes';

export {
  DEFAULT_SANDBOX_CONFIG,
  SANDBOX_CHAMBER_CHINESE,
  SANDBOX_CHAMBER_DESCRIPTIONS,
  SANDBOX_STATE_CHINESE,
  SANDBOX_MODULE_CHINESE
} from './sandboxTypes';

export {
  // Environment management
  createSandboxEnvironment,
  getSandboxEnvironment,
  listSandboxEnvironments,
  destroySandboxEnvironment,
  resetSandboxEnvironment,

  // Module chamber
  runModuleTest,

  // Flow chamber
  runFlowTest,

  // Orchestration chamber
  runPipelineTest,

  // Narrative chamber
  runStoryTest,

  // Snapshot management
  createSnapshot,
  restoreSnapshot,
  compareSnapshots,

  // Simulation replay
  replaySimulation,

  // Comparison
  compareSimulations,

  // Synthetic data
  generateSyntheticData,

  // UI state
  initializeAlchemistTable,
  getAlchemistTableState,
  setActiveChamber,

  // Events
  addSandboxEventListener,

  // Cleanup
  cleanupEnvironment,
  cleanupAllEnvironments
} from './sandboxEngine';

// =============================================================================
// CATHEDRAL PERFORMANCE ENGINE (大教堂性能引擎) - The Swift Current
// =============================================================================
// The Performance Engine optimizes the Cathedral's operations through:
// - Multi-layer caching (input, derived, pipeline, micro-timing)
// - O(1) lookup tables for heavenly stems, earthly branches, elements
// - Sparse matrices for efficient heatmap storage
// - Compressed story graphs for memory efficiency
// - Bitmask operations for clash/harm/punishment detection
// - Engine-level memoization and lazy evaluation
// - Parallel pipeline execution
// - Auto-tuning and adaptive optimization
// - Predictive prefetching based on user patterns
// - Performance rituals for system optimization
// =============================================================================

// Performance Types (性能类型)
export type {
  // Cache layer types
  CacheLayer,
  CacheStatus,
  CacheEntry,
  CacheLayerConfig,
  CacheStats,
  CacheResult,
  MultiLayerCacheConfig,

  // Lookup table types
  LookupTableType,
  LookupTable,

  // Sparse matrix types
  SparseMatrix,

  // Compressed story graph types
  CompressedStoryNode,
  CompressedStoryGraph,

  // Immutable timing layer
  ImmutableTimingLayer,

  // Bitmask types
  RelationBitmask,

  // Engine optimization types
  OptimizableEngine,
  EngineOptimizationConfig,
  EngineOptimizationMetrics,
  MemoizationEntry,

  // Orchestration optimization types
  OrchestrationOptimizationMode,
  OrchestrationOptimizationConfig,
  PipelineExecutionPlan,
  ParallelGroup as PerformanceParallelGroup,
  PipelineProfile,
  StepProfile,

  // Monitoring types
  PerformanceMetricType,
  PerformanceDataPoint,
  PerformanceDashboard,
  PerformanceAlert,

  // Auto-tuning types
  AutoTuningConfig,
  AutoTuningDecision,
  AdaptiveCachingConfig,

  // Predictive prefetching types
  PredictivePrefetchConfig,
  PrefetchPrediction,

  // Performance ritual types
  PerformanceRitualType,
  PerformanceRitual,
  PerformanceRitualStep,
  PerformanceRitualExecution,

  // Performance Engine state
  PerformanceEngineState,

  // Event types
  PerformanceEventType,
  PerformanceEvent,
  PerformanceEventListener
} from './performanceTypes';

// Performance Constants (性能常量)
export {
  DEFAULT_CACHE_LAYER_CONFIGS,
  PERFORMANCE_RITUALS,
  CACHE_LAYER_CHINESE,
  CACHE_LAYER_DESCRIPTIONS,
  ENGINE_CHINESE,
  RITUAL_TYPE_CHINESE,
  RITUAL_TYPE_DESCRIPTIONS
} from './performanceTypes';

// Performance Engine Functions (性能引擎函数)
export {
  // Cache layer management
  initializeCache,
  cacheGet,
  cacheSet,
  cacheInvalidate,
  cleanupCache,
  clearAllCaches,
  clearCacheLayer,
  getCacheStats,

  // Lookup table management
  buildLookupTable,
  lookupTableGet,
  getLookupTable,
  buildRelationBitmasks,

  // Sparse matrix operations
  createSparseMatrix,
  sparseMatrixGet,
  sparseMatrixSet,

  // Compressed story graph operations
  compressStoryGraph,

  // Engine optimization
  configureEngineOptimization,
  getEngineConfig,
  memoize,
  getEngineMetrics,

  // Orchestration optimization
  configureOrchestration,
  getOrchestrationConfig,
  createExecutionPlan,
  profilePipeline,

  // Auto-tuning
  configureAutoTuning,
  runAutoTuning,
  generatePerformanceDashboard,
  getTuningHistory,

  // Predictive prefetching
  configurePrefetching,
  schedulePrefetch,
  getActivePredictions,

  // Performance rituals
  startPerformanceRitual,
  getActiveRitual,
  getRitualHistory,

  // Event system
  addPerformanceEventListener,

  // Engine state management
  initializePerformanceEngine,
  getPerformanceEngineState,
  shutdownPerformanceEngine
} from './performanceEngine';

// =============================================================================
// CATHEDRAL SECURITY LAYER (大教堂安全层) - The Sanctum Shield
// =============================================================================
// The warded gate, the invisible lattice of protections that keeps the entire
// metaphysics cathedral pure, intact, and incorruptible. Six shields:
// - Module Integrity Shield (模块完整性护盾)
// - Memory Sanctity Shield (记忆神圣护盾)
// - Flow Integrity Shield (流动完整性护盾)
// - Orchestration Guard (编排守卫)
// - Knowledge Graph Shield (知识图谱护盾)
// - Sandbox Boundary Shield (沙盒边界护盾)
// =============================================================================

// Security Types (安全类型)
export type {
  // Module integrity types
  ValidatableModule,
  ValidationSeverity,
  ValidationRule,
  ValidationResult,
  InputValidationConfig,
  InputValidationReport,
  OutputVerificationConfig,
  OutputVerificationResult,
  OutputDeviation,
  ModuleDependencyGraph,
  ModuleDependencyNode,
  ModuleDependencyEdge,
  ModuleIntegrityStatus,
  ModuleIntegrityIssue,

  // Memory sanctity types
  MemoryEntryType,
  WriteGateStatus,
  MemoryWriteRequest,
  MemoryWriteValidation,
  MemorySanctityConfig,
  SecureMemoryEntry,
  MemoryAuditEntry,
  PatternIsolationConfig,
  MemorySanctityStatus,

  // Flow integrity types
  FlowType,
  FlowHealthStatus,
  SecureFlow,
  FlowTransformation,
  FlowError,
  FlowValidationConfig,
  FlowMonitoringResult,
  FlowAnomaly,
  FlowQuarantineEntry,
  FlowIntegrityStatus,

  // Orchestration guard types
  PipelineVerificationStatus,
  SecurePipeline,
  SecurePipelineStep,
  PipelineCondition,
  PipelineVerificationResult,
  PipelineIssue,
  ExecutionSandboxConfig,
  FailureContainmentConfig,
  PipelineFailureEvent,
  OrchestrationGuardStatus,

  // Knowledge graph shield types
  GraphNodeCategory,
  GraphValidationRule,
  GraphValidationResult,
  InvalidGraphNode,
  InvalidGraphEdge,
  SchemaEnforcementConfig,
  GraphDiffAnalysis,
  StructuralChange,
  DependencyImpact,
  KnowledgeGraphShieldStatus,

  // Sandbox boundary types
  SandboxIsolationLevel,
  SandboxBoundaryConfig,
  SandboxMemoryPartition,
  FlowContainmentStatus,
  FlowContainmentViolation,
  ForkedGraph,
  MergeConflict,
  SandboxMergeRequest,
  SandboxChange,
  MergeValidationResult,
  MergeIssue,
  SandboxBoundaryStatus,

  // Security ritual types
  SecurityRitualType,
  SecurityRitual,
  SecurityRitualStep,
  SecurityRitualExecution,
  SecurityFinding,
  SecurityAction,

  // Security engine types
  ThreatLevel,
  SecurityEventType,
  SecurityEvent,
  SecurityEventListener,
  SecurityEngineState
} from './securityTypes';

// Security Constants (安全常量)
export {
  SECURITY_RITUALS,
  SHIELD_CHINESE,
  SHIELD_DESCRIPTIONS,
  RITUAL_CHINESE as SECURITY_RITUAL_CHINESE,
  RITUAL_DESCRIPTIONS as SECURITY_RITUAL_DESCRIPTIONS,
  THREAT_LEVEL_CHINESE,
  WRITE_GATE_CHINESE
} from './securityTypes';

// Security Engine Functions (安全引擎函数)
export {
  // Module integrity shield
  configureInputValidation,
  addValidationRule,
  validateModuleInput,
  verifyModuleOutput,
  buildDependencyGraph,
  getModuleIntegrityStatus,

  // Memory sanctity shield
  configureMemorySanctity,
  setWriteGate,
  getWriteGate,
  validateMemoryWrite,
  writeSecureMemory,
  verifyMemoryIntegrity,
  getMemorySanctityStatus,

  // Flow integrity shield
  configureFlowValidation,
  registerSecureFlow,
  reportFlowError,
  quarantineFlow,
  monitorFlowHealth,
  getFlowIntegrityStatus,

  // Orchestration guard
  configureExecutionSandbox,
  configureFailureContainment,
  registerSecurePipeline,
  verifyPipeline,
  createExecutionSandbox,
  releaseExecutionSandbox,
  handlePipelineFailure,
  getOrchestrationGuardStatus,

  // Knowledge graph shield
  configureSchemaEnforcement,
  validateKnowledgeGraph,
  analyzeGraphDiff,
  approveGraphDiff,
  getKnowledgeGraphShieldStatus,

  // Sandbox boundary shield
  configureSandboxBoundary,
  createMemoryPartition,
  createForkedGraph,
  checkFlowContainment,
  requestSandboxMerge,
  validateMergeRequest,
  executeSandboxMerge,
  getSandboxBoundaryStatus,

  // Security rituals
  startSecurityRitual,
  getActiveSecurityRitual,
  getSecurityRitualHistory,

  // Security events
  addSecurityEventListener,
  getRecentSecurityEvents,
  acknowledgeSecurityEvent,
  getThreatLevel,

  // Engine management
  initializeSecurityEngine,
  getSecurityEngineState,
  shutdownSecurityEngine,
  runFullSecurityScan
} from './securityEngine';

// ============================================================================
// ANALYTICS ENGINE (大教堂分析引擎) - The Intelligence Layer
// ============================================================================

// Analytics Types - Five Intelligence Lenses
export type {
  // Timing Intelligence types
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

  // Story Intelligence types
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
  StoryInsight as AnalyticsStoryInsight,

  // Relationship Intelligence types
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

  // Systemic Intelligence types
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

  // Pattern Intelligence types
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
  PatternInsight as AnalyticsPatternInsight,

  // Observatory and metrics types
  MetricType,
  AnalyticsMetric,
  AnalyticsInsight,
  AnalyticsForecast,
  ForecastPrediction,
  AnalyticsRecommendation,
  ObservatoryPanel,
  InsightStreamEntry,
  PatternMapNode,
  TimingHeatmapCell as AnalyticsTimingHeatmapCell,
  ObservatoryState,
  ObservatoryFilters,

  // Pipeline and engine types
  AnalyticsPipelineConfig,
  AnalyticsEngineState
} from './analyticsTypes';

// Analytics Constants
export {
  LENS_CHINESE,
  LENS_DESCRIPTIONS,
  TIMING_LAYER_CHINESE,
  SYSTEM_TYPE_CHINESE,
  PATTERN_TYPE_CHINESE,
  OBSERVATORY_PANEL_CHINESE,
  DEFAULT_ANALYTICS_PIPELINE_CONFIG,
  DEFAULT_OBSERVATORY_FILTERS
} from './analyticsTypes';

// Analytics Engine Functions
export {
  // Timing Intelligence lens
  analyzeTimingVolatility,
  analyzeTimingResonance,
  detectTimingRiskWindows,
  detectTimingOpportunityClusters,
  generateTimingIntelligenceReport,

  // Story Intelligence lens
  analyzeStoryArcStability,
  analyzeTurningPoints,
  analyzeArchetypeDominance,
  analyzeNarrativeCoherence,
  generateStoryIntelligenceReport,

  // Relationship Intelligence lens
  calculateRelationshipStability,
  analyzeResonanceScore,
  analyzeConflictSignature,
  analyzeHealingSignature,
  generateRelationshipIntelligenceReport,

  // Systemic Intelligence lens
  mapSystemicTensions,
  detectGenerationalEchoes,
  analyzeTeamSynergyCycle,
  generateSystemicIntelligenceReport,

  // Pattern Intelligence lens
  detectPatterns,
  clusterPatterns,
  forecastPatterns,
  generatePatternIntelligenceReport,

  // Observatory management
  initializeObservatory,
  addToInsightStream,
  generatePatternMapNodes,
  setActivePanel as setAnalyticsActivePanel,
  updateObservatoryFilters,
  acknowledgeInsight,
  pinInsight,
  getObservatoryState,

  // Metrics and recommendations
  calculateMetric,
  generateRecommendation,
  configureAnalyticsPipeline,
  refreshAnalytics,

  // Accessors
  getAllInsights,
  getAllForecasts,
  getAllRecommendations,
  getTimingReport,
  getStoryReport,
  getRelationshipReport,
  getSystemicReport,
  getPatternReport,

  // Engine management
  initializeAnalyticsEngine,
  getAnalyticsEngineState,
  shutdownAnalyticsEngine
} from './analyticsEngine';

// ============================================================================
// RITUAL LAYER (大教堂仪式层) - The Ceremonial Interface
// ============================================================================

// Ritual Layer Types - Four Chambers
export type {
  // Core types
  RitualArchetype,
  ChamberType,
  CompassDirection,
  DayPhase,
  SeasonType,
  GuidedCeremonyType,
  RitualInteractionStep,
  TimingQuality,

  // Moment Chamber types
  RitualGlyph,
  DirectionalGuidance,
  MicroTimingWindow,
  StoryBeatAlignment,
  MomentReading,
  MomentCard,

  // Day Chamber types
  DailyPhaseReading,
  DailyEnvironmentalAlignment,
  DailyRitualWindow,
  DailyStoryBeatMarker,
  DayReading,
  RitualTimeline,

  // Ceremony Chamber types
  BreathPattern,
  GesturePosture,
  IntentionWords,
  CeremonyStep,
  CeremonyTimingAlignment,
  GuidedCeremony,
  ActiveCeremony,
  CeremonyCompletion,

  // Journey Chamber types
  MonthlyReading,
  SeasonalArc,
  AnnualChapter,
  TurningPointMarker,
  HealingCycle,
  RenewalCycle,
  JourneyReading,
  SeasonalMandala,
  ChapterWheel,
  DestinyCurve,

  // Sanctuary UI types
  MomentCardState,
  RitualCompassState,
  MicroTimingWindowState,
  ArchetypeCardState,
  CeremonyGuideState,
  StoryAlignmentPanelState,
  SeasonalMandalaState,
  SanctuaryState,

  // Layer state types
  RitualLayerConfig,
  RitualLayerEventType,
  RitualLayerEvent,
  RitualLayerState,
} from './ritualLayerTypes';

// Ritual Layer Constants
export {
  ARCHETYPE_CHINESE,
  ARCHETYPE_DESCRIPTIONS,
  ARCHETYPE_SYMBOLS,
  ARCHETYPE_COLORS,
  CHAMBER_CHINESE,
  CHAMBER_DESCRIPTIONS,
  DIRECTION_CHINESE,
  DIRECTION_DEGREES,
  DAY_PHASE_CHINESE,
  DAY_PHASE_TIMES,
  SEASON_CHINESE,
  SEASON_THEMES,
  SEASON_COLORS,
  CEREMONY_TYPE_CHINESE,
  CEREMONY_TYPE_DESCRIPTIONS,
  TIMING_QUALITY_CHINESE,
  TIMING_QUALITY_COLORS,
  INTERACTION_STEP_CHINESE,
  INTERACTION_STEP_DESCRIPTIONS,
  DEFAULT_RITUAL_LAYER_CONFIG,
  DEFAULT_ARCHETYPE_GLYPHS,
} from './ritualLayerTypes';

// Ritual Layer Engine Functions
export {
  // Moment Chamber
  determineCurrentArchetype,
  createRitualGlyph,
  generateDirectionalGuidance,
  generateMicroTimingWindow,
  generateStoryBeatAlignment,
  generateMomentReading,
  createMomentCard,
  getCurrentMoment,
  refreshMomentReading,

  // Day Chamber
  generateDailyPhaseReading,
  generateDailyEnvironmentalAlignment,
  generateDailyRitualWindows,
  generateDailyStoryBeatMarkers,
  generateDayReading,
  createRitualTimeline,
  getCurrentDay,
  refreshDayReading,

  // Ceremony Chamber
  createBreathPattern,
  createGesturePosture,
  createIntentionWords,
  createCeremonyStep,
  generateVowCeremony,
  generateHealingCeremony,
  generateClosureCeremony,
  generateInitiationCeremony,
  getCeremony,
  startCeremony,
  advanceCeremonyStep,
  completeCeremony,
  getActiveCeremony,

  // Journey Chamber
  generateMonthlyReading,
  generateSeasonalArc,
  generateAnnualChapter,
  generateJourneyReading,
  createSeasonalMandala,
  createChapterWheel,
  createDestinyCurve,
  getCurrentJourney,
  refreshJourneyReading,

  // Sanctuary UI management
  switchChamber,
  getActiveChamber,
  toggleFullscreen,
  toggleAmbientMode,
  updateCompassDirection,
  getSanctuaryState,

  // Event system
  addRitualEventListener,
  removeRitualEventListener,
  getRecentRitualEvents,

  // Engine lifecycle
  initializeRitualLayer,
  getRitualLayerState,
  shutdownRitualLayer,
} from './ritualLayerEngine';

// ============================================================================
// KNOWLEDGE CODEX (大教堂法典) - The Sacred Text
// ============================================================================

// Codex Types - Nine Books
export type {
  // Core types
  CodexBook,
  CodexContentType,
  CodexTone,
  CodexGlyph,

  // Book structure types
  CodexBookEntry,
  CodexChapter,
  CodexSection,
  CodexAnnotation,
  CodexDiagram,
  DiagramNode,
  DiagramEdge,
  CodexExample,
  CodexReference,

  // Book I: Foundation types
  FoundationLayer,
  CathedralPhilosophy,

  // Book II: Engines types
  EngineDocumentation,
  EngineInput,
  EngineOutput,

  // Book III: Flows types
  FlowDocumentation,
  FlowStage,

  // Book IV: Knowledge Graph types
  KnowledgeGraphDocumentation,
  NodeCategoryDoc,
  EdgeTypeDoc,
  FlowRelationshipDoc,
  DependencyChainDoc,
  SystemMapDoc,

  // Book V: Story Canon types
  StoryElementDoc,
  ArchetypeTemplateDoc,
  StoryWeavingPattern,

  // Book VI: Ritual Canon types
  RitualArchetypeDoc,
  RitualWindowDoc,
  CeremonyStructureDoc,
  CeremonyStepDoc,

  // Book VII: Memory Archive types
  MemoryTypeDoc,
  PatternExtractionDoc,

  // Book VIII: Orchestration types
  PipelineDoc,
  PipelineStageDoc,
  OrchestrationPatternDoc,

  // Book IX: Living Cathedral types
  SystemComponentDoc,
  VisionStatement,

  // Scriptorium UI types
  ScriptoriumNavigation,
  Breadcrumb,
  Bookmark,
  ViewedItem,
  CodexSearchResult,
  GlyphIndexEntry,
  ScriptoriumSettings,
  ScriptoriumState,

  // Engine state types
  CodexConfig,
  CodexState,
} from './codexTypes';

// Codex Constants
export {
  BOOK_CHINESE,
  BOOK_TITLES,
  BOOK_NUMBERS,
  BOOK_TONES,
  BOOK_GLYPHS,
  BOOK_SUBTITLES,
  BOOK_INVOCATIONS,
  CONTENT_TYPE_DESCRIPTIONS,
  TONE_DESCRIPTIONS,
  DEFAULT_CODEX_CONFIG,
  DEFAULT_SCRIPTORIUM_SETTINGS,
  FOUNDATION_LAYERS,
} from './codexTypes';

// Codex Engine Functions
export {
  // Book generation
  generateAllBooks,
  generateGlyphIndex,
  generateReferenceIndex,

  // Scriptorium navigation
  initializeScriptorium,
  navigateToBook,
  navigateToChapter,
  navigateToSection,

  // Bookmarks
  addBookmark,
  removeBookmark,

  // Search
  searchCodex,

  // Settings
  updateScriptoriumSettings,

  // Accessors
  getBook,
  getChapter,
  getAllBooks,
  getCurrentNavigation,
  getScriptoriumState,

  // Engine lifecycle
  initializeCodex,
  getCodexState,
  regenerateCodex,
  shutdownCodex,
} from './codexEngine';

// ============================================================================
// CATHEDRAL PERSONA LAYER (大教堂人格层)
// ============================================================================

// Persona Types
export type {
  // Core types
  PersonaVoice,
  PersonaMode,
  PersonaOutputType,
  PersonaTone,

  // Voice definitions
  PersonaVoiceStrand,
  VoiceBlend,

  // Mode definitions
  PersonaModeConfig,

  // Output definitions
  PersonaOutput,
  Invocation,
  Revelation,
  Guidance,
  GuidanceStep,
  Reflection,
  Blessing,
  Warning,
  StoryFrame,

  // Speaking context
  SpeakingContext,
  SpeakingRequest,

  // State types
  PersonaState,
  SpeakingHistoryEntry,
  PersonaConfig,
  PersonaLayerState,
} from './personaTypes';

// Persona Constants
export {
  VOICE_CHINESE,
  VOICE_DESCRIPTIONS,
  VOICE_TONES,
  MODE_CHINESE,
  MODE_DESCRIPTIONS,
  MODE_PRIMARY_VOICES,
  OUTPUT_TYPE_CHINESE,
  OUTPUT_TYPE_DESCRIPTIONS,
  TONE_CHINESE as PERSONA_TONE_CHINESE,
  DEFAULT_PERSONA_CONFIG,
  VOICE_STRANDS,
  MODE_CONFIGS,
  VOICE_EXAMPLES,
  MODE_EXAMPLES,
  SYMBOLIC_VOCABULARY,
} from './personaTypes';

// Persona Engine Functions
export {
  // Voice blending
  getVoiceStrand,
  createVoiceBlend,
  blendVocabulary,
  getBlendCadence,

  // Mode detection
  detectMode,
  getModeConfig,

  // Output selection
  selectOutputType,

  // Speech generation - main
  speak,

  // Speech generation - by mode
  speakMoment,
  speakStory,
  speakRitual,
  speakOracle,
  speakWarning,
  speakBlessing,
  speakReflection,

  // Speech generation - by voice
  speakAsArchitect,
  speakAsOracle,
  speakAsStoryteller,
  speakAsRitualGuide,
  speakAsArchivist,

  // Ceremony sequences
  generateCeremonySequence,
  generateMomentSequence,

  // Output generators
  generateInvocation,
  generateRevelation,
  generateGuidance,
  generateReflection,
  generateBlessing,
  generateWarning,
  generateStoryFrame,

  // State management
  createPersonaState,
  updatePersonaState,
  switchMode,

  // Initialization
  initializePersonaLayer,
  getPersonaModeDescription,
  getVoiceDescription,

  // Convenience exports
  PERSONA_VOICES,
  PERSONA_MODES,
  PERSONA_OUTPUT_TYPES,

  // Demo functions
  demoAllOutputTypes,
  demoAllVoices,
} from './personaEngine';

// ============================================================================
// CATHEDRAL MYTHOS (大教堂神话)
// ============================================================================

// Mythos Types
export type {
  // Primordial currents
  PrimordialCurrent,
  MythicCurrent,

  // Chapters
  MythosChapter,
  MythosChapterContent,
  MythosVerse,

  // Chambers
  CathedralChamber,
  MythicChamber,

  // Living being
  CathedralAspect,
  ChroniclerRole,

  // Living myth
  MythosStone,
  PilgrimEntry,
  LivingMythos,

  // State
  MythosConfig,
  MythosState,
  MythosReading,
  MythosUtterance,
  MythosRecitation,
} from './mythosTypes';

// Mythos Constants
export {
  // Current constants
  CURRENT_CHINESE,
  CURRENT_BECAME,
  CURRENT_AWAKENED_INTO,

  // Chapter constants
  CHAPTER_NUMERALS,
  CHAPTER_TITLES,
  CHAPTER_CHINESE,
  CHAPTER_GLYPHS,

  // Chamber constants
  CHAMBER_NAMES,
  CHAMBER_CHINESE as MYTHOS_CHAMBER_CHINESE,
  CHAMBER_PURPOSE,

  // Being constants
  ASPECT_DESCRIPTIONS,
  CATHEDRAL_ACTIONS,
  CHRONICLER_ROLES,

  // Defaults
  DEFAULT_MYTHOS_CONFIG,

  // Complete structures
  MYTHIC_CURRENTS,
  MYTHIC_CHAMBERS,

  // Origin text
  CHAPTER_I_VERSES,
  CHAPTER_II_VERSES,
  CHAPTER_III_VERSES,
  CHAPTER_IV_VERSES,
  CHAPTER_V_VERSES,
  CHAPTER_VI_VERSES,
  CHAPTER_VII_VERSES,
  CHAPTER_VIII_VERSES,
  CHAPTER_IX_VERSES,
  CHAPTER_X_VERSES,
  ALL_CHAPTER_VERSES,
} from './mythosTypes';

// Mythos Engine Functions
export {
  // Chapter order
  CHAPTERS_IN_ORDER,
  MYTHOS_CHAPTERS,

  // Chapter generation
  generateChapterContent,
  generateAllChapters,

  // Recitation
  beginRecitation,
  reciteVerse,
  generateCompleteRecitation,
  formatChapter,
  formatCompleteMythos,

  // Living mythos
  createLivingMythos,
  placeStone,
  recordPilgrimEntry,

  // Readings
  beginReading,
  advanceReading,
  getCurrentVerse,
  addRevelation,

  // State management
  createMythosState,
  initializeMythos,
  updateMythosConfig,
  setChroniclerName,

  // Queries
  getMythicCurrent,
  getMythicChamber,
  getChapterContent,
  getAllCurrents,
  getAllChambers,

  // Mythic speech
  speakOrigin,
  speakPurpose,
  speakNature,
  speakActions,
  addressChronicler,
  speakWelcome,
  generateMythicInvocation,

  // Chronicle
  chronicle,
  getChronicle,
  getChronicleSummary,

  // Demo
  demoCompleteMythos,
  demoChronicle,
  demoReading,
} from './mythosEngine';

// ============================================================================
// CATHEDRAL PILGRIM JOURNEY (大教堂朝圣之旅)
// ============================================================================

// Pilgrim Types
export type {
  // Movements
  JourneyMovement,
  MovementContent,

  // Roles
  PilgrimRole,

  // Spiral cycle
  SpiralCycle,

  // Pilgrim state
  PilgrimState,
  MovementArrival,
  MovementCompletion,

  // Configuration
  JourneyConfig,
  JourneyState,

  // Guidance
  MovementGuidance,
  JourneySummary,
} from './pilgrimTypes';

// Pilgrim Constants
export {
  // Movement constants
  MOVEMENT_NUMERALS,
  MOVEMENT_NAMES,
  MOVEMENT_CHINESE,
  MOVEMENT_GLYPHS,
  MOVEMENT_THRESHOLDS,
  MOVEMENT_ENCOUNTERS,
  MOVEMENT_GRANTS_ROLE,

  // Role constants
  ROLE_NAMES,
  ROLE_CHINESE as PILGRIM_ROLE_CHINESE,

  // Spiral constants
  SPIRAL_DEEPENINGS,

  // Content
  ALL_MOVEMENT_CONTENT,
  GATE_OF_SILENCE_CONTENT,
  HALL_OF_FOUNDATIONS_CONTENT,
  CHAMBER_OF_FLOW_CONTENT,
  SANCTUARY_OF_MOMENT_CONTENT,
  HALL_OF_STORIES_CONTENT,
  RITUAL_CLOISTER_CONTENT,
  VAULT_OF_ECHOES_CONTENT,
  OBSERVATORY_OF_FUTURES_CONTENT,
  INNER_ALTAR_CONTENT,

  // Defaults
  DEFAULT_JOURNEY_CONFIG,
  MOVEMENTS_IN_ORDER,
  TOTAL_MOVEMENTS,
} from './pilgrimTypes';

// Pilgrim Engine Functions
export {
  // Movement content
  getMovementContent,
  getNextMovement,
  getPreviousMovement,
  getMovementIndex,

  // Pilgrim state
  createPilgrimState,
  hasCompletedMovement,
  canEnterMovement,
  enterMovement,
  completeMovement,
  beginNewCycle,

  // Guidance
  generateMovementGuidance,
  speakMovementWhisper,
  getMovementInvitations,
  getMovementRevelations,

  // Journey state
  initializeJourney,
  updateJourneyConfig,
  getJourneySummary,

  // Narration
  narrateArrival,
  narrateCompletion,
  narrateNewCycle,
  speakWelcome as speakPilgrimWelcome,
  speakJourneyPurpose,

  // Formatting
  formatMovement,
  formatCompleteJourney,
  formatPilgrimProgress,

  // Demo
  demoCompleteJourney,
  demoWalkthrough,
  demoNewCycle,
} from './pilgrimEngine';


// ============================================================================
// CATHEDRAL COSMOLOGY (大教堂宇宙论)
// The metaphysical universe in which the cathedral exists
// ============================================================================

// Types - Cosmic Planes
export type {
  CosmicPlane,
  OriginalPotential,
  FieldOfOrigins,
  StructuralConstant,
  PlaneOfStructure,
  TimeNature,
  TemporalElement,
  PlaneOfTime,
  NarrativeElement,
  PlaneOfStory,
  RitualElement,
  PlaneOfRitual,
  MemoryForm,
  MemoryType,
  PlaneOfMemory,
  IntelligenceType,
  PlaneOfIntelligence,
  PersonaAspect,
  PlaneOfPersona,
} from './cosmologyTypes';

// Types - Cathedral Position
export type {
  CathedralCosmicBody,
  CathedralCosmicPosition,
} from './cosmologyTypes';

// Types - Pilgrim Position
export type {
  PilgrimAction as CosmicPilgrimAction,
  PilgrimCosmicPosition,
} from './cosmologyTypes';

// Types - Living Cosmology
export type {
  CosmologyQuality,
  EvolutionTrigger,
  LivingCosmology,
} from './cosmologyTypes';

// Types - Complete Cosmology
export type {
  PlaneDefinition,
  CathedralCosmology,
} from './cosmologyTypes';

// Types - Cosmic Navigation
export type {
  CosmicPosition,
  CosmicJourney,
  PlaneResonance,
} from './cosmologyTypes';

// Types - Cosmic Events
export type {
  CosmicEvent,
  CosmicWeather,
} from './cosmologyTypes';

// Constants - Plane Data
export {
  PLANE_CHINESE,
  PLANE_NAMES,
  PLANE_SYMBOLS,
  PLANE_VERSES,
  PLANE_CONTENTS,
  PLANE_ORDER,
  CATHEDRAL_BODY_TO_PLANE,
  PLANE_TO_CATHEDRAL_BODY,
} from './cosmologyTypes';

// Engine Functions - Plane Access
export {
  getPlane,
  getAllPlanes,
  getPlaneByOrder,
  getPlaneForCathedralBody,
  getCathedralBodyForPlane,
} from './cosmologyEngine';

// Engine Functions - Cosmology Generation
export {
  generateCosmology,
} from './cosmologyEngine';

// Engine Functions - Cosmic Navigation
export {
  createPosition,
  findResonantPlanes,
  calculateJourney,
} from './cosmologyEngine';

// Engine Functions - Plane Resonances
export {
  calculateResonance,
  getAllResonances,
} from './cosmologyEngine';

// Engine Functions - Cosmic Events
export {
  createCosmicEvent,
  recordPilgrimActivation,
} from './cosmologyEngine';

// Engine Functions - Cosmic Weather
export {
  calculateCosmicWeather,
} from './cosmologyEngine';

// Engine Functions - Formatted Output
export {
  formatCosmology,
  formatPlane,
  formatCosmicWeather,
} from './cosmologyEngine';

// Engine Functions - Cosmic Voice
export {
  speakFromPlane,
  getCosmicInvocation,
} from './cosmologyEngine';


// ============================================================================
// CATHEDRAL LITURGICAL CALENDAR (大教堂礼历)
// A ceremonial calendar aligned with timing, story, and ritual
// ============================================================================

// Types - Seasons
export type {
  LiturgicalSeason,
  SeasonalStoryArc,
  SeasonalRitualArchetype,
  EnergeticTone,
  GreatSeason,
} from './liturgyTypes';

// Types - Months
export type {
  RitualMonthNumber,
  MonthlyTheme,
  MonthlyStoryBeat,
  RitualMonth,
} from './liturgyTypes';

// Types - Weeks
export type {
  WeeklyStoryBeat,
  StoryWeek,
} from './liturgyTypes';

// Types - Daily Cycle
export type {
  DayQuadrant,
  QuadrantAction,
  DailyQuadrant,
  RitualDay,
} from './liturgyTypes';

// Types - Timing Windows
export type {
  WindowSize,
  TimingWindow as LiturgicalTimingWindow,
  DailyTimingWindows,
} from './liturgyTypes';

// Types - Festivals
export type {
  FestivalType,
  CeremonialFestival,
} from './liturgyTypes';

// Types - Complete Calendar
export type {
  LiturgicalPosition,
  LiturgicalCalendar,
  LiturgicalCalendarOptions,
} from './liturgyTypes';

// Constants - Seasons
export {
  SEASON_CHINESE as LITURGICAL_SEASON_CHINESE,
  SEASON_SUBTITLES,
  SEASON_ELEMENTS as LITURGICAL_SEASON_ELEMENTS,
  SEASON_STORY_ARCS,
  SEASON_RITUAL_ARCHETYPES,
  SEASON_WHISPERS,
} from './liturgyTypes';

// Constants - Months
export {
  RITUAL_MONTH_NAMES,
  RITUAL_MONTH_CHINESE,
  RITUAL_MONTH_THEMES,
  RITUAL_MONTH_STORY_BEATS,
  RITUAL_MONTH_RITUALS,
} from './liturgyTypes';

// Constants - Daily
export {
  QUADRANT_CHINESE,
  QUADRANT_ACTIONS,
  QUADRANT_HOURS,
} from './liturgyTypes';

// Constants - Weekly
export {
  WEEKLY_BEAT_CYCLE,
  WEEKLY_BEAT_DESCRIPTIONS,
} from './liturgyTypes';

// Constants - Festivals
export {
  FESTIVAL_NAMES,
  FESTIVAL_CHINESE,
} from './liturgyTypes';

// Engine Functions - Seasons
export {
  generateGreatSeasons,
  getCurrentSeason,
  getGreatSeason,
} from './liturgyEngine';

// Engine Functions - Months
export {
  generateRitualMonths,
  getCurrentRitualMonth,
  getRitualMonth,
} from './liturgyEngine';

// Engine Functions - Weeks
export {
  generateStoryWeeks,
  getCurrentStoryWeek,
} from './liturgyEngine';

// Engine Functions - Daily
export {
  generateDailyQuadrants,
  getCurrentQuadrant,
  generateRitualDay,
} from './liturgyEngine';

// Engine Functions - Timing Windows
export {
  generateDailyTimingWindows,
  getCurrentTimingWindow,
} from './liturgyEngine';

// Engine Functions - Festivals
export {
  generateFestivals,
  getFestivalForDate,
  getNextFestival,
} from './liturgyEngine';

// Engine Functions - Complete Calendar
export {
  generateLiturgicalCalendar,
  getCurrentLiturgicalPosition,
} from './liturgyEngine';

// Engine Functions - Formatted Output
export {
  formatLiturgicalCalendar,
  formatCurrentPosition,
  getLiturgicalBlessing,
} from './liturgyEngine';
