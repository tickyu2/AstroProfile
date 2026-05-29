/**
 * Qi Transform Functions — elemental interaction pipeline
 *
 * Pure calculation functions for the 9-step Qi pipeline.
 * No React dependencies — safe to use in any context.
 */

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// ============================================================================
// STEP 2: CLASH (克) — Control cycle attacks
// ============================================================================

const CLASH_PAIRS = [
  { attacker: 'Metal', victim: 'Wood',  label: 'Metal chops Wood' },
  { attacker: 'Water', victim: 'Fire',  label: 'Water quenches Fire' },
  { attacker: 'Fire',  victim: 'Metal', label: 'Fire melts Metal' },
  { attacker: 'Wood',  victim: 'Earth', label: 'Wood penetrates Earth' },
  { attacker: 'Earth', victim: 'Water', label: 'Earth dams Water' },
];

/**
 * Single-pass internal clash: internal tensions within one Qi pool.
 * @param {object} qi
 * @param {string} [source]
 */
export function applyClashes(qi, source = 'internal') {
  const result = { ...qi };
  const details = [];
  const events = [];

  CLASH_PAIRS.forEach(({ attacker, victim, label }) => {
    const aVal = result[attacker];
    const vVal = result[victim];
    if (aVal > vVal && aVal > 0) {
      const drain = aVal * 0.10;
      const cost  = aVal * 0.02;
      const newVic = Math.max(0, vVal - drain);
      const newAtk = Math.max(0, aVal - cost);

      events.push({
        source,
        attacker,
        victim,
        attackerBefore: aVal,
        victimBefore: vVal,
        attackerAfter: newAtk,
        victimAfter: newVic,
        victimDelta: newVic - vVal,
        attackerDelta: newAtk - aVal,
        label,
        narrative: `${source === 'natal' ? 'Natal' : 'Transit'} ${attacker} (${aVal.toFixed(3)}) attacked ${source === 'natal' ? 'natal' : 'transit'} ${victim} (${vVal.toFixed(3)}): ${victim} −${drain.toFixed(3)}, ${attacker} −${cost.toFixed(3)}`,
      });

      result[victim]   = newVic;
      result[attacker] = newAtk;
      details.push(`${label}: ${victim} −${drain.toFixed(3)}, ${attacker} −${cost.toFixed(3)}`);
    }
  });

  return { result, details, events };
}

/**
 * Directional clash: transit presses natal (one-directional — transit unchanged).
 * @param {object} natal
 * @param {object} transit
 */
export function applyDirectionalClashes(natal, transit) {
  const result = { ...natal };
  const details = [];
  const events = [];

  CLASH_PAIRS.forEach(({ attacker, victim, label }) => {
    const transitAtk = transit[attacker] || 0;
    const natalVic = result[victim] || 0;
    if (transitAtk > natalVic && transitAtk > 0) {
      const drain = transitAtk * 0.10;
      const newVic = Math.max(0, natalVic - drain);

      events.push({
        source: 'transit→natal',
        attacker,
        victim,
        attackerBefore: transitAtk,
        victimBefore: natalVic,
        attackerAfter: transitAtk,
        victimAfter: newVic,
        victimDelta: newVic - natalVic,
        attackerDelta: 0,
        label,
        narrative: `Transit ${attacker} (${transitAtk.toFixed(3)}) pressed natal ${victim} (${natalVic.toFixed(3)}): ${victim} −${drain.toFixed(3)} (transit unchanged)`,
      });

      result[victim] = newVic;
      details.push(`${label}: transit ${attacker} (${transitAtk.toFixed(3)}) → natal ${victim} −${drain.toFixed(3)}`);
    }
  });

  return { result, details, events };
}

/**
 * Three-pass clash system:
 *   Pass A — natal internal tensions
 *   Pass B — transit internal clashes
 *   Pass C — transit → natal directional pressure
 */
export function computeThreePassClashes(atfq, acymfq) {
  const passA = applyClashes(atfq, 'natal');
  const passB = applyClashes(acymfq, 'transit');
  const passC = applyDirectionalClashes(passA.result, passB.result);

  const combined = {};
  ELEMENTS.forEach(el => {
    combined[el] = (passC.result[el] || 0) + (passB.result[el] || 0);
  });

  const allEvents = [...passA.events, ...passB.events, ...passC.events];

  return { passA, passB, passC, combined, allEvents };
}

// ============================================================================
// STEP 3: SHENG (生) — Generative cycle nourishment
// ============================================================================

const SHENG_PAIRS = [
  { parent: 'Wood',  child: 'Fire',  label: 'Wood feeds Fire' },
  { parent: 'Fire',  child: 'Earth', label: 'Fire creates Earth' },
  { parent: 'Earth', child: 'Metal', label: 'Earth bears Metal' },
  { parent: 'Metal', child: 'Water', label: 'Metal enriches Water' },
  { parent: 'Water', child: 'Wood',  label: 'Water nourishes Wood' },
];

const SHENG_RATE = 0.03;
const SHENG_MAX_BOOST_RATIO = 0.20;

/**
 * Apply Sheng (生) generative cycle: parent gently feeds child.
 */
export function applySheng(qi) {
  const result = { ...qi };
  const details = [];

  SHENG_PAIRS.forEach(({ parent, child, label }) => {
    const parentVal = qi[parent];
    const childVal = qi[child];

    if (parentVal > childVal && parentVal > 0) {
      const rawBoost = parentVal * SHENG_RATE;
      const maxBoost = childVal * SHENG_MAX_BOOST_RATIO;
      const boost = Math.min(rawBoost, maxBoost > 0 ? maxBoost : rawBoost);
      result[child] = childVal + boost;
      details.push(`${label}: ${child} +${boost.toFixed(3)} (${parent} ${parentVal.toFixed(3)} × ${(SHENG_RATE * 100).toFixed(0)}%)`);
    }
  });

  return { result, details };
}

// ============================================================================
// STEP 4: OVERCROWDING — Soft bleed-off when one element dominates
// ============================================================================

const OVERCROWDING_SHARE_THRESHOLD = 0.35;
const OVERCROWDING_RATIO_THRESHOLD = 2.0;
const OVERCROWDING_BLEED_RATE = 0.10;
const OVERCROWDING_MAX_BLEED = 0.50;
const SHENG_CHILD = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };

/**
 * Apply overcrowding bleed: dominant element spills into its Sheng child.
 */
export function applyOvercrowding(qi) {
  const result = { ...qi };
  const details = [];
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  const avg = total / 5;

  ELEMENTS.forEach(el => {
    const val = qi[el] || 0;
    if (total <= 0 || val <= 0) return;

    const share = val / total;
    const ratio = avg > 0 ? val / avg : 0;

    if (share > OVERCROWDING_SHARE_THRESHOLD || ratio > OVERCROWDING_RATIO_THRESHOLD) {
      const excess = val - (avg * OVERCROWDING_RATIO_THRESHOLD);
      if (excess <= 0) return;

      const rawBleed = excess * OVERCROWDING_BLEED_RATE;
      const bleed = Math.min(rawBleed, OVERCROWDING_MAX_BLEED);
      const child = SHENG_CHILD[el];

      result[el] = val - bleed;
      result[child] = (result[child] || 0) + bleed;

      details.push({
        element: el,
        child,
        share: (share * 100).toFixed(1),
        ratio: ratio.toFixed(2),
        bleed: bleed.toFixed(3),
        label: `${el} overcrowded (${(share * 100).toFixed(1)}% of total, ${ratio.toFixed(1)}× avg) → ${bleed.toFixed(3)} pts softly redirected to ${child}`,
      });
    }
  });

  return { result, details };
}

// ============================================================================
// STEP 5: CONTROL — Universal 2% damping
// ============================================================================

/**
 * Apply universal 2% control damping across all elements.
 */
export function applyControl(qi) {
  const result = {};
  const details = [];
  ELEMENTS.forEach(el => {
    result[el] = qi[el] * 0.98;
    if (qi[el] > 0) {
      details.push(`${el}: ${qi[el].toFixed(3)} × 0.98 = ${result[el].toFixed(3)}`);
    }
  });
  return { result, details };
}

// ============================================================================
// STEP 6: TRANSFORMATION — Overwhelm converts victim to new element
// ============================================================================

const TRANSFORM_RULES = [
  { attacker: 'Fire',  victim: 'Metal', product: 'Water', label: 'Fire melts Metal → Water' },
  { attacker: 'Metal', victim: 'Wood',  product: 'Fire',  label: 'Metal chops Wood → Fire' },
  { attacker: 'Water', victim: 'Fire',  product: 'Earth', label: 'Water drowns Fire → Earth' },
  { attacker: 'Wood',  victim: 'Earth', product: 'Metal', label: 'Wood uproots Earth → Metal' },
  { attacker: 'Earth', victim: 'Water', product: 'Wood',  label: 'Earth absorbs Water → Wood' },
];

/**
 * Apply transformations: when attacker overwhelms victim (ratio > 3, absolute > 1.5),
 * 30% of victim converts to the product element.
 */
export function applyTransformations(qi) {
  const result = { ...qi };
  const details = [];

  TRANSFORM_RULES.forEach(({ attacker, victim, product, label }) => {
    const aVal = result[attacker];
    const vVal = result[victim];
    if (aVal > 1.5 && vVal > 0 && aVal / vVal > 3) {
      const melt = vVal * 0.30;
      result[victim]  = Math.max(0, vVal - melt);
      result[product] = (result[product] || 0) + melt;
      details.push(`${label}: ${victim} −${melt.toFixed(3)} → ${product} +${melt.toFixed(3)}`);
    }
  });

  return { result, details };
}
