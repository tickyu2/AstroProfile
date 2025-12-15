import React, { useState } from 'react'
import { getPillarTraitContributions } from '../../utils/tenGodsCalculations'

// ═══════════════════════════════════════════════════════════════════════════
// TEN GODS PANEL - Display Ten Gods analysis with personality traits
// ═══════════════════════════════════════════════════════════════════════════

export default function TenGodsPanel({ tenGods, dayMaster, profile, personalityTraits, topTraits }) {
  const [openFlaps, setOpenFlaps] = useState({})

  const toggleFlap = (pillarName) => {
    setOpenFlaps(prev => ({
      ...prev,
      [pillarName]: !prev[pillarName]
    }))
  }

  if (!tenGods || !dayMaster) {
    return (
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          十神 Ten Gods Analysis
        </h3>
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 text-center">
          <div className="text-amber-300 mb-2">⏰ Birth Time Required</div>
          <div className="text-sm text-white/70">
            Ten Gods analysis requires a complete birth time. Please add the birth time to this profile for deeper constitutional insights and personality trait analysis.
          </div>
        </div>
      </div>
    )
  }

  // Helper to get category color
  const getCategoryColor = (category) => {
    const colors = {
      companion: 'from-blue-500 to-cyan-500',
      output: 'from-purple-500 to-pink-500',
      wealth: 'from-yellow-500 to-amber-500',
      resource: 'from-green-500 to-emerald-500',
      authority: 'from-red-500 to-orange-500'
    }
    return colors[category] || 'from-slate-500 to-slate-600'
  }

  const getCategoryBg = (category) => {
    const colors = {
      companion: 'from-blue-900/30 to-cyan-900/30',
      output: 'from-purple-900/30 to-pink-900/30',
      wealth: 'from-yellow-900/30 to-amber-900/30',
      resource: 'from-green-900/30 to-emerald-900/30',
      authority: 'from-red-900/30 to-orange-900/30'
    }
    return colors[category] || 'from-slate-900/30 to-slate-800/30'
  }

  const getLifePhase = (pillar) => {
    const phases = {
      year: 'Ages 0-16 (Childhood & Ancestry)',
      month: 'Ages 17-32 (Career & Parents)',
      day: 'Ages 33-48 (Self & Marriage)',
      hour: 'Ages 49+ (Children & Legacy)'
    }
    return phases[pillar]
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 fade-in delay-3">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
          十神 Ten Gods Analysis
        </h3>
        <p className="text-white/60 text-sm">
          The Ten Gods reveal how you relate to different energies in your life - from creativity to authority, resources to challenges.
        </p>
      </div>

      {/* Day Master Display */}
      <div className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 rounded-xl p-4 mb-6 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-purple-300 font-bold uppercase tracking-wide mb-1">
              Your Day Master (日主)
            </div>
            <div className="text-2xl font-bold text-white">
              {dayMaster.displayName}
            </div>
            <div className="text-sm text-white/70 mt-1">
              {dayMaster.pinyin} • {dayMaster.element} Element • {dayMaster.polarity} Polarity
            </div>
          </div>
          <div className="text-5xl">
            {dayMaster.element === 'Wood' && '🌳'}
            {dayMaster.element === 'Fire' && '🔥'}
            {dayMaster.element === 'Earth' && '🏔️'}
            {dayMaster.element === 'Metal' && '⚙️'}
            {dayMaster.element === 'Water' && '💧'}
          </div>
        </div>
        <div className="mt-3 text-xs text-white/60 leading-relaxed">
          The Day Master represents your core self - your innate nature and how you interact with the world around you.
        </div>
      </div>

      {/* 🔥 NEW! Personality Traits Section */}
      {topTraits && topTraits.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 rounded-xl p-5 border border-cyan-500/30">
          <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-3 flex items-center gap-2">
            <span>🧬</span>
            <span>Your Personality Traits (from Ten Gods)</span>
          </h4>

          <div className="space-y-3">
            {topTraits.map(({ trait, value, description, displayName }) => (
              <div key={trait}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-cyan-200 capitalize">
                    {displayName}
                  </span>
                  <span className="text-sm text-cyan-300 font-bold">{value}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(value * 5, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-white/70 italic">
                  {description}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/60 bg-slate-800/30 rounded-lg p-3">
            💡 <strong>How this works:</strong> These personality traits emerge from your Ten Gods configuration across all four pillars. Each pillar contributes weighted percentages based on its life phase importance (Day 40%, Month 30%, Year 15%, Hour 15%).
          </div>
        </div>
      )}

      {/* Ten Gods for Each Pillar with Interactive Flaps */}
      <div className="space-y-4">
        <div className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-3">
          Your Ten Gods in the Four Pillars:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['year', 'month', 'day', 'hour'].map((pillarName) => {
            const pillar = tenGods.pillars[pillarName]
            if (!pillar) return null

            const pillarLabels = {
              year: { emoji: '👴', label: 'Year Pillar', weight: '15%' },
              month: { emoji: '👨', label: 'Month Pillar', weight: '30%' },
              day: { emoji: '💫', label: 'Day Pillar', weight: '40%' },
              hour: { emoji: '👶', label: 'Hour Pillar', weight: '15%' }
            }

            const info = pillarLabels[pillarName]
            const isOpen = openFlaps[pillarName]
            const contributions = getPillarTraitContributions(pillar.name, pillarName)

            return (
              <div
                key={pillarName}
                className={`bg-gradient-to-br ${getCategoryBg(pillar.category)} rounded-xl border border-white/10 hover:border-white/30 transition-all overflow-hidden`}
              >
                {/* Pillar Header */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{info.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white">{info.label}</div>
                        <div className="text-xs text-white/50">Weight: {info.weight}</div>
                      </div>
                      <div className="text-xs text-white/50">{getLifePhase(pillarName)}</div>
                    </div>
                  </div>

                  {/* Ten God Name */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{pillar.emoji}</span>
                      <div className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${getCategoryColor(pillar.category)}`}>
                        {pillar.name}
                      </div>
                    </div>
                    <div className="text-sm text-white/70">
                      {pillar.chinese} ({pillar.pinyin})
                    </div>
                  </div>

                  {/* Element Info */}
                  <div className="bg-slate-900/50 rounded-lg p-2 mb-3">
                    <div className="text-xs text-white/60">Element Relationship:</div>
                    <div className="text-sm text-white font-medium">
                      {pillar.polarity} {pillar.element} • {pillar.relationship}
                    </div>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleFlap(pillarName)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-xs font-bold
                      bg-gradient-to-r ${getCategoryColor(pillar.category)}
                      hover:opacity-90 text-white shadow-lg
                      transition-all duration-300
                      hover:scale-[1.02]
                      ${isOpen ? 'ring-2 ring-white ring-opacity-50' : ''}
                    `}
                  >
                    {isOpen ? '▼ Hide Details' : '▶ Show Life Story & Traits'}
                  </button>
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 text-sm animate-fadeIn">
                    {/* Description */}
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs font-bold text-purple-300 mb-1">What This Means:</div>
                      <div className="text-xs text-white/80 leading-relaxed">
                        {pillar.description}
                      </div>
                    </div>

                    {/* Trait Contributions */}
                    {Object.keys(contributions).length > 0 && (
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs font-bold text-cyan-300 mb-2">
                          🧬 Traits Contributed by This Pillar:
                        </div>
                        <div className="space-y-1">
                          {Object.entries(contributions)
                            .sort(([, a], [, b]) => b - a)
                            .map(([trait, value]) => (
                              <div key={trait} className="flex items-center justify-between text-xs">
                                <span className="text-white/80 capitalize">
                                  {trait.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-cyan-300 font-bold">+{value}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Life Phase Context */}
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-xs font-bold text-amber-300 mb-1">In Your Life:</div>
                      <div className="text-xs text-white/80 leading-relaxed">
                        {getLifePhaseStory(pillar.name, pillarName)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Educational Footer */}
      <div className="mt-6 bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
        <div className="text-sm text-purple-200 leading-relaxed">
          <strong className="text-purple-300">💡 Understanding Ten Gods:</strong> Each pillar's Heavenly Stem creates a relationship with your Day Master. These relationships (Ten Gods) reveal how different life energies manifest for you - from creative expression to material wealth, from supportive resources to challenging authority figures. The personality traits above are mathematically calculated based on which Ten Gods appear in each pillar and that pillar's weight in your life.
        </div>
      </div>
    </div>
  )
}

// Helper function to get life phase story for each Ten God
function getLifePhaseStory(godName, pillar) {
  const stories = {
    'Friend': {
      year: `Your childhood emphasized independence and self-reliance. You likely had siblings or friends who shaped your sense of identity and healthy competition.`,
      month: `Your career benefits from collaboration with equals. You work best in partnerships where mutual respect and shared goals are present.`,
      day: `Your core self is independent and self-confident. In marriage, you seek an equal partner who respects your autonomy.`,
      hour: `In later life, you pass on values of independence and self-confidence to children or mentees.`
    },
    'Rob Wealth': {
      year: `Your early years taught you resourcefulness and how to seize opportunities, possibly through competitive siblings or challenging circumstances.`,
      month: `Your career thrives on calculated risks and spotting opportunities others miss. You have entrepreneurial instincts.`,
      day: `Your core nature is opportunistic and bold. You're willing to take risks for potential gains.`,
      hour: `You teach the next generation to be resourceful and seize opportunities when they arise.`
    },
    'Eating God': {
      year: `Your childhood was marked by creativity and joy. You expressed yourself freely and were encouraged to explore your talents.`,
      month: `Your career allows creative expression and brings you joy. You excel in fields that let you showcase your natural talents.`,
      day: `Your essence is creative and optimistic. You bring joy to relationships and express yourself authentically.`,
      hour: `You nurture creativity in children and pass on a legacy of joyful self-expression.`
    },
    'Hurting Officer': {
      year: `Your early years shaped you into an innovative thinker who questions convention. You may have challenged authority from a young age.`,
      month: `Your career is marked by innovation and challenging the status quo. You excel when you can pioneer new approaches.`,
      day: `Your core self is rebellious and talented. You don't conform to expectations and forge your own path.`,
      hour: `You teach the next generation to think independently and challenge outdated systems.`
    },
    'Direct Wealth': {
      year: `Your foundation emphasized responsibility and hard work. You learned the value of steady effort and practical results.`,
      month: `Your career is built on responsibility and practicality. You excel in structured environments with clear goals.`,
      day: `Your nature is responsible and stability-seeking. You value security and take obligations seriously.`,
      hour: `You pass on values of responsibility and work ethic to the next generation.`
    },
    'Indirect Wealth': {
      year: `Your early life exposed you to opportunities and possibly a father figure who taught you about taking calculated risks.`,
      month: `Your career is entrepreneurial and opportunistic. You see possibilities others miss and aren't afraid of bold ventures.`,
      day: `Your essence is generous and risk-embracing. You have a business mindset and share resources freely.`,
      hour: `You teach children to be entrepreneurial and generous with their resources.`
    },
    'Direct Officer': {
      year: `Your foundation emphasized structure, discipline, and respect for authority. You learned the importance of rules and order.`,
      month: `Your career benefits from discipline and structured environments. You respect hierarchy and excel in organized systems.`,
      day: `Your core nature values discipline and authority. You seek structure and prefer clear rules.`,
      hour: `You pass on values of discipline and respect for authority to the next generation.`
    },
    'Indirect Officer': {
      year: `Your early years built resilience through challenges. You learned to persevere under pressure and developed inner strength.`,
      month: `Your career involves navigating power dynamics and overcoming challenges. You have courage under pressure.`,
      day: `Your essence is resilient and determined. You face challenges head-on and persist toward your goals.`,
      hour: `You teach the next generation resilience and how to face challenges with courage.`
    },
    'Direct Resource': {
      year: `Your foundation emphasized learning and knowledge. You likely had a nurturing mother figure who supported your education.`,
      month: `Your career benefits from continuous learning and traditional knowledge. You excel when you can apply wisdom.`,
      day: `Your nature is wisdom-seeking and nurturing. You value knowledge and support others' growth.`,
      hour: `You pass on knowledge and nurture the learning abilities of the next generation.`
    },
    'Indirect Resource': {
      year: `Your early years developed your intuition and unconventional thinking. You may have learned through non-traditional methods.`,
      month: `Your career benefits from intuition and thinking outside the box. You excel in fields that value innovation.`,
      day: `Your essence is intuitive and spiritually inclined. You trust your gut and explore deeper meanings.`,
      hour: `You teach the next generation to trust their intuition and think independently.`
    }
  }

  return stories[godName]?.[pillar] || `This Ten God (${godName}) influences your ${pillar} pillar, shaping how you experience this life phase.`
}
