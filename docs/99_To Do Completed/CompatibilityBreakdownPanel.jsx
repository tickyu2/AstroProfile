/**
 * CompatibilityBreakdownPanel.jsx
 * 
 * Shows detailed scoring calculation for Western zodiac cusp compatibility
 * Displays why a match works and potential challenges
 * 
 * For Brother Opus - GENESIS Platform
 * By Brother Sonnet, December 23, 2025
 */

import React, { useState } from 'react';
import { calculateCuspBreakdown, getCuspChallenges } from '../utils/westernZodiac/westernCuspBreakdown';

const CompatibilityBreakdownPanel = ({ userCusp, partnerCusp, score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get detailed breakdown
  const breakdown = calculateCuspBreakdown(userCusp, partnerCusp);
  const challenges = getCuspChallenges(userCusp, partnerCusp, breakdown);
  
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
      {/* Header */}
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
      
      {/* Expand/Collapse Button */}
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
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Why This Works */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
              <span>✓</span> Why This Works
            </h4>
            
            {/* Scoring Components */}
            <div className="space-y-2">
              {/* Element Score */}
              <ScoreBar
                label="Primary Element"
                detail={`${userCusp.element.primary} + ${partnerCusp.element.primary}`}
                score={breakdown.element}
                maxScore={35}
                color="blue"
                explanation={breakdown.elementExplanation}
              />
              
              {/* Secondary Element */}
              {breakdown.secondary > 0 && (
                <ScoreBar
                  label="Secondary Element"
                  detail={`${userCusp.element.secondary || 'none'} + ${partnerCusp.element.secondary || 'none'}`}
                  score={breakdown.secondary}
                  maxScore={8}
                  color="cyan"
                  explanation={breakdown.secondaryExplanation}
                />
              )}
              
              {/* Quality/Modality */}
              <ScoreBar
                label="Quality/Modality"
                detail={`${breakdown.userQuality} + ${breakdown.partnerQuality}`}
                score={breakdown.quality}
                maxScore={25}
                color="purple"
                explanation={breakdown.qualityExplanation}
              />
              
              {/* Rulers */}
              <ScoreBar
                label="Planetary Rulers"
                detail={`${userCusp.rulers?.join(', ')} + ${partnerCusp.rulers?.join(', ')}`}
                score={breakdown.rulers}
                maxScore={20}
                color="yellow"
                explanation={breakdown.rulersExplanation}
              />
              
              {/* Cusp Type */}
              <ScoreBar
                label="Cusp Type"
                detail={`${userCusp.type} + ${partnerCusp.type}`}
                score={breakdown.type}
                maxScore={10}
                color="pink"
                explanation={breakdown.typeExplanation}
              />
              
              {/* Mutual Influence */}
              {breakdown.influence > 0 && (
                <ScoreBar
                  label="Mutual Influence"
                  detail={breakdown.influenceDetail}
                  score={breakdown.influence}
                  maxScore={15}
                  color="green"
                  explanation={breakdown.influenceExplanation}
                  highlight={breakdown.influence >= 10}
                />
              )}
              
              {/* Aspect */}
              <ScoreBar
                label="Astrological Aspect"
                detail={breakdown.aspectName}
                score={breakdown.aspect}
                maxScore={15}
                color={breakdown.aspect > 0 ? 'emerald' : 'red'}
                explanation={breakdown.aspectExplanation}
              />
            </div>
            
            {/* Total */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Raw Total:</span>
                <span className="text-2xl font-bold text-white">{breakdown.rawTotal} pts</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-400 text-sm">Final Score (capped at 100):</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {score}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Challenges & Growth Areas */}
          {challenges.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <span>⚠</span> Potential Challenges
              </h4>
              
              <div className="space-y-2">
                {challenges.map((challenge, index) => (
                  <ChallengeCard key={index} challenge={challenge} />
                ))}
              </div>
              
              <p className="text-sm text-slate-400 italic mt-3">
                💡 Challenges are opportunities for growth! Understanding these areas helps build stronger connections.
              </p>
            </div>
          )}
          
          {/* Strengths Summary */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-700/30">
            <h4 className="text-sm font-bold text-green-400 mb-2">
              💎 Key Strengths
            </h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {breakdown.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCORE BAR COMPONENT
// ============================================================================

const ScoreBar = ({ label, detail, score, maxScore, color, explanation, highlight }) => {
  const percentage = (score / maxScore) * 100;
  
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    cyan: 'from-cyan-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    yellow: 'from-yellow-500 to-amber-500',
    pink: 'from-pink-500 to-rose-500',
    green: 'from-green-500 to-emerald-500',
    emerald: 'from-emerald-500 to-green-500',
    red: 'from-red-500 to-orange-500'
  };
  
  return (
    <div className={`p-3 rounded-lg bg-slate-800/50 ${highlight ? 'ring-2 ring-green-400/50' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-sm font-medium text-white flex items-center gap-2">
            {label}
            {highlight && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Special!</span>}
          </div>
          <div className="text-xs text-slate-400">{detail}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{score}</div>
          <div className="text-xs text-slate-500">/ {maxScore}</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Explanation */}
      {explanation && (
        <p className="text-xs text-slate-400 mt-2 italic">
          {explanation}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// CHALLENGE CARD COMPONENT
// ============================================================================

const ChallengeCard = ({ challenge }) => {
  const severityColors = {
    high: 'from-red-900/20 to-orange-900/20 border-red-700/30',
    medium: 'from-amber-900/20 to-yellow-900/20 border-amber-700/30',
    low: 'from-slate-900/20 to-slate-800/20 border-slate-700/30'
  };
  
  const severityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🔵'
  };
  
  return (
    <div className={`bg-gradient-to-br ${severityColors[challenge.severity]} rounded-lg p-3 border`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{severityIcons[challenge.severity]}</span>
        <div className="flex-1">
          <h5 className="text-sm font-semibold text-white mb-1">
            {challenge.title}
          </h5>
          <p className="text-xs text-slate-300 mb-2">
            {challenge.description}
          </p>
          {challenge.solution && (
            <div className="bg-slate-800/50 rounded px-2 py-1 text-xs text-slate-400">
              <span className="text-green-400">💡 Growth tip:</span> {challenge.solution}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityBreakdownPanel;
