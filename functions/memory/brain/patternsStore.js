/**
 * ============================================================================
 * GENESIS LUNA - PATTERNS STORE (Luna's Brain)
 * ============================================================================
 * Luna's learned patterns - what works and doesn't work with this user.
 *
 * Functions:
 * - storePattern: Save a learned communication pattern
 * - getPatterns: Retrieve patterns by category/effectiveness
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  PATTERN LEARNING                                                       │
 * │                                                                          │
 * │  ┌─────────────────┐                                                     │
 * │  │ JOURNAL         │                                                     │
 * │  │ ANALYSIS        │                                                     │
 * │  └────────┬────────┘                                                     │
 * │           │                                                               │
 * │           ▼                                                               │
 * │  ┌─────────────────┐     ┌─────────────────┐                             │
 * │  │ EXTRACT         │     │ STORE/REINFORCE │                             │
 * │  │ PATTERNS        │────▶│ PATTERN         │                             │
 * │  │                 │     │                 │                             │
 * │  └─────────────────┘     └─────────────────┘                             │
 * │                                                                          │
 * │  Pattern Types:                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │ POSITIVE: "Deep questions about meaning work well"                  ││
 * │  │ NEGATIVE: "Avoid asking about work stress directly"                 ││
 * │  │ NEUTRAL:  "Morning conversations tend to be shorter"                ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  Reinforcement:                                                          │
 * │  - Each confirmation increases confidence                                │
 * │  - Patterns with high confirmations are most reliable                   │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Path: users/{userId}/memory/{profileId}/soulPartner/patterns/learned/{patternId}
 *
 * Categories:
 * - communication: How to speak
 * - topics: What to discuss
 * - timing: When/how long
 * - emotional: How to handle feelings
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  embedText,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

const { FieldValue: FV } = require('firebase-admin/firestore');

// ============================================================================
// STORE PATTERN
// ============================================================================

/**
 * Store a pattern that Luna learned about what works with this user
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} pattern - The pattern description
 * @param {string} category - Pattern category
 * @param {string} effectiveness - positive, negative, or neutral
 * @param {string} context - When this pattern applies
 */
const storePattern = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, pattern, category, effectiveness, context } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'pattern']);

  try {
    const patternsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('patterns')
      .collection('learned');

    // Create pattern ID from content
    const patternId = pattern.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);

    const existingPattern = await patternsRef.doc(patternId).get();

    // Build searchable text for embedding
    const searchableText = `${pattern} ${category || ''} ${context || ''}`.trim();

    if (existingPattern.exists) {
      // Reinforce existing pattern
      await patternsRef.doc(patternId).update({
        confirmations: FieldValue.increment(1),
        effectiveness: effectiveness || existingPattern.data().effectiveness,
        lastConfirmed: FieldValue.serverTimestamp()
      });
      console.log('📝 Pattern reinforced:', pattern.slice(0, 40));
      return { success: true, reinforced: true, id: patternId };
    } else {
      // Generate embedding for new pattern
      let embedding = null;
      try {
        embedding = await embedText(searchableText);
        console.log('🧠 Generated embedding for pattern');
      } catch (embErr) {
        console.warn('⚠️ Pattern embedding failed:', embErr.message);
      }

      // Store new pattern with embedding
      const patternData = {
        pattern,
        category: category || 'communication',
        effectiveness: effectiveness || 'positive',
        context: context || null,
        confirmations: 1,
        createdAt: FieldValue.serverTimestamp(),
        lastConfirmed: FieldValue.serverTimestamp()
      };

      if (embedding && embedding.length === 768) {
        patternData.embedding = FV.vector(embedding);
      }

      await patternsRef.doc(patternId).set(patternData);
      console.log('📝 New pattern stored:', pattern.slice(0, 40));
      return { success: true, created: true, id: patternId, hasEmbedding: !!embedding };
    }

  } catch (error) {
    console.error('❌ Store pattern error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// GET PATTERNS
// ============================================================================

/**
 * Get Luna's learned patterns for a user
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} category - Optional category filter
 * @param {string} effectiveness - Optional effectiveness filter
 */
const getPatterns = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, category = null, effectiveness = null } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    let query = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('patterns')
      .collection('learned');

    if (category) {
      query = query.where('category', '==', category);
    }
    if (effectiveness) {
      query = query.where('effectiveness', '==', effectiveness);
    }

    const snapshot = await query
      .orderBy('confirmations', 'desc')
      .limit(20)
      .get();

    const patterns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { success: true, patterns };

  } catch (error) {
    console.error('❌ Get patterns error:', error);
    return { success: true, patterns: [] };
  }
});

// ============================================================================
// SEMANTIC SEARCH PATTERNS
// ============================================================================

/**
 * Search Luna's learned patterns semantically
 * "emotional support" finds patterns about handling emotions
 * "morning routine" finds timing-related patterns
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} query - Natural language search query
 * @param {number} limit - Max results
 */
const searchPatterns = onCall(FUNCTION_OPTIONS.standard, async (request) => {
  const { userId, profileId, query, limit = 5 } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'query']);

  try {
    // Generate embedding for query
    const queryEmbedding = await embedText(query);

    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('⚠️ Failed to embed query, falling back to text search');
      return { success: true, patterns: [], searchType: 'fallback' };
    }

    // Use Firestore vector search
    const patternsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('patterns')
      .collection('learned');

    const vectorQuery = patternsRef.findNearest('embedding', queryEmbedding, {
      limit: limit,
      distanceMeasure: 'COSINE'
    });

    const snapshot = await vectorQuery.get();

    const patterns = snapshot.docs.map(doc => {
      const data = doc.data();
      const similarity = 1 - (doc.distance || 0);

      return {
        id: doc.id,
        pattern: data.pattern,
        category: data.category,
        effectiveness: data.effectiveness,
        context: data.context,
        confirmations: data.confirmations,
        similarity
      };
    });

    console.log(`🔍 Found ${patterns.length} patterns for query: "${query}"`);

    return {
      success: true,
      patterns,
      searchType: 'semantic',
      query
    };

  } catch (error) {
    console.error('❌ Search patterns error:', error);
    return { success: true, patterns: [], error: error.message };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  storePattern,
  getPatterns,
  searchPatterns
};
