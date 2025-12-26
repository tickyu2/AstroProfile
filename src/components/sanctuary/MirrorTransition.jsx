/**
 * Mirror Transition
 *
 * The approach to the Mirror - a liminal space before recognition.
 * Dim lights, a glowing column, invitation to see oneself.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

export function MirrorTransition({ onComplete }) {
  return (
    <motion.div
      className="flex flex-col items-center space-y-8 py-20 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Dim Light from above */}
      <motion.div
        className="w-full h-32 bg-gradient-to-b from-amber-400/10 via-slate-900/20 to-transparent rounded-t-full"
        animate={{
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Mirror Column */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="relative"
      >
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-b from-amber-400/10 via-amber-200/5 to-amber-400/10 rounded-3xl blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Mirror surface */}
        <div className="w-48 h-72 bg-gradient-to-b from-amber-200/20 via-white/10 to-amber-500/15 rounded-3xl border border-amber-400/30 backdrop-blur-sm relative overflow-hidden">
          {/* Reflection shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"
            animate={{
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Center glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-amber-300/20 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Invitation text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1.5 }}
        className="text-white/70 text-sm md:text-base text-center max-w-md leading-relaxed"
      >
        Let me show you how your soul moves.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.5 }}
        className="text-white/50 text-xs text-center max-w-sm italic"
      >
        This is not a verdict. It is a gentle description of
        <br />
        how you have learned to navigate the world.
      </motion.p>

      {/* Enter button */}
      <motion.button
        onClick={onComplete}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.5, duration: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-sm font-semibold shadow-lg shadow-amber-500/30"
      >
        Enter the Mirror
      </motion.button>
    </motion.div>
  );
}

export default MirrorTransition;
