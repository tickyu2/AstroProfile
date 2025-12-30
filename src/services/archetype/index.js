/**
 * ============================================================================
 * GENESIS ARCHETYPE DETECTION SYSTEM
 * ============================================================================
 *
 * Main entry point for the GENESIS Archetype Detection System.
 * Provides archetype detection, signal extraction, and emotion congruence
 * analysis for Luna's emotional intelligence.
 *
 * The 9 GENESIS Archetypes:
 * - Seed: Beginning, exploration, possibility
 * - Mirror: Reflection, truth-seeking, clarity
 * - Mender: Healing, tenderness, repair
 * - Librarian: Memory, pattern, continuity
 * - Conductor: Alignment, structure, organization
 * - Companion: Connection, warmth, togetherness
 * - Guardian: Boundaries, protection, sovereignty
 * - Flamebearer: Purpose, drive, momentum
 * - Guide: Integration, wholeness, wisdom
 *
 * Usage:
 * ```javascript
 * import { detectArchetype, analyzeCongruence } from './services/archetype';
 *
 * // Detect archetype from user message
 * const result = detectArchetype("I'm feeling lost and confused about my future");
 * console.log(result.archetype); // 'seed'
 *
 * // Check voice/text congruence
 * const voiceEmotions = { sad: 0.7, fear: 0.3, neutral: 0.1 };
 * const congruence = analyzeCongruence(voiceEmotions, "I'm fine, everything is okay");
 * console.log(congruence.isCongruent); // false
 * ```
 *
 * Part of: GENESIS Cathedral Emotional Architecture
 * Created: December 29, 2024
 * ============================================================================
 */

// Core classes
export { SignalExtractor, signalExtractor, extractSignals } from './signalExtractor.js';
export { ArchetypeDetector, archetypeDetector, detectArchetype, getArchetypeGuidance } from './archetypeDetector.js';
export { CongruenceService, congruenceService, analyzeCongruence, quickCongruenceCheck } from './congruenceService.js';

// Lexicons and constants
export {
  LEXICONS,
  ARCHETYPE_COLORS,
  ARCHETYPE_ICONS,
  ARCHETYPE_NAMES,
  ARCHETYPE_DESCRIPTIONS
} from './lexicons.js';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Complete analysis of user message with optional voice data
 * @param {string} message - User message
 * @param {Object} options - Analysis options
 * @returns {Object} Complete analysis result
 */
export async function analyzeMessage(message, options = {}) {
  const { voiceEmotions = null, includeSignals = false } = options;

  // Dynamic import to avoid circular dependencies
  const { archetypeDetector } = await import('./archetypeDetector.js');
  const { congruenceService } = await import('./congruenceService.js');

  // Detect archetype
  const archetypeResult = archetypeDetector.detect(message, {
    includeSignals,
    voiceEmotions
  });

  // If voice data provided, analyze congruence
  let congruenceResult = null;
  if (voiceEmotions) {
    congruenceResult = congruenceService.analyzeCongruence(voiceEmotions, message);
  }

  return {
    archetype: archetypeResult,
    congruence: congruenceResult,
    recommendation: generateCombinedRecommendation(archetypeResult, congruenceResult)
  };
}

/**
 * Generate combined recommendation from archetype and congruence
 */
function generateCombinedRecommendation(archetypeResult, congruenceResult) {
  const recommendation = {
    primaryArchetype: archetypeResult.archetype,
    confidence: archetypeResult.confidence,
    suggestedOpening: archetypeResult.style?.openings?.[0],
    tone: archetypeResult.style?.tone,
    approach: archetypeResult.style?.approach
  };

  // Adjust if congruence indicates issues
  if (congruenceResult && !congruenceResult.isCongruent) {
    recommendation.congruenceNote = congruenceResult.recommendation?.message;
    recommendation.adjustedApproach = 'Acknowledge potential unexpressed emotions before using standard archetype approach';

    // May need to override archetype based on voice
    if (congruenceResult.recommendation?.archetypeHint) {
      recommendation.alternateArchetype = congruenceResult.recommendation.archetypeHint;
    }
  }

  return recommendation;
}

/**
 * Get all archetype definitions
 */
export function getAllArchetypes() {
  return Object.keys(ARCHETYPE_NAMES).map(key => ({
    id: key,
    name: ARCHETYPE_NAMES[key],
    icon: ARCHETYPE_ICONS[key],
    color: ARCHETYPE_COLORS[key],
    description: ARCHETYPE_DESCRIPTIONS[key]
  }));
}

/**
 * Validate that archetype exists
 */
export function isValidArchetype(archetype) {
  return archetype in ARCHETYPE_NAMES;
}
