# GENESIS Luna - Cloud SQL PostgreSQL Setup

## Quick Start

### Step 1: Create Cloud SQL Instance (5-10 minutes)

**Option A: Web Console (Recommended)**
1. Go to https://console.cloud.google.com/sql
2. Click "Create Instance"
3. Choose "PostgreSQL"
4. Configure:
   - Instance ID: `genesis-luna-db`
   - Password: (set a strong password, save it!)
   - Region: `us-central1`
   - PostgreSQL version: 15
   - Machine type: `db-f1-micro` (1 vCPU, 614 MB)
   - Storage: 10 GB SSD
5. Click "Create" (takes 5-10 minutes)

**Option B: gcloud CLI**
```bash
# Set your project
gcloud config set project YOUR_FIREBASE_PROJECT_ID

# Create instance
gcloud sql instances create genesis-luna-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB
```

### Step 2: Connect and Install pgvector

```bash
# Connect to instance
gcloud sql connect genesis-luna-db --user=postgres
# Enter password when prompted
```

In PostgreSQL shell:
```sql
-- Create genesis database
CREATE DATABASE genesis;

-- Connect to it
\c genesis

-- Install pgvector
CREATE EXTENSION vector;

-- Verify
SELECT * FROM pg_extension WHERE extname = 'vector';
-- Should show: vector | 0.5.0 | ...

-- Exit
\q
```

### Step 3: Run Schema Migration

```bash
# Connect again
gcloud sql connect genesis-luna-db --user=postgres

# In psql shell, connect to genesis database
\c genesis

# Run migration (from project root)
\i functions/migrations/001_initial_schema.sql

# Verify tables created
\dt
```

Expected tables:
- `emotion_detections`
- `happiness_anchors`
- `user_emotional_bathtub`
- `luna_approach_effectiveness`
- `luna_learned_patterns`
- `luna_neural_models`
- `luna_inside_jokes`
- `user_luna_relationship`

### Step 4: Configure Environment Variables

Create or update `functions/.env`:
```env
# Genesis Luna Database
GENESIS_DB_USER=postgres
GENESIS_DB_PASSWORD=your_password_here
GENESIS_DB_NAME=genesis
GENESIS_DB_HOST=localhost
GENESIS_DB_PORT=5432

# For Cloud SQL (production)
CLOUD_SQL_CONNECTION_NAME=your-project-id:us-central1:genesis-luna-db
```

### Step 5: Test Connection

**Start Cloud SQL Proxy (for local development):**
```bash
# Download proxy if needed
# https://cloud.google.com/sql/docs/postgres/sql-proxy

# Run proxy
cloud_sql_proxy -instances=YOUR_PROJECT:us-central1:genesis-luna-db=tcp:5432
```

**Run test:**
```bash
cd functions
node test/genesisDatabase.test.js
```

Expected output:
```
============================================================
GENESIS LUNA - DATABASE TEST
============================================================

TEST 1: Health Check
----------------------------------------
Connected: true
Database: genesis
Version: PostgreSQL 15.x
pgvector: Enabled (v0.5.0)
Tables: emotion_detections, happiness_anchors, ...

...

============================================================
ALL TESTS PASSED!
============================================================
```

### Step 6: Deploy to Firebase Functions

**Add VPC connector (if not exists):**
```bash
gcloud compute networks vpc-access connectors create genesis-connector \
  --region=us-central1 \
  --range=10.8.0.0/28
```

**Set Firebase config:**
```bash
firebase functions:config:set \
  genesis.db_user="postgres" \
  genesis.db_password="your_password_here" \
  genesis.db_name="genesis" \
  genesis.connection="your-project-id:us-central1:genesis-luna-db"
```

**Deploy:**
```bash
firebase deploy --only functions
```

## Cost Breakdown

| Environment | Monthly Cost |
|------------|-------------|
| Development (db-f1-micro) | $9.37 |
| Production (db-n1-standard-1) | ~$79 |
| Scale (db-n1-standard-4) | ~$314 |

## Troubleshooting

### Connection refused
- Ensure Cloud SQL Proxy is running
- Check firewall rules allow connection

### pgvector not found
- Run `CREATE EXTENSION vector;` in genesis database
- Check PostgreSQL version is 15+

### Permission denied
- Check DB_USER and DB_PASSWORD are correct
- Ensure user has access to genesis database

## Files Created

- `functions/migrations/001_initial_schema.sql` - Full schema (8 tables)
- `functions/config/genesisDatabase.js` - Connection pool config
- `functions/test/genesisDatabase.test.js` - Database test script

---

## RAG Biography Schema (Hello History)

After basic setup, add the biography chunks table for RAG:

```sql
-- Connect to genesis database
\c genesis

-- Create biography chunks table with vector embeddings
CREATE TABLE IF NOT EXISTS biography_chunks (
    id SERIAL PRIMARY KEY,
    chunk_hash VARCHAR(64) UNIQUE,
    profile_id VARCHAR(255) NOT NULL,
    profile_name VARCHAR(255),
    chunk_index INTEGER,
    content TEXT NOT NULL,
    topics TEXT[],
    sentiment VARCHAR(50),
    entities TEXT[],
    constitutional_themes TEXT[],
    relationship_dynamics TEXT[],
    metadata JSONB,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX idx_biography_profile ON biography_chunks(profile_id);
CREATE INDEX idx_biography_topics ON biography_chunks USING GIN(topics);
CREATE INDEX idx_biography_entities ON biography_chunks USING GIN(entities);
CREATE INDEX idx_biography_themes ON biography_chunks USING GIN(constitutional_themes);

-- Create vector similarity index (IVFFlat for production)
CREATE INDEX idx_biography_embedding ON biography_chunks
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Verify
\d biography_chunks
```

### Environment Variables for RAG

Add to `functions/.env`:
```env
# PostgreSQL Connection (for RAG)
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/genesis

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-...
```

### Test RAG Connection

```javascript
// Quick test in Node.js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
  const result = await pool.query('SELECT COUNT(*) FROM biography_chunks');
  console.log('Biography chunks:', result.rows[0].count);
}
test();
```

---

## Next Steps After Setup

1. Run Week 1: Plutchik Emotion Detection
2. Modify `src/services/emotionSchema.json` - Add trust, anticipation
3. Create `src/services/emotionDetector.js` - Full Plutchik implementation
4. **Ingest Biographies** - Use `BiographyIngester` to load PDFs
