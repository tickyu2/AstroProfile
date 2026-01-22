/**
 * ================================================================================
 * DETECTOR #57 — EMOTIONAL HARMONIC RESONANCE COLLAPSE
 * ================================================================================
 *
 * Second Harmonic Ring — Seventh Chamber
 *
 * Pattern: Complete loss of emotional harmonic coherence
 *          → resonance field breakdown → emotional disconnection
 *
 * This detector identifies when two people:
 * - Lose all emotional resonance coherence simultaneously
 * - Experience emotional connection that suddenly "goes dark"
 * - Feel like the emotional field between them has collapsed
 * - Cannot find any emotional wavelength to connect on
 * - Experience moments where emotional resonance simply stops
 * - Feel like they are emotionally invisible to each other
 *
 * Signature phrases:
 * - "It's like the emotional connection just disappeared."
 * - "We can't find each other emotionally anymore."
 * - "The resonance between us has gone silent."
 * - "We've lost all emotional coherence."
 *
 * This is the collapse chamber — the place where emotional resonance
 * breaks down entirely.
 *
 * Emerges when:
 * - Multiple harmonic systems fail simultaneously
 * - Emotional bandwidth drops below critical threshold
 * - Stabilizing mechanisms are overwhelmed
 * - Phase, frequency, and amplitude all desynchronize at once
 * - The system lacks redundancy to maintain partial coherence
 *
 * This is the architecture of total emotional resonance failure.
 *
 * ================================================================================
 */

/**
 * Archetype vector indices
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

/**
 * Detect Emotional Harmonic Resonance Collapse
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicResonanceCollapse(archetypeA, archetypeB) {
  // Coherence axes: ability to maintain emotional harmonic coherence
  const coherenceAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.Warm];

  // Stability axes: ability to prevent collapse
  const stabilityAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  // Redundancy axes: backup systems for maintaining connection
  const redundancyAxes = [TRAIT_INDEX.DepthOriented, TRAIT_INDEX.NurtureOriented];

  // Recovery axes: ability to restore coherence after collapse
  const recoveryAxes = [TRAIT_INDEX.Resilient, TRAIT_INDEX.MindCentered];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_coh = avg(archetypeA, coherenceAxes);
  const B_coh = avg(archetypeB, coherenceAxes);

  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  const A_red = avg(archetypeA, redundancyAxes);
  const B_red = avg(archetypeB, redundancyAxes);

  const A_rec = avg(archetypeA, recoveryAxes);
  const B_rec = avg(archetypeB, recoveryAxes);

  // Low coherence: emotional resonance is weak
  const lowCoherence = (A_coh + B_coh) / 2 < 0.50;

  // Low stability: collapse is not prevented
  const lowStability = (A_stab + B_stab) / 2 < 0.48;

  // Low redundancy: no backup connection systems
  const lowRedundancy = (A_red + B_red) / 2 < 0.50;

  // Low recovery: cannot restore coherence after collapse
  const lowRecovery = (A_rec + B_rec) / 2 < 0.48;

  // Calculate collapse risk
  const combinedCoherence = (A_coh + B_coh) / 2;
  const combinedStability = (A_stab + B_stab) / 2;
  const collapseRisk = (combinedCoherence + combinedStability) > 0
    ? 1 / (combinedCoherence + combinedStability)
    : 2.0;

  if (lowCoherence && lowStability && (lowRedundancy || lowRecovery)) {
    const baseSeverity = (lowRedundancy && lowRecovery) ? 'critical' : 'severe';

    return {
      triggered: true,
      penalty: 0.50,
      destabilizer: 0.90,
      gradeCap: baseSeverity === 'critical' ? 'C' : 'C+',
      harmonyCap: baseSeverity === 'critical' ? 58 : 62,
      severity: baseSeverity,
      flag: 'Emotional Harmonic Resonance Collapse (Loss of Emotional Harmonic Coherence and Field Breakdown)',
      details: {
        combinedCoherence,
        combinedStability,
        combinedRedundancy: (A_red + B_red) / 2,
        combinedRecovery: (A_rec + B_rec) / 2,
        collapseRisk: collapseRisk.toFixed(2),
        A_metrics: {
          coherence: A_coh,
          stability: A_stab,
          redundancy: A_red,
          recovery: A_rec
        },
        B_metrics: {
          coherence: B_coh,
          stability: B_stab,
          redundancy: B_red,
          recovery: B_rec
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicResonanceCollapse;
