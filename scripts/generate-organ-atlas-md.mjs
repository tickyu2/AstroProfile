// One-shot generator: reads the canonical organ Atlas JS sources and emits
// a single Markdown handoff document for downstream AI collaborators.
import { writeFileSync } from 'node:fs';
import { ORGAN_NARRATIVES } from '../src/data/organNarratives.js';
import { MACRO_SYSTEMS, COSMOGRAM_ROWS, GRAND_NARRATIVE, SYSTEM_TRANSITIONS } from '../src/data/organCosmogram.js';

const out = [];
const push = (s = '') => out.push(s);

push('# Organ Atlas — Full Matrix');
push('');
push('_Auto-generated from `src/data/organNarratives.js` + `src/data/organCosmogram.js`. Do not hand-edit — regenerate via `scripts/generate-organ-atlas-md.mjs`._');
push('');
push('**Source of truth:** the 1,296-panel Zodiac Body Atlas. 36 rows × 36 columns, each cell an organ×organ narrative panel with hybrid score, tier, mythic name, felt sense, attachment pattern, stress response, and cognitive layer.');
push('');
push('---');
push('');

// ── Master index ────────────────────────────────────────────────────────
push('## Master Row Index — Row → Organ (Canonical)');
push('');
push('| Row | Organ | Archetype | Identity |');
push('|----:|-------|-----------|----------|');
for (const row of ORGAN_NARRATIVES) {
  push(`| ${row.rowIndex} | ${row.rowOrgan} | ${row.rowArchetype || '—'} | ${row.rowIdentity || '—'} |`);
}
push('');
push('---');
push('');

// ── Cosmogram: macro-systems ────────────────────────────────────────────
push('## The 36-Row Cosmogram — Macro-Architecture');
push('');
push('36 organ-rows grouped into 6 macro-systems. Each macro-system is a self-contained chapter that interlocks with the others into a single living organism.');
push('');
for (const sys of MACRO_SYSTEMS) {
  push(`### ${sys.name} — Rows ${sys.rows[0]}–${sys.rows[sys.rows.length - 1]}`);
  push('');
  push(`**Theme:** ${sys.theme}`);
  push('');
  push(`**Arc:** ${sys.arc}`);
  push('');
  push(`**Governs:** ${sys.governs.join(', ')}`);
  push('');
  push(`**Summary:** ${sys.summary}`);
  push('');
  push(`**Metaphor:** ${sys.metaphor}`);
  push('');
  push('| Row | Organ | Mythic Name | Directional Current | Cosmogram Role |');
  push('|----:|-------|-------------|---------------------|----------------|');
  for (const r of COSMOGRAM_ROWS.filter(r => sys.rows.includes(r.row))) {
    push(`| ${r.row} | ${r.organ} | ${r.mythicName} | ${r.current} | ${r.role} |`);
  }
  push('');
}
push('---');
push('');

// ── System transitions ──────────────────────────────────────────────────
push('## System Transitions — The Grand Arc');
push('');
for (const t of SYSTEM_TRANSITIONS) {
  push(`- **${t.from} → ${t.to}** — ${t.bridge}`);
}
push('');
push('---');
push('');

// ── Grand narrative ─────────────────────────────────────────────────────
push(`## ${GRAND_NARRATIVE.title}`);
push('');
push(`_${GRAND_NARRATIVE.subtitle}_`);
push('');
for (const stage of GRAND_NARRATIVE.stages) {
  push(`- **${stage.system}** — ${stage.arc}`);
}
push('');
push(`> ${GRAND_NARRATIVE.conclusion}`);
push('');
push('---');
push('');

// ── Full 1,296-panel matrix ─────────────────────────────────────────────
push('## The Full 1,296-Panel Matrix');
push('');
push('Every row of the Atlas, with all 36 cross-organ panels. Columns correspond to the master row index above (col 0 = Smooth Muscle, col 35 = Immune Signaling).');
push('');

let totalPanels = 0;
for (const row of ORGAN_NARRATIVES) {
  push(`### Row ${row.rowIndex} — ${row.rowOrgan} (${row.rowArchetype || '—'})`);
  push('');
  if (row.copilotLabel) push(`**Label:** ${row.copilotLabel}`);
  push('');
  if (row.rowIdentity) {
    push(`**Identity:** ${row.rowIdentity}`);
    push('');
  }
  if (row.copilotNote) {
    push(`> ${row.copilotNote}`);
    push('');
  }
  if (row.clusterInsights) {
    push('**Cluster Insights:**');
    push('');
    for (const [k, v] of Object.entries(row.clusterInsights)) {
      push(`- **${k}** — ${v}`);
    }
    push('');
  }
  push(`**Panels (${row.panels.length}):**`);
  push('');
  push('| Col | Organ | Score | Tier | Mythic Name | Summary |');
  push('|----:|-------|------:|:----:|-------------|---------|');
  for (const p of row.panels) {
    const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    push(`| ${p.colIndex} | ${esc(p.colOrgan)} | ${p.hybridScore} | ${p.tier} | ${esc(p.mythicName)} | ${esc(p.summary)} |`);
  }
  push('');
  // Detail block per panel — felt sense, attachment, stress, cognitive
  push('<details><summary>Panel detail (felt sense / attachment / stress / cognitive)</summary>');
  push('');
  for (const p of row.panels) {
    push(`**${row.rowIndex}×${p.colIndex} — ${row.rowOrgan} × ${p.colOrgan} — _${p.mythicName}_ (${p.tier}, ${p.hybridScore})**`);
    push('');
    push(`- _Felt sense:_ ${p.feltSense}`);
    push(`- _Attachment:_ ${p.attachment}`);
    push(`- _Stress response:_ ${p.stressResponse}`);
    push(`- _Cognitive:_ ${p.cognitive}`);
    push('');
  }
  push('</details>');
  push('');
  push('---');
  push('');
  totalPanels += row.panels.length;
}

push('## Totals');
push('');
push(`- **Rows:** ${ORGAN_NARRATIVES.length}`);
push(`- **Panels:** ${totalPanels}`);
push(`- **Expected:** 1,296 (36 × 36)`);
push('');

const md = out.join('\n');
const target = 'docs/00_To Do/ORGAN_ATLAS_FULL_MATRIX.md';
writeFileSync(target, md, 'utf8');
console.log(`Wrote ${md.length.toLocaleString()} bytes → ${target}`);
console.log(`Rows: ${ORGAN_NARRATIVES.length}  Panels: ${totalPanels}`);
