/**
 * Brain 1B Service - User Facts Short-Term Memory
 *
 * Firebase operations for storing and retrieving facts
 * extracted in real-time from Brain 3 (text) and Brain 5 (audio).
 *
 * Brain 1B is the staging area before facts are validated
 * and promoted to Brain 2 (LTM) during nightly consolidation.
 *
 * Part of GENESIS 8-Brain Memory Architecture v3.0
 * Created: January 5, 2026
 * Updated: January 5, 2026 - Added vector embeddings (Gemini 768-dim)
 */

const admin = require('firebase-admin');
const { extractFacts, consolidateFacts, shouldPromoteToBrain2 } = require('./factExtractor');

// Import embeddings for vector storage
let embeddings;
try {
  embeddings = require('../llm/embeddings');
} catch (e) {
  console.warn('[Brain1B] embeddings module not available:', e.message);
  embeddings = null;
}

// ============================================
// EMBEDDING HELPERS
// ============================================

/**
 * Generate embedding for a fact
 * Combines category, name, value, and context for rich semantic representation
 */
async function generateFactEmbedding(fact) {
  if (!embeddings || !embeddings.embedText) {
    return null;
  }

  try {
    // Build rich text representation of the fact
    const parts = [];

    if (fact.category) parts.push(`Category: ${fact.category}`);
    if (fact.name) parts.push(`Name: ${fact.name}`);
    if (fact.value) parts.push(`Value: ${fact.value}`);
    if (fact.type) parts.push(`Type: ${fact.type}`);
    if (fact.context) parts.push(`Context: ${fact.context}`);
    if (fact.sentiment) parts.push(`Sentiment: ${fact.sentiment}`);

    const text = parts.join('. ');

    if (text.length < 5) {
      return null; // Too short to embed meaningfully
    }

    const embedding = await embeddings.embedText(text);
    return embedding;
  } catch (error) {
    console.error('[Brain1B] Embedding generation error:', error.message);
    return null;
  }
}

// ============================================
// FIREBASE REFERENCES
// ============================================

/**
 * Get Firestore reference
 */
function getDb() {
  return admin.firestore();
}

/**
 * Get Brain 1B collection reference for a user
 */
function getBrain1BRef(userId) {
  return getDb().collection('users').doc(userId).collection('brain1_facts_stm');
}

/**
 * Get Brain 2 collection reference for a user
 */
function getBrain2Ref(userId) {
  return getDb().collection('users').doc(userId).collection('brain2_facts_ltm');
}

// ============================================
// REAL-TIME FACT STORAGE
// ============================================

/**
 * Process a message and extract facts to Brain 1B
 * Called on every incoming message from Brain 3 or Brain 5
 *
 * @param {string} userId - User ID
 * @param {string} text - Message text
 * @param {string} source - 'brain3' or 'brain5'
 * @param {Object} metadata - Additional context
 * @returns {Object} Extraction result
 */
async function processMessage(userId, text, source = 'brain3', metadata = {}) {
  // Extract facts from message
  const result = extractFacts(text, source, {
    userId,
    timestamp: metadata.timestamp || new Date().toISOString(),
    ...metadata
  });

  // If no facts extracted, return early
  if (!result.extracted || result.facts.length === 0) {
    return {
      processed: true,
      extracted: false,
      reason: result.reason || 'no_facts_found'
    };
  }

  // Store each fact in Brain 1B (with optional embeddings)
  const brain1BRef = getBrain1BRef(userId);
  const batch = getDb().batch();
  const storedFacts = [];

  for (const fact of result.facts) {
    // Check if similar fact already exists (by name or value)
    const existingFact = await findSimilarFact(userId, fact);

    // Generate embedding for the fact (async, but don't block if it fails)
    let embedding = null;
    try {
      embedding = await generateFactEmbedding(fact);
      if (embedding) {
        console.log(`[Brain1B] Generated 768-dim embedding for fact: ${fact.name || fact.value || fact.type}`);
      }
    } catch (embError) {
      console.warn('[Brain1B] Embedding skipped:', embError.message);
    }

    if (existingFact) {
      // Update existing fact (preserve existing embedding if new one fails)
      const updatedFact = mergeFacts(existingFact, fact);
      if (embedding) {
        updatedFact.embedding = embedding;
        updatedFact.embeddingUpdatedAt = new Date().toISOString();
      }
      batch.update(brain1BRef.doc(existingFact.id), updatedFact);
      storedFacts.push({ ...updatedFact, action: 'updated', hasEmbedding: !!embedding || !!existingFact.embedding });
    } else {
      // Create new fact with embedding
      const factData = {
        ...fact,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (embedding) {
        factData.embedding = embedding;
        factData.embeddingCreatedAt = new Date().toISOString();
      }

      const factRef = brain1BRef.doc(fact.id);
      batch.set(factRef, factData);
      storedFacts.push({ ...fact, action: 'created', hasEmbedding: !!embedding });
    }
  }

  // Commit batch
  await batch.commit();

  return {
    processed: true,
    extracted: true,
    factCount: storedFacts.length,
    facts: storedFacts,
    source: source
  };
}

/**
 * Find a similar existing fact in Brain 1B
 */
async function findSimilarFact(userId, newFact) {
  const brain1BRef = getBrain1BRef(userId);

  // For relationships, match by name
  if (newFact.category === 'relationship' && newFact.name) {
    const snapshot = await brain1BRef
      .where('category', '==', 'relationship')
      .where('name', '==', newFact.name)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
  }

  // For life structure, match by type and value
  if (newFact.category === 'life_structure') {
    const snapshot = await brain1BRef
      .where('category', '==', 'life_structure')
      .where('type', '==', newFact.type)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
  }

  return null;
}

/**
 * Merge a new fact with an existing one
 */
function mergeFacts(existing, newFact) {
  return {
    ...existing,
    mentions: (existing.mentions || 1) + 1,
    lastMentioned: newFact.timestamp,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    // Update sentiment if new fact has one
    sentiment: newFact.sentiment || existing.sentiment,
    // Keep latest action
    action: newFact.action || existing.action,
    // Append to contexts (keep last 10)
    contexts: [
      ...(existing.contexts || []).slice(-9),
      {
        text: newFact.context,
        timestamp: newFact.timestamp,
        source: newFact.source
      }
    ],
    // Boost confidence with each mention
    confidence: Math.min(0.95, (existing.confidence || 0.7) + 0.05)
  };
}

// ============================================
// RETRIEVAL FUNCTIONS
// ============================================

/**
 * Get all facts from Brain 1B for a user
 */
async function getAllFacts(userId) {
  const snapshot = await getBrain1BRef(userId).orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get facts by category
 */
async function getFactsByCategory(userId, category) {
  const snapshot = await getBrain1BRef(userId)
    .where('category', '==', category)
    .orderBy('updatedAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get facts about a specific person
 */
async function getFactsAboutPerson(userId, personName) {
  const snapshot = await getBrain1BRef(userId)
    .where('category', '==', 'relationship')
    .where('name', '==', personName)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get today's facts (for mid-conversation reference)
 */
async function getTodaysFacts(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const snapshot = await getBrain1BRef(userId)
    .where('createdAt', '>=', today)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Search facts by keyword
 */
async function searchFacts(userId, keyword) {
  // Firestore doesn't support full-text search, so we get all and filter
  const allFacts = await getAllFacts(userId);
  const lower = keyword.toLowerCase();

  return allFacts.filter(fact => {
    const searchable = [
      fact.name,
      fact.value,
      fact.context,
      fact.type
    ].filter(Boolean).join(' ').toLowerCase();

    return searchable.includes(lower);
  });
}

// ============================================
// SEMANTIC SEARCH (Vector-based)
// ============================================

/**
 * Search facts semantically using vector embeddings
 * Works across both Brain 1B (STM) and Brain 2 (LTM)
 *
 * @param {string} userId - User ID
 * @param {string} queryText - Natural language query
 * @param {Object} options - Search options
 * @param {number} options.limit - Max results (default: 10)
 * @param {number} options.minSimilarity - Min cosine similarity threshold (default: 0.5)
 * @param {boolean} options.includeBrain1B - Include STM facts (default: true)
 * @param {boolean} options.includeBrain2 - Include LTM facts (default: true)
 * @returns {Promise<Array>} Facts sorted by semantic similarity
 */
async function searchFactsSemantically(userId, queryText, options = {}) {
  const {
    limit = 10,
    minSimilarity = 0.5,
    includeBrain1B = true,
    includeBrain2 = true
  } = options;

  // Check if embeddings module is available
  if (!embeddings || !embeddings.embedText || !embeddings.cosineSimilarity) {
    console.warn('[Brain1B] Semantic search unavailable - embeddings module not loaded');
    // Fallback to keyword search
    return searchFacts(userId, queryText);
  }

  try {
    // Generate embedding for query
    const queryEmbedding = await embeddings.embedText(queryText);
    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('[Brain1B] Failed to generate query embedding, falling back to keyword search');
      return searchFacts(userId, queryText);
    }

    const allFacts = [];

    // Get Brain 1B facts
    if (includeBrain1B) {
      const brain1BFacts = await getAllFacts(userId);
      for (const fact of brain1BFacts) {
        if (fact.embedding && Array.isArray(fact.embedding)) {
          allFacts.push({
            ...fact,
            source: 'brain1B'
          });
        }
      }
    }

    // Get Brain 2 facts
    if (includeBrain2) {
      const brain2Facts = await getBrain2Facts(userId);
      for (const fact of brain2Facts) {
        if (fact.embedding && Array.isArray(fact.embedding)) {
          allFacts.push({
            ...fact,
            source: 'brain2'
          });
        }
      }
    }

    if (allFacts.length === 0) {
      console.log('[Brain1B] No facts with embeddings found, falling back to keyword search');
      return searchFacts(userId, queryText);
    }

    // Calculate similarity for each fact
    const scoredFacts = allFacts.map(fact => ({
      ...fact,
      similarity: embeddings.cosineSimilarity(queryEmbedding, fact.embedding)
    }));

    // Filter by minimum similarity and sort
    const results = scoredFacts
      .filter(f => f.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    console.log(`[Brain1B] Semantic search: ${results.length} results above ${minSimilarity} threshold`);

    return results;
  } catch (error) {
    console.error('[Brain1B] Semantic search error:', error.message);
    // Fallback to keyword search
    return searchFacts(userId, queryText);
  }
}

/**
 * Find related facts to a given fact using vector similarity
 * Useful for context building and fact deduplication
 *
 * @param {string} userId - User ID
 * @param {Object} fact - Fact to find relations for
 * @param {number} limit - Max related facts to return
 * @returns {Promise<Array>} Related facts sorted by similarity
 */
async function findRelatedFacts(userId, fact, limit = 5) {
  if (!fact.embedding || !embeddings || !embeddings.cosineSimilarity) {
    return [];
  }

  try {
    // Get all facts from both brains
    const [brain1BFacts, brain2Facts] = await Promise.all([
      getAllFacts(userId),
      getBrain2Facts(userId)
    ]);

    const allFacts = [
      ...brain1BFacts.map(f => ({ ...f, source: 'brain1B' })),
      ...brain2Facts.map(f => ({ ...f, source: 'brain2' }))
    ];

    // Filter facts with embeddings and exclude the input fact
    const candidates = allFacts.filter(f =>
      f.id !== fact.id &&
      f.embedding &&
      Array.isArray(f.embedding)
    );

    // Score by similarity
    const scored = candidates.map(f => ({
      ...f,
      similarity: embeddings.cosineSimilarity(fact.embedding, f.embedding)
    }));

    return scored
      .filter(f => f.similarity > 0.6) // Higher threshold for "related"
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  } catch (error) {
    console.error('[Brain1B] findRelatedFacts error:', error.message);
    return [];
  }
}

/**
 * Check for duplicate facts using semantic similarity
 * Returns true if a semantically similar fact already exists
 *
 * @param {string} userId - User ID
 * @param {Object} newFact - Fact to check
 * @param {number} threshold - Similarity threshold (default: 0.85 = likely duplicate)
 * @returns {Promise<Object|null>} Existing similar fact or null
 */
async function checkSemanticDuplicate(userId, newFact, threshold = 0.85) {
  if (!embeddings || !embeddings.embedText || !embeddings.cosineSimilarity) {
    return null;
  }

  try {
    // Generate embedding for new fact
    const newEmbedding = await generateFactEmbedding(newFact);
    if (!newEmbedding) {
      return null;
    }

    // Get existing facts
    const existingFacts = await getAllFacts(userId);

    for (const existing of existingFacts) {
      if (existing.embedding && Array.isArray(existing.embedding)) {
        const similarity = embeddings.cosineSimilarity(newEmbedding, existing.embedding);
        if (similarity >= threshold) {
          console.log(`[Brain1B] Semantic duplicate found: ${similarity.toFixed(3)} similarity`);
          return existing;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('[Brain1B] checkSemanticDuplicate error:', error.message);
    return null;
  }
}

// ============================================
// CONSOLIDATION FUNCTIONS
// ============================================

/**
 * Run nightly consolidation for a user
 * Promotes qualifying facts from Brain 1B to Brain 2
 *
 * @param {string} userId - User ID
 * @returns {Object} Consolidation result
 */
async function runConsolidation(userId) {
  const brain1BRef = getBrain1BRef(userId);
  const brain2Ref = getBrain2Ref(userId);

  // Get all Brain 1B facts
  const brain1BFacts = await getAllFacts(userId);

  if (brain1BFacts.length === 0) {
    return {
      processed: 0,
      promoted: 0,
      decayed: 0,
      kept: 0
    };
  }

  const batch = getDb().batch();
  let promoted = 0;
  let decayed = 0;
  let kept = 0;

  // Group facts by entity (name for relationships, type for life_structure)
  const grouped = groupFactsByEntity(brain1BFacts);

  for (const [entityKey, facts] of Object.entries(grouped)) {
    // Consolidate facts about same entity
    const consolidated = consolidateFacts(facts);

    // Calculate days since last update
    const lastUpdate = facts.reduce((latest, f) => {
      const ts = f.updatedAt?.toDate?.() || new Date(f.timestamp);
      return ts > latest ? ts : latest;
    }, new Date(0));
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdate) / (1000 * 60 * 60 * 24));

    // Check if should promote to Brain 2
    const promotion = shouldPromoteToBrain2(consolidated, { daysSinceUpdate });

    if (promotion.shouldPromote) {
      // Promote to Brain 2
      const brain2DocId = generateBrain2Id(entityKey, consolidated.category);

      // Check if already exists in Brain 2
      const existingBrain2 = await brain2Ref.doc(brain2DocId).get();

      // Track embedding status
      const hasEmbedding = consolidated.embedding && Array.isArray(consolidated.embedding);

      if (existingBrain2.exists) {
        // Merge with existing Brain 2 entry
        const merged = mergeWithBrain2(existingBrain2.data(), consolidated);
        batch.update(brain2Ref.doc(brain2DocId), merged);
        if (hasEmbedding) {
          console.log(`[Brain1B→2] Updated Brain 2 fact with 768-dim embedding: ${entityKey}`);
        }
      } else {
        // Create new Brain 2 entry with embedding metadata
        const brain2Entry = {
          ...consolidated,
          promotedAt: admin.firestore.FieldValue.serverTimestamp(),
          promotionScore: promotion.score,
          promotionReason: promotion.reason
        };

        // Add embedding promotion metadata if embedding exists
        if (hasEmbedding) {
          brain2Entry.embeddingSource = brain2Entry.embeddingSource || 'brain1B_promotion';
          brain2Entry.embeddingPromotedAt = new Date().toISOString();
          console.log(`[Brain1B→2] Promoted to Brain 2 with 768-dim embedding: ${entityKey}`);
        }

        batch.set(brain2Ref.doc(brain2DocId), brain2Entry);
      }

      // Delete from Brain 1B (it's now in Brain 2)
      for (const fact of facts) {
        batch.delete(brain1BRef.doc(fact.id));
      }

      promoted++;
    } else if (daysSinceUpdate > 30 && promotion.score < 0.4) {
      // Decay old, low-value facts
      for (const fact of facts) {
        batch.delete(brain1BRef.doc(fact.id));
      }
      decayed++;
    } else {
      // Keep in Brain 1B, apply decay if old
      if (daysSinceUpdate > 7) {
        const decayFactor = 1 - (daysSinceUpdate - 7) * 0.02;
        for (const fact of facts) {
          batch.update(brain1BRef.doc(fact.id), {
            confidence: Math.max(0.3, (fact.confidence || 0.7) * decayFactor)
          });
        }
      }
      kept++;
    }
  }

  // Commit all changes
  await batch.commit();

  return {
    processed: brain1BFacts.length,
    promoted,
    decayed,
    kept,
    timestamp: new Date().toISOString()
  };
}

/**
 * Group facts by entity for consolidation
 */
function groupFactsByEntity(facts) {
  const grouped = {};

  for (const fact of facts) {
    let key;
    if (fact.category === 'relationship' && fact.name) {
      key = `relationship_${fact.name.toLowerCase()}`;
    } else if (fact.category === 'life_structure') {
      key = `life_${fact.type}_${(fact.value || '').toLowerCase().slice(0, 20)}`;
    } else {
      key = `other_${fact.id}`;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(fact);
  }

  return grouped;
}

/**
 * Generate Brain 2 document ID
 */
function generateBrain2Id(entityKey, category) {
  return `${category}_${entityKey.replace(/[^a-z0-9_]/gi, '_')}`;
}

/**
 * Merge Brain 1B consolidated fact with existing Brain 2 entry
 * Handles embedding transfer and update
 */
function mergeWithBrain2(existing, incoming) {
  const merged = {
    ...existing,
    mentions: (existing.mentions || 0) + (incoming.mentions || 1),
    confidence: Math.min(0.98, Math.max(existing.confidence || 0.7, incoming.confidence || 0.7) + 0.05),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    // Merge sentiment history
    sentimentHistory: mergeSentimentHistory(existing.sentimentHistory, incoming.sentimentHistory),
    // Append contexts (keep last 20)
    contexts: [
      ...(existing.contexts || []).slice(-15),
      ...(incoming.contexts || []).slice(-5)
    ],
    // Keep latest values
    sentiment: incoming.sentiment || existing.sentiment,
    action: incoming.action || existing.action
  };

  // Handle embedding merge - prefer incoming (more recent) if available
  if (incoming.embedding && Array.isArray(incoming.embedding)) {
    merged.embedding = incoming.embedding;
    merged.embeddingUpdatedAt = new Date().toISOString();
    merged.embeddingSource = incoming.embeddingSource || 'brain1B_promotion';
  } else if (existing.embedding && Array.isArray(existing.embedding)) {
    // Keep existing embedding
    merged.embedding = existing.embedding;
    merged.embeddingUpdatedAt = existing.embeddingUpdatedAt;
    merged.embeddingSource = existing.embeddingSource;
  }

  return merged;
}

/**
 * Merge sentiment histories
 */
function mergeSentimentHistory(existing, incoming) {
  const result = { ...existing };
  if (incoming) {
    for (const [key, value] of Object.entries(incoming)) {
      result[key] = (result[key] || 0) + value;
    }
  }
  return result;
}

// ============================================
// BRAIN 2 RETRIEVAL
// ============================================

/**
 * Get all validated facts from Brain 2
 */
async function getBrain2Facts(userId) {
  const snapshot = await getBrain2Ref(userId).orderBy('confidence', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get relationship facts from Brain 2
 */
async function getBrain2Relationships(userId) {
  const snapshot = await getBrain2Ref(userId)
    .where('category', '==', 'relationship')
    .orderBy('mentions', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get life structure facts from Brain 2
 */
async function getBrain2LifeStructure(userId) {
  const snapshot = await getBrain2Ref(userId)
    .where('category', '==', 'life_structure')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Build a user profile summary from Brain 2
 * Useful for system prompts
 */
async function buildUserProfileSummary(userId) {
  const relationships = await getBrain2Relationships(userId);
  const lifeStructure = await getBrain2LifeStructure(userId);

  const summary = {
    relationships: {},
    education: null,
    employment: null,
    residence: null,
    family: {},
    health: [],
    interests: []
  };

  // Process relationships
  for (const rel of relationships) {
    summary.relationships[rel.name] = {
      role: rel.type,
      sentiment: rel.sentiment,
      mentions: rel.mentions
    };
  }

  // Process life structure
  for (const fact of lifeStructure) {
    switch (fact.type) {
      case 'education':
        summary.education = fact.value;
        break;
      case 'employment':
      case 'profession':
        summary.employment = fact.value;
        break;
      case 'residence':
      case 'origin':
        summary.residence = fact.value;
        break;
      case 'family':
      case 'partner':
      case 'parent':
        summary.family[fact.type] = fact.details || fact.value;
        break;
      case 'health_allergy':
      case 'health_condition':
      case 'health_diagnosis':
        summary.health.push({
          type: fact.type,
          value: fact.value
        });
        break;
      case 'passion':
      case 'learning':
        summary.interests.push(fact.value);
        break;
    }
  }

  return summary;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Real-time processing
  processMessage,

  // Brain 1B retrieval
  getAllFacts,
  getFactsByCategory,
  getFactsAboutPerson,
  getTodaysFacts,
  searchFacts,

  // Semantic search (vector-based)
  searchFactsSemantically,
  findRelatedFacts,
  checkSemanticDuplicate,
  generateFactEmbedding,

  // Consolidation
  runConsolidation,

  // Brain 2 retrieval
  getBrain2Facts,
  getBrain2Relationships,
  getBrain2LifeStructure,
  buildUserProfileSummary,

  // Utilities
  findSimilarFact,
  mergeFacts,
  groupFactsByEntity
};
