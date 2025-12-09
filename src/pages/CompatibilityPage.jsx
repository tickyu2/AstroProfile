// ═══════════════════════════════════════════════════════
// COMPATIBILITY PAGE - IMMERSIVE SOULPARTNER EXPERIENCE
// ═══════════════════════════════════════════════════════
// FINAL VERSION: Correct data mapping from actual profile structure

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../contexts/ProfileContext'
import CompatibilityAnalysisPanel from '../components/CompatibilityAnalysisPanel'
import ArchetypeCompatibilityPanel from '../components/ArchetypeCompatibilityPanel'
import { getChineseZodiac } from '../utils/calculations'
import { calculateFourPillars } from '../utils/fourPillarsCalculator'
import { calculateTenGods } from '../utils/tenGodsCalculations'
import { determineArchetypeFromFourPillars } from '../utils/archetypeMapper'

export default function CompatibilityPage() {
  const { currentUser } = useAuth()
  const { profiles } = useProfiles()
  const savedProfiles = profiles || []
  
  const navigate = useNavigate()
  const [stage, setStage] = useState('selection') // selection, reveal, analysis
  const [selectedPerson1, setSelectedPerson1] = useState(null)
  const [selectedPerson2, setSelectedPerson2] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  const [error, setError] = useState(null)
  
  // 🔍 DEBUG: Log profiles when they load
  useEffect(() => {
    if (savedProfiles.length > 0) {
      console.log('🔍 DEBUG: Loaded', savedProfiles.length, 'profiles')
      savedProfiles.forEach(p => {
        console.log(`Profile: ${p.displayName}`)
        console.log('  - Has calculations?', !!p.calculations)
        console.log('  - Has fourPillars?', !!p.calculations?.fourPillars)
        console.log('  - BirthTime:', p.birthTime)
        if (!p.calculations?.fourPillars) {
          console.warn(`  ⚠️ ${p.displayName} is MISSING fourPillars!`)
        }
      })
    }
  }, [savedProfiles])
  
  // Helper to extract display data from profile
  const getProfileData = (profile) => {
    if (!profile) return null

    const calculations = profile.calculations || {}

    // 🔧 FIX: Recalculate Chinese zodiac if bornBeforeLiChun is missing (for old profiles)
    // This ensures we use Professional BaZi system (Li Chun Feb 4 boundary)
    let chineseData = profile.chineseZodiac || calculations.chinese || {}

    if (profile.birthDate && chineseData.bornBeforeLiChun === undefined) {
      console.log('🔧 [CompatibilityPage] bornBeforeLiChun missing for', profile.displayName, '- recalculating...');
      chineseData = getChineseZodiac(profile.birthDate);
      console.log('🔧 [CompatibilityPage] Recalculated chinese for', profile.displayName, ':', chineseData);
    }

    // 🔧 FIX: Calculate fourPillars if missing (required for compatibility analysis)
    let fourPillars = calculations.fourPillars || null;
    if (!fourPillars && profile.birthDate && profile.birthTime) {
      console.log('🔧 [CompatibilityPage] fourPillars missing for', profile.displayName, '- calculating...');
      try {
        const birthDateObj = new Date(profile.birthDate);
        fourPillars = calculateFourPillars(
          birthDateObj,
          profile.birthTime,
          profile.locationData || profile.location
        );
        console.log('🔧 [CompatibilityPage] Calculated fourPillars for', profile.displayName);
      } catch (error) {
        console.error('Error calculating fourPillars for', profile.displayName, ':', error);
      }
    }

    return {
      id: profile.id,
      name: profile.displayName || 'Unknown',
      emoji: profile.emoji || getRelationshipEmoji(profile.relationship),

      // Western zodiac
      westernSign: calculations.western?.sign || 'Unknown',
      westernElement: calculations.western?.element || '',

      // Chinese zodiac (Professional BaZi System)
      chineseAnimal: chineseData.animal || 'Unknown',
      chineseElement: chineseData.element || '',
      chineseYinYang: chineseData.yinYang || '',
      baziYear: chineseData.year || chineseData.baziYear, // BaZi year (may differ from birth year)
      bornBeforeLiChun: chineseData.bornBeforeLiChun || false, // For educational indicator

      // Combined display
      season: calculations.western?.sign || 'Unknown',
      animal: `${chineseData.element || ''} ${chineseData.animal || ''}`.trim(),

      // Other info
      mbti: profile.mbti,
      relationship: profile.relationship,

      // BaZi data for compatibility - CRITICAL: Calculate if missing!
      fourPillars: fourPillars,

      // 🎭 NEW! Calculate archetype from fourPillars
      archetype: fourPillars ? (() => {
        try {
          const tenGods = calculateTenGods(fourPillars);
          return determineArchetypeFromFourPillars(fourPillars, tenGods);
        } catch (error) {
          console.error('Error calculating archetype for', profile.displayName, ':', error);
          return null;
        }
      })() : null,

      // Elements for display
      elements: calculations.elements
    }
  }
  
  // Filter profiles based on search
  const filteredProfiles = savedProfiles.filter(profile => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const data = getProfileData(profile)
    return (
      data.name?.toLowerCase().includes(query) ||
      data.westernSign?.toLowerCase().includes(query) ||
      data.chineseAnimal?.toLowerCase().includes(query) ||
      data.mbti?.toLowerCase().includes(query) ||
      data.relationship?.toLowerCase().includes(query)
    )
  })
  
  const handleSelectPerson = (profile) => {
    setError(null) // Clear any previous errors
    
    // If person1 is empty, set person1
    if (!selectedPerson1) {
      setSelectedPerson1(profile)
    } 
    // If person1 is set but person2 is empty, set person2
    else if (!selectedPerson2) {
      // Don't allow selecting the same person twice
      if (profile.id === selectedPerson1.id) {
        setError("Please select two different people to compare")
        return
      }
      setSelectedPerson2(profile)
    }
    // If both are set, clicking again deselects
    else {
      if (profile.id === selectedPerson1.id) {
        setSelectedPerson1(null)
      } else if (profile.id === selectedPerson2.id) {
        setSelectedPerson2(null)
      } else {
        // Replace person2 with new selection
        setSelectedPerson2(profile)
      }
    }
  }
  
  const handleAnalyze = () => {
    // Validate we have two people selected
    if (!selectedPerson1 || !selectedPerson2) {
      setError("Please select TWO people to compare")
      return
    }

    // Get processed profile data (with calculated fourPillars if needed)
    const person1Data = getProfileData(selectedPerson1);
    const person2Data = getProfileData(selectedPerson2);

    // Validate both have fourPillars data (now checking processed data)
    if (!person1Data.fourPillars || !person2Data.fourPillars) {
      // Check if missing birth time (which is required for fourPillars)
      if (!selectedPerson1.birthTime || !selectedPerson2.birthTime) {
        setError("Both profiles need a birth time for compatibility analysis. Please add birth times to both profiles.")
      } else {
        setError("Unable to calculate BaZi data. Please check that both profiles have complete birth information.")
      }
      return
    }

    setError(null)
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
    setSelectedPerson1(null)
    setSelectedPerson2(null)
    setSearchQuery('')
    setError(null)
  }
  
  const handleBack = () => {
    if (stage === 'analysis') {
      setStage('selection')
      setSelectedPerson1(null)
      setSelectedPerson2(null)
    } else {
      navigate(-1)
    }
  }
  
  const handleAddNewPerson = () => {
    navigate('/create-profile')
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
                Select TWO people to analyze their elemental compatibility
              </p>
            </div>
            
            {/* Selection Counter */}
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-white/20 rounded-xl">
                <span className="text-white/70">Selected:</span>
                <span className="text-white font-bold">
                  {selectedPerson1 ? 1 : 0}{selectedPerson2 ? ' + 1' : ''} / 2
                </span>
              </div>
              
              {/* 🔍 DEBUG BUTTON */}
              {(selectedPerson1 || selectedPerson2) && (
                <button
                  onClick={() => {
                    console.clear()
                    console.log('🔍 CHECKPOINT: Selected Profiles')
                    if (selectedPerson1) {
                      console.log('Person 1:', selectedPerson1.displayName)
                      console.log('  fourPillars?', !!selectedPerson1.calculations?.fourPillars)
                      console.log('  Full data:', selectedPerson1)
                    }
                    if (selectedPerson2) {
                      console.log('Person 2:', selectedPerson2.displayName)
                      console.log('  fourPillars?', !!selectedPerson2.calculations?.fourPillars)
                      console.log('  Full data:', selectedPerson2)
                    }
                  }}
                  className="ml-4 px-4 py-2 bg-blue-600/50 hover:bg-blue-600/70 text-white text-sm rounded-lg"
                >
                  🔍 Debug
                </button>
              )}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-6 py-4 text-center">
                  <div className="text-red-300 font-medium">{error}</div>
                </div>
              </div>
            )}
            
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
                    <button 
                      onClick={handleAddNewPerson}
                      className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                    >
                      ➕ Add Your First Connection
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((profile) => {
                    const profileData = getProfileData(profile)
                    return (
                      <ProfileCard
                        key={profile.id}
                        profile={profileData}
                        isSelected={
                          selectedPerson1?.id === profile.id || 
                          selectedPerson2?.id === profile.id
                        }
                        selectionNumber={
                          selectedPerson1?.id === profile.id ? 1 :
                          selectedPerson2?.id === profile.id ? 2 : null
                        }
                        onSelect={() => handleSelectPerson(profile)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Add New Person Button */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Don't see who you're looking for?</p>
              <button 
                onClick={handleAddNewPerson}
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 text-white rounded-xl transition-colors"
              >
                ➕ Add New Person
              </button>
            </div>
            
            {/* Selected People & Analyze Button */}
            {(selectedPerson1 || selectedPerson2) && (
              <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/20 p-6 animate-slideUp">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Person 1 */}
                    {selectedPerson1 && (() => {
                      const data = getProfileData(selectedPerson1)
                      return (
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{data.emoji}</div>
                          <div>
                            <div className="text-white font-bold">{data.name}</div>
                            <div className="text-white/60 text-sm">
                              {data.westernSign} • {data.animal}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                    
                    {/* VS */}
                    {selectedPerson1 && selectedPerson2 && (
                      <div className="text-2xl text-purple-400 font-bold">VS</div>
                    )}
                    
                    {/* Person 2 */}
                    {selectedPerson2 && (() => {
                      const data = getProfileData(selectedPerson2)
                      return (
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{data.emoji}</div>
                          <div>
                            <div className="text-white font-bold">{data.name}</div>
                            <div className="text-white/60 text-sm">
                              {data.westernSign} • {data.animal}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Clear Selection */}
                    <button
                      onClick={() => {
                        setSelectedPerson1(null)
                        setSelectedPerson2(null)
                        setError(null)
                      }}
                      className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-colors"
                    >
                      Clear
                    </button>
                    
                    {/* Analyze Button */}
                    <button
                      onClick={handleAnalyze}
                      disabled={!selectedPerson1 || !selectedPerson2}
                      className={`
                        px-8 py-4 text-lg font-bold rounded-xl transition-all transform shadow-lg
                        ${selectedPerson1 && selectedPerson2
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 shadow-purple-500/50'
                          : 'bg-slate-700/50 text-white/50 cursor-not-allowed'
                        }
                      `}
                    >
                      🔥 Analyze Compatibility 🔥
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* STAGE 2: REVEAL */}
        {stage === 'reveal' && selectedPerson1 && selectedPerson2 && (() => {
          const data1 = getProfileData(selectedPerson1)
          const data2 = getProfileData(selectedPerson2)
          return (
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
                    {data1.name} & {data2.name}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )
        })()}
        
        {/* STAGE 3: ANALYSIS */}
        {stage === 'analysis' && selectedPerson1 && selectedPerson2 && (() => {
          const data1 = getProfileData(selectedPerson1)
          const data2 = getProfileData(selectedPerson2)
          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Back to Selection Button */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleCompareAnother}
                  className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 text-white rounded-xl transition-colors"
                >
                  ← Compare Different People
                </button>
                
                <button
                  className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-xl transition-colors"
                >
                  📤 Share Results
                </button>
              </div>
              
              {/* Names Header */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {data1.name} & {data2.name}
                </div>
                <div className="text-white/60 mt-2">Constitutional Compatibility Analysis</div>
              </div>

              {/* Educational Banner - Professional BaZi System */}
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg p-4 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div className="flex-1">
                    <div className="text-sm text-amber-200 leading-relaxed">
                      <strong className="text-amber-300">GENESIS uses the Professional BaZi System</strong> (Li Chun boundary ~Feb 4) for maximum astronomical accuracy.
                      {(data1.bornBeforeLiChun || data2.bornBeforeLiChun) && (
                        <>
                          {' '}This analysis uses the <strong>BaZi year</strong> for{' '}
                          {data1.bornBeforeLiChun && data2.bornBeforeLiChun
                            ? 'both profiles'
                            : data1.bornBeforeLiChun
                              ? data1.name
                              : data2.name
                          } (born before Li Chun), ensuring constitutional precision.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility Analysis Panel */}
              <CompatibilityAnalysisPanel
                profileA={data1.fourPillars}
                profileB={data2.fourPillars}
              />

              {/* 🎭 NEW! Archetype Compatibility Panel */}
              {data1.archetype && data2.archetype && (
                <div className="mt-6">
                  <ArchetypeCompatibilityPanel
                    archetype1={data1.archetype}
                    archetype2={data2.archetype}
                  />
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex justify-center gap-4 pt-8 border-t border-white/10">
                <button
                  onClick={handleCompareAnother}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                >
                  🔄 Compare Different People
                </button>
                
                <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-white/20 text-white font-bold rounded-xl transition-colors">
                  💾 Save This Analysis
                </button>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// PROFILE CARD COMPONENT
// ═══════════════════════════════════════════════════════

function ProfileCard({ profile, isSelected, selectionNumber, onSelect }) {
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
      {isSelected && selectionNumber && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
          {selectionNumber}
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="text-4xl">{profile.emoji}</div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white mb-1">{profile.name}</h4>
          
          <div className="space-y-1 text-sm text-white/70">
            <div>
              {getSeasonEmoji(profile.westernSign)} {profile.westernSign} • {profile.animal}
            </div>

            {/* BaZi Year Indicator for Early-Year Births */}
            {profile.bornBeforeLiChun && profile.baziYear && (
              <div className="text-xs text-amber-400 flex items-center gap-1">
                <span>📅</span>
                <span>BaZi Year: {profile.baziYear}</span>
              </div>
            )}

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

function getSeasonEmoji(sign) {
  if (!sign) return '🌟'
  // Spring signs
  if (['Aries', 'Taurus', 'Gemini'].includes(sign)) return '🌸'
  // Summer signs
  if (['Cancer', 'Leo', 'Virgo'].includes(sign)) return '☀️'
  // Fall signs
  if (['Libra', 'Scorpio', 'Sagittarius'].includes(sign)) return '🍂'
  // Winter signs
  if (['Capricorn', 'Aquarius', 'Pisces'].includes(sign)) return '❄️'
  return '🌟'
}

function getRelationshipEmoji(relationship) {
  const emojiMap = {
    'self': '💜',
    'partner': '💕',
    'spouse': '💍',
    'child': '👶',
    'parent': '👪',
    'sibling': '🤝',
    'friend': '🤗',
    'colleague': '💼',
    'mentor': '🎓',
    'student': '📚',
    'family': '👨‍👩‍👧‍👦',
    'other': '👤'
  }
  return emojiMap[relationship?.toLowerCase()] || '👤'
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
