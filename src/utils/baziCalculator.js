/**
 * ============================================
 * BAZI CALCULATOR - Industry Standard
 * Using lunar-javascript for Solar Term precision
 * WITH HISTORICAL DATE SUPPORT (unlimited range)
 * ============================================
 */

import { Solar } from 'lunar-javascript';
import {
  STEMS,
  BRANCHES,
  HIDDEN_STEMS,
  calculateWeightedElements,
  calculateYinYang,
  calculateTenGod,
  checkBranchInteraction,
  parsePillarString,
  getConstitutionalMetaphor
} from './baziEngine.js';
import {
  calculateHistoricalFourPillars
} from './historicalBaziCalc.js';

/**
 * Main calculation function
 * @param {Object} birthData - Birth information
 * @returns {Object} Complete BaZi analysis
 */
export function calculateBaZi(birthData) {
  const { year, month, day, hour, minute = 0, second = 0 } = birthData;
  
  let yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi;
  let calculationMethod = 'lunar-javascript (Industry Standard)';
  
  // Try library first (works for 1900-2100)
  if (year >= 1900 && year <= 2100) {
    try {
      // 1. Create Solar object (uses Gregorian calendar)
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, second);
      
      // 2. Convert to Lunar for BaZi methods
      const lunar = solar.getLunar();
      
      // 3. Get Four Pillars using EXACT methods (respects Solar Terms!)
      yearGanZhi = lunar.getYearInGanZhiExact();
      monthGanZhi = lunar.getMonthInGanZhiExact();  // ← This respects Jie Qi!
      dayGanZhi = lunar.getDayInGanZhiExact();
      hourGanZhi = lunar.getTimeInGanZhi();
    } catch (error) {
      console.warn('Library calculation failed, using mathematical fallback:', error);
      calculationMethod = 'mathematical (fallback)';
      const historical = calculateHistoricalFourPillars(year, month, day, hour, minute);
      yearGanZhi = historical.year;
      monthGanZhi = historical.month;
      dayGanZhi = historical.day;
      hourGanZhi = historical.hour;
    }
  } else {
    // Use mathematical calculation for dates outside library range
    calculationMethod = 'mathematical (historical date)';
    const historical = calculateHistoricalFourPillars(year, month, day, hour, minute);
    yearGanZhi = historical.year;
    monthGanZhi = historical.month;
    dayGanZhi = historical.day;
    hourGanZhi = historical.hour;
  }
  
  // 4. Parse each pillar
  const yearPillar = parsePillarString(yearGanZhi);
  const monthPillar = parsePillarString(monthGanZhi);
  const dayPillar = parsePillarString(dayGanZhi);
  const hourPillar = parsePillarString(hourGanZhi);
  
  // 5. Day Master (日主) - Your core essence
  const dayMaster = dayPillar.stem;
  
  // 6. Calculate Ten Gods for each stem
  const pillars = [
    {
      ...yearPillar,
      name: 'Year Pillar',
      chinese: '年柱',
      ages: '0-16',
      significance: 'Ancestral Foundation',
      weight: 0.05
    },
    {
      ...monthPillar,
      name: 'Month Pillar',
      chinese: '月柱',
      ages: '17-32',
      significance: 'Parents & Early Career',
      weight: 0.10
    },
    {
      ...dayPillar,
      name: 'Day Pillar',
      chinese: '日柱',
      ages: '33-48',
      significance: 'Self & Spouse ⭐',
      weight: 0.70,
      isYou: true
    },
    {
      ...hourPillar,
      name: 'Hour Pillar',
      chinese: '时柱',
      ages: '49+',
      significance: 'Children & Later Life',
      weight: 0.15
    }
  ];
  
  // Add Ten God relationships
  pillars.forEach(pillar => {
    pillar.tenGod = calculateTenGod(
      dayMaster.element,
      dayMaster.polarity,
      pillar.stem.char
    );
  });
  
  // 7. Calculate weighted elements (THE CORE ALGORITHM)
  const elementAnalysis = calculateWeightedElements(pillars);
  
  // 8. Calculate Yin/Yang balance
  const yinYangBalance = calculateYinYang(pillars);
  
  // 9. Check for interactions between branches
  const interactions = [];
  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const interaction = checkBranchInteraction(
        pillars[i].branch.char,
        pillars[j].branch.char
      );
      if (interaction) {
        interactions.push({
          ...interaction,
          pillar1: i,
          pillar2: j,
          name1: pillars[i].name,
          name2: pillars[j].name,
          branch1: pillars[i].branch.animal,
          branch2: pillars[j].branch.animal
        });
      }
    }
  }
  
  // 10. Get constitutional metaphor
  const metaphor = getConstitutionalMetaphor(elementAnalysis);
  
  // 11. Determine strengths and weaknesses
  const strengths = [];
  const weaknesses = [];
  const missing = [];
  
  Object.entries(elementAnalysis.percentages).forEach(([element, pct]) => {
    const numPct = parseFloat(pct);
    if (numPct >= 30) {
      strengths.push({ element, pct: numPct });
    } else if (numPct >= 10) {
      // Moderate - not listed
    } else if (numPct >= 5) {
      weaknesses.push({ element, pct: numPct });
    } else {
      missing.push({ element, pct: numPct });
    }
  });
  
  // Sort by percentage
  strengths.sort((a, b) => b.pct - a.pct);
  weaknesses.sort((a, b) => a.pct - b.pct);
  missing.sort((a, b) => a.pct - b.pct);
  
  // 12. Return complete analysis
  return {
    // Input data
    birthData: {
      year,
      month,
      day,
      hour,
      minute,
      second
    },
    
    // Four Pillars
    pillars,
    
    // Day Master (Core Essence)
    dayMaster: {
      ...dayMaster,
      animal: dayPillar.branch.animal,
      fullName: `${dayMaster.english} ${dayPillar.branch.animal}`,
      chinese: dayGanZhi
    },
    
    // Element Analysis (WITH WEIGHTED HIDDEN ROOTS)
    elements: {
      ...elementAnalysis,
      strengths,
      weaknesses,
      missing,
      dominant: strengths[0]?.element || 'Balanced'
    },
    
    // Yin/Yang Balance
    yinYang: yinYangBalance,
    
    // Branch Interactions
    interactions,
    
    // Constitutional Metaphor
    metaphor,
    
    // Metadata
    calculationMethod,
    solarTermsRespected: true,
    hiddenRootsIncluded: true,
    weightedCalculation: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Legacy format for compatibility
 */
export function calculateBaZiLegacy(birthDate, birthTime, locationData) {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1; // JS months are 0-indexed
  const day = birthDate.getDate();
  
  const [hour = 12, minute = 0] = birthTime.split(':').map(Number);
  
  return calculateBaZi({ year, month, day, hour, minute });
}

/**
 * Calculate compatibility between two charts
 */
export function calculateCompatibility(chart1, chart2) {
  // Element compatibility
  const elem1 = chart1.elements.percentages;
  const elem2 = chart2.elements.percentages;
  
  let overlapScore = 0;
  let complementScore = 0;
  let conflictScore = 0;
  
  // Calculate overlap (both strong in same element)
  Object.keys(elem1).forEach(element => {
    const pct1 = parseFloat(elem1[element]);
    const pct2 = parseFloat(elem2[element]);
    
    if (pct1 >= 20 && pct2 >= 20) {
      overlapScore += Math.min(pct1, pct2);
    }
    
    // Complement (one strong, other weak)
    if ((pct1 >= 30 && pct2 < 10) || (pct2 >= 30 && pct1 < 10)) {
      complementScore += Math.abs(pct1 - pct2);
    }
    
    // Check for elemental conflicts
    // (Will implement full Five Element interaction logic)
  });
  
  // Branch interactions between charts
  const crossInteractions = [];
  chart1.pillars.forEach(p1 => {
    chart2.pillars.forEach(p2 => {
      const interaction = checkBranchInteraction(
        p1.branch.char,
        p2.branch.char
      );
      if (interaction) {
        crossInteractions.push({
          ...interaction,
          person1Pillar: p1.name,
          person2Pillar: p2.name
        });
      }
    });
  });
  
  // Calculate overall score
  const coverageScore = 100 - missing_coverage_calculation(elem1, elem2);
  const harmonyScore = calculate_harmony(crossInteractions);
  
  const totalScore = (
    coverageScore * 0.4 +
    complementScore * 0.3 +
    harmonyScore * 0.3
  );
  
  return {
    totalScore: totalScore.toFixed(1),
    overlapScore: overlapScore.toFixed(1),
    complementScore: complementScore.toFixed(1),
    coverageScore: coverageScore.toFixed(1),
    crossInteractions,
    interpretation: getCompatibilityInterpretation(totalScore)
  };
}

function calculate_harmony(interactions) {
  let harmony = 50; // Start neutral
  interactions.forEach(int => {
    if (int.type === 'Combine') harmony += 10;
    if (int.type === 'Clash') harmony -= 10;
  });
  return Math.max(0, Math.min(100, harmony));
}

function missing_coverage_calculation(elem1, elem2) {
  let gaps = 0;
  Object.keys(elem1).forEach(element => {
    const combined = parseFloat(elem1[element]) + parseFloat(elem2[element]);
    if (combined < 20) gaps += (20 - combined);
  });
  return gaps;
}

function getCompatibilityInterpretation(score) {
  if (score >= 90) return 'Soul Partner - Cosmic Alignment! ✨';
  if (score >= 80) return 'Excellent Match - Strong Synergy! 🔥';
  if (score >= 70) return 'Good Compatibility - Works Well Together';
  if (score >= 60) return 'Moderate - Requires Conscious Effort';
  return 'Challenging - Major Adjustments Needed';
}

export default {
  calculateBaZi,
  calculateBaZiLegacy,
  calculateCompatibility
};
