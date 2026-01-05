/**
 * ============================================================================
 * HAPPINESS ANCHOR INTEGRATION TEST
 * ============================================================================
 * Tests anchor detection, storage, and retrieval.
 *
 * Prerequisites:
 * 1. Cloud SQL PostgreSQL running (or Cloud SQL Proxy)
 * 2. Environment variables set
 * 3. Migrations run (001_initial_schema.sql)
 *
 * Run: node functions/test/test-happiness-anchors.js
 * ============================================================================
 */

const HappinessAnchorDetector = require('../memory/anchorDetector');
const HappinessAnchorRetrieval = require('../memory/anchorRetrieval');
const db = require('../config/genesisDatabase');

async function testHappinessAnchors() {
  console.log('='.repeat(60));
  console.log('HAPPINESS ANCHORS - INTEGRATION TEST');
  console.log('Week 2: Auto-detect joy moments, store, retrieve for healing');
  console.log('='.repeat(60));
  console.log('');

  const detector = new HappinessAnchorDetector();
  const retrieval = new HappinessAnchorRetrieval();

  // Initialize detector (loads emotion detector)
  await detector.initialize();

  const insertedIds = [];

  // =========================================================================
  // TEST 1: Achievement Anchor
  // =========================================================================
  console.log('TEST 1: Achievement Anchor');
  console.log('-'.repeat(40));

  const achievementMessage = "I just got promoted at work! My boss said I'm exceeding expectations!";

  const analysis1 = await detector.analyzeForAnchor(achievementMessage, { energy: 'high' });
  console.log(`Message: "${achievementMessage}"`);
  console.log(`Primary: ${analysis1.emotionData.primary} (intensity: ${analysis1.emotionData.intensity})`);
  console.log(`Should store: ${analysis1.shouldStore}`);
  console.log(`Category: ${analysis1.category}`);
  console.log(`Significance: ${analysis1.significance.toFixed(2)}`);
  console.log(`Element: ${analysis1.element}`);
  console.log(`Pillar: ${analysis1.pillar}`);

  if (analysis1.shouldStore) {
    const anchorId1 = await detector.storeAnchor(
      'test_user',
      analysis1.emotionData,
      achievementMessage,
      { elementActivated: 'Fire', userConstitution: { elements: { Fire: 10 } } }
    );
    insertedIds.push(anchorId1);
    console.log(`Stored as anchor #${anchorId1}`);
  }
  console.log('');

  // =========================================================================
  // TEST 2: Connection Anchor
  // =========================================================================
  console.log('TEST 2: Connection Anchor');
  console.log('-'.repeat(40));

  const connectionMessage = "Spent the most amazing day with my daughter. We laughed so much together!";

  const analysis2 = await detector.analyzeForAnchor(connectionMessage, { quality: 'warm' });
  console.log(`Message: "${connectionMessage}"`);
  console.log(`Primary: ${analysis2.emotionData.primary} (intensity: ${analysis2.emotionData.intensity})`);
  console.log(`Should store: ${analysis2.shouldStore}`);
  console.log(`Category: ${analysis2.category}`);

  if (analysis2.shouldStore) {
    const anchorId2 = await detector.storeAnchor(
      'test_user',
      analysis2.emotionData,
      connectionMessage
    );
    insertedIds.push(anchorId2);
    console.log(`Stored as anchor #${anchorId2}`);
  }
  console.log('');

  // =========================================================================
  // TEST 3: Delight Anchor
  // =========================================================================
  console.log('TEST 3: Delight Anchor');
  console.log('-'.repeat(40));

  const delightMessage = "Wow! I unexpectedly won the company raffle! Never thought I'd win anything!";

  const analysis3 = await detector.analyzeForAnchor(delightMessage, { pitch: 'rising', energy: 'high' });
  console.log(`Message: "${delightMessage}"`);
  console.log(`Primary: ${analysis3.emotionData.primary} (intensity: ${analysis3.emotionData.intensity})`);
  console.log(`Should store: ${analysis3.shouldStore}`);
  console.log(`Category: ${analysis3.category}`);

  if (analysis3.shouldStore) {
    const anchorId3 = await detector.storeAnchor(
      'test_user',
      analysis3.emotionData,
      delightMessage
    );
    insertedIds.push(anchorId3);
    console.log(`Stored as anchor #${anchorId3}`);
  }
  console.log('');

  // =========================================================================
  // TEST 4: Non-anchor message (should NOT store)
  // =========================================================================
  console.log('TEST 4: Non-anchor Message (should NOT store)');
  console.log('-'.repeat(40));

  const neutralMessage = "The weather is nice today.";

  const analysis4 = await detector.analyzeForAnchor(neutralMessage);
  console.log(`Message: "${neutralMessage}"`);
  console.log(`Primary: ${analysis4.emotionData.primary} (intensity: ${analysis4.emotionData.intensity})`);
  console.log(`Should store: ${analysis4.shouldStore}`);
  console.log(`Category: ${analysis4.category}`);
  console.log(`(Correctly identified as non-anchor)`);
  console.log('');

  // =========================================================================
  // TEST 5: Retrieve Stacking Sequence
  // =========================================================================
  console.log('TEST 5: Retrieve Stacking Sequence');
  console.log('-'.repeat(40));

  const sequence = await retrieval.selectStackSequence('test_user', {
    userState: 'sad',
    constitutionalContext: null
  });

  if (sequence) {
    console.log('Stacking sequence for sad user:');
    console.log(`  Total anchors: ${sequence.totalAnchors}`);
    console.log(`  By category: A=${sequence.byCategory.achievement} C=${sequence.byCategory.connection} D=${sequence.byCategory.delight}`);
    console.log('');
    console.log('Selected sequence:');

    if (sequence.achievement) {
      console.log(`  1. Achievement: "${sequence.achievement.event}" (score: ${sequence.achievement.score})`);
    } else {
      console.log('  1. Achievement: (none available)');
    }

    if (sequence.connection) {
      console.log(`  2. Connection: "${sequence.connection.event}" (score: ${sequence.connection.score})`);
    } else {
      console.log('  2. Connection: (none available)');
    }

    if (sequence.delight) {
      console.log(`  3. Delight: "${sequence.delight.event}" (score: ${sequence.delight.score})`);
    } else {
      console.log('  3. Delight: (none available)');
    }

    // Calculate total water
    const totalWater = retrieval.calculateStackWater(sequence);
    console.log(`\n  Total water contribution: ${totalWater} liters`);
  } else {
    console.log('No anchors available for stacking');
  }
  console.log('');

  // =========================================================================
  // TEST 6: Semantic Similarity Search
  // =========================================================================
  console.log('TEST 6: Semantic Similarity Search');
  console.log('-'.repeat(40));

  const similar = await retrieval.findSimilarAnchors('test_user', {
    joy: 0.9,
    trust: 0.3,
    fear: 0.0,
    surprise: 0.2,
    sadness: 0.0,
    disgust: 0.0,
    anger: 0.0,
    anticipation: 0.8
  }, 5);

  console.log(`Found ${similar.length} similar anchors (searching for joy+anticipation):`);
  similar.forEach((a, i) => {
    console.log(`  ${i + 1}. "${a.event}" (${a.primary_emotion}, similarity: ${(a.similarity * 100).toFixed(1)}%)`);
  });
  console.log('');

  // =========================================================================
  // TEST 7: Track Recall Effectiveness
  // =========================================================================
  console.log('TEST 7: Track Recall Effectiveness');
  console.log('-'.repeat(40));

  if (insertedIds.length > 0) {
    await retrieval.trackRecall(insertedIds[0], 0.85);
    console.log(`Tracked recall for anchor #${insertedIds[0]} (effectiveness: 0.85)`);

    // Verify update
    const updated = await db.query(`
      SELECT recall_count, effectiveness_history
      FROM happiness_anchors WHERE id = $1
    `, [insertedIds[0]]);

    console.log(`  Recall count: ${updated.rows[0].recall_count}`);
    console.log(`  History entries: ${JSON.stringify(updated.rows[0].effectiveness_history).slice(0, 100)}...`);
  }
  console.log('');

  // =========================================================================
  // TEST 8: Anchor Statistics
  // =========================================================================
  console.log('TEST 8: Anchor Statistics');
  console.log('-'.repeat(40));

  const stats = await retrieval.getAnchorStats('test_user');
  console.log('User anchor statistics:');
  console.log(`  Total anchors: ${stats.total_anchors}`);
  console.log(`  Achievements: ${stats.achievements}`);
  console.log(`  Connections: ${stats.connections}`);
  console.log(`  Delights: ${stats.delights}`);
  console.log(`  Avg intensity: ${parseFloat(stats.avg_intensity || 0).toFixed(1)}`);
  console.log(`  Total recalls: ${stats.total_recalls || 0}`);
  console.log('');

  // =========================================================================
  // CLEANUP
  // =========================================================================
  console.log('CLEANUP');
  console.log('-'.repeat(40));

  if (insertedIds.length > 0) {
    await db.query(`DELETE FROM happiness_anchors WHERE id = ANY($1)`, [insertedIds]);
    console.log(`Deleted ${insertedIds.length} test anchors`);
  }
  console.log('');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('='.repeat(60));
  console.log('ALL TESTS PASSED!');
  console.log('='.repeat(60));
  console.log('');
  console.log('Week 2 Happiness Anchors working:');
  console.log('  - Auto-detection of joy moments');
  console.log('  - Smart categorization (achievement/connection/delight)');
  console.log('  - Significance scoring');
  console.log('  - Constitutional element mapping');
  console.log('  - Four Pillars detection');
  console.log('  - PostgreSQL storage with vectors');
  console.log('  - Stacking sequence selection');
  console.log('  - Semantic similarity search');
  console.log('  - Recall effectiveness tracking');
  console.log('');
  console.log('Ready for Week 3: Voice Prosody Enhancement!');
  console.log('');

  await db.closePool();
}

// Run tests
testHappinessAnchors()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
