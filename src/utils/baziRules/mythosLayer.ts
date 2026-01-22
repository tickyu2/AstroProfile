/**
 * ============================================
 * MYTHOS LAYER - ANCESTRAL ARCHETYPES
 * The mythic crown of the ancestral system
 *
 * Turns generational patterns into archetypes:
 * - The Wanderer Line
 * - The Healer Line
 * - The Warrior Line
 * - The Scholar Line
 * - The Bridge-Builder Line
 * - The Keeper of Fire
 * - The Keeper of Water
 * - The Keeper of Roots
 * - The Keeper of Sky
 *
 * Each lineage expresses recurring mythic patterns.
 * ============================================
 */

import { GenerationalThread } from './generationalLadder';
import { PilgrimPosition } from './journeyWithGenerations';

// ==================== DATA MODEL ====================

export interface AncestralArchetype {
  id: string;
  name: string;
  nameZh: string;
  themes: string[];
  shadow: string[];
  shadowZh: string[];
  gifts: string[];
  giftsZh: string[];
  element?: string;           // Associated BaZi element
  lineageEvidence: string[];  // Threads or patterns that support this archetype
  personaVoice: string;       // Luna's archetype voice (English)
  personaVoiceZh: string;     // Luna's archetype voice (Chinese)
  ritualFocus: string;        // What rituals should focus on
  ritualFocusZh: string;
}

export interface MythosProfile {
  pilgrimName?: string;
  primaryArchetype?: AncestralArchetype;
  secondaryArchetypes: AncestralArchetype[];
  shadowArchetype?: AncestralArchetype;
  archetypeStrengths: Map<string, number>;  // archetype id → strength 0-1
  mythosNarrative: string;
  mythosNarrativeZh?: string;
  ancestralVoice: string;
  ancestralVoiceZh?: string;
}

// ==================== ARCHETYPE LIBRARY ====================

const ARCHETYPE_LIBRARY: AncestralArchetype[] = [
  {
    id: 'wanderer',
    name: 'The Wanderer Line',
    nameZh: '流浪者之系',
    themes: ['movement', 'migration', 'searching', 'travel', 'exploration', 'freedom'],
    shadow: ['rootlessness', 'displacement', 'inability to settle', 'eternal seeking'],
    shadowZh: ['无根', '流离', '无法安定', '永恒的寻觅'],
    gifts: ['adaptability', 'vision', 'freedom', 'perspective', 'resilience'],
    giftsZh: ['适应力', '视野', '自由', '洞察', '韧性'],
    element: 'Wood',
    lineageEvidence: ['migration', 'movement', 'travel', 'searching'],
    personaVoice: 'Your bloodline carries the wind. Every step you take continues an ancient search.',
    personaVoiceZh: '你的血脉里带着迁徙的风。你走的每一步，都在延续古老的寻找。',
    ritualFocus: 'Finding home within yourself while honoring the journeys of your ancestors.',
    ritualFocusZh: '在自己内心找到家园，同时尊崇祖先的旅程。'
  },
  {
    id: 'healer',
    name: 'The Healer Line',
    nameZh: '疗愈者之系',
    themes: ['care', 'healing', 'service', 'medicine', 'nurturing', 'compassion'],
    shadow: ['self-sacrifice', 'overgiving', 'martyrdom', 'neglecting self'],
    shadowZh: ['自我牺牲', '过度付出', '殉道', '忽视自我'],
    gifts: ['compassion', 'restoration', 'intuition', 'presence', 'touch'],
    giftsZh: ['悲悯', '修复', '直觉', '临在', '触愈'],
    element: 'Water',
    lineageEvidence: ['care', 'healing', 'service', 'medicine', 'nurturing'],
    personaVoice: 'Your ancestors carried healing in their hands. The same medicine flows through you.',
    personaVoiceZh: '你的祖先双手中承载着疗愈。同样的医药流淌在你体内。',
    ritualFocus: 'Healing yourself so you can heal others without depletion.',
    ritualFocusZh: '疗愈自己，这样你才能在不耗竭的情况下疗愈他人。'
  },
  {
    id: 'warrior',
    name: 'The Warrior Line',
    nameZh: '战士之系',
    themes: ['strength', 'protection', 'battle', 'courage', 'defense', 'honor'],
    shadow: ['violence', 'aggression', 'trauma', 'inability to rest'],
    shadowZh: ['暴力', '攻击性', '创伤', '无法安息'],
    gifts: ['courage', 'protection', 'strength', 'loyalty', 'honor'],
    giftsZh: ['勇气', '守护', '力量', '忠诚', '荣誉'],
    element: 'Metal',
    lineageEvidence: ['strength', 'protection', 'battle', 'courage', 'military'],
    personaVoice: 'Your lineage knows the weight of swords. That same strength now protects in new ways.',
    personaVoiceZh: '你的血脉知道剑的分量。同样的力量现在以新的方式守护。',
    ritualFocus: 'Transmuting the energy of conflict into the energy of protection.',
    ritualFocusZh: '将冲突的能量转化为守护的能量。'
  },
  {
    id: 'scholar',
    name: 'The Scholar Line',
    nameZh: '学者之系',
    themes: ['knowledge', 'wisdom', 'learning', 'teaching', 'books', 'study'],
    shadow: ['overthinking', 'disconnection from body', 'elitism', 'isolation'],
    shadowZh: ['过度思考', '与身体脱节', '精英主义', '孤立'],
    gifts: ['wisdom', 'insight', 'teaching', 'preservation', 'understanding'],
    giftsZh: ['智慧', '洞见', '教导', '保存', '理解'],
    element: 'Water',
    lineageEvidence: ['knowledge', 'wisdom', 'learning', 'teaching', 'education'],
    personaVoice: 'Your ancestors turned pages that still whisper through you. Their seeking for truth continues.',
    personaVoiceZh: '你的祖先翻阅的书页至今仍在你耳边低语。他们对真理的追求仍在继续。',
    ritualFocus: 'Grounding wisdom in the body and sharing it with others.',
    ritualFocusZh: '将智慧扎根于身体，并与他人分享。'
  },
  {
    id: 'bridge-builder',
    name: 'The Bridge-Builder Line',
    nameZh: '架桥者之系',
    themes: ['connection', 'diplomacy', 'mediation', 'unity', 'relationship', 'harmony'],
    shadow: ['people-pleasing', 'loss of self', 'conflict avoidance', 'codependency'],
    shadowZh: ['讨好他人', '失去自我', '回避冲突', '共依存'],
    gifts: ['connection', 'harmony', 'mediation', 'understanding', 'peace'],
    giftsZh: ['连接', '和谐', '调解', '理解', '和平'],
    element: 'Earth',
    lineageEvidence: ['connection', 'diplomacy', 'mediation', 'unity', 'harmony'],
    personaVoice: 'Your bloodline builds bridges across divides. You carry the gift of connection.',
    personaVoiceZh: '你的血脉在鸿沟上架起桥梁。你携带着连接的礼物。',
    ritualFocus: 'Honoring your own boundaries while maintaining the gift of connection.',
    ritualFocusZh: '在保持连接的礼物的同时尊崇你自己的边界。'
  },
  {
    id: 'keeper-fire',
    name: 'The Keeper of Fire',
    nameZh: '火之守护者',
    themes: ['passion', 'creativity', 'transformation', 'art', 'expression', 'joy'],
    shadow: ['burnout', 'destruction', 'rage', 'instability'],
    shadowZh: ['耗竭', '毁灭', '愤怒', '不稳定'],
    gifts: ['passion', 'creativity', 'transformation', 'warmth', 'inspiration'],
    giftsZh: ['热情', '创造力', '转化', '温暖', '灵感'],
    element: 'Fire',
    lineageEvidence: ['passion', 'creativity', 'art', 'expression', 'fire', 'transformation'],
    personaVoice: 'Your ancestors tended flames that still burn in you. Guard this fire well.',
    personaVoiceZh: '你的祖先守护的火焰至今仍在你体内燃烧。好好守护这团火。',
    ritualFocus: 'Channeling passion without burning out yourself or others.',
    ritualFocusZh: '引导热情而不耗尽自己或他人。'
  },
  {
    id: 'keeper-water',
    name: 'The Keeper of Water',
    nameZh: '水之守护者',
    themes: ['emotion', 'intuition', 'flow', 'depth', 'mystery', 'dreams'],
    shadow: ['overwhelm', 'drowning', 'emotional flooding', 'manipulation'],
    shadowZh: ['淹没', '溺水', '情感泛滥', '操控'],
    gifts: ['intuition', 'depth', 'flow', 'emotional wisdom', 'healing'],
    giftsZh: ['直觉', '深度', '流动', '情感智慧', '疗愈'],
    element: 'Water',
    lineageEvidence: ['emotion', 'intuition', 'flow', 'depth', 'water', 'dreams'],
    personaVoice: 'Your lineage runs deep like rivers. The same waters of intuition flow through you.',
    personaVoiceZh: '你的血脉如河流般深邃。同样直觉的水流淌在你体内。',
    ritualFocus: 'Containing emotional depth without being swept away.',
    ritualFocusZh: '容纳情感深度而不被冲走。'
  },
  {
    id: 'keeper-roots',
    name: 'The Keeper of Roots',
    nameZh: '根之守护者',
    themes: ['tradition', 'stability', 'foundation', 'home', 'family', 'land'],
    shadow: ['rigidity', 'stubbornness', 'fear of change', 'stagnation'],
    shadowZh: ['僵化', '固执', '害怕改变', '停滞'],
    gifts: ['stability', 'foundation', 'tradition', 'grounding', 'endurance'],
    giftsZh: ['稳定', '根基', '传统', '扎根', '持久'],
    element: 'Earth',
    lineageEvidence: ['tradition', 'stability', 'foundation', 'home', 'family', 'land'],
    personaVoice: 'Your ancestors sank roots that still hold. You carry their gift of stability.',
    personaVoiceZh: '你的祖先扎下的根至今仍在支撑。你携带着他们稳定的礼物。',
    ritualFocus: 'Honoring tradition while allowing necessary growth and change.',
    ritualFocusZh: '尊崇传统的同时允许必要的成长与变化。'
  },
  {
    id: 'keeper-sky',
    name: 'The Keeper of Sky',
    nameZh: '天之守护者',
    themes: ['vision', 'spirituality', 'transcendence', 'inspiration', 'dreams', 'faith'],
    shadow: ['disconnection', 'escapism', 'spiritual bypassing', 'impracticality'],
    shadowZh: ['脱节', '逃避', '灵性绕道', '不切实际'],
    gifts: ['vision', 'inspiration', 'faith', 'transcendence', 'hope'],
    giftsZh: ['愿景', '灵感', '信仰', '超越', '希望'],
    element: 'Metal',
    lineageEvidence: ['vision', 'spirituality', 'transcendence', 'faith', 'sky', 'dreams'],
    personaVoice: 'Your bloodline gazes upward. The same starlight that guided them illuminates you.',
    personaVoiceZh: '你的血脉仰望天空。曾引导他们的同一道星光照亮着你。',
    ritualFocus: 'Grounding spiritual insight in earthly action.',
    ritualFocusZh: '将灵性洞见扎根于尘世行动。'
  }
];

// ==================== ARCHETYPE ENGINE ====================

/**
 * Assign archetypes based on threads and patterns
 */
export function assignArchetypes(
  threads: GenerationalThread[],
  patterns: PilgrimPosition
): AncestralArchetype[] {
  const archetypes: AncestralArchetype[] = [];

  // Collect all themes
  const themeSet = new Set<string>();
  threads.forEach(t => themeSet.add(t.theme.toLowerCase()));
  patterns.inheritedThemes.forEach(t => themeSet.add(t.toLowerCase()));
  patterns.newPatterns.forEach(t => themeSet.add(t.toLowerCase()));
  patterns.brokenPatterns.forEach(t => themeSet.add(t.toLowerCase()));

  // Check each archetype
  ARCHETYPE_LIBRARY.forEach(archetype => {
    const matchingThemes = archetype.themes.filter(t =>
      Array.from(themeSet).some(theme =>
        theme.includes(t.toLowerCase()) || t.toLowerCase().includes(theme)
      )
    );

    if (matchingThemes.length >= 1) {
      archetypes.push({
        ...archetype,
        lineageEvidence: matchingThemes
      });
    }
  });

  return archetypes;
}

/**
 * Build complete mythos profile
 */
export function buildMythosProfile(
  threads: GenerationalThread[],
  position: PilgrimPosition,
  pilgrimName?: string
): MythosProfile {
  const archetypes = assignArchetypes(threads, position);

  // Calculate archetype strengths based on evidence
  const archetypeStrengths = new Map<string, number>();
  archetypes.forEach(a => {
    const evidenceCount = a.lineageEvidence.length;
    const strength = Math.min(1, evidenceCount / 3); // Max strength at 3+ evidence
    archetypeStrengths.set(a.id, strength);
  });

  // Sort by strength
  const sortedArchetypes = [...archetypes].sort((a, b) =>
    (archetypeStrengths.get(b.id) ?? 0) - (archetypeStrengths.get(a.id) ?? 0)
  );

  const primaryArchetype = sortedArchetypes[0];
  const secondaryArchetypes = sortedArchetypes.slice(1, 3);

  // Shadow archetype - based on broken patterns
  let shadowArchetype: AncestralArchetype | undefined;
  if (position.brokenPatterns.length > 0) {
    shadowArchetype = ARCHETYPE_LIBRARY.find(a =>
      a.shadow.some(s =>
        position.brokenPatterns.some(p =>
          s.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase().includes(s.toLowerCase())
        )
      )
    );
  }

  // Generate narrative
  const { narrative, narrativeZh, voice, voiceZh } = generateMythosNarrative(
    primaryArchetype,
    secondaryArchetypes,
    shadowArchetype,
    position
  );

  return {
    pilgrimName,
    primaryArchetype,
    secondaryArchetypes,
    shadowArchetype,
    archetypeStrengths,
    mythosNarrative: narrative,
    mythosNarrativeZh: narrativeZh,
    ancestralVoice: voice,
    ancestralVoiceZh: voiceZh
  };
}

/**
 * Generate mythos narrative
 */
function generateMythosNarrative(
  primary: AncestralArchetype | undefined,
  secondary: AncestralArchetype[],
  shadow: AncestralArchetype | undefined,
  position: PilgrimPosition
): { narrative: string; narrativeZh: string; voice: string; voiceZh: string } {
  if (!primary) {
    return {
      narrative: 'Your lineage walks a path not yet named in the ancient stories. You are the first to give it shape.',
      narrativeZh: '你的血脉行走在古老故事中尚未命名的道路上。你是第一个赋予它形状的人。',
      voice: 'You carry an archetype not yet recorded. The ancestors watch with curiosity.',
      voiceZh: '你携带着一个尚未记录的原型。祖先们好奇地注视着。'
    };
  }

  let narrative = `Your lineage carries the archetype of ${primary.name}. `;
  let narrativeZh = `你的血脉承载着「${primary.nameZh}」的原型。`;

  if (secondary.length > 0) {
    narrative += `Woven through this are threads of ${secondary.map(s => s.name).join(' and ')}. `;
    narrativeZh += `其中交织着「${secondary.map(s => s.nameZh).join('」与「')}」的丝线。`;
  }

  narrative += `The gifts of ${primary.gifts.slice(0, 3).join(', ')} flow through your blood. `;
  narrativeZh += `${primary.giftsZh.slice(0, 3).join('、')}的礼物流淌在你的血液中。`;

  if (shadow) {
    narrative += `The shadow of ${shadow.name} asks to be witnessed and integrated.`;
    narrativeZh += `「${shadow.nameZh}」的阴影请求被看见和整合。`;
  }

  const voice = primary.personaVoice;
  const voiceZh = primary.personaVoiceZh;

  return { narrative, narrativeZh, voice, voiceZh };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get archetype by ID
 */
export function getArchetype(id: string): AncestralArchetype | undefined {
  return ARCHETYPE_LIBRARY.find(a => a.id === id);
}

/**
 * Get all archetypes
 */
export function getAllArchetypes(): AncestralArchetype[] {
  return [...ARCHETYPE_LIBRARY];
}

/**
 * Get archetypes by element
 */
export function getArchetypesByElement(element: string): AncestralArchetype[] {
  return ARCHETYPE_LIBRARY.filter(a =>
    a.element?.toLowerCase() === element.toLowerCase()
  );
}

/**
 * Get archetype voice for Luna
 */
export function getArchetypeVoice(archetype: AncestralArchetype, lang: 'en' | 'zh' = 'en'): string {
  return lang === 'zh' ? archetype.personaVoiceZh : archetype.personaVoice;
}

/**
 * Get shadow work guidance
 */
export function getShadowWorkGuidance(archetype: AncestralArchetype, lang: 'en' | 'zh' = 'en'): string {
  if (lang === 'zh') {
    return `「${archetype.nameZh}」的阴影面包括：${archetype.shadowZh.join('、')}。通过觉察这些模式，你可以将它们转化为${archetype.giftsZh.slice(0, 2).join('与')}的礼物。`;
  }
  return `The shadow aspects of ${archetype.name} include: ${archetype.shadow.join(', ')}. By witnessing these patterns, you can transmute them into the gifts of ${archetype.gifts.slice(0, 2).join(' and ')}.`;
}

/**
 * Get ritual focus for archetype
 */
export function getArchetypeRitualFocus(archetype: AncestralArchetype, lang: 'en' | 'zh' = 'en'): string {
  return lang === 'zh' ? archetype.ritualFocusZh : archetype.ritualFocus;
}

// ==================== EXPORTS ====================

export {
  assignArchetypes,
  buildMythosProfile,
  getArchetype,
  getAllArchetypes,
  getArchetypesByElement,
  getArchetypeVoice,
  getShadowWorkGuidance,
  getArchetypeRitualFocus,
  ARCHETYPE_LIBRARY
};
