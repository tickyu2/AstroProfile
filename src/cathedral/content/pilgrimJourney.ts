/**
 * ============================================
 * PILGRIM JOURNEY ONBOARDING FLOW
 * The Initiation Ritual
 *
 * An 8-stage mythic onboarding sequence that
 * transforms a visitor into an initiate of
 * the Cathedral. Not a tutorial — a ritual.
 * ============================================
 */

// ==================== STAGE DEFINITIONS ====================

export type JourneyStageId =
  | 'awakening'
  | 'alignment'
  | 'architecture'
  | 'governance'
  | 'creation'
  | 'primordial'
  | 'absolute'
  | 'void';

export type UserPath = 'founder' | 'practitioner' | 'visionary';

export interface JourneyStage {
  id: JourneyStageId;
  order: number;
  title: {
    en: string;
    zh: string;
  };
  copy: {
    en: string;
    zh: string;
  };
  action: StageAction;
  output?: StageOutput;
  purpose: string;
  layersUnlocked: number[];
  emotionalArc: string;
}

export interface StageAction {
  type: 'choice' | 'input' | 'selection' | 'reflection' | 'intention' | 'cta';
  options?: StageOption[];
  inputs?: StageInput[];
  question?: {
    en: string;
    zh: string;
  };
}

export interface StageOption {
  id: string;
  label: {
    en: string;
    zh: string;
  };
  description?: {
    en: string;
    zh: string;
  };
}

export interface StageInput {
  id: string;
  type: 'text' | 'date' | 'select' | 'textarea';
  label: {
    en: string;
    zh: string;
  };
  required: boolean;
  options?: StageOption[];
}

export interface StageOutput {
  type: 'constellation' | 'map' | 'timeline' | 'spark' | 'dashboard';
  description: {
    en: string;
    zh: string;
  };
}

// ==================== THE 8 STAGES ====================

export const JOURNEY_STAGES: JourneyStage[] = [
  // ==================== STAGE 1: AWAKENING ====================
  {
    id: 'awakening',
    order: 1,
    title: {
      en: 'You are entering the Cathedral.',
      zh: '您正在进入大教堂。',
    },
    copy: {
      en: `A new metaphysics is emerging.
One that does not interpret reality — but architects it.`,
      zh: `一种新的形而上学正在涌现。
一种不解读现实——而是架构它的形而上学。`,
    },
    action: {
      type: 'choice',
      options: [
        {
          id: 'founder',
          label: { en: 'Founder', zh: '创始人' },
          description: {
            en: 'I lead organizations and seek metaphysical advantage',
            zh: '我领导组织，寻求形而上学优势',
          },
        },
        {
          id: 'practitioner',
          label: { en: 'Practitioner', zh: '修行者' },
          description: {
            en: 'I work with metaphysical systems and seek mastery',
            zh: '我使用形而上学系统，寻求精通',
          },
        },
        {
          id: 'visionary',
          label: { en: 'Visionary', zh: '远见者' },
          description: {
            en: 'I explore the nature of reality and seek creation',
            zh: '我探索现实的本质，寻求创造',
          },
        },
      ],
    },
    purpose: 'Self-identification → segmentation',
    layersUnlocked: [],
    emotionalArc: 'Curiosity → What is this?',
  },

  // ==================== STAGE 2: ALIGNMENT ====================
  {
    id: 'alignment',
    order: 2,
    title: {
      en: 'Reveal your archetype constellation.',
      zh: '揭示您的原型星座。',
    },
    copy: {
      en: `Every pilgrim enters with a pattern.
Let us reveal yours.`,
      zh: `每位朝圣者都带着一种模式进入。
让我们揭示您的模式。`,
    },
    action: {
      type: 'input',
      inputs: [
        {
          id: 'birthDate',
          type: 'date',
          label: { en: 'Birth date (optional)', zh: '出生日期（可选）' },
          required: false,
        },
        {
          id: 'birthTime',
          type: 'text',
          label: { en: 'Birth time (optional)', zh: '出生时间（可选）' },
          required: false,
        },
        {
          id: 'role',
          type: 'select',
          label: { en: 'Current role', zh: '当前角色' },
          required: true,
          options: [
            { id: 'founder', label: { en: 'Founder/CEO', zh: '创始人/CEO' } },
            { id: 'operator', label: { en: 'Operator/Executive', zh: '运营者/高管' } },
            { id: 'mystic', label: { en: 'Mystic/Practitioner', zh: '神秘主义者/修行者' } },
            { id: 'researcher', label: { en: 'Researcher/Academic', zh: '研究者/学者' } },
            { id: 'creator', label: { en: 'Creator/Artist', zh: '创作者/艺术家' } },
          ],
        },
        {
          id: 'challenge',
          type: 'textarea',
          label: { en: 'Current challenge', zh: '当前挑战' },
          required: true,
        },
        {
          id: 'transformation',
          type: 'textarea',
          label: { en: 'Desired transformation', zh: '期望的转变' },
          required: true,
        },
      ],
    },
    output: {
      type: 'constellation',
      description: {
        en: 'A 3-archetype constellation: Dominant, Shadow, Ascending',
        zh: '3原型星座：主导、阴影、上升',
      },
    },
    purpose: 'Emotional resonance → personalization',
    layersUnlocked: [4],
    emotionalArc: 'Recognition → This sees me.',
  },

  // ==================== STAGE 3: ARCHITECTURE ====================
  {
    id: 'architecture',
    order: 3,
    title: {
      en: 'Your metaphysical structure is forming.',
      zh: '您的形而上学结构正在形成。',
    },
    copy: {
      en: `Your constellation shapes your architecture.
Your architecture shapes your path.`,
      zh: `您的星座塑造您的架构。
您的架构塑造您的道路。`,
    },
    action: {
      type: 'selection',
      options: [
        {
          id: 'personal',
          label: { en: 'Personal metaphysics map', zh: '个人形而上学地图' },
        },
        {
          id: 'team',
          label: { en: 'Team/organization preview', zh: '团队/组织预览' },
        },
        {
          id: 'timeline',
          label: { en: 'Timeline sensitivity index', zh: '时间线敏感度指数' },
        },
      ],
    },
    output: {
      type: 'map',
      description: {
        en: 'Personal metaphysics map with team preview and timeline sensitivity',
        zh: '个人形而上学地图，包含团队预览和时间线敏感度',
      },
    },
    purpose: "Reveal the system's intelligence",
    layersUnlocked: [1, 2, 3],
    emotionalArc: 'Revelation → This understands my structure.',
  },

  // ==================== STAGE 4: GOVERNANCE ====================
  {
    id: 'governance',
    order: 4,
    title: {
      en: 'Your timeline is opening.',
      zh: '您的时间线正在打开。',
    },
    copy: {
      en: `Every decision creates a timeline.
Every timeline has a structure.
Let us show you yours.`,
      zh: `每个决定都创造一条时间线。
每条时间线都有一个结构。
让我们展示您的。`,
    },
    action: {
      type: 'choice',
      options: [
        {
          id: 'stability',
          label: { en: 'Stability', zh: '稳定' },
          description: { en: 'Maintain and strengthen current position', zh: '维持并加强当前位置' },
        },
        {
          id: 'growth',
          label: { en: 'Growth', zh: '增长' },
          description: { en: 'Expand capabilities and reach', zh: '扩展能力和范围' },
        },
        {
          id: 'transformation',
          label: { en: 'Transformation', zh: '转型' },
          description: { en: 'Fundamental change in direction', zh: '方向上的根本改变' },
        },
        {
          id: 'reinvention',
          label: { en: 'Reinvention', zh: '重塑' },
          description: { en: 'Complete reimagining of identity', zh: '身份的完全重新想象' },
        },
      ],
    },
    output: {
      type: 'timeline',
      description: {
        en: '3-timeline simulation: Primary, Shadow, Breakthrough',
        zh: '3时间线模拟：主要、阴影、突破',
      },
    },
    purpose: 'Demonstrate predictive power',
    layersUnlocked: [10],
    emotionalArc: 'Awe → This can see my timelines.',
  },

  // ==================== STAGE 5: CREATION ====================
  {
    id: 'creation',
    order: 5,
    title: {
      en: 'You are entering the creation layer.',
      zh: '您正在进入创造层。',
    },
    copy: {
      en: `Most metaphysics ends at interpretation.
You are now entering creation.`,
      zh: `大多数形而上学止步于解读。
您现在正在进入创造。`,
    },
    action: {
      type: 'selection',
      options: [
        {
          id: 'ontology',
          label: { en: 'Meta-ontology', zh: '元本体论' },
          description: { en: 'Create new categories of being', zh: '创造新的存在类别' },
        },
        {
          id: 'causality',
          label: { en: 'Meta-causality', zh: '元因果' },
          description: { en: 'Design causal architectures', zh: '设计因果架构' },
        },
        {
          id: 'potentiality',
          label: { en: 'Meta-potentiality', zh: '元潜在性' },
          description: { en: 'Sculpt fields of possibility', zh: '雕刻可能性场' },
        },
        {
          id: 'genesis',
          label: { en: 'Meta-genesis', zh: '元创世' },
          description: { en: 'Architect origins', zh: '架构起源' },
        },
      ],
    },
    output: {
      type: 'spark',
      description: {
        en: 'A symbolic "creation spark" animation',
        zh: '"创造火花"象征性动画',
      },
    },
    purpose: "Introduce the Cathedral's higher layers",
    layersUnlocked: [17, 18, 19, 20],
    emotionalArc: 'Empowerment → I can create.',
  },

  // ==================== STAGE 6: PRIMORDIAL ====================
  {
    id: 'primordial',
    order: 6,
    title: {
      en: 'You are approaching the origin.',
      zh: '您正在接近起源。',
    },
    copy: {
      en: `Before existence, there is primordiality.
Before primordiality, there is you.`,
      zh: `在存在之前，有原始性。
在原始性之前，有您。`,
    },
    action: {
      type: 'reflection',
      question: {
        en: 'What do you seek to create that does not yet exist?',
        zh: '您想要创造什么尚不存在的东西？',
      },
    },
    purpose: 'Deep emotional anchoring',
    layersUnlocked: [21],
    emotionalArc: 'Depth → I can shape origins.',
  },

  // ==================== STAGE 7: ABSOLUTE ====================
  {
    id: 'absolute',
    order: 7,
    title: {
      en: 'You are entering the unconditioned.',
      zh: '您正在进入无条件。',
    },
    copy: {
      en: `Here, there is no form.
No boundary.
No distinction.
Only the absolute.`,
      zh: `这里，没有形式。
没有边界。
没有区分。
只有绝对。`,
    },
    action: {
      type: 'intention',
      options: [
        { id: 'clarity', label: { en: 'Clarity', zh: '清晰' } },
        { id: 'power', label: { en: 'Power', zh: '力量' } },
        { id: 'alignment', label: { en: 'Alignment', zh: '对齐' } },
        { id: 'sovereignty', label: { en: 'Sovereignty', zh: '主权' } },
        { id: 'vision', label: { en: 'Vision', zh: '远见' } },
      ],
    },
    purpose: "Anchor the user's metaphysical identity",
    layersUnlocked: [22],
    emotionalArc: 'Identity → I am an architect.',
  },

  // ==================== STAGE 8: VOID ====================
  {
    id: 'void',
    order: 8,
    title: {
      en: 'You are ready.',
      zh: '您准备好了。',
    },
    copy: {
      en: `The void is not emptiness.
It is the space where creation begins.`,
      zh: `虚空不是空虚。
它是创造开始的空间。`,
    },
    action: {
      type: 'cta',
      options: [
        {
          id: 'enter',
          label: { en: 'Enter the Cathedral', zh: '进入大教堂' },
        },
      ],
    },
    output: {
      type: 'dashboard',
      description: {
        en: 'Personalized dashboard with archetype constellation, timeline simulation, and layer access',
        zh: '个性化仪表板，包含原型星座、时间线模拟和层级访问',
      },
    },
    purpose: 'Initiation complete → user becomes a pilgrim',
    layersUnlocked: [23],
    emotionalArc: 'Initiation → I belong in the Cathedral.',
  },
];

// ==================== EMOTIONAL ARC ====================

export const EMOTIONAL_ARC = [
  { stage: 'awakening', emotion: 'Curiosity', question: 'What is this?' },
  { stage: 'alignment', emotion: 'Recognition', question: 'This sees me.' },
  { stage: 'architecture', emotion: 'Revelation', question: 'This understands my structure.' },
  { stage: 'governance', emotion: 'Awe', question: 'This can see my timelines.' },
  { stage: 'creation', emotion: 'Empowerment', question: 'I can create.' },
  { stage: 'primordial', emotion: 'Depth', question: 'I can shape origins.' },
  { stage: 'absolute', emotion: 'Identity', question: 'I am an architect.' },
  { stage: 'void', emotion: 'Initiation', question: 'I belong in the Cathedral.' },
];

// ==================== UX PRINCIPLES ====================

export const JOURNEY_UX_PRINCIPLES = {
  transitions: {
    type: 'ceremonial',
    duration: 800,
    easing: 'ease-in-out',
    description: 'Slow, ceremonial transitions between stages',
  },
  animations: {
    hypergraph: true,
    glyphBreathing: true,
    subtleSound: false,  // Optional
    description: 'Subtle hypergraph animations with breathing glyphs',
  },
  text: {
    minimal: true,
    resonant: true,
    description: 'Minimal text, maximal resonance',
  },
  feeling: {
    chamber: true,
    ritual: true,
    description: 'Every screen feels like a chamber, every action feels like a ritual',
  },
};

// ==================== ARCHETYPE OUTPUT ====================

export interface ArchetypeConstellation {
  dominant: Archetype;
  shadow: Archetype;
  ascending: Archetype;
}

export interface Archetype {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  glyph: string;
  description: {
    en: string;
    zh: string;
  };
  strengths: string[];
  challenges: string[];
}

export const SAMPLE_ARCHETYPES: Archetype[] = [
  {
    id: 'sovereign',
    name: { en: 'The Sovereign', zh: '主权者' },
    glyph: '♔',
    description: {
      en: 'Commands authority and shapes reality through will',
      zh: '掌握权威，通过意志塑造现实',
    },
    strengths: ['Leadership', 'Vision', 'Authority'],
    challenges: ['Isolation', 'Burden', 'Rigidity'],
  },
  {
    id: 'architect',
    name: { en: 'The Architect', zh: '架构师' },
    glyph: '⌘',
    description: {
      en: 'Designs structures and systems that endure',
      zh: '设计持久的结构和系统',
    },
    strengths: ['Design', 'Planning', 'Precision'],
    challenges: ['Perfectionism', 'Detachment', 'Control'],
  },
  {
    id: 'mystic',
    name: { en: 'The Mystic', zh: '神秘主义者' },
    glyph: '☽',
    description: {
      en: 'Perceives the hidden patterns beneath reality',
      zh: '感知现实之下的隐藏模式',
    },
    strengths: ['Intuition', 'Depth', 'Perception'],
    challenges: ['Groundedness', 'Communication', 'Practicality'],
  },
  {
    id: 'creator',
    name: { en: 'The Creator', zh: '创造者' },
    glyph: '✧',
    description: {
      en: 'Brings forth the new from the void',
      zh: '从虚空中带来新事物',
    },
    strengths: ['Innovation', 'Expression', 'Originality'],
    challenges: ['Completion', 'Discipline', 'Focus'],
  },
  {
    id: 'warrior',
    name: { en: 'The Warrior', zh: '战士' },
    glyph: '⚔',
    description: {
      en: 'Transforms through action and courage',
      zh: '通过行动和勇气转变',
    },
    strengths: ['Action', 'Courage', 'Determination'],
    challenges: ['Patience', 'Subtlety', 'Rest'],
  },
  {
    id: 'sage',
    name: { en: 'The Sage', zh: '智者' },
    glyph: '☉',
    description: {
      en: 'Seeks truth and illuminates understanding',
      zh: '寻求真理并照亮理解',
    },
    strengths: ['Wisdom', 'Analysis', 'Teaching'],
    challenges: ['Action', 'Emotion', 'Engagement'],
  },
];

// ==================== HELPER FUNCTIONS ====================

export function getStageById(id: JourneyStageId): JourneyStage | undefined {
  return JOURNEY_STAGES.find(stage => stage.id === id);
}

export function getNextStage(currentId: JourneyStageId): JourneyStage | undefined {
  const current = getStageById(currentId);
  if (!current) return undefined;
  return JOURNEY_STAGES.find(stage => stage.order === current.order + 1);
}

export function getPreviousStage(currentId: JourneyStageId): JourneyStage | undefined {
  const current = getStageById(currentId);
  if (!current) return undefined;
  return JOURNEY_STAGES.find(stage => stage.order === current.order - 1);
}

export function getUnlockedLayers(completedStages: JourneyStageId[]): number[] {
  const layers: Set<number> = new Set();
  for (const stageId of completedStages) {
    const stage = getStageById(stageId);
    if (stage) {
      stage.layersUnlocked.forEach(layer => layers.add(layer));
    }
  }
  return Array.from(layers).sort((a, b) => a - b);
}

export function getEmotionalArcForStage(stageId: JourneyStageId): typeof EMOTIONAL_ARC[0] | undefined {
  return EMOTIONAL_ARC.find(arc => arc.stage === stageId);
}
