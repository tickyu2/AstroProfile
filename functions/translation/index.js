/**
 * TRANSLATION SERVICE
 *
 * Uses DeepSeek for culturally-aware AI translation with Claude fallback
 * Supports bidirectional translation between English and other languages
 *
 * "A Cathedral to house all souls" - Cleopatra spoke 9 languages
 * to reach 9 different types of souls. GENESIS speaks the language
 * of each user's heart.
 */

const Anthropic = require('@anthropic-ai/sdk');

// Language metadata for display and cultural context
const LANGUAGE_CONFIG = {
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    culturalNote: 'Use natural, conversational Mandarin (simplified). Preserve emotional nuance and cultural idioms.'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    culturalNote: 'Use warm, expressive Latin American or Castilian Spanish. Preserve emotional warmth.'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    culturalNote: 'Use appropriate politeness level. Preserve the nuance of indirect communication.'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    culturalNote: 'Use appropriate honorifics and speech levels. Preserve emotional expression.'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    culturalNote: 'Use elegant, expressive French. Preserve subtlety and emotional nuance.'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    culturalNote: 'Use clear, precise German. Maintain formal/informal distinction appropriately.'
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    culturalNote: 'Use Brazilian or European Portuguese as appropriate. Preserve warmth.'
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    culturalNote: 'Use natural Russian with appropriate emotional depth.'
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    culturalNote: 'Use Modern Standard Arabic or appropriate dialect. Preserve eloquence.'
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    culturalNote: 'Use conversational Hindi with appropriate formality.'
  },
  th: {
    name: 'Thai',
    nativeName: 'ไทย',
    culturalNote: 'Use polite Thai with appropriate particles and honorifics.'
  },
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    culturalNote: 'Use appropriate pronouns and politeness markers.'
  },
  en: {
    name: 'English',
    nativeName: 'English',
    culturalNote: 'Use clear, natural English.'
  }
};

/**
 * Detect language from text using Unicode patterns
 * Fast client-side detection before calling translation API
 */
function detectLanguage(text) {
  if (!text || text.trim().length < 2) {
    return { language: 'en', confidence: 0.5 };
  }

  const cleanText = text.trim();

  // Count character types
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
    return { language: 'ja', confidence: 0.9 };
  }
  if (koreanMatches > totalChars * 0.2) {
    return { language: 'ko', confidence: 0.95 };
  }
  if (cjkMatches > totalChars * 0.2) {
    return { language: 'zh', confidence: 0.9 };
  }
  if (cyrillicMatches > totalChars * 0.3) {
    return { language: 'ru', confidence: 0.85 };
  }
  if (arabicMatches > totalChars * 0.3) {
    return { language: 'ar', confidence: 0.9 };
  }
  if (thaiMatches > totalChars * 0.3) {
    return { language: 'th', confidence: 0.95 };
  }
  if (devanagariMatches > totalChars * 0.3) {
    return { language: 'hi', confidence: 0.9 };
  }

  // For Latin scripts, check for Spanish/French/German/Portuguese markers
  if (latinMatches > totalChars * 0.5) {
    // Spanish markers
    if (/[áéíóúñ¿¡]/i.test(cleanText) || /\b(que|por|para|como|esto|pero)\b/i.test(cleanText)) {
      return { language: 'es', confidence: 0.7 };
    }
    // French markers
    if (/[àâçéèêëîïôûùü]/i.test(cleanText) || /\b(que|pour|dans|avec|cette|mais)\b/i.test(cleanText)) {
      return { language: 'fr', confidence: 0.7 };
    }
    // German markers
    if (/[äöüß]/i.test(cleanText) || /\b(und|der|die|das|ist|nicht)\b/i.test(cleanText)) {
      return { language: 'de', confidence: 0.7 };
    }
    // Portuguese markers
    if (/[ãõç]/i.test(cleanText) || /\b(que|para|como|isso|mas|você)\b/i.test(cleanText)) {
      return { language: 'pt', confidence: 0.7 };
    }
    // Default to English
    return { language: 'en', confidence: 0.6 };
  }

  return { language: 'en', confidence: 0.5 };
}

/**
 * Build translation prompt for any AI model
 */
function buildTranslationPrompt(text, sourceConfig, targetConfig) {
  const systemPrompt = `You are a professional translator with deep cultural understanding. Your translations preserve meaning, tone, emotion, and cultural nuances.

Guidelines:
- Translate naturally, not literally
- Preserve emotional tone and nuance
- Keep formatting intact (asterisks for actions like *smiles*, line breaks, etc.)
- For names: keep original unless there's a common localized form
- For technical terms: keep original or provide both
- For idioms: adapt to cultural equivalents
- ${targetConfig.culturalNote}

You ONLY output the translation. No explanations, no notes, no alternatives.`;

  const userPrompt = `Translate from ${sourceConfig.name} to ${targetConfig.name}:

${text}`;

  return { systemPrompt, userPrompt };
}

/**
 * Translate using DeepSeek API
 */
async function translateWithDeepSeek(text, sourceConfig, targetConfig, detectedSource, targetLanguage) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const { systemPrompt, userPrompt } = buildTranslationPrompt(text, sourceConfig, targetConfig);

  console.log(`🌐 [DeepSeek] Translating: ${detectedSource} → ${targetLanguage}`);

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ DeepSeek translation error:', errorData);
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.choices?.[0]?.message?.content?.trim();

  if (!translatedText) {
    throw new Error('Empty translation response from DeepSeek');
  }

  return {
    translatedText,
    model: 'deepseek-chat'
  };
}

/**
 * Translate using Claude (Anthropic) API - Fallback
 */
async function translateWithClaude(text, sourceConfig, targetConfig, detectedSource, targetLanguage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const { systemPrompt, userPrompt } = buildTranslationPrompt(text, sourceConfig, targetConfig);

  console.log(`🌐 [Claude Fallback] Translating: ${detectedSource} → ${targetLanguage}`);

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',  // Fast and cost-effective for translation
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  const translatedText = response.content?.[0]?.text?.trim();

  if (!translatedText) {
    throw new Error('Empty translation response from Claude');
  }

  return {
    translatedText,
    model: 'claude-3-5-haiku'
  };
}

/**
 * Translate text using DeepSeek API with Claude fallback
 *
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'zh', 'es')
 * @param {string} sourceLanguage - Source language code or 'auto' for detection
 * @returns {Promise<Object>} - { translatedText, sourceLanguage, targetLanguage, confidence, model }
 */
async function translateMessage(text, targetLanguage, sourceLanguage = 'auto') {
  // Skip translation if source and target are the same
  let detectedSource = sourceLanguage;
  if (sourceLanguage === 'auto') {
    const detection = detectLanguage(text);
    detectedSource = detection.language;
  }

  if (detectedSource === targetLanguage) {
    return {
      translatedText: text,
      sourceLanguage: detectedSource,
      targetLanguage,
      confidence: 1.0,
      skipped: true
    };
  }

  // Skip very short messages
  if (text.trim().length < 3) {
    return {
      translatedText: text,
      sourceLanguage: detectedSource,
      targetLanguage,
      confidence: 1.0,
      skipped: true
    };
  }

  const sourceConfig = LANGUAGE_CONFIG[detectedSource] || LANGUAGE_CONFIG.en;
  const targetConfig = LANGUAGE_CONFIG[targetLanguage] || LANGUAGE_CONFIG.en;

  // Try DeepSeek first, then Claude as fallback
  let result;
  let usedFallback = false;

  try {
    // Try DeepSeek first
    if (process.env.DEEPSEEK_API_KEY) {
      result = await translateWithDeepSeek(text, sourceConfig, targetConfig, detectedSource, targetLanguage);
      console.log(`✅ [DeepSeek] Translation complete: ${result.translatedText.substring(0, 50)}...`);
    } else {
      throw new Error('DeepSeek API key not available, trying fallback');
    }
  } catch (deepSeekError) {
    console.warn(`⚠️ DeepSeek failed: ${deepSeekError.message}, trying Claude fallback...`);
    usedFallback = true;

    try {
      // Fallback to Claude
      if (process.env.ANTHROPIC_API_KEY) {
        result = await translateWithClaude(text, sourceConfig, targetConfig, detectedSource, targetLanguage);
        console.log(`✅ [Claude] Translation complete: ${result.translatedText.substring(0, 50)}...`);
      } else {
        throw new Error('No translation API keys configured (neither DeepSeek nor Anthropic)');
      }
    } catch (claudeError) {
      console.error('❌ Both DeepSeek and Claude failed:', claudeError.message);
      throw new Error(`Translation failed: ${deepSeekError.message}. Fallback also failed: ${claudeError.message}`);
    }
  }

  return {
    translatedText: result.translatedText,
    sourceLanguage: detectedSource,
    targetLanguage,
    confidence: 0.95,
    model: result.model,
    usedFallback
  };
}

/**
 * Batch translate multiple messages
 * Useful for translating conversation history
 */
async function translateBatch(messages, targetLanguage) {
  const results = await Promise.all(
    messages.map(async (msg) => {
      try {
        const result = await translateMessage(msg.text, targetLanguage, msg.sourceLanguage || 'auto');
        return {
          originalText: msg.text,
          ...result,
          success: true
        };
      } catch (error) {
        return {
          originalText: msg.text,
          translatedText: msg.text,
          sourceLanguage: 'unknown',
          targetLanguage,
          success: false,
          error: error.message
        };
      }
    })
  );
  return results;
}

/**
 * Get language display name
 */
function getLanguageName(code) {
  return LANGUAGE_CONFIG[code]?.name || code;
}

/**
 * Get language native name
 */
function getLanguageNativeName(code) {
  return LANGUAGE_CONFIG[code]?.nativeName || code;
}

module.exports = {
  translateMessage,
  translateBatch,
  detectLanguage,
  getLanguageName,
  getLanguageNativeName,
  LANGUAGE_CONFIG
};
