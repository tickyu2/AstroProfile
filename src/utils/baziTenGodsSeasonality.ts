/**
 * ============================================================================
 * BAZI TEN GODS SEASONALITY ENGINE
 * ============================================================================
 *
 * Computes how the season affects the Ten Gods (十神) profiles.
 *
 * The Ten Gods represent different life domains and relationships:
 * - Resource (印): Support, learning, nurturing (element that generates DM)
 * - Companion (比劫): Peers, competition, siblings (same element as DM)
 * - Output (食伤): Expression, creativity, children (element DM generates)
 * - Wealth (财): Money, father, spouse-for-men (element DM controls)
 * - Officer/Power (官杀): Career, authority, spouse-for-women (element that controls DM)
 *
 * The season affects each Ten God based on what element it represents.
 *
 * Created: January 2026
 * Based on: Classical BaZi Ten Gods doctrine
 * ============================================================================
 */

import { Element, getSeasonalWeights, SeasonalityResult } from './baziSeasonality';
import { computeYinYangProfile, computeDmYinYangModifier, FourPillars } from './baziYinYang';
import { computeChartStemBranchRelations, FourPillars as SBFourPillars } from './baziStemBranchRelations';

// ============================================================================
// TEN GODS TYPES
// ============================================================================

export type TenGodCategory = 'resource' | 'companion' | 'output' | 'wealth' | 'officer';

export interface TenGodSeasonalInfo {
  name: string;
  chineseName: string;
  category: TenGodCategory;
  element: Element;
  raw: number;
  weight: number;
  adjusted: number;
  delta: number;
  explanation: string;
}

export interface TenGodsSeasonalityResult {
  dmElement: Element;
  monthBranch: string;
  seasonType: string;
  tenGods: Record<TenGodCategory, TenGodSeasonalInfo>;
  explanations: Record<TenGodCategory, TenGodSeasonalInfo>;
  summary: string;
}

// ============================================================================
// ELEMENT RELATIONSHIPS
// ============================================================================

/**
 * Five Element Generation Cycle (生):
 * Wood → Fire → Earth → Metal → Water → Wood
 */
const GENERATION_CYCLE: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood'
};

/**
 * Five Element Control Cycle (克):
 * Wood → Earth → Water → Fire → Metal → Wood
 */
const CONTROL_CYCLE: Record<Element, Element> = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire'
};

/**
 * Get the element that generates this element (Resource)
 */
function getResourceElement(dm: Element): Element {
  const reverseGeneration: Record<Element, Element> = {
    wood: 'water',
    fire: 'wood',
    earth: 'fire',
    metal: 'earth',
    water: 'metal'
  };
  return reverseGeneration[dm];
}

/**
 * Get the element that controls this element (Officer)
 */
function getOfficerElement(dm: Element): Element {
  const reverseControl: Record<Element, Element> = {
    wood: 'metal',
    fire: 'water',
    earth: 'wood',
    metal: 'fire',
    water: 'earth'
  };
  return reverseControl[dm];
}

// ============================================================================
// TEN GODS METADATA
// ============================================================================

const TEN_GODS_META: Record<TenGodCategory, { name: string; chineseName: string; description: string }> = {
  resource: {
    name: 'Resource',
    chineseName: '印 (Yin)',
    description: 'Support, learning, nurturing, mother, mentors'
  },
  companion: {
    name: 'Companion',
    chineseName: '比劫 (Bi Jie)',
    description: 'Peers, competition, siblings, friends'
  },
  output: {
    name: 'Output',
    chineseName: '食伤 (Shi Shang)',
    description: 'Expression, creativity, children, talent'
  },
  wealth: {
    name: 'Wealth',
    chineseName: '财 (Cai)',
    description: 'Money, resources, father, spouse (for men)'
  },
  officer: {
    name: 'Officer/Power',
    chineseName: '官杀 (Guan Sha)',
    description: 'Career, authority, discipline, spouse (for women)'
  }
};

// ============================================================================
// CORE FUNCTION
// ============================================================================

/**
 * Compute how the season affects the Ten Gods profile.
 *
 * @param dmElement - Day Master element
 * @param monthBranch - Month Branch character
 * @param rawStrengths - Optional raw strengths for each Ten God (0-1 scale)
 * @returns TenGodsSeasonalityResult
 */
export function computeTenGodsSeasonality(
  dmElement: Element,
  monthBranch: string,
  rawStrengths?: Partial<Record<TenGodCategory, number>>
): TenGodsSeasonalityResult {
  const weights = getSeasonalWeights(monthBranch);

  // Determine the element for each Ten God based on DM element
  const tenGodElements: Record<TenGodCategory, Element> = {
    resource: getResourceElement(dmElement),
    companion: dmElement,
    output: GENERATION_CYCLE[dmElement],
    wealth: CONTROL_CYCLE[dmElement],
    officer: getOfficerElement(dmElement)
  };

  // Default raw strengths (balanced)
  const defaultRaw = 0.5;

  const tenGods: Record<TenGodCategory, TenGodSeasonalInfo> = {} as any;

  for (const category of Object.keys(TEN_GODS_META) as TenGodCategory[]) {
    const element = tenGodElements[category];
    const weight = weights[element];
    const raw = rawStrengths?.[category] ?? defaultRaw;
    const adjusted = raw * weight;
    const delta = adjusted - raw;

    const meta = TEN_GODS_META[category];

    tenGods[category] = {
      name: meta.name,
      chineseName: meta.chineseName,
      category,
      element,
      raw,
      weight,
      adjusted,
      delta,
      explanation: generateTenGodExplanation(
        meta.name,
        element,
        weight,
        raw,
        adjusted,
        delta
      )
    };
  }

  // Generate summary
  const summary = generateTenGodsSummary(tenGods, dmElement, monthBranch);

  return {
    dmElement,
    monthBranch,
    seasonType: getSeasonType(monthBranch),
    tenGods,
    explanations: tenGods,
    summary
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getSeasonType(monthBranch: string): string {
  const SEASON_TYPE_MAP: Record<string, string> = {
    '寅': 'spring', '卯': 'spring',
    '巳': 'summer', '午': 'summer',
    '申': 'autumn', '酉': 'autumn',
    '亥': 'winter', '子': 'winter',
    '辰': 'earth_transition', '未': 'earth_transition',
    '戌': 'earth_transition', '丑': 'earth_transition'
  };
  return SEASON_TYPE_MAP[monthBranch] || 'unknown';
}

function generateTenGodExplanation(
  name: string,
  element: Element,
  weight: number,
  raw: number,
  adjusted: number,
  delta: number
): string {
  const changeWord = delta > 0.05 ? 'strengthened' : delta < -0.05 ? 'weakened' : 'relatively unchanged';
  const direction = delta > 0 ? '+' : '';

  return `${name} (${capitalize(element)}) is ${changeWord} by the season. ` +
    `Seasonal weight: ×${weight.toFixed(2)}. ` +
    `Raw: ${(raw * 100).toFixed(0)}%, Adjusted: ${(adjusted * 100).toFixed(0)}% (${direction}${(delta * 100).toFixed(1)}%).`;
}

function generateTenGodsSummary(
  tenGods: Record<TenGodCategory, TenGodSeasonalInfo>,
  dmElement: Element,
  monthBranch: string
): string {
  // Find strongest and weakest
  const sorted = Object.values(tenGods).sort((a, b) => b.adjusted - a.adjusted);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  let summary = `With a ${capitalize(dmElement)} Day Master born in ${monthBranch} month:\n\n`;

  summary += `Strongest Ten God: ${strongest.name} (${capitalize(strongest.element)}) `;
  summary += `at ${(strongest.adjusted * 100).toFixed(0)}% adjusted strength.\n`;

  summary += `Weakest Ten God: ${weakest.name} (${capitalize(weakest.element)}) `;
  summary += `at ${(weakest.adjusted * 100).toFixed(0)}% adjusted strength.\n\n`;

  // Life domain implications
  summary += `Life Domain Implications:\n`;

  if (tenGods.wealth.weight > 0.7) {
    summary += `- Wealth opportunities are seasonally favored\n`;
  } else if (tenGods.wealth.weight < 0.4) {
    summary += `- Financial matters require extra conscious effort\n`;
  }

  if (tenGods.officer.weight > 0.7) {
    summary += `- Career and authority domains are seasonally supported\n`;
  } else if (tenGods.officer.weight < 0.4) {
    summary += `- Career advancement needs deliberate cultivation\n`;
  }

  if (tenGods.resource.weight > 0.7) {
    summary += `- Learning and mentorship come naturally\n`;
  }

  if (tenGods.output.weight > 0.7) {
    summary += `- Creative expression and communication are enhanced\n`;
  }

  return summary;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// ENHANCED TEN GODS SEASONALITY (with Yin/Yang + Rootedness)
// ============================================================================

export interface EnhancedTenGodInfo {
  name: string;
  chineseName: string;
  category: TenGodCategory;
  element: Element;
  raw: number;
  seasonalWeight: number;
  polarityModifier: number;
  rootednessModifier: number;
  final: number;
  explanation: string;
}

export interface EnhancedTenGodsResult {
  dmElement: Element;
  monthBranch: string;
  seasonType: string;
  tenGods: Record<TenGodCategory, EnhancedTenGodInfo>;
  // Global modifiers applied
  globalPolarityModifier: number;
  globalRootednessModifier: number;
  // Debug/explanation
  polarityExplanation: string;
  rootednessExplanation: string;
  summary: string;
}

/**
 * Enhanced Ten Gods Seasonality with Yin/Yang + Rootedness modifiers
 *
 * This function applies three layers of adjustment to each Ten God:
 * 1. Seasonality - Based on month branch
 * 2. Yin/Yang Polarity - Based on chart balance and DM alignment
 * 3. Stem-Branch Rootedness - Based on how well stems are supported
 *
 * @param opts - Options including pillars, raw strengths, and optional element distribution
 * @returns EnhancedTenGodsResult with full breakdown
 */
export function computeEnhancedTenGodsSeasonality(opts: {
  pillars: FourPillars;
  dmElement: Element;
  monthBranch: string;
  rawStrengths?: Partial<Record<TenGodCategory, number>>;
}): EnhancedTenGodsResult {
  const { pillars, dmElement, monthBranch, rawStrengths } = opts;

  // 1. Get seasonal weights
  const seasonalWeights = getSeasonalWeights(monthBranch);

  // 2. Compute Yin/Yang profile and modifier
  const yinYangProfile = computeYinYangProfile(pillars);
  const polarityResult = computeDmYinYangModifier(yinYangProfile);
  const globalPolarityModifier = polarityResult.dmModifier;

  // 3. Compute stem-branch rootedness
  const stemBranch = computeChartStemBranchRelations(pillars as SBFourPillars);
  // Convert rootedness to modifier: 0.0 -> 0.9, 0.5 -> 1.0, 1.0 -> 1.1
  const globalRootednessModifier = 0.9 + (stemBranch.overallRootedness * 0.2);

  // Determine element for each Ten God
  const tenGodElements: Record<TenGodCategory, Element> = {
    resource: getResourceElement(dmElement),
    companion: dmElement,
    output: GENERATION_CYCLE[dmElement],
    wealth: CONTROL_CYCLE[dmElement],
    officer: getOfficerElement(dmElement)
  };

  const defaultRaw = 0.5;
  const tenGods: Record<TenGodCategory, EnhancedTenGodInfo> = {} as any;

  for (const category of Object.keys(TEN_GODS_META) as TenGodCategory[]) {
    const element = tenGodElements[category];
    const raw = rawStrengths?.[category] ?? defaultRaw;
    const seasonalWeight = seasonalWeights[element];

    // Apply modifiers step by step
    const afterSeason = raw * seasonalWeight;
    const afterPolarity = afterSeason * globalPolarityModifier;
    const final = afterPolarity * globalRootednessModifier;

    const meta = TEN_GODS_META[category];

    // Generate detailed explanation
    const explanation = generateEnhancedExplanation(
      meta.name,
      element,
      raw,
      seasonalWeight,
      globalPolarityModifier,
      globalRootednessModifier,
      afterSeason,
      afterPolarity,
      final,
      monthBranch
    );

    tenGods[category] = {
      name: meta.name,
      chineseName: meta.chineseName,
      category,
      element,
      raw,
      seasonalWeight,
      polarityModifier: globalPolarityModifier,
      rootednessModifier: globalRootednessModifier,
      final,
      explanation
    };
  }

  // Generate summary
  const summary = generateEnhancedSummary(
    tenGods,
    dmElement,
    monthBranch,
    globalPolarityModifier,
    globalRootednessModifier
  );

  return {
    dmElement,
    monthBranch,
    seasonType: getSeasonType(monthBranch),
    tenGods,
    globalPolarityModifier,
    globalRootednessModifier,
    polarityExplanation: polarityResult.explanation,
    rootednessExplanation: stemBranch.explanation,
    summary
  };
}

function generateEnhancedExplanation(
  name: string,
  element: Element,
  raw: number,
  seasonalWeight: number,
  polarityMod: number,
  rootednessMod: number,
  afterSeason: number,
  afterPolarity: number,
  final: number,
  monthBranch: string
): string {
  const fmt = (n: number) => n.toFixed(3);
  const pct = (n: number) => (n * 100).toFixed(0);

  return `
Ten God: ${name}
Underlying Element: ${capitalize(element)}

1. Raw Strength:
   raw = ${pct(raw)}%

2. Seasonality Adjustment (month ${monthBranch}):
   seasonalWeight = ${seasonalWeight.toFixed(2)}
   afterSeason = raw × seasonalWeight
              = ${pct(raw)}% × ${seasonalWeight.toFixed(2)}
              = ${pct(afterSeason)}%

3. Yin/Yang Polarity Adjustment:
   polarityModifier = ${polarityMod.toFixed(2)}
   afterPolarity = afterSeason × polarityModifier
                = ${pct(afterSeason)}% × ${polarityMod.toFixed(2)}
                = ${pct(afterPolarity)}%

4. Stem-Branch Rootedness Adjustment:
   rootednessModifier = ${rootednessMod.toFixed(2)}
   final = afterPolarity × rootednessModifier
        = ${pct(afterPolarity)}% × ${rootednessMod.toFixed(2)}
        = ${pct(final)}%

Final ${name} Strength: ${pct(final)}%
`.trim();
}

function generateEnhancedSummary(
  tenGods: Record<TenGodCategory, EnhancedTenGodInfo>,
  dmElement: Element,
  monthBranch: string,
  polarityMod: number,
  rootednessMod: number
): string {
  const sorted = Object.values(tenGods).sort((a, b) => b.final - a.final);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const polarityDir = polarityMod >= 1 ? 'boosting' : 'dampening';
  const rootednessDir = rootednessMod >= 1 ? 'supporting' : 'challenging';

  let summary = `Enhanced Ten Gods Analysis\n`;
  summary += `${'='.repeat(40)}\n\n`;

  summary += `Day Master: ${capitalize(dmElement)}\n`;
  summary += `Month: ${monthBranch}\n\n`;

  summary += `Global Modifiers Applied:\n`;
  summary += `- Yin/Yang Polarity: ×${polarityMod.toFixed(2)} (${polarityDir})\n`;
  summary += `- Stem-Branch Rootedness: ×${rootednessMod.toFixed(2)} (${rootednessDir})\n\n`;

  summary += `Ten Gods Ranking (by final strength):\n`;
  sorted.forEach((tg, idx) => {
    summary += `${idx + 1}. ${tg.name} (${capitalize(tg.element)}): ${(tg.final * 100).toFixed(0)}%\n`;
  });

  summary += `\nStrongest: ${strongest.name} at ${(strongest.final * 100).toFixed(0)}%\n`;
  summary += `Weakest: ${weakest.name} at ${(weakest.final * 100).toFixed(0)}%\n`;

  return summary;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeTenGodsSeasonality,
  computeEnhancedTenGodsSeasonality,
  TEN_GODS_META,
  GENERATION_CYCLE,
  CONTROL_CYCLE
};
