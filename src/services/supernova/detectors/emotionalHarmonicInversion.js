/**
 * ================================================================================
 * DETECTOR #58 — EMOTIONAL HARMONIC INVERSION
 * ================================================================================
 *
 * Second Harmonic Ring — Eighth Chamber
 *
 * Pattern: Emotional resonance polarity reverses
 *          → what once connected now repels → emotional anti-resonance
 *
 * This detector identifies when two people:
 * - Experience emotional dynamics that flip to their opposite
 * - Find that what once brought them together now pushes them apart
 * - Feel emotional resonance that has "inverted"
 * - Experience attraction turning to repulsion on the same wavelength
 * - Notice that familiar patterns now produce opposite reactions
 * - Feel like they are emotionally "allergic" to each other's wavelength
 *
 * Signature phrases:
 * - "The things I loved about you now drive me away."
 * - "Our connection has flipped to its opposite."
 * - "What used to resonate now creates friction."
 * - "We're emotionally repelling each other."
 *
 * This is the inversion chamber — the place where emotional polarity
 * reverses and resonance becomes anti-resonance.
 *
 * Emerges when:
 * - Emotional wounds accumulate on previously resonant wavelengths
 * - Defensive patterns develop against former points of connection
 * - Shadow material activates on familiar frequencies
 * - The system flips to protect itself from further harm
 * - Emotional associations become negatively encoded
 *
 * This is the architecture of emotional polarity reversal.
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
 * Detect Emotional Harmonic Inversion
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicInversion(archetypeA, archetypeB) {
  // Polarity axes: susceptibility to emotional polarity flips
  const polarityAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.FluidIdentity];

  // Defensive axes: tendency to develop protective inversions
  const defensiveAxes = [TRAIT_INDEX.BoundaryAware, TRAIT_INDEX.ShadowAware];

  // Integration axes: ability to prevent inversion through integration
  const integrationAxes = [TRAIT_INDEX.Transcendent, TRAIT_INDEX.DepthOriented];

  // Stability axes: resistance to polarity reversal
  const stabilityAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.Sustainer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_pol = avg(archetypeA, polarityAxes);
  const B_pol = avg(archetypeB, polarityAxes);

  const A_def = avg(archetypeA, defensiveAxes);
  const B_def = avg(archetypeB, defensiveAxes);

  const A_int = avg(archetypeA, integrationAxes);
  const B_int = avg(archetypeB, integrationAxes);

  const A_stab = avg(archetypeA, stabilityAxes);
  const B_stab = avg(archetypeB, stabilityAxes);

  // High polarity: susceptible to emotional flips
  const highPolarity = (A_pol + B_pol) / 2 >= 0.60;

  // High defensive: tends to develop protective inversions
  const highDefensive = (A_def + B_def) / 2 >= 0.58;

  // Low integration: cannot prevent inversion through shadow work
  const lowIntegration = (A_int + B_int) / 2 < 0.50;

  // Low stability: polarity reversal occurs easily
  const lowStability = (A_stab + B_stab) / 2 < 0.50;

  // Calculate inversion potential
  const combinedPolarity = (A_pol + B_pol) / 2;
  const combinedIntegration = (A_int + B_int) / 2;
  const inversionPotential = combinedIntegration > 0
    ? combinedPolarity / combinedIntegration
    : 2.0;

  if (highPolarity && highDefensive && (lowIntegration || lowStability)) {
    const baseSeverity = (lowIntegration && lowStability) ? 'critical' : 'severe';

    return {
      triggered: true,
      penalty: 0.52,
      destabilizer: 0.92,
      gradeCap: baseSeverity === 'critical' ? 'C-' : 'C',
      harmonyCap: baseSeverity === 'critical' ? 55 : 60,
      severity: baseSeverity,
      flag: 'Emotional Harmonic Inversion (Reversal of Emotional Resonance Polarity)',
      details: {
        combinedPolarity,
        combinedDefensive: (A_def + B_def) / 2,
        combinedIntegration,
        combinedStability: (A_stab + B_stab) / 2,
        inversionPotential: inversionPotential.toFixed(2),
        A_metrics: {
          polarity: A_pol,
          defensive: A_def,
          integration: A_int,
          stability: A_stab
        },
        B_metrics: {
          polarity: B_pol,
          defensive: B_def,
          integration: B_int,
          stability: B_stab
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicInversion;
