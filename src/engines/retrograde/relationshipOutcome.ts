/**
 * Relationship Outcome Engine
 *
 * Converts retrograde analysis into actionable relationship outcomes
 * with mythic narratives, tone variants, and UI-ready blocks.
 *
 * Outcomes: DoNow | GoodWindow | Neutral | Delay | Avoid
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type { PlanetState, DecisionContext } from './types';
import { computeInternalAuthorityProfile } from './calculators';
import { applyRetrogradeDecisionModifier, computeRetrogradeSynastryScore } from './calculators';

// ========================================
// TYPES
// ========================================

/** Relationship outcome tiers */
export type RelationshipOutcome =
  | 'DoNow'
  | 'GoodWindow'
  | 'Neutral'
  | 'Delay'
  | 'Avoid';

/** Narrative tone variants */
export type NarrativeTone = 'gentle' | 'direct' | 'poetic' | 'clinical';

/** Base relationship inputs */
export interface BaseRelationshipInputs {
  /** Synastry score -1 to +1 */
  synastryScore: number;
  /** Composite chart score 0-1 */
  compositeScore: number;
  /** Current timing score 0-1 (transits, progressions) */
  timingScore: number;
}

/** Relationship decision context extends DecisionContext */
export interface RelationshipDecisionContext extends DecisionContext {
  /** Type of relationship decision */
  relationshipType?: 'new' | 'existing' | 'reconciliation' | 'ending' | 'deepening';
  /** Emotional stakes level 0-1 */
  emotionalStakes?: number;
}

/** Single tone narrative */
export interface ToneNarratives {
  gentle: string;
  direct: string;
  poetic: string;
  clinical: string;
}

/** Full outcome narrative */
export interface OutcomeNarrative {
  /** Codex voice - objective, metaphysical */
  codex: string;
  /** Persona voice - intimate, voice-driven */
  persona: string;
  /** Mythic voice - cathedral-tone, ritual language */
  mythic: string;
}

/** UI-ready narrative block */
export interface UIRelationshipNarrative {
  /** Mythic title */
  title: string;
  /** Emoji/icon */
  icon: string;
  /** Color class for UI */
  colorClass: string;
  /** Extended paragraph narrative */
  extended: string;
  /** Tone variants */
  tones: ToneNarratives;
  /** Pilgrim journey step */
  pilgrim: string;
  /** Full outcome narratives */
  narratives: OutcomeNarrative;
}

/** Complete relationship analysis result */
export interface RelationshipAnalysisResult {
  /** Final score 0-1 */
  score: number;
  /** Outcome tier */
  outcome: RelationshipOutcome;
  /** UI narratives */
  ui: UIRelationshipNarrative;
  /** Internal Authority Profile score */
  iapScore: number;
  /** Retrograde synastry score */
  retroSynastryScore: number;
  /** Breakdown of score components */
  breakdown: {
    base: number;
    retrogradeModifier: number;
    synastryModifier: number;
    autonomyModifier: number;
  };
}

// ========================================
// SCORE MAPPING
// ========================================

/**
 * Map numeric score to RelationshipOutcome
 */
export function mapScoreToRelationshipOutcome(score: number): RelationshipOutcome {
  const s = Math.max(0, Math.min(1, score)); // clamp 0-1

  if (s >= 0.8) return 'DoNow';
  if (s >= 0.65) return 'GoodWindow';
  if (s >= 0.45) return 'Neutral';
  if (s >= 0.25) return 'Delay';
  return 'Avoid';
}

/**
 * Get outcome threshold info
 */
export function getOutcomeThresholds(): Record<RelationshipOutcome, { min: number; max: number }> {
  return {
    DoNow: { min: 0.8, max: 1.0 },
    GoodWindow: { min: 0.65, max: 0.8 },
    Neutral: { min: 0.45, max: 0.65 },
    Delay: { min: 0.25, max: 0.45 },
    Avoid: { min: 0, max: 0.25 }
  };
}

// ========================================
// BASE SCORE CALCULATION
// ========================================

/**
 * Compute base relationship score (without retrogrades)
 */
export function computeBaseRelationshipScore(base: BaseRelationshipInputs): number {
  // Normalize synastry -1..+1 → 0..1
  const syn = (base.synastryScore + 1) / 2;

  // Weighted blend
  const score =
    syn * 0.4 +
    base.compositeScore * 0.35 +
    base.timingScore * 0.25;

  return Math.max(0, Math.min(1, score));
}

// ========================================
// FULL DECISION SCORE
// ========================================

/**
 * Compute complete relationship decision score with retrogrades
 */
export function computeRelationshipDecisionScore(
  selfPlanets: PlanetState[],
  partnerPlanets: PlanetState[],
  base: BaseRelationshipInputs,
  ctx: RelationshipDecisionContext
): { score: number; breakdown: RelationshipAnalysisResult['breakdown']; iapScore: number; retroSynastryScore: number } {
  // 1. Base score from synastry/composite/timing
  const baseScore = computeBaseRelationshipScore(base);

  // 2. Internal Authority Profile
  const iap = computeInternalAuthorityProfile(selfPlanets);
  const iapScore = iap.score;

  // 3. Retrograde decision modifier (self)
  const modifiedScore = applyRetrogradeDecisionModifier(baseScore, selfPlanets, ctx);
  const retrogradeModifier = modifiedScore - baseScore;

  // 4. Retrograde synastry modifier
  const retroSynastry = computeRetrogradeSynastryScore(selfPlanets, partnerPlanets);
  const synastryModifier = retroSynastry.averageScore * 0.15;

  // 5. Internal authority autonomy boost
  const autonomyModifier = (iapScore - 0.5) * 0.1;

  // Final score
  let score = modifiedScore + synastryModifier + autonomyModifier;
  score = Math.max(0, Math.min(1, score));

  return {
    score,
    breakdown: {
      base: baseScore,
      retrogradeModifier,
      synastryModifier,
      autonomyModifier
    },
    iapScore,
    retroSynastryScore: retroSynastry.averageScore
  };
}

// ========================================
// NARRATIVE DATA
// ========================================

/** Complete narrative data for all outcomes */
export const RelationshipOutcomeNarratives: Record<RelationshipOutcome, UIRelationshipNarrative> = {
  DoNow: {
    title: 'The Gate of Immediate Accord',
    icon: '🌕',
    colorClass: 'text-emerald-400',

    extended: `The relational field is bright and coherent, as if the currents themselves are leaning in your direction. Energies between you and the other person are aligned, responsive, and mutually aware. This is a moment where clarity meets opportunity — where intentions land cleanly and the path ahead feels open. The atmosphere supports connection, conversation, and forward movement without strain. When the field opens like this, even small gestures carry weight and resonance.`,

    tones: {
      gentle: 'This moment feels open and welcoming. The connection is warm, clear, and ready for a little movement.',
      direct: 'Conditions are optimal. If you want to act, this is the time.',
      poetic: 'The path brightens beneath your feet. The air hums with alignment, and the moment leans toward yes.',
      clinical: 'Indicators show high relational coherence and low friction. Current timing supports forward engagement.'
    },

    pilgrim: `You arrive at the Gate of Immediate Accord, where the winds of timing gather in your favor. The path ahead is illuminated, and the guardians of alignment nod in quiet approval. This is a moment of convergence — when your intention and the world's rhythm move as one.`,

    narratives: {
      codex: 'The currents align cleanly. The relational field is open, responsive, and energetically coherent.',
      persona: 'This moment carries clarity. The connection feels awake, reciprocal, and ready to move.',
      mythic: 'The Gate of Immediate Accord stands open. Two paths converge with no resistance, and the winds of timing whisper yes.'
    }
  },

  GoodWindow: {
    title: 'The Lantern Bridge',
    icon: '🌖',
    colorClass: 'text-amber-400',

    extended: `The connection rests in a favorable phase, warm and receptive, though not fully crystallized. There is momentum here, a sense that the relational space is gently expanding. Conditions are supportive but not absolute; the field invites movement, but with awareness. This is a time for soft advances, honest exchanges, and exploratory steps. The window is open, and the air is kind — but the moment still asks for presence and pacing.`,

    tones: {
      gentle: 'There\'s warmth here, a sense of possibility. The timing feels supportive, even if not perfect.',
      direct: 'Conditions are favorable for movement. Proceed with intention.',
      poetic: 'A soft glow opens the way. The bridge hums with quiet invitation, asking only that you step with care.',
      clinical: 'Relational indicators show moderate alignment with positive momentum. Favorable window for engagement.'
    },

    pilgrim: `You stand before the Lantern Bridge, its glow soft but steady. The air is warm, the currents gentle. This is a passage of opportunity, where careful steps carry you forward with grace.`,

    narratives: {
      codex: 'Conditions are favorable. Momentum is present, though not absolute. The field supports gentle advancement.',
      persona: 'There\'s warmth here, a sense of possibility. The timing feels supportive, even if not perfect.',
      mythic: 'The Window of Auspicious Passage glows softly. Step with awareness, and the path will brighten beneath your feet.'
    }
  },

  Neutral: {
    title: 'The Hall of Still Waters',
    icon: '🌗',
    colorClass: 'text-slate-400',

    extended: `The relational field is steady and uncharged. No strong currents push forward, and none pull back. This is a moment of equilibrium, where outcomes depend more on intention than timing. The connection is neither hindered nor accelerated by the surrounding energies. It is a space for observation, reflection, and grounded interaction. Neutrality is not emptiness — it is a blank canvas, waiting for your next brushstroke.`,

    tones: {
      gentle: 'Nothing blocks the connection, but nothing accelerates it either. This is a moment for observation.',
      direct: 'Conditions are neutral. Outcomes depend on your actions.',
      poetic: 'The waters lie still, awaiting your touch. Neither shadow nor light dominates — only potential.',
      clinical: 'No significant relational forces detected. Base conditions apply without modification.'
    },

    pilgrim: `You enter the Hall of Still Waters, where nothing stirs unless you stir it. The world waits, balanced and unhurried. Here, the pilgrim learns that neutrality is a canvas, not a verdict.`,

    narratives: {
      codex: 'The field is balanced. No strong currents push forward or hold back. Outcomes depend on intention and pacing.',
      persona: 'Nothing blocks the connection, but nothing accelerates it either. This is a moment for observation.',
      mythic: 'The Scales of the Middle Realm rest evenly. Neither omen nor warning rises; the next movement is yours to shape.'
    }
  },

  Delay: {
    title: 'The Narrowing River',
    icon: '🌘',
    colorClass: 'text-orange-400',

    extended: `The field carries friction, misalignment, or emotional static. Timing is not fully supportive, and the connection may feel uneven or unclear. This is not a rejection — it is a request for space. A pause now can prevent unnecessary turbulence later. The energies suggest that clarity will come with distance, and that patience will yield a smoother path. Delay is the wisdom of the river narrowing before it widens again.`,

    tones: {
      gentle: 'A little space may help things settle. The connection isn\'t blocked, just asking for patience.',
      direct: 'Timing is off. Wait for a clearer window.',
      poetic: 'The river narrows and urges patience. Rest by the bank until the waters widen once more.',
      clinical: 'Indicators show elevated friction and timing misalignment. Delay recommended to reduce turbulence.'
    },

    pilgrim: `You reach the Narrowing River, where the waters tighten and the stones speak of patience. The path asks you to pause, to let the current settle before crossing.`,

    narratives: {
      codex: 'Energetic friction is present. Timing is misaligned or unclear. Waiting may reduce unnecessary turbulence.',
      persona: 'The connection feels uneven right now. Space could bring clarity or soften tension.',
      mythic: 'The Hour of Withheld Motion descends. The river narrows, urging the traveler to pause until the waters widen again.'
    }
  },

  Avoid: {
    title: 'The Veil of Divergence',
    icon: '🌑',
    colorClass: 'text-red-400',

    extended: `The relational field is discordant, carrying sharp edges or unstable currents. Moving forward now may amplify stress or misalignment. This is a moment to step back, not out of fear, but out of discernment. The atmosphere is not conducive to meaningful connection, and the wisest action is to preserve your energy. Avoidance here is not withdrawal — it is protection, a shield raised until the storm passes.`,

    tones: {
      gentle: 'This moment feels unstable. It may be wise to protect your energy and wait.',
      direct: 'Conditions are not supportive. Step back.',
      poetic: 'Shadows cross the path; step back until the storm dissolves and the veil lifts.',
      clinical: 'High relational discord detected. Engagement at this time may amplify stress vectors.'
    },

    pilgrim: `You encounter the Veil of Divergence, where shadows cross the trail and the air grows tense. The wise pilgrim steps back, preserving their light until the storm dissolves.`,

    narratives: {
      codex: 'The relational field shows significant discord. Proceeding now may amplify stress or misalignment.',
      persona: 'The signals feel sharp or unstable. This moment doesn\'t support meaningful connection.',
      mythic: 'The Veil of Divergence falls. Shadows cross the path, and the wise traveler steps back until the storm passes.'
    }
  }
};

// ========================================
// MAIN FUNCTIONS
// ========================================

/**
 * Get full relationship outcome with narratives
 */
export function getRelationshipOutcome(
  selfPlanets: PlanetState[],
  partnerPlanets: PlanetState[],
  base: BaseRelationshipInputs,
  ctx: RelationshipDecisionContext
): RelationshipAnalysisResult {
  const { score, breakdown, iapScore, retroSynastryScore } = computeRelationshipDecisionScore(
    selfPlanets,
    partnerPlanets,
    base,
    ctx
  );

  const outcome = mapScoreToRelationshipOutcome(score);
  const ui = RelationshipOutcomeNarratives[outcome];

  return {
    score,
    outcome,
    ui,
    iapScore,
    retroSynastryScore,
    breakdown
  };
}

/**
 * Get narrative for a specific outcome
 */
export function getRelationshipNarrative(outcome: RelationshipOutcome): UIRelationshipNarrative {
  return RelationshipOutcomeNarratives[outcome];
}

/**
 * Get narrative in a specific tone
 */
export function getNarrativeInTone(outcome: RelationshipOutcome, tone: NarrativeTone): string {
  return RelationshipOutcomeNarratives[outcome].tones[tone];
}

/**
 * Get narrative in a specific voice
 */
export function getNarrativeVoice(
  outcome: RelationshipOutcome,
  voice: 'codex' | 'persona' | 'mythic'
): string {
  return RelationshipOutcomeNarratives[outcome].narratives[voice];
}

/**
 * Get pilgrim journey step
 */
export function getPilgrimJourneyStep(outcome: RelationshipOutcome): string {
  return RelationshipOutcomeNarratives[outcome].pilgrim;
}

// ========================================
// QUICK ANALYSIS
// ========================================

/**
 * Quick relationship check without full analysis
 */
export function quickRelationshipCheck(
  selfPlanets: PlanetState[],
  partnerPlanets: PlanetState[],
  synastryScore: number = 0
): { outcome: RelationshipOutcome; title: string; icon: string } {
  const base: BaseRelationshipInputs = {
    synastryScore,
    compositeScore: 0.5,
    timingScore: 0.5
  };

  const ctx: RelationshipDecisionContext = {
    topic: 'relationship',
    urgency: 0.5,
    riskTolerance: 0.5,
    externalPressure: 0.3,
    emotionalWeight: 0.5
  };

  const { score } = computeRelationshipDecisionScore(selfPlanets, partnerPlanets, base, ctx);
  const outcome = mapScoreToRelationshipOutcome(score);
  const narrative = RelationshipOutcomeNarratives[outcome];

  return {
    outcome,
    title: narrative.title,
    icon: narrative.icon
  };
}

// ========================================
// UI HELPERS
// ========================================

/**
 * Get all outcome options for UI display
 */
export function getAllOutcomeOptions(): Array<{
  outcome: RelationshipOutcome;
  title: string;
  icon: string;
  colorClass: string;
}> {
  return Object.entries(RelationshipOutcomeNarratives).map(([outcome, data]) => ({
    outcome: outcome as RelationshipOutcome,
    title: data.title,
    icon: data.icon,
    colorClass: data.colorClass
  }));
}

/**
 * Get outcome color for charts/visualization
 */
export function getOutcomeColor(outcome: RelationshipOutcome): string {
  const colors: Record<RelationshipOutcome, string> = {
    DoNow: '#34d399',     // emerald-400
    GoodWindow: '#fbbf24', // amber-400
    Neutral: '#94a3b8',    // slate-400
    Delay: '#fb923c',      // orange-400
    Avoid: '#f87171'       // red-400
  };
  return colors[outcome];
}

/**
 * Get outcome background gradient
 */
export function getOutcomeGradient(outcome: RelationshipOutcome): string {
  const gradients: Record<RelationshipOutcome, string> = {
    DoNow: 'from-emerald-500/20 to-green-500/10',
    GoodWindow: 'from-amber-500/20 to-yellow-500/10',
    Neutral: 'from-slate-500/20 to-gray-500/10',
    Delay: 'from-orange-500/20 to-amber-500/10',
    Avoid: 'from-red-500/20 to-rose-500/10'
  };
  return gradients[outcome];
}
