/**
 * HouseVineChart Component
 *
 * Art Nouveau-inspired vertical bar chart showing house strengths.
 * Bars grow like vines with "flowers" indicating planetary presence.
 * The "Nave" panel - Human Effort, Vertical Striving.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';

const maxStrength = 100;

// House meanings for tooltips
const HOUSE_MEANINGS = {
  1: 'Self & Identity',
  2: 'Money & Values',
  3: 'Communication',
  4: 'Home & Family',
  5: 'Creativity & Romance',
  6: 'Health & Service',
  7: 'Partnerships',
  8: 'Transformation',
  9: 'Philosophy & Travel',
  10: 'Career & Status',
  11: 'Friends & Dreams',
  12: 'Spirituality & Secrets'
};

// Planet symbols for display
const PLANET_SYMBOLS = {
  sun: { symbol: '☉', name: 'Sun', color: '#fbbf24' },
  moon: { symbol: '☾', name: 'Moon', color: '#94a3b8' },
  mercury: { symbol: '☿', name: 'Mercury', color: '#a78bfa' },
  venus: { symbol: '♀', name: 'Venus', color: '#f472b6' },
  mars: { symbol: '♂', name: 'Mars', color: '#ef4444' },
  jupiter: { symbol: '♃', name: 'Jupiter', color: '#f97316' },
  saturn: { symbol: '♄', name: 'Saturn', color: '#78716c' },
  uranus: { symbol: '♅', name: 'Uranus', color: '#22d3ee' },
  neptune: { symbol: '♆', name: 'Neptune', color: '#818cf8' },
  pluto: { symbol: '♇', name: 'Pluto', color: '#a855f7' }
};

export default function HouseVineChart({ slice, alchemical = true }) {
  if (!slice) return null;

  return (
    <div className={`flex flex-col h-full min-w-0 ${alchemical ? '' : 'contemplative'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-emerald-300/80">
          The Nave • <span className="text-cyan-400">{slice.timeLabel}</span>
        </div>
        <div className="text-[10px] text-white/40">
          0-100 scale
        </div>
      </div>

      {/* Chart Container - Fixed height */}
      <div className="flex-1 flex items-end gap-1 pb-8" style={{ height: '200px' }}>
        {slice.houses.map(h => {
          const heightPx = Math.max((h.strength / maxStrength) * 180, 10);
          const hasPlanets = h.planets.length > 0;
          const isAngular = [1, 4, 7, 10].includes(h.house);
          const isNinth = h.house === 9;

          return (
            <div
              key={h.house}
              className="flex-1 flex flex-col items-center bar-container relative"
            >
              {/* Vine bar container */}
              <div className="flex-1 w-full flex items-end justify-center relative">
                {/* Planet flowers above bar */}
                {hasPlanets && (
                  <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-0.5">
                    {h.planets.slice(0, 3).map((planet) => {
                      const planetInfo = PLANET_SYMBOLS[planet.toLowerCase()] || { symbol: '✱', color: '#fff' };
                      return (
                        <div
                          key={planet}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shadow-lg soul-petal"
                          style={{
                            backgroundColor: `${planetInfo.color}33`,
                            border: `2px solid ${planetInfo.color}`,
                            color: planetInfo.color
                          }}
                          title={planetInfo.name}
                        >
                          {planetInfo.symbol}
                        </div>
                      );
                    })}
                    {h.planets.length > 3 && (
                      <div className="text-[8px] text-white/50">+{h.planets.length - 3}</div>
                    )}
                  </div>
                )}

                {/* The vine bar */}
                <div
                  className={`
                    vine-bar rounded-t-lg relative transition-all duration-500 ease-out soul-vine
                    ${isAngular
                      ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-cyan-300'
                      : 'bg-gradient-to-t from-purple-600 via-purple-400 to-pink-300'
                    }
                    ${isNinth ? 'soul-golden' : ''}
                  `}
                  style={{
                    width: '16px',
                    height: `${heightPx}px`,
                    boxShadow: isNinth
                      ? '0 0 16px rgba(251,191,36,0.6)'
                      : isAngular
                      ? '0 0 12px rgba(16,185,129,0.5)'
                      : '0 0 8px rgba(168,85,247,0.4)'
                  }}
                >
                  {/* Leaf decorations */}
                  {heightPx > 60 && (
                    <>
                      <div className="absolute left-full top-1/4 w-2 h-1.5 bg-green-400/70 rounded-r-full soul-leaf" />
                      <div className="absolute right-full top-2/3 w-2 h-1.5 bg-green-400/70 rounded-l-full soul-leaf" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  {heightPx > 120 && (
                    <div className="absolute left-full top-1/2 w-1.5 h-1 bg-green-500/60 rounded-r-full soul-leaf" style={{ animationDelay: '1s' }} />
                  )}
                </div>
              </div>

              {/* House number label */}
              <div className={`
                mt-2 text-xs font-bold
                ${isAngular ? 'text-emerald-400' : 'text-purple-300'}
                ${isNinth ? 'text-amber-400' : ''}
              `}>
                {h.house}
              </div>

              {/* Strength value */}
              <div className="text-[10px] text-white/50">
                {h.strength}
              </div>

              {/* Hover flap tooltip */}
              <div className="bar-flap">
                <div className="font-medium text-cyan-300">{h.house}. {HOUSE_MEANINGS[h.house]}</div>
                <div className="text-white/60 mt-0.5">{h.sign} at {h.degree?.toFixed(1)}°</div>
                <div className="text-white/40 mt-0.5">Strength: {h.strength}/100</div>
                {h.planets.length > 0 && (
                  <div className="text-amber-300/80 mt-0.5">
                    {h.planets.map(p => PLANET_SYMBOLS[p.toLowerCase()]?.symbol || p).join(' ')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[9px] text-white/50">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-gradient-to-t from-emerald-600 to-cyan-300" />
          <span>Angular (1,4,7,10)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-gradient-to-t from-purple-600 to-pink-300" />
          <span>Succedent & Cadent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-amber-400 flex items-center justify-center text-[7px] text-amber-400">☉</div>
          <span>Planet</span>
        </div>
      </div>
    </div>
  );
}
