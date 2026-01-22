/**
 * Composite Archetype Forecast Timeline
 * Multi-chapter mythic future across the next 3 Mahadashas
 *
 * This is the prophetic chamber of the Relationship Cathedral —
 * projecting the relationship's future story arc through planetary time.
 */

import { useState } from 'react';

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

// Get phase styling
const getPhaseStyle = (phase) => {
  const styles = {
    'Current/Emerging': {
      bg: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    'Middle Chapter': {
      bg: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20'
    },
    'Distant Future': {
      bg: 'bg-gradient-to-r from-violet-500/20 to-purple-500/20',
      border: 'border-violet-500/40',
      text: 'text-violet-400',
      glow: 'shadow-violet-500/20'
    }
  };
  return styles[phase] || styles['Middle Chapter'];
};

// Get confidence color
const getConfidenceColor = (confidence) => {
  if (confidence >= 70) return 'text-emerald-400';
  if (confidence >= 40) return 'text-amber-400';
  return 'text-red-400';
};

// Chapter Card Component
function ChapterCard({ chapter, isExpanded, onToggle }) {
  const phaseStyle = getPhaseStyle(chapter.phase);

  return (
    <div
      className={`relative ${phaseStyle.bg} rounded-xl p-4 border ${phaseStyle.border}
        shadow-lg ${phaseStyle.glow} transition-all duration-300 cursor-pointer hover:scale-[1.01]`}
      onClick={onToggle}
    >
      {/* Chapter Number Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shadow-lg">
        <span className="text-sm font-bold text-white">{chapter.chapterNumber}</span>
      </div>

      {/* Phase Badge */}
      <div className="absolute -top-2 right-3">
        <div className={`px-2 py-0.5 rounded-full ${phaseStyle.bg} border ${phaseStyle.border}`}>
          <span className="text-[9px] font-medium text-white/60">
            {chapter.phaseIcon} {chapter.phase}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mt-2 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${phaseStyle.bg} border ${phaseStyle.border} flex items-center justify-center`}>
            <span className="text-xl">{chapter.planetIcon}</span>
          </div>
          <div>
            <div className={`text-sm font-medium ${phaseStyle.text}`}>
              {chapter.planet} Mahadasha
            </div>
            <div className="text-[10px] text-white/40">
              {formatDate(chapter.start)} – {formatDate(chapter.end)}
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="text-right">
          <div className={`text-lg font-bold ${getConfidenceColor(chapter.confidence)}`}>
            {chapter.confidence}%
          </div>
          <div className="text-[9px] text-white/40">confidence</div>
        </div>
      </div>

      {/* Archetype */}
      <div className="bg-slate-800/50 rounded-lg p-3 mb-3 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{chapter.archetypeIcon}</span>
          <span className="text-sm text-white/90 font-medium">{chapter.archetype}</span>
        </div>
        <div className="text-xs text-white/60 leading-relaxed">
          {chapter.chapterNarrative}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-white/10">
          {/* Archetype Description */}
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-[10px] text-white/40 uppercase mb-1">Archetype Essence</div>
            <div className="text-xs text-white/70 leading-relaxed">
              {chapter.archetypeDescription}
            </div>
          </div>

          {/* Growth & Shadow */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400 uppercase mb-1">Growth Themes</div>
              <div className="text-xs text-white/60 leading-relaxed">
                {chapter.growth}
              </div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <div className="text-[10px] text-red-400 uppercase mb-1">Shadow Themes</div>
              <div className="text-xs text-white/60 leading-relaxed">
                {chapter.shadow}
              </div>
            </div>
          </div>

          {/* Keywords */}
          {chapter.archetypeKeywords?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {chapter.archetypeKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-[9px] ${phaseStyle.bg} ${phaseStyle.border} ${phaseStyle.text} border`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

          {/* Score Breakdown */}
          {chapter.scoreBreakdown && (
            <details className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <summary className="text-[10px] text-white/40 uppercase cursor-pointer">
                Score Breakdown
              </summary>
              <div className="mt-2 space-y-1">
                {Object.entries(chapter.scoreBreakdown).map(([arch, score], idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50 truncate max-w-[180px]">{arch}</span>
                    <span className="text-[10px] text-white/40 font-mono">{(score * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Expand Indicator */}
      <div className="flex justify-center mt-2">
        <span className={`text-xs text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>
    </div>
  );
}

// Arc Summary Component
function ArcSummary({ arcSummary }) {
  if (!arcSummary) return null;

  return (
    <div className="bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-pink-500/10 rounded-xl p-4 border border-violet-500/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🌊</span>
        <span className="text-sm text-white/90 font-medium">Mythic Arc</span>
        <span className={`ml-auto text-sm font-bold ${getConfidenceColor(arcSummary.averageConfidence)}`}>
          {arcSummary.averageConfidence}% avg
        </span>
      </div>

      {/* Arc Narrative */}
      <div className="text-sm text-white/70 leading-relaxed mb-4 italic">
        "{arcSummary.arcNarrative}"
      </div>

      {/* Archetype Sequence */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {arcSummary.archetypeSequence.map((arch, idx) => (
          <div key={idx} className="flex items-center">
            <div className="px-2 py-1 rounded-lg bg-slate-700/50 border border-slate-600/50">
              <span className="text-[10px] text-white/60">{arch}</span>
            </div>
            {idx < arcSummary.archetypeSequence.length - 1 && (
              <span className="text-white/30 mx-1">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Arc Themes */}
      {arcSummary.arcThemes?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {arcSummary.arcThemes.map((theme, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30"
            >
              {theme}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Timeline Connection Line
function TimelineConnector() {
  return (
    <div className="flex justify-center py-2">
      <div className="w-0.5 h-8 bg-gradient-to-b from-slate-600/50 via-cyan-500/30 to-slate-600/50" />
    </div>
  );
}

export default function CompositeArchetypeForecastTimeline({ forecastTimeline }) {
  const [expandedChapter, setExpandedChapter] = useState(null);

  if (!forecastTimeline || !forecastTimeline.timeline?.length) return null;

  const { timeline, arcSummary, totalChapters } = forecastTimeline;

  return (
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 via-cyan-500/30 to-violet-500/30 flex items-center justify-center shadow-lg">
            <span className="text-2xl">📜</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Composite Archetype Forecast Timeline</div>
            <div className="text-[10px] text-white/40">The Relationship's Mythic Future</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white/70">{totalChapters}</div>
          <div className="text-[9px] text-white/40">chapters</div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-slate-700/30 rounded-lg p-3 mb-5 border border-slate-600/30">
        <div className="text-xs text-white/60 text-center leading-relaxed">
          The relationship's future unfolds across mythic chapters, each shaped by a ruling Mahadasha planet.
          As planetary time shifts, so does the relationship's archetype — creating a living story arc.
        </div>
      </div>

      {/* Arc Summary (if available) */}
      {arcSummary && (
        <div className="mb-5">
          <ArcSummary arcSummary={arcSummary} />
        </div>
      )}

      {/* Timeline Chapters */}
      <div className="space-y-0">
        {timeline.map((chapter, idx) => (
          <div key={idx}>
            <ChapterCard
              chapter={chapter}
              isExpanded={expandedChapter === idx}
              onToggle={() => setExpandedChapter(expandedChapter === idx ? null : idx)}
            />
            {idx < timeline.length - 1 && <TimelineConnector />}
          </div>
        ))}
      </div>

      {/* Oracle Footer */}
      <div className="mt-5 pt-4 border-t border-slate-700/30">
        <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-violet-500/10 rounded-lg p-4 border border-amber-500/20">
          <div className="text-[10px] text-amber-400 uppercase mb-2">Prophetic Chamber</div>
          <div className="text-xs text-white/60 leading-relaxed">
            This forecast projects the relationship's archetypal evolution across the next three Mahadasha periods.
            Each chapter represents a distinct mythic phase — from current emergence through middle development
            to distant future realization. The relationship's story is written in planetary time.
          </div>
        </div>
      </div>
    </div>
  );
}
