/**
 * Dynamic Personality Page
 * Integrates all Luna Fusion P4-P8 personality engines
 *
 * Features:
 * - P4: Natal Aspects - Birth chart planetary aspects
 * - P5: Transits - Current sky influences (temporary)
 * - P7: Archetypes - 12 Jungian archetypal mapping
 * - P8: Progressions - Secondary progressions + Progressed Moon
 *
 * Also shows complete 30-facet NEO PI-R personality profile
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import {
  NatalAspectsPanel,
  TransitsPanel,
  JungianArchetypePanel,
  ProgressionsPanel
} from '../components/personality';
import {
  fuseTo30Facets,
  generateCompleteProfile,
  vectorToDomainScores,
  calculateConfidence
} from '../data/lunaFusionService';

export default function DynamicPersonalityPage() {
  const { profiles, loading: profilesLoading } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [personalityData, setPersonalityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Select first profile by default
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      setSelectedProfile(profiles[0]);
    }
  }, [profiles, selectedProfile]);

  // Load personality data when profile changes
  useEffect(() => {
    if (selectedProfile) {
      loadPersonalityData();
    }
  }, [selectedProfile]);

  const loadPersonalityData = async () => {
    if (!selectedProfile) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare sources from profile
      const sources = {
        mbti: selectedProfile.mbti,
        enneagram: selectedProfile.enneagram,
        big5: selectedProfile.big5,
        bazi: selectedProfile.bazi,
        natal: selectedProfile.westernChart,
        numerology: selectedProfile.numerology
      };

      // Prepare birth data
      const birthData = {
        year: selectedProfile.birthYear,
        month: selectedProfile.birthMonth,
        day: selectedProfile.birthDay,
        hour: selectedProfile.birthHour || 12,
        minute: selectedProfile.birthMinute || 0,
        timezone: selectedProfile.timezone || 0,
        latitude: selectedProfile.latitude,
        longitude: selectedProfile.longitude
      };

      // Generate complete profile
      const result = await generateCompleteProfile(sources, birthData, 'Nurturing Guide');
      setPersonalityData(result);
    } catch (err) {
      console.error('Error loading personality data:', err);
      setError('Unable to load personality data. Some features may be limited.');
    } finally {
      setLoading(false);
    }
  };

  // Extract data for child components
  const natalPositions = useMemo(() => {
    return selectedProfile?.westernChart?.planets || null;
  }, [selectedProfile]);

  const birthData = useMemo(() => {
    if (!selectedProfile) return null;
    return {
      year: selectedProfile.birthYear,
      month: selectedProfile.birthMonth,
      day: selectedProfile.birthDay,
      hour: selectedProfile.birthHour || 12,
      minute: selectedProfile.birthMinute || 0,
      timezone: selectedProfile.timezone || 0,
      latitude: selectedProfile.latitude,
      longitude: selectedProfile.longitude
    };
  }, [selectedProfile]);

  const personalityVector = useMemo(() => {
    return personalityData?.personality?.vector || null;
  }, [personalityData]);

  // Loading state
  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="animate-pulse text-white/60">Loading profiles...</div>
      </div>
    );
  }

  // No profiles state
  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Profiles Found</h2>
            <p className="text-white/60 mb-6">
              Create a profile to explore your dynamic personality analysis.
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'O' },
    { id: 'aspects', label: 'Natal Aspects', icon: 'P4' },
    { id: 'transits', label: 'Transits', icon: 'P5' },
    { id: 'archetypes', label: 'Archetypes', icon: 'P7' },
    { id: 'progressions', label: 'Progressions', icon: 'P8' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dynamic Personality</h1>
            <p className="text-white/60">
              Luna Fusion P4-P8 Personality Engines
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Profile Selector */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <label className="text-white/70 text-sm">Profile:</label>
            <select
              value={selectedProfile?.id || ''}
              onChange={(e) => {
                const profile = profiles.find(p => p.id === e.target.value);
                setSelectedProfile(profile);
              }}
              className="bg-slate-700 text-white rounded-lg px-4 py-2 border border-white/10 flex-1 max-w-xs"
            >
              {profiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>

            {selectedProfile && (
              <div className="text-sm text-white/50">
                Born: {selectedProfile.birthMonth}/{selectedProfile.birthDay}/{selectedProfile.birthYear}
                {selectedProfile.birthHour !== undefined && (
                  <> at {selectedProfile.birthHour}:{String(selectedProfile.birthMinute || 0).padStart(2, '0')}</>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800/50 text-white/60 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-slate-800/50 rounded-xl p-8 text-center">
            <div className="animate-pulse text-white/60">
              Loading personality analysis...
            </div>
          </div>
        )}

        {/* Tab Content */}
        {!loading && selectedProfile && (
          <div className="bg-slate-800/30 rounded-xl p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab
                profile={selectedProfile}
                personalityData={personalityData}
                onRefresh={loadPersonalityData}
              />
            )}

            {/* P4: Natal Aspects Tab */}
            {activeTab === 'aspects' && (
              <NatalAspectsPanel
                natalPositions={natalPositions}
                showPatterns={true}
                showPersonalityImpact={true}
              />
            )}

            {/* P5: Transits Tab */}
            {activeTab === 'transits' && (
              <TransitsPanel
                natalPositions={natalPositions}
                showForecast={true}
                forecastDays={30}
              />
            )}

            {/* P7: Archetypes Tab */}
            {activeTab === 'archetypes' && (
              <JungianArchetypePanel
                personalityVector={personalityVector}
                showAllArchetypes={false}
                topN={3}
              />
            )}

            {/* P8: Progressions Tab */}
            {activeTab === 'progressions' && (
              <ProgressionsPanel
                birthData={birthData}
                showAllPlanets={false}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-black/20 rounded-xl p-4 text-center">
          <p className="text-xs text-white/40">
            Luna Fusion Personality System | P4-P8 Engines | 30-Facet NEO PI-R
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Overview Tab - Summary of all personality dimensions
 */
function OverviewTab({ profile, personalityData, onRefresh }) {
  const vector = personalityData?.personality?.vector;
  const confidence = personalityData?.personality?.confidence;
  const archetypes = personalityData?.archetypes?.dominantArchetypes;
  const lunaConfig = personalityData?.luna;

  // Calculate domain scores
  const domainScores = useMemo(() => {
    if (!vector || vector.length !== 30) {
      return { N: 0.5, E: 0.5, O: 0.5, A: 0.5, C: 0.5 };
    }
    return vectorToDomainScores(vector);
  }, [vector]);

  const domainLabels = {
    N: { name: 'Neuroticism', color: '#ef4444', description: 'Emotional sensitivity and stability' },
    E: { name: 'Extraversion', color: '#f59e0b', description: 'Social energy and assertiveness' },
    O: { name: 'Openness', color: '#8b5cf6', description: 'Creativity and intellectual curiosity' },
    A: { name: 'Agreeableness', color: '#10b981', description: 'Warmth and cooperation' },
    C: { name: 'Conscientiousness', color: '#3b82f6', description: 'Organization and self-discipline' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            {profile.name}'s Personality Overview
          </h2>
          <p className="text-sm text-white/60">
            30-facet NEO PI-R personality profile
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors"
        >
          Refresh Analysis
        </button>
      </div>

      {/* Confidence Indicator */}
      {confidence !== undefined && (
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Profile Confidence</span>
            <span className="text-sm font-bold text-white">{Math.round(confidence * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <p className="text-xs text-white/50 mt-2">
            {confidence >= 0.9 ? 'Complete profile - Maximum accuracy' :
             confidence >= 0.75 ? 'Strong profile - High accuracy' :
             confidence >= 0.6 ? 'Good foundation - Consider adding assessments' :
             'Basic profile - Add assessments for better accuracy'}
          </p>
        </div>
      )}

      {/* OCEAN Domain Scores */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-4">Big Five Domains</h3>
        <div className="space-y-4">
          {Object.entries(domainLabels).map(([key, domain]) => {
            const score = domainScores[key] || 0.5;
            const percent = Math.round(score * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-white">{domain.name}</span>
                    <span className="text-xs text-white/40 ml-2">{domain.description}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: domain.color }}>
                    {percent}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: domain.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dominant Archetypes Preview */}
      {archetypes && archetypes.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4">Dominant Archetypes</h3>
          <div className="flex gap-3">
            {archetypes.slice(0, 3).map((arch, idx) => (
              <div
                key={idx}
                className={`flex-1 bg-black/20 rounded-lg p-4 text-center ${
                  idx === 0 ? 'ring-2 ring-purple-500/50' : ''
                }`}
              >
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  #{idx + 1}
                </div>
                <div className="text-white font-medium">{arch.name}</div>
                <div className="text-xs text-white/50">
                  {Math.round((arch.score || 0) * 100)}% match
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links to Other Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'aspects', label: 'Natal Aspects', icon: 'P4', desc: 'Birth chart patterns' },
          { id: 'transits', label: 'Current Transits', icon: 'P5', desc: 'Sky influences now' },
          { id: 'archetypes', label: 'Archetypes', icon: 'P7', desc: '12 Jungian patterns' },
          { id: 'progressions', label: 'Progressions', icon: 'P8', desc: 'Life phase evolution' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => document.querySelector(`[data-tab="${item.id}"]`)?.click()}
            className="bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 text-left transition-colors border border-white/5 hover:border-white/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-purple-600/30 text-purple-300 px-1.5 py-0.5 rounded">
                {item.icon}
              </span>
              <span className="font-medium text-white">{item.label}</span>
            </div>
            <p className="text-xs text-white/50">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Data Sources */}
      <div className="bg-black/20 rounded-xl p-4">
        <div className="text-sm font-bold text-white/70 mb-2">Available Data Sources:</div>
        <div className="flex flex-wrap gap-2">
          {profile.mbti && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
              MBTI: {profile.mbti}
            </span>
          )}
          {profile.enneagram && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
              Enneagram: {profile.enneagram.core || profile.enneagram}
            </span>
          )}
          {profile.big5 && (
            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
              Big 5
            </span>
          )}
          {profile.bazi && (
            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
              BaZi
            </span>
          )}
          {profile.westernChart && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
              Western Chart
            </span>
          )}
          {profile.numerology && (
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
              Numerology
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
