/**
 * ============================================
 * MYTHOS CODEX VISUALIZER TEMPLATE
 * A visual interface for the Mythos Hypergraph:
 * - Archetype nodes
 * - Theme nodes
 * - Shadow nodes
 * - Gift nodes
 * - Inter-archetype connections
 *
 * This is the mythic map of the lineage.
 * ============================================
 */

import { MythosHypergraph, HypergraphNode, HypergraphEdge } from '../mythosHypergraph';

// ==================== DATA MODEL ====================

export interface MythosVisualizerUIData {
  hypergraph: MythosHypergraph;
  title?: string;
  lang?: 'en' | 'zh';
  width?: number;
  height?: number;
}

// ==================== HTML RENDERING ====================

/**
 * Render the complete mythos visualizer HTML
 */
export function renderMythosVisualizerHtml(data: MythosVisualizerUIData): string {
  const { hypergraph, title, lang = 'en', width = 900, height = 600 } = data;

  const displayTitle = title || (lang === 'zh' ? '神话法典可视化器' : 'Mythos Codex Visualizer');

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayTitle}</title>
  <style>
    ${getMythosVisualizerStyles()}
  </style>
</head>
<body>
  <div class="mythos-visualizer">
    <header class="visualizer-header">
      <h1>${lang === 'zh' ? '🕸️ 神话法典可视化器' : '🕸️ Mythos Codex Visualizer'}</h1>
      <p class="subtitle">${lang === 'zh' ? '原型互联与神话结构' : 'Archetype interconnections and mythic structure'}</p>
    </header>

    <div class="visualizer-content">
      <div class="canvas-container">
        <canvas id="hypergraph-canvas" width="${width}" height="${height}"></canvas>
      </div>

      <div class="legend-panel">
        <h3>${lang === 'zh' ? '图例' : 'Legend'}</h3>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-color archetype"></span>
            <span class="legend-label">${lang === 'zh' ? '原型' : 'Archetype'}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color theme"></span>
            <span class="legend-label">${lang === 'zh' ? '主题' : 'Theme'}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color shadow"></span>
            <span class="legend-label">${lang === 'zh' ? '阴影' : 'Shadow'}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color gift"></span>
            <span class="legend-label">${lang === 'zh' ? '天赋' : 'Gift'}</span>
          </div>
          <div class="legend-item">
            <span class="legend-color thread"></span>
            <span class="legend-label">${lang === 'zh' ? '线索' : 'Thread'}</span>
          </div>
        </div>
      </div>

      <div class="stats-panel">
        <h3>${lang === 'zh' ? '统计' : 'Statistics'}</h3>
        <div class="stat-item">
          <span class="stat-label">${lang === 'zh' ? '节点' : 'Nodes'}:</span>
          <span class="stat-value">${hypergraph.nodes.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${lang === 'zh' ? '连接' : 'Edges'}:</span>
          <span class="stat-value">${hypergraph.edges.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${lang === 'zh' ? '原型' : 'Archetypes'}:</span>
          <span class="stat-value">${hypergraph.metadata.archetypeCount}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${lang === 'zh' ? '密度' : 'Density'}:</span>
          <span class="stat-value">${(hypergraph.metadata.density * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div class="node-details" id="node-details">
        <h3>${lang === 'zh' ? '节点详情' : 'Node Details'}</h3>
        <p class="placeholder">${lang === 'zh' ? '点击节点查看详情' : 'Click a node to see details'}</p>
      </div>
    </div>

    <div class="controls">
      <button id="btn-reset">${lang === 'zh' ? '重置视图' : 'Reset View'}</button>
      <button id="btn-archetypes">${lang === 'zh' ? '仅原型' : 'Archetypes Only'}</button>
      <button id="btn-all">${lang === 'zh' ? '显示全部' : 'Show All'}</button>
    </div>
  </div>

  <script>
    window.HYPERGRAPH_DATA = ${JSON.stringify(hypergraph)};
    window.CANVAS_WIDTH = ${width};
    window.CANVAS_HEIGHT = ${height};
    ${getMythosVisualizerScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render just the canvas component
 */
export function renderVisualizerCanvasComponent(
  hypergraph: MythosHypergraph,
  width: number = 900,
  height: number = 600
): string {
  return `
    <div class="canvas-container">
      <canvas id="hypergraph-canvas" width="${width}" height="${height}"></canvas>
    </div>
    <script>
      window.HYPERGRAPH_DATA = ${JSON.stringify(hypergraph)};
      window.CANVAS_WIDTH = ${width};
      window.CANVAS_HEIGHT = ${height};
    </script>
  `;
}

// ==================== STYLES ====================

/**
 * Get CSS styles for the mythos visualizer
 */
export function getMythosVisualizerStyles(): string {
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

.mythos-visualizer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.visualizer-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #d4c5a9;
}

.visualizer-header h1 {
  font-size: 1.8rem;
  color: #5a4a3a;
  margin-bottom: 8px;
}

.subtitle {
  color: #7a6a5a;
  font-style: italic;
}

.visualizer-content {
  display: grid;
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto auto;
  gap: 16px;
}

@media (max-width: 900px) {
  .visualizer-content {
    grid-template-columns: 1fr;
  }
}

.canvas-container {
  grid-column: 1;
  grid-row: 1 / 3;
  background: #fffef9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

#hypergraph-canvas {
  width: 100%;
  height: auto;
  cursor: pointer;
}

.legend-panel,
.stats-panel,
.node-details {
  background: #f7f5ef;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.legend-panel h3,
.stats-panel h3,
.node-details h3 {
  font-size: 1rem;
  color: #5a4a3a;
  margin-bottom: 12px;
  border-bottom: 1px solid #d4c5a9;
  padding-bottom: 8px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-color.archetype { background: #c8b4ff; border: 2px solid #a090e0; }
.legend-color.theme { background: #b4e6ff; border: 2px solid #90c0e0; }
.legend-color.shadow { background: #ffb4b4; border: 2px solid #e09090; }
.legend-color.gift { background: #b4ffb4; border: 2px solid #90e090; }
.legend-color.thread { background: #ffd4a0; border: 2px solid #e0b080; }

.legend-label {
  font-size: 0.9rem;
  color: #5a4a3a;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-label {
  color: #7a6a5a;
}

.stat-value {
  font-weight: 600;
  color: #5a4a3a;
}

.node-details {
  grid-column: 2;
}

.node-details .placeholder {
  color: #9a8a7a;
  font-style: italic;
  font-size: 0.9rem;
}

.node-details .detail-item {
  margin-bottom: 8px;
}

.node-details .detail-label {
  font-weight: 600;
  color: #5a4a3a;
}

.node-details .detail-value {
  color: #6a5a4a;
}

.controls {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.controls button {
  padding: 10px 20px;
  font-family: inherit;
  font-size: 0.9rem;
  background: #d4c5a9;
  border: none;
  border-radius: 6px;
  color: #5a4a3a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.controls button:hover {
  background: #c4b599;
  transform: translateY(-2px);
}

.controls button:active {
  transform: translateY(0);
}
  `.trim();
}

// ==================== SCRIPT ====================

/**
 * Get JavaScript for the mythos visualizer
 */
export function getMythosVisualizerScript(): string {
  return `
(function() {
  const canvas = document.getElementById('hypergraph-canvas');
  const ctx = canvas.getContext('2d');
  const graph = window.HYPERGRAPH_DATA;

  // Node colors by type
  const nodeColors = {
    archetype: { fill: '#c8b4ff', stroke: '#a090e0' },
    theme: { fill: '#b4e6ff', stroke: '#90c0e0' },
    shadow: { fill: '#ffb4b4', stroke: '#e09090' },
    gift: { fill: '#b4ffb4', stroke: '#90e090' },
    thread: { fill: '#ffd4a0', stroke: '#e0b080' },
    generation: { fill: '#d0d0d0', stroke: '#a0a0a0' }
  };

  // Node sizes by type
  const nodeSizes = {
    archetype: 18,
    theme: 12,
    shadow: 10,
    gift: 10,
    thread: 14,
    generation: 8
  };

  // Initialize node positions (force-directed layout simulation)
  let nodes = graph.nodes.map((n, i) => ({
    ...n,
    x: 100 + Math.random() * (window.CANVAS_WIDTH - 200),
    y: 100 + Math.random() * (window.CANVAS_HEIGHT - 200),
    vx: 0,
    vy: 0,
    visible: true
  }));

  const edges = graph.edges;

  // Simple force simulation
  function simulate() {
    const k = 0.01; // spring constant
    const repulsion = 5000;
    const damping = 0.9;

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (dist * dist);

        nodes[i].vx -= (dx / dist) * force;
        nodes[i].vy -= (dy / dist) * force;
        nodes[j].vx += (dx / dist) * force;
        nodes[j].vy += (dy / dist) * force;
      }
    }

    // Attraction along edges
    edges.forEach(e => {
      const from = nodes.find(n => n.id === e.from);
      const to = nodes.find(n => n.id === e.to);
      if (!from || !to) return;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      from.vx += dx * k;
      from.vy += dy * k;
      to.vx -= dx * k;
      to.vy -= dy * k;
    });

    // Update positions with damping
    nodes.forEach(n => {
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;

      // Keep in bounds
      n.x = Math.max(30, Math.min(window.CANVAS_WIDTH - 30, n.x));
      n.y = Math.max(30, Math.min(window.CANVAS_HEIGHT - 30, n.y));
    });
  }

  // Draw function
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(e => {
      const from = nodes.find(n => n.id === e.from);
      const to = nodes.find(n => n.id === e.to);
      if (!from || !to || !from.visible || !to.visible) return;

      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = e.weight / 30;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      if (!n.visible) return;

      const colors = nodeColors[n.type] || nodeColors.theme;
      const size = nodeSizes[n.type] || 10;

      ctx.fillStyle = colors.fill;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#333';
      ctx.font = '11px serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label.substring(0, 15), n.x, n.y + size + 14);
    });
  }

  // Animation loop
  let running = true;
  let iterations = 0;
  function animate() {
    if (!running) return;
    if (iterations < 150) {
      simulate();
      iterations++;
    }
    draw();
    requestAnimationFrame(animate);
  }

  animate();

  // Click handling
  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked node
    const clicked = nodes.find(n => {
      const size = nodeSizes[n.type] || 10;
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < size + 5;
    });

    if (clicked) {
      showNodeDetails(clicked);
    }
  });

  function showNodeDetails(node) {
    const detailsEl = document.getElementById('node-details');
    const connections = edges.filter(e => e.from === node.id || e.to === node.id).length;

    detailsEl.innerHTML = \`
      <h3>Node Details</h3>
      <div class="detail-item">
        <span class="detail-label">Label:</span>
        <span class="detail-value">\${node.label}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Type:</span>
        <span class="detail-value">\${node.type}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Connections:</span>
        <span class="detail-value">\${connections}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Weight:</span>
        <span class="detail-value">\${node.weight}</span>
      </div>
    \`;
  }

  // Controls
  document.getElementById('btn-reset').addEventListener('click', function() {
    nodes.forEach(n => {
      n.x = 100 + Math.random() * (window.CANVAS_WIDTH - 200);
      n.y = 100 + Math.random() * (window.CANVAS_HEIGHT - 200);
      n.vx = 0;
      n.vy = 0;
      n.visible = true;
    });
    iterations = 0;
  });

  document.getElementById('btn-archetypes').addEventListener('click', function() {
    nodes.forEach(n => {
      n.visible = n.type === 'archetype';
    });
  });

  document.getElementById('btn-all').addEventListener('click', function() {
    nodes.forEach(n => {
      n.visible = true;
    });
  });
})();
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderMythosVisualizerHtml,
  renderVisualizerCanvasComponent,
  getMythosVisualizerStyles,
  getMythosVisualizerScript
};
