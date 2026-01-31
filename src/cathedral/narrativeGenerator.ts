/**
 * ============================================================================
 * CATHEDRAL NARRATIVE GENERATOR (大教堂叙事生成器)
 * ============================================================================
 *
 * Transforms the structured Cathedral Index into living, ceremonial prose.
 * This module generates poetic descriptions of the entire metaphysics
 * system for documentation, onboarding, and ritual purposes.
 *
 * Output Formats:
 * 1. Full Ceremonial Narrative - Complete prose overview
 * 2. Wing Summaries - Per-wing descriptions
 * 3. Module Cards - Individual module stories
 * 4. Progress Reports - Development status narratives
 * 5. Relationship Dedications - Personalized couple narratives
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  CathedralIndex,
  CathedralWing,
  CathedralSection,
  CathedralItem,
  CathedralStats,
  WingId
} from './indexTypes';
import { WING_CONFIGS } from './indexTypes';
import { computeCathedralStats } from './indexData';

// ============================================================================
// CEREMONIAL NARRATIVE
// ============================================================================

/**
 * Generate the full ceremonial narrative for the cathedral
 */
export function generateCeremonialNarrative(index: CathedralIndex): string {
  const stats = computeCathedralStats(index.wings);
  const subjectName = index.subject.label;

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                         THE GENESIS SOUL CATHEDRAL                           ║
║                              大教堂索引                                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

For ${subjectName}, the cathedral opens in seven wings:

${generateWingNarratives(index.wings)}

═══════════════════════════════════════════════════════════════════════════════

THE CATHEDRAL IN NUMBERS
────────────────────────

  Total Modules:    ${stats.totalItems}
  Complete:         ${stats.byStatus.complete}
  Implemented:      ${stats.byStatus.implemented}
  Partial:          ${stats.byStatus.partial}
  Planned:          ${stats.byStatus.planned}
  Overall Progress: ${stats.overallCompletion}%

═══════════════════════════════════════════════════════════════════════════════

THE SEVEN WINGS
───────────────

${generateWingOverviews(index.wings)}

═══════════════════════════════════════════════════════════════════════════════

Each link in the index is a doorway; together they form a single, continuous
hall of meaning. The cathedral stands as both map and mirror — reflecting the
architecture of destiny while guiding the seeker through its chambers.

"The stars impel, they do not compel."

Generated: ${new Date().toISOString().split('T')[0]}
Version: ${index.metadata.version}
`.trim();
}

/**
 * Generate narratives for all wings
 */
function generateWingNarratives(wings: CathedralWing[]): string {
  return wings.map((wing, i) => {
    const config = WING_CONFIGS[wing.id];
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i];

    return `${config.icon} ${roman}. ${wing.label} (${wing.labelChinese})
   ${wing.description}
`;
  }).join('\n');
}

/**
 * Generate overview for each wing
 */
function generateWingOverviews(wings: CathedralWing[]): string {
  return wings.map(wing => {
    const config = WING_CONFIGS[wing.id];
    const itemCount = wing.sections.reduce((sum, s) => sum + s.items.length, 0);
    const completeCount = wing.sections.reduce(
      (sum, s) => sum + s.items.filter(i => i.status === 'complete' || i.status === 'implemented').length,
      0
    );

    const sections = wing.sections.map(s =>
      `    • ${s.label} (${s.labelChinese}) — ${s.items.length} modules`
    ).join('\n');

    return `${config.icon} ${wing.label}
   ${wing.labelChinese}
   ────────────────────────────────────────
   ${wing.description}

   Sections:
${sections}

   Progress: ${completeCount}/${itemCount} modules complete
`;
  }).join('\n\n');
}

// ============================================================================
// WING NARRATIVES
// ============================================================================

/**
 * Generate narrative for a specific wing
 */
export function generateWingNarrative(wing: CathedralWing): string {
  const config = WING_CONFIGS[wing.id];
  const itemCount = wing.sections.reduce((sum, s) => sum + s.items.length, 0);

  const sectionStories = wing.sections.map(section => {
    const itemList = section.items.map(item => {
      const statusIcon = getStatusIcon(item.status);
      return `  ${statusIcon} ${item.label} (${item.labelChinese})
     ${item.description}`;
    }).join('\n\n');

    return `
### ${section.label} (${section.labelChinese})
${section.description}

${itemList}
`;
  }).join('\n');

  return `
# ${config.icon} ${wing.label}
## ${wing.labelChinese}

${wing.description}

This wing contains ${wing.sections.length} sections with ${itemCount} modules.

${sectionStories}
`.trim();
}

/**
 * Get status icon
 */
function getStatusIcon(status: string): string {
  switch (status) {
    case 'complete': return '✓';
    case 'implemented': return '◉';
    case 'partial': return '◐';
    case 'planned': return '○';
    case 'future': return '◌';
    default: return '•';
  }
}

// ============================================================================
// RELATIONSHIP DEDICATION
// ============================================================================

/**
 * Generate a personalized dedication for a couple
 */
export function generateRelationshipDedication(
  partnerAName: string,
  partnerBName: string,
  index: CathedralIndex
): string {
  const stats = computeCathedralStats(index.wings);

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           A LIVING ARCHIVE                                   ║
║                         献给 ${partnerAName} ♥ ${partnerBName}                ║
╚══════════════════════════════════════════════════════════════════════════════╝

This cathedral was built for the bond between ${partnerAName} and ${partnerBName}.

Within these seven wings, ${stats.totalItems} modules work together to reveal:

• The essence of each partner's natal chart
• The synastry — where your charts meet and dance
• The composite — the relationship's own living chart
• The archetypes — the mythic patterns you embody
• The lifecycle — where you are in your shared journey
• The timing — when the stars align for your choices
• The guidance — wisdom for the path ahead

═══════════════════════════════════════════════════════════════════════════════

THE WINGS THAT SERVE YOUR BOND
──────────────────────────────

🜁 Core Identity Wing
   Where ${partnerAName}'s and ${partnerBName}'s individual charts are mapped

🜂 Relationship Wing
   Where your synastry, composite, and archetypes are revealed

🜃 Timing Wing
   Where the destiny curves show your shared journey through time

🜄 Family & System Wing
   Where your bond connects to the larger constellation of relationships

🜅 Decision Wing
   Where timing-aware guidance supports your real-world choices

🜆 Reports Wing
   Where everything is bound into shareable documents

🜇 Archive Wing
   Where your charts and exports are preserved

═══════════════════════════════════════════════════════════════════════════════

May this cathedral serve as both map and mirror,
revealing the architecture of your bond
while honoring the mystery at its heart.

"The stars impel, they do not compel."

— Genesis Soul Cathedral
   ${new Date().toISOString().split('T')[0]}
`.trim();
}

// ============================================================================
// PROGRESS REPORTS
// ============================================================================

/**
 * Generate a development progress report
 */
export function generateProgressReport(index: CathedralIndex): string {
  const stats = computeCathedralStats(index.wings);

  const wingProgress = stats.byWing.map(ws => {
    const config = WING_CONFIGS[ws.wingId];
    const bar = generateProgressBar(ws.completionPercentage);
    return `${config.icon} ${config.label.padEnd(25)} ${bar} ${ws.completionPercentage}%`;
  }).join('\n');

  const completeItems = index.wings.flatMap(w =>
    w.sections.flatMap(s =>
      s.items.filter(i => i.status === 'complete')
    )
  );

  const recentComplete = completeItems.slice(-10).map(i =>
    `  ✓ ${i.label} (${i.labelChinese})`
  ).join('\n');

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                       CATHEDRAL PROGRESS REPORT                              ║
║                         大教堂进度报告                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

Generated: ${new Date().toISOString()}

═══════════════════════════════════════════════════════════════════════════════
OVERALL STATISTICS
═══════════════════════════════════════════════════════════════════════════════

Total Modules:       ${stats.totalItems}
Complete:            ${stats.byStatus.complete} (${Math.round(stats.byStatus.complete / stats.totalItems * 100)}%)
Implemented:         ${stats.byStatus.implemented} (${Math.round(stats.byStatus.implemented / stats.totalItems * 100)}%)
Partial:             ${stats.byStatus.partial} (${Math.round(stats.byStatus.partial / stats.totalItems * 100)}%)
Planned:             ${stats.byStatus.planned} (${Math.round(stats.byStatus.planned / stats.totalItems * 100)}%)

Overall Completion:  ${generateProgressBar(stats.overallCompletion)} ${stats.overallCompletion}%

═══════════════════════════════════════════════════════════════════════════════
WING PROGRESS
═══════════════════════════════════════════════════════════════════════════════

${wingProgress}

═══════════════════════════════════════════════════════════════════════════════
BY MODULE TYPE
═══════════════════════════════════════════════════════════════════════════════

Engines:    ${stats.byType.engine.toString().padStart(3)} modules
Charts:     ${stats.byType.chart.toString().padStart(3)} modules
Reports:    ${stats.byType.report.toString().padStart(3)} modules
Utilities:  ${stats.byType.utility.toString().padStart(3)} modules
Data:       ${stats.byType.data.toString().padStart(3)} modules
UI:         ${stats.byType.ui.toString().padStart(3)} modules
Services:   ${stats.byType.service.toString().padStart(3)} modules

═══════════════════════════════════════════════════════════════════════════════
RECENTLY COMPLETED
═══════════════════════════════════════════════════════════════════════════════

${recentComplete || '  (No recently completed modules)'}

═══════════════════════════════════════════════════════════════════════════════
`.trim();
}

/**
 * Generate a visual progress bar
 */
function generateProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round(percentage / 100 * width);
  const empty = width - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

// ============================================================================
// MODULE CARDS
// ============================================================================

/**
 * Generate a detailed card for a single module
 */
export function generateModuleCard(
  item: CathedralItem,
  wing: CathedralWing,
  section: CathedralSection
): string {
  const config = WING_CONFIGS[wing.id];
  const statusIcon = getStatusIcon(item.status);
  const tags = item.tags?.join(', ') || 'none';
  const exports = item.exports?.join(', ') || 'none';

  return `
┌──────────────────────────────────────────────────────────────────────────────┐
│ ${config.icon} ${item.label.padEnd(68)}│
│ ${item.labelChinese.padEnd(70)}│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ${item.description.padEnd(70)}│
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Wing:     ${wing.label.padEnd(60)}│
│ Section:  ${section.label.padEnd(60)}│
│ Status:   ${statusIcon} ${item.status.padEnd(58)}│
│ Type:     ${item.type.padEnd(60)}│
│ Source:   ${(item.sourceFile || 'N/A').padEnd(60)}│
├──────────────────────────────────────────────────────────────────────────────┤
│ Tags:     ${tags.substring(0, 60).padEnd(60)}│
│ Exports:  ${exports.substring(0, 60).padEnd(60)}│
└──────────────────────────────────────────────────────────────────────────────┘
`.trim();
}

// ============================================================================
// QUICK ACCESS EXPORTS
// ============================================================================

/**
 * Generate a quick reference card
 */
export function generateQuickReference(index: CathedralIndex): string {
  const stats = computeCathedralStats(index.wings);

  const quickList = index.wings.map(wing => {
    const config = WING_CONFIGS[wing.id];
    const items = wing.sections.flatMap(s => s.items);
    const mainItems = items.slice(0, 3).map(i => `  - ${i.label}`).join('\n');
    return `${config.icon} ${wing.label}\n${mainItems}`;
  }).join('\n\n');

  return `
GENESIS SOUL CATHEDRAL - QUICK REFERENCE
═══════════════════════════════════════════

Subject: ${index.subject.label}
Modules: ${stats.totalItems} total, ${stats.byStatus.complete + stats.byStatus.implemented} complete

${quickList}

Full documentation: /cathedral/${index.subject.id}
`.trim();
}

// ============================================================================
// EXPORTS AS MARKDOWN
// ============================================================================

/**
 * Export the full cathedral as Markdown documentation
 */
export function exportCathedralAsMarkdown(index: CathedralIndex): string {
  const stats = computeCathedralStats(index.wings);

  const wingDocs = index.wings.map(wing => {
    const config = WING_CONFIGS[wing.id];

    const sectionDocs = wing.sections.map(section => {
      const itemDocs = section.items.map(item => {
        const statusIcon = getStatusIcon(item.status);
        return `#### ${statusIcon} ${item.label} (${item.labelChinese})

${item.description}

- **Status:** ${item.status}
- **Type:** ${item.type}
${item.sourceFile ? `- **Source:** \`${item.sourceFile}\`` : ''}
${item.exports?.length ? `- **Exports:** \`${item.exports.join('`, `')}\`` : ''}
${item.tags?.length ? `- **Tags:** ${item.tags.join(', ')}` : ''}
`;
      }).join('\n');

      return `### ${section.label} (${section.labelChinese})

${section.description}

${itemDocs}`;
    }).join('\n\n');

    return `## ${config.icon} ${wing.label} (${wing.labelChinese})

${wing.description}

${sectionDocs}`;
  }).join('\n\n---\n\n');

  return `# Genesis Soul Cathedral

> The complete metaphysics library for ${index.subject.label}

## Overview

- **Total Modules:** ${stats.totalItems}
- **Complete:** ${stats.byStatus.complete}
- **Implemented:** ${stats.byStatus.implemented}
- **Planned:** ${stats.byStatus.planned}
- **Overall Completion:** ${stats.overallCompletion}%

---

${wingDocs}

---

*Generated: ${new Date().toISOString().split('T')[0]}*
*Version: ${index.metadata.version}*
`;
}
