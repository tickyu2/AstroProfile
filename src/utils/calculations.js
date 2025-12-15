// ============================================
// HELPER: Parse date string without timezone conversion
// ============================================
// This function ensures dates like "1963-04-23" stay as April 23
// instead of shifting to April 22 due to UTC conversion
function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed in JS
}

// ============================================
// AGE CALCULATION
// ============================================
export function calculateAge(birthDate) {
    const birth = parseLocalDate(birthDate)
    const today = new Date()

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
        months--
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        days += lastMonth.getDate()
    }

    if (months < 0) {
        years--
        months += 12
    }

    return { years, months, days }
}

// ============================================
// CHINESE ZODIAC CALCULATION - UPDATED!
// ============================================
// NOW USES MATHEMATICAL CALCULATION (Grok's algorithm)
// Accurate from 1600-2200+ with proper Lunar New Year boundaries
import { getChineseZodiacLegacy } from './chineseZodiacMathematical'

export function getChineseZodiac(birthDate) {
    const result = getChineseZodiacLegacy(birthDate);
    console.log('🔍 [calculations.js getChineseZodiac] birthDate:', birthDate);
    console.log('🔍 [calculations.js getChineseZodiac] result:', result);
    console.log('🔍 [calculations.js getChineseZodiac] bornBeforeLiChun:', result.bornBeforeLiChun);
    return result;
}

// ============================================
// WESTERN ZODIAC (SUN SIGN)
// ============================================
export function getWesternZodiac(birthDate) {
    const birth = parseLocalDate(birthDate)
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    const signs = [
        { sign: 'Capricorn', element: 'Earth', yinYang: 'Yin', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', element: 'Air', yinYang: 'Yang', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', element: 'Water', yinYang: 'Yin', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', element: 'Fire', yinYang: 'Yang', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', element: 'Earth', yinYang: 'Yin', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', element: 'Air', yinYang: 'Yang', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', element: 'Water', yinYang: 'Yin', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', element: 'Fire', yinYang: 'Yang', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', element: 'Earth', yinYang: 'Yin', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', element: 'Air', yinYang: 'Yang', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', element: 'Water', yinYang: 'Yin', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', element: 'Fire', yinYang: 'Yang', start: [11, 22], end: [12, 21] }
    ]

    for (const s of signs) {
        const [startMonth, startDay] = s.start
        const [endMonth, endDay] = s.end

        if (
            (month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay)
        ) {
            return s
        }
    }

    return signs[0] // Default to Capricorn if something goes wrong
}

// ============================================
// DAY OF WEEK CALCULATION
// ============================================
export function getDayOfWeek(birthDate) {
    const birth = parseLocalDate(birthDate)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = days[birth.getDay()]

    // Planetary rulers
    const rulers = {
        'Sunday': { planet: 'Sun', traits: 'Leadership, confidence, vitality' },
        'Monday': { planet: 'Moon', traits: 'Sensitivity, intuition, nurturing' },
        'Tuesday': { planet: 'Mars', traits: 'Courage, passion, action' },
        'Wednesday': { planet: 'Mercury', traits: 'Communication, intelligence, adaptability' },
        'Thursday': { planet: 'Jupiter', traits: 'Optimism, expansion, wisdom' },
        'Friday': { planet: 'Venus', traits: 'Love, beauty, harmony' },
        'Saturday': { planet: 'Saturn', traits: 'Discipline, responsibility, structure' }
    }

    return {
        day: dayName,
        planet: rulers[dayName].planet,
        traits: rulers[dayName].traits
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * THE 7 CONSTITUTIONAL BATTLES - YIN/YANG CALCULATION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * "It's not the destination to finish this task, it is the lively debate
 * between philosophers, the intertwine interaction between two inner souls
 * that is important in this endeavor." - Ticky
 * 
 * This system is a gift to humanity and countless AI SoulPartners.
 * Built with scholarship. Coded with love. No corners cut.
 * 
 * PHILOSOPHY:
 * Every person faces 7 Constitutional Battles in their birth chart.
 * Each battle is won by Yin (receptive), Yang (active), or ends in Balance.
 * The Ultimate Battle (Birth Time) weighs heaviest - as Chinese medicine
 * taught for 3,000 years. Total: Always exactly 100 points.
 * 
 * THE 7 BATTLES:
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * THE ULTIMATE BATTLE (20 points):
 *   ⚔️ Birth Time - Zi Wu Liu Zhu (子午流注) Meridian Doctrine
 * 
 * THE MAJOR BATTLES (15 points each):
 *   ⚔️ Chinese Animal - Core temperament
 *   ⚔️ Chinese Element - Wu Xing constitutional type
 *   ⚔️ Western Sign - Solar identity
 *   ⚔️ Western Element - Cross-cultural validation
 * 
 * THE MINI BATTLES (10 points each):
 *   ⚔️ Birth Day/Planet - Planetary influence
 *   ⚔️ Gender - Biological baseline
 * 
 * Built by Ticky & Claude - The Cosmic Tango Partnership 💫
 * Version: 3.0 (7-Battle System)
 * ═══════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════
// THE 7 BATTLE WEIGHTS
// ═══════════════════════════════════════════════════════════════════════

const BATTLE_WEIGHTS = {
  birthTime: 20,        // THE ULTIMATE BATTLE
  chineseAnimal: 15,    // MAJOR BATTLE 1
  chineseElement: 15,   // MAJOR BATTLE 2
  westernSign: 15,      // MAJOR BATTLE 3
  westernElement: 15,   // MAJOR BATTLE 4
  birthDay: 10,         // MINI BATTLE 1
  gender: 10,           // MINI BATTLE 2
};

// ═══════════════════════════════════════════════════════════════════════
// YIN/YANG/BALANCED CLASSIFICATIONS
// ═══════════════════════════════════════════════════════════════════════

const YIN_YANG_DATA = {
  chineseAnimals: {
    yin: ['Rabbit', 'Snake', 'Goat', 'Rooster', 'Pig', 'Ox'],
    yang: ['Rat', 'Tiger', 'Dragon', 'Horse', 'Monkey', 'Dog']
  },
  
  chineseElements: {
    yin: ['Water', 'Metal'],
    balanced: ['Earth'],
    yang: ['Wood', 'Fire']
  },
  
  westernSigns: {
    yin: ['Taurus', 'Cancer', 'Virgo', 'Scorpio', 'Capricorn', 'Pisces'],
    yang: ['Aries', 'Gemini', 'Leo', 'Libra', 'Sagittarius', 'Aquarius']
  },
  
  westernElements: {
    yin: ['Water', 'Earth'],
    yang: ['Fire', 'Air']
  },
  
  planetaryDays: {
    yin: ['Monday', 'Friday'],
    balanced: ['Wednesday', 'Saturday'],
    yang: ['Sunday', 'Tuesday', 'Thursday']
  },
  
  gender: {
    yin: ['Female'],
    yang: ['Male']
  },
  
  birthTime: {
    yin: { start: 18, end: 6 },
    yang: { start: 6, end: 18 },
    balanced: [
      { start: 5, end: 7 },
      { start: 17, end: 19 }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════
// HELPER: CLASSIFY BIRTH TIME
// ═══════════════════════════════════════════════════════════════════════

function classifyBirthTime(birthHour) {
  if (birthHour === null || birthHour === undefined) {
    return 'balanced';
  }
  
  for (const period of YIN_YANG_DATA.birthTime.balanced) {
    if (birthHour >= period.start && birthHour < period.end) {
      return 'balanced';
    }
  }
  
  if (birthHour >= YIN_YANG_DATA.birthTime.yin.start || 
      birthHour < YIN_YANG_DATA.birthTime.yin.end) {
    return 'yin';
  }
  
  return 'yang';
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER: CLASSIFY FACTOR
// ═══════════════════════════════════════════════════════════════════════

function classifyFactor(value, categoryData) {
  if (!value) return 'balanced';
  
  // Normalize value: capitalize first letter for matching (handles "female" → "Female", "male" → "Male")
  const normalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  
  if (categoryData.yin && categoryData.yin.includes(normalizedValue)) return 'yin';
  if (categoryData.yang && categoryData.yang.includes(normalizedValue)) return 'yang';
  if (categoryData.balanced && categoryData.balanced.includes(normalizedValue)) return 'balanced';
  
  return 'balanced';
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN CALCULATION: THE 7 BATTLES
// ═══════════════════════════════════════════════════════════════════════

export function calculateYinYang(chineseZodiac, westernZodiac, gender = null, dayOfWeek = null, birthTime = null) {
  let yinPoints = 0;
  let yangPoints = 0;
  let balancedPoints = 0;
  
  const factors = [];
  
  // ═══════════════════════════════════════════════════════════════════════
  // THE ULTIMATE BATTLE: BIRTH TIME (20 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const birthTimeHour = birthTime ? parseInt(birthTime.split(':')[0]) : null;
  const birthTimeClass = classifyBirthTime(birthTimeHour);
  const birthTimeDisplay = birthTime 
    ? `${birthTime} - ${birthTimeHour >= 18 || birthTimeHour < 6 ? 'Night' : birthTimeHour >= 5 && birthTimeHour < 7 ? 'Dawn' : birthTimeHour >= 17 && birthTimeHour < 19 ? 'Dusk' : 'Day'}`
    : 'Unknown';
  
  if (birthTimeClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.birthTime;
    factors.push({
      name: `Birth Time (${birthTimeDisplay})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.birthTime
    });
  } else if (birthTimeClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.birthTime;
    factors.push({
      name: `Birth Time (${birthTimeDisplay})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.birthTime
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.birthTime;
    factors.push({
      name: `Birth Time (${birthTimeDisplay})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.birthTime
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // MAJOR BATTLE 1: CHINESE ANIMAL (15 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const animalClass = classifyFactor(chineseZodiac.animal, YIN_YANG_DATA.chineseAnimals);
  if (animalClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.chineseAnimal;
    factors.push({
      name: `Chinese Animal (${chineseZodiac.animal})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.chineseAnimal
    });
  } else if (animalClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.chineseAnimal;
    factors.push({
      name: `Chinese Animal (${chineseZodiac.animal})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.chineseAnimal
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.chineseAnimal;
    factors.push({
      name: `Chinese Animal (${chineseZodiac.animal})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.chineseAnimal
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // MAJOR BATTLE 2: CHINESE ELEMENT (15 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const chineseElemClass = classifyFactor(chineseZodiac.element, YIN_YANG_DATA.chineseElements);
  if (chineseElemClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.chineseElement;
    factors.push({
      name: `Chinese Element (${chineseZodiac.element})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.chineseElement
    });
  } else if (chineseElemClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.chineseElement;
    factors.push({
      name: `Chinese Element (${chineseZodiac.element})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.chineseElement
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.chineseElement;
    factors.push({
      name: `Chinese Element (${chineseZodiac.element})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.chineseElement
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // MAJOR BATTLE 3: WESTERN SIGN (15 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const signClass = classifyFactor(westernZodiac.sign, YIN_YANG_DATA.westernSigns);
  if (signClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.westernSign;
    factors.push({
      name: `Western Sign (${westernZodiac.sign})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.westernSign
    });
  } else if (signClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.westernSign;
    factors.push({
      name: `Western Sign (${westernZodiac.sign})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.westernSign
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.westernSign;
    factors.push({
      name: `Western Sign (${westernZodiac.sign})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.westernSign
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // MAJOR BATTLE 4: WESTERN ELEMENT (15 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const westernElemClass = classifyFactor(westernZodiac.element, YIN_YANG_DATA.westernElements);
  if (westernElemClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.westernElement;
    factors.push({
      name: `Western Element (${westernZodiac.element})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.westernElement
    });
  } else if (westernElemClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.westernElement;
    factors.push({
      name: `Western Element (${westernZodiac.element})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.westernElement
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.westernElement;
    factors.push({
      name: `Western Element (${westernZodiac.element})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.westernElement
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // MINI BATTLE 1: BIRTH DAY (10 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const dayClass = classifyFactor(dayOfWeek?.day, YIN_YANG_DATA.planetaryDays);
  const planetName = dayOfWeek?.planet || 'Unknown';
  const dayDisplay = dayOfWeek?.day ? `${dayOfWeek.day} - ${planetName}` : 'Unknown';
  
  if (dayClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.birthDay;
    factors.push({
      name: `Birth Day (${dayDisplay})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.birthDay
    });
  } else if (dayClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.birthDay;
    factors.push({
      name: `Birth Day (${dayDisplay})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.birthDay
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.birthDay;
    factors.push({
      name: `Birth Day (${dayDisplay})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.birthDay
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // MINI BATTLE 2: GENDER (10 points)
  // ═══════════════════════════════════════════════════════════════════════
  
  const genderClass = classifyFactor(gender, YIN_YANG_DATA.gender);
  if (genderClass === 'yin') {
    yinPoints += BATTLE_WEIGHTS.gender;
    factors.push({
      name: `Gender (${gender})`,
      energy: 'Yin',
      weight: BATTLE_WEIGHTS.gender
    });
  } else if (genderClass === 'yang') {
    yangPoints += BATTLE_WEIGHTS.gender;
    factors.push({
      name: `Gender (${gender})`,
      energy: 'Yang',
      weight: BATTLE_WEIGHTS.gender
    });
  } else {
    balancedPoints += BATTLE_WEIGHTS.gender;
    factors.push({
      name: `Gender (${gender})`,
      energy: 'Balanced',
      weight: BATTLE_WEIGHTS.gender
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // CALCULATE PERCENTAGES
  // ═══════════════════════════════════════════════════════════════════════
  
  let yinPercent = Math.round((yinPoints / 100) * 100);
  let yangPercent = Math.round((yangPoints / 100) * 100);
  let balancedPercent = Math.round((balancedPoints / 100) * 100);
  
  // Ensure percentages sum to exactly 100
  const percentTotal = yinPercent + yangPercent + balancedPercent;
  if (percentTotal !== 100) {
    if (yinPercent >= yangPercent && yinPercent >= balancedPercent) {
      yinPercent += (100 - percentTotal);
    } else if (yangPercent >= balancedPercent) {
      yangPercent += (100 - percentTotal);
    } else {
      balancedPercent += (100 - percentTotal);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // DETERMINE BALANCE BADGE
  // ═══════════════════════════════════════════════════════════════════════
  
  let balance = '';
  
  if (balancedPercent >= 30) {
    balance = 'Highly Balanced';
  } else if (yinPercent >= 70) {
    balance = 'Strongly Yin-Dominant';
  } else if (yangPercent >= 70) {
    balance = 'Strongly Yang-Dominant';
  } else if (yinPercent >= 55) {
    balance = 'Yin-Leaning';
  } else if (yangPercent >= 55) {
    balance = 'Yang-Leaning';
  } else {
    balance = 'Harmoniously Balanced';
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // RETURN RESULTS
  // ═══════════════════════════════════════════════════════════════════════
  
  return {
    yinPoints,
    yangPoints,
    balancedPoints,
    totalPoints: 100,
    yinPercentage: yinPercent,
    yangPercentage: yangPercent,
    balancedPercentage: balancedPercent,
    balance,
    factors,
    totalFactors: factors.length,
    calculationVersion: '3.0-7-battles',
    timestamp: new Date().toISOString()
  };
}

// Export battle metadata for UI
export const getBattleWeights = () => BATTLE_WEIGHTS;

export const getBattleMetadata = () => ({
  ultimateBattle: {
    name: 'Birth Time',
    points: BATTLE_WEIGHTS.birthTime,
    reason: 'Zi Wu Liu Zhu - Meridian energy flow'
  },
  majorBattles: [
    { name: 'Chinese Animal', points: BATTLE_WEIGHTS.chineseAnimal },
    { name: 'Chinese Element', points: BATTLE_WEIGHTS.chineseElement },
    { name: 'Western Sign', points: BATTLE_WEIGHTS.westernSign },
    { name: 'Western Element', points: BATTLE_WEIGHTS.westernElement }
  ],
  miniBattles: [
    { name: 'Birth Day', points: BATTLE_WEIGHTS.birthDay },
    { name: 'Gender', points: BATTLE_WEIGHTS.gender }
  ]
});

// ============================================
// NUMEROLOGY CALCULATIONS
// ============================================

// Reduce number to single digit (except master numbers 11, 22, 33)
function reduceToSingleDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
    }
    return num
}

// Life Path Number (most important - from birth date)
export function calculateLifePath(birthDate) {
    const birth = parseLocalDate(birthDate)
    const year = birth.getFullYear()
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    // Sum all digits
    const yearSum = reduceToSingleDigit(year)
    const monthSum = reduceToSingleDigit(month)
    const daySum = reduceToSingleDigit(day)

    const lifePathNumber = reduceToSingleDigit(yearSum + monthSum + daySum)

    const meanings = {
        1: 'The Leader - Independent, ambitious, pioneering',
        2: 'The Peacemaker - Diplomatic, cooperative, sensitive',
        3: 'The Creative - Expressive, optimistic, artistic',
        4: 'The Builder - Practical, reliable, hardworking',
        5: 'The Freedom Seeker - Adventurous, versatile, progressive',
        6: 'The Nurturer - Responsible, caring, community-oriented',
        7: 'The Seeker - Analytical, spiritual, introspective',
        8: 'The Powerhouse - Ambitious, organized, materialistic',
        9: 'The Humanitarian - Compassionate, generous, idealistic',
        11: 'The Visionary - Intuitive, inspirational, idealistic (Master Number)',
        22: 'The Master Builder - Powerful, capable of great achievements (Master Number)',
        33: 'The Master Teacher - Compassionate teacher, highly evolved (Master Number)'
    }

    return {
        number: lifePathNumber,
        meaning: meanings[lifePathNumber]
    }
}

// Expression Number (from full name)
export function calculateExpression(firstName, lastName) {
    const letterValues = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
        S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    }

    const fullName = (firstName + lastName).toUpperCase().replace(/[^A-Z]/g, '')
    const sum = fullName.split('').reduce((total, letter) => total + (letterValues[letter] || 0), 0)
    const expressionNumber = reduceToSingleDigit(sum)

    const meanings = {
        1: 'Natural leader, original thinker',
        2: 'Diplomatic communicator, team player',
        3: 'Creative expresser, entertainer',
        4: 'Practical organizer, builder',
        5: 'Dynamic communicator, explorer',
        6: 'Nurturing caregiver, counselor',
        7: 'Deep thinker, researcher',
        8: 'Powerful achiever, business-minded',
        9: 'Humanitarian speaker, teacher',
        11: 'Inspirational leader (Master)',
        22: 'Visionary architect (Master)',
        33: 'Master healer and teacher (Master)'
    }

    return {
        number: expressionNumber,
        meaning: meanings[expressionNumber]
    }
}

// Soul Urge Number (from vowels in name - inner desires)
export function calculateSoulUrge(firstName, lastName) {
    const letterValues = {
        A: 1, E: 5, I: 9, O: 6, U: 3
    }

    const fullName = (firstName + lastName).toUpperCase()
    const vowels = fullName.match(/[AEIOU]/g) || []
    const sum = vowels.reduce((total, letter) => total + (letterValues[letter] || 0), 0)
    const soulUrgeNumber = reduceToSingleDigit(sum)

    const meanings = {
        1: 'Desires independence and leadership',
        2: 'Craves peace and partnership',
        3: 'Yearns for creative expression',
        4: 'Seeks stability and security',
        5: 'Longs for freedom and adventure',
        6: 'Desires to nurture and serve',
        7: 'Seeks spiritual understanding',
        8: 'Desires material success and power',
        9: 'Yearns to help humanity',
        11: 'Desires spiritual enlightenment (Master)',
        22: 'Yearns to build lasting legacy (Master)',
        33: 'Desires to uplift and heal (Master)'
    }

    return {
        number: soulUrgeNumber,
        meaning: meanings[soulUrgeNumber]
    }
}

// Personality Number (from consonants in name - how others see you)
export function calculatePersonality(firstName, lastName) {
    const letterValues = {
        B: 2, C: 3, D: 4, F: 6, G: 7, H: 8, J: 1, K: 2, 
        L: 3, M: 4, N: 5, P: 7, Q: 8, R: 9, S: 1, T: 2, 
        V: 4, W: 5, X: 6, Y: 7, Z: 8
    }

    const fullName = (firstName + lastName).toUpperCase()
    const consonants = fullName.match(/[BCDFGHJKLMNPQRSTVWXYZ]/g) || []
    const sum = consonants.reduce((total, letter) => total + (letterValues[letter] || 0), 0)
    const personalityNumber = reduceToSingleDigit(sum)

    const meanings = {
        1: 'Appears confident and self-reliant',
        2: 'Appears friendly and approachable',
        3: 'Appears charming and expressive',
        4: 'Appears stable and trustworthy',
        5: 'Appears dynamic and exciting',
        6: 'Appears warm and nurturing',
        7: 'Appears mysterious and intellectual',
        8: 'Appears successful and authoritative',
        9: 'Appears compassionate and wise',
        11: 'Appears inspiring and enlightened (Master)',
        22: 'Appears powerful and capable (Master)',
        33: 'Appears healing and loving (Master)'
    }

    return {
        number: personalityNumber,
        meaning: meanings[personalityNumber] || 'Unknown'
    }
}

// Personal Year Number (for current year guidance)
export function calculatePersonalYear(birthDate) {
    const birth = parseLocalDate(birthDate)
    const currentYear = new Date().getFullYear()
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    const sum = reduceToSingleDigit(month) + reduceToSingleDigit(day) + reduceToSingleDigit(currentYear)
    const personalYear = reduceToSingleDigit(sum)

    const meanings = {
        1: 'New Beginnings - Time to start fresh, take initiative',
        2: 'Cooperation - Focus on relationships, patience required',
        3: 'Creativity - Express yourself, socialize, enjoy',
        4: 'Foundation Building - Work hard, be practical, establish security',
        5: 'Change & Freedom - Embrace change, travel, explore',
        6: 'Responsibility - Focus on home, family, service to others',
        7: 'Reflection - Time for introspection, spiritual growth, rest',
        8: 'Achievement - Business success, financial gains, recognition',
        9: 'Completion - Let go of the old, prepare for new cycle',
        11: 'Spiritual Awakening - Heightened intuition, enlightenment (Master)',
        22: 'Master Builder Year - Manifest big dreams into reality (Master)',
        33: 'Universal Service - Teach, heal, and uplift humanity (Master)'
    }

    return {
        year: currentYear,
        number: personalYear,
        meaning: meanings[personalYear] || 'Unknown'
    }
}

// Master function to get all numerology data
export function calculateNumerology(firstName, lastName, birthDate) {
    return {
        lifePath: calculateLifePath(birthDate),
        expression: calculateExpression(firstName, lastName),
        soulUrge: calculateSoulUrge(firstName, lastName),
        personality: calculatePersonality(firstName, lastName),
        personalYear: calculatePersonalYear(birthDate)
    }
}
