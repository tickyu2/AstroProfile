/**
 * ================================================================================
 * DETECTOR #56 — EMOTIONAL PHASE-SHIFT DRIFT
 * ================================================================================
 *
 * Second Harmonic Ring — Sixth Chamber
 *
 * Pattern: Emotional phase alignment deteriorates over time
 *          → progressive desynchronization → eventual emotional disconnect
 *
 * This detector identifies when two people:
 * - Start emotionally aligned but gradually drift out of phase
 * - Experience emotional timing that worsens over repeated cycles
 * - Feel like "we used to be in sync but now we're not"
 * - Notice increasing difficulty re-synchronizing after misalignment
 * - Experience emotional rhythms that gradually diverge
 * - Feel the relationship's emotional coherence eroding over time
 *
 * Signature phrases:
 * - "We used to understand each other's timing perfectly."
 * - "Somehow we've gotten out of sync over the years."
 * - "Every time we drift apart, it's harder to come back together."
 * - "Our emotional rhythms are slowly diverging."
 *
 * This is the drift chamber — the place where time erodes
 * emotional synchronization.
 *
 * Emerges when:
 * - Initial phase alignment was high but maintenance is low
 * - Emotional recalibration capacity is insufficient
 * - Sustaining traits are low (cannot maintain alignment)
 * - Resilience to phase drift is compromised
 * - External stressors accelerate the drift
 *
 * This is the architecture of progressive emotional desynchronization.
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
 * Detect Emotional Phase-Shift Drift
 *
 * @param {Array<number>} archetypeA - 16-dimensional archetype vector for profile A
 * @param {Array<number>} archetypeB - 16-dimensional archetype vector for profile B
 * @returns {Object} Detection result
 */
export function detectEmotionalPhaseShiftDrift(archetypeA, archetypeB) {
  // Drift susceptibility axes: vulnerability to phase erosion
  const driftAxes = [TRAIT_INDEX.FluidIdentity, TRAIT_INDEX.Adventurous];

  // Maintenance axes: ability to maintain synchronization over time
  const maintenanceAxes = [TRAIT_INDEX.Sustainer, TRAIT_INDEX.Stabilizer];

  // Recalibration axes: ability to re-synchronize after drift
  const recalibrationAxes = [TRAIT_INDEX.MindCentered, TRAIT_INDEX.Relational];

  // Resilience axes: resistance to progressive desynchronization
  const resilienceAxes = [TRAIT_INDEX.Resilient, TRAIT_INDEX.DepthOriented];

  function avg(archetype, indices) {
    return indices.reduce((sum, idx) => sum + (archetype[idx] || 0), 0) / indices.length;
  }

  const A_drift = avg(archetypeA, driftAxes);
  const B_drift = avg(archetypeB, driftAxes);

  const A_maint = avg(archetypeA, maintenanceAxes);
  const B_maint = avg(archetypeB, maintenanceAxes);

  const A_recal = avg(archetypeA, recalibrationAxes);
  const B_recal = avg(archetypeB, recalibrationAxes);

  const A_res = avg(archetypeA, resilienceAxes);
  const B_res = avg(archetypeB, resilienceAxes);

  // High drift susceptibility: phases tend to diverge
  const highDrift = (A_drift + B_drift) / 2 >= 0.58;

  // Low maintenance: cannot sustain alignment over time
  const lowMaintenance = (A_maint + B_maint) / 2 < 0.52;

  // Low recalibration: difficult to re-sync after drift
  const lowRecalibration = (A_recal + B_recal) / 2 < 0.50;

  // Low resilience: progressive drift accelerates
  const lowResilience = (A_res + B_res) / 2 < 0.48;

  // Calculate drift rate
  const combinedDrift = (A_drift + B_drift) / 2;
  const combinedMaintenance = (A_maint + B_maint) / 2;
  const driftRate = combinedMaintenance > 0 ? combinedDrift / combinedMaintenance : 2.0;

  if (highDrift && (lowMaintenance || lowRecalibration)) {
    const baseSeverity = lowResilience ? 'severe' : 'moderate';

    return {
      triggered: true,
      penalty: 0.48,
      destabilizer: 0.88,
      gradeCap: lowResilience ? 'C+' : 'B-',
      harmonyCap: lowResilience ? 63 : 67,
      severity: baseSeverity,
      flag: 'Emotional Phase-Shift Drift (Progressive Emotional Desynchronization Over Time)',
      details: {
        combinedDrift,
        combinedMaintenance,
        combinedRecalibration: (A_recal + B_recal) / 2,
        combinedResilience: (A_res + B_res) / 2,
        driftRate: driftRate.toFixed(2),
        A_metrics: {
          drift: A_drift,
          maintenance: A_maint,
          recalibration: A_recal,
          resilience: A_res
        },
        B_metrics: {
          drift: B_drift,
          maintenance: B_maint,
          recalibration: B_recal,
          resilience: B_res
        }
      }
    };
  }

  return { triggered: false };
}

export default detectEmotionalPhaseShiftDrift;
