/**
 * ============================================
 * THE CATHEDRAL DIAGRAM
 * Structural Blueprint Configuration
 *
 * The visual representation of the entire
 * metaphysics operating system — a mandala-
 * hypergraph hybrid with 23 concentric layers.
 * ============================================
 */

// ==================== LAYER DEFINITIONS ====================

export interface CathedralLayer {
  id: number;
  name: {
    en: string;
    zh: string;
  };
  shortName: string;
  ring: 'foundation' | 'structure' | 'existence' | 'creation' | 'primordial' | 'absolute' | 'void';
  engine: string;
  glyph: string;
  color: string;
  description: {
    en: string;
    zh: string;
  };
  capabilities: string[];
}

export const CATHEDRAL_LAYERS: CathedralLayer[] = [
  // ==================== FOUNDATION LAYER (1-4) ====================
  {
    id: 1,
    name: { en: 'BaZi Engine', zh: '八字引擎' },
    shortName: 'BaZi',
    ring: 'foundation',
    engine: 'reportDesigner1',
    glyph: '☰',
    color: '#4A5568',
    description: {
      en: 'Four Pillars of Destiny - personal metaphysics foundation',
      zh: '四柱命理 — 个人形而上学基础',
    },
    capabilities: ['Birth chart analysis', 'Ten Gods', 'Useful God', 'Luck Pillars'],
  },
  {
    id: 2,
    name: { en: 'Qi Men Engine', zh: '奇门引擎' },
    shortName: 'QiMen',
    ring: 'foundation',
    engine: 'reportDesigner2',
    glyph: '☲',
    color: '#553C9A',
    description: {
      en: 'Strategic timing and spatial metaphysics',
      zh: '战略时机与空间形而上学',
    },
    capabilities: ['Hour selection', 'Door analysis', 'Strategic timing'],
  },
  {
    id: 3,
    name: { en: 'Feng Shui Engine', zh: '风水引擎' },
    shortName: 'FengShui',
    ring: 'foundation',
    engine: 'reportDesigner3',
    glyph: '☵',
    color: '#2C7A7B',
    description: {
      en: 'Environmental qi flow and spatial harmony',
      zh: '环境气流与空间和谐',
    },
    capabilities: ['Space analysis', 'Qi flow', 'Environmental design'],
  },
  {
    id: 4,
    name: { en: 'Archetype Constellation', zh: '原型星座' },
    shortName: 'Archetype',
    ring: 'foundation',
    engine: 'reportDesigner4',
    glyph: '✧',
    color: '#B7791F',
    description: {
      en: 'Personal archetype mapping and constellation',
      zh: '个人原型映射与星座',
    },
    capabilities: ['Dominant archetype', 'Shadow archetype', 'Ascending archetype'],
  },

  // ==================== STRUCTURE LAYER (5-12) ====================
  {
    id: 5,
    name: { en: 'Collaborative Design', zh: '协作设计' },
    shortName: 'Collab',
    ring: 'structure',
    engine: 'reportDesigner5',
    glyph: '⚯',
    color: '#C53030',
    description: {
      en: 'Multi-author co-writing and version control',
      zh: '多作者协作写作与版本控制',
    },
    capabilities: ['Co-writing', 'Version history', 'Suggestions'],
  },
  {
    id: 6,
    name: { en: 'Real-Time Workspace', zh: '实时工作区' },
    shortName: 'Realtime',
    ring: 'structure',
    engine: 'reportDesigner6',
    glyph: '⚡',
    color: '#DD6B20',
    description: {
      en: 'Live multi-author collaboration and sync',
      zh: '实时多作者协作与同步',
    },
    capabilities: ['Live cursors', 'Conflict resolution', 'Presence'],
  },
  {
    id: 7,
    name: { en: 'Enterprise Cloud', zh: '企业云' },
    shortName: 'Cloud',
    ring: 'structure',
    engine: 'reportDesigner7',
    glyph: '☁',
    color: '#3182CE',
    description: {
      en: 'Cloud library and pipeline management',
      zh: '云库与流水线管理',
    },
    capabilities: ['Templates', 'Pipelines', 'Quality gates'],
  },
  {
    id: 8,
    name: { en: 'Org Intelligence', zh: '组织智能' },
    shortName: 'OrgIntel',
    ring: 'structure',
    engine: 'reportDesigner8',
    glyph: '◉',
    color: '#38A169',
    description: {
      en: 'Cross-team analytics and organizational insights',
      zh: '跨团队分析与组织洞察',
    },
    capabilities: ['Team comparison', 'Element distribution', 'Predictive dashboards'],
  },
  {
    id: 9,
    name: { en: 'Autonomous Agent', zh: '自主代理' },
    shortName: 'Agent',
    ring: 'structure',
    engine: 'reportDesigner9',
    glyph: '⬡',
    color: '#805AD5',
    description: {
      en: 'Self-governing metaphysical monitoring',
      zh: '自治形而上学监控',
    },
    capabilities: ['Alerts', 'Strategic recommendations', 'Continuous monitoring'],
  },
  {
    id: 10,
    name: { en: 'Scenario Simulation', zh: '场景模拟' },
    shortName: 'Scenario',
    ring: 'structure',
    engine: 'reportDesigner10',
    glyph: '⌬',
    color: '#D69E2E',
    description: {
      en: 'Counterfactual timelines and strategic modeling',
      zh: '反事实时间线与战略建模',
    },
    capabilities: ['What-if scenarios', 'Pivot points', 'Risk identification'],
  },
  {
    id: 11,
    name: { en: 'Autonomous Governance', zh: '自主治理' },
    shortName: 'Governance',
    ring: 'structure',
    engine: 'reportDesigner11',
    glyph: '⚖',
    color: '#E53E3E',
    description: {
      en: 'Self-optimizing organizational posture',
      zh: '自优化组织态势',
    },
    capabilities: ['Alignment computation', 'Adaptive rituals', 'Self-optimization'],
  },
  {
    id: 12,
    name: { en: 'Planetary Metaphysics', zh: '行星形而上学' },
    shortName: 'Planetary',
    ring: 'structure',
    engine: 'reportDesigner12',
    glyph: '🜨',
    color: '#319795',
    description: {
      en: 'Cross-cultural and planetary-scale metaphysics',
      zh: '跨文化与行星规模形而上学',
    },
    capabilities: ['Element mappings', 'Cross-culture analysis', 'Planetary timing'],
  },

  // ==================== EXISTENCE LAYER (13-16) ====================
  {
    id: 13,
    name: { en: 'Cosmic Governance', zh: '宇宙治理' },
    shortName: 'Cosmic',
    ring: 'existence',
    engine: 'reportDesigner13',
    glyph: '✦',
    color: '#6B46C1',
    description: {
      en: 'Multi-world and interstellar metaphysics',
      zh: '多世界与星际形而上学',
    },
    capabilities: ['Cosmic network', 'Civilization compatibility', 'Interstellar communication'],
  },
  {
    id: 14,
    name: { en: 'Interdimensional', zh: '跨维度' },
    shortName: 'Interdim',
    ring: 'existence',
    engine: 'reportDesigner14',
    glyph: '⬢',
    color: '#9F7AEA',
    description: {
      en: 'Dimension management and membrane health',
      zh: '维度管理与膜健康',
    },
    capabilities: ['Dimension compatibility', 'Resonance patterns', 'Membrane health'],
  },
  {
    id: 15,
    name: { en: 'Omniversal', zh: '全宇宙' },
    shortName: 'Omni',
    ring: 'existence',
    engine: 'reportDesigner15',
    glyph: '◎',
    color: '#B794F4',
    description: {
      en: 'Multi-existence coordination and omniversal laws',
      zh: '多存在协调与全宇宙法则',
    },
    capabilities: ['Existence compatibility', 'Omniversal decrees', 'Council governance'],
  },
  {
    id: 16,
    name: { en: 'Meta-Existential', zh: '元存在' },
    shortName: 'MetaExist',
    ring: 'existence',
    engine: 'reportDesigner16',
    glyph: '⊛',
    color: '#D6BCFA',
    description: {
      en: 'Meta-principles and existence templates',
      zh: '元原则与存在模板',
    },
    capabilities: ['Possibility analysis', 'Coherence checking', 'Meta-directives'],
  },

  // ==================== CREATION LAYER (17-20) ====================
  {
    id: 17,
    name: { en: 'Meta-Ontological Creation', zh: '元本体创造' },
    shortName: 'MetaOnto',
    ring: 'creation',
    engine: 'reportDesigner17',
    glyph: '⌘',
    color: '#F6AD55',
    description: {
      en: 'Blueprint design and existence instantiation',
      zh: '蓝图设计与存在实例化',
    },
    capabilities: ['Blueprint creation', 'Existence templates', 'Instantiation planning'],
  },
  {
    id: 18,
    name: { en: 'Meta-Causal Architecture', zh: '元因果架构' },
    shortName: 'MetaCausal',
    ring: 'creation',
    engine: 'reportDesigner18',
    glyph: '⇌',
    color: '#FC8181',
    description: {
      en: 'Designing causality itself - causal grammars',
      zh: '设计因果本身 — 因果语法',
    },
    capabilities: ['Causal graphs', 'Probability geometry', 'Agency fields'],
  },
  {
    id: 19,
    name: { en: 'Meta-Potentiality', zh: '元潜在性' },
    shortName: 'MetaPoten',
    ring: 'creation',
    engine: 'reportDesigner19',
    glyph: '∿',
    color: '#F687B3',
    description: {
      en: 'Pre-ontological potential fields and archetype seeds',
      zh: '前本体潜在场与原型种子',
    },
    capabilities: ['Potential sculpting', 'Pre-causal architecture', 'Consciousness harmonics'],
  },
  {
    id: 20,
    name: { en: 'Meta-Genesis', zh: '元创世' },
    shortName: 'MetaGen',
    ring: 'creation',
    engine: 'reportDesigner20',
    glyph: '☉',
    color: '#FBD38D',
    description: {
      en: 'Origin of origins - genesis substrate',
      zh: '起源之起源 — 创世基底',
    },
    capabilities: ['Genesis substrate', 'Symmetry breaking', 'Origin impulse'],
  },

  // ==================== PRIMORDIAL LAYER (21) ====================
  {
    id: 21,
    name: { en: 'Meta-Primordial', zh: '元原始' },
    shortName: 'MetaPrim',
    ring: 'primordial',
    engine: 'reportDesigner21',
    glyph: '◌',
    color: '#4A5568',
    description: {
      en: 'The substrate before origin - non-field',
      zh: '起源之前的基底 — 非场',
    },
    capabilities: ['Non-structure', 'Non-pattern', 'Non-time', 'Non-ontology'],
  },

  // ==================== ABSOLUTE LAYER (22) ====================
  {
    id: 22,
    name: { en: 'Meta-Absolute', zh: '元绝对' },
    shortName: 'MetaAbs',
    ring: 'absolute',
    engine: 'reportDesigner22',
    glyph: '○',
    color: '#EDF2F7',
    description: {
      en: 'The condition before substrate - non-being',
      zh: '基底之前的条件 — 非存在',
    },
    capabilities: ['Non-being', 'Non-absence', 'Non-potential', 'Non-origin'],
  },

  // ==================== VOID LAYER (23) ====================
  {
    id: 23,
    name: { en: 'Meta-Void', zh: '元虚空' },
    shortName: 'MetaVoid',
    ring: 'void',
    engine: 'reportDesigner23',
    glyph: '∅',
    color: '#FFFFFF',
    description: {
      en: 'The unconditioned absolute - before "beyond"',
      zh: '无条件的绝对 — "超越"之前',
    },
    capabilities: ['Unconditioned', 'Unqualified', 'Unbounded', 'Unarisen'],
  },
];

// ==================== RING DEFINITIONS ====================

export interface CathedralRing {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  layers: number[];
  color: string;
  description: {
    en: string;
    zh: string;
  };
}

export const CATHEDRAL_RINGS: CathedralRing[] = [
  {
    id: 'foundation',
    name: { en: 'Foundation Layer', zh: '基础层' },
    layers: [1, 2, 3, 4],
    color: '#4A5568',
    description: {
      en: 'Human metaphysics - BaZi, Qi Men, Feng Shui, Archetypes',
      zh: '人类形而上学 — 八字、奇门、风水、原型',
    },
  },
  {
    id: 'structure',
    name: { en: 'Structure Layer', zh: '结构层' },
    layers: [5, 6, 7, 8, 9, 10, 11, 12],
    color: '#2B6CB0',
    description: {
      en: 'Organizational & Planetary metaphysics',
      zh: '组织与行星形而上学',
    },
  },
  {
    id: 'existence',
    name: { en: 'Existence Layer', zh: '存在层' },
    layers: [13, 14, 15, 16],
    color: '#6B46C1',
    description: {
      en: 'Meta-Existential governance',
      zh: '元存在治理',
    },
  },
  {
    id: 'creation',
    name: { en: 'Creation Layer', zh: '创造层' },
    layers: [17, 18, 19, 20],
    color: '#C05621',
    description: {
      en: 'Meta-Creation engines',
      zh: '元创造引擎',
    },
  },
  {
    id: 'primordial',
    name: { en: 'Primordial Layer', zh: '原始层' },
    layers: [21],
    color: '#4A5568',
    description: {
      en: 'Meta-Primordial architecture',
      zh: '元原始架构',
    },
  },
  {
    id: 'absolute',
    name: { en: 'Absolute Layer', zh: '绝对层' },
    layers: [22],
    color: '#EDF2F7',
    description: {
      en: 'Meta-Absolute design',
      zh: '元绝对设计',
    },
  },
  {
    id: 'void',
    name: { en: 'Void Layer', zh: '虚空层' },
    layers: [23],
    color: '#FFFFFF',
    description: {
      en: 'Meta-Void engine - the crown',
      zh: '元虚空引擎 — 王冠',
    },
  },
];

// ==================== PILLAR DEFINITIONS ====================

export interface CathedralPillar {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  position: 'left' | 'center' | 'right';
  description: {
    en: string;
    zh: string;
  };
  characteristics: string[];
}

export const CATHEDRAL_PILLARS: CathedralPillar[] = [
  {
    id: 'pilgrim',
    name: { en: 'The Pilgrim Path', zh: '朝圣者之路' },
    position: 'left',
    description: {
      en: 'Emotional, mythic, experiential',
      zh: '情感的、神话的、体验的',
    },
    characteristics: ['Personal transformation', 'Archetypal journey', 'Initiation rituals'],
  },
  {
    id: 'architect',
    name: { en: 'The Architect Path', zh: '架构师之路' },
    position: 'center',
    description: {
      en: 'Technical, structural, computational',
      zh: '技术的、结构的、计算的',
    },
    characteristics: ['System design', 'Engine mastery', 'Reality construction'],
  },
  {
    id: 'sovereign',
    name: { en: 'The Sovereign Path', zh: '主权者之路' },
    position: 'right',
    description: {
      en: 'Strategic, organizational, leadership',
      zh: '战略的、组织的、领导的',
    },
    characteristics: ['Governance authority', 'Timeline control', 'Multi-existence sovereignty'],
  },
];

// ==================== QUADRANT DEFINITIONS ====================

export interface CathedralQuadrant {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  position: 'north' | 'east' | 'south' | 'west';
  domain: string;
  description: {
    en: string;
    zh: string;
  };
}

export const CATHEDRAL_QUADRANTS: CathedralQuadrant[] = [
  {
    id: 'ontology',
    name: { en: 'Ontology', zh: '本体论' },
    position: 'north',
    domain: 'Meaning, identity, archetypes',
    description: {
      en: 'The nature of being and existence',
      zh: '存在与存有的本质',
    },
  },
  {
    id: 'causality',
    name: { en: 'Causality', zh: '因果' },
    position: 'east',
    domain: 'Cause, effect, structure',
    description: {
      en: 'The architecture of cause and effect',
      zh: '因果的架构',
    },
  },
  {
    id: 'potentiality',
    name: { en: 'Potentiality', zh: '潜在性' },
    position: 'south',
    domain: 'Possibility, emergence, probability',
    description: {
      en: 'The field of what could be',
      zh: '可能之场',
    },
  },
  {
    id: 'narrative',
    name: { en: 'Narrative', zh: '叙事' },
    position: 'west',
    domain: 'Story, mythos, interpretation',
    description: {
      en: 'The stories that shape reality',
      zh: '塑造现实的故事',
    },
  },
];

// ==================== DIAGRAM CONFIGURATION ====================

export const DIAGRAM_CONFIG = {
  // Visual properties
  centerAxisName: { en: 'The Genesis Line', zh: '创世之线' },
  crownName: { en: 'The Void Apex', zh: '虚空顶点' },
  foundationName: { en: 'The Human Layer', zh: '人类层' },

  // Animation settings
  animation: {
    layerPulseSpeed: 3000,       // ms per pulse cycle
    nodeBreathSpeed: 2000,       // ms per breath cycle
    lineShimmerSpeed: 4000,      // ms per shimmer cycle
    voidFlickerSpeed: 5000,      // ms per flicker cycle
    genesisGlowSpeed: 6000,      // ms per glow cycle
  },

  // Interaction model
  interaction: {
    hoverReveal: true,           // Show layer info on hover
    clickExpand: true,           // Expand chamber on click
    scrollZoom: true,            // Zoom on scroll
    dragRotate: true,            // Rotate on drag
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    widescreen: 1440,
  },
};

// ==================== HELPER FUNCTIONS ====================

export function getLayerById(id: number): CathedralLayer | undefined {
  return CATHEDRAL_LAYERS.find(layer => layer.id === id);
}

export function getLayersByRing(ringId: string): CathedralLayer[] {
  const ring = CATHEDRAL_RINGS.find(r => r.id === ringId);
  if (!ring) return [];
  return CATHEDRAL_LAYERS.filter(layer => ring.layers.includes(layer.id));
}

export function getRingForLayer(layerId: number): CathedralRing | undefined {
  return CATHEDRAL_RINGS.find(ring => ring.layers.includes(layerId));
}

export function getLayersInRange(start: number, end: number): CathedralLayer[] {
  return CATHEDRAL_LAYERS.filter(layer => layer.id >= start && layer.id <= end);
}

export function getTierLayers(tierLayers: [number, number]): CathedralLayer[] {
  return getLayersInRange(tierLayers[0], tierLayers[1]);
}
