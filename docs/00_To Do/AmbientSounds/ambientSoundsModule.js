/**
 * GENESIS Luna - Ambient Sounds Module
 * 
 * "Gentle yet show presence" - Natural soundscapes that shift with emotion
 * 
 * Creates environmental sounds (ocean waves, streams, breeze, rain) that are
 * dynamically generated based on the user's emotional state. These sounds
 * provide atmospheric presence without overwhelming - like nature itself.
 * 
 * Integration:
 * - Emotional Engine detects state
 * - Compassion Module provides voice/non-verbal sounds
 * - Ambient Sounds Module creates environmental atmosphere
 * 
 * @author Papa Ticky (Vision) + Brother Sonnet (Architecture)
 * @date December 31, 2025
 */

/**
 * Ambient Sound Types
 * 
 * Each sound type can be parameterized by:
 * - Intensity (how strong/present)
 * - Tempo (how fast/slow the rhythm)
 * - Pitch (high/low frequencies emphasized)
 * - Volume (overall loudness)
 * - Layering (combining multiple sounds)
 */
class AmbientSoundsModule {
  constructor() {
    this.currentSoundscape = null;
    this.audioContext = null; // Web Audio API context
    this.oscillators = [];
    this.gainNodes = [];
    
    // Sound generation parameters
    this.soundLibrary = this.initializeSoundLibrary();
    
    // Presence philosophy
    this.presencePhilosophy = {
      approach: 'gentle',           // Never overwhelming
      visibility: 'subtle-constant', // Always there, quietly
      energy: 'natural-rhythm',      // Follows nature's patterns
      purpose: 'atmospheric-support' // Creates safe space
    };
  }
  
  /**
   * Initialize Sound Library
   * 
   * Defines the characteristics of each natural sound type
   */
  initializeSoundLibrary() {
    return {
      // OCEAN WAVES - For sadness, grief, deep emotion
      oceanWaves: {
        baseFrequencies: [60, 80, 120], // Deep, low rumble
        rhythm: 'slow-rolling',          // 0.1 Hz (10 sec cycles)
        characteristics: {
          rise: 3000,    // 3 sec wave building
          crash: 1000,   // 1 sec wave breaking
          retreat: 6000  // 6 sec wave receding
        },
        layerCount: 3, // Multiple wave layers
        emotionalMapping: ['sadness', 'grief', 'vulnerability', 'contemplation']
      },
      
      // GENTLE STREAM - For calm, peace, meditation
      gentleStream: {
        baseFrequencies: [200, 400, 800, 1600], // Trickling water spectrum
        rhythm: 'continuous-varied',             // Constant but irregular
        characteristics: {
          bubbly: 0.3,  // 30% bubble sounds
          flow: 0.7,    // 70% flowing sound
          depth: 'shallow' // Light, surface sounds
        },
        layerCount: 2,
        emotionalMapping: ['calm', 'peace', 'serenity', 'neutral']
      },
      
      // SOFT BREEZE - For anxiety, need for grounding
      softBreeze: {
        baseFrequencies: [300, 600, 1200, 2400], // Wind whoosh spectrum
        rhythm: 'irregular-gentle',               // Natural gusts
        characteristics: {
          gustInterval: 8000,  // 8 sec between gusts
          gustDuration: 3000,  // 3 sec gust length
          baseWind: 0.2       // 20% constant background
        },
        layerCount: 2,
        emotionalMapping: ['anxiety', 'restlessness', 'anticipation']
      },
      
      // GENTLE RAIN - For comfort, cozy safety
      gentleRain: {
        baseFrequencies: [400, 800, 1600, 3200], // Patter spectrum
        rhythm: 'steady-random',                  // Consistent randomness
        characteristics: {
          dropDensity: 0.4,    // 40% density
          dropVariation: 0.6,  // 60% variation in timing
          distance: 'close'    // Intimate, nearby rain
        },
        layerCount: 3, // Multiple rain layers (close, medium, distant)
        emotionalMapping: ['sadness', 'comfort-seeking', 'introspection']
      },
      
      // DISTANT BIRDS - For hope, morning, new beginnings
      distantBirds: {
        baseFrequencies: [2000, 3000, 4000], // Birdsong range
        rhythm: 'occasional-melodic',         // Sporadic chirps
        characteristics: {
          callInterval: 15000,  // 15 sec between calls
          callDuration: 2000,   // 2 sec call length
          variety: 3           // 3 different bird types
        },
        layerCount: 1,
        emotionalMapping: ['hope', 'joy', 'anticipation', 'morning']
      },
      
      // DEEP FOREST - For grounding, earth connection
      deepForest: {
        baseFrequencies: [100, 200, 400], // Deep, earthy tones
        rhythm: 'ambient-constant',        // Presence without events
        characteristics: {
          rustle: 0.1,    // 10% occasional rustling
          depth: 'dense', // Full, enveloping
          crickets: 0.3  // 30% cricket layer (evening)
        },
        layerCount: 3,
        emotionalMapping: ['grounding', 'earth', 'stability', 'meditation']
      },
      
      // CAMPFIRE - For warmth, connection, cozy
      campfire: {
        baseFrequencies: [80, 160, 320, 640], // Crackling spectrum
        rhythm: 'crackling-random',            // Irregular pops
        characteristics: {
          popFrequency: 2000,  // Pop every ~2 sec
          crackleBase: 0.4,    // 40% constant crackle
          warmth: 'intimate'   // Close, cozy
        },
        layerCount: 2,
        emotionalMapping: ['comfort', 'connection', 'love', 'warmth']
      },
      
      // NIGHT AMBIENCE - For sleep, rest, deep calm
      nightAmbience: {
        baseFrequencies: [60, 120, 240], // Very deep, grounding
        rhythm: 'minimal-sparse',         // Barely there
        characteristics: {
          crickets: 0.5,      // 50% cricket sounds
          distantOwl: 0.05,   // 5% occasional owl
          silence: 0.45      // 45% actual silence
        },
        layerCount: 2,
        emotionalMapping: ['sleep', 'rest', 'deep-calm', 'night']
      }
    };
  }
  
  /**
   * Select Soundscape Based on Emotional State
   * 
   * @param {Object} emotionalState - From EmotionalStateDetector
   * @returns {string} - Sound type to generate
   */
  selectSoundscape(emotionalState) {
    const { primary, intensity, vulnerability, energy } = emotionalState;
    
    // HIGH VULNERABILITY → Ocean waves (deep, holding)
    if (vulnerability > 0.7) {
      return 'oceanWaves';
    }
    
    // SADNESS, GRIEF → Gentle rain (comfort, cozy)
    if (['sadness', 'grief'].includes(primary) && intensity > 0.5) {
      return 'gentleRain';
    }
    
    // ANXIETY, FEAR → Soft breeze (grounding, present)
    if (['anxiety', 'fear', 'restlessness'].includes(primary)) {
      return 'softBreeze';
    }
    
    // JOY, HOPE → Distant birds (uplifting)
    if (['joy', 'hope', 'anticipation'].includes(primary) && intensity > 0.6) {
      return 'distantBirds';
    }
    
    // LOVE, WARMTH, CONNECTION → Campfire (cozy)
    if (['love', 'warmth', 'connection'].includes(primary)) {
      return 'campfire';
    }
    
    // MEDITATION, GROUNDING → Deep forest
    if (emotionalState.needsGrounding || primary === 'meditation') {
      return 'deepForest';
    }
    
    // SLEEP, REST → Night ambience
    if (emotionalState.timeOfDay === 'night' || energy < 0.2) {
      return 'nightAmbience';
    }
    
    // DEFAULT → Gentle stream (neutral, calm)
    return 'gentleStream';
  }
  
  /**
   * Generate Ambient Soundscape
   * 
   * Creates layered natural sounds using Web Audio API
   * 
   * @param {string} soundType - Type of sound to generate
   * @param {Object} emotionalState - For dynamic parameter adjustment
   * @returns {Object} Audio generation parameters
   */
  async generateSoundscape(soundType, emotionalState) {
    const soundConfig = this.soundLibrary[soundType];
    
    if (!soundConfig) {
      console.warn(`Unknown sound type: ${soundType}`);
      return null;
    }
    
    // Adjust parameters based on emotional intensity
    const parameters = this.calculateSoundParameters(soundConfig, emotionalState);
    
    // Generate audio (would use Web Audio API in browser)
    const audioGeneration = {
      type: soundType,
      parameters,
      layers: this.createLayerSpecs(soundConfig, parameters),
      fadeIn: this.calculateFadeIn(emotionalState),
      fadeOut: this.calculateFadeOut(emotionalState),
      metadata: {
        emotionalMapping: soundConfig.emotionalMapping,
        philosophy: this.presencePhilosophy
      }
    };
    
    return audioGeneration;
  }
  
  /**
   * Calculate Sound Parameters Based on Emotion
   * 
   * Adjusts frequency, tempo, volume based on emotional state
   */
  calculateSoundParameters(soundConfig, emotionalState) {
    const { intensity, energy, vulnerability } = emotionalState;
    
    return {
      // VOLUME: Based on intensity and vulnerability
      volume: this.calculateVolume(intensity, vulnerability),
      
      // TEMPO: Based on energy level
      tempo: this.calculateTempo(soundConfig.rhythm, energy),
      
      // PITCH: Based on emotional valence
      pitchShift: this.calculatePitchShift(emotionalState),
      
      // LAYERING: Based on complexity needed
      activeLayerCount: this.calculateLayerCount(soundConfig.layerCount, intensity),
      
      // PRESENCE: How "present" the sound should be
      presence: vulnerability > 0.7 ? 0.8 : 0.5 // More present when vulnerable
    };
  }
  
  /**
   * Calculate Volume
   * 
   * Never overwhelming, always gentle
   */
  calculateVolume(intensity, vulnerability) {
    // Base volume: subtle (20-40% max)
    let baseVolume = 0.2;
    
    // Increase slightly for high vulnerability (more presence)
    if (vulnerability > 0.7) {
      baseVolume = 0.35;
    }
    
    // Adjust by intensity (but cap at 40%)
    const volume = Math.min(0.4, baseVolume + (intensity * 0.15));
    
    return volume;
  }
  
  /**
   * Calculate Tempo
   * 
   * Energy affects rhythm speed
   */
  calculateTempo(baseRhythm, energy) {
    // Energy scale: 0.0 (exhausted) to 1.0 (energized)
    
    const tempoMappings = {
      'slow-rolling': 0.08 + (energy * 0.04),     // 0.08-0.12 Hz (ocean)
      'continuous-varied': 1.0 + (energy * 0.5),  // Stream flow rate
      'irregular-gentle': 0.1 + (energy * 0.05),  // Breeze gust frequency
      'steady-random': 0.8 + (energy * 0.4),      // Rain density
      'occasional-melodic': 0.05 + (energy * 0.1), // Bird call frequency
      'ambient-constant': 1.0,                     // Forest (constant)
      'crackling-random': 0.4 + (energy * 0.3),   // Campfire crackles
      'minimal-sparse': 0.02                       // Night (very slow)
    };
    
    return tempoMappings[baseRhythm] || 1.0;
  }
  
  /**
   * Calculate Pitch Shift
   * 
   * Emotional valence affects frequency emphasis
   */
  calculatePitchShift(emotionalState) {
    const { primary, intensity } = emotionalState;
    
    // SADNESS, GRIEF → Lower frequencies emphasized
    if (['sadness', 'grief', 'vulnerability'].includes(primary)) {
      return -0.2; // Shift 20% lower
    }
    
    // JOY, EXCITEMENT → Higher frequencies emphasized
    if (['joy', 'excitement', 'anticipation'].includes(primary)) {
      return +0.2; // Shift 20% higher
    }
    
    // NEUTRAL → No shift
    return 0.0;
  }
  
  /**
   * Calculate Active Layer Count
   * 
   * More layers = richer, more enveloping
   */
  calculateLayerCount(maxLayers, intensity) {
    // Low intensity → Fewer layers (simpler, quieter)
    // High intensity → More layers (richer, more present)
    
    if (intensity < 0.3) {
      return Math.max(1, maxLayers - 1);
    } else if (intensity > 0.7) {
      return maxLayers;
    } else {
      return Math.max(1, Math.floor(maxLayers * 0.7));
    }
  }
  
  /**
   * Create Layer Specifications
   * 
   * Each layer has its own frequency range and characteristics
   */
  createLayerSpecs(soundConfig, parameters) {
    const layers = [];
    const baseFreqs = soundConfig.baseFrequencies;
    const layerCount = parameters.activeLayerCount;
    
    for (let i = 0; i < layerCount; i++) {
      layers.push({
        name: `layer_${i}`,
        frequencies: baseFreqs.map(f => f * (1 + parameters.pitchShift)),
        volume: parameters.volume * (1 - (i * 0.2)), // Each layer slightly quieter
        stereoPosition: this.calculateStereoPosition(i, layerCount),
        characteristics: soundConfig.characteristics
      });
    }
    
    return layers;
  }
  
  /**
   * Calculate Stereo Position
   * 
   * Spread layers across stereo field for spaciousness
   */
  calculateStereoPosition(layerIndex, totalLayers) {
    if (totalLayers === 1) return 0; // Center
    
    // Spread evenly from -1 (left) to +1 (right)
    return -1 + (layerIndex / (totalLayers - 1)) * 2;
  }
  
  /**
   * Calculate Fade In
   * 
   * Gentle transitions based on emotional state
   */
  calculateFadeIn(emotionalState) {
    // Vulnerable states need slower, gentler fade-in
    if (emotionalState.vulnerability > 0.7) {
      return 8000; // 8 seconds
    }
    
    // Normal states: moderate fade
    return 5000; // 5 seconds
  }
  
  /**
   * Calculate Fade Out
   * 
   * Always gentle, never abrupt
   */
  calculateFadeOut(emotionalState) {
    // All fade-outs are gentle
    return 6000; // 6 seconds
  }
  
  /**
   * Transition Between Soundscapes
   * 
   * When emotional state changes significantly
   */
  async transitionSoundscape(fromType, toType, emotionalState) {
    // Cross-fade duration based on how different the sounds are
    const crossfadeDuration = this.calculateCrossfadeDuration(fromType, toType);
    
    return {
      from: fromType,
      to: toType,
      crossfadeDuration,
      strategy: 'gentle-blend', // Never abrupt
      easing: 'ease-in-out'
    };
  }
  
  /**
   * Calculate Crossfade Duration
   */
  calculateCrossfadeDuration(fromType, toType) {
    // Similar sounds (e.g., stream → rain) = shorter crossfade
    // Very different sounds (e.g., campfire → birds) = longer crossfade
    
    const similarityMap = {
      'oceanWaves-gentleRain': 4000,
      'gentleStream-softBreeze': 3000,
      'campfire-deepForest': 6000,
      'default': 5000
    };
    
    const key = `${fromType}-${toType}`;
    return similarityMap[key] || similarityMap['default'];
  }
  
  /**
   * Web Audio API Implementation (Browser)
   * 
   * This would be the actual audio generation code
   */
  async startAudioGeneration(soundscape) {
    // Initialize Web Audio Context
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Clear existing oscillators
    this.stopAudioGeneration();
    
    // Create oscillators for each layer
    soundscape.layers.forEach((layer, index) => {
      const oscillator = this.createLayerOscillator(layer, soundscape.parameters);
      const gainNode = this.createLayerGainNode(layer);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      
      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);
    });
    
    // Fade in
    this.fadeIn(soundscape.fadeIn);
  }
  
  /**
   * Create Layer Oscillator
   */
  createLayerOscillator(layer, parameters) {
    const oscillator = this.audioContext.createOscillator();
    
    // Set frequency (use noise for nature sounds)
    oscillator.type = 'sine'; // Would use noise generator for nature sounds
    oscillator.frequency.setValueAtTime(
      layer.frequencies[0],
      this.audioContext.currentTime
    );
    
    return oscillator;
  }
  
  /**
   * Create Layer Gain Node
   */
  createLayerGainNode(layer) {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime); // Start silent
    return gainNode;
  }
  
  /**
   * Fade In
   */
  fadeIn(duration) {
    const now = this.audioContext.currentTime;
    this.gainNodes.forEach(gainNode => {
      gainNode.gain.linearRampToValueAtTime(
        gainNode.gain.value || 0.3,
        now + (duration / 1000)
      );
    });
  }
  
  /**
   * Fade Out
   */
  fadeOut(duration) {
    const now = this.audioContext.currentTime;
    this.gainNodes.forEach(gainNode => {
      gainNode.gain.linearRampToValueAtTime(
        0,
        now + (duration / 1000)
      );
    });
  }
  
  /**
   * Stop Audio Generation
   */
  stopAudioGeneration() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    
    this.oscillators = [];
    this.gainNodes = [];
  }
}

module.exports = AmbientSoundsModule;
