/**
 * Shared configuration for all Node.js route modules.
 * Secret declarations, Firebase SDK refs, and common middleware.
 */

const { onRequest, onCall } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

// =============================================================================
// SECRET DECLARATIONS (GCP Secret Manager)
// =============================================================================
const anthropicKey = defineSecret('ANTHROPIC_API_KEY');
const openaiKey = defineSecret('OPENAI_API_KEY');
const geminiKey = defineSecret('GEMINI_API_KEY');
const grokKey = defineSecret('GROK_API_KEY');
const deepseekKey = defineSecret('DEEPSEEK_API_KEY');
const qwenKey = defineSecret('QWEN_API_KEY');
const stabilityKey = defineSecret('STABILITY_API_KEY');
const leonardoKey = defineSecret('LEONARDO_API_KEY');
const elevenLabsKey = defineSecret('ELEVENLABS_API_KEY');
const timezonedbKey = defineSecret('TIMEZONEDB_API_KEY');
const neo4jUri = defineSecret('NEO4J_URI');
const neo4jPassword = defineSecret('NEO4J_PASSWORD');
const pgPassword = defineSecret('PG_PASSWORD');
const dbPassword = defineSecret('DB_PASSWORD');

module.exports = {
  // Firebase SDK
  onRequest,
  onCall,
  onSchedule,
  admin,
  cors,
  logger,
  // Secrets
  anthropicKey,
  openaiKey,
  geminiKey,
  grokKey,
  deepseekKey,
  qwenKey,
  stabilityKey,
  leonardoKey,
  elevenLabsKey,
  timezonedbKey,
  neo4jUri,
  neo4jPassword,
  pgPassword,
  dbPassword,
};
