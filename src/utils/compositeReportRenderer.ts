/**
 * ============================================================================
 * COMPOSITE REPORT HTML/PDF RENDERER (合盘报告渲染器)
 * ============================================================================
 *
 * The presentation layer — where all metaphysical computations become
 * shareable, printable, ritual artifacts. This module transforms the
 * Composite Forecast Report into:
 *
 * 1. Clean, styled HTML (for web / in-app viewing)
 * 2. Printable PDF (for export / archive / ritual)
 *
 * Three Clean Layers:
 * - Content Layer: generateCompositeForecastReport() → Markdown
 * - HTML Layout Layer: Converts report + charts into HTML document
 * - PDF Rendering Layer: HTML → PDF via headless renderer
 *
 * Chart Integration:
 * - Destiny Trajectory Curve (SVG)
 * - Synastry Heatmap (SVG)
 * - Relationship Radar (SVG)
 * - Element Distribution Donut (SVG)
 * - Lifecycle Timeline (SVG)
 *
 * Based on: Report rendering best practices
 * Aligned with: Print-ready design standards
 * Created: January 2026
 * ============================================================================
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Chart assets for report rendering
 */
export interface ReportChartAssets {
  destinyCurveSvg?: string;
  synastryHeatmapSvg?: string;
  relationshipRadarSvg?: string;
  elementDonutSvg?: string;
  lifecycleTimelineSvg?: string;
  archetypeIconSvg?: string;
}

/**
 * Report metadata
 */
export interface ReportMetadata {
  title: string;
  subtitle?: string;
  coupleLabel: string;
  partnerAName: string;
  partnerBName: string;
  generatedAt: string;
  reportVersion?: string;
  locale?: string;
}

/**
 * Complete report assets for rendering
 */
export interface CompositeReportAssets {
  reportMarkdown: string;
  charts: ReportChartAssets;
  meta: ReportMetadata;
  options?: RenderOptions;
}

/**
 * Render options
 */
export interface RenderOptions {
  theme?: 'light' | 'dark' | 'sepia' | 'celestial';
  fontSize?: 'small' | 'medium' | 'large';
  includeCharts?: boolean;
  includeFooter?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

/**
 * PDF generation options
 */
export interface PdfOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  landscape?: boolean;
  printBackground?: boolean;
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
}

/**
 * Rendered report result
 */
export interface RenderedReport {
  html: string;
  title: string;
  generatedAt: string;
  wordCount: number;
  chartCount: number;
}

// ============================================================================
// THEME DEFINITIONS
// ============================================================================

interface ThemeColors {
  background: string;
  text: string;
  heading: string;
  subtext: string;
  accent: string;
  border: string;
  cardBg: string;
  codeBg: string;
}

const THEMES: Record<string, ThemeColors> = {
  light: {
    background: '#ffffff',
    text: '#1a1a2e',
    heading: '#16213e',
    subtext: '#666666',
    accent: '#6366f1',
    border: '#e5e5e5',
    cardBg: '#f8f9fa',
    codeBg: '#f4f4f5'
  },
  dark: {
    background: '#1a1a2e',
    text: '#e5e5e5',
    heading: '#ffffff',
    subtext: '#a0a0a0',
    accent: '#818cf8',
    border: '#3a3a5e',
    cardBg: '#242444',
    codeBg: '#2d2d4d'
  },
  sepia: {
    background: '#f4ecd8',
    text: '#5c4b37',
    heading: '#3d2914',
    subtext: '#7a6652',
    accent: '#b87333',
    border: '#d4c4a8',
    cardBg: '#efe5d0',
    codeBg: '#e8dcc6'
  },
  celestial: {
    background: '#0f0f23',
    text: '#ccccff',
    heading: '#ffff66',
    subtext: '#9999cc',
    accent: '#00cc00',
    border: '#333366',
    cardBg: '#1a1a3e',
    codeBg: '#252550'
  }
};

const FONT_SIZES: Record<string, { base: string; h1: string; h2: string; h3: string; small: string }> = {
  small: { base: '14px', h1: '28px', h2: '22px', h3: '18px', small: '12px' },
  medium: { base: '16px', h1: '32px', h2: '26px', h3: '20px', small: '14px' },
  large: { base: '18px', h1: '36px', h2: '30px', h3: '24px', small: '16px' }
};

// ============================================================================
// MARKDOWN TO HTML CONVERTER
// ============================================================================

/**
 * Convert markdown to HTML
 * Handles: headers, bold, italic, lists, code, links, blockquotes, hr
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first (except for what we'll generate)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers (process multi-line)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');
  html = html.replace(/^\*\*\*$/gm, '<hr />');
  html = html.replace(/^___$/gm, '<hr />');

  // Unordered lists
  html = processLists(html);

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs (wrap non-tagged lines)
  html = wrapParagraphs(html);

  return html;
}

/**
 * Process markdown lists into HTML
 */
function processLists(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const listMatch = line.match(/^[-*] (.+)$/);

    if (listMatch) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`  <li>${listMatch[1]}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

/**
 * Wrap non-tagged content in paragraph tags
 */
function wrapParagraphs(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let buffer: string[] = [];

  const isTagged = (line: string): boolean => {
    const trimmed = line.trim();
    return (
      trimmed === '' ||
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('</ul') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<div') ||
      trimmed.startsWith('</div')
    );
  };

  const flushBuffer = () => {
    if (buffer.length > 0) {
      const content = buffer.join(' ').trim();
      if (content) {
        result.push(`<p>${content}</p>`);
      }
      buffer = [];
    }
  };

  for (const line of lines) {
    if (isTagged(line)) {
      flushBuffer();
      if (line.trim()) {
        result.push(line);
      }
    } else {
      const trimmed = line.trim();
      if (trimmed) {
        buffer.push(trimmed);
      } else {
        flushBuffer();
      }
    }
  }

  flushBuffer();

  return result.join('\n');
}

// ============================================================================
// CSS GENERATION
// ============================================================================

/**
 * Generate CSS for the report
 */
function generateReportCss(options: RenderOptions = {}): string {
  const theme = THEMES[options.theme || 'light'];
  const fonts = FONT_SIZES[options.fontSize || 'medium'];
  const margins = options.margins || { top: '40px', right: '40px', bottom: '40px', left: '40px' };

  return `
    /* Base Reset */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* Root Variables */
    :root {
      --color-bg: ${theme.background};
      --color-text: ${theme.text};
      --color-heading: ${theme.heading};
      --color-subtext: ${theme.subtext};
      --color-accent: ${theme.accent};
      --color-border: ${theme.border};
      --color-card-bg: ${theme.cardBg};
      --color-code-bg: ${theme.codeBg};
      --font-base: ${fonts.base};
      --font-h1: ${fonts.h1};
      --font-h2: ${fonts.h2};
      --font-h3: ${fonts.h3};
      --font-small: ${fonts.small};
    }

    /* Body */
    body {
      font-family: 'Noto Sans SC', 'Source Han Sans SC', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: var(--font-base);
      line-height: 1.7;
      color: var(--color-text);
      background-color: var(--color-bg);
      margin: 0;
      padding: ${margins.top} ${margins.right} ${margins.bottom} ${margins.left};
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      color: var(--color-heading);
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.3;
    }

    h1 {
      font-size: var(--font-h1);
      border-bottom: 3px solid var(--color-accent);
      padding-bottom: 0.3em;
      margin-top: 0;
    }

    h2 {
      font-size: var(--font-h2);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.2em;
    }

    h3 {
      font-size: var(--font-h3);
      color: var(--color-accent);
    }

    p {
      margin: 1em 0;
    }

    /* Links */
    a {
      color: var(--color-accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    a:hover {
      border-bottom-color: var(--color-accent);
    }

    /* Lists */
    ul, ol {
      margin: 1em 0;
      padding-left: 1.5em;
    }

    li {
      margin: 0.5em 0;
    }

    /* Code */
    code {
      font-family: 'Fira Code', 'Source Code Pro', Consolas, monospace;
      font-size: 0.9em;
      background-color: var(--color-code-bg);
      padding: 0.2em 0.4em;
      border-radius: 4px;
    }

    pre {
      background-color: var(--color-code-bg);
      padding: 1em;
      border-radius: 8px;
      overflow-x: auto;
    }

    pre code {
      background: none;
      padding: 0;
    }

    /* Blockquotes */
    blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 4px solid var(--color-accent);
      background-color: var(--color-card-bg);
      font-style: italic;
      color: var(--color-subtext);
    }

    /* Horizontal Rules */
    hr {
      border: none;
      border-top: 1px solid var(--color-border);
      margin: 2em 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }

    th, td {
      padding: 0.75em;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    th {
      background-color: var(--color-card-bg);
      font-weight: 600;
    }

    /* Report Header */
    .report-header {
      text-align: center;
      margin-bottom: 3em;
      padding-bottom: 2em;
      border-bottom: 2px solid var(--color-border);
    }

    .report-header h1 {
      border-bottom: none;
      margin-bottom: 0.3em;
    }

    .report-subtitle {
      font-size: 1.2em;
      color: var(--color-subtext);
      margin-bottom: 1em;
    }

    .report-meta {
      font-size: var(--font-small);
      color: var(--color-subtext);
    }

    .report-meta div {
      margin: 0.3em 0;
    }

    /* Couple Label */
    .couple-label {
      font-size: 1.4em;
      font-weight: 600;
      color: var(--color-accent);
      margin: 1em 0;
    }

    .couple-label .heart {
      color: #e74c3c;
      margin: 0 0.3em;
    }

    /* Charts Section */
    .charts-section {
      margin: 2em 0;
      padding: 1.5em;
      background-color: var(--color-card-bg);
      border-radius: 12px;
      border: 1px solid var(--color-border);
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5em;
    }

    .chart-block {
      background-color: var(--color-bg);
      padding: 1em;
      border-radius: 8px;
      border: 1px solid var(--color-border);
    }

    .chart-title {
      font-weight: 600;
      font-size: 1.1em;
      color: var(--color-heading);
      margin-bottom: 0.5em;
      text-align: center;
    }

    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    .chart-container svg {
      max-width: 100%;
      height: auto;
    }

    /* Report Content */
    .report-content {
      margin-top: 2em;
    }

    /* Chapter Styling */
    .chapter {
      margin-bottom: 3em;
      page-break-inside: avoid;
    }

    .chapter-number {
      font-size: var(--font-small);
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5em;
    }

    /* Highlight Boxes */
    .highlight-box {
      background: linear-gradient(135deg, var(--color-card-bg), var(--color-bg));
      border: 1px solid var(--color-accent);
      border-radius: 8px;
      padding: 1em 1.5em;
      margin: 1em 0;
    }

    .highlight-box-title {
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 0.5em;
    }

    /* Score Badges */
    .score-badge {
      display: inline-block;
      padding: 0.3em 0.8em;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9em;
    }

    .score-excellent {
      background-color: #22c55e;
      color: white;
    }

    .score-good {
      background-color: #3b82f6;
      color: white;
    }

    .score-neutral {
      background-color: #f59e0b;
      color: white;
    }

    .score-challenging {
      background-color: #ef4444;
      color: white;
    }

    /* Footer */
    .report-footer {
      margin-top: 3em;
      padding-top: 2em;
      border-top: 2px solid var(--color-border);
      text-align: center;
      font-size: var(--font-small);
      color: var(--color-subtext);
    }

    .report-footer .logo {
      font-weight: 600;
      color: var(--color-accent);
    }

    /* Print Styles */
    @media print {
      body {
        background-color: white;
        color: black;
        padding: 0;
        max-width: none;
      }

      h1, h2, h3 {
        color: black;
      }

      .charts-section {
        background-color: #f8f9fa;
      }

      .chart-block {
        break-inside: avoid;
      }

      a {
        color: black;
        text-decoration: underline;
      }

      .report-footer {
        page-break-before: avoid;
      }

      @page {
        margin: 2cm;
      }
    }

    /* Chinese Typography Enhancements */
    .chinese-text {
      font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', serif;
    }

    .chinese-title {
      font-size: 0.85em;
      color: var(--color-subtext);
      margin-left: 0.5em;
    }

    /* Astrology Symbols */
    .element-wood { color: #22c55e; }
    .element-fire { color: #ef4444; }
    .element-earth { color: #f59e0b; }
    .element-metal { color: #a1a1aa; }
    .element-water { color: #3b82f6; }

    /* Animation for web viewing */
    @media screen {
      .chart-block {
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .chart-block:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  `;
}

// ============================================================================
// HTML GENERATION
// ============================================================================

/**
 * Render complete HTML document from report assets
 */
export function renderCompositeReportHtml(assets: CompositeReportAssets): RenderedReport {
  const { reportMarkdown, charts, meta, options = {} } = assets;

  const reportHtml = markdownToHtml(reportMarkdown);
  const css = generateReportCss(options);
  const includeCharts = options.includeCharts !== false;
  const includeFooter = options.includeFooter !== false;

  // Count charts
  let chartCount = 0;
  if (charts.destinyCurveSvg) chartCount++;
  if (charts.synastryHeatmapSvg) chartCount++;
  if (charts.relationshipRadarSvg) chartCount++;
  if (charts.elementDonutSvg) chartCount++;
  if (charts.lifecycleTimelineSvg) chartCount++;

  // Word count (approximate)
  const wordCount = reportMarkdown.split(/\s+/).length;

  const html = `<!DOCTYPE html>
<html lang="${meta.locale || 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="generator" content="Genesis Soul Composite Report Renderer" />
  <meta name="description" content="Composite BaZi Relationship Report for ${meta.coupleLabel}" />
  <title>${escapeHtml(meta.title)}</title>
  <style>
${css}
  </style>
</head>
<body>
  <!-- Report Header -->
  <header class="report-header">
    <h1>${escapeHtml(meta.title)}</h1>
    ${meta.subtitle ? `<div class="report-subtitle">${escapeHtml(meta.subtitle)}</div>` : ''}
    <div class="couple-label">
      ${escapeHtml(meta.partnerAName)} <span class="heart">♥</span> ${escapeHtml(meta.partnerBName)}
    </div>
    <div class="report-meta">
      <div>Generated: ${escapeHtml(meta.generatedAt)}</div>
      ${meta.reportVersion ? `<div>Version: ${escapeHtml(meta.reportVersion)}</div>` : ''}
    </div>
  </header>

  ${includeCharts && chartCount > 0 ? renderChartsSection(charts) : ''}

  <!-- Report Content -->
  <main class="report-content">
    ${reportHtml}
  </main>

  ${includeFooter ? renderFooter(meta) : ''}
</body>
</html>`;

  return {
    html,
    title: meta.title,
    generatedAt: meta.generatedAt,
    wordCount,
    chartCount
  };
}

/**
 * Render charts section
 */
function renderChartsSection(charts: ReportChartAssets): string {
  const chartBlocks: string[] = [];

  if (charts.destinyCurveSvg) {
    chartBlocks.push(`
      <div class="chart-block">
        <div class="chart-title">Destiny Trajectory Curve <span class="chinese-title">运势曲线</span></div>
        <div class="chart-container">${charts.destinyCurveSvg}</div>
      </div>
    `);
  }

  if (charts.synastryHeatmapSvg) {
    chartBlocks.push(`
      <div class="chart-block">
        <div class="chart-title">Synastry Heatmap <span class="chinese-title">合盘热图</span></div>
        <div class="chart-container">${charts.synastryHeatmapSvg}</div>
      </div>
    `);
  }

  if (charts.relationshipRadarSvg) {
    chartBlocks.push(`
      <div class="chart-block">
        <div class="chart-title">Relationship Radar <span class="chinese-title">关系雷达</span></div>
        <div class="chart-container">${charts.relationshipRadarSvg}</div>
      </div>
    `);
  }

  if (charts.elementDonutSvg) {
    chartBlocks.push(`
      <div class="chart-block">
        <div class="chart-title">Element Distribution <span class="chinese-title">五行分布</span></div>
        <div class="chart-container">${charts.elementDonutSvg}</div>
      </div>
    `);
  }

  if (charts.lifecycleTimelineSvg) {
    chartBlocks.push(`
      <div class="chart-block">
        <div class="chart-title">Lifecycle Timeline <span class="chinese-title">生命周期</span></div>
        <div class="chart-container">${charts.lifecycleTimelineSvg}</div>
      </div>
    `);
  }

  if (chartBlocks.length === 0) {
    return '';
  }

  return `
  <!-- Charts Section -->
  <section class="charts-section">
    <h2>Visual Overview <span class="chinese-title">图形概览</span></h2>
    <div class="charts-grid">
      ${chartBlocks.join('\n')}
    </div>
  </section>
  `;
}

/**
 * Render footer
 */
function renderFooter(meta: ReportMetadata): string {
  return `
  <!-- Report Footer -->
  <footer class="report-footer">
    <div class="logo">Genesis Soul</div>
    <div>Composite Relationship Report</div>
    <div>${meta.coupleLabel}</div>
    <div>Generated: ${escapeHtml(meta.generatedAt)}</div>
    <div style="margin-top: 1em; font-style: italic;">
      "The stars impel, they do not compel."
    </div>
  </footer>
  `;
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// PDF RENDERING (PLACEHOLDER)
// ============================================================================

/**
 * PDF rendering configuration
 */
export interface PdfRenderConfig {
  html: string;
  options?: PdfOptions;
}

/**
 * Render HTML to PDF buffer
 *
 * This is a placeholder that demonstrates the interface.
 * Actual implementation requires a headless browser:
 * - Puppeteer: await puppeteer.launch() → page.pdf()
 * - Playwright: await playwright.chromium.launch() → page.pdf()
 * - wkhtmltopdf: exec("wkhtmltopdf ...")
 * - Cloud service: html-pdf-service API call
 */
export async function renderCompositeReportPdf(config: PdfRenderConfig): Promise<Buffer> {
  const { html, options = {} } = config;

  // Validate HTML is provided
  if (!html || html.trim().length === 0) {
    throw new Error('HTML content is required for PDF generation');
  }

  // Default options
  const pdfOptions: PdfOptions = {
    format: options.format || 'A4',
    landscape: options.landscape || false,
    printBackground: options.printBackground !== false,
    margin: options.margin || {
      top: '2cm',
      right: '2cm',
      bottom: '2cm',
      left: '2cm'
    },
    displayHeaderFooter: options.displayHeaderFooter || false,
    headerTemplate: options.headerTemplate || '',
    footerTemplate: options.footerTemplate || ''
  };

  // Placeholder implementation - returns empty buffer
  // Replace with actual implementation using your chosen renderer
  console.log('[PDF Renderer] PDF options:', pdfOptions);
  console.log('[PDF Renderer] HTML length:', html.length);

  // Example Puppeteer implementation (commented out):
  /*
  const puppeteer = require('puppeteer');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: pdfOptions.format,
      landscape: pdfOptions.landscape,
      printBackground: pdfOptions.printBackground,
      margin: pdfOptions.margin,
      displayHeaderFooter: pdfOptions.displayHeaderFooter,
      headerTemplate: pdfOptions.headerTemplate,
      footerTemplate: pdfOptions.footerTemplate
    });

    return pdf;
  } finally {
    await browser.close();
  }
  */

  // Return placeholder buffer with message
  const message = 'PDF generation requires a headless browser implementation. See comments in renderCompositeReportPdf() for examples.';
  return Buffer.from(message, 'utf-8');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create report metadata from basic inputs
 */
export function createReportMetadata(
  partnerAName: string,
  partnerBName: string,
  options?: Partial<ReportMetadata>
): ReportMetadata {
  const now = new Date();

  return {
    title: options?.title || 'Composite Relationship Report',
    subtitle: options?.subtitle || '合盘关系报告',
    coupleLabel: `${partnerAName} & ${partnerBName}`,
    partnerAName,
    partnerBName,
    generatedAt: options?.generatedAt || now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0],
    reportVersion: options?.reportVersion || '1.0',
    locale: options?.locale || 'en'
  };
}

/**
 * Get default render options
 */
export function getDefaultRenderOptions(): RenderOptions {
  return {
    theme: 'light',
    fontSize: 'medium',
    includeCharts: true,
    includeFooter: true,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: '40px',
      right: '40px',
      bottom: '40px',
      left: '40px'
    }
  };
}

/**
 * Create empty chart assets object
 */
export function createEmptyChartAssets(): ReportChartAssets {
  return {
    destinyCurveSvg: undefined,
    synastryHeatmapSvg: undefined,
    relationshipRadarSvg: undefined,
    elementDonutSvg: undefined,
    lifecycleTimelineSvg: undefined,
    archetypeIconSvg: undefined
  };
}

/**
 * Validate report assets before rendering
 */
export function validateReportAssets(assets: CompositeReportAssets): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!assets.reportMarkdown || assets.reportMarkdown.trim().length === 0) {
    errors.push('Report markdown content is required');
  }

  if (!assets.meta) {
    errors.push('Report metadata is required');
  } else {
    if (!assets.meta.title) {
      errors.push('Report title is required');
    }
    if (!assets.meta.partnerAName) {
      errors.push('Partner A name is required');
    }
    if (!assets.meta.partnerBName) {
      errors.push('Partner B name is required');
    }
    if (!assets.meta.generatedAt) {
      errors.push('Generation timestamp is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================================
// EXPORT HELPERS
// ============================================================================

/**
 * Quick render: Markdown → HTML
 */
export function quickRenderHtml(
  markdown: string,
  partnerAName: string,
  partnerBName: string,
  options?: RenderOptions
): string {
  const meta = createReportMetadata(partnerAName, partnerBName);
  const charts = createEmptyChartAssets();

  const result = renderCompositeReportHtml({
    reportMarkdown: markdown,
    charts,
    meta,
    options
  });

  return result.html;
}

/**
 * Export report as downloadable HTML file
 */
export function exportAsHtmlFile(
  assets: CompositeReportAssets
): { filename: string; content: string; mimeType: string } {
  const result = renderCompositeReportHtml(assets);

  const safeCoupleName = assets.meta.coupleLabel
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
    .replace(/_+/g, '_');

  const date = new Date().toISOString().split('T')[0];

  return {
    filename: `composite_report_${safeCoupleName}_${date}.html`,
    content: result.html,
    mimeType: 'text/html'
  };
}

/**
 * Export report metadata as JSON
 */
export function exportMetadataAsJson(
  assets: CompositeReportAssets
): { filename: string; content: string; mimeType: string } {
  const result = renderCompositeReportHtml(assets);

  const metadata = {
    title: assets.meta.title,
    coupleLabel: assets.meta.coupleLabel,
    partnerA: assets.meta.partnerAName,
    partnerB: assets.meta.partnerBName,
    generatedAt: assets.meta.generatedAt,
    version: assets.meta.reportVersion,
    stats: {
      wordCount: result.wordCount,
      chartCount: result.chartCount
    },
    options: assets.options
  };

  const safeCoupleName = assets.meta.coupleLabel
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')
    .replace(/_+/g, '_');

  const date = new Date().toISOString().split('T')[0];

  return {
    filename: `composite_report_meta_${safeCoupleName}_${date}.json`,
    content: JSON.stringify(metadata, null, 2),
    mimeType: 'application/json'
  };
}

// ============================================================================
// INTEGRATION EXAMPLE
// ============================================================================

/**
 * Example integration function showing full workflow
 *
 * This demonstrates how to use the renderer with other modules.
 * In practice, you'd call this from your API or UI layer.
 */
export function exampleIntegration(): string {
  // Example markdown content (would come from generateCompositeForecastReport)
  const exampleMarkdown = `
# Composite Relationship Report

## Chapter 1: Overview

This is an example report showing how the renderer works.

### Compatibility Score

**Overall Score:** 78/100

The relationship shows strong harmony with growth potential.

### Key Strengths

- Deep emotional resonance
- Complementary element balance
- Shared Fire activation

### Growth Areas

- Communication during stress
- Balancing independence and togetherness

---

## Chapter 2: Synastry Analysis

The Day-Day connection shows **strong harmony** (85/100).

*Harmony Pattern:* Wood feeding Fire creates passionate creativity.

---

## Chapter 3: Timing Outlook

The current period (2026) supports:

- Deepening commitment
- Shared creative projects
- Emotional healing

---

*Generated by Genesis Soul Composite Report Renderer*
`;

  // Create assets
  const meta = createReportMetadata('Partner A', 'Partner B', {
    title: 'Example Composite Report',
    subtitle: '示例合盘报告'
  });

  const charts = createEmptyChartAssets();

  const assets: CompositeReportAssets = {
    reportMarkdown: exampleMarkdown,
    charts,
    meta,
    options: {
      theme: 'light',
      fontSize: 'medium',
      includeCharts: false,
      includeFooter: true
    }
  };

  // Render
  const result = renderCompositeReportHtml(assets);

  console.log(`[Example] Generated report: ${result.wordCount} words, ${result.chartCount} charts`);

  return result.html;
}

// All functions are exported inline with 'export' keyword
