/**
 * SoulQuestionsPanel Component
 *
 * Displays deep self-reflection questions based on the user's Enneagram type.
 * These are open-ended narrative prompts for journaling or guided conversation.
 *
 * Features:
 *   - 3 questions per type with follow-up prompts
 *   - Category labels (e.g., INTEGRITY, INNER CRITIC)
 *   - Expandable question cards
 *   - Placeholder for future response storage
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * Created: December 26, 2024 (Priority 3)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOUL_QUESTIONS_BY_TYPE, ENNEAGRAM_TYPES } from './enneagramData';

export default function SoulQuestionsPanel({ dominantType }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Get questions for this type
  const typeQuestions = SOUL_QUESTIONS_BY_TYPE[dominantType];
  const typeData = ENNEAGRAM_TYPES[dominantType];

  if (!typeQuestions) {
    return (
      <div className="text-center text-white/40 py-8">
        Soul questions not available for this type.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <span>🌹</span>
          {typeQuestions.title}
        </h3>
        <p className="text-white/50 text-sm">
          Deep reflection prompts to explore your inner landscape
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {typeQuestions.questions.map((q, idx) => {
          const isExpanded = expandedQuestion === q.id;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
            >
              {/* Question Header */}
              <button
                onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                className="w-full p-4 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
              >
                {/* Number badge */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${typeData.color}30`,
                    color: typeData.color
                  }}
                >
                  {idx + 1}
                </div>

                <div className="flex-1">
                  {/* Category */}
                  <div
                    className="text-[10px] uppercase tracking-wider mb-1 font-medium"
                    style={{ color: typeData.color }}
                  >
                    {q.category}
                  </div>

                  {/* Main question */}
                  <p className="text-white/90 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Expand indicator */}
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/40 flex-shrink-0"
                >
                  ▼
                </motion.span>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      {/* Purpose */}
                      <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                        <div className="text-[10px] uppercase tracking-wider text-purple-400 mb-1">
                          Purpose
                        </div>
                        <p className="text-sm text-white/70">
                          {q.purpose}
                        </p>
                      </div>

                      {/* Follow-up questions */}
                      <div>
                        <div className="text-xs text-white/40 mb-2">
                          Go deeper with these follow-ups:
                        </div>
                        <div className="space-y-2">
                          {q.followUps.map((followUp, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span
                                className="text-xs mt-0.5"
                                style={{ color: typeData.color }}
                              >
                                →
                              </span>
                              <span className="text-white/70">{followUp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Placeholder for future journaling */}
                      <div className="bg-white/5 rounded-lg p-4 border border-dashed border-white/20">
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <span>📝</span>
                          <span>Journaling feature coming soon...</span>
                        </div>
                        <p className="text-xs text-white/30 mt-2">
                          For now, use these prompts for personal reflection or share with your SoulPartner.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className="text-center text-xs text-white/30 pt-4 border-t border-white/5">
        <p>
          💡 These questions are designed for deep self-exploration.
          Take your time — there are no right or wrong answers.
        </p>
      </div>
    </div>
  );
}
