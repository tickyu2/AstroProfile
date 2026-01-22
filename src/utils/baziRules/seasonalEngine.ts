/**
 * ============================================
 * SEASONAL ENGINE
 * Evaluates seasonal strength modifiers and exceptions
 * ============================================
 */

import {
  ChartContext,
  SeasonalRule,
  SeasonalEvaluation,
  Element,
  ElementBalance,
  RuleMatch
} from './types';
import { evaluateRules } from './ruleMatcher';

/**
 * Evaluate seasonal rules and calculate element modifiers
 */
export function evaluateSeasonalOverrides(
  ctx: ChartContext,
  rules: SeasonalRule[]
): SeasonalEvaluation {
  // Initialize modifiers at 1.0 (no change)
  const elementModifiers: ElementBalance = {
    Wood: 1.0,
    Fire: 1.0,
    Earth: 1.0,
    Metal: 1.0,
    Water: 1.0
  };

  const supportNeeded: Element[] = [];
  const matchedRules = evaluateRules(rules, ctx);

  // Apply matched rules
  for (const match of matchedRules) {
    if (!match.matched) continue;

    const conditions = match.rule.conditions;
    const result = match.result;

    // Determine which element this rule affects
    let affectedElement: Element | null = null;

    if (conditions.element) {
      if (conditions.element === 'matches_season') {
        // Get element that matches current season
        affectedElement = getSeasonElement(ctx.season);
      } else if (conditions.element === 'produces_seasonal_element') {
        // Get element that produces the season's element
        const seasonElement = getSeasonElement(ctx.season);
        affectedElement = getProducingElement(seasonElement);
      } else {
        affectedElement = conditions.element as Element;
      }
    }

    // Apply strength modifier
    if (affectedElement && result.strengthModifier) {
      elementModifiers[affectedElement] = result.strengthModifier;
    }

    // Handle Earth month boost
    if (result.earthStrengthBoost) {
      elementModifiers.Earth = result.earthStrengthBoost;
    }

    // Handle polarity bonus
    if (result.polarityBonus && ctx.dayMaster.polarity === 'Yang') {
      const dmElement = ctx.dayMaster.element;
      elementModifiers[dmElement] *= result.polarityBonus;
    }

    // Track support needed
    if (result.needsWoodSupport) supportNeeded.push('Wood');
    if (result.needsFireSupport) supportNeeded.push('Fire');
    if (result.needsEarthSupport) supportNeeded.push('Earth');
    if (result.needsMetalSupport) supportNeeded.push('Metal');
    if (result.needsWaterSupport || result.needsWaterCooling) supportNeeded.push('Water');
  }

  return {
    elementModifiers,
    matchedRules: matchedRules as RuleMatch<SeasonalRule>[],
    supportNeeded: [...new Set(supportNeeded)]
  };
}

/**
 * Get the element associated with a season
 */
function getSeasonElement(season: string): Element {
  const seasonElements: Record<string, Element> = {
    'spring': 'Wood',
    'summer': 'Fire',
    'late_summer': 'Earth',
    'autumn': 'Metal',
    'winter': 'Water'
  };
  return seasonElements[season] || 'Earth';
}

/**
 * Get the element that produces another element
 */
function getProducingElement(element: Element): Element {
  const producing: Record<Element, Element> = {
    'Wood': 'Water',
    'Fire': 'Wood',
    'Earth': 'Fire',
    'Metal': 'Earth',
    'Water': 'Metal'
  };
  return producing[element];
}

/**
 * Apply seasonal modifiers to element balance
 */
export function applySeasonalModifiers(
  baseBalance: ElementBalance,
  evaluation: SeasonalEvaluation
): ElementBalance {
  const modified: ElementBalance = { ...baseBalance };

  for (const element of Object.keys(modified) as Element[]) {
    modified[element] = baseBalance[element] * evaluation.elementModifiers[element];
  }

  return modified;
}

/**
 * Get seasonal strength description for an element
 */
export function getSeasonalStrengthDescription(
  element: Element,
  season: string
): { phase: string; description: string; modifier: number } {
  const seasonElement = getSeasonElement(season);
  const producing = getProducingElement(seasonElement);

  // Element is prosperous in its own season
  if (element === seasonElement) {
    return {
      phase: 'wang (旺)',
      description: `${element} is at peak strength in ${season}`,
      modifier: 1.5
    };
  }

  // Element that produces the season element is supported
  if (element === producing) {
    return {
      phase: 'xiang (相)',
      description: `${element} is supported in ${season}`,
      modifier: 1.2
    };
  }

  // Element controlled by season element is weak
  const controlling: Record<Element, Element> = {
    'Wood': 'Earth',
    'Fire': 'Metal',
    'Earth': 'Water',
    'Metal': 'Wood',
    'Water': 'Fire'
  };

  if (controlling[seasonElement] === element) {
    return {
      phase: 'si (死)',
      description: `${element} is controlled/weak in ${season}`,
      modifier: 0.4
    };
  }

  // Element that controls season element expends energy
  const controlledBy: Record<Element, Element> = {
    'Wood': 'Metal',
    'Fire': 'Water',
    'Earth': 'Wood',
    'Metal': 'Fire',
    'Water': 'Earth'
  };

  if (controlledBy[seasonElement] === element) {
    return {
      phase: 'qiu (囚)',
      description: `${element} is imprisoned/depleted in ${season}`,
      modifier: 0.6
    };
  }

  // Default - resting phase
  return {
    phase: 'xiu (休)',
    description: `${element} is resting in ${season}`,
    modifier: 0.8
  };
}

/**
 * Get season from month branch
 */
export function getSeasonFromBranch(branch: string): string {
  const branchSeasons: Record<string, string> = {
    '寅': 'spring', '卯': 'spring', '辰': 'late_summer',
    '巳': 'summer', '午': 'summer', '未': 'late_summer',
    '申': 'autumn', '酉': 'autumn', '戌': 'late_summer',
    '亥': 'winter', '子': 'winter', '丑': 'late_summer'
  };
  return branchSeasons[branch] || 'late_summer';
}
