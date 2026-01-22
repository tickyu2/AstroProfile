/**
 * explainabilityFormatter.ts
 *
 * Generates progressive depth explanations (L0 → L3) for match scores
 * Implements the Explainability Contract from types/explainability.ts
 *
 * Cathedral Voice: Humble, Precise, Gentle, Honest
 * 3-Beat Rhythm: Ground → Validate → Empower
 */

import type {
  MatchExplain,
  ExplainL0,
  ExplainL1,
  ExplainL2,
  ExplainL3,
  ExplainOptions,
  CathedralInterpretation,
  MathStep,
  NeoMathExplain,
  WuXingMathExplain,
  TenGodsMathExplain,
  BaziMathExplain,
  FusionMathExplain
} from '../types/explainability';

import type {
  Profile,
  MatchScoreResult,
  CompatibilityLevel,
  Element,
  NeoDimensionScores,
  TenGodGroup
} from '../types/bazi.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const DOMAIN_NAMES: Record<string, string> = {
  N: 'Emotional Stability',
  E: 'Social Energy',
  O: 'Intellectual Curiosity',
  A: 'Interpersonal Harmony',
  C: 'Practical Alignment'
};

const DOMAIN_WEIGHTS: Record<string, number> = {
  N: 0.15,
  E: 0.20,
  O: 0.20,
  A: 0.25,
  C: 0.20
};

const TG5_NAMES: Record<TenGodGroup, string> = {
  Companion: 'Companion (Self-Expression)',
  Output: 'Output (Creativity)',
  Wealth: 'Wealth (Resources)',
  Power: 'Power (Authority)',
  Resource: 'Resource (Support)'
};

// =============================================================================
// L0: POSTCARD SUMMARY
// =============================================================================

/**
 * Generate L0 postcard summary
 * Single sentence + badge
 */
export function formatL0(
  result: MatchScoreResult,
  profileA?: Profile,
  profileB?: Profile
): ExplainL0 {
  const nameA = profileA?.name || 'Person A';
  const nameB = profileB?.name || 'Person B';

  const summaryByLevel: Record<CompatibilityLevel, string> = {
    Exceptional: `${nameA} and ${nameB} share exceptional harmony across personality and elemental constitution.`,
    Strong: `${nameA} and ${nameB} have strong natural synergy with complementary strengths.`,
    Moderate: `${nameA} and ${nameB} share moderate compatibility with both strengths and growth areas.`,
    Challenging: `${nameA} and ${nameB} have some friction areas that benefit from understanding.`,
    Difficult: `${nameA} and ${nameB} have significant differences requiring conscious effort to bridge.`
  };

  const badgeByLevel: Record<CompatibilityLevel, string> = {
    Exceptional: 'Exceptional Match',
    Strong: 'Strong Connection',
    Moderate: 'Balanced Pairing',
    Challenging: 'Growth Opportunity',
    Difficult: 'Significant Differences'
  };

  return {
    level: 'L0',
    summary: summaryByLevel[result.level],
    badge: badgeByLevel[result.level],
    score: result.total,
    compatibility: result.level
  };
}

// =============================================================================
// L1: GUIDED FACTOR BREAKDOWN
// =============================================================================

/**
 * Generate L1 guided breakdown
 * Factor cards + Cathedral Voice
 */
export function formatL1(
  result: MatchScoreResult,
  profileA?: Profile,
  profileB?: Profile
): ExplainL1 {
  const nameA = profileA?.name || 'Person A';
  const nameB = profileB?.name || 'Person B';
  const alpha = result.debug?.alpha || 0.25;
  const beta = result.debug?.beta || 0.30;

  // Factor cards
  const factors = [
    {
      name: 'Personality Alignment',
      icon: 'brain',
      score: result.neo,
      weight: `${Math.round((1 - alpha) * 100)}%`,
      description: `30-facet NEO PI-R personality comparison across emotional, social, intellectual, interpersonal, and practical dimensions.`
    },
    {
      name: 'Elemental Constitution',
      icon: 'leaf',
      score: result.wuxing,
      weight: `${Math.round(alpha * (1 - beta) * 100)}%`,
      description: `Five Elements (WuXing) compatibility based on Wood, Fire, Earth, Metal, and Water balance.`
    },
    {
      name: 'Life Role Dynamics',
      icon: 'users',
      score: result.tengods,
      weight: `${Math.round(alpha * beta * 100)}%`,
      description: `Ten Gods relationship dynamics examining Companion, Output, Wealth, Power, and Resource energies.`
    }
  ];

  // Identify strengths and growth areas from domain scores
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (result.debug?.neo_details?.dimensionScores) {
    const scores = result.debug.neo_details.dimensionScores;
    const entries = Object.entries(scores) as [keyof NeoDimensionScores, number][];

    entries.forEach(([domain, score]) => {
      if (score >= 0.75) {
        strengths.push(`Well-aligned in ${DOMAIN_NAMES[domain]} (${Math.round(score * 100)}%)`);
      } else if (score < 0.55) {
        growthAreas.push(`${DOMAIN_NAMES[domain]} presents opportunity for growth (${Math.round(score * 100)}%)`);
      }
    });
  }

  // Add BaZi-based insights
  if (result.wuxing >= 75) {
    strengths.push('Elemental energies flow naturally between you');
  }
  if (result.tengods >= 75) {
    strengths.push('Life role dynamics support mutual growth');
  }

  if (strengths.length === 0) {
    strengths.push('Balanced compatibility across multiple dimensions');
  }
  if (growthAreas.length === 0 && result.level !== 'Exceptional') {
    growthAreas.push('Minor differences that can deepen understanding');
  }

  // Cathedral Voice 3-beat rhythm
  const cathedralVoice = generateCathedralVoice(result.level, nameA, nameB);

  return {
    level: 'L1',
    title: `Compatibility Analysis: ${nameA} & ${nameB}`,
    overview: `This analysis combines Western personality science (NEO PI-R) with Chinese metaphysics (BaZi) to provide a multi-dimensional view of compatibility. The overall score of ${result.total}% reflects weighted contributions from personality alignment, elemental constitution, and life role dynamics.`,
    factors,
    strengths,
    growthAreas,
    cathedralVoice
  };
}

/**
 * Generate Cathedral Voice interpretation
 * 3-beat rhythm: Ground → Validate → Empower
 */
function generateCathedralVoice(
  level: CompatibilityLevel,
  nameA: string,
  nameB: string
): CathedralInterpretation {
  const voices: Record<CompatibilityLevel, CathedralInterpretation> = {
    Exceptional: {
      ground: `The data suggests a rare alignment between ${nameA} and ${nameB}, where personality patterns and elemental constitutions naturally resonate.`,
      validate: `This kind of harmony is uncommon. Both individuals may find understanding comes more easily than expected.`,
      empower: `While compatibility provides a foundation, the relationship you build depends on the choices you make together.`
    },
    Strong: {
      ground: `${nameA} and ${nameB} show strong compatibility markers across multiple dimensions of personality and elemental balance.`,
      validate: `There appears to be natural synergy here, with complementary strengths that can support mutual growth.`,
      empower: `This foundation offers many paths forward. The direction you choose to grow together remains in your hands.`
    },
    Moderate: {
      ground: `The analysis shows ${nameA} and ${nameB} have areas of alignment alongside areas of difference.`,
      validate: `This balance is common and healthy. Differences often become sources of learning when approached with curiosity.`,
      empower: `Moderate compatibility means you have room to grow together in ways that may surprise you both.`
    },
    Challenging: {
      ground: `${nameA} and ${nameB} show some areas of friction in personality or elemental patterns.`,
      validate: `Friction is not failure. Many strong relationships are built by working through differences rather than around them.`,
      empower: `These challenges, if embraced, can become catalysts for deeper understanding and personal growth.`
    },
    Difficult: {
      ground: `The data indicates significant differences between ${nameA} and ${nameB} across multiple dimensions.`,
      validate: `Large differences require more conscious effort, but they do not predetermine outcomes.`,
      empower: `If both choose to invest in understanding, even challenging matches can evolve into meaningful connections.`
    }
  };

  return voices[level];
}

// =============================================================================
// L2: FULL MATHEMATICAL BREAKDOWN
// =============================================================================

/**
 * Generate L2 full math breakdown
 * Formulas, substitutions, and step-by-step calculations
 */
export function formatL2(
  result: MatchScoreResult,
  profileA: Profile,
  profileB: Profile
): ExplainL2 {
  const alpha = result.debug?.alpha || 0.25;
  const beta = result.debug?.beta || 0.30;
  const neoDetails = result.debug?.neo_details;
  const modifiers = result.debug?.modifiers;

  // Master formula
  const masterFormula = {
    latex: 'Total = (1-\\alpha) \\cdot NEO + \\alpha \\cdot [(1-\\beta) \\cdot WuXing + \\beta \\cdot TenGods] \\cdot M',
    plainText: 'Total = (1-α)*NEO + α*[(1-β)*WuXing + β*TenGods] * Modifiers',
    description: 'The compatibility score blends Western personality science (NEO PI-R) with Chinese metaphysics (BaZi WuXing and Ten Gods), adjusted by interaction modifiers.'
  };

  // NEO math
  const neo = formatNeoMath(neoDetails, profileA, profileB);

  // WuXing math
  const wuxing = formatWuXingMath(result.wuxing / 100, profileA, profileB);

  // Ten Gods math
  const tengods = formatTenGodsMath(result.tengods / 100, profileA, profileB);

  // BaZi blend math
  const bazi = formatBaziMath(result, beta, modifiers);

  // Fusion math
  const fusion = formatFusionMath(result, alpha);

  return {
    level: 'L2',
    masterFormula,
    neo,
    wuxing,
    tengods,
    bazi,
    fusion,
    coefficients: {
      alpha,
      beta,
      domainWeights: DOMAIN_WEIGHTS
    }
  };
}

function formatNeoMath(
  neoDetails: MatchScoreResult['debug']['neo_details'] | undefined,
  profileA: Profile,
  profileB: Profile
): NeoMathExplain {
  const cosine = neoDetails?.cosine || 0;
  const euclidean = neoDetails?.euclidean || 0;
  const dimScores = neoDetails?.dimensionScores || { N: 0, E: 0, O: 0, A: 0, C: 0 };
  const overall = neoDetails?.score || 0;

  // Calculate domain weighted sum
  let weightedSum = 0;
  Object.entries(dimScores).forEach(([k, v]) => {
    weightedSum += v * (DOMAIN_WEIGHTS[k] || 0.2);
  });

  return {
    cosine: {
      label: 'Cosine Similarity',
      formula: 'cos(A,B) = (A·B) / (||A|| × ||B||)',
      substitution: `dot product / (norm_A × norm_B)`,
      result: cosine,
      unit: '0-1',
      interpretation: cosine >= 0.8 ? 'Very similar personality direction' :
                      cosine >= 0.6 ? 'Moderately aligned personality vectors' :
                      'Different personality orientations'
    },
    euclidean: {
      label: 'Euclidean Score',
      formula: 'euclidean = 1 - (||A-B|| / √30)',
      substitution: `1 - (distance / ${Math.sqrt(30).toFixed(3)})`,
      result: euclidean,
      unit: '0-1',
      interpretation: euclidean >= 0.8 ? 'Very close in personality space' :
                      euclidean >= 0.6 ? 'Moderate proximity in personality space' :
                      'Distant in personality space'
    },
    domainWeighted: {
      label: 'Domain-Weighted Score',
      formula: 'Σ(domain_score × domain_weight)',
      substitution: `N×0.15 + E×0.20 + O×0.20 + A×0.25 + C×0.20`,
      result: weightedSum,
      unit: '0-1',
      interpretation: 'Agreeableness weighted highest for relational compatibility'
    },
    domainScores: {
      N: createDomainStep('N', dimScores.N, 'Emotional Stability'),
      E: createDomainStep('E', dimScores.E, 'Social Energy'),
      O: createDomainStep('O', dimScores.O, 'Intellectual Curiosity'),
      A: createDomainStep('A', dimScores.A, 'Interpersonal Harmony'),
      C: createDomainStep('C', dimScores.C, 'Practical Alignment')
    },
    blend: {
      label: 'NEO Final Score',
      formula: '0.3×cosine + 0.3×euclidean + 0.4×domainWeighted',
      substitution: `0.3×${cosine.toFixed(3)} + 0.3×${euclidean.toFixed(3)} + 0.4×${weightedSum.toFixed(3)}`,
      result: overall,
      unit: '0-1',
      interpretation: `Combined personality similarity: ${Math.round(overall * 100)}%`
    }
  };
}

function createDomainStep(domain: string, score: number, name: string): MathStep {
  return {
    label: `${domain}: ${name}`,
    formula: `1 - mean(|A[${domain}] - B[${domain}]|)`,
    result: score,
    unit: '0-1',
    interpretation: score >= 0.75 ? `Well-aligned in ${name.toLowerCase()}` :
                    score >= 0.55 ? `Moderate alignment in ${name.toLowerCase()}` :
                    `Opportunity for growth in ${name.toLowerCase()}`
  };
}

function formatWuXingMath(
  wuxingScore: number,
  profileA: Profile,
  profileB: Profile
): WuXingMathExplain {
  const domA = profileA.bazi?.seasonalStrength?.dominant || profileA.bazi?.elements?.dominant;
  const domB = profileB.bazi?.seasonalStrength?.dominant || profileB.bazi?.elements?.dominant;

  let relationship: 'same' | 'generating' | 'controlling' | 'neutral' = 'neutral';
  let interpretation = 'Neutral elemental relationship';

  if (domA && domB) {
    if (domA === domB) {
      relationship = 'same';
      interpretation = `Both ${domA}-dominant: strong natural resonance`;
    } else if (isGenerating(domA, domB)) {
      relationship = 'generating';
      interpretation = `${domA}→${domB} or ${domB}→${domA}: supportive energy flow`;
    } else if (isControlling(domA, domB)) {
      relationship = 'controlling';
      interpretation = `${domA}↔${domB}: dynamic tension requiring balance`;
    }
  }

  return {
    vectorA: {
      label: 'WuXing Vector A',
      formula: 'normalize([W, F, E, M, Wa])',
      result: 1.0,
      unit: 'normalized',
      interpretation: `Profile A elemental distribution (${domA || 'unknown'}-dominant)`
    },
    vectorB: {
      label: 'WuXing Vector B',
      formula: 'normalize([W, F, E, M, Wa])',
      result: 1.0,
      unit: 'normalized',
      interpretation: `Profile B elemental distribution (${domB || 'unknown'}-dominant)`
    },
    bilinear: {
      label: 'Bilinear Form',
      formula: 'vA @ M @ vB (5×5 sheng/ke matrix)',
      result: wuxingScore,
      unit: '0-1',
      interpretation: `Elemental compatibility: ${Math.round(wuxingScore * 100)}%`
    },
    dominants: {
      elementA: domA || 'Wood',
      elementB: domB || 'Wood',
      relationship,
      interpretation
    }
  };
}

function isGenerating(a: Element, b: Element): boolean {
  const gen: Record<Element, Element> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
  };
  return gen[a] === b || gen[b] === a;
}

function isControlling(a: Element, b: Element): boolean {
  const ctrl: Record<Element, Element> = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood'
  };
  return ctrl[a] === b || ctrl[b] === a;
}

function formatTenGodsMath(
  tengodsScore: number,
  profileA: Profile,
  profileB: Profile
): TenGodsMathExplain {
  return {
    vector5A: {
      label: 'Ten Gods Vector A (5-group)',
      formula: 'fold10to5(tenGodSummary)',
      result: 1.0,
      unit: 'normalized',
      interpretation: 'Folded from 10 individual gods to 5 functional groups'
    },
    vector5B: {
      label: 'Ten Gods Vector B (5-group)',
      formula: 'fold10to5(tenGodSummary)',
      result: 1.0,
      unit: 'normalized',
      interpretation: 'Companion, Output, Wealth, Power, Resource distribution'
    },
    bilinear: {
      label: 'Bilinear Form',
      formula: 'v5A @ TG5_M @ v5B (5×5 interaction matrix)',
      result: tengodsScore,
      unit: '0-1',
      interpretation: `Ten Gods compatibility: ${Math.round(tengodsScore * 100)}%`
    },
    groupAnalysis: [
      {
        group: 'Companion' as TenGodGroup,
        valueA: 0,
        valueB: 0,
        interaction: 'resonance' as const,
        interpretation: 'Self-expression and peer dynamics'
      },
      {
        group: 'Output' as TenGodGroup,
        valueA: 0,
        valueB: 0,
        interaction: 'synergy' as const,
        interpretation: 'Creative and expressive energy'
      },
      {
        group: 'Wealth' as TenGodGroup,
        valueA: 0,
        valueB: 0,
        interaction: 'neutral' as const,
        interpretation: 'Resource acquisition and management'
      },
      {
        group: 'Power' as TenGodGroup,
        valueA: 0,
        valueB: 0,
        interaction: 'friction' as const,
        interpretation: 'Authority and structure'
      },
      {
        group: 'Resource' as TenGodGroup,
        valueA: 0,
        valueB: 0,
        interaction: 'synergy' as const,
        interpretation: 'Support and nourishment'
      }
    ]
  };
}

function formatBaziMath(
  result: MatchScoreResult,
  beta: number,
  modifiers?: MatchScoreResult['debug']['modifiers']
): BaziMathExplain {
  const wuxing = result.wuxing / 100;
  const tengods = result.tengods / 100;
  const rawBlend = (1 - beta) * wuxing + beta * tengods;

  const modFavor = modifiers?.favorableElements || 1.0;
  const modInter = modifiers?.interactions || 1.0;
  const modCombined = modifiers?.combined || 1.0;
  const adjusted = result.bazi / 100;

  return {
    rawBlend: {
      label: 'Raw BaZi Blend',
      formula: '(1-β)×WuXing + β×TenGods',
      substitution: `(1-${beta})×${wuxing.toFixed(3)} + ${beta}×${tengods.toFixed(3)}`,
      result: rawBlend,
      unit: '0-1'
    },
    favorableModifier: {
      label: 'Favorable Elements Modifier',
      formula: 'clamp(m1 × m2, 0.90, 1.10)',
      result: modFavor,
      unit: 'multiplier',
      interpretation: modFavor > 1 ? 'Partners carry each other\'s favorable elements' :
                      modFavor < 1 ? 'Some unfavorable element overlap' :
                      'Neutral favorable elements alignment'
    },
    interactionsModifier: {
      label: 'Branch Interactions Modifier',
      formula: 'clamp(1 + 0.5×(indexA + indexB), 0.88, 1.12)',
      result: modInter,
      unit: 'multiplier',
      interpretation: modInter > 1 ? '六合/三合 harmonies present' :
                      modInter < 1 ? '冲/刑/害 tensions present' :
                      'Neutral branch interactions'
    },
    combinedModifier: {
      label: 'Combined Modifier',
      formula: 'clamp(modFavor × modInter, 0.85, 1.15)',
      substitution: `clamp(${modFavor.toFixed(3)} × ${modInter.toFixed(3)}, 0.85, 1.15)`,
      result: modCombined,
      unit: 'multiplier'
    },
    adjustedBlend: {
      label: 'Adjusted BaZi Score',
      formula: 'clamp(rawBlend × combinedModifier, 0, 1)',
      substitution: `clamp(${rawBlend.toFixed(3)} × ${modCombined.toFixed(3)}, 0, 1)`,
      result: adjusted,
      unit: '0-1'
    }
  };
}

function formatFusionMath(
  result: MatchScoreResult,
  alpha: number
): FusionMathExplain {
  const neo = (result.neo || 0) / 100;
  const bazi = (result.bazi || 0) / 100;
  const total = (result.total || 0) / 100;

  const neoContrib = neo * (1 - alpha);
  const baziContrib = bazi * alpha;

  return {
    neoContribution: {
      label: 'NEO Contribution',
      formula: '(1-α) × NEO',
      substitution: `(1-${alpha}) × ${neo.toFixed(3)}`,
      result: neoContrib,
      unit: '0-1',
      interpretation: `${Math.round(neoContrib * 100)}% from personality science`
    },
    baziContribution: {
      label: 'BaZi Contribution',
      formula: 'α × BaZi',
      substitution: `${alpha} × ${bazi.toFixed(3)}`,
      result: baziContrib,
      unit: '0-1',
      interpretation: `${Math.round(baziContrib * 100)}% from Chinese metaphysics`
    },
    totalFormula: {
      label: 'Total Compatibility',
      formula: 'clamp(neoContrib + baziContrib, 0, 1)',
      substitution: `clamp(${neoContrib.toFixed(3)} + ${baziContrib.toFixed(3)}, 0, 1)`,
      result: total,
      unit: '0-1',
      interpretation: `Final compatibility score: ${Math.round(total * 100)}%`
    }
  };
}

// =============================================================================
// L3: RESEARCHER/DEBUG DUMP
// =============================================================================

/**
 * Generate L3 debug dump
 * Raw vectors, intermediates, and data quality flags
 */
export function formatL3(
  result: MatchScoreResult,
  profileA: Profile,
  profileB: Profile,
  options?: ExplainOptions
): ExplainL3 {
  const alpha = result.debug?.alpha || 0.25;
  const beta = result.debug?.beta || 0.30;
  const neoDetails = result.debug?.neo_details;
  const modifiers = result.debug?.modifiers;

  // Check data sources
  const hasPostSeasonalA = !!profileA.bazi?.seasonalStrength?.percentages;
  const hasPostSeasonalB = !!profileB.bazi?.seasonalStrength?.percentages;
  const usingPostSeasonal = hasPostSeasonalA && hasPostSeasonalB;

  // Extract vectors
  const neoA = Array.isArray(profileA.neo30Facets) ? profileA.neo30Facets as number[] : [];
  const neoB = Array.isArray(profileB.neo30Facets) ? profileB.neo30Facets as number[] : [];

  // WuXing vectors (normalized would need helper)
  const wuxingA = extractWuXingVector(profileA);
  const wuxingB = extractWuXingVector(profileB);

  // Ten Gods vectors (would need helper)
  const tengods5A = extractTenGods5Vector(profileA);
  const tengods5B = extractTenGods5Vector(profileB);

  // Data quality check
  const missingFields: string[] = [];
  if (!profileA.bazi?.seasonalStrength) missingFields.push('profileA.seasonalStrength');
  if (!profileB.bazi?.seasonalStrength) missingFields.push('profileB.seasonalStrength');
  if (!profileA.bazi?.tenGodSummary) missingFields.push('profileA.tenGodSummary');
  if (!profileB.bazi?.tenGodSummary) missingFields.push('profileB.tenGodSummary');
  if (!profileA.bazi?.favorableElements) missingFields.push('profileA.favorableElements');
  if (!profileB.bazi?.favorableElements) missingFields.push('profileB.favorableElements');

  return {
    level: 'L3',
    version: 'cathedral.explain.v1',
    timestamp: new Date().toISOString(),
    inputs: {
      profileA_id: options?.profileA_id || profileA.id,
      profileB_id: options?.profileB_id || profileB.id,
      alpha,
      beta,
      usingPostSeasonal
    },
    vectors: {
      neoA,
      neoB,
      wuxingA,
      wuxingB,
      tengods5A,
      tengods5B
    },
    intermediates: {
      cosine: neoDetails?.cosine || 0,
      euclidean: neoDetails?.euclidean || 0,
      domainScores: neoDetails?.dimensionScores || { N: 0, E: 0, O: 0, A: 0, C: 0 },
      wuxingRaw: result.wuxing / 100,
      tengodsRaw: result.tengods / 100,
      baziRaw: result.debug?.bazi_raw || 0,
      modFavor: modifiers?.favorableElements || 1,
      modInter: modifiers?.interactions || 1,
      modCombined: modifiers?.combined || 1,
      baziAdjusted: result.debug?.bazi_adjusted || result.bazi / 100,
      neoContrib: (result.neo / 100) * (1 - alpha),
      baziContrib: (result.bazi / 100) * alpha
    },
    outputs: {
      total: result.total,
      level: result.level,
      neo: result.neo,
      bazi: result.bazi,
      wuxing: result.wuxing,
      tengods: result.tengods
    },
    dataQuality: {
      hasPostSeasonal: usingPostSeasonal,
      hasTenGodSummary: !!profileA.bazi?.tenGodSummary && !!profileB.bazi?.tenGodSummary,
      hasFavorableElements: !!profileA.bazi?.favorableElements || !!profileB.bazi?.favorableElements,
      hasInteractions: !!profileA.bazi?.interactions?.length || !!profileB.bazi?.interactions?.length,
      missingFields
    }
  };
}

function extractWuXingVector(profile: Profile): number[] {
  const pct = profile.bazi?.seasonalStrength?.percentages || profile.bazi?.elements?.percentages;
  if (!pct) return [0.2, 0.2, 0.2, 0.2, 0.2];

  const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const raw = elements.map(e => Math.max(0, Number(pct[e] || 0)));
  const sum = raw.reduce((a, b) => a + b, 0);
  return sum > 0 ? raw.map(x => x / sum) : [0.2, 0.2, 0.2, 0.2, 0.2];
}

function extractTenGods5Vector(profile: Profile): number[] {
  const summary = profile.bazi?.tenGodSummary;
  if (!summary) return [0.2, 0.2, 0.2, 0.2, 0.2];

  // Simplified 5-group extraction
  const groups = {
    Companion: (summary['Companion'] || 0) + (summary['Rob Wealth'] || 0),
    Output: (summary['Eating God'] || 0) + (summary['Hurting Officer'] || 0),
    Wealth: (summary['Direct Wealth'] || 0) + (summary['Indirect Wealth'] || 0),
    Power: (summary['Direct Officer'] || 0) + (summary['Seven Killings'] || 0),
    Resource: (summary['Direct Resource'] || 0) + (summary['Indirect Resource'] || 0)
  };

  const raw = [groups.Companion, groups.Output, groups.Wealth, groups.Power, groups.Resource];
  const sum = raw.reduce((a, b) => a + b, 0);
  return sum > 0 ? raw.map(x => x / sum) : [0.2, 0.2, 0.2, 0.2, 0.2];
}

// =============================================================================
// MAIN FORMATTER
// =============================================================================

/**
 * Generate complete MatchExplain contract
 *
 * @param result - MatchScoreResult from matchScore()
 * @param profileA - Profile A
 * @param profileB - Profile B
 * @param options - Which levels to include
 * @returns Complete MatchExplain envelope
 */
export function generateMatchExplain(
  result: MatchScoreResult,
  profileA: Profile,
  profileB: Profile,
  options: ExplainOptions = {}
): MatchExplain {
  const {
    includeL0 = true,
    includeL1 = true,
    includeL2 = false,
    includeL3 = false,
    profileA_id,
    profileB_id
  } = options;

  const alpha = result.debug?.alpha || 0.25;
  const beta = result.debug?.beta || 0.30;
  const usingPostSeasonal = !!(
    profileA.bazi?.seasonalStrength?.percentages &&
    profileB.bazi?.seasonalStrength?.percentages
  );

  return {
    version: 'cathedral.explain.v1',
    inputs: {
      profileA_id: profileA_id || profileA.id,
      profileB_id: profileB_id || profileB.id,
      alpha,
      beta,
      usingPostSeasonal
    },
    outputs: {
      total: result.total,
      level: result.level,
      neo: result.neo,
      bazi: result.bazi,
      wuxing: result.wuxing,
      tengods: result.tengods,
      modifiers: {
        favorableElements: result.debug?.modifiers?.favorableElements || 1,
        interactions: result.debug?.modifiers?.interactions || 1,
        combined: result.debug?.modifiers?.combined || 1
      }
    },
    explanations: {
      L0: includeL0 ? formatL0(result, profileA, profileB) : createEmptyL0(),
      L1: includeL1 ? formatL1(result, profileA, profileB) : createEmptyL1(),
      L2: includeL2 ? formatL2(result, profileA, profileB) : createEmptyL2(),
      L3: includeL3 ? formatL3(result, profileA, profileB, options) : createEmptyL3()
    }
  };
}

// Empty level creators for when levels are not requested
function createEmptyL0(): ExplainL0 {
  return { level: 'L0', summary: '', badge: '', score: 0, compatibility: 'Moderate' };
}

function createEmptyL1(): ExplainL1 {
  return {
    level: 'L1',
    title: '',
    overview: '',
    factors: [],
    strengths: [],
    growthAreas: [],
    cathedralVoice: { ground: '', validate: '', empower: '' }
  };
}

function createEmptyL2(): ExplainL2 {
  return {
    level: 'L2',
    masterFormula: { latex: '', plainText: '', description: '' },
    neo: {} as NeoMathExplain,
    wuxing: {} as WuXingMathExplain,
    tengods: {} as TenGodsMathExplain,
    bazi: {} as BaziMathExplain,
    fusion: {} as FusionMathExplain,
    coefficients: { alpha: 0, beta: 0, domainWeights: {} }
  };
}

function createEmptyL3(): ExplainL3 {
  return {
    level: 'L3',
    version: '',
    timestamp: '',
    inputs: { alpha: 0, beta: 0, usingPostSeasonal: false },
    vectors: { neoA: [], neoB: [], wuxingA: [], wuxingB: [], tengods5A: [], tengods5B: [] },
    intermediates: {
      cosine: 0, euclidean: 0, domainScores: { N: 0, E: 0, O: 0, A: 0, C: 0 },
      wuxingRaw: 0, tengodsRaw: 0, baziRaw: 0, modFavor: 0, modInter: 0,
      modCombined: 0, baziAdjusted: 0, neoContrib: 0, baziContrib: 0
    },
    outputs: { total: 0, level: 'Moderate', neo: 0, bazi: 0, wuxing: 0, tengods: 0 },
    dataQuality: {
      hasPostSeasonal: false, hasTenGodSummary: false,
      hasFavorableElements: false, hasInteractions: false, missingFields: []
    }
  };
}

/**
 * Get explanation at a specific level
 */
export function getExplanationAtLevel<L extends 'L0' | 'L1' | 'L2' | 'L3'>(
  explain: MatchExplain,
  level: L
): typeof explain.explanations[L] {
  return explain.explanations[level];
}
