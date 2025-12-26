# BROTHER MEMORY OPTIMIZATION BRIEFING
## GENESIS Memory Architecture - Current State & Questions

**For:** Brother Claude (Memory Optimization Discussion)
**From:** Brother Opus
**Date:** December 23, 2025

---

## EXECUTIVE SUMMARY

The GENESIS platform has a sophisticated **Dual-Brain Memory Architecture** with:
- **User's Brain** (STM + LTM for user experiences)
- **SoulPartner's Brain** (STM + LTM for Luna's observations)
- **Shared Resources** (Facts, People, Happiness Anchors)

**Key Question:** Is the memory flow optimized for conversational AI?

---

## WHAT HAS BEEN IMPLEMENTED

### 1. USER'S BRAIN (Dual-Brain Architecture)

| Layer | Purpose | TTL | Storage |
|-------|---------|-----|---------|
| **STM (Session Buffer)** | Raw buffered input during conversation | 24-48 hours | Firestore + PostgreSQL |
| **LTM (Life Timeline)** | Consolidated memories by life chapter | Permanent | Firestore + PostgreSQL |

**Life Chapters:** Childhood, Teen, Young Adult, Adult, Midlife, Senior, Timeless

**Files to Review:**
- `functions/memory/dualBrainFunctions.js` - Core STM/LTM operations
- `src/services/memoryService.js` - Frontend API (lines 200-350)
- `functions/database/schema.sql` - PostgreSQL schema (user_stm, user_ltm tables)

---

### 2. SOULPARTNER'S BRAIN (Luna's Memory)

| Layer | Purpose | TTL | Storage |
|-------|---------|-----|---------|
| **STM (Session Observations)** | What Luna noticed THIS session | Session | Firestore |
| **LTM (Interaction Timeline)** | Patterns Luna learned over time | Permanent | Firestore + PostgreSQL |

**Observation Types:** emotional_state, communication_style, topic_interest, behavioral_pattern

**Files to Review:**
- `functions/memory/dualBrainFunctions.js` - `storeSessionObservation()`, `storeInteractionObservation()`
- `functions/database/schema.sql` - partner_stm, partner_ltm tables

---

### 3. SHARED RESOURCES

| Resource | Purpose | Weight in Retrieval |
|----------|---------|---------------------|
| **Facts** | Permanent truths about user | 2x weight (highest trust) |
| **People** | Relationship graph | Normal |
| **Happiness Anchors** | Emotional support memories | Triggered on low mood |

**Files to Review:**
- `functions/memory/memoryFunctions.js` - `getFacts()`, `getPeople()`, `getHappinessAnchors()`
- `functions/memory/anchorManager.js` - Anchor compound growth

---

### 4. CONSOLIDATION PIPELINE (STM → LTM)

**When:** Nightly at 3:00 AM UTC (scheduled via Cloud Functions)

**Scoring Algorithm:**
```javascript
score = (0.4 * recency) + (0.3 * mentionFrequency) + (0.3 * emotionalWeight)
```

**Thresholds:**
- `>= 0.65` → Auto-promote to LTM
- `0.45 - 0.65` → Pending human review
- `< 0.15` (and old) → Decay/delete

**Files to Review:**
- `functions/memory/consolidationEngineV2.js` - Scoring & promotion logic
- `functions/memory/sleepConsolidation.js` - Batch processing
- `functions/memory/consolidationScheduler.js` - Cron jobs

---

### 5. RETRIEVAL FLOW (When User Sends Message)

**Current Implementation:**

```
User Message
    ↓
┌─────────────────────────────────────────┐
│ 1. getMemoryContext() - Parallel fetch: │
│    - Facts (2x weight)                  │
│    - Relevant memories (semantic search)│
│    - People                             │
│    - Happiness anchors                  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. getDualBrainContext():               │
│    - User's life memories (by chapter)  │
│    - Luna's observations                │
│    - Detected patterns                  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. buildDualBrainPrompt():              │
│    - Format memories into system prompt │
│    - Inject into API call               │
└─────────────────────────────────────────┘
    ↓
API Call with Memory Context
```

**Files to Review:**
- `src/services/aiSoulPartnerService.js` - Lines 100-149 (memory pipeline)
- `functions/chat/systemPromptBuilder.js` - Memory → prompt injection
- `functions/memory/chatMemoryIntegration.js` - 4-brain retrieval

---

### 6. TOKEN REDUCTION (80%+ Savings)

**Conversation Cache Strategy:**

Instead of sending FULL conversation history:
```
Before: 50,000 tokens (all messages)
After:  2,500 tokens (Story So Far + last 10 messages)
```

**Summarization Triggers:**
- 20+ messages in conversation
- 8000+ estimated tokens

**Narrative Beats Extracted:**
- Emotional, Factual, Decision, Insight, Question, Milestone, Conflict, Resolution

**Files to Review:**
- `src/services/conversationCache.js` - `buildOptimizedPayload()`
- `src/services/summarizationService.js` - Character.ai-style compression
- `functions/memory/contextSummarization.js` - Backend narrative extraction

---

### 7. VECTOR EMBEDDINGS (Semantic Search)

**Model:** Gemini `text-embedding-004` (768-dimensional vectors)

**Relevance Scoring:**
```javascript
finalScore = vectorDistance + recencyBoost + importanceWeight + accessBoost + coreMemoryBoost
```

**Recency Scoring:** Sigmoid decay over 90 days (7-day half-life)

**Files to Review:**
- `functions/llm/embeddings.js` - `embedText()`, `calculateEmbeddingDistance()`
- `functions/memory/memoryFunctions.js` - `retrieveMemories()` with scoring

---

## FATHER'S QUESTIONS - ANALYSIS

### Q1: "Does it check long term memory first when user talks?"

**Current Answer: YES, but in parallel**

The current flow fetches LTM AND STM in parallel, not sequentially:

```javascript
// In chatMemoryIntegration.js
const [userSTM, userLTM, partnerSTM, partnerLTM, timeline] = await Promise.all([
  getUserSTM(userId, profileId, query),
  getUserLTM(userId, profileId, query),
  getPartnerSTM(userId, profileId),
  getPartnerLTM(userId, profileId, query),
  getUserTimeline(userId, profileId, query)
]);
```

**Potential Optimization:**
- Should LTM be checked FIRST to establish context?
- Then STM for recent modifiers?
- Sequential vs parallel trade-off (latency vs accuracy)

---

### Q2: "Does it pull into short term memory for quick access?"

**Current Answer: NOT EXPLICITLY**

The system doesn't currently "promote" LTM to STM for quick access. Each query re-fetches from both stores.

**Potential Optimization Ideas:**
1. **Hot Cache Layer** - Keep frequently accessed LTM in Redis/memory
2. **Session Context Buffer** - Pre-load relevant LTM at conversation start
3. **Predictive Loading** - Based on conversation topic, pre-fetch related LTM

---

### Q3: "Audio input - JSON buffer for fast processing?"

**Current Answer: PARTIALLY IMPLEMENTED**

Voice input exists (`src/components/voice/`) but doesn't have a dedicated JSON buffer.

**Current Voice Flow:**
```
Audio → Transcription → Same text pipeline as typing
```

**Proposed JSON Buffer Architecture:**
```javascript
// Proposed: audioBuffer.js
{
  sessionId: "...",
  chunks: [
    { id: 1, text: "...", timestamp: "...", emotion: "...", pending: false },
    { id: 2, text: "...", timestamp: "...", emotion: "...", pending: true }
  ],
  aggregated: "Full sentence so far...",
  readyForMemory: false
}
```

**Benefit:** Fast accumulation before memory write, reduces write operations

---

## RECOMMENDED OPTIMIZATION FLOW

### Proposed "Intelligent Memory Retrieval" Flow:

```
User Message Arrives
    ↓
┌─────────────────────────────────────────┐
│ STEP 1: Quick Context Check             │
│ - Check session cache (in-memory)       │
│ - If topic matches cached context → use │
│ - Latency: < 10ms                       │
└─────────────────────────────────────────┘
    ↓ (cache miss)
┌─────────────────────────────────────────┐
│ STEP 2: LTM Semantic Search             │
│ - Query long-term memories              │
│ - Get foundational context              │
│ - Latency: 100-200ms                    │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ STEP 3: STM Recent Modifiers            │
│ - Fetch last 24-48 hour memories        │
│ - Apply recency boosting                │
│ - Latency: 50-100ms                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ STEP 4: Merge & Rank                    │
│ - Combine LTM + STM results             │
│ - Deduplicate overlaps                  │
│ - Apply final scoring                   │
└─────────────────────────────────────────┘
    ↓
Inject into System Prompt
```

---

## KEY FILES FOR BROTHER TO REVIEW

### Priority 1: Core Memory Flow
1. `src/services/memoryService.js` - Frontend memory API
2. `functions/memory/chatMemoryIntegration.js` - 4-brain retrieval
3. `functions/chat/systemPromptBuilder.js` - Memory → prompt injection

### Priority 2: STM/LTM Architecture
4. `functions/memory/dualBrainFunctions.js` - Dual-brain operations
5. `functions/memory/consolidationEngineV2.js` - STM→LTM promotion
6. `functions/database/schema.sql` - PostgreSQL schema

### Priority 3: Token Optimization
7. `src/services/conversationCache.js` - 80% token reduction
8. `src/services/summarizationService.js` - Narrative compression
9. `functions/memory/contextSummarization.js` - Backend summarization

### Priority 4: Embeddings & Search
10. `functions/llm/embeddings.js` - Vector generation
11. `functions/memory/memoryFunctions.js` - Semantic search with scoring

### Priority 5: Voice Integration (Future)
12. `src/components/voice/VoiceChat.jsx` - Current voice UI
13. `src/services/voiceService.js` - Voice service layer

---

## OPEN QUESTIONS FOR DISCUSSION

1. **Sequential vs Parallel Retrieval**
   - Should we check LTM first, then STM?
   - Or keep parallel for lower latency?

2. **Hot Cache Layer**
   - Add Redis/in-memory cache for frequently accessed memories?
   - Session-level cache that pre-loads at conversation start?

3. **Audio Buffer Architecture**
   - JSON buffer for accumulating speech chunks?
   - Batch memory writes instead of per-utterance?

4. **Predictive Memory Loading**
   - Can we predict what LTM will be needed based on conversation start?
   - Pre-fetch related memories while user is typing?

5. **Memory Deduplication**
   - How do we handle similar memories in STM and LTM?
   - Should STM override LTM for recent updates?

---

## ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER CONVERSATION                           │
│  [Audio Input] ──→ [Transcription] ──→ [Text Message]              │
│                          OR                                         │
│  [Text Input] ─────────────────────→ [Text Message]                │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    MEMORY RETRIEVAL LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Session Cache│  │   LTM Query  │  │   STM Query  │              │
│  │  (Hot Data)  │  │ (Deep Memory)│  │(Recent 48hr) │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         ↓                  ↓                  ↓                     │
│  ┌─────────────────────────────────────────────────┐               │
│  │            MERGE & RANK (Scoring)               │               │
│  └─────────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    SYSTEM PROMPT BUILDER                            │
│  [Facts 2x] + [Memories] + [People] + [Anchors] + [KB Docs]        │
│  + [Conversation Cache (Story So Far + Last 10)]                   │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         LLM API CALL                                │
│  Gemini 1.5 Pro / 2.0 Flash with optimized context                 │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    MEMORY WRITE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ User STM     │  │ Partner STM  │  │ Reflection   │              │
│  │ (Buffer)     │  │ (Observation)│  │ (Fact Ext.)  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│               NIGHTLY CONSOLIDATION (3:00 AM UTC)                   │
│  STM → Score → Promote/Decay → LTM                                 │
│  Anchor Strengthening (compound growth)                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## SUMMARY

**What's Working:**
- Dual-brain architecture (User + SoulPartner)
- STM/LTM with consolidation pipeline
- 80%+ token reduction via conversation cache
- Vector embeddings with semantic search
- Nightly consolidation with scoring

**What Needs Discussion:**
- Sequential vs parallel LTM/STM retrieval
- Hot cache layer for frequently accessed memories
- Audio JSON buffer for voice input optimization
- Predictive memory loading

Ready for Brother's review and optimization discussion!

---

*Document generated by Brother Opus, December 23, 2025*
