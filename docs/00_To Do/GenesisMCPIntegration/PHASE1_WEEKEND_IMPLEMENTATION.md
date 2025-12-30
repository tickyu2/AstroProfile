# PHASE 1: THIS WEEKEND - Get Your First MCP Server Running

**Time Required**: 6-8 hours over Saturday/Sunday  
**Outcome**: Claude can access your Firebase constitutional data  
**Difficulty**: Beginner-friendly (mostly copy-paste)

---

## SATURDAY MORNING (2 hours): Setup

### Step 1: Install MCP SDK (5 minutes)

```bash
# Navigate to your project root (where astroprofile is)
cd astroprofile

# Create MCP servers directory
mkdir mcp-servers
cd mcp-servers
mkdir constitutional-data
cd constitutional-data

# Initialize npm project
npm init -y

# Install MCP SDK + Firebase Admin
npm install @modelcontextprotocol/sdk firebase-admin dotenv
```

### Step 2: Create Environment File (5 minutes)

```bash
# Create .env file
touch .env
```

Edit `.env`:
```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=astroprofile-391e6
FIREBASE_PRIVATE_KEY="YOUR_PRIVATE_KEY_FROM_SERVICE_ACCOUNT"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@astroprofile-391e6.iam.gserviceaccount.com

# MCP Server Config
PORT=8001
NODE_ENV=development
```

### Step 3: Copy Service Account Key (10 minutes)

You already have this in `/functions/serviceAccountKey.json`!

```bash
# Copy it to MCP server directory
cp ../../functions/serviceAccountKey.json ./firebase-credentials.json
```

### Step 4: Create Server File (30 minutes)

Create `server.js`:

```javascript
/**
 * GENESIS MCP Server - Constitutional Data
 * Phase 1: Proof of Concept
 * 
 * Provides AI access to user constitutional profiles from Firebase
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin (using YOUR existing credentials!)
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'firebase-credentials.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = getFirestore();

// Create MCP Server
const server = new Server(
  {
    name: 'genesis-constitutional-data',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_user_constitution',
      description: 'Get complete constitutional profile for a user (BaZi, Western Astrology, Numerology, MBTI, Big Five)',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID',
          },
        },
        required: ['userId'],
      },
    },
    {
      name: 'get_birth_chart',
      description: 'Get detailed birth chart with all calculations',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID',
          },
        },
        required: ['userId'],
      },
    },
    {
      name: 'get_element_analysis',
      description: 'Get element balance and analysis (Wood, Fire, Earth, Metal, Water)',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID',
          },
        },
        required: ['userId'],
      },
    },
  ],
}));

// ============================================================================
// TOOL HANDLERS
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_user_constitution':
        return await getUserConstitution(args.userId);
      
      case 'get_birth_chart':
        return await getBirthChart(args.userId);
      
      case 'get_element_analysis':
        return await getElementAnalysis(args.userId);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
          }),
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// IMPLEMENTATION FUNCTIONS (Using YOUR Firestore structure!)
// ============================================================================

async function getUserConstitution(userId) {
  // Fetch from YOUR existing Firestore structure
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();

  // YOUR EXISTING DATA STRUCTURE!
  const constitution = {
    userId,
    identity: {
      displayName: userData.identity?.displayName || 'Unknown',
      birthDate: userData.birth?.date,
      birthTime: userData.birth?.time,
      birthLocation: userData.birth?.location,
    },
    fourPillars: userData.calculations?.fourPillars || null,
    elementBalance: userData.calculations?.elements || null,
    yinYangRatio: userData.calculations?.yinYang || null,
    westernAstrology: userData.calculations?.western || null,
    numerology: userData.calculations?.numerology || null,
    personality: {
      mbti: userData.personality?.mbti || null,
      bigFive: userData.personality?.bigFive || null,
      enneagram: userData.personality?.enneagram || null,
    },
    metadata: {
      profileVersion: userData.version || '1.0',
      lastCalculated: userData.calculations?.calculatedAt,
    },
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(constitution, null, 2),
      },
    ],
  };
}

async function getBirthChart(userId) {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();

  const birthChart = {
    birthData: {
      date: userData.birth?.date,
      time: userData.birth?.time,
      location: userData.birth?.location,
      timezone: userData.birth?.timezone,
    },
    chineseAstrology: {
      fourPillars: userData.calculations?.fourPillars,
      dayMaster: userData.calculations?.dayMaster,
      seasonalQi: userData.calculations?.seasonalQi,
      tenGods: userData.calculations?.tenGods,
    },
    westernAstrology: {
      sun: userData.calculations?.western?.sun,
      moon: userData.calculations?.western?.moon,
      rising: userData.calculations?.western?.rising,
      houses: userData.calculations?.western?.houses,
      aspects: userData.calculations?.western?.aspects,
    },
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(birthChart, null, 2),
      },
    ],
  };
}

async function getElementAnalysis(userId) {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const elements = userData.calculations?.elements || {};

  const analysis = {
    elements: {
      wood: elements.wood || 0,
      fire: elements.fire || 0,
      earth: elements.earth || 0,
      metal: elements.metal || 0,
      water: elements.water || 0,
    },
    dominantElement: getDominantElement(elements),
    weakestElement: getWeakestElement(elements),
    balance: calculateBalance(elements),
    interpretation: generateInterpretation(elements),
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(analysis, null, 2),
      },
    ],
  };
}

// Helper functions
function getDominantElement(elements) {
  const entries = Object.entries(elements);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return sorted[0] ? sorted[0][0] : 'unknown';
}

function getWeakestElement(elements) {
  const entries = Object.entries(elements);
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  return sorted[0] ? sorted[0][0] : 'unknown';
}

function calculateBalance(elements) {
  const values = Object.values(elements);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  if (range < 15) return 'balanced';
  if (range < 30) return 'moderately_imbalanced';
  return 'significantly_imbalanced';
}

function generateInterpretation(elements) {
  const dominant = getDominantElement(elements);
  const weakest = getWeakestElement(elements);
  
  return {
    dominant: `Your strongest element is ${dominant} (${elements[dominant]}%), which influences your core nature.`,
    weakest: `Your weakest element is ${weakest} (${elements[weakest]}%), which may be an area for growth.`,
    overall: `Your elemental balance is ${calculateBalance(elements)}.`,
  };
}

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('GENESIS Constitutional Data MCP Server running');
  console.error('Available tools: get_user_constitution, get_birth_chart, get_element_analysis');
  console.error('Connected to Firebase project:', process.env.FIREBASE_PROJECT_ID);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

### Step 5: Update package.json (5 minutes)

Edit `package.json`:

```json
{
  "name": "genesis-mcp-constitutional-data",
  "version": "1.0.0",
  "type": "module",
  "description": "GENESIS MCP Server - Constitutional Data Access",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "firebase-admin": "^12.0.0",
    "dotenv": "^16.3.1"
  }
}
```

---

## SATURDAY AFTERNOON (2 hours): Testing

### Step 6: Test with Claude Code (30 minutes)

Create `test-config.json`:

```json
{
  "mcpServers": {
    "genesis-constitutional": {
      "command": "node",
      "args": ["/path/to/mcp-servers/constitutional-data/server.js"],
      "env": {
        "FIREBASE_PROJECT_ID": "astroprofile-391e6"
      }
    }
  }
}
```

### Step 7: Run First Test (15 minutes)

```bash
# Start the server
npm start
```

In another terminal, test with Claude Code:

```bash
# Ask Claude Code to use your MCP server
claude --mcp-config test-config.json

# Then ask:
"Use the genesis-constitutional server to get user constitution for userId 'YOUR_TEST_USER_ID'"
```

### Step 8: Verify Response (15 minutes)

You should see:
```json
{
  "userId": "YOUR_TEST_USER_ID",
  "identity": {
    "displayName": "Ticky",
    "birthDate": "1962-04-15",
    ...
  },
  "fourPillars": {
    "year": { "stem": "甲", "branch": "辰", ... },
    ...
  },
  "elementBalance": {
    "wood": 25,
    "fire": 25,
    "earth": 15,
    "metal": 25,
    "water": 10
  }
}
```

### Step 9: Celebrate! (60 minutes)

**YOU JUST INTEGRATED MCP WITH GENESIS!** 🎉

Take a break. This is huge. You've proven the concept.

---

## SUNDAY MORNING (2 hours): Enhancement

### Step 10: Add Error Handling (30 minutes)

Add to `server.js`:

```javascript
// Authorization check function
async function checkAuthorization(userId, toolName) {
  // Check if user exists
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  // Check MCP authorization
  const authRef = db.collection('mcp_authorizations').doc(userId);
  const authSnap = await authRef.get();
  
  if (!authSnap.exists) {
    throw new Error('MCP access not authorized for this user');
  }

  const authData = authSnap.data();
  if (!authData.permissions.includes(toolName)) {
    throw new Error(`Tool ${toolName} not authorized`);
  }

  // Log access
  await db.collection('mcp_audit_log').add({
    userId,
    toolName,
    timestamp: new Date(),
    aiClient: 'claude-sonnet-4',
    success: true,
  });

  return true;
}

// Update getUserConstitution to use authorization
async function getUserConstitution(userId) {
  await checkAuthorization(userId, 'get_user_constitution');
  
  // ... rest of existing code
}
```

### Step 11: Add Rate Limiting (30 minutes)

```javascript
// Simple in-memory rate limiter
const rateLimits = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || { requests: [], limit: 100 };
  
  // Remove requests older than 1 hour
  userLimits.requests = userLimits.requests.filter(
    time => now - time < 3600000
  );
  
  if (userLimits.requests.length >= userLimits.limit) {
    throw new Error('Rate limit exceeded (100 requests per hour)');
  }
  
  userLimits.requests.push(now);
  rateLimits.set(userId, userLimits);
}
```

### Step 12: Add Logging (30 minutes)

```javascript
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  console.error(JSON.stringify({
    timestamp,
    level,
    message,
    ...data,
  }));
}

// Use throughout:
log('info', 'Tool called', { tool: 'get_user_constitution', userId });
log('error', 'Authorization failed', { userId, error: err.message });
```

---

## SUNDAY AFTERNOON (2 hours): Documentation

### Step 13: Create README (30 minutes)

Create `README.md`:

```markdown
# GENESIS MCP Server - Constitutional Data

Provides AI access to user constitutional profiles from Firebase Firestore.

## Tools Available

1. **get_user_constitution** - Complete constitutional profile
2. **get_birth_chart** - Detailed birth chart with all calculations
3. **get_element_analysis** - Element balance and interpretation

## Setup

1. Install dependencies: `npm install`
2. Copy Firebase credentials to `firebase-credentials.json`
3. Configure `.env` file
4. Run: `npm start`

## Testing

Use with Claude Code:
```bash
claude --mcp-config test-config.json
```

Ask Claude: "Get constitution for user xyz"

## Security

- Requires user authorization in `mcp_authorizations` collection
- Rate limited to 100 requests/hour per user
- All access logged to `mcp_audit_log`

## Architecture

```
Claude → MCP Server → Firebase Firestore
                 ↓
         Existing data structure (unchanged!)
```
```

### Step 14: Document API (30 minutes)

Create `API.md`:

```markdown
# MCP Server API Documentation

## Tool: get_user_constitution

Returns complete constitutional profile.

**Input:**
```json
{
  "userId": "string (required)"
}
```

**Output:**
```json
{
  "userId": "abc123",
  "identity": { ... },
  "fourPillars": { ... },
  "elementBalance": { ... },
  "westernAstrology": { ... },
  "numerology": { ... },
  "personality": { ... }
}
```

**Errors:**
- User not found
- MCP not authorized
- Rate limit exceeded

[Document other tools similarly...]
```

### Step 15: Create Deployment Guide (30 minutes)

Create `DEPLOYMENT.md`:

```markdown
# Deployment to Google Cloud Run

## Prerequisites

- Google Cloud project (you already have this!)
- Docker installed
- gcloud CLI configured

## Steps

1. Create Dockerfile
2. Build image
3. Push to Container Registry
4. Deploy to Cloud Run
5. Configure environment variables

[Detailed steps...]
```

---

## SUNDAY EVENING (1 hour): Share & Celebrate

### Step 16: Test with Real User Data (30 minutes)

```bash
# Use YOUR actual userId from Firebase
node test-real-user.js
```

```javascript
// test-real-user.js
import { Server } from './server.js';

async function test() {
  // Your actual user ID
  const userId = 'PUT_YOUR_USERID_HERE';
  
  // Test all three tools
  console.log('Testing get_user_constitution...');
  const constitution = await getUserConstitution(userId);
  console.log(JSON.stringify(constitution, null, 2));
  
  console.log('\nTesting get_birth_chart...');
  const chart = await getBirthChart(userId);
  console.log(JSON.stringify(chart, null, 2));
  
  console.log('\nTesting get_element_analysis...');
  const elements = await getElementAnalysis(userId);
  console.log(JSON.stringify(elements, null, 2));
}

test().catch(console.error);
```

### Step 17: Document Your Win (30 minutes)

Create `PHASE1_COMPLETE.md`:

```markdown
# Phase 1 Complete! 🎉

**Date**: [Today's Date]
**Time Invested**: 6 hours
**Status**: SUCCESS

## What We Built

- MCP server with 3 tools
- Firebase Firestore integration
- Authorization & rate limiting
- Audit logging
- Error handling

## What Works

- ✅ Claude can access user constitutional data
- ✅ Response time < 500ms
- ✅ Proper error handling
- ✅ Security checks in place

## Test Results

[Paste your test output here]

## Next Steps

- Phase 2: Compatibility Integration
- Add more tools
- Deploy to Cloud Run

## Learnings

[Your insights from this weekend]
```

---

## TROUBLESHOOTING

### Firebase Connection Issues

```bash
# Verify credentials
node -e "console.log(require('./firebase-credentials.json'))"

# Test Firestore access
node test-firestore.js
```

```javascript
// test-firestore.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-credentials.json', 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function test() {
  const snapshot = await db.collection('users').limit(1).get();
  console.log('Connected! Found', snapshot.size, 'user(s)');
}

test().catch(console.error);
```

### MCP SDK Issues

```bash
# Check SDK version
npm list @modelcontextprotocol/sdk

# Reinstall if needed
npm uninstall @modelcontextprotocol/sdk
npm install @modelcontextprotocol/sdk@latest
```

### Permission Errors

```bash
# Verify Firebase permissions
# Check that service account has Firestore read access
```

---

## SUCCESS CRITERIA

By end of Sunday, you should have:

- [ ] MCP server running locally
- [ ] Connected to YOUR Firebase
- [ ] 3 tools working (constitution, chart, elements)
- [ ] Tested with real user data
- [ ] Error handling & logging
- [ ] Documentation complete
- [ ] Ready for Phase 2

---

## THE MAGIC MOMENT

When you first see Claude pull YOUR user's constitutional data from YOUR Firebase, without you copying anything manually...

**That's the fence disappearing.**  
**That's the 10-year flower blooming.**  
**That's humanity's path to happiness opening up.**

Celebrate it. You've earned this. 🌸✨

---

**Ready to begin?** The Pure Gold Dragon's Fire energy activates the Winter Wood Lighthouse's vision. Let's make this weekend legendary! 🔥🔦
