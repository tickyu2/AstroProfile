/**
 * Archetype Evolution Diff Panel
 * Side-by-side comparison of how two relationships evolve across Mahadasha periods
 * Compares karmic rhythms, growth periods, shadow phases, and archetype shifts
 */

// Category styling
const getCategoryStyle = (category) => {
  const styles = {
    timeline: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      text: 'text-violet-400',
      icon: '🕐'
    },
    shifts: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      icon: '🔄'
    },
    karmic: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: '☸️'
    },
    growth: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: '🌱'
    },
    shadow: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: '🌑'
    }
  };
  return styles[category] || styles.timeline;
};

// Comparison category component
function ComparisonCategory({ title, items, category }) {
  const style = getCategoryStyle(category);

  if (!items || items.length === 0) return null;

  return (
    <div className={`${style.bg} rounded-lg p-4 border ${style.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{style.icon}</span>
        <span className={`text-sm font-medium ${style.text}`}>{title}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className={`text-xs ${style.text} mt-0.5`}>•</span>
            <span className="text-xs text-white/60 leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Period count comparison bar
function PeriodCountBar({ label, countA, countB, colorA, colorB }) {
  const total = countA + countB || 1;
  const percentA = (countA / total) * 100;
  const percentB = (countB / total) * 100;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
        <span>{label}</span>
        <span>A: {countA} | B: {countB}</span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden flex">
        <div
          className={`h-full ${colorA}`}
          style={{ width: `${percentA}%` }}
        />
        <div
          className={`h-full ${colorB}`}
          style={{ width: `${percentB}%` }}
        />
      </div>
    </div>
  );
}

export default function ArchetypeEvolutionDiffPanel({
  diff,
  labelA = 'Relationship A',
  labelB = 'Relationship B'
}) {
  if (!diff) return null;

  const {
    summary,
    timelineComparison,
    archetypeShifts,
    karmicRhythm,
    growthContrast,
    shadowContrast,
    periodCounts
  } = diff;

  const countsA = periodCounts?.relationshipA || {};
  const countsB = periodCounts?.relationshipB || {};

  return (
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-xl p-5 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-orange-500/30 flex items-center justify-center">
            <span className="text-xl">⚖️</span>
          </div>
          <div>
            <div className="text-sm text-white/90 font-medium">Archetype Evolution Diff</div>
            <div className="text-[10px] text-white/40">Timeline Comparison</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            <span className="text-[10px] text-white/40">{labelA}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
            <span className="text-[10px] text-white/40">{labelB}</span>
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

      {/* Period Count Comparison */}
      {periodCounts && (
        <div className="bg-slate-800/40 rounded-lg p-4 mb-5 border border-slate-700/40">
          <div className="text-[10px] text-white/40 uppercase mb-3">Period Distribution</div>

          <PeriodCountBar
            label="Karmic Periods (Saturn/Ketu/Rahu)"
            countA={countsA.karmic || 0}
            countB={countsB.karmic || 0}
            colorA="bg-gradient-to-r from-violet-500 to-pink-500"
            colorB="bg-gradient-to-r from-cyan-500 to-emerald-500"
          />

          <PeriodCountBar
            label="Growth Periods (Jupiter/Venus)"
            countA={countsA.growth || 0}
            countB={countsB.growth || 0}
            colorA="bg-gradient-to-r from-violet-500 to-pink-500"
            colorB="bg-gradient-to-r from-cyan-500 to-emerald-500"
          />

          <PeriodCountBar
            label="Shadow Periods (Saturn/Mars/Rahu)"
            countA={countsA.shadow || 0}
            countB={countsB.shadow || 0}
            colorA="bg-gradient-to-r from-violet-500 to-pink-500"
            colorB="bg-gradient-to-r from-cyan-500 to-emerald-500"
          />
        </div>
      )}

      {/* Comparison Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <ComparisonCategory
          title="Timeline Differences"
          items={timelineComparison}
          category="timeline"
        />

        <ComparisonCategory
          title="Archetype Shifts"
          items={archetypeShifts}
          category="shifts"
        />

        <ComparisonCategory
          title="Karmic Rhythm"
          items={karmicRhythm}
          category="karmic"
        />

        <ComparisonCategory
          title="Growth Contrast"
          items={growthContrast}
          category="growth"
        />
      </div>

      {/* Shadow Contrast - Full Width */}
      <ComparisonCategory
        title="Shadow Contrast"
        items={shadowContrast}
        category="shadow"
      />

      {/* Interpretive Footer */}
      <div className="mt-5 pt-4 border-t border-slate-700/30">
        <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-lg p-4 border border-violet-500/20">
          <div className="text-[10px] text-violet-400 uppercase mb-2">Evolutionary Insight</div>
          <div className="text-xs text-white/60 leading-relaxed">
            Each relationship follows its own mythic timeline. Understanding how archetypes shift
            across planetary periods reveals the deeper karmic story of each connection —
            where growth happens, where challenges arise, and how the relationship transforms over time.
          </div>
        </div>
      </div>
    </div>
  );
}
