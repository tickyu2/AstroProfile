/**
 * Soul Garden Theme Constants
 *
 * Golden Ratio (φ = 1.618) based design system for the Rose Window.
 * All radii, timings, and proportions derive from φ.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

// Golden Ratio
export const PHI = 1.61803398875;
export const PHI_SQ = PHI * PHI; // 2.618
export const PHI_INV = 1 / PHI;  // 0.618

// Base radii anchored to golden ratio
export const ROSE_BASE_RADIUS = 14;                      // inner
export const ROSE_MID_RADIUS = ROSE_BASE_RADIUS * PHI;   // 22.65
export const ROSE_OUTER_RADIUS = ROSE_BASE_RADIUS * PHI_SQ; // 36.65
export const ROSE_PORTAL_OFFSET = 4;                     // 8th house halo

// Element colors (GENESIS palette)
export const ELEMENT_COLORS = {
  Fire: '#f97316',   // Orange
  Earth: '#22c55e',  // Green
  Air: '#38bdf8',    // Sky blue
  Water: '#6366f1'   // Indigo
};

// Gradient fill IDs for petals (must match defs in SVG)
export const ELEMENT_GRADIENT_IDS = {
  Fire: 'petalGradFire',
  Earth: 'petalGradEarth',
  Air: 'petalGradAir',
  Water: 'petalGradWater'
};

// House colors for special houses
export const HOUSE_COLORS = {
  angular: '#34d399',    // Emerald for 1,4,7,10
  eighth: '#a855f7',     // Purple for 8th (transformation)
  ninth: '#fbbf24',      // Gold for 9th (philosophy)
  default: '#a78bfa'     // Light purple
};

/**
 * Get element for a zodiac sign
 */
export function getElementForSign(sign) {
  const signLower = (sign || '').toLowerCase();

  // Fire signs
  if (['aries', 'leo', 'sagittarius'].includes(signLower)) return 'Fire';

  // Earth signs
  if (['taurus', 'virgo', 'capricorn'].includes(signLower)) return 'Earth';

  // Air signs
  if (['gemini', 'libra', 'aquarius'].includes(signLower)) return 'Air';

  // Water signs
  if (['cancer', 'scorpio', 'pisces'].includes(signLower)) return 'Water';

  return 'Air'; // Default
}

/**
 * Get modality for a zodiac sign (Cardinal, Fixed, Mutable)
 */
export function getModalityForSign(sign) {
  const signLower = (sign || '').toLowerCase();

  // Cardinal (initiating)
  if (['aries', 'cancer', 'libra', 'capricorn'].includes(signLower)) return 'Cardinal';

  // Fixed (stabilizing)
  if (['taurus', 'leo', 'scorpio', 'aquarius'].includes(signLower)) return 'Fixed';

  // Mutable (adapting)
  if (['gemini', 'virgo', 'sagittarius', 'pisces'].includes(signLower)) return 'Mutable';

  return 'Mutable'; // Default
}

// Angular houses (cardinal points - most powerful)
export const ANGULAR_HOUSES = [1, 4, 7, 10];

// Succedent houses (resources)
export const SUCCEDENT_HOUSES = [2, 5, 8, 11];

// Cadent houses (learning/transition)
export const CADENT_HOUSES = [3, 6, 9, 12];

// Special houses
export const EIGHTH_HOUSE = 8;  // Transformation portal
export const NINTH_HOUSE = 9;   // Philosophy, golden meaning

/**
 * Check if a house is angular
 */
export function isAngularHouse(house) {
  return ANGULAR_HOUSES.includes(house);
}

/**
 * Get house type classification
 */
export function getHouseType(house) {
  if (ANGULAR_HOUSES.includes(house)) return 'angular';
  if (SUCCEDENT_HOUSES.includes(house)) return 'succedent';
  if (CADENT_HOUSES.includes(house)) return 'cadent';
  return 'cadent';
}

// Animation timing based on φ
export const ANIMATION_TIMINGS = {
  breath: 13,           // Soul breath cycle (seconds)
  vineGrow: 0.8,        // Vine growth duration
  petalUnfurl: 1,       // Petal opening duration
  eighthPulse: 9.618,   // 8th house special rhythm (9 + φ/10)
  goldenShimmer: 4.236, // Golden shimmer (φ² + φ)
  softGlow: 6.18,       // Soft glow pulse
  haloPulse: 8          // Sacred halo pulse
};

// Petal stagger delay formula
export function getPetalDelay(index) {
  return (index * 0.12 * PHI).toFixed(3);
}
