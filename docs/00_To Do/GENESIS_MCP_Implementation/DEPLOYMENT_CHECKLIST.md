# 🚀 DEPLOYMENT CHECKLIST FOR BROTHER OPUS

**Mission**: Deploy GENESIS MCP Server to Google Cloud Run  
**Timeline**: This Weekend (6-8 hours)  
**Status**: Ready for deployment 🌸

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Prerequisites Verification

- [ ] Google Cloud SDK installed (`gcloud --version`)
- [ ] Authenticated to project (`gcloud auth list`)
- [ ] Project set (`gcloud config get-value project`)
- [ ] Billing enabled on project
- [ ] Firebase project exists (`astroprofile-391e6`)
- [ ] Service account credentials available

### Required APIs (Will be enabled by deploy script)

- [ ] Cloud Run API
- [ ] Cloud Build API
- [ ] Secret Manager API
- [ ] Container Registry API
- [ ] Firestore API (already enabled)

---

## 🔧 SETUP PHASE (30 minutes)

### Step 1: Project Structure

```bash
cd astroprofile
mkdir mcp-server
cd mcp-server

# Copy all files from the package:
# - server.js
# - package.json
# - Dockerfile
# - cloudbuild.yaml
# - deploy.sh
# - .env.example
# - README.md
# - test/test-server.js
# - scripts/init-firestore.js
# - sql/postgresql-schema.sql (optional)
```

### Step 2: Install Dependencies

```bash
npm install
```

Expected packages:
- `@modelcontextprotocol/sdk`
- `@google-cloud/secret-manager`
- `firebase-admin`
- `dotenv`

### Step 3: Configure Environment

```bash
# Copy template
cp .env.example .env

# Copy Firebase credentials
cp ../functions/serviceAccountKey.json ./firebase-credentials.json

# Verify .gitignore includes:
# - .env
# - firebase-credentials.json
# - node_modules/
```

Edit `.env`:
```env
FIREBASE_PROJECT_ID=astroprofile-391e6
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
MCP_RATE_LIMIT=100
MCP_AUDIT_LOG=true
NODE_ENV=development
```

---

## 🧪 LOCAL TESTING PHASE (30 minutes)

### Step 4: Test Server Locally

```bash
# Start server (in one terminal)
npm start
```

You should see:
```
═══════════════════════════════════════════════════════════════
🌟 GENESIS Constitutional Data MCP Server
═══════════════════════════════════════════════════════════════
📡 Server: genesis-constitutional-data v1.0.0
🔥 Environment: development
🔒 Rate Limit: 100 requests/hour
📝 Audit Log: Enabled
═══════════════════════════════════════════════════════════════
✅ Ready to serve constitutional wisdom!
═══════════════════════════════════════════════════════════════
```

### Step 5: Test with Real User Data

```bash
# In another terminal, test with YOUR user ID
node test/test-server.js USER_ID

# Example:
# node test/test-server.js user_ticky_123
```

Expected output:
```
═══════════════════════════════════════════════════════════════
🧪 GENESIS MCP Server - Local Test
═══════════════════════════════════════════════════════════════
Testing with userId: user_ticky_123
═══════════════════════════════════════════════════════════════

📊 Testing: get_user_constitution
─────────────────────────────────────────────────────────────

✅ SUCCESS!
{
  "userId": "user_ticky_123",
  "identity": {
    "displayName": "Ticky",
    "birthDate": "1962-04-15",
    ...
  },
  ...
}

📅 Testing: get_birth_chart
...

🔥 Testing: get_element_analysis
...

═══════════════════════════════════════════════════════════════
📊 TEST RESULTS
═══════════════════════════════════════════════════════════════
Constitution:      ✅ PASS
Birth Chart:       ✅ PASS
Element Analysis:  ✅ PASS
═══════════════════════════════════════════════════════════════

🎉 ALL TESTS PASSED! Ready for deployment.
```

**If tests fail**: Check error messages and verify:
- Firebase credentials are correct
- User ID exists in Firestore
- User has calculated data in their profile

---

## 🔐 FIRESTORE SETUP PHASE (15 minutes)

### Step 6: Initialize MCP Collections

**IMPORTANT**: This creates the required `mcp_authorizations` collection.

```bash
# Create authorizations for all users (disabled by default)
node scripts/init-firestore.js
```

Expected output:
```
═══════════════════════════════════════════════════════════════
🔧 GENESIS MCP - Firestore Initialization
═══════════════════════════════════════════════════════════════
Mode: Disable All (Safe Mode)
═══════════════════════════════════════════════════════════════

📊 Fetching all users from Firestore...
Found 42 users

✅ Initialized 42 users...

═══════════════════════════════════════════════════════════════
✅ Initialization Complete!
═══════════════════════════════════════════════════════════════
Total users:       42
MCP enabled:       0
MCP disabled:      42
═══════════════════════════════════════════════════════════════
```

### Step 7: Enable MCP for Test User

```bash
# Enable for specific user (yourself)
node scripts/init-firestore.js --user=YOUR_USER_ID
```

Or manually in Firestore console:
1. Go to Firestore console
2. Find `mcp_authorizations` collection
3. Find your user document
4. Update:
   - `enabled: true`
   - `permissions: ["get_user_constitution", "get_birth_chart", "get_element_analysis"]`

### Step 8: Update Firestore Rules

Edit `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... your existing rules ...
    
    // MCP Authorization - users can only read/write their own
    match /mcp_authorizations/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // MCP Audit Log - users can only read their own logs
    match /mcp_audit_log/{logId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write logs
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

---

## ☁️ CLOUD RUN DEPLOYMENT PHASE (30 minutes)

### Step 9: Verify gcloud Configuration

```bash
# Check current project
gcloud config get-value project

# Should show: astroprofile-391e6
# If not:
gcloud config set project astroprofile-391e6

# Verify authentication
gcloud auth list

# Should show your email with (active) marker
```

### Step 10: Deploy to Cloud Run

**Option A: Automated Script (Recommended)**

```bash
# Make script executable
chmod +x deploy.sh

# Deploy!
./deploy.sh
```

The script will:
1. ✅ Verify gcloud setup
2. ✅ Enable required APIs
3. ✅ Copy Firebase credentials
4. ✅ Build Docker image
5. ✅ Deploy to Cloud Run
6. ✅ Configure environment variables
7. ✅ Output service URL

**Option B: Manual Deployment**

```bash
# Build and deploy
gcloud run deploy genesis-mcp-server \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --timeout=60s \
  --max-instances=10 \
  --min-instances=0 \
  --set-env-vars="NODE_ENV=production,FIREBASE_PROJECT_ID=astroprofile-391e6,MCP_RATE_LIMIT=100,MCP_AUDIT_LOG=true"
```

### Step 11: Verify Deployment

```bash
# Get service URL
gcloud run services describe genesis-mcp-server \
  --region=us-central1 \
  --format='value(status.url)'

# Should output something like:
# https://genesis-mcp-server-xxxxx-uc.a.run.app
```

**Save this URL!** You'll need it for Claude configuration.

---

## 🧪 PRODUCTION TESTING PHASE (30 minutes)

### Step 12: Test Deployed Service

```bash
# Test health
curl https://YOUR-SERVICE-URL.run.app/health

# Expected: 200 OK or similar health check response
```

### Step 13: Configure Claude Code

Create `claude-mcp-config.json`:

```json
{
  "mcpServers": {
    "genesis-constitutional": {
      "url": "https://genesis-mcp-server-xxxxx-uc.a.run.app",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

### Step 14: Test with Claude

```bash
# Start Claude Code with MCP config
claude --mcp-config claude-mcp-config.json
```

Ask Claude:
```
"Use the genesis-constitutional server to get my constitution data for user ID: YOUR_USER_ID"
```

Expected: Claude should return your constitutional data from Firebase!

---

## 📊 MONITORING SETUP PHASE (15 minutes)

### Step 15: Enable Cloud Logging

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=genesis-mcp-server" \
  --limit=50 \
  --format=json
```

Or use Cloud Console:
1. Go to Cloud Run
2. Click on `genesis-mcp-server`
3. Click "Logs" tab

### Step 16: Set Up Alerts (Optional)

In Cloud Console:
1. Monitoring → Alerting
2. Create Policy → Metric Condition
3. Resource: Cloud Run Revision
4. Metric: Error rate
5. Threshold: > 5% for 5 minutes
6. Notification: Email

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Final Checklist

- [ ] Server deployed to Cloud Run
- [ ] Service URL accessible
- [ ] Firestore collections created
- [ ] At least one user authorized
- [ ] Local tests passing
- [ ] Production tests passing
- [ ] Logs showing in Cloud Console
- [ ] No errors in Cloud Run logs
- [ ] Audit log entries appearing in Firestore

### Success Metrics

```
✅ Response time: < 500ms for all tools
✅ Error rate: < 1%
✅ Availability: 99.9%
✅ Rate limiting: Working correctly
✅ Authorization: Enforced properly
✅ Audit logs: Capturing all access
```

---

## 🎉 DEPLOYMENT COMPLETE!

### What You've Achieved

1. ✅ MCP server running on Cloud Run
2. ✅ Connected to your existing Firebase
3. ✅ Using your existing Cloud infrastructure
4. ✅ Zero changes to existing code
5. ✅ Ready for Phase 2 expansion

### Service URLs to Save

```
Production MCP Server: https://genesis-mcp-server-xxxxx-uc.a.run.app
Voice Backend:         wss://luna-voice-backend-sjpjwnbsmq-uc.a.run.app
Firebase Console:      https://console.firebase.google.com
Cloud Run Console:     https://console.cloud.google.com/run
```

### Next Steps

**Immediate (Next Week)**:
- [ ] Enable MCP for beta testers (5-10 users)
- [ ] Monitor logs and performance
- [ ] Gather user feedback

**Phase 2 (Next Month)**:
- [ ] Add Compatibility Server (analyze_compatibility tool)
- [ ] Add Memory Server (search_memories tool)
- [ ] Add Voice Session Server (get_session_insights tool)

**Phase 3 (Following Month)**:
- [ ] Add Knowledge Base Server (query_bazi, query_enneagram)
- [ ] Integrate with PostgreSQL for advanced analytics
- [ ] Add Community Matching Server (find_compatible_pod)

---

## 🆘 TROUBLESHOOTING

### Common Issues

**"Permission denied" during deployment**
```bash
# Re-authenticate
gcloud auth login
gcloud config set project astroprofile-391e6
```

**"Service account not found"**
```bash
# Verify credentials exist
ls -la firebase-credentials.json
cat firebase-credentials.json | jq '.project_id'
```

**"User not found" in tests**
```bash
# Verify user exists in Firestore
# Check spelling of user ID
# Try listing users: node scripts/list-users.js
```

**"Rate limit exceeded" immediately**
```bash
# Check authorization document
# Verify rateLimit.requestsPerHour is set correctly
```

---

## 📞 Support

**Cloud Run Issues**:
- Check logs: `gcloud logging read ...`
- Check status: Cloud Run console
- Redeploy: `./deploy.sh`

**Firebase Issues**:
- Check Firestore console
- Verify rules deployed
- Check service account permissions

**MCP Issues**:
- Check server logs for errors
- Verify authorization documents
- Test locally first with `npm start`

---

## 🌸 THE MOMENT

When you see this in production logs:

```
✅ MCP tool called: get_user_constitution
✅ User: user_sarah_123
✅ Response time: 287ms
✅ Success: true
✅ Constitutional wisdom delivered
```

**That's the fence disappearing.**  
**That's Sarah finding her compatible soul.**  
**That's humanity getting happier.**  
**That's the 10-year flower blooming in production.** 🌸

---

**Deployment Status**: Ready for Brother Opus  
**Estimated Total Time**: 2.5 hours  
**Difficulty**: Medium (following checklist)  
**Reward**: INFINITE (making humanity happier) ✨

Let's make this weekend legendary! 🔥🔦
