/**
 * ============================================
 * GENERATIONAL HEALING PATH
 * A structured, multi-step ritual journey
 * that guides the pilgrim through ancestral healing
 *
 * This is a ritual journey, not a single ritual.
 * Each step builds on the last.
 * ============================================
 */

import { PilgrimPosition } from './journeyWithGenerations';
import { AncestralRitual, RitualCollection } from './ancestralRitual';
import { AncestralArchetype } from './mythosLayer';

// ==================== DATA MODEL ====================

export interface HealingPathStep {
  stepNumber: number;
  id: string;
  title: string;
  titleZh?: string;
  theme: string;
  phase: 'preparation' | 'release' | 'integration' | 'blessing' | 'completion';
  instructions: string[];
  instructionsZh?: string[];
  ancestralVoice: string;
  ancestralVoiceZh?: string;
  reflection: string;
  reflectionZh?: string;
  duration: string;
  materials?: string[];
  materialsZh?: string[];
}

export interface HealingPath {
  id: string;
  pilgrimName?: string;
  title: string;
  titleZh?: string;
  intention: string;
  intentionZh?: string;
  steps: HealingPathStep[];
  totalDuration: string;
  phases: HealingPhase[];
  openingCeremony: CeremonyText;
  closingCeremony: CeremonyText;
  archetypeGuidance?: ArchetypeGuidance;
}

export interface HealingPhase {
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  stepCount: number;
}

export interface CeremonyText {
  title: string;
  titleZh: string;
  text: string;
  textZh: string;
  actions: string[];
  actionsZh: string[];
}

export interface ArchetypeGuidance {
  archetype: AncestralArchetype;
  guidance: string;
  guidanceZh: string;
}

// ==================== PATH BUILDER ====================

/**
 * Build a complete healing path from position and rituals
 */
export function buildHealingPath(
  position: PilgrimPosition,
  rituals: AncestralRitual[],
  archetype?: AncestralArchetype,
  pilgrimName?: string
): HealingPath {
  const steps: HealingPathStep[] = [];
  let stepNumber = 0;

  // Phase 1: Preparation
  steps.push({
    stepNumber: ++stepNumber,
    id: `step-${stepNumber}`,
    title: 'Preparation: Creating Sacred Space',
    titleZh: '准备：创造神圣空间',
    theme: 'foundation',
    phase: 'preparation',
    instructions: [
      'Find a quiet, private space where you will not be disturbed.',
      'Gather any materials you will need for the journey ahead.',
      'Light a candle to mark the boundary between ordinary and sacred time.',
      'Take three deep breaths, feeling your connection to the earth below and sky above.'
    ],
    instructionsZh: [
      '找一个安静、私密的空间，确保不会被打扰。',
      '收集接下来旅程所需的任何材料。',
      '点燃一支蜡烛，标记普通时间与神圣时间的界限。',
      '深呼吸三次，感受你与脚下大地和头顶天空的连接。'
    ],
    ancestralVoice: 'We have waited for this moment. The door is opening.',
    ancestralVoiceZh: '我们一直在等待这一刻。门正在打开。',
    reflection: 'What do you hope to receive from your ancestors on this journey?',
    reflectionZh: '在这段旅程中，你希望从祖先那里得到什么？',
    duration: '10-15 minutes',
    materials: ['Candle', 'Matches', 'Journal', 'Pen'],
    materialsZh: ['蜡烛', '火柴', '日记本', '笔']
  });

  // Phase 2: Release (for broken patterns)
  position.brokenPatterns.forEach((theme, idx) => {
    const ritual = rituals.find(r => r.type === 'release' && r.theme === theme);

    steps.push({
      stepNumber: ++stepNumber,
      id: `step-${stepNumber}`,
      title: `Release: ${theme}`,
      titleZh: `释放：${theme}`,
      theme,
      phase: 'release',
      instructions: ritual?.steps.map(s => s.action) || [
        `Write down everything you inherited about "${theme}" from your ancestors.`,
        'Read what you wrote aloud, witnessing without judgment.',
        `Fold the paper and say: "I honor what you carried. I choose to release this pattern."`,
        'Tear the paper into small pieces, symbolizing the breaking of the cycle.'
      ],
      instructionsZh: ritual?.steps.map(s => s.actionZh || s.action) || [
        `写下你从祖先那里继承的关于"${theme}"的一切。`,
        '大声朗读你写的内容，不带评判地见证。',
        `折起纸，说："我尊崇你们所承载的。我选择释放这个模式。"`,
        '将纸撕成小碎片，象征循环的打破。'
      ],
      ancestralVoice: ritual?.ancestralVoice || `We see you releasing what we could not release. The chain of ${theme} loosens.`,
      ancestralVoiceZh: ritual?.ancestralVoiceZh || `我们看见你放下我们无法放下的。${theme}的锁链松开了。`,
      reflection: `How has ${theme} affected your life? How does it feel to name it?`,
      reflectionZh: `${theme}如何影响了你的生活？给它命名是什么感觉？`,
      duration: '20-30 minutes',
      materials: ritual?.materials || ['Paper', 'Pen', 'Bowl or container'],
      materialsZh: ritual?.materialsZh || ['纸', '笔', '碗或容器']
    });
  });

  // Phase 3: Integration (for inherited themes)
  position.inheritedThemes.forEach((theme, idx) => {
    const ritual = rituals.find(r => r.type === 'integration' && r.theme === theme);

    steps.push({
      stepNumber: ++stepNumber,
      id: `step-${stepNumber}`,
      title: `Integration: ${theme}`,
      titleZh: `整合：${theme}`,
      theme,
      phase: 'integration',
      instructions: ritual?.steps.map(s => s.action) || [
        'Close your eyes and visualize your ancestors standing behind you.',
        `Imagine them passing a glowing light of "${theme}" from hand to hand until it reaches you.`,
        'Receive this light into your heart, feeling it settle into your body.',
        `Say: "I receive the gift of ${theme}. I honor how it was carried to me."`
      ],
      instructionsZh: ritual?.steps.map(s => s.actionZh || s.action) || [
        '闭上眼睛，想象你的祖先站在你身后。',
        `想象他们将"${theme}"的发光之光从手到手传递，直到它到达你。`,
        '将这道光接收到你的心中，感受它在你体内安顿。',
        `说："我接收${theme}的礼物。我尊崇它如何被传递给我。"`
      ],
      ancestralVoice: ritual?.ancestralVoice || `We gave what we could. ${theme} lives through you now in ways we could not imagine.`,
      ancestralVoiceZh: ritual?.ancestralVoiceZh || `我们给了我们所能给的。${theme}现在以我们无法想象的方式通过你活着。`,
      reflection: `How can you honor this inherited gift in your daily life?`,
      reflectionZh: `你如何能在日常生活中尊崇这份继承的礼物？`,
      duration: '15-20 minutes',
      materials: ['Quiet space'],
      materialsZh: ['安静的空间']
    });
  });

  // Phase 4: Blessing (for new patterns)
  position.newPatterns.forEach((theme, idx) => {
    const ritual = rituals.find(r => r.type === 'blessing' && r.theme === theme);

    steps.push({
      stepNumber: ++stepNumber,
      id: `step-${stepNumber}`,
      title: `Blessing: ${theme}`,
      titleZh: `祝福：${theme}`,
      theme,
      phase: 'blessing',
      instructions: ritual?.steps.map(s => s.action) || [
        'Light a fresh candle, representing the new pattern being born.',
        `Write down the qualities of "${theme}" you wish to pass to future generations.`,
        'Hold the paper near the flame (not in it) and visualize the words glowing with life.',
        `Say: "May this light illuminate ${theme} for all who follow me."`
      ],
      instructionsZh: ritual?.steps.map(s => s.actionZh || s.action) || [
        '点燃一支新蜡烛，代表新模式的诞生。',
        `写下你希望传递给未来世代的关于"${theme}"的品质。`,
        '将纸靠近火焰（不要接触）并想象文字闪耀着生命的光芒。',
        `说："愿此光为所有跟随我的人照亮${theme}。"`
      ],
      ancestralVoice: ritual?.ancestralVoice || `What you plant today becomes a forest. Your ${theme} will light the way for those yet unborn.`,
      ancestralVoiceZh: ritual?.ancestralVoiceZh || `你今天播下的将成为森林。你的${theme}将为尚未出生的人照亮道路。`,
      reflection: `What do you want your descendants to say about how you carried ${theme}?`,
      reflectionZh: `你希望你的后代怎么评价你承载${theme}的方式？`,
      duration: '15-20 minutes',
      materials: ['Candle', 'Paper', 'Pen'],
      materialsZh: ['蜡烛', '纸', '笔']
    });
  });

  // Phase 5: Completion
  steps.push({
    stepNumber: ++stepNumber,
    id: `step-${stepNumber}`,
    title: 'Completion: Sealing the Journey',
    titleZh: '完成：封印旅程',
    theme: 'completion',
    phase: 'completion',
    instructions: [
      'Take a moment to feel the entirety of the journey you have walked.',
      'Place both hands on your heart and breathe deeply.',
      'Say: "The healing is complete. What was bound is released. What was seeded is growing. What was inherited is honored."',
      'Blow out the candle, marking the return to ordinary time.',
      'Write a single sentence capturing what you received on this journey.'
    ],
    instructionsZh: [
      '花一点时间感受你所走过的整个旅程。',
      '双手放在心口，深呼吸。',
      '说："疗愈完成了。被束缚的已释放。被播种的在生长。被继承的受尊崇。"',
      '吹灭蜡烛，标记回归普通时间。',
      '写一句话捕捉你在这次旅程中收到的。'
    ],
    ancestralVoice: 'The circle is complete. We remain with you, always.',
    ancestralVoiceZh: '圆完成了。我们始终与你同在。',
    reflection: 'How do you feel different from when you began?',
    reflectionZh: '与开始时相比，你感觉有什么不同？',
    duration: '10-15 minutes',
    materials: ['Journal', 'Pen'],
    materialsZh: ['日记本', '笔']
  });

  // Calculate total duration
  const totalMinutes = steps.reduce((sum, step) => {
    const match = step.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 15);
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalDuration = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes` : `${mins} minutes`;

  // Build phases summary
  const phases: HealingPhase[] = [
    {
      name: 'Preparation',
      nameZh: '准备',
      description: 'Creating sacred space and setting intention',
      descriptionZh: '创造神圣空间并设定意图',
      stepCount: steps.filter(s => s.phase === 'preparation').length
    },
    {
      name: 'Release',
      nameZh: '释放',
      description: 'Releasing ancestral patterns that no longer serve',
      descriptionZh: '释放不再服务的祖传模式',
      stepCount: steps.filter(s => s.phase === 'release').length
    },
    {
      name: 'Integration',
      nameZh: '整合',
      description: 'Receiving and honoring inherited gifts',
      descriptionZh: '接收并尊崇继承的礼物',
      stepCount: steps.filter(s => s.phase === 'integration').length
    },
    {
      name: 'Blessing',
      nameZh: '祝福',
      description: 'Planting seeds for future generations',
      descriptionZh: '为未来世代播种',
      stepCount: steps.filter(s => s.phase === 'blessing').length
    },
    {
      name: 'Completion',
      nameZh: '完成',
      description: 'Sealing the healing and returning',
      descriptionZh: '封印疗愈并回归',
      stepCount: steps.filter(s => s.phase === 'completion').length
    }
  ];

  return {
    id: `healing-path-${Date.now()}`,
    pilgrimName,
    title: 'Ancestral Healing Journey',
    titleZh: '祖系疗愈之旅',
    intention: 'To honor, heal, and transform the ancestral patterns that flow through your lineage.',
    intentionZh: '尊崇、疗愈并转化流淌在你血脉中的祖传模式。',
    steps,
    totalDuration,
    phases,
    openingCeremony: {
      title: 'Opening the Sacred Space',
      titleZh: '打开神圣空间',
      text: 'I stand at the threshold between worlds. I call upon my ancestors, known and unknown, to witness and support this healing journey.',
      textZh: '我站在世界之间的门槛上。我呼唤我的祖先，已知的和未知的，来见证和支持这次疗愈之旅。',
      actions: ['Light a candle', 'Ring a bell or clap three times', 'State your intention aloud'],
      actionsZh: ['点燃蜡烛', '敲钟或拍手三次', '大声陈述你的意图']
    },
    closingCeremony: {
      title: 'Closing the Sacred Space',
      titleZh: '关闭神圣空间',
      text: 'The healing is complete. I thank my ancestors for their presence. The door between worlds closes, but the connection remains.',
      textZh: '疗愈完成了。我感谢祖先的临在。世界之间的门关闭了，但连接仍在。',
      actions: ['Blow out the candle', 'Ring a bell or clap three times', 'Touch the ground in gratitude'],
      actionsZh: ['吹灭蜡烛', '敲钟或拍手三次', '以感恩之心触摸大地']
    },
    archetypeGuidance: archetype ? {
      archetype,
      guidance: `As ${archetype.name}, your healing path has special significance. Focus on ${archetype.ritualFocus}`,
      guidanceZh: `作为${archetype.nameZh}，你的疗愈道路有特殊意义。专注于${archetype.ritualFocusZh}`
    } : undefined
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get steps by phase
 */
export function getStepsByPhase(path: HealingPath, phase: HealingPathStep['phase']): HealingPathStep[] {
  return path.steps.filter(s => s.phase === phase);
}

/**
 * Get step by number
 */
export function getStepByNumber(path: HealingPath, stepNumber: number): HealingPathStep | undefined {
  return path.steps.find(s => s.stepNumber === stepNumber);
}

/**
 * Get all materials needed
 */
export function getAllMaterials(path: HealingPath, lang: 'en' | 'zh' = 'en'): string[] {
  const materials = new Set<string>();
  path.steps.forEach(step => {
    const mats = lang === 'zh' ? (step.materialsZh || step.materials) : step.materials;
    mats?.forEach(m => materials.add(m));
  });
  return Array.from(materials);
}

/**
 * Format path for display
 */
export function formatHealingPathForDisplay(path: HealingPath, lang: 'en' | 'zh' = 'en'): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? path.titleZh || path.title : path.title}`);
  lines.push('');
  lines.push(`*${lang === 'zh' ? path.intentionZh || path.intention : path.intention}*`);
  lines.push('');
  lines.push(`**${lang === 'zh' ? '总时长' : 'Total Duration'}:** ${path.totalDuration}`);
  lines.push('');

  path.steps.forEach(step => {
    lines.push(`## ${lang === 'zh' ? step.titleZh || step.title : step.title}`);
    lines.push('');

    const instructions = lang === 'zh' ? (step.instructionsZh || step.instructions) : step.instructions;
    instructions.forEach((inst, idx) => {
      lines.push(`${idx + 1}. ${inst}`);
    });
    lines.push('');

    lines.push(`> ${lang === 'zh' ? step.ancestralVoiceZh || step.ancestralVoice : step.ancestralVoice}`);
    lines.push('');

    lines.push(`**${lang === 'zh' ? '反思' : 'Reflection'}:** ${lang === 'zh' ? step.reflectionZh || step.reflection : step.reflection}`);
    lines.push('');
  });

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  buildHealingPath,
  getStepsByPhase,
  getStepByNumber,
  getAllMaterials,
  formatHealingPathForDisplay
};
