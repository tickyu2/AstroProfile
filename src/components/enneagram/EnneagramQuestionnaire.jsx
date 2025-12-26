/**
 * EnneagramQuestionnaire Component
 *
 * 18 type questions + 6 instinctual variant questions with 1-5 Likert scale.
 * Calculates Enneagram type, wing, tritype, AND instinctual variant (sp/sx/so).
 *
 * Features:
 *   - Two-phase assessment (Type → Instinct)
 *   - Progress indicator
 *   - Responsive rating buttons
 *   - Real-time score preview
 *   - Alchemical styling
 *   - Save to profile on completion
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * Enhanced: December 26, 2024 (Priority 2 - Instinctual Variants)
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ENNEAGRAM_QUESTIONS,
  ENNEAGRAM_TYPES,
  INSTINCT_QUESTIONS,
  INSTINCTUAL_VARIANTS,
  calculateEnneagramScores,
  calculateInstinctualVariant
} from './enneagramData';
import EnneagramAlchemicalRose from './EnneagramAlchemicalRose';

// Rating labels (simpler, more relatable)
const RATING_LABELS = {
  1: 'Not Like Me',
  2: 'A Little Like Me',
  3: 'Sometimes Like Me',
  4: 'Like Me',
  5: 'Very Much Like Me'
};

export default function EnneagramQuestionnaire({ onComplete, alchemical = true }) {
  const [answers, setAnswers] = useState({});
  const [instinctAnswers, setInstinctAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [phase, setPhase] = useState('type'); // 'type' or 'instinct'

  // Calculate current scores for preview
  const currentScores = calculateEnneagramScores(answers);

  // All questions combined
  const allTypeQuestions = ENNEAGRAM_QUESTIONS;
  const allInstinctQuestions = INSTINCT_QUESTIONS;
  const totalQuestions = allTypeQuestions.length + allInstinctQuestions.length;

  // Progress calculation - now includes both phases
  const typeAnsweredCount = Object.keys(answers).length;
  const instinctAnsweredCount = Object.keys(instinctAnswers).length;
  const totalAnsweredCount = typeAnsweredCount + instinctAnsweredCount;
  const progressPercent = Math.round((totalAnsweredCount / totalQuestions) * 100);

  const isTypeComplete = typeAnsweredCount === allTypeQuestions.length;
  const isInstinctComplete = instinctAnsweredCount === allInstinctQuestions.length;
  const isFullyComplete = isTypeComplete && isInstinctComplete;

  // Handle rating selection for type questions
  const handleTypeRate = useCallback((questionId, rating) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));

    // Auto-advance to next question after a brief delay
    if (currentQuestion < allTypeQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    }
  }, [currentQuestion, allTypeQuestions.length]);

  // Handle rating selection for instinct questions
  const handleInstinctRate = useCallback((questionId, rating) => {
    setInstinctAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));

    // Auto-advance to next question after a brief delay
    if (currentQuestion < allInstinctQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    }
  }, [currentQuestion, allInstinctQuestions.length]);

  // Transition to instinct phase
  const handleProceedToInstinct = useCallback(() => {
    setPhase('instinct');
    setCurrentQuestion(0);
  }, []);

  // Handle final submission
  const handleSubmit = useCallback(() => {
    if (!isFullyComplete) return;

    // Calculate type result
    const typeResult = calculateEnneagramScores(answers);

    // Calculate instinctual variant
    const instinctResult = calculateInstinctualVariant(instinctAnswers);

    // Combine results
    const fullResult = {
      ...typeResult,
      instinctualVariant: instinctResult.dominant,
      instinctStack: instinctResult.stack,
      instinctScores: instinctResult.scores,
      // Full subtype notation: e.g., "4w5 sp" or "4w5 sx/sp/so"
      subtype: `${typeResult.dominantType}-${instinctResult.dominant}`
    };

    // Pass both the calculated result and all raw answers
    onComplete(fullResult, { ...answers, ...instinctAnswers });
  }, [answers, instinctAnswers, isFullyComplete, onComplete]);

  // Get current question based on phase
  const question = phase === 'type'
    ? allTypeQuestions[currentQuestion]
    : allInstinctQuestions[currentQuestion];

  const typeData = phase === 'type'
    ? ENNEAGRAM_TYPES[question.type]
    : null;

  const variantData = phase === 'instinct'
    ? INSTINCTUAL_VARIANTS[question.variant]
    : null;

  return (
    <div className={`space-y-6 ${alchemical ? 'alchemical' : 'contemplative'}`}>
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-cyan-300 flex items-center gap-2">
            <span className="text-xl">{phase === 'type' ? '⚗️' : '🔮'}</span>
            {phase === 'type' ? 'Soul Discovery Journey' : 'Instinctual Drives'}
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {phase === 'type'
              ? 'How much does each statement sound like you? (1 = Not Me → 5 = Very Much Me)'
              : 'These final 6 questions reveal your instinctual focus'
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Phase indicator */}
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded text-xs ${phase === 'type' ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/40'}`}>
              Type
            </span>
            <span className="text-white/20">→</span>
            <span className={`px-2 py-0.5 rounded text-xs ${phase === 'instinct' ? 'bg-pink-500/30 text-pink-300' : 'bg-white/10 text-white/40'}`}>
              Instinct
            </span>
          </div>

          {/* Progress indicator */}
          <div className="text-right">
            <div className="text-xs text-white/50">Progress</div>
            <div className="text-sm font-medium text-cyan-400">
              {totalAnsweredCount} / {totalQuestions}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Preview toggle (only in type phase) */}
          {phase === 'type' && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${showPreview
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                }
              `}
            >
              {showPreview ? '📊 Hide Preview' : '👁️ Preview'}
            </button>
          )}
        </div>
      </div>

      {/* Preview rose (collapsible) */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex justify-center py-4 bg-indigo-950/30 rounded-xl border border-purple-500/20">
              <EnneagramAlchemicalRose
                scores={currentScores.scores}
                dominantType={answeredCount >= 6 ? currentScores.dominantType : null}
                alchemical={alchemical}
                size={200}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question navigation dots */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {phase === 'type' ? (
          // Type questions dots
          allTypeQuestions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentQuestion;
            const qTypeData = ENNEAGRAM_TYPES[q.type];

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`
                  w-6 h-6 rounded-full text-[10px] font-medium transition-all
                  ${isCurrent
                    ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                    : ''
                  }
                  ${isAnswered
                    ? 'text-white'
                    : 'bg-white/10 text-white/30'
                  }
                `}
                style={{
                  backgroundColor: isAnswered ? qTypeData.color : undefined,
                  ringColor: isCurrent ? qTypeData.color : undefined
                }}
                title={`Q${idx + 1}: ${q.shortText}`}
              >
                {idx + 1}
              </button>
            );
          })
        ) : (
          // Instinct questions dots
          allInstinctQuestions.map((q, idx) => {
            const isAnswered = instinctAnswers[q.id] !== undefined;
            const isCurrent = idx === currentQuestion;
            const vData = INSTINCTUAL_VARIANTS[q.variant];

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`
                  w-8 h-8 rounded-full text-sm font-medium transition-all flex items-center justify-center
                  ${isCurrent
                    ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                    : ''
                  }
                  ${isAnswered
                    ? 'text-white'
                    : 'bg-white/10 text-white/30'
                  }
                `}
                style={{
                  backgroundColor: isAnswered ? vData.color : undefined,
                  ringColor: isCurrent ? vData.color : undefined
                }}
                title={`${vData.name}: ${q.shortText}`}
              >
                {vData.icon}
              </button>
            );
          })
        )}
      </div>

      {/* Current question card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`rounded-xl border p-6 ${
          phase === 'type'
            ? 'bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border-purple-500/20'
            : 'bg-gradient-to-br from-pink-950/30 to-purple-950/30 border-pink-500/20'
        }`}
      >
        {/* Question number and type/variant indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {phase === 'type' ? (
              <>
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: `${typeData.color}33`, color: typeData.color }}
                >
                  {currentQuestion + 1}
                </span>
                {question.brainFocus && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {question.brainFocus}
                  </span>
                )}
              </>
            ) : (
              <>
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${variantData.color}33` }}
                >
                  {variantData.icon}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] border"
                  style={{
                    backgroundColor: `${variantData.color}20`,
                    borderColor: `${variantData.color}40`,
                    color: variantData.color
                  }}
                >
                  {variantData.name}
                </span>
              </>
            )}
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-2 py-1 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentQuestion(Math.min(
                (phase === 'type' ? allTypeQuestions.length : allInstinctQuestions.length) - 1,
                currentQuestion + 1
              ))}
              disabled={currentQuestion === (phase === 'type' ? allTypeQuestions.length : allInstinctQuestions.length) - 1}
              className="px-2 py-1 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>

        {/* Question text */}
        <p className="text-lg text-white/90 leading-relaxed mb-3">
          "{question.text}"
        </p>

        {/* Scenario example */}
        {question.scenario && (
          <div className={`mb-6 p-3 rounded-lg border ${
            phase === 'type'
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-pink-500/10 border-pink-500/20'
          }`}>
            <div className="flex items-start gap-2">
              <span className={phase === 'type' ? 'text-amber-400' : 'text-pink-400'}>💡</span>
              <div>
                <span className={`text-[10px] uppercase tracking-wider ${
                  phase === 'type' ? 'text-amber-400/70' : 'text-pink-400/70'
                }`}>Example</span>
                <p className={`text-sm leading-relaxed mt-1 ${
                  phase === 'type' ? 'text-amber-200/80' : 'text-pink-200/80'
                }`}>
                  {question.scenario}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rating buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            {[1, 2, 3, 4, 5].map((rating) => {
              const currentAnswers = phase === 'type' ? answers : instinctAnswers;
              const isSelected = currentAnswers[question.id] === rating;
              const colorToUse = phase === 'type' ? typeData?.color : variantData?.color;

              return (
                <motion.button
                  key={rating}
                  onClick={() => phase === 'type'
                    ? handleTypeRate(question.id, rating)
                    : handleInstinctRate(question.id, rating)
                  }
                  className={`
                    flex-1 py-3 rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? 'text-white shadow-lg'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? colorToUse : undefined,
                    boxShadow: isSelected ? `0 0 20px ${colorToUse}50` : undefined
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {rating}
                </motion.button>
              );
            })}
          </div>

          {/* Rating labels */}
          <div className="flex items-center justify-between text-[10px] text-white/40 px-1">
            <span>Not Like Me</span>
            <span>Sometimes</span>
            <span>Very Much Like Me</span>
          </div>
        </div>

        {/* Current answer indicator */}
        {(phase === 'type' ? answers[question.id] : instinctAnswers[question.id]) && (
          <div className="mt-4 text-center text-xs text-white/50">
            Your answer: <span className="text-cyan-400 font-medium">
              {RATING_LABELS[phase === 'type' ? answers[question.id] : instinctAnswers[question.id]]}
            </span>
          </div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center">
        {phase === 'type' ? (
          // Type phase: Show "Continue to Instincts" or keep answering
          <motion.button
            onClick={handleProceedToInstinct}
            disabled={!isTypeComplete}
            className={`
              px-8 py-3 rounded-xl text-sm font-medium transition-all
              flex items-center gap-2
              ${isTypeComplete
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-pink-500/25'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
            whileHover={isTypeComplete ? { scale: 1.02 } : {}}
            whileTap={isTypeComplete ? { scale: 0.98 } : {}}
          >
            <span className="text-lg">🔮</span>
            <span>Continue to Instincts</span>
            <span className="text-lg">→</span>
          </motion.button>
        ) : (
          // Instinct phase: Show final submit
          <motion.button
            onClick={handleSubmit}
            disabled={!isFullyComplete}
            className={`
              px-8 py-3 rounded-xl text-sm font-medium transition-all
              flex items-center gap-2
              ${isFullyComplete
                ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow-lg hover:shadow-amber-500/25'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
            whileHover={isFullyComplete ? { scale: 1.02 } : {}}
            whileTap={isFullyComplete ? { scale: 0.98 } : {}}
          >
            <span className="text-lg">⚗️</span>
            <span>Reveal My Complete SoulPrint</span>
          </motion.button>
        )}
      </div>

      {/* Phase-specific messages */}
      {phase === 'type' && !isTypeComplete && (
        <p className="text-center text-xs text-white/40">
          Answer all {allTypeQuestions.length} questions to continue
        </p>
      )}

      {phase === 'instinct' && !isInstinctComplete && (
        <p className="text-center text-xs text-white/40">
          Answer all 6 instinct questions to reveal your complete SoulPrint
        </p>
      )}

      {/* Type completion celebration (shown when transitioning) */}
      {phase === 'type' && isTypeComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20"
        >
          <p className="text-purple-300 text-sm">
            🎉 Type assessment complete! You're a <strong>Type {currentScores.dominantType}w{currentScores.wing}</strong>
          </p>
          <p className="text-white/50 text-xs mt-1">
            Now let's discover your instinctual variant for the complete picture.
          </p>
        </motion.div>
      )}

      {/* Back to type questions link (in instinct phase) */}
      {phase === 'instinct' && (
        <button
          onClick={() => { setPhase('type'); setCurrentQuestion(0); }}
          className="mx-auto block text-xs text-white/40 hover:text-white/60 transition-colors"
        >
          ← Back to type questions
        </button>
      )}
    </div>
  );
}
