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
 * For Brother Opus - GENESIS Platform
 * Merged: Brother Opus (dual bars) + Brother Sonnet (transparency)
 * December 23, 2025
 */

import React, { useState } from 'react';
import { calculateCuspBreakdown, getCuspChallenges } from '../../utils/westernZodiac/westernCuspBreakdown';
import CompatibilityTheoryPanel from './CompatibilityTheoryPanel';

const CompatibilityBreakdownPanel = ({ userCusp, partnerCusp, score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [expandedElementTheory, setExpandedElementTheory] = useState(false);

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

      {/* Transparency Notice (Always Visible) */}
      <div className="mb-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
        <div className="flex items-start gap-2">
          <span className="text-xl">📊</span>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-indigo-300 mb-1">Transparent Calculation</h4>
            <p className="text-xs text-indigo-200">
              No black boxes. Click below to see every assumption, formula, and contribution from each person.
              Mathematics you can verify - like Bitcoin.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Toggle (Expandable) */}
      <button
        onClick={() => setShowMethodology(!showMethodology)}
        className="w-full mb-3 py-2 px-4 rounded-lg bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-700/30 transition-all flex items-center justify-between"
      >
        <span className="text-yellow-400 text-sm font-medium flex items-center gap-2">
          <span>⚖️</span> Assumptions & Weighting System
        </span>
        <svg
          className={`w-4 h-4 text-yellow-400 transition-transform ${showMethodology ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Methodology Panel (Brother Sonnet's transparency) */}
      {showMethodology && (
        <div className="mb-4 bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/40">
          <div className="space-y-3 text-sm">
            <div className="bg-slate-800/50 rounded p-3">
              <div className="font-bold text-yellow-300 mb-2">Score Components (Total ≈ 100 pts):</div>
              <div className="space-y-1 text-slate-300 text-xs">
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
              <p className="text-slate-300 text-xs italic">
                Each component is split 50/50 between both people. Your score stays constant while
                partner's contribution varies. This shows constitutional compatibility, not personality preference.
              </p>
            </div>
          </div>
        </div>
      )}

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
          {/* Legend for Dual Contribution Bars */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mb-4">
            <h4 className="text-sm font-bold text-slate-300 mb-2">Understanding the Scores</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                <span className="text-teal-400 font-medium">Your contribution</span>
                <span className="text-slate-500">(fixed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                <span className="text-purple-400 font-medium">Partner contribution</span>
                <span className="text-slate-500">(varies)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              As you click different partners, your side stays the same while their contribution changes.
            </p>
          </div>

          {/* Why This Works */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
              <span>✓</span> Why This Works
            </h4>

            {/* Scoring Components */}
            <div className="space-y-2">
              {/* Element Score - Visual Bars + Complete Theory */}
              <div className="bg-slate-800/50 rounded-lg p-3">
                {/* Dual contribution bars */}
                <ScoreBar
                  label="Primary Element"
                  detail={`${breakdown.userElement} + ${breakdown.partnerElement}`}
                  score={breakdown.element}
                  maxScore={35}
                  color="blue"
                  explanation={breakdown.elementExplanation}
                  userLabel={breakdown.userElement}
                  partnerLabel={breakdown.partnerElement}
                  userContribution={breakdown.userElementContribution}
                  partnerContribution={breakdown.partnerElementContribution}
                  interaction={breakdown.elementInteraction}
                  hideDetailButton={true}
                />

                {/* Complete Theory Panel (Brother Sonnet's PhD-level transparency) */}
                {breakdown.elementTheory && (
                  <CompatibilityTheoryPanel
                    elementTheory={breakdown.elementTheory}
                    isExpanded={expandedElementTheory}
                    onToggle={() => setExpandedElementTheory(!expandedElementTheory)}
                  />
                )}
              </div>

              {/* Secondary Element */}
              {breakdown.secondary > 0 && (
                <ScoreBar
                  label="Secondary Element"
                  detail={`${breakdown.userSecondary || 'none'} + ${breakdown.partnerSecondary || 'none'}`}
                  score={breakdown.secondary}
                  maxScore={8}
                  color="cyan"
                  explanation={breakdown.secondaryExplanation}
                  userLabel={breakdown.userSecondary || '—'}
                  partnerLabel={breakdown.partnerSecondary || '—'}
                  userContribution={breakdown.userSecondaryContribution}
                  partnerContribution={breakdown.partnerSecondaryContribution}
                  interaction="complement"
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
                userLabel={breakdown.userQuality}
                partnerLabel={breakdown.partnerQuality}
                userContribution={breakdown.userQualityContribution}
                partnerContribution={breakdown.partnerQualityContribution}
                interaction={breakdown.qualityInteraction}
              />

              {/* Rulers */}
              <ScoreBar
                label="Planetary Rulers"
                detail={`${Array.isArray(breakdown.userRulers) ? breakdown.userRulers.join(', ') : (breakdown.userRulers || '—')} + ${Array.isArray(breakdown.partnerRulers) ? breakdown.partnerRulers.join(', ') : (breakdown.partnerRulers || '—')}`}
                score={breakdown.rulers}
                maxScore={20}
                color="yellow"
                explanation={breakdown.rulersExplanation}
                userLabel={Array.isArray(breakdown.userRulers) ? breakdown.userRulers.join(', ') : (breakdown.userRulers || '—')}
                partnerLabel={Array.isArray(breakdown.partnerRulers) ? breakdown.partnerRulers.join(', ') : (breakdown.partnerRulers || '—')}
                userContribution={breakdown.userRulersContribution}
                partnerContribution={breakdown.partnerRulersContribution}
                interaction={breakdown.rulersInteraction}
              />

              {/* Cusp Type */}
              <ScoreBar
                label="Cusp Type"
                detail={`${breakdown.userType} + ${breakdown.partnerType}`}
                score={breakdown.type}
                maxScore={10}
                color="pink"
                explanation={breakdown.typeExplanation}
                userLabel={breakdown.userType}
                partnerLabel={breakdown.partnerType}
                userContribution={breakdown.userTypeContribution}
                partnerContribution={breakdown.partnerTypeContribution}
                interaction={breakdown.typeInteraction}
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
                  userLabel={breakdown.userInfluence || '—'}
                  partnerLabel={breakdown.partnerInfluence || '—'}
                  userContribution={breakdown.userInfluenceContribution}
                  partnerContribution={breakdown.partnerInfluenceContribution}
                  interaction={breakdown.influenceInteraction}
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
                userLabel={breakdown.userSign}
                partnerLabel={breakdown.partnerSign}
                userContribution={breakdown.userAspectContribution}
                partnerContribution={breakdown.partnerAspectContribution}
                interaction={breakdown.aspectInteraction}
              />
            </div>

            {/* Total Contribution Summary (Brother Sonnet's transparency) */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/40">
              <h4 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Total Compatibility Score</span>
              </h4>

              <div className="space-y-3">
                {/* Your Total Contribution */}
                <div className="bg-slate-800/50 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-teal-300 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                      Your Contribution:
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {(
                        (breakdown.userElementContribution || 0) +
                        (breakdown.userSecondaryContribution || 0) +
                        (breakdown.userQualityContribution || 0) +
                        (breakdown.userRulersContribution || 0) +
                        (breakdown.userTypeContribution || 0) +
                        (breakdown.userInfluenceContribution || 0) +
                        (breakdown.userAspectContribution || 0)
                      ).toFixed(1)} pts
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    You contribute 50% of each component (your constitutional nature - FIXED)
                  </div>
                </div>

                {/* Partner Total Contribution */}
                <div className="bg-slate-800/50 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-pink-300 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                      Partner's Contribution:
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {(
                        (breakdown.partnerElementContribution || 0) +
                        (breakdown.partnerSecondaryContribution || 0) +
                        (breakdown.partnerQualityContribution || 0) +
                        (breakdown.partnerRulersContribution || 0) +
                        (breakdown.partnerTypeContribution || 0) +
                        (breakdown.partnerInfluenceContribution || 0) +
                        (breakdown.partnerAspectContribution || 0)
                      ).toFixed(1)} pts
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Partner contributes 50% of each component (their constitutional nature - VARIES)
                  </div>
                </div>

                {/* Final Score */}
                <div className="bg-gradient-to-r from-purple-700/30 to-pink-700/30 rounded p-4 border border-purple-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-purple-200">Final Score:</span>
                      <div className="text-xs text-purple-300 mt-1">
                        Raw total: {breakdown.rawTotal} pts → Capped at 100%
                      </div>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {score}%
                    </span>
                  </div>
                </div>
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
// COMPONENT REASONING - Why each weight exists
// ============================================================================

const getComponentReasoning = (label) => {
  const reasons = {
    'Primary Element': 'Core energy is the foundation of compatibility - Fire, Earth, Air, Water determine fundamental nature',
    'Secondary Element': 'Cusp blend adds depth - secondary element shows duality and complexity',
    'Quality/Modality': 'How you act (Cardinal/Fixed/Mutable) determines relationship dynamics and decision-making',
    'Planetary Rulers': 'Planetary influences shape desires, drives, and life themes',
    'Cusp Type': 'Pure vs cusp determines energy focus - single or blended expression',
    'Mutual Influence': 'Special connections like mirror cusps or bridges create rare overlaps',
    'Astrological Aspect': 'Geometric angle between signs determines natural harmony or tension'
  };
  return reasons[label] || 'Constitutional factor in compatibility calculation';
};

// ============================================================================
// SCORE BAR COMPONENT - Dual Contribution Display
// ============================================================================

const ScoreBar = ({
  label,
  detail,
  score,
  maxScore,
  color,
  explanation,
  highlight,
  // Individual contributions
  userLabel,
  partnerLabel,
  userContribution = 0,
  partnerContribution = 0,
  interaction = 'neutral',
  // For step-by-step calculation display
  componentKey = '',
  // Hide detail button when using external theory panel
  hideDetailButton = false
}) => {
  // State for expandable calculation panel
  const [showCalc, setShowCalc] = useState(false);

  const percentage = (Math.abs(score) / maxScore) * 100;
  const compatibilityPercent = Math.round(percentage);
  const halfMax = maxScore / 2;
  const userPercentage = (Math.abs(userContribution) / maxScore) * 100;
  const partnerPercentage = (Math.abs(partnerContribution) / maxScore) * 100;
  const isNegative = score < 0;

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

  // User side always uses a fixed color (teal/cyan)
  const userColor = 'from-teal-500 to-cyan-500';
  // Partner side uses the category color
  const partnerColor = colorClasses[color] || colorClasses.purple;

  // Interaction indicator
  const interactionIcons = {
    synergy: { icon: '⚡', text: 'Synergy', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
    boost: { icon: '↑', text: 'Boost', bgColor: 'bg-green-500/20', textColor: 'text-green-400' },
    complement: { icon: '↔', text: 'Complement', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
    friction: { icon: '⚠', text: 'Challenge', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400' },
    mirror: { icon: '🪞', text: 'Mirror', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
    bridge: { icon: '🌉', text: 'Bridge', bgColor: 'bg-cyan-500/20', textColor: 'text-cyan-400' },
    shared: { icon: '🤝', text: 'Shared', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400' },
    neutral: { icon: '○', text: '', bgColor: '', textColor: '' },
    none: { icon: '', text: '', bgColor: '', textColor: '' }
  };

  const interactionData = interactionIcons[interaction] || interactionIcons.neutral;

  return (
    <div className={`p-3 rounded-lg bg-slate-800/50 ${highlight ? 'ring-2 ring-green-400/50' : ''}`}>
      {/* Header with label and score */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-sm font-medium text-white flex items-center gap-2">
            {label}
            {highlight && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Special!</span>}
            {interactionData.text && (
              <span className={`text-xs ${interactionData.bgColor} ${interactionData.textColor} px-2 py-0.5 rounded-full flex items-center gap-1`}>
                <span>{interactionData.icon}</span>
                {interactionData.text}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${isNegative ? 'text-orange-400' : 'text-white'}`}>
            {isNegative ? score : `+${score}`}
          </div>
          <div className="text-xs text-slate-500">/ {maxScore}</div>
        </div>
      </div>

      {/* Contribution Labels */}
      {(userLabel || partnerLabel) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></span>
            <span className="text-teal-400 font-medium">You:</span>
            <span className="text-slate-300">{userLabel}</span>
            <span className="text-slate-500">({userContribution > 0 ? '+' : ''}{userContribution})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">({partnerContribution > 0 ? '+' : ''}{partnerContribution})</span>
            <span className="text-slate-300">{partnerLabel}</span>
            <span className="text-purple-400 font-medium">:Partner</span>
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${partnerColor}`}></span>
          </div>
        </div>
      )}

      {/* Dual Progress Bar */}
      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
        {/* User's contribution (left side - fixed) */}
        <div
          className={`h-full bg-gradient-to-r ${userColor} transition-all duration-500 ${userContribution > 0 ? 'border-r border-slate-600' : ''}`}
          style={{ width: `${userPercentage}%` }}
        />
        {/* Partner's contribution (right side - variable) */}
        <div
          className={`h-full bg-gradient-to-r ${isNegative ? 'from-orange-500 to-red-500' : partnerColor} transition-all duration-500`}
          style={{ width: `${partnerPercentage}%` }}
        />
      </div>

      {/* Combined percentage indicator */}
      <div className="flex justify-between mt-1 text-xs text-slate-500">
        <span>0</span>
        <span className={`font-medium ${isNegative ? 'text-orange-400' : 'text-slate-300'}`}>
          Combined: {Math.round(percentage)}%
        </span>
        <span>{maxScore}</span>
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="text-xs text-slate-400 mt-2 italic">
          {explanation}
        </p>
      )}

      {/* Show Detailed Calculation Toggle Button - Hidden when external theory panel is used */}
      {!hideDetailButton && (
        <button
          onClick={() => setShowCalc(!showCalc)}
          className="mt-2 w-full py-1.5 px-3 rounded bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-xs"
        >
          <span className="text-slate-300">
            {showCalc ? 'Hide' : 'Show'} Detailed Calculation
          </span>
          <svg
            className={`w-3 h-3 text-slate-400 transition-transform ${showCalc ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Expandable Detailed Calculation Panel - Only shown when not using external theory panel */}
      {!hideDetailButton && showCalc && (
        <div className="mt-3 bg-slate-900/70 rounded-lg p-3 border border-slate-600/50">
          {/* ASSUMPTIONS SECTION - Why this weight? */}
          <div className="mb-3 bg-yellow-900/20 border border-yellow-700/40 rounded p-2">
            <div className="font-bold text-yellow-300 mb-1 text-xs flex items-center gap-1">
              <span>⚖️</span> Assumptions:
            </div>
            <div className="text-xs text-slate-300 space-y-0.5">
              <div>• <span className="text-yellow-400">{label}</span> weight: <span className="font-mono text-white">{maxScore}</span> out of 100 pts</div>
              <div>• Reason: {getComponentReasoning(label)}</div>
              <div>• Split: <span className="text-teal-400">50%</span> you + <span className="text-purple-400">50%</span> partner</div>
            </div>
          </div>

          <div className="font-bold text-yellow-400 mb-3 text-xs flex items-center gap-2">
            <span>📐</span> Step-by-Step Calculation:
          </div>

          {/* Formula */}
          <div className="bg-slate-800/50 rounded p-2 mb-3 font-mono text-xs text-slate-300">
            <span className="text-purple-400">Formula:</span> ({maxScore} pts × compatibility%) ÷ 2 × 2
          </div>

          {/* Step by step breakdown */}
          <div className="space-y-1.5 text-xs text-slate-300 mb-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">1.</span>
              <span>Your {label.toLowerCase()}: <span className="text-teal-400 font-medium">{userLabel}</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">2.</span>
              <span>Partner {label.toLowerCase()}: <span className="text-purple-400 font-medium">{partnerLabel}</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">3.</span>
              <span>Interaction type: <span className="text-cyan-400 font-medium uppercase">{interaction}</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">4.</span>
              <span>Base compatibility: <span className="text-green-400 font-medium">{compatibilityPercent}%</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">5.</span>
              <span>Your share: <span className="font-mono text-teal-300">{halfMax.toFixed(1)} × {(compatibilityPercent/100).toFixed(2)} = {userContribution} pts</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">6.</span>
              <span>Partner share: <span className="font-mono text-purple-300">{halfMax.toFixed(1)} × {(compatibilityPercent/100).toFixed(2)} = {partnerContribution} pts</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-mono w-4">7.</span>
              <span>Total: <span className="font-mono text-white font-bold">{userContribution} + {partnerContribution} = {score} pts</span></span>
            </div>
          </div>

          {/* Your Share vs Partner Share Box */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-teal-900/30 border border-teal-700/50 rounded p-2 text-center">
              <div className="text-xs text-teal-400 font-medium mb-1">Your Share</div>
              <div className="text-lg font-bold text-white">{userContribution} pts</div>
              <div className="text-xs text-slate-400">(50%)</div>
            </div>
            <div className="bg-purple-900/30 border border-purple-700/50 rounded p-2 text-center">
              <div className="text-xs text-purple-400 font-medium mb-1">Partner's Share</div>
              <div className="text-lg font-bold text-white">{partnerContribution} pts</div>
              <div className="text-xs text-slate-400">(50%)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CHALLENGE CARD COMPONENT
// ============================================================================

const ChallengeCard = ({ challenge }) => {
  const [showSolution, setShowSolution] = useState(false);

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

          {/* Expandable Solution Button */}
          {challenge.solution && (
            <>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full py-1.5 px-2 rounded bg-slate-800/50 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <span className="text-green-400">
                  {showSolution ? 'Hide' : 'Show'} Solution
                </span>
                <svg
                  className={`w-3 h-3 text-green-400 transition-transform ${showSolution ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSolution && (
                <div className="mt-2 bg-green-900/20 border border-green-700/40 rounded p-2 text-xs text-slate-300">
                  <span className="text-green-400 font-medium">💡 Solution:</span> {challenge.solution}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityBreakdownPanel;
