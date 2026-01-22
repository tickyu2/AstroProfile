/**
 * ============================================================================
 * AI NARRATIVE ENHANCER (叙事增强器)
 * ============================================================================
 *
 * LLM-powered narrative expansion system for Composite Forecast Reports.
 * Transforms structured BaZi analysis into rich, personalized prose with
 * configurable tone and depth variants.
 *
 * Features:
 * - Chapter extraction from report generator output
 * - Tone variants: gentle, neutral, technical, poetic
 * - Depth variants: beginner, intermediate, expert
 * - Per-chapter system prompts
 * - Metadata injection for personalization
 *
 * Integration:
 * - Works with any LLM provider (OpenAI, Anthropic, etc.)
 * - Returns structured enhanced content
 * - Supports streaming for real-time enhancement
 *
 * Created: January 2026
 * ============================================================================
 */

import type { CompositeForecastReport, ReportChapter, PartnerInfo } from './baziCompositeForecastReport';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Narrative tone variants
 */
export type NarrativeTone = 'gentle' | 'neutral' | 'technical' | 'poetic';

/**
 * Narrative depth variants
 */
export type NarrativeDepth = 'beginner' | 'intermediate' | 'expert';

/**
 * Enhancement options
 */
export interface NarrativeEnhanceOptions {
  tone: NarrativeTone;
  depth: NarrativeDepth;
  includeMetaphors?: boolean;
  includeAdvice?: boolean;
  maxTokensPerChapter?: number;
  language?: 'en' | 'zh' | 'bilingual';
  personalizationLevel?: 'minimal' | 'moderate' | 'deep';
}

/**
 * Chapter text for enhancement
 */
export interface ChapterText {
  chapterNumber: number;
  title: string;
  titleChinese: string;
  originalContent: string;
  highlights: string[];
  data: Record<string, unknown>;
}

/**
 * Enhanced chapter output
 */
export interface EnhancedChapter {
  chapterNumber: number;
  title: string;
  titleChinese: string;
  enhancedContent: string;
  originalContent: string;
  tone: NarrativeTone;
  depth: NarrativeDepth;
  wordCount: number;
  enhancementMetadata: {
    promptUsed: string;
    contextInjected: string[];
    processingTimeMs?: number;
  };
}

/**
 * Full enhanced report
 */
export interface EnhancedReport {
  title: string;
  titleChinese: string;
  subtitle: string;
  partnerA: PartnerInfo;
  partnerB: PartnerInfo;
  chapters: EnhancedChapter[];
  summary: string;
  enhancedSummary: string;
  options: NarrativeEnhanceOptions;
  generatedAt: Date;
  enhancedAt: Date;
  fullEnhancedNarrative: string;
}

/**
 * LLM provider interface
 */
export interface LLMProvider {
  generateCompletion: (prompt: string, systemPrompt: string, maxTokens?: number) => Promise<string>;
  streamCompletion?: (prompt: string, systemPrompt: string, onChunk: (chunk: string) => void) => Promise<void>;
}

/**
 * Enhancement context
 */
export interface EnhancementContext {
  partnerAName: string;
  partnerBName: string;
  compositeElement: string;
  usefulGod: string;
  currentPhase: string;
  archetype: string;
  relationshipAge?: number;
  specialDates?: { label: string; date: string }[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Tone descriptions for prompt building
 */
export const TONE_DESCRIPTIONS: Record<NarrativeTone, {
  style: string;
  vocabulary: string;
  approach: string;
  example: string;
}> = {
  gentle: {
    style: 'warm, nurturing, and supportive',
    vocabulary: 'soft, encouraging words with emotional sensitivity',
    approach: 'compassionate guidance that validates feelings',
    example: 'The gentle dance of your charts reveals a beautiful truth...'
  },
  neutral: {
    style: 'clear, balanced, and informative',
    vocabulary: 'straightforward professional language',
    approach: 'objective analysis with practical insights',
    example: 'The composite analysis indicates several key patterns...'
  },
  technical: {
    style: 'precise, scholarly, and detailed',
    vocabulary: 'classical BaZi terminology with academic rigor',
    approach: 'in-depth technical explanation for practitioners',
    example: 'The Day Master (日主) configuration presents a Wood-dominant structure...'
  },
  poetic: {
    style: 'lyrical, evocative, and metaphorical',
    vocabulary: 'rich imagery and symbolic language',
    approach: 'narrative storytelling with mythic resonance',
    example: 'Two rivers meeting at twilight, your destinies intertwine...'
  }
};

/**
 * Depth descriptions for prompt building
 */
export const DEPTH_DESCRIPTIONS: Record<NarrativeDepth, {
  level: string;
  assumptions: string;
  detail: string;
  explanations: string;
}> = {
  beginner: {
    level: 'introductory — no prior BaZi knowledge assumed',
    assumptions: 'explain all concepts from first principles',
    detail: 'focus on practical meaning and real-life application',
    explanations: 'define every Chinese term, avoid jargon'
  },
  intermediate: {
    level: 'moderate — basic BaZi familiarity assumed',
    assumptions: 'reader knows elements, pillars, and Ten Gods',
    detail: 'balance technical depth with accessibility',
    explanations: 'Chinese terms with brief glosses'
  },
  expert: {
    level: 'advanced — professional practitioner level',
    assumptions: 'full classical methodology familiarity',
    detail: 'complete technical analysis with nuances',
    explanations: 'Chinese terms used freely, reference classical texts'
  }
};

/**
 * Chapter-specific enhancement prompts
 */
export const CHAPTER_PROMPTS: Record<number, {
  focus: string;
  keyElements: string[];
  emotionalArc: string;
  enhancementGoal: string;
}> = {
  1: {
    focus: 'Relationship Essence — the core identity of the bond',
    keyElements: ['Day Master element', 'element distribution', 'fundamental nature'],
    emotionalArc: 'grounding, establishing identity',
    enhancementGoal: 'Create a vivid sense of who this relationship IS at its core'
  },
  2: {
    focus: 'Synastry Overview — how the two charts interact',
    keyElements: ['compatibility score', 'harmony points', 'tension points', 'romance'],
    emotionalArc: 'connection, recognition',
    enhancementGoal: 'Paint the picture of how these two energies dance together'
  },
  3: {
    focus: 'Composite Chart Interpretation — the relationship as its own entity',
    keyElements: ['Four Pillars', 'Ten Gods', 'Useful God', 'Shen Sha'],
    emotionalArc: 'revelation, understanding structure',
    enhancementGoal: 'Explain the relationship chart as a living being with its own personality'
  },
  4: {
    focus: 'Relationship Archetype — the mythic pattern',
    keyElements: ['primary archetype', 'secondary archetype', 'mythic narrative'],
    emotionalArc: 'inspiration, mythic resonance',
    enhancementGoal: 'Connect the relationship to timeless archetypal stories'
  },
  5: {
    focus: 'Life Themes — the soul lessons embedded in the bond',
    keyElements: ['essence theme', 'dynamic theme', 'shadow theme', 'karmic signature'],
    emotionalArc: 'depth, meaning-making',
    enhancementGoal: 'Reveal the deeper purpose and lessons of this connection'
  },
  6: {
    focus: 'Relationship Lifecycle Phase — where you are on the journey',
    keyElements: ['current phase', 'upcoming phase', 'long-term destination'],
    emotionalArc: 'orientation, hope',
    enhancementGoal: 'Help the couple understand their current stage and what\'s coming'
  },
  7: {
    focus: 'Composite Timing Forecast — the rhythm of destiny',
    keyElements: ['Luck Pillars', 'annual cycles', 'monthly cycles'],
    emotionalArc: 'anticipation, strategic awareness',
    enhancementGoal: 'Create a sense of timing and rhythm for the relationship journey'
  },
  8: {
    focus: 'Event Trigger Windows — when significant events may manifest',
    keyElements: ['strong windows', 'likely windows', 'event types'],
    emotionalArc: 'alert, readiness',
    enhancementGoal: 'Prepare the couple for potential turning points'
  },
  9: {
    focus: 'Destiny Trajectory Curves — the shape of the journey over time',
    keyElements: ['overall curve', 'domain curves', 'peaks', 'valleys'],
    emotionalArc: 'perspective, long-term vision',
    enhancementGoal: 'Give the couple a bird\'s-eye view of their shared destiny arc'
  },
  10: {
    focus: 'Guidance & Integration — practical wisdom for the path ahead',
    keyElements: ['supporting factors', 'growth edges', 'recommendations'],
    emotionalArc: 'integration, empowerment',
    enhancementGoal: 'Leave the couple with actionable wisdom and hope'
  }
};

// ============================================================================
// CHAPTER EXTRACTION
// ============================================================================

/**
 * Extract chapters from a forecast report for enhancement
 */
export function extractChaptersForEnhancement(
  report: CompositeForecastReport
): ChapterText[] {
  return report.chapters.map(chapter => ({
    chapterNumber: chapter.number,
    title: chapter.title,
    titleChinese: chapter.titleChinese,
    originalContent: chapter.content,
    highlights: chapter.highlights || [],
    data: chapter.data || {}
  }));
}

/**
 * Build enhancement context from report
 */
export function buildEnhancementContext(
  report: CompositeForecastReport
): EnhancementContext {
  const context: EnhancementContext = {
    partnerAName: report.partnerA.name,
    partnerBName: report.partnerB.name,
    compositeElement: 'Earth', // Default
    usefulGod: '',
    currentPhase: '',
    archetype: ''
  };

  // Extract from chapter data
  for (const chapter of report.chapters) {
    if (chapter.data) {
      if (chapter.data.dayMaster && typeof chapter.data.dayMaster === 'object') {
        const dm = chapter.data.dayMaster as { element?: string };
        if (dm.element) context.compositeElement = dm.element;
      }
      if (chapter.data.usefulGod) {
        context.usefulGod = String(chapter.data.usefulGod);
      }
      if (chapter.data.currentPhase) {
        context.currentPhase = String(chapter.data.currentPhase);
      }
      if (chapter.data.primaryArchetype) {
        context.archetype = String(chapter.data.primaryArchetype);
      }
    }
  }

  return context;
}

// ============================================================================
// PROMPT BUILDERS
// ============================================================================

/**
 * Build the system prompt for a specific chapter enhancement
 */
export function buildChapterSystemPrompt(
  chapterNumber: number,
  options: NarrativeEnhanceOptions,
  context: EnhancementContext
): string {
  const chapterConfig = CHAPTER_PROMPTS[chapterNumber];
  const toneConfig = TONE_DESCRIPTIONS[options.tone];
  const depthConfig = DEPTH_DESCRIPTIONS[options.depth];

  if (!chapterConfig) {
    return buildGenericSystemPrompt(options, context);
  }

  const parts: string[] = [];

  // Role definition
  parts.push(`You are a master BaZi (四柱命理) narrative writer, transforming structured analysis into ${toneConfig.style} prose.`);
  parts.push('');

  // Chapter focus
  parts.push(`## Chapter Focus: ${chapterConfig.focus}`);
  parts.push('');
  parts.push(`Your goal: ${chapterConfig.enhancementGoal}`);
  parts.push('');

  // Tone instructions
  parts.push(`## Tone: ${options.tone.toUpperCase()}`);
  parts.push(`- Style: ${toneConfig.style}`);
  parts.push(`- Vocabulary: ${toneConfig.vocabulary}`);
  parts.push(`- Approach: ${toneConfig.approach}`);
  parts.push('');

  // Depth instructions
  parts.push(`## Depth: ${options.depth.toUpperCase()}`);
  parts.push(`- Level: ${depthConfig.level}`);
  parts.push(`- Assumptions: ${depthConfig.assumptions}`);
  parts.push(`- Detail: ${depthConfig.detail}`);
  parts.push(`- Explanations: ${depthConfig.explanations}`);
  parts.push('');

  // Context injection
  parts.push('## Relationship Context');
  parts.push(`- Partner A: ${context.partnerAName}`);
  parts.push(`- Partner B: ${context.partnerBName}`);
  parts.push(`- Composite Element: ${context.compositeElement}`);
  if (context.usefulGod) parts.push(`- Useful God: ${context.usefulGod}`);
  if (context.currentPhase) parts.push(`- Current Phase: ${context.currentPhase}`);
  if (context.archetype) parts.push(`- Archetype: ${context.archetype}`);
  parts.push('');

  // Key elements to address
  parts.push('## Key Elements to Address');
  chapterConfig.keyElements.forEach(elem => parts.push(`- ${elem}`));
  parts.push('');

  // Emotional arc
  parts.push(`## Emotional Arc: ${chapterConfig.emotionalArc}`);
  parts.push('');

  // Language instructions
  if (options.language === 'bilingual') {
    parts.push('## Language: Bilingual (English with Chinese terms)');
    parts.push('Include Chinese terms with pinyin and English translations where relevant.');
  } else if (options.language === 'zh') {
    parts.push('## Language: Chinese (中文)');
    parts.push('Write primarily in Chinese with classical terminology.');
  } else {
    parts.push('## Language: English');
    parts.push('Write in English with Chinese terms in parentheses for key concepts.');
  }
  parts.push('');

  // Additional options
  if (options.includeMetaphors) {
    parts.push('## Include Metaphors');
    parts.push('Use rich metaphors from nature, seasons, and classical imagery.');
  }

  if (options.includeAdvice) {
    parts.push('## Include Practical Advice');
    parts.push('End sections with actionable guidance.');
  }

  // Output format
  parts.push('');
  parts.push('## Output Format');
  parts.push('- Use markdown formatting (headers, lists, emphasis)');
  parts.push('- Maintain section structure from original content');
  parts.push('- Expand each section with narrative depth');
  parts.push('- Keep original data/highlights but enrich the prose');

  return parts.join('\n');
}

/**
 * Build generic system prompt for unknown chapter numbers
 */
function buildGenericSystemPrompt(
  options: NarrativeEnhanceOptions,
  context: EnhancementContext
): string {
  const toneConfig = TONE_DESCRIPTIONS[options.tone];
  const depthConfig = DEPTH_DESCRIPTIONS[options.depth];

  return `You are a master BaZi narrative writer.

Tone: ${options.tone} — ${toneConfig.style}
Depth: ${options.depth} — ${depthConfig.level}

Context:
- Partners: ${context.partnerAName} & ${context.partnerBName}
- Composite Element: ${context.compositeElement}

Enhance the provided content with rich narrative prose while maintaining accuracy.`;
}

/**
 * Build the user prompt for chapter enhancement
 */
export function buildChapterUserPrompt(chapter: ChapterText): string {
  const parts: string[] = [];

  parts.push(`# Chapter ${chapter.chapterNumber}: ${chapter.title} (${chapter.titleChinese})`);
  parts.push('');
  parts.push('## Original Content to Enhance:');
  parts.push('');
  parts.push(chapter.originalContent);
  parts.push('');

  if (chapter.highlights.length > 0) {
    parts.push('## Key Highlights:');
    chapter.highlights.forEach(h => parts.push(`- ${h}`));
    parts.push('');
  }

  if (Object.keys(chapter.data).length > 0) {
    parts.push('## Data Context:');
    parts.push('```json');
    parts.push(JSON.stringify(chapter.data, null, 2));
    parts.push('```');
    parts.push('');
  }

  parts.push('Please enhance this content according to the tone and depth specified in the system prompt.');
  parts.push('Expand the narrative while preserving all factual content and structure.');

  return parts.join('\n');
}

// ============================================================================
// ENHANCEMENT ENGINE
// ============================================================================

/**
 * Enhance a single chapter using the provided LLM
 */
export async function enhanceChapter(
  chapter: ChapterText,
  context: EnhancementContext,
  options: NarrativeEnhanceOptions,
  llm: LLMProvider
): Promise<EnhancedChapter> {
  const startTime = Date.now();

  const systemPrompt = buildChapterSystemPrompt(chapter.chapterNumber, options, context);
  const userPrompt = buildChapterUserPrompt(chapter);

  const enhancedContent = await llm.generateCompletion(
    userPrompt,
    systemPrompt,
    options.maxTokensPerChapter || 2000
  );

  const endTime = Date.now();

  return {
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    titleChinese: chapter.titleChinese,
    enhancedContent,
    originalContent: chapter.originalContent,
    tone: options.tone,
    depth: options.depth,
    wordCount: countWords(enhancedContent),
    enhancementMetadata: {
      promptUsed: systemPrompt.substring(0, 200) + '...',
      contextInjected: [
        `partnerA: ${context.partnerAName}`,
        `partnerB: ${context.partnerBName}`,
        `element: ${context.compositeElement}`
      ],
      processingTimeMs: endTime - startTime
    }
  };
}

/**
 * Enhance all chapters in a report
 */
export async function enhanceReport(
  report: CompositeForecastReport,
  options: NarrativeEnhanceOptions,
  llm: LLMProvider,
  onProgress?: (chapterNumber: number, total: number) => void
): Promise<EnhancedReport> {
  const chapters = extractChaptersForEnhancement(report);
  const context = buildEnhancementContext(report);
  const enhancedChapters: EnhancedChapter[] = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    if (onProgress) onProgress(chapter.chapterNumber, chapters.length);

    const enhanced = await enhanceChapter(chapter, context, options, llm);
    enhancedChapters.push(enhanced);
  }

  // Enhance summary
  const summaryPrompt = buildSummaryEnhancementPrompt(report.summary, context, options);
  const enhancedSummary = await llm.generateCompletion(
    summaryPrompt.user,
    summaryPrompt.system,
    500
  );

  // Build full narrative
  const fullEnhancedNarrative = buildFullEnhancedNarrative(
    report,
    enhancedChapters,
    enhancedSummary
  );

  return {
    title: report.title,
    titleChinese: report.titleChinese,
    subtitle: report.subtitle,
    partnerA: report.partnerA,
    partnerB: report.partnerB,
    chapters: enhancedChapters,
    summary: report.summary,
    enhancedSummary,
    options,
    generatedAt: report.generatedAt,
    enhancedAt: new Date(),
    fullEnhancedNarrative
  };
}

/**
 * Stream-enhance a single chapter
 */
export async function streamEnhanceChapter(
  chapter: ChapterText,
  context: EnhancementContext,
  options: NarrativeEnhanceOptions,
  llm: LLMProvider,
  onChunk: (chunk: string) => void
): Promise<EnhancedChapter> {
  const startTime = Date.now();

  const systemPrompt = buildChapterSystemPrompt(chapter.chapterNumber, options, context);
  const userPrompt = buildChapterUserPrompt(chapter);

  let enhancedContent = '';

  if (llm.streamCompletion) {
    await llm.streamCompletion(userPrompt, systemPrompt, (chunk) => {
      enhancedContent += chunk;
      onChunk(chunk);
    });
  } else {
    enhancedContent = await llm.generateCompletion(
      userPrompt,
      systemPrompt,
      options.maxTokensPerChapter || 2000
    );
    onChunk(enhancedContent);
  }

  const endTime = Date.now();

  return {
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    titleChinese: chapter.titleChinese,
    enhancedContent,
    originalContent: chapter.originalContent,
    tone: options.tone,
    depth: options.depth,
    wordCount: countWords(enhancedContent),
    enhancementMetadata: {
      promptUsed: systemPrompt.substring(0, 200) + '...',
      contextInjected: [
        `partnerA: ${context.partnerAName}`,
        `partnerB: ${context.partnerBName}`,
        `element: ${context.compositeElement}`
      ],
      processingTimeMs: endTime - startTime
    }
  };
}

// ============================================================================
// SUMMARY ENHANCEMENT
// ============================================================================

/**
 * Build prompts for summary enhancement
 */
function buildSummaryEnhancementPrompt(
  originalSummary: string,
  context: EnhancementContext,
  options: NarrativeEnhanceOptions
): { system: string; user: string } {
  const toneConfig = TONE_DESCRIPTIONS[options.tone];

  const system = `You are enhancing an executive summary for a BaZi relationship report.

Tone: ${options.tone} — ${toneConfig.style}
Context: ${context.partnerAName} & ${context.partnerBName} relationship

Create a compelling, concise summary that captures the essence of their bond.`;

  const user = `Enhance this executive summary:

${originalSummary}

Make it ${options.tone} in tone while keeping it concise (under 200 words).`;

  return { system, user };
}

// ============================================================================
// NARRATIVE ASSEMBLY
// ============================================================================

/**
 * Build the full enhanced narrative document
 */
function buildFullEnhancedNarrative(
  report: CompositeForecastReport,
  enhancedChapters: EnhancedChapter[],
  enhancedSummary: string
): string {
  const parts: string[] = [];

  // Title block
  parts.push('# 合盘预测报告 (Enhanced Composite Relationship Forecast)');
  parts.push('');
  parts.push(`## ${report.partnerA.name} & ${report.partnerB.name}`);
  parts.push('');
  parts.push(`*Original: ${report.generatedAt.toLocaleDateString()}*`);
  parts.push(`*Enhanced: ${new Date().toLocaleDateString()}*`);
  parts.push('');
  parts.push('---');
  parts.push('');

  // Enhanced summary
  parts.push('## Executive Summary');
  parts.push('');
  parts.push(enhancedSummary);
  parts.push('');
  parts.push('---');
  parts.push('');

  // Enhanced chapters
  for (const chapter of enhancedChapters) {
    parts.push(`## ${chapter.chapterNumber}. ${chapter.titleChinese} (${chapter.title})`);
    parts.push('');
    parts.push(chapter.enhancedContent);
    parts.push('');
    parts.push('---');
    parts.push('');
  }

  // Footer
  parts.push('*This enhanced report was generated using AI narrative expansion.*');
  parts.push('');
  parts.push('*May your journey together be blessed with wisdom and growth.*');

  return parts.join('\n');
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Get default enhancement options
 */
export function getDefaultEnhancementOptions(): NarrativeEnhanceOptions {
  return {
    tone: 'neutral',
    depth: 'intermediate',
    includeMetaphors: true,
    includeAdvice: true,
    maxTokensPerChapter: 2000,
    language: 'en',
    personalizationLevel: 'moderate'
  };
}

/**
 * Validate enhancement options
 */
export function validateEnhancementOptions(options: Partial<NarrativeEnhanceOptions>): NarrativeEnhanceOptions {
  const defaults = getDefaultEnhancementOptions();

  return {
    tone: options.tone || defaults.tone,
    depth: options.depth || defaults.depth,
    includeMetaphors: options.includeMetaphors ?? defaults.includeMetaphors,
    includeAdvice: options.includeAdvice ?? defaults.includeAdvice,
    maxTokensPerChapter: options.maxTokensPerChapter || defaults.maxTokensPerChapter,
    language: options.language || defaults.language,
    personalizationLevel: options.personalizationLevel || defaults.personalizationLevel
  };
}

/**
 * Get tone preview
 */
export function getTonePreview(tone: NarrativeTone): string {
  return TONE_DESCRIPTIONS[tone].example;
}

/**
 * Get depth description
 */
export function getDepthDescription(depth: NarrativeDepth): string {
  return DEPTH_DESCRIPTIONS[depth].level;
}

// ============================================================================
// MOCK LLM PROVIDER (for testing)
// ============================================================================

/**
 * Create a mock LLM provider for testing
 */
export function createMockLLMProvider(): LLMProvider {
  return {
    generateCompletion: async (prompt: string, _systemPrompt: string, _maxTokens?: number) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Return enhanced version of the prompt content
      const lines = prompt.split('\n');
      const contentStart = lines.findIndex(l => l.includes('Original Content'));
      const content = lines.slice(contentStart + 2).join('\n');

      return `[ENHANCED]\n\n${content}\n\n[This content has been narratively enhanced for demonstration purposes.]`;
    }
  };
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export enhanced report as markdown
 */
export function exportEnhancedReportAsMarkdown(report: EnhancedReport): string {
  return report.fullEnhancedNarrative;
}

/**
 * Export enhanced report as JSON
 */
export function exportEnhancedReportAsJSON(report: EnhancedReport): string {
  return JSON.stringify({
    title: report.title,
    titleChinese: report.titleChinese,
    subtitle: report.subtitle,
    partners: {
      a: report.partnerA,
      b: report.partnerB
    },
    chapters: report.chapters.map(ch => ({
      number: ch.chapterNumber,
      title: ch.title,
      titleChinese: ch.titleChinese,
      enhancedContent: ch.enhancedContent,
      tone: ch.tone,
      depth: ch.depth,
      wordCount: ch.wordCount
    })),
    summary: report.enhancedSummary,
    options: report.options,
    generatedAt: report.generatedAt.toISOString(),
    enhancedAt: report.enhancedAt.toISOString()
  }, null, 2);
}

/**
 * Get enhancement statistics
 */
export function getEnhancementStats(report: EnhancedReport): {
  totalOriginalWords: number;
  totalEnhancedWords: number;
  expansionRatio: number;
  avgProcessingTimeMs: number;
  chaptersEnhanced: number;
} {
  const totalOriginalWords = report.chapters.reduce(
    (sum, ch) => sum + countWords(ch.originalContent),
    0
  );

  const totalEnhancedWords = report.chapters.reduce(
    (sum, ch) => sum + ch.wordCount,
    0
  );

  const totalProcessingTime = report.chapters.reduce(
    (sum, ch) => sum + (ch.enhancementMetadata.processingTimeMs || 0),
    0
  );

  return {
    totalOriginalWords,
    totalEnhancedWords,
    expansionRatio: totalEnhancedWords / Math.max(totalOriginalWords, 1),
    avgProcessingTimeMs: totalProcessingTime / report.chapters.length,
    chaptersEnhanced: report.chapters.length
  };
}
