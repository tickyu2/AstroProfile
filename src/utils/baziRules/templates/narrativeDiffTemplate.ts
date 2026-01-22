/**
 * ============================================
 * NARRATIVE DIFF UI TEMPLATE
 * Side-by-side comparison of two narrative cockpits
 *
 * Features:
 * - Story Beat Diff View with A-only/B-only/different highlighting
 * - Emotional Arc Overlay Chart (dual lines)
 * - Timing Curve Comparison
 * - Reverse Mapping Panel (click beat → see rules)
 * - Diff Summary Dashboard
 * ============================================
 */

import { CodexEntry } from '../codexTypes';
import {
  NarrativeCockpitData,
  StoryBeat,
  EmotionalArcPoint,
  TimingCurvePoint
} from '../narrativeCockpitModel';
import {
  NarrativeDiff,
  StoryBeatDiff,
  EmotionalArcDiff,
  TimingCurveDiff,
  DiffSummary,
  StoryBeatReverseMap,
  buildStoryBeatReverseMap,
  diffNarratives,
  generateDiffNarrativeSummary
} from '../narrativeDiffEngine';

// ==================== MAIN RENDER FUNCTIONS ====================

/**
 * Render complete Narrative Diff page
 */
export function renderNarrativeDiffHtml(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData,
  codexA: CodexEntry[],
  codexB: CodexEntry[],
  nameA: string = 'Chart A',
  nameB: string = 'Chart B'
): string {
  const diff = diffNarratives(cockpitA, cockpitB);
  const reverseMapsA = buildStoryBeatReverseMap(cockpitA, codexA);
  const reverseMapsB = buildStoryBeatReverseMap(cockpitB, codexB);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Narrative Diff: ${nameA} vs ${nameB}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    ${getNarrativeDiffStyles()}
  </style>
</head>
<body>
  <div class="diff-container">
    <header class="diff-header">
      <h1>Narrative Diff</h1>
      <div class="chart-names">
        <span class="name-a">${nameA}</span>
        <span class="vs">vs</span>
        <span class="name-b">${nameB}</span>
      </div>
    </header>

    <!-- Summary Dashboard -->
    ${renderDiffSummarySection(diff.summary, nameA, nameB)}

    <!-- Story Beat Diff -->
    ${renderStoryBeatDiffSection(diff.storyBeatDiffs, cockpitA.storyBeats, cockpitB.storyBeats, nameA, nameB)}

    <!-- Emotional Arc Overlay -->
    ${renderEmotionalArcOverlaySection(cockpitA.emotionalArc, cockpitB.emotionalArc, diff.emotionalArcDiffs, nameA, nameB)}

    <!-- Timing Curve Comparison -->
    ${renderTimingCurveComparisonSection(cockpitA.timingCurve, cockpitB.timingCurve, diff.timingCurveDiffs, nameA, nameB)}

    <!-- Reverse Mapping Panel -->
    ${renderReverseMappingPanel(reverseMapsA, reverseMapsB, nameA, nameB)}
  </div>

  <script>
    // Inject data for JavaScript interaction
    window.COCKPIT_A = ${JSON.stringify(cockpitA)};
    window.COCKPIT_B = ${JSON.stringify(cockpitB)};
    window.DIFF = ${JSON.stringify(diff)};
    window.REVERSE_MAPS_A = ${JSON.stringify(reverseMapsA)};
    window.REVERSE_MAPS_B = ${JSON.stringify(reverseMapsB)};
    window.NAME_A = ${JSON.stringify(nameA)};
    window.NAME_B = ${JSON.stringify(nameB)};

    ${getNarrativeDiffScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render embeddable Narrative Diff component (no full HTML wrapper)
 */
export function renderNarrativeDiffComponent(
  cockpitA: NarrativeCockpitData,
  cockpitB: NarrativeCockpitData,
  codexA: CodexEntry[],
  codexB: CodexEntry[],
  nameA: string = 'Chart A',
  nameB: string = 'Chart B'
): string {
  const diff = diffNarratives(cockpitA, cockpitB);
  const reverseMapsA = buildStoryBeatReverseMap(cockpitA, codexA);
  const reverseMapsB = buildStoryBeatReverseMap(cockpitB, codexB);

  return `
<div class="narrative-diff-component">
  ${renderDiffSummarySection(diff.summary, nameA, nameB)}
  ${renderStoryBeatDiffSection(diff.storyBeatDiffs, cockpitA.storyBeats, cockpitB.storyBeats, nameA, nameB)}
  ${renderEmotionalArcOverlaySection(cockpitA.emotionalArc, cockpitB.emotionalArc, diff.emotionalArcDiffs, nameA, nameB)}
  ${renderTimingCurveComparisonSection(cockpitA.timingCurve, cockpitB.timingCurve, diff.timingCurveDiffs, nameA, nameB)}
  ${renderReverseMappingPanel(reverseMapsA, reverseMapsB, nameA, nameB)}
</div>
  `.trim();
}

// ==================== SECTION RENDERERS ====================

function renderDiffSummarySection(summary: DiffSummary, nameA: string, nameB: string): string {
  const similarityColor = summary.overallSimilarity > 70 ? '#4ade80' :
                          summary.overallSimilarity > 40 ? '#fbbf24' : '#f87171';

  return `
<section class="diff-summary-section">
  <h2>📊 Diff Summary</h2>
  <div class="summary-grid">
    <div class="similarity-gauge">
      <div class="gauge-circle" style="--similarity: ${summary.overallSimilarity}; --color: ${similarityColor}">
        <span class="gauge-value">${summary.overallSimilarity}%</span>
        <span class="gauge-label">Similar</span>
      </div>
    </div>
    <div class="diff-stats">
      <div class="stat-row">
        <span class="stat-label">Story Beats</span>
        <span class="stat-value ${summary.storyBeatDifferenceCount > 0 ? 'has-diff' : ''}">${summary.storyBeatDifferenceCount} differences</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Emotional Arc</span>
        <span class="stat-value ${summary.emotionalArcDifferenceCount > 0 ? 'has-diff' : ''}">${summary.emotionalArcDifferenceCount} differences</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Timing Curve</span>
        <span class="stat-value ${summary.timingCurveDifferenceCount > 0 ? 'has-diff' : ''}">${summary.timingCurveDifferenceCount} differences</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Overlays</span>
        <span class="stat-value ${summary.overlayDifferenceCount > 0 ? 'has-diff' : ''}">${summary.overlayDifferenceCount} differences</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Chapters</span>
        <span class="stat-value ${summary.chapterDifferenceCount > 0 ? 'has-diff' : ''}">${summary.chapterDifferenceCount} differences</span>
      </div>
    </div>
    <div class="narrative-insight">
      <h3>Narrative Insight</h3>
      <p>${generateDiffNarrativeSummary({ summary } as NarrativeDiff, nameA, nameB)}</p>
      <div class="dominant-diff">
        <span class="label">Primary Divergence:</span>
        <span class="value">${formatDominantType(summary.dominantDifferenceType)}</span>
      </div>
    </div>
  </div>
</section>
  `;
}

function renderStoryBeatDiffSection(
  diffs: StoryBeatDiff[],
  beatsA: StoryBeat[],
  beatsB: StoryBeat[],
  nameA: string,
  nameB: string
): string {
  const aOnlyDiffs = diffs.filter(d => d.type === 'A-only');
  const bOnlyDiffs = diffs.filter(d => d.type === 'B-only');
  const bothDiffs = diffs.filter(d => d.type === 'both-different');

  return `
<section class="story-beat-diff-section">
  <h2>📖 Story Beat Comparison</h2>

  <div class="beat-diff-container">
    <!-- Column A -->
    <div class="beat-column column-a">
      <h3 class="column-header">${nameA}</h3>
      <div class="beats-list">
        ${beatsA.map(beat => {
          const diff = diffs.find(d => d.beatA?.id === beat.id);
          const diffClass = diff ? `diff-${diff.type}` : 'no-diff';
          return renderBeatCard(beat, 'A', diffClass);
        }).join('')}
      </div>
    </div>

    <!-- Diff Indicators -->
    <div class="diff-indicators">
      ${diffs.map(d => renderDiffIndicator(d)).join('')}
    </div>

    <!-- Column B -->
    <div class="beat-column column-b">
      <h3 class="column-header">${nameB}</h3>
      <div class="beats-list">
        ${beatsB.map(beat => {
          const diff = diffs.find(d => d.beatB?.id === beat.id);
          const diffClass = diff ? `diff-${diff.type}` : 'no-diff';
          return renderBeatCard(beat, 'B', diffClass);
        }).join('')}
      </div>
    </div>
  </div>

  <div class="beat-diff-legend">
    <span class="legend-item identical"><span class="dot"></span> Identical</span>
    <span class="legend-item a-only"><span class="dot"></span> ${nameA} Only</span>
    <span class="legend-item b-only"><span class="dot"></span> ${nameB} Only</span>
    <span class="legend-item different"><span class="dot"></span> Different</span>
  </div>
</section>
  `;
}

function renderBeatCard(beat: StoryBeat, source: 'A' | 'B', diffClass: string): string {
  const valenceIcon = beat.valence === 'positive' ? '☀️' :
                      beat.valence === 'negative' ? '🌙' : '⚖️';

  return `
<div class="beat-card ${diffClass}" data-beat-id="${beat.id}" data-source="${source}">
  <div class="beat-header">
    <span class="beat-label">${beat.label}</span>
    <span class="beat-valence">${valenceIcon}</span>
  </div>
  <div class="beat-meta">
    <span class="beat-time">Age ${beat.timeRange.startAge}-${beat.timeRange.endAge}</span>
    <span class="beat-intensity">Intensity: ${beat.intensity}</span>
  </div>
  <p class="beat-desc">${beat.description}</p>
  <button class="show-rules-btn" onclick="showRulesForBeat('${beat.id}', '${source}')">
    Show Rules →
  </button>
</div>
  `;
}

function renderDiffIndicator(diff: StoryBeatDiff): string {
  const icon = diff.type === 'A-only' ? '←' :
               diff.type === 'B-only' ? '→' :
               diff.type === 'both-different' ? '↔' : '=';
  const className = `indicator-${diff.type}`;

  return `
<div class="diff-indicator ${className}" title="${diff.description || diff.beatLabel}">
  <span class="indicator-icon">${icon}</span>
  <span class="indicator-label">${diff.beatLabel}</span>
</div>
  `;
}

function renderEmotionalArcOverlaySection(
  arcA: EmotionalArcPoint[],
  arcB: EmotionalArcPoint[],
  diffs: EmotionalArcDiff[],
  nameA: string,
  nameB: string
): string {
  return `
<section class="emotional-arc-section">
  <h2>💫 Emotional Arc Overlay</h2>
  <div class="chart-container">
    <canvas id="emotionalArcOverlayChart"></canvas>
  </div>
  <div class="arc-diff-notes">
    <h4>Key Divergences</h4>
    <ul class="divergence-list">
      ${diffs.slice(0, 5).map(d => `
        <li class="divergence-item ${d.type}">
          <span class="age">Age ${d.age}:</span>
          ${d.type === 'delta' ?
            `Intensity Δ${d.intensityDelta?.toFixed(0)} ${d.valenceDifference ? '(valence differs)' : ''}` :
            `${d.type === 'A-only' ? nameA : nameB} only`
          }
        </li>
      `).join('')}
    </ul>
  </div>
</section>
  `;
}

function renderTimingCurveComparisonSection(
  curveA: TimingCurvePoint[],
  curveB: TimingCurvePoint[],
  diffs: TimingCurveDiff[],
  nameA: string,
  nameB: string
): string {
  return `
<section class="timing-curve-section">
  <h2>🕐 Timing & Luck Comparison</h2>
  <div class="chart-container">
    <canvas id="timingCurveComparisonChart"></canvas>
  </div>
  <div class="timing-diff-notes">
    <h4>Timing Differences</h4>
    <ul class="timing-diff-list">
      ${diffs.slice(0, 5).map(d => `
        <li class="timing-diff-item ${d.type}">
          <span class="age">Age ${d.age}:</span>
          ${d.type === 'delta' ?
            `Luck Δ${d.luckDelta?.toFixed(0)}, Volatility Δ${d.volatilityDelta?.toFixed(0)} ${d.phaseDifference ? '(phase differs)' : ''}` :
            `${d.type === 'A-only' ? nameA : nameB} only`
          }
        </li>
      `).join('')}
    </ul>
  </div>
</section>
  `;
}

function renderReverseMappingPanel(
  reverseMapsA: StoryBeatReverseMap[],
  reverseMapsB: StoryBeatReverseMap[],
  nameA: string,
  nameB: string
): string {
  return `
<section class="reverse-mapping-section">
  <h2>🔍 Story Beat → Rules (Reverse Mapping)</h2>
  <p class="section-desc">Click a story beat above to see which rules shaped it</p>

  <div class="reverse-panel" id="reverseMappingPanel">
    <div class="placeholder-message">
      <span class="icon">👆</span>
      <span>Select a story beat to view its source rules</span>
    </div>
  </div>
</section>
  `;
}

// ==================== HELPER FUNCTIONS ====================

function formatDominantType(type: string): string {
  const labels: Record<string, string> = {
    'story_structure': 'Story Structure',
    'emotional_trajectory': 'Emotional Trajectory',
    'timing_luck': 'Timing & Luck',
    'environmental_context': 'Environmental Context',
    'life_chapters': 'Life Chapters',
    'balanced': 'Balanced Differences'
  };
  return labels[type] || type;
}

// ==================== STYLES ====================

function getNarrativeDiffStyles(): string {
  return `
    :root {
      --bg-primary: #0f0f1a;
      --bg-secondary: #1a1a2e;
      --bg-tertiary: #252540;
      --text-primary: #e0e0e0;
      --text-secondary: #a0a0b0;
      --accent-gold: #d4af37;
      --color-a: #60a5fa;
      --color-b: #f472b6;
      --color-diff: #fbbf24;
      --color-success: #4ade80;
      --color-danger: #f87171;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }

    .diff-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .diff-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--bg-tertiary);
    }

    .diff-header h1 {
      font-size: 2rem;
      color: var(--accent-gold);
      margin-bottom: 0.5rem;
    }

    .chart-names {
      font-size: 1.25rem;
    }

    .name-a { color: var(--color-a); }
    .name-b { color: var(--color-b); }
    .vs { color: var(--text-secondary); margin: 0 1rem; }

    /* Summary Section */
    .diff-summary-section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .diff-summary-section h2 {
      color: var(--accent-gold);
      margin-bottom: 1rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 180px 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .similarity-gauge {
      display: flex;
      justify-content: center;
    }

    .gauge-circle {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: conic-gradient(
        var(--color) calc(var(--similarity) * 1%),
        var(--bg-tertiary) calc(var(--similarity) * 1%)
      );
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .gauge-circle::before {
      content: '';
      position: absolute;
      width: 100px;
      height: 100px;
      background: var(--bg-secondary);
      border-radius: 50%;
    }

    .gauge-value, .gauge-label {
      position: relative;
      z-index: 1;
    }

    .gauge-value {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--text-primary);
    }

    .gauge-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .diff-stats {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: var(--bg-tertiary);
      border-radius: 6px;
    }

    .stat-label { color: var(--text-secondary); }
    .stat-value { color: var(--text-primary); }
    .stat-value.has-diff { color: var(--color-diff); }

    .narrative-insight {
      background: var(--bg-tertiary);
      padding: 1rem;
      border-radius: 8px;
    }

    .narrative-insight h3 {
      color: var(--accent-gold);
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .narrative-insight p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .dominant-diff {
      display: flex;
      gap: 0.5rem;
    }

    .dominant-diff .label { color: var(--text-secondary); }
    .dominant-diff .value { color: var(--color-diff); font-weight: 600; }

    /* Story Beat Diff Section */
    .story-beat-diff-section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .story-beat-diff-section h2 {
      color: var(--accent-gold);
      margin-bottom: 1rem;
    }

    .beat-diff-container {
      display: grid;
      grid-template-columns: 1fr 60px 1fr;
      gap: 1rem;
    }

    .beat-column {
      display: flex;
      flex-direction: column;
    }

    .column-header {
      text-align: center;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border-radius: 6px;
    }

    .column-a .column-header { background: rgba(96, 165, 250, 0.2); color: var(--color-a); }
    .column-b .column-header { background: rgba(244, 114, 182, 0.2); color: var(--color-b); }

    .beats-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .beat-card {
      background: var(--bg-tertiary);
      border-radius: 8px;
      padding: 1rem;
      border-left: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .beat-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .beat-card.diff-A-only { border-left-color: var(--color-a); }
    .beat-card.diff-B-only { border-left-color: var(--color-b); }
    .beat-card.diff-both-different { border-left-color: var(--color-diff); }
    .beat-card.no-diff { border-left-color: var(--color-success); }

    .beat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .beat-label {
      font-weight: 600;
      color: var(--text-primary);
    }

    .beat-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .beat-desc {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }

    .show-rules-btn {
      background: none;
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }

    .show-rules-btn:hover {
      background: var(--accent-gold);
      color: var(--bg-primary);
    }

    .diff-indicators {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 3rem;
    }

    .diff-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.7rem;
      padding: 0.25rem;
      border-radius: 4px;
      background: var(--bg-tertiary);
    }

    .indicator-icon {
      font-size: 1rem;
    }

    .indicator-A-only .indicator-icon { color: var(--color-a); }
    .indicator-B-only .indicator-icon { color: var(--color-b); }
    .indicator-both-different .indicator-icon { color: var(--color-diff); }

    .indicator-label {
      font-size: 0.65rem;
      color: var(--text-secondary);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 50px;
    }

    .beat-diff-legend {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--bg-tertiary);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .legend-item .dot {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    .legend-item.identical .dot { background: var(--color-success); }
    .legend-item.a-only .dot { background: var(--color-a); }
    .legend-item.b-only .dot { background: var(--color-b); }
    .legend-item.different .dot { background: var(--color-diff); }

    /* Chart Sections */
    .emotional-arc-section,
    .timing-curve-section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .emotional-arc-section h2,
    .timing-curve-section h2 {
      color: var(--accent-gold);
      margin-bottom: 1rem;
    }

    .chart-container {
      position: relative;
      height: 300px;
      margin-bottom: 1rem;
    }

    .arc-diff-notes,
    .timing-diff-notes {
      background: var(--bg-tertiary);
      padding: 1rem;
      border-radius: 8px;
    }

    .arc-diff-notes h4,
    .timing-diff-notes h4 {
      color: var(--accent-gold);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .divergence-list,
    .timing-diff-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .divergence-item,
    .timing-diff-item {
      font-size: 0.85rem;
      color: var(--text-secondary);
      padding: 0.25rem 0;
    }

    .divergence-item .age,
    .timing-diff-item .age {
      color: var(--text-primary);
      font-weight: 600;
      margin-right: 0.5rem;
    }

    /* Reverse Mapping Section */
    .reverse-mapping-section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .reverse-mapping-section h2 {
      color: var(--accent-gold);
      margin-bottom: 0.5rem;
    }

    .section-desc {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .reverse-panel {
      background: var(--bg-tertiary);
      border-radius: 8px;
      padding: 1.5rem;
      min-height: 200px;
    }

    .placeholder-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150px;
      color: var(--text-secondary);
    }

    .placeholder-message .icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .reverse-content {
      display: none;
    }

    .reverse-content.active {
      display: block;
    }

    .reverse-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--bg-primary);
    }

    .reverse-header h3 {
      color: var(--text-primary);
    }

    .reverse-header .source-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .source-badge.source-A { background: rgba(96, 165, 250, 0.2); color: var(--color-a); }
    .source-badge.source-B { background: rgba(244, 114, 182, 0.2); color: var(--color-b); }

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .rule-item {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 6px;
      border-left: 3px solid var(--accent-gold);
    }

    .rule-item .rule-name {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .rule-item .rule-meta {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .rule-item .rule-explanation {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .rule-item .persona-hook {
      font-style: italic;
      color: var(--accent-gold);
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .summary-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .beat-diff-container {
        grid-template-columns: 1fr;
      }

      .diff-indicators {
        display: none;
      }
    }
  `;
}

// ==================== JAVASCRIPT ====================

function getNarrativeDiffScript(): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      initEmotionalArcChart();
      initTimingCurveChart();
    });

    function initEmotionalArcChart() {
      const ctx = document.getElementById('emotionalArcOverlayChart');
      if (!ctx) return;

      const arcA = window.COCKPIT_A.emotionalArc;
      const arcB = window.COCKPIT_B.emotionalArc;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...new Set([...arcA.map(p => p.age), ...arcB.map(p => p.age)])].sort((a,b) => a - b),
          datasets: [
            {
              label: window.NAME_A,
              data: arcA.map(p => ({ x: p.age, y: p.intensity })),
              borderColor: '#60a5fa',
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: window.NAME_B,
              data: arcB.map(p => ({ x: p.age, y: p.intensity })),
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
            legend: {
              labels: { color: '#e0e0e0' }
            }
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

    function initTimingCurveChart() {
      const ctx = document.getElementById('timingCurveComparisonChart');
      if (!ctx) return;

      const curveA = window.COCKPIT_A.timingCurve;
      const curveB = window.COCKPIT_B.timingCurve;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [...new Set([...curveA.map(p => p.age), ...curveB.map(p => p.age)])].sort((a,b) => a - b),
          datasets: [
            {
              label: window.NAME_A + ' Luck',
              data: curveA.map(p => p.luckLevel),
              backgroundColor: 'rgba(96, 165, 250, 0.7)',
              borderRadius: 4
            },
            {
              label: window.NAME_B + ' Luck',
              data: curveB.map(p => p.luckLevel),
              backgroundColor: 'rgba(244, 114, 182, 0.7)',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#e0e0e0' }
            }
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

    function showRulesForBeat(beatId, source) {
      const panel = document.getElementById('reverseMappingPanel');
      const reverseMaps = source === 'A' ? window.REVERSE_MAPS_A : window.REVERSE_MAPS_B;
      const chartName = source === 'A' ? window.NAME_A : window.NAME_B;

      const beatMap = reverseMaps.find(m => m.beatId === beatId);
      if (!beatMap) {
        panel.innerHTML = '<div class="placeholder-message"><span>No rules found for this beat</span></div>';
        return;
      }

      let rulesHtml = '';
      if (beatMap.relatedRules.length === 0) {
        rulesHtml = '<p style="color: var(--text-secondary);">No specific rules mapped to this beat.</p>';
      } else {
        rulesHtml = '<div class="rules-list">' + beatMap.relatedRules.map(rule => \`
          <div class="rule-item">
            <div class="rule-name">\${rule.ruleName}</div>
            <div class="rule-meta">
              <span class="category">\${rule.category}</span> •
              <span class="severity">\${rule.severity}</span> •
              <span class="effect">\${rule.effect}</span>
            </div>
            <p class="rule-explanation">\${rule.explanation}</p>
            \${rule.personaHook ? '<p class="persona-hook">"' + rule.personaHook + '"</p>' : ''}
          </div>
        \`).join('') + '</div>';
      }

      panel.innerHTML = \`
        <div class="reverse-content active">
          <div class="reverse-header">
            <h3>\${beatMap.beatLabel}</h3>
            <span class="source-badge source-\${source}">\${chartName}</span>
          </div>
          <div class="beat-info">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">\${beatMap.description}</p>
            <p style="color: var(--accent-gold); margin-bottom: 1rem;">Total Rule Impact: \${beatMap.totalRuleImpact}</p>
          </div>
          \${rulesHtml}
        </div>
      \`;
    }
  `;
}

// ==================== EXPORT ====================

export {
  renderNarrativeDiffHtml,
  renderNarrativeDiffComponent,
  renderDiffSummarySection,
  renderStoryBeatDiffSection,
  renderEmotionalArcOverlaySection,
  renderTimingCurveComparisonSection,
  renderReverseMappingPanel,
  getNarrativeDiffStyles,
  getNarrativeDiffScript
};
