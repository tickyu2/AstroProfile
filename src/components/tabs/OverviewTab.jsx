/**
 * OverviewTab.jsx
 * The Entrance Hall - Overview of All Systems
 *
 * Built with SOUL for the cathedral of knowledge
 * Shows the complete soul map at a glance
 * Invites deeper exploration through each tab
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MoonPhaseCompact } from '../common/MoonPhaseWidget';

/**
 * Get Day Master display string with defensive null checks
 * Handles various data structures gracefully
 *
 * @param {Object} fourPillars - BaZi four pillars data
 * @returns {string} Formatted Day Master display string
 */
function getDayMasterDisplay(fourPillars) {
  if (!fourPillars?.dayMaster) {
    return 'Four Pillars of Destiny';
  }

  const dm = fourPillars.dayMaster;

  // Try multiple property paths for robustness
  const char = dm.char || dm.chinese?.charAt?.(0) || '';
  const element = dm.element || dm.english || '';
  const polarity = dm.polarity || '';

  // Build display string
  const parts = [char, element, polarity].filter(Boolean);

  if (parts.length === 0) {
    // Fallback: try fullName
    return dm.fullName || 'Day Master';
  }

  return parts.join(' ').trim();
}

export default function OverviewTab({
  profile,
  chinese,
  westZodiac,
  numerology,
  fourPillars,
  archetype,
  onNavigateToTab
}) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // System cards data
  const systems = [
    {
      id: 'bazi',
      title: 'BaZi (八字)',
      icon: '☯️',
      gradient: 'from-purple-500 to-pink-600',
      summary: getDayMasterDisplay(fourPillars),
      details: chinese?.animal
        ? `${chinese.element} ${chinese.animal} • ${chinese.year}`
        : 'Calculate your destiny chart',
      available: !!fourPillars
    },
    {
      id: 'mbti',
      title: 'MBTI Soul Analysis',
      icon: '💜',
      gradient: 'from-blue-500 to-indigo-600',
      summary: profile.mbti || 'Discover Your Type',
      details: profile.mbti
        ? 'Deep psychology & compatibility'
        : 'Complete 6 soul questions',
      available: !!profile.mbti
    },
    {
      id: 'western',
      title: 'Western Astrology',
      icon: '⭐',
      gradient: 'from-amber-500 to-orange-600',
      summary: westZodiac?.sign || 'Your Zodiac Sign',
      details: westZodiac?.planetaryRuler
        ? `Ruled by ${westZodiac.planetaryRuler}`
        : 'Planetary influences',
      available: !!westZodiac?.sign
    },
    {
      id: 'numerology',
      title: 'Numerology',
      icon: '🔢',
      gradient: 'from-emerald-500 to-green-600',
      summary: numerology?.lifePath
        ? `Life Path ${numerology.lifePath}`
        : 'Your Numbers',
      details: numerology?.destinyNumber
        ? `Destiny ${numerology.destinyNumber}`
        : 'Soul mathematics',
      available: !!numerology?.lifePath
    }
  ];

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div
        className="text-center space-y-4"
        variants={itemVariants}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Welcome to Your Soul Map
        </h1>
        <p className="text-xl text-purple-300 max-w-2xl mx-auto">
          {profile.displayName || profile.firstName || 'Your'}'s complete astrological and psychological profile
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent max-w-md mx-auto" />

        {/* Current Moon Phase - Quick Status */}
        <div className="flex justify-center mt-4">
          <div className="bg-indigo-900/40 backdrop-blur-sm rounded-full px-4 py-2 border border-indigo-500/30">
            <MoonPhaseCompact sunSign={westZodiac?.sign} showSensitivity={true} />
          </div>
        </div>
      </motion.div>

      {/* Archetype Highlight (if available) */}
      {archetype && (
        <motion.div
          className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-purple-400/50 rounded-2xl p-8 text-center shadow-2xl"
          variants={itemVariants}
        >
          <span className="text-6xl block mb-4">{archetype.symbol}</span>
          <h2 className="text-3xl font-bold text-white mb-2">
            {archetype.name}
          </h2>
          <p className="text-purple-100 text-lg italic mb-4">
            {archetype.tagline}
          </p>
          <p className="text-purple-200 text-sm max-w-2xl mx-auto">
            {archetype.coreEssence}
          </p>
        </motion.div>
      )}

      {/* Systems Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {systems.map((system) => (
          <motion.button
            key={system.id}
            onClick={() => onNavigateToTab(system.id)}
            className={`
              relative overflow-hidden
              bg-gradient-to-br from-slate-800 to-slate-900
              border border-purple-500/30 rounded-2xl
              p-6 text-left
              transition-all duration-300
              hover:border-purple-400/50 hover:shadow-xl
              ${system.available ? 'cursor-pointer' : 'opacity-60'}
            `}
            whileHover={{ scale: system.available ? 1.02 : 1 }}
            whileTap={{ scale: system.available ? 0.98 : 1 }}
          >
            {/* Background Gradient Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${system.gradient} opacity-0 hover:opacity-10 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative z-10 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{system.icon}</span>
                  <h3 className="text-xl font-bold text-white">
                    {system.title}
                  </h3>
                </div>
                {system.available && (
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>

              {/* Summary */}
              <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${system.gradient} text-white text-sm font-bold`}>
                {system.summary}
              </div>

              {/* Details */}
              <p className="text-purple-200 text-sm">
                {system.details}
              </p>

              {/* Status Badge */}
              {!system.available && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-xs text-yellow-300 font-medium">
                    Complete profile to unlock
                  </span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400/20 rounded-2xl p-6"
        variants={itemVariants}
      >
        <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
          <span>📊</span>
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {systems.filter(s => s.available).length}/{systems.length}
            </div>
            <div className="text-xs text-purple-300">Systems Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {profile.age?.years || '—'}
            </div>
            <div className="text-xs text-purple-300">Years Old</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {chinese?.element || '—'}
            </div>
            <div className="text-xs text-purple-300">Element</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {westZodiac?.sign || '—'}
            </div>
            <div className="text-xs text-purple-300">Sun Sign</div>
          </div>
        </div>
      </motion.div>

      {/* Exploration Invitation */}
      <motion.div
        className="text-center text-purple-300 text-sm italic"
        variants={itemVariants}
      >
        <p>Click any system above to explore your complete analysis</p>
        <p className="text-xs text-purple-400 mt-2">
          Each tab provides deep insights into different aspects of your soul
        </p>
      </motion.div>
    </motion.div>
  );
}
