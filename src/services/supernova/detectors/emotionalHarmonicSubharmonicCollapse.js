/**
 * ================================================================================
 * DETECTOR #64 — EMOTIONAL HARMONIC SUBHARMONIC COLLAPSE
 * ================================================================================
 *
 * Second Harmonic Ring — Fourteenth Chamber
 *
 * Pattern: Emotional harmonics collapse into unstable subharmonics
 *          → fragmentation, low-frequency oscillation
 *          → emotional field degradation
 *
 * This detector identifies when two people:
 * - Experience emotional resonance that collapses into lower-order, unstable subharmonics
 * - Feel emotional reactions that become fragmented, shallow, or erratic
 * - Experience emotional cycles that lose complexity and fall into primitive oscillations
 * - Feel like the emotional field has "broken apart"
 * - Experience emotional patterns that become repetitive, simplistic, or hollow
 * - Feel like the emotional connection has lost depth, nuance, or coherence
 *
 * Signature phrases:
 * - "Our emotional connection feels thin or hollow now."
 * - "We're stuck in shallow emotional loops."
 * - "The depth is gone — everything feels flat or fragmented."
 * - "It feels like the emotional field has collapsed into something smaller."
 *
 * This is the subharmonic-collapse chamber — the place where emotional
 * harmonics degrade into unstable, low-frequency fragments.
 *
 * Emerges when:
 * - Shadow-phase entrapment (63) prevents return to higher harmonics
 * - Shadow-phase resonance (62) destabilizes the harmonic structure
 * - Echo loops (60) amplify low-frequency patterns
 * - Inversion lock (61) prevents harmonic restoration
 * - Emotional stabilizers are too weak to maintain harmonic integrity
 * - Emotional bandwidth collapses under recursive load
 *
 * This is the architecture of harmonic degradation.
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
 * Detect Emotional Harmonic Subharmonic Collapse
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicSubharmonicCollapse(archetypeA, archetypeB) {
  // Subharmonic axes: collapse into lower-order emotional modes
  const subharmonicAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.FluidIdentity];

  // Fragmentation axes: emotional shallowness + loss of harmonic depth
  const fragmentationAxes = [TRAIT_INDEX.Warm, TRAIT_INDEX.Relational];

  // Integrity axes: ability to maintain higher-order emotional harmonics
  const integrityAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.DepthOriented, TRAIT_INDEX.Stabilizer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_sub = avg(archetypeA, subharmonicAxes);
  const B_sub = avg(archetypeB, subharmonicAxes);

  const A_frag = avg(archetypeA, fragmentationAxes);
  const B_frag = avg(archetypeB, fragmentationAxes);

  const A_int = avg(archetypeA, integrityAxes);
  const B_int = avg(archetypeB, integrityAxes);

  // High subharmonic collapse: emotional field falling into low-frequency modes
  const highSubharmonic = (A_sub + B_sub) / 2 >= 0.60;

  // High fragmentation: emotional depth and coherence breaking apart
  const highFragmentation = (A_frag + B_frag) / 2 < 0.45;

  // Low integrity: system cannot maintain higher-order harmonics
  const lowIntegrity = (A_int + B_int) / 2 < 0.50;

  // Calculate collapse severity
  const combinedSubharmonic = (A_sub + B_sub) / 2;
  const combinedIntegrity = (A_int + B_int) / 2;
  const collapseSeverity = combinedIntegrity > 0
    ? combinedSubharmonic / combinedIntegrity
    : 2.0;

  if (highSubharmonic && highFragmentation && lowIntegrity) {
    return {
      triggered: true,
      penalty: 0.64,
      destabilizer: 1.00,
      gradeCap: 'D-',
      harmonyCap: 48,
      severity: 'critical',
      flag: 'Emotional Harmonic Subharmonic Collapse (Fragmentation into Low-Frequency Emotional Modes)',
      details: {
        combinedSubharmonic,
        combinedFragmentation: (A_frag + B_frag) / 2,
        combinedIntegrity,
        collapseSeverity: collapseSeverity.toFixed(2),
        A_metrics: {
          subharmonic: A_sub,
          fragmentation: A_frag,
          integrity: A_int
        },
        B_metrics: {
          subharmonic: B_sub,
          fragmentation: B_frag,
          integrity: B_int
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicSubharmonicCollapse;
