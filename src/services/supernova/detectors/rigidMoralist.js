/**
 * Rigid Moralist Clash Detector
 *
 * Detects when one partner is rule-driven, rigid, moralistic
 * while the other is improvisational, chaos-driven, fluid.
 *
 * Outcome: Constant friction, no shared frame, fundamental incompatibility.
 *
 * Trait Indices (from SIGN_ARCHETYPE_VECTORS):
 * - OrderOriented(9), Stabilizer(1) = Rigidity
 * - RiskSeeking(8), FluidIdentity(10) = Chaos/Flexibility
 */

const RIGID_INDICES = [9, 1];    // OrderOriented, Stabilizer
const CHAOS_INDICES = [8, 10];  // RiskSeeking, FluidIdentity

export function detectRigidMoralist(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate rigidity and chaos scores
  const calcRigidity = (archetype) => {
    return RIGID_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / RIGID_INDICES.length;
  };

  const calcChaos = (archetype) => {
    return CHAOS_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / CHAOS_INDICES.length;
  };

  const rigidA = calcRigidity(archetypeA);
  const rigidB = calcRigidity(archetypeB);
  const chaosA = calcChaos(archetypeA);
  const chaosB = calcChaos(archetypeB);

  // Detection thresholds
  const HIGH_RIGID_THRESHOLD = 0.65;
  const HIGH_CHAOS_THRESHOLD = 0.65;

  // Rigid vs Chaos clash: One very rigid, one very chaotic
  const rigidAvsChaosB = rigidA >= HIGH_RIGID_THRESHOLD && chaosB >= HIGH_CHAOS_THRESHOLD;
  const rigidBvsChaosA = rigidB >= HIGH_RIGID_THRESHOLD && chaosA >= HIGH_CHAOS_THRESHOLD;

  if (rigidAvsChaosB || rigidBvsChaosA) {
    const rigidProfile = rigidAvsChaosB ? 'A' : 'B';
    const chaosProfile = rigidAvsChaosB ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.12,
      gradeCap: 'D',
      harmonyCap: 0.35,
      flag: 'Rigid Moralist vs Chaos Architect Clash',
      details: {
        rigidA: Math.round(rigidA * 100),
        rigidB: Math.round(rigidB * 100),
        chaosA: Math.round(chaosA * 100),
        chaosB: Math.round(chaosB * 100),
        rigidProfile,
        chaosProfile,
        explanation: `Profile ${rigidProfile} is highly order-oriented while Profile ${chaosProfile} thrives in chaos. Fundamental worldview incompatibility.`
      }
    };
  }

  // Milder form: Moderate rigidity vs chaos
  const mildRigidAvsChaosB = rigidA >= 0.55 && chaosB >= 0.55 && Math.abs(rigidA - chaosB) <= 0.15;
  const mildRigidBvsChaosA = rigidB >= 0.55 && chaosA >= 0.55 && Math.abs(rigidB - chaosA) <= 0.15;

  if (mildRigidAvsChaosB || mildRigidBvsChaosA) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.05,
      gradeCap: 'C+',
      harmonyCap: 0.50,
      flag: 'Order-Chaos Tension',
      details: {
        rigidA: Math.round(rigidA * 100),
        rigidB: Math.round(rigidB * 100),
        chaosA: Math.round(chaosA * 100),
        chaosB: Math.round(chaosB * 100),
        explanation: 'Moderate tension between order-seeking and flexibility-seeking orientations.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      rigidA: Math.round(rigidA * 100),
      rigidB: Math.round(rigidB * 100),
      chaosA: Math.round(chaosA * 100),
      chaosB: Math.round(chaosB * 100)
    }
  };
}

export default detectRigidMoralist;
