/**
 * ═══════════════════════════════════════════════════════════════
 * SEASONAL STRENGTH CALCULATOR (五行旺衰)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Implements the "5 States of Qi" (旺相休囚死) system
 * 
 * Based on: Baby Gemini conversation about seasonal multipliers
 * Key Insight: Raw percentages are meaningless without season!
 * 
 * Example: 30% Metal in Autumn = feels like 80%
 *          30% Metal in Spring = feels like 6%
 */

// ═══════════════════════════════════════════════════════════════
// THE 5 STATES OF QI (MULTIPLIERS)
// ═══════════════════════════════════════════════════════════════

/**
 * 王 (Wang) - Prosperous/King: 1.5x
 *   The element rules this season
 *   Example: Wood in Spring
 * 
 * 相 (Xiang) - Strengthening/Child: 1.2x
 *   The element that the season produces
 *   Example: Fire in Spring (Wood feeds Fire)
 * 
 * 休 (Xiu) - Resting/Mother: 0.8x
 *   The element that produced the season (tired from giving birth)
 *   Example: Water in Spring (Water fed Wood)
 * 
 * 囚 (Qiu) - Trapped/Prisoner: 0.5x
 *   The element controlled by the season
 *   Example: Earth in Spring (Wood covers Earth)
 * 
 * 死 (Si) - Dead/Powerless: 0.2x
 *   The element that tries to control the season (loses battle)
 *   Example: Metal in Spring (trying to chop massive forest)
 */

const SEASONAL_MULTIPLIERS = {
  spring: {
    Wood: 1.5,   // 王 King - Rules the season
    Fire: 1.2,   // 相 Child - Wood produces Fire
    Water: 0.8,  // 休 Mother - Water produced Wood (resting)
    Earth: 0.5,  // 囚 Trapped - Wood controls Earth
    Metal: 0.2   // 死 Dead - Metal can't cut Spring forest
  },
  summer: {
    Fire: 1.5,   // 王 King
    Earth: 1.2,  // 相 Child - Fire produces Earth
    Wood: 0.8,   // 休 Mother - Wood produced Fire
    Metal: 0.5,  // 囚 Trapped - Fire melts Metal
    Water: 0.2   // 死 Dead - Water can't extinguish Summer fire
  },
  autumn: {
    Metal: 1.5,  // 王 King
    Water: 1.2,  // 相 Child - Metal produces Water
    Earth: 0.8,  // 休 Mother - Earth produced Metal
    Wood: 0.2,   // 死 Dead - Wood can't grow against Metal
    Fire: 0.5    // 囚 Trapped - Metal conducts Fire away
  },
  winter: {
    Water: 1.5,  // 王 King
    Wood: 1.2,   // 相 Child - Water produces Wood
    Metal: 0.8,  // 休 Mother - Metal produced Water
    Fire: 0.2,   // 死 Dead - Fire can't burn in Winter
    Earth: 0.5   // 囚 Trapped - Water erodes Earth
  },
  earth: {
    Earth: 1.5,  // 王 King
    Metal: 1.2,  // 相 Child - Earth produces Metal
    Fire: 0.8,   // 休 Mother - Fire produced Earth
    Wood: 0.5,   // 囚 Trapped - Earth covered by Wood
    Water: 0.2   // 死 Dead - Earth dams Water
  }
};

// ═══════════════════════════════════════════════════════════════
// SEASON DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Map Month Branch (animal) to Season
 * 
 * Spring: Tiger 寅, Rabbit 卯, Dragon 辰
 * Summer: Snake 巳, Horse 午, Goat 未
 * Autumn: Monkey 申, Rooster 酉, Dog 戌
 * Winter: Pig 亥, Rat 子, Ox 丑
 */
const MONTH_BRANCH_TO_SEASON = {
  'Tiger': 'spring',
  'Rabbit': 'spring',
  'Dragon': 'earth',    // Special: Spring Earth (transition)
  
  'Snake': 'summer',
  'Horse': 'summer',
  'Goat': 'earth',      // Special: Summer Earth (transition)
  
  'Monkey': 'autumn',
  'Rooster': 'autumn',
  'Dog': 'earth',       // Special: Autumn Earth (transition)
  
  'Pig': 'winter',
  'Rat': 'winter',
  'Ox': 'earth'         // Special: Winter Earth (transition)
};

const SEASON_NAMES = {
  spring: '🌸 Spring (Wood Season)',
  summer: '☀️ Summer (Fire Season)',
  autumn: '🍂 Autumn (Metal Season)',
  winter: '❄️ Winter (Water Season)',
  earth: '🌍 Earth Season (Transition)'
};

const QI_STATE_NAMES = {
  1.5: '王 Prosperous (King)',
  1.2: '相 Strengthening (Child)',
  0.8: '休 Resting (Mother)',
  0.5: '囚 Trapped (Prisoner)',
  0.2: '死 Dead (Powerless)'
};

// ═══════════════════════════════════════════════════════════════
// CORE CALCULATION FUNCTION
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate TRUE elemental strength with seasonal adjustment
 * 
 * @param {Object} fourPillars - The four pillars data
 * @returns {Object} - Adjusted element percentages with debug info
 */
export function calculateSeasonalStrength(fourPillars) {
  // Step 1: Detect season from Month Branch
  const monthAnimal = fourPillars.month.branch.animal;
  const season = MONTH_BRANCH_TO_SEASON[monthAnimal];
  const multipliers = SEASONAL_MULTIPLIERS[season];
  
  // Step 2: Count raw occurrences of each element (with pillar weights)
  const rawCounts = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };
  
  // Weight: Day 70%, Hour 15%, Month 10%, Year 5%
  const weights = {
    year: 0.05,
    month: 0.10,
    day: 0.70,
    hour: 0.15
  };
  
  // Count elements from each pillar
  ['year', 'month', 'day', 'hour'].forEach(pillarName => {
    const pillar = fourPillars[pillarName];
    const weight = weights[pillarName];
    
    // Stem element
    const stemElement = pillar.stem.element;
    rawCounts[stemElement] += weight;
    
    // Branch element
    const branchElement = pillar.branch.element;
    rawCounts[branchElement] += weight;
  });
  
  // Step 3: Apply seasonal multipliers
  const adjustedCounts = {};
  const debugDetails = {};
  
  Object.keys(rawCounts).forEach(element => {
    const rawValue = rawCounts[element];
    const multiplier = multipliers[element];
    const adjustedValue = rawValue * multiplier;
    
    adjustedCounts[element] = adjustedValue;
    
    debugDetails[element] = {
      raw: rawValue,
      multiplier: multiplier,
      adjusted: adjustedValue,
      qiState: QI_STATE_NAMES[multiplier]
    };
  });
  
  // Step 4: Calculate percentages
  const totalAdjusted = Object.values(adjustedCounts).reduce((sum, val) => sum + val, 0);
  
  const percentages = {};
  Object.keys(adjustedCounts).forEach(element => {
    percentages[element] = (adjustedCounts[element] / totalAdjusted) * 100;
  });
  
  // Step 5: Determine balance status
  const values = Object.values(percentages);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  let balanceStatus;
  if (range < 20) balanceStatus = 'Balanced';
  else if (range < 40) balanceStatus = 'Moderately Unbalanced';
  else balanceStatus = 'Highly Unbalanced';
  
  // Step 6: Find dominant and weakest elements
  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][0];
  const weakest = sorted[sorted.length - 1][0];
  
  return {
    // Final results
    percentages,
    dominant,
    weakest,
    balanceStatus,
    
    // Debug information
    debug: {
      season: {
        animal: monthAnimal,
        season: season,
        name: SEASON_NAMES[season]
      },
      rawCounts,
      multipliers,
      adjustedCounts,
      elementDetails: debugDetails,
      totalAdjusted,
      calculations: {
        pillarWeights: weights,
        explanation: "Day Pillar (70%) is your core essence. Hour (15%), Month (10%), Year (5%) provide context."
      }
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// COMPARISON FUNCTION (Before vs After)
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate both raw and adjusted for comparison
 */
export function calculateWithComparison(fourPillars) {
  // Raw calculation (no seasonal adjustment)
  const rawCounts = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };
  
  const weights = {
    year: 0.05,
    month: 0.10,
    day: 0.70,
    hour: 0.15
  };
  
  ['year', 'month', 'day', 'hour'].forEach(pillarName => {
    const pillar = fourPillars[pillarName];
    const weight = weights[pillarName];
    
    rawCounts[pillar.stem.element] += weight;
    rawCounts[pillar.branch.element] += weight;
  });
  
  const totalRaw = Object.values(rawCounts).reduce((sum, val) => sum + val, 0);
  const rawPercentages = {};
  Object.keys(rawCounts).forEach(element => {
    rawPercentages[element] = (rawCounts[element] / totalRaw) * 100;
  });
  
  // Seasonal-adjusted calculation
  const adjusted = calculateSeasonalStrength(fourPillars);
  
  return {
    raw: {
      percentages: rawPercentages,
      label: '❌ Without Seasonal Adjustment (WRONG)'
    },
    adjusted: {
      percentages: adjusted.percentages,
      label: '✅ With Seasonal Adjustment (CORRECT)'
    },
    debug: adjusted.debug,
    comparison: {
      message: 'See the difference! Raw counts ignore season = inaccurate results.',
      example: `In ${adjusted.debug.season.name}, some elements are boosted (King), others weakened (Dead).`
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Format element name with emoji
 */
export function formatElementName(element) {
  const emojis = {
    Wood: '🌳 Wood',
    Fire: '🔥 Fire',
    Earth: '🌍 Earth',
    Metal: '⚙️ Metal',
    Water: '💧 Water'
  };
  return emojis[element] || element;
}

/**
 * Get color for element
 */
export function getElementColor(element) {
  const colors = {
    Wood: '#10b981',  // Green
    Fire: '#ef4444',  // Red
    Earth: '#f59e0b', // Amber
    Metal: '#94a3b8', // Slate/Silver
    Water: '#3b82f6'  // Blue
  };
  return colors[element] || '#6b7280';
}

export default {
  calculateSeasonalStrength,
  calculateWithComparison,
  formatElementName,
  getElementColor,
  SEASONAL_MULTIPLIERS,
  SEASON_NAMES,
  QI_STATE_NAMES
};
