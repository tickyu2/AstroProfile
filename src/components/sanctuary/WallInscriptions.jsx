/**
 * Wall Inscriptions
 *
 * Sacred words inscribed on the Sanctuary walls.
 * Each inscription appears with gentle animation.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

const DEFAULT_INSCRIPTIONS = [
  'Nothing in you is too much.',
  'You may lay down what you have carried alone.',
  'Your hidden feelings are a doorway.',
  'You are not invisible here.',
  'What you have protected in yourself is safe now.',
  'There is no shame in the Sanctuary.'
];

export function WallInscriptions({ inscriptions = DEFAULT_INSCRIPTIONS, onContinue }) {
  return (
    <div className="py-12 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <p className="text-amber-300/60 text-xs tracking-widest uppercase">
          The Walls Speak
        </p>
      </motion.div>

      {/* Inscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {inscriptions.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: i * 0.6,
              duration: 1.2,
              ease: 'easeOut'
            }}
            className="relative"
          >
            {/* Stone tablet effect */}
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              {/* Subtle corner accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-400/20 rounded-tl" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-amber-400/20 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-400/20 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber-400/20 rounded-br" />

              {/* Inscription text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.6 + 0.3, duration: 0.8 }}
                className="text-white/80 text-sm md:text-base text-center leading-relaxed italic"
              >
                "{text}"
              </motion.p>
            </div>

            {/* Subtle glow underneath */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-xl bg-amber-400/5 blur-xl"
              animate={{
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Continue prompt */}
      {onContinue && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: inscriptions.length * 0.6 + 1, duration: 1 }}
          className="flex justify-center mt-10"
        >
          <motion.button
            onClick={onContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-slate-900 text-sm font-semibold shadow-lg shadow-amber-500/20"
          >
            Approach the Mirror
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default WallInscriptions;
