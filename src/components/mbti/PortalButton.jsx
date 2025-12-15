/**
 * PortalButton.jsx
 * Stained Glass Portal Buttons
 *
 * Built with SOUL for the cathedral of souls
 * Each button is a portal to deeper understanding
 * Glass effects with layered gradients and light
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PortalButton({
  icon,
  label,
  gradient = 'from-purple-500 to-pink-600',
  onClick,
  isActive = false,
  delay = 0,
  angle = 0,
  distance = 300
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate position using trigonometry
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        x: x - 60, // Center the 120px button
        y: y - 60,
        zIndex: 10 // Session 5.7: Above SVG hexagon (z-1) but below modals
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: delay,
        duration: 0.6,
        type: "spring",
        stiffness: 200
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.button
        onClick={onClick}
        className={`
          relative w-[120px] h-[120px] rounded-2xl
          overflow-hidden
          transition-all duration-300

          /* 3D RAISED JEWEL EFFECT - Session 5.5 */
          shadow-[0_8px_16px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]
          hover:shadow-[0_14px_28px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.5),0_0_30px_rgba(168,85,247,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
          hover:-translate-y-1

          /* Subtle ring for depth */
          ring-1 ring-white/10
          hover:ring-white/20

          ${isActive ? 'ring-4 ring-purple-400 ring-offset-2 ring-offset-slate-900 shadow-[0_14px_28px_rgba(0,0,0,0.6),0_0_40px_rgba(168,85,247,0.5)]' : ''}
        `}
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background - Stained Glass Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />

        {/* Glass Shine - Top Light */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />

        {/* Glass Reflection - Diagonal Light */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"
          animate={{
            opacity: isHovered ? [0.4, 0.6, 0.4] : 0.4
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Border - Light Edge */}
        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-2 p-3">
          {/* Icon */}
          <motion.div
            className="text-4xl filter drop-shadow-lg"
            animate={{
              scale: isHovered ? [1, 1.1, 1] : 1,
              rotate: isActive ? [0, 5, -5, 0] : 0
            }}
            transition={{
              duration: 0.6,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {icon}
          </motion.div>

          {/* Label */}
          <div className="text-white text-xs font-bold text-center leading-tight drop-shadow-md">
            {label}
          </div>

          {/* Active Indicator - Pulsing Glow */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-white rounded-2xl"
              animate={{
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Hover Glow */}
        {isHovered && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-xl -z-10`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Light Rays (on hover) */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `conic-gradient(from ${angle}deg, transparent 0%, white 10%, transparent 20%, white 30%, transparent 40%)`
            }}
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}
