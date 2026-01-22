/**
 * ============================================
 * CATHEDRAL INDEX PAGE TEMPLATE
 * The Living Map of Chambers, Engines, and
 * Scriptures - Master library index
 * ============================================
 */

import { KnowledgeCodex, JOURNEY_CHAMBERS } from '../codexTypes';
import { AVAILABLE_CODEX_PAGES } from '../codexPagesComplete';

/**
 * Cathedral module configuration
 */
export interface CathedralModule {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  status: 'active' | 'beta' | 'planned';
  itemCount?: number;
  submodules?: CathedralModule[];
}

/**
 * Get complete Cathedral module tree
 */
export function getCathedralModuleTree(): CathedralModule[] {
  return [
    {
      id: 'core-engines',
      name: 'Core Engines',
      chineseName: '核心引擎',
      description: 'The computational heart of the Cathedral',
      status: 'active',
      submodules: [
        {
          id: 'bazi-engine',
          name: 'BaZi Engine',
          chineseName: '八字引擎',
          description: 'Four Pillars calculation and analysis',
          status: 'active',
          submodules: [
            { id: 'day-master', name: 'Day Master Strength', chineseName: '日主强弱', description: 'Calculate DM strength with seasonal modifiers', status: 'active' },
            { id: 'ten-gods', name: 'Ten Gods', chineseName: '十神', description: 'Full ten gods relationship mapping', status: 'active' },
            { id: 'structures', name: 'Structures', chineseName: '格局', description: 'Special structure detection (Follow, Blade, etc.)', status: 'active' },
            { id: 'combinations', name: 'Combinations', chineseName: '合化', description: 'Three Harmony, Six Harmony, transformations', status: 'active' },
            { id: 'useful-god', name: 'Useful God', chineseName: '用神', description: 'Useful God determination with exceptions', status: 'active' },
            { id: 'conflicts', name: 'Clash/Harm/Punishment', chineseName: '冲害刑', description: 'Negative interaction detection', status: 'active' },
            { id: 'seasonal', name: 'Seasonal', chineseName: '季节', description: 'Seasonal strength modifiers', status: 'active' },
            { id: 'hidden-stems', name: 'Hidden Stems', chineseName: '藏干', description: 'Hidden stem analysis', status: 'active' },
            { id: 'luck-pillars', name: 'Luck Pillars', chineseName: '大运', description: '10-year luck pillar analysis', status: 'active' }
          ]
        },
        {
          id: 'rule-engine',
          name: 'Classical Rule Engine',
          chineseName: '古典规则引擎',
          description: '62 classical edge case rules with JSON modular library',
          status: 'active',
          itemCount: 62
        }
      ]
    },
    {
      id: 'knowledge-codex',
      name: 'Knowledge Codex',
      chineseName: '知识宝典',
      description: 'Scripture library of classical wisdom',
      status: 'active',
      itemCount: AVAILABLE_CODEX_PAGES.length,
      submodules: JOURNEY_CHAMBERS.map(chamber => ({
        id: chamber.id,
        name: chamber.name,
        chineseName: chamber.chineseName,
        description: chamber.description,
        status: 'active' as const
      }))
    },
    {
      id: 'persona-layer',
      name: 'Persona Layer',
      chineseName: '人格层',
      description: "Luna's voice library - emotional narratives",
      status: 'active',
      itemCount: 62,
      submodules: [
        { id: 'persona-hooks', name: 'Persona Hooks', chineseName: '人格钩子', description: '62 first-person narrative hooks', status: 'active' },
        { id: 'emotional-tones', name: 'Emotional Tone Profiles', chineseName: '情感音调', description: 'Mapping severity/effect to voice', status: 'active' },
        { id: 'symbolic-imagery', name: 'Symbolic Imagery Library', chineseName: '象征意象', description: 'Metaphors and imagery per category', status: 'active' },
        { id: 'narrative-expansions', name: 'Narrative Expansions', chineseName: '叙事扩展', description: 'Extended narrative generation', status: 'active' }
      ]
    },
    {
      id: 'pilgrim-journey',
      name: 'Pilgrim Journey',
      chineseName: '朝圣之旅',
      description: 'Initiation path through the Cathedral chambers',
      status: 'active',
      itemCount: 62,
      submodules: [
        { id: 'journey-steps', name: '62 Journey Steps', chineseName: '旅程步骤', description: 'Each rule as a teaching step', status: 'active' },
        { id: 'chamber-progression', name: 'Chamber Progression', chineseName: '殿堂进程', description: 'Chamber-by-chamber navigation', status: 'active' },
        { id: 'trials', name: 'Trials & Transformations', chineseName: '试炼与蜕变', description: 'Growth through difficulty', status: 'active' }
      ]
    },
    {
      id: 'ui-systems',
      name: 'UI Systems',
      chineseName: '界面系统',
      description: 'Visual interfaces and dashboards',
      status: 'active',
      submodules: [
        { id: 'narrative-cockpit', name: 'Narrative Cockpit', chineseName: '叙事驾驶舱', description: 'Story beats, arcs, timing curves', status: 'active' },
        { id: 'constellation-ui', name: 'Relationship Constellation', chineseName: '关系星图', description: 'Multi-relationship mapping', status: 'active' },
        { id: 'export-layer', name: 'Export Layer', chineseName: '导出层', description: 'HTML/PDF/Markdown exports', status: 'active' },
        { id: 'cathedral-layout', name: 'Cathedral Layout', chineseName: '殿堂布局', description: 'Full tri-panel UI', status: 'active' }
      ]
    },
    {
      id: 'developer-tools',
      name: 'Developer Tools',
      chineseName: '开发工具',
      description: 'APIs, tests, and schema maps',
      status: 'active',
      submodules: [
        { id: 'json-rules', name: 'JSON Rule Library', chineseName: 'JSON规则库', description: '8 modular rule files', status: 'active' },
        { id: 'ts-engine', name: 'TypeScript Engine', chineseName: 'TS引擎', description: '10+ evaluation engines', status: 'active' },
        { id: 'unit-tests', name: 'Deterministic Tests', chineseName: '确定性测试', description: 'Canonical chart test suite', status: 'active' },
        { id: 'schema-maps', name: 'Schema Maps', chineseName: '模式映射', description: 'Type definitions and interfaces', status: 'active' }
      ]
    },
    {
      id: 'future-chambers',
      name: 'Future Chambers',
      chineseName: '未来殿堂',
      description: 'Planned expansions',
      status: 'planned',
      submodules: [
        { id: 'ritual-layer', name: 'Ritual Layer', chineseName: '仪式层', description: 'Ceremonial practices and timing', status: 'planned' },
        { id: 'mythos-layer', name: 'Mythos Layer', chineseName: '神话层', description: 'Archetypal narrative patterns', status: 'planned' },
        { id: 'generational-arcs', name: 'Generational Arcs', chineseName: '世代弧线', description: 'Family lineage patterns', status: 'planned' }
      ]
    }
  ];
}

/**
 * Generate Cathedral Index Markdown
 */
export function renderCathedralIndexMarkdown(): string {
  const modules = getCathedralModuleTree();
  const lines: string[] = [];

  lines.push('# 🕍 Cathedral Index Page');
  lines.push('### The Living Map of Chambers, Engines, and Scriptures');
  lines.push('');
  lines.push('Welcome, pilgrim.');
  lines.push('This is the master index of the Cathedral — every chamber, every engine, every narrative layer.');
  lines.push('');
  lines.push('---');
  lines.push('');

  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    const roman = toRoman(i + 1);

    lines.push(`## ${roman}. ${mod.name}`);
    if (mod.chineseName) lines.push(`*${mod.chineseName}*`);
    lines.push('');
    lines.push(mod.description);
    if (mod.itemCount) lines.push(`**Items:** ${mod.itemCount}`);
    lines.push('');

    if (mod.submodules) {
      for (const sub of mod.submodules) {
        const statusIcon = sub.status === 'active' ? '✅' : sub.status === 'beta' ? '🔶' : '📋';
        lines.push(`- ${statusIcon} **${sub.name}** (${sub.chineseName})`);
        lines.push(`  - ${sub.description}`);

        if (sub.submodules) {
          for (const subsub of sub.submodules) {
            lines.push(`    - ${subsub.name} (${subsub.chineseName})`);
          }
        }
      }
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // Footer
  lines.push('## Navigation');
  lines.push('');
  lines.push('- [Knowledge Codex](#knowledge-codex)');
  lines.push('- [Persona Layer](#persona-layer)');
  lines.push('- [Pilgrim Journey](#pilgrim-journey)');
  lines.push('- [Developer Tools](#developer-tools)');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*This is the Library of Alexandria of your metaphysics OS.*');

  return lines.join('\n');
}

/**
 * Generate Cathedral Index HTML
 */
export function renderCathedralIndexHtml(): string {
  const modules = getCathedralModuleTree();

  const moduleCards = modules.map(mod => `
    <div class="index-card ${mod.status}">
      <div class="card-header">
        <h3>${mod.name}</h3>
        <span class="chinese-name">${mod.chineseName}</span>
        ${mod.itemCount ? `<span class="item-count">${mod.itemCount} items</span>` : ''}
      </div>
      <p class="card-description">${mod.description}</p>
      ${mod.submodules ? `
        <ul class="submodules">
          ${mod.submodules.map(sub => `
            <li class="${sub.status}">
              <span class="status-icon">${sub.status === 'active' ? '✅' : sub.status === 'beta' ? '🔶' : '📋'}</span>
              <strong>${sub.name}</strong>
              <span class="sub-chinese">${sub.chineseName}</span>
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cathedral Index — Master Library</title>
  <style>
    body { font-family: Georgia, serif; background: #faf7f3; margin: 0; padding: 0; }
    .cathedral-index { max-width: 1200px; margin: 0 auto; padding: 40px; }
    h1 { text-align: center; color: #2b2b2b; font-size: 36px; }
    .subtitle { text-align: center; color: #666; font-style: italic; margin-bottom: 40px; }
    .index-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .index-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .index-card.planned { opacity: 0.7; border: 2px dashed #ccc; }
    .card-header { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 10px; }
    .card-header h3 { margin: 0; flex: 1; }
    .chinese-name { color: #c9a227; font-size: 14px; }
    .item-count { background: #2b2b2b; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; }
    .card-description { color: #666; margin-bottom: 15px; }
    .submodules { list-style: none; padding: 0; margin: 0; }
    .submodules li { padding: 5px 0; border-top: 1px solid #eee; display: flex; align-items: center; gap: 8px; }
    .status-icon { font-size: 12px; }
    .sub-chinese { color: #999; font-size: 12px; margin-left: auto; }
  </style>
</head>
<body>
  <div class="cathedral-index">
    <h1>🕍 Cathedral Index</h1>
    <p class="subtitle">The Living Map of Chambers, Engines, and Scriptures</p>
    <div class="index-grid">
      ${moduleCards}
    </div>
  </div>
</body>
</html>`;
}

// Helper: convert number to Roman numeral
function toRoman(num: number): string {
  const lookup: Record<string, number> = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export { toRoman };
