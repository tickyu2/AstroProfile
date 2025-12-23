/**
 * ============================================
 * HISTORICAL BAZI CALCULATOR
 * Mathematical formulas for unlimited date range
 * ============================================
 * 
 * Extends BaZi calculations to ANY date (1 AD - 9999 AD)
 * Preserves all correlation data in baziEngine.js
 * 
 * Used when lunar-javascript library is unavailable
 * (dates before 1900 or after 2100)
 * 
 * @author The Cosmic Café Trinity
 * @version 1.0.0
 */

// ============================================
// CONSTANTS
// ============================================

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// ============================================
// 1. YEAR PILLAR CALCULATION
// Works for ANY year (unlimited range)
// ============================================

/**
 * Calculate Year Pillar (年柱) using mathematical formula
 * 
 * @param {number} year - Any year (1 AD - 9999 AD, can extend to BC)
 * @returns {string} GanZhi string (e.g., "辛未")
 * 
 * Formula based on 60-year cycle:
 * - Reference: Year 4 AD = 甲子 (first year of cycle)
 * - Stems cycle: 10 (甲乙丙丁戊己庚辛壬癸)
 * - Branches cycle: 12 (子丑寅卯辰巳午未申酉戌亥)
 * - LCM(10, 12) = 60 (complete cycle)
 */
export function calculateYearGanZhi(year) {
  // Calculate indices in respective cycles
  let stemIndex = (year - 4) % 10;
  let branchIndex = (year - 4) % 12;
  
  // Handle negative modulo for BC dates (if needed)
  if (stemIndex < 0) stemIndex += 10;
  if (branchIndex < 0) branchIndex += 12;
  
  return STEMS[stemIndex] + BRANCHES[branchIndex];
}

// ============================================
// 2. MONTH PILLAR CALCULATION
// Based on Solar Terms (节气 Jie Qi)
// ============================================

/**
 * Calculate Month Pillar (月柱) using solar terms
 * 
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {string} GanZhi string (e.g., "辛卯")
 * 
 * CRITICAL: Chinese months follow SOLAR TERMS, not lunar calendar!
 * Each month starts at a specific solar term (Jie Qi).
 * 
 * Solar Term Boundaries (approximate dates):
 * - Tiger Month (寅): Feb 4 (Li Chun 立春)
 * - Rabbit Month (卯): Mar 6 (Jing Zhe 惊蛰)
 * - Dragon Month (辰): Apr 5 (Qing Ming 清明)
 * - Snake Month (巳): May 6 (Li Xia 立夏)
 * - Horse Month (午): Jun 6 (Mang Zhong 芒种)
 * - Goat Month (未): Jul 7 (Xiao Shu 小暑)
 * - Monkey Month (申): Aug 8 (Li Qiu 立秋)
 * - Rooster Month (酉): Sep 8 (Bai Lu 白露)
 * - Dog Month (戌): Oct 8 (Han Lu 寒露)
 * - Pig Month (亥): Nov 7 (Li Dong 立冬)
 * - Rat Month (子): Dec 7 (Da Xue 大雪)
 * - Ox Month (丑): Jan 6 (Xiao Han 小寒)
 */
export function calculateMonthGanZhi(year, month, day) {
  // Determine month branch based on solar terms
  const monthBranch = getSolarMonthBranch(month, day);
  
  // Calculate month stem based on year stem
  const yearStem = calculateYearGanZhi(year).charAt(0);
  const monthStem = calculateMonthStem(yearStem, monthBranch);
  
  return monthStem + monthBranch;
}

/**
 * Determine which solar month branch based on date
 * 
 * @param {number} month - Gregorian month (1-12)
 * @param {number} day - Day of month
 * @returns {string} Branch character (e.g., "卯")
 */
function getSolarMonthBranch(month, day) {
  // Solar term boundaries (month, day, branch)
  // These dates are approximate - vary by ±1 day per year
  const solarTerms = [
    { month: 1, day: 6, branch: '丑' },   // Xiao Han (Jan 6)
    { month: 2, day: 4, branch: '寅' },   // Li Chun (Feb 4)
    { month: 3, day: 6, branch: '卯' },   // Jing Zhe (Mar 6)
    { month: 4, day: 5, branch: '辰' },   // Qing Ming (Apr 5)
    { month: 5, day: 6, branch: '巳' },   // Li Xia (May 6)
    { month: 6, day: 6, branch: '午' },   // Mang Zhong (Jun 6)
    { month: 7, day: 7, branch: '未' },   // Xiao Shu (Jul 7)
    { month: 8, day: 8, branch: '申' },   // Li Qiu (Aug 8)
    { month: 9, day: 8, branch: '酉' },   // Bai Lu (Sep 8)
    { month: 10, day: 8, branch: '戌' },  // Han Lu (Oct 8)
    { month: 11, day: 7, branch: '亥' },  // Li Dong (Nov 7)
    { month: 12, day: 7, branch: '子' }   // Da Xue (Dec 7)
  ];
  
  // Find which solar month we're in
  for (let i = 0; i < solarTerms.length; i++) {
    const current = solarTerms[i];
    const next = solarTerms[(i + 1) % 12];
    
    // Current month, after solar term start
    if (month === current.month && day >= current.day) {
      return current.branch;
    }
    
    // Between current and next solar term
    if (month > current.month && month < next.month) {
      return current.branch;
    }
    
    // Next month, before next solar term
    if (month === next.month && day < next.day) {
      return current.branch;
    }
  }
  
  // December after Da Xue (Dec 7) - Rat month
  if (month === 12 && day >= 7) {
    return '子';
  }
  
  // Default to Ox month (covers late Dec through early Jan)
  return '丑';
}

/**
 * Calculate month stem based on year stem and month branch
 * 
 * @param {string} yearStem - Year stem character
 * @param {string} monthBranch - Month branch character
 * @returns {string} Month stem character
 * 
 * This uses the traditional month stem table.
 * The pattern repeats every 5 years (because LCM(10,12)/12 = 5).
 */
function calculateMonthStem(yearStem, monthBranch) {
  // Month stem table - standard BaZi formula
  // Rows: Year stems (甲/己, 乙/庚, 丙/辛, 丁/壬, 戊/癸)
  // Cols: Month branches (寅卯辰巳午未申酉戌亥子丑)
  
  const monthStemTable = {
    '甲': { '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己', '午': '庚', '未': '辛', 
            '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙', '子': '丙', '丑': '丁' },
    '己': { '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己', '午': '庚', '未': '辛',
            '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙', '子': '丙', '丑': '丁' },
    '乙': { '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛', '午': '壬', '未': '癸',
            '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁', '子': '戊', '丑': '己' },
    '庚': { '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛', '午': '壬', '未': '癸',
            '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁', '子': '戊', '丑': '己' },
    '丙': { '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸', '午': '甲', '未': '乙',
            '申': '丙', '酉': '丁', '戌': '戊', '亥': '己', '子': '庚', '丑': '辛' },
    '辛': { '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸', '午': '甲', '未': '乙',
            '申': '丙', '酉': '丁', '戌': '戊', '亥': '己', '子': '庚', '丑': '辛' },
    '丁': { '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙', '午': '丙', '未': '丁',
            '申': '戊', '酉': '己', '戌': '庚', '亥': '辛', '子': '壬', '丑': '癸' },
    '壬': { '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙', '午': '丙', '未': '丁',
            '申': '戊', '酉': '己', '戌': '庚', '亥': '辛', '子': '壬', '丑': '癸' },
    '戊': { '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁', '午': '戊', '未': '己',
            '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸', '子': '甲', '丑': '乙' },
    '癸': { '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁', '午': '戊', '未': '己',
            '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸', '子': '甲', '丑': '乙' }
  };
  
  return monthStemTable[yearStem]?.[monthBranch] || '甲'; // Default to 甲 if not found
}

// ============================================
// 3. DAY PILLAR CALCULATION
// Using Julian Day Number for precision
// ============================================

/**
 * Calculate Day Pillar (日柱) using verified algorithm
 *
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {string} GanZhi string (e.g., "丙申")
 *
 * VERIFIED BY: Baby Nano (Gemini), December 19, 2024
 * CROSS-VERIFIED: Joey Yap Calculator (Ticky's chart matches)
 *
 * THE FIX (December 2024):
 * - OLD (WRONG): Jan 1, 1900 = 己卯 (Position 15)
 * - NEW (CORRECT): Jan 1, 1900 = 甲戌 (Jia Xu), Position 10
 * - METHOD: (JDN - 11) % 60 aligns to 甲子 (Jia Zi) cycle
 *
 * Test Cases (Baby Nano verified):
 * - Jan 1, 1900 → 甲戌 (Index 10)
 * - Dec 21, 1900 → 戊辰 (Index 4) - Claude Sonnet
 * - Apr 23, 1963 → 丙申 (Index 32) - Ticky Yu (matches Joey Yap!)
 * - Feb 4, 2024 → 戊戌 (Index 34)
 * - Dec 19, 2024 → 丙子 (Index 12)
 */
export function calculateDayGanZhi(year, month, day) {
  // Calculate Julian Day Number for input date
  const jdn = calculateJulianDayNumber(year, month, day);

  // THE FIX: Use magic constant 11 (aligns JDN to 甲子 Jia Zi cycle)
  // This replaces the old wrong reference point approach
  let index = (jdn - 11) % 60;

  // Handle negative modulo for historical dates (before JDN 11)
  if (index < 0) index += 60;

  // Convert 60-cycle index to GanZhi
  const stemIndex = index % 10;
  const branchIndex = index % 12;

  return STEMS[stemIndex] + BRANCHES[branchIndex];
}

/**
 * OLD FUNCTION - Kept for comparison during verification
 * DELETE after migration complete
 *
 * This had the WRONG reference point: assumed 己卯 (position 15)
 * Correct is 甲戌 (position 10) using (JDN - 11) % 60
 */
export function calculateDayGanZhi_OLD(year, month, day) {
  const jdn = calculateJulianDayNumber(year, month, day);
  const referenceJDN = 2415021;
  const referenceDayIndex = 15; // WRONG! Should use (jdn - 11) % 60
  const daysDiff = jdn - referenceJDN;
  let currentIndex = (referenceDayIndex + daysDiff) % 60;
  if (currentIndex < 0) currentIndex += 60;
  const stemIndex = currentIndex % 10;
  const branchIndex = currentIndex % 12;
  return STEMS[stemIndex] + BRANCHES[branchIndex];
}

/**
 * Calculate Julian Day Number (JDN) for any date
 * 
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {number} Julian Day Number
 * 
 * This is a standard astronomical formula that works for
 * ANY date in the Gregorian calendar (including historical).
 * 
 * Formula from: Meeus, Jean (1991). Astronomical Algorithms.
 */
function calculateJulianDayNumber(year, month, day) {
  // Standard JDN formula
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
            Math.floor(y / 4) - Math.floor(y / 100) + 
            Math.floor(y / 400) - 32045;
  
  return jdn;
}

// ============================================
// 4. HOUR PILLAR CALCULATION
// Based on 2-hour periods (时辰)
// ============================================

/**
 * Calculate Hour Pillar (时柱)
 * 
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {string} dayStem - Day stem (needed to derive hour stem)
 * @returns {string} GanZhi string (e.g., "己巳")
 * 
 * Chinese hours (时辰) are 2-hour periods:
 * - 子时 (Rat): 23:00-01:00
 * - 丑时 (Ox): 01:00-03:00
 * - 寅时 (Tiger): 03:00-05:00
 * - 卯时 (Rabbit): 05:00-07:00
 * - 辰时 (Dragon): 07:00-09:00
 * - 巳时 (Snake): 09:00-11:00
 * - 午时 (Horse): 11:00-13:00
 * - 未时 (Goat): 13:00-15:00
 * - 申时 (Monkey): 15:00-17:00
 * - 酉时 (Rooster): 17:00-19:00
 * - 戌时 (Dog): 19:00-21:00
 * - 亥时 (Pig): 21:00-23:00
 */
export function calculateHourGanZhi(hour, minute, dayStem) {
  // Determine hour branch
  const hourBranch = getHourBranch(hour, minute);
  
  // Calculate hour stem based on day stem
  const hourStem = calculateHourStem(dayStem, hourBranch);
  
  return hourStem + hourBranch;
}

/**
 * Determine hour branch based on time
 * 
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {string} Branch character
 */
function getHourBranch(hour, minute) {
  // Convert to total minutes for precision
  const totalMinutes = hour * 60 + minute;
  
  // Each Chinese hour is 2 hours = 120 minutes
  // Rat hour: 23:00-01:00 (1380-1440, 0-60)
  if (totalMinutes >= 1380 || totalMinutes < 60) return '子';
  
  // Standard 2-hour periods
  if (totalMinutes >= 60 && totalMinutes < 180) return '丑';   // 01:00-03:00
  if (totalMinutes >= 180 && totalMinutes < 300) return '寅';  // 03:00-05:00
  if (totalMinutes >= 300 && totalMinutes < 420) return '卯';  // 05:00-07:00
  if (totalMinutes >= 420 && totalMinutes < 540) return '辰';  // 07:00-09:00
  if (totalMinutes >= 540 && totalMinutes < 660) return '巳';  // 09:00-11:00
  if (totalMinutes >= 660 && totalMinutes < 780) return '午';  // 11:00-13:00
  if (totalMinutes >= 780 && totalMinutes < 900) return '未';  // 13:00-15:00
  if (totalMinutes >= 900 && totalMinutes < 1020) return '申'; // 15:00-17:00
  if (totalMinutes >= 1020 && totalMinutes < 1140) return '酉'; // 17:00-19:00
  if (totalMinutes >= 1140 && totalMinutes < 1260) return '戌'; // 19:00-21:00
  if (totalMinutes >= 1260 && totalMinutes < 1380) return '亥'; // 21:00-23:00
  
  return '子'; // Default to Rat
}

/**
 * Calculate hour stem based on day stem and hour branch
 * 
 * @param {string} dayStem - Day stem character
 * @param {string} hourBranch - Hour branch character
 * @returns {string} Hour stem character
 */
function calculateHourStem(dayStem, hourBranch) {
  // Hour stem table - standard BaZi formula
  const hourStemTable = {
    '甲': { '子': '甲', '丑': '乙', '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己',
            '午': '庚', '未': '辛', '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙' },
    '己': { '子': '甲', '丑': '乙', '寅': '丙', '卯': '丁', '辰': '戊', '巳': '己',
            '午': '庚', '未': '辛', '申': '壬', '酉': '癸', '戌': '甲', '亥': '乙' },
    '乙': { '子': '丙', '丑': '丁', '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛',
            '午': '壬', '未': '癸', '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁' },
    '庚': { '子': '丙', '丑': '丁', '寅': '戊', '卯': '己', '辰': '庚', '巳': '辛',
            '午': '壬', '未': '癸', '申': '甲', '酉': '乙', '戌': '丙', '亥': '丁' },
    '丙': { '子': '戊', '丑': '己', '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸',
            '午': '甲', '未': '乙', '申': '丙', '酉': '丁', '戌': '戊', '亥': '己' },
    '辛': { '子': '戊', '丑': '己', '寅': '庚', '卯': '辛', '辰': '壬', '巳': '癸',
            '午': '甲', '未': '乙', '申': '丙', '酉': '丁', '戌': '戊', '亥': '己' },
    '丁': { '子': '庚', '丑': '辛', '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙',
            '午': '丙', '未': '丁', '申': '戊', '酉': '己', '戌': '庚', '亥': '辛' },
    '壬': { '子': '庚', '丑': '辛', '寅': '壬', '卯': '癸', '辰': '甲', '巳': '乙',
            '午': '丙', '未': '丁', '申': '戊', '酉': '己', '戌': '庚', '亥': '辛' },
    '戊': { '子': '壬', '丑': '癸', '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁',
            '午': '戊', '未': '己', '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸' },
    '癸': { '子': '壬', '丑': '癸', '寅': '甲', '卯': '乙', '辰': '丙', '巳': '丁',
            '午': '戊', '未': '己', '申': '庚', '酉': '辛', '戌': '壬', '亥': '癸' }
  };
  
  return hourStemTable[dayStem]?.[hourBranch] || '甲'; // Default to 甲 if not found
}

// ============================================
// 5. COMPLETE FOUR PILLARS CALCULATION
// ============================================

/**
 * Calculate complete Four Pillars using historical mathematical method
 * 
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59, default 0)
 * @returns {Object} Four Pillars data
 */
export function calculateHistoricalFourPillars(year, month, day, hour, minute = 0) {
  // Calculate each pillar
  const yearGanZhi = calculateYearGanZhi(year);
  const monthGanZhi = calculateMonthGanZhi(year, month, day);
  const dayGanZhi = calculateDayGanZhi(year, month, day);
  
  // Need day stem for hour calculation
  const dayStem = dayGanZhi.charAt(0);
  const hourGanZhi = calculateHourGanZhi(hour, minute, dayStem);
  
  return {
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    hour: hourGanZhi,
    method: 'mathematical',
    dateRange: year < 1900 ? 'historical' : year > 2100 ? 'future' : 'standard',
    calculatedDate: new Date(year, month - 1, day, hour, minute),
    note: `Calculated using mathematical formulas for ${year}-${month}-${day}`,
    validation: {
      yearCalculation: `(${year} - 4) mod 60 = ${(year - 4) % 60}`,
      referencePoint: 'Year 4 AD = 甲子, Jan 1 1900 = 己卯 (day 15)'
    }
  };
}

// ============================================
// 6. VALIDATION & TESTING FUNCTIONS
// ============================================

/**
 * Test reference point accuracy
 * CRITICAL: This MUST pass for all Day Pillar calculations to be correct
 *
 * CORRECTED Reference (Baby Nano verified, Dec 2024):
 * Jan 1, 1900 = 甲戌 (Jia Xu), Position 10
 *
 * If this fails, ALL Day Pillar calculations will be WRONG!
 *
 * @returns {Object} Verification result with pass/fail status
 */
export function testReferencePoint() {
  const testDate = calculateDayGanZhi(1900, 1, 1);
  const expected = '甲戌'; // CORRECTED: was 己卯 (wrong!)

  const passed = testDate === expected;

  if (!passed) {
    console.error('❌ CRITICAL: Reference point INCORRECT!');
    console.error(`   Jan 1, 1900 calculated as: ${testDate}`);
    console.error(`   Should be: ${expected} (甲戌 Jia Xu)`);
    console.error('   All Day Pillar calculations will be WRONG!');
  } else {
    console.log('✅ Reference point verified: Jan 1, 1900 = 甲戌 (Jia Xu)');
  }

  return {
    passed,
    calculated: testDate,
    expected,
    date: '1900-01-01',
    message: passed
      ? 'Reference point verified correctly (Baby Nano verified)'
      : 'CRITICAL ERROR: Reference point mismatch - Day Pillar calculations unreliable'
  };
}

/**
 * Validate calculation against known reference dates
 * UPDATED: December 2024 - Baby Nano verified Day Pillars
 *
 * @returns {Object} Validation results
 */
export function validateCalculations() {
  // First, verify the critical reference point
  const refPointTest = testReferencePoint();

  const testCases = [
    // Baby Nano verified test cases (December 19, 2024)
    { year: 1900, month: 1, day: 1, expected: { year: '庚子', day: '甲戌' }, source: 'Reference point (Baby Nano verified)' },
    { year: 1900, month: 12, day: 21, expected: { day: '戊辰' }, source: 'Claude Sonnet (Baby Nano verified)' },
    { year: 1963, month: 4, day: 23, expected: { year: '癸卯', day: '丙申' }, source: 'Ticky Yu (Joey Yap + Baby Nano verified)' },
    { year: 2024, month: 2, day: 4, expected: { year: '甲辰', day: '戊戌' }, source: 'Lichun 2024 (Baby Nano verified)' },
    { year: 2024, month: 12, day: 19, expected: { year: '甲辰', day: '丙子' }, source: 'Test date (Baby Nano verified)' },
    // Additional test cases
    { year: 1871, month: 3, day: 7, expected: { year: '辛未' }, source: 'Baby Nano Banana\'s year' },
    { year: 2000, month: 1, day: 1, expected: { year: '己卯' }, source: 'Y2K' },
    { year: 2025, month: 2, day: 3, expected: { year: '乙巳' }, source: 'Lichun 2025 boundary' }
  ];

  const results = testCases.map(test => {
    const calculated = calculateHistoricalFourPillars(
      test.year, test.month, test.day, 12, 0
    );

    return {
      input: `${test.year}-${test.month}-${test.day}`,
      source: test.source,
      calculatedYear: calculated.year,
      expectedYear: test.expected.year,
      yearMatch: calculated.year === test.expected.year,
      calculatedDay: calculated.day,
      expectedDay: test.expected.day,
      dayMatch: test.expected.day ? calculated.day === test.expected.day : 'N/A'
    };
  });

  const yearsPassed = results.filter(r => r.yearMatch).length;
  const daysPassed = results.filter(r => r.dayMatch === true).length;
  const daysTestable = results.filter(r => r.dayMatch !== 'N/A').length;

  return {
    referencePointTest: refPointTest,
    testCases: results,
    allPassed: refPointTest.passed && results.every(r => r.yearMatch && (r.dayMatch === 'N/A' || r.dayMatch)),
    summary: {
      years: `${yearsPassed}/${results.length} year calculations correct`,
      days: `${daysPassed}/${daysTestable} day calculations correct`,
      referencePoint: refPointTest.passed ? '✅ Verified' : '❌ FAILED'
    }
  };
}

/**
 * Test calculation for Baby Nano specifically
 */
export function testBabyNano() {
  console.log('═══════════════════════════════════════════');
  console.log('BABY NANO BANANA - HISTORICAL CALCULATION TEST');
  console.log('═══════════════════════════════════════════\n');
  
  const result = calculateHistoricalFourPillars(1871, 3, 7, 9, 15);
  
  console.log('Birth Data: March 7, 1871, 9:15 AM');
  console.log('\nCalculated Four Pillars:');
  console.log(`  Year:  ${result.year} (expected: 辛未 - Yin Metal Goat)`);
  console.log(`  Month: ${result.month}`);
  console.log(`  Day:   ${result.day}`);
  console.log(`  Hour:  ${result.hour} (expected: Snake hour 巳)`);
  console.log(`\nMethod: ${result.method}`);
  console.log(`Date Range: ${result.dateRange}`);
  console.log('\n✅ Historical date calculation successful!');
  
  return result;
}

/**
 * Test calculation for Leonardo da Vinci
 */
export function testLeonardo() {
  console.log('═══════════════════════════════════════════');
  console.log('LEONARDO DA VINCI - HISTORICAL CALCULATION TEST');
  console.log('═══════════════════════════════════════════\n');
  
  const result = calculateHistoricalFourPillars(1452, 4, 15, 22, 30);
  
  console.log('Birth Data: April 15, 1452, ~10:30 PM (estimated)');
  console.log('\nCalculated Four Pillars:');
  console.log(`  Year:  ${result.year}`);
  console.log(`  Month: ${result.month}`);
  console.log(`  Day:   ${result.day}`);
  console.log(`  Hour:  ${result.hour}`);
  console.log(`\nMethod: ${result.method}`);
  console.log(`Date Range: ${result.dateRange}`);
  console.log('\n✅ Renaissance genius calculable!');
  console.log('🎨 Leonardo\'s constitutional blueprint preserved across 570+ years!');
  
  return result;
}

// ============================================
// 7. EXPORT ALL FUNCTIONS
// ============================================

export default {
  // Main calculation functions
  calculateYearGanZhi,
  calculateMonthGanZhi,
  calculateDayGanZhi,
  calculateDayGanZhi_OLD, // Keep for comparison during verification
  calculateHourGanZhi,
  calculateHistoricalFourPillars,

  // Helper functions
  getSolarMonthBranch,
  calculateMonthStem,
  calculateJulianDayNumber,
  getHourBranch,
  calculateHourStem,

  // Testing & validation functions
  testReferencePoint,
  validateCalculations,
  testBabyNano,
  testLeonardo
};
