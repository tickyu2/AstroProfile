/**
 * ============================================
 * KNOWLEDGE CODEX MARKDOWN TEMPLATES
 * Generate elegant, ceremonial Markdown pages
 * from Codex entries
 * ============================================
 */

import { CodexEntry, KnowledgeCodex, JourneyChamber } from '../codexTypes';

/**
 * Generate Markdown for a single Codex entry
 */
export function renderCodexEntryMarkdown(entry: CodexEntry): string {
  const lines: string[] = [];

  // Title block
  lines.push(`# ${entry.explanation.title}`);
  lines.push(`**Rule ID:** \`${entry.rule.id}\`  `);
  lines.push(`**Category:** ${formatCategory(entry.rule.category)}  `);
  lines.push(`**Severity:** ${formatSeverity(entry.severity)}  `);
  lines.push(`**Effect:** ${formatEffect(entry.effect)}  `);
  lines.push(`**Icon:** ${entry.iconHint || '◆'}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary
  lines.push('## 1. Summary  ');
  lines.push(entry.explanation.summary);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Technical Detail
  lines.push('## 2. Technical Detail (Classical Theory)  ');
  lines.push(entry.explanation.technicalDetail);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Interpretation
  lines.push('## 3. Interpretation (Life Manifestation)  ');
  lines.push(entry.explanation.interpretation);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Recommendations
  lines.push('## 4. Recommendations  ');
  if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
    for (const rec of entry.explanation.recommendations) {
      lines.push(`- ${rec}`);
    }
  } else {
    lines.push('*No specific recommendations*');
  }
  lines.push('');

  // Warnings (if any)
  if (entry.explanation.warnings && entry.explanation.warnings.length > 0) {
    lines.push('### ⚠️ Warnings');
    for (const warning of entry.explanation.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Persona Layer Voice
  lines.push('## 5. Persona Layer Voice  ');
  lines.push(`> ${entry.personaHook}`);
  lines.push('');

  if (entry.personaHookChinese) {
    lines.push(`> 「${entry.personaHookChinese}」`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Pilgrim Journey Hint
  lines.push('## 6. Pilgrim Journey Hint  ');
  lines.push(entry.journeyStepHint);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Metadata
  lines.push('## 7. Metadata  ');
  lines.push(`- Priority: ${entry.rule.priority}  `);
  lines.push(`- Source: Knowledge Codex  `);
  lines.push(`- Chamber: ${getChamberForCategory(entry.rule.category)}  `);
  lines.push(`- Confidence: ${(entry.confidence * 100).toFixed(0)}%`);

  return lines.join('\n');
}

/**
 * Generate complete Codex document with all entries
 */
export function renderFullCodexMarkdown(codex: KnowledgeCodex): string {
  const lines: string[] = [];

  // Document header
  lines.push('# 命理知识宝典 · Knowledge Codex');
  lines.push('');
  lines.push(`*Generated: ${new Date().toISOString()}*`);
  if (codex.chartId) {
    lines.push(`*Chart ID: ${codex.chartId}*`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary section
  lines.push('## Overview');
  lines.push('');
  lines.push(`**Total Findings:** ${codex.summary.totalFindings}  `);
  lines.push(`**Overall Tone:** ${codex.summary.overallTone}  `);
  lines.push('');
  lines.push('### Findings by Category');
  lines.push('');
  for (const [category, count] of Object.entries(codex.summary.byCategory)) {
    if (count > 0) {
      lines.push(`- **${formatCategory(category)}:** ${count}`);
    }
  }
  lines.push('');
  lines.push('### Findings by Severity');
  lines.push('');
  for (const [severity, count] of Object.entries(codex.summary.bySeverity)) {
    if (count > 0) {
      lines.push(`- **${formatSeverity(severity)}:** ${count}`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Opening narrative
  lines.push('## Cathedral Voice — Opening');
  lines.push('');
  lines.push(codex.openingNarrative);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Group entries by category
  const byCategory = groupByCategory(codex.entries);
  const categoryOrder = [
    'structure', 'seasonal', 'useful_god', 'combination',
    'clash', 'harm', 'punishment', 'hidden_stem', 'luck_pillar', 'shen_sha'
  ];

  for (const category of categoryOrder) {
    const entries = byCategory[category];
    if (!entries || entries.length === 0) continue;

    lines.push(`## ${formatCategory(category)}`);
    lines.push('');

    for (const entry of entries) {
      lines.push('---');
      lines.push('');
      lines.push(renderCodexEntryMarkdown(entry));
      lines.push('');
    }
  }

  // Closing narrative
  lines.push('---');
  lines.push('');
  lines.push('## Cathedral Voice — Closing');
  lines.push('');
  lines.push(codex.closingNarrative);

  return lines.join('\n');
}

/**
 * Generate index page listing all available entries
 */
export function renderCodexIndexMarkdown(codex: KnowledgeCodex): string {
  const lines: string[] = [];

  lines.push('# Knowledge Codex — Index');
  lines.push('');
  lines.push(`*${codex.summary.totalFindings} findings across ${Object.keys(codex.summary.byCategory).filter(k => codex.summary.byCategory[k as keyof typeof codex.summary.byCategory] > 0).length} chambers*`);
  lines.push('');

  const byCategory = groupByCategory(codex.entries);
  const categoryOrder = [
    'structure', 'seasonal', 'useful_god', 'combination',
    'clash', 'harm', 'punishment', 'hidden_stem', 'luck_pillar', 'shen_sha'
  ];

  for (const category of categoryOrder) {
    const entries = byCategory[category];
    if (!entries || entries.length === 0) continue;

    lines.push(`## ${formatCategory(category)}`);
    lines.push('');
    for (const entry of entries) {
      const severityIcon = getSeverityIcon(entry.severity);
      lines.push(`- ${severityIcon} [${entry.explanation.title}](#${slugify(entry.rule.id)})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ==================== HELPER FUNCTIONS ====================

function formatCategory(category: string): string {
  const map: Record<string, string> = {
    'structure': '格局殿 · Structure Chamber',
    'seasonal': '五行风廊 · Elemental Winds',
    'useful_god': '用神圣殿 · Useful God Sanctuary',
    'combination': '合化之厅 · Combinations Hall',
    'clash': '冲刑之庭 · Clash Court',
    'harm': '六害之角 · Harm Corner',
    'punishment': '刑罚之室 · Punishment Chamber',
    'hidden_stem': '藏干之窟 · Hidden Roots Crypt',
    'luck_pillar': '大运长廊 · DaYun Corridor',
    'shen_sha': '神煞阁 · Star Pavilion'
  };
  return map[category] || category;
}

function formatSeverity(severity: string): string {
  const map: Record<string, string> = {
    'major': '🔴 Major',
    'significant': '🟠 Significant',
    'moderate': '🟡 Moderate',
    'minor': '🟢 Minor',
    'info': '🔵 Info'
  };
  return map[severity] || severity;
}

function formatEffect(effect: string): string {
  const map: Record<string, string> = {
    'beneficial': '✅ Beneficial',
    'challenging': '⚠️ Challenging',
    'mixed': '☯️ Mixed',
    'neutral': '◻️ Neutral'
  };
  return map[effect] || effect;
}

function getSeverityIcon(severity: string): string {
  const map: Record<string, string> = {
    'major': '🔴',
    'significant': '🟠',
    'moderate': '🟡',
    'minor': '🟢',
    'info': '🔵'
  };
  return map[severity] || '◆';
}

function getChamberForCategory(category: string): string {
  const map: Record<string, string> = {
    'structure': 'Structure Chamber',
    'seasonal': 'Elemental Winds',
    'useful_god': 'Useful God Sanctuary',
    'combination': 'Combinations Hall',
    'clash': 'Clash Court',
    'harm': 'Harm Corner',
    'punishment': 'Punishment Chamber',
    'hidden_stem': 'Hidden Roots Crypt',
    'luck_pillar': 'DaYun Corridor',
    'shen_sha': 'Star Pavilion'
  };
  return map[category] || 'Unknown Chamber';
}

function groupByCategory(entries: CodexEntry[]): Record<string, CodexEntry[]> {
  const result: Record<string, CodexEntry[]> = {};
  for (const entry of entries) {
    const cat = entry.rule.category;
    if (!result[cat]) result[cat] = [];
    result[cat].push(entry);
  }
  return result;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export {
  formatCategory,
  formatSeverity,
  formatEffect,
  getSeverityIcon,
  getChamberForCategory
};
