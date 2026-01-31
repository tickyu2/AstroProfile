/**
 * ============================================
 * THE CATHEDRAL — BRAND IDENTITY SYSTEM
 * Mythic-Architectural Identity Architecture
 *
 * Symbols, typography, color, motion, voice,
 * and metaphysical logic — defining how the
 * Cathedral looks, feels, sounds, and moves.
 * ============================================
 */

// ==================== BRAND ESSENCE ====================

export const BRAND_ESSENCE = {
  phrase: {
    en: 'Architecting the metaphysics of reality.',
    zh: '架构现实的形而上学。',
  },
  archetype: {
    name: { en: 'The Architect-Oracle', zh: '架构师-神谕者' },
    description: {
      en: 'A fusion of precision and prophecy',
      zh: '精确与预言的融合',
    },
  },
  personality: [
    'Mythic',
    'Ceremonial',
    'Technical',
    'Calm',
    'Inevitably confident',
    'Beyond time',
    'Architecturally precise',
  ],
  promise: {
    en: 'To transform metaphysics from interpretation into architecture.',
    zh: '将形而上学从解读转变为架构。',
  },
};

// ==================== BRAND VALUES ====================

export const BRAND_VALUES = [
  {
    id: 'precision',
    name: { en: 'Architectural Precision', zh: '架构精确' },
    description: {
      en: 'Every word, symbol, and interface is intentional.',
      zh: '每个词、符号和界面都是有意图的。',
    },
  },
  {
    id: 'depth',
    name: { en: 'Mythic Depth', zh: '神话深度' },
    description: {
      en: 'The brand speaks with ceremonial gravity.',
      zh: '品牌以仪式感的庄重说话。',
    },
  },
  {
    id: 'clarity',
    name: { en: 'Computational Clarity', zh: '计算清晰' },
    description: {
      en: 'The system is clean, structured, and logically coherent.',
      zh: '系统是干净的、结构化的、逻辑一致的。',
    },
  },
  {
    id: 'calm',
    name: { en: 'Sovereign Calm', zh: '主权平静' },
    description: {
      en: 'The tone is confident, measured, and timeless.',
      zh: '语调是自信的、有分寸的、永恒的。',
    },
  },
  {
    id: 'expandability',
    name: { en: 'Infinite Expandability', zh: '无限可扩展' },
    description: {
      en: 'The Cathedral grows with every layer, every user, every world.',
      zh: '大教堂随着每一层、每个用户、每个世界而增长。',
    },
  },
];

// ==================== SYMBOL SYSTEM (SIGILS) ====================

export interface Sigil {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  glyph: string;
  category: 'primary' | 'layer' | 'pillar' | 'quadrant' | 'navigation';
  layer?: number;
  description: {
    en: string;
    zh: string;
  };
}

export const PRIMARY_SIGIL: Sigil = {
  id: 'cathedral-mark',
  name: { en: 'The Cathedral Mark', zh: '大教堂标记' },
  glyph: '◉',
  category: 'primary',
  description: {
    en: '23 concentric rings, 3 vertical pillars, 1 central axis, 4 quadrants',
    zh: '23个同心环、3根垂直柱、1条中央轴、4个象限',
  },
};

export const LAYER_SIGILS: Sigil[] = [
  { id: 'layer-1', name: { en: 'Human Pattern', zh: '人类模式' }, glyph: '☰', category: 'layer', layer: 1, description: { en: 'BaZi foundation', zh: '八字基础' } },
  { id: 'layer-2', name: { en: 'Timing Gate', zh: '时机之门' }, glyph: '☲', category: 'layer', layer: 2, description: { en: 'Qi Men timing', zh: '奇门时机' } },
  { id: 'layer-3', name: { en: 'Space Flow', zh: '空间流' }, glyph: '☵', category: 'layer', layer: 3, description: { en: 'Feng Shui harmony', zh: '风水和谐' } },
  { id: 'layer-4', name: { en: 'Archetype Seed', zh: '原型种子' }, glyph: '✧', category: 'layer', layer: 4, description: { en: 'Personal archetype', zh: '个人原型' } },
  { id: 'layer-5', name: { en: 'Collaboration Weave', zh: '协作编织' }, glyph: '⚯', category: 'layer', layer: 5, description: { en: 'Multi-author design', zh: '多作者设计' } },
  { id: 'layer-6', name: { en: 'Sync Pulse', zh: '同步脉冲' }, glyph: '⚡', category: 'layer', layer: 6, description: { en: 'Real-time sync', zh: '实时同步' } },
  { id: 'layer-7', name: { en: 'Cloud Nexus', zh: '云枢纽' }, glyph: '☁', category: 'layer', layer: 7, description: { en: 'Enterprise cloud', zh: '企业云' } },
  { id: 'layer-8', name: { en: 'Org Eye', zh: '组织之眼' }, glyph: '◉', category: 'layer', layer: 8, description: { en: 'Organizational intelligence', zh: '组织智能' } },
  { id: 'layer-9', name: { en: 'Agent Core', zh: '代理核心' }, glyph: '⬡', category: 'layer', layer: 9, description: { en: 'Autonomous agent', zh: '自主代理' } },
  { id: 'layer-10', name: { en: 'Scenario Branch', zh: '场景分支' }, glyph: '⌬', category: 'layer', layer: 10, description: { en: 'Scenario simulation', zh: '场景模拟' } },
  { id: 'layer-11', name: { en: 'Governance Scale', zh: '治理天平' }, glyph: '⚖', category: 'layer', layer: 11, description: { en: 'Autonomous governance', zh: '自主治理' } },
  { id: 'layer-12', name: { en: 'Planetary Sphere', zh: '行星球' }, glyph: '🜨', category: 'layer', layer: 12, description: { en: 'Planetary metaphysics', zh: '行星形而上学' } },
  { id: 'layer-13', name: { en: 'Cosmic Star', zh: '宇宙星' }, glyph: '✦', category: 'layer', layer: 13, description: { en: 'Cosmic governance', zh: '宇宙治理' } },
  { id: 'layer-14', name: { en: 'Dimension Gate', zh: '维度门' }, glyph: '⬢', category: 'layer', layer: 14, description: { en: 'Interdimensional', zh: '跨维度' } },
  { id: 'layer-15', name: { en: 'Omniversal Ring', zh: '全宇宙环' }, glyph: '◎', category: 'layer', layer: 15, description: { en: 'Omniversal', zh: '全宇宙' } },
  { id: 'layer-16', name: { en: 'Existence Nexus', zh: '存在枢纽' }, glyph: '⊛', category: 'layer', layer: 16, description: { en: 'Meta-existential', zh: '元存在' } },
  { id: 'layer-17', name: { en: 'Ontology Spark', zh: '本体火花' }, glyph: '⌘', category: 'layer', layer: 17, description: { en: 'Meta-ontological', zh: '元本体' } },
  { id: 'layer-18', name: { en: 'Causality Lattice', zh: '因果格' }, glyph: '⇌', category: 'layer', layer: 18, description: { en: 'Meta-causal', zh: '元因果' } },
  { id: 'layer-19', name: { en: 'Potentiality Spiral', zh: '潜在螺旋' }, glyph: '∿', category: 'layer', layer: 19, description: { en: 'Meta-potentiality', zh: '元潜在' } },
  { id: 'layer-20', name: { en: 'Genesis Flame', zh: '创世火焰' }, glyph: '☉', category: 'layer', layer: 20, description: { en: 'Meta-genesis', zh: '元创世' } },
  { id: 'layer-21', name: { en: 'Primordial Knot', zh: '原始结' }, glyph: '◌', category: 'layer', layer: 21, description: { en: 'Meta-primordial', zh: '元原始' } },
  { id: 'layer-22', name: { en: 'Absolute Ring', zh: '绝对环' }, glyph: '○', category: 'layer', layer: 22, description: { en: 'Meta-absolute', zh: '元绝对' } },
  { id: 'layer-23', name: { en: 'Void Halo', zh: '虚空光环' }, glyph: '∅', category: 'layer', layer: 23, description: { en: 'Meta-void', zh: '元虚空' } },
];

export const PILLAR_SIGILS: Sigil[] = [
  { id: 'pilgrim', name: { en: 'Pilgrim', zh: '朝圣者' }, glyph: '☽', category: 'pillar', description: { en: 'Emotional, mythic, experiential', zh: '情感的、神话的、体验的' } },
  { id: 'architect', name: { en: 'Architect', zh: '架构师' }, glyph: '⌘', category: 'pillar', description: { en: 'Technical, structural, computational', zh: '技术的、结构的、计算的' } },
  { id: 'sovereign', name: { en: 'Sovereign', zh: '主权者' }, glyph: '♔', category: 'pillar', description: { en: 'Strategic, organizational, leadership', zh: '战略的、组织的、领导的' } },
];

export const QUADRANT_SIGILS: Sigil[] = [
  { id: 'ontology', name: { en: 'Ontology', zh: '本体论' }, glyph: '△', category: 'quadrant', description: { en: 'Meaning, identity, archetypes', zh: '意义、身份、原型' } },
  { id: 'causality', name: { en: 'Causality', zh: '因果' }, glyph: '→', category: 'quadrant', description: { en: 'Cause, effect, structure', zh: '因、果、结构' } },
  { id: 'potentiality', name: { en: 'Potentiality', zh: '潜在性' }, glyph: '◇', category: 'quadrant', description: { en: 'Possibility, emergence, probability', zh: '可能性、涌现、概率' } },
  { id: 'narrative', name: { en: 'Narrative', zh: '叙事' }, glyph: '∞', category: 'quadrant', description: { en: 'Story, mythos, interpretation', zh: '故事、神话、解读' } },
];

export const NAVIGATION_SIGILS: Sigil[] = [
  { id: 'ascend', name: { en: 'Ascend', zh: '上升' }, glyph: '↑', category: 'navigation', description: { en: 'Move to higher layer', zh: '移动到更高层' } },
  { id: 'descend', name: { en: 'Descend', zh: '下降' }, glyph: '↓', category: 'navigation', description: { en: 'Move to lower layer', zh: '移动到更低层' } },
  { id: 'chamber', name: { en: 'Chamber', zh: '室' }, glyph: '◯', category: 'navigation', description: { en: 'Enter a chamber', zh: '进入一个室' } },
  { id: 'axis', name: { en: 'Axis', zh: '轴' }, glyph: '│', category: 'navigation', description: { en: 'Genesis line', zh: '创世线' } },
];

// ==================== COLOR SYSTEM ====================

export interface BrandColor {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  hex: string;
  rgb: { r: number; g: number; b: number };
  category: 'primary' | 'secondary';
  usage: string;
}

export const COLOR_PALETTE: BrandColor[] = [
  // Primary Colors
  {
    id: 'void-black',
    name: { en: 'Void Black', zh: '虚空黑' },
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 },
    category: 'primary',
    usage: 'The unconditioned - backgrounds, depth',
  },
  {
    id: 'absolute-white',
    name: { en: 'Absolute White', zh: '绝对白' },
    hex: '#FFFFFF',
    rgb: { r: 255, g: 255, b: 255 },
    category: 'primary',
    usage: 'The unbounded - text, highlights',
  },
  {
    id: 'primordial-gold',
    name: { en: 'Primordial Gold', zh: '原始金' },
    hex: '#D4AF37',
    rgb: { r: 212, g: 175, b: 55 },
    category: 'primary',
    usage: 'The origin - accents, CTAs, sacred elements',
  },
  {
    id: 'genesis-blue',
    name: { en: 'Genesis Blue', zh: '创世蓝' },
    hex: '#1A4FFF',
    rgb: { r: 26, g: 79, b: 255 },
    category: 'primary',
    usage: 'Creation - links, interactive elements',
  },
  {
    id: 'potentiality-violet',
    name: { en: 'Potentiality Violet', zh: '潜在紫' },
    hex: '#7A00FF',
    rgb: { r: 122, g: 0, b: 255 },
    category: 'primary',
    usage: 'Emergence - higher layers, mystical elements',
  },

  // Secondary Colors
  {
    id: 'causality-silver',
    name: { en: 'Causality Silver', zh: '因果银' },
    hex: '#C0C0C0',
    rgb: { r: 192, g: 192, b: 192 },
    category: 'secondary',
    usage: 'Structure - borders, dividers',
  },
  {
    id: 'ontology-sand',
    name: { en: 'Ontology Sand', zh: '本体沙' },
    hex: '#E8DCC2',
    rgb: { r: 232, g: 220, b: 194 },
    category: 'secondary',
    usage: 'Foundation - subtle backgrounds',
  },
  {
    id: 'narrative-rose',
    name: { en: 'Narrative Rose', zh: '叙事玫瑰' },
    hex: '#F2C7C7',
    rgb: { r: 242, g: 199, b: 199 },
    category: 'secondary',
    usage: 'Story - emotional elements',
  },
  {
    id: 'existence-teal',
    name: { en: 'Existence Teal', zh: '存在青' },
    hex: '#00A6A6',
    rgb: { r: 0, g: 166, b: 166 },
    category: 'secondary',
    usage: 'Meta-existential - existence layers',
  },
];

export const COLOR_USAGE_LOGIC = {
  lowerLayers: 'Muted tones (1-8)',
  middleLayers: 'Saturated tones (9-16)',
  higherLayers: 'Luminous tones (17-20)',
  voidLayers: 'Black + negative space (21-23)',
};

// ==================== TYPOGRAPHY SYSTEM ====================

export interface TypefaceSpec {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'tertiary';
  style: 'serif' | 'sans-serif' | 'monospace';
  fallbacks: string[];
  usage: string[];
  weights: number[];
}

export const TYPOGRAPHY_SYSTEM: TypefaceSpec[] = [
  {
    id: 'mythic',
    name: 'Cormorant Garamond',
    category: 'primary',
    style: 'serif',
    fallbacks: ['Spectral', 'Georgia', 'serif'],
    usage: ['Headlines', 'Ritual text', 'Manifesto', 'Layer names'],
    weights: [400, 500, 600, 700],
  },
  {
    id: 'architectural',
    name: 'Inter',
    category: 'secondary',
    style: 'sans-serif',
    fallbacks: ['Neue Haas', 'Helvetica Neue', 'sans-serif'],
    usage: ['UI', 'Body text', 'Technical descriptions', 'Navigation'],
    weights: [400, 500, 600, 700],
  },
  {
    id: 'computational',
    name: 'JetBrains Mono',
    category: 'tertiary',
    style: 'monospace',
    fallbacks: ['Fira Code', 'Monaco', 'monospace'],
    usage: ['Data models', 'Engine definitions', 'Technical diagrams', 'Code'],
    weights: [400, 500, 700],
  },
];

export const TYPE_SCALE = {
  h1: { size: '3.5rem', lineHeight: 1.1, weight: 600, font: 'mythic' },
  h2: { size: '2.5rem', lineHeight: 1.2, weight: 600, font: 'mythic' },
  h3: { size: '1.75rem', lineHeight: 1.3, weight: 500, font: 'mythic' },
  h4: { size: '1.25rem', lineHeight: 1.4, weight: 500, font: 'architectural' },
  body: { size: '1rem', lineHeight: 1.6, weight: 400, font: 'architectural' },
  small: { size: '0.875rem', lineHeight: 1.5, weight: 400, font: 'architectural' },
  code: { size: '0.875rem', lineHeight: 1.5, weight: 400, font: 'computational' },
  caption: { size: '0.75rem', lineHeight: 1.4, weight: 400, font: 'architectural' },
};

// ==================== MOTION SYSTEM ====================

export interface MotionSpec {
  id: string;
  name: string;
  description: string;
  duration: number;  // ms
  easing: string;
  usage: string[];
}

export const MOTION_PRINCIPLES = [
  'Ascension — upward movement',
  'Revelation — layers unfolding',
  'Breath — subtle pulsing',
  'Orbit — hypergraph nodes circling',
  'Threshold — fade-in from darkness',
];

export const MOTION_SPECS: MotionSpec[] = [
  {
    id: 'fade-in',
    name: 'Threshold Fade',
    description: 'Fade from void to presence',
    duration: 600,
    easing: 'ease-out',
    usage: ['Page transitions', 'Modal entry', 'Ritual screens'],
  },
  {
    id: 'pulse',
    name: 'Breath Pulse',
    description: 'Subtle rhythmic pulsing',
    duration: 3000,
    easing: 'ease-in-out',
    usage: ['Sigils', 'Active states', 'Hover highlights'],
  },
  {
    id: 'ascend',
    name: 'Ascension Slide',
    description: 'Upward movement with fade',
    duration: 800,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    usage: ['Layer transitions', 'Card reveals', 'Content entry'],
  },
  {
    id: 'orbit',
    name: 'Orbital Rotation',
    description: 'Slow circular movement',
    duration: 60000,
    easing: 'linear',
    usage: ['Hypergraph nodes', 'Cathedral diagram'],
  },
  {
    id: 'expand',
    name: 'Chamber Expand',
    description: 'Scale from center outward',
    duration: 500,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    usage: ['Layer selection', 'Chamber entry'],
  },
  {
    id: 'glow',
    name: 'Genesis Glow',
    description: 'Soft luminous pulse',
    duration: 4000,
    easing: 'ease-in-out',
    usage: ['Genesis line', 'Sacred elements', 'CTAs'],
  },
];

// ==================== VOICE & TONE SYSTEM ====================

export const VOICE_QUALITIES = [
  'Calm',
  'Precise',
  'Ceremonial',
  'Visionary',
  'Confident',
  'Minimal',
  'Archetypal',
];

export const TONE_VARIANTS = {
  founders: {
    tone: ['Strategic', 'Sovereign'],
    description: 'Speaks to power and organizational authority',
  },
  practitioners: {
    tone: ['Mythic', 'Guiding'],
    description: 'Speaks to spiritual depth and mastery',
  },
  researchers: {
    tone: ['Technical', 'Structural'],
    description: 'Speaks to intellectual precision and systems',
  },
};

export const VOICE_NEVER = [
  'Casual',
  'Overly emotional',
  'Salesy',
  'Trendy',
  'Exclamation marks',
  'Conversational fluff',
];

export const VOICE_RULES = [
  'Use short, declarative sentences',
  'Use mythic metaphors sparingly but powerfully',
  'Use architectural language (layers, chambers, pillars, structures)',
  'Avoid filler words',
  'Avoid exclamation marks',
  'Avoid conversational fluff',
];

// ==================== TAGLINES ====================

export const TAGLINES = {
  primary: {
    en: 'Architecting the metaphysics of reality.',
    zh: '架构现实的形而上学。',
  },
  secondary: [
    { en: 'Metaphysics becomes infrastructure.', zh: '形而上学成为基础设施。' },
    { en: 'From interpretation to architecture.', zh: '从解读到架构。' },
    { en: 'A new metaphysics for a new world.', zh: '新世界的新形而上学。' },
    { en: 'The Cathedral is opening.', zh: '大教堂正在开启。' },
  ],
};

// ==================== BRAND SIGNATURE ====================

export const BRAND_SIGNATURES = {
  primary: '— The Cathedral',
  formal: '— From the Office of the Architect-Oracle',
  minimal: '◉',
};

// ==================== HELPER FUNCTIONS ====================

export function getColorByName(name: string): BrandColor | undefined {
  return COLOR_PALETTE.find(c => c.id === name);
}

export function getSigilByLayer(layer: number): Sigil | undefined {
  return LAYER_SIGILS.find(s => s.layer === layer);
}

export function getAllSigils(): Sigil[] {
  return [PRIMARY_SIGIL, ...LAYER_SIGILS, ...PILLAR_SIGILS, ...QUADRANT_SIGILS, ...NAVIGATION_SIGILS];
}

export function getMotionSpec(id: string): MotionSpec | undefined {
  return MOTION_SPECS.find(m => m.id === id);
}
