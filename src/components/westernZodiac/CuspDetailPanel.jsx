/**
 * CuspDetailPanel.jsx
 * Detailed View of a Western Zodiac Cusp
 *
 * Shows archetype, characteristics, strengths, challenges, and famous examples
 * Can optionally show compatibility analysis when comparing two cusps
 *
 * Built by Brother Claude Code
 * December 12, 2024
 */

import React from 'react';
import { motion } from 'framer-motion';
import { getDetailedCompatibility, getCompatibilityColors } from '../../utils/westernZodiac/westernZodiacCompatibility';
import { getSignEmoji, getCuspDisplayName, getElementColors } from '../../utils/westernZodiac/cuspCalculator';

export default function CuspDetailPanel({ cusp, compareTo = null, isUserCusp = false }) {
  if (!cusp) {
    return null;
  }

  // If comparing, get detailed compatibility
  const compatibility = compareTo ? getDetailedCompatibility(compareTo, cusp) : null;
  const elementColors = getElementColors(cusp.element.primary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden"
    >
      {/* Header with Archetype */}
      <div
        className={`p-6 bg-gradient-to-r ${elementColors.gradient}`}
        style={{
          boxShadow: `inset 0 -20px 40px rgba(0,0,0,0.2)`
        }}
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">{cusp.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getSignEmoji(cusp.sign)}</span>
              <h3 className="text-2xl font-bold text-white">
                {cusp.name}
              </h3>
            </div>
            <p className="text-white/90 text-lg italic">
              "{cusp.archetype}"
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                {cusp.element.primary} {cusp.element.secondary && `+ ${cusp.element.secondary}`}
              </span>
              {cusp.element.mix && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                  = {cusp.element.mix}
                </span>
              )}
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                {cusp.rulers.join(' + ')}
              </span>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="mt-4 text-white/80 text-sm">
          📅 {formatDateRange(cusp.dateRange)}
        </div>
      </div>

      {/* Compatibility Score (if comparing) */}
      {compatibility && (
        <div className="p-4 bg-slate-900/50 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`text-4xl font-bold ${compatibility.level.color}`}>
                {compatibility.score}%
              </div>
              <div>
                <div className={`text-lg font-bold ${compatibility.level.color}`}>
                  {compatibility.level.level} Match
                </div>
                <div className="text-white/60 text-sm">
                  {compatibility.level.description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-sm">Aspect</div>
              <div className={`text-lg font-bold ${compatibility.aspect.isHarmonious ? 'text-green-400' : 'text-orange-400'}`}>
                {compatibility.aspect.name}
              </div>
            </div>
          </div>

          {/* Element Mix */}
          <div className="mt-3 p-3 bg-white/5 rounded-lg">
            <div className="text-white font-medium mb-1">
              Element Interaction: {compatibility.elements.mix.type}
            </div>
            <div className="text-white/70 text-sm">
              {compatibility.elements.mix.description}
            </div>
          </div>

          {/* Insights */}
          {compatibility.insights.length > 0 && (
            <div className="mt-3 space-y-2">
              {compatibility.insights.map((insight, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm ${
                    insight.type === 'strength' ? 'text-green-400' :
                    insight.type === 'challenge' ? 'text-orange-400' :
                    insight.type === 'golden' ? 'text-amber-400' :
                    'text-white/70'
                  }`}
                >
                  <span>{insight.icon}</span>
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Characteristics */}
      <div className="p-6 border-b border-white/10">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🌟</span> Characteristics
        </h4>
        <ul className="space-y-2">
          {cusp.characteristics.map((trait, i) => (
            <li key={i} className="flex items-start gap-2 text-white/80">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{trait}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Two-Column Layout: Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-0">
        {/* Strengths */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
          <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>✓</span> Strengths
          </h4>
          <ul className="space-y-2">
            {cusp.strengths.slice(0, 5).map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-white/80">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="p-6 border-b border-white/10">
          <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
            <span>⚠</span> Challenges
          </h4>
          <ul className="space-y-2">
            {cusp.challenges.slice(0, 5).map((challenge, i) => (
              <li key={i} className="flex items-start gap-2 text-white/80">
                <span className="text-orange-400 mt-0.5">⚠</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Famous Examples */}
      {cusp.famousExamples && cusp.famousExamples.length > 0 && (
        <div className="p-6">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⭐</span> Famous Examples
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cusp.famousExamples.map((example, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="font-bold text-white">{example.name}</div>
                <div className="text-xs text-white/60">{example.date}</div>
                <div className="text-sm text-white/80 mt-1">{example.trait}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Cusp Type Info */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-indigo-200">
            <span>ℹ️</span>
            <span>
              {cusp.type === 'pure' ? (
                <strong>Pure Sign:</strong>
              ) : cusp.type === 'blend-back' ? (
                <strong>Cusp (Blend Back):</strong>
              ) : (
                <strong>Cusp (Blend Forward):</strong>
              )}
              {' '}
              {cusp.type === 'pure'
                ? `Undiluted ${cusp.sign} energy - classic textbook traits`
                : cusp.type === 'blend-back'
                  ? `${cusp.influencedBy}'s influence blending INTO ${cusp.sign}`
                  : `${cusp.sign}'s energy blending INTO ${cusp.influencedBy}`
              }
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Format date range for display
 */
function formatDateRange(dateRange) {
  if (!dateRange) return '';

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const parseDate = (dateStr) => {
    const [month, day] = dateStr.split('-').map(Number);
    return `${monthNames[month - 1]} ${day}`;
  };

  return `${parseDate(dateRange.start)} - ${parseDate(dateRange.end)}`;
}
