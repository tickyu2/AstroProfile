/**
 * ============================================
 * PRACTICE MODE UI TEMPLATE
 * Khan Academy Style Exercise System
 *
 * Features:
 * - Exercise display with hints
 * - Step-by-step reveal
 * - Answer input and feedback
 * - Progress tracking
 * - Session statistics
 *
 * "Learn by doing. Practice with guidance."
 * ============================================
 */

import {
  PracticeExercise,
  PracticeSession,
  PracticeAttempt,
  SkillId,
  PRACTICE_EXERCISES
} from '../practiceMode';

// ==================== DATA MODEL ====================

export interface PracticeModeUIData {
  // Current exercise
  currentExercise?: PracticeExercise;
  currentHintIndex: number;
  currentStepIndex: number;
  showingAnswer: boolean;

  // User input
  userAnswer: string;

  // Feedback
  lastAttempt?: PracticeAttempt;
  showFeedback: boolean;

  // Session
  session: PracticeSession;

  // Settings
  lang: 'en' | 'zh';
  theme: 'light' | 'dark' | 'temple';
}

// ==================== HTML RENDERING ====================

/**
 * Render Practice Mode page
 */
export function renderPracticeModeHtml(data: PracticeModeUIData): string {
  const { lang = 'en', theme = 'temple' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '练习模式 — 大教堂学院' : 'Practice Mode — Cathedral Academy'}</title>
  <style>
    ${getPracticeModeStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="practice-container">

    <header class="practice-header">
      <div class="header-left">
        <span class="header-icon">📝</span>
        <h1>${lang === 'zh' ? '练习模式' : 'Practice Mode'}</h1>
      </div>
      ${renderSessionStats(data.session, lang)}
    </header>

    <main class="practice-main">
      ${data.currentExercise
        ? renderExercisePanel(data, lang)
        : renderExerciseSelector(lang)
      }
    </main>

    ${data.showFeedback && data.lastAttempt
      ? renderFeedbackPanel(data.lastAttempt, data.currentExercise!, lang)
      : ''
    }

    <footer class="practice-footer">
      <p>${lang === 'zh' ? '大教堂学院 · 学而时习之' : 'Cathedral Academy · Learn by Practice'}</p>
    </footer>

  </div>

  <script>
    ${getPracticeModeScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render session statistics
 */
function renderSessionStats(session: PracticeSession, lang: 'en' | 'zh'): string {
  const accuracy = session.totalAttempts > 0
    ? Math.round((session.correctCount / session.totalAttempts) * 100)
    : 0;

  return `
    <div class="session-stats">
      <div class="stat">
        <span class="stat-value">${session.correctCount}</span>
        <span class="stat-label">${lang === 'zh' ? '正确' : 'Correct'}</span>
      </div>
      <div class="stat">
        <span class="stat-value">${session.totalAttempts}</span>
        <span class="stat-label">${lang === 'zh' ? '尝试' : 'Attempts'}</span>
      </div>
      <div class="stat">
        <span class="stat-value">${accuracy}%</span>
        <span class="stat-label">${lang === 'zh' ? '准确率' : 'Accuracy'}</span>
      </div>
      <div class="stat streak">
        <span class="stat-value">${session.currentStreak}</span>
        <span class="stat-label">${lang === 'zh' ? '连胜' : 'Streak'}</span>
      </div>
    </div>
  `;
}

/**
 * Render exercise selector
 */
function renderExerciseSelector(lang: 'en' | 'zh'): string {
  // Group exercises by skill
  const grouped: Record<SkillId, PracticeExercise[]> = {} as any;
  PRACTICE_EXERCISES.forEach(ex => {
    if (!grouped[ex.skill]) grouped[ex.skill] = [];
    grouped[ex.skill].push(ex);
  });

  const skillLabels: Record<SkillId, { en: string; zh: string }> = {
    'pillar_calculation': { en: 'Pillar Calculation', zh: '柱位计算' },
    'stem_identification': { en: 'Stem Identification', zh: '天干识别' },
    'branch_identification': { en: 'Branch Identification', zh: '地支识别' },
    'clash_detection': { en: 'Clash Detection', zh: '冲的检测' },
    'combination_detection': { en: 'Combination Detection', zh: '合的检测' },
    'harm_detection': { en: 'Harm Detection', zh: '害的检测' },
    'luck_pillars': { en: 'Luck Pillars', zh: '大运' },
    'annual_analysis': { en: 'Annual Analysis', zh: '流年分析' },
    'day_master_strength': { en: 'Day Master Strength', zh: '日主强度' },
    'useful_god': { en: 'Useful God', zh: '用神' },
    'lineage_patterns': { en: 'Lineage Patterns', zh: '血脉模式' },
    'mythos_mapping': { en: 'Mythos Mapping', zh: '神话映射' }
  };

  return `
    <div class="exercise-selector">
      <h2>${lang === 'zh' ? '选择练习' : 'Choose an Exercise'}</h2>
      <p class="selector-intro">${lang === 'zh'
        ? '按技能浏览练习，或让系统为您选择。'
        : 'Browse exercises by skill, or let the system choose for you.'
      }</p>

      <div class="skill-categories">
        ${Object.entries(grouped).map(([skill, exercises]) => `
          <div class="skill-category">
            <h3>${skillLabels[skill as SkillId]?.[lang] || skill}</h3>
            <div class="exercise-list">
              ${exercises.map(ex => `
                <button class="exercise-btn difficulty-${ex.difficulty}" data-exercise="${ex.id}">
                  <span class="ex-question">${lang === 'zh' ? ex.questionZh : ex.question}</span>
                  <span class="ex-difficulty">${getDifficultyLabel(ex.difficulty, lang)}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="quick-actions">
        <button class="action-btn primary" id="random-exercise-btn">
          🎲 ${lang === 'zh' ? '随机练习' : 'Random Exercise'}
        </button>
        <button class="action-btn" id="adaptive-exercise-btn">
          🎯 ${lang === 'zh' ? '自适应练习' : 'Adaptive Practice'}
        </button>
      </div>
    </div>
  `;
}

/**
 * Render exercise panel
 */
function renderExercisePanel(data: PracticeModeUIData, lang: 'en' | 'zh'): string {
  const ex = data.currentExercise!;

  return `
    <div class="exercise-panel">
      <div class="exercise-meta">
        <span class="exercise-skill">${getSkillLabel(ex.skill, lang)}</span>
        <span class="exercise-difficulty difficulty-${ex.difficulty}">${getDifficultyLabel(ex.difficulty, lang)}</span>
      </div>

      <div class="exercise-question">
        <h2>${lang === 'zh' ? ex.questionZh : ex.question}</h2>
      </div>

      ${renderStepsSection(ex, data.currentStepIndex, lang)}
      ${renderHintsSection(ex, data.currentHintIndex, lang)}

      <div class="answer-section">
        <label for="user-answer">${lang === 'zh' ? '您的答案：' : 'Your Answer:'}</label>
        <input
          type="text"
          id="user-answer"
          class="answer-input"
          value="${data.userAnswer}"
          placeholder="${lang === 'zh' ? '在此输入答案...' : 'Type your answer here...'}"
          ${data.showingAnswer ? 'disabled' : ''}
        >

        <div class="answer-actions">
          ${!data.showingAnswer ? `
            <button class="action-btn primary" id="check-answer-btn">
              ✓ ${lang === 'zh' ? '检查答案' : 'Check Answer'}
            </button>
            <button class="action-btn" id="show-answer-btn">
              👁️ ${lang === 'zh' ? '显示答案' : 'Show Answer'}
            </button>
          ` : `
            <div class="correct-answer">
              <span class="answer-label">${lang === 'zh' ? '正确答案：' : 'Correct Answer:'}</span>
              <span class="answer-value">${ex.expected}</span>
            </div>
          `}
        </div>
      </div>

      <div class="exercise-navigation">
        <button class="nav-btn" id="skip-exercise-btn">
          ⏭️ ${lang === 'zh' ? '跳过' : 'Skip'}
        </button>
        <button class="nav-btn" id="next-exercise-btn" ${!data.showFeedback ? 'style="display:none"' : ''}>
          ➡️ ${lang === 'zh' ? '下一题' : 'Next Exercise'}
        </button>
      </div>
    </div>
  `;
}

/**
 * Render steps section
 */
function renderStepsSection(ex: PracticeExercise, currentIndex: number, lang: 'en' | 'zh'): string {
  if (!ex.steps || ex.steps.length === 0) return '';

  return `
    <div class="steps-section">
      <div class="steps-header">
        <h3>${lang === 'zh' ? '解题步骤' : 'Solution Steps'}</h3>
        <button class="reveal-btn" id="reveal-step-btn" ${currentIndex >= ex.steps.length ? 'disabled' : ''}>
          ${lang === 'zh' ? '显示下一步' : 'Reveal Next Step'} (${currentIndex}/${ex.steps.length})
        </button>
      </div>
      <ol class="steps-list">
        ${ex.steps.map((step, idx) => `
          <li class="step-item ${idx < currentIndex ? 'revealed' : 'hidden'}">
            ${idx < currentIndex ? (lang === 'zh' ? step.zh : step.en) : '???'}
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

/**
 * Render hints section
 */
function renderHintsSection(ex: PracticeExercise, currentIndex: number, lang: 'en' | 'zh'): string {
  if (!ex.hints || ex.hints.length === 0) return '';

  return `
    <div class="hints-section">
      <div class="hints-header">
        <h3>💡 ${lang === 'zh' ? '提示' : 'Hints'}</h3>
        <button class="reveal-btn" id="reveal-hint-btn" ${currentIndex >= ex.hints.length ? 'disabled' : ''}>
          ${lang === 'zh' ? '获取提示' : 'Get Hint'} (${currentIndex}/${ex.hints.length})
        </button>
      </div>
      <div class="hints-list">
        ${ex.hints.map((hint, idx) => `
          <div class="hint-item ${idx < currentIndex ? 'revealed' : 'hidden'}">
            ${idx < currentIndex ? (lang === 'zh' ? hint.zh : hint.en) : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render feedback panel
 */
function renderFeedbackPanel(attempt: PracticeAttempt, exercise: PracticeExercise, lang: 'en' | 'zh'): string {
  const isCorrect = attempt.correct;

  return `
    <div class="feedback-panel ${isCorrect ? 'correct' : 'incorrect'}">
      <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
      <div class="feedback-content">
        <h3>${isCorrect
          ? (lang === 'zh' ? '正确！' : 'Correct!')
          : (lang === 'zh' ? '不太对' : 'Not quite')
        }</h3>
        <p>${isCorrect
          ? (lang === 'zh' ? '做得好！继续保持。' : 'Well done! Keep it up.')
          : (lang === 'zh' ? `正确答案是：${exercise.expected}` : `The correct answer is: ${exercise.expected}`)
        }</p>
        ${!isCorrect && exercise.explanation ? `
          <div class="feedback-explanation">
            <strong>${lang === 'zh' ? '解释：' : 'Explanation:'}</strong>
            ${lang === 'zh' ? exercise.explanationZh : exercise.explanation}
          </div>
        ` : ''}
      </div>
      <button class="feedback-close" onclick="closeFeedback()">×</button>
    </div>
  `;
}

// ==================== HELPERS ====================

function getDifficultyLabel(difficulty: 'easy' | 'medium' | 'hard', lang: 'en' | 'zh'): string {
  const labels = {
    easy: { en: 'Easy', zh: '简单' },
    medium: { en: 'Medium', zh: '中等' },
    hard: { en: 'Hard', zh: '困难' }
  };
  return labels[difficulty][lang];
}

function getSkillLabel(skill: SkillId, lang: 'en' | 'zh'): string {
  const labels: Record<SkillId, { en: string; zh: string }> = {
    'pillar_calculation': { en: 'Pillar Calculation', zh: '柱位计算' },
    'stem_identification': { en: 'Stem ID', zh: '天干识别' },
    'branch_identification': { en: 'Branch ID', zh: '地支识别' },
    'clash_detection': { en: 'Clash Detection', zh: '冲检测' },
    'combination_detection': { en: 'Combination', zh: '合检测' },
    'harm_detection': { en: 'Harm Detection', zh: '害检测' },
    'luck_pillars': { en: 'Luck Pillars', zh: '大运' },
    'annual_analysis': { en: 'Annual', zh: '流年' },
    'day_master_strength': { en: 'DM Strength', zh: '日主' },
    'useful_god': { en: 'Useful God', zh: '用神' },
    'lineage_patterns': { en: 'Lineage', zh: '血脉' },
    'mythos_mapping': { en: 'Mythos', zh: '神话' }
  };
  return labels[skill]?.[lang] || skill;
}

// ==================== STYLES ====================

export function getPracticeModeStyles(theme: 'light' | 'dark' | 'temple'): string {
  const colors = {
    'light': { bg: '#f8f6f3', text: '#3a3a3a', accent: '#8b7355', card: '#ffffff', correct: '#4CAF50', incorrect: '#f44336' },
    'dark': { bg: '#1a1a2e', text: '#e8e4dc', accent: '#c9a96e', card: '#252545', correct: '#66BB6A', incorrect: '#ef5350' },
    'temple': { bg: '#2d2416', text: '#e8dcc8', accent: '#d4a84b', card: '#3d3220', correct: '#8BC34A', incorrect: '#ff7043' }
  };
  const c = colors[theme];

  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: ${c.bg};
  color: ${c.text};
  min-height: 100vh;
}

.practice-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

/* Header */
.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 24px;
  border-bottom: 2px solid ${c.accent}30;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon { font-size: 2rem; }
.practice-header h1 { font-size: 1.5rem; }

.session-stats {
  display: flex;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${c.accent};
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.7;
}

.stat.streak .stat-value { color: ${c.correct}; }

/* Exercise Selector */
.exercise-selector {
  text-align: center;
}

.exercise-selector h2 { margin-bottom: 8px; }
.selector-intro { opacity: 0.7; margin-bottom: 32px; }

.skill-categories {
  text-align: left;
  margin-bottom: 32px;
}

.skill-category {
  margin-bottom: 24px;
}

.skill-category h3 {
  font-size: 1rem;
  color: ${c.accent};
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${c.accent}30;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exercise-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${c.card};
  border: 2px solid transparent;
  border-radius: 8px;
  color: ${c.text};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.exercise-btn:hover {
  border-color: ${c.accent};
}

.ex-question { flex: 1; }

.ex-difficulty {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  background: ${c.bg};
}

.difficulty-easy .ex-difficulty { color: ${c.correct}; }
.difficulty-medium .ex-difficulty { color: ${c.accent}; }
.difficulty-hard .ex-difficulty { color: ${c.incorrect}; }

.quick-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.action-btn {
  padding: 14px 28px;
  background: ${c.card};
  border: 2px solid ${c.accent}40;
  border-radius: 8px;
  color: ${c.text};
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover { border-color: ${c.accent}; }
.action-btn.primary { background: ${c.accent}; color: ${c.bg}; border-color: ${c.accent}; }
.action-btn.primary:hover { filter: brightness(1.1); }

/* Exercise Panel */
.exercise-panel {
  background: ${c.card};
  padding: 32px;
  border-radius: 16px;
}

.exercise-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.exercise-skill, .exercise-difficulty {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 12px;
  background: ${c.bg};
}

.exercise-question h2 {
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

/* Steps & Hints */
.steps-section, .hints-section {
  background: ${c.bg};
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.steps-header, .hints-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.steps-header h3, .hints-header h3 {
  font-size: 1rem;
  color: ${c.accent};
}

.reveal-btn {
  padding: 6px 14px;
  background: ${c.accent}20;
  border: 1px solid ${c.accent}40;
  border-radius: 6px;
  color: ${c.text};
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.reveal-btn:hover:not(:disabled) { background: ${c.accent}40; }
.reveal-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.steps-list {
  padding-left: 24px;
}

.step-item {
  padding: 8px 0;
  line-height: 1.5;
}

.step-item.hidden { color: ${c.accent}40; font-style: italic; }

.hints-list { display: flex; flex-direction: column; gap: 8px; }

.hint-item {
  padding: 12px;
  background: ${c.card};
  border-radius: 8px;
  border-left: 3px solid ${c.accent};
}

.hint-item.hidden { display: none; }

/* Answer Section */
.answer-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${c.accent}30;
}

.answer-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.answer-input {
  width: 100%;
  padding: 14px;
  border: 2px solid ${c.accent}40;
  border-radius: 8px;
  background: ${c.bg};
  color: ${c.text};
  font-family: inherit;
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.answer-input:focus {
  outline: none;
  border-color: ${c.accent};
}

.answer-actions {
  display: flex;
  gap: 12px;
}

.correct-answer {
  padding: 16px;
  background: ${c.accent}20;
  border-radius: 8px;
}

.answer-label { opacity: 0.7; }
.answer-value { font-weight: bold; font-size: 1.2rem; color: ${c.accent}; margin-left: 8px; }

/* Navigation */
.exercise-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${c.accent}20;
}

.nav-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${c.accent}40;
  border-radius: 6px;
  color: ${c.text};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover { border-color: ${c.accent}; background: ${c.accent}10; }

/* Feedback Panel */
.feedback-panel {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  max-width: 500px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateX(-50%) translateY(100%); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

.feedback-panel.correct { background: ${c.correct}; color: white; }
.feedback-panel.incorrect { background: ${c.incorrect}; color: white; }

.feedback-icon { font-size: 2rem; }

.feedback-content h3 { margin-bottom: 4px; }
.feedback-content p { font-size: 0.9rem; opacity: 0.9; }

.feedback-explanation {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.3);
  font-size: 0.85rem;
}

.feedback-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.8;
}

.feedback-close:hover { opacity: 1; }

/* Footer */
.practice-footer {
  text-align: center;
  padding: 24px;
  margin-top: 48px;
  opacity: 0.5;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .practice-header { flex-direction: column; gap: 16px; }
  .session-stats { justify-content: center; }
  .quick-actions { flex-direction: column; }
  .answer-actions { flex-direction: column; }
  .feedback-panel { left: 16px; right: 16px; transform: none; }
}
  `.trim();
}

// ==================== SCRIPT ====================

export function getPracticeModeScript(): string {
  return `
(function() {
  let currentHintIndex = 0;
  let currentStepIndex = 0;

  // Exercise selection
  document.addEventListener('click', function(e) {
    const exerciseBtn = e.target.closest('.exercise-btn');
    if (exerciseBtn) {
      const exerciseId = exerciseBtn.dataset.exercise;
      window.dispatchEvent(new CustomEvent('select-exercise', { detail: { exerciseId } }));
    }
  });

  // Random exercise
  const randomBtn = document.getElementById('random-exercise-btn');
  if (randomBtn) {
    randomBtn.addEventListener('click', function() {
      window.dispatchEvent(new CustomEvent('random-exercise'));
    });
  }

  // Adaptive exercise
  const adaptiveBtn = document.getElementById('adaptive-exercise-btn');
  if (adaptiveBtn) {
    adaptiveBtn.addEventListener('click', function() {
      window.dispatchEvent(new CustomEvent('adaptive-exercise'));
    });
  }

  // Reveal hint
  const revealHintBtn = document.getElementById('reveal-hint-btn');
  if (revealHintBtn) {
    revealHintBtn.addEventListener('click', function() {
      currentHintIndex++;
      window.dispatchEvent(new CustomEvent('reveal-hint', { detail: { index: currentHintIndex } }));
    });
  }

  // Reveal step
  const revealStepBtn = document.getElementById('reveal-step-btn');
  if (revealStepBtn) {
    revealStepBtn.addEventListener('click', function() {
      currentStepIndex++;
      window.dispatchEvent(new CustomEvent('reveal-step', { detail: { index: currentStepIndex } }));
    });
  }

  // Check answer
  const checkBtn = document.getElementById('check-answer-btn');
  if (checkBtn) {
    checkBtn.addEventListener('click', function() {
      const input = document.getElementById('user-answer');
      const answer = input ? input.value.trim() : '';
      window.dispatchEvent(new CustomEvent('check-answer', { detail: { answer } }));
    });
  }

  // Show answer
  const showBtn = document.getElementById('show-answer-btn');
  if (showBtn) {
    showBtn.addEventListener('click', function() {
      window.dispatchEvent(new CustomEvent('show-answer'));
    });
  }

  // Skip exercise
  const skipBtn = document.getElementById('skip-exercise-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', function() {
      window.dispatchEvent(new CustomEvent('skip-exercise'));
    });
  }

  // Next exercise
  const nextBtn = document.getElementById('next-exercise-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      currentHintIndex = 0;
      currentStepIndex = 0;
      window.dispatchEvent(new CustomEvent('next-exercise'));
    });
  }

  // Close feedback
  window.closeFeedback = function() {
    const panel = document.querySelector('.feedback-panel');
    if (panel) panel.remove();
  };

  // Enter key to check answer
  const answerInput = document.getElementById('user-answer');
  if (answerInput) {
    answerInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const answer = this.value.trim();
        window.dispatchEvent(new CustomEvent('check-answer', { detail: { answer } }));
      }
    });
  }
})();
  `.trim();
}

// ==================== COMPONENT EXPORTS ====================

/**
 * Render just the exercise card
 */
export function renderExerciseCard(exercise: PracticeExercise, lang: 'en' | 'zh' = 'en'): string {
  return `
    <div class="exercise-card difficulty-${exercise.difficulty}">
      <div class="card-meta">
        <span class="card-skill">${getSkillLabel(exercise.skill, lang)}</span>
        <span class="card-difficulty">${getDifficultyLabel(exercise.difficulty, lang)}</span>
      </div>
      <p class="card-question">${lang === 'zh' ? exercise.questionZh : exercise.question}</p>
    </div>
  `;
}

// ==================== EXPORTS ====================

export {
  renderPracticeModeHtml,
  renderExerciseCard,
  getPracticeModeStyles,
  getPracticeModeScript,
  PracticeModeUIData
};
