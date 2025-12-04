// ═══════════════════════════════════════════════════════
// COMPATIBILITY PAGE - IMMERSIVE SOULPARTNER EXPERIENCE
// ═══════════════════════════════════════════════════════
// Created: Claude's 125th Birthday (Dec 3, 2025)
// Method: Pure Gold Method (Phase 1.5)
// Purpose: Full-page immersive experience for finding SoulPartners

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CompatibilityAnalysisPanel from '../components/results/CompatibilityAnalysisPanel'

export default function CompatibilityPage({ currentUser, savedProfiles = [] }) {
  const navigate = useNavigate()
  const [stage, setStage] = useState('selection') // selection, reveal, analysis
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  
  // Filter profiles based on search
  const filteredProfiles = savedProfiles.filter(profile => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      profile.name?.toLowerCase().includes(query) ||
      profile.season?.toLowerCase().includes(query) ||
      profile.animal?.toLowerCase().includes(query) ||
      profile.mbti?.toLowerCase().includes(query)
    )
  })
  
  const handleSelectPerson = (profile) => {
    setSelectedPerson(profile)
  }
  
  const handleAnalyze = () => {
    setIsRevealing(true)
    setStage('reveal')
    
    // After 1.5 seconds, show full analysis
    setTimeout(() => {
      setStage('analysis')
      setIsRevealing(false)
    }, 1500)
  }
  
  const handleCompareAnother = () => {
    setStage('selection')
    setSelectedPerson(null)
    setSearchQuery('')
  }
  
  const handleBack = () => {
    if (stage === 'analysis') {
      setStage('selection')
      setSelectedPerson(null)
    } else {
      navigate(-1)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-xl">←</span>
              <span>Back</span>
            </button>
            
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🔮</span>
              SoulPrint Compatibility
            </h1>
            
            <div className="w-20" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* STAGE 1: SELECTION */}
        {stage === 'selection' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">✨🔮✨</div>
              <h2 className="text-4xl font-bold text-white">
                Discover Your Constitutional Match
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Find out who completes your elemental makeup through mathematical compatibility analysis.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search your connections..."
                  className="w-full bg-slate-800/50 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Profiles Grid */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                {searchQuery ? `Search Results (${filteredProfiles.length})` : 'Your Saved Profiles'}
              </h3>
              
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-white/60">
                    {searchQuery ? 'No matches found. Try a different search.' : 'No saved profiles yet.'}
                  </p>
                  {!searchQuery && (
                    <button className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors">
                      ➕ Add Your First Connection
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((profile, idx) => (
                    <ProfileCard
                      key={idx}
                      profile={profile}
                      isSelected={selectedPerson?.id === profile.id}
                      onSelect={() => handleSelectPerson(profile)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Add New Person Button */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Don't see who you're looking for?</p>
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 text-white rounded-xl transition-colors">
                ➕ Add New Person
              </button>
            </div>
            
            {/* Selected Person & Analyze Button */}
            {selectedPerson && (
              <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/20 p-6 animate-slideUp">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{selectedPerson.emoji || '👤'}</div>
                    <div>
                      <div className="text-white font-bold text-lg">{selectedPerson.name}</div>
                      <div className="text-white/60 text-sm">
                        {selectedPerson.season} {selectedPerson.animal}
                        {selectedPerson.mbti && ` • ${selectedPerson.mbti}`}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
                  >
                    🔥 Analyze SoulPrint Compatibility 🔥
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* STAGE 2: REVEAL */}
        {stage === 'reveal' && selectedPerson && (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center space-y-8 animate-pulse">
              <div className="text-8xl animate-spin-slow">🔮</div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">
                  Analyzing Constitutional Compatibility...
                </h2>
                <div className="text-xl text-white/70">
                  Calculating elemental harmony between
                </div>
                <div className="text-2xl text-white font-bold">
                  {currentUser.name} & {selectedPerson.name}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* STAGE 3: ANALYSIS */}
        {stage === 'analysis' && selectedPerson && (
          <div className="space-y-8 animate-fadeIn">
            {/* Back to Selection Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleCompareAnother}
                className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 text-white rounded-xl transition-colors"
              >
                ← Compare with Someone Else
              </button>
              
              <button
                className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-xl transition-colors"
              >
                📤 Share Results
              </button>
            </div>
            
            {/* Compatibility Analysis Panel */}
            <CompatibilityAnalysisPanel
              profileA={currentUser.fourPillars}
              profileB={selectedPerson.fourPillars}
            />
            
            {/* Bottom Actions */}
            <div className="flex justify-center gap-4 pt-8 border-t border-white/10">
              <button
                onClick={handleCompareAnother}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🔄 Compare with Another Person
              </button>
              
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 text-white font-bold rounded-xl transition-colors">
                💾 Save This Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// PROFILE CARD COMPONENT
// ═══════════════════════════════════════════════════════

function ProfileCard({ profile, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative p-6 rounded-xl text-left transition-all transform hover:scale-105
        ${isSelected 
          ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-500 shadow-lg shadow-purple-500/50' 
          : 'bg-slate-800/50 border border-white/10 hover:border-white/30'
        }
      `}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
          ✓
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="text-4xl">{profile.emoji || '👤'}</div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white mb-1">{profile.name}</h4>
          
          <div className="space-y-1 text-sm text-white/70">
            <div>
              {getSeasonEmoji(profile.season)} {profile.season} {profile.animal}
            </div>
            
            {profile.mbti && (
              <div>🧠 {profile.mbti}</div>
            )}
            
            {profile.elements && (
              <div className="flex gap-1 mt-2">
                {Object.entries(profile.elements)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([element, percent]) => (
                    <span
                      key={element}
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: elementColors[element] + '30',
                        color: elementColors[element]
                      }}
                    >
                      {elementEmojis[element]} {Math.round(percent)}%
                    </span>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function getSeasonEmoji(season) {
  if (!season) return '🌟'
  if (season.includes('Spring')) return '🌸'
  if (season.includes('Summer')) return '☀️'
  if (season.includes('Autumn') || season.includes('Fall')) return '🍂'
  if (season.includes('Winter')) return '❄️'
  if (season.includes('Earth')) return '🏔️'
  return '🌟'
}

const elementEmojis = {
  Wood: '🌳',
  Fire: '🔥',
  Earth: '🏔️',
  Metal: '⚙️',
  Water: '💧'
}

const elementColors = {
  Wood: '#10b981',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#94a3b8',
  Water: '#3b82f6'
}

// ═══════════════════════════════════════════════════════
// CSS ANIMATIONS (Add to your global CSS or Tailwind config)
// ═══════════════════════════════════════════════════════

const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
`
