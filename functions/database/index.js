/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATABASE SERVICES INDEX
 * Central export for all database services
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Exports:
 * - PostgreSQL connection pool (pgvector-enabled)
 * - GENESIS Luna database (for emotional intelligence)
 * - Firestore singleton client (NEW)
 * - Firestore services for interaction profiles, clusters, and drift
 * - Database initialization utilities
 *
 * Created: December 21, 2025
 * Updated: December 22, 2025 - Added PostgreSQL pool
 * Updated: December 30, 2025 - Added GENESIS Luna database config
 * Updated: December 31, 2025 - Added Firestore singleton client
 */

// PostgreSQL pool (for timeline + pgvector)
const pool = require('./pool');

// GENESIS Luna database (for emotional intelligence + neural memory)
const genesisDatabase = require('../config/genesisDatabase');

// Firestore singleton client (use this for new code)
const firestoreClient = require('./firestoreClient');

// Firestore services
const interactionProfileService = require('./firestore/interactionProfileService');
const clusterService = require('./firestore/clusterService');
const driftService = require('./firestore/driftService');

// Initialization
const { initializeFirestore, initializePostgres } = require('./initDatabase');

module.exports = {
  // PostgreSQL pool (original astroprofile database)
  pool,
  query: pool.query,
  getClient: pool.getClient,
  withTransaction: pool.withTransaction,
  healthCheck: pool.healthCheck,

  // GENESIS Luna database (emotional intelligence + neural memory)
  genesis: genesisDatabase,
  genesisQuery: genesisDatabase.query,
  genesisHealthCheck: genesisDatabase.healthCheck,

  // Firestore singleton (use this for new code)
  firestore: firestoreClient,
  getFirestore: firestoreClient.getFirestore,
  firestoreHealthCheck: firestoreClient.healthCheck,
  COLLECTIONS: firestoreClient.COLLECTIONS,

  // Interaction profile operations
  profiles: interactionProfileService,

  // Cluster operations
  clusters: clusterService,

  // Drift operations
  drift: driftService,

  // Initialization
  init: {
    firestore: initializeFirestore,
    postgres: initializePostgres
  },

  // Direct service access
  interactionProfileService,
  clusterService,
  driftService,
  genesisDatabase,
  firestoreClient
};
