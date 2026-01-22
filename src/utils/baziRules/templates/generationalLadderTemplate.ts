/**
 * ============================================
 * GENERATIONAL LADDER UI TEMPLATE
 * Visualize narratives across generations
 *
 * Shows:
 * - Vertical ladder of generation nodes
 * - Cross-generational threads
 * - Inherited & breaking patterns
 * - Family narrative arc
 * ============================================
 */

import {
  GenerationalLadder,
  GenerationNode,
  GenerationalThread,
  LadderSummary,
  InheritedPattern,
  BreakingPattern
} from '../generationalLadder';

// ==================== MAIN RENDER FUNCTIONS ====================

/**
 * Render full generational ladder page
 */
export function renderGenerationalLadderHtml(ladder: GenerationalLadder): string {
  const lineageName = ladder.lineageName || `Lineage ${ladder.lineageId}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generational Ladder: ${lineageName}</title>
  <style>
    ${getGenerationalLadderStyles()}
  </style>
</head>
<body>
  <div class="ladder-container">
    <header class="ladder-header">
      <h1>🧬 Generational Ladder</h1>
      <h2>${lineageName}</h2>
      <p class="span-info">${ladder.summary.totalGenerations} generations • ${ladder.summary.totalMembers} members • ~${ladder.summary.spanYears} years</p>
    </header>

    ${renderLadderSummarySection(ladder.summary)}
    ${renderLadderVisualization(ladder.generations)}
    ${renderThreadsSection(ladder.threads)}
    ${renderPatternsSection(ladder.summary.inheritedPatterns, ladder.summary.breakingPatterns)}
  </div>

  <script>
    window.GENERATIONAL_LADDER = ${JSON.stringify(ladder)};
    ${getGenerationalLadderScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render embeddable component
 */
export function renderGenerationalLadderComponent(ladder: GenerationalLadder): string {
  return `
<div class="generational-ladder-component">
  ${renderLadderSummarySection(ladder.summary)}
  ${renderLadderVisualization(ladder.generations)}
  ${renderThreadsSection(ladder.threads)}
</div>
  `.trim();
}

// ==================== SECTION RENDERERS ====================

function renderLadderSummarySection(summary: LadderSummary): string {
  return `
<section class="summary-section">
  <h2>📜 Family Narrative</h2>
  <div class="narrative-arc">
    <p>${summary.narrativeArc}</p>
  </div>
  <div class="dominant-threads">
    <h4>Dominant Themes</h4>
    <div class="theme-tags">
      ${summary.dominantThreads.map(t => `<span class="theme-tag">${t}</span>`).join('')}
    </div>
  </div>
</section>
  `;
}

function renderLadderVisualization(generations: GenerationNode[]): string {
  // Render from oldest (top) to youngest (bottom)
  const sortedGens = [...generations].sort((a, b) => a.generationIndex - b.generationIndex);

  return `
<section class="ladder-section">
  <h2>🪜 Generational Ladder</h2>
  <div class="ladder-visual">
    <div class="ladder-spine"></div>
    ${sortedGens.map((gen, idx) => renderGenerationNode(gen, idx, sortedGens.length)).join('')}
  </div>
</section>
  `;
}

function renderGenerationNode(
  gen: GenerationNode,
  index: number,
  total: number
): string {
  const toneClass = gen.dominantTone;
  const isSelf = gen.generationIndex === 0;
  const isAncestor = gen.generationIndex < 0;

  const iconMap: Record<string, string> = {
    'Grandparents': '👴👵',
    'Parents': '👨👩',
    'Self': '🧑',
    'Children': '👶',
    'Grandchildren': '👶👶'
  };
  const icon = iconMap[gen.label] || (isAncestor ? '🕯️' : '🌱');

  return `
<div class="generation-node ${toneClass} ${isSelf ? 'self' : ''}" data-gen="${gen.generationIndex}">
  <div class="node-connector ${index === 0 ? 'first' : ''} ${index === total - 1 ? 'last' : ''}"></div>
  <div class="node-content">
    <div class="node-header">
      <span class="node-icon">${icon}</span>
      <span class="node-label">${gen.label}</span>
      ${gen.labelZh ? `<span class="node-label-zh">${gen.labelZh}</span>` : ''}
      <span class="node-index">Gen ${gen.generationIndex >= 0 ? '+' : ''}${gen.generationIndex}</span>
    </div>
    <div class="node-stats">
      <span class="stat"><strong>${gen.memberCount}</strong> members</span>
      <span class="stat"><strong>${gen.groupNarrative.storyBeats.length}</strong> beats</span>
      <span class="stat tone-${toneClass}">${toneClass}</span>
    </div>
    <div class="node-beats">
      ${gen.groupNarrative.storyBeats.slice(0, 3).map(b => `
        <span class="beat-chip ${b.valence}">${b.label}</span>
      `).join('')}
      ${gen.groupNarrative.storyBeats.length > 3 ? `<span class="more">+${gen.groupNarrative.storyBeats.length - 3}</span>` : ''}
    </div>
    <button class="expand-btn" onclick="toggleGenerationDetail(${gen.generationIndex})">
      View Details
    </button>
  </div>
</div>
  `;
}

function renderThreadsSection(threads: GenerationalThread[]): string {
  if (threads.length === 0) {
    return `
<section class="threads-section">
  <h2>🧵 Cross-Generational Threads</h2>
  <p class="empty-note">No recurring themes detected across generations.</p>
</section>
    `;
  }

  return `
<section class="threads-section">
  <h2>🧵 Cross-Generational Threads</h2>
  <p class="section-desc">Themes that echo across multiple generations</p>
  <div class="threads-list">
    ${threads.map(t => renderThreadCard(t)).join('')}
  </div>
</section>
  `;
}

function renderThreadCard(thread: GenerationalThread): string {
  const directionIcon: Record<string, string> = {
    'ascending': '📈',
    'descending': '📉',
    'stable': '➡️',
    'cyclical': '🔄'
  };

  return `
<div class="thread-card">
  <div class="thread-header">
    <span class="thread-theme">${thread.theme}</span>
    <span class="thread-direction">${directionIcon[thread.direction]} ${thread.direction}</span>
  </div>
  <div class="thread-span">
    <span class="label">Spans:</span>
    <div class="gen-dots">
      ${thread.generations.map(g => `<span class="gen-dot" title="Gen ${g}">${g}</span>`).join(' → ')}
    </div>
  </div>
  <div class="thread-intensity">
    <div class="intensity-bar">
      <div class="intensity-fill" style="width: ${thread.intensity}%"></div>
    </div>
    <span class="intensity-label">${thread.intensity}% intensity</span>
  </div>
  <p class="thread-notes">${thread.notes}</p>
</div>
  `;
}

function renderPatternsSection(
  inherited: InheritedPattern[],
  breaking: BreakingPattern[]
): string {
  return `
<section class="patterns-section">
  <h2>🔗 Patterns</h2>
  <div class="patterns-grid">
    <div class="pattern-column inherited">
      <h3>Inherited Patterns</h3>
      ${inherited.length === 0 ? '<p class="empty-note">No inherited patterns detected.</p>' : ''}
      ${inherited.map(p => `
        <div class="pattern-card inherited">
          <span class="pattern-name">${p.pattern}</span>
          <span class="pattern-span">Gen ${p.fromGeneration} → ${p.toGeneration}</span>
          <div class="strength-bar">
            <div class="fill" style="width: ${p.strength}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="pattern-column breaking">
      <h3>Breaking Patterns</h3>
      ${breaking.length === 0 ? '<p class="empty-note">No breaking patterns detected.</p>' : ''}
      ${breaking.map(p => `
        <div class="pattern-card breaking">
          <span class="pattern-name">${p.pattern}</span>
          <span class="pattern-gen">Gen ${p.generation}</span>
          ${p.previousPattern ? `<span class="prev-pattern">← ${p.previousPattern}</span>` : ''}
          <div class="significance-bar">
            <div class="fill" style="width: ${p.significance}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>
  `;
}

// ==================== STYLES ====================

function getGenerationalLadderStyles(): string {
  return `
    :root {
      --bg-primary: #0f0f1a;
      --bg-secondary: #1a1a2e;
      --bg-card: #252540;
      --text-primary: #e0e0e0;
      --text-muted: #a0a0b0;
      --gold: #d4af37;
      --positive: #4ade80;
      --negative: #f87171;
      --mixed: #fbbf24;
      --accent-purple: #a78bfa;
      --accent-blue: #60a5fa;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }

    .ladder-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .ladder-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .ladder-header h1 {
      color: var(--gold);
      font-size: 2rem;
      margin-bottom: 0.25rem;
    }

    .ladder-header h2 {
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: normal;
      margin-bottom: 0.5rem;
    }

    .span-info {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    section h2 {
      color: var(--gold);
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    }

    /* Summary Section */
    .narrative-arc {
      background: var(--bg-card);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 3px solid var(--gold);
    }

    .narrative-arc p {
      color: var(--text-muted);
      font-style: italic;
    }

    .dominant-threads h4 {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .theme-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .theme-tag {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    /* Ladder Visualization */
    .ladder-visual {
      position: relative;
      padding: 1rem 0;
    }

    .ladder-spine {
      position: absolute;
      left: 30px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, var(--accent-purple), var(--gold), var(--accent-blue));
      border-radius: 2px;
    }

    .generation-node {
      position: relative;
      margin-left: 60px;
      margin-bottom: 1.5rem;
    }

    .node-connector {
      position: absolute;
      left: -34px;
      top: 50%;
      width: 30px;
      height: 4px;
      background: var(--gold);
    }

    .node-connector::before {
      content: '';
      position: absolute;
      left: -8px;
      top: -6px;
      width: 16px;
      height: 16px;
      background: var(--bg-primary);
      border: 3px solid var(--gold);
      border-radius: 50%;
    }

    .generation-node.self .node-connector::before {
      background: var(--gold);
      box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
    }

    .node-content {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 1rem;
      border-left: 4px solid var(--gold);
    }

    .generation-node.positive .node-content { border-left-color: var(--positive); }
    .generation-node.negative .node-content { border-left-color: var(--negative); }
    .generation-node.mixed .node-content { border-left-color: var(--mixed); }

    .generation-node.self .node-content {
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid var(--gold);
    }

    .node-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .node-icon { font-size: 1.25rem; }
    .node-label { font-weight: 600; font-size: 1.1rem; }
    .node-label-zh { color: var(--text-muted); font-size: 0.9rem; }
    .node-index {
      margin-left: auto;
      background: var(--bg-primary);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .node-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
    }

    .node-stats .stat { color: var(--text-muted); }
    .node-stats .tone-positive { color: var(--positive); }
    .node-stats .tone-negative { color: var(--negative); }
    .node-stats .tone-mixed { color: var(--mixed); }

    .node-beats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .beat-chip {
      background: var(--bg-primary);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      border-left: 2px solid var(--gold);
    }

    .beat-chip.positive { border-left-color: var(--positive); }
    .beat-chip.negative { border-left-color: var(--negative); }
    .beat-chip.mixed { border-left-color: var(--mixed); }

    .more {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .expand-btn {
      background: transparent;
      border: 1px solid var(--gold);
      color: var(--gold);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }

    .expand-btn:hover {
      background: var(--gold);
      color: var(--bg-primary);
    }

    /* Threads Section */
    .section-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .threads-list {
      display: grid;
      gap: 1rem;
    }

    .thread-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 1rem;
    }

    .thread-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .thread-theme {
      font-weight: 600;
      color: var(--gold);
    }

    .thread-direction {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .thread-span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .thread-span .label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .gen-dots {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
    }

    .gen-dot {
      background: var(--accent-purple);
      color: white;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }

    .thread-intensity {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .intensity-bar {
      flex: 1;
      height: 6px;
      background: var(--bg-primary);
      border-radius: 3px;
      overflow: hidden;
    }

    .intensity-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-purple), var(--gold));
    }

    .intensity-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .thread-notes {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Patterns Section */
    .patterns-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .pattern-column h3 {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .pattern-card {
      background: var(--bg-card);
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .pattern-card.inherited {
      border-left: 3px solid var(--positive);
    }

    .pattern-card.breaking {
      border-left: 3px solid var(--negative);
    }

    .pattern-name {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .pattern-span, .pattern-gen {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .prev-pattern {
      font-size: 0.75rem;
      color: var(--accent-purple);
      display: block;
      margin-top: 0.25rem;
    }

    .strength-bar, .significance-bar {
      height: 4px;
      background: var(--bg-primary);
      border-radius: 2px;
      margin-top: 0.5rem;
      overflow: hidden;
    }

    .strength-bar .fill { background: var(--positive); height: 100%; }
    .significance-bar .fill { background: var(--negative); height: 100%; }

    .empty-note {
      color: var(--text-muted);
      font-style: italic;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .patterns-grid { grid-template-columns: 1fr; }
      .ladder-spine { left: 20px; }
      .generation-node { margin-left: 50px; }
      .node-connector { left: -34px; width: 30px; }
    }
  `;
}

// ==================== SCRIPT ====================

function getGenerationalLadderScript(): string {
  return `
    function toggleGenerationDetail(genIndex) {
      const ladder = window.GENERATIONAL_LADDER;
      const gen = ladder.generations.find(g => g.generationIndex === genIndex);
      if (!gen) return;

      alert('Generation: ' + gen.label + '\\n\\n' +
        'Members: ' + gen.memberCount + '\\n' +
        'Story Beats: ' + gen.groupNarrative.storyBeats.length + '\\n' +
        'Emotional Points: ' + gen.groupNarrative.emotionalArc.length + '\\n' +
        'Dominant Tone: ' + gen.dominantTone + '\\n\\n' +
        'Top Beats: ' + gen.groupNarrative.storyBeats.slice(0, 5).map(b => b.label).join(', ')
      );
    }
  `;
}

// ==================== EXPORTS ====================

export {
  renderGenerationalLadderHtml,
  renderGenerationalLadderComponent,
  getGenerationalLadderStyles,
  getGenerationalLadderScript
};
