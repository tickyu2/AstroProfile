/**
 * ModeIndicator.jsx
 * Visual display of current AI response mode
 *
 * Shows the three modes: WITNESS, DIALOGUE, GUIDANCE
 * with animated indicators and confidence scores.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

import React from 'react';

const MODE_CONFIG = {
  WITNESS: {
    emoji: '🎭',
    label: 'Witness',
    description: 'Holding space, validating',
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-500/20 to-violet-600/20',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-300',
    glowColor: 'shadow-purple-500/50'
  },
  DIALOGUE: {
    emoji: '💬',
    label: 'Dialogue',
    description: 'Exploring together',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-300',
    glowColor: 'shadow-blue-500/50'
  },
  GUIDANCE: {
    emoji: '🎯',
    label: 'Guidance',
    description: 'Providing structure',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-300',
    glowColor: 'shadow-amber-500/50'
  }
};

export function ModeIndicator({ mode, confidence, scores, reasoning }) {
  const modes = ['WITNESS', 'DIALOGUE', 'GUIDANCE'];
  const activeConfig = MODE_CONFIG[mode] || MODE_CONFIG.DIALOGUE;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeConfig.bgGradient} flex items-center justify-center backdrop-blur-sm border ${activeConfig.borderColor}`}>
          <span className="text-xl">{activeConfig.emoji}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white/90">AI Response Mode</h3>
          <p className="text-xs text-white/50">{activeConfig.description}</p>
        </div>
      </div>

      {/* Mode Badges */}
      <div className="flex gap-2 mb-4">
        {modes.map(m => {
          const config = MODE_CONFIG[m];
          const isActive = mode === m;

          return (
            <div
              key={m}
              className={`
                flex-1 py-2 px-3 rounded-xl text-center font-semibold text-xs
                transition-all duration-300 border
                ${isActive
                  ? `bg-gradient-to-r ${config.gradient} text-white border-white/20 shadow-lg ${config.glowColor}`
                  : `bg-gradient-to-r ${config.bgGradient} ${config.textColor} border-white/5 opacity-50`
                }
                ${isActive ? 'scale-105' : 'scale-100'}
              `}
            >
              <span className="mr-1">{config.emoji}</span>
              {config.label}
            </div>
          );
        })}
      </div>

      {/* Score Bars */}
      {scores && (
        <div className="space-y-2 mb-4">
          {modes.map(m => {
            const config = MODE_CONFIG[m];
            const score = scores[m] || 0;

            return (
              <div key={m} className="relative">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`${config.textColor} opacity-70`}>{config.label}</span>
                  <span className="text-white/50">{score}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confidence Display */}
      {confidence !== undefined && (
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-xs text-white/60">Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${activeConfig.gradient} rounded-full transition-all duration-300`}
                style={{ width: `${Math.round(confidence * 100)}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${activeConfig.textColor}`}>
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Reasoning (collapsed by default, shown on hover/click) */}
      {reasoning && reasoning.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <details className="group">
            <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60 transition-colors">
              <span className="inline-flex items-center gap-1">
                <span>💭</span>
                <span>View reasoning ({reasoning.length} factors)</span>
              </span>
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-white/50">
              {reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-white/30">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}

export default ModeIndicator;
