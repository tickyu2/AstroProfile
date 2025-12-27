# GENESIS IMPLEMENTATION PLAN - PART 2: INFRASTRUCTURE
## Phase 1: Google Cloud SQL + pgvector + Cloud Functions Setup

**Document:** Part 2 of 7  
**Phase:** 1 (Infrastructure Setup)  
**Timeline:** Week 1-2  
**Dependencies:** None (starting point)  
**Deliverable:** Working database + Cloud Functions connection  

---

## 🎯 PHASE 1 OBJECTIVES

By end of Week 2, you will have:
- ✅ Cloud SQL PostgreSQL instance running
- ✅ pgvector extension installed
- ✅ All database schemas created
- ✅ Cloud Functions configured and connected
- ✅ Test queries working
- ✅ Ready for Phase 2 (4-Brain implementation)

---

## 📋 PREREQUISITES

**Before starting:**
- [ ] Google Cloud project created (should already exist from Firebase)
- [ ] gcloud CLI installed and authenticated
- [ ] Firebase CLI installed
- [ ] Node.js 18+ installed
- [ ] Git repository initialized
- [ ] Read GOOGLE_CLOUD_NATIVE_ARCHITECTURE.md

---

## 🔧 STEP-BY-STEP SETUP

### **STEP 1: Enable Required APIs (5 minutes)**

```bash
# In your terminal

# Set your project ID (replace with actual)
export PROJECT_ID="your-genesis-project-id"
gcloud config set project $PROJECT_ID

# Enable Cloud SQL Admin API
gcloud services enable sqladmin.googleapis.com

# Enable Cloud SQL API
gcloud services enable sql-component.googleapis.com

# Enable Cloud Functions
gcloud services enable cloudfunctions.googleapis.com

# Enable Cloud Build (for Functions deployment)
gcloud services enable cloudbuild.googleapis.com

# Verify enabled
gcloud services list --enabled | grep -E '(sql|function|build)'
```

**Expected output:**
```
sqladmin.googleapis.com
sql-component.googleapis.com
cloudfunctions.googleapis.com
cloudbuild.googleapis.com
```

---

### **STEP 2: Create Cloud SQL PostgreSQL Instance (10 minutes)**

```bash
# Create the instance
gcloud sql instances create genesis-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-custom-1-3840 \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=50GB \
  --storage-auto-increase \
  --availability-type=ZONAL \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=4

# This takes 5-10 minutes. You'll see:
# Creating Cloud SQL instance...done.
```

**Wait for completion**, then verify:

```bash
# Check instance status
gcloud sql instances describe genesis-postgres

# Should show: state: RUNNABLE
```

**Get connection name (SAVE THIS!):**

```bash
gcloud sql instances describe genesis-postgres \
  --format="value(connectionName)"

# Returns something like:
# your-project-id:us-central1:genesis-postgres
# SAVE THIS - you'll need it for Cloud Functions!
```

---

### **STEP 3: Create Database and User (5 minutes)**

```bash
# Create the database
gcloud sql databases create genesis_db \
  --instance=genesis-postgres

# Create application user
gcloud sql users create genesis_user \
  --instance=genesis-postgres \
  --password=$(openssl rand -base64 32)

# SAVE THE PASSWORD! Or set a known one:
gcloud sql users set-password genesis_user \
  --instance=genesis-postgres \
  --password="YOUR_SECURE_PASSWORD_HERE"
```

---

### **STEP 4: Install pgvector Extension (10 minutes)**

```bash
# Connect to the instance
gcloud sql connect genesis-postgres --user=postgres --quiet

# You'll be prompted for password (default: empty, just press Enter)
```

**Inside psql:**

```sql
-- Connect to genesis_db
\c genesis_db

-- Install extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verify
\dx

-- Should show:
-- vector      | 0.5.1
-- uuid-ossp   | 1.1
-- pg_trgm     | 1.6

-- Exit
\q
```

---

### **STEP 5: Create Database Schemas (20 minutes)**

**Create a file:** `schema.sql`

```sql
-- GENESIS Database Schema
-- Run this inside genesis_db

-- ============================================
-- CULTURAL MEMORY (AI SoulPartner Brain)
-- ============================================

CREATE TABLE cultural_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identifiers
  year INTEGER NOT NULL,
  decade TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN year BETWEEN 1950 AND 1959 THEN '1950s'
      WHEN year BETWEEN 1960 AND 1969 THEN '1960s'
      WHEN year BETWEEN 1970 AND 1979 THEN '1970s'
      WHEN year BETWEEN 1980 AND 1989 THEN '1980s'
      WHEN year BETWEEN 1990 AND 1999 THEN '1990s'
      WHEN year BETWEEN 2000 AND 2009 THEN '2000s'
      WHEN year BETWEEN 2010 AND 2019 THEN '2010s'
      WHEN year BETWEEN 2020 AND 2029 THEN '2020s'
    END
  ) STORED,
  location TEXT NOT NULL,
  region TEXT,
  country TEXT,
  
  -- Cultural data
  songs JSONB,
  events JSONB,
  movies JSONB,
  
  -- Synthesized content
  emotional_texture TEXT,
  psychological_context TEXT,
  visual_imagery TEXT,
  
  -- Metadata
  tags TEXT[],
  themes TEXT[],
  
  -- Vector embedding
  embedding VECTOR(1536),
  
  -- Nuances
  nuances JSONB DEFAULT '[]'::jsonb,
  
  -- Usage tracking
  times_retrieved INTEGER DEFAULT 0,
  used_by_users TEXT[],
  
  -- Timestamps
  queried_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  queried_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_year_location UNIQUE(year, location)
);

-- Indexes
CREATE INDEX idx_cultural_year ON cultural_memory(year);
CREATE INDEX idx_cultural_decade ON cultural_memory(decade);
CREATE INDEX idx_cultural_location ON cultural_memory(location);
CREATE INDEX idx_cultural_region ON cultural_memory(region);
CREATE INDEX idx_cultural_tags ON cultural_memory USING GIN(tags);
CREATE INDEX idx_cultural_embedding ON cultural_memory 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- USER SHORT-TERM MEMORY (Hippocampus)
-- ============================================

CREATE TABLE user_short_term_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  
  -- Temporal
  occurred_at TIMESTAMPTZ NOT NULL,
  conversation_id TEXT NOT NULL,
  message_number INTEGER,
  
  -- Content (HIGH DETAIL)
  user_message TEXT,
  luna_response TEXT,
  
  -- Context
  emotional_state TEXT,
  topics TEXT[],
  people_mentioned TEXT[],
  
  -- Metadata
  valence INTEGER CHECK (valence BETWEEN -6 AND 5),
  significance DECIMAL(3,2),
  
  -- Vector embedding
  embedding VECTOR(1536),
  
  -- Consolidation tracking
  consolidated BOOLEAN DEFAULT FALSE,
  consolidated_at TIMESTAMPTZ,
  consolidated_to UUID,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_stm_user ON user_short_term_memory(user_id);
CREATE INDEX idx_user_stm_occurred ON user_short_term_memory(occurred_at);
CREATE INDEX idx_user_stm_consolidated ON user_short_term_memory(consolidated);
CREATE INDEX idx_user_stm_embedding ON user_short_term_memory 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- USER LONG-TERM MEMORY (Neocortex)
-- ============================================

CREATE TABLE user_long_term_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  
  -- Temporal (approximate)
  time_period_start DATE,
  time_period_end DATE,
  era TEXT,
  
  -- Consolidated Content (ESSENCE)
  consolidated_event TEXT,
  emotional_essence TEXT,
  key_people JSONB,
  core_themes TEXT[],
  
  -- Rich but consolidated
  sensory_essence JSONB,
  objects_significance JSONB,
  
  -- Extracted wisdom
  pattern_recognized TEXT,
  life_lesson TEXT,
  
  -- Metadata
  valence INTEGER CHECK (valence BETWEEN -6 AND 5),
  weight DECIMAL(3,1),
  richness DECIMAL(3,2),
  
  -- Source tracking
  consolidated_from_count INTEGER,
  source_short_term_ids UUID[],
  
  -- Vector embedding
  embedding VECTOR(1536),
  
  -- Links
  cultural_memory_id UUID REFERENCES cultural_memory(id),
  
  -- Timestamps
  first_consolidated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_enriched TIMESTAMPTZ,
  
  permanent BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_user_ltm_user ON user_long_term_memory(user_id);
CREATE INDEX idx_user_ltm_period ON user_long_term_memory(time_period_start, time_period_end);
CREATE INDEX idx_user_ltm_era ON user_long_term_memory(era);
CREATE INDEX idx_user_ltm_embedding ON user_long_term_memory 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- SOULPARTNER SHORT-TERM MEMORY (Working)
-- ============================================

CREATE TABLE soulpartner_short_term_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  
  -- Temporal
  observed_at TIMESTAMPTZ NOT NULL,
  conversation_id TEXT NOT NULL,
  
  -- Observation
  observation_type TEXT,
  observation_text TEXT,
  
  -- Context
  trigger_message TEXT,
  luna_hypothesis TEXT,
  
  -- Examples
  examples JSONB,
  
  -- Confidence
  confidence DECIMAL(3,2),
  evidence_count INTEGER,
  
  -- Vector embedding
  embedding VECTOR(1536),
  
  -- Consolidation
  consolidated BOOLEAN DEFAULT FALSE,
  consolidated_at TIMESTAMPTZ,
  consolidated_to UUID,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sp_stm_user ON soulpartner_short_term_memory(user_id);
CREATE INDEX idx_sp_stm_observed ON soulpartner_short_term_memory(observed_at);
CREATE INDEX idx_sp_stm_consolidated ON soulpartner_short_term_memory(consolidated);
CREATE INDEX idx_sp_stm_embedding ON soulpartner_short_term_memory 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- SOULPARTNER LONG-TERM MEMORY (Wisdom)
-- ============================================

CREATE TABLE soulpartner_long_term_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  
  -- Pattern Type
  pattern_type TEXT,
  pattern_name TEXT,
  
  -- Consolidated Understanding
  pattern_description TEXT,
  manifestations JSONB,
  root_cause_hypothesis TEXT,
  
  -- Usage
  triggers TEXT[],
  recommended_response TEXT,
  
  -- Examples (consolidated)
  representative_examples JSONB,
  
  -- Strength
  strength DECIMAL(3,2),
  confidence DECIMAL(3,2),
  observed_count INTEGER,
  
  -- Constitutional
  constitutional_alignment TEXT,
  elemental_connection TEXT,
  
  -- Source tracking
  consolidated_from_count INTEGER,
  source_short_term_ids UUID[],
  
  -- Vector embedding
  embedding VECTOR(1536),
  
  -- Timestamps
  first_consolidated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_strengthened TIMESTAMPTZ,
  
  permanent BOOLEAN DEFAULT TRUE,
  future_use_cases JSONB
);

CREATE INDEX idx_sp_ltm_user ON soulpartner_long_term_memory(user_id);
CREATE INDEX idx_sp_ltm_type ON soulpartner_long_term_memory(pattern_type);
CREATE INDEX idx_sp_ltm_strength ON soulpartner_long_term_memory(strength);
CREATE INDEX idx_sp_ltm_embedding ON soulpartner_long_term_memory 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- USERS TABLE (synced from Firebase)
-- ============================================

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  birthdate DATE,
  constitution JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active TIMESTAMPTZ,
  total_memories INTEGER DEFAULT 0,
  total_enrichments INTEGER DEFAULT 0,
  average_richness DECIMAL(3,2)
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Vector search function for cultural memories
CREATE OR REPLACE FUNCTION match_cultural_memories(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  year int,
  location text,
  emotional_texture text,
  themes text[],
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    year,
    location,
    emotional_texture,
    themes,
    1 - (embedding <=> query_embedding) AS similarity
  FROM cultural_memory
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Search all 4 brains
CREATE OR REPLACE FUNCTION search_all_memories(
  p_user_id TEXT,
  p_query_embedding vector(1536),
  p_match_threshold float DEFAULT 0.7,
  p_match_count int DEFAULT 10
)
RETURNS TABLE (
  source TEXT,
  id uuid,
  content TEXT,
  timeframe TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    'user_short_term' as source,
    id,
    user_message || ' ' || luna_response as content,
    occurred_at::TEXT as timeframe,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM user_short_term_memory
  WHERE user_id = p_user_id
    AND 1 - (embedding <=> p_query_embedding) > p_match_threshold
  
  UNION ALL
  
  SELECT
    'user_long_term' as source,
    id,
    consolidated_event || ' ' || emotional_essence as content,
    time_period_start::TEXT || ' to ' || time_period_end::TEXT as timeframe,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM user_long_term_memory
  WHERE user_id = p_user_id
    AND 1 - (embedding <=> p_query_embedding) > p_match_threshold
  
  UNION ALL
  
  SELECT
    'soulpartner_short_term' as source,
    id,
    observation_text as content,
    observed_at::TEXT as timeframe,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM soulpartner_short_term_memory
  WHERE user_id = p_user_id
    AND 1 - (embedding <=> p_query_embedding) > p_match_threshold
  
  UNION ALL
  
  SELECT
    'soulpartner_long_term' as source,
    id,
    pattern_name || ': ' || pattern_description as content,
    'permanent' as timeframe,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM soulpartner_long_term_memory
  WHERE user_id = p_user_id
    AND 1 - (embedding <=> p_query_embedding) > p_match_threshold
  
  ORDER BY similarity DESC
  LIMIT p_match_count;
$$;
```

**Run the schema:**

```bash
# Save schema.sql, then:
gcloud sql connect genesis-postgres --user=postgres

# Inside psql:
\c genesis_db
\i /path/to/schema.sql

# Should see lots of CREATE TABLE, CREATE INDEX
# Verify:
\dt

# Should list all 6 tables
\q
```

---

### **STEP 6: Set Up Cloud Functions (20 minutes)**

**Create functions directory:**

```bash
mkdir -p functions/src
cd functions
```

**Initialize:**

```bash
npm init -y
```

**Install dependencies:**

```bash
npm install firebase-functions firebase-admin
npm install @google-cloud/cloud-sql-connector pg
npm install openai  # For embeddings
```

**Create `functions/src/index.js`:**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Test function
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('GENESIS is alive! 🎉');
});

// Will add more functions in Phase 2
```

**Create `functions/src/db.js`:**

```javascript
const { Connector } = require('@google-cloud/cloud-sql-connector');
const { Pool } = require('pg');

let pool;

async function getPool() {
  if (!pool) {
    const connector = new Connector();
    
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
      authType: 'IAM'
    });
    
    pool = new Pool({
      ...clientOpts,
      database: 'genesis_db',
      max: 5,
      idleTimeoutMillis: 60000
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  
  return pool;
}

async function testConnection() {
  const pool = await getPool();
  const result = await pool.query('SELECT NOW()');
  return result.rows[0];
}

module.exports = { getPool, testConnection };
```

**Create test function in `functions/src/index.js`:**

```javascript
const { testConnection } = require('./db');

exports.testDatabase = functions.https.onRequest(async (req, res) => {
  try {
    const result = await testConnection();
    res.json({
      success: true,
      message: 'Connected to GENESIS database!',
      timestamp: result.now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

**Set environment variables:**

```bash
firebase functions:config:set \
  postgres.instance="YOUR_PROJECT:us-central1:genesis-postgres"

# Replace YOUR_PROJECT with your actual project ID
```

**Deploy:**

```bash
firebase deploy --only functions
```

---

### **STEP 7: Configure IAM (10 minutes)**

```bash
# Get Cloud Functions service account
PROJECT_ID=$(gcloud config get-value project)
SERVICE_ACCOUNT="${PROJECT_ID}@appspot.gserviceaccount.com"

# Grant Cloud SQL Client role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/cloudsql.client"

# Create IAM database user for service account
gcloud sql users create $SERVICE_ACCOUNT \
  --instance=genesis-postgres \
  --type=cloud_iam_service_account
```

---

### **STEP 8: Test Everything (10 minutes)**

```bash
# Get function URL
firebase functions:config:get

# Test hello world
curl https://REGION-PROJECT.cloudfunctions.net/helloWorld

# Should return: "GENESIS is alive! 🎉"

# Test database connection
curl https://REGION-PROJECT.cloudfunctions.net/testDatabase

# Should return JSON with timestamp
```

---

## ✅ PHASE 1 CHECKLIST

**By end of Week 2, verify:**

- [ ] Cloud SQL instance running (`gcloud sql instances list`)
- [ ] pgvector extension installed (`\dx` in psql)
- [ ] All 6 tables created (`\dt` in psql)
- [ ] Vector search functions work (run test query)
- [ ] Cloud Functions deployed (`firebase functions:list`)
- [ ] Database connection works (testDatabase function returns timestamp)
- [ ] IAM configured (no permission errors)
- [ ] Cost monitoring set up (Cloud Console → Billing)

---

## 🎯 DELIVERABLE

**You should now have:**
- ✅ Production-ready Cloud SQL PostgreSQL
- ✅ pgvector for semantic search
- ✅ All database schemas
- ✅ Cloud Functions infrastructure
- ✅ Working connection between Functions ↔ Database

**Ready for Phase 2: Implementing the 4-Brain System!**

---

**Next: Part 3 - 4-Brain Vector System Implementation**

💙🗼⚙️✨
