/**
 * ============================================
 * PRO REPORT DESIGNER 5.0
 * Collaborative Writing Environment
 *
 * Features:
 * - Collaborative sections with version history
 * - AI co-writing (rewrite, expand, compress, clarify)
 * - Git-like revision tracking
 * - Accept/reject suggestions
 * - Rollback to any version
 * - Author attribution
 * ============================================
 */

import { applyTone, type TonePreset } from './tonePresets';

// ==================== TYPES ====================

export interface RevisionEntry {
  version: number;
  author: 'user' | 'ai';
  authorId?: string;
  authorName?: string;
  timestamp: number;
  content: string;
  contentZh: string;
  note?: string;
  noteZh?: string;
}

export interface CollaborativeSection {
  id: string;
  label: string;
  labelZh: string;
  content: string;
  contentZh: string;
  suggestions: SectionSuggestion[];
  revisions: RevisionEntry[];
  isLocked: boolean;
  lockedBy?: string;
}

export interface SectionSuggestion {
  id: string;
  mode: CoWriteMode;
  suggestion: string;
  suggestionZh: string;
  rationale: string;
  rationaleZh: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export type CoWriteMode = 'rewrite' | 'expand' | 'compress' | 'clarify' | 'alternative' | 'tone_shift';

export interface CoWriteRequest {
  section: CollaborativeSection;
  ctx: any;
  tone: TonePreset;
  mode: CoWriteMode;
  targetTone?: TonePreset;
  language?: 'en' | 'zh';
}

export interface CoWriteResponse {
  suggestion: string;
  suggestionZh: string;
  rationale: string;
  rationaleZh: string;
}

export interface CollaborativeReport {
  id: string;
  title: string;
  titleZh: string;
  sections: CollaborativeSection[];
  currentTone: TonePreset;
  createdAt: Date;
  updatedAt: Date;
  language: 'en' | 'zh';
}

// ==================== CO-WRITING ENGINE ====================

/**
 * AI co-writing engine for section transformations
 */
export function coWrite(req: CoWriteRequest): CoWriteResponse {
  const { section, tone, mode, targetTone, language = 'en' } = req;

  const rationales: Record<CoWriteMode, { en: string; zh: string }> = {
    rewrite: {
      en: 'Improves clarity, flow, and readability while preserving meaning.',
      zh: '提高清晰度、流畅性和可读性，同时保留含义。'
    },
    expand: {
      en: 'Adds depth, interpretation, and supporting details.',
      zh: '增加深度、解释和支持细节。'
    },
    compress: {
      en: 'Removes redundancy and tightens the prose.',
      zh: '删除冗余并紧凑文字。'
    },
    clarify: {
      en: 'Explains technical terms and complex concepts.',
      zh: '解释技术术语和复杂概念。'
    },
    alternative: {
      en: 'Provides stylistic variation with fresh phrasing.',
      zh: '提供新措辞的风格变化。'
    },
    tone_shift: {
      en: `Transforms content to ${targetTone || 'professional'} tone.`,
      zh: `将内容转换为${targetTone || 'professional'}语调。`
    }
  };

  const content = language === 'zh' ? section.contentZh : section.content;
  const transformedContent = applyCoWriteTransform(content, tone, mode, targetTone, language);

  return {
    suggestion: language === 'zh' ? content : transformedContent,
    suggestionZh: language === 'zh' ? transformedContent : section.contentZh,
    rationale: rationales[mode].en,
    rationaleZh: rationales[mode].zh
  };
}

/**
 * Apply co-write transformation to content
 */
function applyCoWriteTransform(
  text: string,
  tone: TonePreset,
  mode: CoWriteMode,
  targetTone?: TonePreset,
  language: 'en' | 'zh' = 'en'
): string {
  let result = text;

  switch (mode) {
    case 'rewrite':
      // Improve sentence structure
      result = rewriteForClarity(result, language);
      break;

    case 'expand':
      // Add depth and detail
      result = expandContent(result, language);
      break;

    case 'compress':
      // Remove redundancy
      result = compressContent(result, language);
      break;

    case 'clarify':
      // Add explanations
      result = clarifyContent(result, language);
      break;

    case 'alternative':
      // Rephrase
      result = alternativePhrasings(result, language);
      break;

    case 'tone_shift':
      // Apply new tone
      if (targetTone) {
        result = applyTone(result, targetTone, language);
      }
      break;
  }

  return result;
}

/**
 * Rewrite for clarity
 */
function rewriteForClarity(text: string, language: 'en' | 'zh'): string {
  if (language === 'zh') {
    return text
      .replace(/并且/g, '，')
      .replace(/但是/g, '然而')
      .replace(/因为/g, '由于')
      .replace(/所以/g, '因此');
  }

  return text
    .replace(/\band\s+also\b/gi, 'and')
    .replace(/\bin order to\b/gi, 'to')
    .replace(/\bdue to the fact that\b/gi, 'because')
    .replace(/\bat this point in time\b/gi, 'now')
    .replace(/\bhas the ability to\b/gi, 'can')
    .replace(/\bit is important to note that\b/gi, 'notably,');
}

/**
 * Expand content with depth
 */
function expandContent(text: string, language: 'en' | 'zh'): string {
  const paragraphs = text.split('\n\n');

  if (language === 'zh') {
    return paragraphs.map(p => {
      if (p.length < 50) return p;
      return p + '\n\n这意味着在实践中，你可以通过有意识地关注这些模式来增强你的自我认识和决策能力。';
    }).join('\n\n');
  }

  return paragraphs.map(p => {
    if (p.length < 50) return p;
    return p + '\n\nIn practical terms, this means you can enhance your self-awareness and decision-making by consciously attending to these patterns.';
  }).join('\n\n');
}

/**
 * Compress content by removing redundancy
 */
function compressContent(text: string, language: 'en' | 'zh'): string {
  if (language === 'zh') {
    return text
      .replace(/非常非常/g, '非常')
      .replace(/基本上来说/g, '')
      .replace(/事实上/g, '')
      .replace(/实际上/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return text
    .replace(/\bvery\s+very\b/gi, 'very')
    .replace(/\bbasically\b/gi, '')
    .replace(/\bactually\b/gi, '')
    .replace(/\bin fact\b/gi, '')
    .replace(/\bkind of\b/gi, '')
    .replace(/\bsort of\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clarify technical terms
 */
function clarifyContent(text: string, language: 'en' | 'zh'): string {
  const clarifications: Record<string, { en: string; zh: string }> = {
    '十神': {
      en: 'Ten Gods (the relationship roles in your chart)',
      zh: '十神（命盘中的关系角色）'
    },
    'Ten Gods': {
      en: 'Ten Gods (the relationship roles in your chart)',
      zh: '十神（命盘中的关系角色）'
    },
    '用神': {
      en: 'Useful God (your beneficial element)',
      zh: '用神（对你有益的元素）'
    },
    'Useful God': {
      en: 'Useful God (your beneficial element)',
      zh: '用神（对你有益的元素）'
    },
    '大运': {
      en: 'Luck Pillar (10-year cycle)',
      zh: '大运（十年周期）'
    },
    'Luck Pillar': {
      en: 'Luck Pillar (10-year cycle)',
      zh: '大运（十年周期）'
    },
    '神煞': {
      en: 'Shen Sha (special stars)',
      zh: '神煞（特殊星辰）'
    },
    'Shen Sha': {
      en: 'Shen Sha (special stars)',
      zh: '神煞（特殊星辰）'
    }
  };

  let result = text;

  for (const [term, explanation] of Object.entries(clarifications)) {
    const replacement = language === 'zh' ? explanation.zh : explanation.en;
    result = result.replace(new RegExp(term, 'g'), replacement);
  }

  return result;
}

/**
 * Generate alternative phrasings
 */
function alternativePhrasings(text: string, language: 'en' | 'zh'): string {
  if (language === 'zh') {
    return text
      .replace(/显示/g, '表明')
      .replace(/表示/g, '暗示')
      .replace(/认为/g, '相信')
      .replace(/发现/g, '观察到');
  }

  return text
    .replace(/\bshows\b/gi, 'reveals')
    .replace(/\bindicates\b/gi, 'suggests')
    .replace(/\bthink\b/gi, 'believe')
    .replace(/\bfind\b/gi, 'discover')
    .replace(/\bgood\b/gi, 'favorable')
    .replace(/\bbad\b/gi, 'challenging');
}

// ==================== VERSION HISTORY ====================

/**
 * Add a new revision to section history
 */
export function addRevision(
  section: CollaborativeSection,
  author: 'user' | 'ai',
  newContent: string,
  newContentZh: string,
  note?: string,
  noteZh?: string,
  authorId?: string,
  authorName?: string
): CollaborativeSection {
  const version = section.revisions.length + 1;

  const revision: RevisionEntry = {
    version,
    author,
    authorId,
    authorName,
    timestamp: Date.now(),
    content: newContent,
    contentZh: newContentZh,
    note,
    noteZh
  };

  return {
    ...section,
    content: newContent,
    contentZh: newContentZh,
    revisions: [...section.revisions, revision]
  };
}

/**
 * Revert section to a specific version
 */
export function revertToVersion(
  section: CollaborativeSection,
  version: number
): CollaborativeSection {
  const entry = section.revisions.find(r => r.version === version);

  if (!entry) return section;

  // Add a new revision noting the revert
  return addRevision(
    section,
    'user',
    entry.content,
    entry.contentZh,
    `Reverted to version ${version}`,
    `恢复到版本 ${version}`
  );
}

/**
 * Get revision diff between two versions
 */
export function getRevisionDiff(
  section: CollaborativeSection,
  fromVersion: number,
  toVersion: number
): { added: string[]; removed: string[] } {
  const fromEntry = section.revisions.find(r => r.version === fromVersion);
  const toEntry = section.revisions.find(r => r.version === toVersion);

  if (!fromEntry || !toEntry) {
    return { added: [], removed: [] };
  }

  const fromLines = fromEntry.content.split('\n');
  const toLines = toEntry.content.split('\n');

  const added = toLines.filter(line => !fromLines.includes(line));
  const removed = fromLines.filter(line => !toLines.includes(line));

  return { added, removed };
}

/**
 * Get revision history summary
 */
export function getRevisionSummary(section: CollaborativeSection): Array<{
  version: number;
  author: string;
  timestamp: string;
  note: string;
}> {
  return section.revisions.map(r => ({
    version: r.version,
    author: r.authorName || r.author,
    timestamp: new Date(r.timestamp).toLocaleString(),
    note: r.note || ''
  }));
}

// ==================== SUGGESTION MANAGEMENT ====================

/**
 * Add a suggestion to a section
 */
export function addSuggestion(
  section: CollaborativeSection,
  response: CoWriteResponse,
  mode: CoWriteMode
): CollaborativeSection {
  const suggestion: SectionSuggestion = {
    id: `sug_${Date.now()}`,
    mode,
    suggestion: response.suggestion,
    suggestionZh: response.suggestionZh,
    rationale: response.rationale,
    rationaleZh: response.rationaleZh,
    timestamp: Date.now(),
    status: 'pending'
  };

  return {
    ...section,
    suggestions: [...section.suggestions, suggestion]
  };
}

/**
 * Accept a suggestion
 */
export function acceptSuggestion(
  section: CollaborativeSection,
  suggestionId: string
): CollaborativeSection {
  const suggestion = section.suggestions.find(s => s.id === suggestionId);

  if (!suggestion || suggestion.status !== 'pending') {
    return section;
  }

  // Update suggestion status
  const updatedSuggestions = section.suggestions.map(s =>
    s.id === suggestionId ? { ...s, status: 'accepted' as const } : s
  );

  // Add revision
  return addRevision(
    { ...section, suggestions: updatedSuggestions },
    'ai',
    suggestion.suggestion,
    suggestion.suggestionZh,
    `Accepted AI ${suggestion.mode} suggestion`,
    `接受了AI ${suggestion.mode} 建议`
  );
}

/**
 * Reject a suggestion
 */
export function rejectSuggestion(
  section: CollaborativeSection,
  suggestionId: string
): CollaborativeSection {
  return {
    ...section,
    suggestions: section.suggestions.map(s =>
      s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
    )
  };
}

/**
 * Get pending suggestions
 */
export function getPendingSuggestions(section: CollaborativeSection): SectionSuggestion[] {
  return section.suggestions.filter(s => s.status === 'pending');
}

// ==================== COLLABORATIVE REPORT ====================

/**
 * Initialize collaborative report from auto-generated report
 */
export function initCollaborativeReport(
  autoReport: any,
  language: 'en' | 'zh' = 'en'
): CollaborativeReport {
  const sections: CollaborativeSection[] = autoReport.sections.map((sec: any) => ({
    id: sec.id,
    label: sec.label,
    labelZh: sec.labelZh,
    content: sec.content,
    contentZh: sec.contentZh,
    suggestions: [],
    revisions: [{
      version: 1,
      author: 'ai' as const,
      timestamp: Date.now(),
      content: sec.content,
      contentZh: sec.contentZh,
      note: 'Initial auto-generation',
      noteZh: '初始自动生成'
    }],
    isLocked: false
  }));

  return {
    id: `collab_${Date.now()}`,
    title: 'BaZi Pro Report',
    titleZh: '八字专业报告',
    sections,
    currentTone: autoReport.tone || 'professional',
    createdAt: new Date(),
    updatedAt: new Date(),
    language
  };
}

/**
 * Update section content (user edit)
 */
export function updateSectionContent(
  report: CollaborativeReport,
  sectionId: string,
  newContent: string,
  newContentZh: string
): CollaborativeReport {
  return {
    ...report,
    updatedAt: new Date(),
    sections: report.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return addRevision(sec, 'user', newContent, newContentZh, 'User edit', '用户编辑');
    })
  };
}

/**
 * Request AI suggestion for a section
 */
export function requestAISuggestion(
  report: CollaborativeReport,
  sectionId: string,
  mode: CoWriteMode,
  ctx: any
): CollaborativeReport {
  const section = report.sections.find(s => s.id === sectionId);

  if (!section) return report;

  const response = coWrite({
    section,
    ctx,
    tone: report.currentTone,
    mode,
    language: report.language
  });

  return {
    ...report,
    updatedAt: new Date(),
    sections: report.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return addSuggestion(sec, response, mode);
    })
  };
}

/**
 * Lock a section for editing
 */
export function lockSection(
  report: CollaborativeReport,
  sectionId: string,
  userId: string
): CollaborativeReport {
  return {
    ...report,
    sections: report.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, isLocked: true, lockedBy: userId };
    })
  };
}

/**
 * Unlock a section
 */
export function unlockSection(
  report: CollaborativeReport,
  sectionId: string
): CollaborativeReport {
  return {
    ...report,
    sections: report.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, isLocked: false, lockedBy: undefined };
    })
  };
}

/**
 * Change report tone (applies to all sections)
 */
export function changeReportTone(
  report: CollaborativeReport,
  newTone: TonePreset,
  ctx: any
): CollaborativeReport {
  return {
    ...report,
    currentTone: newTone,
    updatedAt: new Date(),
    sections: report.sections.map(sec => {
      const response = coWrite({
        section: sec,
        ctx,
        tone: report.currentTone,
        mode: 'tone_shift',
        targetTone: newTone,
        language: report.language
      });

      return addRevision(
        sec,
        'ai',
        response.suggestion,
        response.suggestionZh,
        `Tone changed to ${newTone}`,
        `语调改为 ${newTone}`
      );
    })
  };
}

/**
 * Render collaborative report as markdown
 */
export function renderCollaborativeReport(
  report: CollaborativeReport,
  options: { includeHistory?: boolean } = {}
): string {
  const lang = report.language;
  let output = '';

  output += `# ${lang === 'zh' ? report.titleZh : report.title}\n\n`;
  output += `*Last updated: ${report.updatedAt.toLocaleString()}*\n\n`;

  for (const section of report.sections) {
    const content = lang === 'zh' ? section.contentZh : section.content;
    output += `${content}\n\n`;

    if (options.includeHistory && section.revisions.length > 1) {
      output += `> *${section.revisions.length} revisions*\n\n`;
    }

    output += `---\n\n`;
  }

  return output;
}

// ==================== EXPORTS ====================

export {
  coWrite,
  addRevision,
  revertToVersion,
  getRevisionDiff,
  getRevisionSummary,
  addSuggestion,
  acceptSuggestion,
  rejectSuggestion,
  getPendingSuggestions,
  initCollaborativeReport,
  updateSectionContent,
  requestAISuggestion,
  lockSection,
  unlockSection,
  changeReportTone,
  renderCollaborativeReport
};
