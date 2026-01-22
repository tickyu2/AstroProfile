/**
 * ============================================
 * GUIDE MODE
 * Ever-Present Educational Layer
 *
 * Levels:
 * - Elementary: Just the concepts
 * - High School: Concepts + steps
 * - University: Full detail + examples + formulas
 *
 * No black boxes. Every number shown.
 * Every rule explained.
 * ============================================
 */

// ==================== DATA MODEL ====================

/**
 * Guide mode educational levels
 */
export type GuideLevel = 'elementary' | 'highschool' | 'university';

/**
 * Guide mode context
 */
export interface GuideContext {
  level: GuideLevel;
  showHints: boolean;
  showNumbers: boolean;
  showFormulas: boolean;
  lang: 'en' | 'zh';
}

/**
 * Explanation structure
 */
export interface Explanation {
  id: string;
  title: string;
  titleZh: string;
  category: ExplanationCategory;
  concept: string;
  conceptZh: string;
  formula?: string;
  steps: ExplanationStep[];
  examples?: ExplanationExample[];
  relatedConcepts?: string[];
}

export type ExplanationCategory =
  | 'pillars'
  | 'stems_branches'
  | 'interactions'
  | 'luck_pillars'
  | 'useful_god'
  | 'elements'
  | 'lineage'
  | 'mythos'
  | 'ritual';

export interface ExplanationStep {
  step: number;
  description: string;
  descriptionZh: string;
  formula?: string;
  example?: string;
}

export interface ExplanationExample {
  input: string;
  output: string;
  explanation: string;
  explanationZh: string;
}

/**
 * Explanation registry type
 */
export interface ExplanationRegistry {
  [key: string]: Explanation;
}

// ==================== EXPLANATION REGISTRY ====================

/**
 * The complete explanation database
 */
export const EXPLANATIONS: ExplanationRegistry = {
  // ========== PILLARS ==========
  'bazi_pillar': {
    id: 'bazi_pillar',
    title: 'What is a BaZi Pillar?',
    titleZh: '什么是八字柱？',
    category: 'pillars',
    concept: `
A BaZi chart has four "pillars": Year, Month, Day, Hour.
Each pillar is made of a Heavenly Stem (天干) and an Earthly Branch (地支).
Together, they encode time as energy.

The four pillars represent:
• Year Pillar: Ancestors, social context, early life
• Month Pillar: Parents, career, prime of life
• Day Pillar: Self and spouse, core identity
• Hour Pillar: Children, legacy, later life
    `.trim(),
    conceptZh: `
八字命盘有四根"柱"：年柱、月柱、日柱、时柱。
每根柱由一个天干和一个地支组成。
它们一起将时间编码为能量。

四柱代表：
• 年柱：祖先、社会背景、早年生活
• 月柱：父母、事业、人生鼎盛期
• 日柱：自我和配偶、核心身份
• 时柱：子女、遗产、晚年生活
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Take a date and time of birth.',
        descriptionZh: '获取出生日期和时间。'
      },
      {
        step: 2,
        description: 'Convert it to the Chinese calendar (year, month, day, hour).',
        descriptionZh: '将其转换为中国农历（年、月、日、时）。'
      },
      {
        step: 3,
        description: 'For each, look up its Heavenly Stem from the 10-Stem cycle.',
        descriptionZh: '对于每个，从十天干周期中查找其天干。'
      },
      {
        step: 4,
        description: 'For each, look up its Earthly Branch from the 12-Branch cycle.',
        descriptionZh: '对于每个，从十二地支周期中查找其地支。'
      },
      {
        step: 5,
        description: 'Combine them: Stem + Branch = Pillar.',
        descriptionZh: '组合：天干 + 地支 = 柱。'
      }
    ],
    examples: [
      {
        input: '1990-05-12 14:00',
        output: 'Year: 庚午, Month: 辛巳, Day: 壬申, Hour: 丁未',
        explanation: 'Each pillar combines a stem (e.g., 庚/Geng) with a branch (e.g., 午/Wu).',
        explanationZh: '每根柱将一个天干（如庚）与一个地支（如午）组合。'
      }
    ],
    relatedConcepts: ['heavenly_stems', 'earthly_branches', 'day_master']
  },

  'day_master': {
    id: 'day_master',
    title: 'What is the Day Master?',
    titleZh: '什么是日主？',
    category: 'pillars',
    concept: `
The Day Master (日主) is the Heavenly Stem of your Day Pillar.
It represents your core self—your essence, personality, and way of being.

The 10 Day Masters and their elements:
• 甲 (Jia) / 乙 (Yi) = Wood
• 丙 (Bing) / 丁 (Ding) = Fire
• 戊 (Wu) / 己 (Ji) = Earth
• 庚 (Geng) / 辛 (Xin) = Metal
• 壬 (Ren) / 癸 (Gui) = Water
    `.trim(),
    conceptZh: `
日主是你日柱的天干。
它代表你的核心自我——你的本质、性格和存在方式。

十个日主及其元素：
• 甲 / 乙 = 木
• 丙 / 丁 = 火
• 戊 / 己 = 土
• 庚 / 辛 = 金
• 壬 / 癸 = 水
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Find the Day Pillar from the chart.',
        descriptionZh: '从命盘中找到日柱。'
      },
      {
        step: 2,
        description: 'Extract the Heavenly Stem (the first character).',
        descriptionZh: '提取天干（第一个字）。'
      },
      {
        step: 3,
        description: 'This is your Day Master.',
        descriptionZh: '这就是你的日主。'
      }
    ],
    relatedConcepts: ['bazi_pillar', 'heavenly_stems', 'day_master_strength']
  },

  // ========== INTERACTIONS ==========
  'interaction_clash': {
    id: 'interaction_clash',
    title: 'What is a Clash (冲)?',
    titleZh: '什么是冲？',
    category: 'interactions',
    concept: `
A Clash (冲) is when two Earthly Branches oppose each other in the cycle.
It represents tension, movement, disruption, or change.

The 6 Clash pairs:
• 子 (Zi) ↔ 午 (Wu) — Rat vs Horse
• 丑 (Chou) ↔ 未 (Wei) — Ox vs Goat
• 寅 (Yin) ↔ 申 (Shen) — Tiger vs Monkey
• 卯 (Mao) ↔ 酉 (You) — Rabbit vs Rooster
• 辰 (Chen) ↔ 戌 (Xu) — Dragon vs Dog
• 巳 (Si) ↔ 亥 (Hai) — Snake vs Pig

Clashes can indicate:
• Internal conflict (within the chart)
• Life transitions (with Luck Pillars)
• Challenging years (with Annual Pillars)
    `.trim(),
    conceptZh: `
冲是当两个地支在周期中相对时发生的。
它代表张力、移动、扰动或变化。

六组冲：
• 子 ↔ 午 — 鼠 vs 马
• 丑 ↔ 未 — 牛 vs 羊
• 寅 ↔ 申 — 虎 vs 猴
• 卯 ↔ 酉 — 兔 vs 鸡
• 辰 ↔ 戌 — 龙 vs 狗
• 巳 ↔ 亥 — 蛇 vs 猪

冲可以表示：
• 内部冲突（在命盘内）
• 人生转变（与大运）
• 挑战性的年份（与流年）
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'List the 12 Earthly Branches in a circle.',
        descriptionZh: '将12地支列成一个圆圈。'
      },
      {
        step: 2,
        description: 'Pairs that sit directly opposite each other are Clash pairs.',
        descriptionZh: '直接相对的配对是冲对。'
      },
      {
        step: 3,
        description: 'Check if any two pillars in the chart contain a Clash pair.',
        descriptionZh: '检查命盘中是否有两根柱包含冲对。'
      }
    ],
    examples: [
      {
        input: 'Day Branch: 子 (Zi), Year Branch: 午 (Wu)',
        output: 'Clash detected: 子午冲',
        explanation: 'Zi and Wu sit opposite in the cycle, forming a clash.',
        explanationZh: '子和午在周期中相对，形成冲。'
      }
    ],
    relatedConcepts: ['interaction_combination', 'interaction_harm', 'earthly_branches']
  },

  'interaction_combination': {
    id: 'interaction_combination',
    title: 'What is a Combination (合)?',
    titleZh: '什么是合？',
    category: 'interactions',
    concept: `
A Combination (合) is when two Earthly Branches harmonize.
It represents support, alliance, attraction, or transformation.

The 6 Branch Combinations (六合):
• 子 + 丑 → Earth
• 寅 + 亥 → Wood
• 卯 + 戌 → Fire
• 辰 + 酉 → Metal
• 巳 + 申 → Water
• 午 + 未 → Fire/Earth

Combinations can indicate:
• Natural alliances
• Attractions or relationships
• Elemental transformations
    `.trim(),
    conceptZh: `
合是当两个地支和谐时发生的。
它代表支持、联盟、吸引或转化。

六合：
• 子 + 丑 → 土
• 寅 + 亥 → 木
• 卯 + 戌 → 火
• 辰 + 酉 → 金
• 巳 + 申 → 水
• 午 + 未 → 火/土

合可以表示：
• 自然联盟
• 吸引或关系
• 元素转化
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Check if any two branches in the chart form one of the 6 combination pairs.',
        descriptionZh: '检查命盘中是否有两个地支形成六合之一。'
      },
      {
        step: 2,
        description: 'If yes, note the resulting element (if transformation occurs).',
        descriptionZh: '如果是，注意结果元素（如果发生转化）。'
      }
    ],
    relatedConcepts: ['interaction_clash', 'three_harmonies', 'earthly_branches']
  },

  'interaction_harm': {
    id: 'interaction_harm',
    title: 'What is a Harm (害)?',
    titleZh: '什么是害？',
    category: 'interactions',
    concept: `
A Harm (害) is a subtle form of conflict between two branches.
It represents hidden damage, betrayal, or gradual erosion.

The 6 Harm pairs:
• 子 ↔ 未 — Rat harms Goat
• 丑 ↔ 午 — Ox harms Horse
• 寅 ↔ 巳 — Tiger harms Snake
• 卯 ↔ 辰 — Rabbit harms Dragon
• 申 ↔ 亥 — Monkey harms Pig
• 酉 ↔ 戌 — Rooster harms Dog

Harm is less obvious than Clash but can be more insidious.
    `.trim(),
    conceptZh: `
害是两个地支之间的一种微妙冲突形式。
它代表隐藏的损害、背叛或逐渐侵蚀。

六害：
• 子 ↔ 未 — 鼠害羊
• 丑 ↔ 午 — 牛害马
• 寅 ↔ 巳 — 虎害蛇
• 卯 ↔ 辰 — 兔害龙
• 申 ↔ 亥 — 猴害猪
• 酉 ↔ 戌 — 鸡害狗

害不如冲明显，但可能更阴险。
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Check if any two branches form one of the 6 harm pairs.',
        descriptionZh: '检查是否有两个地支形成六害之一。'
      }
    ],
    relatedConcepts: ['interaction_clash', 'interaction_punishment', 'earthly_branches']
  },

  // ========== LUCK PILLARS ==========
  'luck_pillar_calc': {
    id: 'luck_pillar_calc',
    title: 'How are Luck Pillars calculated?',
    titleZh: '大运如何计算？',
    category: 'luck_pillars',
    concept: `
Luck Pillars (大运) are 10-year blocks that govern major life themes.
They are derived from the Month Pillar and flow in a direction
determined by gender and Day Master polarity.

Each Luck Pillar brings its own stem-branch energy,
which interacts with the natal chart to create opportunities and challenges.
    `.trim(),
    conceptZh: `
大运是支配主要人生主题的10年区块。
它们源自月柱，流动方向由性别和日主极性决定。

每个大运带来自己的干支能量，
与命盘互动，创造机会和挑战。
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Determine if the Day Master is Yang (甲丙戊庚壬) or Yin (乙丁己辛癸).',
        descriptionZh: '确定日主是阳干（甲丙戊庚壬）还是阴干（乙丁己辛癸）。'
      },
      {
        step: 2,
        description: 'Determine gender (male or female).',
        descriptionZh: '确定性别（男或女）。'
      },
      {
        step: 3,
        description: 'If Yang Male or Yin Female: count forward from Month Pillar.',
        descriptionZh: '如果是阳男或阴女：从月柱向前数。'
      },
      {
        step: 4,
        description: 'If Yin Male or Yang Female: count backward from Month Pillar.',
        descriptionZh: '如果是阴男或阳女：从月柱向后数。'
      },
      {
        step: 5,
        description: 'Calculate start age based on distance to next solar term.',
        descriptionZh: '根据到下一个节气的距离计算起运年龄。'
      },
      {
        step: 6,
        description: 'Each Luck Pillar lasts 10 years.',
        descriptionZh: '每个大运持续10年。'
      }
    ],
    formula: 'Direction = (Yang + Male) or (Yin + Female) → Forward; else → Backward',
    relatedConcepts: ['day_master', 'bazi_pillar', 'annual_pillar']
  },

  // ========== USEFUL GOD ==========
  'useful_god': {
    id: 'useful_god',
    title: 'What is the Useful God (用神)?',
    titleZh: '什么是用神？',
    category: 'useful_god',
    concept: `
The Useful God (用神) is the element that most benefits the Day Master.
It is determined by analyzing the chart's balance:

• If the Day Master is too strong: weaken it (use controlling/draining elements)
• If the Day Master is too weak: strengthen it (use supporting/producing elements)
• If balanced: use elements that maintain harmony

The Useful God guides:
• Career choices
• Favorable directions
• Optimal timing
• Relationship compatibility
    `.trim(),
    conceptZh: `
用神是最有利于日主的元素。
它通过分析命盘的平衡来确定：

• 如果日主太强：削弱它（使用克/泄的元素）
• 如果日主太弱：加强它（使用生/扶的元素）
• 如果平衡：使用维持和谐的元素

用神指导：
• 职业选择
• 有利方向
• 最佳时机
• 关系兼容性
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Calculate Day Master strength by counting supporting vs. opposing elements.',
        descriptionZh: '通过计算支持与对立元素来计算日主强度。'
      },
      {
        step: 2,
        description: 'If Day Master is strong, Useful God is the controlling or draining element.',
        descriptionZh: '如果日主强，用神是克或泄的元素。'
      },
      {
        step: 3,
        description: 'If Day Master is weak, Useful God is the producing or supporting element.',
        descriptionZh: '如果日主弱，用神是生或扶的元素。'
      }
    ],
    relatedConcepts: ['day_master', 'day_master_strength', 'annoying_god']
  },

  // ========== LINEAGE ==========
  'lineage_thread': {
    id: 'lineage_thread',
    title: 'What is a Generational Thread?',
    titleZh: '什么是代际线索？',
    category: 'lineage',
    concept: `
A Generational Thread is a recurring theme or pattern
that runs through multiple generations of a family.

Examples:
• A thread of "abandonment" appearing as absent fathers across generations
• A thread of "artistic talent" manifesting in each generation differently
• A thread of "financial struggle" tied to specific BaZi patterns

Threads can be:
• Inherited (passed down unchanged)
• Transformed (consciously changed)
• Resolved (completed and released)
• Dormant (present but inactive)
    `.trim(),
    conceptZh: `
代际线索是贯穿一个家族多代人的反复主题或模式。

例子：
• "遗弃"线索表现为几代人中缺席的父亲
• "艺术天赋"线索在每一代以不同方式显现
• "财务困难"线索与特定八字模式相关

线索可以是：
• 继承的（未改变地传递）
• 转化的（有意识地改变）
• 解决的（完成并释放）
• 休眠的（存在但不活跃）
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Identify recurring themes in family history.',
        descriptionZh: '识别家族历史中反复出现的主题。'
      },
      {
        step: 2,
        description: 'Map these themes to BaZi patterns (interactions, elements, etc.).',
        descriptionZh: '将这些主题映射到八字模式（交互、元素等）。'
      },
      {
        step: 3,
        description: 'Track how the thread manifests across generations.',
        descriptionZh: '追踪线索如何在几代人中显现。'
      }
    ],
    relatedConcepts: ['generational_ladder', 'ancestral_debt', 'ancestral_gift']
  },

  // ========== MYTHOS ==========
  'archetype': {
    id: 'archetype',
    title: 'What is an Archetype?',
    titleZh: '什么是原型？',
    category: 'mythos',
    concept: `
An Archetype (原型) is a universal pattern of human experience,
identified by Carl Jung in depth psychology.

In the Cathedral, we map BaZi patterns to 12 core archetypes:

• Warrior — courage, protection, action
• Healer — compassion, restoration, nurturing
• Seeker — curiosity, exploration, truth
• Sage — wisdom, knowledge, teaching
• Magician — transformation, alchemy, power
• Lover — passion, beauty, connection
• Ruler — leadership, order, responsibility
• Creator — imagination, innovation, expression
• Caregiver — service, generosity, support
• Trickster — humor, disruption, perspective
• Orphan — resilience, belonging, acceptance
• Innocent — hope, faith, optimism

Each archetype has a shadow (dark expression) and a gift (light expression).
    `.trim(),
    conceptZh: `
原型是人类经验的普遍模式，
由卡尔·荣格在深度心理学中识别。

在大教堂中，我们将八字模式映射到12个核心原型：

• 战士 — 勇气、保护、行动
• 疗愈者 — 慈悲、恢复、滋养
• 寻觅者 — 好奇、探索、真理
• 智者 — 智慧、知识、教导
• 魔术师 — 转化、炼金术、力量
• 恋人 — 热情、美、连接
• 统治者 — 领导力、秩序、责任
• 创造者 — 想象力、创新、表达
• 照顾者 — 服务、慷慨、支持
• 骗子 — 幽默、破坏、视角
• 孤儿 — 韧性、归属、接纳
• 纯真者 — 希望、信仰、乐观

每个原型都有阴影（黑暗表达）和天赋（光明表达）。
    `.trim(),
    steps: [
      {
        step: 1,
        description: 'Analyze the chart\'s dominant elements and interactions.',
        descriptionZh: '分析命盘的主导元素和交互。'
      },
      {
        step: 2,
        description: 'Map these patterns to corresponding archetypes.',
        descriptionZh: '将这些模式映射到相应的原型。'
      },
      {
        step: 3,
        description: 'Identify shadows (unconscious patterns) and gifts (latent talents).',
        descriptionZh: '识别阴影（无意识模式）和天赋（潜在才能）。'
      }
    ],
    relatedConcepts: ['shadow', 'gift', 'hero_journey']
  }
};

// ==================== GUIDE MODE CONTROLLER ====================

/**
 * Guide Mode Controller
 */
export class GuideModeController {
  private context: GuideContext;

  constructor(initialLevel: GuideLevel = 'elementary', lang: 'en' | 'zh' = 'en') {
    this.context = {
      level: initialLevel,
      showHints: true,
      showNumbers: true,
      showFormulas: false,
      lang
    };
  }

  /**
   * Get current context
   */
  getContext(): GuideContext {
    return { ...this.context };
  }

  /**
   * Set educational level
   */
  setLevel(level: GuideLevel): void {
    this.context.level = level;
    // Auto-adjust settings based on level
    if (level === 'elementary') {
      this.context.showFormulas = false;
    } else if (level === 'university') {
      this.context.showFormulas = true;
    }
  }

  /**
   * Set language
   */
  setLang(lang: 'en' | 'zh'): void {
    this.context.lang = lang;
  }

  /**
   * Toggle hints
   */
  toggleHints(): void {
    this.context.showHints = !this.context.showHints;
  }

  /**
   * Toggle numbers
   */
  toggleNumbers(): void {
    this.context.showNumbers = !this.context.showNumbers;
  }

  /**
   * Toggle formulas
   */
  toggleFormulas(): void {
    this.context.showFormulas = !this.context.showFormulas;
  }

  /**
   * Get explanation by ID
   */
  explain(id: string): Explanation | null {
    return EXPLANATIONS[id] ?? null;
  }

  /**
   * Get all explanations for a category
   */
  getExplanationsForCategory(category: ExplanationCategory): Explanation[] {
    return Object.values(EXPLANATIONS).filter(e => e.category === category);
  }

  /**
   * Format explanation based on current level
   */
  formatExplanation(exp: Explanation): string {
    if (!exp) return '';

    const { level, lang, showFormulas } = this.context;
    const title = lang === 'zh' ? exp.titleZh : exp.title;
    const concept = lang === 'zh' ? exp.conceptZh : exp.concept;
    const lines: string[] = [];

    lines.push(`## ${title}`);
    lines.push('');
    lines.push(concept);

    if (level === 'elementary') {
      // Just the concept
      return lines.join('\n');
    }

    // High school and university: add steps
    lines.push('');
    lines.push(lang === 'zh' ? '### 步骤' : '### Steps');
    exp.steps.forEach(s => {
      const desc = lang === 'zh' ? s.descriptionZh : s.description;
      lines.push(`${s.step}. ${desc}`);
    });

    if (level === 'highschool') {
      return lines.join('\n');
    }

    // University: add formula and examples
    if (showFormulas && exp.formula) {
      lines.push('');
      lines.push(lang === 'zh' ? '### 公式' : '### Formula');
      lines.push(`\`${exp.formula}\``);
    }

    if (exp.examples && exp.examples.length > 0) {
      lines.push('');
      lines.push(lang === 'zh' ? '### 示例' : '### Examples');
      exp.examples.forEach(ex => {
        lines.push(`- **Input**: ${ex.input}`);
        lines.push(`  **Output**: ${ex.output}`);
        lines.push(`  ${lang === 'zh' ? ex.explanationZh : ex.explanation}`);
      });
    }

    if (exp.relatedConcepts && exp.relatedConcepts.length > 0) {
      lines.push('');
      lines.push(lang === 'zh' ? '### 相关概念' : '### Related Concepts');
      lines.push(exp.relatedConcepts.join(', '));
    }

    return lines.join('\n');
  }

  /**
   * Get hint for a step (level-aware)
   */
  getHint(exp: Explanation, stepIndex: number): string | null {
    if (!this.context.showHints) return null;
    const step = exp.steps[stepIndex];
    if (!step) return null;

    return this.context.lang === 'zh' ? step.descriptionZh : step.description;
  }
}

// ==================== FACTORY ====================

/**
 * Create a Guide Mode Controller
 */
export function createGuideModeController(
  level: GuideLevel = 'elementary',
  lang: 'en' | 'zh' = 'en'
): GuideModeController {
  return new GuideModeController(level, lang);
}

// ==================== EXPORTS ====================

export {
  GuideModeController,
  createGuideModeController,
  EXPLANATIONS
};
