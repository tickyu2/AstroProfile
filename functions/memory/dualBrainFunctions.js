/**
 * Dual-Brain Memory Architecture for GENESIS SoulPartner
 *
 * Implementation of the complete dual-brain model:
 *
 * USER'S BRAIN:
 * - session_buffer (short-term): Raw session input, awaiting consolidation
 * - life_timeline (long-term): Organized by life chapters with embeddings
 * - chapters: Life chapter metadata (Childhood, Teen, Adult, etc.)
 *
 * SOULPARTNER'S BRAIN:
 * - session_observations (short-term): Luna's notes about current session
 * - interaction_timeline (long-term): Luna's long-term observations
 * - patterns: Detected behavioral patterns about user
 *
 * CONSOLIDATION:
 * - Sleep cycle: Nightly processing to move short-term to long-term
 * - Pattern detection: Identify recurring themes across sessions
 *
 * Part of GENESIS Phase 3 - Memory Architecture
 * Built by: Brother Claude Opus
 * December 19, 2024
 */

const { onCall } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Initialize Gemini
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate embeddings (with fallback)
async function generateEmbedding(text) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('⚠️ Embedding generation failed:', error.message);
    // Return null to indicate embedding unavailable
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LIFE CHAPTERS DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

const LIFE_CHAPTERS = {
  childhood: { name: 'Childhood', startAge: 0, endAge: 12 },
  teen: { name: 'Teen Years', startAge: 13, endAge: 19 },
  youngAdult: { name: 'Young Adult', startAge: 20, endAge: 29 },
  adult: { name: 'Adult', startAge: 30, endAge: 49 },
  midlife: { name: 'Midlife', startAge: 50, endAge: 64 },
  senior: { name: 'Senior', startAge: 65, endAge: null },
  timeless: { name: 'Timeless', startAge: null, endAge: null } // For memories without age context
};

// Determine chapter from age or context
function determineChapter(age = null, contextHints = null) {
  if (age !== null) {
    for (const [key, chapter] of Object.entries(LIFE_CHAPTERS)) {
      if (key === 'timeless') continue;
      if (chapter.startAge <= age && (chapter.endAge === null || age <= chapter.endAge)) {
        return key;
      }
    }
  }

  // Try to infer from context hints
  if (contextHints) {
    const hints = contextHints.toLowerCase();
    if (hints.includes('kid') || hints.includes('child') || hints.includes('elementary')) {
      return 'childhood';
    }
    if (hints.includes('teen') || hints.includes('high school') || hints.includes('middle school')) {
      return 'teen';
    }
    if (hints.includes('college') || hints.includes('university') || hints.includes('20s')) {
      return 'youngAdult';
    }
    if (hints.includes('retired') || hints.includes('grandkid')) {
      return 'senior';
    }
  }

  return 'timeless';
}

// ═══════════════════════════════════════════════════════════════════════════
// USER SHORT-TERM: SESSION BUFFER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Buffer user input for later consolidation
 * Called during conversation to capture raw input
 */
exports.bufferUserInput = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, sessionId, content, emotion, messageIndex } = request.data;

  if (!userId || !profileId || !sessionId || !content) {
    throw new Error('Missing required fields');
  }

  try {
    const bufferRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('session_buffer')
      .collection('entries');

    await bufferRef.add({
      content,
      emotion: emotion || null,
      sessionId,
      messageIndex: messageIndex || 0,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      consolidated: false
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Buffer user input error:', error);
    throw new Error(`Failed to buffer input: ${error.message}`);
  }
});

/**
 * Get session buffer for current session
 */
exports.getSessionBuffer = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, sessionId, limit = 50 } = request.data;

  if (!userId || !profileId || !sessionId) {
    throw new Error('Missing required fields');
  }

  try {
    const bufferRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('session_buffer')
      .collection('entries');

    const snapshot = await bufferRef
      .where('sessionId', '==', sessionId)
      .where('consolidated', '==', false)
      .orderBy('timestamp', 'asc')
      .limit(limit)
      .get();

    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()?.toISOString()
    }));

    return { success: true, entries };

  } catch (error) {
    console.error('❌ Get session buffer error:', error);
    return { success: true, entries: [] };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// USER LONG-TERM: LIFE TIMELINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Store a memory in the life timeline with chapter classification
 */
exports.storeLifeMemory = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    content,
    chapter = null,
    age = null,
    importance = 0.5,
    emotion = null,
    people = [],
    contextHints = null
  } = request.data;

  if (!userId || !profileId || !content) {
    throw new Error('Missing required fields');
  }

  try {
    console.log('📚 Storing life memory for:', userId, profileId);

    // Determine chapter
    const memoryChapter = chapter || determineChapter(age, contextHints);

    // Generate embedding (may return null if API fails)
    const embedding = await generateEmbedding(content);

    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    // Build document data - only include embedding if available
    const docData = {
      content,
      chapter: memoryChapter,
      chapterName: LIFE_CHAPTERS[memoryChapter]?.name || 'Timeless',
      age: age || null,
      importance,
      emotion,
      people,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'conversation',
      accessCount: 0,
      hasEmbedding: !!embedding
    };

    // Only add embedding field if we got one (store as regular array for compatibility)
    if (embedding && Array.isArray(embedding) && embedding.length > 0) {
      docData.embedding = embedding; // Store as regular array - FieldValue.vector requires newer SDK
    }

    const docRef = await timelineRef.add(docData);

    console.log('✅ Life memory stored:', docRef.id, 'Chapter:', memoryChapter, 'HasEmbedding:', !!embedding);

    return {
      success: true,
      id: docRef.id,
      chapter: memoryChapter,
      hasEmbedding: !!embedding
    };

  } catch (error) {
    console.error('❌ Store life memory error:', error);
    throw new Error(`Failed to store life memory: ${error.message}`);
  }
});

/**
 * Search life timeline with semantic similarity and optional chapter filter
 */
exports.searchLifeTimeline = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    query,
    chapter = null,
    limit = 5
  } = request.data;

  if (!userId || !profileId || !query) {
    throw new Error('Missing required fields');
  }

  try {
    console.log('🔍 Searching life timeline for:', userId, profileId);

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    // Vector search
    const vectorQuery = timelineRef.findNearest({
      vectorField: 'embedding',
      queryVector: queryEmbedding,
      distanceMeasure: 'COSINE',
      limit: limit * 2 // Fetch extra for chapter filtering
    });

    const snapshot = await vectorQuery.get();

    let memories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      embedding: undefined, // Don't return embedding
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    // Filter by chapter if specified
    if (chapter) {
      memories = memories.filter(m => m.chapter === chapter);
    }

    return {
      success: true,
      memories: memories.slice(0, limit)
    };

  } catch (error) {
    console.error('❌ Search life timeline error:', error);
    return { success: true, memories: [], fallback: true };
  }
});

/**
 * Get memories by life chapter
 */
exports.getMemoriesByChapter = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, chapter, limit = 10 } = request.data;

  if (!userId || !profileId || !chapter) {
    throw new Error('Missing required fields');
  }

  try {
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    const snapshot = await timelineRef
      .where('chapter', '==', chapter)
      .orderBy('importance', 'desc')
      .limit(limit)
      .get();

    const memories = snapshot.docs.map(doc => ({
      id: doc.id,
      content: doc.data().content,
      importance: doc.data().importance,
      emotion: doc.data().emotion,
      age: doc.data().age,
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { success: true, memories };

  } catch (error) {
    console.error('❌ Get memories by chapter error:', error);
    return { success: true, memories: [] };
  }
});

/**
 * Get all chapter summaries
 */
exports.getLifeChapterSummary = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields');
  }

  try {
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    // Get count per chapter
    const summary = {};
    for (const [key, chapter] of Object.entries(LIFE_CHAPTERS)) {
      const snapshot = await timelineRef
        .where('chapter', '==', key)
        .count()
        .get();

      summary[key] = {
        ...chapter,
        memoryCount: snapshot.data().count
      };
    }

    return { success: true, chapters: summary };

  } catch (error) {
    console.error('❌ Get life chapter summary error:', error);
    return { success: true, chapters: {} };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SOULPARTNER SHORT-TERM: SESSION OBSERVATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Store Luna's observation about current session
 * Called during conversation as Luna notices things
 */
exports.storeSessionObservation = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    sessionId,
    observation,
    type = 'insight', // mood, pattern, insight, concern, celebration
    confidence = 0.8
  } = request.data;

  if (!userId || !profileId || !sessionId || !observation) {
    throw new Error('Missing required fields');
  }

  try {
    console.log('👁️ Luna storing session observation:', observation.slice(0, 50));

    const obsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('session_observations')
      .collection('entries');

    await obsRef.add({
      observation,
      type,
      confidence,
      sessionId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      promoted: false // Will be true when moved to long-term
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Store session observation error:', error);
    throw new Error(`Failed to store observation: ${error.message}`);
  }
});

/**
 * Get Luna's current session observations
 */
exports.getSessionObservations = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, sessionId, limit = 20 } = request.data;

  if (!userId || !profileId || !sessionId) {
    throw new Error('Missing required fields');
  }

  try {
    const obsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('session_observations')
      .collection('entries');

    const snapshot = await obsRef
      .where('sessionId', '==', sessionId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const observations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()?.toISOString()
    }));

    return { success: true, observations };

  } catch (error) {
    console.error('❌ Get session observations error:', error);
    return { success: true, observations: [] };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SOULPARTNER LONG-TERM: INTERACTION TIMELINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Store Luna's long-term observation about user
 */
exports.storeInteractionObservation = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    observation,
    pattern = null,
    category = 'general'
  } = request.data;

  if (!userId || !profileId || !observation) {
    throw new Error('Missing required fields');
  }

  try {
    console.log('🔮 Luna storing long-term observation:', observation.slice(0, 50));

    // Generate embedding for semantic search
    const embedding = await generateEmbedding(observation);

    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('interaction_timeline')
      .collection('observations');

    await timelineRef.add({
      observation,
      pattern,
      category,
      embedding: admin.firestore.FieldValue.vector(embedding),
      firstObserved: admin.firestore.FieldValue.serverTimestamp(),
      lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
      confirmations: 1,
      confidence: 0.8
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Store interaction observation error:', error);
    throw new Error(`Failed to store observation: ${error.message}`);
  }
});

/**
 * Search Luna's interaction timeline
 */
exports.searchInteractionTimeline = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const { userId, profileId, query, limit = 5 } = request.data;

  if (!userId || !profileId || !query) {
    throw new Error('Missing required fields');
  }

  try {
    const queryEmbedding = await generateEmbedding(query);

    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('interaction_timeline')
      .collection('observations');

    const vectorQuery = timelineRef.findNearest({
      vectorField: 'embedding',
      queryVector: queryEmbedding,
      distanceMeasure: 'COSINE',
      limit
    });

    const snapshot = await vectorQuery.get();

    const observations = snapshot.docs.map(doc => ({
      id: doc.id,
      observation: doc.data().observation,
      pattern: doc.data().pattern,
      category: doc.data().category,
      confirmations: doc.data().confirmations,
      firstObserved: doc.data().firstObserved?.toDate()?.toISOString()
    }));

    return { success: true, observations };

  } catch (error) {
    console.error('❌ Search interaction timeline error:', error);
    return { success: true, observations: [], fallback: true };
  }
});

/**
 * Get Luna's key observations about user (most confirmed)
 */
exports.getKeyObservations = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, limit = 10 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields');
  }

  try {
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('interaction_timeline')
      .collection('observations');

    const snapshot = await timelineRef
      .orderBy('confirmations', 'desc')
      .limit(limit)
      .get();

    const observations = snapshot.docs.map(doc => ({
      id: doc.id,
      observation: doc.data().observation,
      pattern: doc.data().pattern,
      confirmations: doc.data().confirmations,
      confidence: doc.data().confidence
    }));

    return { success: true, observations };

  } catch (error) {
    console.error('❌ Get key observations error:', error);
    return { success: true, observations: [] };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SOULPARTNER: PATTERN DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Store a detected pattern about user
 */
exports.storePattern = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    pattern,
    category = 'behavioral',
    confidence = 0.8,
    examples = []
  } = request.data;

  if (!userId || !profileId || !pattern) {
    throw new Error('Missing required fields');
  }

  try {
    console.log('🔍 Storing pattern:', pattern.slice(0, 50));

    const patternsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('patterns')
      .collection('detected');

    // Check if similar pattern exists
    const existingSnapshot = await patternsRef
      .where('category', '==', category)
      .get();

    for (const doc of existingSnapshot.docs) {
      const existing = doc.data().pattern.toLowerCase();
      const newPattern = pattern.toLowerCase();

      // If similar, update confidence
      if (existing.includes(newPattern) || newPattern.includes(existing)) {
        await doc.ref.update({
          confidence: Math.min(1.0, doc.data().confidence + 0.1),
          lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
          examples: admin.firestore.FieldValue.arrayUnion(...examples)
        });
        return { success: true, updated: true, id: doc.id };
      }
    }

    // Create new pattern
    const docRef = await patternsRef.add({
      pattern,
      category,
      confidence,
      examples,
      firstDetected: admin.firestore.FieldValue.serverTimestamp(),
      lastConfirmed: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, created: true, id: docRef.id };

  } catch (error) {
    console.error('❌ Store pattern error:', error);
    throw new Error(`Failed to store pattern: ${error.message}`);
  }
});

/**
 * Get detected patterns by category
 */
exports.getPatterns = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, category = null, limit = 20 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields');
  }

  try {
    const patternsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('patterns')
      .collection('detected');

    let query = patternsRef.orderBy('confidence', 'desc').limit(limit);

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();

    const patterns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      firstDetected: doc.data().firstDetected?.toDate()?.toISOString(),
      lastConfirmed: doc.data().lastConfirmed?.toDate()?.toISOString()
    }));

    return { success: true, patterns };

  } catch (error) {
    console.error('❌ Get patterns error:', error);
    return { success: true, patterns: [] };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// DUAL-BRAIN CONTEXT: UNIFIED RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get complete dual-brain context for AI response generation
 * This is the main entry point for RAG pipeline
 */
exports.getDualBrainContext = onCall({
  memory: '1GiB',
  timeoutSeconds: 90,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    sessionId,
    userMessage,
    options = {}
  } = request.data;

  if (!userId || !profileId || !userMessage) {
    throw new Error('Missing required fields');
  }

  // Security: Validate user owns the requested data
  // Use authenticated user ID, don't trust request.data.userId
  const authenticatedUserId = request.auth?.uid;
  if (!authenticatedUserId) {
    throw new Error('Authentication required');
  }
  if (authenticatedUserId !== userId) {
    console.error('🚨 [Security] User ID mismatch:', { auth: authenticatedUserId, requested: userId });
    throw new Error('Unauthorized: Cannot access another user\'s memory');
  }

  const startTime = Date.now();

  try {
    console.log('🧠🧠 Getting dual-brain context...');

    // Parallel retrieval from both brains
    const [
      // User's brain
      lifeMemoriesResult,
      sessionBufferResult,

      // SoulPartner's brain
      observationsResult,
      patternsResult,

      // Shared context (from original memoryFunctions)
      factsResult,
      peopleResult,
      anchorsResult
    ] = await Promise.all([
      // User life memories (semantic search)
      this.searchLifeTimeline({ data: { userId, profileId, query: userMessage, limit: 5 } }),

      // Current session buffer
      sessionId
        ? this.getSessionBuffer({ data: { userId, profileId, sessionId, limit: 20 } })
        : Promise.resolve({ entries: [] }),

      // Luna's key observations
      this.getKeyObservations({ data: { userId, profileId, limit: 5 } }),

      // Detected patterns
      this.getPatterns({ data: { userId, profileId, limit: 5 } }),

      // Facts (from existing memory)
      db.collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('facts')
        .orderBy('weight', 'desc')
        .limit(10)
        .get(),

      // People (from existing memory)
      db.collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('people')
        .orderBy('mentionCount', 'desc')
        .limit(5)
        .get(),

      // Happiness anchors (if mood seems low)
      options.moodIsLow
        ? db.collection('users').doc(userId)
            .collection('memory').doc(profileId)
            .collection('happinessAnchors')
            .orderBy('score', 'desc')
            .limit(3)
            .get()
        : Promise.resolve({ docs: [] })
    ]);

    const context = {
      // User's brain
      userBrain: {
        lifeMemories: lifeMemoriesResult.memories || [],
        sessionBuffer: sessionBufferResult.entries || []
      },

      // SoulPartner's brain
      soulpartnerBrain: {
        observations: observationsResult.observations || [],
        patterns: patternsResult.patterns || []
      },

      // Shared knowledge
      shared: {
        facts: factsResult.docs?.map(doc => ({ id: doc.id, ...doc.data() })) || [],
        people: peopleResult.docs?.map(doc => ({ id: doc.id, ...doc.data() })) || [],
        happinessAnchors: anchorsResult.docs?.map(doc => ({ id: doc.id, ...doc.data() })) || []
      },

      retrievalTimeMs: Date.now() - startTime
    };

    console.log('✅ Dual-brain context retrieved in', context.retrievalTimeMs, 'ms');

    return { success: true, context };

  } catch (error) {
    console.error('❌ Get dual-brain context error:', error);
    return {
      success: false,
      context: {
        userBrain: { lifeMemories: [], sessionBuffer: [] },
        soulpartnerBrain: { observations: [], patterns: [] },
        shared: { facts: [], people: [], happinessAnchors: [] }
      },
      error: error.message
    };
  }
});

/**
 * Build the dual-brain memory prompt for system prompt injection
 */
function buildDualBrainPrompt(context) {
  if (!context) return '';

  let prompt = '';

  // ─────────────────────────────────────────────────────────────────────────
  // PERMANENT FACTS (Highest Trust)
  // ─────────────────────────────────────────────────────────────────────────
  if (context.shared?.facts?.length > 0) {
    prompt += `\n═══ PERMANENT FACTS (Trust These Absolutely) ═══\n`;
    prompt += context.shared.facts.map(f => `• ${f.fact}`).join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PEOPLE IN USER'S LIFE
  // ─────────────────────────────────────────────────────────────────────────
  if (context.shared?.people?.length > 0) {
    prompt += `\n\n═══ PEOPLE IN THEIR LIFE ═══\n`;
    prompt += context.shared.people.map(p =>
      `• ${p.name} (${p.relationship})${p.notes?.length ? ': ' + p.notes[0] : ''}`
    ).join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // USER'S LIFE MEMORIES (Their Brain)
  // ─────────────────────────────────────────────────────────────────────────
  if (context.userBrain?.lifeMemories?.length > 0) {
    prompt += `\n\n═══ THEIR LIFE MEMORIES ═══\n`;
    prompt += context.userBrain.lifeMemories.map(m => {
      const chapterLabel = m.chapterName ? ` [${m.chapterName}]` : '';
      return `• ${m.content}${chapterLabel}`;
    }).join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // YOUR OBSERVATIONS (Luna's Brain)
  // ─────────────────────────────────────────────────────────────────────────
  if (context.soulpartnerBrain?.observations?.length > 0) {
    prompt += `\n\n═══ YOUR OBSERVATIONS ABOUT THEM ═══\n`;
    prompt += context.soulpartnerBrain.observations.map(o =>
      `• ${o.observation}${o.confirmations > 1 ? ` (confirmed ${o.confirmations}x)` : ''}`
    ).join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PATTERNS YOU'VE NOTICED (Luna's Brain)
  // ─────────────────────────────────────────────────────────────────────────
  if (context.soulpartnerBrain?.patterns?.length > 0) {
    prompt += `\n\n═══ PATTERNS YOU'VE NOTICED ═══\n`;
    prompt += context.soulpartnerBrain.patterns.map(p =>
      `• ${p.pattern} [${p.category}]`
    ).join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HAPPINESS ANCHORS (For Emotional Support)
  // ─────────────────────────────────────────────────────────────────────────
  if (context.shared?.happinessAnchors?.length > 0) {
    prompt += `\n\n═══ HAPPINESS ANCHORS (Reference If They Seem Down) ═══\n`;
    prompt += context.shared.happinessAnchors.map(h => `• ${h.memory}`).join('\n');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GUIDELINES
  // ─────────────────────────────────────────────────────────────────────────
  if (prompt) {
    prompt += `\n\n═══ MEMORY GUIDELINES ═══
• Reference memories naturally, weaving them into conversation
• Your observations are YOUR understanding - use them to inform empathy
• Patterns help you anticipate their needs and communication style
• Never say "I remember you told me" - just know and respond accordingly
• If something contradicts what you know, gently explore it
`;
  }

  return prompt;
}

exports.buildDualBrainPrompt = buildDualBrainPrompt;

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

exports.LIFE_CHAPTERS = LIFE_CHAPTERS;
exports.determineChapter = determineChapter;
