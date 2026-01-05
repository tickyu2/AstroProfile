/**
 * ============================================================================
 * GENESIS LUNA - FACTS STORE
 * ============================================================================
 * Permanent facts storage with 2x retrieval weight.
 * Facts are high-confidence truths about the user that don't decay.
 *
 * Functions:
 * - getFacts: Retrieve facts by category with weight ordering
 * - storeFact: Store or confirm fact with duplicate detection
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  FACT STORAGE                                                           │
 * │       │                                                                  │
 * │       ▼                                                                  │
 * │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
 * │  │ STORE       │     │ DUPLICATE   │     │ UPDATE OR   │               │
 * │  │ FACT        │────▶│ CHECK       │────▶│ CREATE      │               │
 * │  │             │     │             │     │             │               │
 * │  └─────────────┘     └─────────────┘     └─────────────┘               │
 * │                            │                    │                       │
 * │                            ▼                    ▼                       │
 * │                    [SIMILAR FOUND]       [NEW FACT]                    │
 * │                    Increment confidence  Store with 2x weight          │
 * │                    Update lastConfirmed                                │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Categories:
 * - personal: Name, birthdate, identity
 * - preferences: Likes, dislikes, favorites
 * - relationships: Family, friends, connections
 * - career: Work, skills, education
 * - general: Miscellaneous facts
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  FUNCTION_OPTIONS,
  validateRequired,
  getUserMemoryPath,
  embedText,
  cosineSimilarity
} = require('../shared');

const { FieldValue: FV } = require('firebase-admin/firestore');

// ============================================================================
// GET FACTS
// ============================================================================

/**
 * Retrieve permanent facts for a user
 * Facts are weighted 2x in retrieval scoring
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max results
 * @param {string} category - Optional category filter
 */
const getFacts = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, limit = 10, category = null } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const factsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('facts');

    let query = factsRef
      .orderBy('weight', 'desc')
      .orderBy('lastConfirmed', 'desc')
      .limit(limit);

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();

    const facts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      lastConfirmed: doc.data().lastConfirmed?.toDate()?.toISOString()
    }));

    return { success: true, facts };

  } catch (error) {
    console.error('❌ Get facts error:', error);
    return { success: true, facts: [] };
  }
});

// ============================================================================
// STORE FACT
// ============================================================================

/**
 * Store or confirm a permanent fact
 * Includes duplicate detection to avoid storing same fact twice
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} fact - The fact content
 * @param {string} category - Fact category
 * @param {number} confidence - Confidence score (0-1)
 * @param {string} source - Source of fact (reflection, user, etc.)
 */
const storeFact = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, fact, category, confidence, source } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'fact']);

  try {
    const factsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('facts');

    // Check for existing similar fact
    const existingQuery = await factsRef
      .where('category', '==', category || 'general')
      .get();

    // Simple similarity check
    for (const doc of existingQuery.docs) {
      const existingFact = doc.data().fact.toLowerCase();
      const newFact = fact.toLowerCase();

      // If very similar, update confidence instead of creating new
      if (existingFact.includes(newFact) || newFact.includes(existingFact)) {
        await doc.ref.update({
          confidence: Math.min(1.0, (doc.data().confidence || 0.8) + 0.1),
          lastConfirmed: FieldValue.serverTimestamp(),
          confirmations: FieldValue.increment(1)
        });
        console.log('📝 Fact confirmed:', fact.slice(0, 50));
        return { success: true, updated: true, id: doc.id };
      }
    }

    // Generate embedding for semantic search
    let embedding = null;
    try {
      embedding = await embedText(fact);
      console.log('🧠 Generated embedding for fact');
    } catch (embErr) {
      console.warn('⚠️ Embedding generation failed, storing without:', embErr.message);
    }

    // Store new fact with 2x weight and embedding
    const factData = {
      fact,
      category: category || 'general',
      confidence: confidence || 0.8,
      weight: 2.0,  // Facts get 2x retrieval weight
      source: source || 'reflection',
      createdAt: FieldValue.serverTimestamp(),
      lastConfirmed: FieldValue.serverTimestamp(),
      confirmations: 1
    };

    // Add embedding if generated successfully
    if (embedding && embedding.length === 768) {
      factData.embedding = FV.vector(embedding);
    }

    const docRef = await factsRef.add(factData);

    console.log('📝 New fact stored:', fact.slice(0, 50));
    return { success: true, created: true, id: docRef.id, hasEmbedding: !!embedding };

  } catch (error) {
    console.error('❌ Store fact error:', error);
    throw new Error(`Failed to store fact: ${error.message}`);
  }
});

// ============================================================================
// SEMANTIC SEARCH FACTS
// ============================================================================

/**
 * Search facts semantically using vector similarity
 * "beach" finds "grew up near Mediterranean in Cyprus"
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} query - Natural language search query
 * @param {number} limit - Max results
 */
const searchFacts = onCall(FUNCTION_OPTIONS.standard, async (request) => {
  const { userId, profileId, query, limit = 5 } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'query']);

  try {
    // Generate embedding for query
    const queryEmbedding = await embedText(query);

    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('⚠️ Failed to embed query, falling back to text search');
      // Fallback to regular getFacts
      const factsRef = db
        .collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('facts');

      const snapshot = await factsRef.orderBy('weight', 'desc').limit(limit).get();
      return {
        success: true,
        facts: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
        searchType: 'fallback'
      };
    }

    // Use Firestore vector search (findNearest)
    const factsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('facts');

    const vectorQuery = factsRef.findNearest('embedding', queryEmbedding, {
      limit: limit,
      distanceMeasure: 'COSINE'
    });

    const snapshot = await vectorQuery.get();

    const facts = snapshot.docs.map(doc => {
      const data = doc.data();
      // Calculate similarity from distance (COSINE distance = 1 - similarity)
      const similarity = 1 - (doc.distance || 0);

      return {
        id: doc.id,
        fact: data.fact,
        category: data.category,
        confidence: data.confidence,
        weight: data.weight,
        similarity,
        createdAt: data.createdAt?.toDate()?.toISOString()
      };
    });

    console.log(`🔍 Found ${facts.length} facts for query: "${query.slice(0, 30)}..."`);

    return {
      success: true,
      facts,
      searchType: 'semantic',
      query
    };

  } catch (error) {
    console.error('❌ Search facts error:', error);

    // If vector index missing, fall back gracefully
    if (error.message?.includes('index')) {
      console.warn('⚠️ Vector index may be missing for facts collection');
    }

    return { success: true, facts: [], error: error.message };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getFacts,
  storeFact,
  searchFacts
};
