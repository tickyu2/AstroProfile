/**
 * QiDebugger — Developer console for metaphysics.
 * Shows raw TFQ, TotalQi, bracelet Qi, collapse info, and per-element breakdown
 * in a compact debugger-style panel.
 */
import React, { useState } from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';
import { ElementBadge } from './ElementBadge';

function pct(val, total) {
  return total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
}

export function QiDebugger({ tfq, mffq, braceletQiUnits, collapseInfo, yongShen, radarShift }) {
  const [expanded, setExpanded] = useState(true);

  if (!tfq || !mffq) return null;
  const tfqTotal = ELEMENTS.reduce((s, el) => s + (tfq[el] || 0), 0);
  const mffqTotal = ELEMENTS.reduce((s, el) => s + (mffq[el] || 0), 0);
  const brqTotal = braceletQiUnits ? ELEMENTS.reduce((s, el) => s + (braceletQiUnits[el] || 0), 0) : 0;

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700 overflow-hidden font-mono text-[11px]">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
      >
        <span className="text-xs font-semibold text-amber-400/80">Qi Debugger</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-white/55">TFQ:{tfqTotal.toFixed(1)} TotalQi:{mffqTotal.toFixed(1)}</span>
          <span className="text-white/55">{expanded ? '\u25B2' : '\u25BC'}</span>
        </div>
      </button>

      {expanded && (
        <div className="p-3 space-y-3">
          {/* Per-element grid */}
          <div className="space-y-1.5">
            {ELEMENTS.map(el => {
              const tfqVal = tfq[el] || 0;
              const mffqVal = mffq[el] || 0;
              const brqVal = braceletQiUnits?.[el] || 0;
              const delta = mffqVal - tfqVal;
              const afterVal = radarShift?.afterBracelet?.[el];
              const shift = radarShift?.delta?.[el];

              return (
                <div key={el} className="bg-slate-800/30 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ELEM_COLORS[el] }} />
                      <span className="text-white/70 font-semibold">{el}</span>
                    </div>
                    <ElementBadge element={el}>
                      {pct(mffqVal, mffqTotal)}%
                    </ElementBadge>
                  </div>

                  <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-[10px]">
                    <div>
                      <span className="text-white/55">TFQ</span>
                      <div className="text-white/60">{tfqVal.toFixed(3)}</div>
                      <div className="text-white/50">{pct(tfqVal, tfqTotal)}%</div>
                    </div>
                    <div>
                      <span className="text-white/55">TotalQi</span>
                      <div className="text-white/60">{mffqVal.toFixed(3)}</div>
                      <div className={delta > 0.5 ? 'text-amber-400/60' : delta < -0.5 ? 'text-blue-400/60' : 'text-white/50'}>
                        {delta > 0 ? '+' : ''}{delta.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/55">BRQ</span>
                      <div className="text-white/60">{brqVal.toFixed(2)}</div>
                      {shift !== undefined && (
                        <div className={shift > 0.05 ? 'text-green-400/60' : shift < -0.05 ? 'text-red-400/60' : 'text-white/50'}>
                          {shift > 0 ? '+' : ''}{shift.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mini bar: TFQ vs TotalQi */}
                  <div className="mt-1 flex gap-0.5 h-1.5">
                    <div className="rounded" style={{
                      width: `${pct(tfqVal, Math.max(tfqTotal, mffqTotal))}%`,
                      backgroundColor: ELEM_COLORS[el],
                      opacity: 0.25,
                    }} />
                    <div className="rounded" style={{
                      width: `${pct(mffqVal, Math.max(tfqTotal, mffqTotal))}%`,
                      backgroundColor: ELEM_COLORS[el],
                      opacity: 0.7,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collapse + Yong Shen row */}
          {(collapseInfo || yongShen) && (
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {collapseInfo && (
                <div className="bg-slate-800/30 rounded-lg p-2">
                  <span className="text-white/55">Collapse</span>
                  <div className="text-purple-300 font-semibold">
                    {collapseInfo.isCollapse ? collapseInfo.mode : 'None'}
                  </div>
                  {collapseInfo.dominant && (
                    <div className="text-white/50">dom: {collapseInfo.dominant}</div>
                  )}
                </div>
              )}
              {yongShen && (
                <div className="bg-slate-800/30 rounded-lg p-2">
                  <span className="text-white/55">Yong Shen</span>
                  <div className="text-teal-300 font-semibold">
                    {yongShen.usefulElements?.join(', ') || 'none'}
                  </div>
                  {yongShen.forbidden?.length > 0 && (
                    <div className="text-red-400/60">X: {yongShen.forbidden.join(', ')}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Totals row */}
          <div className="flex items-center justify-between text-[9px] text-white/50 border-t border-white/5 pt-1.5">
            <span>TFQ total: {tfqTotal.toFixed(3)}</span>
            <span>TotalQi total: {mffqTotal.toFixed(3)}</span>
            <span>BRQ total: {brqTotal.toFixed(2)}</span>
            {radarShift && <span>Shift: {radarShift.totalShiftPct?.toFixed(1)}%</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default QiDebugger;
