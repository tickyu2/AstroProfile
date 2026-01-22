/**
 * Natal Aspects Panel (P4)
 * Displays birth chart planetary aspects and their personality influences
 *
 * Features:
 * - Individual aspect display with orb and quality
 * - Aspect pattern detection (Grand Trine, T-Square, Yod, etc.)
 * - Personality impact visualization
 * - Planet-pair interpretations
 */

import React, { useState, useEffect } from 'react';
import { calculateNatalAspects } from '../../data/lunaFusionService';

// Aspect type display configuration
const ASPECT_CONFIG = {
  Conjunction: {
    symbol: 'o',
    angle: '0°',
    color: '#a855f7',
    quality: 'fusion',
    description: 'Planets merge energies - amplified expression'
  },
  Opposition: {
    symbol: 'x',
    angle: '180°',
    color: '#ef4444',
    quality: 'challenging',
    description: 'Polarity - inner vs outer awareness'
  },
  Trine: {
    symbol: '/\\',
    angle: '120°',
    color: '#10b981',
    quality: 'harmonious',
    description: 'Natural talent, ease of expression'
  },
  Square: {
    symbol: '#',
    angle: '90°',
    color: '#f97316',
    quality: 'challenging',
    description: 'Growth through friction'
  },
  Sextile: {
    symbol: '*',
    angle: '60°',
    color: '#3b82f6',
    quality: 'harmonious',
    description: 'Opportunities requiring effort'
  },
  Quincunx: {
    symbol: '?',
    angle: '150°',
    color: '#6366f1',
    quality: 'adjustment',
    description: 'Blind spot requiring adjustment'
  },
  SemiSextile: {
    symbol: '.',
    angle: '30°',
    color: '#64748b',
    quality: 'minor',
    description: 'Subtle connection'
  }
};

// Planet display configuration
const PLANET_CONFIG = {
  Sun: { symbol: 'SU', color: '#fbbf24', name: 'Sun' },
  Moon: { symbol: 'MO', color: '#e2e8f0', name: 'Moon' },
  Mercury: { symbol: 'ME', color: '#a3e635', name: 'Mercury' },
  Venus: { symbol: 'VE', color: '#f472b6', name: 'Venus' },
  Mars: { symbol: 'MA', color: '#ef4444', name: 'Mars' },
  Jupiter: { symbol: 'JU', color: '#f59e0b', name: 'Jupiter' },
  Saturn: { symbol: 'SA', color: '#64748b', name: 'Saturn' },
  Uranus: { symbol: 'UR', color: '#06b6d4', name: 'Uranus' },
  Neptune: { symbol: 'NE', color: '#8b5cf6', name: 'Neptune' },
  Pluto: { symbol: 'PL', color: '#9333ea', name: 'Pluto' }
};

// Aspect pattern configuration
const PATTERN_CONFIG = {
  GrandTrine: {
    name: 'Grand Trine',
    symbol: '/\\',
    color: '#10b981',
    description: 'Natural talent, potential complacency',
    interpretation: 'Three planets in harmonious flow creating ease and natural ability'
  },
  TSquare: {
    name: 'T-Square',
    symbol: 'T',
    color: '#f97316',
    description: 'Dynamic tension, strong drive',
    interpretation: 'Two planets in opposition focusing energy through a third (apex)'
  },
  GrandCross: {
    name: 'Grand Cross',
    symbol: '+',
    color: '#ef4444',
    description: 'Maximum challenge, maximum potential',
    interpretation: 'Four planets creating intense cross-tensions requiring integration'
  },
  Kite: {
    name: 'Kite',
    symbol: 'K',
    color: '#3b82f6',
    description: 'Talent with outlet for expression',
    interpretation: 'Grand Trine with focused outlet through opposition point'
  },
  Yod: {
    name: 'Yod (Finger of God)',
    symbol: 'Y',
    color: '#a855f7',
    description: 'Fated mission, unique path',
    interpretation: 'Two planets channeling energy to an apex of destiny'
  }
};

export default function NatalAspectsPanel({
  natalPositions,
  aspectsData = null,
  showPatterns = true,
  showPersonalityImpact = true
}) {
  const [aspects, setAspects] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedAspect, setExpandedAspect] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'major' | 'patterns'
  const [sortBy, setSortBy] = useState('planet'); // 'planet' | 'type' | 'orb'

  useEffect(() => {
    if (aspectsData) {
      setAspects(aspectsData);
      return;
    }

    if (natalPositions) {
      fetchAspects();
    }
  }, [natalPositions, aspectsData]);

  const fetchAspects = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await calculateNatalAspects(natalPositions, showPatterns);
      setAspects(result);
    } catch (err) {
      console.error('Error fetching aspects:', err);
      setError('Unable to calculate natal aspects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <div className="animate-pulse text-white/60">
          Calculating natal aspects...
        </div>
      </div>
    );
  }

  if (error || !aspects) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <p className="text-white/60">{error || 'No aspect data available'}</p>
        <p className="text-sm text-white/40 mt-2">
          Natal chart positions required
        </p>
      </div>
    );
  }

  const aspectsList = aspects.aspects || [];
  const patterns = aspects.patterns || [];
  const facetVector = aspects.facetVector;

  // Filter aspects based on view mode
  const filteredAspects = viewMode === 'major'
    ? aspectsList.filter(a => ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(a.aspect))
    : aspectsList;

  // Sort aspects
  const sortedAspects = [...filteredAspects].sort((a, b) => {
    if (sortBy === 'type') {
      return (a.aspect || '').localeCompare(b.aspect || '');
    }
    if (sortBy === 'orb') {
      return Math.abs(a.orb || 0) - Math.abs(b.orb || 0);
    }
    // Default: by first planet
    return (a.planet1?.name || '').localeCompare(b.planet1?.name || '');
  });

  // Group by aspect type for summary
  const aspectCounts = aspectsList.reduce((acc, a) => {
    acc[a.aspect] = (acc[a.aspect] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Natal Aspects
        </h3>
        <p className="text-sm text-white/60">
          Planetary relationships in your birth chart
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(aspectCounts).map(([type, count]) => {
          const config = ASPECT_CONFIG[type];
          if (!config) return null;
          return (
            <div
              key={type}
              className="bg-slate-800/50 rounded-lg p-2 text-center"
              style={{ borderLeft: `3px solid ${config.color}` }}
            >
              <div className="text-lg font-bold" style={{ color: config.color }}>
                {count}
              </div>
              <div className="text-xs text-white/60">{type}s</div>
            </div>
          );
        })}
      </div>

      {/* View Controls */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              viewMode === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            All ({aspectsList.length})
          </button>
          <button
            onClick={() => setViewMode('major')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              viewMode === 'major'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Major
          </button>
          {patterns.length > 0 && (
            <button
              onClick={() => setViewMode('patterns')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'patterns'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              Patterns ({patterns.length})
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 text-white/80 text-sm rounded px-2 py-1 border border-white/10"
        >
          <option value="planet">Sort by Planet</option>
          <option value="type">Sort by Type</option>
          <option value="orb">Sort by Orb</option>
        </select>
      </div>

      {/* Aspect Patterns */}
      {viewMode === 'patterns' && patterns.length > 0 && (
        <div className="space-y-3">
          {patterns.map((pattern, idx) => (
            <AspectPatternCard
              key={idx}
              pattern={pattern}
              isExpanded={expandedAspect === `pattern-${idx}`}
              onToggle={() => setExpandedAspect(
                expandedAspect === `pattern-${idx}` ? null : `pattern-${idx}`
              )}
            />
          ))}
        </div>
      )}

      {/* Aspects List */}
      {viewMode !== 'patterns' && (
        <div className="space-y-2">
          {sortedAspects.map((aspect, idx) => (
            <AspectCard
              key={idx}
              aspect={aspect}
              isExpanded={expandedAspect === `aspect-${idx}`}
              onToggle={() => setExpandedAspect(
                expandedAspect === `aspect-${idx}` ? null : `aspect-${idx}`
              )}
            />
          ))}
        </div>
      )}

      {/* Detected Patterns Summary (when not in patterns view) */}
      {viewMode !== 'patterns' && patterns.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="text-sm font-bold text-white/70 mb-3">
            Detected Aspect Patterns:
          </div>
          <div className="flex flex-wrap gap-2">
            {patterns.map((pattern, idx) => {
              const config = PATTERN_CONFIG[pattern.pattern] || {};
              return (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${config.color}20`,
                    color: config.color,
                    border: `1px solid ${config.color}40`
                  }}
                >
                  {config.name || pattern.pattern}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Personality Impact */}
      {showPersonalityImpact && facetVector && (
        <PersonalityImpactSummary vector={facetVector} />
      )}

      {/* Legend */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <div className="text-sm font-bold text-white/70 mb-3">Aspect Types:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(ASPECT_CONFIG).slice(0, 6).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: config.color, color: 'white' }}
              >
                {config.symbol}
              </div>
              <span className="text-xs text-white/70">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <p className="text-xs text-white/50 leading-relaxed">
          <span className="font-bold text-white/70">Methodology: </span>
          Natal aspects show angular relationships between planets at birth.
          Harmonious aspects (Trine, Sextile) indicate natural ease;
          challenging aspects (Square, Opposition) drive growth through tension.
          Conjunctions amplify combined planetary energies.
        </p>
      </div>
    </div>
  );
}

/**
 * Individual Aspect Card
 */
function AspectCard({ aspect, isExpanded, onToggle }) {
  const planet1 = aspect.planet1?.name || aspect.planet1;
  const planet2 = aspect.planet2?.name || aspect.planet2;
  const aspectType = aspect.aspect;
  const orb = aspect.orb || 0;
  const interpretation = aspect.interpretation;

  const aspectConfig = ASPECT_CONFIG[aspectType] || ASPECT_CONFIG.Conjunction;
  const planet1Config = PLANET_CONFIG[planet1] || { symbol: '?', color: '#fff' };
  const planet2Config = PLANET_CONFIG[planet2] || { symbol: '?', color: '#fff' };

  // Calculate orb strength (tighter = stronger)
  const maxOrb = 8;
  const orbStrength = Math.max(0, 1 - Math.abs(orb) / maxOrb);

  return (
    <div
      className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-all border ${
        isExpanded ? 'border-white/30' : 'border-white/10'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Planet 1 */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: `${planet1Config.color}30`, color: planet1Config.color }}
          >
            {planet1Config.symbol}
          </div>

          {/* Aspect Symbol */}
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: `${aspectConfig.color}30`, color: aspectConfig.color }}
          >
            {aspectConfig.symbol}
          </div>

          {/* Planet 2 */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: `${planet2Config.color}30`, color: planet2Config.color }}
          >
            {planet2Config.symbol}
          </div>

          {/* Labels */}
          <div>
            <div className="text-sm font-medium text-white">
              {planet1} {aspectType} {planet2}
            </div>
            <div className="text-xs text-white/50">
              {aspectConfig.angle} | Orb: {Math.abs(orb).toFixed(1)}°
            </div>
          </div>
        </div>

        {/* Quality Badge & Strength */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-0.5 rounded text-xs font-bold ${
              aspectConfig.quality === 'harmonious'
                ? 'bg-emerald-500/20 text-emerald-400'
                : aspectConfig.quality === 'challenging'
                ? 'bg-red-500/20 text-red-400'
                : aspectConfig.quality === 'fusion'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {aspectConfig.quality}
          </div>

          {/* Strength indicator */}
          <div className="w-12 bg-white/10 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${orbStrength * 100}%`,
                backgroundColor: aspectConfig.color
              }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <p className="text-sm text-white/70">{aspectConfig.description}</p>
          {interpretation && (
            <p className="text-sm text-white/80 bg-black/20 rounded p-2">
              {interpretation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Aspect Pattern Card
 */
function AspectPatternCard({ pattern, isExpanded, onToggle }) {
  const config = PATTERN_CONFIG[pattern.pattern] || {
    name: pattern.pattern,
    color: '#6366f1',
    description: '',
    interpretation: ''
  };

  const planets = pattern.planets || [];

  return (
    <div
      className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border-2 overflow-hidden cursor-pointer`}
      style={{ borderColor: config.color }}
      onClick={onToggle}
    >
      <div
        className="p-4"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: `${config.color}30`, color: config.color }}
            >
              {config.symbol || pattern.pattern[0]}
            </div>
            <div>
              <div className="font-bold text-white text-lg">{config.name}</div>
              <div className="text-sm text-white/60">{config.description}</div>
            </div>
          </div>
          <div className="text-xl text-white/40">
            {isExpanded ? '-' : '+'}
          </div>
        </div>

        {/* Involved Planets */}
        <div className="flex gap-2 mt-3">
          {planets.map((planet, idx) => {
            const pConfig = PLANET_CONFIG[planet] || { symbol: '?', color: '#fff' };
            return (
              <div
                key={idx}
                className="px-2 py-1 rounded text-xs font-bold"
                style={{ backgroundColor: `${pConfig.color}30`, color: pConfig.color }}
              >
                {planet}
              </div>
            );
          })}
          {pattern.apex && (
            <div className="px-2 py-1 rounded text-xs font-bold bg-white/20 text-white">
              Apex: {pattern.apex}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          <p className="text-sm text-white/80">{config.interpretation}</p>

          {pattern.modifiers && (
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-xs text-white/50 mb-2">Personality Modifiers:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pattern.modifiers).map(([key, value]) => {
                  if (!key.endsWith('_mod')) return null;
                  const domain = key.replace('_mod', '');
                  const isPositive = value > 0;
                  return (
                    <span
                      key={key}
                      className={`text-xs px-2 py-0.5 rounded ${
                        isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {domain}: {isPositive ? '+' : ''}{(value * 100).toFixed(0)}%
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Personality Impact Summary
 */
function PersonalityImpactSummary({ vector }) {
  if (!vector || vector.length !== 30) return null;

  // Calculate domain averages (as deltas from baseline)
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
        Personality Modifiers from Aspects:
      </div>
      <div className="space-y-2">
        {Object.entries(domains).map(([domain, value]) => {
          const percent = Math.round(value * 100);
          return (
            <div key={domain} className="flex items-center gap-3">
              <div className="w-32 text-sm text-white/80">{domain}</div>
              <div className="flex-1 bg-white/10 rounded-full h-2 relative">
                <div
                  className="absolute top-0 h-2 rounded-full transition-all"
                  style={{
                    left: value < 0 ? `${50 + value * 50}%` : '50%',
                    width: `${Math.abs(value) * 50}%`,
                    backgroundColor: domainColors[domain]
                  }}
                />
                <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-white/40" />
              </div>
              <span
                className="w-12 text-right text-xs font-bold"
                style={{ color: domainColors[domain] }}
              >
                {value > 0 ? '+' : ''}{percent}%
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-white/40 mt-3">
        These modifiers are derived from your natal aspect configuration
      </p>
    </div>
  );
}
