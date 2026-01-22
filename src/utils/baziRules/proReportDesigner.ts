/**
 * ============================================
 * PRO REPORT DESIGNER
 * A drag-and-drop, toggle-based report builder
 * that lets the user choose sections:
 * - Technical
 * - Narrative
 * - Ancestral
 * - Mythos
 * - Profiling
 * - Constellation
 * - Ritual
 * - Hypergraph
 *
 * This is the report designer Joey Yap's
 * platform doesn't have.
 * ============================================
 */

// ==================== DATA MODEL ====================

export type SectionType =
  | 'technical'
  | 'narrative'
  | 'ancestral'
  | 'mythos'
  | 'profiling'
  | 'constellation'
  | 'ritual'
  | 'hypergraph'
  | 'interactions'
  | 'luck_pillars'
  | 'annual'
  | 'monthly'
  | 'useful_god'
  | 'team'
  | 'custom';

export interface ReportSection {
  id: string;
  type: SectionType;
  label: string;
  labelZh?: string;
  enabled: boolean;
  order: number;
  renderer: () => string;
  options?: SectionOptions;
}

export interface SectionOptions {
  lang?: 'en' | 'zh';
  format?: 'markdown' | 'html';
  includeCharts?: boolean;
  includeImages?: boolean;
  detailLevel?: 'summary' | 'standard' | 'detailed';
}

export interface ReportDesign {
  id: string;
  name: string;
  nameZh?: string;
  sections: ReportSection[];
  globalOptions: GlobalReportOptions;
  createdAt: number;
  updatedAt: number;
}

export interface GlobalReportOptions {
  lang: 'en' | 'zh';
  format: 'markdown' | 'html' | 'pdf';
  includeTableOfContents: boolean;
  includePageNumbers: boolean;
  theme: 'professional' | 'mystical' | 'minimal';
  branding?: {
    logo?: string;
    company?: string;
    footer?: string;
  };
}

export interface GeneratedReport {
  design: ReportDesign;
  content: string;
  generatedAt: number;
  metadata: ReportMetadata;
}

export interface ReportMetadata {
  sectionCount: number;
  wordCount: number;
  estimatedPages: number;
  format: string;
}

// ==================== DEFAULT SECTIONS ====================

/**
 * Get default section definitions
 */
export function getDefaultSections(): Omit<ReportSection, 'renderer'>[] {
  return [
    {
      id: 'technical',
      type: 'technical',
      label: 'Technical Analysis',
      labelZh: '技术分析',
      enabled: true,
      order: 1
    },
    {
      id: 'narrative',
      type: 'narrative',
      label: 'Narrative Cockpit',
      labelZh: '叙事驾驶舱',
      enabled: true,
      order: 2
    },
    {
      id: 'ancestral',
      type: 'ancestral',
      label: 'Ancestral Temple',
      labelZh: '祖先庙堂',
      enabled: true,
      order: 3
    },
    {
      id: 'mythos',
      type: 'mythos',
      label: 'Mythos Codex',
      labelZh: '神话典籍',
      enabled: true,
      order: 4
    },
    {
      id: 'profiling',
      type: 'profiling',
      label: 'Personality Profiling',
      labelZh: '个性画像',
      enabled: true,
      order: 5
    },
    {
      id: 'constellation',
      type: 'constellation',
      label: 'Constellation',
      labelZh: '星座关系',
      enabled: false,
      order: 6
    },
    {
      id: 'ritual',
      type: 'ritual',
      label: 'Ritual Recommendations',
      labelZh: '仪式建议',
      enabled: false,
      order: 7
    },
    {
      id: 'hypergraph',
      type: 'hypergraph',
      label: 'Hypergraph Analysis',
      labelZh: '超图分析',
      enabled: false,
      order: 8
    },
    {
      id: 'interactions',
      type: 'interactions',
      label: 'Pillar Interactions',
      labelZh: '四柱互动',
      enabled: true,
      order: 9
    },
    {
      id: 'luck_pillars',
      type: 'luck_pillars',
      label: 'Luck Pillars',
      labelZh: '大运分析',
      enabled: true,
      order: 10
    },
    {
      id: 'annual',
      type: 'annual',
      label: 'Annual Analysis',
      labelZh: '流年分析',
      enabled: true,
      order: 11
    },
    {
      id: 'useful_god',
      type: 'useful_god',
      label: 'Useful God Analysis',
      labelZh: '用神分析',
      enabled: true,
      order: 12
    }
  ];
}

// ==================== DESIGN MANAGEMENT ====================

/**
 * Create a new report design
 */
export function createReportDesign(
  name: string,
  nameZh?: string,
  options?: Partial<GlobalReportOptions>
): ReportDesign {
  const now = Date.now();
  const defaultSections = getDefaultSections();

  return {
    id: `design-${now}`,
    name,
    nameZh,
    sections: defaultSections.map(s => ({
      ...s,
      renderer: () => `[${s.label} content placeholder]`
    })),
    globalOptions: {
      lang: 'en',
      format: 'markdown',
      includeTableOfContents: true,
      includePageNumbers: false,
      theme: 'professional',
      ...options
    },
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Toggle a section's enabled status
 */
export function toggleSection(
  design: ReportDesign,
  sectionId: string
): ReportDesign {
  return {
    ...design,
    sections: design.sections.map(s =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    ),
    updatedAt: Date.now()
  };
}

/**
 * Reorder sections
 */
export function reorderSections(
  design: ReportDesign,
  sectionId: string,
  newOrder: number
): ReportDesign {
  const sections = [...design.sections];
  const sectionIndex = sections.findIndex(s => s.id === sectionId);

  if (sectionIndex === -1) return design;

  const [section] = sections.splice(sectionIndex, 1);
  section.order = newOrder;

  // Insert at new position
  const insertIndex = sections.findIndex(s => s.order >= newOrder);
  if (insertIndex === -1) {
    sections.push(section);
  } else {
    sections.splice(insertIndex, 0, section);
  }

  // Renumber all sections
  sections.forEach((s, i) => {
    s.order = i + 1;
  });

  return {
    ...design,
    sections,
    updatedAt: Date.now()
  };
}

/**
 * Update section options
 */
export function updateSectionOptions(
  design: ReportDesign,
  sectionId: string,
  options: Partial<SectionOptions>
): ReportDesign {
  return {
    ...design,
    sections: design.sections.map(s =>
      s.id === sectionId
        ? { ...s, options: { ...s.options, ...options } }
        : s
    ),
    updatedAt: Date.now()
  };
}

/**
 * Update global options
 */
export function updateGlobalOptions(
  design: ReportDesign,
  options: Partial<GlobalReportOptions>
): ReportDesign {
  return {
    ...design,
    globalOptions: { ...design.globalOptions, ...options },
    updatedAt: Date.now()
  };
}

/**
 * Add a custom section
 */
export function addCustomSection(
  design: ReportDesign,
  label: string,
  labelZh: string,
  renderer: () => string
): ReportDesign {
  const maxOrder = Math.max(...design.sections.map(s => s.order), 0);

  return {
    ...design,
    sections: [
      ...design.sections,
      {
        id: `custom-${Date.now()}`,
        type: 'custom',
        label,
        labelZh,
        enabled: true,
        order: maxOrder + 1,
        renderer
      }
    ],
    updatedAt: Date.now()
  };
}

/**
 * Remove a section
 */
export function removeSection(
  design: ReportDesign,
  sectionId: string
): ReportDesign {
  return {
    ...design,
    sections: design.sections.filter(s => s.id !== sectionId),
    updatedAt: Date.now()
  };
}

// ==================== REPORT GENERATION ====================

/**
 * Generate custom report from design
 */
export function generateCustomReport(design: ReportDesign): GeneratedReport {
  const enabledSections = design.sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const { lang, format, includeTableOfContents, theme } = design.globalOptions;
  const lines: string[] = [];

  // Header
  if (format === 'markdown') {
    lines.push(`# ${lang === 'zh' && design.nameZh ? design.nameZh : design.name}`);
    lines.push('');
    lines.push(`*${lang === 'zh' ? '生成于' : 'Generated on'} ${new Date().toLocaleDateString()}*`);
    lines.push('');
  } else if (format === 'html') {
    lines.push(`<h1>${lang === 'zh' && design.nameZh ? design.nameZh : design.name}</h1>`);
    lines.push(`<p class="timestamp">${lang === 'zh' ? '生成于' : 'Generated on'} ${new Date().toLocaleDateString()}</p>`);
  }

  // Table of Contents
  if (includeTableOfContents) {
    lines.push(generateTableOfContents(enabledSections, lang, format));
    lines.push('');
  }

  // Sections
  enabledSections.forEach((section, index) => {
    const sectionLabel = lang === 'zh' && section.labelZh ? section.labelZh : section.label;

    if (format === 'markdown') {
      lines.push(`## ${index + 1}. ${sectionLabel}`);
      lines.push('');
      lines.push(section.renderer());
      lines.push('');
      lines.push('---');
      lines.push('');
    } else if (format === 'html') {
      lines.push(`<section id="${section.id}" class="report-section ${theme}">`);
      lines.push(`<h2>${index + 1}. ${sectionLabel}</h2>`);
      lines.push(section.renderer());
      lines.push('</section>');
    }
  });

  // Footer
  if (design.globalOptions.branding?.footer) {
    if (format === 'markdown') {
      lines.push('---');
      lines.push(design.globalOptions.branding.footer);
    } else {
      lines.push(`<footer class="report-footer">${design.globalOptions.branding.footer}</footer>`);
    }
  }

  const content = lines.join('\n');
  const wordCount = content.split(/\s+/).length;

  return {
    design,
    content,
    generatedAt: Date.now(),
    metadata: {
      sectionCount: enabledSections.length,
      wordCount,
      estimatedPages: Math.ceil(wordCount / 500),
      format
    }
  };
}

/**
 * Generate table of contents
 */
function generateTableOfContents(
  sections: ReportSection[],
  lang: 'en' | 'zh',
  format: 'markdown' | 'html' | 'pdf'
): string {
  const title = lang === 'zh' ? '目录' : 'Table of Contents';

  if (format === 'markdown') {
    const lines = [`### ${title}`, ''];
    sections.forEach((s, i) => {
      const label = lang === 'zh' && s.labelZh ? s.labelZh : s.label;
      lines.push(`${i + 1}. [${label}](#${s.id})`);
    });
    return lines.join('\n');
  } else {
    const items = sections.map((s, i) => {
      const label = lang === 'zh' && s.labelZh ? s.labelZh : s.label;
      return `<li><a href="#${s.id}">${i + 1}. ${label}</a></li>`;
    }).join('');
    return `<nav class="toc"><h3>${title}</h3><ol>${items}</ol></nav>`;
  }
}

// ==================== PRESETS ====================

/**
 * Get preset report designs
 */
export function getReportPresets(): ReportDesign[] {
  return [
    createQuickReadingPreset(),
    createFullAnalysisPreset(),
    createTeamReportPreset(),
    createSpiritualJourneyPreset()
  ];
}

function createQuickReadingPreset(): ReportDesign {
  const design = createReportDesign('Quick Reading', '快速阅读');
  return {
    ...design,
    sections: design.sections.map(s => ({
      ...s,
      enabled: ['technical', 'narrative', 'profiling'].includes(s.id)
    }))
  };
}

function createFullAnalysisPreset(): ReportDesign {
  const design = createReportDesign('Full Analysis', '完整分析');
  return {
    ...design,
    sections: design.sections.map(s => ({
      ...s,
      enabled: true
    }))
  };
}

function createTeamReportPreset(): ReportDesign {
  const design = createReportDesign('Team Report', '团队报告');
  return {
    ...design,
    sections: design.sections.map(s => ({
      ...s,
      enabled: ['profiling', 'constellation', 'interactions'].includes(s.id)
    }))
  };
}

function createSpiritualJourneyPreset(): ReportDesign {
  const design = createReportDesign('Spiritual Journey', '灵性之旅');
  return {
    ...design,
    sections: design.sections.map(s => ({
      ...s,
      enabled: ['ancestral', 'mythos', 'ritual', 'hypergraph'].includes(s.id)
    }))
  };
}

// ==================== UI RENDERING ====================

/**
 * Render report designer UI as HTML
 */
export function renderReportDesignerHtml(
  design: ReportDesign,
  lang: 'en' | 'zh' = 'en'
): string {
  const renderSectionToggle = (s: ReportSection) => {
    const label = lang === 'zh' && s.labelZh ? s.labelZh : s.label;
    return `
      <div class="section-toggle" data-id="${s.id}" draggable="true">
        <input type="checkbox" id="toggle-${s.id}" ${s.enabled ? 'checked' : ''}>
        <label for="toggle-${s.id}">${label}</label>
        <span class="drag-handle">⋮⋮</span>
      </div>
    `;
  };

  return `
<div class="report-designer">
  <h2>${lang === 'zh' ? '报告设计器' : 'Pro Report Designer'}</h2>

  <div class="designer-layout">
    <div class="section-list">
      <h3>${lang === 'zh' ? '可用章节' : 'Available Sections'}</h3>
      <p class="hint">${lang === 'zh' ? '拖拽排序，勾选启用' : 'Drag to reorder, check to enable'}</p>
      ${design.sections
        .sort((a, b) => a.order - b.order)
        .map(renderSectionToggle)
        .join('')}
    </div>

    <div class="global-options">
      <h3>${lang === 'zh' ? '全局选项' : 'Global Options'}</h3>

      <label>
        ${lang === 'zh' ? '语言' : 'Language'}:
        <select id="opt-lang">
          <option value="en" ${design.globalOptions.lang === 'en' ? 'selected' : ''}>English</option>
          <option value="zh" ${design.globalOptions.lang === 'zh' ? 'selected' : ''}>中文</option>
        </select>
      </label>

      <label>
        ${lang === 'zh' ? '格式' : 'Format'}:
        <select id="opt-format">
          <option value="markdown" ${design.globalOptions.format === 'markdown' ? 'selected' : ''}>Markdown</option>
          <option value="html" ${design.globalOptions.format === 'html' ? 'selected' : ''}>HTML</option>
          <option value="pdf" ${design.globalOptions.format === 'pdf' ? 'selected' : ''}>PDF</option>
        </select>
      </label>

      <label>
        ${lang === 'zh' ? '主题' : 'Theme'}:
        <select id="opt-theme">
          <option value="professional" ${design.globalOptions.theme === 'professional' ? 'selected' : ''}>${lang === 'zh' ? '专业' : 'Professional'}</option>
          <option value="mystical" ${design.globalOptions.theme === 'mystical' ? 'selected' : ''}>${lang === 'zh' ? '神秘' : 'Mystical'}</option>
          <option value="minimal" ${design.globalOptions.theme === 'minimal' ? 'selected' : ''}>${lang === 'zh' ? '简约' : 'Minimal'}</option>
        </select>
      </label>

      <label>
        <input type="checkbox" id="opt-toc" ${design.globalOptions.includeTableOfContents ? 'checked' : ''}>
        ${lang === 'zh' ? '包含目录' : 'Include Table of Contents'}
      </label>
    </div>
  </div>

  <div class="designer-actions">
    <button id="generate-report" class="primary">
      ${lang === 'zh' ? '生成报告' : 'Generate Report'}
    </button>
    <button id="preview-report">
      ${lang === 'zh' ? '预览' : 'Preview'}
    </button>
    <button id="save-design">
      ${lang === 'zh' ? '保存设计' : 'Save Design'}
    </button>
  </div>

  <div class="report-preview" id="report-preview" style="display: none;">
    <h3>${lang === 'zh' ? '预览' : 'Preview'}</h3>
    <pre id="report-output"></pre>
  </div>
</div>

<style>
${getReportDesignerStyles()}
</style>

<script>
${getReportDesignerScript()}
</script>
  `.trim();
}

/**
 * Get styles for report designer
 */
export function getReportDesignerStyles(): string {
  return `
.report-designer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.designer-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin: 24px 0;
}

.section-list, .global-options {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.section-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  margin: 8px 0;
  cursor: grab;
}

.section-toggle:active {
  cursor: grabbing;
}

.drag-handle {
  margin-left: auto;
  color: #999;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}

.global-options label {
  display: block;
  margin: 12px 0;
}

.global-options select {
  margin-left: 8px;
  padding: 4px 8px;
}

.designer-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.designer-actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.designer-actions button.primary {
  background: #4a90d9;
  color: white;
}

.designer-actions button:not(.primary) {
  background: #e0e0e0;
}

.report-preview {
  margin-top: 24px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
}

#report-output {
  background: white;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}
  `.trim();
}

/**
 * Get script for report designer
 */
export function getReportDesignerScript(): string {
  return `
(function() {
  const sectionToggles = document.querySelectorAll('.section-toggle input[type="checkbox"]');

  sectionToggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const sectionId = this.closest('.section-toggle').dataset.id;
      console.log('Toggle section:', sectionId, this.checked);
      // Dispatch custom event for external handling
      document.dispatchEvent(new CustomEvent('section-toggle', {
        detail: { sectionId, enabled: this.checked }
      }));
    });
  });

  // Drag and drop
  const sectionList = document.querySelector('.section-list');
  let draggedEl = null;

  sectionList.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('section-toggle')) {
      draggedEl = e.target;
      e.target.style.opacity = '0.5';
    }
  });

  sectionList.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('section-toggle')) {
      e.target.style.opacity = '1';
      draggedEl = null;
    }
  });

  sectionList.addEventListener('dragover', function(e) {
    e.preventDefault();
    const afterEl = getDragAfterElement(sectionList, e.clientY);
    if (afterEl && draggedEl) {
      sectionList.insertBefore(draggedEl, afterEl);
    }
  });

  function getDragAfterElement(container, y) {
    const draggables = [...container.querySelectorAll('.section-toggle:not(.dragging)')];
    return draggables.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Generate button
  document.getElementById('generate-report')?.addEventListener('click', function() {
    document.getElementById('report-preview').style.display = 'block';
    document.dispatchEvent(new CustomEvent('generate-report'));
  });

  // Preview button
  document.getElementById('preview-report')?.addEventListener('click', function() {
    const preview = document.getElementById('report-preview');
    preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
  });
})();
  `.trim();
}

// ==================== EXPORTS ====================

export {
  createReportDesign,
  toggleSection,
  reorderSections,
  updateSectionOptions,
  updateGlobalOptions,
  addCustomSection,
  removeSection,
  generateCustomReport,
  getReportPresets,
  getDefaultSections,
  renderReportDesignerHtml,
  getReportDesignerStyles,
  getReportDesignerScript
};
