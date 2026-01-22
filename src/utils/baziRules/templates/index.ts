/**
 * ============================================
 * CATHEDRAL UI TEMPLATES
 * Complete template suite for the Cathedral system
 *
 * Exports:
 * - Markdown templates for Knowledge Codex
 * - Markdown templates for Persona Layer
 * - Markdown templates for Pilgrim Journey
 * - HTML templates for full Cathedral UI
 * - Cathedral Index Page (master library index)
 * - Narrative Cockpit UI (story beats, emotional arcs)
 * - Relationship Constellation UI (multi-relationship mapping)
 * - Export Layer Templates (HTML/PDF/Markdown exports)
 * ============================================
 */

// ==================== CODEX MARKDOWN TEMPLATES ====================
export {
  renderCodexEntryMarkdown,
  renderFullCodexMarkdown,
  renderCodexIndexMarkdown,
  formatCategory,
  formatSeverity,
  formatEffect,
  getSeverityIcon,
  getChamberForCategory
} from './codexMarkdownTemplate';

// ==================== PERSONA NARRATIVE TEMPLATES ====================
export {
  renderPersonaNarrativeMarkdown,
  renderFullPersonaDocument,
  generateVoiceScript,
  getEmotionalTone,
  getSymbolicImagery,
  generateNarrativeExpansion,
  generateIntegrationNote
} from './personaNarrativeTemplate';

// ==================== JOURNEY MARKDOWN TEMPLATES ====================
export {
  renderJourneyStepMarkdown,
  renderFullJourneyMarkdown,
  renderJourneyMapMarkdown,
  renderVoiceJourneyScript,
  generateTrialDescription,
  generateInsight,
  generateTransformation
} from './journeyMarkdownTemplate';

// ==================== CATHEDRAL HTML TEMPLATES ====================
export {
  generateCathedralHtml,
  generateAnalysisSummaryHtml,
  generateCodexEntriesHtml,
  generatePersonaHooksHtml
} from './cathedralHtmlTemplate';

// ==================== CATHEDRAL INDEX PAGE ====================
export {
  getCathedralModuleTree,
  renderCathedralIndexMarkdown,
  renderCathedralIndexHtml,
  type CathedralModule,
  type CathedralModuleTree
} from './cathedralIndexTemplate';

// ==================== NARRATIVE COCKPIT ====================
export {
  buildNarrativeCockpit,
  generateStoryBeats,
  generateEmotionalArc,
  generateTimingCurves,
  generateEnvironmentalOverlays,
  renderNarrativeCockpitMarkdown,
  renderNarrativeCockpitHtml,
  renderNarrativeCockpitInteractiveHtml,
  type StoryBeat,
  type EmotionalArcPoint,
  type TimingCurvePoint,
  type EnvironmentalOverlay,
  type NarrativeCockpitData
} from './narrativeCockpitTemplate';

// ==================== RELATIONSHIP CONSTELLATION ====================
export {
  buildConstellation,
  calculateMemberCompatibility,
  buildSynastryHeatmap,
  generateCompositeChart,
  generateLifecyclePhases,
  renderConstellationMarkdown,
  renderConstellationHtml,
  type ConstellationMember,
  type ConstellationLink,
  type SynastryHeatmap,
  type CompositeChart,
  type LifecyclePhase,
  type ConstellationData
} from './constellationTemplate';

// ==================== EXPORT LAYER ====================
export {
  generateCathedralReportMarkdown,
  generateCathedralReportHtml,
  exportCodexPageHtml,
  exportCodexPageMarkdown,
  exportJourneyHtml,
  generateAllExports,
  generateExportFileBundle,
  type ExportMetadata,
  type CathedralReportData,
  type CoreAnalysisSection,
  type AppendixSection,
  type ExportOptions
} from './exportLayerTemplate';

// ==================== DEVTOOLS ====================
export {
  buildRuleDebugInfo,
  buildTimingEvents,
  buildStoryBeatDebug,
  renderRuleDebuggerHtml,
  renderTimingAnalyzerHtml,
  renderStoryDebuggerHtml,
  renderNarrativeDebuggerHtml,
  generateDevToolsHtml,
  type RuleDebugInfo,
  type RuleCondition,
  type TimingEvent,
  type StoryBeatDebug,
  type DevToolsData,
  type PerformanceMetrics,
  type NarrativeDebugPayload
} from './devToolsTemplate';

// ==================== CONSTELLATION UI (V2 5-AXIS) ====================
export {
  renderConstellationMapHtml,
  renderRelationshipCardHtml,
  renderRelationshipJourneyHtml,
  renderSynastryCodexReferencesHtml,
  renderFullConstellationPageHtml
} from './constellationUITemplate';

// ==================== NARRATIVE DIFF UI ====================
export {
  renderNarrativeDiffHtml,
  renderNarrativeDiffComponent,
  renderDiffSummarySection,
  renderStoryBeatDiffSection,
  renderEmotionalArcOverlaySection,
  renderTimingCurveComparisonSection,
  renderReverseMappingPanel,
  getNarrativeDiffStyles,
  getNarrativeDiffScript
} from './narrativeDiffTemplate';

// ==================== CONSTELLATION NARRATIVE DIFF ====================
export {
  renderRelationshipNarrativeDiffHtml,
  renderRelationshipNarrativeDiffComponent,
  getRelDiffStyles,
  getRelDiffScript
} from './constellationNarrativeDiffTemplate';

// ==================== GROUP NARRATIVE FUSION ====================
export {
  renderGroupNarrativeHtml,
  renderGroupNarrativeComponent,
  getGroupNarrativeStyles,
  getGroupNarrativeScript
} from './groupNarrativeTemplate';

// ==================== GENERATIONAL LADDER ====================
export {
  renderGenerationalLadderHtml,
  renderGenerationalLadderComponent,
  getGenerationalLadderStyles,
  getGenerationalLadderScript
} from './generationalLadderTemplate';

// ==================== ANCESTRAL JOURNEY ====================
export {
  renderAncestralJourneyHtml,
  renderPilgrimPositionComponent,
  renderAncestralNarrativeComponent,
  renderEnrichedStepsComponent,
  renderAncestralBlessingComponent,
  getAncestralJourneyStyles,
  getAncestralJourneyScript
} from './ancestralJourneyTemplate';

// ==================== GENERATIONAL CONSTELLATION ====================
export {
  renderGenerationalConstellationHtml,
  renderConstellationCanvasComponent,
  getGenerationalConstellationStyles,
  getGenerationalConstellationScript
} from './generationalConstellationTemplate';

// ==================== GENERATIONAL STORY DASHBOARD ====================
export {
  renderGenerationalStoryDashboardHtml,
  getGenerationalStoryDashboardStyles,
  getGenerationalStoryDashboardScript,
  type GenerationalStoryDashboardData
} from './generationalStoryDashboardTemplate';

// ==================== ANCESTRAL TEMPLE ====================
export {
  renderAncestralTempleHtml,
  getAncestralTempleStyles,
  getAncestralTempleScript,
  type AncestralTempleData
} from './ancestralTempleTemplate';

// ==================== MYTHOS CODEX UI ====================
export {
  renderMythosCodexHtml,
  renderCodexGridComponent,
  renderCodexPageDetail,
  getMythosCodexStyles,
  getMythosCodexScript,
  type MythosCodexUIData
} from './mythosCodexUITemplate';

// ==================== PILGRIM-ANCESTOR DIALOGUE UI ====================
export {
  renderDialogueUIHtml,
  renderDialogueContainerComponent,
  getDialogueUIStyles,
  getDialogueUIScript,
  type DialogueUIData
} from './dialogueUITemplate';

// ==================== LINEAGE MEMORY BROWSER ====================
export {
  renderMemoryBrowserHtml,
  renderMemoryListComponent,
  renderMemoryDetailComponent,
  getMemoryBrowserStyles,
  getMemoryBrowserScript,
  type MemoryBrowserUIData
} from './memoryBrowserTemplate';

// ==================== INITIATION CEREMONY UI ====================
export {
  renderInitiationCeremonyHtml,
  getInitiationUIStyles,
  getInitiationUIScript,
  type InitiationUIData
} from './initiationCeremonyUITemplate';

// ==================== TIMELINE UI ====================
export {
  renderTimelineUIHtml,
  renderTimelineContainerComponent,
  getTimelineUIStyles,
  getTimelineUIScript,
  type TimelineUIData
} from './timelineUITemplate';

// ==================== HYPERGRAPH-AWARE DIALOGUE UI ====================
export {
  renderDialogueHypergraphUIHtml,
  renderDialogueContainerComponent as renderDialogueHypergraphContainerComponent,
  renderHypergraphPanelComponent,
  getDialogueHypergraphStyles,
  getDialogueHypergraphScript,
  type DialogueHypergraphUIData
} from './dialogueHypergraphUITemplate';

// ==================== MYTHOS CODEX VISUALIZER ====================
export {
  renderMythosVisualizerHtml,
  renderVisualizerCanvasComponent,
  getMythosVisualizerStyles,
  getMythosVisualizerScript,
  type MythosVisualizerUIData
} from './mythosVisualizerTemplate';

// ==================== MING PAN PRO (Professional Chart View) ====================
export {
  renderMingPanProHtml,
  renderCoreChartComponent,
  renderLuckPillarsComponent,
  renderAnnualAnalysisComponent,
  renderInteractionsComponent,
  getMingPanProStyles,
  getMingPanProScript,
  type BaZiChartData,
  type LuckPillarData,
  type AnnualAnalysisData,
  type PillarInteraction,
  type MingPanProData
} from './mingPanProTemplate';

// ==================== PROFILING DASHBOARD ====================
export {
  renderProfilingDashboardHtml,
  renderPersonalityComponent,
  renderWorkStyleComponent,
  renderTeamCompatComponent,
  getProfilingDashboardStyles,
  getProfilingDashboardScript,
  type PersonalityTrait,
  type WorkStyleAttribute,
  type TeamCompatibility,
  type ProfilePersonality,
  type ProfileWorkStyle,
  type ProfileTeamCompat,
  type ProfilingDashboardData
} from './profilingDashboardTemplate';

// ==================== ONE-CLICK READING ====================
export {
  renderOneClickReadingHtml,
  renderBirthFormComponent,
  renderLoadingComponent,
  getOneClickStyles,
  getOneClickScript,
  type OneClickReadingUIData
} from './oneClickReadingTemplate';

// ==================== GUIDE MODE ====================
export {
  renderGuideModeHtml,
  renderLevelSelector,
  renderExplanationOverlay,
  renderExplainableTerm,
  renderExplanationCard,
  renderExplanationReferencePage,
  getGuideModeStyles,
  getGuideModeScript,
  type GuideModeUIData
} from './guideModeTemplate';

// ==================== PRACTICE MODE ====================
export {
  renderPracticeModeHtml,
  renderExerciseCard,
  getPracticeModeStyles,
  getPracticeModeScript,
  type PracticeModeUIData
} from './practiceModeTemplate';

// ==================== MASTERY MODE ====================
export {
  renderMasteryModeHtml,
  renderSkillTreeComponent,
  renderAchievementBadge,
  getMasteryModeStyles,
  getMasteryModeScript,
  type MasteryModeUIData
} from './masteryModeTemplate';

// ==================== TEMPLATE TYPES ====================
export interface TemplateOutput {
  format: 'markdown' | 'html' | 'text';
  content: string;
  title: string;
  generatedAt: Date;
}

// ==================== CONVENIENCE FUNCTIONS ====================

import { KnowledgeCodex, PilgrimJourney, CodexEntry } from '../codexTypes';
import { renderFullCodexMarkdown, renderCodexIndexMarkdown } from './codexMarkdownTemplate';
import { renderFullPersonaDocument, generateVoiceScript } from './personaNarrativeTemplate';
import { renderFullJourneyMarkdown, renderVoiceJourneyScript } from './journeyMarkdownTemplate';
import { generateCathedralHtml } from './cathedralHtmlTemplate';

/**
 * Generate all outputs from Codex and Journey
 */
export function generateAllTemplateOutputs(
  codex: KnowledgeCodex,
  journey: PilgrimJourney
): {
  codexMarkdown: string;
  codexIndex: string;
  personaDocument: string;
  journeyDocument: string;
  cathedralHtml: string;
  voiceScript: string[];
  journeyVoiceScript: string;
} {
  return {
    codexMarkdown: renderFullCodexMarkdown(codex),
    codexIndex: renderCodexIndexMarkdown(codex),
    personaDocument: renderFullPersonaDocument(codex),
    journeyDocument: renderFullJourneyMarkdown(journey),
    cathedralHtml: generateCathedralHtml(codex, journey),
    voiceScript: generateVoiceScript(codex),
    journeyVoiceScript: renderVoiceJourneyScript(journey)
  };
}

/**
 * Generate downloadable exports
 */
export function generateExportBundle(
  codex: KnowledgeCodex,
  journey: PilgrimJourney
): Record<string, { content: string; filename: string; mimeType: string }> {
  const outputs = generateAllTemplateOutputs(codex, journey);
  const chartId = codex.chartId || 'analysis';
  const timestamp = new Date().toISOString().split('T')[0];

  return {
    codexMarkdown: {
      content: outputs.codexMarkdown,
      filename: `knowledge-codex-${chartId}-${timestamp}.md`,
      mimeType: 'text/markdown'
    },
    personaDocument: {
      content: outputs.personaDocument,
      filename: `persona-layer-${chartId}-${timestamp}.md`,
      mimeType: 'text/markdown'
    },
    journeyDocument: {
      content: outputs.journeyDocument,
      filename: `pilgrim-journey-${chartId}-${timestamp}.md`,
      mimeType: 'text/markdown'
    },
    cathedralHtml: {
      content: outputs.cathedralHtml,
      filename: `cathedral-analysis-${chartId}-${timestamp}.html`,
      mimeType: 'text/html'
    },
    voiceScript: {
      content: outputs.voiceScript.join('\n\n---\n\n'),
      filename: `voice-script-${chartId}-${timestamp}.txt`,
      mimeType: 'text/plain'
    }
  };
}

/**
 * Quick single-entry export
 */
export function exportSingleEntry(
  entry: CodexEntry
): { markdown: string; html: string } {
  const { renderCodexEntryMarkdown } = require('./codexMarkdownTemplate');
  const { renderPersonaNarrativeMarkdown } = require('./personaNarrativeTemplate');

  return {
    markdown: renderCodexEntryMarkdown(entry) + '\n\n---\n\n' + renderPersonaNarrativeMarkdown(entry),
    html: `
      <article class="codex-entry-export">
        <h1>${entry.explanation.title}</h1>
        <p class="summary">${entry.explanation.summary}</p>
        <blockquote class="persona-hook">${entry.personaHook}</blockquote>
        <section class="interpretation">${entry.explanation.interpretation}</section>
      </article>
    `
  };
}
