/**
 * EngineeredBraceletVisualizer — SVG circular bracelet visualization
 * for the new Qi-flow engineering system (Steps 1–7).
 *
 * Renders:
 *   - Beads in circular layout with element colors
 *   - Anchor stones with glow effect
 *   - Sheng-cycle flow lines between generative pairs
 *   - Wrist orientation indicator (吸氣 / 出氣)
 *   - Center Qi summary
 *   - Hover tooltips with stone name, element, QiUnit
 *
 * Uses the same SVG + Tailwind patterns as BraceletDashboard/BraceletDesigner.
 */

import React, { useState } from 'react';
import { GENERATES } from './elemConstants';

// ============================================================================
// ELEMENT COLORS — matches existing system palette
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const ELEM_GLOW = {
  Wood: 'rgba(34,197,94,0.5)',
  Fire: 'rgba(239,68,68,0.5)',
  Earth: 'rgba(245,158,11,0.5)',
  Metal: 'rgba(161,161,170,0.5)',
  Water: 'rgba(59,130,246,0.5)',
};

// ============================================================================
// BRACELET RING — Circular SVG bead layout
// ============================================================================

/**
 * @param {Object} props
 * @param {import('../../data/stoneDatabase').EngineeredBead[]} props.beads
 * @param {'left'|'right'} props.wrist
 * @param {string} props.wristReason
 * @param {import('../../data/stoneDatabase').CollapseReport} [props.collapse]
 * @param {Record<string, number>} [props.qiTotals]
 * @param {number} [props.size]
 * @param {boolean} [props.isDark]
 */
export default function EngineeredBraceletVisualizer({
  beads = [],
  wrist = 'left',
  wristReason = '',
  collapse = null,
  qiTotals = null,
  size = 320,
  isDark = true,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 28;
  const beadRadius = Math.max(7, Math.min(12, size / (beads.length * 1.4)));

  // Detect anchor positions (first and ~midpoint — they share the same stone)
  const anchorPositions = new Set();
  if (beads.length >= 3) {
    anchorPositions.add(0);
    anchorPositions.add(Math.floor(beads.length / 2));
  }

  // Total Qi for center display
  const totalQi = qiTotals
    ? Object.values(qiTotals).reduce((a, b) => a + b, 0)
    : beads.reduce((s, b) => s + (b.qiUnit || 0), 0);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* === SVG Bracelet Ring === */}
      <svg
        width={size}
        height={size}
        className="mx-auto"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))' }}
      >
        <defs>
          {/* Anchor glow filter */}
          <filter id="anchor-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Qi flow gradient */}
          <linearGradient id="sheng-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.3)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0.05)" />
          </linearGradient>
        </defs>

        {/* Wrist circle (subtle background ring) */}
        <circle
          cx={cx} cy={cy} r={radius + 4}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}
          strokeWidth={beadRadius * 2 + 6}
        />

        {/* Sheng flow lines between generative pairs */}
        {beads.map((bead, i) => {
          const next = beads[(i + 1) % beads.length];
          if (!next || GENERATES[bead.element] !== next.element) return null;

          const angle1 = ((i / beads.length) * 360 - 90) * (Math.PI / 180);
          const angle2 = (((i + 1) / beads.length) * 360 - 90) * (Math.PI / 180);

          return (
            <line
              key={`flow-${i}`}
              x1={cx + radius * Math.cos(angle1)}
              y1={cy + radius * Math.sin(angle1)}
              x2={cx + radius * Math.cos(angle2)}
              y2={cy + radius * Math.sin(angle2)}
              stroke="rgba(34,197,94,0.18)"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          );
        })}

        {/* Beads */}
        {beads.map((bead, i) => {
          const angleDeg = (i / beads.length) * 360 - 90;
          const angle = angleDeg * (Math.PI / 180);
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          const isAnchor = anchorPositions.has(i);
          const isHovered = hoveredIdx === i;
          const color = bead.stone?.color || ELEM_COLORS[bead.element] || '#888';

          return (
            <g
              key={`bead-${i}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Anchor glow ring */}
              {isAnchor && (
                <circle
                  cx={x} cy={y} r={beadRadius + 4}
                  fill="none"
                  stroke={ELEM_GLOW[bead.element] || 'rgba(255,255,255,0.3)'}
                  strokeWidth={2}
                  filter="url(#anchor-glow)"
                  opacity={0.7}
                />
              )}

              {/* Bead circle */}
              <circle
                cx={x} cy={y}
                r={isHovered ? beadRadius + 1.5 : beadRadius}
                fill={color}
                stroke={
                  isAnchor
                    ? 'rgba(255,255,255,0.7)'
                    : bead.stone?.polarity === 'Yang'
                      ? 'rgba(255,255,255,0.45)'
                      : bead.stone?.polarity === 'Yin-Yang'
                        ? 'rgba(255,255,255,0.35)'
                        : 'rgba(255,255,255,0.15)'
                }
                strokeWidth={isAnchor ? 2 : 1.2}
                style={{
                  transition: 'r 0.15s ease, stroke-width 0.15s ease',
                }}
              />

              {/* Element initial on larger beads */}
              {beadRadius >= 9 && (
                <text
                  x={x} y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize={beadRadius * 0.9}
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {bead.element?.[0]}
                </text>
              )}

              {/* SVG tooltip */}
              <title>
                {`${bead.stone?.name || 'Unknown'}${bead.stone?.chineseName ? ` (${bead.stone.chineseName})` : ''}\n` +
                  `${bead.element} · ${bead.stone?.polarity || '?'}\n` +
                  `Qi: ${(bead.qiUnit || 0).toFixed(3)}\n` +
                  `${bead.size || 10}mm${isAnchor ? ' · Anchor Stone' : ''}`}
              </title>
            </g>
          );
        })}

        {/* Center info */}
        <text
          x={cx} y={cy - 14}
          textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
          fontSize={13} fontWeight="600"
        >
          {beads.length} beads
        </text>
        <text
          x={cx} y={cy + 2}
          textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'}
          fontSize={10}
        >
          Qi: {totalQi.toFixed(2)}
        </text>
        <text
          x={cx} y={cy + 16}
          textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}
          fontSize={9}
        >
          Sheng cycle
        </text>
      </svg>

      {/* === Wrist Indicator === */}
      <div className={`text-center px-4 py-2 rounded-lg border ${
        isDark
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          {wrist === 'left' ? '← Left Wrist (吸氣 Absorb)' : 'Right Wrist (出氣 Release) →'}
        </div>
        {wristReason && (
          <div className={`text-[11px] mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            {wristReason}
          </div>
        )}
      </div>

      {/* === Hovered Bead Detail === */}
      {hoveredIdx !== null && beads[hoveredIdx] && (
        <HoveredBeadDetail bead={beads[hoveredIdx]} index={hoveredIdx} isAnchor={anchorPositions.has(hoveredIdx)} isDark={isDark} />
      )}
    </div>
  );
}

// ============================================================================
// HOVERED BEAD DETAIL — Expanded info when hovering a bead
// ============================================================================

function HoveredBeadDetail({ bead, index, isAnchor, isDark }) {
  const color = bead.stone?.color || ELEM_COLORS[bead.element] || '#888';

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
      isDark
        ? 'bg-slate-800/70 border-slate-700/50'
        : 'bg-white/90 border-slate-200'
    }`}>
      {/* Color dot */}
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 24, height: 24,
          backgroundColor: color,
          boxShadow: isAnchor ? `0 0 8px ${ELEM_GLOW[bead.element]}` : 'none',
          border: isAnchor ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.2)',
        }}
      />
      {/* Info */}
      <div>
        <div className={`text-sm font-semibold ${isDark ? 'text-white/85' : 'text-slate-800'}`}>
          {bead.stone?.name || 'Unknown'}
          {bead.stone?.chineseName && (
            <span className={`ml-1.5 font-normal ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              ({bead.stone.chineseName})
            </span>
          )}
        </div>
        <div className={`text-[11px] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          {bead.element} · {bead.stone?.polarity || '?'} · {bead.size || 10}mm · Qi {(bead.qiUnit || 0).toFixed(3)}
          {isAnchor && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Anchor
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// QI TOTALS BAR — Element breakdown with proportional bars
// ============================================================================

/**
 * Horizontal bar chart showing Qi totals per element.
 *
 * @param {Object} props
 * @param {Record<string, number>} props.qiTotals
 * @param {boolean} [props.isDark]
 */
export function QiTotalsBar({ qiTotals, isDark = true }) {
  if (!qiTotals) return null;

  const ELS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const maxQi = Math.max(...ELS.map(el => qiTotals[el] || 0), 0.01);

  return (
    <div className="space-y-1.5 w-full">
      {ELS.map(el => {
        const qi = qiTotals[el] || 0;
        const pct = (qi / maxQi) * 100;

        return (
          <div key={el} className="flex items-center gap-2">
            <div className={`text-[11px] w-12 text-right font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              {el}
            </div>
            <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(pct, 1)}%`,
                  backgroundColor: ELEM_COLORS[el],
                  opacity: qi > 0 ? 0.8 : 0.15,
                }}
              />
            </div>
            <div className={`text-[11px] w-10 font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              {qi.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COLLAPSE DIAGNOSIS PANEL — Shows collapse type, severity, strategy
// ============================================================================

/**
 * @param {Object} props
 * @param {import('../../data/stoneDatabase').CollapseReport} props.collapse
 * @param {boolean} [props.isDark]
 */
export function CollapseDiagnosisPanel({ collapse, isDark = true }) {
  if (!collapse) return null;

  const severityColors = {
    none: 'text-green-400 bg-green-900/20 border-green-500/30',
    mild: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    moderate: 'text-orange-400 bg-orange-900/20 border-orange-500/30',
    severe: 'text-red-400 bg-red-900/20 border-red-500/30',
  };

  const severityStyle = severityColors[collapse.severity] || severityColors.none;

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${
      isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Collapse Diagnosis
        </div>
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${severityStyle}`}>
          {collapse.severity.toUpperCase()}
        </span>
      </div>

      {/* Type */}
      {collapse.type && (
        <div className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
          {collapse.type}
        </div>
      )}

      {/* Forbidden / Recommended */}
      <div className="flex gap-4">
        {collapse.forbidden.length > 0 && (
          <div>
            <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-red-400/60' : 'text-red-500'}`}>
              Forbidden
            </div>
            <div className="flex gap-1">
              {collapse.forbidden.map(el => (
                <span
                  key={el}
                  className="px-1.5 py-0.5 rounded text-[11px] font-medium border border-red-500/30 bg-red-900/20 text-red-300"
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        )}
        {collapse.recommended.length > 0 && (
          <div>
            <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-green-400/60' : 'text-green-500'}`}>
              Recommended
            </div>
            <div className="flex gap-1">
              {collapse.recommended.map(el => (
                <span
                  key={el}
                  className="px-1.5 py-0.5 rounded text-[11px] font-medium border border-green-500/30 bg-green-900/20 text-green-300"
                  style={{ borderLeftColor: ELEM_COLORS[el], borderLeftWidth: 3 }}
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategy */}
      {collapse.strategy && (
        <div className={`text-[12px] leading-relaxed ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
          {collapse.strategy}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BRACELET SUMMARY CARD — Complete bracelet overview for sharing
// ============================================================================

/**
 * @param {Object} props
 * @param {import('../../data/stoneDatabase').EngineeredBracelet} props.bracelet
 * @param {string} [props.monthLabel]
 * @param {boolean} [props.isDark]
 */
export function BraceletSummaryCard({ bracelet, monthLabel = '', isDark = true }) {
  if (!bracelet) return null;

  const ELS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  // Deduplicated stone list with counts
  const stoneCounts = {};
  for (const b of bracelet.beads) {
    const key = b.stone?.name || 'Unknown';
    if (!stoneCounts[key]) {
      stoneCounts[key] = { stone: b.stone, count: 0, element: b.element };
    }
    stoneCounts[key].count++;
  }
  const stoneList = Object.values(stoneCounts).sort((a, b) => b.count - a.count);

  return (
    <div className={`rounded-lg border p-4 space-y-4 ${
      isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Bracelet Summary{monthLabel ? ` — ${monthLabel}` : ''}
        </div>
        <div className={`text-[11px] px-2 py-0.5 rounded ${
          isDark ? 'bg-slate-800 text-white/50' : 'bg-slate-100 text-slate-500'
        }`}>
          {bracelet.totalBeads} beads · {bracelet.wrist === 'left' ? 'Left (吸氣)' : 'Right (出氣)'}
        </div>
      </div>

      {/* Target Ratios */}
      <div>
        <div className={`text-[10px] uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
          Target Ratios
        </div>
        <div className="flex gap-1.5">
          {ELS.filter(el => bracelet.targetRatios[el] > 0).map(el => (
            <div
              key={el}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px]"
              style={{
                backgroundColor: `${ELEM_COLORS[el]}15`,
                border: `1px solid ${ELEM_COLORS[el]}30`,
                color: ELEM_COLORS[el],
              }}
            >
              <span className="font-semibold">{el}</span>
              <span className="opacity-70">{(bracelet.targetRatios[el] * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stone List */}
      <div>
        <div className={`text-[10px] uppercase tracking-wider mb-1.5 ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
          Stones
        </div>
        <div className="space-y-1">
          {stoneList.map(({ stone, count, element }) => (
            <div key={stone?.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: stone?.color || ELEM_COLORS[element] }}
              />
              <div className={`text-[12px] flex-1 ${isDark ? 'text-white/65' : 'text-slate-600'}`}>
                {stone?.name || 'Unknown'}
                {stone?.chineseName && (
                  <span className={isDark ? 'text-white/30' : 'text-slate-400'}> ({stone.chineseName})</span>
                )}
              </div>
              <div className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                ×{count}
              </div>
              <div className={`text-[11px] font-mono ${isDark ? 'text-white/30' : 'text-slate-300'}`}>
                {element}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      {bracelet.narrative && (
        <div className={`text-[12px] leading-relaxed pt-2 border-t ${
          isDark ? 'text-white/40 border-slate-700/50' : 'text-slate-500 border-slate-200'
        }`}>
          {bracelet.narrative}
        </div>
      )}
    </div>
  );
}
