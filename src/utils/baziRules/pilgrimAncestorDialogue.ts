/**
 * ============================================
 * PILGRIM-ANCESTOR DIALOGUE ENGINE
 * A ritual dialogue generator where Luna speaks
 * as the lineage, and the pilgrim speaks back
 *
 * This is not a chatbot — it's a sacred conversation
 * generator for ancestral communion.
 * ============================================
 */

import { PilgrimPosition } from './journeyWithGenerations';
import { AncestralPersonaMessage, AncestralVoiceType } from './ancestralPersona';
import { AncestralArchetype } from './mythosLayer';

// ==================== DATA MODEL ====================

export type DialogueSpeaker = 'pilgrim' | 'ancestor' | 'luna' | 'archetype';

export interface DialogueTurn {
  id: string;
  speaker: DialogueSpeaker;
  speakerLabel: string;
  speakerLabelZh?: string;
  text: string;
  textZh?: string;
  theme: string;
  generationIndex?: number;
  voiceType?: AncestralVoiceType;
  emotion?: 'reverent' | 'questioning' | 'grateful' | 'releasing' | 'receiving' | 'blessing';
}

export interface AncestralDialogue {
  id: string;
  pilgrimName?: string;
  theme: string;
  turns: DialogueTurn[];
  openingInvocation: string;
  openingInvocationZh?: string;
  closingBlessing: string;
  closingBlessingZh?: string;
  totalTurns: number;
}

export interface DialogueGenerationOptions {
  includeArchetype?: boolean;
  archetype?: AncestralArchetype;
  depth?: 'brief' | 'medium' | 'deep';
  focusTheme?: string;
}

// ==================== DIALOGUE TEMPLATES ====================

const PILGRIM_RESPONSES = {
  inherited: {
    en: (theme: string) => `I hear the echo of "${theme}" in my blood. I receive this inheritance with gratitude and intention.`,
    zh: (theme: string) => `我听见「${theme}」在我血脉中的回响。我以感恩与意愿接收这份传承。`
  },
  broken: {
    en: (theme: string) => `I acknowledge the pattern of "${theme}" that my ancestors carried. I choose to release it with love.`,
    zh: (theme: string) => `我承认祖先们承载的「${theme}」的模式。我选择以爱释放它。`
  },
  new: {
    en: (theme: string) => `I plant the seed of "${theme}" for those who come after me. May it grow into forests.`,
    zh: (theme: string) => `我为后来者播下「${theme}」的种子。愿它长成森林。`
  },
  questioning: {
    en: (theme: string) => `Ancestors, what wisdom do you offer about "${theme}"? I am listening.`,
    zh: (theme: string) => `祖先们，你们对「${theme}」有什么智慧要分享？我在聆听。`
  },
  gratitude: {
    en: (theme: string) => `I honor the struggles you endured carrying "${theme}". Your journey made mine possible.`,
    zh: (theme: string) => `我尊崇你们承载「${theme}」时所忍受的挣扎。你们的旅程使我的旅程成为可能。`
  }
};

const ANCESTOR_VOICES = {
  chorus: {
    en: (theme: string) => `We are the many who came before. Through "${theme}", our lives continue in you.`,
    zh: (theme: string) => `我们是你之前的众多先人。通过「${theme}」，我们的生命在你身上延续。`
  },
  witness: {
    en: (theme: string) => `We see you standing where we could not stand. "${theme}" transforms through you.`,
    zh: (theme: string) => `我们看见你站在我们无法站立的地方。「${theme}」通过你转化。`
  },
  blessing: {
    en: (theme: string) => `May "${theme}" flow through you with ease. You carry what we could only dream.`,
    zh: (theme: string) => `愿「${theme}」轻松地流过你。你承载着我们只能梦想的。`
  },
  guidance: {
    en: (theme: string) => `When "${theme}" feels heavy, remember: you do not carry it alone. We are with you.`,
    zh: (theme: string) => `当「${theme}」感觉沉重时，记住：你不是独自承载。我们与你同在。`
  }
};

const LUNA_INTERPRETATIONS = {
  integration: {
    en: 'The dialogue between pilgrim and ancestor creates a living bridge. What was separate becomes whole.',
    zh: '行者与祖先之间的对话创造了一座活的桥梁。分离的变得完整。'
  },
  release: {
    en: 'In acknowledging the pattern, you begin to release it. The ancestors witness and support.',
    zh: '在承认模式的同时，你开始释放它。祖先们见证并支持。'
  },
  blessing: {
    en: 'The seeds you plant today become the forests of tomorrow. The ancestors smile.',
    zh: '你今天播下的种子成为明天的森林。祖先们微笑。'
  },
  completion: {
    en: 'The dialogue completes a circle. Past and future meet in this sacred present moment.',
    zh: '对话完成了一个圆。过去与未来在这个神圣的当下相遇。'
  }
};

// ==================== DIALOGUE ENGINE ====================

/**
 * Generate ancestral dialogue for a set of themes
 */
export function generateDialogue(
  stepThemes: string[],
  position: PilgrimPosition,
  personaMessages: AncestralPersonaMessage[],
  options: DialogueGenerationOptions = {}
): AncestralDialogue {
  const { includeArchetype = false, archetype, depth = 'medium', focusTheme } = options;
  const turns: DialogueTurn[] = [];
  let turnId = 0;

  // Filter to focus theme if specified
  const themes = focusTheme
    ? stepThemes.filter(t => t.toLowerCase().includes(focusTheme.toLowerCase()))
    : stepThemes;

  // Opening: Ancestors speak first
  personaMessages.forEach(msg => {
    turns.push({
      id: `turn-${turnId++}`,
      speaker: 'ancestor',
      speakerLabel: getVoiceLabel(msg.voice, 'en'),
      speakerLabelZh: getVoiceLabel(msg.voice, 'zh'),
      text: msg.message,
      textZh: msg.messageZh,
      theme: msg.theme,
      generationIndex: msg.generationIndex,
      voiceType: msg.voice,
      emotion: 'reverent'
    });
  });

  // Middle: Pilgrim responds to each theme
  themes.forEach(theme => {
    // Determine response type based on position
    const isInherited = position.inheritedThemes.some(t =>
      t.toLowerCase().includes(theme.toLowerCase()) || theme.toLowerCase().includes(t.toLowerCase())
    );
    const isBroken = position.brokenPatterns.some(t =>
      t.toLowerCase().includes(theme.toLowerCase()) || theme.toLowerCase().includes(t.toLowerCase())
    );
    const isNew = position.newPatterns.some(t =>
      t.toLowerCase().includes(theme.toLowerCase()) || theme.toLowerCase().includes(t.toLowerCase())
    );

    if (isInherited) {
      turns.push({
        id: `turn-${turnId++}`,
        speaker: 'pilgrim',
        speakerLabel: 'Pilgrim',
        speakerLabelZh: '行者',
        text: PILGRIM_RESPONSES.inherited.en(theme),
        textZh: PILGRIM_RESPONSES.inherited.zh(theme),
        theme,
        emotion: 'receiving'
      });

      if (depth !== 'brief') {
        turns.push({
          id: `turn-${turnId++}`,
          speaker: 'ancestor',
          speakerLabel: 'Ancestors',
          speakerLabelZh: '祖先',
          text: ANCESTOR_VOICES.blessing.en(theme),
          textZh: ANCESTOR_VOICES.blessing.zh(theme),
          theme,
          emotion: 'blessing'
        });
      }
    }

    if (isBroken) {
      turns.push({
        id: `turn-${turnId++}`,
        speaker: 'pilgrim',
        speakerLabel: 'Pilgrim',
        speakerLabelZh: '行者',
        text: PILGRIM_RESPONSES.broken.en(theme),
        textZh: PILGRIM_RESPONSES.broken.zh(theme),
        theme,
        emotion: 'releasing'
      });

      if (depth !== 'brief') {
        turns.push({
          id: `turn-${turnId++}`,
          speaker: 'ancestor',
          speakerLabel: 'Ancestral Witness',
          speakerLabelZh: '祖系见证者',
          text: ANCESTOR_VOICES.witness.en(theme),
          textZh: ANCESTOR_VOICES.witness.zh(theme),
          theme,
          emotion: 'reverent'
        });
      }
    }

    if (isNew) {
      turns.push({
        id: `turn-${turnId++}`,
        speaker: 'pilgrim',
        speakerLabel: 'Pilgrim',
        speakerLabelZh: '行者',
        text: PILGRIM_RESPONSES.new.en(theme),
        textZh: PILGRIM_RESPONSES.new.zh(theme),
        theme,
        emotion: 'blessing'
      });
    }

    // General response if no specific category
    if (!isInherited && !isBroken && !isNew) {
      turns.push({
        id: `turn-${turnId++}`,
        speaker: 'pilgrim',
        speakerLabel: 'Pilgrim',
        speakerLabelZh: '行者',
        text: PILGRIM_RESPONSES.questioning.en(theme),
        textZh: PILGRIM_RESPONSES.questioning.zh(theme),
        theme,
        emotion: 'questioning'
      });

      turns.push({
        id: `turn-${turnId++}`,
        speaker: 'ancestor',
        speakerLabel: 'Ancestor Chorus',
        speakerLabelZh: '祖系合唱',
        text: ANCESTOR_VOICES.guidance.en(theme),
        textZh: ANCESTOR_VOICES.guidance.zh(theme),
        theme,
        emotion: 'reverent'
      });
    }
  });

  // Archetype voice (if included)
  if (includeArchetype && archetype) {
    turns.push({
      id: `turn-${turnId++}`,
      speaker: 'archetype',
      speakerLabel: archetype.name,
      speakerLabelZh: archetype.nameZh,
      text: archetype.personaVoice,
      textZh: archetype.personaVoiceZh,
      theme: archetype.themes[0] || 'archetype',
      emotion: 'reverent'
    });
  }

  // Closing: Luna interprets
  const closingType = position.brokenPatterns.length > 0 ? 'release'
    : position.newPatterns.length > 0 ? 'blessing'
    : 'integration';

  turns.push({
    id: `turn-${turnId++}`,
    speaker: 'luna',
    speakerLabel: 'Luna',
    speakerLabelZh: '露娜',
    text: LUNA_INTERPRETATIONS[closingType].en,
    textZh: LUNA_INTERPRETATIONS[closingType].zh,
    theme: 'integration',
    emotion: 'blessing'
  });

  // Deep dialogue adds completion
  if (depth === 'deep') {
    turns.push({
      id: `turn-${turnId++}`,
      speaker: 'luna',
      speakerLabel: 'Luna',
      speakerLabelZh: '露娜',
      text: LUNA_INTERPRETATIONS.completion.en,
      textZh: LUNA_INTERPRETATIONS.completion.zh,
      theme: 'completion',
      emotion: 'blessing'
    });
  }

  return {
    id: `dialogue-${Date.now()}`,
    pilgrimName: undefined,
    theme: themes[0] || 'ancestral communion',
    turns,
    openingInvocation: 'The space between worlds opens. Ancestors and pilgrim meet in sacred dialogue.',
    openingInvocationZh: '世界之间的空间打开。祖先与行者在神圣的对话中相遇。',
    closingBlessing: 'The dialogue closes, but the connection remains. You are never alone.',
    closingBlessingZh: '对话结束，但连接仍在。你永远不孤单。',
    totalTurns: turns.length
  };
}

/**
 * Generate a single question-response dialogue turn
 */
export function generateSingleExchange(
  pilgrimQuestion: string,
  theme: string,
  position: PilgrimPosition
): DialogueTurn[] {
  const turns: DialogueTurn[] = [];

  // Pilgrim asks
  turns.push({
    id: 'q-1',
    speaker: 'pilgrim',
    speakerLabel: 'Pilgrim',
    speakerLabelZh: '行者',
    text: pilgrimQuestion,
    textZh: pilgrimQuestion, // Would need translation
    theme,
    emotion: 'questioning'
  });

  // Ancestors respond
  const isInherited = position.inheritedThemes.includes(theme);
  const responseType = isInherited ? 'blessing' : 'guidance';

  turns.push({
    id: 'a-1',
    speaker: 'ancestor',
    speakerLabel: 'Ancestor Chorus',
    speakerLabelZh: '祖系合唱',
    text: ANCESTOR_VOICES[responseType].en(theme),
    textZh: ANCESTOR_VOICES[responseType].zh(theme),
    theme,
    emotion: isInherited ? 'blessing' : 'reverent'
  });

  return turns;
}

// ==================== HELPER FUNCTIONS ====================

function getVoiceLabel(voice: AncestralVoiceType, lang: 'en' | 'zh'): string {
  const labels: Record<AncestralVoiceType, { en: string; zh: string }> = {
    chorus: { en: 'Ancestor Chorus', zh: '祖系合唱' },
    echo: { en: 'Generational Echo', zh: '世代回响' },
    thread: { en: 'Ancestral Thread', zh: '血脉丝线' },
    witness: { en: 'Ancestral Witness', zh: '见证者之声' }
  };
  return labels[voice]?.[lang] || voice;
}

/**
 * Format dialogue for display
 */
export function formatDialogueForDisplay(dialogue: AncestralDialogue, lang: 'en' | 'zh' = 'en'): string {
  const lines: string[] = [];

  lines.push(lang === 'zh' ? dialogue.openingInvocationZh || dialogue.openingInvocation : dialogue.openingInvocation);
  lines.push('');
  lines.push('---');
  lines.push('');

  dialogue.turns.forEach(turn => {
    const label = lang === 'zh' ? turn.speakerLabelZh || turn.speakerLabel : turn.speakerLabel;
    const text = lang === 'zh' ? turn.textZh || turn.text : turn.text;
    lines.push(`【${label}】`);
    lines.push(text);
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push(lang === 'zh' ? dialogue.closingBlessingZh || dialogue.closingBlessing : dialogue.closingBlessing);

  return lines.join('\n');
}

/**
 * Format dialogue for voice output (TTS)
 */
export function formatDialogueForVoice(dialogue: AncestralDialogue, lang: 'en' | 'zh' = 'en'): string[] {
  const lines: string[] = [];

  lines.push(lang === 'zh' ? dialogue.openingInvocationZh || dialogue.openingInvocation : dialogue.openingInvocation);
  lines.push(''); // Pause

  dialogue.turns.forEach(turn => {
    const text = lang === 'zh' ? turn.textZh || turn.text : turn.text;
    lines.push(text);
    lines.push(''); // Pause between turns
  });

  lines.push(lang === 'zh' ? dialogue.closingBlessingZh || dialogue.closingBlessing : dialogue.closingBlessing);

  return lines;
}

/**
 * Get dialogue turns by speaker
 */
export function getTurnsBySpeaker(dialogue: AncestralDialogue, speaker: DialogueSpeaker): DialogueTurn[] {
  return dialogue.turns.filter(t => t.speaker === speaker);
}

/**
 * Get dialogue turns by emotion
 */
export function getTurnsByEmotion(dialogue: AncestralDialogue, emotion: DialogueTurn['emotion']): DialogueTurn[] {
  return dialogue.turns.filter(t => t.emotion === emotion);
}

// ==================== EXPORTS ====================

export {
  generateDialogue,
  generateSingleExchange,
  formatDialogueForDisplay,
  formatDialogueForVoice,
  getTurnsBySpeaker,
  getTurnsByEmotion
};
