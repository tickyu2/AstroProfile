/**
 * ============================================
 * PILGRIM'S RITE OF PASSAGE
 * Full ceremonial sequence transforming visitor
 * into initiated pilgrim
 *
 * This is the complete rite, more elaborate than
 * the basic initiation ceremony:
 *
 * Phases:
 * 1. Arrival at the Ancestral Gate
 * 2. Recognition of Lineage
 * 3. Offering of Light
 * 4. Binding of Threads
 * 5. Emergence as Pilgrim
 *
 * The rite creates a sacred container for
 * ancestral communion.
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface RiteInstruction {
  text: string;
  textZh: string;
  action?: 'breathe' | 'write' | 'visualize' | 'speak' | 'light' | 'offer' | 'move' | 'feel';
  duration?: number; // seconds
}

export interface RitePhase {
  id: string;
  title: string;
  titleZh: string;
  symbol: string;
  instructions: RiteInstruction[];
  ancestorVoice: string;
  ancestorVoiceZh: string;
  lunaWitness: string;
  lunaWitnessZh: string;
  pilgrimAffirmation?: string;
  pilgrimAffirmationZh?: string;
  requiredOffering?: 'names' | 'light' | 'intention' | 'theme' | 'breath';
  threshold?: boolean; // Marks a critical moment
}

export interface RiteOfPassage {
  id: string;
  name: string;
  nameZh: string;
  phases: RitePhase[];
  sacredOpening: string;
  sacredOpeningZh: string;
  sacredClosing: string;
  sacredClosingZh: string;
  totalDuration: number;
  pilgrimTransformation: string;
  pilgrimTransformationZh: string;
}

export interface RiteProgress {
  riteId: string;
  currentPhaseIndex: number;
  completedPhases: string[];
  offerings: Record<string, string>;
  startedAt: number;
  thresholdsCrossed: number;
  isComplete: boolean;
}

// ==================== RITE BUILDER ====================

/**
 * Build the complete Rite of Passage
 */
export function buildRiteOfPassage(): RiteOfPassage {
  const phases: RitePhase[] = [
    {
      id: 'arrival',
      title: 'Arrival at the Ancestral Gate',
      titleZh: '抵达祖系之门',
      symbol: '🚪',
      instructions: [
        {
          text: 'Stand before the gate. Feel its ancient presence.',
          textZh: '站在门前。感受它古老的存在。',
          action: 'feel',
          duration: 10
        },
        {
          text: 'Take three deep breaths. With each breath, release the concerns of the day.',
          textZh: '深呼吸三次。每一次呼吸，释放一天的担忧。',
          action: 'breathe',
          duration: 30
        },
        {
          text: 'Quietly speak: "I am willing to enter the Ancestral Temple."',
          textZh: '轻声说：「我愿意踏入祖系之殿。」',
          action: 'speak',
          duration: 10
        }
      ],
      ancestorVoice: 'We have been waiting for you at the gate for a long time.',
      ancestorVoiceZh: '我们在门口等待你已久。',
      lunaWitness: 'The gate recognizes your intention. The ancestors sense your approach.',
      lunaWitnessZh: '门认出了你的意愿。祖先感知到你的接近。',
      threshold: true,
      requiredOffering: 'breath'
    },
    {
      id: 'recognition',
      title: 'Recognition of Lineage',
      titleZh: '承认血脉',
      symbol: '👁️',
      instructions: [
        {
          text: 'Write down the names of ancestors you remember.',
          textZh: '写下你记得的祖先的名字。',
          action: 'write',
          duration: 60
        },
        {
          text: 'If names are unknown, write their roles: grandfather, grandmother, father, mother.',
          textZh: '若你不知道名字，写下他们的角色：祖父、祖母、父亲、母亲。',
          action: 'write',
          duration: 30
        },
        {
          text: 'Place your hand on your heart. Feel the blood that connects you to them.',
          textZh: '将手放在心口。感受连接你与他们的血液。',
          action: 'feel',
          duration: 20
        }
      ],
      ancestorVoice: 'When you remember us, we are with you.',
      ancestorVoiceZh: '你记得我们，我们便与你同在。',
      lunaWitness: 'Even names forgotten leave echoes. The act of acknowledgment opens the channel.',
      lunaWitnessZh: '即使被遗忘的名字也会留下回响。承认的行为打开了通道。',
      pilgrimAffirmation: 'I acknowledge my lineage. I carry their blood.',
      pilgrimAffirmationZh: '我承认我的血脉。我承载着他们的血液。',
      requiredOffering: 'names'
    },
    {
      id: 'offering',
      title: 'Offering of Light',
      titleZh: '呈献光明',
      symbol: '🕯️',
      instructions: [
        {
          text: 'Light a candle or visualize a warm, golden light.',
          textZh: '点一支蜡烛或想象一束温暖的金色光芒。',
          action: 'light',
          duration: 15
        },
        {
          text: 'Hold this light in your awareness. Feel its warmth.',
          textZh: '将这光保持在你的意识中。感受它的温暖。',
          action: 'feel',
          duration: 20
        },
        {
          text: 'Offer this light to your lineage. Say: "I offer my presence to you."',
          textZh: '将这光献给你的祖系。说：「我将我的存在献给你们。」',
          action: 'offer',
          duration: 15
        }
      ],
      ancestorVoice: 'Your light, we have received. It illuminates the path between us.',
      ancestorVoiceZh: '你的光，我们已收下。它照亮了我们之间的道路。',
      lunaWitness: 'Light is the oldest offering. It represents your presence, your attention, your care.',
      lunaWitnessZh: '光是最古老的供品。它代表你的存在、你的关注、你的关怀。',
      threshold: true,
      requiredOffering: 'light'
    },
    {
      id: 'binding',
      title: 'Binding of Threads',
      titleZh: '绑定丝线',
      symbol: '🧵',
      instructions: [
        {
          text: 'Write down one theme you wish to heal or understand.',
          textZh: '写下你希望疗愈或理解的一个主题。',
          action: 'write',
          duration: 45
        },
        {
          text: 'Visualize this theme as a thread connecting you to your ancestors.',
          textZh: '将这个主题想象成连接你与祖先的一根丝线。',
          action: 'visualize',
          duration: 20
        },
        {
          text: 'Speak: "May this theme be transformed through me."',
          textZh: '轻声说：「愿此主题在我身上得到转化。」',
          action: 'speak',
          duration: 10
        }
      ],
      ancestorVoice: 'Your wish has been heard. The thread is now bound.',
      ancestorVoiceZh: '你的愿望已被听见。丝线已被绑定。',
      lunaWitness: 'The thread you bind today becomes the path you walk. Choose with intention.',
      lunaWitnessZh: '你今天绑定的丝线成为你走的路。以意愿选择。',
      pilgrimAffirmation: 'I bind this thread to my journey. I walk with intention.',
      pilgrimAffirmationZh: '我将这丝线绑定到我的旅程。我以意愿行走。',
      requiredOffering: 'theme'
    },
    {
      id: 'emergence',
      title: 'Emergence as Pilgrim',
      titleZh: '作为行者涌现',
      symbol: '🚶',
      instructions: [
        {
          text: 'Close your eyes. Visualize a door opening before you.',
          textZh: '闭上眼。想象一扇门在你面前打开。',
          action: 'visualize',
          duration: 15
        },
        {
          text: 'Step through the door. This symbolizes your emergence as a pilgrim.',
          textZh: '跨过去。这象征你成为行者的涌现。',
          action: 'move',
          duration: 10
        },
        {
          text: 'Speak: "I emerge as a pilgrim of my lineage."',
          textZh: '轻声说：「我作为血脉的行者涌现。」',
          action: 'speak',
          duration: 10
        }
      ],
      ancestorVoice: 'You are now prepared to walk your path. We walk with you.',
      ancestorVoiceZh: '你已准备好走你的路。我们与你同行。',
      lunaWitness: 'The rite is complete. You are no longer a visitor. You are a pilgrim.',
      lunaWitnessZh: '仪式完成。你不再是访客。你是行者。',
      pilgrimAffirmation: 'I am a pilgrim of my lineage. I walk with ancestors and descendants.',
      pilgrimAffirmationZh: '我是血脉的行者。我与祖先和后代同行。',
      threshold: true
    }
  ];

  const totalDuration = phases.reduce((sum, phase) => {
    const phaseDuration = phase.instructions.reduce((s, i) => s + (i.duration || 15), 0);
    return sum + phaseDuration + 30; // Extra time for voices
  }, 0);

  return {
    id: `rite-${Date.now()}`,
    name: "Pilgrim's Rite of Passage",
    nameZh: '行者的通过仪式',
    phases,
    sacredOpening: 'The gates of the Ancestral Temple stand before you. With reverence and intention, you prepare to undergo the Rite of Passage.',
    sacredOpeningZh: '祖系圣殿的门在你面前敞开。以敬意与意愿，你准备进行通过仪式。',
    sacredClosing: 'The Rite of Passage is complete. You have been transformed. The lineage recognizes you as a pilgrim. Walk with their blessing, carry their wisdom, and continue their story.',
    sacredClosingZh: '通过仪式完成。你已被转化。血脉认出你是行者。带着他们的祝福行走，承载他们的智慧，继续他们的故事。',
    totalDuration,
    pilgrimTransformation: 'From visitor to pilgrim. From observer to participant. From separate to connected.',
    pilgrimTransformationZh: '从访客到行者。从观察者到参与者。从分离到连接。'
  };
}

// ==================== PROGRESS TRACKING ====================

/**
 * Initialize rite progress
 */
export function initializeRiteProgress(rite: RiteOfPassage): RiteProgress {
  return {
    riteId: rite.id,
    currentPhaseIndex: 0,
    completedPhases: [],
    offerings: {},
    startedAt: Date.now(),
    thresholdsCrossed: 0,
    isComplete: false
  };
}

/**
 * Complete a phase and advance
 */
export function completePhase(
  progress: RiteProgress,
  rite: RiteOfPassage,
  phaseId: string,
  offering?: string
): RiteProgress {
  const phase = rite.phases.find(p => p.id === phaseId);
  if (!phase) return progress;

  const updatedOfferings = { ...progress.offerings };
  if (offering && phase.requiredOffering) {
    updatedOfferings[phase.requiredOffering] = offering;
  }

  const completedPhases = [...progress.completedPhases, phaseId];
  const nextIndex = progress.currentPhaseIndex + 1;
  const isComplete = nextIndex >= rite.phases.length;
  const thresholdsCrossed = phase.threshold
    ? progress.thresholdsCrossed + 1
    : progress.thresholdsCrossed;

  return {
    ...progress,
    currentPhaseIndex: nextIndex,
    completedPhases,
    offerings: updatedOfferings,
    thresholdsCrossed,
    isComplete
  };
}

/**
 * Get current phase
 */
export function getCurrentPhase(
  progress: RiteProgress,
  rite: RiteOfPassage
): RitePhase | null {
  if (progress.isComplete) return null;
  return rite.phases[progress.currentPhaseIndex] || null;
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(
  progress: RiteProgress,
  rite: RiteOfPassage
): number {
  return Math.round((progress.completedPhases.length / rite.phases.length) * 100);
}

/**
 * Get remaining phases
 */
export function getRemainingPhases(
  progress: RiteProgress,
  rite: RiteOfPassage
): RitePhase[] {
  return rite.phases.slice(progress.currentPhaseIndex);
}

// ==================== FORMATTING ====================

/**
 * Format rite for display
 */
export function formatRiteForDisplay(
  rite: RiteOfPassage,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push(lang === 'zh' ? rite.nameZh : rite.name);
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push(lang === 'zh' ? rite.sacredOpeningZh : rite.sacredOpening);
  lines.push('');
  lines.push('---');

  rite.phases.forEach((phase, idx) => {
    const title = lang === 'zh' ? phase.titleZh : phase.title;
    const threshold = phase.threshold ? ' ★' : '';
    lines.push('');
    lines.push(`${phase.symbol} 【${idx + 1}. ${title}${threshold}】`);

    phase.instructions.forEach(inst => {
      const text = lang === 'zh' ? inst.textZh : inst.text;
      lines.push(`  • ${text}`);
    });

    const voice = lang === 'zh' ? phase.ancestorVoiceZh : phase.ancestorVoice;
    lines.push('');
    lines.push(`  祖先 / Ancestors: "${voice}"`);

    const witness = lang === 'zh' ? phase.lunaWitnessZh : phase.lunaWitness;
    lines.push(`  Luna: ${witness}`);

    if (phase.pilgrimAffirmation) {
      const affirmation = lang === 'zh' ? phase.pilgrimAffirmationZh : phase.pilgrimAffirmation;
      lines.push(`  行者 / Pilgrim: "${affirmation}"`);
    }
  });

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(lang === 'zh' ? rite.sacredClosingZh : rite.sacredClosing);
  lines.push('');
  lines.push(lang === 'zh' ? rite.pilgrimTransformationZh : rite.pilgrimTransformation);
  lines.push('');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Format rite for voice output (TTS)
 */
export function formatRiteForVoice(
  rite: RiteOfPassage,
  lang: 'en' | 'zh' = 'en'
): string[] {
  const lines: string[] = [];

  lines.push(lang === 'zh' ? rite.sacredOpeningZh : rite.sacredOpening);
  lines.push(''); // pause

  rite.phases.forEach(phase => {
    const title = lang === 'zh' ? phase.titleZh : phase.title;
    lines.push(title);
    lines.push(''); // pause

    phase.instructions.forEach(inst => {
      const text = lang === 'zh' ? inst.textZh : inst.text;
      lines.push(text);
    });

    lines.push(''); // pause

    const voice = lang === 'zh' ? phase.ancestorVoiceZh : phase.ancestorVoice;
    lines.push(voice);
    lines.push(''); // pause

    if (phase.pilgrimAffirmation) {
      const affirmation = lang === 'zh' ? phase.pilgrimAffirmationZh : phase.pilgrimAffirmation;
      lines.push(affirmation);
      lines.push(''); // pause
    }
  });

  lines.push(lang === 'zh' ? rite.sacredClosingZh : rite.sacredClosing);

  return lines;
}

/**
 * Get phase by ID
 */
export function getPhaseById(rite: RiteOfPassage, phaseId: string): RitePhase | null {
  return rite.phases.find(p => p.id === phaseId) || null;
}

/**
 * Get threshold phases
 */
export function getThresholdPhases(rite: RiteOfPassage): RitePhase[] {
  return rite.phases.filter(p => p.threshold);
}

// ==================== EXPORTS ====================

export {
  buildRiteOfPassage,
  initializeRiteProgress,
  completePhase,
  getCurrentPhase,
  getProgressPercentage,
  getRemainingPhases,
  formatRiteForDisplay,
  formatRiteForVoice,
  getPhaseById,
  getThresholdPhases
};
