/**
 * Chaotic-Chaotic Spiral Detector
 *
 * Pattern: Two high-volatility, low-stability personalities amplify each other
 * -> runaway escalation -> structural entropy
 *
 * This is the "spiral into madness" pattern.
 * - No grounding, no stabilizer, no boundary
 * - No repair, no containment, no predictability
 *
 * It's not dominance. It's not attachment. It's entropy.
 * The opposite of Rigid Moralist clash - it's entropy meeting entropy.
 *
 * Trait Indices:
 * - Chaos: RiskSeeking(8), FluidIdentity(10), Expressive(6)
 * - Stability: Stabilizer(1), OrderOriented(9), BoundaryAware(15)
 */

const CHAOS_INDICES = [8, 10, 6];      // RiskSeeking, FluidIdentity, Expressive
const STABILITY_INDICES = [1, 9, 15];  // Stabilizer, OrderOriented, BoundaryAware

export function detectChaoticChaoticSpiral(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate chaos index
  const calcChaosIndex = (archetype) => {
    return CHAOS_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / CHAOS_INDICES.length;
  };

  // Calculate stability index
  const calcStabilityIndex = (archetype) => {
    return STABILITY_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / STABILITY_INDICES.length;
  };

  const chaosA = calcChaosIndex(archetypeA);
  const chaosB = calcChaosIndex(archetypeB);
  const stabilityA = calcStabilityIndex(archetypeA);
  const stabilityB = calcStabilityIndex(archetypeB);

  // Detection thresholds
  const CHAOS_THRESHOLD = 0.65;
  const LOW_STABILITY_THRESHOLD = 0.40;

  // Spiral: Both chaotic AND both unstable
  const bothChaotic = chaosA >= CHAOS_THRESHOLD && chaosB >= CHAOS_THRESHOLD;
  const bothUnstable = stabilityA <= LOW_STABILITY_THRESHOLD && stabilityB <= LOW_STABILITY_THRESHOLD;

  if (bothChaotic && bothUnstable) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.12,
      gradeCap: 'C-',
      harmonyCap: 0.25,
      flag: 'Chaotic-Chaotic Spiral (Mutual Escalation Loop)',
      details: {
        chaosA: Math.round(chaosA * 100),
        chaosB: Math.round(chaosB * 100),
        stabilityA: Math.round(stabilityA * 100),
        stabilityB: Math.round(stabilityB * 100),
        explanation: 'Both partners are high-volatility with no grounding force. They amplify each other\'s chaos with no containment or repair mechanism.'
      }
    };
  }

  // Partial: Both chaotic but one has some stability
  if (bothChaotic && (stabilityA <= 0.50 || stabilityB <= 0.50)) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.07,
      gradeCap: 'C',
      harmonyCap: 0.40,
      flag: 'High Volatility Pairing',
      details: {
        chaosA: Math.round(chaosA * 100),
        chaosB: Math.round(chaosB * 100),
        stabilityA: Math.round(stabilityA * 100),
        stabilityB: Math.round(stabilityB * 100),
        explanation: 'Both partners have high chaos energy. One provides some stability but escalation risk remains.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      chaosA: Math.round(chaosA * 100),
      chaosB: Math.round(chaosB * 100),
      stabilityA: Math.round(stabilityA * 100),
      stabilityB: Math.round(stabilityB * 100)
    }
  };
}

export default detectChaoticChaoticSpiral;
