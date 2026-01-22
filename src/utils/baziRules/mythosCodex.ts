/**
 * ============================================
 * MYTHOS CODEX
 * The scripture of ancestral archetypes
 *
 * Each archetype becomes a Codex Page —
 * a sacred text describing the mythic pattern
 * that flows through the lineage.
 * ============================================
 */

import { AncestralArchetype, ARCHETYPE_LIBRARY, MythosProfile } from './mythosLayer';

// ==================== DATA MODEL ====================

export interface MythosCodexPage {
  id: string;
  archetypeId: string;
  name: string;
  nameZh: string;
  themes: string[];
  shadow: string[];
  shadowZh: string[];
  gifts: string[];
  giftsZh: string[];
  element?: string;
  lineageEvidence: string[];
  personaVoice: string;
  personaVoiceZh: string;
  scripture: CodexScripture;
  ritualGuidance: RitualGuidance;
  shadowWork: ShadowWorkGuidance;
  integration: IntegrationPractice;
}

export interface CodexScripture {
  title: string;
  titleZh: string;
  verses: string[];
  versesZh: string[];
  blessing: string;
  blessingZh: string;
}

export interface RitualGuidance {
  focus: string;
  focusZh: string;
  elements: string[];
  elementsZh: string[];
  timing: string;
  timingZh: string;
  invocation: string;
  invocationZh: string;
}

export interface ShadowWorkGuidance {
  patterns: string[];
  patternsZh: string[];
  questions: string[];
  questionsZh: string[];
  transmutation: string;
  transmutationZh: string;
}

export interface IntegrationPractice {
  daily: string;
  dailyZh: string;
  weekly: string;
  weeklyZh: string;
  seasonal: string;
  seasonalZh: string;
}

export interface MythosCodex {
  id: string;
  title: string;
  titleZh: string;
  pages: MythosCodexPage[];
  introduction: string;
  introductionZh: string;
  blessing: string;
  blessingZh: string;
}

// ==================== SCRIPTURE TEMPLATES ====================

const SCRIPTURE_TEMPLATES: Record<string, Omit<CodexScripture, 'title' | 'titleZh'>> = {
  wanderer: {
    verses: [
      'In the beginning, your ancestors walked toward distant horizons.',
      'They carried nothing but hope and the courage to seek.',
      'Through deserts and oceans, mountains and valleys, they moved.',
      'Each step was a prayer. Each mile was a transformation.',
      'Now their journey continues in you.'
    ],
    versesZh: [
      '起初，你的祖先向着遥远的地平线行走。',
      '他们只携带着希望和寻找的勇气。',
      '穿越沙漠和海洋，山脉和峡谷，他们前行。',
      '每一步都是祈祷。每一里都是转化。',
      '现在他们的旅程在你身上继续。'
    ],
    blessing: 'May you find home in every step, and may the wind that moved your ancestors carry you forward.',
    blessingZh: '愿你在每一步中找到家园，愿曾推动你祖先的风带你向前。'
  },
  healer: {
    verses: [
      'Your ancestors carried medicine in their hands.',
      'Where there was pain, they brought soothing. Where there was wound, they brought balm.',
      'Generation after generation, the gift passed from hand to hand.',
      'The same healing light now flows through your fingers.',
      'You are the continuation of ancient care.'
    ],
    versesZh: [
      '你的祖先双手中承载着医药。',
      '哪里有痛苦，他们带来抚慰。哪里有伤口，他们带来药膏。',
      '一代又一代，礼物从手到手传递。',
      '同样的疗愈之光现在流过你的手指。',
      '你是古老关怀的延续。'
    ],
    blessing: 'May your hands heal without depleting, and may the medicine of your ancestors flow abundantly.',
    blessingZh: '愿你的双手疗愈而不耗竭，愿祖先的医药丰盛地流淌。'
  },
  warrior: {
    verses: [
      'Your bloodline knows the weight of responsibility.',
      'They stood at gates, protecting what mattered most.',
      'The battles they fought were not always with swords.',
      'Courage took many forms: speaking truth, holding boundaries, standing firm.',
      'That same strength now rises in you.'
    ],
    versesZh: [
      '你的血脉知道责任的分量。',
      '他们站在门口，守护最重要的事物。',
      '他们打的仗并不总是用剑。',
      '勇气有很多形式：说真话，守住边界，站稳。',
      '同样的力量现在在你身上升起。'
    ],
    blessing: 'May your strength protect without harming, and may the courage of your ancestors guide your stand.',
    blessingZh: '愿你的力量守护而不伤害，愿祖先的勇气引导你的立场。'
  },
  scholar: {
    verses: [
      'Your ancestors turned pages that still whisper through time.',
      'They sought understanding in a world of mystery.',
      'Knowledge was their torch against the darkness of ignorance.',
      'The questions they asked echo in your own seeking.',
      'You continue the ancient pursuit of wisdom.'
    ],
    versesZh: [
      '你的祖先翻阅的书页至今仍在时间中低语。',
      '他们在神秘的世界中寻求理解。',
      '知识是他们对抗无知黑暗的火炬。',
      '他们问的问题在你自己的寻求中回响。',
      '你延续着古老的智慧追求。'
    ],
    blessing: 'May wisdom ground itself in your body, and may the insights of your ancestors illuminate your path.',
    blessingZh: '愿智慧在你的身体中扎根，愿祖先的洞见照亮你的道路。'
  },
  'bridge-builder': {
    verses: [
      'Your ancestors built bridges across impossible divides.',
      'Where others saw separation, they saw potential for connection.',
      'Their gift was understanding: seeing both sides, holding both truths.',
      'The peace they cultivated lives on in your ability to unite.',
      'You are the continuation of their sacred work.'
    ],
    versesZh: [
      '你的祖先在不可能的鸿沟上架起桥梁。',
      '当别人看到分离时，他们看到了连接的可能。',
      '他们的礼物是理解：看到双方，持有双方的真相。',
      '他们培育的和平活在你团结的能力中。',
      '你是他们神圣工作的延续。'
    ],
    blessing: 'May you bridge without losing yourself, and may the harmony of your ancestors flow through your connections.',
    blessingZh: '愿你架桥而不失去自己，愿祖先的和谐流过你的连接。'
  },
  'keeper-fire': {
    verses: [
      'Your ancestors tended sacred flames that burned through generations.',
      'Fire was their medicine: transformation, passion, creation.',
      'What they set ablaze illuminated the darkness for those who followed.',
      'The same fire now burns in your heart.',
      'Guard it well. Let it warm without consuming.'
    ],
    versesZh: [
      '你的祖先守护着燃烧了几代人的神圣火焰。',
      '火是他们的医药：转化、热情、创造。',
      '他们点燃的照亮了后来者的黑暗。',
      '同样的火现在在你心中燃烧。',
      '好好守护它。让它温暖而不吞噬。'
    ],
    blessing: 'May your fire transform without destroying, and may the passion of your ancestors fuel your creation.',
    blessingZh: '愿你的火转化而不毁灭，愿祖先的热情为你的创造加燃料。'
  },
  'keeper-water': {
    verses: [
      'Your bloodline runs deep like ancient rivers.',
      'Your ancestors knew the wisdom of flow: when to yield, when to persist.',
      'Emotion was their compass, intuition their guide.',
      'The same waters of knowing move through you.',
      'Feel deeply. Trust the current.'
    ],
    versesZh: [
      '你的血脉如古老的河流般深邃。',
      '你的祖先知道流动的智慧：何时让步，何时坚持。',
      '情感是他们的指南针，直觉是他们的向导。',
      '同样认知的水流过你。',
      '深深地感受。信任水流。'
    ],
    blessing: 'May you feel without drowning, and may the intuition of your ancestors guide your depths.',
    blessingZh: '愿你感受而不溺水，愿祖先的直觉引导你的深度。'
  },
  'keeper-roots': {
    verses: [
      'Your ancestors sank roots that still hold firm.',
      'They understood: to grow tall, you must first grow deep.',
      'Stability was their gift, tradition their treasure.',
      'The same grounding flows through your bones.',
      'Stand firm. Remember where you come from.'
    ],
    versesZh: [
      '你的祖先扎下的根至今仍牢固。',
      '他们理解：要长得高，必须先扎得深。',
      '稳定是他们的礼物，传统是他们的珍宝。',
      '同样的扎根流过你的骨骼。',
      '站稳。记住你从哪里来。'
    ],
    blessing: 'May you stand firm without becoming rigid, and may the stability of your ancestors ground your growth.',
    blessingZh: '愿你站稳而不僵化，愿祖先的稳定为你的成长扎根。'
  },
  'keeper-sky': {
    verses: [
      'Your ancestors gazed upward, reaching for the infinite.',
      'They knew there was more than what the eye could see.',
      'Faith was their wings, vision their compass.',
      'The same starlight that guided them shines in you.',
      'Look up. Dream. Believe.'
    ],
    versesZh: [
      '你的祖先仰望天空，伸向无限。',
      '他们知道有比眼睛能看到的更多。',
      '信仰是他们的翅膀，愿景是他们的指南针。',
      '曾引导他们的同一道星光在你身上闪耀。',
      '仰望。梦想。相信。'
    ],
    blessing: 'May your vision remain grounded in service, and may the faith of your ancestors light your way.',
    blessingZh: '愿你的愿景扎根于服务，愿祖先的信仰照亮你的道路。'
  }
};

// ==================== CODEX BUILDER ====================

/**
 * Build a codex page for an archetype
 */
export function buildCodexPage(archetype: AncestralArchetype): MythosCodexPage {
  const scriptureTemplate = SCRIPTURE_TEMPLATES[archetype.id] || SCRIPTURE_TEMPLATES['wanderer'];

  return {
    id: `codex-${archetype.id}`,
    archetypeId: archetype.id,
    name: archetype.name,
    nameZh: archetype.nameZh,
    themes: archetype.themes,
    shadow: archetype.shadow,
    shadowZh: archetype.shadowZh,
    gifts: archetype.gifts,
    giftsZh: archetype.giftsZh,
    element: archetype.element,
    lineageEvidence: archetype.lineageEvidence,
    personaVoice: archetype.personaVoice,
    personaVoiceZh: archetype.personaVoiceZh,
    scripture: {
      title: `The Scripture of ${archetype.name}`,
      titleZh: `${archetype.nameZh}的经文`,
      ...scriptureTemplate
    },
    ritualGuidance: buildRitualGuidance(archetype),
    shadowWork: buildShadowWorkGuidance(archetype),
    integration: buildIntegrationPractice(archetype)
  };
}

/**
 * Build ritual guidance for an archetype
 */
function buildRitualGuidance(archetype: AncestralArchetype): RitualGuidance {
  const elementMap: Record<string, { elements: string[]; elementsZh: string[]; timing: string; timingZh: string }> = {
    Wood: { elements: ['Plants', 'Green cloth', 'Growth symbols'], elementsZh: ['植物', '绿色布料', '生长的象征'], timing: 'Spring, dawn', timingZh: '春季，黎明' },
    Fire: { elements: ['Candles', 'Red cloth', 'Transformation symbols'], elementsZh: ['蜡烛', '红色布料', '转化的象征'], timing: 'Summer, noon', timingZh: '夏季，正午' },
    Earth: { elements: ['Stones', 'Yellow cloth', 'Stability symbols'], elementsZh: ['石头', '黄色布料', '稳定的象征'], timing: 'Transitions, afternoon', timingZh: '季节交替，下午' },
    Metal: { elements: ['Metal objects', 'White cloth', 'Clarity symbols'], elementsZh: ['金属物品', '白色布料', '清明的象征'], timing: 'Autumn, evening', timingZh: '秋季，傍晚' },
    Water: { elements: ['Water bowl', 'Black cloth', 'Flow symbols'], elementsZh: ['水碗', '黑色布料', '流动的象征'], timing: 'Winter, night', timingZh: '冬季，夜晚' }
  };

  const elementGuide = elementMap[archetype.element || 'Earth'];

  return {
    focus: archetype.ritualFocus,
    focusZh: archetype.ritualFocusZh,
    elements: elementGuide.elements,
    elementsZh: elementGuide.elementsZh,
    timing: elementGuide.timing,
    timingZh: elementGuide.timingZh,
    invocation: `I call upon ${archetype.name}. May the gifts of ${archetype.gifts.slice(0, 2).join(' and ')} flow through me.`,
    invocationZh: `我呼唤${archetype.nameZh}。愿${archetype.giftsZh.slice(0, 2).join('与')}的礼物流过我。`
  };
}

/**
 * Build shadow work guidance for an archetype
 */
function buildShadowWorkGuidance(archetype: AncestralArchetype): ShadowWorkGuidance {
  return {
    patterns: archetype.shadow,
    patternsZh: archetype.shadowZh,
    questions: [
      `How does ${archetype.shadow[0]} show up in your life?`,
      `What triggers the shadow of ${archetype.name} in you?`,
      `How did your ancestors experience this shadow pattern?`
    ],
    questionsZh: [
      `${archetype.shadowZh[0]}如何在你的生活中出现？`,
      `什么触发了你身上${archetype.nameZh}的阴影？`,
      `你的祖先如何经历这个阴影模式？`
    ],
    transmutation: `The shadow of ${archetype.shadow[0]} can transform into the gift of ${archetype.gifts[0]} through conscious witnessing and integration.`,
    transmutationZh: `${archetype.shadowZh[0]}的阴影可以通过有意识的见证和整合转化为${archetype.giftsZh[0]}的礼物。`
  };
}

/**
 * Build integration practice for an archetype
 */
function buildIntegrationPractice(archetype: AncestralArchetype): IntegrationPractice {
  return {
    daily: `Each morning, take a moment to embody ${archetype.gifts[0]}. Feel it in your body.`,
    dailyZh: `每天早晨，花一点时间体现${archetype.giftsZh[0]}。在身体中感受它。`,
    weekly: `Once a week, reflect on how ${archetype.name} showed up in your interactions. Journal about it.`,
    weeklyZh: `每周一次，反思${archetype.nameZh}如何出现在你的互动中。写日记记录。`,
    seasonal: `At each season change, perform a ritual to honor ${archetype.name} and release its shadow.`,
    seasonalZh: `在每个季节转换时，进行仪式来尊崇${archetype.nameZh}并释放它的阴影。`
  };
}

/**
 * Build complete Mythos Codex
 */
export function buildMythosCodex(profile: MythosProfile): MythosCodex {
  const pages: MythosCodexPage[] = [];

  // Add primary archetype page
  if (profile.primaryArchetype) {
    pages.push(buildCodexPage(profile.primaryArchetype));
  }

  // Add secondary archetype pages
  profile.secondaryArchetypes.forEach(arch => {
    pages.push(buildCodexPage(arch));
  });

  // Add shadow archetype page if present
  if (profile.shadowArchetype) {
    pages.push(buildCodexPage(profile.shadowArchetype));
  }

  return {
    id: `codex-${Date.now()}`,
    title: 'Mythos Codex: The Scripture of Your Lineage',
    titleZh: '神话典籍：你血脉的经文',
    pages,
    introduction: profile.mythosNarrative,
    introductionZh: profile.mythosNarrativeZh || profile.mythosNarrative,
    blessing: profile.ancestralVoice,
    blessingZh: profile.ancestralVoiceZh || profile.ancestralVoice
  };
}

/**
 * Build complete library codex (all archetypes)
 */
export function buildFullMythosCodex(): MythosCodex {
  const pages = ARCHETYPE_LIBRARY.map(arch => buildCodexPage(arch));

  return {
    id: 'codex-full-library',
    title: 'The Complete Mythos Codex',
    titleZh: '完整神话典籍',
    pages,
    introduction: 'Within these pages lie the nine ancestral archetypes that flow through all human lineages. Each pattern carries both light and shadow, gift and challenge.',
    introductionZh: '这些页面中记载着流淌在所有人类血脉中的九个祖系原型。每个模式都承载着光与影、礼物与挑战。',
    blessing: 'May you find your pattern within these pages, and may the ancestors guide your integration.',
    blessingZh: '愿你在这些页面中找到你的模式，愿祖先引导你的整合。'
  };
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export codex page as Markdown
 */
export function exportCodexPageMarkdown(page: MythosCodexPage, lang: 'en' | 'zh' = 'en'): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? page.nameZh : page.name}`);
  lines.push('');
  lines.push(`**${lang === 'zh' ? '原型ID' : 'Archetype ID'}:** ${page.archetypeId}`);
  lines.push(`**${lang === 'zh' ? '元素' : 'Element'}:** ${page.element || 'None'}`);
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '主题' : 'Themes'}`);
  lines.push(page.themes.join(', '));
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '礼物' : 'Gifts'}`);
  lines.push((lang === 'zh' ? page.giftsZh : page.gifts).join(', '));
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '阴影' : 'Shadow'}`);
  lines.push((lang === 'zh' ? page.shadowZh : page.shadow).join(', '));
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '经文' : 'Scripture'}`);
  lines.push(`### ${lang === 'zh' ? page.scripture.titleZh : page.scripture.title}`);
  (lang === 'zh' ? page.scripture.versesZh : page.scripture.verses).forEach(v => {
    lines.push(`> ${v}`);
  });
  lines.push('');
  lines.push(`**${lang === 'zh' ? '祝福' : 'Blessing'}:** ${lang === 'zh' ? page.scripture.blessingZh : page.scripture.blessing}`);
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '祖系之声' : 'Ancestral Voice'}`);
  lines.push(`> ${lang === 'zh' ? page.personaVoiceZh : page.personaVoice}`);

  return lines.join('\n');
}

/**
 * Export full codex as Markdown
 */
export function exportCodexMarkdown(codex: MythosCodex, lang: 'en' | 'zh' = 'en'): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? codex.titleZh : codex.title}`);
  lines.push('');
  lines.push(lang === 'zh' ? codex.introductionZh : codex.introduction);
  lines.push('');
  lines.push('---');
  lines.push('');

  codex.pages.forEach((page, idx) => {
    lines.push(exportCodexPageMarkdown(page, lang));
    lines.push('');
    if (idx < codex.pages.length - 1) {
      lines.push('---');
      lines.push('');
    }
  });

  lines.push('---');
  lines.push('');
  lines.push(`> ${lang === 'zh' ? codex.blessingZh : codex.blessing}`);

  return lines.join('\n');
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get codex page by archetype ID
 */
export function getCodexPageById(codex: MythosCodex, archetypeId: string): MythosCodexPage | undefined {
  return codex.pages.find(p => p.archetypeId === archetypeId);
}

/**
 * Get scripture for an archetype
 */
export function getScripture(archetypeId: string): CodexScripture | undefined {
  const archetype = ARCHETYPE_LIBRARY.find(a => a.id === archetypeId);
  if (!archetype) return undefined;

  const page = buildCodexPage(archetype);
  return page.scripture;
}

// ==================== EXPORTS ====================

export {
  buildCodexPage,
  buildMythosCodex,
  buildFullMythosCodex,
  exportCodexPageMarkdown,
  exportCodexMarkdown,
  getCodexPageById,
  getScripture
};
