/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMOTION SCHEMA - 3-Tier Emotion Ontology for Voice AI
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * A comprehensive emotion classification system designed for Speech Emotion
 * Recognition (SER) in voice-based AI companions.
 *
 * Structure:
 * - Primary: 7 core emotion categories (maps well to acoustic features)
 * - Secondary: Nuanced sub-labels for each primary emotion
 * - Micro: Subtle vocal qualities for fine-tuning emotional reading
 *
 * Created: December 21, 2025
 */

/**
 * Primary emotion categories (Tier 1)
 * These map well to acoustic patterns and are widely used in SER research.
 */
export const PRIMARY_EMOTIONS = [
  'neutral',
  'happy',
  'sad',
  'angry',
  'anxious',
  'surprised',
  'disgusted'
];

/**
 * Secondary emotion sub-labels (Tier 2)
 * Provides nuance without overwhelming the model.
 */
export const SECONDARY_EMOTIONS = {
  neutral: ['calm', 'relaxed', 'focused', 'flat'],
  happy: ['cheerful', 'excited', 'amused', 'warm', 'confident'],
  sad: ['tired', 'disappointed', 'hurt', 'lonely', 'resigned'],
  angry: ['frustrated', 'annoyed', 'hostile', 'impatient', 'agitated'],
  anxious: ['nervous', 'stressed', 'overwhelmed', 'hesitant', 'worried'],
  surprised: ['shocked', 'curious', 'confused', 'startled'],
  disgusted: ['skeptical', 'unimpressed', 'sarcastic', 'dismissive']
};

/**
 * Micro-cues (Tier 3)
 * Subtle vocal qualities that refine the emotional reading.
 */
export const MICRO_CUES = {
  energy: ['low', 'medium', 'high'],
  pitch: ['rising', 'falling', 'flat', 'shaky'],
  rate: ['slow', 'normal', 'fast'],
  volume: ['soft', 'normal', 'loud'],
  pauses: ['frequent', 'long', 'hesitant'],
  quality: ['breathy', 'tense', 'strained', 'smooth']
};

/**
 * Complete emotion schema export
 */
export const EmotionSchema = {
  primary: PRIMARY_EMOTIONS,
  secondary: SECONDARY_EMOTIONS,
  micro: MICRO_CUES
};

/**
 * Default emotion state
 */
export const DEFAULT_EMOTION = {
  primary: 'neutral',
  secondary: 'calm',
  micro: {
    energy: 'medium',
    pitch: 'flat',
    rate: 'normal',
    volume: 'normal'
  },
  confidence: 0
};

/**
 * Validate if an emotion object conforms to the schema
 * @param {Object} emotion - Emotion object to validate
 * @returns {boolean} True if valid
 */
export function validateEmotion(emotion) {
  if (!emotion || typeof emotion !== 'object') return false;
  if (!PRIMARY_EMOTIONS.includes(emotion.primary)) return false;
  if (emotion.secondary && SECONDARY_EMOTIONS[emotion.primary]) {
    if (!SECONDARY_EMOTIONS[emotion.primary].includes(emotion.secondary)) {
      return false;
    }
  }
  if (typeof emotion.confidence !== 'number' ||
      emotion.confidence < 0 ||
      emotion.confidence > 1) {
    return false;
  }
  return true;
}

/**
 * Get a random secondary emotion for a given primary
 * @param {string} primary - Primary emotion
 * @returns {string} Random secondary emotion
 */
export function getRandomSecondary(primary) {
  const secondaries = SECONDARY_EMOTIONS[primary] || SECONDARY_EMOTIONS.neutral;
  return secondaries[Math.floor(Math.random() * secondaries.length)];
}

export default EmotionSchema;
