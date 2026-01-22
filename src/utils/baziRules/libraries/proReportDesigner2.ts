/**
 * ============================================
 * PRO REPORT DESIGNER 2.0
 * Drag-and-Drop Section Builder with Live Previews
 *
 * Features:
 * - Drag-and-drop ordering
 * - Live previews from interpretation libraries
 * - Section metadata with renderers
 * - Dynamic report generation
 * ============================================
 */

import { TEN_GOD_LIBRARY } from './tenGodLibrary';
import { STRUCTURE_LIBRARY } from './structureLibrary';
import { USEFUL_GOD_LIBRARY } from './usefulGodLibrary';
import { SHEN_SHA_LIBRARY } from './shenShaLibrary';
import { LUCK_PILLAR_LIBRARY } from './luckPillarLibrary';
import { ELEMENT_INTERACTION_LIBRARY, MONTHLY_EMPHASIS_LIBRARY } from './annualForecastLibrary';

// ==================== TYPES ====================

export interface ReportSection2 {
  id: string;
  label: string;
  labelZh: string;
  enabled: boolean;
  order: number;
  category: 'core' | 'analysis' | 'timing' | 'guidance' | 'narrative';
  renderer: (ctx: ReportContext2) => string;
  rendererZh: (ctx: ReportContext2) => string;
  preview: (ctx: ReportContext2) => string;
  previewZh: (ctx: ReportContext2) => string;
}

export interface ReportDesign2 {
  sections: ReportSection2[];
  language: 'en' | 'zh';
  includeRationale: boolean;
}

export interface ReportContext2 {
  // Chart Data
  chart: {
    yearStem: string;
    yearBranch: string;
    monthStem: string;
    monthBranch: string;
    dayStem: string;
    dayBranch: string;
    hourStem?: string;
    hourBranch?: string;
  };

  // Day Master
  dayMaster: {
    element: string;
    strength: 'strong' | 'weak' | 'balanced';
  };

  // Structure
  structure: {
    type: string;
    typeZh?: string;
  };

  // Ten Gods
  tenGods: Array<{
    id: string;
    pillar: 'year' | 'month' | 'day' | 'hour';
    position: 'stem' | 'branch' | 'hidden';
  }>;

  // Useful God
  usefulGods: Array<{
    element: string;
    role: 'useful' | 'supporting' | 'annoying';
  }>;

  // Shen Sha
  shenSha: Array<{
    id: string;
    pillar: 'year' | 'month' | 'day' | 'hour';
  }>;

  // Luck Pillars
  luckPillars: {
    current?: {
      stem: string;
      branch: string;
      startAge: number;
      endAge: number;
    };
    pillars: Array<{
      stem: string;
      branch: string;
      startAge: number;
      endAge: number;
    }>;
  };

  // Annual
  annual?: {
    year: number;
    stem: string;
    branch: string;
  };

  // Optional extended context
  narrative?: {
    storyBeats?: string[];
    emotionalArc?: string[];
  };

  mythos?: {
    archetypes?: string[];
    themes?: string[];
  };
}

// ==================== SECTION BUILDERS ====================

/**
 * Build all Pro Report sections with previews
 */
export function buildProReportSections2(ctx: ReportContext2): ReportSection2[] {
  return [
    // ===== CORE CHART SECTION =====
    {
      id: 'core',
      label: 'Core Chart',
      labelZh: '核心命盘',
      enabled: true,
      order: 1,
      category: 'core',
      preview: (c) => `${c.chart.yearStem}${c.chart.yearBranch} • ${c.chart.monthStem}${c.chart.monthBranch} • ${c.chart.dayStem}${c.chart.dayBranch}`,
      previewZh: (c) => `${c.chart.yearStem}${c.chart.yearBranch} • ${c.chart.monthStem}${c.chart.monthBranch} • ${c.chart.dayStem}${c.chart.dayBranch}`,
      renderer: (c) => `
### Core Chart (四柱)

| Pillar | Stem | Branch |
|--------|------|--------|
| Year | ${c.chart.yearStem} | ${c.chart.yearBranch} |
| Month | ${c.chart.monthStem} | ${c.chart.monthBranch} |
| Day | ${c.chart.dayStem} | ${c.chart.dayBranch} |
${c.chart.hourStem ? `| Hour | ${c.chart.hourStem} | ${c.chart.hourBranch} |` : ''}

**Day Master:** ${c.dayMaster.element} (${c.dayMaster.strength})
      `.trim(),
      rendererZh: (c) => `
### 核心命盘（四柱）

| 柱位 | 天干 | 地支 |
|------|------|------|
| 年柱 | ${c.chart.yearStem} | ${c.chart.yearBranch} |
| 月柱 | ${c.chart.monthStem} | ${c.chart.monthBranch} |
| 日柱 | ${c.chart.dayStem} | ${c.chart.dayBranch} |
${c.chart.hourStem ? `| 时柱 | ${c.chart.hourStem} | ${c.chart.hourBranch} |` : ''}

**日主：** ${c.dayMaster.element}（${c.dayMaster.strength === 'strong' ? '强' : c.dayMaster.strength === 'weak' ? '弱' : '平衡'}）
      `.trim()
    },

    // ===== TEN GODS SECTION =====
    {
      id: 'ten_gods',
      label: 'Ten Gods',
      labelZh: '十神',
      enabled: true,
      order: 2,
      category: 'analysis',
      preview: (c) => {
        if (c.tenGods.length === 0) return 'No Ten Gods detected';
        const tg = TEN_GOD_LIBRARY.find(t => t.id === c.tenGods[0].id);
        return tg ? `${tg.name}: ${tg.coreEnergy.substring(0, 60)}...` : 'Loading...';
      },
      previewZh: (c) => {
        if (c.tenGods.length === 0) return '未检测到十神';
        const tg = TEN_GOD_LIBRARY.find(t => t.id === c.tenGods[0].id);
        return tg ? `${tg.nameZh}: ${tg.coreEnergyZh.substring(0, 40)}...` : '加载中...';
      },
      renderer: (c) => {
        if (c.tenGods.length === 0) return '### Ten Gods\n\nNo significant Ten Gods detected in chart.';

        const content = c.tenGods.map(g => {
          const tg = TEN_GOD_LIBRARY.find(t => t.id === g.id);
          if (!tg) return '';
          return `
#### ${tg.name} (${tg.nameZh}) — ${g.pillar} pillar (${g.position})

${tg.coreEnergy}

**Personality:** ${tg.personality}

**Career:** ${tg.career}

**Relationships:** ${tg.relationships}
          `.trim();
        }).filter(Boolean).join('\n\n---\n\n');

        return `### Ten Gods Interpretation\n\n${content}`;
      },
      rendererZh: (c) => {
        if (c.tenGods.length === 0) return '### 十神\n\n命盘中未检测到显著十神。';

        const content = c.tenGods.map(g => {
          const tg = TEN_GOD_LIBRARY.find(t => t.id === g.id);
          if (!tg) return '';
          const pillarZh = g.pillar === 'year' ? '年' : g.pillar === 'month' ? '月' : g.pillar === 'day' ? '日' : '时';
          const posZh = g.position === 'stem' ? '天干' : g.position === 'branch' ? '地支' : '藏干';
          return `
#### ${tg.nameZh}（${tg.name}）— ${pillarZh}柱（${posZh}）

${tg.coreEnergyZh}

**性格：** ${tg.personalityZh}

**事业：** ${tg.careerZh}

**关系：** ${tg.relationshipsZh}
          `.trim();
        }).filter(Boolean).join('\n\n---\n\n');

        return `### 十神解读\n\n${content}`;
      }
    },

    // ===== STRUCTURE SECTION =====
    {
      id: 'structure',
      label: 'Structure',
      labelZh: '格局',
      enabled: true,
      order: 3,
      category: 'analysis',
      preview: (c) => {
        const s = STRUCTURE_LIBRARY.find(x => x.type === c.structure.type);
        return s ? `${s.name}: ${s.overview.substring(0, 60)}...` : `Structure: ${c.structure.type}`;
      },
      previewZh: (c) => {
        const s = STRUCTURE_LIBRARY.find(x => x.type === c.structure.type);
        return s ? `${s.nameZh}: ${s.overviewZh.substring(0, 40)}...` : `格局: ${c.structure.type}`;
      },
      renderer: (c) => {
        const s = STRUCTURE_LIBRARY.find(x => x.type === c.structure.type);
        if (!s) return `### Structure\n\nYour chart follows the ${c.structure.type} pattern.`;

        return `
### Structure: ${s.name} (${s.nameZh})

${s.overview}

**Personality:** ${s.personality}

**Career Path:** ${s.career}

**Relationship Approach:** ${s.relationships}

**Challenges:** ${s.challenges}
        `.trim();
      },
      rendererZh: (c) => {
        const s = STRUCTURE_LIBRARY.find(x => x.type === c.structure.type);
        if (!s) return `### 格局\n\n你的命盘遵循${c.structure.type}模式。`;

        return `
### 格局：${s.nameZh}（${s.name}）

${s.overviewZh}

**性格：** ${s.personalityZh}

**事业道路：** ${s.careerZh}

**关系方式：** ${s.relationshipsZh}

**挑战：** ${s.challengesZh}
        `.trim();
      }
    },

    // ===== USEFUL GOD SECTION =====
    {
      id: 'useful_god',
      label: 'Useful God',
      labelZh: '用神',
      enabled: true,
      order: 4,
      category: 'analysis',
      preview: (c) => {
        if (c.usefulGods.length === 0) return 'No clear Useful God';
        const ug = USEFUL_GOD_LIBRARY[c.usefulGods[0].element];
        return ug ? `${ug.element}: ${ug.whyUseful.substring(0, 50)}...` : 'Loading...';
      },
      previewZh: (c) => {
        if (c.usefulGods.length === 0) return '无明确用神';
        const ug = USEFUL_GOD_LIBRARY[c.usefulGods[0].element];
        return ug ? `${ug.elementZh}: ${ug.whyUsefulZh.substring(0, 30)}...` : '加载中...';
      },
      renderer: (c) => {
        if (c.usefulGods.length === 0) return '### Useful God\n\nNo clear Useful God detected for this chart.';

        const content = c.usefulGods.map(u => {
          const ug = USEFUL_GOD_LIBRARY[u.element];
          if (!ug) return '';

          return `
#### ${ug.element} (${ug.elementZh}) — ${u.role}

${ug.overview}

**Why Useful:** ${ug.whyUseful}

**How to Activate:** ${ug.howToActivate}

**Career Activation:** ${ug.careerActivation}

**Relationship Activation:** ${ug.relationshipActivation}

**Health Activation:** ${ug.healthActivation}

**Colors:** ${ug.colors.join(', ')}
**Directions:** ${ug.directions.join(', ')}
**Activities:** ${ug.activities.join(', ')}

**Pitfalls:** ${ug.pitfalls}
          `.trim();
        }).filter(Boolean).join('\n\n---\n\n');

        return `### Useful God Analysis\n\n${content}`;
      },
      rendererZh: (c) => {
        if (c.usefulGods.length === 0) return '### 用神\n\n此命盘未检测到明确用神。';

        const content = c.usefulGods.map(u => {
          const ug = USEFUL_GOD_LIBRARY[u.element];
          if (!ug) return '';
          const roleZh = u.role === 'useful' ? '用神' : u.role === 'supporting' ? '喜神' : '忌神';

          return `
#### ${ug.elementZh}（${ug.element}）— ${roleZh}

${ug.overviewZh}

**为什么有用：** ${ug.whyUsefulZh}

**如何激活：** ${ug.howToActivateZh}

**事业激活：** ${ug.careerActivationZh}

**关系激活：** ${ug.relationshipActivationZh}

**健康激活：** ${ug.healthActivationZh}

**颜色：** ${ug.colors.join('、')}
**方向：** ${ug.directions.join('、')}
**活动：** ${ug.activities.join('、')}

**陷阱：** ${ug.pitfallsZh}
          `.trim();
        }).filter(Boolean).join('\n\n---\n\n');

        return `### 用神分析\n\n${content}`;
      }
    },

    // ===== SHEN SHA SECTION =====
    {
      id: 'shen_sha',
      label: 'Shen Sha Stars',
      labelZh: '神煞',
      enabled: true,
      order: 5,
      category: 'analysis',
      preview: (c) => {
        if (c.shenSha.length === 0) return 'No significant Shen Sha';
        const ss = SHEN_SHA_LIBRARY.find(s => s.id === c.shenSha[0].id);
        return ss ? `${ss.name}: ${ss.overview.substring(0, 50)}...` : 'Loading...';
      },
      previewZh: (c) => {
        if (c.shenSha.length === 0) return '无显著神煞';
        const ss = SHEN_SHA_LIBRARY.find(s => s.id === c.shenSha[0].id);
        return ss ? `${ss.nameZh}: ${ss.overviewZh.substring(0, 30)}...` : '加载中...';
      },
      renderer: (c) => {
        if (c.shenSha.length === 0) return '### Shen Sha Stars\n\nNo significant Shen Sha detected in chart.';

        const content = c.shenSha.map(s => {
          const ss = SHEN_SHA_LIBRARY.find(x => x.id === s.id);
          if (!ss) return '';

          const pillarMeaning = ss.pillarMeaning[s.pillar] || ss.overview;

          return `
#### ${ss.name} (${ss.nameZh}) — ${s.pillar} pillar

**Category:** ${ss.category}

${ss.overview}

**In ${s.pillar} pillar:** ${pillarMeaning}

**Activation:** ${ss.activation}

**Caution:** ${ss.caution}
          `.trim();
        }).filter(Boolean).join('\n\n---\n\n');

        return `### Shen Sha Stars\n\n${content}`;
      },
      rendererZh: (c) => {
        if (c.shenSha.length === 0) return '### 神煞\n\n命盘中未检测到显著神煞。';

        const content = c.shenSha.map(s => {
          const ss = SHEN_SHA_LIBRARY.find(x => x.id === s.id);
          if (!ss) return '';

          const pillarZh = s.pillar === 'year' ? '年' : s.pillar === 'month' ? '月' : s.pillar === 'day' ? '日' : '时';
          const pillarMeaning = ss.pillarMeaningZh[s.pillar] || ss.overviewZh;
          const categoryZh = ss.category === 'auspicious' ? '吉' : ss.category === 'inauspicious' ? '凶' : '中性';

          return `
#### ${ss.nameZh}（${ss.name}）— ${pillarZh}柱

**类别：** ${categoryZh}

${ss.overviewZh}

**在${pillarZh}柱：** ${pillarMeaning}

**激活：** ${ss.activationZh}

**注意：** ${ss.cautionZh}
          `.trim();
        }).filter(Boolean).join('\n\n---\n\n');

        return `### 神煞\n\n${content}`;
      }
    },

    // ===== LUCK PILLARS SECTION =====
    {
      id: 'luck_pillars',
      label: 'Luck Pillars',
      labelZh: '大运',
      enabled: true,
      order: 6,
      category: 'timing',
      preview: (c) => {
        if (!c.luckPillars.current) return 'No current luck pillar';
        const lp = c.luckPillars.current;
        const interp = LUCK_PILLAR_LIBRARY.find(l => l.stem === lp.stem && l.branch === lp.branch);
        return interp ? `${lp.stem}${lp.branch} (${lp.startAge}-${lp.endAge}): ${interp.overview.substring(0, 40)}...` : `${lp.stem}${lp.branch}`;
      },
      previewZh: (c) => {
        if (!c.luckPillars.current) return '无当前大运';
        const lp = c.luckPillars.current;
        const interp = LUCK_PILLAR_LIBRARY.find(l => l.stem === lp.stem && l.branch === lp.branch);
        return interp ? `${interp.pillarZh}（${lp.startAge}-${lp.endAge}岁）: ${interp.overviewZh.substring(0, 25)}...` : `${lp.stem}${lp.branch}`;
      },
      renderer: (c) => {
        if (c.luckPillars.pillars.length === 0) return '### Luck Pillars\n\nNo luck pillar data available.';

        const content = c.luckPillars.pillars.map(lp => {
          const interp = LUCK_PILLAR_LIBRARY.find(l => l.stem === lp.stem && l.branch === lp.branch);
          const isCurrent = c.luckPillars.current?.stem === lp.stem && c.luckPillars.current?.branch === lp.branch;

          if (!interp) {
            return `#### ${lp.stem} ${lp.branch} (Ages ${lp.startAge}-${lp.endAge})${isCurrent ? ' ★ CURRENT' : ''}\n\nInterpretation data not available.`;
          }

          return `
#### ${interp.stem} ${interp.branch} (Ages ${lp.startAge}-${lp.endAge})${isCurrent ? ' ★ CURRENT' : ''}

${interp.overview}

**Life Themes:** ${interp.lifeThemes}

**Career Themes:** ${interp.careerThemes}

**Relationship Themes:** ${interp.relationshipThemes}

**Inner Work:** ${interp.innerWork}
          `.trim();
        }).join('\n\n---\n\n');

        return `### Luck Pillars (10-Year Periods)\n\n${content}`;
      },
      rendererZh: (c) => {
        if (c.luckPillars.pillars.length === 0) return '### 大运\n\n无大运数据。';

        const content = c.luckPillars.pillars.map(lp => {
          const interp = LUCK_PILLAR_LIBRARY.find(l => l.stem === lp.stem && l.branch === lp.branch);
          const isCurrent = c.luckPillars.current?.stem === lp.stem && c.luckPillars.current?.branch === lp.branch;

          if (!interp) {
            return `#### ${lp.stem}${lp.branch}（${lp.startAge}-${lp.endAge}岁）${isCurrent ? ' ★ 当前' : ''}\n\n解读数据不可用。`;
          }

          return `
#### ${interp.pillarZh}（${lp.startAge}-${lp.endAge}岁）${isCurrent ? ' ★ 当前' : ''}

${interp.overviewZh}

**生活主题：** ${interp.lifeThemesZh}

**事业主题：** ${interp.careerThemesZh}

**关系主题：** ${interp.relationshipThemesZh}

**内在功课：** ${interp.innerWorkZh}
          `.trim();
        }).join('\n\n---\n\n');

        return `### 大运（十年周期）\n\n${content}`;
      }
    },

    // ===== ANNUAL FORECAST SECTION =====
    {
      id: 'annual',
      label: 'Annual Forecast',
      labelZh: '流年',
      enabled: true,
      order: 7,
      category: 'timing',
      preview: (c) => {
        if (!c.annual) return 'No annual data';
        return `${c.annual.year}: ${c.annual.stem}${c.annual.branch} Year`;
      },
      previewZh: (c) => {
        if (!c.annual) return '无流年数据';
        return `${c.annual.year}年：${c.annual.stem}${c.annual.branch}年`;
      },
      renderer: (c) => {
        if (!c.annual) return '### Annual Forecast\n\nNo annual data available.';

        // Get element interaction
        const yearElement = getElementForStem(c.annual.stem);
        let interactionContent = '';

        if (yearElement) {
          const interaction = ELEMENT_INTERACTION_LIBRARY.find(
            ei => ei.incomingElement === yearElement && ei.natalElement === c.dayMaster.element
          );

          if (interaction) {
            interactionContent = `
**Element Interaction:** ${interaction.relationship}

${interaction.overview}

**Opportunities:** ${interaction.opportunities}

**Challenges:** ${interaction.challenges}

**Advice:** ${interaction.advice}
            `.trim();
          }
        }

        return `
### Annual Forecast: ${c.annual.year}

**Year Pillar:** ${c.annual.stem} ${c.annual.branch}

${interactionContent || 'Detailed interaction analysis not available.'}
        `.trim();
      },
      rendererZh: (c) => {
        if (!c.annual) return '### 流年\n\n无流年数据。';

        const yearElement = getElementForStem(c.annual.stem);
        let interactionContent = '';

        if (yearElement) {
          const interaction = ELEMENT_INTERACTION_LIBRARY.find(
            ei => ei.incomingElement === yearElement && ei.natalElement === c.dayMaster.element
          );

          if (interaction) {
            interactionContent = `
**元素互动：** ${interaction.relationship}

${interaction.overviewZh}

**机会：** ${interaction.opportunitiesZh}

**挑战：** ${interaction.challengesZh}

**建议：** ${interaction.adviceZh}
            `.trim();
          }
        }

        return `
### 流年预测：${c.annual.year}年

**流年柱：** ${c.annual.stem}${c.annual.branch}

${interactionContent || '详细互动分析不可用。'}
        `.trim();
      }
    },

    // ===== ACTIONABLE GUIDANCE SECTION =====
    {
      id: 'guidance',
      label: 'Actionable Guidance',
      labelZh: '行动指南',
      enabled: true,
      order: 8,
      category: 'guidance',
      preview: (c) => {
        if (c.usefulGods.length === 0) return 'General guidance';
        const ug = USEFUL_GOD_LIBRARY[c.usefulGods[0].element];
        return ug ? `Focus on ${ug.colors[0]} colors, ${ug.directions[0]} direction` : 'General guidance';
      },
      previewZh: (c) => {
        if (c.usefulGods.length === 0) return '一般指导';
        const ug = USEFUL_GOD_LIBRARY[c.usefulGods[0].element];
        return ug ? `关注${ug.colors[0]}颜色、${ug.directions[0]}方向` : '一般指导';
      },
      renderer: (c) => {
        let content = '### Actionable Guidance\n\n';

        if (c.usefulGods.length > 0) {
          const ug = USEFUL_GOD_LIBRARY[c.usefulGods[0].element];
          if (ug) {
            content += `
**Favorable Colors:** ${ug.colors.join(', ')}
- Incorporate these into your wardrobe and workspace

**Favorable Directions:** ${ug.directions.join(', ')}
- Face these directions when working on important projects

**Beneficial Activities:**
${ug.activities.map(a => `- ${a}`).join('\n')}

**Career Focus:** ${ug.careerActivation}

**Relationship Focus:** ${ug.relationshipActivation}

**Health Focus:** ${ug.healthActivation}

**Timing Notes:** ${ug.timingNotes}
            `;
          }
        }

        return content.trim();
      },
      rendererZh: (c) => {
        let content = '### 行动指南\n\n';

        if (c.usefulGods.length > 0) {
          const ug = USEFUL_GOD_LIBRARY[c.usefulGods[0].element];
          if (ug) {
            content += `
**有利颜色：** ${ug.colors.join('、')}
- 将这些融入你的衣橱和工作空间

**有利方向：** ${ug.directions.join('、')}
- 处理重要项目时面向这些方向

**有益活动：**
${ug.activities.map(a => `- ${a}`).join('\n')}

**事业重点：** ${ug.careerActivationZh}

**关系重点：** ${ug.relationshipActivationZh}

**健康重点：** ${ug.healthActivationZh}

**时机提示：** ${ug.timingNotesZh}
            `;
          }
        }

        return content.trim();
      }
    }
  ];
}

// ==================== DESIGN OPERATIONS ====================

/**
 * Create a new report design
 */
export function createReportDesign2(ctx: ReportContext2, language: 'en' | 'zh' = 'en'): ReportDesign2 {
  return {
    sections: buildProReportSections2(ctx),
    language,
    includeRationale: false
  };
}

/**
 * Toggle section enabled/disabled
 */
export function toggleSection2(design: ReportDesign2, sectionId: string): ReportDesign2 {
  return {
    ...design,
    sections: design.sections.map(s =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    )
  };
}

/**
 * Reorder sections by swapping positions
 */
export function reorderSections2(design: ReportDesign2, draggedId: string, targetId: string): ReportDesign2 {
  const dragged = design.sections.find(s => s.id === draggedId);
  const target = design.sections.find(s => s.id === targetId);

  if (!dragged || !target) return design;

  const draggedOrder = dragged.order;
  const targetOrder = target.order;

  return {
    ...design,
    sections: design.sections.map(s => {
      if (s.id === draggedId) return { ...s, order: targetOrder };
      if (s.id === targetId) return { ...s, order: draggedOrder };
      return s;
    })
  };
}

/**
 * Set section order directly
 */
export function setSectionOrder2(design: ReportDesign2, orderedIds: string[]): ReportDesign2 {
  return {
    ...design,
    sections: design.sections.map(s => ({
      ...s,
      order: orderedIds.indexOf(s.id) + 1
    }))
  };
}

/**
 * Generate the full report from design
 */
export function generateReport2(design: ReportDesign2, ctx: ReportContext2): string {
  const lang = design.language;

  return design.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)
    .map(s => lang === 'zh' ? s.rendererZh(ctx) : s.renderer(ctx))
    .join('\n\n---\n\n');
}

/**
 * Get section previews for UI
 */
export function getSectionPreviews2(design: ReportDesign2, ctx: ReportContext2): Array<{
  id: string;
  label: string;
  preview: string;
  enabled: boolean;
  order: number;
  category: string;
}> {
  const lang = design.language;

  return design.sections
    .sort((a, b) => a.order - b.order)
    .map(s => ({
      id: s.id,
      label: lang === 'zh' ? s.labelZh : s.label,
      preview: lang === 'zh' ? s.previewZh(ctx) : s.preview(ctx),
      enabled: s.enabled,
      order: s.order,
      category: s.category
    }));
}

// ==================== HELPERS ====================

function getElementForStem(stem: string): string | undefined {
  const stemElements: Record<string, string> = {
    'Jia': 'Wood', '甲': 'Wood',
    'Yi': 'Wood', '乙': 'Wood',
    'Bing': 'Fire', '丙': 'Fire',
    'Ding': 'Fire', '丁': 'Fire',
    'Wu': 'Earth', '戊': 'Earth',
    'Ji': 'Earth', '己': 'Earth',
    'Geng': 'Metal', '庚': 'Metal',
    'Xin': 'Metal', '辛': 'Metal',
    'Ren': 'Water', '壬': 'Water',
    'Gui': 'Water', '癸': 'Water'
  };
  return stemElements[stem];
}

// ==================== EXPORTS ====================

export {
  buildProReportSections2,
  createReportDesign2,
  toggleSection2,
  reorderSections2,
  setSectionOrder2,
  generateReport2,
  getSectionPreviews2
};
