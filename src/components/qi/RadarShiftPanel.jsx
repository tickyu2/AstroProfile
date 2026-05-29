/**
 * RadarShiftPanel — Three stacked bars per element showing TFQ → TotalQi → After Bracelet
 * with delta values and month-type label.
 */
import React from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';

export function RadarShiftPanel({ radarShift }) {
  if (!radarShift) return null;
  const { tfq, mffq, afterBracelet, delta, totalShiftPct, monthType } = radarShift;

  const monthLabel = monthType === 'drained' ? 'Drained (+25% leverage)'
    : monthType === 'overcrowded' ? 'Overcrowded (-25% leverage)'
    : 'Normal';

  return (
    <div className="bg-white/5 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Bracelet Qi Influence</h4>
        <span className="text-[10px] text-white/55 font-mono">{monthLabel}</span>
      </div>

      <div className="space-y-2">
        {ELEMENTS.map(el => {
          const tfqVal = tfq[el] || 0;
          const mffqVal = mffq[el] || 0;
          const afterVal = afterBracelet[el] || 0;
          const d = delta[el] || 0;
          const maxVal = Math.max(tfqVal, mffqVal, afterVal, 1);
          const color = ELEM_COLORS[el];

          return (
            <div key={el} className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color }}>{el}</span>
                <span className={`font-mono font-semibold ${d > 0.1 ? 'text-green-400' : d < -0.1 ? 'text-red-400' : 'text-white/55'}`}>
                  {d > 0 ? '+' : ''}{d.toFixed(2)}
                </span>
              </div>
              <div className="relative h-4 bg-white/5 rounded overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(tfqVal / maxVal) * 100}%`, backgroundColor: color, opacity: 0.15,
                }} />
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(mffqVal / maxVal) * 100}%`, backgroundColor: color, opacity: 0.35,
                }} />
                <div className="absolute inset-y-0 left-0 rounded" style={{
                  width: `${(afterVal / maxVal) * 100}%`, backgroundColor: color, opacity: 0.85,
                }} />
                <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[9px] font-mono text-white/70">
                  <span>{mffqVal.toFixed(1)}</span>
                  <span className="text-white/90">{afterVal.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><div className="w-3 h-1.5 bg-white/15 rounded" /><span className="text-white/55">Natal TFQ</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-1.5 bg-white/35 rounded" /><span className="text-white/60">TotalQi</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-1.5 bg-teal-400/80 rounded" /><span className="text-white/50">+ Bracelet</span></div>
        </div>
        <span className="text-teal-400/70 font-mono">Total shift: {totalShiftPct.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default RadarShiftPanel;
