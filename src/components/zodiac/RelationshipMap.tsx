/**
 * RelationshipMap - SVG network visualization of the five chambers
 *
 * Shows Composite at center with five chamber nodes orbiting around it.
 * Edge thickness = score strength. Node size = score magnitude.
 * Subtle breathing animation via CSS keyframes.
 *
 * GENESIS AstroProfile - February 2026
 */

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface MapChamber {
  key: string;
  label: string;
  icon: string;
  score: number;    // 0-100
  color: string;
}

interface RelationshipMapProps {
  chambers: MapChamber[];
  overall: number;  // 0-100
  size?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const RelationshipMap: React.FC<RelationshipMapProps> = ({
  chambers,
  overall,
  size = 280,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const orbitR = size * 0.32;
  const n = chambers.length;

  // Place chambers in a circle around center
  const getAngle = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;

  const nodes = chambers.map((ch, i) => {
    const angle = getAngle(i);
    return {
      ...ch,
      x: cx + orbitR * Math.cos(angle),
      y: cy + orbitR * Math.sin(angle),
      r: 8 + (ch.score / 100) * 10, // radius 8-18 based on score
    };
  });

  // Overall score color
  const overallColor = overall >= 70 ? '#22c55e'
    : overall >= 55 ? '#84cc16'
    : overall >= 45 ? '#eab308'
    : overall >= 30 ? '#f97316'
    : '#ef4444';

  return (
    <div className="rm-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <rect x={0} y={0} width={size} height={size} rx={12} fill="#0f172a" />

        {/* Orbit ring (subtle guide) */}
        <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="#1e293b" strokeWidth={0.5} strokeDasharray="4 4" />

        {/* Edges: center → each node */}
        {nodes.map((node, i) => {
          const weight = node.score / 100;
          return (
            <line
              key={`edge-${i}`}
              x1={cx}
              y1={cy}
              x2={node.x}
              y2={node.y}
              stroke={node.color}
              strokeWidth={1 + weight * 2.5}
              strokeOpacity={0.25 + weight * 0.35}
            />
          );
        })}

        {/* Inter-chamber edges (faint connections between adjacent chambers) */}
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % n];
          const avgScore = (node.score + next.score) / 200;
          return (
            <line
              key={`inter-${i}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke="#334155"
              strokeWidth={0.5 + avgScore * 1.5}
              strokeOpacity={0.15 + avgScore * 0.2}
            />
          );
        })}

        {/* Center node: Composite */}
        <circle
          cx={cx}
          cy={cy}
          r={18}
          fill="#0f172a"
          stroke={overallColor}
          strokeWidth={2}
          className="rm-center-pulse"
        />
        <text
          x={cx}
          y={cy - 3}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="800"
          fill={overallColor}
        >
          {overall}%
        </text>
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="6"
          fill="#6b7280"
          textTransform="uppercase"
        >
          composite
        </text>

        {/* Chamber nodes */}
        {nodes.map((node, i) => (
          <g key={node.key}>
            {/* Glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 3}
              fill="none"
              stroke={node.color}
              strokeWidth={0.5}
              strokeOpacity={0.2}
            />
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="#0f172a"
              stroke={node.color}
              strokeWidth={1.5}
            />
            {/* Icon */}
            <text
              x={node.x}
              y={node.y - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill={node.color}
            >
              {node.icon}
            </text>
            {/* Score below node */}
            <text
              x={node.x}
              y={node.y + node.r + 10}
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill={node.color}
            >
              {node.score}%
            </text>
            {/* Label below score */}
            <text
              x={node.x}
              y={node.y + node.r + 20}
              textAnchor="middle"
              fontSize="7"
              fill="#6b7280"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <style>{`
        .rm-container {
          display: flex;
          justify-content: center;
          padding: 4px 0;
        }

        @keyframes rm-pulse {
          0%, 100% { stroke-opacity: 1; }
          50% { stroke-opacity: 0.5; }
        }

        .rm-center-pulse {
          animation: rm-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RelationshipMap;
