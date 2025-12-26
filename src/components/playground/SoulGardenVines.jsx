/**
 * SoulGardenVines Component
 *
 * Art Nouveau SVG vine garden visualization.
 * Organic, flowing vines representing house energies.
 * The "Cloister" panel - where the living soul breathes.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useMemo } from 'react';

// Element colors for vine tints
const ELEMENT_COLORS = {
  Fire: { vine: '#f97316', leaf: '#fbbf24', glow: '#ea580c' },
  Earth: { vine: '#22c55e', leaf: '#86efac', glow: '#16a34a' },
  Air: { vine: '#38bdf8', leaf: '#a5f3fc', glow: '#0284c7' },
  Water: { vine: '#8b5cf6', leaf: '#c4b5fd', glow: '#7c3aed' }
};

// Planet symbols for flowers
const PLANET_FLOWERS = {
  sun: { symbol: '☉', color: '#fbbf24', size: 6 },
  moon: { symbol: '☾', color: '#e2e8f0', size: 5.5 },
  mercury: { symbol: '☿', color: '#a78bfa', size: 4.5 },
  venus: { symbol: '♀', color: '#f472b6', size: 5 },
  mars: { symbol: '♂', color: '#ef4444', size: 5 },
  jupiter: { symbol: '♃', color: '#f97316', size: 5.5 },
  saturn: { symbol: '♄', color: '#a8a29e', size: 5 },
  uranus: { symbol: '♅', color: '#22d3ee', size: 4.5 },
  neptune: { symbol: '♆', color: '#818cf8', size: 4.5 },
  pluto: { symbol: '♇', color: '#a855f7', size: 4 }
};

/**
 * Generate a curved vine path using quadratic bezier
 */
function generateVinePath(startX, baseY, height, curvature = 0.3) {
  const controlX = startX + (Math.random() - 0.5) * 10 * curvature;
  const endY = baseY - height;
  const midY = baseY - height * 0.5;

  return `M ${startX} ${baseY} Q ${controlX} ${midY} ${startX + (Math.random() - 0.5) * 4} ${endY}`;
}

/**
 * Generate leaf shape path
 */
function generateLeafPath(x, y, size, direction = 1) {
  const tipX = x + direction * size * 2;
  const tipY = y - size * 0.5;
  return `M ${x} ${y} Q ${x + direction * size} ${y - size} ${tipX} ${tipY} Q ${x + direction * size} ${y + size * 0.5} ${x} ${y}`;
}

export default function SoulGardenVines({ slice, alchemical = true }) {
  if (!slice) return null;

  const houses = slice.houses;
  const maxStrength = 100;
  const svgWidth = 100;
  const svgHeight = 100;
  const baseY = 92;
  const maxVineHeight = 70;

  // Pre-compute vine data
  const vineData = useMemo(() => {
    return houses.map((h, idx) => {
      const x = 6 + (idx / 11) * (svgWidth - 12);
      const height = (h.strength / maxStrength) * maxVineHeight;
      const colors = ELEMENT_COLORS[h.element] || ELEMENT_COLORS.Water;
      const isAngular = [1, 4, 7, 10].includes(h.house);
      const isNinth = h.house === 9;

      // Generate main vine path
      const vinePath = generateVinePath(x, baseY, height, isAngular ? 0.2 : 0.4);

      // Generate leaves along the vine
      const leaves = [];
      const leafCount = Math.floor(height / 15);
      for (let i = 0; i < leafCount; i++) {
        const leafY = baseY - (height * (i + 1)) / (leafCount + 1);
        const direction = i % 2 === 0 ? 1 : -1;
        leaves.push({
          path: generateLeafPath(x, leafY, 2 + Math.random(), direction),
          delay: i * 0.1
        });
      }

      return {
        house: h.house,
        x,
        height,
        vinePath,
        leaves,
        colors,
        isAngular,
        isNinth,
        planets: h.planets,
        strength: h.strength,
        sign: h.sign
      };
    });
  }, [houses]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-xs text-purple-300/80">
          Vine Garden • <span className="text-cyan-400">{slice.timeLabel}</span>
        </div>
        <div className="text-[10px] text-white/40">
          Organic Soul Flow
        </div>
      </div>

      {/* SVG Garden */}
      <div className={`flex-1 relative ${alchemical ? '' : 'contemplative'}`}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* Gradient for ground */}
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="vineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Vine gradients for each element */}
            {Object.entries(ELEMENT_COLORS).map(([element, colors]) => (
              <linearGradient
                key={element}
                id={`vineGrad${element}`}
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor={colors.vine} stopOpacity="0.9" />
                <stop offset="60%" stopColor={colors.vine} stopOpacity="0.7" />
                <stop offset="100%" stopColor={colors.leaf} stopOpacity="0.5" />
              </linearGradient>
            ))}
          </defs>

          {/* Background - subtle gradient */}
          <rect x="0" y="0" width="100" height="100" fill="url(#groundGrad)" rx="8" />

          {/* Ground line */}
          <path
            d="M 2 92 Q 25 91 50 92 Q 75 93 98 92"
            fill="none"
            stroke="#4a5568"
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />

          {/* Vines */}
          {vineData.map((vine, idx) => {
            const gradientId = `vineGrad${houses[idx].element || 'Water'}`;

            return (
              <g key={vine.house} className="soul-vine" style={{ animationDelay: `${idx * 0.05}s` }}>
                {/* Main vine stem */}
                <path
                  d={vine.vinePath}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth={vine.isAngular ? 1.2 : 0.8}
                  strokeLinecap="round"
                  filter={vine.isNinth ? 'url(#vineGlow)' : undefined}
                  className={vine.isNinth ? 'soul-golden' : ''}
                />

                {/* Leaves */}
                {vine.leaves.map((leaf, leafIdx) => (
                  <path
                    key={leafIdx}
                    d={leaf.path}
                    fill={vine.colors.leaf}
                    fillOpacity="0.6"
                    stroke={vine.colors.vine}
                    strokeWidth="0.2"
                    className="soul-leaf"
                    style={{ animationDelay: `${leaf.delay}s` }}
                  />
                ))}

                {/* Planet flowers at top */}
                {vine.planets.slice(0, 2).map((planet, pIdx) => {
                  const pData = PLANET_FLOWERS[planet.toLowerCase()] || { symbol: '✱', color: '#fff', size: 4 };
                  const flowerY = baseY - vine.height - 3 - pIdx * 6;

                  return (
                    <g key={planet} className="soul-petal">
                      {/* Flower glow */}
                      <circle
                        cx={vine.x}
                        cy={flowerY}
                        r={pData.size * 0.8}
                        fill={pData.color}
                        fillOpacity="0.2"
                      />
                      {/* Flower center */}
                      <circle
                        cx={vine.x}
                        cy={flowerY}
                        r={pData.size * 0.5}
                        fill={pData.color}
                        fillOpacity="0.8"
                        stroke={pData.color}
                        strokeWidth="0.3"
                      />
                      {/* Planet symbol */}
                      <text
                        x={vine.x}
                        y={flowerY + 1}
                        textAnchor="middle"
                        fontSize="3"
                        fill="#0f172a"
                        fontWeight="bold"
                      >
                        {pData.symbol}
                      </text>
                    </g>
                  );
                })}

                {/* More planets indicator */}
                {vine.planets.length > 2 && (
                  <text
                    x={vine.x}
                    y={baseY - vine.height - 14}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill="rgba(255,255,255,0.5)"
                  >
                    +{vine.planets.length - 2}
                  </text>
                )}

                {/* House number at base */}
                <text
                  x={vine.x}
                  y={baseY + 6}
                  textAnchor="middle"
                  fontSize="3"
                  fill={vine.isAngular ? '#34d399' : '#a78bfa'}
                  fontWeight={vine.isAngular ? 'bold' : 'normal'}
                >
                  {vine.house}
                </text>
              </g>
            );
          })}

          {/* Decorative ground vegetation */}
          <g opacity="0.4">
            {[10, 30, 50, 70, 90].map((x, i) => (
              <ellipse
                key={i}
                cx={x}
                cy={94}
                rx={3}
                ry={1}
                fill="#22c55e"
                fillOpacity="0.3"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-1 text-[9px] text-white/40 px-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gradient-to-t from-emerald-600 to-emerald-300" />
          <span>Angular</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gradient-to-t from-purple-600 to-purple-300" />
          <span>Succedent/Cadent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-amber-400 flex items-center justify-center text-[6px] text-amber-400">☉</div>
          <span>Planet</span>
        </div>
      </div>
    </div>
  );
}
