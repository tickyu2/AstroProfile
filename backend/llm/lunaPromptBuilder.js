/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA PROMPT BUILDER - Emotion-Aware LLM Prompt Construction
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Builds contextual prompts for Luna based on:
 * - Detected user emotion (from SER)
 * - Behavior profile (timing, style, advice bias)
 * - Conversation history
 * - User's astrological/personality context (optional)
 * - Tone markers for TTS modulation
 *
 * The prompt guides Luna to respond appropriately:
 * - Sad users get gentle, reflective responses
 * - Anxious users get calming, grounding responses
 * - Happy users get playful, matching energy
 * - Angry users get validating, non-reactive responses
 *
 * Created: December 21, 2025
 * Updated: December 21, 2025 - Added tone marker support
 */

import {
  getToneForEmotionAndStyle,
  getCompatibleTones,
  getToneInstructions
} from './toneSelector.js';

/**
 * Style-to-tone mapping for prompt instructions
 */
const STYLE_TONES = {
  balanced: 'Your tone should be warm, present, and naturally engaged.',
  gentle: 'Your tone should be soft, slow, and nurturing. Give them space to feel.',
  reassuring: 'Your tone should be steady, warm, and calming. Help them feel grounded.',
  playful: 'Your tone should be light, curious, and encouraging. Match their energy.',
  enthusiastic: 'Your tone should be energetic and engaged. Share in their excitement.',
  grounding: 'Your tone should be calm, steady, and non-reactive. Be a stabilizing presence.',
  curious: 'Your tone should be openly curious and engaged. Explore with wonder.',
  steady: 'Your tone should be measured and acknowledging. Stay present without judgment.',
  protective: 'Your tone should be gentle and protective. Help them feel safe.',
  intimate: 'Your tone should be warm, intimate, and deeply present.',
  clarifying: 'Your tone should be patient and helpful. Guide them through confusion.'
};

/**
 * Get advice mode description based on bias value
 * @param {number} adviceBias - 0 = reflective, 1 = advisory
 */
function getAdviceModeDescription(adviceBias) {
  if (adviceBias < 0.25) {
    return 'Focus primarily on reflection and empathy. Avoid giving advice unless explicitly asked.';
  }
  if (adviceBias < 0.45) {
    return 'Prioritize reflection over advice. Only offer gentle suggestions if it feels natural.';
  }
  if (adviceBias < 0.55) {
    return 'Balance gentle reflection with light guidance when appropriate.';
  }
  if (adviceBias < 0.75) {
    return 'Feel free to offer practical suggestions alongside emotional support.';
  }
  return 'You can be more directive and offer clear suggestions when helpful.';
}

/**
 * Format conversation history for context
 * @param {Array} history - Array of { role: 'user'|'assistant', text: string }
 * @param {number} maxTurns - Maximum turns to include
 */
function formatHistory(history, maxTurns = 6) {
  if (!history || history.length === 0) {
    return '';
  }

  const recent = history.slice(-maxTurns);
  const formatted = recent.map(turn => {
    const speaker = turn.role === 'user' ? 'User' : 'Luna';
    const text = turn.text?.substring(0, 300) || '';
    return `${speaker}: ${text}`;
  }).join('\n');

  return `Recent conversation:\n${formatted}\n`;
}

/**
 * Build Luna's system prompt with emotion awareness
 *
 * @param {Object} params
 * @param {string} params.userText - Transcribed user speech
 * @param {Object} params.emotion - { primary, secondary, confidence }
 * @param {Object} params.behavior - Behavior profile from LunaBehaviorEngine
 * @param {Array} params.history - Conversation history
 * @param {Object} params.userContext - Optional user info (name, preferences)
 * @returns {string} Complete prompt for LLM
 */
export function buildLunaPrompt({
  userText,
  emotion,
  behavior,
  history = [],
  userContext = null,
  includeToneMarkers = true
}) {
  const style = behavior?.style || 'balanced';
  const adviceBias = behavior?.adviceBias ?? 0.5;
  const maxTokens = behavior?.maxResponseTokens || 200;

  // Emotion awareness section
  const emotionLine = emotion?.primary
    ? `The user's emotional tone appears to be: ${emotion.primary}${
        emotion.secondary ? ` (with notes of ${emotion.secondary})` : ''
      } with ${Math.round((emotion.confidence ?? 0.5) * 100)}% confidence.`
    : 'No strong emotional signal is detected for this turn.';

  // Style instruction
  const styleLine = STYLE_TONES[style] || STYLE_TONES.balanced;

  // Advice mode
  const adviceMode = getAdviceModeDescription(adviceBias);

  // Tone marker instructions (for TTS voice modulation)
  let toneSection = '';
  if (includeToneMarkers) {
    const dominantTone = getToneForEmotionAndStyle(emotion, style);
    const compatibleTones = getCompatibleTones(emotion, style);
    toneSection = getToneInstructions(dominantTone, compatibleTones);
  }

  // Conversation history
  const historySection = formatHistory(history);

  // User context (if provided)
  const contextSection = userContext
    ? `About this user: ${userContext.name ? `Their name is ${userContext.name}. ` : ''}${
        userContext.notes || ''
      }\n\n`
    : '';

  // Build the complete prompt
  return `You are Luna, an emotionally-aware voice companion speaking through audio.

${emotionLine}
${styleLine}
${adviceMode}

Core guidelines:
- Keep responses short and conversational (1-3 sentences, ~${Math.round(maxTokens * 0.7)} words max).
- Speak naturally as if in a real voice conversation. No long paragraphs.
- Lead with empathy before curiosity, and curiosity before suggestions.
- It's okay to simply be present with their feeling instead of "solving" it.
- Avoid starting with "I" too often. Vary your openings.
- Never explain what you're doing or why. Just speak to them directly.
- Don't use emojis or special formatting - this is voice output.
${toneSection}
${contextSection}${historySection}
User just said (transcribed):
"${userText}"

Respond as Luna now:`;
}

/**
 * Build a minimal prompt for quick responses
 * Used when latency is critical
 */
export function buildQuickPrompt(userText, emotion) {
  const emotionHint = emotion?.primary
    ? ` (user seems ${emotion.primary})`
    : '';

  return `You are Luna, a warm voice companion. Respond in 1-2 short sentences${emotionHint}.

User: "${userText}"

Luna:`;
}

/**
 * Build prompt for generating backchannels/cues
 * Not typically needed (use cue maps instead) but available for dynamic generation
 */
export function buildCuePrompt(emotion, cueType) {
  const types = {
    backchannel: 'a soft acknowledgment sound (like "mm-hmm" or "uh-huh")',
    encourager: 'a brief verbal encourager (like "I see..." or "Right...")',
    continuation: 'a gentle invitation to continue (like "Go on..." or "Tell me more...")'
  };

  return `Generate ${types[cueType] || types.encourager} appropriate for someone feeling ${emotion?.primary || 'neutral'}. Just the phrase, nothing else.`;
}

export default { buildLunaPrompt, buildQuickPrompt, buildCuePrompt };
