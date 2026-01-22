/**
 * ============================================
 * PERSONA NARRATIVE RENDERER
 * Transforms Codex entries into first-person
 * cathedral voice narratives
 * ============================================
 */

import { CodexEntry, KnowledgeCodex, CodexCategory } from './codexTypes';

/**
 * Render all persona narratives from Codex entries
 */
export function renderPersonaNarrative(entries: CodexEntry[]): string[] {
  return entries.map((entry) => {
    const { rule, explanation, personaHook } = entry;
    return [
      `【${explanation.title}】`,
      '',
      personaHook,
      '',
      `（源规则：${rule.id} – ${rule.name}）`
    ].join('\n');
  });
}

/**
 * Render a complete persona reading from the Knowledge Codex
 */
export function renderCompletePersonaReading(codex: KnowledgeCodex): string {
  const sections: string[] = [];

  // Opening
  sections.push('═══════════════════════════════════════');
  sections.push('        命理知识宝典 · KNOWLEDGE CODEX');
  sections.push('═══════════════════════════════════════');
  sections.push('');
  sections.push(codex.openingNarrative);
  sections.push('');

  // Group entries by category
  const byCategory = groupEntriesByCategory(codex.entries);

  // Render each category section
  const categoryOrder: CodexCategory[] = [
    'structure', 'seasonal', 'useful_god', 'combination',
    'clash', 'harm', 'punishment', 'hidden_stem', 'luck_pillar', 'shen_sha'
  ];

  for (const category of categoryOrder) {
    const entries = byCategory[category];
    if (!entries || entries.length === 0) continue;

    sections.push('───────────────────────────────────────');
    sections.push(`  ${getCategoryHeader(category)}`);
    sections.push('───────────────────────────────────────');
    sections.push('');

    for (const entry of entries) {
      sections.push(`【${entry.explanation.title}】`);
      sections.push('');
      sections.push(entry.personaHook);
      sections.push('');

      if (entry.explanation.interpretation) {
        sections.push(`  ▸ ${entry.explanation.interpretation}`);
        sections.push('');
      }

      if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
        sections.push('  建议 Recommendations:');
        for (const rec of entry.explanation.recommendations) {
          sections.push(`    • ${rec}`);
        }
        sections.push('');
      }
    }
  }

  // Closing
  sections.push('═══════════════════════════════════════');
  sections.push('');
  sections.push(codex.closingNarrative);
  sections.push('');
  sections.push('═══════════════════════════════════════');

  return sections.join('\n');
}

/**
 * Render a short summary persona narrative
 */
export function renderPersonaSummary(codex: KnowledgeCodex): string {
  const summary = codex.summary;
  const topEntries = codex.entries
    .sort((a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity))
    .slice(0, 5);

  const lines: string[] = [];

  lines.push(`共发现 ${summary.totalFindings} 条命理要点：`);
  lines.push('');

  for (const entry of topEntries) {
    const icon = entry.iconHint || '•';
    lines.push(`${icon} ${entry.explanation.title}`);
    lines.push(`   ${truncate(entry.personaHook, 50)}`);
    lines.push('');
  }

  if (codex.entries.length > 5) {
    lines.push(`... 及其他 ${codex.entries.length - 5} 条发现`);
  }

  return lines.join('\n');
}

/**
 * Render persona narrative for a single entry
 */
export function renderSingleEntryNarrative(entry: CodexEntry): string {
  const lines: string[] = [];

  lines.push(`${entry.iconHint || '◆'} ${entry.explanation.title}`);
  lines.push('');
  lines.push(entry.personaHook);
  lines.push('');

  if (entry.personaHookChinese) {
    lines.push(`「${entry.personaHookChinese}」`);
    lines.push('');
  }

  lines.push('───────────');
  lines.push('');
  lines.push(`概述: ${entry.explanation.summary}`);
  lines.push('');
  lines.push(`解读: ${entry.explanation.interpretation}`);

  if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
    lines.push('');
    lines.push('建议:');
    for (const rec of entry.explanation.recommendations) {
      lines.push(`  • ${rec}`);
    }
  }

  if (entry.explanation.warnings && entry.explanation.warnings.length > 0) {
    lines.push('');
    lines.push('注意:');
    for (const warning of entry.explanation.warnings) {
      lines.push(`  ⚠ ${warning}`);
    }
  }

  return lines.join('\n');
}

/**
 * Render Luna's voice for a specific insight
 */
export function renderLunaVoice(entry: CodexEntry): string {
  const severityIntro: Record<string, string> = {
    'info': '我来为你解读这一点：',
    'minor': '这里有一个小发现值得注意：',
    'moderate': '这是一个重要的发现：',
    'significant': '请特别留意这一点：',
    'major': '这是一个关键的发现，请仔细聆听：'
  };

  const intro = severityIntro[entry.severity] || '让我来告诉你：';

  return [
    intro,
    '',
    entry.personaHook,
    '',
    entry.explanation.interpretation
  ].join('\n');
}

// ==================== HELPER FUNCTIONS ====================

function groupEntriesByCategory(entries: CodexEntry[]): Record<CodexCategory, CodexEntry[]> {
  const grouped: Record<string, CodexEntry[]> = {};

  for (const entry of entries) {
    const cat = entry.rule.category;
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(entry);
  }

  return grouped as Record<CodexCategory, CodexEntry[]>;
}

function getCategoryHeader(category: CodexCategory): string {
  const headers: Record<CodexCategory, string> = {
    'structure': '格局殿 · STRUCTURE CHAMBER',
    'seasonal': '五行风廊 · ELEMENTAL WINDS',
    'useful_god': '用神圣殿 · USEFUL GOD SANCTUARY',
    'combination': '合化之厅 · COMBINATIONS HALL',
    'clash': '冲刑之庭 · CLASH COURT',
    'harm': '六害之角 · HARM CORNER',
    'punishment': '刑罚之室 · PUNISHMENT CHAMBER',
    'hidden_stem': '藏干之窟 · HIDDEN ROOTS CRYPT',
    'luck_pillar': '大运长廊 · DAYUN CORRIDOR',
    'shen_sha': '神煞阁 · STAR PAVILION'
  };

  return headers[category] || category.toUpperCase();
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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate voice-ready text for text-to-speech
 */
export function generateVoiceReadyText(codex: KnowledgeCodex): string[] {
  const utterances: string[] = [];

  // Opening
  utterances.push('欢迎来到命理知识宝典。让我为你解读命盘中的发现。');

  // Top findings
  const topEntries = codex.entries
    .sort((a, b) => getSeverityWeight(b.severity) - getSeverityWeight(a.severity))
    .slice(0, 3);

  for (const entry of topEntries) {
    utterances.push(entry.personaHook);

    if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
      utterances.push(`建议：${entry.explanation.recommendations[0]}`);
    }
  }

  // Closing
  utterances.push('记住：命盘揭示的是倾向而非定数。你的觉察将命运转化为选择。');

  return utterances;
}
