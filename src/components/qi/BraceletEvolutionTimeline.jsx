/**
 * BraceletEvolutionTimeline — Shows how the bracelet composition evolves
 * across months. Tracks element ratios, quality score, collapse mode,
 * and Yong Shen changes month-to-month.
 */
import React, { useState } from 'react';
import { ELEMENTS, ELEM_COLORS } from './elemConstants';
import { ElementBadge } from './ElementBadge';

export function BraceletEvolutionTimeline({ months }) {
  const [expandedMonth, setExpandedMonth] = useState(null);

  if (!months || months.length === 0) return null;

  // Compute max score for relative sizing
  const maxScore = Math.max(...months.map(m => m.score || 0), 1);

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-white/60 mb-2">Bracelet Evolution</h4>

      {months.map((m, i) => {
        const prev = i > 0 ? months[i - 1] : null;
        const scoreDelta = prev ? (m.score - prev.score) : 0;
        const isExpanded = expandedMonth === i;
        const beadTotal = m.beads?.reduce((s, b) => s + b.count, 0) || 0;

        // Detect changes from previous month
        const changed = prev && m.beads?.some((b, bi) => {
          const pb = prev.beads?.[bi];
          return !pb || pb.element !== b.element || pb.count !== b.count;
        });

        return (
          <div key={m.month || i} className="relative">
            {/* Timeline connector */}
            {i > 0 && (
              <div className="absolute left-3 -top-1 w-0.5 h-2" style={{
                backgroundColor: changed ? '#f59e0b' : '#334155',
              }} />
            )}

            <button
              onClick={() => setExpandedMonth(isExpanded ? null : i)}
              className={`w-full text-left rounded-lg p-2.5 transition-colors border ${
                isExpanded
                  ? 'bg-slate-800/60 border-slate-600'
                  : 'bg-slate-900/30 border-slate-800 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Timeline dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  changed ? 'bg-amber-400' : 'bg-slate-600'
                }`} />

                {/* Month label */}
                <span className="text-[11px] font-semibold text-white/70 w-8">{m.month}</span>

                {/* Element distribution mini-bar */}
                <div className="flex-1 flex h-3 rounded overflow-hidden gap-px">
                  {m.beads?.filter(b => b.count > 0).map(b => (
                    <div
                      key={b.element}
                      style={{
                        width: `${(b.count / beadTotal) * 100}%`,
                        backgroundColor: ELEM_COLORS[b.element],
                        opacity: 0.7,
                      }}
                      title={`${b.element}: ${b.count}`}
                    />
                  ))}
                </div>

                {/* Quality score */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-mono ${
                    m.score >= 80 ? 'text-green-400/70' : m.score >= 60 ? 'text-amber-400/70' : 'text-red-400/70'
                  }`}>
                    {m.score}
                  </span>
                  {scoreDelta !== 0 && (
                    <span className={`text-[9px] font-mono ${scoreDelta > 0 ? 'text-green-400/50' : 'text-red-400/50'}`}>
                      {scoreDelta > 0 ? '+' : ''}{scoreDelta}
                    </span>
                  )}
                </div>

                {/* Collapse badge */}
                {m.collapseMode && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/25 text-purple-300/70">
                    {m.collapseMode.slice(0, 6)}
                  </span>
                )}

                <span className="text-white/50 text-[10px]">{isExpanded ? '\u25B2' : '\u25BC'}</span>
              </div>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="ml-5 mt-1 p-2.5 bg-slate-800/30 rounded-lg border border-slate-700/50 space-y-2">
                {/* Bead breakdown */}
                <div className="flex flex-wrap gap-1.5">
                  {m.beads?.filter(b => b.count > 0).map(b => (
                    <ElementBadge key={b.element} element={b.element}>
                      {b.element} x{b.count}
                    </ElementBadge>
                  ))}
                </div>

                {/* Yong Shen info */}
                {m.yongShen && (
                  <div className="text-[10px] text-white/60 space-y-0.5">
                    <p>
                      <span className="text-white/55">Rx:</span>{' '}
                      <span className="text-teal-300">{m.yongShen.join(', ')}</span>
                    </p>
                    {m.forbidden?.length > 0 && (
                      <p>
                        <span className="text-white/55">Forbidden:</span>{' '}
                        <span className="text-red-300">{m.forbidden.join(', ')}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Change summary vs previous */}
                {prev && changed && (
                  <div className="text-[9px] text-amber-400/50 border-t border-white/5 pt-1">
                    Changed from {prev.month}: {
                      m.beads?.map(b => {
                        const pb = prev.beads?.find(pb => pb.element === b.element);
                        const diff = b.count - (pb?.count || 0);
                        if (diff === 0) return null;
                        return `${b.element} ${diff > 0 ? '+' : ''}${diff}`;
                      }).filter(Boolean).join(', ')
                    }
                  </div>
                )}

                {/* Score breakdown if available */}
                {m.scoreBreakdown && (
                  <div className="grid grid-cols-5 gap-1 text-[9px] text-white/55">
                    {Object.entries(m.scoreBreakdown)
                      .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
                      .map(([k, v]) => (
                      <div key={k} className="text-center">
                        <div className="text-white/50 font-mono">{v}</div>
                        <div className="truncate">{k}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BraceletEvolutionTimeline;
