/**
 * ============================================
 * GROUP NARRATIVE FUSION UI TEMPLATE
 * Multi-chart collective narrative visualization
 *
 * Displays fused narrative for teams, families,
 * polycules, lineages - the "choir" view.
 * ============================================
 */

import {
  GroupNarrative,
  GroupStoryBeat,
  GroupEmotionalPoint,
  GroupTimingPoint,
  GroupOverlay,
  GroupChapter,
  GroupNarrativeSummary,
  MemberNarrative
} from '../narrativeFusion';

// ==================== MAIN RENDER FUNCTIONS ====================

/**
 * Render full group narrative page
 */
export function renderGroupNarrativeHtml(group: GroupNarrative): string {
  const groupName = group.groupName || `Group ${group.groupId}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Group Narrative: ${groupName}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    ${getGroupNarrativeStyles()}
  </style>
</head>
<body>
  <div class="group-container">
    <header class="group-header">
      <h1>🎭 Group Narrative</h1>
      <h2>${groupName}</h2>
      <div class="member-avatars">
        ${group.members.map(m => `
          <span class="avatar" title="${m.name}">${m.name.charAt(0)}</span>
        `).join('')}
      </div>
    </header>

    ${renderGroupSummarySection(group.summary, group.members)}
    ${renderGroupStoryBeatsSection(group.storyBeats, group.members)}
    ${renderGroupEmotionalArcSection(group.emotionalArc, group.members)}
    ${renderGroupTimingSection(group.timingCurve, group.members)}
    ${renderGroupChaptersSection(group.chapters, group.members)}
    ${renderGroupOverlaysSection(group.overlays, group.members)}
  </div>

  <script>
    window.GROUP_NARRATIVE = ${JSON.stringify(group)};
    ${getGroupNarrativeScript()}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Render embeddable component
 */
export function renderGroupNarrativeComponent(group: GroupNarrative): string {
  return `
<div class="group-narrative-component">
  ${renderGroupSummarySection(group.summary, group.members)}
  ${renderGroupStoryBeatsSection(group.storyBeats, group.members)}
  ${renderGroupEmotionalArcSection(group.emotionalArc, group.members)}
  ${renderGroupTimingSection(group.timingCurve, group.members)}
</div>
  `.trim();
}

// ==================== SECTION RENDERERS ====================

function renderGroupSummarySection(
  summary: GroupNarrativeSummary,
  members: MemberNarrative[]
): string {
  return `
<section class="group-summary">
  <h2>✨ Collective Harmony</h2>
  <div class="summary-content">
    <div class="harmony-metrics">
      <div class="metric-card">
        <span class="metric-icon">💫</span>
        <span class="metric-value">${summary.avgEmotionalHarmony}%</span>
        <span class="metric-label">Emotional Harmony</span>
      </div>
      <div class="metric-card">
        <span class="metric-icon">⏱</span>
        <span class="metric-value">${summary.avgTimingSynchronicity}%</span>
        <span class="metric-label">Timing Sync</span>
      </div>
      <div class="metric-card">
        <span class="metric-icon">📖</span>
        <span class="metric-value">${summary.sharedBeatsCount}</span>
        <span class="metric-label">Shared Beats</span>
      </div>
      <div class="metric-card">
        <span class="metric-icon">👥</span>
        <span class="metric-value">${summary.totalMembers}</span>
        <span class="metric-label">Members</span>
      </div>
    </div>

    <div class="narrative-insight">
      <p>${summary.narrativeInsight}</p>
      <div class="theme-tag">
        <span>Dominant Theme:</span>
        <span class="tag">${formatTheme(summary.dominantGroupTheme)}</span>
      </div>
    </div>
  </div>
</section>
  `;
}

function renderGroupStoryBeatsSection(
  beats: GroupStoryBeat[],
  members: MemberNarrative[]
): string {
  return `
<section class="group-story-beats">
  <h2>📖 Collective Story Beats</h2>
  <div class="beats-timeline">
    ${beats.map(beat => `
      <div class="group-beat-card ${beat.valence}">
        <div class="beat-header">
          <span class="beat-label">${beat.label}</span>
          <span class="beat-consensus">${beat.consensus}% consensus</span>
        </div>
        <div class="beat-meta">
          <span class="age-range">Age ${beat.startAge}-${beat.endAge}</span>
          <span class="intensity">Intensity: ${beat.intensity}</span>
        </div>
        <p class="beat-desc">${beat.description}</p>
        <div class="beat-members">
          ${beat.memberNames?.map(name => `
            <span class="member-tag">${name}</span>
          `).join('') || ''}
        </div>
        ${beat.dominantThemes.length > 0 ? `
          <div class="beat-themes">
            ${beat.dominantThemes.slice(0, 3).map(t => `
              <span class="theme-chip">${t}</span>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
</section>
  `;
}

function renderGroupEmotionalArcSection(
  arc: GroupEmotionalPoint[],
  members: MemberNarrative[]
): string {
  return `
<section class="group-emotional-arc">
  <h2>💫 Collective Emotional Arc</h2>
  <div class="chart-container">
    <canvas id="groupEmotionalChart"></canvas>
  </div>
  <div class="arc-insights">
    <h4>Harmony Distribution</h4>
    <div class="harmony-distribution">
      ${getHarmonyDistribution(arc)}
    </div>
  </div>
</section>
  `;
}

function getHarmonyDistribution(arc: GroupEmotionalPoint[]): string {
  const high = arc.filter(p => p.harmony >= 70).length;
  const medium = arc.filter(p => p.harmony >= 40 && p.harmony < 70).length;
  const low = arc.filter(p => p.harmony < 40).length;
  const total = arc.length || 1;

  return `
    <div class="dist-bar">
      <div class="segment high" style="width: ${(high / total) * 100}%"></div>
      <div class="segment medium" style="width: ${(medium / total) * 100}%"></div>
      <div class="segment low" style="width: ${(low / total) * 100}%"></div>
    </div>
    <div class="dist-labels">
      <span class="high">${Math.round((high / total) * 100)}% High</span>
      <span class="medium">${Math.round((medium / total) * 100)}% Medium</span>
      <span class="low">${Math.round((low / total) * 100)}% Low</span>
    </div>
  `;
}

function renderGroupTimingSection(
  curve: GroupTimingPoint[],
  members: MemberNarrative[]
): string {
  const risingCount = curve.filter(p => p.collectiveMomentum === 'rising').length;
  const fallingCount = curve.filter(p => p.collectiveMomentum === 'falling').length;
  const stableCount = curve.filter(p => p.collectiveMomentum === 'stable').length;

  return `
<section class="group-timing">
  <h2>⏱ Collective Timing & Luck</h2>
  <div class="momentum-stats">
    <div class="momentum rising">
      <span class="icon">📈</span>
      <span class="count">${risingCount}</span>
      <span class="label">Rising</span>
    </div>
    <div class="momentum stable">
      <span class="icon">➡️</span>
      <span class="count">${stableCount}</span>
      <span class="label">Stable</span>
    </div>
    <div class="momentum falling">
      <span class="icon">📉</span>
      <span class="count">${fallingCount}</span>
      <span class="label">Falling</span>
    </div>
  </div>
  <div class="chart-container">
    <canvas id="groupTimingChart"></canvas>
  </div>
</section>
  `;
}

function renderGroupChaptersSection(
  chapters: GroupChapter[],
  members: MemberNarrative[]
): string {
  return `
<section class="group-chapters">
  <h2>📚 Life Chapters</h2>
  <div class="chapters-grid">
    ${chapters.map(chapter => {
      const activeCount = chapter.memberParticipation.filter(p => p.active).length;
      const totalCount = chapter.memberParticipation.length;
      const participation = Math.round((activeCount / totalCount) * 100);

      return `
        <div class="chapter-card ${chapter.overallTone}">
          <div class="chapter-header">
            <span class="chapter-name">${chapter.name}</span>
            <span class="chapter-zh">${chapter.nameZh || ''}</span>
          </div>
          <div class="chapter-range">Age ${chapter.ageRange.start}-${chapter.ageRange.end}</div>
          <div class="chapter-participation">
            <div class="participation-bar">
              <div class="fill" style="width: ${participation}%"></div>
            </div>
            <span class="participation-label">${activeCount}/${totalCount} active</span>
          </div>
          <p class="chapter-summary">${chapter.narrativeSummary}</p>
          <div class="chapter-tone">
            <span class="tone-indicator ${chapter.overallTone}"></span>
            <span>${chapter.overallTone}</span>
          </div>
        </div>
      `;
    }).join('')}
  </div>
</section>
  `;
}

function renderGroupOverlaysSection(
  overlays: GroupOverlay[],
  members: MemberNarrative[]
): string {
  return `
<section class="group-overlays">
  <h2>🌍 Shared Environmental Influences</h2>
  <div class="overlays-list">
    ${overlays.map(overlay => `
      <div class="overlay-card">
        <div class="overlay-header">
          <span class="overlay-label">${overlay.label}</span>
          <span class="overlay-coverage">${overlay.coverage}% coverage</span>
        </div>
        <div class="overlay-meta">
          <span class="type-badge">${overlay.type}</span>
          <span class="age-range">Age ${overlay.startAge}-${overlay.endAge}</span>
        </div>
        <div class="overlay-members">
          ${overlay.memberNames?.map(name => `
            <span class="member-chip">${name}</span>
          `).join('') || ''}
        </div>
        ${overlay.notes ? `<p class="overlay-notes">${overlay.notes}</p>` : ''}
      </div>
    `).join('')}
  </div>
</section>
  `;
}

// ==================== HELPERS ====================

function formatTheme(theme: string): string {
  return theme.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ==================== STYLES ====================

function getGroupNarrativeStyles(): string {
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
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }

    .group-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .group-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .group-header h1 {
      color: var(--gold);
      font-size: 2rem;
      margin-bottom: 0.25rem;
    }

    .group-header h2 {
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: normal;
      margin-bottom: 1rem;
    }

    .member-avatars {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: var(--accent-purple);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1rem;
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
    .summary-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .harmony-metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .metric-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }

    .metric-icon {
      display: block;
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }

    .metric-value {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--gold);
    }

    .metric-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .narrative-insight {
      background: var(--bg-card);
      padding: 1rem;
      border-radius: 8px;
    }

    .narrative-insight p {
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .theme-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .theme-tag .tag {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
    }

    /* Story Beats */
    .beats-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .group-beat-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 1rem;
      border-left: 4px solid var(--gold);
    }

    .group-beat-card.positive { border-left-color: var(--positive); }
    .group-beat-card.negative { border-left-color: var(--negative); }
    .group-beat-card.mixed { border-left-color: var(--mixed); }

    .beat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .beat-label { font-weight: 600; }

    .beat-consensus {
      background: rgba(74, 222, 128, 0.2);
      color: var(--positive);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .beat-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .beat-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .beat-members, .beat-themes {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .member-tag {
      background: var(--accent-purple);
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .theme-chip {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }

    /* Charts */
    .chart-container {
      position: relative;
      height: 280px;
      margin-bottom: 1rem;
    }

    /* Harmony Distribution */
    .arc-insights h4 {
      color: var(--gold);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .dist-bar {
      display: flex;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .segment {
      transition: width 0.3s;
    }

    .segment.high { background: var(--positive); }
    .segment.medium { background: var(--mixed); }
    .segment.low { background: var(--negative); }

    .dist-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }

    .dist-labels .high { color: var(--positive); }
    .dist-labels .medium { color: var(--mixed); }
    .dist-labels .low { color: var(--negative); }

    /* Momentum */
    .momentum-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .momentum {
      text-align: center;
      padding: 0.75rem 1.5rem;
      background: var(--bg-card);
      border-radius: 8px;
    }

    .momentum .icon {
      display: block;
      font-size: 1.25rem;
    }

    .momentum .count {
      display: block;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .momentum .label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .momentum.rising .count { color: var(--positive); }
    .momentum.falling .count { color: var(--negative); }
    .momentum.stable .count { color: var(--mixed); }

    /* Chapters */
    .chapters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .chapter-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 1rem;
      border-top: 3px solid var(--gold);
    }

    .chapter-card.positive { border-top-color: var(--positive); }
    .chapter-card.negative { border-top-color: var(--negative); }
    .chapter-card.mixed { border-top-color: var(--mixed); }

    .chapter-header {
      margin-bottom: 0.25rem;
    }

    .chapter-name {
      font-weight: 600;
      display: block;
    }

    .chapter-zh {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .chapter-range {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .chapter-participation {
      margin-bottom: 0.5rem;
    }

    .participation-bar {
      height: 6px;
      background: var(--bg-primary);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .participation-bar .fill {
      height: 100%;
      background: var(--accent-purple);
    }

    .participation-label {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .chapter-summary {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .chapter-tone {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      text-transform: capitalize;
    }

    .tone-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .tone-indicator.positive { background: var(--positive); }
    .tone-indicator.negative { background: var(--negative); }
    .tone-indicator.mixed { background: var(--mixed); }

    /* Overlays */
    .overlays-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .overlay-card {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 1rem;
    }

    .overlay-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .overlay-label { font-weight: 600; }

    .overlay-coverage {
      font-size: 0.75rem;
      color: var(--positive);
    }

    .overlay-meta {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .type-badge {
      background: rgba(167, 139, 250, 0.2);
      color: var(--accent-purple);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      text-transform: uppercase;
    }

    .age-range {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .overlay-members {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .member-chip {
      background: var(--bg-primary);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .overlay-notes {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-style: italic;
    }

    @media (max-width: 768px) {
      .summary-content { grid-template-columns: 1fr; }
      .harmony-metrics { grid-template-columns: repeat(2, 1fr); }
    }
  `;
}

// ==================== SCRIPT ====================

function getGroupNarrativeScript(): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      initGroupEmotionalChart();
      initGroupTimingChart();
    });

    function initGroupEmotionalChart() {
      const ctx = document.getElementById('groupEmotionalChart');
      if (!ctx) return;

      const G = window.GROUP_NARRATIVE;
      const ages = G.emotionalArc.map(p => p.age);
      const avgValues = G.emotionalArc.map(p => p.avgValue);
      const spreads = G.emotionalArc.map(p => p.spread);

      // Individual member lines
      const memberDatasets = G.members.slice(0, 5).map((member, idx) => {
        const colors = ['#60a5fa', '#f472b6', '#4ade80', '#fbbf24', '#a78bfa'];
        return {
          label: member.name,
          data: G.emotionalArc.map(p => {
            const mv = p.memberValues.find(v => v.personId === member.personId);
            return mv ? mv.value : null;
          }),
          borderColor: colors[idx],
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 2,
          tension: 0.4
        };
      });

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ages,
          datasets: [
            {
              label: 'Group Average',
              data: avgValues,
              borderColor: '#d4af37',
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              fill: true,
              borderWidth: 3,
              tension: 0.4
            },
            ...memberDatasets
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#e0e0e0', font: { size: 10 } }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Age', color: '#a0a0b0' },
              ticks: { color: '#a0a0b0' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: {
              title: { display: true, text: 'Emotional Value', color: '#a0a0b0' },
              ticks: { color: '#a0a0b0' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              min: -100,
              max: 100
            }
          }
        }
      });
    }

    function initGroupTimingChart() {
      const ctx = document.getElementById('groupTimingChart');
      if (!ctx) return;

      const G = window.GROUP_NARRATIVE;
      const ages = G.timingCurve.map(p => p.age);
      const avgLuck = G.timingCurve.map(p => p.avgLuck);
      const synchronicity = G.timingCurve.map(p => p.synchronicity);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ages,
          datasets: [
            {
              label: 'Average Luck',
              data: avgLuck,
              backgroundColor: avgLuck.map(v =>
                v >= 60 ? 'rgba(74, 222, 128, 0.7)' :
                v >= 40 ? 'rgba(251, 191, 36, 0.7)' :
                'rgba(248, 113, 113, 0.7)'
              ),
              borderRadius: 4,
              yAxisID: 'y'
            },
            {
              label: 'Synchronicity',
              data: synchronicity,
              type: 'line',
              borderColor: '#a78bfa',
              backgroundColor: 'transparent',
              tension: 0.4,
              yAxisID: 'y1'
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
              max: 100,
              position: 'left'
            },
            y1: {
              title: { display: true, text: 'Synchronicity %', color: '#a78bfa' },
              ticks: { color: '#a78bfa' },
              grid: { display: false },
              min: 0,
              max: 100,
              position: 'right'
            }
          }
        }
      });
    }
  `;
}

// ==================== EXPORTS ====================

export {
  renderGroupNarrativeHtml,
  renderGroupNarrativeComponent,
  getGroupNarrativeStyles,
  getGroupNarrativeScript
};
