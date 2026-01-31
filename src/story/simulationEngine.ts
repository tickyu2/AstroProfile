/**
 * ============================================================================
 * DESTINY SIMULATION ENGINE (命运模拟引擎)
 * ============================================================================
 *
 * The astral observatory of the cathedral.
 * A metaphysical multiverse generator.
 *
 * Three Simulation Modes:
 * - Choice-Based (选择分支) - "What if I choose X?"
 * - Timing-Based (时机分支) - "What if at different time?"
 * - Path-Based (路径分支) - "What if different relationship path?"
 *
 * This is branching-timeline modeling grounded in BaZi logic.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  SimulationMode,
  SimulationInput,
  SimulationChoice,
  SimulatedTimeline,
  DestinySimulationResult,
  BaselineTimeline,
  ComparisonSummary,
  ModifiedLifecycle,
  ModifiedTimingCurve,
  ModifiedEvent,
  ModifiedStory,
  TimingWindow,
  ChoiceCategory,
  RelationshipPath,
  BranchComparisonData,
  ProbabilityWheelData,
  TimelineForkData
} from './simulationTypes';

import {
  SIMULATION_MODE_CHINESE,
  CHOICE_CATEGORY_CHINESE,
  SIMULATION_TIMING_CHINESE,
  RELATIONSHIP_PATH_CHINESE
} from './simulationTypes';

import type { LifecyclePhase } from './ritualTypes';
import { LIFECYCLE_CHINESE } from './ritualTypes';
import type { EmotionalTone } from './storyTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

const BRANCH_COLORS = [
  '#fbbf24', // Gold
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#a855f7', // Purple
  '#f472b6', // Pink
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#f59e0b'  // Amber
];

const TONE_VALUES: Record<EmotionalTone, number> = {
  joyful: 90,
  hopeful: 75,
  passionate: 70,
  peaceful: 65,
  reflective: 50,
  anxious: 35,
  tense: 30,
  melancholic: 20
};

// ============================================================================
// BASELINE COMPUTATION
// ============================================================================

/**
 * Compute baseline timeline from current context
 */
function computeBaseline(input: SimulationInput): BaselineTimeline {
  const { context } = input;

  // Extract upcoming events from current story
  const upcomingEvents: Array<{ timing: string; event: string; probability: number }> = [];

  if (context.currentStory?.beats) {
    const futureBeats = context.currentStory.beats.filter(b =>
      new Date(b.timeRange.start) > new Date()
    );

    for (const beat of futureBeats.slice(0, 5)) {
      upcomingEvents.push({
        timing: beat.timeRange.start,
        event: beat.summary,
        probability: beat.intensity / 100
      });
    }
  }

  // Determine curve direction
  const curveDirection = context.currentLifecycle.destinyCurve > 60 ? 'rising' :
                         context.currentLifecycle.destinyCurve < 40 ? 'falling' : 'stable';

  return {
    label: 'Current Timeline',
    labelChinese: '当前轨迹',
    lifecyclePhase: context.currentLifecycle.phase,
    lifecyclePhaseChinese: LIFECYCLE_CHINESE[context.currentLifecycle.phase],
    destinyCurve: context.currentLifecycle.destinyCurve,
    destinyCurveDirection: curveDirection,
    storySummary: context.currentStory?.prologue || 'The story continues on its natural course.',
    keyBeats: context.currentStory?.beats?.slice(0, 3).map(b => b.summary) || [],
    upcomingEvents
  };
}

// ============================================================================
// BRANCH GENERATION
// ============================================================================

/**
 * Generate simulation branches based on choice
 */
function generateBranches(
  input: SimulationInput,
  branchCount: number = 3
): SimulatedTimeline[] {
  const branches: SimulatedTimeline[] = [];

  // Generate primary branch (the choice as specified)
  branches.push(generatePrimaryBranch(input, 0));

  // Generate timing variants
  if (input.mode === 'timing' || branchCount > 1) {
    branches.push(generateTimingVariant(input, 1, 'delayed'));
  }

  if (branchCount > 2) {
    branches.push(generateTimingVariant(input, 2, 'accelerated'));
  }

  // Generate path variants for path-based simulation
  if (input.mode === 'path' && branchCount > 3) {
    branches.push(generatePathVariant(input, 3));
  }

  return branches;
}

/**
 * Generate the primary branch
 */
function generatePrimaryBranch(input: SimulationInput, index: number): SimulatedTimeline {
  const { choice, timing, context } = input;

  // Compute modified states
  const modifiedLifecycle = computeModifiedLifecycle(choice, timing, context);
  const modifiedTimingCurve = computeModifiedTimingCurve(choice, timing, context);
  const modifiedEvents = computeModifiedEvents(choice, timing, context);
  const modifiedStory = computeModifiedStory(choice, modifiedLifecycle, modifiedTimingCurve);

  // Calculate environmental support
  const environmentalSupport = calculateEnvironmentalSupport(timing, context);

  // Calculate probability
  const probability = calculateProbability(
    choice,
    timing,
    environmentalSupport,
    context
  );

  // Generate narrative
  const { opportunities, risks, keyDifferences, narrativeSummary, storyBeatLabel } =
    generateBranchNarrative(choice, timing, modifiedLifecycle, probability);

  return {
    id: `branch_${index}`,
    branchIndex: index,
    label: generateBranchLabel(choice, timing),
    labelChinese: generateBranchLabelChinese(choice, timing),
    description: `${choice.description} ${SIMULATION_TIMING_CHINESE[timing.timing]}`,
    choice,
    timing,
    modifiedLifecycle,
    modifiedTimingCurve,
    modifiedEvents,
    modifiedStory,
    environmentalSupport,
    probability,
    probabilityTier: probability > 0.6 ? 'high' : probability > 0.35 ? 'medium' : 'low',
    opportunities,
    risks,
    keyDifferences,
    narrativeSummary,
    storyBeatLabel
  };
}

/**
 * Generate a timing variant branch
 */
function generateTimingVariant(
  input: SimulationInput,
  index: number,
  variant: 'delayed' | 'accelerated'
): SimulatedTimeline {
  const { choice, context } = input;

  // Modify timing
  const modifiedTiming: TimingWindow = {
    ...input.timing,
    timing: variant === 'delayed' ? 'later' : 'soon',
    monthsFromNow: variant === 'delayed' ?
      (input.timing.monthsFromNow || 0) + 12 :
      Math.max(1, (input.timing.monthsFromNow || 6) - 6)
  };

  // Compute modified states
  const modifiedLifecycle = computeModifiedLifecycle(choice, modifiedTiming, context);
  const modifiedTimingCurve = computeModifiedTimingCurve(choice, modifiedTiming, context);
  const modifiedEvents = computeModifiedEvents(choice, modifiedTiming, context);
  const modifiedStory = computeModifiedStory(choice, modifiedLifecycle, modifiedTimingCurve);

  // Environmental support often better when waiting
  const environmentalSupport = calculateEnvironmentalSupport(modifiedTiming, context) +
    (variant === 'delayed' ? 10 : -5);

  // Probability
  const probability = calculateProbability(
    choice,
    modifiedTiming,
    Math.min(100, Math.max(0, environmentalSupport)),
    context
  );

  const { opportunities, risks, keyDifferences, narrativeSummary, storyBeatLabel } =
    generateBranchNarrative(choice, modifiedTiming, modifiedLifecycle, probability);

  return {
    id: `branch_${index}`,
    branchIndex: index,
    label: variant === 'delayed' ? 'Wait and Choose Later' : 'Choose Sooner',
    labelChinese: variant === 'delayed' ? '稍后选择' : '提前选择',
    description: `${choice.description} ${variant === 'delayed' ? 'next year' : 'soon'}`,
    choice,
    timing: modifiedTiming,
    modifiedLifecycle,
    modifiedTimingCurve,
    modifiedEvents,
    modifiedStory,
    environmentalSupport: Math.min(100, Math.max(0, environmentalSupport)),
    probability,
    probabilityTier: probability > 0.6 ? 'high' : probability > 0.35 ? 'medium' : 'low',
    opportunities,
    risks,
    keyDifferences,
    narrativeSummary,
    storyBeatLabel
  };
}

/**
 * Generate a path variant branch
 */
function generatePathVariant(input: SimulationInput, index: number): SimulatedTimeline {
  const { choice, timing, context } = input;

  // Create an alternative path choice
  const alternativeChoice: SimulationChoice = {
    ...choice,
    id: `${choice.id}_path_variant`,
    description: `Stay friends instead of ${choice.description.toLowerCase()}`,
    descriptionChinese: '保持友谊'
  };

  // Compute modified states for alternative path
  const modifiedLifecycle = computeModifiedLifecycle(alternativeChoice, timing, context);
  modifiedLifecycle.phaseShift = 'redirected';

  const modifiedTimingCurve = computeModifiedTimingCurve(alternativeChoice, timing, context);
  modifiedTimingCurve.comparedToBaseline = 'different_shape';

  const modifiedEvents = computeModifiedEvents(alternativeChoice, timing, context);
  const modifiedStory = computeModifiedStory(alternativeChoice, modifiedLifecycle, modifiedTimingCurve);
  modifiedStory.arc = 'Alternative Path';
  modifiedStory.arcChinese = '替代路径';

  const environmentalSupport = calculateEnvironmentalSupport(timing, context);
  const probability = calculateProbability(alternativeChoice, timing, environmentalSupport, context) * 0.8;

  return {
    id: `branch_${index}`,
    branchIndex: index,
    label: 'Alternative Path',
    labelChinese: '替代路径',
    description: 'A different relationship structure',
    choice: alternativeChoice,
    timing,
    modifiedLifecycle,
    modifiedTimingCurve,
    modifiedEvents,
    modifiedStory,
    environmentalSupport,
    probability,
    probabilityTier: probability > 0.6 ? 'high' : probability > 0.35 ? 'medium' : 'low',
    opportunities: ['Different but viable path', 'Less pressure', 'More flexibility'],
    risks: ['May not fulfill original desires', 'Emotional complexity'],
    keyDifferences: ['Relationship structure differs', 'Emotional trajectory shifts'],
    narrativeSummary: 'An alternate path unfolds, offering different rewards and challenges.',
    storyBeatLabel: 'The Road Not Taken'
  };
}

// ============================================================================
// MODIFICATION COMPUTATIONS
// ============================================================================

/**
 * Compute modified lifecycle based on choice
 */
function computeModifiedLifecycle(
  choice: SimulationChoice,
  timing: TimingWindow,
  context: SimulationInput['context']
): ModifiedLifecycle {
  const currentPhase = context.currentLifecycle.phase;

  // Determine new phase based on choice category
  const phaseTransitions: Record<ChoiceCategory, Record<LifecyclePhase, LifecyclePhase>> = {
    commitment: {
      awakening: 'deepening',
      deepening: 'renewal',
      challenge: 'turning',
      turning: 'renewal',
      renewal: 'integration',
      integration: 'integration',
      completion: 'renewal'
    },
    delay: {
      awakening: 'awakening',
      deepening: 'deepening',
      challenge: 'challenge',
      turning: 'challenge',
      renewal: 'deepening',
      integration: 'integration',
      completion: 'completion'
    },
    separation: {
      awakening: 'completion',
      deepening: 'turning',
      challenge: 'completion',
      turning: 'completion',
      renewal: 'turning',
      integration: 'completion',
      completion: 'completion'
    },
    expansion: {
      awakening: 'deepening',
      deepening: 'deepening',
      challenge: 'turning',
      turning: 'renewal',
      renewal: 'integration',
      integration: 'integration',
      completion: 'awakening'
    },
    relocation: {
      awakening: 'challenge',
      deepening: 'challenge',
      challenge: 'turning',
      turning: 'renewal',
      renewal: 'challenge',
      integration: 'challenge',
      completion: 'awakening'
    },
    initiation: {
      awakening: 'deepening',
      deepening: 'renewal',
      challenge: 'turning',
      turning: 'renewal',
      renewal: 'integration',
      integration: 'awakening',
      completion: 'awakening'
    },
    confession: {
      awakening: 'deepening',
      deepening: 'challenge',
      challenge: 'turning',
      turning: 'renewal',
      renewal: 'integration',
      integration: 'integration',
      completion: 'completion'
    },
    collaboration: {
      awakening: 'deepening',
      deepening: 'integration',
      challenge: 'renewal',
      turning: 'renewal',
      renewal: 'integration',
      integration: 'integration',
      completion: 'awakening'
    },
    healing: {
      awakening: 'deepening',
      deepening: 'deepening',
      challenge: 'renewal',
      turning: 'renewal',
      renewal: 'integration',
      integration: 'integration',
      completion: 'completion'
    },
    transformation: {
      awakening: 'challenge',
      deepening: 'challenge',
      challenge: 'turning',
      turning: 'renewal',
      renewal: 'awakening',
      integration: 'challenge',
      completion: 'awakening'
    }
  };

  const newPhase = phaseTransitions[choice.category]?.[currentPhase] || currentPhase;

  // Determine phase shift type
  const phaseShift = newPhase === currentPhase ? 'unchanged' :
                     timing.timing === 'now' ? 'accelerated' :
                     timing.timing === 'later' ? 'delayed' : 'redirected';

  // Determine emotional quality
  const emotionalQualities: Record<LifecyclePhase, EmotionalTone> = {
    awakening: 'hopeful',
    deepening: 'passionate',
    challenge: 'tense',
    turning: 'anxious',
    renewal: 'joyful',
    integration: 'peaceful',
    completion: 'reflective'
  };

  // Calculate transition timing
  const monthsFromNow = timing.monthsFromNow || (timing.timing === 'now' ? 0 : timing.timing === 'soon' ? 3 : 12);
  const transitionDate = new Date();
  transitionDate.setMonth(transitionDate.getMonth() + monthsFromNow);

  return {
    newPhase,
    phaseChinese: LIFECYCLE_CHINESE[newPhase],
    phaseShift,
    transitionTiming: transitionDate.toISOString().split('T')[0],
    emotionalQuality: emotionalQualities[newPhase]
  };
}

/**
 * Compute modified timing curve
 */
function computeModifiedTimingCurve(
  choice: SimulationChoice,
  timing: TimingWindow,
  context: SimulationInput['context']
): ModifiedTimingCurve {
  const baseValue = context.currentLifecycle.destinyCurve;

  // Choice impact on curve
  const choiceImpacts: Record<ChoiceCategory, number> = {
    commitment: 15,
    delay: -5,
    separation: -20,
    expansion: 10,
    relocation: -10,
    initiation: 20,
    confession: 5,
    collaboration: 12,
    healing: 8,
    transformation: 0
  };

  const impact = choiceImpacts[choice.category] || 0;

  // Timing impact
  const timingImpact = timing.timing === 'later' ? 10 : timing.timing === 'now' ? -5 : 0;

  // Calculate new strength
  const strength = Math.min(100, Math.max(0, baseValue + impact + timingImpact));

  // Determine direction
  const direction = strength > baseValue + 10 ? 'rising' :
                    strength < baseValue - 10 ? 'falling' :
                    Math.abs(strength - baseValue) < 5 ? 'stable' : 'volatile';

  // Calculate peak timing
  const peakMonths = timing.timing === 'now' ? 6 : timing.timing === 'soon' ? 9 : 18;
  const peakDate = new Date();
  peakDate.setMonth(peakDate.getMonth() + peakMonths);

  return {
    direction,
    peakYear: peakDate.getFullYear(),
    peakMonth: peakDate.getMonth() + 1,
    strength,
    inflectionPoints: [
      {
        date: peakDate.toISOString().split('T')[0],
        type: 'peak',
        significance: 'Maximum alignment reached'
      }
    ],
    comparedToBaseline: strength > baseValue + 15 ? 'stronger' :
                        strength < baseValue - 15 ? 'weaker' : 'similar'
  };
}

/**
 * Compute modified events
 */
function computeModifiedEvents(
  choice: SimulationChoice,
  timing: TimingWindow,
  context: SimulationInput['context']
): ModifiedEvent[] {
  const events: ModifiedEvent[] = [];

  // Primary event from the choice
  const monthsFromNow = timing.monthsFromNow || (timing.timing === 'now' ? 0 : timing.timing === 'soon' ? 3 : 12);
  const eventDate = new Date();
  eventDate.setMonth(eventDate.getMonth() + monthsFromNow);

  events.push({
    eventType: choice.category,
    timing: eventDate.toISOString().split('T')[0],
    probability: 0.8,
    impact: choice.category === 'separation' ? 'negative' :
            choice.category === 'delay' ? 'neutral' : 'positive',
    description: `${choice.description} occurs`
  });

  // Secondary events based on choice
  const secondaryDate = new Date(eventDate);
  secondaryDate.setMonth(secondaryDate.getMonth() + 6);

  if (choice.category === 'commitment') {
    events.push({
      eventType: 'deepening',
      timing: secondaryDate.toISOString().split('T')[0],
      probability: 0.7,
      impact: 'positive',
      description: 'Relationship enters deeper phase'
    });
  } else if (choice.category === 'separation') {
    events.push({
      eventType: 'healing',
      timing: secondaryDate.toISOString().split('T')[0],
      probability: 0.6,
      impact: 'neutral',
      description: 'Healing process begins'
    });
  } else if (choice.category === 'initiation') {
    events.push({
      eventType: 'expansion',
      timing: secondaryDate.toISOString().split('T')[0],
      probability: 0.65,
      impact: 'positive',
      description: 'Growth momentum builds'
    });
  }

  return events;
}

/**
 * Compute modified story
 */
function computeModifiedStory(
  choice: SimulationChoice,
  lifecycle: ModifiedLifecycle,
  timingCurve: ModifiedTimingCurve
): ModifiedStory {
  // Generate story title based on choice
  const titles: Record<ChoiceCategory, { en: string; zh: string }> = {
    commitment: { en: 'The Binding', zh: '缔结' },
    delay: { en: 'The Waiting', zh: '等待' },
    separation: { en: 'The Parting', zh: '离别' },
    expansion: { en: 'The Opening', zh: '开放' },
    relocation: { en: 'The Journey', zh: '旅程' },
    initiation: { en: 'The Beginning', zh: '开端' },
    confession: { en: 'The Revelation', zh: '揭示' },
    collaboration: { en: 'The Union', zh: '联合' },
    healing: { en: 'The Mending', zh: '修复' },
    transformation: { en: 'The Metamorphosis', zh: '蜕变' }
  };

  const title = titles[choice.category] || { en: 'The Path', zh: '道路' };

  // Generate arc based on lifecycle
  const arcs: Record<LifecyclePhase, { en: string; zh: string }> = {
    awakening: { en: 'Rising Dawn', zh: '破晓' },
    deepening: { en: 'Diving Deep', zh: '深潜' },
    challenge: { en: 'Facing the Storm', zh: '风暴' },
    turning: { en: 'At the Crossroads', zh: '十字路口' },
    renewal: { en: 'Spring Returns', zh: '春归' },
    integration: { en: 'Becoming Whole', zh: '圆满' },
    completion: { en: 'The Circle Closes', zh: '圆终' }
  };

  const arc = arcs[lifecycle.newPhase];

  // Generate key beats
  const keyBeats = [
    {
      id: 'beat_1',
      type: 'turning',
      timing: lifecycle.transitionTiming,
      description: `${choice.description} marks a turning point`
    },
    {
      id: 'beat_2',
      type: timingCurve.direction === 'rising' ? 'peak' : 'quiet',
      timing: `${timingCurve.peakYear}-${String(timingCurve.peakMonth).padStart(2, '0')}-01`,
      description: `The ${timingCurve.direction} arc reaches its ${timingCurve.direction === 'rising' ? 'peak' : 'lowest point'}`
    }
  ];

  // Generate emotional trajectory
  const now = new Date();
  const emotionalTrajectory = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() + i * 3);

    const baseIntensity = TONE_VALUES[lifecycle.emotionalQuality];
    const variance = timingCurve.direction === 'volatile' ? 20 : 10;
    const intensity = Math.min(100, Math.max(0, baseIntensity + (Math.random() - 0.5) * variance));

    emotionalTrajectory.push({
      timestamp: date.toISOString().split('T')[0],
      tone: lifecycle.emotionalQuality,
      intensity: Math.round(intensity)
    });
  }

  return {
    title: title.en,
    titleChinese: title.zh,
    arc: arc.en,
    arcChinese: arc.zh,
    keyBeats,
    emotionalTrajectory,
    chapterSummaries: [
      `The story begins with ${choice.description.toLowerCase()}.`,
      `The ${lifecycle.newPhase} phase shapes what follows.`,
      `The ${timingCurve.direction} trajectory carries the story forward.`
    ]
  };
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

/**
 * Calculate environmental support for a timing window
 */
function calculateEnvironmentalSupport(
  timing: TimingWindow,
  context: SimulationInput['context']
): number {
  let support = 50; // Base

  // Later timing generally has better environmental support
  if (timing.timing === 'later') support += 15;
  else if (timing.timing === 'soon') support += 5;
  else if (timing.timing === 'now') support -= 5;

  // Season alignment
  if (timing.preferredSeason) {
    support += 10; // Bonus for intentional seasonal alignment
  }

  // Element alignment
  if (timing.preferredElement && context.subjectChart.dominantElement === timing.preferredElement) {
    support += 15;
  }

  // Qi Men door bonus
  if (context.environment?.qiMenDoor === 'open' || context.environment?.qiMenDoor === 'life') {
    support += 10;
  }

  return Math.min(100, Math.max(0, support));
}

/**
 * Calculate probability of a branch manifesting
 */
function calculateProbability(
  choice: SimulationChoice,
  timing: TimingWindow,
  environmentalSupport: number,
  context: SimulationInput['context']
): number {
  let probability = 0.5; // Base

  // Environmental support contribution (0.2 weight)
  probability += (environmentalSupport - 50) / 100 * 0.2;

  // Timing contribution (0.2 weight)
  if (timing.timing === 'later') probability += 0.1;
  else if (timing.timing === 'now') probability -= 0.05;

  // Synastry contribution for relationship choices (0.2 weight)
  if (context.compositeChart?.synastryScore) {
    probability += (context.compositeChart.synastryScore - 50) / 100 * 0.2;
  }

  // Choice category influence (0.1 weight)
  const categoryProbabilities: Record<ChoiceCategory, number> = {
    commitment: 0.6,
    delay: 0.7,
    separation: 0.5,
    expansion: 0.55,
    relocation: 0.5,
    initiation: 0.6,
    confession: 0.65,
    collaboration: 0.6,
    healing: 0.7,
    transformation: 0.5
  };
  probability += (categoryProbabilities[choice.category] - 0.5) * 0.2;

  return Math.min(0.95, Math.max(0.1, probability));
}

/**
 * Generate branch label
 */
function generateBranchLabel(choice: SimulationChoice, timing: TimingWindow): string {
  const timingLabel = timing.timing === 'now' ? 'Now' :
                      timing.timing === 'soon' ? 'Soon' :
                      timing.timing === 'later' ? 'Later' : 'Scheduled';

  return `${choice.category.charAt(0).toUpperCase() + choice.category.slice(1)} ${timingLabel}`;
}

function generateBranchLabelChinese(choice: SimulationChoice, timing: TimingWindow): string {
  return `${CHOICE_CATEGORY_CHINESE[choice.category]} ${SIMULATION_TIMING_CHINESE[timing.timing]}`;
}

/**
 * Generate branch narrative content
 */
function generateBranchNarrative(
  choice: SimulationChoice,
  timing: TimingWindow,
  lifecycle: ModifiedLifecycle,
  probability: number
): {
  opportunities: string[];
  risks: string[];
  keyDifferences: string[];
  narrativeSummary: string;
  storyBeatLabel: string;
} {
  const opportunities: string[] = [];
  const risks: string[] = [];
  const keyDifferences: string[] = [];

  // Generate based on choice category
  switch (choice.category) {
    case 'commitment':
      opportunities.push('Deeper emotional connection', 'Shared growth trajectory', 'Stability');
      risks.push('Loss of flexibility', 'Pressure if timing is off');
      keyDifferences.push('Lifecycle accelerates', 'Emotional arc stabilizes');
      break;
    case 'delay':
      opportunities.push('Better timing alignment', 'More preparation time', 'Environmental support improves');
      risks.push('Momentum loss', 'Emotional distance may grow');
      keyDifferences.push('Timing curve shifts', 'Events postponed');
      break;
    case 'separation':
      opportunities.push('Freedom', 'New possibilities', 'Individual growth');
      risks.push('Emotional difficulty', 'Loss of shared history');
      keyDifferences.push('Story arc redirects', 'New lifecycle begins');
      break;
    default:
      opportunities.push('Change in trajectory', 'New opportunities emerge');
      risks.push('Uncertainty in transition', 'Adjustment period');
      keyDifferences.push('Timeline shifts', 'New story arc begins');
  }

  // Timing-specific modifications
  if (timing.timing === 'later') {
    opportunities.push('Improved environmental conditions');
    risks.push('Patience required');
  } else if (timing.timing === 'now') {
    opportunities.push('Immediate momentum');
    risks.push('Less preparation time');
  }

  // Generate narrative summary
  const probabilityNote = probability > 0.6 ? 'a likely' :
                          probability > 0.35 ? 'a possible' : 'an uncertain';

  const narrativeSummary = `This branch represents ${probabilityNote} path where ${choice.description.toLowerCase()} occurs ${SIMULATION_TIMING_CHINESE[timing.timing]}. The relationship enters the ${lifecycle.newPhase} phase, bringing ${lifecycle.emotionalQuality} energy.`;

  // Story beat label
  const beatLabels: Record<ChoiceCategory, string> = {
    commitment: 'The Binding Moment',
    delay: 'The Patient Wait',
    separation: 'The Letting Go',
    expansion: 'The Opening Door',
    relocation: 'The New Horizon',
    initiation: 'The First Step',
    confession: 'The Truth Revealed',
    collaboration: 'The Partnership Forms',
    healing: 'The Wound Mends',
    transformation: 'The Phoenix Rising'
  };

  return {
    opportunities,
    risks,
    keyDifferences,
    narrativeSummary,
    storyBeatLabel: beatLabels[choice.category] || 'The Path Chosen'
  };
}

// ============================================================================
// COMPARISON SUMMARY
// ============================================================================

/**
 * Generate comparison summary between branches
 */
function generateComparisonSummary(
  baseline: BaselineTimeline,
  branches: SimulatedTimeline[]
): ComparisonSummary {
  // Find best probability
  const bestProb = branches.reduce((best, b) =>
    b.probability > best.probability ? b : best, branches[0]);

  // Find best environmental support
  const bestEnv = branches.reduce((best, b) =>
    b.environmentalSupport > best.environmentalSupport ? b : best, branches[0]);

  // Generate key tradeoffs
  const keyTradeoffs: ComparisonSummary['keyTradeoffs'] = [];

  if (branches.length >= 2) {
    keyTradeoffs.push({
      branchA: branches[0].label,
      branchB: branches[1].label,
      tradeoff: `${branches[0].label} offers ${branches[0].opportunities[0]?.toLowerCase() || 'immediate action'}, while ${branches[1].label} provides ${branches[1].opportunities[0]?.toLowerCase() || 'more time'}.`
    });
  }

  // Timing analysis
  const timingVariants = branches.filter(b => b.timing.timing !== 'now');
  const timingAnalysis = timingVariants.length > 0 ?
    `Waiting improves environmental support by approximately ${Math.round((bestEnv.environmentalSupport - 50) * 0.5)}%.` :
    'Timing variants were not explored in this simulation.';

  // Bottom line
  const bottomLine = bestProb.probability > 0.6 ?
    `${bestProb.label} emerges as the most probable successful path.` :
    `All paths carry uncertainty; ${bestProb.label} has the highest likelihood at ${Math.round(bestProb.probability * 100)}%.`;

  return {
    bestProbability: {
      branchId: bestProb.id,
      probability: bestProb.probability
    },
    bestEnvironmentalSupport: {
      branchId: bestEnv.id,
      support: bestEnv.environmentalSupport
    },
    keyTradeoffs,
    timingAnalysis,
    bottomLine
  };
}

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

/**
 * Run a destiny simulation
 */
export function simulateDestiny(input: SimulationInput): DestinySimulationResult {
  const { mode, choice, options = {} } = input;
  const branchCount = options.branchCount || 3;

  // Step 1: Compute baseline
  const baseline = computeBaseline(input);

  // Step 2: Generate branches
  const simulations = generateBranches(input, branchCount);

  // Step 3: Find recommended branch
  const recommendedBranch = simulations.reduce<SimulatedTimeline | null>(
    (best, b) => !best || (b.probability * b.environmentalSupport) > (best.probability * best.environmentalSupport) ? b : best,
    null
  );

  // Step 4: Generate comparison summary
  const comparisonSummary = generateComparisonSummary(baseline, simulations);

  // Step 5: Generate narrative overview
  const narrativeOverview = generateNarrativeOverview(baseline, simulations, recommendedBranch);

  return {
    id: `simulation_${Date.now()}`,
    mode,
    modeChinese: SIMULATION_MODE_CHINESE[mode],
    choiceSummary: choice.description,
    baseline,
    simulations,
    recommendedBranch,
    recommendationReason: recommendedBranch ?
      `${recommendedBranch.label} offers the best combination of probability (${Math.round(recommendedBranch.probability * 100)}%) and environmental support (${recommendedBranch.environmentalSupport}%).` :
      'No clear recommendation; consider all options.',
    comparisonSummary,
    narrativeOverview,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      yearsSimulated: options.yearsAhead || 2
    }
  };
}

/**
 * Generate narrative overview
 */
function generateNarrativeOverview(
  baseline: BaselineTimeline,
  branches: SimulatedTimeline[],
  recommended: SimulatedTimeline | null
): string {
  const lines: string[] = [];

  lines.push(`**Baseline Timeline**: The relationship is currently in the ${baseline.lifecyclePhaseChinese} (${baseline.lifecyclePhase}) phase with a ${baseline.destinyCurveDirection} trajectory.`);
  lines.push('');

  for (const branch of branches) {
    lines.push(`**${branch.label}** (${branch.labelChinese}): ${branch.narrativeSummary}`);
    lines.push(`- Probability: ${Math.round(branch.probability * 100)}%`);
    lines.push(`- Environmental Support: ${branch.environmentalSupport}%`);
    lines.push('');
  }

  if (recommended) {
    lines.push(`**Recommendation**: ${recommended.label} appears most favorable, offering ${recommended.opportunities[0]?.toLowerCase() || 'good prospects'} with ${recommended.probabilityTier} probability.`);
  }

  return lines.join('\n');
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate branch comparison visualization data
 */
export function generateBranchComparisonData(result: DestinySimulationResult): BranchComparisonData {
  const branches = result.simulations.map((s, i) => ({
    id: s.id,
    label: s.label,
    color: BRANCH_COLORS[i % BRANCH_COLORS.length],
    probability: s.probability
  }));

  // Generate timing curves
  const timingCurves = result.simulations.map(s => ({
    branchId: s.id,
    points: s.modifiedStory.emotionalTrajectory.map(e => ({
      x: e.timestamp,
      y: e.intensity
    }))
  }));

  // Generate emotional arcs
  const emotionalArcs = result.simulations.map(s => ({
    branchId: s.id,
    points: s.modifiedStory.emotionalTrajectory.map(e => ({
      x: e.timestamp,
      y: TONE_VALUES[e.tone],
      tone: e.tone
    }))
  }));

  // Generate event timeline
  const eventTimeline = result.simulations.map(s => ({
    branchId: s.id,
    events: s.modifiedEvents.map(e => ({
      date: e.timing,
      label: e.description,
      impact: e.impact
    }))
  }));

  return {
    branches,
    timingCurves,
    emotionalArcs,
    eventTimeline
  };
}

/**
 * Generate probability wheel visualization data
 */
export function generateProbabilityWheelData(result: DestinySimulationResult): ProbabilityWheelData {
  const totalProbability = result.simulations.reduce((sum, s) => sum + s.probability, 0);
  let currentAngle = 0;

  const segments = result.simulations.map((s, i) => {
    const proportion = s.probability / totalProbability;
    const startAngle = currentAngle;
    const endAngle = currentAngle + proportion * 360;
    currentAngle = endAngle;

    return {
      branchId: s.id,
      label: s.label,
      labelChinese: s.labelChinese,
      probability: s.probability,
      color: BRANCH_COLORS[i % BRANCH_COLORS.length],
      startAngle,
      endAngle
    };
  });

  return {
    segments,
    center: {
      totalBranches: result.simulations.length,
      highestProbability: Math.max(...result.simulations.map(s => s.probability)),
      recommendedLabel: result.recommendedBranch?.label || 'None'
    }
  };
}

/**
 * Generate timeline fork visualization data
 */
export function generateTimelineForkData(result: DestinySimulationResult): TimelineForkData {
  const forkDate = new Date().toISOString().split('T')[0];

  // Generate baseline continuation
  const baselinePoints = [];
  let baseValue = result.baseline.destinyCurve;
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    baselinePoints.push({
      date: date.toISOString().split('T')[0],
      value: baseValue + (result.baseline.destinyCurveDirection === 'rising' ? i * 2 :
                          result.baseline.destinyCurveDirection === 'falling' ? -i * 2 : 0)
    });
  }

  // Generate branch timelines
  const branchTimelines = result.simulations.map((s, i) => ({
    id: s.id,
    label: s.label,
    color: BRANCH_COLORS[i % BRANCH_COLORS.length],
    points: s.modifiedStory.emotionalTrajectory.map(e => ({
      date: e.timestamp,
      value: e.intensity
    })),
    endpoint: {
      label: s.modifiedLifecycle.newPhase,
      value: s.modifiedTimingCurve.strength
    }
  }));

  return {
    forkPoint: {
      date: forkDate,
      choice: result.choiceSummary
    },
    baseline: {
      label: 'Current Path',
      points: baselinePoints,
      endpoint: {
        label: result.baseline.lifecyclePhase,
        value: result.baseline.destinyCurve
      }
    },
    branches: branchTimelines
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  SIMULATION_MODE_CHINESE,
  SIMULATION_MODE_DESCRIPTIONS,
  CHOICE_CATEGORY_CHINESE,
  SIMULATION_TIMING_CHINESE,
  RELATIONSHIP_PATH_CHINESE,
  CHOICE_EXAMPLES
} from './simulationTypes';

export { computeBaseline, generateBranches, calculateProbability };
