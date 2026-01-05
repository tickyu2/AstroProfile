#!/usr/bin/env node
/**
 * Local Documentation Indexer Script
 *
 * Indexes all markdown files from docs/ into Firestore with vector embeddings
 * Run: node functions/scripts/indexDocs.js
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS or service account in functions folder
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Firebase Admin
const admin = require('firebase-admin');

// Try to find service account
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const altServiceAccountPath = path.join(__dirname, '../astroprofile-391e6-firebase-adminsdk-fbsvc-79fae56397.json');

let serviceAccount = null;
if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = require(serviceAccountPath);
} else if (fs.existsSync(altServiceAccountPath)) {
  serviceAccount = require(altServiceAccountPath);
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();
const { FieldValue } = admin.firestore;

// Import embedding function
const { GoogleGenerativeAI } = require('@google/generative-ai');

const DOCS_COLLECTION = 'genesis_documentation';
const CHUNK_MAX_CHARS = 6000;  // ~1500 tokens
const CHUNK_OVERLAP = 800;

// Initialize Gemini for embeddings
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured in .env');
  }
  return new GoogleGenerativeAI(apiKey);
}

async function embedText(text) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding error:', error.message);
    return null;
  }
}

// Category mapping
const CATEGORY_PATTERNS = {
  architecture: ['ARCHITECTURE', 'SYSTEM', 'SOUL', 'BRAIN', 'ENGINE'],
  implementation: ['IMPLEMENTATION', 'SETUP', 'GUIDE', 'API', 'FUNCTIONS'],
  planning: ['WEEK', 'ROADMAP', 'CHECKLIST', 'BRAINSTORM', 'TODO'],
  demo: ['DEMO', 'SCRIPTS', 'SCENARIOS'],
  comparison: ['COMPARISON', 'INDUSTRY', 'FEATURES']
};

function categorizeDocument(filename) {
  const upper = filename.toUpperCase();
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some(p => upper.includes(p))) {
      return category;
    }
  }
  return 'general';
}

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

    const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);

    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];

      if (currentChunk.content.trim().length > 100) {
        chunks.push({ ...currentChunk });
      }

      if (level === 1) {
        currentChunk.headers = [headerText];
      } else if (level === 2) {
        currentChunk.headers = [currentChunk.headers[0] || filename, headerText];
      } else {
        currentChunk.headers = currentChunk.headers.slice(0, level - 1);
        currentChunk.headers.push(headerText);
      }

      currentChunk.title = headerText;
      currentChunk.content = '';
      currentChunk.startLine = currentLine;
    }

    currentChunk.content += line + '\n';

    if (currentChunk.content.length > CHUNK_MAX_CHARS) {
      chunks.push({ ...currentChunk });
      const overlapContent = currentChunk.content.slice(-CHUNK_OVERLAP);
      currentChunk.content = overlapContent;
      currentChunk.startLine = currentLine - Math.floor(CHUNK_OVERLAP / 50);
    }
  }

  if (currentChunk.content.trim().length > 50) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function indexDocumentation() {
  console.log('📚 Starting documentation indexing...\n');

  const docsPath = path.join(__dirname, '../../docs');

  // Get all .md files
  let mdFiles = [];
  try {
    const files = fs.readdirSync(docsPath);
    mdFiles = files.filter(f => f.endsWith('.md'));
  } catch (e) {
    console.error('❌ Cannot read docs directory:', e.message);
    process.exit(1);
  }

  console.log(`📄 Found ${mdFiles.length} markdown files\n`);

  const results = {
    indexed: 0,
    chunks: 0,
    errors: [],
    documents: []
  };

  // Clear existing documentation (optional)
  console.log('🗑️  Clearing existing documentation...');
  const existingDocs = await db.collection(DOCS_COLLECTION).listDocuments();
  const batch = db.batch();
  for (const doc of existingDocs) {
    batch.delete(doc);
  }
  if (existingDocs.length > 0) {
    await batch.commit();
    console.log(`   Deleted ${existingDocs.length} existing documents\n`);
  }

  // Process each file
  for (const filename of mdFiles) {
    try {
      const filePath = path.join(docsPath, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const category = categorizeDocument(filename);

      console.log(`📝 Processing: ${filename} (${category})`);

      const chunks = chunkMarkdown(content, filename);
      console.log(`   → ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        const searchableText = [
          chunk.title,
          chunk.headers.join(' > '),
          chunk.content.slice(0, 2000)
        ].join('\n');

        // Generate embedding
        let embedding = null;
        try {
          embedding = await embedText(searchableText);
          if (embedding) {
            process.stdout.write(`   ✓ Chunk ${i + 1}/${chunks.length}\r`);
          }
        } catch (embErr) {
          console.warn(`   ⚠️ Embedding failed for chunk ${i + 1}:`, embErr.message);
        }

        const docId = `${filename.replace('.md', '')}_chunk_${i}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');

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

        if (embedding && embedding.length === 768) {
          docData.embedding = FieldValue.vector(embedding);
        }

        await db.collection(DOCS_COLLECTION).doc(docId).set(docData);
        results.chunks++;

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 100));
      }

      console.log(`   ✓ ${chunks.length} chunks indexed`);
      results.indexed++;
      results.documents.push({ filename, category, chunks: chunks.length });

    } catch (fileErr) {
      console.error(`❌ Error processing ${filename}:`, fileErr.message);
      results.errors.push({ filename, error: fileErr.message });
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 INDEXING COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   Files indexed: ${results.indexed}`);
  console.log(`   Total chunks: ${results.chunks}`);
  console.log(`   Errors: ${results.errors.length}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (results.errors.length > 0) {
    console.log('Errors:');
    results.errors.forEach(e => console.log(`   - ${e.filename}: ${e.error}`));
  }

  return results;
}

// Run indexer
indexDocumentation()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });
