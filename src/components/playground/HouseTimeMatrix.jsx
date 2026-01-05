/**
 * HouseTimeMatrix Component
 *
 * A comprehensive calculation table showing planetary positions across houses
 * throughout a 24-hour period (96 time slices at 15-minute intervals).
 *
 * Features:
 * - Rows: Midnight to 11:45pm (96 time slices)
 * - Columns: Houses 1-12
 * - Matrix cells: Planets in each house with zodiac signs
 * - Export functionality: CSV and JSON formats
 * - Color coding by element
 *
 * Part of GENESIS OS - Soul Garden
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useMemo, useCallback } from 'react';

// Planet symbols for compact display
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
  northnode: '☊',
  southnode: '☋',
  chiron: '⚷'
};

// Zodiac sign symbols
const SIGN_SYMBOLS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
};

// Element colors
const ELEMENT_COLORS = {
  Fire: 'bg-orange-900/30 text-orange-300 border-orange-500/30',
  Earth: 'bg-green-900/30 text-green-300 border-green-500/30',
  Air: 'bg-sky-900/30 text-sky-300 border-sky-500/30',
  Water: 'bg-purple-900/30 text-purple-300 border-purple-500/30'
};

// House meanings (brief)
const HOUSE_MEANINGS = {
  1: 'Self, Identity, Appearance',
  2: 'Money, Values, Possessions',
  3: 'Communication, Siblings, Mind',
  4: 'Home, Family, Roots',
  5: 'Creativity, Romance, Children',
  6: 'Health, Work, Service',
  7: 'Partnerships, Marriage, Others',
  8: 'Transformation, Shared Resources',
  9: 'Philosophy, Travel, Higher Learning',
  10: 'Career, Public Image, Authority',
  11: 'Friends, Groups, Aspirations',
  12: 'Spirituality, Hidden, Subconscious'
};

/**
 * Format planet name to symbol
 */
function getPlanetSymbol(name) {
  const key = name?.toLowerCase?.()?.replace(/\s+/g, '') || '';
  return PLANET_SYMBOLS[key] || name?.charAt?.(0)?.toUpperCase() || '?';
}

/**
 * Format sign to symbol
 */
function getSignSymbol(sign) {
  return SIGN_SYMBOLS[sign] || sign?.charAt?.(0) || '';
}

/**
 * Build matrix data from timeline
 */
function buildMatrixData(timeline) {
  if (!timeline || !timeline.length) return [];

  return timeline.map((slice, idx) => {
    const row = {
      timeLabel: slice.timeLabel,
      sliceIndex: idx,
      houses: {}
    };

    // Build house data
    for (let h = 1; h <= 12; h++) {
      const house = slice.houses?.find(house => house.house === h);
      if (house) {
        row.houses[h] = {
          sign: house.sign,
          element: house.element,
          planets: house.planets || [],
          planetData: house.planetData || [],
          strength: house.strength || 0,
          degree: house.degree
        };
      } else {
        row.houses[h] = { sign: '', element: '', planets: [], planetData: [], strength: 0 };
      }
    }

    return row;
  });
}

/**
 * Export to CSV format
 */
function exportToCSV(matrixData, birthDate, location) {
  const headers = ['Time', ...Array.from({ length: 12 }, (_, i) => `House ${i + 1}`)];

  const rows = matrixData.map(row => {
    const cells = [row.timeLabel];
    for (let h = 1; h <= 12; h++) {
      const house = row.houses[h];
      const planets = house.planets.map(p =>
        typeof p === 'string' ? p : p.name || p.planet
      ).join(', ');
      const sign = house.sign || '-';
      cells.push(`${sign}${planets ? ': ' + planets : ''}`);
    }
    return cells.join(',');
  });

  const csvContent = [
    `# Soul Garden House Time Matrix`,
    `# Birth Date: ${birthDate}`,
    `# Location: ${location.latitude?.toFixed(4)}°N, ${location.longitude?.toFixed(4)}°E`,
    `# Generated: ${new Date().toISOString()}`,
    '',
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `soul-garden-matrix-${birthDate}.csv`;
  link.click();
}

/**
 * Export to JSON format
 */
function exportToJSON(matrixData, birthDate, location) {
  const exportData = {
    meta: {
      type: 'Soul Garden House Time Matrix',
      birthDate,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      generated: new Date().toISOString(),
      sliceCount: matrixData.length,
      sliceInterval: '15 minutes'
    },
    houseMeanings: HOUSE_MEANINGS,
    timeline: matrixData.map(row => ({
      time: row.timeLabel,
      houses: Object.entries(row.houses).reduce((acc, [h, data]) => {
        acc[`house${h}`] = {
          sign: data.sign,
          element: data.element,
          strength: data.strength,
          planets: data.planets.map(p => typeof p === 'string' ? p : p.name || p.planet),
          meaning: HOUSE_MEANINGS[parseInt(h)]
        };
        return acc;
      }, {})
    }))
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `soul-garden-matrix-${birthDate}.json`;
  link.click();
}

export default function HouseTimeMatrix({
  timeline,
  birthDate,
  latitude,
  longitude,
  selectedIndex = 0,
  onTimeSelect
}) {
  const [showMeanings, setShowMeanings] = useState(false);
  const [compactMode, setCompactMode] = useState(true);
  const [filterHour, setFilterHour] = useState('all'); // 'all', 'morning', 'afternoon', 'evening', 'night'

  // Build matrix data
  const matrixData = useMemo(() => buildMatrixData(timeline), [timeline]);

  // Filter by time of day
  const filteredData = useMemo(() => {
    if (filterHour === 'all') return matrixData;

    return matrixData.filter(row => {
      const hour = parseInt(row.timeLabel?.split(':')[0] || '0');
      switch (filterHour) {
        case 'night': return hour >= 0 && hour < 6;
        case 'morning': return hour >= 6 && hour < 12;
        case 'afternoon': return hour >= 12 && hour < 18;
        case 'evening': return hour >= 18 && hour < 24;
        default: return true;
      }
    });
  }, [matrixData, filterHour]);

  // Handle export
  const handleExport = useCallback((format) => {
    const location = { latitude, longitude };
    if (format === 'csv') {
      exportToCSV(matrixData, birthDate, location);
    } else {
      exportToJSON(matrixData, birthDate, location);
    }
  }, [matrixData, birthDate, latitude, longitude]);

  // Handle row click
  const handleRowClick = useCallback((sliceIndex) => {
    if (onTimeSelect) {
      onTimeSelect(sliceIndex);
    }
  }, [onTimeSelect]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-8 text-center text-white/50">
        <div className="text-3xl mb-2">📊</div>
        <p>No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20 bg-indigo-950/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <span>📊</span>
              House Time Matrix
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              {birthDate} • {filteredData.length} time slices • 12 houses
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Time Filter */}
            <select
              value={filterHour}
              onChange={(e) => setFilterHour(e.target.value)}
              className="px-2 py-1 text-xs bg-slate-800 border border-white/20 rounded text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Day (96)</option>
              <option value="night">Night 00-06 (24)</option>
              <option value="morning">Morning 06-12 (24)</option>
              <option value="afternoon">Afternoon 12-18 (24)</option>
              <option value="evening">Evening 18-24 (24)</option>
            </select>

            {/* Compact Mode Toggle */}
            <button
              onClick={() => setCompactMode(!compactMode)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                compactMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-700 text-white/60 border border-white/20'
              }`}
            >
              {compactMode ? '🔤 Symbols' : '📝 Names'}
            </button>

            {/* Show Meanings Toggle */}
            <button
              onClick={() => setShowMeanings(!showMeanings)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                showMeanings
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-700 text-white/60 border border-white/20'
              }`}
            >
              {showMeanings ? '💡 Hide Meanings' : '💡 Meanings'}
            </button>

            {/* Export Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleExport('csv')}
                className="px-2 py-1 text-xs bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded hover:bg-emerald-600/50 transition-colors"
              >
                📥 CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-2 py-1 text-xs bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-600/50 transition-colors"
              >
                📥 JSON
              </button>
            </div>
          </div>
        </div>

        {/* House Meanings Legend */}
        {showMeanings && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-[10px]">
            {Object.entries(HOUSE_MEANINGS).map(([h, meaning]) => (
              <div key={h} className="p-1.5 bg-slate-800/50 rounded border border-white/10">
                <span className="text-cyan-400 font-medium">H{h}:</span>{' '}
                <span className="text-white/60">{meaning}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-800">
            <tr>
              <th className="p-2 text-left text-white/70 border-b border-r border-white/10 sticky left-0 bg-slate-800 z-20 min-w-[60px]">
                Time
              </th>
              {Array.from({ length: 12 }, (_, i) => (
                <th
                  key={i + 1}
                  className="p-2 text-center text-white/70 border-b border-r border-white/10 min-w-[80px]"
                  title={HOUSE_MEANINGS[i + 1]}
                >
                  <div className="font-medium">H{i + 1}</div>
                  {showMeanings && (
                    <div className="text-[9px] text-white/40 font-normal truncate max-w-[80px]">
                      {HOUSE_MEANINGS[i + 1].split(',')[0]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIdx) => {
              const isSelected = row.sliceIndex === selectedIndex;
              return (
                <tr
                  key={row.sliceIndex}
                  onClick={() => handleRowClick(row.sliceIndex)}
                  className={`
                    cursor-pointer transition-colors
                    ${isSelected
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30'
                      : 'hover:bg-white/5'
                    }
                    ${rowIdx % 4 === 0 ? 'border-t border-white/10' : ''}
                  `}
                >
                  {/* Time Column */}
                  <td className={`
                    p-2 text-left font-mono border-r border-white/10 sticky left-0 z-10
                    ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-white/60'}
                  `}>
                    {row.timeLabel}
                  </td>

                  {/* House Columns */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const house = row.houses[i + 1];
                    const planets = house.planets || [];
                    const hasPlanets = planets.length > 0;
                    const elementClass = ELEMENT_COLORS[house.element] || 'bg-slate-800/50 text-white/50';

                    return (
                      <td
                        key={i + 1}
                        className={`
                          p-1.5 text-center border-r border-white/10
                          ${hasPlanets ? elementClass : 'text-white/30'}
                        `}
                      >
                        {/* Sign */}
                        <div className="text-[10px] opacity-70">
                          {compactMode
                            ? getSignSymbol(house.sign)
                            : (house.sign?.slice(0, 3) || '-')
                          }
                        </div>

                        {/* Planets */}
                        {hasPlanets && (
                          <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                            {planets.map((planet, pIdx) => {
                              const name = typeof planet === 'string' ? planet : planet.name || planet.planet;
                              return (
                                <span
                                  key={pIdx}
                                  title={name}
                                  className="text-[11px] font-medium"
                                >
                                  {compactMode ? getPlanetSymbol(name) : name.slice(0, 2)}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Strength indicator */}
                        {house.strength > 60 && (
                          <div className="text-[8px] text-amber-400 mt-0.5">
                            ★
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-slate-800/50">
        <div className="flex items-center justify-between text-[10px] text-white/40">
          <div className="flex items-center gap-4">
            <span>Elements:</span>
            <span className="text-orange-300">🔥 Fire</span>
            <span className="text-green-300">🌍 Earth</span>
            <span className="text-sky-300">💨 Air</span>
            <span className="text-purple-300">💧 Water</span>
          </div>
          <div>
            Click any row to view that time slice in the Cathedral
          </div>
        </div>
      </div>
    </div>
  );
}
