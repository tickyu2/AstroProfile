/**
 * EmotionDisplay.jsx
 * Visual display of detected emotions from Constitutional Intelligence
 *
 * Shows 8 primary emotions with intensity bars:
 * frustration, joy, sadness, anxiety, excitement, confusion, determination, overwhelm
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

import React from 'react';

const EMOTION_CONFIG = {
  frustration: {
    emoji: '😤',
    label: 'Frustration',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500'
  },
  joy: {
    emoji: '😊',
    label: 'Joy',
    color: 'from-yellow-400 to-amber-400',
    bgColor: 'bg-yellow-400'
  },
  sadness: {
    emoji: '😢',
    label: 'Sadness',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-400'
  },
  anxiety: {
    emoji: '😰',
    label: 'Anxiety',
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-400'
  },
  excitement: {
    emoji: '🤩',
    label: 'Excitement',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-400'
  },
  confusion: {
    emoji: '🤔',
    label: 'Confusion',
    color: 'from-cyan-400 to-teal-500',
    bgColor: 'bg-cyan-400'
  },
  determination: {
    emoji: '💪',
    label: 'Determination',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-400'
  },
  overwhelm: {
    emoji: '😵',
    label: 'Overwhelm',
    color: 'from-gray-400 to-slate-500',
    bgColor: 'bg-gray-400'
  }
};

export function EmotionDisplay({ emotions, intensity }) {
  if (!emotions) return null;

  // Filter to show only emotions with values > 0
  const activeEmotions = Object.entries(emotions)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]); // Sort by intensity descending

  const hasEmotions = activeEmotions.length > 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center backdrop-blur-sm border border-pink-500/30">
          <span className="text-xl">😊</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white/90">Detected Emotions</h3>
          <p className="text-xs text-white/50">
            Intensity: {intensity !== undefined ? `${Math.round(intensity * 100)}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Emotion Bars */}
      {hasEmotions ? (
        <div className="space-y-2">
          {activeEmotions.map(([emotion, value]) => {
            const config = EMOTION_CONFIG[emotion] || {
              emoji: '😐',
              label: emotion,
              color: 'from-gray-400 to-gray-500',
              bgColor: 'bg-gray-400'
            };
            const percentage = Math.round(value * 100);

            return (
              <div key={emotion} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/70 flex items-center gap-1">
                    <span>{config.emoji}</span>
                    <span>{config.label}</span>
                  </span>
                  <span className="text-white/50">{percentage}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-white/40 text-sm">
          <span className="text-2xl block mb-2">😐</span>
          No strong emotions detected
        </div>
      )}

      {/* Dominant Emotion Highlight */}
      {activeEmotions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Dominant:</span>
            <span className="text-sm font-semibold text-white/80 flex items-center gap-1">
              <span>{EMOTION_CONFIG[activeEmotions[0][0]]?.emoji || '😐'}</span>
              <span>{EMOTION_CONFIG[activeEmotions[0][0]]?.label || activeEmotions[0][0]}</span>
              <span className="text-white/50">({Math.round(activeEmotions[0][1] * 100)}%)</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmotionDisplay;
