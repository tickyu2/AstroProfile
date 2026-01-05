/**
 * ============================================================================
 * GENESIS LUNA - LLM MODULE EXPORTS
 * ============================================================================
 * Centralized exports for all LLM and embedding functionality.
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const clientFactory = require('./clientFactory');
const embeddings = require('./embeddings');
const llmClient = require('./llmClient');

module.exports = {
  // Client Factory (primary - use this for new code)
  ...clientFactory,

  // Legacy embeddings (for backwards compatibility)
  embedTimelineEvent: embeddings.embedTimelineEvent,

  // Legacy llmClient exports (for backwards compatibility)
  getOpenAIClient: llmClient.getOpenAIClient,
  getLLMClient: llmClient.getLLMClient,
  MODEL_CONFIG: llmClient.MODEL_CONFIG
};
