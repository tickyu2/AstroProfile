/**
 * modeTimelineScrubCues.js
 *
 * Mode-specific sound cues for timeline scrubbing.
 * Subtle, non-intrusive auditory signatures that play when
 * the Pilgrim interacts with timelines.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// TIMELINE SCRUB CUE CONFIGURATIONS
// ============================================================================

export const MODE_SCRUB_CUES = {
  pilgrim: {
    name: 'Soft Lantern Chime',
    description: 'A gentle glass-bell ping with warm reverb',

    // Primary scrub sound
    scrub: {
      type: 'chime',
      note: 'D5',
      waveform: 'sine',
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.8,
      volume: 0.15,
      filter: {
        type: 'lowpass',
        frequency: 4000,
        Q: 1,
      },
      reverb: {
        wet: 0.4,
        decay: 1.2,
      },
    },

    // Scrub at boundaries (start/end of timeline)
    boundary: {
      type: 'shimmer',
      notes: ['D5', 'A5'],
      waveform: 'triangle',
      attack: 0.05,
      release: 1.0,
      volume: 0.12,
    },

    // Scrub over important events
    event: {
      type: 'glow',
      note: 'A4',
      waveform: 'sine',
      attack: 0.02,
      release: 0.6,
      volume: 0.18,
      modulation: {
        type: 'vibrato',
        rate: 4,
        depth: 0.02,
      },
    },

    // Scrub velocity affects pitch shift
    velocityPitchShift: true,
    pitchRange: [0, 200], // cents

    meaning: 'A moment is passing; notice it softly.',
  },

  scholar: {
    name: 'Ink Tick',
    description: 'Crisp paper-turn with wooden metronome tick',

    scrub: {
      type: 'tick',
      note: 'G4',
      waveform: 'triangle',
      attack: 0.005,
      decay: 0.05,
      sustain: 0,
      release: 0.1,
      volume: 0.2,
      filter: {
        type: 'highpass',
        frequency: 800,
        Q: 2,
      },
      reverb: null, // No reverb - crisp
    },

    boundary: {
      type: 'page_turn',
      sample: 'paper_rustle',
      volume: 0.15,
    },

    event: {
      type: 'annotation',
      note: 'B4',
      waveform: 'square',
      attack: 0.01,
      release: 0.15,
      volume: 0.12,
      filter: {
        type: 'bandpass',
        frequency: 2000,
        Q: 4,
      },
    },

    velocityPitchShift: false,

    meaning: 'A new annotation point.',
  },

  architect: {
    name: 'Blueprint Pulse',
    description: 'Short digital blip with harmonic overtone',

    scrub: {
      type: 'blip',
      note: 'E4',
      waveform: 'square',
      attack: 0.001,
      decay: 0.02,
      sustain: 0.1,
      release: 0.05,
      volume: 0.18,
      filter: {
        type: 'lowpass',
        frequency: 2500,
        Q: 3,
      },
      subBass: {
        note: 'E2',
        volume: 0.1,
        decay: 0.1,
      },
    },

    boundary: {
      type: 'scan_end',
      notes: ['E3', 'B3'],
      waveform: 'sawtooth',
      attack: 0.01,
      release: 0.2,
      volume: 0.15,
    },

    event: {
      type: 'data_point',
      note: 'B4',
      waveform: 'square',
      attack: 0.005,
      release: 0.1,
      volume: 0.2,
      harmonic: {
        note: 'B5',
        volume: 0.08,
      },
    },

    velocityPitchShift: true,
    pitchRange: [-100, 100], // cents - can go down or up

    meaning: 'System state updated.',
  },

  sovereign: {
    name: 'Obsidian Strike',
    description: 'Low resonant thud with metallic gold overtone',

    scrub: {
      type: 'strike',
      note: 'A2',
      waveform: 'sine',
      attack: 0.01,
      decay: 0.15,
      sustain: 0.2,
      release: 0.3,
      volume: 0.25,
      filter: {
        type: 'lowpass',
        frequency: 600,
        Q: 1,
      },
      overtone: {
        note: 'A4',
        waveform: 'triangle',
        volume: 0.1,
        decay: 0.2,
      },
    },

    boundary: {
      type: 'command_tone',
      note: 'A3',
      waveform: 'sine',
      attack: 0.02,
      release: 0.5,
      volume: 0.2,
      reverb: {
        wet: 0.3,
        decay: 0.8,
      },
    },

    event: {
      type: 'decision_point',
      notes: ['A3', 'E4'],
      waveform: 'sine',
      attack: 0.01,
      release: 0.4,
      volume: 0.22,
      goldShimmer: true,
    },

    velocityPitchShift: false,

    meaning: 'A decisive moment.',
  },
};

// ============================================================================
// SCRUB INTERACTION TYPES
// ============================================================================

export const SCRUB_INTERACTIONS = {
  // Basic scrubbing
  SCRUB: 'scrub',

  // Hit start or end of timeline
  BOUNDARY: 'boundary',

  // Scrub over an event marker
  EVENT: 'event',

  // Fast scrubbing
  FAST_SCRUB: 'fast_scrub',

  // Scrub pause (held position)
  HOLD: 'hold',

  // Release from scrubbing
  RELEASE: 'release',
};

// ============================================================================
// SCRUB CUE UTILITIES
// ============================================================================

/**
 * Get scrub cue configuration for a mode.
 */
export function getScrubCue(mode) {
  return MODE_SCRUB_CUES[mode] || MODE_SCRUB_CUES.pilgrim;
}

/**
 * Get specific scrub sound for mode and interaction type.
 */
export function getScrubSound(mode, interactionType) {
  const cue = getScrubCue(mode);

  switch (interactionType) {
    case SCRUB_INTERACTIONS.BOUNDARY:
      return cue.boundary;
    case SCRUB_INTERACTIONS.EVENT:
      return cue.event;
    case SCRUB_INTERACTIONS.SCRUB:
    default:
      return cue.scrub;
  }
}

/**
 * Calculate pitch shift based on scrub velocity.
 */
export function calculateVelocityPitch(mode, velocity, direction = 1) {
  const cue = getScrubCue(mode);

  if (!cue.velocityPitchShift) return 0;

  const [min, max] = cue.pitchRange;
  const normalizedVelocity = Math.min(Math.max(velocity, 0), 1);

  return min + (max - min) * normalizedVelocity * direction;
}

/**
 * Get debounce time for scrub sounds (prevents audio spam).
 */
export function getScrubDebounce(mode) {
  const debounces = {
    pilgrim: 100,   // Slower, more contemplative
    scholar: 80,    // Medium pace
    architect: 40,  // Fast, responsive
    sovereign: 60,  // Deliberate
  };

  return debounces[mode] || 80;
}

// ============================================================================
// SCRUB PATTERN DETECTION
// ============================================================================

/**
 * Detect scrub patterns for enhanced audio feedback.
 */
export const SCRUB_PATTERNS = {
  // Slow, contemplative scrubbing
  contemplative: {
    maxVelocity: 0.2,
    minDuration: 2000,
    audioModifier: { volumeMultiplier: 0.8, reverbBoost: 1.5 },
  },

  // Searching/seeking behavior
  seeking: {
    directionChanges: 3,
    withinDuration: 1000,
    audioModifier: { pitchVariation: true },
  },

  // Decisive, direct navigation
  decisive: {
    minVelocity: 0.7,
    directionChanges: 0,
    audioModifier: { volumeMultiplier: 1.2, attackShorten: true },
  },
};

/**
 * Analyze scrub behavior and return pattern match.
 */
export function detectScrubPattern(history) {
  if (!history || history.length < 3) return null;

  const recent = history.slice(-10);
  const duration = recent[recent.length - 1].time - recent[0].time;
  const avgVelocity = recent.reduce((sum, h) => sum + h.velocity, 0) / recent.length;

  let directionChanges = 0;
  for (let i = 1; i < recent.length; i++) {
    if (Math.sign(recent[i].direction) !== Math.sign(recent[i - 1].direction)) {
      directionChanges++;
    }
  }

  // Check patterns
  if (avgVelocity <= SCRUB_PATTERNS.contemplative.maxVelocity &&
      duration >= SCRUB_PATTERNS.contemplative.minDuration) {
    return 'contemplative';
  }

  if (directionChanges >= SCRUB_PATTERNS.seeking.directionChanges &&
      duration <= SCRUB_PATTERNS.seeking.withinDuration) {
    return 'seeking';
  }

  if (avgVelocity >= SCRUB_PATTERNS.decisive.minVelocity &&
      directionChanges === SCRUB_PATTERNS.decisive.directionChanges) {
    return 'decisive';
  }

  return null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MODE_SCRUB_CUES,
  SCRUB_INTERACTIONS,
  SCRUB_PATTERNS,
  getScrubCue,
  getScrubSound,
  calculateVelocityPitch,
  getScrubDebounce,
  detectScrubPattern,
};
