/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENESIS DOCUMENTATION STORE - Vector-Indexed Repository Knowledge
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides semantic search over project documentation:
 * - Architecture docs (LUNA_SOUL_ARCHITECTURE, EMOTIONAL_ENGINE, etc.)
 * - Implementation guides (API_DOCUMENTATION, CLOUD_SQL_SETUP, etc.)
 * - Planning docs (week notes, brainstorms, feature specs)
 *
 * Features:
 * - Markdown chunking by headers (preserves context)
 * - 768-dim Gemini embeddings for semantic search
 * - Firestore vector search with findNearest
 * - Category filtering (architecture, implementation, planning)
 *
 * Created: January 4, 2026
 * Part of: GENESIS Knowledge RAG System
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Import LLM client for embeddings
let embedText;
try {
  const clientFactory = require('../llm/clientFactory');
  embedText = clientFactory.embedText;
} catch (e) {
  console.warn('[DocStore] clientFactory not available, using fallback');
  embedText = async () => null;
}

const { FieldValue } = require('firebase-admin/firestore');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DOCS_COLLECTION = 'genesis_documentation';
const CHUNK_MAX_TOKENS = 1500;  // Max tokens per chunk
const CHUNK_OVERLAP = 200;      // Overlap between chunks

// Category mapping based on filename patterns
const CATEGORY_PATTERNS = {
  architecture: ['ARCHITECTURE', 'SYSTEM', 'SOUL', 'BRAIN', 'ENGINE'],
  implementation: ['IMPLEMENTATION', 'SETUP', 'GUIDE', 'API', 'FUNCTIONS'],
  planning: ['WEEK', 'ROADMAP', 'CHECKLIST', 'BRAINSTORM', 'TODO'],
  demo: ['DEMO', 'SCRIPTS', 'SCENARIOS'],
  comparison: ['COMPARISON', 'INDUSTRY', 'FEATURES']
};

// ═══════════════════════════════════════════════════════════════════════════════
// MARKDOWN CHUNKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Chunk markdown content by headers while preserving context
 */
function chunkMarkdown(content, filename) {
  const chunks = [];
  const lines = content.split('\n');

  let currentChunk = {
    title: filename,
    headers: [],
    content: '',
    startLine: 1
  };

  let currentLine = 0;

  for (const line of lines) {
    currentLine++;

    // Detect headers
    const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);

    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];

      // If we have accumulated content, save the chunk
      if (currentChunk.content.trim().length > 100) {
        chunks.push({ ...currentChunk });
      }

      // Update headers based on level
      if (level === 1) {
        currentChunk.headers = [headerText];
      } else if (level === 2) {
        currentChunk.headers = [currentChunk.headers[0] || filename, headerText];
      } else {
        // Keep parent headers, add this one
        currentChunk.headers = currentChunk.headers.slice(0, level - 1);
        currentChunk.headers.push(headerText);
      }

      currentChunk.title = headerText;
      currentChunk.content = '';
      currentChunk.startLine = currentLine;
    }

    currentChunk.content += line + '\n';

    // Check if chunk is getting too large
    if (currentChunk.content.length > CHUNK_MAX_TOKENS * 4) { // ~4 chars per token
      chunks.push({ ...currentChunk });

      // Start new chunk with overlap
      const overlapContent = currentChunk.content.slice(-CHUNK_OVERLAP * 4);
      currentChunk.content = overlapContent;
      currentChunk.startLine = currentLine - Math.floor(CHUNK_OVERLAP / 10);
    }
  }

  // Don't forget the last chunk
  if (currentChunk.content.trim().length > 50) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Determine category from filename
 */
function categorizeDocument(filename) {
  const upper = filename.toUpperCase();

  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some(p => upper.includes(p))) {
      return category;
    }
  }

  return 'general';
}

// ═══════════════════════════════════════════════════════════════════════════════
// INDEX DOCUMENTATION (Admin Function)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Index all documentation from the docs/ folder
 * This is an admin function - run manually or via scheduled job
 */
const indexDocumentation = onCall({
  memory: '1GiB',
  timeoutSeconds: 540,  // 9 minutes for large docs
  cors: true
}, async (request) => {
  const { docsPath, dryRun = false } = request.data || {};

  console.log('📚 Starting documentation indexing...');

  const results = {
    indexed: 0,
    chunks: 0,
    errors: [],
    documents: []
  };

  try {
    // In Cloud Functions, we need to read from a provided path or use defaults
    // For local development, use the docs/ folder
    const basePath = docsPath || path.join(__dirname, '../../docs');

    // Get all .md files
    let mdFiles = [];
    try {
      const files = fs.readdirSync(basePath);
      mdFiles = files.filter(f => f.endsWith('.md'));
    } catch (e) {
      console.error('❌ Cannot read docs directory:', e.message);
      return { success: false, error: 'Cannot read docs directory', results };
    }

    console.log(`📄 Found ${mdFiles.length} markdown files`);

    // Process each file
    for (const filename of mdFiles) {
      try {
        const filePath = path.join(basePath, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        const category = categorizeDocument(filename);

        console.log(`📝 Processing: ${filename} (${category})`);

        // Chunk the content
        const chunks = chunkMarkdown(content, filename);

        console.log(`   → ${chunks.length} chunks`);

        // Index each chunk
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          // Build searchable text
          const searchableText = [
            chunk.title,
            chunk.headers.join(' > '),
            chunk.content.slice(0, 2000)  // First 2000 chars for embedding
          ].join('\n');

          // Generate embedding
          let embedding = null;
          if (!dryRun) {
            try {
              embedding = await embedText(searchableText);
              console.log(`   ✓ Embedded chunk ${i + 1}/${chunks.length}`);
            } catch (embErr) {
              console.warn(`   ⚠️ Embedding failed for chunk ${i + 1}:`, embErr.message);
            }
          }

          // Create document ID
          const docId = `${filename.replace('.md', '')}_chunk_${i}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');

          // Build document data
          const docData = {
            filename,
            category,
            chunkIndex: i,
            totalChunks: chunks.length,
            title: chunk.title,
            headers: chunk.headers,
            content: chunk.content,
            searchableText: searchableText.slice(0, 3000),
            startLine: chunk.startLine,
            contentLength: chunk.content.length,
            indexedAt: FieldValue.serverTimestamp(),
            version: '1.0'
          };

          // Add embedding if generated
          if (embedding && embedding.length === 768) {
            docData.embedding = FieldValue.vector(embedding);
          }

          // Store in Firestore
          if (!dryRun) {
            await db.collection(DOCS_COLLECTION).doc(docId).set(docData);
          }

          results.chunks++;
        }

        results.indexed++;
        results.documents.push({
          filename,
          category,
          chunks: chunks.length
        });

      } catch (fileErr) {
        console.error(`❌ Error processing ${filename}:`, fileErr.message);
        results.errors.push({ filename, error: fileErr.message });
      }
    }

    console.log(`✅ Indexing complete: ${results.indexed} files, ${results.chunks} chunks`);

    return {
      success: true,
      results,
      dryRun
    };

  } catch (error) {
    console.error('❌ Indexing error:', error);
    return {
      success: false,
      error: error.message,
      results
    };
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Semantic search over indexed documentation
 *
 * @param {string} query - Natural language search query
 * @param {string} category - Optional category filter
 * @param {number} limit - Max results (default 5)
 */
const searchDocumentation = onCall({
  memory: '256MiB',
  timeoutSeconds: 30,
  cors: true
}, async (request) => {
  const { query, category, limit = 5 } = request.data;

  if (!query) {
    return { success: false, error: 'Query is required' };
  }

  console.log(`🔍 Searching docs: "${query}" (category: ${category || 'all'})`);

  try {
    // Generate query embedding
    const queryEmbedding = await embedText(query);

    if (!queryEmbedding || queryEmbedding.every(v => v === 0)) {
      console.warn('⚠️ Failed to embed query, falling back to text search');
      return await fallbackTextSearch(query, category, limit);
    }

    // Build query
    let docsRef = db.collection(DOCS_COLLECTION);

    // Category filter (if specified)
    if (category) {
      docsRef = docsRef.where('category', '==', category);
    }

    // Vector search
    const vectorQuery = docsRef.findNearest('embedding', queryEmbedding, {
      limit: limit,
      distanceMeasure: 'COSINE'
    });

    const snapshot = await vectorQuery.get();

    const results = snapshot.docs.map(doc => {
      const data = doc.data();
      const similarity = 1 - (doc.distance || 0);

      return {
        id: doc.id,
        filename: data.filename,
        category: data.category,
        title: data.title,
        headers: data.headers,
        content: data.content.slice(0, 500) + '...',  // Preview
        similarity,
        chunkIndex: data.chunkIndex,
        totalChunks: data.totalChunks
      };
    });

    console.log(`✅ Found ${results.length} results for: "${query}"`);

    return {
      success: true,
      results,
      searchType: 'semantic',
      query
    };

  } catch (error) {
    console.error('❌ Search error:', error);

    // If vector index missing, fall back gracefully
    if (error.message?.includes('index')) {
      console.warn('⚠️ Vector index may be missing, trying text search');
      return await fallbackTextSearch(query, category, limit);
    }

    return {
      success: false,
      error: error.message,
      results: []
    };
  }
});

/**
 * Fallback text search when vector search fails
 */
async function fallbackTextSearch(query, category, limit) {
  try {
    let docsRef = db.collection(DOCS_COLLECTION);

    if (category) {
      docsRef = docsRef.where('category', '==', category);
    }

    // Get recent docs and filter client-side
    const snapshot = await docsRef
      .orderBy('indexedAt', 'desc')
      .limit(100)
      .get();

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    const results = snapshot.docs
      .map(doc => {
        const data = doc.data();
        const searchText = (data.searchableText || '').toLowerCase();

        // Score based on word matches
        const matches = queryWords.filter(w => searchText.includes(w)).length;
        const score = matches / queryWords.length;

        return {
          id: doc.id,
          filename: data.filename,
          category: data.category,
          title: data.title,
          headers: data.headers,
          content: data.content?.slice(0, 500) + '...',
          similarity: score,
          chunkIndex: data.chunkIndex,
          totalChunks: data.totalChunks
        };
      })
      .filter(r => r.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return {
      success: true,
      results,
      searchType: 'fallback',
      query
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      results: [],
      searchType: 'fallback'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET DOCUMENTATION CONTEXT (For Luna)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get relevant documentation context for a conversation topic
 * Used by Luna to reference architecture/implementation details
 *
 * @param {string} topic - The topic to get documentation for
 * @param {number} maxChunks - Max chunks to return
 */
async function getDocumentationContext(topic, maxChunks = 3) {
  try {
    const queryEmbedding = await embedText(topic);

    if (!queryEmbedding) {
      return { context: '', sources: [] };
    }

    const vectorQuery = db.collection(DOCS_COLLECTION)
      .findNearest('embedding', queryEmbedding, {
        limit: maxChunks,
        distanceMeasure: 'COSINE'
      });

    const snapshot = await vectorQuery.get();

    const chunks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        filename: data.filename,
        title: data.title,
        content: data.content,
        similarity: 1 - (doc.distance || 0)
      };
    }).filter(c => c.similarity > 0.5);  // Only include relevant chunks

    if (chunks.length === 0) {
      return { context: '', sources: [] };
    }

    // Build context string
    const context = chunks.map(c =>
      `[From ${c.filename} - ${c.title}]\n${c.content}`
    ).join('\n\n---\n\n');

    const sources = chunks.map(c => ({
      filename: c.filename,
      title: c.title,
      similarity: c.similarity
    }));

    return { context, sources };

  } catch (error) {
    console.error('❌ getDocumentationContext error:', error);
    return { context: '', sources: [] };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Cloud Functions
  indexDocumentation,
  searchDocumentation,

  // Internal API
  getDocumentationContext,
  chunkMarkdown,
  categorizeDocument,

  // Constants
  DOCS_COLLECTION
};
