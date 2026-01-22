/**
 * Archetype Evolution Timeline
 * Shows how the relationship's polarity archetype shifts across Mahadasha periods
 * The temporal dimension of the Polarity Archetype system
 */

import { useMemo, useState } from 'react';

// Get planet color for visual styling
const getPlanetStyle = (planet) => {
  const styles = {
    Venus: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
    Shukra: { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
    Mars: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-red-500/20' },
    Mangala: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-red-500/20' },
    Saturn: { bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-400', glow: 'shadow-slate-500/20' },
    Shani: { bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-400', glow: 'shadow-slate-500/20' },
    Jupiter: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    Guru: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    Mercury: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    Budha: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    Rahu: { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
    Ketu: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    Moon: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    Chandra: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    Sun: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    Surya: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  };

  const planetKey = planet?.charAt(0).toUpperCase() + planet?.slice(1).toLowerCase();
  return styles[planetKey] || { bg: 'bg-gray-500/20', border: 'border-gray-500/40', text: 'text-gray-400', glow: 'shadow-gray-500/20' };
};

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
};

// Check if a period is current
const isCurrentPeriod = (start, end) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  return now >= startDate && now <= endDate;
};

// Timeline Period Card
function PeriodCard({ period, isExpanded, onToggle, isActive }) {
  const planetStyle = getPlanetStyle(period.planet);
  const current = isCurrentPeriod(period.start, period.end);

  return (
    <div
      className={`relative ${planetStyle.bg} rounded-xl p-4 border ${planetStyle.border}
        ${current ? `ring-2 ring-offset-2 ring-offset-slate-900 ring-${planetStyle.text.replace('text-', '')}` : ''}
        ${isActive ? 'shadow-lg ' + planetStyle.glow : ''}
        transition-all duration-300 cursor-pointer hover:scale-[1.01]`}
      onClick={onToggle}
    >
      {/* Current Period Badge */}
      {current && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-white">
          CURRENT
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${planetStyle.bg} border ${planetStyle.border} flex items-center justify-center`}>
            <span className="text-lg">{period.planetIcon}</span>
          </div>
          <div>
            <div className={`text-sm font-medium ${planetStyle.text}`}>
              {period.planet} Mahadasha
            </div>
            <div className="text-[10px] text-white/40">
              {formatDate(period.start)} – {formatDate(period.end)}
            </div>
          </div>
        </div>

        {/* Archetype Badge */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{period.archetypeIcon}</span>
          <div className="text-right">
            <div className="text-xs text-white/70 font-medium">{period.archetype}</div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-xs text-white/60 mb-3 leading-relaxed">
        {period.summary}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-white/10">
          {/* Archetype Description */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-[10px] text-white/40 uppercase mb-1">Archetype Expression</div>
            <div className="text-xs text-white/70 leading-relaxed">
              {period.archetypeDescription}
            </div>
          </div>

          {/* Growth & Shadow */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 uppercase mb-1">Growth Themes</div>
              <div className="text-xs text-white/60 leading-relaxed">
                {period.growth}
              </div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <div className="text-[10px] text-red-400 uppercase mb-1">Shadow Themes</div>
              <div className="text-xs text-white/60 leading-relaxed">
                {period.shadow}
              </div>
            </div>
          </div>

          {/* Keywords */}
          {period.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {period.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-[9px] ${planetStyle.bg} ${planetStyle.border} ${planetStyle.text} border`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expand/Collapse Indicator */}
      <div className="flex justify-center mt-2">
        <span className={`text-xs text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>
    </div>
  );
}

export default function ArchetypeEvolutionTimeline({ timeline }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Find current period index
  const currentPeriodIndex = useMemo(() => {
    return timeline?.findIndex(p => isCurrentPeriod(p.start, p.end)) ?? -1;
  }, [timeline]);

  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center">
            <span className="text-xl">🕐</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Archetype Evolution Timeline</div>
            <div className="text-[10px] text-white/40">How the relationship transforms across Mahadasha periods</div>
          </div>
        </div>

        <div className="text-[10px] text-white/30">
          {timeline.length} periods
        </div>
      </div>

      {/* Timeline Introduction */}
      <div className="bg-slate-700/30 rounded-lg p-3 mb-5 border border-slate-600/30">
        <div className="text-xs text-white/60 text-center leading-relaxed">
          The relationship's polarity archetype shifts as different planets "run" the relationship
          during each Mahadasha period, creating a living mythos that evolves over time.
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-2">
        {timeline.map((period, idx) => {
          const planetStyle = getPlanetStyle(period.planet);
          const isCurrent = isCurrentPeriod(period.start, period.end);

          return (
            <div
              key={idx}
              className={`flex-1 min-w-[60px] h-2 rounded-full ${planetStyle.bg} border ${planetStyle.border}
                ${isCurrent ? 'ring-2 ring-white/50' : ''}`}
              title={`${period.planet}: ${period.archetype}`}
            />
          );
        })}
      </div>

      {/* Timeline Periods */}
      <div className="space-y-3">
        {timeline.map((period, idx) => (
          <PeriodCard
            key={idx}
            period={period}
            isExpanded={expandedIndex === idx}
            onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            isActive={currentPeriodIndex === idx}
          />
        ))}
      </div>

      {/* Timeline Legend */}
      <div className="mt-5 pt-4 border-t border-slate-700/30">
        <div className="text-[10px] text-white/30 text-center">
          Click on any period to explore its growth and shadow themes
        </div>
      </div>
    </div>
  );
}
