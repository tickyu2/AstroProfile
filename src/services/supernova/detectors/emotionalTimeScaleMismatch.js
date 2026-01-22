/**
 * Emotional Time-Scale Mismatch Detector (18th)
 *
 * Pattern: Partners process emotions on fundamentally different time scales
 * -> one has "moved on" while the other is still processing -> chronic desynchronization
 *
 * This is the "why are you still upset about that?" pattern.
 * - One processes quickly (high Expressive, high Direct, low DepthOriented)
 * - One processes slowly (high DepthOriented, high Intuitive, low Expressive)
 * - Fast processor thinks slow processor is "stuck"
 * - Slow processor thinks fast processor is "superficial" or "dismissive"
 *
 * This is temporal-emotional asynchrony.
 *
 * Trait Indices:
 * - Fast processing: Expressive(6), Direct(12), Initiator(0), low DepthOriented(13)
 * - Slow processing: DepthOriented(13), Intuitive(4), Sustainer(14), low Expressive(6)
 */

const FAST_PROCESSING_INDICES = [6, 12, 0];     // Expressive, Direct, Initiator
const SLOW_PROCESSING_INDICES = [13, 4, 14];    // DepthOriented, Intuitive, Sustainer
const DEPTH_INDEX = 13;                          // DepthOriented
const EXPRESSIVE_INDEX = 6;                      // Expressive

export function detectEmotionalTimeScaleMismatch(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate processing speed index
  const calcProcessingSpeed = (archetype) => {
    const fast = FAST_PROCESSING_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / FAST_PROCESSING_INDICES.length;
    const slow = SLOW_PROCESSING_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / SLOW_PROCESSING_INDICES.length;
    // Adjust for key traits
    const depthPenalty = archetype[DEPTH_INDEX] || 0;
    const expressiveBonus = archetype[EXPRESSIVE_INDEX] || 0;
    return fast - slow + (expressiveBonus - depthPenalty) * 0.3;
  };

  const speedA = calcProcessingSpeed(archetypeA);
  const speedB = calcProcessingSpeed(archetypeB);
  const speedDifference = Math.abs(speedA - speedB);

  // Identify fast and slow processor
  const fastProfile = speedA > speedB ? 'A' : 'B';
  const slowProfile = speedA > speedB ? 'B' : 'A';

  // Detection thresholds
  const SEVERE_MISMATCH = 0.50;
  const MODERATE_MISMATCH = 0.35;
  const MILD_MISMATCH = 0.22;

  if (speedDifference >= SEVERE_MISMATCH) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.38,
      flag: 'Emotional Time-Scale Mismatch (Severe Desynchronization)',
      details: {
        speedA: Math.round(speedA * 100),
        speedB: Math.round(speedB * 100),
        speedDifference: Math.round(speedDifference * 100),
        fastProfile,
        slowProfile,
        explanation: `Profile ${fastProfile} processes and releases emotions quickly while Profile ${slowProfile} processes deeply over time. ${fastProfile} will think ${slowProfile} is "stuck"; ${slowProfile} will think ${fastProfile} is "dismissive".`
      }
    };
  }

  if (speedDifference >= MODERATE_MISMATCH) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.06,
      gradeCap: 'C+',
      harmonyCap: 0.48,
      flag: 'Emotional Processing Asynchrony',
      details: {
        speedA: Math.round(speedA * 100),
        speedB: Math.round(speedB * 100),
        speedDifference: Math.round(speedDifference * 100),
        fastProfile,
        slowProfile,
        explanation: `Partners process emotions on different time scales. May experience "are you still upset about that?" moments.`
      }
    };
  }

  if (speedDifference >= MILD_MISMATCH) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.03,
      gradeCap: 'B',
      harmonyCap: 0.55,
      flag: 'Emotional Tempo Difference',
      details: {
        speedA: Math.round(speedA * 100),
        speedB: Math.round(speedB * 100),
        speedDifference: Math.round(speedDifference * 100),
        explanation: 'Some difference in emotional processing tempo. Manageable with awareness.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      speedA: Math.round(speedA * 100),
      speedB: Math.round(speedB * 100),
      speedDifference: Math.round(speedDifference * 100)
    }
  };
}

export default detectEmotionalTimeScaleMismatch;
