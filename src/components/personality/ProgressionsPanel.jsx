/**
 * Progressions Panel (P8)
 * Displays secondary progressions and Progressed Moon
 *
 * Secondary progressions use the "day-for-a-year" method:
 * - Each day after birth = one year of life
 * - Progressed Moon moves ~1 deg per month (changes sign every 2.5 years)
 * - Shows evolved personality themes
 */

import React, { useState, useEffect } from 'react';
import {
  calculateProgressions,
  getProgressedMoon,
  getProgressionInterpretation
} from '../../data/lunaFusionService';

// Zodiac sign display configuration
const SIGN_CONFIG = {
  Aries: { symbol: 'Y', color: '#ef4444', element: 'Fire' },
  Taurus: { symbol: 'V', color: '#10b981', element: 'Earth' },
  Gemini: { symbol: 'G', color: '#eab308', element: 'Air' },
  Cancer: { symbol: 'C', color: '#e2e8f0', element: 'Water' },
  Leo: { symbol: 'L', color: '#f59e0b', element: 'Fire' },
  Virgo: { symbol: 'M', color: '#84cc16', element: 'Earth' },
  Libra: { symbol: 'l', color: '#f472b6', element: 'Air' },
  Scorpio: { symbol: 'S', color: '#9333ea', element: 'Water' },
  Sagittarius: { symbol: 'A', color: '#f97316', element: 'Fire' },
  Capricorn: { symbol: 'c', color: '#64748b', element: 'Earth' },
  Aquarius: { symbol: 'a', color: '#06b6d4', element: 'Air' },
  Pisces: { symbol: 'P', color: '#8b5cf6', element: 'Water' }
};

// Planet display configuration
const PLANET_CONFIG = {
  Sun: { symbol: 'SU', color: '#fbbf24', name: 'Progressed Sun' },
  Moon: { symbol: 'MO', color: '#e2e8f0', name: 'Progressed Moon' },
  Mercury: { symbol: 'ME', color: '#a3e635', name: 'Progressed Mercury' },
  Venus: { symbol: 'VE', color: '#f472b6', name: 'Progressed Venus' },
  Mars: { symbol: 'MA', color: '#ef4444', name: 'Progressed Mars' }
};

// Progressed Moon sign influences
const MOON_SIGN_INFLUENCE = {
  Aries: 'Emotional need for independence and action',
  Taurus: 'Emotional need for stability and comfort',
  Gemini: 'Emotional need for variety and communication',
  Cancer: 'Emotional need for security and nurturing',
  Leo: 'Emotional need for recognition and creativity',
  Virgo: 'Emotional need for order and improvement',
  Libra: 'Emotional need for harmony and partnership',
  Scorpio: 'Emotional need for depth and transformation',
  Sagittarius: 'Emotional need for freedom and meaning',
  Capricorn: 'Emotional need for achievement and structure',
  Aquarius: 'Emotional need for independence and innovation',
  Pisces: 'Emotional need for transcendence and compassion'
};

export default function ProgressionsPanel({
  birthData,
  progressionsData = null,
  targetDate = null,
  showAllPlanets = false
}) {
  const [progressions, setProgressions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('moon');
  const [showAll, setShowAll] = useState(showAllPlanets);

  useEffect(() => {
    if (progressionsData) {
      setProgressions(progressionsData);
      return;
    }

    if (birthData) {
      fetchProgressions();
    }
  }, [birthData, progressionsData, targetDate]);

  const fetchProgressions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await calculateProgressions(birthData, targetDate);
      setProgressions(result);
    } catch (err) {
      console.error('Error fetching progressions:', err);
      setError('Unable to calculate progressions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <div className="animate-pulse text-white/60">
          Calculating secondary progressions...
        </div>
      </div>
    );
  }

  if (error || !progressions) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <p className="text-white/60">{error || 'No progression data available'}</p>
        <p className="text-sm text-white/40 mt-2">
          Birth date and time required
        </p>
      </div>
    );
  }

  const { progressions: progData, facetVector, interpretation } = progressions;
  const progressedMoon = progData?.progressed_moon;
  const progressedPlanets = progData?.progressed_planets || {};
  const progressedAspects = progData?.progressed_aspects || [];
  const age = progData?.age;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Secondary Progressions
        </h3>
        <p className="text-sm text-white/60">
          Your evolving personality over time
        </p>
        {age && (
          <p className="text-xs text-white/40 mt-1">
            Progressed to age {age}
          </p>
        )}
      </div>

      {/* Progressed Moon - Primary Focus */}
      {progressedMoon && (
        <ProgressedMoonCard
          moon={progressedMoon}
          isExpanded={expandedSection === 'moon'}
          onToggle={() => setExpandedSection(
            expandedSection === 'moon' ? null : 'moon'
          )}
        />
      )}

      {/* Progressed Sun */}
      {progressedPlanets.Sun && (
        <ProgressedPlanetCard
          planet="Sun"
          data={progressedPlanets.Sun}
          isExpanded={expandedSection === 'sun'}
          onToggle={() => setExpandedSection(
            expandedSection === 'sun' ? null : 'sun'
          )}
        />
      )}

      {/* Toggle for Other Planets */}
      <div className="text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors"
        >
          {showAll ? 'Hide Other Planets' : 'Show All Progressed Planets'}
        </button>
      </div>

      {/* Other Progressed Planets */}
      {showAll && (
        <div className="space-y-3">
          {['Mercury', 'Venus', 'Mars'].map(planet => {
            const data = progressedPlanets[planet];
            if (!data) return null;
            return (
              <ProgressedPlanetCard
                key={planet}
                planet={planet}
                data={data}
                isExpanded={expandedSection === planet.toLowerCase()}
                onToggle={() => setExpandedSection(
                  expandedSection === planet.toLowerCase() ? null : planet.toLowerCase()
                )}
              />
            );
          })}
        </div>
      )}

      {/* Progressed Aspects */}
      {progressedAspects.length > 0 && (
        <ProgressedAspectsSection aspects={progressedAspects} />
      )}

      {/* Life Phase Interpretation */}
      {interpretation && (
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <div className="text-sm font-bold text-white/70 mb-3">
            Current Life Phase:
          </div>
          <p className="text-white/80 leading-relaxed">
            {interpretation}
          </p>
        </div>
      )}

      {/* Personality Evolution Summary */}
      {facetVector && (
        <PersonalityEvolutionSummary vector={facetVector} />
      )}

      {/* Methodology Note */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <p className="text-xs text-white/50 leading-relaxed">
          <span className="font-bold text-white/70">Day-for-a-Year Method: </span>
          Secondary progressions symbolize inner development. The Progressed Moon
          changes sign approximately every 2.5 years, representing shifting emotional
          needs and focus. The Progressed Sun moves about 1 degree per year,
          reflecting evolving identity themes.
        </p>
      </div>
    </div>
  );
}

/**
 * Progressed Moon Card - Primary focus
 */
function ProgressedMoonCard({ moon, isExpanded, onToggle }) {
  const sign = moon.sign;
  const signConfig = SIGN_CONFIG[sign] || SIGN_CONFIG.Aries;
  const degree = moon.degree || 0;
  const influence = MOON_SIGN_INFLUENCE[sign] || '';
  const nextSign = moon.next_sign;
  const daysToNextSign = moon.days_to_next_sign;

  return (
    <div
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border-2 overflow-hidden"
      style={{ borderColor: signConfig.color }}
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        style={{ backgroundColor: `${signConfig.color}15` }}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Moon Symbol */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{
                backgroundColor: `${PLANET_CONFIG.Moon.color}30`,
                color: PLANET_CONFIG.Moon.color
              }}
            >
              {PLANET_CONFIG.Moon.symbol}
            </div>

            {/* Sign Info */}
            <div>
              <div className="text-lg font-bold text-white">
                Progressed Moon in{' '}
                <span style={{ color: signConfig.color }}>{sign}</span>
              </div>
              <div className="text-sm text-white/60">
                {degree.toFixed(1)} deg | {signConfig.element} sign
              </div>
              <div className="text-xs text-white/40 mt-1">
                The "emotional heartbeat" of your chart
              </div>
            </div>
          </div>

          <div className="text-2xl text-white/40">
            {isExpanded ? '-' : '+'}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 pt-0 space-y-4">
          {/* Current Influence */}
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-sm font-bold text-white/70 mb-2">
              Current Emotional Focus:
            </div>
            <p className="text-white/90">{influence}</p>
          </div>

          {/* Sign Progression Bar */}
          <div>
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>{sign}</span>
              <span>{degree.toFixed(1)} deg / 30 deg</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(degree / 30) * 100}%`,
                  backgroundColor: signConfig.color
                }}
              />
            </div>
          </div>

          {/* Next Sign Preview */}
          {nextSign && daysToNextSign && (
            <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50">Next Phase:</div>
                <div className="text-white/80">
                  Moon enters{' '}
                  <span style={{ color: SIGN_CONFIG[nextSign]?.color || '#fff' }}>
                    {nextSign}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/50">In approximately:</div>
                <div className="text-white/80 font-bold">
                  {Math.round(daysToNextSign / 30)} months
                </div>
              </div>
            </div>
          )}

          {/* Moon Aspects */}
          {moon.aspects && moon.aspects.length > 0 && (
            <div>
              <div className="text-sm font-bold text-white/70 mb-2">
                Progressed Moon Aspects:
              </div>
              <div className="space-y-2">
                {moon.aspects.map((aspect, idx) => (
                  <div
                    key={idx}
                    className="bg-black/20 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="text-sm text-white/80">
                      {aspect.aspect} to {aspect.planet}
                    </div>
                    <div className="text-xs text-white/50">
                      orb: {Math.abs(aspect.orb).toFixed(1)} deg
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Progressed Planet Card
 */
function ProgressedPlanetCard({ planet, data, isExpanded, onToggle }) {
  const planetConfig = PLANET_CONFIG[planet] || { symbol: '?', color: '#fff' };
  const sign = data.sign;
  const signConfig = SIGN_CONFIG[sign] || SIGN_CONFIG.Aries;
  const degree = data.degree || 0;

  return (
    <div
      className="bg-slate-800/50 rounded-xl border cursor-pointer transition-all"
      style={{ borderColor: isExpanded ? planetConfig.color : 'rgba(255,255,255,0.1)' }}
      onClick={onToggle}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Planet Symbol */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            style={{
              backgroundColor: `${planetConfig.color}30`,
              color: planetConfig.color
            }}
          >
            {planetConfig.symbol}
          </div>

          {/* Info */}
          <div>
            <div className="font-bold text-white">
              {planetConfig.name}
            </div>
            <div className="text-sm text-white/60">
              <span style={{ color: signConfig.color }}>{sign}</span>
              {' '}{degree.toFixed(1)} deg
            </div>
          </div>
        </div>

        <div className="text-lg text-white/40">
          {isExpanded ? '-' : '+'}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/10">
          {data.interpretation && (
            <p className="text-sm text-white/80 mt-3">{data.interpretation}</p>
          )}

          {/* Aspects */}
          {data.aspects && data.aspects.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-white/50 mb-2">Active Aspects:</div>
              {data.aspects.map((aspect, idx) => (
                <div
                  key={idx}
                  className="text-sm text-white/70 py-1"
                >
                  {aspect.aspect} to {aspect.planet} ({aspect.orb.toFixed(1)} deg)
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Progressed Aspects Section
 */
function ProgressedAspectsSection({ aspects }) {
  const [showAll, setShowAll] = useState(false);
  const displayAspects = showAll ? aspects : aspects.slice(0, 3);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
      <div className="text-sm font-bold text-white/70 mb-3">
        Active Progressed Aspects:
      </div>
      <div className="space-y-2">
        {displayAspects.map((aspect, idx) => (
          <div
            key={idx}
            className="bg-black/20 rounded-lg p-3 flex items-center justify-between"
          >
            <div className="text-sm text-white/80">
              <span className="font-bold">{aspect.planet1}</span>
              {' '}{aspect.aspect}{' '}
              <span className="font-bold">{aspect.planet2}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">
                orb: {Math.abs(aspect.orb).toFixed(1)} deg
              </span>
              {aspect.exact_date && (
                <span className="text-xs text-white/40">
                  exact: {aspect.exact_date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {aspects.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-white/60 hover:text-white transition-colors"
        >
          {showAll ? 'Show less' : `Show ${aspects.length - 3} more`}
        </button>
      )}
    </div>
  );
}

/**
 * Personality Evolution Summary
 */
function PersonalityEvolutionSummary({ vector }) {
  if (!vector || vector.length !== 30) return null;

  // Calculate domain averages
  const domains = {
    'Emotional Sensitivity': vector.slice(0, 6).reduce((a, b) => a + b, 0) / 6,
    'Social Expression': vector.slice(6, 12).reduce((a, b) => a + b, 0) / 6,
    'Openness to Growth': vector.slice(12, 18).reduce((a, b) => a + b, 0) / 6,
    'Relational Harmony': vector.slice(18, 24).reduce((a, b) => a + b, 0) / 6,
    'Life Direction': vector.slice(24, 30).reduce((a, b) => a + b, 0) / 6
  };

  const domainColors = {
    'Emotional Sensitivity': '#8b5cf6',
    'Social Expression': '#f59e0b',
    'Openness to Growth': '#10b981',
    'Relational Harmony': '#ec4899',
    'Life Direction': '#3b82f6'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
      <div className="text-sm font-bold text-white/70 mb-3">
        Personality Evolution Themes:
      </div>
      <div className="space-y-2">
        {Object.entries(domains).map(([domain, value]) => {
          const percent = Math.round(value * 100);
          return (
            <div key={domain} className="flex items-center gap-3">
              <div className="w-40 text-sm text-white/80">{domain}</div>
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: domainColors[domain]
                  }}
                />
              </div>
              <span
                className="w-12 text-right text-xs font-bold"
                style={{ color: domainColors[domain] }}
              >
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-white/40 mt-3">
        These themes reflect your current life phase development
      </p>
    </div>
  );
}
