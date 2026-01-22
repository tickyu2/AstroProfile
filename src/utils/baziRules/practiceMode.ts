/**
 * ============================================
 * PRACTICE MODE
 * Khan Academy Style BaZi Learning
 *
 * Features:
 * - Exercises with expected answers
 * - Step-by-step solution paths
 * - Level-aware hints
 * - Instant feedback
 * - Skill tracking
 *
 * "Learn BaZi, lineage, and mythos step-by-step."
 * ============================================
 */

import { GuideLevel } from './guideMode';

// ==================== DATA MODEL ====================

/**
 * Skill categories for practice
 */
export type SkillId =
  | 'pillar_calculation'
  | 'stem_identification'
  | 'branch_identification'
  | 'clash_detection'
  | 'combination_detection'
  | 'harm_detection'
  | 'luck_pillars'
  | 'day_master_strength'
  | 'useful_god'
  | 'annual_analysis'
  | 'lineage_patterns'
  | 'mythos_mapping';

/**
 * Practice exercise structure
 */
export interface PracticeExercise {
  id: string;
  title: string;
  titleZh: string;
  skill: SkillId;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  questionZh: string;
  expected: string | number | boolean;
  acceptableAnswers?: (string | number | boolean)[];
  steps: ExerciseStep[];
  hints: ExerciseHint[];
  explanation: string;
  explanationZh: string;
}

export interface ExerciseStep {
  step: number;
  instruction: string;
  instructionZh: string;
  intermediateAnswer?: string;
}

export interface ExerciseHint {
  level: number;
  hint: string;
  hintZh: string;
}

/**
 * Practice attempt result
 */
export interface PracticeAttempt {
  exerciseId: string;
  answer: string | number | boolean;
  correct: boolean;
  feedback: string;
  feedbackZh: string;
  nextHint?: string;
  nextHintZh?: string;
  hintsUsed: number;
}

/**
 * Practice session state
 */
export interface PracticeSession {
  currentExerciseIndex: number;
  currentHintIndex: number;
  exercisesCompleted: number;
  correctAnswers: number;
  skillProgress: Record<SkillId, SkillProgressData>;
  history: PracticeAttempt[];
}

export interface SkillProgressData {
  attempts: number;
  correct: number;
  lastAttempted: number;
}

// ==================== EXERCISE DATABASE ====================

/**
 * Complete exercise database
 */
export const PRACTICE_EXERCISES: PracticeExercise[] = [
  // ========== PILLAR CALCULATION ==========
  {
    id: 'pillar_01',
    title: 'Identify the Day Pillar',
    titleZh: '识别日柱',
    skill: 'pillar_calculation',
    difficulty: 'easy',
    question: 'Given birth date 1990-05-12, what is the Day Pillar? (Answer in pinyin, e.g., "Geng Wu")',
    questionZh: '给定出生日期1990-05-12，日柱是什么？（请用拼音回答，如"Geng Wu"）',
    expected: 'Geng Wu',
    acceptableAnswers: ['Geng Wu', 'geng wu', '庚午', 'GengWu'],
    steps: [
      { step: 1, instruction: 'Find a Ten Thousand Year Calendar or BaZi calculator.', instructionZh: '找一个万年历或八字计算器。' },
      { step: 2, instruction: 'Look up May 12, 1990 in the calendar.', instructionZh: '在日历中查找1990年5月12日。' },
      { step: 3, instruction: 'Find the Day Stem (天干) for that date.', instructionZh: '找到该日期的日干。' },
      { step: 4, instruction: 'Find the Day Branch (地支) for that date.', instructionZh: '找到该日期的日支。' },
      { step: 5, instruction: 'Combine: Day Stem + Day Branch = Day Pillar.', instructionZh: '组合：日干 + 日支 = 日柱。' }
    ],
    hints: [
      { level: 1, hint: 'Use a BaZi calculator or Ten Thousand Year Calendar.', hintZh: '使用八字计算器或万年历。' },
      { level: 2, hint: 'The Day Stem is one of the 10 Heavenly Stems.', hintZh: '日干是十天干之一。' },
      { level: 3, hint: 'For May 12, 1990, the Day Stem is 庚 (Geng).', hintZh: '1990年5月12日的日干是庚。' }
    ],
    explanation: 'May 12, 1990 corresponds to Day Pillar 庚午 (Geng Wu). The Stem is 庚 (Geng/Metal Yang) and the Branch is 午 (Wu/Horse).',
    explanationZh: '1990年5月12日对应日柱庚午。天干是庚（阳金），地支是午（马）。'
  },
  {
    id: 'pillar_02',
    title: 'Identify the Year Pillar',
    titleZh: '识别年柱',
    skill: 'pillar_calculation',
    difficulty: 'easy',
    question: 'What is the Year Pillar for someone born in 1990? (Answer in pinyin)',
    questionZh: '1990年出生的人的年柱是什么？',
    expected: 'Geng Wu',
    acceptableAnswers: ['Geng Wu', 'geng wu', '庚午', 'GengWu'],
    steps: [
      { step: 1, instruction: 'Find the year in the sexagenary cycle.', instructionZh: '在六十甲子周期中找到该年。' },
      { step: 2, instruction: '1990 is the 7th year of the current cycle (starting from 1984 = Jia Zi).', instructionZh: '1990是当前周期的第7年（从1984年甲子开始）。' },
      { step: 3, instruction: 'Count 7 positions from Jia Zi: 庚午 (Geng Wu).', instructionZh: '从甲子数7位：庚午。' }
    ],
    hints: [
      { level: 1, hint: '1984 was a Jia Zi year. Count forward from there.', hintZh: '1984年是甲子年。从那里向前数。' },
      { level: 2, hint: '1990 - 1984 = 6 years after Jia Zi.', hintZh: '1990 - 1984 = 甲子后6年。' }
    ],
    explanation: '1990 is the Year of the Metal Horse (庚午). In the 60-year cycle, it comes 6 years after 1984 (Jia Zi).',
    explanationZh: '1990年是庚午年（金马年）。在60年周期中，它在1984年（甲子）之后6年。'
  },

  // ========== CLASH DETECTION ==========
  {
    id: 'clash_01',
    title: 'Detect a Clash',
    titleZh: '检测冲',
    skill: 'clash_detection',
    difficulty: 'easy',
    question: 'Do Zi (子) and Wu (午) form a Clash? (Answer: true or false)',
    questionZh: '子和午形成冲吗？（回答：true 或 false）',
    expected: true,
    steps: [
      { step: 1, instruction: 'List the 12 Earthly Branches in a circle.', instructionZh: '将12地支列成一个圆圈。' },
      { step: 2, instruction: 'Find Zi (子) - it\'s at the "12 o\'clock" position (Rat).', instructionZh: '找到子——它在"12点"位置（鼠）。' },
      { step: 3, instruction: 'Find Wu (午) - it\'s at the "6 o\'clock" position (Horse).', instructionZh: '找到午——它在"6点"位置（马）。' },
      { step: 4, instruction: 'Check if they sit opposite each other. Yes = Clash.', instructionZh: '检查它们是否相对。是 = 冲。' }
    ],
    hints: [
      { level: 1, hint: 'Remember: Zi is Rat, Wu is Horse.', hintZh: '记住：子是鼠，午是马。' },
      { level: 2, hint: 'Opposites in the 12-branch cycle always clash.', hintZh: '12地支周期中相对的总是冲。' }
    ],
    explanation: 'Zi (子/Rat) and Wu (午/Horse) are directly opposite in the 12-branch cycle, forming the Zi-Wu Clash (子午冲).',
    explanationZh: '子（鼠）和午（马）在12地支周期中直接相对，形成子午冲。'
  },
  {
    id: 'clash_02',
    title: 'Identify Clash Pairs',
    titleZh: '识别冲对',
    skill: 'clash_detection',
    difficulty: 'medium',
    question: 'Which branch clashes with Mao (卯/Rabbit)? (Answer the branch name in pinyin)',
    questionZh: '哪个地支与卯（兔）相冲？（用拼音回答地支名）',
    expected: 'You',
    acceptableAnswers: ['You', 'you', '酉', 'Rooster'],
    steps: [
      { step: 1, instruction: 'List all 6 clash pairs.', instructionZh: '列出所有6组冲对。' },
      { step: 2, instruction: 'Find Mao in the list.', instructionZh: '在列表中找到卯。' },
      { step: 3, instruction: 'The pair is Mao-You (卯酉冲).', instructionZh: '配对是卯酉冲。' }
    ],
    hints: [
      { level: 1, hint: 'The 6 clash pairs are: Zi-Wu, Chou-Wei, Yin-Shen, Mao-You, Chen-Xu, Si-Hai.', hintZh: '六组冲对是：子午、丑未、寅申、卯酉、辰戌、巳亥。' }
    ],
    explanation: 'Mao (卯/Rabbit) clashes with You (酉/Rooster). This is called the Mao-You Clash.',
    explanationZh: '卯（兔）与酉（鸡）相冲。这叫做卯酉冲。'
  },

  // ========== COMBINATION DETECTION ==========
  {
    id: 'combination_01',
    title: 'Detect a Combination',
    titleZh: '检测合',
    skill: 'combination_detection',
    difficulty: 'easy',
    question: 'Do Zi (子) and Chou (丑) form a Combination? (Answer: true or false)',
    questionZh: '子和丑形成合吗？（回答：true 或 false）',
    expected: true,
    steps: [
      { step: 1, instruction: 'List the 6 combination pairs (六合).', instructionZh: '列出六合对。' },
      { step: 2, instruction: 'Check if Zi-Chou is one of the pairs.', instructionZh: '检查子丑是否是其中一对。' }
    ],
    hints: [
      { level: 1, hint: 'The 6 combinations are: Zi-Chou, Yin-Hai, Mao-Xu, Chen-You, Si-Shen, Wu-Wei.', hintZh: '六合是：子丑、寅亥、卯戌、辰酉、巳申、午未。' }
    ],
    explanation: 'Zi (子) and Chou (丑) form the Zi-Chou combination, which produces Earth element.',
    explanationZh: '子和丑形成子丑合，产生土元素。'
  },

  // ========== DAY MASTER STRENGTH ==========
  {
    id: 'strength_01',
    title: 'Day Master Strength Basics',
    titleZh: '日主强度基础',
    skill: 'day_master_strength',
    difficulty: 'medium',
    question: 'If a Wood Day Master is born in Spring (wood season), is it generally strong or weak? (Answer: strong or weak)',
    questionZh: '如果木日主出生在春季（木的季节），它通常是强还是弱？（回答：strong 或 weak）',
    expected: 'strong',
    acceptableAnswers: ['strong', 'Strong', '强'],
    steps: [
      { step: 1, instruction: 'Identify the Day Master element (Wood).', instructionZh: '识别日主元素（木）。' },
      { step: 2, instruction: 'Identify the birth season (Spring).', instructionZh: '识别出生季节（春）。' },
      { step: 3, instruction: 'Check if the season supports the Day Master.', instructionZh: '检查季节是否支持日主。' },
      { step: 4, instruction: 'Spring = Wood season, so Wood Day Master is supported.', instructionZh: '春 = 木季，所以木日主得到支持。' }
    ],
    hints: [
      { level: 1, hint: 'Each season corresponds to an element: Spring=Wood, Summer=Fire, Autumn=Metal, Winter=Water.', hintZh: '每个季节对应一个元素：春=木，夏=火，秋=金，冬=水。' }
    ],
    explanation: 'A Day Master born in its own season (Wood in Spring, Fire in Summer, etc.) receives seasonal support and is generally stronger.',
    explanationZh: '出生在自己季节的日主（木在春天，火在夏天等）获得季节支持，通常更强。'
  },

  // ========== USEFUL GOD ==========
  {
    id: 'useful_01',
    title: 'Useful God Basics',
    titleZh: '用神基础',
    skill: 'useful_god',
    difficulty: 'hard',
    question: 'If a Wood Day Master is too strong, which element would be the Useful God: Water or Metal? (Answer: Water or Metal)',
    questionZh: '如果木日主太强，用神是水还是金？（回答：Water 或 Metal）',
    expected: 'Metal',
    acceptableAnswers: ['Metal', 'metal', '金'],
    steps: [
      { step: 1, instruction: 'Identify that the Day Master is too strong.', instructionZh: '识别日主太强。' },
      { step: 2, instruction: 'If too strong, we need to weaken it.', instructionZh: '如果太强，我们需要削弱它。' },
      { step: 3, instruction: 'What controls Wood? Metal controls Wood (Metal chops Wood).', instructionZh: '什么克木？金克木（金砍木）。' },
      { step: 4, instruction: 'Therefore, Metal is the Useful God.', instructionZh: '因此，金是用神。' }
    ],
    hints: [
      { level: 1, hint: 'Strong Day Master needs to be weakened.', hintZh: '强日主需要被削弱。' },
      { level: 2, hint: 'The controlling element weakens the Day Master.', hintZh: '克制元素削弱日主。' },
      { level: 3, hint: 'Water produces Wood (makes it stronger). Metal controls Wood (makes it weaker).', hintZh: '水生木（使其更强）。金克木（使其更弱）。' }
    ],
    explanation: 'For a strong Wood Day Master, Metal is the Useful God because Metal controls/weakens Wood. Water would make Wood even stronger.',
    explanationZh: '对于强木日主，金是用神，因为金克/削弱木。水会使木更强。'
  },

  // ========== LINEAGE PATTERNS ==========
  {
    id: 'lineage_01',
    title: 'Identify Lineage Theme',
    titleZh: '识别血脉主题',
    skill: 'lineage_patterns',
    difficulty: 'medium',
    question: 'If both a person and their parent have a Day-Month Clash in their charts, this likely indicates what type of lineage pattern? (Answer: inherited, transformed, or resolved)',
    questionZh: '如果一个人和他们的父母的命盘中都有日月冲，这可能表示什么类型的血脉模式？（回答：inherited、transformed 或 resolved）',
    expected: 'inherited',
    acceptableAnswers: ['inherited', 'Inherited', '继承'],
    steps: [
      { step: 1, instruction: 'Note that the same pattern appears in multiple generations.', instructionZh: '注意同一模式出现在多代人中。' },
      { step: 2, instruction: 'When a pattern repeats unchanged, it is "inherited".', instructionZh: '当模式未改变地重复时，它是"继承的"。' }
    ],
    hints: [
      { level: 1, hint: 'Patterns that appear across generations are called "threads".', hintZh: '跨代出现的模式被称为"线索"。' }
    ],
    explanation: 'When the same BaZi pattern (like a clash) appears in both parent and child charts, it indicates an inherited pattern—a generational thread that has been passed down.',
    explanationZh: '当相同的八字模式（如冲）出现在父母和孩子的命盘中时，它表示一个继承的模式——一个传递下来的代际线索。'
  },

  // ========== MYTHOS MAPPING ==========
  {
    id: 'mythos_01',
    title: 'Map Pattern to Archetype',
    titleZh: '将模式映射到原型',
    skill: 'mythos_mapping',
    difficulty: 'hard',
    question: 'A chart with many clashes and punishments often maps to which archetype: Healer, Warrior, or Innocent? (Answer one)',
    questionZh: '有很多冲和刑的命盘通常映射到哪个原型：疗愈者、战士还是纯真者？（回答一个）',
    expected: 'Warrior',
    acceptableAnswers: ['Warrior', 'warrior', '战士'],
    steps: [
      { step: 1, instruction: 'Clashes and punishments indicate conflict and tension.', instructionZh: '冲和刑表示冲突和张力。' },
      { step: 2, instruction: 'The Warrior archetype deals with conflict, protection, and action.', instructionZh: '战士原型处理冲突、保护和行动。' },
      { step: 3, instruction: 'Therefore, many clashes → Warrior archetype.', instructionZh: '因此，很多冲 → 战士原型。' }
    ],
    hints: [
      { level: 1, hint: 'Think about which archetype is associated with conflict and struggle.', hintZh: '想想哪个原型与冲突和斗争相关。' }
    ],
    explanation: 'Charts with many clashes and punishments often map to the Warrior archetype, as they indicate a life with significant conflict, challenges to overcome, and the need for courage and decisive action.',
    explanationZh: '有很多冲和刑的命盘通常映射到战士原型，因为它们表示一个有重大冲突的人生，需要克服的挑战，以及勇气和果断行动的需要。'
  }
];

// ==================== PRACTICE ENGINE ====================

/**
 * Initialize a practice session
 */
export function initPracticeSession(): PracticeSession {
  const skillProgress: Record<SkillId, SkillProgressData> = {} as any;
  const skills: SkillId[] = [
    'pillar_calculation', 'stem_identification', 'branch_identification',
    'clash_detection', 'combination_detection', 'harm_detection',
    'luck_pillars', 'day_master_strength', 'useful_god',
    'annual_analysis', 'lineage_patterns', 'mythos_mapping'
  ];

  skills.forEach(skill => {
    skillProgress[skill] = { attempts: 0, correct: 0, lastAttempted: 0 };
  });

  return {
    currentExerciseIndex: 0,
    currentHintIndex: 0,
    exercisesCompleted: 0,
    correctAnswers: 0,
    skillProgress,
    history: []
  };
}

/**
 * Check a practice answer
 */
export function checkPracticeAnswer(
  exercise: PracticeExercise,
  answer: string | number | boolean,
  session: PracticeSession
): PracticeAttempt {
  // Normalize answer
  const normalizedAnswer = typeof answer === 'string' ? answer.trim().toLowerCase() : answer;
  const normalizedExpected = typeof exercise.expected === 'string'
    ? exercise.expected.toLowerCase()
    : exercise.expected;

  // Check if correct
  let correct = normalizedAnswer === normalizedExpected;

  // Check acceptable alternatives
  if (!correct && exercise.acceptableAnswers) {
    correct = exercise.acceptableAnswers.some(alt => {
      const normalizedAlt = typeof alt === 'string' ? alt.toLowerCase() : alt;
      return normalizedAnswer === normalizedAlt;
    });
  }

  // Get next hint if incorrect
  const nextHint = !correct && exercise.hints[session.currentHintIndex]
    ? exercise.hints[session.currentHintIndex].hint
    : undefined;
  const nextHintZh = !correct && exercise.hints[session.currentHintIndex]
    ? exercise.hints[session.currentHintIndex].hintZh
    : undefined;

  // Build feedback
  const feedback = correct
    ? 'Correct! Well done — proceed to the next exercise.'
    : 'Not quite. Review the steps or request a hint.';
  const feedbackZh = correct
    ? '正确！做得好——继续下一个练习。'
    : '不太对。复习步骤或请求提示。';

  return {
    exerciseId: exercise.id,
    answer,
    correct,
    feedback,
    feedbackZh,
    nextHint,
    nextHintZh,
    hintsUsed: session.currentHintIndex
  };
}

/**
 * Update session after attempt
 */
export function updateSession(
  session: PracticeSession,
  exercise: PracticeExercise,
  attempt: PracticeAttempt
): PracticeSession {
  const newSession = { ...session };

  // Update skill progress
  newSession.skillProgress[exercise.skill] = {
    attempts: session.skillProgress[exercise.skill].attempts + 1,
    correct: session.skillProgress[exercise.skill].correct + (attempt.correct ? 1 : 0),
    lastAttempted: Date.now()
  };

  // Update history
  newSession.history = [...session.history, attempt];

  if (attempt.correct) {
    newSession.exercisesCompleted++;
    newSession.correctAnswers++;
    newSession.currentExerciseIndex++;
    newSession.currentHintIndex = 0;
  } else {
    newSession.currentHintIndex++;
  }

  return newSession;
}

/**
 * Get exercises for a skill
 */
export function getExercisesForSkill(skillId: SkillId): PracticeExercise[] {
  return PRACTICE_EXERCISES.filter(e => e.skill === skillId);
}

/**
 * Get exercises by difficulty
 */
export function getExercisesByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): PracticeExercise[] {
  return PRACTICE_EXERCISES.filter(e => e.difficulty === difficulty);
}

/**
 * Adapt exercise hints to guide level
 */
export function adaptToGuideLevel(
  exercise: PracticeExercise,
  level: GuideLevel
): PracticeExercise {
  if (level === 'elementary') {
    return { ...exercise, steps: [], hints: exercise.hints.slice(0, 1) };
  }
  if (level === 'highschool') {
    return { ...exercise, steps: exercise.steps.slice(0, 2) };
  }
  return exercise; // university = full detail
}

/**
 * Get session statistics
 */
export function getSessionStats(session: PracticeSession): {
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  strongestSkill: SkillId | null;
  weakestSkill: SkillId | null;
} {
  const totalAttempts = Object.values(session.skillProgress)
    .reduce((sum, sp) => sum + sp.attempts, 0);
  const totalCorrect = Object.values(session.skillProgress)
    .reduce((sum, sp) => sum + sp.correct, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Find strongest and weakest skills
  let strongestSkill: SkillId | null = null;
  let weakestSkill: SkillId | null = null;
  let highestAccuracy = -1;
  let lowestAccuracy = 101;

  Object.entries(session.skillProgress).forEach(([skill, data]) => {
    if (data.attempts > 0) {
      const skillAccuracy = data.correct / data.attempts;
      if (skillAccuracy > highestAccuracy) {
        highestAccuracy = skillAccuracy;
        strongestSkill = skill as SkillId;
      }
      if (skillAccuracy < lowestAccuracy) {
        lowestAccuracy = skillAccuracy;
        weakestSkill = skill as SkillId;
      }
    }
  });

  return { totalAttempts, totalCorrect, accuracy, strongestSkill, weakestSkill };
}

// ==================== EXPORTS ====================

export {
  initPracticeSession,
  checkPracticeAnswer,
  updateSession,
  getExercisesForSkill,
  getExercisesByDifficulty,
  adaptToGuideLevel,
  getSessionStats,
  PRACTICE_EXERCISES
};
