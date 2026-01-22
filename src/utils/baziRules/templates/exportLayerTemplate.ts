/**
 * ============================================
 * EXPORT LAYER TEMPLATES
 * HTML → PDF → Markdown export system for
 * reports, Codex pages, and journeys
 * ============================================
 */

import { KnowledgeCodex, CodexEntry, PilgrimJourney, JourneyStep } from '../codexTypes';
import { renderFullCodexMarkdown } from './codexMarkdownTemplate';
import { renderFullPersonaDocument } from './personaNarrativeTemplate';
import { renderFullJourneyMarkdown } from './journeyMarkdownTemplate';

// ==================== TYPES ====================

export interface ExportMetadata {
  chartId: string;
  generatedAt: Date;
  generatorVersion: string;
  exportFormat: 'html' | 'markdown' | 'pdf-ready';
  includesSections: string[];
}

export interface CathedralReportData {
  metadata: ExportMetadata;
  coreAnalysis: CoreAnalysisSection;
  knowledgeCodex: KnowledgeCodex;
  personaNarrative: string;
  pilgrimJourney: PilgrimJourney;
  appendices?: AppendixSection[];
}

export interface CoreAnalysisSection {
  chartSummary: string;
  elementDistribution: Record<string, number>;
  structureType: string;
  usefulGodStatus: string;
  interactionIntensity: string;
  keyFindings: string[];
  warnings: string[];
}

export interface AppendixSection {
  id: string;
  title: string;
  content: string;
}

export interface ExportOptions {
  includeCodex: boolean;
  includePersona: boolean;
  includeJourney: boolean;
  includeAppendices: boolean;
  includeTOC: boolean;
  includeMetadata: boolean;
  theme: 'light' | 'dark' | 'ceremonial';
  paperSize: 'a4' | 'letter' | 'legal';
  fontSize: 'small' | 'medium' | 'large';
}

// ==================== MARKDOWN EXPORT ====================

/**
 * Generate complete Cathedral report in Markdown format
 */
export function generateCathedralReportMarkdown(
  data: CathedralReportData,
  options: Partial<ExportOptions> = {}
): string {
  const opts: ExportOptions = {
    includeCodex: true,
    includePersona: true,
    includeJourney: true,
    includeAppendices: true,
    includeTOC: true,
    includeMetadata: true,
    theme: 'ceremonial',
    paperSize: 'a4',
    fontSize: 'medium',
    ...options
  };

  const lines: string[] = [];
  const { metadata, coreAnalysis, knowledgeCodex, personaNarrative, pilgrimJourney, appendices } = data;

  // Title
  lines.push('# 🕍 Cathedral BaZi Report');
  lines.push('');

  if (opts.includeMetadata) {
    lines.push(`*Generated on ${metadata.generatedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}*`);
    lines.push(`*Chart ID: ${metadata.chartId}*`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // Table of Contents
  if (opts.includeTOC) {
    lines.push('## Table of Contents');
    lines.push('');
    lines.push('1. [Core Analysis](#i-core-analysis)');
    if (opts.includeCodex) lines.push('2. [Knowledge Codex](#ii-knowledge-codex)');
    if (opts.includePersona) lines.push('3. [Persona Layer Narrative](#iii-persona-layer-narrative)');
    if (opts.includeJourney) lines.push('4. [Pilgrim Journey](#iv-pilgrim-journey)');
    if (opts.includeAppendices && appendices?.length) lines.push('5. [Appendices](#v-appendices)');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // I. Core Analysis
  lines.push('## I. Core Analysis');
  lines.push('');
  lines.push('### Chart Summary');
  lines.push(coreAnalysis.chartSummary);
  lines.push('');

  lines.push('### Element Distribution');
  lines.push('');
  lines.push('| Element | Percentage |');
  lines.push('|---------|------------|');
  for (const [element, pct] of Object.entries(coreAnalysis.elementDistribution)) {
    const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
    lines.push(`| ${element} | ${bar} ${pct.toFixed(1)}% |`);
  }
  lines.push('');

  lines.push('### Structure & Useful God');
  lines.push('');
  lines.push(`- **Structure Type:** ${coreAnalysis.structureType}`);
  lines.push(`- **Useful God Status:** ${coreAnalysis.usefulGodStatus}`);
  lines.push(`- **Interaction Intensity:** ${coreAnalysis.interactionIntensity}`);
  lines.push('');

  if (coreAnalysis.keyFindings.length > 0) {
    lines.push('### Key Findings');
    lines.push('');
    coreAnalysis.keyFindings.forEach((finding, i) => {
      lines.push(`${i + 1}. ${finding}`);
    });
    lines.push('');
  }

  if (coreAnalysis.warnings.length > 0) {
    lines.push('### ⚠️ Warnings');
    lines.push('');
    coreAnalysis.warnings.forEach(warning => {
      lines.push(`- ${warning}`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // II. Knowledge Codex
  if (opts.includeCodex) {
    lines.push('## II. Knowledge Codex');
    lines.push('');
    lines.push(renderFullCodexMarkdown(knowledgeCodex));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // III. Persona Layer Narrative
  if (opts.includePersona) {
    lines.push('## III. Persona Layer Narrative');
    lines.push('');
    lines.push(personaNarrative || renderFullPersonaDocument(knowledgeCodex));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // IV. Pilgrim Journey
  if (opts.includeJourney) {
    lines.push('## IV. Pilgrim Journey');
    lines.push('');
    lines.push(renderFullJourneyMarkdown(pilgrimJourney));
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // V. Appendices
  if (opts.includeAppendices && appendices && appendices.length > 0) {
    lines.push('## V. Appendices');
    lines.push('');
    appendices.forEach((appendix, i) => {
      lines.push(`### Appendix ${String.fromCharCode(65 + i)}: ${appendix.title}`);
      lines.push('');
      lines.push(appendix.content);
      lines.push('');
    });
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Generated by Cathedral BaZi Analysis System*');
  lines.push(`*Version: ${metadata.generatorVersion}*`);

  return lines.join('\n');
}

// ==================== HTML EXPORT ====================

/**
 * Generate complete Cathedral report in HTML format (PDF-ready)
 */
export function generateCathedralReportHtml(
  data: CathedralReportData,
  options: Partial<ExportOptions> = {}
): string {
  const opts: ExportOptions = {
    includeCodex: true,
    includePersona: true,
    includeJourney: true,
    includeAppendices: true,
    includeTOC: true,
    includeMetadata: true,
    theme: 'ceremonial',
    paperSize: 'a4',
    fontSize: 'medium',
    ...options
  };

  const { metadata, coreAnalysis, knowledgeCodex, pilgrimJourney, appendices } = data;

  const fontSizeMap = {
    small: '10pt',
    medium: '12pt',
    large: '14pt'
  };

  const themeStyles = {
    light: {
      bg: '#ffffff',
      text: '#1a1a2e',
      accent: '#4a4a6a',
      border: '#e0e0e0',
      highlight: '#f5f5f5'
    },
    dark: {
      bg: '#1a1a2e',
      text: '#e8e6e3',
      accent: '#d4af37',
      border: '#3a3a4e',
      highlight: '#2a2a3e'
    },
    ceremonial: {
      bg: '#faf8f5',
      text: '#2c2416',
      accent: '#8b4513',
      border: '#d4c4a8',
      highlight: '#f0e8d8'
    }
  };

  const theme = themeStyles[opts.theme];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cathedral BaZi Report - ${metadata.chartId}</title>
  <style>
    @page {
      size: ${opts.paperSize};
      margin: 2cm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: ${fontSizeMap[opts.fontSize]};
      line-height: 1.6;
      color: ${theme.text};
      background: ${theme.bg};
      padding: 2rem;
    }

    .report-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .report-header {
      text-align: center;
      padding: 2rem 0;
      border-bottom: 3px double ${theme.border};
      margin-bottom: 2rem;
    }

    .report-title {
      font-size: 2.5em;
      font-weight: normal;
      color: ${theme.accent};
      margin-bottom: 0.5rem;
    }

    .report-subtitle {
      font-size: 1.2em;
      color: ${theme.text};
      opacity: 0.8;
    }

    .report-meta {
      font-size: 0.9em;
      color: ${theme.text};
      opacity: 0.6;
      margin-top: 1rem;
    }

    .toc {
      background: ${theme.highlight};
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .toc h2 {
      font-size: 1.3em;
      margin-bottom: 1rem;
      color: ${theme.accent};
    }

    .toc ul {
      list-style: none;
    }

    .toc li {
      padding: 0.3rem 0;
    }

    .toc a {
      color: ${theme.text};
      text-decoration: none;
      border-bottom: 1px dotted ${theme.border};
    }

    .toc a:hover {
      color: ${theme.accent};
    }

    .section {
      margin-bottom: 3rem;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 1.8em;
      color: ${theme.accent};
      border-bottom: 2px solid ${theme.border};
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .subsection-title {
      font-size: 1.3em;
      color: ${theme.text};
      margin: 1.5rem 0 1rem 0;
    }

    .element-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .element-table th,
    .element-table td {
      padding: 0.75rem;
      border: 1px solid ${theme.border};
      text-align: left;
    }

    .element-table th {
      background: ${theme.highlight};
      font-weight: bold;
    }

    .element-bar {
      display: inline-block;
      height: 1em;
      background: linear-gradient(90deg, ${theme.accent}, ${theme.accent}88);
      border-radius: 3px;
      margin-right: 0.5rem;
    }

    .key-findings {
      list-style: decimal;
      padding-left: 1.5rem;
    }

    .key-findings li {
      padding: 0.5rem 0;
    }

    .warnings {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 1rem;
      margin: 1rem 0;
    }

    .warnings-title {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .codex-entry {
      background: ${theme.highlight};
      border: 1px solid ${theme.border};
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
      page-break-inside: avoid;
    }

    .codex-entry-title {
      font-size: 1.2em;
      color: ${theme.accent};
      margin-bottom: 0.5rem;
    }

    .codex-entry-summary {
      font-style: italic;
      margin-bottom: 1rem;
    }

    .codex-entry-detail {
      margin-bottom: 1rem;
    }

    .persona-hook {
      font-style: italic;
      color: ${theme.accent};
      border-left: 3px solid ${theme.accent};
      padding-left: 1rem;
      margin: 1rem 0;
    }

    .journey-step {
      border-left: 3px solid ${theme.accent};
      padding-left: 1.5rem;
      margin: 1.5rem 0;
    }

    .journey-step-number {
      font-size: 0.9em;
      color: ${theme.accent};
      font-weight: bold;
    }

    .journey-step-title {
      font-size: 1.1em;
      margin: 0.5rem 0;
    }

    .appendix {
      border-top: 1px solid ${theme.border};
      padding-top: 1.5rem;
      margin-top: 1.5rem;
    }

    .report-footer {
      text-align: center;
      padding: 2rem 0;
      border-top: 3px double ${theme.border};
      margin-top: 3rem;
      font-size: 0.9em;
      color: ${theme.text};
      opacity: 0.6;
    }

    @media print {
      body {
        padding: 0;
      }
      .section {
        page-break-before: always;
      }
      .section:first-of-type {
        page-break-before: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Header -->
    <header class="report-header">
      <h1 class="report-title">🕍 Cathedral BaZi Report</h1>
      <p class="report-subtitle">Comprehensive Metaphysical Analysis</p>
      ${opts.includeMetadata ? `
        <p class="report-meta">
          Generated on ${metadata.generatedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}<br>
          Chart ID: ${metadata.chartId}
        </p>
      ` : ''}
    </header>

    ${opts.includeTOC ? `
      <!-- Table of Contents -->
      <nav class="toc">
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#core-analysis">I. Core Analysis</a></li>
          ${opts.includeCodex ? '<li><a href="#knowledge-codex">II. Knowledge Codex</a></li>' : ''}
          ${opts.includePersona ? '<li><a href="#persona-narrative">III. Persona Layer Narrative</a></li>' : ''}
          ${opts.includeJourney ? '<li><a href="#pilgrim-journey">IV. Pilgrim Journey</a></li>' : ''}
          ${opts.includeAppendices && appendices?.length ? '<li><a href="#appendices">V. Appendices</a></li>' : ''}
        </ul>
      </nav>
    ` : ''}

    <!-- I. Core Analysis -->
    <section class="section" id="core-analysis">
      <h2 class="section-title">I. Core Analysis</h2>

      <h3 class="subsection-title">Chart Summary</h3>
      <p>${coreAnalysis.chartSummary}</p>

      <h3 class="subsection-title">Element Distribution</h3>
      <table class="element-table">
        <thead>
          <tr>
            <th>Element</th>
            <th>Distribution</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(coreAnalysis.elementDistribution).map(([element, pct]) => `
            <tr>
              <td>${element}</td>
              <td>
                <span class="element-bar" style="width: ${pct * 2}px"></span>
                ${pct.toFixed(1)}%
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3 class="subsection-title">Structure & Useful God</h3>
      <ul>
        <li><strong>Structure Type:</strong> ${coreAnalysis.structureType}</li>
        <li><strong>Useful God Status:</strong> ${coreAnalysis.usefulGodStatus}</li>
        <li><strong>Interaction Intensity:</strong> ${coreAnalysis.interactionIntensity}</li>
      </ul>

      ${coreAnalysis.keyFindings.length > 0 ? `
        <h3 class="subsection-title">Key Findings</h3>
        <ol class="key-findings">
          ${coreAnalysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
        </ol>
      ` : ''}

      ${coreAnalysis.warnings.length > 0 ? `
        <div class="warnings">
          <p class="warnings-title">⚠️ Warnings</p>
          <ul>
            ${coreAnalysis.warnings.map(warning => `<li>${warning}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </section>

    ${opts.includeCodex ? `
      <!-- II. Knowledge Codex -->
      <section class="section" id="knowledge-codex">
        <h2 class="section-title">II. Knowledge Codex</h2>
        ${knowledgeCodex.entries.map(entry => `
          <article class="codex-entry">
            <h3 class="codex-entry-title">${entry.explanation.title}</h3>
            <p class="codex-entry-summary">${entry.explanation.summary}</p>
            <p class="codex-entry-detail">${entry.explanation.interpretation}</p>
            <blockquote class="persona-hook">"${entry.personaHook}"</blockquote>
          </article>
        `).join('')}
      </section>
    ` : ''}

    ${opts.includePersona ? `
      <!-- III. Persona Layer Narrative -->
      <section class="section" id="persona-narrative">
        <h2 class="section-title">III. Persona Layer Narrative</h2>
        ${knowledgeCodex.entries.map(entry => `
          <blockquote class="persona-hook">${entry.personaHook}</blockquote>
        `).join('')}
      </section>
    ` : ''}

    ${opts.includeJourney ? `
      <!-- IV. Pilgrim Journey -->
      <section class="section" id="pilgrim-journey">
        <h2 class="section-title">IV. Pilgrim Journey</h2>
        <p>${pilgrimJourney.introduction}</p>
        ${pilgrimJourney.steps.map((step, i) => `
          <article class="journey-step">
            <span class="journey-step-number">Step ${i + 1}</span>
            <h3 class="journey-step-title">${step.title}</h3>
            <p>${step.narrative}</p>
          </article>
        `).join('')}
        <p><strong>${pilgrimJourney.conclusion}</strong></p>
      </section>
    ` : ''}

    ${opts.includeAppendices && appendices && appendices.length > 0 ? `
      <!-- V. Appendices -->
      <section class="section" id="appendices">
        <h2 class="section-title">V. Appendices</h2>
        ${appendices.map((appendix, i) => `
          <article class="appendix">
            <h3 class="subsection-title">Appendix ${String.fromCharCode(65 + i)}: ${appendix.title}</h3>
            <p>${appendix.content}</p>
          </article>
        `).join('')}
      </section>
    ` : ''}

    <!-- Footer -->
    <footer class="report-footer">
      <p>Generated by Cathedral BaZi Analysis System</p>
      <p>Version: ${metadata.generatorVersion}</p>
    </footer>
  </div>
</body>
</html>`;
}

// ==================== SINGLE CODEX PAGE EXPORT ====================

/**
 * Export a single Codex page to HTML
 */
export function exportCodexPageHtml(entry: CodexEntry, theme: 'light' | 'dark' | 'ceremonial' = 'ceremonial'): string {
  const themeStyles = {
    light: { bg: '#ffffff', text: '#1a1a2e', accent: '#4a4a6a' },
    dark: { bg: '#1a1a2e', text: '#e8e6e3', accent: '#d4af37' },
    ceremonial: { bg: '#faf8f5', text: '#2c2416', accent: '#8b4513' }
  };

  const t = themeStyles[theme];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${entry.explanation.title}</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      background: ${t.bg};
      color: ${t.text};
      padding: 2rem;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.7;
    }
    h1 {
      color: ${t.accent};
      border-bottom: 2px solid ${t.accent};
      padding-bottom: 0.5rem;
    }
    .summary { font-style: italic; font-size: 1.1em; }
    .detail { margin: 1.5rem 0; }
    .interpretation { margin: 1.5rem 0; }
    .recommendations { background: ${t.bg}; padding: 1rem; border-left: 3px solid ${t.accent}; }
    .persona-hook {
      font-style: italic;
      color: ${t.accent};
      font-size: 1.2em;
      margin: 2rem 0;
      text-align: center;
    }
    .meta {
      display: flex;
      gap: 1rem;
      font-size: 0.9em;
      color: ${t.text}88;
    }
  </style>
</head>
<body>
  <article>
    <h1>${entry.explanation.title}</h1>
    <div class="meta">
      <span>Category: ${entry.rule.category}</span>
      <span>Severity: ${entry.severity}</span>
      <span>Effect: ${entry.effect}</span>
    </div>
    <p class="summary">${entry.explanation.summary}</p>
    <div class="detail">
      <h2>Technical Detail</h2>
      <p>${entry.explanation.technicalDetail}</p>
    </div>
    <div class="interpretation">
      <h2>Interpretation</h2>
      <p>${entry.explanation.interpretation}</p>
    </div>
    <div class="recommendations">
      <h2>Recommendations</h2>
      <ul>
        ${entry.explanation.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
    <p class="persona-hook">"${entry.personaHook}"</p>
    <p><em>Journey hint: ${entry.journeyStepHint}</em></p>
  </article>
</body>
</html>`;
}

/**
 * Export a single Codex page to Markdown
 */
export function exportCodexPageMarkdown(entry: CodexEntry): string {
  const lines: string[] = [];

  lines.push(`# ${entry.explanation.title}`);
  lines.push('');
  lines.push(`*Category: ${entry.rule.category} | Severity: ${entry.severity} | Effect: ${entry.effect}*`);
  lines.push('');
  lines.push(`**${entry.explanation.summary}**`);
  lines.push('');
  lines.push('## Technical Detail');
  lines.push(entry.explanation.technicalDetail);
  lines.push('');
  lines.push('## Interpretation');
  lines.push(entry.explanation.interpretation);
  lines.push('');
  lines.push('## Recommendations');
  entry.explanation.recommendations.forEach(r => lines.push(`- ${r}`));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`> "${entry.personaHook}"`);
  lines.push('');
  lines.push(`*Journey hint: ${entry.journeyStepHint}*`);

  return lines.join('\n');
}

// ==================== JOURNEY EXPORT ====================

/**
 * Export Pilgrim Journey to printable HTML
 */
export function exportJourneyHtml(journey: PilgrimJourney, theme: 'light' | 'dark' | 'ceremonial' = 'ceremonial'): string {
  const themeStyles = {
    light: { bg: '#ffffff', text: '#1a1a2e', accent: '#4a4a6a' },
    dark: { bg: '#1a1a2e', text: '#e8e6e3', accent: '#d4af37' },
    ceremonial: { bg: '#faf8f5', text: '#2c2416', accent: '#8b4513' }
  };

  const t = themeStyles[theme];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pilgrim Journey</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      background: ${t.bg};
      color: ${t.text};
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.8;
    }
    .journey-header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 3px double ${t.accent};
    }
    .journey-title {
      font-size: 2.5em;
      color: ${t.accent};
    }
    .journey-subtitle {
      font-size: 1.5em;
      margin-top: 0.5rem;
    }
    .introduction {
      font-style: italic;
      text-align: center;
      padding: 2rem;
      font-size: 1.1em;
    }
    .step {
      border-left: 4px solid ${t.accent};
      padding: 1.5rem;
      margin: 2rem 0;
      background: ${t.bg};
    }
    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .step-number {
      font-size: 2em;
      color: ${t.accent};
      font-weight: bold;
    }
    .step-chamber {
      font-size: 0.9em;
      color: ${t.text}88;
    }
    .step-title {
      font-size: 1.3em;
      color: ${t.accent};
      margin-bottom: 1rem;
    }
    .step-narrative {
      line-height: 1.9;
    }
    .conclusion {
      text-align: center;
      padding: 3rem;
      border-top: 3px double ${t.accent};
      margin-top: 3rem;
      font-style: italic;
    }
    @media print {
      .step { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header class="journey-header">
    <h1 class="journey-title">🕍 The Pilgrim's Journey</h1>
    <p class="journey-subtitle">命理朝圣之旅</p>
    <p>${journey.steps.length} steps through ${journey.chambers.length} chambers</p>
  </header>

  <div class="introduction">
    <p>${journey.introduction}</p>
  </div>

  ${journey.steps.map((step, i) => `
    <article class="step">
      <div class="step-header">
        <span class="step-number">${i + 1}</span>
        <span class="step-chamber">${step.chamber.name} (${step.chamber.chineseName})</span>
      </div>
      <h2 class="step-title">${step.title}</h2>
      <p class="step-narrative">${step.narrative}</p>
    </article>
  `).join('')}

  <footer class="conclusion">
    <p>${journey.conclusion}</p>
  </footer>
</body>
</html>`;
}

// ==================== BATCH EXPORT ====================

/**
 * Generate all export formats at once
 */
export function generateAllExports(
  data: CathedralReportData,
  options: Partial<ExportOptions> = {}
): {
  markdown: string;
  html: string;
  codexPages: { markdown: string; html: string }[];
  journeyHtml: string;
} {
  return {
    markdown: generateCathedralReportMarkdown(data, options),
    html: generateCathedralReportHtml(data, options),
    codexPages: data.knowledgeCodex.entries.map(entry => ({
      markdown: exportCodexPageMarkdown(entry),
      html: exportCodexPageHtml(entry, options.theme || 'ceremonial')
    })),
    journeyHtml: exportJourneyHtml(data.pilgrimJourney, options.theme || 'ceremonial')
  };
}

/**
 * Generate downloadable file bundle
 */
export function generateExportFileBundle(
  data: CathedralReportData,
  options: Partial<ExportOptions> = {}
): Record<string, { content: string; filename: string; mimeType: string }> {
  const exports = generateAllExports(data, options);
  const timestamp = new Date().toISOString().split('T')[0];
  const chartId = data.metadata.chartId;

  const bundle: Record<string, { content: string; filename: string; mimeType: string }> = {
    reportMarkdown: {
      content: exports.markdown,
      filename: `cathedral-report-${chartId}-${timestamp}.md`,
      mimeType: 'text/markdown'
    },
    reportHtml: {
      content: exports.html,
      filename: `cathedral-report-${chartId}-${timestamp}.html`,
      mimeType: 'text/html'
    },
    journeyHtml: {
      content: exports.journeyHtml,
      filename: `pilgrim-journey-${chartId}-${timestamp}.html`,
      mimeType: 'text/html'
    }
  };

  // Add individual codex pages
  exports.codexPages.forEach((page, i) => {
    const entry = data.knowledgeCodex.entries[i];
    const safeTitle = entry.rule.id.replace(/[^a-z0-9]/gi, '-');
    bundle[`codex_${safeTitle}_md`] = {
      content: page.markdown,
      filename: `codex-${safeTitle}-${timestamp}.md`,
      mimeType: 'text/markdown'
    };
    bundle[`codex_${safeTitle}_html`] = {
      content: page.html,
      filename: `codex-${safeTitle}-${timestamp}.html`,
      mimeType: 'text/html'
    };
  });

  return bundle;
}
