/**
 * ElementPressureChart — Dominant element percentage across 12 months.
 * Shows pressure trend with natal baseline reference.
 */
import React from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';

export function ElementPressureChart({ allMonthBracelets, userTfq }) {
  if (!allMonthBracelets || allMonthBracelets.length === 0 || !userTfq) return null;

  const tfqTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;
  const tfqPcts = ELEMENTS.map(el => ({ el, pct: ((userTfq[el] || 0) / tfqTotal) * 100 }));
  const dominant = tfqPcts.sort((a, b) => b.pct - a.pct)[0];

  const months = allMonthBracelets.filter(m => m.mffq).map(m => {
    const total = ELEMENTS.reduce((s, el) => s + (m.mffq[el] || 0), 0) || 1;
    return {
      label: m.label?.slice(0, 3) || '?',
      pct: ((m.mffq[dominant.el] || 0) / total) * 100,
    };
  });

  if (months.length === 0) return null;
  const maxPct = Math.max(...months.map(m => m.pct), dominant.pct, 1);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-white/60">
        <span style={{ color: ELEM_COLORS[dominant.el] }}>{dominant.el}</span> Pressure Over Year
      </h4>
      <div className="flex items-end gap-1 h-20">
        {months.map((m, i) => {
          const h = (m.pct / maxPct) * 100;
          const isHigh = m.pct > dominant.pct + 10;
          const isLow = m.pct < dominant.pct - 10;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t relative" style={{
                height: `${h}%`,
                backgroundColor: ELEM_COLORS[dominant.el],
                opacity: isHigh ? 0.9 : isLow ? 0.25 : 0.5,
              }}>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/50">
                  {m.pct.toFixed(0)}
                </span>
              </div>
              <span className="text-[8px] text-white/55">{m.label}</span>
            </div>
          );
        })}
      </div>
      {/* Natal baseline */}
      <div className="flex items-center gap-2 text-[9px]">
        <div className="w-6 h-0.5 border-t border-dashed" style={{ borderColor: ELEM_COLORS[dominant.el] }} />
        <span className="text-white/55">Natal {dominant.el}: {dominant.pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default ElementPressureChart;
