/**
 * Release Movement
 *
 * The third movement of the Sanctuary journey.
 * Where the chamber gives permission to feel and let go.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

export function ReleaseMovement({ section, ritual, onContinue }) {
  if (!section) return null;

  return (
    <div className="space-y-8 px-4 py-8 max-w-2xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-3"
      >
        <div className="text-3xl">&#128330;</div>
        <h2 className="text-rose-300 text-xl md:text-2xl font-semibold">
          {section.title || 'Release'}
        </h2>
        <p className="text-xs text-white/60 max-w-md mx-auto">
          This is where you are allowed to feel what you feel.
          <br />
          Nothing in you is a problem to be fixed.
        </p>
      </motion.div>

      {/* Release Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9 }}
        className="rounded-2xl bg-gradient-to-br from-rose-950/50 via-slate-950/60 to-rose-950/50 border border-rose-400/30 p-6 space-y-3"
      >
        {section.lines?.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
            className="text-sm md:text-base text-white/80 leading-relaxed"
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* Gentle Release Ritual */}
      {ritual && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          className="rounded-2xl bg-slate-950/70 border border-rose-400/20 p-5 space-y-3"
        >
          <div className="flex items-center gap-2 justify-center">
            <span className="text-lg">&#128168;</span>
            <p className="text-rose-300 text-sm font-semibold">
              Gentle Release Ritual
            </p>
          </div>
          <p className="text-sm text-white/75 leading-relaxed text-center">
            {ritual}
          </p>
        </motion.div>
      )}

      {/* Breathing space visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="flex justify-center py-4"
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-rose-400/10 border border-rose-400/20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <motion.div
            className="w-full h-full rounded-full bg-rose-400/20 flex items-center justify-center"
            animate={{
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-white/40 text-xs">breathe</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="flex justify-center pt-2"
      >
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20"
        >
          Continue into Integration
        </motion.button>
      </motion.div>
    </div>
  );
}

export default ReleaseMovement;
