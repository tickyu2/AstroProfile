/**
 * ============================================================================
 * FATE-TO-ACTION ENGINE (命运行动引擎)
 * ============================================================================
 *
 * The walkway from the cathedral into the world.
 * Translates metaphysics into behavior, destiny into practice.
 *
 * Four Action Archetypes:
 * - Initiate (启动) - Start, propose, begin
 * - Deepen (深化) - Connect, bond, strengthen
 * - Heal (疗愈) - Repair, integrate, reflect
 * - Release (放下) - Close, boundary, let go
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ActionType,
  ActionSignals,
  ActionStep,
  ActionReason,
  FateToActionResult,
  DailyActionSummary,
  ActionCalendarMonth,
  ActionCalendarDay,
  ActionEngineInput,
  ActionCompassData,
  MicroTimingDisplayData,
  DirectionalGuidanceData,
  ActionCardData
} from './actionTypes';

import {
  ACTION_TYPE_CHINESE,
  ACTION_TYPE_COLORS,
  ACTION_TYPE_ELEMENTS,
  ACTION_DESCRIPTIONS
} from './actionTypes';

import type { LifecyclePhase, RitualType, QiMenDoor, DayOfficer } from './ritualTypes';
import { RITUAL_CHINESE, LIFECYCLE_CHINESE, QI_MEN_DOOR_CHINESE, DAY_OFFICER_CHINESE } from './ritualTypes';
import type { EmotionalTone, BeatType } from './storyTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

const ACTION_ANGLES: Record<ActionType, number> = {
  initiate: 0,    // North - Fire direction
  deepen: 90,     // East - Earth direction
  heal: 180,      // South - Water direction
  release: 270    // West - Metal direction
};

const LIFECYCLE_ACTION_AFFINITY: Record<LifecyclePhase, Record<ActionType, number>> = {
  awakening: { initiate: 90, deepen: 60, heal: 30, release: 10 },
  deepening: { initiate: 50, deepen: 95, heal: 40, release: 15 },
  challenge: { initiate: 20, deepen: 30, heal: 80, release: 50 },
  turning: { initiate: 40, deepen: 40, heal: 60, release: 60 },
  renewal: { initiate: 80, deepen: 70, heal: 50, release: 30 },
  integration: { initiate: 30, deepen: 85, heal: 50, release: 35 },
  completion: { initiate: 20, deepen: 40, heal: 60, release: 90 }
};

const QI_MEN_ACTION_AFFINITY: Record<QiMenDoor, Record<ActionType, number>> = {
  open: { initiate: 95, deepen: 60, heal: 40, release: 30 },
  rest: { initiate: 30, deepen: 70, heal: 90, release: 50 },
  life: { initiate: 85, deepen: 80, heal: 50, release: 20 },
  harm: { initiate: 40, deepen: 20, heal: 30, release: 70 },
  block: { initiate: 20, deepen: 40, heal: 60, release: 50 },
  view: { initiate: 60, deepen: 70, heal: 50, release: 40 },
  death: { initiate: 10, deepen: 20, heal: 40, release: 95 },
  shock: { initiate: 50, deepen: 30, heal: 60, release: 60 }
};

const DAY_OFFICER_ACTION_AFFINITY: Record<DayOfficer, Record<ActionType, number>> = {
  establish: { initiate: 90, deepen: 70, heal: 40, release: 20 },
  remove: { initiate: 30, deepen: 40, heal: 70, release: 85 },
  full: { initiate: 60, deepen: 90, heal: 50, release: 30 },
  balance: { initiate: 50, deepen: 80, heal: 60, release: 40 },
  stable: { initiate: 40, deepen: 95, heal: 50, release: 30 },
  execute: { initiate: 85, deepen: 60, heal: 30, release: 50 },
  break: { initiate: 20, deepen: 30, heal: 50, release: 90 },
  danger: { initiate: 30, deepen: 40, heal: 70, release: 60 },
  success: { initiate: 80, deepen: 85, heal: 50, release: 40 },
  receive: { initiate: 50, deepen: 80, heal: 60, release: 40 },
  open: { initiate: 95, deepen: 60, heal: 40, release: 30 },
  close: { initiate: 20, deepen: 40, heal: 60, release: 85 }
};

const BEAT_ACTION_AFFINITY: Record<BeatType, Record<ActionType, number>> = {
  opening: { initiate: 90, deepen: 60, heal: 30, release: 20 },
  rising: { initiate: 80, deepen: 70, heal: 40, release: 25 },
  peak: { initiate: 70, deepen: 85, heal: 30, release: 30 },
  turning: { initiate: 50, deepen: 50, heal: 70, release: 60 },
  falling: { initiate: 30, deepen: 40, heal: 80, release: 50 },
  quiet: { initiate: 40, deepen: 60, heal: 70, release: 45 },
  conflict: { initiate: 25, deepen: 30, heal: 85, release: 60 },
  resolution: { initiate: 35, deepen: 70, heal: 60, release: 80 }
};

const TONE_EMOTIONAL_QUALITY: Record<ActionType, EmotionalTone[]> = {
  initiate: ['joyful', 'hopeful', 'passionate'],
  deepen: ['peaceful', 'passionate', 'hopeful'],
  heal: ['reflective', 'peaceful', 'melancholic'],
  release: ['reflective', 'peaceful', 'anxious']
};

// ============================================================================
// SIGNAL CLASSIFICATION
// ============================================================================

/**
 * Classify the moment into an action type based on signals
 */
export function classifyAction(signals: ActionSignals): {
  primary: ActionType;
  scores: Record<ActionType, number>;
  confidence: number;
} {
  const scores: Record<ActionType, number> = {
    initiate: 0,
    deepen: 0,
    heal: 0,
    release: 0
  };

  // Weight factors
  const weights = {
    lifecycle: 0.25,
    qiMen: 0.20,
    dayOfficer: 0.15,
    storyBeat: 0.15,
    timing: 0.15,
    environment: 0.10
  };

  // Lifecycle contribution
  const lifecycleScores = LIFECYCLE_ACTION_AFFINITY[signals.lifecycle.phase];
  for (const action of Object.keys(scores) as ActionType[]) {
    scores[action] += lifecycleScores[action] * weights.lifecycle;
  }

  // Qi Men contribution
  const qiMenScores = QI_MEN_ACTION_AFFINITY[signals.environment.qiMenDoor];
  for (const action of Object.keys(scores) as ActionType[]) {
    scores[action] += qiMenScores[action] * weights.qiMen;
  }

  // Day Officer contribution
  const dayOfficerScores = DAY_OFFICER_ACTION_AFFINITY[signals.timing.dayOfficer];
  for (const action of Object.keys(scores) as ActionType[]) {
    scores[action] += dayOfficerScores[action] * weights.dayOfficer;
  }

  // Story beat contribution
  const beatScores = BEAT_ACTION_AFFINITY[signals.story.currentBeat];
  for (const action of Object.keys(scores) as ActionType[]) {
    scores[action] += beatScores[action] * weights.storyBeat;
  }

  // Timing curve contribution
  const curveBonus = {
    rising: { initiate: 25, deepen: 15, heal: -5, release: -10 },
    falling: { initiate: -10, deepen: -5, heal: 20, release: 25 },
    stable: { initiate: 5, deepen: 20, heal: 10, release: 5 },
    volatile: { initiate: -5, deepen: -10, heal: 15, release: 10 }
  };
  const curve = curveBonus[signals.timing.curveDirection];
  for (const action of Object.keys(scores) as ActionType[]) {
    scores[action] += curve[action] * weights.timing;
  }

  // Environmental element contribution
  const elementBonus: Record<string, Record<ActionType, number>> = {
    Wood: { initiate: 20, deepen: 10, heal: 5, release: -5 },
    Fire: { initiate: 25, deepen: 15, heal: 0, release: -10 },
    Earth: { initiate: 5, deepen: 25, heal: 10, release: 5 },
    Metal: { initiate: -5, deepen: 5, heal: 10, release: 25 },
    Water: { initiate: 0, deepen: 10, heal: 25, release: 10 }
  };
  const element = signals.environment.dominantElement;
  if (elementBonus[element]) {
    for (const action of Object.keys(scores) as ActionType[]) {
      scores[action] += elementBonus[element][action] * weights.environment;
    }
  }

  // Useful God / Annoying God modifiers
  if (signals.timing.usefulGodActive) {
    scores.initiate += 10;
    scores.deepen += 10;
  }
  if (signals.timing.annoyingGodActive) {
    scores.heal += 5;
    scores.release += 5;
  }

  // Ritual window bonus
  if (signals.ritual.isRitualWindow && signals.ritual.activeRitualType) {
    const ritualActionMap: Record<RitualType, ActionType> = {
      vow: 'deepen',
      healing: 'heal',
      closure: 'release',
      initiation: 'initiate'
    };
    const ritualAction = ritualActionMap[signals.ritual.activeRitualType];
    scores[ritualAction] += signals.ritual.ritualScore * 0.2;
  }

  // Find primary action
  let primary: ActionType = 'initiate';
  let maxScore = scores.initiate;
  for (const action of Object.keys(scores) as ActionType[]) {
    if (scores[action] > maxScore) {
      maxScore = scores[action];
      primary = action;
    }
  }

  // Calculate confidence (based on margin between top two)
  const sortedScores = Object.values(scores).sort((a, b) => b - a);
  const margin = sortedScores[0] - sortedScores[1];
  const confidence = Math.min(100, Math.max(0, 50 + margin));

  return { primary, scores, confidence };
}

// ============================================================================
// ACTION STEP GENERATION
// ============================================================================

/**
 * Generate action steps based on classification
 */
export function generateActionSteps(
  actionType: ActionType,
  signals: ActionSignals,
  input: ActionEngineInput
): ActionStep[] {
  const steps: ActionStep[] = [];

  // Generate primary action step
  const primaryStep = generatePrimaryStep(actionType, signals, input);
  steps.push(primaryStep);

  // Generate secondary action steps if requested
  if ((input.options?.maxSteps || 3) > 1) {
    const { scores } = classifyAction(signals);
    const sortedActions = (Object.keys(scores) as ActionType[])
      .filter(a => a !== actionType)
      .sort((a, b) => scores[b] - scores[a]);

    for (let i = 0; i < Math.min(2, sortedActions.length); i++) {
      const secondaryAction = sortedActions[i];
      if (scores[secondaryAction] > (input.options?.minConfidence || 30)) {
        const secondaryStep = generatePrimaryStep(secondaryAction, signals, input);
        secondaryStep.confidence = scores[secondaryAction];
        secondaryStep.confidenceTier = secondaryStep.confidence > 60 ? 'high' :
                                        secondaryStep.confidence > 40 ? 'medium' : 'low';
        steps.push(secondaryStep);
      }
    }
  }

  return steps;
}

/**
 * Generate a primary action step
 */
function generatePrimaryStep(
  actionType: ActionType,
  signals: ActionSignals,
  input: ActionEngineInput
): ActionStep {
  const { scores, confidence } = classifyAction(signals);

  // Generate imperative
  const imperatives: Record<ActionType, string[]> = {
    initiate: [
      'Start the conversation you\'ve been postponing.',
      'Take the first step forward.',
      'Make the proposal.',
      'Begin the project.',
      'Send the message.'
    ],
    deepen: [
      'Share your intentions openly.',
      'Strengthen the bond through presence.',
      'Clarify what you both want.',
      'Collaborate on shared goals.',
      'Build trust through consistency.'
    ],
    heal: [
      'Slow down and reflect.',
      'Repair what needs mending.',
      'Apologize if needed.',
      'Integrate the lessons.',
      'Practice patience.'
    ],
    release: [
      'Set a clear boundary.',
      'Close this cycle with intention.',
      'Let go of what no longer serves.',
      'Redefine the relationship.',
      'Release with grace.'
    ]
  };

  const imperative = imperatives[actionType][Math.floor(Math.random() * imperatives[actionType].length)];

  // Generate reasons
  const reasons = generateReasons(actionType, signals);

  // Generate cautions
  const cautions = generateCautions(actionType, signals);

  // Generate timing window
  const now = new Date(input.date);
  const start = new Date(now);
  start.setHours(9, 0, 0, 0);
  const end = new Date(now);
  end.setHours(18, 0, 0, 0);

  // Generate micro-timing if requested
  let microWindow: ActionStep['microWindow'] | undefined;
  if (input.options?.includeMicroTiming) {
    const microStart = new Date(now);
    const bestHour = actionType === 'initiate' ? 10 :
                     actionType === 'deepen' ? 14 :
                     actionType === 'heal' ? 19 :
                     actionType === 'release' ? 16;
    microStart.setHours(bestHour, 45, 0, 0);
    const microEnd = new Date(microStart);
    microEnd.setMinutes(microEnd.getMinutes() + 15);

    microWindow = {
      start: microStart.toISOString(),
      end: microEnd.toISOString(),
      quality: confidence > 70 ? 'excellent' : confidence > 50 ? 'good' : 'neutral'
    };
  }

  // Generate directional guidance if requested
  let direction: ActionStep['direction'] | undefined;
  if (input.options?.includeDirectional) {
    direction = {
      best: signals.environment.bestDirection,
      bestChinese: signals.environment.bestDirectionChinese,
      explanation: `Face ${signals.environment.bestDirection} for optimal alignment.`
    };
  }

  // Ritual integration
  let ritualType: RitualType | undefined;
  let ritualTypeChinese: string | undefined;
  if (input.options?.includeRituals && signals.ritual.isRitualWindow && signals.ritual.activeRitualType) {
    ritualType = signals.ritual.activeRitualType;
    ritualTypeChinese = RITUAL_CHINESE[ritualType];
  }

  // Narrative frame
  const narrativeFrames: Record<ActionType, string[]> = {
    initiate: [
      'This is a moment for boldness.',
      'The energy supports forward movement.',
      'Clarity meets opportunity.'
    ],
    deepen: [
      'This is a moment for connection.',
      'The energy supports bonding.',
      'Presence creates trust.'
    ],
    heal: [
      'This is a moment for softness.',
      'The energy supports repair.',
      'Patience brings integration.'
    ],
    release: [
      'This is a moment for closure.',
      'The energy supports release.',
      'Letting go creates space.'
    ]
  };

  const narrativeFrame = narrativeFrames[actionType][Math.floor(Math.random() * narrativeFrames[actionType].length)];

  // Emotional quality
  const emotionalQuality = TONE_EMOTIONAL_QUALITY[actionType][0];

  return {
    id: `step_${actionType}_${Date.now()}`,
    actionType,
    actionTypeChinese: ACTION_TYPE_CHINESE[actionType],
    description: ACTION_DESCRIPTIONS[actionType].purpose,
    imperative,
    timing: {
      start: start.toISOString(),
      end: end.toISOString(),
      duration: '9 hours'
    },
    microWindow,
    direction,
    ritualType,
    ritualTypeChinese,
    confidence,
    confidenceTier: confidence > 70 ? 'high' : confidence > 50 ? 'medium' : 'low',
    reasons,
    cautions,
    emotionalQuality,
    narrativeFrame
  };
}

/**
 * Generate reasons for an action
 */
function generateReasons(actionType: ActionType, signals: ActionSignals): ActionReason[] {
  const reasons: ActionReason[] = [];

  // Lifecycle reason
  const lifecycleScore = LIFECYCLE_ACTION_AFFINITY[signals.lifecycle.phase][actionType];
  if (lifecycleScore > 60) {
    reasons.push({
      factor: `${signals.lifecycle.phase} phase`,
      factorChinese: LIFECYCLE_CHINESE[signals.lifecycle.phase],
      impact: 'positive',
      weight: lifecycleScore / 100,
      description: `The ${signals.lifecycle.phase} phase supports ${actionType} actions.`
    });
  }

  // Qi Men reason
  const qiMenScore = QI_MEN_ACTION_AFFINITY[signals.environment.qiMenDoor][actionType];
  if (qiMenScore > 60) {
    reasons.push({
      factor: `${signals.environment.qiMenDoor} Door`,
      factorChinese: QI_MEN_DOOR_CHINESE[signals.environment.qiMenDoor],
      impact: 'positive',
      weight: qiMenScore / 100,
      description: `The ${signals.environment.qiMenDoor} Door aligns with ${actionType}.`
    });
  }

  // Day Officer reason
  const dayOfficerScore = DAY_OFFICER_ACTION_AFFINITY[signals.timing.dayOfficer][actionType];
  if (dayOfficerScore > 60) {
    reasons.push({
      factor: `${signals.timing.dayOfficer} Officer`,
      factorChinese: DAY_OFFICER_CHINESE[signals.timing.dayOfficer],
      impact: 'positive',
      weight: dayOfficerScore / 100,
      description: `The ${signals.timing.dayOfficer} Day Officer supports ${actionType}.`
    });
  }

  // Timing curve reason
  if (signals.timing.curveDirection === 'rising' && actionType === 'initiate') {
    reasons.push({
      factor: 'Rising curve',
      factorChinese: '上升曲线',
      impact: 'positive',
      weight: 0.7,
      description: 'The rising destiny curve supports initiative.'
    });
  } else if (signals.timing.curveDirection === 'falling' && actionType === 'heal') {
    reasons.push({
      factor: 'Falling curve',
      factorChinese: '下降曲线',
      impact: 'positive',
      weight: 0.6,
      description: 'The falling curve invites healing and reflection.'
    });
  }

  // Element reason
  const supportingElements = ACTION_TYPE_ELEMENTS[actionType];
  if (supportingElements.includes(signals.environment.dominantElement)) {
    reasons.push({
      factor: `${signals.environment.dominantElement} dominance`,
      factorChinese: `${signals.environment.dominantElement}旺`,
      impact: 'positive',
      weight: 0.6,
      description: `${signals.environment.dominantElement} element supports ${actionType}.`
    });
  }

  // Ritual reason
  if (signals.ritual.isRitualWindow && signals.ritual.activeRitualType) {
    const ritualActionMap: Record<RitualType, ActionType> = {
      vow: 'deepen',
      healing: 'heal',
      closure: 'release',
      initiation: 'initiate'
    };
    if (ritualActionMap[signals.ritual.activeRitualType] === actionType) {
      reasons.push({
        factor: `${signals.ritual.activeRitualType} ritual window`,
        factorChinese: RITUAL_CHINESE[signals.ritual.activeRitualType],
        impact: 'positive',
        weight: signals.ritual.ritualScore / 100,
        description: `Active ${signals.ritual.activeRitualType} ritual window amplifies ${actionType}.`
      });
    }
  }

  return reasons;
}

/**
 * Generate cautions for an action
 */
function generateCautions(actionType: ActionType, signals: ActionSignals): string[] {
  const cautions: string[] = [];

  // Check for contraindications
  const avoidWhen = ACTION_DESCRIPTIONS[actionType].avoidWhen;

  // Curve contraindication
  if (signals.timing.curveDirection === 'falling' && actionType === 'initiate') {
    cautions.push('Falling curve may reduce initiative success.');
  }
  if (signals.timing.curveDirection === 'rising' && actionType === 'release') {
    cautions.push('Rising curve may make release feel premature.');
  }

  // Qi Men contraindication
  const qiMenScore = QI_MEN_ACTION_AFFINITY[signals.environment.qiMenDoor][actionType];
  if (qiMenScore < 30) {
    cautions.push(`${signals.environment.qiMenDoor} Door is not ideal for ${actionType}.`);
  }

  // Annoying God warning
  if (signals.timing.annoyingGodActive && (actionType === 'initiate' || actionType === 'deepen')) {
    cautions.push('Annoying God is active — proceed with extra care.');
  }

  // Avoid direction warning
  if (signals.environment.avoidDirection) {
    cautions.push(`Avoid facing ${signals.environment.avoidDirection}.`);
  }

  return cautions;
}

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

/**
 * Generate fate-to-action guidance for a date
 */
export function generateFateToAction(input: ActionEngineInput): FateToActionResult {
  // Build signals from input or defaults
  const signals = buildSignals(input);

  // Classify the moment
  const { primary, scores, confidence } = classifyAction(signals);

  // Generate action steps
  const allSteps = generateActionSteps(primary, signals, input);

  // Separate into recommended and secondary
  const recommended = allSteps;
  const bestAction = allSteps[0] || null;
  const secondaryActions = allSteps.slice(1);

  // Generate avoid actions
  const avoidActions: FateToActionResult['avoidActions'] = [];
  for (const action of Object.keys(scores) as ActionType[]) {
    if (scores[action] < 30) {
      avoidActions.push({
        actionType: action,
        actionTypeChinese: ACTION_TYPE_CHINESE[action],
        reason: `Low alignment score (${Math.round(scores[action])}%)`,
        confidence: scores[action]
      });
    }
  }

  // Generate daily summary
  const dailySummary = generateDailySummary(input.date, primary, scores, signals);

  // Generate narrative summary
  const narrativeSummary = generateNarrativeSummary(primary, confidence, signals, bestAction);

  // Format date in Chinese
  const dateObj = new Date(input.date);
  const dateChinese = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

  return {
    id: `action_${Date.now()}`,
    date: input.date,
    dateChinese,
    signalsSummary: {
      timingScore: signals.timing.curveValue,
      storyPhase: signals.story.currentBeat,
      lifecyclePhase: signals.lifecycle.phase,
      environmentalTier: signals.environment.environmentalTier
    },
    recommended,
    bestAction,
    secondaryActions,
    avoidActions,
    dailySummary,
    narrativeSummary,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

/**
 * Build signals from input or use defaults
 */
function buildSignals(input: ActionEngineInput): ActionSignals {
  const defaults: ActionSignals = {
    timing: {
      curveDirection: 'stable',
      curveValue: 50,
      usefulGodActive: false,
      annoyingGodActive: false,
      dayOfficer: 'balance'
    },
    story: {
      currentBeat: 'quiet',
      emotionalTone: 'peaceful',
      chapterArc: 'stable',
      isClimax: false,
      isTurningPoint: false
    },
    lifecycle: {
      phase: 'deepening',
      progress: 50,
      trajectoryDirection: 'stable'
    },
    environment: {
      qiMenDoor: 'rest',
      dominantElement: 'Earth',
      supportingElements: ['Earth', 'Metal'],
      bestDirection: 'Southeast',
      bestDirectionChinese: '东南',
      environmentalTier: 'neutral'
    },
    ritual: {
      activeRitualType: null,
      ritualScore: 0,
      isRitualWindow: false
    }
  };

  // Merge with provided signals
  if (input.signals) {
    return {
      timing: { ...defaults.timing, ...input.signals.timing },
      story: { ...defaults.story, ...input.signals.story },
      lifecycle: { ...defaults.lifecycle, ...input.signals.lifecycle },
      environment: { ...defaults.environment, ...input.signals.environment },
      ritual: { ...defaults.ritual, ...input.signals.ritual }
    };
  }

  return defaults;
}

/**
 * Generate daily summary
 */
function generateDailySummary(
  date: string,
  primary: ActionType,
  scores: Record<ActionType, number>,
  signals: ActionSignals
): DailyActionSummary {
  const dateObj = new Date(date);
  const dateChinese = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

  // Key windows
  const keyWindows = [
    { time: '10:00-11:00', action: 'initiate' as ActionType, confidence: scores.initiate },
    { time: '14:00-15:00', action: 'deepen' as ActionType, confidence: scores.deepen },
    { time: '16:00-17:00', action: 'release' as ActionType, confidence: scores.release },
    { time: '19:00-20:00', action: 'heal' as ActionType, confidence: scores.heal }
  ].sort((a, b) => b.confidence - a.confidence);

  // Day theme
  const dayThemes: Record<ActionType, string> = {
    initiate: 'A day for bold beginnings',
    deepen: 'A day for meaningful connection',
    heal: 'A day for gentle repair',
    release: 'A day for mindful closure'
  };

  const dayThemesChinese: Record<ActionType, string> = {
    initiate: '勇敢开始的日子',
    deepen: '有意义连接的日子',
    heal: '温和修复的日子',
    release: '正念结束的日子'
  };

  // Do this / Avoid this
  const doThis: string[] = [];
  const avoidThis: string[] = [];

  for (const action of Object.keys(scores) as ActionType[]) {
    if (scores[action] > 60) {
      doThis.push(ACTION_DESCRIPTIONS[action].keywords[0]);
    }
    if (scores[action] < 30) {
      avoidThis.push(ACTION_DESCRIPTIONS[action].keywords[0]);
    }
  }

  return {
    date,
    dateChinese,
    primaryMode: primary,
    primaryModeChinese: ACTION_TYPE_CHINESE[primary],
    primaryModeConfidence: scores[primary],
    actionDistribution: scores,
    keyWindows,
    dayTheme: dayThemes[primary],
    dayThemeChinese: dayThemesChinese[primary],
    doThis,
    avoidThis
  };
}

/**
 * Generate narrative summary
 */
function generateNarrativeSummary(
  primary: ActionType,
  confidence: number,
  signals: ActionSignals,
  bestAction: ActionStep | null
): string {
  const lines: string[] = [];

  lines.push(`### Fate‑to‑Action Guidance — ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  lines.push(`**Best Action: ${ACTION_TYPE_CHINESE[primary]} (${primary.charAt(0).toUpperCase() + primary.slice(1)}) — Confidence: ${Math.round(confidence)}%**`);

  // Add reasons
  if (bestAction && bestAction.reasons.length > 0) {
    for (const reason of bestAction.reasons.slice(0, 3)) {
      lines.push(`- ${reason.description}`);
    }
  }

  lines.push('');
  lines.push('**Action Step**');
  if (bestAction) {
    lines.push(`- ${bestAction.imperative}`);
    if (bestAction.direction) {
      lines.push(`- Face ${bestAction.direction.best} if possible.`);
    }
    if (bestAction.microWindow) {
      const microStart = new Date(bestAction.microWindow.start);
      const timeStr = `${microStart.getHours().toString().padStart(2, '0')}:${microStart.getMinutes().toString().padStart(2, '0')}`;
      lines.push(`- Use the micro‑window at ${timeStr}.`);
    }
    lines.push(`- ${bestAction.narrativeFrame}`);
  }

  // Add cautions
  if (bestAction && bestAction.cautions.length > 0) {
    lines.push('');
    lines.push('**Cautions**');
    for (const caution of bestAction.cautions) {
      lines.push(`- ${caution}`);
    }
  }

  return lines.join('\n');
}

// ============================================================================
// CALENDAR GENERATION
// ============================================================================

/**
 * Generate action calendar for a month
 */
export function generateActionCalendar(
  year: number,
  month: number,
  input?: Partial<ActionEngineInput>
): ActionCalendarMonth {
  const days: ActionCalendarDay[] = [];
  const initiateWindows: string[] = [];
  const deepenWindows: string[] = [];
  const healWindows: string[] = [];
  const releaseWindows: string[] = [];

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = date.toISOString().split('T')[0];

    // Generate action for this day
    const result = generateFateToAction({
      date: dateStr,
      ...input
    });

    const primary = result.bestAction?.actionType || 'deepen';
    const confidence = result.bestAction?.confidence || 50;

    // Track windows
    if (confidence > 70) {
      if (primary === 'initiate') initiateWindows.push(dateStr);
      else if (primary === 'deepen') deepenWindows.push(dateStr);
      else if (primary === 'heal') healWindows.push(dateStr);
      else if (primary === 'release') releaseWindows.push(dateStr);
    }

    days.push({
      date: dateStr,
      dateChinese: `${month}月${day}日`,
      primaryAction: primary,
      primaryActionChinese: ACTION_TYPE_CHINESE[primary],
      confidence,
      scores: result.dailySummary.actionDistribution,
      bestWindow: result.bestAction?.microWindow ? {
        start: result.bestAction.microWindow.start,
        end: result.bestAction.microWindow.end,
        action: primary
      } : undefined,
      quality: confidence > 70 ? 'excellent' :
               confidence > 50 ? 'good' :
               confidence > 30 ? 'neutral' : 'challenging',
      note: result.dailySummary.dayTheme
    });
  }

  // Month theme based on dominant action
  const actionCounts = { initiate: 0, deepen: 0, heal: 0, release: 0 };
  for (const day of days) {
    actionCounts[day.primaryAction]++;
  }
  const dominantAction = (Object.keys(actionCounts) as ActionType[])
    .reduce((a, b) => actionCounts[a] > actionCounts[b] ? a : b);

  const monthThemes: Record<ActionType, string> = {
    initiate: 'A month of new beginnings',
    deepen: 'A month of connection',
    heal: 'A month of integration',
    release: 'A month of transformation'
  };

  return {
    year,
    month,
    monthChinese: `${year}年${month}月`,
    days,
    initiateWindows,
    deepenWindows,
    healWindows,
    releaseWindows,
    monthTheme: monthThemes[dominantAction]
  };
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate action compass visualization data
 */
export function generateActionCompassData(result: FateToActionResult): ActionCompassData {
  const quadrants = (Object.keys(ACTION_ANGLES) as ActionType[]).map(action => ({
    action,
    actionChinese: ACTION_TYPE_CHINESE[action],
    score: result.dailySummary.actionDistribution[action],
    isActive: action === result.dailySummary.primaryMode,
    color: ACTION_TYPE_COLORS[action],
    angle: ACTION_ANGLES[action]
  }));

  // Calculate pointer angle based on best action
  const pointerAngle = ACTION_ANGLES[result.dailySummary.primaryMode];

  return {
    date: result.date,
    quadrants,
    center: {
      bestAction: result.dailySummary.primaryMode,
      bestActionChinese: result.dailySummary.primaryModeChinese,
      confidence: result.dailySummary.primaryModeConfidence,
      direction: result.bestAction?.direction?.best || 'Southeast',
      directionChinese: result.bestAction?.direction?.bestChinese || '东南'
    },
    pointerAngle
  };
}

/**
 * Generate micro-timing display data
 */
export function generateMicroTimingData(result: FateToActionResult): MicroTimingDisplayData {
  const hourSlots: MicroTimingDisplayData['hourSlots'] = [];

  // Generate hour slots from 6am to 10pm
  for (let hour = 6; hour <= 22; hour++) {
    const quarterSlots: MicroTimingDisplayData['hourSlots'][0]['quarterSlots'] = [];

    for (let quarter = 0; quarter < 4; quarter++) {
      const minutes = quarter * 15;
      const start = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const endMinutes = (quarter + 1) * 15;
      const endHour = endMinutes === 60 ? hour + 1 : hour;
      const end = `${endHour.toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

      // Determine action and quality based on time
      let action: ActionType = 'deepen';
      let quality: 'excellent' | 'good' | 'neutral' | 'avoid' = 'neutral';

      if (hour >= 9 && hour <= 11) {
        action = 'initiate';
        quality = hour === 10 ? 'excellent' : 'good';
      } else if (hour >= 13 && hour <= 15) {
        action = 'deepen';
        quality = hour === 14 ? 'excellent' : 'good';
      } else if (hour >= 15 && hour <= 17) {
        action = 'release';
        quality = hour === 16 ? 'good' : 'neutral';
      } else if (hour >= 18 && hour <= 20) {
        action = 'heal';
        quality = hour === 19 ? 'excellent' : 'good';
      }

      const isActive = result.dailySummary.primaryMode === action && quality !== 'avoid';

      quarterSlots.push({ start, end, action, quality, isActive });
    }

    hourSlots.push({ hour, quarterSlots });
  }

  // Best window
  let bestWindow: MicroTimingDisplayData['bestWindow'] = null;
  if (result.bestAction?.microWindow) {
    const microStart = new Date(result.bestAction.microWindow.start);
    const microEnd = new Date(result.bestAction.microWindow.end);
    bestWindow = {
      start: `${microStart.getHours().toString().padStart(2, '0')}:${microStart.getMinutes().toString().padStart(2, '0')}`,
      end: `${microEnd.getHours().toString().padStart(2, '0')}:${microEnd.getMinutes().toString().padStart(2, '0')}`,
      action: result.bestAction.actionType,
      quality: 'excellent'
    };
  }

  return {
    date: result.date,
    hourSlots,
    bestWindow,
    avoidWindows: []
  };
}

/**
 * Generate directional guidance data
 */
export function generateDirectionalGuidanceData(result: FateToActionResult): DirectionalGuidanceData {
  const directions = [
    { direction: 'North', directionChinese: '北', degree: 0 },
    { direction: 'Northeast', directionChinese: '东北', degree: 45 },
    { direction: 'East', directionChinese: '东', degree: 90 },
    { direction: 'Southeast', directionChinese: '东南', degree: 135 },
    { direction: 'South', directionChinese: '南', degree: 180 },
    { direction: 'Southwest', directionChinese: '西南', degree: 225 },
    { direction: 'West', directionChinese: '西', degree: 270 },
    { direction: 'Northwest', directionChinese: '西北', degree: 315 }
  ].map(d => ({
    ...d,
    suitability: {
      initiate: d.direction === 'East' || d.direction === 'Southeast' ? 'excellent' as const :
                d.direction === 'South' ? 'good' as const : 'neutral' as const,
      deepen: d.direction === 'Southeast' || d.direction === 'South' ? 'excellent' as const :
              d.direction === 'Southwest' ? 'good' as const : 'neutral' as const,
      heal: d.direction === 'North' || d.direction === 'Northwest' ? 'excellent' as const :
            d.direction === 'West' ? 'good' as const : 'neutral' as const,
      release: d.direction === 'West' || d.direction === 'Northwest' ? 'excellent' as const :
               d.direction === 'North' ? 'good' as const : 'neutral' as const
    },
    specialEnergies: d.direction === 'Southeast' ? ['Nobleman', 'Wealth'] : [],
    isBest: d.direction === (result.bestAction?.direction?.best || 'Southeast'),
    isAvoid: d.direction === 'Southwest' // Example avoid
  }));

  return {
    date: result.date,
    directions,
    todayBest: {
      direction: result.bestAction?.direction?.best || 'Southeast',
      directionChinese: result.bestAction?.direction?.bestChinese || '东南',
      reason: 'Optimal alignment for today\'s action.'
    },
    qiMenPalace: 4,
    qiMenDoor: 'life',
    qiMenDoorChinese: '生门'
  };
}

/**
 * Generate action card data
 */
export function generateActionCardData(
  action: ActionType,
  result: FateToActionResult
): ActionCardData {
  const score = result.dailySummary.actionDistribution[action];
  const isActive = result.dailySummary.primaryMode === action;
  const step = result.recommended.find(s => s.actionType === action);

  return {
    action,
    actionChinese: ACTION_TYPE_CHINESE[action],
    isActive,
    confidence: score,
    bestWindow: step?.microWindow ? {
      start: new Date(step.microWindow.start).toISOString(),
      end: new Date(step.microWindow.end).toISOString()
    } : null,
    direction: step?.direction?.best || 'Southeast',
    directionChinese: step?.direction?.bestChinese || '东南',
    imperative: step?.imperative || ACTION_DESCRIPTIONS[action].keywords[0],
    reasons: step?.reasons.map(r => r.description) || [],
    cautions: step?.cautions || [],
    color: ACTION_TYPE_COLORS[action]
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Chinese labels
  ACTION_TYPE_CHINESE,
  ACTION_TYPE_COLORS,
  ACTION_TYPE_ELEMENTS,
  ACTION_DESCRIPTIONS
} from './actionTypes';
