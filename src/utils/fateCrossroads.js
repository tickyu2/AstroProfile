/**
 * Fate Crossroads Detection Engine
 *
 * Based on Liz Greene's "The Astrology of Fate" — detecting life
 * turning points where fate and choice intersect.
 *
 * Key crossroads events:
 * - Saturn Return (~29, ~58, ~87 years) - Karmic checkpoint
 * - Pluto Square Pluto (~36-38 years) - Shadow confrontation
 * - Uranus Opposition (~40-42 years) - Individuation crisis
 * - Neptune Square Neptune (~40-42 years) - Spiritual awakening
 * - Chiron Return (~50 years) - Wound integration
 * - Nodal Returns (~18.6 year cycle) - Destiny recalibration
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// CROSSROADS DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Major life crossroads with archetypal meanings
 */
const MAJOR_CROSSROADS = {
  // Saturn Returns - Karmic Checkpoints
  saturnReturn1: {
    key: 'saturn-return-1',
    name: 'First Saturn Return',
    exactAge: 29.5,
    ageRange: [28, 31],
    planet: 'Saturn',
    aspectType: 'conjunction',
    archetype: 'The Threshold Guardian',
    mythicMeaning: 'The first major test of adult maturity',
    lifeQuestion: 'Are you living your authentic path, or someone else\'s expectations?',
    themes: [
      'Career direction crystallizes',
      'Relationships tested for authenticity',
      'Childhood patterns confronted',
      'Adult identity solidified'
    ],
    challenge: 'Accepting responsibility without losing joy',
    gift: 'Earned authority and clear direction',
    lunaGuidance: 'This is a time of profound choosing. What you commit to now shapes the next 29 years.'
  },

  saturnReturn2: {
    key: 'saturn-return-2',
    name: 'Second Saturn Return',
    exactAge: 58.9,
    ageRange: [57, 61],
    planet: 'Saturn',
    aspectType: 'conjunction',
    archetype: 'The Elder Threshold',
    mythicMeaning: 'The passage into wisdom and legacy',
    lifeQuestion: 'What wisdom have you earned, and what will you pass on?',
    themes: [
      'Legacy questions emerge',
      'Mentorship role develops',
      'Life review and integration',
      'New chapter of meaning'
    ],
    challenge: 'Releasing what no longer serves without bitterness',
    gift: 'Wisdom authority and purposeful elderhood',
    lunaGuidance: 'You\'ve earned the right to be an elder. What will you teach?'
  },

  saturnReturn3: {
    key: 'saturn-return-3',
    name: 'Third Saturn Return',
    exactAge: 88.4,
    ageRange: [86, 91],
    planet: 'Saturn',
    aspectType: 'conjunction',
    archetype: 'The Sage\'s Gate',
    mythicMeaning: 'The final integration of life\'s lessons',
    lifeQuestion: 'What have you ultimately learned about being human?',
    themes: [
      'Life completion',
      'Spiritual synthesis',
      'Transmission of wisdom',
      'Preparation for transition'
    ],
    challenge: 'Accepting mortality with grace',
    gift: 'Complete life integration and peaceful wisdom',
    lunaGuidance: 'The full circle completes. Your life has been the teaching.'
  },

  // Pluto Square Pluto - Shadow Confrontation
  plutoSquare: {
    key: 'pluto-square',
    name: 'Pluto Square Pluto',
    exactAge: 37.5, // Varies by generation (36-44)
    ageRange: [36, 44],
    planet: 'Pluto',
    aspectType: 'square',
    archetype: 'The Underworld Gate',
    mythicMeaning: 'Confrontation with the shadow and mortality',
    lifeQuestion: 'What must die for your authentic self to live?',
    themes: [
      'Power dynamics confronted',
      'Hidden patterns exposed',
      'Mortality awareness',
      'Psychological depth work'
    ],
    challenge: 'Surrendering control to transform',
    gift: 'Regenerative power and authentic presence',
    lunaGuidance: 'What you thought was solid is being tested. Let go of what needs to go.'
  },

  // Uranus Opposition - Individuation Crisis
  uranusOpposition: {
    key: 'uranus-opposition',
    name: 'Uranus Opposition',
    exactAge: 42,
    ageRange: [40, 44],
    planet: 'Uranus',
    aspectType: 'opposition',
    archetype: 'The Awakener\'s Call',
    mythicMeaning: 'The midlife awakening to unlived life',
    lifeQuestion: 'What part of you has been sleeping, waiting to awaken?',
    themes: [
      'Unlived life emerges',
      'Rebellion against conformity',
      'Need for authenticity',
      'Breaking free from ruts'
    ],
    challenge: 'Honoring awakening without destroying what\'s valuable',
    gift: 'Liberation and renewed sense of possibility',
    lunaGuidance: 'Something in you is ready to be free. Honor the awakening without burning everything down.'
  },

  // Neptune Square Neptune - Spiritual Awakening
  neptuneSquare: {
    key: 'neptune-square',
    name: 'Neptune Square Neptune',
    exactAge: 41,
    ageRange: [40, 43],
    planet: 'Neptune',
    aspectType: 'square',
    archetype: 'The Mystic\'s Fog',
    mythicMeaning: 'Dissolution of illusions and spiritual reorientation',
    lifeQuestion: 'What dreams were never really yours? What is your true vision?',
    themes: [
      'Disillusionment with fantasies',
      'Spiritual seeking intensifies',
      'Creativity or confusion',
      'Letting go of false ideals'
    ],
    challenge: 'Finding meaning in the midst of dissolution',
    gift: 'Refined spiritual vision and authentic dreams',
    lunaGuidance: 'The fog is clearing something away. Trust that what remains is more real.'
  },

  // Chiron Return - Wound Integration
  chironReturn: {
    key: 'chiron-return',
    name: 'Chiron Return',
    exactAge: 50.7,
    ageRange: [49, 52],
    planet: 'Chiron',
    aspectType: 'conjunction',
    archetype: 'The Wounded Healer\'s Return',
    mythicMeaning: 'Integration of life wounds into healing gifts',
    lifeQuestion: 'How has your wound become your wisdom?',
    themes: [
      'Core wound revisited',
      'Healing gift recognized',
      'Teacher/healer role emerges',
      'Acceptance of imperfection'
    ],
    challenge: 'Embracing the wound as teacher',
    gift: 'The ability to heal others through your own integration',
    lunaGuidance: 'Your wound has become your greatest teacher. Now you can help others who carry the same pain.'
  },

  // Nodal Returns - Destiny Recalibration
  nodalReturn1: {
    key: 'nodal-return-1',
    name: 'First Nodal Return',
    exactAge: 18.6,
    ageRange: [18, 20],
    planet: 'North Node',
    aspectType: 'conjunction',
    archetype: 'The First Destiny Gate',
    mythicMeaning: 'First glimpse of life purpose',
    lifeQuestion: 'What is your soul calling you toward?',
    themes: [
      'Leaving childhood behind',
      'First adult choices',
      'Destiny direction sensed',
      'Independence from family fate'
    ],
    challenge: 'Finding your own path vs. family expectations',
    gift: 'First taste of authentic direction',
    lunaGuidance: 'You\'re starting to feel your own path. Trust the pull toward what feels right.'
  },

  nodalReturn2: {
    key: 'nodal-return-2',
    name: 'Second Nodal Return',
    exactAge: 37.2,
    ageRange: [36, 39],
    planet: 'North Node',
    aspectType: 'conjunction',
    archetype: 'The Destiny Checkpoint',
    mythicMeaning: 'Reassessment of life direction',
    lifeQuestion: 'Are you on purpose? What needs to shift?',
    themes: [
      'Midlife course correction',
      'Purpose clarification',
      'Relationship to destiny',
      'Major life choices'
    ],
    challenge: 'Courage to redirect if needed',
    gift: 'Refined sense of purpose',
    lunaGuidance: 'Check your compass. Are you heading where your soul wants to go?'
  },

  nodalReturn3: {
    key: 'nodal-return-3',
    name: 'Third Nodal Return',
    exactAge: 55.8,
    ageRange: [55, 58],
    planet: 'North Node',
    aspectType: 'conjunction',
    archetype: 'The Wisdom Gate',
    mythicMeaning: 'Integration of life experience into wisdom',
    lifeQuestion: 'What has your life taught you about purpose?',
    themes: [
      'Life meaning integration',
      'Wisdom transmission',
      'Purpose in later life',
      'Legacy of direction'
    ],
    challenge: 'Finding purpose in the second half of life',
    gift: 'Clarity about what truly matters',
    lunaGuidance: 'Your life has been gathering wisdom. It\'s time to share it.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CROSSROADS INTENSITY MODIFIERS
// Factors that intensify the crossroads experience
// ═══════════════════════════════════════════════════════════════════════════

const INTENSITY_MODIFIERS = {
  // When crossroads overlap (e.g., Pluto square + Uranus opposition)
  convergence: {
    name: 'Crossroads Convergence',
    description: 'Multiple major transits happening simultaneously',
    multiplier: 1.5,
    meaning: 'A profound period of transformation across multiple life dimensions'
  },

  // When natal aspects echo the transit
  natalEcho: {
    name: 'Natal Echo',
    description: 'The transiting planet aspects itself from the natal chart',
    multiplier: 1.3,
    meaning: 'The transit awakens patterns already present at birth'
  },

  // When the transit hits an angle (ASC, MC, IC, DC)
  angularActivation: {
    name: 'Angular Activation',
    description: 'Transit activates a natal angle',
    multiplier: 1.4,
    meaning: 'The crossroads affects your most visible and foundational life areas'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate decimal age from birth date
 * @param {string} birthDateISO - Birth date in ISO format
 * @returns {number} Age in years (decimal)
 */
function calculateDecimalAge(birthDateISO) {
  if (!birthDateISO) return null;

  const birth = new Date(birthDateISO);
  const today = new Date();

  const ageMs = today - birth;
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);

  return ageYears;
}

/**
 * Detect which crossroads are active, approaching, or completed
 *
 * @param {string} birthDateISO - Birth date in ISO format
 * @returns {Object} Crossroads status
 */
export function detectCrossroads(birthDateISO) {
  if (!birthDateISO) {
    return null;
  }

  const currentAge = calculateDecimalAge(birthDateISO);
  if (currentAge === null) return null;

  const crossroads = [];
  const active = [];
  const approaching = [];
  const completed = [];

  // Check each crossroads
  for (const [key, crossroad] of Object.entries(MAJOR_CROSSROADS)) {
    const [minAge, maxAge] = crossroad.ageRange;
    const yearsUntil = crossroad.exactAge - currentAge;
    const yearsAgo = currentAge - crossroad.exactAge;

    const status = {
      ...crossroad,
      currentAge,
      yearsUntil: yearsUntil > 0 ? yearsUntil : null,
      yearsAgo: yearsAgo > 0 ? yearsAgo : null
    };

    // Determine status
    if (currentAge >= minAge && currentAge <= maxAge) {
      status.status = 'active';
      status.intensity = calculateIntensity(currentAge, crossroad);
      active.push(status);
    } else if (currentAge < minAge && yearsUntil <= 5) {
      status.status = 'approaching';
      status.yearsUntilStart = minAge - currentAge;
      approaching.push(status);
    } else if (currentAge > maxAge) {
      status.status = 'completed';
      completed.push(status);
    } else {
      status.status = 'future';
    }

    crossroads.push(status);
  }

  // Check for convergence (multiple active crossroads)
  const hasConvergence = active.length > 1;

  return {
    currentAge,
    birthDate: birthDateISO,

    // Categorized crossroads
    active,
    approaching,
    completed,

    // All crossroads with status
    all: crossroads,

    // Convergence detection
    convergence: hasConvergence ? {
      ...INTENSITY_MODIFIERS.convergence,
      activeCrossroads: active.map(c => c.name)
    } : null,

    // Summary
    summary: {
      inActiveCrossroads: active.length > 0,
      activeCrossroadsCount: active.length,
      approachingCount: approaching.length,
      hasConvergence,
      currentPhase: getCurrentPhase(currentAge),
      nextMajorCrossroads: getNextCrossroads(currentAge)
    },

    // Luna guidance for current state
    lunaGuidance: generateCrossroadsGuidance(active, approaching, currentAge)
  };
}

/**
 * Calculate intensity of active crossroads
 */
function calculateIntensity(currentAge, crossroad) {
  const exactAge = crossroad.exactAge;
  const distance = Math.abs(currentAge - exactAge);

  // Closer to exact = higher intensity (0-100 scale)
  const maxDistance = 2; // Within 2 years of exact
  const intensity = Math.max(0, 100 - (distance / maxDistance) * 50);

  return {
    score: Math.round(intensity),
    label: intensity > 80 ? 'Peak' : intensity > 50 ? 'Building' : 'Waning',
    distanceFromExact: distance.toFixed(1)
  };
}

/**
 * Get current life phase based on age
 */
function getCurrentPhase(age) {
  if (age < 18.6) return { name: 'Pre-Destiny', description: 'Before first nodal return' };
  if (age < 29.5) return { name: 'Building', description: 'Before first Saturn return' };
  if (age < 42) return { name: 'Establishing', description: 'Between Saturn return and midlife' };
  if (age < 50) return { name: 'Midlife Transformation', description: 'The crucible of transformation' };
  if (age < 58.9) return { name: 'Integration', description: 'Integrating transformation insights' };
  if (age < 70) return { name: 'Wisdom', description: 'After second Saturn return' };
  return { name: 'Elder', description: 'The sage phase' };
}

/**
 * Get the next major crossroads
 */
function getNextCrossroads(currentAge) {
  const future = Object.values(MAJOR_CROSSROADS)
    .filter(c => c.exactAge > currentAge)
    .sort((a, b) => a.exactAge - b.exactAge);

  if (future.length === 0) return null;

  const next = future[0];
  return {
    name: next.name,
    exactAge: next.exactAge,
    yearsUntil: (next.exactAge - currentAge).toFixed(1),
    archetype: next.archetype
  };
}

/**
 * Generate Luna guidance based on crossroads state
 */
function generateCrossroadsGuidance(active, approaching, currentAge) {
  if (active.length > 1) {
    return {
      opening: "You're in a period of profound convergence — multiple life crossroads active at once.",
      guidance: active.map(c => c.lunaGuidance),
      closing: "This is rare and potent. Trust the process."
    };
  }

  if (active.length === 1) {
    const crossroad = active[0];
    return {
      opening: `You're at ${crossroad.name} — ${crossroad.archetype}.`,
      guidance: [crossroad.lunaGuidance],
      question: crossroad.lifeQuestion,
      closing: "This crossroads is asking something important of you."
    };
  }

  if (approaching.length > 0) {
    const next = approaching[0];
    return {
      opening: `${next.name} is approaching in about ${next.yearsUntilStart.toFixed(1)} years.`,
      guidance: [`Prepare by contemplating: ${next.lifeQuestion}`],
      closing: "There's time to prepare for what's coming."
    };
  }

  return {
    opening: "You're between major crossroads — a time for integration.",
    guidance: ["Use this period to integrate previous lessons and prepare for what's ahead."],
    closing: "Every phase has its purpose."
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a specific crossroads by key
 * @param {string} key - Crossroads key
 * @returns {Object} Crossroads data
 */
export function getCrossroadsData(key) {
  return MAJOR_CROSSROADS[key] || null;
}

/**
 * Get all crossroads definitions
 * @returns {Object} All crossroads
 */
export function getAllCrossroadsData() {
  return MAJOR_CROSSROADS;
}

/**
 * Check if a specific age is in a crossroads window
 * @param {number} age - Age to check
 * @param {string} crossroadsKey - Crossroads to check
 * @returns {boolean} Whether in the window
 */
export function isInCrossroads(age, crossroadsKey) {
  const crossroad = MAJOR_CROSSROADS[crossroadsKey];
  if (!crossroad) return false;

  const [min, max] = crossroad.ageRange;
  return age >= min && age <= max;
}

/**
 * Get crossroads window dates from birth date
 * @param {string} birthDateISO - Birth date
 * @param {string} crossroadsKey - Crossroads key
 * @returns {Object} Window dates
 */
export function getCrossroadsWindow(birthDateISO, crossroadsKey) {
  const crossroad = MAJOR_CROSSROADS[crossroadsKey];
  if (!crossroad || !birthDateISO) return null;

  const birth = new Date(birthDateISO);
  const [minAge, maxAge] = crossroad.ageRange;

  const startDate = new Date(birth);
  startDate.setFullYear(birth.getFullYear() + minAge);

  const exactDate = new Date(birth);
  exactDate.setFullYear(birth.getFullYear() + Math.floor(crossroad.exactAge));
  exactDate.setMonth(exactDate.getMonth() + Math.round((crossroad.exactAge % 1) * 12));

  const endDate = new Date(birth);
  endDate.setFullYear(birth.getFullYear() + maxAge);

  return {
    crossroads: crossroad.name,
    startDate: startDate.toISOString().split('T')[0],
    exactDate: exactDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    startAge: minAge,
    exactAge: crossroad.exactAge,
    endAge: maxAge
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  detectCrossroads,
  getCrossroadsData,
  getAllCrossroadsData,
  isInCrossroads,
  getCrossroadsWindow,
  // Re-export data
  MAJOR_CROSSROADS,
  INTENSITY_MODIFIERS
};
