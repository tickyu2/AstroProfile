/**
 * Interior Reveal
 *
 * The first moment after crossing the threshold.
 * Welcome message with gentle animation sequence.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

export function InteriorReveal({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="flex flex-col items-center space-y-8 text-center px-4 py-16"
    >
      {/* Candle icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-5xl"
      >
        <motion.span
          animate={{
            filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          &#128367;
        </motion.span>
      </motion.div>

      {/* Welcome message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="text-amber-300 text-2xl md:text-3xl font-light leading-relaxed max-w-xl"
      >
        Welcome.
        <br />
        <span className="text-white/80 text-lg md:text-xl">
          You do not need to perform here.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="text-white/60 text-sm md:text-base max-w-md leading-relaxed"
      >
        This is a place where your unseen self can step forward.
        <br />
        There is nothing to fix. Nothing to prove.
      </motion.p>

      {/* Secondary message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.5 }}
        className="text-white/50 text-xs max-w-sm italic"
      >
        Let the walls speak to you as you walk deeper in.
      </motion.p>

      {/* Continue button */}
      <motion.button
        onClick={onComplete}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.5, duration: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-slate-900 text-sm font-semibold mt-4 shadow-lg shadow-amber-500/20"
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

export default InteriorReveal;
