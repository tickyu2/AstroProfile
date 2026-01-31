/**
 * compositeTransits.js
 * ====================
 *
 * Relationship Weather System - Transits to the Composite Chart
 * Part of Phase 3: Liz Greene Cathedral - Relationship Depth
 *
 * The composite chart represents the relationship as a third entity.
 * Transits to this chart show the "weather" the relationship is experiencing.
 *
 * Key principle (Liz Greene):
 * "The composite chart breathes with its own life. When Saturn transits
 * the composite Sun, it is not you or your partner being tested—it is
 * the relationship itself facing its moment of truth."
 *
 * GENESIS AstroProfile - January 2026
 */

import { calculatePlanetPosition, calculateTransitAspects, ZODIAC_SIGNS } from './transitCalculator';

// =============================================================================
// COMPOSITE TRANSIT INTERPRETATIONS
// =============================================================================

export const COMPOSITE_TRANSIT_MEANINGS = {
  // Transiting Saturn to Composite Points
  'Saturn-Sun': {
    theme: 'Relationship Reality Check',
    duration: '2-3 weeks intense, 6-9 months total',
    description: 'The relationship faces its tests. What is real endures; what is fantasy crumbles.',
    psychological: 'Saturn asks: "Is this relationship built on substance or illusion?" This is when couples either recommit to something real or recognize they have been playing house.',
    challenges: [
      'Feeling the weight of responsibility together',
      'Questioning if this relationship has a future',
      'External pressures testing the bond',
      'Coldness or distance between partners'
    ],
    opportunities: [
      'Building lasting structures together',
      'Making formal commitments (engagement, moving in, marriage)',
      'Maturing the relationship beyond initial infatuation',
      'Establishing healthy boundaries as a couple'
    ],
    lunaGuidance: 'The honeymoon is over—but that is when real love begins. This transit separates relationships built on fantasy from those with genuine foundation.',
    couplePractice: 'Sit together and discuss: "What do we want to build together over the next 7 years?" Write it down. Be specific and realistic.',
    warningSign: 'If one partner is avoiding commitment discussions, Saturn will force the conversation anyway.'
  },

  'Saturn-Moon': {
    theme: 'Emotional Security Testing',
    duration: '2-3 weeks intense, 6-9 months total',
    description: 'The emotional foundation of the relationship is under examination.',
    psychological: 'Saturn touching the composite Moon brings up fears about emotional safety. One or both partners may feel unloved, unsupported, or emotionally isolated within the relationship.',
    challenges: [
      'Feeling emotionally distant from each other',
      'Questioning if partner truly cares',
      'Family pressures or domestic stress',
      'Depression affecting the relationship'
    ],
    opportunities: [
      'Creating genuine emotional security together',
      'Moving through fear to deeper trust',
      'Establishing a real home together',
      'Learning to be vulnerable and strong simultaneously'
    ],
    lunaGuidance: 'Your emotional connection is being tested not to destroy it, but to reveal what it truly is. Fear is the gatekeeper to deeper intimacy.',
    couplePractice: 'Create a "safety ritual"—a daily or weekly time when you check in emotionally without distractions. Hold this space as sacred.',
    warningSign: 'Withdrawal or stonewalling. Saturn asks for mature engagement, not retreat.'
  },

  'Saturn-Venus': {
    theme: 'Love Under Pressure',
    duration: '2-3 weeks intense, 6-9 months total',
    description: 'The relationship\'s capacity to love and be loved is tested.',
    psychological: 'Saturn on composite Venus can feel like love itself is dying. But what dies is only the immature version. What remains is love that has faced reality and chosen to stay.',
    challenges: [
      'Financial stress affecting the relationship',
      'Feeling unappreciated or unloved',
      'Physical affection decreasing',
      'Doubting if you still love each other'
    ],
    opportunities: [
      'Discovering love that transcends feeling',
      'Making financial commitments together',
      'Learning to appreciate qualities over time',
      'Mature partnership emerging from tested love'
    ],
    lunaGuidance: 'Love that only exists in good weather is not yet love. This transit teaches you both what love truly is.',
    couplePractice: 'Write each other a letter describing what you appreciate about the relationship that has nothing to do with romantic feelings. Read them aloud.',
    warningSign: 'If appreciation has completely disappeared, Saturn is revealing a hollowness that existed before the transit.'
  },

  'Saturn-Mars': {
    theme: 'Conflict and Commitment',
    duration: '2-3 weeks intense, 6-9 months total',
    description: 'How you fight, work, and pursue goals together is restructured.',
    psychological: 'Saturn-Mars transits to the composite bring frustration, blocked energy, and potential for serious conflict. The relationship\'s capacity to act effectively as a unit is being tested.',
    challenges: [
      'Increased conflict or cold war',
      'Feeling stuck or unable to move forward together',
      'Resentment building from unspoken grievances',
      'One partner feeling controlled or restricted'
    ],
    opportunities: [
      'Learning healthy conflict resolution',
      'Channeling anger into productive change',
      'Building discipline as a couple',
      'Accomplishing difficult things together'
    ],
    lunaGuidance: 'Anger in a relationship is not the enemy—unspoken anger is. This transit demands you learn to fight fairly and forgive fully.',
    couplePractice: 'Establish "fair fighting rules" together. Agree on what is never acceptable (contempt, name-calling, stonewalling) and what healthy conflict looks like.',
    warningSign: 'Violence or contempt are never acceptable, regardless of transit. Seek help immediately if present.'
  },

  // Transiting Pluto to Composite Points
  'Pluto-Sun': {
    theme: 'Relationship Death and Rebirth',
    duration: '1-3 years',
    description: 'The relationship as you knew it must die for something more authentic to emerge.',
    psychological: 'Pluto transiting the composite Sun is one of the most intense transits a relationship can experience. The relationship will either transform completely or end. There is no staying the same.',
    challenges: [
      'Power struggles and control issues',
      'Secrets coming to light',
      'External crises forcing transformation',
      'Feeling like the relationship is dying'
    ],
    opportunities: [
      'Profound transformation of the partnership',
      'Releasing old patterns that no longer serve',
      'Phoenix-like rebirth of love',
      'Discovering hidden depths in each other'
    ],
    lunaGuidance: 'Something in your relationship is dying. Let it. What rises from these ashes will be more real than what came before.',
    couplePractice: 'Ask each other: "What part of us needs to die for us to be truly alive together?" Listen without defending.',
    warningSign: 'Refusal to change by either partner typically means the relationship will end rather than transform.'
  },

  'Pluto-Moon': {
    theme: 'Emotional Transformation',
    duration: '1-3 years',
    description: 'The emotional dynamics of the relationship undergo profound change.',
    psychological: 'Pluto on the composite Moon brings buried emotions to the surface—often explosively. Control issues around emotional intimacy become impossible to ignore.',
    challenges: [
      'Intense jealousy or possessiveness',
      'Past traumas surfacing in the relationship',
      'Power struggles around vulnerability',
      'Feeling emotionally consumed'
    ],
    opportunities: [
      'Profound emotional healing together',
      'Releasing inherited relationship patterns',
      'Creating deeper intimacy than ever before',
      'Transforming fear into trust'
    ],
    lunaGuidance: 'Your relationship is descending into the underworld. Do not resist—this is where the deepest healing happens.',
    couplePractice: 'Share one thing you\'ve never told anyone about your childhood. Hold space for each other without fixing.',
    warningSign: 'Emotional manipulation or using vulnerability as a weapon. Seek professional support.'
  },

  'Pluto-Venus': {
    theme: 'Obsessive Love Transformed',
    duration: '1-3 years',
    description: 'The relationship\'s capacity for love is intensified and purified through crisis.',
    psychological: 'Pluto-Venus transits bring obsessive, consuming love—or reveal the shadow side of the bond. Financial and value crises often accompany this transit.',
    challenges: [
      'Jealousy and possessiveness escalating',
      'Financial crisis testing the bond',
      'Obsessive thinking about the relationship',
      'Love feeling like a matter of life and death'
    ],
    opportunities: [
      'Love deepening beyond surface attraction',
      'Transforming relationship with money together',
      'Passion rekindled through crisis',
      'Values alignment through difficult choices'
    ],
    lunaGuidance: 'You are learning that love can survive the death of everything except itself. This is the love that matters.',
    couplePractice: 'Discuss your deepest fears about losing each other. Name them. Fear shared becomes manageable.',
    warningSign: 'Controlling behavior escalating. If either partner feels unsafe, professional intervention is essential.'
  },

  // Transiting Neptune to Composite Points
  'Neptune-Sun': {
    theme: 'Relationship Dissolution or Transcendence',
    duration: '1-2 years',
    description: 'The relationship\'s boundaries become fluid—leading to either spiritual connection or confusion.',
    psychological: 'Neptune on the composite Sun can feel like the relationship is dissolving. Identity as a couple becomes unclear. This can be beautiful spiritual merging or dangerous loss of self.',
    challenges: [
      'Confusion about what the relationship is',
      'Deception or secrets between partners',
      'Escapism through substances or fantasy',
      'Feeling disillusioned with each other'
    ],
    opportunities: [
      'Spiritual connection deepening',
      'Creating art or music together',
      'Compassion replacing judgment',
      'Experiencing transcendent love'
    ],
    lunaGuidance: 'The fog surrounding your relationship can reveal either angels or illusions. Learn to tell the difference.',
    couplePractice: 'Create something together that expresses your love—art, music, ritual. Let the creative act clarify what words cannot.',
    warningSign: 'Addiction affecting the relationship, or one partner sacrificing themselves completely for the other.'
  },

  'Neptune-Moon': {
    theme: 'Emotional Idealization or Dissolution',
    duration: '1-2 years',
    description: 'Emotional boundaries in the relationship become permeable.',
    psychological: 'Neptune-Moon transits can bring beautiful emotional attunement—or codependent enmeshment. The line between "we" and "me" becomes blurred.',
    challenges: [
      'Emotional confusion and overwhelm',
      'Codependency increasing',
      'Difficulty knowing whose feelings are whose',
      'Escaping into fantasy rather than facing issues'
    ],
    opportunities: [
      'Psychic connection between partners',
      'Deep compassion and forgiveness',
      'Emotional healing through acceptance',
      'Spiritual practice together'
    ],
    lunaGuidance: 'You are learning to merge without losing yourselves. This is the highest art of intimacy.',
    couplePractice: 'Meditate together, focusing on feeling each other\'s presence without words. Notice where you end and they begin.',
    warningSign: 'Loss of personal identity or inability to function independently.'
  },

  // Transiting Uranus to Composite Points
  'Uranus-Sun': {
    theme: 'Relationship Revolution',
    duration: '6-12 months intense',
    description: 'The relationship is disrupted and awakened—nothing will be the same.',
    psychological: 'Uranus transiting the composite Sun brings sudden change and disruption. The relationship must evolve or face separation. Freedom and authenticity are demanded.',
    challenges: [
      'Sudden changes disrupting stability',
      'One partner wanting more freedom',
      'Unpredictable events affecting the relationship',
      'Restlessness and desire for change'
    ],
    opportunities: [
      'Reinventing the relationship',
      'Breaking free from stale patterns',
      'Excitement and experimentation returning',
      'Authentic expression within the relationship'
    ],
    lunaGuidance: 'Lightning is striking your relationship. You cannot control where it hits—only whether you ride the charge or get burned.',
    couplePractice: 'List everything about your relationship that feels stale. Pick one thing to change radically this month.',
    warningSign: 'Impulsive decisions (affairs, sudden breakups) without honest conversation first.'
  },

  'Uranus-Venus': {
    theme: 'Love Awakening',
    duration: '6-12 months intense',
    description: 'The way you love each other undergoes sudden change.',
    psychological: 'Uranus-Venus brings electric attraction—or sudden departure. Financial changes and value shifts often accompany this transit. Nothing about how you love will remain unchanged.',
    challenges: [
      'Boredom leading to dangerous excitement-seeking',
      'Financial instability',
      'Sudden attractions outside the relationship',
      'Values no longer aligning'
    ],
    opportunities: [
      'Rekindling passion through novelty',
      'Financial independence and innovation',
      'Discovering new ways to express love',
      'Authentic desires finally expressed'
    ],
    lunaGuidance: 'Your love is being electrified. Channel this energy into your relationship before it finds another outlet.',
    couplePractice: 'Do something neither of you has ever done before—together. Let it be slightly uncomfortable.',
    warningSign: 'Acting on attractions outside the relationship without honest conversation about needs.'
  },

  // Transiting Jupiter to Composite Points
  'Jupiter-Sun': {
    theme: 'Relationship Expansion',
    duration: '2-3 weeks intense, 2-3 months total',
    description: 'The relationship grows, expands, and receives blessings.',
    psychological: 'Jupiter on the composite Sun is one of the most fortunate transits for a relationship. Growth, optimism, and expansion characterize this period.',
    challenges: [
      'Over-optimism leading to unrealistic expectations',
      'Expanding too fast',
      'Taking the relationship for granted',
      'Excess in all forms'
    ],
    opportunities: [
      'Travel or adventure together',
      'Major positive milestones',
      'Deepening faith in each other',
      'Abundance entering the relationship'
    ],
    lunaGuidance: 'The universe is blessing your union. Receive with gratitude, but remember: growth must be integrated.',
    couplePractice: 'Plan something you\'ve both dreamed of but never thought possible. Take the first step.',
    warningSign: 'Squandering opportunities through complacency or excess.'
  },

  'Jupiter-Venus': {
    theme: 'Love Flourishing',
    duration: '2-3 weeks intense, 2-3 months total',
    description: 'Love, pleasure, and abundance flow in the relationship.',
    psychological: 'Jupiter-Venus to the composite brings harmony, pleasure, and often material blessings. This is a time when love feels easy and generous.',
    challenges: [
      'Overspending together',
      'Overindulgence affecting health',
      'Taking harmony for granted',
      'Laziness in relationship maintenance'
    ],
    opportunities: [
      'Financial windfalls',
      'Deepening appreciation and affection',
      'Social expansion as a couple',
      'Joyful celebrations together'
    ],
    lunaGuidance: 'Love is abundant right now. Let yourselves enjoy it fully—you have earned this sweetness.',
    couplePractice: 'Celebrate something about your relationship, however small. Let joy be your practice.',
    warningSign: 'Excess leading to consequences that undermine the relationship\'s stability.'
  }
};

// =============================================================================
// RELATIONSHIP WEATHER CATEGORIES
// =============================================================================

export const WEATHER_CATEGORIES = {
  clear: {
    name: 'Clear Skies',
    description: 'Smooth sailing—enjoy this harmonious period',
    emoji: '☀️',
    guidance: 'Use this time to strengthen your foundation'
  },
  breezy: {
    name: 'Light Breeze',
    description: 'Minor adjustments needed but nothing serious',
    emoji: '🌤️',
    guidance: 'Stay attentive but don\'t overcomplicate'
  },
  cloudy: {
    name: 'Gathering Clouds',
    description: 'Challenges approaching—prepare together',
    emoji: '☁️',
    guidance: 'Communication is essential right now'
  },
  stormy: {
    name: 'Storm Warning',
    description: 'Significant challenges require attention',
    emoji: '🌧️',
    guidance: 'Face this together, not against each other'
  },
  thunderstorm: {
    name: 'Thunderstorm',
    description: 'Major transformation in progress',
    emoji: '⛈️',
    guidance: 'Shelter in honesty and compassion'
  },
  rainbow: {
    name: 'Rainbow After Storm',
    description: 'Growth emerging from difficulty',
    emoji: '🌈',
    guidance: 'Integrate what you\'ve learned together'
  }
};

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Calculate current transits to composite chart
 */
export function calculateCompositeTransits(compositeChart, date = new Date()) {
  if (!compositeChart || !compositeChart.planets) {
    return { error: 'Valid composite chart required' };
  }

  // Get current planetary positions
  const transitPlanets = ['Saturn', 'Jupiter', 'Uranus', 'Neptune', 'Pluto'];
  const currentPositions = {};

  transitPlanets.forEach(planet => {
    currentPositions[planet] = calculatePlanetPosition(planet, date);
  });

  // Calculate aspects to composite points
  const compositePoints = ['Sun', 'Moon', 'Venus', 'Mars', 'Mercury', 'Ascendant'];
  const activeTransits = [];

  transitPlanets.forEach(transitPlanet => {
    const transitPos = currentPositions[transitPlanet];

    compositePoints.forEach(natalPoint => {
      const natalData = compositeChart.planets[natalPoint] || compositeChart[natalPoint.toLowerCase()];
      if (!natalData) return;

      const natalDegree = natalData.absoluteDegree ?? natalData.degree;
      if (typeof natalDegree !== 'number') return;

      const transitDegree = transitPos.absoluteDegree;
      const aspect = calculateAspect(transitDegree, natalDegree);

      if (aspect) {
        const transitKey = `${transitPlanet}-${natalPoint}`;
        const interpretation = COMPOSITE_TRANSIT_MEANINGS[transitKey];

        activeTransits.push({
          transitPlanet,
          transitPosition: transitPos,
          natalPoint,
          natalPosition: natalData,
          aspect: aspect.type,
          orb: aspect.orb,
          exactDate: calculateExactDate(transitPlanet, natalDegree, date),
          interpretation: interpretation || generateGenericInterpretation(transitPlanet, natalPoint, aspect.type),
          intensity: calculateIntensity(aspect.orb, transitPlanet)
        });
      }
    });
  });

  // Sort by intensity
  activeTransits.sort((a, b) => b.intensity - a.intensity);

  return {
    date: date.toISOString(),
    activeTransits,
    weather: determineWeather(activeTransits),
    lunaGuidance: generateRelationshipWeatherGuidance(activeTransits)
  };
}

/**
 * Calculate aspect between two positions
 */
function calculateAspect(pos1, pos2) {
  const diff = Math.abs(pos1 - pos2);
  const normalized = diff > 180 ? 360 - diff : diff;

  const aspects = [
    { type: 'conjunction', exact: 0, orb: 8 },
    { type: 'opposition', exact: 180, orb: 8 },
    { type: 'square', exact: 90, orb: 7 },
    { type: 'trine', exact: 120, orb: 7 },
    { type: 'sextile', exact: 60, orb: 5 }
  ];

  for (const aspect of aspects) {
    const orbDiff = Math.abs(normalized - aspect.exact);
    if (orbDiff <= aspect.orb) {
      return { type: aspect.type, orb: orbDiff };
    }
  }

  return null;
}

/**
 * Calculate intensity of a transit
 */
function calculateIntensity(orb, planet) {
  // Tighter orb = higher intensity
  const orbFactor = 1 - (orb / 10);

  // Outer planets = higher intensity
  const planetWeights = {
    Pluto: 1.0,
    Neptune: 0.9,
    Uranus: 0.85,
    Saturn: 0.8,
    Jupiter: 0.6
  };

  const planetFactor = planetWeights[planet] || 0.5;

  return Math.round((orbFactor * planetFactor) * 100);
}

/**
 * Estimate when transit will be exact
 */
function calculateExactDate(planet, targetDegree, currentDate) {
  // Simplified calculation
  const dailyMotions = {
    Saturn: 0.034,
    Jupiter: 0.083,
    Uranus: 0.012,
    Neptune: 0.006,
    Pluto: 0.004
  };

  const currentPos = calculatePlanetPosition(planet, currentDate);
  const diff = targetDegree - currentPos.absoluteDegree;
  const normalizedDiff = diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;

  const daysToExact = normalizedDiff / dailyMotions[planet];

  const exactDate = new Date(currentDate);
  exactDate.setDate(exactDate.getDate() + Math.round(daysToExact));

  return exactDate.toISOString().split('T')[0];
}

/**
 * Generate interpretation for transits not specifically defined
 */
function generateGenericInterpretation(transitPlanet, natalPoint, aspectType) {
  const planetThemes = {
    Saturn: 'structure, testing, maturation',
    Jupiter: 'expansion, growth, blessing',
    Uranus: 'disruption, awakening, freedom',
    Neptune: 'dissolution, spirituality, confusion',
    Pluto: 'transformation, power, death/rebirth'
  };

  const pointThemes = {
    Sun: 'identity and purpose as a couple',
    Moon: 'emotional foundation',
    Venus: 'love and values',
    Mars: 'action and conflict',
    Mercury: 'communication',
    Ascendant: 'how you appear to the world'
  };

  const aspectQualities = {
    conjunction: 'intensifying',
    opposition: 'polarizing',
    square: 'challenging',
    trine: 'supporting',
    sextile: 'opportunity for'
  };

  return {
    theme: `${transitPlanet} ${aspectType} composite ${natalPoint}`,
    description: `A period of ${aspectQualities[aspectType]} energy around ${pointThemes[natalPoint]}`,
    psychological: `${transitPlanet} brings themes of ${planetThemes[transitPlanet]} to your relationship's ${pointThemes[natalPoint]}.`,
    lunaGuidance: `This transit invites you both to examine how ${planetThemes[transitPlanet]} affects your ${pointThemes[natalPoint]}.`
  };
}

/**
 * Determine overall weather from active transits
 */
function determineWeather(transits) {
  if (!transits || transits.length === 0) {
    return WEATHER_CATEGORIES.clear;
  }

  // Calculate overall intensity
  const avgIntensity = transits.reduce((sum, t) => sum + t.intensity, 0) / transits.length;

  // Check for transformative transits
  const hasPluto = transits.some(t => t.transitPlanet === 'Pluto' && t.intensity > 50);
  const hasSaturn = transits.some(t => t.transitPlanet === 'Saturn' && t.intensity > 60);
  const hasUranus = transits.some(t => t.transitPlanet === 'Uranus' && t.intensity > 50);
  const hasJupiter = transits.some(t => t.transitPlanet === 'Jupiter' && t.intensity > 50);

  // Determine weather
  if (hasPluto && avgIntensity > 60) {
    return WEATHER_CATEGORIES.thunderstorm;
  }

  if ((hasSaturn || hasUranus) && avgIntensity > 50) {
    return WEATHER_CATEGORIES.stormy;
  }

  if (hasJupiter && !hasSaturn && !hasPluto) {
    return WEATHER_CATEGORIES.rainbow;
  }

  if (avgIntensity > 40) {
    return WEATHER_CATEGORIES.cloudy;
  }

  if (avgIntensity > 20) {
    return WEATHER_CATEGORIES.breezy;
  }

  return WEATHER_CATEGORIES.clear;
}

/**
 * Generate Luna's guidance for current weather
 */
function generateRelationshipWeatherGuidance(transits) {
  if (!transits || transits.length === 0) {
    return {
      opening: 'The skies are calm for your relationship right now.',
      insight: 'Use this peaceful time to strengthen your connection and prepare for future growth.',
      practice: 'Share one appreciation for each other daily.',
      question: 'What do you want to build together while the weather is good?'
    };
  }

  const weather = determineWeather(transits);
  const primaryTransit = transits[0];

  let guidance = {
    opening: `Your relationship is experiencing ${weather.name}.`,
    weatherEmoji: weather.emoji,
    weatherDescription: weather.description
  };

  if (primaryTransit.interpretation) {
    guidance.primaryFocus = {
      theme: primaryTransit.interpretation.theme,
      insight: primaryTransit.interpretation.psychological,
      practice: primaryTransit.interpretation.couplePractice,
      warning: primaryTransit.interpretation.warningSign
    };
    guidance.lunaQuestion = primaryTransit.interpretation.lunaGuidance;
  }

  // Additional transits summary
  if (transits.length > 1) {
    guidance.additionalInfluences = transits.slice(1, 4).map(t => ({
      transit: `${t.transitPlanet} ${t.aspect} ${t.natalPoint}`,
      intensity: t.intensity,
      theme: t.interpretation?.theme || 'Supporting energy'
    }));
  }

  guidance.closing = weather.guidance;

  return guidance;
}

/**
 * Get relationship forecast for next 3 months
 */
export function getRelationshipForecast(compositeChart, months = 3) {
  const forecast = [];
  const today = new Date();

  for (let week = 0; week < months * 4; week++) {
    const date = new Date(today);
    date.setDate(date.getDate() + (week * 7));

    const transits = calculateCompositeTransits(compositeChart, date);

    forecast.push({
      weekOf: date.toISOString().split('T')[0],
      weather: transits.weather,
      primaryTransit: transits.activeTransits[0] || null,
      intensity: transits.activeTransits.length > 0
        ? Math.round(transits.activeTransits.reduce((sum, t) => sum + t.intensity, 0) / transits.activeTransits.length)
        : 0
    });
  }

  return {
    generated: new Date().toISOString(),
    period: `${months} months`,
    forecast,
    summary: generateForecastSummary(forecast)
  };
}

/**
 * Generate summary of forecast period
 */
function generateForecastSummary(forecast) {
  const weatherCounts = {};
  forecast.forEach(week => {
    const name = week.weather.name;
    weatherCounts[name] = (weatherCounts[name] || 0) + 1;
  });

  const dominant = Object.entries(weatherCounts)
    .sort((a, b) => b[1] - a[1])[0];

  const stormyWeeks = forecast.filter(w =>
    w.weather.name === 'Thunderstorm' || w.weather.name === 'Storm Warning'
  );

  return {
    dominantWeather: dominant ? dominant[0] : 'Variable',
    challengingPeriods: stormyWeeks.map(w => w.weekOf),
    lunaOverview: stormyWeeks.length > 2
      ? 'The coming months hold significant growth opportunities disguised as challenges. Face them together.'
      : stormyWeeks.length > 0
        ? 'Some weather to navigate ahead, but nothing you cannot handle together.'
        : 'A relatively calm period for deepening your connection.'
  };
}

/**
 * Check if a specific date is significant for the relationship
 */
export function checkRelationshipDate(compositeChart, date) {
  const transits = calculateCompositeTransits(compositeChart, date);

  const significant = transits.activeTransits.filter(t => t.intensity > 70);

  if (significant.length === 0) {
    return {
      date: date.toISOString().split('T')[0],
      significance: 'neutral',
      recommendation: 'A normal day for the relationship',
      proceed: true
    };
  }

  const hasHardAspects = significant.some(t =>
    ['square', 'opposition'].includes(t.aspect) &&
    ['Saturn', 'Pluto', 'Uranus'].includes(t.transitPlanet)
  );

  return {
    date: date.toISOString().split('T')[0],
    significance: hasHardAspects ? 'challenging' : 'significant',
    transits: significant.map(t => ({
      description: `${t.transitPlanet} ${t.aspect} composite ${t.natalPoint}`,
      theme: t.interpretation?.theme
    })),
    recommendation: hasHardAspects
      ? 'Not ideal for major commitments—better for working through issues'
      : 'Good day for meaningful relationship activities',
    proceed: !hasHardAspects
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  calculateCompositeTransits,
  getRelationshipForecast,
  checkRelationshipDate,
  COMPOSITE_TRANSIT_MEANINGS,
  WEATHER_CATEGORIES
};
