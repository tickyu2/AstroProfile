/**
 * BaZiPartnerBreakdownPanel.jsx
 * 
 * BaZi AI SoulPartner Calculator - Complete Transparency
 * NO BLACK BOX BUGS (BBB)!
 * 
 * Shows:
 * - Complete theory for each pillar
 * - Step-by-step calculations
 * - All assumptions stated upfront
 * - Separate YOUR vs PARTNER paths
 * - PhD-level rigor
 * 
 * For GENESIS Platform - BaZi Module
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky - "Show your work!"
 */

import React, { useState } from 'react';
import { calculateOptimalPartner } from '../../utils/bazi/baziPartnerBreakdown';

// ============================================================================
// MAIN PANEL COMPONENT
// ============================================================================

const BaZiPartnerBreakdownPanel = ({ userBazi }) => {
  const [expandedPillars, setExpandedPillars] = useState({
    methodology: false,
    day: false,
    hour: false,
    month: false,
    year: false
  });

  // Calculate optimal partner with COMPLETE theory
  const result = calculateOptimalPartner(userBazi);
  
  const togglePillar = (pillar) => {
    setExpandedPillars(prev => ({
      ...prev,
      [pillar]: !prev[pillar]
    }));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700">
      
      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          🎯 Your Optimal AI SoulPartner
        </h3>
        <p className="text-slate-400 text-sm">
          Reverse-engineered from your Four Pillars using 5 Element Theory
        </p>
      </div>

      {/* ===== TRANSPARENCY NOTICE ===== */}
      <div className="mb-6 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
        <div className="flex items-start gap-2">
          <span className="text-xl">🔬</span>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-indigo-300 mb-1">
              Complete Transparency - No Black Box Bugs!
            </h4>
            <p className="text-xs text-indigo-200">
              Every calculation shown. Every assumption stated. Every formula derived.
              Like Bitcoin - mathematics you can verify yourself.
            </p>
          </div>
        </div>
      </div>

      {/* ===== METHODOLOGY (Always show first!) ===== */}
      <MethodologySection 
        methodology={result.methodology}
        isExpanded={expandedPillars.methodology}
        onToggle={() => togglePillar('methodology')}
      />

      {/* ===== YOUR FOUR PILLARS ===== */}
      <YourFourPillars userBazi={result.userBazi} />

      {/* ===== OPTIMAL PARTNER'S FOUR PILLARS ===== */}
      <OptimalPartnerPillars optimalPartner={result.optimalPartner} />

      {/* ===== DETAILED BREAKDOWN ===== */}
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-bold text-white">
          📊 Detailed Pillar Analysis
        </h4>

        {/* Day Pillar (70%) */}
        <PillarBreakdown
          pillarData={result.breakdown.day}
          isExpanded={expandedPillars.day}
          onToggle={() => togglePillar('day')}
          color="purple"
        />

        {/* Hour Pillar (15%) */}
        <PillarBreakdown
          pillarData={result.breakdown.hour}
          isExpanded={expandedPillars.hour}
          onToggle={() => togglePillar('hour')}
          color="blue"
        />

        {/* Month Pillar (10%) */}
        <PillarBreakdown
          pillarData={result.breakdown.month}
          isExpanded={expandedPillars.month}
          onToggle={() => togglePillar('month')}
          color="green"
        />

        {/* Year Pillar (5%) */}
        <PillarBreakdown
          pillarData={result.breakdown.year}
          isExpanded={expandedPillars.year}
          onToggle={() => togglePillar('year')}
          color="orange"
        />
      </div>

      {/* ===== TOTAL SCORE ===== */}
      <TotalScoreSection totalScore={result.totalScore} />

      {/* ===== BIRTH TIME WINDOW ===== */}
      <BirthTimeWindow hourWindow={result.hourWindow} />

    </div>
  );
};

// ============================================================================
// METHODOLOGY SECTION (PhD Theory!)
// ============================================================================

const MethodologySection = ({ methodology, isExpanded, onToggle }) => {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full py-3 px-4 rounded-lg bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-700/30 transition-all flex items-center justify-between"
      >
        <span className="text-yellow-400 font-bold flex items-center gap-2">
          <span>📚</span> 
          <span>Methodology & Weighting System</span>
        </span>
        <svg
          className={`w-5 h-5 text-yellow-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/40 space-y-4">
          
          {/* Title & Description */}
          <div>
            <h4 className="font-bold text-yellow-300 mb-2">
              {methodology.title}
            </h4>
            <p className="text-yellow-200 text-sm">
              {methodology.description}
            </p>
          </div>

          {/* Weighting System */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h5 className="font-bold text-yellow-300 mb-3">
              Pillar Weighting System:
            </h5>
            <div className="space-y-2 text-sm">
              {Object.entries(methodology.weighting).map(([pillar, data]) => (
                <div key={pillar} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-white capitalize">
                      {pillar} Pillar: {data.weight}%
                    </div>
                    <div className="text-slate-300 text-xs">
                      {data.reason}
                    </div>
                  </div>
                  <div className="font-mono text-yellow-400 text-lg ml-4">
                    {data.weight}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Principle */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h5 className="font-bold text-yellow-300 mb-2">
              Core Principle:
            </h5>
            <p className="text-slate-300 text-sm italic">
              {methodology.principle}
            </p>
          </div>

          {/* Why This Works */}
          <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
            <h5 className="font-bold text-indigo-300 mb-2">
              📖 Theoretical Foundation:
            </h5>
            <div className="text-indigo-200 text-xs space-y-2">
              <p>
                <strong>Based on:</strong> Chinese Four Pillars of Destiny (Ba Zi / 八字)
              </p>
              <p>
                <strong>History:</strong> 2000+ years of observation and refinement
              </p>
              <p>
                <strong>Method:</strong> 5 Element Theory (Wood, Fire, Earth, Metal, Water)
              </p>
              <p>
                <strong>Goal:</strong> Find constitutional compatibility through element harmony
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// YOUR FOUR PILLARS DISPLAY
// ============================================================================

const YourFourPillars = ({ userBazi }) => {
  return (
    <div className="mb-6 bg-cyan-900/20 rounded-lg p-4 border border-cyan-700/40">
      <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
        <span>👤</span>
        <span>Your Four Pillars (Input)</span>
      </h4>
      <div className="grid grid-cols-4 gap-3">
        <PillarCard title="Year" pillar={userBazi.year} color="orange" />
        <PillarCard title="Month" pillar={userBazi.month} color="green" />
        <PillarCard title="Day" pillar={userBazi.day} color="purple" highlight />
        <PillarCard title="Hour" pillar={userBazi.hour} color="blue" />
      </div>
    </div>
  );
};

// ============================================================================
// OPTIMAL PARTNER'S FOUR PILLARS
// ============================================================================

const OptimalPartnerPillars = ({ optimalPartner }) => {
  return (
    <div className="mb-6 bg-pink-900/20 rounded-lg p-4 border border-pink-700/40">
      <h4 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
        <span>💎</span>
        <span>Optimal Partner's Four Pillars (Output)</span>
      </h4>
      <div className="grid grid-cols-4 gap-3">
        <PillarCard title="Year" pillar={optimalPartner.year} color="orange" />
        <PillarCard title="Month" pillar={optimalPartner.month} color="green" />
        <PillarCard title="Day" pillar={optimalPartner.day} color="purple" highlight />
        <PillarCard title="Hour" pillar={optimalPartner.hour} color="blue" />
      </div>
    </div>
  );
};

// ============================================================================
// PILLAR CARD (Small Display)
// ============================================================================

const PillarCard = ({ title, pillar, color, highlight }) => {
  const colors = {
    purple: 'from-purple-600 to-purple-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg p-3 ${highlight ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="text-xs text-white/70 mb-1">{title}</div>
      <div className="text-2xl font-bold text-white text-center">
        {pillar}
      </div>
      {highlight && (
        <div className="text-xs text-yellow-300 text-center mt-1">
          Most Important!
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PILLAR BREAKDOWN (The Main Calculator Display)
// ============================================================================

const PillarBreakdown = ({ pillarData, isExpanded, onToggle, color }) => {
  const colors = {
    purple: { bg: 'bg-purple-900/20', border: 'border-purple-700/40', text: 'text-purple-400' },
    blue: { bg: 'bg-blue-900/20', border: 'border-blue-700/40', text: 'text-blue-400' },
    green: { bg: 'bg-green-900/20', border: 'border-green-700/40', text: 'text-green-400' },
    orange: { bg: 'bg-orange-900/20', border: 'border-orange-700/40', text: 'text-orange-400' }
  };

  const style = colors[color];

  return (
    <div className={`${style.bg} rounded-lg p-4 border ${style.border}`}>
      
      {/* Header (Always Visible) */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className={`font-bold ${style.text} text-lg`}>
              {pillarData.pillar} Pillar ({pillarData.weight}%)
            </h5>
            <span className="text-sm text-slate-400">
              {pillarData.userPillar} → {pillarData.optimalPillar}
            </span>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            {pillarData.meaning}
          </p>
        </div>
        <div className="text-right ml-4">
          <div className={`text-3xl font-bold ${style.text}`}>
            {pillarData.weightedScore}
          </div>
          <div className="text-xs text-slate-400">
            pts
          </div>
        </div>
      </div>

      {/* Quick Reasons (Always Visible) */}
      <div className="space-y-1 mb-3">
        {pillarData.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <span>{reason.icon}</span>
            <div>
              <span className="font-bold">{reason.title}:</span>{' '}
              <span>{reason.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="w-full py-2 px-3 rounded bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between text-sm"
      >
        <span className="text-slate-300">
          {isExpanded ? 'Hide' : 'Show'} Complete Calculation
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

      {/* Expanded Content (Calculation Details) */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <CalculationSteps calculation={pillarData.calculation} color={color} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CALCULATION STEPS (NO BLACK BOXES!)
// ============================================================================

const CalculationSteps = ({ calculation, color }) => {
  const colors = {
    purple: 'border-purple-700/40 bg-purple-900/20',
    blue: 'border-blue-700/40 bg-blue-900/20',
    green: 'border-green-700/40 bg-green-900/20',
    orange: 'border-orange-700/40 bg-orange-900/20'
  };

  return (
    <div className={`rounded-lg p-4 border ${colors[color]}`}>
      
      {/* Formula */}
      <div className="mb-4 bg-slate-900/50 rounded p-3">
        <div className="text-slate-400 text-xs mb-1">Formula:</div>
        <div className="font-mono text-yellow-300 text-sm">
          {calculation.formula}
        </div>
      </div>

      {/* All Steps */}
      <div className="space-y-2 text-sm">
        {calculation.steps.map((step, idx) => (
          <div key={idx} className="bg-slate-800/30 rounded p-3">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-400 min-w-[30px]">
                Step {step.step}:
              </span>
              <div className="flex-1">
                <div className="font-bold text-white mb-1">
                  {step.action}
                </div>
                {step.input && (
                  <div className="text-slate-300 text-xs mb-1">
                    Input: {step.input}
                  </div>
                )}
                {step.formula && (
                  <div className="font-mono text-yellow-300 text-xs mb-1">
                    {step.formula}
                  </div>
                )}
                <div className="text-cyan-400 text-xs mb-1">
                  Result: {step.result}
                </div>
                <div className="text-slate-400 text-xs italic">
                  {step.reasoning}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 50/50 Split Display */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-cyan-900/30 rounded p-3 border border-cyan-700/40">
          <div className="text-xs text-cyan-400 mb-1">Your Contribution</div>
          <div className="text-2xl font-bold text-white">
            {calculation.yourContribution} pts
          </div>
          <div className="text-xs text-cyan-300">(50%)</div>
        </div>
        <div className="bg-pink-900/30 rounded p-3 border border-pink-700/40">
          <div className="text-xs text-pink-400 mb-1">Partner Contribution</div>
          <div className="text-2xl font-bold text-white">
            {calculation.partnerContribution} pts
          </div>
          <div className="text-xs text-pink-300">(50%)</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="mt-4 bg-slate-900/50 rounded p-3">
        <h6 className="font-bold text-slate-300 mb-2 text-xs">
          Complete Breakdown:
        </h6>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Base Score:</span>
            <span className="font-mono text-yellow-300">
              {calculation.breakdown.baseScore} pts
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Weight:</span>
            <span className="font-mono text-yellow-300">
              {calculation.breakdown.weight}%
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-700 pt-1">
            <span className="text-slate-400">Weighted Total:</span>
            <span className="font-mono text-yellow-300 font-bold">
              {calculation.breakdown.weightedTotal} pts
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">→ Your Share (50%):</span>
            <span className="font-mono text-cyan-400">
              {calculation.breakdown.yourShare} pts
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">→ Partner Share (50%):</span>
            <span className="font-mono text-pink-400">
              {calculation.breakdown.partnerShare} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TOTAL SCORE SECTION
// ============================================================================

const TotalScoreSection = ({ totalScore }) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border-2 border-purple-500/40">
      <h4 className="font-bold text-purple-300 mb-4 flex items-center gap-2">
        <span>🏆</span>
        <span>Total Compatibility Score</span>
      </h4>

      {/* Calculation Steps */}
      <div className="mb-4 space-y-2">
        {totalScore.calculation.steps.map((step, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-slate-300">{step.component}:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs font-mono">
                {step.formula}
              </span>
              <span className="text-yellow-300 font-mono font-bold">
                {step.result} pts
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Final Score */}
      <div className="bg-gradient-to-r from-purple-700/30 to-pink-700/30 rounded-lg p-4 border border-purple-500/40">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-purple-200 text-sm">Total Score:</div>
            <div className="text-white text-sm mt-1">
              {totalScore.icon} {totalScore.tier} Match
            </div>
          </div>
          <div className="text-5xl font-bold text-white">
            {totalScore.total}
          </div>
        </div>
        <div className="mt-2 text-sm text-purple-300">
          {totalScore.description}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BIRTH TIME WINDOW (CRITICAL!)
// ============================================================================

const BirthTimeWindow = ({ hourWindow }) => {
  if (!hourWindow) return null;

  return (
    <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-700/40">
      <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
        <span>⏰</span>
        <span>Critical: Birth Time Window</span>
      </h4>
      <div className="bg-slate-900/50 rounded p-4">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold text-white mb-1">
            {hourWindow.display}
          </div>
          <div className="text-sm text-slate-400">
            {hourWindow.animal} Hour ({hourWindow.branch})
          </div>
        </div>
        <div className="text-sm text-slate-300 text-center">
          <p className="mb-2">
            Your optimal partner MUST be born during this 2-hour window
            for the Hour Pillar to match.
          </p>
          <p className="text-slate-400 italic text-xs">
            {hourWindow.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default BaZiPartnerBreakdownPanel;
