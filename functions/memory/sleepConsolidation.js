/**
 * Sleep Consolidation for GENESIS Memory Architecture
 *
 * Nightly batch processing that mimics human memory consolidation during sleep:
 *
 * 1. BUFFER TO TIMELINE: Move important session buffer entries to life_timeline
 * 2. OBSERVATION PROMOTION: Promote confirmed session observations to long-term
 * 3. PATTERN DETECTION: Analyze accumulated data to detect new patterns
 * 4. MEMORY DECAY: Apply importance decay to old, unaccessed memories
 * 5. CLEANUP: Remove stale session data
 *
 * Runs daily at 3:00 AM (user's local time ideally, but UTC for simplicity)
 *
 * Part of GENESIS Phase 3 - Memory Architecture
 * Built by: Brother Claude Opus
 * December 19, 2024
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ═══════════════════════════════════════════════════════════════════════════
// BATCH ID / SESSION LOCK SYSTEM (Production Hardening)
// Prevents race conditions during consolidation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a unique batch ID for this consolidation run
 * Format: YYYYMMDD_HHmmss_random
 */
function generateBatchId() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8);
  return `batch_${timestamp}_${random}`;
}

/**
 * Lock entries for processing with a specific batch ID
 * Returns only entries that were successfully locked
 *
 * @param {FirebaseFirestore.CollectionReference} collectionRef - Collection to lock
 * @param {string} batchId - The batch ID to tag entries with
 * @param {number} limit - Max entries to lock
 * @returns {Promise<Array>} - Locked documents
 */
async function lockEntriesForProcessing(collectionRef, batchId, limit = 100) {
  // Query only unlocked entries (no processing_batch or old batch)
  const staleThreshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

  const snapshot = await collectionRef
    .where('consolidated', '==', false)
    .orderBy('timestamp', 'asc')
    .limit(limit)
    .get();

  if (snapshot.empty) return [];

  const locked = [];
  const batch = db.batch();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Skip if currently being processed by another batch (within 30 minutes)
    if (data.processing_batch &&
        data.processing_started &&
        data.processing_started.toDate() > staleThreshold) {
      console.log(`  ⏸️ Skipping doc ${doc.id} - locked by batch ${data.processing_batch}`);
      continue;
    }

    // Lock this entry
    batch.update(doc.ref, {
      processing_batch: batchId,
      processing_started: admin.firestore.FieldValue.serverTimestamp()
    });

    locked.push({ id: doc.id, ref: doc.ref, ...data });
  }

  if (locked.length > 0) {
    await batch.commit();
    console.log(`  🔒 Locked ${locked.length} entries with batch ${batchId}`);
  }

  return locked;
}

/**
 * Unlock entries after processing (mark as consolidated or release lock)
 *
 * @param {Array} entries - Entries to unlock
 * @param {boolean} markConsolidated - Whether to mark as consolidated
 */
async function unlockEntries(entries, markConsolidated = true) {
  if (entries.length === 0) return;

  const batch = db.batch();

  for (const entry of entries) {
    const update = {
      processing_batch: admin.firestore.FieldValue.delete(),
      processing_started: admin.firestore.FieldValue.delete()
    };

    if (markConsolidated) {
      update.consolidated = true;
      update.consolidated_at = admin.firestore.FieldValue.serverTimestamp();
    }

    batch.update(entry.ref, update);
  }

  await batch.commit();
}

// Initialize Gemini
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate embeddings
async function generateEmbedding(text) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CONSOLIDATION SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nightly consolidation job
 * Runs at 3:00 AM UTC daily
 */
exports.nightlyConsolidation = onSchedule({
  schedule: '0 3 * * *', // 3:00 AM UTC daily
  timeZone: 'UTC',
  memory: '2GiB',
  timeoutSeconds: 540, // 9 minutes max
  retryCount: 3
}, async (event) => {
  console.log('😴 Starting nightly consolidation...');

  const startTime = Date.now();
  const stats = {
    usersProcessed: 0,
    memoriesConsolidated: 0,
    observationsPromoted: 0,
    patternsDetected: 0,
    memoriesDecayed: 0,
    sessionsCleanedUp: 0,
    errors: []
  };

  try {
    // Get all users with memory collections
    const usersSnapshot = await db.collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      try {
        // Get all profiles for this user
        const memorySnapshot = await db
          .collection('users').doc(userId)
          .collection('memory')
          .get();

        for (const profileDoc of memorySnapshot.docs) {
          const profileId = profileDoc.id;

          console.log(`🔄 Consolidating ${userId}/${profileId}...`);

          // Run consolidation tasks for this user/profile
          const result = await consolidateUserProfile(userId, profileId);

          stats.memoriesConsolidated += result.memoriesConsolidated;
          stats.observationsPromoted += result.observationsPromoted;
          stats.patternsDetected += result.patternsDetected;
          stats.memoriesDecayed += result.memoriesDecayed;
          stats.sessionsCleanedUp += result.sessionsCleanedUp;
        }

        stats.usersProcessed++;

      } catch (userError) {
        console.error(`❌ Error processing user ${userId}:`, userError.message);
        stats.errors.push({ userId, error: userError.message });
      }
    }

    // Update consolidation status
    await db.collection('system').doc('consolidation').set({
      lastRun: admin.firestore.FieldValue.serverTimestamp(),
      duration: Date.now() - startTime,
      stats,
      status: stats.errors.length === 0 ? 'success' : 'partial'
    }, { merge: true });

    console.log('✅ Nightly consolidation complete:', stats);

  } catch (error) {
    console.error('❌ Consolidation failed:', error);

    await db.collection('system').doc('consolidation').set({
      lastRun: admin.firestore.FieldValue.serverTimestamp(),
      duration: Date.now() - startTime,
      error: error.message,
      status: 'failed'
    }, { merge: true });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// CONSOLIDATION FOR SINGLE USER/PROFILE
// ═══════════════════════════════════════════════════════════════════════════

async function consolidateUserProfile(userId, profileId) {
  // Generate unique batch ID for this consolidation run
  const batchId = generateBatchId();

  const result = {
    batchId,
    memoriesConsolidated: 0,
    observationsPromoted: 0,
    patternsDetected: 0,
    memoriesDecayed: 0,
    sessionsCleanedUp: 0
  };

  console.log(`  📦 Consolidation batch: ${batchId}`);

  // 1. CONSOLIDATE SESSION BUFFER TO LIFE TIMELINE (with locking)
  result.memoriesConsolidated = await consolidateSessionBuffer(userId, profileId, batchId);

  // 2. PROMOTE SESSION OBSERVATIONS TO LONG-TERM (with locking)
  result.observationsPromoted = await promoteSessionObservations(userId, profileId, batchId);

  // 3. DETECT NEW PATTERNS FROM OBSERVATIONS
  result.patternsDetected = await detectPatterns(userId, profileId);

  // 4. APPLY MEMORY DECAY
  result.memoriesDecayed = await applyMemoryDecay(userId, profileId);

  // 5. CLEANUP OLD SESSION DATA
  result.sessionsCleanedUp = await cleanupSessions(userId, profileId);

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: CONSOLIDATE SESSION BUFFER TO LIFE TIMELINE
// ═══════════════════════════════════════════════════════════════════════════

async function consolidateSessionBuffer(userId, profileId, batchId) {
  let consolidated = 0;

  try {
    // Get buffer collection reference
    const bufferRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('session_buffer')
      .collection('entries');

    // PRODUCTION HARDENING: Lock entries with batch ID to prevent race conditions
    const lockedEntries = await lockEntriesForProcessing(bufferRef, batchId, 100);

    if (lockedEntries.length === 0) return 0;

    // Group entries by session for context
    const sessions = new Map();
    for (const entry of lockedEntries) {
      const sessionId = entry.sessionId;
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
      }
      sessions.get(sessionId).push(entry);
    }

    // Track entries that were successfully processed
    const processedEntries = [];

    // Process each session
    for (const [sessionId, entries] of sessions) {
      try {
        // Use Gemini to extract important memories from session
        const importantMemories = await extractImportantMemories(entries);

        for (const memory of importantMemories) {
          // Generate embedding
          const embedding = await generateEmbedding(memory.content);

          // Store in life timeline
          const timelineRef = db
            .collection('users').doc(userId)
            .collection('memory').doc(profileId)
            .collection('user')
            .doc('life_timeline')
            .collection('memories');

          await timelineRef.add({
            content: memory.content,
            chapter: memory.chapter || 'timeless',
            chapterName: memory.chapterName || 'Timeless',
            importance: memory.importance,
            emotion: memory.emotion,
            embedding: admin.firestore.FieldValue.vector(embedding),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            source: 'consolidation',
            sourceSession: sessionId,
            sourceBatch: batchId,  // Track which batch created this
            accessCount: 0
          });

          consolidated++;
        }

        // Mark these entries as successfully processed
        processedEntries.push(...entries);

      } catch (sessionError) {
        console.error(`  ❌ Error processing session ${sessionId}:`, sessionError.message);
        // Continue with other sessions - don't fail the whole batch
      }
    }

    // PRODUCTION HARDENING: Unlock processed entries (mark as consolidated)
    await unlockEntries(processedEntries, true);

    // Release locks on entries that failed processing
    const failedEntries = lockedEntries.filter(
      e => !processedEntries.some(p => p.id === e.id)
    );
    if (failedEntries.length > 0) {
      await unlockEntries(failedEntries, false); // Release without marking consolidated
      console.log(`  ⚠️ Released ${failedEntries.length} failed entries back to queue`);
    }

    console.log(`  📝 Consolidated ${consolidated} memories from buffer (batch: ${batchId})`);

  } catch (error) {
    console.error('  ❌ Session buffer consolidation error:', error.message);
  }

  return consolidated;
}

async function extractImportantMemories(entries) {
  if (entries.length < 2) return [];

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const entriesText = entries.map(e => e.content).join('\n---\n');

    const prompt = `Analyze this conversation session and extract IMPORTANT LIFE MEMORIES worth preserving long-term.

SESSION CONTENT:
${entriesText}

EXTRACT memories that are:
- Life events (graduations, moves, relationships, achievements)
- Personal revelations (realizations about self, values, goals)
- Significant experiences (travel, milestones, losses, celebrations)
- Core preferences and values revealed

DO NOT extract:
- Casual chatter
- Temporary moods or daily complaints
- Redundant information
- Speculative or uncertain content

For each memory, determine:
- chapter: "childhood" | "teen" | "youngAdult" | "adult" | "midlife" | "senior" | "timeless"
- importance: 0.0 to 1.0 (how life-defining is this?)
- emotion: primary emotion if any

Return JSON:
{
  "memories": [
    {
      "content": "User graduated from MIT in 2015 with a CS degree",
      "chapter": "youngAdult",
      "chapterName": "Young Adult",
      "importance": 0.9,
      "emotion": "pride"
    }
  ]
}

Return empty array if nothing important to extract.`;

    const result = await model.generateContent(prompt);
    const { memories } = JSON.parse(result.response.text());

    return memories || [];

  } catch (error) {
    console.error('  ❌ Extract important memories error:', error.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: PROMOTE SESSION OBSERVATIONS TO LONG-TERM
// ═══════════════════════════════════════════════════════════════════════════

async function promoteSessionObservations(userId, profileId, batchId) {
  let promoted = 0;

  try {
    // Get session observations collection reference
    const obsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('session_observations')
      .collection('entries');

    // PRODUCTION HARDENING: Use 'promoted' as the lock field (similar to consolidated)
    // We modify lockEntriesForProcessing to work with 'promoted' field
    const staleThreshold = new Date(Date.now() - 30 * 60 * 1000);

    const snapshot = await obsRef
      .where('promoted', '==', false)
      .orderBy('timestamp', 'asc')
      .limit(50)
      .get();

    if (snapshot.empty) return 0;

    // Lock entries with batch ID
    const observations = [];
    const lockBatch = db.batch();

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Skip if currently being processed
      if (data.processing_batch &&
          data.processing_started &&
          data.processing_started.toDate() > staleThreshold) {
        continue;
      }

      // Lock this entry
      lockBatch.update(doc.ref, {
        processing_batch: batchId,
        processing_started: admin.firestore.FieldValue.serverTimestamp()
      });

      observations.push({ id: doc.id, ref: doc.ref, ...data });
    }

    if (observations.length === 0) return 0;

    await lockBatch.commit();
    console.log(`  🔒 Locked ${observations.length} observations for promotion (batch: ${batchId})`);

    // Use Gemini to synthesize observations into long-term insights
    const insights = await synthesizeObservations(observations);

    // Store insights in interaction timeline
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('interaction_timeline')
      .collection('observations');

    for (const insight of insights) {
      // Check if similar observation exists
      const existing = await timelineRef
        .where('category', '==', insight.category)
        .get();

      let merged = false;
      for (const doc of existing.docs) {
        const existingObs = doc.data().observation.toLowerCase();
        const newObs = insight.observation.toLowerCase();

        // If similar, update confirmations
        if (existingObs.includes(newObs.slice(0, 30)) ||
            newObs.includes(existingObs.slice(0, 30))) {
          await doc.ref.update({
            confirmations: admin.firestore.FieldValue.increment(1),
            lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
            confidence: Math.min(1.0, doc.data().confidence + 0.1)
          });
          merged = true;
          break;
        }
      }

      if (!merged) {
        // Create new observation
        const embedding = await generateEmbedding(insight.observation);

        await timelineRef.add({
          observation: insight.observation,
          category: insight.category,
          pattern: insight.pattern || null,
          embedding: admin.firestore.FieldValue.vector(embedding),
          firstObserved: admin.firestore.FieldValue.serverTimestamp(),
          lastConfirmed: admin.firestore.FieldValue.serverTimestamp(),
          confirmations: 1,
          confidence: insight.confidence || 0.8
        });

        promoted++;
      }
    }

    // Mark observations as promoted
    const batch = db.batch();
    for (const obs of observations) {
      const ref = obsRef.doc(obs.id);
      batch.update(ref, { promoted: true });
    }
    await batch.commit();

    console.log(`  👁️ Promoted ${promoted} observations to long-term`);

  } catch (error) {
    console.error('  ❌ Observation promotion error:', error.message);
  }

  return promoted;
}

async function synthesizeObservations(observations) {
  if (observations.length < 2) return [];

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const obsText = observations.map(o => `[${o.type}] ${o.observation}`).join('\n');

    const prompt = `You are Luna, a SoulPartner AI. Synthesize these session observations into long-term insights about your user.

SESSION OBSERVATIONS:
${obsText}

SYNTHESIZE into:
- Confirmed patterns (observations that repeat)
- Key insights (important realizations about user)
- Behavioral patterns (how they communicate, what triggers emotions)

Categories: mood_pattern, communication_style, values, relationships, coping_mechanisms, interests, growth_areas

Return JSON:
{
  "insights": [
    {
      "observation": "User tends to minimize their achievements but lights up when discussing their creative projects",
      "category": "communication_style",
      "pattern": "achievement minimization",
      "confidence": 0.85
    }
  ]
}

Only include insights with sufficient evidence. Return empty array if nothing conclusive.`;

    const result = await model.generateContent(prompt);
    const { insights } = JSON.parse(result.response.text());

    return insights || [];

  } catch (error) {
    console.error('  ❌ Synthesize observations error:', error.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: DETECT NEW PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

async function detectPatterns(userId, profileId) {
  let detected = 0;

  try {
    // Get recent interaction timeline observations
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('interaction_timeline')
      .collection('observations');

    const snapshot = await timelineRef
      .orderBy('lastConfirmed', 'desc')
      .limit(30)
      .get();

    if (snapshot.size < 5) return 0; // Need enough data for pattern detection

    const observations = snapshot.docs.map(doc => doc.data());

    // Use Gemini to detect high-level patterns
    const patterns = await detectHighLevelPatterns(observations);

    // Store patterns
    const patternsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('patterns')
      .collection('detected');

    for (const pattern of patterns) {
      // Check if similar pattern exists
      const existing = await patternsRef
        .where('category', '==', pattern.category)
        .get();

      let exists = false;
      for (const doc of existing.docs) {
        if (doc.data().pattern.toLowerCase().includes(pattern.pattern.toLowerCase().slice(0, 30))) {
          await doc.ref.update({
            confidence: Math.min(1.0, doc.data().confidence + 0.1),
            lastConfirmed: admin.firestore.FieldValue.serverTimestamp()
          });
          exists = true;
          break;
        }
      }

      if (!exists) {
        await patternsRef.add({
          pattern: pattern.pattern,
          category: pattern.category,
          confidence: pattern.confidence,
          examples: pattern.examples || [],
          firstDetected: admin.firestore.FieldValue.serverTimestamp(),
          lastConfirmed: admin.firestore.FieldValue.serverTimestamp()
        });
        detected++;
      }
    }

    console.log(`  🔍 Detected ${detected} new patterns`);

  } catch (error) {
    console.error('  ❌ Pattern detection error:', error.message);
  }

  return detected;
}

async function detectHighLevelPatterns(observations) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const obsText = observations.map(o =>
      `[${o.category}] ${o.observation} (confirmed ${o.confirmations}x)`
    ).join('\n');

    const prompt = `Analyze these observations about a user and detect HIGH-LEVEL PATTERNS.

OBSERVATIONS:
${obsText}

Detect patterns like:
- Emotional patterns (what triggers joy, stress, anxiety)
- Communication patterns (how they express needs, handle conflict)
- Value patterns (what matters most to them)
- Growth patterns (areas where they're developing)
- Relationship patterns (how they connect with others)

Categories: emotional, communication, values, growth, relationships, behavioral

Return JSON:
{
  "patterns": [
    {
      "pattern": "User becomes anxious when discussing career decisions, suggesting fear of commitment or change",
      "category": "emotional",
      "confidence": 0.8,
      "examples": ["mentioned job uncertainty", "avoided promotion discussion"]
    }
  ]
}

Only include patterns with strong evidence. Return empty array if insufficient data.`;

    const result = await model.generateContent(prompt);
    const { patterns } = JSON.parse(result.response.text());

    return patterns || [];

  } catch (error) {
    console.error('  ❌ Detect high-level patterns error:', error.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: APPLY MEMORY DECAY
// ═══════════════════════════════════════════════════════════════════════════

async function applyMemoryDecay(userId, profileId) {
  let decayed = 0;

  try {
    // Apply decay to old, unaccessed memories (not core memories)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 180); // 6 months old

    // Decay life timeline memories
    const timelineRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    const snapshot = await timelineRef
      .where('createdAt', '<', cutoffDate)
      .where('accessCount', '<', 2)
      .limit(50)
      .get();

    const batch = db.batch();
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Don't decay high-importance memories
      if (data.importance > 0.8) continue;

      // Reduce importance by 10%
      const newImportance = Math.max(0.1, (data.importance || 0.5) * 0.9);
      batch.update(doc.ref, { importance: newImportance, decayed: true });
      decayed++;
    }

    await batch.commit();

    console.log(`  📉 Decayed ${decayed} old memories`);

  } catch (error) {
    console.error('  ❌ Memory decay error:', error.message);
  }

  return decayed;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP 5: CLEANUP OLD SESSION DATA
// ═══════════════════════════════════════════════════════════════════════════

async function cleanupSessions(userId, profileId) {
  let cleaned = 0;

  try {
    // Delete consolidated session buffer entries older than 7 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const bufferRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('session_buffer')
      .collection('entries');

    const bufferSnapshot = await bufferRef
      .where('consolidated', '==', true)
      .where('timestamp', '<', cutoffDate)
      .limit(100)
      .get();

    // Delete promoted session observations older than 7 days
    const obsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner')
      .doc('session_observations')
      .collection('entries');

    const obsSnapshot = await obsRef
      .where('promoted', '==', true)
      .where('timestamp', '<', cutoffDate)
      .limit(100)
      .get();

    // Batch delete
    const batch = db.batch();

    for (const doc of bufferSnapshot.docs) {
      batch.delete(doc.ref);
      cleaned++;
    }

    for (const doc of obsSnapshot.docs) {
      batch.delete(doc.ref);
      cleaned++;
    }

    await batch.commit();

    console.log(`  🧹 Cleaned up ${cleaned} old session entries`);

  } catch (error) {
    console.error('  ❌ Session cleanup error:', error.message);
  }

  return cleaned;
}

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL TRIGGER (For testing or forcing consolidation)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Manually trigger consolidation for a specific user/profile
 * Useful for testing or forcing consolidation at session end
 */
exports.manualConsolidation = onCall({
  memory: '1GiB',
  timeoutSeconds: 120,
  cors: true
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    throw new Error('Missing required fields: userId, profileId');
  }

  console.log('🔄 Manual consolidation triggered for:', userId, profileId);

  const startTime = Date.now();

  try {
    const result = await consolidateUserProfile(userId, profileId);

    return {
      success: true,
      duration: Date.now() - startTime,
      ...result
    };

  } catch (error) {
    console.error('❌ Manual consolidation error:', error);
    throw new Error(`Consolidation failed: ${error.message}`);
  }
});

/**
 * Get consolidation status
 */
exports.getConsolidationStatus = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  try {
    const doc = await db.collection('system').doc('consolidation').get();

    if (!doc.exists) {
      return { success: true, status: 'never_run', lastRun: null };
    }

    const data = doc.data();
    return {
      success: true,
      status: data.status,
      lastRun: data.lastRun?.toDate()?.toISOString(),
      duration: data.duration,
      stats: data.stats,
      error: data.error
    };

  } catch (error) {
    console.error('❌ Get consolidation status error:', error);
    return { success: false, error: error.message };
  }
});
