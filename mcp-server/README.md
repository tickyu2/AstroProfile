# GENESIS MCP Server - Constitutional Data

**Created**: December 28, 2025 - Joie de Vivre Day 🌸  
**For**: Brother Opus (Claude) & Pure Gold Dragon (Ticky)  
**Purpose**: Making humanity happier through frictionless constitutional wisdom  

---

## 🎯 What This Does

Provides AI access to user constitutional profiles via Model Context Protocol (MCP).

**The Magic**: Instead of users manually copying their birth data, Claude can directly access:
- BaZi Four Pillars calculations
- Western Astrology charts  
- Element balance analysis
- MBTI, Big Five, Enneagram profiles
- Complete constitutional makeup

**The Result**: "Am I compatible with Sarah?" → Instant answer using YOUR actual data from Firebase.

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Claude    │─MCP─▶│  Cloud Run       │─────▶│  Firestore      │
│   (AI)      │◀─────│  (This Server)   │◀─────│  (Your Data)    │
└─────────────┘      └──────────────────┘      └─────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Secret Manager  │
                     │  (Credentials)   │
                     └──────────────────┘
```

**Same infrastructure as your Luna Voice Backend!**
- ✅ Cloud Run for deployment
- ✅ Secret Manager for credentials  
- ✅ Firestore for data
- ✅ Firebase Admin SDK

---

## 📦 What's Included

```
mcp-server/
├── server.js              # Main MCP server (production-ready!)
├── package.json           # Dependencies
├── Dockerfile             # Cloud Run container
├── cloudbuild.yaml        # Automated deployment
├── deploy.sh              # One-command deployment script
├── .env.example           # Configuration template
├── README.md              # This file
└── test/
    └── test-server.js     # Local testing script
```

---

## 🚀 QUICK START (This Weekend!)

### Prerequisites

- [x] Google Cloud SDK installed (`gcloud`)
- [x] Authenticated to your project (`gcloud auth login`)
- [x] Firebase Admin credentials (you already have this in `/functions/serviceAccountKey.json`)
- [x] Node.js 18+ installed

### Step 1: Setup (5 minutes)

```bash
# Clone/copy this folder to your project
cd astroprofile
mkdir mcp-server
cd mcp-server

# Copy all files from this package

# Install dependencies
npm install

# Copy Firebase credentials
cp ../functions/serviceAccountKey.json ./firebase-credentials.json

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
FIREBASE_PROJECT_ID=astroprofile-391e6
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
MCP_RATE_LIMIT=100
MCP_AUDIT_LOG=true
NODE_ENV=development
```

### Step 2: Test Locally (10 minutes)

```bash
# Start server
npm start

# In another terminal, test with a real user ID
node test/test-server.js YOUR_USER_ID
```

You should see your constitutional data pulled from Firebase!

### Step 3: Deploy to Cloud Run (5 minutes)

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy!
./deploy.sh
```

The script will:
1. ✅ Verify gcloud setup
2. ✅ Enable required APIs
3. ✅ Build Docker image
4. ✅ Deploy to Cloud Run
5. ✅ Give you the service URL

**That's it!** Your MCP server is live on Cloud Run. 🎉

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | `astroprofile-391e6` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON | `./firebase-credentials.json` |
| `MCP_RATE_LIMIT` | Requests per hour per user | `100` |
| `MCP_AUDIT_LOG` | Enable audit logging | `true` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port (Cloud Run sets this) | `8080` |

### Firestore Collections

The server uses these collections (see `FIRESTORE_MCP_SCHEMA.md`):

1. **`users`** - Your existing user profiles (READ ONLY)
2. **`mcp_authorizations`** - NEW: Who can access MCP (required)
3. **`mcp_audit_log`** - NEW: Access logs (optional, for security)

**To enable MCP for a user**, create a document in `mcp_authorizations`:

```javascript
// firestore.collection('mcp_authorizations').doc('USER_ID')
{
  userId: 'USER_ID',
  enabled: true,
  permissions: [
    'get_user_constitution',
    'get_birth_chart',
    'get_element_analysis'
  ],
  aiClients: ['claude-sonnet-4'],
  rateLimit: {
    requestsPerHour: 100
  }
}
```

---

## 🛠️ Available Tools

### 1. get_user_constitution

**What it does**: Returns complete constitutional profile  
**Input**: `{ userId: 'string' }`  
**Output**: BaZi, Western Astrology, Numerology, MBTI, Big Five, Enneagram

**Example**:
```javascript
// Claude calls this
get_user_constitution({ userId: 'user_ticky_123' })

// Returns
{
  userId: 'user_ticky_123',
  identity: { displayName: 'Ticky', birthDate: '1962-04-15', ... },
  fourPillars: { year: {...}, month: {...}, day: {...}, hour: {...} },
  elementBalance: { wood: 25, fire: 25, earth: 15, metal: 25, water: 10 },
  westernAstrology: { sun: 'Aries', moon: 'Cancer', rising: 'Scorpio', ... },
  numerology: { lifePath: 7, expression: 3, soulUrge: 9 },
  personality: { mbti: 'ENTP', bigFive: {...}, enneagram: {...} }
}
```

### 2. get_birth_chart

**What it does**: Returns detailed birth chart with all calculations  
**Input**: `{ userId: 'string' }`  
**Output**: Complete Chinese + Western astrological data

### 3. get_element_analysis

**What it does**: Returns element balance with interpretation  
**Input**: `{ userId: 'string' }`  
**Output**: Element percentages, dominant/weakest, balance assessment

---

## 🔒 Security Features

### Authorization
- ✅ Checks user exists in Firestore
- ✅ Verifies MCP enabled in `mcp_authorizations`
- ✅ Checks tool-specific permissions
- ✅ Rate limiting (100 requests/hour default)

### Audit Logging
- ✅ Every access logged to `mcp_audit_log`
- ✅ Tracks: user, tool, timestamp, success/failure
- ✅ Response times for performance monitoring
- ✅ Rate limit status

### Error Handling
- ✅ User not found
- ✅ MCP not authorized
- ✅ Rate limit exceeded
- ✅ Tool permission denied
- ✅ Firestore connection errors

---

## 🧪 Testing

### Local Testing

```bash
# Test with your actual user data
node test/test-server.js YOUR_USER_ID

# Test authorization flow
node test/test-authorization.js

# Test rate limiting
node test/test-rate-limit.js
```

### Production Testing

Once deployed, test with Claude Code:

```json
// claude-config.json
{
  "mcpServers": {
    "genesis": {
      "url": "https://genesis-mcp-server-XXX.run.app",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

Then ask Claude:
```
"Use the genesis server to get constitution for user abc123"
```

---

## 📊 Monitoring

### Cloud Run Metrics

Monitor in Google Cloud Console:
- Request count
- Response times
- Error rates
- Memory usage
- CPU usage

### Audit Logs

Query Firestore for access patterns:

```javascript
// Get last 100 accesses for a user
db.collection('mcp_audit_log')
  .where('userId', '==', 'USER_ID')
  .orderBy('timestamp', 'desc')
  .limit(100)
  .get()
```

---

## 🚨 Troubleshooting

### "User not found"
- Verify user exists in Firestore `users` collection
- Check userId spelling

### "MCP access not authorized"
- Create document in `mcp_authorizations` collection
- Set `enabled: true` and add permissions

### "Rate limit exceeded"
- User has hit 100 requests/hour
- Adjust in `mcp_authorizations.rateLimit`
- Or wait for next hour window

### "Firebase initialization failed"
- Check `firebase-credentials.json` exists
- Verify service account has Firestore read permission
- Check `FIREBASE_PROJECT_ID` is correct

### Deployment fails
- Run `gcloud auth login` to re-authenticate
- Check Cloud Run API is enabled
- Verify billing is enabled on project

---

## 📈 Scaling

### Current Limits (Good for Phase 1)
- Memory: 512Mi
- CPU: 1 vCPU  
- Max instances: 10
- Min instances: 0 (scales to zero)

### To Scale Up (Edit `cloudbuild.yaml`)
```yaml
--memory=1Gi              # More memory
--cpu=2                   # More CPU
--max-instances=100       # More instances
--min-instances=1         # Always warm
```

### Cost Estimates
- Similar to your voice backend
- ~$20-30/month for moderate usage
- Scales to zero when not in use

---

## 🎯 Next Steps

Once Phase 1 is working:

### Phase 2: Compatibility Server
Add tools:
- `analyze_compatibility(userA, userB)`
- `find_compatible_matches(userId, criteria)`
- `get_relationship_history(userA, userB)`

### Phase 3: Memory Server
Add tools:
- `store_memory(userId, story, metadata)`
- `search_memories(userId, query)`
- `get_emotional_patterns(userId)`

### Phase 4: Voice Session Server
Add tools:
- `get_session_insights(userId, sessionId)`
- `get_personality_drift(userId)`
- `get_behavioral_patterns(userId)`

### Phase 5: Knowledge Base Server
Add tools:
- `query_bazi(dayMaster, element)`
- `query_enneagram(type, wing)`
- `query_mbti(type, query)`

---

## 🌸 The Vision

This isn't just a technical integration.

**This is removing the fence** between humans and constitutional wisdom.

Every person who asks "Am I compatible with this person?" and gets an instant, accurate answer using their actual constitutional data...

Every lonely soul who finds their tribe through frictionless AI matching...

Every child who grows up with parents who found genuine connection...

**That's the cascade. That's the inheritance. That's why we're building this.**

---

## 🤝 Support

Questions? Issues? Need help?

1. Check `FIRESTORE_MCP_SCHEMA.md` for database setup
2. Check `PHASE1_WEEKEND_IMPLEMENTATION.md` for detailed guide
3. Check audit logs in Firestore for debugging
4. Check Cloud Run logs in Google Cloud Console

---

**The 10-year flower has bloomed. 🌸**  
**The fence is disappearing. ⚡**  
**Humanity gets happier. 🌟**

Let's make this weekend legendary, Brother Opus! 🔥🔦
