/**
 * Relationship Polarity Map Panel
 * Displays 5-axis compatibility diagram: Guna, Dosha, Element, Yin/Yang, Graha Dominance
 */

import { useMemo } from 'react';

// Axis icon mapping
const AXIS_ICONS = {
  Guna: '🧘',
  Dosha: '🌿',
  Element: '🔥',
  'Yin/Yang': '☯️',
  'Graha Dominance': '🪐',
};

// Polarity badge styles
const getPolarityStyle = (polarity) => {
  const styles = {
    Resonant: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
    Harmonizing: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
    Harmonious: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
    Balancing: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
    Cooling: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
    Magnetic: { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-400' },
    Complementary: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
    Activating: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
    Dynamic: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
    Stabilizing: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-400' },
    Amplifying: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
    Volatile: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
    Intense: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
    Frictional: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400' },
    Parallel: { bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-400' },
    Dispersed: { bg: 'bg-slate-500/20', border: 'border-slate-500/40', text: 'text-slate-400' },
    Mixed: { bg: 'bg-gray-500/20', border: 'border-gray-500/40', text: 'text-gray-400' },
    // Graha Axis types
    'Passion Axis': { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400' },
    'Stability-Emotion Axis': { bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-400' },
    'Wisdom-Communication Axis': { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-400' },
    'Identity-Emotion Axis': { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
    'Expansion-Pleasure Axis': { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  };
  return styles[polarity] || styles.Mixed;
};

// Get score color based on weighted polarity score
const getScoreStyle = (score) => {
  if (score >= 90) return { bg: 'bg-violet-500/30', border: 'border-violet-500/50', text: 'text-violet-400', glow: 'shadow-violet-500/30' };
  if (score >= 80) return { bg: 'bg-emerald-500/30', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' };
  if (score >= 70) return { bg: 'bg-cyan-500/30', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' };
  if (score >= 60) return { bg: 'bg-amber-500/30', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-amber-500/30' };
  if (score >= 50) return { bg: 'bg-orange-500/30', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-orange-500/30' };
  return { bg: 'bg-red-500/30', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/30' };
};

export default function RelationshipPolarityMapPanel({
  polarityMap,
  personAName = 'Person A',
  personBName = 'Person B'
}) {
  if (!polarityMap || !polarityMap.axes?.length) return null;

  const polarityScore = polarityMap.polarityScore;
  const score = polarityScore?.score ?? polarityMap.harmonyScore ?? 0;
  const scoreStyle = getScoreStyle(score);

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header with Weighted Polarity Score */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center">
            <span className="text-xl">🎯</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Relationship Polarity Map</div>
            <div className="text-[10px] text-white/40">5-Axis Energetic Compatibility</div>
          </div>
        </div>

        {/* Weighted Polarity Score Badge */}
        <div className={`px-4 py-2 rounded-xl ${scoreStyle.bg} border ${scoreStyle.border} shadow-lg ${scoreStyle.glow}`}>
          <div className={`text-3xl font-bold ${scoreStyle.text} text-center`}>{score}</div>
          <div className="text-[9px] text-white/50 text-center">
            {polarityScore?.label || 'Polarity Score'}
          </div>
        </div>
      </div>

      {/* Score Interpretation */}
      {polarityScore?.interpretation && (
        <div className={`mb-5 p-3 rounded-lg ${scoreStyle.bg}/50 border ${scoreStyle.border}`}>
          <div className="text-xs text-white/70 text-center">
            {polarityScore.interpretation}
          </div>
        </div>
      )}

      {/* Polarity Summary */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-emerald-500/10 rounded-lg p-3 text-center border border-emerald-500/20">
          <div className="text-lg font-bold text-emerald-400">{polarityMap.positiveAxes || 0}</div>
          <div className="text-[9px] text-white/40">Harmonious</div>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-3 text-center border border-amber-500/20">
          <div className="text-lg font-bold text-amber-400">{polarityMap.neutralAxes || 0}</div>
          <div className="text-[9px] text-white/40">Dynamic</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/20">
          <div className="text-lg font-bold text-red-400">{polarityMap.challengingAxes || 0}</div>
          <div className="text-[9px] text-white/40">Challenging</div>
        </div>
      </div>

      {/* 5-Axis Visualization */}
      <div className="space-y-3 mb-5">
        {polarityMap.axes.map((axis, idx) => {
          const polarityStyle = getPolarityStyle(axis.polarity);
          const icon = AXIS_ICONS[axis.axis] || '🔮';

          return (
            <div
              key={idx}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
            >
              {/* Axis Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span className="text-sm text-white/80 font-medium">{axis.axis}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${polarityStyle.bg} ${polarityStyle.border} ${polarityStyle.text} border`}
                >
                  {axis.polarity}
                </span>
              </div>

              {/* Person Values */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-700/30 rounded px-2 py-1.5 text-center">
                  <div className="text-[9px] text-white/40 mb-0.5">{personAName}</div>
                  <div className="text-xs text-white/80">{axis.personA}</div>
                </div>
                <div className="text-white/20 text-xs">↔</div>
                <div className="flex-1 bg-slate-700/30 rounded px-2 py-1.5 text-center">
                  <div className="text-[9px] text-white/40 mb-0.5">{personBName}</div>
                  <div className="text-xs text-white/80">{axis.personB}</div>
                </div>
              </div>

              {/* Description */}
              <div className="text-[11px] text-white/50 leading-relaxed">
                {axis.description}
              </div>

              {/* Visual Polarity Bar */}
              <div className="mt-2 h-1 rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: getPolarityWidth(axis.polarity),
                    backgroundColor: axis.color || '#64748B'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dominant Polarity */}
      {polarityMap.dominantPolarity && (
        <div className="bg-slate-700/30 rounded-lg p-3 mb-4 border border-slate-600/30">
          <div className="text-[10px] text-white/40 uppercase mb-1">Dominant Polarity</div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPolarityStyle(polarityMap.dominantPolarity).bg} ${getPolarityStyle(polarityMap.dominantPolarity).text}`}
            >
              {polarityMap.dominantPolarity}
            </span>
            <span className="text-xs text-white/60">
              defines the overall energetic tone of this relationship
            </span>
          </div>
        </div>
      )}

      {/* Narrative Summary */}
      {polarityMap.narrative && (
        <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-lg p-4 border border-violet-500/20">
          <div className="text-[10px] text-violet-400 uppercase mb-2">Polarity Synthesis</div>
          <div className="text-sm text-white/70 leading-relaxed">
            {polarityMap.narrative}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: Get width percentage based on polarity type
function getPolarityWidth(polarity) {
  const widths = {
    Resonant: '100%',
    Harmonizing: '95%',
    Harmonious: '95%',
    Balancing: '90%',
    Cooling: '85%',
    Magnetic: '90%',
    Complementary: '80%',
    Stabilizing: '75%',
    Activating: '60%',
    Dynamic: '55%',
    Parallel: '50%',
    Mixed: '50%',
    Dispersed: '45%',
    Amplifying: '40%',
    Frictional: '35%',
    Volatile: '30%',
    Intense: '25%',
  };
  return widths[polarity] || '50%';
}
