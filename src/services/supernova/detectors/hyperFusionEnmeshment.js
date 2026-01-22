/**
 * Hyper-Fusion Enmeshment Detector
 *
 * Pattern: Two partners merge identities -> loss of autonomy
 * -> emotional over-coupling -> structural collapse through over-connection
 *
 * This is the "we are one person" failure mode:
 * - No boundaries, no autonomy, no differentiation
 * - No independent emotional regulation
 * - No space, no self
 *
 * It looks harmonious from the outside, but internally it is suffocating.
 * The counter-pole to the Double-Solar pattern - too little separation instead of too much.
 *
 * Trait Indices:
 * - Fusion high: Warm(11), Relational(2), FluidIdentity(10)
 * - Fusion low: BoundaryAware(15), Direct(12)
 */

const FUSION_HIGH_INDICES = [11, 2, 10];  // Warm, Relational, FluidIdentity
const FUSION_LOW_INDICES = [15, 12];       // BoundaryAware, Direct (low = enmeshed)

export function detectHyperFusionEnmeshment(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate fusion index
  const calcFusionIndex = (archetype) => {
    const high = FUSION_HIGH_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / FUSION_HIGH_INDICES.length;
    const low = FUSION_LOW_INDICES.reduce((s, i) => s + (1 - (archetype[i] || 0)), 0) / FUSION_LOW_INDICES.length;
    return (high + low) / 2;
  };

  const fusionA = calcFusionIndex(archetypeA);
  const fusionB = calcFusionIndex(archetypeB);

  // Detection threshold
  const FUSION_THRESHOLD = 0.65;

  // Both partners highly fused
  const bothFused = fusionA >= FUSION_THRESHOLD && fusionB >= FUSION_THRESHOLD;

  if (bothFused) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.40,
      flag: 'Hyper-Fusion Enmeshment (Loss of Autonomy)',
      details: {
        fusionA: Math.round(fusionA * 100),
        fusionB: Math.round(fusionB * 100),
        explanation: 'Both partners tend toward merging identities. May lose individual autonomy and create suffocating over-connection. Differentiation and healthy boundaries may be difficult to maintain.'
      }
    };
  }

  // One partner highly fused (asymmetric enmeshment risk)
  const oneFused = (fusionA >= FUSION_THRESHOLD && fusionB < 0.50) ||
                   (fusionB >= FUSION_THRESHOLD && fusionA < 0.50);

  if (oneFused) {
    const fusedProfile = fusionA >= FUSION_THRESHOLD ? 'A' : 'B';
    const autonomousProfile = fusionA >= FUSION_THRESHOLD ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.05,
      gradeCap: 'B-',
      harmonyCap: 0.50,
      flag: 'Enmeshment-Autonomy Tension',
      details: {
        fusionA: Math.round(fusionA * 100),
        fusionB: Math.round(fusionB * 100),
        fusedProfile,
        autonomousProfile,
        explanation: `Profile ${fusedProfile} seeks deep fusion while Profile ${autonomousProfile} maintains more autonomy. May create tension around closeness vs space.`
      }
    };
  }

  return {
    triggered: false,
    details: {
      fusionA: Math.round(fusionA * 100),
      fusionB: Math.round(fusionB * 100)
    }
  };
}

export default detectHyperFusionEnmeshment;
