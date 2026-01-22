/**
 * ============================================
 * CONSTELLATION NARRATIVE DIFF UI TEMPLATE
 * Relationship-level narrative comparison UI
 *
 * Visualizes how two people's narratives interact:
 * - Story beat alignment
 * - Emotional resonance chart
 * - Timing synchronicity
 * - Overlay comparison
 * ============================================
 */

import {
  RelationshipNarrativeDiff,
  RelStoryBeatDiff,
  RelEmotionalDiffPoint,
  RelTimingDiffPoint,
  RelOverlayDiff,
  RelationshipDiffSummary
} from '../constellationNarrativeDiff';

// ==================== MAIN RENDER FUNCTIONS ====================

/**
 * Render full relationship narrative diff page
 */
export function renderRelationshipNarrativeDiffHtml(
  diff: RelationshipNarrativeDiff
): string {
  const nameA = diff.personAName || diff.personAId;
  const nameB = diff.personBName || diff.personBId;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relationship Narrative: ${nameA} & ${nameB}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    ${getRelDiffStyles()}
  </style>
</head>
<body>
  <div class="rel-diff-container">
    <header class="rel-header">
      <h1>Relationship Narrative</h1>
      <div class="names">
        <span class="name-a">${nameA}</span>
        <span class="heart">💫</span>
        <span class="name-b">${nameB}</span>
      </div>
    </header>

    ${renderRelSummarySection(diff.summary, nameA, nameB)}
    ${renderRelStoryBeatSection(diff.storyBeatDiff, nameA, nameB)}
    ${renderRelEmotionalSection(diff.emotionalDiff, nameA, nameB)}
    ${renderRelTimingSection(diff.timingDiff, nameA, nameB)}
    ${renderRelOverlaySection(diff.overlayDiff, nameA, nameB)}
  </div>

  <script>
    window.REL_DIFF = ${JSON.stringify(diff)};
    window.NAME_A = ${JSON.stringify(nameA)};
    window.NAME_B = ${JSON.stringify(nameB)};

    ${getRelDiffScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render embeddable component
 */
export function renderRelationshipNarrativeDiffComponent(
  diff: RelationshipNarrativeDiff
): string {
  const nameA = diff.personAName || diff.personAId;
  const nameB = diff.personBName || diff.personBId;

  return `
<div class="rel-diff-component">
  ${renderRelSummarySection(diff.summary, nameA, nameB)}
  ${renderRelStoryBeatSection(diff.storyBeatDiff, nameA, nameB)}
  ${renderRelEmotionalSection(diff.emotionalDiff, nameA, nameB)}
  ${renderRelTimingSection(diff.timingDiff, nameA, nameB)}
</div>
  `.trim();
}

// ==================== SECTION RENDERERS ====================

function renderRelSummarySection(
  summary: RelationshipDiffSummary,
  nameA: string,
  nameB: string
): string {
  const harmonyColor = summary.overallHarmony > 70 ? '#4ade80' :
                       summary.overallHarmony > 40 ? '#fbbf24' : '#f87171';

  return `
<section class="rel-summary-section">
  <h2>💫 Relationship Harmony</h2>
  <div class="summary-grid">
    <div class="harmony-gauge">
      <div class="gauge" style="--harmony: ${summary.overallHarmony}; --color: ${harmonyColor}">
        <span class="value">${summary.overallHarmony}%</span>
        <span class="label">Harmony</span>
      </div>
    </div>

    <div class="metrics">
      <div class="metric">
        <span class="metric-label">Emotional Resonance</span>
        <div class="metric-bar">
          <div class="fill" style="width: ${summary.emotionalResonance}%; background: #f472b6;"></div>
        </div>
        <span class="metric-value">${summary.emotionalResonance}%</span>
      </div>
      <div class="metric">
        <span class="metric-label">Timing Synchronicity</span>
        <div class="metric-bar">
          <div class="fill" style="width: ${summary.timingSynchronicity}%; background: #60a5fa;"></div>
        </div>
        <span class="metric-value">${summary.timingSynchronicity}%</span>
      </div>
      <div class="metric">
        <span class="metric-label">Shared Story Beats</span>
        <span class="metric-value">${summary.sharedBeats} shared</span>
      </div>
    </div>

    <div class="insight-card">
      <h3>Narrative Insight</h3>
      <p>${summary.narrativeInsight}</p>
      <div class="dynamic-type">
        <span class="tag">${formatDynamicType(summary.dominantDynamicType)}</span>
      </div>
    </div>
  </div>
</section>
  `;
}

function renderRelStoryBeatSection(
  diffs: RelStoryBeatDiff[],
  nameA: string,
  nameB: string
): string {
  const shared = diffs.filter(d => d.type === 'shared' || d.type === 'conflicting');
  const aOnly = diffs.filter(d => d.type === 'A-only');
  const bOnly = diffs.filter(d => d.type === 'B-only');

  return `
<section class="rel-story-section">
  <h2>📖 Story Beat Alignment</h2>

  <div class="beat-columns">
    <div class="column unique-a">
      <h3>${nameA} Only</h3>
      ${aOnly.map(d => renderBeatDiffCard(d, 'A')).join('')}
      ${aOnly.length === 0 ? '<p class="empty">No unique beats</p>' : ''}
    </div>

    <div class="column shared">
      <h3>Shared Journey</h3>
      ${shared.map(d => renderBeatDiffCard(d, 'shared')).join('')}
      ${shared.length === 0 ? '<p class="empty">No shared beats</p>' : ''}
    </div>

    <div class="column unique-b">
      <h3>${nameB} Only</h3>
      ${bOnly.map(d => renderBeatDiffCard(d, 'B')).join('')}
      ${bOnly.length === 0 ? '<p class="empty">No unique beats</p>' : ''}
    </div>
  </div>
</section>
  `;
}

function renderBeatDiffCard(diff: RelStoryBeatDiff, source: 'A' | 'B' | 'shared'): string {
  const borderColor = source === 'A' ? '#60a5fa' :
                      source === 'B' ? '#f472b6' : '#fbbf24';

  return `
<div class="beat-diff-card" style="border-left-color: ${borderColor}">
  <div class="beat-header">
    <span class="beat-label">${diff.beatLabel}</span>
    <span class="beat-age">Age ${diff.startAge}-${diff.endAge}</span>
  </div>
  ${diff.type === 'conflicting' ? `
    <div class="conflict-note">
      <span class="conflict-icon">⚡</span>
      <span>Different experiences</span>
    </div>
  ` : ''}
  ${diff.narrativeNote ? `<p class="beat-note">${diff.narrativeNote}</p>` : ''}
</div>
  `;
}

function renderRelEmotionalSection(
  diffs: RelEmotionalDiffPoint[],
  nameA: string,
  nameB: string
): string {
  return `
<section class="rel-emotional-section">
  <h2>💕 Emotional Resonance Over Time</h2>
  <div class="chart-container">
    <canvas id="relEmotionalChart"></canvas>
  </div>
  <div class="resonance-legend">
    <span class="legend-item high"><span class="dot"></span> High Resonance</span>
    <span class="legend-item medium"><span class="dot"></span> Medium Resonance</span>
    <span class="legend-item low"><span class="dot"></span> Low Resonance</span>
  </div>
</section>
  `;
}

function renderRelTimingSection(
  diffs: RelTimingDiffPoint[],
  nameA: string,
  nameB: string
): string {
  const syncedCount = diffs.filter(d => d.synchronicity === 'synced').length;
  const opposedCount = diffs.filter(d => d.synchronicity === 'opposed').length;

  return `
<section class="rel-timing-section">
  <h2>⏱ Timing Synchronicity</h2>
  <div class="timing-stats">
    <div class="stat synced">
      <span class="stat-value">${syncedCount}</span>
      <span class="stat-label">Synced Periods</span>
    </div>
    <div class="stat offset">
      <span class="stat-value">${diffs.length - syncedCount - opposedCount}</span>
      <span class="stat-label">Offset Periods</span>
    </div>
    <div class="stat opposed">
      <span class="stat-value">${opposedCount}</span>
      <span class="stat-label">Opposed Periods</span>
    </div>
  </div>
  <div class="chart-container">
    <canvas id="relTimingChart"></canvas>
  </div>
</section>
  `;
}

function renderRelOverlaySection(
  diffs: RelOverlayDiff[],
  nameA: string,
  nameB: string
): string {
  const shared = diffs.filter(d => d.type === 'shared');
  const unique = diffs.filter(d => d.type !== 'shared');

  return `
<section class="rel-overlay-section">
  <h2>🌍 Environmental Overlays</h2>
  <div class="overlay-grid">
    ${shared.length > 0 ? `
      <div class="overlay-group shared">
        <h4>Shared Influences</h4>
        ${shared.map(d => `
          <div class="overlay-item shared">
            <span class="label">${d.label}</span>
            <span class="ages">${d.startAge}-${d.endAge}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
    ${unique.length > 0 ? `
      <div class="overlay-group unique">
        <h4>Individual Influences</h4>
        ${unique.map(d => `
          <div class="overlay-item ${d.source === 'A' ? 'person-a' : 'person-b'}">
            <span class="label">${d.label}</span>
            <span class="source">${d.source === 'A' ? nameA : nameB}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </div>
</section>
  `;
}

// ==================== HELPERS ====================

function formatDynamicType(type: string): string {
  const labels: Record<string, string> = {
    'emotional_bond': 'Emotional Bond',
    'timing_alignment': 'Timing Alignment',
    'shared_journey': 'Shared Journey',
    'complementary_contrast': 'Complementary Contrast',
    'balanced': 'Balanced Dynamic'
  };
  return labels[type] || type;
}

// ==================== STYLES ====================

function getRelDiffStyles(): string {
  return `
    :root {
      --bg-primary: #0f0f1a;
      --bg-secondary: #1a1a2e;
      --bg-card: #252540;
      --text-primary: #e0e0e0;
      --text-muted: #a0a0b0;
      --gold: #d4af37;
      --color-a: #60a5fa;
      --color-b: #f472b6;
      --color-shared: #fbbf24;
      --success: #4ade80;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }

    .rel-diff-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .rel-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .rel-header h1 {
      color: var(--gold);
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .names {
      font-size: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }

    .name-a { color: var(--color-a); }
    .name-b { color: var(--color-b); }
    .heart { font-size: 1.5rem; }

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
    .summary-grid {
      display: grid;
      grid-template-columns: 150px 1fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .harmony-gauge {
      display: flex;
      justify-content: center;
    }

    .gauge {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        var(--color) calc(var(--harmony) * 1%),
        var(--bg-card) calc(var(--harmony) * 1%)
      );
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .gauge::before {
      content: '';
      position: absolute;
      width: 90px;
      height: 90px;
      background: var(--bg-secondary);
      border-radius: 50%;
    }

    .gauge .value, .gauge .label {
      position: relative;
      z-index: 1;
    }

    .gauge .value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .gauge .label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .metrics {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .metric {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .metric-label {
      width: 150px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .metric-bar {
      flex: 1;
      height: 8px;
      background: var(--bg-card);
      border-radius: 4px;
      overflow: hidden;
    }

    .metric-bar .fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s;
    }

    .metric-value {
      width: 50px;
      text-align: right;
      font-size: 0.85rem;
    }

    .insight-card {
      background: var(--bg-card);
      padding: 1rem;
      border-radius: 8px;
    }

    .insight-card h3 {
      color: var(--gold);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .insight-card p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .dynamic-type .tag {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    /* Story Beat Section */
    .beat-columns {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr;
      gap: 1rem;
    }

    .column h3 {
      text-align: center;
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .column.unique-a h3 { color: var(--color-a); }
    .column.shared h3 { color: var(--color-shared); }
    .column.unique-b h3 { color: var(--color-b); }

    .beat-diff-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      border-left: 3px solid;
    }

    .beat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .beat-label { font-weight: 600; }
    .beat-age { font-size: 0.75rem; color: var(--text-muted); }

    .conflict-note {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #f87171;
      margin: 0.25rem 0;
    }

    .beat-note {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .empty {
      text-align: center;
      color: var(--text-muted);
      font-style: italic;
      font-size: 0.85rem;
    }

    /* Chart Sections */
    .chart-container {
      position: relative;
      height: 250px;
    }

    .resonance-legend {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .legend-item .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .legend-item.high .dot { background: var(--success); }
    .legend-item.medium .dot { background: var(--color-shared); }
    .legend-item.low .dot { background: #f87171; }

    /* Timing Section */
    .timing-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .stat {
      text-align: center;
      padding: 0.75rem 1.5rem;
      background: var(--bg-card);
      border-radius: 8px;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .stat.synced .stat-value { color: var(--success); }
    .stat.offset .stat-value { color: var(--color-shared); }
    .stat.opposed .stat-value { color: #f87171; }

    /* Overlay Section */
    .overlay-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .overlay-group h4 {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .overlay-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: var(--bg-card);
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .overlay-item.shared { border-left: 3px solid var(--color-shared); }
    .overlay-item.person-a { border-left: 3px solid var(--color-a); }
    .overlay-item.person-b { border-left: 3px solid var(--color-b); }

    .overlay-item .source {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    @media (max-width: 900px) {
      .summary-grid { grid-template-columns: 1fr; }
      .beat-columns { grid-template-columns: 1fr; }
      .overlay-grid { grid-template-columns: 1fr; }
    }
  `;
}

// ==================== SCRIPT ====================

function getRelDiffScript(): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      initRelEmotionalChart();
      initRelTimingChart();
    });

    function initRelEmotionalChart() {
      const ctx = document.getElementById('relEmotionalChart');
      if (!ctx) return;

      const diff = window.REL_DIFF;
      const nameA = window.NAME_A;
      const nameB = window.NAME_B;

      const ages = diff.emotionalDiff.map(d => d.age);
      const valuesA = diff.emotionalDiff.map(d => d.valueA ?? 0);
      const valuesB = diff.emotionalDiff.map(d => d.valueB ?? 0);

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ages,
          datasets: [
            {
              label: nameA,
              data: valuesA,
              borderColor: '#60a5fa',
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: nameB,
              data: valuesB,
              borderColor: '#f472b6',
              backgroundColor: 'rgba(244, 114, 182, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e0e0e0' } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Age', color: '#a0a0b0' },
              ticks: { color: '#a0a0b0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: {
              title: { display: true, text: 'Emotional Intensity', color: '#a0a0b0' },
              ticks: { color: '#a0a0b0' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              min: -100,
              max: 100
            }
          }
        }
      });
    }

    function initRelTimingChart() {
      const ctx = document.getElementById('relTimingChart');
      if (!ctx) return;

      const diff = window.REL_DIFF;
      const nameA = window.NAME_A;
      const nameB = window.NAME_B;

      const ages = diff.timingDiff.map(d => d.age);
      const luckA = diff.timingDiff.map(d => d.luckA ?? 50);
      const luckB = diff.timingDiff.map(d => d.luckB ?? 50);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ages,
          datasets: [
            {
              label: nameA + ' Luck',
              data: luckA,
              backgroundColor: 'rgba(96, 165, 250, 0.7)',
              borderRadius: 4
            },
            {
              label: nameB + ' Luck',
              data: luckB,
              backgroundColor: 'rgba(244, 114, 182, 0.7)',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e0e0e0' } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Age', color: '#a0a0b0' },
              ticks: { color: '#a0a0b0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: {
              title: { display: true, text: 'Luck Level', color: '#a0a0b0' },
              ticks: { color: '#a0a0b0' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              min: 0,
              max: 100
            }
          }
        }
      });
    }
  `;
}

// ==================== EXPORTS ====================

export {
  renderRelationshipNarrativeDiffHtml,
  renderRelationshipNarrativeDiffComponent,
  getRelDiffStyles,
  getRelDiffScript
};
