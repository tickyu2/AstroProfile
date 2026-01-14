/**
 * ============================================================================
 * BAZI SEASONALITY EDUCATION PAGE
 * ============================================================================
 *
 * The "Learning Hall" - A unified education module for BaZi seasonality.
 *
 * This page wraps together:
 * - 8-chart before/after visualization
 * - Story mode for beginners
 * - Debug mode for advanced practitioners
 * - Day Master strength analysis
 * - Ten Gods seasonal impact
 * - Pairwise comparison for couples/partners
 *
 * Philosophy: Teach people to see themselves and each other more clearly.
 * "I see why you are like this, and I honor it."
 *
 * Created: January 2026
 * Based on: Classical 四季土 (Four Season Earth) Doctrine
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import {
  BaziThemeProvider,
  SeasonalityComparisonChart,
  SeasonalityPairComparison
} from '../components/bazi';
import { applySeasonality } from '../utils/baziSeasonality';
import { computeSeasonalDMStrength } from '../utils/baziDmSeasonality';
import { computeTenGodsSeasonality } from '../utils/baziTenGodsSeasonality';
import { buildSeasonalityStory } from '../utils/baziSeasonalityStory';
import { buildSeasonalityDebug } from '../utils/baziSeasonalityDebug';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BaZiSeasonalityPage() {
  const { profiles, loading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [compareProfileId, setCompareProfileId] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'story' | 'debug' | 'compare'
  const [chart, setChart] = useState(null);
  const [compareChart, setCompareChart] = useState(null);

  // Get selected profiles
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || profiles?.[0];
  }, [profiles, selectedProfileId]);

  const compareProfile = useMemo(() => {
    return profiles?.find(p => p.id === compareProfileId);
  }, [profiles, compareProfileId]);

  // Calculate BaZi for primary profile
  useEffect(() => {
    if (!selectedProfile?.birthDate) return;

    try {
      const birthDate = selectedProfile.birthDate;
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
      const result = calculateBaZi({ year, month, day, hour, minute });
      if (!result.error) {
        setChart(result);
      }
    } catch (error) {
      console.error('BaZi calculation error:', error);
    }
  }, [selectedProfile]);

  // Calculate BaZi for comparison profile
  useEffect(() => {
    if (!compareProfile?.birthDate) {
      setCompareChart(null);
      return;
    }

    try {
      const birthDate = compareProfile.birthDate;
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (compareProfile.birthTime || '12:00').split(':').map(Number);
      const result = calculateBaZi({ year, month, day, hour, minute });
      if (!result.error) {
        setCompareChart(result);
      }
    } catch (error) {
      console.error('BaZi comparison calculation error:', error);
    }
  }, [compareProfile]);

  // Auto-select first profile
  useEffect(() => {
    if (!selectedProfileId && profiles?.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  // Compute seasonality data
  const seasonalityData = useMemo(() => {
    if (!chart) return null;

    const monthBranch = chart.pillars?.month?.branch?.character || '寅';
    const dmStem = chart.pillars?.day?.stem?.character || '甲';

    // Get raw element distribution
    const rawElements = {
      wood: chart.elements?.Wood || chart.elements?.wood || 0,
      fire: chart.elements?.Fire || chart.elements?.fire || 0,
      earth: chart.elements?.Earth || chart.elements?.earth || 0,
      metal: chart.elements?.Metal || chart.elements?.metal || 0,
      water: chart.elements?.Water || chart.elements?.water || 0
    };

    // Normalize if needed
    const total = Object.values(rawElements).reduce((a, b) => a + b, 0);
    const normalizedRaw = total > 0 ? {
      wood: (rawElements.wood / total) * 10,
      fire: (rawElements.fire / total) * 10,
      earth: (rawElements.earth / total) * 10,
      metal: (rawElements.metal / total) * 10,
      water: (rawElements.water / total) * 10
    } : rawElements;

    // Apply seasonality
    const seasonality = applySeasonality(normalizedRaw, monthBranch);

    // Compute DM seasonality
    const dmSeasonal = computeSeasonalDMStrength(dmStem, monthBranch);

    // Compute Ten Gods seasonality
    const tenGodsSeasonal = computeTenGodsSeasonality(dmSeasonal.dmElement, monthBranch);

    // Build story and debug outputs
    const story = buildSeasonalityStory(seasonality, dmSeasonal, tenGodsSeasonal);
    const debug = buildSeasonalityDebug(seasonality, dmSeasonal, tenGodsSeasonal);

    return {
      monthBranch,
      dmStem,
      rawElements: normalizedRaw,
      seasonality,
      dmSeasonal,
      tenGodsSeasonal,
      story,
      debug
    };
  }, [chart]);

  // Compute comparison data for pairwise mode
  const comparisonData = useMemo(() => {
    if (!chart || !compareChart) return null;

    const getChartConfig = (chartData, profile) => {
      const monthBranch = chartData.pillars?.month?.branch?.character || '寅';
      const dmStem = chartData.pillars?.day?.stem?.character || '甲';

      const rawElements = {
        wood: chartData.elements?.Wood || chartData.elements?.wood || 0,
        fire: chartData.elements?.Fire || chartData.elements?.fire || 0,
        earth: chartData.elements?.Earth || chartData.elements?.earth || 0,
        metal: chartData.elements?.Metal || chartData.elements?.metal || 0,
        water: chartData.elements?.Water || chartData.elements?.water || 0
      };

      const total = Object.values(rawElements).reduce((a, b) => a + b, 0);
      const normalizedRaw = total > 0 ? {
        wood: (rawElements.wood / total) * 10,
        fire: (rawElements.fire / total) * 10,
        earth: (rawElements.earth / total) * 10,
        metal: (rawElements.metal / total) * 10,
        water: (rawElements.water / total) * 10
      } : rawElements;

      return {
        label: profile?.name || 'Person',
        rawElements: normalizedRaw,
        monthBranch,
        dmStem,
        rawDmStrength: 0.5
      };
    };

    return {
      personA: getChartConfig(chart, selectedProfile),
      personB: getChartConfig(compareChart, compareProfile)
    };
  }, [chart, compareChart, selectedProfile, compareProfile]);

  const isDark = themeMode === 'dark';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <BaziThemeProvider theme={themeMode}>
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100'}`}>
        {/* Header */}
        <header className={`${isDark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-lg border-b ${isDark ? 'border-white/10' : 'border-slate-200'} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                  ← Dashboard
                </Link>
                <div className={`h-4 w-px ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                  Seasonality Learning Hall
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isDark
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-slate-800/20 text-slate-700 border border-slate-300'
                  }`}
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Profile Selectors */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Profile */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  Primary Profile
                </label>
                <select
                  value={selectedProfileId || ''}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-white border-white/10' : 'bg-white text-slate-900 border-slate-300'} border`}
                >
                  {profiles?.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} ({profile.birthDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Comparison Profile (for pairwise mode) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  Compare With (Optional)
                </label>
                <select
                  value={compareProfileId || ''}
                  onChange={(e) => {
                    setCompareProfileId(e.target.value || null);
                    if (e.target.value) setViewMode('compare');
                  }}
                  className={`w-full px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-white border-white/10' : 'bg-white text-slate-900 border-slate-300'} border`}
                >
                  <option value="">-- Select for Comparison --</option>
                  {profiles?.filter(p => p.id !== selectedProfileId).map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} ({profile.birthDate})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className={`flex flex-wrap gap-2 p-1 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            {[
              { id: 'visual', label: 'Visual Charts', icon: '' },
              { id: 'story', label: 'Story Mode', icon: '' },
              { id: 'debug', label: 'Debug Mode', icon: '' },
              { id: 'compare', label: 'Pair Compare', icon: '' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                disabled={tab.id === 'compare' && !compareProfileId}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === tab.id
                    ? (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-white text-amber-700 shadow-sm')
                    : (isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-700')
                } ${tab.id === 'compare' && !compareProfileId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content based on View Mode */}
          {viewMode === 'visual' && seasonalityData && (
            <VisualMode
              seasonalityData={seasonalityData}
              chart={chart}
              profile={selectedProfile}
              isDark={isDark}
            />
          )}

          {viewMode === 'story' && seasonalityData && (
            <StoryMode story={seasonalityData.story} isDark={isDark} />
          )}

          {viewMode === 'debug' && seasonalityData && (
            <DebugMode debug={seasonalityData.debug} isDark={isDark} />
          )}

          {viewMode === 'compare' && comparisonData && (
            <CompareMode
              personAConfig={comparisonData.personA}
              personBConfig={comparisonData.personB}
              isDark={isDark}
            />
          )}

          {!seasonalityData && (
            <div className={`p-8 rounded-xl text-center ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
              <p className={isDark ? 'text-white/60' : 'text-slate-500'}>
                Please select a profile to view seasonality analysis.
              </p>
            </div>
          )}

          {/* Educational Footer */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border`}>
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              About Seasonality
            </h3>
            <div className={`text-sm leading-relaxed space-y-2 ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
              <p>
                <strong>Seasonality</strong> in BaZi refers to how the birth month affects the strength and expression
                of elements in your chart. The month branch determines which element is "in season" and naturally thrives.
              </p>
              <p>
                This affects your <strong>Day Master strength</strong> (core self), <strong>Ten Gods balance</strong>
                (life domains), and compatibility with others who were born in different seasons.
              </p>
              <p className="italic">
                Understanding your seasonal fingerprint helps you see why you are the way you are - and why
                others might be different. This is the foundation of mutual respect.
              </p>
            </div>
          </div>
        </main>
      </div>
    </BaziThemeProvider>
  );
}

// ============================================================================
// VISUAL MODE
// ============================================================================

function VisualMode({ seasonalityData, chart, profile, isDark }) {
  const { rawElements, monthBranch, dmSeasonal, tenGodsSeasonal, seasonality } = seasonalityData;

  return (
    <div className="space-y-6">
      {/* 8-Chart Seasonality Comparison */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
        <SeasonalityComparisonChart
          rawDistribution={rawElements}
          monthBranch={monthBranch}
          title="Element Seasonality Analysis"
          showExplanation={true}
        />
      </div>

      {/* Day Master Panel */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'} border`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
          Day Master Seasonal Strength
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox
            label="DM Element"
            value={capitalize(dmSeasonal.dmElement)}
            isDark={isDark}
          />
          <MetricBox
            label="Season Weight"
            value={`${dmSeasonal.seasonalWeight.toFixed(2)}`}
            isDark={isDark}
          />
          <MetricBox
            label="Adjusted Strength"
            value={`${(dmSeasonal.adjustedStrength * 100).toFixed(0)}%`}
            isDark={isDark}
          />
          <MetricBox
            label="Category"
            value={dmSeasonal.strengthCategory.replace('_', ' ')}
            isDark={isDark}
          />
        </div>
        <p className={`mt-4 text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          {dmSeasonal.explanation}
        </p>
      </div>

      {/* Ten Gods Panel */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
          Ten Gods Seasonal Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {['resource', 'companion', 'output', 'wealth', 'officer'].map((cat) => {
            const info = tenGodsSeasonal.tenGods[cat];
            const deltaColor = info.delta > 0.05 ? 'text-green-400' : info.delta < -0.05 ? 'text-red-400' : 'text-white/60';

            return (
              <div key={cat} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
                <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  {info.name}
                </div>
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {(info.adjusted * 100).toFixed(0)}%
                </div>
                <div className={`text-xs font-mono ${deltaColor}`}>
                  {info.delta > 0 ? '+' : ''}{(info.delta * 100).toFixed(1)}%
                </div>
                <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  {capitalize(info.element)}
                </div>
              </div>
            );
          })}
        </div>
        <p className={`mt-4 text-sm whitespace-pre-line ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          {tenGodsSeasonal.summary}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// STORY MODE
// ============================================================================

function StoryMode({ story, isDark }) {
  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">Book</span>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
          Story Mode - For Beginners
        </h3>
      </div>
      <pre className={`text-sm leading-relaxed whitespace-pre-wrap font-sans ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
        {story}
      </pre>
    </div>
  );
}

// ============================================================================
// DEBUG MODE
// ============================================================================

function DebugMode({ debug, isDark }) {
  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">Wrench</span>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Debug Mode - For Advanced Practitioners
        </h3>
      </div>
      <div className={`p-4 rounded-lg overflow-x-auto ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <pre className={`text-xs font-mono whitespace-pre ${isDark ? 'text-green-400' : 'text-slate-800'}`}>
          {debug}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// COMPARE MODE
// ============================================================================

function CompareMode({ personAConfig, personBConfig, isDark }) {
  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-slate-200'} border`}>
      <SeasonalityPairComparison
        personAConfig={personAConfig}
        personBConfig={personBConfig}
        showStoryMode={true}
        showDetailedMetrics={true}
      />
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function MetricBox({ label, value, isDark }) {
  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white'}`}>
      <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{label}</div>
      <div className={`text-lg font-semibold capitalize ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
