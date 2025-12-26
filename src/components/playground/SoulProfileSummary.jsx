/**
 * SoulProfileSummary Component
 *
 * Displays comprehensive birth chart data in cathedral-style panels:
 *   1. Birth Data (date, time, location)
 *   2. Ascendant / Rising Sign
 *   3. Planets (position + motion)
 *   4. Houses (strength + activity)
 *   5. Aspects (planet-to-planet conversations)
 *   6. Retrogrades (deep soul patterns)
 *   7. Direct-motion planets (forward soul energy)
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Planet symbols
const PLANET_SYMBOLS = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  chiron: '⚷',
  northnode: '☊',
  southnode: '☋'
};

// Sign symbols
const SIGN_SYMBOLS = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
};

// Aspect symbols
const ASPECT_SYMBOLS = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
  quincunx: '⚻'
};

// Get planet symbol
function getPlanetSymbol(name) {
  if (!name) return '?';
  return PLANET_SYMBOLS[name.toLowerCase()] || name.charAt(0).toUpperCase();
}

// Get sign symbol
function getSignSymbol(name) {
  if (!name) return '?';
  return SIGN_SYMBOLS[name.toLowerCase()] || name.substring(0, 3);
}

// Section header component
function SectionHeader({ title, icon, color = 'cyan', expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20 hover:bg-${color}-500/20 transition-colors`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className={`text-xs font-medium text-${color}-300 uppercase tracking-wider`}>{title}</span>
      </div>
      <span className={`text-${color}-400 text-xs`}>{expanded ? '▼' : '▶'}</span>
    </button>
  );
}

// Data row component
function DataRow({ label, value, highlight = false, icon = null }) {
  return (
    <div className={`flex items-center justify-between py-1 px-2 ${highlight ? 'bg-amber-500/10 rounded' : ''}`}>
      <span className="text-[10px] text-white/50 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span className={`text-[11px] ${highlight ? 'text-amber-300 font-medium' : 'text-white/80'}`}>
        {value || '—'}
      </span>
    </div>
  );
}

// Planet row component
function PlanetRow({ planet, showRetrograde = true }) {
  const name = typeof planet === 'string' ? planet : (planet.name || planet.planet || 'Unknown');
  const sign = planet.sign || '—';
  const degree = planet.degree != null ? `${planet.degree.toFixed(1)}°` : '—';
  const house = planet.house || '—';
  const retrograde = planet.retrograde;
  const symbol = getPlanetSymbol(name);
  const signSymbol = getSignSymbol(sign);

  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 text-[10px] ${retrograde ? 'bg-violet-500/10 rounded' : ''}`}>
      <span className="w-5 text-amber-400 text-center">{symbol}</span>
      <span className="flex-1 text-white/80">{name}</span>
      <span className="w-8 text-purple-300">{signSymbol}</span>
      <span className="w-12 text-white/60 text-right">{degree}</span>
      <span className="w-6 text-cyan-400 text-center">H{house}</span>
      {showRetrograde && (
        <span className={`w-4 text-center ${retrograde ? 'text-violet-400' : 'text-white/20'}`}>
          {retrograde ? '℞' : '→'}
        </span>
      )}
    </div>
  );
}

// House row component
function HouseRow({ house }) {
  const num = house.house || house.number || '?';
  const sign = house.sign || '—';
  const strength = house.strength || 0;
  const planets = house.planets || [];
  const signSymbol = getSignSymbol(sign);

  // Strength bar color
  const barColor = strength >= 70 ? 'bg-amber-500' :
                   strength >= 50 ? 'bg-emerald-500' :
                   strength >= 30 ? 'bg-cyan-500' : 'bg-slate-500';

  return (
    <div className="flex items-center gap-2 py-1 px-2 text-[10px]">
      <span className={`w-6 text-center font-bold ${[1,4,7,10].includes(num) ? 'text-amber-400' : 'text-white/60'}`}>
        {num}
      </span>
      <span className="w-6 text-purple-300">{signSymbol}</span>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${strength}%` }} />
      </div>
      <span className="w-8 text-right text-white/60">{strength}</span>
      <span className="w-16 text-amber-300/70 truncate text-right">
        {planets.length > 0 ? planets.map(p => getPlanetSymbol(typeof p === 'string' ? p : p.name)).join(' ') : '—'}
      </span>
    </div>
  );
}

// Aspect row component
function AspectRow({ aspect }) {
  const planetA = aspect.a || aspect.planet1 || '?';
  const planetB = aspect.b || aspect.planet2 || '?';
  const type = aspect.type || aspect.aspect || '?';
  const orb = aspect.orb != null ? `${aspect.orb.toFixed(1)}°` : '—';
  const applying = aspect.applying;

  const symbolA = getPlanetSymbol(planetA);
  const symbolB = getPlanetSymbol(planetB);
  const aspectSymbol = ASPECT_SYMBOLS[type.toLowerCase()] || type.substring(0, 3);

  // Color based on aspect type
  const typeColor = ['conjunction', 'trine', 'sextile'].includes(type.toLowerCase())
    ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className="flex items-center gap-2 py-1 px-2 text-[10px]">
      <span className="w-5 text-amber-400 text-center">{symbolA}</span>
      <span className={`w-4 text-center ${typeColor}`}>{aspectSymbol}</span>
      <span className="w-5 text-amber-400 text-center">{symbolB}</span>
      <span className="flex-1 text-white/50 capitalize">{type}</span>
      <span className="w-10 text-white/60 text-right">{orb}</span>
      {applying !== undefined && (
        <span className={`w-4 text-center ${applying ? 'text-cyan-400' : 'text-white/30'}`}>
          {applying ? '→' : '←'}
        </span>
      )}
    </div>
  );
}

export default function SoulProfileSummary({
  birthData = {},
  slice = null,
  planets = [],
  aspects = [],
  ascendant = null,
  alchemical = true
}) {
  // Section expand states
  const [expanded, setExpanded] = useState({
    birth: true,
    ascendant: true,
    planets: false,
    houses: false,
    aspects: false,
    retrogrades: false,
    direct: false
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract data from slice
  // Note: planets are passed pre-extracted from houses by parent component
  const houses = slice?.houses || [];
  const slicePlanets = planets.length > 0 ? planets : (slice?.planets || []);

  // Separate retrograde and direct planets
  const retrogradePlanets = slicePlanets.filter(p => p.retrograde);
  const directPlanets = slicePlanets.filter(p => !p.retrograde);

  // Find strongest houses
  const sortedHouses = [...houses].sort((a, b) => (b.strength || 0) - (a.strength || 0));
  const strongestHouse = sortedHouses[0];

  return (
    <div className={`bg-indigo-950/40 rounded-xl border border-cyan-500/20 overflow-hidden ${alchemical ? '' : 'contemplative'}`}>
      {/* Header */}
      <div className="p-3 border-b border-cyan-500/20 bg-indigo-950/60">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <div>
            <h3 className="text-sm font-medium text-cyan-300">Soul Profile Summary</h3>
            <p className="text-[9px] text-white/40">Birth chart data at a glance</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="max-h-[500px] overflow-y-auto soul-scroll p-3 space-y-3">

        {/* 1. Birth Data */}
        <div>
          <SectionHeader
            title="Birth Data"
            icon="🗓️"
            color="cyan"
            expanded={expanded.birth}
            onToggle={() => toggleSection('birth')}
          />
          <AnimatePresence>
            {expanded.birth && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-0.5 bg-slate-900/50 rounded-lg p-2">
                  <DataRow label="Date" value={birthData.date || slice?.date} icon="📅" />
                  <DataRow label="Time" value={birthData.time || slice?.timeLabel} icon="⏰" highlight />
                  <DataRow label="Location" value={birthData.location} icon="📍" />
                  <DataRow label="Latitude" value={birthData.latitude?.toFixed(4)} icon="🌐" />
                  <DataRow label="Longitude" value={birthData.longitude?.toFixed(4)} icon="🌐" />
                  <DataRow label="Timezone" value={birthData.timezone != null ? `UTC${birthData.timezone >= 0 ? '+' : ''}${birthData.timezone}` : null} icon="🕐" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Ascendant / Rising Sign */}
        <div>
          <SectionHeader
            title="Ascendant / Rising"
            icon="🌅"
            color="amber"
            expanded={expanded.ascendant}
            onToggle={() => toggleSection('ascendant')}
          />
          <AnimatePresence>
            {expanded.ascendant && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-0.5 bg-slate-900/50 rounded-lg p-2">
                  {ascendant ? (
                    <>
                      <DataRow
                        label="Rising Sign"
                        value={`${getSignSymbol(ascendant.sign)} ${ascendant.sign}`}
                        highlight
                        icon="♈"
                      />
                      <DataRow label="Degree" value={ascendant.degree != null ? `${ascendant.degree.toFixed(2)}°` : null} icon="📐" />
                      <DataRow label="Ruler" value={ascendant.ruler} icon="👑" />
                      <DataRow label="Ruler Sign" value={ascendant.rulerSign} icon="🏠" />
                      <DataRow label="Ruler House" value={ascendant.rulerHouse ? `House ${ascendant.rulerHouse}` : null} icon="🏛️" />
                    </>
                  ) : (
                    <div className="text-[10px] text-white/40 italic text-center py-2">
                      Ascendant data not available
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Planets */}
        <div>
          <SectionHeader
            title={`Planets (${slicePlanets.length})`}
            icon="🪐"
            color="purple"
            expanded={expanded.planets}
            onToggle={() => toggleSection('planets')}
          />
          <AnimatePresence>
            {expanded.planets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-slate-900/50 rounded-lg p-2">
                  {/* Header row */}
                  <div className="flex items-center gap-2 py-1 px-2 text-[8px] text-white/40 border-b border-white/10 mb-1">
                    <span className="w-5"></span>
                    <span className="flex-1">Planet</span>
                    <span className="w-8">Sign</span>
                    <span className="w-12 text-right">Degree</span>
                    <span className="w-6 text-center">House</span>
                    <span className="w-4 text-center">Rx</span>
                  </div>
                  {slicePlanets.length > 0 ? (
                    slicePlanets.map((planet, idx) => (
                      <PlanetRow key={idx} planet={planet} />
                    ))
                  ) : (
                    <div className="text-[10px] text-white/40 italic text-center py-2">
                      No planet data available
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Houses */}
        <div>
          <SectionHeader
            title={`Houses (${houses.length})`}
            icon="🏛️"
            color="emerald"
            expanded={expanded.houses}
            onToggle={() => toggleSection('houses')}
          />
          <AnimatePresence>
            {expanded.houses && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-slate-900/50 rounded-lg p-2">
                  {/* Header row */}
                  <div className="flex items-center gap-2 py-1 px-2 text-[8px] text-white/40 border-b border-white/10 mb-1">
                    <span className="w-6 text-center">#</span>
                    <span className="w-6">Sign</span>
                    <span className="flex-1">Strength</span>
                    <span className="w-8 text-right">%</span>
                    <span className="w-16 text-right">Planets</span>
                  </div>
                  {houses.length > 0 ? (
                    houses.map((house, idx) => (
                      <HouseRow key={idx} house={house} />
                    ))
                  ) : (
                    <div className="text-[10px] text-white/40 italic text-center py-2">
                      No house data available
                    </div>
                  )}
                  {/* Strongest house highlight */}
                  {strongestHouse && (
                    <div className="mt-2 p-2 bg-amber-500/10 rounded border border-amber-500/20">
                      <div className="text-[9px] text-amber-300">
                        ⭐ Strongest: House {strongestHouse.house} at {strongestHouse.strength || 0}%
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Aspects */}
        <div>
          <SectionHeader
            title={`Aspects (${aspects.length})`}
            icon="☍"
            color="pink"
            expanded={expanded.aspects}
            onToggle={() => toggleSection('aspects')}
          />
          <AnimatePresence>
            {expanded.aspects && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-slate-900/50 rounded-lg p-2">
                  {aspects.length > 0 ? (
                    aspects.map((aspect, idx) => (
                      <AspectRow key={idx} aspect={aspect} />
                    ))
                  ) : (
                    <div className="text-[10px] text-white/40 italic text-center py-2">
                      No aspect data available
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Retrogrades */}
        <div>
          <SectionHeader
            title={`Retrogrades (${retrogradePlanets.length})`}
            icon="↺"
            color="violet"
            expanded={expanded.retrogrades}
            onToggle={() => toggleSection('retrogrades')}
          />
          <AnimatePresence>
            {expanded.retrogrades && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-slate-900/50 rounded-lg p-2">
                  {retrogradePlanets.length > 0 ? (
                    <>
                      <div className="text-[9px] text-violet-300/80 mb-2 px-2">
                        ℞ Deep soul patterns — energy turns inward
                      </div>
                      {retrogradePlanets.map((planet, idx) => (
                        <PlanetRow key={idx} planet={planet} showRetrograde={false} />
                      ))}
                    </>
                  ) : (
                    <div className="text-[10px] text-white/40 italic text-center py-2">
                      No retrograde planets at this time
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 7. Direct Motion */}
        <div>
          <SectionHeader
            title={`Direct Motion (${directPlanets.length})`}
            icon="→"
            color="teal"
            expanded={expanded.direct}
            onToggle={() => toggleSection('direct')}
          />
          <AnimatePresence>
            {expanded.direct && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-slate-900/50 rounded-lg p-2">
                  {directPlanets.length > 0 ? (
                    <>
                      <div className="text-[9px] text-teal-300/80 mb-2 px-2">
                        → Forward soul energy — action flows freely
                      </div>
                      {directPlanets.map((planet, idx) => (
                        <PlanetRow key={idx} planet={planet} showRetrograde={false} />
                      ))}
                    </>
                  ) : (
                    <div className="text-[10px] text-white/40 italic text-center py-2">
                      No direct planets at this time
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer */}
      <div className="p-2 border-t border-cyan-500/10 bg-indigo-950/40">
        <div className="text-[8px] text-white/30 text-center">
          φ = 1.618 • Soul Garden Cathedral • GENESIS OS
        </div>
      </div>
    </div>
  );
}
