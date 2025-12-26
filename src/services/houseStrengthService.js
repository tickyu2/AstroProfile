/**
 * House Strength Timeline Service
 *
 * Frontend service for calling the Soul Garden / What-If Analysis engine.
 * Computes house strengths across a 24-hour period for birth time exploration.
 *
 * Part of GENESIS OS - Soul Garden Playground
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

/**
 * Fetch 24-hour house strength timeline
 *
 * @param {Object} params - Birth data parameters
 * @param {string} params.birthDate - Birth date in 'YYYY-MM-DD' format
 * @param {number} params.latitude - Birth location latitude
 * @param {number} params.longitude - Birth location longitude
 * @param {number} params.timezone - Timezone offset in hours (e.g., -8 for PST, 1 for CET)
 * @returns {Promise<Object>} - Timeline data with 96 time slices
 */
export async function fetchHouseStrengthTimeline({ birthDate, latitude, longitude, timezone = 0 }) {
  const fn = httpsCallable(functions, 'getHouseStrengthTimeline');
  const res = await fn({ birthDate, latitude, longitude, timezone });

  if (!res.data?.success) {
    throw new Error(res.data?.error || 'Failed to get house strength timeline');
  }

  return res.data;
}

/**
 * Find the optimal birth time for a specific house
 *
 * @param {Array} timeline - Array of time slices from fetchHouseStrengthTimeline
 * @param {number} houseNum - House number to optimize (1-12)
 * @returns {Object} - { timeLabel, strength, slice }
 */
export function findOptimalTimeForHouse(timeline, houseNum) {
  if (!timeline || !timeline.length) return null;

  let best = null;
  let maxStrength = -1;

  for (const slice of timeline) {
    const house = slice.houses.find(h => h.house === houseNum);
    if (house && house.strength > maxStrength) {
      maxStrength = house.strength;
      best = {
        timeLabel: slice.timeLabel,
        strength: house.strength,
        slice
      };
    }
  }

  return best;
}

/**
 * Get house strength summary statistics
 *
 * @param {Array} timeline - Array of time slices
 * @param {number} houseNum - House number (1-12)
 * @returns {Object} - { min, max, avg, range }
 */
export function getHouseStatistics(timeline, houseNum) {
  if (!timeline || !timeline.length) return null;

  const strengths = timeline.map(slice => {
    const house = slice.houses.find(h => h.house === houseNum);
    return house?.strength || 0;
  });

  const min = Math.min(...strengths);
  const max = Math.max(...strengths);
  const avg = Math.round(strengths.reduce((a, b) => a + b, 0) / strengths.length);

  return { min, max, avg, range: max - min };
}

export default {
  fetchHouseStrengthTimeline,
  findOptimalTimeForHouse,
  getHouseStatistics
};
