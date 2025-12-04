/**
 * Four Pillars Calculator with DEBUG LOGGING
 * Shows every calculation step for transparency and debugging
 */

// ============================================================================
// STEM-BRANCH DATA
// ============================================================================

const CELESTIAL_STEMS = [
  { chinese: '甲', pinyin: 'Jiǎ', english: 'Yang Wood', element: 'Wood', polarity: 'Yang', index: 0 },
  { chinese: '乙', pinyin: 'Yǐ', english: 'Yin Wood', element: 'Wood', polarity: 'Yin', index: 1 },
  { chinese: '丙', pinyin: 'Bǐng', english: 'Yang Fire', element: 'Fire', polarity: 'Yang', index: 2 },
  { chinese: '丁', pinyin: 'Dīng', english: 'Yin Fire', element: 'Fire', polarity: 'Yin', index: 3 },
  { chinese: '戊', pinyin: 'Wù', english: 'Yang Earth', element: 'Earth', polarity: 'Yang', index: 4 },
  { chinese: '己', pinyin: 'Jǐ', english: 'Yin Earth', element: 'Earth', polarity: 'Yin', index: 5 },
  { chinese: '庚', pinyin: 'Gēng', english: 'Yang Metal', element: 'Metal', polarity: 'Yang', index: 6 },
  { chinese: '辛', pinyin: 'Xīn', english: 'Yin Metal', element: 'Metal', polarity: 'Yin', index: 7 },
  { chinese: '壬', pinyin: 'Rén', english: 'Yang Water', element: 'Water', polarity: 'Yang', index: 8 },
  { chinese: '癸', pinyin: 'Guǐ', english: 'Yin Water', element: 'Water', polarity: 'Yin', index: 9 }
];

const EARTHLY_BRANCHES = [
  { chinese: '子', pinyin: 'Zǐ', english: 'Rat', element: 'Water', polarity: 'Yang', index: 0 },
  { chinese: '丑', pinyin: 'Chǒu', english: 'Ox', element: 'Earth', polarity: 'Yin', index: 1 },
  { chinese: '寅', pinyin: 'Yín', english: 'Tiger', element: 'Wood', polarity: 'Yang', index: 2 },
  { chinese: '卯', pinyin: 'Mǎo', english: 'Rabbit', element: 'Wood', polarity: 'Yin', index: 3 },
  { chinese: '辰', pinyin: 'Chén', english: 'Dragon', element: 'Earth', polarity: 'Yang', index: 4 },
  { chinese: '巳', pinyin: 'Sì', english: 'Snake', element: 'Fire', polarity: 'Yin', index: 5 },
  { chinese: '午', pinyin: 'Wǔ', english: 'Horse', element: 'Fire', polarity: 'Yang', index: 6 },
  { chinese: '未', pinyin: 'Wèi', english: 'Goat', element: 'Earth', polarity: 'Yin', index: 7 },
  { chinese: '申', pinyin: 'Shēn', english: 'Monkey', element: 'Metal', polarity: 'Yang', index: 8 },
  { chinese: '酉', pinyin: 'Yǒu', english: 'Rooster', element: 'Metal', polarity: 'Yin', index: 9 },
  { chinese: '戌', pinyin: 'Xū', english: 'Dog', element: 'Earth', polarity: 'Yang', index: 10 },
  { chinese: '亥', pinyin: 'Hài', english: 'Pig', element: 'Water', polarity: 'Yin', index: 11 }
];

// ============================================================================
// HOUR STEM TABLE - FIXED VERSION (Increments by 1, not 2)
// ============================================================================

const HOUR_STEM_TABLE = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], // Jiǎ or Jǐ Day
  1: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3], // Yǐ or Gēng Day
  2: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5], // Bǐng or Xīn Day
  3: [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7], // Dīng or Rén Day
  4: [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]  // Wù or Guǐ Day
};

// ============================================================================
// EQUATION OF TIME CALCULATOR
// ============================================================================

function calculateEquationOfTime(dayOfYear) {
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  const EOT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  return EOT;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// ============================================================================
// TRUE SOLAR TIME CONVERTER (WITH EQUATION OF TIME)
// ============================================================================

function convertToSolarTime(date, longitude) {
  console.log('\n🌅 === SOLAR TIME CONVERSION ===');
  console.log('Input:', {
    localTime: date.toLocaleString(),
    longitude: longitude.toFixed(4) + '°E'
  });

  // Auto-detect standard meridian based on longitude
  const STANDARD_MERIDIAN = Math.round(longitude / 15) * 15;
  console.log('Standard Meridian:', STANDARD_MERIDIAN + '°E (auto-detected from longitude)');

  // Calculate longitude correction
  const longitudeCorrection = (longitude - STANDARD_MERIDIAN) * 4;
  console.log('Longitude Correction:', longitudeCorrection.toFixed(2) + ' minutes');

  // Calculate Equation of Time
  const dayOfYear = getDayOfYear(date);
  const EOT = calculateEquationOfTime(dayOfYear);
  console.log('Equation of Time (EOT):', EOT.toFixed(2) + ' minutes');

  // Total correction
  const totalCorrection = longitudeCorrection + EOT;
  console.log('Total Correction:', totalCorrection.toFixed(2) + ' minutes');

  // Apply correction
  const solarTime = new Date(date.getTime() + totalCorrection * 60000);
  console.log('Solar Time:', solarTime.toLocaleString());
  console.log('Solar Time (24h):', 
    solarTime.getHours().toString().padStart(2, '0') + ':' + 
    solarTime.getMinutes().toString().padStart(2, '0')
  );

  return solarTime;
}

// ============================================================================
// HOUR PILLAR CALCULATOR (WITH DEBUG LOGGING)
// ============================================================================

function calculateHourPillar(solarTime, dayStemIndex) {
  console.log('\n⏰ === HOUR PILLAR CALCULATION ===');
  console.log('Solar Time:', solarTime.toLocaleString());
  console.log('Day Stem Index:', dayStemIndex, '(' + CELESTIAL_STEMS[dayStemIndex].pinyin + ')');

  // Determine Day Stem Group
  const dayGroup = dayStemIndex % 5;
  console.log('Day Stem Group:', dayGroup, '(dayStemIndex % 5)');
  console.log('Table Row to Use:', dayGroup);

  // Calculate Hour Branch
  const hour = solarTime.getHours();
  const hourBranchIndex = Math.floor((hour + 1) % 24 / 2) % 12;
  console.log('Hour (24h format):', hour);
  console.log('Hour Branch Index:', hourBranchIndex);
  console.log('Hour Branch:', EARTHLY_BRANCHES[hourBranchIndex].pinyin, 
    '(' + EARTHLY_BRANCHES[hourBranchIndex].chinese + ')');

  // Look up Hour Stem from table
  console.log('\n🔍 TABLE LOOKUP:');
  console.log('HOUR_STEM_TABLE[' + dayGroup + '][' + hourBranchIndex + ']');
  console.log('Full Row ' + dayGroup + ':', HOUR_STEM_TABLE[dayGroup]);
  
  const hourStemIndex = HOUR_STEM_TABLE[dayGroup][hourBranchIndex];
  console.log('→ Value at position [' + hourBranchIndex + ']:', hourStemIndex);
  console.log('Hour Stem:', CELESTIAL_STEMS[hourStemIndex].pinyin,
    '(' + CELESTIAL_STEMS[hourStemIndex].chinese + ')');

  console.log('\n✅ RESULT:');
  console.log('Hour Pillar:', 
    CELESTIAL_STEMS[hourStemIndex].chinese + EARTHLY_BRANCHES[hourBranchIndex].chinese,
    '(' + CELESTIAL_STEMS[hourStemIndex].pinyin + ' ' + EARTHLY_BRANCHES[hourBranchIndex].pinyin + ')'
  );

  return {
    stem: CELESTIAL_STEMS[hourStemIndex],
    branch: EARTHLY_BRANCHES[hourBranchIndex],
    calculation: {
      dayGroup: dayGroup,
      hourBranchIndex: hourBranchIndex,
      tableRow: HOUR_STEM_TABLE[dayGroup],
      lookupValue: hourStemIndex
    }
  };
}

// ============================================================================
// SIMPLIFIED CALCULATOR FOR TESTING
// ============================================================================

function calculateSimple(birthDate, birthTime, latitude, longitude) {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 FOUR PILLARS CALCULATION WITH DEBUG LOGGING');
  console.log('='.repeat(70));
  console.log('Birth Date:', birthDate);
  console.log('Birth Time:', birthTime);
  console.log('Location:', latitude.toFixed(4) + '°N, ' + longitude.toFixed(4) + '°E');

  // Create datetime
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hours, minutes] = birthTime.split(':').map(Number);
  const localTime = new Date(year, month - 1, day, hours, minutes, 0);

  // Convert to solar time
  const solarTime = convertToSolarTime(localTime, longitude);

  // Calculate Day Stem (simplified - would need proper calculation)
  const daysSinceEpoch = Math.floor(localTime.getTime() / 86400000);
  const dayStemIndex = (daysSinceEpoch + 6) % 10;
  
  console.log('\n📅 Day Stem (simplified calculation):');
  console.log('Day Stem Index:', dayStemIndex);
  console.log('Day Stem:', CELESTIAL_STEMS[dayStemIndex].pinyin, 
    '(' + CELESTIAL_STEMS[dayStemIndex].chinese + ')');

  // Calculate Hour Pillar
  const hourPillar = calculateHourPillar(solarTime, dayStemIndex);

  console.log('\n' + '='.repeat(70));
  console.log('✨ CALCULATION COMPLETE');
  console.log('='.repeat(70) + '\n');

  return hourPillar;
}

// Export for use in your app
export { calculateSimple, calculateHourPillar, convertToSolarTime, HOUR_STEM_TABLE };
