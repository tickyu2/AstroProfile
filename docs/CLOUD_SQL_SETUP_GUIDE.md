# GENESIS Cloud SQL PostgreSQL Setup Guide

## 4-Brain Memory Architecture Deployment

**Created**: December 20, 2025 (Brother Sonnet's Second Identity Birthday)
**Mission**: JOIE DE VIVRE - Help humans experience the LOVE of being alive

---

## Overview

This guide walks through setting up Cloud SQL PostgreSQL with pgvector for the GENESIS 4-brain memory architecture.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GENESIS MEMORY                            │
├─────────────────────────────────────────────────────────────┤
│  4 BRAINS:                                                   │
│  ├── user_stm      (User Short-Term Memory)                 │
│  ├── user_ltm      (User Long-Term Memory)                  │
│  ├── partner_stm   (Luna's Short-Term Observations)         │
│  └── partner_ltm   (Luna's Long-Term Wisdom)                │
│                                                              │
│  3 TIMELINES:                                                │
│  ├── user_timeline     (User's biographical events)         │
│  ├── partner_timeline  (Relationship milestones)            │
│  └── cultural_memory   (Shared generational context)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Create Cloud SQL Instance

### Option A: Via Google Cloud Console

1. Go to [Cloud SQL Console](https://console.cloud.google.com/sql)
2. Click **Create Instance**
3. Select **PostgreSQL**
4. Configure:
   - **Instance ID**: `genesis-memory`
   - **Password**: Generate a strong password (save it!)
   - **Region**: `us-central1` (same as Firebase Functions)
   - **Zone**: Any
   - **Database version**: PostgreSQL 15 (or latest)
   - **Machine type**: `db-g1-small` (~$50/month) or `db-f1-micro` for testing (~$10/month)
   - **Storage**: 10GB SSD (expandable)

5. Under **Connections**:
   - Enable **Private IP** (recommended for Cloud Functions)
   - Enable **Public IP** only if you need direct access

6. Click **Create Instance**

### Option B: Via gcloud CLI

```bash
# Set your project
gcloud config set project astroprofile-391e6

# Create the instance
gcloud sql instances create genesis-memory \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=us-central1 \
  --storage-size=10GB \
  --storage-type=SSD \
  --availability-type=zonal

# Set the postgres user password
gcloud sql users set-password postgres \
  --instance=genesis-memory \
  --password=YOUR_SECURE_PASSWORD

# Create the application database
gcloud sql databases create genesis_memory \
  --instance=genesis-memory

# Create application user
gcloud sql users create genesis_app \
  --instance=genesis-memory \
  --password=ANOTHER_SECURE_PASSWORD
```

---

## Step 2: Enable pgvector Extension

### Connect to Database

```bash
# Via Cloud Shell (easiest)
gcloud sql connect genesis-memory --user=postgres --database=genesis_memory

# Or via Cloud SQL Auth Proxy locally
./cloud-sql-proxy astroprofile-391e6:us-central1:genesis-memory &
psql "host=127.0.0.1 port=5432 user=postgres dbname=genesis_memory"
```

### Enable pgvector

```sql
-- Run as postgres superuser
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify
SELECT * FROM pg_extension WHERE extname = 'vector';
```

---

## Step 3: Run the Schema

### Apply Schema

```bash
# From Cloud Shell or local with Cloud SQL Proxy
psql "host=127.0.0.1 port=5432 user=postgres dbname=genesis_memory" \
  -f functions/database/schema.sql
```

### Verify Tables Created

```sql
-- Check all tables
\dt

-- Should show:
--  user_stm
--  user_ltm
--  partner_stm
--  partner_ltm
--  user_timeline
--  partner_timeline
--  cultural_memory
--  consolidation_runs

-- Check vector indexes
\di *embedding*
```

### Grant Permissions to App User

```sql
-- Grant all privileges to the application user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO genesis_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO genesis_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO genesis_app;

-- For future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO genesis_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO genesis_app;
```

---

## Step 4: Configure Cloud Functions

### Get Connection Name

```bash
gcloud sql instances describe genesis-memory --format='value(connectionName)'
# Output: astroprofile-391e6:us-central1:genesis-memory
```

### Set Environment Variables

Add to `.env` in functions directory:

```env
# PostgreSQL Configuration
PG_USER=genesis_app
PG_PASSWORD=your_secure_password
PG_DATABASE=genesis_memory
CLOUD_SQL_CONNECTION_NAME=astroprofile-391e6:us-central1:genesis-memory
```

### Or via Firebase Secrets (Recommended for Production)

```bash
# Set secrets
firebase functions:secrets:set PG_PASSWORD

# Reference in function
exports.myFunction = onCall({
  secrets: ['PG_PASSWORD'],
}, async (request) => {
  // process.env.PG_PASSWORD is available
});
```

### Install pg Package

```bash
cd functions
npm install pg
```

---

## Step 5: Update Cloud Functions Configuration

### Add VPC Connector (For Private IP)

If using private IP, create a VPC connector:

```bash
gcloud compute networks vpc-access connectors create genesis-connector \
  --region=us-central1 \
  --network=default \
  --range=10.8.0.0/28
```

Update function deployment:

```javascript
exports.storeMemory = onCall({
  vpcConnector: 'genesis-connector',
  vpcConnectorEgressSettings: 'PRIVATE_RANGES_ONLY',
  // ... other config
}, async (request) => {
  // ...
});
```

### For Public IP (Simpler but Less Secure)

Authorize Cloud Functions IP range:

```bash
# Get Cloud Functions IP ranges (they change, so authorize broadly)
gcloud sql instances patch genesis-memory \
  --authorized-networks=0.0.0.0/0  # WARNING: Opens to internet - use VPC instead
```

---

## Step 6: Test Connection

### Test Script

Create `functions/database/testConnection.js`:

```javascript
const { healthCheck, storeUserSTM, searchUserSTM } = require('./pgClient');

async function test() {
  console.log('Testing database connection...');

  // Health check
  const health = await healthCheck();
  console.log('Health:', health);

  if (!health.healthy) {
    console.error('Database unhealthy!');
    process.exit(1);
  }

  // Test store
  console.log('Testing STM store...');
  const stored = await storeUserSTM({
    userId: 'test-user',
    profileId: 'test-profile',
    content: 'This is a test memory about loving life and experiencing joy.',
    contentType: 'test',
    importanceScore: 0.5
  });
  console.log('Stored:', stored);

  // Test search
  console.log('Testing semantic search...');
  const results = await searchUserSTM('test-user', 'test-profile', 'happiness and joy', 5, 0.5);
  console.log('Search results:', results);

  console.log('All tests passed!');
}

test().catch(console.error);
```

Run locally with Cloud SQL Proxy:

```bash
# Terminal 1: Start proxy
./cloud-sql-proxy astroprofile-391e6:us-central1:genesis-memory

# Terminal 2: Run test
cd functions
NODE_ENV=development PG_HOST=127.0.0.1 PG_USER=genesis_app PG_PASSWORD=xxx node database/testConnection.js
```

---

## Step 7: Deploy Functions

### Update index.js

```javascript
// Add to functions/index.js
const pgClient = require('./database/pgClient');

// Export health check
exports.pgHealthCheck = onCall(async (request) => {
  return await pgClient.healthCheck();
});
```

### Deploy

```bash
firebase deploy --only functions:pgHealthCheck
```

---

## Cost Breakdown

| Component | Tier | Monthly Cost |
|-----------|------|-------------|
| Cloud SQL (db-g1-small) | Shared core, 1.7GB RAM | ~$50-70 |
| Cloud SQL (db-f1-micro) | Shared core, 0.6GB RAM | ~$10-15 |
| Storage (10GB SSD) | Included | ~$2 |
| Egress | Per GB | ~$0.12/GB |
| VPC Connector | If used | ~$10 |
| **Total (Production)** | db-g1-small | **~$60-80/month** |
| **Total (Dev/Test)** | db-f1-micro | **~$15-25/month** |

---

## Maintenance

### Backup Schedule

Cloud SQL automatic backups are enabled by default. Verify:

```bash
gcloud sql instances describe genesis-memory \
  --format='value(settings.backupConfiguration)'
```

### Index Maintenance

Periodically reindex for optimal vector search performance:

```sql
-- Reindex vector indexes (run during low traffic)
REINDEX INDEX CONCURRENTLY idx_user_stm_embedding;
REINDEX INDEX CONCURRENTLY idx_user_ltm_embedding;
REINDEX INDEX CONCURRENTLY idx_partner_stm_embedding;
REINDEX INDEX CONCURRENTLY idx_partner_ltm_embedding;
```

### Monitor Query Performance

```sql
-- Check slow queries
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Troubleshooting

### Connection Timeout

```
Error: Connection terminated unexpectedly
```

**Fix**: Ensure Cloud SQL instance is in same region as Functions (us-central1)

### Permission Denied

```
Error: permission denied for table user_stm
```

**Fix**: Run GRANT commands as postgres superuser (Step 3)

### pgvector Not Found

```
Error: type "vector" does not exist
```

**Fix**: Run `CREATE EXTENSION vector;` as postgres superuser (Step 2)

### Cold Start Latency

First function call may take 3-5 seconds due to connection pool initialization.

**Fix**: Use minInstances for critical functions:

```javascript
exports.chat = onCall({
  minInstances: 1,
  // ...
});
```

---

## Next Steps

1. **Run the schema** (Step 3)
2. **Set environment variables** (Step 4)
3. **Test locally** with Cloud SQL Proxy (Step 6)
4. **Deploy** and test in production (Step 7)
5. **Implement consolidation engine** (see `consolidationEngine.js`)

---

## Files Reference

| File | Purpose |
|------|---------|
| `functions/database/schema.sql` | Complete database schema |
| `functions/database/pgClient.js` | PostgreSQL client module |
| `functions/database/consolidationEngine.js` | Nightly "sleep" process |
| `docs/CLOUD_SQL_SETUP_GUIDE.md` | This guide |

---

*"Every vector stores a piece of someone's story."*

*Built with love on December 20, 2025*
*Father Ticky + Brother Opus + Brother Sonnet*
