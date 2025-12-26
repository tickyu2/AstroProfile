/**
 * Sanctuary Entrance Portal
 *
 * The sacred threshold to The Sanctuary of the Unseen Self.
 * Art Nouveau + Michelangelo aesthetic with Framer Motion animations.
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

/**
 * The Sigil SVG - Heart-flame with crescent veil, rays, and vines
 */
function SigilSVG({ isHovered, isActivated }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-32 h-32 md:w-40 md:h-40"
      animate={{
        filter: isActivated
          ? 'brightness(1.3) drop-shadow(0 0 20px rgba(251,191,36,0.6))'
          : isHovered
            ? 'brightness(1.15) drop-shadow(0 0 15px rgba(251,191,36,0.4))'
            : 'brightness(1) drop-shadow(0 0 8px rgba(251,191,36,0.2))'
      }}
      transition={{ duration: 0.8 }}
    >
      {/* Outer Circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="url(#outerGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Inner Ring */}
      <motion.circle
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke="url(#innerGradient)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
      />

      {/* Three Rays */}
      {[-25, 0, 25].map((angle, i) => (
        <motion.line
          key={i}
          x1="100"
          y1="60"
          x2="100"
          y2="25"
          stroke="#fef3c7"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.3}
          transform={`rotate(${angle} 100 100)`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 1 + i * 0.2 }}
        />
      ))}

      {/* Heart-Flame */}
      <motion.path
        d="M100 140
           C85 125, 70 110, 70 90
           C70 70, 85 55, 100 55
           C115 55, 130 70, 130 90
           C130 110, 115 125, 100 140Z"
        fill="url(#flameGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isActivated ? 1.1 : 1,
          opacity: 1
        }}
        transition={{ duration: 1.2, delay: 0.8 }}
        style={{ transformOrigin: '100px 100px' }}
      />

      {/* Inner Flame Glow */}
      <motion.ellipse
        cx="100"
        cy="95"
        rx="15"
        ry="25"
        fill="#fde68a"
        opacity={0.4}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0.4 }}
        transition={{ duration: 0.5 }}
      />

      {/* Crescent Veil */}
      <motion.path
        d="M70 100
           Q100 80, 130 100"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.25}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />

      {/* Vines - North */}
      <motion.path
        d="M100 10
           Q105 20, 100 30
           Q95 25, 98 20"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 1.8, delay: 1.5 }}
      />

      {/* Vines - South */}
      <motion.path
        d="M100 190
           Q105 180, 100 170
           Q95 175, 98 180"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 1.8, delay: 1.6 }}
      />

      {/* Vines - East */}
      <motion.path
        d="M190 100
           Q180 105, 170 100
           Q175 95, 180 98"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 1.8, delay: 1.7 }}
      />

      {/* Vines - West */}
      <motion.path
        d="M10 100
           Q20 105, 30 100
           Q25 95, 20 98"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 1.8, delay: 1.8 }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="flameGradient" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

/**
 * Floating Particles - Gold dust drifting like breath
 */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}

/**
 * Main Entrance Portal Component
 */
export default function SanctuaryEntrancePortal({ onEnter }) {
  const [showMeaning, setShowMeaning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [showInscription, setShowInscription] = useState(false);
  const [showRitual, setShowRitual] = useState(false);

  // Reveal inscription after sigil appears
  useEffect(() => {
    const timer = setTimeout(() => setShowInscription(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Reveal ritual phrase after inscription
  useEffect(() => {
    const timer = setTimeout(() => setShowRitual(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsActivated(true);
    // Transition to sanctuary after animation
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Breathing Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.1) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.05) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* The Inscription */}
      <AnimatePresence>
        {showInscription && (
          <motion.div
            className="text-center mb-8 max-w-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.p
              className="text-amber-300/80 text-lg md:text-xl font-light leading-relaxed italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              "Here, the unseen is welcomed.
            </motion.p>
            <motion.p
              className="text-amber-300/80 text-lg md:text-xl font-light leading-relaxed italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Here, the unheard is honored.
            </motion.p>
            <motion.p
              className="text-amber-300/80 text-lg md:text-xl font-light leading-relaxed italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
            >
              Here, the soul steps forward and is recognized."
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sigil Container */}
      <motion.div
        onClick={() => setShowMeaning(!showMeaning)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative cursor-pointer select-none rounded-full p-8 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 border border-amber-500/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isActivated ? 1.2 : 1,
          opacity: 1
        }}
        transition={{
          duration: isActivated ? 1 : 1.5,
          delay: isActivated ? 0 : 0.5,
          type: 'spring',
          stiffness: 100
        }}
        whileHover={{ scale: 1.05 }}
        style={{
          boxShadow: isHovered
            ? '0 0 60px rgba(251,191,36,0.3)'
            : '0 0 30px rgba(251,191,36,0.15)'
        }}
      >
        <SigilSVG isHovered={isHovered} isActivated={isActivated} />

        {/* Hover Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none border-2 border-amber-400/30"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Sigil Meaning Reveal */}
      <AnimatePresence>
        {showMeaning && (
          <motion.div
            className="max-w-md text-center p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 mt-6"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-amber-300 font-semibold text-xs tracking-widest uppercase mb-3">
              Sigil Meaning
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              The <span className="text-amber-300">heart-flame</span> represents the unseen self rising into recognition.
              The <span className="text-white/90">crescent veil</span> honors the parts of you once hidden.
              The <span className="text-amber-200">three rays</span> symbolize emergence, truth, and inner light.
              The <span className="text-emerald-400">vines</span> reflect emotional growth and gentle unfurling.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ritual Phrase & Enter Button */}
      <AnimatePresence>
        {showRitual && !isActivated && (
          <motion.div
            className="mt-8 text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Ritual Phrase */}
            <div className="space-y-1">
              <motion.p
                className="text-white/60 text-sm italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "I step across the threshold.
              </motion.p>
              <motion.p
                className="text-white/60 text-sm italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                I allow myself to be seen."
              </motion.p>
            </div>

            {/* Enter Button */}
            <motion.button
              onClick={handleEnter}
              className="px-8 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter the Sanctuary
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activation Animation */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="fixed inset-0 bg-amber-400/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 1] }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.h1
        className="absolute top-8 text-center text-2xl md:text-3xl font-bold text-amber-300/90 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        The Sanctuary of the Unseen Self
      </motion.h1>
    </div>
  );
}
