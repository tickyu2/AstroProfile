/**
 * ============================================================================
 * GENESIS LUNA - MEMORY STORE
 * ============================================================================
 * Core memory storage and retrieval with vector embeddings.
 *
 * Functions:
 * - storeMemory: Store with automatic embedding generation
 * - retrieveMemories: Vector similarity search with scoring
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  USER MESSAGE                                                           │
 * │       │                                                                  │
 * │       ▼                                                                  │
 * │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
 * │  │ STORE       │     │ EMBED       │     │ FIRESTORE   │               │
 * │  │ MEMORY      │────▶│ (Gemini)    │────▶│ VECTOR      │               │
 * │  │             │     │             │     │ STORE       │               │
 * │  └─────────────┘     └─────────────┘     └─────────────┘               │
 * │                                                                          │
 * │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
 * │  │ RETRIEVE    │     │ VECTOR      │     │ SIGMOID     │               │
 * │  │ MEMORIES    │────▶│ SEARCH      │────▶│ SCORING     │────▶ RESULTS │
 * │  │             │     │ (findNearest│     │ (recency+   │               │
 * │  └─────────────┘     └─────────────┘     │ importance) │               │
 * │                                          └─────────────┘               │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  admin,
  db,
  onCall,
  FieldValue,
  embedText,
  calculateRetrievalScore,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// STORE MEMORY
// ============================================================================

/**
 * Store a memory with automatic embedding generation
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} content - Memory content
 * @param {string} type - Memory type (episodic, semantic, procedural)
 * @param {number} importance - Importance score (0-1)
 * @param {Object} soul - Soul section for constitutional tagging
 */
const storeMemory = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const {
    userId,
    profileId,
    content,
    type = 'episodic',
    importance = 0.5,
    emotion,
    people,
    soul,
    keywords
  } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'content']);

  try {
    console.log('📝 Storing memory for:', userId, profileId);

    // 1. Generate embedding using centralized LLM client
    const embedding = await embedText(content);

    // 2. Build memory document
    const memoryDoc = {
      content,
      type,
      importance,
      emotion: emotion || null,
      people: people || [],
      keywords: keywords || [],
      embedding: FieldValue.vector(embedding),
      createdAt: FieldValue.serverTimestamp(),
      accessCount: 0,
      lastAccessed: null
    };

    // Add soul section if provided
    if (soul) {
      memoryDoc.soul = {
        emotionBefore: soul.emotionBefore || null,
        emotionAfter: soul.emotionAfter || null,
        emotionIntensity: soul.emotionIntensity || 0,
        vulnerability: soul.vulnerability || 0,
        gratitude: soul.gratitude || false,
        impact: soul.impact || null,
        triggerWords: soul.triggerWords || []
      };
    }

    // 3. Store in Firestore
    const memoryRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories');

    const docRef = await memoryRef.add(memoryDoc);

    console.log('✅ Memory stored:', docRef.id);

    return {
      success: true,
      id: docRef.id,
      embeddingDimensions: embedding.length
    };

  } catch (error) {
    console.error('❌ Store memory error:', error);
    throw new Error(`Failed to store memory: ${error.message}`);
  }
});

// ============================================================================
// RETRIEVE MEMORIES
// ============================================================================

/**
 * Retrieve memories using vector similarity search
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @param {number} recencyDays - Only return memories from last N days
 * @param {number} minImportance - Minimum importance threshold
 */
const retrieveMemories = onCall(FUNCTION_OPTIONS.heavy, async (request) => {
  const {
    userId,
    profileId,
    query,
    limit = 5,
    recencyDays = 90,
    minImportance = 0.3
  } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'query']);

  try {
    console.log('🔍 Retrieving memories for:', userId, profileId);

    // 1. Generate query embedding
    const queryEmbedding = await embedText(query);

    // 2. Perform vector similarity search
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories');

    const vectorQuery = memoriesRef.findNearest({
      vectorField: 'embedding',
      queryVector: queryEmbedding,
      distanceMeasure: 'COSINE',
      limit: limit * 2  // Fetch extra for filtering
    });

    const snapshot = await vectorQuery.get();

    // 3. Filter and score with sigmoid decay
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - recencyDays);

    const memories = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() || new Date();

      // Skip old memories (unless core)
      if (createdAt < cutoffDate && !data.coreMemory) continue;

      // Skip low importance
      if ((data.importance || 0.5) < minImportance) continue;

      // Calculate score using unified scoring utils
      const scoreResult = calculateRetrievalScore({
        similarity: 1 - (doc.distance || 0),
        distance: doc.distance,
        created_at: createdAt.getTime(),
        importance: data.importance || 0.5,
        access_count: data.accessCount || 0,
        is_core: data.coreMemory || false
      });

      memories.push({
        id: doc.id,
        content: data.content,
        type: data.type,
        importance: data.importance,
        emotion: data.emotion,
        people: data.people,
        distance: doc.distance || 0,
        score: scoreResult.score,
        hoursOld: (Date.now() - createdAt.getTime()) / (1000 * 60 * 60),
        createdAt: createdAt.toISOString()
      });
    }

    // 4. Sort by score and limit
    memories.sort((a, b) => b.score - a.score);
    const topMemories = memories.slice(0, limit);

    // 5. Update access counts (non-blocking)
    topMemories.forEach(mem => {
      memoriesRef.doc(mem.id).update({
        accessCount: FieldValue.increment(1),
        lastAccessed: FieldValue.serverTimestamp()
      }).catch(() => {});
    });

    console.log('✅ Retrieved', topMemories.length, 'memories');

    return {
      success: true,
      memories: topMemories,
      queryEmbeddingDimensions: queryEmbedding.length
    };

  } catch (error) {
    console.error('❌ Retrieve memories error:', error);

    // Fallback if vector search unavailable
    if (error.message?.includes('findNearest') || error.code === 9) {
      console.log('⚠️ Vector search not available, using fallback');
      return { success: true, memories: [], fallback: true };
    }

    throw new Error(`Failed to retrieve memories: ${error.message}`);
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  storeMemory,
  retrieveMemories
};
