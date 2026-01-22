/**
 * Yin/Yang Polarity Heatmap
 *
 * Displays a planet-vs-planet grid showing polarity interactions:
 * - Opposite polarities (Yin-Yang) = Magnetic attraction (high score)
 * - Same polarities (Yin-Yin, Yang-Yang) = Parallel resonance (moderate score)
 */

import { useState } from 'react';

// Get cell styling based on match type
const getCellStyle = (match, score) => {
  if (match === 'magnetic') {
    return {
      bg: 'bg-gradient-to-br from-pink-500/30 to-violet-500/30',
      border: 'border-pink-500/40',
      text: 'text-pink-300'
    };
  }
  return {
    bg: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-300'
  };
};

// Get polarity icon
const getPolarityIcon = (polarity) => {
  return polarity === 'Yang' ? '☀️' : '🌙';
};

// Compute match between two polarities
const computeMatch = (polarityA, polarityB) => {
  const isOpposite = polarityA !== polarityB;
  return {
    type: isOpposite ? 'magnetic' : 'parallel',
    score: isOpposite ? 90 : 70,
    label: isOpposite ? 'Magnetic' : 'Parallel',
    description: isOpposite
      ? 'Opposite poles attract — dynamic tension and attraction'
      : 'Same polarity — easy flow and natural understanding'
  };
};

// Heatmap Cell Component
function HeatmapCell({ planetA, polarityA, planetB, polarityB }) {
  const match = computeMatch(polarityA, polarityB);
  const style = getCellStyle(match.type, match.score);

  return (
    <td
      className={`p-2 ${style.bg} border ${style.border} text-center transition-all hover:scale-105 cursor-default`}
      title={`${planetA} (${polarityA}) × ${planetB} (${polarityB}): ${match.label}`}
    >
      <div className={`text-sm font-bold ${style.text}`}>{match.score}</div>
      <div className="text-[9px] text-white/40">{match.label}</div>
    </td>
  );
}

// Summary Statistics
function PolaritySummary({ personA, personB }) {
  let magneticCount = 0;
  let parallelCount = 0;
  let totalScore = 0;

  for (const a of personA) {
    for (const b of personB) {
      const match = computeMatch(a.polarity, b.polarity);
      if (match.type === 'magnetic') magneticCount++;
      else parallelCount++;
      totalScore += match.score;
    }
  }

  const cellCount = personA.length * personB.length;
  const avgScore = cellCount > 0 ? Math.round(totalScore / cellCount) : 0;
  const magneticRatio = cellCount > 0 ? Math.round((magneticCount / cellCount) * 100) : 0;

  let overallType, overallDesc;
  if (magneticRatio >= 60) {
    overallType = 'Highly Magnetic';
    overallDesc = 'Strong polarity tension creates dynamic attraction and growth edges.';
  } else if (magneticRatio >= 40) {
    overallType = 'Balanced Polarity';
    overallDesc = 'Mix of magnetic attraction and parallel resonance for balanced relating.';
  } else {
    overallType = 'Parallel Resonance';
    overallDesc = 'Similar polarities create easy flow and natural understanding.';
  }

  return (
    <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white/80">{avgScore}</div>
          <div className="text-[10px] text-white/40">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">{magneticCount}</div>
          <div className="text-[10px] text-white/40">Magnetic Pairs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{parallelCount}</div>
          <div className="text-[10px] text-white/40">Parallel Pairs</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-white/70 font-medium mb-1">{overallType}</div>
        <div className="text-xs text-white/50">{overallDesc}</div>
      </div>
    </div>
  );
}

export default function YinYangHeatmap({ personA, personB, labelA = 'Person A', labelB = 'Person B' }) {
  const [showLegend, setShowLegend] = useState(false);

  if (!personA?.length || !personB?.length) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/30 to-cyan-500/30 flex items-center justify-center shadow-lg">
            <span className="text-2xl">☯️</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Yin/Yang Polarity Heatmap</div>
            <div className="text-[10px] text-white/40">Planet-by-Planet Polarity Interactions</div>
          </div>
        </div>

        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-3 py-1 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors text-xs text-white/50"
        >
          {showLegend ? 'Hide' : 'Show'} Legend
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-slate-800/40 rounded-lg p-4 mb-5 border border-slate-700/40">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-500/30 to-violet-500/30 border border-pink-500/40 flex items-center justify-center">
                <span className="text-sm font-bold text-pink-300">90</span>
              </div>
              <div>
                <div className="text-xs text-white/70">Magnetic (Opposite)</div>
                <div className="text-[10px] text-white/40">Yin ↔ Yang attraction</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-300">70</span>
              </div>
              <div>
                <div className="text-xs text-white/70">Parallel (Same)</div>
                <div className="text-[10px] text-white/40">Natural resonance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-[10px] text-white/40 uppercase">
                {labelA} \ {labelB}
              </th>
              {personB.map((p) => (
                <th key={p.planet} className="p-2 text-center">
                  <div className="text-xs text-white/70">{p.planet}</div>
                  <div className="text-sm">{getPolarityIcon(p.polarity)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {personA.map((a) => (
              <tr key={a.planet}>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getPolarityIcon(a.polarity)}</span>
                    <span className="text-xs text-white/70">{a.planet}</span>
                  </div>
                </td>
                {personB.map((b) => (
                  <HeatmapCell
                    key={b.planet}
                    planetA={a.planet}
                    polarityA={a.polarity}
                    planetB={b.planet}
                    polarityB={b.polarity}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <PolaritySummary personA={personA} personB={personB} />

      {/* Interpretive Footer */}
      <div className="mt-5 pt-4 border-t border-slate-700/30">
        <div className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-lg p-4 border border-pink-500/20">
          <div className="text-[10px] text-pink-400 uppercase mb-2">Polarity Dynamics</div>
          <div className="text-xs text-white/60 leading-relaxed">
            Magnetic pairs (Yin-Yang) create dynamic tension and attraction — the opposites that fascinate and challenge.
            Parallel pairs (same polarity) flow naturally but may lack the spark of differentiation.
            A healthy relationship balances both energies.
          </div>
        </div>
      </div>
    </div>
  );
}
