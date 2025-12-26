/**
 * ============================================
 * BAZI CALCULATOR PAGE
 * "What If" Historical Date Calculator
 * ============================================
 *
 * Input a start date and number of days to see
 * the BaZi pillars (Year, Month, Day) for each date.
 *
 * Created: December 24, 2025
 * For Father Ticky
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from '../utils/fourPillarsCalculator';

// Element colors for visual display
const ELEMENT_COLORS = {
  Wood: { bg: 'bg-green-900/50', text: 'text-green-400', border: 'border-green-500/30' },
  Fire: { bg: 'bg-red-900/50', text: 'text-red-400', border: 'border-red-500/30' },
  Earth: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Metal: { bg: 'bg-gray-700/50', text: 'text-gray-300', border: 'border-gray-500/30' },
  Water: { bg: 'bg-blue-900/50', text: 'text-blue-400', border: 'border-blue-500/30' }
};

// Element emoji
const ELEMENT_EMOJI = {
  Wood: '🌳',
  Fire: '🔥',
  Earth: '🏔️',
  Metal: '⚔️',
  Water: '💧'
};

export default function BaZiCalculatorPage() {
  // Form state
  const [startDate, setStartDate] = useState('1873-03-15');
  const [numDays, setNumDays] = useState(10);
  const [results, setResults] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate pillars for the date range
  const handleCalculate = () => {
    setIsCalculating(true);

    try {
      const [year, month, day] = startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day, 12, 0, 0); // noon to avoid timezone issues

      const newResults = [];

      for (let i = 0; i < numDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);

        // Calculate pillars
        const yearPillar = calculateYearPillar(currentDate);
        const monthPillar = calculateMonthPillar(currentDate, yearPillar.stem);
        const dayPillar = calculateDayPillar(currentDate);

        newResults.push({
          date: currentDate,
          dateStr: currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
          }),
          yearPillar,
          monthPillar,
          dayPillar
        });
      }

      setResults(newResults);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Pillar cell component
  const PillarCell = ({ pillar, showAnimal = true }) => {
    const stemColor = ELEMENT_COLORS[pillar.stem.element];
    const branchColor = ELEMENT_COLORS[pillar.branch.element];

    return (
      <div className="flex flex-col items-center gap-1">
        {/* Chinese characters */}
        <div className="flex gap-1">
          <span className={`text-xl font-bold ${stemColor.text}`} title={pillar.stem.name}>
            {pillar.stem.chinese}
          </span>
          <span className={`text-xl font-bold ${branchColor.text}`} title={pillar.branch.animal}>
            {pillar.branch.chinese}
          </span>
        </div>

        {/* Elements */}
        <div className="flex gap-1 text-xs">
          <span className={`px-1.5 py-0.5 rounded ${stemColor.bg} ${stemColor.text}`}>
            {ELEMENT_EMOJI[pillar.stem.element]} {pillar.stem.element}
          </span>
          <span className={`px-1.5 py-0.5 rounded ${branchColor.bg} ${branchColor.text}`}>
            {ELEMENT_EMOJI[pillar.branch.element]} {pillar.branch.element}
          </span>
        </div>

        {/* English name */}
        <div className="text-[10px] text-slate-400 text-center">
          {pillar.stem.name}
          {showAnimal && <span className="block">{pillar.branch.animal}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                ← Dashboard
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                🧮 BaZi Calculator
              </h1>
            </div>
            <div className="text-sm text-slate-400">
              "What If" Date Explorer
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Calculate BaZi Pillars</h2>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Number of Days</label>
              <input
                type="number"
                value={numDays}
                onChange={(e) => setNumDays(Math.min(365, Math.max(1, parseInt(e.target.value) || 1)))}
                min="1"
                max="365"
                className="w-24 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : '🔮 Calculate'}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Enter any date from history (e.g., 1873-03-15) and see the BaZi pillars for that date range.
            Year pillar changes at Spring Begins (~Feb 4), Month pillar follows Solar Terms.
          </p>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">
                BaZi Pillars: {results[0].dateStr} → {results[results.length - 1].dateStr}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {results.length} days calculated
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Date</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-amber-400">
                      <div className="flex flex-col items-center">
                        <span>Year Pillar</span>
                        <span className="text-[10px] text-slate-500">年柱</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-cyan-400">
                      <div className="flex flex-col items-center">
                        <span>Month Pillar</span>
                        <span className="text-[10px] text-slate-500">月柱</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-purple-400">
                      <div className="flex flex-col items-center">
                        <span>Day Pillar ⭐</span>
                        <span className="text-[10px] text-slate-500">日柱 (Day Master)</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-400">
                      <div className="flex flex-col items-center">
                        <span>Combined</span>
                        <span className="text-[10px] text-slate-500">三柱</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {results.map((row, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-slate-700/30 transition-colors ${
                        row.date.getDay() === 0 || row.date.getDay() === 6
                          ? 'bg-slate-800/30'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{row.dateStr}</div>
                        <div className="text-[10px] text-slate-500">
                          Day #{index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <PillarCell pillar={row.yearPillar} />
                      </td>
                      <td className="px-4 py-3">
                        <PillarCell pillar={row.monthPillar} />
                      </td>
                      <td className="px-4 py-3 bg-purple-900/10">
                        <PillarCell pillar={row.dayPillar} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                          <span className={ELEMENT_COLORS[row.yearPillar.stem.element].text}>
                            {row.yearPillar.fullName}
                          </span>
                          <span className={ELEMENT_COLORS[row.monthPillar.stem.element].text}>
                            {row.monthPillar.fullName}
                          </span>
                          <span className={ELEMENT_COLORS[row.dayPillar.stem.element].text}>
                            {row.dayPillar.fullName}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Element Legend */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Element Reference</h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(ELEMENT_COLORS).map(([element, colors]) => (
              <div key={element} className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                <div className="text-2xl mb-1">{ELEMENT_EMOJI[element]}</div>
                <div className={`font-semibold ${colors.text}`}>{element}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {element === 'Wood' && '木 - Growth, Creativity'}
                  {element === 'Fire' && '火 - Passion, Expression'}
                  {element === 'Earth' && '土 - Stability, Nurturing'}
                  {element === 'Metal' && '金 - Structure, Precision'}
                  {element === 'Water' && '水 - Wisdom, Adaptability'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">📚 About BaZi Pillars</h3>
          <div className="text-sm text-slate-300 space-y-2">
            <p>
              <strong className="text-amber-400">Year Pillar (年柱)</strong>: Represents ancestral energy and social persona.
              Changes at Spring Begins (立春, ~Feb 4), NOT Chinese New Year.
            </p>
            <p>
              <strong className="text-cyan-400">Month Pillar (月柱)</strong>: Represents seasonal influence and career/parents.
              Follows the 24 Solar Terms, changing roughly every 15 days.
            </p>
            <p>
              <strong className="text-purple-400">Day Pillar (日柱)</strong>: The Day Master - your core soul essence! ⭐
              This is the most important pillar, representing your true self.
            </p>
            <p className="text-slate-400 text-xs mt-3">
              Each pillar consists of a Heavenly Stem (天干, 10 types) and Earthly Branch (地支, 12 animals).
              Together they form a 60-year cycle called the Sexagenary Cycle (干支).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
