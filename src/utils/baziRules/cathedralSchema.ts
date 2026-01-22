/**
 * ============================================
 * CATHEDRAL SCHEMA MAP
 * Full architectural blueprint of the Cathedral system
 * Defines all engines, chambers, narratives, and UIs
 * ============================================
 */

// ==================== SCHEMA TYPES ====================

export interface EngineNode {
  id: string;
  name: string;
  chineseName: string;
  type: 'core' | 'aux' | 'narrative' | 'timing' | 'relationship';
  description: string;
  inputs: string[];
  outputs: string[];
  ruleCount?: number;
}

export interface ChamberNode {
  id: string;
  name: string;
  chineseName: string;
  category: 'analysis' | 'codex' | 'persona' | 'journey' | 'ui';
  description: string;
  rules: string[];
  iconHint: string;
}

export interface NarrativeNode {
  id: string;
  name: string;
  chineseName: string;
  sources: string[];
  artifacts: string[];
  description: string;
}

export interface UINode {
  id: string;
  name: string;
  chineseName: string;
  panels: string[];
  dataSources: string[];
  description: string;
}

export interface DataFlow {
  id: string;
  from: string;
  to: string;
  dataType: string;
  description: string;
}

export interface CathedralSchema {
  version: string;
  lastUpdated: Date;
  engines: EngineNode[];
  chambers: ChamberNode[];
  narratives: NarrativeNode[];
  uis: UINode[];
  dataFlows: DataFlow[];
}

// ==================== COMPLETE CATHEDRAL SCHEMA ====================

export const CATHEDRAL_SCHEMA: CathedralSchema = {
  version: '1.0.0',
  lastUpdated: new Date('2026-01-17'),

  // ══════════════════════════════════════════════════════════════════
  //                           ENGINES
  // ══════════════════════════════════════════════════════════════════
  engines: [
    // Core Engines
    {
      id: 'bazi_core',
      name: 'BaZi Core Engine',
      chineseName: '八字核心引擎',
      type: 'core',
      description: 'Calculates Four Pillars from birth data using lunar calendar conversion',
      inputs: ['birth_datetime', 'birth_location', 'gender'],
      outputs: ['four_pillars', 'hidden_stems', 'element_distribution'],
      ruleCount: 0
    },
    {
      id: 'structure_engine',
      name: 'Structure Engine',
      chineseName: '格局引擎',
      type: 'core',
      description: 'Evaluates special structures (假从格, 类从格, 半从格, etc.)',
      inputs: ['four_pillars', 'element_distribution'],
      outputs: ['structure_type', 'structure_strength', 'structure_warnings'],
      ruleCount: 12
    },
    {
      id: 'combination_engine',
      name: 'Combination Engine',
      chineseName: '合化引擎',
      type: 'core',
      description: 'Detects and evaluates stem/branch combinations and transformations',
      inputs: ['four_pillars', 'season'],
      outputs: ['combinations', 'transformations', 'effective_elements'],
      ruleCount: 8
    },
    {
      id: 'useful_god_engine',
      name: 'Useful God Engine',
      chineseName: '用神引擎',
      type: 'core',
      description: 'Determines Useful God (用神) and Annoying God (忌神)',
      inputs: ['four_pillars', 'structure_type', 'element_distribution'],
      outputs: ['useful_god', 'annoying_god', 'god_status', 'god_warnings'],
      ruleCount: 10
    },
    {
      id: 'clash_engine',
      name: 'Clash/Harm/Punishment Engine',
      chineseName: '冲害刑破引擎',
      type: 'core',
      description: 'Detects all four types of negative interactions',
      inputs: ['four_pillars'],
      outputs: ['clashes', 'harms', 'punishments', 'destructions', 'health_warnings'],
      ruleCount: 12
    },
    {
      id: 'seasonal_engine',
      name: 'Seasonal Engine',
      chineseName: '季节引擎',
      type: 'aux',
      description: 'Applies seasonal strength modifiers to elements',
      inputs: ['four_pillars', 'element_distribution'],
      outputs: ['seasonal_modifiers', 'effective_strengths', 'support_needed'],
      ruleCount: 6
    },
    {
      id: 'hidden_stem_engine',
      name: 'Hidden Stem Engine',
      chineseName: '藏干引擎',
      type: 'aux',
      description: 'Analyzes hidden stems and their interactions',
      inputs: ['four_pillars'],
      outputs: ['hidden_stem_strengths', 'revealed_stems', 'hidden_useful_god'],
      ruleCount: 9
    },
    {
      id: 'luck_pillar_engine',
      name: 'Luck Pillar Engine',
      chineseName: '大运引擎',
      type: 'timing',
      description: 'Calculates and evaluates luck pillars (大运)',
      inputs: ['four_pillars', 'gender', 'useful_god'],
      outputs: ['luck_pillars', 'current_pillar', 'pillar_effects', 'timing_alerts'],
      ruleCount: 9
    },
    {
      id: 'annual_luck_engine',
      name: 'Annual Luck Engine',
      chineseName: '流年引擎',
      type: 'timing',
      description: 'Evaluates annual luck (流年) interactions',
      inputs: ['four_pillars', 'luck_pillar', 'current_year'],
      outputs: ['annual_effects', 'monthly_effects', 'timing_recommendations']
    },

    // Narrative Engines
    {
      id: 'codex_mapper',
      name: 'Knowledge Codex Mapper',
      chineseName: '知识典籍映射器',
      type: 'narrative',
      description: 'Transforms rule results into Codex entries with explanations',
      inputs: ['all_engine_outputs'],
      outputs: ['codex_entries', 'persona_hooks', 'journey_hints']
    },
    {
      id: 'persona_generator',
      name: 'Persona Layer Generator',
      chineseName: '人格层生成器',
      type: 'narrative',
      description: 'Generates Luna voice narratives from Codex entries',
      inputs: ['codex_entries'],
      outputs: ['persona_narratives', 'voice_scripts', 'emotional_tones']
    },
    {
      id: 'journey_builder',
      name: 'Pilgrim Journey Builder',
      chineseName: '朝圣旅程构建器',
      type: 'narrative',
      description: 'Constructs ceremonial journey from Codex entries',
      inputs: ['codex_entries'],
      outputs: ['journey_steps', 'chamber_sequence', 'journey_script']
    },

    // Relationship Engine
    {
      id: 'constellation_engine',
      name: 'Constellation Engine',
      chineseName: '星座关系引擎',
      type: 'relationship',
      description: 'Analyzes multi-person relationships and synastry',
      inputs: ['multiple_charts', 'relationship_types'],
      outputs: ['synastry_scores', 'composite_chart', 'relationship_dynamics']
    }
  ],

  // ══════════════════════════════════════════════════════════════════
  //                           CHAMBERS
  // ══════════════════════════════════════════════════════════════════
  chambers: [
    {
      id: 'structure_chamber',
      name: 'Structure Chamber',
      chineseName: '格局厅',
      category: 'codex',
      description: 'Houses all structure-related rules and findings',
      rules: [
        'pseudo_follow_wealth', 'pseudo_follow_authority', 'pseudo_follow_output',
        'quasi_follow_wealth', 'quasi_follow_authority', 'quasi_follow_seal',
        'semi_follow_wealth', 'semi_follow_authority', 'abandoned_follow',
        'structure_balance_violation', 'follow_broken_by_root', 'special_structure_override'
      ],
      iconHint: '🏛️'
    },
    {
      id: 'combination_hall',
      name: 'Combination Hall',
      chineseName: '合化堂',
      category: 'codex',
      description: 'Houses all combination-related rules',
      rules: [
        'combination_season_failure', 'combination_clash_break',
        'combination_jealousy', 'combination_partial', 'stem_combination_basic',
        'branch_six_harmony', 'branch_three_harmony', 'directional_combination'
      ],
      iconHint: '🔗'
    },
    {
      id: 'useful_god_sanctum',
      name: 'Useful God Sanctum',
      chineseName: '用神殿',
      category: 'codex',
      description: 'Houses all useful god rules',
      rules: [
        'useful_god_blocked', 'useful_god_combined_away', 'useful_god_harmed',
        'useful_god_punished', 'useful_god_clashed', 'useful_god_weakened_seasonal',
        'useful_god_in_grave', 'annoying_god_revealed', 'god_absence', 'god_transformation'
      ],
      iconHint: '🎯'
    },
    {
      id: 'conflict_arena',
      name: 'Conflict Arena',
      chineseName: '冲突场',
      category: 'codex',
      description: 'Houses all clash/harm/punishment/destruction rules',
      rules: [
        'clash_beneficial', 'clash_harmful', 'clash_day_year',
        'harm_detected', 'harm_health_impact', 'harm_relationship_impact',
        'punishment_unkindness', 'punishment_bullying', 'punishment_ungrateful',
        'punishment_self', 'destruction_detected', 'multiple_negatives'
      ],
      iconHint: '⚔️'
    },
    {
      id: 'seasonal_gallery',
      name: 'Seasonal Gallery',
      chineseName: '四季廊',
      category: 'codex',
      description: 'Houses seasonal and timing rules',
      rules: [
        'seasonal_peak', 'seasonal_weakness', 'seasonal_death',
        'element_timely', 'element_untimely', 'element_in_grave'
      ],
      iconHint: '🌿'
    },
    {
      id: 'hidden_roots_crypt',
      name: 'Hidden Roots Crypt',
      chineseName: '藏根窖',
      category: 'codex',
      description: 'Houses hidden stem rules',
      rules: [
        'hidden_stem_main_qi', 'hidden_stem_revealed', 'hidden_stem_clashed',
        'hidden_stem_useful_god', 'hidden_stem_annoying_god',
        'hidden_stem_combination_participant', 'hidden_stem_strength_calculation',
        'hidden_stem_seasonal_modification', 'hidden_stem_grave_storage'
      ],
      iconHint: '🔮'
    },
    {
      id: 'luck_pillar_corridor',
      name: 'Luck Pillar Corridor',
      chineseName: '大运廊',
      category: 'codex',
      description: 'Houses luck pillar rules',
      rules: [
        'luck_pillar_transforms_structure', 'luck_pillar_reveals_useful_god',
        'luck_pillar_activates_annoying_god', 'luck_pillar_completes_combination',
        'luck_pillar_breaks_combination', 'luck_pillar_punishment_activation',
        'luck_pillar_seasonal_alignment', 'luck_pillar_element_balance_shift',
        'luck_pillar_stem_branch_conflict'
      ],
      iconHint: '📅'
    },
    {
      id: 'star_observatory',
      name: 'Shen Sha Observatory',
      chineseName: '神煞台',
      category: 'codex',
      description: 'Houses Shen Sha (special stars) rules',
      rules: [],
      iconHint: '⭐'
    }
  ],

  // ══════════════════════════════════════════════════════════════════
  //                         NARRATIVES
  // ══════════════════════════════════════════════════════════════════
  narratives: [
    {
      id: 'knowledge_codex',
      name: 'Knowledge Codex',
      chineseName: '知识典籍',
      sources: [
        'structure_engine', 'combination_engine', 'useful_god_engine',
        'clash_engine', 'seasonal_engine', 'hidden_stem_engine', 'luck_pillar_engine'
      ],
      artifacts: ['codex_entries', 'codex_index', 'codex_pages'],
      description: 'The complete library of findings with technical details and interpretations'
    },
    {
      id: 'persona_layer',
      name: 'Persona Layer',
      chineseName: '人格层',
      sources: ['knowledge_codex'],
      artifacts: ['persona_hooks', 'voice_scripts', 'emotional_narratives'],
      description: 'Luna\'s voice transforming Codex entries into mythic wisdom'
    },
    {
      id: 'pilgrim_journey',
      name: 'Pilgrim Journey',
      chineseName: '朝圣之旅',
      sources: ['knowledge_codex', 'persona_layer'],
      artifacts: ['journey_steps', 'chamber_sequence', 'journey_script', 'voice_journey'],
      description: 'The ceremonial guided journey through Cathedral chambers'
    }
  ],

  // ══════════════════════════════════════════════════════════════════
  //                              UIs
  // ══════════════════════════════════════════════════════════════════
  uis: [
    {
      id: 'cathedral_main',
      name: 'Cathedral Main UI',
      chineseName: '大教堂主界面',
      panels: ['analysis_summary', 'codex_entries', 'persona_hooks', 'journey_map'],
      dataSources: ['all_engines', 'knowledge_codex', 'persona_layer', 'pilgrim_journey'],
      description: 'The primary tri-panel Cathedral interface'
    },
    {
      id: 'cathedral_index',
      name: 'Cathedral Index',
      chineseName: '大教堂索引',
      panels: ['module_tree', 'engine_list', 'chamber_list', 'rule_index'],
      dataSources: ['cathedral_schema'],
      description: 'Master index of all Cathedral modules and rules'
    },
    {
      id: 'narrative_cockpit',
      name: 'Narrative Cockpit',
      chineseName: '叙事驾驶舱',
      panels: ['story_beats', 'emotional_arc', 'timing_curve', 'environmental_overlay'],
      dataSources: ['luck_pillar_engine', 'annual_luck_engine', 'persona_layer'],
      description: 'Dashboard for story beats, emotional arcs, and timing'
    },
    {
      id: 'constellation_ui',
      name: 'Constellation UI',
      chineseName: '星座关系界面',
      panels: ['constellation_map', 'synastry_heatmap', 'composite_chart', 'lifecycle_phases'],
      dataSources: ['constellation_engine'],
      description: 'Multi-person relationship visualization'
    },
    {
      id: 'devtools',
      name: 'DevTools',
      chineseName: '开发工具',
      panels: ['rule_debugger', 'timing_analyzer', 'story_debugger', 'data_inspector'],
      dataSources: ['all_engines'],
      description: 'Developer tools for debugging and analysis'
    }
  ],

  // ══════════════════════════════════════════════════════════════════
  //                         DATA FLOWS
  // ══════════════════════════════════════════════════════════════════
  dataFlows: [
    // Input to Core
    {
      id: 'input_to_bazi',
      from: 'user_input',
      to: 'bazi_core',
      dataType: 'BirthData',
      description: 'Birth datetime, location, gender to BaZi core'
    },

    // Core to Analysis
    {
      id: 'bazi_to_structure',
      from: 'bazi_core',
      to: 'structure_engine',
      dataType: 'FourPillars',
      description: 'Four pillars to structure analysis'
    },
    {
      id: 'bazi_to_combination',
      from: 'bazi_core',
      to: 'combination_engine',
      dataType: 'FourPillars',
      description: 'Four pillars to combination detection'
    },
    {
      id: 'structure_to_useful_god',
      from: 'structure_engine',
      to: 'useful_god_engine',
      dataType: 'StructureResult',
      description: 'Structure affects useful god determination'
    },
    {
      id: 'bazi_to_clash',
      from: 'bazi_core',
      to: 'clash_engine',
      dataType: 'FourPillars',
      description: 'Four pillars to conflict detection'
    },
    {
      id: 'bazi_to_seasonal',
      from: 'bazi_core',
      to: 'seasonal_engine',
      dataType: 'FourPillars',
      description: 'Four pillars to seasonal analysis'
    },
    {
      id: 'bazi_to_hidden',
      from: 'bazi_core',
      to: 'hidden_stem_engine',
      dataType: 'FourPillars',
      description: 'Four pillars to hidden stem analysis'
    },

    // Analysis to Codex
    {
      id: 'engines_to_codex',
      from: 'all_engines',
      to: 'codex_mapper',
      dataType: 'EngineResults',
      description: 'All engine outputs to Codex mapper'
    },

    // Codex to Narratives
    {
      id: 'codex_to_persona',
      from: 'codex_mapper',
      to: 'persona_generator',
      dataType: 'CodexEntries',
      description: 'Codex entries to persona generation'
    },
    {
      id: 'codex_to_journey',
      from: 'codex_mapper',
      to: 'journey_builder',
      dataType: 'CodexEntries',
      description: 'Codex entries to journey construction'
    },

    // To UIs
    {
      id: 'all_to_cathedral_ui',
      from: 'all_outputs',
      to: 'cathedral_main',
      dataType: 'CathedralOutput',
      description: 'Complete output to main Cathedral UI'
    },
    {
      id: 'timing_to_cockpit',
      from: 'luck_pillar_engine',
      to: 'narrative_cockpit',
      dataType: 'TimingData',
      description: 'Timing data to narrative cockpit'
    },
    {
      id: 'multi_charts_to_constellation',
      from: 'multiple_bazi_outputs',
      to: 'constellation_engine',
      dataType: 'MultipleCharts',
      description: 'Multiple charts to constellation analysis'
    }
  ]
};

// ==================== SCHEMA QUERY FUNCTIONS ====================

/**
 * Get engine by ID
 */
export function getEngine(id: string): EngineNode | undefined {
  return CATHEDRAL_SCHEMA.engines.find(e => e.id === id);
}

/**
 * Get chamber by ID
 */
export function getChamber(id: string): ChamberNode | undefined {
  return CATHEDRAL_SCHEMA.chambers.find(c => c.id === id);
}

/**
 * Get all rules in a chamber
 */
export function getChamberRules(chamberId: string): string[] {
  const chamber = getChamber(chamberId);
  return chamber?.rules || [];
}

/**
 * Find which chamber contains a rule
 */
export function findChamberForRule(ruleId: string): ChamberNode | undefined {
  return CATHEDRAL_SCHEMA.chambers.find(c => c.rules.includes(ruleId));
}

/**
 * Get all engines that feed into a target
 */
export function getUpstreamEngines(targetId: string): EngineNode[] {
  const flows = CATHEDRAL_SCHEMA.dataFlows.filter(f => f.to === targetId);
  return flows
    .map(f => getEngine(f.from))
    .filter((e): e is EngineNode => e !== undefined);
}

/**
 * Get all targets that receive from a source
 */
export function getDownstreamTargets(sourceId: string): string[] {
  return CATHEDRAL_SCHEMA.dataFlows
    .filter(f => f.from === sourceId)
    .map(f => f.to);
}

/**
 * Generate schema statistics
 */
export function getSchemaStats(): {
  engineCount: number;
  chamberCount: number;
  totalRules: number;
  narrativeCount: number;
  uiCount: number;
  dataFlowCount: number;
} {
  const totalRules = CATHEDRAL_SCHEMA.chambers.reduce(
    (sum, c) => sum + c.rules.length,
    0
  );

  return {
    engineCount: CATHEDRAL_SCHEMA.engines.length,
    chamberCount: CATHEDRAL_SCHEMA.chambers.length,
    totalRules,
    narrativeCount: CATHEDRAL_SCHEMA.narratives.length,
    uiCount: CATHEDRAL_SCHEMA.uis.length,
    dataFlowCount: CATHEDRAL_SCHEMA.dataFlows.length
  };
}

/**
 * Render schema as Markdown
 */
export function renderSchemaMarkdown(): string {
  const stats = getSchemaStats();
  const lines: string[] = [];

  lines.push('# Cathedral Schema Map');
  lines.push(`*Version ${CATHEDRAL_SCHEMA.version}*`);
  lines.push('');
  lines.push('## Statistics');
  lines.push(`- **Engines:** ${stats.engineCount}`);
  lines.push(`- **Chambers:** ${stats.chamberCount}`);
  lines.push(`- **Total Rules:** ${stats.totalRules}`);
  lines.push(`- **Narrative Layers:** ${stats.narrativeCount}`);
  lines.push(`- **UI Components:** ${stats.uiCount}`);
  lines.push(`- **Data Flows:** ${stats.dataFlowCount}`);
  lines.push('');

  lines.push('## Engines');
  for (const engine of CATHEDRAL_SCHEMA.engines) {
    lines.push(`### ${engine.name} (${engine.chineseName})`);
    lines.push(`*Type: ${engine.type}*`);
    lines.push('');
    lines.push(engine.description);
    lines.push('');
    lines.push(`**Inputs:** ${engine.inputs.join(', ')}`);
    lines.push(`**Outputs:** ${engine.outputs.join(', ')}`);
    if (engine.ruleCount) {
      lines.push(`**Rules:** ${engine.ruleCount}`);
    }
    lines.push('');
  }

  lines.push('## Chambers');
  for (const chamber of CATHEDRAL_SCHEMA.chambers) {
    lines.push(`### ${chamber.iconHint} ${chamber.name} (${chamber.chineseName})`);
    lines.push(chamber.description);
    lines.push('');
    lines.push(`**Rules (${chamber.rules.length}):**`);
    chamber.rules.forEach(r => lines.push(`- \`${r}\``));
    lines.push('');
  }

  lines.push('## Narrative Layers');
  for (const narrative of CATHEDRAL_SCHEMA.narratives) {
    lines.push(`### ${narrative.name} (${narrative.chineseName})`);
    lines.push(narrative.description);
    lines.push('');
    lines.push(`**Sources:** ${narrative.sources.join(', ')}`);
    lines.push(`**Artifacts:** ${narrative.artifacts.join(', ')}`);
    lines.push('');
  }

  lines.push('## UI Components');
  for (const ui of CATHEDRAL_SCHEMA.uis) {
    lines.push(`### ${ui.name} (${ui.chineseName})`);
    lines.push(ui.description);
    lines.push('');
    lines.push(`**Panels:** ${ui.panels.join(', ')}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Render schema as ASCII diagram
 */
export function renderSchemaAscii(): string {
  return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        CATHEDRAL SCHEMA ARCHITECTURE                          ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌─────────────────┐                                                         ║
║  │   USER INPUT    │                                                         ║
║  │ birth, location │                                                         ║
║  └────────┬────────┘                                                         ║
║           │                                                                   ║
║           ▼                                                                   ║
║  ┌─────────────────┐                                                         ║
║  │   BAZI CORE     │◄──────────────────────────────────────┐                 ║
║  │   八字核心引擎   │                                        │                 ║
║  └────────┬────────┘                                        │                 ║
║           │                                                  │                 ║
║           ├──────────────────┬───────────────┬──────────────┤                 ║
║           ▼                  ▼               ▼              ▼                 ║
║  ┌────────────────┐ ┌────────────────┐ ┌──────────┐ ┌──────────────┐         ║
║  │ STRUCTURE      │ │ COMBINATION    │ │ CLASH    │ │ SEASONAL     │         ║
║  │ 格局引擎        │ │ 合化引擎        │ │ 冲害刑破  │ │ 季节引擎      │         ║
║  └────────┬───────┘ └────────┬───────┘ └────┬─────┘ └──────┬───────┘         ║
║           │                  │              │              │                  ║
║           └──────────────────┼──────────────┼──────────────┘                  ║
║                              ▼              ▼                                 ║
║                     ┌────────────────┐ ┌────────────────┐                     ║
║                     │ USEFUL GOD     │ │ HIDDEN STEM    │                     ║
║                     │ 用神引擎        │ │ 藏干引擎        │                     ║
║                     └────────┬───────┘ └────────┬───────┘                     ║
║                              │                  │                             ║
║                              └────────┬─────────┘                             ║
║                                       │                                       ║
║                                       ▼                                       ║
║                            ┌────────────────────┐                             ║
║                            │   LUCK PILLAR      │                             ║
║                            │   大运引擎          │                             ║
║                            └─────────┬──────────┘                             ║
║                                      │                                        ║
║  ════════════════════════════════════╪════════════════════════════════════   ║
║                                      ▼                                        ║
║                            ┌────────────────────┐                             ║
║                            │  CODEX MAPPER      │                             ║
║                            │  知识典籍映射器     │                             ║
║                            └─────────┬──────────┘                             ║
║                                      │                                        ║
║           ┌──────────────────────────┼──────────────────────────┐             ║
║           ▼                          ▼                          ▼             ║
║  ┌────────────────┐       ┌────────────────────┐      ┌────────────────┐     ║
║  │ KNOWLEDGE      │       │ PERSONA LAYER      │      │ PILGRIM        │     ║
║  │ CODEX          │──────▶│ 人格层              │─────▶│ JOURNEY        │     ║
║  │ 知识典籍        │       │                    │      │ 朝圣之旅        │     ║
║  └────────────────┘       └────────────────────┘      └────────────────┘     ║
║                                      │                                        ║
║  ════════════════════════════════════╪════════════════════════════════════   ║
║                                      ▼                                        ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             ║
║  │ CATHEDRAL   │ │ NARRATIVE   │ │ CONSTELL-   │ │ DEVTOOLS    │             ║
║  │ MAIN UI     │ │ COCKPIT     │ │ ATION UI    │ │             │             ║
║  │ 大教堂主界面  │ │ 叙事驾驶舱   │ │ 星座关系界面  │ │ 开发工具      │             ║
║  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`;
}
