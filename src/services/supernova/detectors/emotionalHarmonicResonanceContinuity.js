/**
 * Detector #86: Emotional Harmonic Resonance Continuity
 *
 * Pattern: Meta-stable resonance becomes continuous → emotional field maintains
 * unbroken harmonic flow → harmonics persist across time, context, and change
 *
 * This detector identifies when two people:
 * - Feel emotional resonance that persists across situations, moods, and environments
 * - Experience emotional presence that remains steady even when attention shifts
 * - Sense emotional rhythms that continue beneath the surface without interruption
 * - Feel emotional cycles that maintain coherence across long arcs of time
 * - Experience the emotional field as a continuous harmonic stream
 *
 * The signature of relationships where partners say:
 * "The connection is always there."
 * "Our resonance doesn't break — it just flows."
 * "Even when we're apart, the field continues."
 */

const TRAIT_INDEX = {
  Initiator: 0,
  Stabilizer: 1,
  BoundaryAware: 2,
  Warm: 3,
  Expressive: 4,
  DepthOriented: 5,
  Resilient: 6,
  Adventurous: 7,
  Relational: 8,
  MindCentered: 9,
  FluidIdentity: 10,
  SystemsOriented: 11,
  Sustainer: 12,
  ShadowAware: 13,
  Transcendent: 14,
  NurtureOriented: 15
};

function avg(archetype, indices) {
  const sum = indices.reduce((s, i) => s + (archetype[i] || 0), 0);
  return sum / indices.length;
}

export function detectEmotionalHarmonicResonanceContinuity(archetypeA, archetypeB) {
  // Continuity axes: unbroken flow, enduring resonance, persistent harmonic presence
  const continuityAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.MindCentered, TRAIT_INDEX.DepthOriented];

  // Meta-stability axes: adaptive equilibrium supporting continuity
  const metaAxes = [TRAIT_INDEX.FluidIdentity, TRAIT_INDEX.Expressive];

  // Stability axes: long-term harmonic resilience
  const stabilityAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer, TRAIT_INDEX.BoundaryAware];

  const A_con = avg(archetypeA, continuityAxes);
  const B_con = avg(archetypeB, continuityAxes);

  const A_meta = avg(archetypeA, metaAxes);
  const B_meta = avg(archetypeB, metaAxes);

  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  // Continuity: unbroken harmonic flow across time and context
  const highContinuity = (A_con + B_con) / 2 >= 0.76;

  // Meta-stability support: adaptive equilibrium enabling continuity
  const strongMetaStability = (A_meta + B_meta) / 2 >= 0.66;

  // Stability: emotional system able to sustain long-term harmonic presence
  const sustainedStability = (A_stab + B_stab) / 2 >= 0.62;

  if (highContinuity && strongMetaStability && sustainedStability) {
    return {
      triggered: true,
      penalty: 0.00,
      destabilizer: 0.00,
      gradeCap: null,
      harmonyCap: null,
      severity: 'none',
      flag: 'Emotional Harmonic Resonance Continuity (Unbroken, Persistent, Long-Arc Harmonic Flow)',
      details: {
        continuityAvg: (A_con + B_con) / 2,
        metaStabilityAvg: (A_meta + B_meta) / 2,
        stabilityAvg: (A_stab + B_stab) / 2
      }
    };
  }

  return { triggered: false };
}
