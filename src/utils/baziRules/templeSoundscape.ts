/**
 * ============================================
 * ANCESTRAL TEMPLE SOUNDSCAPE LAYER
 * Ambient sound engine for the Temple
 *
 * This layer adds atmospheric audio that reacts
 * to navigation, dialogue, and ritual states:
 * - Ambient drones
 * - Soft chimes
 * - Ritual tones
 * - Ancestral whispers (non-verbal)
 * - Transition cues
 *
 * Designed to be subtle and ceremonial.
 * ============================================
 */

// ==================== DATA MODEL ====================

export type SoundTrigger =
  | 'enter'
  | 'exit'
  | 'navigate'
  | 'initiation'
  | 'dialogue'
  | 'ritual'
  | 'mythos'
  | 'healing'
  | 'timeline'
  | 'constellation'
  | 'complete'
  | 'threshold';

export interface SoundEvent {
  id: string;
  trigger: SoundTrigger;
  file: string;            // Path to audio file
  volume: number;          // 0.0 - 1.0
  loop?: boolean;
  fadeIn?: number;         // ms
  fadeOut?: number;        // ms
  delay?: number;          // ms before playing
}

export interface SoundscapeState {
  activeLoops: Map<string, HTMLAudioElement>;
  isMuted: boolean;
  masterVolume: number;
}

// ==================== SOUND LIBRARY ====================

/**
 * Default sound events for the Temple
 * NOTE: These reference placeholder paths - actual files need to be provided
 */
export const TEMPLE_SOUND_EVENTS: SoundEvent[] = [
  // Ambient drones
  {
    id: 'ambient_temple',
    trigger: 'enter',
    file: '/sounds/ambient/temple_drone.mp3',
    volume: 0.3,
    loop: true,
    fadeIn: 2000
  },
  {
    id: 'ambient_mythos',
    trigger: 'mythos',
    file: '/sounds/ambient/deep_drone.mp3',
    volume: 0.35,
    loop: true,
    fadeIn: 1500
  },

  // Navigation chimes
  {
    id: 'nav_chime',
    trigger: 'navigate',
    file: '/sounds/chimes/soft_chime.mp3',
    volume: 0.25
  },
  {
    id: 'nav_transition',
    trigger: 'navigate',
    file: '/sounds/transitions/whoosh_soft.mp3',
    volume: 0.2
  },

  // Dialogue sounds
  {
    id: 'dialogue_ancestor',
    trigger: 'dialogue',
    file: '/sounds/voice/ancestor_whisper.mp3',
    volume: 0.2
  },
  {
    id: 'dialogue_pulse',
    trigger: 'dialogue',
    file: '/sounds/tones/pulse_tone.mp3',
    volume: 0.15
  },

  // Ritual sounds
  {
    id: 'ritual_bell',
    trigger: 'ritual',
    file: '/sounds/ritual/singing_bowl.mp3',
    volume: 0.4,
    fadeIn: 500
  },
  {
    id: 'ritual_drone',
    trigger: 'ritual',
    file: '/sounds/ambient/ritual_drone.mp3',
    volume: 0.3,
    loop: true,
    fadeIn: 1000
  },

  // Initiation sounds
  {
    id: 'initiation_start',
    trigger: 'initiation',
    file: '/sounds/ritual/initiation_bell.mp3',
    volume: 0.35
  },
  {
    id: 'initiation_ambient',
    trigger: 'initiation',
    file: '/sounds/ambient/sacred_drone.mp3',
    volume: 0.25,
    loop: true,
    fadeIn: 1500
  },

  // Threshold crossing
  {
    id: 'threshold_cross',
    trigger: 'threshold',
    file: '/sounds/transitions/threshold_gong.mp3',
    volume: 0.4,
    delay: 500
  },

  // Healing sounds
  {
    id: 'healing_tone',
    trigger: 'healing',
    file: '/sounds/tones/healing_frequency.mp3',
    volume: 0.3,
    loop: true,
    fadeIn: 2000
  },

  // Timeline sounds
  {
    id: 'timeline_tick',
    trigger: 'timeline',
    file: '/sounds/ui/gentle_tick.mp3',
    volume: 0.15
  },

  // Constellation sounds
  {
    id: 'constellation_sparkle',
    trigger: 'constellation',
    file: '/sounds/ambient/star_twinkle.mp3',
    volume: 0.2
  },

  // Completion
  {
    id: 'complete_chime',
    trigger: 'complete',
    file: '/sounds/chimes/completion_chime.mp3',
    volume: 0.35
  },

  // Exit
  {
    id: 'exit_fade',
    trigger: 'exit',
    file: '/sounds/transitions/fade_out.mp3',
    volume: 0.25,
    fadeOut: 2000
  }
];

// ==================== SOUNDSCAPE ENGINE ====================

/**
 * Temple Soundscape Engine class
 */
export class TempleSoundscape {
  private state: SoundscapeState;
  private soundMap: Map<string, SoundEvent>;
  private audioCache: Map<string, HTMLAudioElement>;

  constructor(events: SoundEvent[] = TEMPLE_SOUND_EVENTS) {
    this.state = {
      activeLoops: new Map(),
      isMuted: false,
      masterVolume: 1.0
    };
    this.soundMap = new Map();
    this.audioCache = new Map();

    events.forEach(event => {
      this.soundMap.set(event.id, event);
    });
  }

  /**
   * Play sounds by trigger
   */
  play(trigger: SoundTrigger): void {
    if (this.state.isMuted) return;

    this.soundMap.forEach((event, id) => {
      if (event.trigger === trigger) {
        this.playSound(event);
      }
    });
  }

  /**
   * Play a specific sound
   */
  playSound(event: SoundEvent): void {
    if (this.state.isMuted) return;

    const play = () => {
      const audio = this.getAudio(event);
      audio.volume = event.volume * this.state.masterVolume;
      audio.loop = event.loop || false;

      if (event.fadeIn) {
        audio.volume = 0;
        this.fadeIn(audio, event.volume * this.state.masterVolume, event.fadeIn);
      }

      audio.currentTime = 0;
      audio.play().catch(e => {
        // Autoplay may be blocked by browser
        console.warn('Audio play blocked:', e.message);
      });

      if (event.loop) {
        this.state.activeLoops.set(event.id, audio);
      }
    };

    if (event.delay) {
      setTimeout(play, event.delay);
    } else {
      play();
    }
  }

  /**
   * Stop a looping sound
   */
  stopLoop(id: string, fadeOutMs: number = 1000): void {
    const audio = this.state.activeLoops.get(id);
    if (audio) {
      this.fadeOut(audio, fadeOutMs, () => {
        audio.pause();
        audio.currentTime = 0;
        this.state.activeLoops.delete(id);
      });
    }
  }

  /**
   * Stop all looping sounds
   */
  stopAllLoops(fadeOutMs: number = 1000): void {
    this.state.activeLoops.forEach((audio, id) => {
      this.stopLoop(id, fadeOutMs);
    });
  }

  /**
   * Mute/unmute
   */
  setMuted(muted: boolean): void {
    this.state.isMuted = muted;
    if (muted) {
      this.state.activeLoops.forEach(audio => {
        audio.volume = 0;
      });
    } else {
      this.state.activeLoops.forEach((audio, id) => {
        const event = this.soundMap.get(id);
        if (event) {
          audio.volume = event.volume * this.state.masterVolume;
        }
      });
    }
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.state.masterVolume = Math.max(0, Math.min(1, volume));
    this.state.activeLoops.forEach((audio, id) => {
      const event = this.soundMap.get(id);
      if (event) {
        audio.volume = event.volume * this.state.masterVolume;
      }
    });
  }

  /**
   * Get current state
   */
  getState(): SoundscapeState {
    return { ...this.state };
  }

  /**
   * Check if a loop is active
   */
  isLoopActive(id: string): boolean {
    return this.state.activeLoops.has(id);
  }

  // ==================== PRIVATE METHODS ====================

  private getAudio(event: SoundEvent): HTMLAudioElement {
    let audio = this.audioCache.get(event.id);
    if (!audio) {
      audio = new Audio(event.file);
      this.audioCache.set(event.id, audio);
    }
    return audio;
  }

  private fadeIn(audio: HTMLAudioElement, targetVolume: number, durationMs: number): void {
    const steps = 20;
    const stepDuration = durationMs / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
  }

  private fadeOut(audio: HTMLAudioElement, durationMs: number, onComplete?: () => void): void {
    const steps = 20;
    const stepDuration = durationMs / steps;
    const startVolume = audio.volume;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

      if (currentStep >= steps) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, stepDuration);
  }
}

// ==================== FACTORY FUNCTIONS ====================

/**
 * Create a new soundscape instance
 */
export function createSoundscape(events?: SoundEvent[]): TempleSoundscape {
  return new TempleSoundscape(events);
}

/**
 * Create custom sound event
 */
export function createSoundEvent(
  id: string,
  trigger: SoundTrigger,
  file: string,
  volume: number,
  options?: {
    loop?: boolean;
    fadeIn?: number;
    fadeOut?: number;
    delay?: number;
  }
): SoundEvent {
  return {
    id,
    trigger,
    file,
    volume,
    ...options
  };
}

// ==================== PRESETS ====================

/**
 * Minimal soundscape (fewer sounds, subtle)
 */
export const MINIMAL_SOUND_EVENTS: SoundEvent[] = [
  {
    id: 'ambient_minimal',
    trigger: 'enter',
    file: '/sounds/ambient/soft_drone.mp3',
    volume: 0.2,
    loop: true,
    fadeIn: 2000
  },
  {
    id: 'nav_soft',
    trigger: 'navigate',
    file: '/sounds/chimes/soft_chime.mp3',
    volume: 0.15
  },
  {
    id: 'complete_soft',
    trigger: 'complete',
    file: '/sounds/chimes/gentle_bell.mp3',
    volume: 0.2
  }
];

/**
 * Rich soundscape (full ceremonial experience)
 */
export const RICH_SOUND_EVENTS: SoundEvent[] = [
  ...TEMPLE_SOUND_EVENTS,
  // Additional layered ambience
  {
    id: 'layer_wind',
    trigger: 'enter',
    file: '/sounds/ambient/soft_wind.mp3',
    volume: 0.1,
    loop: true,
    fadeIn: 3000
  },
  {
    id: 'layer_water',
    trigger: 'ritual',
    file: '/sounds/ambient/water_flow.mp3',
    volume: 0.15,
    loop: true,
    fadeIn: 2000
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get sound events by trigger
 */
export function getSoundEventsByTrigger(
  trigger: SoundTrigger,
  events: SoundEvent[] = TEMPLE_SOUND_EVENTS
): SoundEvent[] {
  return events.filter(e => e.trigger === trigger);
}

/**
 * Get all available triggers
 */
export function getAvailableTriggers(events: SoundEvent[] = TEMPLE_SOUND_EVENTS): SoundTrigger[] {
  const triggers = new Set<SoundTrigger>();
  events.forEach(e => triggers.add(e.trigger));
  return Array.from(triggers);
}

// ==================== EXPORTS ====================

export {
  TempleSoundscape,
  TEMPLE_SOUND_EVENTS,
  MINIMAL_SOUND_EVENTS,
  RICH_SOUND_EVENTS,
  createSoundscape,
  createSoundEvent,
  getSoundEventsByTrigger,
  getAvailableTriggers
};
