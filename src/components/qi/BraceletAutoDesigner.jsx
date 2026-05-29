/**
 * BraceletAutoDesigner — Generates optimal bead sequences using the actual
 * designBracelet engine, then displays the result with a "Use This" button
 * that feeds into BraceletDesigner.
 *
 * Shows the engine's reasoning: Yong Shen allocation, Sheng cycle ordering,
 * polarity breathing, and quality score.
 */
import React, { useMemo, useState } from 'react';
import { ELEMENTS, ELEM_COLORS, GENERATES } from './elemConstants';
import { ElementBadge } from './ElementBadge';
import {
  designBracelet,
  scoreBracelet,
} from '../../data/stoneDatabase';

const BEAD_COUNT = 21;
const TWO_PI = Math.PI * 2;

function circlePos(i, total, cx, cy, r) {
  const angle = (i / total) * TWO_PI - Math.PI / 2;
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
}

export function BraceletAutoDesigner({ yongShen, dayMasterStem, onApply }) {
  const [showDetail, setShowDetail] = useState(false);

  const result = useMemo(() => {
    if (!yongShen || !dayMasterStem) return null;
    const bracelet = designBracelet(yongShen, dayMasterStem);
    const score = scoreBracelet(bracelet, yongShen);
    return { bracelet, score };
  }, [yongShen, dayMasterStem]);

  if (!result) return null;

  const { bracelet, score } = result;
  const sequence = bracelet.sequence || [];

  // Count elements in sequence
  const dist = {};
  ELEMENTS.forEach(el => { dist[el] = 0; });
  sequence.forEach(s => { if (s?.element) dist[s.element]++; });

  const svgSize = 200;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const ringR = 78;
  const beadR = 8;

  const useful = yongShen.usefulElements || [];
  const forbidden = yongShen.forbidden || [];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/60">Auto-Designer</h4>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono ${
            score.total >= 80 ? 'text-green-400/70' : score.total >= 60 ? 'text-amber-400/70' : 'text-red-400/70'
          }`}>
            Score: {score.total}/100
          </span>
          {onApply && (
            <button
              onClick={() => onApply(sequence.map(s => ({ element: s?.element || null })))}
              className="text-[10px] px-2 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25 transition-colors"
            >
              Use This
            </button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        {/* Mini bracelet preview */}
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="flex-shrink-0">
          <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="#334155" strokeWidth={0.5} />
          {sequence.slice(0, BEAD_COUNT).map((bead, i) => {
            const pos = circlePos(i, Math.min(sequence.length, BEAD_COUNT), cx, cy, ringR);
            const el = bead?.element;
            const color = el ? ELEM_COLORS[el] : '#1e293b';
            // Sheng flow line
            const prevEl = i > 0 ? sequence[i - 1]?.element : null;
            const isSheng = prevEl && el && GENERATES[prevEl] === el;
            const prevPos = i > 0 ? circlePos(i - 1, Math.min(sequence.length, BEAD_COUNT), cx, cy, ringR) : null;

            return (
              <g key={i}>
                {isSheng && prevPos && (
                  <line x1={prevPos.x} y1={prevPos.y} x2={pos.x} y2={pos.y} stroke="#22c55e" strokeWidth={1} opacity={0.25} />
                )}
                <circle cx={pos.x} cy={pos.y} r={beadR} fill={color} opacity={el ? 0.8 : 0.2} />
                {el && (
                  <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={6} fontWeight="600" fontFamily="monospace">
                    {el[0]}
                  </text>
                )}
              </g>
            );
          })}
          {/* Center */}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="monospace">AUTO</text>
          <text x={cx} y={cy + 8} textAnchor="middle" fill="#e2e8f0" fontSize={14} fontWeight="700" fontFamily="monospace">{score.total}</text>
        </svg>

        {/* Info panel */}
        <div className="flex-1 space-y-2">
          {/* Distribution badges */}
          <div className="flex flex-wrap gap-1">
            {ELEMENTS.filter(el => dist[el] > 0).map(el => (
              <ElementBadge key={el} element={el}>
                {el} x{dist[el]}
              </ElementBadge>
            ))}
          </div>

          {/* Yong Shen summary */}
          <div className="text-[10px] text-white/60 space-y-0.5">
            <p>
              <span className="text-white/55">Rx:</span>{' '}
              <span className="text-teal-300">{useful.join(', ') || 'none'}</span>
            </p>
            {forbidden.length > 0 && (
              <p>
                <span className="text-white/55">Forbidden:</span>{' '}
                <span className="text-red-300">{forbidden.join(', ')}</span>
              </p>
            )}
          </div>

          {/* Score breakdown toggle */}
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-[9px] text-white/50 hover:text-white/60 transition-colors"
          >
            {showDetail ? 'Hide' : 'Show'} score breakdown
          </button>

          {showDetail && score.breakdown && (
            <div className="grid grid-cols-5 gap-1 text-[9px]">
              {Object.entries(score.breakdown).map(([k, v]) => (
                <div key={k} className="text-center bg-slate-800/30 rounded p-1">
                  <div className="text-white/50 font-mono">{v}</div>
                  <div className="text-white/50 truncate">{k}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BraceletAutoDesigner;
