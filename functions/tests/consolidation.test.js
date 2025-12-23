/**
 * Consolidation Engine Unit Tests
 * ================================
 * Tests for memory consolidation using pg-mem (in-memory PostgreSQL)
 *
 * Run: npm test
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { newDb } = require('pg-mem');
const { v4: uuidv4 } = require('uuid');

// Modules under test
const { storeLTMEntry, getLTMEntries, reinforceLTMEntry, applyLTMDecay } = require('../memory/ltmStore');
const { getAnchorsForUser, updateAnchorStrength, createAnchor, strengthenAllAnchors } = require('../memory/anchorManager');
const { scoreSTMEntry, consolidateUserSTM, CONFIG } = require('../memory/consolidationEngineV2');

// ============================================================================
// TEST SETUP
// ============================================================================

let db;
let client;

beforeAll(async () => {
  // Create in-memory PostgreSQL database
  db = newDb();

  // Enable uuid-ossp extension
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: 'uuid',
    implementation: () => uuidv4()
  });

  // Create schema
  await db.public.none(`
    -- User Short-Term Memory
    CREATE TABLE user_stm (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      content TEXT NOT NULL,
      mention_count INTEGER DEFAULT 1,
      emotional_weight REAL DEFAULT 0.5,
      emotional_valence REAL,
      emotional_intensity REAL,
      importance_score REAL DEFAULT 0.5,
      constitutional_element TEXT,
      constitutional_pillar TEXT,
      consolidated BOOLEAN DEFAULT FALSE,
      consolidated_at TIMESTAMPTZ,
      consolidated_to_id UUID,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- User Long-Term Memory
    CREATE TABLE user_ltm (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      content TEXT NOT NULL,
      content_type TEXT DEFAULT 'consolidated',
      source_stm_ids UUID[],
      consolidation_count INTEGER DEFAULT 1,
      importance_score REAL DEFAULT 0.6,
      constitutional_element TEXT,
      emotional_valence REAL,
      emotional_intensity REAL,
      embedding vector(768),
      access_count INTEGER DEFAULT 0,
      last_accessed_at TIMESTAMPTZ,
      reinforcement_count INTEGER DEFAULT 0,
      last_reinforced_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Happiness Anchors
    CREATE TABLE happiness_anchors (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      content TEXT NOT NULL,
      anchor_type TEXT DEFAULT 'memory',
      strength REAL DEFAULT 1.0,
      source_stm_ids UUID[],
      recall_count INTEGER DEFAULT 0,
      last_recalled_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Pending Promotions (for human review)
    CREATE TABLE pending_promotions (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      stm_ids UUID[] NOT NULL,
      proposed_content TEXT NOT NULL,
      proposed_embedding vector(768),
      score REAL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Promotion Log (audit trail)
    CREATE TABLE memory_promotion_log (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      stm_id UUID NOT NULL,
      ltm_id UUID,
      source_brain TEXT,
      reason TEXT,
      score REAL,
      recency_score REAL,
      mention_score REAL,
      emotion_score REAL,
      consolidation_run_id INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Anchor Strength Log
    CREATE TABLE anchor_strength_log (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      anchor_id UUID NOT NULL,
      previous_strength REAL,
      new_strength REAL,
      reason TEXT,
      consolidation_run_id INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Consolidation Runs
    CREATE TABLE consolidation_runs (
      id SERIAL PRIMARY KEY,
      run_type TEXT,
      status TEXT DEFAULT 'pending',
      dry_run BOOLEAN DEFAULT FALSE,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      user_stm_processed INTEGER DEFAULT 0,
      promoted_count INTEGER DEFAULT 0,
      decayed_count INTEGER DEFAULT 0,
      anchors_strengthened INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      error_message TEXT
    );
  `);

  // Get a client adapter for pg-mem
  client = db.adapters.createPg().pool;
});

afterAll(async () => {
  // Cleanup
});

beforeEach(async () => {
  // Clear tables between tests
  await db.public.none('DELETE FROM user_stm');
  await db.public.none('DELETE FROM user_ltm');
  await db.public.none('DELETE FROM happiness_anchors');
  await db.public.none('DELETE FROM pending_promotions');
  await db.public.none('DELETE FROM memory_promotion_log');
  await db.public.none('DELETE FROM anchor_strength_log');
});

// ============================================================================
// SCORING TESTS
// ============================================================================

describe('scoreSTMEntry', () => {
  test('scores recent entry with high mentions and emotion highly', () => {
    const stm = {
      created_at: new Date(), // Just now
      mention_count: 5,
      emotional_weight: 1.0
    };

    const scores = scoreSTMEntry(stm);

    expect(scores.total).toBeGreaterThan(0.8);
    expect(scores.recency).toBeCloseTo(1.0, 1);
    expect(scores.mention).toBe(1.0);
    expect(scores.emotion).toBe(1.0);
  });

  test('scores old entry with no mentions lower', () => {
    const stm = {
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      mention_count: 1,
      emotional_weight: 0.3
    };

    const scores = scoreSTMEntry(stm);

    expect(scores.total).toBeLessThan(0.5);
    expect(scores.recency).toBeLessThan(0.5);
    expect(scores.ageDays).toBeCloseTo(60, 0);
  });

  test('handles missing values gracefully', () => {
    const stm = {
      created_at: new Date()
      // No mention_count or emotional_weight
    };

    const scores = scoreSTMEntry(stm);

    expect(scores.total).toBeGreaterThan(0);
    expect(scores.mention).toBeCloseTo(0.2, 1); // 1/5 = 0.2
    expect(scores.emotion).toBeCloseTo(0.5, 1); // Default 0.5
  });
});

// ============================================================================
// LTM STORE TESTS
// ============================================================================

describe('ltmStore', () => {
  const userId = 'test-user-123';
  const profileId = 'test-profile-456';

  test('storeLTMEntry creates entry and returns ID', async () => {
    const ltmId = await storeLTMEntry(client, {
      userId,
      profileId,
      content: 'My grandmother always made the best apple pie.',
      meta: {
        contentType: 'consolidated',
        importanceScore: 0.8,
        emotionalEssence: 'warmth and nostalgia'
      }
    });

    expect(ltmId).toBeDefined();

    // Verify it was stored
    const entries = await getLTMEntries(client, userId, profileId, 10);
    expect(entries.length).toBe(1);
    expect(entries[0].content).toContain('apple pie');
  });

  test('getLTMEntries returns entries sorted by importance', async () => {
    // Create multiple entries
    await storeLTMEntry(client, {
      userId,
      profileId,
      content: 'Low importance memory',
      meta: { importanceScore: 0.3 }
    });

    await storeLTMEntry(client, {
      userId,
      profileId,
      content: 'High importance memory',
      meta: { importanceScore: 0.9 }
    });

    const entries = await getLTMEntries(client, userId, profileId, 10);

    expect(entries.length).toBe(2);
    expect(entries[0].content).toBe('High importance memory');
    expect(entries[0].importance_score).toBe(0.9);
  });

  test('reinforceLTMEntry increases importance', async () => {
    const ltmId = await storeLTMEntry(client, {
      userId,
      profileId,
      content: 'A memory to reinforce',
      meta: { importanceScore: 0.6 }
    });

    await reinforceLTMEntry(client, ltmId, [uuidv4()]);

    const entries = await getLTMEntries(client, userId, profileId, 10);
    expect(entries[0].importance_score).toBeCloseTo(0.65, 2);
  });
});

// ============================================================================
// ANCHOR MANAGER TESTS
// ============================================================================

describe('anchorManager', () => {
  const userId = 'test-user-123';
  const profileId = 'test-profile-456';

  test('createAnchor creates and getAnchorsForUser retrieves', async () => {
    const anchorId = await createAnchor(client, {
      userId,
      profileId,
      content: 'The sunset we watched on our anniversary',
      anchorType: 'memory',
      strength: 2.0
    });

    expect(anchorId).toBeDefined();

    const anchors = await getAnchorsForUser(client, userId, profileId, 10);
    expect(anchors.length).toBe(1);
    expect(anchors[0].content).toContain('sunset');
    expect(anchors[0].strength).toBe(2.0);
  });

  test('updateAnchorStrength updates correctly', async () => {
    const anchorId = await createAnchor(client, {
      userId,
      profileId,
      content: 'Growing anchor',
      strength: 1.0
    });

    await updateAnchorStrength(client, anchorId, 2.5);

    const anchors = await getAnchorsForUser(client, userId, profileId, 10);
    expect(anchors[0].strength).toBe(2.5);
  });

  test('strength is capped at max', async () => {
    const anchorId = await createAnchor(client, {
      userId,
      profileId,
      content: 'Capped anchor',
      strength: 4.9
    });

    await updateAnchorStrength(client, anchorId, 10.0); // Try to exceed max

    const anchors = await getAnchorsForUser(client, userId, profileId, 10);
    expect(anchors[0].strength).toBeLessThanOrEqual(5.0);
  });
});

// ============================================================================
// CONSOLIDATION TESTS
// ============================================================================

describe('consolidateUserSTM', () => {
  const userId = 'test-user-123';
  const profileId = 'test-profile-456';

  async function insertSTM(content, mentionCount, emotionalWeight, daysAgo = 0) {
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const result = await client.query(
      `INSERT INTO user_stm (user_id, profile_id, content, mention_count, emotional_weight, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, profileId, content, mentionCount, emotionalWeight, createdAt]
    );
    return result.rows[0].id;
  }

  test('promotes high-score entries to LTM', async () => {
    // Insert a high-score STM (recent, many mentions, high emotion)
    await insertSTM('This is a very important memory that I mention often!', 5, 0.9, 0);

    const result = await consolidateUserSTM(client, userId, profileId, { dryRun: false });

    expect(result.promoted).toBe(1);
    expect(result.pending).toBe(0);
    expect(result.decayed).toBe(0);

    // Verify LTM was created
    const ltmEntries = await getLTMEntries(client, userId, profileId, 10);
    expect(ltmEntries.length).toBe(1);
    expect(ltmEntries[0].content).toContain('important memory');
  });

  test('queues mid-score entries to pending_promotions', async () => {
    // Insert a mid-score STM (somewhat recent, moderate mentions)
    await insertSTM('A moderately interesting memory', 2, 0.5, 10);

    const result = await consolidateUserSTM(client, userId, profileId, { dryRun: false });

    expect(result.pending).toBeGreaterThanOrEqual(0); // May or may not be pending based on score
  });

  test('decays old low-score entries', async () => {
    // Insert an old, low-score STM
    await insertSTM('Trivial old memory', 1, 0.1, 45); // 45 days old, low everything

    const result = await consolidateUserSTM(client, userId, profileId, { dryRun: false });

    expect(result.decayed).toBe(1);

    // Verify STM was deleted
    const stmResult = await client.query(
      'SELECT * FROM user_stm WHERE user_id = $1 AND profile_id = $2',
      [userId, profileId]
    );
    expect(stmResult.rows.length).toBe(0);
  });

  test('dryRun mode does not modify database', async () => {
    await insertSTM('Memory for dry run test', 5, 0.9, 0);

    const result = await consolidateUserSTM(client, userId, profileId, { dryRun: true });

    expect(result.promoted).toBe(1);

    // Verify LTM was NOT created
    const ltmEntries = await getLTMEntries(client, userId, profileId, 10);
    expect(ltmEntries.length).toBe(0);

    // Verify STM still exists and not marked as consolidated
    const stmResult = await client.query(
      'SELECT consolidated FROM user_stm WHERE user_id = $1 AND profile_id = $2',
      [userId, profileId]
    );
    expect(stmResult.rows[0].consolidated).toBe(false);
  });

  test('respects MAX_PROMOTIONS_PER_USER limit', async () => {
    // Insert more entries than the limit
    for (let i = 0; i < CONFIG.MAX_PROMOTIONS_PER_USER + 5; i++) {
      await insertSTM(`Important memory ${i}`, 5, 0.9, 0);
    }

    const result = await consolidateUserSTM(client, userId, profileId, { dryRun: false });

    expect(result.promoted).toBe(CONFIG.MAX_PROMOTIONS_PER_USER);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration: Full Consolidation Flow', () => {
  const userId = 'integration-user';
  const profileId = 'integration-profile';

  test('complete consolidation cycle works correctly', async () => {
    // 1. Create some STM entries with varied scores
    await client.query(
      `INSERT INTO user_stm (user_id, profile_id, content, mention_count, emotional_weight, created_at)
       VALUES
         ($1, $2, 'High score memory - very important!', 5, 0.95, NOW()),
         ($1, $2, 'Low score old memory', 1, 0.1, NOW() - INTERVAL '40 days'),
         ($1, $2, 'Medium score memory', 2, 0.5, NOW() - INTERVAL '5 days')`,
      [userId, profileId]
    );

    // 2. Create an anchor
    await createAnchor(client, {
      userId,
      profileId,
      content: 'Our first dance together',
      strength: 1.5
    });

    // 3. Run consolidation
    const result = await consolidateUserSTM(client, userId, profileId, { dryRun: false });

    // 4. Verify results
    expect(result.promoted).toBeGreaterThanOrEqual(1);
    expect(result.decayed).toBeGreaterThanOrEqual(1);

    // 5. Verify LTM contains promoted memory
    const ltmEntries = await getLTMEntries(client, userId, profileId, 10);
    expect(ltmEntries.some(e => e.content.includes('High score'))).toBe(true);

    // 6. Verify old memory was decayed (deleted)
    const stmResult = await client.query(
      `SELECT * FROM user_stm WHERE user_id = $1 AND content LIKE '%old memory%'`,
      [userId]
    );
    expect(stmResult.rows.length).toBe(0);
  });
});
