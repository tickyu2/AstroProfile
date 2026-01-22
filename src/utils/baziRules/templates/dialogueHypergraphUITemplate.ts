/**
 * ============================================
 * HYPERGRAPH-AWARE DIALOGUE UI TEMPLATE
 * This UI understands and visualizes:
 * - Archetype hypergraph nodes
 * - Theme nodes
 * - Shadow/gift nodes
 * - Inter-archetype connections
 * - Emotional resonance
 * - Generational index
 *
 * Visually highlights active archetypes and themes
 * during each dialogue turn.
 * ============================================
 */

import { ResonantDialogue, ResonantDialogueTurn } from '../advancedDialogue';
import { MythosHypergraph, HypergraphNode } from '../mythosHypergraph';

// ==================== DATA MODEL ====================

export interface DialogueHypergraphUIData {
  dialogue: ResonantDialogue;
  hypergraph: MythosHypergraph;
  pilgrimName?: string;
  lang?: 'en' | 'zh';
}

// ==================== HTML RENDERING ====================

/**
 * Render the complete hypergraph-aware dialogue UI
 */
export function renderDialogueHypergraphUIHtml(data: DialogueHypergraphUIData): string {
  const { dialogue, hypergraph, pilgrimName, lang = 'en' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '祖先对话 - 超图视图' : 'Ancestral Dialogue - Hypergraph View'}</title>
  <style>
    ${getDialogueHypergraphStyles()}
  </style>
</head>
<body>
  <div class="dialogue-hypergraph-ui">
    <header class="dialogue-header">
      <h1>${lang === 'zh' ? '🕍 祖先对话（超图感知）' : '🕍 Ancestral Dialogue (Hypergraph-Aware)'}</h1>
      <p class="subtitle">${lang === 'zh' ? '对话映射到原型、主题和代际回响' : 'Dialogue mapped to archetypes, themes, and generational echoes'}</p>
      ${pilgrimName ? `<p class="pilgrim-name">${lang === 'zh' ? '行者' : 'Pilgrim'}: ${pilgrimName}</p>` : ''}
    </header>

    <div class="dialogue-and-graph">
      <div id="dialogue-container" class="dialogue-container">
        ${renderDialogueTurns(dialogue.turns, lang)}
      </div>
      <div id="hypergraph-container" class="hypergraph-container">
        <h3>${lang === 'zh' ? '超图视图' : 'Hypergraph View'}</h3>
        <div id="hypergraph-nodes" class="hypergraph-nodes">
          ${renderHypergraphNodes(hypergraph.nodes, lang)}
        </div>
      </div>
    </div>

    <footer class="dialogue-footer">
      <div class="resonance-meter">
        <span class="label">${lang === 'zh' ? '整体共鸣' : 'Overall Resonance'}:</span>
        <div class="meter-bar">
          <div class="meter-fill" style="width: ${dialogue.overallResonance}%"></div>
        </div>
        <span class="value">${dialogue.overallResonance}%</span>
      </div>
    </footer>
  </div>

  <script>
    window.DIALOGUE_DATA = ${JSON.stringify(dialogue)};
    window.HYPERGRAPH_DATA = ${JSON.stringify(hypergraph)};
    ${getDialogueHypergraphScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render dialogue turns
 */
function renderDialogueTurns(turns: ResonantDialogueTurn[], lang: 'en' | 'zh'): string {
  return turns.map((turn, idx) => {
    const text = lang === 'zh' ? turn.textZh : turn.text;
    const speakerLabel = getSpeakerLabel(turn.speaker, lang);
    const emotionClass = getEmotionClass(turn.emotion.valence);

    return `
      <div class="dialogue-turn ${turn.speaker} ${emotionClass}" data-turn-index="${idx}" data-theme="${turn.theme}">
        <div class="turn-header">
          <span class="speaker">${speakerLabel}</span>
          <span class="emotion-badge ${turn.emotion.tone}">${turn.emotion.tone}</span>
          <span class="resonance-badge">${turn.resonanceScore}%</span>
        </div>
        <p class="turn-text">${text}</p>
        <div class="turn-meta">
          <span class="theme">${lang === 'zh' ? '主题' : 'Theme'}: ${turn.theme}</span>
          ${turn.generationIndex !== undefined ? `<span class="generation">${lang === 'zh' ? '代数' : 'Gen'}: ${turn.generationIndex}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render hypergraph nodes
 */
function renderHypergraphNodes(nodes: HypergraphNode[], lang: 'en' | 'zh'): string {
  // Group by type
  const archetypes = nodes.filter(n => n.type === 'archetype');
  const themes = nodes.filter(n => n.type === 'theme');
  const shadows = nodes.filter(n => n.type === 'shadow');
  const gifts = nodes.filter(n => n.type === 'gift');

  return `
    <div class="node-section">
      <h4>${lang === 'zh' ? '原型' : 'Archetypes'}</h4>
      ${archetypes.map(n => renderNode(n, lang)).join('')}
    </div>
    <div class="node-section">
      <h4>${lang === 'zh' ? '主题' : 'Themes'}</h4>
      ${themes.map(n => renderNode(n, lang)).join('')}
    </div>
    <div class="node-section">
      <h4>${lang === 'zh' ? '阴影' : 'Shadows'}</h4>
      ${shadows.map(n => renderNode(n, lang)).join('')}
    </div>
    <div class="node-section">
      <h4>${lang === 'zh' ? '天赋' : 'Gifts'}</h4>
      ${gifts.map(n => renderNode(n, lang)).join('')}
    </div>
  `;
}

/**
 * Render a single node
 */
function renderNode(node: HypergraphNode, lang: 'en' | 'zh'): string {
  const label = lang === 'zh' && node.labelZh ? node.labelZh : node.label;
  return `
    <div class="hypergraph-node ${node.type}" data-node-id="${node.id}">
      <span class="node-label">${label}</span>
      <span class="node-type">${node.type}</span>
    </div>
  `;
}

/**
 * Get speaker label
 */
function getSpeakerLabel(speaker: ResonantDialogueTurn['speaker'], lang: 'en' | 'zh'): string {
  const labels = {
    ancestor: lang === 'zh' ? '祖先' : 'Ancestor',
    pilgrim: lang === 'zh' ? '行者' : 'Pilgrim',
    luna: 'Luna'
  };
  return labels[speaker];
}

/**
 * Get emotion CSS class
 */
function getEmotionClass(valence: number): string {
  if (valence > 30) return 'positive';
  if (valence < -30) return 'negative';
  return 'neutral';
}

// ==================== COMPONENT RENDERING ====================

/**
 * Render dialogue container as a React-style component
 */
export function renderDialogueContainerComponent(
  dialogue: ResonantDialogue,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
    <div class="dialogue-container" id="dialogue-container">
      ${renderDialogueTurns(dialogue.turns, lang)}
    </div>
  `;
}

/**
 * Render hypergraph panel as a component
 */
export function renderHypergraphPanelComponent(
  hypergraph: MythosHypergraph,
  lang: 'en' | 'zh' = 'en'
): string {
  return `
    <div class="hypergraph-container" id="hypergraph-container">
      <h3>${lang === 'zh' ? '超图视图' : 'Hypergraph View'}</h3>
      <div id="hypergraph-nodes" class="hypergraph-nodes">
        ${renderHypergraphNodes(hypergraph.nodes, lang)}
      </div>
    </div>
  `;
}

// ==================== STYLES ====================

/**
 * Get CSS styles for the dialogue hypergraph UI
 */
export function getDialogueHypergraphStyles(): string {
  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: linear-gradient(135deg, #f5f3ef 0%, #e8e4dc 100%);
  min-height: 100vh;
  color: #3a3a3a;
}

.dialogue-hypergraph-ui {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.dialogue-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #d4c5a9;
}

.dialogue-header h1 {
  font-size: 1.8rem;
  color: #5a4a3a;
  margin-bottom: 8px;
}

.subtitle {
  color: #7a6a5a;
  font-style: italic;
}

.pilgrim-name {
  margin-top: 8px;
  color: #6a5a4a;
  font-weight: 600;
}

.dialogue-and-graph {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .dialogue-and-graph {
    grid-template-columns: 1fr;
  }
}

/* Dialogue Container */
.dialogue-container {
  background: #fffef9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-height: 70vh;
  overflow-y: auto;
}

.dialogue-turn {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #ccc;
  transition: all 0.3s ease;
}

.dialogue-turn:hover {
  transform: translateX(4px);
}

.dialogue-turn.ancestor {
  background: #f8f4e8;
  border-left-color: #b8a888;
}

.dialogue-turn.pilgrim {
  background: #e8f4f8;
  border-left-color: #88a8b8;
}

.dialogue-turn.luna {
  background: #f8e8f4;
  border-left-color: #b888a8;
}

.dialogue-turn.positive {
  background-image: linear-gradient(90deg, rgba(200, 230, 200, 0.3), transparent);
}

.dialogue-turn.negative {
  background-image: linear-gradient(90deg, rgba(230, 200, 200, 0.3), transparent);
}

.dialogue-turn.active {
  box-shadow: 0 0 15px rgba(180, 160, 120, 0.4);
}

.turn-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.speaker {
  font-weight: 700;
  color: #5a4a3a;
}

.emotion-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: #e0e0e0;
  color: #666;
}

.emotion-badge.warm { background: #ffe4b5; color: #8b4513; }
.emotion-badge.soft { background: #e6e6fa; color: #483d8b; }
.emotion-badge.solemn { background: #d3d3d3; color: #4a4a4a; }
.emotion-badge.gentle { background: #e0ffe0; color: #228b22; }
.emotion-badge.firm { background: #ffe4e1; color: #8b0000; }
.emotion-badge.reverent { background: #f0e68c; color: #6b5b00; }

.resonance-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: #d4c5a9;
  color: #5a4a3a;
}

.turn-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a4a4a;
}

.turn-meta {
  margin-top: 8px;
  font-size: 0.8rem;
  color: #8a8a8a;
  display: flex;
  gap: 16px;
}

/* Hypergraph Container */
.hypergraph-container {
  background: #f7f5ef;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-height: 70vh;
  overflow-y: auto;
}

.hypergraph-container h3 {
  margin-bottom: 16px;
  color: #5a4a3a;
  border-bottom: 1px solid #d4c5a9;
  padding-bottom: 8px;
}

.node-section {
  margin-bottom: 16px;
}

.node-section h4 {
  font-size: 0.9rem;
  color: #7a6a5a;
  margin-bottom: 8px;
}

.hypergraph-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  margin: 4px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hypergraph-node:hover {
  transform: scale(1.05);
}

.hypergraph-node.archetype {
  background: #e8e4ff;
  border: 1px solid #c8b4ff;
}

.hypergraph-node.theme {
  background: #e0f7ff;
  border: 1px solid #a0d7ef;
}

.hypergraph-node.shadow {
  background: #ffe0e0;
  border: 1px solid #ffb0b0;
}

.hypergraph-node.gift {
  background: #e0ffe0;
  border: 1px solid #a0efa0;
}

.hypergraph-node.thread {
  background: #fff0e0;
  border: 1px solid #ffd0a0;
}

.hypergraph-node.active {
  box-shadow: 0 0 10px rgba(180, 160, 120, 0.6);
  transform: scale(1.1);
}

.node-type {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
}

/* Footer */
.dialogue-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid #d4c5a9;
}

.resonance-meter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.resonance-meter .label {
  font-weight: 600;
  color: #5a4a3a;
}

.meter-bar {
  flex: 1;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4c5a9, #b8a888);
  transition: width 0.5s ease;
}

.resonance-meter .value {
  font-weight: 700;
  color: #5a4a3a;
}
  `.trim();
}

// ==================== SCRIPT ====================

/**
 * Get JavaScript for the dialogue hypergraph UI
 */
export function getDialogueHypergraphScript(): string {
  return `
// Highlight hypergraph nodes when hovering over dialogue turns
document.querySelectorAll('.dialogue-turn').forEach(turn => {
  turn.addEventListener('mouseenter', function() {
    const theme = this.dataset.theme;
    highlightNodesForTheme(theme);
    this.classList.add('active');
  });

  turn.addEventListener('mouseleave', function() {
    clearNodeHighlights();
    this.classList.remove('active');
  });
});

function highlightNodesForTheme(theme) {
  const nodes = document.querySelectorAll('.hypergraph-node');
  nodes.forEach(node => {
    const label = node.querySelector('.node-label').textContent.toLowerCase();
    if (label.includes(theme.toLowerCase()) || theme.toLowerCase().includes(label)) {
      node.classList.add('active');
    }
  });
}

function clearNodeHighlights() {
  document.querySelectorAll('.hypergraph-node.active').forEach(node => {
    node.classList.remove('active');
  });
}

// Click on nodes to filter dialogue
document.querySelectorAll('.hypergraph-node').forEach(node => {
  node.addEventListener('click', function() {
    const nodeId = this.dataset.nodeId;
    const label = this.querySelector('.node-label').textContent.toLowerCase();
    filterDialogueByTheme(label);
  });
});

function filterDialogueByTheme(theme) {
  const turns = document.querySelectorAll('.dialogue-turn');
  turns.forEach(turn => {
    const turnTheme = turn.dataset.theme.toLowerCase();
    if (turnTheme.includes(theme) || theme.includes(turnTheme)) {
      turn.style.opacity = '1';
      turn.style.transform = 'scale(1)';
    } else {
      turn.style.opacity = '0.4';
      turn.style.transform = 'scale(0.95)';
    }
  });

  // Double-click to reset
  setTimeout(() => {
    turns.forEach(turn => {
      turn.style.opacity = '';
      turn.style.transform = '';
    });
  }, 3000);
}
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderDialogueHypergraphUIHtml,
  renderDialogueContainerComponent,
  renderHypergraphPanelComponent,
  getDialogueHypergraphStyles,
  getDialogueHypergraphScript
};
