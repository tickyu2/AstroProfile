/**
 * ============================================
 * ANCESTRAL PERSONA LAYER
 * Luna speaking as the lineage
 *
 * Multi-voice ancestral presence:
 * - Ancestor Chorus (collective voice)
 * - Generational Echo (specific generation)
 * - Ancestral Thread (theme carried across)
 * - Ancestral Witness (observing transformation)
 *
 * The pilgrim hears not just Luna,
 * but Luna channeling the voices of the lineage.
 * ============================================
 */

import { PilgrimPosition } from './journeyWithGenerations';
import { GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export type AncestralVoiceType = 'chorus' | 'echo' | 'thread' | 'witness';

export interface AncestralPersonaMessage {
  generationIndex: number;       // -2, -1, 0, +1
  generationLabel: string;       // "Grandparents", "Parents", "Self", "Children"
  generationLabelZh?: string;    // "祖父母", "父母", "自己", "子女"
  theme: string;                 // "career", "relationship", "migration", etc.
  voice: AncestralVoiceType;
  message: string;               // Luna's ancestral voice (English)
  messageZh?: string;            // Luna's ancestral voice (Chinese)
  intensity: 'whisper' | 'speak' | 'resonate' | 'thunder';
}

export interface AncestralPersonaLayer {
  pilgrimName?: string;
  position: PilgrimPosition;
  messages: AncestralPersonaMessage[];
  chorusVoice: string;           // Collective ancestor voice
  chorusVoiceZh?: string;
  witnessVoice: string;          // Observing voice
  witnessVoiceZh?: string;
  blessingVoice: string;         // Final blessing
  blessingVoiceZh?: string;
}

// ==================== VOICE TEMPLATES ====================

const VOICE_TEMPLATES = {
  chorus: {
    inherited: {
      en: (theme: string) => `We walked the path you now walk. The lesson of ${theme} unfolds through you as it unfolded through us.`,
      zh: (theme: string) => `我们曾走过你正在走的路。${theme}的课题在你身上继续展开，如同它曾在我们身上展开。`
    },
    collective: {
      en: (count: number) => `${count} generations stand behind you. Their wisdom flows into your present moment.`,
      zh: (count: number) => `${count}代人站在你身后。他们的智慧流入你的当下。`
    }
  },
  echo: {
    newPattern: {
      en: (theme: string) => `You plant the seed of ${theme} that will echo through generations yet unborn.`,
      zh: (theme: string) => `你在此处播下了${theme}的种子，它将在未出生的世代中回响。`
    },
    descendant: {
      en: (theme: string) => `Those who come after you will walk paths lit by your ${theme}.`,
      zh: (theme: string) => `你之后的人将行走在你的${theme}所照亮的道路上。`
    }
  },
  witness: {
    broken: {
      en: (theme: string) => `You end the cycle of ${theme} that we could not end. We watch in silence and gratitude.`,
      zh: (theme: string) => `你在此处终结了我们未能终结的${theme}循环。我们在静默与感恩中守望。`
    },
    liberation: {
      en: (theme: string) => `The chains of ${theme} release their hold. What bound us does not bind you.`,
      zh: (theme: string) => `${theme}的锁链松开了它的束缚。曾束缚我们的，不再束缚你。`
    }
  },
  thread: {
    continuous: {
      en: (theme: string, gens: number) => `The thread of ${theme} has woven through ${gens} generations. You carry its pattern forward.`,
      zh: (theme: string, gens: number) => `${theme}的丝线已穿越${gens}代人。你将它的图案继续向前编织。`
    },
    strengthened: {
      en: (theme: string) => `Where our ${theme} was a whisper, yours becomes a song.`,
      zh: (theme: string) => `我们的${theme}是低语，而你的成为了歌声。`
    }
  }
};

// ==================== PERSONA GENERATION ====================

/**
 * Generate ancestral persona messages for a journey step
 */
export function generateAncestralPersona(
  position: PilgrimPosition,
  stepThemes: string[],
  threads?: GenerationalThread[]
): AncestralPersonaMessage[] {
  const messages: AncestralPersonaMessage[] = [];

  // 1. Inherited themes → ancestor chorus
  position.inheritedThemes.forEach(theme => {
    const matchingTheme = findMatchingTheme(theme, stepThemes);
    if (matchingTheme) {
      messages.push({
        generationIndex: position.generationIndex - 1,
        generationLabel: 'Ancestors',
        generationLabelZh: '祖先',
        theme: matchingTheme,
        voice: 'chorus',
        message: VOICE_TEMPLATES.chorus.inherited.en(matchingTheme),
        messageZh: VOICE_TEMPLATES.chorus.inherited.zh(matchingTheme),
        intensity: 'resonate'
      });
    }
  });

  // 2. Broken patterns → ancestral witness
  position.brokenPatterns.forEach(theme => {
    const matchingTheme = findMatchingTheme(theme, stepThemes);
    if (matchingTheme) {
      messages.push({
        generationIndex: position.generationIndex,
        generationLabel: 'Self',
        generationLabelZh: '自己',
        theme: matchingTheme,
        voice: 'witness',
        message: VOICE_TEMPLATES.witness.broken.en(matchingTheme),
        messageZh: VOICE_TEMPLATES.witness.broken.zh(matchingTheme),
        intensity: 'thunder'
      });
    }
  });

  // 3. New patterns → generational echo
  position.newPatterns.forEach(theme => {
    const matchingTheme = findMatchingTheme(theme, stepThemes);
    if (matchingTheme) {
      messages.push({
        generationIndex: position.generationIndex + 1,
        generationLabel: 'Descendants',
        generationLabelZh: '后代',
        theme: matchingTheme,
        voice: 'echo',
        message: VOICE_TEMPLATES.echo.newPattern.en(matchingTheme),
        messageZh: VOICE_TEMPLATES.echo.newPattern.zh(matchingTheme),
        intensity: 'speak'
      });
    }
  });

  // 4. Thread messages (if threads provided)
  if (threads) {
    threads.forEach(thread => {
      const matchingTheme = findMatchingTheme(thread.theme, stepThemes);
      if (matchingTheme && thread.generations.length >= 2) {
        messages.push({
          generationIndex: position.generationIndex,
          generationLabel: 'Lineage',
          generationLabelZh: '血脉',
          theme: matchingTheme,
          voice: 'thread',
          message: VOICE_TEMPLATES.thread.continuous.en(matchingTheme, thread.generations.length),
          messageZh: VOICE_TEMPLATES.thread.continuous.zh(matchingTheme, thread.generations.length),
          intensity: 'resonate'
        });
      }
    });
  }

  return messages;
}

/**
 * Build the complete ancestral persona layer
 */
export function buildAncestralPersonaLayer(
  position: PilgrimPosition,
  stepThemes: string[],
  threads?: GenerationalThread[],
  pilgrimName?: string
): AncestralPersonaLayer {
  const messages = generateAncestralPersona(position, stepThemes, threads);

  // Generate collective voices
  const chorusVoice = generateChorusVoice(position);
  const witnessVoice = generateWitnessVoice(position);
  const blessingVoice = generateBlessingVoice(position, pilgrimName);

  return {
    pilgrimName,
    position,
    messages,
    chorusVoice: chorusVoice.en,
    chorusVoiceZh: chorusVoice.zh,
    witnessVoice: witnessVoice.en,
    witnessVoiceZh: witnessVoice.zh,
    blessingVoice: blessingVoice.en,
    blessingVoiceZh: blessingVoice.zh
  };
}

// ==================== COLLECTIVE VOICES ====================

function generateChorusVoice(position: PilgrimPosition): { en: string; zh: string } {
  const { ancestorCount, inheritedThemes } = position;

  if (ancestorCount === 0) {
    return {
      en: 'You stand as the first witness of your lineage in this moment.',
      zh: '你站在此刻，作为血脉的第一个见证者。'
    };
  }

  const themesText = inheritedThemes.length > 0
    ? inheritedThemes.slice(0, 3).join(', ')
    : 'wisdom and resilience';
  const themesTextZh = inheritedThemes.length > 0
    ? inheritedThemes.slice(0, 3).join('、')
    : '智慧与韧性';

  return {
    en: `We are ${ancestorCount} generation${ancestorCount > 1 ? 's' : ''} who came before. Through you, our ${themesText} continue to live.`,
    zh: `我们是你之前的${ancestorCount}代人。通过你，我们的${themesTextZh}继续存活。`
  };
}

function generateWitnessVoice(position: PilgrimPosition): { en: string; zh: string } {
  const { brokenPatterns, newPatterns } = position;

  if (brokenPatterns.length > 0 && newPatterns.length > 0) {
    return {
      en: `We witness you releasing ${brokenPatterns[0]} while planting ${newPatterns[0]}. You are both ending and beginning.`,
      zh: `我们见证你放下${brokenPatterns[0]}，同时播种${newPatterns[0]}。你既是终结者，也是开创者。`
    };
  }

  if (brokenPatterns.length > 0) {
    return {
      en: `We watch as you break the cycle of ${brokenPatterns[0]}. Our gratitude is silent but deep.`,
      zh: `我们看着你打破${brokenPatterns[0]}的循环。我们的感激无声却深沉。`
    };
  }

  if (newPatterns.length > 0) {
    return {
      en: `We witness you planting seeds we never dreamed of: ${newPatterns[0]}. The future begins with you.`,
      zh: `我们见证你播下我们从未梦想过的种子：${newPatterns[0]}。未来从你开始。`
    };
  }

  return {
    en: 'We watch your journey with eyes that have seen many roads.',
    zh: '我们以见过许多道路的眼睛注视着你的旅程。'
  };
}

function generateBlessingVoice(position: PilgrimPosition, pilgrimName?: string): { en: string; zh: string } {
  const name = pilgrimName || 'dear one';
  const nameZh = pilgrimName || '亲爱的';

  const { inheritedThemes, brokenPatterns, newPatterns, ancestorCount, descendantCount } = position;

  // Rich blessing based on position
  if (ancestorCount > 0 && descendantCount > 0) {
    return {
      en: `${name}, you stand at the crossroads of past and future. May the wisdom of ${ancestorCount} generation${ancestorCount > 1 ? 's' : ''} guide your steps, and may your light illuminate ${descendantCount} generation${descendantCount > 1 ? 's' : ''} to come.`,
      zh: `${nameZh}，你站在过去与未来的十字路口。愿${ancestorCount}代人的智慧引导你的脚步，愿你的光芒照亮未来的${descendantCount}代人。`
    };
  }

  if (inheritedThemes.length > 0) {
    return {
      en: `${name}, may the ancestral gift of ${inheritedThemes[0]} flow through you like a river finding its course.`,
      zh: `${nameZh}，愿${inheritedThemes[0]}的祖传馈赠如河流找到它的航道般流过你。`
    };
  }

  if (brokenPatterns.length > 0) {
    return {
      en: `${name}, may your liberation from ${brokenPatterns[0]} ripple backward and forward through time.`,
      zh: `${nameZh}，愿你从${brokenPatterns[0]}的解脱向前后的时间中泛起涟漪。`
    };
  }

  if (newPatterns.length > 0) {
    return {
      en: `${name}, may the seeds of ${newPatterns[0]} you plant today become forests for those who follow.`,
      zh: `${nameZh}，愿你今天播下的${newPatterns[0]}种子成为后来者的森林。`
    };
  }

  return {
    en: `${name}, may your journey honor both the seen and unseen threads of your lineage.`,
    zh: `${nameZh}，愿你的旅程尊崇血脉中可见与不可见的丝线。`
  };
}

// ==================== VOICE FORMATTING ====================

/**
 * Format messages for voice output (TTS-ready)
 */
export function formatPersonaForVoice(layer: AncestralPersonaLayer, lang: 'en' | 'zh' = 'en'): string[] {
  const lines: string[] = [];

  // Opening chorus
  lines.push(lang === 'zh' ? layer.chorusVoiceZh || layer.chorusVoice : layer.chorusVoice);
  lines.push(''); // Pause

  // Individual messages
  layer.messages.forEach(msg => {
    const voice = lang === 'zh' ? (msg.messageZh || msg.message) : msg.message;
    lines.push(voice);
    lines.push(''); // Pause between messages
  });

  // Witness voice
  lines.push(lang === 'zh' ? layer.witnessVoiceZh || layer.witnessVoice : layer.witnessVoice);
  lines.push(''); // Pause

  // Closing blessing
  lines.push(lang === 'zh' ? layer.blessingVoiceZh || layer.blessingVoice : layer.blessingVoice);

  return lines;
}

/**
 * Get voice label for display
 */
export function getVoiceLabel(voice: AncestralVoiceType, lang: 'en' | 'zh' = 'en'): string {
  const labels: Record<AncestralVoiceType, { en: string; zh: string }> = {
    chorus: { en: 'Ancestor Chorus', zh: '祖系合唱' },
    echo: { en: 'Generational Echo', zh: '世代回响' },
    thread: { en: 'Ancestral Thread', zh: '血脉丝线' },
    witness: { en: 'Ancestral Witness', zh: '见证者之声' }
  };
  return labels[voice][lang];
}

/**
 * Get intensity label for display
 */
export function getIntensityLabel(intensity: AncestralPersonaMessage['intensity'], lang: 'en' | 'zh' = 'en'): string {
  const labels: Record<AncestralPersonaMessage['intensity'], { en: string; zh: string }> = {
    whisper: { en: 'Whisper', zh: '低语' },
    speak: { en: 'Speak', zh: '言说' },
    resonate: { en: 'Resonate', zh: '共鸣' },
    thunder: { en: 'Thunder', zh: '雷鸣' }
  };
  return labels[intensity][lang];
}

// ==================== HELPERS ====================

function findMatchingTheme(theme: string, stepThemes: string[]): string | null {
  const themeLower = theme.toLowerCase();
  for (const stepTheme of stepThemes) {
    const stepLower = stepTheme.toLowerCase();
    if (stepLower.includes(themeLower) || themeLower.includes(stepLower)) {
      return stepTheme;
    }
  }
  return null;
}

/**
 * Get messages by voice type
 */
export function getMessagesByVoice(
  layer: AncestralPersonaLayer,
  voice: AncestralVoiceType
): AncestralPersonaMessage[] {
  return layer.messages.filter(m => m.voice === voice);
}

/**
 * Get messages by intensity
 */
export function getMessagesByIntensity(
  layer: AncestralPersonaLayer,
  intensity: AncestralPersonaMessage['intensity']
): AncestralPersonaMessage[] {
  return layer.messages.filter(m => m.intensity === intensity);
}

/**
 * Check if layer has any ancestral resonance
 */
export function hasAncestralResonance(layer: AncestralPersonaLayer): boolean {
  return layer.messages.length > 0;
}

// ==================== EXPORTS ====================

export {
  generateAncestralPersona,
  buildAncestralPersonaLayer,
  formatPersonaForVoice,
  getVoiceLabel,
  getIntensityLabel,
  getMessagesByVoice,
  getMessagesByIntensity,
  hasAncestralResonance
};
