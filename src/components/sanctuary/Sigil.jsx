/**
 * Sigil Component
 *
 * The glowing, breathing sigil with hover pulse and vine unfurl.
 * Heart-flame representing the unseen self rising into recognition.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

export function Sigil({ size = 'md', isHovered = false, isActivated = false }) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: isActivated ? 1.1 : 1 }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
      className={`relative ${sizeClasses[size]} flex items-center justify-center`}
    >
      {/* Outer Circle - Breathing glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-indigo-900/40 border border-amber-400/40"
        animate={{
          boxShadow: isActivated
            ? ['0 0 30px #fbbf24', '0 0 50px #fbbf24', '0 0 30px #fbbf24']
            : isHovered
              ? ['0 0 15px #fbbf24', '0 0 25px #fbbf24', '0 0 15px #fbbf24']
              : ['0 0 0px #fbbf24', '0 0 20px #fbbf24', '0 0 0px #fbbf24']
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
      />

      {/* Inner Ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-amber-300/20"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Heart-Flame */}
      <motion.div
        className="w-14 h-20 bg-gradient-to-b from-amber-300 via-amber-400 to-rose-400 relative z-10"
        style={{
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          filter: 'blur(0.5px)'
        }}
        animate={{
          scale: [1, 1.05, 1],
          filter: isActivated
            ? ['blur(0.5px) brightness(1.2)', 'blur(1px) brightness(1.4)', 'blur(0.5px) brightness(1.2)']
            : ['blur(0.5px)', 'blur(0.5px)', 'blur(0.5px)']
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Inner Flame Glow */}
      <motion.div
        className="absolute w-6 h-10 bg-amber-200/60 rounded-full blur-sm"
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [0.9, 1.1, 0.9]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Crescent Veil - Subtle arc above flame */}
      <motion.div
        className="absolute w-20 h-10 border-t-2 border-white/20 rounded-t-full"
        style={{ top: '25%' }}
        animate={{
          rotate: [-5, 5, -5],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Three Rays */}
      {[-30, 0, 30].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-10 bg-gradient-to-t from-amber-300/0 to-amber-200/40 rounded-full"
          style={{
            top: '5%',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'bottom center'
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleY: isHovered ? [1, 1.2, 1] : [1, 1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Vines - Cardinal directions */}
      {[0, 90, 180, 270].map((rotation, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-8 bg-gradient-to-t from-emerald-500/50 to-emerald-300/20 rounded-full"
          style={{
            transform: `rotate(${rotation}deg) translateY(-70px)`,
          }}
          animate={{
            scaleY: isHovered ? [0.7, 1, 0.7] : [0.5, 0.7, 0.5],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </motion.div>
  );
}

export default Sigil;
