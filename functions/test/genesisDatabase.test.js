/**
 * ============================================================================
 * GENESIS LUNA - DATABASE TEST
 * ============================================================================
 * Tests PostgreSQL connection, pgvector, and all GENESIS tables.
 *
 * Run: node functions/test/genesisDatabase.test.js
 *
 * Before running:
 * 1. Set environment variables (DB_USER, DB_PASSWORD, etc.)
 * 2. Ensure Cloud SQL proxy is running (for local dev)
 * 3. Run migrations first
 * ============================================================================
 */

const db = require('../config/genesisDatabase');

async function testDatabase() {
  console.log('='.repeat(60));
  console.log('GENESIS LUNA - DATABASE TEST');
  console.log('='.repeat(60));
  console.log('');

  // Test 1: Health Check
  console.log('TEST 1: Health Check');
  console.log('-'.repeat(40));

  const health = await db.healthCheck();

  if (!health.connected) {
    console.error('FAILED: Database not connected');
    console.error('Error:', health.error);
    process.exit(1);
  }

  console.log('Connected:', health.connected);
  console.log('Database:', health.database);
  console.log('Version:', health.version);
  console.log('pgvector:', health.pgvectorEnabled ? `Enabled (v${health.pgvectorVersion})` : 'NOT INSTALLED');
  console.log('Tables:', health.tables.length > 0 ? health.tables.join(', ') : 'None');
  console.log('');

  if (!health.pgvectorEnabled) {
    console.error('FAILED: pgvector extension not installed');
    console.error('Run: CREATE EXTENSION vector;');
    process.exit(1);
  }

  // Test 2: Insert Emotion Detection
  console.log('TEST 2: Insert Emotion Detection');
  console.log('-'.repeat(40));

  try {
    const plutchikVector = db.formatVector([0.9, 0.3, 0.1, 0.2, 0.0, 0.0, 0.0, 0.4]);

    const result = await db.query(
      `INSERT INTO emotion_detections
       (user_id, message, primary_emotion, primary_intensity, plutchik_vector, compounds)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      ['test_user', 'I am so happy and excited!', 'joy', 9, plutchikVector, JSON.stringify([{ type: 'optimism', score: 0.85 }])]
    );

    console.log('Inserted emotion detection, ID:', result.rows[0].id);
  } catch (error) {
    console.error('FAILED:', error.message);
    if (error.message.includes('does not exist')) {
      console.error('Run migrations first: \\i migrations/001_initial_schema.sql');
    }
    process.exit(1);
  }
  console.log('');

  // Test 3: Vector Similarity Search
  console.log('TEST 3: Vector Similarity Search');
  console.log('-'.repeat(40));

  try {
    const searchVector = db.formatVector([0.85, 0.25, 0.15, 0.25, 0.0, 0.0, 0.0, 0.35]);

    const similar = await db.query(`
      SELECT id, message, primary_emotion,
             1 - (plutchik_vector <=> $1::vector) as similarity
      FROM emotion_detections
      WHERE user_id = 'test_user'
      ORDER BY plutchik_vector <=> $1::vector
      LIMIT 5
    `, [searchVector]);

    console.log('Similar emotions found:', similar.rowCount);
    similar.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. [${(row.similarity * 100).toFixed(1)}%] ${row.primary_emotion}: ${row.message.slice(0, 40)}`);
    });
  } catch (error) {
    console.error('FAILED:', error.message);
    process.exit(1);
  }
  console.log('');

  // Test 4: Insert Happiness Anchor (with 768-dim embedding)
  console.log('TEST 4: Insert Happiness Anchor');
  console.log('-'.repeat(40));

  try {
    const plutchikVector = db.formatVector([0.95, 0.4, 0.0, 0.3, 0.0, 0.0, 0.0, 0.2]);
    // Create a mock 768-dimension embedding
    const embedding768 = new Array(768).fill(0).map((_, i) => Math.sin(i * 0.01));
    const embeddingStr = db.formatVector(embedding768);

    const result = await db.query(
      `INSERT INTO happiness_anchors
       (user_id, event, user_quote, primary_emotion, primary_intensity,
        plutchik_vector, category, embedding, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        'test_user',
        'Got promoted at work!',
        'I finally did it after 3 years!',
        'joy',
        9,
        plutchikVector,
        'achievement',
        embeddingStr,
        ['career', 'success', 'achievement']
      ]
    );

    console.log('Inserted happiness anchor, ID:', result.rows[0].id);
  } catch (error) {
    console.error('FAILED:', error.message);
    process.exit(1);
  }
  console.log('');

  // Test 5: Initialize Bathtub State
  console.log('TEST 5: Initialize Emotional Bathtub');
  console.log('-'.repeat(40));

  try {
    // Use upsert to handle existing rows
    const result = await db.query(
      `INSERT INTO user_emotional_bathtub
       (user_id, salt_amount, water_volume, concentration, state)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
         water_volume = EXCLUDED.water_volume,
         concentration = EXCLUDED.concentration,
         state = EXCLUDED.state,
         updated_at = NOW()
       RETURNING user_id, concentration, state`,
      ['test_user', 35, 65, 0.35, 'VERY_SAD']
    );

    const row = result.rows[0];
    console.log(`Bathtub initialized: ${row.user_id}`);
    console.log(`  Concentration: ${(row.concentration * 100).toFixed(1)}%`);
    console.log(`  State: ${row.state}`);
  } catch (error) {
    console.error('FAILED:', error.message);
    process.exit(1);
  }
  console.log('');

  // Test 6: Initialize Relationship
  console.log('TEST 6: Initialize Luna Relationship');
  console.log('-'.repeat(40));

  try {
    const result = await db.query(
      `INSERT INTO user_luna_relationship
       (user_id, trust, intimacy, playfulness, openness, stage)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         trust = EXCLUDED.trust,
         stage = EXCLUDED.stage,
         updated_at = NOW()
       RETURNING user_id, trust, stage`,
      ['test_user', 0.1, 0.05, 0.1, 0.05, 'SEED']
    );

    const row = result.rows[0];
    console.log(`Relationship initialized: ${row.user_id}`);
    console.log(`  Trust: ${(row.trust * 100).toFixed(1)}%`);
    console.log(`  Stage: ${row.stage}`);
  } catch (error) {
    console.error('FAILED:', error.message);
    process.exit(1);
  }
  console.log('');

  // Cleanup
  console.log('CLEANUP: Removing test data');
  console.log('-'.repeat(40));

  try {
    await db.query(`DELETE FROM emotion_detections WHERE user_id = 'test_user'`);
    await db.query(`DELETE FROM happiness_anchors WHERE user_id = 'test_user'`);
    await db.query(`DELETE FROM user_emotional_bathtub WHERE user_id = 'test_user'`);
    await db.query(`DELETE FROM user_luna_relationship WHERE user_id = 'test_user'`);
    console.log('Test data cleaned up');
  } catch (error) {
    console.warn('Cleanup warning:', error.message);
  }
  console.log('');

  // Summary
  console.log('='.repeat(60));
  console.log('ALL TESTS PASSED!');
  console.log('='.repeat(60));
  console.log('');
  console.log('GENESIS Luna database is ready for Week 1 implementation.');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Start coding Plutchik emotion detection');
  console.log('  2. Add trust and anticipation to emotionSchema.json');
  console.log('  3. Create emotionDetector.js');
  console.log('');

  await db.closePool();
}

// Run tests
testDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
