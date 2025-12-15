/**
 * ============================================
 * INDUSTRY-STANDARD FOUR PILLARS CALCULATOR
 * Using lunar-javascript for precise calculations
 * ============================================
 * 
 * This calculator uses the lunar-javascript library which:
 * - Handles Solar Terms (Jie Qi) precisely
 * - Uses astronomical calculations, not approximations
 * - Is the industry standard for BaZi calculations
 * - Cannot be refuted by other calculators
 */

import { Solar } from 'lunar-javascript';

// ============================================
// TRANSLATION TABLES
// ============================================

export const STEMS = {
  '甲': { name: 'Jiǎ', element: 'Wood', polarity: 'Yang', english: 'Yang Wood' },
  '乙': { name: 'Yǐ', element: 'Wood', polarity: 'Yin', english: 'Yin Wood' },
  '丙': { name: 'Bǐng', element: 'Fire', polarity: 'Yang', english: 'Yang Fire' },
  '丁': { name: 'Dīng', element: 'Fire', polarity: 'Yin', english: 'Yin Fire' },
  '戊': { name: 'Wù', element: 'Earth', polarity: 'Yang', english: 'Yang Earth' },
  '己': { name: 'Jǐ', element: 'Earth', polarity: 'Yin', english: 'Yin Earth' },
  '庚': { name: 'Gēng', element: 'Metal', polarity: 'Yang', english: 'Yang Metal' },
  '辛': { name: 'Xīn', element: 'Metal', polarity: 'Yin', english: 'Yin Metal' },
  '壬': { name: 'Rén', element: 'Water', polarity: 'Yang', english: 'Yang Water' },
  '癸': { name: 'Guǐ', element: 'Water', polarity: 'Yin', english: 'Yin Water' }
};

export const BRANCHES = {
  '子': { name: 'Zǐ', animal: 'Rat', element: 'Water', polarity: 'Yang' },
  '丑': { name: 'Chǒu', animal: 'Ox', element: 'Earth', polarity: 'Yin' },
  '寅': { name: 'Yín', animal: 'Tiger', element: 'Wood', polarity: 'Yang' },
  '卯': { name: 'Mǎo', animal: 'Rabbit', element: 'Wood', polarity: 'Yin' },
  '辰': { name: 'Chén', animal: 'Dragon', element: 'Earth', polarity: 'Yang' },
  '巳': { name: 'Sì', animal: 'Snake', element: 'Fire', polarity: 'Yin' },
  '午': { name: 'Wǔ', animal: 'Horse', element: 'Fire', polarity: 'Yang' },
  '未': { name: 'Wèi', animal: 'Goat', element: 'Earth', polarity: 'Yin' },
  '申': { name: 'Shēn', animal: 'Monkey', element: 'Metal', polarity: 'Yang' },
  '酉': { name: 'Yǒu', animal: 'Rooster', element: 'Metal', polarity: 'Yin' },
  '戌': { name: 'Xū', animal: 'Dog', element: 'Earth', polarity: 'Yang' },
  '亥': { name: 'Hài', animal: 'Pig', element: 'Water', polarity: 'Yin' }
};

/**
 * Translate Chinese character to full data
 */
function translateCharacter(chineseChar) {
  if (STEMS[chineseChar]) {
    return { type: 'stem', chinese: chineseChar, ...STEMS[chineseChar] };
  }
  if (BRANCHES[chineseChar]) {
    return { type: 'branch', chinese: chineseChar, ...BRANCHES[chineseChar] };
  }
  return { type: 'unknown', chinese: chineseChar, name: '?', element: '?', polarity: '?' };
}

/**
 * Parse a GanZhi string (e.g., "庚子") into stem and branch
 */
function parseGanZhi(ganZhiString) {
  const stemChar = ganZhiString.charAt(0);
  const branchChar = ganZhiString.charAt(1);
  
  return {
    full: ganZhiString,
    stem: translateCharacter(stemChar),
    branch: translateCharacter(branchChar)
  };
}

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

/**
 * Calculate Four Pillars using lunar-javascript (INDUSTRY STANDARD)
 * 
 * @param {Object} birthData - Birth information
 * @param {number} birthData.year - Birth year
 * @param {number} birthData.month - Birth month (1-12)
 * @param {number} birthData.day - Birth day
 * @param {number} birthData.hour - Birth hour (0-23)
 * @param {number} birthData.minute - Birth minute (0-59)
 * @param {number} birthData.second - Birth second (0-59, optional)
 * @returns {Object} Complete Four Pillars data
 */
export function calculateFourPillars(birthData) {
  const { year, month, day, hour, minute, second = 0 } = birthData;
  
  // 1. Create Solar object (Gregorian date/time)
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, second);
  
  // 2. Convert to Lunar to access BaZi methods
  const lunar = solar.getLunar();
  
  // 3. Get the Eight Characters (Four Pillars) using EXACT methods
  // CRITICAL: We use 'Exact' methods to respect Solar Terms (Jie Qi)
  const yearGanZhi = lunar.getYearInGanZhiExact();   // Year Pillar
  const monthGanZhi = lunar.getMonthInGanZhiExact(); // Month Pillar - respects Solar Terms!
  const dayGanZhi = lunar.getDayInGanZhiExact();     // Day Pillar
  const hourGanZhi = lunar.getTimeInGanZhi();        // Hour Pillar
  
  // 4. Parse each pillar
  const yearPillar = parseGanZhi(yearGanZhi);
  const monthPillar = parseGanZhi(monthGanZhi);
  const dayPillar = parseGanZhi(dayGanZhi);
  const hourPillar = parseGanZhi(hourGanZhi);
  
  // 5. Calculate element counts
  const elements = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };
  
  // Count elements from all pillars
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    elements[pillar.stem.element] += 1;
    elements[pillar.branch.element] += 1;
  });
  
  // 6. Calculate Yin/Yang balance
  let yangCount = 0;
  let yinCount = 0;
  
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    if (pillar.stem.polarity === 'Yang') yangCount++;
    else yinCount++;
    if (pillar.branch.polarity === 'Yang') yangCount++;
    else yinCount++;
  });
  
  // 7. Return complete Four Pillars data
  return {
    // The Four Pillars
    year: {
      ...yearPillar,
      pillarName: 'Year Pillar',
      chineseName: '年柱',
      significance: 'Ancestral Foundation (Age 0-16)',
      weight: 0.05,
      englishName: `${yearPillar.stem.english} ${yearPillar.branch.animal}`
    },
    month: {
      ...monthPillar,
      pillarName: 'Month Pillar',
      chineseName: '月柱',
      significance: 'Seasonal Constitution (Age 17-32)',
      weight: 0.10,
      englishName: `${monthPillar.stem.english} ${monthPillar.branch.animal}`
    },
    day: {
      ...dayPillar,
      pillarName: 'Day Pillar',
      chineseName: '日柱',
      significance: 'Core Soul Essence (Age 33-48) ⭐',
      weight: 0.70,
      englishName: `${dayPillar.stem.english} ${dayPillar.branch.animal}`,
      note: 'This is YOU - your fundamental nature'
    },
    hour: {
      ...hourPillar,
      pillarName: 'Hour Pillar',
      chineseName: '时柱',
      significance: 'Private Inner Nature (Age 49+)',
      weight: 0.15,
      englishName: `${hourPillar.stem.english} ${hourPillar.branch.animal}`
    },
    
    // Summary data
    elements,
    yinYang: {
      yang: yangCount,
      yin: yinCount,
      total: yangCount + yinCount,
      yangPercent: ((yangCount / (yangCount + yinCount)) * 100).toFixed(1),
      yinPercent: ((yinCount / (yangCount + yinCount)) * 100).toFixed(1)
    },
    
    // Metadata
    calculationMethod: 'lunar-javascript (Industry Standard)',
    solarTermsRespected: true,
    astronomicallyAccurate: true,
    inputDate: {
      year,
      month,
      day,
      hour,
      minute,
      second
    }
  };
}

/**
 * Helper: Format Four Pillars for display
 */
export function formatFourPillars(fourPillars) {
  return {
    short: `${fourPillars.year.full} ${fourPillars.month.full} ${fourPillars.day.full} ${fourPillars.hour.full}`,
    english: `${fourPillars.year.englishName} / ${fourPillars.month.englishName} / ${fourPillars.day.englishName} / ${fourPillars.hour.englishName}`,
    dayMaster: fourPillars.day.stem.english,
    dayMasterElement: fourPillars.day.stem.element
  };
}

/**
 * Compatibility wrapper with old calculation format
 */
export function calculateFourPillarsLegacyFormat(birthDate, birthTime, locationData) {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1; // JS months are 0-indexed
  const day = birthDate.getDate();
  
  const [hour, minute] = birthTime.split(':').map(Number);
  
  const pillars = calculateFourPillars({
    year,
    month,
    day,
    hour: hour || 12,
    minute: minute || 0
  });
  
  return pillars;
}

export default {
  calculateFourPillars,
  formatFourPillars,
  calculateFourPillarsLegacyFormat,
  STEMS,
  BRANCHES
};
