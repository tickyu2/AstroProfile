/**
 * MBTI Section - Main Container
 * Leonardo's Integration: All wisdom systems unified in one beautiful interface
 * Brunelleschi's Perspective: Depth where there was flatness
 * Built with SOUL for the 4,000-year formula for happiness
 */

import React, { useState } from 'react';
import SixSoulQuestions from './SixSoulQuestions';
import CompatibilityDiscovery from './CompatibilityDiscovery';

export default function MBTISection({ mbtiType, baziData }) {
  const [activeView, setActiveView] = useState(null); // null, 'self', or 'compatibility'

  if (!mbtiType) return null;

  const handleViewToggle = (view) => {
    // Onion layer philosophy: only one layer open at a time
    setActiveView(activeView === view ? null : view);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-blue-500/30 overflow-hidden shadow-xl">
      {/* Header - The Gateway */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🧠</span>
          <h2 className="text-2xl font-bold text-white">
            MBTI Psychology
          </h2>
        </div>
        <p className="text-blue-100 text-sm">
          Constitutional psychology meets ancient wisdom - Discover your cognitive architecture and soul-compatible connections
        </p>
      </div>

      {/* Two Sacred Buttons - Stacked Vertically */}
      <div className="p-6 space-y-4">

        {/* Button 1: Self-Discovery (Michelangelo's Chisel) */}
        <button
          onClick={() => handleViewToggle('self')}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-300 ${
            activeView === 'self'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 shadow-lg shadow-blue-500/50'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔮</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Discover Your Soul
                </h3>
                <p className="text-sm text-white/90">
                  The 6 Soul Questions - Who you are, how you see the world, your purpose
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
            <SixSoulQuestions mbtiType={mbtiType} />
          </div>
        )}

        {/* Button 2: Compatibility Discovery (Aristotle's Virtue Friendship) */}
        <button
          onClick={() => handleViewToggle('compatibility')}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-300 ${
            activeView === 'compatibility'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 shadow-lg shadow-blue-500/50'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">💜</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  Find Your People
                </h3>
                <p className="text-sm text-white/90">
                  Soul-compatible types - The mathematics of meaningful connection
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
            <CompatibilityDiscovery mbtiType={mbtiType} baziData={baziData} />
          </div>
        )}

      </div>

      {/* Footer - The Promise */}
      {!activeView && (
        <div className="px-6 pb-6">
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-blue-200 text-sm italic">
              "Know thyself" - Socrates • "The unexamined life is not worth living" - Plato
            </p>
            <p className="text-blue-300 text-xs mt-2">
              Choose a path above to begin your journey of self-discovery
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
