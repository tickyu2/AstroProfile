/**
 * solarTermsEngine.js
 *
 * Solar terms + BaZi: dateToJulianDay, SOLAR_TERMS, BAZI_MONTH_TERMS,
 * getSunLongitudeAtJD, findSolarTermJD, julianDayToCalendar,
 * calculateSolarTermsForYear, getLiChunExact, getBaziYearWithPrecision,
 * getBaziMonthWithPrecision, getMoonPhaseInterpretation, calculateAspects.
 *
 * Extracted from functions/routes/astrology.js during modularisation.
 */

const { solar } = require('./astronomyHelpers');

/**
 * Calculate Julian Day from date/time
 */
function dateToJulianDay(year, month, day, hour = 12, minute = 0, second = 0) {
  // Adjust for January/February (counted as 13th/14th month of previous year)
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  const JD = Math.floor(365.25 * (year + 4716)) +
             Math.floor(30.6001 * (month + 1)) +
             day + dayFraction + B - 1524.5;

  return JD;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR TERM (\u7BC0\u6C23) CALCULATION - Precise Astronomical Boundaries for BaZi
// ═══════════════════════════════════════════════════════════════════════════════
// The 24 Solar Terms are defined by Sun's ecliptic longitude at 15\u00B0 intervals.
// This provides EXACT moments for Year Pillar (\u7ACB\u6625) and Month Pillar boundaries.
//
// Part of GENESIS Phase 3 - Sovereign BaZi Precision
// Added: December 17, 2024
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The 24 Solar Terms (\u7BC0\u6C23) with their Sun longitude positions
 * Note: Solar year starts with \u7ACB\u6625 (Spring Begins) at 315\u00B0
 */
const SOLAR_TERMS = [
  { index: 0,  name: '\u5C0F\u5BD2', pinyin: 'Xi\u01CEo H\u00E1n',    english: 'Minor Cold',       longitude: 285, approxMonth: 1,  approxDay: 5 },
  { index: 1,  name: '\u5927\u5BD2', pinyin: 'D\u00E0 H\u00E1n',      english: 'Major Cold',       longitude: 300, approxMonth: 1,  approxDay: 20 },
  { index: 2,  name: '\u7ACB\u6625', pinyin: 'L\u00EC Ch\u016Bn',     english: 'Spring Begins',    longitude: 315, approxMonth: 2,  approxDay: 4 },  // YEAR CHANGES HERE
  { index: 3,  name: '\u96E8\u6C34', pinyin: 'Y\u01D4 Shu\u01D0',     english: 'Rain Water',       longitude: 330, approxMonth: 2,  approxDay: 19 },
  { index: 4,  name: '\u60CA\u86F0', pinyin: 'J\u012Bng Zh\u00E9',    english: 'Insects Awaken',   longitude: 345, approxMonth: 3,  approxDay: 5 },  // Month 1->2
  { index: 5,  name: '\u6625\u5206', pinyin: 'Ch\u016Bn F\u0113n',    english: 'Spring Equinox',   longitude: 0,   approxMonth: 3,  approxDay: 20 },
  { index: 6,  name: '\u6E05\u660E', pinyin: 'Q\u012Bng M\u00EDng',   english: 'Clear & Bright',   longitude: 15,  approxMonth: 4,  approxDay: 5 },  // Month 2->3
  { index: 7,  name: '\u8C37\u96E8', pinyin: 'G\u01D4 Y\u01D4',       english: 'Grain Rain',       longitude: 30,  approxMonth: 4,  approxDay: 20 },
  { index: 8,  name: '\u7ACB\u590F', pinyin: 'L\u00EC Xi\u00E0',      english: 'Summer Begins',    longitude: 45,  approxMonth: 5,  approxDay: 5 },  // Month 3->4
  { index: 9,  name: '\u5C0F\u6EE1', pinyin: 'Xi\u01CEo M\u01CEn',    english: 'Grain Buds',       longitude: 60,  approxMonth: 5,  approxDay: 21 },
  { index: 10, name: '\u8292\u79CD', pinyin: 'M\u00E1ng Zh\u00F2ng',  english: 'Grain in Ear',     longitude: 75,  approxMonth: 6,  approxDay: 6 },  // Month 4->5
  { index: 11, name: '\u590F\u81F3', pinyin: 'Xi\u00E0 Zh\u00EC',     english: 'Summer Solstice',  longitude: 90,  approxMonth: 6,  approxDay: 21 },
  { index: 12, name: '\u5C0F\u6691', pinyin: 'Xi\u01CEo Sh\u01D4',    english: 'Minor Heat',       longitude: 105, approxMonth: 7,  approxDay: 7 },  // Month 5->6
  { index: 13, name: '\u5927\u6691', pinyin: 'D\u00E0 Sh\u01D4',      english: 'Major Heat',       longitude: 120, approxMonth: 7,  approxDay: 23 },
  { index: 14, name: '\u7ACB\u79CB', pinyin: 'L\u00EC Qi\u016B',      english: 'Autumn Begins',    longitude: 135, approxMonth: 8,  approxDay: 7 },  // Month 6->7
  { index: 15, name: '\u5904\u6691', pinyin: 'Ch\u01D4 Sh\u01D4',     english: 'End of Heat',      longitude: 150, approxMonth: 8,  approxDay: 23 },
  { index: 16, name: '\u767D\u9732', pinyin: 'B\u00E1i L\u00F9',      english: 'White Dew',        longitude: 165, approxMonth: 9,  approxDay: 7 },  // Month 7->8
  { index: 17, name: '\u79CB\u5206', pinyin: 'Qi\u016B F\u0113n',     english: 'Autumn Equinox',   longitude: 180, approxMonth: 9,  approxDay: 23 },
  { index: 18, name: '\u5BD2\u9732', pinyin: 'H\u00E1n L\u00F9',      english: 'Cold Dew',         longitude: 195, approxMonth: 10, approxDay: 8 },  // Month 8->9
  { index: 19, name: '\u971C\u964D', pinyin: 'Shu\u0101ng Ji\u00E0ng',english: 'Frost Descends',   longitude: 210, approxMonth: 10, approxDay: 23 },
  { index: 20, name: '\u7ACB\u51AC', pinyin: 'L\u00EC D\u014Dng',     english: 'Winter Begins',    longitude: 225, approxMonth: 11, approxDay: 7 },  // Month 9->10
  { index: 21, name: '\u5C0F\u96EA', pinyin: 'Xi\u01CEo Xu\u011B',    english: 'Minor Snow',       longitude: 240, approxMonth: 11, approxDay: 22 },
  { index: 22, name: '\u5927\u96EA', pinyin: 'D\u00E0 Xu\u011B',      english: 'Major Snow',       longitude: 255, approxMonth: 12, approxDay: 7 },  // Month 10->11
  { index: 23, name: '\u51AC\u81F3', pinyin: 'D\u014Dng Zh\u00EC',    english: 'Winter Solstice',  longitude: 270, approxMonth: 12, approxDay: 21 }
];

/**
 * BaZi Month boundaries - which Solar Terms start each month
 * Each solar month begins at an odd-indexed Solar Term (Jie \u7BC0)
 */
const BAZI_MONTH_TERMS = {
  1:  { termIndex: 2,  name: '\u7ACB\u6625', english: 'Spring Begins',    longitude: 315 }, // Tiger Month
  2:  { termIndex: 4,  name: '\u60CA\u86F0', english: 'Insects Awaken',   longitude: 345 }, // Rabbit Month
  3:  { termIndex: 6,  name: '\u6E05\u660E', english: 'Clear & Bright',   longitude: 15 },  // Dragon Month
  4:  { termIndex: 8,  name: '\u7ACB\u590F', english: 'Summer Begins',    longitude: 45 },  // Snake Month
  5:  { termIndex: 10, name: '\u8292\u79CD', english: 'Grain in Ear',     longitude: 75 },  // Horse Month
  6:  { termIndex: 12, name: '\u5C0F\u6691', english: 'Minor Heat',       longitude: 105 }, // Goat Month
  7:  { termIndex: 14, name: '\u7ACB\u79CB', english: 'Autumn Begins',    longitude: 135 }, // Monkey Month
  8:  { termIndex: 16, name: '\u767D\u9732', english: 'White Dew',        longitude: 165 }, // Rooster Month
  9:  { termIndex: 18, name: '\u5BD2\u9732', english: 'Cold Dew',         longitude: 195 }, // Dog Month
  10: { termIndex: 20, name: '\u7ACB\u51AC', english: 'Winter Begins',    longitude: 225 }, // Pig Month
  11: { termIndex: 22, name: '\u5927\u96EA', english: 'Major Snow',       longitude: 255 }, // Rat Month
  12: { termIndex: 0,  name: '\u5C0F\u5BD2', english: 'Minor Cold',       longitude: 285 }  // Ox Month
};

/**
 * Calculate Sun's ecliptic longitude at a given Julian Day
 * Uses astronomia's solar module with Moshier Ephemeris
 * @param {number} jd - Julian Day
 * @returns {number} - Sun longitude in degrees (0-360)
 */
function getSunLongitudeAtJD(jd) {
  // Convert Julian Day to Julian centuries since J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Calculate apparent longitude (includes nutation and aberration)
  const sunLongitudeRad = solar.apparentLongitude(T);
  let sunLongitude = sunLongitudeRad * 180 / Math.PI;

  // Normalize to 0-360
  sunLongitude = ((sunLongitude % 360) + 360) % 360;

  return sunLongitude;
}

/**
 * Find the exact Julian Day when Sun reaches a target longitude
 * Uses binary search for precision
 *
 * @param {number} targetLongitude - Target Sun longitude (0-360)
 * @param {number} approxYear - Year to search in
 * @param {number} approxMonth - Approximate month (1-12)
 * @param {number} approxDay - Approximate day
 * @returns {number} - Julian Day when Sun reaches target longitude
 */
function findSolarTermJD(targetLongitude, approxYear, approxMonth, approxDay) {
  // Start with approximate Julian Day
  let jdLow = dateToJulianDay(approxYear, approxMonth, approxDay - 5, 0, 0, 0);
  let jdHigh = dateToJulianDay(approxYear, approxMonth, approxDay + 5, 0, 0, 0);

  // Binary search with precision of ~1 second
  const PRECISION = 1 / 86400; // 1 second in Julian Days
  const MAX_ITERATIONS = 50;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const jdMid = (jdLow + jdHigh) / 2;
    const sunLong = getSunLongitudeAtJD(jdMid);

    // Calculate difference, handling 360\u00B0 wraparound
    let diff = sunLong - targetLongitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.0001) { // Within ~0.4 arcseconds
      return jdMid;
    }

    // Sun moves ~1\u00B0 per day eastward (increasing longitude)
    // If current longitude is less than target, we need later time
    if (diff < 0) {
      jdLow = jdMid;
    } else {
      jdHigh = jdMid;
    }

    if (jdHigh - jdLow < PRECISION) {
      return jdMid;
    }
  }

  // Return best estimate if we didn't converge
  return (jdLow + jdHigh) / 2;
}

/**
 * Convert Julian Day to calendar date/time
 * @param {number} jd - Julian Day
 * @returns {Object} - { year, month, day, hour, minute, second }
 */
function julianDayToCalendar(jd) {
  // Add 0.5 to align with calendar day start
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z; // Fractional day

  let A;
  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  // Extract time from fractional day
  const totalHours = F * 24;
  const hour = Math.floor(totalHours);
  const totalMinutes = (totalHours - hour) * 60;
  const minute = Math.floor(totalMinutes);
  const second = Math.round((totalMinutes - minute) * 60);

  return { year, month, day, hour, minute, second };
}

/**
 * Calculate all 24 Solar Terms for a given year
 * Returns exact moments (Julian Day and calendar date/time in UTC)
 *
 * @param {number} year - Gregorian year
 * @returns {Array} - Array of Solar Term objects with exact timing
 */
function calculateSolarTermsForYear(year) {
  const results = [];

  for (const term of SOLAR_TERMS) {
    // Determine which year to search in
    // Terms in Jan-Feb might belong to previous year's cycle
    let searchYear = year;
    if (term.approxMonth === 1 || (term.approxMonth === 2 && term.approxDay < 4)) {
      // For terms in early year, we're calculating for THIS year
      searchYear = year;
    }

    // Find exact Julian Day
    const jd = findSolarTermJD(term.longitude, searchYear, term.approxMonth, term.approxDay);
    const calendar = julianDayToCalendar(jd);

    results.push({
      index: term.index,
      name: term.name,
      pinyin: term.pinyin,
      english: term.english,
      longitude: term.longitude,
      julianDay: jd,
      utc: {
        year: calendar.year,
        month: calendar.month,
        day: calendar.day,
        hour: calendar.hour,
        minute: calendar.minute,
        second: calendar.second
      },
      isoString: `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(calendar.day).padStart(2, '0')}T${String(calendar.hour).padStart(2, '0')}:${String(calendar.minute).padStart(2, '0')}:${String(calendar.second).padStart(2, '0')}Z`,
      isBaziYearBoundary: term.name === '\u7ACB\u6625',
      isBaziMonthBoundary: term.index % 2 === 0 // Jie (\u7BC0) terms start new months
    });
  }

  return results;
}

/**
 * Get Li Chun (\u7ACB\u6625) exact moment for a given year
 * This is when the BaZi year changes
 *
 * @param {number} year - Gregorian year
 * @returns {Object} - Li Chun timing details
 */
function getLiChunExact(year) {
  const liChunTerm = SOLAR_TERMS.find(t => t.name === '\u7ACB\u6625');
  const jd = findSolarTermJD(315, year, liChunTerm.approxMonth, liChunTerm.approxDay);
  const calendar = julianDayToCalendar(jd);

  return {
    name: '\u7ACB\u6625',
    pinyin: 'L\u00EC Ch\u016Bn',
    english: 'Spring Begins',
    julianDay: jd,
    utc: calendar,
    isoString: `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(calendar.day).padStart(2, '0')}T${String(calendar.hour).padStart(2, '0')}:${String(calendar.minute).padStart(2, '0')}:${String(calendar.second).padStart(2, '0')}Z`,
    sunLongitude: 315
  };
}

/**
 * Determine BaZi year for a given birth date/time
 * Uses precise Li Chun calculation
 *
 * @param {number} year - Birth year
 * @param {number} month - Birth month
 * @param {number} day - Birth day
 * @param {number} hour - Birth hour (UTC)
 * @param {number} minute - Birth minute
 * @returns {Object} - BaZi year info
 */
function getBaziYearWithPrecision(year, month, day, hour = 12, minute = 0) {
  const birthJD = dateToJulianDay(year, month, day, hour, minute, 0);

  // Get Li Chun for birth year
  const liChunThisYear = getLiChunExact(year);

  // Compare birth moment to Li Chun
  const bornBeforeLiChun = birthJD < liChunThisYear.julianDay;
  const baziYear = bornBeforeLiChun ? year - 1 : year;

  return {
    gregorianYear: year,
    baziYear: baziYear,
    bornBeforeLiChun: bornBeforeLiChun,
    liChun: liChunThisYear,
    note: bornBeforeLiChun
      ? `Born before \u7ACB\u6625 (${liChunThisYear.isoString}), BaZi year is ${baziYear}`
      : `Born after \u7ACB\u6625 (${liChunThisYear.isoString}), BaZi year is ${baziYear}`
  };
}

/**
 * Determine BaZi month for a given birth date/time
 * Uses precise Solar Term boundaries
 *
 * @param {number} year - Birth year
 * @param {number} month - Birth month
 * @param {number} day - Birth day
 * @param {number} hour - Birth hour (UTC)
 * @param {number} minute - Birth minute
 * @returns {Object} - BaZi month info
 */
function getBaziMonthWithPrecision(year, month, day, hour = 12, minute = 0) {
  const birthJD = dateToJulianDay(year, month, day, hour, minute, 0);

  // Get all solar terms for this year and adjacent months
  const allTerms = calculateSolarTermsForYear(year);

  // Find which BaZi month the birth falls into
  // BaZi months start at Jie (\u7BC0) terms (odd-indexed in our array, but they're the month boundaries)
  const monthBoundaryTerms = allTerms.filter(t => t.isBaziMonthBoundary);

  // Sort by Julian Day
  monthBoundaryTerms.sort((a, b) => a.julianDay - b.julianDay);

  // Find current month
  let currentMonth = null;
  let currentTerm = null;
  let nextTerm = null;

  for (let i = 0; i < monthBoundaryTerms.length; i++) {
    const term = monthBoundaryTerms[i];
    const nextTermObj = monthBoundaryTerms[i + 1];

    if (birthJD >= term.julianDay && (!nextTermObj || birthJD < nextTermObj.julianDay)) {
      currentTerm = term;
      nextTerm = nextTermObj;
      // Determine BaZi month number from the term
      for (const [monthNum, monthInfo] of Object.entries(BAZI_MONTH_TERMS)) {
        if (monthInfo.longitude === term.longitude) {
          currentMonth = parseInt(monthNum);
          break;
        }
      }
      break;
    }
  }

  // If no match found, birth is before first term of year
  if (!currentMonth) {
    currentMonth = 12; // Still in Ox month from previous cycle
    currentTerm = { name: '\u5C0F\u5BD2', english: 'Minor Cold' };
  }

  const MONTH_BRANCHES = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
                          'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const branchIndex = (currentMonth + 1) % 12; // Tiger = month 1, index 2

  return {
    baziMonth: currentMonth,
    branch: MONTH_BRANCHES[branchIndex],
    branchIndex: branchIndex,
    startingTerm: currentTerm ? {
      name: currentTerm.name,
      english: currentTerm.english,
      isoString: currentTerm.isoString
    } : null,
    nextTerm: nextTerm ? {
      name: nextTerm.name,
      english: nextTerm.english,
      isoString: nextTerm.isoString
    } : null
  };
}

/**
 * Get Moon Phase interpretation for natal charts
 */
function getMoonPhaseInterpretation(phaseName) {
  const interpretations = {
    'New Moon': {
      title: 'New Moon Native',
      brief: 'Initiator, fresh starts, instinctive action',
      full: 'Born during the New Moon phase, you embody the energy of new beginnings. You have a natural talent for starting fresh and initiating projects. Your instincts guide you strongly, and you tend to act on impulse. You may sometimes struggle to complete what you start, as you\'re already drawn to the next beginning.'
    },
    'Waxing Crescent': {
      title: 'Waxing Crescent Native',
      brief: 'Builder, determined, pushing through obstacles',
      full: 'Born during the Waxing Crescent phase, you possess remarkable determination. You understand that growth requires effort and aren\'t afraid to struggle for what you want. You have a pioneering spirit and the courage to forge ahead even when the path isn\'t clear.'
    },
    'First Quarter': {
      title: 'First Quarter Native',
      brief: 'Crisis-oriented, decisive, action-driven',
      full: 'Born during the First Quarter phase, you thrive in moments of crisis and decision. You have a natural ability to take decisive action when others hesitate. Challenges energize rather than discourage you, and you\'re skilled at building structures and making things happen.'
    },
    'Waxing Gibbous': {
      title: 'Waxing Gibbous Native',
      brief: 'Perfectionist, analyzer, improvement-focused',
      full: 'Born during the Waxing Gibbous phase, you\'re driven to refine, improve, and perfect. You have excellent analytical skills and a keen eye for what needs adjustment. You may sometimes be overly self-critical, but this same quality helps you achieve excellence in your endeavors.'
    },
    'Full Moon': {
      title: 'Full Moon Native',
      brief: 'Illuminator, relationship-oriented, visible',
      full: 'Born during the Full Moon phase, you live life in the spotlight of awareness. Relationships are central to your growth, and you learn most through interactions with others. Your life tends to be more public and visible, and you bring clarity and illumination wherever you go.'
    },
    'Waning Gibbous': {
      title: 'Waning Gibbous Native (Disseminator)',
      brief: 'Teacher, sharer, meaning-seeker',
      full: 'Born during the Waning Gibbous (Disseminating) phase, you\'re a natural teacher and communicator. You have wisdom to share and find meaning in passing knowledge to others. You seek to understand the deeper significance of experiences and help others do the same.'
    },
    'Last Quarter': {
      title: 'Last Quarter Native',
      brief: 'Revolutionary, breaking patterns, future-oriented',
      full: 'Born during the Last Quarter phase, you\'re here to break down old structures and challenge outdated beliefs. You have a revolutionary spirit and the courage to question the status quo. You may feel somewhat at odds with conventional society, as you see the need for change others don\'t yet recognize.'
    },
    'Waning Crescent': {
      title: 'Waning Crescent Native (Balsamic)',
      brief: 'Visionary, intuitive, transitional soul',
      full: 'Born during the Waning Crescent (Balsamic) phase, you carry ancient wisdom and strong intuitive abilities. You may feel like an old soul, here to complete karmic cycles and prepare for new beginnings. You have prophetic tendencies and a deep connection to the spiritual realm.'
    }
  };

  return interpretations[phaseName] || {
    title: 'Moon Phase Native',
    brief: 'Lunar influence present',
    full: 'The Moon\'s phase at your birth influences your emotional patterns and life rhythms.'
  };
}

/**
 * Calculate aspects between celestial bodies
 * Major aspects: Conjunction (0\u00B0), Opposition (180\u00B0), Trine (120\u00B0), Square (90\u00B0), Sextile (60\u00B0)
 * Minor aspects: Quincunx (150\u00B0), Semi-sextile (30\u00B0)
 */
function calculateAspects(celestialBodies) {
  const ASPECT_DEFINITIONS = [
    { name: 'Conjunction', symbol: '\u260C', angle: 0, orb: 8, nature: 'major', quality: 'neutral', description: 'Fusion of energies - intensification' },
    { name: 'Opposition', symbol: '\u260D', angle: 180, orb: 8, nature: 'major', quality: 'challenging', description: 'Tension seeking balance - awareness' },
    { name: 'Trine', symbol: '\u25B3', angle: 120, orb: 8, nature: 'major', quality: 'harmonious', description: 'Natural flow - ease and talent' },
    { name: 'Square', symbol: '\u25A1', angle: 90, orb: 8, nature: 'major', quality: 'challenging', description: 'Friction creating growth - action required' },
    { name: 'Sextile', symbol: '\u26B9', angle: 60, orb: 6, nature: 'major', quality: 'harmonious', description: 'Opportunity - requires effort to activate' },
    { name: 'Quincunx', symbol: '\u26BB', angle: 150, orb: 3, nature: 'minor', quality: 'adjustment', description: 'Incompatible energies requiring adjustment' },
    { name: 'Semi-sextile', symbol: '\u26BA', angle: 30, orb: 2, nature: 'minor', quality: 'neutral', description: 'Subtle connection - slight friction' }
  ];

  const aspects = [];
  const bodies = Object.entries(celestialBodies);

  // Compare each pair of bodies
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const [name1, body1] = bodies[i];
      const [name2, body2] = bodies[j];

      // Get longitudes
      const lon1 = body1.totalLongitude;
      const lon2 = body2.totalLongitude;

      if (lon1 === undefined || lon2 === undefined) continue;

      // Calculate angular separation (always positive, 0-180)
      let separation = Math.abs(lon1 - lon2);
      if (separation > 180) separation = 360 - separation;

      // Check against each aspect definition
      for (const aspectDef of ASPECT_DEFINITIONS) {
        const diff = Math.abs(separation - aspectDef.angle);
        if (diff <= aspectDef.orb) {
          // Calculate exactness (0 = perfect, 100 = edge of orb)
          const exactness = Math.round((1 - diff / aspectDef.orb) * 100);

          aspects.push({
            planet1: { name: name1, sign: body1.sign, symbol: body1.symbol },
            planet2: { name: name2, sign: body2.sign, symbol: body2.symbol },
            aspect: aspectDef.name,
            symbol: aspectDef.symbol,
            angle: aspectDef.angle,
            actualAngle: Math.round(separation * 100) / 100,
            orb: Math.round(diff * 100) / 100,
            exactness,
            nature: aspectDef.nature,
            quality: aspectDef.quality,
            description: aspectDef.description
          });
          break; // Only one aspect per pair
        }
      }
    }
  }

  // Sort by exactness (most exact first)
  aspects.sort((a, b) => b.exactness - a.exactness);

  return aspects;
}

module.exports = {
  dateToJulianDay,
  SOLAR_TERMS,
  BAZI_MONTH_TERMS,
  getSunLongitudeAtJD,
  findSolarTermJD,
  julianDayToCalendar,
  calculateSolarTermsForYear,
  getLiChunExact,
  getBaziYearWithPrecision,
  getBaziMonthWithPrecision,
  getMoonPhaseInterpretation,
  calculateAspects
};
