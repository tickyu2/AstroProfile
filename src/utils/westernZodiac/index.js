/**
 * Western Zodiac Utilities Index
 * Father Ticky's 6-6 Cusp Model
 *
 * Exports all Western Zodiac calculation utilities
 */

// Cusp Calculator
export {
  getCuspFromDate,
  getCuspDataFromDate,
  getCuspById,
  getAllCusps,
  getCuspTypeDescription,
  getElementColors,
  getCuspDisplayName,
  getSignEmoji
} from './cuspCalculator.js';

// Compatibility Engine
export {
  calculateCompatibility,
  getCompatibilityLevel,
  getCompatibleCusps,
  getDetailedCompatibility,
  getCompatibilityColors
} from './westernZodiacCompatibility.js';
