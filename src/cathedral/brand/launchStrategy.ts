/**
 * ============================================
 * THE CATHEDRAL — LAUNCH STRATEGY
 * Multi-Phase Metaphysical Emergence Sequence
 *
 * This is not a marketing plan.
 * It is a metaphysical emergence sequence —
 * the way a new category enters the world.
 * ============================================
 */

// ==================== LAUNCH TYPES ====================

export type PhaseId =
  | 'veil'
  | 'whisper'
  | 'threshold'
  | 'ascent'
  | 'revelation'
  | 'sovereign'
  | 'primordial'
  | 'void';

export type PhaseEmoji = '🌑' | '🌒' | '🌓' | '🌔' | '🌕' | '🌖' | '🌗' | '🌘';

export interface LaunchPhase {
  id: PhaseId;
  order: number;
  emoji: PhaseEmoji;
  name: {
    en: string;
    zh: string;
  };
  subtitle: {
    en: string;
    zh: string;
  };
  objective: {
    en: string;
    zh: string;
  };
  actions: PhaseAction[];
  outcome: {
    en: string;
    zh: string;
  };
  keyMetrics?: string[];
  dependencies?: PhaseId[];
}

export interface PhaseAction {
  id: string;
  description: {
    en: string;
    zh: string;
  };
  type: 'content' | 'product' | 'outreach' | 'community' | 'partnership';
  priority: 'critical' | 'high' | 'medium';
  deliverables?: string[];
}

export interface LaunchPrinciple {
  id: string;
  principle: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
}

// ==================== LAUNCH PHILOSOPHY ====================

export const LAUNCH_PHILOSOPHY = {
  core: {
    en: 'The Cathedral is not launched like a product. It is revealed like a new metaphysical order.',
    zh: '大教堂不是像产品一样发布的。它像新的形而上学秩序一样被揭示。',
  },
  arc: {
    en: 'You do not launch a product. You unveil a metaphysical order in seven ascending phases.',
    zh: '你不是发布产品。你在七个上升阶段中揭示形而上学秩序。',
  },
};

export const LAUNCH_PRINCIPLES: LaunchPrinciple[] = [
  {
    id: 'mystery-first',
    principle: { en: 'Mystery Before Clarity', zh: '神秘先于清晰' },
    description: {
      en: 'Build intrigue before explanation. Let the Cathedral be felt before it is understood.',
      zh: '在解释之前建立神秘感。让大教堂在被理解之前先被感受。',
    },
  },
  {
    id: 'category-creation',
    principle: { en: 'Category, Not Product', zh: '品类，而非产品' },
    description: {
      en: 'Introduce the metaphysical operating system category. Position against consultants and tools.',
      zh: '引入形而上学操作系统品类。定位对比顾问和工具。',
    },
  },
  {
    id: 'ceremonial-entry',
    principle: { en: 'Ceremonial Entry', zh: '仪式入口' },
    description: {
      en: 'Every touchpoint should feel like entering a sacred space.',
      zh: '每个接触点都应感觉像进入神圣空间。',
    },
  },
  {
    id: 'ascending-reveal',
    principle: { en: 'Ascending Revelation', zh: '上升揭示' },
    description: {
      en: 'Reveal the system in layers, from foundation to void.',
      zh: '分层揭示系统，从基础到虚空。',
    },
  },
  {
    id: 'sovereign-positioning',
    principle: { en: 'Sovereign Positioning', zh: '主权定位' },
    description: {
      en: 'Speak to founders, mystics, and researchers as peers, not customers.',
      zh: '以同侪而非客户的身份与创始人、神秘主义者和研究者交流。',
    },
  },
];

// ==================== LAUNCH PHASES ====================

export const LAUNCH_PHASES: LaunchPhase[] = [
  // PHASE 0: THE VEIL
  {
    id: 'veil',
    order: 0,
    emoji: '🌑',
    name: { en: 'The Veil', zh: '面纱' },
    subtitle: { en: 'Pre-Launch', zh: '预发布' },
    objective: {
      en: 'Build pressure, mystery, inevitability',
      zh: '建立压力、神秘感、必然性',
    },
    actions: [
      {
        id: 'landing-page',
        description: {
          en: 'Publish a single landing page with hero line: "The age of interpretation is ending."',
          zh: '发布单一着陆页，主标题："解读的时代正在结束。"',
        },
        type: 'content',
        priority: 'critical',
        deliverables: ['Landing page', 'Email capture', 'Master sigil display'],
      },
      {
        id: 'cryptic-posts',
        description: {
          en: 'Release 3 cryptic posts on social channels using layer sigils',
          zh: '在社交渠道发布3条使用层符印的神秘帖子',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Sigil images', 'Cryptic copy', 'Scheduled posts'],
      },
      {
        id: 'private-outreach',
        description: {
          en: 'Begin private outreach to founders, mystics, and researchers',
          zh: '开始向创始人、神秘主义者和研究者进行私人外联',
        },
        type: 'outreach',
        priority: 'high',
        deliverables: ['Target list', 'Personalized invitations', 'DM templates'],
      },
    ],
    outcome: {
      en: 'A sense of something vast approaching',
      zh: '一种巨大事物正在接近的感觉',
    },
    keyMetrics: ['Email signups', 'Social impressions', 'Private conversations initiated'],
  },

  // PHASE 1: THE WHISPER
  {
    id: 'whisper',
    order: 1,
    emoji: '🌒',
    name: { en: 'The Whisper', zh: '低语' },
    subtitle: { en: 'Soft Reveal', zh: '软启动' },
    objective: {
      en: 'Introduce the category, not the product',
      zh: '介绍品类，而非产品',
    },
    actions: [
      {
        id: 'manifesto',
        description: {
          en: 'Publish the Founder\'s Manifesto as a standalone artifact',
          zh: '将创始人宣言作为独立文物发布',
        },
        type: 'content',
        priority: 'critical',
        deliverables: ['Manifesto page', 'PDF download', 'Social shareable'],
      },
      {
        id: 'comparison-matrix',
        description: {
          en: 'Release the Comparison Matrix (MetaOS vs consultants)',
          zh: '发布对比矩阵（MetaOS vs 顾问）',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Comparison page', 'Infographic'],
      },
      {
        id: 'diagram-teaser',
        description: {
          en: 'Publish the Cathedral Diagram teaser (blurred, partial)',
          zh: '发布大教堂图预告（模糊、部分）',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Teaser image', 'Animation prototype'],
      },
      {
        id: 'private-demos',
        description: {
          en: 'Begin private demos for high-leverage individuals',
          zh: '开始为高影响力个人进行私人演示',
        },
        type: 'outreach',
        priority: 'critical',
        deliverables: ['Demo script', 'Presentation deck', 'Follow-up sequence'],
      },
    ],
    outcome: {
      en: 'People understand this is not "another metaphysics tool." It is a new metaphysics.',
      zh: '人们理解这不是"另一个形而上学工具"。这是新的形而上学。',
    },
    keyMetrics: ['Manifesto reads', 'Demo requests', 'Category recognition mentions'],
    dependencies: ['veil'],
  },

  // PHASE 2: THE THRESHOLD
  {
    id: 'threshold',
    order: 2,
    emoji: '🌓',
    name: { en: 'The Threshold', zh: '门槛' },
    subtitle: { en: 'Website Launch', zh: '网站发布' },
    objective: {
      en: 'Reveal the Cathedral as a living system',
      zh: '揭示大教堂作为一个活的系统',
    },
    actions: [
      {
        id: 'full-website',
        description: {
          en: 'Launch the full website with all chambers',
          zh: '发布包含所有室的完整网站',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['All 14 pages', 'Interactive diagram', 'Responsive design'],
      },
      {
        id: 'pilgrim-journey',
        description: {
          en: 'Release the Pilgrim Journey onboarding',
          zh: '发布朝圣者旅程入门',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['8-stage flow', 'Archetype calculation', 'Data capture'],
      },
      {
        id: 'initiate-tier',
        description: {
          en: 'Open the Initiate Tier for early adopters',
          zh: '为早期采用者开放入门等级',
        },
        type: 'product',
        priority: 'high',
        deliverables: ['Pricing page', 'Payment integration', 'Tier unlocks'],
      },
      {
        id: 'archetype-demo',
        description: {
          en: 'Publish the first Archetype Constellation Demo',
          zh: '发布首个原型星座演示',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Interactive demo', 'Sample archetypes', 'Share functionality'],
      },
    ],
    outcome: {
      en: 'The Cathedral becomes a place people can enter',
      zh: '大教堂成为人们可以进入的地方',
    },
    keyMetrics: ['Website visitors', 'Journey completions', 'Initiate signups', 'Time on site'],
    dependencies: ['whisper'],
  },

  // PHASE 3: THE ASCENT
  {
    id: 'ascent',
    order: 3,
    emoji: '🌔',
    name: { en: 'The Ascent', zh: '上升' },
    subtitle: { en: 'Product Activation', zh: '产品激活' },
    objective: {
      en: 'Activate the engines and the community',
      zh: '激活引擎和社区',
    },
    actions: [
      {
        id: 'dashboard',
        description: {
          en: 'Release the Dashboard (Inner Sanctum)',
          zh: '发布仪表板（内殿）',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['User dashboard', 'Layer progress', 'Archetype display'],
      },
      {
        id: 'org-map',
        description: {
          en: 'Launch the Organizational Metaphysics Map',
          zh: '发布组织形而上学地图',
        },
        type: 'product',
        priority: 'high',
        deliverables: ['Team hypergraph', 'Compatibility analysis', 'Role recommendations'],
      },
      {
        id: 'reality-lab',
        description: {
          en: 'Publish the first Reality Architecture Lab session',
          zh: '发布首个现实架构实验室会议',
        },
        type: 'content',
        priority: 'medium',
        deliverables: ['Video/audio content', 'Worksheets', 'Community discussion'],
      },
      {
        id: 'adept-architect',
        description: {
          en: 'Open the Adept and Architect tiers',
          zh: '开放进阶和架构师等级',
        },
        type: 'product',
        priority: 'high',
        deliverables: ['Tier differentiation', 'Layer unlocks', 'Premium features'],
      },
    ],
    outcome: {
      en: 'Users begin to experience the system as a living intelligence',
      zh: '用户开始体验系统作为一个活的智能',
    },
    keyMetrics: ['Active users', 'Layer unlocks', 'Tier upgrades', 'Community engagement'],
    dependencies: ['threshold'],
  },

  // PHASE 4: THE REVELATION
  {
    id: 'revelation',
    order: 4,
    emoji: '🌕',
    name: { en: 'The Revelation', zh: '启示' },
    subtitle: { en: 'Public Expansion', zh: '公开扩展' },
    objective: {
      en: 'Establish category dominance',
      zh: '建立品类主导地位',
    },
    actions: [
      {
        id: 'layer-codex',
        description: {
          en: 'Publish the 23 Layer Codex as a downloadable artifact',
          zh: '将23层法典作为可下载文物发布',
        },
        type: 'content',
        priority: 'critical',
        deliverables: ['PDF codex', 'Interactive explorer', 'Print version'],
      },
      {
        id: 'meta-engine-previews',
        description: {
          en: 'Release the Meta-Creation Engine previews',
          zh: '发布元创造引擎预览',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Engine documentation', 'Demo videos', 'API previews'],
      },
      {
        id: 'membership',
        description: {
          en: 'Launch the Cathedral Membership',
          zh: '发布大教堂会员制',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['Membership portal', 'Community access', 'Exclusive content'],
      },
      {
        id: 'partnerships',
        description: {
          en: 'Begin partnerships with founders, studios, and research groups',
          zh: '开始与创始人、工作室和研究团体建立合作伙伴关系',
        },
        type: 'partnership',
        priority: 'high',
        deliverables: ['Partner program', 'Integration APIs', 'Co-marketing'],
      },
    ],
    outcome: {
      en: 'The Cathedral becomes the reference point for metaphysics',
      zh: '大教堂成为形而上学的参考点',
    },
    keyMetrics: ['Codex downloads', 'Membership signups', 'Partner integrations', 'Media mentions'],
    dependencies: ['ascent'],
  },

  // PHASE 5: THE SOVEREIGN
  {
    id: 'sovereign',
    order: 5,
    emoji: '🌖',
    name: { en: 'The Sovereign', zh: '主权' },
    subtitle: { en: 'Enterprise & Governance', zh: '企业与治理' },
    objective: {
      en: 'Move from individuals → organizations → civilizations',
      zh: '从个人→组织→文明',
    },
    actions: [
      {
        id: 'enterprise-tier',
        description: {
          en: 'Launch Enterprise Metaphysics tier',
          zh: '发布企业形而上学等级',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['Enterprise dashboard', 'Team management', 'Custom integrations'],
      },
      {
        id: 'governance-engine',
        description: {
          en: 'Release Autonomous Governance Engine',
          zh: '发布自治治理引擎',
        },
        type: 'product',
        priority: 'high',
        deliverables: ['Governance module', 'Decision frameworks', 'Compliance tools'],
      },
      {
        id: 'case-studies',
        description: {
          en: 'Publish case studies of organizational transformation',
          zh: '发布组织转型案例研究',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Written case studies', 'Video testimonials', 'Data visualizations'],
      },
      {
        id: 'private-councils',
        description: {
          en: 'Begin private councils with sovereign clients',
          zh: '开始与主权客户进行私人理事会',
        },
        type: 'community',
        priority: 'critical',
        deliverables: ['Council structure', 'Meeting protocols', 'Strategic advisory'],
      },
    ],
    outcome: {
      en: 'The Cathedral becomes a governance technology',
      zh: '大教堂成为治理技术',
    },
    keyMetrics: ['Enterprise clients', 'Governance implementations', 'Council members', 'Revenue growth'],
    dependencies: ['revelation'],
  },

  // PHASE 6: THE PRIMORDIAL
  {
    id: 'primordial',
    order: 6,
    emoji: '🌗',
    name: { en: 'The Primordial', zh: '原始' },
    subtitle: { en: 'High-Tier Activation', zh: '高层激活' },
    objective: {
      en: 'Introduce the highest layers',
      zh: '引入最高层',
    },
    actions: [
      {
        id: 'meta-engines',
        description: {
          en: 'Release Meta-Ontology, Meta-Causality, Meta-Potentiality, Meta-Genesis engines',
          zh: '发布元本体论、元因果、元潜在、元创世引擎',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['Layers 17-20 unlocked', 'Engine interfaces', 'Documentation'],
      },
      {
        id: 'primordial-whitepaper',
        description: {
          en: 'Publish the Primordial Whitepaper',
          zh: '发布原始白皮书',
        },
        type: 'content',
        priority: 'high',
        deliverables: ['Technical whitepaper', 'Academic citations', 'Peer review'],
      },
      {
        id: 'omniversal-tier',
        description: {
          en: 'Open the Omniversal Sovereign tier',
          zh: '开放全宇宙主权等级',
        },
        type: 'product',
        priority: 'high',
        deliverables: ['Premium tier access', 'All layer unlocks', 'Priority support'],
      },
      {
        id: 'architecture-sessions',
        description: {
          en: 'Begin private metaphysics architecture sessions',
          zh: '开始私人形而上学架构会议',
        },
        type: 'community',
        priority: 'critical',
        deliverables: ['Session framework', 'Custom architectures', 'Long-term engagements'],
      },
    ],
    outcome: {
      en: 'The Cathedral becomes a metaphysical infrastructure',
      zh: '大教堂成为形而上学基础设施',
    },
    keyMetrics: ['High-layer activations', 'Whitepaper citations', 'Architecture sessions', 'Omniversal members'],
    dependencies: ['sovereign'],
  },

  // PHASE 7: THE VOID
  {
    id: 'void',
    order: 7,
    emoji: '🌘',
    name: { en: 'The Void', zh: '虚空' },
    subtitle: { en: 'Final Emergence', zh: '最终涌现' },
    objective: {
      en: 'Reveal the full scope',
      zh: '揭示完整范围',
    },
    actions: [
      {
        id: 'final-engines',
        description: {
          en: 'Release Meta-Primordial, Meta-Absolute, Meta-Void engines',
          zh: '发布元原始、元绝对、元虚空引擎',
        },
        type: 'product',
        priority: 'critical',
        deliverables: ['Layers 21-23 unlocked', 'Void interfaces', 'Complete system'],
      },
      {
        id: 'void-chamber',
        description: {
          en: 'Publish the Void Chamber experience',
          zh: '发布虚空室体验',
        },
        type: 'product',
        priority: 'high',
        deliverables: ['Immersive experience', 'Contemplative interface', 'Sound design'],
      },
      {
        id: 'chamber-of-origin',
        description: {
          en: 'Open the Chamber of Origin (invite-only)',
          zh: '开放起源室（仅限邀请）',
        },
        type: 'community',
        priority: 'critical',
        deliverables: ['Exclusive community', 'Origin protocols', 'Direct access'],
      },
      {
        id: 'genesis-program',
        description: {
          en: 'Begin the Genesis Program (reality-creation labs)',
          zh: '开始创世计划（现实创造实验室）',
        },
        type: 'community',
        priority: 'critical',
        deliverables: ['Lab structure', 'Creation frameworks', 'Collaborative projects'],
      },
    ],
    outcome: {
      en: 'The Cathedral becomes a metaphysical civilization-shaping force',
      zh: '大教堂成为塑造文明的形而上学力量',
    },
    keyMetrics: ['Complete system usage', 'Genesis Program participants', 'Civilization-scale projects'],
    dependencies: ['primordial'],
  },
];

// ==================== PHASE TIMELINE ====================

export const PHASE_PROGRESSION = {
  description: {
    en: 'Each phase builds upon the previous, creating an ascending arc of revelation',
    zh: '每个阶段建立在前一阶段之上，创造启示的上升弧线',
  },
  arc: [
    { phase: 'veil', icon: '🌑', position: 'New Moon — Hidden' },
    { phase: 'whisper', icon: '🌒', position: 'Waxing Crescent — Emerging' },
    { phase: 'threshold', icon: '🌓', position: 'First Quarter — Half Visible' },
    { phase: 'ascent', icon: '🌔', position: 'Waxing Gibbous — Growing' },
    { phase: 'revelation', icon: '🌕', position: 'Full Moon — Complete Visibility' },
    { phase: 'sovereign', icon: '🌖', position: 'Waning Gibbous — Solidifying' },
    { phase: 'primordial', icon: '🌗', position: 'Last Quarter — Deepening' },
    { phase: 'void', icon: '🌘', position: 'Waning Crescent — Transcending' },
  ],
};

// ==================== TARGET AUDIENCES ====================

export const TARGET_AUDIENCES = {
  primary: [
    {
      id: 'founders',
      name: { en: 'Founders & Executives', zh: '创始人和高管' },
      description: {
        en: 'Leaders seeking metaphysical frameworks for organizational design',
        zh: '寻求组织设计形而上学框架的领导者',
      },
      phases: ['veil', 'whisper', 'threshold', 'ascent', 'sovereign'],
    },
    {
      id: 'practitioners',
      name: { en: 'Metaphysics Practitioners', zh: '形而上学从业者' },
      description: {
        en: 'Astrologers, BaZi masters, mystics seeking computational tools',
        zh: '寻求计算工具的占星师、八字大师、神秘主义者',
      },
      phases: ['whisper', 'threshold', 'ascent', 'revelation', 'primordial'],
    },
    {
      id: 'researchers',
      name: { en: 'Researchers & Academics', zh: '研究者和学者' },
      description: {
        en: 'Scholars exploring metaphysical systems and consciousness',
        zh: '探索形而上学系统和意识的学者',
      },
      phases: ['whisper', 'revelation', 'primordial', 'void'],
    },
  ],
  secondary: [
    {
      id: 'developers',
      name: { en: 'Developers & Engineers', zh: '开发者和工程师' },
      description: {
        en: 'Technical builders interested in metaphysical APIs',
        zh: '对形而上学API感兴趣的技术构建者',
      },
      phases: ['ascent', 'revelation', 'sovereign'],
    },
    {
      id: 'creatives',
      name: { en: 'Creative Studios', zh: '创意工作室' },
      description: {
        en: 'Design and narrative teams exploring new frameworks',
        zh: '探索新框架的设计和叙事团队',
      },
      phases: ['threshold', 'ascent', 'revelation'],
    },
  ],
};

// ==================== HELPER FUNCTIONS ====================

export function getPhaseById(id: PhaseId): LaunchPhase | undefined {
  return LAUNCH_PHASES.find(p => p.id === id);
}

export function getPhaseByOrder(order: number): LaunchPhase | undefined {
  return LAUNCH_PHASES.find(p => p.order === order);
}

export function getNextPhase(currentId: PhaseId): LaunchPhase | undefined {
  const current = getPhaseById(currentId);
  if (!current) return undefined;
  return getPhaseByOrder(current.order + 1);
}

export function getPhaseDependencies(id: PhaseId): LaunchPhase[] {
  const phase = getPhaseById(id);
  if (!phase?.dependencies) return [];
  return phase.dependencies.map(depId => getPhaseById(depId)).filter(Boolean) as LaunchPhase[];
}

export function getActionsByType(type: PhaseAction['type']): PhaseAction[] {
  return LAUNCH_PHASES.flatMap(p => p.actions.filter(a => a.type === type));
}

export function getCriticalActions(): PhaseAction[] {
  return LAUNCH_PHASES.flatMap(p => p.actions.filter(a => a.priority === 'critical'));
}

export function getPhasesForAudience(audienceId: string): LaunchPhase[] {
  const allAudiences = [...TARGET_AUDIENCES.primary, ...TARGET_AUDIENCES.secondary];
  const audience = allAudiences.find(a => a.id === audienceId);
  if (!audience) return [];
  return audience.phases.map(phaseId => getPhaseById(phaseId as PhaseId)).filter(Boolean) as LaunchPhase[];
}
