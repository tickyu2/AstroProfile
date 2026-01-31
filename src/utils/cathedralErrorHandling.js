/**
 * cathedralErrorHandling.js
 * =========================
 *
 * Centralized error handling for Liz Greene Cathedral modules
 * Provides consistent error messages, fallbacks, and logging
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// ERROR TYPES
// =============================================================================

export class CathedralError extends Error {
  constructor(message, code, module, context = {}) {
    super(message);
    this.name = 'CathedralError';
    this.code = code;
    this.module = module;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class DataValidationError extends CathedralError {
  constructor(message, module, context = {}) {
    super(message, 'DATA_VALIDATION', module, context);
    this.name = 'DataValidationError';
  }
}

export class MissingDataError extends CathedralError {
  constructor(field, module, context = {}) {
    super(`Missing required data: ${field}`, 'MISSING_DATA', module, { field, ...context });
    this.name = 'MissingDataError';
    this.field = field;
  }
}

export class InvalidSignError extends CathedralError {
  constructor(sign, module) {
    super(`Invalid zodiac sign: ${sign}`, 'INVALID_SIGN', module, { sign });
    this.name = 'InvalidSignError';
    this.sign = sign;
  }
}

export class InvalidHouseError extends CathedralError {
  constructor(house, module) {
    super(`Invalid house number: ${house}. Must be 1-12.`, 'INVALID_HOUSE', module, { house });
    this.name = 'InvalidHouseError';
    this.house = house;
  }
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export const VALID_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const VALID_PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter',
  'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron',
  'North Node', 'South Node', 'Ascendant', 'Midheaven'
];

/**
 * Validate zodiac sign
 */
export function validateSign(sign, moduleName = 'Cathedral') {
  if (!sign) {
    throw new MissingDataError('zodiac sign', moduleName);
  }

  const normalizedSign = normalizeSign(sign);

  if (!VALID_SIGNS.includes(normalizedSign)) {
    throw new InvalidSignError(sign, moduleName);
  }

  return normalizedSign;
}

/**
 * Normalize sign name to standard format
 */
export function normalizeSign(sign) {
  if (!sign) return null;

  const signStr = String(sign).trim();
  const normalized = signStr.charAt(0).toUpperCase() + signStr.slice(1).toLowerCase();

  // Handle common variations
  const variations = {
    'Capricorn': ['Cap', 'Capri'],
    'Sagittarius': ['Sag', 'Sagg'],
    'Aquarius': ['Aqua'],
    'Scorpio': ['Scorp'],
    'Pisces': ['Pisc'],
    'Virgo': ['Virg'],
    'Gemini': ['Gem'],
    'Cancer': ['Canc'],
    'Taurus': ['Taur'],
    'Aries': ['Ari'],
    'Leo': ['Le'],
    'Libra': ['Lib']
  };

  for (const [fullName, abbrevs] of Object.entries(variations)) {
    if (abbrevs.some(a => normalized.startsWith(a))) {
      return fullName;
    }
  }

  return normalized;
}

/**
 * Validate house number
 */
export function validateHouse(house, moduleName = 'Cathedral') {
  if (house === null || house === undefined) {
    return null; // House is optional in many contexts
  }

  const houseNum = Number(house);

  if (isNaN(houseNum) || houseNum < 1 || houseNum > 12) {
    throw new InvalidHouseError(house, moduleName);
  }

  return houseNum;
}

/**
 * Validate chart data structure
 */
export function validateChartData(chartData, requiredFields = [], moduleName = 'Cathedral') {
  if (!chartData) {
    throw new DataValidationError('Chart data is null or undefined', moduleName);
  }

  if (typeof chartData !== 'object') {
    throw new DataValidationError('Chart data must be an object', moduleName, { type: typeof chartData });
  }

  const missing = [];

  requiredFields.forEach(field => {
    const value = getNestedValue(chartData, field);
    if (value === null || value === undefined) {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    throw new MissingDataError(missing.join(', '), moduleName, { missingFields: missing });
  }

  return true;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

/**
 * Validate date
 */
export function validateDate(dateInput, moduleName = 'Cathedral') {
  if (!dateInput) {
    return null;
  }

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new DataValidationError(`Invalid date: ${dateInput}`, moduleName, { dateInput });
  }

  return date;
}

/**
 * Validate aspect type
 */
export function validateAspectType(aspectType) {
  const validAspects = ['conjunction', 'opposition', 'square', 'trine', 'sextile', 'quincunx', 'semisextile', 'quintile'];
  const normalized = String(aspectType || '').toLowerCase().trim();

  if (!validAspects.includes(normalized)) {
    return 'conjunction'; // Default fallback
  }

  return normalized;
}

// =============================================================================
// SAFE EXECUTION WRAPPERS
// =============================================================================

/**
 * Wrap a function with error handling and fallback
 */
export function withErrorHandling(fn, fallbackValue, moduleName = 'Cathedral') {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      logError(error, moduleName, { args: args.slice(0, 3) }); // Only log first 3 args to avoid huge logs

      if (typeof fallbackValue === 'function') {
        return fallbackValue(error, args);
      }

      return fallbackValue;
    }
  };
}

/**
 * Safe property access with fallback
 */
export function safeGet(obj, path, fallback = null) {
  try {
    const value = getNestedValue(obj, path);
    return value !== null && value !== undefined ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safe function execution
 */
export function safeExecute(fn, fallback = null, context = {}) {
  try {
    const result = fn();
    return result !== undefined ? result : fallback;
  } catch (error) {
    logError(error, context.module || 'Cathedral', context);
    return fallback;
  }
}

// =============================================================================
// ERROR LOGGING
// =============================================================================

const errorLog = [];
const MAX_ERROR_LOG = 100;

/**
 * Log an error with context
 */
export function logError(error, moduleName = 'Cathedral', context = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    module: moduleName,
    error: {
      name: error.name || 'Error',
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
    },
    context
  };

  // Add to internal log
  errorLog.push(logEntry);

  // Trim log if too long
  if (errorLog.length > MAX_ERROR_LOG) {
    errorLog.shift();
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${moduleName}] Error:`, error.message, context);
  }

  return logEntry;
}

/**
 * Get recent errors
 */
export function getRecentErrors(count = 10) {
  return errorLog.slice(-count);
}

/**
 * Clear error log
 */
export function clearErrorLog() {
  errorLog.length = 0;
}

// =============================================================================
// FALLBACK DATA GENERATORS
// =============================================================================

/**
 * Generate fallback Saturn data
 */
export function getFallbackSaturnData(partialData = {}) {
  return {
    sign: partialData.sign || 'Capricorn',
    house: partialData.house || 10,
    degree: partialData.degree || 15,
    isRetrograde: partialData.isRetrograde || false,
    _isFallback: true
  };
}

/**
 * Generate fallback fate thread
 */
export function getFallbackFateThread(planet = 'Sun') {
  return {
    planet,
    sign: null,
    threadType: 'Unknown',
    fateThread: 'Unable to determine fate thread without planetary data.',
    myth: 'The Seeker',
    challenge: 'Finding your path',
    gift: 'The journey itself',
    _isFallback: true
  };
}

/**
 * Generate fallback healing guidance
 */
export function getFallbackHealingGuidance() {
  return {
    woundAnalysis: {
      primaryWounds: [{
        wound: 'General Relationship Maintenance',
        description: 'Normal challenges of relating',
        lunaHealing: 'Every relationship requires attention and care.'
      }],
      secondaryWounds: [],
      rootPatterns: []
    },
    lunaGuidance: {
      general: 'Relationships are teachers. Stay curious about what this one is teaching you.'
    },
    _isFallback: true
  };
}

// =============================================================================
// RESULT WRAPPERS
// =============================================================================

/**
 * Wrap result with metadata
 */
export function wrapResult(result, moduleName, options = {}) {
  return {
    success: true,
    data: result,
    metadata: {
      module: moduleName,
      generatedAt: new Date().toISOString(),
      version: options.version || '1.0.0',
      ...options.metadata
    }
  };
}

/**
 * Wrap error as result
 */
export function wrapError(error, moduleName, fallbackData = null) {
  return {
    success: false,
    error: {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      module: moduleName
    },
    data: fallbackData,
    metadata: {
      module: moduleName,
      generatedAt: new Date().toISOString(),
      hasFallback: fallbackData !== null
    }
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Error classes
  CathedralError,
  DataValidationError,
  MissingDataError,
  InvalidSignError,
  InvalidHouseError,

  // Validation
  validateSign,
  validateHouse,
  validateChartData,
  validateDate,
  validateAspectType,
  normalizeSign,
  VALID_SIGNS,
  VALID_PLANETS,

  // Safe execution
  withErrorHandling,
  safeGet,
  safeExecute,

  // Logging
  logError,
  getRecentErrors,
  clearErrorLog,

  // Fallbacks
  getFallbackSaturnData,
  getFallbackFateThread,
  getFallbackHealingGuidance,

  // Result wrappers
  wrapResult,
  wrapError
};
