/**
 * ============================================
 * usePersonalityFusion Hook
 * ============================================
 *
 * React hook for computing Luna personality vectors
 * from user's constitutional data (Brain 7A → 7B)
 *
 * Usage:
 *   const { vector, traits, isComputed } = usePersonalityFusion({
 *     bazi: baziData,                                    // P0: BaZi (30% weight)
 *     enneagram: { core: 4, wing: 5 },
 *     natal: { sunSign: 'Pisces', moonSign: 'Cancer' }
 *   });
 *
 * Updated: January 8, 2026 - Added BaZi (P0 Priority)
 */

import { useMemo } from 'react';
import {
  fuseAllSourcesTo30Facets,
  SOURCE_WEIGHTS
} from '../data/personalitySourceMappings';
import { NEO_FACETS, FACET_ORDER, DOMAIN_ORDER } from '../data/neoFacetSchema';

/**
 * Convert 30-facet vector to human-readable trait list
 */
function vectorToTraits30(vector) {
  if (!vector || vector.length !== 30) return [];

  return FACET_ORDER.map((facetKey, idx) => {
    const facet = NEO_FACETS[facetKey];
    return {
      facetKey,
      code: facet.code,
      name: facet.name,
      domain: facet.domain,
      domainName: facet.domainName,
      value: vector[idx],
      percentage: Math.round(vector[idx] * 100)
    };
  });
}

/**
 * Hook to compute personality fusion from available sources
 *
 * @param {Object} sources - Personality data sources
 * @param {Object} sources.bazi - Full BaZi calculation result from calculateBaZi()
 * @param {Object} sources.enneagram - { core, wing?, tritype?, stacking?, level? }
 * @param {Object} sources.natal - { sunSign, moonSign?, risingSign? }
 * @param {string} sources.mbti - e.g., "INFJ"
 * @param {Object} sources.big5 - { openness, conscientiousness, extraversion, agreeableness, neuroticism }
 * @param {number} sources.numerology - Life path number
 */
export function usePersonalityFusion(sources = {}) {
  const result = useMemo(() => {
    // Check if we have any data to compute
    const hasBazi = sources.bazi && !sources.bazi.error;
    const hasEnneagram = sources.enneagram?.core;
    const hasNatal = sources.natal?.sunSign;
    const hasMbti = sources.mbti;
    const hasBig5 = sources.big5;
    const hasNumerology = sources.numerology;

    const hasAnySources = hasBazi || hasEnneagram || hasNatal || hasMbti || hasBig5 || hasNumerology;

    if (!hasAnySources) {
      return {
        vector: null,
        traits: null,
        isComputed: false,
        sources: [],
        dominantFacets: [],
        growthFacets: [],
        domainScores: null
      };
    }

    // Compute the fused 30-facet vector
    const vector = fuseAllSourcesTo30Facets(sources);

    // Convert to human-readable traits
    const traits = vectorToTraits30(vector);

    // Track which sources contributed
    const activeSources = [];
    if (hasBazi) activeSources.push('bazi');
    if (hasEnneagram) activeSources.push('enneagram');
    if (hasNatal) activeSources.push('natal');
    if (hasMbti) activeSources.push('mbti');
    if (hasBig5) activeSources.push('big5');
    if (hasNumerology) activeSources.push('numerology');

    // Find dominant facets (top 5 highest)
    const sorted = [...traits].sort((a, b) => b.value - a.value);
    const dominantFacets = sorted.slice(0, 5);

    // Find growth areas (bottom 3 lowest)
    const growthFacets = sorted.slice(-3).reverse();

    // Calculate domain-level scores (average of 6 facets each)
    const domainScores = {};
    DOMAIN_ORDER.forEach((domain, domainIdx) => {
      const start = domainIdx * 6;
      const domainFacets = vector.slice(start, start + 6);
      const avg = domainFacets.reduce((a, b) => a + b, 0) / 6;
      domainScores[domain] = {
        value: avg,
        percentage: Math.round(avg * 100),
        facets: domainFacets
      };
    });

    return {
      vector,
      traits,
      isComputed: true,
      sources: activeSources,
      dominantFacets,
      growthFacets,
      domainScores,
      sourceWeights: SOURCE_WEIGHTS
    };
  }, [
    sources.bazi?.dayMaster?.chinese,
    sources.bazi?.pillars,
    sources.enneagram?.core,
    sources.enneagram?.wing,
    sources.enneagram?.tritype,
    sources.enneagram?.stacking,
    sources.enneagram?.level,
    sources.natal?.sunSign,
    sources.natal?.moonSign,
    sources.natal?.risingSign,
    sources.mbti,
    sources.big5,
    sources.numerology
  ]);

  return result;
}

/**
 * Quick hook for just Enneagram + Zodiac fusion (108 combos)
 */
export function useEnneagramZodiacFusion(enneagramType, zodiacSign) {
  return useMemo(() => {
    if (!enneagramType || !zodiacSign) {
      return { vector: null, traits: null, isComputed: false };
    }

    const vector = fuseEnneagramZodiac(enneagramType, zodiacSign);
    const traits = vectorToTraits(vector);

    // Find archetype name based on combo
    const archetypeName = getArchetypeName(enneagramType, zodiacSign);

    return {
      vector,
      traits,
      isComputed: true,
      archetypeName,
      combo: `Type ${enneagramType} ${zodiacSign}`
    };
  }, [enneagramType, zodiacSign]);
}

/**
 * Generate archetype name for Enneagram + Zodiac combo
 */
function getArchetypeName(enne, sign) {
  const enneArchetypes = {
    1: 'Reformer',
    2: 'Helper',
    3: 'Achiever',
    4: 'Individualist',
    5: 'Investigator',
    6: 'Loyalist',
    7: 'Enthusiast',
    8: 'Challenger',
    9: 'Peacemaker'
  };

  const signElements = {
    Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
    Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
    Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
  };

  const base = enneArchetypes[enne] || 'Soul';
  const element = signElements[sign] || '';

  // Creative naming based on element + type
  const elementDescriptors = {
    Fire: { 1: 'Blazing', 2: 'Warming', 3: 'Radiant', 4: 'Flame-Touched', 5: 'Illuminated', 6: 'Ember', 7: 'Wildfire', 8: 'Inferno', 9: 'Gentle Flame' },
    Earth: { 1: 'Granite', 2: 'Nurturing', 3: 'Mountain', 4: 'Crystal', 5: 'Stone', 6: 'Rooted', 7: 'Wandering', 8: 'Earthquake', 9: 'Meadow' },
    Air: { 1: 'Precise', 2: 'Breeze', 3: 'Swift', 4: 'Mist', 5: 'Wind', 6: 'Storm-Watcher', 7: 'Whirlwind', 8: 'Thunder', 9: 'Calm Sky' },
    Water: { 1: 'Ice', 2: 'Ocean', 3: 'Current', 4: 'Deep', 5: 'Still Pool', 6: 'Harbor', 7: 'Wave', 8: 'Tsunami', 9: 'Lake' }
  };

  const descriptor = elementDescriptors[element]?.[enne] || element;

  return `The ${descriptor} ${base}`;
}

export default usePersonalityFusion;
