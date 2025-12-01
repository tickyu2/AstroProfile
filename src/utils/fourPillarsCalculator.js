/**
 * ============================================
 * FOUR PILLARS (BAZI) CALCULATOR
 * Complete Constitutional Analysis System
 * ============================================
 * 
 * Calculates all four pillars of Chinese astrology:
 * - Year Pillar (年柱): Ancestral energy
 * - Month Pillar (月柱): Seasonal constitution
 * - Day Pillar (日柱): Core soul essence ⭐
 * - Hour Pillar (时柱): Private inner nature
 * 
 * Each pillar has:
 * - Heavenly Stem (天干): 10 possibilities (Yin/Yang × 5 elements)
 * - Earthly Branch (地支): 12 animals
 * 
 * Total combinations: 60 (sexagenary cycle)
 */

// ============================================
// DATA STRUCTURES
// ============================================

const HEAVENLY_STEMS = [
  { index: 0, chinese: '甲', pinyin: 'Jiǎ', element: 'Wood',  polarity: 'Yang', name: 'Yang Wood' },
  { index: 1, chinese: '乙', pinyin: 'Yǐ',  element: 'Wood',  polarity: 'Yin',  name: 'Yin Wood' },
  { index: 2, chinese: '丙', pinyin: 'Bǐng', element: 'Fire',  polarity: 'Yang', name: 'Yang Fire' },
  { index: 3, chinese: '丁', pinyin: 'Dīng', element: 'Fire',  polarity: 'Yin',  name: 'Yin Fire' },
  { index: 4, chinese: '戊', pinyin: 'Wù',  element: 'Earth', polarity: 'Yang', name: 'Yang Earth' },
  { index: 5, chinese: '己', pinyin: 'Jǐ',  element: 'Earth', polarity: 'Yin',  name: 'Yin Earth' },
  { index: 6, chinese: '庚', pinyin: 'Gēng', element: 'Metal', polarity: 'Yang', name: 'Yang Metal' },
  { index: 7, chinese: '辛', pinyin: 'Xīn', element: 'Metal', polarity: 'Yin',  name: 'Yin Metal' },
  { index: 8, chinese: '壬', pinyin: 'Rén', element: 'Water', polarity: 'Yang', name: 'Yang Water' },
  { index: 9, chinese: '癸', pinyin: 'Guǐ', element: 'Water', polarity: 'Yin',  name: 'Yin Water' }
];

const EARTHLY_BRANCHES = [
  { index: 0,  chinese: '子', pinyin: 'Zǐ',   animal: 'Rat',     element: 'Water', polarity: 'Yang', hours: [23, 1] },
  { index: 1,  chinese: '丑', pinyin: 'Chǒu', animal: 'Ox',      element: 'Earth', polarity: 'Yin',  hours: [1, 3] },
  { index: 2,  chinese: '寅', pinyin: 'Yín',  animal: 'Tiger',   element: 'Wood',  polarity: 'Yang', hours: [3, 5] },
  { index: 3,  chinese: '卯', pinyin: 'Mǎo',  animal: 'Rabbit',  element: 'Wood',  polarity: 'Yin',  hours: [5, 7] },
  { index: 4,  chinese: '辰', pinyin: 'Chén', animal: 'Dragon',  element: 'Earth', polarity: 'Yang', hours: [7, 9] },
  { index: 5,  chinese: '巳', pinyin: 'Sì',   animal: 'Snake',   element: 'Fire',  polarity: 'Yin',  hours: [9, 11] },
  { index: 6,  chinese: '午', pinyin: 'Wǔ',   animal: 'Horse',   element: 'Fire',  polarity: 'Yang', hours: [11, 13] },
  { index: 7,  chinese: '未', pinyin: 'Wèi',  animal: 'Goat',    element: 'Earth', polarity: 'Yin',  hours: [13, 15] },
  { index: 8,  chinese: '申', pinyin: 'Shēn', animal: 'Monkey',  element: 'Metal', polarity: 'Yang', hours: [15, 17] },
  { index: 9,  chinese: '酉', pinyin: 'Yǒu',  animal: 'Rooster', element: 'Metal', polarity: 'Yin',  hours: [17, 19] },
  { index: 10, chinese: '戌', pinyin: 'Xū',   animal: 'Dog',     element: 'Earth', polarity: 'Yang', hours: [19, 21] },
  { index: 11, chinese: '亥', pinyin: 'Hài',  animal: 'Pig',     element: 'Water', polarity: 'Yin',  hours: [21, 23] }
];

// Solar Terms (节气 Jieqi) - Used for Month Pillar calculation
// These are the 24 division points of the solar year
const SOLAR_TERMS = [
  { name: 'Spring Begins (立春)',    approxDate: '02-04', degrees: 315 },
  { name: 'Rain Water (雨水)',       approxDate: '02-19', degrees: 330 },
  { name: 'Insects Awaken (惊蛰)',   approxDate: '03-05', degrees: 345 },
  { name: 'Spring Equinox (春分)',   approxDate: '03-20', degrees: 0 },
  { name: 'Clear & Bright (清明)',   approxDate: '04-05', degrees: 15 },
  { name: 'Grain Rain (谷雨)',       approxDate: '04-20', degrees: 30 },
  { name: 'Summer Begins (立夏)',    approxDate: '05-05', degrees: 45 },
  { name: 'Grain Buds (小满)',       approxDate: '05-21', degrees: 60 },
  { name: 'Grain in Ear (芒种)',     approxDate: '06-06', degrees: 75 },
  { name: 'Summer Solstice (夏至)',  approxDate: '06-21', degrees: 90 },
  { name: 'Minor Heat (小暑)',       approxDate: '07-07', degrees: 105 },
  { name: 'Major Heat (大暑)',       approxDate: '07-23', degrees: 120 },
  { name: 'Autumn Begins (立秋)',    approxDate: '08-07', degrees: 135 },
  { name: 'End of Heat (处暑)',      approxDate: '08-23', degrees: 150 },
  { name: 'White Dew (白露)',        approxDate: '09-07', degrees: 165 },
  { name: 'Autumn Equinox (秋分)',   approxDate: '09-23', degrees: 180 },
  { name: 'Cold Dew (寒露)',         approxDate: '10-08', degrees: 195 },
  { name: 'Frost Descends (霜降)',   approxDate: '10-23', degrees: 210 },
  { name: 'Winter Begins (立冬)',    approxDate: '11-07', degrees: 225 },
  { name: 'Minor Snow (小雪)',       approxDate: '11-22', degrees: 240 },
  { name: 'Major Snow (大雪)',       approxDate: '12-07', degrees: 255 },
  { name: 'Winter Solstice (冬至)',  approxDate: '12-21', degrees: 270 },
  { name: 'Minor Cold (小寒)',       approxDate: '01-05', degrees: 285 },
  { name: 'Major Cold (大寒)',       approxDate: '01-20', degrees: 300 }
];

// Month Pillar mapping based on solar terms
// Each solar month starts with odd-numbered solar terms (立春, 惊蛰, etc.)
const MONTH_PILLARS = [
  { month: 1,  startTerm: 'Spring Begins (立春)',   branch: 2,  name: 'Tiger Month (寅月)' },  // Feb 4-ish
  { month: 2,  startTerm: 'Insects Awaken (惊蛰)', branch: 3,  name: 'Rabbit Month (卯月)' }, // Mar 5-ish
  { month: 3,  startTerm: 'Clear & Bright (清明)', branch: 4,  name: 'Dragon Month (辰月)' }, // Apr 5-ish
  { month: 4,  startTerm: 'Summer Begins (立夏)',  branch: 5,  name: 'Snake Month (巳月)' },  // May 5-ish
  { month: 5,  startTerm: 'Grain in Ear (芒种)',   branch: 6,  name: 'Horse Month (午月)' },  // Jun 6-ish
  { month: 6,  startTerm: 'Minor Heat (小暑)',     branch: 7,  name: 'Goat Month (未月)' },   // Jul 7-ish
  { month: 7,  startTerm: 'Autumn Begins (立秋)',  branch: 8,  name: 'Monkey Month (申月)' }, // Aug 7-ish
  { month: 8,  startTerm: 'White Dew (白露)',      branch: 9,  name: 'Rooster Month (酉月)' },// Sep 7-ish
  { month: 9,  startTerm: 'Cold Dew (寒露)',       branch: 10, name: 'Dog Month (戌月)' },    // Oct 8-ish
  { month: 10, startTerm: 'Winter Begins (立冬)',  branch: 11, name: 'Pig Month (亥月)' },    // Nov 7-ish
  { month: 11, startTerm: 'Major Snow (大雪)',     branch: 0,  name: 'Rat Month (子月)' },    // Dec 7-ish
  { month: 12, startTerm: 'Minor Cold (小寒)',     branch: 1,  name: 'Ox Month (丑月)' }      // Jan 5-ish
];

// Five Rats Determining the Hour (五鼠遁时)
// Maps Day Stem → Hour Branch → Hour Stem
const HOUR_STEM_TABLE = {
  0: [0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2], // Jiǎ or Jǐ Day → Hour stems
  1: [2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4], // Yǐ or Gēng Day
  2: [4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6], // Bǐng or Xīn Day
  3: [6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8], // Dīng or Rén Day
  4: [8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0]  // Wù or Guǐ Day
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate sexagenary cycle index for a given date
 * Base: Jan 1, 1900 = Day 0 = 甲子 (Jiǎ Zǐ)
 */
function calculateDayIndex(date) {
  const baseDate = new Date(1900, 0, 1);
  const daysSinceBase = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
  // Add offset because Jan 1, 1900 is actually day index 16 in the 60-day cycle
  return (daysSinceBase + 16) % 60;
}

/**
 * Get stem and branch from sexagenary index
 */
function getStemBranch(index) {
  const stemIndex = index % 10;
  const branchIndex = index % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  };
}

/**
 * Calculate Chinese New Year for a given Gregorian year
 * Simplified approximation - in production, use lookup table or precise algorithm
 */
function getChineseNewYear(gregorianYear) {
  // This is a simplified approximation
  // In production, use a lookup table or precise lunisolar calculation
  const newMoonDates = {
    2020: new Date(2020, 0, 25),
    2021: new Date(2021, 1, 12),
    2022: new Date(2022, 1, 1),
    2023: new Date(2023, 0, 22),
    2024: new Date(2024, 1, 10),
    2025: new Date(2025, 0, 29),
    2026: new Date(2026, 1, 17),
    2027: new Date(2027, 1, 6),
    // Add more years as needed
  };
  
  return newMoonDates[gregorianYear] || new Date(gregorianYear, 1, 1);
}

/**
 * Get Spring Begins (立春) date for year pillar determination
 * This is MORE accurate than Chinese New Year for Bazi
 */
function getSpringBegins(year) {
  // Spring Begins is around Feb 4 each year
  // Precise calculation requires astronomical data
  // Using approximation: Feb 3-5, 18:00 average
  
  // Simplified: Feb 4 of each year
  return new Date(year, 1, 4, 18, 0, 0);
}

/**
 * Calculate solar longitude (simplified)
 * Used for determining Month Pillar boundaries
 */
function getSolarLongitude(date) {
  // Simplified calculation
  // In production, use astronomical library for precision
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24));
  
  // Solar longitude advances ~1° per day (360° / 365.25 days)
  const longitude = (dayOfYear * 360 / 365.25) % 360;
  return longitude;
}

/**
 * Convert clock time to solar time based on longitude
 */
function convertToSolarTime(clockTime, longitude) {
  const MINUTES_PER_DEGREE = 4;
  const solarOffset = longitude * MINUTES_PER_DEGREE;
  
  const hours = clockTime.getHours();
  const minutes = clockTime.getMinutes();
  const totalMinutes = (hours * 60) + minutes + solarOffset;
  
  let solarHours = Math.floor(totalMinutes / 60);
  let solarMinutes = Math.round(totalMinutes % 60);
  
  // Handle day boundary crossing
  if (solarHours < 0) {
    solarHours += 24;
  } else if (solarHours >= 24) {
    solarHours -= 24;
  }
  
  if (solarMinutes < 0) {
    solarMinutes += 60;
    solarHours -= 1;
  } else if (solarMinutes >= 60) {
    solarMinutes -= 60;
    solarHours += 1;
  }
  
  return {
    hours: solarHours,
    minutes: solarMinutes,
    offsetMinutes: Math.round(solarOffset)
  };
}

// ============================================
// PILLAR CALCULATIONS
// ============================================

/**
 * YEAR PILLAR
 * Based on Spring Begins (立春), not Chinese New Year
 */
function calculateYearPillar(birthDate) {
  const birthYear = birthDate.getFullYear();
  const springBegins = getSpringBegins(birthYear);
  
  // If born before Spring Begins, use previous year
  const effectiveYear = birthDate < springBegins ? birthYear - 1 : birthYear;
  
  // Calculate year pillar index
  // Year 1984 = 甲子 (index 0), cycles every 60 years
  const baseYear = 1984; // 甲子 year
  const yearOffset = effectiveYear - baseYear;
  const yearIndex = ((yearOffset % 60) + 60) % 60;
  
  const pillar = getStemBranch(yearIndex);
  
  return {
    stem: pillar.stem,
    branch: pillar.branch,
    chineseYear: effectiveYear,
    fullName: `${pillar.stem.chinese}${pillar.branch.chinese}`,
    englishName: `${pillar.stem.name} ${pillar.branch.animal}`,
    note: birthDate < springBegins ? 'Born before Spring Begins - using previous year' : null
  };
}

/**
 * MONTH PILLAR
 * Based on Solar Terms (24 divisions of solar year)
 */
function calculateMonthPillar(birthDate, yearStem) {
  // Get solar longitude to determine which solar month
  const month = birthDate.getMonth(); // 0-11
  const day = birthDate.getDate();
  
  // Simplified solar term determination
  // In production, use precise astronomical calculation
  let solarMonth;
  
  if (month === 1 && day >= 4) solarMonth = 1;      // Tiger - Spring Begins ~Feb 4
  else if (month === 2 && day >= 5) solarMonth = 2; // Rabbit - Insects Awaken ~Mar 5
  else if (month === 3 && day >= 5) solarMonth = 3; // Dragon - Clear Bright ~Apr 5
  else if (month === 4 && day >= 5) solarMonth = 4; // Snake - Summer Begins ~May 5
  else if (month === 5 && day >= 6) solarMonth = 5; // Horse - Grain in Ear ~Jun 6
  else if (month === 6 && day >= 7) solarMonth = 6; // Goat - Minor Heat ~Jul 7
  else if (month === 7 && day >= 7) solarMonth = 7; // Monkey - Autumn Begins ~Aug 7
  else if (month === 8 && day >= 7) solarMonth = 8; // Rooster - White Dew ~Sep 7
  else if (month === 9 && day >= 8) solarMonth = 9; // Dog - Cold Dew ~Oct 8
  else if (month === 10 && day >= 7) solarMonth = 10; // Pig - Winter Begins ~Nov 7
  else if (month === 11 && day >= 7) solarMonth = 11; // Rat - Major Snow ~Dec 7
  else solarMonth = 12; // Ox - Minor Cold ~Jan 5
  
  const monthInfo = MONTH_PILLARS[solarMonth - 1];
  const branchIndex = monthInfo.branch;
  
  // Month stem is determined by year stem using "Five Tigers Escaping"
  // Jia/Ji years start with Bing Yin (Tiger month)
  // Yi/Geng years start with Wu Yin
  // Bing/Xin years start with Geng Yin
  // Ding/Ren years start with Ren Yin
  // Wu/Gui years start with Jia Yin
  
  const monthStemBase = {
    0: 2, // Jia year → starts with Bing (index 2)
    1: 4, // Yi year → starts with Wu (index 4)
    2: 6, // Bing year → starts with Geng (index 6)
    3: 8, // Ding year → starts with Ren (index 8)
    4: 0, // Wu year → starts with Jia (index 0)
    5: 2, // Ji year → starts with Bing (index 2)
    6: 4, // Geng year → starts with Wu (index 4)
    7: 6, // Xin year → starts with Geng (index 6)
    8: 8, // Ren year → starts with Ren (index 8)
    9: 0  // Gui year → starts with Jia (index 0)
  };
  
  const baseStem = monthStemBase[yearStem.index];
  // Adjust for which month (Tiger = 0, Rabbit = 1, etc.)
  const monthOffset = (branchIndex - 2 + 12) % 12;
  const stemIndex = (baseStem + monthOffset) % 10;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    solarMonth: solarMonth,
    fullName: `${HEAVENLY_STEMS[stemIndex].chinese}${EARTHLY_BRANCHES[branchIndex].chinese}`,
    englishName: `${HEAVENLY_STEMS[stemIndex].name} ${EARTHLY_BRANCHES[branchIndex].animal}`,
    solarTerm: monthInfo.startTerm
  };
}

/**
 * DAY PILLAR ⭐
 * The most important pillar - represents core self
 */
function calculateDayPillar(birthDate) {
  const dayIndex = calculateDayIndex(birthDate);
  const pillar = getStemBranch(dayIndex);
  
  return {
    stem: pillar.stem,
    branch: pillar.branch,
    dayIndex: dayIndex,
    fullName: `${pillar.stem.chinese}${pillar.branch.chinese}`,
    englishName: `${pillar.stem.name} ${pillar.branch.animal}`,
    note: '⭐ DAY MASTER - Your core soul essence'
  };
}

/**
 * HOUR PILLAR
 * Based on solar time and Day Stem
 */
function calculateHourPillar(birthDate, latitude, longitude, dayStem) {
  // Convert clock time to solar time
  const solarTime = convertToSolarTime(birthDate, longitude);
  const decimalHour = solarTime.hours + (solarTime.minutes / 60);
  
  // Determine which Chinese hour (Earthly Branch)
  let branchIndex;
  if (decimalHour >= 23 || decimalHour < 1) branchIndex = 0;  // Rat
  else if (decimalHour >= 1 && decimalHour < 3) branchIndex = 1;  // Ox
  else if (decimalHour >= 3 && decimalHour < 5) branchIndex = 2;  // Tiger
  else if (decimalHour >= 5 && decimalHour < 7) branchIndex = 3;  // Rabbit
  else if (decimalHour >= 7 && decimalHour < 9) branchIndex = 4;  // Dragon
  else if (decimalHour >= 9 && decimalHour < 11) branchIndex = 5; // Snake
  else if (decimalHour >= 11 && decimalHour < 13) branchIndex = 6; // Horse
  else if (decimalHour >= 13 && decimalHour < 15) branchIndex = 7; // Goat
  else if (decimalHour >= 15 && decimalHour < 17) branchIndex = 8; // Monkey
  else if (decimalHour >= 17 && decimalHour < 19) branchIndex = 9; // Rooster
  else if (decimalHour >= 19 && decimalHour < 21) branchIndex = 10; // Dog
  else branchIndex = 11; // Pig
  
  // Determine Hour Stem using Five Rats method
  const dayStemGroup = dayStem.index % 5;
  const stemIndex = HOUR_STEM_TABLE[dayStemGroup][branchIndex];
  
  // Check for boundary uncertainty
  const UNCERTAINTY_THRESHOLD = 15; // minutes
  let isNearBoundary = false;
  let minutesFromBoundary = 999;
  
  for (let boundaryHour of [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]) {
    const minsFromBoundary = Math.abs((decimalHour * 60) - (boundaryHour * 60));
    if (minsFromBoundary <= UNCERTAINTY_THRESHOLD) {
      isNearBoundary = true;
      minutesFromBoundary = Math.min(minutesFromBoundary, minsFromBoundary);
    }
  }
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    fullName: `${HEAVENLY_STEMS[stemIndex].chinese}${EARTHLY_BRANCHES[branchIndex].chinese}`,
    englishName: `${HEAVENLY_STEMS[stemIndex].name} ${EARTHLY_BRANCHES[branchIndex].animal}`,
    clockTime: {
      hours: birthDate.getHours(),
      minutes: birthDate.getMinutes(),
      formatted: `${String(birthDate.getHours()).padStart(2, '0')}:${String(birthDate.getMinutes()).padStart(2, '0')}`
    },
    solarTime: {
      hours: solarTime.hours,
      minutes: solarTime.minutes,
      formatted: `${String(solarTime.hours).padStart(2, '0')}:${String(solarTime.minutes).padStart(2, '0')}`,
      offsetMinutes: solarTime.offsetMinutes
    },
    uncertainty: {
      isNearBoundary,
      minutesFromBoundary: isNearBoundary ? Math.round(minutesFromBoundary) : null,
      message: isNearBoundary ? 
        `Birth time is within ${Math.round(minutesFromBoundary)} minutes of an hour boundary. Small variations in exact time/location could affect result.` : 
        null
    }
  };
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Calculate complete Four Pillars chart
 * 
 * @param {Date} birthDate - JavaScript Date object with birth date and time
 * @param {number} latitude - Birth location latitude (for future use)
 * @param {number} longitude - Birth location longitude (for solar time)
 * @returns {Object} Complete Four Pillars chart
 */
function calculateFourPillars(birthDate, latitude, longitude) {
  // Calculate each pillar
  const yearPillar = calculateYearPillar(birthDate);
  const monthPillar = calculateMonthPillar(birthDate, yearPillar.stem);
  const dayPillar = calculateDayPillar(birthDate);
  const hourPillar = calculateHourPillar(birthDate, latitude, longitude, dayPillar.stem);
  
  // Calculate overall elemental balance
  const elements = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };
  
  // Count elements from stems (more influential)
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    elements[pillar.stem.element] += 2; // Stems count double
    elements[pillar.branch.element] += 1;
  });
  
  // Calculate Yin/Yang balance
  let yinCount = 0;
  let yangCount = 0;
  
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    if (pillar.stem.polarity === 'Yin') yinCount += 2;
    else yangCount += 2;
    
    if (pillar.branch.polarity === 'Yin') yinCount += 1;
    else yangCount += 1;
  });
  
  const totalCount = yinCount + yangCount;
  
  return {
    birthDate: {
      gregorian: birthDate.toISOString(),
      formatted: birthDate.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    location: {
      latitude,
      longitude
    },
    
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    
    // Traditional display format (right to left)
    traditional: {
      display: `${hourPillar.fullName} ${dayPillar.fullName} ${monthPillar.fullName} ${yearPillar.fullName}`,
      english: `Hour: ${hourPillar.englishName} | Day: ${dayPillar.englishName} | Month: ${monthPillar.englishName} | Year: ${yearPillar.englishName}`
    },
    
    dayMaster: {
      stem: dayPillar.stem,
      description: `Your core self is ${dayPillar.stem.name} (${dayPillar.stem.chinese})`
    },
    
    elementalBalance: {
      elements,
      strongestElement: Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b),
      weakestElement: Object.keys(elements).reduce((a, b) => elements[a] < elements[b] ? a : b)
    },
    
    yinYangBalance: {
      yin: yinCount,
      yang: yangCount,
      yinPercentage: Math.round((yinCount / totalCount) * 100),
      yangPercentage: Math.round((yangCount / totalCount) * 100),
      balance: Math.abs(yinCount - yangCount) <= 2 ? 'Balanced' : 
               yinCount > yangCount ? 'Yin-dominant' : 'Yang-dominant'
    },
    
    interpretation: {
      essence: `Your soul essence (Day Master) is ${dayPillar.stem.name}, shaped by ${yearPillar.branch.animal} ancestral energy, absorbing ${monthPillar.branch.animal} seasonal influence, with ${hourPillar.branch.animal} private nature.`,
      constitution: `${dayPillar.stem.element} soul operating in a ${Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b)}-dominant elemental environment.`
    }
  };
}

// ============================================
// EXPORT
// ============================================

// ES6 exports for Vite/React
export {
  calculateFourPillars,
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  calculateHourPillar,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
};
