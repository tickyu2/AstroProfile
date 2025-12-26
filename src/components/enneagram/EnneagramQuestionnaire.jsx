/**
 * EnneagramQuestionnaire Component
 *
 * 18-question personality assessment with 1-5 Likert scale.
 * Calculates Enneagram scores and determines dominant type, wing, and tritype.
 *
 * Features:
 *   - Progress indicator
 *   - Responsive rating buttons
 *   - Real-time score preview
 *   - Alchemical styling
 *   - Save to profile on completion
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ENNEAGRAM_QUESTIONS,
  ENNEAGRAM_TYPES,
  calculateEnneagramScores
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Calculate current scores for preview
  const currentScores = calculateEnneagramScores(answers);

  // Progress calculation
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / ENNEAGRAM_QUESTIONS.length) * 100);
  const isComplete = answeredCount === ENNEAGRAM_QUESTIONS.length;

  // Handle rating selection
  const handleRate = useCallback((questionId, rating) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));

    // Auto-advance to next question after a brief delay
    if (currentQuestion < ENNEAGRAM_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    }
  }, [currentQuestion]);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (!isComplete) return;

    const result = calculateEnneagramScores(answers);
    // Pass both the calculated result and raw answers
    onComplete(result, answers);
  }, [answers, isComplete, onComplete]);

  // Get current question
  const question = ENNEAGRAM_QUESTIONS[currentQuestion];
  const typeData = ENNEAGRAM_TYPES[question.type];

  return (
    <div className={`space-y-6 ${alchemical ? 'alchemical' : 'contemplative'}`}>
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-cyan-300 flex items-center gap-2">
            <span className="text-xl">⚗️</span>
            Soul Discovery Journey
          </h3>
          <p className="text-xs text-white/50 mt-1">
            How much does each statement sound like you? (1 = Not Me → 5 = Very Much Me)
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="text-right">
            <div className="text-xs text-white/50">Progress</div>
            <div className="text-sm font-medium text-cyan-400">
              {answeredCount} / {ENNEAGRAM_QUESTIONS.length}
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

          {/* Preview toggle */}
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
        {ENNEAGRAM_QUESTIONS.map((q, idx) => {
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
        })}
      </div>

      {/* Current question card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 rounded-xl border border-purple-500/20 p-6"
      >
        {/* Question number and type indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${typeData.color}33`, color: typeData.color }}
            >
              {currentQuestion + 1}
            </span>
            {/* Brain focus tag */}
            {question.brainFocus && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {question.brainFocus}
              </span>
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
              onClick={() => setCurrentQuestion(Math.min(ENNEAGRAM_QUESTIONS.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === ENNEAGRAM_QUESTIONS.length - 1}
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
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">💡</span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400/70">Example</span>
                <p className="text-sm text-amber-200/80 leading-relaxed mt-1">
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
              const isSelected = answers[question.id] === rating;

              return (
                <motion.button
                  key={rating}
                  onClick={() => handleRate(question.id, rating)}
                  className={`
                    flex-1 py-3 rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? 'text-white shadow-lg'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? typeData.color : undefined,
                    boxShadow: isSelected ? `0 0 20px ${typeData.color}50` : undefined
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
        {answers[question.id] && (
          <div className="mt-4 text-center text-xs text-white/50">
            Your answer: <span className="text-cyan-400 font-medium">{RATING_LABELS[answers[question.id]]}</span>
          </div>
        )}
      </motion.div>

      {/* Submit button */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`
            px-8 py-3 rounded-xl text-sm font-medium transition-all
            flex items-center gap-2
            ${isComplete
              ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow-lg hover:shadow-amber-500/25'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
          whileHover={isComplete ? { scale: 1.02 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
        >
          <span className="text-lg">⚗️</span>
          <span>Reveal My SoulPrint</span>
        </motion.button>
      </div>

      {/* Incomplete message */}
      {!isComplete && (
        <p className="text-center text-xs text-white/40">
          Answer all {ENNEAGRAM_QUESTIONS.length} questions to reveal your Enneagram type
        </p>
      )}
    </div>
  );
}
