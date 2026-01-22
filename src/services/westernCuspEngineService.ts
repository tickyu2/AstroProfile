/**
 * westernCuspEngineService.ts
 *
 * Service for interacting with the Western Cusp Engine.
 * Handles API calls to Python backend and caching.
 */

import type {
  WesternExpressionVector,
  WesternChart,
  WesternCompatibilityScore,
  SynastryResult,
  PlanetPosition
} from '../types/western.types';

import { computeWesternCompatibility, createDefaultWesternVector } from '../utils/westernExpressionVector';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || '';

// Cache for expression vectors (session-level)
const vectorCache = new Map<string, WesternExpressionVector>();

// =============================================================================
// API CALLS
// =============================================================================

/**
 * Analyze a birth chart and get Western Expression Vector from Python backend.
 *
 * @param birthDatetime - Birth date/time as ISO string
 * @param latitude - Birth location latitude
 * @param longitude - Birth location longitude
 * @param timezone - Timezone string (e.g., 'America/New_York')
 * @param planetPositions - Array of planet positions
 * @returns Complete Western Chart analysis
 */
export async function analyzeWesternChart(
  birthDatetime: string,
  latitude: number,
  longitude: number,
  timezone: string,
  planetPositions: Array<{
    planet: string;
    longitude: number;
    retrograde?: boolean;
  }>
): Promise<WesternChart> {
  try {
    const response = await fetch(`${CLOUD_FUNCTION_URL}/analyze_western`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        birth_datetime: birthDatetime,
        latitude,
        longitude,
        timezone,
        planet_positions: planetPositions
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return transformToWesternChart(data);
  } catch (error) {
    console.error('Error analyzing Western chart:', error);
    throw error;
  }
}

/**
 * Get Western Expression Vector for a profile.
 * Uses cache if available.
 *
 * @param profileId - Profile ID for caching
 * @param birthData - Birth data for calculation
 * @returns Western Expression Vector
 */
export async function getWesternExpressionVector(
  profileId: string,
  birthData?: {
    birthDatetime: string;
    latitude: number;
    longitude: number;
    timezone: string;
    planetPositions: Array<{ planet: string; longitude: number; retrograde?: boolean }>;
  }
): Promise<WesternExpressionVector> {
  // Check cache
  const cached = vectorCache.get(profileId);
  if (cached) {
    return cached;
  }

  // If no birth data, return default
  if (!birthData) {
    console.warn(`No birth data for profile ${profileId}, using default vector`);
    return createDefaultWesternVector();
  }

  try {
    const chart = await analyzeWesternChart(
      birthData.birthDatetime,
      birthData.latitude,
      birthData.longitude,
      birthData.timezone,
      birthData.planetPositions
    );

    // Cache the result
    vectorCache.set(profileId, chart.expressionVector);

    return chart.expressionVector;
  } catch (error) {
    console.error(`Error getting expression vector for ${profileId}:`, error);
    return createDefaultWesternVector();
  }
}

/**
 * Calculate Western compatibility between two profiles.
 *
 * @param profileA - First profile with Western data
 * @param profileB - Second profile with Western data
 * @returns Compatibility score
 */
export async function calculateWesternCompatibilityAsync(
  profileA: { id: string; westernVector?: WesternExpressionVector },
  profileB: { id: string; westernVector?: WesternExpressionVector }
): Promise<WesternCompatibilityScore> {
  // Get vectors (from cache or provided)
  const vecA = profileA.westernVector || vectorCache.get(profileA.id) || createDefaultWesternVector();
  const vecB = profileB.westernVector || vectorCache.get(profileB.id) || createDefaultWesternVector();

  return computeWesternCompatibility(vecA, vecB);
}

/**
 * Get full synastry analysis from Python backend.
 *
 * @param chartA - First chart
 * @param chartB - Second chart
 * @returns Synastry analysis
 */
export async function getSynastryAnalysis(
  chartA: WesternChart,
  chartB: WesternChart
): Promise<SynastryResult> {
  try {
    const response = await fetch(`${CLOUD_FUNCTION_URL}/western_synastry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chart_a: chartA,
        chart_b: chartB
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting synastry analysis:', error);
    throw error;
  }
}

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

/**
 * Clear the expression vector cache.
 */
export function clearVectorCache(): void {
  vectorCache.clear();
}

/**
 * Pre-populate cache with expression vectors.
 *
 * @param vectors - Map of profile ID to vector
 */
export function preloadVectorCache(vectors: Map<string, WesternExpressionVector>): void {
  vectors.forEach((vec, id) => {
    vectorCache.set(id, vec);
  });
}

/**
 * Get cached vector if available.
 *
 * @param profileId - Profile ID
 * @returns Cached vector or undefined
 */
export function getCachedVector(profileId: string): WesternExpressionVector | undefined {
  return vectorCache.get(profileId);
}

// =============================================================================
// DATA TRANSFORMATION
// =============================================================================

/**
 * Transform API response to WesternChart type.
 */
function transformToWesternChart(data: any): WesternChart {
  return {
    birthDatetime: data.birth_datetime,
    latitude: data.location?.latitude ?? 0,
    longitude: data.location?.longitude ?? 0,
    timezone: data.location?.timezone ?? 'UTC',

    planets: (data.planets || []).map((p: any) => ({
      planet: p.planet,
      longitude: p.longitude,
      sign: p.sign,
      degreeInSign: p.degree_in_sign,
      retrograde: p.retrograde || false,
      house: p.house
    })),

    houses: {
      system: data.houses?.system || 'Porphyry',
      cusps: data.houses?.cusps || Array(12).fill(0),
      ascendant: data.houses?.ascendant || 0,
      midheaven: data.houses?.midheaven || 0
    },

    aspects: (data.aspects || []).map((a: any) => ({
      planet1: a.planet1,
      planet2: a.planet2,
      aspectType: a.aspect_type,
      exactAngle: a.exact_angle,
      orb: a.orb,
      applying: a.applying,
      strength: a.strength
    })),

    aspectPatterns: (data.aspect_patterns || []).map((p: any) => ({
      patternType: p.pattern_type,
      planets: p.planets,
      element: p.element,
      modality: p.modality,
      strength: p.strength,
      description: p.description
    })),

    chartShape: {
      primaryShape: data.chart_shape?.primary_shape || 'splash',
      scores: data.chart_shape?.scores || {},
      span: data.chart_shape?.span || 0,
      maxGap: data.chart_shape?.max_gap || 0,
      handlePlanet: data.chart_shape?.handle_planet
    },

    expressionVector: transformToExpressionVector(data.expression_vector),

    summary: {
      sunSign: data.summary?.sun_sign || 'Aries',
      moonSign: data.summary?.moon_sign || 'Aries',
      ascendantSign: data.summary?.ascendant_sign || 'Aries'
    },

    calculatedAt: data.calculated_at || new Date().toISOString()
  };
}

/**
 * Transform API response to WesternExpressionVector type.
 */
function transformToExpressionVector(data: any): WesternExpressionVector {
  if (!data) return createDefaultWesternVector();

  return {
    elements: {
      fire: data.elements?.fire ?? 0.25,
      earth: data.elements?.earth ?? 0.25,
      air: data.elements?.air ?? 0.25,
      water: data.elements?.water ?? 0.25
    },

    modalities: {
      cardinal: data.modalities?.cardinal ?? 0.33,
      fixed: data.modalities?.fixed ?? 0.33,
      mutable: data.modalities?.mutable ?? 0.34
    },

    houseIntensities: data.house_intensities || Array(12).fill(0.083),

    planetaryPsychology: {
      sun: data.planetary_psychology?.sun ?? 0.5,
      moon: data.planetary_psychology?.moon ?? 0.5,
      mercury: data.planetary_psychology?.mercury ?? 0.5,
      venus: data.planetary_psychology?.venus ?? 0.5,
      mars: data.planetary_psychology?.mars ?? 0.5,
      jupiter: data.planetary_psychology?.jupiter ?? 0.5,
      saturn: data.planetary_psychology?.saturn ?? 0.5,
      uranus: data.planetary_psychology?.uranus ?? 0.5,
      neptune: data.planetary_psychology?.neptune ?? 0.5,
      pluto: data.planetary_psychology?.pluto ?? 0.5,
      ascendant: data.planetary_psychology?.ascendant ?? 0.5,
      midheaven: data.planetary_psychology?.midheaven ?? 0.5,
      northNode: data.planetary_psychology?.north_node ?? 0.5,
      chiron: data.planetary_psychology?.chiron ?? 0.5,
      lilith: data.planetary_psychology?.lilith ?? 0.5
    },

    archetypes: {
      warrior: data.archetypes?.warrior ?? 0.11,
      builder: data.archetypes?.builder ?? 0.11,
      messenger: data.archetypes?.messenger ?? 0.11,
      nurturer: data.archetypes?.nurturer ?? 0.11,
      performer: data.archetypes?.performer ?? 0.11,
      analyst: data.archetypes?.analyst ?? 0.11,
      harmonizer: data.archetypes?.harmonizer ?? 0.11,
      transformer: data.archetypes?.transformer ?? 0.11,
      philosopher: data.archetypes?.philosopher ?? 0.12
    },

    aspectPatterns: {
      grandTrine: data.aspect_patterns?.grand_trine ?? 0,
      grandCross: data.aspect_patterns?.grand_cross ?? 0,
      tSquare: data.aspect_patterns?.t_square ?? 0,
      yod: data.aspect_patterns?.yod ?? 0,
      stelliumCount: data.aspect_patterns?.stellium_count ?? 0,
      oppositionTension: data.aspect_patterns?.opposition_tension ?? 0,
      conjunctionPower: data.aspect_patterns?.conjunction_power ?? 0,
      aspectHarmony: data.aspect_patterns?.aspect_harmony ?? 0.5
    },

    dominance: {
      dominantSign: {
        sign: data.dominance?.dominant_sign || 'Aries',
        strength: data.dominance?.sign_strength ?? 0.25
      },
      dominantPlanet: {
        planet: data.dominance?.dominant_planet || 'Sun',
        strength: data.dominance?.planet_strength ?? 0.5
      },
      dominantHouse: {
        house: data.dominance?.dominant_house || 1,
        strength: data.dominance?.house_strength ?? 0.25
      },
      elementPurity: data.dominance?.element_purity ?? 0.25,
      modalityPurity: data.dominance?.modality_purity ?? 0.33,
      yangYinRatio: data.dominance?.yang_yin_ratio ?? 0.5,
      nightDayEmphasis: data.dominance?.night_day_emphasis ?? 0.5,
      retrogradeCount: data.dominance?.retrograde_count ?? 0,
      dignityScore: data.dominance?.dignity_score ?? 0.5
    },

    chartShape: {
      bowl: data.chart_shape?.bowl ?? 0,
      bucket: data.chart_shape?.bucket ?? 0,
      locomotive: data.chart_shape?.locomotive ?? 0,
      bundle: data.chart_shape?.bundle ?? 0,
      splash: data.chart_shape?.splash ?? 0,
      seesaw: data.chart_shape?.seesaw ?? 0,
      detected: data.chart_shape?.detected || 'splash'
    },

    vector: data.vector,
    vectorDimensions: data.vector_dimensions
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  computeWesternCompatibility,
  createDefaultWesternVector,
  flattenWesternVector
} from '../utils/westernExpressionVector';
