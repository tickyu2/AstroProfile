/**
 * Repair Strategy Mismatch Detector (20th)
 *
 * Pattern: Partners have incompatible approaches to relationship repair
 * -> repairs fail -> accumulated damage -> structural deterioration
 *
 * This is the "I thought we fixed this / We never fixed anything" pattern.
 * - Verbal apologizer vs Acts-of-service repairer
 * - Immediate processor vs Time-to-cool repairer
 * - Talk-it-out vs Give-space repairer
 * - Explicit resolver vs Implicit resolver
 *
 * When repair strategies mismatch, even good-faith efforts fail to heal.
 *
 * Trait Indices:
 * - Verbal repair: Expressive(6), Direct(12), Relational(2)
 * - Action repair: Sustainer(14), Concrete(5), low Expressive(6)
 * - Immediate repair: Initiator(0), Direct(12), RiskSeeking(8)
 * - Space repair: Stabilizer(1), BoundaryAware(15), DepthOriented(13)
 */

const VERBAL_REPAIR_INDICES = [6, 12, 2];        // Expressive, Direct, Relational
const ACTION_REPAIR_INDICES = [14, 5];            // Sustainer, Concrete
const IMMEDIATE_REPAIR_INDICES = [0, 12, 8];      // Initiator, Direct, RiskSeeking
const SPACE_REPAIR_INDICES = [1, 15, 13];         // Stabilizer, BoundaryAware, DepthOriented

export function detectRepairStrategyMismatch(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Helper to calculate average
  const avg = (archetype, indices) => {
    return indices.reduce((s, i) => s + (archetype[i] || 0), 0) / indices.length;
  };

  // Calculate repair modality preference
  const calcVerbalPreference = (archetype) => {
    const verbal = avg(archetype, VERBAL_REPAIR_INDICES);
    const action = avg(archetype, ACTION_REPAIR_INDICES);
    const lowExpressive = 1 - (archetype[6] || 0);
    const actionBonus = (action + lowExpressive) / 2;
    return verbal - actionBonus * 0.4;
  };

  const calcImmediatePreference = (archetype) => {
    const immediate = avg(archetype, IMMEDIATE_REPAIR_INDICES);
    const space = avg(archetype, SPACE_REPAIR_INDICES);
    return immediate - space * 0.5;
  };

  const verbalA = calcVerbalPreference(archetypeA);
  const verbalB = calcVerbalPreference(archetypeB);
  const immediateA = calcImmediatePreference(archetypeA);
  const immediateB = calcImmediatePreference(archetypeB);

  const verbalDiff = Math.abs(verbalA - verbalB);
  const timingDiff = Math.abs(immediateA - immediateB);

  // Detection: Verbal vs Action mismatch
  const VERBAL_THRESHOLD = 0.55;
  const ACTION_THRESHOLD = 0.20;
  const verbalActionClash =
    (verbalA >= VERBAL_THRESHOLD && verbalB <= ACTION_THRESHOLD) ||
    (verbalB >= VERBAL_THRESHOLD && verbalA <= ACTION_THRESHOLD);

  // Detection: Immediate vs Space mismatch
  const IMMEDIATE_THRESHOLD = 0.45;
  const SPACE_THRESHOLD = -0.15;
  const timingClash =
    (immediateA >= IMMEDIATE_THRESHOLD && immediateB <= SPACE_THRESHOLD) ||
    (immediateB >= IMMEDIATE_THRESHOLD && immediateA <= SPACE_THRESHOLD);

  const mismatches = [];
  if (verbalActionClash) mismatches.push('verbal-vs-action');
  if (timingClash) mismatches.push('immediate-vs-space');

  if (mismatches.length >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.35,
      flag: 'Repair Strategy Mismatch (Structural Repair Failure)',
      details: {
        verbalA: Math.round(verbalA * 100),
        verbalB: Math.round(verbalB * 100),
        immediateA: Math.round(immediateA * 100),
        immediateB: Math.round(immediateB * 100),
        mismatches,
        explanation: `Partners have fundamentally incompatible repair strategies across ${mismatches.length} dimensions. Good-faith repair attempts will consistently fail to register with the other partner.`
      }
    };
  }

  if (verbalActionClash || timingClash) {
    const verbalProfile = verbalA > verbalB ? 'A' : 'B';
    const actionProfile = verbalA > verbalB ? 'B' : 'A';
    const immediateProfile = immediateA > immediateB ? 'A' : 'B';
    const spaceProfile = immediateA > immediateB ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.06,
      gradeCap: 'C+',
      harmonyCap: 0.45,
      flag: 'Repair Approach Mismatch',
      details: {
        verbalA: Math.round(verbalA * 100),
        verbalB: Math.round(verbalB * 100),
        immediateA: Math.round(immediateA * 100),
        immediateB: Math.round(immediateB * 100),
        mismatches,
        explanation: verbalActionClash
          ? `Profile ${verbalProfile} repairs through words while Profile ${actionProfile} repairs through actions. Each feels the other isn't "really" apologizing.`
          : `Profile ${immediateProfile} needs to repair immediately while Profile ${spaceProfile} needs space first. Timing collision in repair attempts.`
      }
    };
  }

  // Milder form: Significant preference difference
  if (verbalDiff >= 0.30 || timingDiff >= 0.30) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.03,
      gradeCap: 'B',
      harmonyCap: 0.55,
      flag: 'Repair Style Difference',
      details: {
        verbalDiff: Math.round(verbalDiff * 100),
        timingDiff: Math.round(timingDiff * 100),
        explanation: 'Partners have different preferred repair approaches. May require explicit negotiation after conflicts.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      verbalA: Math.round(verbalA * 100),
      verbalB: Math.round(verbalB * 100),
      immediateA: Math.round(immediateA * 100),
      immediateB: Math.round(immediateB * 100)
    }
  };
}

export default detectRepairStrategyMismatch;
