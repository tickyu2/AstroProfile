/**
 * matchScore.js
 *
 * End-to-end compatibility matching function
 * Combines NEO PI-R (30 facets) + BaZi (WuXing + TenGods)
 *
 * Formula: Total = (1-α)*NEO + α*[(1-β)*WuXing + β*TenGods] * modifiers
 * Recommended defaults: α = 0.25, β = 0.30
 *
 * DATA SOURCES:
 * - WuXing: seasonalStrength.percentages (POST-seasonal, preferred)
 *           OR elements.percentages (PRE-seasonal, fallback)
 * - TenGods: tenGodSummary folded to 5 groups
 */

import {
  wuxingCompatibilityFromSeasonalPercentages,
  tenGodsCompatibilityFromSummary,
  dmRelationshipElements,
  baziInteractionModifier,
  favorableElementsModifier,
  ELEMENTS
} from './matchScore_baziHelpers';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function levelFromScore(s) {
  if (s >= 0.85) return 'Exceptional';
  if (s >= 0.70) return 'Strong';
  if (s >= 0.55) return 'Moderate';
  if (s >= 0.40) return 'Challenging';
  return 'Difficult';
}

// =============================================================================
// NEO COMPATIBILITY (30 FACETS)
// =============================================================================

/**
 * NEO similarity: mirrors synastry_engine.py compute_synastry_fusion()
 * - Cosine similarity
 * - Euclidean score (1 - dist/sqrt(30))
 * - Domain-weighted score across 5 domains × 6 facets
 *
 * @param {Array<number>} neoA30 - Profile A's 30-facet vector [0-1]
 * @param {Array<number>} neoB30 - Profile B's 30-facet vector [0-1]
 * @param {boolean} weighted - Whether to apply domain weights (default true)
 * @returns {Object} Score and components
 */
export function computeNeoSimilarity(neoA30, neoB30, weighted = true) {
  if (!Array.isArray(neoA30) || !Array.isArray(neoB30) ||
      neoA30.length !== 30 || neoB30.length !== 30) {
    throw new Error('computeNeoSimilarity expects two 30-length arrays.');
  }

  const v1 = neoA30.map(Number);
  const v2 = neoB30.map(Number);

  // Cosine similarity
  let dot = 0, n1 = 0, n2 = 0;
  for (let i = 0; i < 30; i++) {
    dot += v1[i] * v2[i];
    n1 += v1[i] * v1[i];
    n2 += v2[i] * v2[i];
  }
  n1 = Math.sqrt(n1);
  n2 = Math.sqrt(n2);
  const cosine = (n1 > 0 && n2 > 0) ? (dot / (n1 * n2)) : 0;

  // Euclidean score (normalized)
  let dist2 = 0;
  for (let i = 0; i < 30; i++) {
    const d = v1[i] - v2[i];
    dist2 += d * d;
  }
  const euclideanDist = Math.sqrt(dist2);
  const maxDist = Math.sqrt(30); // Maximum possible distance
  const euclideanScore = 1 - (euclideanDist / maxDist);

  // Domain-weighted scores (5 domains × 6 facets each)
  const DOMAIN_WEIGHTS = {
    N: 0.15, // Neuroticism - emotional stability match
    E: 0.20, // Extraversion - social energy match
    O: 0.20, // Openness - intellectual harmony
    A: 0.25, // Agreeableness - interpersonal rapport
    C: 0.20  // Conscientiousness - practical alignment
  };
  const domains = ['N', 'E', 'O', 'A', 'C'];

  const dimensionScores = {};
  let weightedSum = 0;

  for (let i = 0; i < 5; i++) {
    const start = i * 6;
    const end = start + 6;
    let meanAbsDiff = 0;

    for (let j = start; j < end; j++) {
      meanAbsDiff += Math.abs(v1[j] - v2[j]);
    }
    meanAbsDiff /= 6;

    const domainScore = 1 - meanAbsDiff;
    dimensionScores[domains[i]] = Number(domainScore.toFixed(3));
    weightedSum += domainScore * DOMAIN_WEIGHTS[domains[i]];
  }

  // Final score: blend of cosine + euclidean + weighted domain
  const overall = weighted
    ? (0.3 * cosine + 0.3 * euclideanScore + 0.4 * weightedSum)
    : (0.5 * cosine + 0.5 * euclideanScore);

  return {
    score: clamp01(overall),
    cosine: Number(cosine.toFixed(3)),
    euclidean: Number(euclideanScore.toFixed(3)),
    dimensionScores
  };
}

// =============================================================================
// END-TO-END MATCH SCORE
// =============================================================================

/**
 * End-to-end compatibility matching
 *
 * Total = (1-α)*NEO + α*[(1-β)*WuXing + β*TenGods] * modifiers
 *
 * DATA SOURCES:
 * - WuXing: seasonalStrength.percentages (preferred) or elements.percentages (fallback)
 * - TenGods: tenGodSummary folded to 5 groups
 *
 * @param {Object} profileA - Profile A with neo30Facets and bazi
 * @param {Object} profileB - Profile B with neo30Facets and bazi
 * @param {Object} opts - Options { alpha, beta }
 * @returns {Object} Complete compatibility result
 */
export function matchScore(profileA, profileB, opts = {}) {
  const alpha = clamp01(opts.alpha ?? 0.25);
  const beta = clamp01(opts.beta ?? 0.30);

  // 1) NEO (0..1)
  const neo = computeNeoSimilarity(profileA.neo30Facets, profileB.neo30Facets, true);

  // 2) WuXing (0..1) - POST-seasonal preferred, fallback to PRE-seasonal
  const pctA = profileA.bazi?.seasonalStrength?.percentages || profileA.bazi?.elements?.percentages;
  const pctB = profileB.bazi?.seasonalStrength?.percentages || profileB.bazi?.elements?.percentages;
  const wuxing = wuxingCompatibilityFromSeasonalPercentages(pctA, pctB);

  // 3) TenGods (0..1) - fold 10-slot -> 5-group
  const tengods = tenGodsCompatibilityFromSummary(
    profileA.bazi?.tenGodSummary,
    profileB.bazi?.tenGodSummary
  );

  // 4) BaZi blend
  let baziBlend = clamp01((1 - beta) * wuxing + beta * tengods);

  // 5) Industry-realistic upgrades: small modifiers (safe + bounded)
  // These DO NOT replace your α/β architecture - they gently refine the BaZi layer
  const modFavor = favorableElementsModifier(profileA.bazi, profileB.bazi);   // ~0.90..1.10
  const modInter = baziInteractionModifier(profileA.bazi, profileB.bazi);     // ~0.88..1.12

  // ENHANCEMENT: Clamp combined modifiers multiplicatively (helpful but not destiny-breaking)
  const combinedModifier = Math.max(0.85, Math.min(1.15, modFavor * modInter));
  const baziBlendAdjusted = clamp01(baziBlend * combinedModifier);

  // 6) Total
  const total = clamp01((1 - alpha) * neo.score + alpha * baziBlendAdjusted);

  // 7) Explanation (includes Day Master correction logic)
  const why = generateExplanation(profileA, profileB, {
    alpha, beta,
    neo, wuxing, tengods,
    baziBlend: baziBlendAdjusted,
    modFavor, modInter
  });

  return {
    total: Math.round(total * 100),
    level: levelFromScore(total),

    neo: Math.round(neo.score * 100),
    bazi: Math.round(baziBlendAdjusted * 100),
    wuxing: Math.round(wuxing * 100),
    tengods: Math.round(tengods * 100),

    // Debug info for auditing / UI
    debug: {
      alpha, beta,
      neo_details: neo,
      bazi_raw: baziBlend,
      bazi_adjusted: baziBlendAdjusted,
      modifiers: {
        favorableElements: Number(modFavor.toFixed(3)),
        interactions: Number(modInter.toFixed(3)),
        combined: Number(combinedModifier.toFixed(3))  // Clamped to 0.85-1.15
      }
    },

    why
  };
}

/**
 * Generate short, truthful explanation (no hand-wavy claims)
 * Includes the corrected DM relationship map:
 * For Wood DM: Wealth=Earth (not Fire), Output=Fire, Resource=Water, Power=Metal.
 */
function generateExplanation(profileA, profileB, data) {
  const dmA = profileA.bazi?.dayMaster?.element;
  const dmB = profileB.bazi?.dayMaster?.element;

  const relA = dmA ? dmRelationshipElements(dmA) : null;
  const relB = dmB ? dmRelationshipElements(dmB) : null;

  const domA = profileA.bazi?.seasonalStrength?.dominant ?? '?';
  const domB = profileB.bazi?.seasonalStrength?.dominant ?? '?';

  const notes = [];

  // NEO alignment
  notes.push(
    `NEO alignment: ${Math.round(data.neo.score * 100)}% (domains: ` +
    `N ${Math.round(data.neo.dimensionScores.N * 100)}%, ` +
    `E ${Math.round(data.neo.dimensionScores.E * 100)}%, ` +
    `O ${Math.round(data.neo.dimensionScores.O * 100)}%, ` +
    `A ${Math.round(data.neo.dimensionScores.A * 100)}%, ` +
    `C ${Math.round(data.neo.dimensionScores.C * 100)}%).`
  );

  // WuXing + TenGods
  notes.push(
    `BaZi overlay: WuXing ${Math.round(data.wuxing * 100)}% + Ten Gods ${Math.round(data.tengods * 100)}% ` +
    `→ blended (β=${data.beta}) = ${Math.round(data.baziBlend * 100)}%.`
  );

  // Dominant seasonal elements
  notes.push(`Seasonal constitution: A is ${domA}-dominant; B is ${domB}-dominant (post-seasonal 旺衰).`);

  // Day Master relationships (corrected)
  if (relA) {
    notes.push(
      `A Day Master (${dmA}) map: Companion=${relA.Companion}, Output=${relA.Output}, Wealth=${relA.Wealth}, ` +
      `Power=${relA.Power}, Resource=${relA.Resource}.`
    );
  }
  if (relB) {
    notes.push(
      `B Day Master (${dmB}) map: Companion=${relB.Companion}, Output=${relB.Output}, Wealth=${relB.Wealth}, ` +
      `Power=${relB.Power}, Resource=${relB.Resource}.`
    );
  }

  // Modifiers summary
  const mf = data.modFavor;
  const mi = data.modInter;
  if (mf !== 1 || mi !== 1) {
    notes.push(
      `BaZi refinements applied: favorable-elements ×${mf.toFixed(2)}, interactions ×${mi.toFixed(2)}.`
    );
  }

  // Final blend
  const neoContrib = Math.round(data.neo.score * (1 - data.alpha) * 100);
  const baziContrib = Math.round(data.baziBlend * data.alpha * 100);
  notes.push(
    `Total blend: (1-α)NEO + αBaZi with α=${data.alpha} → ${neoContrib}% + ${baziContrib}% contribution.`
  );

  return notes;
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Quick match score with just BaZi data (uses default NEO similarity of 0.5)
 */
export function quickBaziMatch(baziA, baziB, opts = {}) {
  const alpha = clamp01(opts.alpha ?? 0.25);
  const beta = clamp01(opts.beta ?? 0.30);

  // POST-seasonal preferred, fallback to PRE-seasonal
  const pctA = baziA?.seasonalStrength?.percentages || baziA?.elements?.percentages;
  const pctB = baziB?.seasonalStrength?.percentages || baziB?.elements?.percentages;
  const wuxing = wuxingCompatibilityFromSeasonalPercentages(pctA, pctB);

  const tengods = tenGodsCompatibilityFromSummary(
    baziA?.tenGodSummary,
    baziB?.tenGodSummary
  );

  let baziBlend = clamp01((1 - beta) * wuxing + beta * tengods);
  const modFavor = favorableElementsModifier(baziA, baziB);
  const modInter = baziInteractionModifier(baziA, baziB);

  // ENHANCEMENT: Clamp combined modifiers multiplicatively (same as matchScore)
  const combinedModifier = Math.max(0.85, Math.min(1.15, modFavor * modInter));
  const baziBlendAdjusted = clamp01(baziBlend * combinedModifier);

  // Use default NEO score of 0.5 (neutral)
  const neoScore = 0.5;
  const total = clamp01((1 - alpha) * neoScore + alpha * baziBlendAdjusted);

  return {
    total: Math.round(total * 100),
    level: levelFromScore(total),
    bazi: Math.round(baziBlendAdjusted * 100),
    wuxing: Math.round(wuxing * 100),
    tengods: Math.round(tengods * 100)
  };
}

/**
 * Get compatibility insights for UI display
 */
export function getCompatibilityInsights(profileA, profileB, matchResult) {
  const insights = [];

  // Level-based insight
  switch (matchResult.level) {
    case 'Exceptional':
      insights.push('Exceptional harmony across personality and elemental constitution.');
      break;
    case 'Strong':
      insights.push('Strong compatibility with natural synergy in key areas.');
      break;
    case 'Moderate':
      insights.push('Moderate compatibility with both strengths and areas for growth.');
      break;
    case 'Challenging':
      insights.push('Some friction areas that require understanding and adaptation.');
      break;
    case 'Difficult':
      insights.push('Significant differences that may require conscious effort to bridge.');
      break;
  }

  // Element-based insights
  const domA = profileA.bazi?.seasonalStrength?.dominant;
  const domB = profileB.bazi?.seasonalStrength?.dominant;

  if (domA && domB) {
    if (domA === domB) {
      insights.push(`Both share ${domA} constitution - natural understanding.`);
    } else if (
      (domA === 'Wood' && domB === 'Fire') || (domA === 'Fire' && domB === 'Wood') ||
      (domA === 'Fire' && domB === 'Earth') || (domA === 'Earth' && domB === 'Fire') ||
      (domA === 'Earth' && domB === 'Metal') || (domA === 'Metal' && domB === 'Earth') ||
      (domA === 'Metal' && domB === 'Water') || (domA === 'Water' && domB === 'Metal') ||
      (domA === 'Water' && domB === 'Wood') || (domA === 'Wood' && domB === 'Water')
    ) {
      insights.push(`${domA}-${domB} generating relationship - supportive energy flow.`);
    }
  }

  // NEO-based insights
  if (matchResult.debug?.neo_details?.dimensionScores) {
    const scores = matchResult.debug.neo_details.dimensionScores;
    const strongest = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
    const weakest = Object.entries(scores).reduce((a, b) => a[1] < b[1] ? a : b);

    const domainNames = {
      N: 'emotional stability',
      E: 'social energy',
      O: 'intellectual curiosity',
      A: 'interpersonal harmony',
      C: 'practical alignment'
    };

    insights.push(`Strongest alignment in ${domainNames[strongest[0]]} (${Math.round(strongest[1] * 100)}%).`);
    if (weakest[1] < 0.6) {
      insights.push(`Growth opportunity in ${domainNames[weakest[0]]} (${Math.round(weakest[1] * 100)}%).`);
    }
  }

  return insights;
}

// =============================================================================
// EXPORTS SUMMARY
// =============================================================================
//
// Main functions:
// - computeNeoSimilarity(neoA30, neoB30, weighted)
// - matchScore(profileA, profileB, opts)
// - quickBaziMatch(baziA, baziB, opts)
// - getCompatibilityInsights(profileA, profileB, matchResult)
//
// Expected profile structure:
// {
//   neo30Facets: [0.5, 0.6, ...], // 30 values 0-1
//   bazi: {
//     dayMaster: { element: "Wood", ... },
//     seasonalStrength: { percentages: { Wood: 25, Fire: 30, ... }, dominant: "Fire", ... },
//     tenGodSummary: { Companion: 1, "Direct Wealth": 2, ... },
//     favorableElements: { primary: "Water", secondary: "Wood", avoid: ["Fire"], ... },
//     interactions: [{ type: "六合", ... }, ...]
//   }
// }
// =============================================================================
