/**
 * NUMEROLOGY CALCULATIONS
 *
 * Calculation utilities for numerology:
 * - Personal Year/Month
 * - Pinnacle periods and numbers
 * - Challenge periods and numbers
 * - Life stage calculations
 *
 * "The Cathedral of Self-Knowledge - Mathematical Foundation"
 */

// =============================================================================
// CORE REDUCTION FUNCTIONS
// =============================================================================

/**
 * Reduce a number to single digit (preserving master numbers 11, 22, 33)
 */
export function reduceToSingleDigit(num) {
  if (typeof num === 'string') {
    num = parseInt(num, 10);
  }

  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  }
  return num;
}

/**
 * Reduce a number to single digit (NOT preserving master numbers)
 */
export function reduceToSingleDigitStrict(num) {
  if (typeof num === 'string') {
    num = parseInt(num, 10);
  }

  while (num > 9) {
    num = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  }
  return num;
}

// =============================================================================
// PERSONAL YEAR/MONTH CALCULATIONS
// =============================================================================

/**
 * Calculate Personal Year (simple - calendar year based)
 * @param {number} birthMonth - Birth month (1-12)
 * @param {number} birthDay - Birth day (1-31)
 * @param {number} currentYear - Year to calculate for
 * @returns {number} Personal Year number (1-9)
 */
export function calculatePersonalYear(birthMonth, birthDay, currentYear) {
  // Add birth month + birth day + current year, reduce to single digit
  const sum = birthMonth + birthDay + currentYear;
  return reduceToSingleDigitStrict(sum);
}

/**
 * Calculate Current Personal Year with BIRTHDAY-TO-BIRTHDAY accuracy
 * Your Personal Year runs from YOUR birthday to YOUR next birthday
 * NOT the calendar year!
 *
 * @param {number} birthMonth - Birth month (1-12)
 * @param {number} birthDay - Birth day (1-31)
 * @param {Date} [currentDate] - Date to calculate for (defaults to today)
 * @returns {Object} Complete Personal Year info with dates and timing
 */
export function calculateCurrentPersonalYear(birthMonth, birthDay, currentDate = new Date()) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Determine which Personal Year cycle we're in
  // If birthday hasn't occurred yet this year, we're still in the cycle that started LAST birthday
  let yearToUse = currentYear;
  let birthdayPassed = true;

  if (currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)) {
    // Birthday hasn't occurred yet this year
    // Still in Personal Year that started on last birthday
    yearToUse = currentYear - 1;
    birthdayPassed = false;
  }

  // Calculate Personal Year number using the correct year
  const sum = birthMonth + birthDay + yearToUse;
  const personalYear = reduceToSingleDigitStrict(sum);

  // Calculate cycle start and end dates
  const startDate = new Date(yearToUse, birthMonth - 1, birthDay);
  const endDate = new Date(yearToUse + 1, birthMonth - 1, birthDay - 1);

  // Calculate next Personal Year
  const nextSum = birthMonth + birthDay + (yearToUse + 1);
  const nextPersonalYear = reduceToSingleDigitStrict(nextSum);
  const nextYearStartDate = new Date(yearToUse + 1, birthMonth - 1, birthDay);

  // Calculate time remaining in current Personal Year
  const now = currentDate.getTime();
  const end = nextYearStartDate.getTime();
  const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  const monthsRemaining = Math.round(daysRemaining / 30);

  // Calculate progress through current year
  const start = startDate.getTime();
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const daysPassed = totalDays - daysRemaining;
  const progressPercent = Math.round((daysPassed / totalDays) * 100);

  return {
    personalYear,
    yearToUse,
    birthdayPassed,
    startDate,
    endDate,
    daysRemaining,
    monthsRemaining,
    daysPassed,
    progressPercent,
    nextPersonalYear,
    nextYearStartDate,
    // Calculation breakdown for transparency
    calculation: {
      birthMonth,
      birthDay,
      yearUsed: yearToUse,
      sum,
      reductionSteps: getReductionSteps(sum),
      result: personalYear
    }
  };
}

/**
 * Calculate full 9-Year Cycle centered on current year
 * Shows past years (for reflection) and future years (for preparation)
 *
 * @param {number} birthMonth - Birth month (1-12)
 * @param {number} birthDay - Birth day (1-31)
 * @param {number} centerYear - Year to center the cycle on
 * @returns {Array} 9 years of cycle data
 */
export function calculate9YearCycle(birthMonth, birthDay, centerYear) {
  const cycle = [];

  // Show 4 years back, current year, and 4 years forward
  for (let i = -4; i <= 4; i++) {
    const year = centerYear + i;
    const sum = birthMonth + birthDay + year;
    const personalYearNum = reduceToSingleDigitStrict(sum);

    cycle.push({
      calendarYear: year,
      personalYear: personalYearNum,
      startDate: new Date(year, birthMonth - 1, birthDay),
      endDate: new Date(year + 1, birthMonth - 1, birthDay - 1),
      isCurrent: i === 0,
      isPast: i < 0,
      isFuture: i > 0,
      calculation: {
        sum,
        reductionSteps: getReductionSteps(sum)
      }
    });
  }

  return cycle;
}

/**
 * Get step-by-step reduction process for transparency
 * Shows exactly how we arrive at the final number
 *
 * @param {number} sum - Starting sum to reduce
 * @returns {Array} Array of reduction steps
 */
export function getReductionSteps(sum) {
  const steps = [];
  let current = sum;

  // Keep reducing until single digit (or master number)
  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    const digits = current.toString().split('').map(Number);
    const next = digits.reduce((a, b) => a + b, 0);
    steps.push({
      from: current,
      calculation: `${digits.join(' + ')} = ${next}`,
      to: next
    });
    current = next;
  }

  return steps;
}

/**
 * Format a date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatCycleDate(date) {
  if (!date || !(date instanceof Date)) return '';
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format date in short form
 * @param {Date} date - Date to format
 * @returns {string} Short formatted date (Jan 6, 2026)
 */
export function formatCycleDateShort(date) {
  if (!date || !(date instanceof Date)) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Calculate Personal Month
 * @param {number} personalYear - Current Personal Year
 * @param {number} currentMonth - Month to calculate for (1-12)
 * @returns {number} Personal Month number (1-9)
 */
export function calculatePersonalMonth(personalYear, currentMonth) {
  const sum = personalYear + currentMonth;
  return reduceToSingleDigitStrict(sum);
}

/**
 * Calculate Personal Day
 * @param {number} personalMonth - Current Personal Month
 * @param {number} currentDay - Day to calculate for (1-31)
 * @returns {number} Personal Day number (1-9)
 */
export function calculatePersonalDay(personalMonth, currentDay) {
  const sum = personalMonth + currentDay;
  return reduceToSingleDigitStrict(sum);
}

/**
 * Get current timing (Personal Year, Month, Day)
 * @param {Date} birthDate - Birth date
 * @param {Date} [targetDate] - Date to calculate for (defaults to today)
 * @returns {Object} { personalYear, personalMonth, personalDay }
 */
export function getCurrentTiming(birthDate, targetDate = new Date()) {
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth() + 1;
  const currentDay = targetDate.getDate();

  const personalYear = calculatePersonalYear(birthMonth, birthDay, currentYear);
  const personalMonth = calculatePersonalMonth(personalYear, currentMonth);
  const personalDay = calculatePersonalDay(personalMonth, currentDay);

  return {
    personalYear,
    personalMonth,
    personalDay,
    currentYear,
    currentMonth,
    currentDay
  };
}

// =============================================================================
// PINNACLE CALCULATIONS
// =============================================================================

/**
 * Calculate Pinnacle ages based on Life Path number
 * @param {number} lifePath - Life Path number
 * @returns {Object} Pinnacle age ranges
 */
export function calculatePinnacleAges(lifePath) {
  // First pinnacle ends at 36 minus Life Path number
  const firstEnd = 36 - reduceToSingleDigitStrict(lifePath);

  return {
    pinnacle1: { start: 0, end: firstEnd },
    pinnacle2: { start: firstEnd + 1, end: firstEnd + 9 },
    pinnacle3: { start: firstEnd + 10, end: firstEnd + 18 },
    pinnacle4: { start: firstEnd + 19, end: null } // Through end of life
  };
}

/**
 * Calculate Pinnacle numbers from birth date
 * @param {number} birthMonth - Birth month (1-12)
 * @param {number} birthDay - Birth day (1-31)
 * @param {number} birthYear - Birth year
 * @returns {Object} Four Pinnacle numbers
 */
export function calculatePinnacleNumbers(birthMonth, birthDay, birthYear) {
  const reducedMonth = reduceToSingleDigit(birthMonth);
  const reducedDay = reduceToSingleDigit(birthDay);
  const reducedYear = reduceToSingleDigit(birthYear);

  // Pinnacle 1: Birth Month + Birth Day
  const pinnacle1 = reduceToSingleDigit(reducedMonth + reducedDay);

  // Pinnacle 2: Birth Day + Birth Year
  const pinnacle2 = reduceToSingleDigit(reducedDay + reducedYear);

  // Pinnacle 3: Pinnacle 1 + Pinnacle 2
  const pinnacle3 = reduceToSingleDigit(pinnacle1 + pinnacle2);

  // Pinnacle 4: Birth Month + Birth Year
  const pinnacle4 = reduceToSingleDigit(reducedMonth + reducedYear);

  return {
    pinnacle1,
    pinnacle2,
    pinnacle3,
    pinnacle4
  };
}

/**
 * Get current Pinnacle based on age
 * @param {number} age - Current age
 * @param {number} lifePath - Life Path number
 * @returns {number} Current Pinnacle (1-4)
 */
export function getCurrentPinnacle(age, lifePath) {
  const ages = calculatePinnacleAges(lifePath);

  if (age <= ages.pinnacle1.end) return 1;
  if (age <= ages.pinnacle2.end) return 2;
  if (age <= ages.pinnacle3.end) return 3;
  return 4;
}

// =============================================================================
// CHALLENGE CALCULATIONS
// =============================================================================

/**
 * Calculate Challenge numbers from birth date
 * @param {number} birthMonth - Birth month (1-12)
 * @param {number} birthDay - Birth day (1-31)
 * @param {number} birthYear - Birth year
 * @returns {Object} Four Challenge numbers
 */
export function calculateChallengeNumbers(birthMonth, birthDay, birthYear) {
  const reducedMonth = reduceToSingleDigitStrict(birthMonth);
  const reducedDay = reduceToSingleDigitStrict(birthDay);
  const reducedYear = reduceToSingleDigitStrict(birthYear);

  // Challenge 1: Absolute difference of Month and Day
  const challenge1 = Math.abs(reducedMonth - reducedDay);

  // Challenge 2: Absolute difference of Day and Year
  const challenge2 = Math.abs(reducedDay - reducedYear);

  // Challenge 3: Absolute difference of Challenge 1 and Challenge 2
  const challenge3 = Math.abs(challenge1 - challenge2);

  // Challenge 4: Absolute difference of Month and Year
  const challenge4 = Math.abs(reducedMonth - reducedYear);

  return {
    challenge1,
    challenge2,
    challenge3,
    challenge4
  };
}

// =============================================================================
// COMPLETE PINNACLE/CHALLENGE ANALYSIS
// =============================================================================

/**
 * Get complete life stages analysis
 * @param {Date} birthDate - Birth date
 * @param {number} lifePath - Life Path number
 * @param {number} [currentAge] - Current age (calculated if not provided)
 * @returns {Object} Complete life stages with pinnacles and challenges
 */
export function getLifeStages(birthDate, lifePath, currentAge = null) {
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  const birthYear = birthDate.getFullYear();

  // Calculate current age if not provided
  if (currentAge === null) {
    const today = new Date();
    currentAge = today.getFullYear() - birthYear;
    const hasHadBirthdayThisYear =
      today.getMonth() + 1 > birthMonth ||
      (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);
    if (!hasHadBirthdayThisYear) {
      currentAge--;
    }
  }

  const ages = calculatePinnacleAges(lifePath);
  const pinnacles = calculatePinnacleNumbers(birthMonth, birthDay, birthYear);
  const challenges = calculateChallengeNumbers(birthMonth, birthDay, birthYear);
  const currentPinnacle = getCurrentPinnacle(currentAge, lifePath);

  return {
    currentAge,
    currentPinnacle,
    stages: [
      {
        stage: 1,
        name: "First Pinnacle",
        ages: `Birth to ${ages.pinnacle1.end}`,
        startAge: 0,
        endAge: ages.pinnacle1.end,
        pinnacle: pinnacles.pinnacle1,
        challenge: challenges.challenge1,
        isCurrent: currentPinnacle === 1,
        theme: getPinnacleTheme(pinnacles.pinnacle1),
        challengeTheme: getChallengeTheme(challenges.challenge1)
      },
      {
        stage: 2,
        name: "Second Pinnacle",
        ages: `${ages.pinnacle2.start} to ${ages.pinnacle2.end}`,
        startAge: ages.pinnacle2.start,
        endAge: ages.pinnacle2.end,
        pinnacle: pinnacles.pinnacle2,
        challenge: challenges.challenge2,
        isCurrent: currentPinnacle === 2,
        theme: getPinnacleTheme(pinnacles.pinnacle2),
        challengeTheme: getChallengeTheme(challenges.challenge2)
      },
      {
        stage: 3,
        name: "Third Pinnacle",
        ages: `${ages.pinnacle3.start} to ${ages.pinnacle3.end}`,
        startAge: ages.pinnacle3.start,
        endAge: ages.pinnacle3.end,
        pinnacle: pinnacles.pinnacle3,
        challenge: challenges.challenge3,
        isCurrent: currentPinnacle === 3,
        theme: getPinnacleTheme(pinnacles.pinnacle3),
        challengeTheme: getChallengeTheme(challenges.challenge3)
      },
      {
        stage: 4,
        name: "Fourth Pinnacle",
        ages: `${ages.pinnacle4.start}+`,
        startAge: ages.pinnacle4.start,
        endAge: null,
        pinnacle: pinnacles.pinnacle4,
        challenge: challenges.challenge4,
        isCurrent: currentPinnacle === 4,
        theme: getPinnacleTheme(pinnacles.pinnacle4),
        challengeTheme: getChallengeTheme(challenges.challenge4)
      }
    ]
  };
}

// =============================================================================
// THEME HELPERS
// =============================================================================

/**
 * Get brief theme for a Pinnacle number
 */
function getPinnacleTheme(number) {
  const themes = {
    1: "Independence & New Beginnings",
    2: "Cooperation & Patience",
    3: "Creative Expression & Joy",
    4: "Hard Work & Foundation Building",
    5: "Change & Freedom",
    6: "Family & Responsibility",
    7: "Inner Development & Wisdom",
    8: "Achievement & Material Mastery",
    9: "Completion & Universal Service",
    11: "Spiritual Awakening",
    22: "Master Building",
    33: "Master Teaching"
  };
  return themes[number] || themes[reduceToSingleDigitStrict(number)];
}

/**
 * Get brief theme for a Challenge number
 */
function getChallengeTheme(number) {
  const themes = {
    0: "All challenges apply - universal testing",
    1: "Developing independence without dominance",
    2: "Finding confidence in sensitivity",
    3: "Expressing creativity without scattering",
    4: "Building without becoming rigid",
    5: "Using freedom responsibly",
    6: "Serving without martyrdom",
    7: "Trusting while questioning",
    8: "Using power ethically"
  };
  return themes[number] || "Growth through experience";
}

// =============================================================================
// PERSONAL YEAR CYCLE POSITION
// =============================================================================

/**
 * Get where in the 9-year cycle the person is
 * @param {number} personalYear - Current Personal Year
 * @returns {Object} Cycle position info
 */
export function getCyclePosition(personalYear) {
  const positions = {
    1: {
      position: "Beginning",
      description: "Start of a new 9-year cycle",
      energy: "Planting seeds"
    },
    2: {
      position: "Early Growth",
      description: "Nurturing what was planted",
      energy: "Patience and cooperation"
    },
    3: {
      position: "First Flowering",
      description: "Early results appearing",
      energy: "Expression and joy"
    },
    4: {
      position: "Foundation",
      description: "Building solid ground",
      energy: "Work and discipline"
    },
    5: {
      position: "Midpoint",
      description: "Center of the cycle",
      energy: "Change and freedom"
    },
    6: {
      position: "Full Bloom",
      description: "Peak of nurturing energy",
      energy: "Love and responsibility"
    },
    7: {
      position: "Inner Reflection",
      description: "Going inward before harvest",
      energy: "Wisdom and solitude"
    },
    8: {
      position: "Harvest",
      description: "Reaping what was sown",
      energy: "Achievement and power"
    },
    9: {
      position: "Completion",
      description: "End of the cycle",
      energy: "Release and forgiveness"
    }
  };
  return positions[personalYear] || positions[1];
}

// =============================================================================
// YEAR FORECAST
// =============================================================================

/**
 * Get full year forecast
 * @param {Date} birthDate - Birth date
 * @param {number} year - Year to forecast
 * @returns {Object} Year forecast with monthly breakdown
 */
export function getYearForecast(birthDate, year) {
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();

  const personalYear = calculatePersonalYear(birthMonth, birthDay, year);
  const cyclePosition = getCyclePosition(personalYear);

  // Generate monthly forecast
  const months = [];
  for (let month = 1; month <= 12; month++) {
    const personalMonth = calculatePersonalMonth(personalYear, month);
    months.push({
      month,
      monthName: getMonthName(month),
      personalMonth,
      theme: getPinnacleTheme(personalMonth)
    });
  }

  return {
    year,
    personalYear,
    cyclePosition,
    theme: getPinnacleTheme(personalYear),
    months
  };
}

/**
 * Get month name from number
 */
function getMonthName(month) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1] || "";
}

// =============================================================================
// GOLD STANDARD: TRANSPARENT FORMULA CALCULATIONS
// For Brain 1A - shows the actual math, no black boxes
// =============================================================================

/**
 * Check if number is a Master Number (11, 22, 33)
 */
export function isMasterNumber(num) {
  return num === 11 || num === 22 || num === 33;
}

/**
 * Pythagorean letter values for name calculations
 */
const LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

/**
 * Calculate Life Path with transparent formula breakdown
 * @param {string} birthDate - YYYY-MM-DD format
 * @returns {Object} Number with full calculation breakdown
 */
export function calculateLifePathWithFormula(birthDate) {
  if (!birthDate) return { number: null, calculation: null };

  const [year, month, day] = birthDate.split('-').map(Number);

  const yearDigits = String(year).split('').map(Number);
  const monthDigits = String(month).split('').map(Number);
  const dayDigits = String(day).split('').map(Number);

  const yearSum = yearDigits.reduce((a, b) => a + b, 0);
  const monthSum = monthDigits.reduce((a, b) => a + b, 0);
  const daySum = dayDigits.reduce((a, b) => a + b, 0);

  const total = yearSum + monthSum + daySum;
  const reduced = reduceToSingleDigit(total);
  const finalNumber = isMasterNumber(total) ? total : reduced;

  return {
    number: finalNumber,
    isMasterNumber: isMasterNumber(total),
    calculation: {
      year: `${yearDigits.join('+')}=${yearSum}`,
      month: `${monthDigits.join('+')}=${monthSum}`,
      day: `${dayDigits.join('+')}=${daySum}`,
      total: `${yearSum}+${monthSum}+${daySum}=${total}`,
      reductionSteps: getReductionSteps(total),
      fullFormula: `(${yearDigits.join('+')})+(${monthDigits.join('+')})+(${dayDigits.join('+')})=${total} → ${finalNumber}`
    }
  };
}

/**
 * Calculate Expression/Destiny Number with letter-by-letter breakdown
 * @param {string} fullName - Full birth name
 * @returns {Object} Number with full calculation breakdown
 */
export function calculateExpressionWithFormula(fullName) {
  if (!fullName) return { number: null, calculation: null };

  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const letters = name.split('');
  const values = letters.map(l => LETTER_VALUES[l] || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const reduced = reduceToSingleDigit(total);
  const finalNumber = isMasterNumber(total) ? total : reduced;

  return {
    number: finalNumber,
    isMasterNumber: isMasterNumber(total),
    name: fullName,
    calculation: {
      letters: letters.map((l, i) => `${l}(${values[i]})`).join('+'),
      sum: `${values.join('+')}=${total}`,
      reductionSteps: getReductionSteps(total),
      fullFormula: `${letters.map((l, i) => `${l}(${values[i]})`).join('+')} = ${total} → ${finalNumber}`
    }
  };
}

/**
 * Calculate Soul Urge from vowels with breakdown
 * @param {string} fullName - Full birth name
 * @returns {Object} Number with full calculation breakdown
 */
export function calculateSoulUrgeWithFormula(fullName) {
  if (!fullName) return { number: null, calculation: null };

  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = name.split('').filter(l => VOWELS.includes(l));
  const values = vowels.map(l => LETTER_VALUES[l]);
  const total = values.reduce((a, b) => a + b, 0);
  const reduced = reduceToSingleDigit(total);
  const finalNumber = isMasterNumber(total) ? total : reduced;

  return {
    number: finalNumber,
    isMasterNumber: isMasterNumber(total),
    vowels: vowels.join(' '),
    calculation: {
      vowels: vowels.map((v, i) => `${v}(${values[i]})`).join('+'),
      sum: `${values.join('+')}=${total}`,
      reductionSteps: getReductionSteps(total),
      fullFormula: `Vowels: ${vowels.join(' ')} = ${total} → ${finalNumber}`
    }
  };
}

/**
 * Calculate Personality from consonants with breakdown
 * @param {string} fullName - Full birth name
 * @returns {Object} Number with full calculation breakdown
 */
export function calculatePersonalityWithFormula(fullName) {
  if (!fullName) return { number: null, calculation: null };

  const name = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const consonants = name.split('').filter(l => !VOWELS.includes(l));
  const values = consonants.map(l => LETTER_VALUES[l] || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const reduced = reduceToSingleDigit(total);
  const finalNumber = isMasterNumber(total) ? total : reduced;

  return {
    number: finalNumber,
    isMasterNumber: isMasterNumber(total),
    consonants: consonants.join(' '),
    calculation: {
      consonants: consonants.map((c, i) => `${c}(${values[i]})`).join('+'),
      sum: `${values.join('+')}=${total}`,
      reductionSteps: getReductionSteps(total),
      fullFormula: `Consonants: ${consonants.join(' ')} = ${total} → ${finalNumber}`
    }
  };
}

/**
 * Calculate Birthday Number (day of birth reduced)
 * @param {string} birthDate - YYYY-MM-DD format
 * @returns {Object} Number with calculation
 */
export function calculateBirthdayNumber(birthDate) {
  if (!birthDate) return { number: null, calculation: null };

  const day = parseInt(birthDate.split('-')[2]);
  const reduced = day > 9 ? reduceToSingleDigit(day) : day;

  return {
    originalDay: day,
    number: reduced,
    calculation: day > 9 ?
      `${day} → ${String(day).split('').join('+')}=${reduced}` :
      String(day)
  };
}

/**
 * Calculate Maturity Number (Life Path + Expression)
 * @param {number} lifePath - Life Path number
 * @param {number} expression - Expression/Destiny number
 * @returns {Object} Number with calculation
 */
export function calculateMaturityNumber(lifePath, expression) {
  if (!lifePath || !expression) return { number: null, calculation: null };

  const total = lifePath + expression;
  const reduced = reduceToSingleDigit(total);
  const finalNumber = isMasterNumber(total) ? total : reduced;

  return {
    number: finalNumber,
    isMasterNumber: isMasterNumber(total),
    calculation: {
      formula: `Life Path (${lifePath}) + Expression (${expression}) = ${total}`,
      reductionSteps: getReductionSteps(total),
      final: `${total} → ${finalNumber}`
    }
  };
}

/**
 * Calculate Personal Year with transparent formula
 * @param {string} birthDate - YYYY-MM-DD format
 * @returns {Object} Personal Year with calculation
 */
export function calculatePersonalYearWithFormula(birthDate) {
  if (!birthDate) return { number: null, calculation: null };

  const [, month, day] = birthDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();

  const yearSum = String(currentYear).split('').map(Number).reduce((a, b) => a + b, 0);
  const monthSum = String(month).split('').map(Number).reduce((a, b) => a + b, 0);
  const daySum = String(day).split('').map(Number).reduce((a, b) => a + b, 0);

  const total = yearSum + monthSum + daySum;
  const reduced = reduceToSingleDigitStrict(total);

  return {
    year: currentYear,
    number: reduced,
    calculation: `${currentYear}+${month}+${day} = ${yearSum}+${monthSum}+${daySum} = ${total} → ${reduced}`
  };
}

/**
 * Calculate Personal Month with formula
 * @param {number} personalYearNumber - Current Personal Year
 * @returns {Object} Personal Month with calculation
 */
export function calculatePersonalMonthWithFormula(personalYearNumber) {
  if (!personalYearNumber) return { number: null, calculation: null };

  const currentMonth = new Date().getMonth() + 1;
  const total = personalYearNumber + currentMonth;
  const reduced = reduceToSingleDigitStrict(total);

  return {
    month: currentMonth,
    number: reduced,
    calculation: `Personal Year (${personalYearNumber}) + Current Month (${currentMonth}) = ${total} → ${reduced}`
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Core reduction
  reduceToSingleDigit,
  reduceToSingleDigitStrict,
  isMasterNumber,
  getReductionSteps,

  // Personal cycles
  calculatePersonalYear,
  calculateCurrentPersonalYear,
  calculate9YearCycle,
  calculatePersonalMonth,
  calculatePersonalDay,
  getCurrentTiming,
  getCyclePosition,
  getYearForecast,

  // Life stages
  calculatePinnacleAges,
  calculatePinnacleNumbers,
  getCurrentPinnacle,
  calculateChallengeNumbers,
  getLifeStages,

  // Gold Standard transparent formulas
  calculateLifePathWithFormula,
  calculateExpressionWithFormula,
  calculateSoulUrgeWithFormula,
  calculatePersonalityWithFormula,
  calculateBirthdayNumber,
  calculateMaturityNumber,
  calculatePersonalYearWithFormula,
  calculatePersonalMonthWithFormula,

  // Formatting
  formatCycleDate,
  formatCycleDateShort
};
