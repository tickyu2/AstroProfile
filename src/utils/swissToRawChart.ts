/**
 * swissToRawChart.ts
 *
 * Adapter to convert GENESIS Swiss Ephemeris output to RawChart format
 * for the 16-axis archetype derivation pipeline.
 *
 * Swiss output format (from swissEphemerisService.js):
 * - planets: { sun: {...}, moon: {...}, ... } - keyed by lowercase name
 * - houses.houses: SwissHouse[] - 12 houses with cusps
 * - houses.angles.ascendant: { sign, longitude, ... }
 */

import type {
  ZodiacSign,
  PlanetName,
  PlanetPosition,
  HouseCusps,
  RawChart,
  AspectPatternResult,
} from '../types/western.types';

// =============================================================================
// SWISS CHART TYPES
// =============================================================================

export interface SwissPlanet {
  planet: string;
  planetKey: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  isRetrograde: boolean;
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
  element: string;
  modality: string;
  formatted: string;
}

export interface SwissHouse {
  house: number;
  cusp: number;
  sign: string;
  degree: number;
  minute: number;
  planets: Array<{
    name: string;
    key: string;
    longitude: number;
    sign: string;
    degree: number;
    isRetrograde: boolean;
  }>;
}

export interface SwissAngles {
  ascendant: { longitude: number; sign: string; degree: number; minute: number };
  midheaven: { longitude: number; sign: string; degree: number; minute: number };
  descendant: { longitude: number; sign: string; degree: number; minute: number };
  imumCoeli: { longitude: number; sign: string; degree: number; minute: number };
}

export interface SwissChart {
  meta: {
    calculationEngine: string;
    precision: string;
    julianDay: number;
    utcHour: number;
    localTime: string;
    timezone: number;
    coordinates: { latitude: number; longitude: number };
    houseSystem: string;
  };
  planets: Record<string, SwissPlanet>;
  houses: {
    houses: SwissHouse[];
    angles: SwissAngles;
  };
  elements: { Fire: number; Earth: number; Air: number; Water: number };
  modalities: { Cardinal: number; Fixed: number; Mutable: number };
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ASPECT_ANGLES: Record<string, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60,
  quincunx: 150,
  'semi-sextile': 30,
  'semi-square': 45,
  sesquiquadrate: 135,
};

const ASPECT_ORBS: Record<string, number> = {
  conjunction: 10,
  opposition: 10,
  trine: 8,
  square: 8,
  sextile: 6,
  quincunx: 3,
  'semi-sextile': 3,
  'semi-square': 3,
  sesquiquadrate: 3,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function isValidSign(sign: string): sign is ZodiacSign {
  return ZODIAC_SIGNS.includes(sign as ZodiacSign);
}

const VALID_PLANET_NAMES: PlanetName[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'Ascendant', 'Midheaven', 'North Node', 'Chiron', 'Lilith',
];

function normalizePlanetName(name: string): PlanetName {
  // Try exact match first
  const exactMatch = VALID_PLANET_NAMES.find(
    p => p.toLowerCase() === name.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Handle common variations
  const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  if (VALID_PLANET_NAMES.includes(normalized as PlanetName)) {
    return normalized as PlanetName;
  }

  // Special cases
  if (name.toLowerCase() === 'mc') return 'Midheaven';
  if (name.toLowerCase() === 'asc') return 'Ascendant';
  if (name.toLowerCase().includes('node')) return 'North Node';

  // Default: cast (may fail if truly invalid)
  return normalized as PlanetName;
}

/**
 * Find house number for a given longitude.
 */
function findHouseForLongitude(longitude: number, houseCusps: number[]): number {
  if (houseCusps.length < 12) return 1;

  const normLon = ((longitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const start = houseCusps[i];
    const end = houseCusps[(i + 1) % 12];

    if (start <= end) {
      if (normLon >= start && normLon < end) return i + 1;
    } else {
      // Wrap around 360°
      if (normLon >= start || normLon < end) return i + 1;
    }
  }

  return 1;
}

/**
 * Extract cusp longitudes from Swiss house array.
 */
function extractHouseCusps(swissHouses: SwissHouse[]): number[] {
  if (!swissHouses || swissHouses.length === 0) {
    return Array.from({ length: 12 }, (_, i) => i * 30);
  }

  const sorted = [...swissHouses].sort((a, b) => a.house - b.house);
  return sorted.map((h, i) => h.cusp ?? i * 30);
}

/**
 * Calculate shortest angular difference.
 */
function calculateAngleDifference(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// =============================================================================
// ASPECT CALCULATION
// =============================================================================

/**
 * Calculate aspects between planets.
 */
function calculateAspectsFromPlanets(
  planets: Record<string, SwissPlanet>
): [string, string, string][] {
  const aspects: [string, string, string][] = [];
  const planetEntries = Object.entries(planets);

  for (let i = 0; i < planetEntries.length; i++) {
    const [key1, p1] = planetEntries[i];

    for (let j = i + 1; j < planetEntries.length; j++) {
      const [key2, p2] = planetEntries[j];

      const angle = calculateAngleDifference(p1.longitude, p2.longitude);

      for (const [aspectName, targetAngle] of Object.entries(ASPECT_ANGLES)) {
        const orb = Math.abs(angle - targetAngle);
        let maxOrb = ASPECT_ORBS[aspectName] || 8;

        // Wider orbs for luminaries
        if (['sun', 'moon'].includes(key1) || ['sun', 'moon'].includes(key2)) {
          maxOrb *= 1.25;
        }

        if (orb <= maxOrb) {
          aspects.push([p1.planet, p2.planet, aspectName]);
          break;
        }
      }
    }
  }

  return aspects;
}

// =============================================================================
// CHART SHAPE DETECTION
// =============================================================================

type ChartShapeType = 'Bowl' | 'Bucket' | 'Locomotive' | 'Splash' | 'Bundle' | 'Seesaw';

/**
 * Detect Marc Edmund Jones chart shape.
 */
function detectChartShape(planets: Record<string, SwissPlanet>): ChartShapeType {
  const longitudes = Object.values(planets)
    .map(p => ((p.longitude % 360) + 360) % 360)
    .sort((a, b) => a - b);

  if (longitudes.length < 5) return 'Splash';

  // Calculate gaps
  const gaps: Array<{ gap: number; idx: number }> = [];
  for (let i = 0; i < longitudes.length; i++) {
    const nextIdx = (i + 1) % longitudes.length;
    let gap = longitudes[nextIdx] - longitudes[i];
    if (gap < 0) gap += 360;
    gaps.push({ gap, idx: i });
  }

  const maxGap = Math.max(...gaps.map(g => g.gap));
  const span = 360 - maxGap;

  if (span <= 120) return 'Bundle';
  if (span >= 150 && span <= 200) {
    const sortedGaps = [...gaps].sort((a, b) => b.gap - a.gap);
    const secondMaxGap = sortedGaps[1]?.gap || 0;
    return secondMaxGap >= 60 ? 'Bucket' : 'Bowl';
  }
  if (span >= 210 && span <= 270) return 'Locomotive';
  if (span >= 300) {
    const largeGaps = gaps.filter(g => g.gap >= 60).length;
    return largeGaps >= 2 ? 'Seesaw' : 'Splash';
  }

  return 'Splash';
}

// =============================================================================
// ASPECT PATTERN DETECTION
// =============================================================================

/**
 * Detect major aspect patterns.
 */
function detectAspectPatterns(
  aspects: [string, string, string][],
  planets: Record<string, SwissPlanet>
): AspectPatternResult[] {
  const patterns: AspectPatternResult[] = [];

  // Build aspect graph
  const aspectGraph: Record<string, Record<string, string>> = {};
  for (const [p1, p2, aspectType] of aspects) {
    if (!aspectGraph[p1]) aspectGraph[p1] = {};
    if (!aspectGraph[p2]) aspectGraph[p2] = {};
    aspectGraph[p1][p2] = aspectType;
    aspectGraph[p2][p1] = aspectType;
  }

  const planetNames = Object.keys(aspectGraph);

  // Detect Grand Trines
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      for (let k = j + 1; k < planetNames.length; k++) {
        const [p1, p2, p3] = [planetNames[i], planetNames[j], planetNames[k]];
        if (
          aspectGraph[p1]?.[p2] === 'trine' &&
          aspectGraph[p2]?.[p3] === 'trine' &&
          aspectGraph[p1]?.[p3] === 'trine'
        ) {
          patterns.push({
            patternType: 'grand_trine',
            planets: [p1, p2, p3],
            strength: 0.9,
            description: `Grand Trine: ${p1}, ${p2}, ${p3}`,
          });
        }
      }
    }
  }

  // Detect T-Squares
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const [p1, p2] = [planetNames[i], planetNames[j]];
      if (aspectGraph[p1]?.[p2] === 'opposition') {
        for (const p3 of planetNames) {
          if (p3 !== p1 && p3 !== p2) {
            if (
              aspectGraph[p1]?.[p3] === 'square' &&
              aspectGraph[p2]?.[p3] === 'square'
            ) {
              patterns.push({
                patternType: 't_square',
                planets: [p1, p2, p3],
                strength: 0.85,
                description: `T-Square: ${p1}-${p2} opposition, ${p3} apex`,
              });
            }
          }
        }
      }
    }
  }

  // Detect Stelliums (3+ planets in same sign)
  const signCounts: Record<string, string[]> = {};
  for (const [, p] of Object.entries(planets)) {
    const sign = p.sign;
    if (sign) {
      if (!signCounts[sign]) signCounts[sign] = [];
      signCounts[sign].push(p.planet);
    }
  }

  for (const [sign, planetList] of Object.entries(signCounts)) {
    if (planetList.length >= 3) {
      patterns.push({
        patternType: 'stellium',
        planets: planetList,
        strength: 0.8,
        description: `Stellium in ${sign}: ${planetList.join(', ')}`,
      });
    }
  }

  // Detect Yods
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const [p1, p2] = [planetNames[i], planetNames[j]];
      if (aspectGraph[p1]?.[p2] === 'sextile') {
        for (const p3 of planetNames) {
          if (p3 !== p1 && p3 !== p2) {
            if (
              aspectGraph[p1]?.[p3] === 'quincunx' &&
              aspectGraph[p2]?.[p3] === 'quincunx'
            ) {
              patterns.push({
                patternType: 'yod',
                planets: [p1, p2, p3],
                strength: 0.75,
                description: `Yod: ${p1}-${p2} sextile, ${p3} apex`,
              });
            }
          }
        }
      }
    }
  }

  return patterns;
}

// =============================================================================
// MAIN ADAPTER FUNCTION
// =============================================================================

/**
 * Convert GENESIS Swiss Ephemeris output to RawChart format.
 *
 * @param swissChart - Output from calculateFullChart() in swissEphemerisService.js
 * @returns RawChart ready for deriveWesternExpression()
 */
export function swissToRawChart(swissChart: SwissChart): RawChart {
  const swissPlanets = swissChart.planets || {};
  const swissHousesData = swissChart.houses || { houses: [], angles: {} as SwissAngles };
  const swissHouses = swissHousesData.houses || [];
  const swissAngles = swissHousesData.angles;

  // Extract house cusps
  const houseCusps = extractHouseCusps(swissHouses);

  // Get ASC sign
  let ascSign: ZodiacSign = 'Aries';
  const ascSignRaw = swissAngles?.ascendant?.sign;
  if (ascSignRaw && isValidSign(ascSignRaw)) {
    ascSign = ascSignRaw;
  }

  // Convert planets to PlanetPosition list
  const planets: PlanetPosition[] = [];

  for (const [key, p] of Object.entries(swissPlanets)) {
    const sign = p.sign;
    if (!isValidSign(sign)) continue;

    const longitude = p.longitude || 0;
    const degreeInSign = longitude % 30;
    const house = findHouseForLongitude(longitude, houseCusps);

    planets.push({
      planet: normalizePlanetName(p.planet || key),
      longitude,
      sign,
      degreeInSign,
      retrograde: p.isRetrograde || false,
      house,
    });
  }

  // Add Ascendant if not present
  const ascData = swissAngles?.ascendant;
  if (ascData && !planets.some(p => p.planet === 'Ascendant')) {
    planets.push({
      planet: 'Ascendant',
      longitude: ascData.longitude || 0,
      sign: ascSign,
      degreeInSign: (ascData.longitude || 0) % 30,
      retrograde: false,
      house: 1,
    });
  }

  // Add Midheaven if available
  const mcData = swissAngles?.midheaven;
  if (mcData && !planets.some(p => p.planet === 'Midheaven')) {
    const mcSign = mcData.sign;
    planets.push({
      planet: 'Midheaven',
      longitude: mcData.longitude || 0,
      sign: isValidSign(mcSign) ? mcSign : 'Aries',
      degreeInSign: (mcData.longitude || 0) % 30,
      retrograde: false,
      house: 10,
    });
  }

  // Calculate aspects
  const aspects = calculateAspectsFromPlanets(swissPlanets);

  // Detect chart shape
  const chartShape = detectChartShape(swissPlanets);

  // Detect aspect patterns
  const aspectPatterns = detectAspectPatterns(aspects, swissPlanets);

  // Build HouseCusps object
  const houses: HouseCusps = {
    system: 'Porphyry',
    cusps: houseCusps,
    ascendant: ascData?.longitude || 0,
    midheaven: mcData?.longitude || 0,
  };

  return {
    planets,
    chartShape,
    aspects,
    ascSign,
    houses,
    aspectPatterns,
  };
}

/**
 * Full pipeline: Swiss → RawChart → EnhancedWesternExpressionVector
 */
export function swissToEnhancedExpression(swissChart: SwissChart) {
  // Import dynamically to avoid circular deps
  const { deriveWesternExpression } = require('./westernArchetypeCalculator');
  const raw = swissToRawChart(swissChart);
  return deriveWesternExpression(raw);
}
