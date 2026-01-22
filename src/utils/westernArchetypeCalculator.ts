/**
 * westernArchetypeCalculator.ts
 *
 * 16-axis archetype calculation functions for Western Astrology.
 * TypeScript implementation matching Python western_engine/archetype_calculator.py
 */

import type {
  ZodiacSign,
  PlanetPosition,
  HouseCusps,
  EnhancedWesternExpressionVector,
  EnhancedCompatibilityScore,
  ArchetypeComparisonResult,
  ArchetypeProfile,
  RawChart,
  EnhancedSectionWeights,
  // Pattern-aware persona types
  PatternType,
  PatternStrengths as TSPatternStrengths,
  PatternModifiedArchetype,
  PatternPersona,
  PatternCompatibilityResult,
} from '../types/western.types';

import {
  ARCHETYPE_AXES,
  SIGN_ARCHETYPE_VECTORS,
  CUSP_ZONES,
  DEFAULT_ENHANCED_SECTION_WEIGHTS,
  // Pattern influence vectors
  PATTERN_INFLUENCE_VECTORS,
  PATTERN_ARCHETYPE_NAMES,
  PATTERN_INFLUENCE_WEIGHT,
} from '../types/western.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const SIGN_ELEMENT: Record<ZodiacSign, string> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
};

const SIGN_MODALITY: Record<ZodiacSign, string> = {
  Aries: 'Cardinal', Taurus: 'Fixed', Gemini: 'Mutable', Cancer: 'Cardinal',
  Leo: 'Fixed', Virgo: 'Mutable', Libra: 'Cardinal', Scorpio: 'Fixed',
  Sagittarius: 'Mutable', Capricorn: 'Cardinal', Aquarius: 'Fixed', Pisces: 'Mutable',
};

const PLANET_WEIGHTS: Record<string, number> = {
  Sun: 1.0, Moon: 1.0, Mercury: 0.8, Venus: 0.8, Mars: 0.8,
  Jupiter: 0.7, Saturn: 0.7, Uranus: 0.5, Neptune: 0.5, Pluto: 0.5,
  Ascendant: 0.9, Midheaven: 0.6, 'North Node': 0.4, Chiron: 0.3, Lilith: 0.2,
};

const ZODIAC_ORDER: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// =============================================================================
// PROFESSIONAL ASPECT PATTERN DETECTION CONSTANTS
// =============================================================================

/**
 * Aspect configuration with ideal angles and default orbs (degrees).
 * Major aspects have wider orbs; minor aspects have tighter orbs.
 */
const ASPECT_CONFIG: Record<string, { angle: number; orb: number }> = {
  conjunction: { angle: 0, orb: 8 },
  opposition: { angle: 180, orb: 8 },
  trine: { angle: 120, orb: 7 },
  square: { angle: 90, orb: 7 },
  sextile: { angle: 60, orb: 5 },
  quincunx: { angle: 150, orb: 3 },
  'semi-sextile': { angle: 30, orb: 2 },
  'semi-square': { angle: 45, orb: 2 },
  sesquiquadrate: { angle: 135, orb: 2 },
};

/**
 * Planet-specific orb modifiers (added to base orb).
 * Luminaries and angles get wider orbs; outer planets get tighter.
 */
const PLANET_ORB_MODIFIERS: Record<string, number> = {
  Sun: 1.0,
  Moon: 1.0,
  Ascendant: 2.0,
  Midheaven: 2.0,
  MC: 2.0,
  Mercury: 0.0,
  Venus: 0.0,
  Mars: 0.0,
  Jupiter: 0.0,
  Saturn: 0.0,
  Uranus: -1.0,
  Neptune: -1.0,
  Pluto: -1.0,
  'North Node': -1.0,
  Chiron: -1.0,
  Lilith: -1.0,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function normalizeDict(d: Record<string, number>): Record<string, number> {
  const total = Object.values(d).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return Object.fromEntries(Object.keys(d).map(k => [k, 0]));
  }
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v / total]));
}

function normalizeList(lst: number[]): number[] {
  const total = lst.reduce((a, b) => a + b, 0);
  if (total === 0) return lst.map(() => 0);
  return lst.map(v => v / total);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function getNextSign(sign: ZodiacSign): ZodiacSign {
  const idx = ZODIAC_ORDER.indexOf(sign);
  return ZODIAC_ORDER[(idx + 1) % 12];
}

// =============================================================================
// PROFESSIONAL ORB-AWARE ASPECT PATTERN DETECTION
// =============================================================================

/**
 * Calculate aspect tightness score (0.0 to 1.0).
 * Tighter aspects (smaller orb error) get higher scores.
 *
 * @param actualAngle - The actual angular separation between planets
 * @param idealAngle - The ideal angle for this aspect type
 * @param maxOrb - Maximum allowed orb for this aspect
 * @returns Tightness score: 1.0 = exact aspect, 0.0 = outside orb
 */
export function aspectTightness(actualAngle: number, idealAngle: number, maxOrb: number): number {
  let orbError = Math.abs(actualAngle - idealAngle);
  if (orbError > 180) {
    orbError = 360 - orbError;
  }
  if (orbError > maxOrb) {
    return 0.0;
  }
  return 1.0 - (orbError / maxOrb);
}

/**
 * Get effective orb for an aspect between two planets.
 * Adjusts base orb based on planet types.
 */
function getEffectiveOrb(
  planet1: string,
  planet2: string,
  baseOrb: number
): number {
  const mod1 = PLANET_ORB_MODIFIERS[planet1] || 0;
  const mod2 = PLANET_ORB_MODIFIERS[planet2] || 0;
  // Use average of both modifiers
  return Math.max(1, baseOrb + (mod1 + mod2) / 2);
}

/**
 * Calculate the angular difference between two planetary longitudes.
 */
function angularDifference(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Check if two planets form a specific aspect and return tightness.
 * Returns 0 if aspect is not present within orb.
 */
function checkAspect(
  planet1: PlanetPosition,
  planet2: PlanetPosition,
  aspectType: string
): number {
  const config = ASPECT_CONFIG[aspectType];
  if (!config) return 0;

  const angle = angularDifference(planet1.longitude, planet2.longitude);
  const effectiveOrb = getEffectiveOrb(planet1.planet, planet2.planet, config.orb);

  return aspectTightness(angle, config.angle, effectiveOrb);
}

interface PatternMatch {
  planets: string[];
  strength: number;
  description: string;
}

/**
 * Detect Grand Trines (3 planets each 120° apart).
 * Returns all found with strength scores.
 */
function detectGrandTrines(planets: PlanetPosition[]): PatternMatch[] {
  const results: PatternMatch[] = [];
  const n = planets.length;

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        const p1 = planets[i];
        const p2 = planets[j];
        const p3 = planets[k];

        const t12 = checkAspect(p1, p2, 'trine');
        const t23 = checkAspect(p2, p3, 'trine');
        const t13 = checkAspect(p1, p3, 'trine');

        if (t12 > 0 && t23 > 0 && t13 > 0) {
          const strength = (t12 + t23 + t13) / 3;
          results.push({
            planets: [p1.planet, p2.planet, p3.planet],
            strength,
            description: `Grand Trine: ${p1.planet}, ${p2.planet}, ${p3.planet} (strength: ${(strength * 100).toFixed(1)}%)`,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Detect T-Squares (2 planets in opposition, both square a third).
 */
function detectTSquares(planets: PlanetPosition[]): PatternMatch[] {
  const results: PatternMatch[] = [];
  const n = planets.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const oppTightness = checkAspect(p1, p2, 'opposition');

      if (oppTightness > 0) {
        // Found opposition, look for apex planet
        for (let k = 0; k < n; k++) {
          if (k === i || k === j) continue;
          const apex = planets[k];

          const sq1 = checkAspect(p1, apex, 'square');
          const sq2 = checkAspect(p2, apex, 'square');

          if (sq1 > 0 && sq2 > 0) {
            const strength = (oppTightness + sq1 + sq2) / 3;
            results.push({
              planets: [p1.planet, p2.planet, apex.planet],
              strength,
              description: `T-Square: ${p1.planet}-${p2.planet} opposition, ${apex.planet} apex (strength: ${(strength * 100).toFixed(1)}%)`,
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Detect Stelliums (3+ planets within 10° span in same sign or house).
 */
function detectStelliums(planets: PlanetPosition[]): PatternMatch[] {
  const results: PatternMatch[] = [];
  const STELLIUM_ORB = 10;

  // Group by sign
  const bySign: Record<string, PlanetPosition[]> = {};
  for (const p of planets) {
    if (!bySign[p.sign]) bySign[p.sign] = [];
    bySign[p.sign].push(p);
  }

  for (const [sign, signPlanets] of Object.entries(bySign)) {
    if (signPlanets.length >= 3) {
      // Check if they're clustered (within orb)
      const sorted = [...signPlanets].sort((a, b) => a.longitude - b.longitude);
      const span = sorted[sorted.length - 1].longitude - sorted[0].longitude;

      // Tightness based on how clustered they are
      const maxSpan = STELLIUM_ORB * (signPlanets.length - 1);
      const tightness = Math.max(0, 1 - span / maxSpan);
      const strength = 0.5 + tightness * 0.5; // Base 0.5 for qualifying, up to 1.0

      results.push({
        planets: signPlanets.map(p => p.planet),
        strength,
        description: `Stellium in ${sign}: ${signPlanets.map(p => p.planet).join(', ')} (strength: ${(strength * 100).toFixed(1)}%)`,
      });
    }
  }

  return results;
}

/**
 * Detect Yods (Finger of God): 2 planets sextile, both quincunx a third.
 */
function detectYods(planets: PlanetPosition[]): PatternMatch[] {
  const results: PatternMatch[] = [];
  const n = planets.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const sextileTightness = checkAspect(p1, p2, 'sextile');

      if (sextileTightness > 0) {
        // Found sextile, look for apex planet (quincunx to both)
        for (let k = 0; k < n; k++) {
          if (k === i || k === j) continue;
          const apex = planets[k];

          const q1 = checkAspect(p1, apex, 'quincunx');
          const q2 = checkAspect(p2, apex, 'quincunx');

          if (q1 > 0 && q2 > 0) {
            const strength = (sextileTightness + q1 + q2) / 3;
            results.push({
              planets: [p1.planet, p2.planet, apex.planet],
              strength,
              description: `Yod: ${p1.planet}-${p2.planet} sextile, ${apex.planet} apex (strength: ${(strength * 100).toFixed(1)}%)`,
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Detect Kites (Grand Trine + one planet opposite one of the trine planets,
 * sextile to the other two).
 */
function detectKites(planets: PlanetPosition[]): PatternMatch[] {
  const results: PatternMatch[] = [];
  const grandTrines = detectGrandTrines(planets);

  for (const gt of grandTrines) {
    const trinePlanets = planets.filter(p => gt.planets.includes(p.planet));
    if (trinePlanets.length !== 3) continue;

    // Look for a 4th planet that opposes one and sextiles the other two
    for (const candidate of planets) {
      if (gt.planets.includes(candidate.planet)) continue;

      for (let i = 0; i < 3; i++) {
        const oppTarget = trinePlanets[i];
        const sextile1 = trinePlanets[(i + 1) % 3];
        const sextile2 = trinePlanets[(i + 2) % 3];

        const oppTight = checkAspect(candidate, oppTarget, 'opposition');
        const sex1Tight = checkAspect(candidate, sextile1, 'sextile');
        const sex2Tight = checkAspect(candidate, sextile2, 'sextile');

        if (oppTight > 0 && sex1Tight > 0 && sex2Tight > 0) {
          const strength = (gt.strength + oppTight + sex1Tight + sex2Tight) / 4;
          results.push({
            planets: [...gt.planets, candidate.planet],
            strength,
            description: `Kite: Grand Trine + ${candidate.planet} (strength: ${(strength * 100).toFixed(1)}%)`,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Detect opposition chains (multiple overlapping oppositions).
 */
function detectOppositionChains(planets: PlanetPosition[]): PatternMatch[] {
  const results: PatternMatch[] = [];
  const oppositions: Array<{ p1: PlanetPosition; p2: PlanetPosition; tightness: number }> = [];
  const n = planets.length;

  // Find all oppositions
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const tightness = checkAspect(planets[i], planets[j], 'opposition');
      if (tightness > 0) {
        oppositions.push({ p1: planets[i], p2: planets[j], tightness });
      }
    }
  }

  // If 2+ oppositions, it's a chain
  if (oppositions.length >= 2) {
    const allPlanets = new Set<string>();
    let totalTightness = 0;

    for (const opp of oppositions) {
      allPlanets.add(opp.p1.planet);
      allPlanets.add(opp.p2.planet);
      totalTightness += opp.tightness;
    }

    const strength = totalTightness / oppositions.length;
    results.push({
      planets: Array.from(allPlanets),
      strength,
      description: `Opposition Chain: ${oppositions.length} oppositions involving ${allPlanets.size} planets (strength: ${(strength * 100).toFixed(1)}%)`,
    });
  }

  return results;
}

export interface WeightedPatternResult {
  patternType: string;
  patterns: PatternMatch[];
  maxStrength: number;
}

/**
 * Main function: Detect all aspect patterns with orb-aware strength weighting.
 * Returns structured results for each pattern type.
 */
export function detectAspectPatternsWeighted(planets: PlanetPosition[]): WeightedPatternResult[] {
  const results: WeightedPatternResult[] = [];

  // Detect all pattern types
  const grandTrines = detectGrandTrines(planets);
  const tSquares = detectTSquares(planets);
  const stelliums = detectStelliums(planets);
  const yods = detectYods(planets);
  const kites = detectKites(planets);
  const oppositionChains = detectOppositionChains(planets);

  if (grandTrines.length > 0) {
    results.push({
      patternType: 'grand_trine',
      patterns: grandTrines,
      maxStrength: Math.max(...grandTrines.map(p => p.strength)),
    });
  }

  if (tSquares.length > 0) {
    results.push({
      patternType: 't_square',
      patterns: tSquares,
      maxStrength: Math.max(...tSquares.map(p => p.strength)),
    });
  }

  if (stelliums.length > 0) {
    results.push({
      patternType: 'stellium',
      patterns: stelliums,
      maxStrength: Math.max(...stelliums.map(p => p.strength)),
    });
  }

  if (yods.length > 0) {
    results.push({
      patternType: 'yod',
      patterns: yods,
      maxStrength: Math.max(...yods.map(p => p.strength)),
    });
  }

  if (kites.length > 0) {
    results.push({
      patternType: 'kite',
      patterns: kites,
      maxStrength: Math.max(...kites.map(p => p.strength)),
    });
  }

  if (oppositionChains.length > 0) {
    results.push({
      patternType: 'opposition_chain',
      patterns: oppositionChains,
      maxStrength: Math.max(...oppositionChains.map(p => p.strength)),
    });
  }

  return results;
}

// =============================================================================
// ARCHETYPE CALCULATIONS
// =============================================================================

/**
 * Get the 16-dimensional archetype vector for a zodiac sign.
 */
export function getSignArchetype(sign: ZodiacSign): number[] {
  return SIGN_ARCHETYPE_VECTORS[sign] || Array(16).fill(0);
}

/**
 * Blend two archetype vectors with alpha weighting.
 * alpha=1 means 100% primary, alpha=0 means 100% secondary.
 */
export function blendArchetypes(
  primary: number[],
  secondary: number[],
  alpha: number
): number[] {
  return primary.map((p, i) => alpha * p + (1 - alpha) * secondary[i]);
}

/**
 * Calculate cusp blend weight using 6-6 degree model.
 * Returns alpha in [0, 1] where:
 *   - degrees 0-6: blend from next sign
 *   - degrees 6-24: pure current sign
 *   - degrees 24-30: blend into next sign
 */
export function calculateCuspBlendWeight(degreeInSign: number): {
  alpha: number;
  blendDirection: 'previous' | 'none' | 'next';
} {
  const CUSP_DEGREES = 6;
  const POWER = 1.6;

  if (degreeInSign < CUSP_DEGREES) {
    // Early degrees: blend from previous sign
    const t = degreeInSign / CUSP_DEGREES;
    const alpha = Math.pow(t, POWER);
    return { alpha, blendDirection: 'previous' };
  } else if (degreeInSign > 30 - CUSP_DEGREES) {
    // Late degrees: blend into next sign
    const t = (30 - degreeInSign) / CUSP_DEGREES;
    const alpha = Math.pow(t, POWER);
    return { alpha: 1 - alpha, blendDirection: 'next' };
  }

  return { alpha: 1.0, blendDirection: 'none' };
}

/**
 * Calculate archetype vector for a planet position with cusp blending.
 */
export function calculatePlanetArchetypeVector(planet: PlanetPosition): number[] {
  const primaryVec = getSignArchetype(planet.sign);
  const { alpha, blendDirection } = calculateCuspBlendWeight(planet.degreeInSign);

  if (blendDirection === 'none') {
    return primaryVec;
  }

  let secondarySign: ZodiacSign;
  if (blendDirection === 'previous') {
    const idx = ZODIAC_ORDER.indexOf(planet.sign);
    secondarySign = ZODIAC_ORDER[(idx - 1 + 12) % 12];
  } else {
    secondarySign = getNextSign(planet.sign);
  }

  const secondaryVec = getSignArchetype(secondarySign);
  return blendArchetypes(primaryVec, secondaryVec, alpha);
}

/**
 * Build full 35-dimensional planet vector.
 * [4 element + 3 modality + 12 house + 16 archetype]
 */
export function buildPlanetFullVector(planet: PlanetPosition): number[] {
  // Element (4 dims)
  const element = SIGN_ELEMENT[planet.sign];
  const elementVec = ['Fire', 'Earth', 'Air', 'Water'].map(e => e === element ? 1.0 : 0.0);

  // Modality (3 dims)
  const modality = SIGN_MODALITY[planet.sign];
  const modalityVec = ['Cardinal', 'Fixed', 'Mutable'].map(m => m === modality ? 1.0 : 0.0);

  // House (12 dims)
  const houseVec = Array(12).fill(0);
  if (planet.house !== undefined && planet.house >= 1 && planet.house <= 12) {
    houseVec[planet.house - 1] = 1.0;
  }

  // Archetype (16 dims)
  const archetypeVec = calculatePlanetArchetypeVector(planet);

  return [...elementVec, ...modalityVec, ...houseVec, ...archetypeVec];
}

/**
 * Calculate chart-level archetype vector from all planets.
 * Uses weighted blend of Sun, Moon, and Ascendant.
 */
export function calculateChartArchetype(
  planets: PlanetPosition[],
  ascSign?: ZodiacSign
): number[] {
  const SUN_WEIGHT = 0.35;
  const MOON_WEIGHT = 0.30;
  const ASC_WEIGHT = 0.25;
  const OTHER_WEIGHT = 0.10;

  let result = Array(16).fill(0);
  let totalWeight = 0;

  for (const planet of planets) {
    const vec = calculatePlanetArchetypeVector(planet);
    let weight = OTHER_WEIGHT;

    if (planet.planet === 'Sun') weight = SUN_WEIGHT;
    else if (planet.planet === 'Moon') weight = MOON_WEIGHT;
    else if (planet.planet === 'Ascendant') weight = ASC_WEIGHT;

    for (let i = 0; i < 16; i++) {
      result[i] += vec[i] * weight;
    }
    totalWeight += weight;
  }

  // Add Ascendant sign if provided and not in planets
  if (ascSign && !planets.some(p => p.planet === 'Ascendant')) {
    const ascVec = getSignArchetype(ascSign);
    for (let i = 0; i < 16; i++) {
      result[i] += ascVec[i] * ASC_WEIGHT;
    }
    totalWeight += ASC_WEIGHT;
  }

  // Normalize
  if (totalWeight > 0) {
    result = result.map(v => v / totalWeight);
  }

  return result;
}

/**
 * Calculate archetype similarity between two vectors.
 */
export function calculateArchetypeSimilarity(vecA: number[], vecB: number[]): number {
  return cosineSimilarity(vecA, vecB);
}

/**
 * Get dominant archetype traits from a vector.
 */
export function getDominantArchetypeTraits(
  vec: number[],
  topN: number = 3
): Array<{ axis: string; value: number; direction: string }> {
  const indexed = vec.map((v, i) => ({ value: v, idx: i }));
  indexed.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return indexed.slice(0, topN).map(item => ({
    axis: ARCHETYPE_AXES[item.idx],
    value: Math.round(item.value * 100) / 100,
    direction: item.value >= 0
      ? ARCHETYPE_AXES[item.idx].split('_vs_')[0]
      : ARCHETYPE_AXES[item.idx].split('_vs_')[1],
  }));
}

/**
 * Calculate synastry receptivity score (0-1).
 * Based on 7th house activity and Venus/Jupiter placements.
 */
export function calculateSynastryReceptivity(
  planets: PlanetPosition[],
  houses?: HouseCusps
): number {
  let score = 0.5;  // Base receptivity

  // 7th house planets boost receptivity
  const seventhHousePlanets = planets.filter(p => p.house === 7);
  score += seventhHousePlanets.length * 0.08;

  // Venus in compatible signs
  const venus = planets.find(p => p.planet === 'Venus');
  if (venus) {
    const venusElement = SIGN_ELEMENT[venus.sign];
    if (venusElement === 'Air' || venusElement === 'Fire') {
      score += 0.1;
    }
    if (venus.house === 5 || venus.house === 7 || venus.house === 11) {
      score += 0.08;
    }
  }

  // Jupiter aspects add openness
  const jupiter = planets.find(p => p.planet === 'Jupiter');
  if (jupiter) {
    if (jupiter.house === 1 || jupiter.house === 7 || jupiter.house === 9) {
      score += 0.06;
    }
  }

  return Math.min(1.0, Math.max(0.0, score));
}

/**
 * Derive planet vectors from positions.
 */
export function derivePlanetVectors(planets: PlanetPosition[]): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  for (const planet of planets) {
    result[planet.planet] = buildPlanetFullVector(planet);
  }
  return result;
}

/**
 * Explain an archetype vector in human-readable terms.
 */
export function explainArchetypeVector(vec: number[]): Record<string, string> {
  const explanations: Record<string, string> = {};

  for (let i = 0; i < Math.min(vec.length, ARCHETYPE_AXES.length); i++) {
    const value = vec[i];
    const axis = ARCHETYPE_AXES[i];
    const [positive, negative] = axis.split('_vs_');

    let strength: string;
    const absVal = Math.abs(value);
    if (absVal > 0.6) strength = 'strongly';
    else if (absVal > 0.3) strength = 'moderately';
    else strength = 'slightly';

    const direction = value >= 0 ? positive : negative;
    explanations[axis] = `${strength} ${direction} (${value.toFixed(2)})`;
  }

  return explanations;
}

// =============================================================================
// DERIVATION FUNCTIONS
// =============================================================================

/**
 * Derive element distribution from planet placements.
 */
export function deriveElements(chart: RawChart): Record<string, number> {
  const acc: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };

  for (const planet of chart.planets) {
    const weight = PLANET_WEIGHTS[planet.planet] || 0.5;
    const element = SIGN_ELEMENT[planet.sign] || 'Fire';
    acc[element] += weight;
  }

  return normalizeDict(acc);
}

/**
 * Derive modality distribution from planet placements.
 */
export function deriveModalities(chart: RawChart): Record<string, number> {
  const acc: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  for (const planet of chart.planets) {
    const weight = PLANET_WEIGHTS[planet.planet] || 0.5;
    const modality = SIGN_MODALITY[planet.sign] || 'Cardinal';
    acc[modality] += weight;
  }

  return normalizeDict(acc);
}

/**
 * Derive house intensity distribution from planet placements.
 */
export function deriveHouses(chart: RawChart): number[] {
  const acc = Array(12).fill(0);

  for (const planet of chart.planets) {
    const weight = PLANET_WEIGHTS[planet.planet] || 0.5;
    if (planet.house !== undefined && planet.house >= 1 && planet.house <= 12) {
      acc[planet.house - 1] += weight;
    }
  }

  return normalizeList(acc);
}

/**
 * Derive aspect pattern vector from chart data using professional orb-aware detection.
 * Returns 6-dim vector: [grand_trine, t_square, stellium, yod, kite, opposition_chain]
 *
 * Uses orb-aware, strength-weighted detection instead of binary flags.
 * Each dimension contains the maximum strength (0.0-1.0) of that pattern type.
 */
export function deriveAspectPatternVector(chart: RawChart): number[] {
  // Use the professional orb-aware detection directly from planet positions
  const weightedPatterns = detectAspectPatternsWeighted(chart.planets);

  // Map pattern types to vector indices
  const patternIndex: Record<string, number> = {
    grand_trine: 0,
    t_square: 1,
    stellium: 2,
    yod: 3,
    kite: 4,
    opposition_chain: 5,
  };

  const vec = [0, 0, 0, 0, 0, 0];

  for (const result of weightedPatterns) {
    const idx = patternIndex[result.patternType];
    if (idx !== undefined) {
      vec[idx] = result.maxStrength;
    }
  }

  return vec;
}

/**
 * Derive aspect pattern vector with full detail (for explainability).
 * Returns both the vector and the detailed pattern information.
 */
export function deriveAspectPatternVectorDetailed(chart: RawChart): {
  vector: number[];
  patterns: WeightedPatternResult[];
} {
  const patterns = detectAspectPatternsWeighted(chart.planets);
  const vector = deriveAspectPatternVector(chart);

  return { vector, patterns };
}

/**
 * Derive dominance vector from chart data.
 * Returns 4-dim: [sign_dominance, planet_dominance, house_dominance, overall]
 */
export function deriveDominanceVector(chart: RawChart): number[] {
  // Sign dominance
  const signCounts: Record<string, number> = {};
  for (const planet of chart.planets) {
    const weight = PLANET_WEIGHTS[planet.planet] || 0.5;
    signCounts[planet.sign] = (signCounts[planet.sign] || 0) + weight;
  }
  const maxSignWeight = Math.max(...Object.values(signCounts), 0);
  const totalSignWeight = Object.values(signCounts).reduce((a, b) => a + b, 0) || 1;
  const signDominance = maxSignWeight / totalSignWeight;

  // Planet dominance (based on aspects)
  const planetAspectCounts: Record<string, number> = {};
  for (const [p1, p2] of chart.aspects) {
    planetAspectCounts[p1] = (planetAspectCounts[p1] || 0) + 1;
    planetAspectCounts[p2] = (planetAspectCounts[p2] || 0) + 1;
  }
  const maxAspects = Math.max(...Object.values(planetAspectCounts), 0);
  const planetDominance = Math.min(1.0, maxAspects / 10.0);

  // House dominance
  const houseCounts = Array(12).fill(0);
  for (const planet of chart.planets) {
    if (planet.house !== undefined) {
      houseCounts[planet.house - 1] += PLANET_WEIGHTS[planet.planet] || 0.5;
    }
  }
  const maxHouseWeight = Math.max(...houseCounts, 0);
  const totalHouseWeight = houseCounts.reduce((a, b) => a + b, 0) || 1;
  const houseDominance = maxHouseWeight / totalHouseWeight;

  const overall = (signDominance + planetDominance + houseDominance) / 3;

  return [signDominance, planetDominance, houseDominance, overall];
}

/**
 * Derive chart shape vector from classification.
 * Returns 6-dim: [bowl, bucket, locomotive, splash, bundle, seesaw]
 */
export function deriveChartShapeVector(chart: RawChart): number[] {
  const shapes = ['Bowl', 'Bucket', 'Locomotive', 'Splash', 'Bundle', 'Seesaw'];
  return shapes.map(s => chart.chartShape === s ? 1.0 : 0.0);
}

// =============================================================================
// MAIN DERIVATION FUNCTION
// =============================================================================

/**
 * Derive complete EnhancedWesternExpressionVector from raw chart data.
 */
export function deriveWesternExpression(chart: RawChart): EnhancedWesternExpressionVector {
  const elements = deriveElements(chart);
  const modalities = deriveModalities(chart);
  const houses = deriveHouses(chart);
  const planets = derivePlanetVectors(chart.planets);
  const archetypeVector = calculateChartArchetype(chart.planets, chart.ascSign);
  const aspectPatternVector = deriveAspectPatternVector(chart);
  const dominanceVector = deriveDominanceVector(chart);
  const chartShapeVector = deriveChartShapeVector(chart);
  const synastryReceptivity = calculateSynastryReceptivity(chart.planets, chart.houses);
  const dominantTraits = getDominantArchetypeTraits(archetypeVector, 3);

  return {
    elements: elements as Record<string, number>,
    modalities: modalities as Record<string, number>,
    houses,
    planets,
    archetypeVector,
    aspectPatternVector,
    dominanceVector,
    chartShapeVector,
    synastryReceptivity,
    dominantTraits,
  } as EnhancedWesternExpressionVector;
}

// =============================================================================
// COMPATIBILITY CALCULATION
// =============================================================================

/**
 * Compute enhanced compatibility between two expression vectors.
 */
export function computeEnhancedCompatibility(
  user: EnhancedWesternExpressionVector,
  partner: EnhancedWesternExpressionVector,
  proximityScore: number = 0.5,
  weights: EnhancedSectionWeights = DEFAULT_ENHANCED_SECTION_WEIGHTS
): EnhancedCompatibilityScore {
  // Element similarity
  const userEl = ['Fire', 'Earth', 'Air', 'Water'].map(e => user.elements[e] || 0.25);
  const partnerEl = ['Fire', 'Earth', 'Air', 'Water'].map(e => partner.elements[e] || 0.25);
  const elementsSim = cosineSimilarity(userEl, partnerEl);

  // Modality similarity
  const userMod = ['Cardinal', 'Fixed', 'Mutable'].map(m => user.modalities[m] || 0.33);
  const partnerMod = ['Cardinal', 'Fixed', 'Mutable'].map(m => partner.modalities[m] || 0.33);
  const modalitiesSim = cosineSimilarity(userMod, partnerMod);

  // House similarity
  const housesSim = cosineSimilarity(user.houses, partner.houses);

  // Planet vector similarity (average across shared planets)
  const planetSims: number[] = [];
  for (const name of Object.keys(user.planets)) {
    if (partner.planets[name]) {
      planetSims.push(cosineSimilarity(user.planets[name], partner.planets[name]));
    }
  }
  const planetsSim = planetSims.length > 0
    ? planetSims.reduce((a, b) => a + b, 0) / planetSims.length
    : 0.5;

  // Archetype vector similarity (16-axis)
  const archetypesSim = cosineSimilarity(user.archetypeVector, partner.archetypeVector);

  // Pattern similarity
  const patternsSim = cosineSimilarity(user.aspectPatternVector, partner.aspectPatternVector);

  // Dominance similarity
  const dominanceSim = cosineSimilarity(user.dominanceVector, partner.dominanceVector);

  // Shape similarity
  const shapeSim = cosineSimilarity(user.chartShapeVector, partner.chartShapeVector);

  // Synastry receptivity (minimum of both)
  const synastryReceptivitySim = Math.min(user.synastryReceptivity, partner.synastryReceptivity);

  // Build components
  const components = {
    elements: elementsSim * 100,
    modalities: modalitiesSim * 100,
    houses: housesSim * 100,
    planets: planetsSim * 100,
    archetypes: archetypesSim * 100,
    patterns: patternsSim * 100,
    dominance: dominanceSim * 100,
    shape: shapeSim * 100,
    proximity: proximityScore * 100,
    synastryReceptivity: synastryReceptivitySim * 100,
  };

  // Calculate weighted total
  const total =
    components.elements * weights.elements +
    components.modalities * weights.modalities +
    components.houses * weights.houses +
    components.planets * weights.planets +
    components.archetypes * weights.archetypes +
    components.patterns * weights.patterns +
    components.dominance * weights.dominance +
    components.shape * weights.shape +
    components.proximity * weights.proximity +
    components.synastryReceptivity * weights.synastryReceptivity;

  return {
    total,
    elements: components.elements,
    modalities: components.modalities,
    houses: components.houses,
    planets: components.planets,
    archetypes: components.archetypes,
    patterns: components.patterns,
    dominance: components.dominance,
    shape: components.shape,
    proximity: components.proximity,
    synastryReceptivity: components.synastryReceptivity,
    rawComponents: {
      elementsSim,
      modalitiesSim,
      housesSim,
      planetsSim,
      archetypesSim,
      patternsSim,
      dominanceSim,
      shapeSim,
      synastryReceptivitySim,
    },
  };
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Quick comparison of two sign archetypes.
 */
export function quickArchetypeComparison(
  signA: ZodiacSign,
  signB: ZodiacSign
): ArchetypeComparisonResult {
  const vecA = SIGN_ARCHETYPE_VECTORS[signA] || Array(16).fill(0);
  const vecB = SIGN_ARCHETYPE_VECTORS[signB] || Array(16).fill(0);

  const similarity = cosineSimilarity(vecA, vecB);

  // Find significant differences
  const differences: ArchetypeComparisonResult['significantDifferences'] = [];
  for (let i = 0; i < ARCHETYPE_AXES.length; i++) {
    const diff = Math.abs(vecA[i] - vecB[i]);
    if (diff > 0.5) {
      differences.push({
        axis: ARCHETYPE_AXES[i],
        signAValue: vecA[i],
        signBValue: vecB[i],
        difference: diff,
      });
    }
  }

  differences.sort((a, b) => b.difference - a.difference);

  return {
    signA,
    signB,
    similarity: Math.round(similarity * 1000) / 1000,
    compatibilityPercent: Math.round(similarity * 1000) / 10,
    significantDifferences: differences.slice(0, 3),
  };
}

/**
 * Get complete archetype profile for a sign.
 */
export function getArchetypeProfile(sign: ZodiacSign): ArchetypeProfile {
  const vec = SIGN_ARCHETYPE_VECTORS[sign] || Array(16).fill(0);
  const traits = getDominantArchetypeTraits(vec, 5);

  const profile: Record<string, { value: number; strength: 'high' | 'moderate' | 'low' }> = {};
  for (let i = 0; i < ARCHETYPE_AXES.length; i++) {
    const absVal = Math.abs(vec[i]);
    profile[ARCHETYPE_AXES[i]] = {
      value: Math.round(vec[i] * 100) / 100,
      strength: absVal > 0.6 ? 'high' : absVal > 0.3 ? 'moderate' : 'low',
    };
  }

  return {
    sign,
    archetypeVector: vec,
    dominantTraits: traits,
    profile,
  };
}

// =============================================================================
// PATTERN-AWARE ARCHETYPE MODIFICATION
// =============================================================================

/**
 * Clamp vector values to [-1, 1] range.
 */
function clampVector(vec: number[], min = -1, max = 1): number[] {
  return vec.map(v => Math.max(min, Math.min(max, v)));
}

/**
 * Apply a single pattern's influence to an archetype vector.
 *
 * @param baseVector - The 16-dimensional base archetype vector
 * @param patternType - Name of the pattern
 * @param patternStrength - Strength of the pattern (0.0-1.0)
 * @param influenceWeight - How strongly patterns modify the base
 * @returns Modified 16-dimensional vector
 */
export function applyPatternToArchetype(
  baseVector: number[],
  patternType: PatternType,
  patternStrength: number,
  influenceWeight: number = PATTERN_INFLUENCE_WEIGHT
): number[] {
  if (patternStrength <= 0) return [...baseVector];

  const influence = PATTERN_INFLUENCE_VECTORS[patternType];
  if (!influence) return [...baseVector];

  // Scale influence by pattern strength and global weight
  const scaledInfluence = influence.map(v => v * patternStrength * influenceWeight);

  // Add to base vector
  const modified = baseVector.map((v, i) => v + (scaledInfluence[i] || 0));

  // Clamp to valid range
  return clampVector(modified);
}

/**
 * Apply all pattern strengths to modify an archetype vector.
 * This is the main function for pattern-aware persona modeling.
 */
export function applyAllPatternsToArchetype(
  baseVector: number[],
  patterns: TSPatternStrengths,
  influenceWeight: number = PATTERN_INFLUENCE_WEIGHT
): PatternModifiedArchetype {
  let modified = [...baseVector];
  const contributions: Record<PatternType, number[]> = {} as Record<PatternType, number[]>;
  const dominantPatterns: PatternType[] = [];

  const patternEntries: [PatternType, number][] = [
    ['grand_trine', patterns.grand_trine],
    ['t_square', patterns.t_square],
    ['stellium', patterns.stellium],
    ['yod', patterns.yod],
    ['kite', patterns.kite],
    ['opposition_chain', patterns.opposition_chain],
  ];

  for (const [patternType, strength] of patternEntries) {
    if (strength <= 0) continue;

    const influence = PATTERN_INFLUENCE_VECTORS[patternType];
    if (!influence) continue;

    // Track dominant patterns (strength > 0.3)
    if (strength > 0.3) {
      dominantPatterns.push(patternType);
    }

    // Calculate this pattern's contribution
    const scaled = influence.map(v => v * strength * influenceWeight);
    contributions[patternType] = scaled;

    // Apply to modified vector
    modified = modified.map((v, i) => v + (scaled[i] || 0));
  }

  // Clamp final result
  modified = clampVector(modified);

  // Build archetype name
  let archetypeName = 'Base Archetype';
  if (dominantPatterns.length > 0) {
    const names = dominantPatterns.slice(0, 2).map(p => PATTERN_ARCHETYPE_NAMES[p]);
    archetypeName = names.join(' + ');
  }

  // Find dominant axes
  const dominantAxes = getDominantArchetypeTraits(modified, 5);

  return {
    baseVector,
    modifiedVector: modified,
    patternContributions: contributions,
    dominantPatterns,
    archetypeName,
    dominantAxes,
  };
}

/**
 * Generate pattern signature string.
 */
function generatePatternSignature(patterns: TSPatternStrengths): string {
  const shortNames: Record<PatternType, string> = {
    grand_trine: 'Flow',
    t_square: 'Friction',
    stellium: 'Focus',
    yod: 'Destiny',
    kite: 'Mission',
    opposition_chain: 'Paradox',
  };

  const dominant = (Object.entries(patterns) as [PatternType, number][])
    .filter(([, v]) => v >= 0.6)
    .map(([k]) => shortNames[k]);

  const strong = (Object.entries(patterns) as [PatternType, number][])
    .filter(([, v]) => v >= 0.4 && v < 0.6)
    .map(([k]) => shortNames[k]);

  const moderate = (Object.entries(patterns) as [PatternType, number][])
    .filter(([, v]) => v >= 0.2 && v < 0.4)
    .map(([k]) => shortNames[k]);

  const parts: string[] = [];

  if (dominant.length > 0) {
    parts.push(`${dominant.join('-')}-Dominant`);
  }

  if (strong.length > 0) {
    if (dominant.length > 0) {
      parts.push(`with ${strong.join('-')} Activation`);
    } else {
      parts.push(`${strong.join('-')}-Strong`);
    }
  }

  if (moderate.length > 0 && dominant.length === 0 && strong.length === 0) {
    parts.push(`Moderate ${moderate.join('-')}`);
  }

  return parts.length > 0 ? parts.join(' ') : 'Balanced Pattern Distribution';
}

/**
 * Generate persona narrative from sign and patterns.
 */
function generatePersonaNarrative(
  sign: ZodiacSign,
  patterns: TSPatternStrengths,
  dominantAxes: Array<{ axis: string; value: number; direction: string }>
): string {
  const lines: string[] = [];

  if (patterns.grand_trine > 0.5) {
    lines.push(`In the soul of ${sign}, rivers flow through ancient channels.`);
  }
  if (patterns.stellium > 0.5) {
    lines.push('One chamber of the cathedral holds many voices singing the same note.');
  }
  if (patterns.kite > 0.4) {
    lines.push('The flow catches wind and becomes a banner visible from far away.');
  }
  if (patterns.t_square > 0.3) {
    lines.push('Sacred friction keeps the structure alive, never fully at rest.');
  }
  if (patterns.yod > 0.2) {
    lines.push('Somewhere in the vault, a finger of light points to a single stone.');
  }
  if (patterns.opposition_chain > 0.2) {
    lines.push('The corridor of mirrors reflects both faces of every truth.');
  }

  if (dominantAxes.length > 0) {
    const traits = dominantAxes.slice(0, 3).map(d => d.direction).join(', ');
    lines.push(`The dominant energies are: ${traits}.`);
  }

  return lines.length > 0 ? lines.join(' ') : `A ${sign} soul with balanced patterns.`;
}

/**
 * Build complete pattern-aware persona from sign and patterns.
 */
export function buildPatternPersona(
  sign: ZodiacSign,
  patterns: TSPatternStrengths,
  influenceWeight: number = PATTERN_INFLUENCE_WEIGHT
): PatternPersona {
  const signArchetype = SIGN_ARCHETYPE_VECTORS[sign] || Array(16).fill(0);
  const modified = applyAllPatternsToArchetype(signArchetype, patterns, influenceWeight);
  const patternSignature = generatePatternSignature(patterns);
  const personaNarrative = generatePersonaNarrative(sign, patterns, modified.dominantAxes);

  return {
    sign,
    signArchetype,
    patternStrengths: patterns,
    patternModifiedArchetype: modified.modifiedVector,
    personaNarrative,
    dominantTraits: modified.dominantAxes,
    patternSignature,
  };
}

/**
 * Calculate pattern similarity between two pattern strength vectors.
 * Used in compatibility scoring for psychological geometry alignment.
 */
export function calculatePatternSimilarity(
  patternsA: TSPatternStrengths,
  patternsB: TSPatternStrengths
): number {
  const vecA = [
    patternsA.grand_trine,
    patternsA.t_square,
    patternsA.stellium,
    patternsA.yod,
    patternsA.kite,
    patternsA.opposition_chain,
  ];
  const vecB = [
    patternsB.grand_trine,
    patternsB.t_square,
    patternsB.stellium,
    patternsB.yod,
    patternsB.kite,
    patternsB.opposition_chain,
  ];

  const sim = cosineSimilarity(vecA, vecB);
  return (sim + 1) / 2; // Map from [-1,1] to [0,1]
}

/**
 * Interpret pattern similarity score.
 */
export function interpretPatternSimilarity(similarity: number): string {
  if (similarity >= 0.8) {
    return 'We move through life the same way - deep structural resonance.';
  } else if (similarity >= 0.6) {
    return "We understand each other's rhythm - compatible geometries.";
  } else if (similarity >= 0.4) {
    return 'We have different but complementary patterns - growth potential.';
  } else if (similarity >= 0.2) {
    return 'We grow in different geometries - requires conscious bridging.';
  }
  return 'Our patterns diverge significantly - challenging but potentially transformative.';
}

/**
 * Calculate full pattern-based compatibility between two charts.
 */
export function calculatePatternCompatibility(
  patternsA: TSPatternStrengths,
  patternsB: TSPatternStrengths,
  signA: ZodiacSign,
  signB: ZodiacSign
): PatternCompatibilityResult {
  const patternSimilarity = calculatePatternSimilarity(patternsA, patternsB);
  const patternInterpretation = interpretPatternSimilarity(patternSimilarity);

  const personaA = buildPatternPersona(signA, patternsA);
  const personaB = buildPatternPersona(signB, patternsB);

  const archetypeSimilarity = cosineSimilarity(
    personaA.patternModifiedArchetype,
    personaB.patternModifiedArchetype
  );

  // Find significant differences
  const significantDifferences: Array<{ axis: string; difference: number }> = [];
  for (let i = 0; i < ARCHETYPE_AXES.length; i++) {
    const diff = Math.abs(
      personaA.patternModifiedArchetype[i] - personaB.patternModifiedArchetype[i]
    );
    if (diff > 0.5) {
      significantDifferences.push({ axis: ARCHETYPE_AXES[i], difference: diff });
    }
  }
  significantDifferences.sort((a, b) => b.difference - a.difference);

  // Generate combined narrative
  let combinedNarrative: string;
  if (patternSimilarity >= 0.7) {
    combinedNarrative = `The ${signA} and ${signB} share similar psychological geometry. Their rivers flow in the same direction.`;
  } else if (patternSimilarity >= 0.4) {
    combinedNarrative = `The ${signA} and ${signB} have complementary patterns. Where one has flow, the other may have friction - this creates dynamic exchange.`;
  } else {
    combinedNarrative = `The ${signA} and ${signB} move through life differently. This requires conscious bridging but offers transformation potential.`;
  }

  return {
    patternSimilarity,
    patternInterpretation,
    archetypeSimilarity: (archetypeSimilarity + 1) / 2,
    significantDifferences: significantDifferences.slice(0, 5),
    signatureA: personaA.patternSignature,
    signatureB: personaB.patternSignature,
    combinedNarrative,
  };
}
