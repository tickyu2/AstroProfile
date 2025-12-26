/**
 * Soul Confessional Service
 *
 * Handles API calls to the Soul Confessional endpoint.
 * Sends user's confession + chart context to receive compassionate AI response.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * Created: December 26, 2024
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Submit a confession to the Soul Confessional
 *
 * @param {Object} params - Confessional parameters
 * @param {Object} params.chart - User's birth chart data (SoulChart format)
 * @param {Object} params.context - User's confessional input
 * @param {string} params.context.text - The main confession text
 * @param {string|null} params.context.emotionalState - Current emotional state
 * @param {string|null} params.context.seeking - What they're seeking
 * @param {string|null} params.context.recentEvents - Recent life events
 * @param {string|null} params.context.intentions - Specific questions/intentions
 *
 * @returns {Promise<Object>} - { soulReply, highlights, gentlePractices }
 */
export async function submitConfessional({ chart, context }) {
  try {
    const functions = getFunctions();
    const confessionalFn = httpsCallable(functions, 'soulConfessional');

    const result = await confessionalFn({
      chart,
      context
    });

    return result.data;
  } catch (error) {
    console.error('Confessional submission failed:', error);
    throw new Error(error.message || 'The Cathedral could not receive your words. Please try again.');
  }
}

/**
 * Build a simplified chart summary for the confessional prompt
 * This reduces token usage while keeping essential information
 *
 * @param {Object} fullChart - Full chart data from profile
 * @returns {Object} - Simplified chart for confessional
 */
export function buildConfessionalChart(fullChart) {
  if (!fullChart) return null;

  // Extract key elements
  const simplified = {
    // Birth info
    birth: {
      date: fullChart.birthDate || fullChart.birth?.date,
      time: fullChart.birthTime || fullChart.birth?.time,
      location: fullChart.birthLocation || fullChart.birth?.location
    },

    // Rising sign
    rising: fullChart.rising || fullChart.ascendant ? {
      sign: fullChart.rising?.sign || fullChart.ascendant?.sign,
      degree: fullChart.rising?.degree || fullChart.ascendant?.degree
    } : null,

    // Sun/Moon/Rising summary
    bigThree: {
      sun: extractPlanetSummary(fullChart, 'Sun'),
      moon: extractPlanetSummary(fullChart, 'Moon'),
      rising: fullChart.rising?.sign || fullChart.ascendant?.sign
    },

    // Key planets (simplified)
    planets: fullChart.planets?.slice?.(0, 10)?.map(p => ({
      name: p.name,
      sign: p.sign,
      house: p.house,
      retrograde: p.retrograde
    })) || [],

    // House strengths (top 3)
    strongestHouses: fullChart.houses
      ?.slice?.()
      ?.sort((a, b) => (b.strength || 0) - (a.strength || 0))
      ?.slice(0, 3)
      ?.map(h => ({
        house: h.house,
        sign: h.sign,
        strength: h.strength
      })) || [],

    // Current life epoch if available
    currentEpoch: fullChart.epochs?.find(e =>
      e.startAge <= (fullChart.currentAge || 30) &&
      e.endAge > (fullChart.currentAge || 30)
    ) || null,

    // Enneagram if available
    enneagram: fullChart.enneagram ? {
      type: fullChart.enneagram.dominantType,
      wing: fullChart.enneagram.wing,
      instinct: fullChart.enneagram.instinctualVariant
    } : null
  };

  return simplified;
}

/**
 * Extract planet summary
 */
function extractPlanetSummary(chart, planetName) {
  const planet = chart.planets?.find(p =>
    p.name?.toLowerCase() === planetName.toLowerCase()
  );

  if (!planet) return null;

  return {
    sign: planet.sign,
    house: planet.house,
    retrograde: planet.retrograde
  };
}

/**
 * Format confessional context for display or logging
 */
export function formatConfessionalContext(context) {
  const parts = [];

  if (context.emotionalState) {
    parts.push(`Feeling: ${context.emotionalState}`);
  }

  if (context.seeking) {
    parts.push(`Seeking: ${context.seeking}`);
  }

  if (context.recentEvents) {
    parts.push(`Recent: ${context.recentEvents}`);
  }

  if (context.intentions) {
    parts.push(`Intentions: ${context.intentions}`);
  }

  return parts.join(' | ') || 'No additional context provided';
}
