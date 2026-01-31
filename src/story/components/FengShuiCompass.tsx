/**
 * ============================================================================
 * FENG SHUI COMPASS (风水罗盘)
 * ============================================================================
 *
 * A 360° compass visualization showing:
 * - 8 Cardinal/Intercardinal directions
 * - Nobleman (贵人)
 * - Wealth (财位)
 * - Peach Blossom (桃花)
 * - Conflict (冲)
 * - Sha (煞)
 * - Grand Duke (太岁)
 *
 * Created: January 2026
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import type { FengShuiDirectionDisplay, EnvironmentalSnapshot, DashboardTheme } from '../storyDashboardTypes';
import { CATHEDRAL_THEME } from '../storyDashboardTypes';

// ============================================================================
// TYPES
// ============================================================================

interface FengShuiCompassProps {
  snapshots: EnvironmentalSnapshot[];
  selectedTime?: string;
  onDirectionClick?: (direction: FengShuiDirectionDisplay) => void;
  theme?: DashboardTheme;
  size?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DIRECTION_DEGREES: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315
};

const DIRECTION_CHINESE: Record<string, string> = {
  N: '北',
  NE: '东北',
  E: '东',
  SE: '东南',
  S: '南',
  SW: '西南',
  W: '西',
  NW: '西北'
};

const ENERGY_COLORS: Record<string, string> = {
  nobleman: '#fbbf24',     // Gold
  wealth: '#22c55e',       // Green
  peachBlossom: '#f472b6', // Pink
  conflict: '#ef4444',     // Red
  sha: '#991b1b',          // Dark red
  grandDuke: '#7c3aed'     // Purple
};

const ENERGY_ICONS: Record<string, string> = {
  nobleman: '👑',
  wealth: '💰',
  peachBlossom: '🌸',
  conflict: '⚡',
  sha: '☠️',
  grandDuke: '🐉'
};

const SUITABILITY_COLORS: Record<string, string> = {
  excellent: '#22c55e',
  good: '#3b82f6',
  neutral: '#94a3b8',
  caution: '#f59e0b',
  avoid: '#ef4444'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert polar to cartesian coordinates
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

/**
 * Create SVG arc path
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const FengShuiCompass: React.FC<FengShuiCompassProps> = ({
  snapshots,
  selectedTime,
  onDirectionClick,
  theme = CATHEDRAL_THEME,
  size = 300
}) => {
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [hoveredDirection, setHoveredDirection] = useState<string | null>(null);

  // Get current snapshot
  const currentSnapshot = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null;

    if (selectedTime) {
      return snapshots.find(s => s.timestamp.startsWith(selectedTime)) || snapshots[0];
    }

    return snapshots[0];
  }, [snapshots, selectedTime]);

  const directions = currentSnapshot?.fengShui?.directions || [];

  const center = size / 2;
  const outerRadius = (size / 2) - 20;
  const innerRadius = outerRadius * 0.4;
  const labelRadius = outerRadius * 0.75;
  const iconRadius = outerRadius * 0.55;

  const handleDirectionClick = (dir: FengShuiDirectionDisplay) => {
    setSelectedDirection(dir.direction);
    onDirectionClick?.(dir);
  };

  if (!currentSnapshot) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.textMuted,
          backgroundColor: theme.colors.surface,
          borderRadius: '50%'
        }}
      >
        No Feng Shui data
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill={theme.colors.surface}
          stroke={theme.colors.border}
          strokeWidth={1}
        />

        {/* Inner decorative rings */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius * 0.9}
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={0.5}
          opacity={0.3}
        />
        <circle
          cx={center}
          cy={center}
          r={outerRadius * 0.6}
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={0.5}
          opacity={0.3}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="rgba(168, 85, 247, 0.1)"
          stroke={theme.colors.accent}
          strokeWidth={1}
        />

        {/* Direction sectors */}
        {directions.map(dir => {
          const degree = DIRECTION_DEGREES[dir.direction];
          const startAngle = degree - 22.5;
          const endAngle = degree + 22.5;
          const isSelected = selectedDirection === dir.direction;
          const isHovered = hoveredDirection === dir.direction;

          // Sector arc
          const arcPath = describeArc(center, center, outerRadius - 5, startAngle, endAngle);

          // Position for label
          const labelPos = polarToCartesian(center, center, labelRadius, degree);

          // Position for icons
          const iconPos = polarToCartesian(center, center, iconRadius, degree);

          // Calculate sector color based on suitability
          const sectorColor = SUITABILITY_COLORS[dir.suitability];
          const sectorOpacity = isSelected ? 0.4 : isHovered ? 0.3 : 0.15;

          return (
            <g
              key={dir.direction}
              onClick={() => handleDirectionClick(dir)}
              onMouseEnter={() => setHoveredDirection(dir.direction)}
              onMouseLeave={() => setHoveredDirection(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Sector wedge */}
              <path
                d={`${arcPath} L ${center} ${center} Z`}
                fill={sectorColor}
                opacity={sectorOpacity}
                stroke={isSelected ? theme.colors.gold : 'transparent'}
                strokeWidth={2}
              />

              {/* Direction line */}
              <line
                x1={center}
                y1={center}
                x2={polarToCartesian(center, center, outerRadius - 10, degree).x}
                y2={polarToCartesian(center, center, outerRadius - 10, degree).y}
                stroke={theme.colors.border}
                strokeWidth={0.5}
                opacity={0.5}
              />

              {/* Direction label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={theme.colors.text}
                fontSize={12}
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {DIRECTION_CHINESE[dir.direction]}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={theme.colors.textMuted}
                fontSize={9}
              >
                {dir.direction}
              </text>

              {/* Energy icons */}
              {dir.energies.slice(0, 2).map((energy, i) => {
                const offset = i === 0 ? -8 : 8;
                return (
                  <g key={`${dir.direction}-${energy.type}`}>
                    <circle
                      cx={iconPos.x + offset}
                      cy={iconPos.y}
                      r={10}
                      fill={ENERGY_COLORS[energy.type]}
                      opacity={0.2}
                    />
                    <text
                      x={iconPos.x + offset}
                      y={iconPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10}
                    >
                      {ENERGY_ICONS[energy.type]}
                    </text>
                  </g>
                );
              })}

              {/* Best/Avoid indicators */}
              {dir.isBest && (
                <circle
                  cx={polarToCartesian(center, center, outerRadius - 15, degree).x}
                  cy={polarToCartesian(center, center, outerRadius - 15, degree).y}
                  r={4}
                  fill={theme.colors.excellent}
                />
              )}
              {dir.isAvoid && (
                <text
                  x={polarToCartesian(center, center, outerRadius - 15, degree).x}
                  y={polarToCartesian(center, center, outerRadius - 15, degree).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={theme.colors.caution}
                  fontSize={10}
                >
                  ⚠
                </text>
              )}
            </g>
          );
        })}

        {/* Center emblem */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 5}
          fill="url(#centerGradient)"
        />
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={theme.colors.gold}
          fontSize={16}
          fontWeight="bold"
        >
          風水
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={theme.colors.textMuted}
          fontSize={10}
        >
          Feng Shui
        </text>

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
          </radialGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '16px',
          fontSize: '10px'
        }}
      >
        {Object.entries(ENERGY_ICONS).map(([type, icon]) => (
          <div
            key={type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: theme.colors.textMuted
            }}
          >
            <span>{icon}</span>
            <span style={{ textTransform: 'capitalize' }}>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
          </div>
        ))}
      </div>

      {/* Selected Direction Details */}
      {selectedDirection && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}
        >
          {(() => {
            const dir = directions.find(d => d.direction === selectedDirection);
            if (!dir) return null;

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '18px', color: theme.colors.gold, fontWeight: 'bold' }}>
                      {dir.directionChinese}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.colors.textMuted, marginLeft: '8px' }}>
                      ({dir.direction} · {dir.degree}°)
                    </span>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      backgroundColor: SUITABILITY_COLORS[dir.suitability] + '20',
                      color: SUITABILITY_COLORS[dir.suitability],
                      border: `1px solid ${SUITABILITY_COLORS[dir.suitability]}40`
                    }}
                  >
                    {dir.suitability}
                  </span>
                </div>

                {dir.energies.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginBottom: '6px' }}>
                      Energies Present:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {dir.energies.map((energy, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            backgroundColor: ENERGY_COLORS[energy.type] + '20',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: ENERGY_COLORS[energy.type]
                          }}
                        >
                          {ENERGY_ICONS[energy.type]}
                          {energy.labelChinese}
                          <span style={{ opacity: 0.7 }}>({energy.strength})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default FengShuiCompass;
