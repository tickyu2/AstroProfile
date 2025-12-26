/**
 * House Emotional Narration System
 *
 * The "local voice" - what's happening when a given house is strong in a slice.
 * Each house speaks its own emotional language.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

/**
 * Per-house emotional messages
 * Each function takes the house strength (0-100) and returns a soul-language line
 */
const houseEmotions = {
  1: (strength) =>
    `Your sense of self stirs at ${strength}/100 — identity is asking to be seen and chosen.`,

  2: (strength) =>
    `Your values and resources glow at ${strength}/100 — what you cherish wants to anchor your next decisions.`,

  3: (strength) =>
    `Your voice hums at ${strength}/100 — something in you wants to be said, not just thought.`,

  4: (strength) =>
    `Your roots thrum at ${strength}/100 — memory, family, and inner safety are shaping the moment beneath the surface.`,

  5: (strength) =>
    `Your creative fire flickers at ${strength}/100 — pleasure, play, and heart-expression are craving space.`,

  6: (strength) =>
    `Your craft and care pulse at ${strength}/100 — small acts of service now carry big soul-weight.`,

  7: (strength) =>
    `Your mirrors are bright at ${strength}/100 — relationships are reflecting truths you can't see alone.`,

  8: (strength) =>
    `Depth calls at ${strength}/100 — intimacy, shadow, and transformation are quietly rearranging your inner furniture.`,

  9: (strength) =>
    `Your horizon sings at ${strength}/100 — belief, learning, and meaning-making are pulling you outward.`,

  10: (strength) =>
    `Your calling rings at ${strength}/100 — the world's eyes and your own integrity are in conversation.`,

  11: (strength) =>
    `Your future friendships spark at ${strength}/100 — community and dreams want to entwine.`,

  12: (strength) =>
    `The unseen hums at ${strength}/100 — rest, surrender, and mystery ask for your trust rather than your control.`
};

/**
 * Extended house poetry for deeper narration
 * Used when you want more than just the strength line
 */
const houseDeepPoetry = {
  1: {
    theme: 'identity and emergence',
    awakened: 'The self remembers itself — you are being born again in this moment.',
    dormant: 'Identity rests quietly, conserving strength for the next emergence.'
  },
  2: {
    theme: 'worth and resources',
    awakened: 'What you own and what owns you are coming into clearer focus.',
    dormant: 'Material concerns recede; other voices in the chart speak louder now.'
  },
  3: {
    theme: 'voice and connection',
    awakened: 'Words carry unusual weight — say what needs saying.',
    dormant: 'The mind quiets; listening takes precedence over speaking.'
  },
  4: {
    theme: 'roots and belonging',
    awakened: 'Home is calling — whether to build, heal, or simply remember.',
    dormant: 'The foundation holds steady; no renovation needed now.'
  },
  5: {
    theme: 'joy and creation',
    awakened: 'The heart wants to play — creativity is not a luxury but a necessity.',
    dormant: 'Joy waits patiently; other work takes precedence for now.'
  },
  6: {
    theme: 'service and craft',
    awakened: 'Small things matter greatly — your work is your prayer.',
    dormant: 'Duties lighten; space opens for other dimensions of living.'
  },
  7: {
    theme: 'partnership and reflection',
    awakened: 'The Other is a teacher now — pay attention to who appears.',
    dormant: 'Self-reliance rises; the mirror is turned inward.'
  },
  8: {
    theme: 'depth and transformation',
    awakened: 'Something is dying so something new can live — trust the process.',
    dormant: 'The depths are calm; transformation works silently beneath.'
  },
  9: {
    theme: 'meaning and expansion',
    awakened: 'Philosophy becomes lived experience — what do you truly believe?',
    dormant: 'The far horizon rests; local truth is enough for now.'
  },
  10: {
    theme: 'calling and legacy',
    awakened: 'The world is watching — what you do now echoes forward.',
    dormant: 'Public life quiets; private cultivation takes the stage.'
  },
  11: {
    theme: 'community and vision',
    awakened: 'Your tribe is assembling — the future is a collective dream.',
    dormant: 'Solitary paths call; the group can wait.'
  },
  12: {
    theme: 'mystery and surrender',
    awakened: 'The veil thins — dreams, intuition, and the unseen speak clearly.',
    dormant: 'The mundane holds you; mystery will return in its own time.'
  }
};

/**
 * Generate narration for the strongest houses in a slice
 * @param {Object} slice - Timeline slice with houses array
 * @param {Object} options - Configuration options
 * @param {number} options.maxHouses - Maximum houses to narrate (default: 2)
 * @param {number} options.strengthThreshold - Minimum strength to include (default: 20)
 * @returns {string[]} Array of narration lines
 */
export function narrateHouses(slice, options = {}) {
  if (!slice || !slice.houses || !slice.houses.length) return [];

  const { maxHouses = 2, strengthThreshold = 20 } = options;

  // Sort houses by strength, descending
  const sorted = [...slice.houses].sort((a, b) => (b.strength || 0) - (a.strength || 0));

  // Filter to those above threshold and take top N
  const top = sorted
    .filter(h => (h.strength || 0) >= strengthThreshold)
    .slice(0, maxHouses);

  // Generate narration lines
  const lines = top.map(h => {
    const fn = houseEmotions[h.house];
    if (!fn) return null;
    return fn(h.strength || 0);
  }).filter(Boolean);

  return lines;
}

/**
 * Get deep poetry for a specific house
 * @param {Object} house - House object with house number and strength
 * @returns {Object|null} Poetry object with theme, awakened, dormant
 */
export function getHouseDeepPoetry(house) {
  if (!house) return null;
  const poetry = houseDeepPoetry[house.house];
  if (!poetry) return null;

  const strength = house.strength || 0;
  const state = strength >= 50 ? 'awakened' : 'dormant';

  return {
    house: house.house,
    theme: poetry.theme,
    message: poetry[state],
    state,
    strength
  };
}

/**
 * Get the theme description for a house number
 * @param {number} houseNum - House number (1-12)
 * @returns {string} Theme description
 */
export function getHouseTheme(houseNum) {
  const poetry = houseDeepPoetry[houseNum];
  return poetry?.theme || 'life in a quiet but potent way';
}

/**
 * Describe a house's domain in plain language
 * @param {number} houseNum - House number (1-12)
 * @returns {string} Domain description
 */
export function describeHouseDomain(houseNum) {
  const domains = {
    1: 'sense of self and beginnings',
    2: 'values, money, and self-worth',
    3: 'voice, learning, and local connections',
    4: 'home, roots, and emotional foundations',
    5: 'creativity, romance, and joy',
    6: 'health, work, and daily service',
    7: 'partnerships and one-to-one dynamics',
    8: 'intimacy, shared resources, and deep transformation',
    9: 'beliefs, travel, and meaning-making',
    10: 'career, reputation, and life direction',
    11: 'friends, networks, and long-range dreams',
    12: 'rest, the unconscious, and hidden worlds'
  };

  return domains[houseNum] || 'life in a quiet but potent way';
}
