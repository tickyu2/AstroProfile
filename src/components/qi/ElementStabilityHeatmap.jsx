/**
 * ElementStabilityHeatmap — Monthly element drift from natal TFQ.
 * Color-coded: green = stable, amber = excess, red = surge, blue = deficit.
 */
import React from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';

const driftColor = (d) => {
  if (d > 8) return 'bg-red-500/60';
  if (d > 3) return 'bg-amber-500/40';
  if (d < -8) return 'bg-blue-500/60';
  if (d < -3) return 'bg-blue-500/30';
  return 'bg-green-500/25';
};

export function ElementStabilityHeatmap({ allMonthBracelets, userTfq }) {
  if (!allMonthBracelets || allMonthBracelets.length === 0 || !userTfq) return null;

  const months = allMonthBracelets.filter(m => m.mffq).map(m => {
    const total = ELEMENTS.reduce((s, el) => s + (m.mffq[el] || 0), 0) || 1;
    const tfqTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;
    const cells = {};
    for (const el of ELEMENTS) {
      const mffqPct = ((m.mffq[el] || 0) / total) * 100;
      const tfqPct = ((userTfq[el] || 0) / tfqTotal) * 100;
      cells[el] = mffqPct - tfqPct;
    }
    return { label: m.label, cells, yongShen: m.yongShen };
  });

  if (months.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">Monthly Element Drift from Natal</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr>
              <th className="text-left text-white/55 px-1 pb-1">Month</th>
              {ELEMENTS.map(el => (
                <th key={el} className="text-center px-1 pb-1" style={{ color: ELEM_COLORS[el] }}>{el[0]}</th>
              ))}
              <th className="text-center text-white/55 px-1 pb-1">Mode</th>
            </tr>
          </thead>
          <tbody>
            {months.map(m => (
              <tr key={m.label}>
                <td className="text-white/60 px-1 py-0.5 whitespace-nowrap">{m.label?.slice(0, 3)}</td>
                {ELEMENTS.map(el => (
                  <td key={el} className="text-center px-0.5 py-0.5">
                    <span className={`inline-block w-full rounded px-1 py-0.5 text-white/70 ${driftColor(m.cells[el])}`}>
                      {m.cells[el] > 0 ? '+' : ''}{m.cells[el].toFixed(0)}
                    </span>
                  </td>
                ))}
                <td className="text-center text-white/55 px-1 py-0.5 whitespace-nowrap">
                  {m.yongShen?.collapseMode?.slice(0, 5) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 text-[9px] text-white/55">
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-green-500/25" /> Stable</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-amber-500/40" /> Excess</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500/60" /> Surge</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-500/30" /> Deficit</span>
      </div>
    </div>
  );
}

export default ElementStabilityHeatmap;
