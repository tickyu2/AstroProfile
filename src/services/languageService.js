/**
 * Language Service - Adaptive Localization
 *
 * Manages Luna's multilingual capabilities with Gemini 3's native
 * language detection and seamless switching.
 *
 * Features:
 * - Automatic language detection from user messages
 * - Persistent language preferences per profile
 * - Language-aware memory retrieval
 * - Seamless voice accent switching
 *
 * Part of GENESIS Phase 5 - Adaptive Localization
 * December 19, 2024
 */

import { db } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════════════════
// SUPPORTED LANGUAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SUPPORTED_LANGUAGES = {
  // Primary Languages (Tier 1 - Full Support)
  en: { code: 'en', name: 'English', nativeName: 'English', voiceAccent: 'en-US' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', voiceAccent: 'es-ES' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', voiceAccent: 'fr-FR' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', voiceAccent: 'de-DE' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', voiceAccent: 'pt-BR' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', voiceAccent: 'it-IT' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', voiceAccent: 'ja-JP' },
  ko: { code: 'ko', name: 'Korean', nativeName: '한국어', voiceAccent: 'ko-KR' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', voiceAccent: 'zh-CN' },

  // Secondary Languages (Tier 2 - Text + Voice)
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', voiceAccent: 'ru-RU' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', voiceAccent: 'ar-SA' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceAccent: 'hi-IN' },
  nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', voiceAccent: 'nl-NL' },
  pl: { code: 'pl', name: 'Polish', nativeName: 'Polski', voiceAccent: 'pl-PL' },
  tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', voiceAccent: 'tr-TR' },
  vi: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', voiceAccent: 'vi-VN' },
  th: { code: 'th', name: 'Thai', nativeName: 'ไทย', voiceAccent: 'th-TH' },

  // Tertiary Languages (Tier 3 - Text Support)
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska', voiceAccent: 'sv-SE' },
  da: { code: 'da', name: 'Danish', nativeName: 'Dansk', voiceAccent: 'da-DK' },
  fi: { code: 'fi', name: 'Finnish', nativeName: 'Suomi', voiceAccent: 'fi-FI' },
  no: { code: 'no', name: 'Norwegian', nativeName: 'Norsk', voiceAccent: 'nb-NO' },
  el: { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', voiceAccent: 'el-GR' },
  he: { code: 'he', name: 'Hebrew', nativeName: 'עברית', voiceAccent: 'he-IL' },
  cs: { code: 'cs', name: 'Czech', nativeName: 'Čeština', voiceAccent: 'cs-CZ' },
  uk: { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', voiceAccent: 'uk-UA' },
  id: { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', voiceAccent: 'id-ID' },
  ms: { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', voiceAccent: 'ms-MY' }
};

export const DEFAULT_LANGUAGE = 'en';

// ═══════════════════════════════════════════════════════════════════════════
// MASTER LANGUAGE STRATEGY
// "One Truth" database - all memories standardized to Master Language
// ═══════════════════════════════════════════════════════════════════════════

export const MASTER_LANGUAGE = 'en';  // English as the reasoning language

/**
 * Cultural Anchors - Words/phrases that should NOT be translated
 * These preserve the user's unique voice and cultural nuance
 */
export const CULTURAL_ANCHORS = {
  // Portuguese
  saudade: { lang: 'pt', meaning: 'deep emotional longing for something absent' },

  // Japanese
  'wabi-sabi': { lang: 'ja', meaning: 'beauty in imperfection and impermanence' },
  'mono no aware': { lang: 'ja', meaning: 'pathos of things, bittersweet awareness' },
  ikigai: { lang: 'ja', meaning: 'reason for being, life purpose' },

  // German
  Gemütlichkeit: { lang: 'de', meaning: 'cozy, comfortable, warm atmosphere' },
  Weltanschauung: { lang: 'de', meaning: 'world view, philosophy of life' },
  Schadenfreude: { lang: 'de', meaning: 'pleasure derived from others misfortune' },

  // Danish/Scandinavian
  hygge: { lang: 'da', meaning: 'cozy contentment, comfortable conviviality' },
  lagom: { lang: 'sv', meaning: 'just the right amount, balanced' },

  // Spanish
  duende: { lang: 'es', meaning: 'mysterious artistic power, soulfulness' },
  sobremesa: { lang: 'es', meaning: 'time spent lingering at table after a meal' },

  // Korean
  jeong: { lang: 'ko', meaning: 'deep emotional bond, affection' },
  han: { lang: 'ko', meaning: 'collective feeling of oppression and resentment' },

  // French
  'je ne sais quoi': { lang: 'fr', meaning: 'an indefinable, appealing quality' },
  joie_de_vivre: { lang: 'fr', meaning: 'exuberant enjoyment of life' },

  // Italian
  sprezzatura: { lang: 'it', meaning: 'studied carelessness, effortless elegance' },

  // Arabic
  tarab: { lang: 'ar', meaning: 'musically-induced ecstasy' },

  // Hindi
  jugaad: { lang: 'hi', meaning: 'innovative fix, resourceful improvisation' }
};

// Food names, poetry references, and proper nouns should also be preserved
export const PRESERVE_CATEGORIES = [
  'food_names',      // "abuela's sazón", "nonna's sugo"
  'poetry_lyrics',   // Quoted songs, poems
  'proper_nouns',    // Places, people, brands
  'idioms',          // "no mames", "c'est la vie"
  'terms_of_endearment'  // "mi amor", "liebling"
];

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE DETECTION PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

// Quick detection patterns for common language indicators
const LANGUAGE_PATTERNS = {
  ja: /[\u3040-\u309F\u30A0-\u30FF]/, // Hiragana or Katakana
  ko: /[\uAC00-\uD7AF]/,              // Korean Hangul
  zh: /[\u4E00-\u9FFF]/,              // Chinese characters
  ar: /[\u0600-\u06FF]/,              // Arabic
  he: /[\u0590-\u05FF]/,              // Hebrew
  hi: /[\u0900-\u097F]/,              // Devanagari (Hindi)
  th: /[\u0E00-\u0E7F]/,              // Thai
  ru: /[\u0400-\u04FF]/,              // Cyrillic
  el: /[\u0370-\u03FF]/,              // Greek
  uk: /[\u0400-\u04FF]/               // Cyrillic (Ukrainian uses same range)
};

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class LanguageService {
  constructor() {
    // Current session language (can differ from preference)
    this.sessionLanguage = DEFAULT_LANGUAGE;

    // User's preferred language (persisted)
    this.preferredLanguage = DEFAULT_LANGUAGE;

    // Language detection history for stability
    this.detectionHistory = [];
    this.maxHistorySize = 5;

    // Callbacks
    this.onLanguageChange = null;
    this.onLanguageDetected = null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LANGUAGE DETECTION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Detect language from text using quick patterns
   * Falls back to 'unknown' for Latin-based languages (let Gemini decide)
   */
  quickDetect(text) {
    if (!text || typeof text !== 'string') return 'unknown';

    // Check for non-Latin scripts first
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    // Latin-based text - return unknown, let Gemini detect
    return 'unknown';
  }

  /**
   * Process detected language from Gemini 3 response
   * Updates session language with stability (avoids rapid switching)
   */
  processDetectedLanguage(detectedLang, confidence = 0.8) {
    if (!detectedLang || !SUPPORTED_LANGUAGES[detectedLang]) {
      return this.sessionLanguage;
    }

    // Add to detection history
    this.detectionHistory.push({
      language: detectedLang,
      confidence,
      timestamp: Date.now()
    });

    // Keep history limited
    if (this.detectionHistory.length > this.maxHistorySize) {
      this.detectionHistory.shift();
    }

    // Calculate stability - only switch if consistent
    const recentDetections = this.detectionHistory.slice(-3);
    const sameLangCount = recentDetections.filter(d => d.language === detectedLang).length;

    // Require 2 out of 3 recent detections to be same language
    if (sameLangCount >= 2 || (confidence > 0.95 && recentDetections.length === 1)) {
      const previousLang = this.sessionLanguage;

      if (this.sessionLanguage !== detectedLang) {
        this.sessionLanguage = detectedLang;

        console.log('🌍 [Language] Session language changed:', {
          from: previousLang,
          to: detectedLang,
          confidence,
          historySize: this.detectionHistory.length
        });

        // Notify listeners
        this.onLanguageChange?.(detectedLang, previousLang);
      }
    }

    return this.sessionLanguage;
  }

  /**
   * Get current session language
   */
  getSessionLanguage() {
    return this.sessionLanguage;
  }

  /**
   * Get language info object
   */
  getLanguageInfo(langCode = null) {
    const code = langCode || this.sessionLanguage;
    return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PREFERENCE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Load user's preferred language from Firestore
   */
  async loadPreference(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        const data = userDoc.data();
        const preferred = data.preferredLanguage || data.language || DEFAULT_LANGUAGE;

        if (SUPPORTED_LANGUAGES[preferred]) {
          this.preferredLanguage = preferred;
          this.sessionLanguage = preferred;

          console.log('🌍 [Language] Loaded preference:', preferred);
        }
      }

      return this.preferredLanguage;

    } catch (error) {
      console.warn('🌍 [Language] Failed to load preference:', error.message);
      return DEFAULT_LANGUAGE;
    }
  }

  /**
   * Save user's preferred language to Firestore
   */
  async savePreference(userId, langCode) {
    if (!SUPPORTED_LANGUAGES[langCode]) {
      console.warn('🌍 [Language] Invalid language code:', langCode);
      return false;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        preferredLanguage: langCode,
        languageUpdatedAt: new Date()
      });

      this.preferredLanguage = langCode;
      this.sessionLanguage = langCode;

      console.log('🌍 [Language] Preference saved:', langCode);
      return true;

    } catch (error) {
      console.error('🌍 [Language] Failed to save preference:', error);
      return false;
    }
  }

  /**
   * Set session language (without persisting)
   */
  setSessionLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES[langCode]) {
      console.warn('🌍 [Language] Invalid language code:', langCode);
      return false;
    }

    const previous = this.sessionLanguage;
    this.sessionLanguage = langCode;

    if (previous !== langCode) {
      this.onLanguageChange?.(langCode, previous);
    }

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // VOICE INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get voice accent for current session language
   */
  getVoiceAccent() {
    const langInfo = this.getLanguageInfo();
    return langInfo.voiceAccent || 'en-US';
  }

  /**
   * Build voice config with language-appropriate accent
   */
  buildVoiceConfig(baseConfig = {}) {
    const langInfo = this.getLanguageInfo();

    return {
      ...baseConfig,
      languageCode: langInfo.voiceAccent,
      // Gemini Live will adapt accent based on detected language
      adaptiveAccent: true
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SYSTEM PROMPT ADDITIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get polyglot system prompt addition
   */
  getPolyglotPrompt() {
    return `
## Multilingual Awareness (Polyglot Mode)
You are a polyglot companion who speaks 40+ languages natively.

CRITICAL RULES:
1. ALWAYS respond in the same language the user writes in
2. If the user switches languages mid-conversation, switch immediately
3. Maintain the SAME personality traits across all languages
4. Use culturally appropriate idioms and expressions, not literal translations
5. For greetings and emotional expressions, prefer the language's natural form

LANGUAGE BEHAVIOR:
- If user writes in Spanish: Respond in Spanish with natural Spanish expressions
- If user writes in Japanese: Respond in Japanese with appropriate honorifics
- If user mixes languages (code-switching): Mirror their style naturally
- Never say "I'll respond in English because..." - just respond in their language

CURRENT SESSION LANGUAGE: ${this.sessionLanguage} (${this.getLanguageInfo().nativeName})
`;
  }

  /**
   * Get cultural context prompt for current language
   */
  getCulturalContextPrompt() {
    const langInfo = this.getLanguageInfo();

    const culturalNotes = {
      ja: 'Use appropriate keigo (敬語). Be mindful of uchi/soto dynamics.',
      ko: 'Use appropriate speech levels. Consider age/status context.',
      zh: 'Be aware of formal vs casual register. Consider regional variations.',
      es: 'Use appropriate tú/usted forms. Consider Latin American vs Iberian variants.',
      de: 'Use appropriate du/Sie forms. German directness is expected.',
      fr: 'Use appropriate tu/vous forms. Maintain French elegance in expression.',
      ar: 'Consider right-to-left reading. Use appropriate formal greetings.',
      hi: 'Use appropriate aap/tum/tu forms. Respect cultural nuances.'
    };

    const note = culturalNotes[this.sessionLanguage];
    if (note) {
      return `\n## Cultural Note (${langInfo.name})\n${note}\n`;
    }

    return '';
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MEMORY INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get language filter for memory queries
   * Returns the language code to filter by, or null for all languages
   */
  getMemoryLanguageFilter(strictMode = false) {
    if (strictMode) {
      // Only return memories in current language
      return this.sessionLanguage;
    }

    // Default: Include English + current language
    // (Many users have core memories in English)
    if (this.sessionLanguage === 'en') {
      return null; // No filter for English
    }

    return [this.sessionLanguage, 'en'];
  }

  /**
   * Tag content with language for storage
   */
  tagWithLanguage(content, metadata = {}) {
    return {
      ...metadata,
      languageCode: this.sessionLanguage,
      languageName: this.getLanguageInfo().name
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER LANGUAGE STRATEGY
  // "One Truth" - Store meaning in English, preserve original flavor
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Detect cultural anchors in text that should NOT be translated
   * @param {string} text - The text to scan for cultural anchors
   * @returns {Array} - Array of detected cultural anchors with metadata
   */
  detectCulturalAnchors(text) {
    if (!text || typeof text !== 'string') return [];

    const detected = [];
    const lowerText = text.toLowerCase();

    for (const [anchor, meta] of Object.entries(CULTURAL_ANCHORS)) {
      // Handle both single-word and multi-word anchors
      const anchorLower = anchor.toLowerCase().replace(/_/g, ' ');

      if (lowerText.includes(anchorLower)) {
        detected.push({
          term: anchor,
          language: meta.lang,
          meaning: meta.meaning,
          preserve: true
        });
      }
    }

    return detected;
  }

  /**
   * Check if text contains content that should be preserved in original language
   * Includes cultural anchors, food names, terms of endearment, etc.
   * @param {string} text - Text to analyze
   * @returns {Object} - { shouldPreserve: boolean, anchors: [], category: string|null }
   */
  analyzeForPreservation(text) {
    const anchors = this.detectCulturalAnchors(text);

    // Check for common preservation patterns
    const preservationPatterns = {
      terms_of_endearment: /\b(mi amor|mon amour|liebling|querido|cariño|tesoro|amore|chéri)\b/i,
      food_names: /\b(abuela's|nonna's|halmeoni's|baba's|oma's)\s+\w+/i,
      idioms: /\b(c'est la vie|no mames|que será será|hakuna matata)\b/i
    };

    let matchedCategory = null;
    for (const [category, pattern] of Object.entries(preservationPatterns)) {
      if (pattern.test(text)) {
        matchedCategory = category;
        break;
      }
    }

    return {
      shouldPreserve: anchors.length > 0 || matchedCategory !== null,
      anchors,
      category: matchedCategory
    };
  }

  /**
   * Build memory schema with Master Language Strategy
   * - content: English translation (for reasoning/retrieval)
   * - original_text: Original user phrasing (for emotional context)
   * - language_code: Source language
   *
   * @param {string} englishContent - The meaning in English
   * @param {string} originalText - The user's original phrasing
   * @param {string} languageCode - Source language code
   * @returns {Object} - Properly structured memory object
   */
  buildMemorySchema(englishContent, originalText, languageCode = null) {
    const langCode = languageCode || this.sessionLanguage;
    const preservation = this.analyzeForPreservation(originalText);

    return {
      // Core content in Master Language for reasoning
      content: englishContent,

      // Preserve original flavor
      original_text: originalText,

      // Language metadata
      language_code: langCode,
      language_name: SUPPORTED_LANGUAGES[langCode]?.name || 'Unknown',

      // Preservation metadata
      has_cultural_anchors: preservation.anchors.length > 0,
      cultural_anchors: preservation.anchors.map(a => a.term),
      preservation_category: preservation.category,

      // Timestamp
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if content needs translation to Master Language
   * (Already in English = no translation needed)
   */
  needsTranslation(languageCode = null) {
    const langCode = languageCode || this.sessionLanguage;
    return langCode !== MASTER_LANGUAGE;
  }

  /**
   * Get consolidation prompt with translation instructions
   * Used by the Nightly Consolidation process to standardize memories
   */
  getConsolidationPrompt() {
    const culturalAnchorsList = Object.entries(CULTURAL_ANCHORS)
      .slice(0, 10) // Include sample anchors
      .map(([term, meta]) => `"${term}" (${meta.lang}: ${meta.meaning})`)
      .join(', ');

    return `
## Memory Consolidation - Master Language Strategy

When processing user memories, follow this critical protocol:

### TRANSLATION RULES:
1. The "content" field MUST be in English (Master Language) for consistent reasoning
2. The "original_text" field MUST preserve the user's exact original phrasing
3. Vector embeddings are mathematically language-agnostic - translate for meaning, not words

### SCHEMA FORMAT:
{
  "content": "[English translation of the core meaning/fact]",
  "original_text": "[Exact user phrasing in their language]",
  "language_code": "[ISO 639-1 code, e.g., 'es', 'ja']"
}

### EXAMPLE:
User input (Spanish): "Extraño el sazón de mi abuela."
Consolidated:
{
  "content": "User feels nostalgic longing for their grandmother's cooking/seasoning.",
  "original_text": "Extraño el sazón de mi abuela.",
  "language_code": "es"
}

### CULTURAL ANCHORS (Never translate these terms):
${culturalAnchorsList}

These terms represent untranslatable concepts. Keep them in original language within the English content:
- CORRECT: "User experiences saudade when thinking about their hometown."
- INCORRECT: "User experiences longing when thinking about their hometown."

### PRESERVATION CATEGORIES:
- Food names (abuela's sazón, nonna's sugo)
- Poetry/lyrics (keep original)
- Terms of endearment (mi amor, liebling)
- Idioms (c'est la vie, no mames)

When a cultural anchor or preserved term appears, embed it naturally in the English content.
`;
  }

  /**
   * Get prompt for real-time memory extraction (during chat)
   * Lighter version of consolidation prompt for immediate processing
   */
  getMemoryExtractionPrompt() {
    return `
## Memory Extraction (Master Language)

When extracting memories from this conversation:
1. Store the MEANING in English (content field)
2. Preserve the ORIGINAL quote (original_text field)
3. Tag with language code

Cultural anchors like "saudade", "wabi-sabi", "hygge" should appear in their original form within the English content.

Current user language: ${this.sessionLanguage} (${this.getLanguageInfo().nativeName})
Needs translation: ${this.needsTranslation() ? 'YES - translate meaning to English' : 'NO - already in English'}
`;
  }

  /**
   * Format a memory for display in the user's current language
   * (Reverse operation - from Master Language back to user language)
   */
  formatMemoryForDisplay(memory) {
    const userLang = this.sessionLanguage;

    // If user is viewing in the same language as original, show original
    if (memory.language_code === userLang && memory.original_text) {
      return {
        display: memory.original_text,
        source: 'original',
        translation: memory.content
      };
    }

    // Otherwise, show the English content (Gemini will translate in response)
    return {
      display: memory.content,
      source: 'master',
      original: memory.original_text,
      originalLanguage: memory.language_code
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════

  setOnLanguageChange(callback) {
    this.onLanguageChange = callback;
  }

  setOnLanguageDetected(callback) {
    this.onLanguageDetected = callback;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get all supported languages as an array
   */
  getSupportedLanguages() {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  /**
   * Check if a language is supported
   */
  isSupported(langCode) {
    return !!SUPPORTED_LANGUAGES[langCode];
  }

  /**
   * Reset to default language
   */
  reset() {
    this.sessionLanguage = this.preferredLanguage || DEFAULT_LANGUAGE;
    this.detectionHistory = [];
  }

  /**
   * Get current state for debugging
   */
  getStatus() {
    return {
      sessionLanguage: this.sessionLanguage,
      preferredLanguage: this.preferredLanguage,
      languageInfo: this.getLanguageInfo(),
      voiceAccent: this.getVoiceAccent(),
      detectionHistory: this.detectionHistory.slice(-3)
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const languageService = new LanguageService();

export default languageService;
