# GENESIS Memory Architecture - Deployment Guide

## Overview

The GENESIS Memory Architecture implements a **DUAL-BRAIN MODEL** - separate memory systems for the User and the SoulPartner (Luna), with nightly consolidation that mimics human sleep cycles.

**Built by:** Brother Claude Opus
**Date:** December 19, 2024

---

## Dual-Brain Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DUAL-BRAIN MODEL                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   USER'S BRAIN                           SOULPARTNER'S BRAIN (Luna)          │
│   ════════════                           ══════════════════════════          │
│                                                                               │
│   ┌─────────────────┐                    ┌─────────────────┐                 │
│   │  SESSION BUFFER │ (short-term)       │    SESSION      │ (short-term)   │
│   │  Raw input      │                    │  OBSERVATIONS   │                 │
│   │  awaiting       │                    │  Luna's notes   │                 │
│   │  consolidation  │                    │  during session │                 │
│   └────────┬────────┘                    └────────┬────────┘                 │
│            │                                      │                           │
│            │ 😴 SLEEP CONSOLIDATION               │                          │
│            │    (Nightly at 3am UTC)              │                           │
│            ▼                                      ▼                           │
│   ┌─────────────────┐                    ┌─────────────────┐                 │
│   │  LIFE TIMELINE  │ (long-term)        │  INTERACTION    │ (long-term)    │
│   │  Organized by   │                    │    TIMELINE     │                 │
│   │  life chapters  │                    │  Luna's long-   │                 │
│   │  with vectors   │                    │  term insights  │                 │
│   └─────────────────┘                    └─────────────────┘                 │
│                                                   │                           │
│                                          ┌───────┴───────┐                   │
│                                          │   PATTERNS    │                   │
│                                          │  Detected     │                   │
│                                          │  behavioral   │                   │
│                                          │  patterns     │                   │
│                                          └───────────────┘                   │
│                                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                         SHARED KNOWLEDGE                                      │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│   │    FACTS     │  │    PEOPLE    │  │  HAPPINESS   │  │   MEMORIES   │    │
│   │  (2x weight) │  │   (graph)    │  │   ANCHORS    │  │  (episodic)  │    │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## What Was Built

### Files Created/Modified

```
functions/
├── memory/
│   ├── memoryFunctions.js      # Core memory operations
│   ├── dualBrainFunctions.js   # Dual-brain architecture (NEW!)
│   ├── sleepConsolidation.js   # Nightly consolidation (NEW!)
│   └── dualWrite.js            # PostgreSQL sync (Phase 2)
├── index.js                     # Updated with all exports
└── chat/
    └── systemPromptBuilder.js   # Memory prompt injection

src/services/
├── memoryService.js            # Frontend service (dual-brain)
└── aiSoulPartnerService.js     # Integration layer

dataconnect/
├── dataconnect.yaml            # Firebase Data Connect config
├── schema/
│   └── schema.gql              # PostgreSQL schema with pgvector
└── connector/
    ├── connector.yaml          # SDK generation config
    ├── queries.gql             # GraphQL queries
    └── mutations.gql           # GraphQL mutations

firestore.rules                 # Updated with dual-brain rules
firestore.indexes.json          # Updated with memory indexes
```

---

## Phase 1: Firestore Deployment (NOW)

### Step 1: Deploy Firestore Rules & Indexes

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes (except vector - see step 2)
firebase deploy --only firestore:indexes
```

### Step 2: Create Vector Indexes

Vector indexes must be created via gcloud CLI (not Firebase console):

```bash
# Login to gcloud
gcloud auth login

# Set your project
gcloud config set project astroprofile-391e6

# Create vector index for SHARED memories collection
gcloud alpha firestore indexes composite create \
  --collection-group=memories \
  --query-scope=COLLECTION \
  --field-config='field-path=embedding,vector-config={"dimension":"768","flat":"{}"}'

# Create vector index for USER life_timeline memories
gcloud alpha firestore indexes composite create \
  --collection-group=memories \
  --query-scope=COLLECTION_GROUP \
  --field-config='field-path=embedding,vector-config={"dimension":"768","flat":"{}"}'

# Create vector index for SOULPARTNER interaction_timeline observations
gcloud alpha firestore indexes composite create \
  --collection-group=observations \
  --query-scope=COLLECTION_GROUP \
  --field-config='field-path=embedding,vector-config={"dimension":"768","flat":"{}"}'
```

**Note:** Each index may take 5-10 minutes to build. You can check status in the Firebase Console under Firestore → Indexes.

### Step 3: Deploy Cloud Functions

```bash
# Deploy all functions including memory
firebase deploy --only functions
```

This will deploy:

**Core Memory Functions:**
- `storeMemory` - Store memories with embeddings
- `retrieveMemories` - Semantic vector search
- `getFacts` / `storeFact` - Permanent facts table
- `getPeople` / `upsertPerson` - Relationship graph
- `getHappinessAnchors` / `storeHappinessAnchor` - Joy network
- `reflectOnConversation` - Background fact extraction
- `refineMemories` - Memory filtering with Gemini
- `getMemoryContext` - Unified RAG retrieval

**Dual-Brain Functions (User's Brain):**
- `bufferUserInput` - Store raw session input (short-term)
- `getSessionBuffer` - Get current session buffer
- `storeLifeMemory` - Store life memory with chapter (long-term)
- `searchLifeTimeline` - Semantic search in life timeline
- `getMemoriesByChapter` - Get memories by life chapter
- `getLifeChapterSummary` - Get chapter memory counts

**Dual-Brain Functions (SoulPartner's Brain):**
- `storeSessionObservation` - Luna's session notes (short-term)
- `getSessionObservations` - Get Luna's current session notes
- `storeInteractionObservation` - Luna's long-term observation
- `searchInteractionTimeline` - Search Luna's observations
- `getKeyObservations` - Get Luna's most confirmed observations
- `storePattern` - Store detected pattern
- `getPatterns` - Get detected patterns

**Unified Context:**
- `getDualBrainContext` - Main RAG entry point (dual-brain)

**Sleep Consolidation:**
- `nightlyConsolidation` - Scheduled (3am UTC daily)
- `manualConsolidation` - Manual trigger for testing
- `getConsolidationStatus` - Check consolidation status

### Step 4: Set Environment Variables

Ensure these are set in your Cloud Functions environment:

```bash
# In Firebase console or via CLI
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

Or in `functions/.env`:
```
GEMINI_API_KEY=your_key_here
```

### Step 5: Test the Integration

1. Start your app
2. Send a message in SoulPartner chat
3. Check console for:
   - `🧠 Memory context retrieved` - Memory working
   - `🔄 Running reflection loop` - After 10 messages

---

## Phase 2: PostgreSQL Scaling (When Needed)

### When to Scale

Move to PostgreSQL when:
- Memory count exceeds 10K per user
- Complex relational queries needed (e.g., "memories about Sarah when in New York")
- Firestore costs become prohibitive

### Step 1: Initialize Data Connect

```bash
firebase init dataconnect
```

This will:
1. Create a Cloud SQL for PostgreSQL instance
2. Link it to your project
3. Set up the connection

### Step 2: Enable pgvector

In your Cloud SQL instance:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 3: Deploy Schema

```bash
firebase deploy --only dataconnect
```

### Step 4: Generate SDK

```bash
firebase dataconnect:sdk:generate
```

This creates `src/generated/dataconnect/@genesis/memory-sdk`.

### Step 5: Create HNSW Index

After schema deployment, run in SQL:

```sql
-- High-performance vector index
CREATE INDEX memories_embedding_hnsw_idx ON memories
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Supporting indexes
CREATE INDEX facts_user_profile_weight_idx ON facts (user_id, profile_id, weight DESC);
CREATE INDEX people_user_profile_mentions_idx ON people (user_id, profile_id, mention_count DESC);
```

### Step 6: Enable Dual-Write

In `functions/memory/dualWrite.js`:

1. Set `DUAL_WRITE_ENABLED = true`
2. Uncomment the imports and exports
3. Redeploy functions

### Step 7: Backfill Existing Data

Run the backfill function for each user:

```javascript
// From Firebase console or script
const { backfillToPostgres } = require('./functions/memory/dualWrite');
await backfillToPostgres('userId', 'profileId');
```

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                     GENESIS MEMORY FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   User Message                                                       │
│        │                                                             │
│        ▼                                                             │
│   ┌─────────────────┐                                               │
│   │ memoryService.  │                                               │
│   │ getMemoryContext│─────────────────────────────────────────┐     │
│   └─────────────────┘                                         │     │
│        │                                                      │     │
│        ▼                                                      ▼     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐       │
│   │  FACTS   │  │ MEMORIES │  │  PEOPLE  │  │   ANCHORS    │       │
│   │  (2x wt) │  │ (vector) │  │  (graph) │  │    (joy)     │       │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────┘       │
│        │              │             │              │                 │
│        └──────────────┼─────────────┼──────────────┘                │
│                       ▼                                              │
│               ┌───────────────┐                                      │
│               │    REFINE     │ (Gemini Flash)                      │
│               └───────────────┘                                      │
│                       │                                              │
│                       ▼                                              │
│               ┌───────────────┐                                      │
│               │ memoryPrompt  │ → System Prompt                     │
│               └───────────────┘                                      │
│                       │                                              │
│                       ▼                                              │
│               ┌───────────────┐                                      │
│               │    CLAUDE     │ → Response                          │
│               └───────────────┘                                      │
│                       │                                              │
│                       ▼                                              │
│               ┌───────────────┐                                      │
│               │  REFLECTION   │ (Background, every 10 messages)     │
│               └───────────────┘                                      │
│                       │                                              │
│                       ▼                                              │
│               Extract: Facts, People, Events, Happy Moments          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Memory Collections Structure

```
users/{userId}/
└── memory/{profileId}/
    │
    ├── user/                          # USER'S BRAIN
    │   ├── session_buffer/            # SHORT-TERM (awaiting consolidation)
    │   │   └── entries/{entryId}
    │   │       ├── content: string
    │   │       ├── emotion: string
    │   │       ├── sessionId: string
    │   │       ├── timestamp: timestamp
    │   │       └── consolidated: boolean
    │   │
    │   └── life_timeline/             # LONG-TERM (organized by chapters)
    │       └── memories/{memoryId}
    │           ├── content: string
    │           ├── chapter: "childhood"|"teen"|"youngAdult"|"adult"|"midlife"|"senior"|"timeless"
    │           ├── chapterName: string
    │           ├── age: number (optional)
    │           ├── importance: 0.0-1.0
    │           ├── emotion: string
    │           ├── embedding: vector[768]
    │           └── createdAt: timestamp
    │
    ├── soulpartner/                   # SOULPARTNER'S BRAIN (Luna)
    │   ├── session_observations/      # SHORT-TERM (Luna's session notes)
    │   │   └── entries/{obsId}
    │   │       ├── observation: string
    │   │       ├── type: "mood"|"pattern"|"insight"|"concern"|"celebration"
    │   │       ├── confidence: 0.0-1.0
    │   │       ├── sessionId: string
    │   │       └── promoted: boolean
    │   │
    │   ├── interaction_timeline/      # LONG-TERM (Luna's observations)
    │   │   └── observations/{obsId}
    │   │       ├── observation: string
    │   │       ├── pattern: string
    │   │       ├── category: string
    │   │       ├── embedding: vector[768]
    │   │       ├── firstObserved: timestamp
    │   │       ├── lastConfirmed: timestamp
    │   │       ├── confirmations: number
    │   │       └── confidence: 0.0-1.0
    │   │
    │   └── patterns/                  # DETECTED PATTERNS
    │       └── detected/{patternId}
    │           ├── pattern: string
    │           ├── category: "emotional"|"communication"|"values"|"growth"|"relationships"|"behavioral"
    │           ├── confidence: 0.0-1.0
    │           ├── examples: array
    │           ├── firstDetected: timestamp
    │           └── lastConfirmed: timestamp
    │
    ├── memories/           # SHARED: Episodic memories with embeddings
    │   └── {memoryId}
    │       ├── content: string
    │       ├── type: "episodic" | "life_event"
    │       ├── importance: 0.0-1.0
    │       ├── emotion: string
    │       ├── embedding: vector[768]
    │       └── createdAt: timestamp
    │
    ├── facts/              # SHARED: Permanent knowledge (2x weight)
    │   └── {factId}
    │       ├── fact: string
    │       ├── category: string
    │       ├── confidence: 0.0-1.0
    │       ├── weight: 2.0
    │       └── confirmations: number
    │
    ├── people/             # SHARED: Relationship graph
    │   └── {personId}
    │       ├── name: string
    │       ├── relationship: string
    │       ├── notes: array
    │       ├── sentiment: -1.0 to 1.0
    │       └── mentionCount: number
    │
    └── happinessAnchors/   # SHARED: Joy network
        └── {anchorId}
            ├── memory: string
            ├── score: 1-10
            ├── peakMoment: string
            └── sensoryAnchors: object
```

### Life Chapters

| Chapter | Age Range | Description |
|---------|-----------|-------------|
| childhood | 0-12 | Early life memories |
| teen | 13-19 | Teenage years |
| youngAdult | 20-29 | College, early career |
| adult | 30-49 | Career, family building |
| midlife | 50-64 | Midlife experiences |
| senior | 65+ | Later life wisdom |
| timeless | N/A | Memories without age context |

---

## Usage in Code

### Using Dual-Brain Context (Recommended)

```javascript
import { memoryService } from '../services/memoryService';

// Get complete dual-brain context for AI response generation
const context = await memoryService.getDualBrainContext(
  userId,
  profileId,
  sessionId,
  userMessage,
  { moodIsLow: memoryService.detectLowMood(userMessage) }
);

// Build the memory prompt for system prompt injection
const memoryPrompt = memoryService.buildDualBrainPrompt(context);

// Context structure:
// {
//   userBrain: {
//     lifeMemories: [...],    // Semantic search from life timeline
//     sessionBuffer: [...]     // Current session raw input
//   },
//   soulpartnerBrain: {
//     observations: [...],     // Luna's key observations
//     patterns: [...]          // Detected behavioral patterns
//   },
//   shared: {
//     facts: [...],           // Permanent facts (2x weight)
//     people: [...],          // Relationship graph
//     happinessAnchors: [...] // Joy network
//   },
//   retrievalTimeMs: 85
// }
```

### Processing Conversation Turns

```javascript
import { memoryService } from '../services/memoryService';

// After receiving AI response, process the turn
await memoryService.processConversationTurn(
  userId,
  profileId,
  sessionId,
  userMessage,
  aiResponse,
  {
    emotion: detectedEmotion,
    messageIndex: messageCount,
    lunaObservation: "User seems more relaxed today",
    observationType: 'mood'
  }
);

// This automatically:
// 1. Buffers user input (short-term)
// 2. Stores Luna's observation (if provided)
// 3. Schedules reflection (every 10 messages)
```

### Session End

```javascript
import { memoryService } from '../services/memoryService';

// When user ends session
await memoryService.endSession(userId, profileId, sessionId);

// For immediate consolidation (optional, usually nightly is enough)
await memoryService.triggerConsolidation(userId, profileId);
```

### Dual-Brain Direct Operations

```javascript
import { memoryService } from '../services/memoryService';

// Store a life memory with chapter
await memoryService.storeLifeMemory(userId, profileId,
  "Graduated from MIT in 2015 with a CS degree",
  {
    chapter: 'youngAdult',
    importance: 0.9,
    emotion: 'pride',
    contextHints: 'college graduation'
  }
);

// Search life timeline
const memories = await memoryService.searchLifeTimeline(
  userId, profileId, "college experiences", { chapter: 'youngAdult', limit: 5 }
);

// Get memories by chapter
const childhoodMemories = await memoryService.getMemoriesByChapter(
  userId, profileId, 'childhood', 10
);

// Get life chapter summary
const chapters = await memoryService.getLifeChapterSummary(userId, profileId);
// { childhood: { memoryCount: 5 }, teen: { memoryCount: 12 }, ... }

// Store Luna's observation
await memoryService.storeSessionObservation(
  userId, profileId, sessionId,
  "User tends to minimize their achievements",
  { type: 'pattern', confidence: 0.85 }
);

// Get Luna's key observations
const observations = await memoryService.getKeyObservations(userId, profileId, 10);

// Store a detected pattern
await memoryService.storePattern(userId, profileId,
  "User becomes anxious when discussing career decisions",
  { category: 'emotional', confidence: 0.8, examples: ["mentioned job uncertainty"] }
);

// Get patterns
const patterns = await memoryService.getPatterns(userId, profileId, { category: 'emotional' });
```

### Legacy Memory Operations (Still Supported)

```javascript
import { memoryService } from '../services/memoryService';

// Store a fact manually
await memoryService.storeFact(userId, profileId,
  "User's sister is named Sarah",
  { category: 'family', confidence: 0.95 }
);

// Store a person
await memoryService.upsertPerson(userId, profileId, 'Sarah', {
  relationship: 'sister',
  notes: 'Lives in Portland, loves gardening'
});

// Store a happiness anchor
await memoryService.storeHappinessAnchor(userId, profileId,
  'Family fishing trip at Lake Tahoe',
  { score: 9, peakMoment: 'Dad caught the big one' }
);

// Force reflection
await memoryService.forceReflection(userId, profileId, sessionId);
```

---

## Sleep Consolidation

The nightly consolidation process mimics human memory consolidation during sleep.

### What Happens at 3am UTC

1. **Session Buffer → Life Timeline**
   - Uses Gemini to extract important memories from raw input
   - Assigns life chapters based on age/context
   - Generates embeddings for semantic search

2. **Session Observations → Interaction Timeline**
   - Synthesizes observations into long-term insights
   - Merges similar observations (increases confidence)
   - Generates embeddings

3. **Pattern Detection**
   - Analyzes interaction timeline for high-level patterns
   - Categories: emotional, communication, values, growth, relationships, behavioral
   - Creates new patterns or confirms existing ones

4. **Memory Decay**
   - Old, unaccessed memories get importance reduced by 10%
   - High-importance (>0.8) memories are protected
   - Prevents memory clutter over time

5. **Cleanup**
   - Deletes consolidated session buffer entries (>7 days old)
   - Deletes promoted session observations (>7 days old)

### Monitoring Consolidation

```javascript
// Check consolidation status
const status = await memoryService.getConsolidationStatus();
// {
//   status: 'success' | 'partial' | 'failed',
//   lastRun: '2024-12-19T03:00:00Z',
//   duration: 45000,
//   stats: {
//     usersProcessed: 150,
//     memoriesConsolidated: 320,
//     observationsPromoted: 180,
//     patternsDetected: 25,
//     memoriesDecayed: 45,
//     sessionsCleanedUp: 890
//   }
// }
```

---

## Performance Targets

| Operation | Target | How |
|-----------|--------|-----|
| Memory retrieval | <100ms | Parallel queries + caching |
| Embedding | <50ms | Gemini text-embedding-004 |
| Vector search | <30ms | Firestore findNearest |
| Refine | <100ms | Gemini Flash |
| **Total** | **<300ms** | All above |
| Reflection | Background | Non-blocking |

---

## Troubleshooting

### "findNearest is not a function"
Vector index not created. Run the gcloud command in Step 2.

### Memory not being retrieved
- Check that `userId` and `profileId` are being passed
- Verify Cloud Functions are deployed
- Check console for errors

### Reflection not running
- Needs 10 messages (5 exchanges) to trigger
- Check that `sessionId` is being passed
- Call `forceReflection()` at session end

### High latency
- Check if vector index is built (can take 10 min)
- Monitor Cloud Function cold starts
- Consider caching frequently accessed facts

---

## Next Steps

1. **Deploy Phase 1** - Follow steps above
2. **Monitor** - Watch memory growth per user
3. **When >10K memories** - Begin Phase 2 planning
4. **Advanced Features** (Future):
   - Proactive check-ins based on follow-up triggers
   - Memory visualization UI
   - Legacy Keeper mode for biography generation

---

*"Every life is a story worth telling. Every soul deserves to be remembered."*
