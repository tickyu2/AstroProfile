import React, { useState } from 'react'
import { 
  getSeasonFromMonth, 
  calculateSeasonalStrength,
  getGuidanceForElement
} from '../../utils/seasonalCalculations' // ✅ SINGLE SOURCE OF TRUTH!

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SEASONAL STRENGTH PANEL - THE COMPLETE SOLUTION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Combines ALL four AI SoulPrint perspectives:
 * 🏮 Claude: UX, emotional resonance, "aha moments"
 * 🧠 Gemini: Technical accuracy, algorithms, data
 * 🎨 Nano: Beautiful breathing orbs, visual poetry
 * ⚡ Grok: Actionable intelligence - "What do I DO?"
 * 
 * Created: December 3, 2025 - Claude's 125th Birthday
 * Method: The Pure Gold Method - Vision → Reality
 * 
 * v2 Update: Compact layout + Birth year date ranges
 * Four Bazi Pillars simplified through visualization
 */

// Solar term dates (approximate) - these vary slightly by year
// For birth year calculation
const getSolarTermDates = (year) => {
  return {
    'Spring Start': `Feb 4, ${year}`,
    'Dragon Start': `Apr 17, ${year}`,
    'Summer Start': `May 5, ${year}`,
    'Goat Start': `Jul 20, ${year}`,
    'Autumn Start': `Aug 7, ${year}`,
    'Dog Start': `Oct 20, ${year}`,
    'Winter Start': `Nov 7, ${year}`,
    'Ox Start': `Jan 17, ${year}`
  }
}

export default function SeasonalStrengthPanel({ fourPillars, profile }) {
  const [expandedElement, setExpandedElement] = useState(null)
  const [showActionable, setShowActionable] = useState(false)

  // 🐦 Debug: Log the actual structure we're receiving
  console.log('🔍 SeasonalStrengthPanel received fourPillars:', JSON.stringify(fourPillars, null, 2))

  if (!fourPillars) return null

  // Get birth month and season - parse from the actual structure
  let monthBranch = null
  
  // Method 1: branch.english (most direct)
  if (fourPillars.month?.branch?.english) {
    monthBranch = fourPillars.month.branch.english
    console.log('✅ Got month via branch.english:', monthBranch)
  }
  // Method 2: branch.name
  else if (fourPillars.month?.branch?.name) {
    monthBranch = fourPillars.month.branch.name
    console.log('✅ Got month via branch.name:', monthBranch)
  }
  // Method 3: Parse from englishName (e.g., "Yin Earth Ox" → "Ox")
  else if (fourPillars.month?.englishName) {
    const englishName = fourPillars.month.englishName
    // Extract the animal name (last word after space)
    const parts = englishName.split(' ')
    monthBranch = parts[parts.length - 1] // Gets "Ox" from "Yin Earth Ox"
    console.log('✅ Got month via parsing englishName:', englishName, '→', monthBranch)
  }
  
  if (!monthBranch) {
    console.error('❌ Cannot determine month branch. Month object:', fourPillars.month)
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
        <p className="text-red-300">Unable to calculate seasonal strength - missing month data</p>
        <p className="text-xs text-red-400 mt-2">Debug: Check console for details</p>
      </div>
    )
  }
  
  const birthSeason = getSeasonFromMonth(monthBranch)
  
  // OVERRIDE: Use actual birth date to determine TRUE birth season (not month branch)
  let trueBirthSeason = birthSeason // Default fallback
  
  if (profile?.birthDate) {
    const birthDate = new Date(profile.birthDate)
    const birthMonth = birthDate.getMonth() + 1
    const birthDay = birthDate.getDate()
    
    // Determine actual season based on date ranges
    if ((birthMonth === 2 && birthDay >= 4) || (birthMonth === 3) || (birthMonth === 4 && birthDay <= 16)) {
      trueBirthSeason = { 
        name: 'Spring', 
        icon: '🌸',
        multipliers: { Wood: 1.5, Fire: 1.2, Water: 0.8, Earth: 0.5, Metal: 0.2 }
      }
    } else if ((birthMonth === 4 && birthDay >= 17) || (birthMonth === 5 && birthDay <= 5)) {
      trueBirthSeason = { 
        name: 'Dragon (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      }
    } else if ((birthMonth === 5 && birthDay >= 6) || (birthMonth === 6) || (birthMonth === 7 && birthDay <= 19)) {
      trueBirthSeason = { 
        name: 'Summer', 
        icon: '☀️',
        multipliers: { Fire: 1.5, Earth: 1.2, Wood: 0.8, Metal: 0.5, Water: 0.2 }
      }
    } else if ((birthMonth === 7 && birthDay >= 20) || (birthMonth === 8 && birthDay <= 7)) {
      trueBirthSeason = { 
        name: 'Goat (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      }
    } else if ((birthMonth === 8 && birthDay >= 8) || (birthMonth === 9) || (birthMonth === 10 && birthDay <= 19)) {
      trueBirthSeason = { 
        name: 'Autumn', 
        icon: '🍂',
        multipliers: { Metal: 1.5, Water: 1.2, Earth: 0.8, Wood: 0.2, Fire: 0.5 }
      }
    } else if ((birthMonth === 10 && birthDay >= 20) || (birthMonth === 11 && birthDay <= 7)) {
      trueBirthSeason = { 
        name: 'Dog (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      }
    } else if ((birthMonth === 11 && birthDay >= 8) || (birthMonth === 12) || (birthMonth === 1 && birthDay <= 16)) {
      trueBirthSeason = { 
        name: 'Winter', 
        icon: '❄️',
        multipliers: { Water: 1.5, Wood: 1.2, Metal: 0.8, Fire: 0.2, Earth: 0.5 }
      }
    } else if ((birthMonth === 1 && birthDay >= 17) || (birthMonth === 2 && birthDay <= 3)) {
      trueBirthSeason = { 
        name: 'Ox (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      }
    }
  }
  
  // Calculate seasonal strength using TRUE birth season
  const seasonalData = calculateSeasonalStrength(fourPillars, trueBirthSeason)
  
  // Get the dominant and weakest elements
  const sortedElements = Object.entries(seasonalData.adjusted)
    .sort((a, b) => b[1] - a[1])
  const strongestElement = sortedElements[0][0]
  const weakestElement = sortedElements[sortedElements.length - 1][0]

  // Get actionable guidance
  const strongestGuidance = getGuidanceForElement(strongestElement, birthSeason)
  const weakestGuidance = getGuidanceForElement(weakestElement, birthSeason)

  // Element colors and emojis
  const elementVisuals = {
    Wood: { color: '#10b981', emoji: '🌳', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500' },
    Fire: { color: '#ef4444', emoji: '🔥', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' },
    Earth: { color: '#f59e0b', emoji: '🏔️', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500' },
    Metal: { color: '#94a3b8', emoji: '⚙️', bgColor: 'bg-slate-400/20', borderColor: 'border-slate-400' },
    Water: { color: '#3b82f6', emoji: '💧', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500' }
  }

  // Qi state colors
  const qiStateColors = {
    '王 Prosperous': '#10b981',
    '相 Strengthening': '#3b82f6',
    '休 Resting': '#f59e0b',
    '囚 Trapped': '#f97316',
    '死 Dead': '#ef4444'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🌟</span>
            Your Constitutional Weather Report
          </h2>
          <p className="text-sm text-purple-300 mt-1">
            Four Bazi Pillars simplified through visualization
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">Birth Season</div>
          <div className="text-lg font-bold text-amber-300">
            {trueBirthSeason.icon} {trueBirthSeason.name}
          </div>
          <div className="text-xs text-white/50">({monthBranch})</div>
        </div>
      </div>

      {/* The "Aha Moment" Message */}
      <div className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
        <p className="text-white text-sm leading-relaxed">
          <span className="font-bold text-purple-300">💡 The Truth: </span>
          Your strongest element is <span className="font-bold text-emerald-300">{strongestElement}</span> ({Math.round(seasonalData.percentages[strongestElement])}%)
          and your weakest is <span className="font-bold text-red-300">{weakestElement}</span> ({Math.round(seasonalData.percentages[weakestElement])}%).
          <span className="block mt-2 text-purple-200">
            This isn't weakness - this is your <span className="font-bold">authentic rhythm</span>. 
            Understanding it lets you work WITH your nature, not against it.
          </span>
        </p>
      </div>

      {/* Breathing Orbs Visualization - Keep original size & horizontal spacing */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-3">🫧 Your Elemental Energy</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(elementVisuals).map(([element, visual]) => {
            const rawPct = seasonalData.raw[element] || 0
            const adjustedPct = seasonalData.percentages[element] || 0
            const multiplier = seasonalData.multipliers[element] || 1
            const qiState = seasonalData.qiStates[element] || ''
            
            // Keep original orb size (20-100px) - EYE CATCHING!
            const orbSize = 30 + (adjustedPct * 0.7)
            const opacity = 0.3 + (adjustedPct / 100 * 0.7)
            
            return (
              <div key={element} className="flex flex-col items-center gap-1">
                {/* Breathing Orb - SAME SIZE */}
                <div 
                  className="relative flex items-center justify-center transition-all duration-500"
                  style={{
                    width: `${orbSize}px`,
                    height: `${orbSize}px`,
                  }}
                >
                  {/* Outer glow */}
                  <div 
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      backgroundColor: visual.color,
                      opacity: opacity * 0.3,
                      filter: 'blur(10px)',
                      animation: `pulse ${2 + (1 - adjustedPct/100)}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                    }}
                  />
                  
                  {/* Main orb */}
                  <div 
                    className="relative z-10 rounded-full flex items-center justify-center"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: visual.color,
                      opacity: opacity,
                      boxShadow: `0 0 20px ${visual.color}`
                    }}
                  >
                    <span className="text-2xl filter drop-shadow-lg">{visual.emoji}</span>
                  </div>
                  
                  {/* Particle effects for strong elements */}
                  {adjustedPct > 40 && (
                    <div className="absolute inset-0">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 rounded-full animate-ping"
                          style={{
                            backgroundColor: visual.color,
                            top: `${20 + i * 20}%`,
                            left: `${20 + i * 20}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Legend to right - REDUCED vertical spacing */}
                <div className="text-center">
                  <div className="text-xs font-bold text-white leading-tight">{element}</div>
                  <div className="text-xs text-white/60 leading-tight">({multiplier}x)</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Personal Weather Map - Complete Annual Cycle - REDUCED VERTICAL SPACING */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">📅 Your Year-Round Energy Cycles</h3>
        <p className="text-xs text-white/60 mb-3">
          The complete annual cycle showing 4 main seasons and 4 Earth Transitions
        </p>
        
        <div className="bg-slate-900/50 rounded-xl p-3 space-y-1.5">
          {/* Get birth year from profile */}
          {(() => {
            const birthYear = profile?.birthDate ? new Date(profile.birthDate).getFullYear() : 
                             profile?.birthYear || new Date().getFullYear()
            
            // Define all 8 phases with date ranges - NO OVERLAPS!
            const phases = [
              { 
                type: 'season', 
                name: 'Spring', 
                emoji: '🌸', 
                dateRange: `Feb 4 - Apr 16, ${birthYear}`,
                months: ['Tiger', 'Rabbit'], 
                multipliers: { Wood: 1.5, Fire: 1.2, Water: 0.8, Earth: 0.5, Metal: 0.2 } 
              },
              { 
                type: 'transition', 
                name: 'Dragon', 
                emoji: '🏔️', 
                label: 'Earth Transition',
                dateRange: `Apr 17 - May 5, ${birthYear}`,
                between: 'Between Spring → Summer',
                multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 } 
              },
              { 
                type: 'season', 
                name: 'Summer', 
                emoji: '☀️', 
                dateRange: `May 6 - Jul 19, ${birthYear}`,
                months: ['Snake', 'Horse'], 
                multipliers: { Fire: 1.5, Earth: 1.2, Wood: 0.8, Metal: 0.5, Water: 0.2 } 
              },
              { 
                type: 'transition', 
                name: 'Goat', 
                emoji: '🏔️', 
                label: 'Earth Transition',
                dateRange: `Jul 20 - Aug 7, ${birthYear}`,
                between: 'Between Summer → Autumn',
                multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 } 
              },
              { 
                type: 'season', 
                name: 'Autumn', 
                emoji: '🍂', 
                dateRange: `Aug 8 - Oct 19, ${birthYear}`,
                months: ['Monkey', 'Rooster'], 
                multipliers: { Metal: 1.5, Water: 1.2, Earth: 0.8, Wood: 0.2, Fire: 0.5 } 
              },
              { 
                type: 'transition', 
                name: 'Dog', 
                emoji: '🏔️', 
                label: 'Earth Transition',
                dateRange: `Oct 20 - Nov 7, ${birthYear}`,
                between: 'Between Autumn → Winter',
                multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 } 
              },
              { 
                type: 'season', 
                name: 'Winter', 
                emoji: '❄️', 
                dateRange: `Nov 8 - Jan 16, ${birthYear + 1}`,
                months: ['Pig', 'Rat'], 
                multipliers: { Water: 1.5, Wood: 1.2, Metal: 0.8, Fire: 0.2, Earth: 0.5 } 
              },
              { 
                type: 'transition', 
                name: 'Ox', 
                emoji: '🏔️', 
                label: 'Earth Transition',
                dateRange: `Jan 17 - Feb 3, ${birthYear + 1}`,
                between: 'Between Winter → Spring',
                multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 } 
              }
            ]
            
            return phases.map((phase, idx) => {
            // Check if this is the user's birth period using ACTUAL DATE COMPARISON
            let isBirthPhase = false
            
            if (profile?.birthDate) {
              const birthDate = new Date(profile.birthDate)
              const birthMonth = birthDate.getMonth() + 1 // 1-12
              const birthDay = birthDate.getDate()
              
              // Define date ranges for each phase (NO OVERLAPS!)
              const phaseRanges = {
                'Spring': { start: [2, 4], end: [4, 16] },
                'Dragon': { start: [4, 17], end: [5, 5] },
                'Summer': { start: [5, 6], end: [7, 19] },
                'Goat': { start: [7, 20], end: [8, 7] },
                'Autumn': { start: [8, 8], end: [10, 19] },
                'Dog': { start: [10, 20], end: [11, 7] },
                'Winter': { start: [11, 8], end: [1, 16] }, // Spans year boundary
                'Ox': { start: [1, 17], end: [2, 3] }
              }
              
              const range = phaseRanges[phase.name]
              if (range) {
                if (phase.name === 'Winter') {
                  // Winter spans Nov 8 - Jan 16 (next year)
                  isBirthPhase = (
                    (birthMonth === 11 && birthDay >= 8) ||  // Nov 8-30
                    (birthMonth === 12) ||                    // All of December
                    (birthMonth === 1 && birthDay <= 16)      // Jan 1-16
                  )
                } else if (phase.name === 'Ox') {
                  // Ox is Jan 17 - Feb 3
                  isBirthPhase = (
                    (birthMonth === 1 && birthDay >= 17) || // Jan 17-31
                    (birthMonth === 2 && birthDay <= 3)     // Feb 1-3
                  )
                } else {
                  // For other phases, simple comparison
                  const [startMonth, startDay] = range.start
                  const [endMonth, endDay] = range.end
                  
                  if (startMonth === endMonth) {
                    // Same month
                    isBirthPhase = birthMonth === startMonth && birthDay >= startDay && birthDay <= endDay
                  } else {
                    // Spans months
                    isBirthPhase = (
                      (birthMonth === startMonth && birthDay >= startDay) ||
                      (birthMonth > startMonth && birthMonth < endMonth) ||
                      (birthMonth === endMonth && birthDay <= endDay)
                    )
                  }
                }
              }
            } else {
              // Fallback to old logic if no birthDate
              isBirthPhase = phase.type === 'season' 
                ? (!birthSeason.name.includes('Earth') && phase.name === birthSeason.name)
                : phase.name === monthBranch
            }
            
            const isTransition = phase.type === 'transition'
            
            return (
              <div key={idx}>
                {/* Phase Box - REDUCED VERTICAL PADDING */}
                <div 
                  className={`rounded-xl px-4 py-2 transition-all ${
                    isBirthPhase 
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500' 
                      : isTransition
                        ? 'bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30'
                        : 'bg-slate-800/50 border border-slate-700/30'
                  }`}
                >
                  {/* Header - REDUCED VERTICAL SPACING */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{phase.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">
                          {isTransition ? `${phase.name} (${phase.label})` : phase.name}
                        </div>
                        <div className="text-xs text-amber-300/80 leading-tight">
                          {phase.dateRange}
                        </div>
                        {isTransition && (
                          <div className="text-xs text-amber-300/60 leading-tight">
                            {phase.between}
                          </div>
                        )}
                      </div>
                    </div>
                    {isBirthPhase && (
                      <div className="text-purple-300 text-xs font-bold">
                        ← You were born here {profile?.birthDate ? (() => {
                          // Fix UTC timezone bug: Use UTC methods to avoid timezone shift
                          const d = new Date(profile.birthDate)
                          const year = d.getUTCFullYear()
                          const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
                          const day = d.getUTCDate()
                          return `${month} ${day}, ${year}`
                        })() : ''}
                      </div>
                    )}
                  </div>

                  {/* Elements with Multipliers - KEEP HORIZONTAL GAP */}
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => {
                      const mult = phase.multipliers[element]
                      const visual = elementVisuals[element]
                      
                      // Color intensity based on multiplier
                      const intensity = mult >= 1.2 ? 'high' : mult >= 0.8 ? 'med' : 'low'
                      const bgColor = intensity === 'high' ? visual.color : 
                                    intensity === 'med' ? '#94a3b8' : 
                                    '#475569'
                      const textColor = intensity === 'high' ? 'text-white' : 
                                       intensity === 'med' ? 'text-white/80' : 
                                       'text-white/50'
                      
                      // Qi State emoji
                      const qiEmoji = mult === 1.5 ? '王' :
                                     mult === 1.2 ? '相' :
                                     mult === 0.8 ? '休' :
                                     mult === 0.5 ? '囚' : '死'
                      
                      return (
                        <div key={element} className="text-center">
                          <div 
                            className="w-7 h-7 rounded-full mx-auto mb-0.5 flex items-center justify-center text-sm"
                            style={{ 
                              backgroundColor: bgColor,
                              opacity: 0.3 + (mult * 0.4)
                            }}
                          >
                            {visual.emoji}
                          </div>
                          <div className={`text-[10px] font-bold leading-tight ${textColor}`}>
                            {element}
                          </div>
                          <div className={`text-[10px] leading-tight ${textColor}`}>
                            ({mult}x)
                          </div>
                          <div className="text-[9px] text-white/50 leading-tight">
                            {qiEmoji}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Arrow connector - REDUCED VERTICAL SPACING */}
                {idx < 7 && (
                  <div className="flex justify-center py-0.5">
                    <div className="text-white/30 text-lg">↓</div>
                  </div>
                )}
              </div>
            )
          })})()}

          {/* Complete cycle indicator */}
          <div className="text-center mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-white/50 italic">
              The cycle continues: Ox → Spring → Dragon → Summer...
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Intelligence Section */}
      <div className="border-t border-purple-500/30 pt-6">
        <button
          onClick={() => setShowActionable(!showActionable)}
          className="w-full flex items-center justify-between text-left mb-4"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>⚡</span>
            What Should I Actually DO With This?
          </h3>
          <span className="text-purple-400 text-xl">
            {showActionable ? '▼' : '▶'}
          </span>
        </button>

        {showActionable && (
          <div className="space-y-4">
            {/* Guidance for strongest element */}
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
              <h4 className="font-bold text-emerald-300 mb-2">
                ✨ Leverage Your Strength: {strongestElement}
              </h4>
              <div className="text-sm text-white/80 space-y-2">
                {strongestGuidance?.strengths?.map((tip, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidance for weakest element */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <h4 className="font-bold text-red-300 mb-2">
                ⚠️ Compensate for Your Vulnerability: {weakestElement}
              </h4>
              <div className="text-sm text-white/80 space-y-2">
                {weakestGuidance?.weaknesses?.map((tip, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-red-400">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationship compatibility insight */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
              <h4 className="font-bold text-purple-300 mb-2">
                💕 Relationship Compatibility Insight
              </h4>
              <div className="text-sm text-white/80">
                <p className="mb-2">
                  You naturally complement partners who are strong in <span className="font-bold text-purple-300">{weakestElement}</span>.
                </p>
                <p>
                  Their {weakestElement} energy (which is strong for them) fills in where your {weakestElement} is weak.
                  This creates <span className="font-bold">natural harmony</span> - not dependency, but completion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer insight */}
      <div className="mt-6 text-center text-xs text-white/50 italic">
        "Know your seasons, work with your rhythms, find your complementary partners"
      </div>
    </div>
  )
}
