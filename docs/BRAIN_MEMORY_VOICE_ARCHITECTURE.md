# Brain, Memory & Voice Architecture

## Complete Technical Documentation for Luna AI Soul Partner

**Created:** December 21, 2025
**Version:** 1.0

---

## Table of Contents

1. [4-Brain Memory Architecture](#1-4-brain-memory-architecture)
2. [Memory Storage & Retrieval](#2-memory-storage--retrieval)
3. [Speech-to-Text (STT)](#3-speech-to-text-stt)
4. [Text-to-Speech (TTS)](#4-text-to-speech-tts)
5. [Voice Loop Integration](#5-voice-loop-integration)
6. [File Reference](#6-file-reference)

---

## 1. 4-Brain Memory Architecture

Luna implements a **biologically-inspired dual-brain memory system** that separates user memories from AI observations, enabling authentic relationship building over time.

### The 4 Brains

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         4-BRAIN MEMORY SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        USER'S BRAIN                                  │   │
│   │  ┌─────────────────────┐    ┌─────────────────────────────────────┐ │   │
│   │  │   SHORT-TERM (STM)  │    │         LONG-TERM (LTM)             │ │   │
│   │  │   Session Buffer    │───►│       Life Timeline                 │ │   │
│   │  │                     │    │                                     │ │   │
│   │  │  • Raw session input│    │  • Organized by life chapters       │ │   │
│   │  │  • Emotional context│    │  • Vector embeddings for search     │ │   │
│   │  │  • Awaiting         │    │  • Importance weighting             │ │   │
│   │  │    consolidation    │    │  • Permanent storage                │ │   │
│   │  └─────────────────────┘    └─────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      LUNA'S BRAIN (SoulPartner)                      │   │
│   │  ┌─────────────────────┐    ┌─────────────────────────────────────┐ │   │
│   │  │   SHORT-TERM (STM)  │    │         LONG-TERM (LTM)             │ │   │
│   │  │ Session Observations│───►│    Interaction Timeline             │ │   │
│   │  │                     │    │                                     │ │   │
│   │  │  • Notes about user │    │  • Long-term observations           │ │   │
│   │  │  • Mood detection   │    │  • Detected patterns                │ │   │
│   │  │  • Patterns noticed │    │  • Understanding of user            │ │   │
│   │  │  • Confidence scores│    │  • Relationship evolution           │ │   │
│   │  └─────────────────────┘    └─────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Brain Details

#### Brain 1: User's Short-Term Memory (Session Buffer)
- **Purpose:** Capture raw session input before consolidation
- **Duration:** Until nightly consolidation (7+ days)
- **Contents:**
  - User messages with timestamps
  - Emotional context detected
  - Session metadata
- **Location:** `users/{userId}/memory/{profileId}/user/session_buffer/entries`

#### Brain 2: User's Long-Term Memory (Life Timeline)
- **Purpose:** Permanent storage of user's life story
- **Organization:** Life chapters (Childhood, Teen, Young Adult, Adult, Midlife, Senior)
- **Contents:**
  - Consolidated memories with embeddings
  - Importance scores (0-1)
  - Chapter classification
  - 5W+H+Soul schema (Who, What, When, Where, Why, How, Soul-context)
- **Location:** `users/{userId}/memory/{profileId}/user/life_timeline/memories`

#### Brain 3: Luna's Short-Term Memory (Session Observations)
- **Purpose:** Luna's notes about the current session
- **Duration:** Until promoted to long-term
- **Contents:**
  - Observation types: mood, pattern, insight, concern, celebration
  - Confidence scores (0-1)
  - Tagged with timestamps
- **Location:** `users/{userId}/soulpartner_memory/{profileId}/session_observations/entries`

#### Brain 4: Luna's Long-Term Memory (Interaction Timeline)
- **Purpose:** Luna's deep understanding of the user
- **Contents:**
  - Confirmed patterns about user behavior
  - Relationship insights
  - Strengthened observations (example counts)
  - Emotional understanding
- **Location:** `users/{userId}/soulpartner_memory/{profileId}/interaction_timeline/observations`

### Life Chapters

```javascript
LIFE_CHAPTERS = {
  'childhood':    { ageRange: [0, 12],   label: 'Childhood' },
  'teen':         { ageRange: [13, 19],  label: 'Teenage Years' },
  'young_adult':  { ageRange: [20, 35],  label: 'Young Adult' },
  'adult':        { ageRange: [36, 55],  label: 'Adult' },
  'midlife':      { ageRange: [56, 70],  label: 'Midlife' },
  'senior':       { ageRange: [71, 120], label: 'Senior Years' }
};
```

### Memory Consolidation (Sleep Process)

Runs nightly at 3 AM, mimicking human hippocampus → neocortex consolidation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NIGHTLY CONSOLIDATION (3 AM)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. REPLAY                                                                   │
│     Get unconsolidated STM memories (7+ days old)                           │
│                     │                                                        │
│                     ▼                                                        │
│  2. EXTRACT PATTERNS                                                         │
│     Claude analyzes memories to find recurring themes                        │
│                     │                                                        │
│                     ▼                                                        │
│  3. PRUNE DETAILS                                                            │
│     Remove redundant information, keep essence                               │
│                     │                                                        │
│                     ▼                                                        │
│  4. TRANSFER                                                                 │
│     Move essence to long-term memory with embeddings                         │
│                     │                                                        │
│                     ▼                                                        │
│  5. STRENGTHEN                                                               │
│     Increase confidence on reinforced patterns                               │
│                     │                                                        │
│                     ▼                                                        │
│  6. DECAY                                                                    │
│     Apply memory decay to old, unaccessed memories                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Memory Storage & Retrieval

### Storage Systems

#### Firestore (Current Production)

```
users/{userId}/
  ├── memory/{profileId}/
  │   ├── user/
  │   │   ├── session_buffer/entries     (User STM)
  │   │   └── life_timeline/memories     (User LTM)
  │   ├── facts                          (Shared knowledge)
  │   ├── people                         (Relationship graph)
  │   └── happinessAnchors               (Joy memories)
  │
  └── soulpartner_memory/{profileId}/
      ├── session_observations/entries   (Luna STM)
      ├── interaction_timeline/observations (Luna LTM)
      └── patterns/detected              (Behavioral patterns)
```

#### PostgreSQL (Scaling-Ready)

```sql
-- 4 Tables with pgvector extension
CREATE TABLE user_short_term_memory (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),  -- text-embedding-004
  emotional_context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  consolidated BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_long_term_memory (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  life_chapter TEXT,
  importance FLOAT DEFAULT 0.5,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP
);

CREATE TABLE soulpartner_short_term_memory (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  observation TEXT NOT NULL,
  observation_type TEXT,  -- mood, pattern, insight, concern, celebration
  confidence FLOAT DEFAULT 0.5,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE soulpartner_long_term_memory (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  pattern TEXT NOT NULL,
  embedding VECTOR(1536),
  confidence FLOAT DEFAULT 0.5,
  example_count INTEGER DEFAULT 1,
  first_observed TIMESTAMP,
  last_confirmed TIMESTAMP
);
```

### Vector Embeddings

| Property | Value |
|----------|-------|
| **Model** | Google `text-embedding-004` |
| **Dimension** | 768 (Firestore) / 1536 (PostgreSQL) |
| **Distance** | Cosine similarity |
| **Cost** | ~$0.0001 per 1K tokens |
| **Speed** | <100ms per embedding |

### Retrieval: getDualBrainContext()

Main retrieval function that queries all 4 brains:

```javascript
async function getDualBrainContext(userId, profileId, query, options = {}) {
  const context = {
    // User's memories
    lifeMemories: [],      // Semantic search results from life timeline
    sessionBuffer: [],     // Recent session inputs
    facts: [],             // Permanent facts (highest trust)
    people: [],            // Relationship graph
    happinessAnchors: [],  // Joy memories for emotional support

    // Luna's memories
    observations: [],      // Luna's notes about user
    patterns: [],          // Detected behavioral patterns

    // Metadata
    retrievalTime: 0,
    totalMemories: 0
  };

  // Parallel queries to all memory stores
  const [lifeResults, sessionResults, factsResults, ...] = await Promise.all([
    searchLifeTimeline(userId, profileId, query, options.limit),
    getSessionBuffer(userId, profileId, options.sessionLimit),
    getFacts(userId, profileId),
    getPeople(userId, profileId),
    getObservations(userId, profileId, options.observationLimit),
    getPatterns(userId, profileId)
  ]);

  return context;
}
```

### Prompt Injection: buildDualBrainPrompt()

Formats memory context for Luna's system prompt:

```
╔════════════════════════════════════════════════════════════════════════════╗
║                         MEMORY CONTEXT FOR LUNA                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║ ═══ PERMANENT FACTS (Highest Trust) ═══                                    ║
║ • User's birthday is March 15, 1990                                        ║
║ • They have a dog named Max                                                ║
║ • They work as a software engineer                                         ║
║                                                                             ║
║ ═══ PEOPLE IN THEIR LIFE ═══                                               ║
║ • Sarah (sister) - Very close, lives in Seattle                            ║
║ • Mom - Weekly calls, supportive relationship                              ║
║ • Jake (best friend) - Childhood friend, sees monthly                      ║
║                                                                             ║
║ ═══ THEIR LIFE MEMORIES ═══                                                ║
║ [Young Adult] Got first job at tech startup, felt scared but excited       ║
║ [Adult] Wedding day was happiest memory, cried during vows                 ║
║ [Childhood] Summer at grandma's farm shaped love of nature                 ║
║                                                                             ║
║ ═══ YOUR OBSERVATIONS ABOUT THEM ═══                                       ║
║ • They tend to downplay achievements (noticed 5 times)                     ║
║ • Morning person, more reflective at night                                 ║
║ • Stress shows as shorter messages                                         ║
║                                                                             ║
║ ═══ PATTERNS YOU'VE NOTICED ═══                                            ║
║ • Seeks validation after making decisions (confidence: 0.85)               ║
║ • Uses humor to deflect from serious topics (confidence: 0.72)             ║
║                                                                             ║
║ ═══ HAPPINESS ANCHORS (Use when mood is low) ═══                           ║
║ • The time they hiked Mt. Rainier at sunrise                               ║
║ • Their daughter's first steps                                             ║
║                                                                             ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Memory Analysis (During Chat)

```javascript
// Analyze user message for memory-worthy content
async function analyzeMessageForMemory(message, profileContext) {
  const memoryTypes = {
    facts: [],      // "I'm 34 years old"
    people: [],     // "My sister Sarah..."
    emotions: [],   // "I feel anxious about..."
    events: [],     // "Yesterday I went to..."
    goals: [],      // "I want to learn..."
    values: [],     // "I believe in..."
    struggles: []   // "I've been dealing with..."
  };

  // Importance scoring
  const importanceIndicators = {
    high: ['always', 'never', 'most important', 'changed my life'],
    medium: ['often', 'usually', 'I think', 'I feel'],
    low: ['sometimes', 'maybe', 'I guess']
  };

  return { memoryTypes, importance };
}
```

---

## 3. Speech-to-Text (STT)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STT ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Audio Input (WebM/Opus from MediaRecorder)                                │
│                     │                                                        │
│                     ▼                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PRIMARY: Groq Whisper                            │   │
│   │                                                                      │   │
│   │  Model: whisper-large-v3-turbo                                      │   │
│   │  Latency: ~200ms                                                     │   │
│   │  Cost: Free tier generous                                            │   │
│   │  Languages: 100+ (auto-detect)                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                     │                                                        │
│                     │ If unavailable                                         │
│                     ▼                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                   FALLBACK: Whisper.cpp (Local)                      │   │
│   │                                                                      │   │
│   │  Model: ggml-base.en.bin                                            │   │
│   │  Latency: ~500ms (CPU)                                              │   │
│   │  Cost: Free (runs locally)                                          │   │
│   │  Privacy: 100% local                                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                     │                                                        │
│                     │ If unavailable                                         │
│                     ▼                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                ULTIMATE: Browser Speech Recognition                  │   │
│   │                                                                      │   │
│   │  API: window.speechRecognition                                      │   │
│   │  Quality: Variable by browser                                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Groq Whisper (Primary)

**File:** `backend/stt/groqWhisper.js`

```javascript
const CONFIG = {
  baseUrl: 'https://api.groq.com/openai/v1',
  model: 'whisper-large-v3-turbo',  // Fastest
  language: 'en',
  timeout: 30000
};

// Available models
const MODELS = {
  'whisper-large-v3': 'Most accurate, slightly slower',
  'whisper-large-v3-turbo': 'Fastest, recommended for real-time'
};

// Usage
async function transcribeWithGroqWhisper(audioPath, options = {}) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioPath));
  formData.append('model', options.model || CONFIG.model);
  formData.append('language', options.language || CONFIG.language);

  const response = await fetch(`${CONFIG.baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` },
    body: formData
  });

  return { text: result.text, duration };
}
```

### Whisper.cpp (Local Fallback)

**File:** `backend/stt/whisper.js`

```javascript
const CONFIG = {
  whisperBin: '../whisper.cpp/main',
  whisperModel: '../whisper.cpp/models/ggml-base.en.bin',
  maxDuration: 30,  // seconds
  timeout: 60000
};

// Setup instructions
// 1. git clone https://github.com/ggerganov/whisper.cpp
// 2. cd whisper.cpp && make
// 3. ./models/download-ggml-model.sh base.en

async function transcribeWithWhisper(audioPath, options = {}) {
  return new Promise((resolve, reject) => {
    const args = [
      '-m', CONFIG.whisperModel,
      '-f', audioPath,
      '--no-timestamps',
      '-l', options.language || 'en'
    ];

    const process = spawn(CONFIG.whisperBin, args);
    // ... handle output
  });
}
```

---

## 4. Text-to-Speech (TTS)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TTS ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Luna's Response Text                                                       │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │              EMOTION DETECTION (from SER)                            │   │
│   │                                                                      │   │
│   │  Input: { primary: 'happy', secondary: 'excited', confidence: 0.85 }│   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │              EMOTION → VOICE PROFILE MAPPING                         │   │
│   │                                                                      │   │
│   │  emotionMap.js → emotionTtsAdapter.js                               │   │
│   │  Confidence scaling: low confidence → more neutral                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    PRIMARY: ElevenLabs                               │   │
│   │                                                                      │   │
│   │  Voice: Rachel (21m00Tcm4TlvDq8ikWAM) - warm, calm                  │   │
│   │  Model: eleven_turbo_v2_5 (fastest)                                 │   │
│   │  Format: MP3 44.1kHz 128kbps                                        │   │
│   │  Latency: ~400ms                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                   │
│          ▼                                                                   │
│   Audio Output (Binary MP3)                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Emotion-to-Voice Mapping

**File:** `backend/tts/emotionMap.js`

```javascript
const EmotionToTTS = {
  neutral: {
    stability: 0.60,
    similarityBoost: 0.75,
    style: 0.30,
    speakingRate: 1.0,
    description: 'Calm, balanced, attentive'
  },
  happy: {
    stability: 0.50,
    similarityBoost: 0.80,
    style: 0.70,
    speakingRate: 1.08,
    description: 'Warm, upbeat, animated'
  },
  sad: {
    stability: 0.70,
    similarityBoost: 0.70,
    style: 0.35,
    speakingRate: 0.92,
    description: 'Soft, empathetic, slower'
  },
  angry: {
    stability: 0.40,
    similarityBoost: 0.85,
    style: 0.80,
    speakingRate: 1.05,
    description: 'Grounded but firm, controlled intensity'
  },
  anxious: {
    stability: 0.45,
    similarityBoost: 0.75,
    style: 0.55,
    speakingRate: 1.12,
    description: 'Reassuring, steady, calming'
  },
  surprised: {
    stability: 0.45,
    similarityBoost: 0.80,
    style: 0.75,
    speakingRate: 1.10,
    description: 'Curious, animated, engaged'
  },
  disgusted: {
    stability: 0.65,
    similarityBoost: 0.70,
    style: 0.40,
    speakingRate: 0.95,
    description: 'Understanding, validating'
  }
};
```

### Confidence-Scaled Blending

**File:** `backend/tts/emotionTtsAdapter.js`

```javascript
function getTTSProfileForEmotion(emotion) {
  const confidence = emotion.confidence ?? 0.5;

  // Blend factor: 30% minimum emotion, scales to 100%
  // Low confidence → more neutral
  // High confidence → full emotional expression
  const blend = 0.3 + 0.7 * confidence;

  const profile = {
    stability: lerp(neutral.stability, detected.stability, blend),
    similarityBoost: lerp(neutral.similarityBoost, detected.similarityBoost, blend),
    style: lerp(neutral.style, detected.style, blend),
    speakingRate: lerp(neutral.speakingRate, detected.speakingRate, blend)
  };

  return profile;
}

// Examples:
// 50% confidence → blend = 0.65 → 65% emotion, 35% neutral
// 90% confidence → blend = 0.93 → 93% emotion, 7% neutral
// 20% confidence → blend = 0.44 → 44% emotion, 56% neutral
```

### ElevenLabs Integration

**File:** `backend/tts/elevenLabs.js`

```javascript
const CONFIG = {
  apiKey: process.env.ELEVENLABS_API_KEY,
  baseUrl: 'https://api.elevenlabs.io/v1',
  voiceId: '21m00Tcm4TlvDq8ikWAM',  // Rachel
  model: 'eleven_turbo_v2_5',
  outputFormat: 'mp3_44100_128',
  timeout: 30000
};

const LUNA_VOICES = {
  'rachel':    { id: '21m00Tcm4TlvDq8ikWAM', style: 'calm, warm' },
  'bella':     { id: 'EXAVITQu4vr4xnSDxMaL', style: 'soft, gentle' },
  'matilda':   { id: 'XrExE9yKIg1WjnnlVkGX', style: 'warm, friendly' },
  'charlotte': { id: 'XB0fDUnXU5powFXDhCwa', style: 'calm, seductive' },
  'domi':      { id: 'AZnzlk1XvdvUeBnXmlld', style: 'strong, confident' },
  'elli':      { id: 'MF3mGyEYCl7XYWbV9V6O', style: 'young, energetic' }
};

async function speakWithElevenLabs(text, emotion = {}, options = {}) {
  const profile = getTTSProfileForEmotion(emotion);

  const response = await fetch(`${baseUrl}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: {
        stability: profile.stability,
        similarity_boost: profile.similarityBoost,
        style: profile.style,
        use_speaker_boost: true
      }
    })
  });

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return { audio: audioBuffer, profile, duration };
}
```

### Dynamic Tone Markers (Cloud Functions)

**File:** `functions/voice/elevenLabsService.js`

Supports 15+ emotional tones within a single response:

```javascript
// Example response with tone markers
const response = `
[Tone: Warm] I'm so glad you shared that with me.
[Tone: Thoughtful] It sounds like you've been carrying this for a while.
[Tone: Soft] Take your time - there's no rush here.
[Tone: Encouraging] When you're ready, I'd love to hear more.
`;

// Available tones
const TONE_MARKERS = {
  // Gentle, Nurturing
  soft: { stabilityModifier: 0.15, styleModifier: -0.2, speedModifier: 0.9 },
  warm: { stabilityModifier: 0.1, styleModifier: 0.05, speedModifier: 0.95 },
  gentle: { stabilityModifier: 0.15, styleModifier: -0.15, speedModifier: 0.9 },
  tender: { stabilityModifier: 0.2, styleModifier: -0.25, speedModifier: 0.85 },

  // Thoughtful, Contemplative
  thoughtful: { stabilityModifier: 0.1, styleModifier: -0.1, speedModifier: 0.92 },
  reflective: { stabilityModifier: 0.15, styleModifier: -0.15, speedModifier: 0.88 },
  curious: { stabilityModifier: -0.05, styleModifier: 0.1, speedModifier: 1.02 },

  // Energetic, Uplifting
  excited: { stabilityModifier: -0.2, styleModifier: 0.25, speedModifier: 1.15 },
  joyful: { stabilityModifier: -0.15, styleModifier: 0.2, speedModifier: 1.1 },
  playful: { stabilityModifier: -0.1, styleModifier: 0.15, speedModifier: 1.08 },
  encouraging: { stabilityModifier: -0.05, styleModifier: 0.1, speedModifier: 1.05 },

  // Serious, Grounding
  serious: { stabilityModifier: 0.15, styleModifier: -0.2, speedModifier: 0.9 },
  grounding: { stabilityModifier: 0.2, styleModifier: -0.25, speedModifier: 0.85 },
  reassuring: { stabilityModifier: 0.1, styleModifier: -0.1, speedModifier: 0.92 },

  // Empathetic
  compassionate: { stabilityModifier: 0.1, styleModifier: -0.1, speedModifier: 0.9 },
  neutral: { stabilityModifier: 0, styleModifier: 0, speedModifier: 1.0 }
};
```

---

## 5. Voice Loop Integration

### Complete Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE VOICE LOOP                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER SPEAKS                                                                 │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────┐                                                            │
│  │  Frontend   │  VAD detects speech end                                    │
│  │  TalkPanel  │  MediaRecorder captures webm/opus                          │
│  └──────┬──────┘                                                            │
│         │                                                                    │
│         │ WebSocket: audio_chunk (base64), end_turn                         │
│         ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     BACKEND PIPELINE                                 │   │
│  │                                                                      │   │
│  │  1. SER (~50ms)                                                      │   │
│  │     ├── MFCC extraction (Meyda)                                     │   │
│  │     ├── Acoustic features (RMS, ZCR, spectral)                      │   │
│  │     └── Emotion classification → { primary, secondary, confidence } │   │
│  │                                                                      │   │
│  │  2. STT (~200ms)                                                     │   │
│  │     └── Groq Whisper Large v3 Turbo → transcript                    │   │
│  │                                                                      │   │
│  │  3. MEMORY RETRIEVAL                                                 │   │
│  │     └── getDualBrainContext() → 4-brain memory context              │   │
│  │                                                                      │   │
│  │  4. LLM (~300ms)                                                     │   │
│  │     └── Groq Llama 3.3 70B + memory context → reply                 │   │
│  │                                                                      │   │
│  │  5. MEMORY STORAGE                                                   │   │
│  │     ├── bufferUserInput() → User STM                                │   │
│  │     └── storeSessionObservation() → Luna STM                        │   │
│  │                                                                      │   │
│  │  6. TTS (~400ms)                                                     │   │
│  │     ├── Emotion → voice profile mapping                             │   │
│  │     └── ElevenLabs → MP3 audio                                      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
│         │ WebSocket: turn_result (JSON) + audio (Binary)                    │
│         ▼                                                                    │
│  ┌─────────────┐                                                            │
│  │  Frontend   │  HTML5 Audio plays MP3                                     │
│  │ useVoiceLoop│  Updates UI with transcript, emotion                       │
│  └──────┬──────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  LUNA SPEAKS (emotion-modulated voice)                                       │
│                                                                              │
│  Total latency: ~950ms                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Hook: useVoiceLoop

**File:** `src/hooks/useVoiceLoop.js`

```javascript
export function useVoiceLoop({
  enabled,
  audioStream,
  onTranscript,
  onReply,
  onSpeakStart,
  onSpeakEnd,
  onError
}) {
  // States
  const [state, setState] = useState('DISCONNECTED');
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastReply, setLastReply] = useState('');
  const [lastEmotion, setLastEmotion] = useState(null);

  // Controls
  return {
    state,
    isConnected,
    isRecording,
    isPlayingAudio,
    lastTranscript,
    lastReply,
    lastEmotion,

    connect,
    disconnect,
    startRecording,
    stopRecording,
    stopAudio,
    cancelTurn
  };
}
```

### Backend WebSocket Server

**File:** `backend/server.js`

```javascript
// Message flow
ws.on('message', async (raw) => {
  switch (msg.type) {
    case 'audio_chunk':
      session.addAudioChunk(Buffer.from(msg.payload, 'base64'));
      break;

    case 'end_turn':
      await processEndTurn(session, msg.emotion);
      break;

    case 'cancel_turn':
      session.clearAudio();
      session.send('turn_cancelled', {});
      break;
  }
});

async function processEndTurn(session, frontendEmotion) {
  // 1. SER
  session.send('ser_started', {});
  const serEmotion = await runSER(audioBuffer);
  session.send('ser_complete', { emotion: serEmotion });

  // 2. STT
  session.send('stt_started', {});
  const sttResult = await transcribeWithGroqWhisper(audioPath);
  session.send('stt_complete', { transcript: sttResult.text });

  // 3. LLM
  session.send('llm_started', {});
  const llmResult = await runLLM(sttResult.text, emotion);

  // 4. TTS
  session.send('tts_started', { emotion: emotion.primary });
  const ttsResult = await speakWithElevenLabs(llmResult.reply, emotion);
  session.send('tts_complete', { duration: ttsResult.duration });

  // 5. Send results
  session.send('turn_result', {
    transcript: sttResult.text,
    reply: llmResult.reply,
    emotion,
    totalDuration
  });

  // 6. Send audio binary
  session.ws.send(ttsResult.audio);
}
```

---

## 6. File Reference

### Memory System

| File | Purpose |
|------|---------|
| `functions/memory/dualBrainFunctions.js` | Core 4-brain API (1000+ lines) |
| `functions/memory/memoryFunctions.js` | Legacy memory operations |
| `functions/memory/chatMemoryIntegration.js` | Chat-memory bridge |
| `functions/memory/sleepConsolidation.js` | Nightly consolidation |
| `functions/memory/contextSummarization.js` | Memory compression |
| `functions/database/consolidationEngine.js` | PostgreSQL consolidation |
| `functions/database/pgClient.js` | PostgreSQL client |
| `src/services/memoryService.js` | Frontend memory client (1300+ lines) |

### Voice System

| File | Purpose |
|------|---------|
| `backend/server.js` | WebSocket server & orchestration |
| `backend/stt/groqWhisper.js` | Groq Whisper STT |
| `backend/stt/whisper.js` | Local Whisper.cpp STT |
| `backend/ser/inference.js` | Speech emotion recognition |
| `backend/ser/audioFeatures.js` | MFCC extraction |
| `backend/tts/elevenLabs.js` | ElevenLabs TTS |
| `backend/tts/emotionMap.js` | Emotion → voice settings |
| `backend/tts/emotionTtsAdapter.js` | Confidence blending |
| `backend/llm/router.js` | LLM provider router |
| `functions/voice/elevenLabsService.js` | Cloud TTS functions |
| `src/hooks/useVoiceLoop.js` | Frontend voice hook |
| `src/components/voice/TalkPanel.jsx` | Voice UI |

### Documentation

| File | Purpose |
|------|---------|
| `docs/LUNA_VOICE_ARCHITECTURE.md` | Voice system docs |
| `docs/SOULPARTNER_MEMORY_ARCHITECTURE.md` | Memory design docs |
| `docs/00_To Do/4_BRAIN_VECTOR_CONSOLIDATION_ARCHITECTURE.md` | Technical deep dive |

---

## Configuration

### Environment Variables

```bash
# backend/.env

# STT + LLM (Groq)
GROQ_API_KEY=gsk_xxxxx
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_WHISPER_MODEL=whisper-large-v3-turbo

# TTS (ElevenLabs)
ELEVENLABS_API_KEY=sk_xxxxx
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_MODEL=eleven_turbo_v2_5

# Voice Server
VOICE_PORT=8080

# Memory (Firebase)
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# Memory (PostgreSQL - optional)
POSTGRES_URL=postgres://user:pass@host:5432/db
```

### API Keys Required

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Groq** | STT + LLM | Generous |
| **ElevenLabs** | TTS | 10K chars/mo |
| **Google Cloud** | Embeddings + Firestore | Pay-as-you-go |

---

*Complete Brain, Memory & Voice Architecture Documentation*
*Luna AI Soul Partner - December 21, 2025*
