/**
 * ============================================
 * THE CATHEDRAL — SIGIL DESIGN SKETCHES
 * Complete Symbolic Language System
 *
 * Geometric blueprints for all Cathedral sigils.
 * Each sigil is described in precise geometric terms
 * for exact recreation in Figma, Illustrator, or code.
 * ============================================
 */

// ==================== SIGIL TYPES ====================

export type SigilCategory = 'master' | 'layer' | 'pillar' | 'quadrant';
export type GeometricPrimitive = 'circle' | 'triangle' | 'square' | 'line' | 'dot' | 'hexagon' | 'spiral' | 'grid' | 'arc' | 'wave' | 'cube' | 'flame' | 'knot' | 'ring' | 'crown';

export interface GeometricElement {
  primitive: GeometricPrimitive;
  position: 'center' | 'inside' | 'outside' | 'intersecting' | 'surrounding';
  orientation?: 'up' | 'down' | 'left' | 'right' | 'horizontal' | 'vertical';
  count?: number;
  arrangement?: string;
}

export interface SigilDesign {
  id: string;
  layer?: number;
  name: {
    en: string;
    zh: string;
  };
  category: SigilCategory;
  glyph: string;
  geometry: GeometricElement[];
  description: {
    en: string;
    zh: string;
  };
  symbolism: {
    en: string;
    zh: string;
  };
  visualFeel?: string[];
}

export interface SigilStyleGuide {
  lineWeight: string;
  geometricPrimitives: GeometricPrimitive[];
  aesthetic: string[];
  motionBehaviors: string[];
}

// ==================== MASTER SIGIL ====================

export const MASTER_SIGIL_DESIGN: SigilDesign = {
  id: 'cathedral-mark',
  name: { en: 'The Cathedral Mark', zh: '大教堂标记' },
  category: 'master',
  glyph: '◉',
  geometry: [
    {
      primitive: 'circle',
      position: 'outside',
      count: 23,
      arrangement: 'concentric rings, one for each layer',
    },
    {
      primitive: 'line',
      position: 'center',
      orientation: 'vertical',
      arrangement: 'Genesis Line running through center',
    },
    {
      primitive: 'line',
      position: 'inside',
      orientation: 'vertical',
      count: 3,
      arrangement: 'Three pillars: Left=Pilgrim, Center=Architect, Right=Sovereign',
    },
    {
      primitive: 'line',
      position: 'intersecting',
      count: 4,
      arrangement: 'Four quadrants: North=Ontology, East=Causality, South=Potentiality, West=Narrative',
    },
  ],
  description: {
    en: '23 thin concentric circles with a vertical Genesis Line through center, three vertical pillars, and four quadrant divisions',
    zh: '23个细同心圆，中心有垂直创世线，三根垂直支柱，四个象限划分',
  },
  symbolism: {
    en: 'The complete metaphysical architecture of reality',
    zh: '现实的完整形而上学架构',
  },
  visualFeel: [
    'A sacred, architectural mandala',
    'A metaphysical circuit board',
    'A cosmic floor plan',
  ],
};

// ==================== LAYER SIGIL DESIGNS (1-23) ====================

export const LAYER_SIGIL_DESIGNS: SigilDesign[] = [
  // FOUNDATION TIER (1-4)
  {
    id: 'layer-1',
    layer: 1,
    name: { en: 'Human Pattern', zh: '人类模式' },
    category: 'layer',
    glyph: '☉',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'dot', position: 'center' },
    ],
    description: {
      en: 'A circle with a single dot in the center',
      zh: '一个圆，中心有一个点',
    },
    symbolism: {
      en: 'Represents identity — the singular self within the field',
      zh: '代表身份——领域内的独特自我',
    },
  },
  {
    id: 'layer-2',
    layer: 2,
    name: { en: 'Archetype Seed', zh: '原型种子' },
    category: 'layer',
    glyph: '△',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'triangle', position: 'inside', orientation: 'up' },
    ],
    description: {
      en: 'A triangle inside a circle',
      zh: '圆内有一个三角形',
    },
    symbolism: {
      en: 'Represents the first differentiation — emergence from unity',
      zh: '代表第一次分化——从统一中涌现',
    },
  },
  {
    id: 'layer-3',
    layer: 3,
    name: { en: 'Timeline Gate', zh: '时间线之门' },
    category: 'layer',
    glyph: '‖',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'line', position: 'inside', orientation: 'vertical', count: 2, arrangement: 'parallel' },
    ],
    description: {
      en: 'Two parallel vertical lines inside a circle',
      zh: '圆内有两条平行垂直线',
    },
    symbolism: {
      en: 'Represents dual timelines — the gate between possible futures',
      zh: '代表双重时间线——可能未来之间的门',
    },
  },
  {
    id: 'layer-4',
    layer: 4,
    name: { en: 'Elemental Crossroads', zh: '元素十字路口' },
    category: 'layer',
    glyph: '✚',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'line', position: 'inside', orientation: 'horizontal' },
      { primitive: 'line', position: 'inside', orientation: 'vertical' },
    ],
    description: {
      en: 'A cross dividing the circle into four quadrants',
      zh: '十字将圆分成四个象限',
    },
    symbolism: {
      en: 'Represents elemental structure — the four fundamental forces',
      zh: '代表元素结构——四种基本力量',
    },
  },

  // STRUCTURE TIER (5-8)
  {
    id: 'layer-5',
    layer: 5,
    name: { en: 'Team Resonance', zh: '团队共振' },
    category: 'layer',
    glyph: '∴',
    geometry: [
      { primitive: 'dot', position: 'inside', count: 3, arrangement: 'triangular formation' },
    ],
    description: {
      en: 'Three dots forming a triangle',
      zh: '三个点形成三角形',
    },
    symbolism: {
      en: 'Represents group dynamics — the minimal unit of collaboration',
      zh: '代表群体动力——协作的最小单位',
    },
  },
  {
    id: 'layer-6',
    layer: 6,
    name: { en: 'Organizational Field', zh: '组织场' },
    category: 'layer',
    glyph: '⬡',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'hexagon', position: 'inside' },
    ],
    description: {
      en: 'A hexagon inside a circle',
      zh: '圆内有一个六边形',
    },
    symbolism: {
      en: 'Represents structure and governance — the honeycomb of organization',
      zh: '代表结构和治理——组织的蜂窝',
    },
  },
  {
    id: 'layer-7',
    layer: 7,
    name: { en: 'Strategic Flow', zh: '战略流' },
    category: 'layer',
    glyph: '⤴',
    geometry: [
      { primitive: 'arc', position: 'center', orientation: 'up', arrangement: 'curved line sweeping upward' },
    ],
    description: {
      en: 'A curved line sweeping upward',
      zh: '一条向上弯曲的线',
    },
    symbolism: {
      en: 'Represents directional timing — the arc of strategic momentum',
      zh: '代表方向性时机——战略动力的弧线',
    },
  },
  {
    id: 'layer-8',
    layer: 8,
    name: { en: 'Scenario Lattice', zh: '场景格' },
    category: 'layer',
    glyph: '▦',
    geometry: [
      { primitive: 'grid', position: 'center', count: 9, arrangement: '3x3 squares' },
    ],
    description: {
      en: 'A grid of 3×3 squares',
      zh: '3×3方格网格',
    },
    symbolism: {
      en: 'Represents possibility space — the matrix of scenarios',
      zh: '代表可能性空间——场景矩阵',
    },
  },

  // EXISTENCE TIER (9-12)
  {
    id: 'layer-9',
    layer: 9,
    name: { en: 'Timeline Simulation', zh: '时间线模拟' },
    category: 'layer',
    glyph: '⌓',
    geometry: [
      { primitive: 'arc', position: 'center', count: 3, arrangement: 'three concentric arcs' },
    ],
    description: {
      en: 'Three concentric arcs',
      zh: '三个同心弧',
    },
    symbolism: {
      en: 'Represents branching futures — the divergence of timelines',
      zh: '代表分支未来——时间线的发散',
    },
  },
  {
    id: 'layer-10',
    layer: 10,
    name: { en: 'Archetype Constellation', zh: '原型星座' },
    category: 'layer',
    glyph: '⊛',
    geometry: [
      { primitive: 'circle', position: 'center', count: 3, arrangement: 'three circles connected by lines forming triangle' },
      { primitive: 'line', position: 'intersecting', count: 3 },
    ],
    description: {
      en: 'Three circles connected by lines',
      zh: '三个由线连接的圆',
    },
    symbolism: {
      en: 'Represents identity triads — the constellation of self',
      zh: '代表身份三元组——自我的星座',
    },
  },
  {
    id: 'layer-11',
    layer: 11,
    name: { en: 'Planetary Rhythm', zh: '行星节律' },
    category: 'layer',
    glyph: '◐',
    geometry: [
      { primitive: 'dot', position: 'center' },
      { primitive: 'circle', position: 'outside', arrangement: 'orbiting the central point' },
    ],
    description: {
      en: 'A circle orbiting a central point',
      zh: '一个围绕中心点运行的圆',
    },
    symbolism: {
      en: 'Represents macro-cycles — the rhythm of planetary influence',
      zh: '代表宏观周期——行星影响的节律',
    },
  },
  {
    id: 'layer-12',
    layer: 12,
    name: { en: 'Autonomous Governance', zh: '自治治理' },
    category: 'layer',
    glyph: '⊞',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'square', position: 'inside' },
      { primitive: 'line', position: 'outside', count: 4, orientation: 'up', arrangement: 'four outward arrows from square corners' },
    ],
    description: {
      en: 'A square inside a circle with four outward arrows',
      zh: '圆内有一个方形，四个向外的箭头',
    },
    symbolism: {
      en: 'Represents self-regulating systems — governance that governs itself',
      zh: '代表自我调节系统——自我治理的治理',
    },
  },

  // CREATION TIER (13-16)
  {
    id: 'layer-13',
    layer: 13,
    name: { en: 'Existence Grid', zh: '存在网格' },
    category: 'layer',
    glyph: '▣',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'grid', position: 'inside', count: 16, arrangement: '4x4 grid inside circle' },
    ],
    description: {
      en: 'A 4×4 grid inside a circle',
      zh: '圆内有4×4网格',
    },
    symbolism: {
      en: 'Represents multi-existence mapping — the field of parallel realities',
      zh: '代表多存在映射——平行现实的场',
    },
  },
  {
    id: 'layer-14',
    layer: 14,
    name: { en: 'Archetype Hypergraph', zh: '原型超图' },
    category: 'layer',
    glyph: '⬢',
    geometry: [
      { primitive: 'dot', position: 'center', count: 7, arrangement: 'cluster of nodes' },
      { primitive: 'line', position: 'intersecting', arrangement: 'irregular connections between nodes' },
    ],
    description: {
      en: 'A cluster of nodes with irregular connections',
      zh: '具有不规则连接的节点集群',
    },
    symbolism: {
      en: 'Represents complex identity networks — the hypergraph of being',
      zh: '代表复杂身份网络——存在的超图',
    },
  },
  {
    id: 'layer-15',
    layer: 15,
    name: { en: 'Reality Architecture', zh: '现实架构' },
    category: 'layer',
    glyph: '⬜',
    geometry: [
      { primitive: 'cube', position: 'center', arrangement: 'cube in perspective' },
    ],
    description: {
      en: 'A cube in perspective',
      zh: '透视立方体',
    },
    symbolism: {
      en: 'Represents structural reality — the architecture of existence',
      zh: '代表结构性现实——存在的架构',
    },
  },
  {
    id: 'layer-16',
    layer: 16,
    name: { en: 'Consciousness Substrate', zh: '意识基底' },
    category: 'layer',
    glyph: '◎',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'spiral', position: 'inside', arrangement: 'spiral emanating from center' },
    ],
    description: {
      en: 'A spiral inside a circle',
      zh: '圆内有一个螺旋',
    },
    symbolism: {
      en: 'Represents awareness layers — the substrate of consciousness',
      zh: '代表意识层——意识的基底',
    },
  },

  // PRIMORDIAL TIER (17-20)
  {
    id: 'layer-17',
    layer: 17,
    name: { en: 'Meta-Ontology', zh: '元本体论' },
    category: 'layer',
    glyph: '✡',
    geometry: [
      { primitive: 'triangle', position: 'center', orientation: 'up' },
      { primitive: 'triangle', position: 'intersecting', orientation: 'down' },
    ],
    description: {
      en: 'A triangle pointing upward, intersecting a triangle pointing downward',
      zh: '一个向上的三角形与一个向下的三角形相交',
    },
    symbolism: {
      en: 'Represents the creation of meaning — the hexagram of being',
      zh: '代表意义的创造——存在的六芒星',
    },
  },
  {
    id: 'layer-18',
    layer: 18,
    name: { en: 'Meta-Causality', zh: '元因果' },
    category: 'layer',
    glyph: '☀',
    geometry: [
      { primitive: 'circle', position: 'center' },
      { primitive: 'line', position: 'outside', count: 12, arrangement: 'radiating lines from center' },
    ],
    description: {
      en: 'A circle with radiating lines',
      zh: '一个有放射线的圆',
    },
    symbolism: {
      en: 'Represents causal grammar — the sun of causation',
      zh: '代表因果语法——因果的太阳',
    },
  },
  {
    id: 'layer-19',
    layer: 19,
    name: { en: 'Meta-Potentiality', zh: '元潜在' },
    category: 'layer',
    glyph: '∿',
    geometry: [
      { primitive: 'circle', position: 'outside' },
      { primitive: 'wave', position: 'inside', arrangement: 'wave line inside circle' },
    ],
    description: {
      en: 'A circle with a wave line inside',
      zh: '圆内有一条波浪线',
    },
    symbolism: {
      en: 'Represents emergence — the wave of potentiality',
      zh: '代表涌现——潜在的波',
    },
  },
  {
    id: 'layer-20',
    layer: 20,
    name: { en: 'Meta-Genesis', zh: '元创世' },
    category: 'layer',
    glyph: '🜂',
    geometry: [
      { primitive: 'flame', position: 'center', arrangement: 'flame-shaped glyph' },
    ],
    description: {
      en: 'A flame-shaped glyph',
      zh: '火焰形字形',
    },
    symbolism: {
      en: 'Represents creation impulse — the flame of genesis',
      zh: '代表创造冲动——创世的火焰',
    },
  },

  // ABSOLUTE TIER (21-23)
  {
    id: 'layer-21',
    layer: 21,
    name: { en: 'Meta-Primordial', zh: '元原始' },
    category: 'layer',
    glyph: '⚯',
    geometry: [
      { primitive: 'knot', position: 'center', arrangement: 'dense knot of interwoven lines' },
    ],
    description: {
      en: 'A dense knot of interwoven lines',
      zh: '密集的交织线结',
    },
    symbolism: {
      en: 'Represents pre-existence — the knot before form',
      zh: '代表存在之前——形式之前的结',
    },
  },
  {
    id: 'layer-22',
    layer: 22,
    name: { en: 'Meta-Absolute', zh: '元绝对' },
    category: 'layer',
    glyph: '○',
    geometry: [
      { primitive: 'circle', position: 'center', arrangement: 'perfect unbroken circle' },
    ],
    description: {
      en: 'A perfect unbroken circle',
      zh: '完美的不间断的圆',
    },
    symbolism: {
      en: 'Represents the unconditioned absolute — perfection without division',
      zh: '代表无条件的绝对——无分割的完美',
    },
  },
  {
    id: 'layer-23',
    layer: 23,
    name: { en: 'Meta-Void', zh: '元虚空' },
    category: 'layer',
    glyph: '◌',
    geometry: [
      { primitive: 'ring', position: 'center', arrangement: 'hollow ring with no center, empty interior' },
    ],
    description: {
      en: 'A hollow ring with no center',
      zh: '没有中心的空心环',
    },
    symbolism: {
      en: 'Represents the absence of arising — the void that contains all',
      zh: '代表不生——包含一切的虚空',
    },
  },
];

// ==================== PILLAR SIGIL DESIGNS ====================

export const PILLAR_SIGIL_DESIGNS: SigilDesign[] = [
  {
    id: 'pilgrim',
    name: { en: 'Pilgrim', zh: '朝圣者' },
    category: 'pillar',
    glyph: '☽',
    geometry: [
      { primitive: 'circle', position: 'center' },
      { primitive: 'triangle', position: 'inside', orientation: 'down' },
    ],
    description: {
      en: 'A circle with a downward-pointing triangle',
      zh: '一个圆，内有向下的三角形',
    },
    symbolism: {
      en: 'Emotional, mythic, experiential — the descent into depth',
      zh: '情感的、神话的、体验的——深入的下降',
    },
  },
  {
    id: 'architect',
    name: { en: 'Architect', zh: '架构师' },
    category: 'pillar',
    glyph: '⌘',
    geometry: [
      { primitive: 'square', position: 'center' },
      { primitive: 'line', position: 'inside', orientation: 'vertical' },
    ],
    description: {
      en: 'A square with a vertical line',
      zh: '一个方形，内有垂直线',
    },
    symbolism: {
      en: 'Technical, structural, computational — the precision of form',
      zh: '技术的、结构的、计算的——形式的精确',
    },
  },
  {
    id: 'sovereign',
    name: { en: 'Sovereign', zh: '主权者' },
    category: 'pillar',
    glyph: '♔',
    geometry: [
      { primitive: 'crown', position: 'center', arrangement: 'three-pointed crown shape' },
    ],
    description: {
      en: 'A crown-like three-pointed shape',
      zh: '皇冠般的三尖形状',
    },
    symbolism: {
      en: 'Strategic, organizational, leadership — the authority of rule',
      zh: '战略的、组织的、领导的——统治的权威',
    },
  },
];

// ==================== QUADRANT SIGIL DESIGNS ====================

export const QUADRANT_SIGIL_DESIGNS: SigilDesign[] = [
  {
    id: 'ontology',
    name: { en: 'Ontology', zh: '本体论' },
    category: 'quadrant',
    glyph: '📖',
    geometry: [
      { primitive: 'line', position: 'center', count: 2, arrangement: 'book-like open shape, two angled lines meeting at base' },
    ],
    description: {
      en: 'A book-like open shape',
      zh: '书本般的打开形状',
    },
    symbolism: {
      en: 'Meaning, identity, archetypes — the book of being',
      zh: '意义、身份、原型——存在之书',
    },
  },
  {
    id: 'causality',
    name: { en: 'Causality', zh: '因果' },
    category: 'quadrant',
    glyph: '⑂',
    geometry: [
      { primitive: 'line', position: 'center', arrangement: 'branching arrow, single line splitting into two' },
    ],
    description: {
      en: 'A branching arrow',
      zh: '分叉的箭头',
    },
    symbolism: {
      en: 'Cause, effect, structure — the fork of consequence',
      zh: '因、果、结构——后果的分叉',
    },
  },
  {
    id: 'potentiality',
    name: { en: 'Potentiality', zh: '潜在性' },
    category: 'quadrant',
    glyph: '∿',
    geometry: [
      { primitive: 'wave', position: 'center', arrangement: 'horizontal wave line' },
    ],
    description: {
      en: 'A wave',
      zh: '波浪',
    },
    symbolism: {
      en: 'Possibility, emergence, probability — the wave of becoming',
      zh: '可能性、涌现、概率——成为的波',
    },
  },
  {
    id: 'narrative',
    name: { en: 'Narrative', zh: '叙事' },
    category: 'quadrant',
    glyph: '∞',
    geometry: [
      { primitive: 'spiral', position: 'center', arrangement: 'single spiral' },
    ],
    description: {
      en: 'A spiral',
      zh: '螺旋',
    },
    symbolism: {
      en: 'Story, mythos, interpretation — the unfolding of tale',
      zh: '故事、神话、解读——故事的展开',
    },
  },
];

// ==================== SIGIL STYLE GUIDE ====================

export const SIGIL_STYLE_GUIDE: SigilStyleGuide = {
  lineWeight: 'Thin, precise, architectural — 1-2px at standard sizes',
  geometricPrimitives: [
    'circle',
    'triangle',
    'square',
    'spiral',
    'grid',
    'line',
    'dot',
    'hexagon',
    'arc',
    'wave',
    'cube',
    'flame',
    'knot',
    'ring',
    'crown',
  ],
  aesthetic: [
    'Sacred geometry',
    'Technical blueprint',
    'Minimalist mysticism',
    'Architectural precision',
    'Mythic gravity',
  ],
  motionBehaviors: [
    'Slow pulse — breathing rhythm',
    'Orbit — rotational gravity',
    'Ascension — upward drift',
    'Dissolve — fade transitions',
  ],
};

// ==================== SIGIL RENDERING SPECS ====================

export const SIGIL_RENDERING_SPECS = {
  sizes: {
    xs: { dimension: 16, strokeWidth: 1 },
    sm: { dimension: 24, strokeWidth: 1 },
    md: { dimension: 32, strokeWidth: 1.5 },
    lg: { dimension: 48, strokeWidth: 2 },
    xl: { dimension: 64, strokeWidth: 2 },
    xxl: { dimension: 128, strokeWidth: 3 },
  },
  colors: {
    default: 'var(--color-absolute-white)',
    hover: 'var(--color-primordial-gold)',
    active: 'var(--color-genesis-blue)',
    locked: 'var(--color-causality-silver)',
    void: 'var(--color-void-black)',
  },
  animation: {
    pulse: {
      duration: 6000,
      intensity: 0.15,
      easing: 'ease-in-out',
    },
    glow: {
      duration: 4000,
      spread: 8,
      opacity: 0.3,
    },
  },
};

// ==================== HELPER FUNCTIONS ====================

export function getSigilDesignByLayer(layer: number): SigilDesign | undefined {
  return LAYER_SIGIL_DESIGNS.find(s => s.layer === layer);
}

export function getSigilDesignById(id: string): SigilDesign | undefined {
  const all = [MASTER_SIGIL_DESIGN, ...LAYER_SIGIL_DESIGNS, ...PILLAR_SIGIL_DESIGNS, ...QUADRANT_SIGIL_DESIGNS];
  return all.find(s => s.id === id);
}

export function getAllSigilDesigns(): SigilDesign[] {
  return [MASTER_SIGIL_DESIGN, ...LAYER_SIGIL_DESIGNS, ...PILLAR_SIGIL_DESIGNS, ...QUADRANT_SIGIL_DESIGNS];
}

export function getSigilsByTier(tier: 'foundation' | 'structure' | 'existence' | 'creation' | 'primordial' | 'absolute'): SigilDesign[] {
  const tierRanges: Record<string, [number, number]> = {
    foundation: [1, 4],
    structure: [5, 8],
    existence: [9, 12],
    creation: [13, 16],
    primordial: [17, 20],
    absolute: [21, 23],
  };
  const [min, max] = tierRanges[tier];
  return LAYER_SIGIL_DESIGNS.filter(s => s.layer && s.layer >= min && s.layer <= max);
}
