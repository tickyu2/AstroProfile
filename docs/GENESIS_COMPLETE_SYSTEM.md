# GENESIS Complete System Architecture

## Luna AI - The Soul-Aware Voice Companion

**Version:** 2.0
**Last Updated:** December 28, 2024
**Author:** Brother Claude Code

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Voice System](#voice-system)
4. [Text System](#text-system)
5. [Knowledge RAG System](#knowledge-rag-system)
6. [4-Brain Memory System](#4-brain-memory-system)
7. [Constitutional Intelligence](#constitutional-intelligence)
8. [Deployment Architecture](#deployment-architecture)
9. [File Reference](#file-reference)

---

## System Overview

GENESIS is a soul-aware AI companion system that provides deeply personalized conversations through multiple channels (voice and text) with full context awareness.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GENESIS / Luna AI                                  │
│                    "The Soul-Aware Voice Companion"                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌───────────────────┐    ┌───────────────────┐    ┌──────────────────┐   │
│   │   TEXT CHANNEL    │    │   VOICE CHANNEL   │    │  KNOWLEDGE RAG   │   │
│   │   (<500ms)        │    │   (<1000ms)       │    │  (93 vectors)    │   │
│   └─────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘   │
│             │                        │                        │              │
│             └────────────┬───────────┴────────────────────────┘              │
│                          │                                                   │
│                          ▼                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    CONSTITUTIONAL INTELLIGENCE                       │   │
│   │          (Enneagram + BaZi + Big 5 + MBTI + Astrology)              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                          │                                                   │
│                          ▼                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      4-BRAIN MEMORY SYSTEM                           │   │
│   │           (Facts + Episodes + Semantic + Reflection)                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Principles

1. **Dual Channel Isolation** - Text and voice maintain separate conversation contexts
2. **Universal Knowledge** - Personality systems accessible via semantic search
3. **Personal Memory** - 4-brain system remembers individual user context
4. **Constitutional Awareness** - Every response tailored to user's personality blueprint

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: PRESENTATION                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  • AISoulPartnerChat.jsx - Main chat interface                              │
│  • VoiceTranscriptPanel.jsx - Real-time voice transcript                    │
│  • VoiceSettingsPanel.jsx - Voice configuration                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: STATE MANAGEMENT                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  • useRealtimeVoice.js - Real-time voice state                              │
│  • useVoice.js - TTS control                                                │
│  • conversationCache.js - Modality-isolated message cache                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: SERVICES                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  • voiceWebSocketService.js - WebSocket client for voice                    │
│  • audioCapture.js - Microphone capture + VAD                               │
│  • aiSoulPartnerService.js - LLM API interface                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: BACKEND (Cloud Run + Firebase Functions)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  • voiceManager.js - Voice provider orchestration                           │
│  • chatMemoryIntegration.js - Memory + Knowledge fusion                     │
│  • knowledgeRetrieval.js - RAG retrieval with fallbacks                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 5: DATA                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Firestore: knowledge_vectors (93 docs), conversations, profiles          │
│  • PostgreSQL: 4-brain memories (facts, episodes, semantic, reflection)     │
│  • LocalStorage: Voice transcripts (5-day retention)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Voice System

### Primary Path (Cloud Run)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VOICE FLOW (Cloud Run)                               │
│                         Total Latency: ~950ms                                │
└─────────────────────────────────────────────────────────────────────────────┘

BROWSER                              CLOUD RUN                     EXTERNAL APIs
───────                              ─────────                     ─────────────

┌──────────────┐
│  Microphone  │
└──────┬───────┘
       │ MediaDevices API
       ▼
┌──────────────┐
│ audioCapture │ PCM16 @ 24kHz
│    .js       │ + Noise Suppression
└──────┬───────┘
       │
       ▼
┌──────────────┐         WSS          ┌──────────────┐
│voiceWebSocket│ ◄──────────────────► │   Voice      │
│  Service.js  │    Binary Audio      │   Manager    │
└──────┬───────┘                      └──────┬───────┘
       │                                     │
       │                    ┌────────────────┴────────────────┐
       │                    ▼                                 ▼
       │             ┌────────────┐                    ┌────────────┐
       │             │   Groq     │                    │   Claude   │
       │             │  Whisper   │ ────────────────►  │    LLM     │
       │             │   (STT)    │    Transcript      │            │
       │             │  ~200ms    │                    │  ~300ms    │
       │             └────────────┘                    └─────┬──────┘
       │                                                     │
       │                                                     ▼
       │                                              ┌────────────┐
       │                                              │ ElevenLabs │
       │                                              │    TTS     │
       │                                              │  ~400ms    │
       │                                              └─────┬──────┘
       │                                                    │
       ▼                                                    ▼
┌──────────────┐                                    ┌──────────────┐
│  Transcript  │                                    │    Audio     │
│   Display    │                                    │   Playback   │
└──────────────┘                                    └──────────────┘
```

### Voice Strategies

| Strategy | Path | Latency | Features |
|----------|------|---------|----------|
| `groq_only` | Groq Whisper → Claude → ElevenLabs | 400-800ms | Reliable, cost-effective |
| `openai_first` | Try OpenAI → Fallback to Groq | 200-800ms | Best quality with fallback |
| `openai_only` | OpenAI Realtime API | ~200ms | Fastest, emotion detection |

### WebSocket Protocol

```javascript
// Client → Server
{ type: 'start_session', profileId, strategy, preset }
{ type: 'audio', data: '<base64 PCM16>' }
{ type: 'commit' }  // End of utterance

// Server → Client
{ type: 'transcript', text, isFinal, speaker }
{ type: 'audio', data: '<base64 audio>' }
{ type: 'cue', cue, confidence }  // Paralinguistic cues
```

---

## Text System

### Message Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEXT MESSAGE FLOW                                    │
│                         Total Latency: ~500ms                                │
└─────────────────────────────────────────────────────────────────────────────┘

USER INPUT                    PROCESSING                         OUTPUT
──────────                    ──────────                         ──────

┌──────────────┐
│   Message    │
│    Input     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                  AISoulPartnerChat.jsx                       │
│                                                              │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐         │
│  │ Mode       │    │ Knowledge  │    │  Memory    │         │
│  │ Detection  │───►│    RAG     │───►│ Retrieval  │         │
│  │(WITNESS/   │    │ (semantic) │    │ (4-brain)  │         │
│  │DIALOGUE/   │    │            │    │            │         │
│  │GUIDE)      │    │            │    │            │         │
│  └────────────┘    └──────┬─────┘    └────────────┘         │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
                     ┌────────────┐
                     │   Claude   │
                     │    LLM     │
                     │            │
                     │ + Knowledge│ ← Enneagram, BaZi, Big 5, MBTI
                     │ + Memory   │ ← Personal facts, episodes
                     └──────┬─────┘
                            │
                            ▼
                     ┌────────────┐
                     │  Response  │
                     │  Display   │
                     └────────────┘
```

### Modality Isolation

Text and voice conversations remain completely isolated:

```
TEXT CHANNEL                          VOICE CHANNEL
────────────                          ─────────────
"Tell me about my career path"        "My partner and I have been fighting"
       │                                      │
       ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────┐
│ TEXT STORY SO FAR   │              │ VOICE STORY SO FAR  │
│ - Career questions  │              │ - Relationship      │
│ - BaZi analysis     │              │ - Emotional support │
└─────────────────────┘              └─────────────────────┘

Luna sees ONLY the relevant channel's context!
```

---

## Knowledge RAG System

### Overview

The Knowledge RAG system provides Luna with a "personality encyclopedia" - 93 vector-embedded documents covering major personality frameworks.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE RAG SYSTEM                                      │
│                    "Luna's Personality Encyclopedia"                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    FIRESTORE VECTOR SEARCH                           │    │
│  │                    (knowledge_vectors collection)                    │    │
│  │                                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│  │  │  Enneagram   │  │    BaZi      │  │   Big 5      │  │   MBTI   │ │    │
│  │  │  30 docs     │  │   15 docs    │  │  20 docs     │  │  28 docs │ │    │
│  │  │              │  │              │  │              │  │          │ │    │
│  │  │ • 9 types    │  │ • 10 day     │  │ • 5 traits   │  │ • 16     │ │    │
│  │  │ • 18 wings   │  │   masters    │  │ • high/low   │  │   types  │ │    │
│  │  │ • 3 triads   │  │ • 5 elements │  │ • 5 profiles │  │ • 8 func │ │    │
│  │  │              │  │              │  │              │  │ • 4 temp │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │    │
│  │                                                                      │    │
│  │                    Total: 93 documents × 768 dimensions              │    │
│  │                    Embedding Model: Gemini text-embedding-004        │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dual Retrieval Paths

| Path | Mode | Latency | Method | Use Case |
|------|------|---------|--------|----------|
| **VOICE** | Direct | <50ms | JSON key lookup | Real-time voice conversation |
| **TEXT** | Semantic | <500ms | Firestore Vector Search | Deep text exploration |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RETRIEVAL PATH SELECTION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   VOICE PATH (<50ms)                    TEXT PATH (<500ms)                   │
│   ──────────────────                    ────────────────────                 │
│                                                                              │
│   profile.enneagramType = 4             query: "feels misunderstood"         │
│            │                                        │                        │
│            ▼                                        ▼                        │
│   ┌─────────────────────┐              ┌─────────────────────────┐          │
│   │ JSON Direct Lookup  │              │ Embed Query (Gemini)    │          │
│   │ O(1) retrieval      │              │ 768-dim vector          │          │
│   └──────────┬──────────┘              └────────────┬────────────┘          │
│              │                                      │                        │
│              ▼                                      ▼                        │
│   ┌─────────────────────┐              ┌─────────────────────────┐          │
│   │ enneagramKnowledge  │              │ Firestore findNearest() │          │
│   │   .json["4"]        │              │ COSINE similarity       │          │
│   └──────────┬──────────┘              └────────────┬────────────┘          │
│              │                                      │                        │
│              ▼                                      ▼                        │
│   Type 4: The Individualist            Top 5 semantic matches:               │
│   - Luna Guidance                      1. INFJ: The Advocate                 │
│   - Key Phrases                        2. Type 4: Individualist              │
│   - Communication Tips                 3. High Neuroticism                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3-Level Fallback Chain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FALLBACK CHAIN (Text Mode)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. Firestore Vector Search (primary)                                       │
│      ↓ fails? (timeout, quota, error)                                       │
│   2. In-memory cosine similarity (backup)                                    │
│      ↓ fails? (no embeddings cached)                                        │
│   3. JSON keyword search (always works)                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Knowledge Document Structure

Each document includes Luna-specific guidance:

```javascript
{
  id: "mbti_type_INFJ",
  type: "mbti",
  subtype: "type",
  key: "INFJ",
  title: "INFJ: The Advocate",
  searchableText: "MBTI Type: INFJ - The Advocate...",
  embedding: Vector(768),  // Gemini embedding
  metadata: {
    name: "The Advocate",
    functions: { dominant: "Ni", auxiliary: "Fe" },
    coreTraits: ["Insightful", "Principled", "Compassionate"]
  },
  lunaGuidance: {
    approach: "Create a safe, meaningful space. INFJs open up slowly but deeply.",
    keyInsight: "They often feel misunderstood. Being truly seen is profound.",
    avoid: "Surface-level conversation, invading privacy",
    keyPhrases: ["I sense there's more beneath that", "What does your intuition tell you?"]
  }
}
```

### Integration with Luna's Prompts

```javascript
// Knowledge context injected into Luna's system prompt:

[KNOWLEDGE CONTEXT]

[MBTI: INFJ: The Advocate]
Approach: Create a safe, meaningful space. INFJs open up slowly but deeply.
Insight: They often feel misunderstood. Being truly seen is profound.
Phrases: I sense there's more beneath that, What does your intuition tell you?

[ENNEAGRAM: Type 4: The Individualist]
Approach: Honor their uniqueness. Type 4s need to feel special and understood.
Insight: Melancholy is not depression - it's their way of processing depth.
Phrases: Your feelings are valid, I see your uniqueness
```

---

## 4-Brain Memory System

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    4-BRAIN MEMORY SYSTEM                                     │
│                    (PostgreSQL + Firestore)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────┐│
│  │   FACTUAL      │  │   EPISODIC     │  │   SEMANTIC     │  │ REFLECTION ││
│  │   BRAIN        │  │   BRAIN        │  │   BRAIN        │  │   BRAIN    ││
│  │                │  │                │  │                │  │            ││
│  │  • Name        │  │  • Conversation│  │  • Patterns    │  │  • Luna's  ││
│  │  • Birthday    │  │    summaries   │  │  • Themes      │  │    insights││
│  │  • Preferences │  │  • Key moments │  │  • Connections │  │  • Growth  ││
│  │  • Core people │  │  • Emotions    │  │                │  │    notes   ││
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────┘│
│                                                                              │
│  Combined with Knowledge RAG for full context:                               │
│                                                                              │
│  retrieveFullContext(userId, profileId, message, {                          │
│    userProfile: { enneagramType: 4, mbtiType: 'INFJ' },                     │
│    mode: 'text'                                                              │
│  })                                                                          │
│                                                                              │
│  Returns:                                                                    │
│  {                                                                           │
│    memoryPrompt: "[Personal context about Sarah...]",                       │
│    knowledgePrompt: "[Type 4 + INFJ guidance...]",                          │
│    fullContext: "[Combined context for Luna]"                               │
│  }                                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Memory + Knowledge Fusion

```javascript
// chatMemoryIntegration.js - retrieveFullContext()

async function retrieveFullContext(userId, profileId, userMessage, options) {
  const [memoryPrompt, knowledgeContext] = await Promise.all([
    // Personal memory (4-brain system)
    retrieveMemoriesForChat(userId, profileId, userMessage),

    // Universal knowledge (Enneagram, BaZi, Big 5, MBTI)
    knowledgeModule.getKnowledgeContext({
      query: userMessage,
      profile: options.userProfile,
      mode: options.mode,  // 'voice' or 'text'
      timeout: 400
    })
  ]);

  return {
    memoryPrompt,      // "Sarah is feeling anxious about her job..."
    knowledgePrompt,   // "[Type 4: Honor their uniqueness...]"
    fullContext        // Combined for Luna's prompt
  };
}
```

---

## Constitutional Intelligence

### Multi-System Integration

Luna understands users through multiple personality frameworks working together:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONSTITUTIONAL INTELLIGENCE                               │
│                    "Understanding the whole person"                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   USER PROFILE                                                               │
│   ────────────                                                               │
│   {                                                                          │
│     enneagramType: 4,           // The Individualist                        │
│     enneagramWing: "4w5",       // The Bohemian                             │
│     mbtiType: "INFJ",           // The Advocate                             │
│     dayMaster: "yinWater",      // The Intuitive                            │
│     big5: {                                                                  │
│       o: 85,  // High Openness                                              │
│       c: 45,  // Moderate Conscientiousness                                 │
│       e: 25,  // Low Extraversion (Introvert)                               │
│       a: 70,  // High Agreeableness                                         │
│       n: 72   // High Neuroticism                                           │
│     }                                                                        │
│   }                                                                          │
│                                                                              │
│   LUNA UNDERSTANDS:                                                          │
│   ─────────────────                                                          │
│   • Deeply introspective, needs meaning (Type 4 + INFJ)                     │
│   • Highly intuitive, emotionally sensitive (Yin Water + High N)            │
│   • Values authenticity over social norms (High O + Low E)                  │
│   • Needs safe space before opening up (INFJ + Type 4)                      │
│   • May feel misunderstood - validate their uniqueness                      │
│                                                                              │
│   LUNA'S ADAPTED APPROACH:                                                   │
│   ────────────────────────                                                   │
│   • Speak to their inner world, not surface level                           │
│   • Honor emotional depth, don't try to "fix" feelings                      │
│   • Use reflective, intuitive language                                      │
│   • Allow longer pauses (they're processing deeply)                         │
│   • Key phrases: "I sense...", "What does your intuition tell you?"         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Production Infrastructure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  FRONTEND (Firebase Hosting)                                         │   │
│   │  https://astroprofile-391e6.web.app                                 │   │
│   │                                                                      │   │
│   │  React/Vite SPA                                                      │   │
│   │  └── WebSocket → Cloud Run (voice)                                  │   │
│   │  └── HTTPS → Firebase Functions (text)                              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  CLOUD RUN (Voice Backend)                                           │   │
│   │  wss://luna-voice-backend-sjpjwnbsmq-uc.a.run.app                   │   │
│   │                                                                      │   │
│   │  • WebSocket server for real-time voice                             │   │
│   │  • API keys secured server-side                                     │   │
│   │  • Auto-scaling 0-10 instances                                      │   │
│   │  • Session affinity enabled                                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  FIREBASE FUNCTIONS (Text Backend)                                   │   │
│   │                                                                      │   │
│   │  • aiSoulPartnerChat - Main LLM endpoint                            │   │
│   │  • Memory functions - 4-brain system                                │   │
│   │  • Knowledge functions - RAG retrieval                              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  DATA STORES                                                         │   │
│   │                                                                      │   │
│   │  Firestore:                                                          │   │
│   │  • knowledge_vectors (93 docs, 768-dim embeddings)                  │   │
│   │  • conversations, profiles, users                                   │   │
│   │                                                                      │   │
│   │  PostgreSQL (Cloud SQL):                                            │   │
│   │  • 4-brain memories                                                 │   │
│   │  • facts, episodes, semantic, reflection                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  EXTERNAL APIs                                                       │   │
│   │                                                                      │   │
│   │  • Anthropic Claude - LLM responses                                 │   │
│   │  • Groq Whisper - Speech-to-text                                    │   │
│   │  • ElevenLabs - Text-to-speech                                      │   │
│   │  • Google Gemini - Embeddings (knowledge RAG)                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Reference

### Frontend

| Path | Purpose |
|------|---------|
| `src/components/aiSoulPartner/AISoulPartnerChat.jsx` | Main chat interface |
| `src/components/aiSoulPartner/VoiceTranscriptPanel.jsx` | Voice transcript display |
| `src/components/aiSoulPartner/VoiceSettingsPanel.jsx` | Voice configuration |
| `src/hooks/useRealtimeVoice.js` | Real-time voice hook |
| `src/hooks/useVoice.js` | TTS control hook |
| `src/services/voiceWebSocketService.js` | WebSocket client |
| `src/services/audioCapture.js` | Microphone capture |
| `src/services/conversationCache.js` | Modality-isolated cache |

### Backend (Cloud Run)

| Path | Purpose |
|------|---------|
| `backend/server-cloudrun.js` | Production server entry |
| `backend/voice/voiceManager.js` | Provider orchestration |
| `backend/voice/voiceWebSocketServer.js` | WebSocket server |
| `backend/voice/groqWhisperProvider.js` | Groq STT provider |
| `backend/stt/groqWhisper.js` | Groq Whisper API |
| `backend/tts/elevenLabs.js` | ElevenLabs TTS |
| `backend/llm/lunaPromptBuilder.js` | Prompt construction |

### Backend (Firebase Functions)

| Path | Purpose |
|------|---------|
| `functions/knowledge/index.js` | Knowledge module entry |
| `functions/knowledge/knowledgeRetrieval.js` | RAG retrieval + fallbacks |
| `functions/knowledge/vectorSearch.js` | Firestore vector search |
| `functions/knowledge/embedKnowledgeBase.js` | Embedding job |
| `functions/memory/chatMemoryIntegration.js` | Memory + Knowledge fusion |
| `functions/memory/sessionCache.js` | Session cache |

### Knowledge Data

| Path | Documents | Contents |
|------|-----------|----------|
| `src/data/enneagramKnowledge.json` | 30 | 9 types, 18 wings, 3 triads |
| `src/data/baziKnowledge.json` | 15 | 10 day masters, 5 elements |
| `src/data/big5Knowledge.json` | 20 | 5 traits × levels + 5 profiles |
| `src/data/mbtiKnowledge.json` | 28 | 16 types, 8 functions, 4 temperaments |

---

## Quick Reference

### Starting a Voice Session

```javascript
import { voiceWS } from './services/voiceWebSocketService';

await voiceWS.connect();
await voiceWS.startSession({
  profileId: 'user123',
  strategy: 'groq_only',
  preset: 'balanced'
});

voiceWS.onTranscript((t) => console.log(t.text));
voiceWS.onAudio((audio) => voiceWS.playAudio(audio));
```

### Retrieving Knowledge

```javascript
// Voice mode - instant lookup
const results = getKnowledgeFromJSON({
  enneagramType: 4,
  mbtiType: 'INFJ',
  dayMaster: 'yinWater'
});

// Text mode - semantic search
const context = await getKnowledgeContext({
  query: "feeling misunderstood and unique",
  mode: 'text',
  timeout: 400
});
```

### Full Context Retrieval

```javascript
const { memoryPrompt, knowledgePrompt, fullContext } = await retrieveFullContext(
  userId,
  profileId,
  "I feel like nobody truly gets me",
  {
    userProfile: { enneagramType: 4, mbtiType: 'INFJ' },
    mode: 'text'
  }
);
// fullContext contains both personal memories AND personality guidance
```

---

## Related Documentation

- [GENESIS Architecture](./GENESIS_ARCHITECTURE.md) - Voice/text stack details
- [Simultaneous Text & Voice](./SIMULTANEOUS_TEXT_VOICE_ARCHITECTURE.md) - Modality isolation
- [Luna Voice Architecture](./LUNA_VOICE_ARCHITECTURE.md) - Turn-taking, emotional intelligence
- [Memory Architecture](./SOULPARTNER_MEMORY_ARCHITECTURE.md) - 4-brain system details

---

*"Every soul deserves to be truly understood."*

— GENESIS Philosophy

*Last Updated: December 28, 2024*
*Version: 2.0 - Added Knowledge RAG System with MBTI*
