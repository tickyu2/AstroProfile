/**
 * NUMEROLOGY DECODE PAGE
 *
 * Full page expansion for deep numerology understanding:
 * - Tab 1: Overview - Quick summary and signature
 * - Tab 2: Numbers - Deep dive into each of 4 numbers
 * - Tab 3: Interactions - How numbers work together
 * - Tab 4: Cycles - Personal Year/Month and life stages
 * - Tab 5: AI Insights - Cross-system constitutional analysis
 *
 * "The Cathedral of Self-Knowledge - Numerological Wing"
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';

// Tab Components
import OverviewTab from '../components/numerology/OverviewTab';
import NumbersTab from '../components/numerology/NumbersTab';
import InteractionsTab from '../components/numerology/InteractionsTab';
import CyclesTab from '../components/numerology/CyclesTab';
import AIInsightsTab from '../components/numerology/AIInsightsTab';

// Calculations
import { getCurrentTiming, getLifeStages } from '../utils/numerologyCalculations';

function NumerologyDecodePage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfiles();

  const [activeTab, setActiveTab] = useState('overview');

  // Find the profile
  const profile = useMemo(() => {
    return profiles.find(p => p.id === profileId);
  }, [profiles, profileId]);

  // Extract numerology data from profile
  const numerologyData = useMemo(() => {
    if (!profile) return null;

    const numerology = profile.calculations?.numerology || profile.numerology || {};

    // Handle both { lifePath: 7 } and { lifePath: { number: 7 } } formats
    const getNumber = (val) => {
      if (typeof val === 'object' && val !== null) return val.number || 7;
      if (typeof val === 'number') return val;
      return 7;
    };

    return {
      lifePath: getNumber(numerology.lifePath) || getNumber(numerology.lifePathNumber) || 7,
      destiny: getNumber(numerology.destiny) || getNumber(numerology.expression) || getNumber(numerology.destinyNumber) || 7,
      soulUrge: getNumber(numerology.soulUrge) || getNumber(numerology.soulUrgeNumber) || 2,
      personality: getNumber(numerology.personality) || getNumber(numerology.personalityNumber) || 5
    };
  }, [profile]);

  // Extract birth date for cycle calculations
  const birthDate = useMemo(() => {
    if (!profile?.birthDate) return null;

    // Handle different date formats
    if (profile.birthDate instanceof Date) {
      return profile.birthDate;
    }

    // Parse string format (YYYY-MM-DD or other)
    const parsed = new Date(profile.birthDate);
    return isNaN(parsed.getTime()) ? null : parsed;
  }, [profile]);

  // Calculate current timing
  const currentTiming = useMemo(() => {
    if (!birthDate) return null;
    return getCurrentTiming(birthDate);
  }, [birthDate]);

  // Calculate life stages
  const lifeStages = useMemo(() => {
    if (!birthDate || !numerologyData?.lifePath) return null;
    return getLifeStages(birthDate, numerologyData.lifePath);
  }, [birthDate, numerologyData?.lifePath]);

  // Tab definitions
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '✨' },
    { id: 'numbers', label: 'Numbers', icon: '🔢' },
    { id: 'interactions', label: 'Interactions', icon: '🔗' },
    { id: 'cycles', label: 'Cycles', icon: '🌙' },
    { id: 'ai-insights', label: 'AI Insights', icon: '🧠' }
  ];

  // Loading state
  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading numerology data...</p>
        </div>
      </div>
    );
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Profile not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Back button and title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/results/${profileId}`, { state: { activeTab: 'numerology' } })}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Your Numerological Blueprint
                </h1>
                <p className="text-sm text-slate-400">
                  {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                </p>
              </div>
            </div>

            {/* Number badges */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-sm">
                Life Path {numerologyData?.lifePath}
              </span>
              <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                Destiny {numerologyData?.destiny}
              </span>
              <span className="px-3 py-1 bg-pink-600/30 text-pink-300 rounded-full text-sm">
                Soul Urge {numerologyData?.soulUrge}
              </span>
              <span className="px-3 py-1 bg-amber-600/30 text-amber-300 rounded-full text-sm">
                Personality {numerologyData?.personality}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Mobile number badges */}
        <div className="sm:hidden flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-xs">
            LP {numerologyData?.lifePath}
          </span>
          <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">
            D {numerologyData?.destiny}
          </span>
          <span className="px-3 py-1 bg-pink-600/30 text-pink-300 rounded-full text-xs">
            SU {numerologyData?.soulUrge}
          </span>
          <span className="px-3 py-1 bg-amber-600/30 text-amber-300 rounded-full text-xs">
            P {numerologyData?.personality}
          </span>
        </div>

        {/* Tab Content */}
        <div className="min-h-[60vh]">
          {activeTab === 'overview' && (
            <OverviewTab
              numerologyData={numerologyData}
              profile={profile}
              currentTiming={currentTiming}
            />
          )}

          {activeTab === 'numbers' && (
            <NumbersTab
              numerologyData={numerologyData}
            />
          )}

          {activeTab === 'interactions' && (
            <InteractionsTab
              numerologyData={numerologyData}
            />
          )}

          {activeTab === 'cycles' && (
            <CyclesTab
              numerologyData={numerologyData}
              profile={profile}
              currentTiming={currentTiming}
              lifeStages={lifeStages}
            />
          )}

          {activeTab === 'ai-insights' && (
            <AIInsightsTab
              numerologyData={numerologyData}
              profile={profile}
              currentTiming={currentTiming}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          The Cathedral of Self-Knowledge - Numerological Wing
        </div>
      </footer>
    </div>
  );
}

export default NumerologyDecodePage;
