/**
 * Rising Sign Configuration Map
 *
 * Per-sign tuning for the Rose Window visualization.
 * Each rising sign adjusts geometry, color, motion, and ornaments.
 *
 * Configuration areas:
 *   - geometry: petal spread, radius scaling
 *   - color: element boost multipliers
 *   - motion: animation duration, timing curves, special effects
 *   - ornament: tracery style, cross brightness
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { PHI, ROSE_BASE_RADIUS, ROSE_MID_RADIUS, ROSE_OUTER_RADIUS } from './theme';

export const RISING_CONFIG = {
  // ═══════════════════════════════════════════
  // FIRE SIGNS
  // ═══════════════════════════════════════════

  Aries: {
    key: 'Aries',
    element: 'Fire',
    geometry: {
      petalSpreadFactor: 0.9,      // Narrower (spearhead)
      outerRadiusScale: 1.03,      // Slightly extended reach
      innerRadiusScale: 1.0
    },
    color: {
      fireBoost: 1.15,
      goldBoost: 1.05
    },
    motion: {
      petalDuration: 0.85,         // Faster, more impulsive
      petalCurve: 'cubic-bezier(0.34, 1.56, 0.64, 1.05)'
    },
    ornament: {
      crossBrightness: 1.2,
      traceryStyle: 'flame'
    },
    description: 'The Ram bursts forth — petals narrow like spears of initiative'
  },

  Leo: {
    key: 'Leo',
    element: 'Fire',
    geometry: {
      petalSpreadFactor: 1.05,     // Fuller, more regal
      outerRadiusScale: 1.02,
      innerRadiusScale: 1.02       // Larger inner radius (crown)
    },
    color: {
      fireBoost: 1.1,
      goldBoost: 1.2               // More gold (royal)
    },
    motion: {
      petalDuration: 1.1,          // Slower, more majestic
      petalCurve: 'ease-in-out'
    },
    ornament: {
      crossBrightness: 1.1,
      traceryStyle: 'crown'
    },
    description: 'The Lion radiates — petals crown the center with solar gold'
  },

  Sagittarius: {
    key: 'Sagittarius',
    element: 'Fire',
    geometry: {
      petalSpreadFactor: 1.1,      // Compass / outward reaching
      outerRadiusScale: 1.05,      // Extended vision
      innerRadiusScale: 1.0
    },
    color: {
      fireBoost: 1.1,
      airBoost: 1.05               // Touch of air (philosophy)
    },
    motion: {
      petalDuration: 1.0,
      petalCurve: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      spiralStagger: true          // Petals unfurl in spiral
    },
    ornament: {
      crossBrightness: 1.0,
      traceryStyle: 'compass'
    },
    description: 'The Archer aims outward — petals spiral toward distant horizons'
  },

  // ═══════════════════════════════════════════
  // EARTH SIGNS
  // ═══════════════════════════════════════════

  Taurus: {
    key: 'Taurus',
    element: 'Earth',
    geometry: {
      petalSpreadFactor: 1.08,     // Rounder, fuller (sensual)
      outerRadiusScale: 1.0,
      innerRadiusScale: 1.02       // Grounded center
    },
    color: {
      earthBoost: 1.15
    },
    motion: {
      petalDuration: 1.2,          // Slow, steady, patient
      petalCurve: 'ease-out'
    },
    ornament: {
      traceryStyle: 'vine'
    },
    description: 'The Bull stands firm — petals bloom with patient abundance'
  },

  Virgo: {
    key: 'Virgo',
    element: 'Earth',
    geometry: {
      petalSpreadFactor: 1.0,      // Precise, balanced
      outerRadiusScale: 1.0,
      innerRadiusScale: 1.0
    },
    color: {
      earthBoost: 1.1,
      goldBoost: 1.05              // Touch of gold (harvest)
    },
    motion: {
      petalDuration: 1.0,
      petalCurve: 'ease-out'
    },
    ornament: {
      traceryStyle: 'lattice'      // Organized, structured
    },
    description: 'The Maiden refines — petals align with careful precision'
  },

  Capricorn: {
    key: 'Capricorn',
    element: 'Earth',
    geometry: {
      petalSpreadFactor: 0.95,     // More compact (disciplined)
      outerRadiusScale: 0.97,      // Contained ambition
      innerRadiusScale: 1.0
    },
    color: {
      earthBoost: 1.05,
      slateBoost: 1.1              // Darker, more serious tones
    },
    motion: {
      petalDuration: 1.3,          // Slowest, most deliberate
      petalCurve: 'ease-in-out'
    },
    ornament: {
      traceryStyle: 'stone'        // Mountain-like solidity
    },
    description: 'The Goat climbs — petals stack like stones toward the peak'
  },

  // ═══════════════════════════════════════════
  // AIR SIGNS
  // ═══════════════════════════════════════════

  Gemini: {
    key: 'Gemini',
    element: 'Air',
    geometry: {
      petalSpreadFactor: 1.05,
      outerRadiusScale: 1.0,
      innerRadiusScale: 1.0
    },
    color: {
      airBoost: 1.15
    },
    motion: {
      petalDuration: 0.9,          // Quick, mercurial
      petalCurve: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      flutter: true                // Dual flutter effect
    },
    ornament: {
      traceryStyle: 'feather'
    },
    description: 'The Twins converse — petals flutter with quick exchange'
  },

  Libra: {
    key: 'Libra',
    element: 'Air',
    geometry: {
      petalSpreadFactor: 1.0,      // Perfect balance
      outerRadiusScale: 1.0,
      innerRadiusScale: 1.0
    },
    color: {
      airBoost: 1.1,
      violetBoost: 1.1             // Venus tones
    },
    motion: {
      petalDuration: 1.0,
      petalCurve: 'ease-in-out'    // Harmonious timing
    },
    ornament: {
      traceryStyle: 'balanced'     // Symmetrical ornaments
    },
    description: 'The Scales weigh — petals balance in perfect symmetry'
  },

  Aquarius: {
    key: 'Aquarius',
    element: 'Air',
    geometry: {
      petalSpreadFactor: 1.02,
      outerRadiusScale: 1.02,      // Slightly unconventional
      innerRadiusScale: 1.0
    },
    color: {
      airBoost: 1.2                // Enhanced air (electric)
    },
    motion: {
      petalDuration: 0.95,
      petalCurve: 'cubic-bezier(0.25, 0.9, 0.5, 1.2)',
      electric: true               // Electric pulse effect
    },
    ornament: {
      traceryStyle: 'electric'
    },
    description: 'The Water-Bearer innovates — petals pulse with electric vision'
  },

  // ═══════════════════════════════════════════
  // WATER SIGNS
  // ═══════════════════════════════════════════

  Cancer: {
    key: 'Cancer',
    element: 'Water',
    geometry: {
      petalSpreadFactor: 1.02,
      outerRadiusScale: 1.0,
      innerRadiusScale: 1.03       // Deeper center (protective shell)
    },
    color: {
      waterBoost: 1.15
    },
    motion: {
      petalDuration: 1.15,
      petalCurve: 'ease-in-out',
      wave: true                   // Lunar tidal wave
    },
    ornament: {
      traceryStyle: 'tidal'
    },
    description: 'The Crab protects — petals ebb and flow with lunar tides'
  },

  Scorpio: {
    key: 'Scorpio',
    element: 'Water',
    geometry: {
      petalSpreadFactor: 0.98,     // Slightly tighter (intensity)
      outerRadiusScale: 0.98,
      innerRadiusScale: 1.0
    },
    color: {
      waterBoost: 1.15,
      deepBoost: 1.1               // Deeper, more intense
    },
    motion: {
      petalDuration: 1.25,         // Slow, deliberate, piercing
      petalCurve: 'ease-in-out',
      emphasize8th: true           // Special 8th house emphasis
    },
    ornament: {
      traceryStyle: 'abyssal'
    },
    description: 'The Scorpion delves — petals pulse from hidden depths'
  },

  Pisces: {
    key: 'Pisces',
    element: 'Water',
    geometry: {
      petalSpreadFactor: 1.1,      // Softer, more diffuse (dreamlike)
      outerRadiusScale: 1.0,
      innerRadiusScale: 1.0
    },
    color: {
      waterBoost: 1.1,
      mistBoost: 1.1               // Misty, ethereal
    },
    motion: {
      petalDuration: 1.1,
      petalCurve: 'ease-in-out',
      drift: true                  // Gentle drift effect
    },
    ornament: {
      traceryStyle: 'dream'
    },
    description: 'The Fish dissolves — petals drift in oceanic mystery'
  }
};

/**
 * Get configuration for a rising sign
 * @param {string} risingSign - The rising sign name (e.g., "Aries", "Leo")
 * @returns {Object|null} Configuration object or null if not found
 */
export function getRisingConfig(risingSign) {
  if (!risingSign) return null;

  // Normalize the sign name (capitalize first letter)
  const normalized = risingSign.charAt(0).toUpperCase() + risingSign.slice(1).toLowerCase();
  return RISING_CONFIG[normalized] || null;
}

/**
 * Get all rising signs for a given element
 * @param {string} element - "Fire", "Earth", "Air", or "Water"
 * @returns {string[]} Array of sign keys
 */
export function getSignsByElement(element) {
  return Object.values(RISING_CONFIG)
    .filter(config => config.element === element)
    .map(config => config.key);
}

/**
 * Get the element for a given sign
 * @param {string} sign - Sign name
 * @returns {string} Element name
 */
export function getSignElement(sign) {
  const config = getRisingConfig(sign);
  return config?.element || 'Air';
}
