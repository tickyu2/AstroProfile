/**
 * DestinyCurve - SVG visualization of the relationship's energetic profile
 *
 * Renders the five chamber scores as a smooth curve, showing the relationship's
 * "destiny signature" — its peaks of strength and valleys of growth.
 *
 * GENESIS AstroProfile - February 2026
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface DestinyPoint {
  label: string;
  icon: string;
  value: number;   // 0-100
  color: string;
}

interface DestinyCurveProps {
  points: DestinyPoint[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DestinyCurve: React.FC<DestinyCurveProps> = ({ points }) => {
  if (points.length < 2) return null;

  const width = 340;
  const height = 120;
  const padL = 28;
  const padR = 16;
  const padT = 14;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const n = points.length;

  // Convert data to x,y coordinates
  const coords = points.map((p, i) => ({
    x: padL + (i / (n - 1)) * plotW,
    y: padT + (1 - Math.min(100, Math.max(0, p.value)) / 100) * plotH,
  }));

  // Build smooth SVG path using cardinal spline approximation
  const pathD = coords.reduce((d, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    // Simple quadratic curve for smoothness
    const prev = coords[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${d} Q ${cpx} ${prev.y}, ${pt.x} ${pt.y}`;
  }, '');

  // Build gradient fill path (close to bottom)
  const fillD = `${pathD} L ${coords[n - 1].x} ${padT + plotH} L ${coords[0].x} ${padT + plotH} Z`;

  return (
    <div className="dc-container">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="dc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x={0} y={0} width={width} height={height} rx={8} fill="#0f172a" />

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => {
          const y = padT + (1 - v / 100) * plotH;
          return (
            <g key={v}>
              <line
                x1={padL} y1={y}
                x2={padL + plotW} y2={y}
                stroke="#1e293b"
                strokeWidth={v === 50 ? 0.8 : 0.4}
              />
              <text
                x={padL - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="7"
                fill="#4b5563"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Fill area */}
        <path d={fillD} fill="url(#dc-grad)" />

        {/* Curve line */}
        <path d={pathD} fill="none" stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" />

        {/* Data points */}
        {coords.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r={4} fill={points[i].color} stroke="#0f172a" strokeWidth={1.5} />
            {/* Icon label below x-axis */}
            <text
              x={pt.x}
              y={padT + plotH + 10}
              textAnchor="middle"
              fontSize="10"
              fill={points[i].color}
            >
              {points[i].icon}
            </text>
            <text
              x={pt.x}
              y={padT + plotH + 22}
              textAnchor="middle"
              fontSize="6.5"
              fill="#6b7280"
            >
              {points[i].label}
            </text>
            {/* Score above dot */}
            <text
              x={pt.x}
              y={pt.y - 7}
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill={points[i].color}
            >
              {points[i].value}%
            </text>
          </g>
        ))}
      </svg>

      <style>{`
        .dc-container {
          display: flex;
          justify-content: center;
          padding: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default DestinyCurve;
