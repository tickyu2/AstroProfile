/**
 * ============================================================================
 * CATHEDRAL KNOWLEDGE GRAPH - GRAPH DATA (大教堂知识图谱数据)
 * ============================================================================
 *
 * The complete map of the cathedral.
 * Every module, type, flow, narrative, and UI surface as nodes and edges.
 *
 * This is the Rosetta Stone of your metaphysics OS.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  CathedralKnowledgeGraph,
  KGNode,
  KGEdge,
  GraphLayer,
  NamedSubgraph
} from './cathedralGraphTypes';

// ============================================================================
// MODULE NODES (模块节点)
// ============================================================================

const MODULE_NODES: KGNode[] = [
  // ========== Chart Engines (命盘引擎) ==========
  {
    id: 'natalChartEngine',
    label: 'Natal Chart Engine',
    labelChinese: '本命盘引擎',
    category: 'module',
    subcategory: 'chart_engine',
    description: 'Calculates individual BaZi charts from birth data',
    descriptionChinese: '从出生数据计算个人八字命盘',
    sourceFile: 'src/utils/baziEngine.ts',
    tags: ['bazi', 'natal', 'chart', 'pillars']
  },
  {
    id: 'synastryEngine',
    label: 'Synastry Engine',
    labelChinese: '合盘引擎',
    category: 'module',
    subcategory: 'chart_engine',
    description: 'Calculates compatibility between two charts',
    descriptionChinese: '计算两个命盘之间的兼容性',
    sourceFile: 'src/utils/baziSynastry.ts',
    tags: ['synastry', 'compatibility', 'relationship']
  },
  {
    id: 'compositeChartEngine',
    label: 'Composite Chart Engine',
    labelChinese: '组合盘引擎',
    category: 'module',
    subcategory: 'chart_engine',
    description: 'Creates composite chart for relationships',
    descriptionChinese: '为关系创建组合命盘',
    sourceFile: 'src/utils/compositeChart.ts',
    tags: ['composite', 'relationship', 'merged']
  },

  // ========== Timing Engines (时机引擎) ==========
  {
    id: 'daYunEngine',
    label: 'Luck Pillar Engine',
    labelChinese: '大运引擎',
    category: 'module',
    subcategory: 'timing_engine',
    description: 'Calculates 10-year luck pillars (大运)',
    descriptionChinese: '计算十年大运',
    sourceFile: 'src/utils/baziDayun.ts',
    tags: ['dayun', 'luck', 'timing', 'decade']
  },
  {
    id: 'annualLuckEngine',
    label: 'Annual Luck Engine',
    labelChinese: '流年引擎',
    category: 'module',
    subcategory: 'timing_engine',
    description: 'Calculates yearly luck (流年)',
    descriptionChinese: '计算流年运势',
    sourceFile: 'src/utils/baziAnnual.ts',
    tags: ['annual', 'yearly', 'liunian']
  },
  {
    id: 'monthlyLuckEngine',
    label: 'Monthly Luck Engine',
    labelChinese: '流月引擎',
    category: 'module',
    subcategory: 'timing_engine',
    description: 'Calculates monthly luck (流月)',
    descriptionChinese: '计算流月运势',
    sourceFile: 'src/utils/baziMonthly.ts',
    tags: ['monthly', 'liuyue']
  },
  {
    id: 'compositeTimingEngine',
    label: 'Composite Timing Engine',
    labelChinese: '组合时机引擎',
    category: 'module',
    subcategory: 'timing_engine',
    description: 'Timing analysis for composite charts',
    descriptionChinese: '组合盘的时机分析',
    sourceFile: 'src/utils/compositeTiming.ts',
    tags: ['composite', 'timing', 'relationship']
  },

  // ========== Core Analysis Engines ==========
  {
    id: 'usefulGodEngine',
    label: 'Useful God Engine',
    labelChinese: '用神引擎',
    category: 'module',
    subcategory: 'chart_engine',
    description: 'Determines Useful God (用神) and Annoying God (忌神)',
    descriptionChinese: '确定用神和忌神',
    sourceFile: 'src/utils/baziUsefulGod.ts',
    tags: ['yongshen', 'jishen', 'useful', 'annoying']
  },
  {
    id: 'conflictsEngine',
    label: 'Conflicts Engine',
    labelChinese: '冲害刑破引擎',
    category: 'module',
    subcategory: 'chart_engine',
    description: 'Detects clashes, harms, punishments, destructions',
    descriptionChinese: '检测冲、害、刑、破',
    sourceFile: 'src/utils/baziConflicts.ts',
    tags: ['clash', 'harm', 'punishment', 'destruction']
  },

  // ========== Lifecycle & Event Engines ==========
  {
    id: 'lifecycleEngine',
    label: 'Lifecycle Engine',
    labelChinese: '生命周期引擎',
    category: 'module',
    subcategory: 'lifecycle_engine',
    description: 'Tracks relationship lifecycle phases',
    descriptionChinese: '跟踪关系生命周期阶段',
    sourceFile: 'src/story/lifecycleEngine.ts',
    tags: ['lifecycle', 'phase', 'relationship']
  },
  {
    id: 'eventTriggerEngine',
    label: 'Event Trigger Engine',
    labelChinese: '事件触发引擎',
    category: 'module',
    subcategory: 'event_engine',
    description: 'Detects relationship-relevant events',
    descriptionChinese: '检测关系相关事件',
    sourceFile: 'src/story/eventTriggerEngine.ts',
    tags: ['events', 'triggers', 'milestones']
  },
  {
    id: 'trajectoryEngine',
    label: 'Trajectory Engine',
    labelChinese: '轨迹引擎',
    category: 'module',
    subcategory: 'trajectory_engine',
    description: 'Projects destiny curves into the future',
    descriptionChinese: '将命运曲线投射到未来',
    sourceFile: 'src/story/trajectoryEngine.ts',
    tags: ['trajectory', 'curve', 'projection']
  },

  // ========== Story Engines (故事引擎) ==========
  {
    id: 'predictiveStoryEngine',
    label: 'Predictive Story Engine',
    labelChinese: '预测故事引擎',
    category: 'module',
    subcategory: 'story_engine',
    description: 'Generates narrative from timing and events',
    descriptionChinese: '从时机和事件生成叙事',
    sourceFile: 'src/story/storyEngine.ts',
    tags: ['story', 'narrative', 'prediction']
  },
  {
    id: 'storyBeatEngine',
    label: 'Story Beat Engine',
    labelChinese: '故事节拍引擎',
    category: 'module',
    subcategory: 'story_engine',
    description: 'Classifies and builds story beats',
    descriptionChinese: '分类和构建故事节拍',
    sourceFile: 'src/story/storyBeats.ts',
    tags: ['beats', 'rhythm', 'pacing']
  },
  {
    id: 'storyChapterEngine',
    label: 'Story Chapter Engine',
    labelChinese: '故事章节引擎',
    category: 'module',
    subcategory: 'story_engine',
    description: 'Groups beats into chapters with arcs',
    descriptionChinese: '将节拍分组为带有弧线的章节',
    sourceFile: 'src/story/storyChapters.ts',
    tags: ['chapters', 'arcs', 'structure']
  },
  {
    id: 'storyNarrativeEngine',
    label: 'Story Narrative Engine',
    labelChinese: '故事叙述引擎',
    category: 'module',
    subcategory: 'story_engine',
    description: 'Writes prose narratives for chapters',
    descriptionChinese: '为章节撰写散文叙述',
    sourceFile: 'src/story/storyNarrative.ts',
    tags: ['narrative', 'prose', 'writing']
  },

  // ========== Template & Transform Engines ==========
  {
    id: 'archetypalTemplateEngine',
    label: 'Archetypal Template Engine',
    labelChinese: '原型模板引擎',
    category: 'module',
    subcategory: 'template_engine',
    description: 'Transforms stories into 5 narrative voices',
    descriptionChinese: '将故事转化为5种叙事声音',
    sourceFile: 'src/story/storyTemplates.ts',
    tags: ['mythic', 'romantic', 'psychological', 'cinematic', 'poetic']
  },
  {
    id: 'storyWeavingEngine',
    label: 'Story Weaving Engine',
    labelChinese: '故事编织引擎',
    category: 'module',
    subcategory: 'weaving_engine',
    description: 'Weaves multiple destinies into single story',
    descriptionChinese: '将多个命运编织成单一故事',
    sourceFile: 'src/story/storyWeaving.ts',
    tags: ['weaving', 'family', 'team', 'polycule', 'generational']
  },

  // ========== Ritual & Simulation Engines ==========
  {
    id: 'ritualTimingEngine',
    label: 'Ritual Timing Engine',
    labelChinese: '仪式时机引擎',
    category: 'module',
    subcategory: 'ritual_engine',
    description: 'Finds optimal windows for ceremonies',
    descriptionChinese: '为仪式找到最佳时间窗口',
    sourceFile: 'src/story/ritualEngine.ts',
    tags: ['ritual', 'vow', 'healing', 'closure', 'initiation']
  },
  {
    id: 'destinySimulationEngine',
    label: 'Destiny Simulation Engine',
    labelChinese: '命运模拟引擎',
    category: 'module',
    subcategory: 'simulation_engine',
    description: 'Branching-timeline modeling ("what if")',
    descriptionChinese: '分支时间线建模（"如果"）',
    sourceFile: 'src/story/simulationEngine.ts',
    tags: ['simulation', 'branching', 'choice', 'timing', 'path']
  },

  // ========== Decision Engine ==========
  {
    id: 'decisionEngine',
    label: 'Decision Engine',
    labelChinese: '决策引擎',
    category: 'module',
    subcategory: 'decision_engine',
    description: 'Generates recommendations based on all inputs',
    descriptionChinese: '根据所有输入生成建议',
    sourceFile: 'src/story/decisionEngine.ts',
    tags: ['decision', 'recommendation', 'guidance']
  },

  // ========== Renderers ==========
  {
    id: 'htmlRenderer',
    label: 'HTML Renderer',
    labelChinese: 'HTML渲染器',
    category: 'module',
    subcategory: 'renderer',
    description: 'Renders charts and stories as HTML',
    descriptionChinese: '将图表和故事渲染为HTML',
    tags: ['html', 'render', 'display']
  },
  {
    id: 'pdfRenderer',
    label: 'PDF Renderer',
    labelChinese: 'PDF渲染器',
    category: 'module',
    subcategory: 'renderer',
    description: 'Exports charts and stories as PDF',
    descriptionChinese: '将图表和故事导出为PDF',
    tags: ['pdf', 'export', 'print']
  },
  {
    id: 'markdownRenderer',
    label: 'Markdown Renderer',
    labelChinese: 'Markdown渲染器',
    category: 'module',
    subcategory: 'renderer',
    description: 'Exports stories as Markdown',
    descriptionChinese: '将故事导出为Markdown',
    sourceFile: 'src/story/storyUtils.ts',
    tags: ['markdown', 'export', 'text']
  },

  // ========== Dashboards ==========
  {
    id: 'storyDashboard',
    label: 'Story Dashboard',
    labelChinese: '故事仪表板',
    category: 'module',
    subcategory: 'dashboard',
    description: 'Main story visualization dashboard',
    descriptionChinese: '主故事可视化仪表板',
    sourceFile: 'src/story/components/StoryDashboard.tsx',
    tags: ['dashboard', 'visualization', 'story']
  },
  {
    id: 'storyTimeline',
    label: 'Story Timeline',
    labelChinese: '故事时间线',
    category: 'module',
    subcategory: 'dashboard',
    description: 'Timeline visualization component',
    descriptionChinese: '时间线可视化组件',
    sourceFile: 'src/story/components/StoryTimeline.tsx',
    tags: ['timeline', 'visualization']
  },
  {
    id: 'emotionalArcChart',
    label: 'Emotional Arc Chart',
    labelChinese: '情感弧线图',
    category: 'module',
    subcategory: 'dashboard',
    description: 'Visualizes emotional trajectory',
    descriptionChinese: '可视化情感轨迹',
    sourceFile: 'src/story/components/EmotionalArcChart.tsx',
    tags: ['emotional', 'arc', 'chart']
  },
  {
    id: 'qiMenGrid',
    label: 'Qi Men Grid',
    labelChinese: '奇门格',
    category: 'module',
    subcategory: 'dashboard',
    description: 'Qi Men Dun Jia palace grid',
    descriptionChinese: '奇门遁甲宫格',
    sourceFile: 'src/story/components/QiMenGrid.tsx',
    tags: ['qimen', 'grid', 'palace']
  },
  {
    id: 'fengShuiCompass',
    label: 'Feng Shui Compass',
    labelChinese: '风水罗盘',
    category: 'module',
    subcategory: 'dashboard',
    description: 'Directional compass visualization',
    descriptionChinese: '方向罗盘可视化',
    sourceFile: 'src/story/components/FengShuiCompass.tsx',
    tags: ['fengshui', 'compass', 'direction']
  }
];

// ============================================================================
// TYPE NODES (类型节点)
// ============================================================================

const TYPE_NODES: KGNode[] = [
  // ========== Core Chart Types ==========
  {
    id: 'Pillars',
    label: 'Pillars',
    labelChinese: '四柱',
    category: 'type',
    description: 'Four pillars of destiny (year, month, day, hour)',
    descriptionChinese: '命运的四柱（年、月、日、时）',
    tags: ['pillars', 'chart', 'foundation']
  },
  {
    id: 'ElementDistribution',
    label: 'Element Distribution',
    labelChinese: '元素分布',
    category: 'type',
    description: 'Distribution of five elements in chart',
    descriptionChinese: '命盘中五行的分布',
    tags: ['elements', 'distribution', 'balance']
  },
  {
    id: 'TenGods',
    label: 'Ten Gods',
    labelChinese: '十神',
    category: 'type',
    description: 'Ten Gods relationship analysis',
    descriptionChinese: '十神关系分析',
    tags: ['tengods', 'relationships', 'dynamics']
  },
  {
    id: 'UsefulGod',
    label: 'Useful God',
    labelChinese: '用神',
    category: 'type',
    description: 'The element that balances the chart',
    descriptionChinese: '平衡命盘的元素',
    tags: ['yongshen', 'balance', 'remedy']
  },
  {
    id: 'AnnoyingGod',
    label: 'Annoying God',
    labelChinese: '忌神',
    category: 'type',
    description: 'The element that unbalances the chart',
    descriptionChinese: '使命盘失衡的元素',
    tags: ['jishen', 'imbalance', 'challenge']
  },
  {
    id: 'ShenSha',
    label: 'Shen Sha',
    labelChinese: '神煞',
    category: 'type',
    description: 'Symbolic stars (auspicious/inauspicious)',
    descriptionChinese: '象征性的星（吉/凶）',
    tags: ['shensha', 'stars', 'symbols']
  },

  // ========== Relationship Types ==========
  {
    id: 'SynastryHeatmap',
    label: 'Synastry Heatmap',
    labelChinese: '合盘热图',
    category: 'type',
    description: 'Compatibility scores between two charts',
    descriptionChinese: '两个命盘之间的兼容性分数',
    tags: ['synastry', 'compatibility', 'heatmap']
  },
  {
    id: 'CompositeChart',
    label: 'Composite Chart',
    labelChinese: '组合盘',
    category: 'type',
    description: 'Merged chart for a relationship',
    descriptionChinese: '关系的合并命盘',
    tags: ['composite', 'merged', 'relationship']
  },
  {
    id: 'RelationshipArchetype',
    label: 'Relationship Archetype',
    labelChinese: '关系原型',
    category: 'type',
    description: 'Archetypal pattern of relationship',
    descriptionChinese: '关系的原型模式',
    tags: ['archetype', 'pattern', 'relationship']
  },
  {
    id: 'LifeThemes',
    label: 'Life Themes',
    labelChinese: '生命主题',
    category: 'type',
    description: 'Core themes of a relationship',
    descriptionChinese: '关系的核心主题',
    tags: ['themes', 'core', 'purpose']
  },

  // ========== Timing Types ==========
  {
    id: 'DaYunPillar',
    label: 'Da Yun Pillar',
    labelChinese: '大运柱',
    category: 'type',
    description: '10-year luck pillar',
    descriptionChinese: '十年大运柱',
    tags: ['dayun', 'luck', 'decade']
  },
  {
    id: 'AnnualPillar',
    label: 'Annual Pillar',
    labelChinese: '流年柱',
    category: 'type',
    description: 'Yearly pillar',
    descriptionChinese: '流年柱',
    tags: ['annual', 'yearly', 'liunian']
  },
  {
    id: 'MonthlyPillar',
    label: 'Monthly Pillar',
    labelChinese: '流月柱',
    category: 'type',
    description: 'Monthly pillar',
    descriptionChinese: '流月柱',
    tags: ['monthly', 'liuyue']
  },
  {
    id: 'TimingLayers',
    label: 'Timing Layers',
    labelChinese: '时机层',
    category: 'type',
    description: 'All timing layers combined',
    descriptionChinese: '所有时机层的组合',
    tags: ['timing', 'layers', 'combined']
  },
  {
    id: 'CompositeTiming',
    label: 'Composite Timing',
    labelChinese: '组合时机',
    category: 'type',
    description: 'Timing analysis for composite chart',
    descriptionChinese: '组合盘的时机分析',
    tags: ['composite', 'timing']
  },

  // ========== Event Types ==========
  {
    id: 'EventTrigger',
    label: 'Event Trigger',
    labelChinese: '事件触发',
    category: 'type',
    description: 'A detected relationship event',
    descriptionChinese: '检测到的关系事件',
    tags: ['event', 'trigger', 'detection']
  },
  {
    id: 'TrajectoryCurve',
    label: 'Trajectory Curve',
    labelChinese: '轨迹曲线',
    category: 'type',
    description: 'Projected destiny curve',
    descriptionChinese: '预测的命运曲线',
    tags: ['trajectory', 'curve', 'projection']
  },
  {
    id: 'LifecyclePhase',
    label: 'Lifecycle Phase',
    labelChinese: '生命周期阶段',
    category: 'type',
    description: 'Current relationship phase',
    descriptionChinese: '当前关系阶段',
    tags: ['lifecycle', 'phase', 'stage']
  },

  // ========== Story Types ==========
  {
    id: 'StoryBeat',
    label: 'Story Beat',
    labelChinese: '故事节拍',
    category: 'type',
    description: 'A single moment in the story',
    descriptionChinese: '故事中的单一时刻',
    tags: ['beat', 'moment', 'rhythm']
  },
  {
    id: 'StoryChapter',
    label: 'Story Chapter',
    labelChinese: '故事章节',
    category: 'type',
    description: 'A chapter containing multiple beats',
    descriptionChinese: '包含多个节拍的章节',
    tags: ['chapter', 'arc', 'section']
  },
  {
    id: 'PredictiveStory',
    label: 'Predictive Story',
    labelChinese: '预测故事',
    category: 'type',
    description: 'Complete predictive narrative',
    descriptionChinese: '完整的预测叙事',
    tags: ['story', 'narrative', 'complete']
  },
  {
    id: 'EmotionalArc',
    label: 'Emotional Arc',
    labelChinese: '情感弧线',
    category: 'type',
    description: 'Emotional trajectory over time',
    descriptionChinese: '随时间变化的情感轨迹',
    tags: ['emotional', 'arc', 'trajectory']
  },

  // ========== Template Types ==========
  {
    id: 'TransformedStory',
    label: 'Transformed Story',
    labelChinese: '转化故事',
    category: 'type',
    description: 'Story in archetypal voice',
    descriptionChinese: '以原型声音呈现的故事',
    tags: ['transformed', 'voice', 'template']
  },
  {
    id: 'WovenStory',
    label: 'Woven Story',
    labelChinese: '编织故事',
    category: 'type',
    description: 'Multi-person woven narrative',
    descriptionChinese: '多人编织的叙事',
    tags: ['woven', 'multi', 'collective']
  },

  // ========== Ritual Types ==========
  {
    id: 'RitualWindow',
    label: 'Ritual Window',
    labelChinese: '仪式窗口',
    category: 'type',
    description: 'Optimal time window for ritual',
    descriptionChinese: '仪式的最佳时间窗口',
    tags: ['ritual', 'window', 'timing']
  },
  {
    id: 'RitualCalendar',
    label: 'Ritual Calendar',
    labelChinese: '仪式日历',
    category: 'type',
    description: 'Month view of ritual opportunities',
    descriptionChinese: '仪式机会的月视图',
    tags: ['ritual', 'calendar', 'month']
  },

  // ========== Simulation Types ==========
  {
    id: 'SimulatedTimeline',
    label: 'Simulated Timeline',
    labelChinese: '模拟时间线',
    category: 'type',
    description: 'A branching timeline simulation',
    descriptionChinese: '分支时间线模拟',
    tags: ['simulation', 'timeline', 'branch']
  },
  {
    id: 'DestinySimulationResult',
    label: 'Destiny Simulation Result',
    labelChinese: '命运模拟结果',
    category: 'type',
    description: 'Complete simulation output',
    descriptionChinese: '完整的模拟输出',
    tags: ['simulation', 'result', 'complete']
  },

  // ========== Visualization Types ==========
  {
    id: 'StoryCard',
    label: 'Story Card',
    labelChinese: '故事卡片',
    category: 'type',
    description: 'UI card for story display',
    descriptionChinese: '故事显示的UI卡片',
    tags: ['card', 'ui', 'display']
  },
  {
    id: 'TimelineData',
    label: 'Timeline Data',
    labelChinese: '时间线数据',
    category: 'type',
    description: 'Data for timeline visualization',
    descriptionChinese: '时间线可视化的数据',
    tags: ['timeline', 'data', 'visualization']
  },
  {
    id: 'ForceGraphData',
    label: 'Force Graph Data',
    labelChinese: '力导向图数据',
    category: 'type',
    description: 'Data for force-directed graph',
    descriptionChinese: '力导向图的数据',
    tags: ['force', 'graph', 'network']
  }
];

// ============================================================================
// FLOW NODES (流动节点)
// ============================================================================

const FLOW_NODES: KGNode[] = [
  {
    id: 'dataFlow',
    label: 'Data Flow',
    labelChinese: '数据流',
    category: 'flow',
    description: 'Raw chart data moving through engines',
    descriptionChinese: '原始命盘数据通过引擎流动',
    tags: ['data', 'flow', 'pipeline']
  },
  {
    id: 'timingFlow',
    label: 'Timing Flow',
    labelChinese: '时机流',
    category: 'flow',
    description: 'Timing calculations cascading through layers',
    descriptionChinese: '时机计算通过层级级联',
    tags: ['timing', 'flow', 'cascade']
  },
  {
    id: 'narrativeFlow',
    label: 'Narrative Flow',
    labelChinese: '叙事流',
    category: 'flow',
    description: 'Story generation from timing to prose',
    descriptionChinese: '从时机到散文的故事生成',
    tags: ['narrative', 'flow', 'story']
  },
  {
    id: 'visualizationFlow',
    label: 'Visualization Flow',
    labelChinese: '可视化流',
    category: 'flow',
    description: 'Data transformation to visual components',
    descriptionChinese: '数据转换为可视化组件',
    tags: ['visualization', 'flow', 'ui']
  },
  {
    id: 'exportFlow',
    label: 'Export Flow',
    labelChinese: '导出流',
    category: 'flow',
    description: 'Data transformation to export formats',
    descriptionChinese: '数据转换为导出格式',
    tags: ['export', 'flow', 'output']
  }
];

// ============================================================================
// NARRATIVE NODES (叙事节点)
// ============================================================================

const NARRATIVE_NODES: KGNode[] = [
  {
    id: 'narrativePrologue',
    label: 'Prologue',
    labelChinese: '序章',
    category: 'narrative',
    description: 'Opening of the story',
    descriptionChinese: '故事的开场',
    tags: ['prologue', 'opening', 'beginning']
  },
  {
    id: 'narrativeEpilogue',
    label: 'Epilogue',
    labelChinese: '尾声',
    category: 'narrative',
    description: 'Closing of the story',
    descriptionChinese: '故事的结尾',
    tags: ['epilogue', 'closing', 'ending']
  },
  {
    id: 'turningPoint',
    label: 'Turning Point',
    labelChinese: '转折点',
    category: 'narrative',
    description: 'Key moment of change',
    descriptionChinese: '变化的关键时刻',
    tags: ['turning', 'change', 'pivot']
  },
  {
    id: 'climax',
    label: 'Climax',
    labelChinese: '高潮',
    category: 'narrative',
    description: 'Peak of emotional intensity',
    descriptionChinese: '情感强度的顶峰',
    tags: ['climax', 'peak', 'intensity']
  },
  {
    id: 'resolution',
    label: 'Resolution',
    labelChinese: '解决',
    category: 'narrative',
    description: 'Resolution of tension',
    descriptionChinese: '紧张的解决',
    tags: ['resolution', 'closure', 'completion']
  }
];

// ============================================================================
// UI NODES (界面节点)
// ============================================================================

const UI_NODES: KGNode[] = [
  {
    id: 'soulGardenPage',
    label: 'Soul Garden Page',
    labelChinese: '灵魂花园页',
    category: 'ui',
    description: 'Main compatibility visualization page',
    descriptionChinese: '主兼容性可视化页面',
    sourceFile: 'src/pages/SoulGardenPage.jsx',
    tags: ['page', 'garden', 'compatibility']
  },
  {
    id: 'baziCalculatorPage',
    label: 'BaZi Calculator Page',
    labelChinese: '八字计算器页',
    category: 'ui',
    description: 'Chart calculation page',
    descriptionChinese: '命盘计算页面',
    sourceFile: 'src/pages/BaZiCalculatorPage.jsx',
    tags: ['page', 'calculator', 'bazi']
  },
  {
    id: 'compatibilityPage',
    label: 'Compatibility Page',
    labelChinese: '兼容性页',
    category: 'ui',
    description: 'Synastry and compatibility analysis',
    descriptionChinese: '合盘和兼容性分析',
    sourceFile: 'src/pages/CompatibilityPage.jsx',
    tags: ['page', 'compatibility', 'synastry']
  },
  {
    id: 'timelineConsolePage',
    label: 'Timeline Console Page',
    labelChinese: '时间线控制台页',
    category: 'ui',
    description: 'Timing visualization page',
    descriptionChinese: '时机可视化页面',
    sourceFile: 'src/pages/TimelineConsolePage.jsx',
    tags: ['page', 'timeline', 'timing']
  },
  {
    id: 'guestChatPage',
    label: 'Guest Chat Page',
    labelChinese: '访客聊天页',
    category: 'ui',
    description: 'AI chat interface',
    descriptionChinese: 'AI聊天界面',
    sourceFile: 'src/pages/GuestChat.jsx',
    tags: ['page', 'chat', 'ai']
  }
];

// ============================================================================
// ALL NODES
// ============================================================================

const ALL_NODES: KGNode[] = [
  ...MODULE_NODES,
  ...TYPE_NODES,
  ...FLOW_NODES,
  ...NARRATIVE_NODES,
  ...UI_NODES
];

// ============================================================================
// EDGES (边)
// ============================================================================

const EDGES: KGEdge[] = [
  // ========== Chart Engine Produces ==========
  { id: 'e1', from: 'natalChartEngine', to: 'Pillars', relation: 'produces', primary: true },
  { id: 'e2', from: 'natalChartEngine', to: 'ElementDistribution', relation: 'produces' },
  { id: 'e3', from: 'natalChartEngine', to: 'TenGods', relation: 'produces' },
  { id: 'e4', from: 'usefulGodEngine', to: 'UsefulGod', relation: 'produces', primary: true },
  { id: 'e5', from: 'usefulGodEngine', to: 'AnnoyingGod', relation: 'produces' },
  { id: 'e6', from: 'synastryEngine', to: 'SynastryHeatmap', relation: 'produces', primary: true },
  { id: 'e7', from: 'compositeChartEngine', to: 'CompositeChart', relation: 'produces', primary: true },
  { id: 'e8', from: 'compositeChartEngine', to: 'RelationshipArchetype', relation: 'produces' },
  { id: 'e9', from: 'compositeChartEngine', to: 'LifeThemes', relation: 'produces' },

  // ========== Timing Engine Produces ==========
  { id: 'e10', from: 'daYunEngine', to: 'DaYunPillar', relation: 'produces', primary: true },
  { id: 'e11', from: 'annualLuckEngine', to: 'AnnualPillar', relation: 'produces', primary: true },
  { id: 'e12', from: 'monthlyLuckEngine', to: 'MonthlyPillar', relation: 'produces', primary: true },
  { id: 'e13', from: 'compositeTimingEngine', to: 'CompositeTiming', relation: 'produces', primary: true },

  // ========== Module Dependencies ==========
  { id: 'e14', from: 'synastryEngine', to: 'natalChartEngine', relation: 'depends_on' },
  { id: 'e15', from: 'compositeChartEngine', to: 'natalChartEngine', relation: 'depends_on' },
  { id: 'e16', from: 'usefulGodEngine', to: 'natalChartEngine', relation: 'depends_on' },
  { id: 'e17', from: 'conflictsEngine', to: 'natalChartEngine', relation: 'depends_on' },
  { id: 'e18', from: 'compositeTimingEngine', to: 'compositeChartEngine', relation: 'depends_on' },
  { id: 'e19', from: 'compositeTimingEngine', to: 'daYunEngine', relation: 'depends_on' },

  // ========== Story Engine Chain ==========
  { id: 'e20', from: 'Pillars', to: 'daYunEngine', relation: 'feeds' },
  { id: 'e21', from: 'DaYunPillar', to: 'annualLuckEngine', relation: 'feeds' },
  { id: 'e22', from: 'CompositeChart', to: 'compositeTimingEngine', relation: 'feeds' },
  { id: 'e23', from: 'CompositeTiming', to: 'eventTriggerEngine', relation: 'feeds' },
  { id: 'e24', from: 'eventTriggerEngine', to: 'EventTrigger', relation: 'produces', primary: true },
  { id: 'e25', from: 'EventTrigger', to: 'lifecycleEngine', relation: 'feeds' },
  { id: 'e26', from: 'lifecycleEngine', to: 'LifecyclePhase', relation: 'produces', primary: true },
  { id: 'e27', from: 'LifecyclePhase', to: 'trajectoryEngine', relation: 'feeds' },
  { id: 'e28', from: 'trajectoryEngine', to: 'TrajectoryCurve', relation: 'produces', primary: true },
  { id: 'e29', from: 'TrajectoryCurve', to: 'predictiveStoryEngine', relation: 'feeds' },

  // ========== Story Engine Produces ==========
  { id: 'e30', from: 'predictiveStoryEngine', to: 'PredictiveStory', relation: 'produces', primary: true },
  { id: 'e31', from: 'storyBeatEngine', to: 'StoryBeat', relation: 'produces', primary: true },
  { id: 'e32', from: 'storyChapterEngine', to: 'StoryChapter', relation: 'produces', primary: true },
  { id: 'e33', from: 'StoryBeat', to: 'StoryChapter', relation: 'transforms_into' },
  { id: 'e34', from: 'StoryChapter', to: 'PredictiveStory', relation: 'transforms_into' },

  // ========== Template & Weaving ==========
  { id: 'e35', from: 'PredictiveStory', to: 'archetypalTemplateEngine', relation: 'feeds' },
  { id: 'e36', from: 'archetypalTemplateEngine', to: 'TransformedStory', relation: 'produces', primary: true },
  { id: 'e37', from: 'PredictiveStory', to: 'storyWeavingEngine', relation: 'feeds' },
  { id: 'e38', from: 'storyWeavingEngine', to: 'WovenStory', relation: 'produces', primary: true },

  // ========== Ritual Engine ==========
  { id: 'e39', from: 'CompositeTiming', to: 'ritualTimingEngine', relation: 'feeds' },
  { id: 'e40', from: 'LifecyclePhase', to: 'ritualTimingEngine', relation: 'feeds' },
  { id: 'e41', from: 'ritualTimingEngine', to: 'RitualWindow', relation: 'produces', primary: true },
  { id: 'e42', from: 'ritualTimingEngine', to: 'RitualCalendar', relation: 'produces' },

  // ========== Simulation Engine ==========
  { id: 'e43', from: 'PredictiveStory', to: 'destinySimulationEngine', relation: 'feeds' },
  { id: 'e44', from: 'LifecyclePhase', to: 'destinySimulationEngine', relation: 'feeds' },
  { id: 'e45', from: 'destinySimulationEngine', to: 'SimulatedTimeline', relation: 'produces' },
  { id: 'e46', from: 'destinySimulationEngine', to: 'DestinySimulationResult', relation: 'produces', primary: true },

  // ========== Narrative Connections ==========
  { id: 'e47', from: 'storyNarrativeEngine', to: 'narrativePrologue', relation: 'narrates' },
  { id: 'e48', from: 'storyNarrativeEngine', to: 'narrativeEpilogue', relation: 'narrates' },
  { id: 'e49', from: 'StoryBeat', to: 'turningPoint', relation: 'transforms_into' },
  { id: 'e50', from: 'StoryBeat', to: 'climax', relation: 'transforms_into' },
  { id: 'e51', from: 'StoryChapter', to: 'resolution', relation: 'transforms_into' },

  // ========== Visualization Connections ==========
  { id: 'e52', from: 'PredictiveStory', to: 'storyDashboard', relation: 'visualizes' },
  { id: 'e53', from: 'StoryBeat', to: 'storyTimeline', relation: 'visualizes' },
  { id: 'e54', from: 'EmotionalArc', to: 'emotionalArcChart', relation: 'visualizes' },
  { id: 'e55', from: 'predictiveStoryEngine', to: 'StoryCard', relation: 'produces' },
  { id: 'e56', from: 'predictiveStoryEngine', to: 'TimelineData', relation: 'produces' },

  // ========== UI Page Connections ==========
  { id: 'e57', from: 'CompositeChart', to: 'soulGardenPage', relation: 'visualizes' },
  { id: 'e58', from: 'Pillars', to: 'baziCalculatorPage', relation: 'visualizes' },
  { id: 'e59', from: 'SynastryHeatmap', to: 'compatibilityPage', relation: 'visualizes' },
  { id: 'e60', from: 'TimingLayers', to: 'timelineConsolePage', relation: 'visualizes' },

  // ========== Renderer Connections ==========
  { id: 'e61', from: 'PredictiveStory', to: 'htmlRenderer', relation: 'feeds' },
  { id: 'e62', from: 'PredictiveStory', to: 'pdfRenderer', relation: 'feeds' },
  { id: 'e63', from: 'PredictiveStory', to: 'markdownRenderer', relation: 'feeds' },

  // ========== Flow Activations ==========
  { id: 'e64', from: 'dataFlow', to: 'natalChartEngine', relation: 'activates' },
  { id: 'e65', from: 'timingFlow', to: 'daYunEngine', relation: 'activates' },
  { id: 'e66', from: 'timingFlow', to: 'annualLuckEngine', relation: 'activates' },
  { id: 'e67', from: 'narrativeFlow', to: 'predictiveStoryEngine', relation: 'activates' },
  { id: 'e68', from: 'visualizationFlow', to: 'storyDashboard', relation: 'activates' },
  { id: 'e69', from: 'exportFlow', to: 'pdfRenderer', relation: 'activates' }
];

// ============================================================================
// LAYERS
// ============================================================================

const LAYERS: GraphLayer[] = [
  {
    id: 'layer_module',
    name: 'Module Layer',
    nameChinese: '模块层',
    category: 'module',
    order: 1,
    color: '#3b82f6',
    nodeIds: MODULE_NODES.map(n => n.id)
  },
  {
    id: 'layer_type',
    name: 'Type Layer',
    nameChinese: '类型层',
    category: 'type',
    order: 2,
    color: '#22c55e',
    nodeIds: TYPE_NODES.map(n => n.id)
  },
  {
    id: 'layer_flow',
    name: 'Flow Layer',
    nameChinese: '流动层',
    category: 'flow',
    order: 3,
    color: '#f59e0b',
    nodeIds: FLOW_NODES.map(n => n.id)
  },
  {
    id: 'layer_narrative',
    name: 'Narrative Layer',
    nameChinese: '叙事层',
    category: 'narrative',
    order: 4,
    color: '#a855f7',
    nodeIds: NARRATIVE_NODES.map(n => n.id)
  },
  {
    id: 'layer_ui',
    name: 'UI Layer',
    nameChinese: '界面层',
    category: 'ui',
    order: 5,
    color: '#ec4899',
    nodeIds: UI_NODES.map(n => n.id)
  }
];

// ============================================================================
// NAMED SUBGRAPHS
// ============================================================================

const SUBGRAPHS: NamedSubgraph[] = [
  {
    id: 'subgraph_chart_pipeline',
    name: 'Chart Pipeline',
    nameChinese: '命盘管道',
    description: 'From birth data to complete chart analysis',
    nodeIds: ['natalChartEngine', 'usefulGodEngine', 'conflictsEngine', 'Pillars', 'ElementDistribution', 'TenGods', 'UsefulGod', 'AnnoyingGod'],
    edgeIds: ['e1', 'e2', 'e3', 'e4', 'e5', 'e16', 'e17']
  },
  {
    id: 'subgraph_relationship_pipeline',
    name: 'Relationship Pipeline',
    nameChinese: '关系管道',
    description: 'From two charts to relationship analysis',
    nodeIds: ['synastryEngine', 'compositeChartEngine', 'SynastryHeatmap', 'CompositeChart', 'RelationshipArchetype', 'LifeThemes'],
    edgeIds: ['e6', 'e7', 'e8', 'e9', 'e14', 'e15']
  },
  {
    id: 'subgraph_timing_pipeline',
    name: 'Timing Pipeline',
    nameChinese: '时机管道',
    description: 'Multi-layer timing calculations',
    nodeIds: ['daYunEngine', 'annualLuckEngine', 'monthlyLuckEngine', 'compositeTimingEngine', 'DaYunPillar', 'AnnualPillar', 'MonthlyPillar', 'CompositeTiming', 'TimingLayers'],
    edgeIds: ['e10', 'e11', 'e12', 'e13', 'e18', 'e19', 'e20', 'e21', 'e22']
  },
  {
    id: 'subgraph_story_pipeline',
    name: 'Story Pipeline',
    nameChinese: '故事管道',
    description: 'From timing to narrative',
    nodeIds: ['eventTriggerEngine', 'lifecycleEngine', 'trajectoryEngine', 'predictiveStoryEngine', 'storyBeatEngine', 'storyChapterEngine', 'storyNarrativeEngine', 'EventTrigger', 'LifecyclePhase', 'TrajectoryCurve', 'StoryBeat', 'StoryChapter', 'PredictiveStory', 'EmotionalArc'],
    edgeIds: ['e23', 'e24', 'e25', 'e26', 'e27', 'e28', 'e29', 'e30', 'e31', 'e32', 'e33', 'e34']
  },
  {
    id: 'subgraph_ritual_simulation',
    name: 'Ritual & Simulation',
    nameChinese: '仪式与模拟',
    description: 'Ceremonial timing and what-if analysis',
    nodeIds: ['ritualTimingEngine', 'destinySimulationEngine', 'RitualWindow', 'RitualCalendar', 'SimulatedTimeline', 'DestinySimulationResult'],
    edgeIds: ['e39', 'e40', 'e41', 'e42', 'e43', 'e44', 'e45', 'e46']
  }
];

// ============================================================================
// COMPLETE CATHEDRAL KNOWLEDGE GRAPH
// ============================================================================

export const CATHEDRAL_KNOWLEDGE_GRAPH: CathedralKnowledgeGraph = {
  id: 'cathedral_knowledge_graph_v1',
  name: 'Cathedral Knowledge Graph',
  nameChinese: '大教堂知识图谱',
  version: '1.0.0',
  nodes: ALL_NODES,
  edges: EDGES,
  layers: LAYERS,
  subgraphs: SUBGRAPHS,
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodeCount: ALL_NODES.length,
    edgeCount: EDGES.length,
    layerCount: LAYERS.length
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  MODULE_NODES,
  TYPE_NODES,
  FLOW_NODES,
  NARRATIVE_NODES,
  UI_NODES,
  ALL_NODES,
  EDGES,
  LAYERS,
  SUBGRAPHS
};
