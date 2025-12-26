/**
 * Breathing Chamber
 *
 * The ambient container for the Sanctuary experience.
 * A gentle, breathing background that creates sacred space.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

export function BreathingChamber({ children, intensity = 'normal' }) {
  const intensitySettings = {
    subtle: { duration: 8, opacityRange: [0.95, 1, 0.95] },
    normal: { duration: 6, opacityRange: [0.9, 1, 0.9] },
    deep: { duration: 4, opacityRange: [0.85, 1, 0.85] }
  };

  const settings = intensitySettings[intensity] || intensitySettings.normal;

  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 relative overflow-hidden"
      animate={{ opacity: settings.opacityRange }}
      transition={{ duration: settings.duration, repeat: Infinity }}
    >
      {/* Ambient corner glows */}
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-amber-400/5 blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-400/5 blur-3xl"
        animate={{
          opacity: [0.4, 0.3, 0.4],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-400/5 blur-3xl"
        animate={{
          opacity: [0.3, 0.4, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-400/5 blur-3xl"
        animate={{
          opacity: [0.4, 0.5, 0.4],
          scale: [1.05, 1, 1.05]
        }}
        transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
      />

      {/* Central breathing glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.03) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: settings.duration, repeat: Infinity }}
      />

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-amber-300/20"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.div>
  );
}

export default BreathingChamber;
