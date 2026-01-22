/**
 * ============================================
 * MYTHOS CODEX NARRATIVE GENERATOR
 * Transforms archetypes into mythic stories,
 * parables, and lineage myths
 *
 * Features:
 * - Archetype origin stories
 * - Lineage parables
 * - Mythic metaphors
 * - Persona-infused narratives
 * - Multi-language support
 * ============================================
 */

import { AncestralArchetype } from './mythosLayer';
import { MythosCodexPage } from './mythosCodex';
import { GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export interface MythosNarrative {
  id: string;
  archetypeId: string;
  title: string;
  titleZh: string;
  story: string;
  storyZh: string;
  symbolism: string[];
  symbolismZh: string[];
  guidance: string;
  guidanceZh: string;
  narrativeType: 'origin' | 'parable' | 'prophecy' | 'teaching' | 'blessing';
}

export interface LineageMyth {
  id: string;
  title: string;
  titleZh: string;
  prologue: string;
  prologueZh: string;
  chapters: MythChapter[];
  epilogue: string;
  epilogueZh: string;
  centralTheme: string;
  archetypes: string[];
}

export interface MythChapter {
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
  archetypeId?: string;
  themes: string[];
}

export interface NarrativeGenerationOptions {
  includeSymbolism?: boolean;
  includeGuidance?: boolean;
  style?: 'poetic' | 'prose' | 'scriptural';
  depth?: 'brief' | 'medium' | 'deep';
}

// ==================== NARRATIVE TEMPLATES ====================

const ORIGIN_TEMPLATES = {
  en: (arch: AncestralArchetype) => `
In an age before memory, the archetype of the "${arch.name}" first appeared in your lineage.
Its themes—${arch.themes.join(', ')}—flowed like a river through the lives of each generation.
Its shadows—${arch.shadow.join(', ')}—brought trials that tested the spirit.
Yet its gifts—${arch.gifts.join(', ')}—became sources of light in the darkest times.
  `.trim(),

  zh: (arch: AncestralArchetype) => `
在久远的年代里，「${arch.nameZh}」的原型第一次在你的祖系中显现。
它的主题——${arch.themes.join('、')}——如同一条河流，在每一代人的生命中缓缓流动。
它的阴影——${arch.shadow.join('、')}——曾带来考验灵魂的试炼。
而它的天赋——${arch.gifts.join('、')}——则成为最黑暗时刻的光明之源。
  `.trim()
};

const PARABLE_TEMPLATES = {
  en: (arch: AncestralArchetype, thread: GenerationalThread) => `
Once, in a family not unlike yours, there lived one who carried the "${arch.name}".
They walked the path of ${thread.theme}, as did their ancestors before them.
The journey was not easy—the shadow of ${arch.shadow[0] || 'doubt'} followed close behind.
But with each step, the gift of ${arch.gifts[0] || 'wisdom'} grew stronger.
In the end, what was carried became what was transformed.
  `.trim(),

  zh: (arch: AncestralArchetype, thread: GenerationalThread) => `
曾经，在一个与你的家族不无相似的家庭里，住着一位承载「${arch.nameZh}」的人。
他们走在${thread.theme}的道路上，正如他们的祖先在他们之前所做的那样。
这段旅程并不轻松——${arch.shadow[0] || '怀疑'}的阴影紧随其后。
但每走一步，${arch.gifts[0] || '智慧'}的天赋就变得更加强大。
最终，被承载的变成了被转化的。
  `.trim()
};

const PROPHECY_TEMPLATES = {
  en: (arch: AncestralArchetype) => `
The ancient ones foretold: "When the ${arch.name} awakens in the child of the line,
the patterns of ${arch.themes[0] || 'old'} shall stir.
The shadows of ${arch.shadow.join(' and ')} shall rise to be faced.
And the gifts of ${arch.gifts.join(' and ')} shall bloom in season."
You are that child. The prophecy unfolds through you.
  `.trim(),

  zh: (arch: AncestralArchetype) => `
古人曾预言：「当${arch.nameZh}在血脉之子身上觉醒，
${arch.themes[0] || '古老'}的模式将被搅动。
${arch.shadow.join('与')}的阴影将升起面对。
而${arch.gifts.join('与')}的天赋将在季节中绽放。」
你就是那个孩子。预言通过你展开。
  `.trim()
};

const TEACHING_TEMPLATES = {
  en: (arch: AncestralArchetype) => `
The "${arch.name}" teaches us: embrace ${arch.themes.join(', ')} with awareness.
Know the shadow: ${arch.shadow.join(', ')}.
Cultivate the gift: ${arch.gifts.join(', ')}.
What your ancestors carried, you now hold.
What you hold, you have the power to transform.
  `.trim(),

  zh: (arch: AncestralArchetype) => `
「${arch.nameZh}」教导我们：以觉知拥抱${arch.themes.join('、')}。
认识阴影：${arch.shadow.join('、')}。
培养天赋：${arch.gifts.join('、')}。
你的祖先承载的，你现在持有。
你持有的，你有力量去转化。
  `.trim()
};

const BLESSING_TEMPLATES = {
  en: (arch: AncestralArchetype) => `
May the light of the "${arch.name}" guide your path.
May the themes of ${arch.themes.join(' and ')} bring you understanding.
May you face the shadows of ${arch.shadow.join(' and ')} with courage.
May the gifts of ${arch.gifts.join(' and ')} flourish in your hands.
You are the continuation. You are the transformation.
  `.trim(),

  zh: (arch: AncestralArchetype) => `
愿「${arch.nameZh}」的光引导你的道路。
愿${arch.themes.join('与')}的主题带给你理解。
愿你以勇气面对${arch.shadow.join('与')}的阴影。
愿${arch.gifts.join('与')}的天赋在你手中绽放。
你是延续。你是转化。
  `.trim()
};

// ==================== NARRATIVE GENERATOR ====================

/**
 * Generate a mythos narrative for an archetype
 */
export function generateMythosNarrative(
  archetype: AncestralArchetype,
  narrativeType: MythosNarrative['narrativeType'] = 'origin',
  thread?: GenerationalThread
): MythosNarrative {
  let storyEn: string;
  let storyZh: string;

  switch (narrativeType) {
    case 'origin':
      storyEn = ORIGIN_TEMPLATES.en(archetype);
      storyZh = ORIGIN_TEMPLATES.zh(archetype);
      break;
    case 'parable':
      storyEn = PARABLE_TEMPLATES.en(archetype, thread || { theme: 'life', intensity: 50, generationIndices: [0] });
      storyZh = PARABLE_TEMPLATES.zh(archetype, thread || { theme: '生命', intensity: 50, generationIndices: [0] });
      break;
    case 'prophecy':
      storyEn = PROPHECY_TEMPLATES.en(archetype);
      storyZh = PROPHECY_TEMPLATES.zh(archetype);
      break;
    case 'teaching':
      storyEn = TEACHING_TEMPLATES.en(archetype);
      storyZh = TEACHING_TEMPLATES.zh(archetype);
      break;
    case 'blessing':
      storyEn = BLESSING_TEMPLATES.en(archetype);
      storyZh = BLESSING_TEMPLATES.zh(archetype);
      break;
    default:
      storyEn = ORIGIN_TEMPLATES.en(archetype);
      storyZh = ORIGIN_TEMPLATES.zh(archetype);
  }

  return {
    id: `narrative-${archetype.id}-${narrativeType}-${Date.now()}`,
    archetypeId: archetype.id,
    title: `${archetype.name} — ${capitalizeFirst(narrativeType)} of the Line`,
    titleZh: `${archetype.nameZh} — 血脉的${getNarrativeTypeZh(narrativeType)}`,
    story: storyEn,
    storyZh: storyZh,
    symbolism: [
      `The "${archetype.name}" symbolizes: ${archetype.themes.join(', ')}`,
      `The shadow reminds us of: ${archetype.shadow.join(', ')}`,
      `The gifts bestow: ${archetype.gifts.join(', ')}`
    ],
    symbolismZh: [
      `「${archetype.nameZh}」象征着：${archetype.themes.join('、')}`,
      `阴影提醒着：${archetype.shadow.join('、')}`,
      `天赋赐予：${archetype.gifts.join('、')}`
    ],
    guidance: `You carry the continuation of this archetype. Let its light guide you, let its shadow remind you.`,
    guidanceZh: `你承载着此原型的延续。让它的光引导你，让它的影提醒你。`,
    narrativeType
  };
}

/**
 * Generate narratives for multiple archetypes
 */
export function generateMythosNarratives(
  archetypes: AncestralArchetype[],
  narrativeType: MythosNarrative['narrativeType'] = 'origin'
): MythosNarrative[] {
  return archetypes.map(arch => generateMythosNarrative(arch, narrativeType));
}

/**
 * Generate a complete lineage myth from multiple archetypes and threads
 */
export function generateLineageMyth(
  archetypes: AncestralArchetype[],
  threads: GenerationalThread[],
  pilgrimName?: string
): LineageMyth {
  const centralTheme = threads.length > 0
    ? threads.sort((a, b) => b.intensity - a.intensity)[0].theme
    : 'transformation';

  const chapters: MythChapter[] = archetypes.map((arch, idx) => {
    const relatedThread = threads.find(t =>
      arch.themes.some(theme => theme.toLowerCase().includes(t.theme.toLowerCase()))
    );

    return {
      title: `Chapter ${idx + 1}: The ${arch.name}`,
      titleZh: `第${idx + 1}章：${arch.nameZh}`,
      content: PARABLE_TEMPLATES.en(arch, relatedThread || threads[0] || { theme: centralTheme, intensity: 50, generationIndices: [0] }),
      contentZh: PARABLE_TEMPLATES.zh(arch, relatedThread || threads[0] || { theme: centralTheme, intensity: 50, generationIndices: [0] }),
      archetypeId: arch.id,
      themes: arch.themes
    };
  });

  return {
    id: `myth-${Date.now()}`,
    title: `The Myth of ${pilgrimName || 'the Pilgrim'}'s Lineage`,
    titleZh: `${pilgrimName || '行者'}血脉的神话`,
    prologue: `In the beginning, there was a line. From this line, stories emerged—stories of ${centralTheme}, of struggle, of transformation. This is the myth of your lineage.`,
    prologueZh: `起初，有一条血脉。从这条血脉中，故事涌现——关于${centralTheme}的故事，关于挣扎的故事，关于转化的故事。这是你血脉的神话。`,
    chapters,
    epilogue: `And so the myth continues. Through you, the stories of your ancestors find new expression. What they began, you carry forward. What they dreamed, you may yet fulfill.`,
    epilogueZh: `于是神话继续。通过你，祖先的故事找到了新的表达。他们开始的，你继续承载。他们梦想的，你也许能够实现。`,
    centralTheme,
    archetypes: archetypes.map(a => a.id)
  };
}

// ==================== FORMATTING ====================

/**
 * Format narrative for display
 */
export function formatNarrativeForDisplay(
  narrative: MythosNarrative,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  const title = lang === 'zh' ? narrative.titleZh : narrative.title;
  const story = lang === 'zh' ? narrative.storyZh : narrative.story;
  const symbolism = lang === 'zh' ? narrative.symbolismZh : narrative.symbolism;
  const guidance = lang === 'zh' ? narrative.guidanceZh : narrative.guidance;

  lines.push('═══════════════════════════════════════');
  lines.push(title);
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(story);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(lang === 'zh' ? '象征：' : 'Symbolism:');
  symbolism.forEach(s => lines.push(`• ${s}`));
  lines.push('');
  lines.push(lang === 'zh' ? '指引：' : 'Guidance:');
  lines.push(guidance);
  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Format lineage myth for display
 */
export function formatLineageMythForDisplay(
  myth: LineageMyth,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  const title = lang === 'zh' ? myth.titleZh : myth.title;
  const prologue = lang === 'zh' ? myth.prologueZh : myth.prologue;
  const epilogue = lang === 'zh' ? myth.epilogueZh : myth.epilogue;

  lines.push('═══════════════════════════════════════');
  lines.push(title);
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(lang === 'zh' ? '【序章】' : '【Prologue】');
  lines.push(prologue);
  lines.push('');

  myth.chapters.forEach(chapter => {
    const chTitle = lang === 'zh' ? chapter.titleZh : chapter.title;
    const chContent = lang === 'zh' ? chapter.contentZh : chapter.content;

    lines.push('---');
    lines.push('');
    lines.push(`【${chTitle}】`);
    lines.push('');
    lines.push(chContent);
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push(lang === 'zh' ? '【尾声】' : '【Epilogue】');
  lines.push(epilogue);
  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Format narrative for voice output (TTS)
 */
export function formatNarrativeForVoice(
  narrative: MythosNarrative,
  lang: 'en' | 'zh' = 'en'
): string[] {
  const lines: string[] = [];

  const title = lang === 'zh' ? narrative.titleZh : narrative.title;
  const story = lang === 'zh' ? narrative.storyZh : narrative.story;
  const guidance = lang === 'zh' ? narrative.guidanceZh : narrative.guidance;

  lines.push(title);
  lines.push(''); // pause
  lines.push(story);
  lines.push(''); // pause
  lines.push(guidance);

  return lines;
}

// ==================== HELPER FUNCTIONS ====================

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getNarrativeTypeZh(type: MythosNarrative['narrativeType']): string {
  const types: Record<string, string> = {
    origin: '起源',
    parable: '寓言',
    prophecy: '预言',
    teaching: '教导',
    blessing: '祝福'
  };
  return types[type] || '故事';
}

/**
 * Get narrative by type
 */
export function getNarrativesByType(
  narratives: MythosNarrative[],
  type: MythosNarrative['narrativeType']
): MythosNarrative[] {
  return narratives.filter(n => n.narrativeType === type);
}

/**
 * Get narrative by archetype
 */
export function getNarrativeByArchetype(
  narratives: MythosNarrative[],
  archetypeId: string
): MythosNarrative | null {
  return narratives.find(n => n.archetypeId === archetypeId) || null;
}

// ==================== EXPORTS ====================

export {
  generateMythosNarrative,
  generateMythosNarratives,
  generateLineageMyth,
  formatNarrativeForDisplay,
  formatLineageMythForDisplay,
  formatNarrativeForVoice,
  getNarrativesByType,
  getNarrativeByArchetype
};
