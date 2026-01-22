/**
 * Relationship Challenges Panel
 * Displays "What challenges this relationship?" analysis
 */

export default function RelationshipChallengesPanel({ challenges }) {
  if (!challenges || !challenges.challengeFactors?.length) {
    return (
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-lg rounded-xl p-5 border border-slate-600/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🌈</span>
          <div>
            <div className="text-sm text-white/80 font-medium">Relationship Dynamics</div>
            <div className="text-[10px] text-white/40">Growth Opportunities</div>
          </div>
        </div>
        <div className="text-sm text-white/60 p-3 bg-slate-700/30 rounded-lg">
          Your charts show natural compatibility with minimal friction. Focus on maintaining
          communication and shared growth.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-lg rounded-xl p-5 border border-amber-500/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔥</span>
        <div>
          <div className="text-sm text-amber-400 font-medium">What Challenges This Relationship</div>
          <div className="text-[10px] text-white/40">Growth Edges & Friction Points</div>
        </div>
      </div>

      {/* Challenge Factors List */}
      <div className="space-y-2">
        {challenges.challengeFactors.map((line, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20"
          >
            <span className="text-amber-400 mt-0.5">⚡</span>
            <span className="text-sm text-white/80 leading-relaxed">{line}</span>
          </div>
        ))}
      </div>

      {/* Growth Perspective */}
      <div className="mt-4 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
        <div className="text-[10px] text-amber-400 uppercase mb-1">Growth Perspective</div>
        <div className="text-xs text-white/60 leading-relaxed">
          These challenges are not obstacles but invitations to conscious communication, emotional
          clarity, and mutual understanding. Each friction point is an opportunity for deeper
          connection and personal growth.
        </div>
      </div>
    </div>
  );
}
