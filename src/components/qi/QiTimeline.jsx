/**
 * QiTimeline — Animated horizontal timeline showing TotalQi element distribution
 * month-to-month. Bars animate on mount and when data changes.
 * Supports playback mode to auto-advance through months.
 */
import React, { useState, useEffect, useRef } from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';

export function QiTimeline({ data, userTfq }) {
  const [activeMonth, setActiveMonth] = useState(null);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef(null);

  // Auto-play through months
  useEffect(() => {
    if (!playing || !data?.length) return;
    let idx = 0;
    setActiveMonth(0);
    playRef.current = setInterval(() => {
      idx++;
      if (idx >= data.length) {
        setPlaying(false);
        setActiveMonth(null);
        clearInterval(playRef.current);
        return;
      }
      setActiveMonth(idx);
    }, 800);
    return () => clearInterval(playRef.current);
  }, [playing, data?.length]);

  if (!data || data.length === 0) return null;

  // Compute percentages for each month
  const months = data.map(m => {
    const mffq = m.mffq || m.qi || {};
    const total = ELEMENTS.reduce((s, el) => s + (mffq[el] || 0), 0) || 1;
    const pcts = {};
    ELEMENTS.forEach(el => { pcts[el] = ((mffq[el] || 0) / total) * 100; });
    return { ...m, pcts };
  });

  // TFQ baseline percentages
  let tfqPcts = null;
  if (userTfq) {
    const tfqTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0) || 1;
    tfqPcts = {};
    ELEMENTS.forEach(el => { tfqPcts[el] = ((userTfq[el] || 0) / tfqTotal) * 100; });
  }

  const active = activeMonth != null ? months[activeMonth] : null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Qi Timeline</h4>
        <button
          onClick={() => setPlaying(!playing)}
          className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
            playing
              ? 'bg-red-500/15 border-red-500/30 text-red-300'
              : 'bg-teal-500/15 border-teal-500/30 text-teal-300'
          }`}
        >
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>

      {/* Month selector strip */}
      <div className="flex gap-1">
        {months.map((m, i) => {
          const isActive = activeMonth === i;
          // Find dominant element for the dot color
          const dominant = ELEMENTS.reduce((best, el) =>
            m.pcts[el] > (m.pcts[best] || 0) ? el : best, 'Wood');
          return (
            <button
              key={i}
              onClick={() => setActiveMonth(isActive ? null : i)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded transition-all ${
                isActive ? 'bg-slate-700/60' : 'hover:bg-slate-800/40'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-transform"
                style={{
                  backgroundColor: ELEM_COLORS[dominant],
                  opacity: isActive ? 1 : 0.5,
                  transform: isActive ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              <span className={`text-[8px] font-mono ${isActive ? 'text-white/70' : 'text-white/50'}`}>
                {(m.month || m.label || '?').slice(0, 3)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Element bars — shows active month or all months stacked */}
      {active ? (
        // Single month detail view
        <div className="space-y-1.5">
          {ELEMENTS.map(el => {
            const pct = active.pcts[el];
            const tfqPct = tfqPcts?.[el] || 0;
            const diff = pct - tfqPct;
            return (
              <div key={el} className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span style={{ color: ELEM_COLORS[el] }}>{el}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 font-mono">{pct.toFixed(1)}%</span>
                    {tfqPcts && (
                      <span className={`font-mono text-[9px] ${diff > 2 ? 'text-amber-400/60' : diff < -2 ? 'text-blue-400/60' : 'text-white/50'}`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-3 bg-white/5 rounded overflow-hidden">
                  {/* TFQ baseline marker */}
                  {tfqPcts && (
                    <div
                      className="absolute top-0 bottom-0 w-px bg-white/20"
                      style={{ left: `${tfqPct}%` }}
                    />
                  )}
                  <div
                    className="h-full rounded transition-all duration-500 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: ELEM_COLORS[el],
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div className="text-[9px] text-white/50 text-center mt-1">
            {active.month || active.label} — {active.season || ''}
          </div>
        </div>
      ) : (
        // Overview: mini stacked bars for all months
        <div className="space-y-0.5">
          {months.map((m, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-[8px] text-white/50 font-mono w-6">{(m.month || m.label || '?').slice(0, 3)}</span>
              <div className="flex-1 flex h-2.5 rounded overflow-hidden gap-px">
                {ELEMENTS.map(el => (
                  <div
                    key={el}
                    style={{
                      width: `${m.pcts[el]}%`,
                      backgroundColor: ELEM_COLORS[el],
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 text-[9px]">
        {ELEMENTS.map(el => (
          <div key={el} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ELEM_COLORS[el] }} />
            <span className="text-white/50">{el[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QiTimeline;
