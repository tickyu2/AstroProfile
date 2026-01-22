/**
 * ================================================================================
 * DETECTOR #59 — EMOTIONAL HARMONIC SHADOW COUPLING
 * ================================================================================
 *
 * Second Harmonic Ring — Ninth Chamber
 *
 * Pattern: Unconscious emotional harmonics drive resonance
 *          → shadow-to-shadow coupling → hidden destabilization
 *
 * This detector identifies when two people:
 * - Connect primarily through unconscious emotional harmonics
 * - Activate each other's shadow material through resonance
 * - Experience emotional attraction rooted in unintegrated wounds
 * - Feel drawn together by what they don't see in themselves
 * - Create emotional resonance through mutual shadow projection
 * - Experience connection that is driven by hidden dynamics
 *
 * Signature phrases:
 * - "Something draws us together that I can't explain."
 * - "We trigger each other in ways we don't understand."
 * - "Our connection feels fated but also destructive."
 * - "We're connected through our wounds."
 *
 * This is the shadow-coupling chamber — the place where unconscious
 * emotional harmonics create hidden bonds and hidden conflicts.
 *
 * Emerges when:
 * - Both partners have significant unintegrated shadow material
 * - Emotional resonance occurs below conscious awareness
 * - Shadow projections create false sense of connection
 * - Unconscious patterns drive relationship dynamics
 * - Awareness of coupling dynamics is low
 *
 * This is the architecture of unconscious emotional entanglement.
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
 * Detect Emotional Harmonic Shadow Coupling
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalHarmonicShadowCoupling(archetypeA, archetypeB) {
  // Shadow axes: presence of unintegrated shadow material
  // LOW ShadowAware = more unconscious shadow driving dynamics
  const shadowAwarenessAxes = [TRAIT_INDEX.ShadowAware, TRAIT_INDEX.Transcendent];

  // Coupling axes: susceptibility to unconscious bonding
  const couplingAxes = [TRAIT_INDEX.Relational, TRAIT_INDEX.DepthOriented];

  // Consciousness axes: awareness of hidden dynamics
  const consciousnessAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.SystemsOriented];

  // Boundary axes: ability to prevent unconscious entanglement
  const boundaryAxes = [TRAIT_INDEX.BoundaryAware, TRAIT_INDEX.Stabilizer];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_shad = avg(archetypeA, shadowAwarenessAxes);
  const B_shad = avg(archetypeB, shadowAwarenessAxes);

  const A_coup = avg(archetypeA, couplingAxes);
  const B_coup = avg(archetypeB, couplingAxes);

  const A_cons = avg(archetypeA, consciousnessAxes);
  const B_cons = avg(archetypeB, consciousnessAxes);

  const A_bound = avg(archetypeA, boundaryAxes);
  const B_bound = avg(archetypeB, boundaryAxes);

  // Low shadow awareness: unconscious shadow drives dynamics
  const lowShadowAwareness = (A_shad + B_shad) / 2 < 0.50;

  // High coupling: strong tendency to bond through depth
  const highCoupling = (A_coup + B_coup) / 2 >= 0.60;

  // Low consciousness: limited awareness of hidden dynamics
  const lowConsciousness = (A_cons + B_cons) / 2 < 0.52;

  // Low boundaries: cannot prevent unconscious entanglement
  const lowBoundaries = (A_bound + B_bound) / 2 < 0.50;

  // Calculate shadow coupling intensity
  const combinedCoupling = (A_coup + B_coup) / 2;
  const combinedAwareness = (A_shad + B_shad) / 2;
  const shadowCouplingIntensity = combinedAwareness > 0
    ? combinedCoupling / combinedAwareness
    : 2.0;

  if (lowShadowAwareness && highCoupling && (lowConsciousness || lowBoundaries)) {
    const baseSeverity = (lowConsciousness && lowBoundaries) ? 'critical' : 'severe';

    return {
      triggered: true,
      penalty: 0.54,
      destabilizer: 0.94,
      gradeCap: baseSeverity === 'critical' ? 'D+' : 'C-',
      harmonyCap: baseSeverity === 'critical' ? 52 : 57,
      severity: baseSeverity,
      flag: 'Emotional Harmonic Shadow Coupling (Unconscious Emotional Harmonics Driving Resonance)',
      details: {
        combinedShadowAwareness: (A_shad + B_shad) / 2,
        combinedCoupling,
        combinedConsciousness: (A_cons + B_cons) / 2,
        combinedBoundaries: (A_bound + B_bound) / 2,
        shadowCouplingIntensity: shadowCouplingIntensity.toFixed(2),
        A_metrics: {
          shadowAwareness: A_shad,
          coupling: A_coup,
          consciousness: A_cons,
          boundaries: A_bound
        },
        B_metrics: {
          shadowAwareness: B_shad,
          coupling: B_coup,
          consciousness: B_cons,
          boundaries: B_bound
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalHarmonicShadowCoupling;
