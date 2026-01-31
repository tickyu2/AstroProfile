/**
 * Pilgrim Journey Tracker
 *
 * Tracks user progress through the cathedral chambers.
 * Maps relationship outcomes to mythic journey steps.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import type { RelationshipOutcome } from './relationshipOutcome';

// ========================================
// TYPES
// ========================================

/** Single step in the pilgrim journey */
export interface PilgrimStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  outcome: RelationshipOutcome;
  colorClass: string;
  glowClass: string;
}

/** Journey state for a user */
export interface PilgrimJourneyState {
  currentStepId: string;
  passedStepIds: string[];
  journeyStarted: Date;
  lastUpdated: Date;
}

/** Progress through journey */
export interface JourneyProgress {
  current: PilgrimStep;
  passed: PilgrimStep[];
  upcoming: PilgrimStep[];
  percentComplete: number;
}

// ========================================
// PILGRIM JOURNEY STEPS
// ========================================

export const PilgrimJourneySteps: PilgrimStep[] = [
  {
    id: 'gate-of-accord',
    label: 'Gate of Accord',
    description: 'Moments of clear alignment where paths converge.',
    icon: '🌕',
    outcome: 'DoNow',
    colorClass: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/40'
  },
  {
    id: 'lantern-bridge',
    label: 'Lantern Bridge',
    description: 'Favorable but gentle openings, warm with possibility.',
    icon: '🌖',
    outcome: 'GoodWindow',
    colorClass: 'text-amber-400',
    glowClass: 'shadow-amber-500/40'
  },
  {
    id: 'still-waters',
    label: 'Still Waters',
    description: 'Neutral, observational phases where intention shapes outcome.',
    icon: '🌗',
    outcome: 'Neutral',
    colorClass: 'text-slate-400',
    glowClass: 'shadow-slate-500/30'
  },
  {
    id: 'narrowing-river',
    label: 'Narrowing River',
    description: 'Times that ask for patience and careful consideration.',
    icon: '🌘',
    outcome: 'Delay',
    colorClass: 'text-orange-400',
    glowClass: 'shadow-orange-500/40'
  },
  {
    id: 'veil-of-divergence',
    label: 'Veil of Divergence',
    description: 'Phases of misalignment where wisdom counsels retreat.',
    icon: '🌑',
    outcome: 'Avoid',
    colorClass: 'text-red-400',
    glowClass: 'shadow-red-500/40'
  }
];

// ========================================
// MAPPINGS
// ========================================

/** Map outcome to step ID */
export const OutcomeToStepId: Record<RelationshipOutcome, string> = {
  DoNow: 'gate-of-accord',
  GoodWindow: 'lantern-bridge',
  Neutral: 'still-waters',
  Delay: 'narrowing-river',
  Avoid: 'veil-of-divergence'
};

/** Map step ID to outcome */
export const StepIdToOutcome: Record<string, RelationshipOutcome> = {
  'gate-of-accord': 'DoNow',
  'lantern-bridge': 'GoodWindow',
  'still-waters': 'Neutral',
  'narrowing-river': 'Delay',
  'veil-of-divergence': 'Avoid'
};

// ========================================
// FUNCTIONS
// ========================================

/**
 * Get pilgrim step by ID
 */
export function getPilgrimStep(stepId: string): PilgrimStep | undefined {
  return PilgrimJourneySteps.find(s => s.id === stepId);
}

/**
 * Get pilgrim step by outcome
 */
export function getPilgrimStepByOutcome(outcome: RelationshipOutcome): PilgrimStep | undefined {
  const stepId = OutcomeToStepId[outcome];
  return getPilgrimStep(stepId);
}

/**
 * Get step index in journey
 */
export function getStepIndex(stepId: string): number {
  return PilgrimJourneySteps.findIndex(s => s.id === stepId);
}

/**
 * Calculate journey progress
 */
export function calculateProgress(state: PilgrimJourneyState): JourneyProgress {
  const currentIndex = getStepIndex(state.currentStepId);
  const current = PilgrimJourneySteps[currentIndex];

  const passed = state.passedStepIds
    .map(id => getPilgrimStep(id))
    .filter((s): s is PilgrimStep => s !== undefined);

  const upcoming = PilgrimJourneySteps.filter(
    s => s.id !== state.currentStepId && !state.passedStepIds.includes(s.id)
  );

  const totalSteps = PilgrimJourneySteps.length;
  const completedSteps = passed.length;
  const percentComplete = Math.round((completedSteps / totalSteps) * 100);

  return {
    current,
    passed,
    upcoming,
    percentComplete
  };
}

/**
 * Create initial journey state
 */
export function createJourneyState(startingOutcome: RelationshipOutcome): PilgrimJourneyState {
  const stepId = OutcomeToStepId[startingOutcome];
  const now = new Date();

  return {
    currentStepId: stepId,
    passedStepIds: [],
    journeyStarted: now,
    lastUpdated: now
  };
}

/**
 * Update journey state with new outcome
 */
export function updateJourneyState(
  state: PilgrimJourneyState,
  newOutcome: RelationshipOutcome
): PilgrimJourneyState {
  const newStepId = OutcomeToStepId[newOutcome];

  // Add current step to passed if it's not already there
  const passedStepIds = state.passedStepIds.includes(state.currentStepId)
    ? state.passedStepIds
    : [...state.passedStepIds, state.currentStepId];

  return {
    ...state,
    currentStepId: newStepId,
    passedStepIds,
    lastUpdated: new Date()
  };
}

/**
 * Get journey narrative
 */
export function getJourneyNarrative(state: PilgrimJourneyState): string {
  const progress = calculateProgress(state);
  const { current, passed, percentComplete } = progress;

  if (passed.length === 0) {
    return `You stand at ${current.label}, the beginning of your journey. ${current.description}`;
  }

  const passedNames = passed.map(p => p.label).join(', ');
  return `Having passed through ${passedNames}, you now arrive at ${current.label}. ${current.description} Your journey is ${percentComplete}% complete.`;
}

/**
 * Get mythic location description
 */
export function getMythicLocation(outcome: RelationshipOutcome): string {
  const locations: Record<RelationshipOutcome, string> = {
    DoNow: 'at the Gate of Immediate Accord, where the winds of timing gather in your favor',
    GoodWindow: 'upon the Lantern Bridge, its glow soft but steady, the air warm with possibility',
    Neutral: 'within the Hall of Still Waters, where nothing stirs unless you stir it',
    Delay: 'beside the Narrowing River, where the waters tighten and the stones speak of patience',
    Avoid: 'before the Veil of Divergence, where shadows cross the trail and wisdom counsels retreat'
  };

  return locations[outcome];
}

// ========================================
// CATHEDRAL MAP METADATA
// ========================================

export interface CathedralChamber {
  id: string;
  name: string;
  element: 'fire' | 'water' | 'earth' | 'air' | 'spirit';
  direction: 'north' | 'south' | 'east' | 'west' | 'center';
  purpose: string;
  ritualHour: string;
}

export const CathedralChambers: Record<string, CathedralChamber> = {
  'gate-of-accord': {
    id: 'gate-of-accord',
    name: 'The Gate of Immediate Accord',
    element: 'fire',
    direction: 'east',
    purpose: 'Convergence and clear action',
    ritualHour: 'Dawn'
  },
  'lantern-bridge': {
    id: 'lantern-bridge',
    name: 'The Lantern Bridge',
    element: 'air',
    direction: 'south',
    purpose: 'Gentle opening and possibility',
    ritualHour: 'Morning'
  },
  'still-waters': {
    id: 'still-waters',
    name: 'The Hall of Still Waters',
    element: 'water',
    direction: 'center',
    purpose: 'Observation and reflection',
    ritualHour: 'Noon'
  },
  'narrowing-river': {
    id: 'narrowing-river',
    name: 'The Narrowing River',
    element: 'earth',
    direction: 'west',
    purpose: 'Patience and discernment',
    ritualHour: 'Dusk'
  },
  'veil-of-divergence': {
    id: 'veil-of-divergence',
    name: 'The Veil of Divergence',
    element: 'spirit',
    direction: 'north',
    purpose: 'Protection and retreat',
    ritualHour: 'Midnight'
  }
};

/**
 * Get chamber metadata
 */
export function getChamberMetadata(stepId: string): CathedralChamber | undefined {
  return CathedralChambers[stepId];
}
