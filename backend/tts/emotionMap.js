/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION → TTS SETTINGS MAP - Voice Modulation for Luna
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Maps detected emotions to ElevenLabs voice parameters.
 * Each emotion creates a distinct vocal character.
 *
 * Parameters:
 * - stability: 0-1 (lower = more expressive/variable)
 * - similarityBoost: 0-1 (higher = closer to original voice)
 * - style: 0-1 (higher = more dramatic delivery)
 * - speakingRate: 0.5-2.0 (multiplier)
 *
 * Created: December 21, 2025
 */

/**
 * Emotion to TTS voice settings mapping
 *
 * Based on acoustic research on emotional speech:
 * - Happy: faster, higher pitch, more variable
 * - Sad: slower, lower pitch, stable
 * - Angry: faster, louder, harsh
 * - Anxious: faster, variable, tense
 * - Surprised: sudden changes, high variability
 */
export const EmotionToTTS = {
  neutral: {
    stability: 0.60,          // Balanced stability
    similarityBoost: 0.75,    // Natural voice similarity
    style: 0.30,              // Subtle expressiveness
    speakingRate: 1.0,        // Normal speed
    description: 'Calm, balanced, attentive'
  },

  happy: {
    stability: 0.50,          // More expressive variation
    similarityBoost: 0.80,    // Maintain voice identity
    style: 0.70,              // High expressiveness
    speakingRate: 1.08,       // Slightly faster
    description: 'Warm, upbeat, energetic'
  },

  sad: {
    stability: 0.70,          // More consistent, subdued
    similarityBoost: 0.70,    // Softer voice
    style: 0.35,              // Gentle, muted expression
    speakingRate: 0.92,       // Slower, reflective
    description: 'Soft, gentle, empathetic'
  },

  angry: {
    stability: 0.45,          // More variation (tension)
    similarityBoost: 0.85,    // Strong voice presence
    style: 0.75,              // Intense delivery
    speakingRate: 1.05,       // Slightly faster
    description: 'Grounded, steady, firm'
  },

  anxious: {
    stability: 0.50,          // Variable (reflecting nervousness)
    similarityBoost: 0.80,    // Clear voice
    style: 0.55,              // Moderate expression
    speakingRate: 1.03,       // Slightly faster
    description: 'Reassuring, steady, calming'
  },

  surprised: {
    stability: 0.45,          // High variability
    similarityBoost: 0.80,    // Clear voice
    style: 0.70,              // Expressive
    speakingRate: 1.07,       // Quick response
    description: 'Curious, engaged, animated'
  },

  disgusted: {
    stability: 0.60,          // Moderate stability
    similarityBoost: 0.75,    // Natural
    style: 0.45,              // Subdued but present
    speakingRate: 0.98,       // Slightly slower
    description: 'Understanding, validating'
  }
};

/**
 * Luna's emotional response philosophy:
 *
 * When user is HAPPY → Luna matches energy, celebrates with them
 * When user is SAD → Luna softens, slows down, holds space
 * When user is ANGRY → Luna stays grounded, doesn't escalate
 * When user is ANXIOUS → Luna becomes steady, reassuring anchor
 * When user is SURPRISED → Luna is curious, explores with them
 * When user is DISGUSTED → Luna validates, doesn't judge
 *
 * Luna NEVER mirrors negative emotions directly.
 * Instead, she provides the emotional counterweight the user needs.
 */

/**
 * Get emotion profile by name (with fallback to neutral)
 */
export function getEmotionProfile(emotionName) {
  return EmotionToTTS[emotionName?.toLowerCase()] || EmotionToTTS.neutral;
}

/**
 * List all available emotions
 */
export function getAvailableEmotions() {
  return Object.keys(EmotionToTTS);
}

export default {
  EmotionToTTS,
  getEmotionProfile,
  getAvailableEmotions
};
