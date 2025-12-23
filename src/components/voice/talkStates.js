/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TALK STATES - Turn-Taking State Machine Constants
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Defines the six states of natural conversation flow between user and Luna.
 * Based on human conversational timing research.
 *
 * Created: December 21, 2025
 */

/**
 * Conversation states for turn-taking
 */
export const STATES = {
  USER_SPEAKING: 'USER_SPEAKING',      // User is actively talking
  MICRO_PAUSE: 'MICRO_PAUSE',          // 0-300ms silence (breathing, mid-sentence)
  SHORT_PAUSE: 'SHORT_PAUSE',          // 300-900ms silence (between sentences)
  THINKING_PAUSE: 'THINKING_PAUSE',    // 900-2000ms silence (user thinking)
  COMPLETION_PAUSE: 'COMPLETION_PAUSE', // 2000ms+ silence (user likely done)
  AI_SPEAKING: 'AI_SPEAKING'           // Luna is responding
};

/**
 * Timing thresholds in milliseconds
 */
export const TIMING = {
  MICRO_PAUSE_MAX: 300,      // Max duration for micro-pause
  SHORT_PAUSE_MAX: 900,      // Max duration for short pause
  THINKING_PAUSE_MAX: 2000,  // Max duration for thinking pause
  MIN_CUE_INTERVAL: 800,     // Minimum time between cues (avoid spam)
  AUDIO_FRAME_INTERVAL: 80   // How often to check audio state
};

/**
 * Active listening cue types
 */
export const CUE_TYPES = {
  BACKCHANNEL: 'backchannel',      // Soft "mm", "uh-huh"
  ENCOURAGER: 'encourager',        // "I see...", "Right..."
  CONTINUATION: 'continuation'     // "Go on...", "I'm listening..."
};

/**
 * Backchannel sounds (non-verbal acknowledgments)
 */
export const BACKCHANNELS = [
  { text: 'mm', audio: null },
  { text: 'mm-hmm', audio: null },
  { text: 'uh-huh', audio: null }
];

/**
 * Verbal encouragers (short acknowledgments)
 */
export const ENCOURAGERS = [
  { text: 'I see...', tone: 'neutral' },
  { text: 'Right...', tone: 'warm' },
  { text: 'Okay...', tone: 'neutral' },
  { text: 'Got it...', tone: 'warm' },
  { text: 'Interesting...', tone: 'curious' }
];

/**
 * Continuation signals (invitations to keep talking)
 */
export const CONTINUATIONS = [
  { text: 'Go on...', tone: 'gentle' },
  { text: "I'm listening...", tone: 'warm' },
  { text: 'What happened next...', tone: 'curious' },
  { text: 'Take your time...', tone: 'soft' }
];

/**
 * State descriptions for UI/debugging
 */
export const STATE_DESCRIPTIONS = {
  [STATES.USER_SPEAKING]: 'Listening to you...',
  [STATES.MICRO_PAUSE]: 'Still listening...',
  [STATES.SHORT_PAUSE]: 'I hear you...',
  [STATES.THINKING_PAUSE]: 'Take your time...',
  [STATES.COMPLETION_PAUSE]: 'Preparing response...',
  [STATES.AI_SPEAKING]: 'Luna is speaking...'
};

/**
 * Get random item from array
 */
export function getRandomCue(cueArray) {
  return cueArray[Math.floor(Math.random() * cueArray.length)];
}

export default STATES;
