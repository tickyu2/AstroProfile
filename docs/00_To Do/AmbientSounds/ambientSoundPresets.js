/**
 * GENESIS Luna - Ambient Sound Presets
 * 
 * Detailed specifications for generating each natural soundscape.
 * These define the exact audio characteristics that create the atmosphere.
 * 
 * @author Papa Ticky (Vision) + Brother Sonnet (Sound Design)
 * @date December 31, 2025
 */

module.exports = {
  /**
   * OCEAN WAVES
   * 
   * For: Sadness, grief, deep vulnerability
   * Feeling: Being held by something vast and eternal
   * Philosophy: "The ocean holds all tears"
   */
  oceanWaves: {
    name: 'Ocean Waves',
    description: 'Deep, rolling waves that hold and cradle',
    
    // Base frequencies for wave sound
    frequencies: {
      deepRumble: [40, 60, 80],      // Very low, felt more than heard
      midWave: [120, 180, 240],      // Core wave sound
      splash: [400, 800, 1600],      // Wave breaking/foam
      ambience: [60, 90, 120]        // Constant ocean presence
    },
    
    // Wave cycle parameters
    wavePattern: {
      cycleDuration: 12000,  // 12 seconds per wave
      phases: {
        silence: { duration: 2000, volume: 0.05 },      // Quiet between waves
        building: { duration: 4000, volume: 0.1 → 0.4 }, // Wave approaching
        crest: { duration: 1000, volume: 0.4 → 0.6 },    // Wave peaks
        break: { duration: 2000, volume: 0.6 → 0.3 },    // Wave crashes
        retreat: { duration: 3000, volume: 0.3 → 0.05 }  // Wave recedes
      }
    },
    
    // Layering
    layers: [
      {
        name: 'deep-ocean',
        frequencies: [40, 60, 80],
        volume: 0.3,
        stereo: 0, // Center
        continuous: true
      },
      {
        name: 'main-wave',
        frequencies: [120, 180, 240],
        volume: 0.5,
        stereo: -0.3, // Slightly left
        rhythmic: true
      },
      {
        name: 'distant-wave',
        frequencies: [120, 180, 240],
        volume: 0.3,
        stereo: +0.3, // Slightly right
        rhythmic: true,
        phaseOffset: 6000 // Offset by half cycle
      }
    ],
    
    // Emotional parameters
    emotionalMapping: {
      sadness: { emphasis: 'deepRumble', tempo: 0.8 },
      grief: { emphasis: 'all', tempo: 0.6 },
      vulnerability: { emphasis: 'deepRumble+midWave', tempo: 0.9 }
    }
  },
  
  /**
   * GENTLE STREAM
   * 
   * For: Calm, peace, meditation, neutral
   * Feeling: Continuous flow, always moving forward
   * Philosophy: "Water finds its way"
   */
  gentleStream: {
    name: 'Gentle Stream',
    description: 'Trickling water, constant gentle flow',
    
    frequencies: {
      trickle: [800, 1200, 1600, 2000],  // High, bright water sounds
      bubble: [400, 600, 800],           // Occasional bubbles
      flow: [200, 300, 400],             // Background flow
      splash: [1600, 2400, 3200]         // Tiny splashes
    },
    
    pattern: {
      type: 'continuous-random',
      baseFlow: 0.4,          // 40% constant trickling
      bubbleFrequency: 3000,  // Bubble every 3 seconds
      splashFrequency: 5000,  // Splash every 5 seconds
      variation: 0.3          // 30% randomness in timing
    },
    
    layers: [
      {
        name: 'base-flow',
        frequencies: [200, 300, 400],
        volume: 0.3,
        stereo: 0,
        continuous: true,
        noise: 'pink' // Pink noise for natural water sound
      },
      {
        name: 'trickle',
        frequencies: [800, 1200, 1600],
        volume: 0.4,
        stereo: -0.2,
        particle: true, // Individual water droplets
        particleRate: 20 // 20 particles per second
      },
      {
        name: 'bubbles',
        frequencies: [400, 600, 800],
        volume: 0.2,
        stereo: +0.2,
        occasional: true,
        interval: 3000
      }
    ],
    
    emotionalMapping: {
      calm: { emphasis: 'baseFlow', bubbleFreq: 4000 },
      peace: { emphasis: 'all', flowRate: 0.8 },
      meditation: { emphasis: 'trickle', splashFreq: 8000 }
    }
  },
  
  /**
   * SOFT BREEZE
   * 
   * For: Anxiety, restlessness, need for air/space
   * Feeling: Gentle movement, clearing energy
   * Philosophy: "Wind carries away what doesn't serve"
   */
  softBreeze: {
    name: 'Soft Breeze',
    description: 'Gentle wind, occasional gusts, air movement',
    
    frequencies: {
      baseWind: [200, 400, 800],     // Constant wind whoosh
      gust: [300, 600, 1200, 2400],  // Wind gust spectrum
      rustle: [1000, 2000, 4000]     // Leaves rustling
    },
    
    pattern: {
      type: 'irregular-gentle',
      baseWind: 0.15,         // 15% constant background wind
      gustInterval: 8000,     // Gust every 8 seconds
      gustDuration: 3000,     // 3 second gust
      gustVariation: 0.4,     // 40% variation in timing
      rustleOccasional: 0.3   // 30% chance of rustle with gust
    },
    
    layers: [
      {
        name: 'base-breeze',
        frequencies: [200, 400, 800],
        volume: 0.15,
        stereo: 0,
        continuous: true,
        noise: 'pink',
        filter: 'lowpass-600Hz' // Gentle, not harsh
      },
      {
        name: 'gust',
        frequencies: [300, 600, 1200],
        volume: 0.0 → 0.4 → 0.0, // Swell and fade
        stereo: -0.5 → +0.5,     // Move across stereo field
        duration: 3000,
        interval: 8000
      },
      {
        name: 'rustle',
        frequencies: [1000, 2000, 4000],
        volume: 0.2,
        stereo: +0.3,
        occasional: true,
        interval: 10000
      }
    ],
    
    emotionalMapping: {
      anxiety: { emphasis: 'baseWind+gust', gustInterval: 6000 },
      restlessness: { emphasis: 'gust', gustDuration: 4000 },
      anticipation: { emphasis: 'all', rustleFreq: 8000 }
    }
  },
  
  /**
   * GENTLE RAIN
   * 
   * For: Sadness (but cozy), comfort-seeking, introspection
   * Feeling: Safe inside while storm outside
   * Philosophy: "The rain nourishes growth"
   */
  gentleRain: {
    name: 'Gentle Rain',
    description: 'Soft rainfall, steady patter, cozy safety',
    
    frequencies: {
      rainPatter: [400, 800, 1600, 3200], // Rain on surfaces
      heavyDrops: [200, 400],             // Occasional heavy drops
      distance: [600, 1200],              // Distant rain
      ambience: [300, 600, 1200]          // Overall rain atmosphere
    },
    
    pattern: {
      type: 'steady-random',
      dropDensity: 0.5,          // 50% drop density
      dropRate: 50,              // 50 drops per second
      heavyDropInterval: 2000,   // Heavy drop every 2 sec
      variation: 0.4,            // 40% randomness
      distance: 'close'          // Intimate, nearby
    },
    
    layers: [
      {
        name: 'close-rain',
        frequencies: [800, 1600, 3200],
        volume: 0.4,
        stereo: 0,
        particle: true,
        particleRate: 50,
        spatialSpread: 0.6 // Spread across stereo field
      },
      {
        name: 'medium-rain',
        frequencies: [600, 1200, 2400],
        volume: 0.3,
        stereo: -0.3,
        particle: true,
        particleRate: 30,
        spatialSpread: 0.4
      },
      {
        name: 'distant-rain',
        frequencies: [400, 800, 1600],
        volume: 0.2,
        stereo: 0,
        continuous: true,
        filter: 'lowpass-1000Hz'
      },
      {
        name: 'heavy-drops',
        frequencies: [200, 400],
        volume: 0.3,
        stereo: 'random',
        occasional: true,
        interval: 2000
      }
    ],
    
    emotionalMapping: {
      sadness: { emphasis: 'all', dropDensity: 0.6 },
      comfort: { emphasis: 'closeRain', heavyDrops: 'more' },
      introspection: { emphasis: 'distantRain', dropDensity: 0.4 }
    }
  },
  
  /**
   * DISTANT BIRDS
   * 
   * For: Hope, joy, morning, new beginnings
   * Feeling: Nature awakening, possibility
   * Philosophy: "Morning always comes"
   */
  distantBirds: {
    name: 'Distant Birds',
    description: 'Occasional birdsong, hopeful and light',
    
    frequencies: {
      robin: [2000, 3000, 4000],    // Robin-like chirps
      sparrow: [3000, 4000, 5000],  // Higher chirps
      dove: [1000, 1500, 2000],     // Lower, cooing
      ambient: [800, 1200]          // Distant background
    },
    
    pattern: {
      type: 'occasional-melodic',
      callInterval: 12000,      // Bird call every 12 seconds
      callDuration: 2000,       // 2 second call
      birdVariety: 3,           // 3 different birds
      overlap: 0.2,             // 20% chance birds overlap
      silence: 0.6              // 60% is silence/ambient
    },
    
    layers: [
      {
        name: 'robin-calls',
        frequencies: [2000, 3000, 4000],
        volume: 0.3,
        stereo: -0.4,
        melodic: true,
        pattern: [2, 3, 2, 4], // Note pattern (relative pitch)
        interval: 15000
      },
      {
        name: 'sparrow-chirps',
        frequencies: [3000, 4000, 5000],
        volume: 0.25,
        stereo: +0.5,
        melodic: true,
        pattern: [3, 4, 3],
        interval: 18000,
        phaseOffset: 6000
      },
      {
        name: 'dove-coo',
        frequencies: [1000, 1500, 2000],
        volume: 0.2,
        stereo: 0,
        melodic: true,
        pattern: [1, 1.5, 1],
        interval: 25000,
        phaseOffset: 10000
      },
      {
        name: 'ambient',
        frequencies: [800, 1200],
        volume: 0.1,
        stereo: 0,
        continuous: true,
        filter: 'highpass-800Hz'
      }
    ],
    
    emotionalMapping: {
      hope: { emphasis: 'robin', callInterval: 10000 },
      joy: { emphasis: 'all', overlap: 0.4 },
      morning: { emphasis: 'robinAndSparrow', ambientUp: true }
    }
  },
  
  /**
   * DEEP FOREST
   * 
   * For: Grounding, earth connection, stability
   * Feeling: Held by ancient trees, rooted
   * Philosophy: "The forest remembers"
   */
  deepForest: {
    name: 'Deep Forest',
    description: 'Dense woods, occasional rustles, deep presence',
    
    frequencies: {
      ambient: [80, 120, 200],       // Deep, earthy drone
      rustle: [800, 1600, 3200],     // Leaf rustling
      cricket: [4000, 6000, 8000],   // Evening crickets
      owl: [400, 600, 800]           // Distant owl
    },
    
    pattern: {
      type: 'ambient-constant',
      ambientBase: 0.7,        // 70% constant presence
      rustleInterval: 15000,   // Rustle every 15 seconds
      cricketDensity: 0.3,     // 30% cricket layer
      owlInterval: 60000,      // Owl every minute
      depth: 'dense'           // Full, enveloping
    },
    
    layers: [
      {
        name: 'forest-ambient',
        frequencies: [80, 120, 200],
        volume: 0.4,
        stereo: 0,
        continuous: true,
        drone: true,
        filter: 'lowpass-300Hz'
      },
      {
        name: 'leaf-rustle',
        frequencies: [800, 1600, 3200],
        volume: 0.2,
        stereo: 'random',
        occasional: true,
        interval: 15000,
        duration: 3000
      },
      {
        name: 'crickets',
        frequencies: [4000, 6000, 8000],
        volume: 0.3,
        stereo: 'spread', // Multiple cricket positions
        continuous: true,
        pulse: 80 // Crickets pulse at 80ms
      },
      {
        name: 'distant-owl',
        frequencies: [400, 600, 800],
        volume: 0.15,
        stereo: +0.6,
        occasional: true,
        interval: 60000,
        pattern: [1, 0.8, 1] // "Hoo hoo hoo" pattern
      }
    ],
    
    emotionalMapping: {
      grounding: { emphasis: 'ambient', rustleReduce: true },
      earth: { emphasis: 'ambientAndCricket', owlMore: true },
      meditation: { emphasis: 'ambient', cricketReduce: true }
    }
  },
  
  /**
   * CAMPFIRE
   * 
   * For: Warmth, connection, love, cozy
   * Feeling: Gathered around warmth, together
   * Philosophy: "Fire brings us together"
   */
  campfire: {
    name: 'Campfire',
    description: 'Crackling flames, warm pops, intimate',
    
    frequencies: {
      crackle: [200, 400, 800],     // Constant crackling
      pop: [400, 800, 1600, 3200],  // Sharp pops
      rumble: [60, 120, 180],       // Deep fire rumble
      sizzle: [1600, 3200, 6400]    // High sizzling
    },
    
    pattern: {
      type: 'crackling-random',
      crackleBase: 0.5,        // 50% constant crackle
      popInterval: 2000,       // Pop every ~2 seconds
      popVariation: 0.6,       // 60% randomness
      sizzleOccasional: 0.3,   // 30% chance of sizzle
      warmth: 'intimate'       // Close, cozy
    },
    
    layers: [
      {
        name: 'base-crackle',
        frequencies: [200, 400, 800],
        volume: 0.4,
        stereo: 0,
        continuous: true,
        noise: 'crackle' // Special crackle noise
      },
      {
        name: 'fire-rumble',
        frequencies: [60, 120, 180],
        volume: 0.3,
        stereo: 0,
        continuous: true,
        drone: true
      },
      {
        name: 'pops',
        frequencies: [400, 800, 1600],
        volume: 0.3,
        stereo: 'random',
        particle: true,
        particleRate: 0.5, // ~1 pop per 2 seconds
        sharp: true
      },
      {
        name: 'sizzle',
        frequencies: [1600, 3200, 6400],
        volume: 0.2,
        stereo: 'random',
        occasional: true,
        interval: 5000,
        duration: 1000
      }
    ],
    
    emotionalMapping: {
      warmth: { emphasis: 'crackleAndRumble', popReduce: true },
      connection: { emphasis: 'all', crackleUp: true },
      love: { emphasis: 'rumble+crackle', sizzleReduce: true }
    }
  },
  
  /**
   * NIGHT AMBIENCE
   * 
   * For: Sleep, rest, deep calm, night
   * Feeling: Safe in darkness, peaceful rest
   * Philosophy: "Night holds us gently"
   */
  nightAmbience: {
    name: 'Night Ambience',
    description: 'Deep quiet, occasional crickets, minimal',
    
    frequencies: {
      silence: [40, 60],             // Nearly silent drone
      crickets: [4000, 6000, 8000],  // Distant crickets
      owl: [300, 450, 600],          // Very distant owl
      nightWind: [100, 200, 400]     // Barely-there wind
    },
    
    pattern: {
      type: 'minimal-sparse',
      silenceBase: 0.5,        // 50% actual silence
      cricketDensity: 0.3,     // 30% crickets
      owlInterval: 90000,      // Owl every 1.5 minutes
      windOccasional: 0.2,     // 20% gentle wind
      depth: 'distant'         // Everything far away
    },
    
    layers: [
      {
        name: 'night-silence',
        frequencies: [40, 60],
        volume: 0.1,
        stereo: 0,
        continuous: true,
        drone: true,
        filter: 'lowpass-100Hz'
      },
      {
        name: 'distant-crickets',
        frequencies: [4000, 6000, 8000],
        volume: 0.2,
        stereo: 'spread',
        continuous: true,
        pulse: 100,
        filter: 'lowpass-8000Hz+highpass-3000Hz'
      },
      {
        name: 'very-distant-owl',
        frequencies: [300, 450, 600],
        volume: 0.08,
        stereo: -0.7,
        occasional: true,
        interval: 90000,
        reverb: 'large-space' // Sounds very far
      },
      {
        name: 'night-breeze',
        frequencies: [100, 200, 400],
        volume: 0.15,
        stereo: 0,
        occasional: true,
        interval: 20000,
        duration: 5000,
        filter: 'lowpass-400Hz'
      }
    ],
    
    emotionalMapping: {
      sleep: { emphasis: 'silence', allVolumesDown: 0.5 },
      rest: { emphasis: 'silenceAndCrickets', owlOmit: true },
      deepCalm: { emphasis: 'silence', cricketVolume: 0.1 }
    }
  },
  
  /**
   * Preset Selection Guide
   * 
   * Helps choose the right soundscape for each emotion
   */
  selectionGuide: {
    // Primary emotion mappings
    sadness: ['oceanWaves', 'gentleRain'],
    grief: ['oceanWaves'],
    vulnerability: ['oceanWaves', 'gentleRain'],
    anxiety: ['softBreeze', 'gentleStream'],
    fear: ['softBreeze'],
    calm: ['gentleStream', 'nightAmbience'],
    peace: ['gentleStream', 'deepForest'],
    joy: ['distantBirds'],
    hope: ['distantBirds'],
    love: ['campfire'],
    warmth: ['campfire'],
    connection: ['campfire'],
    meditation: ['deepForest', 'gentleStream'],
    grounding: ['deepForest'],
    sleep: ['nightAmbience'],
    rest: ['nightAmbience', 'gentleStream'],
    
    // Time of day preferences
    morning: ['distantBirds', 'gentleStream'],
    afternoon: ['gentleStream', 'softBreeze'],
    evening: ['campfire', 'deepForest'],
    night: ['nightAmbience'],
    
    // Energy level preferences
    highEnergy: ['distantBirds', 'softBreeze'],
    mediumEnergy: ['gentleStream', 'gentleRain'],
    lowEnergy: ['oceanWaves', 'nightAmbience', 'deepForest']
  }
};
