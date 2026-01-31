/**
 * ============================================================================
 * CATHEDRAL INDEX DATA (大教堂索引数据)
 * ============================================================================
 *
 * The complete mapping of every module, engine, chart, and service in the
 * Genesis Soul metaphysics cathedral. This is the master index that documents
 * all 100+ modules across seven wings.
 *
 * This file serves as:
 * 1. Living documentation of the entire system
 * 2. Navigation data for the UI
 * 3. Dependency graph for build systems
 * 4. Progress tracker for development
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  CathedralIndex,
  CathedralWing,
  CathedralSection,
  CathedralItem,
  CathedralSubject,
  CathedralMetadata,
  CathedralStats,
  WingStats,
  WingId
} from './indexTypes';

// ============================================================================
// WING I: CORE IDENTITY (命盘本体殿)
// ============================================================================

const coreIdentityWing: CathedralWing = {
  id: 'coreIdentity',
  label: 'Core Identity Wing',
  labelChinese: '命盘本体殿',
  icon: '🜁',
  color: '#6366f1',
  description: 'The foundation — natal charts, elements, Ten Gods, and the essence of individual destiny',
  sections: [
    {
      id: 'natalChart',
      label: 'Natal Chart Modules',
      labelChinese: '命盘模块',
      description: 'Core BaZi natal chart computation and analysis',
      items: [
        {
          id: 'fourPillars',
          label: 'Four Pillars Engine',
          labelChinese: '四柱引擎',
          description: 'Computes Year, Month, Day, Hour pillars from birth data',
          sourceFile: 'src/utils/bazi.js',
          status: 'complete',
          type: 'engine',
          exports: ['calculateBaZi', 'getPillar', 'getHiddenStems'],
          tags: ['core', 'natal', 'pillars']
        },
        {
          id: 'hiddenStems',
          label: 'Hidden Stems Extraction',
          labelChinese: '藏干提取',
          description: 'Extracts hidden stems from earthly branches',
          sourceFile: 'src/utils/bazi.js',
          status: 'complete',
          type: 'engine',
          tags: ['core', 'natal', 'stems']
        },
        {
          id: 'tenGods',
          label: 'Ten Gods Engine',
          labelChinese: '十神引擎',
          description: 'Computes all ten god relationships from Day Master',
          sourceFile: 'src/utils/baziTenGods.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeTenGods', 'getTenGodRelation'],
          tags: ['core', 'natal', 'ten-gods']
        },
        {
          id: 'elementDistribution',
          label: 'Element Distribution',
          labelChinese: '五行分布',
          description: 'Calculates element percentages across the chart',
          sourceFile: 'src/utils/bazi.js',
          status: 'complete',
          type: 'engine',
          exports: ['getElementDistribution'],
          tags: ['core', 'elements']
        },
        {
          id: 'dayMasterStrength',
          label: 'Day Master Strength',
          labelChinese: '日主强弱',
          description: 'Determines Day Master strength category',
          sourceFile: 'src/utils/baziDayMasterStrength.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeDayMasterStrength'],
          tags: ['core', 'day-master']
        },
        {
          id: 'usefulGod',
          label: 'Useful God Engine',
          labelChinese: '用神引擎',
          description: 'Determines Useful God (用神) and Annoying God (忌神)',
          sourceFile: 'src/utils/baziUsefulGod.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeUsefulGod', 'computeAnnoyingGod'],
          tags: ['core', 'useful-god']
        },
        {
          id: 'shenSha',
          label: 'Shen Sha Engine',
          labelChinese: '神煞引擎',
          description: 'Detects auxiliary stars (Peach Blossom, Nobleman, etc.)',
          sourceFile: 'src/utils/baziShenSha.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeShenSha', 'SHEN_SHA_DEFINITIONS'],
          tags: ['core', 'shen-sha']
        },
        {
          id: 'seasonality',
          label: 'Seasonality Module',
          labelChinese: '季节模块',
          description: 'Analyzes birth season impact on chart',
          sourceFile: 'src/utils/baziSeasonality.ts',
          status: 'complete',
          type: 'engine',
          tags: ['core', 'seasonality']
        },
        {
          id: 'conflicts',
          label: 'Conflicts Module',
          labelChinese: '冲害刑破',
          description: 'Detects clashes, harms, punishments, destructions',
          sourceFile: 'src/utils/baziConflicts.ts',
          status: 'complete',
          type: 'engine',
          exports: ['detectConflicts', 'detectClash', 'detectHarm'],
          tags: ['core', 'conflicts']
        }
      ]
    },
    {
      id: 'timing',
      label: 'Individual Timing Modules',
      labelChinese: '个人时序模块',
      description: 'Luck pillars and timing analysis for individuals',
      items: [
        {
          id: 'luckPillars',
          label: 'Luck Pillars Engine',
          labelChinese: '大运引擎',
          description: 'Computes 10-year luck pillar cycles',
          sourceFile: 'src/utils/baziLuckPillars.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeLuckPillars'],
          tags: ['timing', 'luck-pillars']
        },
        {
          id: 'luckPillarFavorability',
          label: 'Luck Pillar Favorability',
          labelChinese: '大运喜忌',
          description: 'Determines favorability of each luck pillar period',
          sourceFile: 'src/utils/baziLuckPillarFavorability.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeLuckPillarFavorability'],
          tags: ['timing', 'favorability']
        },
        {
          id: 'annualFavorability',
          label: 'Annual Favorability',
          labelChinese: '流年喜忌',
          description: 'Year-by-year timing analysis',
          sourceFile: 'src/utils/baziAnnualFavorability.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeAnnualFavorability'],
          tags: ['timing', 'annual']
        },
        {
          id: 'monthlyFavorability',
          label: 'Monthly Favorability',
          labelChinese: '流月喜忌',
          description: 'Month-by-month timing analysis',
          sourceFile: 'src/utils/baziMonthlyFavorability.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeMonthlyFavorability'],
          tags: ['timing', 'monthly']
        }
      ]
    },
    {
      id: 'narrativeIdentity',
      label: 'Narrative Identity',
      labelChinese: '叙事身份',
      description: 'Life themes, essence, and narrative extraction',
      items: [
        {
          id: 'lifeThemes',
          label: 'Life Themes Extraction',
          labelChinese: '人生主题提取',
          description: 'Extracts essence, dynamic, shadow, and destiny themes',
          sourceFile: 'src/utils/baziLifeThemes.ts',
          status: 'complete',
          type: 'engine',
          exports: ['extractLifeThemes', 'extractEssenceTheme', 'extractDestinyArc'],
          tags: ['narrative', 'themes']
        }
      ]
    }
  ]
};

// ============================================================================
// WING II: RELATIONSHIP (关系殿)
// ============================================================================

const relationshipWing: CathedralWing = {
  id: 'relationship',
  label: 'Relationship Wing',
  labelChinese: '关系殿',
  icon: '🜂',
  color: '#ec4899',
  description: 'The heart — synastry, composite charts, archetypes, and the living lifecycle of bonds',
  sections: [
    {
      id: 'synastry',
      label: 'Synastry Modules',
      labelChinese: '合盘模块',
      description: 'Pillar-by-pillar compatibility analysis',
      items: [
        {
          id: 'synastryEngine',
          label: 'Synastry Engine',
          labelChinese: '合盘引擎',
          description: 'Core synastry computation between two charts',
          sourceFile: 'src/utils/baziSynastry.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeSynastry'],
          tags: ['relationship', 'synastry']
        },
        {
          id: 'synastryHeatmap',
          label: 'Synastry Heatmap',
          labelChinese: '合盘热图',
          description: '5x5 pillar interaction heatmap with cell details',
          sourceFile: 'src/utils/baziSynastryHeatmap.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeSynastryHeatmap', 'SynastryHeatmap', 'SynastryCell'],
          tags: ['relationship', 'synastry', 'heatmap']
        },
        {
          id: 'matchScore',
          label: 'Match Score Calculator',
          labelChinese: '匹配分数计算',
          description: 'Overall compatibility score computation',
          sourceFile: 'src/utils/matchScore.ts',
          status: 'complete',
          type: 'engine',
          exports: ['calculateMatchScore'],
          tags: ['relationship', 'compatibility']
        }
      ]
    },
    {
      id: 'composite',
      label: 'Composite Chart Modules',
      labelChinese: '合成盘模块',
      description: 'The relationship\'s own natal chart',
      items: [
        {
          id: 'compositeChart',
          label: 'Composite Chart Engine',
          labelChinese: '合成盘引擎',
          description: 'Creates a unified chart for the relationship entity',
          sourceFile: 'src/utils/baziCompositeChart.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeCompositeChart', 'CompositeChart'],
          tags: ['relationship', 'composite']
        },
        {
          id: 'compositeEventTrigger',
          label: 'Composite Event Trigger',
          labelChinese: '合盘应期',
          description: 'Relationship-specific event timing predictions',
          sourceFile: 'src/utils/baziCompositeEventTrigger.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeCompositeEventTrigger', 'CompositeEventTriggerResult'],
          tags: ['relationship', 'timing', 'events']
        }
      ]
    },
    {
      id: 'archetypes',
      label: 'Relationship Archetypes',
      labelChinese: '关系原型',
      description: 'Mythic patterns that describe relationship dynamics',
      items: [
        {
          id: 'archetypeEngine',
          label: 'Relationship Archetype Engine',
          labelChinese: '关系原型引擎',
          description: 'Identifies primary and secondary relationship archetypes',
          sourceFile: 'src/utils/baziRelationshipArchetypes.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeRelationshipArchetype', 'ARCHETYPE_DEFINITIONS'],
          tags: ['relationship', 'archetypes']
        }
      ]
    },
    {
      id: 'lifecycle',
      label: 'Relationship Lifecycle',
      labelChinese: '关系生命周期',
      description: 'The seven phases of relationship evolution',
      items: [
        {
          id: 'lifecycleModel',
          label: 'Lifecycle Model Engine',
          labelChinese: '生命周期模型',
          description: 'Seven-phase relationship lifecycle (Initiation → Maturation)',
          sourceFile: 'src/utils/baziRelationshipLifecycle.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeRelationshipLifecycle', 'LIFECYCLE_PHASES'],
          tags: ['relationship', 'lifecycle']
        }
      ]
    }
  ]
};

// ============================================================================
// WING III: TIMING (时序殿)
// ============================================================================

const timingWing: CathedralWing = {
  id: 'timing',
  label: 'Timing Wing',
  labelChinese: '时序殿',
  icon: '🜃',
  color: '#f59e0b',
  description: 'The river — where destiny flows through time, revealing peaks, valleys, and event windows',
  sections: [
    {
      id: 'trajectories',
      label: 'Destiny Trajectory Curves',
      labelChinese: '运势曲线',
      description: 'Living graphs showing how destiny rises and falls',
      items: [
        {
          id: 'trajectoryEngine',
          label: 'Trajectory Curve Engine',
          labelChinese: '曲线引擎',
          description: 'Computes smooth destiny curves across five domains',
          sourceFile: 'src/utils/baziTrajectory.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeTrajectoryCurve', 'TrajectoryCurve', 'MultiDomainTrajectory'],
          tags: ['timing', 'trajectory', 'curves']
        }
      ]
    },
    {
      id: 'compositeTiming',
      label: 'Composite Timing',
      labelChinese: '合盘时序',
      description: 'Timing analysis for the relationship entity',
      items: [
        {
          id: 'compositeTimingEngine',
          label: 'Composite Timing Overview',
          labelChinese: '合盘时序概览',
          description: 'Integrated timing for composite charts',
          sourceFile: 'src/utils/baziCompositeEventTrigger.ts',
          status: 'complete',
          type: 'engine',
          tags: ['timing', 'composite']
        }
      ]
    }
  ]
};

// ============================================================================
// WING IV: FAMILY & SYSTEM (家族系统殿)
// ============================================================================

const familySystemWing: CathedralWing = {
  id: 'familySystem',
  label: 'Family & System Wing',
  labelChinese: '家族系统殿',
  icon: '🜄',
  color: '#22c55e',
  description: 'The constellation — multi-relationship graphs, family dynamics, and ancestral patterns',
  sections: [
    {
      id: 'multiRelationship',
      label: 'Multi-Relationship Mapping',
      labelChinese: '多关系映射',
      description: 'Network graph of all relationships in a system',
      items: [
        {
          id: 'multiRelationshipGraph',
          label: 'Multi-Relationship Graph Engine',
          labelChinese: '多关系图引擎',
          description: 'Nodes (individuals), edges (synastry), triadic composites',
          sourceFile: 'src/utils/baziMultiRelationshipGraph.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeMultiRelationshipGraph', 'RelationshipNode', 'RelationshipEdge'],
          tags: ['system', 'graph', 'network']
        }
      ]
    },
    {
      id: 'familyConstellation',
      label: 'Family Constellation',
      labelChinese: '家族星座',
      description: 'Multi-generational ancestral mapping system',
      items: [
        {
          id: 'constellationEngine',
          label: 'Family Constellation Engine',
          labelChinese: '家族星座引擎',
          description: 'Four-layer ancestral pattern analysis',
          sourceFile: 'src/utils/baziFamilyConstellation.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeFamilyConstellation', 'FamilyConstellationResult'],
          tags: ['family', 'constellation', 'ancestral']
        }
      ]
    }
  ]
};

// ============================================================================
// WING V: DECISION (决策殿)
// ============================================================================

const decisionWing: CathedralWing = {
  id: 'decision',
  label: 'Decision Wing',
  labelChinese: '决策殿',
  icon: '🜅',
  color: '#3b82f6',
  description: 'The oracle — timing-aware guidance for real-world relationship choices',
  sections: [
    {
      id: 'decisionEngine',
      label: 'Decision Engine',
      labelChinese: '决策引擎',
      description: 'Timing-aware guidance for four decision domains',
      items: [
        {
          id: 'relationshipDecisionEngine',
          label: 'Relationship Decision Engine',
          labelChinese: '关系决策引擎',
          description: 'Emotional, Commitment, Practical, Conflict decision guidance',
          sourceFile: 'src/utils/baziRelationshipDecisionEngine.ts',
          status: 'complete',
          type: 'engine',
          exports: ['computeDecisionScore', 'generateDecisionGuidance', 'DecisionResult'],
          tags: ['decision', 'guidance', 'timing']
        }
      ]
    }
  ]
};

// ============================================================================
// WING VI: REPORTS (文献殿)
// ============================================================================

const reportsWing: CathedralWing = {
  id: 'reports',
  label: 'Reports Wing',
  labelChinese: '文献殿',
  icon: '🜆',
  color: '#8b5cf6',
  description: 'The library — consult-grade reports binding all insights into living documents',
  sections: [
    {
      id: 'compositeReports',
      label: 'Composite Reports',
      labelChinese: '合盘报告',
      description: 'Comprehensive relationship analysis reports',
      items: [
        {
          id: 'compositeForecastReport',
          label: 'Composite Forecast Report',
          labelChinese: '合盘预测报告',
          description: '10-chapter consult-grade relationship report',
          sourceFile: 'src/utils/baziCompositeForecastReport.ts',
          status: 'complete',
          type: 'report',
          exports: ['generateCompositeForecastReport', 'ForecastReport'],
          tags: ['report', 'composite', 'forecast']
        }
      ]
    },
    {
      id: 'renderers',
      label: 'Report Renderers',
      labelChinese: '报告渲染器',
      description: 'HTML/PDF rendering for shareable documents',
      items: [
        {
          id: 'htmlPdfRenderer',
          label: 'HTML/PDF Renderer',
          labelChinese: 'HTML/PDF渲染器',
          description: 'Transforms reports into styled HTML and printable PDF',
          sourceFile: 'src/utils/compositeReportRenderer.ts',
          status: 'complete',
          type: 'utility',
          exports: ['renderCompositeReportHtml', 'renderCompositeReportPdf'],
          tags: ['render', 'html', 'pdf']
        }
      ]
    }
  ]
};

// ============================================================================
// WING VII: ARCHIVE (档案殿)
// ============================================================================

const archiveWing: CathedralWing = {
  id: 'archive',
  label: 'Archive Wing',
  labelChinese: '档案殿',
  icon: '🜇',
  color: '#64748b',
  description: 'The vault — charts, exports, and data archives preserved for eternity',
  sections: [
    {
      id: 'charts',
      label: 'Charts & Visuals',
      labelChinese: '图表与可视化',
      description: 'Visual representations of metaphysical data',
      items: [
        {
          id: 'elementDonut',
          label: 'Element Distribution Donut',
          labelChinese: '五行饼图',
          description: 'Donut chart showing element percentages',
          sourceFile: 'src/components/bazi/organisms/ElementDonut.jsx',
          status: 'complete',
          type: 'chart',
          tags: ['chart', 'elements', 'visual']
        },
        {
          id: 'personalityRadar',
          label: 'Personality Radar Chart',
          labelChinese: '性格雷达图',
          description: 'Multi-axis radar showing personality dimensions',
          sourceFile: 'src/components/bazi/organisms/PersonalityRadar.jsx',
          status: 'complete',
          type: 'chart',
          tags: ['chart', 'personality', 'visual']
        },
        {
          id: 'fourPillarsGrid',
          label: 'Four Pillars Grid',
          labelChinese: '四柱网格',
          description: 'Visual grid display of four pillars',
          sourceFile: 'src/components/bazi/organisms/FourPillarsGrid.jsx',
          status: 'complete',
          type: 'chart',
          tags: ['chart', 'pillars', 'visual']
        }
      ]
    },
    {
      id: 'exports',
      label: 'Export Layer',
      labelChinese: '导出层',
      description: 'Data export in multiple formats',
      items: [
        {
          id: 'jsonExport',
          label: 'JSON Export',
          labelChinese: 'JSON导出',
          description: 'Export cathedral data as JSON',
          sourceFile: 'src/utils/compositeReportRenderer.ts',
          status: 'complete',
          type: 'utility',
          exports: ['exportMetadataAsJson'],
          tags: ['export', 'json']
        },
        {
          id: 'markdownExport',
          label: 'Markdown Export',
          labelChinese: 'Markdown导出',
          description: 'Export reports as Markdown',
          sourceFile: 'src/utils/baziCompositeForecastReport.ts',
          status: 'complete',
          type: 'utility',
          tags: ['export', 'markdown']
        }
      ]
    }
  ]
};

// ============================================================================
// COMPLETE WINGS ARRAY
// ============================================================================

export const ALL_WINGS: CathedralWing[] = [
  coreIdentityWing,
  relationshipWing,
  timingWing,
  familySystemWing,
  decisionWing,
  reportsWing,
  archiveWing
];

// ============================================================================
// INDEX BUILDER FUNCTIONS
// ============================================================================

/**
 * Build a complete cathedral index for a subject
 */
export function buildCathedralIndex(subject: CathedralSubject): CathedralIndex {
  const stats = computeCathedralStats(ALL_WINGS);

  return {
    subject,
    wings: ALL_WINGS.map(wing => injectRoutes(wing, subject.id)),
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalModules: stats.totalItems,
      completedModules: stats.byStatus.complete,
      implementedModules: stats.byStatus.implemented,
      plannedModules: stats.byStatus.planned,
      lastUpdated: new Date().toISOString()
    }
  };
}

/**
 * Inject routes into wing items based on subject ID
 */
function injectRoutes(wing: CathedralWing, subjectId: string): CathedralWing {
  return {
    ...wing,
    sections: wing.sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        route: `/cathedral/${subjectId}/${wing.id}/${section.id}/${item.id}`
      }))
    }))
  };
}

/**
 * Build index for an individual
 */
export function buildIndividualIndex(
  id: string,
  name: string,
  birthDate: string
): CathedralIndex {
  return buildCathedralIndex({
    id,
    type: 'individual',
    label: name,
    partnerA: { name, birthDate }
  });
}

/**
 * Build index for a couple
 */
export function buildCoupleIndex(
  id: string,
  partnerAName: string,
  partnerABirthDate: string,
  partnerBName: string,
  partnerBBirthDate: string
): CathedralIndex {
  return buildCathedralIndex({
    id,
    type: 'couple',
    label: `${partnerAName} & ${partnerBName}`,
    labelChinese: `${partnerAName} ♥ ${partnerBName}`,
    partnerA: { name: partnerAName, birthDate: partnerABirthDate },
    partnerB: { name: partnerBName, birthDate: partnerBBirthDate }
  });
}

/**
 * Build index for a family system
 */
export function buildFamilyIndex(
  id: string,
  familyName: string,
  members: Array<{ name: string; birthDate: string; role: string }>
): CathedralIndex {
  return buildCathedralIndex({
    id,
    type: 'family',
    label: `${familyName} Family`,
    labelChinese: `${familyName}家族`,
    members
  });
}

// ============================================================================
// STATISTICS FUNCTIONS
// ============================================================================

/**
 * Compute statistics for the cathedral
 */
export function computeCathedralStats(wings: CathedralWing[]): CathedralStats {
  const byStatus = {
    complete: 0,
    implemented: 0,
    partial: 0,
    planned: 0,
    future: 0
  };

  const byType = {
    engine: 0,
    chart: 0,
    report: 0,
    utility: 0,
    data: 0,
    ui: 0,
    service: 0
  };

  const byWing: WingStats[] = [];
  let totalSections = 0;
  let totalItems = 0;

  for (const wing of wings) {
    const wingStats: WingStats = {
      wingId: wing.id,
      totalItems: 0,
      completeItems: 0,
      implementedItems: 0,
      partialItems: 0,
      plannedItems: 0,
      completionPercentage: 0
    };

    totalSections += wing.sections.length;

    for (const section of wing.sections) {
      for (const item of section.items) {
        totalItems++;
        wingStats.totalItems++;
        byStatus[item.status]++;
        byType[item.type]++;

        if (item.status === 'complete') {
          wingStats.completeItems++;
        } else if (item.status === 'implemented') {
          wingStats.implementedItems++;
        } else if (item.status === 'partial') {
          wingStats.partialItems++;
        } else if (item.status === 'planned') {
          wingStats.plannedItems++;
        }
      }
    }

    wingStats.completionPercentage = wingStats.totalItems > 0
      ? Math.round((wingStats.completeItems + wingStats.implementedItems) / wingStats.totalItems * 100)
      : 0;

    byWing.push(wingStats);
  }

  const overallCompletion = totalItems > 0
    ? Math.round((byStatus.complete + byStatus.implemented) / totalItems * 100)
    : 0;

  return {
    totalWings: wings.length,
    totalSections,
    totalItems,
    byStatus,
    byType,
    byWing,
    overallCompletion
  };
}

/**
 * Get all items matching a filter
 */
export function filterCathedralItems(
  wings: CathedralWing[],
  filter: {
    status?: string[];
    type?: string[];
    wing?: WingId[];
    tags?: string[];
    searchQuery?: string;
  }
): CathedralItem[] {
  const results: CathedralItem[] = [];

  for (const wing of wings) {
    if (filter.wing && !filter.wing.includes(wing.id)) continue;

    for (const section of wing.sections) {
      for (const item of section.items) {
        let matches = true;

        if (filter.status && !filter.status.includes(item.status)) {
          matches = false;
        }

        if (filter.type && !filter.type.includes(item.type)) {
          matches = false;
        }

        if (filter.tags && filter.tags.length > 0) {
          const itemTags = item.tags || [];
          if (!filter.tags.some(t => itemTags.includes(t))) {
            matches = false;
          }
        }

        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          const searchable = [
            item.label,
            item.labelChinese,
            item.description,
            ...(item.tags || [])
          ].join(' ').toLowerCase();

          if (!searchable.includes(query)) {
            matches = false;
          }
        }

        if (matches) {
          results.push(item);
        }
      }
    }
  }

  return results;
}

/**
 * Get a specific item by ID
 */
export function getCathedralItem(
  wings: CathedralWing[],
  itemId: string
): { item: CathedralItem; wing: CathedralWing; section: CathedralSection } | null {
  for (const wing of wings) {
    for (const section of wing.sections) {
      for (const item of section.items) {
        if (item.id === itemId) {
          return { item, wing, section };
        }
      }
    }
  }
  return null;
}

/**
 * Get breadcrumbs for a specific item
 */
export function getBreadcrumbs(
  wings: CathedralWing[],
  wingId: WingId,
  sectionId: string,
  itemId: string
): Array<{ label: string; labelChinese: string; route: string }> {
  const breadcrumbs = [
    { label: 'Cathedral', labelChinese: '大教堂', route: '/cathedral' }
  ];

  const wing = wings.find(w => w.id === wingId);
  if (wing) {
    breadcrumbs.push({
      label: wing.label,
      labelChinese: wing.labelChinese,
      route: `/cathedral/${wingId}`
    });

    const section = wing.sections.find(s => s.id === sectionId);
    if (section) {
      breadcrumbs.push({
        label: section.label,
        labelChinese: section.labelChinese,
        route: `/cathedral/${wingId}/${sectionId}`
      });

      const item = section.items.find(i => i.id === itemId);
      if (item) {
        breadcrumbs.push({
          label: item.label,
          labelChinese: item.labelChinese,
          route: `/cathedral/${wingId}/${sectionId}/${itemId}`
        });
      }
    }
  }

  return breadcrumbs;
}
