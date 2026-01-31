/**
 * Story Engine - Narrative Diff & Reverse Mapping
 *
 * Provides story diff between two days and reverse mapping
 * from narrative beats to the rules that created them.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type { RelationshipOutcome } from './relationshipOutcome';
import type { DecisionBreakdown, DatedOutcomeWithBreakdown } from './timeSeries';
import { RelationshipOutcomeNarratives } from './relationshipOutcome';

// ========================================
// TYPES
// ========================================

/** Story beat with rule attribution */
export interface StoryBeat {
  id: string;
  text: string;
  category: 'outcome' | 'tone' | 'pilgrim' | 'persona' | 'chamber';
  ruleIds: string[];
  weight: number;
}

/** Narrative cockpit for a day */
export interface NarrativeCockpit {
  date: string;
  outcome: RelationshipOutcome;
  beats: StoryBeat[];
  emotionalArc: number[];
  timingCurve: number[];
  overlays: string[];
}

/** Rule definition */
export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'retrograde' | 'synastry' | 'timing' | 'authority' | 'composite';
  weight: number;
  minWeight: number;
  maxWeight: number;
}

/** Story diff result */
export interface NarrativeDiff {
  dateA: string;
  dateB: string;
  beatsAdded: StoryBeat[];
  beatsRemoved: StoryBeat[];
  beatsModified: Array<{ before: StoryBeat; after: StoryBeat }>;
  emotionalShift: number[];
  timingShift: number[];
  overlaysAdded: string[];
  overlaysRemoved: string[];
  outcomeChanged: boolean;
  previousOutcome: RelationshipOutcome;
  newOutcome: RelationshipOutcome;
  significantChanges: string[];
}

/** Rule contribution for reverse mapping */
export interface RuleContribution {
  rule: Rule;
  contribution: number;
  direction: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

// ========================================
// DEFAULT RULES
// ========================================

export const DEFAULT_RULES: Rule[] = [
  // Retrograde Rules
  {
    id: 'mercury-rx',
    name: 'Mercury Retrograde',
    description: 'Internal communication processing, delayed expression',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'venus-rx',
    name: 'Venus Retrograde',
    description: 'Private value formation, unconventional attraction',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'mars-rx',
    name: 'Mars Retrograde',
    description: 'Strategic timing, internalized action',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'jupiter-rx',
    name: 'Jupiter Retrograde',
    description: 'Self-generated beliefs, internal optimism',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'saturn-rx',
    name: 'Saturn Retrograde',
    description: 'Self-defined boundaries, internal authority',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'uranus-rx',
    name: 'Uranus Retrograde',
    description: 'Private revolution, internal innovation',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'neptune-rx',
    name: 'Neptune Retrograde',
    description: 'Internal vision, personal symbolism',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'pluto-rx',
    name: 'Pluto Retrograde',
    description: 'Internal transformation, private power',
    category: 'retrograde',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },

  // Synastry Rules
  {
    id: 'synastry-harmony',
    name: 'Synastry Harmony',
    description: 'Planetary aspects between charts indicating compatibility',
    category: 'synastry',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'synastry-tension',
    name: 'Synastry Tension',
    description: 'Challenging aspects between charts',
    category: 'synastry',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'retro-synastry-match',
    name: 'Retrograde Synastry Match',
    description: 'Matching retrograde patterns between partners',
    category: 'synastry',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },

  // Timing Rules
  {
    id: 'timing-favorable',
    name: 'Favorable Timing',
    description: 'Transits and progressions supporting action',
    category: 'timing',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'timing-challenging',
    name: 'Challenging Timing',
    description: 'Transits suggesting delay or caution',
    category: 'timing',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },

  // Authority Rules
  {
    id: 'iap-high',
    name: 'High Internal Authority',
    description: 'Strong self-referential decision making',
    category: 'authority',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'iap-low',
    name: 'Low Internal Authority',
    description: 'External validation seeking',
    category: 'authority',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },
  {
    id: 'autonomy-boost',
    name: 'Autonomy Boost',
    description: 'High autonomy enhancing decision confidence',
    category: 'authority',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  },

  // Composite Rules
  {
    id: 'composite-strength',
    name: 'Composite Strength',
    description: 'Combined chart indicates relationship potential',
    category: 'composite',
    weight: 1.0,
    minWeight: 0,
    maxWeight: 2
  }
];

// ========================================
// NARRATIVE COCKPIT BUILDER
// ========================================

/**
 * Build narrative cockpit for a day
 */
export function buildNarrativeCockpit(
  point: DatedOutcomeWithBreakdown,
  rules: Rule[] = DEFAULT_RULES
): NarrativeCockpit {
  const { outcome, breakdown } = point;
  const narrative = RelationshipOutcomeNarratives[outcome];

  const beats: StoryBeat[] = [];

  // Outcome beat
  beats.push({
    id: `outcome-${outcome}`,
    text: narrative.title,
    category: 'outcome',
    ruleIds: getOutcomeRules(breakdown),
    weight: 1.0
  });

  // Extended narrative beat
  beats.push({
    id: `extended-${outcome}`,
    text: narrative.extended,
    category: 'outcome',
    ruleIds: getOutcomeRules(breakdown),
    weight: 0.8
  });

  // Pilgrim journey beat
  beats.push({
    id: `pilgrim-${outcome}`,
    text: narrative.pilgrim,
    category: 'pilgrim',
    ruleIds: ['timing-favorable', 'timing-challenging'],
    weight: 0.6
  });

  // Tone beats
  for (const [tone, text] of Object.entries(narrative.tones)) {
    beats.push({
      id: `tone-${outcome}-${tone}`,
      text,
      category: 'tone',
      ruleIds: getToneRules(tone, breakdown),
      weight: 0.5
    });
  }

  // Generate emotional arc (simplified)
  const emotionalArc = generateEmotionalArc(breakdown);

  // Generate timing curve
  const timingCurve = generateTimingCurve(breakdown);

  // Generate overlays
  const overlays = generateOverlays(breakdown, rules);

  return {
    date: point.date,
    outcome,
    beats,
    emotionalArc,
    timingCurve,
    overlays
  };
}

/**
 * Get rules that contributed to this outcome
 */
function getOutcomeRules(breakdown: DecisionBreakdown): string[] {
  const rules: string[] = [];

  // Retrograde rules
  for (const planet of breakdown.retrogradePlanets) {
    rules.push(`${planet.toLowerCase()}-rx`);
  }

  // Synastry rules
  if (breakdown.retroSynastryDelta > 0) {
    rules.push('retro-synastry-match');
    rules.push('synastry-harmony');
  } else if (breakdown.retroSynastryDelta < 0) {
    rules.push('synastry-tension');
  }

  // Authority rules
  if (breakdown.iap > 0.6) {
    rules.push('iap-high');
  } else if (breakdown.iap < 0.4) {
    rules.push('iap-low');
  }

  if (breakdown.autonomyBoost > 0) {
    rules.push('autonomy-boost');
  }

  // Timing rules
  if (breakdown.finalScore > 0.6) {
    rules.push('timing-favorable');
  } else if (breakdown.finalScore < 0.4) {
    rules.push('timing-challenging');
  }

  return rules;
}

/**
 * Get rules for a specific tone
 */
function getToneRules(tone: string, breakdown: DecisionBreakdown): string[] {
  const base = getOutcomeRules(breakdown);

  switch (tone) {
    case 'gentle':
      return [...base, 'iap-low'];
    case 'direct':
      return [...base, 'iap-high'];
    case 'poetic':
      return [...base, 'neptune-rx'];
    case 'clinical':
      return [...base, 'mercury-rx'];
    default:
      return base;
  }
}

/**
 * Generate emotional arc (10 points)
 */
function generateEmotionalArc(breakdown: DecisionBreakdown): number[] {
  const base = breakdown.finalScore;
  const arc: number[] = [];

  for (let i = 0; i < 10; i++) {
    const wave = Math.sin(i * 0.5) * 0.1;
    const noise = (Math.random() - 0.5) * 0.05;
    arc.push(Math.max(0, Math.min(1, base + wave + noise)));
  }

  return arc;
}

/**
 * Generate timing curve (10 points)
 */
function generateTimingCurve(breakdown: DecisionBreakdown): number[] {
  const base = breakdown.baseScore;
  const curve: number[] = [];

  for (let i = 0; i < 10; i++) {
    const trend = (i / 10) * breakdown.retroDecisionDelta;
    curve.push(Math.max(0, Math.min(1, base + trend)));
  }

  return curve;
}

/**
 * Generate overlays based on breakdown
 */
function generateOverlays(breakdown: DecisionBreakdown, rules: Rule[]): string[] {
  const overlays: string[] = [];

  if (breakdown.retrogradeCount >= 3) {
    overlays.push('high-retrograde-density');
  }

  if (breakdown.iap > 0.7) {
    overlays.push('sovereign-authority');
  }

  if (Math.abs(breakdown.retroDecisionDelta) > 0.1) {
    overlays.push('significant-retrograde-shift');
  }

  if (breakdown.finalScore > 0.8) {
    overlays.push('optimal-window');
  } else if (breakdown.finalScore < 0.2) {
    overlays.push('caution-zone');
  }

  return overlays;
}

// ========================================
// STORY DIFF
// ========================================

/**
 * Compute diff between two narrative cockpits
 */
export function diffNarrative(a: NarrativeCockpit, b: NarrativeCockpit): NarrativeDiff {
  const aBeats = new Map(a.beats.map(beat => [beat.id, beat]));
  const bBeats = new Map(b.beats.map(beat => [beat.id, beat]));

  const beatsAdded: StoryBeat[] = [];
  const beatsRemoved: StoryBeat[] = [];
  const beatsModified: Array<{ before: StoryBeat; after: StoryBeat }> = [];

  // Find added and modified
  for (const [id, beat] of bBeats) {
    if (!aBeats.has(id)) {
      beatsAdded.push(beat);
    } else {
      const aBeat = aBeats.get(id)!;
      if (aBeat.text !== beat.text || JSON.stringify(aBeat.ruleIds) !== JSON.stringify(beat.ruleIds)) {
        beatsModified.push({ before: aBeat, after: beat });
      }
    }
  }

  // Find removed
  for (const [id, beat] of aBeats) {
    if (!bBeats.has(id)) {
      beatsRemoved.push(beat);
    }
  }

  // Compute shifts
  const emotionalShift = b.emotionalArc.map((v, i) => v - (a.emotionalArc[i] || 0));
  const timingShift = b.timingCurve.map((v, i) => v - (a.timingCurve[i] || 0));

  // Overlay changes
  const overlaysAdded = b.overlays.filter(o => !a.overlays.includes(o));
  const overlaysRemoved = a.overlays.filter(o => !b.overlays.includes(o));

  // Outcome change
  const outcomeChanged = a.outcome !== b.outcome;

  // Generate significant changes summary
  const significantChanges: string[] = [];

  if (outcomeChanged) {
    significantChanges.push(`Outcome shifted from ${a.outcome} to ${b.outcome}`);
  }

  if (beatsAdded.length > 0) {
    significantChanges.push(`${beatsAdded.length} new narrative beats emerged`);
  }

  if (beatsRemoved.length > 0) {
    significantChanges.push(`${beatsRemoved.length} narrative beats faded`);
  }

  const avgEmotionalShift = emotionalShift.reduce((a, b) => a + b, 0) / emotionalShift.length;
  if (Math.abs(avgEmotionalShift) > 0.1) {
    significantChanges.push(`Emotional arc shifted by ${(avgEmotionalShift * 100).toFixed(1)}%`);
  }

  if (overlaysAdded.length > 0) {
    significantChanges.push(`New overlays: ${overlaysAdded.join(', ')}`);
  }

  return {
    dateA: a.date,
    dateB: b.date,
    beatsAdded,
    beatsRemoved,
    beatsModified,
    emotionalShift,
    timingShift,
    overlaysAdded,
    overlaysRemoved,
    outcomeChanged,
    previousOutcome: a.outcome,
    newOutcome: b.outcome,
    significantChanges
  };
}

// ========================================
// REVERSE MAPPING
// ========================================

/**
 * Get rules that contributed to a specific beat
 */
export function getRulesForBeat(beat: StoryBeat, rules: Rule[] = DEFAULT_RULES): Rule[] {
  return rules.filter(r => beat.ruleIds.includes(r.id));
}

/**
 * Get rule contributions for a breakdown
 */
export function getRuleContributions(
  breakdown: DecisionBreakdown,
  rules: Rule[] = DEFAULT_RULES
): RuleContribution[] {
  const contributions: RuleContribution[] = [];

  // Retrograde contributions
  for (const planet of breakdown.retrogradePlanets) {
    const ruleId = `${planet.toLowerCase()}-rx`;
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      const delta = breakdown.retroDecisionDelta / breakdown.retrogradeCount;
      contributions.push({
        rule,
        contribution: Math.abs(delta) * rule.weight,
        direction: delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral',
        explanation: `${planet} Rx contributed ${(delta * 100).toFixed(1)}% to decision score`
      });
    }
  }

  // Synastry contribution
  const synRule = rules.find(r => r.id === 'retro-synastry-match');
  if (synRule && breakdown.retroSynastryDelta !== 0) {
    contributions.push({
      rule: synRule,
      contribution: Math.abs(breakdown.retroSynastryDelta),
      direction: breakdown.retroSynastryDelta > 0 ? 'positive' : 'negative',
      explanation: `Retrograde synastry ${breakdown.retroSynastryDelta > 0 ? 'boosted' : 'reduced'} compatibility by ${(Math.abs(breakdown.retroSynastryDelta) * 100).toFixed(1)}%`
    });
  }

  // Authority contribution
  const authRule = breakdown.iap > 0.5
    ? rules.find(r => r.id === 'iap-high')
    : rules.find(r => r.id === 'iap-low');
  if (authRule) {
    contributions.push({
      rule: authRule,
      contribution: Math.abs(breakdown.autonomyBoost),
      direction: breakdown.autonomyBoost > 0 ? 'positive' : breakdown.autonomyBoost < 0 ? 'negative' : 'neutral',
      explanation: `${breakdown.iapTier} authority tier provided ${(breakdown.autonomyBoost * 100).toFixed(1)}% autonomy adjustment`
    });
  }

  // Sort by contribution magnitude
  contributions.sort((a, b) => b.contribution - a.contribution);

  return contributions;
}

/**
 * Get explanation for an outcome
 */
export function explainOutcome(
  breakdown: DecisionBreakdown,
  rules: Rule[] = DEFAULT_RULES
): string {
  const contributions = getRuleContributions(breakdown, rules);
  const topContributors = contributions.slice(0, 3);

  const explanations = topContributors.map(c => c.explanation);

  return `Outcome: ${breakdown.outcome} (score: ${(breakdown.finalScore * 100).toFixed(1)}%)\n\n` +
    `Key factors:\n${explanations.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
}

// ========================================
// RULE WEIGHT ADJUSTMENT
// ========================================

/**
 * Apply custom rule weights and recompute breakdown
 */
export function applyRuleWeights(
  breakdown: DecisionBreakdown,
  customWeights: Map<string, number>
): DecisionBreakdown {
  let adjustedFinalScore = breakdown.baseScore;

  // Apply weighted retrograde delta
  const retroWeight = getAverageWeight(breakdown.retrogradePlanets.map(p => `${p.toLowerCase()}-rx`), customWeights);
  adjustedFinalScore += breakdown.retroDecisionDelta * retroWeight;

  // Apply weighted synastry delta
  const synWeight = customWeights.get('retro-synastry-match') ?? 1.0;
  adjustedFinalScore += breakdown.retroSynastryDelta * synWeight;

  // Apply weighted autonomy boost
  const authWeight = customWeights.get(breakdown.iap > 0.5 ? 'iap-high' : 'iap-low') ?? 1.0;
  adjustedFinalScore += breakdown.autonomyBoost * authWeight;

  // Clamp
  adjustedFinalScore = Math.max(0, Math.min(1, adjustedFinalScore));

  return {
    ...breakdown,
    finalScore: adjustedFinalScore,
    outcome: mapScoreToRelationshipOutcome(adjustedFinalScore)
  };
}

function getAverageWeight(ruleIds: string[], weights: Map<string, number>): number {
  if (ruleIds.length === 0) return 1.0;
  const sum = ruleIds.reduce((acc, id) => acc + (weights.get(id) ?? 1.0), 0);
  return sum / ruleIds.length;
}

// Need to import this for the weight adjustment function
import { mapScoreToRelationshipOutcome } from './relationshipOutcome';
