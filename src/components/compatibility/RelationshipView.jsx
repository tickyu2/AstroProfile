/**
 * RelationshipView
 *
 * Main layout component for the Relationship Cathedral.
 * Renders all polarity, archetype, and evolution components in canonical order.
 *
 * Stack Order:
 * 1. Relationship Polarity Score
 * 2. Polarity Archetype
 * 3. Archetype Evolution Timeline
 * 4. Composite Archetype Forecast Timeline
 * 5. Yin/Yang Heatmap
 * 6. Polarity Archetype Diff (if comparing)
 * 7. Archetype Evolution Diff (if comparing)
 * 8. Polarity Map
 * 9. What Supports This Relationship
 * 10. What Challenges This Relationship
 */

import './RelationshipView.css';

// Core components
import RelationshipPolarityScore from './RelationshipPolarityScore';
import RelationshipPolarityArchetype from './RelationshipPolarityArchetype';
import ArchetypeEvolutionTimeline from './ArchetypeEvolutionTimeline';
import CompositeArchetypeForecastTimeline from './CompositeArchetypeForecastTimeline';
import RelationshipPolarityMapPanel from './RelationshipPolarityMapPanel';
import RelationshipSupportPanel from './RelationshipSupportPanel';
import RelationshipChallengesPanel from './RelationshipChallengesPanel';

// New components
import YinYangHeatmap from './YinYangHeatmap';
import PolarityArchetypeDiffPanel from './PolarityArchetypeDiffPanel';
import ArchetypeEvolutionDiffPanel from './ArchetypeEvolutionDiffPanel';

// Section divider component
function SectionDivider({ label }) {
  return (
    <div className="section-divider">
      <span>{label}</span>
    </div>
  );
}

export default function RelationshipView({
  relationshipA,
  relationshipB = null,
  labelA = 'Relationship A',
  labelB = 'Relationship B'
}) {
  if (!relationshipA) {
    return (
      <div className="relationship-view">
        <div className="empty-state">
          <div className="empty-state-icon">🌙</div>
          <p className="empty-state-text">No relationship data available</p>
        </div>
      </div>
    );
  }

  const {
    polarityScore,
    archetype,
    polarityMap,
    evolutionTimeline,
    forecastTimeline,
    support,
    challenges,
    yinYangPolarity,
    personA,
    personB
  } = relationshipA;

  // Check if we're in comparison mode
  const isComparing = relationshipB !== null;

  // Build yin/yang data from planets if not pre-computed
  const yinYangDataA = yinYangPolarity?.personA || personA?.planets?.map(p => ({
    planet: p.planet,
    polarity: p.polarity
  })) || [];

  const yinYangDataB = yinYangPolarity?.personB || personB?.planets?.map(p => ({
    planet: p.planet,
    polarity: p.polarity
  })) || [];

  // Build diff data for comparison mode
  const polarityDiff = isComparing ? {
    summary: buildPolarityDiffSummary(relationshipA, relationshipB),
    scoreComparison: {
      scoreA: relationshipA.polarityScore?.score || 0,
      scoreB: relationshipB.polarityScore?.score || 0,
      difference: Math.abs((relationshipA.polarityScore?.score || 0) - (relationshipB.polarityScore?.score || 0)),
      stronger: (relationshipA.polarityScore?.score || 0) > (relationshipB.polarityScore?.score || 0) ? 'A' : 'B'
    },
    archetypeComparison: {
      nameA: relationshipA.archetype?.name || 'Unknown',
      nameB: relationshipB.archetype?.name || 'Unknown',
      iconA: relationshipA.archetype?.icon || '🎯',
      iconB: relationshipB.archetype?.icon || '🎯',
      sameArchetype: relationshipA.archetype?.name === relationshipB.archetype?.name
    },
    differences: buildPolarityDifferences(relationshipA, relationshipB),
    teachingContrast: [
      `Relationship A teaches: ${relationshipA.archetype?.teachings || 'dynamic growth'}`,
      `Relationship B teaches: ${relationshipB.archetype?.teachings || 'stable presence'}`
    ],
    energeticShift: [
      buildEnergeticShift(relationshipA, relationshipB)
    ]
  } : null;

  const evolutionDiff = isComparing ? {
    summary: buildEvolutionDiffSummary(relationshipA, relationshipB),
    timelineComparison: buildTimelineComparison(relationshipA, relationshipB),
    archetypeShifts: buildArchetypeShifts(relationshipA, relationshipB),
    karmicRhythm: buildKarmicRhythm(relationshipA, relationshipB),
    growthContrast: buildGrowthContrast(relationshipA, relationshipB),
    shadowContrast: buildShadowContrast(relationshipA, relationshipB),
    periodCounts: {
      relationshipA: countPeriodTypes(relationshipA.evolutionTimeline),
      relationshipB: countPeriodTypes(relationshipB.evolutionTimeline)
    }
  } : null;

  return (
    <div className="relationship-view">
      {/* Header */}
      <div className="relationship-view-header">
        <h1>{isComparing ? 'Relationship Comparison' : 'Relationship Cathedral'}</h1>
        <p>{isComparing ? `Comparing ${labelA} and ${labelB}` : 'Complete Polarity Analysis'}</p>
      </div>

      {/* 1. Polarity Score */}
      {polarityScore && (
        <RelationshipPolarityScore score={polarityScore} />
      )}

      {/* 2. Archetype */}
      {archetype && (
        <RelationshipPolarityArchetype archetype={archetype} />
      )}

      <SectionDivider label="Temporal Evolution" />

      {/* 3. Evolution Timeline */}
      {evolutionTimeline && (
        <ArchetypeEvolutionTimeline timeline={evolutionTimeline} />
      )}

      {/* 4. Forecast Timeline */}
      {forecastTimeline && (
        <CompositeArchetypeForecastTimeline forecastTimeline={forecastTimeline} />
      )}

      <SectionDivider label="Polarity Dynamics" />

      {/* 5. Yin/Yang Heatmap */}
      {(yinYangDataA.length > 0 && yinYangDataB.length > 0) && (
        <YinYangHeatmap
          personA={yinYangDataA}
          personB={yinYangDataB}
          labelA={personA?.name || 'Person A'}
          labelB={personB?.name || 'Person B'}
        />
      )}

      {/* Comparison Section (only in diff mode) */}
      {isComparing && (
        <>
          <SectionDivider label="Relationship Comparison" />

          {/* 6. Polarity Archetype Diff */}
          <PolarityArchetypeDiffPanel
            diff={polarityDiff}
            labelA={labelA}
            labelB={labelB}
          />

          {/* 7. Archetype Evolution Diff */}
          <ArchetypeEvolutionDiffPanel
            diff={evolutionDiff}
            labelA={labelA}
            labelB={labelB}
          />
        </>
      )}

      <SectionDivider label="Polarity Map" />

      {/* 8. Polarity Map */}
      {polarityMap && (
        <RelationshipPolarityMapPanel polarityMap={polarityMap} />
      )}

      <SectionDivider label="Relationship Dynamics" />

      {/* 9. Support */}
      {support && (
        <RelationshipSupportPanel support={support} />
      )}

      {/* 10. Challenges */}
      {challenges && (
        <RelationshipChallengesPanel challenges={challenges} />
      )}
    </div>
  );
}

// =============================================================================
// DIFF HELPER FUNCTIONS
// =============================================================================

function buildPolarityDiffSummary(relA, relB) {
  const scoreA = relA.polarityScore?.score || 0;
  const scoreB = relB.polarityScore?.score || 0;
  const archA = relA.archetype?.name || 'Unknown';
  const archB = relB.archetype?.name || 'Unknown';

  if (archA === archB) {
    return `Both relationships share the '${archA}' archetype, with ${Math.abs(scoreA - scoreB)} points difference in polarity intensity.`;
  }
  return `Relationship A expresses '${archA}' while Relationship B expresses '${archB}', representing fundamentally different relational dynamics.`;
}

function buildPolarityDifferences(relA, relB) {
  const diffs = [];
  const scoreA = relA.polarityScore?.score || 0;
  const scoreB = relB.polarityScore?.score || 0;

  if (Math.abs(scoreA - scoreB) > 10) {
    diffs.push(`Polarity intensity differs by ${Math.abs(scoreA - scoreB)} points`);
  }

  if (relA.polarityMap?.dominantAxis !== relB.polarityMap?.dominantAxis) {
    diffs.push(`Different dominant polarity axes: A=${relA.polarityMap?.dominantAxis || 'unknown'}, B=${relB.polarityMap?.dominantAxis || 'unknown'}`);
  }

  if (relA.archetype?.name !== relB.archetype?.name) {
    diffs.push('Different relational archetypes expressing unique lessons');
  }

  return diffs;
}

function buildEnergeticShift(relA, relB) {
  const scoreA = relA.polarityScore?.score || 0;
  const scoreB = relB.polarityScore?.score || 0;

  if (scoreA > scoreB + 15) {
    return 'Moving from A to B represents a shift toward calmer, more harmonious energy.';
  } else if (scoreB > scoreA + 15) {
    return 'Moving from A to B represents a shift toward more dynamic, transformative energy.';
  }
  return 'Both relationships operate at similar energetic intensity levels.';
}

function buildEvolutionDiffSummary(relA, relB) {
  const timelineA = relA.evolutionTimeline || [];
  const timelineB = relB.evolutionTimeline || [];

  if (timelineA.length === 0 && timelineB.length === 0) {
    return 'No evolution timeline data available for comparison.';
  }

  return `Comparing ${timelineA.length} periods in Relationship A with ${timelineB.length} periods in Relationship B reveals distinct karmic rhythms and growth trajectories.`;
}

function buildTimelineComparison(relA, relB) {
  const comparisons = [];
  const timelineA = relA.evolutionTimeline || [];
  const timelineB = relB.evolutionTimeline || [];

  if (timelineA.length !== timelineB.length) {
    comparisons.push(`Different timeline lengths: A has ${timelineA.length} periods, B has ${timelineB.length} periods`);
  }

  return comparisons;
}

function buildArchetypeShifts(relA, relB) {
  const shifts = [];
  const timelineA = relA.evolutionTimeline || [];
  const timelineB = relB.evolutionTimeline || [];

  const archetypesA = [...new Set(timelineA.map(t => t.archetype))];
  const archetypesB = [...new Set(timelineB.map(t => t.archetype))];

  if (archetypesA.length !== archetypesB.length) {
    shifts.push(`Relationship A cycles through ${archetypesA.length} archetypes, B through ${archetypesB.length}`);
  }

  return shifts;
}

function buildKarmicRhythm(relA, relB) {
  const rhythm = [];
  const countsA = countPeriodTypes(relA.evolutionTimeline || []);
  const countsB = countPeriodTypes(relB.evolutionTimeline || []);

  if ((countsA.karmic || 0) > (countsB.karmic || 0)) {
    rhythm.push('Relationship A has more karmic intensity periods');
  } else if ((countsB.karmic || 0) > (countsA.karmic || 0)) {
    rhythm.push('Relationship B has more karmic intensity periods');
  }

  return rhythm;
}

function buildGrowthContrast(relA, relB) {
  const contrasts = [];
  const countsA = countPeriodTypes(relA.evolutionTimeline || []);
  const countsB = countPeriodTypes(relB.evolutionTimeline || []);

  if ((countsA.growth || 0) > (countsB.growth || 0)) {
    contrasts.push('Relationship A has more expansion-focused periods');
  } else if ((countsB.growth || 0) > (countsA.growth || 0)) {
    contrasts.push('Relationship B has more expansion-focused periods');
  }

  return contrasts;
}

function buildShadowContrast(relA, relB) {
  const contrasts = [];
  const countsA = countPeriodTypes(relA.evolutionTimeline || []);
  const countsB = countPeriodTypes(relB.evolutionTimeline || []);

  if ((countsA.shadow || 0) > (countsB.shadow || 0)) {
    contrasts.push('Relationship A faces more challenging shadow periods');
  } else if ((countsB.shadow || 0) > (countsA.shadow || 0)) {
    contrasts.push('Relationship B faces more challenging shadow periods');
  }

  return contrasts;
}

function countPeriodTypes(timeline) {
  const counts = { karmic: 0, growth: 0, shadow: 0 };
  const karmicPlanets = ['Saturn', 'Ketu', 'Rahu'];
  const growthPlanets = ['Jupiter', 'Venus'];
  const shadowPlanets = ['Saturn', 'Mars', 'Rahu'];

  for (const period of timeline) {
    const planet = period.planet || '';
    if (karmicPlanets.includes(planet)) counts.karmic++;
    if (growthPlanets.includes(planet)) counts.growth++;
    if (shadowPlanets.includes(planet)) counts.shadow++;
  }

  return counts;
}
