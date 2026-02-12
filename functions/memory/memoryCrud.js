/**
 * Memory CRUD Operations
 *
 * Core create/read/update for memories, facts, people, and happiness anchors.
 * Lines ~147-679 from the original memoryFunctions.js
 */

const { onCall, admin, db, generateEmbedding, calculateRelevanceScore } = require('./memoryShared');

// Lazy-load to avoid circular dependency (storeMemory calls analyzeConstitutionalActivation)
let _analyzeConstitutionalActivation;
function getAnalyzeConstitutionalActivation() {
  if (!_analyzeConstitutionalActivation) {
    _analyzeConstitutionalActivation = require('./constitutionalActivation').analyzeConstitutionalActivation;
  }
  return _analyzeConstitutionalActivation;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORE MEMORY - Save with automatic embedding
// ═══════════════════════════════════════════════════════════════════════════

exports.storeMemory = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    content,
    type,
    importance,
    emotion,
    people,
    // NEW: Soul section for constitutional tagging
    soul,
    keywords
  } = request.data;

  if (!userId || !profileId || !content) {
    throw new Error('Missing required fields: userId, profileId, content');
  }

  try {
    console.log('📝 Storing memory for:', userId, profileId);

    // 1. Generate embedding
    const embedding = await generateEmbedding(content);

    // 2. Fetch constitutional data for tagging (Brother Sonnet's Soul Discovery)
    let constitutionalActivation = null;
    try {
      const profileDoc = await db
        .collection('users').doc(userId)
        .collection('profiles').doc(profileId).get();

      if (profileDoc.exists) {
        const constitutional = profileDoc.data().constitutional_identity;
        if (constitutional) {
          // Build memory data for analysis
          const memoryData = {
            content,
            keywords: keywords || [],
            SOUL: soul || {},
            emotionIntensity: soul?.emotionIntensity || 0,
            vulnerability: soul?.vulnerability || 0,
            impact: soul?.impact || null,
            emotionBefore: soul?.emotionBefore || null,
            emotionAfter: soul?.emotionAfter || null,
            gratitude: soul?.gratitude || false
          };

          const analyzeConstitutionalActivation = getAnalyzeConstitutionalActivation();
          constitutionalActivation = analyzeConstitutionalActivation(constitutional, memoryData);
        }
      }
    } catch (constitutionalError) {
      console.warn('⚠️ Constitutional analysis failed (continuing without):', constitutionalError.message);
    }

    // 3. Build memory document with optional constitutional tagging
    const memoryDoc = {
      content,
      type: type || 'episodic',
      importance: importance || 0.5,
      emotion: emotion || null,
      people: people || [],
      keywords: keywords || [],
      embedding: admin.firestore.FieldValue.vector(embedding),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
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

    // Add constitutional activation if available (Brother Sonnet's Soul Discovery - Task 2)
    if (constitutionalActivation) {
      memoryDoc.constitutional = constitutionalActivation;
      console.log('🌟 Constitutional tagging applied:', constitutionalActivation.elementActivated);
    }

    // 4. Store in Firestore with vector
    const memoryRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories');

    const docRef = await memoryRef.add(memoryDoc);

    console.log('✅ Memory stored:', docRef.id);

    return {
      success: true,
      id: docRef.id,
      embeddingDimensions: embedding.length,
      constitutionalTagged: !!constitutionalActivation,
      constitutionalElement: constitutionalActivation?.elementActivated || null
    };

  } catch (error) {
    console.error('❌ Store memory error:', error);
    throw new Error(`Failed to store memory: ${error.message}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// RETRIEVE MEMORIES - Vector similarity search with metadata filtering
// ═══════════════════════════════════════════════════════════════════════════

exports.retrieveMemories = onCall({
  memory: '512MiB',
  timeoutSeconds: 60,
  cors: true
}, async (request) => {
  const {
    userId,
    profileId,
    query,
    limit = 5,
    recencyDays = 90,
    minImportance = 0.3,
    includeHappyMemories = false
  } = request.data;

  if (!userId || !profileId || !query) {
    throw new Error('Missing required fields: userId, profileId, query');
  }

  try {
    console.log('🔍 Retrieving memories for:', userId, profileId);

    // 1. Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Perform vector similarity search using Firestore findNearest
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories');

    // Note: Firestore vector search requires the index to be created
    // Run: gcloud alpha firestore indexes composite create --collection-group=memories --query-scope=COLLECTION --field-config='field-path=embedding,vector-config={"dimension":"768","flat":"{}"}'

    const vectorQuery = memoriesRef.findNearest({
      vectorField: 'embedding',
      queryVector: queryEmbedding,
      distanceMeasure: 'COSINE',
      limit: limit * 2  // Fetch extra for filtering
    });

    const snapshot = await vectorQuery.get();

    // 3. Post-process: filter by recency and importance
    // PRODUCTION HARDENING: Use sigmoid decay instead of simple thresholds
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - recencyDays);

    const memories = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() || new Date();

      // Skip old memories (unless they're core memories)
      if (createdAt < cutoffDate && !data.coreMemory) continue;

      // Skip low importance
      if ((data.importance || 0.5) < minImportance) continue;

      // PRODUCTION HARDENING: Use sigmoid-based relevance scoring
      // This gives much better control over how recency affects retrieval
      const relevanceScore = calculateRelevanceScore(
        doc.distance || 0,
        createdAt,
        {
          importance: data.importance || 0.5,
          accessCount: data.accessCount || 0,
          isCoreMemory: data.coreMemory || false,
          recencyWeight: 0.3  // 30% recency, 70% semantic similarity
        }
      );

      memories.push({
        id: doc.id,
        content: data.content,
        type: data.type,
        importance: data.importance,
        emotion: data.emotion,
        people: data.people,
        distance: doc.distance || 0,
        score: relevanceScore,
        // Include recency metadata for debugging
        hoursOld: (Date.now() - createdAt.getTime()) / (1000 * 60 * 60),
        createdAt: createdAt.toISOString()
      });
    }

    // 4. Sort by boosted score and limit
    memories.sort((a, b) => b.score - a.score);
    const topMemories = memories.slice(0, limit);

    // 5. Update access counts (non-blocking)
    topMemories.forEach(mem => {
      memoriesRef.doc(mem.id).update({
        accessCount: admin.firestore.FieldValue.increment(1),
        lastAccessed: admin.firestore.FieldValue.serverTimestamp()
      }).catch(() => {}); // Ignore errors
    });

    console.log('✅ Retrieved', topMemories.length, 'memories');

    return {
      success: true,
      memories: topMemories,
      queryEmbeddingDimensions: queryEmbedding.length
    };

  } catch (error) {
    console.error('❌ Retrieve memories error:', error);

    // If vector search fails (index not created), fall back to regular query
    if (error.message?.includes('findNearest') || error.code === 9) {
      console.log('⚠️ Vector search not available, using fallback');
      return { success: true, memories: [], fallback: true };
    }

    throw new Error(`Failed to retrieve memories: ${error.message}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET FACTS - Retrieve permanent facts (high weight)
// ═══════════════════════════════════════════════════════════════════════════

exports.getFacts = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, limit = 10, category = null } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

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

// ═══════════════════════════════════════════════════════════════════════════
// STORE FACT - Save to permanent facts table
// ═══════════════════════════════════════════════════════════════════════════

exports.storeFact = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, fact, category, confidence, source } = request.data;

  if (!userId || !profileId || !fact) {
    throw new Error('Missing required fields: userId, profileId, fact');
  }

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
          lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
          confirmations: admin.firestore.FieldValue.increment(1)
        });
        console.log('📝 Fact confirmed:', fact.slice(0, 50));
        return { success: true, updated: true, id: doc.id };
      }
    }

    // Store new fact with 2x weight
    const docRef = await factsRef.add({
      fact,
      category: category || 'general',
      confidence: confidence || 0.8,
      weight: 2.0,  // Facts get 2x retrieval weight
      source: source || 'reflection',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
      confirmations: 1
    });

    console.log('📝 New fact stored:', fact.slice(0, 50));
    return { success: true, created: true, id: docRef.id };

  } catch (error) {
    console.error('❌ Store fact error:', error);
    throw new Error(`Failed to store fact: ${error.message}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET PEOPLE - Retrieve people from relationship graph
// ═══════════════════════════════════════════════════════════════════════════

exports.getPeople = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, names = null, limit = 10 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

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

// ═══════════════════════════════════════════════════════════════════════════
// UPSERT PERSON - Update or create person in graph
// ═══════════════════════════════════════════════════════════════════════════

exports.upsertPerson = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, name, relationship, notes, sentiment } = request.data;

  if (!userId || !profileId || !name) {
    throw new Error('Missing required fields: userId, profileId, name');
  }

  try {
    const peopleRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('people');

    // Use normalized name as document ID
    const personId = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const personRef = peopleRef.doc(personId);

    const existing = await personRef.get();

    if (existing.exists) {
      // Update existing
      const updates = {
        lastMention: admin.firestore.FieldValue.serverTimestamp(),
        mentionCount: admin.firestore.FieldValue.increment(1)
      };
      if (relationship) updates.relationship = relationship;
      if (notes) updates.notes = admin.firestore.FieldValue.arrayUnion(notes);
      if (sentiment !== undefined) updates.sentiment = sentiment;

      await personRef.update(updates);
      return { success: true, updated: true, id: personId };
    } else {
      // Create new
      await personRef.set({
        name,
        relationship: relationship || 'unknown',
        notes: notes ? [notes] : [],
        sentiment: sentiment || 0,
        firstMention: admin.firestore.FieldValue.serverTimestamp(),
        lastMention: admin.firestore.FieldValue.serverTimestamp(),
        mentionCount: 1
      });
      return { success: true, created: true, id: personId };
    }

  } catch (error) {
    console.error('❌ Upsert person error:', error);
    throw new Error(`Failed to upsert person: ${error.message}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET HAPPINESS ANCHORS - Retrieve joy network memories
// ═══════════════════════════════════════════════════════════════════════════

exports.getHappinessAnchors = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, limit = 3 } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

  try {
    const anchorsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('happinessAnchors');

    const snapshot = await anchorsRef
      .orderBy('score', 'desc')
      .limit(limit)
      .get();

    const anchors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, anchors };

  } catch (error) {
    console.error('❌ Get happiness anchors error:', error);
    return { success: true, anchors: [] };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// STORE HAPPINESS ANCHOR - Save to joy network
// ═══════════════════════════════════════════════════════════════════════════

exports.storeHappinessAnchor = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { userId, profileId, memory, score, peakMoment, sensoryAnchors } = request.data;

  if (!userId || !profileId || !memory) {
    throw new Error('Missing required fields: userId, profileId, memory');
  }

  try {
    const anchorsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('happinessAnchors');

    const docRef = await anchorsRef.add({
      memory,
      score: score || 8,
      peakMoment: peakMoment || null,
      sensoryAnchors: sensoryAnchors || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastRecalled: admin.firestore.FieldValue.serverTimestamp(),
      recallCount: 1
    });

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error('❌ Store happiness anchor error:', error);
    throw new Error(`Failed to store happiness anchor: ${error.message}`);
  }
});
