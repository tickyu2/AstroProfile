/**
 * ============================================================================
 * GENESIS LUNA - FIRESTORE CLIENT SINGLETON
 * ============================================================================
 * Centralized Firestore connection to eliminate 244+ scattered initializations.
 * All modules should import from here instead of calling admin.firestore() directly.
 *
 * Benefits:
 * - Single initialization point
 * - Memory efficiency
 * - Consistent configuration
 * - Easy to mock for testing
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const admin = require('firebase-admin');

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let _firestoreInstance = null;
let _initialized = false;

/**
 * Initialize Firebase Admin if not already done
 * Call this once at app startup
 */
function initializeFirebaseAdmin() {
  if (_initialized) return;

  try {
    // Check if already initialized
    admin.app();
    _initialized = true;
  } catch (error) {
    // Not initialized, do it now
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (serviceAccountPath) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Use default credentials (Cloud Functions environment)
      admin.initializeApp();
    }
    _initialized = true;
  }
}

/**
 * Get the Firestore instance (singleton)
 * Automatically initializes if needed
 *
 * @returns {FirebaseFirestore.Firestore} Firestore instance
 */
function getFirestore() {
  if (!_firestoreInstance) {
    initializeFirebaseAdmin();
    _firestoreInstance = admin.firestore();

    // Configure settings for better performance
    _firestoreInstance.settings({
      ignoreUndefinedProperties: true
    });

    console.log('[GENESIS] Firestore client initialized (singleton)');
  }

  return _firestoreInstance;
}

/**
 * Get Firebase Admin instance
 * For operations that need direct admin access (auth, storage, etc.)
 *
 * @returns {admin.app.App} Firebase Admin app
 */
function getAdmin() {
  initializeFirebaseAdmin();
  return admin;
}

/**
 * Get FieldValue for atomic operations
 * Convenience export for increment, arrayUnion, etc.
 */
function getFieldValue() {
  return admin.firestore.FieldValue;
}

/**
 * Get Timestamp for date operations
 */
function getTimestamp() {
  return admin.firestore.Timestamp;
}

// ============================================================================
// COLLECTION REFERENCES (Centralized paths)
// ============================================================================

const COLLECTIONS = {
  // User data
  USERS: 'users',
  USER_FACTS: 'user_facts',
  USER_SESSIONS: 'user_sessions',

  // Memory system
  MEMORIES: 'memories',
  STM: 'stm',
  LTM: 'ltm',
  EPISODIC: 'episodic_memories',
  ANCHORS: 'happiness_anchors',

  // Luna profiles
  LUNA_PROFILES: 'luna_profiles',
  INTERACTION_PROFILES: 'interaction_profiles',

  // Emotional data
  AFFECTION_SCORES: 'affection_scores',
  EMOTIONAL_STATES: 'emotional_states',

  // Clusters and drift
  CLUSTERS: 'luna_clusters',
  DRIFT: 'drift_logs',

  // Consolidation
  CONSOLIDATION_LOGS: 'consolidation_logs',
  CONSOLIDATION_AUDIT: 'consolidation_audit'
};

/**
 * Get a collection reference by name
 *
 * @param {string} collectionName - Collection name from COLLECTIONS
 * @returns {FirebaseFirestore.CollectionReference}
 */
function collection(collectionName) {
  return getFirestore().collection(collectionName);
}

/**
 * Get a document reference
 *
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {FirebaseFirestore.DocumentReference}
 */
function doc(collectionName, docId) {
  return getFirestore().collection(collectionName).doc(docId);
}

/**
 * Get a subcollection reference
 *
 * @param {string} collectionName - Parent collection name
 * @param {string} docId - Parent document ID
 * @param {string} subcollectionName - Subcollection name
 * @returns {FirebaseFirestore.CollectionReference}
 */
function subcollection(collectionName, docId, subcollectionName) {
  return getFirestore()
    .collection(collectionName)
    .doc(docId)
    .collection(subcollectionName);
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Create a new batch for multiple writes
 *
 * @returns {FirebaseFirestore.WriteBatch}
 */
function batch() {
  return getFirestore().batch();
}

/**
 * Run a transaction
 *
 * @param {Function} updateFunction - Transaction function
 * @returns {Promise<any>}
 */
function runTransaction(updateFunction) {
  return getFirestore().runTransaction(updateFunction);
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check Firestore connection health
 */
async function healthCheck() {
  try {
    const testRef = getFirestore().collection('_health_check').doc('ping');
    await testRef.set({ timestamp: admin.firestore.FieldValue.serverTimestamp() });
    await testRef.delete();

    return {
      connected: true,
      database: 'firestore',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      connected: false,
      database: 'firestore',
      error: error.message
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Core functions
  getFirestore,
  getAdmin,
  getFieldValue,
  getTimestamp,
  initializeFirebaseAdmin,

  // Collection helpers
  COLLECTIONS,
  collection,
  doc,
  subcollection,

  // Batch operations
  batch,
  runTransaction,

  // Health check
  healthCheck,

  // Shorthand for common operations
  db: () => getFirestore(),
  FieldValue: admin.firestore.FieldValue,
  Timestamp: admin.firestore.Timestamp
};
