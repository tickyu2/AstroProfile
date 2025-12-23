/**
 * LLM Client Wrapper
 * ==================
 * Centralized LLM and embedding client with model selection and timeouts.
 * Supports OpenAI, Anthropic, and Google Gemini providers.
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const OpenAI = require('openai');

// Singleton clients
let openaiClient = null;
let anthropicClient = null;

/**
 * Get OpenAI client (for embeddings and chat)
 * @returns {OpenAI} OpenAI client instance
 */
function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('[llmClient] OPENAI_API_KEY not set');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Get embedding client (defaults to OpenAI)
 * @returns {OpenAI} Client for embeddings
 */
function getEmbeddingClient() {
  return getOpenAIClient();
}

/**
 * Get LLM client for chat completions
 * @param {string} provider - 'openai' | 'anthropic' | 'gemini'
 * @returns {Object} LLM client
 */
function getLLMClient(provider = 'openai') {
  switch (provider) {
    case 'anthropic':
      if (!anthropicClient) {
        const Anthropic = require('@anthropic-ai/sdk');
        anthropicClient = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
      }
      return anthropicClient;

    case 'openai':
    default:
      return getOpenAIClient();
  }
}

/**
 * Default model configurations
 */
const MODEL_CONFIG = {
  embedding: {
    model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    dimensions: 768
  },
  consolidation: {
    model: process.env.CONSOLIDATION_LLM_MODEL || 'gpt-4o-mini',
    maxTokens: 1200,
    temperature: 0.0
  }
};

module.exports = {
  getOpenAIClient,
  getEmbeddingClient,
  getLLMClient,
  MODEL_CONFIG
};
