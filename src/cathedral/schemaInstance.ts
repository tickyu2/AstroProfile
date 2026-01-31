/**
 * ============================================================================
 * CATHEDRAL SCHEMA INSTANCE (大教堂架构实例)
 * ============================================================================
 *
 * The complete, living instance of the Cathedral Schema.
 * Every module, type, and flow edge is wired here - this is the source of truth
 * for the entire Genesis Soul system architecture.
 *
 * Use Cases:
 * - AI agent navigation (understands what modules exist and how they connect)
 * - Dependency visualization (generate diagrams)
 * - Documentation generation (produce API docs)
 * - Build validation (ensure all dependencies are satisfied)
 * - Runtime introspection (know what's available)
 *
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Module category
 */
export type SchemaModuleCategory =
  | 'natal'        // Individual chart calculations
  | 'relationship' // Synastry, composite, archetypes
  | 'timing'       // Luck pillars, annual, monthly, events
  | 'system'       // Multi-relationship, family
  | 'decision'     // Decision support
  | 'report'       // Report generation
  | 'ui';          // Renderers

/**
 * Module definition
 */
export interface SchemaModule {
  id: string;
  label: string;
  labelChinese: string;
  category: SchemaModuleCategory;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  sourceFile?: string;
  exports?: string[];
}

/**
 * Type field definition
 */
export interface SchemaTypeField {
  name: string;
  type: string;
  description?: string;
  optional?: boolean;
}

/**
 * Type definition
 */
export interface SchemaType {
  id: string;
  label: string;
  labelChinese: string;
  description: string;
  fields: SchemaTypeField[];
}

/**
 * Data flow edge
 */
export interface DataFlowEdge {
  from: string;
  to: string;
  viaType: string;
  description?: string;
}

/**
 * Timing flow edge
 */
export interface TimingFlowEdge {
  fromModule: string;
  toModule: string;
  layer: 'natal' | 'luckPillar' | 'annual' | 'monthly' | 'daily' | 'event';
  description?: string;
}

/**
 * Narrative flow edge
 */
export interface NarrativeFlowEdge {
  fromModule: string;
  toChapter: string;
  chapterNumber?: number;
  description?: string;
}

/**
 * Complete schema
 */
export interface CathedralSchema {
  version: string;
  generatedAt: Date;
  modules: SchemaModule[];
  types: SchemaType[];
  flows: {
    dataFlow: DataFlowEdge[];
    timingFlow: TimingFlowEdge[];
    narrativeFlow: NarrativeFlowEdge[];
  };
}

// ============================================================================
// MODULE DEFINITIONS
// ============================================================================

/**
 * All modules in the cathedral
 */
export const SCHEMA_MODULES: SchemaModule[] = [
  // ============================================================================
  // NATAL MODULES
  // ============================================================================
  {
    id: 'natalChartEngine',
    label: 'Natal Chart Engine',
    labelChinese: '命盘引擎',
    category: 'natal',
    description: 'Core Four Pillars calculation from birth data',
    inputTypes: ['BirthData'],
    outputTypes: ['Pillars', 'ElementDistribution', 'TenGods', 'UsefulGod', 'ShenSha'],
    sourceFile: 'src/utils/baziCore.ts',
    exports: ['calculateBaZi', 'getPillar', 'getStem', 'getBranch']
  },
  {
    id: 'dayMasterEngine',
    label: 'Day Master Analysis Engine',
    labelChinese: '日主分析引擎',
    category: 'natal',
    description: 'Day Master strength and polarity analysis',
    inputTypes: ['Pillars'],
    outputTypes: ['DayMasterAnalysis'],
    sourceFile: 'src/utils/baziDayMaster.ts',
    exports: ['analyzeDayMaster', 'getDayMasterStrength']
  },
  {
    id: 'tenGodsEngine',
    label: 'Ten Gods Engine',
    labelChinese: '十神引擎',
    category: 'natal',
    description: 'Ten Gods relationship calculation',
    inputTypes: ['Pillars', 'DayMasterAnalysis'],
    outputTypes: ['TenGods'],
    sourceFile: 'src/utils/baziTenGods.ts',
    exports: ['calculateTenGods', 'getTenGodRelation']
  },
  {
    id: 'usefulGodEngine',
    label: 'Useful God Engine',
    labelChinese: '用神引擎',
    category: 'natal',
    description: 'Useful God (用神) and Annoying God (忌神) determination',
    inputTypes: ['Pillars', 'DayMasterAnalysis', 'TenGods'],
    outputTypes: ['UsefulGod'],
    sourceFile: 'src/utils/baziUsefulGod.ts',
    exports: ['determineUsefulGod', 'getElementFavorability']
  },
  {
    id: 'shenShaEngine',
    label: 'Shen Sha Engine',
    labelChinese: '神煞引擎',
    category: 'natal',
    description: 'Symbolic stars (神煞) calculation',
    inputTypes: ['Pillars'],
    outputTypes: ['ShenSha'],
    sourceFile: 'src/utils/baziShenSha.ts',
    exports: ['calculateShenSha', 'getShenShaByPillar']
  },
  {
    id: 'conflictsEngine',
    label: 'Conflicts Engine',
    labelChinese: '冲害刑破引擎',
    category: 'natal',
    description: 'Branch conflicts (冲害刑破) detection',
    inputTypes: ['Pillars'],
    outputTypes: ['Conflicts'],
    sourceFile: 'src/utils/baziConflicts.ts',
    exports: ['detectConflicts', 'getClash', 'getHarm', 'getPunishment']
  },
  {
    id: 'combinationsEngine',
    label: 'Combinations Engine',
    labelChinese: '合会引擎',
    category: 'natal',
    description: 'Stem and Branch combinations detection',
    inputTypes: ['Pillars'],
    outputTypes: ['Combinations'],
    sourceFile: 'src/utils/baziCombinations.ts',
    exports: ['detectCombinations', 'getStemCombine', 'getBranchCombine']
  },
  {
    id: 'lifeThemeEngine',
    label: 'Life Theme Extraction Engine',
    labelChinese: '人生主题引擎',
    category: 'natal',
    description: 'Extracts life themes, destiny arc, and karmic signature',
    inputTypes: ['Pillars', 'ElementDistribution', 'TenGods'],
    outputTypes: ['LifeThemes'],
    sourceFile: 'src/utils/baziLifeThemes.ts',
    exports: ['extractLifeThemes', 'getEssenceTheme', 'getShadowTheme']
  },

  // ============================================================================
  // RELATIONSHIP MODULES
  // ============================================================================
  {
    id: 'synastryEngine',
    label: 'Synastry Engine',
    labelChinese: '合盘引擎',
    category: 'relationship',
    description: 'Pillar-by-pillar compatibility heatmap',
    inputTypes: ['Pillars', 'Pillars'],
    outputTypes: ['SynastryHeatmap', 'SynastrySummary'],
    sourceFile: 'src/utils/baziSynastryHeatmap.ts',
    exports: ['calculateSynastryHeatmap', 'getCellScore']
  },
  {
    id: 'compositeChartEngine',
    label: 'Composite Chart Engine',
    labelChinese: '合盘命盘引擎',
    category: 'relationship',
    description: 'Relationship entity chart calculation',
    inputTypes: ['Pillars', 'Pillars'],
    outputTypes: ['CompositeChart'],
    sourceFile: 'src/utils/baziCompositeChart.ts',
    exports: ['calculateCompositeChart', 'getCompositeDayMaster']
  },
  {
    id: 'archetypeEngine',
    label: 'Relationship Archetype Engine',
    labelChinese: '关系原型引擎',
    category: 'relationship',
    description: 'Identifies mythic relationship archetypes',
    inputTypes: ['CompositeChart', 'SynastryHeatmap', 'LifeThemes'],
    outputTypes: ['RelationshipArchetypeResult'],
    sourceFile: 'src/utils/baziRelationshipArchetypes.ts',
    exports: ['identifyArchetypes', 'getPrimaryArchetype', 'getArchetypeNarrative']
  },
  {
    id: 'lifecycleEngine',
    label: 'Relationship Lifecycle Engine',
    labelChinese: '关系生命周期引擎',
    category: 'relationship',
    description: 'Seven-phase relationship lifecycle tracking',
    inputTypes: ['CompositeChart', 'CompositeTiming', 'SynastrySummary', 'TrajectoryCurve'],
    outputTypes: ['LifecycleResult'],
    sourceFile: 'src/utils/baziRelationshipLifecycle.ts',
    exports: ['analyzeLifecycle', 'getCurrentPhase', 'predictPhaseTransition']
  },

  // ============================================================================
  // TIMING MODULES
  // ============================================================================
  {
    id: 'timingEngine',
    label: 'Individual Timing Engine',
    labelChinese: '个人时序引擎',
    category: 'timing',
    description: 'Individual luck pillar, annual, monthly cycles',
    inputTypes: ['Pillars'],
    outputTypes: ['TimingLayers'],
    sourceFile: 'src/utils/baziLuckPillarFavorability.ts',
    exports: ['analyzeLuckPillarFavorability', 'getLuckPillarScore']
  },
  {
    id: 'compositeTimingEngine',
    label: 'Composite Timing Engine',
    labelChinese: '合盘时序引擎',
    category: 'timing',
    description: 'Composite relationship timing cycles',
    inputTypes: ['CompositeChart'],
    outputTypes: ['CompositeTiming'],
    sourceFile: 'src/utils/baziAnnualLuckFavorability.ts',
    exports: ['analyzeAnnualFavorability', 'getYearScore']
  },
  {
    id: 'monthlyTimingEngine',
    label: 'Monthly Timing Engine',
    labelChinese: '流月引擎',
    category: 'timing',
    description: 'Monthly luck favorability analysis',
    inputTypes: ['Pillars', 'TimingLayers'],
    outputTypes: ['MonthlyTiming'],
    sourceFile: 'src/utils/baziMonthlyLuckFavorability.ts',
    exports: ['analyzeMonthlyFavorability', 'getMonthScore']
  },
  {
    id: 'eventTriggerEngine',
    label: 'Composite Event Trigger Engine',
    labelChinese: '合盘应期引擎',
    category: 'timing',
    description: 'Event trigger window detection for relationships',
    inputTypes: ['CompositeChart', 'SynastryHeatmap', 'TimingLayers', 'CompositeTiming'],
    outputTypes: ['CompositeEventTriggerResult'],
    sourceFile: 'src/utils/baziCompositeEventTrigger.ts',
    exports: ['detectEventTriggers', 'getEventWindows']
  },
  {
    id: 'trajectoryEngine',
    label: 'Destiny Trajectory Engine',
    labelChinese: '运势曲线引擎',
    category: 'timing',
    description: 'Destiny trajectory curves over time',
    inputTypes: ['TimingLayers', 'CompositeTiming'],
    outputTypes: ['TrajectoryCurve'],
    sourceFile: 'src/utils/baziTrajectory.ts',
    exports: ['calculateTrajectory', 'getCurvePoints', 'identifyPeaksValleys']
  },

  // ============================================================================
  // SYSTEM / FAMILY MODULES
  // ============================================================================
  {
    id: 'multiRelationshipGraph',
    label: 'Multi-Relationship Graph Engine',
    labelChinese: '多关系图引擎',
    category: 'system',
    description: 'Maps multiple relationships into constellation',
    inputTypes: ['Pillars[]'],
    outputTypes: ['RelationshipGraph'],
    sourceFile: 'src/utils/baziMultiRelationshipMapping.ts',
    exports: ['buildRelationshipConstellation', 'analyzeTriad', 'findCentralNode']
  },
  {
    id: 'familyConstellationEngine',
    label: 'Family Constellation Engine',
    labelChinese: '家庭星座引擎',
    category: 'system',
    description: 'Family system analysis and dynamics',
    inputTypes: ['RelationshipGraph'],
    outputTypes: ['FamilyConstellation'],
    sourceFile: 'src/utils/baziFamilyConstellation.ts',
    exports: ['analyzeFamilyConstellation', 'getSystemicPatterns']
  },

  // ============================================================================
  // DECISION MODULE
  // ============================================================================
  {
    id: 'decisionEngine',
    label: 'Relationship Decision Engine',
    labelChinese: '关系决策引擎',
    category: 'decision',
    description: 'Timing-aware decision support for relationships',
    inputTypes: [
      'CompositeChart',
      'LifecycleResult',
      'SynastrySummary',
      'CompositeEventTriggerResult',
      'TrajectoryCurve'
    ],
    outputTypes: ['DecisionGuidance'],
    sourceFile: 'src/utils/baziRelationshipDecisionEngine.ts',
    exports: ['evaluateDecision', 'getOptimalTiming', 'generateGuidance']
  },

  // ============================================================================
  // REPORT MODULES
  // ============================================================================
  {
    id: 'compositeReportGenerator',
    label: 'Composite Forecast Report Generator',
    labelChinese: '合盘预测报告生成器',
    category: 'report',
    description: 'Ten-chapter forecast report generator',
    inputTypes: [
      'CompositeChart',
      'SynastryHeatmap',
      'LifecycleResult',
      'CompositeEventTriggerResult',
      'TrajectoryCurve',
      'RelationshipArchetypeResult',
      'LifeThemes'
    ],
    outputTypes: ['CompositeReportMarkdown', 'CompositeReportChapters'],
    sourceFile: 'src/utils/baziCompositeForecastReport.ts',
    exports: ['generateCompositeForecastReport', 'generateExecutiveSummary', 'formatReportForUI']
  },
  {
    id: 'narrativeEnhancer',
    label: 'AI Narrative Enhancer',
    labelChinese: '叙事增强器',
    category: 'report',
    description: 'LLM-powered narrative expansion',
    inputTypes: ['CompositeReportChapters', 'NarrativeEnhanceOptions'],
    outputTypes: ['EnhancedReport'],
    sourceFile: 'src/utils/compositeNarrativeEnhancer.ts',
    exports: ['enhanceReport', 'enhanceChapter', 'buildChapterSystemPrompt']
  },
  {
    id: 'htmlRenderer',
    label: 'HTML Renderer',
    labelChinese: 'HTML渲染器',
    category: 'ui',
    description: 'HTML/CSS rendering for reports',
    inputTypes: ['CompositeReportMarkdown', 'Charts'],
    outputTypes: ['CompositeReportHtml'],
    sourceFile: 'src/utils/compositeReportRenderer.ts',
    exports: ['renderCompositeReportHtml', 'markdownToHtml', 'generateReportCss']
  },
  {
    id: 'pdfRenderer',
    label: 'PDF Renderer',
    labelChinese: 'PDF渲染器',
    category: 'ui',
    description: 'PDF generation from HTML',
    inputTypes: ['CompositeReportHtml'],
    outputTypes: ['CompositeReportPdf'],
    sourceFile: 'src/utils/compositeReportRenderer.ts',
    exports: ['renderCompositeReportPdf']
  }
];

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * All types in the cathedral
 */
export const SCHEMA_TYPES: SchemaType[] = [
  // Input Types
  {
    id: 'BirthData',
    label: 'Birth Data',
    labelChinese: '出生数据',
    description: 'Input data for chart calculation',
    fields: [
      { name: 'date', type: 'string', description: 'Birth date (YYYY-MM-DD)' },
      { name: 'time', type: 'string', description: 'Birth time (HH:MM)', optional: true },
      { name: 'location', type: 'string', description: 'Birth location', optional: true },
      { name: 'timezone', type: 'string', description: 'Timezone', optional: true }
    ]
  },

  // Core Types
  {
    id: 'Pillars',
    label: 'Four Pillars',
    labelChinese: '四柱',
    description: 'Complete Four Pillars chart',
    fields: [
      { name: 'yearStem', type: 'string', description: 'Year Heavenly Stem' },
      { name: 'yearBranch', type: 'string', description: 'Year Earthly Branch' },
      { name: 'monthStem', type: 'string', description: 'Month Heavenly Stem' },
      { name: 'monthBranch', type: 'string', description: 'Month Earthly Branch' },
      { name: 'dayStem', type: 'string', description: 'Day Heavenly Stem (Day Master)' },
      { name: 'dayBranch', type: 'string', description: 'Day Earthly Branch' },
      { name: 'hourStem', type: 'string', description: 'Hour Heavenly Stem' },
      { name: 'hourBranch', type: 'string', description: 'Hour Earthly Branch' }
    ]
  },
  {
    id: 'DayMasterAnalysis',
    label: 'Day Master Analysis',
    labelChinese: '日主分析',
    description: 'Day Master strength and characteristics',
    fields: [
      { name: 'element', type: 'ElementName', description: 'Day Master element' },
      { name: 'polarity', type: 'string', description: 'Yin or Yang' },
      { name: 'chineseName', type: 'string', description: 'Chinese character' },
      { name: 'strengthScore', type: 'number', description: 'Strength 0-100' },
      { name: 'strengthCategory', type: 'string', description: 'very_strong/strong/balanced/weak/very_weak' }
    ]
  },
  {
    id: 'ElementDistribution',
    label: 'Element Distribution',
    labelChinese: '五行分布',
    description: 'Distribution of Five Elements in chart',
    fields: [
      { name: 'wood', type: 'number', description: 'Wood percentage' },
      { name: 'fire', type: 'number', description: 'Fire percentage' },
      { name: 'earth', type: 'number', description: 'Earth percentage' },
      { name: 'metal', type: 'number', description: 'Metal percentage' },
      { name: 'water', type: 'number', description: 'Water percentage' },
      { name: 'dominant', type: 'ElementName', description: 'Dominant element', optional: true },
      { name: 'weakest', type: 'ElementName', description: 'Weakest element', optional: true }
    ]
  },
  {
    id: 'TenGods',
    label: 'Ten Gods',
    labelChinese: '十神',
    description: 'Ten Gods configuration',
    fields: [
      { name: 'dominant', type: 'string', description: 'Dominant god' },
      { name: 'dominantChinese', type: 'string', description: 'Chinese name' },
      { name: 'stars', type: 'Record<string, number>', description: 'All gods with counts' },
      { name: 'interpretation', type: 'string', description: 'Overall interpretation', optional: true }
    ]
  },
  {
    id: 'UsefulGod',
    label: 'Useful God',
    labelChinese: '用神',
    description: 'Useful God determination',
    fields: [
      { name: 'element', type: 'ElementName', description: 'Useful God element' },
      { name: 'chineseName', type: 'string', description: 'Chinese name' },
      { name: 'reason', type: 'string', description: 'Why this element' },
      { name: 'supportingElements', type: 'ElementName[]', description: 'Supporting elements' },
      { name: 'avoidElements', type: 'ElementName[]', description: 'Elements to avoid' },
      { name: 'stabilizingAdvice', type: 'string', description: 'Practical guidance', optional: true }
    ]
  },
  {
    id: 'ShenSha',
    label: 'Shen Sha',
    labelChinese: '神煞',
    description: 'Symbolic stars',
    fields: [
      { name: 'name', type: 'string', description: 'English name' },
      { name: 'chineseName', type: 'string', description: 'Chinese name' },
      { name: 'nature', type: 'string', description: 'auspicious/neutral/inauspicious' },
      { name: 'description', type: 'string', description: 'General meaning' },
      { name: 'relationshipMeaning', type: 'string', description: 'Meaning for relationships', optional: true }
    ]
  },
  {
    id: 'Conflicts',
    label: 'Conflicts',
    labelChinese: '冲害刑破',
    description: 'Branch conflicts detection',
    fields: [
      { name: 'clashes', type: 'array', description: 'Six Clashes (六冲)' },
      { name: 'harms', type: 'array', description: 'Six Harms (六害)' },
      { name: 'punishments', type: 'array', description: 'Punishments (刑)' },
      { name: 'destructions', type: 'array', description: 'Destructions (破)' }
    ]
  },
  {
    id: 'Combinations',
    label: 'Combinations',
    labelChinese: '合会',
    description: 'Stem and branch combinations',
    fields: [
      { name: 'stemCombinations', type: 'array', description: 'Heavenly Stem combinations' },
      { name: 'branchCombinations', type: 'array', description: 'Earthly Branch combinations' },
      { name: 'threeHarmonies', type: 'array', description: 'Three Harmony combinations' },
      { name: 'sixHarmonies', type: 'array', description: 'Six Harmony combinations' }
    ]
  },
  {
    id: 'LifeThemes',
    label: 'Life Themes',
    labelChinese: '人生主题',
    description: 'Life themes and destiny arc',
    fields: [
      { name: 'essence', type: 'object', description: 'Core essence theme' },
      { name: 'dynamics', type: 'object', description: 'Dynamic movement theme' },
      { name: 'shadow', type: 'object', description: 'Shadow theme' },
      { name: 'destinyArc', type: 'object', description: 'Destiny arc' },
      { name: 'karmic', type: 'object', description: 'Karmic signature' }
    ]
  },

  // Relationship Types
  {
    id: 'SynastryHeatmap',
    label: 'Synastry Heatmap',
    labelChinese: '合盘热力图',
    description: '4x4 pillar compatibility grid',
    fields: [
      { name: 'grid', type: 'SynastryCell[][]', description: '4x4 grid of cell scores' },
      { name: 'overallScore', type: 'number', description: 'Total compatibility score' },
      { name: 'strongestHarmony', type: 'SynastryCell', description: 'Best match', optional: true },
      { name: 'strongestTension', type: 'SynastryCell', description: 'Most tension', optional: true },
      { name: 'romanceHotspots', type: 'SynastryCell[]', description: 'Romantic activations', optional: true }
    ]
  },
  {
    id: 'SynastrySummary',
    label: 'Synastry Summary',
    labelChinese: '合盘摘要',
    description: 'Summary of synastry analysis',
    fields: [
      { name: 'harmonyScore', type: 'number', description: 'Total harmony points' },
      { name: 'tensionScore', type: 'number', description: 'Total tension points' },
      { name: 'overallScore', type: 'number', description: 'Net compatibility score' },
      { name: 'keyInsights', type: 'string[]', description: 'Key insights' }
    ]
  },
  {
    id: 'CompositeChart',
    label: 'Composite Chart',
    labelChinese: '合盘命盘',
    description: 'Relationship entity chart',
    fields: [
      { name: 'pillars', type: 'Pillars', description: 'Composite pillars' },
      { name: 'dayMaster', type: 'DayMasterAnalysis', description: 'Composite Day Master' },
      { name: 'elementDistribution', type: 'ElementDistribution', description: 'Element breakdown' },
      { name: 'tenGods', type: 'TenGods', description: 'Ten Gods configuration' },
      { name: 'usefulGod', type: 'UsefulGod', description: 'Composite Useful God' },
      { name: 'shenSha', type: 'ShenSha[]', description: 'Symbolic stars' },
      { name: 'luckPillars', type: 'CompositeLuckPillar[]', description: 'Luck pillars', optional: true }
    ]
  },
  {
    id: 'RelationshipArchetypeResult',
    label: 'Relationship Archetype Result',
    labelChinese: '关系原型结果',
    description: 'Archetype identification result',
    fields: [
      { name: 'primary', type: 'Archetype', description: 'Primary archetype' },
      { name: 'secondary', type: 'Archetype', description: 'Secondary archetype', optional: true },
      { name: 'primaryScore', type: 'number', description: 'Primary match score' },
      { name: 'primaryMatchFactors', type: 'string[]', description: 'Why this archetype' },
      { name: 'mythicNarrative', type: 'string', description: 'Narrative story', optional: true }
    ]
  },

  // Timing Types
  {
    id: 'TimingLayers',
    label: 'Timing Layers',
    labelChinese: '时序层',
    description: 'All timing cycles for an individual',
    fields: [
      { name: 'luckPillars', type: 'LuckPillar[]', description: '10-year cycles' },
      { name: 'annual', type: 'AnnualLuck[]', description: 'Yearly cycles' },
      { name: 'monthly', type: 'MonthlyLuck[]', description: 'Monthly cycles' },
      { name: 'daily', type: 'DailyLuck[]', description: 'Daily cycles', optional: true }
    ]
  },
  {
    id: 'CompositeTiming',
    label: 'Composite Timing',
    labelChinese: '合盘时序',
    description: 'Timing cycles for relationship',
    fields: [
      { name: 'luckPillars', type: 'CompositeLuckPillar[]', description: '10-year cycles' },
      { name: 'annual', type: 'CompositeAnnualLuck[]', description: 'Yearly cycles' },
      { name: 'monthly', type: 'CompositeMonthlyLuck[]', description: 'Monthly cycles' }
    ]
  },
  {
    id: 'CompositeEventTriggerResult',
    label: 'Composite Event Trigger Result',
    labelChinese: '合盘应期结果',
    description: 'Event trigger windows',
    fields: [
      { name: 'synastryResonance', type: 'object', description: 'Synastry activations' },
      { name: 'relationshipEvent', type: 'object', description: 'Relationship events' },
      { name: 'growthEvent', type: 'object', description: 'Growth events' },
      { name: 'challengeEvent', type: 'object', description: 'Challenge events' },
      { name: 'windows', type: 'EventWindow[]', description: 'All event windows' }
    ]
  },
  {
    id: 'TrajectoryCurve',
    label: 'Trajectory Curve',
    labelChinese: '运势曲线',
    description: 'Destiny trajectory over time',
    fields: [
      { name: 'domain', type: 'string', description: 'Domain (overall/relationship/wealth/etc)' },
      { name: 'domainChinese', type: 'string', description: 'Chinese domain name' },
      { name: 'points', type: 'TrajectoryPoint[]', description: 'Curve points' },
      { name: 'peaks', type: 'TrajectoryPoint[]', description: 'Peak periods' },
      { name: 'valleys', type: 'TrajectoryPoint[]', description: 'Valley periods' },
      { name: 'overallTrend', type: 'string', description: 'ascending/descending/stable' },
      { name: 'overallNarrative', type: 'string', description: 'Narrative summary', optional: true }
    ]
  },
  {
    id: 'LifecycleResult',
    label: 'Lifecycle Result',
    labelChinese: '生命周期结果',
    description: 'Relationship lifecycle phase',
    fields: [
      { name: 'currentPhase', type: 'PhaseDefinition', description: 'Current phase' },
      { name: 'currentPhaseScore', type: 'number', description: 'Phase match score' },
      { name: 'currentPhaseMatchFactors', type: 'string[]', description: 'Why this phase' },
      { name: 'upcomingPhase', type: 'PhaseDefinition', description: 'Next phase', optional: true },
      { name: 'longTermPhase', type: 'PhaseDefinition', description: 'Destination phase', optional: true },
      { name: 'currentAdvice', type: 'string[]', description: 'Phase guidance' },
      { name: 'futureOutlook', type: 'string', description: 'Future narrative', optional: true }
    ]
  },

  // System Types
  {
    id: 'RelationshipGraph',
    label: 'Relationship Graph',
    labelChinese: '关系图',
    description: 'Multi-relationship constellation',
    fields: [
      { name: 'nodes', type: 'GraphNode[]', description: 'People nodes' },
      { name: 'edges', type: 'GraphEdge[]', description: 'Relationship edges' },
      { name: 'centralNode', type: 'string', description: 'Central person ID', optional: true },
      { name: 'clusters', type: 'Cluster[]', description: 'Relationship clusters', optional: true }
    ]
  },
  {
    id: 'FamilyConstellation',
    label: 'Family Constellation',
    labelChinese: '家庭星座',
    description: 'Family system analysis',
    fields: [
      { name: 'generational', type: 'object', description: 'Generational patterns' },
      { name: 'systemic', type: 'object', description: 'Systemic dynamics' },
      { name: 'timing', type: 'object', description: 'Family timing cycles' },
      { name: 'insights', type: 'string[]', description: 'Key insights' }
    ]
  },

  // Decision Types
  {
    id: 'DecisionGuidance',
    label: 'Decision Guidance',
    labelChinese: '决策指导',
    description: 'Decision support output',
    fields: [
      { name: 'overallScore', type: 'number', description: 'Decision favorability 0-100' },
      { name: 'tier', type: 'string', description: 'excellent/good/neutral/caution/wait' },
      { name: 'domainScores', type: 'Record<string, number>', description: 'Per-domain scores' },
      { name: 'optimalWindows', type: 'TimeWindow[]', description: 'Best timing windows' },
      { name: 'guidance', type: 'string[]', description: 'Actionable guidance' },
      { name: 'cautions', type: 'string[]', description: 'Things to watch' }
    ]
  },

  // Report Types
  {
    id: 'CompositeReportMarkdown',
    label: 'Composite Report Markdown',
    labelChinese: '合盘报告Markdown',
    description: 'Full report as markdown',
    fields: [
      { name: 'content', type: 'string', description: 'Full markdown content' },
      { name: 'wordCount', type: 'number', description: 'Word count' }
    ]
  },
  {
    id: 'CompositeReportChapters',
    label: 'Composite Report Chapters',
    labelChinese: '合盘报告章节',
    description: 'Structured chapter array',
    fields: [
      { name: 'chapters', type: 'ReportChapter[]', description: '10 chapters' },
      { name: 'summary', type: 'string', description: 'Executive summary' }
    ]
  },
  {
    id: 'EnhancedReport',
    label: 'Enhanced Report',
    labelChinese: '增强报告',
    description: 'AI-enhanced report',
    fields: [
      { name: 'chapters', type: 'EnhancedChapter[]', description: 'Enhanced chapters' },
      { name: 'enhancedSummary', type: 'string', description: 'Enhanced summary' },
      { name: 'options', type: 'NarrativeEnhanceOptions', description: 'Options used' },
      { name: 'stats', type: 'EnhancementStats', description: 'Enhancement statistics' }
    ]
  },
  {
    id: 'Charts',
    label: 'Charts',
    labelChinese: '图表',
    description: 'SVG chart assets',
    fields: [
      { name: 'synastryHeatmapSvg', type: 'string', description: 'Synastry heatmap SVG', optional: true },
      { name: 'destinyCurveSvg', type: 'string', description: 'Trajectory curve SVG', optional: true },
      { name: 'elementRadarSvg', type: 'string', description: 'Element radar SVG', optional: true },
      { name: 'lifecyclePhaseSvg', type: 'string', description: 'Lifecycle phase SVG', optional: true }
    ]
  },
  {
    id: 'CompositeReportHtml',
    label: 'Composite Report HTML',
    labelChinese: '合盘报告HTML',
    description: 'Rendered HTML report',
    fields: [
      { name: 'html', type: 'string', description: 'Full HTML document' },
      { name: 'css', type: 'string', description: 'Associated CSS' },
      { name: 'theme', type: 'string', description: 'Theme used' }
    ]
  },
  {
    id: 'CompositeReportPdf',
    label: 'Composite Report PDF',
    labelChinese: '合盘报告PDF',
    description: 'PDF buffer',
    fields: [
      { name: 'buffer', type: 'Buffer', description: 'PDF binary data' },
      { name: 'pageCount', type: 'number', description: 'Number of pages' }
    ]
  },

  // Options Types
  {
    id: 'NarrativeEnhanceOptions',
    label: 'Narrative Enhance Options',
    labelChinese: '叙事增强选项',
    description: 'Options for AI enhancement',
    fields: [
      { name: 'tone', type: 'NarrativeTone', description: 'gentle/neutral/technical/poetic' },
      { name: 'depth', type: 'NarrativeDepth', description: 'beginner/intermediate/expert' },
      { name: 'includeMetaphors', type: 'boolean', description: 'Include metaphors' },
      { name: 'includeAdvice', type: 'boolean', description: 'Include practical advice' },
      { name: 'language', type: 'string', description: 'en/zh/bilingual' }
    ]
  }
];

// ============================================================================
// DATA FLOW EDGES
// ============================================================================

/**
 * All data flow edges
 */
export const DATA_FLOW: DataFlowEdge[] = [
  // Natal flow
  { from: 'natalChartEngine', to: 'dayMasterEngine', viaType: 'Pillars' },
  { from: 'natalChartEngine', to: 'tenGodsEngine', viaType: 'Pillars' },
  { from: 'dayMasterEngine', to: 'tenGodsEngine', viaType: 'DayMasterAnalysis' },
  { from: 'natalChartEngine', to: 'usefulGodEngine', viaType: 'Pillars' },
  { from: 'dayMasterEngine', to: 'usefulGodEngine', viaType: 'DayMasterAnalysis' },
  { from: 'tenGodsEngine', to: 'usefulGodEngine', viaType: 'TenGods' },
  { from: 'natalChartEngine', to: 'shenShaEngine', viaType: 'Pillars' },
  { from: 'natalChartEngine', to: 'conflictsEngine', viaType: 'Pillars' },
  { from: 'natalChartEngine', to: 'combinationsEngine', viaType: 'Pillars' },
  { from: 'natalChartEngine', to: 'lifeThemeEngine', viaType: 'Pillars' },
  { from: 'natalChartEngine', to: 'lifeThemeEngine', viaType: 'ElementDistribution' },
  { from: 'tenGodsEngine', to: 'lifeThemeEngine', viaType: 'TenGods' },

  // Synastry & Composite flow
  { from: 'natalChartEngine', to: 'synastryEngine', viaType: 'Pillars' },
  { from: 'natalChartEngine', to: 'compositeChartEngine', viaType: 'Pillars' },
  { from: 'conflictsEngine', to: 'synastryEngine', viaType: 'Conflicts' },
  { from: 'combinationsEngine', to: 'synastryEngine', viaType: 'Combinations' },

  // Archetype flow
  { from: 'synastryEngine', to: 'archetypeEngine', viaType: 'SynastryHeatmap' },
  { from: 'compositeChartEngine', to: 'archetypeEngine', viaType: 'CompositeChart' },
  { from: 'lifeThemeEngine', to: 'archetypeEngine', viaType: 'LifeThemes' },

  // Timing flow
  { from: 'natalChartEngine', to: 'timingEngine', viaType: 'Pillars' },
  { from: 'compositeChartEngine', to: 'compositeTimingEngine', viaType: 'CompositeChart' },
  { from: 'timingEngine', to: 'monthlyTimingEngine', viaType: 'TimingLayers' },
  { from: 'compositeTimingEngine', to: 'eventTriggerEngine', viaType: 'CompositeTiming' },
  { from: 'timingEngine', to: 'eventTriggerEngine', viaType: 'TimingLayers' },
  { from: 'synastryEngine', to: 'eventTriggerEngine', viaType: 'SynastryHeatmap' },
  { from: 'compositeChartEngine', to: 'eventTriggerEngine', viaType: 'CompositeChart' },
  { from: 'timingEngine', to: 'trajectoryEngine', viaType: 'TimingLayers' },
  { from: 'compositeTimingEngine', to: 'trajectoryEngine', viaType: 'CompositeTiming' },

  // Lifecycle flow
  { from: 'compositeChartEngine', to: 'lifecycleEngine', viaType: 'CompositeChart' },
  { from: 'compositeTimingEngine', to: 'lifecycleEngine', viaType: 'CompositeTiming' },
  { from: 'synastryEngine', to: 'lifecycleEngine', viaType: 'SynastrySummary' },
  { from: 'trajectoryEngine', to: 'lifecycleEngine', viaType: 'TrajectoryCurve' },

  // Decision flow
  { from: 'compositeChartEngine', to: 'decisionEngine', viaType: 'CompositeChart' },
  { from: 'lifecycleEngine', to: 'decisionEngine', viaType: 'LifecycleResult' },
  { from: 'synastryEngine', to: 'decisionEngine', viaType: 'SynastrySummary' },
  { from: 'eventTriggerEngine', to: 'decisionEngine', viaType: 'CompositeEventTriggerResult' },
  { from: 'trajectoryEngine', to: 'decisionEngine', viaType: 'TrajectoryCurve' },

  // Report flow
  { from: 'compositeChartEngine', to: 'compositeReportGenerator', viaType: 'CompositeChart' },
  { from: 'synastryEngine', to: 'compositeReportGenerator', viaType: 'SynastryHeatmap' },
  { from: 'lifecycleEngine', to: 'compositeReportGenerator', viaType: 'LifecycleResult' },
  { from: 'eventTriggerEngine', to: 'compositeReportGenerator', viaType: 'CompositeEventTriggerResult' },
  { from: 'trajectoryEngine', to: 'compositeReportGenerator', viaType: 'TrajectoryCurve' },
  { from: 'archetypeEngine', to: 'compositeReportGenerator', viaType: 'RelationshipArchetypeResult' },
  { from: 'lifeThemeEngine', to: 'compositeReportGenerator', viaType: 'LifeThemes' },
  { from: 'compositeReportGenerator', to: 'narrativeEnhancer', viaType: 'CompositeReportChapters' },
  { from: 'compositeReportGenerator', to: 'htmlRenderer', viaType: 'CompositeReportMarkdown' },
  { from: 'htmlRenderer', to: 'pdfRenderer', viaType: 'CompositeReportHtml' },

  // System flow
  { from: 'natalChartEngine', to: 'multiRelationshipGraph', viaType: 'Pillars[]' },
  { from: 'multiRelationshipGraph', to: 'familyConstellationEngine', viaType: 'RelationshipGraph' }
];

// ============================================================================
// TIMING FLOW EDGES
// ============================================================================

/**
 * Timing flow edges (temporal cascade)
 */
export const TIMING_FLOW: TimingFlowEdge[] = [
  // Individual timing cascade
  { fromModule: 'natalChartEngine', toModule: 'timingEngine', layer: 'natal' },
  { fromModule: 'timingEngine', toModule: 'monthlyTimingEngine', layer: 'luckPillar' },
  { fromModule: 'monthlyTimingEngine', toModule: 'eventTriggerEngine', layer: 'monthly' },

  // Composite timing cascade
  { fromModule: 'compositeChartEngine', toModule: 'compositeTimingEngine', layer: 'natal' },
  { fromModule: 'compositeTimingEngine', toModule: 'eventTriggerEngine', layer: 'annual' },
  { fromModule: 'compositeTimingEngine', toModule: 'lifecycleEngine', layer: 'luckPillar' },

  // Trajectory
  { fromModule: 'timingEngine', toModule: 'trajectoryEngine', layer: 'luckPillar' },
  { fromModule: 'compositeTimingEngine', toModule: 'trajectoryEngine', layer: 'luckPillar' }
];

// ============================================================================
// NARRATIVE FLOW EDGES
// ============================================================================

/**
 * Narrative flow edges (chapter generation)
 */
export const NARRATIVE_FLOW: NarrativeFlowEdge[] = [
  { fromModule: 'compositeChartEngine', toChapter: 'essence', chapterNumber: 1, description: 'Relationship Essence' },
  { fromModule: 'synastryEngine', toChapter: 'synastry', chapterNumber: 2, description: 'Synastry Overview' },
  { fromModule: 'compositeChartEngine', toChapter: 'composite', chapterNumber: 3, description: 'Composite Chart Interpretation' },
  { fromModule: 'archetypeEngine', toChapter: 'archetype', chapterNumber: 4, description: 'Relationship Archetype' },
  { fromModule: 'lifeThemeEngine', toChapter: 'themes', chapterNumber: 5, description: 'Life Themes' },
  { fromModule: 'lifecycleEngine', toChapter: 'lifecycle', chapterNumber: 6, description: 'Relationship Lifecycle Phase' },
  { fromModule: 'compositeTimingEngine', toChapter: 'timing', chapterNumber: 7, description: 'Composite Timing Forecast' },
  { fromModule: 'eventTriggerEngine', toChapter: 'events', chapterNumber: 8, description: 'Event Trigger Windows' },
  { fromModule: 'trajectoryEngine', toChapter: 'trajectory', chapterNumber: 9, description: 'Destiny Trajectory Curves' },
  { fromModule: 'decisionEngine', toChapter: 'guidance', chapterNumber: 10, description: 'Guidance & Integration' }
];

// ============================================================================
// COMPLETE SCHEMA INSTANCE
// ============================================================================

/**
 * Build the complete cathedral schema
 */
export function buildCathedralSchemaInstance(): CathedralSchema {
  return {
    version: '1.0.0',
    generatedAt: new Date(),
    modules: SCHEMA_MODULES,
    types: SCHEMA_TYPES,
    flows: {
      dataFlow: DATA_FLOW,
      timingFlow: TIMING_FLOW,
      narrativeFlow: NARRATIVE_FLOW
    }
  };
}

/**
 * The singleton schema instance
 */
export const cathedralSchema: CathedralSchema = buildCathedralSchemaInstance();

// ============================================================================
// QUERY UTILITIES
// ============================================================================

/**
 * Get module by ID
 */
export function getSchemaModule(id: string): SchemaModule | undefined {
  return SCHEMA_MODULES.find(m => m.id === id);
}

/**
 * Get modules by category
 */
export function getSchemaModulesByCategory(category: SchemaModuleCategory): SchemaModule[] {
  return SCHEMA_MODULES.filter(m => m.category === category);
}

/**
 * Get type by ID
 */
export function getSchemaType(id: string): SchemaType | undefined {
  return SCHEMA_TYPES.find(t => t.id === id);
}

/**
 * Get all modules that output a specific type
 */
export function getModulesProducingType(typeId: string): SchemaModule[] {
  return SCHEMA_MODULES.filter(m => m.outputTypes.includes(typeId));
}

/**
 * Get all modules that consume a specific type
 */
export function getModulesConsumingType(typeId: string): SchemaModule[] {
  return SCHEMA_MODULES.filter(m => m.inputTypes.includes(typeId));
}

/**
 * Get data flow edges for a module
 */
export function getDataFlowForSchemaModule(moduleId: string): { inputs: DataFlowEdge[]; outputs: DataFlowEdge[] } {
  return {
    inputs: DATA_FLOW.filter(e => e.to === moduleId),
    outputs: DATA_FLOW.filter(e => e.from === moduleId)
  };
}

/**
 * Get narrative flow for a chapter
 */
export function getNarrativeFlowForChapter(chapterNumber: number): NarrativeFlowEdge | undefined {
  return NARRATIVE_FLOW.find(e => e.chapterNumber === chapterNumber);
}

/**
 * Generate Mermaid diagram for data flow
 */
export function generateSchemaDataFlowMermaid(): string {
  const lines: string[] = ['graph LR'];

  for (const edge of DATA_FLOW) {
    const fromMod = getSchemaModule(edge.from);
    const toMod = getSchemaModule(edge.to);
    if (fromMod && toMod) {
      const fromLabel = fromMod.label.replace(/\s+/g, '_');
      const toLabel = toMod.label.replace(/\s+/g, '_');
      lines.push(`  ${edge.from}[${fromLabel}] -->|${edge.viaType}| ${edge.to}[${toLabel}]`);
    }
  }

  return lines.join('\n');
}

/**
 * Get statistics
 */
export function getSchemaStatistics(): {
  totalModules: number;
  totalTypes: number;
  totalDataFlowEdges: number;
  totalTimingFlowEdges: number;
  totalNarrativeFlowEdges: number;
  modulesByCategory: Record<SchemaModuleCategory, number>;
} {
  const modulesByCategory: Record<SchemaModuleCategory, number> = {
    natal: 0, relationship: 0, timing: 0, system: 0, decision: 0, report: 0, ui: 0
  };

  for (const mod of SCHEMA_MODULES) {
    modulesByCategory[mod.category]++;
  }

  return {
    totalModules: SCHEMA_MODULES.length,
    totalTypes: SCHEMA_TYPES.length,
    totalDataFlowEdges: DATA_FLOW.length,
    totalTimingFlowEdges: TIMING_FLOW.length,
    totalNarrativeFlowEdges: NARRATIVE_FLOW.length,
    modulesByCategory
  };
}
