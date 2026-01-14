/**
 * ============================================================================
 * SEASONALITY PAIR COMPARISON - TWO PEOPLE SIDE BY SIDE
 * ============================================================================
 *
 * "I see why you are like this, and I honor it."
 *
 * This component displays two people's seasonality profiles side-by-side,
 * showing how their elemental constitutions relate to each other.
 *
 * Philosophy: Understanding differences leads to mutual respect.
 *
 * Created: January 2026
 * Based on: Classical BaZi compatibility principles
 * ============================================================================
 */

import React, { useMemo, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsivePie } from '@nivo/pie';
import {
  computePairSeasonality,
  createPersonProfile
} from '../../../utils/baziSeasonalityPair';
import {
  ELEMENT_COLORS,
  ELEMENT_CHINESE
} from '../../../utils/baziSeasonality';
import { buildPairSeasonalityStory } from '../../../utils/baziSeasonalityStory';
import { useBaziTheme, getElementIcon } from '../theme/BaziTheme';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SeasonalityPairComparison({
  personAConfig,
  personBConfig,
  showStoryMode = true,
  showDetailedMetrics = true
}) {
  const theme = useBaziTheme();
  const isDark = theme?.mode === 'dark' || true;
  const [activeTab, setActiveTab] = useState('overview');

  // Create profiles and compute comparison
  const comparison = useMemo(() => {
    if (!personAConfig || !personBConfig) return null;

    const profileA = createPersonProfile(
      personAConfig.label || 'Person A',
      personAConfig.rawElements,
      personAConfig.monthBranch,
      personAConfig.dmStem,
      personAConfig.rawDmStrength || 0.5
    );

    const profileB = createPersonProfile(
      personBConfig.label || 'Person B',
      personBConfig.rawElements,
      personBConfig.monthBranch,
      personBConfig.dmStem,
      personBConfig.rawDmStrength || 0.5
    );

    return computePairSeasonality(profileA, profileB);
  }, [personAConfig, personBConfig]);

  // Generate story
  const pairStory = useMemo(() => {
    if (!comparison) return '';
    return buildPairSeasonalityStory(
      comparison.personA.seasonality,
      comparison.personB.seasonality,
      comparison.personA.label,
      comparison.personB.label
    );
  }, [comparison]);

  if (!comparison) {
    return (
      <div className="p-4 text-center text-white/40">
        Please provide data for both people to compare.
      </div>
    );
  }

  const { personA, personB, harmonicScore, insights } = comparison;

  return (
    <div className="space-y-6">
      {/* Header with Harmonic Score */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Seasonality Pair Comparison
        </h3>
        <HarmonicScoreBadge score={harmonicScore} isDark={isDark} />
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-2 p-1 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
        {['overview', 'elements', 'dm', 'tengods', 'story'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-white text-amber-700 shadow-sm')
                : (isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-700')
            }`}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'elements' && 'Elements'}
            {tab === 'dm' && 'Day Master'}
            {tab === 'tengods' && 'Ten Gods'}
            {tab === 'story' && 'Story'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab comparison={comparison} isDark={isDark} />
      )}

      {activeTab === 'elements' && (
        <ElementsTab comparison={comparison} isDark={isDark} />
      )}

      {activeTab === 'dm' && (
        <DayMasterTab comparison={comparison} isDark={isDark} />
      )}

      {activeTab === 'tengods' && (
        <TenGodsTab comparison={comparison} isDark={isDark} />
      )}

      {activeTab === 'story' && showStoryMode && (
        <StoryTab story={pairStory} isDark={isDark} />
      )}

      {/* Insights Panel */}
      <InsightsPanel insights={insights} isDark={isDark} />
    </div>
  );
}

// ============================================================================
// HARMONIC SCORE BADGE
// ============================================================================

function HarmonicScoreBadge({ score, isDark }) {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (s >= 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    if (s >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Strong Harmony';
    if (s >= 60) return 'Good Compatibility';
    if (s >= 40) return 'Growth Opportunity';
    return 'Complementary Differences';
  };

  return (
    <div className={`px-4 py-2 rounded-lg border ${getScoreColor(score)}`}>
      <div className="text-center">
        <div className="text-2xl font-bold">{score}%</div>
        <div className="text-xs opacity-80">{getScoreLabel(score)}</div>
      </div>
    </div>
  );
}

// ============================================================================
// OVERVIEW TAB
// ============================================================================

function OverviewTab({ comparison, isDark }) {
  const { personA, personB, sameSeason, seasonRelation, elementResonance, dmInteraction } = comparison;

  return (
    <div className="space-y-6">
      {/* Side-by-Side Season Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonSeasonCard person={personA} isDark={isDark} side="A" />
        <PersonSeasonCard person={personB} isDark={isDark} side="B" />
      </div>

      {/* Relationship Summary */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Relationship Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Same Season"
            value={sameSeason ? 'Yes' : 'No'}
            icon={sameSeason ? '=' : '!='}
            positive={sameSeason}
            isDark={isDark}
          />
          <MetricCard
            label="Season Relation"
            value={capitalize(seasonRelation)}
            icon={getSeasonRelationIcon(seasonRelation)}
            positive={seasonRelation === 'same' || seasonRelation === 'adjacent'}
            isDark={isDark}
          />
          <MetricCard
            label="Element Resonance"
            value={`${elementResonance.resonanceScore}%`}
            icon={elementResonance.resonanceScore >= 60 ? '+' : '-'}
            positive={elementResonance.resonanceScore >= 60}
            isDark={isDark}
          />
          <MetricCard
            label="DM Compatibility"
            value={`${dmInteraction.compatibilityScore}%`}
            icon={dmInteraction.compatibilityScore >= 60 ? '+' : '-'}
            positive={dmInteraction.compatibilityScore >= 60}
            isDark={isDark}
          />
        </div>
      </div>

      {/* DM Interaction Description */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'} border`}>
        <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
          <span>Core Interaction</span>
        </h4>
        <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
          {dmInteraction.dynamicDescription}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// ELEMENTS TAB
// ============================================================================

function ElementsTab({ comparison, isDark }) {
  const { personA, personB, elementResonance } = comparison;

  // Prepare radar data for super-imposed comparison
  const radarData = [
    {
      element: 'Wood',
      [personA.label]: personA.seasonality.adjustedNormalized.wood,
      [personB.label]: personB.seasonality.adjustedNormalized.wood
    },
    {
      element: 'Fire',
      [personA.label]: personA.seasonality.adjustedNormalized.fire,
      [personB.label]: personB.seasonality.adjustedNormalized.fire
    },
    {
      element: 'Earth',
      [personA.label]: personA.seasonality.adjustedNormalized.earth,
      [personB.label]: personB.seasonality.adjustedNormalized.earth
    },
    {
      element: 'Metal',
      [personA.label]: personA.seasonality.adjustedNormalized.metal,
      [personB.label]: personB.seasonality.adjustedNormalized.metal
    },
    {
      element: 'Water',
      [personA.label]: personA.seasonality.adjustedNormalized.water,
      [personB.label]: personB.seasonality.adjustedNormalized.water
    }
  ];

  return (
    <div className="space-y-6">
      {/* Super-Imposed Radar */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Elemental Fingerprints Overlay
        </h4>
        <div className="h-[300px]">
          <ResponsiveRadar
            data={radarData}
            keys={[personA.label, personB.label]}
            indexBy="element"
            maxValue={50}
            margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
            borderWidth={2}
            gridLevels={5}
            gridShape="circular"
            gridLabelOffset={20}
            dotSize={8}
            dotBorderWidth={2}
            colors={['#f59e0b', '#3b82f6']}  // Amber for A, Blue for B
            fillOpacity={0.2}
            motionConfig="gentle"
            legends={[
              {
                anchor: 'top-right',
                direction: 'column',
                translateX: 0,
                translateY: -30,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                symbolSize: 12,
                symbolShape: 'circle'
              }
            ]}
            theme={{
              axis: {
                ticks: { text: { fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 12 } }
              },
              grid: { line: { stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }
            }}
          />
        </div>
      </div>

      {/* Element-by-Element Comparison Bars */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Element-by-Element Comparison
        </h4>
        <div className="space-y-4">
          {['wood', 'fire', 'earth', 'metal', 'water'].map((el) => (
            <ElementComparisonRow
              key={el}
              element={el}
              valueA={personA.seasonality.adjustedNormalized[el]}
              valueB={personB.seasonality.adjustedNormalized[el]}
              labelA={personA.label}
              labelB={personB.label}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Resonance Analysis */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Resonance Analysis
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Dominant Relation</div>
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {capitalize(elementResonance.dominantRelation)}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Balance</div>
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {elementResonance.strengthBalance === 'balanced' ? 'Balanced' :
               elementResonance.strengthBalance === 'A_stronger' ? `${personA.label} Stronger` :
               `${personB.label} Stronger`}
            </div>
          </div>
        </div>
        {elementResonance.complementaryElements.length > 0 && (
          <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
            <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>
              Complementary: {elementResonance.complementaryElements.map(capitalize).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// DAY MASTER TAB
// ============================================================================

function DayMasterTab({ comparison, isDark }) {
  const { personA, personB, dmInteraction } = comparison;

  return (
    <div className="space-y-6">
      {/* Side-by-Side DM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DMCard person={personA} isDark={isDark} />
        <DMCard person={personB} isDark={isDark} />
      </div>

      {/* Interaction Panel */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'} border`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
          Day Master Interaction
        </h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {getElementIcon(personA.dmSeasonal.dmElement)}
            </div>
            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {personA.label}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {getRelationArrow(dmInteraction.relation)}
            </div>
            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {formatRelation(dmInteraction.relation)}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {getElementIcon(personB.dmSeasonal.dmElement)}
            </div>
            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {personB.label}
            </div>
          </div>
        </div>
        <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
          {dmInteraction.dynamicDescription}
        </p>
      </div>

      {/* Strength Comparison Bar */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Day Master Strength Comparison
        </h4>
        <div className="space-y-4">
          <StrengthBar
            label={personA.label}
            value={personA.dmSeasonal.adjustedStrength * 100}
            category={personA.dmSeasonal.strengthCategory}
            color="#f59e0b"
            isDark={isDark}
          />
          <StrengthBar
            label={personB.label}
            value={personB.dmSeasonal.adjustedStrength * 100}
            category={personB.dmSeasonal.strengthCategory}
            color="#3b82f6"
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TEN GODS TAB
// ============================================================================

function TenGodsTab({ comparison, isDark }) {
  const { personA, personB, tenGodsCompatibility } = comparison;

  const categories = ['resource', 'companion', 'output', 'wealth', 'officer'];
  const categoryLabels = {
    resource: 'Resource (Support)',
    companion: 'Companion (Peers)',
    output: 'Output (Expression)',
    wealth: 'Wealth (Resources)',
    officer: 'Officer (Career)'
  };

  return (
    <div className="space-y-6">
      {/* Ten Gods Comparison Chart */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Ten Gods Life Domains Comparison
        </h4>
        <div className="space-y-4">
          {categories.map((cat) => {
            const valueA = personA.tenGodsSeasonal.tenGods[cat].adjusted * 100;
            const valueB = personB.tenGodsSeasonal.tenGods[cat].adjusted * 100;
            const harmony = tenGodsCompatibility[`${cat}Harmony`] ||
              tenGodsCompatibility[`${cat}Energy`] ||
              tenGodsCompatibility[`${cat}Synergy`] ||
              tenGodsCompatibility[`${cat}Alignment`] ||
              tenGodsCompatibility[`${cat}Balance`] || 0.5;

            return (
              <TenGodComparisonRow
                key={cat}
                label={categoryLabels[cat]}
                valueA={valueA}
                valueB={valueB}
                harmony={harmony}
                labelA={personA.label}
                labelB={personB.label}
                isDark={isDark}
              />
            );
          })}
        </div>
      </div>

      {/* Strongest and Weakest Domains */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
          <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            Strongest Alignment
          </h4>
          <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {categoryLabels[tenGodsCompatibility.strongestDomain]}
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            This life domain has the most natural harmony between you.
          </p>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'} border`}>
          <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
            Growth Opportunity
          </h4>
          <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {categoryLabels[tenGodsCompatibility.weakestDomain]}
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            This life domain may require more conscious attention.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STORY TAB
// ============================================================================

function StoryTab({ story, isDark }) {
  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border`}>
      <pre className={`text-sm leading-relaxed whitespace-pre-wrap font-sans ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
        {story}
      </pre>
    </div>
  );
}

// ============================================================================
// INSIGHTS PANEL
// ============================================================================

function InsightsPanel({ insights, isDark }) {
  return (
    <div className="space-y-4">
      {/* Strengths */}
      {insights.strengths.length > 0 && (
        <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
          <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            <span>+</span> Strengths
          </h4>
          <ul className={`text-sm space-y-1 ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
            {insights.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Challenges */}
      {insights.challenges.length > 0 && (
        <div className={`p-4 rounded-xl ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'} border`}>
          <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
            <span>!</span> Challenges
          </h4>
          <ul className={`text-sm space-y-1 ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
            {insights.challenges.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Practical Advice */}
      {insights.practicalAdvice.length > 0 && (
        <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
          <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            <span>*</span> Practical Advice
          </h4>
          <ul className={`text-sm space-y-1 ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
            {insights.practicalAdvice.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mutual Respect Reminder */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border`}>
        <p className={`text-sm italic ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
          {insights.mutualRespectReminder}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function PersonSeasonCard({ person, isDark, side }) {
  const sideColor = side === 'A' ? 'amber' : 'blue';

  return (
    <div className={`p-4 rounded-xl ${isDark ? `bg-${sideColor}-500/10 border-${sideColor}-500/20` : `bg-${sideColor}-50 border-${sideColor}-200`} border`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{person.seasonality.seasonEmoji}</span>
        <div>
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {person.label}
          </h4>
          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            {person.seasonality.monthBranch} Month • {person.seasonality.seasonChinese}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2 rounded ${isDark ? 'bg-black/20' : 'bg-white/50'}`}>
          <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Dominant</div>
          <div className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {getElementIcon(person.seasonality.dominantAfter)}
            <span className="capitalize">{person.seasonality.dominantAfter}</span>
          </div>
        </div>
        <div className={`p-2 rounded ${isDark ? 'bg-black/20' : 'bg-white/50'}`}>
          <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>DM Element</div>
          <div className={`flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {getElementIcon(person.dmSeasonal.dmElement)}
            <span className="capitalize">{person.dmSeasonal.dmElement}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, positive, isDark }) {
  return (
    <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
      <div className={`text-lg font-bold ${positive ? 'text-green-400' : 'text-orange-400'}`}>
        {icon} {value}
      </div>
      <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        {label}
      </div>
    </div>
  );
}

function DMCard({ person, isDark }) {
  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
      <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
        {person.label}'s Day Master
      </h4>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{getElementIcon(person.dmSeasonal.dmElement)}</div>
        <div>
          <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {person.dmSeasonal.dmStem}
          </div>
          <div className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            {capitalize(person.dmSeasonal.dmElement)} • {person.dmSeasonal.strengthCategory.replace('_', ' ')}
          </div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Strength: {(person.dmSeasonal.adjustedStrength * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function ElementComparisonRow({ element, valueA, valueB, labelA, labelB, isDark }) {
  const maxValue = Math.max(valueA, valueB, 1);
  const widthA = (valueA / 50) * 100;
  const widthB = (valueB / 50) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 flex items-center gap-1">
        {getElementIcon(element)}
        <span className={`text-xs capitalize ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          {element}
        </span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        {/* A bar (left, reversed) */}
        <div className="flex-1 h-4 flex justify-end" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <div
            className="h-full transition-all"
            style={{ width: `${widthA}%`, backgroundColor: '#f59e0b' }}
          />
        </div>
        {/* Values */}
        <div className="w-16 text-center">
          <span className="text-xs font-mono" style={{ color: '#f59e0b' }}>{valueA.toFixed(0)}</span>
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}> / </span>
          <span className="text-xs font-mono" style={{ color: '#3b82f6' }}>{valueB.toFixed(0)}</span>
        </div>
        {/* B bar (right) */}
        <div className="flex-1 h-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <div
            className="h-full transition-all"
            style={{ width: `${widthB}%`, backgroundColor: '#3b82f6' }}
          />
        </div>
      </div>
    </div>
  );
}

function TenGodComparisonRow({ label, valueA, valueB, harmony, labelA, labelB, isDark }) {
  const harmonyColor = harmony >= 0.7 ? 'text-green-400' : harmony >= 0.4 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          {label}
        </span>
        <span className={`text-xs font-mono ${harmonyColor}`}>
          {(harmony * 100).toFixed(0)}% harmony
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs w-16 text-right" style={{ color: '#f59e0b' }}>{valueA.toFixed(0)}%</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <div className="h-full flex">
            <div style={{ width: `${valueA}%`, backgroundColor: '#f59e0b' }} />
            <div style={{ width: `${valueB}%`, backgroundColor: '#3b82f6' }} />
          </div>
        </div>
        <span className="text-xs w-16" style={{ color: '#3b82f6' }}>{valueB.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function StrengthBar({ label, value, category, color, isDark }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{label}</span>
        <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
          {category.replace('_', ' ')} ({value.toFixed(0)}%)
        </span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSeasonRelationIcon(relation) {
  switch (relation) {
    case 'same': return '=';
    case 'adjacent': return '~';
    case 'opposite': return '<>';
    case 'transition': return '#';
    default: return '?';
  }
}

function getRelationArrow(relation) {
  switch (relation) {
    case 'same_element': return '= =';
    case 'A_supports_B': return '->';
    case 'B_supports_A': return '<-';
    case 'A_controls_B': return '>>';
    case 'B_controls_A': return '<<';
    default: return '< >';
  }
}

function formatRelation(relation) {
  switch (relation) {
    case 'same_element': return 'Same Element';
    case 'A_supports_B': return 'A Supports B';
    case 'B_supports_A': return 'B Supports A';
    case 'A_controls_B': return 'A Controls B';
    case 'B_controls_A': return 'B Controls A';
    default: return 'Neutral';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SeasonalityPairComparison;
