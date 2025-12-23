/**
 * ============================================================================
 * TEXT EMBEDDINGS SERVICE
 * ============================================================================
 * Generate vector embeddings for semantic search using Gemini.
 * Used for timeline event deduplication and similarity matching.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ============================================================================
// CONFIGURATION
// ============================================================================

let genAI = null;

function getGeminiClient() {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

// ============================================================================
// EMBEDDING FUNCTIONS
// ============================================================================

/**
 * Generate embedding for a single text
 * Uses Gemini's text-embedding model with retry logic
 *
 * @param {string} text - Text to embed
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 * @returns {Promise<number[]>} 768-dimensional embedding vector
 */
async function embedText(text, { maxRetries = 3 } = {}) {
  if (!text || typeof text !== 'string') {
    console.warn('[Embeddings] Empty or invalid text, returning zero vector');
    return new Array(768).fill(0);
  }

  // Truncate very long texts
  const truncatedText = text.slice(0, 8000);
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({ model: 'text-embedding-004' });

      const result = await model.embedContent(truncatedText);
      const embedding = result.embedding.values;

      if (!embedding || embedding.length === 0) {
        throw new Error('Empty embedding returned');
      }

      return embedding;
    } catch (error) {
      attempt++;
      const backoff = 200 * Math.pow(2, attempt);

      console.warn(
        `[Embeddings] Attempt ${attempt}/${maxRetries} failed: ${error.message}. ` +
        `Retrying in ${backoff}ms...`
      );

      if (attempt >= maxRetries) {
        console.error('[Embeddings] Failed after all retries, returning zero vector');
        return new Array(768).fill(0);
      }

      await new Promise(r => setTimeout(r, backoff));
    }
  }

  return new Array(768).fill(0);
}

/**
 * Generate embeddings for multiple texts in batch
 *
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
async function embedTexts(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'text-embedding-004' });

  const results = [];

  // Process in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const batchPromises = batch.map(async (text) => {
      if (!text) return new Array(768).fill(0);

      try {
        const result = await model.embedContent(text);
        return result.embedding.values;
      } catch (error) {
        console.warn('[Embeddings] Batch item error:', error.message);
        return new Array(768).fill(0);
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Small delay between batches
    if (i + batchSize < texts.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return results;
}

/**
 * Format embedding for PostgreSQL pgvector
 * Converts array to string format: [0.1, 0.2, ...]
 *
 * @param {number[]} embedding - Embedding vector
 * @returns {string} PostgreSQL-compatible vector string
 */
function formatForPgVector(embedding) {
  if (!Array.isArray(embedding)) {
    return '[' + new Array(768).fill(0).join(',') + ']';
  }
  return '[' + embedding.join(',') + ']';
}

/**
 * Calculate cosine similarity between two embeddings
 *
 * @param {number[]} a - First embedding
 * @param {number[]} b - Second embedding
 * @returns {number} Similarity score (0-1)
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Create embedding for a timeline event
 * Combines title, description, and people for rich semantic representation
 *
 * @param {Object} event - Timeline event
 * @returns {Promise<number[]>} Event embedding
 */
async function embedTimelineEvent(event) {
  const parts = [];

  if (event.title) parts.push(event.title);
  if (event.description) parts.push(event.description);
  if (event.event_type) parts.push(`Event type: ${event.event_type}`);
  if (event.city || event.country) {
    parts.push(`Location: ${[event.city, event.state, event.country].filter(Boolean).join(', ')}`);
  }
  if (Array.isArray(event.people) && event.people.length > 0) {
    parts.push(`People involved: ${event.people.join(', ')}`);
  }
  if (Array.isArray(event.emotions) && event.emotions.length > 0) {
    parts.push(`Emotions: ${event.emotions.join(', ')}`);
  }

  const text = parts.join('\n');
  return embedText(text);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  embedText,
  embedTexts,
  embedTimelineEvent,
  formatForPgVector,
  cosineSimilarity
};
