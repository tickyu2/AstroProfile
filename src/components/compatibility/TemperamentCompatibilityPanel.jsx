/**
 * Temperament Compatibility Panel
 * Displays Guna & Dosha compatibility heatmap between two people
 */

import { useMemo } from 'react';

// Score to color mapping
const getScoreColor = (score) => {
  if (score >= 85) return { bg: 'bg-emerald-500/30', border: 'border-emerald-500/50', text: 'text-emerald-400' };
  if (score >= 70) return { bg: 'bg-lime-500/30', border: 'border-lime-500/50', text: 'text-lime-400' };
  if (score >= 60) return { bg: 'bg-amber-500/30', border: 'border-amber-500/50', text: 'text-amber-400' };
  if (score >= 50) return { bg: 'bg-orange-500/30', border: 'border-orange-500/50', text: 'text-orange-400' };
  return { bg: 'bg-red-500/30', border: 'border-red-500/50', text: 'text-red-400' };
};

// Guna colors
const gunaColors = {
  Sattva: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  Rajas: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  Tamas: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

// Dosha colors
const doshaColors = {
  Vata: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  Pitta: { bg: 'bg-red-500/20', text: 'text-red-400' },
  Kapha: { bg: 'bg-green-500/20', text: 'text-green-400' },
};

export default function TemperamentCompatibilityPanel({ heatmap, personAName = 'Person A', personBName = 'Person B' }) {
  if (!heatmap) return null;

  const gunaStyle = getScoreColor(heatmap.guna?.score || 0);
  const doshaStyle = getScoreColor(heatmap.dosha?.score || 0);
  const overallStyle = getScoreColor(heatmap.overallScore || 0);

  const gunaAColor = gunaColors[heatmap.guna?.A] || gunaColors.Rajas;
  const gunaBColor = gunaColors[heatmap.guna?.B] || gunaColors.Rajas;
  const doshaAColor = doshaColors[heatmap.dosha?.A] || doshaColors.Vata;
  const doshaBColor = doshaColors[heatmap.dosha?.B] || doshaColors.Vata;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-5 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧘</span>
          <div>
            <div className="text-sm text-white/80 font-medium">Guna & Dosha Compatibility</div>
            <div className="text-[10px] text-white/40">Vedic Temperament Analysis</div>
          </div>
        </div>

        {/* Overall Score Badge */}
        <div className={`px-3 py-1.5 rounded-lg ${overallStyle.bg} border ${overallStyle.border}`}>
          <div className={`text-lg font-bold ${overallStyle.text}`}>{heatmap.overallScore || 0}</div>
          <div className="text-[9px] text-white/40">{heatmap.overallLabel || 'N/A'}</div>
        </div>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] text-white/40 uppercase tracking-wider">Type</th>
              <th className="px-3 py-2 text-center text-[10px] text-white/40 uppercase tracking-wider">{personAName}</th>
              <th className="px-3 py-2 text-center text-[10px] text-white/40 uppercase tracking-wider">{personBName}</th>
              <th className="px-3 py-2 text-center text-[10px] text-white/40 uppercase tracking-wider">Score</th>
              <th className="px-3 py-2 text-center text-[10px] text-white/40 uppercase tracking-wider">Match</th>
            </tr>
          </thead>
          <tbody>
            {/* Guna Row */}
            <tr className="border-t border-slate-700/50">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span>🧠</span>
                  <span className="text-white/80">Guna</span>
                </div>
                <div className="text-[9px] text-white/40">Mental Quality</div>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded ${gunaAColor.bg} ${gunaAColor.text} text-xs font-medium`}>
                  {heatmap.guna?.A || 'N/A'}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded ${gunaBColor.bg} ${gunaBColor.text} text-xs font-medium`}>
                  {heatmap.guna?.B || 'N/A'}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`text-lg font-bold ${gunaStyle.text}`}>{heatmap.guna?.score || 0}</span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded-full ${gunaStyle.bg} ${gunaStyle.text} text-[10px]`}>
                  {heatmap.guna?.label || 'N/A'}
                </span>
              </td>
            </tr>

            {/* Dosha Row */}
            <tr className="border-t border-slate-700/50">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span>🌿</span>
                  <span className="text-white/80">Dosha</span>
                </div>
                <div className="text-[9px] text-white/40">Constitution</div>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded ${doshaAColor.bg} ${doshaAColor.text} text-xs font-medium`}>
                  {heatmap.dosha?.A || 'N/A'}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded ${doshaBColor.bg} ${doshaBColor.text} text-xs font-medium`}>
                  {heatmap.dosha?.B || 'N/A'}
                </span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`text-lg font-bold ${doshaStyle.text}`}>{heatmap.dosha?.score || 0}</span>
              </td>
              <td className="px-3 py-3 text-center">
                <span className={`px-2 py-1 rounded-full ${doshaStyle.bg} ${doshaStyle.text} text-[10px]`}>
                  {heatmap.dosha?.label || 'N/A'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual Heatmap */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg ${gunaStyle.bg} border ${gunaStyle.border}`}>
          <div className="text-[9px] text-white/40 uppercase mb-1">Guna Synergy</div>
          <div className="flex items-center justify-between">
            <span className={`${gunaAColor.text} text-sm`}>{heatmap.guna?.A}</span>
            <span className="text-white/30">+</span>
            <span className={`${gunaBColor.text} text-sm`}>{heatmap.guna?.B}</span>
            <span className="text-white/30">=</span>
            <span className={`${gunaStyle.text} font-bold`}>{heatmap.guna?.score}</span>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${doshaStyle.bg} border ${doshaStyle.border}`}>
          <div className="text-[9px] text-white/40 uppercase mb-1">Dosha Synergy</div>
          <div className="flex items-center justify-between">
            <span className={`${doshaAColor.text} text-sm`}>{heatmap.dosha?.A}</span>
            <span className="text-white/30">+</span>
            <span className={`${doshaBColor.text} text-sm`}>{heatmap.dosha?.B}</span>
            <span className="text-white/30">=</span>
            <span className={`${doshaStyle.text} font-bold`}>{heatmap.dosha?.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
