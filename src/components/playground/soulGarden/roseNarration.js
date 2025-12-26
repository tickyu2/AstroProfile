/**
 * Rose Window Narration System
 *
 * Generates poetic, cathedral-language narration for the Rose Window.
 * Speaks in terms of desire, emotion, and sacred geometry.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { getElementForSign, isAngularHouse } from './theme';

/**
 * House ordinal names
 */
const HOUSE_ORDINALS = {
  1: 'First',
  2: 'Second',
  3: 'Third',
  4: 'Fourth',
  5: 'Fifth',
  6: 'Sixth',
  7: 'Seventh',
  8: 'Eighth',
  9: 'Ninth',
  10: 'Tenth',
  11: 'Eleventh',
  12: 'Twelfth'
};

/**
 * House themes for narration
 */
const HOUSE_THEMES = {
  1: 'identity and the emergent self',
  2: 'resources, worth, and what you gather',
  3: 'voice, exchange, and the near journey',
  4: 'roots, home, and the deep foundation',
  5: 'joy, creation, and the heart\'s play',
  6: 'craft, care, and sacred service',
  7: 'the mirror of relationship',
  8: 'depth, merging, and alchemical transformation',
  9: 'faith, philosophy, and the long road',
  10: 'calling, visibility, and the mountain peak',
  11: 'dreams shared with others, the collective vision',
  12: 'mystery, surrender, and the infinite ocean'
};

/**
 * Element descriptions
 */
const ELEMENT_POETRY = {
  Fire: 'a flame that illuminates without consuming',
  Earth: 'the quiet patience of stone and root',
  Air: 'a breath that carries thought across distances',
  Water: 'a current that knows the shape of feeling'
};

/**
 * Planet poetry for when planets occupy houses
 */
const PLANET_POETRY = {
  sun: { verb: 'illuminates', theme: 'core identity gathers strength' },
  moon: { verb: 'reflects', theme: 'emotional tides rise' },
  mercury: { verb: 'quickens', theme: 'thoughts take flight' },
  venus: { verb: 'adorns', theme: 'beauty and desire awaken' },
  mars: { verb: 'ignites', theme: 'will and action stir' },
  jupiter: { verb: 'expands', theme: 'abundance opens its gates' },
  saturn: { verb: 'structures', theme: 'time and mastery are honored' },
  uranus: { verb: 'disrupts', theme: 'liberation breaks through' },
  neptune: { verb: 'dissolves', theme: 'the dream world breathes' },
  pluto: { verb: 'transforms', theme: 'the depths shift silently' }
};

/**
 * 8th house special poetry (alchemical chamber)
 */
const EIGHTH_HOUSE_ALCHEMY = [
  'The alchemical chamber of your chart glows — this is where the soul rearranges itself.',
  'An old skin dissolves quietly... the hidden organ of the soul stirs.',
  'The threshold between worlds opens — transmutation begins.',
  'In the 8th, a hidden portal stirs — depth invites you to cross a quiet threshold.',
  'The 8th house breathes with secrets — what must be released prepares to transform.'
];

/**
 * 9th house special poetry (golden meaning)
 */
const NINTH_HOUSE_PHILOSOPHY = [
  'The 9th house window tilts toward the horizon — desire for meaning traces new arcs across the sky.',
  'Philosophy becomes a living thing — the soul reaches for what lies beyond.',
  'The long road calls — wisdom gathered in distant lands awaits.',
  'Faith stirs in the 9th — not belief, but the courage to question and seek.'
];

/**
 * Angular house poetry (1, 4, 7, 10)
 */
const ANGULAR_POETRY = {
  1: 'The Ascendant awakens — self meets world at the edge of dawn.',
  4: 'The IC roots deep — home is not a place but a feeling remembered.',
  7: 'The Descendant mirrors — what you seek in another, you already carry.',
  10: 'The Midheaven crowns — calling rises like a mountain waiting to be climbed.'
};

/**
 * Desire/emotion closing lines
 */
const DESIRE_CLOSINGS = [
  'Desire does not shout here; it unfurls — a slow, golden opening of the soul toward what it longs to become.',
  'Emotion is not chaos — it is the language the soul uses to speak to itself.',
  'What you desire is a compass — follow it gently, without grasping.',
  'The heart knows things the mind has not yet learned to name.',
  'Longing is not lack — it is the soul remembering what it came here to find.'
];

/**
 * Generate poetic narration for the Rose Window state
 * @param {Object} slice - timeline slice with houses array
 * @returns {string[]} array of narration lines
 */
export function narrateRoseWindow(slice) {
  if (!slice || !slice.houses || !slice.houses.length) {
    return [];
  }

  const houses = slice.houses;
  const lines = [];

  // Find the strongest house
  const strongest = [...houses].sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];

  // Find special houses
  const eighth = houses.find(h => h.house === 8);
  const ninth = houses.find(h => h.house === 9);

  // 1. Main line: strongest house as focal petal
  if (strongest && strongest.strength > 0) {
    const ordinal = HOUSE_ORDINALS[strongest.house] || `House ${strongest.house}`;
    const theme = HOUSE_THEMES[strongest.house] || 'mystery';
    const element = getElementForSign(strongest.sign);
    const elementPoem = ELEMENT_POETRY[element] || 'subtle energy';

    lines.push(
      `The ${ordinal} petal glows at ${strongest.strength}/100 — ${theme} gathers at the center, carrying ${elementPoem}.`
    );
  }

  // 2. Angular house special narration (if one is strong)
  const strongAngular = houses
    .filter(h => isAngularHouse(h.house) && h.strength >= 60)
    .sort((a, b) => b.strength - a.strength)[0];

  if (strongAngular && ANGULAR_POETRY[strongAngular.house]) {
    lines.push(ANGULAR_POETRY[strongAngular.house]);
  }

  // 3. 8th house portal line (if present and has strength)
  if (eighth && eighth.strength > 0) {
    const alchemyLine = EIGHTH_HOUSE_ALCHEMY[Math.floor(Math.random() * EIGHTH_HOUSE_ALCHEMY.length)];
    lines.push(alchemyLine);
  }

  // 4. 9th house philosophy line (if strong)
  if (ninth && ninth.strength >= 40) {
    const philLine = NINTH_HOUSE_PHILOSOPHY[Math.floor(Math.random() * NINTH_HOUSE_PHILOSOPHY.length)];
    lines.push(philLine);
  }

  // 5. Planet narration (if any house has planets)
  const houseWithPlanets = houses.find(h => h.planets && h.planets.length > 0);
  if (houseWithPlanets) {
    const planet = houseWithPlanets.planets[0].toLowerCase();
    const planetData = PLANET_POETRY[planet];
    if (planetData) {
      const ordinal = HOUSE_ORDINALS[houseWithPlanets.house];
      lines.push(
        `${planet.charAt(0).toUpperCase() + planet.slice(1)} ${planetData.verb} the ${ordinal} — ${planetData.theme}.`
      );
    }
  }

  // 6. Desire/emotion closing line
  const closing = DESIRE_CLOSINGS[Math.floor(Math.random() * DESIRE_CLOSINGS.length)];
  lines.push(closing);

  return lines;
}

/**
 * Generate a single-line summary for the Rose Window
 */
export function summarizeRoseWindow(slice) {
  if (!slice || !slice.houses || !slice.houses.length) {
    return 'The rose window awaits...';
  }

  const houses = slice.houses;
  const strongest = [...houses].sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];

  if (!strongest || strongest.strength === 0) {
    return 'The petals rest in balance.';
  }

  const ordinal = HOUSE_ORDINALS[strongest.house] || `House ${strongest.house}`;
  const theme = HOUSE_THEMES[strongest.house] || 'mystery';

  return `The ${ordinal} house leads at ${strongest.strength}/100 — ${theme}.`;
}

/**
 * Get emotion for a specific house based on its state
 */
export function getHouseEmotion(house) {
  if (!house) return null;

  const strength = house.strength || 0;
  const hasPlants = house.planets && house.planets.length > 0;

  if (strength >= 80) {
    return {
      intensity: 'radiant',
      description: 'This petal pulses with concentrated light.'
    };
  } else if (strength >= 60) {
    return {
      intensity: 'awakened',
      description: hasPlants
        ? 'Planetary visitors activate this space.'
        : 'This area of life stirs with possibility.'
    };
  } else if (strength >= 40) {
    return {
      intensity: 'present',
      description: 'A gentle hum of activity resonates here.'
    };
  } else if (strength >= 20) {
    return {
      intensity: 'quiet',
      description: 'This petal rests, conserving its energy.'
    };
  } else {
    return {
      intensity: 'dormant',
      description: 'The soul listens here more than it speaks.'
    };
  }
}

/* ---------- ENNEAGRAM ALCHEMICAL ROSE NARRATION ---------- */

/**
 * Enneagram type themes for cathedral sunlight narration
 * Each type has a primary refraction (dominant light) and shadow tone
 */
const ENNEAGRAM_TYPE_THEMES = {
  1: {
    name: 'The Reformer',
    shortName: 'Reformer',
    refraction: 'a pure, silver light — striving for perfection in all things',
    shadow: 'the weight of self-judgment softens at the edges',
    desire: 'rightness',
    fear: 'corruption'
  },
  2: {
    name: 'The Helper',
    shortName: 'Helper',
    refraction: 'a warm, rose-gold glow — love given freely, hoping to be received',
    shadow: 'the need to be needed dissolves into simple presence',
    desire: 'to be loved',
    fear: 'being unwanted'
  },
  3: {
    name: 'The Achiever',
    shortName: 'Achiever',
    refraction: 'a brilliant amber shimmer — success as identity, becoming the mask',
    shadow: 'beneath the achievements, the true self waits patiently',
    desire: 'to be valuable',
    fear: 'worthlessness'
  },
  4: {
    name: 'The Individualist',
    shortName: 'Individualist',
    refraction: 'a deep, violet light — turning melancholy into creative gold',
    shadow: 'uniqueness is not separation, but a particular gift',
    desire: 'to find oneself',
    fear: 'having no identity'
  },
  5: {
    name: 'The Investigator',
    shortName: 'Investigator',
    refraction: 'a cool, steady blue — gathering knowledge in the quiet of the Nave',
    shadow: 'wisdom shared is wisdom doubled, not halved',
    desire: 'to be capable',
    fear: 'uselessness'
  },
  6: {
    name: 'The Loyalist',
    shortName: 'Loyalist',
    refraction: 'a teal-green constancy — security built on tested bonds',
    shadow: 'the vigilance can soften when trust is earned',
    desire: 'to have security',
    fear: 'being without support'
  },
  7: {
    name: 'The Enthusiast',
    shortName: 'Enthusiast',
    refraction: 'a golden, dancing light — joy chasing joy across the Rose Window',
    shadow: 'even pain, when faced, becomes a teacher',
    desire: 'to be satisfied',
    fear: 'being deprived'
  },
  8: {
    name: 'The Challenger',
    shortName: 'Challenger',
    refraction: 'a fierce orange shimmer — protecting the inner sanctum with raw power',
    shadow: 'true strength includes the vulnerability beneath',
    desire: 'to protect oneself',
    fear: 'being controlled'
  },
  9: {
    name: 'The Peacemaker',
    shortName: 'Peacemaker',
    refraction: 'a gentle, emerald glow — harmony as both gift and hiding place',
    shadow: 'your own desires matter as much as the peace you keep',
    desire: 'inner stability',
    fear: 'loss and fragmentation'
  }
};

/**
 * Cathedral sunlight opening lines
 */
const CATHEDRAL_SUNLIGHT_OPENINGS = [
  'The sunlight hits the Rose Window at an angle...',
  'Morning light streams through the stained glass...',
  'The cathedral catches the light, and the Rose Window awakens...',
  'As the hour turns, the Window refracts a new story...',
  'The glass petals shimmer with internal fire...'
];

/**
 * Enneagram wisdom closing lines
 */
const ENNEAGRAM_CLOSINGS = [
  'Each refraction reveals a different desire.',
  'The soul\'s architecture is written in colored glass.',
  'What you see in the window is what the window sees in you.',
  'Nine paths, one light — all leading to the center.',
  'The Enneagram is a map; you are the territory.'
];

/**
 * Tritype harmony descriptions
 */
const TRITYPE_HARMONIES = {
  'head-heart-body': 'Mind, Heart, and Body form a complete chord.',
  'heart-body-head': 'Emotion leads, grounded in action, guided by thought.',
  'body-head-heart': 'Instinct speaks first, thought refines, feeling colors.',
  'default': 'Three centers weave your soul\'s signature.'
};

/**
 * Generate poetic narration for the Enneagram Rose Window
 * Uses "cathedral sunlight" language — refractive, internal, psychological
 *
 * @param {number|null} dominantType - The dominant Enneagram type (1-9)
 * @param {Object} scores - Object with type scores { 1: 7, 2: 3, ... }
 * @param {number|null} wing - Optional wing type
 * @param {number[]|null} tritype - Optional tritype array [type1, type2, type3]
 * @returns {string[]} Array of narration lines
 */
export function narrateEnneagramRose(dominantType = null, scores = {}, wing = null, tritype = null) {
  const lines = [];

  // 1. Opening line - cathedral sunlight
  const opening = CATHEDRAL_SUNLIGHT_OPENINGS[Math.floor(Math.random() * CATHEDRAL_SUNLIGHT_OPENINGS.length)];
  lines.push(opening);

  // 2. Dominant type narration
  if (dominantType && ENNEAGRAM_TYPE_THEMES[dominantType]) {
    const typeData = ENNEAGRAM_TYPE_THEMES[dominantType];
    lines.push(`The ${typeData.name}'s petal refracts ${typeData.refraction}.`);
  }

  // 3. Find secondary strong types (score >= 7)
  const strongTypes = Object.entries(scores)
    .filter(([type, score]) => score >= 7 && parseInt(type) !== dominantType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  if (strongTypes.length > 0) {
    const [secondType] = strongTypes[0];
    const secondData = ENNEAGRAM_TYPE_THEMES[secondType];
    if (secondData) {
      lines.push(`The ${secondData.shortName}'s light mingles nearby — ${secondData.desire} echoes softly.`);
    }
  }

  // 4. Wing narration (if present)
  if (wing && ENNEAGRAM_TYPE_THEMES[wing] && dominantType) {
    const wingData = ENNEAGRAM_TYPE_THEMES[wing];
    const dominantData = ENNEAGRAM_TYPE_THEMES[dominantType];
    lines.push(
      `A ${wingData.shortName} wing colors the ${dominantData.shortName}'s light — the spectrum shifts.`
    );
  }

  // 5. Shadow wisdom (for dominant type)
  if (dominantType && ENNEAGRAM_TYPE_THEMES[dominantType]) {
    const typeData = ENNEAGRAM_TYPE_THEMES[dominantType];
    lines.push(`In the depths of the glass: ${typeData.shadow}.`);
  }

  // 6. Tritype harmony (if present)
  if (tritype && tritype.length === 3) {
    // Determine center order (head: 5,6,7 | heart: 2,3,4 | body: 8,9,1)
    const getCenter = (type) => {
      if ([5, 6, 7].includes(type)) return 'head';
      if ([2, 3, 4].includes(type)) return 'heart';
      return 'body';
    };
    const centers = tritype.map(getCenter);
    const centerKey = centers.join('-');
    const harmony = TRITYPE_HARMONIES[centerKey] || TRITYPE_HARMONIES.default;
    lines.push(harmony);
  }

  // 7. Closing line
  const closing = ENNEAGRAM_CLOSINGS[Math.floor(Math.random() * ENNEAGRAM_CLOSINGS.length)];
  lines.push(closing);

  return lines;
}

/**
 * Generate a single-line summary for the Enneagram Rose
 */
export function summarizeEnneagramRose(dominantType = null, scores = {}) {
  if (!dominantType || !ENNEAGRAM_TYPE_THEMES[dominantType]) {
    return 'The nine petals await your discovery...';
  }

  const typeData = ENNEAGRAM_TYPE_THEMES[dominantType];
  const score = scores[dominantType] || 0;

  return `Type ${dominantType} (${typeData.shortName}) leads at ${score}/10 — seeking ${typeData.desire}.`;
}

/**
 * Get the Enneagram type theme data
 */
export function getEnneagramTypeTheme(type) {
  return ENNEAGRAM_TYPE_THEMES[type] || null;
}

/**
 * Get all available Enneagram type themes
 */
export function getAllEnneagramThemes() {
  return ENNEAGRAM_TYPE_THEMES;
}
