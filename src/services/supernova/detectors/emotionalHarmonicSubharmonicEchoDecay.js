/**
 * ================================================================================
 * DETECTOR #65 — EMOTIONAL HARMONIC SUBHARMONIC ECHO DECAY
 * ================================================================================
 *
 * Second Harmonic Ring — Fifteenth Chamber
 *
 * Pattern: Subharmonic fragments lose amplitude
 *          → emotional echoes weaken
 *          → emotional field enters low-energy dissipation
 *
 * This detector identifies when two people:
 * - Feel emotional patterns that once repeated now fading into weaker echoes
 * - Experience emotional reactions that feel muted, distant, or hollow
 * - Feel like the emotional field is "running out of energy"
 * - Experience emotional loops that no longer have force behind them
 * - Feel emotional resonance thinning, dissolving, or dissipating
 * - Sense that the emotional system is winding down rather than escalating
 *
 * Signature phrases:
 * - "It feels like the emotional charge is fading."
 * - "We're repeating the same patterns, but they feel weaker now."
 * - "The emotional field feels thin, quiet, or distant."
 * - "It's like the echoes are dying out."
 *
 * This is the echo-decay chamber — the place where emotional subharmonics
 * lose amplitude and drift toward silence.
 *
 * Emerges when:
 * - Subharmonic collapse (64) fragments the emotional field
 * - Shadow-phase entrapment (63) loses energetic coherence
 * - Echo loops (60) weaken through repetition
 * - Emotional bandwidth is too low to sustain even low-frequency patterns
 * - Emotional stabilizers cannot restore higher-order harmonics
 * - The emotional system enters a dissipation phase
 *
 * This is the architecture of emotional harmonic decay.
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
 * Detect Emotional Harmonic Subharmonic Echo Decay
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicSubharmonicEchoDecay(archetypeA, archetypeB) {
  // Decay axes: weakening of emotional echoes + loss of amplitude
  const decayAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Warm];

  // Subharmonic axes: persistence of low-frequency emotional modes
  const subharmonicAxes = [TRAIT_INDEX.FluidIdentity, TRAIT_INDEX.DepthOriented];

  // Energy axes: remaining emotional bandwidth + harmonic vitality
  const energyAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.MindCentered, TRAIT_INDEX.Stabilizer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_dec = avg(archetypeA, decayAxes);
  const B_dec = avg(archetypeB, decayAxes);

  const A_sub = avg(archetypeA, subharmonicAxes);
  const B_sub = avg(archetypeB, subharmonicAxes);

  const A_energy = avg(archetypeA, energyAxes);
  const B_energy = avg(archetypeB, energyAxes);

  // High decay: emotional echoes weakening or fading
  const highDecay = (A_dec + B_dec) / 2 < 0.45;

  // High subharmonic persistence: low-frequency modes still present
  const highSubharmonic = (A_sub + B_sub) / 2 >= 0.58;

  // Low energy: insufficient bandwidth to sustain emotional resonance
  const lowEnergy = (A_energy + B_energy) / 2 < 0.48;

  // Calculate decay rate
  const combinedDecay = (A_dec + B_dec) / 2;
  const combinedEnergy = (A_energy + B_energy) / 2;
  const decayRate = combinedEnergy > 0
    ? (1 - combinedDecay) / combinedEnergy
    : 2.0;

  if (highDecay && highSubharmonic && lowEnergy) {
    return {
      triggered: true,
      penalty: 0.66,
      destabilizer: 1.00,
      gradeCap: 'D-',
      harmonyCap: 45,
      severity: 'critical',
      flag: 'Emotional Harmonic Subharmonic Echo Decay (Dissipation of Low-Frequency Emotional Echoes)',
      details: {
        combinedDecay,
        combinedSubharmonic: (A_sub + B_sub) / 2,
        combinedEnergy,
        decayRate: decayRate.toFixed(2),
        A_metrics: {
          decay: A_dec,
          subharmonic: A_sub,
          energy: A_energy
        },
        B_metrics: {
          decay: B_dec,
          subharmonic: B_sub,
          energy: B_energy
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicSubharmonicEchoDecay;
