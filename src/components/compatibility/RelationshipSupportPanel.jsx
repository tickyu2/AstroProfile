/**
 * Relationship Support Panel
 * Displays "What supports this relationship?" analysis
 */

export default function RelationshipSupportPanel({ support }) {
  if (!support || !support.supportingFactors?.length) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-lg rounded-xl p-5 border border-emerald-500/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💚</span>
        <div>
          <div className="text-sm text-emerald-400 font-medium">What Supports This Relationship</div>
          <div className="text-[10px] text-white/40">Harmony & Compatibility Factors</div>
        </div>
      </div>

      {/* Supporting Factors List */}
      <div className="space-y-2">
        {support.supportingFactors.map((line, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
          >
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span className="text-sm text-white/80 leading-relaxed">{line}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      {support.summary && support.supportingFactors.length > 3 && (
        <div className="mt-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
          <div className="text-[10px] text-emerald-400 uppercase mb-1">Summary</div>
          <div className="text-xs text-white/60 leading-relaxed">
            Your charts show a blend of complementary temperaments, emotional resonance, and karmic
            timing that supports both harmony and growth. This relationship is held together by shared
            values, mutual attraction, and a stabilizing influence that deepens over time.
          </div>
        </div>
      )}
    </div>
  );
}
