/**
 * ============================================
 * TECHNICAL → NARRATIVE BRIDGE LAYER
 * The translation engine that turns:
 * - Technical BaZi math
 * - Interactions
 * - Luck Pillars
 * - Annual influences
 * - Useful God logic
 *
 * into narrative cockpit language.
 *
 * This is the layer Joey Yap's system
 * does not have at all.
 * ============================================
 */

// ==================== DATA MODEL ====================

export type NarrativeTheme =
  | 'tension'
  | 'vulnerability'
  | 'support'
  | 'growth'
  | 'transition'
  | 'challenge'
  | 'opportunity'
  | 'reckoning'
  | 'blessing'
  | 'shadow'
  | 'integration'
  | 'emergence';

export interface TechnicalPoint {
  id: string;
  rule: string;
  ruleZh?: string;
  value: unknown;
  explanation: string;
  explanationZh?: string;
  category: 'interaction' | 'luck' | 'annual' | 'useful_god' | 'seasonal' | 'special';
  severity?: 'mild' | 'moderate' | 'strong' | 'critical';
}

export interface NarrativePoint {
  id: string;
  theme: NarrativeTheme;
  story: string;
  storyZh: string;
  sourceTechnical: TechnicalPoint;
  emotionalTone: EmotionalTone;
  actionableInsight?: string;
  actionableInsightZh?: string;
}

export interface EmotionalTone {
  valence: number;    // -100 to +100 (negative to positive)
  intensity: number;  // 0 to 100
  color: string;      // Hex color
}

export interface NarrativeBridge {
  technicalPoints: TechnicalPoint[];
  narrativePoints: NarrativePoint[];
  overallArc: NarrativeArc;
  transitions: NarrativeTransition[];
}

export interface NarrativeArc {
  opening: string;
  openingZh: string;
  journey: string;
  journeyZh: string;
  resolution: string;
  resolutionZh: string;
  dominantTheme: NarrativeTheme;
}

export interface NarrativeTransition {
  from: NarrativeTheme;
  to: NarrativeTheme;
  trigger: string;
  triggerZh?: string;
}

// ==================== THEME MAPPING ====================

/**
 * Map technical rules to narrative themes
 */
const RULE_TO_THEME_MAP: Record<string, NarrativeTheme> = {
  // Interactions
  'clash': 'tension',
  'harm': 'vulnerability',
  'punishment': 'reckoning',
  'combination': 'support',
  'destruction': 'challenge',
  'fu_yin': 'shadow',
  'fan_yin': 'transition',

  // Luck and timing
  'luck_transition': 'transition',
  'annual': 'opportunity',
  'monthly': 'emergence',

  // Useful God
  'useful_god_strong': 'growth',
  'useful_god_weak': 'challenge',
  'useful_god_supported': 'blessing',
  'useful_god_attacked': 'vulnerability',

  // Seasonal
  'seasonal_strong': 'support',
  'seasonal_weak': 'challenge',

  // Special
  'death_emptiness': 'shadow',
  'nobleman': 'blessing',
  'peach_blossom': 'opportunity',
  'traveling_horse': 'transition'
};

/**
 * Get theme for a technical rule
 */
export function getThemeForRule(rule: string): NarrativeTheme {
  const ruleLower = rule.toLowerCase();

  // Check exact match
  if (RULE_TO_THEME_MAP[ruleLower]) {
    return RULE_TO_THEME_MAP[ruleLower];
  }

  // Check partial matches
  for (const [key, theme] of Object.entries(RULE_TO_THEME_MAP)) {
    if (ruleLower.includes(key) || key.includes(ruleLower)) {
      return theme;
    }
  }

  return 'transition'; // Default
}

// ==================== EMOTIONAL TONE MAPPING ====================

/**
 * Get emotional tone for a theme
 */
export function getEmotionalToneForTheme(theme: NarrativeTheme): EmotionalTone {
  const tones: Record<NarrativeTheme, EmotionalTone> = {
    'tension': { valence: -40, intensity: 70, color: '#e74c3c' },
    'vulnerability': { valence: -30, intensity: 50, color: '#9b59b6' },
    'support': { valence: 60, intensity: 60, color: '#2ecc71' },
    'growth': { valence: 70, intensity: 80, color: '#27ae60' },
    'transition': { valence: 0, intensity: 50, color: '#3498db' },
    'challenge': { valence: -20, intensity: 60, color: '#e67e22' },
    'opportunity': { valence: 50, intensity: 70, color: '#f1c40f' },
    'reckoning': { valence: -50, intensity: 80, color: '#c0392b' },
    'blessing': { valence: 80, intensity: 70, color: '#f39c12' },
    'shadow': { valence: -40, intensity: 60, color: '#2c3e50' },
    'integration': { valence: 40, intensity: 50, color: '#16a085' },
    'emergence': { valence: 30, intensity: 65, color: '#1abc9c' }
  };

  return tones[theme] || { valence: 0, intensity: 50, color: '#95a5a6' };
}

// ==================== STORY DERIVATION ====================

/**
 * Derive a story from theme and value
 */
export function deriveStory(
  theme: NarrativeTheme,
  value: unknown,
  rule: string
): { story: string; storyZh: string } {
  const storyMap: Record<NarrativeTheme, { en: string; zh: string }> = {
    'tension': {
      en: 'External pressure calls you to make pivotal choices. The friction you feel is not opposition—it is the universe asking you to clarify your direction.',
      zh: '外界压力促使你做出关键选择。你感受到的摩擦并非对立——而是宇宙在询问你的方向。'
    },
    'vulnerability': {
      en: 'Old wounds surface, asking to be seen. This is not weakness; it is the soul\'s invitation to tend to what has been neglected.',
      zh: '旧伤口浮现，需要温柔面对。这不是软弱，而是灵魂邀请你关照被忽视的部分。'
    },
    'support': {
      en: 'Resources and allies begin to gather. The support you need is arriving—remain open to receiving.',
      zh: '资源与贵人开始聚集。你所需的支持正在到来——保持接受的开放。'
    },
    'growth': {
      en: 'Your abilities and direction are becoming clear. This is a time of expansion—trust the unfolding.',
      zh: '能力与方向逐渐清晰。这是扩展的时刻——信任这展开的过程。'
    },
    'transition': {
      en: 'Life is entering a new phase. The old chapter closes as a new one opens—allow the change.',
      zh: '生命进入新的阶段。旧篇章结束，新篇章开启——允许这改变发生。'
    },
    'challenge': {
      en: 'Obstacles appear to test your resolve. Each challenge contains a lesson—find it.',
      zh: '障碍出现以考验你的决心。每个挑战都蕴含教训——找到它。'
    },
    'opportunity': {
      en: 'Windows of possibility are opening. Act with intention while the timing favors you.',
      zh: '可能性的窗口正在打开。趁时机有利时有意识地行动。'
    },
    'reckoning': {
      en: 'Past actions return for accounting. This is not punishment but completion—face it with courage.',
      zh: '过去的行为回来清算。这不是惩罚而是完成——勇敢面对。'
    },
    'blessing': {
      en: 'Grace arrives from unexpected directions. Accept the gift without questioning your worthiness.',
      zh: '恩典从意想不到的方向到来。接受这礼物，不必质疑自己的配得。'
    },
    'shadow': {
      en: 'Hidden aspects of self emerge for integration. What you resist persists—what you embrace transforms.',
      zh: '自我的隐藏面浮现以待整合。你抗拒的会持续——你拥抱的会转化。'
    },
    'integration': {
      en: 'Disparate parts of your journey come together. The pieces finally make sense—trust the pattern.',
      zh: '你旅途中分散的部分开始聚合。碎片终于有了意义——信任这模式。'
    },
    'emergence': {
      en: 'A new aspect of self is being born. Allow the emergence without forcing the shape.',
      zh: '自我的新面向正在诞生。允许涌现，不强迫形状。'
    }
  };

  const base = storyMap[theme] || storyMap['transition'];

  // Add context from the specific rule
  const contextEn = getContextForRule(rule, value, 'en');
  const contextZh = getContextForRule(rule, value, 'zh');

  return {
    story: `${base.en}\n\n${contextEn}`,
    storyZh: `${base.zh}\n\n${contextZh}`
  };
}

/**
 * Get context for specific rule
 */
function getContextForRule(rule: string, value: unknown, lang: 'en' | 'zh'): string {
  const ruleLower = rule.toLowerCase();

  if (ruleLower.includes('clash')) {
    return lang === 'zh'
      ? '冲的能量推动改变——不是破坏，而是重新排列。'
      : 'The clash energy pushes for change—not destruction, but rearrangement.';
  }

  if (ruleLower.includes('harm')) {
    return lang === 'zh'
      ? '害的能量揭示需要疗愈的关系动态。'
      : 'The harm energy reveals relationship dynamics that need healing.';
  }

  if (ruleLower.includes('combination')) {
    return lang === 'zh'
      ? '合的能量将分离的力量编织在一起。'
      : 'The combination energy weaves separate forces together.';
  }

  if (ruleLower.includes('useful') || ruleLower.includes('god')) {
    return lang === 'zh'
      ? '用神的状态影响你吸引所需资源的能力。'
      : 'The state of your Useful God affects your ability to attract needed resources.';
  }

  if (ruleLower.includes('luck') || ruleLower.includes('pillar')) {
    return lang === 'zh'
      ? '大运转换标志着人生方向的转变。'
      : 'Luck Pillar transitions mark shifts in life direction.';
  }

  if (ruleLower.includes('annual')) {
    return lang === 'zh'
      ? '流年带来的影响将在接下来几个月显现。'
      : 'Annual influences will manifest over the coming months.';
  }

  return lang === 'zh' ? '观察这能量如何在你生活中表现。' : 'Observe how this energy manifests in your life.';
}

// ==================== BRIDGE ENGINE ====================

/**
 * Translate technical points to narrative points
 */
export function translateTechnicalToNarrative(
  technicalPoints: TechnicalPoint[]
): NarrativePoint[] {
  return technicalPoints.map(tech => {
    const theme = getThemeForRule(tech.rule);
    const emotionalTone = getEmotionalToneForTheme(theme);
    const { story, storyZh } = deriveStory(theme, tech.value, tech.rule);

    // Generate actionable insight
    const { insight, insightZh } = generateActionableInsight(theme, tech);

    return {
      id: `narrative-${tech.id}`,
      theme,
      story,
      storyZh,
      sourceTechnical: tech,
      emotionalTone,
      actionableInsight: insight,
      actionableInsightZh: insightZh
    };
  });
}

/**
 * Generate actionable insight from theme
 */
function generateActionableInsight(
  theme: NarrativeTheme,
  tech: TechnicalPoint
): { insight: string; insightZh: string } {
  const insights: Record<NarrativeTheme, { en: string; zh: string }> = {
    'tension': {
      en: 'Action: Identify one decision you\'ve been avoiding. Make it this week.',
      zh: '行动：找出一个你一直回避的决定。这周做出来。'
    },
    'vulnerability': {
      en: 'Action: Schedule time for self-care. Your sensitivity is a gift—protect it.',
      zh: '行动：安排自我关照的时间。你的敏感是礼物——保护它。'
    },
    'support': {
      en: 'Action: Reach out to someone you trust. Accept help when offered.',
      zh: '行动：联系你信任的人。接受别人提供的帮助。'
    },
    'growth': {
      en: 'Action: Take one bold step toward your goal. The timing supports expansion.',
      zh: '行动：朝目标迈出大胆的一步。时机支持扩展。'
    },
    'transition': {
      en: 'Action: Release one thing that no longer serves you. Make space for the new.',
      zh: '行动：放下一件不再服务于你的事物。为新事物腾出空间。'
    },
    'challenge': {
      en: 'Action: Break down one obstacle into smaller steps. Start with the first step today.',
      zh: '行动：将一个障碍分解成小步骤。今天从第一步开始。'
    },
    'opportunity': {
      en: 'Action: Say yes to one invitation or opportunity this week.',
      zh: '行动：这周对一个邀请或机会说"是"。'
    },
    'reckoning': {
      en: 'Action: Address one unfinished matter. Completion brings freedom.',
      zh: '行动：处理一件未完成的事。完成带来自由。'
    },
    'blessing': {
      en: 'Action: Express gratitude for one thing daily. Abundance follows appreciation.',
      zh: '行动：每天表达对一件事的感激。丰盛跟随感恩。'
    },
    'shadow': {
      en: 'Action: Journal about a recurring pattern you notice. Awareness is the first step.',
      zh: '行动：写下你注意到的一个反复出现的模式。觉察是第一步。'
    },
    'integration': {
      en: 'Action: Connect two areas of your life that seem separate. Find the thread.',
      zh: '行动：连接你生活中看似分离的两个领域。找到线索。'
    },
    'emergence': {
      en: 'Action: Try one new thing without expectation. Let yourself be surprised.',
      zh: '行动：尝试一件新事物，不带期望。让自己惊喜。'
    }
  };

  const base = insights[theme] || insights['transition'];
  return { insight: base.en, insightZh: base.zh };
}

/**
 * Build full narrative bridge
 */
export function buildNarrativeBridge(
  technicalPoints: TechnicalPoint[]
): NarrativeBridge {
  const narrativePoints = translateTechnicalToNarrative(technicalPoints);
  const overallArc = synthesizeNarrativeArc(narrativePoints);
  const transitions = identifyNarrativeTransitions(narrativePoints);

  return {
    technicalPoints,
    narrativePoints,
    overallArc,
    transitions
  };
}

/**
 * Synthesize overall narrative arc
 */
function synthesizeNarrativeArc(narrativePoints: NarrativePoint[]): NarrativeArc {
  // Count theme occurrences
  const themeCounts = new Map<NarrativeTheme, number>();
  narrativePoints.forEach(np => {
    themeCounts.set(np.theme, (themeCounts.get(np.theme) || 0) + 1);
  });

  // Find dominant theme
  let dominantTheme: NarrativeTheme = 'transition';
  let maxCount = 0;
  themeCounts.forEach((count, theme) => {
    if (count > maxCount) {
      maxCount = count;
      dominantTheme = theme;
    }
  });

  // Calculate average valence
  const avgValence = narrativePoints.reduce((sum, np) => sum + np.emotionalTone.valence, 0) / narrativePoints.length;

  // Generate arc based on dominant theme and valence
  const arc = generateArcText(dominantTheme, avgValence);

  return {
    ...arc,
    dominantTheme
  };
}

/**
 * Generate arc text
 */
function generateArcText(
  theme: NarrativeTheme,
  avgValence: number
): { opening: string; openingZh: string; journey: string; journeyZh: string; resolution: string; resolutionZh: string } {
  const isPositive = avgValence > 20;
  const isNegative = avgValence < -20;

  if (isPositive) {
    return {
      opening: 'Your story opens with winds of favor at your back. The energies align to support your movement.',
      openingZh: '你的故事以顺风开始。能量排列支持你的行动。',
      journey: `The dominant theme of ${theme} weaves through your path, offering opportunities for expansion and growth.`,
      journeyZh: `「${theme}」的主题贯穿你的道路，提供扩展和成长的机会。`,
      resolution: 'The arc resolves toward greater clarity and alignment. Trust the direction you\'re heading.',
      resolutionZh: '弧线朝向更大的清晰和对齐解决。信任你前进的方向。'
    };
  } else if (isNegative) {
    return {
      opening: 'Your story opens with challenges that call for your strength. The difficulties are teachers.',
      openingZh: '你的故事以呼唤你力量的挑战开始。困难是老师。',
      journey: `The dominant theme of ${theme} asks you to face what you might prefer to avoid. Growth lives here.`,
      journeyZh: `「${theme}」的主题要求你面对你可能更愿意回避的事物。成长就在这里。`,
      resolution: 'The arc resolves through perseverance. What seems difficult now is forging your future strength.',
      resolutionZh: '弧线通过坚持解决。现在看似困难的正在锻造你未来的力量。'
    };
  } else {
    return {
      opening: 'Your story opens in a time of balance and transition. The universe holds its breath.',
      openingZh: '你的故事在平衡和过渡的时刻开始。宇宙屏住呼吸。',
      journey: `The dominant theme of ${theme} invites you to observe before acting. Wisdom comes from patience.`,
      journeyZh: `「${theme}」的主题邀请你在行动前观察。智慧来自耐心。`,
      resolution: 'The arc resolves through conscious choice. You are the author of what comes next.',
      resolutionZh: '弧线通过有意识的选择解决。你是接下来发生的事的作者。'
    };
  }
}

/**
 * Identify narrative transitions
 */
function identifyNarrativeTransitions(
  narrativePoints: NarrativePoint[]
): NarrativeTransition[] {
  const transitions: NarrativeTransition[] = [];

  for (let i = 0; i < narrativePoints.length - 1; i++) {
    const current = narrativePoints[i];
    const next = narrativePoints[i + 1];

    if (current.theme !== next.theme) {
      transitions.push({
        from: current.theme,
        to: next.theme,
        trigger: `Transition from ${current.sourceTechnical.rule} to ${next.sourceTechnical.rule}`,
        triggerZh: `从「${current.sourceTechnical.ruleZh || current.sourceTechnical.rule}」到「${next.sourceTechnical.ruleZh || next.sourceTechnical.rule}」的转换`
      });
    }
  }

  return transitions;
}

// ==================== RENDERING ====================

/**
 * Render narrative bridge as markdown
 */
export function renderNarrativeBridgeMarkdown(
  bridge: NarrativeBridge,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '技术→叙事桥梁' : 'Technical → Narrative Bridge'}`);
  lines.push('');

  // Overall arc
  lines.push(`## ${lang === 'zh' ? '整体叙事弧' : 'Overall Narrative Arc'}`);
  lines.push('');
  lines.push(`**${lang === 'zh' ? '开场' : 'Opening'}:**`);
  lines.push(lang === 'zh' ? bridge.overallArc.openingZh : bridge.overallArc.opening);
  lines.push('');
  lines.push(`**${lang === 'zh' ? '旅程' : 'Journey'}:**`);
  lines.push(lang === 'zh' ? bridge.overallArc.journeyZh : bridge.overallArc.journey);
  lines.push('');
  lines.push(`**${lang === 'zh' ? '解决' : 'Resolution'}:**`);
  lines.push(lang === 'zh' ? bridge.overallArc.resolutionZh : bridge.overallArc.resolution);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Narrative points
  lines.push(`## ${lang === 'zh' ? '叙事点' : 'Narrative Points'}`);
  lines.push('');

  bridge.narrativePoints.forEach((np, i) => {
    const story = lang === 'zh' ? np.storyZh : np.story;
    const insight = lang === 'zh' ? np.actionableInsightZh : np.actionableInsight;
    const techRule = lang === 'zh' && np.sourceTechnical.ruleZh
      ? np.sourceTechnical.ruleZh
      : np.sourceTechnical.rule;

    lines.push(`### ${i + 1}. ${np.theme.toUpperCase()}`);
    lines.push(`*${lang === 'zh' ? '源于' : 'From'}: ${techRule}*`);
    lines.push('');
    lines.push(story);
    lines.push('');
    if (insight) {
      lines.push(`> ${insight}`);
      lines.push('');
    }
  });

  // Transitions
  if (bridge.transitions.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${lang === 'zh' ? '叙事转换' : 'Narrative Transitions'}`);
    lines.push('');
    bridge.transitions.forEach(t => {
      const trigger = lang === 'zh' && t.triggerZh ? t.triggerZh : t.trigger;
      lines.push(`- ${t.from} → ${t.to}: ${trigger}`);
    });
  }

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  translateTechnicalToNarrative,
  buildNarrativeBridge,
  getThemeForRule,
  getEmotionalToneForTheme,
  deriveStory,
  renderNarrativeBridgeMarkdown
};
