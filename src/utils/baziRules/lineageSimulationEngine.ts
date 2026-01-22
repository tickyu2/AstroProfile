/**
 * ============================================
 * LINEAGE SIMULATION ENGINE
 * "What If?" Engine for Generational Patterns
 *
 * Simulates:
 * - What if this pattern continues?
 * - What if the pilgrim breaks the cycle?
 * - What if the ancestral debt is resolved?
 * - What if the gift is fully activated?
 * - Future generation projections
 * - Alternative timeline explorations
 *
 * This is the time machine of the Cathedral.
 * ============================================
 */

import { GenerationalLadder, GenerationalThread, Generation } from './generationalLadder';

// ==================== DATA MODEL ====================

/**
 * Simulation scenario types
 */
export type SimulationScenario =
  | 'pattern_continues'       // What if the pattern continues unchanged?
  | 'cycle_breaks'            // What if the pilgrim breaks the cycle?
  | 'debt_resolved'           // What if ancestral debt is resolved?
  | 'gift_activated'          // What if the dormant gift awakens?
  | 'shadow_integrated'       // What if the shadow is integrated?
  | 'new_pattern_starts'      // What if a new pattern begins here?
  | 'healing_propagates'      // What if healing spreads through lineage?
  | 'custom';                 // Custom scenario

/**
 * Simulation input
 */
export interface SimulationInput {
  scenario: SimulationScenario;
  currentLadder: GenerationalLadder;
  threads: GenerationalThread[];
  targetThreadId?: string;
  parameters?: SimulationParameters;
  generationsToSimulate: number;
  lang?: 'en' | 'zh';
}

export interface SimulationParameters {
  patternStrength?: number;      // 0-100
  healingPotency?: number;       // 0-100
  resistanceFactor?: number;     // 0-100
  activationEnergy?: number;     // 0-100
  environmentalSupport?: number; // 0-100
  consciousnessLevel?: number;   // 0-100
}

/**
 * Simulation result
 */
export interface SimulationResult {
  scenario: SimulationScenario;
  scenarioName: string;
  scenarioNameZh: string;
  input: SimulationInput;

  // Projected generations
  projectedGenerations: ProjectedGeneration[];

  // Thread evolutions
  threadEvolutions: ThreadEvolution[];

  // Key moments
  turningPoints: TurningPoint[];

  // Outcomes
  outcomes: SimulationOutcome[];

  // Summary
  summary: SimulationSummary;

  // Probability assessment
  probability: number;
  confidence: number;
}

export interface ProjectedGeneration {
  index: number;
  label: string;
  labelZh: string;
  yearsFromNow: number;
  inheritedPatterns: string[];
  newPatterns: string[];
  resolvedPatterns: string[];
  energeticState: 'thriving' | 'struggling' | 'transforming' | 'healing' | 'dormant';
  notes: string;
  notesZh: string;
}

export interface ThreadEvolution {
  threadId: string;
  originalTheme: string;
  evolutions: ThreadState[];
  finalState: 'resolved' | 'transformed' | 'continued' | 'amplified' | 'dormant';
  impactScore: number;
}

export interface ThreadState {
  generation: number;
  state: 'active' | 'dormant' | 'transforming' | 'resolved';
  intensity: number;
  expression: string;
  expressionZh: string;
}

export interface TurningPoint {
  id: string;
  generation: number;
  yearsFromNow: number;
  event: string;
  eventZh: string;
  significance: 'minor' | 'moderate' | 'major' | 'critical';
  threadsAffected: string[];
  outcome: string;
  outcomeZh: string;
}

export interface SimulationOutcome {
  type: 'positive' | 'negative' | 'neutral' | 'transformative';
  description: string;
  descriptionZh: string;
  probability: number;
  affectedGenerations: number[];
  requirements?: string[];
}

export interface SimulationSummary {
  overallTrajectory: 'ascending' | 'descending' | 'stable' | 'volatile' | 'transformative';
  keyInsight: string;
  keyInsightZh: string;
  recommendation: string;
  recommendationZh: string;
  healingPotential: number;
  riskLevel: number;
}

// ==================== SCENARIO METADATA ====================

/**
 * Get scenario metadata
 */
export function getScenarioMetadata(scenario: SimulationScenario): {
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
} {
  const metadata: Record<SimulationScenario, {
    name: string;
    nameZh: string;
    description: string;
    descriptionZh: string;
  }> = {
    'pattern_continues': {
      name: 'Pattern Continues',
      nameZh: '模式延续',
      description: 'What if the current pattern continues unchanged through future generations?',
      descriptionZh: '如果当前模式在未来几代人中保持不变会怎样？'
    },
    'cycle_breaks': {
      name: 'Cycle Breaks',
      nameZh: '循环打破',
      description: 'What if the pilgrim consciously breaks the generational cycle?',
      descriptionZh: '如果行者有意识地打破代际循环会怎样？'
    },
    'debt_resolved': {
      name: 'Debt Resolved',
      nameZh: '债务清偿',
      description: 'What if the ancestral debt is acknowledged and resolved?',
      descriptionZh: '如果祖先的债务被承认并解决会怎样？'
    },
    'gift_activated': {
      name: 'Gift Activated',
      nameZh: '天赋激活',
      description: 'What if the dormant ancestral gift is fully awakened?',
      descriptionZh: '如果沉睡的祖先天赋被完全唤醒会怎样？'
    },
    'shadow_integrated': {
      name: 'Shadow Integrated',
      nameZh: '阴影整合',
      description: 'What if the family shadow is brought to consciousness and integrated?',
      descriptionZh: '如果家族阴影被带到意识中并整合会怎样？'
    },
    'new_pattern_starts': {
      name: 'New Pattern Begins',
      nameZh: '新模式开始',
      description: 'What if you become the founder of a new generational pattern?',
      descriptionZh: '如果你成为新代际模式的创始人会怎样？'
    },
    'healing_propagates': {
      name: 'Healing Propagates',
      nameZh: '疗愈传播',
      description: 'What if healing ripples both forward to descendants and backward to ancestors?',
      descriptionZh: '如果疗愈向前涟漪到后代，向后涟漪到祖先会怎样？'
    },
    'custom': {
      name: 'Custom Scenario',
      nameZh: '自定义场景',
      description: 'A custom simulation scenario with user-defined parameters.',
      descriptionZh: '具有用户定义参数的自定义模拟场景。'
    }
  };

  return metadata[scenario];
}

// ==================== SIMULATION ENGINE ====================

/**
 * Run lineage simulation
 */
export function runLineageSimulation(input: SimulationInput): SimulationResult {
  const { scenario, currentLadder, threads, generationsToSimulate, lang = 'en' } = input;
  const params = input.parameters || getDefaultParameters();
  const scenarioMeta = getScenarioMetadata(scenario);

  // Generate projected generations
  const projectedGenerations = projectGenerations(
    currentLadder,
    threads,
    scenario,
    params,
    generationsToSimulate
  );

  // Calculate thread evolutions
  const threadEvolutions = calculateThreadEvolutions(
    threads,
    scenario,
    params,
    generationsToSimulate
  );

  // Identify turning points
  const turningPoints = identifyTurningPoints(
    projectedGenerations,
    threadEvolutions,
    scenario
  );

  // Calculate outcomes
  const outcomes = calculateOutcomes(
    projectedGenerations,
    threadEvolutions,
    turningPoints,
    scenario
  );

  // Generate summary
  const summary = generateSimulationSummary(
    projectedGenerations,
    threadEvolutions,
    outcomes,
    scenario,
    lang
  );

  // Calculate probability and confidence
  const probability = calculateProbability(scenario, params, outcomes);
  const confidence = calculateConfidence(input, outcomes);

  return {
    scenario,
    scenarioName: scenarioMeta.name,
    scenarioNameZh: scenarioMeta.nameZh,
    input,
    projectedGenerations,
    threadEvolutions,
    turningPoints,
    outcomes,
    summary,
    probability,
    confidence
  };
}

/**
 * Get default parameters
 */
function getDefaultParameters(): SimulationParameters {
  return {
    patternStrength: 70,
    healingPotency: 50,
    resistanceFactor: 30,
    activationEnergy: 40,
    environmentalSupport: 50,
    consciousnessLevel: 50
  };
}

/**
 * Project future generations
 */
function projectGenerations(
  ladder: GenerationalLadder,
  threads: GenerationalThread[],
  scenario: SimulationScenario,
  params: SimulationParameters,
  count: number
): ProjectedGeneration[] {
  const generations: ProjectedGeneration[] = [];
  const currentGenIndex = ladder.currentPilgrimIndex || 0;

  for (let i = 1; i <= count; i++) {
    const genIndex = currentGenIndex + i;
    const yearsFromNow = i * 25; // Approximately 25 years per generation

    const inherited = calculateInheritedPatterns(threads, scenario, params, i);
    const newPatterns = calculateNewPatterns(scenario, params, i);
    const resolved = calculateResolvedPatterns(threads, scenario, params, i);
    const state = calculateEnergeticState(scenario, params, i, inherited, resolved);

    generations.push({
      index: genIndex,
      label: `Generation ${genIndex} (+${i})`,
      labelZh: `第${genIndex}代 (+${i})`,
      yearsFromNow,
      inheritedPatterns: inherited,
      newPatterns,
      resolvedPatterns: resolved,
      energeticState: state,
      notes: generateGenerationNotes(state, inherited, newPatterns, resolved, 'en'),
      notesZh: generateGenerationNotes(state, inherited, newPatterns, resolved, 'zh')
    });
  }

  return generations;
}

/**
 * Calculate inherited patterns for a generation
 */
function calculateInheritedPatterns(
  threads: GenerationalThread[],
  scenario: SimulationScenario,
  params: SimulationParameters,
  genOffset: number
): string[] {
  const patternStrength = params.patternStrength || 70;
  const decay = scenario === 'cycle_breaks' ? 0.5 : 0.9;

  return threads
    .filter(t => {
      const inheritanceChance = patternStrength * Math.pow(decay, genOffset);
      return Math.random() * 100 < inheritanceChance;
    })
    .map(t => t.theme);
}

/**
 * Calculate new patterns for a generation
 */
function calculateNewPatterns(
  scenario: SimulationScenario,
  params: SimulationParameters,
  genOffset: number
): string[] {
  const patterns: string[] = [];

  if (scenario === 'new_pattern_starts' && genOffset === 1) {
    patterns.push('New Conscious Pattern');
  }

  if (scenario === 'healing_propagates') {
    if (genOffset <= 3) {
      patterns.push('Healing Wave');
    }
  }

  if (scenario === 'gift_activated' && genOffset === 1) {
    patterns.push('Awakened Gift');
  }

  return patterns;
}

/**
 * Calculate resolved patterns for a generation
 */
function calculateResolvedPatterns(
  threads: GenerationalThread[],
  scenario: SimulationScenario,
  params: SimulationParameters,
  genOffset: number
): string[] {
  if (scenario === 'pattern_continues') return [];

  const healingPotency = params.healingPotency || 50;
  const resolved: string[] = [];

  if (scenario === 'debt_resolved' && genOffset >= 1) {
    resolved.push('Ancestral Debt');
  }

  if (scenario === 'shadow_integrated' && genOffset >= 2) {
    resolved.push('Family Shadow');
  }

  if (scenario === 'cycle_breaks') {
    const breakChance = healingPotency * (genOffset / 3);
    threads.forEach(t => {
      if (Math.random() * 100 < breakChance) {
        resolved.push(t.theme);
      }
    });
  }

  return resolved;
}

/**
 * Calculate energetic state
 */
function calculateEnergeticState(
  scenario: SimulationScenario,
  params: SimulationParameters,
  genOffset: number,
  inherited: string[],
  resolved: string[]
): ProjectedGeneration['energeticState'] {
  const healingPotency = params.healingPotency || 50;

  if (scenario === 'healing_propagates' && genOffset <= 3) {
    return 'healing';
  }

  if (scenario === 'cycle_breaks' && genOffset >= 2) {
    return resolved.length > inherited.length ? 'thriving' : 'transforming';
  }

  if (scenario === 'pattern_continues' && inherited.length > 3) {
    return 'struggling';
  }

  if (scenario === 'gift_activated') {
    return genOffset === 1 ? 'transforming' : 'thriving';
  }

  if (resolved.length > 0) return 'healing';
  if (inherited.length > 2) return 'struggling';

  return 'dormant';
}

/**
 * Generate generation notes
 */
function generateGenerationNotes(
  state: ProjectedGeneration['energeticState'],
  inherited: string[],
  newPatterns: string[],
  resolved: string[],
  lang: 'en' | 'zh'
): string {
  const notes: string[] = [];

  if (lang === 'zh') {
    if (state === 'thriving') notes.push('这一代蓬勃发展。');
    if (state === 'healing') notes.push('疗愈正在进行中。');
    if (state === 'transforming') notes.push('深刻的转变正在发生。');
    if (state === 'struggling') notes.push('挑战依然存在。');
    if (newPatterns.length > 0) notes.push(`新模式出现：${newPatterns.join('、')}。`);
    if (resolved.length > 0) notes.push(`已解决：${resolved.join('、')}。`);
  } else {
    if (state === 'thriving') notes.push('This generation thrives.');
    if (state === 'healing') notes.push('Healing is underway.');
    if (state === 'transforming') notes.push('Deep transformation is occurring.');
    if (state === 'struggling') notes.push('Challenges persist.');
    if (newPatterns.length > 0) notes.push(`New patterns emerge: ${newPatterns.join(', ')}.`);
    if (resolved.length > 0) notes.push(`Resolved: ${resolved.join(', ')}.`);
  }

  return notes.join(' ');
}

/**
 * Calculate thread evolutions
 */
function calculateThreadEvolutions(
  threads: GenerationalThread[],
  scenario: SimulationScenario,
  params: SimulationParameters,
  generations: number
): ThreadEvolution[] {
  return threads.map(thread => {
    const evolutions: ThreadState[] = [];

    for (let g = 1; g <= generations; g++) {
      evolutions.push(calculateThreadState(thread, scenario, params, g));
    }

    const finalState = determineFinalState(evolutions, scenario);
    const impactScore = calculateImpactScore(evolutions, finalState);

    return {
      threadId: thread.id,
      originalTheme: thread.theme,
      evolutions,
      finalState,
      impactScore
    };
  });
}

/**
 * Calculate thread state at a generation
 */
function calculateThreadState(
  thread: GenerationalThread,
  scenario: SimulationScenario,
  params: SimulationParameters,
  generation: number
): ThreadState {
  let state: ThreadState['state'] = 'active';
  let intensity = 70;

  if (scenario === 'cycle_breaks') {
    intensity = Math.max(0, 70 - (generation * 20));
    state = intensity < 20 ? 'resolved' : intensity < 50 ? 'dormant' : 'active';
  } else if (scenario === 'healing_propagates') {
    state = generation <= 2 ? 'transforming' : 'resolved';
    intensity = Math.max(0, 70 - (generation * 15));
  } else if (scenario === 'pattern_continues') {
    intensity = Math.min(100, 70 + (generation * 5));
    state = 'active';
  }

  return {
    generation,
    state,
    intensity,
    expression: getStateExpression(state, intensity, 'en'),
    expressionZh: getStateExpression(state, intensity, 'zh')
  };
}

/**
 * Get state expression
 */
function getStateExpression(state: ThreadState['state'], intensity: number, lang: 'en' | 'zh'): string {
  if (lang === 'zh') {
    if (state === 'resolved') return '模式已解决';
    if (state === 'dormant') return '模式休眠中';
    if (state === 'transforming') return '模式正在转化';
    return intensity > 70 ? '模式强烈活跃' : '模式持续存在';
  }

  if (state === 'resolved') return 'Pattern resolved';
  if (state === 'dormant') return 'Pattern dormant';
  if (state === 'transforming') return 'Pattern transforming';
  return intensity > 70 ? 'Pattern strongly active' : 'Pattern continues';
}

/**
 * Determine final state of thread
 */
function determineFinalState(
  evolutions: ThreadState[],
  scenario: SimulationScenario
): ThreadEvolution['finalState'] {
  const lastState = evolutions[evolutions.length - 1];

  if (lastState.state === 'resolved') return 'resolved';
  if (lastState.state === 'transforming') return 'transformed';
  if (lastState.intensity > 80) return 'amplified';
  if (lastState.state === 'dormant') return 'dormant';
  return 'continued';
}

/**
 * Calculate impact score
 */
function calculateImpactScore(
  evolutions: ThreadState[],
  finalState: ThreadEvolution['finalState']
): number {
  let score = 50;

  if (finalState === 'resolved') score += 30;
  if (finalState === 'transformed') score += 20;
  if (finalState === 'amplified') score -= 20;

  const avgIntensity = evolutions.reduce((sum, e) => sum + e.intensity, 0) / evolutions.length;
  score += (50 - avgIntensity) / 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Identify turning points
 */
function identifyTurningPoints(
  generations: ProjectedGeneration[],
  evolutions: ThreadEvolution[],
  scenario: SimulationScenario
): TurningPoint[] {
  const turningPoints: TurningPoint[] = [];

  // First generation is always a turning point
  turningPoints.push({
    id: 'tp-1',
    generation: generations[0].index,
    yearsFromNow: generations[0].yearsFromNow,
    event: scenario === 'cycle_breaks' ? 'Cycle Breaking Begins' : 'Simulation Start',
    eventZh: scenario === 'cycle_breaks' ? '循环打破开始' : '模拟开始',
    significance: 'major',
    threadsAffected: evolutions.map(e => e.threadId),
    outcome: 'The journey of transformation begins.',
    outcomeZh: '转变之旅开始。'
  });

  // Check for state changes in generations
  for (let i = 1; i < generations.length; i++) {
    const prev = generations[i - 1];
    const curr = generations[i];

    if (prev.energeticState !== curr.energeticState) {
      turningPoints.push({
        id: `tp-${i + 1}`,
        generation: curr.index,
        yearsFromNow: curr.yearsFromNow,
        event: `Shift to ${curr.energeticState}`,
        eventZh: `转向${getEnergeticStateZh(curr.energeticState)}`,
        significance: 'moderate',
        threadsAffected: [],
        outcome: `Energy shifts from ${prev.energeticState} to ${curr.energeticState}.`,
        outcomeZh: `能量从${getEnergeticStateZh(prev.energeticState)}转向${getEnergeticStateZh(curr.energeticState)}。`
      });
    }
  }

  return turningPoints;
}

/**
 * Get energetic state in Chinese
 */
function getEnergeticStateZh(state: ProjectedGeneration['energeticState']): string {
  const map: Record<ProjectedGeneration['energeticState'], string> = {
    'thriving': '蓬勃',
    'struggling': '挣扎',
    'transforming': '转化',
    'healing': '疗愈',
    'dormant': '休眠'
  };
  return map[state];
}

/**
 * Calculate outcomes
 */
function calculateOutcomes(
  generations: ProjectedGeneration[],
  evolutions: ThreadEvolution[],
  turningPoints: TurningPoint[],
  scenario: SimulationScenario
): SimulationOutcome[] {
  const outcomes: SimulationOutcome[] = [];

  // Positive outcome if healing occurs
  const healingGens = generations.filter(g => g.energeticState === 'healing' || g.energeticState === 'thriving');
  if (healingGens.length > 0) {
    outcomes.push({
      type: 'positive',
      description: `${healingGens.length} generation(s) experience healing and thriving.`,
      descriptionZh: `${healingGens.length}代人经历疗愈和繁荣。`,
      probability: 70,
      affectedGenerations: healingGens.map(g => g.index)
    });
  }

  // Transformative outcome if patterns resolve
  const resolvedThreads = evolutions.filter(e => e.finalState === 'resolved' || e.finalState === 'transformed');
  if (resolvedThreads.length > 0) {
    outcomes.push({
      type: 'transformative',
      description: `${resolvedThreads.length} ancestral pattern(s) transform or resolve.`,
      descriptionZh: `${resolvedThreads.length}个祖先模式转化或解决。`,
      probability: 60,
      affectedGenerations: generations.map(g => g.index),
      requirements: ['Sustained conscious effort', 'Ritual completion']
    });
  }

  // Warning if patterns amplify
  const amplifiedThreads = evolutions.filter(e => e.finalState === 'amplified');
  if (amplifiedThreads.length > 0) {
    outcomes.push({
      type: 'negative',
      description: `${amplifiedThreads.length} pattern(s) risk amplification without intervention.`,
      descriptionZh: `如果不干预，${amplifiedThreads.length}个模式有被放大的风险。`,
      probability: 40,
      affectedGenerations: generations.map(g => g.index)
    });
  }

  return outcomes;
}

/**
 * Generate simulation summary
 */
function generateSimulationSummary(
  generations: ProjectedGeneration[],
  evolutions: ThreadEvolution[],
  outcomes: SimulationOutcome[],
  scenario: SimulationScenario,
  lang: 'en' | 'zh'
): SimulationSummary {
  // Determine trajectory
  const lastGen = generations[generations.length - 1];
  let trajectory: SimulationSummary['overallTrajectory'];

  if (lastGen.energeticState === 'thriving') trajectory = 'ascending';
  else if (lastGen.energeticState === 'struggling') trajectory = 'descending';
  else if (lastGen.energeticState === 'transforming') trajectory = 'transformative';
  else if (lastGen.energeticState === 'healing') trajectory = 'ascending';
  else trajectory = 'stable';

  // Calculate scores
  const resolvedCount = evolutions.filter(e => e.finalState === 'resolved').length;
  const healingPotential = Math.round((resolvedCount / Math.max(1, evolutions.length)) * 100);
  const amplifiedCount = evolutions.filter(e => e.finalState === 'amplified').length;
  const riskLevel = Math.round((amplifiedCount / Math.max(1, evolutions.length)) * 100);

  // Generate insight and recommendation
  const insight = generateInsight(scenario, trajectory, healingPotential, lang);
  const recommendation = generateRecommendation(scenario, trajectory, riskLevel, lang);

  return {
    overallTrajectory: trajectory,
    keyInsight: lang === 'en' ? insight.en : insight.zh,
    keyInsightZh: insight.zh,
    recommendation: lang === 'en' ? recommendation.en : recommendation.zh,
    recommendationZh: recommendation.zh,
    healingPotential,
    riskLevel
  };
}

/**
 * Generate insight
 */
function generateInsight(
  scenario: SimulationScenario,
  trajectory: SimulationSummary['overallTrajectory'],
  healingPotential: number,
  lang: 'en' | 'zh'
): { en: string; zh: string } {
  if (scenario === 'cycle_breaks' && trajectory === 'ascending') {
    return {
      en: 'Breaking the cycle initiates a powerful healing wave that benefits future generations.',
      zh: '打破循环启动了强大的疗愈浪潮，惠及后代。'
    };
  }

  if (scenario === 'healing_propagates') {
    return {
      en: 'Healing ripples both forward and backward through your lineage when consciously initiated.',
      zh: '当有意识地启动时，疗愈会向前和向后涟漪穿过你的血脉。'
    };
  }

  if (healingPotential > 70) {
    return {
      en: 'High healing potential detected. Your conscious work can transform generations.',
      zh: '检测到高疗愈潜力。你有意识的工作可以转变几代人。'
    };
  }

  return {
    en: 'The simulation reveals possibilities for transformation within your lineage.',
    zh: '模拟揭示了你血脉中转变的可能性。'
  };
}

/**
 * Generate recommendation
 */
function generateRecommendation(
  scenario: SimulationScenario,
  trajectory: SimulationSummary['overallTrajectory'],
  riskLevel: number,
  lang: 'en' | 'zh'
): { en: string; zh: string } {
  if (riskLevel > 50) {
    return {
      en: 'Prioritize shadow work and ritual completion to prevent pattern amplification.',
      zh: '优先进行阴影工作和仪式完成，以防止模式放大。'
    };
  }

  if (trajectory === 'ascending') {
    return {
      en: 'Continue your current path. Consider documenting your process for future generations.',
      zh: '继续你目前的道路。考虑为后代记录你的过程。'
    };
  }

  if (scenario === 'cycle_breaks') {
    return {
      en: 'Maintain consciousness and seek support. Cycle-breaking requires sustained effort.',
      zh: '保持意识并寻求支持。打破循环需要持续的努力。'
    };
  }

  return {
    en: 'Engage with the Ritual Engine and seek ancestral connection to optimize outcomes.',
    zh: '参与仪式引擎并寻求祖先连接以优化结果。'
  };
}

/**
 * Calculate probability
 */
function calculateProbability(
  scenario: SimulationScenario,
  params: SimulationParameters,
  outcomes: SimulationOutcome[]
): number {
  let base = 50;

  // Adjust based on parameters
  const consciousness = params.consciousnessLevel || 50;
  base += (consciousness - 50) / 5;

  const support = params.environmentalSupport || 50;
  base += (support - 50) / 5;

  // Adjust based on outcomes
  const positiveOutcomes = outcomes.filter(o => o.type === 'positive' || o.type === 'transformative');
  base += positiveOutcomes.length * 5;

  return Math.max(10, Math.min(90, Math.round(base)));
}

/**
 * Calculate confidence
 */
function calculateConfidence(input: SimulationInput, outcomes: SimulationOutcome[]): number {
  let confidence = 60;

  // More threads = more data = higher confidence
  confidence += Math.min(20, input.threads.length * 5);

  // More generations = more variance = lower confidence
  confidence -= Math.min(20, input.generationsToSimulate * 3);

  return Math.max(30, Math.min(85, confidence));
}

// ==================== RENDERING ====================

/**
 * Render simulation as markdown
 */
export function renderSimulationMarkdown(
  result: SimulationResult,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '血脉模拟结果' : 'Lineage Simulation Results'}`);
  lines.push('');

  // Scenario
  lines.push(`## ${lang === 'zh' ? '场景' : 'Scenario'}: ${lang === 'zh' ? result.scenarioNameZh : result.scenarioName}`);
  lines.push(`${lang === 'zh' ? '概率' : 'Probability'}: ${result.probability}% | ${lang === 'zh' ? '置信度' : 'Confidence'}: ${result.confidence}%`);
  lines.push('');

  // Summary
  lines.push(`## ${lang === 'zh' ? '摘要' : 'Summary'}`);
  lines.push(`**${lang === 'zh' ? '整体轨迹' : 'Overall Trajectory'}**: ${result.summary.overallTrajectory}`);
  lines.push(`**${lang === 'zh' ? '疗愈潜力' : 'Healing Potential'}**: ${result.summary.healingPotential}%`);
  lines.push(`**${lang === 'zh' ? '风险水平' : 'Risk Level'}**: ${result.summary.riskLevel}%`);
  lines.push('');
  lines.push(`> ${lang === 'zh' ? result.summary.keyInsightZh : result.summary.keyInsight}`);
  lines.push('');

  // Projected generations
  lines.push(`## ${lang === 'zh' ? '预测的几代人' : 'Projected Generations'}`);
  result.projectedGenerations.forEach(gen => {
    lines.push(`### ${lang === 'zh' ? gen.labelZh : gen.label}`);
    lines.push(`${lang === 'zh' ? '状态' : 'State'}: ${gen.energeticState}`);
    lines.push(lang === 'zh' ? gen.notesZh : gen.notes);
    lines.push('');
  });

  // Turning points
  if (result.turningPoints.length > 0) {
    lines.push(`## ${lang === 'zh' ? '转折点' : 'Turning Points'}`);
    result.turningPoints.forEach(tp => {
      lines.push(`- **${lang === 'zh' ? tp.eventZh : tp.event}** (${tp.yearsFromNow} ${lang === 'zh' ? '年后' : 'years'})`);
    });
    lines.push('');
  }

  // Recommendation
  lines.push(`## ${lang === 'zh' ? '建议' : 'Recommendation'}`);
  lines.push(lang === 'zh' ? result.summary.recommendationZh : result.summary.recommendation);

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  runLineageSimulation,
  getScenarioMetadata,
  renderSimulationMarkdown
};
