/**
 * ============================================
 * BAZI CLASSICAL RULES ENGINE
 * Main facade for evaluating classical edge cases
 *
 * This engine implements 60-80 micro-rules covering:
 * - Special Structures (假从格, 类从格, 半从格, etc.)
 * - Combination Edge Cases (season failures, clash breaks)
 * - Useful God Exceptions (blocked, combined away, harmed)
 * - Clash/Harm/Punishment Effects (beneficial vs harmful)
 * - Shen Sha Activation/Cancellation
 * - Luck Pillar Interactions
 * - Seasonal Strength Overrides
 * - Hidden Stem Exceptions
 * ============================================
 */

// Import types
import {
  ChartContext,
  ClassicalEdgeCaseResult,
  StructureRule,
  CombinationRule,
  UsefulGodRule,
  ClashHarmPunishmentRule,
  SeasonalRule,
  HiddenStemRule,
  LuckPillarRule,
  StructureEvaluation,
  CombinationEvaluation,
  UsefulGodEvaluation,
  ClashHarmPunishmentEvaluation,
  SeasonalEvaluation,
  HiddenStemEvaluation,
  LuckPillarEvaluation
} from './types';

// Import engines
import { evaluateStructures, hasSpecialStructure, getStructureUsefulGod } from './structureEngine';
import { evaluateCombinations, checkClashBreaksCombination, getEffectiveElements } from './combinationEngine';
import { evaluateUsefulGod, checkUsefulGodInteraction, getUsefulGodSummary } from './usefulGodEngine';
import { evaluateClashHarmPunishment, getNegativeInteractionIntensity, getInteractionSummary } from './clashEngine';
import { evaluateSeasonalOverrides, applySeasonalModifiers, getSeasonalStrengthDescription } from './seasonalEngine';
import { evaluateHiddenStems, getTotalHiddenElementStrength, findUsefulGodInHiddenStems } from './hiddenStemEngine';
import { evaluateLuckPillarRules, getLuckPillarSummary } from './luckPillarEngine';

// Import JSON rule files
import structuresJson from '../../data/rules/structures.json';
import combinationsJson from '../../data/rules/combinations.json';
import usefulGodJson from '../../data/rules/useful_god.json';
import clashJson from '../../data/rules/clash_harm_punishment.json';
import seasonalJson from '../../data/rules/seasonal.json';
import hiddenStemsJson from '../../data/rules/hidden_stems.json';
import luckPillarJson from '../../data/rules/luck_pillar.json';

/**
 * Main entry point - evaluate all classical edge cases
 *
 * @param ctx - Complete chart context with pillars, elements, interactions
 * @returns Comprehensive evaluation results for all rule categories
 */
export function evaluateClassicalEdgeCases(ctx: ChartContext): ClassicalEdgeCaseResult {
  // Load and type the rules
  const structureRules = (structuresJson as any).structures as StructureRule[];
  const combinationRules = (combinationsJson as any).combinations as CombinationRule[];
  const usefulGodRules = (usefulGodJson as any).useful_god_exceptions as UsefulGodRule[];
  const clashRules = (clashJson as any).clash_harm_punishment as ClashHarmPunishmentRule[];
  const seasonalRules = (seasonalJson as any).seasonal_exceptions as SeasonalRule[];
  const hiddenStemRules = (hiddenStemsJson as any).hidden_stem_exceptions as HiddenStemRule[];
  const luckPillarRules = (luckPillarJson as any).luck_pillar_exceptions as LuckPillarRule[];

  // Evaluate each category
  const structures = evaluateStructures(ctx, structureRules);
  const combinations = evaluateCombinations(ctx, combinationRules);
  const usefulGod = evaluateUsefulGod(ctx, usefulGodRules);
  const clashHarmPunishment = evaluateClashHarmPunishment(ctx, clashRules);
  const seasonal = evaluateSeasonalOverrides(ctx, seasonalRules);
  const hiddenStems = evaluateHiddenStems(ctx, hiddenStemRules);

  // Luck pillar evaluation (optional - only if luck pillar provided)
  let luckPillar: LuckPillarEvaluation | undefined;
  if (ctx.currentLuckPillar) {
    luckPillar = evaluateLuckPillarRules(ctx, luckPillarRules);
  }

  return {
    structures,
    combinations,
    usefulGod,
    clashHarmPunishment,
    seasonal,
    hiddenStems,
    luckPillar
  };
}

/**
 * Quick evaluation - returns only key findings
 */
export function evaluateQuickSummary(ctx: ChartContext): {
  hasSpecialStructure: boolean;
  structureType: string;
  usefulGodStatus: string;
  interactionIntensity: string;
  warnings: string[];
} {
  const result = evaluateClassicalEdgeCases(ctx);

  const warnings: string[] = [
    ...result.structures.warnings,
    ...result.usefulGod.warnings,
    ...result.clashHarmPunishment.healthWarnings
  ];

  if (result.luckPillar) {
    warnings.push(...result.luckPillar.warnings);
  }

  return {
    hasSpecialStructure: result.structures.determinedStructure !== 'normal',
    structureType: result.structures.determinedStructure,
    usefulGodStatus: getUsefulGodSummary(result.usefulGod),
    interactionIntensity: getNegativeInteractionIntensity(result.clashHarmPunishment),
    warnings: warnings.slice(0, 5) // Top 5 warnings
  };
}

/**
 * Generate human-readable report of edge cases
 */
export function generateEdgeCaseReport(ctx: ChartContext): string {
  const result = evaluateClassicalEdgeCases(ctx);
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push('       CLASSICAL BAZI EDGE CASE REPORT');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  // Structure Analysis
  lines.push('📊 STRUCTURE ANALYSIS');
  lines.push(`   Type: ${result.structures.determinedStructure}`);
  if (result.structures.warnings.length > 0) {
    lines.push('   Warnings:');
    result.structures.warnings.forEach(w => lines.push(`   • ${w}`));
  }
  lines.push('');

  // Useful God Analysis
  lines.push('🎯 USEFUL GOD ANALYSIS');
  lines.push(`   ${getUsefulGodSummary(result.usefulGod)}`);
  if (result.usefulGod.warnings.length > 0) {
    result.usefulGod.warnings.forEach(w => lines.push(`   • ${w}`));
  }
  lines.push('');

  // Combination Analysis
  lines.push('🔗 COMBINATION ANALYSIS');
  if (result.combinations.combinations.length === 0) {
    lines.push('   No combinations detected');
  } else {
    result.combinations.combinations.forEach(c => {
      lines.push(`   • ${c.combination.type}: ${c.combination.participants.join('-')} → ${c.finalStatus}`);
    });
  }
  lines.push('');

  // Clash/Harm/Punishment Analysis
  lines.push('⚡ CLASH/HARM/PUNISHMENT');
  const intensity = getNegativeInteractionIntensity(result.clashHarmPunishment);
  lines.push(`   Overall Intensity: ${intensity}`);
  getInteractionSummary(result.clashHarmPunishment).forEach(s => lines.push(`   • ${s}`));
  if (result.clashHarmPunishment.healthWarnings.length > 0) {
    lines.push('   Health Notes:');
    result.clashHarmPunishment.healthWarnings.forEach(w => lines.push(`   • ${w}`));
  }
  lines.push('');

  // Seasonal Analysis
  lines.push('🌿 SEASONAL MODIFIERS');
  const mods = result.seasonal.elementModifiers;
  const modifiedElements = Object.entries(mods)
    .filter(([_, v]) => v !== 1.0)
    .map(([e, v]) => `${e}: ${(v * 100).toFixed(0)}%`);
  if (modifiedElements.length > 0) {
    lines.push(`   Modified: ${modifiedElements.join(', ')}`);
  } else {
    lines.push('   No significant seasonal modifications');
  }
  if (result.seasonal.supportNeeded.length > 0) {
    lines.push(`   Support Needed: ${result.seasonal.supportNeeded.join(', ')}`);
  }
  lines.push('');

  // Hidden Stems Analysis
  lines.push('🔮 HIDDEN STEMS');
  const hiddenTotals = getTotalHiddenElementStrength(result.hiddenStems);
  const significantHidden = Object.entries(hiddenTotals)
    .filter(([_, v]) => v > 30)
    .map(([e, v]) => `${e}: ${v.toFixed(1)}%`);
  if (significantHidden.length > 0) {
    lines.push(`   Significant: ${significantHidden.join(', ')}`);
  }
  lines.push('');

  // Luck Pillar (if available)
  if (result.luckPillar) {
    lines.push('📅 CURRENT LUCK PILLAR');
    lines.push(`   ${getLuckPillarSummary(result.luckPillar)}`);
    lines.push('');
  }

  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

// Re-export types and utility functions
export * from './types';
export * from './codexTypes';

// Engine exports
export {
  evaluateStructures,
  hasSpecialStructure,
  getStructureUsefulGod,
  evaluateCombinations,
  checkClashBreaksCombination,
  getEffectiveElements,
  evaluateUsefulGod,
  checkUsefulGodInteraction,
  getUsefulGodSummary,
  evaluateClashHarmPunishment,
  getNegativeInteractionIntensity,
  getInteractionSummary,
  evaluateSeasonalOverrides,
  applySeasonalModifiers,
  getSeasonalStrengthDescription,
  evaluateHiddenStems,
  getTotalHiddenElementStrength,
  findUsefulGodInHiddenStems,
  evaluateLuckPillarRules,
  getLuckPillarSummary
};

// Knowledge Codex exports
export { buildKnowledgeCodex } from './codexMapper';

// Persona Narrative exports
export {
  renderPersonaNarrative,
  renderCompletePersonaReading,
  renderPersonaSummary,
  renderSingleEntryNarrative,
  renderLunaVoice,
  generateVoiceReadyText
} from './personaNarrative';

// Pilgrim Journey exports
export {
  buildPilgrimJourney,
  buildEssentialJourney,
  generateJourneyScript,
  generateInteractiveJourneyData,
  generateVoiceJourney
} from './journeyScript';

// Cathedral Integration exports
export {
  generateCathedralOutputs,
  generateLightweightOutput,
  generateVoiceOutput,
  generateJSONExport,
  generateMarkdownExport,
  enhanceExistingAnalysis,
  type CathedralOutput
} from './cathedralIntegration';

// Template exports
export {
  // Codex Markdown
  renderCodexEntryMarkdown,
  renderFullCodexMarkdown,
  renderCodexIndexMarkdown,
  // Persona Narrative
  renderPersonaNarrativeMarkdown,
  renderFullPersonaDocument,
  generateVoiceScript,
  // Journey Markdown
  renderJourneyStepMarkdown,
  renderFullJourneyMarkdown,
  renderJourneyMapMarkdown,
  renderVoiceJourneyScript,
  // HTML
  generateCathedralHtml,
  // Convenience
  generateAllTemplateOutputs,
  generateExportBundle,
  exportSingleEntry,
  // Cathedral Index Page
  getCathedralModuleTree,
  renderCathedralIndexMarkdown,
  renderCathedralIndexHtml,
  // Narrative Cockpit
  buildNarrativeCockpit,
  generateStoryBeats,
  generateEmotionalArc,
  generateTimingCurves,
  renderNarrativeCockpitMarkdown,
  renderNarrativeCockpitHtml,
  renderNarrativeCockpitInteractiveHtml,
  // Relationship Constellation
  buildConstellation,
  calculateMemberCompatibility,
  buildSynastryHeatmap,
  generateCompositeChart,
  renderConstellationMarkdown,
  renderConstellationHtml,
  // Constellation UI V2 (5-axis synastry)
  renderConstellationMapHtml,
  renderRelationshipCardHtml,
  renderRelationshipJourneyHtml,
  renderSynastryCodexReferencesHtml,
  renderFullConstellationPageHtml,
  // Export Layer
  generateCathedralReportMarkdown,
  generateCathedralReportHtml,
  exportCodexPageHtml,
  exportCodexPageMarkdown,
  exportJourneyHtml,
  generateAllExports,
  generateExportFileBundle
} from './templates';

// Complete Codex Library
export {
  COMPLETE_CODEX_LIBRARY,
  getCodexPage,
  AVAILABLE_CODEX_PAGES
} from './codexPagesComplete';

// Cathedral Schema Map
export {
  CATHEDRAL_SCHEMA,
  getEngine,
  getChamber,
  getChamberRules,
  findChamberForRule,
  getUpstreamEngines,
  getDownstreamTargets,
  getSchemaStats,
  renderSchemaMarkdown,
  renderSchemaAscii,
  type CathedralSchema,
  type EngineNode,
  type ChamberNode,
  type NarrativeNode,
  type UINode,
  type DataFlow
} from './cathedralSchema';

// Persona Voice Library
export {
  PERSONA_VOICE_LIBRARY,
  buildPersonaVoiceLibrary,
  exportPersonaLibraryAsMarkdown,
  exportPersonaLibraryAsJson,
  exportVoiceScriptsOnly,
  exportByTone,
  getVoiceEntry,
  renderVoiceEntryHtml,
  renderPersonaLibraryHtml,
  type PersonaVoiceEntry,
  type PersonaVoiceLibrary
} from './personaVoiceLibrary';

// Pilgrim Journey Script
export {
  PILGRIM_JOURNEY_SCRIPT,
  buildPilgrimJourneyScript,
  exportJourneyAsMarkdown,
  exportJourneyAsJson,
  exportJourneyVoiceScript,
  getJourneyStep,
  getChamberSteps,
  renderStepHtml,
  renderJourneyHtml,
  type JourneyStep as FullJourneyStep,
  type PilgrimJourneyScript
} from './pilgrimJourneyScript';

// Constellation Engine
export {
  analyzeSynastry,
  generateComposite,
  analyzeConstellation,
  analyzeDayMasterHarmony,
  analyzeElementBalance,
  analyzeUsefulGodSupport,
  analyzeBranchCombinations,
  analyzeClashConflicts,
  analyzeTimingAlignment,
  generateRecommendations,
  analyzeGroupDynamics,
  generateConstellationNarrative,
  type PersonNode,
  type RelationshipEdge,
  type ConstellationInput,
  type SynastryScore,
  type SynastryAnalysis,
  type CompositeChart,
  type RelationshipAnalysis,
  type ConstellationAnalysis,
  type GroupDynamics
} from './constellationEngine';

// Narrative Cockpit Model
export {
  buildNarrativeCockpit,
  generateStoryBeats,
  generateEmotionalArc,
  generateTimingCurve,
  generateEnvironmentalOverlays,
  generateLifeChapters,
  generateNarrativeSummary,
  type StoryBeat,
  type EmotionalArcPoint,
  type TimingCurvePoint,
  type EnvironmentalOverlay,
  type LifeChapter,
  type NarrativeCockpitData
} from './narrativeCockpitModel';

// Constellation Engine V2 (5-axis synastry model)
export {
  analyzeConstellationV2,
  type RawBaZiInput,
  type Pillar,
  type BaZiAnalysis,
  type LuckPillar,
  type PersonNode as PersonNodeV2,
  type RelationshipEdge as RelationshipEdgeV2,
  type ConstellationInput as ConstellationInputV2,
  type SynastryAxisScore,
  type AxisDetail,
  type TimingWindow,
  type CompositeChart as CompositeChartV2,
  type RelationshipAnalysis as RelationshipAnalysisV2,
  type RelationshipJourneyStep,
  type ConstellationAnalysis as ConstellationAnalysisV2,
  type ConstellationMapNode,
  type ConstellationMapEdge,
  type ConstellationMap,
  type GroupDynamics as GroupDynamicsV2
} from './constellationEngineV2';

// Narrative Synthesis Layer
export {
  synthesizeNarrativeCockpit,
  synthesizeStoryBeats,
  synthesizeEmotionalArc,
  synthesizeTimingCurve,
  synthesizeEnvironmentalOverlays,
  synthesizeLifeChapters,
  generateNarrativeSummary as generateSynthesizedNarrativeSummary,
  type BaZiAnalysisInput,
  type LuckPillarInput,
  type NarrativeSynthesisInput
} from './narrativeSynthesis';

// Cathedral Index Data Builder
export {
  buildCathedralIndexPayload,
  buildRuleNarrativeMap,
  getRuleNarrativeImpact,
  getRulesByImpact,
  getRulesByCategory,
  serializePayloadForWindow,
  type CathedralIndexPayload,
  type CathedralMeta,
  type RuleNarrativeImpact,
  type RuleNarrativeMap,
  type CathedralDiagnostics
} from './cathedralIndexData';

// Narrative Diff Engine (Reverse Mapping + Chart Comparison)
export {
  buildStoryBeatReverseMap,
  getStoryBeatReverseMap,
  diffNarratives,
  getRulesUniqueToA,
  getRulesUniqueToB,
  getSharedRules,
  generateDiffNarrativeSummary,
  type StoryBeatReverseMap,
  type RuleDetail,
  type NarrativeDiff,
  type StoryBeatDiff,
  type EmotionalArcDiff,
  type TimingCurveDiff,
  type OverlayDiff,
  type ChapterDiff,
  type DiffSummary
} from './narrativeDiffEngine';

// Narrative Diff UI Template
export {
  renderNarrativeDiffHtml,
  renderNarrativeDiffComponent
} from './templates/narrativeDiffTemplate';

// Constellation Narrative Diff (Relationship-level comparison)
export {
  diffRelationshipNarrative,
  getPeakResonancePeriods,
  getConflictPeriods,
  type RelationshipNarrativeDiff,
  type RelStoryBeatDiff,
  type RelEmotionalDiffPoint,
  type RelTimingDiffPoint,
  type RelOverlayDiff,
  type RelationshipDiffSummary
} from './constellationNarrativeDiff';

// Constellation Narrative Diff UI Template
export {
  renderRelationshipNarrativeDiffHtml,
  renderRelationshipNarrativeDiffComponent
} from './templates/constellationNarrativeDiffTemplate';

// Multi-Chart Narrative Fusion Engine
export {
  fuseNarratives,
  getCentralMembers,
  getGroupHarmonyPeaks,
  getSynchronicityPeaks,
  type MemberNarrative,
  type GroupStoryBeat,
  type GroupEmotionalPoint,
  type GroupTimingPoint,
  type GroupOverlay,
  type GroupChapter,
  type GroupNarrative,
  type GroupNarrativeSummary,
  type FusionStrategy,
  type FusionOptions
} from './narrativeFusion';

// Group Narrative UI Template
export {
  renderGroupNarrativeHtml,
  renderGroupNarrativeComponent
} from './templates/groupNarrativeTemplate';

// Generational Ladder Engine
export {
  buildGenerationalLadder,
  extractThreadsFromLadder,
  getGeneration,
  getThreadsForGeneration,
  compareAdjacentGenerations,
  getSelfGeneration,
  getAncestorGenerations,
  getDescendantGenerations,
  type GenerationNode,
  type GenerationalLadder,
  type GenerationalThread,
  type LadderSummary,
  type InheritedPattern,
  type BreakingPattern,
  type GenerationalInput
} from './generationalLadder';

// Generational Ladder UI Template
export {
  renderGenerationalLadderHtml,
  renderGenerationalLadderComponent
} from './templates/generationalLadderTemplate';

// Journey with Generations Integration Engine
export {
  buildPilgrimJourneyWithGenerations,
  computePilgrimPosition,
  bindGenerationsToJourney,
  generateAncestralPersonaHook,
  generateAncestralNarrative,
  getDeepResonanceSteps,
  getPatternBreakingSteps,
  getPatternFoundingSteps,
  getInheritanceSummary,
  type JourneyWithGenerations,
  type PilgrimPosition,
  type AncestralContext,
  type EnrichedJourneyStep,
  type AncestralNarrative
} from './journeyWithGenerations';

// Ancestral Journey UI Template
export {
  renderAncestralJourneyHtml,
  renderPilgrimPositionComponent,
  renderAncestralNarrativeComponent
} from './templates/ancestralJourneyTemplate';

// Ancestral Persona Layer (Luna speaking as the lineage)
export {
  generateAncestralPersona,
  buildAncestralPersonaLayer,
  formatPersonaForVoice,
  getVoiceLabel,
  getIntensityLabel,
  getMessagesByVoice,
  getMessagesByIntensity,
  hasAncestralResonance,
  type AncestralVoiceType,
  type AncestralPersonaMessage,
  type AncestralPersonaLayer
} from './ancestralPersona';

// Ancestral Healing Ritual Layer
export {
  generateAncestralRituals,
  buildRitualCollection,
  getRitualsByType,
  getRitualByTheme,
  formatRitualForVoice,
  getAllMaterials,
  getRitualTypeLabel,
  type RitualType,
  type RitualStep,
  type AncestralRitual,
  type RitualCollection
} from './ancestralRitual';

// Generational Constellation UI Template
export {
  renderGenerationalConstellationHtml,
  renderConstellationCanvasComponent,
  getGenerationalConstellationStyles,
  getGenerationalConstellationScript
} from './templates/generationalConstellationTemplate';

// Generational Story Dashboard Template
export {
  renderGenerationalStoryDashboardHtml,
  getGenerationalStoryDashboardStyles,
  getGenerationalStoryDashboardScript,
  type GenerationalStoryDashboardData
} from './templates/generationalStoryDashboardTemplate';

// Generational Story Export (MD/HTML/JSON)
export {
  exportGenerationalStoryMarkdown,
  exportGenerationalStoryHtml,
  exportGenerationalStoryJson,
  formatGenerationalLadderMarkdown,
  formatThreadsMarkdown,
  formatPilgrimPositionMarkdown,
  formatAncestralNarrativeMarkdown,
  type GenerationalStoryData,
  type ExportOptions as GenerationalExportOptions
} from './generationalStoryExport';

// Lineage Diff Engine (Compare two lineages)
export {
  diffLineages,
  getThreadsUniqueToA,
  getThreadsUniqueToB,
  getSharedThreads,
  calculateHealingPotential,
  type LineageDiff,
  type GenerationDiff,
  type ThreadDiff,
  type PatternDiff,
  type LineageDiffSummary
} from './lineageDiff';

// Ritual Timing Engine (When rituals activate)
export {
  computeRitualTiming,
  getActiveWindows,
  getWindowsByUrgency,
  hasCriticalRitualNow,
  formatWindowForDisplay,
  getCalendarSummary,
  type RitualTimingWindow,
  type RitualTrigger,
  type RitualCalendar,
  type BaZiTimingInput
} from './ritualTiming';

// Mythos Layer (Ancestral Archetypes)
export {
  assignArchetypes,
  buildMythosProfile,
  getArchetype,
  getAllArchetypes,
  formatMythosForVoice,
  ARCHETYPE_LIBRARY,
  type AncestralArchetype,
  type MythosProfile
} from './mythosLayer';

// Pilgrim-Ancestor Dialogue Engine
export {
  generateDialogue,
  generateSingleExchange,
  formatDialogueForDisplay,
  formatDialogueForVoice,
  getTurnsBySpeaker,
  getTurnsByEmotion,
  type DialogueSpeaker,
  type DialogueTurn,
  type AncestralDialogue,
  type DialogueGenerationOptions
} from './pilgrimAncestorDialogue';

// Generational Healing Path (Multi-step journey)
export {
  buildHealingPath,
  getStepsByPhase,
  getStepByTheme,
  formatHealingPathForDisplay,
  formatHealingPathForVoice,
  getPhaseLabel,
  type HealingPhase,
  type CeremonyText,
  type HealingPathStep,
  type HealingPath
} from './healingPath';

// Mythos Codex (Archetype Scripture)
export {
  buildCodexPage,
  buildMythosCodex,
  buildFullMythosCodex,
  exportCodexMarkdown,
  getPageByArchetype,
  type MythosCodexPage,
  type CodexScripture,
  type RitualGuidance,
  type ShadowWorkGuidance,
  type MythosCodex
} from './mythosCodex';

// Ancestral Temple UI Template
export {
  renderAncestralTempleHtml,
  getAncestralTempleStyles,
  getAncestralTempleScript,
  type AncestralTempleData
} from './templates/ancestralTempleTemplate';

// Ancestral Temple Navigation Map
export {
  ANCESTRAL_TEMPLE_NAVIGATION,
  findNodeById,
  findNodeByRoute,
  buildBreadcrumbs,
  getAllRoutes,
  getNodesByChamberType,
  getInitiationRequiredNodes,
  buildNavigationState,
  isRouteAccessible,
  getNextRoutes,
  formatNavigationForDisplay,
  type TempleNode,
  type TempleNavigationMap,
  type Breadcrumb,
  type NavigationState
} from './ancestralTempleNavigation';

// Ancestral Initiation Ceremony
export {
  buildInitiationCeremony,
  initializeProgress as initializeInitiationProgress,
  completeStage as completeInitiationStage,
  getCurrentStage as getCurrentInitiationStage,
  getProgressPercentage as getInitiationProgress,
  formatCeremonyForDisplay,
  formatCeremonyForVoice,
  getStageById,
  type InitiationStage,
  type InitiationCeremony,
  type InitiationProgress
} from './ancestralInitiation';

// Lineage Memory Engine
export {
  createLineageMemoryEngine,
  createLineageRecord,
  buildLineageRecordFromLadder,
  markRitualCompleted,
  markAsInitiated,
  addDialogue,
  updateHealingPath,
  getAllUniqueArchetypes,
  getAllUniqueThreads,
  getLineageStats,
  type LineageRecord,
  type LineageQuery,
  type LineageMemoryEngine
} from './lineageMemoryEngine';

// Mythos-Persona Fusion Layer
export {
  fuseMythosAndPersona,
  buildFusionLayer,
  generateGiftFusion,
  generateShadowFusion,
  generateIntegrationFusion,
  formatFusionForDisplay,
  formatFusionLayerForVoice,
  getFusionsByIntensity,
  getFusionByArchetype,
  type MythosPersonaFusion,
  type FusionLayer,
  type FusionOptions
} from './mythosPersonaFusion';

// Ancestral Temple State Machine
export {
  createTempleStateMachine,
  isInActiveSession,
  isInBlockingState,
  canNavigateFreely,
  getChamberAccess,
  getStateLabel,
  getEventLabel,
  formatMachineState,
  type TempleState,
  type TempleEvent,
  type TempleContext,
  type TransitionResult,
  type TempleStateMachine
} from './ancestralTempleStateMachine';

// Pilgrim's Rite of Passage
export {
  buildRiteOfPassage,
  initializeRiteProgress,
  completePhase as completeRitePhase,
  getCurrentPhase as getCurrentRitePhase,
  getProgressPercentage as getRiteProgress,
  getRemainingPhases,
  formatRiteForDisplay,
  formatRiteForVoice,
  getPhaseById,
  getThresholdPhases,
  type RitePhase,
  type RiteOfPassage,
  type RiteProgress
} from './riteOfPassage';

// Lineage Timeline Engine
export {
  buildLineageTimeline,
  buildTimelineRenderData,
  getEventsByGeneration,
  getEventsByTheme,
  getEventsByIntensity,
  getArcsByEvolution,
  getPilgrimMomentsByType,
  getTimelineSummary,
  formatTimelineForDisplay,
  type TimelineEvent,
  type TimelineArc,
  type TimelinePilgrimMoment,
  type LineageTimeline,
  type TimelineRenderData
} from './lineageTimelineEngine';

// Mythos Codex UI Template
export {
  renderMythosCodexHtml,
  renderCodexGridComponent,
  renderCodexPageDetail,
  getMythosCodexStyles,
  getMythosCodexScript,
  type MythosCodexUIData
} from './templates/mythosCodexUITemplate';

// Pilgrim-Ancestor Dialogue UI Template
export {
  renderDialogueUIHtml,
  renderDialogueContainerComponent,
  getDialogueUIStyles,
  getDialogueUIScript,
  type DialogueUIData
} from './templates/dialogueUITemplate';

// Lineage Memory Browser Template
export {
  renderMemoryBrowserHtml,
  renderMemoryListComponent,
  renderMemoryDetailComponent,
  getMemoryBrowserStyles,
  getMemoryBrowserScript,
  type MemoryBrowserUIData
} from './templates/memoryBrowserTemplate';

// Initiation Ceremony UI Template
export {
  renderInitiationCeremonyHtml,
  getInitiationUIStyles,
  getInitiationUIScript,
  type InitiationUIData
} from './templates/initiationCeremonyUITemplate';

// Timeline UI Template
export {
  renderTimelineUIHtml,
  renderTimelineContainerComponent,
  getTimelineUIStyles,
  getTimelineUIScript,
  type TimelineUIData
} from './templates/timelineUITemplate';

// Temple Animation Layer
export {
  TEMPLE_ANIMATIONS,
  ANIMATION_SEQUENCES,
  applyAnimation,
  applyAnimationsByTrigger,
  generateAnimationCSS,
  createAnimationState,
  type TempleAnimation,
  type AnimationTrigger,
  type AnimationSequence,
  type AnimationState
} from './templeAnimationLayer';

// Mythos Codex Search Engine
export {
  createSearchIndex,
  searchMythosCodex,
  searchArchetypes,
  searchByField,
  searchByThemes,
  getRelatedPages,
  getAutocompleteSuggestions,
  formatSearchResults,
  type CodexSearchResult,
  type SearchQuery,
  type SearchIndex
} from './mythosCodexSearch';

// Temple Soundscape Layer
export {
  TempleSoundscape,
  createSoundscape,
  createSoundEvent,
  getSoundEventsByTrigger,
  getAvailableTriggers,
  TEMPLE_SOUND_EVENTS,
  MINIMAL_SOUND_EVENTS,
  RICH_SOUND_EVENTS,
  type SoundEvent,
  type SoundTrigger,
  type SoundscapeState
} from './templeSoundscape';

// Mythos Narrative Generator
export {
  generateMythosNarrative,
  generateMythosNarratives,
  generateLineageMyth,
  formatNarrativeForDisplay,
  formatLineageMythForDisplay,
  formatNarrativeForVoice,
  getNarrativesByType,
  getNarrativeByArchetype,
  type MythosNarrative,
  type LineageMyth,
  type MythChapter,
  type NarrativeGenerationOptions
} from './mythosNarrativeGenerator';

// Advanced Dialogue Engine (Emotional Resonance)
export {
  generateResonantDialogue,
  generateSingleResonantExchange,
  calculateEmotionalResonance,
  getThemeEmotion,
  blendEmotions,
  formatResonantDialogueForDisplay,
  formatResonantDialogueForVoice,
  getTurnsBySpeaker,
  getTurnsByValence,
  getHighResonanceTurns,
  getEmotionalJourney,
  THEME_EMOTION_MAP,
  type EmotionalProfile,
  type ResonantDialogueTurn,
  type ResonantDialogue,
  type DialogueContext
} from './advancedDialogue';

// Temple Lighting Layer
export {
  computeLighting,
  blendLightingStates,
  createLightingTransition,
  generateLightingCSS,
  getLightingStyles,
  getLightingScript,
  getLightingPreset,
  getAllLightingPresets,
  LIGHTING_PRESETS,
  type LightingState,
  type LightingEvent,
  type LightingTrigger,
  type LightingPreset
} from './templeLighting';

// Generational Arc Synthesizer
export {
  synthesizeGenerationalArcs,
  synthesizeArchetypeArcs,
  clusterArcs,
  synthesizeFullArcAnalysis,
  formatArcSynthesisForDisplay,
  getArcsByType,
  getArcsByGeneration,
  getMostIntenseArcs,
  getArcsPeakingAt,
  type ArcType,
  type GenerationalArc,
  type ArcCluster,
  type ArcSynthesis
} from './generationalArcSynth';

// Mythos Hypergraph
export {
  buildMythosHypergraph,
  getNodesByType,
  getEdgesByRelation,
  getNeighbors,
  getNodeEdges,
  findPath,
  getThemeSubgraph,
  calculateCentrality,
  getMostCentralNodes,
  formatHypergraphForDisplay,
  exportHypergraphForVisualization,
  type HypergraphNodeType,
  type HypergraphNode,
  type HypergraphRelation,
  type HypergraphEdge,
  type MythosHypergraph
} from './mythosHypergraph';

// Temple Orchestration Engine
export {
  createTempleOrchestrationEngine,
  orchestrateDialogueSequence,
  orchestrateRitualSequence,
  getOrchestrationSummary,
  formatOrchestrationLog,
  type OrchestrationState,
  type OrchestrationLogEntry,
  type TempleOrchestrationEngine
} from './templeOrchestrationEngine';

// Generational Story Exporter (Hypergraph Edition)
export {
  exportGenerationalStoryHypergraphMarkdown,
  exportGenerationalStoryHypergraphHtml,
  exportGenerationalStoryHypergraphJson,
  exportGenerationalStoryHypergraph,
  getExportFileExtension,
  getExportMimeType,
  type HypergraphExportData,
  type ExportOptions as HypergraphExportOptions
} from './generationalStoryExporterHypergraph';

// Hypergraph-Aware Dialogue UI Template
export {
  renderDialogueHypergraphUIHtml,
  renderDialogueContainerComponent as renderDialogueHypergraphContainerComponent,
  renderHypergraphPanelComponent,
  getDialogueHypergraphStyles,
  getDialogueHypergraphScript,
  type DialogueHypergraphUIData
} from './templates/dialogueHypergraphUITemplate';

// Mythos Codex Visualizer Template
export {
  renderMythosVisualizerHtml,
  renderVisualizerCanvasComponent,
  getMythosVisualizerStyles,
  getMythosVisualizerScript,
  type MythosVisualizerUIData
} from './templates/mythosVisualizerTemplate';

// Pro Report Export (Technical + Narrative + Ancestral + Mythos)
export {
  exportProReportMarkdown,
  exportProReportHtml,
  exportProReportJson,
  exportProReport,
  getProReportFilename,
  getProReportMimeType,
  type PilgrimPosition,
  type AncestralSection,
  type MythosSection,
  type ProReportData,
  type ProReportOptions
} from './proReportExport';

// Ming Pan Pro Template (Professional Chart View)
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
} from './templates/mingPanProTemplate';

// Profiling Dashboard Template
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
} from './templates/profilingDashboardTemplate';

// Pro Interaction Diff Engine (Ming Pan Pro comparison)
export {
  diffInteractions,
  buildInteractionTimeline,
  getSignificantChanges,
  compareChartInteractions,
  findRecurringPatterns,
  getInteractionIcon,
  getSeverityColor,
  formatInteraction,
  renderInteractionDiffMarkdown,
  renderInteractionDiffHtml,
  type InteractionType,
  type InteractionEvent,
  type InteractionDiff,
  type DiffSummary,
  type InteractionSnapshot,
  type InteractionTimeline
} from './proInteractionDiff';

// Profiling + Constellation Fusion
export {
  fuseProfileAndConstellation,
  fuseProfilingAndConstellation,
  buildTeamFusion,
  renderProfileFusionMarkdown,
  renderTeamFusionMarkdown,
  type PersonProfile,
  type ConstellationThemes,
  type CompatibilityMatrix,
  type ProfileFusion,
  type FusionInsight,
  type TeamFusion,
  type TeamDynamic,
  type TeamRecommendation
} from './profilingConstellationFusion';

// Pro Report Designer (Customizable Sections)
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
  getReportDesignerScript,
  type SectionType,
  type ReportSection,
  type SectionOptions,
  type ReportDesign,
  type GlobalReportOptions,
  type GeneratedReport,
  type ReportMetadata
} from './proReportDesigner';

// Technical → Narrative Bridge Layer
export {
  translateTechnicalToNarrative,
  buildNarrativeBridge,
  getThemeForRule,
  getEmotionalToneForTheme,
  deriveStory,
  renderNarrativeBridgeMarkdown,
  type NarrativeTheme,
  type TechnicalPoint,
  type NarrativePoint,
  type EmotionalTone,
  type NarrativeBridge,
  type NarrativeArc,
  type NarrativeTransition
} from './techToNarrativeBridge';

// Pro → Narrative Cockpit Sync
export {
  syncProToNarrative,
  renderProNarrativeSyncMarkdown,
  type ProToNarrativeSyncPoint,
  type EmotionalArcSyncPoint,
  type TimingCurveSyncPoint,
  type InteractionData,
  type UsefulGodData,
  type AnnualData,
  type NarrativeCockpitData as ProNarrativeCockpitData,
  type ProNarrativeSync,
  type MappedStoryBeat,
  type EmotionalArcOverlay,
  type TimingCurveOverlay,
  type SyncSummary
} from './proToNarrativeSync';

// Profiling → Ritual Recommendations
export {
  generateRitualRecommendations,
  generateRitualProfile,
  renderRitualMarkdown,
  type RitualType,
  type RitualRecommendation,
  type RitualStep as ProfilingRitualStep,
  type RitualTiming,
  type RitualElements,
  type RitualProfile
} from './profilingToRitual';

// Technical → Hypergraph Mapping
export {
  mapTechnicalToHypergraph,
  renderTechHypergraphBridgeMarkdown,
  type TechnicalHypergraphMapping,
  type MappedNode,
  type MappedEdge,
  type InteractionInput,
  type UsefulGodInput,
  type TechHypergraphBridge,
  type HypergraphEnrichment,
  type BridgeSummary
} from './techToHypergraph';

// Full Feature Checklist (Joey Yap Parity + Beyond)
export {
  buildFullFeatureChecklist,
  renderChecklistMarkdown,
  renderChecklistHtml,
  type FeatureStatus,
  type FeatureChecklistItem,
  type FeatureCategory,
  type FullFeatureChecklist,
  type ChecklistSummary,
  type CategorySummary
} from './fullFeatureChecklist';

// Pro → Ancestral Temple Sync
export {
  syncProToTemple,
  mapInteractionToAncestralTheme,
  getAncestralThemeLabel,
  renderProTempleSyncMarkdown,
  type AncestralTheme,
  type ProTempleSyncPoint,
  type InteractionInput as TempleInteractionInput,
  type AnnualInput as TempleAnnualInput,
  type ProTempleSync,
  type AffectedThread,
  type RitualActivation,
  type ProTempleSyncSummary
} from './proToTempleSync';

// Profiling → Mythos Archetype Assignment
export {
  buildArchetypeProfile,
  assignArchetypes,
  calculateArchetypeScore,
  renderArchetypeProfileMarkdown,
  DEFAULT_ARCHETYPES,
  type ArchetypeDefinition,
  type ArchetypeMatch,
  type ProfileInput,
  type ArchetypeProfile,
  type ArchetypeProfileSummary
} from './profilingToArchetype';

// Ritual Timing Engine 2.0
export {
  computeRitualTiming2,
  getActiveWindow,
  getUpcomingWindows,
  calculateAncestralResonance,
  renderRitualCalendar2Markdown,
  type RitualType2,
  type RitualTrigger2,
  type EmotionalTone2,
  type RitualTimingWindow2,
  type RitualCalendar2,
  type RitualCalendarSummary2,
  type InteractionInput2,
  type LuckPillarInput2,
  type AnnualInput2,
  type ArcInput2
} from './ritualTiming2';

// Beyond Professional UI Template
export {
  renderBeyondProUIHtml,
  renderPanelComponent,
  getBeyondProStyles,
  getBeyondProScript,
  type BeyondProUIData,
  type HypergraphRenderData
} from './templates/beyondProUITemplate';

// Grand Orchestration Engine
export {
  GrandOrchestrationEngine,
  createGrandOrchestrationEngine,
  createCathedralFromBirthData,
  type CathedralState,
  type BirthData,
  type MingPanProState,
  type FourPillars,
  type Pillar,
  type Interaction,
  type LuckPillar,
  type NarrativeCockpitState,
  type StoryBeat,
  type EmotionalArc,
  type NarrativeThread,
  type AncestralTempleState,
  type PilgrimPosition as OrchestratorPilgrimPosition,
  type MythosCodexState,
  type ShadowWorkState,
  type GiftActivationState,
  type ProfilingState,
  type RitualCalendarState,
  type PilgrimJourneyState,
  type JourneyPhase,
  type Milestone as OrchestratorMilestone,
  type Quest as OrchestratorQuest,
  type OrchestrationMeta,
  type SyncStatus,
  type SyncEvent,
  type OrchestrationListener,
  type OrchestrationEvent,
  type OrchestrationResult,
  type CathedralStatusReport
} from './grandOrchestrationEngine';

// Pilgrim Journey 3.0
export {
  createPilgrimJourney3,
  advanceStage,
  updateStageProgress,
  integrateShadow,
  activateGift,
  completeQuest,
  resolveGenerationalDebt,
  activateGenerationalGift,
  calculateJourneyScore,
  calculateCoherenceLevel,
  getStageMetadata,
  getStageInfo,
  renderPilgrimJourney3Markdown,
  JOURNEY_STAGES,
  type JourneyStage,
  type StageMetadata,
  type PilgrimJourney3,
  type AncestralQuest,
  type InheritedPattern,
  type GenerationalDebt,
  type GenerationalGift,
  type Shadow,
  type Gift,
  type Quest3,
  type QuestObjective,
  type QuestReward,
  type Milestone3
} from './pilgrimJourney3';

// Lineage Simulation Engine
export {
  runLineageSimulation,
  getScenarioMetadata,
  renderSimulationMarkdown,
  type SimulationScenario,
  type SimulationInput,
  type SimulationParameters,
  type SimulationResult,
  type ProjectedGeneration,
  type ThreadEvolution,
  type ThreadState,
  type TurningPoint,
  type SimulationOutcome,
  type SimulationSummary
} from './lineageSimulationEngine';

// Mythos Oracle
export {
  consultOracle,
  quickOracle,
  dailyOracle,
  getVoiceCharacteristics,
  renderOracleResponseMarkdown,
  type OracleQueryType,
  type OracleQuery,
  type OracleContext,
  type OracleResponse,
  type OracleVoice,
  type OracleInterpretation,
  type ActionPrompt,
  type SymbolReference
} from './mythosOracle';

// Grand Hall UI Template
export {
  renderGrandHallHtml,
  type GrandHallData
} from './templates/grandHallTemplate';

// Full Reading Pipeline
export {
  runFullReadingPipeline,
  quickReading,
  deepReading,
  type BirthDataInput,
  type ReadingOptions,
  type AncestralDataInput,
  type FullReading,
  type TechnicalReading,
  type TechnicalInteraction,
  type TechnicalLuckPillar,
  type NarrativeReading,
  type StoryBeat as PipelineStoryBeat,
  type AncestralReading,
  type MythosReading,
  type ProfilingReading,
  type TimingReading,
  type OptimalTiming,
  type JourneyReading,
  type OracleReading,
  type SimulationReading,
  type ReadingMeta
} from './fullReadingPipeline';

// Documentation Codex
export {
  getCathedralDocumentation,
  getModuleRegistry,
  renderDocumentationMarkdown,
  type CodexSection,
  type CodexSubsection,
  type CodeExample,
  type ModuleReference,
  type CathedralLayer
} from './documentationCodex';

// One-Click Reading (Front Door)
export {
  runOneClickReading,
  askMythosOracle,
  exposeCathedralContext,
  type OneClickInput,
  type OneClickResult,
  type OneClickContext
} from './oneClickReading';

// Pilgrim Manual (Sacred Handbook)
export {
  buildPilgrimManual,
  getManualStep,
  getStepsByPhase,
  renderPilgrimManualMarkdown,
  renderPilgrimManualHtml,
  PILGRIM_MANUAL_STEPS,
  type ManualStep,
  type PilgrimManual,
  type ManualPhase
} from './pilgrimManual';

// Guide Mode (Educational Layer)
export {
  GuideModeController,
  createGuideModeController,
  getExplanation,
  EXPLANATIONS,
  type GuideLevel,
  type Explanation,
  type ExplanationContent,
  type ExplanationRegistry,
  type GuideContext
} from './guideMode';

// Practice Mode (Exercise System)
export {
  initPracticeSession,
  checkPracticeAnswer,
  updatePracticeSession,
  getExercisesForSkill,
  getRandomExercise,
  adaptExerciseLevel,
  PRACTICE_EXERCISES,
  type SkillId,
  type PracticeExercise,
  type PracticeSession,
  type PracticeAttempt
} from './practiceMode';

// Mastery Mode (Skill Trees & Adaptive Learning)
export {
  initMasteryState,
  updateMastery,
  pickNextSkill,
  pickExerciseForSkill,
  getSkillsDueForReview,
  isSkillUnlocked,
  getUnlockedSkills,
  getSkillTreeWithStatus,
  getMasteryStats,
  SKILL_TREE,
  ACHIEVEMENTS,
  type SkillNode,
  type SkillProgress,
  type MasteryLevel,
  type MasteryState,
  type Achievement,
  type ReviewRecommendation,
  type SkillCategory
} from './masteryMode';

// Educational UI Templates
export {
  renderOneClickReadingHtml,
  renderBirthFormComponent,
  renderLoadingComponent,
  getOneClickStyles,
  getOneClickScript,
  renderGuideModeHtml,
  renderLevelSelector,
  renderExplanationOverlay,
  renderExplainableTerm,
  renderExplanationCard,
  renderExplanationReferencePage,
  getGuideModeStyles,
  getGuideModeScript,
  renderPracticeModeHtml,
  renderExerciseCard,
  getPracticeModeStyles,
  getPracticeModeScript,
  renderMasteryModeHtml,
  renderSkillTreeComponent,
  renderAchievementBadge,
  getMasteryModeStyles,
  getMasteryModeScript,
  type OneClickReadingUIData,
  type GuideModeUIData,
  type PracticeModeUIData,
  type MasteryModeUIData
} from './templates';

// ==================== CLASSICAL BAZI MODULES ====================

// Growth Stages Engine (長生十二運)
export {
  computeGrowthStage,
  computeChartGrowthStages,
  getGrowthStageStrength,
  getGrowthStagePhase,
  isGrowthStageStrong,
  formatGrowthStageForDisplay,
  GROWTH_TABLE,
  GROWTH_STAGES,
  STAGE_STRENGTH,
  type GrowthStage,
  type GrowthStageResult,
  type ChartGrowthStages,
  type GrowthPhase
} from './growthStages';

// Follow Structure Engine (从格)
export {
  detectFollowStructure,
  isFollowStructure,
  getFollowStructureNarrative,
  checkFollowDisruption,
  getFollowUsefulElements,
  type FollowStructureType,
  type FollowStructureResult,
  type FollowAnalysisInput
} from './followStructure';

// Shen Sha Library (神煞)
export {
  detectShenSha,
  getShenShaStar,
  getShenShaByCategory,
  getAllShenShaStars,
  formatShenShaForDisplay,
  SHEN_SHA_STARS,
  NOBLEMAN_TABLE,
  LITERARY_TABLE,
  type ShenShaStar,
  type ShenShaHit,
  type ShenShaAnalysis,
  type ChartInput as ShenShaChartInput
} from './shenSha';

// Favorability Engine (用神/忌神)
export {
  computeFavorability,
  isElementFavorable,
  isElementUnfavorable,
  getElementScore,
  evaluateTimingElement,
  FIVE_ELEMENTS,
  ELEMENT_PRODUCES,
  ELEMENT_CONTROLS,
  ELEMENT_PRODUCED_BY,
  ELEMENT_CONTROLLED_BY,
  type FavorabilityType,
  type ElementFavorability,
  type FavorabilityAnalysis,
  type FavorabilityInput
} from './favorabilityEngine';

// Seasonal Strength Engine (月令/季节强度)
export {
  getMonthCommander,
  computeSeasonalStrength,
  analyzeSeasonalInfluence,
  getElementSeasonalStrength,
  isElementInSeason,
  isElementOutOfSeason,
  calculateSeasonalModifier,
  getSeasonalRanking,
  getSeasonalActivities,
  MONTH_COMMANDER_MAP,
  SEASONAL_STRENGTH_TABLE,
  type SeasonalStrength,
  type MonthCommander,
  type SeasonalAnalysis
} from './seasonalStrengthEngine';

// Multi-Chart Compare Engine
export {
  compareCharts,
  getQuickCompatibility,
  findMostCompatiblePair,
  findClashingCharts,
  type ChartData,
  type InteractionComparison,
  type ElementComparison,
  type ChartComparison
} from './multiChartCompare';

// Team Technical Engine
export {
  summarizeTeamTechnical,
  getTeamCompatibilityScore,
  suggestTeamRoles,
  type TeamMember,
  type TeamElementProfile,
  type TeamStructureProfile,
  type TeamShenShaProfile,
  type TeamTechnicalSummary
} from './teamTechnical';

// Case Studies Module
export {
  getAllCaseStudies,
  getCaseStudiesByCategory,
  getCaseStudiesByDifficulty,
  getCaseStudyById,
  getAllCollections,
  getCollectionById,
  getRecommendedCases,
  extractTeachingPoints,
  getTeachingPointsByConcept,
  generateStudyPath,
  getCollectionProgress,
  CASE_BALANCED_ELEMENTS,
  CASE_FOLLOW_WEALTH,
  CASE_NOBLEMAN_STAR,
  BEGINNER_COLLECTION,
  ADVANCED_PATTERNS_COLLECTION,
  SHEN_SHA_COLLECTION,
  type DifficultyLevel,
  type CaseCategory,
  type TeachingPoint,
  type CaseStudyChart,
  type AnalysisSection,
  type CaseStudy,
  type CaseStudyCollection,
  type CaseStudyProgress
} from './caseStudies';

// Organization Dashboard
export {
  generateOrgDashboard,
  getOrgHealthScore,
  compareOrganizations,
  generateExecutiveSummary,
  type Department,
  type OrgElementDistribution,
  type OrgStructureDistribution,
  type CrossTeamCompatibility,
  type OrgTalentGap,
  type OrgDashboard
} from './orgDashboard';

// ==================== INTEGRATION LAYERS ====================

// All integration layer exports
export * from './integrations';

// ==================== INTERPRETATION LIBRARIES ====================

// All interpretation library exports
export * from './libraries';
