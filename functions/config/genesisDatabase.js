/**
 * ============================================================================
 * GENESIS LUNA - DATABASE CONNECTION
 * ============================================================================
 * PostgreSQL connection pool optimized for GENESIS Luna AI.
 * Uses Cloud SQL with pgvector extension for neural memory.
 *
 * Created: December 30, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const { Pool } = require('pg');

// ============================================================================
// CONFIGURATION
// ============================================================================

let genesisPool = null;

/**
 * Get or create the GENESIS PostgreSQL connection pool
 * Supports both Cloud SQL (via Unix socket) and direct connection
 */
function getGenesisPool() {
  if (genesisPool) return genesisPool;

  const isProduction = process.env.NODE_ENV === 'production';
  const connectionName = process.env.CLOUD_SQL_CONNECTION_NAME || process.env.INSTANCE_CONNECTION_NAME;

  if (isProduction && connectionName) {
    // Cloud SQL connection via Unix socket (Firebase Functions)
    genesisPool = new Pool({
      user: process.env.GENESIS_DB_USER || process.env.DB_USER || 'postgres',
      password: process.env.GENESIS_DB_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.GENESIS_DB_NAME || 'genesis',
      host: `/cloudsql/${connectionName}`,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  } else {
    // Direct connection (local dev or external)
    genesisPool = new Pool({
      user: process.env.GENESIS_DB_USER || process.env.DB_USER || 'postgres',
      password: process.env.GENESIS_DB_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.GENESIS_DB_NAME || 'genesis',
      host: process.env.GENESIS_DB_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.GENESIS_DB_PORT || process.env.DB_PORT || '5432', 10),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
  }

  // Event handlers
  genesisPool.on('connect', () => {
    console.log('[GENESIS] PostgreSQL client connected');
  });

  genesisPool.on('error', (err) => {
    console.error('[GENESIS] PostgreSQL pool error:', err.message);
  });

  return genesisPool;
}

/**
 * Execute a query with automatic connection handling
 */
async function query(text, params) {
  const pool = getGenesisPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`[GENESIS] Slow query (${duration}ms):`, text.slice(0, 100));
    }

    return result;
  } catch (error) {
    console.error('[GENESIS] Query error:', error.message);
    console.error('[GENESIS] Query:', text.slice(0, 200));
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
async function getClient() {
  const pool = getGenesisPool();
  const client = await pool.connect();

  const originalRelease = client.release.bind(client);
  client.release = () => {
    client.release = originalRelease;
    return originalRelease();
  };

  return client;
}

/**
 * Execute a function within a transaction
 */
async function withTransaction(fn) {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health check for GENESIS database
 */
async function healthCheck() {
  try {
    const result = await query('SELECT NOW() as time, version() as version');
    const pgvector = await query(
      "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'"
    );

    const tables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    return {
      connected: true,
      database: 'genesis',
      time: result.rows[0].time,
      version: result.rows[0].version.split(' ')[0],
      pgvectorEnabled: pgvector.rowCount > 0,
      pgvectorVersion: pgvector.rows[0]?.extversion || null,
      tables: tables.rows.map(r => r.table_name)
    };
  } catch (error) {
    return {
      connected: false,
      database: 'genesis',
      error: error.message
    };
  }
}

/**
 * Close the pool (for cleanup)
 */
async function closePool() {
  if (genesisPool) {
    await genesisPool.end();
    genesisPool = null;
    console.log('[GENESIS] Pool closed');
  }
}

// ============================================================================
// VECTOR HELPERS
// ============================================================================

/**
 * Format an array as a pgvector string
 * @param {number[]} arr - Array of numbers
 * @returns {string} - PostgreSQL vector format '[1,2,3]'
 */
function formatVector(arr) {
  return `[${arr.join(',')}]`;
}

/**
 * Parse a pgvector string to array
 * @param {string} str - PostgreSQL vector format '[1,2,3]'
 * @returns {number[]} - Array of numbers
 */
function parseVector(str) {
  if (!str) return null;
  return str.replace(/[\[\]]/g, '').split(',').map(Number);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getPool: getGenesisPool,
  query,
  getClient,
  withTransaction,
  healthCheck,
  closePool,
  formatVector,
  parseVector
};
