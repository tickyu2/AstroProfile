/**
 * ============================================================================
 * BAZI DAY MASTER SEASONALITY ENGINE
 * ============================================================================
 *
 * Computes how the season affects the Day Master's strength.
 *
 * In BaZi, the Day Master (DM) represents your core self. Its strength is
 * determined by:
 * 1. The element of the Day Stem
 * 2. Support from other pillars (Resource, Companions)
 * 3. The seasonal environment (this module)
 *
 * A DM born in its thriving season is naturally stronger.
 * A DM born in its weakest season needs more support.
 *
 * Created: January 2026
 * Based on: Classical BaZi Day Master strength doctrine
 * ============================================================================
 */

import { Element, getSeasonalWeights, getSeasonInfo } from './baziSeasonality';

export interface DMSeasonalityResult {
  dmElement: Element;
  dmStem: string;
  monthBranch: string;
  seasonType: string;
  seasonChinese: string;
  seasonalWeight: number;
  rawStrength: number;
  adjustedStrength: number;
  strengthCategory: 'very_weak' | 'weak' | 'balanced' | 'strong' | 'very_strong';
  isInSeason: boolean;
  explanation: string;
}

// ============================================================================
// DAY STEM TO ELEMENT MAPPING
// ============================================================================

const STEM_ELEMENT_MAP: Record<string, Element> = {
  // Yang Wood, Yin Wood
  '甲': 'wood', '乙': 'wood',
  // Yang Fire, Yin Fire
  '丙': 'fire', '丁': 'fire',
  // Yang Earth, Yin Earth
  '戊': 'earth', '己': 'earth',
  // Yang Metal, Yin Metal
  '庚': 'metal', '辛': 'metal',
  // Yang Water, Yin Water
  '壬': 'water', '癸': 'water'
};

const STEM_NAMES: Record<string, string> = {
  '甲': 'Jia (Yang Wood)',
  '乙': 'Yi (Yin Wood)',
  '丙': 'Bing (Yang Fire)',
  '丁': 'Ding (Yin Fire)',
  '戊': 'Wu (Yang Earth)',
  '己': 'Ji (Yin Earth)',
  '庚': 'Geng (Yang Metal)',
  '辛': 'Xin (Yin Metal)',
  '壬': 'Ren (Yang Water)',
  '癸': 'Gui (Yin Water)'
};

// ============================================================================
// STRENGTH THRESHOLDS
// ============================================================================

function getStrengthCategory(adjustedStrength: number): DMSeasonalityResult['strengthCategory'] {
  if (adjustedStrength < 0.3) return 'very_weak';
  if (adjustedStrength < 0.45) return 'weak';
  if (adjustedStrength < 0.55) return 'balanced';
  if (adjustedStrength < 0.7) return 'strong';
  return 'very_strong';
}

// ============================================================================
// CORE FUNCTION
// ============================================================================

/**
 * Compute how the season affects the Day Master's strength.
 *
 * @param dmStem - Day Stem character (e.g., "甲", "乙")
 * @param monthBranch - Month Branch character (e.g., "寅", "卯")
 * @param rawStrength - Base DM strength from pillar support (0-1 scale, optional)
 * @returns DMSeasonalityResult with adjusted strength and explanation
 */
export function computeSeasonalDMStrength(
  dmStem: string,
  monthBranch: string,
  rawStrength: number = 0.5
): DMSeasonalityResult {
  const dmElement = STEM_ELEMENT_MAP[dmStem] || 'wood';
  const weights = getSeasonalWeights(monthBranch);
  const seasonInfo = getSeasonInfo(monthBranch);

  // Get the seasonal weight for the DM's element
  const seasonalWeight = weights[dmElement];

  // Determine season type
  const seasonType = getSeasonType(monthBranch);

  // Is the DM "in season" (born when their element thrives)?
  const isInSeason = seasonalWeight >= 0.8;

  // Calculate adjusted strength
  // Formula: adjustedStrength = rawStrength * (0.5 + 0.5 * seasonalWeight)
  // This means:
  //   - At seasonalWeight = 1.0, strength gets +50% boost
  //   - At seasonalWeight = 0.2, strength gets -40% reduction
  const adjustedStrength = Math.min(1, Math.max(0,
    rawStrength * (0.5 + 0.5 * seasonalWeight)
  ));

  const strengthCategory = getStrengthCategory(adjustedStrength);

  // Generate explanation
  const explanation = generateDMExplanation(
    dmStem,
    dmElement,
    monthBranch,
    seasonInfo,
    seasonalWeight,
    rawStrength,
    adjustedStrength,
    isInSeason,
    strengthCategory
  );

  return {
    dmElement,
    dmStem,
    monthBranch,
    seasonType,
    seasonChinese: seasonInfo.chinese,
    seasonalWeight,
    rawStrength,
    adjustedStrength,
    strengthCategory,
    isInSeason,
    explanation
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

function generateDMExplanation(
  dmStem: string,
  dmElement: Element,
  monthBranch: string,
  seasonInfo: { name: string; chinese: string; emoji: string },
  seasonalWeight: number,
  rawStrength: number,
  adjustedStrength: number,
  isInSeason: boolean,
  strengthCategory: string
): string {
  const stemName = STEM_NAMES[dmStem] || dmStem;
  const elementName = capitalize(dmElement);

  let explanation = `Your Day Master is ${stemName}, a ${elementName} element.\n\n`;

  if (isInSeason) {
    explanation += `Born in ${seasonInfo.name} (${monthBranch}), your ${elementName} Day Master is "in season" `;
    explanation += `- the environment naturally supports and strengthens your core nature.\n\n`;
  } else if (seasonalWeight >= 0.6) {
    explanation += `Born in ${seasonInfo.name} (${monthBranch}), your ${elementName} Day Master receives moderate seasonal support.\n\n`;
  } else if (seasonalWeight >= 0.4) {
    explanation += `Born in ${seasonInfo.name} (${monthBranch}), your ${elementName} Day Master is in a neutral season `;
    explanation += `- neither strongly supported nor weakened.\n\n`;
  } else {
    explanation += `Born in ${seasonInfo.name} (${monthBranch}), your ${elementName} Day Master faces seasonal challenges `;
    explanation += `- the environment doesn't naturally support your core element.\n\n`;
  }

  explanation += `Seasonal Weight: ${seasonalWeight.toFixed(2)}\n`;
  explanation += `Raw Strength: ${(rawStrength * 100).toFixed(0)}%\n`;
  explanation += `Adjusted Strength: ${(adjustedStrength * 100).toFixed(0)}%\n\n`;

  // Strength category interpretation
  const categoryMessages: Record<string, string> = {
    very_weak: "This indicates a very weak Day Master that benefits greatly from support elements (Resource, Companions) and should avoid exhausting pursuits.",
    weak: "This indicates a weaker Day Master that needs support from Resource and Companion elements to maintain balance.",
    balanced: "This indicates a balanced Day Master that can handle both support and output without becoming overwhelmed.",
    strong: "This indicates a strong Day Master that can handle challenges well and benefits from output elements (Wealth, Officer, Output).",
    very_strong: "This indicates a very strong Day Master that actually benefits from being drained by Wealth, Officer, and Output elements."
  };

  explanation += categoryMessages[strengthCategory];

  return explanation;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeSeasonalDMStrength,
  STEM_ELEMENT_MAP,
  STEM_NAMES
};
