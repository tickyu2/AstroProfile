/**
 * EnneagramAlchemicalRose Component
 *
 * A 9-petaled SVG Rose Window visualization for Enneagram scores.
 * Uses "refractive shimmer" stained glass aesthetic - distinct from astrology's breath.
 *
 * Features:
 *   - 9 petals at 40° intervals (360° / 9)
 *   - Petal size proportional to type score (0-10)
 *   - THREE-LAYER glass effect:
 *     1. Base Glass (Art Nouveau structure) - enneagram-petal-glass
 *     2. Shimmer Layer (internal light play) - shimmer-layer
 *     3. Divine Points (Michelangelo detail) - divine-point
 *   - Golden center with φ symbol
 *   - Sacred geometry rings
 *   - Stained glass refractive animations
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';
import { ENNEAGRAM_TYPES, PHI } from './enneagramData';

// Import the stained glass CSS
import '../playground/soulGarden/genesis.css';

const PHI_SQ = PHI * PHI; // 2.618

/**
 * Generate a petal path using quadratic Bezier curves
 * Art Nouveau style with organic curves
 * Returns both the path and tip coordinates for divine point placement
 */
function generatePetalPath(centerX, centerY, angle, innerRadius, outerRadius, petalWidth = 0.25) {
  const angleRad = (angle - 90) * (Math.PI / 180); // -90 to start at top

  // Calculate control points for organic curve
  const midRadius = (innerRadius + outerRadius) * 0.618; // Golden section

  // Tip of the petal
  const tipX = centerX + outerRadius * Math.cos(angleRad);
  const tipY = centerY + outerRadius * Math.sin(angleRad);

  // Base points (slightly spread for petal width)
  const baseAngleOffset = petalWidth;
  const baseLeftX = centerX + innerRadius * Math.cos(angleRad - baseAngleOffset);
  const baseLeftY = centerY + innerRadius * Math.sin(angleRad - baseAngleOffset);
  const baseRightX = centerX + innerRadius * Math.cos(angleRad + baseAngleOffset);
  const baseRightY = centerY + innerRadius * Math.sin(angleRad + baseAngleOffset);

  // Control points for bezier curves
  const ctrlLeftX = centerX + midRadius * Math.cos(angleRad - baseAngleOffset * 0.5);
  const ctrlLeftY = centerY + midRadius * Math.sin(angleRad - baseAngleOffset * 0.5);
  const ctrlRightX = centerX + midRadius * Math.cos(angleRad + baseAngleOffset * 0.5);
  const ctrlRightY = centerY + midRadius * Math.sin(angleRad + baseAngleOffset * 0.5);

  const path = `
    M ${baseLeftX} ${baseLeftY}
    Q ${ctrlLeftX} ${ctrlLeftY} ${tipX} ${tipY}
    Q ${ctrlRightX} ${ctrlRightY} ${baseRightX} ${baseRightY}
    Z
  `;

  return { path, tipX, tipY };
}

/**
 * Generate connecting line between two types (for arrows)
 */
function generateArrowPath(centerX, centerY, fromType, toType, radius) {
  const fromAngle = ((fromType - 1) * 40 - 90) * (Math.PI / 180);
  const toAngle = ((toType - 1) * 40 - 90) * (Math.PI / 180);

  const x1 = centerX + radius * Math.cos(fromAngle);
  const y1 = centerY + radius * Math.sin(fromAngle);
  const x2 = centerX + radius * Math.cos(toAngle);
  const y2 = centerY + radius * Math.sin(toAngle);

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export default function EnneagramAlchemicalRose({
  scores = {},
  dominantType = null,
  showArrows = true,
  alchemical = true,
  size = 400
}) {
  const centerX = 50;
  const centerY = 50;
  const innerRadius = 12;
  const baseOuterRadius = innerRadius * PHI; // ~19.4
  const maxOuterRadius = innerRadius * PHI_SQ; // ~31.4

  // Calculate outer radius for each petal based on score
  const getOuterRadius = (type) => {
    const score = scores[type] || 0;
    const normalized = score / 10; // 0 to 1
    return baseOuterRadius + (maxOuterRadius - baseOuterRadius) * normalized;
  };

  // Get dominant type data
  const dominantTypeData = dominantType ? ENNEAGRAM_TYPES[dominantType] : null;

  return (
    <div
      className={`relative mx-auto enneagram-rose-container ${alchemical ? '' : 'contemplative'}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{
          filter: alchemical
            ? 'drop-shadow(0 0 20px rgba(251,191,36,0.3))'
            : 'none'
        }}
      >
        <defs>
          {/* Gradients for each type */}
          {Object.entries(ENNEAGRAM_TYPES).map(([type, data]) => (
            <linearGradient
              key={`grad-${type}`}
              id={`enneagram-petal-${type}`}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor={data.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={data.color} stopOpacity="0.4" />
            </linearGradient>
          ))}

          {/* Golden glow filter */}
          <filter id="enneagram-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Center glow */}
          <radialGradient id="enneagram-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Dominant type highlight */}
          {dominantTypeData && (
            <radialGradient id="dominant-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={dominantTypeData.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={dominantTypeData.color} stopOpacity="0" />
            </radialGradient>
          )}

          {/* Shimmer layer overlay gradient - for internal light effect */}
          <radialGradient id="shimmer-overlay" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Divine spark glow */}
          <filter id="divine-blur">
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
        </defs>

        {/* Background dark circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r="46"
          fill="url(#enneagram-bg)"
          stroke="rgba(167,139,250,0.1)"
          strokeWidth="0.3"
        />
        <defs>
          <radialGradient id="enneagram-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Sacred geometry rings */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxOuterRadius + 2}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.3"
          strokeDasharray="2,2"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={baseOuterRadius}
          fill="none"
          stroke="rgba(168,85,247,0.15)"
          strokeWidth="0.2"
          className={alchemical ? 'soul-halo' : ''}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke="rgba(251,191,36,0.2)"
          strokeWidth="0.3"
        />

        {/* Growth/Stress arrows (inner ring) */}
        {showArrows && alchemical && (
          <g opacity="0.3">
            {Object.entries(ENNEAGRAM_TYPES).map(([type, data]) => (
              <React.Fragment key={`arrows-${type}`}>
                {/* Growth arrow (dashed green) */}
                <path
                  d={generateArrowPath(centerX, centerY, parseInt(type), data.growthArrow, innerRadius + 2)}
                  stroke="#22c55e"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                  fill="none"
                />
              </React.Fragment>
            ))}
          </g>
        )}

        {/* The 9 petals - THREE-LAYER STAINED GLASS EFFECT */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((type) => {
          const angle = (type - 1) * 40; // 40° between each petal
          const outerRadius = getOuterRadius(type);
          const typeData = ENNEAGRAM_TYPES[type];
          const isDominant = type === dominantType;
          const score = scores[type] || 0;

          // Generate petal path and get tip coordinates
          const { path: petalPath, tipX, tipY } = generatePetalPath(
            centerX, centerY, angle, innerRadius, outerRadius
          );

          // Animation delay based on golden ratio
          const phiDelay = (type - 1) * 0.2;

          return (
            <g key={type} className={`enneagram-type-${type}`}>
              {/* LAYER 1: Base Glass - the "hand-painted" Art Nouveau structure */}
              <path
                d={petalPath}
                fill={`url(#enneagram-petal-${type})`}
                stroke={isDominant ? '#fbbf24' : typeData.color}
                strokeWidth={isDominant ? '0.8' : '0.4'}
                className={alchemical
                  ? (isDominant ? 'enneagram-petal-glass enneagram-petal-dominant lead-edge' : 'enneagram-petal-glass lead-edge')
                  : ''
                }
                style={{
                  animationDelay: `${phiDelay}s`,
                  filter: isDominant ? 'url(#enneagram-glow)' : 'none'
                }}
              />

              {/* LAYER 2: Shimmer Layer - internal light play */}
              {alchemical && score > 0 && (
                <path
                  d={petalPath}
                  fill="url(#shimmer-overlay)"
                  className="shimmer-layer"
                  style={{ animationDelay: `${phiDelay}s` }}
                />
              )}

              {/* LAYER 3: Divine Point - Michelangelo detail at petal tip */}
              {alchemical && score > 0 && (
                <circle
                  cx={tipX}
                  cy={tipY}
                  r={isDominant ? '1' : '0.7'}
                  fill="white"
                  filter="url(#divine-blur)"
                  className="divine-point"
                  style={{ animationDelay: `${phiDelay}s` }}
                />
              )}

              {/* Type number at petal tip */}
              <text
                x={centerX + (outerRadius + 4) * Math.cos((angle - 90) * Math.PI / 180)}
                y={centerY + (outerRadius + 4) * Math.sin((angle - 90) * Math.PI / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isDominant ? '4' : '3'}
                fontWeight={isDominant ? 'bold' : 'normal'}
                fill={isDominant ? '#fbbf24' : typeData.color}
                opacity={score > 0 ? 1 : 0.4}
              >
                {type}
              </text>

              {/* Score indicator (small circle) - only when not showing divine point */}
              {score > 0 && !alchemical && (
                <circle
                  cx={centerX + (outerRadius - 3) * Math.cos((angle - 90) * Math.PI / 180)}
                  cy={centerY + (outerRadius - 3) * Math.sin((angle - 90) * Math.PI / 180)}
                  r="1.5"
                  fill={typeData.color}
                  opacity="0.8"
                />
              )}
            </g>
          );
        })}

        {/* Center golden orb */}
        <circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="url(#enneagram-center-glow)"
          className={alchemical ? 'soul-glow' : ''}
        />

        {/* Golden phi symbol in center */}
        <text
          x={centerX}
          y={centerY + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="4"
          fontWeight="bold"
          fill="#78350f"
          className={alchemical ? 'soul-glow' : ''}
        >
          φ
        </text>

        {/* Dominant type ring glow */}
        {dominantType && alchemical && (
          <circle
            cx={centerX}
            cy={centerY}
            r={getOuterRadius(dominantType) + 2}
            fill="none"
            stroke={dominantTypeData?.color}
            strokeWidth="0.5"
            strokeOpacity="0.4"
            strokeDasharray="4,2"
            className="soul-halo"
          />
        )}
      </svg>

      {/* Center labels (outside SVG for better text rendering) */}
      {dominantType && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ paddingTop: size * 0.55 }}
        >
          <div className="text-center">
            <div
              className="text-xs font-medium"
              style={{ color: dominantTypeData?.color }}
            >
              {dominantTypeData?.shortName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
