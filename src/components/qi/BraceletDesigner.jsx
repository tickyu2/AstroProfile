/**
 * BraceletDesigner — Visual drag-and-drop bead ring for designing bracelets.
 * Users drag element beads from a palette into a circular 21-slot ring.
 * Quality score and Sheng flow update in real-time.
 */
import React, { useState, useMemo } from 'react';
import { ELEMENTS, ELEM_COLORS, GENERATES } from './elemConstants';
import { ElementBadge } from './ElementBadge';

const SLOT_COUNT = 21;
const TWO_PI = Math.PI * 2;

function circlePos(i, total, cx, cy, r) {
  const angle = (i / total) * TWO_PI - Math.PI / 2;
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
}

function computeQuickScore(slots) {
  const filled = slots.filter(s => s.element);
  if (filled.length === 0) return { total: 0, shengFlow: 0, diversity: 0, distribution: {} };

  // Distribution
  const dist = {};
  ELEMENTS.forEach(el => { dist[el] = 0; });
  filled.forEach(s => { if (s.element) dist[s.element]++; });

  // Sheng flow: count adjacent pairs in generative order
  let shengHits = 0;
  for (let i = 0; i < slots.length; i++) {
    const curr = slots[i]?.element;
    const next = slots[(i + 1) % slots.length]?.element;
    if (curr && next && GENERATES[curr] === next) shengHits++;
  }
  const shengFlow = Math.min(20, Math.round((shengHits / Math.max(filled.length - 1, 1)) * 20));

  // Diversity: unique elements used
  const unique = ELEMENTS.filter(el => dist[el] > 0).length;
  const diversity = Math.min(15, unique * 3);

  return { total: shengFlow + diversity, shengFlow, diversity, distribution: dist };
}

export function BraceletDesigner({ initialSlots, onDesignChange }) {
  const [slots, setSlots] = useState(() =>
    initialSlots || Array.from({ length: SLOT_COUNT }, () => ({ element: null }))
  );
  const [dragElement, setDragElement] = useState(null);

  const score = useMemo(() => computeQuickScore(slots), [slots]);
  const filledCount = slots.filter(s => s.element).length;

  const handleDrop = (i) => {
    if (!dragElement) return;
    const next = [...slots];
    next[i] = { element: dragElement };
    setSlots(next);
    onDesignChange?.(next);
  };

  const handleClear = (i) => {
    const next = [...slots];
    next[i] = { element: null };
    setSlots(next);
    onDesignChange?.(next);
  };

  const handleClearAll = () => {
    const next = Array.from({ length: SLOT_COUNT }, () => ({ element: null }));
    setSlots(next);
    onDesignChange?.(next);
  };

  const svgSize = 280;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const ringR = 110;
  const beadR = 12;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white/70">Bracelet Designer</h4>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/55 font-mono">{filledCount}/{SLOT_COUNT} beads</span>
          <button
            onClick={handleClearAll}
            className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-red-400/60 hover:text-red-300 border border-red-500/20 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Palette */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <span className="text-[9px] text-white/55 font-semibold">DRAG</span>
          {ELEMENTS.map(el => (
            <div
              key={el}
              draggable
              onDragStart={(e) => {
                setDragElement(el);
                e.dataTransfer.setData('element', el);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onDragEnd={() => setDragElement(null)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-grab active:cursor-grabbing border border-white/10 hover:border-white/20 transition-colors"
              style={{ backgroundColor: ELEM_COLORS[el] + '25' }}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ELEM_COLORS[el] }} />
              <span className="text-[10px] text-white/60 font-medium">{el}</span>
            </div>
          ))}
        </div>

        {/* Bracelet ring SVG */}
        <div className="flex-1 flex justify-center">
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            {/* Ring outline */}
            <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />

            {/* Bead slots */}
            {slots.map((slot, i) => {
              const pos = circlePos(i, SLOT_COUNT, cx, cy, ringR);
              const hasElement = !!slot.element;
              const color = hasElement ? ELEM_COLORS[slot.element] : '#1e293b';
              const isSheng = i > 0 && slots[i - 1]?.element && slot.element && GENERATES[slots[i - 1].element] === slot.element;

              return (
                <g key={i}>
                  {/* Sheng flow indicator */}
                  {isSheng && (() => {
                    const prev = circlePos(i - 1, SLOT_COUNT, cx, cy, ringR);
                    return <line x1={prev.x} y1={prev.y} x2={pos.x} y2={pos.y} stroke="#22c55e" strokeWidth={1.5} opacity={0.3} />;
                  })()}

                  {/* Drop zone */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={beadR + 2}
                    fill="transparent"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleDrop(i); }}
                    onClick={() => hasElement && handleClear(i)}
                    className="cursor-pointer"
                  />

                  {/* Bead */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={beadR}
                    fill={color}
                    stroke={hasElement ? color : '#475569'}
                    strokeWidth={hasElement ? 0 : 1}
                    opacity={hasElement ? 0.85 : 0.3}
                  />

                  {/* Label */}
                  {hasElement && (
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize={8}
                      fontWeight="600"
                      fontFamily="monospace"
                    >
                      {slot.element[0]}
                    </text>
                  )}

                  {/* Slot number (empty) */}
                  {!hasElement && (
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#475569"
                      fontSize={7}
                      fontFamily="monospace"
                    >
                      {i + 1}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Center score */}
            <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">Score</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#e2e8f0" fontSize={22} fontWeight="700" fontFamily="monospace">
              {score.total}
            </text>
          </svg>
        </div>
      </div>

      {/* Score breakdown + distribution */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/30 rounded-lg p-2 space-y-1">
          <span className="text-[9px] text-white/55">Score Breakdown</span>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/60">Sheng Flow</span>
            <span className="text-white/60 font-mono">{score.shengFlow}/20</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/60">Diversity</span>
            <span className="text-white/60 font-mono">{score.diversity}/15</span>
          </div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-2 space-y-1">
          <span className="text-[9px] text-white/55">Distribution</span>
          <div className="flex flex-wrap gap-1">
            {ELEMENTS.filter(el => score.distribution[el] > 0).map(el => (
              <ElementBadge key={el} element={el}>
                {el[0]}:{score.distribution[el]}
              </ElementBadge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BraceletDesigner;
