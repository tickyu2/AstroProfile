/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LANGUAGE SERVICE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Centralized language management for GENESIS voice pipeline.
 * Coordinates language detection, TTS voice selection, and LLM prompts.
 *
 * PRIORITY ORDER (per user preferences):
 * 1. English (en) - Default
 * 2. Chinese (zh) - Mandarin
 * 3. Spanish (es) - Large user base
 * 4-10. French, German, Japanese, Korean, Portuguese, Hindi, Arabic
 *
 * Part of: GENESIS Conversational AI v2
 * Created: December 28, 2024
 */

/**
 * Supported languages with full configuration
 */
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    priority: 1,
    elevenLabsVoice: 'rachel',           // Default English voice
    elevenLabsModel: 'eleven_turbo_v2_5', // Fast English model
    greeting: 'Hello',
    lunaGreeting: "Hello, I'm Luna. How can I help you today?",
    isRTL: false
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    priority: 2,
    elevenLabsVoice: 'Xb7hH8MSUJpSbSDYk0k2', // Multilingual voice ID
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: '你好',
    lunaGreeting: '你好，我是Luna。今天我能帮你什么？',
    isRTL: false
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    priority: 3,
    elevenLabsVoice: 'pFZP5JQG7iQjIQuC4Bku', // Isabella or multilingual
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'Hola',
    lunaGreeting: 'Hola, soy Luna. ¿Cómo puedo ayudarte hoy?',
    isRTL: false
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    priority: 4,
    elevenLabsVoice: 'XB0fDUnXU5powFXDhCwa', // Charlotte or multilingual
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'Bonjour',
    lunaGreeting: 'Bonjour, je suis Luna. Comment puis-je vous aider?',
    isRTL: false
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    priority: 5,
    elevenLabsVoice: 'LcfcDJNUP1GQjkzn1xUU', // Vicki or multilingual
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'Hallo',
    lunaGreeting: 'Hallo, ich bin Luna. Wie kann ich Ihnen helfen?',
    isRTL: false
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    priority: 6,
    elevenLabsVoice: 'Xb7hH8MSUJpSbSDYk0k2', // Multilingual voice
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'こんにちは',
    lunaGreeting: 'こんにちは、ルナです。今日は何をお手伝いしましょうか？',
    isRTL: false
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    priority: 7,
    elevenLabsVoice: 'Xb7hH8MSUJpSbSDYk0k2', // Multilingual voice
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: '안녕하세요',
    lunaGreeting: '안녕하세요, 루나입니다. 오늘 무엇을 도와드릴까요?',
    isRTL: false
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    priority: 8,
    elevenLabsVoice: 'Xb7hH8MSUJpSbSDYk0k2', // Multilingual voice
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'Olá',
    lunaGreeting: 'Olá, sou Luna. Como posso ajudá-lo hoje?',
    isRTL: false
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    priority: 9,
    elevenLabsVoice: 'Xb7hH8MSUJpSbSDYk0k2', // Multilingual voice
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'नमस्ते',
    lunaGreeting: 'नमस्ते, मैं लूना हूं। आज मैं आपकी कैसे मदद कर सकती हूं?',
    isRTL: false
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    priority: 10,
    elevenLabsVoice: 'Xb7hH8MSUJpSbSDYk0k2', // Multilingual voice
    elevenLabsModel: 'eleven_multilingual_v2',
    greeting: 'مرحبا',
    lunaGreeting: 'مرحبا، أنا لونا. كيف يمكنني مساعدتك اليوم؟',
    isRTL: true
  }
};

/**
 * Get language configuration
 * @param {string} code - ISO language code (e.g., 'en', 'zh')
 * @returns {Object} Language configuration
 */
export function getLanguageConfig(code) {
  const normalizedCode = normalizeLanguageCode(code);
  return SUPPORTED_LANGUAGES[normalizedCode] || SUPPORTED_LANGUAGES.en;
}

/**
 * Normalize language code to our supported format
 * Handles variants like 'zh-CN', 'en-US', etc.
 * @param {string} code - Language code
 * @returns {string} Normalized code
 */
export function normalizeLanguageCode(code) {
  if (!code) return 'en';

  // Handle variants like 'zh-CN', 'en-US'
  const baseCode = code.toLowerCase().split('-')[0].split('_')[0];

  // Map common variants
  const codeMap = {
    'cmn': 'zh',  // Mandarin
    'yue': 'zh',  // Cantonese -> treat as Chinese
    'zho': 'zh',
    'spa': 'es',
    'fra': 'fr',
    'deu': 'de',
    'jpn': 'ja',
    'kor': 'ko',
    'por': 'pt',
    'hin': 'hi',
    'ara': 'ar',
    'eng': 'en'
  };

  return codeMap[baseCode] || baseCode;
}

/**
 * Check if a language is supported
 * @param {string} code - Language code
 * @returns {boolean}
 */
export function isLanguageSupported(code) {
  const normalizedCode = normalizeLanguageCode(code);
  return normalizedCode in SUPPORTED_LANGUAGES;
}

/**
 * Get ElevenLabs voice ID for a language
 * @param {string} languageCode - ISO language code
 * @returns {string} ElevenLabs voice ID
 */
export function getVoiceForLanguage(languageCode) {
  const config = getLanguageConfig(languageCode);
  return config.elevenLabsVoice;
}

/**
 * Get ElevenLabs model for a language
 * @param {string} languageCode - ISO language code
 * @returns {string} ElevenLabs model ID
 */
export function getModelForLanguage(languageCode) {
  const config = getLanguageConfig(languageCode);
  return config.elevenLabsModel;
}

/**
 * Build language instruction for LLM prompt
 * Tells the AI to respond in the detected language
 * @param {string} languageCode - ISO language code
 * @returns {string} Language instruction for prompt
 */
export function buildLanguageInstruction(languageCode) {
  if (!languageCode || languageCode === 'en') {
    return ''; // No instruction needed for English
  }

  const config = getLanguageConfig(languageCode);

  return `
[LANGUAGE INSTRUCTION]
The user is speaking in ${config.name} (${config.nativeName}).
Respond naturally in ${config.name}.
Maintain Luna's warm, empathetic personality while using culturally appropriate expressions.
Do not translate or explain your language choice.
`;
}

/**
 * Build greeting for a language
 * @param {string} languageCode - ISO language code
 * @returns {string} Luna's greeting in that language
 */
export function getLunaGreeting(languageCode) {
  const config = getLanguageConfig(languageCode);
  return config.lunaGreeting;
}

/**
 * Get all supported languages sorted by priority
 * @returns {Array} Array of language configs
 */
export function getSupportedLanguages() {
  return Object.values(SUPPORTED_LANGUAGES).sort((a, b) => a.priority - b.priority);
}

/**
 * Detect if text is likely a specific language
 * Simple heuristic based on character ranges
 * @param {string} text - Text to analyze
 * @returns {string|null} Detected language code or null
 */
export function detectLanguageFromText(text) {
  if (!text) return null;

  // Chinese characters
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';

  // Japanese (Hiragana, Katakana)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';

  // Korean (Hangul)
  if (/[\uac00-\ud7af]/.test(text)) return 'ko';

  // Arabic
  if (/[\u0600-\u06ff]/.test(text)) return 'ar';

  // Hindi/Devanagari
  if (/[\u0900-\u097f]/.test(text)) return 'hi';

  // For Latin-based scripts, we rely on Whisper's detection
  return null;
}

/**
 * Language service singleton with session tracking
 */
class LanguageService {
  constructor() {
    this.sessionLanguages = new Map(); // Track detected languages per session
  }

  /**
   * Record detected language for a session
   * @param {string} sessionId
   * @param {string} languageCode
   */
  recordLanguage(sessionId, languageCode) {
    if (!this.sessionLanguages.has(sessionId)) {
      this.sessionLanguages.set(sessionId, []);
    }
    this.sessionLanguages.get(sessionId).push(languageCode);
  }

  /**
   * Get most common language for a session
   * Useful for maintaining consistency
   * @param {string} sessionId
   * @returns {string} Most common language code
   */
  getSessionLanguage(sessionId) {
    const languages = this.sessionLanguages.get(sessionId);
    if (!languages || languages.length === 0) return 'en';

    // Count occurrences
    const counts = {};
    for (const lang of languages) {
      counts[lang] = (counts[lang] || 0) + 1;
    }

    // Return most common
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  /**
   * Clear session language data
   * @param {string} sessionId
   */
  clearSession(sessionId) {
    this.sessionLanguages.delete(sessionId);
  }
}

// Export singleton instance
export const languageService = new LanguageService();

export default {
  SUPPORTED_LANGUAGES,
  getLanguageConfig,
  normalizeLanguageCode,
  isLanguageSupported,
  getVoiceForLanguage,
  getModelForLanguage,
  buildLanguageInstruction,
  getLunaGreeting,
  getSupportedLanguages,
  detectLanguageFromText,
  languageService
};
