/**
 * ============================================================================
 * BAZI DAY MASTER POLARITY & ROOTEDNESS UTILITY
 * ============================================================================
 *
 * Combines Yin/Yang profile and stem-branch rootedness analysis into
 * a single convenient utility for UI consumption.
 *
 * This utility is designed for the DayMasterCard and similar components
 * that need quick access to both polarity and rootedness data.
 *
 * Created: January 2026
 * Based on: baziYinYang.ts and baziStemBranchRelations.ts
 * ============================================================================
 */

import {
  computeYinYangProfile,
  computeDmYinYangModifier,
  YinYangProfile,
  YinYangModifier,
  FourPillars
} from './baziYinYang';

import {
  computeChartStemBranchRelations,
  ChartStemBranchAnalysis,
  FourPillars as SBFourPillars
} from './baziStemBranchRelations';

// ============================================================================
// TYPES
// ============================================================================

export interface DmPolarityRootednessResult {
  // Yin/Yang data
  yinYangProfile: YinYangProfile;
  polarity: YinYangModifier;

  // Stem-branch data
  stemBranch: ChartStemBranchAnalysis;

  // Normalized scores for UI
  rootednessRaw: number;           // Raw rootedness score
  rootednessNormalized: number;    // 0-1 scale for UI meters

  // Yin/Yang ratios for UI
  yinRatio: number;                // 0-1
  yangRatio: number;               // 0-1
  dominant: 'yin' | 'yang' | 'balanced';

  // Labels for display
  polarityLabel: string;
  rootednessLabel: string;

  // Combined explanation
  explanation: string;
}

// ============================================================================
// CORE FUNCTION
// ============================================================================

/**
 * Compute Day Master polarity and rootedness for UI display
 *
 * @param pillars - Four Pillars with stem and branch for each
 * @returns DmPolarityRootednessResult with all computed data
 */
export function computeDmPolarityAndRootedness(
  pillars: FourPillars
): DmPolarityRootednessResult {
  // Compute Yin/Yang profile
  const yinYangProfile = computeYinYangProfile(pillars);
  const polarity = computeDmYinYangModifier(yinYangProfile);

  // Compute stem-branch rootedness
  const stemBranch = computeChartStemBranchRelations(pillars as SBFourPillars);

  // Get raw rootedness score
  const rootednessRaw = stemBranch.overallRootedness;

  // Normalize rootedness to 0-1 for UI (it's already 0-1, but we ensure clamping)
  const rootednessNormalized = Math.max(0, Math.min(1, rootednessRaw));

  // Get Yin/Yang ratios
  const yinRatio = yinYangProfile.weightedYin;
  const yangRatio = yinYangProfile.weightedYang;

  // Determine dominant polarity
  let dominant: 'yin' | 'yang' | 'balanced';
  if (yinYangProfile.balance === 'balanced') {
    dominant = 'balanced';
  } else if (yangRatio > yinRatio) {
    dominant = 'yang';
  } else {
    dominant = 'yin';
  }

  // Generate labels
  const polarityLabel = getPolarityLabel(yinYangProfile.balance, yinYangProfile.dmPolarity);
  const rootednessLabel = getRootednessLabel(rootednessNormalized);

  // Generate combined explanation
  const explanation = generateCombinedExplanation(
    yinYangProfile,
    polarity,
    stemBranch,
    rootednessNormalized
  );

  return {
    yinYangProfile,
    polarity,
    stemBranch,
    rootednessRaw,
    rootednessNormalized,
    yinRatio,
    yangRatio,
    dominant,
    polarityLabel,
    rootednessLabel,
    explanation
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getPolarityLabel(
  balance: YinYangProfile['balance'],
  dmPolarity: 'yang' | 'yin'
): string {
  const balanceLabels: Record<string, string> = {
    very_yang: 'Strongly Yang',
    yang: 'Yang-Leaning',
    balanced: 'Balanced',
    yin: 'Yin-Leaning',
    very_yin: 'Strongly Yin'
  };

  const dmLabel = dmPolarity === 'yang' ? 'Yang DM' : 'Yin DM';
  return `${balanceLabels[balance]} (${dmLabel})`;
}

function getRootednessLabel(normalized: number): string {
  if (normalized >= 0.75) return 'Strongly Rooted';
  if (normalized >= 0.55) return 'Well Rooted';
  if (normalized >= 0.35) return 'Moderately Rooted';
  if (normalized >= 0.15) return 'Lightly Rooted';
  return 'Uprooted';
}

function generateCombinedExplanation(
  profile: YinYangProfile,
  polarity: YinYangModifier,
  stemBranch: ChartStemBranchAnalysis,
  rootedness: number
): string {
  let explanation = '';

  // Polarity summary
  const yinPct = (profile.weightedYin * 100).toFixed(0);
  const yangPct = (profile.weightedYang * 100).toFixed(0);
  explanation += `Your chart is ${yangPct}% Yang and ${yinPct}% Yin. `;

  // DM alignment
  if (profile.dmPolarityMatch) {
    explanation += `Your ${profile.dmPolarity === 'yang' ? 'Yang' : 'Yin'} Day Master `;
    explanation += `aligns with the chart's energy, creating natural flow. `;
  } else {
    explanation += `Your ${profile.dmPolarity === 'yang' ? 'Yang' : 'Yin'} Day Master `;
    explanation += `works against the chart's dominant polarity, creating dynamic tension. `;
  }

  // Rootedness summary
  explanation += `\n\nRootedness: ${(rootedness * 100).toFixed(0)}%. `;

  if (stemBranch.dmHasStrongRoot) {
    explanation += `Your Day Master has strong roots in its branch, `;
    explanation += `providing a stable foundation for self-expression.`;
  } else if (stemBranch.dayMasterRelation.hasRoot) {
    explanation += `Your Day Master has moderate roots, `;
    explanation += `offering reasonable support for your core nature.`;
  } else {
    explanation += `Your Day Master lacks roots in its branch, `;
    explanation += `so you draw strength from other pillars or luck cycles.`;
  }

  return explanation;
}

// ============================================================================
// QUICK ACCESS FUNCTIONS
// ============================================================================

/**
 * Quick function to get just the polarity data
 */
export function getYinYangData(pillars: FourPillars) {
  const profile = computeYinYangProfile(pillars);
  return {
    yinPercent: profile.yinPercent,
    yangPercent: profile.yangPercent,
    balance: profile.balance,
    dmPolarity: profile.dmPolarity
  };
}

/**
 * Quick function to get just the rootedness data
 */
export function getRootednessData(pillars: FourPillars) {
  const stemBranch = computeChartStemBranchRelations(pillars as SBFourPillars);
  return {
    overall: stemBranch.overallRootedness,
    dmHasStrongRoot: stemBranch.dmHasStrongRoot,
    rootedPillars: stemBranch.rootedPillarCount
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeDmPolarityAndRootedness,
  getYinYangData,
  getRootednessData
};
