/**
 * WesternZodiacSection.jsx
 * Western Zodiac Container - Father Ticky's 6-6 Cusp Model
 *
 * Like MBTISection, provides expandable access to:
 * 1. Cusp Self-Discovery - Learn about your cusp archetype
 * 2. Compatibility Constellation - Find compatible cusps
 *
 * Built by Brother Claude Code
 * December 12, 2024
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WesternZodiacCompatibility from './WesternZodiacCompatibility';
import CuspDetailPanel from './CuspDetailPanel';
import { getCuspDataFromDate, getCuspDisplayName, getSignEmoji } from '../../utils/westernZodiac/cuspCalculator';

export default function WesternZodiacSection({ birthDate, userName, onSelectMatch }) {
  const [activeView, setActiveView] = useState(null); // null, 'self', or 'compatibility'
  const [selectedCusp, setSelectedCusp] = useState(null);

  // Get user's cusp from birth date
  const userCusp = birthDate ? getCuspDataFromDate(birthDate) : null;

  const handleViewToggle = (view) => {
    setActiveView(activeView === view ? null : view);
    setSelectedCusp(null);
  };

  const handleSelectMatch = (cusp) => {
    setSelectedCusp(cusp);
    if (onSelectMatch) {
      onSelectMatch(cusp);
    }
  };

  if (!birthDate) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-indigo-500/30 overflow-hidden shadow-xl p-6">
        <div className="text-center">
          <span className="text-4xl block mb-4">⭐</span>
          <h3 className="text-xl font-bold text-white mb-2">Western Zodiac</h3>
          <p className="text-white/60">
            Birth date required to determine your cusp position
          </p>
        </div>
      </div>
    );
  }

  if (!userCusp) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-indigo-500/30 overflow-hidden shadow-xl p-6">
        <div className="text-center">
          <span className="text-4xl block mb-4">⚠️</span>
          <h3 className="text-xl font-bold text-white mb-2">Cusp Calculation Error</h3>
          <p className="text-white/60">
            Unable to determine cusp for the given birth date
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-indigo-500/30 overflow-hidden shadow-xl">
      {/* Header - The Gateway */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getSignEmoji(userCusp.sign)}</span>
          <h2 className="text-2xl font-bold text-white">
            Western Zodiac
          </h2>
        </div>
        <p className="text-indigo-100 text-sm">
          Father Ticky's 36-Cusp System - Discover your precise celestial position
        </p>
      </div>

      {/* Two Sacred Buttons - Stacked Vertically */}
      <div className="p-6 space-y-4">

        {/* Button 1: Self-Discovery */}
        <button
          onClick={() => handleViewToggle('self')}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-300 ${
            activeView === 'self'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-400 shadow-lg shadow-indigo-500/50'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400 hover:shadow-lg hover:shadow-amber-500/50 hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{userCusp.emoji}</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Unlock Your Secrets
                </h3>
                <p className="text-sm text-white/90">
                  {userCusp.archetype} - Your cusp position revealed
                </p>
              </div>
            </div>
            <svg
              className={`w-6 h-6 text-white transition-transform duration-300 ${
                activeView === 'self' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Self-Discovery Content (Onion Layer 1) */}
        {activeView === 'self' && (
          <div className="animate-slideDown">
            <CuspDetailPanel cusp={userCusp} isUserCusp={true} />
          </div>
        )}

        {/* Button 2: Compatibility Discovery */}
        <button
          onClick={() => handleViewToggle('compatibility')}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-300 ${
            activeView === 'compatibility'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-400 shadow-lg shadow-indigo-500/50'
              : 'bg-gradient-to-r from-purple-500 to-pink-600 border-purple-400 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">💜</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Find Compatible Cusps
                </h3>
                <p className="text-sm text-white/90">
                  Celestial compatibility - Your soul-aligned matches
                </p>
              </div>
            </div>
            <svg
              className={`w-6 h-6 text-white transition-transform duration-300 ${
                activeView === 'compatibility' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Compatibility Content (Onion Layer 2) */}
        {activeView === 'compatibility' && (
          <div className="animate-slideDown">
            <WesternZodiacCompatibility
              userCusp={userCusp}
              userName={userName}
              onSelectMatch={handleSelectMatch}
            />
          </div>
        )}

        {/* Selected Match Detail (Onion Layer 3) */}
        {selectedCusp && activeView === 'compatibility' && (
          <div className="animate-slideDown border-t border-white/10 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                Compatibility with {getCuspDisplayName(selectedCusp)}
              </h3>
              <button
                onClick={() => setSelectedCusp(null)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>
            <CuspDetailPanel
              cusp={selectedCusp}
              compareTo={userCusp}
              isUserCusp={false}
            />
          </div>
        )}

        {/* Browse All 36 Cusps - Link to full page */}
        <Link
          to="/zodiac-cusps"
          className="w-full p-4 mt-4 rounded-lg border-2 border-indigo-500/30 bg-indigo-900/20 hover:bg-indigo-900/40 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <span className="text-2xl">⭐</span>
          <div className="text-center">
            <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">
              Browse All 36 Cusp Positions
            </span>
            <p className="text-xs text-white/50">
              Copy & paste to Grok/AI for self-discovery
            </p>
          </div>
          <span className="text-white/50 group-hover:text-white transition-colors">→</span>
        </Link>

      </div>

      {/* Footer - The Promise */}
      {!activeView && (
        <div className="px-6 pb-6">
          <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">{getSignEmoji(userCusp.sign)}</span>
              <span className="text-lg font-bold text-white">
                {getCuspDisplayName(userCusp)}
              </span>
              <span className="text-xl">{userCusp.emoji}</span>
            </div>
            <p className="text-indigo-200 text-sm italic">
              "{userCusp.archetype}"
            </p>
            <p className="text-indigo-300 text-xs mt-2">
              Choose a path above to explore your celestial constitution
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
