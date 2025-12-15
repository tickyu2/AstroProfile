/**
 * SoulBurdenMeter.jsx
 * Visual display of user's soul burden (emotional capacity)
 *
 * Shows:
 * - Soul burden level with color-coded indicator
 * - Talk/Listen ratio balance
 * - Capacity hints for appropriate response mode
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

import React from 'react';

const BURDEN_LEVELS = {
  light: {
    range: [0, 30],
    label: 'Light',
    emoji: '✅',
    hint: 'Ready for guidance',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-green-500',
    bgGradient: 'from-emerald-500/20 to-green-500/20'
  },
  moderate: {
    range: [30, 60],
    label: 'Moderate',
    emoji: '💬',
    hint: 'Good for dialogue',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-500/20 to-yellow-500/20'
  },
  heavy: {
    range: [60, 80],
    label: 'Heavy',
    emoji: '🎭',
    hint: 'Needs witness mode',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/20 to-red-500/20'
  },
  critical: {
    range: [80, 100],
    label: 'Critical',
    emoji: '⚠️',
    hint: 'Only witness mode',
    color: 'text-red-400',
    gradient: 'from-red-500 to-rose-600',
    bgGradient: 'from-red-500/20 to-rose-600/20'
  }
};

function getBurdenLevel(burden) {
  if (burden < 30) return BURDEN_LEVELS.light;
  if (burden < 60) return BURDEN_LEVELS.moderate;
  if (burden < 80) return BURDEN_LEVELS.heavy;
  return BURDEN_LEVELS.critical;
}

export function SoulBurdenMeter({ burden = 35, talkListenRatio = { talk: 40, listen: 60 } }) {
  const level = getBurdenLevel(burden);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${level.bgGradient} flex items-center justify-center backdrop-blur-sm border border-white/20`}>
          <span className="text-xl">📊</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white/90">Constitutional Metrics</h3>
          <p className="text-xs text-white/50">Real-time soul state</p>
        </div>
      </div>

      {/* Soul Burden Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Soul Burden</span>
          <span className={`text-sm font-bold ${level.color}`}>
            {level.emoji} {burden}%
          </span>
        </div>

        {/* Burden Bar with gradient */}
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-2">
          {/* Background gradient showing full range */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-amber-500/30 via-orange-500/30 to-red-500/30" />

          {/* Active fill */}
          <div
            className={`relative h-full bg-gradient-to-r ${level.gradient} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(burden, 100)}%` }}
          />

          {/* Threshold markers */}
          <div className="absolute top-0 left-[30%] w-px h-full bg-white/20" />
          <div className="absolute top-0 left-[60%] w-px h-full bg-white/20" />
          <div className="absolute top-0 left-[80%] w-px h-full bg-white/20" />
        </div>

        {/* Burden hint */}
        <div className={`text-xs ${level.color} opacity-80 flex items-center gap-1`}>
          <span>{level.emoji}</span>
          <span>{level.label} - {level.hint}</span>
        </div>
      </div>

      {/* Talk/Listen Ratio Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Talk/Listen Balance</span>
        </div>

        {/* Ratio Bar */}
        <div className="flex h-8 rounded-xl overflow-hidden border border-white/10">
          {/* Talk portion */}
          <div
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ flex: talkListenRatio.talk }}
          >
            <span className="text-xs font-bold text-white/90">
              Talk {talkListenRatio.talk}%
            </span>
          </div>

          {/* Listen portion */}
          <div
            className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500 ease-out"
            style={{ flex: talkListenRatio.listen }}
          >
            <span className="text-xs font-bold text-white/90">
              Listen {talkListenRatio.listen}%
            </span>
          </div>
        </div>

        {/* Ratio hint */}
        <div className="mt-2 text-xs text-white/40 text-center">
          {talkListenRatio.listen > 60
            ? '👂 AI is listening more than talking'
            : talkListenRatio.talk > 60
              ? '🗣️ AI is providing more guidance'
              : '⚖️ Balanced dialogue mode'}
        </div>
      </div>

      {/* Capacity visualization */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Emotional Capacity</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => {
              const threshold = (i + 1) * 20;
              const isFilled = burden < threshold;
              return (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                      : 'bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>
        <p className="text-xs text-white/30 mt-1">
          {burden < 30
            ? '5/5 capacity - ready for anything'
            : burden < 60
              ? '3-4/5 capacity - good engagement space'
              : burden < 80
                ? '2/5 capacity - needs gentleness'
                : '1/5 capacity - only hold space'}
        </p>
      </div>
    </div>
  );
}

export default SoulBurdenMeter;
