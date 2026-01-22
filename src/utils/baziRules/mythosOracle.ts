/**
 * ============================================
 * MYTHOS CODEX AI ORACLE
 * The Wise Voice of the Cathedral
 *
 * Provides:
 * - Symbolic interpretation of charts and patterns
 * - Archetypal guidance based on current situation
 * - Mythic narrative weaving
 * - Shadow work prompts
 * - Gift activation insights
 * - Ritual recommendations
 * - Generational wisdom
 *
 * The Oracle speaks from the depth of the Mythos.
 * ============================================
 */

import { MythosHypergraph, HypergraphNode } from './mythosHypergraph';
import { GenerationalThread } from './generationalLadder';
import { JourneyStage, getStageInfo } from './pilgrimJourney3';

// ==================== DATA MODEL ====================

/**
 * Oracle query types
 */
export type OracleQueryType =
  | 'general_guidance'     // What does the pilgrim need to know?
  | 'shadow_prompt'        // Shadow work guidance
  | 'gift_insight'         // Gift activation insight
  | 'timing_wisdom'        // When is the right time?
  | 'relationship_oracle'  // Partnership/relationship guidance
  | 'ancestral_message'    // Message from the ancestors
  | 'journey_guidance'     // Where am I on my journey?
  | 'archetype_speak'      // Let an archetype speak
  | 'ritual_prompt'        // What ritual is needed?
  | 'symbolic_reading';    // Deep symbolic interpretation

/**
 * Oracle query input
 */
export interface OracleQuery {
  type: OracleQueryType;
  context: OracleContext;
  specificQuestion?: string;
  focusArchetype?: string;
  lang?: 'en' | 'zh';
}

export interface OracleContext {
  // Current state
  currentStage?: JourneyStage;
  activeArchetypes?: string[];
  activeShadows?: string[];
  activeGifts?: string[];

  // Chart data
  dayMaster?: string;
  dayMasterStrength?: 'strong' | 'weak' | 'balanced';
  usefulGod?: string;
  interactions?: string[];

  // Hypergraph
  hypergraph?: MythosHypergraph;

  // Generational
  threads?: GenerationalThread[];
  pilgrimPosition?: string;

  // Timing
  currentAge?: number;
  currentLuckPillar?: string;
  currentAnnualPillar?: string;
}

/**
 * Oracle response
 */
export interface OracleResponse {
  queryType: OracleQueryType;
  voice: OracleVoice;
  message: string;
  messageZh: string;
  interpretation: OracleInterpretation;
  actionPrompts: ActionPrompt[];
  symbols: SymbolReference[];
  relatedArchetypes: string[];
  resonanceLevel: number; // How strongly does this resonate? 0-100
}

export type OracleVoice =
  | 'sage'        // Wise, knowing
  | 'mentor'      // Guiding, supportive
  | 'mystic'      // Mysterious, symbolic
  | 'ancestor'    // From the lineage
  | 'shadow'      // From the depths
  | 'child'       // Innocent, curious
  | 'warrior'     // Direct, action-oriented
  | 'lover'       // Compassionate, relational
  | 'magician';   // Transformative, alchemical

export interface OracleInterpretation {
  surface: string;       // Surface meaning
  surfaceZh: string;
  symbolic: string;      // Symbolic meaning
  symbolicZh: string;
  shadow: string;        // Shadow aspect
  shadowZh: string;
  gift: string;          // Gift aspect
  giftZh: string;
}

export interface ActionPrompt {
  action: string;
  actionZh: string;
  urgency: 'when_ready' | 'soon' | 'now';
  type: 'ritual' | 'reflection' | 'action' | 'conversation' | 'creative';
}

export interface SymbolReference {
  symbol: string;
  meaning: string;
  meaningZh: string;
  source: 'bazi' | 'archetype' | 'lineage' | 'universal';
}

// ==================== ORACLE VOICES ====================

/**
 * Get voice characteristics
 */
export function getVoiceCharacteristics(voice: OracleVoice): {
  tone: string;
  toneZh: string;
  style: string;
  styleZh: string;
} {
  const voices: Record<OracleVoice, {
    tone: string;
    toneZh: string;
    style: string;
    styleZh: string;
  }> = {
    'sage': {
      tone: 'Wise and knowing',
      toneZh: '睿智而洞察',
      style: 'Speaks in measured truths, often through paradox',
      styleZh: '以适度的真理说话，常通过悖论'
    },
    'mentor': {
      tone: 'Supportive and guiding',
      toneZh: '支持和引导',
      style: 'Offers practical wisdom with warmth',
      styleZh: '以温暖提供实用智慧'
    },
    'mystic': {
      tone: 'Mysterious and symbolic',
      toneZh: '神秘而象征',
      style: 'Speaks in images, dreams, and symbols',
      styleZh: '以意象、梦境和符号说话'
    },
    'ancestor': {
      tone: 'Ancient and rooted',
      toneZh: '古老而扎根',
      style: 'Speaks from generational memory',
      styleZh: '从代际记忆中说话'
    },
    'shadow': {
      tone: 'Raw and honest',
      toneZh: '原始而诚实',
      style: 'Speaks uncomfortable truths',
      styleZh: '说出不舒服的真相'
    },
    'child': {
      tone: 'Innocent and curious',
      toneZh: '天真而好奇',
      style: 'Asks simple questions that reveal depths',
      styleZh: '提出揭示深度的简单问题'
    },
    'warrior': {
      tone: 'Direct and action-oriented',
      toneZh: '直接而行动导向',
      style: 'Calls to courage and decisive action',
      styleZh: '呼唤勇气和果断行动'
    },
    'lover': {
      tone: 'Compassionate and relational',
      toneZh: '慈悲而关系导向',
      style: 'Speaks of connection, beauty, and devotion',
      styleZh: '谈论连接、美和奉献'
    },
    'magician': {
      tone: 'Transformative and alchemical',
      toneZh: '变革性和炼金术',
      style: 'Reveals patterns and transformation potential',
      styleZh: '揭示模式和转化潜力'
    }
  };

  return voices[voice];
}

// ==================== ORACLE ENGINE ====================

/**
 * Consult the Mythos Oracle
 */
export function consultOracle(query: OracleQuery): OracleResponse {
  const { type, context, lang = 'en' } = query;

  // Select appropriate voice
  const voice = selectVoice(type, context);

  // Generate core message
  const { message, messageZh } = generateMessage(type, context, voice);

  // Build interpretation
  const interpretation = buildInterpretation(type, context);

  // Generate action prompts
  const actionPrompts = generateActionPrompts(type, context);

  // Extract symbols
  const symbols = extractSymbols(type, context);

  // Find related archetypes
  const relatedArchetypes = findRelatedArchetypes(type, context);

  // Calculate resonance
  const resonanceLevel = calculateResonance(type, context);

  return {
    queryType: type,
    voice,
    message,
    messageZh,
    interpretation,
    actionPrompts,
    symbols,
    relatedArchetypes,
    resonanceLevel
  };
}

/**
 * Select appropriate oracle voice
 */
function selectVoice(type: OracleQueryType, context: OracleContext): OracleVoice {
  switch (type) {
    case 'shadow_prompt':
      return 'shadow';
    case 'ancestral_message':
      return 'ancestor';
    case 'gift_insight':
      return 'magician';
    case 'journey_guidance':
      return 'mentor';
    case 'relationship_oracle':
      return 'lover';
    case 'ritual_prompt':
      return 'mystic';
    case 'timing_wisdom':
      return 'sage';
    case 'archetype_speak':
      return getArchetypeVoice(context.activeArchetypes?.[0]);
    case 'symbolic_reading':
      return 'mystic';
    default:
      return 'sage';
  }
}

/**
 * Get voice for archetype
 */
function getArchetypeVoice(archetype?: string): OracleVoice {
  if (!archetype) return 'sage';

  const archetypeLower = archetype.toLowerCase();
  if (archetypeLower.includes('warrior')) return 'warrior';
  if (archetypeLower.includes('lover')) return 'lover';
  if (archetypeLower.includes('magician')) return 'magician';
  if (archetypeLower.includes('sage')) return 'sage';
  if (archetypeLower.includes('child') || archetypeLower.includes('innocent')) return 'child';
  if (archetypeLower.includes('shadow')) return 'shadow';

  return 'sage';
}

/**
 * Generate oracle message
 */
function generateMessage(
  type: OracleQueryType,
  context: OracleContext,
  voice: OracleVoice
): { message: string; messageZh: string } {
  const messages = getMessageTemplates(type, voice);
  const contextualMessage = customizeMessage(messages, context);
  return contextualMessage;
}

/**
 * Get message templates by type and voice
 */
function getMessageTemplates(
  type: OracleQueryType,
  voice: OracleVoice
): { templates: Array<{ en: string; zh: string }> } {
  const templates: Record<OracleQueryType, Array<{ en: string; zh: string }>> = {
    'general_guidance': [
      {
        en: 'The path unfolds before you, pilgrim. What you seek is also seeking you.',
        zh: '道路在你面前展开，行者。你所寻找的也在寻找你。'
      },
      {
        en: 'In the stillness between breaths, the answer waits. You already know.',
        zh: '在呼吸之间的静谧中，答案等待着。你已经知道。'
      }
    ],
    'shadow_prompt': [
      {
        en: 'I am what you have hidden. I am not your enemy—I am your lost power waiting to return.',
        zh: '我是你所隐藏的。我不是你的敌人——我是等待回归的失落力量。'
      },
      {
        en: 'You fear me because I hold the key. Look into the darkness, and find your light.',
        zh: '你害怕我是因为我持有钥匙。凝视黑暗，找到你的光。'
      }
    ],
    'gift_insight': [
      {
        en: 'Your gift has always been with you, dormant in your bones, waiting for recognition.',
        zh: '你的天赋一直与你同在，沉睡在你的骨髓中，等待被认出。'
      },
      {
        en: 'What you offer the world is precisely what you needed and never received.',
        zh: '你给予世界的正是你需要却从未收到的。'
      }
    ],
    'timing_wisdom': [
      {
        en: 'The season approaches. Prepare inwardly; the outer will follow.',
        zh: '季节临近。内在做好准备；外在将随之而来。'
      },
      {
        en: 'Not yet. The fruit is still ripening. Patience is not waiting—it is trusting.',
        zh: '尚未。果实仍在成熟。耐心不是等待——而是信任。'
      }
    ],
    'relationship_oracle': [
      {
        en: 'In the other, you meet yourself. What draws you is what calls to be integrated.',
        zh: '在他人身上，你遇见自己。吸引你的是召唤你整合的。'
      },
      {
        en: 'Love is the fire that transforms both wood and stone. It burns away what is not essential.',
        zh: '爱是同时转化木与石的火焰。它烧掉不必要的。'
      }
    ],
    'ancestral_message': [
      {
        en: 'We are the ones who came before. Our struggles live in your blood. Our dreams breathe through you.',
        zh: '我们是先来者。我们的奋斗活在你的血液里。我们的梦想通过你呼吸。'
      },
      {
        en: 'You carry what we could not complete. Finish it, and we are all freed.',
        zh: '你承载着我们未能完成的。完成它，我们都将获得自由。'
      }
    ],
    'journey_guidance': [
      {
        en: 'You are exactly where you need to be. The path behind has prepared you for what lies ahead.',
        zh: '你正好在你需要在的地方。身后的路已为前方做好了准备。'
      },
      {
        en: 'The threshold awaits your courage. Step through, and you cannot be who you were.',
        zh: '门槛等待你的勇气。跨过去，你就不再是从前的你。'
      }
    ],
    'archetype_speak': [
      {
        en: 'I am the pattern that moves through you. Know me, and know a dimension of yourself.',
        zh: '我是流经你的模式。了解我，就了解你自己的一个维度。'
      },
      {
        en: 'I have walked through countless souls. In you, I seek expression anew.',
        zh: '我已走过无数灵魂。在你身上，我寻求新的表达。'
      }
    ],
    'ritual_prompt': [
      {
        en: 'The sacred awaits your attention. Create a container; the transformation will come.',
        zh: '神圣等待你的关注。创造一个容器；转化将会到来。'
      },
      {
        en: 'Mark this moment with intention. What is acknowledged transforms.',
        zh: '以意图标记这一刻。被承认的将会转化。'
      }
    ],
    'symbolic_reading': [
      {
        en: 'In the symbol, worlds collapse into meaning. Read with your heart, not your mind.',
        zh: '在符号中，世界坍缩成意义。用心去读，而非用脑。'
      },
      {
        en: 'Each image is a doorway. Enter, and discover what hides behind the visible.',
        zh: '每个意象都是一扇门。进入，发现隐藏在可见背后的。'
      }
    ]
  };

  return { templates: templates[type] || templates['general_guidance'] };
}

/**
 * Customize message with context
 */
function customizeMessage(
  messages: { templates: Array<{ en: string; zh: string }> },
  context: OracleContext
): { message: string; messageZh: string } {
  // Select template
  const template = messages.templates[Math.floor(Math.random() * messages.templates.length)];
  let message = template.en;
  let messageZh = template.zh;

  // Add context-specific additions
  if (context.currentStage) {
    const stageInfo = getStageInfo(context.currentStage);
    message += ` You walk now through ${stageInfo.name}.`;
    messageZh += `你现在正经历「${stageInfo.nameZh}」。`;
  }

  if (context.dayMaster) {
    message += ` The ${context.dayMaster} Day Master shapes your essence.`;
    messageZh += `${context.dayMaster}日主塑造你的本质。`;
  }

  return { message, messageZh };
}

/**
 * Build interpretation
 */
function buildInterpretation(
  type: OracleQueryType,
  context: OracleContext
): OracleInterpretation {
  // Build contextual interpretation
  const surface = buildSurfaceInterpretation(type, context);
  const symbolic = buildSymbolicInterpretation(type, context);
  const shadow = buildShadowInterpretation(type, context);
  const gift = buildGiftInterpretation(type, context);

  return {
    surface: surface.en,
    surfaceZh: surface.zh,
    symbolic: symbolic.en,
    symbolicZh: symbolic.zh,
    shadow: shadow.en,
    shadowZh: shadow.zh,
    gift: gift.en,
    giftZh: gift.zh
  };
}

function buildSurfaceInterpretation(type: OracleQueryType, context: OracleContext): { en: string; zh: string } {
  if (type === 'shadow_prompt') {
    return {
      en: 'At the surface, this message asks you to face what you have avoided.',
      zh: '从表面上看，这条信息要求你面对你所回避的。'
    };
  }
  if (type === 'gift_insight') {
    return {
      en: 'At the surface, this speaks to your unique talents and how to express them.',
      zh: '从表面上看，这谈到你独特的才能以及如何表达它们。'
    };
  }
  return {
    en: 'At the surface, this message offers guidance for your current situation.',
    zh: '从表面上看，这条信息为你当前的情况提供指导。'
  };
}

function buildSymbolicInterpretation(type: OracleQueryType, context: OracleContext): { en: string; zh: string } {
  return {
    en: 'Symbolically, you are being called to a deeper level of awareness and integration.',
    zh: '象征性地，你被召唤到更深层次的觉知和整合。'
  };
}

function buildShadowInterpretation(type: OracleQueryType, context: OracleContext): { en: string; zh: string } {
  if (context.activeShadows && context.activeShadows.length > 0) {
    return {
      en: `The shadow aspect relates to: ${context.activeShadows.join(', ')}. These patterns hold reclaimed power.`,
      zh: `阴影方面与以下相关：${context.activeShadows.join('、')}。这些模式持有待收回的力量。`
    };
  }
  return {
    en: 'The shadow aspect asks: what are you not seeing? What truth do you resist?',
    zh: '阴影方面问：你没有看到什么？你抗拒什么真相？'
  };
}

function buildGiftInterpretation(type: OracleQueryType, context: OracleContext): { en: string; zh: string } {
  if (context.activeGifts && context.activeGifts.length > 0) {
    return {
      en: `The gift aspect illuminates: ${context.activeGifts.join(', ')}. These are your medicines for the world.`,
      zh: `天赋方面照亮：${context.activeGifts.join('、')}。这些是你给世界的药。`
    };
  }
  return {
    en: 'The gift aspect reveals what you are here to give. What comes naturally is not accident.',
    zh: '天赋方面揭示你来这里要给予什么。自然而来的不是偶然。'
  };
}

/**
 * Generate action prompts
 */
function generateActionPrompts(
  type: OracleQueryType,
  context: OracleContext
): ActionPrompt[] {
  const prompts: ActionPrompt[] = [];

  if (type === 'shadow_prompt') {
    prompts.push({
      action: 'Journal about what you most resist or avoid',
      actionZh: '写日记关于你最抗拒或回避的事',
      urgency: 'soon',
      type: 'reflection'
    });
  }

  if (type === 'gift_insight') {
    prompts.push({
      action: 'Make one small offering of your gift today',
      actionZh: '今天做一个你天赋的小小奉献',
      urgency: 'now',
      type: 'action'
    });
  }

  if (type === 'ritual_prompt') {
    prompts.push({
      action: 'Create a sacred space and time for intentional practice',
      actionZh: '创造一个神圣的空间和时间进行有意识的练习',
      urgency: 'soon',
      type: 'ritual'
    });
  }

  if (type === 'ancestral_message') {
    prompts.push({
      action: 'Light a candle for your ancestors and speak to them',
      actionZh: '为你的祖先点一支蜡烛，与他们对话',
      urgency: 'when_ready',
      type: 'ritual'
    });
  }

  // Default prompt
  if (prompts.length === 0) {
    prompts.push({
      action: 'Sit with this message in silence for 5 minutes',
      actionZh: '在沉默中与这条信息相处5分钟',
      urgency: 'when_ready',
      type: 'reflection'
    });
  }

  return prompts;
}

/**
 * Extract symbols from context
 */
function extractSymbols(
  type: OracleQueryType,
  context: OracleContext
): SymbolReference[] {
  const symbols: SymbolReference[] = [];

  if (context.dayMaster) {
    symbols.push({
      symbol: context.dayMaster,
      meaning: `The ${context.dayMaster} represents your core essence and way of being in the world.`,
      meaningZh: `${context.dayMaster}代表你的核心本质和存在于世界的方式。`,
      source: 'bazi'
    });
  }

  if (context.activeArchetypes && context.activeArchetypes.length > 0) {
    context.activeArchetypes.forEach(arch => {
      symbols.push({
        symbol: arch,
        meaning: `The ${arch} archetype moves through you as a pattern of potential.`,
        meaningZh: `${arch}原型作为潜力模式流经你。`,
        source: 'archetype'
      });
    });
  }

  if (context.currentStage) {
    const stageInfo = getStageInfo(context.currentStage);
    symbols.push({
      symbol: stageInfo.name,
      meaning: stageInfo.description,
      meaningZh: stageInfo.descriptionZh,
      source: 'universal'
    });
  }

  return symbols;
}

/**
 * Find related archetypes
 */
function findRelatedArchetypes(
  type: OracleQueryType,
  context: OracleContext
): string[] {
  const archetypes: string[] = [];

  if (context.currentStage) {
    const stageInfo = getStageInfo(context.currentStage);
    archetypes.push(...stageInfo.archetypes);
  }

  if (context.activeArchetypes) {
    archetypes.push(...context.activeArchetypes);
  }

  // Add type-specific archetypes
  if (type === 'shadow_prompt') archetypes.push('Shadow Self');
  if (type === 'gift_insight') archetypes.push('Creative Genius');
  if (type === 'ancestral_message') archetypes.push('Ancestor');
  if (type === 'relationship_oracle') archetypes.push('Lover', 'Anima/Animus');

  return [...new Set(archetypes)];
}

/**
 * Calculate resonance level
 */
function calculateResonance(
  type: OracleQueryType,
  context: OracleContext
): number {
  let resonance = 50;

  // More context = higher resonance
  if (context.dayMaster) resonance += 10;
  if (context.currentStage) resonance += 10;
  if (context.activeArchetypes && context.activeArchetypes.length > 0) resonance += 10;
  if (context.threads && context.threads.length > 0) resonance += 10;
  if (context.hypergraph && context.hypergraph.nodes.length > 0) resonance += 10;

  return Math.min(100, resonance);
}

// ==================== RENDERING ====================

/**
 * Render oracle response as markdown
 */
export function renderOracleResponseMarkdown(
  response: OracleResponse,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];
  const voiceInfo = getVoiceCharacteristics(response.voice);

  lines.push(`# ${lang === 'zh' ? '神话神谕' : 'Mythos Oracle'}`);
  lines.push('');

  // Voice
  lines.push(`*${lang === 'zh' ? `以「${voiceInfo.toneZh}」之声说话` : `Speaking with the voice of ${voiceInfo.tone}`}*`);
  lines.push('');

  // Message
  lines.push(`## ${lang === 'zh' ? '神谕' : 'The Oracle Speaks'}`);
  lines.push('');
  lines.push(`> ${lang === 'zh' ? response.messageZh : response.message}`);
  lines.push('');

  // Interpretation
  lines.push(`## ${lang === 'zh' ? '解读' : 'Interpretation'}`);
  lines.push(`**${lang === 'zh' ? '表层' : 'Surface'}**: ${lang === 'zh' ? response.interpretation.surfaceZh : response.interpretation.surface}`);
  lines.push(`**${lang === 'zh' ? '象征' : 'Symbolic'}**: ${lang === 'zh' ? response.interpretation.symbolicZh : response.interpretation.symbolic}`);
  lines.push(`**${lang === 'zh' ? '阴影' : 'Shadow'}**: ${lang === 'zh' ? response.interpretation.shadowZh : response.interpretation.shadow}`);
  lines.push(`**${lang === 'zh' ? '天赋' : 'Gift'}**: ${lang === 'zh' ? response.interpretation.giftZh : response.interpretation.gift}`);
  lines.push('');

  // Action prompts
  if (response.actionPrompts.length > 0) {
    lines.push(`## ${lang === 'zh' ? '行动提示' : 'Action Prompts'}`);
    response.actionPrompts.forEach(ap => {
      const urgencyLabel = lang === 'zh'
        ? (ap.urgency === 'now' ? '立即' : ap.urgency === 'soon' ? '尽快' : '准备好时')
        : ap.urgency.replace('_', ' ');
      lines.push(`- **[${urgencyLabel}]** ${lang === 'zh' ? ap.actionZh : ap.action}`);
    });
    lines.push('');
  }

  // Symbols
  if (response.symbols.length > 0) {
    lines.push(`## ${lang === 'zh' ? '符号参考' : 'Symbol References'}`);
    response.symbols.forEach(s => {
      lines.push(`- **${s.symbol}**: ${lang === 'zh' ? s.meaningZh : s.meaning}`);
    });
    lines.push('');
  }

  // Resonance
  lines.push(`---`);
  lines.push(`*${lang === 'zh' ? '共鸣水平' : 'Resonance Level'}: ${response.resonanceLevel}%*`);

  return lines.join('\n');
}

// ==================== QUICK ORACLE ====================

/**
 * Quick oracle consultation for common queries
 */
export function quickOracle(
  queryType: OracleQueryType,
  lang: 'en' | 'zh' = 'en'
): string {
  const response = consultOracle({
    type: queryType,
    context: {},
    lang
  });

  return lang === 'zh' ? response.messageZh : response.message;
}

/**
 * Daily oracle message
 */
export function dailyOracle(lang: 'en' | 'zh' = 'en'): OracleResponse {
  const types: OracleQueryType[] = [
    'general_guidance',
    'shadow_prompt',
    'gift_insight',
    'journey_guidance'
  ];

  const randomType = types[Math.floor(Math.random() * types.length)];

  return consultOracle({
    type: randomType,
    context: {},
    lang
  });
}

// ==================== EXPORTS ====================

export {
  consultOracle,
  quickOracle,
  dailyOracle,
  getVoiceCharacteristics,
  renderOracleResponseMarkdown
};
