/**
 * ================================================================================
 * DETECTOR #53 — EMOTIONAL PHASE MISALIGNMENT
 * ================================================================================
 *
 * Second Harmonic Ring — Third Chamber
 *
 * Pattern: Emotional waves are out of phase → resonance cancellation
 *          → emotional mis-timing and disconnection
 *
 * This detector identifies when two people:
 * - Feel emotions at the same frequency but not at the same moment
 * - Express emotional peaks and troughs at opposite times
 * - Attempt to connect emotionally but "miss each other's timing"
 * - Experience emotional closeness that is always slightly offset
 * - Feel like one partner is opening while the other is closing
 * - Experience emotional rhythms that never quite lock into coherence
 *
 * Signature phrases:
 * - "When I'm ready to connect, you're withdrawing."
 * - "When you're vulnerable, I'm overwhelmed."
 * - "We're never emotionally open at the same time."
 * - "We're always just slightly out of sync."
 *
 * This is the phase-alignment chamber — the place where emotional timing
 * determines whether resonance stabilizes or collapses.
 *
 * Emerges when:
 * - One partner's emotional peaks coincide with the other's troughs
 * - Emotional openness and emotional protectiveness alternate out of sync
 * - Emotional cycles are offset by a consistent phase angle
 * - Emotional repair attempts land at the wrong moment
 * - Emotional rhythms never fully synchronize
 *
 * This is the architecture of emotional phase dissonance.
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
 * Detect Emotional Phase Misalignment
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalPhaseMisalignment(archetypeA, archetypeB) {
  // Phase axes: timing of emotional openness + timing of emotional expression
  const phaseAxes = [TRAIT_INDEX.Expressive, TRAIT_INDEX.Relational];

  // Rhythm axes: emotional cycle regularity + emotional pacing
  const rhythmAxes = [TRAIT_INDEX.Stabilizer, TRAIT_INDEX.FluidIdentity];

  // Synchronization axes: ability to align emotional timing
  const syncAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Warm];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_phase = avg(archetypeA, phaseAxes);
  const B_phase = avg(archetypeB, phaseAxes);

  const A_rhy = avg(archetypeA, rhythmAxes);
  const B_rhy = avg(archetypeB, rhythmAxes);

  const A_sync = avg(archetypeA, syncAxes);
  const B_sync = avg(archetypeB, syncAxes);

  // Phase misalignment: emotional timing offset
  const phaseOffset = Math.abs(A_phase - B_phase) >= 0.22;

  // Rhythm mismatch: cycles differ enough to prevent phase locking
  const rhythmMismatch = Math.abs(A_rhy - B_rhy) >= 0.20;

  // Low synchronization: insufficient ability to align timing
  const lowSync = (A_sync + B_sync) / 2 < 0.52;

  // Calculate phase angle estimate (0-180 degrees conceptually)
  const phaseAngle = Math.abs(A_phase - B_phase) * 180;

  if (phaseOffset && (rhythmMismatch || lowSync)) {
    return {
      triggered: true,
      penalty: 0.42,
      destabilizer: 0.80,
      gradeCap: 'B',
      harmonyCap: 73,
      severity: 'moderate',
      flag: 'Emotional Phase Misalignment (Out-of-Sync Emotional Timing and Resonance Cancellation)',
      details: {
        phaseOffset: Math.abs(A_phase - B_phase),
        rhythmDelta: Math.abs(A_rhy - B_rhy),
        combinedSync: (A_sync + B_sync) / 2,
        estimatedPhaseAngle: phaseAngle.toFixed(1) + '°',
        A_metrics: { phase: A_phase, rhythm: A_rhy, sync: A_sync },
        B_metrics: { phase: B_phase, rhythm: B_rhy, sync: B_sync }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalPhaseMisalignment;
