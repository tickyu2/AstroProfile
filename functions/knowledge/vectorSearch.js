/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VECTOR SEARCH SERVICE - Firestore ANN Search
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Performs semantic search over personality knowledge using Firestore's
 * native vector search (findNearest).
 *
 * Features:
 * - Semantic query understanding via embeddings
 * - Type filtering (enneagram, bazi, big5)
 * - Configurable result limit
 * - Distance-based ranking
 *
 * Requirements:
 * - Firestore vector index on knowledge_vectors collection
 * - GEMINI_API_KEY for query embeddings
 *
 * Created: December 28, 2024
 * Part of: GENESIS Conversational AI v2 - Phase 3 RAG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

require('dotenv').config();

const admin = require('firebase-admin');
const { embedText, cosineSimilarity } = require('../llm/embeddings');

// Initialize if needed
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const COLLECTION = 'knowledge_vectors';

// ═══════════════════════════════════════════════════════════════════════════════
// VECTOR SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Search knowledge base using vector similarity
 *
 * @param {string} query - Natural language search query
 * @param {Object} options - Search options
 * @param {number} options.limit - Max results (default: 5)
 * @param {string} options.type - Filter by type: 'enneagram', 'bazi', 'big5'
 * @param {string} options.subtype - Filter by subtype (e.g., 'type', 'wing', 'trait')
 * @param {number} options.minSimilarity - Minimum similarity threshold (0-1)
 * @returns {Promise<Array>} Search results with similarity scores
 */
async function searchKnowledge(query, options = {}) {
  const {
    limit = 5,
    type = null,
    subtype = null,
    minSimilarity = 0.5
  } = options;

  const startTime = Date.now();

  try {
    // 1. Embed the query
    console.log(`[VectorSearch] Embedding query: "${query.substring(0, 50)}..."`);
    const queryEmbedding = await embedText(query);

    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('[VectorSearch] Failed to embed query');
      return [];
    }

    // 2. Build base query
    let collectionRef = db.collection(COLLECTION);

    // Apply type filter if specified
    if (type) {
      collectionRef = collectionRef.where('type', '==', type);
    }

    // 3. Perform vector search using Firestore findNearest
    const vectorQuery = collectionRef.findNearest('embedding', queryEmbedding, {
      limit: limit * 2, // Fetch extra to account for filtering
      distanceMeasure: 'COSINE'
    });

    const snapshot = await vectorQuery.get();

    // 4. Process results
    const results = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      // Apply subtype filter if specified
      if (subtype && data.subtype !== subtype) {
        return;
      }

      // Calculate similarity from distance (COSINE distance = 1 - similarity)
      const similarity = 1 - (doc.distance || 0);

      // Apply similarity threshold
      if (similarity < minSimilarity) {
        return;
      }

      results.push({
        id: doc.id,
        type: data.type,
        subtype: data.subtype,
        key: data.key,
        title: data.title,
        searchableText: data.searchableText,
        metadata: data.metadata,
        lunaGuidance: data.lunaGuidance,
        similarity,
        distance: doc.distance
      });
    });

    // Sort by similarity (highest first) and limit
    results.sort((a, b) => b.similarity - a.similarity);
    const finalResults = results.slice(0, limit);

    const duration = Date.now() - startTime;
    console.log(`[VectorSearch] Found ${finalResults.length} results in ${duration}ms`);

    return finalResults;

  } catch (error) {
    console.error('[VectorSearch] Search failed:', error.message);

    // Check if it's a missing index error
    if (error.message.includes('index')) {
      console.error('[VectorSearch] ⚠️ Vector index may be missing. Run:');
      console.error('  gcloud firestore indexes composite create \\');
      console.error('    --collection-group=knowledge_vectors \\');
      console.error('    --query-scope=COLLECTION \\');
      console.error('    --field-config field-path=embedding,vector-config=\'{"dimension":"768","flat":{}}\'');
    }

    throw error;
  }
}

/**
 * Search with timeout for voice-critical paths
 *
 * @param {string} query - Search query
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Search results or empty array on timeout
 */
async function searchWithTimeout(query, timeoutMs = 500, options = {}) {
  try {
    const result = await Promise.race([
      searchKnowledge(query, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Search timeout')), timeoutMs)
      )
    ]);
    return result;
  } catch (error) {
    console.warn(`[VectorSearch] Timeout or error: ${error.message}`);
    return [];
  }
}

/**
 * Search for knowledge related to a specific personality profile
 *
 * @param {Object} profile - User's personality profile
 * @param {string} profile.enneagramType - Enneagram type (1-9)
 * @param {string} profile.dayMaster - BaZi day master key
 * @param {Object} profile.big5 - Big 5 scores
 * @param {string} query - Optional additional query context
 * @returns {Promise<Object>} Categorized search results
 */
async function searchForProfile(profile, query = '') {
  const results = {
    enneagram: [],
    bazi: [],
    big5: [],
    general: []
  };

  const searches = [];

  // Search for Enneagram type context
  if (profile.enneagramType) {
    searches.push(
      searchKnowledge(`Enneagram Type ${profile.enneagramType}`, {
        type: 'enneagram',
        limit: 3
      }).then(r => { results.enneagram = r; })
    );
  }

  // Search for BaZi day master context
  if (profile.dayMaster) {
    searches.push(
      searchKnowledge(`BaZi ${profile.dayMaster} day master`, {
        type: 'bazi',
        limit: 3
      }).then(r => { results.bazi = r; })
    );
  }

  // Search for Big 5 extreme traits
  if (profile.big5) {
    const traitNames = {
      o: 'openness',
      c: 'conscientiousness',
      e: 'extraversion',
      a: 'agreeableness',
      n: 'neuroticism'
    };

    for (const [key, score] of Object.entries(profile.big5)) {
      if (score >= 75) {
        searches.push(
          searchKnowledge(`High ${traitNames[key]} personality`, {
            type: 'big5',
            limit: 2
          }).then(r => { results.big5.push(...r); })
        );
      } else if (score <= 25) {
        searches.push(
          searchKnowledge(`Low ${traitNames[key]} personality`, {
            type: 'big5',
            limit: 2
          }).then(r => { results.big5.push(...r); })
        );
      }
    }
  }

  // General query search if provided
  if (query) {
    searches.push(
      searchKnowledge(query, { limit: 3 }).then(r => { results.general = r; })
    );
  }

  await Promise.all(searches);

  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// IN-MEMORY FALLBACK SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

// Cache for in-memory fallback
let cachedEmbeddings = null;
let cacheExpiry = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Load embeddings into memory for fallback search
 */
async function loadEmbeddingsCache() {
  if (cachedEmbeddings && Date.now() < cacheExpiry) {
    return cachedEmbeddings;
  }

  console.log('[VectorSearch] Loading embeddings cache...');

  const snapshot = await db.collection(COLLECTION).get();
  cachedEmbeddings = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.embedding) {
      cachedEmbeddings.push({
        id: doc.id,
        type: data.type,
        subtype: data.subtype,
        key: data.key,
        title: data.title,
        searchableText: data.searchableText,
        metadata: data.metadata,
        lunaGuidance: data.lunaGuidance,
        embedding: data.embedding.toArray ? data.embedding.toArray() : data.embedding
      });
    }
  });

  cacheExpiry = Date.now() + CACHE_TTL;
  console.log(`[VectorSearch] Cached ${cachedEmbeddings.length} embeddings`);

  return cachedEmbeddings;
}

/**
 * In-memory vector search (fallback when Firestore ANN fails)
 */
async function searchInMemory(query, options = {}) {
  const { limit = 5, type = null, minSimilarity = 0.5 } = options;

  console.log('[VectorSearch] Using in-memory fallback search');

  // Embed query
  const queryEmbedding = await embedText(query);
  if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
    return [];
  }

  // Load cache
  const embeddings = await loadEmbeddingsCache();

  // Calculate similarities
  const results = embeddings
    .filter(doc => !type || doc.type === type)
    .map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding)
    }))
    .filter(doc => doc.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  // Remove embedding from results
  return results.map(({ embedding, ...rest }) => rest);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  searchKnowledge,
  searchWithTimeout,
  searchForProfile,
  searchInMemory,
  loadEmbeddingsCache
};
