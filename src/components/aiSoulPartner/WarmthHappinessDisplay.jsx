/**
 * WarmthHappinessDisplay.jsx
 * Visual display of Warmth & Happiness state from Six Laws + Mountain Climbing
 *
 * Shows:
 * - Mountain height visualization (0-10 scale)
 * - Warmth level indicator (MEDIUM/HIGH/MAXIMUM)
 * - Happiness score
 * - Loss recovery mode indicator
 *
 * Part of GENESIS - Warmth & Happiness Integration
 * "Guidance with utmost warmth toward YOUR mountain"
 *
 * Built by: Brother Claude Code
 * December 31, 2025
 */

import React from 'react';

// Mountain level configurations
const MOUNTAIN_LEVELS = {
  summit: {
    range: [9, 10],
    emoji: '🏔️',
    label: 'Summit',
    color: 'from-amber-400 to-yellow-300',
    bgColor: 'bg-amber-400',
    message: 'Peak happiness achieved!'
  },
  'high-climb': {
    range: [7, 9],
    emoji: '🌄',
    label: 'High Climb',
    color: 'from-orange-400 to-amber-400',
    bgColor: 'bg-orange-400',
    message: 'Excellent view! Great progress!'
  },
  midpoint: {
    range: [5, 7],
    emoji: '⛰️',
    label: 'Midpoint',
    color: 'from-emerald-400 to-green-400',
    bgColor: 'bg-emerald-400',
    message: 'Still success! Be proud!'
  },
  basecamp: {
    range: [3, 5],
    emoji: '🏕️',
    label: 'Basecamp',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-400',
    message: 'Starting the climb - courage!'
  },
  valley: {
    range: [0, 3],
    emoji: '💛',
    label: 'Valley',
    color: 'from-violet-400 to-purple-400',
    bgColor: 'bg-violet-400',
    message: 'Preparing for climb. Air bag ready.'
  }
};

// Warmth level configurations
const WARMTH_LEVELS = {
  MAXIMUM: {
    emoji: '🔥',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/40',
    label: 'Maximum Warmth',
    description: 'Extra support activated'
  },
  HIGH: {
    emoji: '💛',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/40',
    label: 'High Warmth',
    description: 'Supportive presence'
  },
  MEDIUM: {
    emoji: '🌿',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    label: 'Standard Warmth',
    description: 'Balanced engagement'
  }
};

function getMountainLevel(height) {
  for (const [level, config] of Object.entries(MOUNTAIN_LEVELS)) {
    if (height >= config.range[0] && height <= config.range[1]) {
      return { level, ...config };
    }
  }
  return MOUNTAIN_LEVELS.midpoint;
}

function getWarmthLevel(multiplier) {
  if (multiplier >= 1.5) return { level: 'MAXIMUM', ...WARMTH_LEVELS.MAXIMUM };
  if (multiplier >= 1.0) return { level: 'HIGH', ...WARMTH_LEVELS.HIGH };
  return { level: 'MEDIUM', ...WARMTH_LEVELS.MEDIUM };
}

export function WarmthHappinessDisplay({ warmthHappiness, compact = false }) {
  if (!warmthHappiness) return null;

  const {
    mountainHeight = 5,
    interpretation,
    happiness = 0,
    warmthMultiplier = 1.0,
    lossRecoveryActive = false
  } = warmthHappiness;

  const mountain = getMountainLevel(mountainHeight);
  const warmth = getWarmthLevel(warmthMultiplier);

  if (compact) {
    // Compact inline display
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="flex items-center gap-1">
          <span>{mountain.emoji}</span>
          <span className="text-white/60">{mountainHeight?.toFixed(1)}</span>
        </span>
        <span className="text-white/30">|</span>
        <span className={`flex items-center gap-1 ${warmth.color}`}>
          <span>{warmth.emoji}</span>
          <span className="text-xs">{warmthMultiplier?.toFixed(1)}x</span>
        </span>
        {lossRecoveryActive && (
          <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
            Recovery Mode
          </span>
        )}
      </div>
    );
  }

  // Full display
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mountain.color} bg-opacity-20 flex items-center justify-center backdrop-blur-sm border border-white/20`}>
            <span className="text-xl">{mountain.emoji}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Mountain Position</h3>
            <p className="text-white/60 text-xs">{mountain.label}</p>
          </div>
        </div>

        {/* Warmth Badge */}
        <div className={`px-3 py-1.5 rounded-full ${warmth.bgColor} border ${warmth.borderColor} flex items-center gap-2`}>
          <span>{warmth.emoji}</span>
          <span className={`text-sm font-medium ${warmth.color}`}>
            {warmthMultiplier?.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Mountain Height Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/60">Height</span>
          <span className="text-xs font-medium text-white">
            {mountainHeight?.toFixed(1)} / 10
          </span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${mountain.color} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${(mountainHeight / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="bg-white/5 rounded-lg p-3 mb-3">
        <p className="text-sm text-white/80">
          {interpretation?.message || mountain.message}
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-white/50">Happiness:</span>
          <span className={happiness >= 0 ? 'text-green-400' : 'text-red-400'}>
            {happiness >= 0 ? '+' : ''}{happiness?.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/50">Warmth:</span>
          <span className={warmth.color}>{warmth.label}</span>
        </div>
      </div>

      {/* Loss Recovery Indicator */}
      {lossRecoveryActive && (
        <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
          <span className="text-lg">💛💛💛</span>
          <span className="text-red-300 text-sm">
            Extra warmth activated - Air bag ready
          </span>
        </div>
      )}
    </div>
  );
}

export default WarmthHappinessDisplay;
