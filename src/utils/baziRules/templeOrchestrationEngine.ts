/**
 * ============================================
 * ANCESTRAL TEMPLE ORCHESTRATION ENGINE
 * The central conductor that coordinates:
 * - State machine
 * - Lighting
 * - Soundscape
 * - Dialogue
 * - Rituals
 * - Hypergraph
 * - Navigation
 * - Animations
 *
 * This is the brain of the Ancestral Temple.
 * ============================================
 */

import { TempleStateMachine, TempleEvent, TempleContext, createTempleStateMachine } from './ancestralTempleStateMachine';
import { TempleSoundscape, createSoundscape, SoundTrigger } from './templeSoundscape';
import { LightingState, LightingTrigger, computeLighting, getLightingPreset } from './templeLighting';
import { ResonantDialogueTurn, ResonantDialogue, EmotionalProfile } from './advancedDialogue';
import { MythosHypergraph } from './mythosHypergraph';
import { AnimationTrigger, applyAnimationsByTrigger } from './templeAnimationLayer';

// ==================== DATA MODEL ====================

export interface OrchestrationState {
  currentLighting: LightingState;
  activeSounds: string[];
  activeAnimations: string[];
  currentTheme?: string;
  currentArchetypeId?: string;
  dialogueHistory: ResonantDialogueTurn[];
  orchestrationLog: OrchestrationLogEntry[];
}

export interface OrchestrationLogEntry {
  timestamp: number;
  action: string;
  details: Record<string, unknown>;
}

export interface TempleOrchestrationEngine {
  stateMachine: TempleStateMachine;
  soundscape: TempleSoundscape;
  hypergraph: MythosHypergraph | null;
  state: OrchestrationState;

  // Core actions
  applyDialogue(turn: ResonantDialogueTurn): void;
  navigate(route: string): void;
  startRitual(theme: string): void;
  enterMythos(archetypeId: string): void;
  beginHealing(theme: string): void;
  crossThreshold(): void;
  complete(): void;
  exit(): void;

  // State queries
  getState(): OrchestrationState;
  getTempleState(): TempleContext;
  isInActiveSession(): boolean;

  // Utility
  log(action: string, details?: Record<string, unknown>): void;
  reset(): void;
}

// ==================== ORCHESTRATION ENGINE FACTORY ====================

/**
 * Create a new Temple Orchestration Engine
 */
export function createTempleOrchestrationEngine(
  hypergraph?: MythosHypergraph
): TempleOrchestrationEngine {
  const stateMachine = createTempleStateMachine();
  const soundscape = createSoundscape();

  const state: OrchestrationState = {
    currentLighting: getLightingPreset('idle'),
    activeSounds: [],
    activeAnimations: [],
    dialogueHistory: [],
    orchestrationLog: []
  };

  const engine: TempleOrchestrationEngine = {
    stateMachine,
    soundscape,
    hypergraph: hypergraph || null,
    state,

    applyDialogue(turn: ResonantDialogueTurn): void {
      // 1. Update state machine
      stateMachine.dispatch('NAVIGATE', { route: 'dialogue' });

      // 2. Play dialogue sound
      soundscape.play('dialogue');
      state.activeSounds.push('dialogue');

      // 3. Compute and apply lighting based on emotion
      const lightingTrigger: LightingTrigger = {
        id: `dialogue-${turn.id}`,
        event: 'dialogue',
        emotion: turn.emotion,
        theme: turn.theme
      };
      state.currentLighting = computeLighting(lightingTrigger);

      // 4. Trigger animations
      state.activeAnimations = ['fade-in', 'dialogue'];

      // 5. Update state
      state.currentTheme = turn.theme;
      state.dialogueHistory.push(turn);

      // 6. Log
      this.log('applyDialogue', {
        turnId: turn.id,
        speaker: turn.speaker,
        theme: turn.theme,
        emotion: turn.emotion
      });
    },

    navigate(route: string): void {
      // 1. Update state machine
      stateMachine.dispatch('NAVIGATE', { route });

      // 2. Play navigation sound
      soundscape.play('navigate');
      state.activeSounds = ['navigate'];

      // 3. Apply navigation lighting
      state.currentLighting = getLightingPreset('navigate');

      // 4. Trigger animations
      state.activeAnimations = ['fade-in', 'navigate'];

      // 5. Clear theme context
      state.currentTheme = undefined;
      state.currentArchetypeId = undefined;

      // 6. Log
      this.log('navigate', { route });
    },

    startRitual(theme: string): void {
      // 1. Update state machine
      stateMachine.dispatch('START_RITUAL', { theme });

      // 2. Play ritual sounds
      soundscape.play('ritual');
      state.activeSounds = ['ritual'];

      // 3. Apply ritual lighting
      const lightingTrigger: LightingTrigger = {
        id: `ritual-${theme}`,
        event: 'ritual',
        theme,
        intensity: 80
      };
      state.currentLighting = computeLighting(lightingTrigger);

      // 4. Trigger animations
      state.activeAnimations = ['pulse', 'ritual'];

      // 5. Update state
      state.currentTheme = theme;

      // 6. Log
      this.log('startRitual', { theme });
    },

    enterMythos(archetypeId: string): void {
      // 1. Update state machine
      stateMachine.dispatch('ENTER_MYTHOS', { archetypeId });

      // 2. Play mythos sound
      soundscape.play('mythos');
      state.activeSounds = ['mythos'];

      // 3. Apply mythos lighting
      state.currentLighting = getLightingPreset('mythos');

      // 4. Trigger animations
      state.activeAnimations = ['fade-in', 'mythos', 'constellation'];

      // 5. Update state
      state.currentArchetypeId = archetypeId;

      // 6. Log
      this.log('enterMythos', { archetypeId });
    },

    beginHealing(theme: string): void {
      // 1. Update state machine
      stateMachine.dispatch('BEGIN_HEALING', { theme });

      // 2. Play healing sound
      soundscape.play('healing');
      state.activeSounds = ['healing'];

      // 3. Apply healing lighting
      const lightingTrigger: LightingTrigger = {
        id: `healing-${theme}`,
        event: 'healing',
        theme,
        intensity: 60
      };
      state.currentLighting = computeLighting(lightingTrigger);

      // 4. Trigger animations
      state.activeAnimations = ['pulse', 'healing'];

      // 5. Update state
      state.currentTheme = theme;

      // 6. Log
      this.log('beginHealing', { theme });
    },

    crossThreshold(): void {
      // 1. Update state machine
      stateMachine.dispatch('CROSS_THRESHOLD', {});

      // 2. Play threshold sound
      soundscape.play('threshold');
      state.activeSounds = ['threshold'];

      // 3. Apply threshold lighting
      state.currentLighting = getLightingPreset('threshold');

      // 4. Trigger animations
      state.activeAnimations = ['threshold', 'pulse'];

      // 5. Log
      this.log('crossThreshold', {});
    },

    complete(): void {
      // 1. Update state machine
      stateMachine.dispatch('COMPLETE', {});

      // 2. Play completion sound
      soundscape.play('complete');
      state.activeSounds = ['complete'];

      // 3. Apply completion lighting
      state.currentLighting = getLightingPreset('completion');

      // 4. Trigger animations
      state.activeAnimations = ['highlight', 'complete'];

      // 5. Log
      this.log('complete', {});
    },

    exit(): void {
      // 1. Update state machine
      stateMachine.dispatch('EXIT_TEMPLE', {});

      // 2. Stop all loops and play exit sound
      soundscape.stopAllLoops(1500);
      soundscape.play('exit');
      state.activeSounds = ['exit'];

      // 3. Apply idle lighting
      state.currentLighting = getLightingPreset('idle');

      // 4. Trigger exit animations
      state.activeAnimations = ['fade-out', 'exit'];

      // 5. Clear state
      state.currentTheme = undefined;
      state.currentArchetypeId = undefined;

      // 6. Log
      this.log('exit', {});
    },

    getState(): OrchestrationState {
      return { ...state };
    },

    getTempleState(): TempleContext {
      return stateMachine.getContext();
    },

    isInActiveSession(): boolean {
      const ctx = stateMachine.getContext();
      return ctx.currentState !== 'idle' && ctx.currentState !== 'exiting';
    },

    log(action: string, details: Record<string, unknown> = {}): void {
      state.orchestrationLog.push({
        timestamp: Date.now(),
        action,
        details
      });

      // Keep log size reasonable
      if (state.orchestrationLog.length > 100) {
        state.orchestrationLog = state.orchestrationLog.slice(-50);
      }
    },

    reset(): void {
      // Reset state machine
      stateMachine.dispatch('EXIT_TEMPLE', {});

      // Stop all sounds
      soundscape.stopAllLoops(500);

      // Reset state
      state.currentLighting = getLightingPreset('idle');
      state.activeSounds = [];
      state.activeAnimations = [];
      state.currentTheme = undefined;
      state.currentArchetypeId = undefined;
      state.dialogueHistory = [];
      state.orchestrationLog = [];

      this.log('reset', {});
    }
  };

  return engine;
}

// ==================== ORCHESTRATION HELPERS ====================

/**
 * Apply a complete dialogue sequence
 */
export function orchestrateDialogueSequence(
  engine: TempleOrchestrationEngine,
  dialogue: ResonantDialogue,
  delayBetweenTurns: number = 2000
): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;

    const applyNextTurn = () => {
      if (index >= dialogue.turns.length) {
        resolve();
        return;
      }

      engine.applyDialogue(dialogue.turns[index]);
      index++;

      setTimeout(applyNextTurn, delayBetweenTurns);
    };

    applyNextTurn();
  });
}

/**
 * Orchestrate a ritual sequence
 */
export function orchestrateRitualSequence(
  engine: TempleOrchestrationEngine,
  themes: string[],
  delayBetweenPhases: number = 3000
): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;

    const applyNextPhase = () => {
      if (index >= themes.length) {
        engine.complete();
        resolve();
        return;
      }

      engine.startRitual(themes[index]);
      index++;

      setTimeout(applyNextPhase, delayBetweenPhases);
    };

    engine.crossThreshold();
    setTimeout(applyNextPhase, 1500);
  });
}

/**
 * Get orchestration summary
 */
export function getOrchestrationSummary(
  engine: TempleOrchestrationEngine
): string {
  const state = engine.getState();
  const templeState = engine.getTempleState();

  return `
═══════════════════════════════════════
🎭 TEMPLE ORCHESTRATION STATUS
═══════════════════════════════════════

State: ${templeState.currentState}
Route: ${templeState.currentRoute || 'none'}
Chamber: ${templeState.currentChamber || 'none'}

Current Theme: ${state.currentTheme || 'none'}
Current Archetype: ${state.currentArchetypeId || 'none'}

Lighting:
  Hue: ${state.currentLighting.hue}°
  Saturation: ${state.currentLighting.saturation}%
  Brightness: ${state.currentLighting.brightness}%
  Pulse: ${state.currentLighting.pulse ? 'Yes' : 'No'}

Active Sounds: ${state.activeSounds.join(', ') || 'none'}
Active Animations: ${state.activeAnimations.join(', ') || 'none'}

Dialogue History: ${state.dialogueHistory.length} turns
Log Entries: ${state.orchestrationLog.length}

═══════════════════════════════════════
  `.trim();
}

/**
 * Format orchestration log for display
 */
export function formatOrchestrationLog(
  engine: TempleOrchestrationEngine,
  maxEntries: number = 20
): string {
  const state = engine.getState();
  const entries = state.orchestrationLog.slice(-maxEntries);

  if (entries.length === 0) {
    return 'No orchestration log entries.';
  }

  return entries.map(entry => {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    const details = Object.entries(entry.details)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(', ');
    return `[${time}] ${entry.action}${details ? ` (${details})` : ''}`;
  }).join('\n');
}

// ==================== EXPORTS ====================

export {
  createTempleOrchestrationEngine,
  orchestrateDialogueSequence,
  orchestrateRitualSequence,
  getOrchestrationSummary,
  formatOrchestrationLog
};
