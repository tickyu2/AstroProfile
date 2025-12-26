/**
 * Retrograde Soul Messages System
 *
 * The deep whisper - the retrograde story that speaks to why
 * some things repeat until they finally heal.
 *
 * These are the messages that make someone cry because
 * they finally name what they've always felt.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { describeHouseDomain } from './houseNarration';

/**
 * Core retrograde messages for each planet
 * These speak to the natal retrograde pattern - the lifelong story
 */
const retrogradeMessages = {
  Sun: () =>
    `Your Sun moves inward — your core identity grows by reflecting, revising, and quietly redefining what "being you" means.`,

  Moon: () =>
    `Your Moon dreams in reverse — emotional safety for you often comes after revisiting old feelings and rewriting their story.`,

  Mercury: () =>
    `Your mind runs loops, not lines — you understand life by circling back, rethinking, and saying it better the second time.`,

  Venus: () =>
    `Your heart loves along spirals — relationships and desires return in new forms so you can meet them with deeper truth.`,

  Mars: () =>
    `Your will turns inward — action for you often starts as tension, frustration, or a slow burn that eventually becomes decisive movement.`,

  Jupiter: () =>
    `Your faith expands through revision — beliefs and opportunities revisit you, asking for wiser, more authentic yeses.`,

  Saturn: () =>
    `Your responsibilities echo — limits, duties, and commitments return until you claim boundaries that are yours, not inherited.`,

  Uranus: () =>
    `Your rebellion is patient — change comes in waves, often triggered by old shocks your soul is still integrating.`,

  Neptune: () =>
    `Your mysticism moves in tides — illusions and visions return until you can feel which are fantasy and which are guidance.`,

  Pluto: () =>
    `Your power travels underground — the same themes of loss, intensity, and rebirth visit you in new disguises until they are fully owned.`,

  // Nodes (if tracked)
  NorthNode: () =>
    `Your soul's direction spirals inward first — growth comes through revisiting old lessons before stepping toward the new.`,

  SouthNode: () =>
    `Your past life patterns are particularly vivid — what you've been before keeps asking to be consciously released.`,

  // Chiron
  Chiron: () =>
    `Your wound is also a returning teacher — the same tender places are touched again so you can finally become the healer you seek.`
};

/**
 * Extended retrograde poetry with house context
 */
const retrogradeHouseBlend = {
  Sun: {
    1: 'Your identity is a spiral path — each return to "Who am I?" reveals a deeper answer.',
    4: 'Home and self intertwine — you find yourself by returning to your roots.',
    10: 'Your public self is a work in progress — authenticity arrives through revision.'
  },
  Moon: {
    4: 'Emotional home is a place you keep rediscovering, not arriving at once.',
    8: 'Feelings run deep and recursive — old emotional patterns surface for release.',
    12: 'Your inner tides flow in dreams and solitude, revealing truths in their own time.'
  },
  Mercury: {
    3: 'Words come back to you — what you said years ago still wants refinement.',
    6: 'Your mind works best when it can circle back and improve.',
    9: 'Beliefs are revised journeys — you learn by questioning what you once accepted.'
  },
  Venus: {
    2: 'What you value keeps returning for reassessment — true worth reveals itself slowly.',
    5: 'Love and creativity spiral — old flames and unfinished art ask for completion.',
    7: 'Relationships are teachers that return — old patterns want conscious resolution.'
  },
  Mars: {
    1: 'Your drive is internal first — action builds pressure before release.',
    6: 'Work frustrations are fuel — what blocks you eventually propels you.',
    8: 'Desire and will move through shadow — power emerges from what was suppressed.'
  }
};

/**
 * Generate narration for retrograde planets in a slice
 * @param {Object} slice - Timeline slice with planets array
 * @returns {string[]} Array of narration lines
 */
export function narrateRetrogrades(slice) {
  if (!slice || !slice.planets) return [];

  const retrogrades = slice.planets.filter(p => p.retrograde);
  if (!retrogrades.length) return [];

  const lines = [];

  retrogrades.forEach(planet => {
    const planetName = normalizePlanetName(planet.name);
    const baseFn = retrogradeMessages[planetName];

    if (!baseFn) return;

    const coreLine = baseFn();

    // Add house context if available
    let housePart = '';
    if (planet.house) {
      const houseDomain = describeHouseDomain(planet.house);
      housePart = ` Right now this pattern is working through your ${houseDomain}.`;
    }

    lines.push(coreLine + housePart);
  });

  return lines;
}

/**
 * Get the core retrograde message for a planet
 * @param {string} planetName - Planet name
 * @returns {string|null} Core message or null
 */
export function getRetrogradeMessage(planetName) {
  const normalized = normalizePlanetName(planetName);
  const fn = retrogradeMessages[normalized];
  return fn ? fn() : null;
}

/**
 * Get extended retrograde poetry blending planet and house
 * @param {string} planetName - Planet name
 * @param {number} houseNum - House number
 * @returns {string|null} Extended message or null
 */
export function getRetrogradeHousePoetry(planetName, houseNum) {
  const normalized = normalizePlanetName(planetName);
  const planetPoetry = retrogradeHouseBlend[normalized];
  if (!planetPoetry) return null;
  return planetPoetry[houseNum] || null;
}

/**
 * Count retrograde planets in a slice
 * @param {Object} slice - Timeline slice
 * @returns {number} Count of retrograde planets
 */
export function countRetrogrades(slice) {
  if (!slice || !slice.planets) return 0;
  return slice.planets.filter(p => p.retrograde).length;
}

/**
 * Get all retrograde planets in a slice
 * @param {Object} slice - Timeline slice
 * @returns {Object[]} Array of retrograde planet objects
 */
export function getRetrogradePlanets(slice) {
  if (!slice || !slice.planets) return [];
  return slice.planets.filter(p => p.retrograde);
}

/**
 * Check if a specific planet is retrograde in a slice
 * @param {Object} slice - Timeline slice
 * @param {string} planetName - Planet name to check
 * @returns {boolean} True if planet is retrograde
 */
export function isPlanetRetrograde(slice, planetName) {
  if (!slice || !slice.planets) return false;
  const normalized = normalizePlanetName(planetName);
  return slice.planets.some(p =>
    normalizePlanetName(p.name) === normalized && p.retrograde
  );
}

/**
 * Normalize planet name for lookup
 * @param {string} name - Raw planet name
 * @returns {string} Normalized name
 */
function normalizePlanetName(name) {
  if (!name) return '';

  // Capitalize first letter, lowercase rest
  const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  // Handle common variations
  const aliases = {
    'North node': 'NorthNode',
    'Northnode': 'NorthNode',
    'South node': 'SouthNode',
    'Southnode': 'SouthNode',
    'True node': 'NorthNode'
  };

  return aliases[normalized] || normalized;
}

/**
 * Generate a summary of retrograde energy in a slice
 * @param {Object} slice - Timeline slice
 * @returns {string|null} Summary line or null if no retrogrades
 */
export function summarizeRetrogrades(slice) {
  const count = countRetrogrades(slice);

  if (count === 0) {
    return null;
  } else if (count === 1) {
    const planet = getRetrogradePlanets(slice)[0];
    return `One retrograde whispers: ${planet.name} turns inward, asking for reflection.`;
  } else if (count <= 3) {
    return `${count} planets move in reverse — a season of revision and inner work.`;
  } else {
    return `${count} retrogrades converge — the soul is being asked to pause and reconsider deeply.`;
  }
}
