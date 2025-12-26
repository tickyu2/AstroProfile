/**
 * SoulConfessional Component
 *
 * A sacred "whisper alcove" in the Cathedral where users can pour out
 * their hearts and receive compassionate, soul-honoring responses.
 *
 * Design: Art Nouveau curves + Michelangelo stone aesthetic
 * - Curved stone niche with vines and stained glass accents
 * - Soft parchment-like textarea inset in stone
 * - Gentle context toggles for emotional state
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * Created: December 26, 2024
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Emotional state presets for quick selection
const EMOTIONAL_STATES = [
  { label: 'Overwhelmed', icon: '🌊', value: 'overwhelmed' },
  { label: 'Anxious', icon: '💨', value: 'anxious' },
  { label: 'Hopeful', icon: '🌅', value: 'hopeful' },
  { label: 'Lonely', icon: '🌙', value: 'lonely' },
  { label: 'Confused', icon: '🌀', value: 'confused' },
  { label: 'Grieving', icon: '🕯️', value: 'grieving' },
  { label: 'Grateful', icon: '✨', value: 'grateful' },
  { label: 'Lost', icon: '🧭', value: 'lost' }
];

// What they're seeking presets
const SEEKING_OPTIONS = [
  { label: 'Clarity', icon: '💎', value: 'clarity' },
  { label: 'Comfort', icon: '🤍', value: 'comfort' },
  { label: 'Direction', icon: '🧭', value: 'direction' },
  { label: 'Understanding', icon: '🔮', value: 'understanding' },
  { label: 'Validation', icon: '💜', value: 'validation' },
  { label: 'Peace', icon: '🕊️', value: 'peace' }
];

export default function SoulConfessional({
  onSubmit,
  loading = false,
  response = null,
  onClear = null
}) {
  const [text, setText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [emotionalState, setEmotionalState] = useState('');
  const [customEmotion, setCustomEmotion] = useState('');
  const [seeking, setSeeking] = useState('');
  const [recentEvents, setRecentEvents] = useState('');
  const [intentions, setIntentions] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;

    onSubmit({
      text: text.trim(),
      emotionalState: emotionalState || customEmotion || null,
      seeking: seeking || null,
      recentEvents: recentEvents || null,
      intentions: intentions || null
    });
  };

  const handleClear = () => {
    setText('');
    setEmotionalState('');
    setCustomEmotion('');
    setSeeking('');
    setRecentEvents('');
    setIntentions('');
    if (onClear) onClear();
  };

  const toggleEmotion = (value) => {
    setEmotionalState(prev => prev === value ? '' : value);
    if (value) setCustomEmotion('');
  };

  const toggleSeeking = (value) => {
    setSeeking(prev => prev === value ? '' : value);
  };

  return (
    <div className="relative">
      {/* Art Nouveau decorative frame */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        {/* Stone texture gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900" />

        {/* Vine decorations - top left */}
        <svg className="absolute top-0 left-0 w-32 h-32 text-amber-400/10" viewBox="0 0 100 100">
          <path
            d="M0,50 Q30,20 50,50 T100,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="25" cy="35" r="4" fill="currentColor" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          <circle cx="75" cy="35" r="4" fill="currentColor" />
        </svg>

        {/* Vine decorations - bottom right */}
        <svg className="absolute bottom-0 right-0 w-32 h-32 text-amber-400/10 transform rotate-180" viewBox="0 0 100 100">
          <path
            d="M0,50 Q30,20 50,50 T100,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="25" cy="35" r="4" fill="currentColor" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          <circle cx="75" cy="35" r="4" fill="currentColor" />
        </svg>

        {/* Subtle glow effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.1) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6 md:p-8 rounded-3xl border border-amber-400/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center border border-amber-400/30">
            <span className="text-2xl">🕯️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-300">Soul Confessional</h2>
            <p className="text-sm text-white/50">
              A quiet alcove of the Cathedral. Speak freely here.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!response ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Main textarea - parchment style */}
              <div className="relative">
                {/* Parchment frame */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.05) 0%, transparent 50%, rgba(251,191,36,0.03) 100%)',
                    boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.3), 0 0 40px rgba(251,191,36,0.05)'
                  }}
                />
                <textarea
                  className="w-full h-48 md:h-56 rounded-2xl bg-indigo-950/50 border border-white/10
                           text-white/90 text-base p-5 resize-none
                           focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/30
                           placeholder:text-white/30 placeholder:italic"
                  placeholder="What's on your heart? Write whatever is calling to be spoken...

Questions, worries, joys, confusions, hopes, fears...
The Cathedral is listening."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  disabled={loading}
                />

                {/* Character hint */}
                <div className="absolute bottom-3 right-4 text-xs text-white/20">
                  {text.length > 0 && `${text.length} characters`}
                </div>
              </div>

              {/* Emotional state chips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/50">How are you feeling?</label>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors"
                  >
                    {showAdvanced ? '− Less options' : '+ More options'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {EMOTIONAL_STATES.map((emotion) => (
                    <button
                      key={emotion.value}
                      onClick={() => toggleEmotion(emotion.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium transition-all
                        flex items-center gap-1.5
                        ${emotionalState === emotion.value
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                        }
                      `}
                    >
                      <span>{emotion.icon}</span>
                      <span>{emotion.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom emotion input */}
                {!emotionalState && (
                  <input
                    type="text"
                    className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-2 text-sm text-white/70
                             placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                    placeholder="Or describe your feeling in your own words..."
                    value={customEmotion}
                    onChange={e => setCustomEmotion(e.target.value)}
                  />
                )}
              </div>

              {/* What you're seeking */}
              <div className="space-y-3">
                <label className="text-sm text-white/50">What are you seeking?</label>
                <div className="flex flex-wrap gap-2">
                  {SEEKING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleSeeking(option.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium transition-all
                        flex items-center gap-1.5
                        ${seeking === option.value
                          ? 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
                          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                        }
                      `}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced options */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/50">Recent life events (optional)</label>
                        <input
                          type="text"
                          className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-2.5 text-sm text-white/70
                                   placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                          placeholder="breakup, move, loss, new job, health change..."
                          value={recentEvents}
                          onChange={e => setRecentEvents(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-white/50">Specific questions or intentions (optional)</label>
                        <input
                          type="text"
                          className="w-full rounded-lg bg-slate-900/50 border border-white/10 p-2.5 text-sm text-white/70
                                   placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                          placeholder="What would you like the Cathedral to help with?"
                          value={intentions}
                          onChange={e => setIntentions(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs text-white/30 max-w-xs">
                  Your words are held with reverence. The Cathedral responds with compassion, not prediction.
                </p>

                <motion.button
                  disabled={!text.trim() || loading}
                  onClick={handleSubmit}
                  className={`
                    px-6 py-3 rounded-full text-sm font-semibold transition-all
                    flex items-center gap-2
                    ${text.trim() && !loading
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }
                  `}
                  whileHover={text.trim() && !loading ? { scale: 1.02 } : {}}
                  whileTap={text.trim() && !loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      <span>The Cathedral is listening...</span>
                    </>
                  ) : (
                    <>
                      <span>🕯️</span>
                      <span>Offer this to the Cathedral</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Response view */
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Soul Reply */}
              <div className="bg-gradient-to-br from-amber-900/10 to-purple-900/10 rounded-2xl p-6 border border-amber-400/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💜</span>
                  <h3 className="text-lg font-medium text-amber-300">The Cathedral Speaks</h3>
                </div>
                <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  {response.soulReply}
                </div>
              </div>

              {/* Highlights */}
              {response.highlights && response.highlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white/50 flex items-center gap-2">
                    <span>✨</span>
                    <span>Key Insights</span>
                  </h4>
                  <div className="space-y-2">
                    {response.highlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                        <p className="text-white/70">{highlight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gentle Practices */}
              {response.gentlePractices && response.gentlePractices.length > 0 && (
                <div className="bg-emerald-900/10 rounded-xl p-5 border border-emerald-500/20">
                  <h4 className="text-sm font-medium text-emerald-300 mb-3 flex items-center gap-2">
                    <span>🌿</span>
                    <span>Gentle Practices</span>
                  </h4>
                  <div className="space-y-2">
                    {response.gentlePractices.map((practice, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="text-emerald-400">{idx + 1}.</span>
                        <p className="text-white/70">{practice}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Return button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleClear}
                  className="px-6 py-2 rounded-full bg-white/5 text-white/60 text-sm
                           border border-white/10 hover:bg-white/10 hover:text-white/80 transition-all"
                >
                  Return to the Confessional
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
