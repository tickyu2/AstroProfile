/**
 * ============================================
 * BAZI DAYUN SERVICE
 * 10-Year Luck Pillars API Integration
 * ============================================
 *
 * Provides frontend access to the Python BaZi engine's
 * DaYun (大運) luck pillar calculations.
 *
 * Features:
 * - 10-year luck pillar sequences
 * - Current luck pillar identification
 * - LiuNian (annual) and XiaoYun (minor) luck
 * - Comprehensive luck timeline
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

// ============================================
// CORE DAYUN FUNCTIONS
// ============================================

/**
 * Calculate complete DaYun (10-year luck pillars) for a person
 *
 * @param {Object} params
 * @param {string} params.birthDate - Birth date in YYYY-MM-DD format
 * @param {string} params.birthTime - Birth time in HH:MM format (24hr)
 * @param {boolean} params.isMale - True for male, false for female
 * @param {number} [params.pillarCount=8] - Number of luck pillars to calculate
 * @returns {Promise<Object>} DaYun results with pillars, direction, and onset age
 */
export async function calculateDaYun(params) {
  try {
    // Call Python cloud function
    const response = await fetch(
      `${import.meta.env.VITE_PYTHON_FUNCTIONS_URL || ''}/bazi_dayun`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: params.birthDate,
          birthTime: params.birthTime || '12:00',
          isMale: params.isMale !== false, // Default to male
          pillarCount: params.pillarCount || 8
        })
      }
    );

    if (!response.ok) {
      throw new Error(`DaYun calculation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('DaYun calculation error:', error);

    // Return mock data for development/offline mode
    return generateMockDaYun(params);
  }
}

/**
 * Get current luck information (DaYun + LiuNian + XiaoYun)
 *
 * @param {Object} params
 * @param {string} params.birthDate - Birth date in YYYY-MM-DD format
 * @param {string} params.birthTime - Birth time in HH:MM format
 * @param {boolean} params.isMale - True for male
 * @param {string} [params.targetDate] - Date to calculate for (default: today)
 * @returns {Promise<Object>} Comprehensive luck status
 */
export async function getCurrentLuckInfo(params) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PYTHON_FUNCTIONS_URL || ''}/bazi_current_luck`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: params.birthDate,
          birthTime: params.birthTime || '12:00',
          isMale: params.isMale !== false,
          targetDate: params.targetDate || new Date().toISOString().split('T')[0]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Current luck calculation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Current luck error:', error);
    return generateMockCurrentLuck(params);
  }
}

/**
 * Get LiuNian (annual pillar) for a specific year
 *
 * @param {number} year - Gregorian year
 * @returns {Promise<Object>} Annual pillar with element and animal
 */
export async function getLiuNian(year) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PYTHON_FUNCTIONS_URL || ''}/bazi_liunian`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year })
      }
    );

    if (!response.ok) {
      throw new Error(`LiuNian calculation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('LiuNian error:', error);
    return generateMockLiuNian(year);
  }
}

// ============================================
// ELEMENT ANALYSIS
// ============================================

/**
 * Analyze element flow through luck periods
 *
 * @param {Array} luckPillars - Array of luck pillar objects
 * @returns {Object} Element distribution and transitions
 */
export function analyzeLuckElements(luckPillars) {
  const elementCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const transitions = [];

  const stemElements = {
    Jia: 'Wood', Yi: 'Wood',
    Bing: 'Fire', Ding: 'Fire',
    Wu: 'Earth', Ji: 'Earth',
    Geng: 'Metal', Xin: 'Metal',
    Ren: 'Water', Gui: 'Water'
  };

  luckPillars.forEach((pillar, index) => {
    const element = stemElements[pillar.stem] || 'Unknown';
    if (elementCounts[element] !== undefined) {
      elementCounts[element]++;
    }

    if (index > 0) {
      const prevElement = stemElements[luckPillars[index - 1].stem];
      if (prevElement !== element) {
        transitions.push({
          age: pillar.age_start,
          from: prevElement,
          to: element,
          description: getElementTransitionDescription(prevElement, element)
        });
      }
    }
  });

  // Find dominant element
  const dominantElement = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    distribution: elementCounts,
    dominantElement,
    transitions,
    summary: `Life dominated by ${dominantElement} energy with ${transitions.length} major transitions`
  };
}

/**
 * Get description for element transition
 */
function getElementTransitionDescription(from, to) {
  const transitions = {
    'Wood→Fire': 'Growth ignites passion - expansion and self-expression',
    'Fire→Earth': 'Passion grounds into stability - consolidation phase',
    'Earth→Metal': 'Stability refines into precision - discipline emerges',
    'Metal→Water': 'Structure dissolves into flow - wisdom and intuition',
    'Water→Wood': 'Wisdom nurtures growth - new beginnings emerge',
    'Wood→Earth': 'Growth controlled by practicality - grounding excess',
    'Fire→Metal': 'Passion tempered by discipline - transformation',
    'Earth→Water': 'Stability meets uncertainty - adaptation required',
    'Metal→Wood': 'Structure challenged by growth - breaking constraints',
    'Water→Fire': 'Wisdom meets passion - creative tension'
  };

  return transitions[`${from}→${to}`] || `Transition from ${from} to ${to} phase`;
}

// ============================================
// MOCK DATA GENERATORS (for offline/dev)
// ============================================

function generateMockDaYun(params) {
  const [year, month, day] = (params.birthDate || '1990-01-01').split('-').map(Number);
  const birthYear = year;

  // Simple mock: alternate elements
  const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
  const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

  const direction = params.isMale ? 'forward' : 'backward';
  const onsetAge = Math.floor(Math.random() * 5) + 2; // 2-7 years

  const pillars = [];
  for (let i = 0; i < (params.pillarCount || 8); i++) {
    const stemIdx = (month + i * (direction === 'forward' ? 1 : -1) + 10) % 10;
    const branchIdx = (month + i * (direction === 'forward' ? 1 : -1) + 12) % 12;

    pillars.push({
      pillar_number: i + 1,
      stem: stems[stemIdx],
      branch: branches[branchIdx],
      ganZhi: `${stems[stemIdx]}${branches[branchIdx]}`,
      age_start: onsetAge + (i * 10),
      age_end: onsetAge + (i * 10) + 9,
      age_range: `${onsetAge + (i * 10)}-${onsetAge + (i * 10) + 9}`
    });
  }

  return {
    direction,
    direction_chinese: direction === 'forward' ? '顺行' : '逆行',
    onset_age: {
      years: onsetAge,
      months: 0,
      days: 0,
      description: `First luck pillar begins at age ${onsetAge}`
    },
    luck_pillars: pillars,
    interpretation: {
      is_male: params.isMale,
      year_stem_polarity: 'Yang',
      explanation: `${params.isMale ? 'Male' : 'Female'}: Luck pillars proceed ${direction} from month pillar.`
    },
    _mock: true
  };
}

function generateMockCurrentLuck(params) {
  const dayun = generateMockDaYun(params);
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(params.birthDate?.split('-')[0] || '1990');
  const currentAge = currentYear - birthYear;

  // Find current DaYun
  const currentDayun = dayun.luck_pillars.find(
    p => p.age_start <= currentAge && p.age_end >= currentAge
  ) || dayun.luck_pillars[0];

  return {
    calculation_date: new Date().toISOString(),
    birth_date: params.birthDate,
    current_age: currentAge,
    is_male: params.isMale,
    dayun: {
      current: currentDayun,
      direction: dayun.direction,
      direction_chinese: dayun.direction_chinese,
      years_remaining: currentDayun ? currentDayun.age_end - currentAge + 1 : null,
      next_transition: null,
      onset_age: dayun.onset_age
    },
    liunian: generateMockLiuNian(currentYear),
    xiaoyun: {
      age: currentAge,
      stem: 'Bing',
      branch: 'Wu',
      ganZhi: 'BingWu',
      element: 'Fire'
    },
    summary: {
      annual: `${currentYear} is a Wood Snake year`,
      minor: 'Minor luck influence: BingWu',
      major: currentDayun ? `10-year period: ${currentDayun.ganZhi}` : 'Pre-DaYun phase',
      full: 'Currently experiencing dynamic luck influences.'
    },
    _mock: true
  };
}

function generateMockLiuNian(year) {
  const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
  const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const elements = { Jia: 'Wood', Yi: 'Wood', Bing: 'Fire', Ding: 'Fire', Wu: 'Earth', Ji: 'Earth', Geng: 'Metal', Xin: 'Metal', Ren: 'Water', Gui: 'Water' };

  const cycleOffset = (year - 1984) % 60;
  const stemIdx = cycleOffset % 10;
  const branchIdx = cycleOffset % 12;

  const stem = stems[stemIdx];
  const branch = branches[branchIdx];

  return {
    year,
    stem,
    branch,
    ganZhi: `${stem}${branch}`,
    element: elements[stem],
    polarity: stemIdx % 2 === 0 ? 'Yang' : 'Yin',
    animal: animals[branchIdx],
    description: `${year} is a ${elements[stem]} ${animals[branchIdx]} year`,
    _mock: true
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate, targetDate = new Date()) {
  const birth = new Date(birthDate);
  const target = new Date(targetDate);
  let age = target.getFullYear() - birth.getFullYear();
  const monthDiff = target.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get element color for UI
 */
export function getElementColor(element) {
  const colors = {
    Wood: { bg: 'bg-green-900/50', text: 'text-green-400', border: 'border-green-500/40', emoji: '🌳' },
    Fire: { bg: 'bg-red-900/50', text: 'text-red-400', border: 'border-red-500/40', emoji: '🔥' },
    Earth: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', border: 'border-yellow-500/40', emoji: '🏔️' },
    Metal: { bg: 'bg-gray-700/50', text: 'text-gray-300', border: 'border-gray-500/40', emoji: '⚔️' },
    Water: { bg: 'bg-blue-900/50', text: 'text-blue-400', border: 'border-blue-500/40', emoji: '💧' }
  };
  return colors[element] || colors.Earth;
}

/**
 * Get stem element mapping
 */
export function getStemElement(stem) {
  const elements = {
    Jia: 'Wood', Yi: 'Wood',
    Bing: 'Fire', Ding: 'Fire',
    Wu: 'Earth', Ji: 'Earth',
    Geng: 'Metal', Xin: 'Metal',
    Ren: 'Water', Gui: 'Water'
  };
  return elements[stem] || 'Unknown';
}

export default {
  calculateDaYun,
  getCurrentLuckInfo,
  getLiuNian,
  analyzeLuckElements,
  calculateAge,
  getElementColor,
  getStemElement
};
