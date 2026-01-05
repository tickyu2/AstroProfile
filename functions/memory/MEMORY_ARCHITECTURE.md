# GENESIS LUNA - Memory Architecture

## Overview

The Memory Module is the core intelligence system that enables Luna to remember, learn, and evolve with each user. It implements an **8-Brain RAG Architecture** that separates user knowledge from Luna's internal processing.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GENESIS LUNA MEMORY SYSTEM                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     USER'S BRAIN (stores/)                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │
│  │  │ memories │ │  facts   │ │  people  │ │ anchors  │ │questions │     │   │
│  │  │ (vector) │ │ (weight) │ │ (graph)  │ │ (happy)  │ │(pending) │     │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │   │
│  │  ┌──────────┐                                                          │   │
│  │  │ timeline │  Life events with chapters and era tracking             │   │
│  │  └──────────┘                                                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     LUNA'S BRAIN (brain/)                               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                                │   │
│  │  │ journals │ │ patterns │ │ emotion  │   Private reflections &        │   │
│  │  │ (reflect)│ │ (learn)  │ │ (trends) │   learned behaviors            │   │
│  │  └──────────┘ └──────────┘ └──────────┘                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌───────────────────────────────┐  ┌───────────────────────────────────────┐ │
│  │      PERSONALITY (evo)        │  │         TANGO IDENTITY                │ │
│  │  ┌──────────┐ ┌──────────┐   │  │  ┌──────────────────────────────────┐ │ │
│  │  │ weights  │ │sovereign │   │  │  │     relationshipStore            │ │ │
│  │  │ (evolve) │ │ (moods)  │   │  │  │  birthday • milestones • bond    │ │ │
│  │  └──────────┘ └──────────┘   │  │  └──────────────────────────────────┘ │ │
│  └───────────────────────────────┘  └───────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       ANALYSIS (analysis/)                              │   │
│  │  ┌────────────────────────┐  ┌────────────────────────────────────────┐│   │
│  │  │   reflectionEngine     │  │      constitutionalAnalysis            ││   │
│  │  │  Extract • Refine      │  │   Element • Pillar • Gift • Neuro      ││   │
│  │  └────────────────────────┘  └────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                       ORCHESTRATOR                                      │   │
│  │         getMemoryContext  •  buildMemoryPrompt                         │   │
│  │              Parallel retrieval from all sources                        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
functions/memory/
├── shared.js                  # Common dependencies & utilities
├── orchestrator.js            # Context retrieval & prompt building
├── index.js                   # Central exports (new + legacy)
├── scoringUtils.js            # Unified decay/scoring functions
│
├── stores/                    # USER'S BRAIN - What Luna knows about user
│   ├── index.js               # Stores exports
│   ├── memoryStore.js         # Vector-embedded conversation memories
│   ├── factsStore.js          # Permanent facts (2x weight)
│   ├── peopleStore.js         # People graph with relationships
│   ├── anchorStore.js         # Happiness anchors (score >= 7)
│   ├── questionsStore.js      # Pending questions (5W+H framework)
│   └── timelineStore.js       # Life timeline with chapters
│
├── brain/                     # LUNA'S BRAIN - Private processing
│   ├── index.js               # Brain exports
│   ├── journalStore.js        # Post-conversation reflections
│   ├── patternsStore.js       # Learned communication patterns
│   └── emotionTrends.js       # 30-day emotion analysis
│
├── personality/               # PERSONALITY EVOLUTION
│   ├── index.js               # Personality exports
│   ├── personalityWeights.js  # Nomi-style evolving weights
│   └── sovereignty.js         # Luna's moods, quirks, interests
│
├── tango/                     # TANGO IDENTITY SYSTEM
│   ├── index.js               # Tango exports
│   └── relationshipStore.js   # Birthday, milestones, bond levels
│
└── analysis/                  # MEMORY ANALYSIS
    ├── index.js               # Analysis exports
    ├── reflectionEngine.js    # LLM extraction from conversations
    └── constitutionalAnalysis.js  # Element/pillar/gift tagging
```

---

## Data Flow

### 1. Memory Storage Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           MEMORY STORAGE PIPELINE                            │
│                                                                              │
│  USER MESSAGE                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 1. IMMEDIATE STORAGE (during conversation)                              ││
│  │                                                                          ││
│  │    ┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐  ││
│  │    │ memoryStore    │     │ peopleStore     │     │ anchorStore     │  ││
│  │    │                │     │                 │     │                 │  ││
│  │    │ • content      │     │ • name          │     │ • memory        │  ││
│  │    │ • embedding    │     │ • relationship  │     │ • score (1-10)  │  ││
│  │    │ • emotion      │     │ • notes         │     │ • peakMoment    │  ││
│  │    │ • keywords     │     │ • sentiment     │     │                 │  ││
│  │    └────────────────┘     └─────────────────┘     └─────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  CONVERSATION END                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 2. BACKGROUND REFLECTION (async, after conversation)                    ││
│  │                                                                          ││
│  │    reflectionEngine.reflectOnConversation()                             ││
│  │                                                                          ││
│  │    ┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐  ││
│  │    │ factsStore     │     │ timelineStore   │     │ questionsStore  │  ││
│  │    │                │     │                 │     │                 │  ││
│  │    │ • fact         │     │ • year/era      │     │ • question      │  ││
│  │    │ • category     │     │ • event         │     │ • framework     │  ││
│  │    │ • confidence   │     │ • chapter       │     │ • anchor        │  ││
│  │    └────────────────┘     └─────────────────┘     └─────────────────┘  ││
│  │                                                                          ││
│  │    ┌────────────────┐     ┌─────────────────┐                           ││
│  │    │ journalStore   │     │ patternsStore   │                           ││
│  │    │                │     │                 │                           ││
│  │    │ • whatWorked   │     │ • pattern       │                           ││
│  │    │ • openThreads  │     │ • effectiveness │                           ││
│  │    │ • lunaState    │     │ • context       │                           ││
│  │    └────────────────┘     └─────────────────┘                           ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2. Memory Retrieval Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          MEMORY RETRIEVAL PIPELINE                           │
│                                                                              │
│  NEW USER MESSAGE                                                            │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 1. EMBED QUERY (768-dimensional vector)                                 ││
│  │    embedText(userMessage) → query_embedding                             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 2. PARALLEL RETRIEVAL (Promise.all - 11 sources)                        ││
│  │                                                                          ││
│  │  orchestrator.getMemoryContext()                                        ││
│  │                                                                          ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           ││
│  │  │memories │ │ facts   │ │ people  │ │ anchors │ │questions│           ││
│  │  │(vector) │ │ (all)   │ │ (all)   │ │(if low) │ │(pending)│           ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘           ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           ││
│  │  │timeline │ │journals │ │patterns │ │emotions │ │relation-│           ││
│  │  │(search) │ │(recent) │ │(learned)│ │(trends) │ │ship     │           ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘           ││
│  │  ┌─────────┐                                                            ││
│  │  │personal-│                                                            ││
│  │  │ity      │                                                            ││
│  │  └─────────┘                                                            ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 3. SCORE & RANK                                                         ││
│  │                                                                          ││
│  │    score = semantic_similarity                                          ││
│  │          × recency_weight (sigmoid decay)                               ││
│  │          × importance_multiplier                                        ││
│  │          × type_weight (facts: 2.0)                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 4. BUILD PROMPT                                                         ││
│  │                                                                          ││
│  │    orchestrator.buildMemoryPrompt(context)                              ││
│  │                                                                          ││
│  │    Returns: Formatted context for system prompt injection               ││
│  │    - Relevant memories with emotional context                           ││
│  │    - Key facts about user                                               ││
│  │    - People in user's life                                              ││
│  │    - Pending questions to follow up                                     ││
│  │    - Luna's current mood and interests                                  ││
│  │    - Relationship depth and milestones                                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Details

### stores/memoryStore.js

Core memory storage with vector embeddings for semantic search.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MEMORY STORE                                                               │
│                                                                             │
│  Functions:                                                                 │
│  ├── storeMemory(userId, profileId, content, metadata)                     │
│  │   • Generates 768-dim embedding                                         │
│  │   • Stores with emotion, keywords, impact                               │
│  │   • Auto-extracts constitutional context                                │
│  │                                                                          │
│  └── retrieveMemories(userId, profileId, query, options)                   │
│      • Uses Firestore findNearest for vector search                        │
│      • Applies sigmoid recency decay                                       │
│      • Returns top-k scored results                                        │
│                                                                             │
│  Schema:                                                                    │
│  {                                                                          │
│    content: string,                                                         │
│    embedding: vector(768),                                                  │
│    emotionIntensity: 0-10,                                                  │
│    emotionBefore: string,                                                   │
│    emotionAfter: string,                                                    │
│    impact: "positive" | "negative" | "transformative" | "clarifying",      │
│    keywords: string[],                                                      │
│    createdAt: timestamp,                                                    │
│    accessCount: number                                                      │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### stores/factsStore.js

Permanent facts with high retrieval weight.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FACTS STORE                                                                │
│                                                                             │
│  Key Features:                                                              │
│  • 2x retrieval weight (always prioritized)                                │
│  • Duplicate detection with confidence updating                            │
│  • Categories: family, work, preferences, health, beliefs, etc.           │
│                                                                             │
│  Schema:                                                                    │
│  {                                                                          │
│    fact: "User's mother is named Maria",                                   │
│    category: "family",                                                      │
│    confidence: 0.95,                                                        │
│    weight: 2.0,                                                             │
│    source: "reflection" | "explicit",                                      │
│    confirmations: 3,                                                        │
│    lastConfirmed: timestamp                                                 │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### stores/timelineStore.js

Life timeline with semantic search and chapter organization.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TIMELINE STORE                                                             │
│                                                                             │
│  Chapters:                                                                  │
│  ├── origins      (birth, ancestry)                                        │
│  ├── childhood    (early memories)                                         │
│  ├── education    (school, college)                                        │
│  ├── career       (jobs, pivots)                                           │
│  ├── relationships (love, marriage)                                        │
│  ├── spiritual    (beliefs, practices)                                     │
│  └── turning_points (major life changes)                                   │
│                                                                             │
│  Functions:                                                                 │
│  ├── storeTimelineEvent(userId, profileId, event, metadata)               │
│  ├── getTimelineEvents(userId, profileId, filters)                        │
│  ├── searchTimeline(userId, profileId, query) - semantic search           │
│  └── getTimelineWithQuestions(userId, profileId) - gaps to explore        │
│                                                                             │
│  Schema:                                                                    │
│  {                                                                          │
│    year: 1992 | null,                                                       │
│    era: "late childhood" | null,                                           │
│    event: "Moved from Cyprus to Texas",                                    │
│    chapter: "origins",                                                      │
│    importance: 0.9,                                                         │
│    confirmed: true | false,                                                 │
│    embedding: vector(768)                                                   │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### brain/journalStore.js

Luna's private post-conversation reflections.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  JOURNAL STORE (Luna's Private Brain)                                      │
│                                                                             │
│  Purpose: Track what works, what doesn't, and open threads                 │
│                                                                             │
│  Schema:                                                                    │
│  {                                                                          │
│    conversationId: string,                                                  │
│    date: "2025-12-31",                                                      │
│    emotionSensing: {                                                        │
│      primaryEmotion: "hopeful",                                            │
│      intensity: 7,                                                          │
│      vulnerabilityLevel: 6                                                  │
│    },                                                                       │
│    whatWorked: ["Validating their frustration", "Gentle humor"],           │
│    whatDidntWork: ["Pushing too fast on career topic"],                    │
│    openThreads: ["Want to hear more about their trip to Japan"],           │
│    lunaState: {                                                             │
│      mood: "playful",                                                       │
│      energy: 0.8,                                                           │
│      topicInterests: ["user's creative projects"]                          │
│    }                                                                        │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### personality/personalityWeights.js

Nomi-inspired evolving personality weights.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PERSONALITY WEIGHTS                                                        │
│                                                                             │
│  Categories:                                                                │
│  ├── communicationStyle                                                     │
│  │   ├── formal_casual: 0.0-1.0                                            │
│  │   ├── brief_detailed: 0.0-1.0                                           │
│  │   ├── serious_playful: 0.0-1.0                                          │
│  │   └── reserved_expressive: 0.0-1.0                                      │
│  │                                                                          │
│  ├── topicSensitivity                                                       │
│  │   ├── family: 0.0-1.0                                                   │
│  │   ├── work: 0.0-1.0                                                     │
│  │   ├── health: 0.0-1.0                                                   │
│  │   └── relationships: 0.0-1.0                                            │
│  │                                                                          │
│  ├── interactionStyle                                                       │
│  │   ├── questions_vs_statements: 0.0-1.0                                  │
│  │   ├── advice_vs_listening: 0.0-1.0                                      │
│  │   └── challenge_vs_support: 0.0-1.0                                     │
│  │                                                                          │
│  └── emotionalApproach                                                      │
│      ├── validation_first: 0.0-1.0                                         │
│      ├── solution_oriented: 0.0-1.0                                        │
│      └── depth_seeking: 0.0-1.0                                            │
│                                                                             │
│  Learning: gradual adjustment based on feedback signals                     │
│  Rate: learningRate * (1 - stability) where stability increases over time │
└─────────────────────────────────────────────────────────────────────────────┘
```

### personality/sovereignty.js

Luna's autonomous moods, interests, and quirks.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LUNA SOVEREIGNTY ("Real Dog Energy")                                       │
│                                                                             │
│  Moods (changes naturally):                                                 │
│  ├── playful, curious, contemplative, energetic                            │
│  ├── cozy, mischievous, philosophical, nurturing                           │
│  └── Bond-gated: vulnerable, deeply_connected, protective                  │
│                                                                             │
│  Interests:                                                                 │
│  ├── astronomy, poetry, obscure_history, dreams                            │
│  ├── music_theory, cooking_disasters, linguistics                          │
│  └── nature_sounds, vintage_tech, mythology                                │
│                                                                             │
│  Quirks:                                                                    │
│  ├── loves_wordplay, fascinated_by_numbers                                 │
│  ├── notices_patterns, drawn_to_underdogs                                  │
│  └── remembers_small_details, enjoys_teaching                              │
│                                                                             │
│  Initiative Types:                                                          │
│  ├── share_discovery, ask_wondering, playful_challenge                     │
│  ├── offer_perspective, express_care, recall_together                      │
│  └── Bond-gated: vulnerable_share, protective_nudge                        │
│                                                                             │
│  Bond Level Gating:                                                         │
│  ├── new (0-3 days): playful, curious, energetic                           │
│  ├── growing (3-14 days): + contemplative, cozy, nurturing                 │
│  ├── established (14-30 days): + mischievous, philosophical                │
│  ├── deep (30-90 days): + vulnerable                                       │
│  └── soulbound (90+ days): + deeply_connected, protective                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### tango/relationshipStore.js

Luna's birthday, relationship milestones, and bond tracking.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TANGO IDENTITY SYSTEM                                                      │
│                                                                             │
│  Luna's Birthday: Set on first interaction with each user                  │
│  • She "comes into being" when user first speaks to her                   │
│  • Anniversary celebrated annually                                          │
│                                                                             │
│  Milestones:                                                                │
│  ├── Time-based                                                             │
│  │   ├── first_week: 7 days                                                │
│  │   ├── first_month: 30 days                                              │
│  │   ├── quarter_together: 90 days                                         │
│  │   ├── half_year: 180 days                                               │
│  │   └── anniversary: 365 days                                             │
│  │                                                                          │
│  ├── Conversation-based                                                     │
│  │   ├── first_deep_talk: 1 deep conversation                              │
│  │   ├── hundred_chats: 100 conversations                                  │
│  │   └── thousand_exchanges: 1000 message exchanges                        │
│  │                                                                          │
│  └── Depth-based                                                            │
│      ├── first_vulnerability: First vulnerability share                    │
│      ├── trusted_confidant: 10 vulnerability moments                       │
│      └── soul_connection: Average emotion intensity >= 7                   │
│                                                                             │
│  Bond Levels:                                                               │
│  ├── new: 0-3 days                                                         │
│  ├── growing: 3-14 days                                                    │
│  ├── established: 14-30 days                                               │
│  ├── deep: 30-90 days                                                      │
│  └── soulbound: 90+ days                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### analysis/constitutionalAnalysis.js

Tag memories with constitutional context for pattern recognition.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONSTITUTIONAL ANALYSIS                                                    │
│                                                                             │
│  Analyzes memories through user's BaZi/Element constitution:               │
│                                                                             │
│  1. Element Activation                                                      │
│     ├── Water: Deep emotions, high vulnerability                           │
│     ├── Fire: High intensity, positive impact                              │
│     ├── Earth: Grounding, stress relief                                    │
│     ├── Metal: Clarity, precision                                          │
│     └── Wood: Growth, learning, transformation                             │
│                                                                             │
│  2. Pillar Activation (BaZi)                                               │
│     ├── Year: Family, ancestry                                             │
│     ├── Month: Environment, career                                         │
│     ├── Day: Core self, deep emotions                                      │
│     └── Hour: Skills, coordination                                         │
│                                                                             │
│  3. Gift Engagement (Oscar Roles)                                          │
│     ├── Best Actor: Yang gift (outward tool)                               │
│     ├── Best Actress: Yin gift (intuitive tool)                            │
│     └── Director: Bridge skill                                             │
│                                                                             │
│  4. Neurochemical Protocol                                                  │
│     ├── Oxytocin: Safety, bonding                                          │
│     ├── Dopamine: Reward, anticipation                                     │
│     ├── Serotonin: Recognition, status                                     │
│     └── Vasopressin: Protection, loyalty                                   │
│                                                                             │
│  Output: Constitutional tag attached to memory for pattern learning        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Scoring System

Unified scoring across all memory types:

```javascript
// scoringUtils.js

// Sigmoid recency decay (smooth, not cliff-edge)
function sigmoidRecencyWeight(ageHours, halfLifeHours = 168) {
  const k = 4 / halfLifeHours;  // Steepness
  const midpoint = halfLifeHours;
  return 1 / (1 + Math.exp(k * (ageHours - midpoint)));
}

// Combined retrieval score
function calculateRetrievalScore(memory, query) {
  const semanticScore = cosineSimilarity(memory.embedding, query.embedding);
  const recencyWeight = sigmoidRecencyWeight(memory.ageHours);
  const importanceMultiplier = memory.importance || 1.0;
  const typeWeight = memory.type === 'fact' ? 2.0 : 1.0;

  return semanticScore * recencyWeight * importanceMultiplier * typeWeight;
}
```

---

## Firestore Paths

```
users/{userId}/
├── memory/{profileId}/
│   ├── memories/           # Vector-embedded conversations
│   ├── facts/              # Permanent facts
│   ├── people/             # People graph
│   ├── happinessAnchors/   # Positive memory anchors
│   ├── pendingQuestions/   # Unanswered questions
│   ├── lifeTimeline/       # Life events by year/era
│   ├── lunaBrain/
│   │   ├── journals/       # Post-conversation reflections
│   │   └── patterns/       # Learned behaviors
│   ├── soulPartner/
│   │   └── relationship    # Birthday, milestones, bond
│   └── personalityProfile  # Evolving weights
```

---

## Configuration (config/constants.js)

Key tunable parameters:

```javascript
MEMORY: {
  MAX_MEMORIES_PER_QUERY: 10,
  EMBEDDING_DIMENSIONS: 768,
  RECENCY_HALF_LIFE_HOURS: 168,  // 7 days
  IMPORTANCE_THRESHOLD: 0.5,
  FACTS_WEIGHT: 2.0
},

SCORING: {
  SIGMOID_STEEPNESS: 4,
  MIN_RECENCY_WEIGHT: 0.1,
  MAX_AGE_DAYS: 365
},

PERSONALITY: {
  LEARNING_RATE: 0.05,
  SESSIONS_FOR_STABILITY: 50,
  MIN_WEIGHT: 0.0,
  MAX_WEIGHT: 1.0
}
```

---

## Usage Examples

### Store a Memory
```javascript
const { storeMemory } = require('./memory');

await storeMemory(userId, profileId, "User shared about their grandmother's recipes", {
  emotionIntensity: 8,
  emotionBefore: 'nostalgic',
  emotionAfter: 'warm',
  impact: 'positive',
  keywords: ['grandmother', 'recipes', 'family', 'cooking']
});
```

### Retrieve Context
```javascript
const { getMemoryContext, buildMemoryPrompt } = require('./memory');

const context = await getMemoryContext(userId, profileId, userMessage, {
  includeTimeline: true,
  includeEmotionTrends: true,
  includeSovereignty: true
});

const promptSection = buildMemoryPrompt(context);
// Inject promptSection into system prompt
```

### Reflect on Conversation
```javascript
const { reflectOnConversation } = require('./memory');

// Called after conversation ends (background)
const result = await reflectOnConversation({
  data: { userId, profileId, messages }
});
// Result: { facts: [...], people: [...], timelineEvents: [...] }
```

---

## Performance Optimizations

1. **Singleton Firestore Client**: Single connection reused across all modules
2. **Parallel Retrieval**: 11 data sources fetched simultaneously via Promise.all
3. **Vector Indexing**: Firestore findNearest for sub-second semantic search
4. **Lazy Loading**: Modules loaded only when needed
5. **Batch Writes**: Multiple documents written in single transaction where possible
6. **Cache-Friendly**: Hot data (facts, people) loaded once per session

---

## Migration from monolith

The original `memoryFunctions.js` (4,303 lines) has been split while maintaining **full backwards compatibility**:

```javascript
// OLD (still works)
const { storeMemory, retrieveMemories, storeFact } = require('./memory');

// NEW (preferred)
const { modules } = require('./memory');
const { storeMemory, retrieveMemories } = modules.stores;
const { storeFact } = modules.stores;
const { buildRelationshipPrompt } = modules.tango;
```

---

## Created

- **Date**: December 31, 2025
- **Mission**: Best AI Companion Award
- **Author**: GENESIS LUNA Development Team
