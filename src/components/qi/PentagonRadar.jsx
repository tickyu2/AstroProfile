/**
 * PentagonRadar — lightweight SVG five-element radar with optional overlay.
 * QiBar — horizontal bar chart for raw Qi point values.
 */
import React from 'react';

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const RADAR_ANGLES = ELEMENTS.map((_, i) => (Math.PI / 2) - (2 * Math.PI * i) / 5);
const RADAR_ELEMENT_ICONS = { Wood: '🌿', Fire: '🔥', Earth: '⛰️', Metal: '⚙️', Water: '💧' };

function qiToRadarPoints(qi, cx, cy, radius) {
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  if (total === 0) return RADAR_ANGLES.map(() => ({ x: cx, y: cy }));
  return ELEMENTS.map((el, i) => {
    const pct = (qi[el] || 0) / total;
    const r = pct * radius * 4;
    const clampedR = Math.min(r, radius);
    return {
      x: cx + clampedR * Math.cos(RADAR_ANGLES[i]),
      y: cy - clampedR * Math.sin(RADAR_ANGLES[i]),
    };
  });
}

function pentagonGridPoints(cx, cy, radius, level) {
  return ELEMENTS.map((_, i) => {
    const r = radius * level;
    return `${cx + r * Math.cos(RADAR_ANGLES[i])},${cy - r * Math.sin(RADAR_ANGLES[i])}`;
  }).join(' ');
}

/**
 * @param {object} qi - primary Qi distribution { Wood, Fire, Earth, Metal, Water }
 * @param {object} [overlayQi] - secondary Qi to superimpose (dimmed dashed)
 * @param {string} [label] - chart label
 * @param {string} [overlayLabel] - overlay label
 * @param {number} [size] - SVG size in px
 */
export function PentagonRadar({ qi, overlayQi, label = 'Current', overlayLabel = 'Natal', size = 180, primaryColor, primaryFill }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const labelR = size * 0.46;
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const pts = qiToRadarPoints(qi, cx, cy, radius);
  const ptsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

  const overlayPts = overlayQi ? qiToRadarPoints(overlayQi, cx, cy, radius) : null;
  const overlayStr = overlayPts ? overlayPts.map(p => `${p.x},${p.y}`).join(' ') : '';

  const totalPrimary = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible" style={{ overflow: 'visible' }}>
        {/* Grid rings */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={pentagonGridPoints(cx, cy, radius, level)}
            fill="none"
            stroke={i === gridLevels.length - 1 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'}
            strokeWidth={i === gridLevels.length - 1 ? 1.5 : 0.7}
          />
        ))}

        {/* Axis lines */}
        {ELEMENTS.map((_, i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + radius * Math.cos(RADAR_ANGLES[i])}
            y2={cy - radius * Math.sin(RADAR_ANGLES[i])}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={0.7}
          />
        ))}

        {/* Overlay shape (dimmed, behind primary) */}
        {overlayStr && (
          <>
            <polygon
              points={overlayStr}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            {overlayPts.map((p, i) => (
              <circle key={`od${i}`} cx={p.x} cy={p.y} r={3} fill="rgba(255,255,255,0.5)" />
            ))}
          </>
        )}

        {/* Primary shape */}
        <polygon points={ptsStr} fill={primaryFill || "rgba(251,191,36,0.25)"} stroke={primaryColor || "#fbbf24"} strokeWidth={2.5} />
        {pts.map((p, i) => (
          <circle key={`pd${i}`} cx={p.x} cy={p.y} r={3.5}
            fill={ELEM_COLORS[ELEMENTS[i]]} stroke="#000" strokeWidth={1} />
        ))}

        {/* Element labels */}
        {ELEMENTS.map((el, i) => {
          const lx = cx + labelR * Math.cos(RADAR_ANGLES[i]);
          const ly = cy - labelR * Math.sin(RADAR_ANGLES[i]);
          const pct = totalPrimary > 0 ? ((qi[el] || 0) / totalPrimary * 100).toFixed(0) : '0';
          return (
            <text key={el} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="central"
              fill={ELEM_COLORS[el]} fontSize={11} fontFamily="monospace" fontWeight="bold"
            >
              {RADAR_ELEMENT_ICONS[el]} {pct}%
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-4 h-1 rounded" style={{ backgroundColor: primaryColor || '#fbbf24' }} />
          <span className="font-semibold" style={{ color: primaryColor || '#fde68a' }}>{label}</span>
        </div>
        {overlayQi && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 border border-white/50 border-dashed rounded" />
            <span className="text-gray-300">{overlayLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Horizontal bar chart for raw Qi point values.
 * @param {object} qi - { Wood, Fire, Earth, Metal, Water }
 * @param {number} [maxPts] - override max for bar scaling
 * @param {boolean} [showPct] - show percentage column
 */
export function QiBar({ qi, maxPts, showPct }) {
  const max = maxPts || Math.max(...ELEMENTS.map(k => qi[k]), 1);
  const total = showPct ? ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0) : 0;
  return (
    <div className="space-y-1">
      {ELEMENTS.map(el => {
        const pct = Math.min((qi[el] / max) * 100, 100);
        const val = qi[el];
        const elPct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
        return (
          <div key={el} className="flex items-center gap-2 text-xs">
            <span className="w-12 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>
              {el}
            </span>
            <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden relative">
              <div className="h-full rounded transition-all" style={{
                width: `${Math.max(pct, val > 0 ? 1 : 0)}%`,
                backgroundColor: ELEM_COLORS[el],
                opacity: 0.8,
              }} />
              <span className="absolute inset-0 flex items-center px-1.5 text-[10px] font-mono font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {val > 0 ? `${val.toFixed(3)}` : ''}
              </span>
            </div>
            {showPct && (
              <span className="w-12 text-right text-[10px] font-mono font-semibold text-white">{elPct}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PentagonRadar;
