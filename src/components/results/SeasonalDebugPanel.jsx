import React, { useState } from 'react';
import { calculateWithComparison, calculateWithTrueSeason, formatElementName, getElementColor } from '../../utils/seasonalStrength';

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

export default function SeasonalDebugPanel({ fourPillars, profile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!fourPillars) {
    return <div className="text-gray-400">No Four Pillars data available</div>;
  }
  
  // Calculate true birth season from profile.birthDate (same logic as SeasonalStrengthPanel)
  let trueBirthSeason = null;
  
  if (profile?.birthDate) {
    const birthDate = new Date(profile.birthDate);
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    
    if ((birthMonth === 2 && birthDay >= 4) || (birthMonth === 3) || (birthMonth === 4 && birthDay <= 16)) {
      trueBirthSeason = { 
        name: 'Spring', 
        icon: '🌸',
        multipliers: { Wood: 1.5, Fire: 1.2, Water: 0.8, Earth: 0.5, Metal: 0.2 }
      };
    } else if ((birthMonth === 4 && birthDay >= 17) || (birthMonth === 5 && birthDay <= 5)) {
      trueBirthSeason = { 
        name: 'Dragon (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      };
    } else if ((birthMonth === 5 && birthDay >= 6) || (birthMonth === 6) || (birthMonth === 7 && birthDay <= 19)) {
      trueBirthSeason = { 
        name: 'Summer', 
        icon: '☀️',
        multipliers: { Fire: 1.5, Earth: 1.2, Wood: 0.8, Metal: 0.5, Water: 0.2 }
      };
    } else if ((birthMonth === 7 && birthDay >= 20) || (birthMonth === 8 && birthDay <= 7)) {
      trueBirthSeason = { 
        name: 'Goat (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      };
    } else if ((birthMonth === 8 && birthDay >= 8) || (birthMonth === 9) || (birthMonth === 10 && birthDay <= 19)) {
      trueBirthSeason = { 
        name: 'Autumn', 
        icon: '🍂',
        multipliers: { Metal: 1.5, Water: 1.2, Earth: 0.8, Wood: 0.2, Fire: 0.5 }
      };
    } else if ((birthMonth === 10 && birthDay >= 20) || (birthMonth === 11 && birthDay <= 7)) {
      trueBirthSeason = { 
        name: 'Dog (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      };
    } else if ((birthMonth === 11 && birthDay >= 8) || (birthMonth === 12) || (birthMonth === 1 && birthDay <= 16)) {
      trueBirthSeason = { 
        name: 'Winter', 
        icon: '❄️',
        multipliers: { Water: 1.5, Wood: 1.2, Metal: 0.8, Fire: 0.2, Earth: 0.5 }
      };
    } else if ((birthMonth === 1 && birthDay >= 17) || (birthMonth === 2 && birthDay <= 3)) {
      trueBirthSeason = { 
        name: 'Ox (Earth Transition)', 
        icon: '🏔️',
        multipliers: { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 }
      };
    }
  }
  
  // Use trueBirthSeason if available, otherwise fall back to default
  const result = trueBirthSeason 
    ? calculateWithTrueSeason(fourPillars, trueBirthSeason)
    : calculateWithComparison(fourPillars);
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
          
          {/* Step 0: Four Pillars Breakdown (NEW!) */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded p-4">
            <div className="font-bold text-blue-300 mb-3 flex items-center gap-2">
              🔍 Your Four Pillars Breakdown
              <span className="text-xs text-blue-400 font-normal">(How we get the raw counts)</span>
            </div>
            
            {/* Pillars Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-slate-700">
                <thead>
                  <tr className="bg-slate-800/50 text-blue-300">
                    <th className="text-left py-2 px-3 border-r border-slate-700">Pillar</th>
                    <th className="text-left py-2 px-3 border-r border-slate-700">Stem (天干)</th>
                    <th className="text-left py-2 px-3 border-r border-slate-700">Branch (地支)</th>
                    <th className="text-center py-2 px-3">Weight</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 border-r border-slate-700 text-gray-400">Year</td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.year.stem.chinese} {fourPillars.year.stem.name}
                      <div className="text-xs text-gray-500">({fourPillars.year.stem.element})</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.year.branch.chinese} {fourPillars.year.branch.animal}
                      <div className="text-xs text-gray-500">({fourPillars.year.branch.element})</div>
                    </td>
                    <td className="text-center py-2 px-3 text-yellow-400 font-mono">5%</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 border-r border-slate-700 text-gray-400">Month</td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.month.stem.chinese} {fourPillars.month.stem.name}
                      <div className="text-xs text-gray-500">({fourPillars.month.stem.element})</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.month.branch.chinese} {fourPillars.month.branch.animal}
                      <div className="text-xs text-gray-500">({fourPillars.month.branch.element})</div>
                    </td>
                    <td className="text-center py-2 px-3 text-yellow-400 font-mono">10%</td>
                  </tr>
                  <tr className="border-b border-slate-700 bg-purple-900/20">
                    <td className="py-2 px-3 border-r border-slate-700 text-purple-300 font-bold">Day ⭐</td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.day.stem.chinese} {fourPillars.day.stem.name}
                      <div className="text-xs text-purple-400 font-semibold">({fourPillars.day.stem.element}) ← YOU!</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.day.branch.chinese} {fourPillars.day.branch.animal}
                      <div className="text-xs text-gray-500">({fourPillars.day.branch.element})</div>
                    </td>
                    <td className="text-center py-2 px-3 text-purple-300 font-mono font-bold">70%</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 border-r border-slate-700 text-gray-400">Hour</td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.hour.stem.chinese} {fourPillars.hour.stem.name}
                      <div className="text-xs text-gray-500">({fourPillars.hour.stem.element})</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-700">
                      {fourPillars.hour.branch.chinese} {fourPillars.hour.branch.animal}
                      <div className="text-xs text-gray-500">({fourPillars.hour.branch.element})</div>
                    </td>
                    <td className="text-center py-2 px-3 text-yellow-400 font-mono">15%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Calculation Examples */}
            <div className="bg-slate-800/50 rounded p-3 space-y-3">
              <div className="text-xs text-blue-300 font-bold mb-2">💡 Step-by-Step Calculation:</div>
              
              {/* Step 1: Mark which elements appear */}
              <div>
                <div className="text-xs text-yellow-400 font-semibold mb-2">Step 1: Mark where each element appears (1 = present, blank = absent)</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-600">
                    <thead>
                      <tr className="bg-slate-700 text-gray-300">
                        <th className="py-1 px-2 border-r border-slate-600">Pillar</th>
                        <th colSpan="5" className="py-1 px-2 border-r border-slate-600 text-center">Stem (天干)</th>
                        <th colSpan="5" className="py-1 px-2 text-center">Branch (地支)</th>
                      </tr>
                      <tr className="bg-slate-700/50 text-gray-400 text-[10px]">
                        <th className="py-1 px-1 border-r border-slate-600"></th>
                        <th className="py-1 px-1">🌳</th>
                        <th className="py-1 px-1">🔥</th>
                        <th className="py-1 px-1">⛰️</th>
                        <th className="py-1 px-1">⚙️</th>
                        <th className="py-1 px-1 border-r border-slate-600">💧</th>
                        <th className="py-1 px-1">🌳</th>
                        <th className="py-1 px-1">🔥</th>
                        <th className="py-1 px-1">⛰️</th>
                        <th className="py-1 px-1">⚙️</th>
                        <th className="py-1 px-1">💧</th>
                      </tr>
                    </thead>
                    <tbody className="text-center font-mono">
                      <tr className="border-t border-slate-600">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-gray-400">Year</td>
                        <td className="py-1">{fourPillars.year.stem.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.year.stem.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.year.stem.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1 text-yellow-400">{fourPillars.year.stem.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.year.stem.element === 'Water' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1 text-blue-400">{fourPillars.year.branch.element === 'Water' ? '1' : ''}</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-gray-400">Month</td>
                        <td className="py-1">{fourPillars.month.stem.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1 text-red-400">{fourPillars.month.stem.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1 text-yellow-600">{fourPillars.month.stem.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.month.stem.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.month.stem.element === 'Water' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1 text-blue-400">{fourPillars.month.branch.element === 'Water' ? '1' : ''}</td>
                      </tr>
                      <tr className="border-t border-slate-600 bg-purple-900/30">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-purple-300 font-bold">Day ⭐</td>
                        <td className="py-1 text-emerald-400 font-bold">{fourPillars.day.stem.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.stem.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.stem.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.stem.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.day.stem.element === 'Water' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1 text-yellow-600">{fourPillars.day.branch.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Water' ? '1' : ''}</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-gray-400">Hour</td>
                        <td className="py-1 text-emerald-400">{fourPillars.hour.stem.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1 text-red-400">{fourPillars.hour.stem.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.hour.stem.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.hour.stem.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.hour.stem.element === 'Water' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Wood' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Fire' ? '1' : ''}</td>
                        <td className="py-1 text-yellow-600">{fourPillars.hour.branch.element === 'Earth' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Metal' ? '1' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Water' ? '1' : ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 2: Multiply by weights */}
              <div>
                <div className="text-xs text-yellow-400 font-semibold mb-2">Step 2: Multiply each "1" by its pillar weight</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-600">
                    <thead>
                      <tr className="bg-slate-700 text-gray-300">
                        <th className="py-1 px-2 border-r border-slate-600">Pillar</th>
                        <th colSpan="5" className="py-1 px-2 border-r border-slate-600 text-center">Stem × Weight</th>
                        <th colSpan="5" className="py-1 px-2 text-center">Branch × Weight</th>
                      </tr>
                      <tr className="bg-slate-700/50 text-gray-400 text-[10px]">
                        <th className="py-1 px-1 border-r border-slate-600"></th>
                        <th className="py-1 px-1">🌳</th>
                        <th className="py-1 px-1">🔥</th>
                        <th className="py-1 px-1">⛰️</th>
                        <th className="py-1 px-1">⚙️</th>
                        <th className="py-1 px-1 border-r border-slate-600">💧</th>
                        <th className="py-1 px-1">🌳</th>
                        <th className="py-1 px-1">🔥</th>
                        <th className="py-1 px-1">⛰️</th>
                        <th className="py-1 px-1">⚙️</th>
                        <th className="py-1 px-1">💧</th>
                      </tr>
                    </thead>
                    <tbody className="text-center font-mono text-[10px]">
                      <tr className="border-t border-slate-600">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-gray-400">Year (5%)</td>
                        <td className="py-1">{fourPillars.year.stem.element === 'Wood' ? '0.05' : ''}</td>
                        <td className="py-1">{fourPillars.year.stem.element === 'Fire' ? '0.05' : ''}</td>
                        <td className="py-1">{fourPillars.year.stem.element === 'Earth' ? '0.05' : ''}</td>
                        <td className="py-1 text-yellow-400">{fourPillars.year.stem.element === 'Metal' ? '0.05' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.year.stem.element === 'Water' ? '0.05' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Wood' ? '0.05' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Fire' ? '0.05' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Earth' ? '0.05' : ''}</td>
                        <td className="py-1">{fourPillars.year.branch.element === 'Metal' ? '0.05' : ''}</td>
                        <td className="py-1 text-blue-400">{fourPillars.year.branch.element === 'Water' ? '0.05' : ''}</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-gray-400">Month (10%)</td>
                        <td className="py-1">{fourPillars.month.stem.element === 'Wood' ? '0.10' : ''}</td>
                        <td className="py-1 text-red-400">{fourPillars.month.stem.element === 'Fire' ? '0.10' : ''}</td>
                        <td className="py-1 text-yellow-600">{fourPillars.month.stem.element === 'Earth' ? '0.10' : ''}</td>
                        <td className="py-1">{fourPillars.month.stem.element === 'Metal' ? '0.10' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.month.stem.element === 'Water' ? '0.10' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Wood' ? '0.10' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Fire' ? '0.10' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Earth' ? '0.10' : ''}</td>
                        <td className="py-1">{fourPillars.month.branch.element === 'Metal' ? '0.10' : ''}</td>
                        <td className="py-1 text-blue-400">{fourPillars.month.branch.element === 'Water' ? '0.10' : ''}</td>
                      </tr>
                      <tr className="border-t border-slate-600 bg-purple-900/30">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-purple-300 font-bold">Day (70%) ⭐</td>
                        <td className="py-1 text-emerald-400 font-bold">{fourPillars.day.stem.element === 'Wood' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.stem.element === 'Fire' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.stem.element === 'Earth' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.stem.element === 'Metal' ? '0.70' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.day.stem.element === 'Water' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Wood' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Fire' ? '0.70' : ''}</td>
                        <td className="py-1 text-yellow-600">{fourPillars.day.branch.element === 'Earth' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Metal' ? '0.70' : ''}</td>
                        <td className="py-1">{fourPillars.day.branch.element === 'Water' ? '0.70' : ''}</td>
                      </tr>
                      <tr className="border-t border-slate-600">
                        <td className="py-1 px-2 text-left border-r border-slate-600 text-gray-400">Hour (15%)</td>
                        <td className="py-1 text-emerald-400">{fourPillars.hour.stem.element === 'Wood' ? '0.15' : ''}</td>
                        <td className="py-1 text-red-400">{fourPillars.hour.stem.element === 'Fire' ? '0.15' : ''}</td>
                        <td className="py-1">{fourPillars.hour.stem.element === 'Earth' ? '0.15' : ''}</td>
                        <td className="py-1">{fourPillars.hour.stem.element === 'Metal' ? '0.15' : ''}</td>
                        <td className="py-1 border-r border-slate-600">{fourPillars.hour.stem.element === 'Water' ? '0.15' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Wood' ? '0.15' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Fire' ? '0.15' : ''}</td>
                        <td className="py-1 text-yellow-600">{fourPillars.hour.branch.element === 'Earth' ? '0.15' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Metal' ? '0.15' : ''}</td>
                        <td className="py-1">{fourPillars.hour.branch.element === 'Water' ? '0.15' : ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 3: Add stem + branch for each element */}
              <div>
                <div className="text-xs text-yellow-400 font-semibold mb-2">Step 3: Add Stem + Branch for each element (Traditional Cycle Order)</div>
                <div className="text-[11px] text-gray-300 space-y-1 font-mono">
                  {(() => {
                    const stemSums = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
                    const branchSums = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
                    const weights = { year: 0.05, month: 0.10, day: 0.70, hour: 0.15 };
                    
                    ['year', 'month', 'day', 'hour'].forEach(pillar => {
                      stemSums[fourPillars[pillar].stem.element] += weights[pillar];
                      branchSums[fourPillars[pillar].branch.element] += weights[pillar];
                    });
                    
                    // Traditional cycle order: Wood → Fire → Earth → Metal → Water
                    const cycleOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
                    
                    return cycleOrder.map(element => {
                      const stemVal = stemSums[element];
                      const branchVal = branchSums[element];
                      const total = debug.rawCounts[element];
                      const icon = element === 'Wood' ? '🌳' : element === 'Fire' ? '🔥' : element === 'Earth' ? '⛰️' : element === 'Metal' ? '⚙️' : '💧';
                      
                      return (
                        <div key={element} className="flex items-center gap-2">
                          <span className="w-16">{icon} {element}:</span>
                          <span className="text-blue-300">{stemVal.toFixed(2)}</span>
                          <span className="text-gray-500">+</span>
                          <span className="text-green-300">{branchVal.toFixed(2)}</span>
                          <span className="text-gray-500">=</span>
                          <span className="text-yellow-400 font-bold">{total.toFixed(3)}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Final note */}
              <div className="pt-2 border-t border-slate-700">
                <div className="text-xs text-emerald-400">
                  ✅ These are your RAW counts (not seasonally adjusted yet!)
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Next step: multiply by seasonal multipliers to get your TRUE elemental strength.
                </div>
              </div>
            </div>
          </div>
          
          {/* NEW: Metaphor Identity Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-400/50 rounded-lg p-5">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-2">
                {(() => {
                  const dominant = adjusted.percentages;
                  const sorted = Object.entries(dominant).sort((a, b) => b[1] - a[1]);
                  const top = sorted[0][0];
                  const topPercent = sorted[0][1].toFixed(0);
                  
                  return `YOU ARE ${topPercent}% ${top.toUpperCase()}`;
                })()}
              </div>
              <div className="text-sm text-gray-400">Your Constitutional Metaphor</div>
            </div>
            
            {(() => {
              const dominant = adjusted.percentages;
              const sorted = Object.entries(dominant).sort((a, b) => b[1] - a[1]);
              const primaryElement = sorted[0][0];
              const primaryPercent = sorted[0][1];
              const secondaryElement = sorted[1][0];
              const secondaryPercent = sorted[1][1];
              const weakestElement = sorted[sorted.length - 1][0];
              const weakestPercent = sorted[sorted.length - 1][1];
              
              // Metaphor definitions
              const metaphors = {
                Wood: {
                  icon: '🌳',
                  title: 'The Tree',
                  nature: 'You are growth, structure, and strategic vision. Like a tree, you expand upward and outward, providing shade and support.',
                  gifts: ['Strategic planning', 'Patient growth', 'Structural thinking', 'Long-term vision'],
                  needs: primaryPercent > 60 ? ['🔥 Fire to bring warmth and activation', '💧 Water to stay nourished', '⛰️ Earth to ground your growth'] : ['💧 Water for nourishment', '⚙️ Metal for boundaries'],
                  without: 'Unlit potential - brilliant structure with no spark'
                },
                Fire: {
                  icon: '🔥',
                  title: 'The Flame',
                  nature: 'You are energy, transformation, and charisma. Like fire, you ignite ideas, attract attention, and change everything you touch.',
                  gifts: ['Instant activation', 'Transformative energy', 'Magnetic presence', 'Rapid execution'],
                  needs: primaryPercent > 60 ? ['🌳 Wood to provide sustainable fuel', '⛰️ Earth to contain your power', '💧 Water to prevent burnout'] : ['🌳 Wood for direction', '⛰️ Earth for focus'],
                  without: 'Unfocused energy - brilliant spark that burns without purpose'
                },
                Earth: {
                  icon: '⛰️',
                  title: 'The Mountain',
                  nature: 'You are stability, support, and foundation. Like a mountain, you provide solid ground for others to build upon.',
                  gifts: ['Reliable foundation', 'Nurturing support', 'Practical wisdom', 'Stabilizing presence'],
                  needs: primaryPercent > 60 ? ['🔥 Fire for warmth and energy', '⚙️ Metal for internal structure', '🌳 Wood for growth'] : ['🔥 Fire for activation', '⚙️ Metal for definition'],
                  without: 'Dormant potential - strong foundation waiting to support something'
                },
                Metal: {
                  icon: '⚙️',
                  title: 'The Blade',
                  nature: 'You are precision, refinement, and cutting clarity. Like a blade, you cut through confusion and bring sharp focus.',
                  gifts: ['Precise execution', 'Clear boundaries', 'Refined judgment', 'Cutting analysis'],
                  needs: primaryPercent > 60 ? ['⛰️ Earth as ore source', '💧 Water to polish and cool', '🔥 Fire for tempering'] : ['⛰️ Earth for grounding', '💧 Water for flow'],
                  without: 'Dull potential - sharp mind needing polish and purpose'
                },
                Water: {
                  icon: '💧',
                  title: 'The River',
                  nature: 'You are flow, adaptation, and wisdom. Like water, you find paths around obstacles and adapt to any container.',
                  gifts: ['Adaptive intelligence', 'Emotional depth', 'Strategic patience', 'Finding hidden paths'],
                  needs: primaryPercent > 60 ? ['⚙️ Metal to channel your flow', '🌳 Wood to give direction', '⛰️ Earth as boundaries'] : ['⚙️ Metal for structure', '🌳 Wood for growth'],
                  without: 'Stagnant potential - deep wisdom needing direction'
                }
              };
              
              const meta = metaphors[primaryElement];
              const weakMeta = metaphors[weakestElement];
              
              return (
                <div className="space-y-4">
                  {/* Primary Metaphor */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-4xl">{meta.icon}</div>
                      <div>
                        <div className="text-lg font-bold text-white">{meta.title}</div>
                        <div className="text-xs text-gray-400">Your Primary Nature ({primaryPercent.toFixed(0)}%)</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-3 leading-relaxed">
                      {meta.nature}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-emerald-400 font-semibold mb-1">Your Gifts:</div>
                        <ul className="space-y-1 text-gray-400">
                          {meta.gifts.map((gift, i) => (
                            <li key={i}>• {gift}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-blue-400 font-semibold mb-1">You Need:</div>
                        <ul className="space-y-1 text-gray-400">
                          {meta.needs.map((need, i) => (
                            <li key={i}>• {need}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Secondary Element */}
                  {secondaryPercent > 10 && (
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <div className="text-sm text-gray-300">
                        <span className="text-blue-300 font-semibold">+ {secondaryPercent.toFixed(0)}% {secondaryElement}</span>
                        {' '}provides {secondaryElement === 'Wood' ? 'structure and growth' : 
                                      secondaryElement === 'Fire' ? 'energy and warmth' :
                                      secondaryElement === 'Earth' ? 'stability and grounding' :
                                      secondaryElement === 'Metal' ? 'precision and boundaries' :
                                      'flow and adaptation'} to balance your {primaryElement} nature.
                      </div>
                    </div>
                  )}
                  
                  {/* Weakest Element Warning */}
                  {weakestPercent < 5 && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <div className="text-sm">
                        <span className="text-red-400 font-semibold">⚠️ Missing {weakestElement} ({weakestPercent.toFixed(1)}%)</span>
                        <div className="text-gray-400 mt-1">
                          {weakMeta.without}. You need {weakestElement} partners or practices to complete yourself.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
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
