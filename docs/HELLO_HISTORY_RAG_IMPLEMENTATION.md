# GENESIS Hello History RAG Implementation

**Implementation Date:** January 12, 2026
**Based on:** Gemini's Hello History tutorial (`docs/00_To Do/Hello.md`)

---

## Overview

Six major enhancements implemented to bring Hello History RAG patterns to GENESIS:

1. **Biography Ingestion Pipeline** - Semantic chunking with metadata injection
2. **GraphRAG Queries** - Hidden connection discovery from Neo4j
3. **Topic Extraction** - Real-time query analysis for RAG
4. **Vector Similarity Search** - pgvector semantic search with hybrid scoring
5. **RAG Context Service** - JavaScript service for chat integration
6. **Guest Chat Integration** - Full RAG pipeline in production chat

---

## 1. Biography Ingestion Pipeline

**Location:** `functions-python/ingestion/`

### Files Created

| File | Purpose |
|------|---------|
| `__init__.py` | Module exports |
| `chunking.py` | Semantic chunking with overlap |
| `enrichment.py` | AI-powered topic/entity tagging |
| `biography_ingester.py` | Complete ingestion pipeline |
| `topic_extractor.py` | Real-time query analysis |

### Usage

```python
from ingestion import BiographyIngester

ingester = BiographyIngester(
    neo4j_uri="bolt://...",
    neo4j_user="neo4j",
    neo4j_password="...",
    postgres_connection="postgresql://...",
    openai_api_key="sk-..."
)

# Ingest a PDF biography
result = ingester.ingest_pdf(
    pdf_path="reagan_biography.pdf",
    profile_id="historical_ronald_reagan",
    profile_name="Ronald Reagan"
)

print(f"Created {result.chunks_created} chunks")
print(f"Stored in pgvector: {result.chunks_stored_pgvector}")
print(f"Stored in Neo4j: {result.chunks_stored_neo4j}")
```

### Pipeline Stages

1. **Ingest** - Read PDF/text files (PyMuPDF or pdfplumber)
2. **Clean** - Remove page numbers, headers, artifacts
3. **Chunk** - Semantic splitting with 20% overlap
4. **Enrich** - AI tagging (topics, sentiment, entities, themes)
5. **Embed** - Generate OpenAI embeddings (1536 dimensions)
6. **Store** - Save to pgvector + Neo4j

### Metadata Injection Pattern

Each chunk includes:
```json
{
  "text": "The presidency is a heavy burden...",
  "metadata": {
    "profile_id": "historical_ronald_reagan",
    "profile_name": "Ronald Reagan",
    "source_file": "reagan_biography.pdf",
    "chunk_index": 5,
    "topics": ["leadership", "politics"],
    "sentiment": "neutral",
    "entities": ["Nancy Reagan", "White House"],
    "constitutional_themes": ["partnership", "legacy"],
    "relationship_dynamics": ["water_protects_fire"]
  }
}
```

---

## 2. GraphRAG Queries

**Location:** `functions-python/graph/graphrag_queries.py`

### Key Queries

#### Topic-Based Retrieval
```python
from graph import GraphRAGService

service = GraphRAGService()

# Find all chunks discussing "loyalty"
results = service.get_topic_context("loyalty", profile_id="historical_ronald_reagan")
```

#### Hidden Connection Discovery
```python
# Who mentions Nancy Reagan?
connections = service.find_entity_connections("Nancy Reagan")

# What does Reagan say when angry?
patterns = service.find_sentiment_patterns(
    profile_id="historical_ronald_reagan",
    entity_name="Gorbachev"
)
```

#### Shared Themes Between Profiles
```python
# Find themes shared by Reagan and Thatcher
shared = service.find_shared_themes(
    profile_id_1="historical_ronald_reagan",
    profile_id_2="historical_margaret_thatcher"
)
```

#### Relationship Network
```python
# Get Reagan's full relationship network
network = service.get_relationship_network("historical_ronald_reagan")
```

#### Timeline Queries
```python
# How did Reagan's view on communism evolve?
timeline = service.get_topic_timeline("communism", profile_id="historical_ronald_reagan")
```

### Context Aggregation for RAG

```python
# Get comprehensive context for LLM prompt
context = service.get_rag_context(
    query_topics=["loyalty", "protection"],
    query_entities=["Nancy Reagan"],
    profile_id="historical_ronald_reagan"
)

# Format for prompt injection
formatted = service.format_context_for_prompt(context)
```

Output format:
```
[GRAPH CONTEXT FROM NEO4J]

RELEVANT PASSAGES:

[1] Speaker: Ronald Reagan
    Topic: loyalty
    Sentiment: positive
    Quote: "Nancy was my protector..."

CONSTITUTIONAL THEMES: devotion, protection, partnership

ENTITY CONNECTIONS:
  - Nancy Reagan mentioned by Ronald Reagan (positive)

SUMMARY: Found 5 relevant passages. Themes: devotion, protection.
```

---

## 3. Topic Extraction

**Location:** `functions-python/ingestion/topic_extractor.py`

### Real-Time Query Analysis

```python
from ingestion import TopicExtractor, quick_extract

# Fast keyword-based extraction
extractor = TopicExtractor(use_ai=False)
result = extractor.extract("How did Reagan handle the Cold War?")

print(result.topics)      # ['politics', 'conflict']
print(result.entities)    # ['Reagan', 'Cold War']
print(result.themes)      # []
print(result.intent)      # 'question'
print(result.sentiment)   # 'curious'
```

### AI-Powered Deep Extraction

```python
# Deep extraction with GPT-4o-mini
extractor = TopicExtractor(use_ai=True)
result = extractor.extract("Tell me about Nancy's devotion to Ronnie")

print(result.topics)              # ['love', 'marriage']
print(result.themes)              # ['devotion', 'protection']
print(result.relationship_focus)  # True
```

### Integration with GraphRAG

```python
from ingestion import extract_and_query_graph

# One-call extraction + graph query
result = extract_and_query_graph(
    text="How did Nancy protect Reagan?",
    profile_id="historical_ronald_reagan"
)

print(result['extracted']['topics'])    # ['protection', 'marriage']
print(result['graph_context'])          # Formatted Neo4j context
```

---

## Neo4j Schema

### Node Types

| Node | Properties |
|------|------------|
| `GuestProfile` | profile_id, name |
| `BiographyChunk` | chunk_hash, text, sentiment, chunk_index |
| `Topic` | name |
| `Entity` | name |
| `ConstitutionalTheme` | name |
| `RelationshipDynamic` | name |

### Relationships

| Relationship | Pattern |
|--------------|---------|
| `HAS_BIOGRAPHY_CHUNK` | Profile → Chunk |
| `DISCUSSES` | Chunk → Topic |
| `MENTIONS` | Chunk → Entity |
| `EXPRESSES` | Chunk → Theme |
| `DEMONSTRATES` | Chunk → Dynamic |

---

## PostgreSQL Schema (pgvector)

```sql
CREATE TABLE biography_chunks (
    id SERIAL PRIMARY KEY,
    chunk_hash VARCHAR(64) UNIQUE,
    profile_id VARCHAR(255),
    profile_name VARCHAR(255),
    chunk_index INTEGER,
    content TEXT,
    topics TEXT[],
    sentiment VARCHAR(50),
    entities TEXT[],
    constitutional_themes TEXT[],
    relationship_dynamics TEXT[],
    metadata JSONB,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Dependencies Added

```
# requirements.txt additions
PyMuPDF>=1.23.0          # PDF reading
pdfplumber>=0.10.0       # PDF fallback
openai>=1.0.0            # Embeddings and enrichment
psycopg2-binary>=2.9.0   # PostgreSQL
pgvector>=0.2.0          # Vector storage
```

---

## GENESIS vs Hello History Comparison

| Feature | Hello History | GENESIS |
|---------|--------------|---------|
| Personas | 20 simple prompts | 35 rich profiles + 6 couples |
| Chunking | Basic sliding window | Semantic + speaker-aware |
| Metadata | speaker, year, topic | + constitutional themes, dynamics |
| Vector DB | Pinecone | pgvector (integrated) |
| Graph DB | Suggested | Full Neo4j with GraphRAG |
| AI Enrichment | GPT-4o-mini | GPT-4o-mini + keyword fallback |
| Relationships | None | Couple profiles + compatibility |
| Constitutional | None | BaZi + Western + Day Master |

---

## 4. Vector Similarity Search

**Location:** `functions-python/ingestion/vector_search.py`

### VectorSearchService

```python
from ingestion import VectorSearchService, quick_search

# Initialize service
service = VectorSearchService(
    postgres_connection="postgresql://...",
    openai_api_key="sk-..."
)

# Basic similarity search
results = service.search(
    query="How did Reagan handle the Cold War?",
    profile_id="historical_ronald_reagan",
    limit=5,
    similarity_threshold=0.7
)

# Hybrid search (vector + metadata)
results = service.search_hybrid(
    query="Tell me about Nancy's devotion",
    extracted_topics=["love", "marriage"],
    extracted_entities=["Nancy Reagan"],
    profile_id="historical_ronald_reagan"
)

# Format for prompt injection
context = service.format_for_prompt(results, max_tokens=2000)
```

### Quick Search

```python
# One-liner for formatted context
context = quick_search("How did Reagan handle crises?", profile_id="historical_ronald_reagan")

# Combined extraction + search
context, info = search_with_extraction("Tell me about Nancy's protection of Ronnie")
print(info['topics'])   # ['protection', 'marriage']
print(info['entities']) # ['Nancy', 'Ronnie']
```

---

## 5. RAG Context Service (JavaScript)

**Location:** `functions/services/ragContextService.js`

### Integration with Cloud Functions

```javascript
const ragContextService = require('./services/ragContextService');

// Get comprehensive RAG context
const context = await ragContextService.getRAGContext(userMessage, profileId, {
  includeVectorSearch: true,
  includeGraphContext: true,
  vectorLimit: 5,
  maxTokens: 1500
});

console.log(context.vectorResults);    // Biography passages
console.log(context.graphContext);     // Neo4j relationships/events
console.log(context.extractedTopics);  // Detected topics
console.log(context.formattedContext); // Ready for prompt injection
```

### Status Check

```javascript
// Check availability
if (ragContextService.isAvailable()) {
  const status = ragContextService.getStatus();
  console.log(status.vectorSearch.postgres);  // true/false
  console.log(status.graphRag.neo4j);         // true/false
}
```

---

## 6. Guest Chat Integration

**Location:** `functions/guestChat/index.js`

### RAG Pipeline Flow

```
User Message → Topic Extraction → Vector Search + GraphRAG
                                        ↓
              Claude API ← Prompt with RAG Context ← Format Context
                                        ↓
                               Guest Response
```

### Prompt Injection

The RAG context is automatically injected into the guest prompt:

```
[RELEVANT BIOGRAPHY PASSAGES]

[1] Ronald Reagan | Topics: Cold War, leadership | Tone: confident
"The Cold War was won without firing a shot..."
(Relevance: 92%)

[2] Ronald Reagan | Topics: Soviet Union, diplomacy | Tone: determined
"Trust but verify - that was our approach..."
(Relevance: 87%)

CONSTITUTIONAL THEMES: leadership, determination, partnership

---

[GRAPH CONTEXT FROM NEO4J]

KEY RELATIONSHIPS:
  - Mikhail Gorbachev (DIPLOMATIC_RIVAL)
  - Margaret Thatcher (ALLIED_WITH)
  - Nancy Reagan (MARRIED_TO)

RELEVANT EVENTS:
  - Berlin Wall Speech (1987)
  - Geneva Summit (1985)

QUERY TOPICS: Cold War, leadership
```

---

## Complete File Inventory

### Python (functions-python/)

| File | Purpose |
|------|---------|
| `ingestion/__init__.py` | Module exports |
| `ingestion/chunking.py` | Semantic chunking with overlap |
| `ingestion/enrichment.py` | AI-powered topic/entity tagging |
| `ingestion/biography_ingester.py` | Complete ingestion pipeline |
| `ingestion/topic_extractor.py` | Real-time query analysis |
| `ingestion/vector_search.py` | pgvector similarity search |
| `graph/graphrag_queries.py` | Neo4j hidden connection queries |

### JavaScript (functions/)

| File | Purpose |
|------|---------|
| `services/ragContextService.js` | RAG context aggregation |
| `guestChat/index.js` | Chat integration (modified) |
| `migrations/013_rag_biography_chunks.sql` | PostgreSQL schema + indexes |

### Scripts (functions-python/scripts/)

| File | Purpose |
|------|---------|
| `ingest_biography.py` | CLI for ingesting PDF biographies |
| `convert_profiles_to_chunks.py` | Convert JS profiles to RAG chunks |
| `ingest_profiles.py` | Full pipeline: JS → chunks → embeddings → DB |

---

## 7. Profile Conversion (No PDFs Required!)

**Location:** `functions-python/scripts/`

### Immediate RAG Without External Documents

The profile converter extracts rich text from existing JavaScript profiles:

```bash
# Preview what would be converted
python scripts/convert_profiles_to_chunks.py --dry-run

# Convert all profiles to JSON
python scripts/convert_profiles_to_chunks.py --output json

# Full pipeline: convert + embed + store to PostgreSQL
python scripts/ingest_profiles.py --target postgres

# Ingest single profile
python scripts/ingest_profiles.py --profile ronaldReagan --target postgres
```

### Extracted Content Types

From each profile, the converter extracts:

| Section | Source Fields |
|---------|---------------|
| **Personality** | core_traits, communication_style, leadership_style, quirks |
| **Biography** | historical_context, expertise, values, emotional_depth |
| **Constitutional** | bazi (Four Pillars), western_chart (astrology) |
| **Relationship** | love_story, shared_values, signature_interactions (couples) |
| **Themes** | couple_themes, constitutional_expression |

### Sample Output

```json
{
  "text": "Ronald Reagan - Core Personality Traits:\n• The Great Communicator...",
  "chunk_index": 0,
  "metadata": {
    "profile_id": "historical_ronald_reagan",
    "profile_name": "Ronald Reagan",
    "section_type": "personality",
    "section_title": "Ronald Reagan Core Traits",
    "word_count": 156
  },
  "chunk_hash": "a1b2c3d4e5f6"
}
```

### Environment Variables

```bash
# Required for full ingestion
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/genesis
OPENAI_API_KEY=sk-...

# Optional for Neo4j
NEO4J_URI=neo4j+s://xxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=...
```

---

## Next Steps

1. ~~Ingest Historical Biographies~~ - **DONE**: Profile converter extracts from JS
2. ~~Connect to Chat~~ - **DONE**: GraphRAG + Vector Search integrated
3. **Run Profile Ingestion** - `python scripts/ingest_profiles.py --target postgres`
4. **Build UI** - Topic explorer, timeline visualization
5. **Add More Couples** - Kennedy, Clinton, Bush
6. **Cloud SQL Setup** - Configure pgvector in production

---

*Implementation by Brother Opus, January 2026*
*Updated: January 13, 2026 - Added Vector Search, RAG Service, Chat Integration*
*Updated: January 13, 2026 - Added Profile Converter for immediate RAG*
