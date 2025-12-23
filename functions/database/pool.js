/**
 * ============================================================================
 * DATABASE CONNECTION POOL
 * ============================================================================
 * PostgreSQL connection pool for timeline intelligence.
 * Uses Cloud SQL with pgvector extension for semantic search.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { Pool } = require('pg');

// ============================================================================
// CONFIGURATION
// ============================================================================

let pool = null;

/**
 * Get or create the PostgreSQL connection pool
 * Supports both Cloud SQL (via Unix socket) and direct connection
 */
function getPool() {
  if (pool) return pool;

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && process.env.INSTANCE_CONNECTION_NAME) {
    // Cloud SQL connection via Unix socket
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'astroprofile',
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  } else {
    // Direct connection (local dev or external)
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'astroprofile',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
  }

  // Error handling
  pool.on('error', (err) => {
    console.error('[Database] Unexpected pool error:', err.message);
  });

  pool.on('connect', () => {
    console.log('[Database] New client connected to pool');
  });

  return pool;
}

/**
 * Execute a query with automatic connection handling
 */
async function query(text, params) {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`[Database] Slow query (${duration}ms):`, text.slice(0, 100));
    }

    return result;
  } catch (error) {
    console.error('[Database] Query error:', error.message);
    console.error('[Database] Query:', text.slice(0, 200));
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
async function getClient() {
  const pool = getPool();
  const client = await pool.connect();

  // Add transaction helpers
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
 * Check database connectivity and pgvector extension
 */
async function healthCheck() {
  try {
    const result = await query('SELECT NOW() as time, version() as version');
    const pgvector = await query(
      "SELECT extname FROM pg_extension WHERE extname = 'vector'"
    );

    return {
      connected: true,
      time: result.rows[0].time,
      version: result.rows[0].version.split(' ')[0],
      pgvectorEnabled: pgvector.rowCount > 0
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}

/**
 * Close the pool (for cleanup)
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[Database] Pool closed');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getPool,
  query,
  getClient,
  withTransaction,
  healthCheck,
  closePool
};
