/**
 * ============================================
 * CONSTELLATION UI TEMPLATE
 * Interactive star map visualization with
 * synastry axes, composite charts, and
 * relationship journey integration
 * ============================================
 */

import {
  ConstellationAnalysis,
  ConstellationMap,
  RelationshipAnalysis,
  SynastryAxisScore,
  PersonNode,
  GroupDynamics
} from '../constellationEngineV2';

// ==================== RENDER CONSTELLATION MAP ====================

/**
 * Render interactive constellation map as HTML
 */
export function renderConstellationMapHtml(analysis: ConstellationAnalysis): string {
  const { constellationMap, persons, relationships } = analysis;

  return `
<div class="constellation-container">
  <div class="constellation-header">
    <h1>Constellation Analysis</h1>
    <p class="subtitle">星座关系分析</p>
    <p class="meta">${persons.length} souls • ${relationships.length} connections</p>
  </div>

  <div class="constellation-main">
    <!-- Star Map Canvas -->
    <div class="map-panel">
      <canvas id="constellation-canvas" width="600" height="600"></canvas>
      <div id="tooltip" class="tooltip"></div>
    </div>

    <!-- Relationship Detail Panel -->
    <div class="detail-panel">
      <div id="relationship-detail">
        <p class="hint">Click a connection to see details</p>
      </div>
    </div>
  </div>

  <!-- Axes Breakdown -->
  <div class="axes-section">
    <h2>Synastry Axes</h2>
    <div id="axes-breakdown"></div>
  </div>

  <!-- Group Dynamics (if applicable) -->
  ${analysis.groupDynamics ? renderGroupDynamicsHtml(analysis.groupDynamics) : ''}

  <!-- Narrative Summary -->
  <div class="narrative-section">
    <h2>Constellation Narrative</h2>
    <p class="narrative">${analysis.overallNarrative}</p>
  </div>
</div>

<style>
${getConstellationStyles()}
</style>

<script>
${getConstellationScript(constellationMap, relationships)}
</script>
`;
}

function getConstellationStyles(): string {
  return `
  .constellation-container {
    font-family: 'Georgia', serif;
    background: #1a1a2e;
    color: #e8e6e3;
    padding: 2rem;
    min-height: 100vh;
  }

  .constellation-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .constellation-header h1 {
    color: #d4af37;
    font-size: 2em;
    margin-bottom: 0.5rem;
  }

  .constellation-header .subtitle {
    color: #9e9e9e;
    font-size: 1.2em;
  }

  .constellation-header .meta {
    color: #666;
    font-size: 0.9em;
  }

  .constellation-main {
    display: grid;
    grid-template-columns: 600px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .map-panel {
    position: relative;
    background: #0d0d1a;
    border-radius: 12px;
    padding: 1rem;
  }

  #constellation-canvas {
    display: block;
    cursor: pointer;
  }

  .tooltip {
    position: absolute;
    background: #2a2a3e;
    border: 1px solid #d4af37;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.85em;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    max-width: 200px;
    z-index: 100;
  }

  .tooltip.visible {
    opacity: 1;
  }

  .detail-panel {
    background: #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .detail-panel .hint {
    color: #666;
    font-style: italic;
    text-align: center;
  }

  .relationship-card {
    border-bottom: 1px solid #3a3a4e;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .relationship-card:last-child {
    border-bottom: none;
  }

  .relationship-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .relationship-names {
    font-size: 1.2em;
    color: #d4af37;
  }

  .relationship-score {
    font-size: 1.5em;
    font-weight: bold;
  }

  .score-excellent { color: #4caf50; }
  .score-good { color: #8bc34a; }
  .score-workable { color: #ff9800; }
  .score-challenging { color: #f44336; }

  .axis-bar {
    margin: 0.5rem 0;
  }

  .axis-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.85em;
    margin-bottom: 0.25rem;
  }

  .axis-track {
    height: 8px;
    background: #1a1a2e;
    border-radius: 4px;
    overflow: hidden;
  }

  .axis-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
  }

  .axis-fill.positive { background: linear-gradient(90deg, #4caf50, #8bc34a); }
  .axis-fill.mixed { background: linear-gradient(90deg, #ff9800, #ffc107); }
  .axis-fill.negative { background: linear-gradient(90deg, #f44336, #e91e63); }

  .persona-narrative {
    font-style: italic;
    color: #d4af37;
    border-left: 3px solid #d4af37;
    padding-left: 1rem;
    margin: 1rem 0;
  }

  .axes-section {
    background: #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .axes-section h2 {
    color: #d4af37;
    margin-bottom: 1rem;
  }

  .axes-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }

  .axis-card {
    background: #1a1a2e;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
  }

  .axis-card h3 {
    font-size: 0.9em;
    margin-bottom: 0.5rem;
  }

  .axis-card .score {
    font-size: 2em;
    font-weight: bold;
  }

  .axis-card .description {
    font-size: 0.8em;
    color: #9e9e9e;
    margin-top: 0.5rem;
  }

  .group-dynamics {
    background: #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .group-dynamics h2 {
    color: #d4af37;
    margin-bottom: 1rem;
  }

  .dynamics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .dynamics-item {
    background: #1a1a2e;
    border-radius: 8px;
    padding: 1rem;
  }

  .dynamics-item h4 {
    font-size: 0.85em;
    color: #9e9e9e;
    margin-bottom: 0.5rem;
  }

  .dynamics-item .value {
    font-size: 1.1em;
  }

  .narrative-section {
    background: #2a2a3e;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .narrative-section h2 {
    color: #d4af37;
    margin-bottom: 1rem;
  }

  .narrative {
    white-space: pre-line;
    line-height: 1.8;
  }

  .journey-steps {
    margin-top: 1.5rem;
  }

  .journey-step {
    border-left: 3px solid #d4af37;
    padding-left: 1rem;
    margin-bottom: 1rem;
  }

  .journey-step h4 {
    color: #d4af37;
    margin-bottom: 0.5rem;
  }

  .journey-step .teaching {
    font-style: italic;
    margin-bottom: 0.5rem;
  }

  .composite-chart {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #1a1a2e;
    border-radius: 8px;
  }

  .composite-chart h4 {
    color: #d4af37;
    margin-bottom: 0.5rem;
  }

  .element-bar {
    display: flex;
    height: 24px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .element-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7em;
    color: white;
  }

  .timing-windows {
    margin-top: 1rem;
  }

  .timing-window {
    padding: 0.5rem;
    margin: 0.25rem 0;
    background: #3a3a4e;
    border-radius: 4px;
    font-size: 0.85em;
  }

  @media (max-width: 900px) {
    .constellation-main {
      grid-template-columns: 1fr;
    }

    .axes-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .dynamics-grid {
      grid-template-columns: 1fr;
    }
  }
`;
}

function getConstellationScript(map: ConstellationMap, relationships: RelationshipAnalysis[]): string {
  return `
  const canvas = document.getElementById('constellation-canvas');
  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('tooltip');
  const detailPanel = document.getElementById('relationship-detail');

  const nodes = ${JSON.stringify(map.nodes)};
  const edges = ${JSON.stringify(map.edges)};
  const relationships = ${JSON.stringify(relationships)};

  let hoveredNode = null;
  let hoveredEdge = null;
  let selectedEdge = null;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw starfield background
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw small stars
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.2 + Math.random() * 0.3) + ')';
      ctx.fill();
    }

    // Draw edges
    for (const edge of edges) {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      ctx.strokeStyle = edge === selectedEdge ? '#d4af37' : edge.color;
      ctx.lineWidth = edge === selectedEdge ? edge.thickness + 2 : edge.thickness;

      if (edge.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (edge.style === 'dotted') {
        ctx.setLineDash([2, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // Draw edge label
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.font = '10px Georgia';
      ctx.fillStyle = '#9e9e9e';
      ctx.textAlign = 'center';
      ctx.fillText(edge.score + '%', midX, midY - 5);
    }

    // Draw nodes
    for (const node of nodes) {
      // Glow effect
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size);
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      if (node === hoveredNode) {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Label
      ctx.font = '12px Georgia';
      ctx.fillStyle = '#e8e6e3';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + node.size / 2 + 15);
    }
  }

  function getNodeAt(x, y) {
    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx*dx + dy*dy) < node.size / 2) {
        return node;
      }
    }
    return null;
  }

  function getEdgeAt(x, y) {
    for (const edge of edges) {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) continue;

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      const dx = x - midX;
      const dy = y - midY;
      if (Math.sqrt(dx*dx + dy*dy) < 20) {
        return edge;
      }
    }
    return null;
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hoveredNode = getNodeAt(x, y);
    hoveredEdge = getEdgeAt(x, y);

    if (hoveredNode) {
      tooltip.innerHTML = '<strong>' + hoveredNode.label + '</strong><br>' +
        'Element: ' + hoveredNode.element + '<br>' +
        'Strength: ' + hoveredNode.strength + '%';
      tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
      tooltip.style.top = (e.clientY - rect.top + 10) + 'px';
      tooltip.classList.add('visible');
      canvas.style.cursor = 'pointer';
    } else if (hoveredEdge) {
      const rel = relationships.find(r => r.edgeId === hoveredEdge.id);
      tooltip.innerHTML = '<strong>Score: ' + hoveredEdge.score + '%</strong><br>' +
        (rel ? rel.overallAssessment : 'Click for details');
      tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
      tooltip.style.top = (e.clientY - rect.top + 10) + 'px';
      tooltip.classList.add('visible');
      canvas.style.cursor = 'pointer';
    } else {
      tooltip.classList.remove('visible');
      canvas.style.cursor = 'default';
    }

    draw();
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedEdge = getEdgeAt(x, y);
    if (clickedEdge) {
      selectedEdge = clickedEdge;
      const rel = relationships.find(r => r.edgeId === clickedEdge.id);
      if (rel) {
        showRelationshipDetail(rel);
      }
      draw();
    }
  });

  function showRelationshipDetail(rel) {
    const scoreClass = rel.overallScore >= 70 ? 'score-excellent' :
                       rel.overallScore >= 55 ? 'score-good' :
                       rel.overallScore >= 40 ? 'score-workable' : 'score-challenging';

    let html = '<div class="relationship-card">';
    html += '<div class="relationship-header">';
    html += '<span class="relationship-names">' + rel.personA + ' ↔ ' + rel.personB + '</span>';
    html += '<span class="relationship-score ' + scoreClass + '">' + rel.overallScore + '%</span>';
    html += '</div>';

    // Axes bars
    for (const axis of rel.axes) {
      const fillClass = axis.score >= 60 ? 'positive' :
                        axis.score >= 40 ? 'mixed' : 'negative';
      const width = Math.abs(axis.score);

      html += '<div class="axis-bar">';
      html += '<div class="axis-label"><span>' + axis.axisZh + ' (' + axis.axis + ')</span><span>' + axis.score + '</span></div>';
      html += '<div class="axis-track"><div class="axis-fill ' + fillClass + '" style="width: ' + width + '%"></div></div>';
      html += '</div>';
    }

    // Persona narrative
    html += '<div class="persona-narrative">' + rel.personaNarrative + '</div>';

    // Journey steps
    html += '<div class="journey-steps"><h4>Relationship Journey</h4>';
    for (const step of rel.journeySteps) {
      html += '<div class="journey-step">';
      html += '<h4>Step ' + step.step + ': ' + step.axisZh + '</h4>';
      html += '<p class="teaching">' + step.teaching + '</p>';
      html += '<p>' + step.insight + '</p>';
      html += '</div>';
    }
    html += '</div>';

    // Composite chart
    html += '<div class="composite-chart">';
    html += '<h4>Composite Chart</h4>';
    html += '<p>' + rel.compositeChart.relationshipNature + '</p>';
    html += '<div class="element-bar">';
    for (const [element, pct] of Object.entries(rel.compositeChart.compositeElements)) {
      const colors = { Wood: '#4caf50', Fire: '#f44336', Earth: '#ff9800', Metal: '#9e9e9e', Water: '#2196f3' };
      html += '<div class="element-segment" style="width: ' + pct + '%; background: ' + colors[element] + '">' + element.charAt(0) + '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Timing windows
    if (rel.timingWindows.length > 0) {
      html += '<div class="timing-windows"><h4>Timing Windows</h4>';
      for (const tw of rel.timingWindows) {
        html += '<div class="timing-window">' + tw.description + ' (Age ' + tw.startAge + '-' + tw.endAge + ')</div>';
      }
      html += '</div>';
    }

    html += '</div>';

    detailPanel.innerHTML = html;
  }

  draw();
`;
}

function renderGroupDynamicsHtml(dynamics: GroupDynamics): string {
  return `
<div class="group-dynamics">
  <h2>Group Dynamics</h2>
  <div class="dynamics-grid">
    <div class="dynamics-item">
      <h4>Central Figure</h4>
      <div class="value">${dynamics.centralFigure || 'None identified'}</div>
    </div>
    <div class="dynamics-item">
      <h4>Power Balance</h4>
      <div class="value">${dynamics.powerBalance}</div>
    </div>
    <div class="dynamics-item">
      <h4>Overall Cohesion</h4>
      <div class="value">${dynamics.overallCohesion}%</div>
    </div>
    <div class="dynamics-item">
      <h4>Strongest Bond</h4>
      <div class="value">${dynamics.strongestBond.from} ↔ ${dynamics.strongestBond.to} (${dynamics.strongestBond.score}%)</div>
    </div>
    <div class="dynamics-item">
      <h4>Weakest Bond</h4>
      <div class="value">${dynamics.weakestBond.from} ↔ ${dynamics.weakestBond.to} (${dynamics.weakestBond.score}%)</div>
    </div>
    <div class="dynamics-item">
      <h4>Group Useful God</h4>
      <div class="value">${dynamics.groupUsefulGod || 'Varied'}</div>
    </div>
  </div>
</div>
`;
}

// ==================== RENDER RELATIONSHIP CARD ====================

export function renderRelationshipCardHtml(rel: RelationshipAnalysis): string {
  const scoreClass = rel.overallScore >= 70 ? 'score-excellent' :
                     rel.overallScore >= 55 ? 'score-good' :
                     rel.overallScore >= 40 ? 'score-workable' : 'score-challenging';

  return `
<article class="relationship-card">
  <header class="relationship-header">
    <span class="relationship-names">${rel.personA} ↔ ${rel.personB}</span>
    <span class="relationship-score ${scoreClass}">${rel.overallScore}%</span>
  </header>
  <p class="assessment">${rel.overallAssessment}</p>

  <div class="axes-breakdown">
    ${rel.axes.map(axis => renderAxisBar(axis)).join('')}
  </div>

  <blockquote class="persona-narrative">
    ${rel.personaNarrative}
  </blockquote>

  <div class="persona-narrative-zh">
    ${rel.personaNarrativeZh}
  </div>
</article>
`;
}

function renderAxisBar(axis: SynastryAxisScore): string {
  const fillClass = axis.score >= 60 ? 'positive' :
                    axis.score >= 40 ? 'mixed' : 'negative';
  const width = Math.max(5, Math.abs(axis.score));

  return `
<div class="axis-bar">
  <div class="axis-label">
    <span>${axis.axisZh} (${axis.axis})</span>
    <span>${axis.score}</span>
  </div>
  <div class="axis-track">
    <div class="axis-fill ${fillClass}" style="width: ${width}%"></div>
  </div>
</div>
`;
}

// ==================== RENDER JOURNEY INTEGRATION ====================

export function renderRelationshipJourneyHtml(rel: RelationshipAnalysis): string {
  return `
<div class="relationship-journey">
  <h2>Relationship Journey: ${rel.personA} & ${rel.personB}</h2>
  <p class="subtitle">关系朝圣之旅</p>

  <div class="journey-intro">
    <p>This journey guides you through the five axes of your connection.</p>
  </div>

  ${rel.journeySteps.map(step => `
    <article class="journey-step">
      <header>
        <span class="step-number">${step.step}</span>
        <h3>${step.axisZh} (${step.axis})</h3>
      </header>

      <section class="teaching">
        <h4>The Teaching</h4>
        <p>${step.teaching}</p>
      </section>

      <section class="trial">
        <h4>The Trial</h4>
        <p>${step.trial}</p>
      </section>

      <section class="insight">
        <h4>The Insight</h4>
        <p>${step.insight}</p>
      </section>
    </article>
  `).join('')}

  <div class="journey-conclusion">
    <h3>Recommendations</h3>
    <ul>
      ${rel.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ul>
  </div>
</div>
`;
}

// ==================== RENDER CODEX INTEGRATION ====================

export function renderSynastryCodexReferencesHtml(rel: RelationshipAnalysis): string {
  const allCodexRefs = rel.axes.flatMap(a => a.codexReferences);
  const uniqueRefs = [...new Set(allCodexRefs)];

  return `
<div class="codex-references">
  <h3>Related Codex Entries</h3>
  <p class="subtitle">相关典籍条目</p>

  <ul class="codex-list">
    ${uniqueRefs.map(ref => `
      <li class="codex-ref">
        <a href="#codex-${ref}">${ref}</a>
      </li>
    `).join('')}
  </ul>

  <p class="codex-note">
    These Codex entries illuminate the classical rules that shape this relationship.
    Click to explore each teaching in depth.
  </p>
</div>
`;
}

// ==================== FULL PAGE RENDER ====================

export function renderFullConstellationPageHtml(analysis: ConstellationAnalysis): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Constellation Analysis</title>
</head>
<body>
  ${renderConstellationMapHtml(analysis)}
</body>
</html>
`;
}

// ==================== EXPORTS ====================

export {
  getConstellationStyles,
  getConstellationScript,
  renderGroupDynamicsHtml,
  renderAxisBar
};
