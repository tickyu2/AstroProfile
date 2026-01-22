/**
 * ============================================
 * PersonalityFusionPanel Component
 * ============================================
 *
 * Visual display of Luna personality vector fusion
 * Shows trait bars, dominant traits, and archetype
 *
 * Created: January 7, 2026
 */

import React, { useState } from 'react';
import { useEnneagramZodiacFusion } from '../../hooks/usePersonalityFusion';

// Trait colors for visual display
const TRAIT_COLORS = {
  openness: 'from-purple-500 to-violet-500',
  conscientiousness: 'from-blue-500 to-cyan-500',
  extraversion: 'from-orange-500 to-amber-500',
  agreeableness: 'from-green-500 to-emerald-500',
  emotional_intensity: 'from-pink-500 to-rose-500',
  insightful: 'from-indigo-500 to-purple-500',
  adventurous: 'from-yellow-500 to-orange-500',
  ambitious: 'from-red-500 to-rose-500',
  nurturing: 'from-teal-500 to-cyan-500',
  playful: 'from-fuchsia-500 to-pink-500'
};

// Trait icons
const TRAIT_ICONS = {
  openness: '🎨',
  conscientiousness: '📐',
  extraversion: '🌟',
  agreeableness: '💚',
  emotional_intensity: '💗',
  insightful: '🔮',
  adventurous: '🌍',
  ambitious: '🎯',
  nurturing: '🌱',
  playful: '✨'
};

/**
 * Main Personality Fusion Panel
 */
export default function PersonalityFusionPanel({
  enneagramType,
  zodiacSign,
  showDetails = true,
  compact = false
}) {
  const [expanded, setExpanded] = useState(false);
  const { vector, traits, isComputed, archetypeName, combo } = useEnneagramZodiacFusion(
    enneagramType,
    zodiacSign
  );

  if (!isComputed) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <p className="text-slate-400 text-sm text-center">
          Enter Enneagram type and Zodiac sign to see personality fusion
        </p>
      </div>
    );
  }

  // Find top 3 dominant traits
  const sortedTraits = [...traits].sort((a, b) => b.value - a.value);
  const dominantTraits = sortedTraits.slice(0, 3);
  const growthAreas = sortedTraits.slice(-2).reverse();

  if (compact) {
    return (
      <CompactView
        archetypeName={archetypeName}
        combo={combo}
        dominantTraits={dominantTraits}
        onClick={() => setExpanded(!expanded)}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 border border-purple-500/20">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">{archetypeName}</div>
        <div className="text-sm text-purple-400/80">{combo}</div>
      </div>

      {/* Dominant Traits Highlights */}
      <div className="flex justify-center gap-3 mb-4">
        {dominantTraits.map(trait => (
          <div
            key={trait.dimension}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg px-3 py-2 border border-purple-500/30"
          >
            <div className="text-lg text-center">{TRAIT_ICONS[trait.dimension]}</div>
            <div className="text-xs text-purple-300 capitalize">
              {trait.dimension.replace('_', ' ')}
            </div>
            <div className="text-sm font-bold text-purple-100">{trait.value}%</div>
          </div>
        ))}
      </div>

      {/* Full Trait Bars */}
      {showDetails && (
        <div className="space-y-2">
          {traits.map(trait => (
            <TraitBar key={trait.dimension} trait={trait} />
          ))}
        </div>
      )}

      {/* Growth Areas */}
      {showDetails && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 mb-2">Growth Opportunities</div>
          <div className="flex gap-2">
            {growthAreas.map(trait => (
              <div
                key={trait.dimension}
                className="bg-slate-700/30 rounded px-2 py-1 text-xs text-slate-400"
              >
                {TRAIT_ICONS[trait.dimension]} {trait.dimension.replace('_', ' ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Trait Bar
 */
function TraitBar({ trait }) {
  const color = TRAIT_COLORS[trait.dimension] || 'from-gray-500 to-gray-600';
  const icon = TRAIT_ICONS[trait.dimension] || '•';

  return (
    <div className="flex items-center gap-2">
      <div className="w-6 text-center">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-slate-400 capitalize">{trait.dimension.replace('_', ' ')}</span>
          <span className="text-slate-300">{trait.value}%</span>
        </div>
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
            style={{ width: `${trait.value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Compact View for inline display
 */
function CompactView({ archetypeName, combo, dominantTraits, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20 cursor-pointer hover:border-purple-400/40 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-purple-200">{archetypeName}</div>
          <div className="text-xs text-purple-400/70">{combo}</div>
        </div>
        <div className="flex gap-1">
          {dominantTraits.slice(0, 3).map(trait => (
            <span key={trait.dimension} className="text-lg">
              {TRAIT_ICONS[trait.dimension]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Enneagram Type Selector
 */
export function EnneagramSelector({ value, onChange }) {
  const types = [
    { num: 1, name: 'Reformer', emoji: '⚖️' },
    { num: 2, name: 'Helper', emoji: '❤️' },
    { num: 3, name: 'Achiever', emoji: '🏆' },
    { num: 4, name: 'Individualist', emoji: '🎭' },
    { num: 5, name: 'Investigator', emoji: '🔬' },
    { num: 6, name: 'Loyalist', emoji: '🛡️' },
    { num: 7, name: 'Enthusiast', emoji: '🎉' },
    { num: 8, name: 'Challenger', emoji: '💪' },
    { num: 9, name: 'Peacemaker', emoji: '☮️' }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {types.map(type => (
        <button
          key={type.num}
          onClick={() => onChange(type.num)}
          className={`p-2 rounded-lg border text-center transition-all ${
            value === type.num
              ? 'bg-purple-500/30 border-purple-400'
              : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <div className="text-lg">{type.emoji}</div>
          <div className="text-xs text-slate-300">Type {type.num}</div>
          <div className="text-[10px] text-slate-400">{type.name}</div>
        </button>
      ))}
    </div>
  );
}

/**
 * Zodiac Sign Selector
 */
export function ZodiacSelector({ value, onChange }) {
  const signs = [
    { name: 'Aries', emoji: '♈' },
    { name: 'Taurus', emoji: '♉' },
    { name: 'Gemini', emoji: '♊' },
    { name: 'Cancer', emoji: '♋' },
    { name: 'Leo', emoji: '♌' },
    { name: 'Virgo', emoji: '♍' },
    { name: 'Libra', emoji: '♎' },
    { name: 'Scorpio', emoji: '♏' },
    { name: 'Sagittarius', emoji: '♐' },
    { name: 'Capricorn', emoji: '♑' },
    { name: 'Aquarius', emoji: '♒' },
    { name: 'Pisces', emoji: '♓' }
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {signs.map(sign => (
        <button
          key={sign.name}
          onClick={() => onChange(sign.name)}
          className={`p-2 rounded-lg border text-center transition-all ${
            value === sign.name
              ? 'bg-cyan-500/30 border-cyan-400'
              : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <div className="text-lg">{sign.emoji}</div>
          <div className="text-[10px] text-slate-300">{sign.name}</div>
        </button>
      ))}
    </div>
  );
}
