/**
 * Mirror Movement
 *
 * The second movement of the Sanctuary journey.
 * Where the user is gently shown how their soul moves.
 * Includes emotional pattern visualization.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

const containerVar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 }
  }
};

const lineVar = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

export function MirrorMovement({ mirror, patterns, onContinue }) {
  if (!mirror) return null;

  return (
    <div className="space-y-8 px-4 py-8 max-w-2xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-3"
      >
        <div className="text-3xl">&#128386;</div>
        <h2 className="text-amber-300 text-xl md:text-2xl font-semibold">
          {mirror.title || 'The Mirror'}
        </h2>
        <p className="text-xs text-white/60 max-w-md mx-auto">
          Read slowly. This is not a verdict. It is a gentle description of how
          your soul has learned to move.
        </p>
      </motion.div>

      {/* Mirror Text */}
      <motion.div
        variants={containerVar}
        initial="hidden"
        animate="show"
        className="rounded-2xl bg-gradient-to-br from-slate-950/70 via-indigo-950/40 to-slate-950/80 border border-amber-400/25 p-6 space-y-3"
      >
        {mirror.lines?.map((line, i) => (
          <motion.p
            key={i}
            variants={lineVar}
            className="text-sm md:text-base text-white/80 leading-relaxed"
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* Emotional Pattern Visualization */}
      {patterns && patterns.length > 0 && (
        <PatternVisualizer patterns={patterns} />
      )}

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="flex justify-center pt-4"
      >
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500/80 to-pink-500/80 text-white text-sm font-semibold shadow-lg shadow-rose-500/20"
        >
          Continue into Release
        </motion.button>
      </motion.div>
    </div>
  );
}

/**
 * Pattern Visualizer - Shows emotional patterns as animated bars
 */
function PatternVisualizer({ patterns }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="rounded-2xl bg-slate-950/70 border border-white/10 p-5 space-y-4"
    >
      <p className="text-xs text-white/60 text-center mb-2">
        Emotional patterns the Sanctuary is noticing in you:
      </p>

      <div className="space-y-4">
        {patterns.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 + i * 0.2, duration: 0.6 }}
            className="space-y-2"
          >
            {/* Label and intensity */}
            <div className="flex justify-between text-xs">
              <span className="text-white/70">{p.label}</span>
              <span className="text-white/40">{p.intensity}/100</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.intensity}%` }}
                transition={{ duration: 1.2, delay: 2 + i * 0.2, ease: 'easeOut' }}
                className={`h-full rounded-full ${getPatternGradient(p.tone)}`}
              />
            </div>

            {/* Center and tone info */}
            {(p.center || p.tone) && (
              <p className="text-[10px] text-white/40">
                {p.center && `Center: ${p.center}`}
                {p.center && p.tone && ' · '}
                {p.tone && `Tone: ${p.tone}`}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Get gradient class based on emotional tone
 */
function getPatternGradient(tone) {
  switch (tone) {
    case 'tender':
      return 'bg-gradient-to-r from-rose-400 to-pink-400';
    case 'heavy':
      return 'bg-gradient-to-r from-indigo-400 to-purple-400';
    case 'hopeful':
      return 'bg-gradient-to-r from-emerald-400 to-teal-400';
    case 'conflicted':
      return 'bg-gradient-to-r from-amber-400 to-orange-400';
    default:
      return 'bg-gradient-to-r from-amber-400 to-rose-400';
  }
}

export default MirrorMovement;
