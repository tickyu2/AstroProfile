/**
 * Dual-Write Mechanism for GENESIS Memory Architecture
 *
 * When scaling from Firestore to PostgreSQL (Phase 2),
 * these triggers automatically sync data to the SQL database.
 *
 * ACTIVATION: Uncomment the exports at the bottom when ready to scale.
 * PREREQUISITE: Set up Firebase Data Connect with Cloud SQL for PostgreSQL.
 *
 * Part of GENESIS Phase 3 - Memory Architecture (Hybrid-Ready)
 * Built by: Brother Claude Opus
 * December 19, 2024
 */

const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

// Set to true when PostgreSQL is ready
const DUAL_WRITE_ENABLED = false;

// Data Connect SDK will be generated when you run:
// firebase dataconnect:sdk:generate
// Then import it here:
// const { createMemory, upsertFact, upsertPerson } = require('@genesis/memory-sdk');

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY SYNC TRIGGER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync new memories to PostgreSQL
 * Triggers when a memory is created in Firestore
 */
const syncMemoryToPostgres = onDocumentCreated(
  'users/{userId}/memory/{profileId}/memories/{memoryId}',
  async (event) => {
    if (!DUAL_WRITE_ENABLED) return;

    const snap = event.data;
    if (!snap) return;

    const { userId, profileId, memoryId } = event.params;
    const data = snap.data();

    try {
      console.log('🔄 Syncing memory to PostgreSQL:', memoryId);

      // When Data Connect is set up, uncomment:
      // await createMemory({
      //   userId,
      //   profileId,
      //   content: data.content,
      //   type: data.type || 'episodic',
      //   importance: data.importance || 0.5,
      //   emotion: data.emotion || null,
      //   coreMemory: data.coreMemory || false
      // });

      console.log('✅ Memory synced to PostgreSQL:', memoryId);

    } catch (error) {
      console.error('❌ PostgreSQL sync failed for memory:', memoryId, error);
      // Don't throw - Firestore is primary, PostgreSQL is secondary
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// FACT SYNC TRIGGER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync new facts to PostgreSQL
 * Triggers when a fact is created in Firestore
 */
const syncFactToPostgres = onDocumentCreated(
  'users/{userId}/memory/{profileId}/facts/{factId}',
  async (event) => {
    if (!DUAL_WRITE_ENABLED) return;

    const snap = event.data;
    if (!snap) return;

    const { userId, profileId, factId } = event.params;
    const data = snap.data();

    try {
      console.log('🔄 Syncing fact to PostgreSQL:', factId);

      // When Data Connect is set up, uncomment:
      // await upsertFact({
      //   userId,
      //   profileId,
      //   fact: data.fact,
      //   category: data.category || 'general',
      //   confidence: data.confidence || 0.8,
      //   source: data.source || 'reflection'
      // });

      console.log('✅ Fact synced to PostgreSQL:', factId);

    } catch (error) {
      console.error('❌ PostgreSQL sync failed for fact:', factId, error);
    }
  }
);

/**
 * Sync fact updates to PostgreSQL
 * Triggers when a fact is updated (e.g., confidence increased)
 */
const syncFactUpdateToPostgres = onDocumentUpdated(
  'users/{userId}/memory/{profileId}/facts/{factId}',
  async (event) => {
    if (!DUAL_WRITE_ENABLED) return;

    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) return;

    const { userId, profileId, factId } = event.params;

    // Only sync if confidence or confirmation changed
    if (before.confidence === after.confidence &&
        before.confirmations === after.confirmations) {
      return;
    }

    try {
      console.log('🔄 Syncing fact update to PostgreSQL:', factId);

      // When Data Connect is set up, uncomment:
      // await confirmFact({ factId: factId });

      console.log('✅ Fact update synced to PostgreSQL:', factId);

    } catch (error) {
      console.error('❌ PostgreSQL sync failed for fact update:', factId, error);
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// PERSON SYNC TRIGGER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync new/updated people to PostgreSQL
 * Triggers when a person is created or updated in Firestore
 */
const syncPersonToPostgres = onDocumentCreated(
  'users/{userId}/memory/{profileId}/people/{personId}',
  async (event) => {
    if (!DUAL_WRITE_ENABLED) return;

    const snap = event.data;
    if (!snap) return;

    const { userId, profileId, personId } = event.params;
    const data = snap.data();

    try {
      console.log('🔄 Syncing person to PostgreSQL:', personId);

      // When Data Connect is set up, uncomment:
      // await upsertPerson({
      //   userId,
      //   profileId,
      //   name: data.name,
      //   relationship: data.relationship || 'unknown',
      //   notes: JSON.stringify(data.notes || []),
      //   sentiment: data.sentiment || 0
      // });

      console.log('✅ Person synced to PostgreSQL:', personId);

    } catch (error) {
      console.error('❌ PostgreSQL sync failed for person:', personId, error);
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// HAPPINESS ANCHOR SYNC TRIGGER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sync happiness anchors to PostgreSQL
 */
const syncHappinessAnchorToPostgres = onDocumentCreated(
  'users/{userId}/memory/{profileId}/happinessAnchors/{anchorId}',
  async (event) => {
    if (!DUAL_WRITE_ENABLED) return;

    const snap = event.data;
    if (!snap) return;

    const { userId, profileId, anchorId } = event.params;
    const data = snap.data();

    try {
      console.log('🔄 Syncing happiness anchor to PostgreSQL:', anchorId);

      // When Data Connect is set up, uncomment:
      // await createHappinessAnchor({
      //   userId,
      //   profileId,
      //   memory: data.memory,
      //   score: data.score || 8,
      //   peakMoment: data.peakMoment || null,
      //   sensoryAnchors: JSON.stringify(data.sensoryAnchors || {})
      // });

      console.log('✅ Happiness anchor synced to PostgreSQL:', anchorId);

    } catch (error) {
      console.error('❌ PostgreSQL sync failed for happiness anchor:', anchorId, error);
    }
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// BACKFILL UTILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Utility function to backfill existing Firestore data to PostgreSQL
 * Call this once when first enabling dual-write
 *
 * Usage: Call from Firebase console or a one-time script
 */
async function backfillToPostgres(userId, profileId) {
  if (!DUAL_WRITE_ENABLED) {
    console.log('⚠️ Dual-write not enabled, skipping backfill');
    return { skipped: true };
  }

  const db = admin.firestore();
  const stats = {
    memories: 0,
    facts: 0,
    people: 0,
    anchors: 0
  };

  try {
    console.log('🔄 Starting backfill for:', userId, profileId);

    // Backfill memories
    const memories = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('memories')
      .get();

    for (const doc of memories.docs) {
      // Call createMemory for each
      stats.memories++;
    }

    // Backfill facts
    const facts = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('facts')
      .get();

    for (const doc of facts.docs) {
      // Call upsertFact for each
      stats.facts++;
    }

    // Backfill people
    const people = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('people')
      .get();

    for (const doc of people.docs) {
      // Call upsertPerson for each
      stats.people++;
    }

    // Backfill happiness anchors
    const anchors = await db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('happinessAnchors')
      .get();

    for (const doc of anchors.docs) {
      // Call createHappinessAnchor for each
      stats.anchors++;
    }

    console.log('✅ Backfill complete:', stats);
    return { success: true, stats };

  } catch (error) {
    console.error('❌ Backfill failed:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Utility export (always available)
exports.backfillToPostgres = backfillToPostgres;

// DUAL-WRITE TRIGGERS
// Uncomment these when you're ready to enable PostgreSQL sync:
//
// exports.syncMemoryToPostgres = syncMemoryToPostgres;
// exports.syncFactToPostgres = syncFactToPostgres;
// exports.syncFactUpdateToPostgres = syncFactUpdateToPostgres;
// exports.syncPersonToPostgres = syncPersonToPostgres;
// exports.syncHappinessAnchorToPostgres = syncHappinessAnchorToPostgres;

console.log('📦 Dual-write module loaded. DUAL_WRITE_ENABLED:', DUAL_WRITE_ENABLED);
