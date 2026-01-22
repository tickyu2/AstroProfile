/**
 * ================================================================================
 * DETECTOR #55 — EMOTIONAL HARMONIC DISSONANCE CASCADE
 * ================================================================================
 *
 * Second Harmonic Ring — Fifth Chamber
 *
 * Pattern: One emotional dissonance triggers another → cascading destabilization
 *          → runaway emotional turbulence
 *
 * This detector identifies when two people:
 * - Experience one emotional mismatch that triggers another
 * - Fall into emotional chain reactions (one misalignment → another → another)
 * - Experience emotional instability that escalates rapidly
 * - Feel like emotional dissonance "spreads" through the system
 * - Cannot isolate emotional issues because they propagate across layers
 * - Experience emotional turbulence that feels disproportionate to the trigger
 *
 * Signature phrases:
 * - "One small thing sets off everything."
 * - "Once we get out of sync, everything unravels."
 * - "Our emotional misalignments cascade into bigger problems."
 * - "We can't contain emotional dissonance — it spreads."
 *
 * This is the cascade chamber — the place where emotional dissonance
 * becomes self-propagating.
 *
 * Emerges when:
 * - Frequency mismatch (51) destabilizes amplitude (52)
 * - Amplitude interference destabilizes phase (53)
 * - Phase misalignment destabilizes harmonic density (54)
 * - The system lacks stabilizers to break the chain
 * - Emotional bandwidth is too low to absorb the cascade
 * - Emotional cycles accelerate instead of dampening
 *
 * This is the architecture of runaway emotional dissonance.
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
 * Detect Emotional Harmonic Dissonance Cascade
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicDissonanceCascade(archetypeA, archetypeB) {
  // Dissonance axes: sensitivity to emotional mismatch propagation
  const dissonanceAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.FluidIdentity];

  // Containment axes: ability to isolate emotional issues
  const containmentAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.BoundaryAware];

  // Stabilizer axes: ability to dampen emotional chain reactions
  const stabilizerAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  // Resilience axes: ability to recover from cascade events
  const resilienceAxes = [TRAIT_INDEX.Resilient, TRAIT_INDEX.ShadowAware];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_dis = avg(archetypeA, dissonanceAxes);
  const B_dis = avg(archetypeB, dissonanceAxes);

  const A_cont = avg(archetypeA, containmentAxes);
  const B_cont = avg(archetypeB, containmentAxes);

  const A_stab = avg(archetypeA, stabilizerAxes);
  const B_stab = avg(archetypeB, stabilizerAxes);

  const A_res = avg(archetypeA, resilienceAxes);
  const B_res = avg(archetypeB, resilienceAxes);

  // High dissonance sensitivity: emotional mismatches propagate easily
  const highDissonance = (A_dis + B_dis) / 2 >= 0.60;

  // Low containment: emotional issues cannot be isolated
  const lowContainment = (A_cont + B_cont) / 2 < 0.50;

  // Low stabilizers: chain reactions cannot be dampened
  const lowStability = (A_stab + B_stab) / 2 < 0.52;

  // Low resilience: difficult to recover after cascade
  const lowResilience = (A_res + B_res) / 2 < 0.50;

  // Calculate cascade potential
  const combinedDissonance = (A_dis + B_dis) / 2;
  const combinedContainment = (A_cont + B_cont) / 2;
  const combinedStability = (A_stab + B_stab) / 2;
  const cascadePotential = combinedDissonance /
    (combinedContainment + combinedStability + 0.01);

  if (highDissonance && (lowContainment || lowStability)) {
    const baseSeverity = lowResilience ? 'severe' : 'moderate';

    return {
      triggered: true,
      penalty: 0.46,
      destabilizer: 0.85,
      gradeCap: lowResilience ? 'C+' : 'B-',
      harmonyCap: lowResilience ? 65 : 68,
      severity: baseSeverity,
      flag: 'Emotional Harmonic Dissonance Cascade (Runaway Emotional Instability Triggered by Harmonic Mismatch)',
      details: {
        combinedDissonance,
        combinedContainment,
        combinedStability,
        combinedResilience: (A_res + B_res) / 2,
        cascadePotential: cascadePotential.toFixed(2),
        A_metrics: {
          dissonance: A_dis,
          containment: A_cont,
          stability: A_stab,
          resilience: A_res
        },
        B_metrics: {
          dissonance: B_dis,
          containment: B_cont,
          stability: B_stab,
          resilience: B_res
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicDissonanceCascade;
