/**
 * ============================================
 * GENERATIONAL CONSTELLATION UI TEMPLATE
 * Visualizes multi-generational family networks
 *
 * Features:
 * - Each generation as a horizontal layer
 * - Each member as a node
 * - Relationships as edges
 * - Generational threads as vertical lines
 * - Group narratives as hoverable summaries
 * - Interactive canvas with D3.js support
 *
 * The pilgrim sees the entire family constellation
 * across time.
 * ============================================
 */

import { GenerationalLadder, GenerationNode, GenerationalThread } from '../generationalLadder';
import { PilgrimPosition } from '../journeyWithGenerations';

// ==================== RENDER FUNCTIONS ====================

/**
 * Render full Generational Constellation HTML page
 */
export function renderGenerationalConstellationHtml(
  ladder: GenerationalLadder,
  position?: PilgrimPosition,
  options: { lang?: 'en' | 'zh'; theme?: 'light' | 'dark' } = {}
): string {
  const { lang = 'en', theme = 'light' } = options;

  return `
<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '世代星座图' : 'Generational Constellation'}</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    ${getGenerationalConstellationStyles(theme)}
  </style>
</head>
<body class="theme-${theme}">
  <div class="constellation-container">
    <header class="constellation-header">
      <h1>${lang === 'zh' ? '🌟 世代星座图' : '🌟 Generational Constellation'}</h1>
      <p class="subtitle">${lang === 'zh'
        ? `${ladder.generations.length}代人 · ${ladder.threads.length}条血脉丝线`
        : `${ladder.generations.length} Generations · ${ladder.threads.length} Ancestral Threads`}</p>
    </header>

    ${renderConstellationLegend(lang)}

    <div class="constellation-main">
      <div id="constellation-canvas" class="constellation-canvas"></div>

      <aside class="constellation-sidebar">
        ${renderGenerationsList(ladder, position, lang)}
        ${renderThreadsList(ladder.threads, lang)}
      </aside>
    </div>

    <div id="constellation-details" class="constellation-details"></div>

    ${position ? renderPilgrimPositionPanel(position, lang) : ''}
  </div>

  <script>
    ${getGenerationalConstellationScript()}

    // Initialize with data
    window.GENERATIONAL_LADDER = ${JSON.stringify(ladder)};
    window.GENERATIONAL_THREADS = ${JSON.stringify(ladder.threads)};
    ${position ? `window.PILGRIM_POSITION = ${JSON.stringify(position)};` : ''}

    initConstellationVisualization();
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render Constellation Canvas Component (embeddable)
 */
export function renderConstellationCanvasComponent(
  ladder: GenerationalLadder,
  options: { lang?: 'en' | 'zh'; width?: number; height?: number } = {}
): string {
  const { lang = 'en', width = 800, height = 600 } = options;

  return `
<div class="constellation-canvas-wrapper">
  <svg id="constellation-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      ${renderSvgDefs()}
    </defs>
    <g id="threads-layer" class="threads-layer"></g>
    <g id="edges-layer" class="edges-layer"></g>
    <g id="nodes-layer" class="nodes-layer"></g>
    <g id="labels-layer" class="labels-layer"></g>
  </svg>
  <div class="canvas-controls">
    <button class="control-btn" data-action="zoom-in" title="${lang === 'zh' ? '放大' : 'Zoom In'}">+</button>
    <button class="control-btn" data-action="zoom-out" title="${lang === 'zh' ? '缩小' : 'Zoom Out'}">−</button>
    <button class="control-btn" data-action="reset" title="${lang === 'zh' ? '重置' : 'Reset'}">↺</button>
  </div>
</div>
  `.trim();
}

/**
 * Render Legend Component
 */
function renderConstellationLegend(lang: 'en' | 'zh'): string {
  const labels = {
    en: {
      ancestors: 'Ancestors',
      parents: 'Parents',
      self: 'Self',
      children: 'Children',
      threads: 'Threads'
    },
    zh: {
      ancestors: '祖先',
      parents: '父母',
      self: '自己',
      children: '子女',
      threads: '丝线'
    }
  };

  return `
<div class="constellation-legend">
  <span class="legend-item ancestor"><span class="legend-dot"></span>${labels[lang].ancestors}</span>
  <span class="legend-item parent"><span class="legend-dot"></span>${labels[lang].parents}</span>
  <span class="legend-item self"><span class="legend-dot"></span>${labels[lang].self}</span>
  <span class="legend-item child"><span class="legend-dot"></span>${labels[lang].children}</span>
  <span class="legend-item thread"><span class="legend-line"></span>${labels[lang].threads}</span>
</div>
  `.trim();
}

/**
 * Render Generations List
 */
function renderGenerationsList(
  ladder: GenerationalLadder,
  position: PilgrimPosition | undefined,
  lang: 'en' | 'zh'
): string {
  const title = lang === 'zh' ? '世代层' : 'Generation Layers';

  const generationsHtml = ladder.generations
    .sort((a, b) => a.generationIndex - b.generationIndex)
    .map(gen => {
      const isSelf = position && gen.generationIndex === position.generationIndex;
      const genClass = getGenerationClass(gen.generationIndex, position?.generationIndex ?? 0);

      return `
<div class="generation-item ${genClass} ${isSelf ? 'is-self' : ''}" data-gen-index="${gen.generationIndex}">
  <div class="gen-header">
    <span class="gen-label">${lang === 'zh' ? gen.labelZh || gen.label : gen.label}</span>
    <span class="gen-count">${gen.members.length} ${lang === 'zh' ? '人' : 'member' + (gen.members.length !== 1 ? 's' : '')}</span>
  </div>
  <div class="gen-members">
    ${gen.members.map(m => `
      <span class="member-chip" data-member-id="${m.id}" title="${m.name}">
        ${m.name.substring(0, 10)}${m.name.length > 10 ? '...' : ''}
      </span>
    `).join('')}
  </div>
</div>
      `.trim();
    }).join('');

  return `
<div class="sidebar-section generations-list">
  <h3>${title}</h3>
  ${generationsHtml}
</div>
  `.trim();
}

/**
 * Render Threads List
 */
function renderThreadsList(threads: GenerationalThread[], lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '血脉丝线' : 'Ancestral Threads';

  if (threads.length === 0) {
    return `
<div class="sidebar-section threads-list">
  <h3>${title}</h3>
  <p class="no-threads">${lang === 'zh' ? '尚未检测到跨代丝线' : 'No cross-generational threads detected'}</p>
</div>
    `.trim();
  }

  const threadsHtml = threads.map(thread => {
    const strengthClass = thread.strength >= 0.7 ? 'strong' : thread.strength >= 0.4 ? 'moderate' : 'faint';
    const genSpan = `${Math.min(...thread.generations)} → ${Math.max(...thread.generations)}`;

    return `
<div class="thread-item ${strengthClass}" data-thread-id="${thread.id}">
  <div class="thread-header">
    <span class="thread-theme">${thread.theme}</span>
    <span class="thread-strength">${(thread.strength * 100).toFixed(0)}%</span>
  </div>
  <div class="thread-meta">
    <span class="thread-gens">${lang === 'zh' ? '跨越' : 'Spans'} ${thread.generations.length} ${lang === 'zh' ? '代' : 'generations'}</span>
    <span class="thread-range">(${genSpan})</span>
  </div>
</div>
    `.trim();
  }).join('');

  return `
<div class="sidebar-section threads-list">
  <h3>${title}</h3>
  ${threadsHtml}
</div>
  `.trim();
}

/**
 * Render Pilgrim Position Panel
 */
function renderPilgrimPositionPanel(position: PilgrimPosition, lang: 'en' | 'zh'): string {
  const title = lang === 'zh' ? '你在血脉中的位置' : 'Your Place in the Lineage';

  const ancestorLabel = lang === 'zh' ? '祖先' : 'ancestors';
  const descendantLabel = lang === 'zh' ? '后代' : 'descendants';

  return `
<div class="pilgrim-position-panel">
  <h3>${title}</h3>
  <div class="position-visualization">
    <span class="position-ancestors">${position.ancestorCount} ${ancestorLabel}</span>
    <span class="position-arrow">←</span>
    <span class="position-self">${lang === 'zh' ? '你' : 'YOU'}</span>
    <span class="position-arrow">→</span>
    <span class="position-descendants">${position.descendantCount} ${descendantLabel}</span>
  </div>

  ${position.inheritedThemes.length > 0 ? `
  <div class="position-themes inherited">
    <strong>${lang === 'zh' ? '继承的主题：' : 'Inherited:'}</strong>
    ${position.inheritedThemes.map(t => `<span class="theme-tag">${t}</span>`).join('')}
  </div>
  ` : ''}

  ${position.brokenPatterns.length > 0 ? `
  <div class="position-themes broken">
    <strong>${lang === 'zh' ? '终结的模式：' : 'Broken:'}</strong>
    ${position.brokenPatterns.map(t => `<span class="theme-tag">${t}</span>`).join('')}
  </div>
  ` : ''}

  ${position.newPatterns.length > 0 ? `
  <div class="position-themes new">
    <strong>${lang === 'zh' ? '开创的模式：' : 'New:'}</strong>
    ${position.newPatterns.map(t => `<span class="theme-tag">${t}</span>`).join('')}
  </div>
  ` : ''}
</div>
  `.trim();
}

/**
 * Render SVG definitions (gradients, markers, etc.)
 */
function renderSvgDefs(): string {
  return `
<!-- Gradients for generation layers -->
<linearGradient id="grad-ancestor" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:#e0e0ff;stop-opacity:0.3" />
  <stop offset="100%" style="stop-color:#c0c0ff;stop-opacity:0.1" />
</linearGradient>
<linearGradient id="grad-parent" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:#e0ffe0;stop-opacity:0.3" />
  <stop offset="100%" style="stop-color:#c0ffc0;stop-opacity:0.1" />
</linearGradient>
<linearGradient id="grad-self" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:#fff0d0;stop-opacity:0.5" />
  <stop offset="100%" style="stop-color:#ffe0a0;stop-opacity:0.3" />
</linearGradient>
<linearGradient id="grad-child" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:#ffe0e0;stop-opacity:0.3" />
  <stop offset="100%" style="stop-color:#ffc0c0;stop-opacity:0.1" />
</linearGradient>

<!-- Thread glow filter -->
<filter id="thread-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="3" result="blur"/>
  <feMerge>
    <feMergeNode in="blur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>

<!-- Node shadow filter -->
<filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
  <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
</filter>

<!-- Arrow marker for edges -->
<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
  <path d="M 0 0 L 10 5 L 0 10 z" fill="#999"/>
</marker>
  `.trim();
}

// ==================== HELPER FUNCTIONS ====================

function getGenerationClass(genIndex: number, selfIndex: number): string {
  if (genIndex === selfIndex) return 'gen-self';
  if (genIndex < selfIndex - 1) return 'gen-ancestor';
  if (genIndex === selfIndex - 1) return 'gen-parent';
  if (genIndex === selfIndex + 1) return 'gen-child';
  return 'gen-descendant';
}

// ==================== STYLES ====================

export function getGenerationalConstellationStyles(theme: 'light' | 'dark' = 'light'): string {
  const isDark = theme === 'dark';

  return `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: ${isDark ? '#1a1a2e' : '#f8f9fa'};
  color: ${isDark ? '#e0e0e0' : '#333'};
  line-height: 1.6;
}

.constellation-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.constellation-header {
  text-align: center;
  margin-bottom: 24px;
}

.constellation-header h1 {
  font-size: 2rem;
  margin-bottom: 8px;
  color: ${isDark ? '#fff' : '#2c3e50'};
}

.subtitle {
  color: ${isDark ? '#a0a0a0' : '#666'};
  font-size: 1rem;
}

/* Legend */
.constellation-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-item.ancestor .legend-dot { background: #9090ff; }
.legend-item.parent .legend-dot { background: #60d060; }
.legend-item.self .legend-dot { background: #ffb020; }
.legend-item.child .legend-dot { background: #ff8080; }

.legend-line {
  width: 20px;
  height: 3px;
  background: linear-gradient(90deg, #9090ff, #ffb020);
  border-radius: 2px;
}

/* Main Layout */
.constellation-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

@media (max-width: 900px) {
  .constellation-main {
    grid-template-columns: 1fr;
  }
}

/* Canvas */
.constellation-canvas {
  background: ${isDark ? '#0f0f1a' : '#fff'};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  min-height: 500px;
  position: relative;
  overflow: hidden;
}

.constellation-canvas-wrapper {
  position: relative;
}

.canvas-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: ${isDark ? '#333' : '#e0e0e0'};
  color: ${isDark ? '#fff' : '#333'};
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn:hover {
  background: ${isDark ? '#444' : '#ccc'};
}

/* Sidebar */
.constellation-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-section {
  background: ${isDark ? '#222' : '#fff'};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.sidebar-section h3 {
  font-size: 1rem;
  margin-bottom: 12px;
  color: ${isDark ? '#fff' : '#2c3e50'};
  border-bottom: 1px solid ${isDark ? '#333' : '#eee'};
  padding-bottom: 8px;
}

/* Generation Items */
.generation-item {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.generation-item:hover {
  transform: translateX(4px);
}

.generation-item.gen-ancestor { background: rgba(144, 144, 255, 0.1); border-left: 3px solid #9090ff; }
.generation-item.gen-parent { background: rgba(96, 208, 96, 0.1); border-left: 3px solid #60d060; }
.generation-item.gen-self { background: rgba(255, 176, 32, 0.15); border-left: 3px solid #ffb020; }
.generation-item.gen-child { background: rgba(255, 128, 128, 0.1); border-left: 3px solid #ff8080; }
.generation-item.gen-descendant { background: rgba(255, 160, 160, 0.1); border-left: 3px solid #ffa0a0; }

.generation-item.is-self {
  box-shadow: 0 0 0 2px #ffb020;
}

.gen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.gen-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.gen-count {
  font-size: 0.75rem;
  color: ${isDark ? '#888' : '#666'};
}

.gen-members {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.member-chip {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.member-chip:hover {
  background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
}

/* Thread Items */
.thread-item {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.thread-item.strong { border-left-color: #9090ff; background: rgba(144, 144, 255, 0.1); }
.thread-item.moderate { border-left-color: #60d060; background: rgba(96, 208, 96, 0.1); }
.thread-item.faint { border-left-color: #888; background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}; }

.thread-item:hover {
  transform: translateX(4px);
}

.thread-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thread-theme {
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.thread-strength {
  font-size: 0.75rem;
  padding: 2px 6px;
  background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
  border-radius: 4px;
}

.thread-meta {
  font-size: 0.75rem;
  color: ${isDark ? '#888' : '#666'};
  margin-top: 4px;
}

.no-threads {
  font-size: 0.85rem;
  color: ${isDark ? '#666' : '#999'};
  font-style: italic;
}

/* Pilgrim Position Panel */
.pilgrim-position-panel {
  background: ${isDark ? '#222' : '#fff'};
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 2px solid #ffb020;
}

.pilgrim-position-panel h3 {
  text-align: center;
  margin-bottom: 16px;
  color: ${isDark ? '#ffb020' : '#d9890a'};
}

.position-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  margin-bottom: 16px;
}

.position-ancestors, .position-descendants {
  padding: 6px 12px;
  border-radius: 6px;
  background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
}

.position-self {
  padding: 10px 20px;
  border-radius: 8px;
  background: #ffb020;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
}

.position-arrow {
  font-size: 1.5rem;
  color: ${isDark ? '#666' : '#999'};
}

.position-themes {
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
}

.position-themes.inherited { background: rgba(144, 144, 255, 0.1); }
.position-themes.broken { background: rgba(255, 100, 100, 0.1); }
.position-themes.new { background: rgba(96, 208, 96, 0.1); }

.position-themes strong {
  font-size: 0.85rem;
  display: block;
  margin-bottom: 6px;
}

.theme-tag {
  display: inline-block;
  padding: 2px 8px;
  margin: 2px;
  font-size: 0.8rem;
  background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
  border-radius: 10px;
  text-transform: capitalize;
}

/* Details Panel */
.constellation-details {
  background: ${isDark ? '#222' : '#fff'};
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: none;
}

.constellation-details.active {
  display: block;
}

/* SVG Styles */
.node-circle {
  cursor: pointer;
  transition: all 0.2s;
}

.node-circle:hover {
  stroke-width: 3;
}

.node-label {
  font-size: 12px;
  text-anchor: middle;
  pointer-events: none;
}

.edge-line {
  stroke: ${isDark ? '#444' : '#ddd'};
  stroke-width: 2;
  fill: none;
}

.thread-line {
  stroke-width: 3;
  fill: none;
  filter: url(#thread-glow);
  opacity: 0.7;
}

.thread-line.strong { stroke: #9090ff; stroke-width: 4; }
.thread-line.moderate { stroke: #60d060; stroke-width: 3; }
.thread-line.faint { stroke: #888; stroke-width: 2; opacity: 0.5; }

.gen-layer-rect {
  rx: 10;
  ry: 10;
}
  `.trim();
}

// ==================== SCRIPT ====================

export function getGenerationalConstellationScript(): string {
  return `
function initConstellationVisualization() {
  const ladder = window.GENERATIONAL_LADDER;
  const threads = window.GENERATIONAL_THREADS || [];
  const position = window.PILGRIM_POSITION;

  if (!ladder || !ladder.generations) {
    console.warn('No generational ladder data');
    return;
  }

  const container = document.getElementById('constellation-canvas');
  if (!container) return;

  const width = container.clientWidth || 800;
  const height = Math.max(500, ladder.generations.length * 120);

  // Clear existing
  container.innerHTML = '';

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', \`0 0 \${width} \${height}\`);

  // Add zoom behavior
  const g = svg.append('g');
  svg.call(d3.zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    }));

  // Add defs
  const defs = svg.append('defs');
  addSvgDefs(defs);

  // Calculate layout
  const layerHeight = height / (ladder.generations.length + 1);
  const selfIndex = position ? position.generationIndex : 0;

  // Sort generations by index
  const sortedGens = [...ladder.generations].sort((a, b) => a.generationIndex - b.generationIndex);

  // Draw generation layers
  sortedGens.forEach((gen, i) => {
    const y = (i + 0.5) * layerHeight;
    const gradId = getGradientId(gen.generationIndex, selfIndex);

    // Layer background
    g.append('rect')
      .attr('class', 'gen-layer-rect')
      .attr('x', 20)
      .attr('y', y - layerHeight/3)
      .attr('width', width - 40)
      .attr('height', layerHeight * 0.7)
      .attr('fill', \`url(#\${gradId})\`)
      .attr('stroke', 'none');

    // Layer label
    g.append('text')
      .attr('x', 30)
      .attr('y', y - layerHeight/3 + 20)
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(gen.label);

    // Draw nodes for this generation
    const memberCount = gen.members.length;
    const spacing = (width - 100) / (memberCount + 1);

    gen.members.forEach((member, j) => {
      const x = 50 + (j + 1) * spacing;
      const isSelf = position && gen.generationIndex === selfIndex && j === 0;
      const nodeColor = getNodeColor(gen.generationIndex, selfIndex);

      // Node circle
      g.append('circle')
        .attr('class', 'node-circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', isSelf ? 25 : 18)
        .attr('fill', nodeColor)
        .attr('stroke', isSelf ? '#ffb020' : '#fff')
        .attr('stroke-width', isSelf ? 4 : 2)
        .attr('filter', 'url(#node-shadow)')
        .attr('data-member-id', member.id)
        .on('click', () => showMemberDetails(member, gen));

      // Node label
      g.append('text')
        .attr('class', 'node-label')
        .attr('x', x)
        .attr('y', y + (isSelf ? 40 : 32))
        .attr('fill', isSelf ? '#ffb020' : '#666')
        .attr('font-weight', isSelf ? 'bold' : 'normal')
        .text(member.name.length > 12 ? member.name.substring(0, 10) + '...' : member.name);

      // Store position for edges
      member._x = x;
      member._y = y;
    });
  });

  // Draw threads
  threads.forEach(thread => {
    const points = [];
    thread.generations.sort((a, b) => a - b).forEach(genIdx => {
      const gen = sortedGens.find(g => g.generationIndex === genIdx);
      if (gen && gen.members.length > 0) {
        const layerIdx = sortedGens.indexOf(gen);
        const y = (layerIdx + 0.5) * layerHeight;
        // Find center x of this generation
        const avgX = gen.members.reduce((sum, m) => sum + (m._x || 0), 0) / gen.members.length;
        points.push([avgX, y]);
      }
    });

    if (points.length >= 2) {
      const strengthClass = thread.strength >= 0.7 ? 'strong' : thread.strength >= 0.4 ? 'moderate' : 'faint';
      const line = d3.line().curve(d3.curveCardinal.tension(0.5));
      g.append('path')
        .attr('class', \`thread-line \${strengthClass}\`)
        .attr('d', line(points))
        .attr('data-thread-id', thread.id)
        .on('mouseover', () => highlightThread(thread))
        .on('mouseout', () => unhighlightThread());
    }
  });

  // Bind sidebar interactions
  bindSidebarInteractions();
}

function addSvgDefs(defs) {
  // Gradients
  const gradients = [
    { id: 'grad-ancestor', colors: ['#e0e0ff', '#c0c0ff'] },
    { id: 'grad-parent', colors: ['#e0ffe0', '#c0ffc0'] },
    { id: 'grad-self', colors: ['#fff0d0', '#ffe0a0'] },
    { id: 'grad-child', colors: ['#ffe0e0', '#ffc0c0'] },
    { id: 'grad-descendant', colors: ['#fff0f0', '#ffe0e0'] }
  ];

  gradients.forEach(g => {
    const grad = defs.append('linearGradient')
      .attr('id', g.id)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', g.colors[0]).attr('stop-opacity', 0.3);
    grad.append('stop').attr('offset', '100%').attr('stop-color', g.colors[1]).attr('stop-opacity', 0.1);
  });

  // Shadow filter
  const shadow = defs.append('filter').attr('id', 'node-shadow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  shadow.append('feDropShadow').attr('dx', 2).attr('dy', 2).attr('stdDeviation', 3).attr('flood-opacity', 0.3);
}

function getGradientId(genIdx, selfIdx) {
  if (genIdx === selfIdx) return 'grad-self';
  if (genIdx < selfIdx - 1) return 'grad-ancestor';
  if (genIdx === selfIdx - 1) return 'grad-parent';
  if (genIdx === selfIdx + 1) return 'grad-child';
  return 'grad-descendant';
}

function getNodeColor(genIdx, selfIdx) {
  if (genIdx === selfIdx) return '#ffb020';
  if (genIdx < selfIdx - 1) return '#9090ff';
  if (genIdx === selfIdx - 1) return '#60d060';
  if (genIdx === selfIdx + 1) return '#ff8080';
  return '#ffa0a0';
}

function showMemberDetails(member, gen) {
  const detailsPanel = document.getElementById('constellation-details');
  if (!detailsPanel) return;

  detailsPanel.innerHTML = \`
    <h3>\${member.name}</h3>
    <p><strong>Generation:</strong> \${gen.label}</p>
    \${member.birthDate ? \`<p><strong>Birth:</strong> \${member.birthDate}</p>\` : ''}
    \${member.baziSummary ? \`<p><strong>BaZi:</strong> \${member.baziSummary}</p>\` : ''}
  \`;
  detailsPanel.classList.add('active');
}

function highlightThread(thread) {
  // Highlight the thread line
  d3.selectAll('.thread-line').style('opacity', 0.3);
  d3.select(\`[data-thread-id="\${thread.id}"]\`).style('opacity', 1).style('stroke-width', 6);

  // Highlight sidebar item
  document.querySelectorAll('.thread-item').forEach(el => el.style.opacity = 0.5);
  const sidebarItem = document.querySelector(\`[data-thread-id="\${thread.id}"]\`);
  if (sidebarItem) sidebarItem.style.opacity = 1;
}

function unhighlightThread() {
  d3.selectAll('.thread-line')
    .style('opacity', null)
    .style('stroke-width', null);
  document.querySelectorAll('.thread-item').forEach(el => el.style.opacity = 1);
}

function bindSidebarInteractions() {
  // Generation items
  document.querySelectorAll('.generation-item').forEach(item => {
    item.addEventListener('click', () => {
      const genIndex = parseInt(item.dataset.genIndex);
      // Scroll to that layer or highlight it
      const rect = document.querySelector(\`.gen-layer-rect[data-gen-index="\${genIndex}"]\`);
      if (rect) rect.style.strokeWidth = '3';
    });
  });

  // Thread items
  document.querySelectorAll('.thread-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const thread = window.GENERATIONAL_THREADS.find(t => t.id === item.dataset.threadId);
      if (thread) highlightThread(thread);
    });
    item.addEventListener('mouseleave', () => unhighlightThread());
  });

  // Canvas controls
  document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const svg = d3.select('#constellation-canvas svg');
      const currentTransform = d3.zoomTransform(svg.node());

      if (action === 'zoom-in') {
        svg.transition().call(d3.zoom().scaleTo, currentTransform.k * 1.5);
      } else if (action === 'zoom-out') {
        svg.transition().call(d3.zoom().scaleTo, currentTransform.k / 1.5);
      } else if (action === 'reset') {
        svg.transition().call(d3.zoom().transform, d3.zoomIdentity);
      }
    });
  });
}
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderGenerationalConstellationHtml,
  renderConstellationCanvasComponent,
  getGenerationalConstellationStyles,
  getGenerationalConstellationScript
};
