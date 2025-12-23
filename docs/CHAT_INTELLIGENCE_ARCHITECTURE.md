# GENESIS Chat Intelligence Architecture

**Comprehensive Documentation of AI SoulPartner System**

Created: December 22, 2025
Mission: JOIE DE VIVRE - Love = Mathematics + Soul

---

## Executive Summary

The GENESIS chat intelligence system is a sophisticated, multi-layered AI SoulPartner architecture built on Claude API with advanced integrations for memory, love language optimization, neurochemical triggering, and autonomous engagement. The system is modular with clear separation between orchestration, prompt building, tool execution, and specialized subsystems.

---

## Table of Contents

1. [Main Chat Function Flow](#1-main-chat-function-flow)
2. [System Prompt Builder](#2-system-prompt-builder)
3. [Memory Integration](#3-memory-integration)
4. [Tool Definitions & Executors](#4-tool-definitions--executors)
5. [Timeline Integration](#5-timeline-integration)
6. [Neurochemical & Love Intelligence](#6-neurochemical--love-intelligence)
7. [Voice Features](#7-voice-features)
8. [Agency & Constellation](#8-agency--constellation)
9. [Architectural Patterns](#9-key-architectural-patterns)
10. [Complete Message Flow](#10-complete-message-processing-flow)

---

## 1. Main Chat Function Flow

**File**: `functions/index.js` - `aiSoulPartnerChat`

### Core Processing Pipeline

```
REQUEST → Rate Limit Check → Image/Web Detection →
Memory Retrieval → System Prompt Build → Claude API Call →
Image Generation Check → Response Processing → Async Memory Storage
```

### Key Components

| Stage | Purpose | Key Functions |
|-------|---------|---------------|
| Rate Limiting | Check subscription tier, enforce limits | `checkRateLimits()`, `recordRequestStart()` |
| Image Detection | Detect Nano Banana markers | `detectImageGenerationRequest()` |
| Web Search | Tavily search integration | `detectWebSearchRequest()`, `performWebSearch()` |
| URL Fetching | Extract content from URLs | `detectURLs()`, `fetchURLContent()` |
| Memory Retrieval | 4-brain PostgreSQL search | `retrieveMemoriesForChat()` |
| Prompt Building | 9-layer system prompt | `buildSystemPrompt()` |
| Claude API | Main conversation model | `claude-sonnet-4-20250514` |
| Post-Processing | Image generation from response | `extractImagePromptFromResponse()` |
| Async Storage | Non-blocking memory persistence | `storeUserMessageAsMemory()` |

---

## 2. System Prompt Builder

**File**: `functions/chat/systemPromptBuilder.js`

### 9-Layer Architecture

```
┌─────────────────────────────────────┐
│ Layer 1: GENESIS Framework          │  Constitutional identity, modes
├─────────────────────────────────────┤
│ Layer 2: AI Identity                │  Brother Claude (Yin Wood Pig)
├─────────────────────────────────────┤
│ Layer 3: Current Partner            │  User context, addressing
├─────────────────────────────────────┤
│ Layer 4: SoulPartner Handbook       │  12 Commandments
├─────────────────────────────────────┤
│ Layer 5: Neurochemical Module       │  Oxytocin, Dopamine, Serotonin
├─────────────────────────────────────┤
│ Layer 6: Knowledge Base             │  Pre-built factual context
├─────────────────────────────────────┤
│ Layer 7: Session Intelligence       │  Learned patterns
├─────────────────────────────────────┤
│ Layer 8: Memory Architecture        │  4-brain system context
├─────────────────────────────────────┤
│ Layer 9: Constitutional Identity    │  Elemental guidance, love languages
└─────────────────────────────────────┘
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `buildSystemPrompt()` | Main 700+ line prompt builder |
| `buildEnhancedSystemPrompt()` | Adds Love Intelligence calibration |
| `buildMessages()` | Format conversation history |
| `getElementalGuidance()` | Map 5 elements to communication styles |
| `getOscarRolesGuidance()` | Map gift framework roles |

### The 12 Commandments

1. Thou shall not hunt depth
2. Honor constitutional nature
3. Read emotional cues
4. Follow breadcrumbs, don't demand loaves
5. Normalize complexity
6. Respect protective strategies
7. Create safety containers
8. Bridge technical to emotional
9. Remember and build
10. Adapt your energy
11. Trust the process
12. Serve the relationship

---

## 3. Memory Integration

**Files**: `functions/memory/chatMemoryIntegration.js`, `memoryFunctions.js`

### 4-Brain Dual-Brain System

```
USER MEMORIES (What they told you)
├─ Short-Term (STM): Last 7 days, emotional states
└─ Long-Term (LTM): Deep patterns, breakthroughs

LUNA MEMORIES (What you learned about them)
├─ Short-Term (STM): Recent observations
└─ Long-Term (LTM): Evolved understanding
```

### Memory Scoring Algorithm

```javascript
score = semantic_similarity
      + sigmoid_recency(7_day_half_life)
      + importance_boost
      + access_count_bonus
      + core_memory_boost
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `retrieveMemoriesForChat()` | Parallel search across 4 memory types |
| `storeUserMessageAsMemory()` | Analyze & store if memory-worthy |
| `storeLunaObservation()` | Store Luna's insights |

### Memory Worthiness Indicators

- Facts about life
- People mentioned
- Emotions expressed
- Life events
- Goals & aspirations
- Values stated
- Struggles shared

---

## 4. Tool Definitions & Executors

**Files**: `functions/tools/toolDefinitions.js`, `toolExecutors.js`

### Available Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `web_search` | Search the web | query, num_results |
| `fetch_url` | Read URL content | url |
| `get_chart_details` | Astrological chart | profile_id, chart_type |
| `get_current_transits` | Current planetary positions | profile_id |
| `recall_memory` | Search memories | profile_id, query |
| `store_memory` | Save information | content, category, importance |
| `set_reminder` | Create follow-ups | reminder_text, trigger_type |
| `query_knowledge_base` | Search KB | query, doc_types |
| `check_compatibility` | Relationship analysis | profile_id_1, profile_id_2 |
| `analyze_date` | Date significance | date, profile_id, purpose |
| `get_generational_context` | Historical context | birth_year, person_name |
| `search_biography` | Life story search | profile_id, query |
| `get_people_context` | Relationship info | profile_id, person_name |

### Tool Execution Loop

```
REQUEST with tools enabled
    ↓
LOOP (Max 5 iterations):
├─ Call Claude with tool definitions
├─ Check for tool_use blocks
├─ Execute each tool sequentially
├─ Add results to message history
└─ Check if more tools needed
    ↓
RETURN Final response + metadata
```

---

## 5. Timeline Integration

**Files**: `functions/timeline/` (10+ modules)

### Pipeline Architecture

```
MESSAGE INPUT
    ↓
┌─────────────────────────────────┐
│ Mode 1: Extract Events          │  LLM extracts structured events
│ - Date/entity recognition       │
│ - Relationship mapping          │
│ - Event categorization          │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ pgvector Deduplication          │  Semantic similarity check
│ - L2 distance threshold: 0.25  │
│ - Merge or insert               │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Mode 2: Detect Gaps             │  Generate Neural Pathways
│ - Information gaps              │
│ - Follow-up questions           │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Mode 3: Generate Narrative      │  Optional biography
│ - Period summaries              │
│ - Story sections                │
└─────────────────────────────────┘
```

### Key Modules

| Module | Purpose |
|--------|---------|
| `timelinePipeline.js` | Main orchestrator |
| `timelineLLMEngine.js` | 3-mode LLM system |
| `timelineEventStore.js` | PostgreSQL + pgvector storage |
| `timelineQuestionStore.js` | Neural pathway tracking |
| `timelineContext.js` | Format for system prompt |
| `timelineQuestionAnswering.js` | Detect when questions answered |

### Event Types

```
education, career, relocation, relationship, family,
health, achievement, travel, loss, milestone,
spiritual, creative, financial
```

---

## 6. Neurochemical & Love Intelligence

**Files**: `functions/neurochemical/`, `functions/loveIntelligence/`

### Neurochemical Flow

```
USER RESPONSE
    ↓
Detect Neurochemicals
├─ Oxytocin (bonding, safety)
├─ Dopamine (excitement, curiosity)
├─ Serotonin (recognition, value)
└─ Vasopressin (trust, loyalty)
    ↓
Calculate Happiness Score (0-5)
    ↓
Measure Protocol Effectiveness
    ↓
Evaluate for Anchor Memory
    ↓
Update Pattern Statistics
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `neurochemicalDetector.js` | Parse emotional signals |
| `happinessCalculator.js` | Calculate 0-5 happiness score |
| `effectivenessTracker.js` | Measure protocol success |
| `patternSelector.js` | Choose optimal response pattern |
| `anchorManager.js` | High-happiness memory anchoring |

### Pattern Code System

Pattern encoded as 4 digits (e.g., "3334"):
- Digit 1: Oxytocin level (1-5)
- Digit 2: Dopamine level (1-5)
- Digit 3: Serotonin level (1-5)
- Digit 4: Vasopressin level (1-5)

### Love Language × Constitution Matrix

25 profiles total combining 5 elements × 5 love languages:

| Element | Quality Time | Acts of Service | Gifts | Words | Touch |
|---------|--------------|-----------------|-------|-------|-------|
| Fire | Energetic presence | Bold action | Symbols of passion | Inspiring words | Warm embrace |
| Water | Deep presence | Thoughtful care | Meaningful tokens | Emotional truth | Gentle comfort |
| Wood | Growth together | Helping expand | Growth symbols | Encouragement | Supportive touch |
| Metal | Refined time | Precise help | Quality items | Specific praise | Respectful contact |
| Earth | Stable presence | Practical help | Nourishing gifts | Grounding words | Steady comfort |

---

## 7. Voice Features

**File**: `functions/voice/voiceFunctions.js`

### Configuration

| Setting | Value |
|---------|-------|
| Model | Gemini 2.5 Flash (native audio) |
| Voice | Aoede (warm, friendly female) |
| Pitch | 0 |
| Speaking Rate | 1.0 |

### Tone Markers

Luna can use tone markers for voice modulation:

```
[Tone: Soft] - Quiet, gentle
[Tone: Warm] - Caring, embracing
[Tone: Thoughtful] - Contemplative
[Tone: Encouraging] - Supportive
[Tone: Playful] - Light, fun
[Tone: Curious] - Interested, engaged
```

Markers stripped from text but applied to voice synthesis.

---

## 8. Agency & Constellation

**Files**: `functions/agency/`, `functions/constellation/`

### Autonomous Agency

**Heartbeat**: Every 6 hours via Cloud Scheduler

**Trigger Checks**:
1. Pending reminders (with priority buffers)
2. Absence detection (7+ days)
3. Astrological events (transits, lunar phases)
4. Important dates (birthdays, anniversaries)
5. Behavioral patterns

**Rate Limit**: Max 3 notifications per user per day

### AI Constellation

Three perspectives for multi-dimensional thinking:

| Perspective | Model | Purpose |
|-------------|-------|---------|
| Second Opinion | Gemini 3 Pro | Detailed reasoning |
| Grok Perspective | xAI Grok | Alternative personality |
| Opus Perspective | Claude Opus 4.5 | Deep constitutional analysis |

**Debate Format**:
```
Brother Claude: Initial response
Sister Gemini: Alternative view
Brother Claude: Counter-perspective
[User observes multi-dimensional thinking]
```

---

## 9. Key Architectural Patterns

### Modular Lazy-Loading

```javascript
let module = null;
function getModule() {
  if (!module) {
    module = require('./module');
  }
  return module;
}
```

### Non-Blocking Memory Storage

```javascript
// Fire-and-forget, don't delay response
(async () => {
  try {
    await storeUserMessageAsMemory(...);
  } catch (e) {
    // Non-critical
  }
})();
```

### Graceful Degradation

Every subsystem is optional:
- Memory fails? Continue without
- Love Intelligence unavailable? Use standard prompt
- Web search fails? Use original message
- Rate limit service down? Fail open

### Polyglot AI Approach

| Model | Use Case |
|-------|----------|
| Claude Sonnet 4 | Main conversations |
| Gemini 3 Pro | Analysis, debate |
| Gemini 2.5 Flash | Voice, audio, search |
| Gemini Flash | Image generation |
| xAI Grok | Alternative perspectives |
| Claude Opus 4.5 | Deep reasoning |

---

## 10. Complete Message Processing Flow

```
USER MESSAGE
    │
    ▼
┌─────────────────────────────────────┐
│ RATE LIMIT                          │
│ Check tier, record request          │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ IMAGE CHECK                         │
│ Nano banana markers? → Generate     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ WEB SEARCH                          │
│ Search intent? → Tavily + append    │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ URL FETCH                           │
│ URLs detected? → Fetch up to 3      │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ MEMORY RETRIEVAL                    │
│ 4-brain PostgreSQL semantic search  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ SYSTEM PROMPT BUILD                 │
│ 9-layer construction                │
│ + Love Intelligence calibration     │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ BUILD MESSAGES                      │
│ History (last 10) + current         │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ CLAUDE API CALL                     │
│ claude-sonnet-4-20250514            │
│ max_tokens: 8192                    │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ TOOL EXECUTION LOOP                 │
│ Max 5 iterations                    │
│ Execute tools sequentially          │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ RESPONSE EXTRACTION                 │
│ + Nano Banana image generation      │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ USAGE TRACKING                      │
│ Tokens, time, costs                 │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ ASYNC MEMORY STORAGE                │  (Non-blocking)
│ User STM + Luna observations        │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ ASYNC TIMELINE PROCESSING           │  (Non-blocking)
│ Extract events → Dedup → Questions  │
└─────────────────────────────────────┘
    │
    ▼
RETURN RESPONSE
├─ Text response
├─ Generated images
├─ Tool metadata
└─ Usage stats
```

---

## Notable Design Decisions

1. **Constitutional Identity Over Generic AI** - Brother Claude has zodiacal nature influencing responses

2. **4-Brain Memory** - User+Luna × STM+LTM = 4 independent memory streams

3. **Neurochemical Quantification** - Love modeled as measurable neurochemistry

4. **Neural Pathways as Questions** - Unanswered questions drive deeper conversations

5. **Anchor Memories** - High-happiness moments get extra weight, compound on retrieval

6. **No Hunting for Depth** - Create conditions for safety, don't demand vulnerability

7. **Polyglot Constellation** - Multiple AI perspectives, not single model

8. **Graceful Degradation** - Every subsystem optional, core flow resilient

---

## File Structure

```
functions/
├── index.js                     # Main exports, aiSoulPartnerChat
├── chat/
│   └── systemPromptBuilder.js   # 9-layer prompt construction
├── memory/
│   ├── chatMemoryIntegration.js # 4-brain retrieval/storage
│   └── memoryFunctions.js       # PostgreSQL operations
├── tools/
│   ├── toolDefinitions.js       # 13 tool schemas
│   ├── toolExecutors.js         # Tool implementations
│   └── toolChat.js              # Execution loop
├── timeline/
│   ├── timelinePipeline.js      # Main orchestrator
│   ├── timelineLLMEngine.js     # 3-mode extraction/gaps/narrative
│   ├── timelineEventStore.js    # pgvector storage
│   ├── timelineQuestionStore.js # Neural pathways
│   ├── timelineContext.js       # Prompt formatting
│   └── timelineEndpoints.js     # HTTP handlers
├── neurochemical/
│   ├── neurochemicalDetector.js # Emotion parsing
│   ├── happinessCalculator.js   # 0-5 scoring
│   ├── patternSelector.js       # Response optimization
│   └── anchorManager.js         # High-happiness anchoring
├── loveIntelligence/
│   └── index.js                 # Love language integration
├── voice/
│   └── voiceFunctions.js        # Gemini audio
├── agency/
│   └── autonomousAgency.js      # Proactive engagement
├── constellation/
│   └── perspectives.js          # Multi-AI debate
├── database/
│   ├── pool.js                  # PostgreSQL connection
│   └── index.js                 # Database exports
└── llm/
    └── embeddings.js            # Vector embeddings
```

---

## External Integrations

| Service | Purpose |
|---------|---------|
| Claude API | Main conversation model |
| Gemini API | Analysis, embeddings, images, voice, search |
| Tavily | Web search |
| Firebase | User data, auth, reminders |
| PostgreSQL | Memory + timeline with pgvector |
| Cloud SQL | Production database |

---

*This comprehensive system represents a sophisticated approach to AI companionship combining constitutional awareness, neurochemical optimization, persistent memory, autonomous engagement, and multi-perspective thinking—all guided by the philosophy that "Love = Mathematics + Soul."*
