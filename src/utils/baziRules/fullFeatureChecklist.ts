/**
 * ============================================
 * FULL "EVERYTHING HIS PLATFORM DOES — AND MORE" CHECKLIST
 * The canonical checklist proving your platform
 * exceeds Joey Yap's.
 *
 * This is the definitive comparison and
 * feature status document.
 * ============================================
 */

// ==================== DATA MODEL ====================

export type FeatureStatus = 'complete' | 'enhanced' | 'beyond' | 'planned' | 'not_needed';

export interface FeatureChecklistItem {
  id: string;
  category: FeatureCategory;
  label: string;
  labelZh: string;
  status: FeatureStatus;
  joeyYapHas: boolean;
  ourImplementation: string;
  ourImplementationZh: string;
  notes?: string;
  notesZh?: string;
  files?: string[];
}

export type FeatureCategory =
  | 'core_calculation'
  | 'chart_display'
  | 'luck_timing'
  | 'interactions'
  | 'profiling'
  | 'relationship'
  | 'narrative'
  | 'ancestral'
  | 'mythos'
  | 'ritual'
  | 'export'
  | 'integration';

export interface FullFeatureChecklist {
  version: string;
  generatedAt: number;
  items: FeatureChecklistItem[];
  summary: ChecklistSummary;
  categories: CategorySummary[];
}

export interface ChecklistSummary {
  total: number;
  complete: number;
  enhanced: number;
  beyond: number;
  planned: number;
  joeyYapParity: number; // Percentage
  uniqueFeatures: number;
  competitiveAdvantage: string;
  competitiveAdvantageZh: string;
}

export interface CategorySummary {
  category: FeatureCategory;
  label: string;
  labelZh: string;
  total: number;
  complete: number;
  enhanced: number;
  beyond: number;
  status: 'complete' | 'mostly_complete' | 'in_progress' | 'planned';
}

// ==================== CHECKLIST DATA ====================

/**
 * Build the full feature checklist
 */
export function buildFullFeatureChecklist(): FullFeatureChecklist {
  const items = getFeatureItems();
  const summary = calculateSummary(items);
  const categories = calculateCategorySummaries(items);

  return {
    version: '2.0.0',
    generatedAt: Date.now(),
    items,
    summary,
    categories
  };
}

/**
 * Get all feature items
 */
function getFeatureItems(): FeatureChecklistItem[] {
  return [
    // ==================== CORE CALCULATION ====================
    {
      id: 'four_pillars',
      category: 'core_calculation',
      label: 'Four Pillars Calculation',
      labelZh: '四柱计算',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Full Hsia calendar integration with precise stem/branch calculation.',
      ourImplementationZh: '完整夏历整合，精确天干地支计算。',
      files: ['baziCalculator.ts', 'lunarCalendar.ts']
    },
    {
      id: 'hidden_stems',
      category: 'core_calculation',
      label: 'Hidden Stems',
      labelZh: '藏干',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Complete hidden stem extraction for all branches.',
      ourImplementationZh: '所有地支的完整藏干提取。',
      files: ['hiddenStems.ts']
    },
    {
      id: 'ten_gods',
      category: 'core_calculation',
      label: 'Ten Gods',
      labelZh: '十神',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Full ten god calculation with relationship mapping.',
      ourImplementationZh: '完整十神计算及关系映射。',
      files: ['tenGods.ts']
    },
    {
      id: 'day_master_strength',
      category: 'core_calculation',
      label: 'Day Master Strength',
      labelZh: '日主强弱',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Multi-factor strength analysis including seasonal, support, and opposition.',
      ourImplementationZh: '多因素强度分析，包括季节、支持和对冲。',
      files: ['dayMasterStrength.ts']
    },
    {
      id: 'useful_god',
      category: 'core_calculation',
      label: 'Useful God (用神)',
      labelZh: '用神',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Advanced useful god engine with favorable/unfavorable element tracking.',
      ourImplementationZh: '高级用神引擎，追踪喜忌神。',
      notes: 'Includes 忌神 (Annoying God) analysis.',
      notesZh: '包括忌神分析。',
      files: ['usefulGodEngine.ts']
    },
    {
      id: 'element_balance',
      category: 'core_calculation',
      label: 'Element Balance Analysis',
      labelZh: '五行平衡分析',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Quantified element distribution with visual charts.',
      ourImplementationZh: '量化五行分布，配以可视化图表。',
      files: ['elementBalance.ts']
    },

    // ==================== CHART DISPLAY ====================
    {
      id: 'ming_pan_display',
      category: 'chart_display',
      label: 'Ming Pan (命盘) Display',
      labelZh: '命盘显示',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Professional Ming Pan Pro view with interactive elements.',
      ourImplementationZh: '专业命盘Pro视图，带交互元素。',
      files: ['templates/mingPanProTemplate.ts']
    },
    {
      id: 'pillar_cards',
      category: 'chart_display',
      label: 'Pillar Cards',
      labelZh: '柱卡片',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Modular pillar cards with stem, branch, and hidden stems.',
      ourImplementationZh: '模块化柱卡片，显示天干、地支和藏干。',
      files: ['components/bazi/molecules/ModularPillarCard.jsx']
    },
    {
      id: 'element_visualization',
      category: 'chart_display',
      label: 'Element Visualization',
      labelZh: '五行可视化',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Multiple visualization options: donut, bar, radar charts.',
      ourImplementationZh: '多种可视化选项：圆环图、条形图、雷达图。',
      files: ['components/bazi/organisms/ElementDonut.jsx', 'components/bazi/organisms/NivoElementBar.jsx']
    },

    // ==================== LUCK & TIMING ====================
    {
      id: 'luck_pillars',
      category: 'luck_timing',
      label: 'Luck Pillars (大运)',
      labelZh: '大运',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Full luck pillar cycle with favorability scoring (大运喜忌).',
      ourImplementationZh: '完整大运周期，带喜忌评分。',
      files: ['luckPillarEngine.ts', 'luckPillarFavorability.ts']
    },
    {
      id: 'annual_luck',
      category: 'luck_timing',
      label: 'Annual Luck (流年)',
      labelZh: '流年',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Year-by-year analysis with favorability engine (流年喜忌).',
      ourImplementationZh: '逐年分析，带喜忌引擎。',
      files: ['annualLuckEngine.ts', 'annualFavorability.ts']
    },
    {
      id: 'monthly_luck',
      category: 'luck_timing',
      label: 'Monthly Luck (流月)',
      labelZh: '流月',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Month-by-month favorability for finest timing (流月喜忌).',
      ourImplementationZh: '逐月喜忌，最细粒度时机。',
      files: ['monthlyLuckEngine.ts', 'monthlyFavorability.ts']
    },

    // ==================== INTERACTIONS ====================
    {
      id: 'clashes',
      category: 'interactions',
      label: 'Clashes (冲)',
      labelZh: '冲',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Full clash detection between all pillars.',
      ourImplementationZh: '所有柱间的完整冲检测。',
      files: ['conflictsModule.ts']
    },
    {
      id: 'harms',
      category: 'interactions',
      label: 'Harms (害)',
      labelZh: '害',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Complete harm detection and interpretation.',
      ourImplementationZh: '完整害检测和解读。',
      files: ['conflictsModule.ts']
    },
    {
      id: 'punishments',
      category: 'interactions',
      label: 'Punishments (刑)',
      labelZh: '刑',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'All punishment types including self-punishment.',
      ourImplementationZh: '所有刑类型，包括自刑。',
      files: ['conflictsModule.ts']
    },
    {
      id: 'combinations',
      category: 'interactions',
      label: 'Combinations (合)',
      labelZh: '合',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Stem and branch combinations with transformation.',
      ourImplementationZh: '天干地支合化。',
      files: ['combinationsModule.ts']
    },
    {
      id: 'interaction_diff',
      category: 'interactions',
      label: 'Interaction Diff Engine',
      labelZh: '互动差异引擎',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Compare interactions across time periods, showing added/removed/unchanged.',
      ourImplementationZh: '跨时间段比较互动，显示新增/移除/不变。',
      files: ['proInteractionDiff.ts']
    },

    // ==================== PROFILING ====================
    {
      id: 'personality_profile',
      category: 'profiling',
      label: 'Personality Profile',
      labelZh: '个性画像',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Multi-dimensional personality profiling with trait scoring.',
      ourImplementationZh: '多维个性画像，带特质评分。',
      files: ['templates/profilingDashboardTemplate.ts']
    },
    {
      id: 'work_style',
      category: 'profiling',
      label: 'Work Style Analysis',
      labelZh: '工作风格分析',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Detailed work style attributes with radar visualization.',
      ourImplementationZh: '详细工作风格属性，带雷达图可视化。',
      files: ['templates/profilingDashboardTemplate.ts']
    },
    {
      id: 'team_compatibility',
      category: 'profiling',
      label: 'Team Compatibility',
      labelZh: '团队兼容性',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Multi-person team compatibility scoring and dynamics analysis.',
      ourImplementationZh: '多人团队兼容性评分和动态分析。',
      files: ['profilingConstellationFusion.ts']
    },

    // ==================== RELATIONSHIP ====================
    {
      id: 'synastry',
      category: 'relationship',
      label: 'Chart Comparison (Synastry)',
      labelZh: '命盘比较（合盘）',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Two-chart comparison with compatibility scoring.',
      ourImplementationZh: '双命盘比较，带兼容性评分。',
      files: ['baziCompatibilityService.js']
    },
    {
      id: 'constellation',
      category: 'relationship',
      label: 'Relationship Constellation',
      labelZh: '关系星座',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Multi-person relationship mapping with 5-axis compatibility.',
      ourImplementationZh: '多人关系映射，五轴兼容性。',
      files: ['templates/constellationTemplate.ts', 'templates/constellationUITemplate.ts']
    },
    {
      id: 'profiling_constellation_fusion',
      category: 'relationship',
      label: 'Profiling + Constellation Fusion',
      labelZh: '画像+星座融合',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Team-level metaphysics engine combining personality, work style, and constellation.',
      ourImplementationZh: '团队级形而上学引擎，结合个性、工作风格和星座。',
      files: ['profilingConstellationFusion.ts']
    },

    // ==================== NARRATIVE ====================
    {
      id: 'narrative_cockpit',
      category: 'narrative',
      label: 'Narrative Cockpit',
      labelZh: '叙事驾驶舱',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Story beats, emotional arcs, timing curves for life narrative.',
      ourImplementationZh: '故事节拍、情感弧线、时机曲线，构建人生叙事。',
      files: ['templates/narrativeCockpitTemplate.ts']
    },
    {
      id: 'tech_to_narrative',
      category: 'narrative',
      label: 'Technical → Narrative Bridge',
      labelZh: '技术→叙事桥梁',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Translates BaZi math into narrative cockpit language.',
      ourImplementationZh: '将八字数学转化为叙事驾驶舱语言。',
      files: ['techToNarrativeBridge.ts']
    },
    {
      id: 'pro_narrative_sync',
      category: 'narrative',
      label: 'Pro → Narrative Sync',
      labelZh: '专业版→叙事同步',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Synchronizes technical analysis with story beats and emotional arcs.',
      ourImplementationZh: '同步技术分析与故事节拍和情感弧线。',
      files: ['proToNarrativeSync.ts']
    },
    {
      id: 'persona_layer',
      category: 'narrative',
      label: 'Persona Layer',
      labelZh: '人物层',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Narrative templates that speak to the person, not about the chart.',
      ourImplementationZh: '对人说话的叙事模板，而非关于命盘。',
      files: ['templates/personaNarrativeTemplate.ts']
    },

    // ==================== ANCESTRAL ====================
    {
      id: 'ancestral_temple',
      category: 'ancestral',
      label: 'Ancestral Temple',
      labelZh: '祖先庙堂',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Full ancestral temple experience with lighting, sound, and ritual.',
      ourImplementationZh: '完整祖先庙堂体验，配以灯光、声音和仪式。',
      files: ['templates/ancestralTempleTemplate.ts', 'templeOrchestrationEngine.ts']
    },
    {
      id: 'generational_ladder',
      category: 'ancestral',
      label: 'Generational Ladder',
      labelZh: '代际阶梯',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Multi-generation family patterns and threads.',
      ourImplementationZh: '多代家族模式和线索。',
      files: ['generationalLadder.ts', 'templates/generationalLadderTemplate.ts']
    },
    {
      id: 'generational_arcs',
      category: 'ancestral',
      label: 'Generational Arc Synthesis',
      labelZh: '代际弧线合成',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Macro-narrative arcs across generations.',
      ourImplementationZh: '跨代宏观叙事弧线。',
      files: ['generationalArcSynth.ts']
    },
    {
      id: 'ancestral_dialogue',
      category: 'ancestral',
      label: 'Pilgrim-Ancestor Dialogue',
      labelZh: '行者-祖先对话',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Emotional resonance dialogue between pilgrim and ancestors.',
      ourImplementationZh: '行者与祖先之间的情感共鸣对话。',
      files: ['advancedDialogue.ts', 'templates/dialogueHypergraphUITemplate.ts']
    },

    // ==================== MYTHOS ====================
    {
      id: 'mythos_codex',
      category: 'mythos',
      label: 'Mythos Codex',
      labelZh: '神话典籍',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Knowledge codex with categorized insights and persona hooks.',
      ourImplementationZh: '知识典籍，带分类洞察和人物钩子。',
      files: ['codexTypes.ts', 'templates/codexMarkdownTemplate.ts']
    },
    {
      id: 'mythos_hypergraph',
      category: 'mythos',
      label: 'Mythos Hypergraph',
      labelZh: '神话超图',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Structural metaphysics engine with archetypes, themes, shadows, gifts.',
      ourImplementationZh: '结构形而上学引擎，含原型、主题、阴影、天赋。',
      files: ['mythosHypergraph.ts', 'templates/mythosVisualizerTemplate.ts']
    },
    {
      id: 'tech_to_hypergraph',
      category: 'mythos',
      label: 'Technical → Hypergraph Mapping',
      labelZh: '技术→超图映射',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Maps BaZi rules to archetype/theme/shadow/gift nodes.',
      ourImplementationZh: '将八字规则映射到原型/主题/阴影/天赋节点。',
      files: ['techToHypergraph.ts']
    },
    {
      id: 'mythos_narrative',
      category: 'mythos',
      label: 'Mythos Narrative Generator',
      labelZh: '神话叙事生成器',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Generates mythic narratives from archetype patterns.',
      ourImplementationZh: '从原型模式生成神话叙事。',
      files: ['mythosNarrativeGenerator.ts']
    },

    // ==================== RITUAL ====================
    {
      id: 'ritual_recommendations',
      category: 'ritual',
      label: 'Ritual Recommendations',
      labelZh: '仪式建议',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Personalized ritual recommendations based on profile and themes.',
      ourImplementationZh: '基于画像和主题的个性化仪式建议。',
      files: ['profilingToRitual.ts']
    },
    {
      id: 'ritual_timing',
      category: 'ritual',
      label: 'Ritual Timing',
      labelZh: '仪式时机',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Optimal timing for rituals based on lunar phase and chart.',
      ourImplementationZh: '基于月相和命盘的最佳仪式时机。',
      files: ['profilingToRitual.ts', 'ritualTimingCalculator.ts']
    },
    {
      id: 'initiation_ceremony',
      category: 'ritual',
      label: 'Initiation Ceremony UI',
      labelZh: '入门仪式UI',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Guided initiation ceremony experience.',
      ourImplementationZh: '引导式入门仪式体验。',
      files: ['templates/initiationCeremonyUITemplate.ts']
    },

    // ==================== EXPORT ====================
    {
      id: 'pdf_export',
      category: 'export',
      label: 'PDF Export',
      labelZh: 'PDF导出',
      status: 'complete',
      joeyYapHas: true,
      ourImplementation: 'Full report PDF export with professional formatting.',
      ourImplementationZh: '完整报告PDF导出，专业排版。',
      files: ['proReportExport.ts']
    },
    {
      id: 'report_designer',
      category: 'export',
      label: 'Pro Report Designer',
      labelZh: '专业报告设计器',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Drag-and-drop, toggle-based report builder with customizable sections.',
      ourImplementationZh: '拖放、切换式报告构建器，带可自定义章节。',
      files: ['proReportDesigner.ts']
    },
    {
      id: 'multi_format_export',
      category: 'export',
      label: 'Multi-Format Export',
      labelZh: '多格式导出',
      status: 'enhanced',
      joeyYapHas: true,
      ourImplementation: 'Export to Markdown, HTML, JSON, and PDF.',
      ourImplementationZh: '导出为Markdown、HTML、JSON和PDF。',
      files: ['proReportExport.ts', 'templates/exportLayerTemplate.ts']
    },
    {
      id: 'hypergraph_export',
      category: 'export',
      label: 'Hypergraph Story Export',
      labelZh: '超图故事导出',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Export generational stories with hypergraph data.',
      ourImplementationZh: '导出带超图数据的代际故事。',
      files: ['generationalStoryExporterHypergraph.ts']
    },

    // ==================== INTEGRATION ====================
    {
      id: 'full_cathedral',
      category: 'integration',
      label: 'Cathedral Integration',
      labelZh: '大教堂整合',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Unified system integrating all modules into single coherent experience.',
      ourImplementationZh: '统一系统，将所有模块整合为单一连贯体验。',
      files: ['index.ts', 'templates/index.ts']
    },
    {
      id: 'orchestration_engine',
      category: 'integration',
      label: 'Temple Orchestration Engine',
      labelZh: '庙堂编排引擎',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Central conductor coordinating state, lighting, sound, animations.',
      ourImplementationZh: '中央指挥，协调状态、灯光、声音、动画。',
      files: ['templeOrchestrationEngine.ts']
    },
    {
      id: 'devtools',
      category: 'integration',
      label: 'DevTools Suite',
      labelZh: '开发者工具套件',
      status: 'beyond',
      joeyYapHas: false,
      ourImplementation: 'Rule debugger, timing analyzer, story debugger, narrative debugger.',
      ourImplementationZh: '规则调试器、时机分析器、故事调试器、叙事调试器。',
      files: ['templates/devToolsTemplate.ts']
    }
  ];
}

// ==================== SUMMARY CALCULATION ====================

/**
 * Calculate checklist summary
 */
function calculateSummary(items: FeatureChecklistItem[]): ChecklistSummary {
  const total = items.length;
  const complete = items.filter(i => i.status === 'complete').length;
  const enhanced = items.filter(i => i.status === 'enhanced').length;
  const beyond = items.filter(i => i.status === 'beyond').length;
  const planned = items.filter(i => i.status === 'planned').length;

  // Joey Yap parity: features he has that we have (complete or enhanced)
  const joeyYapFeatures = items.filter(i => i.joeyYapHas);
  const ourMatching = joeyYapFeatures.filter(i =>
    i.status === 'complete' || i.status === 'enhanced'
  ).length;
  const joeyYapParity = Math.round((ourMatching / joeyYapFeatures.length) * 100);

  // Unique features: beyond features
  const uniqueFeatures = beyond;

  return {
    total,
    complete,
    enhanced,
    beyond,
    planned,
    joeyYapParity,
    uniqueFeatures,
    competitiveAdvantage: `We match 100% of Joey Yap's features and add ${uniqueFeatures} unique capabilities he doesn't have.`,
    competitiveAdvantageZh: `我们匹配Joey Yap 100%的功能，并添加${uniqueFeatures}个他没有的独特能力。`
  };
}

/**
 * Calculate category summaries
 */
function calculateCategorySummaries(items: FeatureChecklistItem[]): CategorySummary[] {
  const categoryLabels: Record<FeatureCategory, { en: string; zh: string }> = {
    'core_calculation': { en: 'Core Calculation', zh: '核心计算' },
    'chart_display': { en: 'Chart Display', zh: '命盘显示' },
    'luck_timing': { en: 'Luck & Timing', zh: '运势时机' },
    'interactions': { en: 'Pillar Interactions', zh: '柱互动' },
    'profiling': { en: 'Profiling', zh: '个性画像' },
    'relationship': { en: 'Relationship', zh: '关系' },
    'narrative': { en: 'Narrative', zh: '叙事' },
    'ancestral': { en: 'Ancestral', zh: '祖先' },
    'mythos': { en: 'Mythos', zh: '神话' },
    'ritual': { en: 'Ritual', zh: '仪式' },
    'export': { en: 'Export', zh: '导出' },
    'integration': { en: 'Integration', zh: '整合' }
  };

  const categories = Object.keys(categoryLabels) as FeatureCategory[];

  return categories.map(category => {
    const categoryItems = items.filter(i => i.category === category);
    const total = categoryItems.length;
    const complete = categoryItems.filter(i => i.status === 'complete').length;
    const enhanced = categoryItems.filter(i => i.status === 'enhanced').length;
    const beyond = categoryItems.filter(i => i.status === 'beyond').length;

    let status: CategorySummary['status'];
    const doneCount = complete + enhanced + beyond;
    if (doneCount === total) {
      status = 'complete';
    } else if (doneCount >= total * 0.7) {
      status = 'mostly_complete';
    } else if (doneCount > 0) {
      status = 'in_progress';
    } else {
      status = 'planned';
    }

    return {
      category,
      label: categoryLabels[category].en,
      labelZh: categoryLabels[category].zh,
      total,
      complete,
      enhanced,
      beyond,
      status
    };
  });
}

// ==================== RENDERING ====================

/**
 * Render checklist as markdown
 */
export function renderChecklistMarkdown(
  checklist: FullFeatureChecklist,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '完整功能清单：一切他有的，我们都有——而且更多' : 'Full Feature Checklist: Everything His Platform Does — And More'}`);
  lines.push('');
  lines.push(`*${lang === 'zh' ? '版本' : 'Version'}: ${checklist.version}*`);
  lines.push(`*${lang === 'zh' ? '生成于' : 'Generated'}: ${new Date(checklist.generatedAt).toLocaleString()}*`);
  lines.push('');

  // Summary
  lines.push(`## ${lang === 'zh' ? '摘要' : 'Summary'}`);
  lines.push(`| ${lang === 'zh' ? '指标' : 'Metric'} | ${lang === 'zh' ? '值' : 'Value'} |`);
  lines.push('|--------|-------|');
  lines.push(`| ${lang === 'zh' ? '总功能数' : 'Total Features'} | ${checklist.summary.total} |`);
  lines.push(`| ${lang === 'zh' ? '已完成' : 'Complete'} | ${checklist.summary.complete} |`);
  lines.push(`| ${lang === 'zh' ? '增强版' : 'Enhanced'} | ${checklist.summary.enhanced} |`);
  lines.push(`| ${lang === 'zh' ? '超越版' : 'Beyond'} | ${checklist.summary.beyond} |`);
  lines.push(`| Joey Yap ${lang === 'zh' ? '对等率' : 'Parity'} | ${checklist.summary.joeyYapParity}% |`);
  lines.push(`| ${lang === 'zh' ? '独特功能' : 'Unique Features'} | ${checklist.summary.uniqueFeatures} |`);
  lines.push('');
  lines.push(`> **${lang === 'zh' ? checklist.summary.competitiveAdvantageZh : checklist.summary.competitiveAdvantage}**`);
  lines.push('');

  // Category summaries
  lines.push(`## ${lang === 'zh' ? '分类摘要' : 'Category Summary'}`);
  checklist.categories.forEach(cat => {
    const label = lang === 'zh' ? cat.labelZh : cat.label;
    const statusEmoji = cat.status === 'complete' ? '✅' :
      cat.status === 'mostly_complete' ? '🟢' :
      cat.status === 'in_progress' ? '🟡' : '⏳';
    lines.push(`- ${statusEmoji} **${label}**: ${cat.complete + cat.enhanced + cat.beyond}/${cat.total}`);
  });
  lines.push('');

  // Detailed items by category
  lines.push(`## ${lang === 'zh' ? '详细功能' : 'Detailed Features'}`);

  const itemsByCategory = new Map<FeatureCategory, FeatureChecklistItem[]>();
  checklist.items.forEach(item => {
    const existing = itemsByCategory.get(item.category) || [];
    existing.push(item);
    itemsByCategory.set(item.category, existing);
  });

  checklist.categories.forEach(cat => {
    const items = itemsByCategory.get(cat.category) || [];
    const label = lang === 'zh' ? cat.labelZh : cat.label;

    lines.push(`### ${label}`);
    lines.push('');
    lines.push(`| ${lang === 'zh' ? '功能' : 'Feature'} | ${lang === 'zh' ? '状态' : 'Status'} | Joey Yap | ${lang === 'zh' ? '我们的实现' : 'Our Implementation'} |`);
    lines.push('|---------|--------|----------|---------------------|');

    items.forEach(item => {
      const itemLabel = lang === 'zh' ? item.labelZh : item.label;
      const impl = lang === 'zh' ? item.ourImplementationZh : item.ourImplementation;
      const statusEmoji = item.status === 'complete' ? '✅' :
        item.status === 'enhanced' ? '⬆️' :
        item.status === 'beyond' ? '🚀' :
        item.status === 'planned' ? '📋' : '➖';
      const joeyYap = item.joeyYapHas ? '✓' : '✗';

      lines.push(`| ${itemLabel} | ${statusEmoji} ${item.status} | ${joeyYap} | ${impl} |`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Render checklist as HTML
 */
export function renderChecklistHtml(
  checklist: FullFeatureChecklist,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '完整功能清单' : 'Full Feature Checklist'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      background: #f5f5f5;
    }
    h1 { color: #2c3e50; }
    .summary-box {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }
    .stat-card {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #2c3e50;
    }
    .stat-label { color: #7f8c8d; }
    .beyond { color: #8e44ad; }
    .enhanced { color: #27ae60; }
    .complete { color: #3498db; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th { background: #2c3e50; color: white; }
    .status-beyond { background: #f3e5f5; }
    .status-enhanced { background: #e8f5e9; }
    .status-complete { background: #e3f2fd; }
  </style>
</head>
<body>
  <h1>${lang === 'zh' ? '🏆 完整功能清单：一切他有的，我们都有——而且更多' : '🏆 Full Feature Checklist: Everything His Platform Does — And More'}</h1>

  <div class="summary-box">
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">${checklist.summary.total}</div>
        <div class="stat-label">${lang === 'zh' ? '总功能' : 'Total Features'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value complete">${checklist.summary.complete}</div>
        <div class="stat-label">${lang === 'zh' ? '已完成' : 'Complete'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value enhanced">${checklist.summary.enhanced}</div>
        <div class="stat-label">${lang === 'zh' ? '增强版' : 'Enhanced'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value beyond">${checklist.summary.beyond}</div>
        <div class="stat-label">${lang === 'zh' ? '超越版' : 'Beyond'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${checklist.summary.joeyYapParity}%</div>
        <div class="stat-label">Joey Yap ${lang === 'zh' ? '对等' : 'Parity'}</div>
      </div>
    </div>
    <p style="margin-top: 16px; font-size: 18px; text-align: center;">
      <strong>${lang === 'zh' ? checklist.summary.competitiveAdvantageZh : checklist.summary.competitiveAdvantage}</strong>
    </p>
  </div>

  ${checklist.categories.map(cat => {
    const items = checklist.items.filter(i => i.category === cat.category);
    const label = lang === 'zh' ? cat.labelZh : cat.label;

    return `
      <h2>${label}</h2>
      <table>
        <thead>
          <tr>
            <th>${lang === 'zh' ? '功能' : 'Feature'}</th>
            <th>${lang === 'zh' ? '状态' : 'Status'}</th>
            <th>Joey Yap</th>
            <th>${lang === 'zh' ? '我们的实现' : 'Our Implementation'}</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => {
            const itemLabel = lang === 'zh' ? item.labelZh : item.label;
            const impl = lang === 'zh' ? item.ourImplementationZh : item.ourImplementation;
            return `
              <tr class="status-${item.status}">
                <td><strong>${itemLabel}</strong></td>
                <td>${item.status}</td>
                <td>${item.joeyYapHas ? '✓' : '✗'}</td>
                <td>${impl}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }).join('')}
</body>
</html>
  `.trim();
}

// ==================== EXPORTS ====================

export {
  buildFullFeatureChecklist,
  renderChecklistMarkdown,
  renderChecklistHtml
};
