/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATABASE SERVICES INDEX
 * Central export for all database services
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Exports:
 * - PostgreSQL connection pool (pgvector-enabled)
 * - Firestore services for interaction profiles, clusters, and drift
 * - Database initialization utilities
 *
 * Created: December 21, 2025
 * Updated: December 22, 2025 - Added PostgreSQL pool
 */

// PostgreSQL pool (for timeline + pgvector)
const pool = require('./pool');

// Firestore services
const interactionProfileService = require('./firestore/interactionProfileService');
const clusterService = require('./firestore/clusterService');
const driftService = require('./firestore/driftService');

// Initialization
const { initializeFirestore, initializePostgres } = require('./initDatabase');

module.exports = {
  // PostgreSQL pool
  pool,
  query: pool.query,
  getClient: pool.getClient,
  withTransaction: pool.withTransaction,
  healthCheck: pool.healthCheck,

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
  driftService
};
