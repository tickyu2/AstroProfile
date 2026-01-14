/**
 * ============================================================================
 * BAZI DAY MASTER COMPOSITE STRENGTH ENGINE
 * ============================================================================
 *
 * Calculates the comprehensive Day Master strength by combining:
 * 1. Seasonality Adjustment (from baziDmSeasonality.ts)
 * 2. Yin/Yang Polarity Modifier (from baziYinYang.ts)
 * 3. Stem-Branch Rootedness (from baziStemBranchRelations.ts)
 * 4. Pillar Support (Resource + Companion elements)
 *
 * This produces a Joey-Yap-grade composite DM strength score that accounts
 * for all classical factors that determine how strong or weak a Day Master is.
 *
 * Classical Doctrine (身强/身弱):
 * A strong DM (身强) benefits from Wealth, Power, and Output elements
 * A weak DM (身弱) benefits from Resource and Companion elements
 * Knowing DM strength is essential for determining favorable elements (喜用神)
 *
 * Created: January 2026
 * Based on: Classical BaZi Day Master strength doctrine
 * ============================================================================
 */

import { Element } from './baziSeasonality';
import { computeSeasonalDMStrength, DMSeasonalityResult } from './baziDmSeasonality';
import {
  computeYinYangProfile,
  computeDmYinYangModifier,
  YinYangProfile,
  YinYangModifier,
  FourPillars as YYFourPillars
} from './baziYinYang';
import {
  computeChartStemBranchRelations,
  ChartStemBranchAnalysis,
  FourPillars as SBFourPillars,
  STEM_ELEMENT,
  GENERATED_BY
} from './baziStemBranchRelations';

// ============================================================================
// TYPES
// ============================================================================

export interface FourPillars {
  year: { stem: string; branch: string };
  month: { stem: string; branch: string };
  day: { stem: string; branch: string };
  hour: { stem: string; branch: string };
}

export interface PillarSupportAnalysis {
  resourceCount: number;      // Elements that generate DM
  companionCount: number;     // Same element as DM
  outputCount: number;        // Elements DM generates
  wealthCount: number;        // Elements DM controls
  powerCount: number;         // Elements that control DM
  supportScore: number;       // 0-1 score based on resource + companion
  drainScore: number;         // 0-1 score based on output + wealth + power
  netSupport: number;         // supportScore - drainScore (can be negative)
}

export interface CompositeStrengthResult {
  // Input pillars
  pillars: FourPillars;
  dmStem: string;
  dmElement: Element;

  // Component scores (all 0-1 scale or modifiers)
  seasonality: DMSeasonalityResult;
  yinYangProfile: YinYangProfile;
  yinYangModifier: YinYangModifier;
  stemBranchAnalysis: ChartStemBranchAnalysis;
  pillarSupport: PillarSupportAnalysis;

  // Composite calculation breakdown
  baseStrength: number;           // Starting point (0.5)
  seasonalAdjustment: number;     // +/- from seasonality
  yinYangAdjustment: number;      // +/- from Yin/Yang alignment
  rootednessAdjustment: number;   // +/- from stem-branch rootedness
  supportAdjustment: number;      // +/- from pillar support balance

  // Final scores
  compositeStrength: number;      // 0-1 final strength score
  strengthCategory: 'very_weak' | 'weak' | 'balanced' | 'strong' | 'very_strong';
  confidence: number;             // How confident we are in this assessment

  // Recommendations
  favorableElements: Element[];   // Elements that help this DM
  unfavorableElements: Element[]; // Elements that challenge this DM

  // Explanation
  explanation: string;
  debugBreakdown: string;
}

// ============================================================================
// WEIGHTS FOR COMPOSITE CALCULATION
// ============================================================================

/**
 * How much each factor contributes to final strength
 * Must sum to 1.0
 */
export const COMPOSITE_WEIGHTS = {
  seasonality: 0.30,       // Season is very important in classical BaZi
  yinYang: 0.10,           // Polarity alignment has moderate effect
  rootedness: 0.25,        // Stem-branch relations are crucial
  pillarSupport: 0.35      // Resource/Companion support is fundamental
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Compute comprehensive Day Master composite strength
 *
 * @param pillars - Four Pillars with stem and branch for each
 * @returns CompositeStrengthResult with full breakdown
 */
export function computeCompositeStrength(pillars: FourPillars): CompositeStrengthResult {
  const dmStem = pillars.day.stem;
  const dmElement = STEM_ELEMENT[dmStem] || 'wood';
  const monthBranch = pillars.month.branch;

  // ============================================
  // 1. SEASONALITY ANALYSIS
  // ============================================
  const seasonality = computeSeasonalDMStrength(dmStem, monthBranch, 0.5);

  // ============================================
  // 2. YIN/YANG ANALYSIS
  // ============================================
  const yinYangProfile = computeYinYangProfile(pillars as YYFourPillars);
  const yinYangModifier = computeDmYinYangModifier(yinYangProfile);

  // ============================================
  // 3. STEM-BRANCH ROOTEDNESS
  // ============================================
  const stemBranchAnalysis = computeChartStemBranchRelations(pillars as SBFourPillars);

  // ============================================
  // 4. PILLAR SUPPORT ANALYSIS
  // ============================================
  const pillarSupport = analyzePillarSupport(pillars, dmElement);

  // ============================================
  // COMPOSITE CALCULATION
  // ============================================

  // Base strength: 0.5 (neutral starting point)
  const baseStrength = 0.5;

  // Seasonal adjustment: Convert seasonal weight to adjustment
  // seasonalWeight 1.0 = +0.15, 0.2 = -0.12
  const seasonalAdjustment = (seasonality.seasonalWeight - 0.6) * 0.3;

  // Yin/Yang adjustment: Use the modifier
  // modifier 1.15 = +0.05, 0.85 = -0.05
  const yinYangAdjustment = (yinYangModifier.dmModifier - 1.0) * 0.33;

  // Rootedness adjustment: Convert overall rootedness to adjustment
  // rootedness 1.0 = +0.10, 0.0 = -0.05
  const rootednessAdjustment = (stemBranchAnalysis.overallRootedness - 0.3) * 0.15;

  // Support adjustment: Use net support directly
  // netSupport range is roughly -0.5 to +0.5, scale to ±0.15
  const supportAdjustment = pillarSupport.netSupport * 0.3;

  // Apply weights and combine
  const weightedSeasonal = seasonalAdjustment * COMPOSITE_WEIGHTS.seasonality;
  const weightedYinYang = yinYangAdjustment * COMPOSITE_WEIGHTS.yinYang;
  const weightedRootedness = rootednessAdjustment * COMPOSITE_WEIGHTS.rootedness;
  const weightedSupport = supportAdjustment * COMPOSITE_WEIGHTS.pillarSupport;

  // Final composite strength
  let compositeStrength = baseStrength + weightedSeasonal + weightedYinYang + weightedRootedness + weightedSupport;

  // Clamp to 0-1
  compositeStrength = Math.max(0, Math.min(1, compositeStrength));

  // ============================================
  // CATEGORIZE AND RECOMMEND
  // ============================================

  const strengthCategory = getStrengthCategory(compositeStrength);
  const { favorable, unfavorable } = determineFavorableElements(dmElement, strengthCategory);

  // Confidence based on data quality
  const confidence = calculateConfidence(stemBranchAnalysis, pillarSupport);

  // ============================================
  // GENERATE EXPLANATIONS
  // ============================================

  const explanation = generateExplanation(
    dmStem,
    dmElement,
    compositeStrength,
    strengthCategory,
    favorable
  );

  const debugBreakdown = generateDebugBreakdown(
    baseStrength,
    seasonalAdjustment,
    yinYangAdjustment,
    rootednessAdjustment,
    supportAdjustment,
    weightedSeasonal,
    weightedYinYang,
    weightedRootedness,
    weightedSupport,
    compositeStrength
  );

  return {
    pillars,
    dmStem,
    dmElement,

    seasonality,
    yinYangProfile,
    yinYangModifier,
    stemBranchAnalysis,
    pillarSupport,

    baseStrength,
    seasonalAdjustment,
    yinYangAdjustment,
    rootednessAdjustment,
    supportAdjustment,

    compositeStrength,
    strengthCategory,
    confidence,

    favorableElements: favorable,
    unfavorableElements: unfavorable,

    explanation,
    debugBreakdown
  };
}

// ============================================================================
// PILLAR SUPPORT ANALYSIS
// ============================================================================

/**
 * Analyze how much support vs. drain the DM receives from other pillars
 */
function analyzePillarSupport(pillars: FourPillars, dmElement: Element): PillarSupportAnalysis {
  let resourceCount = 0;
  let companionCount = 0;
  let outputCount = 0;
  let wealthCount = 0;
  let powerCount = 0;

  const resourceElement = GENERATED_BY[dmElement];       // What generates DM
  const outputElement = getGenerates(dmElement);         // What DM generates
  const wealthElement = getControls(dmElement);          // What DM controls
  const powerElement = getControlledBy(dmElement);       // What controls DM

  // Check all 8 characters (4 stems + 4 branches get checked for hidden stems)
  const pillarKeys = ['year', 'month', 'day', 'hour'] as const;

  pillarKeys.forEach(key => {
    const pillar = pillars[key];
    const stemElement = STEM_ELEMENT[pillar.stem];

    // Don't count Day Stem (that's the DM itself)
    if (key !== 'day') {
      if (stemElement === dmElement) companionCount++;
      else if (stemElement === resourceElement) resourceCount++;
      else if (stemElement === outputElement) outputCount++;
      else if (stemElement === wealthElement) wealthCount++;
      else if (stemElement === powerElement) powerCount++;
    }

    // Branch hidden stems also contribute (with reduced weight)
    const hiddenStems = getBranchHiddenElements(pillar.branch);
    hiddenStems.forEach((el, idx) => {
      const hiddenWeight = idx === 0 ? 0.7 : (idx === 1 ? 0.4 : 0.2);

      if (el === dmElement) companionCount += hiddenWeight;
      else if (el === resourceElement) resourceCount += hiddenWeight;
      else if (el === outputElement) outputCount += hiddenWeight;
      else if (el === wealthElement) wealthCount += hiddenWeight;
      else if (el === powerElement) powerCount += hiddenWeight;
    });
  });

  // Calculate scores
  const supportScore = Math.min(1, (resourceCount * 0.2 + companionCount * 0.15));
  const drainScore = Math.min(1, (outputCount * 0.1 + wealthCount * 0.12 + powerCount * 0.15));
  const netSupport = supportScore - drainScore;

  return {
    resourceCount: Math.round(resourceCount * 10) / 10,
    companionCount: Math.round(companionCount * 10) / 10,
    outputCount: Math.round(outputCount * 10) / 10,
    wealthCount: Math.round(wealthCount * 10) / 10,
    powerCount: Math.round(powerCount * 10) / 10,
    supportScore,
    drainScore,
    netSupport
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getStrengthCategory(strength: number): CompositeStrengthResult['strengthCategory'] {
  if (strength < 0.30) return 'very_weak';
  if (strength < 0.45) return 'weak';
  if (strength < 0.55) return 'balanced';
  if (strength < 0.70) return 'strong';
  return 'very_strong';
}

function determineFavorableElements(
  dmElement: Element,
  strengthCategory: string
): { favorable: Element[]; unfavorable: Element[] } {
  const resourceElement = GENERATED_BY[dmElement];
  const outputElement = getGenerates(dmElement);
  const wealthElement = getControls(dmElement);
  const powerElement = getControlledBy(dmElement);

  if (strengthCategory === 'very_weak' || strengthCategory === 'weak') {
    // Weak DM needs support
    return {
      favorable: [resourceElement, dmElement], // Resource + Companion
      unfavorable: [wealthElement, powerElement, outputElement]
    };
  } else if (strengthCategory === 'very_strong' || strengthCategory === 'strong') {
    // Strong DM needs to express/be drained
    return {
      favorable: [wealthElement, outputElement, powerElement],
      unfavorable: [resourceElement, dmElement] // Too much support overwhelms
    };
  } else {
    // Balanced - all elements okay, slight preference for balance
    return {
      favorable: [resourceElement, outputElement],
      unfavorable: []
    };
  }
}

function calculateConfidence(
  stemBranch: ChartStemBranchAnalysis,
  support: PillarSupportAnalysis
): number {
  // Higher confidence when we have clear signals
  let confidence = 0.7; // Base confidence

  // Strong rootedness increases confidence
  if (stemBranch.dmHasStrongRoot) confidence += 0.1;

  // Clear support/drain pattern increases confidence
  const supportClarity = Math.abs(support.netSupport);
  confidence += supportClarity * 0.15;

  return Math.min(0.95, confidence);
}

// Element cycle helpers
function getGenerates(element: Element): Element {
  const map: Record<Element, Element> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
  };
  return map[element];
}

function getControls(element: Element): Element {
  const map: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };
  return map[element];
}

function getControlledBy(element: Element): Element {
  const map: Record<Element, Element> = {
    wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth'
  };
  return map[element];
}

function getBranchHiddenElements(branch: string): Element[] {
  const BRANCH_HIDDEN: Record<string, string[]> = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '戊', '庚'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
  };

  const hiddenStems = BRANCH_HIDDEN[branch] || [];
  return hiddenStems.map(s => STEM_ELEMENT[s] || 'wood');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPLANATION GENERATORS
// ============================================================================

function generateExplanation(
  dmStem: string,
  dmElement: Element,
  compositeStrength: number,
  strengthCategory: string,
  favorable: Element[]
): string {
  let explanation = `Day Master Analysis: ${dmStem} (${capitalize(dmElement)})\n`;
  explanation += `${'='.repeat(40)}\n\n`;

  explanation += `Composite Strength: ${(compositeStrength * 100).toFixed(0)}%\n`;
  explanation += `Category: ${strengthCategory.replace('_', ' ').toUpperCase()}\n\n`;

  const categoryMessages: Record<string, string> = {
    very_weak: `Your Day Master is very weak and needs significant support. Focus on activities and environments that provide nourishment (${favorable.map(capitalize).join(', ')} elements).`,
    weak: `Your Day Master leans weak and benefits from supportive elements. ${capitalize(favorable[0])} and ${capitalize(favorable[1])} energies help you thrive.`,
    balanced: `Your Day Master is well-balanced. You can handle both supportive and challenging elements effectively.`,
    strong: `Your Day Master is strong and can handle pressure well. You benefit from expression outlets (${favorable.map(capitalize).join(', ')} elements).`,
    very_strong: `Your Day Master is very strong - almost too robust. You actually benefit from being "drained" by Wealth, Output, and Power elements.`
  };

  explanation += categoryMessages[strengthCategory] + '\n\n';

  explanation += `Favorable Elements: ${favorable.map(capitalize).join(', ')}\n`;

  return explanation;
}

function generateDebugBreakdown(
  baseStrength: number,
  seasonalAdj: number,
  yinYangAdj: number,
  rootednessAdj: number,
  supportAdj: number,
  weightedSeasonal: number,
  weightedYinYang: number,
  weightedRootedness: number,
  weightedSupport: number,
  final: number
): string {
  const fmt = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(3);

  let debug = `COMPOSITE STRENGTH DEBUG\n`;
  debug += `${'─'.repeat(40)}\n\n`;

  debug += `Base Strength:      ${baseStrength.toFixed(3)}\n\n`;

  debug += `Raw Adjustments:\n`;
  debug += `  Seasonality:      ${fmt(seasonalAdj)}\n`;
  debug += `  Yin/Yang:         ${fmt(yinYangAdj)}\n`;
  debug += `  Rootedness:       ${fmt(rootednessAdj)}\n`;
  debug += `  Pillar Support:   ${fmt(supportAdj)}\n\n`;

  debug += `Weighted Adjustments (after applying weights):\n`;
  debug += `  Seasonality (×${COMPOSITE_WEIGHTS.seasonality}):     ${fmt(weightedSeasonal)}\n`;
  debug += `  Yin/Yang (×${COMPOSITE_WEIGHTS.yinYang}):        ${fmt(weightedYinYang)}\n`;
  debug += `  Rootedness (×${COMPOSITE_WEIGHTS.rootedness}):     ${fmt(weightedRootedness)}\n`;
  debug += `  Support (×${COMPOSITE_WEIGHTS.pillarSupport}):       ${fmt(weightedSupport)}\n\n`;

  debug += `${'─'.repeat(40)}\n`;
  debug += `FINAL COMPOSITE:    ${final.toFixed(3)} (${(final * 100).toFixed(0)}%)\n`;

  return debug;
}

// ============================================================================
// QUICK ACCESS FUNCTIONS
// ============================================================================

/**
 * Quick function to get just the composite strength score
 */
export function getCompositeStrength(pillars: FourPillars): number {
  return computeCompositeStrength(pillars).compositeStrength;
}

/**
 * Quick function to get strength category
 */
export function getStrengthLabel(pillars: FourPillars): string {
  return computeCompositeStrength(pillars).strengthCategory;
}

/**
 * Quick function to get favorable elements
 */
export function getFavorableElements(pillars: FourPillars): Element[] {
  return computeCompositeStrength(pillars).favorableElements;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeCompositeStrength,
  getCompositeStrength,
  getStrengthLabel,
  getFavorableElements,
  COMPOSITE_WEIGHTS
};
