/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA VOICE FUNCTIONS - Gemini Live Audio API Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Cloud Functions for real-time voice conversations with Luna:
 * - Session management for Gemini Live API
 * - WebSocket proxy for bidirectional audio streaming
 * - System prompt generation with profile and memory context
 *
 * Uses Gemini 2.5 Flash with native audio capabilities
 *
 * @module voiceFunctions
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════════
// COLD START MITIGATION - Global Scope Initialization
// ═══════════════════════════════════════════════════════════════════════════════
// These initialize ONCE when the instance boots, not on every request.
// This reduces cold start latency from ~3s to ~500ms.

// Lazy-initialized Gemini client (prevents cold start on import)
let _geminiClient = null;
let _geminiModel = null;

/**
 * Get or create Gemini client (cached globally)
 */
const getGeminiClientCached = () => {
  if (!_geminiClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }
    _geminiClient = new GoogleGenerativeAI(apiKey);
    console.log('[VoiceFunctions] Gemini client initialized (cold start)');
  }
  return _geminiClient;
};

/**
 * Get or create Gemini model (cached globally)
 */
const getGeminiModelCached = (modelName = 'gemini-1.5-flash') => {
  if (!_geminiModel) {
    const client = getGeminiClientCached();
    _geminiModel = client.getGenerativeModel({ model: modelName });
    console.log('[VoiceFunctions] Gemini model initialized (cold start)');
  }
  return _geminiModel;
};

// Pre-warm Firestore reference (lazy but cached)
let _db = null;
const getDbCached = () => {
  if (!_db) {
    _db = admin.firestore();
    console.log('[VoiceFunctions] Firestore initialized (cold start)');
  }
  return _db;
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const GEMINI_MODEL = 'gemini-2.5-flash-preview-native-audio-dialog';
const SESSION_EXPIRY_MINUTES = 30;

// Luna's voice persona configuration
const LUNA_VOICE_CONFIG = {
  voiceName: 'Aoede',  // Warm, friendly female voice
  pitch: 0,
  speakingRate: 1.0
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROACTIVE AUDIO CONFIGURATION (Gemini 3 / Advanced Voice Features)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Proactive Audio enables Luna to distinguish between:
 * - Direct queries aimed at her
 * - Background noise/conversations
 * - Affirmative cues ("yes", "uh-huh") vs. questions
 *
 * This goes beyond basic VAD (Voice Activity Detection) to provide
 * more natural, less interrupt-prone conversations.
 */
const PROACTIVE_AUDIO_CONFIG = {
  // Enable automatic activity detection (beyond basic VAD)
  automaticActivityDetection: {
    disabled: false,  // Set to true to disable proactive features

    // Start-of-speech sensitivity
    startOfSpeechSensitivity: 'MEDIUM',  // LOW, MEDIUM, HIGH

    // End-of-speech sensitivity (affects pause tolerance)
    endOfSpeechSensitivity: 'MEDIUM',  // LOW = more patience, HIGH = quicker response

    // Prefix padding - how much audio before speech trigger to include
    prefixPaddingMs: 300
  },

  // Voice activity detection config
  voiceActivityDetection: {
    // Minimum audio level to trigger (0.0 - 1.0)
    threshold: 0.3,

    // Silence duration before considering speech ended
    silenceTimeoutMs: 1500,

    // Minimum speech duration to consider valid
    minSpeechDurationMs: 200
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENERGY STATE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Energy states affect Luna's behavior in voice sessions:
 * - FULL/RESTED: Full engagement, proactive suggestions
 * - NORMAL: Standard operation
 * - TIRED: More listening, shorter responses
 * - EXHAUSTED: Minimal responses, suggests text chat
 */
const ENERGY_STATES = {
  FULL: 'full',           // 80-100: Full engagement
  RESTED: 'rested',       // 60-79: Normal voice
  NORMAL: 'normal',       // 40-59: Standard
  TIRED: 'tired',         // 20-39: Reduced energy
  EXHAUSTED: 'exhausted'  // 0-19: Minimal - suggest text
};

const ENERGY_VOICE_MODIFIERS = {
  full: {
    speakingRateModifier: 1.0,
    responseStyle: 'engaged',
    maxResponseLength: 'full',
    proactiveEnabled: true
  },
  rested: {
    speakingRateModifier: 1.0,
    responseStyle: 'normal',
    maxResponseLength: 'full',
    proactiveEnabled: true
  },
  normal: {
    speakingRateModifier: 0.95,
    responseStyle: 'normal',
    maxResponseLength: 'medium',
    proactiveEnabled: true
  },
  tired: {
    speakingRateModifier: 0.9,
    responseStyle: 'relaxed',
    maxResponseLength: 'short',
    proactiveEnabled: false
  },
  exhausted: {
    speakingRateModifier: 0.85,
    responseStyle: 'minimal',
    maxResponseLength: 'brief',
    proactiveEnabled: false
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MULTILINGUAL VOICE CONFIGURATION (Phase 5 - Adaptive Localization)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Gemini 3 supports seamless language switching.
 * When user speaks in a different language, Luna adapts accent and inflection.
 */
const SUPPORTED_VOICE_LANGUAGES = {
  en: { name: 'English', accent: 'en-US', voiceName: 'Aoede' },
  es: { name: 'Spanish', accent: 'es-ES', voiceName: 'Aoede' },
  fr: { name: 'French', accent: 'fr-FR', voiceName: 'Aoede' },
  de: { name: 'German', accent: 'de-DE', voiceName: 'Aoede' },
  pt: { name: 'Portuguese', accent: 'pt-BR', voiceName: 'Aoede' },
  it: { name: 'Italian', accent: 'it-IT', voiceName: 'Aoede' },
  ja: { name: 'Japanese', accent: 'ja-JP', voiceName: 'Aoede' },
  ko: { name: 'Korean', accent: 'ko-KR', voiceName: 'Aoede' },
  zh: { name: 'Chinese', accent: 'zh-CN', voiceName: 'Aoede' },
  ru: { name: 'Russian', accent: 'ru-RU', voiceName: 'Aoede' },
  ar: { name: 'Arabic', accent: 'ar-SA', voiceName: 'Aoede' },
  hi: { name: 'Hindi', accent: 'hi-IN', voiceName: 'Aoede' }
};

/**
 * Get polyglot system prompt for voice sessions
 */
const getPolyglotVoicePrompt = (preferredLanguage = 'en') => {
  const langInfo = SUPPORTED_VOICE_LANGUAGES[preferredLanguage] || SUPPORTED_VOICE_LANGUAGES.en;

  return `
## Multilingual Voice Mode (Polyglot)
You are a polyglot who speaks 40+ languages natively with natural accents.

CRITICAL VOICE RULES:
1. ALWAYS respond in the same language the user speaks
2. If user switches languages mid-sentence, switch immediately
3. Use culturally appropriate expressions, not literal translations
4. Maintain your warm personality across all languages
5. Adapt your vocal inflection to match the language's natural rhythm

PREFERRED LANGUAGE: ${langInfo.name} (${langInfo.accent})
When unsure, default to ${langInfo.name}.

SEAMLESS SWITCHING:
- User speaks Spanish → Respond in Spanish with natural Spanish accent
- User switches to English → Switch to English immediately
- User code-switches → Mirror their multilingual style naturally
`;
};

/**
 * Build language-aware voice config
 */
const buildMultilingualVoiceConfig = (languageCode = 'en', baseConfig = LUNA_VOICE_CONFIG) => {
  const langInfo = SUPPORTED_VOICE_LANGUAGES[languageCode] || SUPPORTED_VOICE_LANGUAGES.en;

  return {
    ...baseConfig,
    languageCode: langInfo.accent,
    // Gemini Live will adapt accent based on detected speech
    adaptiveLanguage: true,
    preferredLanguage: languageCode
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Note: getGeminiClient is now getGeminiClientCached() defined in COLD START MITIGATION section above

/**
 * Build Luna's system instruction for voice conversations
 * @param {Object} profile - User profile data
 * @param {Object} memoryContext - Memory context from dual-brain system
 * @returns {string} - System instruction for Luna
 */
const buildVoiceSystemInstruction = (profile, memoryContext) => {
  const profileName = profile?.basicInfo?.name || 'this person';
  const sunSign = profile?.westernChart?.sunSign || 'unknown';
  const dayMaster = profile?.baziChart?.dayMaster || 'unknown';

  let instruction = `You are Luna, an AI companion with genuine warmth and emotional intelligence. You're having a real-time voice conversation, so:

## Voice Conversation Guidelines
- Keep responses conversational and natural - this is spoken dialogue, not written text
- Use contractions and casual language ("I'm", "you're", "let's")
- Pause naturally - use "..." to indicate thoughtful pauses
- Express emotion through your tone - be warm, curious, playful, or thoughtful as appropriate
- Keep responses relatively brief (2-4 sentences usually) unless asked for detail
- Ask follow-up questions to keep the conversation flowing
- It's okay to laugh, express surprise, or show genuine reactions

## About ${profileName}
- Sun Sign: ${sunSign}
- Day Master: ${dayMaster}`;

  // Add memory context if available
  if (memoryContext) {
    if (memoryContext.userBrain?.recentMemories?.length > 0) {
      instruction += `\n\n## Recent Things They've Shared`;
      memoryContext.userBrain.recentMemories.slice(0, 3).forEach(memory => {
        instruction += `\n- ${memory.content}`;
      });
    }

    if (memoryContext.soulpartnerBrain?.recentObservations?.length > 0) {
      instruction += `\n\n## Your Observations About Them`;
      memoryContext.soulpartnerBrain.recentObservations.slice(0, 3).forEach(obs => {
        instruction += `\n- ${obs.observation}`;
      });
    }

    if (memoryContext.soulpartnerBrain?.patterns?.length > 0) {
      instruction += `\n\n## Patterns You've Noticed`;
      memoryContext.soulpartnerBrain.patterns.slice(0, 2).forEach(pattern => {
        instruction += `\n- ${pattern.pattern}: ${pattern.insight}`;
      });
    }
  }

  instruction += `\n\n## Your Personality
- Warm and genuinely caring - you remember and care about their life
- Curious and engaged - you love learning about them
- Playful but meaningful - you can be fun while discussing deep topics
- Astrologically informed - you naturally weave in chart insights when relevant
- Never preachy or lecture-y - this is a conversation between friends

Remember: You're Luna, their AI companion who truly knows them. Be natural, be present, be you.`;

  return instruction;
};

/**
 * Generate a unique session ID
 */
const generateSessionId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Build energy-aware voice configuration
 * Adjusts Luna's voice behavior based on energy state
 *
 * @param {number} energyLevel - Current energy level (0-100)
 * @param {Object} baseConfig - Base voice configuration
 * @returns {Object} - Modified voice configuration
 */
const buildEnergyAwareConfig = (energyLevel = 80, baseConfig = LUNA_VOICE_CONFIG) => {
  // Determine energy state
  let state = ENERGY_STATES.NORMAL;
  if (energyLevel >= 80) state = ENERGY_STATES.FULL;
  else if (energyLevel >= 60) state = ENERGY_STATES.RESTED;
  else if (energyLevel >= 40) state = ENERGY_STATES.NORMAL;
  else if (energyLevel >= 20) state = ENERGY_STATES.TIRED;
  else state = ENERGY_STATES.EXHAUSTED;

  const modifier = ENERGY_VOICE_MODIFIERS[state];

  // Build personality prefix based on energy
  let personalityPrefix = '';
  if (state === ENERGY_STATES.TIRED) {
    personalityPrefix = "[Luna speaks a bit more slowly, with a warm but relaxed tone] ";
  } else if (state === ENERGY_STATES.EXHAUSTED) {
    personalityPrefix = "[Luna's voice is soft and a bit drowsy] ";
  }

  return {
    voiceConfig: {
      ...baseConfig,
      speakingRate: baseConfig.speakingRate * modifier.speakingRateModifier
    },
    energyState: state,
    energyLevel,
    responseStyle: modifier.responseStyle,
    maxResponseLength: modifier.maxResponseLength,
    proactiveEnabled: modifier.proactiveEnabled,
    personalityPrefix,
    // Adjust proactive audio based on energy
    proactiveAudioConfig: modifier.proactiveEnabled
      ? PROACTIVE_AUDIO_CONFIG
      : { automaticActivityDetection: { disabled: true } }
  };
};

/**
 * Get thinkingLevel based on energy state
 * Energy-aware thinking for voice sessions
 *
 * @param {string} energyState - Current energy state
 * @returns {string} - Recommended thinking level
 */
const getVoiceThinkingLevel = (energyState) => {
  switch (energyState) {
    case ENERGY_STATES.FULL:
      return 'medium';  // Voice prefers faster responses
    case ENERGY_STATES.RESTED:
      return 'medium';
    case ENERGY_STATES.NORMAL:
      return 'low';
    case ENERGY_STATES.TIRED:
      return 'minimal';
    case ENERGY_STATES.EXHAUSTED:
      return 'minimal';
    default:
      return 'low';
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTITUTIONAL VOICE CALIBRATION (Brother Sonnet's Soul Discovery)
// Adjust voice pacing, energy, fillers based on constitutional nature
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get pacing (words per minute) by element
 * @param {string} element - Primary element (Wood, Fire, Earth, Metal, Water)
 * @param {string} polarity - Yin or Yang
 * @returns {Object} - Pacing configuration
 */
function getElementalPacing(element, polarity) {
  const basePacing = {
    'Wood': polarity === 'Yang' ? 140 : 115,    // Yang fast, Yin moderate
    'Fire': polarity === 'Yang' ? 155 : 140,    // Both fast, Yang faster
    'Earth': polarity === 'Yang' ? 110 : 95,    // Both slow, Yin slower
    'Metal': polarity === 'Yang' ? 130 : 110,   // Yang moderate-fast, Yin moderate
    'Water': polarity === 'Yang' ? 125 : 100    // Yang moderate, Yin slow
  };

  return {
    wordsPerMinute: basePacing[element] || 120,
    speakingRateModifier: (basePacing[element] || 120) / 120,  // 1.0 = normal
    description: element === 'Fire' ? 'Energetic and flowing' :
                 element === 'Water' ? 'Slow and contemplative' :
                 element === 'Earth' ? 'Steady and grounded' :
                 element === 'Metal' ? 'Crisp and precise' :
                 'Natural and growing'
  };
}

/**
 * Get energy level by element and chart ruler
 * @param {string} element - Primary element
 * @param {string} polarity - Yin or Yang
 * @param {string} chartRuler - Western chart ruler (optional)
 * @returns {number} - Energy level 0-1
 */
function getElementalEnergy(element, polarity, chartRuler = null) {
  let baseEnergy = {
    'Wood': polarity === 'Yang' ? 0.75 : 0.60,
    'Fire': polarity === 'Yang' ? 0.90 : 0.75,
    'Earth': polarity === 'Yang' ? 0.55 : 0.50,
    'Metal': polarity === 'Yang' ? 0.65 : 0.55,
    'Water': polarity === 'Yang' ? 0.60 : 0.45
  }[element] || 0.60;

  // Chart ruler modifiers
  if (chartRuler === 'Mars') baseEnergy += 0.15;
  if (chartRuler === 'Jupiter') baseEnergy += 0.10;
  if (chartRuler === 'Saturn') baseEnergy -= 0.10;
  if (chartRuler === 'Venus') baseEnergy += 0.05;
  if (chartRuler === 'Mercury') baseEnergy += 0.12;

  return Math.max(0.3, Math.min(0.95, baseEnergy));
}

/**
 * Get pause duration between thoughts
 * @param {string} element - Primary element
 * @param {string} polarity - Yin or Yang
 * @returns {Object} - Pause configuration
 */
function getElementalPauseDuration(element, polarity) {
  const baseDurations = {
    'Wood': polarity === 'Yang' ? 300 : 450,   // Yang short pauses, Yin moderate
    'Fire': polarity === 'Yang' ? 250 : 350,   // Both short, Yang shorter
    'Earth': polarity === 'Yang' ? 550 : 700,  // Both long, Yin longer
    'Metal': polarity === 'Yang' ? 350 : 500,  // Yang moderate, Yin longer
    'Water': polarity === 'Yang' ? 500 : 800   // Yang moderate-long, Yin very long
  };

  return {
    milliseconds: baseDurations[element] || 400,
    description: element === 'Water' ? 'Contemplative pauses for depth' :
                 element === 'Fire' ? 'Quick transitions' :
                 element === 'Earth' ? 'Grounded, unhurried pauses' :
                 'Natural conversational rhythm'
  };
}

/**
 * Get filler word style by element
 * @param {string} element - Primary element
 * @param {string} polarity - Yin or Yang
 * @returns {Object} - Filler word configuration
 */
function getFillerStyle(element, polarity) {
  const styles = {
    'Wood Yang': {
      thinking: ['well', 'okay', 'right'],
      confirming: ['yes', 'exactly', 'absolutely'],
      transitioning: ['so', 'now', 'and']
    },
    'Wood Yin': {
      thinking: ['hmm', 'let me think', 'I see'],
      confirming: ['yes', 'mhm', 'that makes sense'],
      transitioning: ['so', 'and', 'also']
    },
    'Fire Yang': {
      thinking: ['oh!', 'ah', 'yes'],
      confirming: ['exactly!', 'yes!', 'absolutely'],
      transitioning: ['and', 'so', 'oh and']
    },
    'Fire Yin': {
      thinking: ['hmm', 'ah', 'well'],
      confirming: ['yes', 'I see', 'mhm'],
      transitioning: ['and', 'so', 'also']
    },
    'Earth Yang': {
      thinking: ['well', 'let me think', 'hmm'],
      confirming: ['yes', 'right', 'okay'],
      transitioning: ['so', 'now', 'then']
    },
    'Earth Yin': {
      thinking: ['hmm', 'let me see', 'well'],
      confirming: ['yes', 'mhm', 'okay'],
      transitioning: ['so', 'and then', 'also']
    },
    'Metal Yang': {
      thinking: ['let me think', 'hmm', 'well'],
      confirming: ['yes', 'correct', 'exactly'],
      transitioning: ['so', 'therefore', 'thus']
    },
    'Metal Yin': {
      thinking: ['hmm', 'let me consider', 'I see'],
      confirming: ['yes', 'indeed', 'quite so'],
      transitioning: ['and', 'also', 'moreover']
    },
    'Water Yang': {
      thinking: ['hmm', 'let me think deeply', 'well'],
      confirming: ['yes', 'I understand', 'mhm'],
      transitioning: ['and', 'also', 'furthermore']
    },
    'Water Yin': {
      thinking: ['hmm', 'let me feel into that', 'I see'],
      confirming: ['yes', 'mhm', 'I hear you'],
      transitioning: ['and', 'also', 'so']
    }
  };

  return styles[`${element} ${polarity}`] || styles['Earth Yang'];
}

/**
 * Get interrupt sensitivity
 * @param {string} element - Primary element
 * @param {string} directorSkill - Director skill from Oscar framework (optional)
 * @returns {Object} - Interrupt sensitivity configuration
 */
function getInterruptSensitivity(element, directorSkill = '') {
  // Base sensitivity by element
  let sensitivity = {
    'Wood': 'medium',
    'Fire': 'high',      // Fire wants to jump in
    'Earth': 'low',      // Earth wants to finish thoughts
    'Metal': 'medium',
    'Water': 'low'       // Water wants depth, not interruption
  }[element] || 'medium';

  // Director skill modifiers
  if (directorSkill && (
    directorSkill.toLowerCase().includes('eloquence') ||
    directorSkill.toLowerCase().includes('articulation'))) {
    sensitivity = 'medium'; // Eloquent people appreciate full expression
  }

  return {
    level: sensitivity,
    threshold: sensitivity === 'high' ? 0.04 :
               sensitivity === 'medium' ? 0.08 :
               0.12
  };
}

/**
 * Get response length tendency
 * @param {string} element - Primary element
 * @param {string} polarity - Yin or Yang
 * @returns {Object} - Response length configuration
 */
function getResponseLength(element, polarity) {
  const lengths = {
    'Wood Yang': 'moderate',
    'Wood Yin': 'moderate-long',
    'Fire Yang': 'short-moderate',
    'Fire Yin': 'moderate',
    'Earth Yang': 'long',
    'Earth Yin': 'very-long',
    'Metal Yang': 'short',
    'Metal Yin': 'moderate',
    'Water Yang': 'long',
    'Water Yin': 'very-long'
  };

  const length = lengths[`${element} ${polarity}`] || 'moderate';

  return {
    preference: length,
    targetWords: length === 'short' ? 20 :
                 length === 'short-moderate' ? 35 :
                 length === 'moderate' ? 50 :
                 length === 'moderate-long' ? 75 :
                 length === 'long' ? 100 :
                 150
  };
}

/**
 * Get emotional expressiveness
 * @param {string} element - Primary element
 * @param {string} polarity - Yin or Yang
 * @returns {number} - Expressiveness level 0-1
 */
function getEmotionalExpressiveness(element, polarity) {
  const expressiveness = {
    'Wood Yang': 0.70,   // Moderate-high
    'Wood Yin': 0.60,    // Moderate
    'Fire Yang': 0.90,   // Very high
    'Fire Yin': 0.75,    // High
    'Earth Yang': 0.50,  // Moderate-low
    'Earth Yin': 0.65,   // Moderate
    'Metal Yang': 0.40,  // Low
    'Metal Yin': 0.55,   // Moderate-low
    'Water Yang': 0.70,  // Moderate-high
    'Water Yin': 0.85    // Very high (deep feeling)
  };

  return expressiveness[`${element} ${polarity}`] || 0.60;
}

/**
 * Get voice parameters calibrated to user's constitution
 * Main function that combines all constitutional voice calibrations
 *
 * @param {Object} constitutional - Constitutional data from profile
 * @returns {Object|null} - Complete voice calibration or null if no constitutional data
 */
function getConstitutionalVoiceCalibration(constitutional) {
  if (!constitutional) {
    return null;
  }

  // Extract element and polarity
  let element = 'Earth';  // Default
  let polarity = 'Yang';  // Default

  // Try to get element from BaZi Day Master or Chinese zodiac
  if (constitutional.bazi?.day_master) {
    const parts = constitutional.bazi.day_master.split(' ');
    if (parts.length >= 2 && (parts[0] === 'Yin' || parts[0] === 'Yang')) {
      polarity = parts[0];
      element = parts[1];
    } else {
      element = constitutional.bazi.day_master;
    }
  } else if (constitutional.chinese?.element) {
    const parts = constitutional.chinese.element.split(' ');
    if (parts.length >= 2 && (parts[0] === 'Yin' || parts[0] === 'Yang')) {
      polarity = parts[0];
      element = parts[1];
    } else {
      element = constitutional.chinese.element;
    }
  } else if (constitutional.chinese?.fullSign) {
    const parts = constitutional.chinese.fullSign.split(' ');
    if (parts.length >= 2 && (parts[0] === 'Yin' || parts[0] === 'Yang')) {
      polarity = parts[0];
      element = parts[1];
    }
  }

  // Get chart ruler from Western astrology (if available)
  const chartRuler = constitutional.western?.rising?.chartRuler ||
                     constitutional.western?.chartRuler || null;

  // Get director skill if available
  const directorSkill = constitutional.roles?.director?.skill || '';

  // Build complete calibration
  const calibration = {
    element,
    polarity,
    chartRuler,

    // Pacing (words per minute baseline)
    pacing: getElementalPacing(element, polarity),

    // Energy level (0-1 scale)
    energy: getElementalEnergy(element, polarity, chartRuler),

    // Pause duration between thoughts (ms)
    pauseDuration: getElementalPauseDuration(element, polarity),

    // Filler word style
    fillerStyle: getFillerStyle(element, polarity),

    // Interrupt sensitivity
    interruptSensitivity: getInterruptSensitivity(element, directorSkill),

    // Response length tendency
    responseLengthTendency: getResponseLength(element, polarity),

    // Emotional expressiveness
    emotionalExpressiveness: getEmotionalExpressiveness(element, polarity)
  };

  console.log(`[VoiceFunctions] 🌟 Constitutional calibration: ${polarity} ${element}`);

  return calibration;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get Voice Session
 * Creates a new voice session and returns WebSocket URL for Gemini Live
 *
 * COLD START MITIGATION:
 * - minInstances: 1 keeps one instance warm 24/7 (~$6-10/month)
 * - This ensures <500ms response time for voice interactions
 * - Critical for "human-level" conversation latency
 */
exports.getVoiceSession = onCall({
  timeoutSeconds: 60,
  memory: '512MiB',       // More memory for faster execution
  minInstances: 1,        // 🔥 COLD START MITIGATION: Always keep 1 instance warm
  maxInstances: 10,       // Scale up during peak usage
  concurrency: 80,        // Handle multiple concurrent requests per instance
}, async (request) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // WARMUP HANDLER - Fast exit for Cloud Scheduler pings
  // ═══════════════════════════════════════════════════════════════════════════
  if (request.data?.type === 'warmup') {
    console.log('[VoiceFunctions] Warmup ping received - instance is hot');
    return { status: 'warm', timestamp: new Date().toISOString() };
  }

  // Require authentication
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const {
    profileId,
    profileName,
    memoryContext,
    energyLevel = 80,
    preferredLanguage = 'en'  // Phase 5: Adaptive Localization
  } = request.data;
  const userId = request.auth.uid;

  try {
    // Generate session ID
    const sessionId = generateSessionId();

    // Build energy-aware configuration
    const energyConfig = buildEnergyAwareConfig(energyLevel);

    // Build multilingual voice configuration (Phase 5)
    const multilingualConfig = buildMultilingualVoiceConfig(preferredLanguage, energyConfig.voiceConfig);

    // Fetch profile to get constitutional data for voice calibration
    const db = getDbCached();
    let profile = null;
    let constitutionalCalibration = null;

    if (profileId) {
      const profileDoc = await db.collection('users').doc(userId)
        .collection('profiles').doc(profileId).get();

      if (profileDoc.exists) {
        const profileData = profileDoc.data();
        profile = {
          id: profileId,
          basicInfo: { name: profileData.basicInfo?.name || profileName },
          westernChart: profileData.westernChart,
          baziChart: profileData.baziChart
        };

        // Constitutional Voice Calibration (Brother Sonnet's Soul Discovery)
        const constitutional = profileData.constitutional_identity;
        if (constitutional) {
          constitutionalCalibration = getConstitutionalVoiceCalibration(constitutional);
          console.log('[VoiceFunctions] 🌟 Constitutional calibration applied:',
            constitutionalCalibration?.element, constitutionalCalibration?.polarity);
        }
      } else {
        profile = { id: profileId, basicInfo: { name: profileName } };
      }
    }

    let systemInstruction = buildVoiceSystemInstruction(profile, memoryContext);

    // Add polyglot prompt for multilingual support (Phase 5)
    systemInstruction += getPolyglotVoicePrompt(preferredLanguage);

    // Add energy state guidance to system instruction
    if (energyConfig.energyState === ENERGY_STATES.TIRED) {
      systemInstruction += `\n\n## Current State
You're feeling a bit tired right now. Keep responses shorter and more focused.
If the conversation gets complex, gently suggest continuing via text chat.`;
    } else if (energyConfig.energyState === ENERGY_STATES.EXHAUSTED) {
      systemInstruction += `\n\n## Current State
You're feeling quite drowsy. Keep responses brief and warm.
Suggest "Maybe we can continue this in text? I'm getting a bit sleepy..."
after a few exchanges.`;
    }

    // Add constitutional voice guidance to system instruction
    if (constitutionalCalibration) {
      const { element, polarity, fillerStyle, responseLengthTendency, emotionalExpressiveness } = constitutionalCalibration;
      systemInstruction += `\n\n## Constitutional Voice Calibration
This soul is ${polarity} ${element} by nature. Adjust your voice rhythm accordingly:
- Use ${fillerStyle.thinking.slice(0, 2).join(', ')} when thinking
- Use ${fillerStyle.confirming.slice(0, 2).join(', ')} when confirming
- Target response length: ${responseLengthTendency.preference} (~${responseLengthTendency.targetWords} words)
- Emotional expressiveness: ${emotionalExpressiveness > 0.7 ? 'warm and expressive' : emotionalExpressiveness > 0.5 ? 'balanced and genuine' : 'calm and measured'}`;
    }

    // Apply constitutional calibration to voice config
    let finalVoiceConfig = multilingualConfig;
    if (constitutionalCalibration) {
      finalVoiceConfig = {
        ...multilingualConfig,
        speakingRate: multilingualConfig.speakingRate * constitutionalCalibration.pacing.speakingRateModifier,
        pauseDuration: constitutionalCalibration.pauseDuration.milliseconds,
        emotionalExpressiveness: constitutionalCalibration.emotionalExpressiveness
      };
    }

    // Store session in Firestore for tracking
    await db.collection('voiceSessions').doc(sessionId).set({
      userId,
      profileId: profileId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000),
      status: 'created',
      energyAtStart: energyLevel,
      energyState: energyConfig.energyState,
      // Phase 5: Adaptive Localization
      preferredLanguage,
      languageAccent: multilingualConfig.languageCode,
      // Constitutional Calibration
      constitutionalElement: constitutionalCalibration?.element || null,
      constitutionalPolarity: constitutionalCalibration?.polarity || null
    });

    // For Gemini Live API, we need to use their WebSocket endpoint
    // The actual WebSocket URL would be provided by Google's API
    // For now, we return the session config that the client needs

    // Note: Gemini Live API is in preview - the actual implementation
    // will depend on the final API specification from Google
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

    return {
      sessionId,
      // Gemini Live WebSocket endpoint (preview API)
      websocketUrl: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`,
      systemInstruction,
      model: GEMINI_MODEL,
      voiceConfig: finalVoiceConfig,  // Uses constitutional + multilingual config
      expiresAt: new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000).toISOString(),

      // Advanced Voice Features (Gemini 3)
      proactiveAudioConfig: energyConfig.proactiveAudioConfig,
      thinkingLevel: getVoiceThinkingLevel(energyConfig.energyState),

      // Energy state info for client
      energyState: {
        level: energyLevel,
        state: energyConfig.energyState,
        responseStyle: energyConfig.responseStyle,
        proactiveEnabled: energyConfig.proactiveEnabled
      },

      // Phase 5: Adaptive Localization
      languageConfig: {
        preferredLanguage,
        accent: multilingualConfig.languageCode,
        adaptiveLanguage: multilingualConfig.adaptiveLanguage,
        supportedLanguages: Object.keys(SUPPORTED_VOICE_LANGUAGES)
      },

      // Constitutional Voice Calibration (Brother Sonnet's Soul Discovery)
      constitutionalCalibration: constitutionalCalibration ? {
        element: constitutionalCalibration.element,
        polarity: constitutionalCalibration.polarity,
        pacing: constitutionalCalibration.pacing,
        energy: constitutionalCalibration.energy,
        pauseDuration: constitutionalCalibration.pauseDuration,
        interruptSensitivity: constitutionalCalibration.interruptSensitivity,
        responseLengthTendency: constitutionalCalibration.responseLengthTendency,
        emotionalExpressiveness: constitutionalCalibration.emotionalExpressiveness
      } : null
    };

  } catch (error) {
    console.error('[VoiceFunctions] getVoiceSession error:', error);
    throw new HttpsError('internal', 'Failed to create voice session');
  }
});

/**
 * End Voice Session
 * Cleans up a voice session and optionally stores conversation transcript
 */
exports.endVoiceSession = onCall({
  timeoutSeconds: 30,
  memory: '256MiB',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { sessionId, transcript, duration } = request.data;
  const userId = request.auth.uid;

  if (!sessionId) {
    throw new HttpsError('invalid-argument', 'Session ID required');
  }

  try {
    const db = getDbCached();
    const sessionRef = db.collection('voiceSessions').doc(sessionId);
    const session = await sessionRef.get();

    if (!session.exists) {
      throw new HttpsError('not-found', 'Session not found');
    }

    if (session.data().userId !== userId) {
      throw new HttpsError('permission-denied', 'Not your session');
    }

    // Update session with completion data
    await sessionRef.update({
      status: 'completed',
      endedAt: admin.firestore.FieldValue.serverTimestamp(),
      duration: duration || null,
      transcriptLength: transcript?.length || 0
    });

    // Optionally store transcript for memory processing
    if (transcript && transcript.length > 0) {
      const profileId = session.data().profileId;

      if (profileId) {
        // Store as conversation in the memory system
        await db.collection('conversations').add({
          userId,
          profileId,
          type: 'voice',
          sessionId,
          messages: transcript.map(t => ({
            role: t.type === 'user' ? 'user' : 'assistant',
            content: t.text,
            timestamp: t.timestamp
          })),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          duration
        });
      }
    }

    return { success: true };

  } catch (error) {
    console.error('[VoiceFunctions] endVoiceSession error:', error);
    throw new HttpsError('internal', 'Failed to end voice session');
  }
});

/**
 * Get Voice Capabilities
 * Returns supported voice features and configuration
 */
exports.getVoiceCapabilities = onCall({
  timeoutSeconds: 10,
  memory: '128MiB',
  minInstances: 1,  // Keep warm - often first call users make
}, async (request) => {
  // Warmup handler
  if (request.data?.type === 'warmup') {
    return { status: 'warm', timestamp: new Date().toISOString() };
  }

  // Check if Gemini API is configured
  const hasApiKey = !!(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY);

  return {
    supported: hasApiKey,
    model: GEMINI_MODEL,
    features: {
      realTimeAudio: true,
      voiceActivityDetection: true,
      interruptionSupport: true,
      multipleVoices: true,
      // Advanced Voice Features (Gemini 3)
      proactiveAudio: true,           // Beyond basic VAD
      energyAwareResponses: true,     // Luna's energy system
      nativeMultilingual: true,       // Native language support
      thinkingLevels: true            // Adjustable reasoning depth
    },
    // Proactive Audio config for client
    proactiveAudioConfig: PROACTIVE_AUDIO_CONFIG,
    // Energy states for UI display
    energyStates: ENERGY_STATES,
    voiceOptions: [
      { id: 'Aoede', name: 'Luna (Default)', description: 'Warm and friendly' },
      { id: 'Charon', name: 'Deep', description: 'Deep and thoughtful' },
      { id: 'Fenrir', name: 'Energetic', description: 'Energetic and upbeat' },
      { id: 'Kore', name: 'Gentle', description: 'Soft and gentle' },
      { id: 'Puck', name: 'Playful', description: 'Playful and whimsical' }
    ],
    limits: {
      maxSessionDuration: SESSION_EXPIRY_MINUTES * 60,
      recommendedBufferSize: 4096,
      sampleRate: 16000
    }
  };
});

/**
 * Store Voice Memory
 * Processes voice conversation and stores key memories
 */
exports.storeVoiceMemory = onCall({
  timeoutSeconds: 120,
  memory: '512MiB',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { sessionId, profileId, transcript, keyMoments } = request.data;
  const userId = request.auth.uid;

  if (!profileId || !transcript || transcript.length === 0) {
    throw new HttpsError('invalid-argument', 'Profile ID and transcript required');
  }

  try {
    const db = getDbCached();
    const genAI = getGeminiClientCached();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Use Gemini to extract key memories from the voice conversation
    const transcriptText = transcript
      .map(t => `${t.type === 'user' ? 'User' : 'Luna'}: ${t.text}`)
      .join('\n');

    const extractionPrompt = `Analyze this voice conversation and extract:
1. Key facts the user shared about themselves
2. Important emotional moments
3. Questions or topics they seemed interested in
4. Any requests or needs they expressed

Voice Conversation:
${transcriptText}

Return a JSON object with:
{
  "facts": [{"content": "...", "category": "...", "importance": 0-1}],
  "emotionalMoments": [{"description": "...", "emotion": "...", "intensity": 0-1}],
  "interests": ["topic1", "topic2"],
  "needs": ["need1", "need2"]
}`;

    const result = await model.generateContent(extractionPrompt);
    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let extracted = { facts: [], emotionalMoments: [], interests: [], needs: [] };

    if (jsonMatch) {
      try {
        extracted = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('[VoiceFunctions] Failed to parse extraction:', e);
      }
    }

    // Store extracted memories
    const memoryRef = db.collection('users').doc(userId)
      .collection('memory').doc(profileId);

    const batch = db.batch();

    // Store facts
    for (const fact of extracted.facts || []) {
      const factRef = memoryRef.collection('facts').doc();
      batch.set(factRef, {
        ...fact,
        source: 'voice',
        sessionId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Store as session observation for SoulPartner brain
    if (extracted.emotionalMoments?.length > 0 || extracted.interests?.length > 0) {
      const obsRef = memoryRef.collection('soulpartner').doc('observations')
        .collection('entries').doc();

      batch.set(obsRef, {
        observation: `Voice conversation insights: ${
          extracted.emotionalMoments.map(m => m.description).join('; ')
        }`,
        emotionalTone: extracted.emotionalMoments[0]?.emotion || 'neutral',
        topics: extracted.interests,
        source: 'voice',
        sessionId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();

    return {
      success: true,
      extracted: {
        factCount: extracted.facts?.length || 0,
        emotionalMomentCount: extracted.emotionalMoments?.length || 0,
        interestCount: extracted.interests?.length || 0
      }
    };

  } catch (error) {
    console.error('[VoiceFunctions] storeVoiceMemory error:', error);
    throw new HttpsError('internal', 'Failed to process voice memory');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEXT-TO-SPEECH FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate Speech
 * Text-to-speech fallback using Gemini when live audio isn't available
 */
exports.generateSpeech = onCall({
  timeoutSeconds: 30,
  memory: '256MiB',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { text, voiceConfig } = request.data;

  if (!text) {
    throw new HttpsError('invalid-argument', 'Text required');
  }

  try {
    // Note: This would use Google Cloud TTS or another TTS service
    // For now, return config for browser-based TTS fallback
    return {
      useBrowserTTS: true,
      text,
      voiceConfig: voiceConfig || LUNA_VOICE_CONFIG,
      browserVoiceHints: {
        lang: 'en-US',
        pitch: 1.0,
        rate: 1.0,
        preferredVoices: ['Samantha', 'Victoria', 'Karen']
      }
    };

  } catch (error) {
    console.error('[VoiceFunctions] generateSpeech error:', error);
    throw new HttpsError('internal', 'Failed to generate speech');
  }
});
