/**
 * useRelationship Hook
 *
 * Fetches a single relationship's complete polarity data.
 * Includes: polarity score, archetype, evolution timeline, forecast, support/challenges.
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Fetch relationship data by ID
 * @param {string} relationshipId - The relationship document ID
 * @returns {Object} { data, loading, error, refetch }
 */
export function useRelationship(relationshipId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!relationshipId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/relationship/${relationshipId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch relationship: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error('useRelationship error:', err);
      setError(err.message || 'Failed to load relationship');
    } finally {
      setLoading(false);
    }
  }, [relationshipId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Build relationship data from two person profiles
 * @param {Object} personA - First person's profile
 * @param {Object} personB - Second person's profile
 * @returns {Object} { data, loading, error }
 */
export function useRelationshipFromProfiles(personA, personB) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!personA || !personB) {
      setLoading(false);
      return;
    }

    async function buildRelationship() {
      try {
        setLoading(true);
        setError(null);

        // Import services dynamically
        const { buildPolarityMap, computeWeightedPolarityScore, buildPolarityArchetype } = await import('../services/vedicCompatibilityService');
        const { buildWesternVedicFusion } = await import('../services/fusionLayerService');
        const { buildWesternSynastryHeatmap } = await import('../services/synastryHeatmapService');

        // Build polarity map
        const polarityMap = buildPolarityMap(personA, personB);

        // Compute weighted score
        const polarityScore = computeWeightedPolarityScore(polarityMap);

        // Build archetype
        const archetype = buildPolarityArchetype(polarityMap, polarityScore);

        // Build yin/yang polarity data
        const yinYangPolarity = {
          personA: (personA.westernProfile?.planets || []).map(p => ({
            planet: p.planet,
            polarity: p.polarity
          })),
          personB: (personB.westernProfile?.planets || []).map(p => ({
            planet: p.planet,
            polarity: p.polarity
          }))
        };

        // Build synastry heatmap
        const synastryHeatmap = buildWesternSynastryHeatmap(
          personA.westernProfile?.planets || [],
          personB.westernProfile?.planets || []
        );

        // Build fusion (if both have Western and Vedic profiles)
        let fusion = null;
        if (personA.westernProfile && personA.vedicProfile && personB.westernProfile && personB.vedicProfile) {
          const { buildCoupleFusion } = await import('../services/fusionLayerService');
          fusion = buildCoupleFusion(
            personA.westernProfile,
            personA.vedicProfile,
            personB.westernProfile,
            personB.vedicProfile
          );
        }

        setData({
          personA,
          personB,
          polarityMap,
          polarityScore,
          archetype,
          yinYangPolarity,
          synastryHeatmap,
          fusion,
          // These would come from additional computations
          evolutionTimeline: null,
          forecastTimeline: null,
          support: null,
          challenges: null
        });
      } catch (err) {
        console.error('useRelationshipFromProfiles error:', err);
        setError(err.message || 'Failed to build relationship');
      } finally {
        setLoading(false);
      }
    }

    buildRelationship();
  }, [personA, personB]);

  return { data, loading, error };
}

export default useRelationship;
