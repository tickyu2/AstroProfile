/**
 * RAG Context Service for GENESIS Guest Chat
 *
 * Retrieves relevant biography passages and graph context
 * for injection into LLM prompts, following Hello History RAG patterns.
 *
 * Features:
 * - Vector similarity search (pgvector via Cloud SQL)
 * - GraphRAG queries (Neo4j hidden connections)
 * - Topic extraction for query analysis
 * - Formatted context injection
 *
 * Updated: January 2026
 */

const { Pool } = require('pg');

// Import topic extractor for query analysis
let topicExtractor;
try {
  topicExtractor = require('../utils/topicExtractor');
} catch (e) {
  console.warn('[RAGContext] topicExtractor not available:', e.message);
  topicExtractor = null;
}

// Import Neo4j for graph queries
let neo4jGuestService;
try {
  neo4jGuestService = require('./neo4jGuestService');
} catch (e) {
  console.warn('[RAGContext] neo4jGuestService not available:', e.message);
  neo4jGuestService = null;
}

// OpenAI for embeddings
let OpenAI;
try {
  OpenAI = require('openai');
} catch (e) {
  console.warn('[RAGContext] OpenAI not available:', e.message);
  OpenAI = null;
}

// Axios for Python Cloud Function calls
let axios;
try {
  axios = require('axios');
} catch (e) {
  console.warn('[RAGContext] axios not available:', e.message);
  axios = null;
}

// Python GraphRAG endpoint URL
const PYTHON_GRAPHRAG_URL = process.env.PYTHON_FUNCTIONS_URL ||
  'https://us-central1-genesis-multiplatform.cloudfunctions.net';

// PostgreSQL connection pool (Cloud SQL)
let pgPool = null;
let openaiClient = null;

/**
 * Initialize PostgreSQL connection for vector search
 */
function initializePostgres() {
  if (pgPool) return pgPool;

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.warn('[RAGContext] No PostgreSQL connection string configured');
    return null;
  }

  try {
    pgPool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000
    });
    console.log('[RAGContext] PostgreSQL pool initialized');
    return pgPool;
  } catch (error) {
    console.error('[RAGContext] PostgreSQL init failed:', error);
    return null;
  }
}

/**
 * Initialize OpenAI client for embeddings
 */
function initializeOpenAI() {
  if (openaiClient) return openaiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !OpenAI) {
    console.warn('[RAGContext] OpenAI not available');
    return null;
  }

  try {
    openaiClient = new OpenAI.OpenAI({ apiKey });
    console.log('[RAGContext] OpenAI client initialized');
    return openaiClient;
  } catch (error) {
    console.error('[RAGContext] OpenAI init failed:', error);
    return null;
  }
}

/**
 * Generate embedding for search query
 */
async function getQueryEmbedding(query) {
  const client = initializeOpenAI();
  if (!client) return null;

  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('[RAGContext] Embedding generation failed:', error);
    return null;
  }
}

/**
 * Call Python GraphRAG endpoint for rich context
 * Uses topic-based, entity-based, and theme-based retrieval
 */
async function callPythonGraphRAG(topics, entities, profileId, options = {}) {
  if (!axios) {
    console.warn('[RAGContext] axios not available, skipping Python GraphRAG');
    return null;
  }

  const {
    maxChunks = 5,
    includeTimeline = true,
    includeConnections = true,
    timeout = 10000
  } = options;

  try {
    const response = await axios.post(
      `${PYTHON_GRAPHRAG_URL}/graphrag_context`,
      {
        topics: topics || [],
        entities: entities || [],
        profileId: profileId,
        maxChunks: maxChunks,
        includeTimeline: includeTimeline,
        includeConnections: includeConnections
      },
      { timeout }
    );

    if (response.data && response.data.context) {
      console.log(`[RAGContext] Python GraphRAG returned ${response.data.context.chunks?.length || 0} chunks`);
      return response.data;
    }
    return null;

  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.warn('[RAGContext] Python GraphRAG endpoint not reachable');
    } else {
      console.error('[RAGContext] Python GraphRAG call failed:', error.message);
    }
    return null;
  }
}

/**
 * Extract entities from text (simple pattern matching)
 * Returns names, locations, organizations mentioned
 */
function extractEntities(text) {
  const entities = [];

  // Common name patterns (capitalized words that appear to be names)
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  let match;
  while ((match = namePattern.exec(text)) !== null) {
    const name = match[1];
    // Filter out common non-name phrases
    if (!name.match(/^(The |This |That |What |When |Where |How |Why )/)) {
      entities.push(name);
    }
  }

  // Remove duplicates
  return [...new Set(entities)].slice(0, 5);
}

/**
 * Search biography chunks using vector similarity
 */
async function searchBiographyChunks(query, options = {}) {
  const {
    profileId = null,
    topics = [],
    limit = 5,
    similarityThreshold = 0.7
  } = options;

  const pool = initializePostgres();
  if (!pool) return [];

  try {
    // Generate query embedding
    const embedding = await getQueryEmbedding(query);
    if (!embedding) {
      console.warn('[RAGContext] No embedding generated, skipping vector search');
      return [];
    }

    // Build SQL query with vector similarity
    let sql = `
      SELECT
        id,
        profile_id,
        profile_name,
        content,
        1 - (embedding <=> $1::vector) as similarity,
        topics,
        sentiment,
        entities,
        constitutional_themes,
        metadata
      FROM biography_chunks
      WHERE 1 - (embedding <=> $1::vector) > $2
    `;
    const params = [JSON.stringify(embedding), similarityThreshold];
    let paramIndex = 3;

    // Add profile filter
    if (profileId) {
      sql += ` AND profile_id = $${paramIndex}`;
      params.push(profileId);
      paramIndex++;
    }

    // Add topic filter (any match)
    if (topics && topics.length > 0) {
      sql += ` AND topics && $${paramIndex}`;
      params.push(topics);
      paramIndex++;
    }

    sql += ` ORDER BY similarity DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(sql, params);

    return result.rows.map(row => ({
      profileId: row.profile_id,
      profileName: row.profile_name,
      content: row.content,
      similarity: parseFloat(row.similarity),
      topics: row.topics || [],
      sentiment: row.sentiment,
      entities: row.entities || [],
      constitutionalThemes: row.constitutional_themes || [],
      metadata: row.metadata || {}
    }));

  } catch (error) {
    console.error('[RAGContext] Vector search failed:', error);
    return [];
  }
}

/**
 * Get GraphRAG context from Neo4j
 * Now uses Python GraphRAG endpoint for rich context with fallback to JS service
 */
async function getGraphContext(query, profileId, options = {}) {
  const { usePythonGraphRAG = true } = options;

  // Extract topics and entities from query
  const topics = topicExtractor ?
    topicExtractor.extractTopics(query, '', profileId) :
    [];
  const entities = extractEntities(query);

  // Try Python GraphRAG endpoint first (richer context)
  if (usePythonGraphRAG && axios) {
    try {
      const pythonResult = await callPythonGraphRAG(topics, entities, profileId, {
        maxChunks: 5,
        includeTimeline: true,
        includeConnections: true
      });

      if (pythonResult && pythonResult.context) {
        console.log('[RAGContext] Using Python GraphRAG context');
        return {
          source: 'python_graphrag',
          topics: pythonResult.context.themes_found || topics,
          entities: pythonResult.context.entities_mentioned || [],
          chunks: pythonResult.context.chunks || [],
          timeline: pythonResult.context.timeline || [],
          connections: pythonResult.context.connections || [],
          summary: pythonResult.context.summary || '',
          formatted: pythonResult.formatted || ''
        };
      }
    } catch (error) {
      console.warn('[RAGContext] Python GraphRAG failed, falling back to JS service:', error.message);
    }
  }

  // Fallback to JS Neo4j service
  if (!neo4jGuestService || !neo4jGuestService.isAvailable()) {
    return null;
  }

  try {
    // Convert profile ID to Neo4j guest ID
    const neo4jGuestId = `guest_${profileId.replace('historical_', '').replace('modern_', '')}`;

    // Get topic-related context from Neo4j
    const enrichment = await neo4jGuestService.getEnrichedGuestProfile(neo4jGuestId, {
      includeRelationships: true,
      includeEvents: true,
      includeEras: true
    });

    if (!enrichment) return null;

    return {
      source: 'js_neo4j',
      topics,
      entities,
      relationships: enrichment.relationships || [],
      events: enrichment.events || [],
      eras: enrichment.eras || []
    };

  } catch (error) {
    console.error('[RAGContext] GraphRAG query failed:', error);
    return null;
  }
}

/**
 * Main RAG context retrieval function
 * Combines vector search + GraphRAG for comprehensive context
 */
async function getRAGContext(userMessage, profileId, options = {}) {
  const {
    includeVectorSearch = true,
    includeGraphContext = true,
    vectorLimit = 5,
    maxTokens = 2000
  } = options;

  const context = {
    vectorResults: [],
    graphContext: null,
    extractedTopics: [],
    formattedContext: ''
  };

  // Extract topics from user message
  if (topicExtractor && topicExtractor.extractTopics) {
    context.extractedTopics = topicExtractor.extractTopics(userMessage, '', profileId);
  }

  // Run vector search and graph query in parallel
  const [vectorResults, graphContext] = await Promise.all([
    includeVectorSearch ?
      searchBiographyChunks(userMessage, {
        profileId,
        topics: context.extractedTopics,
        limit: vectorLimit
      }) :
      Promise.resolve([]),
    includeGraphContext ?
      getGraphContext(userMessage, profileId) :
      Promise.resolve(null)
  ]);

  context.vectorResults = vectorResults;
  context.graphContext = graphContext;

  // Format context for prompt injection
  context.formattedContext = formatRAGContextForPrompt(context, maxTokens);

  return context;
}

/**
 * Format RAG context for injection into LLM prompt
 */
function formatRAGContextForPrompt(context, maxTokens = 2000) {
  const sections = [];
  const charBudget = maxTokens * 4; // ~4 chars per token
  let currentChars = 0;

  // Add vector search results
  if (context.vectorResults && context.vectorResults.length > 0) {
    const passageLines = ['[RELEVANT BIOGRAPHY PASSAGES]', ''];

    for (let i = 0; i < context.vectorResults.length; i++) {
      const result = context.vectorResults[i];

      let passage = `[${i + 1}] ${result.profileName}`;
      if (result.topics && result.topics.length > 0) {
        passage += ` | Topics: ${result.topics.slice(0, 3).join(', ')}`;
      }
      if (result.sentiment) {
        passage += ` | Tone: ${result.sentiment}`;
      }
      passage += `\n"${result.content}"`;
      passage += `\n(Relevance: ${Math.round(result.similarity * 100)}%)\n`;

      if (currentChars + passage.length > charBudget * 0.6) {
        break; // Reserve space for graph context
      }

      passageLines.push(passage);
      currentChars += passage.length;
    }

    // Add constitutional themes
    const allThemes = new Set();
    context.vectorResults.forEach(r => {
      (r.constitutionalThemes || []).forEach(t => allThemes.add(t));
    });

    if (allThemes.size > 0) {
      passageLines.push(`\nCONSTITUTIONAL THEMES: ${[...allThemes].slice(0, 5).join(', ')}`);
    }

    sections.push(passageLines.join('\n'));
  }

  // Add graph context (hidden connections)
  if (context.graphContext) {
    const graphLines = ['[GRAPH CONTEXT FROM NEO4J]', ''];

    // Check if this is Python GraphRAG response (has pre-formatted output)
    if (context.graphContext.source === 'python_graphrag' && context.graphContext.formatted) {
      // Use the pre-formatted context from Python
      sections.push(context.graphContext.formatted);
    } else {
      // Format JS Neo4j response

      // Add GraphRAG chunks (from Python endpoint)
      if (context.graphContext.chunks && context.graphContext.chunks.length > 0) {
        graphLines.push('RELEVANT PASSAGES:');
        context.graphContext.chunks.slice(0, 5).forEach((c, i) => {
          graphLines.push(`  [${i + 1}] ${c.speaker || 'Unknown'}: "${(c.quote || '').slice(0, 200)}..."`);
          if (c.sentiment) graphLines.push(`      Tone: ${c.sentiment}`);
        });
        graphLines.push('');
      }

      // Add timeline (from Python endpoint)
      if (context.graphContext.timeline && context.graphContext.timeline.length > 0) {
        graphLines.push('TIMELINE:');
        context.graphContext.timeline.slice(0, 5).forEach(t => {
          const seq = t.sequence || '';
          const speaker = t.speaker || '';
          const quote = (t.quote || '').slice(0, 100);
          graphLines.push(`  [${seq}] ${speaker}: "${quote}..."`);
        });
        graphLines.push('');
      }

      // Add hidden connections (from Python endpoint)
      if (context.graphContext.connections && context.graphContext.connections.length > 0) {
        graphLines.push('HIDDEN CONNECTIONS:');
        context.graphContext.connections.slice(0, 5).forEach(conn => {
          graphLines.push(`  - ${conn.entity} mentioned by ${conn.mentioned_by} (${conn.sentiment || 'neutral'})`);
        });
        graphLines.push('');
      }

      // Add relevant relationships (from JS service)
      if (context.graphContext.relationships && context.graphContext.relationships.length > 0) {
        graphLines.push('KEY RELATIONSHIPS:');
        context.graphContext.relationships.slice(0, 5).forEach(r => {
          const name = r.person?.name || 'Unknown';
          const type = r.type || 'CONNECTED';
          graphLines.push(`  - ${name} (${type})`);
        });
        graphLines.push('');
      }

      // Add relevant events (from JS service)
      if (context.graphContext.events && context.graphContext.events.length > 0) {
        graphLines.push('RELEVANT EVENTS:');
        context.graphContext.events.slice(0, 5).forEach(e => {
          const name = e.name || e.title || 'Event';
          const year = e.year || e.date || '';
          graphLines.push(`  - ${name}${year ? ` (${year})` : ''}`);
        });
        graphLines.push('');
      }

      // Add entities mentioned
      if (context.graphContext.entities && context.graphContext.entities.length > 0) {
        graphLines.push(`ENTITIES MENTIONED: ${context.graphContext.entities.join(', ')}`);
      }

      // Add themes found
      if (context.graphContext.topics && context.graphContext.topics.length > 0) {
        graphLines.push(`THEMES: ${context.graphContext.topics.join(', ')}`);
      }

      // Add extracted topics
      if (context.extractedTopics && context.extractedTopics.length > 0) {
        graphLines.push(`QUERY TOPICS: ${context.extractedTopics.join(', ')}`);
      }

      // Add summary if available
      if (context.graphContext.summary) {
        graphLines.push(`\nSUMMARY: ${context.graphContext.summary}`);
      }

      sections.push(graphLines.join('\n'));
    }
  }

  if (sections.length === 0) {
    return ''; // No context to inject
  }

  return '\n\n---\n\n' + sections.join('\n\n---\n\n');
}

/**
 * Check if RAG services are available
 */
function isAvailable() {
  const hasPostgres = !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL;
  const hasOpenAI = !!process.env.OPENAI_API_KEY && !!OpenAI;
  const hasNeo4j = neo4jGuestService && neo4jGuestService.isAvailable();
  const hasPythonGraphRAG = !!axios && !!PYTHON_GRAPHRAG_URL;

  return hasPostgres || hasNeo4j || hasPythonGraphRAG;
}

/**
 * Get availability status for debugging
 */
function getStatus() {
  return {
    vectorSearch: {
      postgres: !!pgPool || !!process.env.DATABASE_URL,
      openai: !!openaiClient || (!!process.env.OPENAI_API_KEY && !!OpenAI)
    },
    graphRag: {
      neo4j: neo4jGuestService ? neo4jGuestService.isAvailable() : false,
      pythonEndpoint: !!axios && !!PYTHON_GRAPHRAG_URL,
      pythonUrl: PYTHON_GRAPHRAG_URL
    },
    topicExtractor: !!topicExtractor
  };
}

module.exports = {
  getRAGContext,
  searchBiographyChunks,
  getGraphContext,
  callPythonGraphRAG,
  extractEntities,
  formatRAGContextForPrompt,
  isAvailable,
  getStatus,
  initializePostgres,
  initializeOpenAI
};
