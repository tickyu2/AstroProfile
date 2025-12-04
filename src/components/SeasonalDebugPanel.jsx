import React, { useState } from 'react';
import { calculateWithComparison, formatElementName, getElementColor } from '../utils/seasonalStrength';

/**
 * ═══════════════════════════════════════════════════════════════
 * SEASONAL STRENGTH DEBUG PANEL
 * ═══════════════════════════════════════════════════════════════
 * 
 * Displays:
 * 1. Season detection
 * 2. Raw vs Adjusted comparison
 * 3. Multiplier table
 * 4. Step-by-step calculation
 * 5. Final percentages
 * 
 * This helps you SEE what's happening!
 */

export default function SeasonalDebugPanel({ fourPillars }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!fourPillars) {
    return <div className="text-gray-400">No Four Pillars data available</div>;
  }
  
  const result = calculateWithComparison(fourPillars);
  const { raw, adjusted, debug, comparison } = result;
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-300">
          🔍 Seasonal Strength Calculator (五行旺衰)
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          {isExpanded ? '▼ Hide Details' : '▶ Show Details'}
        </button>
      </div>
      
      {/* Season Info */}
      <div className="bg-slate-900/50 rounded p-4 mb-4">
        <div className="text-lg font-semibold text-white mb-2">
          Birth Season: {debug.season.name}
        </div>
        <div className="text-sm text-gray-400">
          Month Branch: {debug.season.animal} ({debug.season.season})
        </div>
      </div>
      
      {/* Comparison Table */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* RAW (Wrong) */}
        <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
          <div className="text-sm font-bold text-red-400 mb-3">
            {raw.label}
          </div>
          {Object.entries(raw.percentages)
            .sort((a, b) => b[1] - a[1])
            .map(([element, percent]) => (
              <div key={element} className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">{formatElementName(element)}</span>
                <span className="text-sm font-mono text-white">{percent.toFixed(1)}%</span>
              </div>
            ))}
        </div>
        
        {/* ADJUSTED (Correct) */}
        <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
          <div className="text-sm font-bold text-green-400 mb-3">
            {adjusted.label}
          </div>
          {Object.entries(adjusted.percentages)
            .sort((a, b) => b[1] - a[1])
            .map(([element, percent]) => (
              <div key={element} className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">{formatElementName(element)}</span>
                <span className="text-sm font-mono text-white">{percent.toFixed(1)}%</span>
              </div>
            ))}
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 mt-4 border-t border-slate-700 pt-4">
          
          {/* Step 1: Raw Counts */}
          <div className="bg-slate-900/30 rounded p-4">
            <div className="font-bold text-purple-300 mb-3">Step 1: Count Elements (Weighted)</div>
            <div className="text-xs text-gray-400 mb-2">{debug.calculations.explanation}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-slate-700">
                  <th className="text-left py-2">Element</th>
                  <th className="text-right py-2">Raw Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(debug.rawCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([element, count]) => (
                    <tr key={element} className="border-b border-slate-800">
                      <td className="py-2 text-gray-300">{formatElementName(element)}</td>
                      <td className="text-right font-mono text-white">{count.toFixed(3)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          
          {/* Step 2: Apply Multipliers */}
          <div className="bg-slate-900/30 rounded p-4">
            <div className="font-bold text-purple-300 mb-3">Step 2: Apply Seasonal Multipliers</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-slate-700">
                  <th className="text-left py-2">Element</th>
                  <th className="text-center py-2">Raw</th>
                  <th className="text-center py-2">× Multiplier</th>
                  <th className="text-center py-2">= Adjusted</th>
                  <th className="text-left py-2">Qi State</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(debug.elementDetails)
                  .sort((a, b) => b[1].adjusted - a[1].adjusted)
                  .map(([element, details]) => {
                    const colorClass = details.multiplier >= 1.2 ? 'text-green-400' : 
                                      details.multiplier >= 0.8 ? 'text-yellow-400' : 
                                      'text-red-400';
                    return (
                      <tr key={element} className="border-b border-slate-800">
                        <td className="py-2 text-gray-300">{formatElementName(element)}</td>
                        <td className="text-center font-mono text-white">{details.raw.toFixed(3)}</td>
                        <td className={`text-center font-mono font-bold ${colorClass}`}>
                          × {details.multiplier}
                        </td>
                        <td className="text-center font-mono text-white">{details.adjusted.toFixed(3)}</td>
                        <td className={`text-xs ${colorClass}`}>{details.qiState}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          
          {/* Step 3: Final Percentages */}
          <div className="bg-slate-900/30 rounded p-4">
            <div className="font-bold text-purple-300 mb-3">Step 3: Calculate Percentages</div>
            <div className="text-xs text-gray-400 mb-3">
              Total Adjusted: {debug.totalAdjusted.toFixed(3)}
            </div>
            {Object.entries(adjusted.percentages)
              .sort((a, b) => b[1] - a[1])
              .map(([element, percent]) => {
                const width = percent;
                return (
                  <div key={element} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{formatElementName(element)}</span>
                      <span className="font-mono font-bold text-white">{percent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${width}%`,
                          backgroundColor: getElementColor(element)
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          
          {/* Explanation */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
            <div className="text-sm text-blue-300">
              <strong>💡 Key Insight:</strong> {comparison.message}
            </div>
            <div className="text-xs text-blue-400 mt-2">
              {comparison.example}
            </div>
          </div>
          
        </div>
      )}
      
      {/* Quick Summary */}
      {!isExpanded && (
        <div className="text-center text-sm text-gray-400 mt-2">
          Click "Show Details" to see step-by-step calculations
        </div>
      )}
    </div>
  );
}
