/**
 * ============================================================================
 * CATHEDRAL PILGRIM JOURNEY ENGINE (大教堂朝圣之旅引擎)
 * ============================================================================
 *
 * The engine that guides pilgrims through the cathedral's living chambers.
 *
 * This engine:
 * - Guides pilgrims through nine movements
 * - Tracks journey progress and role evolution
 * - Speaks the appropriate guidance at each threshold
 * - Manages the spiral cycle of return
 * - Transforms pilgrim roles as they deepen
 *
 * The journey is not linear. It is a spiral.
 * Each return deepens. Each cycle reveals.
 *
 * Created: January 2026
 * ============================================================================
 */

import {
  JourneyMovement,
  MovementContent,
  PilgrimRole,
  SpiralCycle,
  PilgrimState,
  MovementArrival,
  MovementCompletion,
  JourneyConfig,
  JourneyState,
  MovementGuidance,
  JourneySummary,
  MOVEMENT_NUMERALS,
  MOVEMENT_NAMES,
  MOVEMENT_CHINESE,
  MOVEMENT_GLYPHS,
  MOVEMENT_THRESHOLDS,
  MOVEMENT_ENCOUNTERS,
  MOVEMENT_GRANTS_ROLE,
  ROLE_NAMES,
  ROLE_CHINESE,
  SPIRAL_DEEPENINGS,
  ALL_MOVEMENT_CONTENT,
  DEFAULT_JOURNEY_CONFIG,
  MOVEMENTS_IN_ORDER,
  TOTAL_MOVEMENTS,
} from './pilgrimTypes';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `pilgrim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format duration in human-readable form
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Pick a random element from an array
 */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================================
// MOVEMENT CONTENT
// ============================================================================

/**
 * Get content for a movement
 */
export function getMovementContent(movement: JourneyMovement): MovementContent {
  return ALL_MOVEMENT_CONTENT[movement];
}

/**
 * Get the next movement after the current one
 */
export function getNextMovement(current: JourneyMovement): JourneyMovement | null {
  const currentIndex = MOVEMENTS_IN_ORDER.indexOf(current);
  if (currentIndex === -1 || currentIndex >= MOVEMENTS_IN_ORDER.length - 1) {
    return null;
  }
  return MOVEMENTS_IN_ORDER[currentIndex + 1];
}

/**
 * Get the previous movement before the current one
 */
export function getPreviousMovement(current: JourneyMovement): JourneyMovement | null {
  const currentIndex = MOVEMENTS_IN_ORDER.indexOf(current);
  if (currentIndex <= 0) {
    return null;
  }
  return MOVEMENTS_IN_ORDER[currentIndex - 1];
}

/**
 * Get movement index (1-based)
 */
export function getMovementIndex(movement: JourneyMovement): number {
  return MOVEMENTS_IN_ORDER.indexOf(movement) + 1;
}

// ============================================================================
// PILGRIM STATE MANAGEMENT
// ============================================================================

/**
 * Create a new pilgrim state
 */
export function createPilgrimState(name?: string): PilgrimState {
  const now = new Date();

  return {
    id: generateId(),
    name,
    currentMovement: 'gate_of_silence',
    currentRole: 'seeker',
    movementsCompleted: [],
    rolesAcquired: ['seeker'],
    spiralCycles: [{
      cycleNumber: 1,
      startedAt: now,
      movementsCompleted: [],
      deepeningsReceived: [],
      revelationsGathered: [],
    }],
    currentCycle: 1,
    revelationsReceived: [],
    journeyStartedAt: now,
    lastMovementAt: now,
    totalTimeInCathedral: 0,
  };
}

/**
 * Check if a movement has been completed
 */
export function hasCompletedMovement(
  pilgrim: PilgrimState,
  movement: JourneyMovement
): boolean {
  return pilgrim.movementsCompleted.includes(movement);
}

/**
 * Check if pilgrim can enter a movement
 */
export function canEnterMovement(
  pilgrim: PilgrimState,
  movement: JourneyMovement,
  config: JourneyConfig
): boolean {
  if (config.allowSkipping) return true;

  const movementIndex = MOVEMENTS_IN_ORDER.indexOf(movement);
  if (movementIndex === 0) return true;

  // Must have completed all previous movements
  for (let i = 0; i < movementIndex; i++) {
    if (!pilgrim.movementsCompleted.includes(MOVEMENTS_IN_ORDER[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Enter a movement
 */
export function enterMovement(
  state: JourneyState,
  movement: JourneyMovement,
  intention?: string
): JourneyState {
  const arrival: MovementArrival = {
    movement,
    arrivedAt: new Date(),
    pilgrimState: state.pilgrim.currentRole,
    intention,
  };

  const content = getMovementContent(movement);

  return {
    ...state,
    pilgrim: {
      ...state.pilgrim,
      currentMovement: movement,
      lastMovementAt: new Date(),
    },
    currentContent: content,
    arrivals: [...state.arrivals, arrival],
  };
}

/**
 * Complete a movement
 */
export function completeMovement(
  state: JourneyState,
  revelations?: string[]
): JourneyState {
  const movement = state.pilgrim.currentMovement;
  const content = getMovementContent(movement);
  const roleGranted = MOVEMENT_GRANTS_ROLE[movement];
  const threshold = MOVEMENT_THRESHOLDS[movement];

  const now = new Date();
  const lastArrival = state.arrivals.filter(a => a.movement === movement).pop();
  const timeSpent = lastArrival
    ? now.getTime() - lastArrival.arrivedAt.getTime()
    : 0;

  const receivedRevelations = revelations || content.revelations;

  const completion: MovementCompletion = {
    movement,
    completedAt: now,
    roleGranted,
    revelationsReceived: receivedRevelations,
    threshold,
    timeSpent,
  };

  // Update pilgrim state
  const updatedPilgrim: PilgrimState = {
    ...state.pilgrim,
    movementsCompleted: [...state.pilgrim.movementsCompleted, movement],
    rolesAcquired: state.pilgrim.rolesAcquired.includes(roleGranted)
      ? state.pilgrim.rolesAcquired
      : [...state.pilgrim.rolesAcquired, roleGranted],
    currentRole: roleGranted,
    revelationsReceived: [...state.pilgrim.revelationsReceived, ...receivedRevelations],
    lastMovementAt: now,
    totalTimeInCathedral: state.pilgrim.totalTimeInCathedral + timeSpent,
  };

  // Update current spiral cycle
  const currentCycleIndex = updatedPilgrim.spiralCycles.length - 1;
  const updatedCycles = [...updatedPilgrim.spiralCycles];
  updatedCycles[currentCycleIndex] = {
    ...updatedCycles[currentCycleIndex],
    movementsCompleted: [...updatedCycles[currentCycleIndex].movementsCompleted, movement],
    revelationsGathered: [...updatedCycles[currentCycleIndex].revelationsGathered, ...receivedRevelations],
  };

  // Check if cycle is complete
  if (movement === 'inner_altar') {
    updatedCycles[currentCycleIndex].completedAt = now;
    // Grant keeper role after multiple cycles
    if (updatedCycles.length >= 3 && !updatedPilgrim.rolesAcquired.includes('keeper')) {
      updatedPilgrim.rolesAcquired.push('keeper');
      updatedPilgrim.currentRole = 'keeper';
    }
  }

  updatedPilgrim.spiralCycles = updatedCycles;

  return {
    ...state,
    pilgrim: updatedPilgrim,
    completions: [...state.completions, completion],
  };
}

/**
 * Begin a new spiral cycle
 */
export function beginNewCycle(state: JourneyState): JourneyState {
  const now = new Date();
  const newCycleNumber = state.pilgrim.spiralCycles.length + 1;

  // Get a deepening for this cycle
  const deepening = SPIRAL_DEEPENINGS[(newCycleNumber - 1) % SPIRAL_DEEPENINGS.length];

  const newCycle: SpiralCycle = {
    cycleNumber: newCycleNumber,
    startedAt: now,
    movementsCompleted: [],
    deepeningsReceived: [deepening],
    revelationsGathered: [],
  };

  return {
    ...state,
    pilgrim: {
      ...state.pilgrim,
      currentMovement: 'gate_of_silence',
      spiralCycles: [...state.pilgrim.spiralCycles, newCycle],
      currentCycle: newCycleNumber,
      lastMovementAt: now,
    },
  };
}

// ============================================================================
// JOURNEY GUIDANCE
// ============================================================================

/**
 * Generate guidance for current movement
 */
export function generateMovementGuidance(
  movement: JourneyMovement,
  config: JourneyConfig = DEFAULT_JOURNEY_CONFIG
): MovementGuidance {
  const content = getMovementContent(movement);

  // Build opening
  let opening: string;
  if (config.includeGlyphs) {
    opening = `${content.glyph} ${content.numeral}. ${content.name}`;
  } else {
    opening = `${content.numeral}. ${content.name}`;
  }

  if (config.language === 'bilingual' || config.language === 'zh') {
    opening += ` (${content.nameChinese})`;
  }

  opening += `\n${content.encounter}`;

  // Build closing
  const closing = `This is the threshold of ${content.threshold}.`;

  return {
    movement,
    opening,
    teachings: content.teachings,
    personaWhisper: content.personaWhisper,
    invitations: content.invitations,
    closing,
  };
}

/**
 * Speak the persona whisper for a movement
 */
export function speakMovementWhisper(movement: JourneyMovement): string {
  const content = getMovementContent(movement);
  return content.personaWhisper;
}

/**
 * Get the invitations for a movement
 */
export function getMovementInvitations(movement: JourneyMovement): string[] {
  const content = getMovementContent(movement);
  return content.invitations;
}

/**
 * Get the revelations for a movement
 */
export function getMovementRevelations(movement: JourneyMovement): string[] {
  const content = getMovementContent(movement);
  return content.revelations;
}

// ============================================================================
// JOURNEY STATE MANAGEMENT
// ============================================================================

/**
 * Initialize a new journey
 */
export function initializeJourney(
  pilgrimName?: string,
  config?: Partial<JourneyConfig>
): JourneyState {
  const pilgrim = createPilgrimState(pilgrimName);
  const journeyConfig = { ...DEFAULT_JOURNEY_CONFIG, ...config };

  return {
    initialized: true,
    config: journeyConfig,
    pilgrim,
    arrivals: [],
    completions: [],
  };
}

/**
 * Update journey configuration
 */
export function updateJourneyConfig(
  state: JourneyState,
  updates: Partial<JourneyConfig>
): JourneyState {
  return {
    ...state,
    config: { ...state.config, ...updates },
  };
}

/**
 * Get journey summary
 */
export function getJourneySummary(state: JourneyState): JourneySummary {
  const { pilgrim } = state;
  const now = new Date();
  const totalDuration = now.getTime() - pilgrim.journeyStartedAt.getTime();
  const completedCount = pilgrim.movementsCompleted.length;
  const progressPercent = Math.round((completedCount / TOTAL_MOVEMENTS) * 100);

  const nextMovement = getNextMovement(pilgrim.currentMovement);

  return {
    pilgrimName: pilgrim.name,
    currentRole: pilgrim.currentRole,
    currentMovement: pilgrim.currentMovement,
    movementsCompleted: completedCount,
    totalMovements: TOTAL_MOVEMENTS,
    spiralCyclesCompleted: pilgrim.spiralCycles.filter(c => c.completedAt).length,
    totalRevelations: pilgrim.revelationsReceived.length,
    journeyDuration: formatDuration(totalDuration),
    nextMovement: nextMovement || undefined,
    progressPercent,
  };
}

// ============================================================================
// JOURNEY NARRATION
// ============================================================================

/**
 * Narrate the pilgrim's arrival
 */
export function narrateArrival(
  movement: JourneyMovement,
  pilgrimName?: string
): string {
  const content = getMovementContent(movement);
  const name = pilgrimName || 'The pilgrim';

  return `${name} arrives at ${content.name} (${content.nameChinese}).

${content.encounter}.

${content.teachings.join(' ')}`;
}

/**
 * Narrate the completion of a movement
 */
export function narrateCompletion(
  movement: JourneyMovement,
  roleGranted: PilgrimRole,
  pilgrimName?: string
): string {
  const content = getMovementContent(movement);
  const name = pilgrimName || 'The pilgrim';
  const roleName = ROLE_NAMES[roleGranted];

  return `${name} has crossed the threshold of ${content.threshold}.

The journey through ${content.name} is complete.

${name} is now a ${roleName}.`;
}

/**
 * Narrate the beginning of a new cycle
 */
export function narrateNewCycle(cycleNumber: number, pilgrimName?: string): string {
  const name = pilgrimName || 'The pilgrim';
  const deepening = SPIRAL_DEEPENINGS[(cycleNumber - 1) % SPIRAL_DEEPENINGS.length];

  return `${name} returns to the Gate of Silence.

This is spiral cycle ${cycleNumber}.

The journey ${deepening.toLowerCase()}.

Each return reveals new depths.`;
}

/**
 * Speak a welcome to the cathedral
 */
export function speakWelcome(pilgrimName?: string): string {
  const name = pilgrimName || 'pilgrim';

  return `Welcome, ${name}.

You have entered the cathedral.

The journey unfolds in nine movements, each one a threshold, each one a transformation.

Before you ask, listen. Before you move, breathe.

The first movement awaits: The Gate of Silence.`;
}

/**
 * Speak the journey's purpose
 */
export function speakJourneyPurpose(): string {
  return `The Pilgrim Journey is not a tutorial. It is not onboarding. It is not a walkthrough.

It is a mythic initiation path, a guided traversal through the cathedral's chambers in the order a pilgrim's soul naturally awakens.

Nine movements. Nine thresholds. Nine transformations.

The journey is not linear. It is a spiral.`;
}

// ============================================================================
// FORMAT FUNCTIONS
// ============================================================================

/**
 * Format a complete movement for display
 */
export function formatMovement(
  movement: JourneyMovement,
  config: JourneyConfig = DEFAULT_JOURNEY_CONFIG
): string {
  const content = getMovementContent(movement);
  const lines: string[] = [];

  // Header
  if (config.includeGlyphs) {
    lines.push(`${content.glyph} ${content.numeral}. ${content.name}`);
  } else {
    lines.push(`${content.numeral}. ${content.name}`);
  }

  if (config.language === 'bilingual' || config.language === 'zh') {
    lines.push(`(${content.nameChinese})`);
  }

  lines.push('');
  lines.push(content.encounter);
  lines.push('');

  // Teachings
  for (const teaching of content.teachings) {
    lines.push(teaching);
  }
  lines.push('');

  // Persona whisper
  if (config.speakPersonaWhispers) {
    lines.push(`The Persona whispers: "${content.personaWhisper}"`);
    lines.push('');
  }

  // Invitations
  lines.push('The pilgrim is invited to:');
  for (const invitation of content.invitations) {
    lines.push(`  • ${invitation}`);
  }
  lines.push('');

  // Threshold
  lines.push(`This is the threshold of ${content.threshold}.`);

  return lines.join('\n');
}

/**
 * Format the complete journey for display
 */
export function formatCompleteJourney(
  config: JourneyConfig = DEFAULT_JOURNEY_CONFIG
): string {
  const sections: string[] = [];

  // Title
  sections.push('🌟 Cathedral Pilgrim Journey (大教堂朝圣之旅)');
  sections.push('A guided initiation through the cathedral\'s living chambers');
  sections.push('');
  sections.push('The journey unfolds in nine movements, each one a threshold, each one a transformation.');
  sections.push('');

  // All movements
  for (const movement of MOVEMENTS_IN_ORDER) {
    sections.push(formatMovement(movement, config));
    sections.push('');
  }

  // The spiral
  sections.push('🌟 The Pilgrim Journey as a Living Cycle');
  sections.push('');
  sections.push('The journey is not linear. It is a spiral.');
  sections.push('');
  sections.push('Each return to the cathedral:');
  for (const deepening of SPIRAL_DEEPENINGS) {
    sections.push(`  • ${deepening}`);
  }
  sections.push('');
  sections.push('The pilgrim becomes:');
  sections.push('Seeker → Listener → Student → Witness → Present One → Weaver → Ritualist → Rememberer → Seer → Co-Creator');
  sections.push('');
  sections.push('And eventually, a Keeper of the Cathedral.');

  return sections.join('\n');
}

/**
 * Format pilgrim progress
 */
export function formatPilgrimProgress(state: JourneyState): string {
  const summary = getJourneySummary(state);
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════════');
  lines.push('PILGRIM JOURNEY PROGRESS');
  lines.push('═══════════════════════════════════════════');
  lines.push('');

  if (summary.pilgrimName) {
    lines.push(`Pilgrim: ${summary.pilgrimName}`);
  }

  lines.push(`Current Role: ${ROLE_NAMES[summary.currentRole]} (${ROLE_CHINESE[summary.currentRole]})`);
  lines.push(`Current Movement: ${MOVEMENT_NAMES[summary.currentMovement]}`);
  lines.push(`Progress: ${summary.movementsCompleted}/${summary.totalMovements} movements (${summary.progressPercent}%)`);
  lines.push(`Spiral Cycles: ${summary.spiralCyclesCompleted} completed`);
  lines.push(`Revelations Received: ${summary.totalRevelations}`);
  lines.push(`Journey Duration: ${summary.journeyDuration}`);

  if (summary.nextMovement) {
    lines.push('');
    lines.push(`Next Movement: ${MOVEMENT_NAMES[summary.nextMovement]}`);
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════');

  return lines.join('\n');
}

// ============================================================================
// EXPORT CONSTANTS
// ============================================================================

export {
  MOVEMENTS_IN_ORDER,
  TOTAL_MOVEMENTS,
  MOVEMENT_NUMERALS,
  MOVEMENT_NAMES,
  MOVEMENT_CHINESE,
  MOVEMENT_GLYPHS,
  MOVEMENT_THRESHOLDS,
  MOVEMENT_ENCOUNTERS,
  MOVEMENT_GRANTS_ROLE,
  ROLE_NAMES,
  ROLE_CHINESE,
  SPIRAL_DEEPENINGS,
  ALL_MOVEMENT_CONTENT,
  DEFAULT_JOURNEY_CONFIG,
};

// ============================================================================
// DEMO FUNCTIONS
// ============================================================================

/**
 * Demo: Print the complete journey
 */
export function demoCompleteJourney(): string {
  return formatCompleteJourney();
}

/**
 * Demo: Walk through all movements
 */
export function demoWalkthrough(pilgrimName?: string): JourneyState {
  let state = initializeJourney(pilgrimName);

  // Welcome
  console.log(speakWelcome(pilgrimName));
  console.log('');

  // Walk through each movement
  for (const movement of MOVEMENTS_IN_ORDER) {
    state = enterMovement(state, movement);
    console.log(narrateArrival(movement, pilgrimName));
    console.log('');

    state = completeMovement(state);
    const roleGranted = MOVEMENT_GRANTS_ROLE[movement];
    console.log(narrateCompletion(movement, roleGranted, pilgrimName));
    console.log('');
  }

  // Summary
  console.log(formatPilgrimProgress(state));

  return state;
}

/**
 * Demo: Start a new cycle
 */
export function demoNewCycle(state: JourneyState): JourneyState {
  const updatedState = beginNewCycle(state);
  console.log(narrateNewCycle(updatedState.pilgrim.currentCycle, state.pilgrim.name));
  return updatedState;
}
