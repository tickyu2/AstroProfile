/**
 * ============================================
 * GUIDE MODE UI TEMPLATE
 * Ever-Present Educational Layer
 *
 * Features:
 * - Level selector (Elementary/High School/University)
 * - Explanation overlay panel
 * - Contextual tooltips
 * - Concept links
 *
 * "Understand what you see at your own level."
 * ============================================
 */

import { GuideLevel, Explanation, GuideContext, EXPLANATIONS } from '../guideMode';

// ==================== DATA MODEL ====================

export interface GuideModeUIData {
  // Current state
  currentLevel: GuideLevel;
  activeExplanation?: Explanation;
  isOverlayOpen: boolean;

  // Context
  context?: GuideContext;

  // Settings
  lang: 'en' | 'zh';
  theme: 'light' | 'dark' | 'temple';
}

// ==================== HTML RENDERING ====================

/**
 * Render Guide Mode overlay
 */
export function renderGuideModeHtml(data: GuideModeUIData): string {
  const { lang = 'en', theme = 'temple' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '指南模式' : 'Guide Mode'}</title>
  <style>
    ${getGuideModeStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">

  ${renderLevelSelector(data.currentLevel, lang)}
  ${renderExplanationOverlay(data.activeExplanation, data.isOverlayOpen, data.currentLevel, lang)}

  <script>
    ${getGuideModeScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render level selector component
 */
export function renderLevelSelector(currentLevel: GuideLevel, lang: 'en' | 'zh'): string {
  const levels: Array<{ id: GuideLevel; label: string; labelZh: string; icon: string }> = [
    { id: 'elementary', label: 'Elementary', labelZh: '基础', icon: '🌱' },
    { id: 'highschool', label: 'High School', labelZh: '中级', icon: '📚' },
    { id: 'university', label: 'University', labelZh: '高级', icon: '🎓' }
  ];

  return `
    <div class="guide-level-selector">
      <span class="level-label">${lang === 'zh' ? '解释级别：' : 'Explanation Level:'}</span>
      <div class="level-buttons">
        ${levels.map(l => `
          <button
            class="level-btn ${currentLevel === l.id ? 'active' : ''}"
            data-level="${l.id}"
            title="${lang === 'zh' ? l.labelZh : l.label}"
          >
            <span class="level-icon">${l.icon}</span>
            <span class="level-name">${lang === 'zh' ? l.labelZh : l.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render explanation overlay
 */
export function renderExplanationOverlay(
  explanation: Explanation | undefined,
  isOpen: boolean,
  level: GuideLevel,
  lang: 'en' | 'zh'
): string {
  if (!explanation) {
    return `
      <div class="explanation-overlay ${isOpen ? 'open' : ''}" id="explanation-overlay">
        <div class="overlay-backdrop" onclick="closeExplanation()"></div>
        <div class="overlay-panel">
          <button class="close-btn" onclick="closeExplanation()">&times;</button>
          <div class="explanation-empty">
            <span class="empty-icon">📖</span>
            <p>${lang === 'zh' ? '点击任何术语以查看解释' : 'Click any term to see its explanation'}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Get content for current level
  const content = explanation.levels[level];

  return `
    <div class="explanation-overlay ${isOpen ? 'open' : ''}" id="explanation-overlay">
      <div class="overlay-backdrop" onclick="closeExplanation()"></div>
      <div class="overlay-panel">
        <button class="close-btn" onclick="closeExplanation()">&times;</button>

        <header class="explanation-header">
          <div class="explanation-category">${explanation.category}</div>
          <h2>${lang === 'zh' ? explanation.termZh : explanation.term}</h2>
        </header>

        <section class="explanation-body">
          <p class="explanation-text">${lang === 'zh' ? content.textZh : content.text}</p>

          ${content.example ? `
            <div class="explanation-example">
              <h4>${lang === 'zh' ? '示例' : 'Example'}</h4>
              <p>${lang === 'zh' ? content.exampleZh : content.example}</p>
            </div>
          ` : ''}

          ${content.formula ? `
            <div class="explanation-formula">
              <h4>${lang === 'zh' ? '公式/步骤' : 'Formula/Steps'}</h4>
              <code>${content.formula}</code>
            </div>
          ` : ''}

          ${explanation.relatedIds && explanation.relatedIds.length > 0 ? `
            <div class="related-concepts">
              <h4>${lang === 'zh' ? '相关概念' : 'Related Concepts'}</h4>
              <div class="related-tags">
                ${explanation.relatedIds.map(id => {
                  const related = EXPLANATIONS[id];
                  return related ? `
                    <button class="related-tag" data-explain="${id}">
                      ${lang === 'zh' ? related.termZh : related.term}
                    </button>
                  ` : '';
                }).join('')}
              </div>
            </div>
          ` : ''}
        </section>

        <footer class="explanation-footer">
          <span class="current-level-badge">${getLevelLabel(level, lang)}</span>
        </footer>
      </div>
    </div>
  `;
}

/**
 * Render inline explanation tooltip trigger
 */
export function renderExplainableTerm(
  termId: string,
  displayText: string,
  lang: 'en' | 'zh' = 'en'
): string {
  const explanation = EXPLANATIONS[termId];
  if (!explanation) return displayText;

  return `
    <span
      class="explainable-term"
      data-explain="${termId}"
      tabindex="0"
      role="button"
      aria-label="${lang === 'zh' ? '点击了解更多' : 'Click to learn more'}"
    >
      ${displayText}
      <span class="explain-indicator">?</span>
    </span>
  `;
}

/**
 * Render explanation card (for embedding)
 */
export function renderExplanationCard(
  explanationId: string,
  level: GuideLevel,
  lang: 'en' | 'zh'
): string {
  const explanation = EXPLANATIONS[explanationId];
  if (!explanation) return '';

  const content = explanation.levels[level];

  return `
    <div class="explanation-card">
      <div class="card-header">
        <span class="card-category">${explanation.category}</span>
        <h3>${lang === 'zh' ? explanation.termZh : explanation.term}</h3>
      </div>
      <p class="card-text">${lang === 'zh' ? content.textZh : content.text}</p>
      ${content.example ? `
        <div class="card-example">
          <strong>${lang === 'zh' ? '例：' : 'e.g.:'}</strong> ${lang === 'zh' ? content.exampleZh : content.example}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render all explanations as reference page
 */
export function renderExplanationReferencePage(level: GuideLevel, lang: 'en' | 'zh'): string {
  const grouped: Record<string, Array<{ id: string; exp: Explanation }>> = {};

  Object.entries(EXPLANATIONS).forEach(([id, exp]) => {
    if (!grouped[exp.category]) grouped[exp.category] = [];
    grouped[exp.category].push({ id, exp });
  });

  return `
    <div class="explanation-reference">
      <h1>${lang === 'zh' ? '概念参考手册' : 'Concept Reference Manual'}</h1>
      <p class="ref-intro">${lang === 'zh'
        ? '点击任何术语以展开完整解释。当前显示：' + getLevelLabel(level, lang)
        : 'Click any term to expand its full explanation. Currently showing: ' + getLevelLabel(level, lang)
      }</p>

      ${Object.entries(grouped).map(([category, items]) => `
        <section class="reference-category">
          <h2>${category}</h2>
          <div class="reference-grid">
            ${items.map(({ id, exp }) => renderExplanationCard(id, level, lang)).join('')}
          </div>
        </section>
      `).join('')}
    </div>
  `;
}

// ==================== HELPERS ====================

function getLevelLabel(level: GuideLevel, lang: 'en' | 'zh'): string {
  const labels: Record<GuideLevel, { en: string; zh: string }> = {
    'elementary': { en: 'Elementary', zh: '基础级' },
    'highschool': { en: 'High School', zh: '中级' },
    'university': { en: 'University', zh: '高级' }
  };
  return labels[level][lang];
}

// ==================== STYLES ====================

export function getGuideModeStyles(theme: 'light' | 'dark' | 'temple'): string {
  const colors = {
    'light': { bg: '#f8f6f3', text: '#3a3a3a', accent: '#8b7355', card: '#ffffff', overlay: 'rgba(0,0,0,0.5)' },
    'dark': { bg: '#1a1a2e', text: '#e8e4dc', accent: '#c9a96e', card: '#252545', overlay: 'rgba(0,0,0,0.7)' },
    'temple': { bg: '#2d2416', text: '#e8dcc8', accent: '#d4a84b', card: '#3d3220', overlay: 'rgba(0,0,0,0.6)' }
  };
  const c = colors[theme];

  return `
/* Level Selector */
.guide-level-selector {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background: ${c.card};
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.level-label {
  font-size: 0.85rem;
  opacity: 0.7;
}

.level-buttons {
  display: flex;
  gap: 4px;
}

.level-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 8px;
  color: ${c.text};
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.level-btn:hover {
  background: ${c.accent}20;
}

.level-btn.active {
  background: ${c.accent};
  color: ${c.bg};
}

.level-icon { font-size: 1.1rem; }

/* Explanation Overlay */
.explanation-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.explanation-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.overlay-backdrop {
  position: absolute;
  inset: 0;
  background: ${c.overlay};
}

.overlay-panel {
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: ${c.card};
  border-radius: 16px;
  padding: 32px;
  overflow-y: auto;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.explanation-overlay.open .overlay-panel {
  transform: translateY(0);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: ${c.bg};
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: ${c.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover { background: ${c.accent}30; }

.explanation-empty {
  text-align: center;
  padding: 48px;
}

.empty-icon { font-size: 4rem; display: block; margin-bottom: 16px; }

.explanation-header {
  margin-bottom: 24px;
}

.explanation-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${c.accent};
  margin-bottom: 8px;
}

.explanation-header h2 {
  font-size: 1.8rem;
  color: ${c.accent};
}

.explanation-body { line-height: 1.8; }

.explanation-text {
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.explanation-example, .explanation-formula {
  background: ${c.bg};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.explanation-example h4, .explanation-formula h4 {
  font-size: 0.85rem;
  color: ${c.accent};
  margin-bottom: 8px;
}

.explanation-formula code {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.related-concepts { margin-top: 24px; }

.related-concepts h4 {
  font-size: 0.85rem;
  color: ${c.accent};
  margin-bottom: 12px;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.related-tag {
  padding: 6px 14px;
  background: ${c.accent}20;
  border: 1px solid ${c.accent}40;
  border-radius: 20px;
  color: ${c.text};
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.related-tag:hover {
  background: ${c.accent};
  color: ${c.bg};
}

.explanation-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${c.accent}30;
  text-align: right;
}

.current-level-badge {
  font-size: 0.75rem;
  padding: 4px 12px;
  background: ${c.accent}30;
  border-radius: 12px;
}

/* Explainable Term */
.explainable-term {
  position: relative;
  color: ${c.accent};
  cursor: pointer;
  border-bottom: 1px dotted ${c.accent};
}

.explainable-term:hover { border-bottom-style: solid; }

.explain-indicator {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: ${c.accent};
  color: ${c.bg};
  font-size: 0.65rem;
  font-weight: bold;
  border-radius: 50%;
  text-align: center;
  line-height: 14px;
  margin-left: 2px;
  vertical-align: super;
}

/* Explanation Card */
.explanation-card {
  background: ${c.card};
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid ${c.accent};
}

.card-header { margin-bottom: 12px; }

.card-category {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${c.accent};
}

.card-header h3 {
  font-size: 1.2rem;
  margin-top: 4px;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.card-example {
  font-size: 0.85rem;
  background: ${c.bg};
  padding: 10px;
  border-radius: 6px;
  opacity: 0.8;
}

/* Reference Page */
.explanation-reference {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

.explanation-reference h1 {
  text-align: center;
  margin-bottom: 8px;
  color: ${c.accent};
}

.ref-intro {
  text-align: center;
  opacity: 0.7;
  margin-bottom: 48px;
}

.reference-category {
  margin-bottom: 48px;
}

.reference-category h2 {
  font-size: 1.3rem;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${c.accent}30;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

@media (max-width: 600px) {
  .guide-level-selector {
    top: auto;
    bottom: 16px;
    right: 16px;
    left: 16px;
    justify-content: center;
  }

  .level-label { display: none; }
  .level-name { display: none; }

  .overlay-panel {
    width: 95%;
    padding: 24px;
    max-height: 90vh;
  }
}
  `.trim();
}

// ==================== SCRIPT ====================

export function getGuideModeScript(): string {
  return `
(function() {
  let currentLevel = 'elementary';

  // Level selection
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentLevel = this.dataset.level;

      window.dispatchEvent(new CustomEvent('guide-level-change', {
        detail: { level: currentLevel }
      }));
    });
  });

  // Explainable terms
  document.addEventListener('click', function(e) {
    const term = e.target.closest('.explainable-term');
    if (term) {
      const termId = term.dataset.explain;
      window.dispatchEvent(new CustomEvent('explain-term', {
        detail: { termId, level: currentLevel }
      }));
    }

    const relatedTag = e.target.closest('.related-tag');
    if (relatedTag) {
      const termId = relatedTag.dataset.explain;
      window.dispatchEvent(new CustomEvent('explain-term', {
        detail: { termId, level: currentLevel }
      }));
    }
  });

  // Close overlay
  window.closeExplanation = function() {
    const overlay = document.getElementById('explanation-overlay');
    if (overlay) overlay.classList.remove('open');
  };

  // Open overlay
  window.openExplanation = function(termId) {
    window.dispatchEvent(new CustomEvent('explain-term', {
      detail: { termId, level: currentLevel }
    }));
  };

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeExplanation();
    }
  });
})();
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderGuideModeHtml,
  renderLevelSelector,
  renderExplanationOverlay,
  renderExplainableTerm,
  renderExplanationCard,
  renderExplanationReferencePage,
  GuideModeUIData
};
