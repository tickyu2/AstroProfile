# GENESIS RAG Setup Steps

## Quick Summary

Your RAG infrastructure is ready! Just need to:
1. Run the database migration (create `biography_chunks` table)
2. Ingest the profile data (195 chunks ready)

---

## Step 1: Run Database Migration

### Option A: Google Cloud Console (Easiest)

1. Go to: https://console.cloud.google.com/sql/instances/genesismemory/overview?project=astroprofile-391e6
2. Click **"Cloud SQL Studio"** in the left sidebar
3. Connect with:
   - Database: `genesis_memory`
   - User: `postgres`
   - Password: (from your .env file)
4. Paste and run this SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Biography chunks table for RAG
CREATE TABLE IF NOT EXISTS biography_chunks (
    id SERIAL PRIMARY KEY,
    chunk_hash VARCHAR(64) UNIQUE,
    profile_id VARCHAR(255) NOT NULL,
    profile_name VARCHAR(255),
    chunk_index INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    topics TEXT[],
    sentiment VARCHAR(50),
    entities TEXT[],
    constitutional_themes TEXT[],
    relationship_dynamics TEXT[],
    metadata JSONB,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_biography_chunks_profile_id ON biography_chunks(profile_id);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_topics ON biography_chunks USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_entities ON biography_chunks USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_biography_chunks_themes ON biography_chunks USING GIN(constitutional_themes);

-- Verify
SELECT 'SUCCESS: biography_chunks created' as status,
       (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'biography_chunks') as indexes;
```

### Option B: Cloud Shell

1. Go to: https://console.cloud.google.com/cloudshell
2. Run:
```bash
gcloud config set project astroprofile-391e6
gcloud sql connect genesismemory --database=genesis_memory --user=postgres
```
3. Paste the SQL above

---

## Step 2: Install Cloud SQL Proxy (Local Development)

### Windows
```powershell
# Download Cloud SQL Proxy
curl -o cloud-sql-proxy.exe https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.x64.exe

# Run proxy (in separate terminal)
.\cloud-sql-proxy.exe astroprofile-391e6:us-central1:genesismemory --port=5432
```

### Mac/Linux
```bash
# Download
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy

# Run proxy
./cloud-sql-proxy astroprofile-391e6:us-central1:genesismemory --port=5432
```

---

## Step 3: Ingest Profile Data

With Cloud SQL Proxy running (Step 2):

```bash
# Set environment variables
export DATABASE_URL="postgresql://postgres:I5DN)i2\3z[4mf46@localhost:5432/genesis_memory"
export OPENAI_API_KEY="sk-proj-REDACTED"

# Navigate to project
cd c:\astroprofile

# Run ingestion (195 chunks)
python functions-python/scripts/ingest_profiles.py --target postgres
```

---

## Step 4: Verify

Check that data was ingested:

```sql
-- Run in Cloud SQL Studio
SELECT COUNT(*) as total_chunks,
       COUNT(DISTINCT profile_id) as profiles,
       COUNT(embedding) as with_embeddings
FROM biography_chunks;
```

Expected output:
- ~195 total chunks
- ~35 profiles
- ~195 with embeddings (if OpenAI key worked)

---

## Files Created

| File | Purpose |
|------|---------|
| `functions-python/scripts/convert_profiles_to_chunks.py` | JS → chunks |
| `functions-python/scripts/ingest_profiles.py` | Full pipeline |
| `functions-python/scripts/run_migration.py` | Local migration |
| `functions-python/scripts/profile_chunks.json` | 195 chunks ready |
| `scripts/setup_rag_complete.sh` | Cloud Shell script |

---

## Troubleshooting

### "Connection refused"
- Cloud SQL Proxy not running
- Wrong password (check special characters)

### "pgvector extension not available"
- Cloud SQL Enterprise Plus required for pgvector
- Or use pg_embedding as alternative

### "Embedding generation failed"
- Check OPENAI_API_KEY is valid
- Chunks will still be stored, embeddings can be added later

---

*Last updated: January 13, 2026*
