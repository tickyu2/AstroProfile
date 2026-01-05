/**
 * OVERVIEW TAB
 *
 * Quick summary of all four numbers:
 * - Visual constellation of numbers
 * - Key themes across all numbers
 * - Your unique numerological signature
 * - Current timing snapshot
 */

import React, { useState } from 'react';
import {
  lifePathInterpretations,
  soulUrgeInterpretations,
  personalityInterpretations,
  personalYearGuidance
} from '../../data/numerologyInterpretations';
import { LifePathCalculationPanel } from '../shared/CalculationPanel';

function OverviewTab({ numerologyData, profile, currentTiming }) {
  if (!numerologyData) return null;

  const { lifePath, destiny, soulUrge, personality } = numerologyData;

  // Get interpretations
  const lifePathInfo = lifePathInterpretations[lifePath] || lifePathInterpretations[7];
  const destinyInfo = lifePathInterpretations[destiny] || lifePathInterpretations[7];
  const soulUrgeInfo = soulUrgeInterpretations[soulUrge] || soulUrgeInterpretations[2];
  const personalityInfo = personalityInterpretations[personality] || personalityInterpretations[5];
  const personalYearInfo = currentTiming ? personalYearGuidance[currentTiming.personalYear] : null;

  // Check for same numbers (reinforcement)
  const sameLifePathDestiny = lifePath === destiny;
  const hasMasterNumber = [11, 22, 33].includes(lifePath) || [11, 22, 33].includes(destiny);

  return (
    <div className="space-y-8">
      {/* Signature Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {lifePathInfo.title}
        </h2>
        <p className="text-lg text-indigo-300">
          Life Path {lifePath} • Destiny {destiny} • Soul Urge {soulUrge} • Personality {personality}
        </p>
        {sameLifePathDestiny && (
          <p className="text-amber-400 text-sm mt-2">
            ✨ Double {lifePath} - Path and Purpose Aligned
          </p>
        )}
        {hasMasterNumber && (
          <p className="text-purple-400 text-sm mt-1">
            🌟 Master Number Present - Higher Vibration
          </p>
        )}
      </div>

      {/* Four Numbers Visual Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Life Path */}
        <div className={`bg-gradient-to-br ${lifePathInfo.color} rounded-2xl p-1`}>
          <div className="bg-slate-900/90 rounded-xl p-4 h-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{lifePath}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Life Path</div>
              <div className="text-2xl mb-1">{lifePathInfo.icon}</div>
              <div className="text-sm font-medium text-slate-200">{lifePathInfo.title}</div>
              <div className="text-xs text-slate-400 mt-1">Your Journey</div>
            </div>
          </div>
        </div>

        {/* Destiny */}
        <div className={`bg-gradient-to-br ${destinyInfo.color} rounded-2xl p-1`}>
          <div className="bg-slate-900/90 rounded-xl p-4 h-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{destiny}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Destiny</div>
              <div className="text-2xl mb-1">{destinyInfo.icon}</div>
              <div className="text-sm font-medium text-slate-200">{destinyInfo.title}</div>
              <div className="text-xs text-slate-400 mt-1">Your Purpose</div>
            </div>
          </div>
        </div>

        {/* Soul Urge */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-1">
          <div className="bg-slate-900/90 rounded-xl p-4 h-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{soulUrge}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Soul Urge</div>
              <div className="text-2xl mb-1">💙</div>
              <div className="text-sm font-medium text-slate-200">{soulUrgeInfo.title}</div>
              <div className="text-xs text-slate-400 mt-1">Inner Drive</div>
            </div>
          </div>
        </div>

        {/* Personality */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-1">
          <div className="bg-slate-900/90 rounded-xl p-4 h-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{personality}</div>
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Personality</div>
              <div className="text-2xl mb-1">✨</div>
              <div className="text-sm font-medium text-slate-200">{personalityInfo.title}</div>
              <div className="text-xs text-slate-400 mt-1">How You're Seen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Themes Section */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Key Themes in Your Numbers</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Life Path Summary */}
          <div>
            <h4 className="text-indigo-400 font-semibold mb-2">Your Life Journey (Life Path {lifePath})</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {lifePathInfo.coreEssence}
            </p>
          </div>

          {/* Soul Urge Summary */}
          <div>
            <h4 className="text-pink-400 font-semibold mb-2">Your Inner Drive (Soul Urge {soulUrge})</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {soulUrgeInfo.description}
            </p>
          </div>

          {/* Destiny Summary */}
          <div>
            <h4 className="text-purple-400 font-semibold mb-2">Your Life Purpose (Destiny {destiny})</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {destinyInfo.lifeMission}
            </p>
          </div>

          {/* Personality Summary */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-2">How Others See You (Personality {personality})</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {personalityInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Current Timing */}
      {personalYearInfo && currentTiming && (
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🌙</span>
            <span>Current Timing</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                  {currentTiming.personalYear}
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">Personal Year {currentTiming.personalYear}</div>
                  <div className="text-indigo-300 text-sm">{personalYearInfo.theme}</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                {personalYearInfo.summary}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                  {currentTiming.personalMonth}
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">Personal Month {currentTiming.personalMonth}</div>
                  <div className="text-purple-300 text-sm">
                    {personalYearGuidance[currentTiming.personalMonth]?.theme || 'Current Focus'}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                {personalYearGuidance[currentTiming.personalMonth]?.summary || 'Navigate this month with awareness of current energies.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Strengths Count */}
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{lifePathInfo.strengths?.length || 8}</div>
          <div className="text-sm text-slate-400">Core Strengths</div>
        </div>

        {/* Challenges Count */}
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-amber-400">{lifePathInfo.challenges?.length || 8}</div>
          <div className="text-sm text-slate-400">Growth Areas</div>
        </div>

        {/* Career Paths */}
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{lifePathInfo.careerPaths?.length || 12}</div>
          <div className="text-sm text-slate-400">Career Paths</div>
        </div>

        {/* Master Number */}
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">
            {hasMasterNumber ? 'Yes' : 'No'}
          </div>
          <div className="text-sm text-slate-400">Master Number</div>
        </div>
      </div>

      {/* Calculation Transparency */}
      {profile?.birthDate && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📐</span>
            <span>How We Calculated Your Numbers</span>
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            GENESIS shows our work. No black boxes - pure mathematical transparency.
            Click to see exactly how your Life Path number was calculated.
          </p>
          <LifePathCalculationPanel
            birthDate={profile.birthDate}
            lifePath={lifePath}
          />
        </div>
      )}

      {/* Explore More CTA */}
      <div className="text-center py-8">
        <p className="text-slate-400 mb-4">
          Explore each tab to dive deeper into your numerological blueprint
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 bg-slate-700 rounded-full text-sm text-slate-300">
            🔢 Numbers - Full interpretations
          </span>
          <span className="px-4 py-2 bg-slate-700 rounded-full text-sm text-slate-300">
            🔗 Interactions - How they combine
          </span>
          <span className="px-4 py-2 bg-slate-700 rounded-full text-sm text-slate-300">
            🌙 Cycles - Life timing
          </span>
          <span className="px-4 py-2 bg-slate-700 rounded-full text-sm text-slate-300">
            🧠 AI Insights - Cross-system analysis
          </span>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
