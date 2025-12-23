/**
 * ============================================
 * MOON PHASE SERVICE
 * Real-time lunar data for astrological insights
 * ============================================
 *
 * Calculates current moon phase, lunar calendar,
 * and provides special alerts for moon-sensitive signs
 */

// Moon phase names and their astrological meanings
const MOON_PHASES = [
  {
    name: 'New Moon',
    emoji: '🌑',
    icon: 'new',
    meaning: 'New beginnings, setting intentions, planting seeds',
    energy: 'Introspective',
    best_for: ['Starting projects', 'Setting goals', 'Meditation']
  },
  {
    name: 'Waxing Crescent',
    emoji: '🌒',
    icon: 'waxing-crescent',
    meaning: 'Building momentum, taking first steps',
    energy: 'Growing',
    best_for: ['Planning', 'Learning', 'Gathering resources']
  },
  {
    name: 'First Quarter',
    emoji: '🌓',
    icon: 'first-quarter',
    meaning: 'Challenges, decisions, taking action',
    energy: 'Active',
    best_for: ['Problem-solving', 'Decision-making', 'Pushing forward']
  },
  {
    name: 'Waxing Gibbous',
    emoji: '🌔',
    icon: 'waxing-gibbous',
    meaning: 'Refinement, adjustment, patience',
    energy: 'Refining',
    best_for: ['Editing', 'Improving', 'Fine-tuning']
  },
  {
    name: 'Full Moon',
    emoji: '🌕',
    icon: 'full',
    meaning: 'Culmination, manifestation, heightened emotions',
    energy: 'Intense',
    best_for: ['Completion', 'Celebration', 'Release']
  },
  {
    name: 'Waning Gibbous',
    emoji: '🌖',
    icon: 'waning-gibbous',
    meaning: 'Gratitude, sharing knowledge, giving back',
    energy: 'Grateful',
    best_for: ['Teaching', 'Sharing', 'Gratitude practices']
  },
  {
    name: 'Last Quarter',
    emoji: '🌗',
    icon: 'last-quarter',
    meaning: 'Release, forgiveness, letting go',
    energy: 'Releasing',
    best_for: ['Decluttering', 'Ending habits', 'Forgiveness']
  },
  {
    name: 'Waning Crescent',
    emoji: '🌘',
    icon: 'waning-crescent',
    meaning: 'Rest, reflection, surrender',
    energy: 'Restful',
    best_for: ['Rest', 'Reflection', 'Spiritual practices']
  }
];

// Moon-sensitive signs and their lunar relationships
const LUNAR_SENSITIVITY = {
  Cancer: {
    level: 'extreme',
    ruler: 'Moon',
    description: 'Ruled by the Moon - emotions, intuition, and energy directly tied to lunar cycles',
    fullMoonEffect: 'Heightened emotions, powerful intuition, may feel overwhelmed',
    newMoonEffect: 'Need for solitude and nurturing, introspection peaks',
    advice: 'Track lunar cycles closely - your emotional tides follow the Moon'
  },
  Taurus: {
    level: 'high',
    ruler: 'Venus',
    exaltation: 'Moon',
    description: 'Moon is exalted in Taurus - deep emotional stability, enhanced comfort needs',
    fullMoonEffect: 'Strong desire for comfort and security, sensual awareness peaks',
    newMoonEffect: 'Good time to establish new self-care routines',
    advice: 'Use Full Moons for grounding rituals and self-care'
  },
  Scorpio: {
    level: 'challenging',
    ruler: 'Pluto/Mars',
    fall: 'Moon',
    description: 'Moon in fall - emotions run deep but may be suppressed',
    fullMoonEffect: 'Intense emotions may surface, transformation opportunities',
    newMoonEffect: 'Excellent for shadow work and emotional release',
    advice: 'Full Moons bring what\'s hidden to light - embrace transformation'
  },
  Capricorn: {
    level: 'challenging',
    ruler: 'Saturn',
    detriment: 'Moon',
    description: 'Moon in detriment - emotions structured, may feel emotionally restricted',
    fullMoonEffect: 'Work-life balance issues highlighted, need for emotional expression',
    newMoonEffect: 'Good for setting practical emotional boundaries',
    advice: 'Allow yourself to feel during lunar peaks - emotions aren\'t weakness'
  },
  Pisces: {
    level: 'high',
    ruler: 'Neptune/Jupiter',
    description: 'Highly intuitive water sign - psychic sensitivity amplified by Moon',
    fullMoonEffect: 'Vivid dreams, psychic impressions, may absorb others\' emotions',
    newMoonEffect: 'Powerful time for meditation and spiritual connection',
    advice: 'Protect your energy during Full Moons - you\'re highly absorbent'
  }
};

/**
 * Calculate the current moon phase using astronomical algorithm
 * Based on the synodic month (29.53059 days)
 *
 * @param {Date} date - Date to calculate for (defaults to now)
 * @returns {Object} Moon phase data
 */
export function calculateMoonPhase(date = new Date()) {
  // Known new moon reference: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');

  // Synodic month length in days
  const synodicMonth = 29.53059;

  // Calculate days since known new moon
  const daysSinceNew = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);

  // Current position in lunar cycle (0 to 1)
  const lunarCycle = (daysSinceNew % synodicMonth) / synodicMonth;

  // Handle negative values for dates before reference
  const normalizedCycle = lunarCycle < 0 ? lunarCycle + 1 : lunarCycle;

  // Determine phase index (0-7)
  const phaseIndex = Math.floor(normalizedCycle * 8) % 8;

  // Get phase details
  const phase = MOON_PHASES[phaseIndex];

  // Calculate illumination percentage
  // 0% at new moon, 100% at full moon
  const illumination = Math.round(
    (1 - Math.cos(normalizedCycle * 2 * Math.PI)) / 2 * 100
  );

  // Calculate days until next full moon
  const fullMoonPosition = 0.5; // Full moon at 50% of cycle
  let daysToFullMoon;
  if (normalizedCycle < fullMoonPosition) {
    daysToFullMoon = Math.round((fullMoonPosition - normalizedCycle) * synodicMonth);
  } else {
    daysToFullMoon = Math.round((1 - normalizedCycle + fullMoonPosition) * synodicMonth);
  }

  // Calculate days until next new moon
  let daysToNewMoon;
  if (normalizedCycle === 0) {
    daysToNewMoon = 0;
  } else {
    daysToNewMoon = Math.round((1 - normalizedCycle) * synodicMonth);
  }

  // Calculate moon age (days since last new moon)
  const moonAge = Math.round(normalizedCycle * synodicMonth);

  return {
    phase: phase.name,
    emoji: phase.emoji,
    icon: phase.icon,
    meaning: phase.meaning,
    energy: phase.energy,
    bestFor: phase.best_for,
    illumination,
    moonAge,
    daysToFullMoon,
    daysToNewMoon,
    cyclePosition: normalizedCycle,
    isFullMoon: phaseIndex === 4,
    isNewMoon: phaseIndex === 0,
    timestamp: date.toISOString()
  };
}

/**
 * Get lunar sensitivity information for a zodiac sign
 *
 * @param {string} sunSign - Western zodiac sun sign
 * @param {string} moonSign - Western zodiac moon sign (optional)
 * @returns {Object} Lunar sensitivity data
 */
export function getLunarSensitivity(sunSign, moonSign = null) {
  const sunSensitivity = LUNAR_SENSITIVITY[sunSign];
  const moonSensitivity = moonSign ? LUNAR_SENSITIVITY[moonSign] : null;

  // Determine overall sensitivity level
  let overallLevel = 'normal';
  let alerts = [];

  if (sunSensitivity?.level === 'extreme' || moonSensitivity?.level === 'extreme') {
    overallLevel = 'extreme';
  } else if (sunSensitivity?.level === 'high' || moonSensitivity?.level === 'high') {
    overallLevel = 'high';
  } else if (sunSensitivity?.level === 'challenging' || moonSensitivity?.level === 'challenging') {
    overallLevel = 'challenging';
  }

  // Build alerts based on sensitivity
  if (sunSensitivity) {
    alerts.push({
      source: 'Sun Sign',
      sign: sunSign,
      ...sunSensitivity
    });
  }

  if (moonSensitivity && moonSign !== sunSign) {
    alerts.push({
      source: 'Moon Sign',
      sign: moonSign,
      ...moonSensitivity
    });
  }

  return {
    overallLevel,
    isMoonSensitive: overallLevel !== 'normal',
    alerts,
    sunSign,
    moonSign
  };
}

/**
 * Generate personalized lunar guidance based on sign and current phase
 *
 * @param {string} sunSign - User's sun sign
 * @param {Object} moonPhase - Current moon phase data
 * @returns {Object} Personalized lunar guidance
 */
export function getPersonalizedLunarGuidance(sunSign, moonPhase = null) {
  const currentMoon = moonPhase || calculateMoonPhase();
  const sensitivity = getLunarSensitivity(sunSign);

  let personalMessage = '';
  let urgency = 'normal';

  // Special messages for moon-sensitive signs
  if (sensitivity.isMoonSensitive) {
    const signData = LUNAR_SENSITIVITY[sunSign];

    if (currentMoon.isFullMoon) {
      personalMessage = signData?.fullMoonEffect || 'Full Moon energy is amplified for you today.';
      urgency = sensitivity.overallLevel === 'extreme' ? 'high' : 'medium';
    } else if (currentMoon.isNewMoon) {
      personalMessage = signData?.newMoonEffect || 'New Moon brings fresh energy for introspection.';
      urgency = 'medium';
    } else if (currentMoon.daysToFullMoon <= 2) {
      personalMessage = `Full Moon approaching in ${currentMoon.daysToFullMoon} day${currentMoon.daysToFullMoon !== 1 ? 's' : ''}. ${signData?.advice || 'Prepare for heightened emotions.'}`;
      urgency = sensitivity.overallLevel === 'extreme' ? 'medium' : 'low';
    }
  }

  // General guidance based on phase
  const generalGuidance = {
    phase: currentMoon.phase,
    energy: currentMoon.energy,
    suggestions: currentMoon.bestFor,
    meaning: currentMoon.meaning
  };

  return {
    currentMoon,
    sensitivity,
    personalMessage,
    urgency,
    generalGuidance,
    signSpecificAdvice: LUNAR_SENSITIVITY[sunSign]?.advice || null
  };
}

/**
 * Get upcoming lunar events (next full moon, new moon)
 *
 * @param {number} daysAhead - How many days to look ahead (default 30)
 * @returns {Array} Upcoming lunar events
 */
export function getUpcomingLunarEvents(daysAhead = 30) {
  const events = [];
  const today = new Date();
  const currentPhase = calculateMoonPhase(today);

  // Next Full Moon
  if (currentPhase.daysToFullMoon <= daysAhead) {
    const fullMoonDate = new Date(today);
    fullMoonDate.setDate(fullMoonDate.getDate() + currentPhase.daysToFullMoon);
    events.push({
      type: 'Full Moon',
      emoji: '🌕',
      date: fullMoonDate,
      daysUntil: currentPhase.daysToFullMoon,
      significance: 'Peak emotional energy, manifestation, completion'
    });
  }

  // Next New Moon
  if (currentPhase.daysToNewMoon <= daysAhead && currentPhase.daysToNewMoon > 0) {
    const newMoonDate = new Date(today);
    newMoonDate.setDate(newMoonDate.getDate() + currentPhase.daysToNewMoon);
    events.push({
      type: 'New Moon',
      emoji: '🌑',
      date: newMoonDate,
      daysUntil: currentPhase.daysToNewMoon,
      significance: 'New beginnings, intention setting, fresh starts'
    });
  }

  // Sort by date
  events.sort((a, b) => a.daysUntil - b.daysUntil);

  return events;
}

/**
 * Calculate moon phase at a specific birth date/time
 * Used for natal chart analysis
 *
 * @param {Date|string} birthDate - Birth date
 * @returns {Object} Birth moon phase data
 */
export function getBirthMoonPhase(birthDate) {
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  return calculateMoonPhase(date);
}

export default {
  calculateMoonPhase,
  getLunarSensitivity,
  getPersonalizedLunarGuidance,
  getUpcomingLunarEvents,
  getBirthMoonPhase,
  MOON_PHASES,
  LUNAR_SENSITIVITY
};
