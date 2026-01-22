/**
 * ============================================
 * BEYOND PROFESSIONAL UI TEMPLATE
 * The unified interface that brings together:
 * - Ming Pan Pro
 * - Narrative Cockpit
 * - Ancestral Temple
 * - Mythos Codex
 * - Hypergraph
 * - Profiling
 * - Ritual Engine
 * - Timeline
 * - Orchestration
 *
 * This is the Cathedral's Grand Hall interface.
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface BeyondProUIData {
  pro: string;
  narrative: string;
  ancestral: string;
  mythos: string;
  hypergraph: HypergraphRenderData;
  profiling: string;
  ritual: string;
  timeline: string;
  activePanel?: string;
  lang?: 'en' | 'zh';
}

export interface HypergraphRenderData {
  nodes: { id: string; label: string; type: string; x?: number; y?: number }[];
  edges: { from: string; to: string; relation: string }[];
}

// ==================== HTML RENDERING ====================

/**
 * Render the Beyond Professional UI as HTML
 */
export function renderBeyondProUIHtml(data: BeyondProUIData): string {
  const { lang = 'en' } = data;

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '超越专业版 — 统一形而上学智能系统' : 'Beyond Professional — Unified Metaphysics Intelligence'}</title>
  <style>
    ${getBeyondProStyles()}
  </style>
</head>
<body>
  <div class="beyond-pro-ui">

    <header class="grand-header">
      <h1>${lang === 'zh' ? '🏛️ 超越专业版' : '🏛️ Beyond Professional'}</h1>
      <p>${lang === 'zh' ? '统一形而上学智能系统' : 'The Unified Metaphysics Intelligence System'}</p>
    </header>

    <nav class="panel-nav">
      <button class="nav-btn active" data-panel="all">${lang === 'zh' ? '全部' : 'All'}</button>
      <button class="nav-btn" data-panel="pro">${lang === 'zh' ? '命盘' : 'Pro'}</button>
      <button class="nav-btn" data-panel="narrative">${lang === 'zh' ? '叙事' : 'Narrative'}</button>
      <button class="nav-btn" data-panel="ancestral">${lang === 'zh' ? '祖先' : 'Ancestral'}</button>
      <button class="nav-btn" data-panel="mythos">${lang === 'zh' ? '神话' : 'Mythos'}</button>
      <button class="nav-btn" data-panel="hypergraph">${lang === 'zh' ? '超图' : 'Hypergraph'}</button>
      <button class="nav-btn" data-panel="profiling">${lang === 'zh' ? '画像' : 'Profiling'}</button>
      <button class="nav-btn" data-panel="ritual">${lang === 'zh' ? '仪式' : 'Ritual'}</button>
      <button class="nav-btn" data-panel="timeline">${lang === 'zh' ? '时间线' : 'Timeline'}</button>
    </nav>

    <div class="grand-grid">

      <section class="panel" id="pro-panel" data-category="pro">
        <h2>${lang === 'zh' ? '📊 命盘专业版' : '📊 Ming Pan Pro'}</h2>
        <div id="pro-content" class="panel-content">${data.pro}</div>
      </section>

      <section class="panel" id="narrative-panel" data-category="narrative">
        <h2>${lang === 'zh' ? '📖 叙事驾驶舱' : '📖 Narrative Cockpit'}</h2>
        <div id="narrative-content" class="panel-content">${data.narrative}</div>
      </section>

      <section class="panel" id="ancestral-panel" data-category="ancestral">
        <h2>${lang === 'zh' ? '🕯️ 祖先庙堂' : '🕯️ Ancestral Temple'}</h2>
        <div id="ancestral-content" class="panel-content">${data.ancestral}</div>
      </section>

      <section class="panel" id="mythos-panel" data-category="mythos">
        <h2>${lang === 'zh' ? '📜 神话典籍' : '📜 Mythos Codex'}</h2>
        <div id="mythos-content" class="panel-content">${data.mythos}</div>
      </section>

      <section class="panel" id="hypergraph-panel" data-category="hypergraph">
        <h2>${lang === 'zh' ? '🔮 神话超图' : '🔮 Mythos Hypergraph'}</h2>
        <canvas id="hypergraph-canvas" width="400" height="300"></canvas>
      </section>

      <section class="panel" id="profiling-panel" data-category="profiling">
        <h2>${lang === 'zh' ? '🎭 个性画像' : '🎭 Profiling'}</h2>
        <div id="profiling-content" class="panel-content">${data.profiling}</div>
      </section>

      <section class="panel" id="ritual-panel" data-category="ritual">
        <h2>${lang === 'zh' ? '🔥 仪式时机' : '🔥 Ritual Timing'}</h2>
        <div id="ritual-content" class="panel-content">${data.ritual}</div>
      </section>

      <section class="panel" id="timeline-panel" data-category="timeline">
        <h2>${lang === 'zh' ? '⏳ 血脉时间线' : '⏳ Lineage Timeline'}</h2>
        <div id="timeline-content" class="panel-content">${data.timeline}</div>
      </section>

    </div>

    <footer class="grand-footer">
      <p>${lang === 'zh' ? '一切他有的，我们都有——而且更多' : 'Everything his platform does, mine does — and far more.'}</p>
    </footer>

  </div>

  <script>
    ${getBeyondProScript(data.hypergraph)}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render a single panel component
 */
export function renderPanelComponent(
  id: string,
  title: string,
  content: string,
  category: string
): string {
  return `
    <section class="panel" id="${id}-panel" data-category="${category}">
      <h2>${title}</h2>
      <div id="${id}-content" class="panel-content">${content}</div>
    </section>
  `;
}

// ==================== STYLES ====================

/**
 * Get Beyond Pro UI styles
 */
export function getBeyondProStyles(): string {
  return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: linear-gradient(135deg, #f5f3f0 0%, #e8e4dc 100%);
  color: #3a3a3a;
  min-height: 100vh;
}

.beyond-pro-ui {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.grand-header {
  text-align: center;
  padding: 32px 0;
  border-bottom: 3px double #c9b896;
  margin-bottom: 24px;
}

.grand-header h1 {
  font-size: 2.5rem;
  color: #4a3a2a;
  margin-bottom: 8px;
}

.grand-header p {
  font-size: 1.1rem;
  color: #7a6a5a;
  font-style: italic;
}

.panel-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.nav-btn {
  padding: 10px 20px;
  border: 2px solid #c9b896;
  background: transparent;
  color: #5a4a3a;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #f5f0e8;
}

.nav-btn.active {
  background: #5a4a3a;
  color: #fff;
  border-color: #5a4a3a;
}

.grand-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .grand-grid {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: #fffdf7;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e8e4dc;
  transition: all 0.3s ease;
}

.panel:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.panel.hidden {
  display: none;
}

.panel h2 {
  font-size: 1.2rem;
  color: #5a4a3a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8e4dc;
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f5f0e8;
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #c9b896;
  border-radius: 3px;
}

#hypergraph-canvas {
  width: 100%;
  height: 300px;
  background: #faf8f5;
  border-radius: 8px;
  border: 1px solid #e8e4dc;
}

.grand-footer {
  text-align: center;
  padding: 32px 0;
  margin-top: 24px;
  border-top: 3px double #c9b896;
}

.grand-footer p {
  font-style: italic;
  color: #7a6a5a;
  font-size: 1.1rem;
}
  `.trim();
}

// ==================== SCRIPT ====================

/**
 * Get Beyond Pro UI script
 */
export function getBeyondProScript(hypergraph: HypergraphRenderData): string {
  return `
(function() {
  // Panel filtering
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.panel');

  navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      navBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const panel = this.dataset.panel;

      panels.forEach(p => {
        if (panel === 'all' || p.dataset.category === panel) {
          p.classList.remove('hidden');
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });

  // Hypergraph rendering
  const canvas = document.getElementById('hypergraph-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const nodes = ${JSON.stringify(hypergraph.nodes)};
    const edges = ${JSON.stringify(hypergraph.edges)};

    // Simple force-directed layout
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Position nodes in a circle if no positions provided
    nodes.forEach((node, i) => {
      if (node.x === undefined || node.y === undefined) {
        const angle = (2 * Math.PI * i) / nodes.length;
        const radius = Math.min(width, height) * 0.35;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
      }
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw edges
      ctx.strokeStyle = '#c9b896';
      ctx.lineWidth = 1;
      edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      const colors = {
        archetype: '#8e44ad',
        theme: '#27ae60',
        shadow: '#2c3e50',
        gift: '#f39c12',
        thread: '#3498db',
        generation: '#e74c3c',
        default: '#7f8c8d'
      };

      nodes.forEach(node => {
        const color = colors[node.type] || colors.default;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Node label
        ctx.fillStyle = '#3a3a3a';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label.substring(0, 10), node.x, node.y + 22);
      });
    }

    draw();
  }
})();
  `.trim();
}

// ==================== EXPORTS ====================

export {
  renderBeyondProUIHtml,
  renderPanelComponent,
  getBeyondProStyles,
  getBeyondProScript
};
