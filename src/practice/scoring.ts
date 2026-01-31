/**
 * Practice Mode Scoring Engine
 * XP system, streaks, difficulty scaling, mastery tiers
 * The ritual learning loop that transforms the Academy into a living game
 */

// ============================================================================
// Types
// ============================================================================

export interface PracticeScore {
  xp: number;
  streak: number;
  maxStreak: number;
  correct: number;
  incorrect: number;
  level: number;
  totalQuestions: number;
}

export interface SessionSummary {
  xp: number;
  accuracy: number;
  maxStreak: number;
  total: number;
  level: number;
  masteryTier: MasteryTier;
  xpGained: number;
}

export type MasteryTier = 'beginner' | 'intermediate' | 'advanced' | 'master';

export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface AnswerResult {
  isCorrect: boolean;
  xpEarned: number;
  streakBonus: number;
  newStreak: number;
  difficultyBonus: number;
}

// ============================================================================
// Constants
// ============================================================================

const BASE_XP_REWARD = 10;
const STREAK_MULTIPLIER = 2;
const INCORRECT_PENALTY = 5;

const XP_PER_LEVEL = 100;
const MAX_LEVEL = 50;

const STREAK_THRESHOLDS = {
  intermediate: 5,
  advanced: 10,
  master: 20
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Mastery'
};

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Create initial score state
 */
export function createInitialScore(): PracticeScore {
  return {
    xp: 0,
    streak: 0,
    maxStreak: 0,
    correct: 0,
    incorrect: 0,
    level: 1,
    totalQuestions: 0
  };
}

/**
 * Apply an answer and update the score
 */
export function applyAnswer(
  score: PracticeScore,
  isCorrect: boolean,
  difficulty: DifficultyLevel = 1
): { score: PracticeScore; result: AnswerResult } {
  const updated = { ...score };
  updated.totalQuestions += 1;

  let xpEarned = 0;
  let streakBonus = 0;
  let difficultyBonus = 0;

  if (isCorrect) {
    updated.correct += 1;
    updated.streak += 1;
    updated.maxStreak = Math.max(updated.maxStreak, updated.streak);

    // Base XP + streak bonus + difficulty multiplier
    xpEarned = BASE_XP_REWARD * difficulty;
    streakBonus = updated.streak * STREAK_MULTIPLIER;
    difficultyBonus = (difficulty - 1) * 5;

    updated.xp += xpEarned + streakBonus + difficultyBonus;
  } else {
    updated.incorrect += 1;
    updated.streak = 0;

    // Small XP penalty (never go below 0)
    xpEarned = -INCORRECT_PENALTY;
    updated.xp = Math.max(0, updated.xp + xpEarned);
  }

  // Calculate level
  updated.level = calculateLevel(updated.xp);

  return {
    score: updated,
    result: {
      isCorrect,
      xpEarned: isCorrect ? xpEarned + streakBonus + difficultyBonus : xpEarned,
      streakBonus,
      newStreak: updated.streak,
      difficultyBonus
    }
  };
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1);
}

/**
 * Get XP progress to next level
 */
export function getLevelProgress(xp: number): { current: number; required: number; percent: number } {
  const level = calculateLevel(xp);
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const progress = xp - currentLevelXp;
  const required = nextLevelXp - currentLevelXp;

  return {
    current: progress,
    required,
    percent: Math.round((progress / required) * 100)
  };
}

// ============================================================================
// Difficulty Scaling
// ============================================================================

/**
 * Get difficulty based on current streak and performance
 */
export function getDifficulty(score: PracticeScore): DifficultyLevel {
  if (score.streak >= STREAK_THRESHOLDS.master) return 4;
  if (score.streak >= STREAK_THRESHOLDS.advanced) return 3;
  if (score.streak >= STREAK_THRESHOLDS.intermediate) return 2;
  return 1;
}

/**
 * Get difficulty label
 */
export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  return DIFFICULTY_LABELS[difficulty];
}

/**
 * Get adaptive difficulty based on recent performance
 */
export function getAdaptiveDifficulty(
  score: PracticeScore,
  recentAnswers: boolean[]
): DifficultyLevel {
  const baseDifficulty = getDifficulty(score);

  // If last 3 answers were all correct, consider bumping up
  if (recentAnswers.length >= 3) {
    const lastThree = recentAnswers.slice(-3);
    const allCorrect = lastThree.every(a => a);
    const allIncorrect = lastThree.every(a => !a);

    if (allCorrect && baseDifficulty < 4) {
      return (baseDifficulty + 1) as DifficultyLevel;
    }
    if (allIncorrect && baseDifficulty > 1) {
      return (baseDifficulty - 1) as DifficultyLevel;
    }
  }

  return baseDifficulty;
}

// ============================================================================
// Mastery Tiers
// ============================================================================

/**
 * Get mastery tier based on streak
 */
export function getMasteryTier(streak: number): MasteryTier {
  if (streak >= STREAK_THRESHOLDS.master) return 'master';
  if (streak >= STREAK_THRESHOLDS.advanced) return 'advanced';
  if (streak >= STREAK_THRESHOLDS.intermediate) return 'intermediate';
  return 'beginner';
}

/**
 * Get mastery tier from score
 */
export function getMasteryTierFromScore(score: PracticeScore): MasteryTier {
  return getMasteryTier(score.streak);
}

/**
 * Get mastery tier display info
 */
export function getMasteryTierInfo(tier: MasteryTier): {
  label: string;
  color: string;
  emoji: string;
  nextTier: MasteryTier | null;
  streakRequired: number | null;
} {
  const info: Record<MasteryTier, ReturnType<typeof getMasteryTierInfo>> = {
    beginner: {
      label: 'Initiate',
      color: '#64748b',
      emoji: '🌱',
      nextTier: 'intermediate',
      streakRequired: STREAK_THRESHOLDS.intermediate
    },
    intermediate: {
      label: 'Seeker',
      color: '#3b82f6',
      emoji: '🔮',
      nextTier: 'advanced',
      streakRequired: STREAK_THRESHOLDS.advanced
    },
    advanced: {
      label: 'Adept',
      color: '#a855f7',
      emoji: '⭐',
      nextTier: 'master',
      streakRequired: STREAK_THRESHOLDS.master
    },
    master: {
      label: 'Master',
      color: '#fbbf24',
      emoji: '👑',
      nextTier: null,
      streakRequired: null
    }
  };

  return info[tier];
}

// ============================================================================
// Session Summary
// ============================================================================

/**
 * Generate session summary
 */
export function getSessionSummary(
  score: PracticeScore,
  startingXp: number = 0
): SessionSummary {
  const total = score.correct + score.incorrect;
  const accuracy = total === 0 ? 0 : Math.round((score.correct / total) * 100);

  return {
    xp: score.xp,
    accuracy,
    maxStreak: score.maxStreak,
    total,
    level: score.level,
    masteryTier: getMasteryTierFromScore(score),
    xpGained: score.xp - startingXp
  };
}

/**
 * Generate detailed performance breakdown
 */
export function getPerformanceBreakdown(score: PracticeScore): {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  averageXpPerQuestion: number;
  streakEfficiency: number;
} {
  const total = score.correct + score.incorrect;

  return {
    total,
    correct: score.correct,
    incorrect: score.incorrect,
    accuracy: total === 0 ? 0 : Math.round((score.correct / total) * 100),
    averageXpPerQuestion: total === 0 ? 0 : Math.round(score.xp / total),
    streakEfficiency: total === 0 ? 0 : Math.round((score.maxStreak / total) * 100)
  };
}

// ============================================================================
// Persistence Helpers
// ============================================================================

const STORAGE_KEY = 'academy-practice-score';

/**
 * Save score to localStorage
 */
export function saveScore(score: PracticeScore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Load score from localStorage
 */
export function loadScore(): PracticeScore | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as PracticeScore;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

/**
 * Clear saved score
 */
export function clearScore(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

// ============================================================================
// Exports
// ============================================================================

export default {
  createInitialScore,
  applyAnswer,
  getDifficulty,
  getMasteryTier,
  getSessionSummary,
  saveScore,
  loadScore
};
