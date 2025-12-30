/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ELEVENLABS TTS SERVICE - Emotion-Aware Text-to-Speech for Luna
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Generates Luna's voice with emotion-aware modulation using ElevenLabs API.
 *
 * Features:
 * - Emotion-driven voice settings (stability, style, similarity)
 * - Confidence-scaled modulation (uncertain → more neutral)
 * - Voice selection by ID or name
 * - Streaming and buffered modes
 * - MULTILINGUAL SUPPORT (v2) - Auto-select model and voice by language
 *
 * Requires: ELEVENLABS_API_KEY in .env
 *
 * Created: December 21, 2025
 * Updated: December 28, 2024 - Added multilingual support
 */

import { getTTSProfileForEmotion, validateProfile } from './emotionTtsAdapter.js';
import {
  getVoiceForLanguage,
  getModelForLanguage,
  getLanguageConfig
} from '../services/languageService.js';

/**
 * Configuration
 */
const CONFIG = {
  apiKey: process.env.ELEVENLABS_API_KEY || '',
  baseUrl: 'https://api.elevenlabs.io/v1',

  // Default voice for Luna
  // Rachel (calm, warm female) or change to your preferred voice ID
  voiceId: process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM',

  // Model options:
  // - eleven_multilingual_v2 (recommended, emotional range)
  // - eleven_turbo_v2_5 (faster, good for real-time)
  // - eleven_turbo_v2 (fastest)
  model: process.env.ELEVENLABS_MODEL || 'eleven_turbo_v2_5',

  // Audio format
  outputFormat: 'mp3_44100_128', // or pcm_16000, pcm_22050, etc.

  // Timeout for TTS request
  timeout: 30000
};

/**
 * Popular ElevenLabs voices suitable for Luna
 */
export const LUNA_VOICES = {
  'rachel': { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', style: 'calm, warm' },
  'domi': { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', style: 'strong, confident' },
  'bella': { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', style: 'soft, gentle' },
  'elli': { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', style: 'young, energetic' },
  'josh': { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', style: 'deep, calm' },
  'arnold': { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', style: 'crisp, clear' },
  'charlotte': { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', style: 'seductive, calm' },
  'matilda': { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', style: 'warm, friendly' }
};

/**
 * Check if ElevenLabs is configured
 */
export function isElevenLabsAvailable() {
  return !!CONFIG.apiKey;
}

/**
 * Generate speech with ElevenLabs (emotion-aware + multilingual)
 *
 * @param {string} text - Text to speak
 * @param {Object} emotion - Detected emotion { primary, secondary, confidence }
 * @param {Object} options - Additional options
 * @param {string} options.language - Language code (e.g., 'en', 'zh', 'es')
 * @param {string} options.voiceId - Override voice ID
 * @param {string} options.model - Override model ID
 * @returns {Promise<Object>} - { audio: Buffer, profile, duration, language }
 */
export async function speakWithElevenLabs(text, emotion = {}, options = {}) {
  if (!CONFIG.apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  if (!text || text.trim() === '') {
    throw new Error('No text provided for TTS');
  }

  const startTime = Date.now();

  // Get emotion-aware voice profile
  const rawProfile = getTTSProfileForEmotion(emotion);
  const profile = validateProfile(rawProfile);

  // v2: Language-aware model and voice selection
  const language = options.language || 'en';
  const languageConfig = getLanguageConfig(language);

  // Select voice: explicit override > language default > config default
  const voiceId = options.voiceId ||
    (language !== 'en' ? getVoiceForLanguage(language) : CONFIG.voiceId);

  // Select model: explicit override > language default > config default
  // Use turbo for English (faster), multilingual for other languages
  const model = options.model ||
    (language !== 'en' ? getModelForLanguage(language) : CONFIG.model);

  console.log(`[ElevenLabs] Generating speech [${language}/${model}]: "${text.substring(0, 50)}..." [${profile.emotion}, ${(profile.confidence * 100).toFixed(0)}%]`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

    const response = await fetch(`${CONFIG.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': CONFIG.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: profile.stability,
          similarity_boost: profile.similarityBoost,
          style: profile.style,
          use_speaker_boost: true
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail?.message || `ElevenLabs API error: ${response.status}`);
    }

    // Get audio buffer
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const duration = Date.now() - startTime;

    console.log(`[ElevenLabs] Generated ${audioBuffer.length} bytes in ${duration}ms [${language}]`);

    return {
      audio: audioBuffer,
      profile,
      duration,
      model,
      voiceId,
      textLength: text.length,
      language,
      languageName: languageConfig.name
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('ElevenLabs TTS request timed out');
    }
    console.error('[ElevenLabs] TTS error:', error.message);
    throw error;
  }
}

/**
 * Generate speech as base64 (for JSON transport)
 */
export async function speakWithElevenLabsBase64(text, emotion = {}, options = {}) {
  const result = await speakWithElevenLabs(text, emotion, options);
  return {
    ...result,
    audioBase64: result.audio.toString('base64'),
    audio: undefined // Don't include raw buffer
  };
}

/**
 * List available voices from your ElevenLabs account
 */
export async function listVoices() {
  if (!CONFIG.apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  const response = await fetch(`${CONFIG.baseUrl}/voices`, {
    method: 'GET',
    headers: {
      'xi-api-key': CONFIG.apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.status}`);
  }

  const data = await response.json();
  return data.voices || [];
}

/**
 * Get voice info by ID
 */
export async function getVoiceInfo(voiceId) {
  if (!CONFIG.apiKey) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  const response = await fetch(`${CONFIG.baseUrl}/voices/${voiceId}`, {
    method: 'GET',
    headers: {
      'xi-api-key': CONFIG.apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voice info: ${response.status}`);
  }

  return response.json();
}

/**
 * Test ElevenLabs connection
 */
export async function testElevenLabs() {
  if (!CONFIG.apiKey) {
    return { success: false, error: 'ELEVENLABS_API_KEY not configured' };
  }

  try {
    const voices = await listVoices();
    return {
      success: true,
      voiceCount: voices.length,
      defaultVoice: CONFIG.voiceId
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current configuration
 */
export function getElevenLabsConfig() {
  return {
    configured: !!CONFIG.apiKey,
    voiceId: CONFIG.voiceId,
    model: CONFIG.model,
    outputFormat: CONFIG.outputFormat
  };
}

export default {
  speakWithElevenLabs,
  speakWithElevenLabsBase64,
  isElevenLabsAvailable,
  listVoices,
  getVoiceInfo,
  testElevenLabs,
  getElevenLabsConfig,
  LUNA_VOICES,
  CONFIG
};
