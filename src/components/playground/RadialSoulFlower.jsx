/**
 * RadialSoulFlower Component
 *
 * Sacred geometry rose window visualization with golden ratio proportions.
 * The "Rose Window" panel - Divine Order, Sacred Geometry.
 *
 * Golden Ratio (φ = 1.618) is woven throughout:
 * - Inner radius: base
 * - Outer radius: base × φ to base × φ²
 * - φ-stagger delays for petal unfurling
 * - 8th house as alchemical portal
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useMemo } from 'react';

// Golden ratio constant
const PHI = 1.618;
const PHI_SQ = PHI * PHI; // 2.618

// Element colors for petals
const ELEMENT_COLORS = {
  Fire: { primary: '#f97316', secondary: '#fbbf24', glow: 'rgba(249,115,22,0.4)' },
  Earth: { primary: '#22c55e', secondary: '#86efac', glow: 'rgba(34,197,94,0.4)' },
  Air: { primary: '#38bdf8', secondary: '#a5f3fc', glow: 'rgba(56,189,248,0.4)' },
  Water: { primary: '#8b5cf6', secondary: '#c4b5fd', glow: 'rgba(139,92,246,0.4)' }
};

// Planet symbols
const PLANET_SYMBOLS = {
  sun: '☉', moon: '☾', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
};

/**
 * Generate petal path as a curved wedge with φ-based proportions
 */
function generatePetalPath(angle, innerRadius, outerRadius, petalWidth = 0.22) {
  const startAngle = angle - petalWidth;
  const endAngle = angle + petalWidth;

  const x1 = 50 + innerRadius * Math.cos(startAngle);
  const y1 = 50 + innerRadius * Math.sin(startAngle);
  const x2 = 50 + outerRadius * Math.cos(angle);
  const y2 = 50 + outerRadius * Math.sin(angle);
  const x3 = 50 + innerRadius * Math.cos(endAngle);
  const y3 = 50 + innerRadius * Math.sin(endAngle);

  // Control points for bezier curves (creates organic petal shape)
  const midRadius = (innerRadius + outerRadius) * 0.618; // 1/φ for organic curve
  const cx1 = 50 + midRadius * Math.cos(startAngle);
  const cy1 = 50 + midRadius * Math.sin(startAngle);
  const cx2 = 50 + midRadius * Math.cos(endAngle);
  const cy2 = 50 + midRadius * Math.sin(endAngle);

  return `M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2} Q ${cx2} ${cy2} ${x3} ${y3} Z`;
}

export default function RadialSoulFlower({ slice, alchemical = true }) {
  if (!slice) return null;

  const houses = slice.houses;
  const centerX = 50;
  const centerY = 50;

  // φ-based radii
  const innerRadius = 14; // base
  const outerRadiusBase = innerRadius * PHI; // 22.65 - minimum petal length
  const outerRadiusMax = innerRadius * PHI_SQ; // 36.65 - maximum petal length

  // Pre-compute petal data with φ-stagger
  const petalData = useMemo(() => {
    return houses.map((h, idx) => {
      // Start from top (12 o'clock) and go clockwise
      const angle = ((idx - 3) / 12) * 2 * Math.PI;
      const strengthFactor = h.strength / 100;

      // φ-based outer radius: weak houses hug inner, strong unfurl to φ²
      const outerRadius = innerRadius + (outerRadiusMax - innerRadius) * strengthFactor;

      const colors = ELEMENT_COLORS[h.element] || ELEMENT_COLORS.Water;
      const isAngular = [1, 4, 7, 10].includes(h.house);
      const isEighth = h.house === 8;
      const isNinth = h.house === 9;

      // φ-stagger for animation delay
      const phiDelay = idx * 0.12 * PHI; // ~0.194s per petal

      // Position for house number/glyph
      const labelRadius = outerRadius + 4;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);

      // Planet positions (stacked along the petal)
      const planetPositions = h.planets.slice(0, 3).map((planet, pIdx) => {
        const pRadius = innerRadius + (outerRadius - innerRadius) * (0.4 + pIdx * 0.2);
        return {
          planet,
          x: centerX + pRadius * Math.cos(angle),
          y: centerY + pRadius * Math.sin(angle),
          symbol: PLANET_SYMBOLS[planet.toLowerCase()] || '✱'
        };
      });

      return {
        house: h.house,
        angle,
        outerRadius,
        path: generatePetalPath(angle, innerRadius, outerRadius, 0.22),
        colors,
        isAngular,
        isEighth,
        isNinth,
        phiDelay,
        labelX,
        labelY,
        planets: planetPositions,
        strength: h.strength,
        sign: h.sign,
        element: h.element
      };
    });
  }, [houses]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 px-2">
        <div className="text-xs text-amber-300/80">
          Rose Window • <span className="text-cyan-400">{slice.timeLabel}</span>
        </div>
        <div className="text-[10px] text-white/40">
          φ = 1.618 • Divine Order
        </div>
      </div>

      {/* SVG Rose Window */}
      <div className={`flex-1 relative ${alchemical ? '' : 'contemplative'}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Background radial gradient */}
            <radialGradient id="roseBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#0f172a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
            </radialGradient>

            {/* Golden glow for center */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </radialGradient>

            {/* 8th house portal gradient */}
            <radialGradient id="portalGlow" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Petal gradients for each element */}
            {Object.entries(ELEMENT_COLORS).map(([element, colors]) => (
              <radialGradient
                key={element}
                id={`petalGrad${element}`}
                cx="50%"
                cy="50%"
                r="70%"
              >
                <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.85" />
                <stop offset="61.8%" stopColor={colors.primary} stopOpacity="0.65" />
                <stop offset="100%" stopColor={colors.primary} stopOpacity="0.35" />
              </radialGradient>
            ))}

            {/* Glow filter */}
            <filter id="petalGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stained glass effect filter */}
            <filter id="stainedGlass" x="-10%" y="-10%" width="120%" height="120%">
              <feColorMatrix type="saturate" values="1.2" />
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="100" height="100" fill="url(#roseBg)" rx="12" />

          {/* φ-based sacred geometry rings */}
          {alchemical && (
            <g className="soul-halo">
              {/* Inner ring at base */}
              <circle
                cx={centerX}
                cy={centerY}
                r={innerRadius}
                fill="none"
                stroke="rgba(148,163,184,0.35)"
                strokeWidth="0.4"
              />
              {/* φ ring */}
              <circle
                cx={centerX}
                cy={centerY}
                r={innerRadius * PHI}
                fill="none"
                stroke="rgba(148,163,184,0.25)"
                strokeWidth="0.35"
                strokeDasharray="1.618, 2.618"
              />
              {/* φ² ring */}
              <circle
                cx={centerX}
                cy={centerY}
                r={innerRadius * PHI_SQ}
                fill="none"
                stroke="rgba(251,191,36,0.15)"
                strokeWidth="0.3"
                strokeDasharray="2.618, 1.618"
              />
              {/* Outer decorative ring */}
              <circle
                cx={centerX}
                cy={centerY}
                r="46"
                fill="none"
                stroke="rgba(148,163,184,0.15)"
                strokeWidth="0.3"
              />
            </g>
          )}

          {/* Angular house indicators (cross) */}
          <g opacity="0.2">
            <line x1={centerX} y1="6" x2={centerX} y2="16" stroke="#34d399" strokeWidth="0.5" />
            <line x1={centerX} y1="84" x2={centerX} y2="94" stroke="#34d399" strokeWidth="0.5" />
            <line x1="6" y1={centerY} x2="16" y2={centerY} stroke="#34d399" strokeWidth="0.5" />
            <line x1="84" y1={centerY} x2="94" y2={centerY} stroke="#34d399" strokeWidth="0.5" />
          </g>

          {/* Petals */}
          {petalData.map((petal) => {
            const gradientId = `petalGrad${petal.element || 'Water'}`;
            const animationClass = petal.isEighth
              ? 'petal-segment soul-eighth'
              : 'petal-segment soul-petal';

            return (
              <g
                key={petal.house}
                className={animationClass}
                style={alchemical ? {
                  animationDelay: petal.isEighth ? '2.618s' : `${petal.phiDelay.toFixed(3)}s`
                } : {}}
              >
                {/* 8th house portal halo */}
                {petal.isEighth && alchemical && (
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={petal.outerRadius + 5}
                    fill="none"
                    stroke="rgba(251,191,36,0.18)"
                    strokeWidth="1.2"
                    className="soul-eighth-portal"
                  />
                )}

                {/* Petal shape */}
                <path
                  d={petal.path}
                  fill={`url(#${gradientId})`}
                  stroke={petal.isNinth ? '#fbbf24' : petal.isEighth ? '#a855f7' : 'rgba(15,23,42,0.6)'}
                  strokeWidth={petal.isNinth || petal.isEighth ? 0.8 : 0.3}
                  filter={petal.isNinth || petal.isEighth ? 'url(#petalGlow)' : 'url(#stainedGlass)'}
                  opacity={petal.isAngular ? 0.85 : 0.65}
                  className={petal.isNinth ? 'soul-golden' : ''}
                />

                {/* Inner petal highlight (φ-based) */}
                <path
                  d={generatePetalPath(petal.angle, innerRadius + 2, innerRadius + (petal.outerRadius - innerRadius) * 0.382, 0.12)}
                  fill="rgba(255,255,255,0.08)"
                  stroke="none"
                />

                {/* Planet symbols along petal */}
                {petal.planets.map((p) => (
                  <g key={p.planet}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="2.2"
                      fill="rgba(15,23,42,0.7)"
                      stroke="rgba(251,191,36,0.5)"
                      strokeWidth="0.3"
                    />
                    <text
                      x={p.x}
                      y={p.y + 0.8}
                      textAnchor="middle"
                      fontSize="2.5"
                      fill="#fbbf24"
                    >
                      {p.symbol}
                    </text>
                  </g>
                ))}

                {/* House number outside petal */}
                <text
                  x={petal.labelX}
                  y={petal.labelY + 1}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill={petal.isAngular ? '#34d399' : petal.isEighth ? '#a855f7' : 'rgba(255,255,255,0.5)'}
                  fontWeight={petal.isAngular || petal.isEighth ? 'bold' : 'normal'}
                >
                  {petal.house}
                </text>
              </g>
            );
          })}

          {/* Center sacred geometry */}
          <g>
            {/* Outer halo */}
            <circle
              cx={centerX}
              cy={centerY}
              r="9"
              fill="rgba(248,250,252,0.03)"
              stroke="rgba(250,204,21,0.4)"
              strokeWidth="0.4"
              className={alchemical ? 'soul-halo' : ''}
            />

            {/* Inner ring (φ-based: 9 / φ ≈ 5.56) */}
            <circle
              cx={centerX}
              cy={centerY}
              r="5.56"
              fill="rgba(248,250,252,0.05)"
              stroke="#facc15"
              strokeWidth="0.5"
              strokeOpacity="0.6"
            />

            {/* Center core (the soul) */}
            <circle
              cx={centerX}
              cy={centerY}
              r="3.44"
              fill="url(#centerGlow)"
              stroke="#f59e0b"
              strokeWidth="0.6"
              className={alchemical ? 'soul-glow' : ''}
            />

            {/* Center text */}
            <text
              x={centerX}
              y={centerY + 0.8}
              textAnchor="middle"
              fontSize="2.5"
              fill="#1f2933"
              fontWeight="bold"
            >
              φ
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-1 text-[9px] text-white/40 px-2 flex-wrap">
        {Object.entries(ELEMENT_COLORS).map(([element, colors]) => (
          <div key={element} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: colors.primary }}
            />
            <span>{element}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded border border-purple-400" />
          <span>8th Portal</span>
        </div>
      </div>
    </div>
  );
}
