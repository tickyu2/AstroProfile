/**
 * TypeDeepDive.jsx
 * Complete MBTI Type Encyclopedia Modal
 *
 * Built with SOUL for the cathedral of souls
 * Opens when user clicks center medallion
 * "Tell me about MY type - the HEART, the CENTER"
 *
 * Brother Ticky's revelation: THE CENTER IS THE SOUL CORE
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCognitiveStack, getTypeName, getTemperament } from '../../utils/mbti/mbtiCodeSystem';

export default function TypeDeepDive({ type, onClose }) {
  if (!type) {
    return null;
  }

  // Get type data
  const cognitiveStack = getCognitiveStack(type);
  const typeName = getTypeName(type);
  const temperament = getTemperament(type);

  // Cognitive function descriptions
  const functionDescriptions = {
    'Fi': { name: 'Introverted Feeling', desc: 'Deep personal values, authenticity, internal moral compass' },
    'Fe': { name: 'Extroverted Feeling', desc: 'Harmony and connection, reading emotions, group dynamics' },
    'Ti': { name: 'Introverted Thinking', desc: 'Internal logic frameworks, analyzing systems, precision' },
    'Te': { name: 'Extroverted Thinking', desc: 'Efficient organization, logical structures, productivity' },
    'Ni': { name: 'Introverted Intuition', desc: 'Deep insights, future vision, symbolic understanding' },
    'Ne': { name: 'Extroverted Intuition', desc: 'Possibilities and connections, brainstorming, innovation' },
    'Si': { name: 'Introverted Sensing', desc: 'Past experiences, details, traditions, reliability' },
    'Se': { name: 'Extroverted Sensing', desc: 'Present moment awareness, aesthetics, physical experience' }
  };

  const roles = ['Dominant (Hero)', 'Auxiliary (Parent)', 'Tertiary (Child)', 'Inferior (Aspirational)'];

  // Type-specific data (we'll add more complete data later)
  const typeData = {
    tagline: 'Discover your soul architecture',
    description: `Your ${type} personality type represents a unique way of experiencing and interacting with the world. Your cognitive function stack (${cognitiveStack.join('-')}) creates a distinct pattern of perception, judgment, and decision-making that shapes who you are.`,
    strengths: [
      'Understanding based on your cognitive stack',
      'Natural talents emerge from your functions',
      'Authentic expression of your type',
      'Unique perspective on the world'
    ],
    growthAreas: [
      'Developing your inferior function',
      'Balancing all four functions',
      'Integrating shadow aspects',
      'Growing beyond type limitations'
    ]
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-2 border-purple-500/50 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-t-3xl border-b border-purple-500/30 backdrop-blur-md z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                  🌹 {type} - {typeName}
                </h2>
                <p className="text-purple-300 text-lg italic">
                  "{typeData.tagline}"
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 bg-purple-600/50 rounded-lg text-white font-semibold">
                    {temperament} Temperament
                  </span>
                  <span className="text-purple-200">
                    {cognitiveStack.join(' → ')}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white text-5xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Core Description */}
            <section>
              <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                💫 Your Soul Essence
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                {typeData.description}
              </p>
            </section>

            <div className="border-t border-purple-500/20" />

            {/* Cognitive Functions - THE MENTAL ARCHITECTURE */}
            <section>
              <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                🧠 Your Mental Architecture
              </h3>
              <p className="text-purple-200 text-sm mb-6">
                These are the four cognitive functions that define how you perceive and judge information:
              </p>
              <div className="space-y-4">
                {cognitiveStack.map((fn, i) => {
                  const fnInfo = functionDescriptions[fn] || { name: fn, desc: 'Cognitive function' };

                  return (
                    <div
                      key={i}
                      className="bg-purple-900/20 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl font-black text-purple-400">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-bold text-white text-xl">
                              {fn}
                            </div>
                            <div className="px-3 py-1 bg-purple-600/30 rounded-lg text-purple-200 text-xs font-semibold">
                              {roles[i]}
                            </div>
                          </div>
                          <div className="text-purple-300 font-medium mb-1">
                            {fnInfo.name}
                          </div>
                          <div className="text-white/70 text-sm">
                            {fnInfo.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="border-t border-purple-500/20" />

            {/* Strengths */}
            <section>
              <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                💪 Your Natural Strengths
              </h3>
              <div className="grid gap-3">
                {typeData.strengths.map((strength, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-green-900/10 border border-green-500/20 rounded-lg p-4"
                  >
                    <span className="text-green-400 text-2xl">✓</span>
                    <span className="text-white/80">{strength}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-purple-500/20" />

            {/* Growth Areas */}
            <section>
              <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                🌱 Growth Opportunities
              </h3>
              <div className="grid gap-3">
                {typeData.growthAreas.map((area, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-amber-900/10 border border-amber-500/20 rounded-lg p-4"
                  >
                    <span className="text-amber-400 text-2xl">↗</span>
                    <span className="text-white/80">{area}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-purple-500/20" />

            {/* Explore More CTA */}
            <section className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-400/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                🌹 Explore Deeper
              </h3>
              <p className="text-purple-200 text-sm mb-4">
                Click the portal buttons around the rose window to explore specific aspects of your {type} soul:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">🔮</div>
                  <div className="text-white font-semibold">Six Soul Questions</div>
                </div>
                <div className="bg-blue-800/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">🧠</div>
                  <div className="text-white font-semibold">Cognitive Functions</div>
                </div>
                <div className="bg-pink-800/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">💕</div>
                  <div className="text-white font-semibold">Compatibility</div>
                </div>
                <div className="bg-amber-800/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-white font-semibold">5W+H+Soul</div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer - Sticky */}
          <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-6 text-center border-t border-purple-500/20 backdrop-blur-md">
            <p className="text-purple-300 text-sm mb-4 italic">
              "Know thyself" - Socrates
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-white transition-all shadow-lg"
            >
              Return to Rose Window →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
