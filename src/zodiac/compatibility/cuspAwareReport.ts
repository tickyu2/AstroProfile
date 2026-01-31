/**
 * Cusp-Aware Compatibility Report
 *
 * The complete cusp-aware compatibility system that:
 * 1. Converts birth dates to cusp-aware sign blends (φ-curve)
 * 2. Builds weighted 9-cell synastry matrices
 * 3. Generates comprehensive compatibility reports
 *
 * This gives "seasonality its true flavor" by honoring the
 * gradual transition between signs rather than hard boundaries.
 *
 * GENESIS AstroProfile - January 2025
 */

import type {
  ZodiacSign,
  TriadKey,
  RelationshipLens,
  SynastryCellKey,
  Season,
} from './types';
import type { SignBlend, CuspAwareTriad } from './signBlendFromDate';
import {
  getSignBlendFromDate,
  createCuspAwareTriad,
  formatSignBlend,
  isCuspBlend,
  getPrimarySign,
  getCuspDisplayInfo,
} from './signBlendFromDate';
import {
  buildCuspAwareSynastryCell,
  analyzeCuspInfluence,
  getCuspCellSummary,
  type CuspAwareSynastryCell,
  type CuspInfluenceAnalysis,
} from './buildWeightedCell';
import { LENSES, getLensDisplayName, getLensEmoji } from './lenses';
import { getSeason } from './signMeta';
import { getCuspDescription, getCuspDisplayName } from './seasonalWeight';

// =============================================================================
// CUSP-AWARE TRIAD INPUT
// =============================================================================

/**
 * Input for a person in cusp-aware compatibility
 */
export interface CuspAwarePersonInput {
  name: string;
  sunDate: Date;           // Birth date for Sun sign blend
  moonSign: ZodiacSign;    // Pre-calculated Moon sign
  risingSign: ZodiacSign;  // Pre-calculated Rising sign
  moonCuspDays?: number;   // Optional: days from Moon sign ingress
  risingCuspDegrees?: number; // Optional: degrees into Rising sign
}

/**
 * Full cusp-aware person profile
 */
export interface CuspAwarePerson {
  name: string;
  triad: CuspAwareTriad;
  hasCusps: {
    Sun: boolean;
    Moon: boolean;
    Rising: boolean;
  };
  displayStrings: {
    Sun: string;
    Moon: string;
    Rising: string;
  };
}

// =============================================================================
// CUSP-AWARE MATRIX
// =============================================================================

/**
 * The full 9-cell cusp-aware synastry matrix
 */
export interface CuspAwareMatrix {
  cells: Record<SynastryCellKey, CuspAwareSynastryCell>;
  totalCuspInfluence: number;  // % of cells affected by cusps
  averageScore: number;        // Average of all 9 cells (0-10)
}

/**
 * Build the complete cusp-aware 9-cell matrix
 */
export function buildCuspAwareMatrix(
  personA: CuspAwarePerson,
  personB: CuspAwarePerson,
  lens: RelationshipLens
): CuspAwareMatrix {
  const triadKeys: TriadKey[] = ['Sun', 'Moon', 'Rising'];
  const cells: Partial<Record<SynastryCellKey, CuspAwareSynastryCell>> = {};
  let cuspInfluencedCount = 0;
  let totalScore = 0;

  // Build all 9 cells
  for (const aPoint of triadKeys) {
    for (const bPoint of triadKeys) {
      const key = `${aPoint}-${bPoint}` as SynastryCellKey;

      const cell = buildCuspAwareSynastryCell(
        key,
        aPoint,
        personA.triad[aPoint],
        bPoint,
        personB.triad[bPoint],
        lens
      );

      cells[key] = cell;
      totalScore += cell.finalScore10;

      if (cell.isCuspInfluenced) {
        cuspInfluencedCount++;
      }
    }
  }

  return {
    cells: cells as Record<SynastryCellKey, CuspAwareSynastryCell>,
    totalCuspInfluence: Math.round((cuspInfluencedCount / 9) * 100),
    averageScore: Math.round((totalScore / 9) * 10) / 10,
  };
}

// =============================================================================
// CUSP-AWARE COMPATIBILITY REPORT
// =============================================================================

/**
 * Complete cusp-aware compatibility report
 */
export interface CuspAwareCompatibilityReport {
  personA: CuspAwarePerson;
  personB: CuspAwarePerson;
  lens: RelationshipLens;
  lensName: string;
  lensEmoji: string;

  matrix: CuspAwareMatrix;
  weightedScore: number;      // Lens-weighted final score (0-100)

  // Analysis
  cuspAnalysis: {
    totalCuspInfluence: number;
    personACusps: string[];
    personBCusps: string[];
    cuspInteractionInsight: string;
  };

  seasonalAnalysis: {
    aSeason: Season;
    bSeason: Season;
    seasonalDynamic: string;
  };

  // Top insights
  strengths: string[];
  challenges: string[];
  cuspBonuses: string[];

  // Summary
  overallVerdict: string;
  compatibilityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
}

/**
 * Build a complete cusp-aware compatibility report
 */
export function buildCuspAwareCompatibilityReport(
  inputA: CuspAwarePersonInput,
  inputB: CuspAwarePersonInput,
  lens: RelationshipLens = 'romantic'
): CuspAwareCompatibilityReport {
  // Create cusp-aware profiles
  const personA = createCuspAwarePerson(inputA);
  const personB = createCuspAwarePerson(inputB);

  // Build matrix
  const matrix = buildCuspAwareMatrix(personA, personB, lens);

  // Calculate lens-weighted score
  const weightedScore = calculateLensWeightedScore(matrix, lens);

  // Analyze cusps
  const cuspAnalysis = analyzeCuspsInRelationship(personA, personB, matrix);

  // Analyze seasons
  const seasonalAnalysis = analyzeSeasonalDynamic(personA, personB);

  // Generate insights
  const { strengths, challenges, cuspBonuses } = generateInsights(
    matrix,
    personA,
    personB,
    lens
  );

  // Generate verdict and grade
  const { verdict, grade } = generateVerdict(weightedScore, cuspAnalysis, lens);

  return {
    personA,
    personB,
    lens,
    lensName: getLensDisplayName(lens),
    lensEmoji: getLensEmoji(lens),
    matrix,
    weightedScore,
    cuspAnalysis,
    seasonalAnalysis,
    strengths,
    challenges,
    cuspBonuses,
    overallVerdict: verdict,
    compatibilityGrade: grade,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a cusp-aware person from input
 */
function createCuspAwarePerson(input: CuspAwarePersonInput): CuspAwarePerson {
  const triad = createCuspAwareTriad(
    input.sunDate,
    input.moonSign,
    input.risingSign,
    input.moonCuspDays,
    input.risingCuspDegrees
  );

  return {
    name: input.name,
    triad,
    hasCusps: {
      Sun: isCuspBlend(triad.Sun),
      Moon: isCuspBlend(triad.Moon),
      Rising: isCuspBlend(triad.Rising),
    },
    displayStrings: {
      Sun: formatSignBlend(triad.Sun),
      Moon: formatSignBlend(triad.Moon),
      Rising: formatSignBlend(triad.Rising),
    },
  };
}

/**
 * Calculate lens-weighted total score
 */
function calculateLensWeightedScore(
  matrix: CuspAwareMatrix,
  lens: RelationshipLens
): number {
  const cfg = LENSES[lens];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [key, cell] of Object.entries(matrix.cells)) {
    const cellKey = key as SynastryCellKey;
    const weight = cfg.cellWeights[cellKey];
    weightedSum += cell.finalScore10 * weight;
    totalWeight += weight;
  }

  return Math.round((weightedSum / totalWeight) * 10);
}

/**
 * Analyze cusp interactions in the relationship
 */
function analyzeCuspsInRelationship(
  personA: CuspAwarePerson,
  personB: CuspAwarePerson,
  matrix: CuspAwareMatrix
): CuspAwareCompatibilityReport['cuspAnalysis'] {
  const personACusps: string[] = [];
  const personBCusps: string[] = [];

  // Identify Person A's cusps
  if (personA.hasCusps.Sun) {
    const info = getCuspDisplayInfo(personA.triad.Sun);
    if (info.secondary) {
      personACusps.push(`Sun: ${info.primary}-${info.secondary} cusp`);
    }
  }
  if (personA.hasCusps.Moon) {
    const info = getCuspDisplayInfo(personA.triad.Moon);
    if (info.secondary) {
      personACusps.push(`Moon: ${info.primary}-${info.secondary} cusp`);
    }
  }
  if (personA.hasCusps.Rising) {
    const info = getCuspDisplayInfo(personA.triad.Rising);
    if (info.secondary) {
      personACusps.push(`Rising: ${info.primary}-${info.secondary} cusp`);
    }
  }

  // Identify Person B's cusps
  if (personB.hasCusps.Sun) {
    const info = getCuspDisplayInfo(personB.triad.Sun);
    if (info.secondary) {
      personBCusps.push(`Sun: ${info.primary}-${info.secondary} cusp`);
    }
  }
  if (personB.hasCusps.Moon) {
    const info = getCuspDisplayInfo(personB.triad.Moon);
    if (info.secondary) {
      personBCusps.push(`Moon: ${info.primary}-${info.secondary} cusp`);
    }
  }
  if (personB.hasCusps.Rising) {
    const info = getCuspDisplayInfo(personB.triad.Rising);
    if (info.secondary) {
      personBCusps.push(`Rising: ${info.primary}-${info.secondary} cusp`);
    }
  }

  // Generate cusp interaction insight
  let cuspInteractionInsight: string;

  if (personACusps.length === 0 && personBCusps.length === 0) {
    cuspInteractionInsight = 'Neither person is on a cusp — compatibility is based on pure sign energies.';
  } else if (personACusps.length > 0 && personBCusps.length > 0) {
    cuspInteractionInsight = `Both have cusp influences, creating a dynamic interplay of sign energies. ` +
      `This adds complexity and nuance to the relationship.`;
  } else {
    const cuspPerson = personACusps.length > 0 ? personA.name : personB.name;
    cuspInteractionInsight = `${cuspPerson} brings cusp energy to the relationship, ` +
      `adding flexibility and bridging qualities between adjacent sign archetypes.`;
  }

  return {
    totalCuspInfluence: matrix.totalCuspInfluence,
    personACusps,
    personBCusps,
    cuspInteractionInsight,
  };
}

/**
 * Analyze seasonal dynamic between two people
 */
function analyzeSeasonalDynamic(
  personA: CuspAwarePerson,
  personB: CuspAwarePerson
): CuspAwareCompatibilityReport['seasonalAnalysis'] {
  const aSunSign = getPrimarySign(personA.triad.Sun);
  const bSunSign = getPrimarySign(personB.triad.Sun);

  const aSeason = getSeason(aSunSign);
  const bSeason = getSeason(bSunSign);

  let seasonalDynamic: string;

  if (aSeason === bSeason) {
    seasonalDynamic = `Both share ${aSeason} energy — natural timing alignment and shared rhythms.`;
  } else {
    const opposites: Record<Season, Season> = {
      Spring: 'Autumn',
      Summer: 'Winter',
      Autumn: 'Spring',
      Winter: 'Summer',
    };

    if (opposites[aSeason] === bSeason) {
      seasonalDynamic = `${aSeason} and ${bSeason} are opposite seasons — ` +
        `powerful completion potential with natural leadership rotation.`;
    } else {
      seasonalDynamic = `${aSeason} flows into ${bSeason} — ` +
        `adjacent seasonal energy creates natural progression and growth.`;
    }
  }

  return {
    aSeason,
    bSeason,
    seasonalDynamic,
  };
}

/**
 * Generate strengths, challenges, and cusp bonuses
 */
function generateInsights(
  matrix: CuspAwareMatrix,
  personA: CuspAwarePerson,
  personB: CuspAwarePerson,
  lens: RelationshipLens
): { strengths: string[]; challenges: string[]; cuspBonuses: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const cuspBonuses: string[] = [];

  // Analyze each cell
  for (const [key, cell] of Object.entries(matrix.cells)) {
    const cellKey = key as SynastryCellKey;

    // Identify strengths (score >= 7)
    if (cell.finalScore10 >= 7) {
      const summary = getCuspCellSummary(cell);
      strengths.push(`${cellKey}: Strong connection (${cell.finalScore10}/10) — ${summary}`);
    }

    // Identify challenges (score <= 5)
    if (cell.finalScore10 <= 5) {
      const summary = getCuspCellSummary(cell);
      challenges.push(`${cellKey}: Growth area (${cell.finalScore10}/10) — ${summary}`);
    }

    // Identify cusp bonuses
    if (cell.isCuspInfluenced) {
      const influence = analyzeCuspInfluence(cell);
      if (influence.influenceDirection === 'positive' && influence.influencePercent >= 5) {
        cuspBonuses.push(
          `${cellKey}: Cusp energy adds +${influence.scoreDifference.toFixed(1)} points`
        );
      }
    }
  }

  // Add lens-specific insights
  if (lens === 'romantic') {
    const sunMoonCell = matrix.cells['Sun-Moon'];
    const moonSunCell = matrix.cells['Moon-Sun'];
    if (sunMoonCell.finalScore10 >= 7 && moonSunCell.finalScore10 >= 7) {
      strengths.push('Strong mutual heart connection — values touch emotions in both directions');
    }
  }

  if (lens === 'coworker') {
    const sunSunCell = matrix.cells['Sun-Sun'];
    const risingRisingCell = matrix.cells['Rising-Rising'];
    if (sunSunCell.finalScore10 >= 7 && risingRisingCell.finalScore10 >= 7) {
      strengths.push('Excellent professional alignment — shared mission and complementary styles');
    }
  }

  return { strengths, challenges, cuspBonuses };
}

/**
 * Generate verdict and grade
 */
function generateVerdict(
  score: number,
  cuspAnalysis: CuspAwareCompatibilityReport['cuspAnalysis'],
  lens: RelationshipLens
): { verdict: string; grade: CuspAwareCompatibilityReport['compatibilityGrade'] } {
  let grade: CuspAwareCompatibilityReport['compatibilityGrade'];
  let verdict: string;

  if (score >= 85) {
    grade = 'A+';
    verdict = `Exceptional ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Natural harmony across all dimensions.`;
  } else if (score >= 75) {
    grade = 'A';
    verdict = `Strong ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Most areas flow naturally with minor growth opportunities.`;
  } else if (score >= 65) {
    grade = 'B+';
    verdict = `Good ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Solid foundation with some areas requiring conscious effort.`;
  } else if (score >= 55) {
    grade = 'B';
    verdict = `Moderate ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Workable with mutual understanding and communication.`;
  } else if (score >= 45) {
    grade = 'C+';
    verdict = `Mixed ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Growth-oriented relationship requiring ongoing attention.`;
  } else if (score >= 35) {
    grade = 'C';
    verdict = `Challenging ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Significant differences create friction but also potential for transformation.`;
  } else if (score >= 25) {
    grade = 'D';
    verdict = `Difficult ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Major differences require exceptional effort to bridge.`;
  } else {
    grade = 'F';
    verdict = `Low ${getLensDisplayName(lens).toLowerCase()} compatibility. ` +
      `Fundamental misalignment suggests better connections elsewhere.`;
  }

  // Add cusp nuance if relevant
  if (cuspAnalysis.totalCuspInfluence >= 50) {
    verdict += ` The significant cusp influence adds flexibility and nuance to this dynamic.`;
  }

  return { verdict, grade };
}

// =============================================================================
// COMPARISON ACROSS LENSES
// =============================================================================

/**
 * Compare compatibility across all relationship lenses
 */
export interface LensComparisonResult {
  lens: RelationshipLens;
  lensName: string;
  score: number;
  grade: CuspAwareCompatibilityReport['compatibilityGrade'];
}

export function compareCuspAwareCompatibilityAcrossLenses(
  inputA: CuspAwarePersonInput,
  inputB: CuspAwarePersonInput
): LensComparisonResult[] {
  const lenses: RelationshipLens[] = ['romantic', 'best_friend', 'friend', 'coworker'];
  const results: LensComparisonResult[] = [];

  const personA = createCuspAwarePerson(inputA);
  const personB = createCuspAwarePerson(inputB);

  for (const lens of lenses) {
    const matrix = buildCuspAwareMatrix(personA, personB, lens);
    const score = calculateLensWeightedScore(matrix, lens);
    const { grade } = generateVerdict(score, { totalCuspInfluence: 0, personACusps: [], personBCusps: [], cuspInteractionInsight: '' }, lens);

    results.push({
      lens,
      lensName: getLensDisplayName(lens),
      score,
      grade,
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Get the best relationship lens for two people
 */
export function getBestLensForCuspAwareCompatibility(
  inputA: CuspAwarePersonInput,
  inputB: CuspAwarePersonInput
): LensComparisonResult {
  const comparison = compareCuspAwareCompatibilityAcrossLenses(inputA, inputB);
  return comparison[0];
}
