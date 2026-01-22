/**
 * ============================================
 * FULL READING PIPELINE
 * Birth Data → Entire Cathedral Stack
 *
 * This is the grand entry point:
 * 1. Accept birth data
 * 2. Calculate Four Pillars
 * 3. Run through ALL Cathedral systems
 * 4. Return unified reading
 *
 * One function to rule them all.
 * ============================================
 */

import { GrandOrchestrationEngine, CathedralState, createGrandOrchestrationEngine } from './grandOrchestrationEngine';
import { createPilgrimJourney3, PilgrimJourney3, calculateJourneyScore } from './pilgrimJourney3';
import { consultOracle, OracleResponse, OracleContext } from './mythosOracle';
import { runLineageSimulation, SimulationResult, SimulationScenario } from './lineageSimulationEngine';
import { buildArchetypeProfile, ArchetypeProfile, DEFAULT_ARCHETYPES } from './profilingToArchetype';
import { computeRitualTiming2, RitualCalendar2 } from './ritualTiming2';
import { syncProToTemple, ProTempleSync } from './proToTempleSync';
import { buildGenerationalLadder, GenerationalLadder, GenerationalThread } from './generationalLadder';
import { buildMythosHypergraph, MythosHypergraph } from './mythosHypergraph';

// ==================== DATA MODEL ====================

/**
 * Birth data input
 */
export interface BirthDataInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  timezone?: string;
  location?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
}

/**
 * Reading options
 */
export interface ReadingOptions {
  lang?: 'en' | 'zh';
  depth?: 'basic' | 'standard' | 'deep' | 'full';
  includeSimulation?: boolean;
  simulationScenarios?: SimulationScenario[];
  includeOracle?: boolean;
  oracleQueries?: string[];
  currentAge?: number;
  ancestralData?: AncestralDataInput;
}

export interface AncestralDataInput {
  knownGenerations?: number;
  familyThemes?: string[];
  knownPatterns?: string[];
  ancestorNames?: string[];
}

/**
 * The Full Reading result
 */
export interface FullReading {
  // Identity
  pilgrimId: string;
  birthData: BirthDataInput;
  generatedAt: Date;

  // Technical Layer
  technical: TechnicalReading;

  // Narrative Layer
  narrative: NarrativeReading;

  // Ancestral Layer
  ancestral: AncestralReading;

  // Mythos Layer
  mythos: MythosReading;

  // Profiling Layer
  profiling: ProfilingReading;

  // Timing Layer
  timing: TimingReading;

  // Journey Layer
  journey: JourneyReading;

  // Oracle Layer (optional)
  oracle?: OracleReading;

  // Simulation Layer (optional)
  simulation?: SimulationReading;

  // Meta
  meta: ReadingMeta;
}

export interface TechnicalReading {
  fourPillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  dayMaster: string;
  dayMasterElement: string;
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
  usefulGod?: string;
  annoyingGod?: string;
  interactions: TechnicalInteraction[];
  luckPillars: TechnicalLuckPillar[];
  elementDistribution: Record<string, number>;
}

export interface TechnicalInteraction {
  type: string;
  pillars: string[];
  description: string;
  descriptionZh?: string;
  severity: number;
}

export interface TechnicalLuckPillar {
  age: number;
  stem: string;
  branch: string;
  startYear: number;
  endYear: number;
  element: string;
  favorability: 'favorable' | 'neutral' | 'challenging';
}

export interface NarrativeReading {
  lifeStory: string;
  lifeStoryZh: string;
  currentChapter: string;
  currentChapterZh: string;
  storyBeats: StoryBeat[];
  emotionalArc: string;
  themes: string[];
}

export interface StoryBeat {
  title: string;
  titleZh: string;
  age: number;
  description: string;
  descriptionZh: string;
}

export interface AncestralReading {
  ladder: GenerationalLadder;
  threads: GenerationalThread[];
  templeSync: ProTempleSync;
  pilgrimPosition: string;
  pilgrimPositionZh: string;
  ancestralMessage: string;
  ancestralMessageZh: string;
}

export interface MythosReading {
  hypergraph: MythosHypergraph;
  primaryArchetypes: string[];
  shadowPatterns: string[];
  giftPatterns: string[];
  mythicNarrative: string;
  mythicNarrativeZh: string;
}

export interface ProfilingReading {
  archetypeProfile: ArchetypeProfile;
  workStyle: string;
  workStyleZh: string;
  personalityInsight: string;
  personalityInsightZh: string;
  strengths: string[];
  challenges: string[];
}

export interface TimingReading {
  ritualCalendar: RitualCalendar2;
  currentWindow?: string;
  upcomingWindows: string[];
  optimalTimings: OptimalTiming[];
}

export interface OptimalTiming {
  action: string;
  actionZh: string;
  timing: string;
  timingZh: string;
  reason: string;
  reasonZh: string;
}

export interface JourneyReading {
  journey: PilgrimJourney3;
  currentStage: string;
  currentStageZh: string;
  stageDescription: string;
  stageDescriptionZh: string;
  progress: number;
  nextMilestone: string;
  nextMilestoneZh: string;
}

export interface OracleReading {
  responses: OracleResponse[];
  dailyMessage: string;
  dailyMessageZh: string;
}

export interface SimulationReading {
  scenarios: SimulationResult[];
  recommendedPath: string;
  recommendedPathZh: string;
}

export interface ReadingMeta {
  version: string;
  depth: string;
  processingTime: number;
  modulesRun: string[];
  warnings: string[];
  lang: 'en' | 'zh';
}

// ==================== PIPELINE ENGINE ====================

/**
 * Run the full reading pipeline
 */
export async function runFullReadingPipeline(
  birthData: BirthDataInput,
  options: ReadingOptions = {}
): Promise<FullReading> {
  const startTime = Date.now();
  const {
    lang = 'en',
    depth = 'standard',
    includeSimulation = false,
    simulationScenarios = ['pattern_continues', 'cycle_breaks', 'healing_propagates'],
    includeOracle = true,
    currentAge,
    ancestralData
  } = options;

  const modulesRun: string[] = [];
  const warnings: string[] = [];

  // Generate pilgrim ID
  const pilgrimId = generatePilgrimId(birthData);

  // Calculate current age
  const age = currentAge || calculateAge(birthData);

  // ==================== TECHNICAL LAYER ====================
  modulesRun.push('technical');
  const technical = calculateTechnicalReading(birthData);

  // ==================== BUILD ORCHESTRATION ENGINE ====================
  modulesRun.push('orchestration');
  const orchestrationEngine = createGrandOrchestrationEngine({
    pilgrimId,
    birthData: {
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      hour: birthData.hour
    }
  });

  // ==================== ANCESTRAL LAYER ====================
  modulesRun.push('ancestral');
  const ancestral = buildAncestralReading(technical, ancestralData, lang);

  // ==================== MYTHOS LAYER ====================
  modulesRun.push('mythos');
  const mythos = buildMythosReading(technical, ancestral, lang);

  // ==================== PROFILING LAYER ====================
  modulesRun.push('profiling');
  const profiling = buildProfilingReading(technical, mythos, ancestral, lang);

  // ==================== TIMING LAYER ====================
  modulesRun.push('timing');
  const timing = buildTimingReading(technical, ancestral, age, lang);

  // ==================== JOURNEY LAYER ====================
  modulesRun.push('journey');
  const journey = buildJourneyReading(technical, mythos, ancestral, age, lang);

  // ==================== NARRATIVE LAYER ====================
  modulesRun.push('narrative');
  const narrative = buildNarrativeReading(technical, mythos, journey, lang);

  // ==================== ORACLE LAYER (optional) ====================
  let oracle: OracleReading | undefined;
  if (includeOracle) {
    modulesRun.push('oracle');
    oracle = buildOracleReading(technical, mythos, journey, lang);
  }

  // ==================== SIMULATION LAYER (optional) ====================
  let simulation: SimulationReading | undefined;
  if (includeSimulation && depth !== 'basic') {
    modulesRun.push('simulation');
    simulation = buildSimulationReading(ancestral, simulationScenarios, lang);
  }

  // ==================== ASSEMBLE FULL READING ====================
  const processingTime = Date.now() - startTime;

  return {
    pilgrimId,
    birthData,
    generatedAt: new Date(),
    technical,
    narrative,
    ancestral,
    mythos,
    profiling,
    timing,
    journey,
    oracle,
    simulation,
    meta: {
      version: '3.0.0',
      depth,
      processingTime,
      modulesRun,
      warnings,
      lang
    }
  };
}

/**
 * Generate pilgrim ID from birth data
 */
function generatePilgrimId(birthData: BirthDataInput): string {
  const dateStr = `${birthData.year}${birthData.month}${birthData.day}${birthData.hour}`;
  return `pilgrim-${dateStr}-${Date.now().toString(36)}`;
}

/**
 * Calculate age from birth data
 */
function calculateAge(birthData: BirthDataInput): number {
  const now = new Date();
  const birth = new Date(birthData.year, birthData.month - 1, birthData.day);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculate technical reading (placeholder - would use actual BaZi calculation)
 */
function calculateTechnicalReading(birthData: BirthDataInput): TechnicalReading {
  // This would use the actual BaZi calculation engine
  // For now, returning a structure placeholder

  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // Simplified calculation (would be replaced with actual algorithm)
  const yearIdx = (birthData.year - 4) % 60;
  const dayStem = stems[(yearIdx + birthData.month + birthData.day) % 10];

  return {
    fourPillars: {
      year: {
        stem: stems[yearIdx % 10],
        branch: branches[yearIdx % 12]
      },
      month: {
        stem: stems[(yearIdx + birthData.month) % 10],
        branch: branches[(birthData.month + 1) % 12]
      },
      day: {
        stem: dayStem,
        branch: branches[(yearIdx + birthData.day) % 12]
      },
      hour: {
        stem: stems[(yearIdx + birthData.hour) % 10],
        branch: branches[Math.floor(birthData.hour / 2) % 12]
      }
    },
    dayMaster: dayStem,
    dayMasterElement: getElementFromStem(dayStem),
    dayMasterStrength: 'balanced',
    interactions: [
      {
        type: 'Example Interaction',
        pillars: ['day', 'month'],
        description: 'This is a placeholder interaction.',
        descriptionZh: '这是一个占位符交互。',
        severity: 50
      }
    ],
    luckPillars: generateLuckPillars(birthData),
    elementDistribution: {
      wood: 20,
      fire: 20,
      earth: 20,
      metal: 20,
      water: 20
    }
  };
}

/**
 * Get element from stem
 */
function getElementFromStem(stem: string): string {
  const stemElements: Record<string, string> = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water'
  };
  return stemElements[stem] || 'unknown';
}

/**
 * Generate luck pillars
 */
function generateLuckPillars(birthData: BirthDataInput): TechnicalLuckPillar[] {
  const pillars: TechnicalLuckPillar[] = [];
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  for (let i = 0; i < 8; i++) {
    const age = 4 + (i * 10);
    pillars.push({
      age,
      stem: stems[(birthData.year + i) % 10],
      branch: branches[(birthData.year + i) % 12],
      startYear: birthData.year + age,
      endYear: birthData.year + age + 9,
      element: getElementFromStem(stems[(birthData.year + i) % 10]),
      favorability: i % 3 === 0 ? 'favorable' : i % 3 === 1 ? 'neutral' : 'challenging'
    });
  }

  return pillars;
}

/**
 * Build ancestral reading
 */
function buildAncestralReading(
  technical: TechnicalReading,
  ancestralData?: AncestralDataInput,
  lang: 'en' | 'zh' = 'en'
): AncestralReading {
  // Build generational ladder
  const ladder = buildGenerationalLadder({
    knownGenerations: ancestralData?.knownGenerations || 3,
    lineageTheme: ancestralData?.familyThemes?.[0] || 'transformation'
  });

  // Build threads
  const threads: GenerationalThread[] = (ancestralData?.familyThemes || ['resilience']).map((theme, idx) => ({
    id: `thread-${idx}`,
    theme,
    generations: [0, 1, 2],
    intensity: 70,
    status: 'active' as const
  }));

  // Sync to temple
  const templeSync = syncProToTemple(
    technical.interactions.map(i => ({
      type: i.type,
      pillarA: i.pillars[0] || 'day',
      pillarB: i.pillars[1] || 'month',
      description: i.description,
      descriptionZh: i.descriptionZh
    })),
    [],
    ladder,
    threads,
    []
  );

  return {
    ladder,
    threads,
    templeSync,
    pilgrimPosition: 'The current bearer of ancestral patterns.',
    pilgrimPositionZh: '祖先模式的当前承载者。',
    ancestralMessage: 'Your ancestors walk with you. Their wisdom lives in your bones.',
    ancestralMessageZh: '你的祖先与你同行。他们的智慧活在你的骨髓里。'
  };
}

/**
 * Build mythos reading
 */
function buildMythosReading(
  technical: TechnicalReading,
  ancestral: AncestralReading,
  lang: 'en' | 'zh'
): MythosReading {
  // Build hypergraph
  const hypergraph = buildMythosHypergraph({
    archetypes: ['Warrior', 'Healer', 'Seeker'],
    themes: ancestral.threads.map(t => t.theme),
    shadows: ['fear', 'doubt'],
    gifts: ['courage', 'wisdom']
  });

  return {
    hypergraph,
    primaryArchetypes: ['The Seeker', 'The Transformer'],
    shadowPatterns: ['Fear of abandonment', 'Perfectionism'],
    giftPatterns: ['Natural healing presence', 'Deep intuition'],
    mythicNarrative: 'You are on the hero\'s journey, moving from the known world into transformation.',
    mythicNarrativeZh: '你正在英雄之旅上，从已知世界走向蜕变。'
  };
}

/**
 * Build profiling reading
 */
function buildProfilingReading(
  technical: TechnicalReading,
  mythos: MythosReading,
  ancestral: AncestralReading,
  lang: 'en' | 'zh'
): ProfilingReading {
  // Build archetype profile
  const archetypeProfile = buildArchetypeProfile(
    {
      workStyle: 'analytical',
      themes: mythos.primaryArchetypes,
      interactions: technical.interactions.map(i => i.type)
    },
    DEFAULT_ARCHETYPES,
    ancestral.threads
  );

  return {
    archetypeProfile,
    workStyle: 'Analytical with creative bursts',
    workStyleZh: '分析型，伴有创造性爆发',
    personalityInsight: `Your ${technical.dayMasterElement} Day Master suggests a nature that is ${getElementPersonality(technical.dayMasterElement)}.`,
    personalityInsightZh: `你的${technical.dayMaster}日主表明你的本性是${getElementPersonalityZh(technical.dayMasterElement)}的。`,
    strengths: ['Deep thinking', 'Pattern recognition', 'Empathy'],
    challenges: ['Overthinking', 'Decision paralysis', 'Setting boundaries']
  };
}

/**
 * Get element personality
 */
function getElementPersonality(element: string): string {
  const personalities: Record<string, string> = {
    'wood': 'growth-oriented, visionary, and expansive',
    'fire': 'passionate, inspiring, and transformative',
    'earth': 'nurturing, stable, and grounded',
    'metal': 'precise, principled, and refined',
    'water': 'adaptive, wise, and flowing'
  };
  return personalities[element] || 'unique and complex';
}

function getElementPersonalityZh(element: string): string {
  const personalities: Record<string, string> = {
    'wood': '成长导向、有远见、扩展',
    'fire': '热情、鼓舞人心、变革',
    'earth': '滋养、稳定、扎根',
    'metal': '精确、有原则、精炼',
    'water': '适应性强、智慧、流动'
  };
  return personalities[element] || '独特而复杂';
}

/**
 * Build timing reading
 */
function buildTimingReading(
  technical: TechnicalReading,
  ancestral: AncestralReading,
  age: number,
  lang: 'en' | 'zh'
): TimingReading {
  const ritualCalendar = computeRitualTiming2(
    technical.interactions.map(i => ({
      type: i.type,
      severity: i.severity,
      elements: []
    })),
    technical.luckPillars.map(lp => ({
      age: lp.age,
      stem: lp.stem,
      branch: lp.branch,
      element: lp.element
    })),
    [],
    []
  );

  return {
    ritualCalendar,
    currentWindow: 'Integration period',
    upcomingWindows: ['Shadow work window', 'Gift activation window'],
    optimalTimings: [
      {
        action: 'Major decisions',
        actionZh: '重大决策',
        timing: 'Spring season',
        timingZh: '春季',
        reason: 'Wood element support',
        reasonZh: '木元素支持'
      },
      {
        action: 'Healing work',
        actionZh: '疗愈工作',
        timing: 'Full moon periods',
        timingZh: '满月期间',
        reason: 'Emotional receptivity peaks',
        reasonZh: '情绪接受力达到顶峰'
      }
    ]
  };
}

/**
 * Build journey reading
 */
function buildJourneyReading(
  technical: TechnicalReading,
  mythos: MythosReading,
  ancestral: AncestralReading,
  age: number,
  lang: 'en' | 'zh'
): JourneyReading {
  const journey = createPilgrimJourney3(
    `pilgrim-${Date.now()}`,
    age,
    ancestral.threads,
    mythos.hypergraph.nodes
  );

  const stageInfo = {
    name: 'The Ordinary World',
    nameZh: '日常世界',
    description: 'Life before the call. The pilgrim exists within familiar patterns.',
    descriptionZh: '召唤之前的生活。行者存在于熟悉的模式中。'
  };

  return {
    journey,
    currentStage: stageInfo.name,
    currentStageZh: stageInfo.nameZh,
    stageDescription: stageInfo.description,
    stageDescriptionZh: stageInfo.descriptionZh,
    progress: journey.stageProgress,
    nextMilestone: 'Answer the Call to Adventure',
    nextMilestoneZh: '回应冒险的召唤'
  };
}

/**
 * Build narrative reading
 */
function buildNarrativeReading(
  technical: TechnicalReading,
  mythos: MythosReading,
  journey: JourneyReading,
  lang: 'en' | 'zh'
): NarrativeReading {
  return {
    lifeStory: `Born under the influence of ${technical.dayMasterElement}, you carry the energy of ${getElementStory(technical.dayMasterElement)}. Your journey is one of ${mythos.primaryArchetypes.join(' and ')}.`,
    lifeStoryZh: `出生于${technical.dayMasterElement}的影响下，你携带着${getElementStoryZh(technical.dayMasterElement)}的能量。你的旅程是关于${mythos.primaryArchetypes.join('和')}的。`,
    currentChapter: journey.currentStage,
    currentChapterZh: journey.currentStageZh,
    storyBeats: [
      {
        title: 'Birth Pattern',
        titleZh: '出生模式',
        age: 0,
        description: 'The foundational energies were set at your birth.',
        descriptionZh: '基础能量在你出生时被设定。'
      }
    ],
    emotionalArc: 'Rising toward transformation',
    themes: mythos.primaryArchetypes
  };
}

function getElementStory(element: string): string {
  const stories: Record<string, string> = {
    'wood': 'growth and new beginnings',
    'fire': 'passion and illumination',
    'earth': 'stability and nurturing',
    'metal': 'refinement and clarity',
    'water': 'wisdom and adaptation'
  };
  return stories[element] || 'mystery';
}

function getElementStoryZh(element: string): string {
  const stories: Record<string, string> = {
    'wood': '成长和新开始',
    'fire': '热情和照亮',
    'earth': '稳定和滋养',
    'metal': '精炼和清晰',
    'water': '智慧和适应'
  };
  return stories[element] || '神秘';
}

/**
 * Build oracle reading
 */
function buildOracleReading(
  technical: TechnicalReading,
  mythos: MythosReading,
  journey: JourneyReading,
  lang: 'en' | 'zh'
): OracleReading {
  const context: OracleContext = {
    currentStage: 'ordinary_world',
    activeArchetypes: mythos.primaryArchetypes,
    activeShadows: mythos.shadowPatterns,
    activeGifts: mythos.giftPatterns,
    dayMaster: technical.dayMaster
  };

  const generalResponse = consultOracle({
    type: 'general_guidance',
    context,
    lang
  });

  return {
    responses: [generalResponse],
    dailyMessage: generalResponse.message,
    dailyMessageZh: generalResponse.messageZh
  };
}

/**
 * Build simulation reading
 */
function buildSimulationReading(
  ancestral: AncestralReading,
  scenarios: SimulationScenario[],
  lang: 'en' | 'zh'
): SimulationReading {
  const results = scenarios.map(scenario =>
    runLineageSimulation({
      scenario,
      currentLadder: ancestral.ladder,
      threads: ancestral.threads,
      generationsToSimulate: 3,
      lang
    })
  );

  // Find best outcome
  const bestResult = results.reduce((best, current) =>
    current.summary.healingPotential > best.summary.healingPotential ? current : best
  );

  return {
    scenarios: results,
    recommendedPath: `The ${bestResult.scenarioName} path shows the highest healing potential.`,
    recommendedPathZh: `「${bestResult.scenarioNameZh}」路径显示最高的疗愈潜力。`
  };
}

// ==================== QUICK ACCESS FUNCTIONS ====================

/**
 * Quick reading - basic depth, fast results
 */
export async function quickReading(
  birthData: BirthDataInput,
  lang: 'en' | 'zh' = 'en'
): Promise<FullReading> {
  return runFullReadingPipeline(birthData, {
    lang,
    depth: 'basic',
    includeSimulation: false,
    includeOracle: true
  });
}

/**
 * Deep reading - full depth, all features
 */
export async function deepReading(
  birthData: BirthDataInput,
  lang: 'en' | 'zh' = 'en'
): Promise<FullReading> {
  return runFullReadingPipeline(birthData, {
    lang,
    depth: 'full',
    includeSimulation: true,
    includeOracle: true
  });
}

// ==================== EXPORTS ====================

export {
  runFullReadingPipeline,
  quickReading,
  deepReading
};
