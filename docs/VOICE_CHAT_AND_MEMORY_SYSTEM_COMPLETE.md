# GENESIS Voice Chat & Memory System - Complete Technical Documentation

## Overview

This document provides comprehensive technical documentation for the Luna Voice Chat system and the Dual-Brain Memory Architecture, including caching strategies, front-end processing, and token optimization.

**Version:** 1.0
**Date:** December 19, 2024
**Authors:** Father Ticky (Vision), Claude Opus (Architecture)

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [The 4 Memory Files (Dual-Brain Model)](#2-the-4-memory-files-dual-brain-model)
3. [Voice Chat System](#3-voice-chat-system)
4. [Caching Strategy](#4-caching-strategy)
5. [Token Usage Optimization](#5-token-usage-optimization)
6. [Front-End Processing](#6-front-end-processing)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
8. [API Reference](#8-api-reference)
9. [Deployment Guide](#9-deployment-guide)
10. [Gemini 3 Migration Guide](#10-gemini-3-migration-guide)
11. [Advanced Voice Features](#11-advanced-voice-features)
12. [Focus Mode](#12-focus-mode)
13. [Focus Report (Debrief)](#13-focus-report-debrief)
14. [Adaptive Localization (Multilingual)](#14-adaptive-localization-multilingual)

---

## 1. System Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                              GENESIS LUNA SYSTEM                                    |
+-----------------------------------------------------------------------------------+
|                                                                                     |
|   +-------------------+     +-------------------+     +-------------------+         |
|   |   VOICE CHAT      |     |   TEXT CHAT       |     |   MEMORY SYSTEM   |         |
|   |   (Gemini Live)   |<--->|   (Claude/Gemini) |<--->|   (Dual-Brain)    |         |
|   +-------------------+     +-------------------+     +-------------------+         |
|            |                        |                        |                      |
|            v                        v                        v                      |
|   +------------------------------------------------------------------+             |
|   |                     CACHING & OPTIMIZATION LAYER                  |             |
|   |   - ConversationCache (80%+ token reduction)                      |             |
|   |   - SummarizationService (Story So Far)                           |             |
|   |   - MemoryService (5-minute cache)                                |             |
|   +------------------------------------------------------------------+             |
|                                     |                                               |
|                                     v                                               |
|   +------------------------------------------------------------------+             |
|   |                        FIREBASE BACKEND                           |             |
|   |   - Firestore (memories, facts, people, observations)            |             |
|   |   - Vector Search (pgvector-like with Firestore)                 |             |
|   |   - Cloud Functions (memory operations, consolidation)           |             |
|   +------------------------------------------------------------------+             |
|                                                                                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. The 4 Memory Files (Dual-Brain Model)

The memory system implements a **Dual-Brain Model** - separate memory systems for the User and the SoulPartner (Luna), mimicking human memory architecture.

### 2.1 Architecture Diagram

```
+------------------------------------------------------------------------------+
|                          DUAL-BRAIN MEMORY SYSTEM                              |
+------------------------------------------------------------------------------+
|                                                                                |
|   USER'S BRAIN                            SOULPARTNER'S BRAIN (Luna)          |
|   ============                            ==========================          |
|                                                                                |
|   +------------------+                    +------------------+                 |
|   | SESSION BUFFER   | (short-term)       | SESSION          | (short-term)   |
|   | Raw input        |                    | OBSERVATIONS     |                 |
|   | awaiting         |                    | Luna's notes     |                 |
|   | consolidation    |                    | during session   |                 |
|   +--------+---------+                    +--------+---------+                 |
|            |                                       |                           |
|            | SLEEP CONSOLIDATION                   |                           |
|            | (Nightly at 3am UTC)                  |                           |
|            v                                       v                           |
|   +------------------+                    +------------------+                 |
|   | LIFE TIMELINE    | (long-term)        | INTERACTION      | (long-term)    |
|   | Organized by     |                    | TIMELINE         |                 |
|   | life chapters    |                    | Luna's insights  |                 |
|   | with vectors     |                    | + patterns       |                 |
|   +------------------+                    +------------------+                 |
|                                                                                |
+------------------------------------------------------------------------------+
|                           SHARED KNOWLEDGE                                     |
|   +------------+  +------------+  +----------------+  +--------------+        |
|   |   FACTS    |  |   PEOPLE   |  |   HAPPINESS    |  |   MEMORIES   |        |
|   |  (2x wt)   |  |  (graph)   |  |    ANCHORS     |  |  (episodic)  |        |
|   +------------+  +------------+  +----------------+  +--------------+        |
+------------------------------------------------------------------------------+
```

### 2.2 The Four Memory Banks

#### Memory Bank 1: User Session Buffer (Short-Term)
**Location:** `users/{userId}/memory/{profileId}/user/session_buffer/entries/`

**Purpose:** Captures raw user input during active sessions, awaiting nightly consolidation.

**Schema:**
```javascript
{
  content: string,           // Raw user message
  emotion: string | null,    // Detected emotion
  sessionId: string,         // Session identifier
  messageIndex: number,      // Order in conversation
  timestamp: Timestamp,      // When captured
  consolidated: boolean      // Has been processed
}
```

**Lifecycle:**
1. Created during conversation via `bufferUserInput()`
2. Processed nightly by sleep consolidation
3. Important memories moved to Life Timeline
4. Deleted after 7 days post-consolidation

---

#### Memory Bank 2: User Life Timeline (Long-Term)
**Location:** `users/{userId}/memory/{profileId}/user/life_timeline/memories/`

**Purpose:** Permanent life memories organized by life chapters with vector embeddings for semantic search.

**Schema:**
```javascript
{
  content: string,                    // Memory description
  chapter: string,                    // "childhood" | "teen" | "youngAdult" | "adult" | "midlife" | "senior" | "timeless"
  chapterName: string,                // Human-readable chapter name
  age: number | null,                 // User's age when memory occurred
  importance: number,                 // 0.0 to 1.0 (decays over time)
  emotion: string | null,             // Associated emotion
  people: string[],                   // People mentioned
  embedding: Vector[768],             // Semantic embedding
  createdAt: Timestamp,
  source: "conversation" | "consolidation" | "manual",
  accessCount: number                 // For recency tracking
}
```

**Life Chapters:**
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

#### Memory Bank 3: SoulPartner Session Observations (Short-Term)
**Location:** `users/{userId}/memory/{profileId}/soulpartner/session_observations/entries/`

**Purpose:** Luna's real-time notes about what she observes during the current session.

**Schema:**
```javascript
{
  observation: string,       // What Luna noticed
  type: string,              // "mood" | "pattern" | "insight" | "concern" | "celebration"
  confidence: number,        // 0.0 to 1.0
  sessionId: string,
  timestamp: Timestamp,
  promoted: boolean          // Moved to long-term
}
```

**Lifecycle:**
1. Created when Luna notices something significant
2. Nightly consolidation synthesizes into long-term insights
3. Similar observations merge (increases confidence)
4. Deleted after 7 days post-promotion

---

#### Memory Bank 4: SoulPartner Interaction Timeline (Long-Term)
**Location:** `users/{userId}/memory/{profileId}/soulpartner/interaction_timeline/observations/`

**Purpose:** Luna's accumulated understanding of the user - patterns, insights, and confirmed observations.

**Schema:**
```javascript
{
  observation: string,                // Luna's insight
  pattern: string | null,             // Behavioral pattern
  category: string,                   // "mood_pattern" | "communication_style" | "values" | etc.
  embedding: Vector[768],             // Semantic embedding
  firstObserved: Timestamp,
  lastConfirmed: Timestamp,
  confirmations: number,              // Times this pattern observed
  confidence: number                  // Increases with confirmations
}
```

**Pattern Categories:**
- `emotional` - Emotional triggers and responses
- `communication` - How user expresses themselves
- `values` - What matters to them
- `relationships` - How they connect with others
- `growth` - Areas of development
- `behavioral` - General behavioral patterns

---

### 2.3 Memory Consolidation (Sleep Cycle)

Runs nightly at **3:00 AM UTC** via `nightlyConsolidation` Cloud Function.

**Process:**
```
1. BUFFER TO TIMELINE
   - Extract important memories from session buffer
   - Use Gemini to identify life events, revelations, values
   - Generate embeddings
   - Store in life_timeline with chapter classification
   - Mark buffer entries as consolidated

2. OBSERVATION PROMOTION
   - Synthesize session observations into long-term insights
   - Merge similar observations (increase confidence)
   - Store in interaction_timeline

3. PATTERN DETECTION
   - Analyze interaction timeline for high-level patterns
   - Create or confirm behavioral patterns
   - Store in patterns collection

4. MEMORY DECAY
   - Reduce importance of old, unaccessed memories by 10%
   - Protect high-importance (>0.8) memories

5. CLEANUP
   - Delete consolidated buffer entries >7 days old
   - Delete promoted observations >7 days old
```

---

## 3. Voice Chat System

### 3.1 Architecture

```
+----------------------------------------------------------------------------+
|                         USER'S BROWSER                                       |
+----------------------------------------------------------------------------+
|                                                                              |
|  +----------------+    +----------------+    +------------------+            |
|  | VoiceChat.jsx  |    | LunaVisualizer |    | voiceService.js  |            |
|  |                |    |                |    |                  |            |
|  | - UI Controls  |<-->| - Canvas       |<-->| - AudioContext   |            |
|  | - Transcripts  |    | - Particles    |    | - MediaDevices   |            |
|  | - Error Disp   |    | - Waveforms    |    | - WebSocket      |            |
|  +-------+--------+    +----------------+    | - PCM Encode     |            |
|          |                                   +--------+---------+            |
|          |             +----------------+             |                      |
|          +------------>| ProfileContext |<------------+                      |
|                        | MemoryService  |                                    |
|                        +----------------+                                    |
+----------------------------------------------------------------------------+
                                   |
                           WebSocket + HTTPS
                                   |
                                   v
+----------------------------------------------------------------------------+
|                         CLOUD FUNCTIONS                                      |
+----------------------------------------------------------------------------+
|  +----------------+    +----------------+    +------------------+            |
|  | getVoiceSession|    | endVoiceSession|    | storeVoiceMemory |            |
|  | - Auth Check   |    | - Store Logs   |    | - Extract Facts  |            |
|  | - Build Prompt |    | - Save Xscript |    | - Store Obs      |            |
|  | - Return WSUrl |    | - Cleanup      |    | - Update Brain   |            |
|  +----------------+    +----------------+    +------------------+            |
+----------------------------------------------------------------------------+
                                   |
                            Gemini Live API
                                   |
                                   v
+----------------------------------------------------------------------------+
|                      GEMINI 2.5 FLASH                                        |
|               (gemini-2.5-flash-native-audio)                                |
+----------------------------------------------------------------------------+
|  - Speech-to-Text (real-time transcription)                                 |
|  - Natural Language Understanding                                            |
|  - Response Generation (Luna's personality)                                  |
|  - Text-to-Speech (Aoede voice)                                             |
|  - Voice Activity Detection                                                  |
|  - Barge-in Support (interruptions)                                         |
+----------------------------------------------------------------------------+
```

### 3.2 Voice States

```javascript
const VOICE_STATES = {
  IDLE: 'idle',         // Ready to start
  LISTENING: 'listening', // Capturing user audio
  THINKING: 'thinking',   // Processing response
  SPEAKING: 'speaking',   // Playing Luna's audio
  ERROR: 'error'          // Error occurred
};
```

### 3.3 Audio Pipeline

```
CAPTURE:
+------------+    +-------------+    +-----------+    +--------------+
| Microphone |--->| AudioContext|--->| Analyser  |--->| Visualizer   |
| (16kHz)    |    |             |    | Node      |    | Data         |
+------------+    |             |    +-----------+    +--------------+
                  |             |
                  |             |    +-----------+    +--------------+
                  |             |--->| Script    |--->| PCM16        |
                  |             |    | Processor |    | WebSocket    |
                  +-------------+    +-----------+    +--------------+
                                                            |
                                                            v
                                                     +--------------+
                                                     | Gemini Live  |
                                                     | WebSocket    |
                                                     +--------------+

PLAYBACK:
+--------------+    +-----------+    +-----------+    +------------+
| Gemini Audio |--->| Audio     |--->| Buffer    |--->| GainNode   |---> Speakers
| (ArrayBuffer)|    | Queue     |    | Source    |    |            |
+--------------+    +-----------+    +-----------+    +------------+
```

### 3.4 Audio Configuration

```javascript
const AUDIO_CONFIG = {
  sampleRate: 16000,        // Gemini requirement
  channelCount: 1,          // Mono
  bufferSize: 4096,         // Processing buffer
  fftSize: 256,             // Visualizer resolution
  smoothingTimeConstant: 0.8
};

const WEBSOCKET_CONFIG = {
  reconnectAttempts: 3,
  reconnectDelay: 1000,     // ms
  heartbeatInterval: 30000  // 30 seconds
};
```

### 3.5 Memory Integration

Voice sessions integrate with the Dual-Brain Memory:

```javascript
// During voice session initialization
const memoryContext = await memoryService.getDualBrainContext(
  userId, profileId, sessionId, userMessage
);

// Pre-session loading for voice
const voiceContext = {
  people: await getTopPeople(userId, 3),
  themes: await getRecentThemes(userId, 3),
  baseline: await getEmotionalBaseline(userId),
  triggers: await getSensitivities(userId)
};
```

---

## 4. Caching Strategy

### 4.1 Three-Layer Cache Architecture

```
+------------------------------------------------------------------+
|                      CACHING LAYERS                                |
+------------------------------------------------------------------+
|                                                                    |
|  LAYER 1: ConversationCache (Frontend)                            |
|  +------------------------------------------------------------+  |
|  | - Message cache per profile (Map<profileId, messages[]>)    |  |
|  | - Story cache per profile (Map<profileId, {story, time}>)   |  |
|  | - 5-minute TTL for story cache                              |  |
|  | - Automatic summarization trigger at 20 messages            |  |
|  +------------------------------------------------------------+  |
|                           |                                        |
|                           v                                        |
|  LAYER 2: SummarizationService (Frontend + Backend)               |
|  +------------------------------------------------------------+  |
|  | - Story So Far cache (Map<profileId, storySoFar>)           |  |
|  | - 5-minute cache validity                                    |  |
|  | - Prevents duplicate summarization requests                  |  |
|  | - Background summarization (non-blocking)                    |  |
|  +------------------------------------------------------------+  |
|                           |                                        |
|                           v                                        |
|  LAYER 3: MemoryService (Frontend)                                |
|  +------------------------------------------------------------+  |
|  | - Facts cache per profile (5-minute TTL)                    |  |
|  | - Reflection queue per session                               |  |
|  | - Automatic cache invalidation on writes                     |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### 4.2 ConversationCache Details

**Location:** `src/services/conversationCache.js`

**Configuration:**
```javascript
const CONFIG = {
  recentMessageCount: 10,       // Always include last 10 messages
  summarizationThreshold: 20,   // Trigger summary at 20 messages
  tokenEstimateRatio: 4,        // chars / 4 = tokens
  maxStorySoFarTokens: 500,     // Max tokens for story
  enableMetrics: true           // Log optimization metrics
};
```

**Key Methods:**
```javascript
// Build optimized payload for API calls
async buildOptimizedPayload(profileId, conversationId, options = {})
// Returns: { storySoFar, recentMessages, hasContext, metrics }

// Check if summarization needed
shouldTriggerSummarization(profileId)

// Process message exchange
async processExchange(profileId, conversationId, userMessage, aiResponse)
```

### 4.3 Summarization Service Details

**Location:** `src/services/summarizationService.js`

**Thresholds:**
```javascript
const THRESHOLDS = {
  messageCount: 20,      // Trigger after 20 messages
  tokenEstimate: 8000,   // Or 8000 estimated tokens
  checkInterval: 5       // Check every 5 messages
};
```

**Key Methods:**
```javascript
// Trigger background summarization
async triggerSummarization(conversationId, profileId, messages)

// Get cached or fetch Story So Far
async getStorySoFar(profileId, forceRefresh = false)

// Build context injection for system prompt
async buildContextInjection(profileId)
// Returns: "## THE STORY SO FAR\n..." + "## OPEN THREADS\n..."
```

### 4.4 Memory Service Caching

**Location:** `src/services/memoryService.js`

```javascript
class MemoryService {
  constructor() {
    this.cache = new Map();       // Simple cache for lookups
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.reflectionQueue = new Map(); // Per-session message queue
    this.MESSAGE_THRESHOLD = 10;  // Reflect every 10 messages
  }
}
```

**Cache Operations:**
```javascript
// Cache gets
getFromCache(key) // Returns cached data if < 5 minutes old

// Cache sets
setCache(key, data) // Stores with timestamp

// Cache invalidation
invalidateCache(key) // Called after writes
```

---

## 5. Token Usage Optimization

### 5.1 The Problem

Without optimization:
```
Every API call = Send ALL 50+ messages = 50,000+ tokens
```

### 5.2 The Solution: 80%+ Token Reduction

```
+------------------------------------------------------------------+
|                    TOKEN OPTIMIZATION STRATEGY                     |
+------------------------------------------------------------------+
|                                                                    |
|  BEFORE (No Optimization):                                         |
|  +------------------------------------------------------------+  |
|  | Message 1 (500 tokens)                                      |  |
|  | Message 2 (400 tokens)                                      |  |
|  | ...                                                         |  |
|  | Message 50 (600 tokens)                                     |  |
|  | TOTAL: ~50,000 tokens per API call                          |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  AFTER (With Optimization):                                        |
|  +------------------------------------------------------------+  |
|  | Story So Far (500 tokens max)                               |  |
|  | "[40 earlier messages summarized]"                          |  |
|  | Message 41-50 (recent 10 messages, ~2,000 tokens)           |  |
|  | TOTAL: ~2,500 tokens per API call (95% reduction!)          |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.3 Optimization Mechanics

**Step 1: Message Accumulation**
```javascript
// Each message added to cache
conversationCache.addMessage(profileId, {
  sender: 'user' | 'ai',
  text: message.content,
  cachedAt: Date.now()
});
```

**Step 2: Summarization Trigger (at 20 messages)**
```javascript
// Automatic trigger check
if (messages.length >= THRESHOLDS.messageCount) {
  // Non-blocking background summarization
  summarizationService.triggerSummarization(
    conversationId, profileId, messages
  );
}
```

**Step 3: Build Optimized Payload**
```javascript
const payload = await conversationCache.buildOptimizedPayload(
  profileId, conversationId
);

// Result:
{
  storySoFar: "User discussed career anxiety...", // ~500 tokens
  recentMessages: [...last10Messages],             // ~2000 tokens
  hasContext: true,
  messagesTruncated: 40,
  metrics: {
    fullPayloadTokens: 50000,
    optimizedTokens: 2500,
    tokensSaved: 47500,
    reductionPercent: 95
  }
}
```

### 5.4 Token Estimation

```javascript
// Simple but effective estimation
estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// For message arrays
estimateMessagesTokens(messages) {
  return messages.reduce((sum, msg) =>
    sum + this.estimateTokens(msg.content), 0);
}
```

### 5.5 Optimization Metrics

The system tracks and logs:
```javascript
{
  totalMessagesProcessed: 150,
  tokensSavedTotal: 475000,
  apiCallsOptimized: 10,
  averageTokensSaved: 47500,
  cachedProfiles: 3,
  storyCacheSize: 3
}
```

---

## 6. Front-End Processing

### 6.1 Message Flow

```
USER INPUT
    |
    v
+-------------------+
| AISoulPartnerChat |  (React Component)
+-------------------+
    |
    | 1. Build optimized payload
    v
+-------------------+
| conversationCache |
| .buildOptimized   |
| Payload()         |
+-------------------+
    |
    | 2. Get memory context
    v
+-------------------+
| memoryService     |
| .getDualBrain     |
| Context()         |
+-------------------+
    |
    | 3. Call AI API with optimized context
    v
+-------------------+
| aiSoulPartner     |
| Service.send      |
| Message()         |
+-------------------+
    |
    | 4. Process response & update caches
    v
+-------------------+
| - Add to cache    |
| - Schedule reflect|
| - Update UI       |
+-------------------+
```

### 6.2 Component Integration

**AISoulPartnerChat.jsx:**
```javascript
const handleSendMessage = async (message) => {
  // 1. Build optimized payload
  const optimizedPayload = await conversationCache.buildOptimizedPayload(
    profileId, conversationId
  );

  // 2. Get memory context
  const memoryContext = await memoryService.getDualBrainContext(
    userId, profileId, sessionId, message
  );

  // 3. Build conversation history with context
  const history = payloadToConversationHistory(optimizedPayload);

  // 4. Send to AI
  const response = await aiSoulPartnerService.sendMessage({
    message,
    history,
    memoryContext: memoryService.buildDualBrainPrompt(memoryContext),
    profileData: selectedProfile
  });

  // 5. Post-processing
  await conversationCache.processExchange(
    profileId, conversationId,
    { text: message },
    { text: response }
  );

  memoryService.scheduleReflection(
    userId, profileId, sessionId, message, response
  );
};
```

### 6.3 Parallel Operations

The system maximizes performance through parallel operations:

```javascript
// Dual-brain context retrieval (all in parallel)
const [
  lifeMemories,        // User's brain - life timeline
  sessionBuffer,       // User's brain - current session
  observations,        // SoulPartner's brain - observations
  patterns,            // SoulPartner's brain - patterns
  facts,               // Shared - permanent facts
  people,              // Shared - relationship graph
  happinessAnchors     // Shared - joy network
] = await Promise.all([
  searchLifeTimeline(userId, profileId, query),
  getSessionBuffer(userId, profileId, sessionId),
  getKeyObservations(userId, profileId),
  getPatterns(userId, profileId),
  getFacts(userId, profileId),
  getPeople(userId, profileId),
  moodIsLow ? getHappinessAnchors(userId, profileId) : []
]);
```

---

## 7. Data Flow Diagrams

### 7.1 Complete Message Flow

```
+------------------------------------------------------------------------+
|                         COMPLETE MESSAGE FLOW                            |
+------------------------------------------------------------------------+

User Types Message
       |
       v
+------------------+
| ConversationCache|---> Check: Summarization needed?
| addMessage()     |          |
+------------------+          v
       |              Yes: Background summarize
       |                    |
       v                    v
+------------------+  +------------------+
| buildOptimized   |  | summarization    |
| Payload()        |  | Service          |
+------------------+  | .trigger()       |
       |              +------------------+
       v
+------------------+
| memoryService    |
| .getDualBrain    |---> Parallel retrieval from 4 memory banks
| Context()        |          |
+------------------+          v
       |              +----------------------------------+
       |              | life_timeline | session_buffer  |
       |              | observations  | patterns        |
       |              | facts | people | anchors        |
       |              +----------------------------------+
       v
+------------------+
| buildDualBrain   |---> Format for system prompt injection
| Prompt()         |
+------------------+
       |
       v
+------------------+
| AI Service       |---> Send: Story + Recent + Memory Context + Message
| sendMessage()    |
+------------------+
       |
       v
+------------------+
| Process Response |
+------------------+
       |
       +---> conversationCache.processExchange()
       |          |
       |          v
       |     Update caches, check summarization
       |
       +---> memoryService.scheduleReflection()
       |          |
       |          v
       |     Queue for reflection (every 10 messages)
       |
       +---> memoryService.bufferUserInput() [non-blocking]
       |          |
       |          v
       |     Store in session_buffer
       |
       v
+------------------+
| Update UI        |
+------------------+
```

### 7.2 Nightly Consolidation Flow

```
+------------------------------------------------------------------------+
|                    NIGHTLY CONSOLIDATION (3 AM UTC)                      |
+------------------------------------------------------------------------+

nightlyConsolidation()
       |
       v
For Each User/Profile:
       |
       +---> 1. CONSOLIDATE SESSION BUFFER
       |         |
       |         v
       |    +---------------------------+
       |    | Get unconsolidated entries|
       |    | Group by session          |
       |    | Gemini: Extract important |
       |    | Generate embeddings       |
       |    | Store in life_timeline    |
       |    | Mark as consolidated      |
       |    +---------------------------+
       |
       +---> 2. PROMOTE OBSERVATIONS
       |         |
       |         v
       |    +---------------------------+
       |    | Get unpromoted observations|
       |    | Gemini: Synthesize insights|
       |    | Merge similar (+ confidence)|
       |    | Store in interaction_timeline|
       |    | Mark as promoted           |
       |    +---------------------------+
       |
       +---> 3. DETECT PATTERNS
       |         |
       |         v
       |    +---------------------------+
       |    | Get recent observations    |
       |    | Gemini: Detect patterns    |
       |    | Create or update patterns  |
       |    +---------------------------+
       |
       +---> 4. APPLY DECAY
       |         |
       |         v
       |    +---------------------------+
       |    | Find old, unaccessed memories|
       |    | Reduce importance by 10%   |
       |    | Protect high-importance    |
       |    +---------------------------+
       |
       +---> 5. CLEANUP
                 |
                 v
            +---------------------------+
            | Delete consolidated entries|
            | (>7 days old)              |
            | Delete promoted observations|
            | (>7 days old)              |
            +---------------------------+
```

---

## 8. API Reference

### 8.1 Frontend Services

#### ConversationCache

```typescript
class ConversationCache {
  // Build optimized payload for API calls
  async buildOptimizedPayload(
    profileId: string,
    conversationId: string,
    options?: {
      recentCount?: number,
      includeStory?: boolean,
      forceRefresh?: boolean
    }
  ): Promise<{
    storySoFar: string | null,
    recentMessages: Message[],
    hasContext: boolean,
    messagesTruncated: number,
    metrics: OptimizationMetrics
  }>

  // Add message to cache
  addMessage(profileId: string, message: Message): void

  // Check if summarization needed
  shouldTriggerSummarization(profileId: string): boolean

  // Get optimization metrics
  getMetrics(): GlobalMetrics
}
```

#### MemoryService

```typescript
class MemoryService {
  // Main RAG entry point
  async getDualBrainContext(
    userId: string,
    profileId: string,
    sessionId: string,
    userMessage: string,
    options?: { moodIsLow?: boolean }
  ): Promise<DualBrainContext>

  // Build prompt for system injection
  buildDualBrainPrompt(context: DualBrainContext): string

  // Schedule background reflection
  scheduleReflection(
    userId: string,
    profileId: string,
    sessionId: string,
    userMessage: string,
    aiResponse: string
  ): void

  // Buffer user input
  async bufferUserInput(
    userId: string,
    profileId: string,
    sessionId: string,
    content: string,
    options?: { emotion?: string, messageIndex?: number }
  ): Promise<Result>
}
```

#### VoiceService

```typescript
class VoiceService {
  // Initialize the service
  async initialize(options: {
    profile?: Profile,
    memoryContext?: MemoryContext,
    onStateChange?: (state: VoiceState) => void,
    onTranscript?: (data: TranscriptData) => void,
    onError?: (error: VoiceError) => void,
    onVisualizerData?: (data: VisualizerData) => void
  }): Promise<void>

  // Start voice session
  async startSession(): Promise<boolean>

  // End voice session
  async endSession(): Promise<void>

  // Control methods
  setVolume(volume: number): void
  setMuted(muted: boolean): void
  getState(): VoiceState
  getAudioLevel(): number

  // Static
  static isSupported(): boolean
}
```

### 8.2 Cloud Functions

#### Memory Operations

```javascript
// Get full memory context
getMemoryContext({ userId, profileId, userMessage, options })

// Retrieve semantic memories
retrieveMemories({ userId, profileId, query, limit, recencyDays })

// Store/retrieve facts
storeFact({ userId, profileId, fact, category, confidence })
getFacts({ userId, profileId, limit, category })

// Manage people graph
upsertPerson({ userId, profileId, name, relationship, notes })
getPeople({ userId, profileId, names, limit })

// Happiness anchors
storeHappinessAnchor({ userId, profileId, memory, score, peakMoment })
getHappinessAnchors({ userId, profileId, limit })
```

#### Dual-Brain Operations

```javascript
// User's Brain
bufferUserInput({ userId, profileId, sessionId, content, emotion })
storeLifeMemory({ userId, profileId, content, chapter, importance })
searchLifeTimeline({ userId, profileId, query, chapter, limit })
getMemoriesByChapter({ userId, profileId, chapter, limit })

// SoulPartner's Brain
storeSessionObservation({ userId, profileId, sessionId, observation, type })
storeInteractionObservation({ userId, profileId, observation, pattern })
getKeyObservations({ userId, profileId, limit })
storePattern({ userId, profileId, pattern, category, confidence })
getPatterns({ userId, profileId, category, limit })

// Unified
getDualBrainContext({ userId, profileId, sessionId, userMessage, options })
```

#### Voice Operations

```javascript
getVoiceSession({ profileId, profileName, memoryContext })
// Returns: { websocketUrl, sessionId, systemInstruction, voiceConfig }

endVoiceSession({ sessionId, transcript, duration })
// Stores transcript and triggers memory extraction

storeVoiceMemory({ sessionId, transcript })
// Extracts facts, observations, people from voice conversation

getVoiceCapabilities()
// Returns: { supported, model, features, voiceOptions, limits }
```

---

## 9. Deployment Guide

### 9.1 Environment Variables

**`functions/.env`:**
```
GEMINI_API_KEY=your-gemini-api-key
```

### 9.2 Firestore Indexes

**Vector indexes (via gcloud CLI):**
```bash
# Life timeline memories
gcloud alpha firestore indexes composite create \
  --collection-group=memories \
  --query-scope=COLLECTION_GROUP \
  --field-config='field-path=embedding,vector-config={"dimension":"768","flat":"{}"}'

# SoulPartner observations
gcloud alpha firestore indexes composite create \
  --collection-group=observations \
  --query-scope=COLLECTION_GROUP \
  --field-config='field-path=embedding,vector-config={"dimension":"768","flat":"{}"}'
```

### 9.3 Deploy Commands

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function groups
firebase deploy --only functions:getVoiceSession,functions:endVoiceSession

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

### 9.4 Performance Targets

| Operation | Target | Implementation |
|-----------|--------|----------------|
| Memory retrieval | <100ms | Parallel queries + caching |
| Embedding generation | <50ms | Gemini text-embedding-004 |
| Vector search | <30ms | Firestore findNearest |
| Memory refinement | <100ms | Gemini Flash |
| **Total RAG pipeline** | **<300ms** | All above combined |
| Reflection | Background | Non-blocking |
| Summarization | Background | Non-blocking |

---

## Appendix A: Firestore Collection Structure

```
users/{userId}/
├── memory/{profileId}/
│   │
│   ├── user/                          # USER'S BRAIN
│   │   ├── session_buffer/            # SHORT-TERM
│   │   │   └── entries/{entryId}
│   │   │
│   │   └── life_timeline/             # LONG-TERM
│   │       └── memories/{memoryId}
│   │
│   ├── soulpartner/                   # SOULPARTNER'S BRAIN
│   │   ├── session_observations/      # SHORT-TERM
│   │   │   └── entries/{obsId}
│   │   │
│   │   ├── interaction_timeline/      # LONG-TERM
│   │   │   └── observations/{obsId}
│   │   │
│   │   └── patterns/                  # DETECTED PATTERNS
│   │       └── detected/{patternId}
│   │
│   ├── memories/                      # SHARED: Episodic memories
│   ├── facts/                         # SHARED: Permanent facts
│   ├── people/                        # SHARED: Relationship graph
│   └── happinessAnchors/              # SHARED: Joy network

voiceSessions/{sessionId}/             # Voice session tracking
conversations/{docId}/                 # Conversation history
system/consolidation                   # Consolidation status
```

---

## Appendix B: Key Code Locations

| Component | File Path |
|-----------|-----------|
| Conversation Cache | `src/services/conversationCache.js` |
| Summarization Service | `src/services/summarizationService.js` |
| Memory Service | `src/services/memoryService.js` |
| Voice Service | `src/services/voiceService.js` |
| Voice Chat Component | `src/components/voice/VoiceChat.jsx` |
| Luna Visualizer | `src/components/voice/LunaVisualizer.jsx` |
| Dual-Brain Functions | `functions/memory/dualBrainFunctions.js` |
| Sleep Consolidation | `functions/memory/sleepConsolidation.js` |
| Core Memory Functions | `functions/memory/memoryFunctions.js` |
| Gemini 3 Service | `src/services/gemini3Service.js` |
| Gemini 3 Config (Backend) | `functions/utils/gemini3Config.js` |
| ThinkingLevel Selector | `src/components/aiSoulPartner/ThinkingLevelSelector.jsx` |

---

## 10. Gemini 3 Migration Guide

### 10.1 Breaking Changes from Gemini 2.5

| Aspect | Gemini 2.5 | Gemini 3 |
|--------|-----------|----------|
| **Thinking Config** | `thinking_budget: 2048` | `thinkingLevel: 'medium'` |
| **Signatures** | Optional/auto-handled | **Mandatory for function calling** |
| **Validation** | Flexible | Strict (400 errors if missing) |
| **State Storage** | Store `text` only | Store entire `parts[]` with signatures |
| **Parallel Calls** | Signature in every call | Signature in FIRST call only |

### 10.2 Thinking Levels

Gemini 3 replaces `thinking_budget` with `thinkingLevel`:

| Level | Description | Use Case |
|-------|-------------|----------|
| `minimal` | Fastest responses | Quick facts, greetings, simple questions |
| `low` | Fast with basic reasoning | Casual conversation, straightforward advice |
| `medium` | Standard Luna thinking | Most conversations (recommended) |
| `high` | Deep analysis and reasoning | Life decisions, deep self-reflection, complex problems |

### 10.3 Thought Signatures (Critical)

**Why it matters:** Thought signatures are Luna's "short-term working memory". They:
- Maintain reasoning chain across turns
- Are **mandatory for function calling** (400 error if missing)
- Enable complex multi-step agentic tasks

**How to handle:**

```javascript
// 1. Response from Gemini 3 includes parts[]
const response = await sendMessage({ message, ... });

// 2. Store the full parts array and signature
const aiMessage = {
  sender: 'ai',
  text: response.text,
  parts: response.parts,              // STORE THIS
  thoughtSignature: response.thoughtSignature  // AND THIS
};

// 3. Next turn - parts[] are sent back automatically
// The gemini3Service handles this in buildGemini3History()
```

### 10.4 Updated Message Structure

**Old Structure (Gemini 2.5):**
```javascript
{
  sender: 'user' | 'ai',
  text: string,
  timestamp: string
}
```

**New Structure (Gemini 3-Ready):**
```javascript
{
  sender: 'user' | 'ai',
  text: string,                    // Main text (for display)
  parts: [                         // Full Gemini 3 parts array
    { thought: true, text: '...' }, // Thinking content (optional)
    { text: '...' },                // Main response
    { thoughtSignature: '...' }     // CRITICAL: Store for next turn
  ],
  thoughtSignature: string,        // Quick access to signature
  thinkingContent: string | null,  // Visible thinking (if enabled)
  gemini3: boolean,                // Flag for Gemini 3 format
  timestamp: string
}
```

### 10.5 Frontend Integration

**Using the ThinkingLevel Selector:**

```jsx
import { ThinkingLevelSelector } from './components/aiSoulPartner/ThinkingLevelSelector';
import { useState } from 'react';

function ChatComponent() {
  const [thinkingLevel, setThinkingLevel] = useState('medium');

  // Send message with thinking level
  const handleSend = async (message) => {
    const response = await sendMessage({
      message,
      thinkingLevel,  // 'minimal' | 'low' | 'medium' | 'high' | 'auto'
      includeThoughts: false,  // Set true to see Luna's reasoning
      // ... other params
    });

    // Store the response with Gemini 3 fields
    addMessage({
      sender: 'ai',
      text: response.text,
      parts: response.parts,  // IMPORTANT: Store for next turn
      thoughtSignature: response.thoughtSignature
    });
  };

  return (
    <>
      <ThinkingLevelSelector
        value={thinkingLevel}
        onChange={setThinkingLevel}
        compact={true}
        autoMode={true}
      />
      {/* Chat UI */}
    </>
  );
}
```

### 10.6 Backend Configuration

**Cloud Function setup:**

```javascript
const { getGemini3Model, formatGemini3Response } = require('./utils/gemini3Config');

// In your chat function
const model = getGemini3Model({
  thinkingLevel: req.body.gemini3Config?.thinkingLevel || 'medium',
  includeThoughts: req.body.gemini3Config?.includeThoughts || false,
  systemInstruction: lunaSystemPrompt
});

const chat = model.startChat({
  history: convertToGemini3History(req.body.conversationHistory)
});

const result = await chat.sendMessage(userMessage);
const response = formatGemini3Response(result.response);

// Return Gemini 3 data to client
return {
  response: response.text,
  parts: response.parts,
  thoughtSignature: response.thoughtSignature,
  thinkingContent: response.thinkingContent,
  gemini3: true
};
```

### 10.7 Migration Checklist

- [ ] Update message state to include `parts[]` and `thoughtSignature`
- [ ] Add `thinkingLevel` parameter to sendMessage calls
- [ ] Store `parts[]` from responses (not just `text`)
- [ ] Send stored `parts[]` back in conversation history
- [ ] Add ThinkingLevelSelector to chat UI (optional)
- [ ] Update Cloud Functions to use `gemini3Config.js`
- [ ] Test function calling with thought signatures

### 10.8 Files Added/Modified for Gemini 3

| File | Purpose |
|------|---------|
| `src/services/gemini3Service.js` | Frontend Gemini 3 utilities |
| `functions/utils/gemini3Config.js` | Backend Gemini 3 utilities |
| `src/components/aiSoulPartner/ThinkingLevelSelector.jsx` | UI component for thinking level |
| `src/services/aiSoulPartnerService.js` | Updated with Gemini 3 support |

---

## 11. Advanced Voice Features

### 11.1 Overview

Advanced Voice Features take Luna beyond basic chatbot interactions, making her feel more human and responsive. These features are part of GENESIS Phase 4.

```
+------------------------------------------------------------------+
|                    ADVANCED VOICE FEATURES                         |
+------------------------------------------------------------------+
|                                                                    |
|   +------------------+     +------------------+                    |
|   | PROACTIVE AUDIO  |     | ENERGY SYSTEM    |                   |
|   | Beyond VAD       |     | "Luna is Tired"  |                   |
|   | Smart detection  |     | State awareness  |                   |
|   +------------------+     +------------------+                    |
|            |                        |                              |
|            v                        v                              |
|   +--------------------------------------------------+            |
|   |              INTEGRATED BEHAVIOR                   |            |
|   |  - Auto-downgrade thinking when tired             |            |
|   |  - Personality modifiers based on energy          |            |
|   |  - Graceful degradation instead of failure        |            |
|   +--------------------------------------------------+            |
|                                                                    |
+------------------------------------------------------------------+
```

### 11.2 Proactive Audio

Proactive Audio goes beyond basic Voice Activity Detection (VAD) to provide more natural conversations.

**What basic VAD does:**
- Detects when someone is speaking
- Starts/stops recording based on audio levels

**What Proactive Audio adds:**
- Distinguishes direct queries aimed at Luna vs. background noise
- Recognizes affirmative cues ("yes", "uh-huh") vs. questions
- Understands when user is still thinking vs. finished speaking
- Adjusts sensitivity based on context

**Configuration:**

```javascript
const PROACTIVE_AUDIO_CONFIG = {
  automaticActivityDetection: {
    disabled: false,
    startOfSpeechSensitivity: 'MEDIUM',  // LOW, MEDIUM, HIGH
    endOfSpeechSensitivity: 'MEDIUM',
    prefixPaddingMs: 300
  },
  voiceActivityDetection: {
    threshold: 0.3,
    silenceTimeoutMs: 1500,
    minSpeechDurationMs: 200
  }
};
```

### 11.3 Energy Management System

Luna's energy system makes her feel more human by adjusting behavior based on usage.

**Energy States:**

| State | Range | Behavior |
|-------|-------|----------|
| Full | 80-100 | Deep thinking available, proactive suggestions |
| Rested | 60-79 | Normal operation |
| Normal | 40-59 | Standard mode |
| Tired | 20-39 | Reduced thinking, shorter responses |
| Exhausted | 0-19 | Minimal mode, graceful degradation |

**Energy Costs:**

| Operation | Cost |
|-----------|------|
| Text message | 2 |
| Voice session | 5 |
| Deep thinking (high) | 8 |
| Image generation | 10 |
| Web search | 3 |
| Memory retrieval | 1 |

**Energy Regeneration:**

| Source | Gain |
|--------|------|
| Positive reaction (❤️, 🔥) | 3-5 |
| 30 min inactive | 10 |
| Each hour inactive | 5 |
| Sleep consolidation (3am) | 100 |

### 11.4 Personality Modifiers

When Luna's energy is low, her personality subtly changes:

```javascript
const ENERGY_PERSONALITY = {
  full: {
    modifier: '',
    icon: '✨',
    description: 'Luna is bright-eyed and fully engaged'
  },
  tired: {
    modifier: "[Luna stifles a small yawn] ",
    icon: '😴',
    description: 'Luna is getting sleepy'
  },
  exhausted: {
    modifier: "[Luna is leaning back, looking a bit drowsy] ",
    icon: '💤',
    description: 'Luna needs rest'
  }
};
```

### 11.5 Energy-Aware Thinking Level

The thinking level auto-adjusts based on Luna's energy:

```javascript
getRecommendedThinkingLevel() {
  switch (this.getState()) {
    case 'full':    return 'high';    // Deep analysis available
    case 'rested':  return 'medium';  // Normal operation
    case 'normal':  return 'medium';  // Standard mode
    case 'tired':   return 'low';     // Conserve energy
    case 'exhausted': return 'minimal'; // Survival mode
  }
}
```

### 11.6 Frontend Integration

**Using Energy-Aware Messages:**

```jsx
import {
  lunaEnergyService,
  ENERGY_STATES,
  sendMessage
} from './services/aiSoulPartnerService';

// Get current energy status
const status = lunaEnergyService.getStatus();
console.log(`Luna's energy: ${status.percent}% (${status.state})`);

// Send message - automatically energy-aware when thinkingLevel='auto'
const response = await sendMessage({
  message: userInput,
  thinkingLevel: 'auto',  // Will adjust based on energy
  // ... other params
});

// Check if thinking was downgraded
if (response.energyStatus?.wasDowngraded) {
  console.log('Thinking level was reduced due to low energy');
}

// Show energy icon in UI
<span>{response.energyStatus?.state === 'tired' ? '😴' : '✨'}</span>
```

**Tracking User Reactions:**

```jsx
// When user likes/loves a message, Luna gains energy
const handleReaction = (emoji) => {
  lunaEnergyService.recordPositiveReaction(emoji);
};
```

### 11.7 Voice Session Integration

Voice sessions are also energy-aware:

```javascript
// When starting a voice session
const session = await getVoiceSession({
  profileId,
  profileName,
  memoryContext,
  energyLevel: lunaEnergyService.getEnergy()  // Pass current energy
});

// Session returns energy-aware config
console.log(session.energyState);
// { level: 75, state: 'rested', proactiveEnabled: true }

// Voice config is adjusted based on energy
console.log(session.voiceConfig.speakingRate);  // Slower when tired
```

### 11.8 Native Multilingual Support

Gemini's native audio model handles multiple languages without translation layers:

- Automatic language detection
- Natural accent preservation
- Code-switching support (switching languages mid-sentence)
- Cultural context awareness

### 11.9 Files Added for Advanced Voice Features

| File | Purpose |
|------|---------|
| `src/services/lunaEnergyService.js` | Energy management service |
| `functions/voice/voiceFunctions.js` | Updated with Proactive Audio config |
| `src/services/aiSoulPartnerService.js` | Updated with energy-aware thinking |

### 11.10 Future Enhancements

- **Sleep Consolidation Energy Sync**: Sync energy state with Firestore during nightly consolidation
- **Energy Visualization Widget**: Show Luna's energy level in the UI
- **Adaptive Break Suggestions**: Luna suggests taking breaks when exhausted
- **User Preference Learning**: Learn user's preferred energy levels

---

## 12. Focus Mode

### 12.1 Overview

Focus Mode transforms Luna from a chatty companion into a laser-focused productivity partner. It bridges Luna's "Brain" (Gemini 3 thinking levels) with her "Vibe" (UI Design).

```
+------------------------------------------------------------------+
|                         FOCUS MODE                                 |
+------------------------------------------------------------------+
|                                                                    |
|   +------------------+     +------------------+                    |
|   |    BRAIN         |     |     VIBE         |                   |
|   | thinkingLevel    |     | Zen Ring Visual  |                   |
|   | System Prompt    |     | Color & Glow     |                   |
|   +------------------+     +------------------+                    |
|            |                        |                              |
|            v                        v                              |
|   +--------------------------------------------------+            |
|   |              FOCUS MODE LEVELS                     |            |
|   |  OFF    → Cyan Waveform   → Chatty & Playful     |            |
|   |  LIGHT  → Purple Breathe  → Efficient & Warm     |            |
|   |  DEEP   → Violet Zen Ring → Concise & Focused    |            |
|   |  ZEN    → Gold Zen Ring   → Minimal & Proactive  |            |
|   +--------------------------------------------------+            |
|                                                                    |
+------------------------------------------------------------------+
```

### 12.2 Focus Mode Levels

| Level | Thinking | Visual | Behavior |
|-------|----------|--------|----------|
| **OFF** | auto | Cyan waveform | Normal chatty Luna |
| **LIGHT** | medium | Purple breathing | Efficient but warm |
| **DEEP** | high | Violet zen ring | Concise, bullet points |
| **ZEN** | high | Gold zen ring | Ultra-minimal, proactive only |

### 12.3 Energy Requirements

Focus Mode uses more energy because it forces higher thinking levels:

| Mode | Min Energy | Cost Multiplier |
|------|------------|-----------------|
| Light | 30% | 1.2x |
| Deep | 50% | 1.5x |
| Zen | 60% | 1.8x |

**Auto-Exit:** When energy drops below 20%, Focus Mode auto-exits to protect Luna.

### 12.4 System Prompts by Mode

```javascript
FOCUS_SYSTEM_PROMPTS = {
  off: '',  // Normal Luna

  light: `## Focus Mode: Light
You are Luna in Light Focus Mode. Be helpful and efficient while maintaining warmth.
- Keep responses concise but friendly
- Prioritize actionable information`,

  deep: `## Focus Mode: Deep
You are Luna in Deep Focus Mode. Be concise, objective, and laser-focused.
- Use bullet points and structured responses
- Minimize pleasantries - get to the point`,

  zen: `## Focus Mode: Zen
You are Luna in Zen Focus Mode. Maximum productivity, minimum noise.
- Respond ONLY when directly addressed
- Ultra-concise responses (1-2 sentences max)`
};
```

### 12.5 Visual Design: The Zen Ring

The Zen Ring replaces the active waveform during Focus Mode:

```css
.zen-ring {
  width: 100px;
  height: 100px;
  border: 4px solid #8a2be2;
  border-radius: 50%;
  box-shadow: 0 0 15px #8a2be2;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 1; }
}
```

### 12.6 Frontend Integration

**Toggle Focus Mode:**

```jsx
import { FocusModeButton, FocusModeWidget } from './components/aiSoulPartner/FocusModeToggle';
import { focusModeService, FOCUS_MODES } from './services/aiSoulPartnerService';

function ChatHeader() {
  const handleFocusChange = (result) => {
    if (result.success) {
      console.log(`Focus mode: ${result.mode}`);
    } else {
      alert(result.message);  // e.g., "Not enough energy"
    }
  };

  return (
    <div>
      <FocusModeButton mode={FOCUS_MODES.DEEP} onChange={handleFocusChange} />
      {/* Or use the full widget */}
      <FocusModeWidget showEnergy={true} />
    </div>
  );
}
```

**Using the Zen Ring Visualizer:**

```jsx
import { ZenRingVisualizer } from './components/voice/ZenRingVisualizer';

function VoiceChat() {
  const focusMode = focusModeService.getMode();
  const energyState = lunaEnergyService.getState();

  return (
    <ZenRingVisualizer
      focusMode={focusMode}
      energyState={energyState}
      energyLevel={lunaEnergyService.getEnergy()}
      isListening={isListening}
      isSpeaking={isSpeaking}
    />
  );
}
```

### 12.7 Automatic Integration

When Focus Mode is active, `sendMessage()` automatically:
1. Uses the focus mode's thinking level
2. Adds the focus system prompt to guidance
3. Tracks energy with the focus cost multiplier
4. Returns focus mode status in response

```javascript
const response = await sendMessage({
  message: userInput,
  thinkingLevel: 'auto',  // Focus mode overrides this
  // ... other params
});

// Response includes focus mode status
console.log(response.focusMode);
// { mode: 'deep', thinkingLevel: 'high', visuals: { color: '#8A2BE2', ... } }
```

### 12.8 Files Added for Focus Mode

| File | Purpose |
|------|---------|
| `src/services/focusModeService.js` | Focus mode state management |
| `src/components/voice/ZenRingVisualizer.jsx` | Visual component with animations |
| `src/components/aiSoulPartner/FocusModeToggle.jsx` | Toggle button and widget |
| `src/services/aiSoulPartnerService.js` | Updated with focus mode integration |

### 12.9 Why This is Leading Edge

By linking **Energy**, **Thinking Levels**, and **UI Visuals**, Luna becomes a **Stateful Agent**:

- She doesn't just change her words - she changes her **Cognitive Load** and **Visual Presence**
- Focus Mode is energy-aware - auto-exits when tired
- The Zen Ring visualization communicates state without words
- Users can feel Luna "shift gears" when entering Focus Mode

---

## 13. Focus Report (Debrief)

The Focus Report system generates a "debrief" card when Luna exits Focus Mode. This transforms invisible cognitive work into tangible, scannable achievements.

### 13.1 Design Philosophy

**Result-First Hierarchy:**
```
+------------------------------------------------------------------+
|  1. ACCOMPLISHMENT HEADER                                         |
|     Single bolded sentence summarizing the win                    |
|------------------------------------------------------------------+
|  2. LOGIC MAP                                                     |
|     3-step reasoning path from Thought Signatures                 |
|------------------------------------------------------------------+
|  3. RESOURCE VAULT                                                |
|     Links and references utilized                                 |
|------------------------------------------------------------------+
|  4. ENERGY DELTA                                                  |
|     Start energy → End energy (consumed)                          |
+------------------------------------------------------------------+
```

### 13.2 Report Types

| Type | Duration | Content |
|------|----------|---------|
| `quick` | < 1 minute | Minimal summary |
| `standard` | 1-5 minutes | Full report with logic map |
| `detailed` | > 5 minutes | Complete with raw thoughts |

### 13.3 Focus Report Service

**File:** `src/services/focusReportService.js`

```javascript
import { focusReportService, REPORT_TYPES, REPORT_STATUS } from './focusReportService';

// Session automatically starts when Focus Mode is entered
// Messages are buffered via aiSoulPartnerService

// Report is generated on Focus Mode exit
const exitResult = focusModeService.exitFocusMode('user', {
  userId: 'user123',
  profileId: 'profile456',
  saveReport: true
});

// Wait for report
const reportResult = await exitResult.reportPromise;
console.log(reportResult.report);
// {
//   accomplishment: { title: "Deep dive on BaZi calculations", topics: [...] },
//   logicMap: { steps: [...], depth: 5 },
//   resourceVault: { links: [...], memories: [...] },
//   energyDelta: { start: 80, end: 65, consumed: 15 },
//   stats: { messagesExchanged: 8, thoughtsProcessed: 12 },
//   nextSteps: [...]
// }
```

### 13.4 Glass Card UI Component

**File:** `src/components/aiSoulPartner/FocusReportCard.jsx`

The report displays as a glassmorphic card with:
- Frosted glass effect (backdrop blur)
- Neon border matching focus mode color
- Animated entrance
- Expandable sections

```jsx
import { FocusReportCard, FocusReportModal } from './FocusReportCard';

// Inline card
<FocusReportCard
  report={focusReport}
  onDismiss={() => setShowReport(false)}
  onSave={(report) => saveToMemory(report)}
/>

// Modal overlay
<FocusReportModal
  report={focusReport}
  isOpen={showReportModal}
  onClose={() => setShowReportModal(false)}
/>
```

### 13.5 Automatic Thought Buffering

During Focus Mode, `aiSoulPartnerService` automatically buffers:

1. **Thought Signatures** - Gemini 3's reasoning tokens for logic map
2. **Message Exchanges** - User/AI pairs with metadata
3. **Topics** - Extracted from conversation
4. **Decisions** - Key decision points logged

```javascript
// This happens automatically in sendMessage() when focus mode is active:
if (focusConfig.isActive && focusReportService.isSessionActive()) {
  focusReportService.addThought(data.thoughtSignature, data.thinkingContent);
  focusReportService.addMessage(message, data.response, {
    thinkingLevel: effectiveThinkingLevel,
    mode: data.mode,
    energyConsumed: energyResult.consumed
  });
}
```

### 13.6 Memory Integration

Reports are saved to the memory system with special tagging:

```javascript
// Saved as focus_report type
await memoryService.addMemory(userId, profileId, {
  type: 'focus_report',
  content: JSON.stringify({
    accomplishment: report.accomplishment,
    duration: report.duration,
    energyDelta: report.energyDelta,
    stats: report.stats
  }),
  metadata: {
    sessionId: report.sessionId,
    focusMode: report.focusMode,
    timestamp: report.timestamp
  }
});
```

This enables:
- Weekly review of focus sessions
- Pattern detection across sessions
- Productivity tracking over time

### 13.7 Visual Design

| Element | Style |
|---------|-------|
| Background | `rgba(26, 26, 26, 0.7)` with `blur(10px)` |
| Border | `2px solid` with focus mode color |
| Glow | `0 0 20px` with focus mode color at 30% |
| Sections | Collapsible with smooth transitions |
| Energy Bar | Gradient from green to red based on consumption |

### 13.8 Files Added for Focus Report

| File | Purpose |
|------|---------|
| `src/services/focusReportService.js` | Report generation and session tracking |
| `src/components/aiSoulPartner/FocusReportCard.jsx` | Glass card UI and modal |
| `src/services/focusModeService.js` | Updated to trigger reports on exit |
| `src/services/aiSoulPartnerService.js` | Updated to buffer thoughts/messages |

### 13.9 Data Flow

```
Focus Mode Enter
       │
       ▼
┌──────────────────┐
│ Report Session   │  ← focusReportService.startSession()
│ Started          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Messages Flow    │  ← sendMessage() buffers each exchange
│ Thoughts Buffer  │  ← Thought signatures collected
│ Topics Extract   │  ← Keywords detected
└────────┬─────────┘
         │
         ▼
Focus Mode Exit
         │
         ▼
┌──────────────────┐
│ Report Generated │  ← focusReportService.generateReport()
│ - Accomplishment │
│ - Logic Map      │
│ - Energy Delta   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save to Memory   │  ← memoryService.addMemory()
│ (focus_report)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Display Glass    │  ← FocusReportCard component
│ Card to User     │
└──────────────────┘
```

---

## 14. Adaptive Localization (Multilingual)

Luna supports 40+ languages with native multilingual reasoning through Gemini 3. This isn't translation - it's **Adaptive Localization**.

### 14.1 Design Philosophy

| Feature | Basic Translation | Luna's Adaptive Localization |
|---------|------------------|------------------------------|
| Logic | Text → Translate → Response | Native Multilingual Reasoning |
| Culture | Literal translation | Idiomatic & Cultural Nuance |
| Memory | Language-blind | Language-aware (Firestore) |
| Voice | One accent for all | Native accents for 40+ languages |

### 14.2 Language Service

**File:** `src/services/languageService.js`

```javascript
import { languageService, SUPPORTED_LANGUAGES } from './languageService';

// Automatic language detection
const detected = languageService.quickDetect("こんにちは");  // 'ja'

// Process detected language (with stability)
languageService.processDetectedLanguage('es', 0.9);

// Get current session language
const lang = languageService.getSessionLanguage();  // 'es'

// Get voice accent for current language
const accent = languageService.getVoiceAccent();  // 'es-ES'

// Save preference to Firestore
await languageService.savePreference(userId, 'fr');
```

### 14.3 Supported Languages

| Tier | Languages |
|------|-----------|
| **Tier 1 (Full)** | English, Spanish, French, German, Portuguese, Italian, Japanese, Korean, Chinese |
| **Tier 2 (Text+Voice)** | Russian, Arabic, Hindi, Dutch, Polish, Turkish, Vietnamese, Thai |
| **Tier 3 (Text)** | Swedish, Danish, Finnish, Norwegian, Greek, Hebrew, Czech, Ukrainian, Indonesian, Malay |

### 14.4 Language Detection Flow

```
User Message
     │
     ▼
┌─────────────────────┐
│ Quick Pattern Detect │  ← Non-Latin scripts detected immediately
│ (Cyrillic, CJK, etc) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Gemini 3 Detection   │  ← Native detection for Latin scripts
│ (confidence score)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Stability Check      │  ← Require 2/3 consistent detections
│ (avoid rapid switch) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Session Language     │  ← Update if stable
│ Updated              │
└─────────────────────┘
```

### 14.5 Memory Integration

Memories are tagged with language for smart retrieval:

```javascript
// When storing memories
await memoryService.storeMemory(userId, profileId, content, {
  languageCode: 'es',  // Auto-tagged from languageService
  languageName: 'Spanish'
});

// When retrieving memories
const memories = await memoryService.getMemoryContext(userId, profileId, message, {
  languageCode: ['es', 'en']  // Include Spanish + English memories
});
```

### 14.6 Voice Integration

Voice sessions receive language configuration:

```javascript
// Get voice session with language
const session = await getVoiceSession({
  profileId: 'abc123',
  energyLevel: 80,
  preferredLanguage: 'ja'  // Japanese
});

// Response includes:
// - voiceConfig with Japanese accent
// - systemInstruction with polyglot prompt
// - languageConfig for UI
```

### 14.7 Polyglot System Prompt

Added automatically to Luna's guidance:

```
## Multilingual Awareness (Polyglot Mode)
You are a polyglot companion who speaks 40+ languages natively.

CRITICAL RULES:
1. ALWAYS respond in the same language the user writes in
2. If the user switches languages mid-conversation, switch immediately
3. Maintain the SAME personality traits across all languages
4. Use culturally appropriate idioms and expressions, not literal translations
5. For greetings and emotional expressions, prefer the language's natural form

CURRENT SESSION LANGUAGE: Spanish (Español)
```

### 14.8 Cultural Context

Language-specific cultural guidance is added:

| Language | Cultural Note |
|----------|---------------|
| Japanese | Use appropriate keigo (敬語). Be mindful of uchi/soto dynamics. |
| Korean | Use appropriate speech levels. Consider age/status context. |
| Spanish | Use appropriate tú/usted forms. Consider regional variants. |
| German | Use appropriate du/Sie forms. German directness is expected. |
| French | Use appropriate tu/vous forms. Maintain French elegance. |

### 14.9 Files for Adaptive Localization

| File | Purpose |
|------|---------|
| `src/services/languageService.js` | Language detection, preferences, prompts |
| `src/services/memoryService.js` | Language-aware memory retrieval |
| `src/services/aiSoulPartnerService.js` | Language integration in chat |
| `functions/voice/voiceFunctions.js` | Multilingual voice configuration |

### 14.10 Response Includes Language Status

```javascript
const response = await sendMessage({ message: "Hola, ¿cómo estás?" });

console.log(response.languageStatus);
// {
//   sessionLanguage: 'es',
//   languageInfo: { code: 'es', name: 'Spanish', nativeName: 'Español' },
//   voiceAccent: 'es-ES'
// }
```

---

*"Every life is a story worth telling. Every soul deserves to be remembered."*

**Document Version:** 1.5
**Last Updated:** December 19, 2024
