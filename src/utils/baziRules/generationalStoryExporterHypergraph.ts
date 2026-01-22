/**
 * ============================================
 * GENERATIONAL STORY EXPORTER (HYPERGRAPH EDITION)
 * Exports complete lineage stories including:
 * - Generational ladder
 * - Threads
 * - Arcs
 * - Hypergraph connections
 * - Archetype narratives
 * - Dialogue resonance
 * - Ritual timing
 *
 * Produces a mythic generational scripture.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread } from './generationalLadder';
import { ArcSynthesis, GenerationalArc } from './generationalArcSynth';
import { MythosHypergraph, HypergraphNode, HypergraphEdge } from './mythosHypergraph';
import { MythosNarrative } from './mythosNarrativeGenerator';
import { ResonantDialogue } from './advancedDialogue';
import { AncestralArchetype } from './mythosLayer';

// ==================== DATA MODEL ====================

export interface HypergraphExportData {
  ladder: GenerationalLadder;
  arcs?: ArcSynthesis;
  hypergraph?: MythosHypergraph;
  narratives?: MythosNarrative[];
  dialogues?: ResonantDialogue[];
  archetypes?: AncestralArchetype[];
  pilgrimName?: string;
}

export interface ExportOptions {
  includeHypergraph?: boolean;
  includeArcs?: boolean;
  includeNarratives?: boolean;
  includeDialogues?: boolean;
  format?: 'markdown' | 'html' | 'json';
  lang?: 'en' | 'zh';
}

// ==================== MARKDOWN EXPORT ====================

/**
 * Export generational story as markdown (hypergraph edition)
 */
export function exportGenerationalStoryHypergraphMarkdown(
  data: HypergraphExportData,
  options: ExportOptions = {}
): string {
  const {
    includeHypergraph = true,
    includeArcs = true,
    includeNarratives = true,
    includeDialogues = false,
    lang = 'en'
  } = options;

  const lines: string[] = [];

  // Header
  lines.push(`# ${lang === 'zh' ? '🕍 代际故事（超图版）' : '🕍 Generational Story (Hypergraph Edition)'}`);
  lines.push('');
  lines.push(`## ${lang === 'zh' ? '血脉' : 'Lineage'}: ${data.ladder.lineageId}`);
  if (data.pilgrimName) {
    lines.push(`${lang === 'zh' ? '行者' : 'Pilgrim'}: ${data.pilgrimName}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // I. Generational Ladder
  lines.push(`## I. ${lang === 'zh' ? '代际阶梯' : 'Generational Ladder'}`);
  lines.push('');
  data.ladder.generations.forEach(gen => {
    const storyBeatCount = gen.groupNarrative?.storyBeats?.length || 0;
    const themes = gen.groupNarrative?.storyBeats?.flatMap(b => b.dominantThemes || []) || [];
    const uniqueThemes = [...new Set(themes)];

    lines.push(`### ${lang === 'zh' ? '第' : 'Generation '}${gen.generationIndex}${lang === 'zh' ? '代' : ''} — ${gen.label}`);
    lines.push(`${lang === 'zh' ? '故事节拍' : 'Story beats'}: ${storyBeatCount}`);
    if (uniqueThemes.length > 0) {
      lines.push(`${lang === 'zh' ? '主题' : 'Themes'}: ${uniqueThemes.join(', ')}`);
    }
    lines.push('');
  });
  lines.push('---');
  lines.push('');

  // II. Generational Arcs
  if (includeArcs && data.arcs) {
    lines.push(`## II. ${lang === 'zh' ? '代际弧线' : 'Generational Arcs'}`);
    lines.push('');
    data.arcs.arcs.forEach(arc => {
      lines.push(`### ${arc.theme}`);
      lines.push(`${lang === 'zh' ? '弧线类型' : 'Arc Type'}: ${arc.arcType}`);
      lines.push(`${lang === 'zh' ? '代数' : 'Generations'}: ${arc.generations.join(' → ')}`);
      lines.push(`${lang === 'zh' ? arc.summaryZh : arc.summary}`);
      lines.push('');
    });
    lines.push('---');
    lines.push('');
  }

  // III. Mythos Hypergraph
  if (includeHypergraph && data.hypergraph) {
    lines.push(`## III. ${lang === 'zh' ? '神话超图' : 'Mythos Hypergraph'}`);
    lines.push('');
    lines.push(`${lang === 'zh' ? '节点数' : 'Nodes'}: ${data.hypergraph.nodes.length}`);
    lines.push(`${lang === 'zh' ? '连接数' : 'Edges'}: ${data.hypergraph.edges.length}`);
    lines.push(`${lang === 'zh' ? '密度' : 'Density'}: ${(data.hypergraph.metadata.density * 100).toFixed(1)}%`);
    lines.push('');

    // List archetypes and their connections
    const archetypeNodes = data.hypergraph.nodes.filter(n => n.type === 'archetype');
    lines.push(`### ${lang === 'zh' ? '原型' : 'Archetypes'}`);
    archetypeNodes.forEach(node => {
      const label = lang === 'zh' && node.labelZh ? node.labelZh : node.label;
      const connections = data.hypergraph!.edges.filter(e => e.from === node.id || e.to === node.id);
      lines.push(`- **${label}** (${connections.length} ${lang === 'zh' ? '连接' : 'connections'})`);
    });
    lines.push('');

    // Theme connections
    const sharedThemeEdges = data.hypergraph.edges.filter(e => e.relation === 'shares_theme');
    if (sharedThemeEdges.length > 0) {
      lines.push(`### ${lang === 'zh' ? '共享主题连接' : 'Shared Theme Connections'}`);
      sharedThemeEdges.slice(0, 10).forEach(edge => {
        const fromNode = data.hypergraph!.nodes.find(n => n.id === edge.from);
        const toNode = data.hypergraph!.nodes.find(n => n.id === edge.to);
        if (fromNode && toNode) {
          lines.push(`- ${fromNode.label} ↔ ${toNode.label}`);
        }
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // IV. Archetype Narratives
  if (includeNarratives && data.narratives && data.narratives.length > 0) {
    lines.push(`## IV. ${lang === 'zh' ? '原型叙事' : 'Archetype Narratives'}`);
    lines.push('');
    data.narratives.forEach(narrative => {
      const title = lang === 'zh' ? narrative.titleZh : narrative.title;
      const story = lang === 'zh' ? narrative.storyZh : narrative.story;
      const symbolism = lang === 'zh' ? narrative.symbolismZh : narrative.symbolism;
      const guidance = lang === 'zh' ? narrative.guidanceZh : narrative.guidance;

      lines.push(`### ${title}`);
      lines.push('');
      lines.push(story);
      lines.push('');
      lines.push(`**${lang === 'zh' ? '象征' : 'Symbolism'}:**`);
      symbolism.forEach(s => lines.push(`- ${s}`));
      lines.push('');
      lines.push(`**${lang === 'zh' ? '指引' : 'Guidance'}:**`);
      lines.push(guidance);
      lines.push('');
    });
    lines.push('---');
    lines.push('');
  }

  // V. Dialogue Resonance
  if (includeDialogues && data.dialogues && data.dialogues.length > 0) {
    lines.push(`## V. ${lang === 'zh' ? '对话共鸣' : 'Dialogue Resonance'}`);
    lines.push('');
    data.dialogues.forEach((dialogue, idx) => {
      lines.push(`### ${lang === 'zh' ? '对话' : 'Dialogue'} ${idx + 1}`);
      lines.push(`${lang === 'zh' ? '整体共鸣' : 'Overall Resonance'}: ${dialogue.overallResonance}%`);
      lines.push(`${lang === 'zh' ? '主题' : 'Themes'}: ${dialogue.themes.join(', ')}`);
      lines.push('');

      dialogue.turns.forEach(turn => {
        const text = lang === 'zh' ? turn.textZh : turn.text;
        const speaker = turn.speaker === 'ancestor'
          ? (lang === 'zh' ? '祖先' : 'Ancestor')
          : turn.speaker === 'pilgrim'
            ? (lang === 'zh' ? '行者' : 'Pilgrim')
            : 'Luna';
        lines.push(`> **${speaker}** [${turn.emotion.tone}]: ${text}`);
      });
      lines.push('');
    });
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(`*${lang === 'zh' ? '生成于' : 'Generated on'} ${new Date().toISOString()}*`);

  return lines.join('\n');
}

// ==================== HTML EXPORT ====================

/**
 * Export generational story as HTML (hypergraph edition)
 */
export function exportGenerationalStoryHypergraphHtml(
  data: HypergraphExportData,
  options: ExportOptions = {}
): string {
  const { lang = 'en' } = options;
  const markdown = exportGenerationalStoryHypergraphMarkdown(data, options);

  // Simple markdown to HTML conversion
  const htmlContent = markdownToHtml(markdown);

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === 'zh' ? '代际故事（超图版）' : 'Generational Story (Hypergraph Edition)'}</title>
  <style>
    ${getExportStyles()}
  </style>
</head>
<body>
  <div class="story-container">
    ${htmlContent}
  </div>
</body>
</html>
  `.trim();
}

/**
 * Simple markdown to HTML converter
 */
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Wrap in paragraph
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return `<p>${match}</p>`;
    });
}

/**
 * Get export styles
 */
function getExportStyles(): string {
  return `
body {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background: #f9f7f3;
  color: #3a3a3a;
  line-height: 1.7;
  margin: 0;
  padding: 0;
}

.story-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
}

h1 {
  font-size: 2rem;
  color: #5a4a3a;
  border-bottom: 3px double #d4c5a9;
  padding-bottom: 12px;
  margin-bottom: 24px;
}

h2 {
  font-size: 1.5rem;
  color: #6a5a4a;
  margin-top: 32px;
  border-left: 4px solid #b8a888;
  padding-left: 12px;
}

h3 {
  font-size: 1.2rem;
  color: #7a6a5a;
  margin-top: 24px;
}

p {
  margin: 12px 0;
}

ul, ol {
  margin: 12px 0;
  padding-left: 24px;
}

li {
  margin: 6px 0;
}

blockquote {
  border-left: 3px solid #d4c5a9;
  margin: 16px 0;
  padding: 12px 16px;
  background: #fffef9;
  font-style: italic;
}

hr {
  border: none;
  border-top: 2px solid #e0d8c8;
  margin: 32px 0;
}

strong {
  color: #5a4a3a;
}

em {
  color: #7a6a5a;
}
  `.trim();
}

// ==================== JSON EXPORT ====================

/**
 * Export generational story as JSON (hypergraph edition)
 */
export function exportGenerationalStoryHypergraphJson(
  data: HypergraphExportData,
  options: ExportOptions = {}
): string {
  const exportObj = {
    metadata: {
      version: '2.0-hypergraph',
      exportedAt: new Date().toISOString(),
      lineageId: data.ladder.lineageId,
      pilgrimName: data.pilgrimName
    },
    ladder: {
      generations: data.ladder.generations.map(gen => ({
        index: gen.generationIndex,
        label: gen.label,
        storyBeatCount: gen.groupNarrative?.storyBeats?.length || 0
      }))
    },
    arcs: data.arcs ? {
      count: data.arcs.arcs.length,
      overallTrajectory: data.arcs.overallTrajectory,
      arcs: data.arcs.arcs.map(arc => ({
        theme: arc.theme,
        type: arc.arcType,
        generations: arc.generations
      }))
    } : null,
    hypergraph: data.hypergraph ? {
      nodeCount: data.hypergraph.nodes.length,
      edgeCount: data.hypergraph.edges.length,
      density: data.hypergraph.metadata.density,
      archetypeNodes: data.hypergraph.nodes
        .filter(n => n.type === 'archetype')
        .map(n => ({ id: n.id, label: n.label }))
    } : null,
    narratives: data.narratives ? data.narratives.map(n => ({
      id: n.id,
      title: n.title,
      type: n.narrativeType
    })) : null,
    dialogues: data.dialogues ? data.dialogues.map(d => ({
      id: d.id,
      resonance: d.overallResonance,
      themes: d.themes,
      turnCount: d.turns.length
    })) : null
  };

  return JSON.stringify(exportObj, null, 2);
}

// ==================== CONVENIENCE FUNCTIONS ====================

/**
 * Export in specified format
 */
export function exportGenerationalStoryHypergraph(
  data: HypergraphExportData,
  options: ExportOptions = {}
): string {
  const { format = 'markdown' } = options;

  switch (format) {
    case 'html':
      return exportGenerationalStoryHypergraphHtml(data, options);
    case 'json':
      return exportGenerationalStoryHypergraphJson(data, options);
    case 'markdown':
    default:
      return exportGenerationalStoryHypergraphMarkdown(data, options);
  }
}

/**
 * Get export file extension
 */
export function getExportFileExtension(format: ExportOptions['format'] = 'markdown'): string {
  switch (format) {
    case 'html': return '.html';
    case 'json': return '.json';
    case 'markdown':
    default: return '.md';
  }
}

/**
 * Get export MIME type
 */
export function getExportMimeType(format: ExportOptions['format'] = 'markdown'): string {
  switch (format) {
    case 'html': return 'text/html';
    case 'json': return 'application/json';
    case 'markdown':
    default: return 'text/markdown';
  }
}

// ==================== EXPORTS ====================

export {
  exportGenerationalStoryHypergraphMarkdown,
  exportGenerationalStoryHypergraphHtml,
  exportGenerationalStoryHypergraphJson,
  exportGenerationalStoryHypergraph,
  getExportFileExtension,
  getExportMimeType
};
