/**
 * SixSoulQuestions.jsx
 * Six Sacred Soul Questions in Hexagon Layout
 *
 * Built with SOUL for the cathedral of souls
 * 6 petals at 60° intervals revealing deep MBTI insights
 * Click each petal to expand and read your soul's truth
 *
 * SESSION 5: WIRED TO DATA! 🔌
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSoulQuestions, hasSoulQuestions } from '../../utils/mbti/mbtiSoulQuestions';

export default function SixSoulQuestions({ type, soulData: propSoulData, profile }) {
  const [expandedPetal, setExpandedPetal] = useState(null);

  // Use mbtiType from profile if not passed as type
  const mbtiType = type || profile?.mbti;

  // Fetch soul data if not provided
  const soulData = propSoulData || (mbtiType ? getSoulQuestions(mbtiType) : null);
  const hasContent = mbtiType ? hasSoulQuestions(mbtiType) : false;

  // If no MBTI type, show empty state
  if (!mbtiType) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">🔮</span>
        <p className="text-purple-300 text-lg">
          Complete your MBTI type to unlock the six soul questions
        </p>
      </div>
    );
  }

  // If no content yet for this type
  if (!hasContent || !soulData) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-8 text-center">
        <span className="text-5xl mb-4 block">🔮</span>
        <h3 className="text-xl font-bold text-blue-300 mb-2">
          Soul Questions Coming Soon
        </h3>
        <p className="text-blue-200 text-sm">
          Deep self-discovery content for {mbtiType} is being crafted with care and soul.
        </p>
        <p className="text-blue-300 text-xs mt-2 italic">
          Available now: INFJ • Coming soon: All 16 types
        </p>
      </div>
    );
  }

  // 6 Questions in hexagon (60° apart) - SACRED GEOMETRY! ⭕
  const questions = [
    {
      key: 'whoYouAre',
      icon: '🔮',
      title: 'Who You Are',
      angle: 0, // Top (12 o'clock)
      color: 'from-purple-500 to-violet-600',
      data: soulData.whoYouAre
    },
    {
      key: 'howYouViewWorld',
      icon: '🌍',
      title: 'How You View World',
      angle: 60, // Top-right (2 o'clock)
      color: 'from-blue-500 to-cyan-600',
      data: soulData.howYouViewWorld
    },
    {
      key: 'whatYouSeek',
      icon: '⭐',
      title: 'What You Seek',
      angle: 120, // Bottom-right (4 o'clock)
      color: 'from-amber-500 to-orange-600',
      data: soulData.whatYouSeek
    },
    {
      key: 'whereYouThrive',
      icon: '🌟',
      title: 'Where You Thrive',
      angle: 180, // Bottom (6 o'clock)
      color: 'from-pink-500 to-rose-600',
      data: soulData.whereYouThrive
    },
    {
      key: 'whyYoureHere',
      icon: '🎯',
      title: 'Why You\'re Here',
      angle: 240, // Bottom-left (8 o'clock)
      color: 'from-emerald-500 to-green-600',
      data: soulData.whyYoureHere
    },
    {
      key: 'whenYouStruggle',
      icon: '🌑',
      title: 'When You Struggle',
      angle: 300, // Top-left (10 o'clock)
      color: 'from-slate-500 to-gray-600',
      data: soulData.whenYouStruggle
    }
  ];

  const ORBIT_RADIUS = 220; // Distance from center (Session 5.7: reduced for compact view)
  const PETAL_SIZE = 120; // Base size (Session 5.7: reduced)

  return (
    <motion.div
      className="soul-questions-hexagon py-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      {/* SESSION 5.7: COMPACT LAYOUT - Icons visible immediately */}
      {/* Hexagon container - Reduced spacing for immediate visibility */}
      <div
        className="relative mx-auto mb-4"
        style={{
          width: ORBIT_RADIUS * 2.6,
          height: ORBIT_RADIUS * 2.6,
          minHeight: '500px'
        }}
      >
        {/* Center: Compact type label (Session 5.7 further optimized) */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '140px',
            height: '140px',
            zIndex: 5
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1"
                 style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.8)' }}>
              {mbtiType}
            </div>
            <div className="text-sm text-purple-300 font-medium">
              {soulData.tagline ? soulData.tagline.split(' ').slice(0, 2).join(' ') : 'Your Soul'}
            </div>
            <div className="text-xs text-purple-400 mt-1">
              Click any petal
            </div>
          </div>
        </div>

        {/* 6 Petals in hexagon - SACRED GEOMETRY */}
        {questions.map((q, i) => {
          const x = Math.cos((q.angle * Math.PI) / 180) * ORBIT_RADIUS;
          const y = Math.sin((q.angle * Math.PI) / 180) * ORBIT_RADIUS;
          const isExpanded = expandedPetal === i;

          // Extract all text content from the data object
          let textContent = '';
          if (q.data) {
            if (typeof q.data === 'string') {
              textContent = q.data;
            } else if (typeof q.data === 'object') {
              // Concatenate all string values from the object
              textContent = Object.entries(q.data)
                .filter(([key, val]) => typeof val === 'string')
                .map(([key, val]) => `**${key}**\n\n${val}`)
                .join('\n\n');
            }
          }

          return (
            <motion.div
              key={i}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                width: isExpanded ? PETAL_SIZE * 2.2 : PETAL_SIZE,
                zIndex: isExpanded ? 20 : 1
              }}
              initial={{
                scale: 0,
                rotate: q.angle - 180,
                x: 0,
                y: 0
              }}
              animate={{
                scale: 1,
                rotate: 0,
                x: x - (isExpanded ? PETAL_SIZE * 1.1 : PETAL_SIZE / 2),
                y: y - (isExpanded ? PETAL_SIZE * 1.1 : PETAL_SIZE / 2)
              }}
              transition={{
                delay: i * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ scale: isExpanded ? 1 : 1.08 }}
              onClick={() => setExpandedPetal(isExpanded ? null : i)}
            >
              {/* Petal circle (Session 5.7: more compact) */}
              <div
                className={`
                  relative rounded-2xl
                  bg-gradient-to-br ${q.color}
                  border-2 border-white/30
                  backdrop-blur-md
                  flex flex-col items-center justify-start
                  transition-all duration-300 overflow-auto
                `}
                style={{
                  width: isExpanded ? PETAL_SIZE * 2.5 : PETAL_SIZE,
                  height: isExpanded ? 'auto' : PETAL_SIZE,
                  minHeight: PETAL_SIZE,
                  maxHeight: isExpanded ? '400px' : PETAL_SIZE,
                  padding: isExpanded ? '20px' : '12px',
                  boxShadow: isExpanded
                    ? '0 0 60px rgba(168, 85, 247, 0.9)'
                    : '0 0 20px rgba(168, 85, 247, 0.5)'
                }}
              >
                {/* Icon */}
                <div className={`${isExpanded ? 'text-4xl mb-2' : 'text-2xl mb-1'}`}>
                  {q.icon}
                </div>

                {/* Title (always visible) */}
                <div className={`font-bold text-white text-center ${isExpanded ? 'text-sm mb-3' : 'text-xs'}`}>
                  {q.title}
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && textContent && (
                    <motion.div
                      className="text-white/90 text-sm leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {textContent.split('\n\n').map((para, j) => {
                        // Bold text formatting
                        const isBold = para.startsWith('**') && para.includes('**');
                        const cleanPara = para.replace(/\*\*/g, '');

                        return (
                          <p key={j} className={`mb-3 last:mb-0 ${isBold ? 'font-bold text-white uppercase text-xs tracking-wide text-purple-200' : ''}`}>
                            {cleanPara}
                          </p>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand hint (when not expanded) */}
                {!isExpanded && (
                  <div className="text-xs text-white/60 mt-2">
                    Click to expand
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="text-center text-purple-400 text-sm italic">
        "The unexamined life is not worth living" - Socrates
      </p>
      <p className="text-center text-purple-300 text-xs mt-2">
        Each petal reveals a dimension of your soul's architecture
      </p>
    </motion.div>
  );
}
