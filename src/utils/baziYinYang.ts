/**
 * ============================================================================
 * BAZI YIN/YANG POLARITY ENGINE
 * ============================================================================
 *
 * Computes the Yin/Yang balance across the BaZi chart.
 *
 * In BaZi, each Heavenly Stem and Earthly Branch has an inherent polarity:
 * - Yang (阳): Active, assertive, outward energy
 * - Yin (阴): Receptive, reflective, inward energy
 *
 * The chart's overall Yin/Yang balance affects:
 * - Personality expression (assertive vs. receptive)
 * - How the Day Master interacts with the environment
 * - Compatibility dynamics between two charts
 *
 * Classical doctrine:
 * - Yang Day Masters (甲丙戊庚壬) are more assertive, direct
 * - Yin Day Masters (乙丁己辛癸) are more adaptable, flexible
 * - A balanced chart (close to 50/50) shows versatility
 * - An imbalanced chart (>70% one polarity) shows strong tendencies
 *
 * Created: January 2026
 * Based on: Classical BaZi Yin/Yang doctrine (阴阳学说)
 * ============================================================================
 */

import { Element } from './baziSeasonality';

// ============================================================================
// POLARITY MAPPINGS
// ============================================================================

/**
 * Heavenly Stems Yin/Yang Polarity
 * Yang stems (阳干): 甲丙戊庚壬
 * Yin stems (阴干): 乙丁己辛癸
 */
export const STEM_POLARITY: Record<string, 'yang' | 'yin'> = {
  '甲': 'yang',  // Jia - Yang Wood
  '乙': 'yin',   // Yi - Yin Wood
  '丙': 'yang',  // Bing - Yang Fire
  '丁': 'yin',   // Ding - Yin Fire
  '戊': 'yang',  // Wu - Yang Earth
  '己': 'yin',   // Ji - Yin Earth
  '庚': 'yang',  // Geng - Yang Metal
  '辛': 'yin',   // Xin - Yin Metal
  '壬': 'yang',  // Ren - Yang Water
  '癸': 'yin'    // Gui - Yin Water
};

/**
 * Earthly Branches Yin/Yang Polarity
 * Yang branches (阳支): 子寅辰午申戌
 * Yin branches (阴支): 丑卯巳未酉亥
 */
export const BRANCH_POLARITY: Record<string, 'yang' | 'yin'> = {
  '子': 'yang',  // Zi - Rat
  '丑': 'yin',   // Chou - Ox
  '寅': 'yang',  // Yin - Tiger
  '卯': 'yin',   // Mao - Rabbit
  '辰': 'yang',  // Chen - Dragon
  '巳': 'yin',   // Si - Snake
  '午': 'yang',  // Wu - Horse
  '未': 'yin',   // Wei - Goat
  '申': 'yang',  // Shen - Monkey
  '酉': 'yin',   // You - Rooster
  '戌': 'yang',  // Xu - Dog
  '亥': 'yin'    // Hai - Pig
};

// ============================================================================
// STEM ELEMENT MAPPING (for reference)
// ============================================================================

export const STEM_ELEMENT: Record<string, Element> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
};

// ============================================================================
// PILLAR WEIGHTS
// ============================================================================

/**
 * Classical pillar weights for Yin/Yang calculation
 * Day pillar has highest influence on personal expression
 */
export const PILLAR_WEIGHTS = {
  year: 0.20,    // 年柱 - Ancestral/social influence
  month: 0.25,   // 月柱 - Environment/career influence
  day: 0.35,     // 日柱 - Self/personal expression (highest)
  hour: 0.20     // 时柱 - Inner self/children
};

// ============================================================================
// TYPES
// ============================================================================

export interface YinYangProfile {
  yangCount: number;
  yinCount: number;
  yangPercent: number;
  yinPercent: number;
  weightedYang: number;
  weightedYin: number;
  balance: 'very_yang' | 'yang' | 'balanced' | 'yin' | 'very_yin';
  dmPolarity: 'yang' | 'yin';
  dmPolarityMatch: boolean;  // Does DM match chart's overall polarity?
  explanation: string;
}

export interface YinYangModifier {
  dmModifier: number;         // Multiplier for DM strength (0.85-1.15)
  harmonyScore: number;       // How harmonious is the Yin/Yang flow (0-1)
  expressionStyle: 'assertive' | 'balanced' | 'receptive';
  explanation: string;
}

export interface FourPillars {
  year: { stem: string; branch: string };
  month: { stem: string; branch: string };
  day: { stem: string; branch: string };
  hour: { stem: string; branch: string };
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Compute chart-level Yin/Yang profile from the Four Pillars
 *
 * @param pillars - Four Pillars with stem and branch for each
 * @returns YinYangProfile with counts, percentages, and balance assessment
 */
export function computeYinYangProfile(pillars: FourPillars): YinYangProfile {
  // Count raw Yang/Yin across all 8 characters (4 stems + 4 branches)
  let yangCount = 0;
  let yinCount = 0;
  let weightedYang = 0;
  let weightedYin = 0;

  const pillarKeys = ['year', 'month', 'day', 'hour'] as const;
  const weights = [PILLAR_WEIGHTS.year, PILLAR_WEIGHTS.month, PILLAR_WEIGHTS.day, PILLAR_WEIGHTS.hour];

  pillarKeys.forEach((key, idx) => {
    const pillar = pillars[key];
    const weight = weights[idx];

    // Check stem polarity
    const stemPol = STEM_POLARITY[pillar.stem];
    if (stemPol === 'yang') {
      yangCount++;
      weightedYang += weight * 0.5; // Stem contributes 50% of pillar weight
    } else if (stemPol === 'yin') {
      yinCount++;
      weightedYin += weight * 0.5;
    }

    // Check branch polarity
    const branchPol = BRANCH_POLARITY[pillar.branch];
    if (branchPol === 'yang') {
      yangCount++;
      weightedYang += weight * 0.5; // Branch contributes 50% of pillar weight
    } else if (branchPol === 'yin') {
      yinCount++;
      weightedYin += weight * 0.5;
    }
  });

  // Calculate raw percentages (8 total characters)
  const total = yangCount + yinCount;
  const yangPercent = total > 0 ? (yangCount / total) * 100 : 50;
  const yinPercent = total > 0 ? (yinCount / total) * 100 : 50;

  // Normalize weighted values
  const weightTotal = weightedYang + weightedYin;
  if (weightTotal > 0) {
    weightedYang = weightedYang / weightTotal;
    weightedYin = weightedYin / weightTotal;
  } else {
    weightedYang = 0.5;
    weightedYin = 0.5;
  }

  // Determine balance category based on weighted percentages
  const balance = getBalanceCategory(weightedYang * 100);

  // Get Day Master polarity
  const dmPolarity = STEM_POLARITY[pillars.day.stem] || 'yang';

  // Check if DM polarity matches chart's dominant polarity
  const chartDominant = weightedYang >= 0.5 ? 'yang' : 'yin';
  const dmPolarityMatch = dmPolarity === chartDominant;

  // Generate explanation
  const explanation = generateYinYangExplanation(
    yangCount,
    yinCount,
    weightedYang,
    weightedYin,
    balance,
    dmPolarity,
    dmPolarityMatch
  );

  return {
    yangCount,
    yinCount,
    yangPercent,
    yinPercent,
    weightedYang,
    weightedYin,
    balance,
    dmPolarity,
    dmPolarityMatch,
    explanation
  };
}

/**
 * Compute DM-centric Yin/Yang modifier for strength calculations
 *
 * Classical principle:
 * - Yang DM in Yang-dominant chart: +5-10% strength (alignment)
 * - Yin DM in Yin-dominant chart: +5-10% strength (alignment)
 * - DM opposite to chart polarity: -5-10% (working against flow)
 * - Balanced chart: neutral modifier
 *
 * @param profile - YinYangProfile from computeYinYangProfile
 * @returns YinYangModifier with dmModifier and harmony assessment
 */
export function computeDmYinYangModifier(profile: YinYangProfile): YinYangModifier {
  const { weightedYang, weightedYin, dmPolarity, dmPolarityMatch, balance } = profile;

  let dmModifier = 1.0;
  let harmonyScore = 0.5;
  let expressionStyle: YinYangModifier['expressionStyle'] = 'balanced';

  // Calculate imbalance magnitude (0 = balanced, 1 = extremely imbalanced)
  const imbalance = Math.abs(weightedYang - 0.5) * 2; // Scale 0-1

  if (balance === 'balanced') {
    // Balanced chart - neutral modifier, good harmony
    dmModifier = 1.0;
    harmonyScore = 0.85;
    expressionStyle = 'balanced';
  } else if (dmPolarityMatch) {
    // DM aligns with chart polarity - boost
    // Stronger imbalance = stronger boost (up to +15%)
    dmModifier = 1.0 + (imbalance * 0.15);
    harmonyScore = 0.8 + (imbalance * 0.1); // Up to 0.9
    expressionStyle = dmPolarity === 'yang' ? 'assertive' : 'receptive';
  } else {
    // DM opposes chart polarity - reduction
    // Stronger imbalance = stronger penalty (up to -15%)
    dmModifier = 1.0 - (imbalance * 0.15);
    harmonyScore = 0.5 - (imbalance * 0.2); // Can go to 0.3
    expressionStyle = 'balanced'; // Tension creates moderation
  }

  // Clamp values
  dmModifier = Math.max(0.85, Math.min(1.15, dmModifier));
  harmonyScore = Math.max(0.3, Math.min(0.95, harmonyScore));

  const explanation = generateModifierExplanation(
    dmPolarity,
    dmPolarityMatch,
    balance,
    dmModifier,
    harmonyScore,
    expressionStyle
  );

  return {
    dmModifier,
    harmonyScore,
    expressionStyle,
    explanation
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getBalanceCategory(yangPercent: number): YinYangProfile['balance'] {
  if (yangPercent >= 75) return 'very_yang';
  if (yangPercent >= 60) return 'yang';
  if (yangPercent >= 40) return 'balanced';
  if (yangPercent >= 25) return 'yin';
  return 'very_yin';
}

function generateYinYangExplanation(
  yangCount: number,
  yinCount: number,
  weightedYang: number,
  weightedYin: number,
  balance: YinYangProfile['balance'],
  dmPolarity: 'yang' | 'yin',
  dmPolarityMatch: boolean
): string {
  let explanation = '';

  // Raw count summary
  explanation += `Your chart has ${yangCount} Yang characters and ${yinCount} Yin characters.\n\n`;

  // Weighted analysis (with pillar importance)
  explanation += `Weighted balance (Day pillar emphasized): `;
  explanation += `${(weightedYang * 100).toFixed(0)}% Yang, ${(weightedYin * 100).toFixed(0)}% Yin.\n\n`;

  // Balance interpretation
  const balanceMessages: Record<string, string> = {
    very_yang: 'Your chart is strongly Yang-dominant. This suggests an assertive, action-oriented nature that likes to initiate and lead.',
    yang: 'Your chart leans Yang. This indicates a more active, outward-focused personality with good initiative.',
    balanced: 'Your chart has balanced Yin/Yang. This shows versatility - able to be both assertive and receptive as situations require.',
    yin: 'Your chart leans Yin. This indicates a more reflective, receptive personality with strong adaptability.',
    very_yin: 'Your chart is strongly Yin-dominant. This suggests a deeply receptive, intuitive nature that excels at observation and adaptation.'
  };
  explanation += balanceMessages[balance] + '\n\n';

  // DM polarity alignment
  const dmName = dmPolarity === 'yang' ? 'Yang' : 'Yin';
  if (dmPolarityMatch) {
    explanation += `Your Day Master is ${dmName}, which aligns with your chart's overall polarity. `;
    explanation += `This creates inner harmony - your core self naturally flows with your chart's energy.`;
  } else {
    explanation += `Your Day Master is ${dmName}, which differs from your chart's dominant polarity. `;
    explanation += `This creates interesting tension - your core self may sometimes feel it's working against the current.`;
  }

  return explanation;
}

function generateModifierExplanation(
  dmPolarity: 'yang' | 'yin',
  dmPolarityMatch: boolean,
  balance: YinYangProfile['balance'],
  dmModifier: number,
  harmonyScore: number,
  expressionStyle: string
): string {
  let explanation = '';

  const modPercent = ((dmModifier - 1) * 100).toFixed(0);
  const sign = dmModifier >= 1 ? '+' : '';

  if (balance === 'balanced') {
    explanation += `With a balanced Yin/Yang chart, your Day Master operates in a neutral environment. `;
    explanation += `DM strength modifier: neutral (${sign}${modPercent}%). `;
    explanation += `Harmony: ${(harmonyScore * 100).toFixed(0)}%.`;
  } else if (dmPolarityMatch) {
    explanation += `Your ${dmPolarity === 'yang' ? 'Yang' : 'Yin'} Day Master is supported by the chart's ${balance} polarity. `;
    explanation += `This alignment boosts DM expression: ${sign}${modPercent}% strength modifier. `;
    explanation += `Harmony: ${(harmonyScore * 100).toFixed(0)}%.`;
  } else {
    explanation += `Your ${dmPolarity === 'yang' ? 'Yang' : 'Yin'} Day Master must work against the chart's opposite polarity. `;
    explanation += `This creates tension: ${sign}${modPercent}% strength modifier. `;
    explanation += `Harmony: ${(harmonyScore * 100).toFixed(0)}%. `;
    explanation += `However, this tension can build character and adaptability.`;
  }

  return explanation;
}

// ============================================================================
// COMPATIBILITY UTILITIES
// ============================================================================

/**
 * Compare Yin/Yang profiles of two charts for compatibility
 *
 * Classical principle:
 * - Opposite polarities attract (Yang-Yin pairing)
 * - Same polarities understand each other but may compete
 * - Balance + Balance = versatile partnership
 */
export function compareYinYangProfiles(
  profileA: YinYangProfile,
  profileB: YinYangProfile
): {
  compatibility: number;
  dynamic: 'complementary' | 'resonant' | 'balanced_both' | 'tension';
  explanation: string;
} {
  const { balance: balanceA, dmPolarity: dmA } = profileA;
  const { balance: balanceB, dmPolarity: dmB } = profileB;

  let compatibility = 0.5;
  let dynamic: 'complementary' | 'resonant' | 'balanced_both' | 'tension' = 'tension';

  // DM polarity interaction
  const dmOpposite = dmA !== dmB;

  // Chart balance interaction
  const bothBalanced = balanceA === 'balanced' && balanceB === 'balanced';
  const oppositePolarities =
    (balanceA.includes('yang') && balanceB.includes('yin')) ||
    (balanceA.includes('yin') && balanceB.includes('yang'));
  const samePolarities =
    (balanceA.includes('yang') && balanceB.includes('yang')) ||
    (balanceA.includes('yin') && balanceB.includes('yin'));

  if (bothBalanced) {
    compatibility = 0.85;
    dynamic = 'balanced_both';
  } else if (oppositePolarities && dmOpposite) {
    // Classic complementary pairing
    compatibility = 0.90;
    dynamic = 'complementary';
  } else if (oppositePolarities && !dmOpposite) {
    // Mild complementary (chart pulls, DMs same)
    compatibility = 0.75;
    dynamic = 'complementary';
  } else if (samePolarities && !dmOpposite) {
    // Resonant - same polarity, same DM type
    compatibility = 0.70;
    dynamic = 'resonant';
  } else if (samePolarities && dmOpposite) {
    // Same chart polarity but opposite DMs - some tension
    compatibility = 0.65;
    dynamic = 'tension';
  } else {
    compatibility = 0.60;
    dynamic = 'tension';
  }

  const explanation = generatePairExplanation(
    profileA,
    profileB,
    compatibility,
    dynamic,
    dmOpposite
  );

  return { compatibility, dynamic, explanation };
}

function generatePairExplanation(
  profileA: YinYangProfile,
  profileB: YinYangProfile,
  compatibility: number,
  dynamic: string,
  dmOpposite: boolean
): string {
  let explanation = `Person A: ${profileA.balance} (${profileA.dmPolarity} DM)\n`;
  explanation += `Person B: ${profileB.balance} (${profileB.dmPolarity} DM)\n\n`;

  const dynamicMessages: Record<string, string> = {
    complementary: 'Your opposite Yin/Yang polarities create a complementary dynamic - you each bring what the other lacks.',
    resonant: 'Your similar polarities create resonance - you understand each other\'s approach naturally.',
    balanced_both: 'Both charts are balanced, creating a versatile partnership that can adapt to any situation together.',
    tension: 'Your polarity combination creates some tension, which can spark growth or require extra understanding.'
  };

  explanation += dynamicMessages[dynamic] + '\n\n';

  if (dmOpposite) {
    explanation += 'Your Day Masters are opposite polarities, adding an attractive dynamic at the core level.';
  } else {
    explanation += 'Your Day Masters share the same polarity, creating natural understanding but potential competition.';
  }

  return explanation;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  computeYinYangProfile,
  computeDmYinYangModifier,
  compareYinYangProfiles,
  STEM_POLARITY,
  BRANCH_POLARITY,
  STEM_ELEMENT,
  PILLAR_WEIGHTS
};
