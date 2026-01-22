/**
 * ============================================
 * ADVANCED PILGRIM-ANCESTOR DIALOGUE ENGINE
 * Emotionally intelligent dialogue with:
 * - Emotional resonance scoring
 * - Generational emotional weighting
 * - Theme-to-emotion mapping
 * - Ancestor emotional memory echoes
 * - Pilgrim emotional reflection synthesis
 * - Luna's integrative emotional guidance
 * ============================================
 */

import { AncestralPersonaMessage } from './ancestralPersona';
import { GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export interface EmotionalProfile {
  valence: number;      // -100 to +100 (negative to positive)
  intensity: number;    // 0 to 100
  tone: 'soft' | 'firm' | 'warm' | 'solemn' | 'gentle' | 'reverent';
}

export interface ResonantDialogueTurn {
  id: string;
  speaker: 'ancestor' | 'pilgrim' | 'luna';
  text: string;
  textZh: string;
  theme: string;
  generationIndex?: number;
  archetypeId?: string;
  emotion: EmotionalProfile;
  resonanceScore: number;  // 0-100
}

export interface ResonantDialogue {
  id: string;
  turns: ResonantDialogueTurn[];
  overallResonance: number;
  dominantEmotion: EmotionalProfile;
  themes: string[];
}

export interface DialogueContext {
  pilgrimName?: string;
  currentTheme?: string;
  ritualPhase?: string;
  generationFocus?: number;
}

// ==================== THEME-EMOTION MAPPING ====================

const THEME_EMOTION_MAP: Record<string, EmotionalProfile> = {
  // Positive themes
  'relationship': { valence: +40, intensity: 60, tone: 'warm' },
  'expression': { valence: +60, intensity: 50, tone: 'warm' },
  'healing': { valence: +80, intensity: 40, tone: 'gentle' },
  'creativity': { valence: +70, intensity: 55, tone: 'warm' },
  'wisdom': { valence: +50, intensity: 45, tone: 'reverent' },
  'abundance': { valence: +65, intensity: 50, tone: 'warm' },
  'protection': { valence: +30, intensity: 60, tone: 'firm' },
  'blessing': { valence: +90, intensity: 35, tone: 'gentle' },
  'integration': { valence: +50, intensity: 40, tone: 'gentle' },
  'transformation': { valence: +45, intensity: 70, tone: 'solemn' },

  // Challenging themes
  'self-doubt': { valence: -50, intensity: 70, tone: 'soft' },
  'migration': { valence: +10, intensity: 80, tone: 'solemn' },
  'loss': { valence: -60, intensity: 75, tone: 'soft' },
  'separation': { valence: -40, intensity: 65, tone: 'solemn' },
  'struggle': { valence: -30, intensity: 80, tone: 'firm' },
  'silence': { valence: -20, intensity: 40, tone: 'soft' },
  'burden': { valence: -35, intensity: 70, tone: 'solemn' },
  'sacrifice': { valence: -10, intensity: 75, tone: 'reverent' },

  // Neutral/complex themes
  'transition': { valence: 0, intensity: 55, tone: 'solemn' },
  'inheritance': { valence: +20, intensity: 50, tone: 'reverent' },
  'duty': { valence: +10, intensity: 60, tone: 'firm' },
  'legacy': { valence: +25, intensity: 55, tone: 'reverent' }
};

// ==================== EMOTIONAL RESONANCE CALCULATOR ====================

/**
 * Calculate emotional resonance between two profiles
 */
export function calculateEmotionalResonance(
  a: EmotionalProfile,
  b: EmotionalProfile
): number {
  const valenceDiff = Math.abs(a.valence - b.valence);
  const intensityDiff = Math.abs(a.intensity - b.intensity);
  const toneMatch = a.tone === b.tone ? 20 : 0;

  // Higher score = more resonance
  const baseScore = 100 - (valenceDiff * 0.3 + intensityDiff * 0.3);
  return Math.max(0, Math.min(100, baseScore + toneMatch));
}

/**
 * Get emotion profile for a theme
 */
export function getThemeEmotion(theme: string): EmotionalProfile {
  const lowerTheme = theme.toLowerCase();

  // Direct match
  if (THEME_EMOTION_MAP[lowerTheme]) {
    return THEME_EMOTION_MAP[lowerTheme];
  }

  // Partial match
  for (const [key, emotion] of Object.entries(THEME_EMOTION_MAP)) {
    if (lowerTheme.includes(key) || key.includes(lowerTheme)) {
      return emotion;
    }
  }

  // Default neutral emotion
  return { valence: 0, intensity: 40, tone: 'solemn' };
}

/**
 * Blend multiple emotions into one
 */
export function blendEmotions(emotions: EmotionalProfile[]): EmotionalProfile {
  if (emotions.length === 0) {
    return { valence: 0, intensity: 40, tone: 'solemn' };
  }

  const avgValence = emotions.reduce((sum, e) => sum + e.valence, 0) / emotions.length;
  const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;

  // Most common tone
  const toneCounts = emotions.reduce((acc, e) => {
    acc[e.tone] = (acc[e.tone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantTone = Object.entries(toneCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as EmotionalProfile['tone'];

  return {
    valence: Math.round(avgValence),
    intensity: Math.round(avgIntensity),
    tone: dominantTone
  };
}

// ==================== ADVANCED DIALOGUE ENGINE ====================

/**
 * Generate emotionally resonant dialogue
 */
export function generateResonantDialogue(
  personaMessages: AncestralPersonaMessage[],
  stepThemes: string[],
  context?: DialogueContext
): ResonantDialogue {
  const turns: ResonantDialogueTurn[] = [];
  const allEmotions: EmotionalProfile[] = [];

  // 1. Ancestors speak with emotional resonance
  personaMessages.forEach((msg, idx) => {
    const emotion = getThemeEmotion(msg.theme || 'inheritance');
    allEmotions.push(emotion);

    // Calculate resonance based on intensity and generation depth
    const generationWeight = msg.generationIndex !== undefined
      ? Math.max(0.5, 1 - msg.generationIndex * 0.1)
      : 0.8;
    const resonanceScore = Math.round(emotion.intensity * generationWeight);

    turns.push({
      id: `ancestor-${idx}-${Date.now()}`,
      speaker: 'ancestor',
      text: msg.message,
      textZh: msg.messageZh || msg.message,
      theme: msg.theme || 'inheritance',
      generationIndex: msg.generationIndex,
      archetypeId: msg.archetypeId,
      emotion,
      resonanceScore
    });
  });

  // 2. Pilgrim responds with reflective emotional synthesis
  stepThemes.forEach((theme, idx) => {
    const emotion = getThemeEmotion(theme);
    allEmotions.push(emotion);

    // Pilgrim's emotion is slightly modulated (more gentle)
    const pilgrimEmotion: EmotionalProfile = {
      valence: emotion.valence * 0.8,
      intensity: emotion.intensity * 0.7,
      tone: emotion.valence > 0 ? 'warm' : 'soft'
    };

    const pilgrimName = context?.pilgrimName || 'Pilgrim';

    turns.push({
      id: `pilgrim-${idx}-${Date.now()}`,
      speaker: 'pilgrim',
      text: `I hear the echo of "${theme}" in my lineage. I am willing to continue, and willing to release.`,
      textZh: `我听见了关于「${theme}」的回声。我愿意继续，也愿意放下。`,
      theme,
      emotion: pilgrimEmotion,
      resonanceScore: Math.round(pilgrimEmotion.intensity * 0.9)
    });
  });

  // 3. Luna integrates emotional resonance
  const integrativeEmotion = blendEmotions(allEmotions);
  const lunaEmotion: EmotionalProfile = {
    valence: Math.min(90, integrativeEmotion.valence + 30),
    intensity: Math.max(30, integrativeEmotion.intensity - 10),
    tone: 'gentle'
  };

  turns.push({
    id: `luna-integration-${Date.now()}`,
    speaker: 'luna',
    text: 'Emotions flow across generations. What you feel belongs not only to you, but to your entire lineage. In acknowledging this, you begin to transform it.',
    textZh: '情绪在代际之间流动。你所感受的，不仅属于你，也属于你的祖系。在承认这一点时，你开始转化它。',
    theme: 'integration',
    emotion: lunaEmotion,
    resonanceScore: 85
  });

  // Calculate overall resonance
  const overallResonance = Math.round(
    turns.reduce((sum, t) => sum + t.resonanceScore, 0) / turns.length
  );

  return {
    id: `dialogue-${Date.now()}`,
    turns,
    overallResonance,
    dominantEmotion: blendEmotions(allEmotions),
    themes: [...new Set([...stepThemes, ...personaMessages.map(m => m.theme || 'inheritance')])]
  };
}

/**
 * Generate a single emotional exchange
 */
export function generateSingleResonantExchange(
  ancestorMessage: string,
  ancestorMessageZh: string,
  theme: string,
  generationIndex?: number
): ResonantDialogueTurn[] {
  const emotion = getThemeEmotion(theme);

  const ancestorTurn: ResonantDialogueTurn = {
    id: `ancestor-single-${Date.now()}`,
    speaker: 'ancestor',
    text: ancestorMessage,
    textZh: ancestorMessageZh,
    theme,
    generationIndex,
    emotion,
    resonanceScore: emotion.intensity
  };

  const pilgrimEmotion: EmotionalProfile = {
    valence: emotion.valence * 0.8,
    intensity: emotion.intensity * 0.7,
    tone: emotion.valence > 0 ? 'warm' : 'soft'
  };

  const pilgrimTurn: ResonantDialogueTurn = {
    id: `pilgrim-single-${Date.now()}`,
    speaker: 'pilgrim',
    text: `I receive this with openness.`,
    textZh: `我以开放的心接收这一切。`,
    theme,
    emotion: pilgrimEmotion,
    resonanceScore: pilgrimEmotion.intensity
  };

  return [ancestorTurn, pilgrimTurn];
}

// ==================== FORMATTING ====================

/**
 * Format resonant dialogue for display
 */
export function formatResonantDialogueForDisplay(
  dialogue: ResonantDialogue,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push(lang === 'zh' ? '🕍 祖先对话 (情感共鸣)' : '🕍 Ancestral Dialogue (Emotional Resonance)');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  dialogue.turns.forEach(turn => {
    const text = lang === 'zh' ? turn.textZh : turn.text;
    const speakerLabel = turn.speaker === 'ancestor'
      ? (lang === 'zh' ? '祖先' : 'Ancestor')
      : turn.speaker === 'pilgrim'
        ? (lang === 'zh' ? '行者' : 'Pilgrim')
        : 'Luna';

    const emotionLabel = `[${turn.emotion.tone}, ${turn.emotion.valence > 0 ? '+' : ''}${turn.emotion.valence}]`;

    lines.push(`【${speakerLabel}】 ${emotionLabel}`);
    lines.push(text);
    lines.push(`   (${lang === 'zh' ? '主题' : 'Theme'}: ${turn.theme}, ${lang === 'zh' ? '共鸣' : 'Resonance'}: ${turn.resonanceScore}%)`);
    lines.push('');
  });

  lines.push('---');
  lines.push(`${lang === 'zh' ? '整体共鸣' : 'Overall Resonance'}: ${dialogue.overallResonance}%`);
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Format for voice output
 */
export function formatResonantDialogueForVoice(
  dialogue: ResonantDialogue,
  lang: 'en' | 'zh' = 'en'
): string[] {
  return dialogue.turns.map(turn => {
    const text = lang === 'zh' ? turn.textZh : turn.text;
    const speakerLabel = turn.speaker === 'ancestor'
      ? (lang === 'zh' ? '祖先说' : 'The ancestor speaks')
      : turn.speaker === 'pilgrim'
        ? (lang === 'zh' ? '行者回应' : 'The pilgrim responds')
        : (lang === 'zh' ? 'Luna说' : 'Luna speaks');

    return `${speakerLabel}: ${text}`;
  });
}

// ==================== QUERY FUNCTIONS ====================

/**
 * Get turns by speaker
 */
export function getTurnsBySpeaker(
  dialogue: ResonantDialogue,
  speaker: ResonantDialogueTurn['speaker']
): ResonantDialogueTurn[] {
  return dialogue.turns.filter(t => t.speaker === speaker);
}

/**
 * Get turns by emotional valence
 */
export function getTurnsByValence(
  dialogue: ResonantDialogue,
  minValence: number,
  maxValence: number
): ResonantDialogueTurn[] {
  return dialogue.turns.filter(t =>
    t.emotion.valence >= minValence && t.emotion.valence <= maxValence
  );
}

/**
 * Get turns by resonance threshold
 */
export function getHighResonanceTurns(
  dialogue: ResonantDialogue,
  threshold: number = 70
): ResonantDialogueTurn[] {
  return dialogue.turns.filter(t => t.resonanceScore >= threshold);
}

/**
 * Get the emotional journey (valence over time)
 */
export function getEmotionalJourney(dialogue: ResonantDialogue): number[] {
  return dialogue.turns.map(t => t.emotion.valence);
}

// ==================== EXPORTS ====================

export {
  generateResonantDialogue,
  generateSingleResonantExchange,
  calculateEmotionalResonance,
  getThemeEmotion,
  blendEmotions,
  formatResonantDialogueForDisplay,
  formatResonantDialogueForVoice,
  getTurnsBySpeaker,
  getTurnsByValence,
  getHighResonanceTurns,
  getEmotionalJourney,
  THEME_EMOTION_MAP
};
