/**
 * CompositeChartWheel - SVG wheel visualizer for composite midpoint chart
 *
 * Shows the composite (midpoint) planet positions on a simple zodiac wheel.
 * 12 sign slices, planet glyphs positioned by longitude, dark theme.
 *
 * GENESIS AstroProfile - February 2026
 */

import React from 'react';
import type { CompositeChart } from '../../zodiac/compatibility/compositeMidpoint';

// =============================================================================
// CONSTANTS
// =============================================================================

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_ICONS = [
  '\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D',
  '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653',
];

const PLANET_COLORS: Record<string, string> = {
  Sun: '#f97316', Moon: '#c4b5fd', Mercury: '#f59e0b', Venus: '#ec4899',
  Mars: '#ef4444', Jupiter: '#14b8a6', Saturn: '#a78bfa',
  Uranus: '#38bdf8', Neptune: '#818cf8', Pluto: '#a855f7',
};

// =============================================================================
// COMPONENT
// =============================================================================

interface CompositeChartWheelProps {
  chart: CompositeChart;
  size?: number;
}

export const CompositeChartWheel: React.FC<CompositeChartWheelProps> = ({
  chart,
  size = 210,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const innerR = size * 0.30;
  const planetR = size * 0.22;
  const signLabelR = (outerR + innerR) / 2;

  // Ecliptic longitude to SVG angle (0° Aries at top, clockwise)
  const lonToAngle = (lon: number) => {
    // In astro charts, 0° Aries is typically at the left (9 o'clock)
    // We'll place 0° Aries at top for simplicity, going clockwise
    return ((lon - 90) * Math.PI) / 180;
  };

  const polarToXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  return (
    <div className="ccw-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <circle cx={cx} cy={cy} r={outerR + 4} fill="#0f172a" />

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#1e293b" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#1e293b" strokeWidth={0.5} />

        {/* Sign divisions + labels */}
        {SIGNS.map((_, i) => {
          const startAngle = lonToAngle(i * 30);
          const midAngle = lonToAngle(i * 30 + 15);
          const outer = polarToXY(startAngle, outerR);
          const inner = polarToXY(startAngle, innerR);
          const labelPos = polarToXY(midAngle, signLabelR);

          return (
            <g key={i}>
              {/* Division line */}
              <line
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#1e293b"
                strokeWidth={0.5}
              />
              {/* Sign glyph */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill="#4b5563"
              >
                {SIGN_ICONS[i]}
              </text>
            </g>
          );
        })}

        {/* Inner circle fill */}
        <circle cx={cx} cy={cy} r={innerR} fill="#020617" fillOpacity={0.6} />

        {/* Composite planet points */}
        {chart.points.map((point, i) => {
          const angle = lonToAngle(point.longitude);
          const pos = polarToXY(angle, planetR);
          const color = PLANET_COLORS[point.name] || '#9ca3af';

          // Offset label slightly outward to avoid overlap
          const labelPos = polarToXY(angle, planetR + 14);

          return (
            <g key={point.name}>
              {/* Line from center to point */}
              <line
                x1={cx} y1={cy}
                x2={pos.x} y2={pos.y}
                stroke={color}
                strokeWidth={0.4}
                strokeOpacity={0.3}
              />
              {/* Planet dot */}
              <circle
                cx={pos.x} cy={pos.y}
                r={4}
                fill={color}
                stroke="#0f172a"
                strokeWidth={1.5}
              />
              {/* Planet icon */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill={color}
              >
                {point.icon}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text
          x={cx} y={cx - 6}
          textAnchor="middle"
          fontSize="8"
          fill="#6b7280"
          fontWeight="600"
          textTransform="uppercase"
        >
          Composite
        </text>
        <text
          x={cx} y={cx + 5}
          textAnchor="middle"
          fontSize="7"
          fill="#4b5563"
        >
          {chart.method}
        </text>
      </svg>

      {/* Planet legend */}
      <div className="ccw-legend">
        {chart.points.map(p => (
          <span
            key={p.name}
            className="ccw-legend-item"
            style={{ color: PLANET_COLORS[p.name] || '#9ca3af' }}
          >
            {p.icon} {p.sign.slice(0, 3)} {Math.floor(p.degree)}{'\u00B0'}
          </span>
        ))}
      </div>

      <style>{`
        .ccw-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .ccw-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
        }

        .ccw-legend-item {
          font-size: 9px;
          font-weight: 600;
          padding: 1px 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default CompositeChartWheel;
