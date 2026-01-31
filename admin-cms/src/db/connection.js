/**
 * PostgreSQL Database Connection
 */

const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'genesis_cms',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test connection
async function testConnection() {
  const client = await pool.connect()
  try {
    await client.query('SELECT NOW()')
    return true
  } finally {
    client.release()
  }
}

// Query helper with error handling
async function query(text, params) {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    if (process.env.NODE_ENV !== 'production') {
      console.log('Query executed', { text: text.substring(0, 50), duration, rows: result.rowCount })
    }
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Transaction helper
async function transaction(callback) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testConnection
}
