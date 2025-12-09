import React, { useState } from 'react'
import { calculateArchetypeCompatibility, findBestMatches, findMostChallenging } from '../utils/archetypeCompatibility'

/**
 * ============================================
 * ARCHETYPE COMPATIBILITY PANEL
 * Displays compatibility analysis between two personality archetypes
 * ============================================
 */

export default function ArchetypeCompatibilityPanel({ archetype1, archetype2 }) {
  const [showBestMatches, setShowBestMatches] = useState(false)

  if (!archetype1 || !archetype2) {
    return (
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 text-center">
        <p className="text-white/60">Archetype data not available</p>
        <p className="text-sm text-white/40 mt-2">Complete birth information required for both profiles</p>
      </div>
    )
  }

  // Calculate compatibility
  const compatibility = calculateArchetypeCompatibility(archetype1, archetype2)

  if (!compatibility) {
    return (
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 text-center">
        <p className="text-white/60">Unable to calculate compatibility</p>
      </div>
    )
  }

  const { score, level, emoji, color, elementalDynamics, advice } = compatibility

  // Get best/worst matches for context
  const bestMatches = findBestMatches(archetype1, 3)
  const worstMatches = findMostChallenging(archetype1, 3)

  return (
    <div className={`bg-gradient-to-br ${color} p-1 rounded-2xl`}>
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg rounded-2xl p-6">

        {/* Header - Archetype Comparison */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">
            🎭 Personality Archetype Compatibility
          </h3>

          {/* The Two Archetypes */}
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl mb-2">{archetype1.symbol}</div>
              <div className="text-white font-bold">{archetype1.name}</div>
              <div className="text-white/60 text-sm">{archetype1.dominantElement}{archetype1.secondaryElement && ` + ${archetype1.secondaryElement}`}</div>
            </div>

            <div className="text-4xl">💫</div>

            <div className="text-center">
              <div className="text-5xl mb-2">{archetype2.symbol}</div>
              <div className="text-white font-bold">{archetype2.name}</div>
              <div className="text-white/60 text-sm">{archetype2.dominantElement}{archetype2.secondaryElement && ` + ${archetype2.secondaryElement}`}</div>
            </div>
          </div>
        </div>

        {/* Compatibility Score */}
        <div className="bg-black/30 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-3">{emoji}</div>
            <div className="text-4xl font-bold text-white mb-2">{score}%</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
              {level}
            </div>
          </div>

          {/* Score Bar */}
          <div className="mt-6 bg-white/10 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Elemental Dynamics */}
        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-4 border border-white/10 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">⚡ Elemental Dynamics</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-white/60">Relationship:</span>
              <span className="text-white font-bold capitalize">{elementalDynamics.type}</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {elementalDynamics.description}
            </p>
          </div>
        </div>

        {/* Advice Section */}
        <div className="space-y-4">
          {/* Title & Description */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-3">{advice.title}</h4>
            <p className="text-white/90 leading-relaxed">{advice.description}</p>
          </div>

          {/* Strengths */}
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
            <h4 className="text-lg font-bold text-green-400 mb-3">✨ Strengths</h4>
            <ul className="space-y-2">
              {advice.strengths.map((strength, index) => (
                <li key={index} className="text-white/80 flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advice */}
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
            <h4 className="text-lg font-bold text-purple-400 mb-3">💡 Relationship Advice</h4>
            <ul className="space-y-2">
              {advice.advice.map((tip, index) => (
                <li key={index} className="text-white/80 flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Toggle Best/Worst Matches */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setShowBestMatches(!showBestMatches)}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
          >
            {showBestMatches ? '▲ Hide Match Context' : '▼ Show Best & Challenging Matches'}
          </button>

          {showBestMatches && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Best Matches */}
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                <h5 className="text-sm font-bold text-green-400 mb-3">
                  ✨ Best Matches for {archetype1.name}
                </h5>
                <div className="space-y-2">
                  {bestMatches.map((match, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-white/80">
                        {match.archetype.symbol} {match.archetype.name}
                      </span>
                      <span className="text-green-400 font-bold">{match.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Challenging */}
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                <h5 className="text-sm font-bold text-red-400 mb-3">
                  ⚡ Most Challenging for {archetype1.name}
                </h5>
                <div className="space-y-2">
                  {worstMatches.map((match, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-white/80">
                        {match.archetype.symbol} {match.archetype.name}
                      </span>
                      <span className="text-red-400 font-bold">{match.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs text-center leading-relaxed">
            Archetype compatibility is based on Five Elements theory and elemental harmony.
            Scores reflect natural tendencies, not destiny. All relationships can thrive with awareness and effort.
          </p>
        </div>
      </div>
    </div>
  )
}
