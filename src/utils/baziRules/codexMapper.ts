/**
 * ============================================
 * CODEX MAPPER
 * Transforms raw rule engine results into
 * Knowledge Codex entries
 * ============================================
 */

import {
  CodexEntry,
  CodexRuleReference,
  CodexExplanation,
  CodexCategory,
  CodexSeverity,
  CodexEffect,
  KnowledgeCodex,
  JOURNEY_CHAMBERS
} from './codexTypes';

import {
  ClassicalEdgeCaseResult,
  StructureRule,
  CombinationRule,
  UsefulGodRule,
  ClashHarmPunishmentRule,
  SeasonalRule,
  HiddenStemRule,
  LuckPillarRule,
  RuleMatch,
  BaseRule,
  Element,
  UsefulGodEvaluation,
  LuckPillarEvaluation,
  DetectedClash,
  DetectedHarm,
  DetectedPunishment,
  DetectedCombination,
  HiddenStem,
  PillarPosition
} from './types';

// Inline types for evaluated items from ClassicalEdgeCaseResult
type CombinationItem = ClassicalEdgeCaseResult['combinations']['combinations'][number];
type ClashItem = ClassicalEdgeCaseResult['clashHarmPunishment']['clashes'][number];
type HarmItem = ClassicalEdgeCaseResult['clashHarmPunishment']['harms'][number];
type PunishmentItem = ClassicalEdgeCaseResult['clashHarmPunishment']['punishments'][number];
type HiddenStemItem = ClassicalEdgeCaseResult['hiddenStems']['stems'][number];

// Import rule JSON files
import structuresJson from '../../data/rules/structures.json';
import combinationsJson from '../../data/rules/combinations.json';
import usefulGodJson from '../../data/rules/useful_god.json';
import clashJson from '../../data/rules/clash_harm_punishment.json';
import seasonalJson from '../../data/rules/seasonal.json';
import hiddenJson from '../../data/rules/hidden_stems.json';
import luckJson from '../../data/rules/luck_pillar.json';

// Import narrative generators
import {
  buildStructurePersonaHook,
  buildStructureJourneyHint,
  buildCombinationPersonaHook,
  buildCombinationJourneyHint,
  buildUsefulGodPersonaHook,
  buildUsefulGodJourneyHint,
  buildClashPersonaHook,
  buildClashJourneyHint,
  buildSeasonalPersonaHook,
  buildSeasonalJourneyHint,
  buildHiddenStemPersonaHook,
  buildHiddenStemJourneyHint,
  buildLuckPillarPersonaHook,
  buildLuckPillarJourneyHint
} from './narrativeGenerators';

/**
 * Build complete Knowledge Codex from rule evaluation results
 */
export function buildKnowledgeCodex(
  result: ClassicalEdgeCaseResult,
  chartId?: string
): KnowledgeCodex {
  const entries: CodexEntry[] = [];

  // Process each category
  entries.push(...buildStructureEntries(result));
  entries.push(...buildCombinationEntries(result));
  entries.push(...buildUsefulGodEntries(result));
  entries.push(...buildClashHarmPunishmentEntries(result));
  entries.push(...buildSeasonalEntries(result));
  entries.push(...buildHiddenStemEntries(result));

  if (result.luckPillar) {
    entries.push(...buildLuckPillarEntries(result));
  }

  // Calculate summary
  const summary = calculateSummary(entries);

  return {
    generatedAt: new Date(),
    chartId,
    entries,
    summary,
    openingNarrative: generateOpeningNarrative(summary, result),
    closingNarrative: generateClosingNarrative(summary, result)
  };
}

// ==================== STRUCTURE ENTRIES ====================

function buildStructureEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];

  for (const match of result.structures.matchedRules) {
    if (!match.matched) continue;

    const rule = match.rule;
    const entry: CodexEntry = {
      rule: {
        id: rule.id,
        name: rule.name,
        chineseName: extractChineseName(rule.name),
        category: 'structure',
        priority: rule.priority
      },
      explanation: {
        title: `Structure: ${rule.name}`,
        summary: describeStructureSummary(rule, result),
        technicalDetail: describeStructureTechnical(rule),
        interpretation: interpretStructureEffect(rule, result),
        recommendations: buildStructureRecommendations(rule, result),
        warnings: result.structures.warnings
      },
      severity: determineStructureSeverity(rule),
      effect: determineStructureEffect(rule),
      confidence: calculateConfidence(match),
      personaHook: buildStructurePersonaHook(rule, result),
      journeyStepHint: buildStructureJourneyHint(rule, result),
      journeyChamber: 'Structure Chamber',
      iconHint: '🏛️'
    };

    entries.push(entry);
  }

  // If no special structure, add "normal" entry
  if (entries.length === 0 && result.structures.determinedStructure === 'normal') {
    entries.push({
      rule: {
        id: 'normal_structure',
        name: 'Standard Chart Structure',
        chineseName: '正常格局',
        category: 'structure',
        priority: 100
      },
      explanation: {
        title: 'Standard Chart Structure',
        summary: 'Your chart follows a conventional pattern without special structural formations.',
        technicalDetail: 'No special follow (从格), established rank (建禄格), or blade (羊刃格) structures detected.',
        interpretation: 'This means standard rules of useful god selection and element balance apply to your chart.',
        recommendations: ['Focus on strengthening your useful god', 'Balance weak elements through activities and timing']
      },
      severity: 'info',
      effect: 'neutral',
      confidence: 90,
      personaHook: '你的格局循常轨而行，无需特殊法门，但求中庸之道。',
      journeyStepHint: 'Your chart\'s foundation is solid and conventional. We can apply the time-tested principles of BaZi directly.',
      journeyChamber: 'Structure Chamber',
      iconHint: '🏛️'
    });
  }

  return entries;
}

// ==================== COMBINATION ENTRIES ====================

function buildCombinationEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];

  for (const combo of result.combinations.combinations) {
    const ruleApplied = combo.ruleApplied;

    const entry: CodexEntry = {
      rule: {
        id: ruleApplied?.rule.id || `combination_${combo.combination.type}`,
        name: ruleApplied?.rule.name || describeCombinationType(combo.combination.type),
        chineseName: getCombinationChineseName(combo.combination.type),
        category: 'combination',
        priority: ruleApplied?.rule.priority || 50
      },
      explanation: {
        title: `Combination: ${combo.combination.participants.join(' + ')}`,
        summary: describeCombinationSummary(combo),
        technicalDetail: describeCombinationTechnical(combo),
        interpretation: interpretCombinationEffect(combo),
        recommendations: buildCombinationRecommendations(combo)
      },
      severity: combo.finalStatus === 'broken' ? 'moderate' : 'minor',
      effect: combo.finalStatus === 'transformed' ? 'beneficial' : 'mixed',
      confidence: combo.finalStatus === 'transformed' ? 85 : 70,
      personaHook: buildCombinationPersonaHook(combo, result),
      journeyStepHint: buildCombinationJourneyHint(combo, result),
      journeyChamber: 'Heavenly Combinations Hall',
      iconHint: '🔗'
    };

    entries.push(entry);
  }

  return entries;
}

// ==================== USEFUL GOD ENTRIES ====================

function buildUsefulGodEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];
  const ug = result.usefulGod;

  // Main useful god entry
  if (ug.primaryUsefulGod) {
    const entry: CodexEntry = {
      rule: {
        id: `useful_god_${ug.primaryUsefulGod.toLowerCase()}`,
        name: `Useful God: ${ug.primaryUsefulGod}`,
        chineseName: `用神：${getElementChinese(ug.primaryUsefulGod)}`,
        category: 'useful_god',
        priority: 1
      },
      explanation: {
        title: `Your Useful God is ${ug.primaryUsefulGod}`,
        summary: describeUsefulGodSummary(ug),
        technicalDetail: describeUsefulGodTechnical(ug),
        interpretation: interpretUsefulGodEffect(ug),
        recommendations: buildUsefulGodRecommendations(ug),
        warnings: ug.warnings
      },
      severity: ug.status === 'blocked' ? 'significant' : (ug.status === 'weakened' ? 'moderate' : 'info'),
      effect: ug.status === 'active' ? 'beneficial' : 'challenging',
      confidence: ug.effectivenessPercent,
      personaHook: buildUsefulGodPersonaHook(ug, result),
      journeyStepHint: buildUsefulGodJourneyHint(ug, result),
      journeyChamber: 'Useful God Sanctuary',
      iconHint: '⭐'
    };

    entries.push(entry);
  }

  // Add entries for matched exception rules
  for (const match of ug.matchedRules) {
    if (!match.matched) continue;

    const rule = match.rule;
    entries.push({
      rule: {
        id: rule.id,
        name: rule.name,
        category: 'useful_god',
        priority: rule.priority
      },
      explanation: {
        title: `Useful God Exception: ${rule.name}`,
        summary: `An exception rule affects your useful god: ${rule.name}`,
        technicalDetail: JSON.stringify(rule.conditions),
        interpretation: match.result.warning || match.result.note || 'This modifies how your useful god functions.',
        recommendations: match.result.recommendation ? [match.result.recommendation] : undefined
      },
      severity: 'moderate',
      effect: 'mixed',
      confidence: 75,
      personaHook: buildUsefulGodPersonaHook(ug, result),
      journeyStepHint: buildUsefulGodJourneyHint(ug, result),
      journeyChamber: 'Useful God Sanctuary',
      iconHint: '⚠️'
    });
  }

  return entries;
}

// ==================== CLASH/HARM/PUNISHMENT ENTRIES ====================

function buildClashHarmPunishmentEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];
  const chp = result.clashHarmPunishment;

  // Clash entries
  for (const clash of chp.clashes) {
    entries.push({
      rule: {
        id: `clash_${clash.clash.pair.join('_')}`,
        name: `Clash: ${clash.clash.pair.join(' vs ')}`,
        chineseName: `冲：${clash.clash.pair.join('')}`,
        category: 'clash',
        priority: 10
      },
      explanation: {
        title: `Branch Clash: ${clash.clash.pair.join(' ↔ ')}`,
        summary: describeClashSummary(clash),
        technicalDetail: describeClashTechnical(clash),
        interpretation: interpretClashEffect(clash),
        recommendations: buildClashRecommendations(clash)
      },
      severity: clash.effect === 'harmful' ? 'moderate' : 'minor',
      effect: clash.effect === 'beneficial' ? 'beneficial' : 'challenging',
      confidence: 85,
      personaHook: buildClashPersonaHook(clash, result),
      journeyStepHint: buildClashJourneyHint(clash, result),
      journeyChamber: 'Clash & Conflict Court',
      iconHint: '⚡'
    });
  }

  // Harm entries
  for (const harm of chp.harms) {
    entries.push({
      rule: {
        id: `harm_${harm.harm.pair.join('_')}`,
        name: `Harm: ${harm.harm.pair.join(' vs ')}`,
        chineseName: `害：${harm.harm.pair.join('')}`,
        category: 'harm',
        priority: 20
      },
      explanation: {
        title: `Six Harm: ${harm.harm.pair.join(' ⊗ ')}`,
        summary: `The branches ${harm.harm.pair.join(' and ')} form a Six Harm relationship.`,
        technicalDetail: 'Six Harm (六害) represents hidden friction and underlying tension.',
        interpretation: 'This may manifest as subtle conflicts, miscommunications, or hidden obstacles.',
        recommendations: ['Be mindful of hidden tensions', 'Address conflicts proactively']
      },
      severity: 'minor',
      effect: 'challenging',
      confidence: 80,
      personaHook: buildClashPersonaHook(harm, result),
      journeyStepHint: 'In the Court of Conflicts, we acknowledge hidden frictions that shape your path.',
      journeyChamber: 'Clash & Conflict Court',
      iconHint: '🔄'
    });
  }

  // Punishment entries
  for (const punishment of chp.punishments) {
    entries.push({
      rule: {
        id: `punishment_${punishment.punishment.type}`,
        name: `Punishment: ${punishment.punishment.type}`,
        chineseName: getPunishmentChineseName(punishment.punishment.type),
        category: 'punishment',
        priority: 5
      },
      explanation: {
        title: `${getPunishmentTitle(punishment.punishment.type)}`,
        summary: describePunishmentSummary(punishment),
        technicalDetail: describePunishmentTechnical(punishment),
        interpretation: interpretPunishmentEffect(punishment),
        recommendations: buildPunishmentRecommendations(punishment)
      },
      severity: punishment.severity === 'high' ? 'significant' : 'moderate',
      effect: 'challenging',
      confidence: punishment.punishment.complete ? 90 : 70,
      personaHook: buildClashPersonaHook(punishment, result),
      journeyStepHint: 'In the Court of Conflicts, we face the deeper lessons of punishment patterns.',
      journeyChamber: 'Clash & Conflict Court',
      iconHint: '⚠️'
    });
  }

  return entries;
}

// ==================== SEASONAL ENTRIES ====================

function buildSeasonalEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];
  const seasonal = result.seasonal;

  // Find significantly modified elements
  for (const [element, modifier] of Object.entries(seasonal.elementModifiers)) {
    if (modifier === 1.0) continue; // Skip unmodified

    const isWeak = modifier < 1.0;
    entries.push({
      rule: {
        id: `seasonal_${element.toLowerCase()}`,
        name: `Seasonal ${element} Modifier`,
        chineseName: `${getElementChinese(element)}之季节调整`,
        category: 'seasonal',
        priority: 30
      },
      explanation: {
        title: `${element} Element: ${isWeak ? 'Weakened' : 'Strengthened'} by Season`,
        summary: `The ${element} element is ${isWeak ? 'weakened' : 'strengthened'} to ${Math.round(modifier * 100)}% effectiveness this season.`,
        technicalDetail: describeSeasonalTechnical(element, modifier),
        interpretation: interpretSeasonalEffect(element, modifier, isWeak),
        recommendations: buildSeasonalRecommendations(element, isWeak, seasonal.supportNeeded)
      },
      severity: modifier < 0.5 ? 'moderate' : 'minor',
      effect: isWeak ? 'challenging' : 'beneficial',
      confidence: 95,
      personaHook: buildSeasonalPersonaHook(element, modifier, result),
      journeyStepHint: buildSeasonalJourneyHint(element, modifier, result),
      journeyChamber: 'Elemental Winds Gallery',
      iconHint: getElementEmoji(element)
    });
  }

  return entries;
}

// ==================== HIDDEN STEM ENTRIES ====================

function buildHiddenStemEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];

  // Group significant hidden stem findings
  const significantStems = result.hiddenStems.stems.filter(
    s => s.status !== 'active' || s.effectiveStrength > 50
  );

  for (const stem of significantStems) {
    if (stem.status === 'active' && stem.stem.type !== 'main_qi') continue;

    entries.push({
      rule: {
        id: `hidden_${stem.pillar}_${stem.stem.stem}`,
        name: `Hidden ${stem.stem.element} in ${stem.pillar}`,
        chineseName: `${stem.pillar}支藏${stem.stem.stem}`,
        category: 'hidden_stem',
        priority: 40
      },
      explanation: {
        title: `Hidden Stem: ${stem.stem.stem} (${stem.stem.element})`,
        summary: describeHiddenStemSummary(stem),
        technicalDetail: describeHiddenStemTechnical(stem),
        interpretation: interpretHiddenStemEffect(stem),
        recommendations: buildHiddenStemRecommendations(stem)
      },
      severity: stem.status === 'disrupted' ? 'moderate' : 'minor',
      effect: stem.status === 'active' ? 'beneficial' : 'mixed',
      confidence: Math.round(stem.effectiveStrength),
      personaHook: buildHiddenStemPersonaHook(stem, result),
      journeyStepHint: buildHiddenStemJourneyHint(stem, result),
      journeyChamber: 'Hidden Roots Crypt',
      iconHint: '🔮'
    });
  }

  return entries;
}

// ==================== LUCK PILLAR ENTRIES ====================

function buildLuckPillarEntries(result: ClassicalEdgeCaseResult): CodexEntry[] {
  const entries: CodexEntry[] = [];

  if (!result.luckPillar) return entries;

  const lp = result.luckPillar;

  // Main luck pillar entry
  entries.push({
    rule: {
      id: 'current_luck_pillar',
      name: 'Current Luck Pillar Period',
      chineseName: '当前大运',
      category: 'luck_pillar',
      priority: 1
    },
    explanation: {
      title: `Luck Pillar Period: ${lp.periodQuality}`,
      summary: describeLuckPillarSummary(lp),
      technicalDetail: describeLuckPillarTechnical(lp),
      interpretation: interpretLuckPillarEffect(lp),
      recommendations: buildLuckPillarRecommendations(lp),
      warnings: lp.warnings
    },
    severity: lp.periodQuality === 'turbulent' ? 'major' : (lp.periodQuality === 'challenging' ? 'significant' : 'info'),
    effect: lp.periodQuality === 'favorable' ? 'beneficial' : (lp.periodQuality === 'neutral' ? 'neutral' : 'challenging'),
    confidence: 80,
    personaHook: buildLuckPillarPersonaHook(lp, result),
    journeyStepHint: buildLuckPillarJourneyHint(lp, result),
    journeyChamber: 'DaYun Corridor',
    iconHint: '📅'
  });

  // Activated patterns
  for (const pattern of lp.activatedPatterns) {
    entries.push({
      rule: {
        id: `luck_pattern_${pattern.replace(/\s+/g, '_').toLowerCase()}`,
        name: pattern,
        category: 'luck_pillar',
        priority: 20
      },
      explanation: {
        title: `Activated: ${pattern}`,
        summary: `This luck pillar activates: ${pattern}`,
        technicalDetail: 'Pattern activated by luck pillar interaction with natal chart.',
        interpretation: 'This pattern becomes active during this luck pillar period.'
      },
      severity: 'moderate',
      effect: 'mixed',
      confidence: 75,
      personaHook: `在此大运中，${pattern}之象已然显现。`,
      journeyStepHint: `Along the DaYun Corridor, we see ${pattern} emerging.`,
      journeyChamber: 'DaYun Corridor',
      iconHint: '🔄'
    });
  }

  return entries;
}

// ==================== HELPER FUNCTIONS ====================

function calculateSummary(entries: CodexEntry[]): KnowledgeCodex['summary'] {
  const byCategory: Record<CodexCategory, number> = {
    structure: 0, combination: 0, useful_god: 0, clash: 0,
    harm: 0, punishment: 0, seasonal: 0, hidden_stem: 0,
    luck_pillar: 0, shen_sha: 0
  };

  const bySeverity: Record<CodexSeverity, number> = {
    info: 0, minor: 0, moderate: 0, significant: 0, major: 0
  };

  let beneficialCount = 0;
  let challengingCount = 0;

  for (const entry of entries) {
    byCategory[entry.rule.category]++;
    bySeverity[entry.severity]++;

    if (entry.effect === 'beneficial') beneficialCount++;
    if (entry.effect === 'challenging') challengingCount++;
  }

  const overallTone: CodexEffect =
    beneficialCount > challengingCount * 1.5 ? 'beneficial' :
    challengingCount > beneficialCount * 1.5 ? 'challenging' :
    'mixed';

  return {
    totalFindings: entries.length,
    byCategory,
    bySeverity,
    overallTone
  };
}

function generateOpeningNarrative(summary: KnowledgeCodex['summary'], result: ClassicalEdgeCaseResult): string {
  const tone = summary.overallTone;
  const structure = result.structures.determinedStructure;

  if (tone === 'beneficial') {
    return `Welcome, pilgrim. Your chart reveals ${summary.totalFindings} insights, with favorable energies predominating. The ${structure} structure of your destiny provides a solid foundation.`;
  } else if (tone === 'challenging') {
    return `Welcome, pilgrim. Your chart reveals ${summary.totalFindings} insights that demand attention. Though challenges exist, understanding them is the first step toward mastery.`;
  }
  return `Welcome, pilgrim. Your chart reveals ${summary.totalFindings} insights, a balanced mixture of support and challenge. Let us explore what the heavens have written.`;
}

function generateClosingNarrative(summary: KnowledgeCodex['summary'], result: ClassicalEdgeCaseResult): string {
  return `You have journeyed through ${summary.totalFindings} chambers of wisdom. Remember: the chart reveals tendencies, not fate. Your awareness transforms destiny into choice.`;
}

function calculateConfidence(match: RuleMatch<BaseRule>): number {
  return Math.min(95, 70 + match.matchedConditions.length * 5);
}

// ==================== DESCRIPTION HELPERS ====================

function extractChineseName(name: string): string {
  const match = name.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

function getElementChinese(element: string): string {
  const map: Record<string, string> = {
    'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水'
  };
  return map[element] || element;
}

function getElementEmoji(element: string): string {
  const map: Record<string, string> = {
    'Wood': '🌳', 'Fire': '🔥', 'Earth': '🏔️', 'Metal': '⚔️', 'Water': '💧'
  };
  return map[element] || '⭐';
}

function describeCombinationType(type: string): string {
  const map: Record<string, string> = {
    'three_harmony': 'Three Harmony Combination',
    'six_harmony': 'Six Harmony Combination',
    'stem_combination': 'Heavenly Stem Combination',
    'directional': 'Directional Combination'
  };
  return map[type] || type;
}

function getCombinationChineseName(type: string): string {
  const map: Record<string, string> = {
    'three_harmony': '三合',
    'six_harmony': '六合',
    'stem_combination': '天干合',
    'directional': '方合'
  };
  return map[type] || '';
}

function getPunishmentChineseName(type: string): string {
  const map: Record<string, string> = {
    'three_unkindness': '三刑（无恩之刑）',
    'bullying': '三刑（恃势之刑）',
    'self': '自刑',
    'ungrateful': '无礼之刑'
  };
  return map[type] || '刑';
}

function getPunishmentTitle(type: string): string {
  const map: Record<string, string> = {
    'three_unkindness': 'Three Punishment of Unkindness (寅巳申)',
    'bullying': 'Bullying Punishment (丑戌未)',
    'self': 'Self Punishment',
    'ungrateful': 'Ungrateful Punishment'
  };
  return map[type] || 'Punishment';
}

// Placeholder description functions - implement with detailed logic
function describeStructureSummary(rule: StructureRule, result: ClassicalEdgeCaseResult): string {
  return rule.result.warning || `Your chart shows the ${rule.name} pattern.`;
}

function describeStructureTechnical(rule: StructureRule): string {
  return `Conditions: ${Object.keys(rule.conditions).join(', ')}. Result type: ${rule.result.structureType}`;
}

function interpretStructureEffect(rule: StructureRule, result: ClassicalEdgeCaseResult): string {
  if (rule.result.structureType.includes('follow')) {
    return 'This structure suggests going with the flow of dominant energies rather than fighting them.';
  }
  return 'This structure influences how we select and apply your useful god.';
}

function buildStructureRecommendations(rule: StructureRule, result: ClassicalEdgeCaseResult): string[] {
  const recs: string[] = [];
  if (rule.result.usefulGod) {
    const ug = Array.isArray(rule.result.usefulGod) ? rule.result.usefulGod.join(', ') : rule.result.usefulGod;
    recs.push(`Focus on ${ug} element activities and timing`);
  }
  if (rule.result.avoidElements) {
    recs.push(`Avoid excessive ${rule.result.avoidElements.join(', ')} energy`);
  }
  return recs;
}

function determineStructureSeverity(rule: StructureRule): CodexSeverity {
  if (rule.result.unstable) return 'significant';
  if (rule.result.structureType.includes('fake') || rule.result.structureType.includes('pseudo')) return 'moderate';
  return 'info';
}

function determineStructureEffect(rule: StructureRule): CodexEffect {
  if (rule.result.warning) return 'challenging';
  if (rule.result.structureType === 'true_follow') return 'beneficial';
  return 'neutral';
}

// Additional placeholder helpers
function describeCombinationSummary(combo: CombinationItem): string {
  return `${combo.combination.participants.join(' and ')} form a ${combo.combination.type} with status: ${combo.finalStatus}`;
}

function describeCombinationTechnical(combo: CombinationItem): string {
  return `Type: ${combo.combination.type}, Result Element: ${combo.combination.resultElement || 'N/A'}`;
}

function interpretCombinationEffect(combo: CombinationItem): string {
  if (combo.finalStatus === 'transformed') return 'These branches have merged their energies into a unified force.';
  if (combo.finalStatus === 'broken') return 'This combination was disrupted by conflicting forces in your chart.';
  return 'These branches share an affinity but have not fully transformed.';
}

function buildCombinationRecommendations(combo: CombinationItem): string[] {
  if (combo.finalStatus === 'transformed') {
    return [`Leverage the unified ${combo.combination.resultElement} energy`];
  }
  return ['Monitor this combination during favorable luck pillars'];
}

function describeUsefulGodSummary(ug: UsefulGodEvaluation): string {
  return `Your useful god (${ug.primaryUsefulGod}) is ${ug.status} at ${ug.effectivenessPercent}% effectiveness.`;
}

function describeUsefulGodTechnical(ug: UsefulGodEvaluation): string {
  return `Element: ${ug.primaryUsefulGod}, Status: ${ug.status}, Effectiveness: ${ug.effectivenessPercent}%`;
}

function interpretUsefulGodEffect(ug: UsefulGodEvaluation): string {
  if (ug.status === 'active') return 'Your guiding element is functioning well and provides balance.';
  if (ug.status === 'blocked') return 'Your useful god is obstructed - seek alternative paths.';
  return 'Your useful god needs support to function optimally.';
}

function buildUsefulGodRecommendations(ug: UsefulGodEvaluation): string[] {
  const recs: string[] = [];
  recs.push(`Strengthen ${ug.primaryUsefulGod} through colors, directions, and timing`);
  if (ug.secondaryUsefulGod) {
    recs.push(`Also cultivate ${ug.secondaryUsefulGod} as backup support`);
  }
  return recs;
}

function describeClashSummary(clash: ClashItem): string {
  return `${clash.clash.pair.join(' and ')} are in direct opposition (${clash.clash.strength} strength).`;
}

function describeClashTechnical(clash: ClashItem): string {
  return `Positions: ${clash.clash.positions.join(' vs ')}, Strength: ${clash.clash.strength}`;
}

function interpretClashEffect(clash: ClashItem): string {
  if (clash.effect === 'beneficial') return 'This clash actually helps by removing obstructive energy.';
  return 'This clash creates tension and potential disruption in the affected life areas.';
}

function buildClashRecommendations(clash: ClashItem): string[] {
  return ['Be mindful during clash-related timing', 'Use mediating elements to soften conflict'];
}

function describePunishmentSummary(p: PunishmentItem): string {
  return `${p.punishment.participants.join(', ')} form a ${p.punishment.type} punishment pattern.`;
}

function describePunishmentTechnical(p: PunishmentItem): string {
  return `Type: ${p.punishment.type}, Complete: ${p.punishment.complete}, Severity: ${p.severity}`;
}

function interpretPunishmentEffect(p: PunishmentItem): string {
  if (p.punishment.type === 'three_unkindness') return 'This pattern speaks to themes of ingratitude or betrayal in life lessons.';
  if (p.punishment.type === 'self') return 'This pattern indicates internal conflict and self-sabotage tendencies.';
  return 'This punishment pattern indicates karmic lessons requiring attention.';
}

function buildPunishmentRecommendations(p: PunishmentItem): string[] {
  return ['Practice self-awareness around punishment themes', 'Use mindfulness to break negative patterns'];
}

function describeSeasonalTechnical(element: string, modifier: number): string {
  return `${element} seasonal modifier: ${(modifier * 100).toFixed(0)}%`;
}

function interpretSeasonalEffect(element: string, modifier: number, isWeak: boolean): string {
  if (isWeak) return `The current season suppresses ${element} energy - activities and decisions related to this element require extra effort.`;
  return `The current season amplifies ${element} energy - a favorable time for related activities.`;
}

function buildSeasonalRecommendations(element: string, isWeak: boolean, supportNeeded: string[]): string[] {
  const recs: string[] = [];
  if (isWeak) {
    recs.push(`Support ${element} through its producing element`);
  }
  if (supportNeeded.length > 0) {
    recs.push(`Seek support from: ${supportNeeded.join(', ')}`);
  }
  return recs;
}

function describeHiddenStemSummary(stem: HiddenStemItem): string {
  return `Hidden ${stem.stem.stem} (${stem.stem.element}) in ${stem.pillar} pillar is ${stem.status} at ${stem.effectiveStrength}% strength.`;
}

function describeHiddenStemTechnical(stem: HiddenStemItem): string {
  return `Type: ${stem.stem.type}, Base: ${stem.stem.percentage}%, Effective: ${stem.effectiveStrength}%`;
}

function interpretHiddenStemEffect(stem: HiddenStemItem): string {
  if (stem.status === 'disrupted') return 'This hidden energy is disturbed by external conflicts.';
  if (stem.status === 'dormant') return 'This hidden energy awaits activation by favorable timing.';
  return 'This hidden energy provides underground support to your chart.';
}

function buildHiddenStemRecommendations(stem: HiddenStemItem): string[] {
  if (stem.status === 'dormant') {
    return ['Watch for luck pillars that activate this hidden element'];
  }
  return ['Acknowledge the hidden influence in relevant life areas'];
}

function describeLuckPillarSummary(lp: LuckPillarEvaluation): string {
  return `Current luck pillar period quality: ${lp.periodQuality}`;
}

function describeLuckPillarTechnical(lp: LuckPillarEvaluation): string {
  return `Activated patterns: ${lp.activatedPatterns.length}, Structure impact: ${lp.structureImpact || 'none'}`;
}

function interpretLuckPillarEffect(lp: LuckPillarEvaluation): string {
  const desc: Record<string, string> = {
    'favorable': 'This is an auspicious period where opportunities flow more easily.',
    'neutral': 'This is a stable period without major shifts.',
    'challenging': 'This period requires extra care and conscious effort.',
    'turbulent': 'This period brings significant changes and tests.'
  };
  return desc[lp.periodQuality] || 'Navigate this period with awareness.';
}

function buildLuckPillarRecommendations(lp: LuckPillarEvaluation): string[] {
  const recs: string[] = [];
  if (lp.periodQuality === 'favorable') {
    recs.push('Take advantage of favorable timing for major decisions');
  } else if (lp.periodQuality === 'challenging' || lp.periodQuality === 'turbulent') {
    recs.push('Exercise caution with major commitments');
    recs.push('Focus on consolidation rather than expansion');
  }
  return recs;
}

export { buildStructureEntries, buildCombinationEntries, buildUsefulGodEntries };
