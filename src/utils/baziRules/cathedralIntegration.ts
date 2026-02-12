/**
 * ============================================
 * CATHEDRAL INTEGRATION
 * End-to-end pipeline from BaZi analysis to
 * Knowledge Codex, Persona Narrative, and
 * Pilgrim Journey
 * ============================================
 */

import { ChartContext, ClassicalEdgeCaseResult } from './types';
import { evaluateClassicalEdgeCases, generateEdgeCaseReport } from './index';
import { buildKnowledgeCodex } from './codexMapper';
import {
  renderCompletePersonaReading,
  renderPersonaSummary,
  generateVoiceReadyText
} from './personaNarrative';
import {
  buildPilgrimJourney,
  buildEssentialJourney,
  generateJourneyScript,
  generateInteractiveJourneyData,
  generateVoiceJourney
} from './journeyScript';
import { KnowledgeCodex, PilgrimJourney, CodexEntry } from './codexTypes';

/**
 * Complete Cathedral output bundle
 */
export interface CathedralOutput {
  // Raw analysis
  analysis: ClassicalEdgeCaseResult;
  technicalReport: string;

  // Knowledge Codex
  codex: KnowledgeCodex;

  // Persona narratives
  personaReading: string;
  personaSummary: string;
  voiceNarration: string[];

  // Pilgrim Journey
  fullJourney: PilgrimJourney;
  essentialJourney: PilgrimJourney;
  journeyScript: string;
  interactiveJourney: ReturnType<typeof generateInteractiveJourneyData>;
  voiceJourney: ReturnType<typeof generateVoiceJourney>;

  // Metadata
  generatedAt: Date;
  chartId?: string;
}

/**
 * Generate complete Cathedral outputs from chart context
 */
export function generateCathedralOutputs(
  ctx: ChartContext,
  chartId?: string
): CathedralOutput {
  // Step 1: Evaluate classical edge cases
  const analysis = evaluateClassicalEdgeCases(ctx);
  const technicalReport = generateEdgeCaseReport(ctx);

  // Step 2: Build Knowledge Codex
  const codex = buildKnowledgeCodex(analysis, chartId);

  // Step 3: Generate Persona narratives
  const personaReading = renderCompletePersonaReading(codex);
  const personaSummary = renderPersonaSummary(codex);
  const voiceNarration = generateVoiceReadyText(codex);

  // Step 4: Build Pilgrim Journey
  const fullJourney = buildPilgrimJourney(codex);
  const essentialJourney = buildEssentialJourney(codex, 7);
  const journeyScript = generateJourneyScript(fullJourney);
  const interactiveJourney = generateInteractiveJourneyData(fullJourney);
  const voiceJourney = generateVoiceJourney(fullJourney);

  return {
    analysis,
    technicalReport,
    codex,
    personaReading,
    personaSummary,
    voiceNarration,
    fullJourney,
    essentialJourney,
    journeyScript,
    interactiveJourney,
    voiceJourney,
    generatedAt: new Date(),
    chartId
  };
}

/**
 * Generate lightweight output (codex + summary only)
 */
export function generateLightweightOutput(
  ctx: ChartContext,
  chartId?: string
): {
  codex: KnowledgeCodex;
  summary: string;
  topInsights: CodexEntry[];
} {
  const analysis = evaluateClassicalEdgeCases(ctx);
  const codex = buildKnowledgeCodex(analysis, chartId);
  const summary = renderPersonaSummary(codex);

  // Get top 5 insights by severity
  const topInsights = [...codex.entries]
    .sort((a, b) => {
      const severityOrder = { major: 5, significant: 4, moderate: 3, minor: 2, info: 1 };
      return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    })
    .slice(0, 5);

  return { codex, summary, topInsights };
}

/**
 * Generate voice-only output for Luna TTS
 */
export function generateVoiceOutput(ctx: ChartContext): {
  greeting: string;
  insights: string[];
  farewell: string;
} {
  const analysis = evaluateClassicalEdgeCases(ctx);
  const codex = buildKnowledgeCodex(analysis);

  const insights = generateVoiceReadyText(codex);

  return {
    greeting: insights[0] || '欢迎来到命理知识宝典。',
    insights: insights.slice(1, -1),
    farewell: insights[insights.length - 1] || '愿智慧伴你前行。'
  };
}

/**
 * Generate JSON export for external consumption
 */
export function generateJSONExport(ctx: ChartContext, chartId?: string): string {
  const output = generateCathedralOutputs(ctx, chartId);

  // Create serializable version
  const exportData = {
    meta: {
      generatedAt: output.generatedAt.toISOString(),
      chartId: output.chartId,
      version: '1.0.0'
    },
    summary: output.codex.summary,
    entries: output.codex.entries.map(entry => ({
      id: entry.rule.id,
      category: entry.rule.category,
      title: entry.explanation.title,
      summary: entry.explanation.summary,
      severity: entry.severity,
      effect: entry.effect,
      personaHook: entry.personaHook,
      recommendations: entry.explanation.recommendations
    })),
    journey: {
      totalSteps: output.fullJourney.steps.length,
      chambers: output.fullJourney.chambers.map(c => ({
        id: c.id,
        name: c.name,
        chineseName: c.chineseName
      })),
      introduction: output.fullJourney.introduction,
      conclusion: output.fullJourney.conclusion
    }
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Generate markdown export for documentation
 */
export function generateMarkdownExport(ctx: ChartContext, chartId?: string): string {
  const output = generateCathedralOutputs(ctx, chartId);
  const lines: string[] = [];

  lines.push('# BaZi Chart Analysis - Knowledge Codex');
  lines.push('');
  lines.push(`Generated: ${output.generatedAt.toISOString()}`);
  if (chartId) lines.push(`Chart ID: ${chartId}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Findings:** ${output.codex.summary.totalFindings}`);
  lines.push(`- **Overall Tone:** ${output.codex.summary.overallTone}`);
  lines.push('');

  lines.push('## Findings by Category');
  lines.push('');

  const categories = Object.entries(output.codex.summary.byCategory)
    .filter(([_, count]) => count > 0);

  for (const [category, count] of categories) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)} (${count})`);
    lines.push('');

    const categoryEntries = output.codex.entries.filter(e => e.rule.category === category);
    for (const entry of categoryEntries) {
      lines.push(`#### ${entry.explanation.title}`);
      lines.push('');
      lines.push(`> ${entry.personaHook}`);
      lines.push('');
      lines.push(`**Summary:** ${entry.explanation.summary}`);
      lines.push('');
      lines.push(`**Interpretation:** ${entry.explanation.interpretation}`);
      lines.push('');

      if (entry.explanation.recommendations && entry.explanation.recommendations.length > 0) {
        lines.push('**Recommendations:**');
        for (const rec of entry.explanation.recommendations) {
          lines.push(`- ${rec}`);
        }
        lines.push('');
      }
    }
  }

  lines.push('## Pilgrim Journey');
  lines.push('');
  lines.push(output.fullJourney.introduction);
  lines.push('');

  for (const step of output.fullJourney.steps) {
    lines.push(`### Step ${step.order}: ${step.title}`);
    lines.push(`*${step.chamber.name}*`);
    lines.push('');
    lines.push(step.narrative);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(output.fullJourney.conclusion);

  return lines.join('\n');
}

/**
 * Integration with existing BaZi analysis pipeline
 */
export function enhanceExistingAnalysis(
  existingAnalysis: Record<string, unknown>,
  ctx: ChartContext
): Record<string, unknown> & { cathedral: { codex: KnowledgeCodex; topInsights: CodexEntry[]; summary: string } } {
  const cathedralOutput = generateLightweightOutput(ctx);

  return {
    ...existingAnalysis,
    cathedral: {
      codex: cathedralOutput.codex,
      topInsights: cathedralOutput.topInsights,
      summary: cathedralOutput.summary
    }
  };
}

// Re-export key types and functions
export {
  KnowledgeCodex,
  PilgrimJourney,
  CodexEntry,
  buildKnowledgeCodex,
  buildPilgrimJourney,
  renderCompletePersonaReading,
  generateJourneyScript
};
