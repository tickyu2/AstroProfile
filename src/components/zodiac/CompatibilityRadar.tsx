/**
 * CompatibilityRadar - 5-axis SVG radar for synastry chamber scores
 *
 * Visualizes Core, Passion, Communication, Growth, and Transformation
 * as a filled polygon on a pentagonal grid. Dark theme, inline CSS.
 *
 * GENESIS AstroProfile - February 2026
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface RadarScores {
  core: number;           // 0-100
  passion: number;        // 0-100
  communication: number;  // 0-100
  growth: number;         // 0-100
  transformation: number; // 0-100
}

interface CompatibilityRadarProps {
  scores: RadarScores;
  size?: number;  // SVG width/height (default 200)
}

// =============================================================================
// CONSTANTS
// =============================================================================

const AXES = [
  { key: 'core' as const,           label: 'Core',      color: '#f97316', icon: '\u2609' },
  { key: 'passion' as const,        label: 'Passion',   color: '#ec4899', icon: '\u2640' },
  { key: 'communication' as const,  label: 'Comm',      color: '#f59e0b', icon: '\u263F' },
  { key: 'growth' as const,         label: 'Growth',    color: '#14b8a6', icon: '\u2643' },
  { key: 'transformation' as const, label: 'Transform', color: '#a855f7', icon: '\u2645' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const CompatibilityRadar: React.FC<CompatibilityRadarProps> = ({
  scores,
  size = 200,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35;
  const labelR = maxR + 18;
  const n = AXES.length;

  // Get angle for axis index (start from top)
  const getAngle = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;

  // Build polygon points for the data shape
  const dataPoints = AXES.map((axis, i) => {
    const value = scores[axis.key] ?? 0;
    const r = (Math.min(100, Math.max(0, value)) / 100) * maxR;
    const angle = getAngle(i);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  // Build concentric grid polygons
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map(f =>
    AXES.map((_, i) => {
      const angle = getAngle(i);
      const r = maxR * f;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ')
  );

  // Build axis lines
  const axisLines = AXES.map((_, i) => {
    const angle = getAngle(i);
    return {
      x2: cx + maxR * Math.cos(angle),
      y2: cy + maxR * Math.sin(angle),
    };
  });

  // Overall score
  const overall = Math.round(
    (scores.core + scores.passion + scores.communication + scores.growth + scores.transformation) / 5
  );

  return (
    <div className="compat-radar-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <circle cx={cx} cy={cy} r={maxR + 6} fill="#0f172a" />

        {/* Grid polygons */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#1e293b"
            strokeWidth={i === gridPolygons.length - 1 ? 1 : 0.5}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={line.x2}
            y2={line.y2}
            stroke="#1e293b"
            strokeWidth={0.5}
          />
        ))}

        {/* Data polygon - gradient fill */}
        <defs>
          <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0.12} />
          </radialGradient>
        </defs>
        <polygon
          points={dataPoints}
          fill="url(#radar-gradient)"
          stroke="#fbbf24"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Data points (dots on vertices) */}
        {AXES.map((axis, i) => {
          const value = scores[axis.key] ?? 0;
          const r = (Math.min(100, Math.max(0, value)) / 100) * maxR;
          const angle = getAngle(i);
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <circle
              key={axis.key}
              cx={x}
              cy={y}
              r={3}
              fill={axis.color}
              stroke="#0f172a"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis labels */}
        {AXES.map((axis, i) => {
          const angle = getAngle(i);
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          return (
            <g key={axis.key}>
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill={axis.color}
              >
                {axis.icon}
              </text>
              <text
                x={x}
                y={y + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill="#9ca3af"
                fontWeight="500"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Center overall score */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="800"
          fill="#fbbf24"
        >
          {overall}%
        </text>
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fill="#6b7280"
          textTransform="uppercase"
        >
          overall
        </text>
      </svg>

      <style>{`
        .compat-radar-container {
          display: flex;
          justify-content: center;
          padding: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default CompatibilityRadar;
