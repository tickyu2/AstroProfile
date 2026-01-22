/**
 * ============================================
 * CATHEDRAL INDEX DATA BUILDER
 * Aggregates all Cathedral layers into a single
 * payload for the Index Page and DevTools
 *
 * Data Flow:
 * BaZi Analysis → Codex → Narrative Cockpit → Index Payload
 * ============================================
 */

import { KnowledgeCodex, CodexEntry } from './codexTypes';
import { ChartContext, ClassicalEdgeCaseResult } from './types';
import { NarrativeCockpitData, StoryBeat, EmotionalArcPoint, TimingCurvePoint, EnvironmentalOverlay, LifeChapter } from './narrativeCockpitModel';
import { synthesizeNarrativeCockpit, BaZiAnalysisInput, NarrativeSynthesisInput } from './narrativeSynthesis';

// ==================== PAYLOAD TYPES ====================

export interface CathedralIndexPayload {
  meta: CathedralMeta;
  analysis: BaZiAnalysisInput;
  codex: CodexEntry[];
  cockpit: NarrativeCockpitData;
  ruleNarrativeMap: RuleNarrativeMap;
  diagnostics: CathedralDiagnostics;
}

export interface CathedralMeta {
  chartId: string;
  generatedAt: Date;
  ruleCount: number;
  storyBeatCount: number;
  emotionalPoints: number;
  timingPoints: number;
  overlayCount: number;
  chapterCount: number;
  categoryCounts: Record<string, number>;
  severityCounts: Record<string, number>;
  effectCounts: Record<string, number>;
}

export interface RuleNarrativeImpact {
  ruleId: string;
  ruleName: string;
  category: string;
  storyBeats: StoryBeat[];
  emotionalPoints: EmotionalArcPoint[];
  timingPoints: TimingCurvePoint[];
  overlays: EnvironmentalOverlay[];
  chapters: LifeChapter[];
  totalImpact: number; // Aggregate score
}

export type RuleNarrativeMap = Record<string, RuleNarrativeImpact>;

export interface CathedralDiagnostics {
  rulesWithNoNarrativeImpact: string[];
  highImpactRules: string[];
  narrativeCoverage: number; // 0-100%
  emotionalBalance: number; // -100 to +100
  timingVolatility: number; // 0-100
  warnings: string[];
}

// ==================== MAIN BUILDER ====================

/**
 * Build complete Cathedral Index payload from analysis + codex
 */
export function buildCathedralIndexPayload(
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[],
  chartId?: string
): CathedralIndexPayload {
  // Synthesize narrative cockpit
  const cockpit = synthesizeNarrativeCockpit({
    analysis,
    codexEntries,
    chartId
  });

  // Build rule → narrative mapping
  const ruleNarrativeMap = buildRuleNarrativeMap(codexEntries, cockpit);

  // Calculate metadata
  const meta = buildMeta(codexEntries, cockpit, chartId);

  // Run diagnostics
  const diagnostics = runDiagnostics(codexEntries, cockpit, ruleNarrativeMap);

  return {
    meta,
    analysis,
    codex: codexEntries,
    cockpit,
    ruleNarrativeMap,
    diagnostics
  };
}

// ==================== RULE → NARRATIVE MAPPING ====================

/**
 * Build map of each rule to its narrative impact
 */
function buildRuleNarrativeMap(
  codexEntries: CodexEntry[],
  cockpit: NarrativeCockpitData
): RuleNarrativeMap {
  const map: RuleNarrativeMap = {};

  for (const entry of codexEntries) {
    const ruleId = entry.rule.id;

    // Find all narrative elements referencing this rule
    const storyBeats = cockpit.storyBeats.filter(b => b.keyRules.includes(ruleId));
    const emotionalPoints = cockpit.emotionalArc.filter(p => p.triggers.includes(ruleId));
    const timingPoints = cockpit.timingCurve.filter(p => p.keyEvents.includes(ruleId));
    const overlays = cockpit.overlays.filter(o => o.id.includes(ruleId));
    const chapters = cockpit.lifeChapters.filter(c => c.keyBeats.some(bid =>
      storyBeats.some(b => b.id === bid)
    ));

    // Calculate total impact score
    const totalImpact = calculateRuleImpact(
      entry,
      storyBeats,
      emotionalPoints,
      timingPoints,
      overlays
    );

    map[ruleId] = {
      ruleId,
      ruleName: entry.rule.name || entry.explanation.title,
      category: entry.rule.category,
      storyBeats,
      emotionalPoints,
      timingPoints,
      overlays,
      chapters,
      totalImpact
    };
  }

  return map;
}

/**
 * Calculate aggregate impact score for a rule
 */
function calculateRuleImpact(
  entry: CodexEntry,
  beats: StoryBeat[],
  emo: EmotionalArcPoint[],
  timing: TimingCurvePoint[],
  overlays: EnvironmentalOverlay[]
): number {
  let score = 0;

  // Base score from severity
  const severityScores: Record<string, number> = {
    'major': 50,
    'significant': 40,
    'moderate': 25,
    'minor': 15,
    'info': 5
  };
  score += severityScores[entry.severity] || 20;

  // Story beat presence adds 10 per beat
  score += beats.length * 10;

  // Emotional impact adds based on intensity
  score += emo.reduce((sum, p) => sum + Math.abs(p.intensity) / 10, 0);

  // Timing impact
  score += timing.length * 8;

  // Overlay presence
  score += overlays.length * 5;

  return Math.min(100, score);
}

// ==================== METADATA BUILDER ====================

function buildMeta(
  codexEntries: CodexEntry[],
  cockpit: NarrativeCockpitData,
  chartId?: string
): CathedralMeta {
  // Category counts
  const categoryCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = {};
  const effectCounts: Record<string, number> = {};

  for (const entry of codexEntries) {
    const cat = entry.rule.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const sev = entry.severity;
    severityCounts[sev] = (severityCounts[sev] || 0) + 1;

    const eff = entry.effect;
    effectCounts[eff] = (effectCounts[eff] || 0) + 1;
  }

  return {
    chartId: chartId || cockpit.chartId,
    generatedAt: new Date(),
    ruleCount: codexEntries.length,
    storyBeatCount: cockpit.storyBeats.length,
    emotionalPoints: cockpit.emotionalArc.length,
    timingPoints: cockpit.timingCurve.length,
    overlayCount: cockpit.overlays.length,
    chapterCount: cockpit.lifeChapters.length,
    categoryCounts,
    severityCounts,
    effectCounts
  };
}

// ==================== DIAGNOSTICS ====================

function runDiagnostics(
  codexEntries: CodexEntry[],
  cockpit: NarrativeCockpitData,
  ruleMap: RuleNarrativeMap
): CathedralDiagnostics {
  const warnings: string[] = [];

  // Find rules with no narrative impact
  const rulesWithNoNarrativeImpact: string[] = [];
  const highImpactRules: string[] = [];

  for (const [ruleId, impact] of Object.entries(ruleMap)) {
    if (impact.totalImpact < 10) {
      rulesWithNoNarrativeImpact.push(ruleId);
    }
    if (impact.totalImpact > 70) {
      highImpactRules.push(ruleId);
    }
  }

  // Calculate narrative coverage (% of rules with some narrative impact)
  const rulesWithImpact = Object.values(ruleMap).filter(r => r.totalImpact >= 10).length;
  const narrativeCoverage = codexEntries.length > 0
    ? Math.round((rulesWithImpact / codexEntries.length) * 100)
    : 0;

  // Calculate emotional balance (-100 to +100)
  const emotionalSum = cockpit.emotionalArc.reduce((sum, p) => sum + p.intensity, 0);
  const emotionalBalance = cockpit.emotionalArc.length > 0
    ? Math.round(emotionalSum / cockpit.emotionalArc.length)
    : 0;

  // Calculate timing volatility (average of all volatility values)
  const volatilitySum = cockpit.timingCurve.reduce((sum, p) => sum + p.volatility, 0);
  const timingVolatility = cockpit.timingCurve.length > 0
    ? Math.round(volatilitySum / cockpit.timingCurve.length)
    : 0;

  // Generate warnings
  if (narrativeCoverage < 50) {
    warnings.push(`Low narrative coverage: only ${narrativeCoverage}% of rules contribute to the narrative`);
  }
  if (emotionalBalance > 50) {
    warnings.push(`Highly positive emotional bias (+${emotionalBalance}) - may need balance check`);
  }
  if (emotionalBalance < -50) {
    warnings.push(`Highly negative emotional bias (${emotionalBalance}) - may need balance check`);
  }
  if (timingVolatility > 70) {
    warnings.push(`High timing volatility (${timingVolatility}) - narrative may feel turbulent`);
  }
  if (rulesWithNoNarrativeImpact.length > 10) {
    warnings.push(`${rulesWithNoNarrativeImpact.length} rules have no narrative impact - consider integration`);
  }

  return {
    rulesWithNoNarrativeImpact,
    highImpactRules,
    narrativeCoverage,
    emotionalBalance,
    timingVolatility,
    warnings
  };
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get narrative impact for a specific rule
 */
export function getRuleNarrativeImpact(
  payload: CathedralIndexPayload,
  ruleId: string
): RuleNarrativeImpact | undefined {
  return payload.ruleNarrativeMap[ruleId];
}

/**
 * Get all rules sorted by impact
 */
export function getRulesByImpact(
  payload: CathedralIndexPayload,
  descending = true
): RuleNarrativeImpact[] {
  const rules = Object.values(payload.ruleNarrativeMap);
  return descending
    ? rules.sort((a, b) => b.totalImpact - a.totalImpact)
    : rules.sort((a, b) => a.totalImpact - b.totalImpact);
}

/**
 * Get rules filtered by category
 */
export function getRulesByCategory(
  payload: CathedralIndexPayload,
  category: string
): RuleNarrativeImpact[] {
  return Object.values(payload.ruleNarrativeMap)
    .filter(r => r.category === category);
}

/**
 * Serialize payload to JSON for window injection
 */
export function serializePayloadForWindow(payload: CathedralIndexPayload): string {
  return JSON.stringify(payload, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
}

// ==================== EXPORTS ====================

export {
  buildCathedralIndexPayload,
  buildRuleNarrativeMap,
  getRuleNarrativeImpact,
  getRulesByImpact,
  getRulesByCategory,
  serializePayloadForWindow
};
