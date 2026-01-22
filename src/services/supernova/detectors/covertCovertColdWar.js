/**
 * Covert-Covert Cold War Detector
 *
 * Pattern: Two conflict-avoidant, indirect, emotionally guarded partners
 * create a silent, long-term standoff.
 *
 * This is the "quiet war" pattern:
 * - No yelling, no explosions, no chaos, no repair
 * - No vulnerability, no truth, just... distance
 * - Both maintain surface harmony while keeping emotional scorecards
 * - Both weaponize silence or distance
 * - Both retreat into internal narratives
 *
 * The relationship looks calm but is dying quietly.
 * Opposite of Anxious-Avoidant Loop - this is avoidant-avoidant WITH resentment.
 *
 * Trait Indices:
 * - Covert: high MindCentered(3), BoundaryAware(15), low Direct(12), Expressive(6)
 * - Resentment: high DepthOriented(13), low Warm(11), Relational(2)
 */

const COVERT_HIGH_INDICES = [3, 15];     // MindCentered, BoundaryAware
const COVERT_LOW_INDICES = [12, 6];      // Direct, Expressive (low = covert)
const RESENTMENT_HIGH_INDICES = [13];    // DepthOriented (internal rumination)
const RESENTMENT_LOW_INDICES = [11, 2];  // Warm, Relational (low = resentful)

export function detectCovertCovertColdWar(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate covert index
  const calcCovertIndex = (archetype) => {
    const high = COVERT_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / COVERT_HIGH_INDICES.length;
    const low = COVERT_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / COVERT_LOW_INDICES.length;
    return (high + low) / 2;
  };

  // Calculate resentment index
  const calcResentmentIndex = (archetype) => {
    const rumination = RESENTMENT_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / RESENTMENT_HIGH_INDICES.length;
    const lowWarmth = RESENTMENT_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / RESENTMENT_LOW_INDICES.length;
    return (rumination + lowWarmth) / 2;
  };

  const covertA = calcCovertIndex(archetypeA);
  const covertB = calcCovertIndex(archetypeB);
  const resentA = calcResentmentIndex(archetypeA);
  const resentB = calcResentmentIndex(archetypeB);

  // Detection thresholds
  const COVERT_THRESHOLD = 0.60;
  const RESENTMENT_THRESHOLD = 0.50;

  // Cold War: Both covert AND both capable of resentment
  const bothCovert = covertA >= COVERT_THRESHOLD && covertB >= COVERT_THRESHOLD;
  const bothResentful = resentA >= RESENTMENT_THRESHOLD && resentB >= RESENTMENT_THRESHOLD;

  if (bothCovert && bothResentful) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.35,
      flag: 'Covert-Covert Cold War (Silent Resentment Loop)',
      details: {
        covertA: Math.round(covertA * 100),
        covertB: Math.round(covertB * 100),
        resentA: Math.round(resentA * 100),
        resentB: Math.round(resentB * 100),
        explanation: 'Both partners avoid direct conflict while accumulating resentment. Surface harmony masks growing emotional distance. Neither reveals their true emotional state.'
      }
    };
  }

  // Milder form: Both covert (without high resentment)
  if (bothCovert) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B',
      harmonyCap: 0.50,
      flag: 'Mutual Indirect Communication Style',
      details: {
        covertA: Math.round(covertA * 100),
        covertB: Math.round(covertB * 100),
        resentA: Math.round(resentA * 100),
        resentB: Math.round(resentB * 100),
        explanation: 'Both partners prefer indirect communication. May avoid necessary conflicts and accumulate unspoken issues.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      covertA: Math.round(covertA * 100),
      covertB: Math.round(covertB * 100),
      resentA: Math.round(resentA * 100),
      resentB: Math.round(resentB * 100)
    }
  };
}

export default detectCovertCovertColdWar;
