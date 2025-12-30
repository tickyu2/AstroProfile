/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GROQ WHISPER STT - Ultra-Fast Cloud Speech-to-Text
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Uses Groq's Whisper Large v3 API for fast, accurate transcription.
 * Same API key as LLM - no additional setup needed!
 *
 * Models available:
 * - whisper-large-v3 (most accurate)
 * - whisper-large-v3-turbo (faster, still excellent)
 *
 * LANGUAGE AUTO-DETECTION (v2):
 * - Whisper automatically detects language when not specified
 * - Returns detected language in response
 * - Priority: EN → ZH → ES (per user preferences)
 *
 * Created: December 21, 2025
 * Updated: December 28, 2024 - Added language auto-detection
 */

import fs from 'fs';
import path from 'path';

/**
 * Supported languages with priority order
 * Whisper supports 50+ languages, we prioritize these
 */
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', priority: 1, whisperCode: 'en' },
  zh: { name: 'Chinese', priority: 2, whisperCode: 'zh' },
  es: { name: 'Spanish', priority: 3, whisperCode: 'es' },
  fr: { name: 'French', priority: 4, whisperCode: 'fr' },
  de: { name: 'German', priority: 5, whisperCode: 'de' },
  ja: { name: 'Japanese', priority: 6, whisperCode: 'ja' },
  ko: { name: 'Korean', priority: 7, whisperCode: 'ko' },
  pt: { name: 'Portuguese', priority: 8, whisperCode: 'pt' },
  hi: { name: 'Hindi', priority: 9, whisperCode: 'hi' },
  ar: { name: 'Arabic', priority: 10, whisperCode: 'ar' }
};

/**
 * Configuration
 */
const CONFIG = {
  apiKey: process.env.GROQ_API_KEY || '',
  baseUrl: 'https://api.groq.com/openai/v1',
  model: process.env.GROQ_WHISPER_MODEL || 'whisper-large-v3-turbo', // Fast + accurate
  language: null,        // null = auto-detect language (v2)
  timeout: 30000         // 30s timeout for longer audio
};

/**
 * Available Whisper models on Groq
 */
export const WHISPER_MODELS = {
  'whisper-large-v3': { name: 'Whisper Large v3', speed: 'fast', quality: 'best' },
  'whisper-large-v3-turbo': { name: 'Whisper Large v3 Turbo', speed: 'fastest', quality: 'excellent' }
};

/**
 * Check if Groq Whisper is available
 */
export function isGroqWhisperAvailable() {
  return !!CONFIG.apiKey;
}

/**
 * Transcribe audio using Groq's Whisper API
 *
 * @param {string} audioPath - Path to audio file (wav, mp3, webm, etc.)
 * @param {Object} options - Transcription options
 * @returns {Promise<Object>} - { text, duration, model, language }
 */
export async function transcribeWithGroqWhisper(audioPath, options = {}) {
  if (!CONFIG.apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const startTime = Date.now();
  const model = options.model || CONFIG.model;

  console.log(`[GroqWhisper] Transcribing with ${model}...`);

  try {
    // Read audio file
    const audioBuffer = fs.readFileSync(audioPath);
    const filename = path.basename(audioPath);

    // Create form data manually for Node.js
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

    // Build multipart form data
    const formParts = [];

    // Add file part
    formParts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      `Content-Type: audio/webm\r\n\r\n`
    );
    formParts.push(audioBuffer);
    formParts.push('\r\n');

    // Add model part
    formParts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="model"\r\n\r\n` +
      `${model}\r\n`
    );

    // Add language part (optional - omit for auto-detection)
    // v2: Only set language if explicitly provided, otherwise Whisper auto-detects
    const requestedLanguage = options.language ?? CONFIG.language;
    if (requestedLanguage) {
      formParts.push(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="language"\r\n\r\n` +
        `${requestedLanguage}\r\n`
      );
    }
    // When language is null/undefined, Whisper will auto-detect

    // Add response format
    formParts.push(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="response_format"\r\n\r\n` +
      `json\r\n`
    );

    // Close boundary
    formParts.push(`--${boundary}--\r\n`);

    // Combine parts into body
    const bodyParts = [];
    for (const part of formParts) {
      if (typeof part === 'string') {
        bodyParts.push(Buffer.from(part));
      } else {
        bodyParts.push(part);
      }
    }
    const body = Buffer.concat(bodyParts);

    // Make request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || CONFIG.timeout);

    const response = await fetch(`${CONFIG.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    // Get detected language (Whisper returns ISO code)
    const detectedLanguage = data.language || requestedLanguage || 'en';
    const languageInfo = SUPPORTED_LANGUAGES[detectedLanguage] || { name: detectedLanguage };
    const isAutoDetected = !requestedLanguage;

    console.log(`[GroqWhisper] Transcribed in ${duration}ms [${detectedLanguage}${isAutoDetected ? ' auto' : ''}]: "${data.text?.substring(0, 50)}..."`);

    return {
      text: data.text || '',
      duration,
      model,
      language: detectedLanguage,
      languageName: languageInfo.name,
      isAutoDetected,
      provider: 'groq-whisper'
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Groq Whisper request timed out');
    }
    console.error('[GroqWhisper] Transcription failed:', error.message);
    throw error;
  }
}

/**
 * Test Groq Whisper connection
 */
export async function testGroqWhisper() {
  if (!CONFIG.apiKey) {
    return { success: false, error: 'GROQ_API_KEY not configured' };
  }

  try {
    // Just verify API key works by checking models endpoint
    const response = await fetch(`${CONFIG.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const whisperModels = data.data?.filter(m => m.id.includes('whisper')) || [];
      return {
        success: true,
        models: whisperModels.map(m => m.id)
      };
    } else {
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  transcribeWithGroqWhisper,
  isGroqWhisperAvailable,
  testGroqWhisper,
  WHISPER_MODELS,
  CONFIG
};
