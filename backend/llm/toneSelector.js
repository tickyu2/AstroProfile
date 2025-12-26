/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TONE SELECTOR - Emotion-Aware Tone Marker Selection
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Selects appropriate tone markers for Luna's responses based on:
 * - User's detected emotion
 * - Current behavior style
 * - User's constitution (optional)
 *
 * Tone markers are used by TTS to modulate voice characteristics.
 *
 * Available Tones:
 * - Soft, Warm, Gentle, Tender (nurturing spectrum)
 * - Thoughtful, Curious, Interested (engaged spectrum)
 * - Excited, Joyful, Playful (energetic spectrum)
 * - Encouraging, Supportive, Compassionate (supportive spectrum)
 * - Serious, Grounding, Calm, Reassuring (stabilizing spectrum)
 * - Neutral (baseline)
 *
 * Created: December 21, 2025
 */

/**
 * All available tone markers
 */
export const TONE_MARKERS = [
  'Soft',
  'Warm',
  'Gentle',
  'Tender',
  'Thoughtful',
  'Curious',
  'Interested',
  'Excited',
  'Joyful',
  'Playful',
  'Encouraging',
  'Supportive',
  'Compassionate',
  'Serious',
  'Grounding',
  'Calm',
  'Reassuring',
  'Neutral'
];

/**
 * Emotion to tone mapping
 * Primary emotion determines base tone options
 */
const EMOTION_TONE_MAP = {
  neutral: ['Warm', 'Neutral', 'Curious'],
  happy: ['Warm', 'Joyful', 'Playful', 'Encouraging'],
  excited: ['Excited', 'Joyful', 'Playful', 'Warm'],
  sad: ['Soft', 'Gentle', 'Compassionate', 'Tender'],
  anxious: ['Calm', 'Reassuring', 'Grounding', 'Soft'],
  angry: ['Grounding', 'Calm', 'Neutral', 'Serious'],
  surprised: ['Curious', 'Interested', 'Warm', 'Excited'],
  disgusted: ['Neutral', 'Calm', 'Thoughtful'],
  fearful: ['Reassuring', 'Soft', 'Grounding', 'Warm'],
  confused: ['Gentle', 'Thoughtful', 'Curious', 'Encouraging'],
  tender: ['Tender', 'Soft', 'Warm', 'Gentle']
};

/**
 * Style to tone preference mapping
 * Style adjusts which tones are preferred
 */
const STYLE_TONE_PREFERENCE = {
  balanced: ['Warm', 'Neutral'],
  gentle: ['Soft', 'Gentle', 'Tender'],
  reassuring: ['Reassuring', 'Calm', 'Grounding'],
  playful: ['Playful', 'Joyful', 'Curious'],
  enthusiastic: ['Excited', 'Joyful', 'Encouraging'],
  grounding: ['Grounding', 'Calm', 'Serious'],
  curious: ['Curious', 'Interested', 'Thoughtful'],
  steady: ['Calm', 'Neutral', 'Thoughtful'],
  protective: ['Soft', 'Reassuring', 'Warm'],
  intimate: ['Tender', 'Soft', 'Warm'],
  clarifying: ['Thoughtful', 'Curious', 'Encouraging']
};

/**
 * Constitution to tone affinity mapping (optional)
 */
const CONSTITUTION_TONE_AFFINITY = {
  fire: ['Warm', 'Excited', 'Encouraging'],
  water: ['Soft', 'Gentle', 'Thoughtful'],
  wood: ['Curious', 'Playful', 'Encouraging'],
  metal: ['Calm', 'Thoughtful', 'Serious'],
  earth: ['Warm', 'Grounding', 'Nurturing']
};

/**
 * Get the primary tone for an emotion and style combination.
 *
 * @param {Object} emotion - { primary, secondary, confidence }
 * @param {string} style - Behavior style
 * @returns {string} Primary tone marker
 */
export function getToneForEmotionAndStyle(emotion, style) {
  const primary = emotion?.primary || 'neutral';
  const emotionTones = EMOTION_TONE_MAP[primary] || EMOTION_TONE_MAP.neutral;
  const styleTones = STYLE_TONE_PREFERENCE[style] || STYLE_TONE_PREFERENCE.balanced;

  // Find tone that appears in both lists (intersection)
  const intersection = emotionTones.filter(t => styleTones.includes(t));

  if (intersection.length > 0) {
    return intersection[0];
  }

  // If no intersection, prefer style over emotion for consistency
  return styleTones[0];
}

/**
 * Get a set of compatible tones for variety.
 * Used for multi-sentence responses where tone might vary slightly.
 *
 * @param {Object} emotion - { primary, secondary, confidence }
 * @param {string} style - Behavior style
 * @returns {string[]} Array of compatible tones (2-3)
 */
export function getCompatibleTones(emotion, style) {
  const primary = emotion?.primary || 'neutral';
  const emotionTones = EMOTION_TONE_MAP[primary] || EMOTION_TONE_MAP.neutral;
  const styleTones = STYLE_TONE_PREFERENCE[style] || STYLE_TONE_PREFERENCE.balanced;

  // Create union of first few from each
  const union = [...new Set([...emotionTones.slice(0, 2), ...styleTones.slice(0, 2)])];

  return union.slice(0, 3);
}

/**
 * Get tone considering user's constitution.
 * Blends emotion/style tone with constitutional affinity.
 *
 * @param {Object} emotion - { primary, secondary, confidence }
 * @param {string} style - Behavior style
 * @param {string} constitution - User's elemental constitution
 * @returns {string} Tone marker
 */
export function getToneWithConstitution(emotion, style, constitution) {
  const baseTone = getToneForEmotionAndStyle(emotion, style);

  if (!constitution || !CONSTITUTION_TONE_AFFINITY[constitution]) {
    return baseTone;
  }

  const constitutionTones = CONSTITUTION_TONE_AFFINITY[constitution];

  // If base tone is in constitution affinity, use it
  if (constitutionTones.includes(baseTone)) {
    return baseTone;
  }

  // Otherwise, try to find compatible tone from constitution
  const emotionTones = EMOTION_TONE_MAP[emotion?.primary || 'neutral'];
  const overlap = constitutionTones.filter(t => emotionTones.includes(t));

  return overlap.length > 0 ? overlap[0] : baseTone;
}

/**
 * Format a tone marker for insertion into text.
 *
 * @param {string} tone - Tone name
 * @returns {string} Formatted marker
 */
export function formatToneMarker(tone) {
  return `[Tone: ${tone}]`;
}

/**
 * Strip tone markers from text.
 * Useful for TTS post-processing.
 *
 * @param {string} text - Text with tone markers
 * @returns {string} Text without markers
 */
export function stripToneMarkers(text) {
  return text.replace(/\[Tone:\s*\w+\]/gi, '').trim();
}

/**
 * Extract tone markers from text.
 *
 * @param {string} text - Text with tone markers
 * @returns {string[]} Array of extracted tones
 */
export function extractToneMarkers(text) {
  const matches = text.match(/\[Tone:\s*(\w+)\]/gi) || [];
  return matches.map(m => m.match(/\[Tone:\s*(\w+)\]/i)?.[1] || 'Neutral');
}

/**
 * Get tone usage instructions for LLM prompt.
 *
 * @param {string} dominantTone - Primary tone to use
 * @param {string[]} compatibleTones - Other acceptable tones
 * @returns {string} Instruction text for prompt
 */
export function getToneInstructions(dominantTone, compatibleTones = []) {
  const allCompatible = [dominantTone, ...compatibleTones.filter(t => t !== dominantTone)];
  const toneList = allCompatible.join(', ');

  return `
Tone Markers:
- You may optionally prefix some lines with [Tone: X] where X is one of:
  ${TONE_MARKERS.join(', ')}.
- Prefer using [Tone: ${dominantTone}] on your FIRST line.
- Compatible tones for this response: ${toneList}
- Do not use a tone marker on every line; at most 1 out of 2-3 lines.
- Do not rapidly switch tones. Stay mostly near ${dominantTone}.
- Never use more than 2 different tones in a single response.
`;
}

export default {
  TONE_MARKERS,
  getToneForEmotionAndStyle,
  getCompatibleTones,
  getToneWithConstitution,
  formatToneMarker,
  stripToneMarkers,
  extractToneMarkers,
  getToneInstructions
};
