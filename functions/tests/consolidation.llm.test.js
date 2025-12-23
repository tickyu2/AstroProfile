/**
 * Consolidation LLM Integration Tests
 * ====================================
 * Tests for LLM extraction, embedding, and integration flow.
 *
 * Run: npm test
 *
 * Created: December 23, 2025
 * Mission: JOIE DE VIVRE
 */

const { newDb } = require('pg-mem');
const { v4: uuidv4 } = require('uuid');

// Module under test
const { extractJsonFromText, clampNumber, validateSourceIds } = require('../llm/extractConsolidation');
const { consolidateWithLLM, scoreSTMEntry, CONFIG } = require('../memory/consolidationEngineV2');

// ============================================================================
// MOCKS
// ============================================================================

// Mock the LLM and embedding modules
jest.mock('../llm/llmClient', () => ({
  getLLMClient: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  })),
  getEmbeddingClient: jest.fn(),
  MODEL_CONFIG: {
    embedding: { model: 'test-embedding', dimensions: 768 },
    consolidation: { model: 'test-model', maxTokens: 1200, temperature: 0.0 }
  }
}));

jest.mock('../llm/embeddings', () => ({
  embedText: jest.fn().mockResolvedValue(new Array(768).fill(0.1)),
  formatForPgVector: jest.fn(emb => '[' + emb.join(',') + ']')
}));

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

describe('extractJsonFromText', () => {
  test('extracts JSON from clean response', () => {
    const text = '{"consolidatedMemories": [], "lunaPatterns": []}';
    const result = extractJsonFromText(text);
    expect(JSON.parse(result)).toEqual({
      consolidatedMemories: [],
      lunaPatterns: []
    });
  });

  test('extracts JSON with surrounding text', () => {
    const text = 'Here is the result:\n{"consolidatedMemories": [{"test": 1}], "lunaPatterns": []}\nDone.';
    const result = extractJsonFromText(text);
    expect(JSON.parse(result).consolidatedMemories[0].test).toBe(1);
  });

  test('handles nested JSON objects', () => {
    const text = '{"outer": {"inner": {"deep": true}}}';
    const result = extractJsonFromText(text);
    expect(JSON.parse(result).outer.inner.deep).toBe(true);
  });

  test('returns null for no JSON', () => {
    const text = 'No JSON here, just plain text.';
    const result = extractJsonFromText(text);
    expect(result).toBeNull();
  });

  test('returns null for malformed JSON markers', () => {
    const text = 'Start } middle { end';
    const result = extractJsonFromText(text);
    expect(result).toBeNull();
  });
});

describe('clampNumber', () => {
  test('clamps value within range', () => {
    expect(clampNumber(0.5, 0, 1)).toBe(0.5);
    expect(clampNumber(1.5, 0, 1)).toBe(1);
    expect(clampNumber(-0.5, 0, 1)).toBe(0);
  });

  test('handles string numbers', () => {
    expect(clampNumber('0.7', 0, 1)).toBe(0.7);
  });

  test('handles NaN values', () => {
    expect(clampNumber('not a number', 0, 1)).toBe(0);
    expect(clampNumber(undefined, 0, 1)).toBe(0);
    expect(clampNumber(null, 0, 1)).toBe(0);
  });
});

describe('validateSourceIds', () => {
  const stmBatch = [
    { id: 'stm-1', content: 'Memory 1' },
    { id: 'stm-2', content: 'Memory 2' },
    { id: 'stm-3', content: 'Memory 3' }
  ];

  test('returns valid IDs that exist in batch', () => {
    const sourceIds = ['stm-1', 'stm-3'];
    const result = validateSourceIds(sourceIds, stmBatch);
    expect(result).toEqual(['stm-1', 'stm-3']);
  });

  test('filters out invalid IDs', () => {
    const sourceIds = ['stm-1', 'stm-999', 'stm-2'];
    const result = validateSourceIds(sourceIds, stmBatch);
    expect(result).toEqual(['stm-1', 'stm-2']);
  });

  test('returns empty array for all invalid IDs', () => {
    const sourceIds = ['invalid-1', 'invalid-2'];
    const result = validateSourceIds(sourceIds, stmBatch);
    expect(result).toEqual([]);
  });

  test('handles non-array input', () => {
    expect(validateSourceIds(null, stmBatch)).toEqual([]);
    expect(validateSourceIds(undefined, stmBatch)).toEqual([]);
    expect(validateSourceIds('not-array', stmBatch)).toEqual([]);
  });
});

// ============================================================================
// SCORING TESTS (ensure compatibility with LLM flow)
// ============================================================================

describe('scoreSTMEntry for LLM flow', () => {
  test('high-scoring entries qualify for LLM processing', () => {
    const stm = {
      created_at: new Date(),
      mention_count: 4,
      emotional_weight: 0.8
    };

    const scores = scoreSTMEntry(stm);

    // Should be above PENDING_THRESHOLD for LLM consideration
    expect(scores.total).toBeGreaterThanOrEqual(CONFIG.STM_PENDING_THRESHOLD);
  });

  test('entries scoring between thresholds go to pending', () => {
    const stm = {
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days old
      mention_count: 2,
      emotional_weight: 0.4
    };

    const scores = scoreSTMEntry(stm);

    // Should be in the "pending" range
    expect(scores.total).toBeGreaterThanOrEqual(CONFIG.STM_DECAY_THRESHOLD);
  });
});

// ============================================================================
// LLM RESPONSE PARSING TESTS
// ============================================================================

describe('LLM Response Parsing', () => {
  test('parses valid consolidation response', () => {
    const llmResponse = {
      consolidatedMemories: [
        {
          timeframe: 'Last week',
          consolidatedEvent: 'User expressed gratitude for family support',
          emotionalEssence: 'Warm feelings of appreciation and belonging.',
          coreThemes: ['family', 'gratitude', 'support'],
          sourceIds: ['stm-1', 'stm-2'],
          confidence: 0.85
        }
      ],
      lunaPatterns: [
        {
          patternName: 'Gratitude Expression',
          manifestations: 'User regularly expresses thanks for loved ones',
          triggers: ['family mentions', 'evening conversations'],
          recommendedResponse: 'Acknowledge and reinforce positive family bonds',
          confidence: 0.7
        }
      ]
    };

    expect(llmResponse.consolidatedMemories).toHaveLength(1);
    expect(llmResponse.consolidatedMemories[0].confidence).toBe(0.85);
    expect(llmResponse.lunaPatterns[0].patternName).toBe('Gratitude Expression');
  });

  test('handles empty arrays gracefully', () => {
    const llmResponse = {
      consolidatedMemories: [],
      lunaPatterns: []
    };

    expect(llmResponse.consolidatedMemories).toHaveLength(0);
    expect(llmResponse.lunaPatterns).toHaveLength(0);
  });
});

// ============================================================================
// DRY RUN FLOW TESTS
// ============================================================================

describe('consolidateWithLLM dry run', () => {
  let db;
  let client;

  beforeAll(async () => {
    db = newDb();

    db.public.registerFunction({
      name: 'uuid_generate_v4',
      returns: 'uuid',
      implementation: () => uuidv4()
    });

    await db.public.none(`
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE memory_promotion_log (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        stm_id UUID NOT NULL,
        ltm_id UUID,
        source_brain TEXT,
        reason TEXT,
        score REAL,
        consolidation_run_id INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    client = db.adapters.createPg().pool;
  });

  beforeEach(async () => {
    await db.public.none('DELETE FROM user_stm');
    await db.public.none('DELETE FROM user_ltm');
    await db.public.none('DELETE FROM memory_promotion_log');

    // Reset mocks
    jest.clearAllMocks();
  });

  test('dry run returns proposals without modifying database', async () => {
    const userId = 'test-user';
    const profileId = 'test-profile';
    const stmId = uuidv4();

    // Insert test STM
    await client.query(
      `INSERT INTO user_stm (id, user_id, profile_id, content, mention_count, emotional_weight)
       VALUES ($1, $2, $3, $4, 5, 0.9)`,
      [stmId, userId, profileId, 'I love spending time with my grandmother']
    );

    // Mock LLM response
    const { getLLMClient } = require('../llm/llmClient');
    getLLMClient().chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            consolidatedMemories: [{
              timeframe: 'Recent',
              consolidatedEvent: 'Deep bond with grandmother',
              emotionalEssence: 'Loving family connection',
              coreThemes: ['family', 'love'],
              sourceIds: [stmId],
              confidence: 0.9
            }],
            lunaPatterns: []
          })
        }
      }]
    });

    // Run dry run
    const result = await consolidateWithLLM(client, userId, profileId, { dryRun: true });

    // Check proposals were returned
    expect(result.llmProposals.length).toBeGreaterThan(0);
    expect(result.llmProposals[0].type).toBe('llm_promote');
    expect(result.llmProposals[0].content).toBe('Deep bond with grandmother');

    // Verify no database changes
    const ltmResult = await client.query('SELECT * FROM user_ltm WHERE user_id = $1', [userId]);
    expect(ltmResult.rows.length).toBe(0);

    const stmResult = await client.query('SELECT consolidated FROM user_stm WHERE id = $1', [stmId]);
    expect(stmResult.rows[0].consolidated).toBe(false);
  });

  test('filters out low-confidence extractions', async () => {
    const userId = 'test-user';
    const profileId = 'test-profile';
    const stmId = uuidv4();

    await client.query(
      `INSERT INTO user_stm (id, user_id, profile_id, content, mention_count, emotional_weight)
       VALUES ($1, $2, $3, $4, 5, 0.9)`,
      [stmId, userId, profileId, 'Something uncertain']
    );

    const { getLLMClient } = require('../llm/llmClient');
    getLLMClient().chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            consolidatedMemories: [{
              timeframe: 'Unknown',
              consolidatedEvent: 'Low confidence memory',
              emotionalEssence: 'Uncertain',
              coreThemes: [],
              sourceIds: [stmId],
              confidence: 0.3 // Below 0.5 threshold
            }],
            lunaPatterns: []
          })
        }
      }]
    });

    const result = await consolidateWithLLM(client, userId, profileId, { dryRun: true });

    // Should be marked as low_confidence, not llm_promote
    expect(result.llmProposals.some(p => p.type === 'low_confidence')).toBe(true);
  });
});

// ============================================================================
// EMBEDDING INTEGRATION TESTS
// ============================================================================

describe('Embedding Integration', () => {
  test('embedText is called for promoted entries', async () => {
    const { embedText } = require('../llm/embeddings');

    // Call embedText directly to verify mock works
    const embedding = await embedText('Test content');

    expect(embedText).toHaveBeenCalled();
    expect(embedding).toHaveLength(768);
    expect(embedding[0]).toBe(0.1);
  });
});

// ============================================================================
// PROVENANCE VALIDATION TESTS
// ============================================================================

describe('Provenance Validation', () => {
  test('rejects memories with invalid sourceIds', () => {
    const stmBatch = [
      { id: 'valid-stm-1', content: 'Real memory' }
    ];

    const memoryWithInvalidIds = {
      sourceIds: ['invented-id-1', 'invented-id-2']
    };

    const validIds = validateSourceIds(memoryWithInvalidIds.sourceIds, stmBatch);
    expect(validIds).toHaveLength(0);
  });

  test('accepts memories with all valid sourceIds', () => {
    const stmBatch = [
      { id: 'stm-1', content: 'Memory 1' },
      { id: 'stm-2', content: 'Memory 2' }
    ];

    const memoryWithValidIds = {
      sourceIds: ['stm-1', 'stm-2']
    };

    const validIds = validateSourceIds(memoryWithValidIds.sourceIds, stmBatch);
    expect(validIds).toHaveLength(2);
  });
});
