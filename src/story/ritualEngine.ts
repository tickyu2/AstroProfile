/**
 * ============================================================================
 * RITUAL TIMING ENGINE (仪式时机引擎)
 * ============================================================================
 *
 * The sanctum of the cathedral.
 * Produces ceremonial timing windows for:
 * - Vows (誓约)
 * - Healing (疗愈)
 * - Closure (结束)
 * - Initiation (开启)
 *
 * Each ritual type has its own metaphysical logic and scoring formula.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  RitualType,
  RitualWindow,
  RitualTimingResult,
  RitualEngineInput,
  RitualFactor,
  RitualTier,
  DailyRitualSummary,
  RitualCalendarMonth,
  RitualCalendarDay,
  RitualCompassData,
  RitualCardData,
  BaZiTimingSignals,
  RitualEnvironment,
  LifecycleSignals,
  DayOfficer,
  QiMenDoor,
  LifecyclePhase
} from './ritualTypes';

import {
  RITUAL_CHINESE,
  RITUAL_TIER_CHINESE,
  DAY_OFFICER_CHINESE,
  QI_MEN_DOOR_CHINESE,
  LIFECYCLE_CHINESE,
  RITUAL_DESCRIPTIONS
} from './ritualTypes';

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

/**
 * Scoring weights for each ritual type
 */
const SCORING_WEIGHTS: Record<RitualType, {
  composite: number;
  lifecycle: number;
  environmental: number;
  synastry: number;
}> = {
  vow: {
    composite: 0.35,    // Composite event score
    lifecycle: 0.25,    // Lifecycle phase alignment
    environmental: 0.20, // Qi Men + Feng Shui
    synastry: 0.20      // Synastry harmony
  },
  healing: {
    composite: 0.25,
    lifecycle: 0.35,    // Lifecycle more important for healing
    environmental: 0.30, // Environment crucial for healing
    synastry: 0.10
  },
  closure: {
    composite: 0.30,
    lifecycle: 0.30,
    environmental: 0.25,
    synastry: 0.15
  },
  initiation: {
    composite: 0.35,
    lifecycle: 0.20,
    environmental: 0.30,
    synastry: 0.15
  }
};

/**
 * Day Officer suitability for each ritual type
 */
const DAY_OFFICER_SUITABILITY: Record<DayOfficer, Record<RitualType, number>> = {
  establish: { vow: 70, healing: 50, closure: 30, initiation: 95 },
  remove: { vow: 40, healing: 80, closure: 90, initiation: 30 },
  full: { vow: 85, healing: 60, closure: 40, initiation: 70 },
  balance: { vow: 75, healing: 85, closure: 50, initiation: 60 },
  stable: { vow: 95, healing: 70, closure: 40, initiation: 50 },
  execute: { vow: 60, healing: 50, closure: 70, initiation: 80 },
  break: { vow: 20, healing: 40, closure: 95, initiation: 20 },
  danger: { vow: 15, healing: 30, closure: 50, initiation: 15 },
  success: { vow: 90, healing: 75, closure: 60, initiation: 85 },
  receive: { vow: 80, healing: 80, closure: 50, initiation: 60 },
  open: { vow: 85, healing: 70, closure: 40, initiation: 95 },
  close: { vow: 30, healing: 50, closure: 85, initiation: 20 }
};

/**
 * Qi Men Door suitability for each ritual type
 */
const QI_MEN_DOOR_SUITABILITY: Record<QiMenDoor, Record<RitualType, number>> = {
  open: { vow: 85, healing: 60, closure: 40, initiation: 95 },
  rest: { vow: 70, healing: 95, closure: 50, initiation: 40 },
  life: { vow: 95, healing: 80, closure: 30, initiation: 90 },
  harm: { vow: 20, healing: 30, closure: 70, initiation: 30 },
  block: { vow: 30, healing: 40, closure: 60, initiation: 20 },
  view: { vow: 75, healing: 70, closure: 50, initiation: 70 },
  death: { vow: 10, healing: 20, closure: 95, initiation: 10 },
  shock: { vow: 25, healing: 35, closure: 45, initiation: 35 }
};

/**
 * Lifecycle phase suitability for each ritual type
 */
const LIFECYCLE_SUITABILITY: Record<LifecyclePhase, Record<RitualType, number>> = {
  awakening: { vow: 60, healing: 40, closure: 20, initiation: 90 },
  deepening: { vow: 95, healing: 60, closure: 30, initiation: 70 },
  challenge: { vow: 30, healing: 85, closure: 50, initiation: 40 },
  turning: { vow: 40, healing: 80, closure: 75, initiation: 50 },
  renewal: { vow: 90, healing: 70, closure: 40, initiation: 85 },
  integration: { vow: 85, healing: 60, closure: 30, initiation: 60 },
  completion: { vow: 50, healing: 50, closure: 95, initiation: 30 }
};

// ============================================================================
// SCORING ADJUSTMENTS
// ============================================================================

/**
 * Get Shen Sha adjustments for a ritual type
 */
function getShenShaAdjustments(
  signals: BaZiTimingSignals,
  ritual: RitualType
): { adjustment: number; factors: RitualFactor[] } {
  let adjustment = 0;
  const factors: RitualFactor[] = [];

  for (const shenSha of signals.shenSha) {
    let impact = 0;

    // Nobleman (贵人)
    if (shenSha.name === 'Nobleman' || shenSha.nameChinese === '贵人') {
      if (ritual === 'vow') impact = 10;
      else if (ritual === 'initiation') impact = 8;
      else if (ritual === 'closure') impact = -5; // Keeps doors open
      else impact = 5;
    }

    // Peach Blossom (桃花)
    if (shenSha.name === 'Peach Blossom' || shenSha.nameChinese === '桃花') {
      if (ritual === 'vow') impact = 12;
      else if (ritual === 'healing') impact = 5;
      else if (ritual === 'closure') impact = -10; // Pulls back emotionally
      else impact = 3;
    }

    // Heavenly Doctor (天医)
    if (shenSha.name === 'Heavenly Doctor' || shenSha.nameChinese === '天医') {
      if (ritual === 'healing') impact = 15;
      else impact = 3;
    }

    // Month/Heaven Virtue (月德/天德)
    if (shenSha.nameChinese === '月德' || shenSha.nameChinese === '天德') {
      if (ritual === 'healing') impact = 10;
      else if (ritual === 'vow') impact = 8;
      else impact = 5;
    }

    // Solitary/Widow Stars (孤辰/寡宿)
    if (shenSha.nameChinese === '孤辰' || shenSha.nameChinese === '寡宿') {
      if (ritual === 'vow') impact = -15;
      else if (ritual === 'closure') impact = 5;
      else impact = -5;
    }

    if (impact !== 0) {
      adjustment += impact;
      factors.push({
        name: shenSha.name,
        nameChinese: shenSha.nameChinese,
        impact,
        description: shenSha.effect
      });
    }
  }

  return { adjustment, factors };
}

/**
 * Get clash/conflict adjustments
 */
function getClashAdjustments(
  signals: BaZiTimingSignals,
  ritual: RitualType
): { adjustment: number; factors: RitualFactor[] } {
  let adjustment = 0;
  const factors: RitualFactor[] = [];

  if (signals.hasClash) {
    const impact = ritual === 'closure' ? 5 : -15;
    adjustment += impact;
    factors.push({
      name: 'Day Clash',
      nameChinese: '冲',
      impact,
      description: `Branch clash ${signals.clashType ? `on ${signals.clashType}` : ''}`
    });
  }

  if (signals.hasHarm) {
    const impact = ritual === 'closure' ? 0 : -10;
    adjustment += impact;
    factors.push({
      name: 'Harm',
      nameChinese: '害',
      impact,
      description: 'Hidden harm relationship active'
    });
  }

  if (signals.hasPunishment) {
    const impact = -12;
    adjustment += impact;
    factors.push({
      name: 'Punishment',
      nameChinese: '刑',
      impact,
      description: 'Punishment formation active'
    });
  }

  if (signals.hasDestruction) {
    const impact = ritual === 'closure' ? 8 : -8;
    adjustment += impact;
    factors.push({
      name: 'Destruction',
      nameChinese: '破',
      impact,
      description: 'Destruction relationship active'
    });
  }

  return { adjustment, factors };
}

/**
 * Get Useful/Annoying God adjustments
 */
function getGodAdjustments(
  signals: BaZiTimingSignals,
  ritual: RitualType
): { adjustment: number; factors: RitualFactor[] } {
  let adjustment = 0;
  const factors: RitualFactor[] = [];

  if (signals.usefulGodActive) {
    const impact = Math.round(signals.usefulGodStrength * 0.2);
    adjustment += impact;
    factors.push({
      name: 'Useful God Active',
      nameChinese: '用神得力',
      impact,
      description: `Useful God strength: ${signals.usefulGodStrength}%`
    });
  }

  if (signals.annoyingGodActive) {
    const impact = -Math.round(signals.annoyingGodStrength * 0.2);
    adjustment += impact;
    factors.push({
      name: 'Annoying God Active',
      nameChinese: '忌神当令',
      impact,
      description: `Annoying God strength: ${signals.annoyingGodStrength}%`
    });
  }

  return { adjustment, factors };
}

/**
 * Get environmental adjustments
 */
function getEnvironmentalAdjustments(
  env: RitualEnvironment,
  ritual: RitualType
): { adjustment: number; factors: RitualFactor[] } {
  let adjustment = 0;
  const factors: RitualFactor[] = [];

  // Qi Men Door
  const doorScore = QI_MEN_DOOR_SUITABILITY[env.qiMen.door][ritual];
  const doorImpact = Math.round((doorScore - 50) / 5);
  adjustment += doorImpact;
  factors.push({
    name: `${env.qiMen.door} Door`,
    nameChinese: QI_MEN_DOOR_CHINESE[env.qiMen.door],
    impact: doorImpact,
    description: `Qi Men ${env.qiMen.door} door in palace ${env.qiMen.palace}`
  });

  // Life Door bonus for vows
  if (env.qiMen.door === 'life' && ritual === 'vow') {
    adjustment += 15;
    factors.push({
      name: 'Life Door Vow Bonus',
      nameChinese: '生门誓约加成',
      impact: 15,
      description: 'Life Door is highly auspicious for vows and commitments'
    });
  }

  // Rest Door bonus for healing
  if (env.qiMen.door === 'rest' && ritual === 'healing') {
    adjustment += 12;
    factors.push({
      name: 'Rest Door Healing Bonus',
      nameChinese: '休门疗愈加成',
      impact: 12,
      description: 'Rest Door supports healing and recuperation'
    });
  }

  // Death Door bonus for closure
  if (env.qiMen.door === 'death' && ritual === 'closure') {
    adjustment += 10;
    factors.push({
      name: 'Death Door Closure Bonus',
      nameChinese: '死门结束加成',
      impact: 10,
      description: 'Death Door supports intentional endings'
    });
  }

  // Open Door bonus for initiation
  if (env.qiMen.door === 'open' && ritual === 'initiation') {
    adjustment += 15;
    factors.push({
      name: 'Open Door Initiation Bonus',
      nameChinese: '开门启动加成',
      impact: 15,
      description: 'Open Door is ideal for new beginnings'
    });
  }

  // Environmental tier
  const tierAdjustments: Record<string, number> = {
    excellent: 10,
    good: 5,
    neutral: 0,
    challenging: -10
  };
  const tierImpact = tierAdjustments[env.environmentalTier] || 0;
  adjustment += tierImpact;
  factors.push({
    name: 'Environmental Conditions',
    nameChinese: '环境条件',
    impact: tierImpact,
    description: `Overall environment: ${env.environmentalTier}`
  });

  return { adjustment, factors };
}

/**
 * Get lifecycle adjustments
 */
function getLifecycleAdjustments(
  lifecycle: LifecycleSignals,
  ritual: RitualType
): { adjustment: number; factors: RitualFactor[] } {
  let adjustment = 0;
  const factors: RitualFactor[] = [];

  // Phase suitability
  const phaseScore = LIFECYCLE_SUITABILITY[lifecycle.currentPhase][ritual];
  const phaseImpact = Math.round((phaseScore - 50) / 5);
  adjustment += phaseImpact;
  factors.push({
    name: `${lifecycle.currentPhase} Phase`,
    nameChinese: LIFECYCLE_CHINESE[lifecycle.currentPhase],
    impact: phaseImpact,
    description: `Current lifecycle phase: ${lifecycle.currentPhase}`
  });

  // Destiny curve direction
  const curveAdjustments: Record<RitualType, Record<string, number>> = {
    vow: { rising: 10, stable: 5, falling: -5, volatile: -10 },
    healing: { rising: 5, stable: 10, falling: 5, volatile: -5 },
    closure: { rising: -5, stable: 0, falling: 10, volatile: 5 },
    initiation: { rising: 15, stable: 5, falling: -10, volatile: -5 }
  };

  const curveImpact = curveAdjustments[ritual][lifecycle.destinyCurveDirection] || 0;
  adjustment += curveImpact;
  factors.push({
    name: 'Destiny Curve',
    nameChinese: '命运曲线',
    impact: curveImpact,
    description: `Destiny curve: ${lifecycle.destinyCurveDirection}`
  });

  return { adjustment, factors };
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Calculate ritual score for a specific ritual type
 */
function calculateRitualScore(
  ritual: RitualType,
  signals?: BaZiTimingSignals,
  environment?: RitualEnvironment,
  lifecycle?: LifecycleSignals,
  synastryScore?: number
): {
  score: number;
  positiveFactors: RitualFactor[];
  negativeFactors: RitualFactor[];
} {
  const weights = SCORING_WEIGHTS[ritual];
  const positiveFactors: RitualFactor[] = [];
  const negativeFactors: RitualFactor[] = [];

  let baseScore = 50; // Start at neutral
  let totalAdjustment = 0;

  // BaZi timing signals
  if (signals) {
    // Day Officer
    const dayOfficerScore = DAY_OFFICER_SUITABILITY[signals.dayOfficer][ritual];
    const dayOfficerImpact = Math.round((dayOfficerScore - 50) * weights.composite);
    totalAdjustment += dayOfficerImpact;

    const dayOfficerFactor: RitualFactor = {
      name: `${signals.dayOfficer} Day`,
      nameChinese: DAY_OFFICER_CHINESE[signals.dayOfficer],
      impact: dayOfficerImpact,
      description: `Day Officer: ${signals.dayOfficer}`
    };
    (dayOfficerImpact >= 0 ? positiveFactors : negativeFactors).push(dayOfficerFactor);

    // Shen Sha
    const shenShaResult = getShenShaAdjustments(signals, ritual);
    totalAdjustment += shenShaResult.adjustment;
    for (const factor of shenShaResult.factors) {
      (factor.impact >= 0 ? positiveFactors : negativeFactors).push(factor);
    }

    // Clashes
    const clashResult = getClashAdjustments(signals, ritual);
    totalAdjustment += clashResult.adjustment;
    for (const factor of clashResult.factors) {
      (factor.impact >= 0 ? positiveFactors : negativeFactors).push(factor);
    }

    // Useful/Annoying God
    const godResult = getGodAdjustments(signals, ritual);
    totalAdjustment += godResult.adjustment;
    for (const factor of godResult.factors) {
      (factor.impact >= 0 ? positiveFactors : negativeFactors).push(factor);
    }
  }

  // Environmental signals
  if (environment) {
    const envResult = getEnvironmentalAdjustments(environment, ritual);
    totalAdjustment += envResult.adjustment * weights.environmental;
    for (const factor of envResult.factors) {
      (factor.impact >= 0 ? positiveFactors : negativeFactors).push(factor);
    }
  }

  // Lifecycle signals
  if (lifecycle) {
    const lifecycleResult = getLifecycleAdjustments(lifecycle, ritual);
    totalAdjustment += lifecycleResult.adjustment * weights.lifecycle;
    for (const factor of lifecycleResult.factors) {
      (factor.impact >= 0 ? positiveFactors : negativeFactors).push(factor);
    }
  }

  // Synastry score (for relationship rituals)
  if (synastryScore !== undefined && synastryScore > 0) {
    const synastryImpact = Math.round((synastryScore - 50) * weights.synastry);
    totalAdjustment += synastryImpact;

    const synastryFactor: RitualFactor = {
      name: 'Synastry Harmony',
      nameChinese: '合盘和谐',
      impact: synastryImpact,
      description: `Synastry score: ${synastryScore}%`
    };
    (synastryImpact >= 0 ? positiveFactors : negativeFactors).push(synastryFactor);
  }

  // Calculate final score
  const score = Math.max(0, Math.min(100, Math.round(baseScore + totalAdjustment)));

  return { score, positiveFactors, negativeFactors };
}

/**
 * Determine ritual tier from score
 */
function scoreTier(score: number): RitualTier {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'neutral';
  return 'avoid';
}

// ============================================================================
// WINDOW GENERATION
// ============================================================================

/**
 * Generate ceremonial notes for a ritual window
 */
function generateCeremonialNotes(
  ritual: RitualType,
  tier: RitualTier,
  environment?: RitualEnvironment,
  lifecycle?: LifecycleSignals
): string {
  const notes: string[] = [];

  // Tier-based opening
  if (tier === 'excellent') {
    notes.push(`This is an auspicious window for ${RITUAL_DESCRIPTIONS[ritual].purpose.toLowerCase()}.`);
  } else if (tier === 'good') {
    notes.push(`A favorable time for ${ritual} rituals.`);
  } else if (tier === 'neutral') {
    notes.push(`Proceed with awareness; conditions are mixed.`);
  } else {
    notes.push(`Consider postponing this ritual to a more favorable time.`);
  }

  // Directional guidance
  if (environment?.fengShui.bestDirection) {
    notes.push(`Face ${environment.fengShui.bestDirection} during the ceremony.`);
  }

  // Qi Men guidance
  if (environment?.qiMen.door) {
    const doorName = QI_MEN_DOOR_CHINESE[environment.qiMen.door];
    notes.push(`Qi Men shows ${doorName} (${environment.qiMen.door} door) in palace ${environment.qiMen.palace}.`);
  }

  // Lifecycle context
  if (lifecycle) {
    const phaseName = LIFECYCLE_CHINESE[lifecycle.currentPhase];
    notes.push(`The relationship is in its ${lifecycle.currentPhase} (${phaseName}) phase.`);
  }

  return notes.join(' ');
}

/**
 * Create a ritual window object
 */
function createRitualWindow(
  ritual: RitualType,
  startDate: string,
  endDate: string,
  signals?: BaZiTimingSignals,
  environment?: RitualEnvironment,
  lifecycle?: LifecycleSignals,
  synastryScore?: number,
  windowIndex: number = 0
): RitualWindow {
  const { score, positiveFactors, negativeFactors } = calculateRitualScore(
    ritual,
    signals,
    environment,
    lifecycle,
    synastryScore
  );

  const tier = scoreTier(score);

  // Generate human-readable reasons
  const reasons: string[] = [];
  if (positiveFactors.length > 0) {
    reasons.push(`Positive: ${positiveFactors.slice(0, 3).map(f => f.name).join(', ')}`);
  }
  if (negativeFactors.length > 0) {
    reasons.push(`Caution: ${negativeFactors.slice(0, 2).map(f => f.name).join(', ')}`);
  }

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.round(durationMs / (1000 * 60 * 60));
  const duration = durationHours < 24 ? `${durationHours} hours` :
                   durationHours < 48 ? '1 day' :
                   `${Math.round(durationHours / 24)} days`;

  return {
    id: `${ritual}_window_${windowIndex}`,
    ritual,
    ritualChinese: RITUAL_CHINESE[ritual],
    start: startDate,
    end: endDate,
    duration,
    score,
    tier,
    tierChinese: RITUAL_TIER_CHINESE[tier],
    positiveFactors,
    negativeFactors,
    reasons,
    bestDirection: environment?.fengShui.bestDirection || 'East',
    bestDirectionChinese: environment?.fengShui.bestDirectionChinese || '东',
    avoidDirection: environment?.fengShui.avoidDirection,
    qiMenDoor: environment?.qiMen.door || 'open',
    qiMenDoorChinese: QI_MEN_DOOR_CHINESE[environment?.qiMen.door || 'open'],
    qiMenPalace: environment?.qiMen.palace || 1,
    ceremonialNotes: generateCeremonialNotes(ritual, tier, environment, lifecycle)
  };
}

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

/**
 * Generate ritual timing windows for a date range
 */
export function generateRitualTiming(input: RitualEngineInput): RitualTimingResult {
  const {
    startDate,
    endDate,
    ritualTypes = ['vow', 'healing', 'closure', 'initiation'],
    baZiSignals,
    environment,
    lifecycle,
    synastryScore,
    options = {}
  } = input;

  const { minimumScore = 0, maxWindows = 10 } = options;

  // Generate windows for each ritual type
  const vowWindows: RitualWindow[] = [];
  const healingWindows: RitualWindow[] = [];
  const closureWindows: RitualWindow[] = [];
  const initiationWindows: RitualWindow[] = [];

  const dailySummaries: DailyRitualSummary[] = [];

  // Iterate through each day in the range
  const start = new Date(startDate);
  const end = new Date(endDate);
  let dayIndex = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateStr = nextDay.toISOString().split('T')[0];

    // Calculate scores for each ritual type
    const scores: Record<RitualType, number> = {
      vow: 0,
      healing: 0,
      closure: 0,
      initiation: 0
    };

    for (const ritual of ritualTypes) {
      const window = createRitualWindow(
        ritual,
        dateStr,
        nextDateStr,
        baZiSignals,
        environment,
        lifecycle,
        synastryScore,
        dayIndex
      );

      scores[ritual] = window.score;

      if (window.score >= minimumScore) {
        switch (ritual) {
          case 'vow':
            if (vowWindows.length < maxWindows) vowWindows.push(window);
            break;
          case 'healing':
            if (healingWindows.length < maxWindows) healingWindows.push(window);
            break;
          case 'closure':
            if (closureWindows.length < maxWindows) closureWindows.push(window);
            break;
          case 'initiation':
            if (initiationWindows.length < maxWindows) initiationWindows.push(window);
            break;
        }
      }
    }

    // Determine best ritual for this day
    const maxScore = Math.max(...Object.values(scores));
    const recommendedRitual = maxScore >= 60 ?
      (Object.entries(scores).find(([_, s]) => s === maxScore)?.[0] as RitualType) : null;

    // Create daily summary
    dailySummaries.push({
      date: dateStr,
      dateChinese: formatDateChinese(d),
      recommendedRitual,
      recommendedScore: maxScore,
      scores,
      dayQuality: scoreTier(maxScore),
      keyFactors: getKeyFactorsForDay(baZiSignals, environment)
    });

    dayIndex++;
  }

  // Find best windows for each ritual type
  const findBest = (windows: RitualWindow[]): RitualWindow | null =>
    windows.reduce<RitualWindow | null>((best, w) =>
      !best || w.score > best.score ? w : best, null);

  return {
    queryDate: new Date().toISOString(),
    queryRange: { start: startDate, end: endDate },
    vowWindows: vowWindows.sort((a, b) => b.score - a.score).slice(0, maxWindows),
    healingWindows: healingWindows.sort((a, b) => b.score - a.score).slice(0, maxWindows),
    closureWindows: closureWindows.sort((a, b) => b.score - a.score).slice(0, maxWindows),
    initiationWindows: initiationWindows.sort((a, b) => b.score - a.score).slice(0, maxWindows),
    bestVow: findBest(vowWindows),
    bestHealing: findBest(healingWindows),
    bestClosure: findBest(closureWindows),
    bestInitiation: findBest(initiationWindows),
    dailySummaries,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date in Chinese
 */
function formatDateChinese(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * Get key factors for a day
 */
function getKeyFactorsForDay(
  signals?: BaZiTimingSignals,
  environment?: RitualEnvironment
): string[] {
  const factors: string[] = [];

  if (signals) {
    factors.push(`${DAY_OFFICER_CHINESE[signals.dayOfficer]}日`);
    if (signals.usefulGodActive) factors.push('用神得力');
    if (signals.annoyingGodActive) factors.push('忌神当令');
    if (signals.hasClash) factors.push('有冲');
  }

  if (environment) {
    factors.push(QI_MEN_DOOR_CHINESE[environment.qiMen.door]);
  }

  return factors;
}

// ============================================================================
// CALENDAR GENERATION
// ============================================================================

/**
 * Generate a ritual calendar for a month
 */
export function generateRitualCalendar(
  year: number,
  month: number,
  baZiSignals?: BaZiTimingSignals,
  environment?: RitualEnvironment,
  lifecycle?: LifecycleSignals
): RitualCalendarMonth {
  const days: RitualCalendarDay[] = [];
  const bestDays = {
    vow: [] as string[],
    healing: [] as string[],
    closure: [] as string[],
    initiation: [] as string[]
  };
  const avoidDays: string[] = [];

  // Get days in month
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateStr = date.toISOString().split('T')[0];

    // Calculate scores
    const scores: Record<RitualType, number> = {
      vow: 0,
      healing: 0,
      closure: 0,
      initiation: 0
    };

    for (const ritual of ['vow', 'healing', 'closure', 'initiation'] as RitualType[]) {
      const { score } = calculateRitualScore(ritual, baZiSignals, environment, lifecycle);
      scores[ritual] = score;

      if (score >= 80) {
        bestDays[ritual].push(dateStr);
      }
    }

    const maxScore = Math.max(...Object.values(scores));
    const recommended = maxScore >= 60 ?
      (Object.entries(scores).find(([_, s]) => s === maxScore)?.[0] as RitualType) : null;
    const quality = scoreTier(maxScore);

    if (quality === 'avoid') {
      avoidDays.push(dateStr);
    }

    days.push({
      date: dateStr,
      dateChinese: formatDateChinese(date),
      dayOfficer: baZiSignals?.dayOfficer || 'balance',
      dayOfficerChinese: DAY_OFFICER_CHINESE[baZiSignals?.dayOfficer || 'balance'],
      ritualScores: scores,
      recommended,
      quality,
      note: recommended ?
        `Best for ${RITUAL_CHINESE[recommended]} (${recommended})` :
        'Mixed conditions'
    });
  }

  const monthNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  return {
    year,
    month,
    monthChinese: `${monthNames[month - 1]}月`,
    days,
    bestDays,
    avoidDays
  };
}

// ============================================================================
// VISUALIZATION DATA
// ============================================================================

/**
 * Generate ritual compass data
 */
export function generateRitualCompassData(
  date: string,
  environment?: RitualEnvironment
): RitualCompassData {
  const directions = [
    { direction: 'N', directionChinese: '北', degree: 0 },
    { direction: 'NE', directionChinese: '东北', degree: 45 },
    { direction: 'E', directionChinese: '东', degree: 90 },
    { direction: 'SE', directionChinese: '东南', degree: 135 },
    { direction: 'S', directionChinese: '南', degree: 180 },
    { direction: 'SW', directionChinese: '西南', degree: 225 },
    { direction: 'W', directionChinese: '西', degree: 270 },
    { direction: 'NW', directionChinese: '西北', degree: 315 }
  ];

  return {
    currentDate: date,
    recommendedRitual: null, // Would be calculated from full context
    directions: directions.map(d => ({
      ...d,
      ritualSuitability: {
        vow: d.direction === environment?.fengShui.bestDirection ? 'excellent' : 'neutral',
        healing: d.direction === 'N' ? 'good' : 'neutral',
        closure: d.direction === environment?.fengShui.avoidDirection ? 'avoid' : 'neutral',
        initiation: d.direction === 'E' || d.direction === 'SE' ? 'good' : 'neutral'
      },
      specialEnergies: []
    })),
    qiMenPalaces: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(palace => ({
      palace,
      door: environment?.qiMen.door || 'open',
      doorChinese: QI_MEN_DOOR_CHINESE[environment?.qiMen.door || 'open'],
      ritualAffinity: palace === 1 ? ['initiation', 'vow'] :
                      palace === 6 ? ['closure'] :
                      palace === 4 ? ['healing'] : []
    }))
  };
}

/**
 * Generate ritual card data for UI
 */
export function generateRitualCardData(
  ritual: RitualType,
  windows: RitualWindow[],
  scoreHistory: Array<{ date: string; score: number }> = []
): RitualCardData {
  const now = new Date().toISOString();
  const currentWindow = windows.find(w => w.start <= now && w.end >= now) || null;
  const nextWindow = windows.find(w => w.start > now) || null;

  return {
    ritual,
    ritualChinese: RITUAL_CHINESE[ritual],
    description: RITUAL_DESCRIPTIONS[ritual].purpose,
    currentWindow,
    nextWindow,
    scoreHistory,
    ceremonialGuidance: {
      bestDirection: currentWindow?.bestDirection || nextWindow?.bestDirection || 'East',
      bestTime: nextWindow ? `${nextWindow.start.split('T')[0]}` : 'Calculating...',
      ritualElements: RITUAL_DESCRIPTIONS[ritual].keywords.slice(0, 4),
      avoidances: currentWindow?.negativeFactors.map(f => f.name).slice(0, 3) || []
    },
    storyNote: currentWindow?.storyAlignment?.narrativeNote
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  RITUAL_CHINESE,
  RITUAL_TIER_CHINESE,
  DAY_OFFICER_CHINESE,
  QI_MEN_DOOR_CHINESE,
  LIFECYCLE_CHINESE,
  RITUAL_DESCRIPTIONS,
  calculateRitualScore,
  scoreTier
};
