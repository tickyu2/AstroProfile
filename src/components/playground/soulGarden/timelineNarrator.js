/**
 * Unified Timeline Narrator
 *
 * Combines all three narration voices into a single, coherent soul message:
 *   - Rising Sign: The global voice (how the life itself feels)
 *   - Houses: The local voice (what's happening now)
 *   - Retrogrades: The deep whisper (why things repeat)
 *
 * "If your narration talks soul language, the soul recognizes.
 *  This is the beauty of soul to soul communications."
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { narrateRising, hasRisingVoice } from './risingNarration';
import { narrateHouses, getHouseDeepPoetry } from './houseNarration';
import { narrateRetrogrades, summarizeRetrogrades, countRetrogrades } from './retrogradeNarration';

/**
 * Build a complete narration bundle for a timeline slice
 *
 * @param {Object} params
 * @param {string} params.risingSign - e.g., "Sagittarius"
 * @param {Object} params.slice - Timeline slice with houses, planets, etc.
 * @param {Object} params.options - Optional configuration
 * @param {number} params.options.maxHouses - Max houses to narrate (default: 2)
 * @param {number} params.options.strengthThreshold - Min strength for houses (default: 20)
 * @param {boolean} params.options.includeRetrogradeSummary - Add summary line (default: false)
 * @returns {Object} Narration bundle with rising, houses, retrogrades, and all arrays
 */
export function narrateSlice({ risingSign, slice, options = {} }) {
  const {
    maxHouses = 2,
    strengthThreshold = 20,
    includeRetrogradeSummary = false
  } = options;

  // Generate each voice layer
  const rising = narrateRising(risingSign, slice);

  const houses = narrateHouses(slice, {
    maxHouses,
    strengthThreshold
  });

  const retrogrades = narrateRetrogrades(slice);

  // Optional retrograde summary
  const retrogradeSummary = includeRetrogradeSummary
    ? summarizeRetrogrades(slice)
    : null;

  // Compose in soul-language order:
  // Rising (global) → Houses (local) → Retrogrades (deep)
  const all = [
    ...rising,
    ...houses,
    ...retrogrades
  ];

  // Add summary at end if present
  if (retrogradeSummary) {
    all.push(retrogradeSummary);
  }

  return {
    rising,
    houses,
    retrogrades,
    retrogradeSummary,
    all,
    meta: {
      hasRising: rising.length > 0,
      houseCount: houses.length,
      retrogradeCount: countRetrogrades(slice),
      totalLines: all.length
    }
  };
}

/**
 * Generate a brief, focused narration (for compact displays)
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.slice - Timeline slice
 * @returns {string[]} Array of 1-3 essential lines
 */
export function narrateBrief({ risingSign, slice }) {
  const lines = [];

  // One rising line (if available)
  const rising = narrateRising(risingSign, slice);
  if (rising.length > 0) {
    lines.push(rising[0]);
  }

  // One house line (strongest only)
  const houses = narrateHouses(slice, { maxHouses: 1, strengthThreshold: 30 });
  if (houses.length > 0) {
    lines.push(houses[0]);
  }

  // Retrograde summary (if any)
  const retSummary = summarizeRetrogrades(slice);
  if (retSummary) {
    lines.push(retSummary);
  }

  return lines;
}

/**
 * Generate deep narration for a specific house
 *
 * @param {Object} params
 * @param {Object} params.house - House object with house number and strength
 * @param {Object} params.slice - Full slice for context
 * @returns {Object|null} Deep poetry object or null
 */
export function narrateHouseDeep({ house, slice }) {
  return getHouseDeepPoetry(house);
}

/**
 * Check if a slice has enough data for meaningful narration
 *
 * @param {Object} slice - Timeline slice
 * @returns {boolean} True if narration is possible
 */
export function canNarrate(slice) {
  if (!slice) return false;
  const hasHouses = slice.houses && slice.houses.length > 0;
  const hasPlanets = slice.planets && slice.planets.length > 0;
  return hasHouses || hasPlanets;
}

/**
 * Generate silence narration (when nothing is happening)
 *
 * @returns {string[]} Array with silence message
 */
export function narrateSilence() {
  const silenceMessages = [
    'The Garden is quiet here — but even silence is a kind of teaching.',
    'No petals stir now; the soul listens rather than speaks.',
    'In this stillness, something prepares to bloom.',
    'The Rose Window rests — not every moment needs a message.',
    'Silence in the cathedral is not absence; it is presence waiting.'
  ];

  const idx = Math.floor(Math.random() * silenceMessages.length);
  return [silenceMessages[idx]];
}

/**
 * Generate transition narration (when moving between slices)
 *
 * @param {Object} params
 * @param {Object} params.fromSlice - Previous slice
 * @param {Object} params.toSlice - Next slice
 * @param {string} params.risingSign - Rising sign for context
 * @returns {string[]} Transition narration lines
 */
export function narrateTransition({ fromSlice, toSlice, risingSign }) {
  const lines = [];

  // Compare strongest houses
  if (fromSlice?.houses && toSlice?.houses) {
    const fromStrongest = [...fromSlice.houses].sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];
    const toStrongest = [...toSlice.houses].sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];

    if (fromStrongest?.house !== toStrongest?.house) {
      lines.push(`The focal petal shifts — from the ${ordinal(fromStrongest?.house)} to the ${ordinal(toStrongest?.house)}.`);
    }
  }

  // Compare retrograde count
  const fromRetroCount = countRetrogrades(fromSlice);
  const toRetroCount = countRetrogrades(toSlice);

  if (toRetroCount > fromRetroCount) {
    lines.push('More planets turn inward — the season of reflection deepens.');
  } else if (toRetroCount < fromRetroCount) {
    lines.push('Retrograde clouds part — forward motion becomes possible again.');
  }

  if (lines.length === 0) {
    lines.push('The timeline flows onward — each moment a new petal in the eternal Rose.');
  }

  return lines;
}

/**
 * Helper: Convert house number to ordinal
 */
function ordinal(n) {
  if (!n) return 'unknown';
  const ordinals = {
    1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth',
    5: 'Fifth', 6: 'Sixth', 7: 'Seventh', 8: 'Eighth',
    9: 'Ninth', 10: 'Tenth', 11: 'Eleventh', 12: 'Twelfth'
  };
  return ordinals[n] || `${n}th`;
}

/**
 * Generate a single, most important line for the current moment
 * Useful for status bars or minimal displays
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.slice - Timeline slice
 * @returns {string} Single narration line
 */
export function narrateOneLine({ risingSign, slice }) {
  // Priority: Active retrograde → Strong house → Rising default

  // Check for retrogrades (most urgent)
  const retrogrades = slice?.planets?.filter(p => p.retrograde) || [];
  if (retrogrades.length >= 3) {
    return 'Multiple planets retrograde — a season of deep inner revision.';
  }

  // Check for very strong house
  if (slice?.houses) {
    const strongest = [...slice.houses].sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];
    if (strongest && strongest.strength >= 70) {
      return `The ${ordinal(strongest.house)} house blazes at ${strongest.strength}/100 — this is where life wants your attention.`;
    }
  }

  // Fall back to rising voice
  const rising = narrateRising(risingSign, slice);
  if (rising.length > 0) {
    return rising[0];
  }

  // Ultimate fallback
  return 'The Rose Window holds your story — step closer to read its petals.';
}
