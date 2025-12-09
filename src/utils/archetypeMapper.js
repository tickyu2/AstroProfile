/**
 * ============================================
 * ARCHETYPE MAPPER
 * Maps BaZi element data to personality archetypes
 * ============================================
 */

import { PERSONALITY_ARCHETYPES } from '../data/personalityArchetypes';

/**
 * Element mapping for archetype IDs
 * Structure: [dominantElement][secondaryElement] = archetypeId
 */
const ARCHETYPE_MAP = {
  Wood: {
    null: 1,      // The Tree (pure Wood)
    Fire: 2,      // The Burning Forest
    Earth: 3,     // The Rooted Mountain
    Metal: 4,     // The Bamboo
    Water: 5      // The Willow
  },
  Fire: {
    null: 6,      // The Flame (pure Fire)
    Wood: 7,      // The Campfire
    Earth: 8,     // The Volcano
    Metal: 9,     // The Forge
    Water: 10     // The Steam
  },
  Earth: {
    null: 11,     // The Mountain (pure Earth)
    Wood: 12,     // The Garden
    Fire: 13,     // The Kiln
    Metal: 14,    // The Ore
    Water: 15     // The Clay
  },
  Metal: {
    null: 16,     // The Blade (pure Metal)
    Wood: 17,     // The Autumn Leaves
    Fire: 18,     // The Tempered Steel
    Earth: 19,    // The Jewel
    Water: 20     // The Mirror Lake
  },
  Water: {
    null: 21,     // The River (pure Water)
    Wood: 22,     // The Spring
    Fire: 23,     // The Mist
    Earth: 24,    // The Well
    Metal: 25     // The Ice
  }
};

/**
 * Determine personality archetype from elemental balance
 *
 * @param {Object} elementData - Element percentages from BaZi
 * @param {Object} tenGodsData - Optional Ten Gods data for refinement
 * @returns {Object} Archetype object with full details
 */
export function determineArchetype(elementData, tenGodsData = null) {
  if (!elementData || !elementData.elements) {
    console.error('[archetypeMapper] Invalid element data:', elementData);
    return null;
  }

  const elements = elementData.elements;

  // Convert to array and sort by percentage (highest first)
  const sortedElements = Object.entries(elements)
    .map(([element, value]) => ({
      element,
      percentage: value
    }))
    .sort((a, b) => b.percentage - a.percentage);

  console.log('[archetypeMapper] Sorted elements:', sortedElements);

  // Get dominant element (highest percentage)
  const dominant = sortedElements[0];

  // Determine secondary element
  // If dominant is > 50%, it's a pure archetype (no secondary)
  // Otherwise, use second highest element
  let secondary = null;

  if (dominant.percentage <= 50 && sortedElements.length > 1) {
    const secondHighest = sortedElements[1];

    // Only use as secondary if it's at least 15% and within 30% of dominant
    const percentageDiff = dominant.percentage - secondHighest.percentage;
    if (secondHighest.percentage >= 15 && percentageDiff <= 30) {
      secondary = secondHighest.element;
    }
  }

  console.log('[archetypeMapper] Dominant:', dominant.element, '|', 'Secondary:', secondary);

  // Look up archetype ID
  const archetypeId = ARCHETYPE_MAP[dominant.element]?.[secondary];

  if (!archetypeId) {
    console.error('[archetypeMapper] No archetype found for:', dominant.element, secondary);
    // Fallback to pure element
    const fallbackId = ARCHETYPE_MAP[dominant.element]?.[null];
    return PERSONALITY_ARCHETYPES[fallbackId];
  }

  const archetype = PERSONALITY_ARCHETYPES[archetypeId];

  console.log('[archetypeMapper] Determined archetype:', archetype?.name);

  return archetype;
}

/**
 * Get element percentage data from fourPillars
 *
 * @param {Object} fourPillars - Four Pillars calculation result
 * @returns {Object} Element data formatted for archetype mapping
 */
export function getElementDataFromFourPillars(fourPillars) {
  if (!fourPillars || !fourPillars.elementalBalance) {
    console.error('[archetypeMapper] Invalid fourPillars data');
    return null;
  }

  const elementalBalance = fourPillars.elementalBalance;

  // Check for elements object (base + hidden combined)
  if (elementalBalance.elements) {
    return {
      elements: elementalBalance.elements,
      total: elementalBalance.total || 0
    };
  }

  // Fallback: if we only have base/visible and hidden separately, combine them
  if (elementalBalance.base && elementalBalance.hidden) {
    const combined = {};
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

    elements.forEach(element => {
      const base = elementalBalance.base[element] || 0;
      const hidden = elementalBalance.hidden[element] || 0;
      combined[element] = base + hidden;
    });

    const total = Object.values(combined).reduce((sum, val) => sum + val, 0);

    // Convert to percentages
    const percentages = {};
    elements.forEach(element => {
      percentages[element] = total > 0 ? (combined[element] / total) * 100 : 0;
    });

    return {
      elements: percentages,
      total
    };
  }

  console.error('[archetypeMapper] Could not extract element data from fourPillars');
  return null;
}

/**
 * Determine archetype directly from fourPillars data
 *
 * @param {Object} fourPillars - Four Pillars calculation result
 * @param {Object} tenGodsData - Optional Ten Gods data
 * @returns {Object} Archetype object
 */
export function determineArchetypeFromFourPillars(fourPillars, tenGodsData = null) {
  const elementData = getElementDataFromFourPillars(fourPillars);

  if (!elementData) {
    return null;
  }

  return determineArchetype(elementData, tenGodsData);
}
