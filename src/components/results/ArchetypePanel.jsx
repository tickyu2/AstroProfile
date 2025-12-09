import React, { useState } from 'react'

/**
 * ============================================
 * ARCHETYPE PANEL
 * Displays user's personality archetype
 * ============================================
 */

export default function ArchetypePanel({ archetype, profile }) {
  const [showDetails, setShowDetails] = useState(false)

  if (!archetype) {
    return (
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
        <div className="text-center text-white/60">
          <p>Unable to determine personality archetype</p>
          <p className="text-sm mt-2">Complete birth information required</p>
        </div>
      </div>
    )
  }

  // Get element color
  const getElementColor = (element) => {
    const colors = {
      Wood: 'from-green-600 to-emerald-600',
      Fire: 'from-red-600 to-orange-600',
      Earth: 'from-yellow-600 to-amber-600',
      Metal: 'from-gray-400 to-slate-500',
      Water: 'from-blue-600 to-cyan-600'
    }
    return colors[element] || 'from-purple-600 to-pink-600'
  }

  const gradientClass = getElementColor(archetype.dominantElement)

  return (
    <div className={`bg-gradient-to-br ${gradientClass} p-1 rounded-2xl`}>
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg rounded-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{archetype.symbol}</div>
          <h3 className="text-3xl font-bold text-white mb-2">
            {archetype.name}
          </h3>
          <div className="flex justify-center gap-2 flex-wrap mb-3">
            {archetype.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            {archetype.dominantElement}
            {archetype.secondaryElement && ` + ${archetype.secondaryElement}`}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-white/90 text-lg leading-relaxed text-center italic">
            "{archetype.description}"
          </p>
        </div>

        {/* Toggle Details Button */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
          >
            {showDetails ? '▲ Hide Details' : '▼ Show Details'}
          </button>
        </div>

        {/* Details (Expandable) */}
        {showDetails && (
          <div className="space-y-4 mt-6">
            {/* Strengths */}
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <h4 className="text-lg font-bold text-green-400 mb-3">✨ Your Strengths</h4>
              <ul className="space-y-2">
                {archetype.strengths.map((strength, index) => (
                  <li key={index} className="text-white/80 flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <h4 className="text-lg font-bold text-amber-400 mb-3">⚡ Your Challenges</h4>
              <ul className="space-y-2">
                {archetype.challenges.map((challenge, index) => (
                  <li key={index} className="text-white/80 flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Life Path */}
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-lg font-bold text-purple-400 mb-3">🎯 Your Life Path</h4>
              <p className="text-white/90 leading-relaxed">{archetype.lifePath}</p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/50 text-sm text-center">
            Your archetype is determined by your elemental balance from the Four Pillars of Destiny (BaZi).
            It represents your core constitutional pattern and how you naturally interact with the world.
          </p>
        </div>
      </div>
    </div>
  )
}
