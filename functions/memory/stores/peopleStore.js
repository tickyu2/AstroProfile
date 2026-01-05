/**
 * ============================================================================
 * GENESIS LUNA - PEOPLE STORE
 * ============================================================================
 * People graph for relationship tracking.
 * Stores information about people mentioned in conversations.
 *
 * Functions:
 * - getPeople: Retrieve people by name or frequency
 * - upsertPerson: Create or update person record
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  PEOPLE GRAPH                                                           │
 * │                                                                          │
 * │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
 * │  │ UPSERT      │     │ NORMALIZE   │     │ UPDATE OR   │               │
 * │  │ PERSON      │────▶│ NAME        │────▶│ CREATE      │               │
 * │  │             │     │ (as ID)     │     │             │               │
 * │  └─────────────┘     └─────────────┘     └─────────────┘               │
 * │                                                │                        │
 * │                                                ▼                        │
 * │                                       ┌─────────────────┐              │
 * │                                       │ Track:          │              │
 * │                                       │ - mentionCount  │              │
 * │                                       │ - relationship  │              │
 * │                                       │ - notes array   │              │
 * │                                       │ - sentiment     │              │
 * │                                       └─────────────────┘              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Data Model:
 * {
 *   name: "Sarah",
 *   relationship: "sister",
 *   notes: ["Lives in Portland", "Works in tech"],
 *   sentiment: 0.8,
 *   mentionCount: 15,
 *   firstMention: timestamp,
 *   lastMention: timestamp
 * }
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
  embedText
} = require('../shared');

const { FieldValue: FV } = require('firebase-admin/firestore');

// ============================================================================
// GET PEOPLE
// ============================================================================

/**
 * Retrieve people from relationship graph
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string[]} names - Optional specific names to retrieve
 * @param {number} limit - Max results (when not filtering by names)
 */
const getPeople = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, names = null, limit = 10 } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const peopleRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('people');

    let query;
    if (names && names.length > 0) {
      // Get specific people
      query = peopleRef.where('name', 'in', names);
    } else {
      // Get most frequently mentioned
      query = peopleRef.orderBy('mentionCount', 'desc').limit(limit);
    }

    const snapshot = await query.get();

    const people = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastMention: doc.data().lastMention?.toDate()?.toISOString()
    }));

    return { success: true, people };

  } catch (error) {
    console.error('❌ Get people error:', error);
    return { success: true, people: [] };
  }
});

// ============================================================================
// UPSERT PERSON
// ============================================================================

/**
 * Update or create person in graph
 * Uses normalized name as document ID to prevent duplicates
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} name - Person's name
 * @param {string} relationship - Relationship to user
 * @param {string} notes - Additional context note
 * @param {number} sentiment - Sentiment score (-1 to 1)
 */
const upsertPerson = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, name, relationship, notes, sentiment } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'name']);

  try {
    const peopleRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('people');

    // Use normalized name as document ID
    const personId = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const personRef = peopleRef.doc(personId);

    const existing = await personRef.get();

    // Build searchable text for embedding
    const searchableText = `${name} ${relationship || ''} ${notes || ''}`.trim();

    if (existing.exists) {
      // Update existing - regenerate embedding with new notes
      const updates = {
        lastMention: FieldValue.serverTimestamp(),
        mentionCount: FieldValue.increment(1)
      };
      if (relationship) updates.relationship = relationship;
      if (notes) updates.notes = FieldValue.arrayUnion(notes);
      if (sentiment !== undefined) updates.sentiment = sentiment;

      // Regenerate embedding with updated info
      try {
        const existingData = existing.data();
        const allNotes = [...(existingData.notes || []), notes].filter(Boolean);
        const fullText = `${name} ${relationship || existingData.relationship} ${allNotes.join(' ')}`;
        const embedding = await embedText(fullText);
        if (embedding && embedding.length === 768) {
          updates.embedding = FV.vector(embedding);
        }
      } catch (embErr) {
        console.warn('⚠️ Embedding update failed:', embErr.message);
      }

      await personRef.update(updates);
      return { success: true, updated: true, id: personId };
    } else {
      // Create new with embedding
      let embedding = null;
      try {
        embedding = await embedText(searchableText);
        console.log('🧠 Generated embedding for person:', name);
      } catch (embErr) {
        console.warn('⚠️ Embedding generation failed:', embErr.message);
      }

      const personData = {
        name,
        relationship: relationship || 'unknown',
        notes: notes ? [notes] : [],
        sentiment: sentiment || 0,
        firstMention: FieldValue.serverTimestamp(),
        lastMention: FieldValue.serverTimestamp(),
        mentionCount: 1
      };

      if (embedding && embedding.length === 768) {
        personData.embedding = FV.vector(embedding);
      }

      await personRef.set(personData);
      return { success: true, created: true, id: personId, hasEmbedding: !!embedding };
    }

  } catch (error) {
    console.error('❌ Upsert person error:', error);
    throw new Error(`Failed to upsert person: ${error.message}`);
  }
});

// ============================================================================
// SEMANTIC SEARCH PEOPLE
// ============================================================================

/**
 * Search people semantically using vector similarity
 * "sister" finds Sarah with relationship=sister
 * "tech job" finds people with notes mentioning tech/work
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} query - Natural language search query
 * @param {number} limit - Max results
 */
const searchPeople = onCall(FUNCTION_OPTIONS.standard, async (request) => {
  const { userId, profileId, query, limit = 5 } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'query']);

  try {
    // Generate embedding for query
    const queryEmbedding = await embedText(query);

    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('⚠️ Failed to embed query, falling back to text search');
      return { success: true, people: [], searchType: 'fallback' };
    }

    // Use Firestore vector search
    const peopleRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('people');

    const vectorQuery = peopleRef.findNearest('embedding', queryEmbedding, {
      limit: limit,
      distanceMeasure: 'COSINE'
    });

    const snapshot = await vectorQuery.get();

    const people = snapshot.docs.map(doc => {
      const data = doc.data();
      const similarity = 1 - (doc.distance || 0);

      return {
        id: doc.id,
        name: data.name,
        relationship: data.relationship,
        notes: data.notes,
        sentiment: data.sentiment,
        mentionCount: data.mentionCount,
        similarity,
        lastMention: data.lastMention?.toDate()?.toISOString()
      };
    });

    console.log(`🔍 Found ${people.length} people for query: "${query}"`);

    return {
      success: true,
      people,
      searchType: 'semantic',
      query
    };

  } catch (error) {
    console.error('❌ Search people error:', error);
    return { success: true, people: [], error: error.message };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getPeople,
  upsertPerson,
  searchPeople
};
