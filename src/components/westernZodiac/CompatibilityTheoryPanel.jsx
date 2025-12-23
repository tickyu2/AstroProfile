/**
 * CompatibilityTheoryPanel.jsx
 * 
 * UI Component to Display Complete Theoretical Foundation
 * Eliminates ALL Black Boxes!
 * 
 * Shows:
 * - What is BOOST? (with complete theory)
 * - Where does 86% come from? (with compatibility table)
 * - Separate calculation paths for each person
 * - Complete formula derivations
 * 
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * To be integrated into Brother Opus's CompatibilityBreakdownPanel
 */

import React, { useState } from 'react';

// ============================================================================
// MAIN THEORY PANEL COMPONENT
// ============================================================================

const CompatibilityTheoryPanel = ({ elementTheory, isExpanded, onToggle }) => {
  if (!elementTheory) return null;
  
  const [showCompatibilityTable, setShowCompatibilityTable] = useState(false);
  
  return (
    <div className="space-y-3">
      
      {/* ===== TOGGLE BUTTON ===== */}
      <button
        onClick={onToggle}
        className="w-full py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all flex items-center justify-between text-sm"
      >
        <span className="text-slate-300 font-medium">
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
      
      {/* ===== EXPANDED CONTENT ===== */}
      {isExpanded && (
        <div className="space-y-4">
          
          {/* ===== ASSUMPTIONS SECTION ===== */}
          <AssumptionsSection elementTheory={elementTheory} />
          
          {/* ===== STEP-BY-STEP CALCULATION ===== */}
          <StepByStepCalculation 
            elementTheory={elementTheory}
            showCompatibilityTable={showCompatibilityTable}
            onToggleTable={() => setShowCompatibilityTable(!showCompatibilityTable)}
          />
          
          {/* ===== YOUR CALCULATION PATH ===== */}
          <YourCalculationPath calculation={elementTheory.calculation} />
          
          {/* ===== PARTNER'S CALCULATION PATH ===== */}
          <PartnerCalculationPath calculation={elementTheory.calculation} />
          
          {/* ===== COMBINED TOTAL ===== */}
          <CombinedTotal calculation={elementTheory.calculation} />
          
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ASSUMPTIONS SECTION
// ============================================================================

const AssumptionsSection = ({ elementTheory }) => {
  return (
    <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700/40">
      <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
        <span>⚙️</span>
        <span>Assumptions</span>
      </h4>
      
      <div className="space-y-2 text-xs text-yellow-200">
        <div className="bg-slate-800/50 rounded p-3">
          <div className="font-bold mb-1">Primary Element weight: 35 out of 100 points</div>
          <div className="text-slate-300">
            Reason: Core energy is the foundation of compatibility - like Day Pillar in BaZi (70% in that system)
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded p-3">
          <div className="font-bold mb-1">Split: 50/50 between both people</div>
          <div className="text-slate-300">
            Each person contributes 50% based on their constitutional nature. Your score stays constant while partner's varies.
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STEP-BY-STEP CALCULATION
// ============================================================================

const StepByStepCalculation = ({ elementTheory, showCompatibilityTable, onToggleTable }) => {
  const calc = elementTheory.calculation;
  
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h4 className="font-bold text-slate-300 mb-3 flex items-center gap-2">
        <span>📐</span>
        <span>Step-by-Step Calculation</span>
      </h4>
      
      <div className="space-y-2 text-xs">
        
        {/* Formula */}
        <div className="bg-slate-900/50 rounded p-3">
          <div className="text-slate-400 mb-1">Formula:</div>
          <div className="font-mono text-yellow-300">
            (35 pts × compatibility %) ÷ 2 + (35 pts × compatibility %) ÷ 2
          </div>
        </div>
        
        {/* Steps */}
        <div className="space-y-1 text-slate-300">
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">1.</span>
            <span>Your primary element: <span className="text-cyan-400 font-bold">{calc.yourPath.step1.split(': ')[1]}</span></span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">2.</span>
            <span>Partner primary element: <span className="text-pink-400 font-bold">{calc.partnerPath.step1.split(': ')[1]}</span></span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">3.</span>
            <div className="flex-1">
              <div>
                <span>Interaction type: </span>
                <span className="text-green-400 font-bold">{elementTheory.relationshipName}</span>
              </div>
              
              {/* EXPLANATION OF WHAT THIS MEANS! (eliminates "BOOST" black box) */}
              <div className="mt-2 bg-indigo-900/30 rounded p-2 border border-indigo-700/30">
                <div className="text-indigo-300 font-bold mb-1">ℹ️ What is {elementTheory.relationshipName}?</div>
                <div className="text-indigo-200 text-xs space-y-1">
                  <div>{elementTheory.theory}</div>
                  <div className="italic text-indigo-300">
                    Natural example: {elementTheory.naturalExample}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">4.</span>
            <div className="flex-1">
              <div>
                <span>Base compatibility: </span>
                <span className="text-yellow-400 font-bold">{elementTheory.scorePercent}</span>
              </div>
              
              {/* SHOW WHERE THIS NUMBER COMES FROM! (eliminates "86%" black box) */}
              <button
                onClick={onToggleTable}
                className="mt-1 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                {showCompatibilityTable ? 'Hide' : 'Show'} compatibility table (where does {elementTheory.scorePercent} come from?)
              </button>
              
              {showCompatibilityTable && (
                <CompatibilityTable 
                  compatibilityTable={elementTheory.compatibilityTable}
                  currentType={elementTheory.relationshipType}
                />
              )}
              
              {/* SHOW THE FORMULA/DERIVATION */}
              {elementTheory.derivation && (
                <div className="mt-2 bg-purple-900/20 rounded p-2 border border-purple-700/30">
                  <div className="text-purple-300 font-bold mb-1">📊 Score Derivation:</div>
                  <div className="text-purple-200 text-xs space-y-1">
                    <div>Perfect compatibility: {elementTheory.derivation.perfectBase}%</div>
                    <div>Effort reduction: {elementTheory.derivation.effortReduction}%</div>
                    <div className="font-mono text-yellow-300">
                      = {elementTheory.derivation.finalScore}%
                    </div>
                    <div className="italic text-purple-300 mt-1">
                      {elementTheory.derivation.explanation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">5.</span>
            <span>Max points for Primary Element: <span className="font-mono text-yellow-300">{calc.maxPoints} pts</span></span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">6.</span>
            <span>Your contribution: {calc.maxPoints} pts ÷ 2 × {elementTheory.score} = <span className="font-mono text-cyan-400">{calc.combined.yourPoints} pts</span></span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 min-w-[20px]">7.</span>
            <span>Partner contribution: {calc.maxPoints} pts ÷ 2 × {elementTheory.score} = <span className="font-mono text-pink-400">{calc.combined.partnerPoints} pts</span></span>
          </div>
          
          <div className="flex items-start gap-2 pt-2 border-t border-slate-700">
            <span className="font-bold text-slate-400 min-w-[20px]">8.</span>
            <span>Total: {calc.combined.yourPoints} + {calc.combined.partnerPoints} = <span className="font-mono text-green-400 font-bold">{calc.combined.total} pts</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPATIBILITY TABLE (shows where 86% comes from!)
// ============================================================================

const CompatibilityTable = ({ compatibilityTable, currentType }) => {
  return (
    <div className="mt-2 bg-slate-900/70 rounded-lg p-3 border border-slate-600">
      <h5 className="text-xs font-bold text-slate-300 mb-2">
        📊 Complete Element Compatibility Matrix
      </h5>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-1 px-2 text-slate-400">Relationship</th>
              <th className="text-center py-1 px-2 text-slate-400">Type</th>
              <th className="text-center py-1 px-2 text-slate-400">Score</th>
              <th className="text-left py-1 px-2 text-slate-400">Formula</th>
            </tr>
          </thead>
          <tbody>
            {compatibilityTable.map((row) => (
              <tr 
                key={row.type}
                className={`border-b border-slate-800 ${
                  row.type === currentType ? 'bg-yellow-900/30' : ''
                }`}
              >
                <td className="py-1 px-2">
                  <span className={row.type === currentType ? 'font-bold text-yellow-400' : 'text-slate-300'}>
                    {row.name}
                  </span>
                  {row.type === currentType && (
                    <span className="ml-1 text-green-400">← You</span>
                  )}
                </td>
                <td className="text-center py-1 px-2">
                  <InteractionBadge type={row.interactionType} />
                </td>
                <td className="text-center py-1 px-2 font-mono text-yellow-300">
                  {row.scorePercent}
                </td>
                <td className="py-1 px-2 text-slate-400 text-xs">
                  {row.formula}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// YOUR CALCULATION PATH
// ============================================================================

const YourCalculationPath = ({ calculation }) => {
  const yourPath = calculation.yourPath;
  
  return (
    <div className="bg-cyan-900/20 rounded-lg p-4 border-2 border-cyan-700/40">
      <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
        <span>👤</span>
        <span>Your Contribution Calculation</span>
      </h4>
      
      <div className="space-y-2 text-xs text-cyan-200">
        <div><span className="font-bold">Step 1:</span> {yourPath.step1}</div>
        <div><span className="font-bold">Step 2:</span> {yourPath.step2}</div>
        <div><span className="font-bold">Step 3:</span> {yourPath.step3}</div>
        <div><span className="font-bold">Step 4:</span> {yourPath.step4}</div>
        <div><span className="font-bold">Step 5:</span> {yourPath.step5}</div>
        <div><span className="font-bold">Step 6:</span> {yourPath.step6}</div>
        <div className="pt-2 border-t border-cyan-700/40">
          <span className="font-bold">Result:</span> {yourPath.step7}
        </div>
        
        <div className="mt-3 bg-cyan-800/30 rounded p-3">
          <div className="text-sm font-bold text-white">
            YOUR CONTRIBUTION: {calculation.combined.yourPoints} pts (50%)
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PARTNER'S CALCULATION PATH
// ============================================================================

const PartnerCalculationPath = ({ calculation }) => {
  const partnerPath = calculation.partnerPath;
  
  return (
    <div className="bg-pink-900/20 rounded-lg p-4 border-2 border-pink-700/40">
      <h4 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
        <span>👥</span>
        <span>Partner's Contribution Calculation</span>
      </h4>
      
      <div className="space-y-2 text-xs text-pink-200">
        <div><span className="font-bold">Step 1:</span> {partnerPath.step1}</div>
        <div><span className="font-bold">Step 2:</span> {partnerPath.step2}</div>
        <div><span className="font-bold">Step 3:</span> {partnerPath.step3}</div>
        <div><span className="font-bold">Step 4:</span> {partnerPath.step4}</div>
        <div><span className="font-bold">Step 5:</span> {partnerPath.step5}</div>
        <div><span className="font-bold">Step 6:</span> {partnerPath.step6}</div>
        <div className="pt-2 border-t border-pink-700/40">
          <span className="font-bold">Result:</span> {partnerPath.step7}
        </div>
        
        <div className="mt-3 bg-pink-800/30 rounded p-3">
          <div className="text-sm font-bold text-white">
            PARTNER CONTRIBUTION: {calculation.combined.partnerPoints} pts (50%)
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMBINED TOTAL
// ============================================================================

const CombinedTotal = ({ calculation }) => {
  const combined = calculation.combined;
  
  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border-2 border-purple-500/40">
      <h4 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
        <span>🤝</span>
        <span>Combined Compatibility</span>
      </h4>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyan-900/30 rounded p-3 border border-cyan-700/40">
            <div className="text-xs text-cyan-400 mb-1">Your Contribution</div>
            <div className="text-2xl font-bold text-white">{combined.yourPoints} pts</div>
            <div className="text-xs text-cyan-300">(50% of total)</div>
          </div>
          
          <div className="bg-pink-900/30 rounded p-3 border border-pink-700/40">
            <div className="text-xs text-pink-400 mb-1">Partner Contribution</div>
            <div className="text-2xl font-bold text-white">{combined.partnerPoints} pts</div>
            <div className="text-xs text-pink-300">(50% of total)</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-700/30 to-pink-700/30 rounded p-4 border border-purple-500/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-purple-200">Calculation:</span>
            <span className="font-mono text-yellow-300">{combined.formula}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-purple-200">Total Score:</span>
            <span className="text-4xl font-bold text-white">{combined.total} pts</span>
          </div>
          
          <div className="text-xs text-purple-300 mt-2">
            Out of maximum: {calculation.maxPoints} pts = {combined.percentage}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const InteractionBadge = ({ type }) => {
  const colors = {
    synergy: 'bg-green-900/50 text-green-300',
    boost: 'bg-blue-900/50 text-blue-300',
    complement: 'bg-purple-900/50 text-purple-300',
    neutral: 'bg-gray-900/50 text-gray-300',
    friction: 'bg-orange-900/50 text-orange-300'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${colors[type] || colors.neutral}`}>
      {type}
    </span>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default CompatibilityTheoryPanel;
