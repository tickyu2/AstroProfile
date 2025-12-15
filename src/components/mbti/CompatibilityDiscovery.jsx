/**
 * CompatibilityDiscovery.jsx
 * Compatibility Constellation in Octagon Layout
 *
 * Built with SOUL for the cathedral of souls
 * 8 top matches in octagon (45° apart) surrounding user type
 * Click any match to see deep 5W+H+Soul analysis
 *
 * SESSION 5: WIRED TO DATA! 🔌
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCompatibilityAnalysis } from '../../utils/mbti/mbtiCompatibilityEngine';

export default function CompatibilityDiscovery({ userType, topMatches, onSelectMatch }) {
  const [hoveredMatch, setHoveredMatch] = useState(null);

  if (!userType) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">💕</span>
        <p className="text-purple-300 text-lg">
          Complete your MBTI type to discover compatibility
        </p>
      </div>
    );
  }

  // If no topMatches provided, show message
  if (!topMatches || topMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">💕</span>
        <p className="text-purple-300 text-lg">
          Loading compatibility data for {userType}...
        </p>
      </div>
    );
  }

  const BASE_ORBIT = 180; // Base orbit radius for BEST matches
  const MATCH_SIZE = 100; // Base size

  // SESSION 5.10: GOLDEN RATIO EXPANSION 🌀
  // "The less compatible, the further away and smaller you are"
  // Natural physics: Quality = Gravity pulling toward center!
  const getOrbitDistance = (score) => {
    // Golden ratio: φ ≈ 1.618
    const PHI = 1.618;
    
    if (score >= 95) {
      return BASE_ORBIT;  // Closest - Golden Pair
    } else if (score >= 90) {
      return BASE_ORBIT * 1.1;  // Very close
    } else if (score >= 85) {
      return BASE_ORBIT * 1.2;  // Close
    } else if (score >= 80) {
      return BASE_ORBIT * 1.35;  // Medium
    } else if (score >= 75) {
      return BASE_ORBIT * 1.5;  // Medium-far
    } else if (score >= 70) {
      return BASE_ORBIT * PHI;  // Golden ratio distance
    } else {
      return BASE_ORBIT * (PHI * 1.2);  // Furthest
    }
  };

  const getCircleSize = (score) => {
    // Size decreases with distance - visual hierarchy
    if (score >= 95) {
      return MATCH_SIZE * 1.4;  // Largest - Golden Pair
    } else if (score >= 90) {
      return MATCH_SIZE * 1.25;  // Very large
    } else if (score >= 85) {
      return MATCH_SIZE * 1.15;  // Large
    } else if (score >= 80) {
      return MATCH_SIZE * 1.0;  // Base size
    } else if (score >= 75) {
      return MATCH_SIZE * 0.9;  // Smaller
    } else if (score >= 70) {
      return MATCH_SIZE * 0.85;  // Smaller still
    } else {
      return MATCH_SIZE * 0.75;  // Smallest
    }
  };

  // SESSION 5.9: COLOR-CODED COMPATIBILITY TIERS
  // Brain recognizes instantly without thinking!
  const getCompatibilityColor = (score) => {
    if (score >= 90) {
      // 90-100%: Excellent (Golden/Amber)
      return {
        gradient: 'from-amber-400 via-yellow-500 to-amber-400',
        glow: 'rgba(251, 191, 36, 0.9)',
        lineColor: 'rgba(251, 191, 36, 0.6)'
      };
    } else if (score >= 80) {
      // 80-89%: Very Good (Pink/Purple)
      return {
        gradient: 'from-pink-500 to-purple-600',
        glow: 'rgba(236, 72, 153, 0.7)',
        lineColor: 'rgba(236, 72, 153, 0.5)'
      };
    } else if (score >= 70) {
      // 70-79%: Good (Blue/Cyan)
      return {
        gradient: 'from-blue-500 to-cyan-600',
        glow: 'rgba(59, 130, 246, 0.7)',
        lineColor: 'rgba(59, 130, 246, 0.5)'
      };
    } else {
      // Below 70%: Okay (Cool gray/slate)
      return {
        gradient: 'from-slate-500 to-gray-600',
        glow: 'rgba(100, 116, 139, 0.6)',
        lineColor: 'rgba(100, 116, 139, 0.4)'
      };
    }
  };

  // SESSION 5.9: TOP MATCH AT TOP (270°), then clockwise
  // Natural reading: Best → Good → Okay (top to bottom, left to right)
  // Starting at TOP (270°), rotating clockwise: 270, 315, 0, 45, 90, 135, 180, 225
  const angles = [270, 315, 0, 45, 90, 135, 180, 225];

  return (
    <motion.div
      className="compatibility-octagon py-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: '-100px' }}  // SESSION 5.10: Center constellation in viewport
    >
      {/* SESSION 5.10: GOLDEN RATIO EXPANDING SHELL */}
      {/* Container sized for furthest orbit */}
      <div
        className="relative mx-auto mb-2"
        style={{
          width: BASE_ORBIT * 2 * 2.2,  // Account for furthest orbit
          height: BASE_ORBIT * 2 * 2.4,
          minHeight: '700px'
        }}
      >
        {/* Connection lines - CENTER TO CENTER in PIXEL coordinates */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ 
            opacity: 0.6,
            zIndex: 1,  // Under circles
            width: '100%',
            height: '100%'
          }}
        >
          {topMatches.slice(0, 8).map((match, i) => {
            const angle = angles[i];
            const analysis = getCompatibilityAnalysis(userType, match.type);
            const score = analysis.score;
            const orbitDistance = getOrbitDistance(score);
            const colors = getCompatibilityColor(score);
            
            // Container dimensions
            const containerWidth = BASE_ORBIT * 2 * 2.2;
            const containerHeight = BASE_ORBIT * 2 * 2.4;
            
            // Center of container (where circles are positioned from)
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            
            // Direction vector
            const dx = Math.cos((angle * Math.PI) / 180);
            const dy = Math.sin((angle * Math.PI) / 180);
            
            // Outer circle center (same calculation as circles use)
            const x2 = centerX + dx * orbitDistance;
            const y2 = centerY + dy * orbitDistance;

            return (
              <line
                key={i}
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

        {/* Center: User type - AFTER lines so it renders ON TOP */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5
          }}
        >
          <div
            className="
              w-36 h-36 rounded-full
              bg-gradient-to-br from-purple-600 to-pink-600
              border-4 border-white/50
              flex items-center justify-center
              shadow-lg shadow-purple-500/50
            "
            style={{
              boxShadow: '0 0 50px rgba(168, 85, 247, 0.8)'
            }}
          >
            <div className="text-center">
              <div className="text-4xl font-black text-white">
                {userType}
              </div>
              <div className="text-xs text-white/80 font-medium mt-1">
                YOU
              </div>
            </div>
          </div>
        </div>

        {/* 8 Matches - GOLDEN RATIO EXPANSION 🌀 */}
        {topMatches.slice(0, 8).map((match, i) => {
          const angle = angles[i];
          const analysis = getCompatibilityAnalysis(userType, match.type);
          const score = analysis.score;
          const orbitDistance = getOrbitDistance(score);
          const circleSize = getCircleSize(score);
          const colors = getCompatibilityColor(score);
          const isTopTier = score >= 90;
          const isHovered = hoveredMatch === i;
          
          // Calculate position with individual orbit distance
          const x = Math.cos((angle * Math.PI) / 180) * orbitDistance;
          const y = Math.sin((angle * Math.PI) / 180) * orbitDistance;

          return (
            <motion.div
              key={match.type}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                zIndex: isHovered ? 20 : 10  // Above lines (z:0) and center (z:5)
              }}
              initial={{
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{
                scale: 1,
                x: x - circleSize / 2,
                // Floating effect - gentle up/down oscillation
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
                // Floating animation
                y: {
                  duration: 2 + (i * 0.3),  // Different speeds for each
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.15, y: y - circleSize / 2 }}  // Stop floating on hover
              onHoverStart={() => setHoveredMatch(i)}
              onHoverEnd={() => setHoveredMatch(null)}
              onClick={() => onSelectMatch && onSelectMatch(match.type)}
            >
              {/* Match circle - COLOR-CODED */}
              <div
                className={`
                  relative rounded-full
                  bg-gradient-to-br ${colors.gradient}
                  border-3 border-white/40
                  flex flex-col items-center justify-center
                  transition-all duration-300
                  backdrop-blur-md
                `}
                style={{
                  width: circleSize,
                  height: circleSize,
                  boxShadow: isHovered
                    ? `0 0 50px ${colors.glow}`
                    : `0 0 25px ${colors.glow}`
                }}
              >
                {/* Top Tier crown (90%+) */}
                {isTopTier && i === 0 && (
                  <div className="absolute -top-8 text-3xl animate-pulse">
                    👑
                  </div>
                )}

                {/* Type - scaled with circle size */}
                <div 
                  className="font-black text-white"
                  style={{
                    fontSize: `${circleSize / 5}px`  // Proportional to circle
                  }}
                >
                  {match.type}
                </div>

                {/* Score - scaled with circle size */}
                <div 
                  className="font-bold text-white/90 mt-1"
                  style={{
                    fontSize: `${circleSize / 8}px`  // Smaller, proportional
                  }}
                >
                  {score}%
                </div>

                {/* Top Tier label (first match only if 90%+) */}
                {isTopTier && i === 0 && score >= 95 && (
                  <div className="absolute -bottom-8 text-xs font-bold text-amber-400 whitespace-nowrap">
                    Golden Pair
                  </div>
                )}

                {/* Rank badge - color-coded by tier */}
                <div
                  className={`
                    absolute -top-2 -right-2
                    w-6 h-6 rounded-full
                    ${score >= 90 ? 'bg-amber-500' : 
                      score >= 80 ? 'bg-pink-600' : 
                      score >= 70 ? 'bg-blue-600' : 'bg-slate-600'}
                    border-2 border-white
                    flex items-center justify-center
                    text-white text-xs font-bold
                  `}
                >
                  #{i + 1}
                </div>
              </div>

              {/* Hover info card */}
              {isHovered && (
                <motion.div
                  className="
                    absolute top-full mt-6 left-1/2 -translate-x-1/2
                    bg-slate-900/95 border border-purple-500/50
                    rounded-xl p-4 min-w-[220px]
                    backdrop-blur-md
                    shadow-xl
                  "
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ zIndex: 30 }}
                >
                  <div className="text-white text-sm text-center">
                    <div className="font-bold text-lg mb-2">
                      {match.name || match.type}
                    </div>
                    <div className="text-white/70 text-xs mb-3">
                      {match.description || 'Soul-compatible type'}
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

      {/* SESSION 5.7: Title BELOW constellation */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          💕 Compatibility Constellation
        </h2>
        <p className="text-purple-300 text-sm italic">
          Your soul-compatible types • Click any type for deep 5W+H+Soul analysis
        </p>
      </div>

      {/* Legend - COLOR-CODED TIERS */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
          <span>Excellent (90-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
          <span>Very Good (80-89%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" />
          <span>Good (70-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-slate-500 to-gray-600" />
          <span>Okay (&lt;70%)</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-purple-400 text-xs italic mt-4">
        Best match at top • Colors help your brain recognize quality instantly
      </p>
    </motion.div>
  );
}
