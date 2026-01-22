/**
 * ============================================
 * MASTERY MODE
 * Skill Trees, Adaptive Learning, Spaced Repetition
 *
 * Features:
 * - Skill tree with prerequisites
 * - Proficiency tracking (0-100%)
 * - Spaced repetition scheduling
 * - Adaptive difficulty selection
 * - Mastery certification
 *
 * "From 'What is a pillar?' to 'I can read lineage.'"
 * ============================================
 */

import { SkillId, PracticeExercise, PRACTICE_EXERCISES } from './practiceMode';

// ==================== DATA MODEL ====================

/**
 * Skill node in the skill tree
 */
export interface SkillNode {
  id: SkillId;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  prerequisites: SkillId[];
  category: SkillCategory;
  estimatedHours: number;
}

export type SkillCategory =
  | 'foundations'
  | 'interactions'
  | 'timing'
  | 'analysis'
  | 'integration';

/**
 * Skill progress tracking
 */
export interface SkillProgress {
  skillId: SkillId;
  proficiency: number;       // 0-100
  attempts: number;
  correct: number;
  streak: number;            // Consecutive correct answers
  lastSeen: number;          // Timestamp
  nextReview: number;        // Scheduled review timestamp
  level: MasteryLevel;
}

export type MasteryLevel =
  | 'novice'        // 0-20%
  | 'beginner'      // 21-40%
  | 'intermediate'  // 41-60%
  | 'advanced'      // 61-80%
  | 'master';       // 81-100%

/**
 * Mastery state
 */
export interface MasteryState {
  pilgrimId: string;
  skills: SkillNode[];
  progress: Record<SkillId, SkillProgress>;
  totalXP: number;
  currentLevel: number;
  achievements: Achievement[];
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  unlockedAt?: Date;
}

/**
 * Review recommendation
 */
export interface ReviewRecommendation {
  skillId: SkillId;
  priority: 'urgent' | 'due' | 'optional';
  reason: string;
  reasonZh: string;
  exercises: PracticeExercise[];
}

// ==================== SKILL TREE ====================

/**
 * The complete skill tree
 */
export const SKILL_TREE: SkillNode[] = [
  // ========== FOUNDATIONS ==========
  {
    id: 'pillar_calculation',
    label: 'Pillar Calculation',
    labelZh: '柱位计算',
    description: 'Compute the four pillars from birth data.',
    descriptionZh: '从出生数据计算四柱。',
    prerequisites: [],
    category: 'foundations',
    estimatedHours: 2
  },
  {
    id: 'stem_identification',
    label: 'Stem Identification',
    labelZh: '天干识别',
    description: 'Identify and understand the 10 Heavenly Stems.',
    descriptionZh: '识别和理解十天干。',
    prerequisites: ['pillar_calculation'],
    category: 'foundations',
    estimatedHours: 1
  },
  {
    id: 'branch_identification',
    label: 'Branch Identification',
    labelZh: '地支识别',
    description: 'Identify and understand the 12 Earthly Branches.',
    descriptionZh: '识别和理解十二地支。',
    prerequisites: ['pillar_calculation'],
    category: 'foundations',
    estimatedHours: 1
  },

  // ========== INTERACTIONS ==========
  {
    id: 'clash_detection',
    label: 'Clash Detection',
    labelZh: '冲的检测',
    description: 'Identify clashes between branches.',
    descriptionZh: '识别地支之间的冲。',
    prerequisites: ['branch_identification'],
    category: 'interactions',
    estimatedHours: 1
  },
  {
    id: 'combination_detection',
    label: 'Combination Detection',
    labelZh: '合的检测',
    description: 'Identify combinations between branches.',
    descriptionZh: '识别地支之间的合。',
    prerequisites: ['branch_identification'],
    category: 'interactions',
    estimatedHours: 1
  },
  {
    id: 'harm_detection',
    label: 'Harm Detection',
    labelZh: '害的检测',
    description: 'Identify harms between branches.',
    descriptionZh: '识别地支之间的害。',
    prerequisites: ['branch_identification'],
    category: 'interactions',
    estimatedHours: 1
  },

  // ========== TIMING ==========
  {
    id: 'luck_pillars',
    label: 'Luck Pillars',
    labelZh: '大运',
    description: 'Compute and interpret Luck Pillars.',
    descriptionZh: '计算和解读大运。',
    prerequisites: ['pillar_calculation', 'stem_identification', 'branch_identification'],
    category: 'timing',
    estimatedHours: 3
  },
  {
    id: 'annual_analysis',
    label: 'Annual Analysis',
    labelZh: '流年分析',
    description: 'Read annual influences on the chart.',
    descriptionZh: '解读流年对命盘的影响。',
    prerequisites: ['luck_pillars', 'clash_detection', 'combination_detection'],
    category: 'timing',
    estimatedHours: 2
  },

  // ========== ANALYSIS ==========
  {
    id: 'day_master_strength',
    label: 'Day Master Strength',
    labelZh: '日主强度',
    description: 'Determine if the Day Master is strong, weak, or balanced.',
    descriptionZh: '确定日主是强、弱还是平衡。',
    prerequisites: ['pillar_calculation', 'stem_identification'],
    category: 'analysis',
    estimatedHours: 2
  },
  {
    id: 'useful_god',
    label: 'Useful God',
    labelZh: '用神',
    description: 'Identify the most beneficial element for the chart.',
    descriptionZh: '识别对命盘最有利的元素。',
    prerequisites: ['day_master_strength'],
    category: 'analysis',
    estimatedHours: 3
  },

  // ========== INTEGRATION ==========
  {
    id: 'lineage_patterns',
    label: 'Lineage Patterns',
    labelZh: '血脉模式',
    description: 'Recognize generational echoes and breaks.',
    descriptionZh: '识别代际回响和断裂。',
    prerequisites: ['annual_analysis', 'useful_god'],
    category: 'integration',
    estimatedHours: 4
  },
  {
    id: 'mythos_mapping',
    label: 'Mythos Mapping',
    labelZh: '神话映射',
    description: 'Map technical patterns to archetypes and themes.',
    descriptionZh: '将技术模式映射到原型和主题。',
    prerequisites: ['lineage_patterns'],
    category: 'integration',
    estimatedHours: 4
  }
];

// ==================== ACHIEVEMENTS ====================

/**
 * Available achievements
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_correct',
    name: 'First Step',
    nameZh: '第一步',
    description: 'Answer your first exercise correctly.',
    descriptionZh: '正确回答你的第一个练习。'
  },
  {
    id: 'first_skill_mastered',
    name: 'Skill Mastered',
    nameZh: '技能精通',
    description: 'Reach 80% proficiency in any skill.',
    descriptionZh: '在任何技能上达到80%熟练度。'
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    nameZh: '势不可挡',
    description: 'Get 5 correct answers in a row.',
    descriptionZh: '连续正确回答5个问题。'
  },
  {
    id: 'streak_10',
    name: 'Unstoppable',
    nameZh: '无人能挡',
    description: 'Get 10 correct answers in a row.',
    descriptionZh: '连续正确回答10个问题。'
  },
  {
    id: 'foundations_complete',
    name: 'Foundations Complete',
    nameZh: '基础完成',
    description: 'Master all foundation skills.',
    descriptionZh: '精通所有基础技能。'
  },
  {
    id: 'interactions_complete',
    name: 'Interaction Expert',
    nameZh: '交互专家',
    description: 'Master all interaction skills.',
    descriptionZh: '精通所有交互技能。'
  },
  {
    id: 'full_mastery',
    name: 'Cathedral Master',
    nameZh: '大教堂大师',
    description: 'Reach 80% proficiency in all skills.',
    descriptionZh: '在所有技能上达到80%熟练度。'
  }
];

// ==================== MASTERY ENGINE ====================

/**
 * Initialize mastery state
 */
export function initMasteryState(pilgrimId: string = 'pilgrim'): MasteryState {
  const progress: Record<SkillId, SkillProgress> = {} as any;

  SKILL_TREE.forEach(s => {
    progress[s.id] = {
      skillId: s.id,
      proficiency: 0,
      attempts: 0,
      correct: 0,
      streak: 0,
      lastSeen: 0,
      nextReview: 0,
      level: 'novice'
    };
  });

  return {
    pilgrimId,
    skills: SKILL_TREE,
    progress,
    totalXP: 0,
    currentLevel: 1,
    achievements: [],
    lastUpdated: new Date()
  };
}

/**
 * Update mastery after an attempt
 */
export function updateMastery(
  state: MasteryState,
  skillId: SkillId,
  correct: boolean
): MasteryState {
  const p = state.progress[skillId];
  const now = Date.now();

  // Update attempts and correct count
  const attempts = p.attempts + 1;
  const correctCount = p.correct + (correct ? 1 : 0);
  const streak = correct ? p.streak + 1 : 0;

  // Calculate proficiency (weighted towards recent performance)
  const rawAccuracy = correctCount / attempts;
  const recentWeight = Math.min(10, attempts) / 10;
  const proficiency = Math.round(rawAccuracy * 100 * recentWeight + p.proficiency * (1 - recentWeight));

  // Determine mastery level
  const level = getMasteryLevel(proficiency);

  // Calculate next review time using spaced repetition
  const nextReview = calculateNextReview(proficiency, streak, now);

  // Calculate XP gain
  const xpGain = correct ? (10 + streak * 2) : 0;
  const totalXP = state.totalXP + xpGain;
  const currentLevel = Math.floor(totalXP / 100) + 1;

  // Update progress
  const newProgress = {
    ...state.progress,
    [skillId]: {
      skillId,
      proficiency,
      attempts,
      correct: correctCount,
      streak,
      lastSeen: now,
      nextReview,
      level
    }
  };

  // Check for new achievements
  const achievements = checkAchievements(state, newProgress, streak, correct);

  return {
    ...state,
    progress: newProgress,
    totalXP,
    currentLevel,
    achievements: [...state.achievements, ...achievements],
    lastUpdated: new Date()
  };
}

/**
 * Get mastery level from proficiency
 */
function getMasteryLevel(proficiency: number): MasteryLevel {
  if (proficiency >= 81) return 'master';
  if (proficiency >= 61) return 'advanced';
  if (proficiency >= 41) return 'intermediate';
  if (proficiency >= 21) return 'beginner';
  return 'novice';
}

/**
 * Calculate next review time using spaced repetition
 */
function calculateNextReview(proficiency: number, streak: number, now: number): number {
  // Base intervals in milliseconds
  const baseIntervals = {
    'novice': 5 * 60 * 1000,          // 5 minutes
    'beginner': 30 * 60 * 1000,       // 30 minutes
    'intermediate': 2 * 60 * 60 * 1000,   // 2 hours
    'advanced': 24 * 60 * 60 * 1000,      // 1 day
    'master': 7 * 24 * 60 * 60 * 1000     // 1 week
  };

  const level = getMasteryLevel(proficiency);
  let interval = baseIntervals[level];

  // Increase interval based on streak
  interval *= (1 + streak * 0.2);

  return now + interval;
}

/**
 * Check for new achievements
 */
function checkAchievements(
  state: MasteryState,
  newProgress: Record<SkillId, SkillProgress>,
  streak: number,
  correct: boolean
): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existingIds = state.achievements.map(a => a.id);

  // First correct
  if (correct && !existingIds.includes('first_correct')) {
    const total = Object.values(newProgress).reduce((sum, p) => sum + p.correct, 0);
    if (total === 1) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'first_correct')!;
      newAchievements.push({ ...ach, unlockedAt: new Date() });
    }
  }

  // First skill mastered
  if (!existingIds.includes('first_skill_mastered')) {
    const hasMastered = Object.values(newProgress).some(p => p.proficiency >= 80);
    if (hasMastered) {
      const ach = ACHIEVEMENTS.find(a => a.id === 'first_skill_mastered')!;
      newAchievements.push({ ...ach, unlockedAt: new Date() });
    }
  }

  // Streaks
  if (streak >= 5 && !existingIds.includes('streak_5')) {
    const ach = ACHIEVEMENTS.find(a => a.id === 'streak_5')!;
    newAchievements.push({ ...ach, unlockedAt: new Date() });
  }
  if (streak >= 10 && !existingIds.includes('streak_10')) {
    const ach = ACHIEVEMENTS.find(a => a.id === 'streak_10')!;
    newAchievements.push({ ...ach, unlockedAt: new Date() });
  }

  // Category completion
  const foundationSkills = SKILL_TREE.filter(s => s.category === 'foundations').map(s => s.id);
  const foundationsMastered = foundationSkills.every(id => newProgress[id].proficiency >= 80);
  if (foundationsMastered && !existingIds.includes('foundations_complete')) {
    const ach = ACHIEVEMENTS.find(a => a.id === 'foundations_complete')!;
    newAchievements.push({ ...ach, unlockedAt: new Date() });
  }

  // Full mastery
  const allMastered = SKILL_TREE.every(s => newProgress[s.id].proficiency >= 80);
  if (allMastered && !existingIds.includes('full_mastery')) {
    const ach = ACHIEVEMENTS.find(a => a.id === 'full_mastery')!;
    newAchievements.push({ ...ach, unlockedAt: new Date() });
  }

  return newAchievements;
}

// ==================== ADAPTIVE SELECTION ====================

/**
 * Pick the next skill to review (spaced repetition priority)
 */
export function pickNextSkill(state: MasteryState): SkillId {
  const now = Date.now();
  const entries = Object.values(state.progress);

  // Sort by priority: due reviews first, then low proficiency, then time since last seen
  entries.sort((a, b) => {
    // Check if review is due
    const aDue = a.nextReview <= now;
    const bDue = b.nextReview <= now;

    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    // If both due or neither due, prioritize by proficiency and time
    const scoreA = (100 - a.proficiency) + (now - a.lastSeen) / (60 * 60 * 1000);
    const scoreB = (100 - b.proficiency) + (now - b.lastSeen) / (60 * 60 * 1000);

    return scoreB - scoreA;
  });

  return entries[0].skillId;
}

/**
 * Get all skills due for review
 */
export function getSkillsDueForReview(state: MasteryState): ReviewRecommendation[] {
  const now = Date.now();
  const recommendations: ReviewRecommendation[] = [];

  Object.values(state.progress).forEach(p => {
    let priority: 'urgent' | 'due' | 'optional';
    let reason: string;
    let reasonZh: string;

    if (p.nextReview <= now - 24 * 60 * 60 * 1000) {
      // Overdue by more than a day
      priority = 'urgent';
      reason = 'Overdue for review. Knowledge may be fading.';
      reasonZh = '复习已逾期。知识可能正在消退。';
    } else if (p.nextReview <= now) {
      priority = 'due';
      reason = 'Scheduled review time has arrived.';
      reasonZh = '预定的复习时间已到。';
    } else if (p.proficiency < 40) {
      priority = 'optional';
      reason = 'Low proficiency - more practice recommended.';
      reasonZh = '熟练度低——建议更多练习。';
    } else {
      return; // Skip if not due and proficiency is okay
    }

    const exercises = PRACTICE_EXERCISES.filter(e => e.skill === p.skillId);

    recommendations.push({
      skillId: p.skillId,
      priority,
      reason,
      reasonZh,
      exercises
    });
  });

  // Sort by priority
  const priorityOrder = { 'urgent': 0, 'due': 1, 'optional': 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Pick exercise for skill based on proficiency
 */
export function pickExerciseForSkill(
  skillId: SkillId,
  state: MasteryState
): PracticeExercise | null {
  const exercises = PRACTICE_EXERCISES.filter(e => e.skill === skillId);
  if (exercises.length === 0) return null;

  const prof = state.progress[skillId].proficiency;

  // Select difficulty based on proficiency
  if (prof < 40) {
    // Low proficiency: easy exercises
    const easy = exercises.filter(e => e.difficulty === 'easy');
    return easy[0] || exercises[0];
  } else if (prof < 70) {
    // Medium proficiency: medium exercises
    const medium = exercises.filter(e => e.difficulty === 'medium');
    return medium[0] || exercises[Math.floor(exercises.length / 2)];
  } else {
    // High proficiency: hard exercises
    const hard = exercises.filter(e => e.difficulty === 'hard');
    return hard[0] || exercises[exercises.length - 1];
  }
}

/**
 * Check if skill is unlocked (prerequisites met)
 */
export function isSkillUnlocked(skillId: SkillId, state: MasteryState): boolean {
  const skill = SKILL_TREE.find(s => s.id === skillId);
  if (!skill) return false;

  // Check all prerequisites have at least beginner level
  return skill.prerequisites.every(prereq => {
    const progress = state.progress[prereq];
    return progress && progress.proficiency >= 20;
  });
}

/**
 * Get unlocked skills
 */
export function getUnlockedSkills(state: MasteryState): SkillId[] {
  return SKILL_TREE
    .filter(skill => isSkillUnlocked(skill.id, state))
    .map(skill => skill.id);
}

/**
 * Get skill tree with unlock status
 */
export function getSkillTreeWithStatus(state: MasteryState): Array<{
  skill: SkillNode;
  progress: SkillProgress;
  unlocked: boolean;
}> {
  return SKILL_TREE.map(skill => ({
    skill,
    progress: state.progress[skill.id],
    unlocked: isSkillUnlocked(skill.id, state)
  }));
}

// ==================== STATISTICS ====================

/**
 * Get mastery statistics
 */
export function getMasteryStats(state: MasteryState): {
  overallProficiency: number;
  skillsMastered: number;
  totalSkills: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  longestStreak: number;
  currentStreak: number;
  xpToNextLevel: number;
} {
  const progresses = Object.values(state.progress);

  const overallProficiency = Math.round(
    progresses.reduce((sum, p) => sum + p.proficiency, 0) / progresses.length
  );

  const skillsMastered = progresses.filter(p => p.proficiency >= 80).length;
  const totalSkills = SKILL_TREE.length;

  const totalAttempts = progresses.reduce((sum, p) => sum + p.attempts, 0);
  const totalCorrect = progresses.reduce((sum, p) => sum + p.correct, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const currentStreak = Math.max(...progresses.map(p => p.streak));
  const longestStreak = currentStreak; // Would need separate tracking for true longest

  const xpToNextLevel = (state.currentLevel * 100) - state.totalXP;

  return {
    overallProficiency,
    skillsMastered,
    totalSkills,
    totalAttempts,
    totalCorrect,
    accuracy,
    longestStreak,
    currentStreak,
    xpToNextLevel
  };
}

// ==================== EXPORTS ====================

export {
  initMasteryState,
  updateMastery,
  pickNextSkill,
  pickExerciseForSkill,
  getSkillsDueForReview,
  isSkillUnlocked,
  getUnlockedSkills,
  getSkillTreeWithStatus,
  getMasteryStats,
  getMasteryLevel,
  SKILL_TREE,
  ACHIEVEMENTS
};
