/**
 * Polarity Archetype Diff Panel
 * Side-by-side comparison of two relationships' polarity archetypes
 * Shows where archetypes align, diverge, and what each relationship teaches
 */

// Get comparison style based on whether archetypes match
const getComparisonStyle = (sameArchetype) => {
  if (sameArchetype) {
    return {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Shared Archetype'
    };
  }
  return {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    label: 'Different Archetypes'
  };
};

// Get score comparison style
const getScoreStyle = (stronger) => {
  if (stronger === 'A') {
    return { colorA: 'text-emerald-400', colorB: 'text-white/50' };
  }
  if (stronger === 'B') {
    return { colorA: 'text-white/50', colorB: 'text-emerald-400' };
  }
  return { colorA: 'text-cyan-400', colorB: 'text-cyan-400' };
};

export default function PolarityArchetypeDiffPanel({
  diff,
  labelA = 'Relationship A',
  labelB = 'Relationship B'
}) {
  if (!diff) return null;

  const {
    summary,
    differences,
    teachingContrast,
    energeticShift,
    scoreComparison,
    archetypeComparison
  } = diff;

  const compStyle = getComparisonStyle(archetypeComparison?.sameArchetype);
  const scoreStyle = getScoreStyle(scoreComparison?.stronger);

  return (
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center">
            <span className="text-xl">🔀</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Polarity Archetype Diff</div>
            <div className="text-[10px] text-white/40">Relationship Comparison</div>
          </div>
        </div>

        {/* Archetype Match Badge */}
        <div className={`px-3 py-1 rounded-full ${compStyle.bg} border ${compStyle.border}`}>
          <span className={`text-[10px] font-medium ${compStyle.text}`}>
            {compStyle.label}
          </span>
        </div>
      </div>

      {/* Archetype Comparison Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Relationship A */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-[10px] text-white/40 uppercase mb-2">{labelA}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{archetypeComparison?.iconA || '🎯'}</span>
            <div className="text-sm text-white/80 font-medium leading-tight">
              {archetypeComparison?.nameA || 'Unknown'}
            </div>
          </div>
          <div className={`text-2xl font-bold ${scoreStyle.colorA}`}>
            {scoreComparison?.scoreA || 0}
            <span className="text-xs text-white/30 ml-1">pts</span>
          </div>
        </div>

        {/* Relationship B */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-[10px] text-white/40 uppercase mb-2">{labelB}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{archetypeComparison?.iconB || '🎯'}</span>
            <div className="text-sm text-white/80 font-medium leading-tight">
              {archetypeComparison?.nameB || 'Unknown'}
            </div>
          </div>
          <div className={`text-2xl font-bold ${scoreStyle.colorB}`}>
            {scoreComparison?.scoreB || 0}
            <span className="text-xs text-white/30 ml-1">pts</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-5 border border-slate-600/30">
        <div className="text-[10px] text-white/40 uppercase mb-2">Summary</div>
        <div className="text-sm text-white/70 leading-relaxed">
          {summary}
        </div>
      </div>

      {/* Key Differences */}
      {differences?.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] text-white/40 uppercase mb-3">Key Differences</div>
          <div className="space-y-2">
            {differences.map((d, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-white/60"
              >
                <span className="text-violet-400 mt-0.5">•</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What Each Relationship Teaches */}
      {teachingContrast?.length > 0 && (
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teachingContrast.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40"
            >
              <div className="text-[10px] text-white/40 uppercase mb-1">
                {idx === 0 ? labelA : labelB} Teaches
              </div>
              <div className="text-xs text-white/70 leading-relaxed">
                {t.replace(/^Relationship [AB] teaches: /, '')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Energetic Shift */}
      {energeticShift?.length > 0 && (
        <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-lg p-4 border border-violet-500/20">
          <div className="text-[10px] text-violet-400 uppercase mb-2">Energetic Shift</div>
          <div className="space-y-2">
            {energeticShift.map((shift, idx) => (
              <div key={idx} className="text-sm text-white/70 leading-relaxed">
                {shift}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Difference Bar */}
      {scoreComparison && scoreComparison.difference > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <div className="flex items-center justify-between text-[10px] text-white/40 mb-2">
            <span>{labelA}: {scoreComparison.scoreA}</span>
            <span>Difference: {scoreComparison.difference} pts</span>
            <span>{labelB}: {scoreComparison.scoreB}</span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
              style={{ width: `${(scoreComparison.scoreA / (scoreComparison.scoreA + scoreComparison.scoreB)) * 100}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
              style={{ width: `${(scoreComparison.scoreB / (scoreComparison.scoreA + scoreComparison.scoreB)) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
