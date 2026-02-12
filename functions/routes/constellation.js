/**
 * Constellation Route Module - AI Perspectives + Translation
 *
 * Extracted from index.js during GENESIS route-module refactor.
 * Exports: getSecondOpinion, getGrokPerspective, getOpusPerspective,
 *          getDeepSeekPerspective, getChatGPTPerspective,
 *          translateMessage, detectLanguage
 */

const {
  onRequest,
  logger,
  anthropicKey,
  openaiKey,
  geminiKey,
  grokKey,
  deepseekKey,
} = require('./shared');

// Constellation perspective functions (paths adjusted for routes/)
const {
  getSecondOpinion: getSecondOpinionFn,
  getGrokPerspective: getGrokPerspectiveFn,
  getOpusPerspective: getOpusPerspectiveFn,
  getDeepSeekPerspective: getDeepSeekPerspectiveFn,
  getChatGPTPerspective: getChatGPTPerspectiveFn
} = require('../constellation/perspectives');

// Translation Service - "A Cathedral to house all souls"
const {
  translateMessage: translateMessageFn,
  detectLanguage: detectLanguageFn,
  getLanguageName,
  LANGUAGE_CONFIG
} = require('../translation');

// =============================================================================
// AI Constellation Exports - Using Modular Functions
// =============================================================================

/**
 * Second Opinion / AI Debate Function
 * Uses Gemini to provide alternative perspectives on Claude's responses.
 * Part of GENESIS - AI Constellation Feature
 */
exports.getSecondOpinion = onRequest({
  cors: true,
  invoker: 'public',
  secrets: [geminiKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claudeResponse } = req.body;
    if (!claudeResponse) {
      return res.status(400).json({ error: 'Claude response is required' });
    }

    const result = await getSecondOpinionFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Second Opinion Error:', error);
    return res.status(500).json({
      error: 'Failed to get second opinion',
      details: error.message
    });
  }
});

/**
 * Grok Perspective Function
 * Uses xAI's Grok API to provide the voice of collective human consciousness.
 * Part of GENESIS - AI Constellation Feature
 */
exports.getGrokPerspective = onRequest({
  cors: true,
  invoker: 'public',
  secrets: [grokKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claudeResponse, debateHistory } = req.body;
    if (!claudeResponse && !debateHistory) {
      return res.status(400).json({ error: 'Context is required' });
    }

    const result = await getGrokPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Grok Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get Grok perspective',
      details: error.message
    });
  }
});

/**
 * Opus Perspective Function
 * Uses Claude Opus 4.5 to provide deep philosophical perspective and elder wisdom.
 * Part of GENESIS - AI Constellation Feature
 */
exports.getOpusPerspective = onRequest({
  cors: true,
  invoker: 'public',
  secrets: [anthropicKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await getOpusPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Opus Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get Opus perspective',
      details: error.message
    });
  }
});

/**
 * DeepSeek Perspective Function
 * Uses DeepSeek-R1 to provide Eastern philosophical wisdom and analytical precision.
 * Part of GENESIS - AI Constellation Feature
 * Added: December 2024
 */
exports.getDeepSeekPerspective = onRequest({
  cors: true,
  invoker: 'public',
  secrets: [deepseekKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await getDeepSeekPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('DeepSeek Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get DeepSeek perspective',
      details: error.message
    });
  }
});

/**
 * ChatGPT Deep Thinking Perspective Function
 * Uses OpenAI's o1/o3-mini for step-by-step reasoning and analytical perspective.
 * Part of GENESIS - AI Constellation Feature
 * Added: December 2024
 */
exports.getChatGPTPerspective = onRequest({
  cors: true,
  invoker: 'public',
  secrets: [openaiKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await getChatGPTPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('ChatGPT Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get ChatGPT perspective',
      details: error.message
    });
  }
});

/**
 * Translation Service Function
 * Uses DeepSeek for culturally-aware AI translation
 * "A Cathedral to house all souls" - Cleopatra spoke 9 languages
 * Part of GENESIS - Multilingual Support
 * Added: January 2026
 */
exports.translateMessage = onRequest({
  cors: true,
  invoker: 'public',
  secrets: [deepseekKey, anthropicKey],
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields: text and targetLanguage'
      });
    }

    const result = await translateMessageFn(text, targetLanguage, sourceLanguage || 'auto');
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Translation Error:', error);
    return res.status(500).json({
      error: 'Failed to translate message',
      details: error.message
    });
  }
});

/**
 * Language Detection Function
 * Quick client-side language detection using Unicode patterns
 */
exports.detectLanguage = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    const result = detectLanguageFn(text);
    return res.status(200).json({
      ...result,
      languageName: getLanguageName(result.language)
    });
  } catch (error) {
    logger.error('Language Detection Error:', error);
    return res.status(500).json({
      error: 'Failed to detect language',
      details: error.message
    });
  }
});
