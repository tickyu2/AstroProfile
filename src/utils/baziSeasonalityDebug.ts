/**
 * ============================================================================
 * BAZI SEASONALITY DEBUG MODE
 * ============================================================================
 *
 * "Open the engine hood" mode for advanced practitioners.
 * Shows explicit formulas, intermediate values, and reasoning.
 *
 * No black boxes - every number has a story and a formula.
 *
 * Created: January 2026
 * Philosophy: Complete transparency for serious students
 * ============================================================================
 */

import { SeasonalityResult, Element, SEASON_WEIGHTS, EARTH_TRANSITION_MAP } from './baziSeasonality';
import { DMSeasonalityResult } from './baziDmSeasonality';
import { TenGodsSeasonalityResult, TenGodCategory } from './baziTenGodsSeasonality';

// ============================================================================
// DEBUG OUTPUT BUILDER
// ============================================================================

/**
 * Build a detailed debug output for advanced practitioners.
 */
export function buildSeasonalityDebug(
  seasonality: SeasonalityResult,
  dmSeasonal: DMSeasonalityResult,
  tenGodsSeasonal: TenGodsSeasonalityResult
): string {
  const lines: string[] = [];

  // Header
  lines.push('╔══════════════════════════════════════════════════════════════════╗');
  lines.push('║              SEASONALITY DEBUG MODE (Advanced)                    ║');
  lines.push('╚══════════════════════════════════════════════════════════════════╝');
  lines.push('');

  // Section 1: Input Parameters
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ INPUT PARAMETERS                                                │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push(`  Month Branch:     ${seasonality.monthBranch}`);
  lines.push(`  Season Type:      ${seasonality.season}`);
  lines.push(`  Season Chinese:   ${seasonality.seasonChinese}`);
  lines.push(`  Day Master Stem:  ${dmSeasonal.dmStem}`);
  lines.push(`  Day Master Element: ${dmSeasonal.dmElement}`);
  lines.push('');

  // Section 2: Seasonal Weights
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ SEASONAL WEIGHT MATRIX                                          │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push('  Formula: weight[element] = lookup(season, element)');
  lines.push('');
  lines.push('  Element    Weight    Source');
  lines.push('  ───────────────────────────────────────');

  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  for (const el of elements) {
    const weight = seasonality.weights[el];
    const source = getWeightSource(seasonality.season, el);
    const marker = weight === 1.0 ? ' ← DOMINANT' : '';
    lines.push(`  ${padRight(el, 10)} ${weight.toFixed(2)}      ${source}${marker}`);
  }
  lines.push('');

  // Section 3: Raw Element Distribution
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ RAW ELEMENT DISTRIBUTION                                        │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push('  (Before seasonal adjustment)');
  lines.push('');
  lines.push('  Element    Raw Value    Normalized %');
  lines.push('  ───────────────────────────────────────');

  const rawTotal = Object.values(seasonality.raw).reduce((a, b) => a + b, 0);
  for (const el of elements) {
    const raw = seasonality.raw[el];
    const rawPct = seasonality.rawNormalized[el];
    lines.push(`  ${padRight(el, 10)} ${raw.toFixed(3)}        ${rawPct.toFixed(1)}%`);
  }
  lines.push(`  ───────────────────────────────────────`);
  lines.push(`  Total:     ${rawTotal.toFixed(3)}        100.0%`);
  lines.push('');

  // Section 4: Adjusted Distribution
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ ADJUSTED ELEMENT DISTRIBUTION                                   │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push('  Formula: adjusted[el] = raw[el] × weight[el]');
  lines.push('  Formula: normalized[el] = adjusted[el] / sum(adjusted) × 100');
  lines.push('');
  lines.push('  Element    Raw × Weight = Adjusted    Norm %    Delta');
  lines.push('  ─────────────────────────────────────────────────────');

  const adjTotal = Object.values(seasonality.adjusted).reduce((a, b) => a + b, 0);
  for (const el of elements) {
    const raw = seasonality.raw[el];
    const weight = seasonality.weights[el];
    const adj = seasonality.adjusted[el];
    const adjPct = seasonality.adjustedNormalized[el];
    const delta = seasonality.deltas[el];
    const deltaStr = delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;
    lines.push(`  ${padRight(el, 8)} ${raw.toFixed(2)} × ${weight.toFixed(2)} = ${adj.toFixed(3)}    ${adjPct.toFixed(1)}%     ${deltaStr}`);
  }
  lines.push(`  ─────────────────────────────────────────────────────`);
  lines.push(`  Sum of Adjusted: ${adjTotal.toFixed(3)}`);
  lines.push('');

  // Section 5: Dominant Element Analysis
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ DOMINANT ELEMENT ANALYSIS                                       │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push(`  Dominant Before: ${seasonality.dominantBefore.toUpperCase()}`);
  lines.push(`  Dominant After:  ${seasonality.dominantAfter.toUpperCase()}`);
  lines.push(`  Shift Occurred:  ${seasonality.dominantChanged ? 'YES' : 'NO'}`);
  lines.push('');

  // Section 6: Day Master Strength
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ DAY MASTER STRENGTH CALCULATION                                 │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push('  Formula: adjustedStrength = rawStrength × (0.5 + 0.5 × seasonalWeight)');
  lines.push('');
  lines.push(`  DM Element:       ${dmSeasonal.dmElement}`);
  lines.push(`  Seasonal Weight:  ${dmSeasonal.seasonalWeight.toFixed(2)}`);
  lines.push(`  Raw Strength:     ${(dmSeasonal.rawStrength * 100).toFixed(1)}%`);
  lines.push(`  Multiplier:       0.5 + 0.5 × ${dmSeasonal.seasonalWeight.toFixed(2)} = ${(0.5 + 0.5 * dmSeasonal.seasonalWeight).toFixed(3)}`);
  lines.push(`  Adjusted:         ${(dmSeasonal.rawStrength * 100).toFixed(1)}% × ${(0.5 + 0.5 * dmSeasonal.seasonalWeight).toFixed(3)} = ${(dmSeasonal.adjustedStrength * 100).toFixed(1)}%`);
  lines.push(`  Category:         ${dmSeasonal.strengthCategory.toUpperCase().replace('_', ' ')}`);
  lines.push(`  In Season:        ${dmSeasonal.isInSeason ? 'YES' : 'NO'}`);
  lines.push('');

  // Section 7: Ten Gods Calculation
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ TEN GODS SEASONAL CALCULATION                                   │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push('  Formula: adjusted = raw × seasonal_weight[element]');
  lines.push('');
  lines.push('  Ten God       Element    Weight    Raw      Adjusted   Delta');
  lines.push('  ─────────────────────────────────────────────────────────────');

  const categories: TenGodCategory[] = ['resource', 'companion', 'output', 'wealth', 'officer'];
  for (const cat of categories) {
    const info = tenGodsSeasonal.tenGods[cat];
    const deltaStr = info.delta > 0 ? `+${(info.delta * 100).toFixed(1)}%` : `${(info.delta * 100).toFixed(1)}%`;
    lines.push(`  ${padRight(info.name, 12)} ${padRight(info.element, 8)} ${info.weight.toFixed(2)}      ${(info.raw * 100).toFixed(0)}%       ${(info.adjusted * 100).toFixed(0)}%        ${deltaStr}`);
  }
  lines.push('');

  // Section 8: Element Relationship Reference
  lines.push('┌─────────────────────────────────────────────────────────────────┐');
  lines.push('│ ELEMENT RELATIONSHIP REFERENCE                                  │');
  lines.push('└─────────────────────────────────────────────────────────────────┘');
  lines.push('  Generation Cycle (生): Wood → Fire → Earth → Metal → Water → Wood');
  lines.push('  Control Cycle (克):    Wood → Earth → Water → Fire → Metal → Wood');
  lines.push('');
  lines.push(`  For DM ${dmSeasonal.dmElement.toUpperCase()}:`);
  lines.push(`    Resource (印):  ${getResourceElement(dmSeasonal.dmElement)} generates ${dmSeasonal.dmElement}`);
  lines.push(`    Companion (比): ${dmSeasonal.dmElement} = ${dmSeasonal.dmElement}`);
  lines.push(`    Output (食):    ${dmSeasonal.dmElement} generates ${getOutputElement(dmSeasonal.dmElement)}`);
  lines.push(`    Wealth (财):    ${dmSeasonal.dmElement} controls ${getWealthElement(dmSeasonal.dmElement)}`);
  lines.push(`    Officer (官):   ${getOfficerElement(dmSeasonal.dmElement)} controls ${dmSeasonal.dmElement}`);
  lines.push('');

  // Footer
  lines.push('╔══════════════════════════════════════════════════════════════════╗');
  lines.push('║                    END DEBUG OUTPUT                               ║');
  lines.push('╚══════════════════════════════════════════════════════════════════╝');

  return lines.join('\n');
}

// ============================================================================
// HELPERS
// ============================================================================

function padRight(str: string, len: number): string {
  return str.padEnd(len, ' ');
}

function getWeightSource(season: string, element: Element): string {
  if (season.startsWith('earth_transition')) {
    if (element === 'earth') return 'Earth dominates transitions';
    return 'Transition period base';
  }

  const seasonMap: Record<string, Element> = {
    spring: 'wood',
    summer: 'fire',
    autumn: 'metal',
    winter: 'water'
  };

  const dominant = seasonMap[season];
  if (!dominant) return 'Unknown';

  if (element === dominant) return 'Thriving element';
  return 'Five-element relationship';
}

const GENERATION: Record<Element, Element> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
};

const CONTROL: Record<Element, Element> = {
  wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire'
};

function getResourceElement(dm: Element): Element {
  const reverse: Record<Element, Element> = {
    wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal'
  };
  return reverse[dm];
}

function getOutputElement(dm: Element): Element {
  return GENERATION[dm];
}

function getWealthElement(dm: Element): Element {
  return CONTROL[dm];
}

function getOfficerElement(dm: Element): Element {
  const reverse: Record<Element, Element> = {
    wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth'
  };
  return reverse[dm];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  buildSeasonalityDebug
};
