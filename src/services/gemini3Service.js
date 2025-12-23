/**
 * Gemini 3 Service - Thought Signature Management
 *
 * Handles the new Gemini 3 architecture requirements:
 * - ThoughtSignature persistence for multi-turn conversations
 * - ThinkingLevel configuration (minimal, low, medium, high)
 * - Parts array management for conversation history
 *
 * CRITICAL: Gemini 3 requires thoughtSignatures for function calling.
 * Missing signatures result in 400 errors.
 *
 * Part of GENESIS Phase 4 - Gemini 3 Migration
 * December 19, 2024
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const THINKING_LEVELS = {
  MINIMAL: 'minimal',   // Fastest - simple queries
  LOW: 'low',           // Quick responses, basic reasoning
  MEDIUM: 'medium',     // Balanced (default for Luna)
  HIGH: 'high'          // Deep reasoning - complex analysis
};

export const THINKING_LEVEL_DESCRIPTIONS = {
  minimal: {
    label: 'Minimal',
    description: 'Fastest responses, simple queries',
    icon: '⚡',
    useCase: 'Quick facts, greetings, simple questions'
  },
  low: {
    label: 'Quick',
    description: 'Fast with basic reasoning',
    icon: '🏃',
    useCase: 'Casual conversation, straightforward advice'
  },
  medium: {
    label: 'Balanced',
    description: 'Standard Luna thinking',
    icon: '🧠',
    useCase: 'Most conversations (recommended)'
  },
  high: {
    label: 'Deep Think',
    description: 'Complex analysis and reasoning',
    icon: '🔮',
    useCase: 'Life decisions, deep self-reflection, complex problems'
  }
};

// Default thinking level for Luna
export const DEFAULT_THINKING_LEVEL = THINKING_LEVELS.MEDIUM;

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE STRUCTURE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a Gemini 3-compatible message object
 *
 * @param {string} role - 'user' or 'model'
 * @param {string} text - Message text content
 * @param {Object} options - Additional options
 * @param {string} options.thoughtSignature - Thought signature from previous response
 * @param {string} options.thinkingContent - Visible thinking content (if includeThoughts: true)
 * @returns {Object} Gemini 3 message format
 */
export function createGemini3Message(role, text, options = {}) {
  const { thoughtSignature, thinkingContent } = options;

  const parts = [];

  // Add thinking content if present (from model responses with includeThoughts: true)
  if (thinkingContent && role === 'model') {
    parts.push({
      thought: true,
      text: thinkingContent
    });
  }

  // Add main text content
  parts.push({ text });

  // Add thought signature if present (CRITICAL for Gemini 3)
  if (thoughtSignature) {
    parts.push({ thoughtSignature });
  }

  return { role, parts };
}

/**
 * Extract text from Gemini 3 message parts
 * Handles the new parts[] structure
 *
 * @param {Object} message - Gemini 3 message { role, parts }
 * @returns {string} Combined text content
 */
export function extractTextFromParts(message) {
  if (!message?.parts) {
    // Legacy format fallback
    return message?.text || '';
  }

  return message.parts
    .filter(part => part.text && !part.thought)  // Exclude thinking parts
    .map(part => part.text)
    .join('');
}

/**
 * Extract thinking content from Gemini 3 message parts
 *
 * @param {Object} message - Gemini 3 message { role, parts }
 * @returns {string|null} Thinking content or null
 */
export function extractThinkingFromParts(message) {
  if (!message?.parts) return null;

  const thinkingPart = message.parts.find(part => part.thought === true);
  return thinkingPart?.text || null;
}

/**
 * Extract thought signature from Gemini 3 message parts
 * CRITICAL: Must persist this for function calling
 *
 * @param {Object} message - Gemini 3 message { role, parts }
 * @returns {string|null} Thought signature or null
 */
export function extractThoughtSignature(message) {
  if (!message?.parts) return null;

  const signaturePart = message.parts.find(part => part.thoughtSignature);
  return signaturePart?.thoughtSignature || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSATION HISTORY CONVERSION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert legacy message format to Gemini 3 format
 *
 * Legacy: { sender: 'user'|'ai', text: string }
 * Gemini 3: { role: 'user'|'model', parts: [{ text }, { thoughtSignature }] }
 *
 * @param {Object} legacyMessage - Legacy message format
 * @param {Object} options - Conversion options
 * @returns {Object} Gemini 3 message format
 */
export function convertToGemini3Format(legacyMessage, options = {}) {
  const role = legacyMessage.sender === 'ai' ? 'model' : 'user';

  const parts = [{ text: legacyMessage.text || '' }];

  // Preserve thought signature if it exists (Gemini 3 messages stored in legacy format)
  if (legacyMessage.thoughtSignature) {
    parts.push({ thoughtSignature: legacyMessage.thoughtSignature });
  }

  // Preserve thinking content if it exists
  if (legacyMessage.thinkingContent) {
    parts.unshift({ thought: true, text: legacyMessage.thinkingContent });
  }

  return { role, parts };
}

/**
 * Convert Gemini 3 response to storage format
 * We store in a hybrid format that preserves Gemini 3 data but maintains
 * backward compatibility with existing UI components.
 *
 * @param {Object} gemini3Response - Response from Gemini 3 API
 * @returns {Object} Storage-friendly message format
 */
export function convertFromGemini3Response(gemini3Response) {
  const parts = gemini3Response?.parts || [];

  // Extract components
  const text = extractTextFromParts(gemini3Response);
  const thinkingContent = extractThinkingFromParts(gemini3Response);
  const thoughtSignature = extractThoughtSignature(gemini3Response);

  return {
    sender: 'ai',
    text,
    // Gemini 3 specific fields (preserved for next turn)
    parts,  // Store full parts array for Gemini 3 compatibility
    thoughtSignature,  // Store separately for easy access
    thinkingContent,   // Store thinking if present
    // Metadata
    gemini3: true,  // Flag indicating Gemini 3 format
    timestamp: new Date().toISOString()
  };
}

/**
 * Build Gemini 3-compatible conversation history
 * Ensures thought signatures are properly chained
 *
 * @param {Array} messages - Array of messages (can be mixed legacy/Gemini3)
 * @returns {Array} Gemini 3 history format
 */
export function buildGemini3History(messages) {
  return messages.map((msg, index) => {
    // If already in Gemini 3 format with parts, use as-is
    if (msg.parts && Array.isArray(msg.parts)) {
      return {
        role: msg.role || (msg.sender === 'ai' ? 'model' : 'user'),
        parts: msg.parts
      };
    }

    // Convert from legacy format
    const converted = convertToGemini3Format(msg);

    // For model messages, include thought signature if present
    // This is CRITICAL for maintaining thinking chain
    if (converted.role === 'model' && msg.thoughtSignature) {
      // Ensure signature is in parts
      if (!converted.parts.some(p => p.thoughtSignature)) {
        converted.parts.push({ thoughtSignature: msg.thoughtSignature });
      }
    }

    return converted;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// THINKING LEVEL MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine optimal thinking level based on message content
 * Auto-adjusts Luna's "brainpower" based on task complexity
 *
 * @param {string} message - User's message
 * @param {Object} context - Additional context
 * @returns {string} Recommended thinking level
 */
export function determineThinkingLevel(message, context = {}) {
  const lowerMessage = message.toLowerCase();

  // High thinking for complex topics
  const highTriggers = [
    'life decision', 'should i', 'help me decide', 'career change',
    'relationship advice', 'what do you think about', 'analyze',
    'deep question', 'meaning of life', 'existential', 'philosophy',
    'complex', 'difficult choice', 'pros and cons', 'compare',
    'birth chart analysis', 'psychological', 'shadow work'
  ];

  // Minimal thinking for simple interactions
  const minimalTriggers = [
    'hello', 'hi', 'hey', 'thanks', 'thank you', 'bye', 'goodbye',
    'good morning', 'good night', 'ok', 'okay', 'yes', 'no',
    'what time', 'what date', 'weather'
  ];

  // Check for high complexity
  if (highTriggers.some(trigger => lowerMessage.includes(trigger))) {
    return THINKING_LEVELS.HIGH;
  }

  // Check for simple queries
  if (minimalTriggers.some(trigger => lowerMessage.includes(trigger)) && message.length < 50) {
    return THINKING_LEVELS.MINIMAL;
  }

  // Question length heuristic
  if (message.length > 500) {
    return THINKING_LEVELS.HIGH;
  }

  if (message.length > 200) {
    return THINKING_LEVELS.MEDIUM;
  }

  // Default to medium for Luna's balanced approach
  return THINKING_LEVELS.MEDIUM;
}

/**
 * Build Gemini 3 generation config with thinking settings
 *
 * @param {string} thinkingLevel - Thinking level
 * @param {Object} options - Additional options
 * @returns {Object} Gemini 3 generationConfig
 */
export function buildGenerationConfig(thinkingLevel = DEFAULT_THINKING_LEVEL, options = {}) {
  const { includeThoughts = false, temperature = 0.8 } = options;

  return {
    temperature,
    thinkingConfig: {
      thinkingLevel: thinkingLevel,
      includeThoughts: includeThoughts  // Show thinking in response if true
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION STORAGE FOR THOUGHT SIGNATURES
// ═══════════════════════════════════════════════════════════════════════════

// In-memory cache for current session's thought signatures
// This is Luna's "short-term working memory" separate from long-term memory
const thoughtSignatureCache = new Map();

/**
 * Store thought signature for a conversation
 *
 * @param {string} conversationId - Conversation identifier
 * @param {string} signature - Thought signature from Gemini 3
 */
export function cacheThoughtSignature(conversationId, signature) {
  if (signature) {
    thoughtSignatureCache.set(conversationId, {
      signature,
      timestamp: Date.now()
    });
  }
}

/**
 * Get cached thought signature for a conversation
 *
 * @param {string} conversationId - Conversation identifier
 * @returns {string|null} Cached signature or null
 */
export function getCachedThoughtSignature(conversationId) {
  const cached = thoughtSignatureCache.get(conversationId);
  if (!cached) return null;

  // Signatures are valid for 30 minutes
  const maxAge = 30 * 60 * 1000;
  if (Date.now() - cached.timestamp > maxAge) {
    thoughtSignatureCache.delete(conversationId);
    return null;
  }

  return cached.signature;
}

/**
 * Clear thought signature cache for a conversation
 * Call this when starting a new conversation
 *
 * @param {string} conversationId - Conversation identifier
 */
export function clearThoughtSignatureCache(conversationId) {
  if (conversationId) {
    thoughtSignatureCache.delete(conversationId);
  } else {
    thoughtSignatureCache.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate message history for Gemini 3 compatibility
 * Helps catch issues before API calls
 *
 * @param {Array} history - Conversation history
 * @returns {Object} Validation result { valid, warnings, errors }
 */
export function validateGemini3History(history) {
  const result = {
    valid: true,
    warnings: [],
    errors: []
  };

  if (!Array.isArray(history)) {
    result.valid = false;
    result.errors.push('History must be an array');
    return result;
  }

  history.forEach((msg, index) => {
    // Check for role
    if (!msg.role || !['user', 'model'].includes(msg.role)) {
      result.warnings.push(`Message ${index}: Invalid or missing role`);
    }

    // Check for parts
    if (!msg.parts || !Array.isArray(msg.parts)) {
      result.warnings.push(`Message ${index}: Missing parts array (will be auto-converted)`);
    }

    // Check for text content
    const hasText = msg.parts?.some(p => p.text) || msg.text;
    if (!hasText) {
      result.warnings.push(`Message ${index}: No text content found`);
    }
  });

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Constants
  THINKING_LEVELS,
  THINKING_LEVEL_DESCRIPTIONS,
  DEFAULT_THINKING_LEVEL,

  // Message handling
  createGemini3Message,
  extractTextFromParts,
  extractThinkingFromParts,
  extractThoughtSignature,

  // Conversion
  convertToGemini3Format,
  convertFromGemini3Response,
  buildGemini3History,

  // Thinking level
  determineThinkingLevel,
  buildGenerationConfig,

  // Signature caching
  cacheThoughtSignature,
  getCachedThoughtSignature,
  clearThoughtSignatureCache,

  // Validation
  validateGemini3History
};
