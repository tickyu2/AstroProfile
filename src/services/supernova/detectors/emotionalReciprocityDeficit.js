/**
 * Emotional Reciprocity Deficit Detector (23rd)
 *
 * Pattern: Partners have asymmetric capacity for emotional give-and-take
 * -> one gives, the other receives -> chronic reciprocity imbalance
 *
 * This is the "I give and give but never receive" pattern.
 * - One is high in emotional giving (nurturing, supportive, attentive)
 * - One is high in emotional receiving (absorbs support without reciprocation)
 * - Giver feels depleted and unappreciated
 * - Receiver feels adequate but partner feels drained
 *
 * This is unidirectional emotional flow.
 *
 * Trait Indices:
 * - Giving: Warm(11), Relational(2), Sustainer(14), DepthOriented(13)
 * - Receiving (without giving): MindCentered(3), Initiator(0), low Warm(11), low Relational(2)
 */

const GIVING_INDICES = [11, 2, 14, 13];     // Warm, Relational, Sustainer, DepthOriented
const RECEIVING_INDICES = [3, 0];            // MindCentered, Initiator
const WARM_INDEX = 11;
const RELATIONAL_INDEX = 2;

export function detectEmotionalReciprocityDeficit(archetypeA, archetypeB) {
  if (!archetypeA || !archetypeB || archetypeA.length < 16 || archetypeB.length < 16) {
    return { triggered: false, reason: 'Insufficient archetype data' };
  }

  // Calculate giving capacity
  const calcGivingCapacity = (archetype) => {
    return GIVING_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / GIVING_INDICES.length;
  };

  // Calculate receiving tendency (absorbs without reciprocating)
  const calcReceivingTendency = (archetype) => {
    const receiving = RECEIVING_INDICES.reduce((s, i) => s + (archetype[i] || 0), 0) / RECEIVING_INDICES.length;
    const lowWarm = 1 - (archetype[WARM_INDEX] || 0);
    const lowRelational = 1 - (archetype[RELATIONAL_INDEX] || 0);
    return (receiving + lowWarm + lowRelational) / 3;
  };

  const givingA = calcGivingCapacity(archetypeA);
  const givingB = calcGivingCapacity(archetypeB);
  const receivingA = calcReceivingTendency(archetypeA);
  const receivingB = calcReceivingTendency(archetypeB);

  // Detection thresholds
  const GIVER_THRESHOLD = 0.65;
  const RECEIVER_THRESHOLD = 0.55;

  // Pattern: One high giver + one high receiver (who doesn't give back)
  const A_giver_B_receiver = givingA >= GIVER_THRESHOLD && receivingB >= RECEIVER_THRESHOLD;
  const B_giver_A_receiver = givingB >= GIVER_THRESHOLD && receivingA >= RECEIVER_THRESHOLD;

  if (A_giver_B_receiver || B_giver_A_receiver) {
    const giverProfile = A_giver_B_receiver ? 'A' : 'B';
    const receiverProfile = A_giver_B_receiver ? 'B' : 'A';

    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.10,
      gradeCap: 'C',
      harmonyCap: 0.40,
      flag: 'Emotional Reciprocity Deficit (Unidirectional Flow)',
      details: {
        givingA: Math.round(givingA * 100),
        givingB: Math.round(givingB * 100),
        receivingA: Math.round(receivingA * 100),
        receivingB: Math.round(receivingB * 100),
        giverProfile,
        receiverProfile,
        explanation: `Profile ${giverProfile} gives emotionally while Profile ${receiverProfile} absorbs without reciprocating. ${giverProfile} will feel depleted and unappreciated; emotional flow is one-directional.`
      }
    };
  }

  // Calculate reciprocity balance
  const reciprocityA = givingA - receivingA;
  const reciprocityB = givingB - receivingB;
  const reciprocityImbalance = Math.abs(reciprocityA - reciprocityB);

  // Milder forms
  if (reciprocityImbalance >= 0.45) {
    return {
      triggered: true,
      severity: 'moderate',
      penalty: 0.06,
      gradeCap: 'C+',
      harmonyCap: 0.48,
      flag: 'Emotional Give-Take Imbalance',
      details: {
        givingA: Math.round(givingA * 100),
        givingB: Math.round(givingB * 100),
        reciprocityImbalance: Math.round(reciprocityImbalance * 100),
        explanation: 'Significant imbalance in emotional give-and-take. One partner may feel they contribute more than they receive.'
      }
    };
  }

  if (reciprocityImbalance >= 0.30) {
    return {
      triggered: true,
      severity: 'mild',
      penalty: 0.04,
      gradeCap: 'B-',
      harmonyCap: 0.52,
      flag: 'Reciprocity Style Difference',
      details: {
        givingA: Math.round(givingA * 100),
        givingB: Math.round(givingB * 100),
        reciprocityImbalance: Math.round(reciprocityImbalance * 100),
        explanation: 'Some asymmetry in emotional give-and-take patterns. May require conscious rebalancing.'
      }
    };
  }

  return {
    triggered: false,
    details: {
      givingA: Math.round(givingA * 100),
      givingB: Math.round(givingB * 100),
      receivingA: Math.round(receivingA * 100),
      receivingB: Math.round(receivingB * 100),
      reciprocityImbalance: Math.round(reciprocityImbalance * 100)
    }
  };
}

export default detectEmotionalReciprocityDeficit;
