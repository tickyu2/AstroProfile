/**
 * PracticeMode Component
 * The ritual learning loop — XP, streaks, adaptive difficulty
 * Transforms the Academy into a living, responsive game
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  PracticeScore,
  AnswerResult,
  MasteryTier,
  DifficultyLevel,
  createInitialScore,
  applyAnswer,
  getDifficulty,
  getAdaptiveDifficulty,
  getDifficultyLabel,
  getMasteryTierFromScore,
  getMasteryTierInfo,
  getSessionSummary,
  getLevelProgress,
  saveScore,
  loadScore,
  clearScore
} from './scoring';
import { PracticeQuestion as UnifiedQuestion, QuestionFamily } from './types';
import { generateAdaptiveQuestion, generateStreakAwareQuestion, FocusCategory, generateFocusedQuestion } from './adaptiveGenerator';

// ============================================================================
// Types
// ============================================================================

export interface PracticeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: DifficultyLevel;
  family?: QuestionFamily;
}

export interface PracticeModeProps {
  /** Custom question generator (optional - uses adaptive generator by default) */
  generateQuestion?: (difficulty?: DifficultyLevel) => PracticeQuestion;
  /** Use built-in adaptive generator */
  useAdaptive?: boolean;
  /** Focus on specific category */
  focusCategory?: FocusCategory;
  title?: string;
  onComplete?: (score: PracticeScore) => void;
  maxQuestions?: number;
  className?: string;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * XP and Level Display
 */
const XpDisplay: React.FC<{ score: PracticeScore }> = ({ score }) => {
  const progress = getLevelProgress(score.xp);

  return (
    <div className="xp-display bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-amber-400 font-semibold">Level {score.level}</span>
        <span className="text-purple-300 font-bold">{score.xp} XP</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <div className="text-xs text-slate-500 mt-1 text-right">
        {progress.current} / {progress.required} to next level
      </div>
    </div>
  );
};

/**
 * Streak Display with animation
 */
const StreakDisplay: React.FC<{
  streak: number;
  maxStreak: number;
  isNewRecord?: boolean;
}> = ({ streak, maxStreak, isNewRecord }) => {
  return (
    <div className={`streak-display text-center ${streak > 0 ? 'anim-streak-pulse' : ''}`}>
      <div className="text-4xl font-bold text-amber-400">
        {streak}
        {streak >= 5 && <span className="text-xl ml-1">🔥</span>}
      </div>
      <div className="text-sm text-slate-400">Current Streak</div>
      {isNewRecord && streak > 0 && (
        <div className="text-xs text-purple-400 mt-1">New Record!</div>
      )}
      <div className="text-xs text-slate-500 mt-1">Best: {maxStreak}</div>
    </div>
  );
};

/**
 * Mastery Tier Badge
 */
const MasteryBadge: React.FC<{ tier: MasteryTier; streak: number }> = ({ tier, streak }) => {
  const info = getMasteryTierInfo(tier);

  return (
    <div
      className={`mastery-badge mastery-${tier} rounded-lg p-3 text-center`}
      style={{ borderColor: info.color }}
    >
      <div className="text-2xl mb-1">{info.emoji}</div>
      <div className="font-semibold" style={{ color: info.color }}>
        {info.label}
      </div>
      {info.nextTier && (
        <div className="text-xs text-slate-500 mt-1">
          {info.streakRequired! - streak} more to {getMasteryTierInfo(info.nextTier).label}
        </div>
      )}
    </div>
  );
};

/**
 * Difficulty Indicator
 */
const DifficultyIndicator: React.FC<{ difficulty: DifficultyLevel }> = ({ difficulty }) => {
  const colors: Record<DifficultyLevel, string> = {
    1: 'text-slate-400',
    2: 'text-blue-400',
    3: 'text-purple-400',
    4: 'text-amber-400'
  };

  return (
    <div className={`difficulty-indicator ${colors[difficulty]}`}>
      <span className="text-xs uppercase tracking-wide">
        {getDifficultyLabel(difficulty)}
      </span>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`w-2 h-2 rounded-full ${
              level <= difficulty ? 'bg-current' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Answer Feedback Overlay
 */
const AnswerFeedback: React.FC<{
  result: AnswerResult | null;
  explanation?: string;
  onContinue: () => void;
}> = ({ result, explanation, onContinue }) => {
  if (!result) return null;

  return (
    <div
      className={`answer-feedback fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
        result.isCorrect ? 'anim-correct-flash' : 'anim-incorrect-shake'
      }`}
      onClick={onContinue}
    >
      <div className="bg-slate-800 rounded-xl p-6 max-w-md mx-4 border border-slate-700">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">
            {result.isCorrect ? '✅' : '❌'}
          </div>
          <h3 className={`text-xl font-bold ${result.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {result.isCorrect ? 'Correct!' : 'Not Quite'}
          </h3>
        </div>

        {result.isCorrect && (
          <div className="xp-breakdown bg-slate-900/50 rounded-lg p-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Base XP:</span>
              <span className="text-purple-300">+{result.xpEarned - result.streakBonus - result.difficultyBonus}</span>
            </div>
            {result.streakBonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Streak Bonus:</span>
                <span className="text-amber-300">+{result.streakBonus}</span>
              </div>
            )}
            {result.difficultyBonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Difficulty Bonus:</span>
                <span className="text-cyan-300">+{result.difficultyBonus}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t border-slate-700">
              <span className="text-slate-300">Total:</span>
              <span className="text-emerald-400">+{result.xpEarned} XP</span>
            </div>
          </div>
        )}

        {explanation && (
          <p className="text-sm text-slate-400 mb-4 italic">
            {explanation}
          </p>
        )}

        <button
          onClick={onContinue}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

/**
 * Session Summary Modal
 */
const SessionSummaryModal: React.FC<{
  score: PracticeScore;
  startingXp: number;
  onRestart: () => void;
  onExit: () => void;
}> = ({ score, startingXp, onRestart, onExit }) => {
  const summary = getSessionSummary(score, startingXp);
  const tierInfo = getMasteryTierInfo(summary.masteryTier);

  return (
    <div className="session-summary fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md mx-4 border border-slate-700">
        <h2 className="text-2xl font-serif text-amber-200 text-center mb-6">
          Session Complete
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{summary.xpGained}</div>
            <div className="text-xs text-slate-500">XP Earned</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{summary.accuracy}%</div>
            <div className="text-xs text-slate-500">Accuracy</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{summary.maxStreak}</div>
            <div className="text-xs text-slate-500">Best Streak</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-cyan-400">{summary.total}</div>
            <div className="text-xs text-slate-500">Questions</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{tierInfo.emoji}</div>
          <div className="font-semibold" style={{ color: tierInfo.color }}>
            {tierInfo.label} Achieved
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 font-medium transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const PracticeMode: React.FC<PracticeModeProps> = ({
  generateQuestion: customGenerator,
  useAdaptive = true,
  focusCategory,
  title = 'Practice Mode',
  onComplete,
  maxQuestions,
  className = ''
}) => {
  // State
  const [score, setScore] = useState<PracticeScore>(() => loadScore() || createInitialScore());
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [recentAnswers, setRecentAnswers] = useState<boolean[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [startingXp] = useState(score.xp);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState(true);

  // Get current difficulty
  const difficulty = getAdaptiveDifficulty(score, recentAnswers);

  // Unified question generator
  const getNextQuestion = useCallback((): PracticeQuestion => {
    // Priority: custom generator > focus category > adaptive
    if (customGenerator) {
      return customGenerator(difficulty);
    }
    if (focusCategory) {
      return generateFocusedQuestion(focusCategory) as PracticeQuestion;
    }
    if (useAdaptive) {
      return generateStreakAwareQuestion(score, lastWasCorrect) as PracticeQuestion;
    }
    return generateAdaptiveQuestion(score) as PracticeQuestion;
  }, [customGenerator, focusCategory, useAdaptive, score, difficulty, lastWasCorrect]);

  // Generate first question
  useEffect(() => {
    if (!question) {
      setQuestion(getNextQuestion());
    }
  }, [getNextQuestion, question]);

  // Handle answer selection
  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer || !question) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === question.correctAnswer;

    const { score: newScore, result } = applyAnswer(score, isCorrect, difficulty);

    // Check for new record
    if (newScore.maxStreak > score.maxStreak) {
      setIsNewRecord(true);
    }

    setScore(newScore);
    setLastResult(result);
    setLastWasCorrect(isCorrect);
    setRecentAnswers(prev => [...prev.slice(-9), isCorrect]);

    // Auto-save progress
    saveScore(newScore);

    // Check for session end
    if (maxQuestions && newScore.totalQuestions >= maxQuestions) {
      setTimeout(() => setShowSummary(true), 1500);
    }
  }, [selectedAnswer, question, score, difficulty, maxQuestions]);

  // Continue to next question
  const handleContinue = useCallback(() => {
    setSelectedAnswer(null);
    setLastResult(null);
    setIsNewRecord(false);
    setQuestion(getNextQuestion());
  }, [getNextQuestion]);

  // Restart session
  const handleRestart = useCallback(() => {
    clearScore();
    const newScore = createInitialScore();
    setScore(newScore);
    setRecentAnswers([]);
    setShowSummary(false);
    setLastWasCorrect(true);
    setQuestion(null); // Will trigger regeneration
  }, []);

  // Exit session
  const handleExit = useCallback(() => {
    if (onComplete) {
      onComplete(score);
    }
  }, [onComplete, score]);

  if (!question) {
    return (
      <div className="practice-mode-loading text-center p-8">
        <div className="text-slate-400">Loading question...</div>
      </div>
    );
  }

  return (
    <div className={`practice-mode bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 min-h-screen p-6 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="practice-header mb-8">
          <h1 className="text-3xl font-serif text-amber-200 text-center mb-4">
            {title}
          </h1>
          <div className="grid grid-cols-3 gap-4">
            <XpDisplay score={score} />
            <StreakDisplay
              streak={score.streak}
              maxStreak={score.maxStreak}
              isNewRecord={isNewRecord}
            />
            <MasteryBadge tier={getMasteryTierFromScore(score)} streak={score.streak} />
          </div>
        </header>

        {/* Question Card */}
        <div className="question-card bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                Question #{score.totalQuestions + 1}
                {maxQuestions && ` of ${maxQuestions}`}
              </span>
              {question.family && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  question.family === 'pure-sign'
                    ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50'
                    : 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/50'
                }`}>
                  {question.family === 'pure-sign' ? '♈ Pure Sign' : '🌓 Cusp'}
                </span>
              )}
            </div>
            <DifficultyIndicator difficulty={difficulty} />
          </div>

          <p className="question-prompt text-xl text-slate-200 mb-6">
            {question.prompt}
          </p>

          {/* Answer Options */}
          <div className="answer-options space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;
              const showResult = selectedAnswer !== null;

              let optionClass = 'bg-slate-700/50 border-slate-600 hover:border-purple-500/50';
              if (showResult) {
                if (isCorrect) {
                  optionClass = 'bg-emerald-900/30 border-emerald-500';
                } else if (isSelected) {
                  optionClass = 'bg-red-900/30 border-red-500';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${optionClass}`}
                >
                  <span className="text-slate-300">{option}</span>
                  {showResult && isCorrect && (
                    <span className="float-right text-emerald-400">✓</span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="float-right text-red-400">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="practice-stats flex justify-between text-sm text-slate-500">
          <span>Correct: {score.correct}</span>
          <span>Incorrect: {score.incorrect}</span>
          <span>
            Accuracy: {score.totalQuestions > 0
              ? Math.round((score.correct / score.totalQuestions) * 100)
              : 0}%
          </span>
        </div>
      </div>

      {/* Answer Feedback Modal */}
      <AnswerFeedback
        result={lastResult}
        explanation={question.explanation}
        onContinue={handleContinue}
      />

      {/* Session Summary Modal */}
      {showSummary && (
        <SessionSummaryModal
          score={score}
          startingXp={startingXp}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default PracticeMode;
