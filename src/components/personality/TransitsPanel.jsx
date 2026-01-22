/**
 * Transits Panel (P5)
 * Displays current sky transits affecting the user's personality
 *
 * Shows outer planet transits (Jupiter, Saturn, Uranus, Neptune, Pluto)
 * to natal positions with temporary personality modifiers.
 */

import React, { useState, useEffect } from 'react';
import { calculateTransits, getActiveTransits } from '../../data/lunaFusionService';

// Planet display configuration
const PLANET_CONFIG = {
  Jupiter: {
    symbol: 'J',
    glyph: '2',  // Jupiter glyph
    color: '#f59e0b',
    description: 'Expansion, optimism, opportunity',
    duration: '~1 year'
  },
  Saturn: {
    symbol: 'S',
    glyph: 'h',
    color: '#64748b',
    description: 'Structure, discipline, restriction',
    duration: '~2.5 years'
  },
  Uranus: {
    symbol: 'U',
    glyph: 'H',
    color: '#06b6d4',
    description: 'Change, awakening, disruption',
    duration: '~7 years'
  },
  Neptune: {
    symbol: 'N',
    glyph: 'P',
    color: '#8b5cf6',
    description: 'Dissolution, spirituality, confusion',
    duration: '~14 years'
  },
  Pluto: {
    symbol: 'P',
    glyph: 'Y',
    color: '#9333ea',
    description: 'Transformation, power, intensity',
    duration: '~20+ years'
  }
};

// Natal planet display
const NATAL_PLANET_CONFIG = {
  Sun: { symbol: 'SU', color: '#fbbf24' },
  Moon: { symbol: 'MO', color: '#e2e8f0' },
  Mercury: { symbol: 'ME', color: '#a3e635' },
  Venus: { symbol: 'VE', color: '#f472b6' },
  Mars: { symbol: 'MA', color: '#ef4444' },
  Jupiter: { symbol: 'JU', color: '#f59e0b' },
  Saturn: { symbol: 'SA', color: '#64748b' }
};

// Aspect display configuration
const ASPECT_CONFIG = {
  Conjunction: {
    symbol: 'o',
    label: 'Conjunction',
    color: '#a855f7',
    intensity: 'Very Strong',
    quality: 'fusion'
  },
  Opposition: {
    symbol: 'x',
    label: 'Opposition',
    color: '#ef4444',
    intensity: 'Strong',
    quality: 'challenging'
  },
  Square: {
    symbol: '#',
    label: 'Square',
    color: '#f97316',
    intensity: 'Strong',
    quality: 'challenging'
  },
  Trine: {
    symbol: '/\\',
    label: 'Trine',
    color: '#10b981',
    intensity: 'Moderate',
    quality: 'harmonious'
  },
  Sextile: {
    symbol: '*',
    label: 'Sextile',
    color: '#3b82f6',
    intensity: 'Moderate',
    quality: 'harmonious'
  },
  Quincunx: {
    symbol: '?',
    label: 'Quincunx',
    color: '#6366f1',
    intensity: 'Subtle',
    quality: 'adjustment'
  }
};

export default function TransitsPanel({
  natalPositions,
  transitsData = null,
  showForecast = false,
  forecastDays = 30
}) {
  const [transits, setTransits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTransit, setExpandedTransit] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // 'active' | 'all' | 'forecast'

  useEffect(() => {
    if (transitsData) {
      setTransits(transitsData);
      return;
    }

    if (natalPositions) {
      fetchTransits();
    }
  }, [natalPositions, transitsData, showForecast]);

  const fetchTransits = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await calculateTransits(
        natalPositions,
        showForecast ? forecastDays : 0
      );
      setTransits(result);
    } catch (err) {
      console.error('Error fetching transits:', err);
      setError('Unable to calculate current transits');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <div className="animate-pulse text-white/60">
          Calculating current transits...
        </div>
      </div>
    );
  }

  if (error || !transits) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <p className="text-white/60">{error || 'No transit data available'}</p>
        <p className="text-sm text-white/40 mt-2">
          Natal chart positions required
        </p>
      </div>
    );
  }

  const activeTransits = transits.activeTransits || [];
  const transitAspects = transits.transitAspects || [];
  const facetVector = transits.facetVector;
  const forecast = transits.forecast;

  // Group by transiting planet
  const groupedTransits = groupTransitsByPlanet(activeTransits);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Current Sky Transits
        </h3>
        <p className="text-sm text-white/60">
          Temporary influences from outer planets
        </p>
        <p className="text-xs text-white/40 mt-1">
          Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('active')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            viewMode === 'active'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            viewMode === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          All Aspects
        </button>
        {forecast && (
          <button
            onClick={() => setViewMode('forecast')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              viewMode === 'forecast'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Forecast
          </button>
        )}
      </div>

      {/* Active Transits View */}
      {viewMode === 'active' && (
        <div className="space-y-4">
          {activeTransits.length === 0 ? (
            <div className="text-center text-white/60 py-4">
              No major transits currently exact
            </div>
          ) : (
            Object.entries(groupedTransits).map(([planet, transits]) => (
              <TransitPlanetSection
                key={planet}
                planet={planet}
                transits={transits}
                expandedTransit={expandedTransit}
                onToggle={(id) => setExpandedTransit(
                  expandedTransit === id ? null : id
                )}
              />
            ))
          )}
        </div>
      )}

      {/* All Aspects View */}
      {viewMode === 'all' && (
        <div className="space-y-3">
          {transitAspects.length === 0 ? (
            <div className="text-center text-white/60 py-4">
              No transit aspects found
            </div>
          ) : (
            transitAspects.map((aspect, idx) => (
              <TransitAspectCard
                key={idx}
                aspect={aspect}
                isExpanded={expandedTransit === `aspect-${idx}`}
                onToggle={() => setExpandedTransit(
                  expandedTransit === `aspect-${idx}` ? null : `aspect-${idx}`
                )}
              />
            ))
          )}
        </div>
      )}

      {/* Forecast View */}
      {viewMode === 'forecast' && forecast && (
        <ForecastTimeline forecast={forecast} />
      )}

      {/* Personality Impact Summary */}
      {facetVector && (
        <PersonalityImpactSummary vector={facetVector} />
      )}

      {/* Methodology Note */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <p className="text-xs text-white/50 leading-relaxed">
          <span className="font-bold text-white/70">Note: </span>
          Transits are temporary influences. Outer planets (Jupiter through Pluto)
          create longer-lasting effects, from months to years. These modifiers
          represent current energetic themes, not permanent personality changes.
        </p>
      </div>
    </div>
  );
}

/**
 * Group transits by transiting planet
 */
function groupTransitsByPlanet(transits) {
  return transits.reduce((groups, transit) => {
    const planet = transit.transitingPlanet || transit.transiting_planet;
    if (!groups[planet]) {
      groups[planet] = [];
    }
    groups[planet].push(transit);
    return groups;
  }, {});
}

/**
 * Transit Planet Section - Shows all transits from one planet
 */
function TransitPlanetSection({ planet, transits, expandedTransit, onToggle }) {
  const config = PLANET_CONFIG[planet];
  if (!config) return null;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Planet Header */}
      <div
        className="p-4 flex items-center gap-4"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: `${config.color}40`, color: config.color }}
        >
          {config.symbol}
        </div>
        <div>
          <div className="font-bold text-white text-lg">{planet} Transits</div>
          <div className="text-sm text-white/60">{config.description}</div>
          <div className="text-xs text-white/40">Duration: {config.duration}</div>
        </div>
      </div>

      {/* Transit List */}
      <div className="p-3 space-y-2">
        {transits.map((transit, idx) => {
          const id = `${planet}-${idx}`;
          return (
            <TransitCard
              key={id}
              transit={transit}
              planetColor={config.color}
              isExpanded={expandedTransit === id}
              onToggle={() => onToggle(id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Individual Transit Card
 */
function TransitCard({ transit, planetColor, isExpanded, onToggle }) {
  const natalPlanet = transit.natalPlanet || transit.natal_planet;
  const aspectType = transit.aspect || transit.aspectType;
  const orb = transit.orb || 0;
  const interpretation = transit.interpretation || transit.description;

  const aspectConfig = ASPECT_CONFIG[aspectType] || ASPECT_CONFIG.Conjunction;
  const natalConfig = NATAL_PLANET_CONFIG[natalPlanet] || { symbol: '?', color: '#fff' };

  return (
    <div
      className={`bg-black/20 rounded-lg p-3 cursor-pointer transition-all border ${
        isExpanded ? 'border-white/30' : 'border-transparent'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Aspect Symbol */}
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: `${aspectConfig.color}40`, color: aspectConfig.color }}
          >
            {aspectConfig.symbol}
          </div>

          {/* Description */}
          <div>
            <div className="text-white font-medium">
              {aspectConfig.label} to{' '}
              <span style={{ color: natalConfig.color }}>{natalPlanet}</span>
            </div>
            <div className="text-xs text-white/60">
              Orb: {Math.abs(orb).toFixed(1)}deg | {aspectConfig.intensity}
            </div>
          </div>
        </div>

        {/* Quality Badge */}
        <div
          className={`px-2 py-1 rounded text-xs font-bold ${
            aspectConfig.quality === 'harmonious'
              ? 'bg-emerald-500/20 text-emerald-400'
              : aspectConfig.quality === 'challenging'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          {aspectConfig.quality}
        </div>
      </div>

      {/* Expanded Interpretation */}
      {isExpanded && interpretation && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-sm text-white/80 leading-relaxed">
            {interpretation}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Transit Aspect Card (for All Aspects view)
 */
function TransitAspectCard({ aspect, isExpanded, onToggle }) {
  const transitPlanet = aspect.transitingPlanet || aspect.transiting_planet || aspect.planet1;
  const natalPlanet = aspect.natalPlanet || aspect.natal_planet || aspect.planet2;
  const aspectType = aspect.aspect || aspect.aspectType;
  const orb = aspect.orb || 0;

  const transitConfig = PLANET_CONFIG[transitPlanet] || { symbol: '?', color: '#fff' };
  const natalConfig = NATAL_PLANET_CONFIG[natalPlanet] || { symbol: '?', color: '#fff' };
  const aspectConfig = ASPECT_CONFIG[aspectType] || ASPECT_CONFIG.Conjunction;

  return (
    <div
      className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-all border ${
        isExpanded ? 'border-white/30' : 'border-white/10'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Transiting Planet */}
          <div
            className="px-2 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: `${transitConfig.color}40`, color: transitConfig.color }}
          >
            {transitPlanet}
          </div>

          {/* Aspect */}
          <div
            className="px-2 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: `${aspectConfig.color}40`, color: aspectConfig.color }}
          >
            {aspectConfig.label}
          </div>

          {/* Natal Planet */}
          <div
            className="px-2 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: `${natalConfig.color}40`, color: natalConfig.color }}
          >
            {natalPlanet}
          </div>
        </div>

        <div className="text-xs text-white/60">
          {Math.abs(orb).toFixed(1)}deg
        </div>
      </div>

      {isExpanded && aspect.interpretation && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-sm text-white/80">{aspect.interpretation}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Forecast Timeline
 */
function ForecastTimeline({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center text-white/60 py-4">
        No upcoming transits in forecast period
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-white/70 px-1">
        Upcoming Transits:
      </div>
      {forecast.map((event, idx) => (
        <div
          key={idx}
          className="bg-slate-800/50 rounded-lg p-3 border border-white/10"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-white">{event.description}</span>
            <span className="text-xs text-white/60">{event.date}</span>
          </div>
          {event.interpretation && (
            <p className="text-sm text-white/70">{event.interpretation}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Personality Impact Summary
 */
function PersonalityImpactSummary({ vector }) {
  if (!vector || vector.length !== 30) return null;

  // Calculate domain averages
  const domains = {
    'Neuroticism': vector.slice(0, 6).reduce((a, b) => a + b, 0) / 6,
    'Extraversion': vector.slice(6, 12).reduce((a, b) => a + b, 0) / 6,
    'Openness': vector.slice(12, 18).reduce((a, b) => a + b, 0) / 6,
    'Agreeableness': vector.slice(18, 24).reduce((a, b) => a + b, 0) / 6,
    'Conscientiousness': vector.slice(24, 30).reduce((a, b) => a + b, 0) / 6
  };

  const domainColors = {
    'Neuroticism': '#ef4444',
    'Extraversion': '#f59e0b',
    'Openness': '#8b5cf6',
    'Agreeableness': '#10b981',
    'Conscientiousness': '#3b82f6'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
      <div className="text-sm font-bold text-white/70 mb-3">
        Current Personality Modifiers:
      </div>
      <div className="space-y-2">
        {Object.entries(domains).map(([domain, value]) => {
          const delta = value;
          const isPositive = delta > 0;
          return (
            <div key={domain} className="flex items-center gap-3">
              <div className="w-32 text-sm text-white/80">{domain}</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-full h-2 relative">
                  <div
                    className="absolute top-0 h-2 rounded-full transition-all"
                    style={{
                      left: delta < 0 ? `${50 + delta * 50}%` : '50%',
                      width: `${Math.abs(delta) * 50}%`,
                      backgroundColor: domainColors[domain]
                    }}
                  />
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-white/40" />
                </div>
                <span
                  className="w-12 text-right text-xs font-bold"
                  style={{ color: domainColors[domain] }}
                >
                  {isPositive ? '+' : ''}{(delta * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-white/40 mt-3">
        These are temporary modifiers from current transits
      </p>
    </div>
  );
}
