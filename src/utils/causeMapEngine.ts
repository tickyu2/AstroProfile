/**
 * ============================================================================
 * CAUSE MAP ENGINE — "Why does my radar look like this?"
 * ============================================================================
 *
 * Computes a structured, numeric breakdown of which pipeline module caused
 * each element to rise or fall. Works for every user, every month.
 *
 * Input: The intermediate QiDist snapshots already stored in QiMonthSnapshot.
 * Output: An array of CauseMapEntry objects, one per pipeline stage,
 *         each containing per-element deltas and human-readable notes.
 *
 * Created: March 2026
 * ============================================================================
 */

import type { QiDist } from './qiEngine';
import type { ElementName } from '../data/stoneDatabase';

// ============================================================================
// TYPES
// ============================================================================

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export interface CauseDelta {
  element: ElementName;
  delta: number;       // positive = gained, negative = lost
  before: number;      // value before this stage
  after: number;       // value after this stage
}

export interface CauseMapEntry {
  module: string;           // pipeline stage name
  step: number;             // pipeline step number (3-9)
  deltas: CauseDelta[];
  totalBefore: number;
  totalAfter: number;
  notes: string[];
  /** The single biggest mover in this stage */
  biggestMover?: { element: ElementName; delta: number };
}

export interface CauseMapResult {
  entries: CauseMapEntry[];
  /** Summary: which module caused the largest absolute shift */
  dominantCause: { module: string; element: ElementName; delta: number };
  /** Per-element attribution: for each element, which module moved it most */
  perElement: Record<ElementName, { module: string; delta: number }>;
}

// ============================================================================
// HELPERS
// ============================================================================

function sumQi(qi: QiDist): number {
  return qi.Wood + qi.Fire + qi.Earth + qi.Metal + qi.Water;
}

function computeDeltas(before: QiDist, after: QiDist): CauseDelta[] {
  return ELEMENTS.map(el => ({
    element: el,
    delta: after[el] - before[el],
    before: before[el],
    after: after[el],
  }));
}

function addQi(a: QiDist, b: QiDist): QiDist {
  return {
    Wood:  a.Wood + b.Wood,
    Fire:  a.Fire + b.Fire,
    Earth: a.Earth + b.Earth,
    Metal: a.Metal + b.Metal,
    Water: a.Water + b.Water,
  };
}

function findBiggestMover(deltas: CauseDelta[]): { element: ElementName; delta: number } | undefined {
  let best: CauseDelta | undefined;
  for (const d of deltas) {
    if (!best || Math.abs(d.delta) > Math.abs(best.delta)) best = d;
  }
  return best && Math.abs(best.delta) > 0.001
    ? { element: best.element, delta: best.delta }
    : undefined;
}

// ============================================================================
// MAIN
// ============================================================================

/**
 * Build a Cause Map from the intermediate snapshots already present
 * in a QiMonthSnapshot. No extra computation needed.
 *
 * @param snap - Any object containing the 9-step QiDist snapshots.
 *               Matches QiMonthSnapshot shape.
 */
export function buildCauseMap(snap: {
  polarityQi: QiDist;
  seasonalQi: QiDist;
  yearQi: QiDist;
  daYunQi?: QiDist;   // Step 3.5 — present only when a Da Yun pillar is active
  monthQi: QiDist;
  combinedQi: QiDist;
  postClashQi: QiDist;
  postControlQi: QiDist;
  functionalQi: QiDist;
  yongShen?: { collapseMode?: string; reasoning?: string; status?: string };
  interactions?: { type: string; branch1: string; branch2: string; nature: string }[];
  monthName?: string;
  season?: string;
}): CauseMapResult {
  const entries: CauseMapEntry[] = [];

  // ── Stage 1: MTFQ (Step 5) ──────────────────────────────────────────
  // Final result: 1.0×NTFQ + 0.9×DaYun + 0.5×Year + 0.3×Month
  entries.push(buildEntry({
    module: 'MTFQ',
    step: 5,
    before: snap.seasonalQi,      // natalTfq (legacy alias)
    after: snap.combinedQi,       // mtfqQi (legacy alias)
    notes: [
      'MTFQ = 1.0×NTFQ + 0.9×DaYun + 0.5×Year + 0.3×Month.',
      'NTFQ = natal Qi after survival pipeline. DaYun/Year/Month = external climate.',
      snap.season ? `Season: ${snap.season}` : '',
    ].filter(Boolean),
  }));

  // ── Stage 2: Clash/Harm/Punishment (Step 6) ────────────────────────
  const clashNotes = ['Branch-level conflict effects.'];
  if (snap.interactions && snap.interactions.length > 0) {
    for (const ix of snap.interactions) {
      clashNotes.push(`${ix.branch1}${ix.branch2} ${ix.type}: ${ix.nature}`);
    }
  } else {
    clashNotes.push('No clashes, harms, or punishments this month.');
  }
  entries.push(buildEntry({
    module: 'Clashes & Harms',
    step: 6,
    before: snap.combinedQi,
    after: snap.postClashQi,
    notes: clashNotes,
  }));

  // ── Stage 3: Control Cycle Pressure (Step 7) ──────────────────────
  entries.push(buildEntry({
    module: 'Control Cycle',
    step: 7,
    before: snap.postClashQi,
    after: snap.postControlQi,
    notes: [
      'If controller > controlled x 1.5, controlled loses 15%.',
      'Classical Wu Xing Ke cycle: Wood->Earth->Water->Fire->Metal->Wood.',
    ],
  }));

  // ── Stage 6: Structural Collapse (Step 9) ─────────────────────────
  // postControlQi -> functionalQi (may be identical if no collapse transform)
  const collapseNotes: string[] = [];
  if (snap.yongShen?.collapseMode && snap.yongShen.collapseMode !== 'none') {
    collapseNotes.push(`Collapse mode: ${snap.yongShen.collapseMode}`);
    if (snap.yongShen.reasoning) collapseNotes.push(snap.yongShen.reasoning);
  } else {
    collapseNotes.push('No structural collapse detected — chart is balanced or near-balanced.');
  }
  entries.push(buildEntry({
    module: 'Structural Collapse',
    step: 8,
    before: snap.postControlQi,
    after: snap.functionalQi,
    notes: collapseNotes,
  }));

  // ── Compute summary ────────────────────────────────────────────────
  let dominantCause = { module: entries[0].module, element: 'Wood' as ElementName, delta: 0 };
  const perElement: Record<ElementName, { module: string; delta: number }> = {
    Wood:  { module: '', delta: 0 },
    Fire:  { module: '', delta: 0 },
    Earth: { module: '', delta: 0 },
    Metal: { module: '', delta: 0 },
    Water: { module: '', delta: 0 },
  };

  for (const entry of entries) {
    for (const d of entry.deltas) {
      // Track dominant cause overall
      if (Math.abs(d.delta) > Math.abs(dominantCause.delta)) {
        dominantCause = { module: entry.module, element: d.element, delta: d.delta };
      }
      // Track per-element largest mover
      if (Math.abs(d.delta) > Math.abs(perElement[d.element].delta)) {
        perElement[d.element] = { module: entry.module, delta: d.delta };
      }
    }
  }

  return { entries, dominantCause, perElement };
}

// ============================================================================
// 60/40 SCALED VIEW — "How much does this ACTUALLY influence me?"
// ============================================================================

/**
 * External injection modules (Seasonal, Year, Month) are scaled ×0.40
 * because your engine uses 60% natal / 40% external influence.
 * Structural adjustments (Clash, Control, Collapse) stay at raw values.
 */
const EXTERNAL_MODULES = new Set(['Seasonal Qi', 'Year Pillar Qi', 'Month Pillar Qi']);

function scaleEntry(entry: CauseMapEntry, factor: number): CauseMapEntry {
  const scaledDeltas = entry.deltas.map(d => ({
    element: d.element,
    delta: d.delta * factor,
    before: d.before * factor,
    after: d.after * factor,
  }));
  return {
    ...entry,
    deltas: scaledDeltas,
    totalBefore: entry.totalBefore * factor,
    totalAfter: entry.totalAfter * factor,
    notes: [
      ...entry.notes,
      `(Scaled ×${factor} — 60/40 influence rule)`,
    ],
    biggestMover: entry.biggestMover
      ? { element: entry.biggestMover.element, delta: entry.biggestMover.delta * factor }
      : undefined,
  };
}

/**
 * Build a scaled CauseMap where external injection stages (Seasonal, Year,
 * Month) are scaled ×0.40 to reflect true influence on the person.
 * Structural stages (Clash, Control, Collapse) stay at raw values.
 */
export function buildScaledCauseMap(raw: CauseMapResult): CauseMapResult {
  const entries = raw.entries.map(entry =>
    EXTERNAL_MODULES.has(entry.module)
      ? scaleEntry(entry, 0.40)
      : entry
  );

  // Recompute summary with scaled values
  let dominantCause = { module: entries[0].module, element: 'Wood' as ElementName, delta: 0 };
  const perElement: Record<ElementName, { module: string; delta: number }> = {
    Wood:  { module: '', delta: 0 },
    Fire:  { module: '', delta: 0 },
    Earth: { module: '', delta: 0 },
    Metal: { module: '', delta: 0 },
    Water: { module: '', delta: 0 },
  };

  for (const entry of entries) {
    for (const d of entry.deltas) {
      if (Math.abs(d.delta) > Math.abs(dominantCause.delta)) {
        dominantCause = { module: entry.module, element: d.element, delta: d.delta };
      }
      if (Math.abs(d.delta) > Math.abs(perElement[d.element].delta)) {
        perElement[d.element] = { module: entry.module, delta: d.delta };
      }
    }
  }

  return { entries, dominantCause, perElement };
}

// ============================================================================
// INTERNAL
// ============================================================================

function buildEntry(params: {
  module: string;
  step: number;
  before: QiDist;
  after: QiDist;
  notes: string[];
}): CauseMapEntry {
  const deltas = computeDeltas(params.before, params.after);
  return {
    module: params.module,
    step: params.step,
    deltas,
    totalBefore: sumQi(params.before),
    totalAfter: sumQi(params.after),
    notes: params.notes,
    biggestMover: findBiggestMover(deltas),
  };
}
