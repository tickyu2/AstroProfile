/**
 * RoseWindow Component (GENESIS Edition)
 *
 * Sacred geometry Rose Window visualization with:
 *   - 12 petals sized by house strength
 *   - φ-based radii and proportions
 *   - 8th house as alchemical portal
 *   - Element-based gradients (Fire/Earth/Air/Water)
 *   - Angular house emphasis (1, 4, 7, 10)
 *   - Cardinal cross overlay
 *   - Golden center with φ symbol
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';
import {
  PHI,
  ROSE_BASE_RADIUS,
  ROSE_MID_RADIUS,
  ROSE_OUTER_RADIUS,
  ROSE_PORTAL_OFFSET,
  ELEMENT_GRADIENT_IDS,
  getElementForSign,
  isAngularHouse,
  EIGHTH_HOUSE,
  NINTH_HOUSE,
  getPetalDelay
} from './theme';
import { getRisingConfig } from './risingConfig';
import './genesis.css';

/**
 * Generate a petal wedge path
 */
function generatePetalPath(centerX, centerY, angle, innerRadius, outerRadius, spreadDegrees = 12) {
  const spreadRad = (spreadDegrees * Math.PI) / 180;

  const angleLeft = angle - spreadRad / 2;
  const angleRight = angle + spreadRad / 2;

  // Inner arc points
  const x1 = centerX + innerRadius * Math.cos(angleLeft);
  const y1 = centerY + innerRadius * Math.sin(angleLeft);

  // Outer tip
  const x2 = centerX + outerRadius * Math.cos(angle);
  const y2 = centerY + outerRadius * Math.sin(angle);

  // Inner arc points (right)
  const x3 = centerX + innerRadius * Math.cos(angleRight);
  const y3 = centerY + innerRadius * Math.sin(angleRight);

  return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`;
}

export default function RoseWindow({
  slice,
  risingSign = null,
  alchemical = true,
  showCardinalCross = true,
  size = 400
}) {
  // Get rising sign configuration (geometry, color, motion adjustments)
  const risingConfig = getRisingConfig(risingSign);

  if (!slice || !slice.houses || !slice.houses.length) {
    return (
      <div
        className="flex items-center justify-center text-white/30 text-sm"
        style={{ width: size, height: size }}
      >
        No house data
      </div>
    );
  }

  const houses = slice.houses;
  const centerX = 50;
  const centerY = 50;

  // Apply rising sign geometry modifiers
  const spreadFactor = risingConfig?.geometry?.petalSpreadFactor ?? 1.0;
  const outerScale = risingConfig?.geometry?.outerRadiusScale ?? 1.0;
  const innerScale = risingConfig?.geometry?.innerRadiusScale ?? 1.0;

  // Apply rising sign motion modifiers
  const petalDuration = risingConfig?.motion?.petalDuration ?? 1.0;
  const petalCurve = risingConfig?.motion?.petalCurve ?? 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  // Helper: get gradient ID for petal fill based on element
  function getPetalGradient(house) {
    const element = house.element || getElementForSign(house.sign);
    return `url(#${ELEMENT_GRADIENT_IDS[element] || ELEMENT_GRADIENT_IDS.Air})`;
  }

  // Helper: calculate outer radius based on strength (0-100) with rising sign scaling
  function getStrengthRadius(house) {
    const f = Math.max(0, Math.min(house.strength || 0, 100)) / 100;
    const baseOuter = ROSE_BASE_RADIUS + (ROSE_OUTER_RADIUS - ROSE_BASE_RADIUS) * f;
    return baseOuter * outerScale;
  }

  // Get inner radius with rising sign scaling
  const scaledInnerRadius = ROSE_BASE_RADIUS * innerScale;

  // Calculate petal spread with rising sign modifier (base 24°)
  const petalSpread = 24 * spreadFactor;

  const modeClass = alchemical ? '' : 'contemplative';
  const signClass = risingSign ? `genesis-rose--${risingSign}` : '';

  return (
    <div
      className={`relative mx-auto ${modeClass} ${signClass}`.trim()}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{
          filter: alchemical
            ? 'drop-shadow(0 0 20px rgba(168,85,247,0.25))'
            : 'none'
        }}
      >
        <defs>
          {/* Background radial gradient */}
          <radialGradient id="roseBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#0f172a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </radialGradient>

          {/* Center golden glow */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </radialGradient>

          {/* 8th house portal glow */}
          <radialGradient id="portalGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Element gradients for petals */}
          <radialGradient id="petalGradFire" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
            <stop offset="61.8%" stopColor="#f97316" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.35" />
          </radialGradient>

          <radialGradient id="petalGradEarth" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.85" />
            <stop offset="61.8%" stopColor="#22c55e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.35" />
          </radialGradient>

          <radialGradient id="petalGradAir" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.85" />
            <stop offset="61.8%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.35" />
          </radialGradient>

          <radialGradient id="petalGradWater" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.85" />
            <stop offset="61.8%" stopColor="#8b5cf6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.35" />
          </radialGradient>

          {/* Petal glow filter */}
          <filter id="petalGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stained glass effect */}
          <filter id="stainedGlass" x="-10%" y="-10%" width="120%" height="120%">
            <feColorMatrix type="saturate" values="1.2" />
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill="url(#roseBg)" rx="12" />

        {/* Sacred φ rings */}
        <g className="genesis-halo-ring">
          <circle
            cx={centerX}
            cy={centerY}
            r={ROSE_BASE_RADIUS}
            fill="none"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth="0.4"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={ROSE_MID_RADIUS}
            fill="none"
            stroke="rgba(148,163,184,0.25)"
            strokeWidth="0.35"
            strokeDasharray="1.618, 2.618"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={ROSE_OUTER_RADIUS}
            fill="none"
            stroke="rgba(251,191,36,0.15)"
            strokeWidth="0.3"
            strokeDasharray="2.618, 1.618"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r="46"
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth="0.3"
          />
        </g>

        {/* Cardinal cross (angular houses emphasis) */}
        {showCardinalCross && (
          <g className="genesis-cardinal-cross" opacity="0.2">
            <line x1="50" y1="6" x2="50" y2="16" stroke="#34d399" strokeWidth="0.5" />
            <line x1="50" y1="84" x2="50" y2="94" stroke="#34d399" strokeWidth="0.5" />
            <line x1="6" y1="50" x2="16" y2="50" stroke="#34d399" strokeWidth="0.5" />
            <line x1="84" y1="50" x2="94" y2="50" stroke="#34d399" strokeWidth="0.5" />
          </g>
        )}

        {/* The 12 Petals */}
        {houses.map((h, idx) => {
          // Calculate angle (starting from top, going clockwise)
          const angle = ((idx / 12) * 2 * Math.PI) - (Math.PI / 2);

          const isAngular = isAngularHouse(h.house);
          const isEighth = h.house === EIGHTH_HOUSE;
          const isNinth = h.house === NINTH_HOUSE;

          // Radii (with rising sign scaling applied)
          const rInner = scaledInnerRadius;
          const rOuter = getStrengthRadius(h);

          // Generate petal path (with rising sign spread applied)
          const petalPath = generatePetalPath(centerX, centerY, angle, rInner, rOuter, petalSpread);

          // Animation delay
          const delay = getPetalDelay(idx);

          // Gradient fill
          const gradientFill = getPetalGradient(h);

          // Determine class
          const baseClass = isEighth
            ? 'genesis-petal-eighth'
            : isAngular || isNinth
              ? 'genesis-petal-golden'
              : 'genesis-petal';

          // Stroke styling
          const strokeColor = isEighth
            ? '#a855f7'
            : isAngular
              ? 'rgba(251,191,36,0.9)'
              : isNinth
                ? 'rgba(251,191,36,0.7)'
                : 'rgba(15,23,42,0.6)';

          const strokeWidth = isAngular || isEighth || isNinth ? 0.8 : 0.3;
          const opacity = isAngular || isEighth || isNinth ? 0.85 : 0.65;

          // Custom animation style with rising sign motion
          const petalStyle = {
            animationDelay: `${delay}s`,
            animationDuration: `${petalDuration}s`,
            animationTimingFunction: petalCurve
          };

          return (
            <g
              key={h.house}
              className={baseClass}
              style={petalStyle}
            >
              {/* 8th house portal halo */}
              {isEighth && alchemical && (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={rOuter + ROSE_PORTAL_OFFSET}
                  fill="none"
                  stroke="rgba(251,191,36,0.25)"
                  strokeWidth="1.2"
                  className="genesis-portal-ring"
                />
              )}

              {/* Petal path */}
              <path
                d={petalPath}
                fill={gradientFill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={opacity}
                filter={isAngular || isEighth || isNinth ? 'url(#petalGlow)' : 'url(#stainedGlass)'}
              />

              {/* House number label at outer edge */}
              <text
                x={centerX + (rOuter + 3) * Math.cos(angle)}
                y={centerY + (rOuter + 3) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2.5"
                fontWeight={isAngular || isEighth ? 'bold' : 'normal'}
                fill={isEighth ? '#a855f7' : isAngular ? '#fbbf24' : 'rgba(255,255,255,0.5)'}
              >
                {h.house}
              </text>
            </g>
          );
        })}

        {/* Center core */}
        <g className="genesis-soul-panel genesis-core">
          {/* Outer halo */}
          <circle
            cx={centerX}
            cy={centerY}
            r={ROSE_BASE_RADIUS * 0.68}
            fill="rgba(248,250,252,0.03)"
            stroke="rgba(250,204,21,0.4)"
            strokeWidth="0.4"
          />
          {/* Middle ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={ROSE_BASE_RADIUS * 0.4}
            fill="rgba(248,250,252,0.05)"
            stroke="#facc15"
            strokeWidth="0.5"
            strokeOpacity="0.6"
          />
          {/* Golden center orb */}
          <circle
            cx={centerX}
            cy={centerY}
            r={ROSE_BASE_RADIUS * 0.24}
            fill="url(#centerGlow)"
            stroke="#f59e0b"
            strokeWidth="0.6"
          />
          {/* φ symbol */}
          <text
            x={centerX}
            y={centerY + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="2.5"
            fill="#1f2933"
            fontWeight="bold"
          >
            φ
          </text>
        </g>
      </svg>
    </div>
  );
}
