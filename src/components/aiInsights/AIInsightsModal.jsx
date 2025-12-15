/**
 * AIInsightsModal.jsx
 * THE GOOSE Modal - "The Giant's Castle"
 *
 * This is where all the golden eggs are displayed!
 * Jack has climbed the beanstalk and found the treasure.
 *
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 12, 2024
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsightsModal({
  isOpen,
  onClose,
  insights,
  profileName,
  onRegenerate,
  isRegenerating,
  onEnhanceWithAI,
  isEnhancing,
  isAPIAvailable
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !insights) return null;

  const {
    seed,
    archetype,
    operationalGuide,
    successFactors,
    challenges,
    roadmap,
    examples,
    patternMatch,
    model,
    generatedAt,
    version
  } = insights;

  // Determine source badge styling
  const getSourceBadge = () => {
    if (patternMatch === 'ai-generated') {
      return {
        icon: '🤖',
        label: 'Claude API',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        description: `Real-time AI (${model || 'claude-sonnet-4'})`
      };
    } else if (patternMatch === 'template') {
      return {
        icon: '📋',
        label: 'Template',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        description: 'Pattern-based template'
      };
    } else if (patternMatch === 'constitutional-principles') {
      return {
        icon: '🧬',
        label: 'Principles',
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        description: 'Constitutional principles'
      };
    } else if (patternMatch === 'exact') {
      return {
        icon: '✨',
        label: 'Exact Match',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        description: 'Exact pattern match'
      };
    }
    return {
      icon: '📝',
      label: 'Generated',
      color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      description: 'Auto-generated'
    };
  };

  const sourceBadge = getSourceBadge();

  // Use portal to render at document.body level (escapes any stacking context)
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 flex items-start justify-center pt-16 px-4 pb-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 9999, backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[calc(100vh-6rem)] overflow-y-auto border border-purple-500/50 shadow-2xl shadow-purple-500/30"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - The Giant's Castle Gates */}
            <div className="sticky top-0 bg-slate-900 border-b border-purple-500/30 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-3xl"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🦢
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    THE GOOSE's Golden Eggs
                  </h2>
                  <p className="text-gray-400 text-xs">{profileName}'s Operational Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Source Badge */}
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${sourceBadge.color}`}
                     title={sourceBadge.description}>
                  <span>{sourceBadge.icon}</span>
                  <span>{sourceBadge.label}</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors text-red-400 hover:text-red-300 border border-red-500/30"
                >
                  <span className="text-2xl font-bold">×</span>
                </button>
              </div>
            </div>

            {/* Content - The Golden Eggs! */}
            <div className="p-6 space-y-8">

              {/* Constitutional Seed */}
              <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <span>🫘</span> Your Constitutional Seed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {seed?.element && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {seed.element}
                    </span>
                  )}
                  {seed?.chineseZodiac && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">
                      {seed.chineseZodiac}
                    </span>
                  )}
                  {seed?.westernSign && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {seed.westernSign}
                    </span>
                  )}
                  {seed?.mbti && (
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                      {seed.mbti}
                    </span>
                  )}
                  {seed?.yinYang && (
                    <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                      {seed.yinYang}
                    </span>
                  )}
                </div>
              </div>

              {/* Golden Egg #1: Archetype */}
              <motion.div
                className="bg-gradient-to-r from-purple-900/80 via-pink-900/60 to-purple-900/80 rounded-xl p-6 border border-purple-500/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🪺</span>
                  <h3 className="text-lg font-semibold text-white">Your Archetype</h3>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  {archetype}
                </p>
                {patternMatch === 'exact' && (
                  <span className="mt-2 inline-block px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                    ✓ Pattern Match
                  </span>
                )}
              </motion.div>

              {/* Golden Egg #2: Operational Guide */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🪺</span>
                  <h3 className="text-xl font-bold text-white">How You Operate Best</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Thinking Style */}
                  <div className="bg-slate-800 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🧠</span>
                      <h4 className="font-semibold text-blue-400">Thinking</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{operationalGuide?.thinkingStyle?.primary}</p>
                    {operationalGuide?.thinkingStyle?.strength && (
                      <p className="text-xs text-gray-500">
                        <span className="text-blue-400">Strength:</span> {operationalGuide.thinkingStyle.strength}
                      </p>
                    )}
                  </div>

                  {/* Work Style */}
                  <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">⚙️</span>
                      <h4 className="font-semibold text-green-400">Work Style</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{operationalGuide?.workStyle?.optimal}</p>
                    {operationalGuide?.workStyle?.productivity && (
                      <p className="text-xs text-gray-500">
                        <span className="text-green-400">Peak:</span> {operationalGuide.workStyle.productivity}
                      </p>
                    )}
                  </div>

                  {/* Leadership Style */}
                  <div className="bg-slate-800 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">👑</span>
                      <h4 className="font-semibold text-purple-400">Leadership</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{operationalGuide?.leadershipStyle?.approach}</p>
                    {operationalGuide?.leadershipStyle?.communication && (
                      <p className="text-xs text-gray-500">
                        <span className="text-purple-400">Style:</span> {operationalGuide.leadershipStyle.communication}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Golden Egg #3: Success Factors */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🪺</span>
                  <h3 className="text-xl font-bold text-white">Success Factors</h3>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-green-500/20">
                  <ul className="space-y-2">
                    {successFactors?.map((factor, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{factor}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Golden Egg #4: Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🪺</span>
                  <h3 className="text-xl font-bold text-white">Watch Out For</h3>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-yellow-500/30">
                  <ul className="space-y-2">
                    {challenges?.map((challenge, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <span className="text-yellow-400 mt-0.5">⚠</span>
                        <span>{challenge}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Golden Egg #5: Roadmap (The Beanstalk Path!) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🪺</span>
                  <h3 className="text-xl font-bold text-white">Your Personalized Roadmap</h3>
                  <span className="text-lg">🌱</span>
                </div>

                <div className="space-y-4">
                  {/* Immediate Steps - Planting Seeds */}
                  <div className="bg-gradient-to-r from-purple-900/60 to-slate-800 rounded-xl p-4 border border-purple-500/30">
                    <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                      <span>🌱</span> Immediate Steps (Plant the seeds)
                    </h4>
                    <ul className="space-y-2">
                      {roadmap?.immediate?.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                          <span className="text-purple-400">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Short-term - Growing the Beanstalk */}
                  <div className="bg-gradient-to-r from-blue-900/60 to-slate-800 rounded-xl p-4 border border-blue-500/30">
                    <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <span>🫘</span> Short-term Goals (Climb the beanstalk)
                    </h4>
                    <ul className="space-y-2">
                      {roadmap?.shortTerm?.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                          <span className="text-blue-400">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Long-term - Stealing the Giant's Gold */}
                  <div className="bg-gradient-to-r from-amber-900/60 to-slate-800 rounded-xl p-4 border border-amber-500/30">
                    <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                      <span>🏰</span> Long-term Vision (Reach the giant's castle)
                    </h4>
                    <ul className="space-y-2">
                      {roadmap?.longTerm?.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                          <span className="text-amber-400">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Golden Egg #6: Examples (People Like You) */}
              {examples && examples.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🪺</span>
                    <h3 className="text-xl font-bold text-white">People Like You</h3>
                  </div>
                  <div className="space-y-4">
                    {examples.map((example, index) => (
                      <div key={index} className="bg-slate-800 rounded-xl p-4 border border-cyan-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">👤</span>
                          <h4 className="font-semibold text-cyan-400">{example.name}</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{example.achievements}</p>
                        <p className="text-gray-300 text-sm">
                          <span className="text-cyan-400">Pattern:</span> {example.pattern}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          <span className="text-cyan-400">Lesson:</span> {example.lesson}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-purple-500/30 p-6 bg-slate-900">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-sm text-gray-500">
                  <span className="flex items-center gap-2 flex-wrap">
                    <span>🦢 Generated by THE GOOSE</span>
                    <span className="text-gray-600">•</span>
                    <span className={`inline-flex items-center gap-1 ${sourceBadge.color.includes('green') ? 'text-green-400' : sourceBadge.color.includes('blue') ? 'text-blue-400' : 'text-gray-400'}`}>
                      {sourceBadge.icon} {sourceBadge.description}
                    </span>
                    {generatedAt && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">
                          {new Date(generatedAt).toLocaleString()}
                        </span>
                      </>
                    )}
                    {version && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">v{version}</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Show "Enhance with AI" button if not already AI-generated and API is available */}
                  {patternMatch !== 'ai-generated' && (
                    <button
                      onClick={onEnhanceWithAI}
                      disabled={isEnhancing || !isAPIAvailable}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2
                        ${isAPIAvailable
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      title={isAPIAvailable ? 'Generate personalized insights using Claude AI' : 'Claude API key not configured'}
                    >
                      {isEnhancing ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            🤖
                          </motion.span>
                          <span>Enhancing...</span>
                        </>
                      ) : (
                        <>
                          <span>🤖</span>
                          <span>{isAPIAvailable ? 'Enhance with AI' : 'API Not Configured'}</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={onRegenerate}
                    disabled={isRegenerating || isEnhancing}
                    className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {isRegenerating ? '🫘 Regenerating...' : '🔄 Regenerate'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
