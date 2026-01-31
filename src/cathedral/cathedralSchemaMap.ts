/**
 * ============================================================================
 * CATHEDRAL SCHEMA MAP (大教堂架构图)
 * ============================================================================
 *
 * The complete architectural blueprint of the Genesis Soul Cathedral.
 * This module provides a machine-readable map of all modules, types,
 * data flows, timing flows, and narrative flows in the system.
 *
 * Use Cases:
 * - Documentation generation
 * - Dependency analysis
 * - Development planning
 * - System health monitoring
 * - AI agent navigation
 *
 * Structure:
 * 1. Module Registry - All modules with metadata
 * 2. Type Registry - All shared types and their relationships
 * 3. Data Flow Graph - How data moves through the system
 * 4. Timing Flow - The temporal cascade of calculations
 * 5. Narrative Flow - How narratives are generated and composed
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Module categories
 */
export type ModuleCategory =
  | 'engine'       // Core calculation engines
  | 'service'      // Firebase/API services
  | 'utility'      // Helper utilities
  | 'type'         // Type definition files
  | 'component'    // React components
  | 'page'         // React page components
  | 'data'         // Static data files
  | 'hook'         // React hooks
  | 'context'      // React contexts
  | 'report'       // Report generators
  | 'renderer';    // Output renderers

/**
 * Module status
 */
export type ModuleImplementationStatus =
  | 'complete'     // Fully implemented and tested
  | 'implemented'  // Implemented, needs testing
  | 'partial'      // Partially implemented
  | 'planned'      // Planned, not started
  | 'deprecated';  // Deprecated, to be removed

/**
 * Data flow direction
 */
export type FlowDirection = 'input' | 'output' | 'bidirectional';

/**
 * Module definition
 */
export interface ModuleDefinition {
  id: string;
  name: string;
  nameChinese: string;
  category: ModuleCategory;
  status: ModuleImplementationStatus;
  path: string;
  description: string;
  dependencies: string[];    // Module IDs this depends on
  dependents: string[];      // Module IDs that depend on this
  exports: string[];         // Exported functions/types
  inputs: TypeReference[];   // Input types
  outputs: TypeReference[];  // Output types
  tags: string[];
}

/**
 * Type reference
 */
export interface TypeReference {
  typeName: string;
  sourceModule: string;
  description: string;
  isArray?: boolean;
  isOptional?: boolean;
}

/**
 * Type definition
 */
export interface TypeDefinition {
  name: string;
  nameChinese: string;
  sourceModule: string;
  category: 'interface' | 'type' | 'enum' | 'const';
  description: string;
  properties?: TypeProperty[];
  enumValues?: string[];
  usedBy: string[];     // Module IDs
  relatedTypes: string[]; // Type names
}

/**
 * Type property
 */
export interface TypeProperty {
  name: string;
  type: string;
  description: string;
  optional: boolean;
}

/**
 * Data flow edge
 */
export interface DataFlowEdge {
  id: string;
  from: string;         // Module ID
  to: string;           // Module ID
  dataType: string;     // Type name
  direction: FlowDirection;
  description: string;
  isRequired: boolean;
}

/**
 * Timing flow node
 */
export interface TimingFlowNode {
  id: string;
  moduleId: string;
  order: number;        // Execution order
  layer: TimingLayer;
  description: string;
  dependencies: string[]; // Timing node IDs
  outputs: string[];      // Type names produced
}

/**
 * Timing layers (from static to dynamic)
 */
export type TimingLayer =
  | 'natal'           // Birth chart calculations
  | 'composite'       // Relationship composite
  | 'luckPillar'      // 10-year cycles
  | 'annual'          // Yearly cycles
  | 'monthly'         // Monthly cycles
  | 'daily'           // Daily cycles
  | 'event';          // Event triggers

/**
 * Narrative flow node
 */
export interface NarrativeFlowNode {
  id: string;
  moduleId: string;
  chapterNumber?: number;
  narrativeType: NarrativeType;
  inputs: string[];     // Type names consumed
  outputs: string[];    // Narrative outputs
  tone?: string;
  description: string;
}

/**
 * Narrative types
 */
export type NarrativeType =
  | 'chapter'         // Report chapter
  | 'summary'         // Executive summary
  | 'dedication'      // Relationship dedication
  | 'guidance'        // Practical guidance
  | 'ceremonial'      // Ceremonial prose
  | 'card';           // UI card content

/**
 * Complete schema map
 */
export interface CathedralSchemaMap {
  version: string;
  generatedAt: Date;
  modules: ModuleDefinition[];
  types: TypeDefinition[];
  dataFlow: DataFlowEdge[];
  timingFlow: TimingFlowNode[];
  narrativeFlow: NarrativeFlowNode[];
  statistics: SchemaStatistics;
}

/**
 * Schema statistics
 */
export interface SchemaStatistics {
  totalModules: number;
  byCategory: Record<ModuleCategory, number>;
  byStatus: Record<ModuleImplementationStatus, number>;
  totalTypes: number;
  totalFlowEdges: number;
  avgDependencies: number;
}

// ============================================================================
// MODULE REGISTRY
// ============================================================================

/**
 * Complete module registry
 */
export const MODULE_REGISTRY: ModuleDefinition[] = [
  // ============================================================================
  // CORE ENGINES
  // ============================================================================
  {
    id: 'baziCore',
    name: 'BaZi Core Engine',
    nameChinese: '八字核心引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziCore.ts',
    description: 'Core Four Pillars calculation engine',
    dependencies: [],
    dependents: ['baziSynastryHeatmap', 'baziCompositeChart', 'baziDayMaster'],
    exports: ['calculateBaZi', 'getPillar', 'getStem', 'getBranch'],
    inputs: [{ typeName: 'Date', sourceModule: 'native', description: 'Birth date' }],
    outputs: [{ typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' }],
    tags: ['foundation', 'pillars']
  },
  {
    id: 'baziDayMaster',
    name: 'Day Master Analysis',
    nameChinese: '日主分析',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziDayMaster.ts',
    description: 'Day Master strength and element analysis',
    dependencies: ['baziCore'],
    dependents: ['baziUsefulGod', 'baziCompositeChart'],
    exports: ['analyzeDayMaster', 'getDayMasterStrength'],
    inputs: [{ typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' }],
    outputs: [{ typeName: 'DayMasterAnalysis', sourceModule: 'baziDayMaster', description: 'Day Master analysis result' }],
    tags: ['daymaster', 'strength']
  },
  {
    id: 'baziTenGods',
    name: 'Ten Gods Engine',
    nameChinese: '十神引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziTenGods.ts',
    description: 'Ten Gods relationship calculation',
    dependencies: ['baziCore', 'baziDayMaster'],
    dependents: ['baziCompositeChart', 'baziLifeThemes'],
    exports: ['calculateTenGods', 'getTenGodRelation'],
    inputs: [{ typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' }],
    outputs: [{ typeName: 'TenGodsResult', sourceModule: 'baziTenGods', description: 'Ten Gods configuration' }],
    tags: ['tengods', 'relationships']
  },
  {
    id: 'baziUsefulGod',
    name: 'Useful God Engine',
    nameChinese: '用神引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziUsefulGod.ts',
    description: 'Useful God (用神) and Annoying God (忌神) determination',
    dependencies: ['baziCore', 'baziDayMaster', 'baziTenGods'],
    dependents: ['baziCompositeChart', 'baziLuckPillarFavorability'],
    exports: ['determineUsefulGod', 'getElementFavorability'],
    inputs: [
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' },
      { typeName: 'DayMasterAnalysis', sourceModule: 'baziDayMaster', description: 'Day Master analysis' }
    ],
    outputs: [{ typeName: 'UsefulGodResult', sourceModule: 'baziUsefulGod', description: 'Useful God determination' }],
    tags: ['usefulgod', 'favorability']
  },
  {
    id: 'baziShenSha',
    name: 'Shen Sha Engine',
    nameChinese: '神煞引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziShenSha.ts',
    description: 'Symbolic stars (神煞) calculation',
    dependencies: ['baziCore'],
    dependents: ['baziCompositeChart'],
    exports: ['calculateShenSha', 'getShenShaByPillar'],
    inputs: [{ typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' }],
    outputs: [{ typeName: 'ShenShaResult', sourceModule: 'baziShenSha', description: 'Shen Sha list' }],
    tags: ['shensha', 'stars']
  },
  {
    id: 'baziConflicts',
    name: 'Conflicts Engine',
    nameChinese: '冲害刑破引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziConflicts.ts',
    description: 'Branch conflicts (冲害刑破) detection',
    dependencies: ['baziCore'],
    dependents: ['baziSynastryHeatmap', 'baziCompositeEventTrigger'],
    exports: ['detectConflicts', 'getClash', 'getHarm', 'getPunishment', 'getDestruction'],
    inputs: [{ typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' }],
    outputs: [{ typeName: 'ConflictsResult', sourceModule: 'baziConflicts', description: 'Conflicts detection result' }],
    tags: ['conflicts', 'clashes']
  },
  {
    id: 'baziCombinations',
    name: 'Combinations Engine',
    nameChinese: '合会引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziCombinations.ts',
    description: 'Stem and Branch combinations detection',
    dependencies: ['baziCore'],
    dependents: ['baziSynastryHeatmap', 'baziCompositeChart'],
    exports: ['detectCombinations', 'getStemCombine', 'getBranchCombine', 'getThreeHarmony'],
    inputs: [{ typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Four Pillars chart' }],
    outputs: [{ typeName: 'CombinationsResult', sourceModule: 'baziCombinations', description: 'Combinations detection result' }],
    tags: ['combinations', 'harmony']
  },

  // ============================================================================
  // SYNASTRY & COMPOSITE
  // ============================================================================
  {
    id: 'baziSynastryHeatmap',
    name: 'Synastry Heatmap Engine',
    nameChinese: '合盘热力图引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziSynastryHeatmap.ts',
    description: 'Pillar-by-pillar compatibility heatmap',
    dependencies: ['baziCore', 'baziConflicts', 'baziCombinations'],
    dependents: ['baziCompositeChart', 'baziCompositeForecastReport'],
    exports: ['calculateSynastryHeatmap', 'getCellScore'],
    inputs: [
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Partner A chart' },
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Partner B chart' }
    ],
    outputs: [{ typeName: 'SynastryHeatmap', sourceModule: 'baziSynastryHeatmap', description: '4x4 synastry grid' }],
    tags: ['synastry', 'compatibility', 'heatmap']
  },
  {
    id: 'baziCompositeChart',
    name: 'Composite Chart Engine',
    nameChinese: '合盘命盘引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziCompositeChart.ts',
    description: 'Relationship entity chart calculation',
    dependencies: ['baziCore', 'baziDayMaster', 'baziTenGods', 'baziUsefulGod', 'baziShenSha', 'baziSynastryHeatmap'],
    dependents: ['baziLifeThemes', 'baziRelationshipArchetypes', 'baziCompositeEventTrigger', 'baziCompositeForecastReport'],
    exports: ['calculateCompositeChart', 'getCompositeDayMaster'],
    inputs: [
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Partner A chart' },
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Partner B chart' }
    ],
    outputs: [{ typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite relationship chart' }],
    tags: ['composite', 'relationship', 'chart']
  },

  // ============================================================================
  // RELATIONSHIP ANALYSIS
  // ============================================================================
  {
    id: 'baziLifeThemes',
    name: 'Life Themes Engine',
    nameChinese: '人生主题引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziLifeThemes.ts',
    description: 'Extracts life themes, destiny arc, and karmic signature',
    dependencies: ['baziCompositeChart', 'baziTenGods'],
    dependents: ['baziCompositeForecastReport'],
    exports: ['extractLifeThemes', 'getEssenceTheme', 'getShadowTheme'],
    inputs: [{ typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite chart' }],
    outputs: [{ typeName: 'LifeThemes', sourceModule: 'baziLifeThemes', description: 'Life themes analysis' }],
    tags: ['themes', 'destiny', 'karmic']
  },
  {
    id: 'baziRelationshipArchetypes',
    name: 'Relationship Archetypes Engine',
    nameChinese: '关系原型引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziRelationshipArchetypes.ts',
    description: 'Identifies mythic relationship archetypes',
    dependencies: ['baziCompositeChart', 'baziLifeThemes'],
    dependents: ['baziCompositeForecastReport'],
    exports: ['identifyArchetypes', 'getPrimaryArchetype', 'getArchetypeNarrative'],
    inputs: [
      { typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite chart' },
      { typeName: 'LifeThemes', sourceModule: 'baziLifeThemes', description: 'Life themes', isOptional: true }
    ],
    outputs: [{ typeName: 'RelationshipArchetypeResult', sourceModule: 'baziRelationshipArchetypes', description: 'Archetype analysis' }],
    tags: ['archetypes', 'mythic', 'narrative']
  },
  {
    id: 'baziRelationshipLifecycle',
    name: 'Relationship Lifecycle Model',
    nameChinese: '关系生命周期模型',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziRelationshipLifecycle.ts',
    description: 'Seven-phase relationship lifecycle tracking',
    dependencies: ['baziCompositeChart'],
    dependents: ['baziRelationshipDecisionEngine', 'baziCompositeForecastReport'],
    exports: ['analyzeLifecycle', 'getCurrentPhase', 'predictPhaseTransition'],
    inputs: [
      { typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite chart' },
      { typeName: 'number', sourceModule: 'native', description: 'Relationship age in years' }
    ],
    outputs: [{ typeName: 'RelationshipLifecycleResult', sourceModule: 'baziRelationshipLifecycle', description: 'Lifecycle analysis' }],
    tags: ['lifecycle', 'phases', 'journey']
  },
  {
    id: 'baziMultiRelationshipMapping',
    name: 'Multi-Relationship Mapping Engine',
    nameChinese: '多关系映射引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziMultiRelationshipMapping.ts',
    description: 'Maps multiple relationships into constellation',
    dependencies: ['baziCompositeChart', 'baziSynastryHeatmap'],
    dependents: ['baziCompositeForecastReport'],
    exports: ['buildRelationshipConstellation', 'analyzeTriad', 'findCentralNode'],
    inputs: [{ typeName: 'CompositeChart[]', sourceModule: 'baziCompositeChart', description: 'Multiple composite charts', isArray: true }],
    outputs: [{ typeName: 'RelationshipConstellation', sourceModule: 'baziMultiRelationshipMapping', description: 'Constellation map' }],
    tags: ['constellation', 'family', 'network']
  },

  // ============================================================================
  // TIMING MODULES
  // ============================================================================
  {
    id: 'baziLuckPillarFavorability',
    name: 'Luck Pillar Favorability Engine',
    nameChinese: '大运喜忌引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziLuckPillarFavorability.ts',
    description: '10-year luck pillar favorability assessment',
    dependencies: ['baziCore', 'baziUsefulGod'],
    dependents: ['baziAnnualLuckFavorability', 'baziCompositeEventTrigger'],
    exports: ['analyzeLuckPillarFavorability', 'getLuckPillarScore'],
    inputs: [
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Natal chart' },
      { typeName: 'UsefulGodResult', sourceModule: 'baziUsefulGod', description: 'Useful God' }
    ],
    outputs: [{ typeName: 'LuckPillarFavorabilityResult', sourceModule: 'baziLuckPillarFavorability', description: 'Luck pillar analysis' }],
    tags: ['timing', 'luckpillar', 'dayun']
  },
  {
    id: 'baziAnnualLuckFavorability',
    name: 'Annual Luck Favorability Engine',
    nameChinese: '流年喜忌引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziAnnualLuckFavorability.ts',
    description: 'Year-by-year luck favorability',
    dependencies: ['baziCore', 'baziUsefulGod', 'baziLuckPillarFavorability'],
    dependents: ['baziMonthlyLuckFavorability', 'baziCompositeEventTrigger'],
    exports: ['analyzeAnnualFavorability', 'getYearScore'],
    inputs: [
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Natal chart' },
      { typeName: 'number', sourceModule: 'native', description: 'Year to analyze' }
    ],
    outputs: [{ typeName: 'AnnualLuckResult', sourceModule: 'baziAnnualLuckFavorability', description: 'Annual luck analysis' }],
    tags: ['timing', 'annual', 'liunian']
  },
  {
    id: 'baziMonthlyLuckFavorability',
    name: 'Monthly Luck Favorability Engine',
    nameChinese: '流月喜忌引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziMonthlyLuckFavorability.ts',
    description: 'Month-by-month luck favorability',
    dependencies: ['baziCore', 'baziUsefulGod', 'baziAnnualLuckFavorability'],
    dependents: ['baziCompositeEventTrigger'],
    exports: ['analyzeMonthlyFavorability', 'getMonthScore'],
    inputs: [
      { typeName: 'BaZiChart', sourceModule: 'baziCore', description: 'Natal chart' },
      { typeName: 'number', sourceModule: 'native', description: 'Year' },
      { typeName: 'number', sourceModule: 'native', description: 'Month' }
    ],
    outputs: [{ typeName: 'MonthlyLuckResult', sourceModule: 'baziMonthlyLuckFavorability', description: 'Monthly luck analysis' }],
    tags: ['timing', 'monthly', 'liuyue']
  },
  {
    id: 'baziCompositeEventTrigger',
    name: 'Composite Event Trigger Engine',
    nameChinese: '合盘应期引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziCompositeEventTrigger.ts',
    description: 'Event trigger window detection for relationships',
    dependencies: ['baziCompositeChart', 'baziLuckPillarFavorability', 'baziAnnualLuckFavorability', 'baziMonthlyLuckFavorability', 'baziConflicts'],
    dependents: ['baziRelationshipDecisionEngine', 'baziCompositeForecastReport'],
    exports: ['detectEventTriggers', 'getEventWindows'],
    inputs: [
      { typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite chart' },
      { typeName: 'number', sourceModule: 'native', description: 'Year range start' },
      { typeName: 'number', sourceModule: 'native', description: 'Year range end' }
    ],
    outputs: [{ typeName: 'CompositeEventTriggerResult', sourceModule: 'baziCompositeEventTrigger', description: 'Event trigger analysis' }],
    tags: ['timing', 'events', 'yingqi']
  },
  {
    id: 'baziTrajectory',
    name: 'Trajectory Curve Engine',
    nameChinese: '运势曲线引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziTrajectory.ts',
    description: 'Destiny trajectory curves over time',
    dependencies: ['baziCompositeChart', 'baziLuckPillarFavorability'],
    dependents: ['baziRelationshipDecisionEngine', 'baziCompositeForecastReport'],
    exports: ['calculateTrajectory', 'getCurvePoints', 'identifyPeaksValleys'],
    inputs: [{ typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite chart' }],
    outputs: [{ typeName: 'TrajectoryCurve', sourceModule: 'baziTrajectory', description: 'Trajectory curve data' }],
    tags: ['trajectory', 'curves', 'destiny']
  },

  // ============================================================================
  // DECISION & GUIDANCE
  // ============================================================================
  {
    id: 'baziRelationshipDecisionEngine',
    name: 'Relationship Decision Engine',
    nameChinese: '关系决策引擎',
    category: 'engine',
    status: 'complete',
    path: 'src/utils/baziRelationshipDecisionEngine.ts',
    description: 'Timing-aware decision support for relationships',
    dependencies: ['baziCompositeChart', 'baziCompositeEventTrigger', 'baziRelationshipLifecycle', 'baziTrajectory'],
    dependents: ['baziCompositeForecastReport'],
    exports: ['evaluateDecision', 'getOptimalTiming', 'generateGuidance'],
    inputs: [
      { typeName: 'CompositeChart', sourceModule: 'baziCompositeChart', description: 'Composite chart' },
      { typeName: 'CompositeEventTriggerResult', sourceModule: 'baziCompositeEventTrigger', description: 'Event triggers' },
      { typeName: 'RelationshipLifecycleResult', sourceModule: 'baziRelationshipLifecycle', description: 'Lifecycle phase' },
      { typeName: 'TrajectoryCurve', sourceModule: 'baziTrajectory', description: 'Trajectory curve' }
    ],
    outputs: [{ typeName: 'DecisionEvaluation', sourceModule: 'baziRelationshipDecisionEngine', description: 'Decision guidance' }],
    tags: ['decision', 'guidance', 'timing']
  },

  // ============================================================================
  // REPORT GENERATION
  // ============================================================================
  {
    id: 'baziCompositeForecastReport',
    name: 'Composite Forecast Report Generator',
    nameChinese: '合盘预测报告生成器',
    category: 'report',
    status: 'complete',
    path: 'src/utils/baziCompositeForecastReport.ts',
    description: 'Ten-chapter forecast report generator',
    dependencies: [
      'baziCompositeChart', 'baziSynastryHeatmap', 'baziLifeThemes',
      'baziRelationshipArchetypes', 'baziRelationshipLifecycle',
      'baziCompositeEventTrigger', 'baziTrajectory', 'baziRelationshipDecisionEngine'
    ],
    dependents: ['compositeReportRenderer', 'compositeNarrativeEnhancer'],
    exports: ['generateCompositeForecastReport', 'generateExecutiveSummary', 'formatReportForUI'],
    inputs: [{ typeName: 'ForecastReportInput', sourceModule: 'baziCompositeForecastReport', description: 'All analysis results' }],
    outputs: [{ typeName: 'CompositeForecastReport', sourceModule: 'baziCompositeForecastReport', description: 'Complete 10-chapter report' }],
    tags: ['report', 'narrative', 'chapters']
  },
  {
    id: 'compositeReportRenderer',
    name: 'Composite Report Renderer',
    nameChinese: '合盘报告渲染器',
    category: 'renderer',
    status: 'complete',
    path: 'src/utils/compositeReportRenderer.ts',
    description: 'HTML/PDF rendering for reports',
    dependencies: ['baziCompositeForecastReport'],
    dependents: [],
    exports: ['renderCompositeReportHtml', 'markdownToHtml', 'generateReportCss'],
    inputs: [{ typeName: 'CompositeReportAssets', sourceModule: 'compositeReportRenderer', description: 'Report and assets' }],
    outputs: [{ typeName: 'RenderedReport', sourceModule: 'compositeReportRenderer', description: 'HTML/CSS bundle' }],
    tags: ['render', 'html', 'pdf', 'export']
  },
  {
    id: 'compositeNarrativeEnhancer',
    name: 'AI Narrative Enhancer',
    nameChinese: '叙事增强器',
    category: 'report',
    status: 'complete',
    path: 'src/utils/compositeNarrativeEnhancer.ts',
    description: 'LLM-powered narrative expansion',
    dependencies: ['baziCompositeForecastReport'],
    dependents: [],
    exports: ['enhanceReport', 'enhanceChapter', 'buildChapterSystemPrompt'],
    inputs: [
      { typeName: 'CompositeForecastReport', sourceModule: 'baziCompositeForecastReport', description: 'Original report' },
      { typeName: 'NarrativeEnhanceOptions', sourceModule: 'compositeNarrativeEnhancer', description: 'Enhancement options' }
    ],
    outputs: [{ typeName: 'EnhancedReport', sourceModule: 'compositeNarrativeEnhancer', description: 'Enhanced report' }],
    tags: ['ai', 'llm', 'narrative', 'enhancement']
  },

  // ============================================================================
  // CATHEDRAL INDEX
  // ============================================================================
  {
    id: 'cathedralIndexTypes',
    name: 'Cathedral Index Types',
    nameChinese: '大教堂索引类型',
    category: 'type',
    status: 'complete',
    path: 'src/cathedral/indexTypes.ts',
    description: 'Type definitions for cathedral index system',
    dependencies: [],
    dependents: ['cathedralIndexData', 'cathedralNarrativeGenerator', 'cathedralRoutes'],
    exports: ['WingId', 'ModuleStatus', 'CathedralItem', 'CathedralWing', 'CathedralIndex', 'WING_CONFIGS'],
    inputs: [],
    outputs: [],
    tags: ['types', 'cathedral', 'index']
  },
  {
    id: 'cathedralIndexData',
    name: 'Cathedral Index Data',
    nameChinese: '大教堂索引数据',
    category: 'data',
    status: 'complete',
    path: 'src/cathedral/indexData.ts',
    description: 'Complete module mapping and index builders',
    dependencies: ['cathedralIndexTypes'],
    dependents: ['cathedralNarrativeGenerator', 'cathedralIndexPage'],
    exports: ['ALL_WINGS', 'buildCathedralIndex', 'buildCoupleIndex', 'computeCathedralStats'],
    inputs: [{ typeName: 'CathedralSubject', sourceModule: 'cathedralIndexTypes', description: 'Subject info' }],
    outputs: [{ typeName: 'CathedralIndex', sourceModule: 'cathedralIndexTypes', description: 'Complete index' }],
    tags: ['data', 'cathedral', 'index']
  },
  {
    id: 'cathedralNarrativeGenerator',
    name: 'Cathedral Narrative Generator',
    nameChinese: '大教堂叙事生成器',
    category: 'report',
    status: 'complete',
    path: 'src/cathedral/narrativeGenerator.ts',
    description: 'Generates ceremonial prose from index',
    dependencies: ['cathedralIndexTypes', 'cathedralIndexData'],
    dependents: [],
    exports: ['generateCeremonialNarrative', 'generateRelationshipDedication', 'generateProgressReport'],
    inputs: [{ typeName: 'CathedralIndex', sourceModule: 'cathedralIndexTypes', description: 'Cathedral index' }],
    outputs: [{ typeName: 'string', sourceModule: 'native', description: 'Narrative prose' }],
    tags: ['narrative', 'ceremonial', 'cathedral']
  },
  {
    id: 'cathedralIndexPage',
    name: 'Cathedral Index Page',
    nameChinese: '大教堂索引页面',
    category: 'page',
    status: 'complete',
    path: 'src/cathedral/CathedralIndexPage.tsx',
    description: 'React component for cathedral navigation',
    dependencies: ['cathedralIndexTypes', 'cathedralIndexData'],
    dependents: ['cathedralRoutes'],
    exports: ['CathedralIndexPage'],
    inputs: [],
    outputs: [],
    tags: ['ui', 'react', 'cathedral']
  },
  {
    id: 'cathedralRoutes',
    name: 'Cathedral Routes',
    nameChinese: '大教堂路由',
    category: 'component',
    status: 'complete',
    path: 'src/cathedral/CathedralRoutes.tsx',
    description: 'Multi-page navigation and routing',
    dependencies: ['cathedralIndexTypes', 'cathedralIndexData', 'cathedralIndexPage'],
    dependents: [],
    exports: ['CathedralRoutes', 'CathedralProvider', 'useCathedral'],
    inputs: [],
    outputs: [],
    tags: ['routing', 'navigation', 'cathedral']
  },
  {
    id: 'cathedralSchemaMap',
    name: 'Cathedral Schema Map',
    nameChinese: '大教堂架构图',
    category: 'data',
    status: 'complete',
    path: 'src/cathedral/cathedralSchemaMap.ts',
    description: 'Complete architectural blueprint',
    dependencies: [],
    dependents: [],
    exports: ['MODULE_REGISTRY', 'TYPE_REGISTRY', 'buildSchemaMap'],
    inputs: [],
    outputs: [{ typeName: 'CathedralSchemaMap', sourceModule: 'cathedralSchemaMap', description: 'Complete schema map' }],
    tags: ['architecture', 'schema', 'map']
  }
];

// ============================================================================
// TYPE REGISTRY
// ============================================================================

/**
 * Complete type registry
 */
export const TYPE_REGISTRY: TypeDefinition[] = [
  // Core Types
  {
    name: 'BaZiChart',
    nameChinese: '八字命盘',
    sourceModule: 'baziCore',
    category: 'interface',
    description: 'Four Pillars natal chart',
    properties: [
      { name: 'yearPillar', type: 'Pillar', description: 'Year pillar', optional: false },
      { name: 'monthPillar', type: 'Pillar', description: 'Month pillar', optional: false },
      { name: 'dayPillar', type: 'Pillar', description: 'Day pillar', optional: false },
      { name: 'hourPillar', type: 'Pillar', description: 'Hour pillar', optional: false }
    ],
    usedBy: ['baziCore', 'baziDayMaster', 'baziTenGods', 'baziSynastryHeatmap'],
    relatedTypes: ['Pillar', 'Stem', 'Branch']
  },
  {
    name: 'CompositeChart',
    nameChinese: '合盘命盘',
    sourceModule: 'baziCompositeChart',
    category: 'interface',
    description: 'Relationship composite chart',
    properties: [
      { name: 'dayMaster', type: 'DayMasterAnalysis', description: 'Composite day master', optional: false },
      { name: 'usefulGod', type: 'UsefulGodResult', description: 'Composite useful god', optional: true },
      { name: 'luckPillars', type: 'CompositeLuckPillar[]', description: 'Luck pillars', optional: true }
    ],
    usedBy: ['baziCompositeChart', 'baziLifeThemes', 'baziRelationshipArchetypes', 'baziCompositeForecastReport'],
    relatedTypes: ['DayMasterAnalysis', 'UsefulGodResult', 'CompositeLuckPillar', 'CompositeShenSha']
  },
  {
    name: 'SynastryHeatmap',
    nameChinese: '合盘热力图',
    sourceModule: 'baziSynastryHeatmap',
    category: 'interface',
    description: '4x4 pillar compatibility grid',
    properties: [
      { name: 'grid', type: 'SynastryCell[][]', description: '4x4 grid', optional: false },
      { name: 'overallScore', type: 'number', description: 'Total score', optional: false },
      { name: 'strongestHarmony', type: 'SynastryCell', description: 'Best match', optional: true }
    ],
    usedBy: ['baziSynastryHeatmap', 'baziCompositeChart', 'baziCompositeForecastReport'],
    relatedTypes: ['SynastryCell', 'PillarMatch']
  },
  {
    name: 'CompositeForecastReport',
    nameChinese: '合盘预测报告',
    sourceModule: 'baziCompositeForecastReport',
    category: 'interface',
    description: 'Complete 10-chapter report',
    properties: [
      { name: 'chapters', type: 'ReportChapter[]', description: '10 chapters', optional: false },
      { name: 'summary', type: 'string', description: 'Executive summary', optional: false },
      { name: 'fullNarrative', type: 'string', description: 'Full markdown', optional: false }
    ],
    usedBy: ['baziCompositeForecastReport', 'compositeReportRenderer', 'compositeNarrativeEnhancer'],
    relatedTypes: ['ReportChapter', 'PartnerInfo', 'ForecastReportInput']
  },
  {
    name: 'CathedralIndex',
    nameChinese: '大教堂索引',
    sourceModule: 'cathedralIndexTypes',
    category: 'interface',
    description: 'Complete cathedral navigation index',
    properties: [
      { name: 'subject', type: 'CathedralSubject', description: 'Subject info', optional: false },
      { name: 'wings', type: 'CathedralWing[]', description: 'Seven wings', optional: false },
      { name: 'metadata', type: 'CathedralMetadata', description: 'Index metadata', optional: false }
    ],
    usedBy: ['cathedralIndexData', 'cathedralNarrativeGenerator', 'cathedralIndexPage'],
    relatedTypes: ['CathedralSubject', 'CathedralWing', 'CathedralSection', 'CathedralItem']
  },
  {
    name: 'EnhancedReport',
    nameChinese: '增强报告',
    sourceModule: 'compositeNarrativeEnhancer',
    category: 'interface',
    description: 'LLM-enhanced report',
    properties: [
      { name: 'chapters', type: 'EnhancedChapter[]', description: 'Enhanced chapters', optional: false },
      { name: 'enhancedSummary', type: 'string', description: 'Enhanced summary', optional: false },
      { name: 'options', type: 'NarrativeEnhanceOptions', description: 'Enhancement options', optional: false }
    ],
    usedBy: ['compositeNarrativeEnhancer'],
    relatedTypes: ['EnhancedChapter', 'NarrativeEnhanceOptions', 'NarrativeTone', 'NarrativeDepth']
  },

  // Enum Types
  {
    name: 'ElementName',
    nameChinese: '五行',
    sourceModule: 'baziCore',
    category: 'type',
    description: 'Five Elements',
    enumValues: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
    usedBy: ['baziCore', 'baziDayMaster', 'baziUsefulGod', 'baziCompositeChart'],
    relatedTypes: []
  },
  {
    name: 'NarrativeTone',
    nameChinese: '叙事语调',
    sourceModule: 'compositeNarrativeEnhancer',
    category: 'type',
    description: 'Narrative tone options',
    enumValues: ['gentle', 'neutral', 'technical', 'poetic'],
    usedBy: ['compositeNarrativeEnhancer'],
    relatedTypes: ['NarrativeDepth', 'NarrativeEnhanceOptions']
  },
  {
    name: 'NarrativeDepth',
    nameChinese: '叙事深度',
    sourceModule: 'compositeNarrativeEnhancer',
    category: 'type',
    description: 'Narrative depth options',
    enumValues: ['beginner', 'intermediate', 'expert'],
    usedBy: ['compositeNarrativeEnhancer'],
    relatedTypes: ['NarrativeTone', 'NarrativeEnhanceOptions']
  },
  {
    name: 'WingId',
    nameChinese: '翼标识',
    sourceModule: 'cathedralIndexTypes',
    category: 'type',
    description: 'Cathedral wing identifiers',
    enumValues: ['coreIdentity', 'relationship', 'timing', 'familySystem', 'decision', 'reports', 'archive'],
    usedBy: ['cathedralIndexTypes', 'cathedralIndexData'],
    relatedTypes: ['CathedralWing', 'WingConfig']
  }
];

// ============================================================================
// DATA FLOW GRAPH
// ============================================================================

/**
 * Data flow edges
 */
export const DATA_FLOW_EDGES: DataFlowEdge[] = [
  // Core flow
  {
    id: 'flow-1',
    from: 'baziCore',
    to: 'baziDayMaster',
    dataType: 'BaZiChart',
    direction: 'output',
    description: 'Natal chart to day master analysis',
    isRequired: true
  },
  {
    id: 'flow-2',
    from: 'baziDayMaster',
    to: 'baziUsefulGod',
    dataType: 'DayMasterAnalysis',
    direction: 'output',
    description: 'Day master to useful god determination',
    isRequired: true
  },
  {
    id: 'flow-3',
    from: 'baziCore',
    to: 'baziSynastryHeatmap',
    dataType: 'BaZiChart',
    direction: 'output',
    description: 'Two charts to synastry analysis',
    isRequired: true
  },
  {
    id: 'flow-4',
    from: 'baziSynastryHeatmap',
    to: 'baziCompositeChart',
    dataType: 'SynastryHeatmap',
    direction: 'output',
    description: 'Synastry feeds composite calculation',
    isRequired: false
  },
  {
    id: 'flow-5',
    from: 'baziCompositeChart',
    to: 'baziLifeThemes',
    dataType: 'CompositeChart',
    direction: 'output',
    description: 'Composite to life themes',
    isRequired: true
  },
  {
    id: 'flow-6',
    from: 'baziCompositeChart',
    to: 'baziRelationshipArchetypes',
    dataType: 'CompositeChart',
    direction: 'output',
    description: 'Composite to archetypes',
    isRequired: true
  },
  {
    id: 'flow-7',
    from: 'baziCompositeChart',
    to: 'baziCompositeEventTrigger',
    dataType: 'CompositeChart',
    direction: 'output',
    description: 'Composite to event triggers',
    isRequired: true
  },
  {
    id: 'flow-8',
    from: 'baziCompositeEventTrigger',
    to: 'baziRelationshipDecisionEngine',
    dataType: 'CompositeEventTriggerResult',
    direction: 'output',
    description: 'Events to decision engine',
    isRequired: true
  },
  {
    id: 'flow-9',
    from: 'baziCompositeForecastReport',
    to: 'compositeReportRenderer',
    dataType: 'CompositeForecastReport',
    direction: 'output',
    description: 'Report to renderer',
    isRequired: true
  },
  {
    id: 'flow-10',
    from: 'baziCompositeForecastReport',
    to: 'compositeNarrativeEnhancer',
    dataType: 'CompositeForecastReport',
    direction: 'output',
    description: 'Report to AI enhancer',
    isRequired: true
  }
];

// ============================================================================
// TIMING FLOW
// ============================================================================

/**
 * Timing flow nodes
 */
export const TIMING_FLOW_NODES: TimingFlowNode[] = [
  {
    id: 'timing-1',
    moduleId: 'baziCore',
    order: 1,
    layer: 'natal',
    description: 'Birth chart calculation (static foundation)',
    dependencies: [],
    outputs: ['BaZiChart']
  },
  {
    id: 'timing-2',
    moduleId: 'baziCompositeChart',
    order: 2,
    layer: 'composite',
    description: 'Composite chart generation',
    dependencies: ['timing-1'],
    outputs: ['CompositeChart']
  },
  {
    id: 'timing-3',
    moduleId: 'baziLuckPillarFavorability',
    order: 3,
    layer: 'luckPillar',
    description: '10-year cycle analysis',
    dependencies: ['timing-1', 'timing-2'],
    outputs: ['LuckPillarFavorabilityResult']
  },
  {
    id: 'timing-4',
    moduleId: 'baziAnnualLuckFavorability',
    order: 4,
    layer: 'annual',
    description: 'Yearly cycle analysis',
    dependencies: ['timing-3'],
    outputs: ['AnnualLuckResult']
  },
  {
    id: 'timing-5',
    moduleId: 'baziMonthlyLuckFavorability',
    order: 5,
    layer: 'monthly',
    description: 'Monthly cycle analysis',
    dependencies: ['timing-4'],
    outputs: ['MonthlyLuckResult']
  },
  {
    id: 'timing-6',
    moduleId: 'baziCompositeEventTrigger',
    order: 6,
    layer: 'event',
    description: 'Event trigger detection',
    dependencies: ['timing-3', 'timing-4', 'timing-5'],
    outputs: ['CompositeEventTriggerResult']
  }
];

// ============================================================================
// NARRATIVE FLOW
// ============================================================================

/**
 * Narrative flow nodes
 */
export const NARRATIVE_FLOW_NODES: NarrativeFlowNode[] = [
  {
    id: 'narrative-1',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 1,
    narrativeType: 'chapter',
    inputs: ['CompositeChart'],
    outputs: ['ReportChapter'],
    tone: 'grounding',
    description: 'Chapter 1: Relationship Essence'
  },
  {
    id: 'narrative-2',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 2,
    narrativeType: 'chapter',
    inputs: ['SynastryHeatmap'],
    outputs: ['ReportChapter'],
    tone: 'connection',
    description: 'Chapter 2: Synastry Overview'
  },
  {
    id: 'narrative-3',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 3,
    narrativeType: 'chapter',
    inputs: ['CompositeChart', 'TenGodsResult', 'UsefulGodResult', 'ShenShaResult'],
    outputs: ['ReportChapter'],
    tone: 'revelation',
    description: 'Chapter 3: Composite Chart Interpretation'
  },
  {
    id: 'narrative-4',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 4,
    narrativeType: 'chapter',
    inputs: ['RelationshipArchetypeResult'],
    outputs: ['ReportChapter'],
    tone: 'mythic',
    description: 'Chapter 4: Relationship Archetype'
  },
  {
    id: 'narrative-5',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 5,
    narrativeType: 'chapter',
    inputs: ['LifeThemes'],
    outputs: ['ReportChapter'],
    tone: 'depth',
    description: 'Chapter 5: Life Themes'
  },
  {
    id: 'narrative-6',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 6,
    narrativeType: 'chapter',
    inputs: ['RelationshipLifecycleResult'],
    outputs: ['ReportChapter'],
    tone: 'orientation',
    description: 'Chapter 6: Relationship Lifecycle Phase'
  },
  {
    id: 'narrative-7',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 7,
    narrativeType: 'chapter',
    inputs: ['LuckPillarFavorabilityResult', 'AnnualLuckResult'],
    outputs: ['ReportChapter'],
    tone: 'anticipation',
    description: 'Chapter 7: Composite Timing Forecast'
  },
  {
    id: 'narrative-8',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 8,
    narrativeType: 'chapter',
    inputs: ['CompositeEventTriggerResult'],
    outputs: ['ReportChapter'],
    tone: 'alert',
    description: 'Chapter 8: Event Trigger Windows'
  },
  {
    id: 'narrative-9',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 9,
    narrativeType: 'chapter',
    inputs: ['TrajectoryCurve'],
    outputs: ['ReportChapter'],
    tone: 'perspective',
    description: 'Chapter 9: Destiny Trajectory Curves'
  },
  {
    id: 'narrative-10',
    moduleId: 'baziCompositeForecastReport',
    chapterNumber: 10,
    narrativeType: 'chapter',
    inputs: ['CompositeChart', 'SynastryHeatmap', 'RelationshipLifecycleResult'],
    outputs: ['ReportChapter'],
    tone: 'integration',
    description: 'Chapter 10: Guidance & Integration'
  },
  {
    id: 'narrative-summary',
    moduleId: 'baziCompositeForecastReport',
    narrativeType: 'summary',
    inputs: ['CompositeChart', 'SynastryHeatmap', 'RelationshipArchetypeResult', 'RelationshipLifecycleResult'],
    outputs: ['string'],
    description: 'Executive Summary'
  },
  {
    id: 'narrative-dedication',
    moduleId: 'cathedralNarrativeGenerator',
    narrativeType: 'dedication',
    inputs: ['CathedralIndex'],
    outputs: ['string'],
    description: 'Relationship Dedication'
  },
  {
    id: 'narrative-ceremonial',
    moduleId: 'cathedralNarrativeGenerator',
    narrativeType: 'ceremonial',
    inputs: ['CathedralIndex'],
    outputs: ['string'],
    description: 'Ceremonial Cathedral Narrative'
  }
];

// ============================================================================
// SCHEMA MAP BUILDER
// ============================================================================

/**
 * Build the complete schema map
 */
export function buildSchemaMap(): CathedralSchemaMap {
  const statistics = computeStatistics();

  return {
    version: '1.0.0',
    generatedAt: new Date(),
    modules: MODULE_REGISTRY,
    types: TYPE_REGISTRY,
    dataFlow: DATA_FLOW_EDGES,
    timingFlow: TIMING_FLOW_NODES,
    narrativeFlow: NARRATIVE_FLOW_NODES,
    statistics
  };
}

/**
 * Compute statistics
 */
function computeStatistics(): SchemaStatistics {
  const byCategory: Record<ModuleCategory, number> = {
    engine: 0, service: 0, utility: 0, type: 0, component: 0,
    page: 0, data: 0, hook: 0, context: 0, report: 0, renderer: 0
  };

  const byStatus: Record<ModuleImplementationStatus, number> = {
    complete: 0, implemented: 0, partial: 0, planned: 0, deprecated: 0
  };

  let totalDeps = 0;

  for (const mod of MODULE_REGISTRY) {
    byCategory[mod.category]++;
    byStatus[mod.status]++;
    totalDeps += mod.dependencies.length;
  }

  return {
    totalModules: MODULE_REGISTRY.length,
    byCategory,
    byStatus,
    totalTypes: TYPE_REGISTRY.length,
    totalFlowEdges: DATA_FLOW_EDGES.length,
    avgDependencies: totalDeps / MODULE_REGISTRY.length
  };
}

// ============================================================================
// QUERY UTILITIES
// ============================================================================

/**
 * Get module by ID
 */
export function getModuleById(id: string): ModuleDefinition | undefined {
  return MODULE_REGISTRY.find(m => m.id === id);
}

/**
 * Get modules by category
 */
export function getModulesByCategory(category: ModuleCategory): ModuleDefinition[] {
  return MODULE_REGISTRY.filter(m => m.category === category);
}

/**
 * Get modules by status
 */
export function getModulesByStatus(status: ModuleImplementationStatus): ModuleDefinition[] {
  return MODULE_REGISTRY.filter(m => m.status === status);
}

/**
 * Get module dependencies (recursive)
 */
export function getModuleDependenciesDeep(moduleId: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function traverse(id: string): void {
    if (visited.has(id)) return;
    visited.add(id);

    const mod = getModuleById(id);
    if (!mod) return;

    for (const depId of mod.dependencies) {
      result.push(depId);
      traverse(depId);
    }
  }

  traverse(moduleId);
  return result;
}

/**
 * Get module dependents (who depends on this)
 */
export function getModuleDependents(moduleId: string): string[] {
  return MODULE_REGISTRY
    .filter(m => m.dependencies.includes(moduleId))
    .map(m => m.id);
}

/**
 * Get type by name
 */
export function getTypeByName(name: string): TypeDefinition | undefined {
  return TYPE_REGISTRY.find(t => t.name === name);
}

/**
 * Get types used by module
 */
export function getTypesUsedByModule(moduleId: string): TypeDefinition[] {
  return TYPE_REGISTRY.filter(t => t.usedBy.includes(moduleId));
}

/**
 * Get data flow for module
 */
export function getDataFlowForModule(moduleId: string): {
  inputs: DataFlowEdge[];
  outputs: DataFlowEdge[];
} {
  return {
    inputs: DATA_FLOW_EDGES.filter(e => e.to === moduleId),
    outputs: DATA_FLOW_EDGES.filter(e => e.from === moduleId)
  };
}

/**
 * Get timing flow for layer
 */
export function getTimingFlowByLayer(layer: TimingLayer): TimingFlowNode[] {
  return TIMING_FLOW_NODES.filter(n => n.layer === layer);
}

/**
 * Get narrative flow for chapter
 */
export function getNarrativeFlowByChapter(chapterNumber: number): NarrativeFlowNode | undefined {
  return NARRATIVE_FLOW_NODES.find(n => n.chapterNumber === chapterNumber);
}

// ============================================================================
// VISUALIZATION HELPERS
// ============================================================================

/**
 * Generate Mermaid diagram for data flow
 */
export function generateDataFlowMermaid(): string {
  const lines: string[] = ['graph LR'];

  for (const edge of DATA_FLOW_EDGES) {
    const from = getModuleById(edge.from);
    const to = getModuleById(edge.to);
    if (from && to) {
      lines.push(`  ${from.id}[${from.name}] --> |${edge.dataType}| ${to.id}[${to.name}]`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate Mermaid diagram for timing flow
 */
export function generateTimingFlowMermaid(): string {
  const lines: string[] = ['graph TD'];

  for (const node of TIMING_FLOW_NODES) {
    const mod = getModuleById(node.moduleId);
    if (mod) {
      lines.push(`  ${node.id}[${mod.name}<br/>${node.layer}]`);
    }
  }

  for (const node of TIMING_FLOW_NODES) {
    for (const depId of node.dependencies) {
      lines.push(`  ${depId} --> ${node.id}`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate dependency tree text
 */
export function generateDependencyTree(rootModuleId: string, indent: number = 0): string {
  const mod = getModuleById(rootModuleId);
  if (!mod) return '';

  const prefix = '  '.repeat(indent);
  const lines: string[] = [`${prefix}├── ${mod.name} (${mod.category})`];

  for (const depId of mod.dependencies) {
    lines.push(generateDependencyTree(depId, indent + 1));
  }

  return lines.join('\n');
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export schema map as JSON
 */
export function exportSchemaMapAsJSON(): string {
  const map = buildSchemaMap();
  return JSON.stringify(map, null, 2);
}

/**
 * Export schema map as markdown documentation
 */
export function exportSchemaMapAsMarkdown(): string {
  const map = buildSchemaMap();
  const parts: string[] = [];

  parts.push('# Cathedral Schema Map');
  parts.push('');
  parts.push(`Generated: ${map.generatedAt.toISOString()}`);
  parts.push(`Version: ${map.version}`);
  parts.push('');

  // Statistics
  parts.push('## Statistics');
  parts.push('');
  parts.push(`- Total Modules: ${map.statistics.totalModules}`);
  parts.push(`- Total Types: ${map.statistics.totalTypes}`);
  parts.push(`- Total Flow Edges: ${map.statistics.totalFlowEdges}`);
  parts.push(`- Average Dependencies: ${map.statistics.avgDependencies.toFixed(1)}`);
  parts.push('');

  // Modules by category
  parts.push('### Modules by Category');
  parts.push('');
  const categoryEntries = Object.entries(map.statistics.byCategory) as [ModuleCategory, number][];
  for (const [cat, count] of categoryEntries) {
    if (count > 0) {
      parts.push(`- ${cat}: ${count}`);
    }
  }
  parts.push('');

  // Modules by status
  parts.push('### Modules by Status');
  parts.push('');
  const statusEntries = Object.entries(map.statistics.byStatus) as [ModuleImplementationStatus, number][];
  for (const [status, count] of statusEntries) {
    if (count > 0) {
      parts.push(`- ${status}: ${count}`);
    }
  }
  parts.push('');

  // Module list
  parts.push('## Modules');
  parts.push('');
  for (const mod of map.modules) {
    parts.push(`### ${mod.name} (${mod.nameChinese})`);
    parts.push('');
    parts.push(`- **ID:** ${mod.id}`);
    parts.push(`- **Category:** ${mod.category}`);
    parts.push(`- **Status:** ${mod.status}`);
    parts.push(`- **Path:** \`${mod.path}\``);
    parts.push(`- **Description:** ${mod.description}`);
    if (mod.dependencies.length > 0) {
      parts.push(`- **Dependencies:** ${mod.dependencies.join(', ')}`);
    }
    if (mod.exports.length > 0) {
      parts.push(`- **Exports:** \`${mod.exports.join('`, `')}\``);
    }
    parts.push('');
  }

  // Types
  parts.push('## Types');
  parts.push('');
  for (const type of map.types) {
    parts.push(`### ${type.name} (${type.nameChinese})`);
    parts.push('');
    parts.push(`- **Category:** ${type.category}`);
    parts.push(`- **Source:** ${type.sourceModule}`);
    parts.push(`- **Description:** ${type.description}`);
    if (type.enumValues) {
      parts.push(`- **Values:** ${type.enumValues.join(', ')}`);
    }
    parts.push('');
  }

  return parts.join('\n');
}
