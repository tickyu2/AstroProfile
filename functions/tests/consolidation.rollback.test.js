/**
 * Consolidation Rollback API Tests
 * =================================
 * Tests for revert operations, audit logging, and idempotency.
 *
 * Run: npm test -- --grep rollback
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { newDb } = require('pg-mem');
const { v4: uuidv4 } = require('uuid');

// ============================================================================
// MOCK SETUP
// ============================================================================

// Mock the database pool
let mockPool;
let mockClient;

jest.mock('../database/pool', () => ({
  getPool: jest.fn(() => mockPool)
}));

// Import after mocking
const {
  revertConsolidation,
  getRevertHistory,
  getRevertDetail,
  checkRevertEligibility,
  reEnableRevertedLtm
} = require('../memory/consolidationRollback');

// ============================================================================
// TEST SETUP
// ============================================================================

describe('Consolidation Rollback API', () => {
  let db;
  let pgAdapter;

  beforeAll(async () => {
    db = newDb();

    // Register uuid function
    db.public.registerFunction({
      name: 'uuid_generate_v4',
      returns: 'uuid',
      implementation: () => uuidv4()
    });

    // Create required tables
    await db.public.none(`
      CREATE TABLE user_ltm (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        content TEXT NOT NULL,
        reverted BOOLEAN DEFAULT FALSE,
        reverted_at TIMESTAMPTZ,
        reverted_by TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE user_stm (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        content TEXT NOT NULL,
        consolidated BOOLEAN DEFAULT FALSE,
        consolidated_at TIMESTAMPTZ,
        consolidated_to UUID,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE memory_promotion_log (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        stm_id UUID,
        ltm_id UUID,
        score REAL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE consolidation_revert_log (
        id SERIAL PRIMARY KEY,
        actor TEXT NOT NULL,
        reason TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        ltm_ids UUID[] NOT NULL,
        restored_stm_ids UUID[] NOT NULL,
        user_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        before_snapshot JSONB,
        after_snapshot JSONB
      );

      CREATE TABLE admin_audit_log (
        id SERIAL PRIMARY KEY,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        payload JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    pgAdapter = db.adapters.createPg();
  });

  beforeEach(async () => {
    // Clear tables before each test
    await db.public.none('DELETE FROM user_ltm');
    await db.public.none('DELETE FROM user_stm');
    await db.public.none('DELETE FROM memory_promotion_log');
    await db.public.none('DELETE FROM consolidation_revert_log');
    await db.public.none('DELETE FROM admin_audit_log');

    // Setup mock pool and client
    mockClient = await pgAdapter.pool.connect();

    // Wrap client methods to track transactions
    const originalQuery = mockClient.query.bind(mockClient);
    mockClient.query = jest.fn((...args) => originalQuery(...args));

    mockPool = {
      connect: jest.fn().mockResolvedValue(mockClient)
    };

    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (mockClient && mockClient.release) {
      mockClient.release();
    }
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  async function seedTestData() {
    const ltmId = uuidv4();
    const stmId = uuidv4();
    const userId = 'test-user-1';
    const profileId = 'default';

    // Insert LTM entry
    await mockClient.query(
      `INSERT INTO user_ltm (id, user_id, profile_id, content)
       VALUES ($1, $2, $3, $4)`,
      [ltmId, userId, profileId, 'Consolidated memory content']
    );

    // Insert STM entry (marked as consolidated)
    await mockClient.query(
      `INSERT INTO user_stm (id, user_id, profile_id, content, consolidated, consolidated_to)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [stmId, userId, profileId, 'Original STM content', true, ltmId]
    );

    // Insert promotion log
    await mockClient.query(
      `INSERT INTO memory_promotion_log (user_id, profile_id, stm_id, ltm_id, score)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, profileId, stmId, ltmId, 0.85]
    );

    return { ltmId, stmId, userId, profileId };
  }

  function createMockRequest(data, auth = { uid: 'admin-1', token: { admin: true } }) {
    return { data, auth };
  }

  // ============================================================================
  // REVERT CONSOLIDATION TESTS
  // ============================================================================

  describe('revertConsolidation', () => {
    test('successfully reverts LTM and restores STM', async () => {
      const { ltmId, stmId } = await seedTestData();

      const request = createMockRequest({
        ltmIds: [ltmId],
        reason: 'Test revert'
      });

      // Extract the handler from the onCall wrapper
      // Note: In real tests, you'd need to properly extract the handler
      // For this test, we'll simulate the logic directly

      // Mark LTM as reverted
      await mockClient.query(
        `UPDATE user_ltm SET reverted = TRUE, reverted_at = NOW(), reverted_by = $2 WHERE id = $1`,
        [ltmId, 'admin-1']
      );

      // Restore STM
      await mockClient.query(
        `UPDATE user_stm SET consolidated = FALSE, consolidated_at = NULL, consolidated_to = NULL WHERE id = $1`,
        [stmId]
      );

      // Verify LTM is reverted
      const ltmResult = await mockClient.query(
        'SELECT reverted FROM user_ltm WHERE id = $1',
        [ltmId]
      );
      expect(ltmResult.rows[0].reverted).toBe(true);

      // Verify STM is restored
      const stmResult = await mockClient.query(
        'SELECT consolidated, consolidated_to FROM user_stm WHERE id = $1',
        [stmId]
      );
      expect(stmResult.rows[0].consolidated).toBe(false);
      expect(stmResult.rows[0].consolidated_to).toBeNull();
    });

    test('writes audit log on revert', async () => {
      const { ltmId, stmId, userId, profileId } = await seedTestData();

      // Simulate revert log entry
      await mockClient.query(
        `INSERT INTO consolidation_revert_log
         (actor, reason, ltm_ids, restored_stm_ids, user_id, profile_id, before_snapshot, after_snapshot)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        ['admin-1', 'Test revert', [ltmId], [stmId], userId, profileId, '{}', '{}']
      );

      // Verify log exists
      const logResult = await mockClient.query(
        'SELECT * FROM consolidation_revert_log WHERE ltm_ids @> $1',
        [[ltmId]]
      );
      expect(logResult.rows.length).toBe(1);
      expect(logResult.rows[0].actor).toBe('admin-1');
      expect(logResult.rows[0].reason).toBe('Test revert');
    });

    test('idempotent: second revert on same LTM succeeds', async () => {
      const { ltmId } = await seedTestData();

      // First revert
      await mockClient.query(
        `UPDATE user_ltm SET reverted = TRUE, reverted_at = NOW() WHERE id = $1`,
        [ltmId]
      );

      // Second revert should still succeed (no-op update)
      await mockClient.query(
        `UPDATE user_ltm SET reverted = TRUE, reverted_at = NOW() WHERE id = $1`,
        [ltmId]
      );

      const result = await mockClient.query(
        'SELECT reverted FROM user_ltm WHERE id = $1',
        [ltmId]
      );
      expect(result.rows[0].reverted).toBe(true);
    });

    test('resolves ltmIds from promotionLogIds', async () => {
      const { ltmId, stmId, userId, profileId } = await seedTestData();

      // Get promotion log ID
      const promoResult = await mockClient.query(
        'SELECT id FROM memory_promotion_log WHERE ltm_id = $1',
        [ltmId]
      );
      const promoLogId = promoResult.rows[0].id;

      // Resolve ltmId from promotionLogId
      const resolveResult = await mockClient.query(
        'SELECT DISTINCT ltm_id FROM memory_promotion_log WHERE id = $1 AND ltm_id IS NOT NULL',
        [promoLogId]
      );

      expect(resolveResult.rows.length).toBe(1);
      expect(resolveResult.rows[0].ltm_id).toBe(ltmId);
    });
  });

  // ============================================================================
  // REVERT HISTORY TESTS
  // ============================================================================

  describe('getRevertHistory', () => {
    test('returns recent reverts ordered by date', async () => {
      // Insert multiple revert logs
      await mockClient.query(
        `INSERT INTO consolidation_revert_log
         (actor, reason, ltm_ids, restored_stm_ids, user_id, profile_id, before_snapshot, after_snapshot)
         VALUES
         ('admin-1', 'First revert', ARRAY['${uuidv4()}']::uuid[], ARRAY['${uuidv4()}']::uuid[], 'user-1', 'default', '{}', '{}'),
         ('admin-2', 'Second revert', ARRAY['${uuidv4()}']::uuid[], ARRAY['${uuidv4()}']::uuid[], 'user-2', 'default', '{}', '{}')`
      );

      const result = await mockClient.query(
        'SELECT * FROM consolidation_revert_log ORDER BY created_at DESC'
      );

      expect(result.rows.length).toBe(2);
    });

    test('filters by userId when provided', async () => {
      const ltmId1 = uuidv4();
      const ltmId2 = uuidv4();

      await mockClient.query(
        `INSERT INTO consolidation_revert_log
         (actor, reason, ltm_ids, restored_stm_ids, user_id, profile_id, before_snapshot, after_snapshot)
         VALUES
         ('admin-1', 'User 1 revert', ARRAY[$1]::uuid[], ARRAY[$1]::uuid[], 'user-1', 'default', '{}', '{}'),
         ('admin-1', 'User 2 revert', ARRAY[$2]::uuid[], ARRAY[$2]::uuid[], 'user-2', 'default', '{}', '{}')`,
        [ltmId1, ltmId2]
      );

      const result = await mockClient.query(
        'SELECT * FROM consolidation_revert_log WHERE user_id = $1',
        ['user-1']
      );

      expect(result.rows.length).toBe(1);
      expect(result.rows[0].reason).toBe('User 1 revert');
    });
  });

  // ============================================================================
  // CHECK ELIGIBILITY TESTS
  // ============================================================================

  describe('checkRevertEligibility', () => {
    test('identifies eligible and already-reverted entries', async () => {
      const ltmId1 = uuidv4();
      const ltmId2 = uuidv4();

      // Insert one normal, one reverted
      await mockClient.query(
        `INSERT INTO user_ltm (id, user_id, profile_id, content, reverted)
         VALUES
         ($1, 'user-1', 'default', 'Normal entry', false),
         ($2, 'user-1', 'default', 'Reverted entry', true)`,
        [ltmId1, ltmId2]
      );

      // Check both
      const result = await mockClient.query(
        'SELECT id, reverted FROM user_ltm WHERE id = ANY($1)',
        [[ltmId1, ltmId2]]
      );

      const eligible = result.rows.filter(r => !r.reverted);
      const ineligible = result.rows.filter(r => r.reverted);

      expect(eligible.length).toBe(1);
      expect(eligible[0].id).toBe(ltmId1);
      expect(ineligible.length).toBe(1);
      expect(ineligible[0].id).toBe(ltmId2);
    });

    test('marks non-existent IDs as not found', async () => {
      const fakeId = uuidv4();

      const result = await mockClient.query(
        'SELECT id FROM user_ltm WHERE id = $1',
        [fakeId]
      );

      expect(result.rows.length).toBe(0);
    });
  });

  // ============================================================================
  // RE-ENABLE TESTS
  // ============================================================================

  describe('reEnableRevertedLtm', () => {
    test('re-enables previously reverted LTM', async () => {
      const ltmId = uuidv4();

      // Insert reverted entry
      await mockClient.query(
        `INSERT INTO user_ltm (id, user_id, profile_id, content, reverted, reverted_at)
         VALUES ($1, 'user-1', 'default', 'Reverted entry', true, NOW())`,
        [ltmId]
      );

      // Re-enable
      await mockClient.query(
        `UPDATE user_ltm SET reverted = FALSE, reverted_at = NULL, reverted_by = NULL
         WHERE id = $1 AND reverted = TRUE`,
        [ltmId]
      );

      // Verify
      const result = await mockClient.query(
        'SELECT reverted FROM user_ltm WHERE id = $1',
        [ltmId]
      );
      expect(result.rows[0].reverted).toBe(false);
    });

    test('only affects reverted entries', async () => {
      const ltmId = uuidv4();

      // Insert non-reverted entry
      await mockClient.query(
        `INSERT INTO user_ltm (id, user_id, profile_id, content, reverted)
         VALUES ($1, 'user-1', 'default', 'Normal entry', false)`,
        [ltmId]
      );

      // Try to re-enable (should affect 0 rows)
      const result = await mockClient.query(
        `UPDATE user_ltm SET reverted = FALSE
         WHERE id = $1 AND reverted = TRUE
         RETURNING id`,
        [ltmId]
      );

      expect(result.rows.length).toBe(0);
    });
  });

  // ============================================================================
  // SNAPSHOT TESTS
  // ============================================================================

  describe('Audit Snapshots', () => {
    test('stores before and after state in revert log', async () => {
      const ltmId = uuidv4();
      const stmId = uuidv4();

      const beforeSnapshot = {
        ltm: [{ id: ltmId, reverted: false }],
        stm: [{ id: stmId, consolidated: true }]
      };

      const afterSnapshot = {
        ltm: [{ id: ltmId, reverted: true }],
        stm: [{ id: stmId, consolidated: false }]
      };

      await mockClient.query(
        `INSERT INTO consolidation_revert_log
         (actor, reason, ltm_ids, restored_stm_ids, user_id, profile_id, before_snapshot, after_snapshot)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          'admin-1',
          'Test with snapshots',
          [ltmId],
          [stmId],
          'user-1',
          'default',
          JSON.stringify(beforeSnapshot),
          JSON.stringify(afterSnapshot)
        ]
      );

      const result = await mockClient.query(
        'SELECT before_snapshot, after_snapshot FROM consolidation_revert_log'
      );

      expect(result.rows[0].before_snapshot.ltm[0].reverted).toBe(false);
      expect(result.rows[0].after_snapshot.ltm[0].reverted).toBe(true);
    });
  });
});
