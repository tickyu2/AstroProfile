/**
 * Power-Caretaker Imbalance Detector (11th)
 *
 * Pattern: One partner dominates the system while the other absorbs emotional labor
 * -> chronic asymmetry -> structural burnout
 *
 * This is the "I carry the relationship, you carry the mission" pattern.
 * - One partner has high dominance, high agency, high self-narrative
 * - The other partner has high warmth, high relationality, high stabilizer traits
 * - The power partner expects emotional support
 * - The caretaker partner suppresses their own needs
 * - Resentment accumulates, burnout occurs
 *
 * This is a slow-burn collapse, not an explosive one.
 *
 * Trait Indices:
 * - Power: Initiator(0), Direct(12), Expressive(6), low Relational(2)
 * - Caretaker: Warm(11), Relational(2), Sustainer(14), low BoundaryAware(15)
 */

const POWER_HIGH_INDICES = [0, 12, 6];     // Initiator, Direct, Expressive
const POWER_LOW_INDICES = [2];              // Relational (low = power-focused)
const CARETAKER_HIGH_INDICES = [11, 2, 14]; // Warm, Relational, Sustainer
const CARETAKER_LOW_INDICES = [15];         // BoundaryAware (low = caretaker)

export function detectPowerCaretakerImbalance(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate power index
  const calcPowerIndex = (archetype) => {
    const high = POWER_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / POWER_HIGH_INDICES.length;
    const low = POWER_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / POWER_LOW_INDICES.length;
    return (high + low) / 2;
  };

  // Calculate caretaker index
  const calcCaretakerIndex = (archetype) => {
    const high = CARETAKER_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / CARETAKER_HIGH_INDICES.length;
    const low = CARETAKER_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / CARETAKER_LOW_INDICES.length;
    return (high + low) / 2;
  };

  const powerA = calcPowerIndex(archetypeA);
  const powerB = calcPowerIndex(archetypeB);
  const careA = calcCaretakerIndex(archetypeA);
  const careB = calcCaretakerIndex(archetypeB);

  // Detection thresholds
  const POWER_THRESHOLD = 0.65;
  const CARETAKER_THRESHOLD = 0.65;

  // Pattern: One power + one caretaker
  const A_power_B_care = powerA >= POWER_THRESHOLD && careB >= CARETAKER_THRESHOLD;
  const B_power_A_care = powerB >= POWER_THRESHOLD && careA >= CARETAKER_THRESHOLD;

  if (A_power_B_care || B_power_A_care) {
    const powerProfile = A_power_B_care ? 'A' : 'B';
    const caretakerProfile = A_power_B_care ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.12,
      gradeCap: 'C',
      harmonyCap: 0.35,
      flag: 'Power-Caretaker Imbalance (Chronic Asymmetry Burnout)',
      details: {
        powerA: Math.round(powerA * 100),
        powerB: Math.round(powerB * 100),
        careA: Math.round(careA * 100),
        careB: Math.round(careB * 100),
        powerProfile,
        caretakerProfile,
        explanation: `Profile ${powerProfile} dominates the system while Profile ${caretakerProfile} absorbs emotional labor. This creates chronic asymmetry leading to burnout.`
      }
    };
  }

  // Milder form: Moderate imbalance
  const mildImbalance = (powerA >= 0.55 && careB >= 0.55) || (powerB >= 0.55 && careA >= 0.55);
  if (mildImbalance) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.05,
      gradeCap: 'B-',
      harmonyCap: 0.50,
      flag: 'Power-Caretaker Tendency',
      details: {
        powerA: Math.round(powerA * 100),
        powerB: Math.round(powerB * 100),
        careA: Math.round(careA * 100),
        careB: Math.round(careB * 100),
        explanation: 'Moderate power-caretaker dynamic present. May need conscious balancing.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      powerA: Math.round(powerA * 100),
      powerB: Math.round(powerB * 100),
      careA: Math.round(careA * 100),
      careB: Math.round(careB * 100)
    }
  };
}

export default detectPowerCaretakerImbalance;
