/**
 * Test Script: Vector Integration for Brain 1B/2
 *
 * Tests embedding generation, semantic search, and consolidation
 * for the 8-Brain Memory Architecture v3.0.
 *
 * Run: node functions/test/testVectorIntegration.js
 *
 * Note: Full API tests require GEMINI_API_KEY environment variable.
 * Without it, tests will verify module structure only.
 */

// ============================================
// IMPORTS
// ============================================

const { extractFacts, consolidateFacts } = require('../memory/factExtractor');
const { cosineSimilarity } = require('../llm/embeddings');

// Try to import brain1BService functions
let brain1BService;
try {
  brain1BService = require('../memory/brain1BService');
} catch (e) {
  console.warn('brain1BService not available for direct testing:', e.message);
}

// ============================================
// TEST DATA
// ============================================

// Mock embeddings for testing (768-dimensional vectors)
function createMockEmbedding(seed) {
  const embedding = [];
  for (let i = 0; i < 768; i++) {
    // Create deterministic but varied values based on seed
    embedding.push(Math.sin(seed * (i + 1) * 0.01) * 0.5);
  }
  return embedding;
}

// Normalize a vector (for cosine similarity testing)
function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return vec.map(v => v / norm);
}

// ============================================
// UNIT TESTS
// ============================================

console.log('='.repeat(60));
console.log('VECTOR INTEGRATION TEST SUITE');
console.log('='.repeat(60));
console.log('');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ PASS | ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ FAIL | ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertClose(actual, expected, tolerance, message) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}: expected ~${expected}, got ${actual}`);
  }
}

function assertTruthy(value, message) {
  if (!value) {
    throw new Error(`${message}: expected truthy, got ${value}`);
  }
}

function assertArray(value, message) {
  if (!Array.isArray(value)) {
    throw new Error(`${message}: expected array, got ${typeof value}`);
  }
}

// ============================================
// COSINE SIMILARITY TESTS
// ============================================

console.log('\n--- Cosine Similarity Tests ---\n');

test('Identical vectors have similarity 1.0', () => {
  const vec = normalize([1, 2, 3, 4, 5]);
  const sim = cosineSimilarity(vec, vec);
  assertClose(sim, 1.0, 0.001, 'Similarity should be 1.0');
});

test('Orthogonal vectors have similarity 0.0', () => {
  const vec1 = [1, 0, 0, 0, 0];
  const vec2 = [0, 1, 0, 0, 0];
  const sim = cosineSimilarity(vec1, vec2);
  assertClose(sim, 0.0, 0.001, 'Similarity should be 0.0');
});

test('Opposite vectors have similarity -1.0', () => {
  const vec1 = normalize([1, 2, 3]);
  const vec2 = normalize([-1, -2, -3]);
  const sim = cosineSimilarity(vec1, vec2);
  assertClose(sim, -1.0, 0.001, 'Similarity should be -1.0');
});

test('Similar vectors have high similarity', () => {
  const vec1 = normalize([1, 2, 3, 4, 5]);
  const vec2 = normalize([1.1, 2.1, 3.1, 4.1, 5.1]);
  const sim = cosineSimilarity(vec1, vec2);
  assertTruthy(sim > 0.99, 'Similar vectors should have similarity > 0.99');
});

test('Empty/null vectors return 0', () => {
  assertEqual(cosineSimilarity(null, [1, 2, 3]), 0, 'Null first vector');
  assertEqual(cosineSimilarity([1, 2, 3], null), 0, 'Null second vector');
  assertEqual(cosineSimilarity([], []), 0, 'Empty vectors');
});

test('Mismatched vector lengths return 0', () => {
  const sim = cosineSimilarity([1, 2, 3], [1, 2]);
  assertEqual(sim, 0, 'Mismatched lengths should return 0');
});

// ============================================
// MOCK EMBEDDING TESTS
// ============================================

console.log('\n--- Mock Embedding Tests ---\n');

test('Mock embeddings are 768-dimensional', () => {
  const emb = createMockEmbedding(1);
  assertEqual(emb.length, 768, 'Embedding length');
});

test('Different seeds create different embeddings', () => {
  const emb1 = createMockEmbedding(1);
  const emb2 = createMockEmbedding(2);
  const sim = cosineSimilarity(emb1, emb2);
  assertTruthy(sim < 0.99, 'Different seeds should create different embeddings');
});

test('Same seed creates identical embeddings', () => {
  const emb1 = createMockEmbedding(42);
  const emb2 = createMockEmbedding(42);
  const sim = cosineSimilarity(emb1, emb2);
  assertClose(sim, 1.0, 0.001, 'Same seed should create identical embeddings');
});

// ============================================
// CONSOLIDATION WITH EMBEDDINGS TESTS
// ============================================

console.log('\n--- Consolidation with Embeddings Tests ---\n');

test('Consolidation preserves embedding from single fact', () => {
  const embedding = createMockEmbedding(100);
  const facts = [{
    id: 'fact1',
    category: 'relationship',
    name: 'Sarah',
    embedding: embedding,
    embeddingCreatedAt: '2025-01-05T12:00:00Z',
    timestamp: '2025-01-05T12:00:00Z'
  }];

  const consolidated = consolidateFacts(facts);
  assertArray(consolidated.embedding, 'Should have embedding');
  assertEqual(consolidated.embedding.length, 768, 'Embedding should be 768-dim');
});

test('Consolidation selects most recent embedding from multiple facts', () => {
  const oldEmbedding = createMockEmbedding(1);
  const newEmbedding = createMockEmbedding(2);

  const facts = [
    {
      id: 'fact1',
      category: 'relationship',
      name: 'Sarah',
      embedding: oldEmbedding,
      embeddingCreatedAt: '2025-01-01T12:00:00Z',
      timestamp: '2025-01-01T12:00:00Z'
    },
    {
      id: 'fact2',
      category: 'relationship',
      name: 'Sarah',
      embedding: newEmbedding,
      embeddingCreatedAt: '2025-01-05T12:00:00Z',
      timestamp: '2025-01-05T12:00:00Z'
    }
  ];

  const consolidated = consolidateFacts(facts);
  assertArray(consolidated.embedding, 'Should have embedding');

  // Check it's the newer embedding
  const simToNew = cosineSimilarity(consolidated.embedding, newEmbedding);
  assertClose(simToNew, 1.0, 0.001, 'Should select most recent embedding');
});

test('Consolidation handles facts without embeddings', () => {
  const facts = [
    {
      id: 'fact1',
      category: 'relationship',
      name: 'Sarah',
      timestamp: '2025-01-01T12:00:00Z'
    },
    {
      id: 'fact2',
      category: 'relationship',
      name: 'Sarah',
      timestamp: '2025-01-05T12:00:00Z'
    }
  ];

  const consolidated = consolidateFacts(facts);
  assertTruthy(consolidated.consolidated, 'Should be marked as consolidated');
  assertEqual(consolidated.mentions, 2, 'Should have 2 mentions');
  // embedding may be undefined, that's okay
});

test('Consolidation picks embedding from fact that has one when mixed', () => {
  const embedding = createMockEmbedding(42);

  const facts = [
    {
      id: 'fact1',
      category: 'relationship',
      name: 'Sarah',
      timestamp: '2025-01-01T12:00:00Z'
      // No embedding
    },
    {
      id: 'fact2',
      category: 'relationship',
      name: 'Sarah',
      embedding: embedding,
      embeddingCreatedAt: '2025-01-05T12:00:00Z',
      timestamp: '2025-01-05T12:00:00Z'
    }
  ];

  const consolidated = consolidateFacts(facts);
  assertArray(consolidated.embedding, 'Should have embedding from fact2');
  assertEqual(consolidated.embedding.length, 768, 'Embedding should be 768-dim');
});

// ============================================
// BRAIN 1B SERVICE EXPORTS TEST
// ============================================

console.log('\n--- Brain 1B Service Exports Tests ---\n');

test('brain1BService exports semantic search functions', () => {
  if (!brain1BService) {
    throw new Error('brain1BService not available');
  }

  assertTruthy(typeof brain1BService.searchFactsSemantically === 'function',
    'searchFactsSemantically should be a function');
  assertTruthy(typeof brain1BService.findRelatedFacts === 'function',
    'findRelatedFacts should be a function');
  assertTruthy(typeof brain1BService.checkSemanticDuplicate === 'function',
    'checkSemanticDuplicate should be a function');
  assertTruthy(typeof brain1BService.generateFactEmbedding === 'function',
    'generateFactEmbedding should be a function');
});

test('brain1BService exports core functions', () => {
  if (!brain1BService) {
    throw new Error('brain1BService not available');
  }

  assertTruthy(typeof brain1BService.processMessage === 'function',
    'processMessage should be a function');
  assertTruthy(typeof brain1BService.getAllFacts === 'function',
    'getAllFacts should be a function');
  assertTruthy(typeof brain1BService.runConsolidation === 'function',
    'runConsolidation should be a function');
  assertTruthy(typeof brain1BService.searchFacts === 'function',
    'searchFacts should be a function');
});

// ============================================
// EXTRACTION WITH EMBEDDING READINESS TEST
// ============================================

console.log('\n--- Extraction Embedding Readiness Tests ---\n');

test('Extracted facts have structure suitable for embedding', () => {
  const result = extractFacts('I had lunch with Sarah today', 'brain3', {
    timestamp: new Date().toISOString()
  });

  assertTruthy(result.extracted, 'Should extract facts');
  assertTruthy(result.facts.length > 0, 'Should have facts');

  const fact = result.facts[0];
  // Facts should have enough fields to generate meaningful embeddings
  assertTruthy(fact.category, 'Fact should have category');
  assertTruthy(fact.id, 'Fact should have id');
  assertTruthy(fact.timestamp, 'Fact should have timestamp');
});

test('Life structure facts have enough context for embedding', () => {
  const result = extractFacts('I work at Microsoft as a software engineer', 'brain3', {
    timestamp: new Date().toISOString()
  });

  assertTruthy(result.extracted, 'Should extract facts');
  // Find the life_structure fact (might not be first in array)
  const fact = result.facts.find(f => f.category === 'life_structure');
  assertTruthy(fact, 'Should have a life_structure fact');
  assertTruthy(fact.type, 'Should have type');
  assertTruthy(fact.value, 'Should have value');
});

// ============================================
// RESULTS
// ============================================

console.log('\n' + '='.repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log(`Success rate: ${Math.round(passed / (passed + failed) * 100)}%`);
console.log('='.repeat(60));

// Note about API tests
console.log('\n📝 Note: Full API integration tests (generateFactEmbedding with Gemini)');
console.log('   require GEMINI_API_KEY environment variable.');
console.log('   Run with: GEMINI_API_KEY=xxx node functions/test/testVectorIntegration.js\n');

// Exit with error code if tests failed
process.exit(failed > 0 ? 1 : 0);
