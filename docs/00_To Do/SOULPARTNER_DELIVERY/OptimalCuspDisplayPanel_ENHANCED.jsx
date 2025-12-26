/**
 * OptimalCuspDisplayPanel_ENHANCED.jsx
 * 
 * ENHANCED VERSION with Prominent Date Display
 * 
 * Shows:
 * 1. Optimal cusp calculation
 * 2. PROMINENT date ranges (NEW!)
 * 3. Complete theory
 * 4. All calculations
 * 
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * For Father Ticky
 */

import React, { useState } from 'react';
import { calculateOptimalCusp } from '../../utils/westernZodiac/optimalCuspCalculator';
import OptimalCuspDateDisplay from './OptimalCuspDateDisplay';

// ============================================================================
// MAIN PANEL COMPONENT (ENHANCED!)
// ============================================================================

const OptimalCuspDisplayPanel = ({ userCusp }) => {
  const [expandedSections, setExpandedSections] = useState({
    methodology: false,
    calculation: false,
    theory: false,
    breakdown: false
  });

  // Calculate optimal cusp
  const result = calculateOptimalCusp(userCusp);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700">
      
      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          🎯 Your Optimal Cusp Match
        </h3>
        <p className="text-slate-400 text-sm">
          Calculated using element harmony theory - like BaZi reverse engineering for Western Zodiac
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
              Mathematics you can verify yourself.
            </p>
          </div>
        </div>
      </div>

      {/* ===== YOUR CUSP (Input) ===== */}
      <YourCuspDisplay userCusp={userCusp} theory={result.theory} />

      {/* ===== OPTIMAL CUSP (Output) ===== */}
      <OptimalCuspResult optimalCusp={result.optimalCusp} score={result.score} />

      {/* ===== 🎯 DATE RANGES (NEW! PROMINENT!) ===== */}
      <div className="mb-6">
        <OptimalCuspDateDisplay 
          optimalCusp={result.optimalCusp}
          allCandidates={result.allCandidates}
        />
      </div>

      {/* ===== METHODOLOGY ===== */}
      <MethodologySection 
        methodology={result.methodology}
        isExpanded={expandedSections.methodology}
        onToggle={() => toggleSection('methodology')}
      />

      {/* ===== THEORY ===== */}
      <TheorySection
        theory={result.theory}
        isExpanded={expandedSections.theory}
        onToggle={() => toggleSection('theory')}
      />

      {/* ===== CALCULATION STEPS ===== */}
      <CalculationSection
        calculation={result.calculation}
        isExpanded={expandedSections.calculation}
        onToggle={() => toggleSection('calculation')}
      />

      {/* ===== DETAILED BREAKDOWN ===== */}
      <DetailedBreakdownSection
        breakdown={result.breakdown}
        isExpanded={expandedSections.breakdown}
        onToggle={() => toggleSection('breakdown')}
      />

    </div>
  );
};

// ============================================================================
// YOUR CUSP DISPLAY
// ============================================================================

const YourCuspDisplay = ({ userCusp, theory }) => {
  return (
    <div className="mb-6 bg-cyan-900/20 rounded-lg p-4 border border-cyan-700/40">
      <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
        <span>👤</span>
        <span>Your Cusp (Input)</span>
      </h4>
      <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg p-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{userCusp.name}</div>
          <div className="text-sm text-cyan-100 mb-2">{userCusp.dateRange}</div>
          <div className="inline-block bg-white/20 rounded px-3 py-1">
            <span className="text-white font-bold">{theory.userElement} Element</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// OPTIMAL CUSP RESULT (Compact - dates get their own section now)
// ============================================================================

const OptimalCuspResult = ({ optimalCusp, score }) => {
  const getTier = (score) => {
    if (score >= 90) return { name: 'Exceptional', icon: '💎', color: 'from-yellow-400 to-amber-500' };
    if (score >= 80) return { name: 'Excellent', icon: '⭐', color: 'from-purple-400 to-pink-500' };
    if (score >= 70) return { name: 'Very Good', icon: '✨', color: 'from-blue-400 to-cyan-500' };
    return { name: 'Good', icon: '○', color: 'from-gray-400 to-gray-500' };
  };

  const tier = getTier(score);

  return (
    <div className="mb-6 bg-pink-900/20 rounded-lg p-4 border border-pink-700/40">
      <h4 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
        <span>💎</span>
        <span>Optimal Cusp Match (Output)</span>
      </h4>
      <div className={`bg-gradient-to-br ${tier.color} rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {tier.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{optimalCusp.name}</div>
              <div className="text-sm text-white/80">{optimalCusp.element.primary} Element</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{score}</div>
            <div className="text-xs text-white/80">{tier.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// METHODOLOGY SECTION
// ============================================================================

const MethodologySection = ({ methodology, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full py-2 px-4 rounded-lg bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-700/30 transition-all flex items-center justify-between"
      >
        <span className="text-yellow-400 font-medium flex items-center gap-2">
          <span>📚</span>
          <span>Methodology</span>
        </span>
        <svg
          className={`w-4 h-4 text-yellow-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/40 space-y-3">
          <div>
            <h5 className="font-bold text-yellow-300 mb-2">{methodology.title}</h5>
            <p className="text-yellow-200 text-sm">{methodology.description}</p>
          </div>

          <div className="bg-slate-800/50 rounded p-3">
            <h6 className="font-bold text-yellow-300 mb-2 text-sm">Steps:</h6>
            <ol className="space-y-1 text-xs text-slate-300">
              {methodology.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// THEORY SECTION
// ============================================================================

const TheorySection = ({ theory, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between"
      >
        <span className="text-slate-300 font-medium flex items-center gap-2">
          <span>🎓</span>
          <span>Element Theory</span>
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
        <div className="mt-3 bg-slate-800/50 rounded-lg p-4 space-y-3">
          <div>
            <h5 className="font-bold text-white mb-2 text-sm">
              Why {theory.optimalElement} for {theory.userElement}?
            </h5>
            <p className="text-slate-300 text-xs">{theory.reasoning}</p>
          </div>

          <div className="bg-indigo-900/30 rounded p-3 border border-indigo-700/30">
            <h6 className="font-bold text-indigo-300 mb-1 text-xs">Theory:</h6>
            <p className="text-indigo-200 text-xs">{theory.theory}</p>
          </div>

          <div className="bg-purple-900/20 rounded p-3">
            <h6 className="font-bold text-purple-300 mb-1 text-xs">Examples:</h6>
            <ul className="space-y-1 text-xs text-purple-200">
              {theory.examples.map((example, idx) => (
                <li key={idx}>• {example}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CALCULATION SECTION
// ============================================================================

const CalculationSection = ({ calculation, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between"
      >
        <span className="text-slate-300 font-medium flex items-center gap-2">
          <span>📐</span>
          <span>Complete Calculation</span>
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
        <div className="mt-3 bg-slate-800/50 rounded-lg p-4 space-y-3">
          <div className="bg-slate-900/50 rounded p-3">
            <div className="text-slate-400 text-xs mb-1">Formula:</div>
            <div className="font-mono text-yellow-300 text-xs break-all">
              {calculation.formula}
            </div>
          </div>

          <div className="space-y-2">
            {calculation.steps.map((step, idx) => (
              <div key={idx} className="bg-slate-900/30 rounded p-2 text-xs">
                <div className="font-bold text-white mb-1">
                  Step {step.step}: {step.action}
                </div>
                {step.formula && (
                  <div className="font-mono text-yellow-300 mb-1">{step.formula}</div>
                )}
                <div className="text-cyan-400">Result: {step.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DETAILED BREAKDOWN SECTION
// ============================================================================

const DetailedBreakdownSection = ({ breakdown, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between"
      >
        <span className="text-slate-300 font-medium flex items-center gap-2">
          <span>📊</span>
          <span>Detailed Breakdown</span>
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
        <div className="mt-3 bg-slate-800/50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Element Harmony:</span>
              <span className="text-yellow-300 font-mono">{breakdown.element} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Quality/Modality:</span>
              <span className="text-yellow-300 font-mono">{breakdown.quality} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Planetary Rulers:</span>
              <span className="text-yellow-300 font-mono">{breakdown.rulers} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Astrological Aspect:</span>
              <span className="text-yellow-300 font-mono">{breakdown.aspect} pts</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2">
              <span className="text-white font-bold">Total Score:</span>
              <span className="text-white font-bold font-mono">{breakdown.finalScore} pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default OptimalCuspDisplayPanel;
