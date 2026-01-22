/**
 * ============================================
 * PRO REPORT EXPORT
 * Configurable, Printable Professional Report
 *
 * Merges:
 * - Technical section (like Joey Yap's)
 * - Narrative section (cockpit)
 * - Ancestral + mythos section (temple)
 *
 * Produces comprehensive professional + narrative + ancestral reports.
 * ============================================
 */

import { MingPanProData, BaZiChartData, LuckPillarData, AnnualAnalysisData, PillarInteraction } from './templates/mingPanProTemplate';
import { NarrativeCockpitData, StoryBeat, EmotionalArcPoint } from './narrativeCockpitModel';
import { AncestralArchetype } from './mythosLayer';

// ==================== DATA MODEL ====================

export interface PilgrimPosition {
  inheritedThemes: string[];
  brokenPatterns: string[];
  newPatterns: string[];
  generationIndex: number;
}

export interface AncestralSection {
  position: PilgrimPosition;
  ancestralNarrative?: string;
  healingThemes?: string[];
}

export interface MythosSection {
  archetypes: AncestralArchetype[];
  dominantArchetype?: AncestralArchetype;
  codexPages?: string[];
}

export interface ProReportData {
  // Technical
  chart: BaZiChartData;
  luckPillars: LuckPillarData[];
  annualAnalysis: AnnualAnalysisData[];
  interactions: PillarInteraction[];
  usefulGod?: { element: string; elementZh: string; };
  annoyingGod?: { element: string; elementZh: string; };

  // Narrative
  narrativeCockpit?: NarrativeCockpitData;

  // Ancestral
  ancestral?: AncestralSection;

  // Mythos
  mythos?: MythosSection;

  // Meta
  generatedAt?: Date;
  reportTitle?: string;
}

export interface ProReportOptions {
  includeTechnical?: boolean;
  includeNarrative?: boolean;
  includeAncestral?: boolean;
  includeMythos?: boolean;
  format?: 'markdown' | 'html' | 'json';
  lang?: 'en' | 'zh';
}

// ==================== MARKDOWN EXPORT ====================

/**
 * Export Pro Report as Markdown
 */
export function exportProReportMarkdown(
  data: ProReportData,
  options: ProReportOptions = {}
): string {
  const {
    includeTechnical = true,
    includeNarrative = true,
    includeAncestral = true,
    includeMythos = true,
    lang = 'en'
  } = options;

  const lines: string[] = [];
  const title = data.reportTitle || (lang === 'zh' ? '专业八字报告' : 'Professional BaZi Report');

  // Header
  lines.push(`# 🕍 ${title}`);
  lines.push('');
  if (data.chart.name) {
    lines.push(`**${lang === 'zh' ? '姓名' : 'Name'}:** ${data.chart.name}`);
  }
  lines.push(`**${lang === 'zh' ? '出生日期' : 'Birth Date'}:** ${data.chart.birthDate}${data.chart.birthTime ? ` ${data.chart.birthTime}` : ''}`);
  if (data.generatedAt) {
    lines.push(`**${lang === 'zh' ? '生成时间' : 'Generated'}:** ${data.generatedAt.toISOString()}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // I. Technical Section
  if (includeTechnical) {
    lines.push(`## I. ${lang === 'zh' ? '技术分析（命盘专业版）' : 'Technical Analysis (Ming Pan Pro)'}`);
    lines.push('');

    // Core Chart
    lines.push(`### ${lang === 'zh' ? '四柱八字' : 'Four Pillars'}`);
    lines.push('');
    lines.push(`| ${lang === 'zh' ? '柱位' : 'Pillar'} | ${lang === 'zh' ? '天干' : 'Stem'} | ${lang === 'zh' ? '地支' : 'Branch'} |`);
    lines.push('|--------|------|--------|');
    lines.push(`| ${lang === 'zh' ? '年' : 'Year'} | ${lang === 'zh' ? data.chart.yearPillar.stemZh : data.chart.yearPillar.stem} | ${lang === 'zh' ? data.chart.yearPillar.branchZh : data.chart.yearPillar.branch} |`);
    lines.push(`| ${lang === 'zh' ? '月' : 'Month'} | ${lang === 'zh' ? data.chart.monthPillar.stemZh : data.chart.monthPillar.stem} | ${lang === 'zh' ? data.chart.monthPillar.branchZh : data.chart.monthPillar.branch} |`);
    lines.push(`| ${lang === 'zh' ? '日' : 'Day'} | ${lang === 'zh' ? data.chart.dayPillar.stemZh : data.chart.dayPillar.stem} | ${lang === 'zh' ? data.chart.dayPillar.branchZh : data.chart.dayPillar.branch} |`);
    lines.push(`| ${lang === 'zh' ? '时' : 'Hour'} | ${lang === 'zh' ? data.chart.hourPillar.stemZh : data.chart.hourPillar.stem} | ${lang === 'zh' ? data.chart.hourPillar.branchZh : data.chart.hourPillar.branch} |`);
    lines.push('');
    lines.push(`**${lang === 'zh' ? '日主' : 'Day Master'}:** ${lang === 'zh' ? data.chart.dayMasterZh : data.chart.dayMaster} (${data.chart.dayMasterElement})`);
    lines.push('');

    // Useful/Annoying God
    if (data.usefulGod || data.annoyingGod) {
      lines.push(`### ${lang === 'zh' ? '用神忌神' : 'Useful & Annoying Gods'}`);
      if (data.usefulGod) {
        lines.push(`- **${lang === 'zh' ? '用神' : 'Useful God'}:** ${lang === 'zh' ? data.usefulGod.elementZh : data.usefulGod.element}`);
      }
      if (data.annoyingGod) {
        lines.push(`- **${lang === 'zh' ? '忌神' : 'Annoying God'}:** ${lang === 'zh' ? data.annoyingGod.elementZh : data.annoyingGod.element}`);
      }
      lines.push('');
    }

    // Luck Pillars
    lines.push(`### ${lang === 'zh' ? '大运' : 'Luck Pillars'}`);
    lines.push('');
    data.luckPillars.forEach(lp => {
      const favor = lp.favorability ? ` [${lp.favorability}]` : '';
      lines.push(`- **${lp.startAge}–${lp.endAge}:** ${lang === 'zh' ? lp.stemZh : lp.stem} ${lang === 'zh' ? lp.branchZh : lp.branch} (${lp.element})${favor}${lp.notes ? ` — ${lp.notes}` : ''}`);
    });
    lines.push('');

    // Annual Analysis
    if (data.annualAnalysis.length > 0) {
      lines.push(`### ${lang === 'zh' ? '流年分析' : 'Annual Analysis'}`);
      lines.push('');
      data.annualAnalysis.forEach(a => {
        const favor = a.favorability ? ` [${a.favorability}]` : '';
        lines.push(`- **${a.year}:** ${lang === 'zh' ? a.stemZh : a.stem} ${lang === 'zh' ? a.branchZh : a.branch} (${a.element})${favor}${a.notes ? ` — ${a.notes}` : ''}`);
      });
      lines.push('');
    }

    // Pillar Interactions
    if (data.interactions.length > 0) {
      lines.push(`### ${lang === 'zh' ? '柱位互动' : 'Pillar Interactions'}`);
      lines.push('');
      data.interactions.forEach(i => {
        const typeLabel = lang === 'zh' ? i.typeZh : i.type.replace('_', ' ');
        lines.push(`- **${typeLabel}** (${i.participants.join(' ↔ ')}): ${lang === 'zh' ? i.descriptionZh : i.description} [${i.severity}, ${i.effect}]`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // II. Narrative Section
  if (includeNarrative && data.narrativeCockpit) {
    lines.push(`## II. ${lang === 'zh' ? '叙事驾驶舱' : 'Narrative Cockpit'}`);
    lines.push('');

    if (data.narrativeCockpit.storyBeats && data.narrativeCockpit.storyBeats.length > 0) {
      lines.push(`### ${lang === 'zh' ? '故事节拍' : 'Story Beats'}`);
      lines.push('');
      data.narrativeCockpit.storyBeats.forEach(beat => {
        lines.push(`#### ${beat.label} (${beat.startAge}–${beat.endAge})`);
        if (beat.description) {
          lines.push(beat.description);
        }
        if (beat.dominantThemes && beat.dominantThemes.length > 0) {
          lines.push(`*${lang === 'zh' ? '主题' : 'Themes'}: ${beat.dominantThemes.join(', ')}*`);
        }
        lines.push('');
      });
    }

    if (data.narrativeCockpit.emotionalArc && data.narrativeCockpit.emotionalArc.length > 0) {
      lines.push(`### ${lang === 'zh' ? '情感弧线' : 'Emotional Arc'}`);
      lines.push('');
      data.narrativeCockpit.emotionalArc.forEach(point => {
        lines.push(`- **${lang === 'zh' ? '年龄' : 'Age'} ${point.age}:** ${point.emotionalState} (${point.intensity}%)`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // III. Ancestral Section
  if (includeAncestral && data.ancestral) {
    lines.push(`## III. ${lang === 'zh' ? '祖系定位' : 'Ancestral Positioning'}`);
    lines.push('');

    lines.push(`### ${lang === 'zh' ? '代际位置' : 'Generational Position'}`);
    lines.push(`**${lang === 'zh' ? '代数' : 'Generation'}:** ${data.ancestral.position.generationIndex}`);
    lines.push('');

    if (data.ancestral.position.inheritedThemes.length > 0) {
      lines.push(`**${lang === 'zh' ? '继承主题' : 'Inherited Themes'}:**`);
      data.ancestral.position.inheritedThemes.forEach(t => lines.push(`- ${t}`));
      lines.push('');
    }

    if (data.ancestral.position.brokenPatterns.length > 0) {
      lines.push(`**${lang === 'zh' ? '打破模式' : 'Broken Patterns'}:**`);
      data.ancestral.position.brokenPatterns.forEach(p => lines.push(`- ${p}`));
      lines.push('');
    }

    if (data.ancestral.position.newPatterns.length > 0) {
      lines.push(`**${lang === 'zh' ? '新建模式' : 'New Patterns'}:**`);
      data.ancestral.position.newPatterns.forEach(p => lines.push(`- ${p}`));
      lines.push('');
    }

    if (data.ancestral.ancestralNarrative) {
      lines.push(`### ${lang === 'zh' ? '祖系叙事' : 'Ancestral Narrative'}`);
      lines.push(data.ancestral.ancestralNarrative);
      lines.push('');
    }

    if (data.ancestral.healingThemes && data.ancestral.healingThemes.length > 0) {
      lines.push(`### ${lang === 'zh' ? '疗愈主题' : 'Healing Themes'}`);
      data.ancestral.healingThemes.forEach(t => lines.push(`- ${t}`));
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // IV. Mythos Section
  if (includeMythos && data.mythos && data.mythos.archetypes.length > 0) {
    lines.push(`## IV. ${lang === 'zh' ? '神话原型' : 'Mythos Archetypes'}`);
    lines.push('');

    data.mythos.archetypes.forEach(arch => {
      const name = lang === 'zh' ? arch.nameZh : arch.name;
      lines.push(`### ${name}`);
      lines.push('');
      lines.push(`**${lang === 'zh' ? '主题' : 'Themes'}:** ${arch.themes.join(', ')}`);
      lines.push(`**${lang === 'zh' ? '阴影' : 'Shadow'}:** ${arch.shadow.join(', ')}`);
      lines.push(`**${lang === 'zh' ? '天赋' : 'Gifts'}:** ${arch.gifts.join(', ')}`);
      lines.push('');
    });
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(`*${lang === 'zh' ? '由 Cathedral 系统生成' : 'Generated by Cathedral System'}*`);

  return lines.join('\n');
}

// ==================== HTML EXPORT ====================

/**
 * Export Pro Report as HTML
 */
export function exportProReportHtml(
  data: ProReportData,
  options: ProReportOptions = {}
): string {
  const { lang = 'en' } = options;
  const markdown = exportProReportMarkdown(data, options);
  const htmlContent = simpleMarkdownToHtml(markdown);

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.reportTitle || (lang === 'zh' ? '专业八字报告' : 'Professional BaZi Report')}</title>
  <style>
    ${getProReportStyles()}
  </style>
</head>
<body>
  <div class="pro-report">
    ${htmlContent}
  </div>
  <button class="print-btn" onclick="window.print()">${lang === 'zh' ? '打印报告' : 'Print Report'}</button>
</body>
</html>
  `.trim();
}

/**
 * Simple markdown to HTML
 */
function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.some(c => c.includes('---'))) return '';
      return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^([^<].+)$/gm, '<p>$1</p>');
}

/**
 * Get Pro Report styles
 */
function getProReportStyles(): string {
  return `
body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: #faf8f5;
  color: #3a3a3a;
  line-height: 1.7;
  margin: 0;
  padding: 0;
}

.pro-report {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
}

h1 {
  font-size: 2rem;
  color: #5a4a3a;
  border-bottom: 3px double #c4b494;
  padding-bottom: 12px;
  margin-bottom: 24px;
}

h2 {
  font-size: 1.5rem;
  color: #5a4a3a;
  margin-top: 32px;
  border-left: 4px solid #b8a888;
  padding-left: 12px;
}

h3 {
  font-size: 1.2rem;
  color: #6a5a4a;
  margin-top: 24px;
}

h4 {
  font-size: 1rem;
  color: #7a6a5a;
  margin-top: 16px;
}

p { margin: 12px 0; }

ul {
  margin: 12px 0;
  padding-left: 24px;
}

li { margin: 6px 0; }

table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

td {
  border: 1px solid #e0d8c8;
  padding: 8px 12px;
}

hr {
  border: none;
  border-top: 2px solid #e0d8c8;
  margin: 32px 0;
}

strong { color: #5a4a3a; }

em { color: #7a6a5a; }

.print-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  background: #b8a888;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
}

.print-btn:hover {
  background: #a89878;
}

@media print {
  .print-btn { display: none; }
  body { background: white; }
}
  `.trim();
}

// ==================== JSON EXPORT ====================

/**
 * Export Pro Report as JSON
 */
export function exportProReportJson(
  data: ProReportData,
  options: ProReportOptions = {}
): string {
  const {
    includeTechnical = true,
    includeNarrative = true,
    includeAncestral = true,
    includeMythos = true
  } = options;

  const exportObj: Record<string, unknown> = {
    metadata: {
      version: '1.0',
      generatedAt: data.generatedAt?.toISOString() || new Date().toISOString(),
      reportTitle: data.reportTitle
    }
  };

  if (includeTechnical) {
    exportObj.technical = {
      chart: data.chart,
      luckPillars: data.luckPillars,
      annualAnalysis: data.annualAnalysis,
      interactions: data.interactions,
      usefulGod: data.usefulGod,
      annoyingGod: data.annoyingGod
    };
  }

  if (includeNarrative && data.narrativeCockpit) {
    exportObj.narrative = {
      storyBeatCount: data.narrativeCockpit.storyBeats?.length || 0,
      storyBeats: data.narrativeCockpit.storyBeats,
      emotionalArc: data.narrativeCockpit.emotionalArc
    };
  }

  if (includeAncestral && data.ancestral) {
    exportObj.ancestral = data.ancestral;
  }

  if (includeMythos && data.mythos) {
    exportObj.mythos = {
      archetypeCount: data.mythos.archetypes.length,
      archetypes: data.mythos.archetypes.map(a => ({
        id: a.id,
        name: a.name,
        nameZh: a.nameZh,
        themes: a.themes
      }))
    };
  }

  return JSON.stringify(exportObj, null, 2);
}

// ==================== CONVENIENCE FUNCTIONS ====================

/**
 * Export Pro Report in specified format
 */
export function exportProReport(
  data: ProReportData,
  options: ProReportOptions = {}
): string {
  const { format = 'markdown' } = options;

  switch (format) {
    case 'html':
      return exportProReportHtml(data, options);
    case 'json':
      return exportProReportJson(data, options);
    case 'markdown':
    default:
      return exportProReportMarkdown(data, options);
  }
}

/**
 * Get export filename
 */
export function getProReportFilename(
  data: ProReportData,
  format: ProReportOptions['format'] = 'markdown'
): string {
  const name = data.chart.name || 'report';
  const date = new Date().toISOString().split('T')[0];
  const ext = format === 'html' ? '.html' : format === 'json' ? '.json' : '.md';
  return `bazi-pro-report-${name}-${date}${ext}`;
}

/**
 * Get MIME type
 */
export function getProReportMimeType(format: ProReportOptions['format'] = 'markdown'): string {
  switch (format) {
    case 'html': return 'text/html';
    case 'json': return 'application/json';
    case 'markdown':
    default: return 'text/markdown';
  }
}

// ==================== EXPORTS ====================

export {
  exportProReportMarkdown,
  exportProReportHtml,
  exportProReportJson,
  exportProReport,
  getProReportFilename,
  getProReportMimeType
};
