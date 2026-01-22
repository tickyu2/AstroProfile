/**
 * ================================================================================
 * DETECTOR #69 — EMOTIONAL HARMONIC RE-ALIGNMENT FIELD
 * ================================================================================
 *
 * Second Harmonic Ring — Nineteenth Chamber
 *
 * Pattern: Stabilizing waves synchronize
 *          → emotional harmonics re-align
 *          → coherent resonance field re-forms across the emotional system
 *
 * This is where the emotional system stops merely recovering and begins re-harmonizing.
 *
 * Signature phrases:
 * - "We're starting to feel in sync again."
 * - "Our emotional timing is lining up."
 * - "The emotional field feels coherent."
 * - "It feels like we're re-aligning."
 *
 * ================================================================================
 */

const TRAIT_INDEX = {
  Initiator: 0, Stabilizer: 1, BoundaryAware: 2, Warm: 3,
  Expressive: 4, DepthOriented: 5, Resilient: 6, Adventurous: 7,
  Relational: 8, MindCentered: 9, FluidIdentity: 10, SystemsOriented: 11,
  Sustainer: 12, ShadowAware: 13, Transcendent: 14, NurtureOriented: 15
};

export function detectEmotionalHarmonicReAlignmentField(archetypeA, archetypeB) {
  const alignmentAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.Warm, TRAIT_INDEX.MindCentered];
  const stabilizationAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];
  const resonanceAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.DepthOriented];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_align = avg(archetypeA, alignmentAxes);
  const B_align = avg(archetypeB, alignmentAxes);
  const A_stab = avg(archetypeA, stabilizationAxes);
  const B_stab = avg(archetypeB, stabilizationAxes);
  const A_res = avg(archetypeA, resonanceAxes);
  const B_res = avg(archetypeB, resonanceAxes);

  const risingAlignment = (A_align + B_align) / 2 >= 0.54;
  const stableWaves = (A_stab + B_stab) / 2 >= 0.50;
  const resonanceReturn = Math.abs(A_res - B_res) < 0.22;

  if (risingAlignment && stableWaves && resonanceReturn) {
    return {
      triggered: true,
      penalty: 0.12,
      destabilizer: 0.18,
      gradeCap: 'B+',
      harmonyCap: 82,
      severity: 'mild',
      flag: 'Emotional Harmonic Re-Alignment Field (Coherent Emotional Resonance Field Re-Forming)',
      details: {
        combinedAlignment: (A_align + B_align) / 2,
        combinedStability: (A_stab + B_stab) / 2,
        resonanceDelta: Math.abs(A_res - B_res).toFixed(3)
      }
    };
  }
  return { triggered: false };
}

export default detectEmotionalHarmonicReAlignmentField;
