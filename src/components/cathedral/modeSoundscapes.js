/**
 * modeSoundscapes.js
 *
 * Mode-specific ambient soundscape configurations.
 * Defines conceptual sound palettes that can be implemented with Web Audio API
 * or integrated with external audio libraries.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// SOUNDSCAPE TYPES
// ============================================================================

/**
 * Soundscape layer types:
 * - drone: Sustained harmonic foundation
 * - texture: Ambient texture layers
 * - accent: Occasional melodic accents
 * - transition: Sounds for state changes
 * - interaction: Feedback for user actions
 */

// ============================================================================
// MODE SOUNDSCAPES
// ============================================================================

export const MODE_SOUNDSCAPES = {
  pilgrim: {
    name: 'Breath of the Inner Temple',
    description: 'Soft, warm drones that support contemplation and inner journey',

    // Musical foundation
    key: 'D',
    mode: 'dorian',
    tempo: 60, // BPM - breathing pace

    // Layer definitions
    layers: {
      drone: {
        notes: ['D2', 'A2', 'D3'],
        waveform: 'sine',
        attack: 4.0,
        release: 6.0,
        volume: 0.3,
        filter: {
          type: 'lowpass',
          frequency: 400,
          Q: 1,
        },
      },
      texture: {
        type: 'wind',
        intensity: 0.2,
        variation: 0.4,
        filter: {
          type: 'bandpass',
          frequency: 800,
          Q: 2,
        },
      },
      accent: {
        notes: ['D4', 'F4', 'A4', 'G4'],
        probability: 0.1, // 10% chance per bar
        waveform: 'triangle',
        attack: 0.5,
        release: 3.0,
        volume: 0.15,
      },
    },

    // Transition sounds
    transitions: {
      chamberEnter: {
        type: 'swell',
        duration: 2000,
        notes: ['D3', 'A3'],
      },
      chamberExit: {
        type: 'fade',
        duration: 1500,
      },
      revelation: {
        type: 'chime',
        notes: ['D5', 'A5', 'D6'],
        duration: 3000,
      },
    },

    // Interaction sounds
    interactions: {
      select: {
        note: 'A4',
        duration: 200,
        volume: 0.2,
      },
      confirm: {
        notes: ['D4', 'A4'],
        duration: 400,
        volume: 0.25,
      },
      hover: {
        note: 'D5',
        duration: 100,
        volume: 0.1,
      },
    },
  },

  scholar: {
    name: 'Ink & Lanterns',
    description: 'Contemplative atmosphere of a midnight study',

    key: 'G',
    mode: 'mixolydian',
    tempo: 72,

    layers: {
      drone: {
        notes: ['G2', 'D3', 'B2'],
        waveform: 'sine',
        attack: 3.0,
        release: 5.0,
        volume: 0.25,
        filter: {
          type: 'lowpass',
          frequency: 500,
          Q: 0.8,
        },
      },
      texture: {
        type: 'paper',
        samples: ['page_turn', 'quill_scratch'],
        probability: 0.05,
        volume: 0.1,
      },
      accent: {
        notes: ['G4', 'B4', 'D5', 'F#4'],
        probability: 0.15,
        waveform: 'triangle',
        attack: 0.3,
        release: 2.0,
        volume: 0.12,
      },
    },

    transitions: {
      chamberEnter: {
        type: 'unfold',
        duration: 1500,
        notes: ['G3', 'B3', 'D4'],
      },
      chamberExit: {
        type: 'close',
        duration: 1200,
      },
      annotation: {
        type: 'highlight',
        note: 'B4',
        duration: 500,
      },
    },

    interactions: {
      select: {
        note: 'D4',
        duration: 150,
        volume: 0.18,
      },
      confirm: {
        notes: ['G4', 'B4'],
        duration: 300,
        volume: 0.22,
      },
      hover: {
        note: 'G5',
        duration: 80,
        volume: 0.08,
      },
      annotate: {
        type: 'scratch',
        duration: 200,
        volume: 0.15,
      },
    },
  },

  architect: {
    name: 'Blueprint Engine',
    description: 'Precise, mechanical soundscape of construction and analysis',

    key: 'E',
    mode: 'phrygian',
    tempo: 90,

    layers: {
      drone: {
        notes: ['E2', 'B2'],
        waveform: 'sawtooth',
        attack: 0.5,
        release: 2.0,
        volume: 0.2,
        filter: {
          type: 'lowpass',
          frequency: 300,
          Q: 2,
        },
        modulation: {
          type: 'pulse',
          rate: 0.25,
          depth: 0.1,
        },
      },
      texture: {
        type: 'digital',
        pattern: 'grid_scan',
        intensity: 0.3,
        filter: {
          type: 'bandpass',
          frequency: 2000,
          Q: 4,
        },
      },
      accent: {
        notes: ['E4', 'G4', 'B4'],
        probability: 0.2,
        waveform: 'square',
        attack: 0.05,
        release: 0.5,
        volume: 0.1,
      },
    },

    transitions: {
      chamberEnter: {
        type: 'boot',
        duration: 800,
        sequence: ['E3', 'B3', 'E4'],
      },
      chamberExit: {
        type: 'shutdown',
        duration: 600,
      },
      debug: {
        type: 'scan',
        notes: ['E5', 'G5', 'B5'],
        duration: 400,
      },
    },

    interactions: {
      select: {
        note: 'B4',
        waveform: 'square',
        duration: 50,
        volume: 0.2,
      },
      confirm: {
        notes: ['E4', 'B4'],
        waveform: 'square',
        duration: 100,
        volume: 0.25,
      },
      hover: {
        note: 'E5',
        duration: 30,
        volume: 0.1,
      },
      toggle: {
        type: 'click',
        duration: 20,
        volume: 0.15,
      },
    },
  },

  sovereign: {
    name: 'Obsidian Throne',
    description: 'Commanding presence with golden resonance',

    key: 'A',
    mode: 'minor',
    tempo: 80,

    layers: {
      drone: {
        notes: ['A1', 'E2', 'A2'],
        waveform: 'sine',
        attack: 2.0,
        release: 4.0,
        volume: 0.35,
        filter: {
          type: 'lowpass',
          frequency: 250,
          Q: 0.5,
        },
      },
      texture: {
        type: 'presence',
        intensity: 0.15,
        warmth: 0.8,
        filter: {
          type: 'highshelf',
          frequency: 3000,
          gain: 3,
        },
      },
      accent: {
        notes: ['A4', 'C5', 'E5'],
        probability: 0.08,
        waveform: 'sine',
        attack: 0.2,
        release: 2.5,
        volume: 0.2,
      },
    },

    transitions: {
      chamberEnter: {
        type: 'ascend',
        duration: 1000,
        notes: ['A2', 'E3', 'A3'],
      },
      chamberExit: {
        type: 'dissolve',
        duration: 800,
      },
      command: {
        type: 'pulse',
        note: 'A4',
        duration: 600,
        reverb: 0.7,
      },
      decision: {
        type: 'resolve',
        notes: ['A3', 'C4', 'E4', 'A4'],
        duration: 1200,
      },
    },

    interactions: {
      select: {
        note: 'E4',
        duration: 120,
        volume: 0.22,
        reverb: 0.3,
      },
      confirm: {
        notes: ['A3', 'E4'],
        duration: 300,
        volume: 0.3,
        reverb: 0.4,
      },
      hover: {
        note: 'A5',
        duration: 60,
        volume: 0.12,
      },
      decree: {
        type: 'gong',
        note: 'A2',
        duration: 2000,
        volume: 0.4,
        reverb: 0.8,
      },
    },
  },
};

// ============================================================================
// SOUNDSCAPE UTILITIES
// ============================================================================

/**
 * Get soundscape configuration for a mode.
 */
export function getSoundscape(mode) {
  return MODE_SOUNDSCAPES[mode] || MODE_SOUNDSCAPES.pilgrim;
}

/**
 * Get transition sound config for a mode and transition type.
 */
export function getTransitionSound(mode, transitionType) {
  const soundscape = getSoundscape(mode);
  return soundscape.transitions[transitionType] || null;
}

/**
 * Get interaction sound config for a mode and interaction type.
 */
export function getInteractionSound(mode, interactionType) {
  const soundscape = getSoundscape(mode);
  return soundscape.interactions[interactionType] || soundscape.interactions.select;
}

/**
 * Calculate frequency from note name (e.g., 'A4' -> 440)
 */
export function noteToFrequency(note) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 440;

  const [, noteName, octave] = match;
  const semitone = notes.indexOf(noteName);
  const midiNote = semitone + (parseInt(octave) + 1) * 12;
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

/**
 * Convert notes array to frequencies.
 */
export function notesToFrequencies(notes) {
  return notes.map(noteToFrequency);
}

// ============================================================================
// SOUNDSCAPE CONTEXT HOOK (for React integration)
// ============================================================================

/**
 * Hook configuration for soundscape integration.
 * Actual implementation would use Web Audio API or Tone.js.
 */
export const SOUNDSCAPE_HOOK_CONFIG = {
  autoStart: false,
  masterVolume: 0.7,
  fadeTime: 500,
  respectReducedMotion: true, // Also reduces audio for accessibility
  storageKey: 'cathedralSoundEnabled',
};

// ============================================================================
// AMBIENT PATTERNS
// ============================================================================

/**
 * Pre-defined ambient patterns that can be layered.
 */
export const AMBIENT_PATTERNS = {
  breath: {
    name: 'Breath',
    description: 'Slow volume oscillation mimicking breathing',
    rate: 0.1, // Hz
    depth: 0.3,
    shape: 'sine',
  },
  pulse: {
    name: 'Pulse',
    description: 'Rhythmic low-frequency pulse',
    rate: 0.5,
    depth: 0.2,
    shape: 'square',
  },
  shimmer: {
    name: 'Shimmer',
    description: 'High-frequency sparkle effect',
    rate: 4,
    depth: 0.1,
    shape: 'triangle',
  },
  drift: {
    name: 'Drift',
    description: 'Slow random pitch drift',
    rate: 0.05,
    depth: 0.02,
    shape: 'noise',
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MODE_SOUNDSCAPES,
  getSoundscape,
  getTransitionSound,
  getInteractionSound,
  noteToFrequency,
  notesToFrequencies,
  SOUNDSCAPE_HOOK_CONFIG,
  AMBIENT_PATTERNS,
};
