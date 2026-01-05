/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * KNOWLEDGE MODULE - GENESIS Personality RAG System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides personality knowledge retrieval for Luna conversations:
 * - Enneagram (9 types, wings, triads)
 * - BaZi (10 day masters, elements)
 * - Big 5 (OCEAN traits, profiles)
 *
 * Two paths:
 * - VOICE: JSON direct lookup (<50ms)
 * - TEXT: Firestore Vector Search with fallbacks (<500ms)
 *
 * Created: December 28, 2024
 * Part of: GENESIS Conversational AI v2 - Phase 3 RAG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const {
  getKnowledgeContext,
  buildKnowledgePromptContext,
  getKnowledgeFromJSON,
  searchJSONByKeyword,
  getKnowledgeForMemory,
  loadKnowledgeJSON
} = require('./knowledgeRetrieval');

// Vector search (optional - may not be available)
let vectorSearch = null;
try {
  vectorSearch = require('./vectorSearch');
} catch (e) {
  // Vector search not available
}

// Embedding job export
const { embedKnowledgeBase } = require('./embedKnowledgeBase');

// Documentation store (vector-indexed docs/)
const documentationStore = require('./documentationStore');

module.exports = {
  // Main API
  getKnowledgeContext,
  buildKnowledgePromptContext,

  // Direct JSON access (voice mode)
  getKnowledgeFromJSON,
  searchJSONByKeyword,
  loadKnowledgeJSON,

  // Memory integration
  getKnowledgeForMemory,

  // Vector search (if available)
  searchKnowledge: vectorSearch?.searchKnowledge,
  searchForProfile: vectorSearch?.searchForProfile,

  // Admin
  embedKnowledgeBase,

  // Documentation RAG (vector-indexed docs/)
  indexDocumentation: documentationStore.indexDocumentation,
  searchDocumentation: documentationStore.searchDocumentation,
  getDocumentationContext: documentationStore.getDocumentationContext
};
