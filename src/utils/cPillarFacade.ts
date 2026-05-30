/**
 * ============================================================================
 * C PILLAR FACADE — profile → 5 C sub-scores (+ 5 Clarity micros) in one call
 * ============================================================================
 *
 * Orchestrates: BaZi chart calc → normalized TFQ weights → Western planet
 * signs + longitudes + house cusps → scoreCognitionPillar.
 *
 * Used by HappinessEnginePage to replace the random C demo seed with real
 * scores for the selected profile. Mirrors the same BaZi pipeline that
 * qiPillarFacade uses (computeQiYearMatrix + perPillarBreakdown), so C's
 * BaZi-derived signals (Metal/Earth/Wood strengths, Yang/Yin balance) use
 * the same numbers Q does.
 * ============================================================================
 */

// @ts-ignore — baziCalculator is .js with implicit any
import { calculateBaZi } from './baziCalculator';
import { getSeasonalWeights } from './baziSeasonality';
import { computeQiYearMatrix, type QiDist } from './qiEngine';
import {
  scoreCognitionPillar,
  type CPillarInputs,
  type CPillarScores,
} from './pillarScorerC';
import { toNormalizedWeights } from './qiNormalization';
import type { ElementName } from './baziUsefulGod';
import type { Planet, HouseCusp } from './westernSignals';
import type { DMPolarity } from './pillarScorerQ';

// ============================================================================
// TYPES
// ============================================================================

export interface CPillarProfile {
  id?: string;
  birthDate?: string | null;       // "YYYY-MM-DD"
  birthTime?: string | null;       // "HH:MM"
  western?: WesternBlob | null;
  calculations?: { western?: WesternBlob | null } | null;
}

interface PlanetBlob {
  sign?: string | null;
  longitude?: number | null;
}

interface HouseBlob {
  house: number;
  longitude: number;
  sign: string;
  degree: number;
}

interface WesternBlob {
  sun?: PlanetBlob | null;
  moon?: PlanetBlob | null;
  sign?: string | null;
  planets?: Record<string, PlanetBlob> | null;
  houses?: HouseBlob[] | null;
}

export interface CPillarFacadeResult {
  scores: CPillarScores;
  diagnostics: {
    dmPolarity: DMPolarity;
    baziWeights: Record<ElementName, number>;
    signs: Partial<Record<Planet, string | null>>;
    longitudes: Partial<Record<Planet, number | null>>;
    houseCusps: HouseCusp[] | null;
  };
}

// ============================================================================
// CONSTANTS (shared with qiPillarFacade)
// ============================================================================

const ELEMENTS: readonly ElementName[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
const YANG_STEMS = new Set(['甲', '丙', '戊', '庚', '壬']);

const STEM_TO_ELEMENT: Record<string, ElementName> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water',
};

const QI_W = { year: 0.10, month: 0.30, dayMaster: 0.35, dayBranch: 0.15, hour: 0.10 } as const;

function polarityMultipliers(pol: DMPolarity): Record<ElementName, number> {
  return pol === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
}

/** Mirror of qiPillarFacade.buildUserTfqFromBreakdown — kept inline to avoid coupling. */
function buildTfq(
  perPillarBreakdown: any,
  dmElement: ElementName,
  dmPolarity: DMPolarity,
  sw: Record<string, number>,
): QiDist {
  const pMults = polarityMultipliers(dmPolarity);
  const yearFq = perPillarBreakdown.year?.qiWeighted || {};
  const monthFq = perPillarBreakdown.month?.qiWeighted || {};
  const hourFq = perPillarBreakdown.hour?.qiWeighted || {};
  const dayBd = perPillarBreakdown.day;

  const tfq: QiDist = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const el of ELEMENTS) {
    const dmRaw = el === dmElement ? 1 : 0;
    const dbRaw = (dayBd?.raw?.[el] || 0) - dmRaw;
    const sMult = sw[el.toLowerCase()] ?? 1.0;
    const dmFq = dmRaw * sMult * pMults[el] * QI_W.dayMaster;
    const dbFq = dbRaw * sMult * pMults[el] * QI_W.dayBranch;
    tfq[el] = (yearFq[el] || 0) + (monthFq[el] || 0) + dmFq + dbFq + (hourFq[el] || 0);
  }
  return tfq;
}

// ============================================================================
// WESTERN DATA EXTRACTION
// ============================================================================

const PLANET_KEYS: ReadonlyArray<Planet> = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
] as const;

function extractWestern(profile: CPillarProfile): {
  signs: Partial<Record<Planet, string | null>>;
  longitudes: Partial<Record<Planet, number | null>>;
  houseCusps: HouseCusp[] | null;
} {
  const western = profile.western || profile.calculations?.western;
  if (!western) {
    return { signs: {}, longitudes: {}, houseCusps: null };
  }

  const planets: Record<string, PlanetBlob> = (western.planets || {}) as Record<string, PlanetBlob>;

  const lookupPlanet = (name: Planet): PlanetBlob | null => {
    if (name === 'Sun') return western.sun ?? null;
    if (name === 'Moon') return western.moon ?? null;
    return planets[name] || planets[name.toLowerCase()] || null;
  };

  const signs: Partial<Record<Planet, string | null>> = {};
  const longitudes: Partial<Record<Planet, number | null>> = {};
  for (const p of PLANET_KEYS) {
    const blob = lookupPlanet(p);
    signs[p] = blob?.sign ?? null;
    longitudes[p] = blob?.longitude ?? null;
  }
  // Fall back to western.sign for Sun if Sun's blob is missing the sign field
  if (!signs.Sun && western.sign) signs.Sun = western.sign;

  const houseCusps: HouseCusp[] | null = Array.isArray(western.houses) && western.houses.length >= 12
    ? western.houses.map(h => ({
        house: h.house,
        longitude: h.longitude,
        sign: h.sign,
        degree: h.degree,
      }))
    : null;

  return { signs, longitudes, houseCusps };
}

// ============================================================================
// MAIN ENTRY
// ============================================================================

/**
 * Compute the C pillar (Cognition) scores for a profile.
 *
 * Returns `null` if the profile lacks birth data or the BaZi calculation fails.
 * The 5 sub-scores in the result map directly to happinessEngine.ts Q pillar
 * sub IDs (clarity, memory, creativity, learning, decision). Clarity's
 * micros are surfaced separately via `scores.micros` for the wheel detail
 * view, though they're already aggregated into the `clarity` sub.
 */
export function computeCognitionPillarFromProfile(
  profile: CPillarProfile | null | undefined,
): CPillarFacadeResult | null {
  if (!profile?.birthDate) return null;

  // 1. BaZi chart
  let chart: any;
  try {
    const [year, month, day] = profile.birthDate.split('-').map(Number);
    const [hour = 12, minute = 0] = (profile.birthTime || '12:00').split(':').map(Number);
    chart = calculateBaZi({ year, month, day, hour, minute });
    if (chart?.error) return null;
  } catch {
    return null;
  }

  const pillars = chart?.pillars;
  if (!Array.isArray(pillars) || pillars.length < 4) return null;

  const monthBranch: string | undefined = pillars[1]?.branch?.char;
  const dayMasterStem: string | undefined = pillars[2]?.stem?.char;
  if (!monthBranch || !dayMasterStem) return null;

  const dmElement = STEM_TO_ELEMENT[dayMasterStem];
  const dmPolarity: DMPolarity = YANG_STEMS.has(dayMasterStem) ? 'Yang' : 'Yin';
  if (!dmElement) return null;

  const sw = getSeasonalWeights(monthBranch);
  if (!sw) return null;

  // 2. TFQ via the engine's perPillarBreakdown (same source as qiPillarFacade)
  let qiMatrix: any;
  try {
    qiMatrix = computeQiYearMatrix(chart, new Date().getFullYear());
  } catch {
    return null;
  }
  const perPillarBreakdown = qiMatrix?.perPillarBreakdown;
  if (!perPillarBreakdown) return null;

  const tfq = buildTfq(perPillarBreakdown, dmElement, dmPolarity, sw);
  const baziWeights = toNormalizedWeights(tfq);

  // 3. Western signs + longitudes + house cusps
  const { signs, longitudes, houseCusps } = extractWestern(profile);

  // 4. Score
  const inputs: CPillarInputs = {
    baziWeights,
    signs,
    longitudes,
    houseCusps,
    dmPolarity,
  };
  const scores = scoreCognitionPillar(inputs);

  return {
    scores,
    diagnostics: {
      dmPolarity,
      baziWeights,
      signs,
      longitudes,
      houseCusps,
    },
  };
}
