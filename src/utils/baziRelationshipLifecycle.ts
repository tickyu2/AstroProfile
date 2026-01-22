/**
 * ============================================================================
 * BAZI RELATIONSHIP LIFECYCLE MODEL (关系生命周期)
 * ============================================================================
 *
 * The evolutionary arc engine — where relationships become temporal, narrative,
 * and alive. This module maps relationships through seven classical phases,
 * each with its own purpose, challenge, gift, and timing window.
 *
 * Seven Phases of the Relationship Lifecycle:
 * 1. Initiation (相识期) - Attraction, curiosity, resonance
 * 2. Fusion (融合期) - Emotional bonding, intensity, merging
 * 3. Stabilization (稳固期) - Structure, routine, shared rhythm
 * 4. Expansion (扩展期) - Growth, creativity, shared projects
 * 5. Challenge (挑战期) - Tension, misalignment, karmic activation
 * 6. Recalibration (校准期) - Healing, repair, re-alignment
 * 7. Maturation (成熟期) - Wisdom, stability, long-term alignment
 *
 * Each phase is derived from:
 * - Composite chart analysis
 * - Composite Useful God
 * - Composite Ten Gods
 * - Composite Shen Sha
 * - Synastry resonance
 * - Composite timing
 * - Event triggers
 * - Destiny trajectory curves
 *
 * Based on: Classical 命理 relationship dynamics
 * Aligned with: Joey Yap relationship framework
 * Created: January 2026
 * ============================================================================
 */

import type {
  CompositeChart,
  CompositeDayMaster,
  CompositeUsefulGod,
  CompositeShenSha,
  CompositeLuckPillar
} from './baziCompositeChart';

import type { SynastryHeatmap } from './baziSynastryHeatmap';
import type { TrajectoryCurve, PeakValley } from './baziTrajectory';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';

/**
 * The seven relationship lifecycle phases
 */
export type LifecyclePhase =
  | 'initiation'
  | 'fusion'
  | 'stabilization'
  | 'expansion'
  | 'challenge'
  | 'recalibration'
  | 'maturation';

/**
 * Phase definition with metadata
 */
export interface PhaseDefinition {
  id: LifecyclePhase;
  name: string;
  chineseName: string;
  theme: string;
  purpose: string;
  challenge: string;
  gift: string;
  triggerPatterns: string[];
  compositeActivations: string[];
  elementalAffinity: ElementName[];
  duration: string;
  advice: string;
}

/**
 * Phase score result
 */
export interface PhaseScore {
  phase: LifecyclePhase;
  score: number;
  matchFactors: string[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Timeline entry for phase projection
 */
export interface PhaseTimelineEntry {
  year: number;
  phase: LifecyclePhase;
  phaseChinese: string;
  score: number;
  triggers: string[];
  narrative: string;
}

/**
 * Phase transition
 */
export interface PhaseTransition {
  fromPhase: LifecyclePhase;
  toPhase: LifecyclePhase;
  transitionYear: number;
  transitionTrigger: string;
  guidance: string;
}

/**
 * Complete lifecycle result
 */
export interface RelationshipLifecycleResult {
  currentPhase: PhaseDefinition;
  currentPhaseScore: number;
  currentPhaseMatchFactors: string[];
  allPhaseScores: PhaseScore[];
  upcomingPhase: PhaseDefinition | null;
  upcomingPhaseYear: number | null;
  longTermPhase: PhaseDefinition | null;
  timeline: PhaseTimelineEntry[];
  transitions: PhaseTransition[];
  lifecycleNarrative: string;
  evolutionaryArc: string;
  currentAdvice: string[];
  futureOutlook: string;
}

/**
 * Timing context for lifecycle computation
 */
export interface LifecycleTimingContext {
  currentYear: number;
  relationshipStartYear?: number;
  currentLuckPillar?: CompositeLuckPillar;
  annualElement?: ElementName;
}

/**
 * Trajectory context for lifecycle computation
 */
export interface TrajectoryContext {
  overallCurve?: TrajectoryCurve;
  relationshipCurve?: TrajectoryCurve;
  peaks?: PeakValley[];
  valleys?: PeakValley[];
  currentSlope?: number;
}

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

/**
 * Complete definitions for all seven lifecycle phases
 */
export const LIFECYCLE_PHASES: Record<LifecyclePhase, PhaseDefinition> = {
  initiation: {
    id: 'initiation',
    name: 'Initiation',
    chineseName: '相识期',
    theme: 'Attraction, curiosity, resonance',
    purpose: 'Opening the field of connection',
    challenge: 'Idealization and projection',
    gift: 'Fresh energy and possibility',
    triggerPatterns: ['peach_blossom', 'red_matchmaker', 'sky_happiness', 'day_branch_harmony'],
    compositeActivations: ['Day Branch harmonies', 'Fire activation', 'Output stars'],
    elementalAffinity: ['Fire', 'Wood'],
    duration: 'Typically 6 months to 2 years',
    advice: 'Enjoy the magic while staying grounded. Notice what draws you together beyond chemistry.'
  },

  fusion: {
    id: 'fusion',
    name: 'Fusion',
    chineseName: '融合期',
    theme: 'Emotional bonding, intensity, merging',
    purpose: 'Creating shared emotional identity',
    challenge: 'Losing individual boundaries',
    gift: 'Deep intimacy and connection',
    triggerPatterns: ['day_day_harmony', 'day_month_harmony', 'strong_synastry', 'fire_activation'],
    compositeActivations: ['Output stars', 'Fire Useful God', 'Day Master strength'],
    elementalAffinity: ['Fire', 'Water'],
    duration: 'Typically 1 to 3 years',
    advice: 'Allow deep connection while maintaining your individual essence. The goal is union, not dissolution.'
  },

  stabilization: {
    id: 'stabilization',
    name: 'Stabilization',
    chineseName: '稳固期',
    theme: 'Structure, routine, shared rhythm',
    purpose: 'Building the foundation',
    challenge: 'Routine becoming stagnation',
    gift: 'Security and predictability',
    triggerPatterns: ['month_pillar_harmony', 'earth_activation', 'resource_stars'],
    compositeActivations: ['Earth Useful God', 'Resource stars', 'Month harmonies'],
    elementalAffinity: ['Earth', 'Metal'],
    duration: 'Typically 2 to 5 years',
    advice: 'Build structure without rigidity. Create rhythms that support both partners\' growth.'
  },

  expansion: {
    id: 'expansion',
    name: 'Expansion',
    chineseName: '扩展期',
    theme: 'Growth, creativity, shared projects',
    purpose: 'Building a life together',
    challenge: 'Overextension and burnout',
    gift: 'Shared accomplishment and legacy',
    triggerPatterns: ['wealth_stars', 'output_stars', 'wood_fire_activation', 'nobleman'],
    compositeActivations: ['Wood activation', 'Fire activation', 'Wealth stars', 'Output stars'],
    elementalAffinity: ['Wood', 'Fire'],
    duration: 'Typically 3 to 7 years',
    advice: 'Channel creative energy into meaningful projects. Grow together without losing connection.'
  },

  challenge: {
    id: 'challenge',
    name: 'Challenge',
    chineseName: '挑战期',
    theme: 'Tension, misalignment, karmic activation',
    purpose: 'Shadow integration and growth',
    challenge: 'Destructive conflict patterns',
    gift: 'Transformation and deepening',
    triggerPatterns: ['clash', 'harm', 'punishment', 'annoying_god', 'day_branch_clash'],
    compositeActivations: ['Annoying God activation', 'Conflict triggers', 'Metal-Wood clash'],
    elementalAffinity: ['Metal', 'Fire'],
    duration: 'Typically 1 to 3 years',
    advice: 'Face difficulties as teachers. This is where the relationship deepens or fractures.'
  },

  recalibration: {
    id: 'recalibration',
    name: 'Recalibration',
    chineseName: '校准期',
    theme: 'Healing, repair, re-alignment',
    purpose: 'Rebalancing the bond',
    challenge: 'Incomplete healing',
    gift: 'Renewed commitment and understanding',
    triggerPatterns: ['nobleman', 'virtue_star', 'water_activation', 'metal_activation'],
    compositeActivations: ['Water Useful God', 'Metal activation', 'Nobleman support'],
    elementalAffinity: ['Water', 'Metal'],
    duration: 'Typically 1 to 2 years',
    advice: 'Allow space for reflection and repair. Old patterns must be released for new ones to form.'
  },

  maturation: {
    id: 'maturation',
    name: 'Maturation',
    chineseName: '成熟期',
    theme: 'Wisdom, stability, long-term alignment',
    purpose: 'Deep partnership and shared wisdom',
    challenge: 'Complacency',
    gift: 'Enduring love and mutual support',
    triggerPatterns: ['balanced_elements', 'luck_pillar_peak', 'stable_trajectory'],
    compositeActivations: ['Balanced elements', 'Resource stars', 'Long-term harmony'],
    elementalAffinity: ['Earth', 'Water'],
    duration: 'Ongoing with continued cultivation',
    advice: 'Keep growing together. Maturity is not the end — it\'s the foundation for continued evolution.'
  }
};

/**
 * Chinese element names
 */
export const ELEMENT_CHINESE: Record<ElementName, string> = {
  Wood: '木',
  Fire: '火',
  Earth: '土',
  Metal: '金',
  Water: '水'
};

// ============================================================================
// PHASE SCORING FUNCTIONS
// ============================================================================

/**
 * Score the Initiation phase
 */
export function scoreInitiationPhase(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check for Peach Blossom / Red Matchmaker Shen Sha
  if (composite.shenSha) {
    const romanticshenSha = composite.shenSha.filter(s =>
      s.name === 'Peach Blossom' || s.name === 'Red Matchmaker' || s.name === 'Sky Happiness'
    );
    if (romanticshenSha.length > 0) {
      score += 25;
      matchFactors.push(`Romantic Shen Sha active: ${romanticshenSha.map(s => s.chineseName).join(', ')}`);
    }
  }

  // Check synastry romance hotspots
  if (synastry && synastry.romanceHotspots && synastry.romanceHotspots.length > 0) {
    score += 20;
    matchFactors.push('Strong romantic synastry hotspots');
  }

  // Check for Fire/Wood activation
  if (composite.elementDistribution) {
    const fireWood = (composite.elementDistribution.Fire || 0) + (composite.elementDistribution.Wood || 0);
    if (fireWood >= 45) {
      score += 15;
      matchFactors.push('Fire-Wood elemental activation');
    }
  }

  // Check relationship duration (early = higher initiation score)
  if (timing?.relationshipStartYear && timing?.currentYear) {
    const years = timing.currentYear - timing.relationshipStartYear;
    if (years <= 2) {
      score += 20;
      matchFactors.push('Early relationship stage');
    } else if (years <= 5) {
      score += 10;
      matchFactors.push('Young relationship');
    }
  }

  // Day Branch harmony check
  if (composite.dayPillar?.branch) {
    const dayBranch = composite.dayPillar.branch;
    const romanticBranches = ['卯', '午', '酉', '子']; // Peach Blossom branches
    if (romanticBranches.includes(dayBranch)) {
      score += 10;
      matchFactors.push('Day Branch carries romantic energy');
    }
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'initiation',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

/**
 * Score the Fusion phase
 */
export function scoreFusionPhase(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  _timing?: LifecycleTimingContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check synastry Day-Day and Day-Month harmony
  if (synastry) {
    if (synastry.overallScore >= 70) {
      score += 25;
      matchFactors.push('Strong overall synastry indicates deep connection');
    }

    // Check for Day pillar harmonies in grid
    if (synastry.grid) {
      const dayDayCell = synastry.grid[2]?.[2]; // Day-Day
      const dayMonthCell = synastry.grid[2]?.[1]; // Day-Month

      if (dayDayCell && dayDayCell.totalScore > 0) {
        score += 15;
        matchFactors.push('Day-Day harmony supports emotional bonding');
      }
      if (dayMonthCell && dayMonthCell.totalScore > 0) {
        score += 10;
        matchFactors.push('Day-Month harmony deepens connection');
      }
    }
  }

  // Check Fire activation
  if (composite.elementDistribution?.Fire && composite.elementDistribution.Fire >= 25) {
    score += 15;
    matchFactors.push('Fire element activation — intensity and passion');
  }

  // Check Output stars (Eating God, Hurting Officer)
  if (composite.tenGods) {
    const hasEatingGod = composite.tenGods.eatingGod !== null;
    const hasHurtingOfficer = composite.tenGods.hurtingOfficer !== null;
    if (hasEatingGod && hasHurtingOfficer) {
      score += 15;
      matchFactors.push('Output stars active — emotional expression');
    } else if (hasEatingGod || hasHurtingOfficer) {
      score += 10;
      matchFactors.push('Output star present — emotional expression');
    }
  }

  // Check Day Master strength
  if (composite.dayMaster?.strengthScore && composite.dayMaster.strengthScore >= 50) {
    score += 10;
    matchFactors.push('Strong composite Day Master — solid emotional core');
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'fusion',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

/**
 * Score the Stabilization phase
 */
export function scoreStabilizationPhase(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check Earth activation
  if (composite.elementDistribution?.Earth && composite.elementDistribution.Earth >= 20) {
    score += 20;
    matchFactors.push('Earth element provides stability');
  }

  // Check for Earth Useful God
  if (composite.usefulGod?.element === 'Earth') {
    score += 20;
    matchFactors.push('Earth is the Useful God — grounding is favored');
  }

  // Check Resource stars (Direct Resource, Indirect Resource)
  if (composite.tenGods) {
    const hasDirectResource = composite.tenGods.directResource !== null;
    const hasIndirectResource = composite.tenGods.indirectResource !== null;
    if (hasDirectResource && hasIndirectResource) {
      score += 15;
      matchFactors.push('Resource stars support nurturing and support');
    } else if (hasDirectResource || hasIndirectResource) {
      score += 10;
      matchFactors.push('Resource star present — nurturing energy');
    }
  }

  // Check Month Pillar harmony
  if (synastry?.grid) {
    const monthMonthCell = synastry.grid[1]?.[1]; // Month-Month
    if (monthMonthCell && monthMonthCell.totalScore > 0) {
      score += 15;
      matchFactors.push('Month-Month harmony — shared rhythms');
    }
  }

  // Check relationship duration (middle stage)
  if (timing?.relationshipStartYear && timing?.currentYear) {
    const years = timing.currentYear - timing.relationshipStartYear;
    if (years >= 3 && years <= 7) {
      score += 15;
      matchFactors.push('Relationship in stabilization window');
    }
  }

  // Check for Metal activation (structure)
  if (composite.elementDistribution?.Metal && composite.elementDistribution.Metal >= 20) {
    score += 10;
    matchFactors.push('Metal element adds structure');
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'stabilization',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

/**
 * Score the Expansion phase
 */
export function scoreExpansionPhase(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check Wood-Fire activation
  if (composite.elementDistribution) {
    const woodFire = (composite.elementDistribution.Wood || 0) + (composite.elementDistribution.Fire || 0);
    if (woodFire >= 45) {
      score += 20;
      matchFactors.push('Wood-Fire activation — growth and creativity');
    }
  }

  // Check Wealth stars
  if (composite.tenGods) {
    const hasDirectWealth = composite.tenGods.directWealth !== null;
    const hasIndirectWealth = composite.tenGods.indirectWealth !== null;
    if (hasDirectWealth || hasIndirectWealth) {
      score += 15;
      matchFactors.push('Wealth stars active — material expansion');
    }

    // Check Output stars for creativity
    const hasEatingGod = composite.tenGods.eatingGod !== null;
    const hasHurtingOfficer = composite.tenGods.hurtingOfficer !== null;
    if (hasEatingGod || hasHurtingOfficer) {
      score += 15;
      matchFactors.push('Output stars support creative projects');
    }
  }

  // Check for Nobleman Shen Sha
  if (composite.shenSha) {
    const nobleman = composite.shenSha.find(s => s.name === 'Heavenly Nobleman');
    if (nobleman) {
      score += 15;
      matchFactors.push('Nobleman brings helpers and opportunities');
    }
  }

  // Check luck pillar favorability
  if (timing?.currentLuckPillar?.favorability === 'excellent' ||
      timing?.currentLuckPillar?.favorability === 'good') {
    score += 15;
    matchFactors.push('Favorable luck pillar supports expansion');
  }

  // Check synastry for growth patterns
  if (synastry && synastry.overallScore >= 60) {
    score += 10;
    matchFactors.push('Strong synastry supports shared growth');
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'expansion',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

/**
 * Score the Challenge phase
 */
export function scoreChallengePhase(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check for conflict Shen Sha
  if (composite.shenSha) {
    const conflictShensha = composite.shenSha.filter(s =>
      s.nature === 'inauspicious'
    );
    if (conflictShensha.length > 0) {
      score += 20;
      matchFactors.push(`Challenging Shen Sha: ${conflictShensha.map(s => s.chineseName).join(', ')}`);
    }
  }

  // Check synastry tension
  if (synastry) {
    // Check for clashes in grid
    if (synastry.grid) {
      let clashCount = 0;
      for (const row of synastry.grid) {
        for (const cell of row) {
          if (cell.interactions) {
            clashCount += cell.interactions.filter(i =>
              i.type === 'clash' || i.type === 'punishment' || i.type === 'harm'
            ).length;
          }
        }
      }
      if (clashCount >= 2) {
        score += 25;
        matchFactors.push(`Multiple conflict patterns (${clashCount} clashes/harms)`);
      }
    }
  }

  // Check for Avoid Elements activation (elements that destabilize)
  if (composite.usefulGod?.avoidElements && timing?.annualElement) {
    if (composite.usefulGod.avoidElements.includes(timing.annualElement)) {
      score += 20;
      matchFactors.push('Destabilizing element activated by current timing');
    }
  }

  // Check Metal-Fire clash pattern
  if (composite.elementDistribution) {
    const metal = composite.elementDistribution.Metal || 0;
    const fire = composite.elementDistribution.Fire || 0;
    if (metal >= 25 && fire >= 25) {
      score += 15;
      matchFactors.push('Metal-Fire tension — structural vs passionate');
    }
  }

  // Check luck pillar difficulty
  if (timing?.currentLuckPillar?.favorability === 'challenging' ||
      timing?.currentLuckPillar?.favorability === 'difficult') {
    score += 15;
    matchFactors.push('Challenging luck pillar period');
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'challenge',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

/**
 * Score the Recalibration phase
 */
export function scoreRecalibrationPhase(
  composite: CompositeChart,
  _synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check Water activation (reflection, healing)
  if (composite.elementDistribution?.Water && composite.elementDistribution.Water >= 20) {
    score += 20;
    matchFactors.push('Water element supports reflection and healing');
  }

  // Check Metal activation (refinement)
  if (composite.elementDistribution?.Metal && composite.elementDistribution.Metal >= 20) {
    score += 15;
    matchFactors.push('Metal element supports refinement');
  }

  // Check for Water or Metal Useful God
  if (composite.usefulGod?.element === 'Water' || composite.usefulGod?.element === 'Metal') {
    score += 20;
    matchFactors.push(`${composite.usefulGod.element} Useful God favors recalibration`);
  }

  // Check for Nobleman Shen Sha (helpers in healing)
  if (composite.shenSha) {
    const nobleman = composite.shenSha.find(s => s.name === 'Heavenly Nobleman');
    if (nobleman) {
      score += 15;
      matchFactors.push('Nobleman brings support for healing');
    }
  }

  // Check timing for recalibration windows
  if (timing?.annualElement === 'Water' || timing?.annualElement === 'Metal') {
    score += 15;
    matchFactors.push(`${timing.annualElement} year supports recalibration`);
  }

  // Check Resource stars for support
  if (composite.tenGods) {
    const hasDirectResource = composite.tenGods.directResource !== null;
    const hasIndirectResource = composite.tenGods.indirectResource !== null;
    if (hasDirectResource || hasIndirectResource) {
      score += 10;
      matchFactors.push('Resource stars provide nurturing support');
    }
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'recalibration',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

/**
 * Score the Maturation phase
 */
export function scoreMaturationPhase(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext,
  trajectory?: TrajectoryContext
): PhaseScore {
  let score = 0;
  const matchFactors: string[] = [];

  // Check elemental balance
  if (composite.elementDistribution) {
    const values = [
      composite.elementDistribution.Wood || 0,
      composite.elementDistribution.Fire || 0,
      composite.elementDistribution.Earth || 0,
      composite.elementDistribution.Metal || 0,
      composite.elementDistribution.Water || 0
    ];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;

    if (range <= 15) {
      score += 25;
      matchFactors.push('Balanced elements — mature harmony');
    } else if (range <= 25) {
      score += 15;
      matchFactors.push('Relatively balanced elements');
    }
  }

  // Check relationship duration (long-term)
  if (timing?.relationshipStartYear && timing?.currentYear) {
    const years = timing.currentYear - timing.relationshipStartYear;
    if (years >= 10) {
      score += 25;
      matchFactors.push('Long-term relationship — maturation territory');
    } else if (years >= 7) {
      score += 15;
      matchFactors.push('Established relationship');
    }
  }

  // Check luck pillar stability
  if (timing?.currentLuckPillar?.favorability === 'good' ||
      timing?.currentLuckPillar?.favorability === 'neutral' ||
      timing?.currentLuckPillar?.favorability === 'excellent') {
    score += 15;
    matchFactors.push('Stable luck pillar supports maturation');
  }

  // Check trajectory for stable plateau
  if (trajectory?.currentSlope !== undefined) {
    if (Math.abs(trajectory.currentSlope) < 2) {
      score += 15;
      matchFactors.push('Trajectory curve shows stability');
    }
  }

  // Check synastry stability
  if (synastry && synastry.overallScore >= 50) {
    score += 10;
    matchFactors.push('Solid synastry foundation');
  }

  // Check for Earth-Water balance (wisdom + stability)
  if (composite.elementDistribution) {
    const earthWater = (composite.elementDistribution.Earth || 0) + (composite.elementDistribution.Water || 0);
    if (earthWater >= 40) {
      score += 10;
      matchFactors.push('Earth-Water combination — grounded wisdom');
    }
  }

  const confidence = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    phase: 'maturation',
    score: Math.min(100, score),
    matchFactors,
    confidence
  };
}

// ============================================================================
// MAIN LIFECYCLE COMPUTATION
// ============================================================================

/**
 * Compute the complete relationship lifecycle
 */
export function computeRelationshipLifecycle(
  composite: CompositeChart,
  synastry?: SynastryHeatmap,
  timing?: LifecycleTimingContext,
  trajectory?: TrajectoryContext
): RelationshipLifecycleResult {
  // Score all phases
  const phaseScores: PhaseScore[] = [
    scoreInitiationPhase(composite, synastry, timing),
    scoreFusionPhase(composite, synastry, timing),
    scoreStabilizationPhase(composite, synastry, timing),
    scoreExpansionPhase(composite, synastry, timing),
    scoreChallengePhase(composite, synastry, timing),
    scoreRecalibrationPhase(composite, synastry, timing),
    scoreMaturationPhase(composite, synastry, timing, trajectory)
  ];

  // Sort by score to find current phase
  const sortedScores = [...phaseScores].sort((a, b) => b.score - a.score);
  const currentPhaseId = sortedScores[0].phase;
  const currentPhaseScore = sortedScores[0].score;
  const currentPhaseMatchFactors = sortedScores[0].matchFactors;
  const currentPhase = LIFECYCLE_PHASES[currentPhaseId];

  // Determine upcoming phase based on natural progression and timing
  const { upcomingPhase, upcomingPhaseYear } = determineUpcomingPhase(
    currentPhaseId,
    sortedScores,
    timing,
    trajectory
  );

  // Determine long-term phase
  const longTermPhase = determineLongTermPhase(composite, timing, trajectory);

  // Build timeline projection
  const timeline = buildPhaseTimeline(
    currentPhaseId,
    composite,
    timing,
    trajectory
  );

  // Identify transitions
  const transitions = identifyTransitions(timeline);

  // Build narratives
  const lifecycleNarrative = buildLifecycleNarrative(
    currentPhase,
    currentPhaseScore,
    currentPhaseMatchFactors,
    upcomingPhase,
    upcomingPhaseYear
  );

  const evolutionaryArc = buildEvolutionaryArc(timeline, transitions);

  // Build current advice
  const currentAdvice = buildCurrentAdvice(currentPhase, sortedScores);

  // Build future outlook
  const futureOutlook = buildFutureOutlook(upcomingPhase, longTermPhase, transitions);

  return {
    currentPhase,
    currentPhaseScore,
    currentPhaseMatchFactors,
    allPhaseScores: phaseScores,
    upcomingPhase,
    upcomingPhaseYear,
    longTermPhase,
    timeline,
    transitions,
    lifecycleNarrative,
    evolutionaryArc,
    currentAdvice,
    futureOutlook
  };
}

/**
 * Determine the upcoming phase
 */
export function determineUpcomingPhase(
  currentPhase: LifecyclePhase,
  sortedScores: PhaseScore[],
  timing?: LifecycleTimingContext,
  trajectory?: TrajectoryContext
): { upcomingPhase: PhaseDefinition | null; upcomingPhaseYear: number | null } {
  // Natural progression map
  const naturalProgression: Record<LifecyclePhase, LifecyclePhase[]> = {
    initiation: ['fusion', 'stabilization'],
    fusion: ['stabilization', 'expansion'],
    stabilization: ['expansion', 'maturation'],
    expansion: ['challenge', 'maturation'],
    challenge: ['recalibration', 'stabilization'],
    recalibration: ['expansion', 'maturation'],
    maturation: ['challenge', 'expansion'] // Cycle continues
  };

  const possibleNext = naturalProgression[currentPhase];

  // Find the highest-scoring next phase
  let upcomingPhaseId: LifecyclePhase | null = null;
  let upcomingScore = 0;

  for (const phaseId of possibleNext) {
    const scoreEntry = sortedScores.find(s => s.phase === phaseId);
    if (scoreEntry && scoreEntry.score > upcomingScore) {
      upcomingScore = scoreEntry.score;
      upcomingPhaseId = phaseId;
    }
  }

  // Check trajectory for dips/peaks that might indicate challenge
  if (trajectory?.valleys && trajectory.valleys.length > 0) {
    const nearestValley = trajectory.valleys[0];
    const currentYear = timing?.currentYear || new Date().getFullYear();
    if (nearestValley.t > currentYear && nearestValley.t <= currentYear + 5) {
      // Challenge phase likely coming
      if (sortedScores.find(s => s.phase === 'challenge')?.score || 0 > 30) {
        upcomingPhaseId = 'challenge';
      }
    }
  }

  if (!upcomingPhaseId) return { upcomingPhase: null, upcomingPhaseYear: null };

  const upcomingPhase = LIFECYCLE_PHASES[upcomingPhaseId];

  // Estimate year based on trajectory or default
  let upcomingPhaseYear: number | null = null;
  if (timing?.currentYear) {
    if (trajectory?.peaks || trajectory?.valleys) {
      // Find nearest significant point
      const allPoints = [
        ...(trajectory.peaks || []),
        ...(trajectory.valleys || [])
      ].filter(p => p.t > timing.currentYear);

      if (allPoints.length > 0) {
        upcomingPhaseYear = Math.round(allPoints[0].t);
      }
    }

    if (!upcomingPhaseYear) {
      // Default estimate: 2-3 years
      upcomingPhaseYear = timing.currentYear + 2;
    }
  }

  return { upcomingPhase, upcomingPhaseYear };
}

/**
 * Determine long-term phase
 */
export function determineLongTermPhase(
  composite: CompositeChart,
  timing?: LifecycleTimingContext,
  trajectory?: TrajectoryContext
): PhaseDefinition | null {
  // Check for balanced elements -> maturation
  if (composite.elementDistribution) {
    const values = Object.values(composite.elementDistribution).filter(v => typeof v === 'number');
    const numValues = values as number[];
    if (numValues.length >= 5) {
      const max = Math.max(...numValues);
      const min = Math.min(...numValues);
      if (max - min <= 20) {
        return LIFECYCLE_PHASES.maturation;
      }
    }
  }

  // Check trajectory end state
  if (trajectory?.overallCurve?.points) {
    const lastPoints = trajectory.overallCurve.points.slice(-5);
    const avgScore = lastPoints.reduce((sum, p) => sum + p.score, 0) / lastPoints.length;

    if (avgScore >= 70) {
      return LIFECYCLE_PHASES.maturation;
    } else if (avgScore >= 50) {
      return LIFECYCLE_PHASES.stabilization;
    } else {
      return LIFECYCLE_PHASES.recalibration;
    }
  }

  // Default based on relationship duration
  if (timing?.relationshipStartYear && timing?.currentYear) {
    const years = timing.currentYear - timing.relationshipStartYear;
    if (years >= 7) {
      return LIFECYCLE_PHASES.maturation;
    }
  }

  return LIFECYCLE_PHASES.expansion; // Optimistic default
}

/**
 * Build phase timeline projection
 */
export function buildPhaseTimeline(
  currentPhase: LifecyclePhase,
  composite: CompositeChart,
  timing?: LifecycleTimingContext,
  trajectory?: TrajectoryContext
): PhaseTimelineEntry[] {
  const timeline: PhaseTimelineEntry[] = [];
  const currentYear = timing?.currentYear || new Date().getFullYear();

  // Add current year entry
  timeline.push({
    year: currentYear,
    phase: currentPhase,
    phaseChinese: LIFECYCLE_PHASES[currentPhase].chineseName,
    score: 100, // Current phase
    triggers: LIFECYCLE_PHASES[currentPhase].triggerPatterns.slice(0, 3),
    narrative: `Currently in ${LIFECYCLE_PHASES[currentPhase].name} phase — ${LIFECYCLE_PHASES[currentPhase].theme}.`
  });

  // Project next 10 years
  const phaseOrder: LifecyclePhase[] = [
    'initiation', 'fusion', 'stabilization', 'expansion',
    'challenge', 'recalibration', 'maturation'
  ];

  const currentIndex = phaseOrder.indexOf(currentPhase);

  for (let i = 1; i <= 10; i++) {
    const year = currentYear + i;

    // Determine phase for this year
    let phase: LifecyclePhase;
    let score: number;

    // Check trajectory for peaks/valleys
    if (trajectory?.valleys?.some(v => Math.abs(v.t - year) < 1)) {
      phase = 'challenge';
      score = 70;
    } else if (trajectory?.peaks?.some(p => Math.abs(p.t - year) < 1)) {
      phase = 'expansion';
      score = 80;
    } else {
      // Natural progression with some variation
      const progressIndex = (currentIndex + Math.floor(i / 3)) % phaseOrder.length;
      phase = phaseOrder[progressIndex];
      score = Math.max(40, 80 - (i * 3)); // Confidence decreases with distance
    }

    // Check luck pillar alignment
    if (composite.luckPillars) {
      const relevantLP = composite.luckPillars.find(lp =>
        year >= lp.startAge && year < lp.startAge + 10
      );
      if (relevantLP?.favorability === 'challenging' || relevantLP?.favorability === 'difficult') {
        phase = 'challenge';
        score = Math.min(score, 60);
      }
    }

    timeline.push({
      year,
      phase,
      phaseChinese: LIFECYCLE_PHASES[phase].chineseName,
      score,
      triggers: identifyYearTriggers(year, phase, composite),
      narrative: buildYearNarrative(year, phase, score)
    });
  }

  return timeline;
}

/**
 * Identify triggers for a specific year
 */
export function identifyYearTriggers(
  year: number,
  phase: LifecyclePhase,
  composite: CompositeChart
): string[] {
  const triggers: string[] = [];

  // Annual element
  const stemIndex = (year - 4) % 10;
  const stemElements: ElementName[] = [
    'Wood', 'Wood', 'Fire', 'Fire', 'Earth',
    'Earth', 'Metal', 'Metal', 'Water', 'Water'
  ];
  const annualElement = stemElements[stemIndex];
  triggers.push(`${ELEMENT_CHINESE[annualElement]} year`);

  // Phase-specific triggers
  const phaseTriggers = LIFECYCLE_PHASES[phase].triggerPatterns.slice(0, 2);
  triggers.push(...phaseTriggers);

  // Useful God alignment
  if (composite.usefulGod?.element === annualElement) {
    triggers.push('Useful God aligned');
  }

  return triggers.slice(0, 3);
}

/**
 * Build narrative for a specific year
 */
export function buildYearNarrative(
  year: number,
  phase: LifecyclePhase,
  score: number
): string {
  const phaseDef = LIFECYCLE_PHASES[phase];
  const confidenceWord = score >= 70 ? 'likely' : score >= 50 ? 'possibly' : 'may';

  return `${year}: ${confidenceWord} ${phaseDef.name} (${phaseDef.chineseName}) — ${phaseDef.theme}.`;
}

/**
 * Identify phase transitions
 */
export function identifyTransitions(timeline: PhaseTimelineEntry[]): PhaseTransition[] {
  const transitions: PhaseTransition[] = [];

  for (let i = 1; i < timeline.length; i++) {
    const prev = timeline[i - 1];
    const curr = timeline[i];

    if (prev.phase !== curr.phase) {
      transitions.push({
        fromPhase: prev.phase,
        toPhase: curr.phase,
        transitionYear: curr.year,
        transitionTrigger: curr.triggers[0] || 'Timing shift',
        guidance: buildTransitionGuidance(prev.phase, curr.phase)
      });
    }
  }

  return transitions;
}

/**
 * Build guidance for phase transition
 */
export function buildTransitionGuidance(
  fromPhase: LifecyclePhase,
  toPhase: LifecyclePhase
): string {
  const fromDef = LIFECYCLE_PHASES[fromPhase];
  const toDef = LIFECYCLE_PHASES[toPhase];

  // Special transition guidance
  if (fromPhase === 'expansion' && toPhase === 'challenge') {
    return 'Growth cycles naturally meet resistance. Face challenges as opportunities for deepening.';
  }

  if (fromPhase === 'challenge' && toPhase === 'recalibration') {
    return 'After struggle comes healing. Allow space for reflection and repair.';
  }

  if (fromPhase === 'recalibration' && toPhase === 'maturation') {
    return 'Healing completes the foundation for lasting partnership.';
  }

  if (fromPhase === 'fusion' && toPhase === 'stabilization') {
    return 'Intensity naturally seeks grounding. Build structure without losing passion.';
  }

  return `Transitioning from ${fromDef.name} to ${toDef.name}. ${toDef.advice}`;
}

// ============================================================================
// NARRATIVE BUILDERS
// ============================================================================

/**
 * Build the main lifecycle narrative
 */
export function buildLifecycleNarrative(
  currentPhase: PhaseDefinition,
  currentPhaseScore: number,
  matchFactors: string[],
  upcomingPhase: PhaseDefinition | null,
  upcomingPhaseYear: number | null
): string {
  const parts: string[] = [];

  // Current phase description
  parts.push(`**Current Phase: ${currentPhase.name} (${currentPhase.chineseName})**`);
  parts.push(currentPhase.theme);
  parts.push('');

  // Match factors
  if (matchFactors.length > 0) {
    parts.push('*Why this phase:*');
    matchFactors.slice(0, 3).forEach(f => parts.push(`- ${f}`));
    parts.push('');
  }

  // Purpose and challenge
  parts.push(`*Purpose:* ${currentPhase.purpose}`);
  parts.push(`*Challenge:* ${currentPhase.challenge}`);
  parts.push(`*Gift:* ${currentPhase.gift}`);
  parts.push('');

  // Upcoming phase
  if (upcomingPhase && upcomingPhaseYear) {
    parts.push(`**Upcoming Phase: ${upcomingPhase.name} (${upcomingPhase.chineseName})**`);
    parts.push(`Expected around ${upcomingPhaseYear}.`);
    parts.push(upcomingPhase.theme);
  }

  return parts.join('\n');
}

/**
 * Build evolutionary arc description
 */
export function buildEvolutionaryArc(
  timeline: PhaseTimelineEntry[],
  transitions: PhaseTransition[]
): string {
  const parts: string[] = [];

  parts.push('**Evolutionary Arc**');
  parts.push('');

  // Summarize phases covered
  const phases = Array.from(new Set(timeline.map(t => t.phase)));
  const phaseNames = phases.map(p => LIFECYCLE_PHASES[p].chineseName).join(' → ');
  parts.push(`Journey: ${phaseNames}`);
  parts.push('');

  // Key transitions
  if (transitions.length > 0) {
    parts.push('*Key Transitions:*');
    transitions.slice(0, 3).forEach(t => {
      parts.push(`- ${t.transitionYear}: ${LIFECYCLE_PHASES[t.fromPhase].name} → ${LIFECYCLE_PHASES[t.toPhase].name}`);
    });
  }

  return parts.join('\n');
}

/**
 * Build current advice
 */
export function buildCurrentAdvice(
  currentPhase: PhaseDefinition,
  allScores: PhaseScore[]
): string[] {
  const advice: string[] = [];

  // Primary phase advice
  advice.push(currentPhase.advice);

  // Secondary phase consideration
  const sortedScores = [...allScores].sort((a, b) => b.score - a.score);
  if (sortedScores.length >= 2 && sortedScores[1].score >= 40) {
    const secondaryPhase = LIFECYCLE_PHASES[sortedScores[1].phase];
    advice.push(`Also consider: ${secondaryPhase.name} energy is present. ${secondaryPhase.challenge} may arise.`);
  }

  // Element-based advice
  const elementAdvice: Record<ElementName, string> = {
    Wood: 'Cultivate patience and long-term vision.',
    Fire: 'Channel passion into shared purpose.',
    Earth: 'Build stability without rigidity.',
    Metal: 'Maintain boundaries while staying connected.',
    Water: 'Allow space for reflection and deep listening.'
  };

  const affinityElement = currentPhase.elementalAffinity[0];
  if (affinityElement) {
    advice.push(elementAdvice[affinityElement]);
  }

  return advice.slice(0, 4);
}

/**
 * Build future outlook
 */
export function buildFutureOutlook(
  upcomingPhase: PhaseDefinition | null,
  longTermPhase: PhaseDefinition | null,
  transitions: PhaseTransition[]
): string {
  const parts: string[] = [];

  if (upcomingPhase) {
    parts.push(`Near-term: Moving toward ${upcomingPhase.name} (${upcomingPhase.chineseName}).`);
    parts.push(upcomingPhase.theme);
  }

  if (longTermPhase) {
    parts.push(`Long-term: ${longTermPhase.name} (${longTermPhase.chineseName}) is the destination.`);
  }

  if (transitions.length > 0) {
    const nextTransition = transitions[0];
    parts.push(`Next transition around ${nextTransition.transitionYear}: ${nextTransition.guidance}`);
  }

  return parts.join(' ');
}

// ============================================================================
// STORY FORMATTERS
// ============================================================================

/**
 * Format lifecycle result as complete story
 */
export function formatLifecycleStory(result: RelationshipLifecycleResult): string {
  const parts: string[] = [];

  parts.push('### Relationship Lifecycle (关系生命周期)');
  parts.push('');
  parts.push(result.lifecycleNarrative);
  parts.push('');
  parts.push('---');
  parts.push('');
  parts.push(result.evolutionaryArc);
  parts.push('');
  parts.push('---');
  parts.push('');
  parts.push('**Advice for This Phase**');
  result.currentAdvice.forEach(a => parts.push(`- ${a}`));
  parts.push('');
  parts.push('**Future Outlook**');
  parts.push(result.futureOutlook);

  return parts.join('\n');
}

/**
 * Format lifecycle for debug output
 */
export function formatLifecycleDebug(result: RelationshipLifecycleResult): string {
  const lines: string[] = [];

  lines.push('=== RELATIONSHIP LIFECYCLE DEBUG ===');
  lines.push(`Current Phase: ${result.currentPhase.name} (${result.currentPhase.chineseName})`);
  lines.push(`Score: ${result.currentPhaseScore}`);
  lines.push('');

  lines.push('--- ALL PHASE SCORES ---');
  result.allPhaseScores.forEach(ps => {
    lines.push(`${ps.phase}: ${ps.score} (${ps.confidence})`);
  });
  lines.push('');

  lines.push('--- TIMELINE ---');
  result.timeline.forEach(t => {
    lines.push(`${t.year}: ${t.phase} (${t.score}%)`);
  });
  lines.push('');

  lines.push('--- TRANSITIONS ---');
  result.transitions.forEach(t => {
    lines.push(`${t.transitionYear}: ${t.fromPhase} → ${t.toPhase}`);
  });

  return lines.join('\n');
}

// ============================================================================
// UI FORMATTERS
// ============================================================================

/**
 * Format lifecycle for UI consumption
 */
export function formatLifecycleForUI(result: RelationshipLifecycleResult): {
  currentPhase: {
    id: LifecyclePhase;
    name: string;
    chineseName: string;
    theme: string;
    score: number;
    color: string;
  };
  phaseScores: Array<{
    phase: LifecyclePhase;
    name: string;
    chineseName: string;
    score: number;
    confidence: string;
  }>;
  timeline: Array<{
    year: number;
    phase: LifecyclePhase;
    phaseChinese: string;
    score: number;
  }>;
  transitions: Array<{
    year: number;
    from: string;
    to: string;
    guidance: string;
  }>;
  advice: string[];
  outlook: string;
} {
  // Phase colors
  const phaseColors: Record<LifecyclePhase, string> = {
    initiation: '#E91E63',    // Pink - romance
    fusion: '#F44336',        // Red - passion
    stabilization: '#FF9800', // Orange - grounding
    expansion: '#4CAF50',     // Green - growth
    challenge: '#9C27B0',     // Purple - transformation
    recalibration: '#2196F3', // Blue - healing
    maturation: '#795548'     // Brown - wisdom
  };

  return {
    currentPhase: {
      id: result.currentPhase.id,
      name: result.currentPhase.name,
      chineseName: result.currentPhase.chineseName,
      theme: result.currentPhase.theme,
      score: result.currentPhaseScore,
      color: phaseColors[result.currentPhase.id]
    },
    phaseScores: result.allPhaseScores.map(ps => ({
      phase: ps.phase,
      name: LIFECYCLE_PHASES[ps.phase].name,
      chineseName: LIFECYCLE_PHASES[ps.phase].chineseName,
      score: ps.score,
      confidence: ps.confidence
    })),
    timeline: result.timeline.map(t => ({
      year: t.year,
      phase: t.phase,
      phaseChinese: t.phaseChinese,
      score: t.score
    })),
    transitions: result.transitions.map(t => ({
      year: t.transitionYear,
      from: LIFECYCLE_PHASES[t.fromPhase].chineseName,
      to: LIFECYCLE_PHASES[t.toPhase].chineseName,
      guidance: t.guidance
    })),
    advice: result.currentAdvice,
    outlook: result.futureOutlook
  };
}

/**
 * Get phase radar chart data
 */
export function getPhaseRadarData(result: RelationshipLifecycleResult): {
  labels: string[];
  data: number[];
  colors: string[];
} {
  const phaseOrder: LifecyclePhase[] = [
    'initiation', 'fusion', 'stabilization', 'expansion',
    'challenge', 'recalibration', 'maturation'
  ];

  const phaseColors: Record<LifecyclePhase, string> = {
    initiation: '#E91E63',
    fusion: '#F44336',
    stabilization: '#FF9800',
    expansion: '#4CAF50',
    challenge: '#9C27B0',
    recalibration: '#2196F3',
    maturation: '#795548'
  };

  const labels = phaseOrder.map(p => LIFECYCLE_PHASES[p].chineseName);
  const data = phaseOrder.map(p => {
    const scoreEntry = result.allPhaseScores.find(s => s.phase === p);
    return scoreEntry?.score || 0;
  });
  const colors = phaseOrder.map(p => phaseColors[p]);

  return { labels, data, colors };
}

/**
 * Get timeline chart data
 */
export function getTimelineChartData(result: RelationshipLifecycleResult): {
  years: number[];
  phases: string[];
  scores: number[];
  colors: string[];
} {
  const phaseColors: Record<LifecyclePhase, string> = {
    initiation: '#E91E63',
    fusion: '#F44336',
    stabilization: '#FF9800',
    expansion: '#4CAF50',
    challenge: '#9C27B0',
    recalibration: '#2196F3',
    maturation: '#795548'
  };

  return {
    years: result.timeline.map(t => t.year),
    phases: result.timeline.map(t => t.phaseChinese),
    scores: result.timeline.map(t => t.score),
    colors: result.timeline.map(t => phaseColors[t.phase])
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get phase by ID
 */
export function getPhaseById(phaseId: LifecyclePhase): PhaseDefinition {
  return LIFECYCLE_PHASES[phaseId];
}

/**
 * Get all phase definitions
 */
export function getAllPhases(): PhaseDefinition[] {
  return Object.values(LIFECYCLE_PHASES);
}

/**
 * Get phase elemental affinity
 */
export function getPhaseElementalAffinity(phaseId: LifecyclePhase): ElementName[] {
  return LIFECYCLE_PHASES[phaseId].elementalAffinity;
}

/**
 * Check if phases are adjacent in natural progression
 */
export function arePhasesAdjacent(
  phase1: LifecyclePhase,
  phase2: LifecyclePhase
): boolean {
  const progressionOrder: LifecyclePhase[] = [
    'initiation', 'fusion', 'stabilization', 'expansion',
    'challenge', 'recalibration', 'maturation'
  ];

  const index1 = progressionOrder.indexOf(phase1);
  const index2 = progressionOrder.indexOf(phase2);

  return Math.abs(index1 - index2) <= 1;
}

/**
 * Get natural next phases
 */
export function getNaturalNextPhases(currentPhase: LifecyclePhase): LifecyclePhase[] {
  const progressionMap: Record<LifecyclePhase, LifecyclePhase[]> = {
    initiation: ['fusion', 'stabilization'],
    fusion: ['stabilization', 'expansion'],
    stabilization: ['expansion', 'maturation'],
    expansion: ['challenge', 'maturation'],
    challenge: ['recalibration', 'stabilization'],
    recalibration: ['expansion', 'maturation'],
    maturation: ['challenge', 'expansion']
  };

  return progressionMap[currentPhase];
}

/**
 * Calculate phase compatibility
 */
export function calculatePhaseCompatibility(
  phase1: LifecyclePhase,
  phase2: LifecyclePhase
): number {
  const elements1 = LIFECYCLE_PHASES[phase1].elementalAffinity;
  const elements2 = LIFECYCLE_PHASES[phase2].elementalAffinity;

  // Check for shared elements
  const shared = elements1.filter(e => elements2.includes(e));

  if (shared.length >= 2) return 100;
  if (shared.length === 1) return 70;

  // Check for generating relationship
  const generating: Record<ElementName, ElementName> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood'
  };

  for (const e1 of elements1) {
    for (const e2 of elements2) {
      if (generating[e1] === e2 || generating[e2] === e1) {
        return 50;
      }
    }
  }

  return 30;
}

// ============================================================================
// EXPORTS
// ============================================================================

// All functions and constants are exported inline with 'export' keyword
