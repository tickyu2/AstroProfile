/**
 * Direct Planet Narration System
 *
 * The other side of retrogrades - how your energy moves when it's free.
 * Direct planets sing their forward song.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { describeHouseDomain } from './houseNarration';

/**
 * Core direct-motion messages for each planet
 * These speak to how energy flows freely when not retrograde
 */
const directMessages = {
  Sun: () =>
    `Your Sun moves cleanly here — your core identity wants to shine without apology or delay.`,

  Moon: () =>
    `Your Moon flows directly — feelings can rise, move, and settle without needing to loop back first.`,

  Mercury: () =>
    `Your mind runs forward — words and insights want to be shared as they come, unedited truth in motion.`,

  Venus: () =>
    `Your Venus walks straight toward what it loves — affection and desire are meant to feel simple here.`,

  Mars: () =>
    `Your Mars burns in a direct line — action, anger, and courage seek honest expression rather than suppression.`,

  Jupiter: () =>
    `Your Jupiter opens doors easily — growth, faith, and opportunity can arrive by saying yes without overthinking.`,

  Saturn: () =>
    `Your Saturn builds steadily — commitments and boundaries can be claimed clearly instead of through trial and error.`,

  Uranus: () =>
    `Your Uranus sparks clean awakenings — change and liberation can erupt suddenly, but with a sense of rightness.`,

  Neptune: () =>
    `Your Neptune dreams in real time — intuition and imagination can guide you without first confusing you.`,

  Pluto: () =>
    `Your Pluto transforms in visible ways — power and rebirth can show up as clear turning points in your story.`,

  // Nodes and Chiron
  NorthNode: () =>
    `Your North Node points forward clearly — soul growth feels like stepping into something new rather than revisiting old lessons.`,

  Chiron: () =>
    `Your Chiron heals in forward motion — wounds can be addressed directly rather than through repeated patterns.`
};

/**
 * Extended direct planet poetry with house context
 */
const directHouseBlend = {
  Sun: {
    1: 'Your identity shines most directly through your presence — be seen.',
    5: 'Creative self-expression flows without hesitation — play freely.',
    10: 'Your public role and ambition move in clear steps — lead with confidence.'
  },
  Moon: {
    4: 'Emotional safety at home is straightforward — you know what nurtures you.',
    7: 'Feelings in partnership flow clearly — emotional honesty comes naturally.',
    12: 'Even your hidden feelings can surface gently — the unconscious cooperates.'
  },
  Mercury: {
    3: 'Communication is your natural gift — speak and write freely.',
    6: 'Your analytical mind excels at work — details are your friends.',
    9: 'Higher learning and philosophy come easily — explore ideas boldly.'
  },
  Venus: {
    2: 'Pleasure and value alignment are simple — enjoy what you love.',
    5: 'Romance and creativity dance together naturally — let beauty lead.',
    7: 'Love in partnership feels uncomplicated — affection flows both ways.'
  },
  Mars: {
    1: 'Your drive and initiative are clear forces — act on what you want.',
    6: 'Work energy is strong and direct — accomplish with vigor.',
    10: 'Ambition and assertiveness serve your goals — push forward confidently.'
  }
};

/**
 * Generate narration for direct (non-retrograde) planets in a slice
 * @param {Object} slice - Timeline slice with planets array
 * @param {Object} options - Configuration options
 * @param {number} options.maxPlanets - Maximum planets to narrate (default: 3)
 * @returns {string[]} Array of narration lines
 */
export function narrateDirectPlanets(slice, options = {}) {
  if (!slice || !slice.planets) return [];

  const { maxPlanets = 3 } = options;

  const direct = slice.planets.filter(p => !p.retrograde);
  if (!direct.length) return [];

  const lines = [];

  // Prioritize personal planets (Sun, Moon, Mercury, Venus, Mars)
  const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
  const sorted = [...direct].sort((a, b) => {
    const aIdx = personalPlanets.indexOf(a.name);
    const bIdx = personalPlanets.indexOf(b.name);
    const aPriority = aIdx >= 0 ? aIdx : 99;
    const bPriority = bIdx >= 0 ? bIdx : 99;
    return aPriority - bPriority;
  });

  sorted.slice(0, maxPlanets).forEach(planet => {
    const planetName = normalizePlanetName(planet.name);
    const fn = directMessages[planetName];

    if (!fn) return;

    const core = fn();

    // Add house context if available
    let housePart = '';
    if (planet.house) {
      const houseDomain = describeHouseDomain(planet.house);
      housePart = ` In your ${houseDomain}, this is a place where your energy can move without so much resistance.`;
    }

    lines.push(core + housePart);
  });

  return lines;
}

/**
 * Get the direct message for a specific planet
 * @param {string} planetName - Planet name
 * @returns {string|null} Direct message or null
 */
export function getDirectMessage(planetName) {
  const normalized = normalizePlanetName(planetName);
  const fn = directMessages[normalized];
  return fn ? fn() : null;
}

/**
 * Get extended direct poetry blending planet and house
 * @param {string} planetName - Planet name
 * @param {number} houseNum - House number
 * @returns {string|null} Extended message or null
 */
export function getDirectHousePoetry(planetName, houseNum) {
  const normalized = normalizePlanetName(planetName);
  const planetPoetry = directHouseBlend[normalized];
  if (!planetPoetry) return null;
  return planetPoetry[houseNum] || null;
}

/**
 * Count direct planets in a slice
 * @param {Object} slice - Timeline slice
 * @returns {number} Count of direct planets
 */
export function countDirectPlanets(slice) {
  if (!slice || !slice.planets) return 0;
  return slice.planets.filter(p => !p.retrograde).length;
}

/**
 * Get all direct planets in a slice
 * @param {Object} slice - Timeline slice
 * @returns {Object[]} Array of direct planet objects
 */
export function getDirectPlanets(slice) {
  if (!slice || !slice.planets) return [];
  return slice.planets.filter(p => !p.retrograde);
}

/**
 * Generate a summary of direct planet energy
 * @param {Object} slice - Timeline slice
 * @returns {string|null} Summary line or null if no direct planets
 */
export function summarizeDirectPlanets(slice) {
  const count = countDirectPlanets(slice);
  const total = slice?.planets?.length || 0;

  if (count === 0) {
    return 'All planets move in retrograde — a rare season of deep inner work.';
  } else if (count === total) {
    return 'All planets flow forward — energy moves freely in every direction.';
  } else if (count >= total * 0.7) {
    return 'Most planets move directly — forward momentum is available when you need it.';
  }

  return null;
}

/**
 * Normalize planet name for lookup
 * @param {string} name - Raw planet name
 * @returns {string} Normalized name
 */
function normalizePlanetName(name) {
  if (!name) return '';
  const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const aliases = {
    'North node': 'NorthNode',
    'Northnode': 'NorthNode',
    'South node': 'SouthNode',
    'Southnode': 'SouthNode'
  };

  return aliases[normalized] || normalized;
}
