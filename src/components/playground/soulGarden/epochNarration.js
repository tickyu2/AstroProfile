/**
 * Epoch Narration System
 *
 * Mythic language for entire life chapters.
 * The cathedral bell that rings over years, not minutes.
 *
 * This is where the whole life becomes a story being told through you.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

/**
 * House themes for epoch narration (expanded mythic language)
 */
const epochHouseThemes = {
  1: 'identity and first steps',
  2: 'money, worth, and the body\'s needs',
  3: 'learning, siblings, and the early mind',
  4: 'home, family, and emotional roots',
  5: 'creativity, play, and romance',
  6: 'work, health, and service routines',
  7: 'partnership and significant others',
  8: 'depth, crisis, and shared resources',
  9: 'belief, travel, and education',
  10: 'career, reputation, and public role',
  11: 'friends, networks, and big dreams',
  12: 'retreat, the unconscious, and endings'
};

/**
 * Planet tones for epoch narration
 */
const epochPlanetTones = {
  Sun: 'questions of identity and vitality',
  Moon: 'emotional tides and safety patterns',
  Mercury: 'mental habits and communication',
  Venus: 'love, attraction, and aesthetic values',
  Mars: 'desire, anger, and courage',
  Jupiter: 'growth, faith, and opportunity',
  Saturn: 'limits, duties, and structure',
  Uranus: 'sudden changes and liberation',
  Neptune: 'dreams, illusions, and spiritual longing',
  Pluto: 'power, loss, and deep transformation',
  Chiron: 'wounding and healing',
  NorthNode: 'soul direction and growth edge'
};

/**
 * Mythic epoch labels and their associated poetry
 */
const epochMythicPoetry = {
  'Early Life': {
    opening: 'The soul arrives in a new world, learning its first lessons.',
    closing: 'The child within still carries these patterns — honor them.'
  },
  'Childhood': {
    opening: 'The garden of youth takes root — early experiences become deep soil.',
    closing: 'What was planted here still grows in the present.'
  },
  'Adolescence': {
    opening: 'The self awakens to itself — identity emerges through friction.',
    closing: 'The teenager within still asks: Who am I allowed to be?'
  },
  'Young Adulthood': {
    opening: 'The soul steps into the world — choices begin to have lasting weight.',
    closing: 'The young adult within still carries these first brave steps.'
  },
  'Apprenticeship': {
    opening: 'Learning the craft of living — skills and relationships take shape.',
    closing: 'What was mastered here becomes foundation for all that follows.'
  },
  'Maturity': {
    opening: 'The soul claims its place — authority and responsibility intertwine.',
    closing: 'The mature self integrates what was learned; wisdom begins to crystallize.'
  },
  'Midlife': {
    opening: 'The turning point — what was built gets questioned, what was denied asks to be lived.',
    closing: 'Midlife is not crisis but invitation: Who will you become next?'
  },
  'Harvest': {
    opening: 'The fruits of a lifetime begin to ripen — legacy takes shape.',
    closing: 'What was planted decades ago now feeds others.'
  },
  'Elder Years': {
    opening: 'The soul prepares for return — wisdom distills, essence clarifies.',
    closing: 'The elder within carries the whole story, and knows its meaning.'
  },
  'Saturn Return': {
    opening: 'Saturn returns to its natal place — adulthood is claimed or demanded.',
    closing: 'What is built during Saturn Return often lasts a lifetime.'
  },
  'Uranus Opposition': {
    opening: 'Uranus opposes its natal place — the unlived life demands attention.',
    closing: 'Midlife awakening is not about youth but about authenticity.'
  },
  'Chiron Return': {
    opening: 'Chiron returns around age 50 — the wounded healer completes a cycle.',
    closing: 'Healing becomes teaching; what hurt you becomes what you offer.'
  }
};

/**
 * Generate narration for a life epoch
 * @param {Object} epoch - Epoch object with label, ages, dominant houses/planets
 * @param {string} risingSign - Rising sign for additional context
 * @returns {string[]} Array of narration lines
 */
export function narrateEpoch(epoch, risingSign = null) {
  if (!epoch) return [];

  const {
    label,
    startAge,
    endAge,
    dominantHouses = [],
    dominantPlanets = []
  } = epoch;

  const lines = [];

  // Age span description
  const span = (startAge !== undefined && endAge !== undefined)
    ? ` (approximately ages ${startAge}–${endAge})`
    : '';

  // Opening line with mythic resonance
  const mythic = epochMythicPoetry[label];
  if (mythic) {
    lines.push(mythic.opening);
  }

  lines.push(
    `${label}${span} forms a distinct chapter in your soul's story — a corridor in your cathedral where certain bells rang louder than others.`
  );

  // Dominant house themes
  if (dominantHouses.length > 0) {
    const themes = dominantHouses.map(h => epochHouseThemes[h] || 'a subtle but meaningful arena');
    lines.push(
      `During this time, life kept returning to ${joinList(themes)} — these areas of life were the training grounds of your becoming.`
    );
  }

  // Dominant planet tones
  if (dominantPlanets.length > 0) {
    const tones = dominantPlanets.map(p => epochPlanetTones[p] || 'a subtle inner tone');
    lines.push(
      `Planetary tones here: ${tones.join(', ')}. These were the instruments your soul was tuning in that era.`
    );
  }

  // Rising sign context
  if (risingSign) {
    lines.push(
      `Seen through your ${risingSign} Rising, this epoch was your way of learning how to walk your path in a very particular style.`
    );
  }

  // Closing mythic line
  if (mythic) {
    lines.push(mythic.closing);
  }

  return lines;
}

/**
 * Generate a brief epoch summary (one line)
 * @param {Object} epoch - Epoch object
 * @returns {string} Single summary line
 */
export function summarizeEpoch(epoch) {
  if (!epoch) return '';

  const { label, dominantHouses = [], dominantPlanets = [] } = epoch;

  if (dominantHouses.length > 0) {
    const mainHouse = epochHouseThemes[dominantHouses[0]] || 'life themes';
    return `${label} centered on ${mainHouse}.`;
  }

  if (dominantPlanets.length > 0) {
    const mainPlanet = dominantPlanets[0];
    const tone = epochPlanetTones[mainPlanet] || 'inner development';
    return `${label} was shaped by ${tone}.`;
  }

  return `${label} formed a unique chapter in your story.`;
}

/**
 * Generate narration for all epochs in a life
 * @param {Object[]} epochs - Array of epoch objects
 * @param {string} risingSign - Rising sign for context
 * @returns {Object[]} Array of {epoch, lines} objects
 */
export function narrateAllEpochs(epochs, risingSign = null) {
  if (!epochs || !epochs.length) return [];

  return epochs.map(epoch => ({
    epoch,
    lines: narrateEpoch(epoch, risingSign)
  }));
}

/**
 * Generate a life overview narration
 * @param {Object[]} epochs - Array of epoch objects
 * @param {string} risingSign - Rising sign
 * @returns {string[]} Overview narration lines
 */
export function narrateLifeOverview(epochs, risingSign = null) {
  if (!epochs || !epochs.length) {
    return ['Your life story awaits its telling — the epochs will reveal themselves.'];
  }

  const lines = [];

  lines.push(
    `Your life unfolds through ${epochs.length} distinct epochs — each a room in your cathedral, each with its own light.`
  );

  if (risingSign) {
    lines.push(
      `As a ${risingSign} Rising, you walk through these rooms with a particular gait — your style of meeting each chapter is uniquely yours.`
    );
  }

  // Identify recurring themes
  const allHouses = epochs.flatMap(e => e.dominantHouses || []);
  const houseCounts = countOccurrences(allHouses);
  const recurringHouses = Object.entries(houseCounts)
    .filter(([_, count]) => count >= 2)
    .map(([house]) => parseInt(house));

  if (recurringHouses.length > 0) {
    const themes = recurringHouses.map(h => epochHouseThemes[h] || 'unknown');
    lines.push(
      `Recurring themes across your life: ${joinList(themes)}. These are the lessons your soul keeps returning to learn more deeply.`
    );
  }

  // Identify recurring planets
  const allPlanets = epochs.flatMap(e => e.dominantPlanets || []);
  const planetCounts = countOccurrences(allPlanets);
  const recurringPlanets = Object.entries(planetCounts)
    .filter(([_, count]) => count >= 2)
    .map(([planet]) => planet);

  if (recurringPlanets.length > 0) {
    const tones = recurringPlanets.map(p => epochPlanetTones[p] || 'subtle energy');
    lines.push(
      `Recurring planetary voices: ${tones.join(', ')}. These instruments play throughout your symphony.`
    );
  }

  lines.push(
    `Each epoch prepares you for the next — and the whole becomes a story only your soul could tell.`
  );

  return lines;
}

/**
 * Get the current epoch based on age
 * @param {Object[]} epochs - Array of epoch objects
 * @param {number} age - Current age
 * @returns {Object|null} Current epoch or null
 */
export function getCurrentEpoch(epochs, age) {
  if (!epochs || !epochs.length || age === undefined) return null;

  return epochs.find(e =>
    e.startAge !== undefined &&
    e.endAge !== undefined &&
    age >= e.startAge &&
    age <= e.endAge
  ) || null;
}

/**
 * Get the next epoch based on age
 * @param {Object[]} epochs - Array of epoch objects
 * @param {number} age - Current age
 * @returns {Object|null} Next epoch or null
 */
export function getNextEpoch(epochs, age) {
  if (!epochs || !epochs.length || age === undefined) return null;

  return epochs.find(e =>
    e.startAge !== undefined &&
    e.startAge > age
  ) || null;
}

/**
 * Helper: Join a list with proper grammar
 */
function joinList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(', ')}, and ${last}`;
}

/**
 * Helper: Count occurrences in an array
 */
function countOccurrences(arr) {
  const counts = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return counts;
}

/**
 * Get house theme by number
 * @param {number} houseNum - House number
 * @returns {string} House theme
 */
export function getEpochHouseTheme(houseNum) {
  return epochHouseThemes[houseNum] || 'a subtle but meaningful arena';
}

/**
 * Get planet tone by name
 * @param {string} planetName - Planet name
 * @returns {string} Planet tone
 */
export function getEpochPlanetTone(planetName) {
  return epochPlanetTones[planetName] || 'a subtle inner tone';
}
