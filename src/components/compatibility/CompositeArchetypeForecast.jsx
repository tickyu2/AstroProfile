/**
 * Composite Archetype Forecast
 * Predicts the relationship's future archetype based on:
 * - Upcoming Mahadasha (50% weight)
 * - Major transits (30% weight)
 * - Composite polarity geometry (20% weight)
 *
 * The living oracle that projects how the relationship will evolve
 */

import { useState } from 'react';

// Get color styling based on confidence level
const getConfidenceStyle = (confidence) => {
  if (confidence >= 70) {
    return {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      label: 'High Confidence'
    };
  } else if (confidence >= 40) {
    return {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      label: 'Moderate Confidence'
    };
  } else {
    return {
      bg: 'bg-red-500/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      label: 'Low Confidence'
    };
  }
};

// Contribution source card
function ContributionSource({ title, icon, weight, planet, traits, active, contributions }) {
  const hasContributions = contributions && Object.keys(contributions).length > 0;

  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs text-white/70 font-medium">{title}</span>
        </div>
        <span className="text-[10px] text-white/40 font-mono">{weight}</span>
      </div>

      {/* Source Details */}
      {planet && (
        <div className="text-[10px] text-white/50 mb-2">
          Current Planet: <span className="text-violet-400">{planet}</span>
        </div>
      )}

      {traits && traits.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {traits.map((trait, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded text-[9px] bg-slate-700/50 text-white/50"
            >
              {trait.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {active && active.length > 0 && (
        <div className="space-y-1 mb-2">
          {active.map((transit, idx) => (
            <div key={idx} className="text-[10px] text-cyan-400/70">
              {transit}
            </div>
          ))}
        </div>
      )}

      {/* Top Contributions */}
      {hasContributions && (
        <div className="space-y-1 pt-2 border-t border-slate-700/30">
          {Object.entries(contributions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([archetype, score], idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-[9px] text-white/40 truncate max-w-[140px]">
                  {archetype}
                </span>
                <span className="text-[9px] text-white/30 font-mono">
                  +{(score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      )}

      {!hasContributions && (
        <div className="text-[9px] text-white/30 italic">No active contribution</div>
      )}
    </div>
  );
}

// Archetype score bar
function ArchetypeScoreBar({ archetype, score, isWinner }) {
  const maxScore = 1.0;
  const percentage = Math.min(100, (score / maxScore) * 100);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className={`${isWinner ? 'text-violet-400 font-medium' : 'text-white/50'} truncate max-w-[200px]`}>
          {isWinner && '★ '}{archetype}
        </span>
        <span className="text-white/40 font-mono">{(score * 100).toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isWinner
            ? 'bg-gradient-to-r from-violet-500 to-pink-500'
            : 'bg-slate-500/50'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function CompositeArchetypeForecast({ forecast }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!forecast) return null;

  const {
    forecastArchetype,
    archetypeIcon,
    archetypeDescription,
    archetypeKeywords,
    confidence,
    narrative,
    runnerUp,
    contributions,
    allScores
  } = forecast;

  const confidenceStyle = getConfidenceStyle(confidence);

  return (
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center shadow-lg">
            <span className="text-2xl">{archetypeIcon}</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Archetype Forecast</div>
            <div className="text-[10px] text-white/40">Living Oracle Projection</div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className={`${confidenceStyle.bg} rounded-full px-3 py-1 border ${confidenceStyle.border}`}>
          <div className="flex items-center gap-2">
            <div className={`text-lg font-bold ${confidenceStyle.text}`}>
              {confidence}%
            </div>
            <div className="text-[9px] text-white/40">{confidenceStyle.label}</div>
          </div>
        </div>
      </div>

      {/* Forecast Archetype */}
      <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-xl p-4 mb-5 border border-violet-500/20">
        <div className="text-center mb-3">
          <div className="text-[10px] text-violet-400 uppercase tracking-wider mb-1">
            Emerging Archetype
          </div>
          <div className="text-xl text-white/90 font-medium">
            {forecastArchetype}
          </div>
        </div>

        {/* Keywords */}
        {archetypeKeywords?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mb-3">
            {archetypeKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="text-xs text-white/60 text-center leading-relaxed">
          {archetypeDescription}
        </div>
      </div>

      {/* Narrative */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-5 border border-slate-600/30">
        <div className="text-[10px] text-white/40 uppercase mb-2">Forecast Narrative</div>
        <div className="text-sm text-white/70 leading-relaxed italic">
          "{narrative}"
        </div>
      </div>

      {/* Runner-up */}
      {runnerUp && (
        <div className="bg-slate-800/40 rounded-lg p-3 mb-5 border border-slate-700/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/40 uppercase mb-1">Runner-Up</div>
              <div className="text-sm text-white/60">{runnerUp.archetype}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/40">Score</div>
              <div className="text-sm text-white/50 font-mono">
                {(runnerUp.score * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Breakdown */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors text-xs text-white/50 flex items-center justify-center gap-2"
      >
        <span>{showBreakdown ? 'Hide' : 'Show'} Contribution Breakdown</span>
        <span className={`transition-transform ${showBreakdown ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Contribution Breakdown */}
      {showBreakdown && (
        <div className="mt-5 space-y-4">
          {/* Contribution Sources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ContributionSource
              title="Mahadasha"
              icon="🪐"
              weight={contributions?.mahadasha?.weight || '50%'}
              planet={contributions?.mahadasha?.planet}
              contributions={contributions?.mahadasha?.contributions}
            />
            <ContributionSource
              title="Transits"
              icon="✨"
              weight={contributions?.transits?.weight || '30%'}
              active={contributions?.transits?.active}
              contributions={contributions?.transits?.contributions}
            />
            <ContributionSource
              title="Polarity Geometry"
              icon="⚛️"
              weight={contributions?.polarityGeometry?.weight || '20%'}
              traits={contributions?.polarityGeometry?.traits}
              contributions={contributions?.polarityGeometry?.contributions}
            />
          </div>

          {/* All Scores */}
          {allScores && Object.keys(allScores).length > 0 && (
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
              <div className="text-[10px] text-white/40 uppercase mb-3">Top Archetype Scores</div>
              {Object.entries(allScores).map(([archetype, score], idx) => (
                <ArchetypeScoreBar
                  key={archetype}
                  archetype={archetype}
                  score={score}
                  isWinner={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interpretive Footer */}
      <div className="mt-5 pt-4 border-t border-slate-700/30">
        <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-lg p-4 border border-cyan-500/20">
          <div className="text-[10px] text-cyan-400 uppercase mb-2">Oracle Insight</div>
          <div className="text-xs text-white/60 leading-relaxed">
            This forecast projects how planetary time (Dashas) and planetary weather (Transits)
            will reshape your relationship's polarity geometry. As these cosmic factors shift,
            the relationship itself transforms — embracing new archetypes while integrating
            the lessons of the past.
          </div>
        </div>
      </div>
    </div>
  );
}
