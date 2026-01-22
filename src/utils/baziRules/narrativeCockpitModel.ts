/**
 * ============================================
 * NARRATIVE COCKPIT DATA MODEL
 * Story beats, emotional arcs, timing curves,
 * and environmental overlays
 * ============================================
 */

import { KnowledgeCodex, CodexEntry } from './codexTypes';
import { ChartContext, ClassicalEdgeCaseResult } from './types';

// ==================== TYPES ====================

export interface StoryBeat {
  id: string;
  label: string;
  labelZh: string;
  timeRange: { startAge: number; endAge: number };
  dominantThemes: string[];
  keyRules: string[];
  intensity: number; // 0-100
  valence: 'positive' | 'negative' | 'mixed' | 'neutral';
  description: string;
  personaHook?: string;
}

export interface EmotionalArcPoint {
  age: number;
  intensity: number; // -100 to 100 (negative = challenging, positive = supportive)
  valence: 'positive' | 'negative' | 'mixed';
  triggers: string[];
  description: string;
}

export interface TimingCurvePoint {
  age: number;
  luckLevel: number; // 0-100
  volatility: number; // 0-100 (stability vs turbulence)
  keyEvents: string[];
  phase: 'ascending' | 'peak' | 'descending' | 'trough' | 'stable';
}

export interface EnvironmentalOverlay {
  id: string;
  label: string;
  type: 'seasonal' | 'fengshui' | 'qimen' | 'collective' | 'personal';
  timeRange: { startAge: number; endAge: number };
  effect: 'amplifying' | 'dampening' | 'redirecting' | 'neutral';
  targetElements: string[];
  notes: string;
  intensity: number; // 0-100
}

export interface LifeChapter {
  id: string;
  name: string;
  nameZh: string;
  ageRange: { start: number; end: number };
  theme: string;
  keyBeats: string[];
  overallTone: 'expansive' | 'consolidating' | 'transforming' | 'resting' | 'challenging';
  summary: string;
}

export interface NarrativeCockpitData {
  chartId: string;
  generatedAt: Date;
  lifeChapters: LifeChapter[];
  storyBeats: StoryBeat[];
  emotionalArc: EmotionalArcPoint[];
  timingCurve: TimingCurvePoint[];
  overlays: EnvironmentalOverlay[];
  narrativeSummary: string;
}

// ==================== STORY BEAT GENERATION ====================

/**
 * Generate story beats from Codex entries and luck pillars
 */
export function generateStoryBeats(
  codex: KnowledgeCodex,
  luckPillars?: LuckPillarInfo[]
): StoryBeat[] {
  const beats: StoryBeat[] = [];

  // Group codex entries by category for thematic beats
  const entriesByCategory = groupBy(codex.entries, e => e.rule.category);

  // Birth Chart Beat (age 0-10)
  const birthBeat: StoryBeat = {
    id: 'birth_chart',
    label: 'Foundation',
    labelZh: '根基',
    timeRange: { startAge: 0, endAge: 10 },
    dominantThemes: extractThemes(codex.entries),
    keyRules: codex.entries.slice(0, 5).map(e => e.rule.id),
    intensity: calculateIntensity(codex.entries),
    valence: determineValence(codex.entries),
    description: 'The foundational energies of your birth chart establish the baseline patterns.',
    personaHook: codex.entries[0]?.personaHook
  };
  beats.push(birthBeat);

  // Luck pillar beats if available
  if (luckPillars && luckPillars.length > 0) {
    for (const pillar of luckPillars) {
      const beat: StoryBeat = {
        id: `luck_pillar_${pillar.index}`,
        label: `${pillar.stem}${pillar.branch} Pillar`,
        labelZh: `${pillar.stem}${pillar.branch}大运`,
        timeRange: { startAge: pillar.startAge, endAge: pillar.endAge },
        dominantThemes: pillar.themes || [],
        keyRules: pillar.triggeredRules || [],
        intensity: pillar.intensity || 50,
        valence: pillar.effect as StoryBeat['valence'] || 'mixed',
        description: pillar.description || 'A ten-year period of specific energetic influence.',
        personaHook: pillar.narrative
      };
      beats.push(beat);
    }
  }

  // Category-based beats (distributed across life stages)
  let ageOffset = 10;
  for (const [category, entries] of Object.entries(entriesByCategory)) {
    if (entries.length === 0) continue;

    const beat: StoryBeat = {
      id: `category_${category}`,
      label: getCategoryLabel(category),
      labelZh: getCategoryLabelZh(category),
      timeRange: { startAge: ageOffset, endAge: ageOffset + 15 },
      dominantThemes: [category],
      keyRules: entries.map(e => e.rule.id),
      intensity: calculateIntensity(entries),
      valence: determineValence(entries),
      description: getCategoryDescription(category, entries),
      personaHook: entries[0]?.personaHook
    };
    beats.push(beat);
    ageOffset += 15;
  }

  return beats.sort((a, b) => a.timeRange.startAge - b.timeRange.startAge);
}

interface LuckPillarInfo {
  index: number;
  stem: string;
  branch: string;
  startAge: number;
  endAge: number;
  themes?: string[];
  triggeredRules?: string[];
  intensity?: number;
  effect?: string;
  description?: string;
  narrative?: string;
}

function extractThemes(entries: CodexEntry[]): string[] {
  const themes = new Set<string>();
  for (const entry of entries) {
    themes.add(entry.rule.category);
    if (entry.effect === 'beneficial') themes.add('opportunity');
    if (entry.effect === 'challenging') themes.add('growth');
    if (entry.effect === 'mixed') themes.add('complexity');
  }
  return Array.from(themes);
}

function calculateIntensity(entries: CodexEntry[]): number {
  const severityScores: Record<string, number> = {
    major: 90,
    significant: 70,
    moderate: 50,
    minor: 30,
    info: 10
  };

  const total = entries.reduce((sum, e) => sum + (severityScores[e.severity] || 50), 0);
  return Math.round(total / (entries.length || 1));
}

function determineValence(entries: CodexEntry[]): StoryBeat['valence'] {
  const counts = {
    beneficial: entries.filter(e => e.effect === 'beneficial').length,
    challenging: entries.filter(e => e.effect === 'challenging').length,
    mixed: entries.filter(e => e.effect === 'mixed').length
  };

  if (counts.beneficial > counts.challenging * 2) return 'positive';
  if (counts.challenging > counts.beneficial * 2) return 'negative';
  if (counts.mixed > counts.beneficial && counts.mixed > counts.challenging) return 'mixed';
  return 'neutral';
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    structure: 'Structure Activation',
    combination: 'Combination Dynamics',
    useful_god: 'Useful God Journey',
    clash: 'Conflict Resolution',
    harm: 'Hidden Challenges',
    punishment: 'Karmic Lessons',
    seasonal: 'Seasonal Rhythms',
    hidden_stem: 'Underground Forces',
    luck_pillar: 'Timing Shifts'
  };
  return labels[category] || category;
}

function getCategoryLabelZh(category: string): string {
  const labels: Record<string, string> = {
    structure: '格局激活',
    combination: '合化动态',
    useful_god: '用神旅程',
    clash: '冲突化解',
    harm: '暗伤挑战',
    punishment: '业力功课',
    seasonal: '季节节律',
    hidden_stem: '地下力量',
    luck_pillar: '时运转换'
  };
  return labels[category] || category;
}

function getCategoryDescription(category: string, entries: CodexEntry[]): string {
  const intro: Record<string, string> = {
    structure: 'The structural patterns of your chart come into focus, revealing',
    combination: 'Forces combine and transform, creating new dynamics through',
    useful_god: 'Your guiding element navigates through',
    clash: 'Conflicts bring necessary clearing and change via',
    harm: 'Hidden injuries surface for healing through',
    punishment: 'Karmic lessons arrive teaching through',
    seasonal: 'Seasonal energies modulate your experience via',
    hidden_stem: 'Underground forces emerge revealing',
    luck_pillar: 'Timing shifts redirect your path through'
  };

  return `${intro[category] || 'This period features'} ${entries.length} key patterns.`;
}

// ==================== EMOTIONAL ARC GENERATION ====================

/**
 * Generate emotional arc across lifespan
 */
export function generateEmotionalArc(
  storyBeats: StoryBeat[],
  maxAge: number = 80
): EmotionalArcPoint[] {
  const arc: EmotionalArcPoint[] = [];

  for (let age = 0; age <= maxAge; age += 5) {
    // Find beats active at this age
    const activeBeats = storyBeats.filter(
      b => age >= b.timeRange.startAge && age < b.timeRange.endAge
    );

    // Calculate weighted intensity
    let intensity = 0;
    const triggers: string[] = [];

    for (const beat of activeBeats) {
      const valenceMultiplier = beat.valence === 'positive' ? 1 :
                                beat.valence === 'negative' ? -1 : 0.3;
      intensity += beat.intensity * valenceMultiplier;
      triggers.push(...beat.keyRules.slice(0, 2));
    }

    // Normalize
    intensity = Math.max(-100, Math.min(100, intensity / (activeBeats.length || 1)));

    // Determine valence
    let valence: EmotionalArcPoint['valence'];
    if (intensity > 20) valence = 'positive';
    else if (intensity < -20) valence = 'negative';
    else valence = 'mixed';

    // Description
    let description: string;
    if (intensity > 50) description = 'A period of significant support and opportunity.';
    else if (intensity > 0) description = 'Generally favorable conditions with room for growth.';
    else if (intensity > -50) description = 'Mixed influences requiring balance.';
    else description = 'Challenging period calling for resilience.';

    arc.push({
      age,
      intensity: Math.round(intensity),
      valence,
      triggers: [...new Set(triggers)],
      description
    });
  }

  return arc;
}

// ==================== TIMING CURVE GENERATION ====================

/**
 * Generate timing/luck curve across lifespan
 */
export function generateTimingCurve(
  storyBeats: StoryBeat[],
  emotionalArc: EmotionalArcPoint[],
  maxAge: number = 80
): TimingCurvePoint[] {
  const curve: TimingCurvePoint[] = [];

  for (let age = 0; age <= maxAge; age += 5) {
    const arcPoint = emotionalArc.find(a => a.age === age);
    const activeBeats = storyBeats.filter(
      b => age >= b.timeRange.startAge && age < b.timeRange.endAge
    );

    // Luck level based on emotional arc (normalized to 0-100)
    const luckLevel = arcPoint ?
      Math.round(((arcPoint.intensity + 100) / 200) * 100) : 50;

    // Volatility based on number of active beats and their mixed nature
    const volatility = Math.min(100,
      activeBeats.length * 15 +
      activeBeats.filter(b => b.valence === 'mixed').length * 20
    );

    // Determine phase
    let phase: TimingCurvePoint['phase'];
    const prevPoint = curve[curve.length - 1];
    if (!prevPoint) {
      phase = 'stable';
    } else if (luckLevel > prevPoint.luckLevel + 10) {
      phase = 'ascending';
    } else if (luckLevel < prevPoint.luckLevel - 10) {
      phase = 'descending';
    } else if (luckLevel >= 70) {
      phase = 'peak';
    } else if (luckLevel <= 30) {
      phase = 'trough';
    } else {
      phase = 'stable';
    }

    // Key events
    const keyEvents = activeBeats.flatMap(b => b.dominantThemes.slice(0, 1));

    curve.push({
      age,
      luckLevel,
      volatility,
      keyEvents: [...new Set(keyEvents)],
      phase
    });
  }

  return curve;
}

// ==================== ENVIRONMENTAL OVERLAYS ====================

/**
 * Generate environmental overlays
 */
export function generateEnvironmentalOverlays(
  storyBeats: StoryBeat[],
  currentAge: number = 30
): EnvironmentalOverlay[] {
  const overlays: EnvironmentalOverlay[] = [];

  // Current decade overlay
  const currentDecadeStart = Math.floor(currentAge / 10) * 10;
  overlays.push({
    id: 'current_decade',
    label: `Current Decade (${currentDecadeStart}s)`,
    type: 'personal',
    timeRange: { startAge: currentDecadeStart, endAge: currentDecadeStart + 10 },
    effect: 'amplifying',
    targetElements: [],
    notes: 'Current decade energies are most felt in present decisions.',
    intensity: 80
  });

  // Seasonal overlay (simplified annual cycle)
  overlays.push({
    id: 'seasonal_cycle',
    label: 'Annual Seasonal Cycle',
    type: 'seasonal',
    timeRange: { startAge: 0, endAge: 100 },
    effect: 'redirecting',
    targetElements: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
    notes: 'Each year cycles through elemental seasons, modulating base energies.',
    intensity: 40
  });

  // Major life transitions
  const transitionAges = [18, 30, 40, 50, 60, 70];
  for (const transitionAge of transitionAges) {
    overlays.push({
      id: `transition_${transitionAge}`,
      label: `${transitionAge}s Transition`,
      type: 'collective',
      timeRange: { startAge: transitionAge - 1, endAge: transitionAge + 2 },
      effect: 'amplifying',
      targetElements: [],
      notes: `Common life transition period around age ${transitionAge}.`,
      intensity: 60
    });
  }

  // Feng Shui period (if relevant beats exist)
  const structureBeats = storyBeats.filter(b => b.dominantThemes.includes('structure'));
  if (structureBeats.length > 0) {
    overlays.push({
      id: 'fengshui_period',
      label: 'Period 9 (2024-2043)',
      type: 'fengshui',
      timeRange: { startAge: Math.max(0, currentAge - 5), endAge: currentAge + 20 },
      effect: 'amplifying',
      targetElements: ['Fire'],
      notes: 'Fire element is strengthened during Period 9.',
      intensity: 50
    });
  }

  return overlays;
}

// ==================== LIFE CHAPTERS ====================

/**
 * Generate life chapters from story beats
 */
export function generateLifeChapters(storyBeats: StoryBeat[]): LifeChapter[] {
  const chapters: LifeChapter[] = [];

  // Childhood (0-20)
  const childhoodBeats = storyBeats.filter(
    b => b.timeRange.startAge < 20
  );
  chapters.push({
    id: 'childhood',
    name: 'Foundation',
    nameZh: '根基期',
    ageRange: { start: 0, end: 20 },
    theme: 'Establishing core patterns and early influences',
    keyBeats: childhoodBeats.map(b => b.id),
    overallTone: determineChapterTone(childhoodBeats),
    summary: generateChapterSummary('foundation', childhoodBeats)
  });

  // Early Adulthood (20-35)
  const earlyAdultBeats = storyBeats.filter(
    b => b.timeRange.startAge >= 15 && b.timeRange.startAge < 35
  );
  chapters.push({
    id: 'early_adult',
    name: 'Emergence',
    nameZh: '崭露期',
    ageRange: { start: 20, end: 35 },
    theme: 'Building identity and establishing direction',
    keyBeats: earlyAdultBeats.map(b => b.id),
    overallTone: determineChapterTone(earlyAdultBeats),
    summary: generateChapterSummary('emergence', earlyAdultBeats)
  });

  // Prime Years (35-50)
  const primeBeats = storyBeats.filter(
    b => b.timeRange.startAge >= 30 && b.timeRange.startAge < 50
  );
  chapters.push({
    id: 'prime',
    name: 'Manifestation',
    nameZh: '显化期',
    ageRange: { start: 35, end: 50 },
    theme: 'Peak expression and achievement of potential',
    keyBeats: primeBeats.map(b => b.id),
    overallTone: determineChapterTone(primeBeats),
    summary: generateChapterSummary('manifestation', primeBeats)
  });

  // Maturity (50-65)
  const maturityBeats = storyBeats.filter(
    b => b.timeRange.startAge >= 45 && b.timeRange.startAge < 65
  );
  chapters.push({
    id: 'maturity',
    name: 'Integration',
    nameZh: '整合期',
    ageRange: { start: 50, end: 65 },
    theme: 'Integrating wisdom and passing on legacy',
    keyBeats: maturityBeats.map(b => b.id),
    overallTone: determineChapterTone(maturityBeats),
    summary: generateChapterSummary('integration', maturityBeats)
  });

  // Elder (65+)
  const elderBeats = storyBeats.filter(
    b => b.timeRange.startAge >= 60
  );
  chapters.push({
    id: 'elder',
    name: 'Completion',
    nameZh: '圆满期',
    ageRange: { start: 65, end: 100 },
    theme: 'Harvesting life wisdom and spiritual refinement',
    keyBeats: elderBeats.map(b => b.id),
    overallTone: determineChapterTone(elderBeats),
    summary: generateChapterSummary('completion', elderBeats)
  });

  return chapters;
}

function determineChapterTone(beats: StoryBeat[]): LifeChapter['overallTone'] {
  const avgIntensity = beats.reduce((sum, b) => sum + b.intensity, 0) / (beats.length || 1);
  const positiveCount = beats.filter(b => b.valence === 'positive').length;
  const negativeCount = beats.filter(b => b.valence === 'negative').length;
  const mixedCount = beats.filter(b => b.valence === 'mixed').length;

  if (positiveCount > negativeCount * 2) return 'expansive';
  if (negativeCount > positiveCount * 2) return 'challenging';
  if (mixedCount > positiveCount && mixedCount > negativeCount) return 'transforming';
  if (avgIntensity < 30) return 'resting';
  return 'consolidating';
}

function generateChapterSummary(phase: string, beats: StoryBeat[]): string {
  const toneDescriptions: Record<string, Record<string, string>> = {
    foundation: {
      expansive: 'Early years blessed with supportive energies, creating a strong foundation for growth.',
      consolidating: 'A period of steady building, establishing core patterns that will serve throughout life.',
      transforming: 'Dynamic early years with significant changes, shaping adaptability.',
      resting: 'A quiet foundation, gathering strength for later expression.',
      challenging: 'Early challenges that build resilience and depth of character.'
    },
    emergence: {
      expansive: 'A time of opening doors and expanding possibilities.',
      consolidating: 'Steadily building upon foundations, establishing identity.',
      transforming: 'Major shifts in direction and self-understanding.',
      resting: 'A period of reflection before major moves forward.',
      challenging: 'Tests that define character and clarify purpose.'
    },
    manifestation: {
      expansive: 'Peak expression of potential, with achievements and recognition.',
      consolidating: 'Deepening commitments and solidifying life work.',
      transforming: 'Major life changes redirect energy and purpose.',
      resting: 'Integration of earlier efforts, preparing for harvest.',
      challenging: 'Obstacles that ultimately strengthen resolve and refine goals.'
    },
    integration: {
      expansive: 'Wisdom flows freely, with opportunities to share and teach.',
      consolidating: 'Cementing legacy and passing on accumulated wisdom.',
      transforming: 'Second-half-of-life awakening and redirection.',
      resting: 'Stepping back to appreciate what has been built.',
      challenging: 'Late lessons that complete karmic patterns.'
    },
    completion: {
      expansive: 'A graceful elder phase with continued vitality.',
      consolidating: 'Peaceful completion of life themes.',
      transforming: 'Continued evolution and spiritual refinement.',
      resting: 'Deep peace and acceptance.',
      challenging: 'Final lessons before completion.'
    }
  };

  const tone = determineChapterTone(beats);
  return toneDescriptions[phase]?.[tone] ||
    `This phase brings ${beats.length} key influences to navigate.`;
}

// ==================== BUILD COMPLETE COCKPIT ====================

/**
 * Build complete Narrative Cockpit data
 */
export function buildNarrativeCockpit(
  codex: KnowledgeCodex,
  ctx?: ChartContext,
  luckPillars?: LuckPillarInfo[]
): NarrativeCockpitData {
  // Generate all components
  const storyBeats = generateStoryBeats(codex, luckPillars);
  const emotionalArc = generateEmotionalArc(storyBeats);
  const timingCurve = generateTimingCurve(storyBeats, emotionalArc);
  const lifeChapters = generateLifeChapters(storyBeats);
  const currentAge = ctx?.currentAge || 30;
  const overlays = generateEnvironmentalOverlays(storyBeats, currentAge);

  // Generate narrative summary
  const narrativeSummary = generateNarrativeSummary(storyBeats, lifeChapters, currentAge);

  return {
    chartId: codex.chartId || 'unknown',
    generatedAt: new Date(),
    lifeChapters,
    storyBeats,
    emotionalArc,
    timingCurve,
    overlays,
    narrativeSummary
  };
}

function generateNarrativeSummary(
  beats: StoryBeat[],
  chapters: LifeChapter[],
  currentAge: number
): string {
  const currentChapter = chapters.find(
    c => currentAge >= c.ageRange.start && currentAge < c.ageRange.end
  );

  const lines: string[] = [];

  lines.push(`Your life narrative unfolds across ${chapters.length} major chapters.`);
  lines.push('');

  if (currentChapter) {
    lines.push(`You are currently in the "${currentChapter.name}" (${currentChapter.nameZh}) phase.`);
    lines.push(currentChapter.summary);
    lines.push('');
  }

  // Key themes
  const allThemes = beats.flatMap(b => b.dominantThemes);
  const themeCounts = allThemes.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme);

  lines.push(`Your dominant life themes are: ${topThemes.join(', ')}.`);

  // Peak periods
  const peakBeats = beats.filter(b => b.intensity > 70 && b.valence === 'positive');
  if (peakBeats.length > 0) {
    const peakAges = peakBeats.map(b => `${b.timeRange.startAge}-${b.timeRange.endAge}`);
    lines.push(`Peak periods appear around ages: ${peakAges.join(', ')}.`);
  }

  return lines.join('\n');
}

// ==================== UTILITIES ====================

function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    (result[key] = result[key] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// ==================== EXPORTS ====================

export {
  generateStoryBeats,
  generateEmotionalArc,
  generateTimingCurve,
  generateEnvironmentalOverlays,
  generateLifeChapters,
  buildNarrativeCockpit,
  generateNarrativeSummary
};
