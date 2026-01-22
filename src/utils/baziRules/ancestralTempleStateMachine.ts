/**
 * ============================================
 * ANCESTRAL TEMPLE STATE MACHINE
 * Deterministic state machine governing movement
 * through the Ancestral Temple
 *
 * This controls:
 * - Entry into the temple
 * - Navigation between chambers
 * - Initiation flow
 * - Ritual execution
 * - Mythos exploration
 * - Exit from the temple
 * ============================================
 */

// ==================== STATE TYPES ====================

export type TempleState =
  | 'idle'           // Not in temple
  | 'entering'       // Approaching the gate
  | 'initiating'     // Undergoing initiation
  | 'navigating'     // Moving through temple
  | 'ritual'         // Performing a ritual
  | 'dialogue'       // In ancestral dialogue
  | 'mythos'         // Exploring mythos codex
  | 'healing'        // On healing path
  | 'timeline'       // Viewing timeline
  | 'exiting';       // Leaving temple

export type TempleEvent =
  | 'ENTER_TEMPLE'
  | 'BEGIN_INITIATION'
  | 'COMPLETE_INITIATION'
  | 'SKIP_INITIATION'
  | 'NAVIGATE'
  | 'START_RITUAL'
  | 'COMPLETE_RITUAL'
  | 'CANCEL_RITUAL'
  | 'START_DIALOGUE'
  | 'END_DIALOGUE'
  | 'ENTER_MYTHOS'
  | 'EXIT_MYTHOS'
  | 'START_HEALING'
  | 'COMPLETE_HEALING_STEP'
  | 'END_HEALING'
  | 'VIEW_TIMELINE'
  | 'CLOSE_TIMELINE'
  | 'EXIT_TEMPLE'
  | 'RESET';

// ==================== CONTEXT ====================

export interface TempleContext {
  currentRoute?: string;
  previousRoute?: string;
  initiationCompleted: boolean;
  initiationSkipped: boolean;
  activeRitual?: string;
  activeDialogueId?: string;
  activeMythosId?: string;
  activeHealingStepIndex?: number;
  completedRituals: string[];
  completedHealingSteps: string[];
  visitedChambers: string[];
  enteredAt?: number;
  lastTransitionAt?: number;
}

export interface TransitionResult {
  previousState: TempleState;
  newState: TempleState;
  context: TempleContext;
  allowed: boolean;
  reason?: string;
}

// ==================== STATE MACHINE ====================

export interface TempleStateMachine {
  state: TempleState;
  context: TempleContext;
  dispatch(event: TempleEvent, payload?: Record<string, any>): TransitionResult;
  canDispatch(event: TempleEvent): boolean;
  getAvailableEvents(): TempleEvent[];
  reset(): void;
}

/**
 * Create the ancestral temple state machine
 */
export function createTempleStateMachine(): TempleStateMachine {
  let state: TempleState = 'idle';
  let context: TempleContext = {
    initiationCompleted: false,
    initiationSkipped: false,
    completedRituals: [],
    completedHealingSteps: [],
    visitedChambers: []
  };

  // Define valid transitions
  const transitions: Record<TempleState, Partial<Record<TempleEvent, TempleState>>> = {
    idle: {
      ENTER_TEMPLE: 'entering'
    },
    entering: {
      BEGIN_INITIATION: 'initiating',
      SKIP_INITIATION: 'navigating',
      EXIT_TEMPLE: 'exiting'
    },
    initiating: {
      COMPLETE_INITIATION: 'navigating',
      EXIT_TEMPLE: 'exiting'
    },
    navigating: {
      NAVIGATE: 'navigating',
      START_RITUAL: 'ritual',
      START_DIALOGUE: 'dialogue',
      ENTER_MYTHOS: 'mythos',
      START_HEALING: 'healing',
      VIEW_TIMELINE: 'timeline',
      EXIT_TEMPLE: 'exiting'
    },
    ritual: {
      COMPLETE_RITUAL: 'navigating',
      CANCEL_RITUAL: 'navigating'
    },
    dialogue: {
      END_DIALOGUE: 'navigating'
    },
    mythos: {
      EXIT_MYTHOS: 'navigating',
      NAVIGATE: 'navigating'
    },
    healing: {
      COMPLETE_HEALING_STEP: 'healing',
      END_HEALING: 'navigating'
    },
    timeline: {
      CLOSE_TIMELINE: 'navigating',
      NAVIGATE: 'navigating'
    },
    exiting: {
      // Terminal state, only RESET can exit
    }
  };

  const machine: TempleStateMachine = {
    get state() { return state; },
    get context() { return { ...context }; },

    dispatch(event, payload = {}) {
      const previousState = state;
      const newStateCandidate = transitions[state]?.[event];

      // Check if transition is valid
      if (!newStateCandidate) {
        return {
          previousState,
          newState: state,
          context: { ...context },
          allowed: false,
          reason: `Event "${event}" not allowed from state "${state}"`
        };
      }

      // Special validation for initiation-required chambers
      if (event === 'START_RITUAL' || event === 'START_DIALOGUE' || event === 'START_HEALING') {
        if (!context.initiationCompleted && !context.initiationSkipped) {
          return {
            previousState,
            newState: state,
            context: { ...context },
            allowed: false,
            reason: 'Initiation required before accessing this chamber'
          };
        }
      }

      // Update state
      state = newStateCandidate;
      context.lastTransitionAt = Date.now();

      // Handle context updates based on event
      switch (event) {
        case 'ENTER_TEMPLE':
          context.enteredAt = Date.now();
          break;

        case 'BEGIN_INITIATION':
          // No special context update needed
          break;

        case 'COMPLETE_INITIATION':
          context.initiationCompleted = true;
          break;

        case 'SKIP_INITIATION':
          context.initiationSkipped = true;
          break;

        case 'NAVIGATE':
          if (payload.route) {
            context.previousRoute = context.currentRoute;
            context.currentRoute = payload.route;
            if (!context.visitedChambers.includes(payload.route)) {
              context.visitedChambers.push(payload.route);
            }
          }
          break;

        case 'START_RITUAL':
          context.activeRitual = payload.theme || payload.ritualId;
          break;

        case 'COMPLETE_RITUAL':
          if (context.activeRitual) {
            context.completedRituals.push(context.activeRitual);
          }
          context.activeRitual = undefined;
          break;

        case 'CANCEL_RITUAL':
          context.activeRitual = undefined;
          break;

        case 'START_DIALOGUE':
          context.activeDialogueId = payload.dialogueId;
          break;

        case 'END_DIALOGUE':
          context.activeDialogueId = undefined;
          break;

        case 'ENTER_MYTHOS':
          context.activeMythosId = payload.archetypeId;
          break;

        case 'EXIT_MYTHOS':
          context.activeMythosId = undefined;
          break;

        case 'START_HEALING':
          context.activeHealingStepIndex = 0;
          break;

        case 'COMPLETE_HEALING_STEP':
          if (payload.stepId) {
            context.completedHealingSteps.push(payload.stepId);
          }
          if (context.activeHealingStepIndex !== undefined) {
            context.activeHealingStepIndex++;
          }
          break;

        case 'END_HEALING':
          context.activeHealingStepIndex = undefined;
          break;

        case 'VIEW_TIMELINE':
          // No special context update
          break;

        case 'CLOSE_TIMELINE':
          // No special context update
          break;

        case 'EXIT_TEMPLE':
          // Preserve context for potential return
          break;

        case 'RESET':
          // Handled separately
          break;
      }

      return {
        previousState,
        newState: state,
        context: { ...context },
        allowed: true
      };
    },

    canDispatch(event) {
      return transitions[state]?.[event] !== undefined;
    },

    getAvailableEvents() {
      const available: TempleEvent[] = [];
      const stateTransitions = transitions[state];

      if (stateTransitions) {
        (Object.keys(stateTransitions) as TempleEvent[]).forEach(event => {
          available.push(event);
        });
      }

      // Always allow RESET
      available.push('RESET');

      return available;
    },

    reset() {
      state = 'idle';
      context = {
        initiationCompleted: false,
        initiationSkipped: false,
        completedRituals: [],
        completedHealingSteps: [],
        visitedChambers: []
      };
    }
  };

  return machine;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if pilgrim is in an active session state
 */
export function isInActiveSession(machine: TempleStateMachine): boolean {
  return !['idle', 'exiting'].includes(machine.state);
}

/**
 * Check if pilgrim is in a blocking state (ritual, dialogue, etc.)
 */
export function isInBlockingState(machine: TempleStateMachine): boolean {
  return ['ritual', 'dialogue', 'healing', 'initiating'].includes(machine.state);
}

/**
 * Check if pilgrim can navigate freely
 */
export function canNavigateFreely(machine: TempleStateMachine): boolean {
  return machine.state === 'navigating' || machine.state === 'mythos' || machine.state === 'timeline';
}

/**
 * Get chamber access status
 */
export function getChamberAccess(
  machine: TempleStateMachine,
  chamberId: string
): { accessible: boolean; reason?: string } {
  const ctx = machine.context;

  // Always accessible
  const publicChambers = ['generational_ladder', 'generational_constellation', 'timeline', 'mythos_codex'];
  if (publicChambers.includes(chamberId)) {
    return { accessible: true };
  }

  // Requires initiation
  const initiationRequired = ['dialogue_engine', 'healing_path', 'ritual'];
  if (initiationRequired.includes(chamberId)) {
    if (!ctx.initiationCompleted && !ctx.initiationSkipped) {
      return { accessible: false, reason: 'Initiation required' };
    }
  }

  return { accessible: true };
}

/**
 * Get state label for display
 */
export function getStateLabel(state: TempleState, lang: 'en' | 'zh' = 'en'): string {
  const labels: Record<TempleState, { en: string; zh: string }> = {
    idle: { en: 'Outside the Temple', zh: '圣殿之外' },
    entering: { en: 'At the Gate', zh: '在门口' },
    initiating: { en: 'Undergoing Initiation', zh: '正在启蒙' },
    navigating: { en: 'Walking the Temple', zh: '漫步圣殿' },
    ritual: { en: 'Performing Ritual', zh: '执行仪式' },
    dialogue: { en: 'In Ancestral Dialogue', zh: '祖系对话中' },
    mythos: { en: 'Exploring Mythos', zh: '探索神话' },
    healing: { en: 'On Healing Path', zh: '疗愈之路' },
    timeline: { en: 'Viewing Timeline', zh: '查看时间线' },
    exiting: { en: 'Departing', zh: '离开中' }
  };

  return labels[state]?.[lang] || state;
}

/**
 * Get event label for display
 */
export function getEventLabel(event: TempleEvent, lang: 'en' | 'zh' = 'en'): string {
  const labels: Record<TempleEvent, { en: string; zh: string }> = {
    ENTER_TEMPLE: { en: 'Enter Temple', zh: '进入圣殿' },
    BEGIN_INITIATION: { en: 'Begin Initiation', zh: '开始启蒙' },
    COMPLETE_INITIATION: { en: 'Complete Initiation', zh: '完成启蒙' },
    SKIP_INITIATION: { en: 'Skip Initiation', zh: '跳过启蒙' },
    NAVIGATE: { en: 'Navigate', zh: '导航' },
    START_RITUAL: { en: 'Start Ritual', zh: '开始仪式' },
    COMPLETE_RITUAL: { en: 'Complete Ritual', zh: '完成仪式' },
    CANCEL_RITUAL: { en: 'Cancel Ritual', zh: '取消仪式' },
    START_DIALOGUE: { en: 'Start Dialogue', zh: '开始对话' },
    END_DIALOGUE: { en: 'End Dialogue', zh: '结束对话' },
    ENTER_MYTHOS: { en: 'Enter Mythos', zh: '进入神话' },
    EXIT_MYTHOS: { en: 'Exit Mythos', zh: '退出神话' },
    START_HEALING: { en: 'Start Healing', zh: '开始疗愈' },
    COMPLETE_HEALING_STEP: { en: 'Complete Step', zh: '完成步骤' },
    END_HEALING: { en: 'End Healing', zh: '结束疗愈' },
    VIEW_TIMELINE: { en: 'View Timeline', zh: '查看时间线' },
    CLOSE_TIMELINE: { en: 'Close Timeline', zh: '关闭时间线' },
    EXIT_TEMPLE: { en: 'Exit Temple', zh: '离开圣殿' },
    RESET: { en: 'Reset', zh: '重置' }
  };

  return labels[event]?.[lang] || event;
}

/**
 * Format machine state for debugging
 */
export function formatMachineState(machine: TempleStateMachine): string {
  const ctx = machine.context;
  const lines: string[] = [];

  lines.push(`State: ${machine.state}`);
  lines.push(`Initiated: ${ctx.initiationCompleted ? 'Yes' : (ctx.initiationSkipped ? 'Skipped' : 'No')}`);
  lines.push(`Current Route: ${ctx.currentRoute || 'None'}`);
  lines.push(`Visited Chambers: ${ctx.visitedChambers.length}`);
  lines.push(`Completed Rituals: ${ctx.completedRituals.length}`);
  lines.push(`Completed Healing Steps: ${ctx.completedHealingSteps.length}`);
  lines.push(`Available Events: ${machine.getAvailableEvents().join(', ')}`);

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  createTempleStateMachine,
  isInActiveSession,
  isInBlockingState,
  canNavigateFreely,
  getChamberAccess,
  getStateLabel,
  getEventLabel,
  formatMachineState
};
