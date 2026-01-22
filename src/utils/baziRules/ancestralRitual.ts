/**
 * ============================================
 * ANCESTRAL HEALING RITUAL LAYER
 * Transforms generational insight into healing action
 *
 * Produces:
 * - Ritual prompts
 * - Symbolic actions
 * - Reflection questions
 * - Ancestral acknowledgments
 * - Release statements
 * - Blessing statements
 *
 * The pilgrim receives not just analysis,
 * but a sacred practice for integration.
 * ============================================
 */

import { PilgrimPosition } from './journeyWithGenerations';
import { GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export type RitualType = 'healing' | 'release' | 'integration' | 'blessing' | 'acknowledgment' | 'activation';

export interface RitualStep {
  order: number;
  action: string;
  actionZh?: string;
  symbolism: string;
  symbolismZh?: string;
  duration?: string;       // "1-2 minutes", "as long as needed"
}

export interface AncestralRitual {
  id: string;
  theme: string;
  themeZh?: string;
  type: RitualType;
  title: string;
  titleZh?: string;
  intention: string;
  intentionZh?: string;
  steps: RitualStep[];
  ancestralVoice: string;
  ancestralVoiceZh?: string;
  reflectionQuestions: string[];
  reflectionQuestionsZh?: string[];
  closingStatement: string;
  closingStatementZh?: string;
  materials?: string[];
  materialsZh?: string[];
}

export interface RitualCollection {
  pilgrimName?: string;
  position: PilgrimPosition;
  rituals: AncestralRitual[];
  openingInvocation: string;
  openingInvocationZh?: string;
  closingBlessing: string;
  closingBlessingZh?: string;
  totalDuration: string;
}

// ==================== RITUAL TEMPLATES ====================

const RITUAL_TEMPLATES = {
  release: {
    title: (theme: string) => `Release Ritual: ${theme}`,
    titleZh: (theme: string) => `释放仪式：${theme}`,
    intention: (theme: string) => `To consciously release the ancestral pattern of ${theme} and free yourself and future generations.`,
    intentionZh: (theme: string) => `有意识地释放${theme}的祖传模式，解放自己和未来的世代。`,
    steps: (theme: string): RitualStep[] => [
      {
        order: 1,
        action: `Write down what you inherited about "${theme}" from your ancestors.`,
        actionZh: `写下你从祖先那里继承的关于"${theme}"的内容。`,
        symbolism: 'Acknowledging what was passed down.',
        symbolismZh: '承认所传承的。',
        duration: '5-10 minutes'
      },
      {
        order: 2,
        action: 'Fold the paper and place it beside a bowl of clean water.',
        actionZh: '将纸折起，放在一碗清水旁。',
        symbolism: 'Water represents purification and the dissolving of old cycles.',
        symbolismZh: '水代表净化和旧循环的溶解。',
        duration: '1 minute'
      },
      {
        order: 3,
        action: `Say aloud: "I honor your experiences, but I choose a new path. The cycle of ${theme} ends with me."`,
        actionZh: `大声说："我尊重你们的经历，但我选择新的道路。${theme}的循环在我这里终结。"`,
        symbolism: 'Verbal declaration of liberation.',
        symbolismZh: '解放的口头宣言。',
        duration: '1-2 minutes'
      },
      {
        order: 4,
        action: 'Submerge the paper in the water or tear it into small pieces.',
        actionZh: '将纸浸入水中或撕成小碎片。',
        symbolism: 'Physical release of the pattern.',
        symbolismZh: '模式的物理释放。',
        duration: '1 minute'
      },
      {
        order: 5,
        action: 'Sit in silence and feel the weight lifting.',
        actionZh: '静坐，感受重量的消散。',
        symbolism: 'Integration of the release.',
        symbolismZh: '释放的整合。',
        duration: '3-5 minutes'
      }
    ],
    ancestralVoice: (theme: string) => `We see you releasing what we could not release. The burden of ${theme} dissolves. We are grateful.`,
    ancestralVoiceZh: (theme: string) => `我们看见你放下我们无法放下的重担。${theme}的负担消融了。我们感激。`,
    reflectionQuestions: (theme: string) => [
      `How has ${theme} affected decisions in your family across generations?`,
      `What would your ancestors say if they saw you releasing this pattern?`,
      `How does your body feel as you let go of ${theme}?`
    ],
    reflectionQuestionsZh: (theme: string) => [
      `${theme}如何影响了你家族几代人的决定？`,
      `如果你的祖先看到你释放这个模式，他们会说什么？`,
      `当你放下${theme}时，你的身体有什么感觉？`
    ],
    closingStatement: (theme: string) => `The cycle of ${theme} completes through you. You are free, and so are those who follow.`,
    closingStatementZh: (theme: string) => `${theme}的循环通过你完成。你自由了，跟随你的人也自由了。`,
    materials: ['Paper', 'Pen', 'Bowl of water'],
    materialsZh: ['纸', '笔', '一碗清水']
  },

  blessing: {
    title: (theme: string) => `Blessing Ritual: ${theme}`,
    titleZh: (theme: string) => `祝福仪式：${theme}`,
    intention: (theme: string) => `To consciously activate and bless the new pattern of ${theme} for yourself and future generations.`,
    intentionZh: (theme: string) => `有意识地激活并祝福${theme}的新模式，为自己和未来的世代。`,
    steps: (theme: string): RitualStep[] => [
      {
        order: 1,
        action: 'Light a candle, representing the new pattern being born.',
        actionZh: '点燃一支蜡烛，象征新模式的诞生。',
        symbolism: 'Fire represents new life and illumination.',
        symbolismZh: '火代表新生和照明。',
        duration: '1 minute'
      },
      {
        order: 2,
        action: `Write down the qualities of "${theme}" you wish to pass to your descendants.`,
        actionZh: `写下你希望传递给后代的关于"${theme}"的品质。`,
        symbolism: 'Seeding intention for future generations.',
        symbolismZh: '为未来的世代播种意图。',
        duration: '5-10 minutes'
      },
      {
        order: 3,
        action: `Say aloud: "May this light illuminate the path of ${theme} for all who follow me."`,
        actionZh: `大声说："愿此光照亮所有跟随我的人的${theme}之路。"`,
        symbolism: 'Verbal blessing and activation.',
        symbolismZh: '口头祝福和激活。',
        duration: '1-2 minutes'
      },
      {
        order: 4,
        action: 'Hold the paper near the candle flame (not in it) and visualize the words glowing.',
        actionZh: '将纸靠近蜡烛火焰（不要接触）并想象文字在发光。',
        symbolism: 'Energizing the intention.',
        symbolismZh: '为意图注入能量。',
        duration: '2-3 minutes'
      },
      {
        order: 5,
        action: 'Place the paper somewhere sacred to you. Let the candle burn down safely.',
        actionZh: '将纸放在对你神圣的地方。让蜡烛安全地燃尽。',
        symbolism: 'Anchoring the blessing in physical space.',
        symbolismZh: '将祝福锚定在物理空间。',
        duration: 'As needed'
      }
    ],
    ancestralVoice: (theme: string) => `What you ignite today becomes a beacon. Your ${theme} will light the way for those yet unborn.`,
    ancestralVoiceZh: (theme: string) => `你今天点燃的将成为灯塔。你的${theme}将为尚未出生的人照亮道路。`,
    reflectionQuestions: (theme: string) => [
      `What version of ${theme} do you want your descendants to inherit?`,
      `How can you embody ${theme} more fully starting today?`,
      `What would your future great-grandchildren thank you for regarding ${theme}?`
    ],
    reflectionQuestionsZh: (theme: string) => [
      `你希望你的后代继承什么版本的${theme}？`,
      `从今天开始，你如何能更充分地体现${theme}？`,
      `关于${theme}，你未来的曾孙会感谢你什么？`
    ],
    closingStatement: (theme: string) => `The seed of ${theme} is planted. May it grow into forests for those who follow.`,
    closingStatementZh: (theme: string) => `${theme}的种子已播下。愿它为后来者长成森林。`,
    materials: ['Candle', 'Matches/lighter', 'Paper', 'Pen'],
    materialsZh: ['蜡烛', '火柴/打火机', '纸', '笔']
  },

  integration: {
    title: (theme: string) => `Integration Ritual: ${theme}`,
    titleZh: (theme: string) => `整合仪式：${theme}`,
    intention: (theme: string) => `To consciously honor and integrate the inherited gift of ${theme} from your ancestors.`,
    intentionZh: (theme: string) => `有意识地尊崇并整合从祖先那里继承的${theme}的礼物。`,
    steps: (theme: string): RitualStep[] => [
      {
        order: 1,
        action: 'Sit comfortably and close your eyes. Take three deep breaths.',
        actionZh: '舒适地坐着，闭上眼睛。深呼吸三次。',
        symbolism: 'Centering and opening.',
        symbolismZh: '中心化和开放。',
        duration: '2-3 minutes'
      },
      {
        order: 2,
        action: `Visualize your ancestors standing behind you, each one carrying a piece of "${theme}".`,
        actionZh: `想象你的祖先站在你身后，每个人都携带着"${theme}"的一部分。`,
        symbolism: 'Connecting with the lineage.',
        symbolismZh: '与血脉连接。',
        duration: '3-5 minutes'
      },
      {
        order: 3,
        action: `Say: "I receive the gift of ${theme}. I honor how it was carried to me."`,
        actionZh: `说："我接受${theme}的礼物。我尊崇它如何被传递给我。"`,
        symbolism: 'Conscious reception.',
        symbolismZh: '有意识的接收。',
        duration: '1 minute'
      },
      {
        order: 4,
        action: `Place both hands on your heart and feel ${theme} settling into your body.`,
        actionZh: `双手放在心口，感受${theme}在你体内安顿。`,
        symbolism: 'Embodiment of the gift.',
        symbolismZh: '礼物的体现。',
        duration: '3-5 minutes'
      },
      {
        order: 5,
        action: 'Open your eyes slowly. Write one sentence about how you will carry this gift forward.',
        actionZh: '慢慢睁开眼睛。写一句关于你将如何传承这份礼物的话。',
        symbolism: 'Commitment to the lineage.',
        symbolismZh: '对血脉的承诺。',
        duration: '2-3 minutes'
      }
    ],
    ancestralVoice: (theme: string) => `We gave what we could. Now ${theme} lives through you in ways we could not imagine.`,
    ancestralVoiceZh: (theme: string) => `我们给了我们所能给的。现在${theme}以我们无法想象的方式通过你活着。`,
    reflectionQuestions: (theme: string) => [
      `How has ${theme} shaped who you are today?`,
      `Which ancestor do you feel most connected to regarding ${theme}?`,
      `How can you express gratitude for this inheritance?`
    ],
    reflectionQuestionsZh: (theme: string) => [
      `${theme}如何塑造了今天的你？`,
      `关于${theme}，你感觉与哪位祖先最有联系？`,
      `你如何表达对这份传承的感激？`
    ],
    closingStatement: (theme: string) => `The ancestral gift of ${theme} flows through you. You are the bridge between past and future.`,
    closingStatementZh: (theme: string) => `${theme}的祖传礼物流过你。你是过去与未来之间的桥梁。`,
    materials: ['Quiet space', 'Paper', 'Pen (optional)'],
    materialsZh: ['安静的空间', '纸', '笔（可选）']
  },

  acknowledgment: {
    title: (theme: string) => `Acknowledgment Ritual: ${theme}`,
    titleZh: (theme: string) => `感恩仪式：${theme}`,
    intention: (theme: string) => `To honor the ancestors who carried ${theme} through hardship so it could reach you.`,
    intentionZh: (theme: string) => `尊崇那些在艰辛中承载${theme}以使其能够到达你的祖先。`,
    steps: (theme: string): RitualStep[] => [
      {
        order: 1,
        action: 'Set a place at your table for your ancestors.',
        actionZh: '在你的桌上为你的祖先留一个位置。',
        symbolism: 'Inviting the ancestors into presence.',
        symbolismZh: '邀请祖先到场。',
        duration: '1 minute'
      },
      {
        order: 2,
        action: 'Pour a small glass of water or tea as an offering.',
        actionZh: '倒一小杯水或茶作为供品。',
        symbolism: 'Nourishment for the spirits.',
        symbolismZh: '滋养灵魂。',
        duration: '1 minute'
      },
      {
        order: 3,
        action: `Speak aloud: "I acknowledge the ${theme} you carried. I see your struggles and your strength."`,
        actionZh: `大声说："我承认你们所承载的${theme}。我看到你们的挣扎和力量。"`,
        symbolism: 'Witnessing ancestral experience.',
        symbolismZh: '见证祖先的经历。',
        duration: '2-3 minutes'
      },
      {
        order: 4,
        action: `Say: "Because of you, ${theme} lives in me. I am grateful."`,
        actionZh: `说："因为你们，${theme}活在我身上。我感恩。"`,
        symbolism: 'Expressing gratitude.',
        symbolismZh: '表达感激。',
        duration: '1 minute'
      },
      {
        order: 5,
        action: 'Sit in silence, feeling the ancestral presence. When ready, pour the water onto the earth or a plant.',
        actionZh: '静坐，感受祖先的存在。准备好后，将水倒入土中或植物上。',
        symbolism: 'Returning the offering to the earth.',
        symbolismZh: '将供品归还大地。',
        duration: '3-5 minutes'
      }
    ],
    ancestralVoice: (theme: string) => `We are seen. We are remembered. ${theme} was worth carrying because you stand here now.`,
    ancestralVoiceZh: (theme: string) => `我们被看见了。我们被记住了。${theme}值得承载，因为你现在站在这里。`,
    reflectionQuestions: (theme: string) => [
      `What sacrifices did your ancestors make to carry ${theme} forward?`,
      `How does acknowledging them change how you feel about ${theme}?`,
      `What message would you send to them if you could?`
    ],
    reflectionQuestionsZh: (theme: string) => [
      `你的祖先做出了什么牺牲来传承${theme}？`,
      `承认他们如何改变你对${theme}的感受？`,
      `如果可以，你想给他们传递什么信息？`
    ],
    closingStatement: (theme: string) => `The ancestors are honored. ${theme} is acknowledged. The lineage is complete in this moment.`,
    closingStatementZh: (theme: string) => `祖先受到尊崇。${theme}被承认。血脉在此刻完整。`,
    materials: ['Table', 'Cup', 'Water or tea'],
    materialsZh: ['桌子', '杯子', '水或茶']
  }
};

// ==================== RITUAL GENERATION ====================

/**
 * Generate ancestral rituals based on pilgrim position
 */
export function generateAncestralRituals(position: PilgrimPosition): AncestralRitual[] {
  const rituals: AncestralRitual[] = [];

  // Release rituals for broken patterns
  position.brokenPatterns.forEach((theme, idx) => {
    const template = RITUAL_TEMPLATES.release;
    rituals.push({
      id: `release-${idx}`,
      theme,
      themeZh: theme, // Would need translation mapping
      type: 'release',
      title: template.title(theme),
      titleZh: template.titleZh(theme),
      intention: template.intention(theme),
      intentionZh: template.intentionZh(theme),
      steps: template.steps(theme),
      ancestralVoice: template.ancestralVoice(theme),
      ancestralVoiceZh: template.ancestralVoiceZh(theme),
      reflectionQuestions: template.reflectionQuestions(theme),
      reflectionQuestionsZh: template.reflectionQuestionsZh(theme),
      closingStatement: template.closingStatement(theme),
      closingStatementZh: template.closingStatementZh(theme),
      materials: template.materials,
      materialsZh: template.materialsZh
    });
  });

  // Blessing rituals for new patterns
  position.newPatterns.forEach((theme, idx) => {
    const template = RITUAL_TEMPLATES.blessing;
    rituals.push({
      id: `blessing-${idx}`,
      theme,
      themeZh: theme,
      type: 'blessing',
      title: template.title(theme),
      titleZh: template.titleZh(theme),
      intention: template.intention(theme),
      intentionZh: template.intentionZh(theme),
      steps: template.steps(theme),
      ancestralVoice: template.ancestralVoice(theme),
      ancestralVoiceZh: template.ancestralVoiceZh(theme),
      reflectionQuestions: template.reflectionQuestions(theme),
      reflectionQuestionsZh: template.reflectionQuestionsZh(theme),
      closingStatement: template.closingStatement(theme),
      closingStatementZh: template.closingStatementZh(theme),
      materials: template.materials,
      materialsZh: template.materialsZh
    });
  });

  // Integration rituals for inherited themes
  position.inheritedThemes.forEach((theme, idx) => {
    const template = RITUAL_TEMPLATES.integration;
    rituals.push({
      id: `integration-${idx}`,
      theme,
      themeZh: theme,
      type: 'integration',
      title: template.title(theme),
      titleZh: template.titleZh(theme),
      intention: template.intention(theme),
      intentionZh: template.intentionZh(theme),
      steps: template.steps(theme),
      ancestralVoice: template.ancestralVoice(theme),
      ancestralVoiceZh: template.ancestralVoiceZh(theme),
      reflectionQuestions: template.reflectionQuestions(theme),
      reflectionQuestionsZh: template.reflectionQuestionsZh(theme),
      closingStatement: template.closingStatement(theme),
      closingStatementZh: template.closingStatementZh(theme),
      materials: template.materials,
      materialsZh: template.materialsZh
    });
  });

  return rituals;
}

/**
 * Build complete ritual collection
 */
export function buildRitualCollection(
  position: PilgrimPosition,
  pilgrimName?: string
): RitualCollection {
  const rituals = generateAncestralRituals(position);

  // Calculate total duration
  let totalMinutes = 0;
  rituals.forEach(r => {
    r.steps.forEach(s => {
      if (s.duration) {
        const match = s.duration.match(/(\d+)/);
        if (match) totalMinutes += parseInt(match[1]);
      }
    });
  });

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalDuration = hours > 0
    ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`
    : `${totalMinutes} minutes`;

  const name = pilgrimName || 'beloved pilgrim';
  const nameZh = pilgrimName || '亲爱的朝圣者';

  return {
    pilgrimName,
    position,
    rituals,
    openingInvocation: `${name}, you stand at the threshold of ancestral healing. These rituals connect you to ${position.ancestorCount} generation${position.ancestorCount !== 1 ? 's' : ''} behind you and ${position.descendantCount} generation${position.descendantCount !== 1 ? 's' : ''} ahead. Approach with reverence and openness.`,
    openingInvocationZh: `${nameZh}，你站在祖先疗愈的门槛上。这些仪式将你与身后的${position.ancestorCount}代人和前方的${position.descendantCount}代人连接。以虔诚和开放的心态进行。`,
    closingBlessing: `The rituals are complete. What was bound is released. What was seeded is growing. What was inherited is honored. May peace flow through all generations.`,
    closingBlessingZh: `仪式完成。被束缚的已释放。被播种的在生长。被继承的受尊崇。愿平安流过所有世代。`,
    totalDuration
  };
}

// ==================== RITUAL HELPERS ====================

/**
 * Get rituals by type
 */
export function getRitualsByType(collection: RitualCollection, type: RitualType): AncestralRitual[] {
  return collection.rituals.filter(r => r.type === type);
}

/**
 * Get ritual by theme
 */
export function getRitualByTheme(collection: RitualCollection, theme: string): AncestralRitual | undefined {
  return collection.rituals.find(r =>
    r.theme.toLowerCase().includes(theme.toLowerCase()) ||
    theme.toLowerCase().includes(r.theme.toLowerCase())
  );
}

/**
 * Format ritual for voice output (TTS-ready)
 */
export function formatRitualForVoice(ritual: AncestralRitual, lang: 'en' | 'zh' = 'en'): string[] {
  const lines: string[] = [];

  // Title and intention
  lines.push(lang === 'zh' ? ritual.titleZh || ritual.title : ritual.title);
  lines.push('');
  lines.push(lang === 'zh' ? ritual.intentionZh || ritual.intention : ritual.intention);
  lines.push('');

  // Steps
  ritual.steps.forEach(step => {
    lines.push(lang === 'zh' ? step.actionZh || step.action : step.action);
    lines.push('');
  });

  // Ancestral voice
  lines.push(lang === 'zh' ? ritual.ancestralVoiceZh || ritual.ancestralVoice : ritual.ancestralVoice);
  lines.push('');

  // Closing
  lines.push(lang === 'zh' ? ritual.closingStatementZh || ritual.closingStatement : ritual.closingStatement);

  return lines;
}

/**
 * Get materials list for all rituals
 */
export function getAllMaterials(collection: RitualCollection, lang: 'en' | 'zh' = 'en'): string[] {
  const materials = new Set<string>();

  collection.rituals.forEach(r => {
    const mats = lang === 'zh' ? (r.materialsZh || r.materials) : r.materials;
    mats?.forEach(m => materials.add(m));
  });

  return Array.from(materials);
}

/**
 * Get ritual type label
 */
export function getRitualTypeLabel(type: RitualType, lang: 'en' | 'zh' = 'en'): string {
  const labels: Record<RitualType, { en: string; zh: string }> = {
    healing: { en: 'Healing', zh: '疗愈' },
    release: { en: 'Release', zh: '释放' },
    integration: { en: 'Integration', zh: '整合' },
    blessing: { en: 'Blessing', zh: '祝福' },
    acknowledgment: { en: 'Acknowledgment', zh: '感恩' },
    activation: { en: 'Activation', zh: '激活' }
  };
  return labels[type][lang];
}

// ==================== EXPORTS ====================

export {
  generateAncestralRituals,
  buildRitualCollection,
  getRitualsByType,
  getRitualByTheme,
  formatRitualForVoice,
  getAllMaterials,
  getRitualTypeLabel
};
