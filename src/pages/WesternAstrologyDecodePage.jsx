/**
 * WESTERN ASTROLOGY DECODE PAGE
 *
 * Full page expansion for deep Western Astrology understanding:
 * - Tab 1: Overview - Quick summary with Sun/Moon/Rising Trinity
 * - Tab 2: Planets - Deep dive into each planetary position
 * - Tab 3: Aspects - How planets relate to each other
 * - Tab 4: Houses - Life area placements (future)
 * - Tab 5: AI Insights - Cross-system constitutional analysis
 *
 * "The Cathedral of Self-Knowledge - Astrological Wing"
 *
 * GENESIS AstroProfile - January 4, 2026
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { generateWesternAIAnalysis } from '../services/westernAstrologyAIService';

// Simple icon components to replace lucide-react
const ChevronDown = () => <span className="text-lg">▼</span>;
const ChevronUp = () => <span className="text-lg">▲</span>;
const Sparkles = ({ className }) => <span className={className}>✨</span>;
const ArrowLeft = ({ className }) => <span className={className}>←</span>;

// CSS will be inline using Tailwind classes

function WesternAstrologyDecodePage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfiles();

  const [selectedProfileId, setSelectedProfileId] = useState(profileId || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPlanet, setExpandedPlanet] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedAspect, setExpandedAspect] = useState(null);

  // Auto-select profile: prefer one with Western data, fallback to first
  useEffect(() => {
    if (!selectedProfileId && profiles?.length > 0) {
      // First, try to find a profile with Western astrology data
      const profileWithWestern = profiles.find(p =>
        p.calculations?.western?.sovereignCalculation?.sun?.sign
      );
      if (profileWithWestern) {
        setSelectedProfileId(profileWithWestern.id);
      } else {
        // Fallback to first profile
        setSelectedProfileId(profiles[0].id);
      }
    }
  }, [profiles, selectedProfileId]);

  // Find the profile
  const profile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId) || profiles[0];
  }, [profiles, selectedProfileId]);

  // Extract Western astrology data from profile
  const westernData = useMemo(() => {
    if (!profile) return null;

    const sovereign = profile.calculations?.western?.sovereignCalculation || {};
    return {
      sun: sovereign.sun || {},
      moon: sovereign.moon || {},
      rising: sovereign.rising || {},
      planets: sovereign.planets || {},
      aspects: sovereign.aspects || [],
      houses: sovereign.houses || {},
      elementBalance: sovereign.elementBalance || {},
      moonPhase: sovereign.moonPhase || {}
    };
  }, [profile]);

  // Load AI analysis when profile is ready
  useEffect(() => {
    const loadAIAnalysis = async () => {
      if (profile && westernData && !aiAnalysis && !aiLoading) {
        setAiLoading(true);
        try {
          const result = await generateWesternAIAnalysis(profile);
          if (result.success) {
            setAiAnalysis(result.analysis);
          } else {
            setAiAnalysis(result.fallback);
          }
        } catch (error) {
          console.error('AI Analysis error:', error);
        } finally {
          setAiLoading(false);
        }
      }
    };
    loadAIAnalysis();
  }, [profile, westernData]);

  // Tab definitions
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '⭐' },
    { id: 'planets', label: 'Planets', icon: '🪐' },
    { id: 'aspects', label: 'Aspects', icon: '◊' },
    { id: 'houses', label: 'Houses', icon: '🏠' },
    { id: 'ai-insights', label: 'AI Insights', icon: '🧠' }
  ];

  // Get synthesis name from AI or default
  const getSynthesisName = () => {
    if (aiAnalysis?.synthesisName) return aiAnalysis.synthesisName;

    const { sun, elementBalance } = westernData || {};
    const earthDominant = elementBalance?.dominant === 'Earth';

    if (earthDominant) return "The Grounded Builder";
    if (elementBalance?.dominant === 'Fire') return "The Passionate Pioneer";
    if (elementBalance?.dominant === 'Water') return "The Intuitive Healer";
    if (elementBalance?.dominant === 'Air') return "The Intellectual Visionary";
    return "The Cosmic Soul";
  };

  // Loading state
  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⭐</div>
          <p className="text-purple-300">Loading your chart...</p>
        </div>
      </div>
    );
  }

  // No profile found - show selector if profiles exist
  if (!profile) {
    if (profiles?.length > 0) {
      // Auto-select should kick in, show loading
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-xl mb-4">Loading profile...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-400 text-xl mb-4">No profiles found</p>
          <p className="text-slate-400 mb-6">Create a profile first to view Western astrology</p>
          <button
            onClick={() => navigate('/create-profile')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  // No Western data - Show profile selector to pick a profile with data
  if (!westernData?.sun?.sign) {
    // Find profiles that have Western data
    const profilesWithWesternData = profiles.filter(p =>
      p.calculations?.western?.sovereignCalculation?.sun?.sign
    );

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-yellow-400 text-xl mb-2">No astrological data available</p>
          <p className="text-slate-400 mb-6">
            {profile?.displayName || 'This profile'} needs birth time for full chart calculation
          </p>

          {/* Profile Selector */}
          {profiles.length > 1 && (
            <div className="mb-6">
              <label className="text-slate-300 text-sm block mb-2">
                Select a profile with birth data:
              </label>
              <select
                value={selectedProfileId || ''}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {profiles.map(p => {
                  const hasWestern = p.calculations?.western?.sovereignCalculation?.sun?.sign;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.displayName || p.name} {hasWestern ? '✓' : '(no birth time)'}
                    </option>
                  );
                })}
              </select>
              {profilesWithWesternData.length > 0 && (
                <p className="text-green-400 text-sm mt-2">
                  {profilesWithWesternData.length} profile{profilesWithWesternData.length > 1 ? 's' : ''} with birth data available
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
            >
              Dashboard
            </button>
            {selectedProfileId && (
              <button
                onClick={() => navigate(`/results/${selectedProfileId}`)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
              >
                View Profile
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(selectedProfileId ? `/results/${selectedProfileId}` : '/dashboard', { state: { activeTab: 'western' } })}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Western Astrology Decode
            </h1>
            <p className="text-slate-400">{profile.displayName}</p>
          </div>
          {/* Profile Selector */}
          <select
            value={selectedProfileId || ''}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.displayName || p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-4 py-2 rounded-full font-semibold text-sm border-2 bg-amber-500/10 border-amber-500 text-amber-400">
            Sun {westernData.sun.sign}
          </span>
          <span className="px-4 py-2 rounded-full font-semibold text-sm border-2 bg-blue-500/10 border-blue-400 text-blue-300">
            Moon {westernData.moon.sign}
          </span>
          <span className="px-4 py-2 rounded-full font-semibold text-sm border-2 bg-purple-500/10 border-purple-400 text-purple-300">
            Rising {westernData.rising.sign}
          </span>
          {westernData.elementBalance?.dominant && (
            <span className="px-4 py-2 rounded-full font-semibold text-sm border-2 bg-green-500/10 border-green-400 text-green-300">
              {westernData.elementBalance.dominant} Dominant
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white/5 p-2 rounded-xl overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {activeTab === 'overview' && (
          <OverviewTab
            westernData={westernData}
            synthesisName={getSynthesisName()}
            aiAnalysis={aiAnalysis}
          />
        )}

        {activeTab === 'planets' && (
          <PlanetsTab
            westernData={westernData}
            expandedPlanet={expandedPlanet}
            setExpandedPlanet={setExpandedPlanet}
            aiAnalysis={aiAnalysis}
          />
        )}

        {activeTab === 'aspects' && (
          <AspectsTab
            aspects={westernData.aspects}
            expandedAspect={expandedAspect}
            setExpandedAspect={setExpandedAspect}
            aiAnalysis={aiAnalysis}
          />
        )}

        {activeTab === 'houses' && (
          <HousesTab houses={westernData.houses} />
        )}

        {activeTab === 'ai-insights' && (
          <AIInsightsTab
            profile={profile}
            aiAnalysis={aiAnalysis}
            loading={aiLoading}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// OVERVIEW TAB
// ============================================
function OverviewTab({ westernData, synthesisName, aiAnalysis }) {
  const { sun, moon, rising, elementBalance } = westernData;

  return (
    <div className="space-y-8">
      {/* Synthesis Header */}
      <div className="text-center py-8 px-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-2xl border border-purple-500/30">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {synthesisName}
        </h2>
        <p className="text-slate-400 text-lg">
          Sun {sun.sign} • Moon {moon.sign} • Rising {rising.sign}
        </p>
      </div>

      {/* Trinity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sun Card */}
        <div className="p-6 rounded-2xl border-2 border-amber-500 bg-amber-500/5 text-center hover:-translate-y-1 transition-transform">
          <div className="text-5xl mb-4">☀️</div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">SUN</h3>
          <p className="text-2xl font-bold text-white mb-1">{sun.sign}</p>
          <p className="text-sm text-amber-400">Your Core Self</p>
          <p className="text-xs text-slate-500 mt-2">{sun.degreeFormatted}</p>
        </div>

        {/* Moon Card */}
        <div className="p-6 rounded-2xl border-2 border-blue-400 bg-blue-500/5 text-center hover:-translate-y-1 transition-transform">
          <div className="text-5xl mb-4">🌙</div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">MOON</h3>
          <p className="text-2xl font-bold text-white mb-1">{moon.sign}</p>
          <p className="text-sm text-blue-400">Your Inner World</p>
          <p className="text-xs text-slate-500 mt-2">{moon.degreeFormatted}</p>
        </div>

        {/* Rising Card */}
        <div className="p-6 rounded-2xl border-2 border-purple-400 bg-purple-500/5 text-center hover:-translate-y-1 transition-transform">
          <div className="text-5xl mb-4">⬆️</div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">RISING</h3>
          <p className="text-2xl font-bold text-white mb-1">{rising.sign}</p>
          <p className="text-sm text-purple-400">Your Outer Self</p>
          <p className="text-xs text-slate-500 mt-2">{rising.degreeFormatted}</p>
        </div>
      </div>

      {/* Key Themes */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎯</span> Key Themes in Your Chart
        </h3>
        <div className="grid gap-6">
          <div className="p-5 bg-white/5 rounded-xl border-l-4 border-purple-500">
            <h4 className="text-purple-400 font-semibold mb-2">Your Core Identity (Sun {sun.sign})</h4>
            <p className="text-slate-300 leading-relaxed">
              {aiAnalysis?.overview?.coreIdentity || `Your ${sun.sign} Sun represents your essential life force and the core of who you are becoming.`}
            </p>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border-l-4 border-blue-500">
            <h4 className="text-blue-400 font-semibold mb-2">Your Emotional Nature (Moon {moon.sign})</h4>
            <p className="text-slate-300 leading-relaxed">
              {aiAnalysis?.overview?.emotionalNature || `Your ${moon.sign} Moon reveals your emotional needs, instincts, and inner world.`}
            </p>
          </div>
        </div>
      </div>

      {/* Elemental Dominance */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🌍</span> Elemental Dominance
        </h3>
        <div className="space-y-4">
          {['fire', 'earth', 'air', 'water'].map(element => {
            const value = elementBalance[element] || 0;
            const colors = {
              fire: 'from-red-500 to-orange-500',
              earth: 'from-lime-500 to-green-500',
              air: 'from-cyan-500 to-blue-500',
              water: 'from-indigo-500 to-purple-500'
            };
            return (
              <div key={element} className="grid grid-cols-[80px_1fr_60px] items-center gap-4">
                <span className="font-semibold capitalize text-slate-300">{element}</span>
                <div className="h-6 bg-white/10 rounded-xl overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors[element]} rounded-xl transition-all duration-500`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-right font-bold text-white">{value}%</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-slate-400 italic text-center">
          {aiAnalysis?.overview?.elementalInterpretation ||
            `Your ${elementBalance.dominant || 'elemental'} dominance shapes how you engage with life.`}
        </p>
      </div>
    </div>
  );
}

// ============================================
// PLANETS TAB
// ============================================
function PlanetsTab({ westernData, expandedPlanet, setExpandedPlanet, aiAnalysis }) {
  const { sun, moon, rising, planets } = westernData;

  const planetData = [
    { key: 'sun', name: 'Sun', sign: sun.sign, icon: '☀️', title: 'Your Core Self', color: 'amber', degree: sun.degreeFormatted },
    { key: 'moon', name: 'Moon', sign: moon.sign, icon: '🌙', title: 'Your Emotional Nature', color: 'blue', degree: moon.degreeFormatted },
    { key: 'rising', name: 'Rising', sign: rising.sign, icon: '⬆️', title: 'Your Outer Personality', color: 'purple', degree: rising.degreeFormatted },
    { key: 'mercury', name: 'Mercury', sign: planets.mercury?.sign, icon: '💬', title: 'Your Communication Style', color: 'emerald', degree: planets.mercury?.degreeFormatted, retrograde: planets.mercury?.isRetrograde },
    { key: 'venus', name: 'Venus', sign: planets.venus?.sign, icon: '❤️', title: 'Your Love Style', color: 'pink', degree: planets.venus?.degreeFormatted, retrograde: planets.venus?.isRetrograde },
    { key: 'mars', name: 'Mars', sign: planets.mars?.sign, icon: '⚔️', title: 'Your Drive & Passion', color: 'red', degree: planets.mars?.degreeFormatted, retrograde: planets.mars?.isRetrograde },
    { key: 'jupiter', name: 'Jupiter', sign: planets.jupiter?.sign, icon: '🎯', title: 'Your Growth & Expansion', color: 'violet', degree: planets.jupiter?.degreeFormatted, retrograde: planets.jupiter?.isRetrograde },
    { key: 'saturn', name: 'Saturn', sign: planets.saturn?.sign, icon: '⏳', title: 'Your Structure & Discipline', color: 'slate', degree: planets.saturn?.degreeFormatted, retrograde: planets.saturn?.isRetrograde },
  ];

  const colorClasses = {
    amber: 'border-amber-500',
    blue: 'border-blue-400',
    purple: 'border-purple-400',
    emerald: 'border-emerald-400',
    pink: 'border-pink-400',
    red: 'border-red-400',
    violet: 'border-violet-400',
    slate: 'border-slate-400'
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-slate-400 italic mb-6">
        Click each panel to expand and explore the full interpretation
      </p>

      {planetData.filter(p => p.sign).map(planet => {
        const isExpanded = expandedPlanet === planet.key;
        const planetAI = aiAnalysis?.planets?.[planet.key] || {};

        return (
          <div
            key={planet.key}
            className={`rounded-2xl border-2 ${colorClasses[planet.color]} bg-white/5 overflow-hidden transition-all ${isExpanded ? 'bg-white/10' : ''}`}
          >
            {/* Header */}
            <div
              onClick={() => setExpandedPlanet(isExpanded ? null : planet.key)}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{planet.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {planet.name} in {planet.sign}
                    {planet.retrograde && <span className="ml-2 text-red-400 text-sm">℞</span>}
                  </h3>
                  <p className="text-sm text-slate-400">{planet.title}</p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-5 pb-5 space-y-4">
                {/* Core Essence */}
                <div className="p-4 bg-black/20 rounded-xl border-l-4 border-purple-500/50">
                  <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                    <span>🌟</span> Core Essence
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {planetAI.coreEssence || `${planet.name} in ${planet.sign} brings unique qualities to your chart.`}
                  </p>
                </div>

                {/* Strengths & Challenges */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/30">
                    <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                      <span>💪</span> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {(planetAI.strengths || ['Authenticity', 'Vitality', 'Purpose']).map((s, i) => (
                        <li key={i} className="text-slate-300 flex items-start gap-2">
                          <span className="text-green-400">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                      <span>⚡</span> Challenges
                    </h4>
                    <ul className="space-y-2">
                      {(planetAI.challenges || ['Balance', 'Self-awareness']).map((c, i) => (
                        <li key={i} className="text-slate-300 flex items-start gap-2">
                          <span className="text-red-400">!</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Shadow Side */}
                {planetAI.shadowSide && (
                  <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-red-500/50">
                    <h4 className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                      <span>🌑</span> Shadow Side
                    </h4>
                    <p className="text-slate-400 leading-relaxed">{planetAI.shadowSide}</p>
                  </div>
                )}

                {/* Degree info */}
                <p className="text-xs text-slate-500 text-right">{planet.degree}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// ASPECTS TAB
// ============================================
function AspectsTab({ aspects, expandedAspect, setExpandedAspect, aiAnalysis }) {
  if (!aspects || aspects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No aspect data available</p>
      </div>
    );
  }

  const majorAspects = aspects.filter(a => a.nature === 'major');
  const harmonious = majorAspects.filter(a => a.quality === 'harmonious');
  const challenging = majorAspects.filter(a => a.quality === 'challenging');
  const neutral = majorAspects.filter(a => a.quality !== 'harmonious' && a.quality !== 'challenging');

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-white mb-2">Planetary Connections</h2>
        <p className="text-slate-400">How the planets in your chart work together</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-6 rounded-2xl border-2 border-green-500/50 bg-green-500/5">
          <span className="text-4xl font-bold text-white block mb-2">{harmonious.length}</span>
          <span className="text-sm uppercase tracking-wider text-green-400">Harmonious</span>
        </div>
        <div className="text-center p-6 rounded-2xl border-2 border-red-500/50 bg-red-500/5">
          <span className="text-4xl font-bold text-white block mb-2">{challenging.length}</span>
          <span className="text-sm uppercase tracking-wider text-red-400">Challenging</span>
        </div>
        <div className="text-center p-6 rounded-2xl border-2 border-slate-500/50 bg-slate-500/5">
          <span className="text-4xl font-bold text-white block mb-2">{neutral.length}</span>
          <span className="text-sm uppercase tracking-wider text-slate-400">Neutral</span>
        </div>
      </div>

      {/* Harmonious Aspects */}
      {harmonious.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-green-400 border-b-2 border-green-500/50 pb-2 mb-4">
            ✨ Harmonious Aspects (Gifts & Talents)
          </h3>
          <div className="space-y-3">
            {harmonious.map((aspect, i) => (
              <AspectCard key={i} aspect={aspect} index={i} expanded={expandedAspect} setExpanded={setExpandedAspect} type="harmonious" />
            ))}
          </div>
        </div>
      )}

      {/* Challenging Aspects */}
      {challenging.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-red-400 border-b-2 border-red-500/50 pb-2 mb-4">
            ⚡ Challenging Aspects (Growth Areas)
          </h3>
          <div className="space-y-3">
            {challenging.map((aspect, i) => (
              <AspectCard key={i} aspect={aspect} index={`c${i}`} expanded={expandedAspect} setExpanded={setExpandedAspect} type="challenging" />
            ))}
          </div>
        </div>
      )}

      {/* Neutral Aspects */}
      {neutral.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-400 border-b-2 border-slate-500/50 pb-2 mb-4">
            ◊ Neutral Aspects
          </h3>
          <div className="space-y-3">
            {neutral.map((aspect, i) => (
              <AspectCard key={i} aspect={aspect} index={`n${i}`} expanded={expandedAspect} setExpanded={setExpandedAspect} type="neutral" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AspectCard({ aspect, index, expanded, setExpanded, type }) {
  const isExpanded = expanded === index;
  const borderColor = type === 'harmonious' ? 'border-green-500/30' : type === 'challenging' ? 'border-red-500/30' : 'border-slate-500/30';

  return (
    <div className={`rounded-xl border-2 ${borderColor} bg-white/5 overflow-hidden`}>
      <div
        onClick={() => setExpanded(isExpanded ? null : index)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{aspect.planet1?.symbol}</span>
          <span className={`text-lg ${type === 'harmonious' ? 'text-green-400' : type === 'challenging' ? 'text-red-400' : 'text-slate-400'}`}>
            {aspect.symbol}
          </span>
          <span className="text-xl">{aspect.planet2?.symbol}</span>
          <span className="text-white font-medium ml-2">
            {aspect.planet1?.name} {aspect.aspect} {aspect.planet2?.name}
          </span>
          <span className="text-slate-500 text-sm">({aspect.orb}° orb)</span>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      {isExpanded && (
        <div className="px-4 pb-4">
          <p className="text-slate-300 leading-relaxed">
            {aspect.planet1?.name} and {aspect.planet2?.name} form a {aspect.aspect}, creating{' '}
            {type === 'harmonious' ? 'natural harmony and flow' : type === 'challenging' ? 'dynamic tension that drives growth' : 'neutral energy'}{' '}
            in your chart.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// HOUSES TAB
// ============================================
function HousesTab({ houses }) {
  if (!houses?.houses) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-slate-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">🏠 House Placements</h2>
        <p className="text-slate-400 mb-2">Detailed house interpretations coming soon!</p>
        <p className="text-slate-500 text-sm italic">This will show which life areas each planet influences.</p>
      </div>
    );
  }

  const zodiacEmojis = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-white mb-2">House Cusps</h2>
        <p className="text-slate-400">{houses.system || 'Placidus'} house system</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(houses.houses).map(([num, house]) => (
          <div key={num} className="text-center p-4 bg-white/5 rounded-xl border border-purple-500/30">
            <div className="text-xl font-bold text-purple-300">{num}</div>
            <div className="text-2xl my-2">{zodiacEmojis[house.sign]}</div>
            <div className="text-sm text-white font-medium">{house.sign}</div>
            <div className="text-xs text-slate-500">{house.degreeFormatted}</div>
          </div>
        ))}
      </div>

      {/* Angular Houses */}
      {houses.angles && (
        <div className="mt-6 pt-6 border-t border-purple-500/30">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-purple-400 font-bold">ASC</span>
              <span className="text-white ml-2">{houses.angles.ascendant?.sign}</span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">IC</span>
              <span className="text-white ml-2">{houses.angles.ic?.sign}</span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">DSC</span>
              <span className="text-white ml-2">{houses.angles.descendant?.sign}</span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">MC</span>
              <span className="text-white ml-2">{houses.angles.mc?.sign}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// AI INSIGHTS TAB
// ============================================
function AIInsightsTab({ profile, aiAnalysis, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Sparkles className="w-12 h-12 text-purple-400 animate-spin mb-4" />
        <p className="text-purple-300">Generating constitutional synthesis...</p>
      </div>
    );
  }

  const synthesis = aiAnalysis?.synthesis || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8 px-6 bg-gradient-to-r from-violet-900/40 to-pink-900/40 rounded-2xl border border-violet-500/30">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Constitutional Synthesis
        </h2>
        <p className="text-slate-400">Where All Systems Point to the Same Truth</p>
      </div>

      <p className="text-center text-slate-400 max-w-2xl mx-auto">
        When astrology and other systems independently reveal the same patterns,
        you're seeing constitutional truths - the deep architecture of your soul.
      </p>

      {/* Pattern Convergence */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎯</span> Pattern Convergence
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
            <span className="text-3xl font-bold text-purple-400 block mb-1">{synthesis.convergence?.systemsCount || 2}</span>
            <span className="text-sm text-slate-400 uppercase">Systems</span>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
            <span className="text-3xl font-bold text-purple-400 block mb-1">{synthesis.convergence?.pointsCount || 3}</span>
            <span className="text-sm text-slate-400 uppercase">Points</span>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
            <span className="text-3xl font-bold text-purple-400 block mb-1">{synthesis.convergence?.clarity || '75%'}</span>
            <span className="text-sm text-slate-400 uppercase">Clarity</span>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm italic">
          Higher convergence indicates stronger constitutional patterns across different systems
        </p>
      </div>

      {/* AI Constitutional Reading */}
      <div className="bg-gradient-to-r from-violet-900/30 to-pink-900/30 p-6 rounded-2xl border-2 border-violet-500/30">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          <span>✨</span> AI Constitutional Reading
        </h3>
        <div className="bg-black/30 p-6 rounded-xl border-l-4 border-purple-500 mb-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            {synthesis.constitutionalReading ||
              `Your chart reveals a soul designed to bring unique gifts to the world. The patterns across your planetary positions create a constitutional signature that is distinctly yours.`}
          </p>
        </div>
        <p className="text-center text-slate-400 text-sm italic">
          This synthesis draws patterns from astrology to reveal your constitutional truth.
          When multiple systems agree, you're seeing the deep architecture of who you are.
        </p>
      </div>

      {/* For Relationships */}
      {synthesis.forRelationships && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>❤️</span> For Relationships
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-pink-500/10 rounded-xl border border-pink-500/30">
              <h4 className="text-pink-400 font-semibold mb-2">How to Love You</h4>
              <p className="text-slate-300 text-sm">{synthesis.forRelationships.lovingThem}</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
              <h4 className="text-red-400 font-semibold mb-2">How You Express Love</h4>
              <p className="text-slate-300 text-sm">{synthesis.forRelationships.theirLoveStyle}</p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
              <h4 className="text-orange-400 font-semibold mb-2">Conflict Resolution</h4>
              <p className="text-slate-300 text-sm">{synthesis.forRelationships.conflictResolution}</p>
            </div>
            <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/30">
              <h4 className="text-violet-400 font-semibold mb-2">Compatibility Notes</h4>
              <p className="text-slate-300 text-sm">{synthesis.forRelationships.compatibility}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cross System with MBTI if available */}
      {profile?.mbti && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🧬</span> Astrology + MBTI
          </h3>
          <p className="text-slate-300">
            Your {profile.mbti} type interacts uniquely with your astrological signature,
            creating your personal style of engagement with the world.
          </p>
        </div>
      )}
    </div>
  );
}

export default WesternAstrologyDecodePage;
