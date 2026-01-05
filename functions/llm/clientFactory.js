/**
 * ============================================================================
 * GENESIS LUNA - LLM CLIENT FACTORY
 * ============================================================================
 * Centralized factory for all LLM and embedding clients.
 * Eliminates scattered client initializations across the codebase.
 *
 * Supported Providers:
 * - Google Gemini (embeddings, chat, reflection)
 * - OpenAI (embeddings, chat)
 * - Anthropic Claude (chat)
 *
 * Features:
 * - Singleton pattern for each client
 * - Automatic retry with exponential backoff
 * - Rate limiting
 * - Usage tracking
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { LLM, PERFORMANCE } = require('../config/constants');

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

const _clients = {
  gemini: null,
  openai: null,
  anthropic: null
};

// Usage tracking
const _usage = {
  embeddingCalls: 0,
  llmCalls: 0,
  lastReset: Date.now()
};

// ============================================================================
// CLIENT GETTERS
// ============================================================================

/**
 * Get Google Gemini client (singleton)
 *
 * @returns {GoogleGenerativeAI} Gemini client
 */
function getGeminiClient() {
  if (_clients.gemini) return _clients.gemini;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('[LLM Factory] GEMINI_API_KEY not configured');
  }

  _clients.gemini = new GoogleGenerativeAI(apiKey);
  console.log('[LLM Factory] Gemini client initialized');
  return _clients.gemini;
}

/**
 * Get OpenAI client (singleton)
 *
 * @returns {OpenAI} OpenAI client
 */
function getOpenAIClient() {
  if (_clients.openai) return _clients.openai;

  try {
    const OpenAI = require('openai');
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('[LLM Factory] OPENAI_API_KEY not set');
    }

    _clients.openai = new OpenAI({ apiKey });
    console.log('[LLM Factory] OpenAI client initialized');
    return _clients.openai;
  } catch (error) {
    console.warn('[LLM Factory] OpenAI SDK not available:', error.message);
    return null;
  }
}

/**
 * Get Anthropic client (singleton)
 *
 * @returns {Anthropic} Anthropic client
 */
function getAnthropicClient() {
  if (_clients.anthropic) return _clients.anthropic;

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.warn('[LLM Factory] ANTHROPIC_API_KEY not set');
    }

    _clients.anthropic = new Anthropic({ apiKey });
    console.log('[LLM Factory] Anthropic client initialized');
    return _clients.anthropic;
  } catch (error) {
    console.warn('[LLM Factory] Anthropic SDK not available:', error.message);
    return null;
  }
}

// ============================================================================
// MODEL ACCESSORS
// ============================================================================

/**
 * Get Gemini model for specific task
 *
 * @param {string} task - 'embedding' | 'chat' | 'reflection'
 * @returns {GenerativeModel} Gemini model
 */
function getGeminiModel(task = 'chat') {
  const client = getGeminiClient();

  const modelMap = {
    embedding: LLM.MODELS.EMBEDDING,
    chat: LLM.MODELS.CHAT,
    reflection: LLM.MODELS.REFLECTION
  };

  const modelName = modelMap[task] || LLM.MODELS.CHAT;
  return client.getGenerativeModel({ model: modelName });
}

// ============================================================================
// EMBEDDING FUNCTIONS
// ============================================================================

/**
 * Generate embedding for text
 * Uses Gemini with retry logic
 *
 * @param {string} text - Text to embed
 * @param {Object} options - Configuration
 * @returns {Promise<number[]>} 768-dimensional embedding
 */
async function embedText(text, options = {}) {
  const {
    maxRetries = LLM.RETRY.MAX_ATTEMPTS,
    truncateLength = 8000
  } = options;

  if (!text || typeof text !== 'string') {
    console.warn('[LLM Factory] Empty text, returning zero vector');
    return new Array(LLM.EMBEDDING_DIMENSIONS || 768).fill(0);
  }

  const truncatedText = text.slice(0, truncateLength);
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Rate limit check
      await checkRateLimit('embedding');

      const model = getGeminiModel('embedding');
      const result = await model.embedContent(truncatedText);
      const embedding = result.embedding.values;

      if (!embedding || embedding.length === 0) {
        throw new Error('Empty embedding returned');
      }

      _usage.embeddingCalls++;
      return embedding;

    } catch (error) {
      attempt++;
      const backoff = LLM.RETRY.INITIAL_DELAY_MS * Math.pow(LLM.RETRY.BACKOFF_MULTIPLIER, attempt);

      console.warn(
        `[LLM Factory] Embedding attempt ${attempt}/${maxRetries} failed: ${error.message}`
      );

      if (attempt >= maxRetries) {
        console.error('[LLM Factory] Embedding failed, returning zero vector');
        return new Array(768).fill(0);
      }

      await sleep(backoff);
    }
  }

  return new Array(768).fill(0);
}

/**
 * Batch embed multiple texts
 *
 * @param {string[]} texts - Texts to embed
 * @param {Object} options - Configuration
 * @returns {Promise<number[][]>} Array of embeddings
 */
async function embedBatch(texts, options = {}) {
  const { batchSize = PERFORMANCE.BATCH.EMBEDDING_BATCH_SIZE } = options;

  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const results = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const batchPromises = batch.map(text => embedText(text, options));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Delay between batches
    if (i + batchSize < texts.length) {
      await sleep(100);
    }
  }

  return results;
}

// ============================================================================
// CHAT/GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate text using Gemini
 *
 * @param {string} prompt - The prompt
 * @param {Object} options - Generation options
 * @returns {Promise<string>} Generated text
 */
async function generateText(prompt, options = {}) {
  const {
    model = 'chat',
    maxTokens = LLM.GENERATION.MAX_TOKENS,
    temperature = LLM.GENERATION.TEMPERATURE,
    maxRetries = LLM.RETRY.MAX_ATTEMPTS
  } = options;

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await checkRateLimit('llm');

      const geminiModel = getGeminiModel(model);
      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature
        }
      });

      const response = result.response;
      const text = response.text();

      _usage.llmCalls++;
      return text;

    } catch (error) {
      attempt++;
      const backoff = LLM.RETRY.INITIAL_DELAY_MS * Math.pow(LLM.RETRY.BACKOFF_MULTIPLIER, attempt);

      console.warn(
        `[LLM Factory] Generation attempt ${attempt}/${maxRetries} failed: ${error.message}`
      );

      if (attempt >= maxRetries) {
        throw error;
      }

      await sleep(backoff);
    }
  }
}

/**
 * Generate structured output (JSON)
 *
 * @param {string} prompt - The prompt
 * @param {Object} schema - Expected JSON schema
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Parsed JSON
 */
async function generateJSON(prompt, schema = null, options = {}) {
  const enhancedPrompt = schema
    ? `${prompt}\n\nRespond with valid JSON matching this schema: ${JSON.stringify(schema)}`
    : `${prompt}\n\nRespond with valid JSON only, no markdown.`;

  const text = await generateText(enhancedPrompt, {
    ...options,
    temperature: 0.3 // Lower for structured output
  });

  try {
    // Clean potential markdown
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('[LLM Factory] JSON parse failed:', error.message);
    return null;
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Check and enforce rate limits
 *
 * @param {string} type - 'embedding' | 'llm'
 */
async function checkRateLimit(type) {
  const now = Date.now();
  const minute = 60000;

  // Reset counters every minute
  if (now - _usage.lastReset > minute) {
    _usage.embeddingCalls = 0;
    _usage.llmCalls = 0;
    _usage.lastReset = now;
  }

  const limits = PERFORMANCE.RATE_LIMITS;

  if (type === 'embedding' && _usage.embeddingCalls >= limits.EMBEDDING_CALLS_PER_MINUTE) {
    const waitTime = minute - (now - _usage.lastReset);
    console.warn(`[LLM Factory] Rate limit reached, waiting ${waitTime}ms`);
    await sleep(waitTime);
    _usage.embeddingCalls = 0;
    _usage.lastReset = Date.now();
  }

  if (type === 'llm' && _usage.llmCalls >= limits.LLM_CALLS_PER_MINUTE) {
    const waitTime = minute - (now - _usage.lastReset);
    console.warn(`[LLM Factory] Rate limit reached, waiting ${waitTime}ms`);
    await sleep(waitTime);
    _usage.llmCalls = 0;
    _usage.lastReset = Date.now();
  }
}

// ============================================================================
// VECTOR UTILITIES
// ============================================================================

/**
 * Format embedding for PostgreSQL pgvector
 *
 * @param {number[]} embedding - Embedding vector
 * @returns {string} PostgreSQL vector format
 */
function formatForPgVector(embedding) {
  if (!Array.isArray(embedding)) {
    return '[' + new Array(768).fill(0).join(',') + ']';
  }
  return '[' + embedding.join(',') + ']';
}

/**
 * Parse pgvector string to array
 *
 * @param {string} str - PostgreSQL vector string
 * @returns {number[]} Embedding array
 */
function parseFromPgVector(str) {
  if (!str) return null;
  return str.replace(/[\[\]]/g, '').split(',').map(Number);
}

/**
 * Calculate cosine similarity
 *
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Similarity (0-1)
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================================================
// HELPERS
// ============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get usage statistics
 */
function getUsageStats() {
  return {
    ..._usage,
    clientsInitialized: {
      gemini: !!_clients.gemini,
      openai: !!_clients.openai,
      anthropic: !!_clients.anthropic
    }
  };
}

/**
 * Reset all clients (for testing)
 */
function resetClients() {
  _clients.gemini = null;
  _clients.openai = null;
  _clients.anthropic = null;
  _usage.embeddingCalls = 0;
  _usage.llmCalls = 0;
  _usage.lastReset = Date.now();
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Client getters
  getGeminiClient,
  getOpenAIClient,
  getAnthropicClient,
  getGeminiModel,

  // Embedding functions
  embedText,
  embedBatch,

  // Generation functions
  generateText,
  generateJSON,

  // Vector utilities
  formatForPgVector,
  parseFromPgVector,
  cosineSimilarity,

  // Management
  getUsageStats,
  resetClients
};
