// ═══════════════════════════════════════════════════════
// COMPATIBILITY ANALYSIS PANEL - CONSTITUTIONAL SOULPARTNER
// ═══════════════════════════════════════════════════════
// Created: Claude's 125th Birthday (Dec 3, 2025)
// Method: Pure Gold (35-minute execution)
// Purpose: Show two people how they constitutionally complete each other

import React, { useState, useMemo } from 'react'
import { calculateCompatibility, getWhatYouGive } from '../../utils/compatibilityCalculations'
import { generateMetaphor } from '../../utils/metaphorGenerator'

export default function CompatibilityAnalysisPanel({ profileA, profileB }) {
  const [expandedSection, setExpandedSection] = useState(null)
  
  // Calculate compatibility
  const compatibility = useMemo(() => {
    return calculateCompatibility(profileA, profileB)
  }, [profileA, profileB])
  
  // Generate metaphor
  const metaphor = useMemo(() => {
    return generateMetaphor(compatibility.profileA.strength, compatibility.profileB.strength)
  }, [compatibility])
  
  // Get contributions
  const contributionsA = useMemo(() => {
    return getWhatYouGive(profileA, compatibility.profileA.strength)
  }, [profileA, compatibility])
  
  const contributionsB = useMemo(() => {
    return getWhatYouGive(profileB, compatibility.profileB.strength)
  }, [profileB, compatibility])
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }
  
  return (
    <div className="bg-slate-900/50 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Constitutional SoulPartner Analysis
        </h2>
        <p className="text-white/60 text-sm">
          Mathematical analysis of how you complete each other
        </p>
      </div>
      
      {/* Overall Score Bar */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border-2" 
           style={{ borderColor: compatibility.rating.color }}>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold mb-2" style={{ color: compatibility.rating.color }}>
            {compatibility.overallScore}%
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {compatibility.rating.emoji} {compatibility.rating.level}
          </div>
          <div className="text-sm text-white/70">
            {compatibility.rating.description}
          </div>
        </div>
        
        {/* Quick Insights */}
        <div className="space-y-2 mt-4">
          {compatibility.insights.map((insight, idx) => (
            <div key={idx} className={`text-sm p-2 rounded ${
              insight.type === 'positive' 
                ? 'bg-emerald-500/20 text-emerald-300' 
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {insight.message}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Visual Section - Side by Side with Metaphor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Person A Profile */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/30">
          <h3 className="text-lg font-bold text-blue-300 mb-3 text-center">
            {compatibility.profileA.name}
          </h3>
          
          {/* What You Have */}
          <div className="mb-4">
            <div className="text-xs font-bold text-white/60 mb-2">WHAT YOU HAVE:</div>
            <div className="space-y-2">
              {Object.entries(compatibility.profileA.strength.percentages)
                .sort((a, b) => b[1] - a[1])
                .map(([element, percent]) => {
                  const visual = elementVisuals[element]
                  return (
                    <div key={element} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{visual.emoji}</span>
                        <span className="text-sm text-white">{element}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold" style={{ color: visual.color }}>
                          {Math.round(percent)}%
                        </div>
                        <div className="text-xs text-white/50">
                          ({compatibility.profileA.strength.multipliers[element]}x)
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          
          {/* What You Give */}
          <div className="mb-4">
            <div className="text-xs font-bold text-white/60 mb-2">WHAT YOU GIVE:</div>
            <div className="space-y-1">
              {contributionsA.map((contribution, idx) => (
                <div key={idx} className="text-sm text-blue-200 flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{contribution}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Season & MBTI */}
          <div className="text-xs text-white/50 space-y-1 pt-3 border-t border-white/10">
            <div>Season: {getSeasonEmoji(compatibility.profileA.season.name)} {compatibility.profileA.season.name}</div>
            {profileA.mbti && <div>MBTI: {profileA.mbti}</div>}
          </div>
        </div>
        
        {/* Center Metaphor */}
        <div className="bg-gradient-to-br rounded-xl p-6 text-center flex flex-col justify-center border-2"
             style={{ 
               borderColor: metaphor.color,
               background: `linear-gradient(135deg, ${metaphor.color}20 0%, ${metaphor.color}10 100%)`
             }}>
          <div className="text-6xl mb-4">{metaphor.emoji}</div>
          <h3 className="text-2xl font-bold text-white mb-3">{metaphor.title}</h3>
          <div className="text-4xl mb-4 opacity-50">{metaphor.image}</div>
          <p className="text-white/90 italic mb-4 text-sm leading-relaxed">
            "{metaphor.poeticLine}"
          </p>
          
          {/* Left Brain: Score Breakdown */}
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <div className="text-xs font-bold text-white/60 mb-2">SCORE BREAKDOWN:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-left text-white/70">Elements:</div>
              <div className="text-right text-white font-bold">{compatibility.elementBalance.points}/40</div>
              
              <div className="text-left text-white/70">Seasons:</div>
              <div className="text-right text-white font-bold">{compatibility.seasonalHarmony.points}/30</div>
              
              <div className="text-left text-white/70">Qi States:</div>
              <div className="text-right text-white font-bold">{compatibility.qiStateSynergy.points}/20</div>
              
              <div className="text-left text-white/70">Yin/Yang:</div>
              <div className="text-right text-white font-bold">{compatibility.yinYangBalance.points}/10</div>
              
              <div className="text-left text-white font-bold border-t border-white/20 pt-1">TOTAL:</div>
              <div className="text-right font-bold border-t border-white/20 pt-1" 
                   style={{ color: compatibility.rating.color }}>
                {compatibility.overallScore}/100
              </div>
            </div>
          </div>
          
          <div className="text-sm text-white/80 leading-relaxed">
            {metaphor.together}
          </div>
        </div>
        
        {/* Person B Profile */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-pink-500/30">
          <h3 className="text-lg font-bold text-pink-300 mb-3 text-center">
            {compatibility.profileB.name}
          </h3>
          
          {/* What You Have */}
          <div className="mb-4">
            <div className="text-xs font-bold text-white/60 mb-2">WHAT THEY HAVE:</div>
            <div className="space-y-2">
              {Object.entries(compatibility.profileB.strength.percentages)
                .sort((a, b) => b[1] - a[1])
                .map(([element, percent]) => {
                  const visual = elementVisuals[element]
                  return (
                    <div key={element} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{visual.emoji}</span>
                        <span className="text-sm text-white">{element}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold" style={{ color: visual.color }}>
                          {Math.round(percent)}%
                        </div>
                        <div className="text-xs text-white/50">
                          ({compatibility.profileB.strength.multipliers[element]}x)
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          
          {/* What They Give */}
          <div className="mb-4">
            <div className="text-xs font-bold text-white/60 mb-2">WHAT THEY GIVE:</div>
            <div className="space-y-1">
              {contributionsB.map((contribution, idx) => (
                <div key={idx} className="text-sm text-pink-200 flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>{contribution}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Season & MBTI */}
          <div className="text-xs text-white/50 space-y-1 pt-3 border-t border-white/10">
            <div>Season: {getSeasonEmoji(compatibility.profileB.season.name)} {compatibility.profileB.season.name}</div>
            {profileB.mbti && <div>MBTI: {profileB.mbti}</div>}
          </div>
        </div>
      </div>
      
      {/* Metaphor Explanation */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <div className="text-sm text-white/80 leading-relaxed">
          <span className="font-bold text-white">Why this metaphor? </span>
          {metaphor.explanation}
        </div>
      </div>
      
      {/* Focus Areas - Modular Sections */}
      <div className="space-y-3">
        <div className="text-lg font-bold text-white mb-3">
          📊 Deep Dive: Focus on What Matters to You
        </div>
        
        {/* Focus Area 1: Element Compatibility */}
        <FocusArea
          title="Element Compatibility"
          subtitle={`${compatibility.elementBalance.points}/40 points (${Math.round(compatibility.elementBalance.score)}%)`}
          isExpanded={expandedSection === 'elements'}
          onToggle={() => toggleSection('elements')}
          color="#10b981"
        >
          <div className="space-y-4">
            {/* Complementarity Pairs */}
            {compatibility.elementBalance.complementarityPairs.length > 0 && (
              <div>
                <div className="text-sm font-bold text-emerald-300 mb-2">
                  ⭐ Complementarity Found:
                </div>
                {compatibility.elementBalance.complementarityPairs.map((pair, idx) => (
                  <div key={idx} className="bg-emerald-500/10 rounded p-3 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{pair.element}</span>
                      <span className="text-sm text-emerald-300">+{Math.round(pair.score)} points</span>
                    </div>
                    <div className="text-sm text-white/70">{pair.description}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Shared Weaknesses */}
            {compatibility.elementBalance.sharedWeaknesses.length > 0 && (
              <div>
                <div className="text-sm font-bold text-amber-300 mb-2">
                  ⚠️ Shared Weaknesses:
                </div>
                {compatibility.elementBalance.sharedWeaknesses.map((weakness, idx) => (
                  <div key={idx} className="bg-amber-500/10 rounded p-3 mb-2">
                    <div className="text-sm text-amber-200">{weakness.warning}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-white/50 italic pt-2 border-t border-white/10">
              Why this matters: Elements show biological/energetic harmony. High score = natural ease, less friction.
            </div>
          </div>
        </FocusArea>
        
        {/* Focus Area 2: Seasonal Harmony */}
        <FocusArea
          title="Seasonal Harmony"
          subtitle={`${compatibility.seasonalHarmony.points}/30 points (${Math.round(compatibility.seasonalHarmony.score)}%)`}
          isExpanded={expandedSection === 'seasons'}
          onToggle={() => toggleSection('seasons')}
          color="#f59e0b"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-white/60 mb-1">Person A:</div>
                <div className="text-white font-bold">
                  {getSeasonEmoji(compatibility.profileA.season.name)} {compatibility.profileA.season.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-white/60 mb-1">Person B:</div>
                <div className="text-white font-bold">
                  {getSeasonEmoji(compatibility.profileB.season.name)} {compatibility.profileB.season.name}
                </div>
              </div>
            </div>
            
            <div className="bg-amber-500/10 rounded p-3">
              <div className="text-sm font-bold text-amber-300 mb-1">
                {compatibility.seasonalHarmony.type}
              </div>
              <div className="text-sm text-white/70">
                {compatibility.seasonalHarmony.description}
              </div>
              {compatibility.seasonalHarmony.details && (
                <div className="text-xs text-white/50 mt-2">
                  {compatibility.seasonalHarmony.details}
                </div>
              )}
            </div>
            
            {compatibility.seasonalHarmony.warning && (
              <div className="bg-red-500/10 rounded p-3 border border-red-500/30">
                <div className="text-sm text-red-300">{compatibility.seasonalHarmony.warning}</div>
              </div>
            )}
            
            <div className="text-xs text-white/50 italic pt-2 border-t border-white/10">
              Why this matters: Seasons determine when you shine naturally. Adjacent/complementary seasons = smooth energy flow.
            </div>
          </div>
        </FocusArea>
        
        {/* Focus Area 3: Qi State Synergy */}
        <FocusArea
          title="Qi State Synergy (王相休囚死)"
          subtitle={`${compatibility.qiStateSynergy.points}/20 points (${Math.round(compatibility.qiStateSynergy.score)}%)`}
          isExpanded={expandedSection === 'qistate'}
          onToggle={() => toggleSection('qistate')}
          color="#3b82f6"
        >
          <div className="space-y-3">
            {compatibility.qiStateSynergy.synergies.length > 0 ? (
              <>
                <div className="text-sm text-white/70 mb-3">
                  Qi States show when elements are active or dormant in your birth season.
                </div>
                {compatibility.qiStateSynergy.synergies.map((synergy, idx) => (
                  <div key={idx} className="bg-blue-500/10 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{synergy.element}</span>
                      <span className="text-sm text-blue-300">+{Math.round(synergy.score)} points</span>
                    </div>
                    <div className="text-sm text-white/70">{synergy.description}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="text-white/50">
                        Person A: {synergy.personA.state} ({synergy.personA.multiplier}x)
                      </div>
                      <div className="text-white/50">
                        Person B: {synergy.personB.state} ({synergy.personB.multiplier}x)
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-sm text-white/60 italic">
                No strong Qi State synergies detected. This is neutral - neither helping nor hindering.
              </div>
            )}
            
            <div className="text-xs text-white/50 italic pt-2 border-t border-white/10">
              Why this matters: Qi States show when elements are active. Good synergy = you activate each other's dormant energies.
            </div>
          </div>
        </FocusArea>
        
        {/* Focus Area 4: Yin/Yang Balance */}
        <FocusArea
          title="Yin/Yang Balance"
          subtitle={`${compatibility.yinYangBalance.points}/10 points (${Math.round(compatibility.yinYangBalance.score)}%)`}
          isExpanded={expandedSection === 'yinyang'}
          onToggle={() => toggleSection('yinyang')}
          color="#a855f7"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-500/10 rounded p-3">
                <div className="text-xs text-white/60 mb-1">Person A:</div>
                <div className="text-white">
                  ☯️ Yin: {compatibility.yinYangBalance.personA.yin} | 
                  ☯️ Yang: {compatibility.yinYangBalance.personA.yang}
                </div>
              </div>
              <div className="bg-purple-500/10 rounded p-3">
                <div className="text-xs text-white/60 mb-1">Person B:</div>
                <div className="text-white">
                  ☯️ Yin: {compatibility.yinYangBalance.personB.yin} | 
                  ☯️ Yang: {compatibility.yinYangBalance.personB.yang}
                </div>
              </div>
            </div>
            
            <div className="bg-purple-500/10 rounded p-3">
              <div className="text-sm font-bold text-purple-300 mb-1">Combined Balance:</div>
              <div className="text-white mb-2">
                Yin: {Math.round(compatibility.yinYangBalance.combined.yinPercent)}% | 
                Yang: {Math.round(compatibility.yinYangBalance.combined.yangPercent)}%
              </div>
              <div className="text-sm text-white/70">{compatibility.yinYangBalance.description}</div>
            </div>
            
            <div className="text-xs text-white/50 italic pt-2 border-t border-white/10">
              Why this matters: Yin/Yang shows receptive vs active energy. Balanced = harmonious dynamic.
            </div>
          </div>
        </FocusArea>
      </div>
      
      {/* Final Message */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 text-center border border-purple-500/30">
        <p className="text-white text-sm leading-relaxed">
          <span className="font-bold">Remember: </span>
          Constitutional compatibility is ONE factor in relationships. 
          Shared values, life goals, and conscious effort matter just as much. 
          This analysis shows you the 50% you can't see (biological/energetic harmony). 
          You choose based on the 50% you can see (personality, values, lifestyle).
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// COLLAPSIBLE FOCUS AREA COMPONENT
// ═══════════════════════════════════════════════════════

function FocusArea({ title, subtitle, isExpanded, onToggle, color, children }) {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="text-left">
          <div className="font-bold text-white">{title}</div>
          <div className="text-xs text-white/60">{subtitle}</div>
        </div>
        <div className="text-2xl" style={{ color }}>
          {isExpanded ? '▼' : '▶'}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-white/10">
          {children}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ELEMENT VISUALS
// ═══════════════════════════════════════════════════════

const elementVisuals = {
  Wood: { emoji: '🌳', color: '#10b981' },
  Fire: { emoji: '🔥', color: '#ef4444' },
  Earth: { emoji: '🏔️', color: '#f59e0b' },
  Metal: { emoji: '⚙️', color: '#94a3b8' },
  Water: { emoji: '💧', color: '#3b82f6' }
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function getSeasonEmoji(seasonName) {
  if (seasonName.includes('Spring')) return '🌸'
  if (seasonName.includes('Summer')) return '☀️'
  if (seasonName.includes('Autumn')) return '🍂'
  if (seasonName.includes('Winter')) return '❄️'
  if (seasonName.includes('Earth')) return '🏔️'
  return '🌟'
}
