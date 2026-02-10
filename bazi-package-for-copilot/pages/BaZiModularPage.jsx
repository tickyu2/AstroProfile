/**
 * BaZi Modular Display Page
 * Showcases the atomic design BaZi components using user's profile data
 *
 * Uses: ProfileContext for user data, calculateBaZi for chart calculation
 * Components: FourPillarsGrid, DayMasterCard, ElementDistributionChart (organisms)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import {
  BaziThemeProvider,
  FourPillarsGrid,
  DayMasterCard,
  ElementDistributionChart,
  NivoElementBar,
  ElementDonut,
  PersonalityRadar,
  ElementCalculationFlaps,
  SeasonalityComparisonChart,
  Stem,
  Branch,
  ElementBadge
} from '../components/bazi';

export default function BaZiModularPage() {
  const { profiles, loading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [chart, setChart] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [showCompact, setShowCompact] = useState(false);
  const [showHiddenRoots, setShowHiddenRoots] = useState(true);

  // Get selected profile
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || profiles?.[0];
  }, [profiles, selectedProfileId]);

  // Calculate BaZi when profile changes
  useEffect(() => {
    if (!selectedProfile?.birthDate) return;

    try {
      // Parse birth date
      const birthDate = selectedProfile.birthDate;
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);

      // Calculate chart
      const result = calculateBaZi({ year, month, day, hour, minute });

      if (!result.error) {
        setChart(result);
      }
    } catch (error) {
      console.error('BaZi calculation error:', error);
    }
  }, [selectedProfile]);

  // Auto-select first profile
  useEffect(() => {
    if (!selectedProfileId && profiles?.length > 0) {
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100'}`}>
      {/* Header */}
      <header className={`${themeMode === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-lg border-b ${themeMode === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className={`${themeMode === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>
                ← Dashboard
              </Link>
              <div className={`h-4 w-px ${themeMode === 'dark' ? 'bg-white/20' : 'bg-slate-300'}`} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                🎋 BaZi Modular Display
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-slate-800/20 text-slate-700 border border-slate-300'
                }`}
              >
                {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>

              {/* Compact Toggle */}
              <button
                onClick={() => setShowCompact(!showCompact)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showCompact
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                }`}
              >
                {showCompact ? '📐 Compact' : '📏 Full'}
              </button>

              {/* Hidden Roots Toggle */}
              <button
                onClick={() => setShowHiddenRoots(!showHiddenRoots)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showHiddenRoots
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                }`}
              >
                {showHiddenRoots ? '🔮 Depths On' : '🔮 Depths Off'}
              </button>

              <Link
                to="/bazi-calculator"
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-300 text-sm transition-colors"
              >
                🧮 Calculator
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Selector */}
        <div className={`mb-8 p-4 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/80 border border-slate-200'}`}>
          <div className="flex items-center gap-4 flex-wrap">
            <label className={`text-sm font-medium ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Profile:
            </label>
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                themeMode === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              {profiles?.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown'}
                </option>
              ))}
            </select>

            {selectedProfile && (
              <div className={`text-sm ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Born: {selectedProfile.birthDate} {selectedProfile.birthTime && `at ${selectedProfile.birthTime}`}
              </div>
            )}
          </div>
        </div>

        {!chart ? (
          <div className={`text-center py-20 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {profiles?.length === 0
              ? 'No profiles found. Create a profile first.'
              : 'Select a profile to view BaZi chart.'}
          </div>
        ) : (
          <BaziThemeProvider theme={themeMode}>
            <div className="space-y-8">
              {/* Section: Four Pillars Grid */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🎋 Four Pillars of Destiny
                </h2>
                <FourPillarsGrid
                  pillars={chart.pillars}
                  compact={showCompact}
                  showHiddenRoots={showHiddenRoots}
                />
              </section>

              {/* Section: Day Master & Elements (side by side) */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Day Master Card */}
                <section>
                  <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    ⭐ Day Master (Your Core Essence)
                  </h2>
                  <DayMasterCard
                    dayMaster={chart.dayMaster}
                    strengthLabel={chart.metaphor?.strength || chart.yinYang?.balance}
                    compact={showCompact}
                  />
                </section>

                {/* Element Donut (Nivo) */}
                <section>
                  <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    🍩 Element Distribution
                  </h2>
                  <ElementDonut
                    distribution={chart.elements}
                    height={280}
                    compact={showCompact}
                  />
                </section>
              </div>

              {/* Section: Beautiful Nivo Charts */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  📊 Element Analysis (Nivo Charts)
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nivo Bar Chart */}
                  <NivoElementBar
                    distribution={chart.elements}
                    title="Element Balance (Horizontal)"
                    layout="horizontal"
                    height={250}
                    compact={showCompact}
                  />

                  {/* Nivo Vertical Bar */}
                  <NivoElementBar
                    distribution={chart.elements}
                    title="Element Balance (Vertical)"
                    layout="vertical"
                    height={250}
                    compact={showCompact}
                  />
                </div>
              </section>

              {/* Section: Personality Radar */}
              <section>
                <PersonalityRadar
                  data={[
                    { trait: 'Wood', score: chart.elements?.percentages?.Wood || chart.elements?.Wood || 20 },
                    { trait: 'Fire', score: chart.elements?.percentages?.Fire || chart.elements?.Fire || 20 },
                    { trait: 'Earth', score: chart.elements?.percentages?.Earth || chart.elements?.Earth || 20 },
                    { trait: 'Metal', score: chart.elements?.percentages?.Metal || chart.elements?.Metal || 20 },
                    { trait: 'Water', score: chart.elements?.percentages?.Water || chart.elements?.Water || 20 }
                  ]}
                  title="Elemental Fingerprint"
                  height={420}
                  compact={showCompact}
                />
              </section>

              {/* Section: Seasonality Adjustment (四季土 Doctrine) */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🌸 Seasonal Influence on Your Elements
                </h2>
                <p className={`text-sm mb-4 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  In classical BaZi, the season of your birth affects which elements are naturally strong or weak.
                  This is the <strong>四季土 (Four Season Earth)</strong> doctrine.
                </p>
                <SeasonalityComparisonChart
                  rawDistribution={{
                    wood: chart.elements?.percentages?.Wood || chart.elements?.Wood || 20,
                    fire: chart.elements?.percentages?.Fire || chart.elements?.Fire || 20,
                    earth: chart.elements?.percentages?.Earth || chart.elements?.Earth || 20,
                    metal: chart.elements?.percentages?.Metal || chart.elements?.Metal || 20,
                    water: chart.elements?.percentages?.Water || chart.elements?.Water || 20
                  }}
                  monthBranch={chart.pillars?.[1]?.branch?.char || '子'}
                  title="Raw vs Season-Adjusted Elements"
                  showExplanation={true}
                  compact={showCompact}
                />
              </section>

              {/* Section: Calculation Breakdown (Show Your Work) */}
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🔍 How Did We Get These Numbers?
                </h2>
                <ElementCalculationFlaps
                  pillars={chart.pillars}
                  elements={chart.elements}
                  title="Click each element to see calculation"
                  compact={showCompact}
                />
              </section>

              {/* Section: Atom Components Demo */}
              <section className={`p-6 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/80 border border-slate-200'}`}>
                <h2 className={`text-xl font-semibold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🔬 Atom Components
                </h2>
                <p className={`text-sm mb-4 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Individual building blocks: Stem, Branch, ElementBadge
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  {/* Stems */}
                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Heavenly Stems
                    </div>
                    <div className="flex gap-4">
                      <Stem value={chart.dayMaster.stem?.char || chart.pillars[2].stem.char} large showEnglish />
                      <Stem value={chart.pillars[0].stem.char} showElement />
                    </div>
                  </div>

                  {/* Branches */}
                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Earthly Branches
                    </div>
                    <div className="flex gap-4">
                      <Branch value={chart.pillars[2].branch.char} large showAnimal showEmoji />
                      <Branch value={chart.pillars[0].branch.char} showElement />
                    </div>
                  </div>

                  {/* Element Badges */}
                  <div className="space-y-2">
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Element Badges
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <ElementBadge element="Wood" variant="outlined" />
                      <ElementBadge element="Fire" variant="filled" />
                      <ElementBadge element="Earth" variant="subtle" showIcon />
                      <ElementBadge element="Metal" size="lg" />
                      <ElementBadge element="Water" size="sm" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Stats */}
              <section className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
                {[
                  { label: 'Day Master', value: chart.dayMaster.fullName || chart.dayMaster.chinese, icon: '⭐' },
                  { label: 'Dominant Element', value: chart.elements?.dominant, icon: '🔥' },
                  { label: 'Yin/Yang', value: chart.yinYang?.balance || `${chart.yinYang?.yangPercent}% Yang`, icon: '☯️' },
                  { label: 'Calculation', value: chart.calculationMethod || 'Sovereign', icon: '✓' }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl text-center ${
                      themeMode === 'dark'
                        ? 'bg-slate-800/50 border border-slate-700'
                        : 'bg-white/80 border border-slate-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-xs uppercase tracking-wider ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {stat.label}
                    </div>
                    <div className={`text-lg font-semibold mt-1 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </BaziThemeProvider>
        )}
      </main>
    </div>
  );
}
