/**
 * ============================================
 * CATHEDRAL HTML TEMPLATES
 * Complete UI skeleton for the Cathedral system
 * Codex → Persona → Journey → Analysis flow
 * ============================================
 */

import { CodexEntry, KnowledgeCodex, PilgrimJourney, JourneyStep, JOURNEY_CHAMBERS } from '../codexTypes';
import { formatCategory, formatSeverity, formatEffect, getSeverityIcon } from './codexMarkdownTemplate';

/**
 * Generate complete Cathedral HTML page
 */
export function generateCathedralHtml(
  codex: KnowledgeCodex,
  journey: PilgrimJourney,
  chartData?: Record<string, unknown>
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cathedral BaZi System — ${codex.chartId || 'Analysis'}</title>
  <style>
${getCathedralStyles()}
  </style>
</head>

<body>
  <header class="cathedral-header">
    <h1>命理殿堂 · Cathedral of Destiny</h1>
    <p class="subtitle">BaZi Knowledge System</p>
  </header>

  <nav class="cathedral-nav">
    <a href="#analysis" class="nav-link active" data-panel="analysis">
      <span class="nav-icon">📊</span> Analysis
    </a>
    <a href="#codex" class="nav-link" data-panel="codex">
      <span class="nav-icon">📜</span> Knowledge Codex
    </a>
    <a href="#persona" class="nav-link" data-panel="persona">
      <span class="nav-icon">🗣️</span> Persona Layer
    </a>
    <a href="#journey" class="nav-link" data-panel="journey">
      <span class="nav-icon">🚶</span> Pilgrim Journey
    </a>
  </nav>

  <main class="cathedral-main">
    <!-- Left Panel: Analysis -->
    <section class="panel panel-analysis" id="analysis">
      <div class="panel-header">
        <h2>BaZi Analysis</h2>
        <span class="panel-badge">${codex.summary.totalFindings} findings</span>
      </div>
      <div class="panel-content">
        ${generateAnalysisSummaryHtml(codex)}
      </div>
    </section>

    <!-- Center Panel: Knowledge Codex -->
    <section class="panel panel-codex" id="codex">
      <div class="panel-header">
        <h2>Knowledge Codex</h2>
        <span class="panel-badge">命理知识宝典</span>
      </div>
      <div class="panel-content">
        ${generateCodexEntriesHtml(codex)}
      </div>
    </section>

    <!-- Right Panel: Persona + Journey -->
    <section class="panel panel-narrative" id="narrative">
      <div class="panel-header">
        <h2>Cathedral Voice</h2>
      </div>

      <div class="narrative-section" id="persona">
        <h3>Persona Layer</h3>
        <div class="opening-narrative">
          ${codex.openingNarrative}
        </div>
        ${generatePersonaHooksHtml(codex)}
      </div>

      <div class="narrative-section" id="journey">
        <h3>Pilgrim Journey</h3>
        <div class="journey-map">
          ${generateJourneyMapHtml(journey)}
        </div>
        <div class="journey-steps">
          ${generateJourneyStepsHtml(journey)}
        </div>
      </div>

      <div class="closing-narrative">
        ${codex.closingNarrative}
      </div>
    </section>
  </main>

  <footer class="cathedral-footer">
    <p>Generated: ${new Date().toISOString()}</p>
    ${codex.chartId ? `<p>Chart ID: ${codex.chartId}</p>` : ''}
  </footer>

  <script>
${getCathedralScript()}
  </script>
</body>
</html>`;
}

/**
 * Generate Analysis Summary HTML
 */
function generateAnalysisSummaryHtml(codex: KnowledgeCodex): string {
  const categoryItems = Object.entries(codex.summary.byCategory)
    .filter(([_, count]) => count > 0)
    .map(([cat, count]) => `
      <div class="category-item">
        <span class="category-name">${formatCategory(cat)}</span>
        <span class="category-count">${count}</span>
      </div>
    `).join('');

  const severityItems = Object.entries(codex.summary.bySeverity)
    .filter(([_, count]) => count > 0)
    .map(([sev, count]) => `
      <div class="severity-item ${sev}">
        <span class="severity-icon">${getSeverityIcon(sev)}</span>
        <span class="severity-name">${sev}</span>
        <span class="severity-count">${count}</span>
      </div>
    `).join('');

  return `
    <div class="summary-card">
      <div class="summary-stat">
        <span class="stat-value">${codex.summary.totalFindings}</span>
        <span class="stat-label">Total Findings</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value tone-${codex.summary.overallTone}">${codex.summary.overallTone}</span>
        <span class="stat-label">Overall Tone</span>
      </div>
    </div>

    <div class="category-breakdown">
      <h4>By Category</h4>
      ${categoryItems}
    </div>

    <div class="severity-breakdown">
      <h4>By Severity</h4>
      ${severityItems}
    </div>
  `;
}

/**
 * Generate Codex Entries HTML
 */
function generateCodexEntriesHtml(codex: KnowledgeCodex): string {
  const entriesByCategory = groupByCategory(codex.entries);
  const categories = ['structure', 'seasonal', 'useful_god', 'combination', 'clash', 'harm', 'punishment', 'hidden_stem', 'luck_pillar', 'shen_sha'];

  let html = '';

  for (const category of categories) {
    const entries = entriesByCategory[category];
    if (!entries || entries.length === 0) continue;

    html += `
      <div class="codex-category" data-category="${category}">
        <h3 class="category-header">${formatCategory(category)}</h3>
        <div class="category-entries">
          ${entries.map(entry => generateCodexEntryHtml(entry)).join('')}
        </div>
      </div>
    `;
  }

  return html;
}

/**
 * Generate single Codex Entry HTML
 */
function generateCodexEntryHtml(entry: CodexEntry): string {
  const recommendations = entry.explanation.recommendations?.map(r => `<li>${r}</li>`).join('') || '';
  const warnings = entry.explanation.warnings?.map(w => `<li class="warning">${w}</li>`).join('') || '';

  return `
    <div class="codex-entry" data-rule-id="${entry.rule.id}" data-severity="${entry.severity}" data-effect="${entry.effect}">
      <div class="entry-header">
        <span class="entry-icon">${entry.iconHint || '◆'}</span>
        <h4 class="entry-title">${entry.explanation.title}</h4>
        <span class="entry-severity ${entry.severity}">${getSeverityIcon(entry.severity)}</span>
      </div>

      <div class="entry-summary">
        ${entry.explanation.summary}
      </div>

      <details class="entry-details">
        <summary>Technical Detail</summary>
        <div class="technical-detail">
          <pre>${entry.explanation.technicalDetail}</pre>
        </div>
      </details>

      <details class="entry-details">
        <summary>Interpretation</summary>
        <div class="interpretation">
          ${entry.explanation.interpretation}
        </div>
      </details>

      ${recommendations ? `
        <div class="recommendations">
          <h5>Recommendations</h5>
          <ul>${recommendations}</ul>
        </div>
      ` : ''}

      ${warnings ? `
        <div class="warnings">
          <h5>⚠️ Warnings</h5>
          <ul>${warnings}</ul>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Generate Persona Hooks HTML
 */
function generatePersonaHooksHtml(codex: KnowledgeCodex): string {
  const topEntries = [...codex.entries]
    .sort((a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity))
    .slice(0, 7);

  return topEntries.map(entry => `
    <div class="persona-hook" data-rule-id="${entry.rule.id}">
      <span class="hook-icon">${entry.iconHint || '◆'}</span>
      <blockquote class="hook-text">
        ${entry.personaHook}
      </blockquote>
      <span class="hook-source">${entry.explanation.title}</span>
    </div>
  `).join('');
}

/**
 * Generate Journey Map HTML
 */
function generateJourneyMapHtml(journey: PilgrimJourney): string {
  return JOURNEY_CHAMBERS.map(chamber => {
    const chamberSteps = journey.steps.filter(s => s.chamber.id === chamber.id);
    const isActive = chamberSteps.length > 0;

    return `
      <div class="chamber-marker ${isActive ? 'active' : 'inactive'}" data-chamber="${chamber.id}">
        <span class="chamber-icon">${chamber.iconHint}</span>
        <span class="chamber-name">${chamber.name}</span>
        <span class="chamber-count">${chamberSteps.length}</span>
      </div>
    `;
  }).join('');
}

/**
 * Generate Journey Steps HTML
 */
function generateJourneyStepsHtml(journey: PilgrimJourney): string {
  let currentChamberId: string | null = null;
  let html = '';

  for (const step of journey.steps) {
    if (currentChamberId !== step.chamber.id) {
      if (currentChamberId) html += '</div>'; // Close previous chamber
      currentChamberId = step.chamber.id;
      html += `
        <div class="chamber-section" data-chamber="${step.chamber.id}">
          <h4 class="chamber-header">
            <span class="chamber-icon">${step.chamber.iconHint}</span>
            ${step.chamber.name}
            <span class="chamber-chinese">${step.chamber.chineseName}</span>
          </h4>
      `;
    }

    html += `
      <div class="journey-step" data-step="${step.order}">
        <div class="step-number">Step ${step.order}</div>
        <div class="step-title">${step.title}</div>
        <div class="step-narrative">${step.narrative}</div>
        ${step.narrativeChinese ? `<div class="step-chinese">「${step.narrativeChinese}」</div>` : ''}
      </div>
    `;
  }

  if (currentChamberId) html += '</div>'; // Close last chamber

  return html;
}

/**
 * Get Cathedral CSS styles
 */
function getCathedralStyles(): string {
  return `
    :root {
      --cathedral-bg: #f7f5f2;
      --cathedral-dark: #2b2b2b;
      --cathedral-gold: #c9a227;
      --cathedral-cream: #eae7e2;
      --panel-bg: #ffffff;
      --text-primary: #333333;
      --text-secondary: #666666;
      --border-light: #e0dcd6;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', serif;
      background: var(--cathedral-bg);
      color: var(--text-primary);
      line-height: 1.6;
    }

    .cathedral-header {
      background: var(--cathedral-dark);
      color: white;
      padding: 20px 30px;
      text-align: center;
    }

    .cathedral-header h1 {
      font-size: 28px;
      margin-bottom: 5px;
    }

    .cathedral-header .subtitle {
      color: var(--cathedral-gold);
      font-size: 14px;
    }

    .cathedral-nav {
      background: var(--cathedral-cream);
      padding: 15px 20px;
      display: flex;
      justify-content: center;
      gap: 30px;
      border-bottom: 1px solid var(--border-light);
    }

    .nav-link {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .nav-link:hover, .nav-link.active {
      background: var(--cathedral-dark);
      color: white;
    }

    .cathedral-main {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr;
      gap: 20px;
      padding: 20px;
      max-width: 1800px;
      margin: 0 auto;
    }

    .panel {
      background: var(--panel-bg);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .panel-header {
      background: var(--cathedral-dark);
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h2 {
      font-size: 18px;
    }

    .panel-badge {
      background: var(--cathedral-gold);
      color: var(--cathedral-dark);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
    }

    .panel-content {
      padding: 20px;
      max-height: calc(100vh - 250px);
      overflow-y: auto;
    }

    /* Summary Card */
    .summary-card {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .summary-stat {
      flex: 1;
      text-align: center;
      padding: 15px;
      background: var(--cathedral-cream);
      border-radius: 8px;
    }

    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: bold;
      color: var(--cathedral-dark);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .tone-beneficial { color: #2e7d32; }
    .tone-challenging { color: #c62828; }
    .tone-mixed { color: #f57c00; }
    .tone-neutral { color: #546e7a; }

    /* Category Breakdown */
    .category-breakdown, .severity-breakdown {
      margin-bottom: 20px;
    }

    .category-breakdown h4, .severity-breakdown h4 {
      font-size: 14px;
      margin-bottom: 10px;
      color: var(--text-secondary);
    }

    .category-item, .severity-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: var(--cathedral-cream);
      margin-bottom: 5px;
      border-radius: 4px;
    }

    /* Codex Entries */
    .codex-category {
      margin-bottom: 30px;
    }

    .category-header {
      font-size: 16px;
      padding: 10px 0;
      border-bottom: 2px solid var(--cathedral-gold);
      margin-bottom: 15px;
    }

    .codex-entry {
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .entry-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .entry-icon {
      font-size: 20px;
    }

    .entry-title {
      flex: 1;
      font-size: 16px;
    }

    .entry-summary {
      color: var(--text-secondary);
      margin-bottom: 10px;
    }

    .entry-details {
      margin-bottom: 10px;
    }

    .entry-details summary {
      cursor: pointer;
      color: var(--cathedral-gold);
      font-weight: 600;
    }

    .technical-detail pre {
      white-space: pre-wrap;
      font-size: 12px;
      background: var(--cathedral-cream);
      padding: 10px;
      border-radius: 4px;
    }

    .recommendations ul, .warnings ul {
      padding-left: 20px;
    }

    .warnings {
      background: #fff3cd;
      padding: 10px;
      border-radius: 4px;
    }

    /* Persona Hooks */
    .persona-hook {
      padding: 15px;
      border-left: 3px solid var(--cathedral-gold);
      margin-bottom: 15px;
      background: var(--cathedral-cream);
    }

    .hook-text {
      font-style: italic;
      margin: 10px 0;
    }

    .hook-source {
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Journey Map */
    .journey-map {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }

    .chamber-marker {
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .chamber-marker.active {
      background: var(--cathedral-gold);
      color: var(--cathedral-dark);
    }

    .chamber-marker.inactive {
      background: var(--border-light);
      color: var(--text-secondary);
    }

    /* Journey Steps */
    .chamber-section {
      margin-bottom: 25px;
    }

    .chamber-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: var(--cathedral-dark);
      color: white;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .journey-step {
      padding: 15px;
      border: 1px solid var(--border-light);
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .step-number {
      font-size: 12px;
      color: var(--cathedral-gold);
      font-weight: bold;
    }

    .step-title {
      font-weight: 600;
      margin: 5px 0;
    }

    .step-chinese {
      font-style: italic;
      color: var(--text-secondary);
      margin-top: 10px;
    }

    /* Footer */
    .cathedral-footer {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary);
      font-size: 12px;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .cathedral-main {
        grid-template-columns: 1fr;
      }
    }
  `;
}

/**
 * Get Cathedral JavaScript
 */
function getCathedralScript(): string {
  return `
    // Navigation handling
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Expand/collapse all details
    function toggleAllDetails(expand) {
      document.querySelectorAll('details').forEach(d => d.open = expand);
    }
  `;
}

// Helper functions
function groupByCategory(entries: CodexEntry[]): Record<string, CodexEntry[]> {
  const result: Record<string, CodexEntry[]> = {};
  for (const entry of entries) {
    const cat = entry.rule.category;
    if (!result[cat]) result[cat] = [];
    result[cat].push(entry);
  }
  return result;
}

function getSeverityWeight(severity: string): number {
  const weights: Record<string, number> = {
    'major': 5,
    'significant': 4,
    'moderate': 3,
    'minor': 2,
    'info': 1
  };
  return weights[severity] || 0;
}

export { generateAnalysisSummaryHtml, generateCodexEntriesHtml, generatePersonaHooksHtml };
