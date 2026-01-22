/**
 * Relationship Polarity Archetype
 * Displays the mythic identity of the relationship based on 5-axis polarity fusion
 * Positioned between Polarity Score and Polarity Map
 */

// Archetype color mapping
const getArchetypeStyle = (name) => {
  const styles = {
    'The Magnetic Opposites': {
      bg: 'bg-gradient-to-br from-pink-500/20 to-violet-500/20',
      border: 'border-pink-500/40',
      text: 'text-pink-400',
      glow: 'shadow-pink-500/20'
    },
    'The Harmonious Twins': {
      bg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20'
    },
    'The Fire-Air Circuit': {
      bg: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      glow: 'shadow-orange-500/20'
    },
    'The Earth-Water Foundation': {
      bg: 'bg-gradient-to-br from-green-500/20 to-cyan-500/20',
      border: 'border-green-500/40',
      text: 'text-green-400',
      glow: 'shadow-green-500/20'
    },
    'The Stabilizer-Visionary Pair': {
      bg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/40',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-500/20'
    },
    'The Dharma Companions': {
      bg: 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20',
      border: 'border-violet-500/40',
      text: 'text-violet-400',
      glow: 'shadow-violet-500/20'
    },
    'The Passion Axis': {
      bg: 'bg-gradient-to-br from-rose-500/20 to-red-500/20',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/20'
    },
    'The Transformational Pair': {
      bg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    },
    'The Parallel Travelers': {
      bg: 'bg-gradient-to-br from-slate-500/20 to-gray-500/20',
      border: 'border-slate-500/40',
      text: 'text-slate-400',
      glow: 'shadow-slate-500/20'
    },
    'The Creative Disruptors': {
      bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    'The Karmic Mirrors': {
      bg: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      glow: 'shadow-red-500/20'
    },
    'The Sacred Counterweights': {
      bg: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20'
    },
    'The Balanced Polarity Pair': {
      bg: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20'
    }
  };
  return styles[name] || styles['The Balanced Polarity Pair'];
};

export default function RelationshipPolarityArchetype({ archetype }) {
  if (!archetype) return null;

  const { name, description, keywords, icon, classification } = archetype;
  const style = getArchetypeStyle(name);

  return (
    <div className={`${style.bg} backdrop-blur-lg rounded-xl p-5 border ${style.border} shadow-lg ${style.glow}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] text-white/40 uppercase tracking-widest">
          Relationship Archetype
        </div>
        <div className="text-2xl">{icon}</div>
      </div>

      {/* Archetype Name */}
      <div className={`text-xl font-bold ${style.text} mb-3`}>
        {name}
      </div>

      {/* Description */}
      <div className="text-sm text-white/70 leading-relaxed mb-4">
        {description}
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-4">
        {keywords?.map((keyword, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 rounded-full text-[10px] font-medium ${style.bg} ${style.border} ${style.text} border`}
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* Classification Rationale */}
      {classification?.length > 0 && (
        <div className="border-t border-white/10 pt-3">
          <div className="text-[10px] text-white/40 uppercase mb-2">
            Polarity Signature
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {classification.map((reason, idx) => (
              <div key={idx} className="text-[11px] text-white/50">
                {reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
