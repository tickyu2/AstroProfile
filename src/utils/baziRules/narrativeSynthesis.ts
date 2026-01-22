/**
 * ============================================
 * NARRATIVE SYNTHESIS LAYER
 * Transforms BaZi Analysis + Codex into
 * NarrativeCockpitData for UI consumption
 *
 * This is the narrative nervous system that
 * unifies story beats, emotional arcs, timing
 * curves, and environmental overlays.
 * ============================================
 */

import { KnowledgeCodex, CodexEntry } from './codexTypes';
import { ChartContext, ClassicalEdgeCaseResult } from './types';
import {
  NarrativeCockpitData,
  StoryBeat,
  EmotionalArcPoint,
  TimingCurvePoint,
  EnvironmentalOverlay,
  LifeChapter
} from './narrativeCockpitModel';

// ==================== INPUT TYPES ====================

export interface BaZiAnalysisInput {
  dayMaster: string;
  dayMasterElement: string;
  dayMasterStrength: 'strong' | 'weak' | 'neutral';
  usefulGod?: string;
  annoyingGod?: string;
  structure?: string;
  season: string;
  seasonElement: string;
  elementDistribution: Record<string, number>;
  luckPillars?: LuckPillarInput[];
  birthYear: number;
}

export interface LuckPillarInput {
  index: number;
  stem: string;
  branch: string;
  startAge: number;
  endAge: number;
  element: string;
  effect?: 'favorable' | 'unfavorable' | 'mixed';
  hiddenStems?: string[];
}

export interface NarrativeSynthesisInput {
  analysis: BaZiAnalysisInput;
  codexEntries: CodexEntry[];
  chartId?: string;
  currentAge?: number;
}

// ==================== SEVERITY MAPPING ====================

const SEVERITY_TO_INTENSITY: Record<string, number> = {
  'major': 95,
  'significant': 75,
  'moderate': 55,
  'minor': 35,
  'info': 20
};

const EFFECT_TO_VALENCE: Record<string, number> = {
  'beneficial': 60,
  'positive': 60,
  'challenging': -50,
  'negative': -50,
  'mixed': 10,
  'neutral': 0
};

// ==================== MAIN SYNTHESIS FUNCTION ====================

/**
 * Build complete NarrativeCockpitData from BaZi analysis + Codex
 */
export function synthesizeNarrativeCockpit(input: NarrativeSynthesisInput): NarrativeCockpitData {
  const { analysis, codexEntries, chartId, currentAge } = input;

  const storyBeats = synthesizeStoryBeats(analysis, codexEntries);
  const emotionalArc = synthesizeEmotionalArc(analysis, codexEntries);
  const timingCurve = synthesizeTimingCurve(analysis, codexEntries);
  const overlays = synthesizeEnvironmentalOverlays(analysis, codexEntries);
  const lifeChapters = synthesizeLifeChapters(storyBeats, analysis);
  const narrativeSummary = generateNarrativeSummary(storyBeats, emotionalArc, analysis);

  return {
    chartId: chartId || 'unknown',
    generatedAt: new Date(),
    lifeChapters,
    storyBeats,
    emotionalArc,
    timingCurve,
    overlays,
    narrativeSummary
  };
}

// ==================== STORY BEATS SYNTHESIS ====================

/**
 * Generate story beats from luck pillar rules + structure shifts
 */
function synthesizeStoryBeats(
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): StoryBeat[] {
  const beats: StoryBeat[] = [];

  // 1. Birth Chart Foundation Beat (age 0-10)
  const structureEntries = codexEntries.filter(e => e.rule.category === 'structure');
  const foundationRules = structureEntries.length > 0
    ? structureEntries.map(e => e.rule.id)
    : codexEntries.slice(0, 3).map(e => e.rule.id);

  beats.push({
    id: 'beat_foundation',
    label: 'Foundation',
    labelZh: '根基',
    timeRange: { startAge: 0, endAge: 10 },
    dominantThemes: ['origin', 'potential', 'inheritance'],
    keyRules: foundationRules,
    intensity: calculateBeatIntensity(structureEntries.length > 0 ? structureEntries : codexEntries.slice(0, 3)),
    valence: determineValence(structureEntries.length > 0 ? structureEntries : codexEntries.slice(0, 3)),
    description: `The foundational energies of the ${analysis.dayMaster} Day Master establish baseline patterns.`,
    personaHook: `Your soul entered this world carrying the essence of ${analysis.dayMasterElement}...`
  });

  // 2. Luck Pillar Beats (age 10+)
  if (analysis.luckPillars && analysis.luckPillars.length > 0) {
    const luckPillarEntries = codexEntries.filter(e => e.rule.category === 'luck_pillar');

    analysis.luckPillars.forEach((lp, idx) => {
      const relatedEntries = luckPillarEntries.filter(e =>
        e.rule.id.includes(`lp_${idx}`) || e.explanation.title.includes(lp.element)
      );

      const beatLabel = getLuckPillarBeatLabel(lp, idx, analysis);
      const beatLabelZh = getLuckPillarBeatLabelZh(lp, idx);

      beats.push({
        id: `beat_lp_${idx}`,
        label: beatLabel,
        labelZh: beatLabelZh,
        timeRange: { startAge: lp.startAge, endAge: lp.endAge },
        dominantThemes: extractLuckPillarThemes(lp, analysis),
        keyRules: relatedEntries.map(e => e.rule.id),
        intensity: calculateLuckPillarIntensity(lp, analysis),
        valence: lp.effect === 'favorable' ? 'positive' : lp.effect === 'unfavorable' ? 'negative' : 'mixed',
        description: generateLuckPillarDescription(lp, analysis),
        personaHook: generateLuckPillarPersonaHook(lp, analysis)
      });
    });
  }

  // 3. Conflict/Crisis Beats (from clash/harm/punishment rules)
  const conflictEntries = codexEntries.filter(e =>
    ['clash', 'harm', 'punishment'].includes(e.rule.category)
  );

  conflictEntries.forEach((entry, idx) => {
    // Find the age range where this conflict activates
    const activationAge = findConflictActivationAge(entry, analysis);

    beats.push({
      id: `beat_conflict_${idx}`,
      label: entry.explanation.title,
      labelZh: entry.rule.nameZh || entry.explanation.title,
      timeRange: { startAge: activationAge, endAge: activationAge + 10 },
      dominantThemes: ['conflict', 'growth', 'transformation'],
      keyRules: [entry.rule.id],
      intensity: SEVERITY_TO_INTENSITY[entry.severity] || 50,
      valence: 'mixed', // Conflicts are opportunities
      description: entry.explanation.summary,
      personaHook: entry.personaHook
    });
  });

  // 4. Useful God Discovery/Activation Beats
  const usefulGodEntries = codexEntries.filter(e => e.rule.category === 'useful_god');

  if (usefulGodEntries.length > 0 && analysis.usefulGod) {
    beats.push({
      id: 'beat_useful_god',
      label: 'Finding Your Guide',
      labelZh: '用神显现',
      timeRange: { startAge: 15, endAge: 25 },
      dominantThemes: ['discovery', 'alignment', 'purpose'],
      keyRules: usefulGodEntries.map(e => e.rule.id),
      intensity: 70,
      valence: 'positive',
      description: `The Useful God (${analysis.usefulGod}) begins to reveal its guiding influence.`,
      personaHook: `There comes a moment when the compass needle finds north...`
    });
  }

  // Sort beats by start age
  return beats.sort((a, b) => a.timeRange.startAge - b.timeRange.startAge);
}

// ==================== EMOTIONAL ARC SYNTHESIS ====================

/**
 * Generate emotional arc from support/conflict balance across life
 */
function synthesizeEmotionalArc(
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): EmotionalArcPoint[] {
  const points: EmotionalArcPoint[] = [];

  // Birth point
  const birthIntensity = calculateBirthChartEmotionalTone(analysis, codexEntries);
  points.push({
    age: 0,
    intensity: birthIntensity,
    valence: birthIntensity > 0 ? 'positive' : birthIntensity < 0 ? 'negative' : 'mixed',
    triggers: ['birth_chart'],
    description: 'Natal chart emotional baseline'
  });

  // Add points for each luck pillar
  if (analysis.luckPillars) {
    analysis.luckPillars.forEach((lp, idx) => {
      const midAge = lp.startAge + 5;
      const intensity = calculateLuckPillarEmotionalImpact(lp, analysis, codexEntries);

      points.push({
        age: midAge,
        intensity,
        valence: intensity > 20 ? 'positive' : intensity < -20 ? 'negative' : 'mixed',
        triggers: [`luck_pillar_${idx}`, lp.element],
        description: `${lp.stem}-${lp.branch} pillar influence`
      });
    });
  }

  // Add conflict spikes
  const conflictEntries = codexEntries.filter(e =>
    ['clash', 'harm', 'punishment'].includes(e.rule.category)
  );

  conflictEntries.forEach((entry, idx) => {
    const activationAge = findConflictActivationAge(entry, analysis);
    points.push({
      age: activationAge + 2, // Peak conflict point
      intensity: -1 * (SEVERITY_TO_INTENSITY[entry.severity] || 40),
      valence: 'negative',
      triggers: [entry.rule.id],
      description: entry.explanation.title
    });
  });

  // Sort by age and smooth the curve
  return points.sort((a, b) => a.age - b.age);
}

// ==================== TIMING CURVE SYNTHESIS ====================

/**
 * Generate timing curve showing luck level + volatility over time
 */
function synthesizeTimingCurve(
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): TimingCurvePoint[] {
  const points: TimingCurvePoint[] = [];

  // Generate points for each luck pillar period
  if (analysis.luckPillars) {
    analysis.luckPillars.forEach((lp, idx) => {
      const midAge = lp.startAge + 5;

      // Calculate luck level based on useful god alignment
      const luckLevel = calculateTimingLuckLevel(lp, analysis);

      // Calculate volatility based on clashes/conflicts in this period
      const volatility = calculateTimingVolatility(lp, analysis, codexEntries);

      // Determine phase
      const phase = determineTimingPhase(luckLevel, volatility, idx, analysis.luckPillars?.length || 1);

      points.push({
        age: midAge,
        luckLevel,
        volatility,
        keyEvents: extractKeyEventsForPeriod(lp, codexEntries),
        phase
      });
    });
  } else {
    // Default curve without luck pillars
    [10, 20, 30, 40, 50, 60, 70].forEach(age => {
      points.push({
        age,
        luckLevel: 50 + Math.sin(age / 10) * 20,
        volatility: 30,
        keyEvents: [],
        phase: 'stable'
      });
    });
  }

  return points;
}

// ==================== ENVIRONMENTAL OVERLAYS ====================

/**
 * Generate environmental overlays from seasonal + external factors
 */
function synthesizeEnvironmentalOverlays(
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): EnvironmentalOverlay[] {
  const overlays: EnvironmentalOverlay[] = [];

  // 1. Seasonal overlays from seasonal rules
  const seasonalEntries = codexEntries.filter(e => e.rule.category === 'seasonal');

  seasonalEntries.forEach((entry, idx) => {
    overlays.push({
      id: `overlay_seasonal_${idx}`,
      label: entry.explanation.title,
      type: 'seasonal',
      timeRange: { startAge: 0, endAge: 100 }, // Seasonal effects are lifelong
      effect: entry.effect === 'beneficial' ? 'amplifying' :
              entry.effect === 'challenging' ? 'dampening' : 'neutral',
      targetElements: [analysis.seasonElement],
      notes: entry.explanation.summary,
      intensity: SEVERITY_TO_INTENSITY[entry.severity] || 50
    });
  });

  // 2. Birth season overlay
  overlays.push({
    id: 'overlay_birth_season',
    label: `Born in ${analysis.season} (${analysis.seasonElement} Season)`,
    type: 'seasonal',
    timeRange: { startAge: 0, endAge: 100 },
    effect: isSeasonFavorable(analysis.seasonElement, analysis.dayMasterElement) ? 'amplifying' : 'dampening',
    targetElements: [analysis.seasonElement, analysis.dayMasterElement],
    notes: `${analysis.dayMasterElement} Day Master born in ${analysis.seasonElement} season.`,
    intensity: 60
  });

  // 3. Collective overlays (decade themes)
  if (analysis.luckPillars) {
    analysis.luckPillars.forEach((lp, idx) => {
      if (idx % 2 === 0) { // Every other pillar for variety
        overlays.push({
          id: `overlay_collective_${idx}`,
          label: `${lp.element} Decade`,
          type: 'collective',
          timeRange: { startAge: lp.startAge, endAge: lp.endAge },
          effect: lp.effect === 'favorable' ? 'amplifying' :
                  lp.effect === 'unfavorable' ? 'dampening' : 'redirecting',
          targetElements: [lp.element],
          notes: `Major ${lp.element} influence period`,
          intensity: 70
        });
      }
    });
  }

  return overlays;
}

// ==================== LIFE CHAPTERS ====================

/**
 * Group story beats into life chapters
 */
function synthesizeLifeChapters(
  beats: StoryBeat[],
  analysis: BaZiAnalysisInput
): LifeChapter[] {
  const chapters: LifeChapter[] = [
    {
      id: 'chapter_foundation',
      name: 'Foundation',
      nameZh: '根基期',
      ageRange: { start: 0, end: 15 },
      theme: 'Establishing the baseline patterns',
      keyBeats: beats.filter(b => b.timeRange.startAge < 15).map(b => b.id),
      overallTone: 'consolidating',
      summary: 'The formative years when natal chart energies crystallize into personality.'
    },
    {
      id: 'chapter_emergence',
      name: 'Emergence',
      nameZh: '萌发期',
      ageRange: { start: 15, end: 30 },
      theme: 'Discovering identity and direction',
      keyBeats: beats.filter(b => b.timeRange.startAge >= 15 && b.timeRange.startAge < 30).map(b => b.id),
      overallTone: 'expansive',
      summary: 'Identity crystallizes and life direction emerges.'
    },
    {
      id: 'chapter_manifestation',
      name: 'Manifestation',
      nameZh: '显化期',
      ageRange: { start: 30, end: 50 },
      theme: 'Building and achieving',
      keyBeats: beats.filter(b => b.timeRange.startAge >= 30 && b.timeRange.startAge < 50).map(b => b.id),
      overallTone: 'expansive',
      summary: 'Peak productive years where karma manifests into reality.'
    },
    {
      id: 'chapter_integration',
      name: 'Integration',
      nameZh: '整合期',
      ageRange: { start: 50, end: 70 },
      theme: 'Harvesting and teaching',
      keyBeats: beats.filter(b => b.timeRange.startAge >= 50 && b.timeRange.startAge < 70).map(b => b.id),
      overallTone: 'consolidating',
      summary: 'Wisdom ripens as life experiences integrate into understanding.'
    },
    {
      id: 'chapter_completion',
      name: 'Completion',
      nameZh: '圆满期',
      ageRange: { start: 70, end: 100 },
      theme: 'Legacy and transcendence',
      keyBeats: beats.filter(b => b.timeRange.startAge >= 70).map(b => b.id),
      overallTone: 'resting',
      summary: 'The cycle completes as energy returns to source.'
    }
  ];

  // Adjust chapter tones based on beat content
  chapters.forEach(chapter => {
    const chapterBeats = beats.filter(b =>
      b.timeRange.startAge >= chapter.ageRange.start &&
      b.timeRange.startAge < chapter.ageRange.end
    );

    if (chapterBeats.length > 0) {
      const avgValence = chapterBeats.reduce((sum, b) => {
        const val = b.valence === 'positive' ? 1 : b.valence === 'negative' ? -1 : 0;
        return sum + val;
      }, 0) / chapterBeats.length;

      if (avgValence > 0.3) chapter.overallTone = 'expansive';
      else if (avgValence < -0.3) chapter.overallTone = 'challenging';
      else if (chapterBeats.some(b => b.intensity > 70)) chapter.overallTone = 'transforming';
    }
  });

  return chapters;
}

// ==================== NARRATIVE SUMMARY ====================

/**
 * Generate overall narrative summary
 */
function generateNarrativeSummary(
  beats: StoryBeat[],
  arc: EmotionalArcPoint[],
  analysis: BaZiAnalysisInput
): string {
  const positiveBeats = beats.filter(b => b.valence === 'positive').length;
  const negativeBeats = beats.filter(b => b.valence === 'negative').length;
  const mixedBeats = beats.filter(b => b.valence === 'mixed').length;

  const avgIntensity = arc.reduce((sum, p) => sum + Math.abs(p.intensity), 0) / (arc.length || 1);

  let tone = 'balanced';
  if (positiveBeats > negativeBeats * 2) tone = 'favorable';
  else if (negativeBeats > positiveBeats * 2) tone = 'challenging';

  const intensity = avgIntensity > 50 ? 'intense' : avgIntensity > 25 ? 'moderate' : 'gentle';

  const summaries: Record<string, string> = {
    'favorable_intense': `A powerful journey of expansion and achievement. The ${analysis.dayMaster} Day Master rides strong currents toward fulfillment.`,
    'favorable_moderate': `A steady path of growth with favorable timing. Opportunities arise naturally when aligned with the Useful God.`,
    'favorable_gentle': `A peaceful journey with subtle but consistent support. Progress comes through patience and presence.`,
    'challenging_intense': `A crucible of transformation. Strong forces demand adaptation, but forge deep strength.`,
    'challenging_moderate': `A path requiring vigilance and strategy. Challenges become teachers when approached wisely.`,
    'challenging_gentle': `Subtle obstacles invite refinement. Growth comes through attention to small adjustments.`,
    'balanced_intense': `A dynamic journey of peaks and valleys. The full spectrum of experience creates wholeness.`,
    'balanced_moderate': `A textured life with varied seasons. Balance emerges through embracing all conditions.`,
    'balanced_gentle': `A nuanced path of gradual unfolding. Wisdom accumulates through quiet attention.`
  };

  return summaries[`${tone}_${intensity}`] ||
    `The journey of the ${analysis.dayMaster} Day Master unfolds across ${beats.length} significant chapters.`;
}

// ==================== HELPER FUNCTIONS ====================

function calculateBeatIntensity(entries: CodexEntry[]): number {
  if (entries.length === 0) return 50;
  const total = entries.reduce((sum, e) => sum + (SEVERITY_TO_INTENSITY[e.severity] || 50), 0);
  return Math.min(100, Math.round(total / entries.length));
}

function determineValence(entries: CodexEntry[]): 'positive' | 'negative' | 'mixed' | 'neutral' {
  if (entries.length === 0) return 'neutral';

  let score = 0;
  entries.forEach(e => {
    if (e.effect === 'beneficial' || e.effect === 'positive') score++;
    else if (e.effect === 'challenging' || e.effect === 'negative') score--;
  });

  if (score > entries.length / 3) return 'positive';
  if (score < -entries.length / 3) return 'negative';
  return 'mixed';
}

function getLuckPillarBeatLabel(lp: LuckPillarInput, idx: number, analysis: BaZiAnalysisInput): string {
  const element = lp.element;
  const effect = lp.effect;

  if (effect === 'favorable') {
    if (element === analysis.usefulGod) return 'Alignment';
    return 'Expansion';
  }
  if (effect === 'unfavorable') {
    if (element === analysis.annoyingGod) return 'Challenge';
    return 'Resistance';
  }
  return 'Transition';
}

function getLuckPillarBeatLabelZh(lp: LuckPillarInput, idx: number): string {
  const labels: Record<string, string> = {
    'favorable': '顺境',
    'unfavorable': '逆境',
    'mixed': '转变'
  };
  return labels[lp.effect || 'mixed'] || '运程';
}

function extractLuckPillarThemes(lp: LuckPillarInput, analysis: BaZiAnalysisInput): string[] {
  const themes: string[] = ['timing', 'life-direction'];

  if (lp.element === analysis.usefulGod) themes.push('support', 'alignment');
  if (lp.element === analysis.annoyingGod) themes.push('challenge', 'growth');

  // Element-specific themes
  const elementThemes: Record<string, string[]> = {
    'Wood': ['growth', 'creativity', 'new-beginnings'],
    'Fire': ['visibility', 'passion', 'expression'],
    'Earth': ['stability', 'grounding', 'resources'],
    'Metal': ['precision', 'achievement', 'refinement'],
    'Water': ['wisdom', 'flow', 'adaptability']
  };

  if (elementThemes[lp.element]) {
    themes.push(...elementThemes[lp.element].slice(0, 2));
  }

  return themes;
}

function calculateLuckPillarIntensity(lp: LuckPillarInput, analysis: BaZiAnalysisInput): number {
  let intensity = 50;

  if (lp.element === analysis.usefulGod) intensity += 25;
  if (lp.element === analysis.annoyingGod) intensity += 20;
  if (lp.effect === 'favorable') intensity += 10;
  if (lp.effect === 'unfavorable') intensity += 15;

  return Math.min(100, intensity);
}

function generateLuckPillarDescription(lp: LuckPillarInput, analysis: BaZiAnalysisInput): string {
  const elementRelation = lp.element === analysis.usefulGod ? 'supporting' :
                          lp.element === analysis.annoyingGod ? 'challenging' : 'influencing';

  return `The ${lp.stem}-${lp.branch} (${lp.element}) luck pillar ${elementRelation} the ${analysis.dayMaster} Day Master from age ${lp.startAge} to ${lp.endAge}.`;
}

function generateLuckPillarPersonaHook(lp: LuckPillarInput, analysis: BaZiAnalysisInput): string {
  if (lp.effect === 'favorable') {
    return `As ${lp.element} energy rises, doors open that seemed closed before...`;
  }
  if (lp.effect === 'unfavorable') {
    return `The ${lp.element} wind blows contrary to your sails, yet teaches navigation...`;
  }
  return `A shift in the cosmic weather brings new textures to the journey...`;
}

function findConflictActivationAge(entry: CodexEntry, analysis: BaZiAnalysisInput): number {
  // Try to find the luck pillar where this conflict activates
  if (analysis.luckPillars) {
    for (const lp of analysis.luckPillars) {
      // Check if the luck pillar contains the conflicting branch
      const conflictBranches = extractBranchesFromRule(entry.rule.id);
      if (conflictBranches.includes(lp.branch)) {
        return lp.startAge;
      }
    }
  }
  // Default to a calculated age
  return 20 + Math.random() * 30;
}

function extractBranchesFromRule(ruleId: string): string[] {
  // Extract branch names from rule IDs like "zi_wu_clash"
  const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
  return branches.filter(b => ruleId.toLowerCase().includes(b.toLowerCase()));
}

function calculateBirthChartEmotionalTone(
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): number {
  let tone = 0;

  // Day Master strength contribution
  if (analysis.dayMasterStrength === 'strong') tone += 15;
  else if (analysis.dayMasterStrength === 'weak') tone -= 10;

  // Useful God presence
  if (analysis.usefulGod) tone += 20;

  // Codex entry effects
  codexEntries.slice(0, 5).forEach(e => {
    tone += EFFECT_TO_VALENCE[e.effect] || 0;
  });

  return Math.max(-100, Math.min(100, tone));
}

function calculateLuckPillarEmotionalImpact(
  lp: LuckPillarInput,
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): number {
  let impact = 0;

  if (lp.effect === 'favorable') impact += 40;
  else if (lp.effect === 'unfavorable') impact -= 30;

  if (lp.element === analysis.usefulGod) impact += 30;
  if (lp.element === analysis.annoyingGod) impact -= 25;

  return Math.max(-100, Math.min(100, impact));
}

function calculateTimingLuckLevel(lp: LuckPillarInput, analysis: BaZiAnalysisInput): number {
  let level = 50;

  if (lp.effect === 'favorable') level += 25;
  else if (lp.effect === 'unfavorable') level -= 20;

  if (lp.element === analysis.usefulGod) level += 20;
  if (lp.element === analysis.annoyingGod) level -= 15;

  return Math.max(0, Math.min(100, level));
}

function calculateTimingVolatility(
  lp: LuckPillarInput,
  analysis: BaZiAnalysisInput,
  codexEntries: CodexEntry[]
): number {
  let volatility = 30; // Base volatility

  // Conflicts increase volatility
  const conflictEntries = codexEntries.filter(e =>
    ['clash', 'harm', 'punishment'].includes(e.rule.category)
  );
  volatility += conflictEntries.length * 10;

  // Strong useful god decreases volatility
  if (analysis.usefulGod && lp.element === analysis.usefulGod) {
    volatility -= 15;
  }

  return Math.max(0, Math.min(100, volatility));
}

function determineTimingPhase(
  luckLevel: number,
  volatility: number,
  index: number,
  totalPillars: number
): 'ascending' | 'peak' | 'descending' | 'trough' | 'stable' {
  if (luckLevel >= 75) return 'peak';
  if (luckLevel <= 25) return 'trough';

  const position = index / totalPillars;
  if (position < 0.3 && luckLevel > 50) return 'ascending';
  if (position > 0.7 && luckLevel < 50) return 'descending';

  return volatility > 50 ? 'ascending' : 'stable';
}

function extractKeyEventsForPeriod(lp: LuckPillarInput, codexEntries: CodexEntry[]): string[] {
  return codexEntries
    .filter(e => e.rule.category === 'luck_pillar')
    .slice(0, 3)
    .map(e => e.explanation.title);
}

function isSeasonFavorable(seasonElement: string, dayMasterElement: string): boolean {
  const production: Record<string, string> = {
    'Wood': 'Fire',
    'Fire': 'Earth',
    'Earth': 'Metal',
    'Metal': 'Water',
    'Water': 'Wood'
  };

  // Season produces DM or DM produces season
  return production[seasonElement] === dayMasterElement ||
         production[dayMasterElement] === seasonElement;
}

// ==================== EXPORTS ====================

export {
  synthesizeNarrativeCockpit,
  synthesizeStoryBeats,
  synthesizeEmotionalArc,
  synthesizeTimingCurve,
  synthesizeEnvironmentalOverlays,
  synthesizeLifeChapters,
  generateNarrativeSummary
};
