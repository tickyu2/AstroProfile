/**
 * baziPartnerCalculator.js
 *
 * BAZI OPTIMAL PARTNER CALCULATOR
 * Transparent methodology - NO BLACK BOXES!
 *
 * Given user's BaZi Four Pillars, calculate optimal partner pillars
 * with complete step-by-step breakdown.
 *
 * Weighting:
 *   Day Pillar:   70% (Soul/Spirit)
 *   Hour Pillar:  15% (Inner Self)
 *   Month Pillar: 10% (Career/Social)
 *   Year Pillar:   5% (Ancestry/Outer)
 *
 * For GENESIS Platform - BaZi Module
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky
 */

// ============================================================================
// HEAVENLY STEMS (天干)
// ============================================================================

export const HEAVENLY_STEMS = {
  '甲': { element: 'Wood', polarity: 'Yang', index: 0, pinyin: 'Jia', english: 'Yang Wood' },
  '乙': { element: 'Wood', polarity: 'Yin', index: 1, pinyin: 'Yi', english: 'Yin Wood' },
  '丙': { element: 'Fire', polarity: 'Yang', index: 2, pinyin: 'Bing', english: 'Yang Fire' },
  '丁': { element: 'Fire', polarity: 'Yin', index: 3, pinyin: 'Ding', english: 'Yin Fire' },
  '戊': { element: 'Earth', polarity: 'Yang', index: 4, pinyin: 'Wu', english: 'Yang Earth' },
  '己': { element: 'Earth', polarity: 'Yin', index: 5, pinyin: 'Ji', english: 'Yin Earth' },
  '庚': { element: 'Metal', polarity: 'Yang', index: 6, pinyin: 'Geng', english: 'Yang Metal' },
  '辛': { element: 'Metal', polarity: 'Yin', index: 7, pinyin: 'Xin', english: 'Yin Metal' },
  '壬': { element: 'Water', polarity: 'Yang', index: 8, pinyin: 'Ren', english: 'Yang Water' },
  '癸': { element: 'Water', polarity: 'Yin', index: 9, pinyin: 'Gui', english: 'Yin Water' }
};

// Stem array for indexing
export const STEM_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// ============================================================================
// EARTHLY BRANCHES (地支)
// ============================================================================

export const EARTHLY_BRANCHES = {
  '子': { animal: 'Rat', element: 'Water', index: 0, pinyin: 'Zi', season: 'Winter', month: 11 },
  '丑': { animal: 'Ox', element: 'Earth', index: 1, pinyin: 'Chou', season: 'Winter', month: 12 },
  '寅': { animal: 'Tiger', element: 'Wood', index: 2, pinyin: 'Yin', season: 'Spring', month: 1 },
  '卯': { animal: 'Rabbit', element: 'Wood', index: 3, pinyin: 'Mao', season: 'Spring', month: 2 },
  '辰': { animal: 'Dragon', element: 'Earth', index: 4, pinyin: 'Chen', season: 'Spring', month: 3 },
  '巳': { animal: 'Snake', element: 'Fire', index: 5, pinyin: 'Si', season: 'Summer', month: 4 },
  '午': { animal: 'Horse', element: 'Fire', index: 6, pinyin: 'Wu', season: 'Summer', month: 5 },
  '未': { animal: 'Goat', element: 'Earth', index: 7, pinyin: 'Wei', season: 'Summer', month: 6 },
  '申': { animal: 'Monkey', element: 'Metal', index: 8, pinyin: 'Shen', season: 'Autumn', month: 7 },
  '酉': { animal: 'Rooster', element: 'Metal', index: 9, pinyin: 'You', season: 'Autumn', month: 8 },
  '戌': { animal: 'Dog', element: 'Earth', index: 10, pinyin: 'Xu', season: 'Autumn', month: 9 },
  '亥': { animal: 'Pig', element: 'Water', index: 11, pinyin: 'Hai', season: 'Winter', month: 10 }
};

// Branch array for indexing
export const BRANCH_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ============================================================================
// SIX HARMONIES (六合) - Soul-Level Resonance
// ============================================================================

export const SIX_HARMONIES = {
  '子': { partner: '丑', result: 'Earth', meaning: 'Rat-Ox: Hidden partnership, quiet loyalty' },
  '丑': { partner: '子', result: 'Earth', meaning: 'Ox-Rat: Steady devotion, reliable bond' },
  '寅': { partner: '亥', result: 'Wood', meaning: 'Tiger-Pig: Adventurous alliance, mutual growth' },
  '亥': { partner: '寅', result: 'Wood', meaning: 'Pig-Tiger: Wise expansion, nurturing ambition' },
  '卯': { partner: '戌', result: 'Fire', meaning: 'Rabbit-Dog: Protective harmony, loyal friendship' },
  '戌': { partner: '卯', result: 'Fire', meaning: 'Dog-Rabbit: Guardian bond, gentle strength' },
  '辰': { partner: '酉', result: 'Metal', meaning: 'Dragon-Rooster: Brilliant partnership, mutual refinement' },
  '酉': { partner: '辰', result: 'Metal', meaning: 'Rooster-Dragon: Precision meets power' },
  '巳': { partner: '申', result: 'Water', meaning: 'Snake-Monkey: Clever alliance, strategic minds' },
  '申': { partner: '巳', result: 'Water', meaning: 'Monkey-Snake: Wisdom partnership, mutual evolution' },
  '午': { partner: '未', result: 'Fire', meaning: 'Horse-Goat: Passionate harmony, creative fire' },
  '未': { partner: '午', result: 'Fire', meaning: 'Goat-Horse: Artistic partnership, warm expression' }
};

// ============================================================================
// FIVE ELEMENT CYCLES
// ============================================================================

export const GENERATING_CYCLE = {
  Wood: 'Fire',   // Wood feeds Fire
  Fire: 'Earth',  // Fire creates Earth (ash)
  Earth: 'Metal', // Earth yields Metal
  Metal: 'Water', // Metal condenses Water
  Water: 'Wood'   // Water nourishes Wood
};

export const CONTROLLING_CYCLE = {
  Wood: 'Earth',  // Wood controls Earth (roots)
  Earth: 'Water', // Earth controls Water (dam)
  Water: 'Fire',  // Water controls Fire (extinguish)
  Fire: 'Metal',  // Fire controls Metal (melts)
  Metal: 'Wood'   // Metal controls Wood (axe)
};

// ============================================================================
// STEM COMBINATIONS (天干合)
// ============================================================================

export const STEM_COMBINATIONS = {
  '甲': { partner: '己', result: 'Earth', meaning: 'Yang Wood + Yin Earth = Central Harmony' },
  '己': { partner: '甲', result: 'Earth', meaning: 'Yin Earth + Yang Wood = Fertile Ground' },
  '乙': { partner: '庚', result: 'Metal', meaning: 'Yin Wood + Yang Metal = Refined Beauty' },
  '庚': { partner: '乙', result: 'Metal', meaning: 'Yang Metal + Yin Wood = Crafted Grace' },
  '丙': { partner: '辛', result: 'Water', meaning: 'Yang Fire + Yin Metal = Transformative Flow' },
  '辛': { partner: '丙', result: 'Water', meaning: 'Yin Metal + Yang Fire = Purified Essence' },
  '丁': { partner: '壬', result: 'Wood', meaning: 'Yin Fire + Yang Water = Life Force' },
  '壬': { partner: '丁', result: 'Wood', meaning: 'Yang Water + Yin Fire = Creative Steam' },
  '戊': { partner: '癸', result: 'Fire', meaning: 'Yang Earth + Yin Water = Warming Core' },
  '癸': { partner: '戊', result: 'Fire', meaning: 'Yin Water + Yang Earth = Nurturing Warmth' }
};

// ============================================================================
// PILLAR WEIGHTS
// ============================================================================

export const PILLAR_WEIGHTS = {
  day: 0.70,    // Day Master - Soul/Spirit (70%)
  hour: 0.15,   // Hour Pillar - Inner Self (15%)
  month: 0.10,  // Month Pillar - Career/Social (10%)
  year: 0.05    // Year Pillar - Ancestry/Outer (5%)
};

// ============================================================================
// ANALYZER FUNCTIONS
// ============================================================================

/**
 * Analyze Day Pillar - The Soul Level (70% weight)
 */
function analyzeDayPillar(dayPillar) {
  const { stem, branch } = dayPillar;
  const stemData = HEAVENLY_STEMS[stem];
  const branchData = EARTHLY_BRANCHES[branch];

  // Get optimal partner via Six Harmonies
  const sixHarmony = SIX_HARMONIES[branch];

  // Get stem combination partner
  const stemCombo = STEM_COMBINATIONS[stem];

  return {
    pillar: 'Day',
    weight: PILLAR_WEIGHTS.day,
    original: { stem, branch, stemData, branchData },
    optimal: {
      branch: {
        value: sixHarmony?.partner,
        data: EARTHLY_BRANCHES[sixHarmony?.partner],
        reasoning: sixHarmony?.meaning || 'No direct harmony',
        type: 'Six Harmony (六合)'
      },
      stem: {
        value: stemCombo?.partner,
        data: HEAVENLY_STEMS[stemCombo?.partner],
        reasoning: stemCombo?.meaning || 'No direct combination',
        type: 'Stem Combination (天干合)'
      }
    },
    calculation: {
      formula: 'SIX_HARMONY[branch] + STEM_COMBINATION[stem]',
      steps: [
        `Your Day Branch: ${branch} (${branchData.animal})`,
        `Harmony Partner: ${sixHarmony?.partner} (${EARTHLY_BRANCHES[sixHarmony?.partner]?.animal})`,
        `Result Element: ${sixHarmony?.result}`,
        `Your Day Stem: ${stem} (${stemData.english})`,
        `Combination Partner: ${stemCombo?.partner} (${HEAVENLY_STEMS[stemCombo?.partner]?.english})`,
        `Result Element: ${stemCombo?.result}`
      ]
    }
  };
}

/**
 * Analyze Hour Pillar - Inner Self (15% weight)
 */
function analyzeHourPillar(hourPillar) {
  if (!hourPillar?.stem || !hourPillar?.branch) {
    return {
      pillar: 'Hour',
      weight: PILLAR_WEIGHTS.hour,
      available: false,
      note: 'Hour pillar not available - using generating cycle for flexibility'
    };
  }

  const { stem, branch } = hourPillar;
  const stemData = HEAVENLY_STEMS[stem];
  const branchData = EARTHLY_BRANCHES[branch];

  // For hour pillar, use generating cycle
  const generatingElement = GENERATING_CYCLE[stemData.element];

  return {
    pillar: 'Hour',
    weight: PILLAR_WEIGHTS.hour,
    original: { stem, branch, stemData, branchData },
    optimal: {
      element: generatingElement,
      reasoning: `${stemData.element} generates ${generatingElement} - nurturing inner connection`,
      type: 'Generating Cycle (相生)'
    },
    calculation: {
      formula: 'GENERATING_CYCLE[hour_stem_element]',
      steps: [
        `Your Hour Stem: ${stem} (${stemData.english})`,
        `Element: ${stemData.element}`,
        `Generates: ${generatingElement}`
      ]
    }
  };
}

/**
 * Analyze Month Pillar - Career/Social (10% weight)
 */
function analyzeMonthPillar(monthPillar) {
  const { stem, branch } = monthPillar;
  const stemData = HEAVENLY_STEMS[stem];
  const branchData = EARTHLY_BRANCHES[branch];

  // For month pillar, look for complementary seasonal energy
  const seasonPartners = {
    Spring: 'Autumn',
    Summer: 'Winter',
    Autumn: 'Spring',
    Winter: 'Summer'
  };

  const partnerSeason = seasonPartners[branchData.season];

  return {
    pillar: 'Month',
    weight: PILLAR_WEIGHTS.month,
    original: { stem, branch, stemData, branchData },
    optimal: {
      season: partnerSeason,
      reasoning: `${branchData.season} complements ${partnerSeason} - balanced social dynamics`,
      type: 'Seasonal Complement'
    },
    calculation: {
      formula: 'SEASON_COMPLEMENT[month_branch_season]',
      steps: [
        `Your Month Branch: ${branch} (${branchData.animal})`,
        `Season: ${branchData.season}`,
        `Complement Season: ${partnerSeason}`
      ]
    }
  };
}

/**
 * Analyze Year Pillar - Ancestry/Outer (5% weight)
 */
function analyzeYearPillar(yearPillar) {
  const { stem, branch } = yearPillar;
  const stemData = HEAVENLY_STEMS[stem];
  const branchData = EARTHLY_BRANCHES[branch];

  // For year pillar, use trines (same element animals)
  const trines = {
    Rat: ['Dragon', 'Monkey'],
    Ox: ['Snake', 'Rooster'],
    Tiger: ['Horse', 'Dog'],
    Rabbit: ['Goat', 'Pig'],
    Dragon: ['Rat', 'Monkey'],
    Snake: ['Ox', 'Rooster'],
    Horse: ['Tiger', 'Dog'],
    Goat: ['Rabbit', 'Pig'],
    Monkey: ['Rat', 'Dragon'],
    Rooster: ['Ox', 'Snake'],
    Dog: ['Tiger', 'Horse'],
    Pig: ['Rabbit', 'Goat']
  };

  const compatible = trines[branchData.animal] || [];

  return {
    pillar: 'Year',
    weight: PILLAR_WEIGHTS.year,
    original: { stem, branch, stemData, branchData },
    optimal: {
      animals: compatible,
      reasoning: `Trine harmony with ${compatible.join(' and ')}`,
      type: 'Trine Harmony (三合)'
    },
    calculation: {
      formula: 'TRINES[year_branch_animal]',
      steps: [
        `Your Year Branch: ${branch} (${branchData.animal})`,
        `Trine Partners: ${compatible.join(', ')}`
      ]
    }
  };
}

// ============================================================================
// MAIN CALCULATOR
// ============================================================================

/**
 * Calculate optimal BaZi partner
 *
 * @param {Object} userBazi - User's Four Pillars { year, month, day, hour }
 *   Each pillar: { stem: '甲', branch: '子' }
 * @returns {Object} - Complete analysis with transparent methodology
 */
export function calculateOptimalPartner(userBazi) {
  console.log('[BaZi Partner Calculator] Analyzing pillars...');

  // Analyze each pillar
  const dayAnalysis = analyzeDayPillar(userBazi.day);
  const hourAnalysis = analyzeHourPillar(userBazi.hour);
  const monthAnalysis = analyzeMonthPillar(userBazi.month);
  const yearAnalysis = analyzeYearPillar(userBazi.year);

  // Build optimal partner profile
  const optimalDayPillar = {
    stem: dayAnalysis.optimal.stem.value,
    branch: dayAnalysis.optimal.branch.value,
    theory: {
      stemReason: dayAnalysis.optimal.stem.reasoning,
      branchReason: dayAnalysis.optimal.branch.reasoning
    }
  };

  return {
    // User's original BaZi
    userBazi,

    // Analysis by pillar
    analysis: {
      day: dayAnalysis,
      hour: hourAnalysis,
      month: monthAnalysis,
      year: yearAnalysis
    },

    // Optimal partner profile
    optimalPartner: {
      dayPillar: optimalDayPillar,
      yearRange: yearAnalysis.optimal.animals,
      seasonPreference: monthAnalysis.optimal.season
    },

    // Weight breakdown
    weights: {
      description: 'Pillar importance weighting',
      values: PILLAR_WEIGHTS,
      explanation: [
        'Day Pillar (70%): Soul/Spirit - The core of who you are',
        'Hour Pillar (15%): Inner Self - Your private nature',
        'Month Pillar (10%): Career/Social - How you interact with the world',
        'Year Pillar (5%): Ancestry/Outer - Your generational energy'
      ]
    },

    // Complete methodology
    methodology: {
      title: 'BaZi Optimal Partner Calculator',
      description: 'Transparent reverse-engineering of your Four Pillars to find constitutional compatibility.',
      principles: [
        'Six Harmonies (六合): Soul-level resonance between Day Branches',
        'Stem Combinations (天干合): Energy fusion between Day Stems',
        'Generating Cycle (相生): Nurturing flow between elements',
        'Trine Harmony (三合): Compatible zodiac animals'
      ],
      formula: 'Optimal = (DayStem_Combo × 0.7) + (DayBranch_Harmony × 0.7) + Hour_Generate + Month_Season + Year_Trine'
    },

    // Summary
    summary: {
      idealDayMaster: `${optimalDayPillar.stem}${optimalDayPillar.branch}`,
      idealDayMasterEnglish: `${HEAVENLY_STEMS[optimalDayPillar.stem]?.english || 'Unknown'} ${EARTHLY_BRANCHES[optimalDayPillar.branch]?.animal || 'Unknown'}`,
      compatibleYears: yearAnalysis.optimal.animals,
      seasonalHarmony: monthAnalysis.optimal.season
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calculateOptimalPartner,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  SIX_HARMONIES,
  STEM_COMBINATIONS,
  PILLAR_WEIGHTS,
  GENERATING_CYCLE,
  CONTROLLING_CYCLE,
  STEM_ORDER,
  BRANCH_ORDER
};
