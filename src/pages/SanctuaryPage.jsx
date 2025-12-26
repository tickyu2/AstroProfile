/**
 * The Sanctuary of the Unseen Self - Full Page Experience
 *
 * A sacred chamber where souls are recognized, not managed.
 * Entrance portal → Interior sanctuary → Four Movements → Take-home rituals
 *
 * "Here, the unseen is welcomed.
 *  Here, the unheard is honored.
 *  Here, the soul steps forward and is recognized."
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SanctuaryEntrancePortal from '../components/sanctuary/SanctuaryEntrancePortal';
import SelfRecognitionSanctuary from '../components/sanctuary/SelfRecognitionSanctuary';
import { submitToSanctuary, buildInputFromProfile } from '../services/sanctuaryService';

/**
 * Main Sanctuary Page - Manages entrance → interior transition
 */
export default function SanctuaryPage() {
  const navigate = useNavigate();
  const [hasEntered, setHasEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sanctuary state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Try to get profile from localStorage for pre-filling
  const [initialInput, setInitialInput] = useState(null);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('currentProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const input = buildInputFromProfile(profile);
        setInitialInput(input);
      }
    } catch (err) {
      console.warn('Could not load profile for Sanctuary:', err);
    }
  }, []);

  /**
   * Handle entrance transition
   */
  const handleEnter = () => {
    setIsTransitioning(true);
    // After transition animation, show interior
    setTimeout(() => {
      setHasEntered(true);
      setIsTransitioning(false);
    }, 800);
  };

  /**
   * Handle sanctuary submission
   */
  const handleSubmit = async (input) => {
    setLoading(true);
    setError(null);

    try {
      const response = await submitToSanctuary(input);
      setResult(response);
    } catch (err) {
      console.error('Sanctuary error:', err);
      setError(err.message || 'The Sanctuary could not receive your words. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle clear/reset
   */
  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  /**
   * Handle exit from sanctuary
   */
  const handleExit = () => {
    setHasEntered(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.03) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.06) 0%, transparent 60%)',
              'radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.03) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Entrance Portal */}
        {!hasEntered && !isTransitioning && (
          <motion.div
            key="entrance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SanctuaryEntrancePortal onEnter={handleEnter} />
          </motion.div>
        )}

        {/* Transition Screen */}
        {isTransitioning && (
          <motion.div
            key="transition"
            className="fixed inset-0 bg-amber-400/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-amber-300 text-xl font-light"
            >
              Crossing the threshold...
            </motion.div>
          </motion.div>
        )}

        {/* Interior Sanctuary */}
        {hasEntered && !isTransitioning && (
          <motion.div
            key="interior"
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-20">
              <motion.button
                onClick={handleExit}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-white/60 text-sm hover:bg-slate-800/80 hover:text-white/80 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>←</span>
                <span>Return to Entrance</span>
              </motion.button>
            </div>

            {/* Dashboard Link */}
            <div className="absolute top-4 right-4 z-20">
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-white/60 text-sm hover:bg-slate-800/80 hover:text-white/80 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Exit to Cathedral</span>
                <span>→</span>
              </motion.button>
            </div>

            {/* Interior Content */}
            <div className="min-h-screen flex items-center justify-center px-4 py-20">
              <motion.div
                className="w-full max-w-3xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <SelfRecognitionSanctuary
                  onSubmit={handleSubmit}
                  loading={loading}
                  result={result}
                  error={error}
                  onClear={handleClear}
                  initialInput={initialInput}
                />
              </motion.div>
            </div>

            {/* Interior Ambient Elements */}
            <InteriorAmbience />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Interior ambient visual elements - subtle candle glows
 */
function InteriorAmbience() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Corner candle glows */}
      <motion.div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-amber-400/5 blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-400/5 blur-3xl"
        animate={{
          opacity: [0.4, 0.3, 0.4],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-400/5 blur-3xl"
        animate={{
          opacity: [0.3, 0.4, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-indigo-400/5 blur-3xl"
        animate={{
          opacity: [0.4, 0.5, 0.4],
          scale: [1.05, 1, 1.05]
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
      />

      {/* Floating dust particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-amber-300/20"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
}
