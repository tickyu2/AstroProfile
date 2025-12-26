/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION TTS ADAPTER - Confidence-Scaled Voice Modulation
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Adapts emotion detection to TTS voice settings with confidence scaling.
 * Low confidence → more neutral delivery
 * High confidence → full emotional modulation
 *
 * This prevents jarring voice changes when emotion detection is uncertain.
 *
 * Created: December 21, 2025
 */

import { EmotionToTTS, getEmotionProfile } from './emotionMap.js';

/**
 * Default (neutral) profile for fallback and blending
 */
const DEFAULT_PROFILE = EmotionToTTS.neutral;

/**
 * Get TTS voice profile for detected emotion with confidence scaling
 *
 * @param {Object} emotion - Detected emotion { primary, secondary, confidence }
 * @returns {Object} - TTS voice settings
 */
export function getTTSProfileForEmotion(emotion) {
  // No emotion or invalid → return neutral
  if (!emotion || !emotion.primary) {
    return { ...DEFAULT_PROFILE, emotion: 'neutral', confidence: 0 };
  }

  const emotionName = emotion.primary.toLowerCase();
  const base = getEmotionProfile(emotionName);

  // Get confidence (clamp to 0-1)
  const confidence = Math.max(0, Math.min(1, emotion.confidence ?? 0.5));

  // Calculate blend factor
  // Low confidence (< 0.3) → almost neutral
  // High confidence (> 0.7) → almost full emotion
  // blend = 0.3 + 0.7 * confidence → range: 0.3 to 1.0
  const blend = 0.3 + 0.7 * confidence;

  // Interpolate between neutral and emotion profile
  const profile = {
    stability: lerp(DEFAULT_PROFILE.stability, base.stability, blend),
    similarityBoost: lerp(DEFAULT_PROFILE.similarityBoost, base.similarityBoost, blend),
    style: lerp(DEFAULT_PROFILE.style, base.style, blend),
    speakingRate: lerp(DEFAULT_PROFILE.speakingRate, base.speakingRate, blend),

    // Metadata
    emotion: emotionName,
    confidence: confidence,
    blend: blend,
    description: base.description
  };

  return profile;
}

/**
 * Get TTS profile with secondary emotion influence
 *
 * @param {Object} emotion - Detected emotion with primary and secondary
 * @returns {Object} - Blended TTS voice settings
 */
export function getTTSProfileWithSecondary(emotion) {
  if (!emotion || !emotion.primary) {
    return getTTSProfileForEmotion({ primary: 'neutral', confidence: 0.5 });
  }

  // Get primary profile
  const primaryProfile = getTTSProfileForEmotion(emotion);

  // If no secondary, return primary
  if (!emotion.secondary) {
    return primaryProfile;
  }

  // Get secondary profile (with lower weight)
  const secondaryBase = getEmotionProfile(emotion.secondary);
  const secondaryWeight = 0.25; // Secondary has 25% influence

  // Blend primary with secondary
  return {
    stability: lerp(primaryProfile.stability, secondaryBase.stability, secondaryWeight),
    similarityBoost: lerp(primaryProfile.similarityBoost, secondaryBase.similarityBoost, secondaryWeight),
    style: lerp(primaryProfile.style, secondaryBase.style, secondaryWeight),
    speakingRate: lerp(primaryProfile.speakingRate, secondaryBase.speakingRate, secondaryWeight),

    // Metadata
    emotion: emotion.primary,
    secondaryEmotion: emotion.secondary,
    confidence: primaryProfile.confidence,
    blend: primaryProfile.blend,
    description: primaryProfile.description
  };
}

/**
 * Linear interpolation helper
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Get emotion transition profile
 * For smooth transitions between emotions across turns
 *
 * @param {Object} prevEmotion - Previous turn's emotion
 * @param {Object} currentEmotion - Current turn's emotion
 * @param {number} transitionFactor - 0-1 (how much to transition)
 * @returns {Object} - Transitional TTS profile
 */
export function getTransitionProfile(prevEmotion, currentEmotion, transitionFactor = 0.7) {
  const prevProfile = getTTSProfileForEmotion(prevEmotion || { primary: 'neutral' });
  const currProfile = getTTSProfileForEmotion(currentEmotion || { primary: 'neutral' });

  return {
    stability: lerp(prevProfile.stability, currProfile.stability, transitionFactor),
    similarityBoost: lerp(prevProfile.similarityBoost, currProfile.similarityBoost, transitionFactor),
    style: lerp(prevProfile.style, currProfile.style, transitionFactor),
    speakingRate: lerp(prevProfile.speakingRate, currProfile.speakingRate, transitionFactor),

    emotion: currProfile.emotion,
    previousEmotion: prevProfile.emotion,
    confidence: currProfile.confidence,
    transitionFactor
  };
}

/**
 * Validate TTS profile values are within ElevenLabs acceptable ranges
 */
export function validateProfile(profile) {
  return {
    stability: clamp(profile.stability, 0, 1),
    similarityBoost: clamp(profile.similarityBoost, 0, 1),
    style: clamp(profile.style, 0, 1),
    speakingRate: clamp(profile.speakingRate, 0.5, 2.0),
    emotion: profile.emotion || 'neutral',
    confidence: profile.confidence || 0.5
  };
}

/**
 * Clamp helper
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default {
  getTTSProfileForEmotion,
  getTTSProfileWithSecondary,
  getTransitionProfile,
  validateProfile
};
