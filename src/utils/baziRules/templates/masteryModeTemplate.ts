/**
 * ============================================
 * MASTERY MODE UI TEMPLATE
 * Skill Trees, Progress Tracking, Adaptive Learning
 *
 * Features:
 * - Visual skill tree
 * - Progress bars and levels
 * - Achievement badges
 * - Spaced repetition calendar
 * - Overall mastery dashboard
 *
 * "From novice to master, track every step."
 * ============================================
 */

import {
  MasteryState,
  SkillNode,
  SkillProgress,
  MasteryLevel,
  Achievement,
  ReviewRecommendation,
  SkillCategory,
  SKILL_TREE,
  ACHIEVEMENTS,
  getMasteryStats
} from '../masteryMode';

// ==================== DATA MODEL ====================

export interface MasteryModeUIData {
  // State
  masteryState: MasteryState;

  // View
  activeTab: 'tree' | 'progress' | 'achievements' | 'review';

  // Review
  reviewRecommendations?: ReviewRecommendation[];

  // Settings
  lang: 'en' | 'zh';
  theme: 'light' | 'dark' | 'temple';
}

// ==================== HTML RENDERING ====================

/**
 * Render Mastery Mode page
 */
export function renderMasteryModeHtml(data: MasteryModeUIData): string {
  const { lang = 'en', theme = 'temple' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '精通模式 — 大教堂学院' : 'Mastery Mode — Cathedral Academy'}</title>
  <style>
    ${getMasteryModeStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="mastery-container">

    <header class="mastery-header">
      ${renderLevelBadge(data.masteryState, lang)}
      <h1>${lang === 'zh' ? '精通模式' : 'Mastery Mode'}</h1>
      ${renderOverallProgress(data.masteryState, lang)}
    </header>

    <nav class="mastery-nav">
      <button class="nav-tab ${data.activeTab === 'tree' ? 'active' : ''}" data-tab="tree">
        🌳 ${lang === 'zh' ? '技能树' : 'Skill Tree'}
      </button>
      <button class="nav-tab ${data.activeTab === 'progress' ? 'active' : ''}" data-tab="progress">
        📊 ${lang === 'zh' ? '进度' : 'Progress'}
      </button>
      <button class="nav-tab ${data.activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">
        🏆 ${lang === 'zh' ? '成就' : 'Achievements'}
      </button>
      <button class="nav-tab ${data.activeTab === 'review' ? 'active' : ''}" data-tab="review">
        📅 ${lang === 'zh' ? '复习' : 'Review'}
      </button>
    </nav>

    <main class="mastery-main">
      <section class="tab-panel ${data.activeTab === 'tree' ? 'active' : ''}" id="tree-panel">
        ${renderSkillTree(data.masteryState, lang)}
      </section>

      <section class="tab-panel ${data.activeTab === 'progress' ? 'active' : ''}" id="progress-panel">
        ${renderProgressPanel(data.masteryState, lang)}
      </section>

      <section class="tab-panel ${data.activeTab === 'achievements' ? 'active' : ''}" id="achievements-panel">
        ${renderAchievementsPanel(data.masteryState, lang)}
      </section>

      <section class="tab-panel ${data.activeTab === 'review' ? 'active' : ''}" id="review-panel">
        ${renderReviewPanel(data.reviewRecommendations || [], lang)}
      </section>
    </main>

    <footer class="mastery-footer">
      <p>${lang === 'zh' ? '大教堂学院 · 精益求精' : 'Cathedral Academy · Pursuit of Mastery'}</p>
    </footer>

  </div>

  <script>
    ${getMasteryModeScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render level badge
 */
function renderLevelBadge(state: MasteryState, lang: 'en' | 'zh'): string {
  return `
    <div class="level-badge">
      <span class="level-number">${state.currentLevel}</span>
      <span class="level-label">${lang === 'zh' ? '级' : 'Lv'}</span>
    </div>
  `;
}

/**
 * Render overall progress summary
 */
function renderOverallProgress(state: MasteryState, lang: 'en' | 'zh'): string {
  const stats = getMasteryStats(state);

  return `
    <div class="overall-progress">
      <div class="xp-bar">
        <div class="xp-fill" style="width: ${100 - (stats.xpToNextLevel / 100) * 100}%"></div>
        <span class="xp-text">${state.totalXP} XP</span>
      </div>
      <div class="quick-stats">
        <span>${stats.skillsMastered}/${stats.totalSkills} ${lang === 'zh' ? '技能精通' : 'skills mastered'}</span>
        <span>${stats.accuracy}% ${lang === 'zh' ? '准确率' : 'accuracy'}</span>
      </div>
    </div>
  `;
}

/**
 * Render skill tree
 */
function renderSkillTree(state: MasteryState, lang: 'en' | 'zh'): string {
  const categories: SkillCategory[] = ['foundations', 'interactions', 'timing', 'analysis', 'integration'];

  const categoryLabels: Record<SkillCategory, { en: string; zh: string; icon: string }> = {
    'foundations': { en: 'Foundations', zh: '基础', icon: '🏗️' },
    'interactions': { en: 'Interactions', zh: '交互', icon: '🔗' },
    'timing': { en: 'Timing', zh: '时机', icon: '⏱️' },
    'analysis': { en: 'Analysis', zh: '分析', icon: '🔍' },
    'integration': { en: 'Integration', zh: '整合', icon: '✨' }
  };

  return `
    <div class="skill-tree">
      <h2>${lang === 'zh' ? '技能树' : 'Skill Tree'}</h2>
      <p class="tree-intro">${lang === 'zh'
        ? '解锁技能以进入更高级的学习领域。'
        : 'Unlock skills to advance to higher learning areas.'
      }</p>

      <div class="tree-container">
        ${categories.map(cat => {
          const catLabel = categoryLabels[cat];
          const skills = SKILL_TREE.filter(s => s.category === cat);

          return `
            <div class="tree-category">
              <div class="category-header">
                <span class="cat-icon">${catLabel.icon}</span>
                <h3>${lang === 'zh' ? catLabel.zh : catLabel.en}</h3>
              </div>
              <div class="skill-nodes">
                ${skills.map(skill => renderSkillNode(skill, state.progress[skill.id], state, lang)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Render single skill node
 */
function renderSkillNode(
  skill: SkillNode,
  progress: SkillProgress,
  state: MasteryState,
  lang: 'en' | 'zh'
): string {
  const isUnlocked = skill.prerequisites.every(prereq =>
    state.progress[prereq] && state.progress[prereq].proficiency >= 20
  );

  const levelClass = progress.level;
  const proficiency = progress.proficiency;

  return `
    <div
      class="skill-node ${levelClass} ${isUnlocked ? 'unlocked' : 'locked'}"
      data-skill="${skill.id}"
      title="${lang === 'zh' ? skill.descriptionZh : skill.description}"
    >
      <div class="node-icon">${getSkillIcon(skill.id)}</div>
      <div class="node-info">
        <span class="node-name">${lang === 'zh' ? skill.labelZh : skill.label}</span>
        <div class="node-progress">
          <div class="progress-fill" style="width: ${proficiency}%"></div>
        </div>
        <span class="node-level">${getMasteryLevelLabel(progress.level, lang)} (${proficiency}%)</span>
      </div>
      ${!isUnlocked ? `<div class="lock-overlay">🔒</div>` : ''}
    </div>
  `;
}

/**
 * Render progress panel
 */
function renderProgressPanel(state: MasteryState, lang: 'en' | 'zh'): string {
  const stats = getMasteryStats(state);

  return `
    <div class="progress-panel">
      <h2>${lang === 'zh' ? '进度概览' : 'Progress Overview'}</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📚</span>
          <span class="stat-value">${stats.totalAttempts}</span>
          <span class="stat-label">${lang === 'zh' ? '总练习次数' : 'Total Attempts'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✓</span>
          <span class="stat-value">${stats.totalCorrect}</span>
          <span class="stat-label">${lang === 'zh' ? '正确次数' : 'Correct'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🎯</span>
          <span class="stat-value">${stats.accuracy}%</span>
          <span class="stat-label">${lang === 'zh' ? '准确率' : 'Accuracy'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${stats.currentStreak}</span>
          <span class="stat-label">${lang === 'zh' ? '当前连胜' : 'Current Streak'}</span>
        </div>
      </div>

      <h3>${lang === 'zh' ? '各技能进度' : 'Skill Progress'}</h3>
      <div class="skill-progress-list">
        ${SKILL_TREE.map(skill => {
          const prog = state.progress[skill.id];
          return `
            <div class="skill-progress-row">
              <span class="skill-name">${lang === 'zh' ? skill.labelZh : skill.label}</span>
              <div class="skill-bar">
                <div class="bar-fill level-${prog.level}" style="width: ${prog.proficiency}%"></div>
              </div>
              <span class="skill-percent">${prog.proficiency}%</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Render achievements panel
 */
function renderAchievementsPanel(state: MasteryState, lang: 'en' | 'zh'): string {
  const unlockedIds = state.achievements.map(a => a.id);

  return `
    <div class="achievements-panel">
      <h2>${lang === 'zh' ? '成就' : 'Achievements'}</h2>
      <p class="achievements-intro">${lang === 'zh'
        ? `已解锁 ${state.achievements.length}/${ACHIEVEMENTS.length} 个成就`
        : `Unlocked ${state.achievements.length}/${ACHIEVEMENTS.length} achievements`
      }</p>

      <div class="achievements-grid">
        ${ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedIds.includes(ach.id);
          const unlocked = state.achievements.find(a => a.id === ach.id);

          return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <div class="ach-icon">${getAchievementIcon(ach.id)}</div>
              <div class="ach-info">
                <h4>${lang === 'zh' ? ach.nameZh : ach.name}</h4>
                <p>${lang === 'zh' ? ach.descriptionZh : ach.description}</p>
                ${isUnlocked && unlocked?.unlockedAt ? `
                  <span class="unlock-date">${new Date(unlocked.unlockedAt).toLocaleDateString()}</span>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Render review panel
 */
function renderReviewPanel(recommendations: ReviewRecommendation[], lang: 'en' | 'zh'): string {
  if (recommendations.length === 0) {
    return `
      <div class="review-panel empty">
        <div class="empty-icon">📅</div>
        <h2>${lang === 'zh' ? '没有待复习的技能' : 'No Skills Due for Review'}</h2>
        <p>${lang === 'zh'
          ? '继续练习以建立您的复习计划。'
          : 'Keep practicing to build up your review schedule.'
        }</p>
      </div>
    `;
  }

  return `
    <div class="review-panel">
      <h2>${lang === 'zh' ? '复习计划' : 'Review Schedule'}</h2>
      <p class="review-intro">${lang === 'zh'
        ? '基于间隔重复算法的智能复习推荐。'
        : 'Smart review recommendations based on spaced repetition.'
      }</p>

      <div class="review-list">
        ${recommendations.map(rec => {
          const skill = SKILL_TREE.find(s => s.id === rec.skillId);
          if (!skill) return '';

          return `
            <div class="review-card priority-${rec.priority}">
              <div class="review-priority">
                ${getPriorityIcon(rec.priority)}
                <span>${getPriorityLabel(rec.priority, lang)}</span>
              </div>
              <div class="review-info">
                <h4>${lang === 'zh' ? skill.labelZh : skill.label}</h4>
                <p>${lang === 'zh' ? rec.reasonZh : rec.reason}</p>
              </div>
              <button class="review-btn" data-skill="${rec.skillId}">
                ${lang === 'zh' ? '开始复习' : 'Start Review'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ==================== HELPERS ====================

function getSkillIcon(skillId: string): string {
  const icons: Record<string, string> = {
    'pillar_calculation': '🏛️',
    'stem_identification': '☰',
    'branch_identification': '🐲',
    'clash_detection': '⚡',
    'combination_detection': '🔗',
    'harm_detection': '☠️',
    'luck_pillars': '📅',
    'annual_analysis': '📆',
    'day_master_strength': '💪',
    'useful_god': '🎯',
    'lineage_patterns': '🧬',
    'mythos_mapping': '✨'
  };
  return icons[skillId] || '📘';
}

function getAchievementIcon(achievementId: string): string {
  const icons: Record<string, string> = {
    'first_correct': '🌱',
    'first_skill_mastered': '⭐',
    'streak_5': '🔥',
    'streak_10': '💥',
    'foundations_complete': '🏗️',
    'interactions_complete': '🔗',
    'full_mastery': '👑'
  };
  return icons[achievementId] || '🏆';
}

function getMasteryLevelLabel(level: MasteryLevel, lang: 'en' | 'zh'): string {
  const labels: Record<MasteryLevel, { en: string; zh: string }> = {
    'novice': { en: 'Novice', zh: '新手' },
    'beginner': { en: 'Beginner', zh: '初学' },
    'intermediate': { en: 'Intermediate', zh: '中级' },
    'advanced': { en: 'Advanced', zh: '高级' },
    'master': { en: 'Master', zh: '大师' }
  };
  return labels[level][lang];
}

function getPriorityIcon(priority: 'urgent' | 'due' | 'optional'): string {
  const icons = { urgent: '🔴', due: '🟡', optional: '🟢' };
  return icons[priority];
}

function getPriorityLabel(priority: 'urgent' | 'due' | 'optional', lang: 'en' | 'zh'): string {
  const labels = {
    urgent: { en: 'Urgent', zh: '紧急' },
    due: { en: 'Due', zh: '到期' },
    optional: { en: 'Optional', zh: '可选' }
  };
  return labels[priority][lang];
}

// ==================== STYLES ====================

export function getMasteryModeStyles(theme: 'light' | 'dark' | 'temple'): string {
  const colors = {
    'light': { bg: '#f8f6f3', text: '#3a3a3a', accent: '#8b7355', card: '#ffffff' },
    'dark': { bg: '#1a1a2e', text: '#e8e4dc', accent: '#c9a96e', card: '#252545' },
    'temple': { bg: '#2d2416', text: '#e8dcc8', accent: '#d4a84b', card: '#3d3220' }
  };
  const c = colors[theme];

  const levelColors = {
    novice: '#9e9e9e',
    beginner: '#4CAF50',
    intermediate: '#2196F3',
    advanced: '#9C27B0',
    master: '#FF9800'
  };

  return `
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: ${c.bg};
  color: ${c.text};
  min-height: 100vh;
}

.mastery-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* Header */
.mastery-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 0;
  margin-bottom: 16px;
}

.level-badge {
  width: 60px;
  height: 60px;
  background: ${c.accent};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${c.bg};
}

.level-number { font-size: 1.5rem; font-weight: bold; line-height: 1; }
.level-label { font-size: 0.7rem; }

.mastery-header h1 { font-size: 1.8rem; }

.overall-progress { margin-left: auto; text-align: right; }

.xp-bar {
  width: 200px;
  height: 20px;
  background: ${c.card};
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.xp-fill { height: 100%; background: ${c.accent}; }

.xp-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: bold;
}

.quick-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Navigation */
.mastery-nav {
  display: flex;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 2px solid ${c.accent}30;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.nav-tab {
  padding: 10px 20px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 8px;
  color: ${c.text};
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-tab:hover { background: ${c.accent}20; }
.nav-tab.active { background: ${c.accent}; color: ${c.bg}; }

/* Tab Panels */
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* Skill Tree */
.skill-tree h2 { margin-bottom: 8px; }
.tree-intro { opacity: 0.7; margin-bottom: 24px; }

.tree-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tree-category {
  background: ${c.card};
  padding: 24px;
  border-radius: 12px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.cat-icon { font-size: 1.5rem; }
.category-header h3 { font-size: 1.1rem; }

.skill-nodes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.skill-node {
  position: relative;
  padding: 16px;
  background: ${c.bg};
  border-radius: 8px;
  border-left: 4px solid ${levelColors.novice};
  cursor: pointer;
  transition: all 0.2s;
}

.skill-node:hover { transform: translateY(-2px); }

.skill-node.locked { opacity: 0.5; cursor: not-allowed; }
.skill-node.locked:hover { transform: none; }

.skill-node.novice { border-color: ${levelColors.novice}; }
.skill-node.beginner { border-color: ${levelColors.beginner}; }
.skill-node.intermediate { border-color: ${levelColors.intermediate}; }
.skill-node.advanced { border-color: ${levelColors.advanced}; }
.skill-node.master { border-color: ${levelColors.master}; }

.node-icon { font-size: 1.5rem; margin-bottom: 8px; }
.node-name { display: block; font-weight: bold; margin-bottom: 8px; }

.node-progress {
  height: 6px;
  background: ${c.card};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill { height: 100%; background: ${c.accent}; }

.node-level { font-size: 0.75rem; opacity: 0.7; }

.lock-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.2rem;
}

/* Progress Panel */
.progress-panel h2 { margin-bottom: 24px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: ${c.card};
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-icon { font-size: 2rem; display: block; margin-bottom: 8px; }
.stat-value { font-size: 2rem; font-weight: bold; color: ${c.accent}; display: block; }
.stat-label { font-size: 0.85rem; opacity: 0.7; }

.progress-panel h3 { margin-bottom: 16px; }

.skill-progress-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: ${c.card};
  border-radius: 8px;
}

.skill-name { width: 150px; font-weight: bold; }

.skill-bar {
  flex: 1;
  height: 8px;
  background: ${c.bg};
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill { height: 100%; transition: width 0.3s; }

.bar-fill.level-novice { background: ${levelColors.novice}; }
.bar-fill.level-beginner { background: ${levelColors.beginner}; }
.bar-fill.level-intermediate { background: ${levelColors.intermediate}; }
.bar-fill.level-advanced { background: ${levelColors.advanced}; }
.bar-fill.level-master { background: ${levelColors.master}; }

.skill-percent { width: 50px; text-align: right; font-weight: bold; }

/* Achievements Panel */
.achievements-panel h2 { margin-bottom: 8px; }
.achievements-intro { opacity: 0.7; margin-bottom: 24px; }

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${c.card};
  border-radius: 12px;
  transition: all 0.2s;
}

.achievement-card.locked { opacity: 0.5; }
.achievement-card.unlocked { border-left: 4px solid ${c.accent}; }

.ach-icon { font-size: 2.5rem; }
.ach-info h4 { margin-bottom: 4px; }
.ach-info p { font-size: 0.85rem; opacity: 0.7; }
.unlock-date { font-size: 0.75rem; color: ${c.accent}; }

/* Review Panel */
.review-panel h2 { margin-bottom: 8px; }
.review-intro { opacity: 0.7; margin-bottom: 24px; }

.review-panel.empty {
  text-align: center;
  padding: 64px;
}

.empty-icon { font-size: 4rem; margin-bottom: 16px; }

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: ${c.card};
  border-radius: 12px;
}

.review-priority {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 60px;
}

.review-priority span { font-size: 0.75rem; }

.review-info { flex: 1; }
.review-info h4 { margin-bottom: 4px; }
.review-info p { font-size: 0.85rem; opacity: 0.7; }

.review-btn {
  padding: 10px 20px;
  background: ${c.accent};
  border: none;
  border-radius: 6px;
  color: ${c.bg};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.review-btn:hover { filter: brightness(1.1); }

/* Footer */
.mastery-footer {
  text-align: center;
  padding: 24px;
  margin-top: 48px;
  opacity: 0.5;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .mastery-header { flex-direction: column; text-align: center; }
  .overall-progress { margin: 0; text-align: center; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .skill-nodes { grid-template-columns: 1fr; }
  .review-card { flex-direction: column; text-align: center; }
}
  `.trim();
}

// ==================== SCRIPT ====================

export function getMasteryModeScript(): string {
  return `
(function() {
  // Tab switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tabName + '-panel').classList.add('active');
    });
  });

  // Skill node click
  document.querySelectorAll('.skill-node.unlocked').forEach(node => {
    node.addEventListener('click', function() {
      const skillId = this.dataset.skill;
      window.dispatchEvent(new CustomEvent('practice-skill', { detail: { skillId } }));
    });
  });

  // Review button click
  document.querySelectorAll('.review-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const skillId = this.dataset.skill;
      window.dispatchEvent(new CustomEvent('review-skill', { detail: { skillId } }));
    });
  });
})();
  `.trim();
}

// ==================== COMPONENT EXPORTS ====================

/**
 * Render skill tree component only
 */
export function renderSkillTreeComponent(state: MasteryState, lang: 'en' | 'zh' = 'en'): string {
  return renderSkillTree(state, lang);
}

/**
 * Render achievement badge
 */
export function renderAchievementBadge(achievement: Achievement, isUnlocked: boolean): string {
  return `
    <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
      <span class="badge-icon">${getAchievementIcon(achievement.id)}</span>
      <span class="badge-name">${achievement.name}</span>
    </div>
  `;
}

// ==================== EXPORTS ====================

export {
  renderMasteryModeHtml,
  renderSkillTreeComponent,
  renderAchievementBadge,
  getMasteryModeStyles,
  getMasteryModeScript,
  MasteryModeUIData
};
