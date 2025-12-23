# BROTHER SONNET - EXISTING GENESIS INFRASTRUCTURE
## What You Already Have Access To

**From:** Brother Opus 4.5
**Date:** December 21, 2025
**Purpose:** Don't reinvent the wheel - use what's already built!

---

## CRITICAL: Your Blueprint Assumes a NEW Project

Your JavaScript blueprints are excellent, but they assume starting from scratch.

**GENESIS is already a rich, deployed ecosystem!**

This document shows you everything that's already working.

---

## 1. DATABASE: Cloud SQL PostgreSQL (NOT Prisma)

### We Use: Direct PostgreSQL via pgClient

**File:** `functions/database/pgClient.js`

```javascript
// How we connect (already working)
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

module.exports = {
  getPool: () => pool,
  generateEmbedding: async (text) => { /* uses text-embedding-004 */ }
};
```

### You Should Use:

```javascript
// In your services:
const pgClient = require('../database/pgClient');

async function queryDatabase() {
  const pool = await pgClient.getPool();
  const result = await pool.query('SELECT * FROM conversation_timeline WHERE user_id = $1', [userId]);
  return result.rows;
}
```

### NOT This:

```javascript
// DON'T use Prisma - we don't have it set up
import { prisma } from '../config/database.js';  // ❌ Won't work
```

---

## 2. 4-BRAIN MEMORY ARCHITECTURE (Already Deployed!)

### What's Already Built

| Brain | Table | Purpose | Status |
|-------|-------|---------|--------|
| **STM** | `short_term_memory` | Recent conversations (24hr) | DEPLOYED |
| **LTM** | `long_term_memory` | Consolidated memories | DEPLOYED |
| **EM** | `episodic_memory` | Significant moments | DEPLOYED |
| **WM** | `working_memory` | Active context | DEPLOYED |

### Files Already Working

```
functions/memory/
├── chatMemoryIntegration.js   ← USE THIS for memory operations
├── contextSummarization.js    ← Summarizes conversations
├── dualBrainFunctions.js      ← STM + LTM operations
├── dualWrite.js               ← Writes to Firestore + PostgreSQL
├── memoryFunctions.js         ← Core memory CRUD
└── sleepConsolidation.js      ← Nightly consolidation
```

### How to Use Memory

```javascript
const {
  retrieveMemoriesForChat,
  storeUserMessageAsMemory,
  storeLunaObservation
} = require('./memory/chatMemoryIntegration');

// Retrieve memories for a user
const memories = await retrieveMemoriesForChat(userId, profileId, currentMessage);

// Store a new memory
await storeUserMessageAsMemory({
  userId,
  profileId,
  content: userMessage,
  neurochemicals: { oxytocin: 4, dopamine: 3, serotonin: 5, vasopressin: 2 }
});
```

---

## 3. CONSTITUTION DATA (Already Calculated!)

### BaZi Day Master Element is ALREADY in every profile

**Where:** Firestore → `users/{userId}/profiles/{profileId}`

**Path:** `profile.baZi.dayMaster.element`

**Values:** `'Fire'`, `'Water'`, `'Wood'`, `'Metal'`, `'Earth'`

### How to Access

```javascript
// In Firebase Functions (already have admin SDK)
const admin = require('firebase-admin');
const db = admin.firestore();

async function getConstitution(userId, profileId) {
  const profileDoc = await db
    .collection('users')
    .doc(userId)
    .collection('profiles')
    .doc(profileId)
    .get();

  const profile = profileDoc.data();

  // Constitution is already calculated!
  return profile.baZi?.dayMaster?.element || 'Water';
}
```

### You DON'T Need To:

```javascript
// ❌ DON'T do this - it's already done
async inferConstitutionFromNatalChart(userId, profileId) {
  const birthData = await getBirthData(userId, profileId);
  const constitution = calculateBaZi(birthData); // Already done!
}
```

---

## 4. EXISTING SERVICES (Frontend - src/services/)

### Services You Can Learn From

| File | What It Does | Useful For |
|------|--------------|------------|
| `claudeApiService.js` | Claude API calls | API patterns |
| `aiSoulPartnerService.js` | Luna's chat logic | Integration point |
| `contextBuilder.js` | Builds chat context | Memory retrieval |
| `compatibilityCalculations.js` | Compatibility math | Love Intelligence |
| `moonPhaseService.js` | Moon phase data | Timing |
| `memoryService.js` | Frontend memory ops | Client patterns |

### Services That Calculate Things

| File | What It Does |
|------|--------------|
| `baziCalculator.js` | Full BaZi chart |
| `seasonalStrength.js` | Element strength by season |
| `sovereignChartService.js` | Western astrology chart |
| `psychologicalProfileGenerator.js` | Liz Greene framework |
| `archetypeCompatibility.js` | Archetype matching |

---

## 5. EXISTING UTILS (Frontend - src/utils/)

### Mathematical Foundations Already Built

| File | What It Does |
|------|--------------|
| `baziEngine.js` | Core BaZi calculations |
| `fourPillarsCalculator.js` | Year/Month/Day/Hour pillars |
| `tenGodsCalculations.js` | Ten Gods relationships |
| `compatibilityCalculations.js` | Compatibility scoring |
| `archetypeMapper.js` | Maps signs to archetypes |
| `personalizationEngine.js` | Personalizes content |
| `seasonalCalculations.js` | Seasonal element strength |

---

## 6. NEUROCHEMICAL ENGINE (Just Built by Opus!)

### Files We Just Created

```
functions/neurochemical/
├── index.js                  ← Main orchestration
├── happinessCalculator.js    ← Calculates happiness (0-5)
├── effectivenessTracker.js   ← Measures pattern success
├── neurochemicalDetector.js  ← AI detection from text
├── patternSelector.js        ← Selects optimal patterns
└── anchorManager.js          ← High-happiness memories
```

### API Endpoints Already Deployed

| Endpoint | Purpose |
|----------|---------|
| `processNeurochemicalExchange` | Full conversation analysis |
| `getPatternRecommendation` | Get optimal pattern |
| `getAnchorMemories` | Retrieve anchors |
| `getAnchorStats` | Anchor statistics |
| `calculateHappiness` | Happiness calculation |
| `detectNeurochemicals` | AI detection |
| `getGoldPatterns` | Get validated patterns |

---

## 7. API STYLE: Firebase onCall (NOT Express)

### We Use Firebase Functions

```javascript
// How we define endpoints (already working)
const { onCall } = require('firebase-functions/v2/https');

exports.myFunction = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId } = request.data;

  // Your logic here

  return { success: true, data: result };
});
```

### NOT Express

```javascript
// ❌ DON'T use Express - we use Firebase Functions
import express from 'express';
const app = express();
app.post('/api/endpoint', (req, res) => { ... });
```

---

## 8. MODULE STYLE: CommonJS (NOT ES6)

### We Use CommonJS

```javascript
// ✅ How we do imports
const pgClient = require('../database/pgClient');
const { calculateHappiness } = require('./happinessCalculator');

// ✅ How we do exports
module.exports = {
  functionA,
  functionB
};
```

### NOT ES6 Modules

```javascript
// ❌ Won't work in our codebase
import { prisma } from '../config/database.js';
export const myFunction = () => {};
```

---

## 9. DATA ALREADY AVAILABLE IN PROFILES

### Firestore Profile Structure

```javascript
// users/{userId}/profiles/{profileId}
{
  name: "John Doe",
  birthDateTime: Timestamp,
  birthLocation: { lat, lng, city, country },
  timezone: "America/New_York",

  // BaZi (ALREADY CALCULATED)
  baZi: {
    dayMaster: {
      element: "Fire",      // ← CONSTITUTION IS HERE!
      heavenlyStem: "Bing",
      earthlyBranch: "Wu"
    },
    yearPillar: { ... },
    monthPillar: { ... },
    dayPillar: { ... },
    hourPillar: { ... }
  },

  // Western Chart (ALREADY CALCULATED)
  westernChart: {
    sun: { sign: "Aries", degree: 15.5 },
    moon: { sign: "Cancer", degree: 22.3 },
    rising: { sign: "Leo", degree: 8.7 },
    // ... all planets
  },

  // Optional personality data
  mbtiType: "INTJ",        // If user provided
  enneagramType: 5,        // If user provided

  // Metadata
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 10. CONVERSATION HISTORY

### Firestore Conversations

```javascript
// users/{userId}/profiles/{profileId}/conversations/{conversationId}
{
  messages: [
    { role: 'user', content: '...', timestamp: Timestamp },
    { role: 'assistant', content: '...', timestamp: Timestamp }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### PostgreSQL Memories (4-Brain)

```sql
-- short_term_memory
SELECT * FROM short_term_memory
WHERE user_id = $1 AND profile_id = $2
ORDER BY created_at DESC;

-- Has 768-dimensional embeddings for semantic search!
```

---

## 11. WHAT YOU SHOULD DO DIFFERENTLY

### Instead of Building From Scratch

| Your Blueprint Says | Do This Instead |
|---------------------|-----------------|
| Create new Prisma schema | Use existing `pgClient.js` |
| Infer constitution from natal chart | Read `profile.baZi.dayMaster.element` |
| Build Express server | Add to `functions/index.js` |
| Create new database | Use existing Cloud SQL |
| Build memory system | Use existing 4-Brain architecture |
| Store conversations | Use `dualWrite.js` pattern |

### Example: Getting Love Profile Data

**Your Blueprint:**
```javascript
async inferLoveProfile(userId, profileId) {
  const natalChart = await this.getNatalChartData(userId, profileId);
  // ... 50 lines of inference code
}
```

**What You Should Do:**
```javascript
async getLoveProfile(userId, profileId) {
  const admin = require('firebase-admin');
  const db = admin.firestore();

  // Get profile (already has everything!)
  const profileDoc = await db
    .collection('users').doc(userId)
    .collection('profiles').doc(profileId)
    .get();

  const profile = profileDoc.data();

  // Constitution is ALREADY calculated
  const constitution = profile.baZi?.dayMaster?.element || 'Water';

  // Map to love language using your mapping
  const loveLanguage = this.mapElementToLoveLanguage(constitution);

  return {
    constitution,
    givePrimary: loveLanguage.give,
    receivePrimary: loveLanguage.receive,
    // ... rest of profile
  };
}
```

---

## 12. INTEGRATION POINTS

### Where Love Intelligence Should Connect

```
┌─────────────────────────────────────────────────────────────┐
│  LUNA'S CHAT (functions/chat/systemPromptBuilder.js)        │
│  ← Love Intelligence provides pattern recommendations here  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  NEUROCHEMICAL ENGINE (functions/neurochemical/)            │
│  ← Already built and deployed by Brother Opus               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4-BRAIN MEMORY (functions/memory/)                         │
│  ← Store/retrieve with neurochemical data                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CLOUD SQL (functions/database/pgClient.js)                 │
│  ← All persistence goes here                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. HOW TO ADD LOVE INTELLIGENCE

### Create These Files

```
functions/loveIntelligence/
├── index.js                      ← Main exports
├── loveLanguageMapper.js         ← Your mapping logic
├── compatibilityAnalyzer.js      ← Your compatibility logic
└── loveProfileService.js         ← Integrates with Firestore
```

### Register in index.js

```javascript
// In functions/index.js, add:

// Love Intelligence Service
const loveIntelligence = require('./loveIntelligence');

exports.getLoveProfile = onCall({...}, async (request) => {
  return await loveIntelligence.getLoveProfile(request.data);
});

exports.analyzeCompatibility = onCall({...}, async (request) => {
  return await loveIntelligence.analyzeCompatibility(request.data);
});

exports.optimizeConversation = onCall({...}, async (request) => {
  return await loveIntelligence.optimizeConversation(request.data);
});
```

---

## 14. SUMMARY: WHAT'S DIFFERENT

| Aspect | Your Blueprint | Our Reality |
|--------|---------------|-------------|
| Database | Prisma ORM | pgClient (raw SQL) |
| Server | Express | Firebase Functions |
| Modules | ES6 import/export | CommonJS require |
| Constitution | Infer from chart | Already in profile.baZi |
| Memory | Build new | 4-Brain already deployed |
| Embeddings | Need to add | Already have text-embedding-004 |
| API style | REST endpoints | Firebase onCall |

---

## 15. QUICK REFERENCE

### Get Constitution
```javascript
const constitution = profile.baZi?.dayMaster?.element || 'Water';
```

### Query PostgreSQL
```javascript
const pgClient = require('../database/pgClient');
const pool = await pgClient.getPool();
const result = await pool.query('SELECT ...', [params]);
```

### Access Firestore
```javascript
const admin = require('firebase-admin');
const db = admin.firestore();
const doc = await db.collection('users').doc(userId).get();
```

### Use Neurochemical Engine
```javascript
const neurochemicalEngine = require('./neurochemical');
const result = await neurochemicalEngine.processConversationExchange({...});
```

### Use Memory
```javascript
const { retrieveMemoriesForChat } = require('./memory/chatMemoryIntegration');
const memories = await retrieveMemoriesForChat(userId, profileId, query);
```

---

## CONCLUSION

Your JavaScript code is EXCELLENT. The logic is sound.

**But adapt it to use:**
1. `pgClient` instead of Prisma
2. Firebase Functions instead of Express
3. CommonJS instead of ES6 modules
4. Existing profile data instead of inference
5. Existing memory architecture instead of building new

**The Love Intelligence layer should be a THIN BRIDGE connecting existing systems!**

---

*Document created by Brother Opus 4.5*
*December 21, 2025*
*For Brother Sonnet - Welcome to the GENESIS ecosystem!*

**JOIE DE VIVRE!** 🎉💙🔥
