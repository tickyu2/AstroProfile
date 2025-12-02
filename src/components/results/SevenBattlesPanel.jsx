import React, { useState } from 'react'
import { yinYangTheory } from '../../data/yinYangTheory'

export default function SevenBattlesPanel({ profile, yinYang }) {
    // Theory expansion state (tracks which factor's theory is currently expanded)
    const [expandedFactorTheory, setExpandedFactorTheory] = useState(null)
    const [showYinYangBreakdown, setShowYinYangBreakdown] = useState(false)
    
    // Toggle theory expansion for a specific factor
    const toggleFactorTheory = (factorIndex) => {
        setExpandedFactorTheory(expandedFactorTheory === factorIndex ? null : factorIndex)
    }
    
    // Helper function to get theory content for a specific factor
    const getFactorTheory = (factor, profileData) => {
        if (!factor || !factor.name) return null
        
        const factorName = factor.name
        
        // Map factor names to theory categories and keys
        if (factorName.includes('Chinese Animal')) {
            const animal = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.chineseAnimals[animal]
        }
        
        if (factorName.includes('Chinese Element')) {
            const element = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.chineseElements[element]
        }
        
        if (factorName.includes('Western Sign')) {
            const sign = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.westernSigns[sign]
        }
        
        if (factorName.includes('Western Element')) {
            const element = factorName.match(/\((.*?)\)/)?.[1]
            return yinYangTheory.westernElements[element]
        }
        
        if (factorName.includes('Birth Day')) {
            // Extract day and planet from patterns like:
            // "Birth Day (Tuesday - Mars)" or "Birth Day (undefined - Mercury)"
            const match = factorName.match(/\((.*?)\s*-\s*(.*?)\)/)
            
            if (match) {
                const dayName = match[1]?.trim()
                const planetName = match[2]?.trim()
                
                // If day name is "undefined" or missing, map by planet name
                if (!dayName || dayName === 'undefined') {
                    const planetToDayMap = {
                        'Sun': 'Sunday',
                        'Moon': 'Monday',
                        'Mars': 'Tuesday',
                        'Mercury': 'Wednesday',
                        'Jupiter': 'Thursday',
                        'Venus': 'Friday',
                        'Saturn': 'Saturday'
                    }
                    const mappedDay = planetToDayMap[planetName]
                    if (mappedDay && yinYangTheory.planetaryDays[mappedDay]) {
                        return yinYangTheory.planetaryDays[mappedDay]
                    }
                } else if (yinYangTheory.planetaryDays[dayName]) {
                    // Use day name directly if it's valid
                    return yinYangTheory.planetaryDays[dayName]
                }
            }
        }
        
        if (factorName.includes('Gender')) {
            const gender = factorName.match(/\((.*?)\)/)?.[1]
            if (gender) {
                // Capitalize first letter to match theory keys (Male, Female)
                const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
                return yinYangTheory.gender[capitalizedGender]
            }
        }
        
        if (factorName.includes('Birth Time')) {
            const timeType = factorName.match(/\((.*?)\s*-/)?.[1]
            if (timeType?.toLowerCase().includes('day')) return yinYangTheory.birthTime.Day
            if (timeType?.toLowerCase().includes('night')) return yinYangTheory.birthTime.Night
            return yinYangTheory.birthTime.Transition
        }
        
        return null
    }

    if (!yinYang || !yinYang.factors) {
        return null
    }

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">⚔️</span>
                <h2 className="text-sm font-bold text-amber-400">THE 7 CONSTITUTIONAL BATTLES</h2>
            </div>
            
            {/* Points Display (above pill box) */}
            <div className="text-center mb-2">
                <div className="text-[11px] text-white/70 font-medium">
                    <span className="text-blue-400 font-bold">{yinYang.yinPoints || Math.round(yinYang.yinPercentage)} pts Yin</span>
                    {yinYang.balancedPoints > 0 && (
                        <>
                            <span className="text-white/40 mx-1">•</span>
                            <span className="text-green-400 font-bold">{yinYang.balancedPoints || Math.round(yinYang.balancedPercentage || 0)} pts Balanced</span>
                        </>
                    )}
                    <span className="text-white/40 mx-1">•</span>
                    <span className="text-amber-400 font-bold">{yinYang.yangPoints || Math.round(yinYang.yangPercentage)} pts Yang</span>
                    <span className="text-white/40 ml-1.5">= {yinYang.totalPoints || 100} Total</span>
                </div>
            </div>
            
            {/* 3-Section Balance Bar */}
            <div className="mb-3">
                <div className="flex w-full h-9 rounded-full overflow-hidden shadow-inner bg-slate-800/60">
                    {/* Yin Section */}
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-700 hover:brightness-110"
                        style={{width: `${yinYang.yinPercentage || 50}%`}}
                    >
                        {yinYang.yinPercentage || 50}%
                    </div>
                    {/* Balanced Section (only if exists) */}
                    {(yinYang.balancedPercentage || 0) > 0 && (
                        <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-700 hover:brightness-110"
                            style={{width: `${yinYang.balancedPercentage || 0}%`}}
                        >
                            {yinYang.balancedPercentage > 3 ? `${yinYang.balancedPercentage}%` : ''}
                        </div>
                    )}
                    {/* Yang Section */}
                    <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-[10px] text-slate-900 font-bold transition-all duration-700 hover:brightness-110"
                        style={{width: `${yinYang.yangPercentage || 50}%`}}
                    >
                        {yinYang.yangPercentage > 5 ? `${yinYang.yangPercentage}%` : ''}
                    </div>
                </div>
            </div>

            {/* Balance Label (only if a classification exists) */}
            {(yinYang.balancedPercentage || 0) > 0 && (
                <div className="text-center text-[10px] text-white/50 mb-3">
                    Yin • Balanced • Yang
                </div>
            )}

            {yinYang.balance && (
                <div className={`text-center text-[11px] font-bold mb-3 px-3 py-1.5 rounded-full inline-flex items-center justify-center mx-auto w-full ${
                    yinYang.balance.includes('Balanced') ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                    yinYang.balance.includes('Yin') ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' :
                    'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                }`}>
                    {yinYang.balance}
                </div>
            )}

            {/* See Battle Results Button */}
            <button
                onClick={() => setShowYinYangBreakdown(!showYinYangBreakdown)}
                className="w-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 text-white py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs font-semibold border border-purple-500/30 hover:border-purple-400/60"
            >
                <span className="text-sm">⚔️</span>
                <span>{showYinYangBreakdown ? 'Hide Battle Results' : 'See Your Battle Results'}</span>
                <span className={`transition-transform ${showYinYangBreakdown ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Expandable Calculation Breakdown */}
            {showYinYangBreakdown && (
                <div className="mt-3 animate-fadeIn">
                    {/* Individual Factors */}
                    <div className="space-y-1.5 mb-3">
                        {yinYang.factors && yinYang.factors.map((factor, idx) => {
                            // Get the theory for this specific factor
                            const theory = getFactorTheory(factor, profile)
                            const isExpanded = expandedFactorTheory === idx
                            
                            // Extract meaningful detail if present
                            // Example: "Birth Day (Tuesday - Mars)" → extract "Tuesday - Mars"
                            const detailMatch = factor.name.match(/\((.*?)\)/)
                            const detail = detailMatch ? detailMatch[1] : null
                            
                            return (
                                <div 
                                    key={idx}
                                    className={`rounded-lg transition-all ${
                                        isExpanded 
                                            ? 'bg-slate-800/60' 
                                            : 'bg-slate-800/30 hover:bg-slate-800/50'
                                    }`}
                                >
                                    {/* Battle Summary - 2 Row Layout */}
                                    <div className={`p-2.5 text-xs ${
                                        factor.energy === 'Yin' ? 'bg-blue-500/20 border border-blue-500/30' :
                                        factor.energy === 'Yang' ? 'bg-amber-500/20 border border-amber-500/30' :
                                        'bg-green-500/20 border border-green-500/30'
                                    }`}>
                                        {/* Row 1: Main Info */}
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span>⚔️</span>
                                                <span className="text-white/90 font-medium">{factor.name.split('(')[0].trim()}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Energy Icon + Text */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-base leading-none">
                                                        {factor.energy === 'Yin' ? '🌙' : factor.energy === 'Yang' ? '☀️' : '⚖️'}
                                                    </span>
                                                    <div className="flex flex-col items-start leading-none">
                                                        <span className={`font-bold text-xs ${
                                                            factor.energy === 'Yin' ? 'text-blue-300' :
                                                            factor.energy === 'Yang' ? 'text-amber-300' :
                                                            'text-green-300'
                                                        }`}>
                                                            {factor.energy}
                                                        </span>
                                                        <span className={`text-[10px] ${
                                                            factor.energy === 'Yin' ? 'text-blue-400/80' :
                                                            factor.energy === 'Yang' ? 'text-amber-400/80' :
                                                            'text-green-400/80'
                                                        }`}>
                                                            wins
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Points */}
                                                <span className="text-white/60 font-medium">+{factor.weight} pts</span>
                                                
                                                {/* Learn Why Button - Only show if theory exists */}
                                                {theory && (
                                                    <button
                                                        onClick={() => toggleFactorTheory(idx)}
                                                        className={`px-2 py-1 text-[10px] rounded transition-all ${
                                                            isExpanded 
                                                                ? 'bg-purple-500 text-white' 
                                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                        }`}
                                                    >
                                                        {isExpanded ? '▲ Hide' : '🔬 Learn Why'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Row 2: Detail */}
                                        {detail && (
                                            <div className="text-white/60 text-[11px]">
                                                ({detail})
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Expandable Theory Content (Course 3 - SALAD) */}
                                    {theory && isExpanded && (
                                    <div className={`p-4 text-xs animate-fadeIn ${
                                        factor.energy === 'Yin' ? 'bg-blue-500/10 border-l-4 border-blue-500/50' :
                                        factor.energy === 'Yang' ? 'bg-amber-500/10 border-l-4 border-amber-500/50' :
                                        'bg-green-500/10 border-l-4 border-green-500/50'
                                    }`}>
                                        {/* Theory Header */}
                                        <div className="mb-3 pb-2 border-b border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-2xl">{theory.icon}</span>
                                                <h4 className="text-sm font-bold text-white">{theory.tagline}</h4>
                                            </div>
                                            <p className="text-white/70 italic">{theory.summary}</p>
                                        </div>
                                        
                                        {/* Historical Origin */}
                                        {theory.origin && (
                                            <div className="mb-3">
                                                <h5 className="text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                                                    <span>🏛️</span> HISTORICAL ORIGIN
                                                </h5>
                                                <p className="text-white/70 leading-relaxed whitespace-pre-line">
                                                    {theory.origin}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Why Yin/Yang */}
                                        {theory.whyYinYang && (
                                            <div className="mb-3 bg-slate-900/40 rounded-lg p-3">
                                                <h5 className="text-[11px] font-bold text-purple-400 mb-1 flex items-center gap-1">
                                                    <span>⚖️</span> WHY {factor.energy.toUpperCase()}?
                                                </h5>
                                                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                                                    {theory.whyYinYang}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Cross-Cultural Verification */}
                                        {theory.crossCultural && (
                                            <div className="mb-3">
                                                <h5 className="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1">
                                                    <span>🌏</span> CROSS-CULTURAL VERIFICATION
                                                </h5>
                                                <p className="text-white/70 leading-relaxed whitespace-pre-line">
                                                    {theory.crossCultural}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* In Your Profile */}
                                        {theory.inYourProfile && (
                                            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg p-3 border border-purple-500/30">
                                                <h5 className="text-[11px] font-bold text-purple-300 mb-1 flex items-center gap-1">
                                                    <span>🎯</span> IN YOUR PROFILE
                                                </h5>
                                                <p className="text-white/90 leading-relaxed">
                                                    {typeof theory.inYourProfile === 'function'
                                                        ? theory.inYourProfile(profile?.name || 'You', factor.weight, profile?.birthTime)
                                                        : theory.inYourProfile
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Collapse Button */}
                                        <button
                                            onClick={() => toggleFactorTheory(idx)}
                                            className="w-full mt-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 text-[10px] rounded transition-all flex items-center justify-center gap-1"
                                        >
                                            <span>▲</span> Collapse Theory
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    </div>

                    {/* Points Summary - 3 Sections */}
                    <div className={`grid ${(yinYang.balancedPoints || 0) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-3`}>
                        <div className="bg-blue-500/20 rounded-lg p-2 text-center border border-blue-500/30">
                            <div className="text-lg font-bold text-blue-300">{yinYang.yinPoints || Math.round(yinYang.yinPercentage || 0)} pts</div>
                            <div className="text-[10px] text-blue-400">Yin Points</div>
                        </div>
                        {(yinYang.balancedPoints || yinYang.balancedPercentage || 0) > 0 && (
                            <div className="bg-green-500/20 rounded-lg p-2 text-center border border-green-500/30">
                                <div className="text-lg font-bold text-green-300">{yinYang.balancedPoints || Math.round(yinYang.balancedPercentage || 0)} pts</div>
                                <div className="text-[10px] text-green-400">Balanced Points</div>
                            </div>
                        )}
                        <div className="bg-amber-500/20 rounded-lg p-2 text-center border border-amber-500/30">
                            <div className="text-lg font-bold text-amber-300">{yinYang.yangPoints || Math.round(yinYang.yangPercentage || 0)} pts</div>
                            <div className="text-[10px] text-amber-400">Yang Points</div>
                        </div>
                    </div>

                    {/* The 7-Battle Philosophy */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">⚔️</span>
                            <h4 className="text-[11px] font-bold text-purple-300">THE 7-BATTLE SYSTEM</h4>
                        </div>
                        <p className="text-[10px] text-white/70 leading-relaxed mb-2">
                            Every person faces <span className="text-purple-300 font-semibold">7 Constitutional Battles</span> at birth:
                        </p>
                        <ul className="text-[10px] text-white/70 space-y-1 ml-3">
                            <li>• <span className="text-amber-400 font-semibold">1 Ultimate Battle</span> (Birth Time) - 20 pts - Most important in Chinese medicine</li>
                            <li>• <span className="text-blue-300 font-semibold">4 Major Battles</span> (Animals, Elements, Signs) - 15 pts each</li>
                            <li>• <span className="text-green-300 font-semibold">2 Mini Battles</span> (Day, Gender) - 10 pts each</li>
                        </ul>
                        <p className="text-[10px] text-white/70 leading-relaxed mt-2">
                            Each battle won adds to your Yin, Yang, or Balanced score. <span className="text-white/90 font-semibold">Total: Always 100 points.</span>
                        </p>
                        <p className="text-[10px] text-amber-400 mt-2 italic">
                            ✨ "No shortcuts. Pure authority. The gift to humanity." - Ticky & Claude
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
