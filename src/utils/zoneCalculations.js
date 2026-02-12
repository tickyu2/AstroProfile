// Generic zone calculation utilities
// Replaces 12 individual [sign]ZoneCalculations.js files

import { SIGN_CONFIGS } from './zoneSignConfigs';

/**
 * Get the zone for a given degree within a sign
 * @param {Array} zones - Zone data array for the sign
 * @param {number} degree - Degree within sign (0-29.99)
 * @returns {object|null} Zone object or null if invalid
 */
export function getZoneFromDegree(zones, degree) {
  if (degree < 0 || degree >= 30) return null;
  return zones.find(z => degree >= z.degreeRange.start && degree <= z.degreeRange.end);
}

/**
 * Calculate absolute ecliptic position
 * @param {string} sign - Zodiac sign name
 * @param {number} degree - Degree within sign (0-29.99)
 * @returns {number} Absolute ecliptic longitude (0-359.99)
 */
export function getAbsoluteEclipticPosition(sign, degree) {
  return SIGN_CONFIGS[sign].eclipticOffset + degree;
}

/**
 * Get decan for a given degree
 * @param {string} sign - Zodiac sign name
 * @param {number} degree - Degree within sign (0-29.99)
 * @returns {object} Decan information
 */
export function getDecanFromDegree(sign, degree) {
  const config = SIGN_CONFIGS[sign];
  const decanIndex = degree < 10 ? 0 : degree < 20 ? 1 : 2;
  const decan = config.decans[decanIndex];
  return {
    number: decanIndex + 1,
    name: ['First Decan', 'Second Decan', 'Third Decan'][decanIndex],
    ruler: decan.ruler,
    subRuler: decan.subRuler,
    quality: decan.quality,
  };
}

/**
 * Calculate cusp influence percentages
 * @param {string} sign - Zodiac sign name
 * @param {number} degree - Degree within sign (0-29.99)
 * @returns {object} Influence breakdown with previous, self, and next sign percentages
 */
export function getCuspInfluences(sign, degree) {
  const config = SIGN_CONFIGS[sign];
  const prev = config.previous.toLowerCase();
  const self = sign.toLowerCase();
  const next = config.next.toLowerCase();

  const influences = { [prev]: 0, [self]: 100, [next]: 0 };

  if (degree < 5) {
    const prevInfluence = Math.round((5 - degree) / 5 * 25);
    influences[prev] = prevInfluence;
    influences[self] = 100 - prevInfluence;
  }

  if (degree >= 25) {
    const nextInfluence = Math.round((degree - 25) / 5 * 25);
    influences[next] = nextInfluence;
    influences[self] = 100 - nextInfluence;
  }

  return influences;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Get approximate birth date range for a degree
 * @param {string} sign - Zodiac sign name
 * @param {number} degree - Degree within sign (0-29.99)
 * @returns {object} Date range information
 */
export function getDateRangeForDegree(sign, degree) {
  const { seasonStart } = SIGN_CONFIGS[sign];
  const startDate = new Date(2024, seasonStart.month, seasonStart.day);
  const birthDate = new Date(startDate);
  birthDate.setDate(startDate.getDate() + Math.floor(degree));

  return {
    month: MONTH_NAMES[birthDate.getMonth()],
    day: birthDate.getDate(),
    formattedDate: `${MONTH_NAMES[birthDate.getMonth()]} ${birthDate.getDate()}`,
    approximateDate: `${MONTH_NAMES[birthDate.getMonth()]} ${birthDate.getDate()}`,
    dayOfSeason: Math.floor(degree) + 1,
  };
}

/**
 * Compare quality levels across zones
 * @param {Array} zones - Zone data array
 * @param {string} qualityId - Quality to compare
 * @returns {object} Comparison data
 */
export function compareQualityAcrossZones(zones, qualityId) {
  const levels = zones.map(zone => zone.qualities[qualityId].level);
  const max = Math.max(...levels);
  const min = Math.min(...levels);
  const range = max - min;
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;

  const qualityName = qualityId.replace(/([A-Z])/g, ' $1').toLowerCase().trim();

  let interpretation;
  if (range < 20) interpretation = `${qualityName} is relatively consistent across these zones (${range}% range)`;
  else if (range < 40) interpretation = `Moderate variation in ${qualityName}: ${range}% difference between highest and lowest`;
  else if (range < 60) interpretation = `Significant ${qualityName} difference: ${range}% range shows distinct behavioral patterns`;
  else interpretation = `Dramatic ${qualityName} contrast: ${range}% spread reveals fundamentally different expressions`;

  return {
    qualityId, range, max, min,
    avg: Math.round(avg),
    maxZone: zones.find(z => z.qualities[qualityId].level === max),
    minZone: zones.find(z => z.qualities[qualityId].level === min),
    interpretation,
  };
}

/**
 * Generate personalized suggestion for a zone
 */
function generateSuggestion(sign, zone, degree, cuspInfluences) {
  const config = SIGN_CONFIGS[sign];
  const prev = config.previous.toLowerCase();
  const next = config.next.toLowerCase();
  let suggestion = `You're in Zone ${zone.id}: ${zone.name}. `;

  if (cuspInfluences[prev] > 15) {
    suggestion += `With ${cuspInfluences[prev]}% ${config.previous} influence, you're ${config.cuspText.previous}. `;
  }
  if (cuspInfluences[next] > 15) {
    suggestion += `With ${cuspInfluences[next]}% ${config.next} influence, you're ${config.cuspText.next}. `;
  }

  if (config.zoneSuggestions[zone.id]) {
    suggestion += config.zoneSuggestions[zone.id];
  }

  return suggestion;
}

/**
 * Get personalized zone info with suggestions
 * @param {string} sign - Zodiac sign name
 * @param {Array} zones - Zone data array for the sign
 * @param {number} userDegree - User's degree within the sign
 * @returns {object|null} Zone info with personalized suggestions
 */
export function getUserZoneInfo(sign, zones, userDegree) {
  const zone = getZoneFromDegree(zones, userDegree);
  if (!zone) return null;

  const cuspInfluences = getCuspInfluences(sign, userDegree);
  const decan = getDecanFromDegree(sign, userDegree);
  const dateInfo = getDateRangeForDegree(sign, userDegree);
  const suggestion = generateSuggestion(sign, zone, userDegree, cuspInfluences);

  return {
    zone,
    degree: userDegree,
    absolutePosition: getAbsoluteEclipticPosition(sign, userDegree),
    dateInfo,
    decan,
    cuspInfluences,
    suggestion,
    suggestions: [suggestion],
  };
}
