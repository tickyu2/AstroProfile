/**
 * ============================================
 * PROFILING → RITUAL RECOMMENDATIONS
 * Turns:
 * - Personality traits
 * - Work style
 * - Team compatibility
 * - Constellation themes
 *
 * into ritual recommendations.
 *
 * This is something no professional BaZi
 * platform has ever done.
 * ============================================
 */

import { ProfileFusion } from './profilingConstellationFusion';

// ==================== DATA MODEL ====================

export type RitualType =
  | 'release'       // Letting go of shadows
  | 'integration'   // Integrating lessons
  | 'blessing'      // Amplifying gifts
  | 'protection'    // Setting boundaries
  | 'invocation'    // Calling in support
  | 'gratitude'     // Acknowledging abundance
  | 'vision'        // Clarifying direction
  | 'grounding';    // Stabilizing energy

export interface RitualRecommendation {
  id: string;
  personId: string;
  theme: string;
  themeZh?: string;
  ritualType: RitualType;
  title: string;
  titleZh: string;
  intention: string;
  intentionZh: string;
  instructions: RitualStep[];
  timing: RitualTiming;
  elements: RitualElements;
  affirmation: string;
  affirmationZh: string;
}

export interface RitualStep {
  order: number;
  action: string;
  actionZh: string;
  duration?: string;
  note?: string;
  noteZh?: string;
}

export interface RitualTiming {
  bestTime: string;
  bestTimeZh: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'seasonal';
  lunarPhase?: 'new' | 'waxing' | 'full' | 'waning';
  element?: string;
}

export interface RitualElements {
  colors: string[];
  objects?: string[];
  scents?: string[];
  sounds?: string[];
  direction?: string;
}

export interface RitualProfile {
  personId: string;
  name: string;
  nameZh?: string;
  recommendations: RitualRecommendation[];
  priorityRitual: RitualRecommendation;
  seasonalRitual?: RitualRecommendation;
}

// ==================== RITUAL GENERATION ====================

/**
 * Generate ritual recommendations from profile fusion
 */
export function generateRitualRecommendations(
  profileFusion: ProfileFusion
): RitualRecommendation[] {
  const recommendations: RitualRecommendation[] = [];

  // Generate from constellation themes
  profileFusion.constellationThemes.forEach((theme, idx) => {
    const ritualType = determineRitualType(theme, profileFusion);
    const ritual = buildRitual(
      `${profileFusion.personId}-theme-${idx}`,
      profileFusion.personId,
      theme,
      ritualType
    );
    recommendations.push(ritual);
  });

  // Generate from shadow aspects
  profileFusion.shadowAspects.forEach((shadow, idx) => {
    const ritual = buildRitual(
      `${profileFusion.personId}-shadow-${idx}`,
      profileFusion.personId,
      shadow,
      'release'
    );
    recommendations.push(ritual);
  });

  // Generate from gift aspects
  profileFusion.giftAspects.forEach((gift, idx) => {
    const ritual = buildRitual(
      `${profileFusion.personId}-gift-${idx}`,
      profileFusion.personId,
      gift,
      'blessing'
    );
    recommendations.push(ritual);
  });

  return recommendations;
}

/**
 * Determine ritual type from theme and profile
 */
function determineRitualType(theme: string, profile: ProfileFusion): RitualType {
  const themeLower = theme.toLowerCase();

  // Check for shadow/release themes
  if (themeLower.includes('doubt') || themeLower.includes('fear') ||
      themeLower.includes('block') || themeLower.includes('shadow') ||
      themeLower.includes('wound') || themeLower.includes('pain')) {
    return 'release';
  }

  // Check for blessing/gift themes
  if (themeLower.includes('gift') || themeLower.includes('talent') ||
      themeLower.includes('strength') || themeLower.includes('expression') ||
      themeLower.includes('creativity') || themeLower.includes('leadership')) {
    return 'blessing';
  }

  // Check for protection themes
  if (themeLower.includes('boundary') || themeLower.includes('protect') ||
      themeLower.includes('guard') || themeLower.includes('defend')) {
    return 'protection';
  }

  // Check for invocation themes
  if (themeLower.includes('support') || themeLower.includes('help') ||
      themeLower.includes('guide') || themeLower.includes('mentor')) {
    return 'invocation';
  }

  // Check for vision themes
  if (themeLower.includes('vision') || themeLower.includes('direction') ||
      themeLower.includes('purpose') || themeLower.includes('clarity')) {
    return 'vision';
  }

  // Check for grounding themes
  if (themeLower.includes('stability') || themeLower.includes('ground') ||
      themeLower.includes('anchor') || themeLower.includes('root')) {
    return 'grounding';
  }

  // Check for gratitude themes
  if (themeLower.includes('abundance') || themeLower.includes('gratitude') ||
      themeLower.includes('blessing') || themeLower.includes('thankful')) {
    return 'gratitude';
  }

  // Default
  return 'integration';
}

/**
 * Build a ritual recommendation
 */
function buildRitual(
  id: string,
  personId: string,
  theme: string,
  ritualType: RitualType
): RitualRecommendation {
  const title = getRitualTitle(theme, ritualType);
  const intention = getRitualIntention(theme, ritualType);
  const instructions = buildRitualInstructions(theme, ritualType);
  const timing = getRitualTiming(ritualType);
  const elements = getRitualElements(ritualType);
  const affirmation = getRitualAffirmation(theme, ritualType);

  return {
    id,
    personId,
    theme,
    themeZh: theme, // Would need translation mapping
    ritualType,
    title: title.en,
    titleZh: title.zh,
    intention: intention.en,
    intentionZh: intention.zh,
    instructions,
    timing,
    elements,
    affirmation: affirmation.en,
    affirmationZh: affirmation.zh
  };
}

/**
 * Get ritual title
 */
function getRitualTitle(
  theme: string,
  ritualType: RitualType
): { en: string; zh: string } {
  const titles: Record<RitualType, { en: string; zh: string }> = {
    'release': { en: `Releasing ${theme}`, zh: `释放「${theme}」` },
    'integration': { en: `Integrating ${theme}`, zh: `整合「${theme}」` },
    'blessing': { en: `Amplifying ${theme}`, zh: `放大「${theme}」` },
    'protection': { en: `Protection for ${theme}`, zh: `「${theme}」保护` },
    'invocation': { en: `Invoking Support for ${theme}`, zh: `召唤「${theme}」支持` },
    'gratitude': { en: `Gratitude for ${theme}`, zh: `感恩「${theme}」` },
    'vision': { en: `Visioning ${theme}`, zh: `愿景「${theme}」` },
    'grounding': { en: `Grounding ${theme}`, zh: `扎根「${theme}」` }
  };

  return titles[ritualType];
}

/**
 * Get ritual intention
 */
function getRitualIntention(
  theme: string,
  ritualType: RitualType
): { en: string; zh: string } {
  const intentions: Record<RitualType, { en: string; zh: string }> = {
    'release': {
      en: `To release what no longer serves you around "${theme}" and create space for new growth.`,
      zh: `释放关于「${theme}」中不再服务于你的，为新成长创造空间。`
    },
    'integration': {
      en: `To integrate the lessons of "${theme}" into your daily life and being.`,
      zh: `将「${theme}」的教训整合到你的日常生活和存在中。`
    },
    'blessing': {
      en: `To amplify and honor your gift of "${theme}" so it may serve you and others.`,
      zh: `放大和尊重你「${theme}」的天赋，让它服务于你和他人。`
    },
    'protection': {
      en: `To establish clear boundaries and protection around "${theme}".`,
      zh: `围绕「${theme}」建立清晰的边界和保护。`
    },
    'invocation': {
      en: `To call in support and guidance for your journey with "${theme}".`,
      zh: `为你与「${theme}」的旅程召唤支持和指引。`
    },
    'gratitude': {
      en: `To acknowledge and celebrate the abundance present in "${theme}".`,
      zh: `承认并庆祝「${theme}」中存在的丰盛。`
    },
    'vision': {
      en: `To clarify your vision and direction regarding "${theme}".`,
      zh: `澄清你关于「${theme}」的愿景和方向。`
    },
    'grounding': {
      en: `To anchor and stabilize the energy of "${theme}" in your physical reality.`,
      zh: `将「${theme}」的能量锚定和稳定在你的物质现实中。`
    }
  };

  return intentions[ritualType];
}

/**
 * Build ritual instructions
 */
function buildRitualInstructions(
  theme: string,
  ritualType: RitualType
): RitualStep[] {
  const baseInstructions: Record<RitualType, RitualStep[]> = {
    'release': [
      {
        order: 1,
        action: 'Find a quiet space. Light a candle.',
        actionZh: '找一个安静的空间。点燃蜡烛。',
        duration: '2 min'
      },
      {
        order: 2,
        action: `Write down the story you carry about "${theme}".`,
        actionZh: `写下你关于「${theme}」所携带的故事。`,
        duration: '5 min'
      },
      {
        order: 3,
        action: 'Read what you wrote aloud, then fold the paper.',
        actionZh: '大声朗读你写的内容，然后折叠纸张。',
        duration: '2 min'
      },
      {
        order: 4,
        action: 'Safely burn or place the paper in water.',
        actionZh: '安全地燃烧或将纸张放入水中。',
        duration: '2 min',
        note: 'If burning, have water nearby for safety.',
        noteZh: '如果燃烧，附近备好水以确保安全。'
      },
      {
        order: 5,
        action: 'Say: "I release what no longer belongs to me."',
        actionZh: '说："我释放不再属于我的一切。"',
        duration: '1 min'
      }
    ],
    'integration': [
      {
        order: 1,
        action: 'Sit comfortably with your journal.',
        actionZh: '舒适地坐下，拿着你的日记本。',
        duration: '1 min'
      },
      {
        order: 2,
        action: `Reflect on how "${theme}" appears in your relationships.`,
        actionZh: `反思「${theme}」如何出现在你的关系中。`,
        duration: '5 min'
      },
      {
        order: 3,
        action: 'Write one action you can take this week to embody this lesson.',
        actionZh: '写下本周你可以采取的一个行动来体现这个教训。',
        duration: '3 min'
      },
      {
        order: 4,
        action: 'Place your hand on your heart.',
        actionZh: '把手放在心口。',
        duration: '1 min'
      },
      {
        order: 5,
        action: 'Say: "I integrate this lesson with clarity and grace."',
        actionZh: '说："我以清晰和优雅整合这个教训。"',
        duration: '1 min'
      }
    ],
    'blessing': [
      {
        order: 1,
        action: 'Light a golden or white candle.',
        actionZh: '点燃金色或白色蜡烛。',
        duration: '1 min'
      },
      {
        order: 2,
        action: `Write down the quality you wish to embody in "${theme}".`,
        actionZh: `写下你希望在「${theme}」中体现的品质。`,
        duration: '3 min'
      },
      {
        order: 3,
        action: 'Hold the paper and visualize this gift growing brighter.',
        actionZh: '握着纸张，想象这天赋变得更加明亮。',
        duration: '3 min'
      },
      {
        order: 4,
        action: 'Place the paper somewhere you\'ll see it daily.',
        actionZh: '把纸放在你每天都能看到的地方。',
        duration: '1 min'
      },
      {
        order: 5,
        action: 'Say: "May this light guide my steps."',
        actionZh: '说："愿这光指引我的脚步。"',
        duration: '1 min'
      }
    ],
    'protection': [
      {
        order: 1,
        action: 'Stand and face north.',
        actionZh: '站立面向北方。',
        duration: '1 min'
      },
      {
        order: 2,
        action: 'Visualize a golden sphere of light surrounding you.',
        actionZh: '想象一个金色光球包围着你。',
        duration: '3 min'
      },
      {
        order: 3,
        action: 'State your boundary clearly and firmly.',
        actionZh: '清晰坚定地陈述你的边界。',
        duration: '2 min'
      },
      {
        order: 4,
        action: 'Stamp your foot three times to seal the protection.',
        actionZh: '跺脚三次以封印保护。',
        duration: '1 min'
      },
      {
        order: 5,
        action: 'Say: "I am protected. My boundaries are honored."',
        actionZh: '说："我受到保护。我的边界被尊重。"',
        duration: '1 min'
      }
    ],
    'invocation': [
      {
        order: 1,
        action: 'Light incense or a scented candle.',
        actionZh: '点燃香或香薰蜡烛。',
        duration: '1 min'
      },
      {
        order: 2,
        action: 'Sit quietly and center your breath.',
        actionZh: '安静地坐下，调整呼吸。',
        duration: '3 min'
      },
      {
        order: 3,
        action: 'Speak aloud: "I call upon guidance and support."',
        actionZh: '大声说："我召唤指引和支持。"',
        duration: '1 min'
      },
      {
        order: 4,
        action: 'Sit in receptive silence, noting any images or feelings.',
        actionZh: '在接受的沉默中坐着，注意任何画面或感受。',
        duration: '5 min'
      },
      {
        order: 5,
        action: 'Thank whatever guidance came, even if subtle.',
        actionZh: '感谢到来的任何指引，即使是微妙的。',
        duration: '1 min'
      }
    ],
    'gratitude': [
      {
        order: 1,
        action: 'Find something beautiful to look at.',
        actionZh: '找一些美丽的东西来看。',
        duration: '1 min'
      },
      {
        order: 2,
        action: 'List three things you\'re grateful for related to this theme.',
        actionZh: '列出与这个主题相关的三件你感激的事。',
        duration: '3 min'
      },
      {
        order: 3,
        action: 'Feel the gratitude in your body—where does it live?',
        actionZh: '感受身体里的感激——它在哪里？',
        duration: '2 min'
      },
      {
        order: 4,
        action: 'Speak each gratitude aloud.',
        actionZh: '大声说出每一份感激。',
        duration: '2 min'
      },
      {
        order: 5,
        action: 'Say: "Thank you. I am blessed. I am abundant."',
        actionZh: '说："谢谢。我是被祝福的。我是丰盛的。"',
        duration: '1 min'
      }
    ],
    'vision': [
      {
        order: 1,
        action: 'Close your eyes and take three deep breaths.',
        actionZh: '闭上眼睛，做三次深呼吸。',
        duration: '1 min'
      },
      {
        order: 2,
        action: 'Imagine yourself one year from now, living your vision.',
        actionZh: '想象一年后的自己，活出你的愿景。',
        duration: '5 min'
      },
      {
        order: 3,
        action: 'What do you see? Feel? Hear?',
        actionZh: '你看到什么？感受到什么？听到什么？',
        duration: '3 min'
      },
      {
        order: 4,
        action: 'Write or draw what came to you.',
        actionZh: '写下或画出你看到的。',
        duration: '5 min'
      },
      {
        order: 5,
        action: 'Say: "I trust the unfolding of my vision."',
        actionZh: '说："我信任愿景的展开。"',
        duration: '1 min'
      }
    ],
    'grounding': [
      {
        order: 1,
        action: 'Stand barefoot if possible, or sit with feet flat on floor.',
        actionZh: '如果可能赤脚站立，或双脚平放在地板上坐着。',
        duration: '1 min'
      },
      {
        order: 2,
        action: 'Feel the connection to the earth beneath you.',
        actionZh: '感受与脚下大地的连接。',
        duration: '2 min'
      },
      {
        order: 3,
        action: 'Visualize roots growing from your feet deep into the earth.',
        actionZh: '想象根从你的脚深深长入大地。',
        duration: '3 min'
      },
      {
        order: 4,
        action: 'Breathe in stability, breathe out anxiety.',
        actionZh: '吸入稳定，呼出焦虑。',
        duration: '3 min'
      },
      {
        order: 5,
        action: 'Say: "I am grounded. I am stable. I am here."',
        actionZh: '说："我是扎根的。我是稳定的。我在这里。"',
        duration: '1 min'
      }
    ]
  };

  return baseInstructions[ritualType];
}

/**
 * Get ritual timing
 */
function getRitualTiming(ritualType: RitualType): RitualTiming {
  const timings: Record<RitualType, RitualTiming> = {
    'release': {
      bestTime: 'Evening, as the day releases',
      bestTimeZh: '傍晚，当白天释放时',
      frequency: 'monthly',
      lunarPhase: 'waning'
    },
    'integration': {
      bestTime: 'Morning, with fresh energy',
      bestTimeZh: '早晨，带着新鲜能量',
      frequency: 'weekly',
      lunarPhase: 'waxing'
    },
    'blessing': {
      bestTime: 'Noon, when the sun is brightest',
      bestTimeZh: '中午，太阳最亮时',
      frequency: 'monthly',
      lunarPhase: 'full'
    },
    'protection': {
      bestTime: 'Dusk, at the threshold',
      bestTimeZh: '黄昏，在门槛处',
      frequency: 'monthly',
      lunarPhase: 'new'
    },
    'invocation': {
      bestTime: 'Dawn, when the veil is thin',
      bestTimeZh: '黎明，当帷幕薄时',
      frequency: 'weekly',
      lunarPhase: 'waxing'
    },
    'gratitude': {
      bestTime: 'Evening, before sleep',
      bestTimeZh: '傍晚，睡前',
      frequency: 'daily'
    },
    'vision': {
      bestTime: 'Morning, with clear mind',
      bestTimeZh: '早晨，头脑清醒时',
      frequency: 'seasonal',
      lunarPhase: 'new'
    },
    'grounding': {
      bestTime: 'Any time you feel uncentered',
      bestTimeZh: '任何你感到不稳的时候',
      frequency: 'daily'
    }
  };

  return timings[ritualType];
}

/**
 * Get ritual elements
 */
function getRitualElements(ritualType: RitualType): RitualElements {
  const elements: Record<RitualType, RitualElements> = {
    'release': {
      colors: ['black', 'dark blue', 'silver'],
      objects: ['candle', 'paper', 'water bowl'],
      scents: ['sage', 'frankincense'],
      sounds: ['flowing water']
    },
    'integration': {
      colors: ['green', 'earth tones'],
      objects: ['journal', 'pen', 'stone'],
      scents: ['lavender', 'cedar'],
      sounds: ['gentle music']
    },
    'blessing': {
      colors: ['gold', 'white', 'yellow'],
      objects: ['candle', 'mirror', 'crystals'],
      scents: ['rose', 'jasmine'],
      sounds: ['bells']
    },
    'protection': {
      colors: ['black', 'red', 'gold'],
      objects: ['salt', 'iron', 'mirror'],
      scents: ['dragon\'s blood', 'cedar'],
      direction: 'north'
    },
    'invocation': {
      colors: ['purple', 'white', 'silver'],
      objects: ['incense', 'feather', 'bell'],
      scents: ['frankincense', 'myrrh'],
      sounds: ['chanting']
    },
    'gratitude': {
      colors: ['gold', 'orange', 'pink'],
      objects: ['flowers', 'food offerings'],
      scents: ['cinnamon', 'orange'],
      sounds: ['gratitude music']
    },
    'vision': {
      colors: ['indigo', 'purple', 'silver'],
      objects: ['journal', 'crystal ball', 'mirror'],
      scents: ['mugwort', 'star anise'],
      sounds: ['silence', 'theta binaural']
    },
    'grounding': {
      colors: ['brown', 'red', 'black'],
      objects: ['stones', 'soil', 'tree branch'],
      scents: ['vetiver', 'patchouli'],
      sounds: ['drums', 'earth sounds']
    }
  };

  return elements[ritualType];
}

/**
 * Get ritual affirmation
 */
function getRitualAffirmation(
  theme: string,
  ritualType: RitualType
): { en: string; zh: string } {
  const affirmations: Record<RitualType, { en: string; zh: string }> = {
    'release': {
      en: `I release ${theme} with love and gratitude for its lessons.`,
      zh: `我以爱和感激释放「${theme}」及其教训。`
    },
    'integration': {
      en: `I integrate the wisdom of ${theme} into my being.`,
      zh: `我将「${theme}」的智慧整合到我的存在中。`
    },
    'blessing': {
      en: `I am blessed with the gift of ${theme}. I let it shine.`,
      zh: `我被「${theme}」的天赋祝福。我让它闪耀。`
    },
    'protection': {
      en: `I am protected. My boundaries around ${theme} are sacred.`,
      zh: `我受到保护。我围绕「${theme}」的边界是神圣的。`
    },
    'invocation': {
      en: `I invite guidance and support for my journey with ${theme}.`,
      zh: `我邀请指引和支持来陪伴我与「${theme}」的旅程。`
    },
    'gratitude': {
      en: `I am grateful for the abundance of ${theme} in my life.`,
      zh: `我感激生命中「${theme}」的丰盛。`
    },
    'vision': {
      en: `My vision of ${theme} is clear. I trust its unfolding.`,
      zh: `我对「${theme}」的愿景是清晰的。我信任它的展开。`
    },
    'grounding': {
      en: `I am grounded in ${theme}. I am stable and present.`,
      zh: `我在「${theme}」中扎根。我是稳定的，我在当下。`
    }
  };

  return affirmations[ritualType];
}

// ==================== PROFILE GENERATION ====================

/**
 * Generate full ritual profile from profile fusion
 */
export function generateRitualProfile(
  fusion: ProfileFusion
): RitualProfile {
  const recommendations = generateRitualRecommendations(fusion);

  // Find priority ritual (shadow-based release rituals take priority)
  const releaseRituals = recommendations.filter(r => r.ritualType === 'release');
  const priorityRitual = releaseRituals.length > 0
    ? releaseRituals[0]
    : recommendations[0];

  // Find seasonal ritual based on current season
  const seasonalRitual = findSeasonalRitual(recommendations);

  return {
    personId: fusion.personId,
    name: fusion.name,
    nameZh: fusion.nameZh,
    recommendations,
    priorityRitual,
    seasonalRitual
  };
}

/**
 * Find appropriate seasonal ritual
 */
function findSeasonalRitual(
  recommendations: RitualRecommendation[]
): RitualRecommendation | undefined {
  const month = new Date().getMonth();

  // Spring (March-May): blessing, vision
  if (month >= 2 && month <= 4) {
    return recommendations.find(r =>
      r.ritualType === 'blessing' || r.ritualType === 'vision'
    );
  }

  // Summer (June-August): integration, gratitude
  if (month >= 5 && month <= 7) {
    return recommendations.find(r =>
      r.ritualType === 'integration' || r.ritualType === 'gratitude'
    );
  }

  // Autumn (September-November): release, grounding
  if (month >= 8 && month <= 10) {
    return recommendations.find(r =>
      r.ritualType === 'release' || r.ritualType === 'grounding'
    );
  }

  // Winter (December-February): protection, invocation
  return recommendations.find(r =>
    r.ritualType === 'protection' || r.ritualType === 'invocation'
  );
}

// ==================== RENDERING ====================

/**
 * Render ritual recommendation as markdown
 */
export function renderRitualMarkdown(
  ritual: RitualRecommendation,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? ritual.titleZh : ritual.title}`);
  lines.push('');
  lines.push(`**${lang === 'zh' ? '类型' : 'Type'}:** ${ritual.ritualType}`);
  lines.push(`**${lang === 'zh' ? '主题' : 'Theme'}:** ${ritual.theme}`);
  lines.push('');
  lines.push(`## ${lang === 'zh' ? '意图' : 'Intention'}`);
  lines.push(lang === 'zh' ? ritual.intentionZh : ritual.intention);
  lines.push('');
  lines.push(`## ${lang === 'zh' ? '步骤' : 'Steps'}`);
  ritual.instructions.forEach(step => {
    const action = lang === 'zh' ? step.actionZh : step.action;
    lines.push(`${step.order}. ${action}${step.duration ? ` *(${step.duration})*` : ''}`);
    if (step.note) {
      const note = lang === 'zh' ? step.noteZh : step.note;
      lines.push(`   *${note}*`);
    }
  });
  lines.push('');
  lines.push(`## ${lang === 'zh' ? '时机' : 'Timing'}`);
  lines.push(`- ${lang === 'zh' ? '最佳时间' : 'Best time'}: ${lang === 'zh' ? ritual.timing.bestTimeZh : ritual.timing.bestTime}`);
  lines.push(`- ${lang === 'zh' ? '频率' : 'Frequency'}: ${ritual.timing.frequency}`);
  if (ritual.timing.lunarPhase) {
    lines.push(`- ${lang === 'zh' ? '月相' : 'Lunar phase'}: ${ritual.timing.lunarPhase}`);
  }
  lines.push('');
  lines.push(`## ${lang === 'zh' ? '元素' : 'Elements'}`);
  lines.push(`- ${lang === 'zh' ? '颜色' : 'Colors'}: ${ritual.elements.colors.join(', ')}`);
  if (ritual.elements.objects) {
    lines.push(`- ${lang === 'zh' ? '物品' : 'Objects'}: ${ritual.elements.objects.join(', ')}`);
  }
  if (ritual.elements.scents) {
    lines.push(`- ${lang === 'zh' ? '香味' : 'Scents'}: ${ritual.elements.scents.join(', ')}`);
  }
  lines.push('');
  lines.push(`## ${lang === 'zh' ? '肯定语' : 'Affirmation'}`);
  lines.push(`> "${lang === 'zh' ? ritual.affirmationZh : ritual.affirmation}"`);

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  generateRitualRecommendations,
  generateRitualProfile,
  renderRitualMarkdown
};
