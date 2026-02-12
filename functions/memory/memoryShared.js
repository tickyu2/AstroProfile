/**
 * Memory Shared Infrastructure
 *
 * Firebase admin, Firestore handle, Gemini client, and shared scoring functions.
 * Used by all memory domain modules.
 */

const { onRequest, onCall } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Initialize Gemini for embeddings and reflection
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

// ═══════════════════════════════════════════════════════════════════════════
// SIGMOID DECAY FOR RECENCY SCORING (Production Hardening)
// Better than LOG - gives precise control over memory decay rate
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate sigmoid-based recency score
 *
 * This function uses a sigmoid curve to give precise control over how
 * memories fade over time:
 * - Last 24 hours: Score ≈ 1.0 (full recency boost)
 * - 7 days: Score ≈ 0.5 (half boost)
 * - 30+ days: Score decays towards 0.2 (baseline)
 *
 * Benefits over LOG function:
 * - Predictable decay rate
 * - Configurable midpoint (when memories are "half as fresh")
 * - S-curve prevents extreme values
 *
 * @param {number} hoursOld - How many hours since the memory was created
 * @param {Object} config - Configuration options
 * @returns {number} - Recency score between 0.2 and 1.0
 */
function calculateSigmoidRecency(hoursOld, config = {}) {
  // Configuration with sensible defaults
  const {
    midpointHours = 168,     // 7 days = half-life of recency
    steepness = 0.02,         // How sharp the decay curve is
    minScore = 0.2,           // Floor score for very old memories
    maxScore = 1.0,           // Ceiling for very recent memories
    recentBoostHours = 24     // Extra boost for last 24 hours
  } = config;

  // Very recent memories get max boost
  if (hoursOld < recentBoostHours) {
    return maxScore;
  }

  // Sigmoid function: 1 / (1 + e^(steepness * (x - midpoint)))
  const sigmoid = 1 / (1 + Math.exp(steepness * (hoursOld - midpointHours)));

  // Scale to range [minScore, maxScore]
  const score = minScore + (maxScore - minScore) * sigmoid;

  return Math.max(minScore, Math.min(maxScore, score));
}

/**
 * Calculate combined relevance score using vector distance and sigmoid recency
 *
 * @param {number} vectorDistance - Cosine distance from query (0 = identical)
 * @param {Date|number} createdAt - When the memory was created
 * @param {Object} options - Additional scoring options
 * @returns {number} - Combined relevance score
 */
function calculateRelevanceScore(vectorDistance, createdAt, options = {}) {
  const {
    importance = 0.5,         // Memory importance (0-1)
    accessCount = 0,          // How often accessed
    isCoreMemory = false,     // Core memories get permanent boost
    recencyWeight = 0.3       // How much recency affects final score
  } = options;

  // Calculate hours since creation
  const createdTime = createdAt instanceof Date ? createdAt.getTime() : createdAt;
  const hoursOld = (Date.now() - createdTime) / (1000 * 60 * 60);

  // Semantic similarity (1 - distance, since lower distance = more similar)
  const similarity = 1 - Math.min(1, vectorDistance);

  // Sigmoid-based recency score
  const recencyScore = calculateSigmoidRecency(hoursOld);

  // Importance multiplier (0.8 to 1.5)
  const importanceMultiplier = 0.8 + (importance * 0.7);

  // Access boost (frequently accessed memories are more relevant)
  const accessBoost = Math.min(0.2, accessCount * 0.02);

  // Core memory boost (permanent memories always relevant)
  const coreBoost = isCoreMemory ? 0.3 : 0;

  // Combine scores with configurable weights
  const semanticWeight = 1 - recencyWeight;
  const baseScore = (similarity * semanticWeight) + (recencyScore * recencyWeight);

  // Apply multipliers and boosts
  const finalScore = (baseScore * importanceMultiplier) + accessBoost + coreBoost;

  return Math.min(1.5, Math.max(0, finalScore)); // Cap at 1.5 for boosted memories
}

// ═══════════════════════════════════════════════════════════════════════════
// EMBEDDING GENERATION (using Gemini text-embedding-004)
// ═══════════════════════════════════════════════════════════════════════════

async function generateEmbedding(text) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  const result = await model.embedContent(text);
  return result.embedding.values;
}

module.exports = {
  onRequest,
  onCall,
  onDocumentCreated,
  admin,
  db,
  getGeminiClient,
  calculateSigmoidRecency,
  calculateRelevanceScore,
  generateEmbedding
};
