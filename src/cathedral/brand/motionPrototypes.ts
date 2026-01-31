/**
 * ============================================
 * THE CATHEDRAL — MOTION PROTOTYPES
 * Complete Motion Language System
 *
 * Motion blueprints described with enough clarity
 * for motion designers or front-end engineers to
 * implement exactly. Motion is one of the Cathedral's
 * defining signatures.
 * ============================================
 */

// ==================== MOTION TYPES ====================

export type MotionPrincipleId = 'ascension' | 'revelation' | 'breath' | 'orbit' | 'threshold';
export type MotionPrototypeId =
  | 'cathedral-breathes'
  | 'glyph-pulse'
  | 'orbital-field'
  | 'ascent'
  | 'threshold-veil'
  | 'triple-stream'
  | 'triad-dance'
  | 'invocation'
  | 'halo'
  | 'ladder-of-light'
  | 'revelation-scroll'
  | 'inner-sanctum';

export type InteractionType = 'hover' | 'click' | 'scroll' | 'drag';

export interface MotionPrinciple {
  id: MotionPrincipleId;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  metaphor: string;
}

export interface MotionPrototype {
  id: MotionPrototypeId;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  steps: MotionStep[];
  timing: MotionTiming;
  purpose: {
    en: string;
    zh: string;
  };
  principles: MotionPrincipleId[];
}

export interface MotionStep {
  order: number;
  action: string;
  target: string;
  property: string;
  from?: string | number;
  to?: string | number;
  duration?: number;
  delay?: number;
  easing?: string;
  loop?: boolean;
  notes?: string;
}

export interface MotionTiming {
  totalDuration: number;
  unit: 'ms' | 's';
  loop?: boolean;
  loopDelay?: number;
}

export interface InteractionMotion {
  type: InteractionType;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  behavior: string;
}

// ==================== MOTION FEEL ====================

export const MOTION_FEEL = {
  qualities: [
    'Slow',
    'Ceremonial',
    'Gravitational',
    'Intentional',
    'Alive',
  ],
  never: [
    'Bouncy',
    'Playful',
    'Abrupt',
    'Jarring',
    'Rushed',
    'Elastic',
  ],
};

// ==================== MOTION PRINCIPLES ====================

export const MOTION_PRINCIPLES_DETAILED: MotionPrinciple[] = [
  {
    id: 'ascension',
    name: { en: 'Ascension', zh: '上升' },
    description: {
      en: 'Upward movement representing rising through layers',
      zh: '向上运动代表穿越层级上升',
    },
    metaphor: 'Rising through the Cathedral toward higher consciousness',
  },
  {
    id: 'revelation',
    name: { en: 'Revelation', zh: '揭示' },
    description: {
      en: 'Elements fade in as if emerging from darkness',
      zh: '元素渐入，仿佛从黑暗中涌现',
    },
    metaphor: 'Truth emerging from the void',
  },
  {
    id: 'breath',
    name: { en: 'Breath', zh: '呼吸' },
    description: {
      en: 'Subtle pulsing to indicate life',
      zh: '微妙的脉动表示生命',
    },
    metaphor: 'The Cathedral as a living organism',
  },
  {
    id: 'orbit',
    name: { en: 'Orbit', zh: '轨道' },
    description: {
      en: 'Nodes circle slowly to show relational gravity',
      zh: '节点缓慢环绕显示关系引力',
    },
    metaphor: 'Metaphysical bodies in gravitational dance',
  },
  {
    id: 'threshold',
    name: { en: 'Threshold', zh: '门槛' },
    description: {
      en: 'Transitions dissolve like passing through a veil',
      zh: '过渡如穿过面纱般消融',
    },
    metaphor: 'Crossing between chambers of consciousness',
  },
];

// ==================== MOTION PROTOTYPES ====================

export const MOTION_PROTOTYPES: MotionPrototype[] = [
  // 1. THE CATHEDRAL BREATHES
  {
    id: 'cathedral-breathes',
    name: { en: 'The Cathedral Breathes', zh: '大教堂呼吸' },
    description: {
      en: 'The entire Cathedral diagram expands and contracts in a slow, meditative rhythm',
      zh: '整个大教堂图以缓慢、冥想的节奏扩展和收缩',
    },
    steps: [
      {
        order: 1,
        action: 'expand',
        target: 'cathedral-diagram',
        property: 'scale',
        from: 1.0,
        to: 1.02,
        duration: 4000,
        easing: 'ease-in-out',
        notes: 'Expand by 1-2%',
      },
      {
        order: 2,
        action: 'contract',
        target: 'cathedral-diagram',
        property: 'scale',
        from: 1.02,
        to: 1.0,
        duration: 4000,
        easing: 'ease-in-out',
        notes: 'Contract back to baseline',
      },
    ],
    timing: {
      totalDuration: 8000,
      unit: 'ms',
      loop: true,
      loopDelay: 0,
    },
    purpose: {
      en: 'To signal that the Cathedral is a living metaphysical organism',
      zh: '表明大教堂是一个活的形而上学有机体',
    },
    principles: ['breath'],
  },

  // 2. THE GLYPH PULSE
  {
    id: 'glyph-pulse',
    name: { en: 'The Glyph Pulse', zh: '字形脉动' },
    description: {
      en: 'Each sigil has a faint outer glow that brightens and fades in a slow rhythm',
      zh: '每个符印有微弱的外发光，以缓慢的节奏变亮和消退',
    },
    steps: [
      {
        order: 1,
        action: 'glow-brighten',
        target: 'sigil-glow',
        property: 'opacity',
        from: 0.1,
        to: 0.25,
        duration: 3000,
        easing: 'ease-in-out',
        notes: 'Brighten glow by 10-15%',
      },
      {
        order: 2,
        action: 'glow-fade',
        target: 'sigil-glow',
        property: 'opacity',
        from: 0.25,
        to: 0.1,
        duration: 3000,
        easing: 'ease-in-out',
        notes: 'Fade back to baseline',
      },
    ],
    timing: {
      totalDuration: 6000,
      unit: 'ms',
      loop: true,
      loopDelay: 0,
    },
    purpose: {
      en: 'To give each layer a heartbeat',
      zh: '给每一层一个心跳',
    },
    principles: ['breath', 'revelation'],
  },

  // 3. THE ORBITAL FIELD
  {
    id: 'orbital-field',
    name: { en: 'The Orbital Field', zh: '轨道场' },
    description: {
      en: 'Hypergraph nodes rotate slowly around center with shimmering connections',
      zh: '超图节点缓慢围绕中心旋转，连接闪烁',
    },
    steps: [
      {
        order: 1,
        action: 'rotate',
        target: 'hypergraph-nodes',
        property: 'rotation',
        from: 0,
        to: 360,
        duration: 360000,
        easing: 'linear',
        loop: true,
        notes: 'Extremely slow rotation: 0.1-0.3 degrees per second',
      },
      {
        order: 2,
        action: 'shimmer',
        target: 'hypergraph-lines',
        property: 'opacity',
        from: 0.3,
        to: 0.6,
        duration: 10000,
        easing: 'ease-in-out',
        loop: true,
        notes: 'Lines shimmer every 8-12 seconds',
      },
      {
        order: 3,
        action: 'hover-expand',
        target: 'node:hovered',
        property: 'scale',
        from: 1.0,
        to: 1.08,
        duration: 300,
        easing: 'ease-out',
        notes: 'Node expands 5-8% and brightens on hover',
      },
    ],
    timing: {
      totalDuration: 360000,
      unit: 'ms',
      loop: true,
    },
    purpose: {
      en: 'To show relational gravity and metaphysical structure',
      zh: '显示关系引力和形而上学结构',
    },
    principles: ['orbit', 'breath'],
  },

  // 4. THE ASCENT
  {
    id: 'ascent',
    name: { en: 'The Ascent', zh: '上升' },
    description: {
      en: 'Layer transition animation when user selects a new layer',
      zh: '用户选择新层时的层过渡动画',
    },
    steps: [
      {
        order: 1,
        action: 'dissolve-out',
        target: 'current-layer-sigil',
        property: 'opacity',
        from: 1,
        to: 0,
        duration: 400,
        easing: 'ease-out',
        notes: 'Current sigil dissolves outward',
      },
      {
        order: 2,
        action: 'brighten',
        target: 'genesis-line',
        property: 'opacity',
        from: 0.3,
        to: 1.0,
        duration: 600,
        delay: 200,
        easing: 'ease-in-out',
        notes: 'Genesis Line brightens',
      },
      {
        order: 3,
        action: 'fade-in',
        target: 'next-layer-sigil',
        property: 'opacity',
        from: 0,
        to: 1,
        duration: 600,
        delay: 600,
        easing: 'ease-in',
        notes: 'Next layer sigil fades in from center',
      },
      {
        order: 4,
        action: 'darken',
        target: 'background',
        property: 'brightness',
        from: 1.0,
        to: 0.9,
        duration: 800,
        easing: 'ease-in-out',
        notes: 'Background darkens slightly to emphasize depth',
      },
    ],
    timing: {
      totalDuration: 1800,
      unit: 'ms',
      loop: false,
    },
    purpose: {
      en: 'To make layer navigation feel like ritual progression',
      zh: '使层导航感觉像仪式进程',
    },
    principles: ['ascension', 'revelation', 'threshold'],
  },

  // 5. THE THRESHOLD VEIL
  {
    id: 'threshold-veil',
    name: { en: 'The Threshold Veil', zh: '门槛面纱' },
    description: {
      en: 'Chamber entry transition with Genesis Line reveal',
      zh: '带有创世线揭示的室入口过渡',
    },
    steps: [
      {
        order: 1,
        action: 'fade-to-black',
        target: 'screen',
        property: 'opacity',
        from: 1,
        to: 0,
        duration: 400,
        easing: 'ease-out',
        notes: 'Screen fades to black',
      },
      {
        order: 2,
        action: 'reveal-line',
        target: 'genesis-line',
        property: 'height',
        from: '0%',
        to: '100%',
        duration: 300,
        delay: 400,
        easing: 'ease-out',
        notes: 'Thin vertical Genesis Line appears',
      },
      {
        order: 3,
        action: 'expand-line',
        target: 'genesis-line',
        property: 'width',
        from: '2px',
        to: '100vw',
        duration: 500,
        delay: 700,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        notes: 'Line expands horizontally to reveal chamber',
      },
      {
        order: 4,
        action: 'fade-in-content',
        target: 'chamber-content',
        property: 'opacity',
        from: 0,
        to: 1,
        duration: 400,
        delay: 1200,
        easing: 'ease-in',
        notes: 'Chamber content fades in',
      },
    ],
    timing: {
      totalDuration: 1600,
      unit: 'ms',
      loop: false,
    },
    purpose: {
      en: 'To create a sense of entering a sacred space',
      zh: '创造进入神圣空间的感觉',
    },
    principles: ['threshold', 'revelation'],
  },

  // 6. THE TRIPLE STREAM
  {
    id: 'triple-stream',
    name: { en: 'The Triple Stream', zh: '三重流' },
    description: {
      en: 'Timeline simulation with three parallel animated streams',
      zh: '带有三条平行动画流的时间线模拟',
    },
    steps: [
      {
        order: 1,
        action: 'flow-primary',
        target: 'timeline-primary',
        property: 'translateY',
        from: '0%',
        to: '100%',
        duration: 10000,
        easing: 'linear',
        loop: true,
        notes: 'Primary timeline flows downward at steady pace',
      },
      {
        order: 2,
        action: 'flow-shadow',
        target: 'timeline-shadow',
        property: 'translateY',
        from: '0%',
        to: '100%',
        duration: 12000,
        easing: 'linear',
        loop: true,
        notes: 'Shadow timeline flows slower, nodes flicker',
      },
      {
        order: 3,
        action: 'flow-breakthrough',
        target: 'timeline-breakthrough',
        property: 'translateY',
        from: '0%',
        to: '100%',
        duration: 8000,
        easing: 'linear',
        loop: true,
        notes: 'Breakthrough timeline flows faster, nodes pulse brightly',
      },
      {
        order: 4,
        action: 'glow-events',
        target: 'event-nodes',
        property: 'box-shadow',
        duration: 2000,
        easing: 'ease-in-out',
        loop: true,
        notes: 'Key events glow as they appear',
      },
    ],
    timing: {
      totalDuration: 12000,
      unit: 'ms',
      loop: true,
    },
    purpose: {
      en: 'To visualize multi-timeline metaphysics',
      zh: '可视化多时间线形而上学',
    },
    principles: ['orbit', 'revelation'],
  },

  // 7. THE TRIAD DANCE
  {
    id: 'triad-dance',
    name: { en: 'The Triad Dance', zh: '三元舞' },
    description: {
      en: 'Archetype constellation with three orbiting identity nodes',
      zh: '带有三个轨道身份节点的原型星座',
    },
    steps: [
      {
        order: 1,
        action: 'orbit-dominant',
        target: 'archetype-dominant',
        property: 'rotation',
        from: 0,
        to: 360,
        duration: 120000,
        easing: 'linear',
        loop: true,
        notes: 'Dominant archetype moves slowest',
      },
      {
        order: 2,
        action: 'orbit-shadow',
        target: 'archetype-shadow',
        property: 'rotation',
        from: 0,
        to: 360,
        duration: 90000,
        easing: 'linear',
        loop: true,
        notes: 'Shadow archetype flickers subtly',
      },
      {
        order: 3,
        action: 'orbit-ascending',
        target: 'archetype-ascending',
        property: 'rotation',
        from: 0,
        to: 360,
        duration: 60000,
        easing: 'linear',
        loop: true,
        notes: 'Ascending archetype glows and moves slightly upward',
      },
      {
        order: 4,
        action: 'flicker-shadow',
        target: 'archetype-shadow',
        property: 'opacity',
        from: 0.6,
        to: 0.9,
        duration: 3000,
        easing: 'ease-in-out',
        loop: true,
        notes: 'Shadow archetype flickers',
      },
    ],
    timing: {
      totalDuration: 120000,
      unit: 'ms',
      loop: true,
    },
    purpose: {
      en: 'To show identity dynamics as a living system',
      zh: '显示身份动态作为一个活的系统',
    },
    principles: ['orbit', 'breath'],
  },

  // 8. THE INVOCATION
  {
    id: 'invocation',
    name: { en: 'The Invocation', zh: '召唤' },
    description: {
      en: 'Ritual modal with ceremonial reveal sequence',
      zh: '带有仪式揭示序列的仪式模态',
    },
    steps: [
      {
        order: 1,
        action: 'fade-in-modal',
        target: 'modal-backdrop',
        property: 'opacity',
        from: 0,
        to: 1,
        duration: 400,
        easing: 'ease-out',
        notes: 'Modal fades in from pure black',
      },
      {
        order: 2,
        action: 'reveal-sigil',
        target: 'modal-sigil',
        property: 'opacity',
        from: 0,
        to: 1,
        duration: 300,
        delay: 200,
        easing: 'ease-in',
        notes: 'Sigil appears first',
      },
      {
        order: 3,
        action: 'reveal-text',
        target: 'modal-text-lines',
        property: 'opacity',
        from: 0,
        to: 1,
        duration: 150,
        delay: 500,
        easing: 'ease-in',
        notes: 'Text appears line-by-line, 150ms per line',
      },
      {
        order: 4,
        action: 'draw-underline',
        target: 'input-underline',
        property: 'width',
        from: '0%',
        to: '100%',
        duration: 400,
        delay: 800,
        easing: 'ease-out',
        notes: 'Input underline draws itself from left to right',
      },
    ],
    timing: {
      totalDuration: 1200,
      unit: 'ms',
      loop: false,
    },
    purpose: {
      en: 'To make every input feel like a ceremonial act',
      zh: '使每次输入感觉像仪式行为',
    },
    principles: ['revelation', 'threshold'],
  },

  // 9. THE HALO
  {
    id: 'halo',
    name: { en: 'The Halo', zh: '光环' },
    description: {
      en: 'Void screen with single expanding ring',
      zh: '带有单个扩展环的虚空屏幕',
    },
    steps: [
      {
        order: 1,
        action: 'fade-in-ring',
        target: 'void-ring',
        property: 'opacity',
        from: 0,
        to: 0.8,
        duration: 3000,
        easing: 'ease-in',
        notes: 'Single ring fades in over 3 seconds',
      },
      {
        order: 2,
        action: 'expand-ring',
        target: 'void-ring',
        property: 'scale',
        from: 1.0,
        to: 1.03,
        duration: 5000,
        easing: 'ease-in-out',
        loop: true,
        notes: 'Ring expands by 2-3% every 5 seconds',
      },
    ],
    timing: {
      totalDuration: 5000,
      unit: 'ms',
      loop: true,
    },
    purpose: {
      en: 'To evoke the unconditioned void',
      zh: '唤起无条件的虚空',
    },
    principles: ['breath', 'threshold'],
  },

  // 10. THE LADDER OF LIGHT
  {
    id: 'ladder-of-light',
    name: { en: 'The Ladder of Light', zh: '光之阶梯' },
    description: {
      en: 'Pricing cards with ascending glow and light beam selection',
      zh: '带有上升发光和光束选择的定价卡',
    },
    steps: [
      {
        order: 1,
        action: 'gradient-glow',
        target: 'tier-cards',
        property: 'box-shadow',
        notes: 'Each tier card glows slightly more than the one below',
      },
      {
        order: 2,
        action: 'hover-beam',
        target: 'tier-card:hovered',
        property: 'background',
        duration: 300,
        easing: 'ease-out',
        notes: 'Hovering causes vertical beam of light to rise behind card',
      },
      {
        order: 3,
        action: 'select-slide',
        target: 'tier-card:selected',
        property: 'translateY',
        from: 0,
        to: -8,
        duration: 400,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        notes: 'Selected tier slides softly upward',
      },
    ],
    timing: {
      totalDuration: 400,
      unit: 'ms',
      loop: false,
    },
    purpose: {
      en: 'To make pricing feel like metaphysical ascent',
      zh: '使定价感觉像形而上学上升',
    },
    principles: ['ascension', 'revelation'],
  },

  // 11. THE REVELATION SCROLL
  {
    id: 'revelation-scroll',
    name: { en: 'The Revelation Scroll', zh: '启示卷轴' },
    description: {
      en: 'Manifesto scroll with Genesis Line glow and paragraph reveals',
      zh: '带有创世线发光和段落揭示的宣言卷轴',
    },
    steps: [
      {
        order: 1,
        action: 'scroll-text',
        target: 'manifesto-text',
        property: 'translateY',
        notes: 'Text scrolls vertically with scroll input',
      },
      {
        order: 2,
        action: 'glow-genesis',
        target: 'genesis-line-background',
        property: 'opacity',
        from: 0.2,
        to: 0.4,
        duration: 4000,
        easing: 'ease-in-out',
        loop: true,
        notes: 'Genesis Line behind text glows slowly',
      },
      {
        order: 3,
        action: 'reveal-paragraph',
        target: 'paragraph:in-view',
        property: 'opacity',
        from: 0,
        to: 1,
        duration: 600,
        easing: 'ease-in',
        notes: 'Every paragraph fades in with soft pulse as it enters view',
      },
    ],
    timing: {
      totalDuration: 4000,
      unit: 'ms',
      loop: true,
    },
    purpose: {
      en: 'To make the manifesto feel like scripture',
      zh: '使宣言感觉像经文',
    },
    principles: ['revelation', 'breath'],
  },

  // 12. THE INNER SANCTUM
  {
    id: 'inner-sanctum',
    name: { en: 'The Inner Sanctum', zh: '内殿' },
    description: {
      en: 'Dashboard with living, breathing components',
      zh: '带有活的、呼吸的组件的仪表板',
    },
    steps: [
      {
        order: 1,
        action: 'pulse-hypergraph',
        target: 'dashboard-hypergraph',
        property: 'scale',
        from: 1.0,
        to: 1.01,
        duration: 6000,
        easing: 'ease-in-out',
        loop: true,
        notes: 'Hypergraph pulses slowly',
      },
      {
        order: 2,
        action: 'animate-timeline',
        target: 'timeline-panel-events',
        property: 'opacity',
        duration: 800,
        easing: 'ease-in',
        notes: 'Timeline panel animates events in sequence',
      },
      {
        order: 3,
        action: 'orbit-constellation',
        target: 'archetype-constellation',
        property: 'rotation',
        from: 0,
        to: 360,
        duration: 180000,
        easing: 'linear',
        loop: true,
        notes: 'Archetype constellation orbits gently',
      },
      {
        order: 4,
        action: 'glow-navigation',
        target: 'layer-nav:hovered',
        property: 'box-shadow',
        duration: 200,
        easing: 'ease-out',
        notes: 'Layer navigation glows when hovered',
      },
    ],
    timing: {
      totalDuration: 180000,
      unit: 'ms',
      loop: true,
    },
    purpose: {
      en: 'To make the dashboard feel alive and intelligent',
      zh: '使仪表板感觉活着和智能',
    },
    principles: ['breath', 'orbit', 'revelation'],
  },
];

// ==================== INTERACTION MOTION RULES ====================

export const INTERACTION_MOTIONS: InteractionMotion[] = [
  {
    type: 'hover',
    name: { en: 'Revelation', zh: '揭示' },
    description: {
      en: 'Hover reveals hidden information',
      zh: '悬停揭示隐藏信息',
    },
    behavior: 'Fade in additional context, expand element slightly, glow effect',
  },
  {
    type: 'click',
    name: { en: 'Descent or Ascent', zh: '下降或上升' },
    description: {
      en: 'Click enters a chamber or rises to higher layer',
      zh: '点击进入一个室或上升到更高层',
    },
    behavior: 'Threshold transition for chambers, ascent animation for layers',
  },
  {
    type: 'scroll',
    name: { en: 'Journey', zh: '旅程' },
    description: {
      en: 'Scroll moves through thresholds',
      zh: '滚动穿过门槛',
    },
    behavior: 'Parallax depth, reveal on scroll, Genesis Line tracking',
  },
  {
    type: 'drag',
    name: { en: 'Manipulation', zh: '操控' },
    description: {
      en: 'Drag rearranges hypergraphs',
      zh: '拖动重新排列超图',
    },
    behavior: 'Smooth repositioning with magnetic snapping, connection lines follow',
  },
];

// ==================== TIMING CONSTANTS ====================

export const TIMING_CONSTANTS = {
  microInteraction: { min: 150, max: 300 },
  pageTransition: { min: 400, max: 800 },
  ambientLoop: { min: 3000, max: 60000 },
  breathCycle: { min: 4000, max: 8000 },
  orbitCycle: { min: 60000, max: 360000 },
};

// ==================== EASING PRESETS ====================

export const EASING_PRESETS = {
  standard: 'ease-in-out',
  enter: 'ease-out',
  exit: 'ease-in',
  linear: 'linear',
  ritual: 'cubic-bezier(0.16, 1, 0.3, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  // Note: bounce should be used sparingly, only for selection feedback
};

// ==================== HELPER FUNCTIONS ====================

export function getMotionPrototypeById(id: MotionPrototypeId): MotionPrototype | undefined {
  return MOTION_PROTOTYPES.find(p => p.id === id);
}

export function getMotionsByPrinciple(principle: MotionPrincipleId): MotionPrototype[] {
  return MOTION_PROTOTYPES.filter(p => p.principles.includes(principle));
}

export function getInteractionMotion(type: InteractionType): InteractionMotion | undefined {
  return INTERACTION_MOTIONS.find(m => m.type === type);
}

export function calculateTotalDuration(prototype: MotionPrototype): number {
  const maxStepEnd = Math.max(...prototype.steps.map(s => (s.delay || 0) + (s.duration || 0)));
  return Math.max(maxStepEnd, prototype.timing.totalDuration);
}
