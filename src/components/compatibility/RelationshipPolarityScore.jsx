/**
 * Relationship Polarity Score
 * Displays the weighted composite polarity score (0-100) with interpretation
 */

// Get score color based on value
const getScoreColor = (score) => {
  if (score >= 90) return { bg: 'bg-violet-500', glow: 'shadow-violet-500/50', text: 'text-violet-400' };
  if (score >= 80) return { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50', text: 'text-emerald-400' };
  if (score >= 70) return { bg: 'bg-cyan-500', glow: 'shadow-cyan-500/50', text: 'text-cyan-400' };
  if (score >= 60) return { bg: 'bg-amber-500', glow: 'shadow-amber-500/50', text: 'text-amber-400' };
  if (score >= 50) return { bg: 'bg-orange-500', glow: 'shadow-orange-500/50', text: 'text-orange-400' };
  return { bg: 'bg-red-500', glow: 'shadow-red-500/50', text: 'text-red-400' };
};

// Get label icon
const getLabelIcon = (label) => {
  const icons = {
    'Magnetic Polarity': '💫',
    'Harmonious Polarity': '🌟',
    'Balanced Polarity': '⚖️',
    'Dynamic Polarity': '⚡',
    'Challenging Polarity': '🔄',
    'Volatile Polarity': '🌋',
  };
  return icons[label] || '🎯';
};

export default function RelationshipPolarityScore({ polarityScore }) {
  if (!polarityScore) return null;

  const { score, label, interpretation, breakdown } = polarityScore;
  const colorStyle = getScoreColor(score);
  const icon = getLabelIcon(label);

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
          Relationship Polarity Score
        </div>
        <div className="text-xs text-white/50">
          Weighted 5-Axis Compatibility
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex flex-col items-center mb-6">
        {/* Score Circle */}
        <div className={`relative w-32 h-32 rounded-full ${colorStyle.bg}/20 flex items-center justify-center shadow-lg ${colorStyle.glow}`}>
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full border-4 ${colorStyle.bg}/40`} />

          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className={colorStyle.text}
              strokeDasharray={`${(score / 100) * 364} 364`}
              strokeLinecap="round"
            />
          </svg>

          {/* Score number */}
          <div className="text-center z-10">
            <div className={`text-4xl font-bold ${colorStyle.text}`}>{score}</div>
            <div className="text-[10px] text-white/40">/ 100</div>
          </div>
        </div>

        {/* Label */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className={`text-lg font-medium ${colorStyle.text}`}>{label}</span>
        </div>

        {/* Interpretation */}
        <div className="mt-2 text-sm text-white/60 text-center max-w-xs">
          {interpretation}
        </div>
      </div>

      {/* Score Breakdown */}
      {breakdown && (
        <div className="border-t border-slate-700/50 pt-4">
          <div className="text-[10px] text-white/40 uppercase mb-3 text-center">
            Axis Contributions
          </div>
          <div className="space-y-2">
            {Object.entries(breakdown).map(([axisName, data]) => (
              <div key={axisName} className="flex items-center gap-2">
                <div className="flex-1 text-xs text-white/60">{axisName}</div>
                <div className="w-20 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorStyle.bg}`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
                <div className="w-8 text-right text-[10px] text-white/40">{data.score}</div>
                <div className="w-10 text-right text-[10px] text-white/30">
                  ×{data.weight.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Weight Legend */}
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex justify-center gap-4 text-[9px] text-white/30">
            <span>Guna: 30%</span>
            <span>Dosha: 20%</span>
            <span>Element: 20%</span>
            <span>Yin/Yang: 15%</span>
            <span>Graha: 15%</span>
          </div>
        </div>
      )}
    </div>
  );
}
