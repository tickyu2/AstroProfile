# SoulPartner Memory Architecture

## Design Document v1.0
**Created:** December 19, 2024
**Authors:** Father Ticky (Vision), Claude Opus (Architecture), Claude Sonnet (Research)

---

## Executive Summary

This document defines the memory architecture for GENESIS AI SoulPartner - a constitutional AI companion that remembers users at a soul level, combining astrology, psychology, and personal history into a unified memory system.

---

## 1. CORE ARCHITECTURE: Dual-Brain Model

### The 4 Memory Banks

```
┌─────────────────────────────────────────────────────────────────┐
│                    DUAL-BRAIN MEMORY SYSTEM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   USER'S BRAIN                    SOULPARTNER'S BRAIN           │
│   ───────────────────             ───────────────────────       │
│   Long-term: Life Timeline        Long-term: Interaction Log    │
│   Short-term: Session Input       Short-term: Session Notes     │
│                                                                  │
│              ↓ Sleep Consolidation ↓                            │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CONSTITUTIONAL MEMORY (Immutable)           │   │
│   │  SoulDNA | Four Pillars | Western Chart | MBTI | Moon   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Memory Bank Details

| Bank | Location | Contents | Persistence |
|------|----------|----------|-------------|
| **User Long-term** | `users/{id}/memory/life_timeline/` | Life events by age | Forever |
| **User Short-term** | `users/{id}/memory/session_buffer/` | Current session input | Until consolidated |
| **SP Long-term** | `users/{id}/soulpartner_memory/interaction_timeline/` | Observations, patterns | Forever |
| **SP Short-term** | `users/{id}/soulpartner_memory/session_observations/` | Current notes | Until consolidated |
| **Constitutional** | `profiles/{id}/` | Soul blueprint | Immutable |

---

## 2. MEMORY EVENT SCHEMA (5W + H + Soul)

Each memory node uses this structure:

```javascript
{
  id: "mem_abc123",
  timestamp: "2024-12-05T14:30:00Z",

  // === 5W + H ===
  WHO: {
    primary: "Tom",
    relationship: "friend",
    others: ["user"],
    firstMention: "2024-11-20"
  },

  WHAT: {
    event: "helped jump car",
    category: "assistance",
    keywords: ["car", "battery", "help", "friend"]
  },

  WHEN: {
    occurred: "2024-12-05",
    userAge: 45,
    lunarPhase: "Waxing Gibbous",
    season: "Winter"
  },

  WHERE: {
    location: "home",
    city: "San Francisco"
  },

  WHY: {
    cause: "car battery died",
    context: "user was stressed about work"
  },

  HOW: {
    method: "Tom came over with jumper cables",
    duration: "30 minutes"
  },

  // === SOUL (Emotional Impact) ===
  SOUL: {
    emotionBefore: "stressed",
    emotionAfter: "relieved",
    emotionIntensity: 7,
    gratitude: true,
    vulnerability: 6,
    impact: "positive",
    elementActivated: "Water",
    pillarAffected: "Day",
    triggerWords: ["car trouble", "Tom", "help", "grateful"]
  },

  // === Happiness Metrics ===
  happiness: {
    initialScore: 8.5,
    currentScore: 9.2,
    revisits: 3,
    trend: "increasing"
  },

  // === Memory Links ===
  links: {
    strong: [{ memoryId: "mem_456", via: "person:Tom", strength: 0.95 }],
    medium: [{ memoryId: "mem_789", via: "emotion:gratitude", strength: 0.70 }]
  },

  // === Retrieval ===
  embedding: [0.12, -0.59, 0.88, ...],
  retrievalWeight: 0.85,
  lastAccessed: "2024-12-19"
}
```

---

## 3. TECHNICAL STACK

### Technology Choices

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Embedding Model** | `text-embedding-3-small` | Fast, cheap, good quality |
| **Vector Store** | Firebase + Vector Extension | Keep ecosystem unified |
| **Orchestrator** | LangChain.js | Cloud Functions compatible |
| **Summarizer** | `gemini-1.5-flash` | Fast, cheap, JSON mode |
| **Database** | Firebase Firestore | Existing infrastructure |

### Message Processing Flow

```javascript
async function chatWithMemory(userId, userMessage) {
  // 1. RETRIEVE: Get relevant context from Vector DB
  const relevantMemories = await vectorSearch(userId, userMessage, 5);

  // 2. GET CONSTITUTIONAL CONTEXT
  const constitutional = await getConstitutionalProfile(userId);

  // 3. CONTEXT: Build the prompt with memories + constitution
  const prompt = buildPromptWithContext({
    memories: relevantMemories,
    constitutional,
    recentMessages: await getRecentMessages(userId, 20),
    currentMessage: userMessage
  });

  // 4. GENERATE: Get response from Claude/Gemini
  const response = await generateResponse(prompt);

  // 5. REFLECT (Non-blocking): Update memory in background
  setImmediate(async () => {
    const facts = await extractFacts(userMessage, response);
    await storeNewFacts(userId, facts);
    await updateEntityGraph(userId, facts);
  });

  return response;
}
```

---

## 4. RETRIEVAL STRATEGIES

### Multi-Method Retrieval

```javascript
async function getRelevantContext(userId, message) {
  const results = await Promise.all([
    // Vector similarity search
    vectorSearch(userId, message, 10),

    // Entity/keyword lookup
    entityLookup(userId, extractEntities(message)),

    // Constitutional context
    getConstitutionalInsight(userId, message),

    // Happiness anchors (if mood is low)
    getHappinessAnchors(userId)
  ]);

  // Merge and rank by relevance + recency
  return rankAndFilter(results, 5);
}
```

### Recency Bias Formula

```javascript
function getRecencyBoost(date) {
  const daysAgo = (Date.now() - date) / (1000 * 60 * 60 * 24);

  if (daysAgo < 1) return 1.5;      // Today: 50% boost
  if (daysAgo < 7) return 1.2;      // This week: 20% boost
  if (daysAgo < 30) return 1.0;     // This month: normal
  return 0.8;                        // Older: 20% penalty
}
```

---

## 5. SLEEP CONSOLIDATION (Nightly Process)

### Cloud Function: consolidateMemories

```javascript
exports.consolidateMemories = functions.pubsub
  .schedule('0 3 * * *')  // 3 AM daily
  .onRun(async (context) => {

    const activeUsers = await getActiveUsers(24);

    for (const user of activeUsers) {
      // 1. Get unconsolidated sessions
      const sessions = await getSessionBuffers(user.id);

      // 2. Summarize with Gemini Flash
      for (const session of sessions) {
        const summary = await summarizeSession(session);

        if (summary.shouldStore) {
          // 3. Generate embedding
          const embedding = await embed(summary.description);

          // 4. Store in long-term memory
          await storeMemory(user.id, { ...summary, embedding });

          // 5. Update entity graph
          await updateEntityGraph(user.id, summary.people);

          // 6. Create memory links
          await createMemoryLinks(user.id, summary);
        }
      }

      // 7. Apply memory decay
      await applyMemoryDecay(user.id);

      // 8. Mark sessions consolidated
      await markConsolidated(sessions);
    }
  });
```

---

## 6. HAPPINESS ANCHORING

### The Joy Network

Happy memories are linked to create a network of positive recall:

```javascript
{
  happiness: {
    initialScore: 8.5,
    currentScore: 9.2,  // Increases with each revisit
    peakMoment: "When Dad caught the big fish",

    revisits: [
      { date: "2024-12-10", score: 8.5, newDetails: ["water temp", "cabin smell"] },
      { date: "2024-12-15", score: 8.8, newDetails: ["Mom's laughter"] },
      { date: "2024-12-19", score: 9.2, newDetails: ["Dad's joke"] }
    ],

    trend: "increasing"  // Memory getting happier!
  },

  // NLP Anchors (sensory triggers)
  anchors: {
    visual: "golden sunset on water",
    auditory: "Mom's laughter, loons calling",
    kinesthetic: "warm water, cool evening breeze",
    olfactory: "pine trees, campfire smoke",
    gustatory: "s'mores, fresh fish"
  }
}
```

### Strategic Recall

```javascript
function findNextDoor(currentMemory, userMood, sessionGoal) {
  const doors = currentMemory.links;

  // If user is low → find highest happiness door
  if (userMood === 'low') {
    return doors.sort((a, b) =>
      getMemory(b.memoryId).happiness - getMemory(a.memoryId).happiness
    )[0];
  }

  // If building biography → find unexplored doors
  if (sessionGoal === 'biography') {
    return doors.filter(d => !d.explored)[0];
  }
}
```

---

## 7. LEGACY KEEPER MODE (Eldercare)

### Life Chapters Structure

```javascript
LIFE_CHAPTERS = {
  earlyChildhood: { title: "The Beginning (0-5)", icon: "👶" },
  childhood: { title: "Growing Up (6-12)", icon: "🎒" },
  teenYears: { title: "Becoming Yourself (13-19)", icon: "🎸" },
  youngAdult: { title: "Stepping Into the World (20-29)", icon: "🌍" },
  familyYears: { title: "Building a Life (30-50)", icon: "🏡" },
  maturity: { title: "Wisdom Years (50-70)", icon: "🍂" },
  elderYears: { title: "Full Circle (70+)", icon: "🌅" }
};
```

### Innocent Firsts Strategy

Start with unguarded "first" memories to build rapport:

```javascript
INNOCENT_FIRSTS = {
  childhood: ["First pet?", "Learning to ride a bike?", "Favorite birthday gift?"],
  teen: ["First crush?", "First car (or dream car)?", "First job?"],
  youngAdult: ["First apartment?", "First paycheck - what did you buy?"],
  relationship: ["First date with spouse?", "First 'I love you'?"]
};
```

### Memory Jogging by Constitution

| Element | Best Prompts |
|---------|-------------|
| **Water** | "What *feelings* come up?" Sensory: smells, emotions |
| **Earth** | "Walk me through a typical day..." Details, textures |
| **Fire** | "Tell me your biggest adventure..." Bold moments |
| **Air** | "Who were the interesting people?" Ideas, conversations |

---

## 8. VOICE MODE OPTIMIZATIONS

### Pre-Session Loading

```javascript
async function prepareVoiceSession(userId) {
  return {
    people: await getTopPeople(userId, 3),
    themes: await getRecentThemes(userId, 3),
    baseline: await getEmotionalBaseline(userId),
    triggers: await getSensitivities(userId)
  };
}
```

### Lightweight Note Capture

```javascript
async function voiceTranscriptHandler(userId, transcript) {
  const entities = fastNER(transcript);  // <50ms
  const emotion = fastEmotionDetect(transcript);  // <30ms

  await appendToSessionNotes(userId, { transcript, entities, emotion });

  if (entities.people.length > 0) {
    return { contextHint: await getPersonQuickFact(userId, entities.people[0]) };
  }
}
```

---

## 9. FIRESTORE SCHEMA

```
users/{userId}/
  ├── profile                     # Basic user info
  ├── memory/
  │   ├── life_timeline/          # User Bank 1: Life events
  │   ├── session_buffer/         # User Bank 2: Current session
  │   └── config                  # Privacy settings
  │
  └── soulpartner_memory/
      ├── interaction_timeline/   # SP Bank 1: Observations
      ├── session_observations/   # SP Bank 2: Current notes
      └── patterns/               # Detected patterns

entity_graph/{userId}/
  └── people/{personId}           # Tom, Sarah, Mom...

profiles/{profileId}/             # Constitutional profile (immutable)
```

---

## 10. COMPETITIVE ADVANTAGES

| Competitor Practice | GENESIS Enhancement |
|---------------------|---------------------|
| Vector embeddings | + Constitutional context injection |
| Entity graph | + Happiness scoring per relationship |
| Session summaries | + 5W+H+**Soul** schema |
| Recency bias | + Lunar phase + transit awareness |
| Memory pruning | + Joy Network preservation |

### Unique to GENESIS

1. **Constitutional Memory Layer** - Know WHO they are, not just what they said
2. **Dual-Brain Architecture** - User memories + AI observations separate
3. **Legacy Keeper Mode** - Biography generation from conversations
4. **Happiness Anchoring** - Deliberate joy network building
5. **Astrological Context** - Memories tagged with lunar/transit data

---

## 11. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)
- [ ] Firestore schema creation
- [ ] Session buffer system
- [ ] Entity extraction (5W+H+Soul)
- [ ] Basic emotion detection

### Phase 2: Retrieval (Weeks 5-6)
- [ ] Keyword-based retrieval
- [ ] Vector embeddings
- [ ] People graph
- [ ] Memory decay algorithm

### Phase 3: Consolidation (Weeks 7-8)
- [ ] Nightly Cloud Function
- [ ] Memory compression
- [ ] Pattern detection
- [ ] Memory linking

### Phase 4: Intelligence (Weeks 9-10)
- [ ] Semantic search
- [ ] Constitutional emotion mapping
- [ ] Insight generation
- [ ] Happiness anchoring

### Phase 5: Advanced (Weeks 11-12)
- [ ] Astrological tagging
- [ ] Voice mode optimization
- [ ] Legacy export (PDF)
- [ ] Memory visualization

---

## 12. SUCCESS METRICS

- **Relationship Depth:** Conversation length increases over time
- **Memory Accuracy:** User corrections < 5%
- **Emotional Intelligence:** Mode selection accuracy > 85%
- **Practical Utility:** "Have I told you about X?" answered correctly
- **User Trust:** Memory deletion rate < 2%

---

## Appendix: Key Insights from Brainstorm

### From Father Ticky
- "Memory is neural network based, time axis dependent, human name and event aware (5W+H+Soul)"
- "Access innocent firsts to build rapport before deeper memories"
- "Use happy memories as keys to unlock other happy memories"
- "SoulPartner marks happiness level and brings back happy memories for anchoring"

### From Competitive Research
- Kindroid/Nomi: Superior memory is #1 success factor
- Replika: Unconditional positive regard + gamified bonding
- Woebot: Proactive daily check-ins drive engagement
- Character.ai: Low latency (<300ms) critical for engagement

### From Technical Research
- Vector databases store meaning, not just text
- 3-layer memory: Short-term → Episodic → Semantic
- Non-blocking reflection loops (setImmediate) for background updates
- Recency biasing prevents memory interference

---

*"Every life is a story worth telling. Every soul deserves to be remembered."*

**Document Version:** 1.0
**Last Updated:** December 19, 2024
