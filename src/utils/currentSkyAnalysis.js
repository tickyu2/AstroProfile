/**
 * currentSkyAnalysis.js
 * =====================
 *
 * Orchestrator for daily celestial guidance - "How today's sky affects YOUR Saturn"
 * Part of the Liz Greene Cathedral - Phase 1: Living System
 *
 * Features:
 * - Current sky snapshot
 * - Personal transit analysis
 * - Saturn cycle awareness
 * - Daily/weekly/monthly guidance
 * - Luna integration
 *
 * GENESIS AstroProfile - January 2026
 */

import {
  getCurrentPlanetaryPositions,
  calculateTransitsToNatal,
  calculateSaturnCycleTransit,
  getUpcomingSignificantTransits
} from './transitCalculator';

import {
  getTransitInterpretation,
  getSaturnTransitInterpretation,
  generateDailyTransitGuidance,
  TRANSIT_PLANET_THEMES
} from './transitInterpretation';

// =============================================================================
// CURRENT SKY SNAPSHOT
// =============================================================================

/**
 * Get a complete snapshot of the current sky
 */
export function getCurrentSkySnapshot(date = new Date()) {
  const positions = getCurrentPlanetaryPositions(date);

  // Identify current sky themes
  const themes = [];

  // Check for stelliums (3+ planets in same sign)
  const signCounts = {};
  Object.values(positions.positions).forEach(pos => {
    signCounts[pos.sign] = (signCounts[pos.sign] || 0) + 1;
  });

  const stelliumSigns = Object.entries(signCounts)
    .filter(([sign, count]) => count >= 3)
    .map(([sign, count]) => ({ sign, count }));

  if (stelliumSigns.length > 0) {
    stelliumSigns.forEach(s => {
      themes.push({
        type: 'stellium',
        description: `${s.count} planets in ${s.sign}`,
        significance: 'Concentrated energy in this area of life'
      });
    });
  }

  // Check retrograde status
  if (positions.retrogradeCount > 2) {
    themes.push({
      type: 'retrograde-heavy',
      description: `${positions.retrogradeCount} planets retrograde`,
      significance: 'Time for review, revision, and inner work'
    });
  }

  // Saturn position awareness
  const saturnPos = positions.positions.Saturn;
  themes.push({
    type: 'saturn-transit',
    description: `Saturn in ${saturnPos.sign}${saturnPos.retrograde ? ' (retrograde)' : ''}`,
    significance: `Collective lessons in ${saturnPos.sign} themes`
  });

  return {
    date: positions.date,
    positions: positions.positions,
    retrogradeCount: positions.retrogradeCount,
    retrogradePlanets: positions.retrogradePlanets,
    stelliumSigns,
    themes,
    headline: generateSkyHeadline(positions, themes)
  };
}

/**
 * Generate a headline for the current sky
 */
function generateSkyHeadline(positions, themes) {
  const saturnPos = positions.positions.Saturn;
  const retroCount = positions.retrogradeCount;

  if (retroCount >= 4) {
    return 'Deep Review Period: Multiple planets moving inward';
  }

  if (themes.some(t => t.type === 'stellium')) {
    const stellium = themes.find(t => t.type === 'stellium');
    return `Concentrated Energy: ${stellium.description}`;
  }

  return `Saturn in ${saturnPos.sign}: Building through ${getSignTheme(saturnPos.sign)}`;
}

/**
 * Get brief theme for a sign
 */
function getSignTheme(sign) {
  const themes = {
    Aries: 'initiative and courage',
    Taurus: 'patience and resources',
    Gemini: 'communication and learning',
    Cancer: 'nurturing and security',
    Leo: 'creativity and self-expression',
    Virgo: 'service and refinement',
    Libra: 'relationship and balance',
    Scorpio: 'transformation and depth',
    Sagittarius: 'meaning and expansion',
    Capricorn: 'structure and achievement',
    Aquarius: 'innovation and community',
    Pisces: 'compassion and transcendence'
  };
  return themes[sign] || sign;
}

// =============================================================================
// PERSONAL TRANSIT ANALYSIS
// =============================================================================

/**
 * Build complete personal transit report
 */
export function buildPersonalTransitReport(natalChart, date = new Date()) {
  if (!natalChart) {
    return { error: 'Natal chart data required' };
  }

  // Get current sky
  const sky = getCurrentSkySnapshot(date);

  // Calculate transits to natal chart
  const transits = calculateTransitsToNatal(natalChart, date);

  // Get Saturn cycle position
  const saturnCycle = calculateSaturnCycleTransit(
    natalChart.planets?.Saturn || natalChart.saturn,
    date
  );

  // Generate daily guidance
  const dailyGuidance = generateDailyTransitGuidance(transits, natalChart);

  // Categorize transits by intensity
  const majorTransits = transits.filter(t => t.importance >= 60);
  const moderateTransits = transits.filter(t => t.importance >= 40 && t.importance < 60);
  const minorTransits = transits.filter(t => t.importance < 40);

  // Get detailed interpretations for major transits
  const interpretedTransits = majorTransits.slice(0, 5).map(transit => ({
    ...transit,
    interpretation: getTransitInterpretation(transit.transitPlanet, transit.natalPlanet, transit.aspect)
  }));

  // Get upcoming significant transits
  const upcoming = getUpcomingSignificantTransits(natalChart, date, 90);

  return {
    date: sky.date,
    currentSky: sky,

    // Transit counts
    summary: {
      totalTransits: transits.length,
      majorCount: majorTransits.length,
      moderateCount: moderateTransits.length,
      minorCount: minorTransits.length,
      overallIntensity: calculateOverallIntensity(transits)
    },

    // Saturn cycle
    saturnCycle: saturnCycle ? {
      phase: saturnCycle.phase,
      phaseName: saturnCycle.phaseName,
      cyclePercentComplete: saturnCycle.cyclePercentComplete,
      isReturnWindow: saturnCycle.isReturnWindow,
      transitSaturnSign: saturnCycle.transitSaturn.sign,
      aspectsToNatalSaturn: saturnCycle.aspectsToNatal
    } : null,

    // Daily focus
    dailyGuidance,

    // Detailed transits
    majorTransits: interpretedTransits,
    moderateTransits,
    minorTransits,

    // Upcoming
    upcomingTransits: upcoming.slice(0, 10),

    // Luna integration
    lunaGuidance: generateLunaGuidance(interpretedTransits, saturnCycle, sky)
  };
}

/**
 * Calculate overall intensity score
 */
function calculateOverallIntensity(transits) {
  if (!transits.length) return 0;

  const totalImportance = transits.reduce((sum, t) => sum + t.importance, 0);
  const avgImportance = totalImportance / transits.length;

  // Factor in number of significant transits
  const majorCount = transits.filter(t => t.importance >= 60).length;

  let intensity = avgImportance + (majorCount * 5);
  return Math.min(100, Math.round(intensity));
}

/**
 * Generate Luna's guidance for the day
 */
function generateLunaGuidance(majorTransits, saturnCycle, sky) {
  const guidance = {
    greeting: '',
    saturnAwareness: '',
    transitFocus: '',
    practicalAdvice: '',
    closingBlessing: ''
  };

  // Greeting based on sky conditions
  if (sky.retrogradeCount >= 4) {
    guidance.greeting = 'This is a time for inner work, dear one. The planets are turning inward, inviting you to do the same.';
  } else if (sky.stelliumSigns.length > 0) {
    guidance.greeting = `The cosmos is focusing tremendous energy in ${sky.stelliumSigns[0].sign}. Notice where this lands in your chart.`;
  } else {
    guidance.greeting = 'The celestial dance continues, each planet playing its part in your unfolding story.';
  }

  // Saturn awareness
  if (saturnCycle) {
    if (saturnCycle.isReturnWindow) {
      guidance.saturnAwareness = 'Your Saturn Return is approaching or active. This is one of life\'s most significant initiations. Everything you\'ve built that isn\'t truly yours will be tested.';
    } else {
      guidance.saturnAwareness = `You are in the ${saturnCycle.phaseName} of your Saturn cycle (${saturnCycle.cyclePercentComplete}% complete). ${getPhaseGuidance(saturnCycle.phase)}`;
    }
  }

  // Transit focus
  if (majorTransits.length > 0) {
    const primary = majorTransits[0];
    guidance.transitFocus = primary.interpretation?.lunaPrompt ||
      `Consider how ${primary.transitPlanet} is activating your ${primary.natalPlanet}. What is asking for your attention?`;
  } else {
    guidance.transitFocus = 'No major transits are demanding your attention today. Use this space for integration and rest.';
  }

  // Practical advice
  if (majorTransits.some(t => t.transitPlanet === 'Saturn')) {
    guidance.practicalAdvice = 'Saturn asks for discipline today. Do the hard thing first. Build something that will last.';
  } else if (majorTransits.some(t => t.transitPlanet === 'Uranus')) {
    guidance.practicalAdvice = 'Uranus brings change. Stay flexible and watch for unexpected opportunities.';
  } else if (majorTransits.some(t => t.transitPlanet === 'Neptune')) {
    guidance.practicalAdvice = 'Neptune invites imagination but also confusion. Trust your intuition but verify the facts.';
  } else if (majorTransits.some(t => t.transitPlanet === 'Pluto')) {
    guidance.practicalAdvice = 'Pluto demands authenticity. What are you avoiding? Face it today.';
  } else {
    guidance.practicalAdvice = 'Move with the day\'s natural rhythm. Small consistent efforts compound.';
  }

  // Closing blessing
  guidance.closingBlessing = 'May you find the courage to grow where life asks you to grow.';

  return guidance;
}

/**
 * Get guidance for Saturn cycle phase
 */
function getPhaseGuidance(phase) {
  const phaseGuidance = {
    'post-return': 'This is the time to build on the foundations you claimed at your Return. Plant seeds that will grow for decades.',
    'waxing-square': 'Your first major test. What you built is being challenged. Strengthen what\'s real; release what isn\'t.',
    'waxing-trine': 'A period of consolidation. The structures are holding. Keep building with patience.',
    'opposition-approaching': 'Others will soon reflect back to you the success or failure of your efforts. Prepare for visibility.',
    'opposition': 'The world can see what you\'ve built. External challenges reveal the truth of your foundation.',
    'waning-trine': 'The harvest phase. What you\'ve built is maturing. Enjoy the fruits while preparing for the next cycle.',
    'waning-square': 'The final crisis before renewal. What no longer serves must be released. Don\'t cling.',
    'return-approaching': 'The great reckoning approaches. Get honest with yourself. What must change?'
  };

  return phaseGuidance[phase] || 'Each phase of Saturn\'s cycle teaches something essential about maturity.';
}

// =============================================================================
// SPECIFIC FOCUS REPORTS
// =============================================================================

/**
 * Get Saturn-focused transit report
 */
export function getSaturnFocusedReport(natalChart, date = new Date()) {
  const fullReport = buildPersonalTransitReport(natalChart, date);

  // Filter for Saturn-related transits
  const saturnTransits = fullReport.majorTransits.filter(t =>
    t.transitPlanet === 'Saturn' || t.natalPlanet === 'Saturn'
  );

  // Get Saturn interpretations with phase context
  const saturnInterpretations = saturnTransits.map(transit => ({
    ...transit,
    interpretation: getSaturnTransitInterpretation(
      transit.natalPlanet,
      fullReport.saturnCycle?.phase
    )
  }));

  return {
    date: fullReport.date,
    saturnCycle: fullReport.saturnCycle,
    saturnTransits: saturnInterpretations,
    saturnGuidance: {
      currentPhase: fullReport.saturnCycle?.phaseName,
      phaseGuidance: getPhaseGuidance(fullReport.saturnCycle?.phase),
      transitingSaturnSign: fullReport.currentSky.positions.Saturn.sign,
      collectiveLesson: TRANSIT_PLANET_THEMES.Saturn.greeneInsight,
      personalApplication: saturnInterpretations[0]?.interpretation?.lunaPrompt ||
        'Reflect on where life is asking you to grow up, show up, or build something lasting.'
    }
  };
}

/**
 * Get weekly transit overview
 */
export function getWeeklyTransitOverview(natalChart, startDate = new Date()) {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);

    const dayTransits = calculateTransitsToNatal(natalChart, dayDate);
    const majorTransits = dayTransits.filter(t => t.importance >= 50);

    days.push({
      date: dayDate.toISOString().split('T')[0],
      dayName: dayDate.toLocaleDateString('en-US', { weekday: 'long' }),
      majorTransitCount: majorTransits.length,
      intensity: calculateOverallIntensity(dayTransits),
      headline: majorTransits.length > 0
        ? `${majorTransits[0].transitPlanet} ${majorTransits[0].aspect} ${majorTransits[0].natalPlanet}`
        : 'Integration day',
      primaryFocus: majorTransits[0]?.transitPlanet || null
    });
  }

  // Find peak intensity day
  const peakDay = days.reduce((peak, day) =>
    day.intensity > peak.intensity ? day : peak
    , days[0]);

  // Find easiest day
  const easiestDay = days.reduce((easy, day) =>
    day.intensity < easy.intensity ? day : easy
    , days[0]);

  return {
    startDate: startDate.toISOString().split('T')[0],
    days,
    weekSummary: {
      peakIntensityDay: peakDay.dayName,
      peakIntensity: peakDay.intensity,
      easiestDay: easiestDay.dayName,
      averageIntensity: Math.round(days.reduce((sum, d) => sum + d.intensity, 0) / 7)
    },
    weeklyGuidance: generateWeeklyGuidance(days)
  };
}

/**
 * Generate weekly guidance summary
 */
function generateWeeklyGuidance(days) {
  const avgIntensity = days.reduce((sum, d) => sum + d.intensity, 0) / 7;

  if (avgIntensity > 70) {
    return 'This is an intense week. Major transits are active. Stay grounded, prioritize self-care, and face what arises with courage.';
  } else if (avgIntensity > 50) {
    return 'A moderately active week. Balance engagement with rest. Some important developments are unfolding.';
  } else if (avgIntensity > 30) {
    return 'A relatively calm week. Use this time for integration, planning, and steady progress on your goals.';
  } else {
    return 'A quiet week cosmically. Perfect for rest, reflection, and consolidating recent gains.';
  }
}

/**
 * Get monthly transit overview
 */
export function getMonthlyTransitOverview(natalChart, startDate = new Date()) {
  const weeks = [];

  for (let w = 0; w < 4; w++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (w * 7));
    const weekOverview = getWeeklyTransitOverview(natalChart, weekStart);

    weeks.push({
      weekNumber: w + 1,
      startDate: weekOverview.startDate,
      averageIntensity: weekOverview.weekSummary.averageIntensity,
      peakDay: weekOverview.weekSummary.peakIntensityDay,
      summary: weekOverview.weeklyGuidance
    });
  }

  // Get upcoming significant transits for the month
  const upcoming = getUpcomingSignificantTransits(natalChart, startDate, 30);

  return {
    month: startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    weeks,
    significantTransits: upcoming.slice(0, 5).map(t => ({
      date: t.exactDate,
      description: `${t.planet} ${t.aspect} your ${t.natalPlanet}`,
      significance: t.significance
    })),
    monthlyTheme: generateMonthlyTheme(weeks, upcoming),
    lunaMonthlyBlessing: 'May this month bring the growth you need, even when it comes in unexpected forms.'
  };
}

/**
 * Generate monthly theme summary
 */
function generateMonthlyTheme(weeks, upcoming) {
  const avgIntensity = weeks.reduce((sum, w) => sum + w.averageIntensity, 0) / weeks.length;

  // Check for Saturn or Pluto in upcoming
  const hasSaturn = upcoming.some(t => t.planet === 'Saturn');
  const hasPluto = upcoming.some(t => t.planet === 'Pluto');

  if (hasSaturn && hasPluto) {
    return 'A month of profound transformation and restructuring. Face what must be faced.';
  } else if (hasSaturn) {
    return 'Saturn asks for discipline and maturity this month. Build what will last.';
  } else if (hasPluto) {
    return 'Pluto stirs the depths this month. Transformation is available if you\'re willing to go deep.';
  } else if (avgIntensity > 60) {
    return 'An active month with multiple significant transits. Stay present and responsive.';
  } else {
    return 'A month for steady progress and integration. Small efforts compound.';
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  getCurrentSkySnapshot,
  buildPersonalTransitReport,
  getSaturnFocusedReport,
  getWeeklyTransitOverview,
  getMonthlyTransitOverview
};
