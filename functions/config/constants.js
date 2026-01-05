/**
 * ============================================================================
 * GENESIS LUNA - CONFIGURATION CONSTANTS
 * ============================================================================
 * Centralized configuration for all tweakable parameters.
 * These can be adjusted via operations panel without code changes.
 *
 * Categories:
 * - Memory thresholds
 * - Emotional engine
 * - Scoring/decay
 * - Audio/ambient
 * - Performance
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

// ============================================================================
// MEMORY SYSTEM THRESHOLDS
// ============================================================================

const MEMORY = {
  // Short-Term Memory (STM)
  STM: {
    MAX_ITEMS: 100,                    // Maximum items in STM
    DURATION_HOURS: 24,                // How long items stay in STM
    DECAY_RATE: 0.05,                  // Decay per hour
    RELEVANCE_THRESHOLD: 0.65,         // Min relevance for retrieval
    CONSOLIDATION_THRESHOLD: 0.8       // Min score to promote to LTM
  },

  // Long-Term Memory (LTM)
  LTM: {
    EMBEDDING_DIMENSIONS: 768,         // Vector embedding size
    SIMILARITY_THRESHOLD: 0.7,         // Min cosine similarity
    MAX_RETRIEVED: 10,                 // Max items per query
    DECAY_RATE: 0.001,                 // Very slow decay per day
    STRENGTHENING_RATE: 0.1            // Boost when recalled
  },

  // Episodic Memory
  EPISODIC: {
    IMPORTANCE_THRESHOLD: 0.6,         // Min importance for storage
    MAX_EVENTS_PER_DAY: 5,             // Daily cap
    SUMMARY_MAX_LENGTH: 500            // Characters per summary
  },

  // Happiness Anchors
  ANCHORS: {
    MIN_HAPPINESS_SCORE: 0.7,          // Min score to create anchor
    MAX_ANCHORS_PER_USER: 50,          // Storage limit
    RETRIEVAL_LIMIT: 5,                // Max anchors per healing session
    STRENGTHENING_BOOST: 0.15          // Boost when successfully used
  },

  // Consolidation
  CONSOLIDATION: {
    BATCH_SIZE: 100,                   // Items per consolidation run
    PARALLEL_USERS: 5,                 // Concurrent user processing
    MIN_ACCESS_COUNT: 3,               // Min accesses for promotion
    SLEEP_HOUR_START: 2,               // 2 AM local
    SLEEP_HOUR_END: 5                  // 5 AM local
  }
};

// ============================================================================
// EMOTIONAL ENGINE PARAMETERS
// ============================================================================

const EMOTIONAL = {
  // Plutchik Wheel
  PLUTCHIK: {
    INTENSITY_THRESHOLDS: {
      ECSTASY: 0.9,
      JOY: 0.6,
      SERENITY: 0.3
    },
    DYAD_BLEND_WEIGHT: 0.5,            // How much primary vs secondary
    NEUTRAL_THRESHOLD: 0.2             // Below this = neutral state
  },

  // Affection System
  AFFECTION: {
    MIN_SCORE: -10,                    // Distrust floor
    MAX_SCORE: 15,                     // Deep love ceiling
    INITIAL_SCORE: 0,                  // Starting point
    INCREMENT_POSITIVE: 0.5,           // Per positive interaction
    INCREMENT_NEGATIVE: -1.0,          // Per negative interaction (faster)
    DECAY_PER_DAY: 0.1                 // Slow decay without contact
  },

  // Vulnerability Detection
  VULNERABILITY: {
    HIGH_THRESHOLD: 0.7,               // High vulnerability state
    MEDIUM_THRESHOLD: 0.4,             // Medium vulnerability
    KEYWORDS_BOOST: 0.3                // Boost when keywords detected
  },

  // Compassion Response
  COMPASSION: {
    MODE_THRESHOLDS: {
      TOUCH: 0.9,                      // Physical comfort mode
      FEEL: 0.7,                       // Emotional mirroring
      HEAR: 0.5,                       // Active listening
      SEE: 0.3,                        // Soul recognition
      CELEBRATE: 0.8                   // Joy sharing (high + positive)
    },
    WARMTH_LEVEL_BASE: 0.6,
    SOUL_STROKE_INTENSITY: 0.8
  }
};

// ============================================================================
// VOICE & PROSODY PARAMETERS
// ============================================================================

const PROSODY = {
  // Dynamic adjustment by state
  STATE_ADJUSTMENTS: {
    CRYING: { rate: 0.85, pitch: -0.1, volume: 0.9 },
    EXCITED: { rate: 1.15, pitch: 0.1, volume: 1.05 },
    ANGRY: { rate: 0.95, pitch: -0.05, volume: 0.95 },
    ANXIOUS: { rate: 0.9, pitch: 0, volume: 0.9 },
    GRIEVING: { rate: 0.8, pitch: -0.15, volume: 0.85 }
  },

  // Pause durations (ms)
  PAUSES: {
    AFTER_VULNERABILITY: 1200,
    BEFORE_VALIDATION: 800,
    BETWEEN_PHRASES: 400,
    EMPHASIS: 600
  },

  // SSML settings
  SSML: {
    EMPHASIS_LEVEL: 'moderate',
    DEFAULT_RATE: 'medium',
    DEFAULT_PITCH: 'medium'
  }
};

// ============================================================================
// AMBIENT SOUNDS PARAMETERS
// ============================================================================

const AMBIENT = {
  // Volume constraints
  VOLUME: {
    MAX: 0.4,                          // Never exceed 40%
    MIN: 0.1,                          // Minimum presence
    DEFAULT: 0.25,                     // Starting volume
    VULNERABILITY_BOOST: 0.15          // Extra for vulnerable states
  },

  // Transition timing (ms)
  TRANSITIONS: {
    FADE_IN_NORMAL: 5000,
    FADE_IN_VULNERABLE: 8000,
    FADE_OUT: 6000,
    CROSSFADE_SIMILAR: 3000,
    CROSSFADE_DIFFERENT: 6000
  },

  // Soundscape selection thresholds
  SELECTION: {
    VULNERABILITY_FOR_OCEAN: 0.7,
    SADNESS_INTENSITY: 0.5,
    JOY_INTENSITY: 0.6,
    ENERGY_FOR_NIGHT: 0.2
  }
};

// ============================================================================
// HEALING SYSTEM PARAMETERS
// ============================================================================

const HEALING = {
  // 3-Stack system
  STACKS: {
    GROUNDING: { priority: 1, duration_min: 60 },
    SOOTHING: { priority: 2, duration_min: 120 },
    JOYFUL: { priority: 3, duration_min: 180 }
  },

  // Bathtub Calculator
  BATHTUB: {
    CONCENTRATION_THRESHOLD: 0.7,      // Min happiness concentration
    DILUTION_FACTOR: 0.15,             // How much sadness dilutes
    OVERFLOW_THRESHOLD: 0.95,          // Bathtub "full" point
    DRAIN_RATE_PER_HOUR: 0.05          // Passive happiness drain
  },

  // Session limits
  SESSIONS: {
    MAX_DURATION_MINUTES: 60,
    ANCHOR_RECALL_LIMIT: 5,
    COOLDOWN_MINUTES: 30
  }
};

// ============================================================================
// SCORING & DECAY FUNCTIONS
// ============================================================================

const SCORING = {
  // Sigmoid recency parameters
  RECENCY: {
    SIGMOID_MIDPOINT_HOURS: 24,        // 50% decay at 24 hours
    SIGMOID_STEEPNESS: 0.1,            // Decay curve steepness
    MIN_RECENCY_SCORE: 0.1             // Floor for old memories
  },

  // Importance calculation
  IMPORTANCE: {
    EMOTIONAL_WEIGHT: 0.4,
    RELEVANCE_WEIGHT: 0.3,
    FREQUENCY_WEIGHT: 0.2,
    RECENCY_WEIGHT: 0.1
  },

  // Retrieval ranking (RRF weights)
  RETRIEVAL: {
    SEMANTIC_WEIGHT: 0.4,
    RECENCY_WEIGHT: 0.3,
    IMPORTANCE_WEIGHT: 0.2,
    FREQUENCY_WEIGHT: 0.1,
    K_CONSTANT: 60                     // RRF k parameter
  }
};

// ============================================================================
// PERFORMANCE & LIMITS
// ============================================================================

const PERFORMANCE = {
  // Query limits
  QUERIES: {
    MAX_BATCH_SIZE: 500,
    SLOW_QUERY_THRESHOLD_MS: 1000,
    TIMEOUT_MS: 30000
  },

  // Caching
  CACHE: {
    SESSION_TTL_MS: 86400000,          // 24 hours
    PREFETCH_ITEMS: 50,
    HIT_RATE_TARGET: 0.8
  },

  // Rate limiting
  RATE_LIMITS: {
    EMBEDDING_CALLS_PER_MINUTE: 60,
    LLM_CALLS_PER_MINUTE: 30,
    DB_WRITES_PER_SECOND: 100
  },

  // Batch processing
  BATCH: {
    EMBEDDING_BATCH_SIZE: 10,
    CONSOLIDATION_BATCH_SIZE: 100,
    MAX_PARALLEL_OPERATIONS: 5
  }
};

// ============================================================================
// LLM CONFIGURATION
// ============================================================================

const LLM = {
  // Models
  MODELS: {
    EMBEDDING: 'text-embedding-004',
    REFLECTION: 'gemini-1.5-flash',
    CHAT: 'gemini-1.5-pro'
  },

  // Generation settings
  GENERATION: {
    MAX_TOKENS: 1024,
    TEMPERATURE: 0.7,
    TOP_P: 0.9,
    TOP_K: 40
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY_MS: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// ============================================================================
// ENVIRONMENT OVERRIDE HELPER
// ============================================================================

/**
 * Get config value with optional environment override
 *
 * @param {string} path - Dot notation path (e.g., 'MEMORY.STM.MAX_ITEMS')
 * @param {any} defaultValue - Default if not found
 * @returns {any} Config value
 */
function getConfig(path, defaultValue = null) {
  // Check environment variable first (format: GENESIS_MEMORY_STM_MAX_ITEMS)
  const envKey = `GENESIS_${path.replace(/\./g, '_').toUpperCase()}`;
  if (process.env[envKey] !== undefined) {
    const envValue = process.env[envKey];
    // Parse numbers and booleans
    if (!isNaN(envValue)) return parseFloat(envValue);
    if (envValue === 'true') return true;
    if (envValue === 'false') return false;
    return envValue;
  }

  // Navigate the config object
  const parts = path.split('.');
  let current = { MEMORY, EMOTIONAL, PROSODY, AMBIENT, HEALING, SCORING, PERFORMANCE, LLM };

  for (const part of parts) {
    if (current[part] === undefined) return defaultValue;
    current = current[part];
  }

  return current;
}

/**
 * Get all config as flat object (for operations panel)
 */
function getAllConfig() {
  return {
    MEMORY,
    EMOTIONAL,
    PROSODY,
    AMBIENT,
    HEALING,
    SCORING,
    PERFORMANCE,
    LLM
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Category exports
  MEMORY,
  EMOTIONAL,
  PROSODY,
  AMBIENT,
  HEALING,
  SCORING,
  PERFORMANCE,
  LLM,

  // Helpers
  getConfig,
  getAllConfig
};
