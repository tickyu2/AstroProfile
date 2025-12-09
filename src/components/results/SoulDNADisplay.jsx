import React, { useState } from 'react'

/**
 * ============================================
 * SOULDNA DISPLAY COMPONENT
 * Displays the user's 8-character SoulDNA code
 * Format: XXX-L##Z
 * ============================================
 */

export default function SoulDNADisplay({ soulDNA, decodedDNA }) {
  const [copied, setCopied] = useState(false)
  const [showDecoded, setShowDecoded] = useState(false)

  if (!soulDNA) {
    return (
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 text-center">
        <div className="text-white/60">
          <p>Unable to generate SoulDNA code</p>
          <p className="text-sm mt-2">Complete birth information required</p>
        </div>
      </div>
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(soulDNA)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-1 rounded-2xl">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg rounded-2xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🧬</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Your SoulDNA Code
          </h3>
          <p className="text-white/60 text-sm">
            Your unique constitutional signature
          </p>
        </div>

        {/* DNA Code Display */}
        <div className="mb-6">
          <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-center gap-4">
              <code className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 tracking-wider">
                {soulDNA}
              </code>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg text-purple-300 transition-all text-sm border border-purple-500/30"
                title="Copy SoulDNA code"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Breakdown Button */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowDecoded(!showDecoded)}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
          >
            {showDecoded ? '▲ Hide Breakdown' : '▼ Show Breakdown'}
          </button>
        </div>

        {/* Decoded Information (Expandable) */}
        {showDecoded && decodedDNA && (
          <div className="space-y-4 mt-6">
            {/* Elements */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-3">🌟 Elemental Signature</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Primary Element:</span>
                  <span className="text-white font-bold">{decodedDNA.elements.primary} ({decodedDNA.primaryPercentage}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Secondary Element:</span>
                  <span className="text-white font-bold">{decodedDNA.elements.secondary}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Tertiary Element:</span>
                  <span className="text-white font-bold">{decodedDNA.elements.tertiary}</span>
                </div>
              </div>
            </div>

            {/* Ten God */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-3">🎭 Personality Influence</h4>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Dominant Ten God:</span>
                <span className="text-white font-bold">{decodedDNA.dominantTenGod}</span>
              </div>
            </div>

            {/* Yin/Yang */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-4 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-3">☯️ Energetic Polarity</h4>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Yin/Yang Balance:</span>
                <span className="text-white font-bold">{decodedDNA.yinYang}</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/80 text-sm text-center font-mono">
                {decodedDNA.description}
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs text-center leading-relaxed">
            Your SoulDNA code is a unique 8-character signature derived from your Four Pillars (BaZi).
            <br />
            Share this code with others to quickly compare constitutional compatibility.
          </p>
        </div>

        {/* Legend */}
        <div className="mt-4 bg-black/20 rounded-lg p-4">
          <h4 className="text-sm font-bold text-white/70 mb-3 text-center">Code Format: XXX-L##Z</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="text-center">
              <div className="text-white/50">XXX</div>
              <div className="text-white/80">Top 3 Elements</div>
              <div className="text-white/40 text-[10px] mt-1">W/F/E/M/A</div>
            </div>
            <div className="text-center">
              <div className="text-white/50">L</div>
              <div className="text-white/80">Dominant God</div>
              <div className="text-white/40 text-[10px] mt-1">Ten Gods</div>
            </div>
            <div className="text-center">
              <div className="text-white/50">##</div>
              <div className="text-white/80">Primary %</div>
              <div className="text-white/40 text-[10px] mt-1">00-99</div>
            </div>
            <div className="text-center">
              <div className="text-white/50">Z</div>
              <div className="text-white/80">Yin/Yang</div>
              <div className="text-white/40 text-[10px] mt-1">Y/X/B</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
