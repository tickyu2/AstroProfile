/**
 * Conflict Modality Incompatibility Detector (19th)
 *
 * Pattern: Partners handle conflict in fundamentally incompatible ways
 * -> one partner's conflict style triggers the other's defenses -> escalation or shutdown
 *
 * This is the "we can't fight in a way that works for both of us" pattern.
 * - Direct confronter vs Avoidant withdrawer
 * - Explosive processor vs Silent processor
 * - Immediate resolver vs Space-needer
 * - Verbal processor vs Internal processor
 *
 * When conflict modalities clash, disagreements become structural crises.
 *
 * Trait Indices:
 * - Confrontational: Direct(12), Expressive(6), Initiator(0)
 * - Avoidant: low Direct(12), low Expressive(6), high Stabilizer(1)
 * - Explosive: RiskSeeking(8), FluidIdentity(10), Initiator(0)
 * - Contained: OrderOriented(9), BoundaryAware(15), Sustainer(14)
 */

const CONFRONTATIONAL_INDICES = [12, 6, 0];     // Direct, Expressive, Initiator
const AVOIDANT_INDICES = [1];                    // Stabilizer (high), plus low Direct/Expressive
const EXPLOSIVE_INDICES = [8, 10, 0];            // RiskSeeking, FluidIdentity, Initiator
const CONTAINED_INDICES = [9, 15, 14];           // OrderOriented, BoundaryAware, Sustainer

export function detectConflictModalityIncompatibility(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Helper to calculate average
  const avg = (archetype, indices) => {
    return indices.reduce((s, i) => s + (archetype[i] || 0), 0) / indices.length;
  };

  // Calculate confrontation index (high = seeks direct confrontation)
  const calcConfrontationIndex = (archetype) => {
    const confrontational = avg(archetype, CONFRONTATIONAL_INDICES);
    const avoidant = avg(archetype, AVOIDANT_INDICES);
    const lowDirect = 1 - (archetype[12] || 0);
    const lowExpressive = 1 - (archetype[6] || 0);
    const avoidantTotal = (avoidant + lowDirect + lowExpressive) / 3;
    return confrontational - avoidantTotal * 0.5;
  };

  // Calculate explosiveness index
  const calcExplosivenessIndex = (archetype) => {
    const explosive = avg(archetype, EXPLOSIVE_INDICES);
    const contained = avg(archetype, CONTAINED_INDICES);
    return explosive - contained * 0.5;
  };

  const confrontA = calcConfrontationIndex(archetypeA);
  const confrontB = calcConfrontationIndex(archetypeB);
  const explosiveA = calcExplosivenessIndex(archetypeA);
  const explosiveB = calcExplosivenessIndex(archetypeB);

  const confrontDiff = Math.abs(confrontA - confrontB);
  const explosiveDiff = Math.abs(explosiveA - explosiveB);

  // Detection: One confrontational, one avoidant
  const CONFRONT_THRESHOLD = 0.55;
  const confronterA = confrontA >= CONFRONT_THRESHOLD;
  const confronterB = confrontB >= CONFRONT_THRESHOLD;
  const avoiderA = confrontA <= -0.20;
  const avoiderB = confrontB <= -0.20;

  const confrontAvoidClash = (confronterA && avoiderB) || (confronterB && avoiderA);

  // Detection: One explosive, one contained
  const EXPLOSIVE_THRESHOLD = 0.45;
  const explosiveClash =
    (explosiveA >= EXPLOSIVE_THRESHOLD && explosiveB <= -0.10) ||
    (explosiveB >= EXPLOSIVE_THRESHOLD && explosiveA <= -0.10);

  const incompatibilities = [];
  if (confrontAvoidClash) incompatibilities.push('confronter-vs-avoider');
  if (explosiveClash) incompatibilities.push('explosive-vs-contained');

  if (incompatibilities.length >= 2) {
    return {
      triggered: true,
      severity: 'severe',
      penalty: 0.12,
      gradeCap: 'C-',
      harmonyCap: 0.32,
      flag: 'Conflict Modality Incompatibility (Structural Conflict Crisis)',
      details: {
        confrontA: Math.round(confrontA * 100),
        confrontB: Math.round(confrontB * 100),
        explosiveA: Math.round(explosiveA * 100),
        explosiveB: Math.round(explosiveB * 100),
        incompatibilities,
        explanation: `Partners have fundamentally incompatible conflict styles across multiple dimensions: ${incompatibilities.join(', ')}. Every disagreement risks becoming a structural crisis.`
      }
    };
  }

  if (confrontAvoidClash || explosiveClash) {
    const confronter = confronterA ? 'A' : 'B';
    const avoider = confronterA ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.08,
      gradeCap: 'C',
      harmonyCap: 0.42,
      flag: 'Conflict Style Mismatch',
      details: {
        confrontA: Math.round(confrontA * 100),
        confrontB: Math.round(confrontB * 100),
        explosiveA: Math.round(explosiveA * 100),
        explosiveB: Math.round(explosiveB * 100),
        incompatibilities,
        explanation: confrontAvoidClash
          ? `Profile ${confronter} confronts directly while Profile ${avoider} withdraws. Each partner's response triggers the other's escalation.`
          : 'One partner processes conflict explosively while the other needs containment. Timing mismatch in emotional release.'
      }
    };
  }

  // Milder form: Significant style difference
  if (confrontDiff >= 0.35 || explosiveDiff >= 0.35) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B-',
      harmonyCap: 0.52,
      flag: 'Conflict Approach Difference',
      details: {
        confrontDiff: Math.round(confrontDiff * 100),
        explosiveDiff: Math.round(explosiveDiff * 100),
        explanation: 'Partners have different approaches to conflict. May require negotiation around how to handle disagreements.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      confrontA: Math.round(confrontA * 100),
      confrontB: Math.round(confrontB * 100),
      explosiveA: Math.round(explosiveA * 100),
      explosiveB: Math.round(explosiveB * 100)
    }
  };
}

export default detectConflictModalityIncompatibility;
