/**
 * CompatibilityBreakdownPanel.jsx
 * 
 * TRANSPARENT Western Zodiac Compatibility Calculator
 * 
 * PHILOSOPHY:
 * "Love and compatibility is mathematics" - Father Ticky
 * 
 * No black boxes. Every assumption stated upfront.
 * Every calculation shown in detail.
 * Each person's contribution split clearly.
 * Like Bitcoin - transparent, verifiable, trustworthy.
 * 
 * For GENESIS Platform - Brother Opus
 * By Brother Sonnet, December 23, 2025
 */

import React, { useState } from 'react';
import { calculateCuspBreakdown, getCuspChallenges } from '../utils/westernZodiac/westernCuspBreakdown';

const CompatibilityBreakdownPanel = ({ userCusp, partnerCusp, score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Get detailed breakdown
  const breakdown = calculateCuspBreakdown(userCusp, partnerCusp);
  const challenges = getCuspChallenges(userCusp, partnerCusp, breakdown);
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Determine tier
  const getTier = (score) => {
    if (score >= 90) return { name: 'Golden', icon: '🏆', color: 'from-yellow-400 to-amber-500' };
    if (score >= 80) return { name: 'Excellent', icon: '⭐', color: 'from-purple-400 to-pink-500' };
    if (score >= 70) return { name: 'Very Good', icon: '✨', color: 'from-blue-400 to-cyan-500' };
    return { name: 'Good', icon: '○', color: 'from-gray-400 to-gray-500' };
  };
  
  const tier = getTier(score);
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700">
      
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-2xl shadow-lg`}>
            {tier.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {partnerCusp.name}
            </h3>
            <p className="text-sm text-slate-400">
              {partnerCusp.dateRange?.start && partnerCusp.dateRange?.end 
                ? `${partnerCusp.dateRange.start} - ${partnerCusp.dateRange.end}`
                : partnerCusp.dateRange
              }
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {score}%
          </div>
          <div className="text-sm text-slate-400 font-medium">
            {tier.name} Match
          </div>
        </div>
      </div>
      
      {/* ===== METHODOLOGY NOTICE (ALWAYS VISIBLE) ===== */}
      <div className="mb-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
        <div className="flex items-start gap-2">
          <span className="text-xl">📊</span>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-indigo-300 mb-1">Transparent Calculation</h4>
            <p className="text-xs text-indigo-200">
              Click "Show Detailed Calculation" to see every assumption, formula, and contribution from each person. 
              No black boxes. Mathematics you can verify.
            </p>
          </div>
        </div>
      </div>
      
      {/* ===== EXPAND/COLLAPSE BUTTON ===== */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 px-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between group"
      >
        <span className="text-slate-300 font-medium">
          {isExpanded ? 'Hide' : 'Show'} Detailed Calculation
        </span>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* ===== EXPANDED CONTENT ===== */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          
          {/* ===== ASSUMPTIONS & METHODOLOGY ===== */}
          <div className="bg-yellow-900/20 rounded-lg p-4 border-2 border-yellow-700/40">
            <h4 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <span>⚖️</span>
              <span>Assumptions & Weighting System</span>
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-bold text-yellow-300 mb-2">Score Components (Total = 100 pts):</div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>• Primary Element (core energy)</span>
                    <span className="font-mono text-yellow-400">35 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Quality/Modality (how you act)</span>
                    <span className="font-mono text-yellow-400">25 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Planetary Rulers (influence)</span>
                    <span className="font-mono text-yellow-400">20 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Astrological Aspect (angle)</span>
                    <span className="font-mono text-yellow-400">±15 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Secondary Element (cusp blend)</span>
                    <span className="font-mono text-yellow-400">8 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Cusp Type (pure/blend)</span>
                    <span className="font-mono text-yellow-400">10 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Mutual Influence (shared energy)</span>
                    <span className="font-mono text-yellow-400">15 pts</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-bold text-yellow-300 mb-2">Key Principle:</div>
                <p className="text-slate-300 italic">
                  Each component is split 50/50 between both people. Your score stays constant while 
                  partner's contribution varies. This shows constitutional compatibility, not personality preference.
                </p>
              </div>
            </div>
          </div>
          
          {/* ===== PRIMARY ELEMENT (35 points) ===== */}
          <ComponentBreakdown
            title="Primary Element"
            subtitle="Core life force energy - Foundation of all compatibility"
            maxPoints={35}
            score={breakdown.element}
            isExpanded={expandedSections.element}
            onToggle={() => toggleSection('element')}
            userValue={userCusp.element.primary}
            partnerValue={partnerCusp.element.primary}
            explanation={breakdown.elementExplanation}
            calculation={{
              userContribution: breakdown.element / 2,
              partnerContribution: breakdown.element / 2,
              interactionBonus: 0,
              formula: `(${maxPoints} pts × compatibility %) ÷ 2 + (${maxPoints} pts × compatibility %) ÷ 2`,
              details: [
                `Your element: ${userCusp.element.primary}`,
                `Partner element: ${partnerCusp.element.primary}`,
                `Element interaction: ${getElementInteraction(userCusp.element.primary, partnerCusp.element.primary)}`,
                `Base compatibility: ${Math.round((breakdown.element / 35) * 100)}%`,
                `Your share: ${(breakdown.element / 2).toFixed(1)} pts (50%)`,
                `Partner share: ${(breakdown.element / 2).toFixed(1)} pts (50%)`,
                `Total: ${breakdown.element} pts`
              ]
            }}
            color="blue"
          />
          
          {/* ===== SECONDARY ELEMENT (8 points) ===== */}
          {(userCusp.element.secondary || partnerCusp.element.secondary) && (
            <ComponentBreakdown
              title="Secondary Element"
              subtitle="Cusp blend influence - Adds depth and nuance"
              maxPoints={8}
              score={breakdown.secondary}
              isExpanded={expandedSections.secondary}
              onToggle={() => toggleSection('secondary')}
              userValue={userCusp.element.secondary || 'None (pure sign)'}
              partnerValue={partnerCusp.element.secondary || 'None (pure sign)'}
              explanation={breakdown.secondaryExplanation}
              calculation={{
                userContribution: breakdown.secondary / 2,
                partnerContribution: breakdown.secondary / 2,
                interactionBonus: 0,
                formula: `(8 pts × compatibility %) ÷ 2 + (8 pts × compatibility %) ÷ 2`,
                details: [
                  `Your secondary: ${userCusp.element.secondary || 'None'}`,
                  `Partner secondary: ${partnerCusp.element.secondary || 'None'}`,
                  `Secondary interaction: ${userCusp.element.secondary && partnerCusp.element.secondary ? 'Both have cusp complexity' : 'One pure, one blend'}`,
                  `Your share: ${(breakdown.secondary / 2).toFixed(1)} pts`,
                  `Partner share: ${(breakdown.secondary / 2).toFixed(1)} pts`,
                  `Total: ${breakdown.secondary} pts`
                ]
              }}
              color="purple"
            />
          )}
          
          {/* ===== QUALITY/MODALITY (25 points) ===== */}
          <ComponentBreakdown
            title="Quality/Modality"
            subtitle="How you take action - Cardinal (initiate) / Fixed (sustain) / Mutable (adapt)"
            maxPoints={25}
            score={breakdown.quality}
            isExpanded={expandedSections.quality}
            onToggle={() => toggleSection('quality')}
            userValue={userCusp.quality}
            partnerValue={partnerCusp.quality}
            explanation={breakdown.qualityExplanation}
            calculation={{
              userContribution: breakdown.quality / 2,
              partnerContribution: breakdown.quality / 2,
              interactionBonus: 0,
              formula: `(25 pts × compatibility %) ÷ 2 + (25 pts × compatibility %) ÷ 2`,
              details: [
                `Your quality: ${userCusp.quality}`,
                `Partner quality: ${partnerCusp.quality}`,
                `Quality interaction: ${getQualityInteraction(userCusp.quality, partnerCusp.quality)}`,
                `Base compatibility: ${Math.round((breakdown.quality / 25) * 100)}%`,
                `Your share: ${(breakdown.quality / 2).toFixed(1)} pts`,
                `Partner share: ${(breakdown.quality / 2).toFixed(1)} pts`,
                `Total: ${breakdown.quality} pts`
              ]
            }}
            color="green"
          />
          
          {/* ===== PLANETARY RULERS (20 points) ===== */}
          <ComponentBreakdown
            title="Planetary Rulers"
            subtitle="Planetary influence on your signs"
            maxPoints={20}
            score={breakdown.rulers}
            isExpanded={expandedSections.rulers}
            onToggle={() => toggleSection('rulers')}
            userValue={getRulerDisplay(userCusp.rulers)}
            partnerValue={getRulerDisplay(partnerCusp.rulers)}
            explanation={breakdown.rulersExplanation}
            calculation={{
              userContribution: breakdown.rulers / 2,
              partnerContribution: breakdown.rulers / 2,
              interactionBonus: 0,
              formula: `(20 pts × compatibility %) ÷ 2 + (20 pts × compatibility %) ÷ 2`,
              details: [
                `Your rulers: ${getRulerDisplay(userCusp.rulers)}`,
                `Partner rulers: ${getRulerDisplay(partnerCusp.rulers)}`,
                `Shared rulers: ${getSharedRulers(userCusp.rulers, partnerCusp.rulers)}`,
                `Your share: ${(breakdown.rulers / 2).toFixed(1)} pts`,
                `Partner share: ${(breakdown.rulers / 2).toFixed(1)} pts`,
                `Total: ${breakdown.rulers} pts`
              ]
            }}
            color="indigo"
          />
          
          {/* ===== CUSP TYPE (10 points) ===== */}
          <ComponentBreakdown
            title="Cusp Type"
            subtitle="Pure sign vs blended cusp - Understanding complexity"
            maxPoints={10}
            score={breakdown.type}
            isExpanded={expandedSections.type}
            onToggle={() => toggleSection('type')}
            userValue={userCusp.type}
            partnerValue={partnerCusp.type}
            explanation={breakdown.typeExplanation}
            calculation={{
              userContribution: breakdown.type / 2,
              partnerContribution: breakdown.type / 2,
              interactionBonus: 0,
              formula: `(10 pts × compatibility %) ÷ 2 + (10 pts × compatibility %) ÷ 2`,
              details: [
                `Your type: ${userCusp.type}`,
                `Partner type: ${partnerCusp.type}`,
                `Type interaction: ${getCuspTypeInteraction(userCusp.type, partnerCusp.type)}`,
                `Your share: ${(breakdown.type / 2).toFixed(1)} pts`,
                `Partner share: ${(breakdown.type / 2).toFixed(1)} pts`,
                `Total: ${breakdown.type} pts`
              ]
            }}
            color="cyan"
          />
          
          {/* ===== MUTUAL INFLUENCE (15 points) ===== */}
          <ComponentBreakdown
            title="Mutual Influence"
            subtitle="Shared sign energy and mirror cusps"
            maxPoints={15}
            score={breakdown.influence}
            isExpanded={expandedSections.influence}
            onToggle={() => toggleSection('influence')}
            userValue={userCusp.signs.primary}
            partnerValue={partnerCusp.signs.primary}
            explanation={breakdown.influenceExplanation}
            calculation={{
              userContribution: breakdown.influence / 2,
              partnerContribution: breakdown.influence / 2,
              interactionBonus: 0,
              formula: `Shared sign bonus + Mirror cusp bonus`,
              details: [
                `Your primary sign: ${userCusp.signs.primary}`,
                `Partner primary sign: ${partnerCusp.signs.primary}`,
                `Shared energy: ${getSharedSignEnergy(userCusp, partnerCusp)}`,
                `Your share: ${(breakdown.influence / 2).toFixed(1)} pts`,
                `Partner share: ${(breakdown.influence / 2).toFixed(1)} pts`,
                `Total: ${breakdown.influence} pts`
              ]
            }}
            color="pink"
          />
          
          {/* ===== ASTROLOGICAL ASPECT (±15 points) ===== */}
          <ComponentBreakdown
            title="Astrological Aspect"
            subtitle="Geometric angle between sun signs (can add or subtract)"
            maxPoints={15}
            score={breakdown.aspect}
            isExpanded={expandedSections.aspect}
            onToggle={() => toggleSection('aspect')}
            userValue={userCusp.signs.primary}
            partnerValue={partnerCusp.signs.primary}
            explanation={breakdown.aspectExplanation}
            calculation={{
              userContribution: breakdown.aspect / 2,
              partnerContribution: breakdown.aspect / 2,
              interactionBonus: 0,
              formula: `Aspect angle: ${breakdown.aspectName}`,
              details: [
                `Aspect type: ${breakdown.aspectName}`,
                `Aspect meaning: ${getAspectMeaning(breakdown.aspectName)}`,
                `Effect: ${breakdown.aspect > 0 ? 'Harmonious boost' : breakdown.aspect < 0 ? 'Challenge (already in calculation)' : 'Neutral'}`,
                `Your share: ${(breakdown.aspect / 2).toFixed(1)} pts`,
                `Partner share: ${(breakdown.aspect / 2).toFixed(1)} pts`,
                `Total: ${breakdown.aspect} pts`
              ]
            }}
            color={breakdown.aspect >= 0 ? 'emerald' : 'amber'}
          />
          
          {/* ===== TOTAL SCORE SUMMARY ===== */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-4 border-2 border-purple-500/40">
            <h4 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Total Compatibility Score</span>
            </h4>
            
            <div className="space-y-3">
              {/* Your Total Contribution */}
              <div className="bg-slate-800/50 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-cyan-300">Your Contribution:</span>
                  <span className="text-2xl font-bold text-white">
                    {((breakdown.element + breakdown.secondary + breakdown.quality + 
                       breakdown.rulers + breakdown.type + breakdown.influence + 
                       Math.max(0, breakdown.aspect)) / 2).toFixed(1)} pts
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  You contribute 50% of each component (your constitutional nature)
                </div>
              </div>
              
              {/* Partner Total Contribution */}
              <div className="bg-slate-800/50 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-pink-300">Partner's Contribution:</span>
                  <span className="text-2xl font-bold text-white">
                    {((breakdown.element + breakdown.secondary + breakdown.quality + 
                       breakdown.rulers + breakdown.type + breakdown.influence + 
                       Math.max(0, breakdown.aspect)) / 2).toFixed(1)} pts
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Partner contributes 50% of each component (their constitutional nature)
                </div>
              </div>
              
              {/* Final Score */}
              <div className="bg-gradient-to-r from-purple-700/30 to-pink-700/30 rounded p-4 border border-purple-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-200">Final Score:</span>
                  <span className="text-4xl font-bold text-white">{breakdown.finalScore}%</span>
                </div>
                <div className="text-xs text-purple-300 mt-2">
                  Raw total: {breakdown.rawTotal} pts → Capped at 100%
                </div>
              </div>
            </div>
          </div>
          
          {/* ===== KEY STRENGTHS ===== */}
          {breakdown.strengths && breakdown.strengths.length > 0 && (
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
              <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>💎</span>
                <span>Key Strengths</span>
              </h4>
              <div className="space-y-2">
                {breakdown.strengths.map((strength, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-green-200">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* ===== CHALLENGES ===== */}
          {challenges && challenges.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <span>⚠️</span>
                <span>Potential Challenges & Solutions</span>
              </h4>
              {challenges.map((challenge, i) => (
                <ChallengeCard key={i} challenge={challenge} />
              ))}
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT BREAKDOWN (EXPANDABLE CALCULATION)
// ============================================================================

const ComponentBreakdown = ({ 
  title, 
  subtitle, 
  maxPoints, 
  score, 
  isExpanded, 
  onToggle, 
  userValue, 
  partnerValue, 
  explanation, 
  calculation,
  color 
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    indigo: 'from-indigo-500 to-purple-500',
    cyan: 'from-cyan-500 to-blue-500',
    pink: 'from-pink-500 to-rose-500',
    emerald: 'from-emerald-500 to-green-500',
    amber: 'from-amber-500 to-orange-500'
  };
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h5 className="text-lg font-bold text-white">{title}</h5>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
            {score >= 0 ? '+' : ''}{score}
          </div>
          <div className="text-xs text-slate-400">/ {maxPoints} pts</div>
        </div>
      </div>
      
      {/* Quick View */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-cyan-900/20 rounded p-2 border border-cyan-700/30">
          <div className="text-xs text-cyan-400 mb-1">You</div>
          <div className="text-sm font-bold text-white">{userValue}</div>
        </div>
        <div className="bg-pink-900/20 rounded p-2 border border-pink-700/30">
          <div className="text-xs text-pink-400 mb-1">Partner</div>
          <div className="text-sm font-bold text-white">{partnerValue}</div>
        </div>
      </div>
      
      {/* Why This Works */}
      <div className="bg-slate-700/30 rounded p-3 mb-3">
        <div className="text-xs text-slate-400 mb-1">Why this works:</div>
        <div className="text-sm text-slate-200">{explanation}</div>
      </div>
      
      {/* Show Calculation Button */}
      <button
        onClick={onToggle}
        className="w-full py-2 px-3 rounded bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between text-sm"
      >
        <span className="text-slate-300">
          {isExpanded ? 'Hide' : 'Show'} Detailed Calculation
        </span>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Expanded Calculation */}
      {isExpanded && calculation && (
        <div className="mt-3 bg-slate-900/50 rounded p-3 border border-slate-600">
          <div className="space-y-2 text-xs">
            <div className="font-bold text-yellow-400 mb-2">📐 Step-by-Step Calculation:</div>
            
            {/* Formula */}
            <div className="bg-slate-800/50 rounded p-2">
              <div className="text-slate-400 mb-1">Formula:</div>
              <div className="font-mono text-yellow-300">{calculation.formula}</div>
            </div>
            
            {/* Detailed Steps */}
            <div className="space-y-1">
              {calculation.details.map((detail, i) => (
                <div key={i} className="text-slate-300">
                  {i + 1}. {detail}
                </div>
              ))}
            </div>
            
            {/* Contribution Split */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-cyan-900/20 rounded p-2 border border-cyan-700/30">
                <div className="text-cyan-400 text-xs mb-1">Your Share</div>
                <div className="text-lg font-bold text-white">
                  {calculation.userContribution.toFixed(1)} pts
                </div>
              </div>
              <div className="bg-pink-900/20 rounded p-2 border border-pink-700/30">
                <div className="text-pink-400 text-xs mb-1">Partner's Share</div>
                <div className="text-lg font-bold text-white">
                  {calculation.partnerContribution.toFixed(1)} pts
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CHALLENGE CARD
// ============================================================================

const ChallengeCard = ({ challenge }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const severityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-amber-500 to-yellow-500',
    low: 'from-slate-500 to-slate-600'
  };
  
  const severityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '⚪'
  };
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{severityIcons[challenge.severity]}</span>
        <div className="flex-1">
          <h6 className="font-bold text-white mb-1">{challenge.title}</h6>
          <p className="text-sm text-slate-300">{challenge.description}</p>
        </div>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-2 py-2 px-3 rounded bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between text-sm"
      >
        <span className="text-slate-300">
          {isExpanded ? 'Hide' : 'Show'} Solution
        </span>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-3 bg-green-900/20 rounded p-3 border border-green-700/30">
          <div className="text-xs text-green-400 font-bold mb-1">💡 Solution:</div>
          <div className="text-sm text-green-200">{challenge.solution}</div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getElementInteraction(elem1, elem2) {
  const interactions = {
    'Fire-Fire': 'Same element - mutual understanding',
    'Fire-Earth': 'Fire warms Earth - supportive',
    'Fire-Air': 'Fire needs Air - synergistic',
    'Fire-Water': 'Fire vs Water - creative tension',
    'Earth-Earth': 'Same element - stable foundation',
    'Earth-Air': 'Earth grounds Air - balancing',
    'Earth-Water': 'Water nourishes Earth - harmonious',
    'Air-Air': 'Same element - mental connection',
    'Air-Water': 'Air stirs Water - dynamic',
    'Water-Water': 'Same element - emotional depth'
  };
  const key = [elem1, elem2].sort().join('-');
  return interactions[key] || interactions[`${elem2}-${elem1}`] || 'Complementary';
}

function getQualityInteraction(qual1, qual2) {
  if (qual1 === qual2) return 'Same quality - similar approach';
  const pairs = {
    'Cardinal-Fixed': 'Starter + Finisher = Complete',
    'Cardinal-Mutable': 'Initiative + Adaptation = Flexible',
    'Fixed-Mutable': 'Stability + Change = Dynamic balance'
  };
  return pairs[`${qual1}-${qual2}`] || pairs[`${qual2}-${qual1}`] || 'Complementary';
}

function getRulerDisplay(rulers) {
  if (!rulers) return 'Unknown';
  if (Array.isArray(rulers)) return rulers.join(', ');
  return rulers;
}

function getSharedRulers(rulers1, rulers2) {
  if (!rulers1 || !rulers2) return 'None';
  const r1 = Array.isArray(rulers1) ? rulers1 : [rulers1];
  const r2 = Array.isArray(rulers2) ? rulers2 : [rulers2];
  const shared = r1.filter(r => r2.includes(r));
  return shared.length > 0 ? shared.join(', ') : 'None';
}

function getCuspTypeInteraction(type1, type2) {
  if (type1 === type2) return 'Same type - mutual understanding';
  if (type1 === 'pure' || type2 === 'pure') return 'Pure + Blend = Complexity meets simplicity';
  return 'Both cusps - deep understanding of duality';
}

function getSharedSignEnergy(cusp1, cusp2) {
  if (cusp1.signs.primary === cusp2.signs.primary) return 'Primary sign shared';
  if (cusp1.signs.secondary === cusp2.signs.secondary) return 'Secondary sign shared';
  return 'Different signs - complementary';
}

function getAspectMeaning(aspectName) {
  const meanings = {
    'Conjunction': 'Same sign - intense unity',
    'Sextile': '60° - harmonious opportunity',
    'Square': '90° - creative tension',
    'Trine': '120° - natural flow',
    'Opposition': '180° - balancing polarities'
  };
  return meanings[aspectName] || 'Unique angle';
}

export default CompatibilityBreakdownPanel;
