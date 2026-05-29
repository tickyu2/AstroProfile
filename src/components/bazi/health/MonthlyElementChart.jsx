import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

/**
 * Monthly Element Chart — Floating interactive line chart
 * Shows baseline vs user values across 12 earthly branch months
 * with excess/deficit shading and difference labels.
 */

const ELEMENTS = {
  wood:  { name: 'Wood',  emoji: '🌳', color: '#10b981' },
  fire:  { name: 'Fire',  emoji: '🔥', color: '#ef4444' },
  earth: { name: 'Earth', emoji: '⛰️', color: '#f59e0b' },
  water: { name: 'Water', emoji: '💧', color: '#3b82f6' },
  metal: { name: 'Metal', emoji: '⚙️', color: '#9ca3af' }
};

const TWELVE_MONTHS = [
  { short: 'Tiger',   char: '寅', season: 'Spr' },
  { short: 'Rabbit',  char: '卯', season: 'Spr' },
  { short: 'Dragon',  char: '辰', season: 'S→S' },
  { short: 'Snake',   char: '巳', season: 'Sum' },
  { short: 'Horse',   char: '午', season: 'Sum' },
  { short: 'Goat',    char: '未', season: 'S→A' },
  { short: 'Monkey',  char: '申', season: 'Aut' },
  { short: 'Rooster', char: '酉', season: 'Aut' },
  { short: 'Dog',     char: '戌', season: 'A→W' },
  { short: 'Pig',     char: '亥', season: 'Win' },
  { short: 'Rat',     char: '子', season: 'Win' },
  { short: 'Ox',      char: '丑', season: 'W→S' },
];

const ANIMALS = ['tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig','rat','ox'];

const TWELVE_MONTH_PERFECT = {
  tiger:   { wood: 35.6, fire: 27.2, earth: 12.9, metal: 5.8,  water: 18.4 },
  rabbit:  { wood: 35.6, fire: 27.2, earth: 12.9, metal: 5.8,  water: 18.4 },
  dragon:  { wood: 20.4, fire: 25.9, earth: 30.9, metal: 11.1, water: 11.7 },
  snake:   { wood: 21.6, fire: 34.3, earth: 26.1, metal: 11.8, water: 6.2  },
  horse:   { wood: 21.6, fire: 34.3, earth: 26.1, metal: 11.8, water: 6.2  },
  goat:    { wood: 13.9, fire: 19.9, earth: 31.5, metal: 22.7, water: 12.0 },
  monkey:  { wood: 7.6,  fire: 14.5, earth: 20.7, metal: 31.0, water: 26.2 },
  rooster: { wood: 7.6,  fire: 14.5, earth: 20.7, metal: 31.0, water: 26.2 },
  dog:     { wood: 13.9, fire: 13.3, earth: 31.6, metal: 17.1, water: 24.1 },
  pig:     { wood: 29.5, fire: 7.0,  earth: 13.4, metal: 18.1, water: 31.9 },
  rat:     { wood: 29.5, fire: 7.0,  earth: 13.4, metal: 18.1, water: 31.9 },
  ox:      { wood: 27.2, fire: 13.0, earth: 31.0, metal: 11.1, water: 17.6 }
};

const SEASONAL_MULTIPLIERS = {
  tiger:   { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6 },
  rabbit:  { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6 },
  dragon:  { wood: 0.6, fire: 0.8, earth: 1.0, metal: 0.4, water: 0.4 },
  snake:   { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2 },
  horse:   { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2 },
  goat:    { wood: 0.4, fire: 0.6, earth: 1.0, metal: 0.8, water: 0.4 },
  monkey:  { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8 },
  rooster: { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8 },
  dog:     { wood: 0.4, fire: 0.4, earth: 1.0, metal: 0.6, water: 0.8 },
  pig:     { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0 },
  rat:     { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0 },
  ox:      { wood: 0.8, fire: 0.4, earth: 1.0, metal: 0.4, water: 0.6 }
};

function computeUserMonthly(rawElements, animal, element) {
  const mult = SEASONAL_MULTIPLIERS[animal];
  if (!mult) return 20;
  let total = 0;
  const weighted = {};
  for (const el of Object.keys(ELEMENTS)) {
    weighted[el] = (rawElements[el] || 20) * (mult[el] || 1);
    total += weighted[el];
  }
  return total > 0 ? (weighted[element] / total) * 100 : 20;
}

// Chart dimensions
const W = 680, H = 340;
const PAD = { top: 40, right: 30, bottom: 55, left: 50 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

export default function MonthlyElementChart({ element, rawElements, birthMonthAnimal, onClose, themeMode = 'dark' }) {
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragRef = useRef(null);
  const panelRef = useRef(null);
  const isDark = themeMode === 'dark';
  const elConf = ELEMENTS[element];

  // Center on first render
  useEffect(() => {
    if (pos.x === -1 && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(20, (window.innerHeight - rect.height) / 2 - 40),
      });
    }
  }, [pos.x]);

  // Drag handlers
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragRef.current) return;
      setPos({
        x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
        y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
      });
    };
    const onMouseUp = () => { dragRef.current = null; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!elConf) return null;

  // Compute data for all 12 months
  const data = ANIMALS.map((animal, i) => {
    const baseline = TWELVE_MONTH_PERFECT[animal]?.[element] ?? 20;
    const user = computeUserMonthly(rawElements, animal, element);
    const diff = user - baseline;
    return { animal, month: TWELVE_MONTHS[i], baseline, user, diff };
  });

  // Y-axis scale: find max/min across all values + some padding
  const allVals = data.flatMap(d => [d.baseline, d.user, d.diff]);
  const yMax = Math.ceil(Math.max(...allVals, 40) / 5) * 5;
  const yMin = Math.floor(Math.min(...allVals, -5, 0) / 5) * 5;
  const yRange = yMax - yMin;

  const xStep = CW / (data.length - 1);
  const xOf = (i) => PAD.left + i * xStep;
  const yOf = (v) => PAD.top + CH - ((v - yMin) / yRange) * CH;

  // Build polyline points
  const baselinePts = data.map((d, i) => `${xOf(i)},${yOf(d.baseline)}`).join(' ');
  const userPts = data.map((d, i) => `${xOf(i)},${yOf(d.user)}`).join(' ');

  // Build area polygon between baseline and user (for shading)
  const areaForward = data.map((d, i) => `${xOf(i)},${yOf(d.user)}`).join(' ');
  const areaReverse = data.map((d, i) => `${xOf(data.length - 1 - i)},${yOf(data[data.length - 1 - i].baseline)}`).join(' ');

  // Zero line position
  const zeroY = yOf(0);

  // Diff bar points
  const diffPts = data.map((d, i) => `${xOf(i)},${yOf(d.diff)}`).join(' ');

  // Colors
  const bg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';
  const borderCol = isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.3)';
  const textPrimary = isDark ? '#e2e8f0' : '#1e293b';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.15)';

  // Birth month index
  const birthIdx = birthMonthAnimal ? ANIMALS.indexOf(birthMonthAnimal) : -1;

  const popup = (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: pos.x === -1 ? '50%' : `${pos.x}px`,
        top: pos.x === -1 ? '50%' : `${pos.y}px`,
        transform: pos.x === -1 ? 'translate(-50%, -50%)' : 'none',
        zIndex: 10000,
        background: bg, borderRadius: '16px', width: '740px', maxWidth: '95vw',
        border: `1px solid ${borderCol}`,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={onMouseDown}
        style={{
          padding: '12px 20px', borderRadius: '16px 16px 0 0',
          cursor: 'grab', userSelect: 'none',
          background: isDark
            ? `linear-gradient(135deg, ${elConf.color}20, ${elConf.color}10)`
            : `linear-gradient(135deg, ${elConf.color}15, ${elConf.color}08)`,
          borderBottom: `1px solid ${borderCol}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>{elConf.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: textPrimary }}>
                {elConf.name} — 12-Month Seasonal Profile
              </div>
              <div style={{ fontSize: '11px', color: textSecondary }}>
                Baseline vs Your Values · Excess (+) / Deficit (−)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            onMouseDown={e => e.stopPropagation()}
            style={{
              width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer',
              background: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${borderCol}`,
              color: textSecondary, fontSize: '15px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '16px 16px 8px', overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
          {/* Grid lines */}
          {Array.from({ length: Math.floor(yRange / 5) + 1 }, (_, i) => {
            const val = yMin + i * 5;
            const y = yOf(val);
            return (
              <g key={`grid-${val}`}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={gridColor} strokeWidth={val === 0 ? 1.5 : 0.5} />
                <text x={PAD.left - 6} y={y + 3} textAnchor="end" fill={textSecondary} fontSize={9}>
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Vertical grid + month labels */}
          {data.map((d, i) => {
            const x = xOf(i);
            const isBirth = i === birthIdx;
            return (
              <g key={`month-${i}`}>
                <line x1={x} y1={PAD.top} x2={x} y2={H - PAD.bottom} stroke={isBirth ? `${elConf.color}60` : gridColor} strokeWidth={isBirth ? 1.5 : 0.5} />
                <text x={x} y={H - PAD.bottom + 14} textAnchor="middle" fill={isBirth ? elConf.color : textSecondary} fontSize={9} fontWeight={isBirth ? 700 : 400}>
                  {d.month.short}
                </text>
                <text x={x} y={H - PAD.bottom + 26} textAnchor="middle" fill={isBirth ? elConf.color : (isDark ? '#475569' : '#94a3b8')} fontSize={8}>
                  {d.month.char}
                </text>
                {isBirth && (
                  <text x={x} y={H - PAD.bottom + 38} textAnchor="middle" fill={elConf.color} fontSize={7} fontWeight={700}>★ birth</text>
                )}
              </g>
            );
          })}

          {/* Shaded area between baseline and user */}
          <polygon
            points={`${areaForward} ${areaReverse}`}
            fill={elConf.color}
            opacity={0.08}
          />

          {/* Baseline line (dashed) */}
          <polyline
            points={baselinePts}
            fill="none"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            strokeWidth={1.5}
            strokeDasharray="5,3"
            opacity={0.6}
          />

          {/* User line (solid) */}
          <polyline
            points={userPts}
            fill="none"
            stroke={elConf.color}
            strokeWidth={2.5}
          />

          {/* Difference line (thin) from zero */}
          <polyline
            points={diffPts}
            fill="none"
            stroke={isDark ? '#a78bfa' : '#7c3aed'}
            strokeWidth={1}
            strokeDasharray="3,2"
            opacity={0.5}
          />

          {/* Data points + value labels */}
          {data.map((d, i) => {
            const x = xOf(i);
            const isBirth = i === birthIdx;
            return (
              <g key={`pts-${i}`}>
                {/* Baseline dot */}
                <circle cx={x} cy={yOf(d.baseline)} r={3} fill={isDark ? '#94a3b8' : '#64748b'} opacity={0.6} />
                {/* User dot */}
                <circle cx={x} cy={yOf(d.user)} r={isBirth ? 5 : 3.5} fill={elConf.color} stroke={isBirth ? '#fff' : 'none'} strokeWidth={isBirth ? 1.5 : 0} />
                {/* User value label */}
                <text x={x} y={yOf(d.user) - 8} textAnchor="middle" fill={elConf.color} fontSize={8} fontWeight={700}>
                  {d.user.toFixed(1)}
                </text>
                {/* Diff label (below zero line or above) */}
                <text
                  x={x}
                  y={yOf(d.diff) + (d.diff >= 0 ? -6 : 12)}
                  textAnchor="middle"
                  fill={d.diff > 5 ? '#ef4444' : d.diff < -5 ? '#3b82f6' : (isDark ? '#64748b' : '#94a3b8')}
                  fontSize={7}
                  fontWeight={Math.abs(d.diff) > 5 ? 700 : 400}
                >
                  {d.diff >= 0 ? '+' : ''}{d.diff.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${PAD.left + 8}, ${PAD.top - 22})`}>
            <line x1={0} y1={0} x2={18} y2={0} stroke={elConf.color} strokeWidth={2.5} />
            <text x={22} y={3} fill={textSecondary} fontSize={9}>Your Values</text>
            <line x1={90} y1={0} x2={108} y2={0} stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.6} />
            <text x={112} y={3} fill={textSecondary} fontSize={9}>Seasonal Baseline</text>
            <line x1={210} y1={0} x2={228} y2={0} stroke={isDark ? '#a78bfa' : '#7c3aed'} strokeWidth={1} strokeDasharray="3,2" opacity={0.5} />
            <text x={232} y={3} fill={textSecondary} fontSize={9}>Difference (±)</text>
          </g>
        </svg>
      </div>

      {/* Data table */}
      <div style={{ padding: '0 16px 14px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 6px', color: textSecondary, borderBottom: `1px solid ${borderCol}` }}>Month</th>
              <th style={{ textAlign: 'right', padding: '4px 6px', color: isDark ? '#94a3b8' : '#64748b', borderBottom: `1px solid ${borderCol}` }}>Baseline</th>
              <th style={{ textAlign: 'right', padding: '4px 6px', color: elConf.color, borderBottom: `1px solid ${borderCol}` }}>Yours</th>
              <th style={{ textAlign: 'right', padding: '4px 6px', color: textSecondary, borderBottom: `1px solid ${borderCol}` }}>Diff</th>
              <th style={{ textAlign: 'left', padding: '4px 6px', color: textSecondary, borderBottom: `1px solid ${borderCol}` }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              const isBirth = i === birthIdx;
              const statusColor = d.diff > 5 ? '#ef4444' : d.diff < -5 ? '#3b82f6' : '#10b981';
              const statusLabel = d.diff > 5 ? 'EXCESS' : d.diff < -5 ? 'DEFICIT' : 'OK';
              return (
                <tr key={d.animal} style={{ background: isBirth ? `${elConf.color}10` : 'transparent' }}>
                  <td style={{ padding: '3px 6px', color: isBirth ? elConf.color : textPrimary, fontWeight: isBirth ? 700 : 400 }}>
                    {d.month.char} {d.month.short} {isBirth ? '★' : ''}
                  </td>
                  <td style={{ textAlign: 'right', padding: '3px 6px', color: isDark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}>
                    {d.baseline.toFixed(1)}%
                  </td>
                  <td style={{ textAlign: 'right', padding: '3px 6px', color: elConf.color, fontWeight: 600, fontFamily: 'monospace' }}>
                    {d.user.toFixed(1)}%
                  </td>
                  <td style={{
                    textAlign: 'right', padding: '3px 6px', fontWeight: Math.abs(d.diff) > 5 ? 700 : 400, fontFamily: 'monospace',
                    color: d.diff > 5 ? '#ef4444' : d.diff < -5 ? '#3b82f6' : (isDark ? '#64748b' : '#94a3b8')
                  }}>
                    {d.diff >= 0 ? '+' : ''}{d.diff.toFixed(1)}%
                  </td>
                  <td style={{ padding: '3px 6px' }}>
                    <span style={{
                      fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px',
                      background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40`,
                    }}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return ReactDOM.createPortal(popup, document.body);
}
