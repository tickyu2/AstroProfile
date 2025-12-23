/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATABASE INITIALIZATION SCRIPT
 * Initializes Firestore collections and PostgreSQL tables
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Usage:
 *   node functions/database/initDatabase.js [--firestore] [--postgres] [--all]
 *
 * Options:
 *   --firestore  Initialize Firestore collections only
 *   --postgres   Initialize PostgreSQL tables only
 *   --all        Initialize both (default)
 *
 * Environment variables:
 *   GOOGLE_APPLICATION_CREDENTIALS - Path to Firebase service account key
 *   POSTGRES_CONNECTION_STRING - PostgreSQL connection string
 *
 * Created: December 21, 2025
 */

const admin = require('firebase-admin');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const SCHEMAS_DIR = path.join(__dirname, 'schemas');

const SCHEMA_FILES = [
  '001_interaction_profiles.sql',
  '002_cluster_profiles.sql',
  '003_drift_parameters.sql'
];

// ═══════════════════════════════════════════════════════════════════════════════
// FIRESTORE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initializeFirestore() {
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('  INITIALIZING FIRESTORE');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  // Initialize Firebase Admin if not already done
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const db = admin.firestore();

  try {
    // Import services
    const clusterService = require('./firestore/clusterService');
    const driftService = require('./firestore/driftService');

    // 1. Initialize cluster definitions
    console.log('  [1/3] Initializing cluster definitions...');
    const clusterResult = await clusterService.initializeDefaultClusters();
    console.log(`        ✓ Clusters initialized: ${clusterResult.clusters.join(', ')}`);

    // 2. Initialize global drift config
    console.log('  [2/3] Initializing global drift configuration...');
    const driftResult = await driftService.initializeGlobalDrift();
    console.log('        ✓ Global drift initialized');

    // 3. Create Firestore indexes (informational - actual indexes in firestore.indexes.json)
    console.log('  [3/3] Firestore indexes...');
    console.log('        ℹ Indexes are defined in firestore.indexes.json');
    console.log('        ℹ Deploy with: firebase deploy --only firestore:indexes');

    console.log('\n  ✅ Firestore initialization complete!\n');
    return { success: true };

  } catch (error) {
    console.error('  ❌ Firestore initialization failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POSTGRESQL INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initializePostgres() {
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('  INITIALIZING POSTGRESQL');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const connectionString = process.env.POSTGRES_CONNECTION_STRING;

  if (!connectionString) {
    console.log('  ℹ POSTGRES_CONNECTION_STRING not set');
    console.log('  ℹ Skipping PostgreSQL initialization');
    console.log('  ℹ Set the environment variable to enable PostgreSQL\n');
    return { success: true, skipped: true };
  }

  const pool = new Pool({ connectionString });

  try {
    // Test connection
    console.log('  [0/3] Testing connection...');
    await pool.query('SELECT NOW()');
    console.log('        ✓ Connected to PostgreSQL');

    // Run schema files in order
    for (let i = 0; i < SCHEMA_FILES.length; i++) {
      const schemaFile = SCHEMA_FILES[i];
      const schemaPath = path.join(SCHEMAS_DIR, schemaFile);

      console.log(`  [${i + 1}/${SCHEMA_FILES.length}] Running ${schemaFile}...`);

      if (!fs.existsSync(schemaPath)) {
        console.log(`        ⚠ Schema file not found: ${schemaPath}`);
        continue;
      }

      const sql = fs.readFileSync(schemaPath, 'utf8');

      try {
        await pool.query(sql);
        console.log('        ✓ Schema applied successfully');
      } catch (schemaError) {
        // Some errors are expected (e.g., table already exists)
        if (schemaError.code === '42P07') {
          console.log('        ℹ Tables already exist (skipping)');
        } else {
          console.log(`        ⚠ Warning: ${schemaError.message}`);
        }
      }
    }

    // Verify tables were created
    console.log('\n  Verifying tables...');
    const tableCheck = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
          'user_interaction_profile',
          'interaction_session_snapshot',
          'interaction_clusters',
          'user_cluster_assignment',
          'cluster_analytics',
          'global_drift_config',
          'user_personality_drift',
          'drift_history',
          'drift_signal_log'
        )
      ORDER BY table_name
    `);

    console.log(`  Found ${tableCheck.rows.length} tables:`);
    tableCheck.rows.forEach(row => {
      console.log(`    ✓ ${row.table_name}`);
    });

    await pool.end();
    console.log('\n  ✅ PostgreSQL initialization complete!\n');
    return { success: true, tables: tableCheck.rows.map(r => r.table_name) };

  } catch (error) {
    console.error('  ❌ PostgreSQL initialization failed:', error.message);
    await pool.end();
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║                    LUNA DATABASE INITIALIZATION                       ║');
  console.log('║                    Interaction Memory & Drift                         ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝');

  const args = process.argv.slice(2);
  const initFirestore = args.includes('--firestore') || args.includes('--all') || args.length === 0;
  const initPostgres = args.includes('--postgres') || args.includes('--all') || args.length === 0;

  const results = {};

  if (initFirestore) {
    results.firestore = await initializeFirestore();
  }

  if (initPostgres) {
    results.postgres = await initializePostgres();
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  if (results.firestore) {
    console.log(`  Firestore: ${results.firestore.success ? '✅ Success' : '❌ Failed'}`);
  }

  if (results.postgres) {
    if (results.postgres.skipped) {
      console.log('  PostgreSQL: ⏭ Skipped (no connection string)');
    } else {
      console.log(`  PostgreSQL: ${results.postgres.success ? '✅ Success' : '❌ Failed'}`);
    }
  }

  console.log('\n');

  // Exit with error code if any failed
  const failed = Object.values(results).some(r => !r.success && !r.skipped);
  process.exit(failed ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = {
  initializeFirestore,
  initializePostgres
};
