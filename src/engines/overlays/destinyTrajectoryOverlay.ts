/**
 * Destiny Trajectory Overlay
 *
 * Long-arc movement analysis - where the relationship is heading.
 * This overlay uses progressions, composite chart arcs, and
 * long-term timing curves to assess directional momentum.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

// ========================================
// TYPES
// ========================================

export interface DestinyTrajectoryInput {
  compositeTiming: number;     // 0..1 - current composite timing quality
  synastryStability: number;   // 0..1 - how stable synastry aspects are
  longArcProgression: number;  // 0..1 - progressed composite indicators
  currentCycles?: {
    saturn: number;            // 0..1 - Saturn cycle position
    jupiter: number;           // 0..1 - Jupiter cycle position
    nodal: number;             // 0..1 - Nodal cycle position
  };
  transits?: {
    supportive: number;        // count of supportive transits
    challenging: number;       // count of challenging transits
  };
}

export interface DestinyTrajectoryOverlayResult {
  trajectory: Trajectory;
  trajectoryScore: number;     // 0..1
  destinyDelta: number;
  momentum: Momentum;
  cyclePhase: CyclePhase;
  narrative: string;
  currentWindow: string;
  futureOutlook: string;
  strengths: string[];
  challenges: string[];
}

export type Trajectory =
  | 'Ascending'      // Clear upward momentum
  | 'Stable'         // Steady state, maintenance
  | 'Crossroads'     // Decision point, could go either way
  | 'Descending'     // Downward momentum, challenges ahead
  | 'Transforming';  // Major shift in progress

export type Momentum =
  | 'Accelerating'
  | 'Steady'
  | 'Decelerating'
  | 'Reversing';

export type CyclePhase =
  | 'Beginning'      // New cycle starting
  | 'Building'       // Growth phase
  | 'Peak'           // Maximum expression
  | 'Harvesting'     // Reaping results
  | 'Releasing'      // Letting go phase
  | 'Fallow';        // Rest and integration

// ========================================
// MAIN COMPUTATION
// ========================================

/**
 * Compute destiny trajectory from timing inputs
 */
export function computeDestinyTrajectoryOverlay(
  input: DestinyTrajectoryInput
): DestinyTrajectoryOverlayResult {
  // Calculate weighted trajectory score
  const baseScore =
    (input.compositeTiming * 0.4) +
    (input.synastryStability * 0.3) +
    (input.longArcProgression * 0.3);

  // Adjust for cycles if provided
  let cycleModifier = 0;
  if (input.currentCycles) {
    const saturnEffect = input.currentCycles.saturn > 0.5 ? 0.05 : -0.05;
    const jupiterEffect = input.currentCycles.jupiter > 0.5 ? 0.03 : -0.03;
    const nodalEffect = input.currentCycles.nodal > 0.5 ? 0.04 : -0.04;
    cycleModifier = saturnEffect + jupiterEffect + nodalEffect;
  }

  // Adjust for transits if provided
  let transitModifier = 0;
  if (input.transits) {
    const transitBalance = input.transits.supportive - input.transits.challenging;
    transitModifier = transitBalance * 0.02;
  }

  const trajectoryScore = Math.max(0, Math.min(1, baseScore + cycleModifier + transitModifier));

  // Determine trajectory
  const trajectory = determineTrajectory(trajectoryScore, input);

  // Determine momentum
  const momentum = determineMomentum(input);

  // Determine cycle phase
  const cyclePhase = determineCyclePhase(input);

  // Calculate delta
  const destinyDelta = (trajectoryScore - 0.5) * 0.07;

  // Build narrative
  const narrative = buildDestinyNarrative(trajectory, momentum, cyclePhase, trajectoryScore);

  // Build windows
  const currentWindow = buildCurrentWindow(trajectory, cyclePhase);
  const futureOutlook = buildFutureOutlook(trajectory, momentum, cyclePhase);

  // Get traits
  const { strengths, challenges } = getDestinyTraits(trajectory, cyclePhase);

  return {
    trajectory,
    trajectoryScore,
    destinyDelta,
    momentum,
    cyclePhase,
    narrative,
    currentWindow,
    futureOutlook,
    strengths,
    challenges
  };
}

// ========================================
// DETERMINATION FUNCTIONS
// ========================================

function determineTrajectory(
  score: number,
  input: DestinyTrajectoryInput
): Trajectory {
  // Check for transformation indicators
  const volatility = Math.abs(input.compositeTiming - input.synastryStability);
  if (volatility > 0.4 && score > 0.3 && score < 0.7) {
    return 'Transforming';
  }

  if (score > 0.75) return 'Ascending';
  if (score > 0.55) return 'Stable';
  if (score > 0.35) return 'Crossroads';
  return 'Descending';
}

function determineMomentum(input: DestinyTrajectoryInput): Momentum {
  const diff = input.compositeTiming - input.longArcProgression;

  if (diff > 0.2) return 'Accelerating';
  if (diff > -0.1) return 'Steady';
  if (diff > -0.3) return 'Decelerating';
  return 'Reversing';
}

function determineCyclePhase(input: DestinyTrajectoryInput): CyclePhase {
  if (!input.currentCycles) {
    // Infer from other data
    const avg = (input.compositeTiming + input.synastryStability + input.longArcProgression) / 3;
    if (avg > 0.8) return 'Peak';
    if (avg > 0.6) return 'Building';
    if (avg > 0.4) return 'Harvesting';
    if (avg > 0.2) return 'Releasing';
    return 'Beginning';
  }

  const saturnPhase = input.currentCycles.saturn;

  if (saturnPhase < 0.1 || saturnPhase > 0.9) return 'Beginning';
  if (saturnPhase < 0.3) return 'Building';
  if (saturnPhase < 0.5) return 'Peak';
  if (saturnPhase < 0.7) return 'Harvesting';
  if (saturnPhase < 0.85) return 'Releasing';
  return 'Fallow';
}

// ========================================
// NARRATIVE BUILDERS
// ========================================

function buildDestinyNarrative(
  trajectory: Trajectory,
  momentum: Momentum,
  phase: CyclePhase,
  score: number
): string {
  const scorePercent = Math.round(score * 100);

  const trajectoryNarratives: Record<Trajectory, string> = {
    'Ascending': `Your long-arc trajectory is ascending (${scorePercent}% favorable). The currents of timing support your relationship's growth and evolution. This is a period of expansion and forward movement.`,

    'Stable': `Your long-arc trajectory is stable (${scorePercent}% favorable). The relationship has found a sustainable rhythm. This is a period of maintenance and deepening what already exists.`,

    'Crossroads': `Your long-arc trajectory stands at a crossroads (${scorePercent}% favorable). This is a pivot point—the choices made now significantly shape your direction. Pay attention to timing.`,

    'Descending': `Your long-arc trajectory shows some descent (${scorePercent}% favorable). This indicates challenges ahead, but descent often precedes transformation. Navigate with awareness.`,

    'Transforming': `Your long-arc trajectory is in active transformation (${scorePercent}% favorable). Major shifts are in progress—neither purely ascending nor descending, but fundamentally changing.`
  };

  let narrative = trajectoryNarratives[trajectory];
  narrative += ` Your momentum is ${momentum.toLowerCase()}, and you're in the ${phase.toLowerCase()} phase of your relationship cycle.`;

  return narrative;
}

function buildCurrentWindow(trajectory: Trajectory, phase: CyclePhase): string {
  const windows: Record<Trajectory, string> = {
    'Ascending': 'The current window favors initiative, commitment, and expansion. Act on positive impulses.',
    'Stable': 'The current window favors maintenance, deepening, and refinement. Nurture what exists.',
    'Crossroads': 'The current window demands clarity of intention. Make conscious choices; default patterns may not serve.',
    'Descending': 'The current window asks for patience and reflection. Avoid major commitments until clarity arrives.',
    'Transforming': 'The current window is volatile but generative. Embrace change while staying connected to core values.'
  };

  return windows[trajectory];
}

function buildFutureOutlook(trajectory: Trajectory, momentum: Momentum, phase: CyclePhase): string {
  // Combine factors for outlook
  if (trajectory === 'Ascending' && momentum !== 'Reversing') {
    return 'The trajectory suggests continued growth. Capitalize on this favorable period.';
  }

  if (trajectory === 'Stable') {
    return 'Stability is likely to continue. Focus on quality over quantity in your connection.';
  }

  if (trajectory === 'Crossroads') {
    if (phase === 'Building' || phase === 'Peak') {
      return 'The crossroads will likely resolve upward if conscious choices are made.';
    }
    return 'The crossroads outcome depends heavily on present actions and awareness.';
  }

  if (trajectory === 'Descending') {
    if (momentum === 'Decelerating' || momentum === 'Reversing') {
      return 'The descent may deepen before turning. Focus on foundation and communication.';
    }
    return 'The descent may be temporary. Watch for signs of the cycle shifting.';
  }

  // Transforming
  return 'Transformation outcomes are inherently uncertain but often lead to renewal after completion.';
}

// ========================================
// TRAITS
// ========================================

function getDestinyTraits(
  trajectory: Trajectory,
  phase: CyclePhase
): { strengths: string[]; challenges: string[] } {
  const trajectoryStrengths: Record<Trajectory, string[]> = {
    'Ascending': ['Favorable timing', 'Natural momentum', 'Supported growth'],
    'Stable': ['Predictability', 'Sustainable rhythm', 'Room to deepen'],
    'Crossroads': ['Agency over direction', 'Transformation potential', 'Clarity opportunity'],
    'Descending': ['Invitation to reflect', 'Reveals what needs attention', 'Builds resilience'],
    'Transforming': ['Renewal potential', 'Breaking old patterns', 'Emergence of new forms']
  };

  const trajectoryChallenges: Record<Trajectory, string[]> = {
    'Ascending': ['May overcommit', 'Could miss warning signs in optimism'],
    'Stable': ['Risk of stagnation', 'May become complacent'],
    'Crossroads': ['Decision pressure', 'Uncertainty is uncomfortable'],
    'Descending': ['Difficult emotions', 'Tests commitment', 'May trigger fear'],
    'Transforming': ['Instability', 'Old identity loss', 'Requires surrender']
  };

  const phaseStrength = {
    'Beginning': 'Fresh start energy',
    'Building': 'Growth momentum',
    'Peak': 'Maximum expression',
    'Harvesting': 'Reaping rewards',
    'Releasing': 'Wisdom of letting go',
    'Fallow': 'Rest and integration'
  };

  const strengths = [...trajectoryStrengths[trajectory], phaseStrength[phase]];
  const challenges = [...trajectoryChallenges[trajectory]];

  return {
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 3)
  };
}

// ========================================
// PERSONA VOICES
// ========================================

export const DestinyTrajectoryPersonaVoices: Record<Trajectory, {
  mentor: string;
  oracle: string;
  companion: string;
  mirror: string;
}> = {
  'Ascending': {
    mentor: 'The winds favor your sails. Move forward with confidence, but steer with wisdom.',
    oracle: 'The arc bends toward blessing. What you plant now flourishes in coming seasons.',
    companion: 'Things are really moving in a good direction! Enjoy this momentum.',
    mirror: 'Notice the support surrounding your connection. That tailwind is real—use it.'
  },
  'Stable': {
    mentor: 'Stability is not stagnation. Use this plateau to deepen roots before the next ascent.',
    oracle: 'The waters are calm. Build your vessel; the next voyage will need its strength.',
    companion: 'Things are steady, which is actually great! It\'s a good time to nurture what you have.',
    mirror: 'Notice the reliability of this moment. Stability allows for depth that motion cannot.'
  },
  'Crossroads': {
    mentor: 'The fork in the road reveals what matters most. Choose consciously; both paths are real.',
    oracle: 'At the crossroads, the pilgrim\'s intention becomes direction. Which way does your heart lean?',
    companion: 'You\'re at a decision point. Take your time, but don\'t avoid choosing.',
    mirror: 'Notice the pivot point you stand upon. This uncertainty is pregnant with possibility.'
  },
  'Descending': {
    mentor: 'The valley before you is not punishment but passage. Walk through with eyes open.',
    oracle: 'The descent carries you toward what needs tending. Do not fight the gravity of growth.',
    companion: 'Things are a bit challenging right now. It\'s not forever—focus on what you can control.',
    mirror: 'Notice the difficulty without judgment. This descent is asking something of you—listen.'
  },
  'Transforming': {
    mentor: 'What you were is becoming what you will be. Surrender to the process without losing yourself.',
    oracle: 'The chrysalis stage is neither caterpillar nor butterfly. Trust the formlessness.',
    companion: 'A lot is changing right now. It might feel chaotic, but something new is emerging.',
    mirror: 'Notice the transformation in progress. You cannot return to before; you can only become.'
  }
};

/**
 * Get destiny trajectory persona voice
 */
export function getDestinyTrajectoryPersonaVoice(
  result: DestinyTrajectoryOverlayResult,
  role: 'mentor' | 'oracle' | 'companion' | 'mirror'
): string {
  return DestinyTrajectoryPersonaVoices[result.trajectory][role];
}

// ========================================
// PILGRIM JOURNEY CHAMBER
// ========================================

export interface DestinyTrajectoryChamber {
  id: string;
  name: string;
  description: string;
  trajectory: Trajectory;
}

export const DestinyTrajectoryChambers: Record<Trajectory, DestinyTrajectoryChamber> = {
  'Ascending': {
    id: 'stairway-of-favorable-winds',
    name: 'The Stairway of Favorable Winds',
    description: 'You climb the Stairway of Favorable Winds, where each step lifts you higher than effort alone could reach. Here, timing serves your ascent—receive the blessing.',
    trajectory: 'Ascending'
  },
  'Stable': {
    id: 'plateau-of-deepening',
    name: 'The Plateau of Deepening',
    description: 'You rest upon the Plateau of Deepening, where the view is clear and the ground is solid. Here, stillness offers what movement cannot—roots growing downward.',
    trajectory: 'Stable'
  },
  'Crossroads': {
    id: 'chamber-of-branching-paths',
    name: 'The Chamber of Branching Paths',
    description: 'You stand in the Chamber of Branching Paths, where multiple futures await your choice. Here, intention becomes direction—which way calls to your heart?',
    trajectory: 'Crossroads'
  },
  'Descending': {
    id: 'valley-of-necessary-passage',
    name: 'The Valley of Necessary Passage',
    description: 'You descend into the Valley of Necessary Passage, where the path leads down before it can rise again. Here, what falls away was ready to release.',
    trajectory: 'Descending'
  },
  'Transforming': {
    id: 'cocoon-chamber-of-becoming',
    name: 'The Cocoon Chamber of Becoming',
    description: 'You enter the Cocoon Chamber of Becoming, where form dissolves into potential. Here, you are neither what you were nor what you will be—trust the process.',
    trajectory: 'Transforming'
  }
};

/**
 * Get destiny trajectory chamber narrative
 */
export function getDestinyTrajectoryChamberNarrative(result: DestinyTrajectoryOverlayResult): string {
  const chamber = DestinyTrajectoryChambers[result.trajectory];
  return chamber.description;
}
