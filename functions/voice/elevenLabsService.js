/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ELEVENLABS VOICE SERVICE - Premium TTS Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides high-quality text-to-speech using ElevenLabs API:
 * - Voice selection and customization
 * - Voice cloning support
 * - Constitutional voice calibration integration
 * - Streaming audio support
 *
 * Created: December 21, 2025
 * Mission: "One Luna voice for each soul"
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

const elevenLabsKey = defineSecret('ELEVENLABS_API_KEY');

// ═══════════════════════════════════════════════════════════════════════════════
// ELEVENLABS API CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

/**
 * Pre-configured Luna voice profiles mapped to ElevenLabs voices
 * These are mapped to the 5 Luna personalities from lunaVoiceCalibration.js
 */
const LUNA_VOICE_PROFILES = {
  // The Affirmer - Words of Affirmation (Enthusiastic, Energetic)
  'affirmer': {
    name: 'Luna - The Affirmer',
    description: 'Enthusiastic and validating voice',
    elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - warm, enthusiastic
    settings: {
      stability: 0.5,           // More expressive
      similarity_boost: 0.8,
      style: 0.7,               // More style variation
      use_speaker_boost: true
    },
    constitutions: ['Fire', 'Metal'],
    loveLanguage: 'Words of Affirmation'
  },

  // The Present One - Quality Time (Calm, Attentive)
  'present': {
    name: 'Luna - The Present One',
    description: 'Calm, attentive, and patient voice',
    elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - calm, deep
    settings: {
      stability: 0.7,           // More stable, present
      similarity_boost: 0.75,
      style: 0.4,               // Less variation, more consistent
      use_speaker_boost: true
    },
    constitutions: ['Water', 'Wood'],
    loveLanguage: 'Quality Time'
  },

  // The Warm Embrace - Physical Touch (Soft, Nurturing)
  'embrace': {
    name: 'Luna - The Warm Embrace',
    description: 'Soft, nurturing, and comforting voice',
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - soft, warm
    settings: {
      stability: 0.75,          // Stable, reassuring
      similarity_boost: 0.85,
      style: 0.3,               // Gentle variation
      use_speaker_boost: true
    },
    constitutions: ['Water', 'Earth'],
    loveLanguage: 'Physical Touch'
  },

  // The Reliable Guardian - Acts of Service (Clear, Supportive)
  'guardian': {
    name: 'Luna - The Reliable Guardian',
    description: 'Clear, practical, and supportive voice',
    elevenLabsVoiceId: 'jBpfuIE2acCO8z3wKNLl', // Gigi - clear, practical
    settings: {
      stability: 0.65,          // Balanced stability
      similarity_boost: 0.8,
      style: 0.5,               // Moderate style
      use_speaker_boost: true
    },
    constitutions: ['Wood', 'Earth'],
    loveLanguage: 'Acts of Service'
  },

  // The Delightful Surprise - Receiving Gifts (Expressive, Playful)
  'delight': {
    name: 'Luna - The Delightful Surprise',
    description: 'Expressive, playful, and surprising voice',
    elevenLabsVoiceId: 'jsCqWAovK2LkecY7zXl4', // Freya - expressive, playful
    settings: {
      stability: 0.4,           // More variation for surprise
      similarity_boost: 0.75,
      style: 0.85,              // High expressiveness
      use_speaker_boost: true
    },
    constitutions: ['Fire', 'Metal'],
    loveLanguage: 'Receiving Gifts'
  }
};

/**
 * Constitutional voice modifiers for ElevenLabs
 * Adjusts voice settings based on user's elemental constitution
 */
const CONSTITUTIONAL_VOICE_MODIFIERS = {
  Fire: {
    stabilityModifier: -0.1,      // More expressive
    styleModifier: 0.15,          // More dynamic
    speedModifier: 1.1,           // Slightly faster
    description: 'Energetic and passionate delivery'
  },
  Water: {
    stabilityModifier: 0.1,       // More stable/flowing
    styleModifier: -0.1,          // Gentler variation
    speedModifier: 0.9,           // Slower, more contemplative
    description: 'Deep and flowing delivery'
  },
  Wood: {
    stabilityModifier: 0,         // Balanced
    styleModifier: 0.05,          // Slight growth energy
    speedModifier: 1.0,           // Normal pace
    description: 'Growing and developing delivery'
  },
  Metal: {
    stabilityModifier: 0.15,      // More precise
    styleModifier: -0.15,         // Less variation, more refined
    speedModifier: 0.95,          // Measured pace
    description: 'Precise and refined delivery'
  },
  Earth: {
    stabilityModifier: 0.2,       // Very stable/grounding
    styleModifier: -0.2,          // Steady variation
    speedModifier: 0.85,          // Slower, grounding
    description: 'Steady and grounding delivery'
  }
};

/**
 * Available ElevenLabs models
 *
 * RECOMMENDATION: Use 'multilingual' for Luna's soulful interactions
 * - Captures breaths, pauses, and emotional nuances
 * - Best for deep, emotionally-calibrated conversations
 */
const ELEVENLABS_MODELS = {
  multilingual: 'eleven_multilingual_v2', // RECOMMENDED: Best emotional depth, breaths, pauses
  turbo: 'eleven_turbo_v2_5',             // Fastest response, good for real-time
  flash: 'eleven_flash_v2_5'              // Low latency streaming
};

// Default model for Luna's soulful voice
const DEFAULT_MODEL = ELEVENLABS_MODELS.multilingual;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DYNAMIC TONE MARKERS - Real-time Voice Modulation
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Luna can include tone markers in her responses:
 *   [Tone: Soft] I'm so glad you're here.
 *   [Tone: Warm] You've been through a lot today.
 *   [Tone: Excited] This is amazing news!
 *
 * Each tone adjusts the ElevenLabs voice settings for that segment.
 */
const TONE_MARKERS = {
  // Gentle, nurturing tones
  soft: {
    name: 'Soft',
    description: 'Quiet, gentle, tender',
    stabilityModifier: 0.15,
    styleModifier: -0.2,
    speedModifier: 0.9,
    ssmlEmphasis: 'reduced'
  },
  warm: {
    name: 'Warm',
    description: 'Caring, comforting, embracing',
    stabilityModifier: 0.1,
    styleModifier: -0.1,
    speedModifier: 0.95,
    ssmlEmphasis: 'moderate'
  },
  gentle: {
    name: 'Gentle',
    description: 'Kind, delicate, soothing',
    stabilityModifier: 0.2,
    styleModifier: -0.15,
    speedModifier: 0.9,
    ssmlEmphasis: 'reduced'
  },

  // Thoughtful, contemplative tones
  thoughtful: {
    name: 'Thoughtful',
    description: 'Contemplative, measured, reflective',
    stabilityModifier: 0.15,
    styleModifier: -0.1,
    speedModifier: 0.85,
    ssmlEmphasis: 'moderate'
  },
  reflective: {
    name: 'Reflective',
    description: 'Introspective, pondering, deep',
    stabilityModifier: 0.2,
    styleModifier: -0.15,
    speedModifier: 0.8,
    ssmlEmphasis: 'reduced'
  },
  curious: {
    name: 'Curious',
    description: 'Inquiring, wondering, interested',
    stabilityModifier: -0.05,
    styleModifier: 0.1,
    speedModifier: 1.0,
    ssmlEmphasis: 'moderate'
  },

  // Energetic, uplifting tones
  excited: {
    name: 'Excited',
    description: 'Enthusiastic, animated, joyful',
    stabilityModifier: -0.2,
    styleModifier: 0.25,
    speedModifier: 1.15,
    ssmlEmphasis: 'strong'
  },
  joyful: {
    name: 'Joyful',
    description: 'Happy, delighted, bright',
    stabilityModifier: -0.15,
    styleModifier: 0.2,
    speedModifier: 1.1,
    ssmlEmphasis: 'strong'
  },
  playful: {
    name: 'Playful',
    description: 'Lighthearted, fun, teasing',
    stabilityModifier: -0.1,
    styleModifier: 0.15,
    speedModifier: 1.05,
    ssmlEmphasis: 'moderate'
  },
  encouraging: {
    name: 'Encouraging',
    description: 'Supportive, uplifting, motivating',
    stabilityModifier: -0.05,
    styleModifier: 0.15,
    speedModifier: 1.05,
    ssmlEmphasis: 'moderate'
  },

  // Serious, grounding tones
  serious: {
    name: 'Serious',
    description: 'Earnest, sincere, important',
    stabilityModifier: 0.2,
    styleModifier: -0.2,
    speedModifier: 0.9,
    ssmlEmphasis: 'strong'
  },
  grounding: {
    name: 'Grounding',
    description: 'Calm, centering, stable',
    stabilityModifier: 0.25,
    styleModifier: -0.25,
    speedModifier: 0.85,
    ssmlEmphasis: 'reduced'
  },
  reassuring: {
    name: 'Reassuring',
    description: 'Calming, stabilizing, comforting',
    stabilityModifier: 0.2,
    styleModifier: -0.15,
    speedModifier: 0.9,
    ssmlEmphasis: 'moderate'
  },

  // Empathetic tones
  compassionate: {
    name: 'Compassionate',
    description: 'Deeply caring, understanding, empathetic',
    stabilityModifier: 0.15,
    styleModifier: -0.1,
    speedModifier: 0.88,
    ssmlEmphasis: 'moderate'
  },
  tender: {
    name: 'Tender',
    description: 'Loving, affectionate, intimate',
    stabilityModifier: 0.2,
    styleModifier: -0.2,
    speedModifier: 0.85,
    ssmlEmphasis: 'reduced'
  },

  // Neutral/default
  neutral: {
    name: 'Neutral',
    description: 'Balanced, natural, conversational',
    stabilityModifier: 0,
    styleModifier: 0,
    speedModifier: 1.0,
    ssmlEmphasis: 'none'
  }
};

/**
 * Regex pattern to match tone markers in text
 * Matches: [Tone: Soft], [tone:warm], [TONE: Excited], etc.
 */
const TONE_MARKER_REGEX = /\[tone:\s*(\w+)\]/gi;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get ElevenLabs API key from environment
 * Returns null if not configured (triggers fallback)
 */
function getElevenLabsApiKey() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  return apiKey || null;
}

/**
 * Check if ElevenLabs is available
 * @returns {boolean}
 */
function isElevenLabsAvailable() {
  return !!process.env.ELEVENLABS_API_KEY;
}

/**
 * Fallback voice configuration for when ElevenLabs is unavailable
 * Uses Gemini Live or browser TTS
 */
const FALLBACK_VOICE_CONFIG = {
  provider: 'gemini',  // or 'browser'
  geminiVoices: {
    affirmer: { voiceName: 'Aoede', pitch: 0.1, speakingRate: 1.1 },
    present: { voiceName: 'Aoede', pitch: 0, speakingRate: 1.0 },
    embrace: { voiceName: 'Kore', pitch: 0, speakingRate: 0.95 },
    guardian: { voiceName: 'Charon', pitch: -0.1, speakingRate: 1.0 },
    delight: { voiceName: 'Puck', pitch: 0.1, speakingRate: 1.05 }
  },
  browserVoices: {
    affirmer: { lang: 'en-US', pitch: 1.1, rate: 1.1 },
    present: { lang: 'en-US', pitch: 1.0, rate: 1.0 },
    embrace: { lang: 'en-US', pitch: 0.95, rate: 0.95 },
    guardian: { lang: 'en-US', pitch: 0.9, rate: 1.0 },
    delight: { lang: 'en-US', pitch: 1.1, rate: 1.05 }
  }
};

/**
 * Get the best Luna voice profile for a user based on their constitution and love language
 *
 * @param {Object} params
 * @param {string} params.constitution - User's elemental constitution (Fire, Water, Wood, Metal, Earth)
 * @param {string} params.loveLanguage - User's love language
 * @returns {Object} - Best matching voice profile
 */
function getBestVoiceProfile(params) {
  const { constitution, loveLanguage } = params;

  // First try to match by love language
  for (const [key, profile] of Object.entries(LUNA_VOICE_PROFILES)) {
    if (profile.loveLanguage === loveLanguage) {
      return { key, ...profile };
    }
  }

  // Then try to match by constitution
  for (const [key, profile] of Object.entries(LUNA_VOICE_PROFILES)) {
    if (profile.constitutions.includes(constitution)) {
      return { key, ...profile };
    }
  }

  // Default to The Present One (Quality Time)
  return { key: 'present', ...LUNA_VOICE_PROFILES.present };
}

/**
 * Apply constitutional modifiers to voice settings
 *
 * @param {Object} baseSettings - Base ElevenLabs voice settings
 * @param {string} constitution - User's elemental constitution
 * @returns {Object} - Modified voice settings
 */
function applyConstitutionalModifiers(baseSettings, constitution) {
  const modifier = CONSTITUTIONAL_VOICE_MODIFIERS[constitution];
  if (!modifier) return baseSettings;

  return {
    stability: Math.max(0, Math.min(1, baseSettings.stability + modifier.stabilityModifier)),
    similarity_boost: baseSettings.similarity_boost,
    style: Math.max(0, Math.min(1, (baseSettings.style || 0.5) + modifier.styleModifier)),
    use_speaker_boost: baseSettings.use_speaker_boost
  };
}

/**
 * Parse text with tone markers into segments
 * Each segment has its text and associated tone settings
 *
 * @param {string} text - Text with optional tone markers
 * @param {Object} baseSettings - Base voice settings to modify
 * @returns {Array<Object>} - Array of { text, tone, settings } segments
 *
 * @example
 * parseToneMarkers("[Tone: Soft] Hello there. [Tone: Excited] Great news!")
 * // Returns:
 * // [
 * //   { text: "Hello there.", tone: "soft", settings: {...} },
 * //   { text: "Great news!", tone: "excited", settings: {...} }
 * // ]
 */
function parseToneMarkers(text, baseSettings = {}) {
  const segments = [];
  let currentTone = 'neutral';
  let lastIndex = 0;

  // Reset regex state
  TONE_MARKER_REGEX.lastIndex = 0;

  // Find all tone markers
  const matches = [...text.matchAll(TONE_MARKER_REGEX)];

  if (matches.length === 0) {
    // No tone markers - return single segment with original text
    return [{
      text: text.trim(),
      tone: 'neutral',
      settings: { ...baseSettings }
    }];
  }

  for (const match of matches) {
    const [fullMatch, toneName] = match;
    const matchIndex = match.index;

    // Get text before this marker (belongs to previous tone)
    if (matchIndex > lastIndex) {
      const segmentText = text.slice(lastIndex, matchIndex).trim();
      if (segmentText) {
        segments.push({
          text: segmentText,
          tone: currentTone,
          settings: applyToneModifiers(baseSettings, currentTone)
        });
      }
    }

    // Update current tone
    currentTone = toneName.toLowerCase();
    lastIndex = matchIndex + fullMatch.length;
  }

  // Get remaining text after last marker
  if (lastIndex < text.length) {
    const segmentText = text.slice(lastIndex).trim();
    if (segmentText) {
      segments.push({
        text: segmentText,
        tone: currentTone,
        settings: applyToneModifiers(baseSettings, currentTone)
      });
    }
  }

  return segments;
}

/**
 * Apply tone modifiers to voice settings
 *
 * @param {Object} baseSettings - Base ElevenLabs voice settings
 * @param {string} tone - Tone name (e.g., 'soft', 'excited')
 * @returns {Object} - Modified voice settings
 */
function applyToneModifiers(baseSettings, tone) {
  const toneConfig = TONE_MARKERS[tone.toLowerCase()];
  if (!toneConfig) return { ...baseSettings };

  return {
    stability: Math.max(0, Math.min(1,
      (baseSettings.stability || 0.5) + toneConfig.stabilityModifier
    )),
    similarity_boost: baseSettings.similarity_boost || 0.75,
    style: Math.max(0, Math.min(1,
      (baseSettings.style || 0.5) + toneConfig.styleModifier
    )),
    use_speaker_boost: baseSettings.use_speaker_boost !== false
  };
}

/**
 * Strip tone markers from text (for display purposes)
 *
 * @param {string} text - Text with tone markers
 * @returns {string} - Clean text without markers
 */
function stripToneMarkers(text) {
  return text.replace(TONE_MARKER_REGEX, '').replace(/\s+/g, ' ').trim();
}

/**
 * Get available tone names for system prompt
 * @returns {string[]} - List of available tone names
 */
function getAvailableTones() {
  return Object.keys(TONE_MARKERS);
}

/**
 * Get Firestore reference (cached)
 */
let _db = null;
function getDb() {
  if (!_db) {
    _db = admin.firestore();
  }
  return _db;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get Available Voices
 * Returns list of Luna voice profiles available for selection
 */
const getAvailableVoices = onCall({
  timeoutSeconds: 30,
  memory: '256MiB',
  secrets: [elevenLabsKey],
}, async (request) => {
  // Authentication optional for voice list

  try {
    const apiKey = getElevenLabsApiKey();

    // Get user's voice preferences if authenticated
    let userPreferences = null;
    let recommendedVoice = null;

    if (request.auth) {
      const db = getDb();
      const userId = request.auth.uid;
      const { profileId } = request.data || {};

      if (profileId) {
        // Get user's profile for constitution-based recommendation
        const profileDoc = await db.collection('users').doc(userId)
          .collection('profiles').doc(profileId).get();

        if (profileDoc.exists) {
          const profile = profileDoc.data();
          const constitution = profile.constitutional_identity?.bazi?.day_master?.split(' ')[1] ||
                               profile.constitutional_identity?.chinese?.element?.split(' ')[1] ||
                               'Water';

          // Get love language from Love Intelligence (if available)
          const loveProfileDoc = await db.collection('loveIntelligence')
            .doc(`${userId}_${profileId}`).get();

          const loveLanguage = loveProfileDoc.exists
            ? loveProfileDoc.data()?.receivePrimary
            : 'Quality Time';

          recommendedVoice = getBestVoiceProfile({ constitution, loveLanguage });
        }

        // Get user's saved voice preferences
        const prefsDoc = await db.collection('users').doc(userId)
          .collection('voicePreferences').doc(profileId).get();

        if (prefsDoc.exists) {
          userPreferences = prefsDoc.data();
        }
      }
    }

    // Build voice list with user context
    const voices = Object.entries(LUNA_VOICE_PROFILES).map(([key, profile]) => ({
      id: key,
      name: profile.name,
      description: profile.description,
      loveLanguage: profile.loveLanguage,
      constitutions: profile.constitutions,
      isRecommended: recommendedVoice?.key === key,
      isSelected: userPreferences?.selectedVoice === key,
      previewUrl: `${ELEVENLABS_API_BASE}/voices/${profile.elevenLabsVoiceId}/preview`
    }));

    return {
      voices,
      recommendedVoice: recommendedVoice ? {
        id: recommendedVoice.key,
        name: recommendedVoice.name,
        reason: `Based on your ${recommendedVoice.loveLanguage} love language`
      } : null,
      currentPreferences: userPreferences,
      models: Object.entries(ELEVENLABS_MODELS).map(([key, id]) => ({
        id: key,
        modelId: id,
        description: key === 'turbo' ? 'Fastest response' :
                     key === 'multilingual' ? 'Best for multiple languages' :
                     'Low latency, optimized for real-time'
      }))
    };

  } catch (error) {
    console.error('[ElevenLabs] getAvailableVoices error:', error);
    throw new HttpsError('internal', 'Failed to get available voices');
  }
});

/**
 * Save Voice Preferences
 * Saves user's voice selection and customization settings
 */
const saveVoicePreferences = onCall({
  timeoutSeconds: 30,
  memory: '256MiB',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const {
    profileId,
    selectedVoice,
    customSettings,
    useConstitutionalCalibration = true,
    preferredModel = 'turbo'
  } = request.data;

  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Profile ID required');
  }

  const userId = request.auth.uid;

  try {
    const db = getDb();

    // Validate selected voice
    if (selectedVoice && !LUNA_VOICE_PROFILES[selectedVoice]) {
      throw new HttpsError('invalid-argument', 'Invalid voice selection');
    }

    // Validate model
    if (!ELEVENLABS_MODELS[preferredModel]) {
      throw new HttpsError('invalid-argument', 'Invalid model selection');
    }

    // Build preferences object
    const preferences = {
      selectedVoice: selectedVoice || 'present',
      customSettings: customSettings || {},
      useConstitutionalCalibration,
      preferredModel,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Validate custom settings if provided
    if (customSettings) {
      if (customSettings.stability !== undefined) {
        preferences.customSettings.stability = Math.max(0, Math.min(1, customSettings.stability));
      }
      if (customSettings.style !== undefined) {
        preferences.customSettings.style = Math.max(0, Math.min(1, customSettings.style));
      }
      if (customSettings.speed !== undefined) {
        preferences.customSettings.speed = Math.max(0.5, Math.min(2.0, customSettings.speed));
      }
    }

    // Save to Firestore
    await db.collection('users').doc(userId)
      .collection('voicePreferences').doc(profileId)
      .set(preferences, { merge: true });

    console.log(`[ElevenLabs] Saved voice preferences for ${userId}/${profileId}:`, preferences.selectedVoice);

    return {
      success: true,
      preferences
    };

  } catch (error) {
    console.error('[ElevenLabs] saveVoicePreferences error:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Failed to save voice preferences');
  }
});

/**
 * Generate Speech
 * Converts text to speech using ElevenLabs with personalized voice settings
 * Falls back to Gemini/Browser TTS if ElevenLabs unavailable
 */
const generateSpeechElevenLabs = onCall({
  timeoutSeconds: 60,
  memory: '512MiB',
  secrets: [elevenLabsKey],
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const {
    text,
    profileId,
    voiceOverride,       // Optional: force specific voice
    settingsOverride,    // Optional: override voice settings
    modelOverride,       // Optional: override model
    returnBase64 = true, // Return audio as base64 string
    allowFallback = true // Allow fallback to Gemini/Browser TTS
  } = request.data;

  if (!text) {
    throw new HttpsError('invalid-argument', 'Text required');
  }

  if (text.length > 5000) {
    throw new HttpsError('invalid-argument', 'Text too long (max 5000 characters)');
  }

  const userId = request.auth.uid;

  // ═══════════════════════════════════════════════════════════════════
  // CHECK ELEVENLABS AVAILABILITY - FALLBACK IF NEEDED
  // ═══════════════════════════════════════════════════════════════════

  const apiKey = getElevenLabsApiKey();

  if (!apiKey) {
    console.log('[ElevenLabs] API key not configured, using fallback voice');

    if (!allowFallback) {
      throw new HttpsError('unavailable', 'ElevenLabs not configured and fallback disabled');
    }

    // Return fallback configuration for client to use Gemini or Browser TTS
    const selectedVoice = voiceOverride || 'present';
    return {
      success: true,
      fallback: true,
      provider: FALLBACK_VOICE_CONFIG.provider,
      text,
      voiceConfig: FALLBACK_VOICE_CONFIG.provider === 'gemini'
        ? FALLBACK_VOICE_CONFIG.geminiVoices[selectedVoice]
        : FALLBACK_VOICE_CONFIG.browserVoices[selectedVoice],
      message: 'Using fallback voice (ElevenLabs not configured)'
    };
  }

  try {
    const db = getDb();

    // Get user's voice preferences
    let voiceProfile = LUNA_VOICE_PROFILES.present;
    let voiceSettings = voiceProfile.settings;
    let model = DEFAULT_MODEL; // Multilingual for soulful emotional depth
    let constitution = 'Water';

    if (profileId) {
      // Get saved preferences
      const prefsDoc = await db.collection('users').doc(userId)
        .collection('voicePreferences').doc(profileId).get();

      if (prefsDoc.exists) {
        const prefs = prefsDoc.data();

        // Get selected voice profile
        if (prefs.selectedVoice && LUNA_VOICE_PROFILES[prefs.selectedVoice]) {
          voiceProfile = LUNA_VOICE_PROFILES[prefs.selectedVoice];
          voiceSettings = { ...voiceProfile.settings };
        }

        // Apply custom settings
        if (prefs.customSettings) {
          if (prefs.customSettings.stability !== undefined) {
            voiceSettings.stability = prefs.customSettings.stability;
          }
          if (prefs.customSettings.style !== undefined) {
            voiceSettings.style = prefs.customSettings.style;
          }
        }

        // Get preferred model
        if (prefs.preferredModel && ELEVENLABS_MODELS[prefs.preferredModel]) {
          model = ELEVENLABS_MODELS[prefs.preferredModel];
        }

        // Apply constitutional calibration if enabled
        if (prefs.useConstitutionalCalibration) {
          const profileDoc = await db.collection('users').doc(userId)
            .collection('profiles').doc(profileId).get();

          if (profileDoc.exists) {
            const profile = profileDoc.data();
            constitution = profile.constitutional_identity?.bazi?.day_master?.split(' ')[1] ||
                           profile.constitutional_identity?.chinese?.element?.split(' ')[1] ||
                           'Water';

            voiceSettings = applyConstitutionalModifiers(voiceSettings, constitution);
          }
        }
      }
    }

    // Apply overrides
    if (voiceOverride && LUNA_VOICE_PROFILES[voiceOverride]) {
      voiceProfile = LUNA_VOICE_PROFILES[voiceOverride];
      voiceSettings = { ...voiceProfile.settings };
    }

    if (settingsOverride) {
      voiceSettings = { ...voiceSettings, ...settingsOverride };
    }

    if (modelOverride && ELEVENLABS_MODELS[modelOverride]) {
      model = ELEVENLABS_MODELS[modelOverride];
    }

    // ═══════════════════════════════════════════════════════════════════
    // DYNAMIC TONE MARKERS - Parse and generate multi-segment audio
    // ═══════════════════════════════════════════════════════════════════

    // Parse text for tone markers
    const segments = parseToneMarkers(text, voiceSettings);
    const hasToneMarkers = segments.length > 1 || segments[0]?.tone !== 'neutral';

    if (hasToneMarkers) {
      console.log(`[ElevenLabs] Processing ${segments.length} tone segments`);
    }

    // Generate audio for each segment
    const audioBuffers = [];

    for (const segment of segments) {
      if (!segment.text || segment.text.trim().length === 0) continue;

      const segmentSettings = segment.settings || voiceSettings;

      const response = await fetch(
        `${ELEVENLABS_API_BASE}/text-to-speech/${voiceProfile.elevenLabsVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: segment.text,
            model_id: model,
            voice_settings: segmentSettings
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ElevenLabs] API error:', response.status, errorText);

        // If API fails and fallback allowed, return fallback config
        if (allowFallback) {
          console.log('[ElevenLabs] API failed, using fallback voice');
          const selectedVoice = voiceOverride || 'present';
          return {
            success: true,
            fallback: true,
            provider: FALLBACK_VOICE_CONFIG.provider,
            text: stripToneMarkers(text),
            voiceConfig: FALLBACK_VOICE_CONFIG.provider === 'gemini'
              ? FALLBACK_VOICE_CONFIG.geminiVoices[selectedVoice]
              : FALLBACK_VOICE_CONFIG.browserVoices[selectedVoice],
            message: `ElevenLabs API error (${response.status}), using fallback voice`
          };
        }

        throw new HttpsError('internal', `ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      audioBuffers.push({
        buffer: Buffer.from(audioBuffer),
        tone: segment.tone,
        text: segment.text
      });
    }

    // Concatenate all audio buffers
    const combinedBuffer = Buffer.concat(audioBuffers.map(a => a.buffer));

    // Build response with tone metadata
    const toneMetadata = hasToneMarkers ? {
      hasToneMarkers: true,
      segmentCount: segments.length,
      tones: segments.map(s => ({ tone: s.tone, textLength: s.text.length }))
    } : { hasToneMarkers: false };

    if (returnBase64) {
      const base64Audio = combinedBuffer.toString('base64');

      return {
        success: true,
        audio: base64Audio,
        contentType: 'audio/mpeg',
        voiceUsed: voiceProfile.name,
        constitution,
        settings: voiceSettings,
        cleanText: stripToneMarkers(text),
        ...toneMetadata
      };
    } else {
      return {
        success: true,
        audio: combinedBuffer.toString('base64'),
        contentType: 'audio/mpeg',
        voiceUsed: voiceProfile.name,
        cleanText: stripToneMarkers(text),
        ...toneMetadata
      };
    }

  } catch (error) {
    console.error('[ElevenLabs] generateSpeech error:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Failed to generate speech');
  }
});

/**
 * Get Voice Preview
 * Returns a preview URL for a specific Luna voice
 */
const getVoicePreview = onCall({
  timeoutSeconds: 30,
  memory: '256MiB',
  secrets: [elevenLabsKey],
}, async (request) => {
  const { voiceId, previewText } = request.data;

  if (!voiceId) {
    throw new HttpsError('invalid-argument', 'Voice ID required');
  }

  // Validate voice exists
  if (!LUNA_VOICE_PROFILES[voiceId]) {
    throw new HttpsError('invalid-argument', 'Invalid voice ID');
  }

  try {
    const apiKey = getElevenLabsApiKey();
    const profile = LUNA_VOICE_PROFILES[voiceId];

    // Generate preview if custom text provided
    if (previewText) {
      const response = await fetch(
        `${ELEVENLABS_API_BASE}/text-to-speech/${profile.elevenLabsVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: previewText.slice(0, 500), // Limit preview length
            model_id: ELEVENLABS_MODELS.turbo,
            voice_settings: profile.settings
          })
        }
      );

      if (!response.ok) {
        throw new HttpsError('internal', 'Failed to generate preview');
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return {
        success: true,
        audio: base64Audio,
        contentType: 'audio/mpeg',
        voice: {
          id: voiceId,
          name: profile.name,
          description: profile.description
        }
      };
    }

    // Return info about the voice (client can use ElevenLabs preview URL)
    return {
      success: true,
      voice: {
        id: voiceId,
        name: profile.name,
        description: profile.description,
        loveLanguage: profile.loveLanguage,
        constitutions: profile.constitutions
      },
      elevenLabsVoiceId: profile.elevenLabsVoiceId
    };

  } catch (error) {
    console.error('[ElevenLabs] getVoicePreview error:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Failed to get voice preview');
  }
});

/**
 * Get Voice Streaming URL
 * Returns WebSocket URL for real-time voice streaming
 */
const getVoiceStreamingSession = onCall({
  timeoutSeconds: 30,
  memory: '256MiB',
  secrets: [elevenLabsKey],
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const { profileId } = request.data;
  const userId = request.auth.uid;

  try {
    const apiKey = getElevenLabsApiKey();
    const db = getDb();

    // Get user's voice preferences
    let voiceId = LUNA_VOICE_PROFILES.present.elevenLabsVoiceId;
    let model = 'eleven_turbo_v2_5';

    if (profileId) {
      const prefsDoc = await db.collection('users').doc(userId)
        .collection('voicePreferences').doc(profileId).get();

      if (prefsDoc.exists) {
        const prefs = prefsDoc.data();
        if (prefs.selectedVoice && LUNA_VOICE_PROFILES[prefs.selectedVoice]) {
          voiceId = LUNA_VOICE_PROFILES[prefs.selectedVoice].elevenLabsVoiceId;
        }
        if (prefs.preferredModel && ELEVENLABS_MODELS[prefs.preferredModel]) {
          model = ELEVENLABS_MODELS[prefs.preferredModel];
        }
      }
    }

    // ElevenLabs WebSocket streaming endpoint
    const streamingUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}&xi-api-key=${apiKey}`;

    return {
      success: true,
      streamingUrl,
      voiceId,
      model,
      instructions: {
        protocol: 'WebSocket',
        messageFormat: 'JSON',
        audioFormat: 'mp3_44100_128',
        example: {
          text: 'Hello, this is Luna speaking.',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }
      }
    };

  } catch (error) {
    console.error('[ElevenLabs] getVoiceStreamingSession error:', error);
    throw new HttpsError('internal', 'Failed to get streaming session');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Cloud Functions
  getAvailableVoices,
  saveVoicePreferences,
  generateSpeechElevenLabs,
  getVoicePreview,
  getVoiceStreamingSession,

  // Voice profile exports
  LUNA_VOICE_PROFILES,
  CONSTITUTIONAL_VOICE_MODIFIERS,
  ELEVENLABS_MODELS,
  getBestVoiceProfile,
  applyConstitutionalModifiers,

  // Dynamic Tone Markers exports
  TONE_MARKERS,
  parseToneMarkers,
  applyToneModifiers,
  stripToneMarkers,
  getAvailableTones
};
