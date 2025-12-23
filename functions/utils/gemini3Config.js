/**
 * Gemini 3 Configuration & Utilities for Cloud Functions
 *
 * Handles the new Gemini 3 architecture:
 * - ThinkingLevel configuration (replaces thinking_budget)
 * - ThoughtSignature management (mandatory for function calling)
 * - Parts[] array handling
 *
 * BREAKING CHANGES from Gemini 2.5:
 * - thinking_budget removed, use thinkingLevel instead
 * - Signatures mandatory for function calling (400 error if missing)
 * - Strict validation on all requests
 *
 * Part of GENESIS Phase 4 - Gemini 3 Migration
 * December 19, 2024
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const THINKING_LEVELS = {
  MINIMAL: 'minimal',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const DEFAULT_THINKING_LEVEL = THINKING_LEVELS.MEDIUM;

// Gemini 3 model identifiers
const GEMINI_3_MODELS = {
  FLASH_PREVIEW: 'gemini-3-flash-preview',
  FLASH: 'gemini-3-flash',
  PRO: 'gemini-3-pro',
  // Fallback to 2.5 if 3.0 not available
  FLASH_2_5: 'gemini-2.5-flash-preview-05-20'
};

// Current model to use (update as Gemini 3 becomes available)
const CURRENT_MODEL = GEMINI_3_MODELS.FLASH_2_5;

// ═══════════════════════════════════════════════════════════════════════════
// GEMINI CLIENT FACTORY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get Gemini client instance
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured in environment');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Get Gemini 3-ready model instance with thinking config
 *
 * @param {Object} options - Configuration options
 * @param {string} options.thinkingLevel - 'minimal' | 'low' | 'medium' | 'high'
 * @param {boolean} options.includeThoughts - Include thinking content in response
 * @param {string} options.systemInstruction - System prompt for Luna
 * @param {number} options.temperature - Response temperature (default 0.8)
 * @returns {Object} Configured Gemini model
 */
function getGemini3Model(options = {}) {
  const {
    thinkingLevel = DEFAULT_THINKING_LEVEL,
    includeThoughts = false,
    systemInstruction = '',
    temperature = 0.8,
    modelId = CURRENT_MODEL
  } = options;

  const genAI = getGeminiClient();

  // Build Gemini 3 configuration
  const generationConfig = {
    temperature,
    // Gemini 3 thinking configuration (replaces thinking_budget)
    thinkingConfig: {
      thinkingLevel: thinkingLevel,
      includeThoughts: includeThoughts
    }
  };

  const modelConfig = {
    model: modelId,
    generationConfig
  };

  // Add system instruction if provided
  if (systemInstruction) {
    modelConfig.systemInstruction = systemInstruction;
  }

  return genAI.getGenerativeModel(modelConfig);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSATION HISTORY HANDLING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert legacy message format to Gemini 3 format
 *
 * Legacy: { sender: 'user'|'ai', text: string }
 * Gemini 3: { role: 'user'|'model', parts: [{ text }, { thoughtSignature }] }
 *
 * @param {Array} legacyHistory - Legacy conversation history
 * @returns {Array} Gemini 3 compatible history
 */
function convertToGemini3History(legacyHistory) {
  if (!Array.isArray(legacyHistory)) return [];

  return legacyHistory.map(msg => {
    // Already in Gemini 3 format
    if (msg.parts && Array.isArray(msg.parts)) {
      return {
        role: msg.role || (msg.sender === 'ai' ? 'model' : 'user'),
        parts: msg.parts
      };
    }

    // Convert from legacy format
    const role = msg.sender === 'ai' ? 'model' : 'user';
    const parts = [{ text: msg.text || '' }];

    // Preserve thought signature if present
    if (msg.thoughtSignature) {
      parts.push({ thoughtSignature: msg.thoughtSignature });
    }

    return { role, parts };
  });
}

/**
 * Extract text content from Gemini 3 response parts
 *
 * @param {Object} response - Gemini response object
 * @returns {string} Text content
 */
function extractTextFromResponse(response) {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts) return '';

  return parts
    .filter(part => part.text && !part.thought)
    .map(part => part.text)
    .join('');
}

/**
 * Extract thinking content from Gemini 3 response
 *
 * @param {Object} response - Gemini response object
 * @returns {string|null} Thinking content or null
 */
function extractThinkingFromResponse(response) {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts) return null;

  const thinkingPart = parts.find(part => part.thought === true);
  return thinkingPart?.text || null;
}

/**
 * Extract thought signature from Gemini 3 response
 * CRITICAL: Must return this to client for next turn
 *
 * @param {Object} response - Gemini response object
 * @returns {string|null} Thought signature or null
 */
function extractThoughtSignature(response) {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts) return null;

  const signaturePart = parts.find(part => part.thoughtSignature);
  return signaturePart?.thoughtSignature || null;
}

/**
 * Build complete Gemini 3 response object for client
 *
 * @param {Object} response - Raw Gemini response
 * @returns {Object} Formatted response for client
 */
function formatGemini3Response(response) {
  const parts = response?.candidates?.[0]?.content?.parts || [];

  return {
    // Main text content
    text: extractTextFromResponse(response),
    // Full parts array (client should store this)
    parts: parts,
    // Extracted fields for convenience
    thoughtSignature: extractThoughtSignature(response),
    thinkingContent: extractThinkingFromResponse(response),
    // Metadata
    gemini3: true,
    finishReason: response?.candidates?.[0]?.finishReason,
    usageMetadata: response?.usageMetadata
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Start a Gemini 3 chat session with proper configuration
 *
 * @param {Object} options - Session options
 * @param {Array} options.history - Conversation history
 * @param {string} options.thinkingLevel - Thinking level
 * @param {string} options.systemInstruction - System prompt
 * @returns {Object} Chat session
 */
async function startGemini3Chat(options = {}) {
  const {
    history = [],
    thinkingLevel = DEFAULT_THINKING_LEVEL,
    systemInstruction = '',
    includeThoughts = false
  } = options;

  const model = getGemini3Model({
    thinkingLevel,
    includeThoughts,
    systemInstruction
  });

  // Convert history to Gemini 3 format
  const gemini3History = convertToGemini3History(history);

  return model.startChat({ history: gemini3History });
}

/**
 * Send message in Gemini 3 chat session
 *
 * @param {Object} chat - Chat session from startGemini3Chat
 * @param {string} message - User message
 * @returns {Object} Formatted response
 */
async function sendGemini3Message(chat, message) {
  const result = await chat.sendMessage(message);
  const response = await result.response;
  return formatGemini3Response(response);
}

// ═══════════════════════════════════════════════════════════════════════════
// THINKING LEVEL AUTO-DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Auto-detect optimal thinking level based on message complexity
 *
 * @param {string} message - User message
 * @param {Object} context - Additional context
 * @returns {string} Recommended thinking level
 */
function autoDetectThinkingLevel(message, context = {}) {
  const lowerMessage = (message || '').toLowerCase();

  // High thinking triggers
  const highTriggers = [
    'analyze', 'explain why', 'compare', 'life decision',
    'should i', 'help me decide', 'what do you think',
    'psychological', 'birth chart', 'shadow work',
    'complex', 'difficult', 'pros and cons'
  ];

  // Minimal thinking triggers
  const minimalTriggers = [
    'hello', 'hi ', 'hey', 'thanks', 'thank you',
    'bye', 'good morning', 'good night', 'ok', 'yes', 'no'
  ];

  // Check for high complexity
  if (highTriggers.some(t => lowerMessage.includes(t))) {
    return THINKING_LEVELS.HIGH;
  }

  // Check for simple queries
  if (minimalTriggers.some(t => lowerMessage.includes(t)) && message.length < 50) {
    return THINKING_LEVELS.MINIMAL;
  }

  // Length-based heuristic
  if (message.length > 500) return THINKING_LEVELS.HIGH;
  if (message.length > 200) return THINKING_LEVELS.MEDIUM;
  if (message.length < 30) return THINKING_LEVELS.LOW;

  return THINKING_LEVELS.MEDIUM;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate thinking level value
 *
 * @param {string} level - Thinking level to validate
 * @returns {string} Valid thinking level (falls back to medium)
 */
function validateThinkingLevel(level) {
  const validLevels = Object.values(THINKING_LEVELS);
  if (validLevels.includes(level)) {
    return level;
  }
  console.warn(`Invalid thinking level "${level}", falling back to medium`);
  return DEFAULT_THINKING_LEVEL;
}

/**
 * Validate conversation history for Gemini 3
 *
 * @param {Array} history - History to validate
 * @returns {Object} { valid, cleaned, warnings }
 */
function validateHistory(history) {
  const warnings = [];

  if (!Array.isArray(history)) {
    return {
      valid: false,
      cleaned: [],
      warnings: ['History is not an array']
    };
  }

  const cleaned = history.filter((msg, index) => {
    // Must have either parts array or text
    const hasContent = msg.parts || msg.text;
    if (!hasContent) {
      warnings.push(`Message ${index} has no content, skipping`);
      return false;
    }
    return true;
  });

  return {
    valid: warnings.length === 0,
    cleaned,
    warnings
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  // Constants
  THINKING_LEVELS,
  DEFAULT_THINKING_LEVEL,
  GEMINI_3_MODELS,
  CURRENT_MODEL,

  // Client factory
  getGeminiClient,
  getGemini3Model,

  // History handling
  convertToGemini3History,
  extractTextFromResponse,
  extractThinkingFromResponse,
  extractThoughtSignature,
  formatGemini3Response,

  // Chat session
  startGemini3Chat,
  sendGemini3Message,

  // Auto-detection
  autoDetectThinkingLevel,

  // Validation
  validateThinkingLevel,
  validateHistory
};
