/**
 * Jungian Archetype Panel (P7)
 * Displays the 12 Jungian archetypes with cosine similarity matching
 * from the user's 30-facet NEO PI-R personality vector
 *
 * Archetypes: Hero, Caregiver, Creator, Sage, Lover, Magician,
 *             Ruler, Rebel, Explorer, Innocent, Jester, Orphan
 */

import React, { useState, useEffect } from 'react';
import { getArchetypes } from '../../data/lunaFusionService';

// Archetype display configuration
const ARCHETYPE_CONFIG = {
  Hero: {
    icon: '// Hero icon',
    symbol: 'S',  // Shield/sword
    color: '#ef4444',
    bgGradient: 'from-red-600/20 to-orange-600/20',
    borderColor: 'border-red-500/50'
  },
  Caregiver: {
    icon: '// Caregiver icon',
    symbol: 'H',  // Heart/hands
    color: '#ec4899',
    bgGradient: 'from-pink-600/20 to-rose-600/20',
    borderColor: 'border-pink-500/50'
  },
  Creator: {
    icon: '// Creator icon',
    symbol: 'P',  // Palette/brush
    color: '#8b5cf6',
    bgGradient: 'from-violet-600/20 to-purple-600/20',
    borderColor: 'border-violet-500/50'
  },
  Sage: {
    icon: '// Sage icon',
    symbol: 'B',  // Book/owl
    color: '#3b82f6',
    bgGradient: 'from-blue-600/20 to-indigo-600/20',
    borderColor: 'border-blue-500/50'
  },
  Lover: {
    icon: '// Lover icon',
    symbol: 'R',  // Rose/heart
    color: '#f43f5e',
    bgGradient: 'from-rose-600/20 to-pink-600/20',
    borderColor: 'border-rose-500/50'
  },
  Magician: {
    icon: '// Magician icon',
    symbol: 'W',  // Wand/stars
    color: '#a855f7',
    bgGradient: 'from-purple-600/20 to-fuchsia-600/20',
    borderColor: 'border-purple-500/50'
  },
  Ruler: {
    icon: '// Ruler icon',
    symbol: 'C',  // Crown
    color: '#eab308',
    bgGradient: 'from-yellow-600/20 to-amber-600/20',
    borderColor: 'border-yellow-500/50'
  },
  Rebel: {
    icon: '// Rebel icon',
    symbol: 'F',  // Fist/fire
    color: '#f97316',
    bgGradient: 'from-orange-600/20 to-red-600/20',
    borderColor: 'border-orange-500/50'
  },
  Explorer: {
    icon: '// Explorer icon',
    symbol: 'M',  // Map/compass
    color: '#10b981',
    bgGradient: 'from-emerald-600/20 to-teal-600/20',
    borderColor: 'border-emerald-500/50'
  },
  Innocent: {
    icon: '// Innocent icon',
    symbol: 'D',  // Dove/flower
    color: '#06b6d4',
    bgGradient: 'from-cyan-600/20 to-sky-600/20',
    borderColor: 'border-cyan-500/50'
  },
  Jester: {
    icon: '// Jester icon',
    symbol: 'J',  // Jester hat
    color: '#f59e0b',
    bgGradient: 'from-amber-600/20 to-yellow-600/20',
    borderColor: 'border-amber-500/50'
  },
  Orphan: {
    icon: '// Orphan icon',
    symbol: 'L',  // Lantern/bridge
    color: '#64748b',
    bgGradient: 'from-slate-600/20 to-gray-600/20',
    borderColor: 'border-slate-500/50'
  }
};

// Archetype metadata
const ARCHETYPE_DATA = {
  Hero: {
    description: 'The courageous warrior who overcomes challenges',
    coreTraits: 'Brave, determined, achievement-driven, protective',
    shadow: 'Arrogance, ruthlessness, need to prove worth',
    motto: "Where there's a will, there's a way"
  },
  Caregiver: {
    description: 'The nurturing protector who helps others',
    coreTraits: 'Compassionate, generous, protective, selfless',
    shadow: 'Martyrdom, enabling, manipulation through guilt',
    motto: 'Love your neighbor as yourself'
  },
  Creator: {
    description: 'The imaginative innovator who brings vision to life',
    coreTraits: 'Creative, artistic, visionary, non-conforming',
    shadow: 'Perfectionism, impracticality, drama',
    motto: 'If it can be imagined, it can be created'
  },
  Sage: {
    description: 'The wise truth-seeker who understands deeply',
    coreTraits: 'Wise, analytical, knowledgeable, thoughtful',
    shadow: 'Disconnection, dogmatism, ivory tower isolation',
    motto: 'The truth will set you free'
  },
  Lover: {
    description: 'The passionate romantic who seeks intimacy',
    coreTraits: 'Passionate, committed, appreciative, sensual',
    shadow: 'Obsession, jealousy, loss of identity',
    motto: "You're the only one"
  },
  Magician: {
    description: 'The transformative visionary who makes things happen',
    coreTraits: 'Transformative, visionary, charismatic, catalytic',
    shadow: 'Manipulation, disconnection from reality',
    motto: 'I make things happen'
  },
  Ruler: {
    description: 'The authoritative leader who takes charge',
    coreTraits: 'Responsible, organized, authoritative, decisive',
    shadow: 'Tyranny, rigidity, controlling behavior',
    motto: "Power isn't everything, it's the only thing"
  },
  Rebel: {
    description: 'The revolutionary who disrupts the status quo',
    coreTraits: 'Radical, free-thinking, disruptive, independent',
    shadow: 'Self-destruction, anarchy for its own sake',
    motto: 'Rules are made to be broken'
  },
  Explorer: {
    description: 'The adventurous seeker who discovers new paths',
    coreTraits: 'Adventurous, independent, pioneering, restless',
    shadow: 'Aimlessness, inability to commit, chronic dissatisfaction',
    motto: "Don't fence me in"
  },
  Innocent: {
    description: 'The optimistic believer who sees the good',
    coreTraits: 'Optimistic, trusting, pure, faithful',
    shadow: 'Naivety, denial, dependence on others',
    motto: 'Free to be you and me'
  },
  Jester: {
    description: 'The playful spirit who brings joy and humor',
    coreTraits: 'Joyful, humorous, playful, irreverent',
    shadow: 'Frivolity, irresponsibility, cruelty in humor',
    motto: 'You only live once'
  },
  Orphan: {
    description: 'The resilient survivor who connects through shared struggles',
    coreTraits: 'Resilient, empathetic, realistic, grounded',
    shadow: 'Victimhood, cynicism, chronic complaint',
    motto: 'All people are created equal'
  }
};

export default function JungianArchetypePanel({
  personalityVector,
  archetypeData = null,
  showAllArchetypes = false,
  topN = 3
}) {
  const [archetypes, setArchetypes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedArchetype, setExpandedArchetype] = useState(null);
  const [showAll, setShowAll] = useState(showAllArchetypes);

  useEffect(() => {
    // If archetypeData is provided directly, use it
    if (archetypeData) {
      setArchetypes(archetypeData);
      return;
    }

    // Otherwise fetch from API
    if (personalityVector && personalityVector.length === 30) {
      fetchArchetypes();
    }
  }, [personalityVector, archetypeData]);

  const fetchArchetypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getArchetypes(personalityVector, topN, true);
      setArchetypes(result);
    } catch (err) {
      console.error('Error fetching archetypes:', err);
      setError('Unable to determine archetypes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <div className="animate-pulse text-white/60">
          Analyzing archetypal patterns...
        </div>
      </div>
    );
  }

  if (error || !archetypes) {
    return (
      <div className="bg-slate-900/50 rounded-xl p-6 text-center">
        <p className="text-white/60">{error || 'No archetype data available'}</p>
        <p className="text-sm text-white/40 mt-2">
          Complete personality assessment required
        </p>
      </div>
    );
  }

  const dominantArchetypes = archetypes.dominantArchetypes || [];
  const narrative = archetypes.narrative;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Your Archetypal Profile
        </h3>
        <p className="text-sm text-white/60">
          12 Jungian archetypes mapped from your personality
        </p>
      </div>

      {/* Primary Archetype */}
      {dominantArchetypes.length > 0 && (
        <PrimaryArchetypeCard archetype={dominantArchetypes[0]} />
      )}

      {/* Secondary Archetypes */}
      {dominantArchetypes.length > 1 && (
        <div className="space-y-3">
          <div className="text-sm font-bold text-white/70 px-1">
            Secondary Influences:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dominantArchetypes.slice(1).map((archetype, idx) => (
              <SecondaryArchetypeCard
                key={archetype.name}
                archetype={archetype}
                rank={idx + 2}
                isExpanded={expandedArchetype === archetype.name}
                onToggle={() => setExpandedArchetype(
                  expandedArchetype === archetype.name ? null : archetype.name
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Narrative */}
      {narrative && (
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
          <div className="text-sm font-bold text-white/70 mb-3">
            Your Archetypal Story:
          </div>
          <p className="text-white/80 leading-relaxed italic">
            "{narrative}"
          </p>
        </div>
      )}

      {/* Show All Archetypes Toggle */}
      {archetypes.profile && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors"
          >
            {showAll ? 'Hide Full Spectrum' : 'Show All 12 Archetypes'}
          </button>
        </div>
      )}

      {/* All Archetypes Grid */}
      {showAll && archetypes.profile && (
        <AllArchetypesGrid profile={archetypes.profile} />
      )}

      {/* Methodology Note */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <p className="text-xs text-white/50 leading-relaxed">
          <span className="font-bold text-white/70">Methodology: </span>
          Archetypes are determined using cosine similarity between your 30-facet
          NEO PI-R personality vector and 12 Jungian archetype signatures. The
          similarity scores indicate how strongly each archetype resonates with
          your unique personality profile.
        </p>
      </div>
    </div>
  );
}

/**
 * Primary Archetype Card - Large featured display
 */
function PrimaryArchetypeCard({ archetype }) {
  const config = ARCHETYPE_CONFIG[archetype.name] || ARCHETYPE_CONFIG.Hero;
  const data = ARCHETYPE_DATA[archetype.name] || {};
  const score = Math.round((archetype.score || 0) * 100);

  return (
    <div
      className={`bg-gradient-to-br ${config.bgGradient} rounded-xl p-6 border-2`}
      style={{ borderColor: config.color }}
    >
      <div className="text-center mb-4">
        <div
          className="text-5xl font-bold mb-2"
          style={{ color: config.color }}
        >
          {config.symbol}
        </div>
        <h4
          className="text-2xl font-bold mb-1"
          style={{ color: config.color }}
        >
          The {archetype.name}
        </h4>
        <div className="text-sm text-white/60 mb-2">
          {score}% resonance
        </div>
        <div className="text-white/80 italic">
          "{data.motto}"
        </div>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <div className="text-center">
          <p className="text-white/90 text-lg">{data.description}</p>
        </div>

        {/* Core Traits */}
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-xs text-white/50 mb-1">Core Traits:</div>
          <div className="text-sm text-white/80">{data.coreTraits}</div>
        </div>

        {/* Shadow */}
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-xs text-white/50 mb-1">Shadow Aspects:</div>
          <div className="text-sm text-white/70">{data.shadow}</div>
        </div>

        {/* Score Bar */}
        <div>
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Archetypal Resonance</span>
            <span>{score}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${score}%`,
                backgroundColor: config.color
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Secondary Archetype Card - Compact display
 */
function SecondaryArchetypeCard({ archetype, rank, isExpanded, onToggle }) {
  const config = ARCHETYPE_CONFIG[archetype.name] || ARCHETYPE_CONFIG.Hero;
  const data = ARCHETYPE_DATA[archetype.name] || {};
  const score = Math.round((archetype.score || 0) * 100);

  return (
    <div
      className={`bg-gradient-to-br ${config.bgGradient} rounded-lg p-4 border cursor-pointer transition-all ${config.borderColor}`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="text-2xl font-bold"
            style={{ color: config.color }}
          >
            {config.symbol}
          </div>
          <div>
            <div className="font-bold text-white">
              #{rank} {archetype.name}
            </div>
            <div className="text-xs text-white/60">{score}% resonance</div>
          </div>
        </div>
        <div className="text-lg text-white/40">
          {isExpanded ? '-' : '+'}
        </div>
      </div>

      {/* Score Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: config.color
          }}
        />
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
          <p className="text-sm text-white/80">{data.description}</p>
          <div className="text-xs text-white/60 italic">"{data.motto}"</div>
          <div className="text-xs text-white/50">
            <span className="font-bold">Traits:</span> {data.coreTraits}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * All Archetypes Grid - Shows complete spectrum
 */
function AllArchetypesGrid({ profile }) {
  // Sort by score descending
  const sortedArchetypes = Object.entries(profile)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
      <div className="text-sm font-bold text-white/70 mb-4">
        Complete Archetypal Spectrum:
      </div>
      <div className="space-y-2">
        {sortedArchetypes.map((arch, idx) => {
          const config = ARCHETYPE_CONFIG[arch.name] || ARCHETYPE_CONFIG.Hero;
          const percent = Math.round(arch.score * 100);
          return (
            <div key={arch.name} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: config.color, color: 'white' }}
              >
                {idx + 1}
              </div>
              <div className="w-24 text-sm text-white/80">{arch.name}</div>
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: config.color
                  }}
                />
              </div>
              <div
                className="w-12 text-right text-sm font-bold"
                style={{ color: config.color }}
              >
                {percent}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
