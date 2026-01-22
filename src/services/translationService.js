/**
 * TRANSLATION SERVICE
 *
 * Client-side service for AI-powered translation using DeepSeek
 * "A Cathedral to house all souls" - Speaks the language of each user's heart
 *
 * Features:
 * - detectLanguage: Fast client-side language detection using Unicode patterns
 * - translateMessage: AI translation via Cloud Function
 * - getLanguageDisplayName: Get human-readable language name
 */

// Cloud Function URLs (deployed to Firebase)
const TRANSLATE_URL = 'https://us-central1-astroprofile-391e6.cloudfunctions.net/translateMessage';
const DETECT_URL = 'https://us-central1-astroprofile-391e6.cloudfunctions.net/detectLanguage';

// Language metadata for display
export const LANGUAGE_DISPLAY = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' }
};

/**
 * Detect language from text using Unicode patterns
 * Fast client-side detection - no API call needed
 *
 * @param {string} text - Text to analyze
 * @returns {{ language: string, confidence: number, name: string }}
 */
export function detectLanguage(text) {
  if (!text || text.trim().length < 2) {
    return { language: 'en', confidence: 0.5, name: 'English' };
  }

  const cleanText = text.trim();

  // Unicode pattern matching
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf]/g;
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/g;
  const koreanRegex = /[\uac00-\ud7af\u1100-\u11ff]/g;
  const cyrillicRegex = /[\u0400-\u04ff]/g;
  const arabicRegex = /[\u0600-\u06ff\u0750-\u077f]/g;
  const thaiRegex = /[\u0e00-\u0e7f]/g;
  const devanagariRegex = /[\u0900-\u097f]/g;
  const latinRegex = /[a-zA-Z]/g;

  const cjkMatches = (cleanText.match(cjkRegex) || []).length;
  const japaneseMatches = (cleanText.match(japaneseRegex) || []).length;
  const koreanMatches = (cleanText.match(koreanRegex) || []).length;
  const cyrillicMatches = (cleanText.match(cyrillicRegex) || []).length;
  const arabicMatches = (cleanText.match(arabicRegex) || []).length;
  const thaiMatches = (cleanText.match(thaiRegex) || []).length;
  const devanagariMatches = (cleanText.match(devanagariRegex) || []).length;
  const latinMatches = (cleanText.match(latinRegex) || []).length;

  const totalChars = cleanText.length;

  // Determine dominant script
  if (japaneseMatches > 0 && japaneseMatches >= cjkMatches * 0.3) {
    return { language: 'ja', confidence: 0.9, name: 'Japanese' };
  }
  if (koreanMatches > totalChars * 0.2) {
    return { language: 'ko', confidence: 0.95, name: 'Korean' };
  }
  if (cjkMatches > totalChars * 0.2) {
    return { language: 'zh', confidence: 0.9, name: 'Chinese' };
  }
  if (cyrillicMatches > totalChars * 0.3) {
    return { language: 'ru', confidence: 0.85, name: 'Russian' };
  }
  if (arabicMatches > totalChars * 0.3) {
    return { language: 'ar', confidence: 0.9, name: 'Arabic' };
  }
  if (thaiMatches > totalChars * 0.3) {
    return { language: 'th', confidence: 0.95, name: 'Thai' };
  }
  if (devanagariMatches > totalChars * 0.3) {
    return { language: 'hi', confidence: 0.9, name: 'Hindi' };
  }

  // For Latin scripts, check for language markers
  if (latinMatches > totalChars * 0.5) {
    // Spanish markers
    if (/[áéíóúñ¿¡]/i.test(cleanText) || /\b(que|por|para|como|esto|pero|hola)\b/i.test(cleanText)) {
      return { language: 'es', confidence: 0.7, name: 'Spanish' };
    }
    // French markers
    if (/[àâçéèêëîïôûùü]/i.test(cleanText) || /\b(que|pour|dans|avec|cette|mais|bonjour)\b/i.test(cleanText)) {
      return { language: 'fr', confidence: 0.7, name: 'French' };
    }
    // German markers
    if (/[äöüß]/i.test(cleanText) || /\b(und|der|die|das|ist|nicht|hallo)\b/i.test(cleanText)) {
      return { language: 'de', confidence: 0.7, name: 'German' };
    }
    // Portuguese markers
    if (/[ãõç]/i.test(cleanText) || /\b(que|para|como|isso|mas|você|olá)\b/i.test(cleanText)) {
      return { language: 'pt', confidence: 0.7, name: 'Portuguese' };
    }
    // Default to English
    return { language: 'en', confidence: 0.6, name: 'English' };
  }

  return { language: 'en', confidence: 0.5, name: 'English' };
}

/**
 * Translate text using DeepSeek via Cloud Function
 *
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'zh', 'es')
 * @param {string} sourceLanguage - Source language code or 'auto'
 * @returns {Promise<{ translatedText: string, sourceLanguage: string, targetLanguage: string }>}
 */
export async function translateMessage(text, targetLanguage, sourceLanguage = 'auto') {
  // Quick client-side checks
  if (!text || text.trim().length < 3) {
    return {
      translatedText: text,
      sourceLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
      targetLanguage,
      skipped: true
    };
  }

  // Detect source language if auto
  let detectedSource = sourceLanguage;
  if (sourceLanguage === 'auto') {
    const detection = detectLanguage(text);
    detectedSource = detection.language;
  }

  // Skip if same language
  if (detectedSource === targetLanguage) {
    return {
      translatedText: text,
      sourceLanguage: detectedSource,
      targetLanguage,
      skipped: true
    };
  }

  console.log(`🌐 Translating: ${detectedSource} → ${targetLanguage}`);

  try {
    const response = await fetch(TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage: detectedSource
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Translation API error:', errorData);
      throw new Error(`Translation failed: ${response.status}`);
    }

    const result = await response.json();
    const modelName = result.model || 'unknown';
    const usedFallback = result.usedFallback || false;
    console.log(`✅ Translation complete via ${modelName}${usedFallback ? ' (fallback)' : ''}`);

    return {
      translatedText: result.translatedText,
      sourceLanguage: result.sourceLanguage || detectedSource,
      targetLanguage: result.targetLanguage || targetLanguage,
      confidence: result.confidence || 0.9,
      model: modelName,
      usedFallback
    };

  } catch (error) {
    console.error('Translation error:', error);
    // Return original text on error
    return {
      translatedText: text,
      sourceLanguage: detectedSource,
      targetLanguage,
      error: error.message,
      skipped: true
    };
  }
}

/**
 * Translate to English (convenience function)
 */
export async function translateToEnglish(text, sourceLanguage = 'auto') {
  return translateMessage(text, 'en', sourceLanguage);
}

/**
 * Translate from English (convenience function)
 */
export async function translateFromEnglish(text, targetLanguage) {
  return translateMessage(text, targetLanguage, 'en');
}

/**
 * Get display name for a language code
 */
export function getLanguageDisplayName(code) {
  return LANGUAGE_DISPLAY[code]?.name || code;
}

/**
 * Get native name for a language code
 */
export function getLanguageNativeName(code) {
  return LANGUAGE_DISPLAY[code]?.nativeName || code;
}

/**
 * Get flag emoji for a language code
 */
export function getLanguageFlag(code) {
  return LANGUAGE_DISPLAY[code]?.flag || '🌐';
}

/**
 * Check if language is non-English
 */
export function isNonEnglish(languageCode) {
  return languageCode && languageCode !== 'en';
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages() {
  return Object.entries(LANGUAGE_DISPLAY).map(([code, info]) => ({
    code,
    ...info
  }));
}

export default {
  detectLanguage,
  translateMessage,
  translateToEnglish,
  translateFromEnglish,
  getLanguageDisplayName,
  getLanguageNativeName,
  getLanguageFlag,
  isNonEnglish,
  getSupportedLanguages,
  LANGUAGE_DISPLAY
};
