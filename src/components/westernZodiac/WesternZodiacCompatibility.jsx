/**
 * WesternZodiacCompatibility.jsx
 * Western Zodiac Compatibility Constellation Display
 *
 * Father Ticky's 6-6 Cusp Model - 36 Unique Cusp Positions
 *
 * Following the MBTI constellation pattern:
 * - Center: User's cusp
 * - Orbiting: ONLY compatible cusps (70%+)
 * - Golden ratio expansion based on compatibility
 * - Clean, focused display (NOT all 36 cusps)
 *
 * Built by Brother Claude Code
 * December 12, 2024
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  getCompatibleCusps,
  getDetailedCompatibility,
  getCompatibilityColors
} from '../../utils/westernZodiac/westernZodiacCompatibility';
import { getCuspDisplayName, getCuspDateRange, getSignEmoji } from '../../utils/westernZodiac/cuspCalculator';

export default function WesternZodiacCompatibility({ userCusp, userName, onSelectMatch }) {
  const [hoveredMatch, setHoveredMatch] = useState(null);

  if (!userCusp) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">⭐</span>
        <p className="text-purple-300 text-lg">
          Birth date needed to discover Western Zodiac compatibility
        </p>
      </div>
    );
  }

  // Get compatible cusps (70%+ only)
  const compatibilityData = getCompatibleCusps(userCusp, {
    minScore: 70,
    maxResults: 12
  });

  if (!compatibilityData) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">⭐</span>
        <p className="text-purple-300 text-lg">
          Unable to calculate compatibility
        </p>
      </div>
    );
  }

  const { user, compatible, stats } = compatibilityData;

  if (compatible.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">💫</span>
        <p className="text-purple-300 text-lg">
          Calculating compatible cusps for {getCuspDisplayName(user.cusp)}...
        </p>
      </div>
    );
  }

  const BASE_ORBIT = 180;
  const MATCH_SIZE = 100;

  // Golden ratio expansion - higher compatibility = closer to center
  const getOrbitDistance = (score) => {
    const PHI = 1.618;
    if (score >= 95) return BASE_ORBIT;
    if (score >= 90) return BASE_ORBIT * 1.1;
    if (score >= 85) return BASE_ORBIT * 1.2;
    if (score >= 80) return BASE_ORBIT * 1.35;
    if (score >= 75) return BASE_ORBIT * 1.5;
    if (score >= 70) return BASE_ORBIT * PHI;
    return BASE_ORBIT * (PHI * 1.2);
  };

  const getCircleSize = (score) => {
    if (score >= 95) return MATCH_SIZE * 1.4;
    if (score >= 90) return MATCH_SIZE * 1.25;
    if (score >= 85) return MATCH_SIZE * 1.15;
    if (score >= 80) return MATCH_SIZE * 1.0;
    if (score >= 75) return MATCH_SIZE * 0.9;
    if (score >= 70) return MATCH_SIZE * 0.85;
    return MATCH_SIZE * 0.75;
  };

  // Starting at TOP (270°), rotating clockwise
  const getAngles = (count) => {
    const baseAngles = [270, 315, 0, 45, 90, 135, 180, 225];
    if (count <= 8) return baseAngles.slice(0, count);
    // For more than 8, add intermediate angles
    const extraAngles = [292.5, 337.5, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5];
    return [...baseAngles, ...extraAngles].slice(0, count);
  };

  const angles = getAngles(compatible.length);

  return (
    <motion.div
      className="western-zodiac-constellation py-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: '-100px' }}
    >
      {/* Container sized for furthest orbit */}
      <div
        className="relative mx-auto mb-2"
        style={{
          width: BASE_ORBIT * 2 * 2.2,
          height: BASE_ORBIT * 2 * 2.4,
          minHeight: '700px'
        }}
      >
        {/* Connection lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.6,
            zIndex: 1,
            width: '100%',
            height: '100%'
          }}
        >
          {compatible.map((match, i) => {
            const angle = angles[i];
            const score = match.score;
            const orbitDistance = getOrbitDistance(score);
            const colors = getCompatibilityColors(score);

            const containerWidth = BASE_ORBIT * 2 * 2.2;
            const containerHeight = BASE_ORBIT * 2 * 2.4;
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;

            const dx = Math.cos((angle * Math.PI) / 180);
            const dy = Math.sin((angle * Math.PI) / 180);

            const x2 = centerX + dx * orbitDistance;
            const y2 = centerY + dy * orbitDistance;

            return (
              <line
                key={match.cusp.id}
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke={colors.lineColor}
                strokeWidth={score >= 95 ? '4' : score >= 90 ? '3' : '2'}
              />
            );
          })}
        </svg>

        {/* Center: User's cusp with HEARTBEAT animation */}
        <motion.div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-72px', // Half of w-36 (144px / 2)
            marginTop: '-72px',  // Half of h-36 (144px / 2)
            zIndex: 5
          }}
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 1.5, // 40 BPM - slow meditative rhythm
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* 3D Raised Orb with heartbeat glow */}
          <motion.div
            className="w-36 h-36 rounded-full flex items-center justify-center relative"
            style={{
              // 3D raised effect with multiple shadow layers
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #5b21b6 100%)',
              boxShadow: `
                0 0 60px rgba(99, 102, 241, 0.8),
                0 0 100px rgba(139, 92, 246, 0.4),
                inset 0 -8px 20px rgba(0, 0, 0, 0.4),
                inset 0 8px 20px rgba(255, 255, 255, 0.2),
                0 10px 30px rgba(0, 0, 0, 0.5),
                0 4px 8px rgba(0, 0, 0, 0.3)
              `,
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}
            animate={{
              boxShadow: [
                `0 0 60px rgba(99, 102, 241, 0.8), 0 0 100px rgba(139, 92, 246, 0.4), inset 0 -8px 20px rgba(0, 0, 0, 0.4), inset 0 8px 20px rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)`,
                `0 0 80px rgba(99, 102, 241, 1), 0 0 120px rgba(139, 92, 246, 0.6), inset 0 -8px 20px rgba(0, 0, 0, 0.4), inset 0 8px 20px rgba(255, 255, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)`,
                `0 0 60px rgba(99, 102, 241, 0.8), 0 0 100px rgba(139, 92, 246, 0.4), inset 0 -8px 20px rgba(0, 0, 0, 0.4), inset 0 8px 20px rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)`
              ]
            }}
            transition={{
              duration: 1.5, // Match slow meditative rhythm
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Inner highlight for 3D depth */}
            <div
              className="absolute inset-2 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)'
              }}
            />
            <div className="text-center relative z-10">
              <div className="text-3xl mb-1">
                {getSignEmoji(user.cusp.sign)}
              </div>
              <div className="text-sm font-bold text-white px-2 drop-shadow-lg">
                {getCuspDisplayName(user.cusp)}
              </div>
              <div className="text-xs text-white/70 mt-0.5 drop-shadow">
                ({getCuspDateRange(user.cusp.id)})
              </div>
              <div className="text-sm text-white font-bold mt-1 drop-shadow-lg">
                {userName || 'YOU'}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Orbiting compatible cusps */}
        {compatible.map((match, i) => {
          const angle = angles[i];
          const score = match.score;
          const orbitDistance = getOrbitDistance(score);
          const circleSize = getCircleSize(score);
          const colors = getCompatibilityColors(score);
          const isTopTier = score >= 90;
          const isHovered = hoveredMatch === i;

          const x = Math.cos((angle * Math.PI) / 180) * orbitDistance;
          const y = Math.sin((angle * Math.PI) / 180) * orbitDistance;

          return (
            <motion.div
              key={match.cusp.id}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                zIndex: isHovered ? 20 : 10
              }}
              initial={{
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{
                scale: 1,
                x: x - circleSize / 2,
                y: [
                  y - circleSize / 2,
                  y - circleSize / 2 - 5,
                  y - circleSize / 2
                ]
              }}
              transition={{
                delay: 0.3 + i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
                y: {
                  duration: 2 + (i * 0.3),
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.15, y: y - circleSize / 2 }}
              onHoverStart={() => setHoveredMatch(i)}
              onHoverEnd={() => setHoveredMatch(null)}
              onClick={() => onSelectMatch && onSelectMatch(match.cusp)}
            >
              {/* Match circle - 3D Raised Effect */}
              <div
                className={`relative rounded-full bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center transition-all duration-300`}
                style={{
                  width: circleSize,
                  height: circleSize,
                  // 3D raised orb effect
                  boxShadow: isHovered
                    ? `
                      0 0 50px ${colors.glow},
                      0 0 80px ${colors.glow},
                      inset 0 -6px 15px rgba(0, 0, 0, 0.4),
                      inset 0 6px 15px rgba(255, 255, 255, 0.25),
                      0 8px 25px rgba(0, 0, 0, 0.5),
                      0 3px 6px rgba(0, 0, 0, 0.3)
                    `
                    : `
                      0 0 25px ${colors.glow},
                      inset 0 -5px 12px rgba(0, 0, 0, 0.35),
                      inset 0 5px 12px rgba(255, 255, 255, 0.2),
                      0 6px 20px rgba(0, 0, 0, 0.4),
                      0 2px 5px rgba(0, 0, 0, 0.25)
                    `,
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {/* Inner highlight for 3D depth */}
                <div
                  className="absolute inset-1 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)'
                  }}
                />
                {/* Crown for top tier */}
                {isTopTier && i === 0 && (
                  <div className="absolute -top-8 text-3xl animate-pulse z-20">
                    👑
                  </div>
                )}

                {/* Sign emoji */}
                <div className="text-xl mb-0.5 relative z-10 drop-shadow">
                  {getSignEmoji(match.cusp.sign)}
                </div>

                {/* Cusp name */}
                <div
                  className="font-bold text-white text-center px-1 leading-tight relative z-10 drop-shadow"
                  style={{ fontSize: `${Math.max(9, circleSize / 9)}px` }}
                >
                  {getCuspDisplayName(match.cusp)}
                </div>

                {/* Date range */}
                <div
                  className="text-white/70 text-center px-1 relative z-10 drop-shadow"
                  style={{ fontSize: `${Math.max(8, circleSize / 12)}px` }}
                >
                  ({getCuspDateRange(match.cusp.id)})
                </div>

                {/* Score */}
                <div
                  className="font-bold text-white/90 relative z-10 drop-shadow"
                  style={{ fontSize: `${Math.max(9, circleSize / 10)}px` }}
                >
                  {score}%
                </div>

                {/* Golden Pair label */}
                {isTopTier && i === 0 && score >= 95 && (
                  <div className="absolute -bottom-8 text-xs font-bold text-amber-400 whitespace-nowrap z-20 drop-shadow">
                    Golden Match
                  </div>
                )}

                {/* Rank badge - 3D effect */}
                <div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${
                    score >= 90 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                    score >= 80 ? 'bg-gradient-to-br from-pink-500 to-pink-700' :
                    'bg-gradient-to-br from-blue-500 to-blue-700'
                  } border-2 border-white flex items-center justify-center text-white text-xs font-bold z-20`}
                  style={{
                    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  #{i + 1}
                </div>
              </div>

              {/* Hover info card */}
              {isHovered && (
                <motion.div
                  className="absolute top-full mt-6 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-purple-500/50 rounded-xl p-4 min-w-[240px] backdrop-blur-md shadow-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ zIndex: 30 }}
                >
                  <div className="text-white text-sm text-center">
                    <div className="text-2xl mb-2">
                      {match.cusp.emoji}
                    </div>
                    <div className="font-bold text-lg mb-1">
                      {match.cusp.archetype}
                    </div>
                    <div className="text-white/70 text-xs mb-2">
                      {match.cusp.name}
                    </div>
                    <div className={`text-xs font-semibold ${match.level.color} mb-2`}>
                      {match.level.description}
                    </div>
                    <div className="text-white/60 text-xs mb-3">
                      Element: {match.cusp.element.primary}
                      {match.cusp.element.secondary && ` + ${match.cusp.element.secondary}`}
                    </div>
                    <div className="text-purple-400 font-semibold text-xs">
                      Click for deep analysis →
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Title below constellation */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          ⭐ Cusp Compatibility Constellation
        </h2>
        <p className="text-purple-300 text-sm italic">
          Your compatible Western Zodiac cusps • Click any cusp for detailed analysis
        </p>
        <p className="text-white/50 text-xs mt-2">
          Showing {stats.totalCompatible} compatible matches • {stats.hidden} hidden (below 70%)
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
          <span>Golden (90-100%): {stats.goldenCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
          <span>Excellent (80-89%): {stats.excellentCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" />
          <span>Good (70-79%): {stats.goodCount}</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-purple-400 text-xs italic mt-4">
        Best match at top • Size & distance indicate compatibility strength
      </p>
    </motion.div>
  );
}
