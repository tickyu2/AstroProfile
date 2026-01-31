/**
 * useRelationshipDiff Hook
 *
 * Fetches two relationships for side-by-side comparison.
 * Supports both API-based and profile-based relationship building.
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Fetch two relationships for comparison
 * @param {string} relationshipIdA - First relationship ID
 * @param {string} relationshipIdB - Second relationship ID
 * @returns {Object} { dataA, dataB, loading, error, refetch }
 */
export function useRelationshipDiff(relationshipIdA, relationshipIdB) {
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!relationshipIdA || !relationshipIdB) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch both relationships in parallel
      const [responseA, responseB] = await Promise.all([
        fetch(`/api/relationship/${relationshipIdA}`),
        fetch(`/api/relationship/${relationshipIdB}`)
      ]);

      if (!responseA.ok) {
        throw new Error(`Failed to fetch relationship A: ${responseA.status}`);
      }
      if (!responseB.ok) {
        throw new Error(`Failed to fetch relationship B: ${responseB.status}`);
      }

      const [jsonA, jsonB] = await Promise.all([
        responseA.json(),
        responseB.json()
      ]);

      setDataA(jsonA);
      setDataB(jsonB);
    } catch (err) {
      console.error('useRelationshipDiff error:', err);
      setError(err.message || 'Failed to load relationships');
    } finally {
      setLoading(false);
    }
  }, [relationshipIdA, relationshipIdB]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dataA,
    dataB,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Compare two relationships built from profile pairs
 * @param {Object} coupleA - { personA, personB } for first relationship
 * @param {Object} coupleB - { personA, personB } for second relationship
 * @returns {Object} { dataA, dataB, diffAnalysis, loading, error }
 */
export function useRelationshipDiffFromProfiles(coupleA, coupleB) {
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [diffAnalysis, setDiffAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coupleA?.personA || !coupleA?.personB || !coupleB?.personA || !coupleB?.personB) {
      setLoading(false);
      return;
    }

    async function buildComparison() {
      try {
        setLoading(true);
        setError(null);

        // Import services dynamically
        const { buildPolarityMap, computeWeightedPolarityScore, buildPolarityArchetype } = await import('../services/vedicCompatibilityService');

        // Build relationship A
        const polarityMapA = buildPolarityMap(coupleA.personA, coupleA.personB);
        const polarityScoreA = computeWeightedPolarityScore(polarityMapA);
        const archetypeA = buildPolarityArchetype(polarityMapA, polarityScoreA);

        const relationshipA = {
          personA: coupleA.personA,
          personB: coupleA.personB,
          polarityMap: polarityMapA,
          polarityScore: polarityScoreA,
          archetype: archetypeA,
          yinYangPolarity: buildYinYangPolarity(coupleA.personA, coupleA.personB)
        };

        // Build relationship B
        const polarityMapB = buildPolarityMap(coupleB.personA, coupleB.personB);
        const polarityScoreB = computeWeightedPolarityScore(polarityMapB);
        const archetypeB = buildPolarityArchetype(polarityMapB, polarityScoreB);

        const relationshipB = {
          personA: coupleB.personA,
          personB: coupleB.personB,
          polarityMap: polarityMapB,
          polarityScore: polarityScoreB,
          archetype: archetypeB,
          yinYangPolarity: buildYinYangPolarity(coupleB.personA, coupleB.personB)
        };

        // Build diff analysis
        const analysis = buildDiffAnalysis(relationshipA, relationshipB);

        setDataA(relationshipA);
        setDataB(relationshipB);
        setDiffAnalysis(analysis);
      } catch (err) {
        console.error('useRelationshipDiffFromProfiles error:', err);
        setError(err.message || 'Failed to build comparison');
      } finally {
        setLoading(false);
      }
    }

    buildComparison();
  }, [coupleA, coupleB]);

  return { dataA, dataB, diffAnalysis, loading, error };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function buildYinYangPolarity(personA, personB) {
  return {
    personA: (personA.westernProfile?.planets || []).map(p => ({
      planet: p.planet,
      polarity: p.polarity
    })),
    personB: (personB.westernProfile?.planets || []).map(p => ({
      planet: p.planet,
      polarity: p.polarity
    }))
  };
}

function buildDiffAnalysis(relationshipA, relationshipB) {
  const scoreA = relationshipA.polarityScore?.score || 0;
  const scoreB = relationshipB.polarityScore?.score || 0;
  const archA = relationshipA.archetype?.name || 'Unknown';
  const archB = relationshipB.archetype?.name || 'Unknown';

  return {
    scoreDifference: Math.abs(scoreA - scoreB),
    strongerRelationship: scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'equal',
    sameArchetype: archA === archB,
    archetypeA: archA,
    archetypeB: archB,
    summary: archA === archB
      ? `Both relationships share the '${archA}' archetype with ${Math.abs(scoreA - scoreB)} points difference.`
      : `Relationship A expresses '${archA}' while B expresses '${archB}'.`,
    insights: buildDiffInsights(relationshipA, relationshipB)
  };
}

function buildDiffInsights(relA, relB) {
  const insights = [];
  const scoreA = relA.polarityScore?.score || 0;
  const scoreB = relB.polarityScore?.score || 0;

  // Score insight
  if (Math.abs(scoreA - scoreB) > 15) {
    insights.push({
      type: 'intensity',
      text: scoreA > scoreB
        ? 'Relationship A has significantly more dynamic tension.'
        : 'Relationship B has significantly more dynamic tension.'
    });
  }

  // Archetype insight
  if (relA.archetype?.name !== relB.archetype?.name) {
    insights.push({
      type: 'archetype',
      text: 'Different archetypes mean different relational lessons and growth paths.'
    });
  }

  // Polarity axis insight
  const axisA = relA.polarityMap?.dominantAxis;
  const axisB = relB.polarityMap?.dominantAxis;
  if (axisA && axisB && axisA !== axisB) {
    insights.push({
      type: 'axis',
      text: `Different dominant axes: A emphasizes ${axisA}, B emphasizes ${axisB}.`
    });
  }

  return insights;
}

export default useRelationshipDiff;
