/**
 * ============================================
 * PILGRIM'S ANCESTRAL INITIATION CEREMONY
 * Ceremonial onboarding into the ancestral system
 *
 * This is the formal entry ritual that transforms
 * a visitor into an initiated pilgrim of the temple.
 *
 * Stages:
 * 1. Crossing the Threshold
 * 2. Acknowledging the Lineage
 * 3. Offering of Presence
 * 4. Binding of Threads
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface InitiationInstruction {
  text: string;
  textZh: string;
  action?: 'breathe' | 'write' | 'visualize' | 'speak' | 'light' | 'offer';
}

export interface InitiationStage {
  id: string;
  title: string;
  titleZh: string;
  instructions: InitiationInstruction[];
  ancestorVoice: string;
  ancestorVoiceZh: string;
  lunaGuidance?: string;
  lunaGuidanceZh?: string;
  duration?: number; // seconds
  requiredInput?: 'names' | 'theme' | 'intention' | 'none';
}

export interface InitiationCeremony {
  id: string;
  name: string;
  nameZh: string;
  stages: InitiationStage[];
  openingInvocation: string;
  openingInvocationZh: string;
  closingBlessing: string;
  closingBlessingZh: string;
  totalDuration: number;
}

export interface InitiationProgress {
  ceremonyId: string;
  currentStageIndex: number;
  completedStages: string[];
  pilgrimInputs: Record<string, string>;
  startedAt: number;
  isComplete: boolean;
}

// ==================== CEREMONY BUILDER ====================

/**
 * Build the standard initiation ceremony
 */
export function buildInitiationCeremony(): InitiationCeremony {
  const stages: InitiationStage[] = [
    {
      id: 'threshold',
      title: 'Crossing the Threshold',
      titleZh: '跨越门槛',
      instructions: [
        {
          text: 'Close your eyes and take three deep breaths.',
          textZh: '闭上眼，深呼吸三次。',
          action: 'breathe'
        },
        {
          text: 'Quietly say in your heart: "I am willing to enter the Ancestral Temple."',
          textZh: '在心中轻声说：「我愿意进入祖系之殿。」',
          action: 'speak'
        }
      ],
      ancestorVoice: 'We have been waiting for you at the gate.',
      ancestorVoiceZh: '我们在门口等待你已久。',
      lunaGuidance: 'The threshold is not just physical. It is the moment you choose to acknowledge your lineage.',
      lunaGuidanceZh: '门槛不仅仅是物理的。它是你选择承认血脉的那一刻。',
      duration: 60,
      requiredInput: 'none'
    },
    {
      id: 'acknowledgment',
      title: 'Acknowledging the Lineage',
      titleZh: '承认血脉',
      instructions: [
        {
          text: 'Write down the names of three ancestors you remember.',
          textZh: '写下你记得的三位祖先的名字。',
          action: 'write'
        },
        {
          text: 'If you do not know names, write their roles: grandfather, grandmother, father, mother.',
          textZh: '若你不知道名字，写下他们的角色：祖父、祖母、父亲、母亲。',
          action: 'write'
        }
      ],
      ancestorVoice: 'When you remember us, we are with you.',
      ancestorVoiceZh: '你记得我们，我们便与你同在。',
      lunaGuidance: 'Even names forgotten leave echoes. The act of acknowledgment opens the channel.',
      lunaGuidanceZh: '即使被遗忘的名字也会留下回响。承认的行为打开了通道。',
      duration: 120,
      requiredInput: 'names'
    },
    {
      id: 'offering',
      title: 'Offering of Presence',
      titleZh: '呈献存在',
      instructions: [
        {
          text: 'Light a candle or visualize a beam of light.',
          textZh: '点一支蜡烛或想象一束光。',
          action: 'light'
        },
        {
          text: 'Offer this light to your lineage.',
          textZh: '将这束光献给你的祖系。',
          action: 'offer'
        }
      ],
      ancestorVoice: 'Your light, we have received.',
      ancestorVoiceZh: '你的光，我们已收下。',
      lunaGuidance: 'Light is the oldest offering. It represents your presence, your attention, your care.',
      lunaGuidanceZh: '光是最古老的供品。它代表你的存在、你的关注、你的关怀。',
      duration: 90,
      requiredInput: 'none'
    },
    {
      id: 'binding',
      title: 'Binding of Threads',
      titleZh: '绑定丝线',
      instructions: [
        {
          text: 'Write down one theme you wish to heal or understand.',
          textZh: '写下你希望疗愈或理解的一个主题。',
          action: 'write'
        },
        {
          text: 'Quietly say: "May this theme be transformed through me."',
          textZh: '轻声说：「愿此主题在我身上得到转化。」',
          action: 'speak'
        }
      ],
      ancestorVoice: 'Your wish has been heard.',
      ancestorVoiceZh: '你的愿望已被听见。',
      lunaGuidance: 'The thread you bind today becomes the path you walk. Choose with intention.',
      lunaGuidanceZh: '你今天绑定的丝线成为你走的路。以意愿选择。',
      duration: 90,
      requiredInput: 'theme'
    }
  ];

  const totalDuration = stages.reduce((sum, s) => sum + (s.duration || 60), 0);

  return {
    id: `initiation-${Date.now()}`,
    name: 'Pilgrim\'s Ancestral Initiation',
    nameZh: '行者的祖系启蒙',
    stages,
    openingInvocation: 'The gates of the Ancestral Temple stand before you. With reverence and intention, you prepare to cross.',
    openingInvocationZh: '祖系圣殿的门在你面前敞开。以敬意与意愿，你准备跨越。',
    closingBlessing: 'You are now initiated into the Ancestral Temple. The lineage recognizes you. Walk with their blessing.',
    closingBlessingZh: '你现在已被祖系圣殿启蒙。血脉认出了你。带着他们的祝福行走。',
    totalDuration
  };
}

// ==================== PROGRESS TRACKING ====================

/**
 * Initialize initiation progress
 */
export function initializeProgress(ceremony: InitiationCeremony): InitiationProgress {
  return {
    ceremonyId: ceremony.id,
    currentStageIndex: 0,
    completedStages: [],
    pilgrimInputs: {},
    startedAt: Date.now(),
    isComplete: false
  };
}

/**
 * Complete a stage and advance
 */
export function completeStage(
  progress: InitiationProgress,
  ceremony: InitiationCeremony,
  stageId: string,
  input?: string
): InitiationProgress {
  const stage = ceremony.stages.find(s => s.id === stageId);
  if (!stage) return progress;

  const updatedInputs = { ...progress.pilgrimInputs };
  if (input && stage.requiredInput && stage.requiredInput !== 'none') {
    updatedInputs[stage.requiredInput] = input;
  }

  const completedStages = [...progress.completedStages, stageId];
  const nextIndex = progress.currentStageIndex + 1;
  const isComplete = nextIndex >= ceremony.stages.length;

  return {
    ...progress,
    currentStageIndex: nextIndex,
    completedStages,
    pilgrimInputs: updatedInputs,
    isComplete
  };
}

/**
 * Get current stage
 */
export function getCurrentStage(
  progress: InitiationProgress,
  ceremony: InitiationCeremony
): InitiationStage | null {
  if (progress.isComplete) return null;
  return ceremony.stages[progress.currentStageIndex] || null;
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(
  progress: InitiationProgress,
  ceremony: InitiationCeremony
): number {
  return Math.round((progress.completedStages.length / ceremony.stages.length) * 100);
}

// ==================== FORMATTING ====================

/**
 * Format ceremony for display
 */
export function formatCeremonyForDisplay(
  ceremony: InitiationCeremony,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push(lang === 'zh' ? ceremony.nameZh : ceremony.name);
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(lang === 'zh' ? ceremony.openingInvocationZh : ceremony.openingInvocation);
  lines.push('');
  lines.push('---');

  ceremony.stages.forEach((stage, idx) => {
    const title = lang === 'zh' ? stage.titleZh : stage.title;
    lines.push('');
    lines.push(`【${idx + 1}. ${title}】`);

    stage.instructions.forEach(inst => {
      const text = lang === 'zh' ? inst.textZh : inst.text;
      lines.push(`  • ${text}`);
    });

    const voice = lang === 'zh' ? stage.ancestorVoiceZh : stage.ancestorVoice;
    lines.push('');
    lines.push(`  祖先之声 / Ancestral Voice: "${voice}"`);

    if (stage.lunaGuidance) {
      const guidance = lang === 'zh' ? stage.lunaGuidanceZh : stage.lunaGuidance;
      lines.push(`  Luna: ${guidance}`);
    }
  });

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(lang === 'zh' ? ceremony.closingBlessingZh : ceremony.closingBlessing);
  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Format ceremony for voice output (TTS)
 */
export function formatCeremonyForVoice(
  ceremony: InitiationCeremony,
  lang: 'en' | 'zh' = 'en'
): string[] {
  const lines: string[] = [];

  lines.push(lang === 'zh' ? ceremony.openingInvocationZh : ceremony.openingInvocation);
  lines.push(''); // pause

  ceremony.stages.forEach(stage => {
    const title = lang === 'zh' ? stage.titleZh : stage.title;
    lines.push(title);
    lines.push(''); // pause

    stage.instructions.forEach(inst => {
      const text = lang === 'zh' ? inst.textZh : inst.text;
      lines.push(text);
    });

    lines.push(''); // pause

    const voice = lang === 'zh' ? stage.ancestorVoiceZh : stage.ancestorVoice;
    lines.push(voice);
    lines.push(''); // pause
  });

  lines.push(lang === 'zh' ? ceremony.closingBlessingZh : ceremony.closingBlessing);

  return lines;
}

/**
 * Get stage by ID
 */
export function getStageById(ceremony: InitiationCeremony, stageId: string): InitiationStage | null {
  return ceremony.stages.find(s => s.id === stageId) || null;
}

// ==================== EXPORTS ====================

export {
  buildInitiationCeremony,
  initializeProgress,
  completeStage,
  getCurrentStage,
  getProgressPercentage,
  formatCeremonyForDisplay,
  formatCeremonyForVoice,
  getStageById
};
