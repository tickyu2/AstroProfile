/**
 * ============================================================================
 * MIFQ ENGINE — Monthly Ideal Functional Qi
 * ============================================================================
 *
 * MIFQ = the ideal elemental climate for this person this month.
 *
 * Not natal (TFQ). Not environmental (MTFQ).
 * It's the TARGET shape the bracelet and health module should move toward.
 *
 * IFQ = the target vector.
 * MTFQ = the actual weather.
 * BRQ = the correction vector that moves MTFQ → IFQ.
 *
 * Formula per element:
 *   Base = 20 (neutral %)
 *   AfterYongShen = Base + yongShenAdjustment[el]
 *   RawIFQPercent = AfterYongShen + seasonalAdjustment[el]
 *   Normalize: scale = MTFQ_total / sum(RawIFQPercent)
 *   FinalIFQ[el] = RawIFQPercent[el] × scale
 *
 * Created: March 2026
 * ============================================================================
 */

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

const ELEMENTS: ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// ============================================================================
// DM STRENGTH → BRACELET PRESCRIPTION
// ============================================================================
//
// DM Strength determines which Ten God roles the bracelet should target:
//   Weak DM  → add Resource (parent) + Companion (peer)
//   Strong DM → add Output (child) + Wealth (controlled) + Officer (controller)
//   Balanced  → gentle correction toward TFQ deficit
//
// This produces per-element % adjustments just like Yong Shen and Seasonal.
// ============================================================================

// Wu Xing role → element mappings
const GENERATOR: Record<ElementName, ElementName> = {
  Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal',
};
const CHILD: Record<ElementName, ElementName> = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};
const CONTROLLED: Record<ElementName, ElementName> = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire',
};
const CONTROLLER: Record<ElementName, ElementName> = {
  Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth',
};

type DmBand = 'Overweak' | 'Weak' | 'Balanced' | 'Strong' | 'Overstrong';

function classifyDmBand(score: number): DmBand {
  if (score < 20) return 'Overweak';
  if (score < 40) return 'Weak';
  if (score < 60) return 'Balanced';
  if (score < 80) return 'Strong';
  return 'Overstrong';
}

interface RoleTarget { role: string; weight: number; }

function getRoleTargets(band: DmBand): RoleTarget[] {
  switch (band) {
    case 'Overweak':
      return [{ role: 'Resource', weight: 1.0 }, { role: 'Companion', weight: 0.8 }];
    case 'Weak':
      return [{ role: 'Resource', weight: 0.8 }, { role: 'Companion', weight: 0.5 }];
    case 'Strong':
      return [{ role: 'Output', weight: 0.8 }, { role: 'Wealth', weight: 0.6 }, { role: 'Officer', weight: 0.4 }];
    case 'Overstrong':
      return [{ role: 'Output', weight: 1.0 }, { role: 'Wealth', weight: 0.8 }, { role: 'Officer', weight: 0.6 }];
    case 'Balanced':
    default:
      return []; // no DM-driven adjustment for balanced charts
  }
}

function roleToElement(dm: ElementName, role: string): ElementName {
  switch (role) {
    case 'Resource':  return GENERATOR[dm];
    case 'Companion': return dm;
    case 'Output':    return CHILD[dm];
    case 'Wealth':    return CONTROLLED[dm];
    case 'Officer':   return CONTROLLER[dm];
    default:          return dm;
  }
}

/** Scale factor for DM Strength adjustment (how aggressively it shifts IFQ) */
const DM_STRENGTH_SCALE = 8; // max ±8% per element

export interface DmStrengthInput {
  dmElement: ElementName;
  dmStrengthScore: number; // 0–100
}

export interface DmStrengthAdjResult {
  band: DmBand;
  adjustments: Record<ElementName, number>;  // per-element % shift
  roles: RoleTarget[];
}

/**
 * Compute DM Strength → per-element IFQ adjustment.
 * Returns % adjustments (like Yong Shen adj) that shift IFQ toward
 * the elements this DM strength band needs.
 */
export function computeDmStrengthAdjustment(input: DmStrengthInput): DmStrengthAdjResult {
  const band = classifyDmBand(input.dmStrengthScore);
  const roles = getRoleTargets(band);
  const adj: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  for (const r of roles) {
    const el = roleToElement(input.dmElement, r.role);
    adj[el] += r.weight * DM_STRENGTH_SCALE;
  }

  // Round to 1 decimal
  ELEMENTS.forEach(el => { adj[el] = Math.round(adj[el] * 10) / 10; });

  return { band, adjustments: adj, roles };
}

// ============================================================================
// IFQ COMPUTATION
// ============================================================================

export interface IFQInputs {
  mtfqTotalQi: number;
  yongShenAdjustment: Record<ElementName, number>;
  seasonalAdjustment: Record<ElementName, number>;
  /** Optional: DM Strength–driven adjustment (from computeDmStrengthAdjustment) */
  dmStrengthAdjustment?: Record<ElementName, number>;
}

export interface IFQStep {
  base: number;
  yongShenAdj: number;
  afterYongShen: number;
  dmStrengthAdj: number;
  afterDmStrength: number;
  seasonalAdj: number;
  rawPercent: number;
  normalizedQi: number;
}

export interface IFQResult {
  elements: Record<ElementName, IFQStep>;
  totalRawPercent: number;
  totalNormalizedQi: number;
  scale: number;
  dmBand?: DmBand;
}

export function computeIFQ(inputs: IFQInputs): IFQResult {
  const BASE = 20;

  const afterYS: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const afterDM: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const raw: Record<ElementName, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  // Steps 1–4: Build raw IFQ percent per element
  //   Base (20%) → + Yong Shen → + DM Strength → + Seasonal → clamp
  ELEMENTS.forEach(el => {
    const ys = inputs.yongShenAdjustment[el] ?? 0;
    const dm = inputs.dmStrengthAdjustment?.[el] ?? 0;
    const ss = inputs.seasonalAdjustment[el] ?? 0;

    afterYS[el] = BASE + ys;
    afterDM[el] = afterYS[el] + dm;
    raw[el] = Math.max(2, afterDM[el] + ss); // Floor at 2% — no element vanishes
  });

  // Step 5: Normalize to match MTFQ total Qi
  const rawTotal = ELEMENTS.reduce((sum, el) => sum + raw[el], 0);
  const scale = rawTotal > 0 ? inputs.mtfqTotalQi / rawTotal : 0;

  const elements: Record<ElementName, IFQStep> = {} as any;
  ELEMENTS.forEach(el => {
    elements[el] = {
      base: BASE,
      yongShenAdj: inputs.yongShenAdjustment[el] ?? 0,
      afterYongShen: afterYS[el],
      dmStrengthAdj: inputs.dmStrengthAdjustment?.[el] ?? 0,
      afterDmStrength: afterDM[el],
      seasonalAdj: inputs.seasonalAdjustment[el] ?? 0,
      rawPercent: raw[el],
      normalizedQi: raw[el] * scale,
    };
  });

  const totalNormalizedQi = ELEMENTS.reduce((s, el) => s + elements[el].normalizedQi, 0);

  return { elements, totalRawPercent: rawTotal, totalNormalizedQi, scale };
}
