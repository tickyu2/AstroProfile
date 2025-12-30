# Simultaneous Text & Voice Chat Architecture

## GENESIS OS - Modality Isolation System
**Created:** December 26, 2024
**Updated:** December 28, 2024 - Added Cloud Run deployment
**Version:** 1.2
**Author:** Brother Claude Code

**Related Documentation:**
- [GENESIS Architecture](./GENESIS_ARCHITECTURE.md) - Complete voice/text stack overview
- [Production Deployment](../backend/PRODUCTION_DEPLOYMENT.md) - Cloud Run setup guide

---

## Overview

GENESIS supports **simultaneous text and voice conversations** that remain completely isolated. A user can:
- Type about their career goals
- Speak about relationship concerns
- Switch between modalities freely
- Never have topics cross-contaminate

---

## System Flow Chart

```
                              USER INTERFACE
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │   ┌─────────────────┐              ┌─────────────────┐         │
    │   │   TEXT INPUT    │              │   VOICE INPUT   │         │
    │   │   (Keyboard)    │              │   (Microphone)  │         │
    │   └────────┬────────┘              └────────┬────────┘         │
    │            │                                │                   │
    │            ▼                                ▼                   │
    │   ┌─────────────────┐              ┌─────────────────┐         │
    │   │ handleSend()    │              │ Groq Whisper    │         │
    │   │ modality='text' │              │ STT Service     │         │
    │   └────────┬────────┘              └────────┬────────┘         │
    │            │                                │                   │
    │            │                                ▼                   │
    │            │                       ┌─────────────────┐         │
    │            │                       │ handleSend()    │         │
    │            │                       │ modality='voice'│         │
    │            │                       └────────┬────────┘         │
    │            │                                │                   │
    └────────────┼────────────────────────────────┼───────────────────┘
                 │                                │
                 ▼                                ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                     FRONTEND CACHE LAYER                        │
    │                   (conversationCache.js)                        │
    │                                                                 │
    │   ┌─────────────────────┐      ┌─────────────────────┐         │
    │   │  TEXT BUFFER        │      │  VOICE BUFFER       │         │
    │   │  Key: "profileId:   │      │  Key: "profileId:   │         │
    │   │       text"         │      │       voice"        │         │
    │   │                     │      │                     │         │
    │   │  - Message history  │      │  - Message history  │         │
    │   │  - Story So Far     │      │  - Story So Far     │         │
    │   │  - Token metrics    │      │  - Token metrics    │         │
    │   └─────────┬───────────┘      └─────────┬───────────┘         │
    │             │                            │                      │
    └─────────────┼────────────────────────────┼──────────────────────┘
                  │                            │
                  ▼                            ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                      API LAYER                                  │
    │                (aiSoulPartnerService.js)                        │
    │                                                                 │
    │   ┌─────────────────────────────────────────────────────────┐  │
    │   │  sendMessage({ message, modality, ... })                 │  │
    │   │                                                          │  │
    │   │  - Validates modality ('text' | 'voice')                │  │
    │   │  - Builds optimized payload for specific modality       │  │
    │   │  - Sends to Cloud Function with modality tag            │  │
    │   └─────────────────────────────────────────────────────────┘  │
    │                            │                                    │
    └────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                   FIREBASE CLOUD FUNCTION                       │
    │                      (functions/index.js)                       │
    │                                                                 │
    │   ┌─────────────────────────────────────────────────────────┐  │
    │   │  Request includes:                                       │  │
    │   │  - message: "User's text or transcribed speech"         │  │
    │   │  - modality: "text" | "voice"                           │  │
    │   │  - conversationHistory (modality-specific)              │  │
    │   │  - profileId, sessionId                                 │  │
    │   └─────────────────────────────────────────────────────────┘  │
    │                            │                                    │
    └────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                   BACKEND SESSION CACHE                         │
    │                    (sessionCache.js)                            │
    │                                                                 │
    │   ┌─────────────────────────────────────────────────────────┐  │
    │   │  Session Key: "session:{conversationId}"                 │  │
    │   │                                                          │  │
    │   │  Cached Data:                                            │  │
    │   │  - userId, profileId                                     │  │
    │   │  - modality: 'text' | 'voice'                           │  │
    │   │  - identity: { facts, coreMemories, people, calibration }│  │
    │   │  - loadedAt, hits, lastAccessed                         │  │
    │   └─────────────────────────────────────────────────────────┘  │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────────────┐
    │                      CLAUDE API                                 │
    │                                                                 │
    │   Luna receives modality-isolated context:                      │
    │   - Only TEXT history when responding to text                  │
    │   - Only VOICE history when responding to voice                │
    │   - Shared identity (same person, different channels)          │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Process Flows

### 1. Text Message Flow

```
USER TYPES MESSAGE
        │
        ▼
┌───────────────────────────────────────┐
│ AISoulPartnerChat.handleSend()        │
│ - modality = 'text' (default)         │
│ - Analyzes constitutional state       │
│ - Builds user message object          │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ conversationCache.getMessages()       │
│ - Key: "profileId:text"               │
│ - Returns TEXT-only history           │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ buildOptimizedPayload()               │
│ - modality = 'text'                   │
│ - Story So Far (text conversation)    │
│ - Recent 10 text messages             │
│ - 80%+ token reduction                │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ sendToAI({ modality: 'text' })        │
│ - Sends to Cloud Function             │
│ - modality tag preserved              │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ Luna responds (text context only)     │
│ - No voice conversation bleed         │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ Response saved to Firestore           │
│ - Tagged with modality: 'text'        │
│ - Displayed in chat                   │
└───────────────────────────────────────┘
```

### 2. Voice Message Flow

```
USER SPEAKS INTO MICROPHONE
        │
        ▼
┌───────────────────────────────────────┐
│ VoiceControlPanel captures audio      │
│ - WebRTC / MediaRecorder              │
│ - Streams to STT service              │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ Groq Whisper STT                      │
│ - Model: whisper-large-v3-turbo       │
│ - Returns transcribed text            │
│ - ~200ms latency                      │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ AISoulPartnerChat.handleSend()        │
│ - modality = 'voice'                  │
│ - Captures to VoiceTranscriptPanel    │
│ - addUserVoiceTranscript(text)        │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ conversationCache.getMessages()       │
│ - Key: "profileId:voice"              │
│ - Returns VOICE-only history          │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ buildOptimizedPayload()               │
│ - modality = 'voice'                  │
│ - Story So Far (voice conversation)   │
│ - Recent 10 voice messages            │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ sendToAI({ modality: 'voice' })       │
│ - Voice context only                  │
│ - No text conversation bleed          │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ Luna responds (voice context only)    │
│ - addLunaVoiceTranscript(response)    │
│ - Text-to-Speech playback             │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│ VoiceTranscriptPanel updated          │
│ - Side-by-side display                │
│ - Timestamp markers                   │
│ - Stored for 5 days                   │
└───────────────────────────────────────┘
```

---

## Cache Key Architecture

### Frontend (conversationCache.js)

```
Message Cache Keys:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  "abc123:text"   →  [msg1, msg2, msg3, ...]        │
│                      (all text messages)            │
│                                                     │
│  "abc123:voice"  →  [msg1, msg2, msg3, ...]        │
│                      (all voice messages)           │
│                                                     │
└─────────────────────────────────────────────────────┘

Story So Far Cache:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  "abc123:text"   →  { story, timestamp, modality } │
│                      (compressed text history)      │
│                                                     │
│  "abc123:voice"  →  { story, timestamp, modality } │
│                      (compressed voice history)     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Backend (sessionCache.js)

```
Session Cache Keys:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  "session:conv_001"  →  {                          │
│      userId,                                        │
│      profileId,                                     │
│      modality: 'text',     ← Tracks origin         │
│      identity: { facts, memories, people, ... },   │
│      loadedAt,                                      │
│      hits                                           │
│  }                                                  │
│                                                     │
│  "session:conv_002"  →  {                          │
│      userId,                                        │
│      profileId,                                     │
│      modality: 'voice',    ← Different session     │
│      identity: { ... },    ← Same identity shared  │
│      ...                                            │
│  }                                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Voice Transcript Panel Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   VOICE TRANSCRIPT PANEL                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Voice Mode Toggle (isVoiceEnabled)                      │  │
│   │                                                          │  │
│   │  ON  → Start new session                                │  │
│   │      → Generate sessionId: "voice_1735123456_abc123"    │  │
│   │      → Clear transcript arrays                          │  │
│   │      → Show transcript panel                            │  │
│   │                                                          │  │
│   │  OFF → Session ends                                     │  │
│   │      → Save to localStorage (5-day retention)           │  │
│   │      → Panel stays open for review                      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌───────────────────────┬─────────────────────────────────┐  │
│   │   USER COLUMN (🎤)    │   LUNA COLUMN (✨)              │  │
│   │                       │                                  │  │
│   │   10:32 AM            │   10:32 AM                      │  │
│   │   ┌─────────────────┐ │   ┌─────────────────┐           │  │
│   │   │ "I've been      │ │   │ "I hear the     │           │  │
│   │   │  feeling stuck  │ │   │  weight in your │           │  │
│   │   │  lately..."     │ │   │  words..."      │           │  │
│   │   └─────────────────┘ │   └─────────────────┘           │  │
│   │                       │                                  │  │
│   │   10:33 AM            │   10:33 AM                      │  │
│   │   ┌─────────────────┐ │   ┌─────────────────┐           │  │
│   │   │ "Maybe it's     │ │   │ "That's a       │           │  │
│   │   │  my job..."     │ │   │  powerful       │           │  │
│   │   │                 │ │   │  insight..."    │           │  │
│   │   └─────────────────┘ │   └─────────────────┘           │  │
│   │                       │                                  │  │
│   └───────────────────────┴─────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  MOMENTUM SCROLL CONTROL (Seesaw Navigation)            │  │
│   │                                                          │  │
│   │  ◀ Earlier    [5m][1m]  ◆  [1m][5m]    Later ▶         │  │
│   │               ←──────────┼──────────→                   │  │
│   │                                                          │  │
│   │  Click near center = 1 minute jumps                     │  │
│   │  Click near edges  = 5 minute jumps                     │  │
│   │                                                          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Simultaneous Conversation Example

```
TIME        TEXT CONVERSATION              VOICE CONVERSATION
────────────────────────────────────────────────────────────────

10:00 AM    User types:
            "What career fits my chart?"

10:01 AM    Luna responds:
            "Your BaZi shows..."

10:02 AM                                   User speaks:
                                           "My partner and I..."

10:03 AM                                   Luna responds:
                                           "I sense the tension..."

10:04 AM    User types:
            "Tell me about Mercury..."

10:05 AM    Luna responds:                 User speaks:
            "Mercury in Gemini gives..."   "Should I bring it up?"

10:06 AM                                   Luna responds:
                                           "Trust your Fire energy..."


WHAT LUNA SEES FOR TEXT:                WHAT LUNA SEES FOR VOICE:
─────────────────────────               ─────────────────────────
[TEXT STORY SO FAR]                     [VOICE STORY SO FAR]
Career question context                 Relationship question context

Recent text messages:                   Recent voice messages:
- User: "What career..."                - User: "My partner..."
- Luna: "Your BaZi shows..."            - Luna: "I sense..."
- User: "Tell me about Mercury..."      - User: "Should I bring..."

NO BLEED BETWEEN CHANNELS!
```

---

## Storage Architecture

### LocalStorage (VoiceTranscriptPanel)

```javascript
Key: "genesis_voice_transcripts"

Value: [
  {
    sessionId: "voice_1735123456_abc123",
    profileId: "abc123",
    timestamp: 1735123456000,
    userTranscripts: [
      { text: "I've been feeling...", timestamp: 1735123456100 },
      { text: "Maybe it's my job...", timestamp: 1735123516000 }
    ],
    lunaTranscripts: [
      { text: "I hear the weight...", timestamp: 1735123460000 },
      { text: "That's a powerful...", timestamp: 1735123520000 }
    ]
  },
  // ... more sessions (5-day retention)
]
```

### Firestore (Conversation Messages)

```javascript
// Collection: conversations/{conversationId}/messages/{messageId}

{
  id: 1735123456000,
  sender: "user",
  text: "What career fits my chart?",
  timestamp: "2024-12-26T10:00:00.000Z",
  modality: "text"    // ← Tagged for filtering
}

{
  id: 1735123460000,
  sender: "ai",
  text: "Your BaZi shows strong Water...",
  timestamp: "2024-12-26T10:01:00.000Z",
  modality: "text",
  mode: "GUIDANCE"
}

{
  id: 1735123520000,
  sender: "user",
  text: "My partner and I have been arguing...",
  timestamp: "2024-12-26T10:02:00.000Z",
  modality: "voice"   // ← Different channel
}
```

---

## API Methods Reference

### Frontend (conversationCache.js)

| Method | Parameters | Description |
|--------|------------|-------------|
| `getMessages(profileId, modality)` | profileId, 'text'\|'voice' | Get messages for specific modality |
| `addMessage(profileId, message, modality)` | profileId, message, 'text'\|'voice' | Add message to modality buffer |
| `setMessages(profileId, messages, modality)` | profileId, messages[], 'text'\|'voice' | Set full history for modality |
| `buildOptimizedPayload(profileId, convId, {modality})` | profileId, convId, options | Build 80% reduced payload |
| `getProfileStats(profileId)` | profileId | Get stats for both modalities |
| `clearCache(profileId, modality)` | profileId, 'text'\|'voice'\|null | Clear specific or all modalities |

### Backend (sessionCache.js)

| Method | Parameters | Description |
|--------|------------|-------------|
| `initSession(userId, convId, profileId, modality)` | userId, convId, profileId, 'text'\|'voice' | Initialize session with modality |
| `getSessionContext(convId, includeMetadata)` | convId, boolean | Get cached identity |
| `getSessionModality(convId)` | convId | Get session's modality |
| `clearSession(convId)` | convId | Clear session cache |

### Chat Component (AISoulPartnerChat.jsx)

| Method | Parameters | Description |
|--------|------------|-------------|
| `handleSend(overrideContent, modality)` | content, 'text'\|'voice' | Send message with modality |
| `addUserVoiceTranscript(text)` | text | Add user speech to panel |
| `addLunaVoiceTranscript(text)` | text | Add Luna's response to panel |

---

## Key Benefits

1. **Topic Isolation** - Career discussion in text won't affect relationship discussion in voice

2. **Context Preservation** - Each modality maintains its own "Story So Far"

3. **Token Efficiency** - 80%+ reduction per modality independently

4. **User Review** - Voice transcripts stored 5 days for later review

5. **Shared Identity** - Luna knows it's the same person across channels

6. **Natural Switching** - User can pause voice, type, resume voice seamlessly

---

## Hybrid Voice Provider System

### Overview

GENESIS supports multiple voice providers with automatic fallback:

```
                        VOICE STRATEGIES
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   GROQ_ONLY (Default)         OPENAI_FIRST (Hybrid)              │
│   ─────────────────          ────────────────────                │
│   Audio → Groq Whisper        Try OpenAI Realtime                │
│         → Text                    ↓                              │
│         → Claude                If unavailable                    │
│         → Response                ↓                              │
│                               Fallback to Groq                    │
│                                                                   │
│   OPENAI_ONLY (Native Voice)                                     │
│   ──────────────────────────                                     │
│   Audio → OpenAI Realtime (WebSocket)                            │
│         → Native processing (preserves tone, emotion)            │
│         → Direct audio response                                  │
│         → Plus: Text transcripts for display!                    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Paralinguistic Cue Detection

OpenAI Realtime API preserves emotional/tonal information that STT loses:

```
┌───────────────────────────────────────────────────────────────────┐
│                    PARALINGUISTIC CUES                            │
│                                                                   │
│   EMOTIONS           NON-VERBAL           PACING                 │
│   ────────           ──────────           ──────                 │
│   😊 happy           😮‍💨 sigh             ⚡ rushed              │
│   😢 sad             😄 laugh             🐢 slow                │
│   😤 frustrated      🤔 hesitation        ⏸️ pause               │
│   🎉 excited         🤫 whisper                                  │
│   😰 anxious         ❗ emphasis                                 │
│   😌 calm                                                        │
│   😞 disappointed                                                │
│   🌟 hopeful                                                     │
│                                                                   │
│   Displayed as badges under transcript messages:                 │
│   ┌─────────────────────────────────────┐                        │
│   │ "I guess I'll try again later..."  │                        │
│   │ 😤 frustrated  🤔 hesitant          │ ← Cue badges           │
│   └─────────────────────────────────────┘                        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Voice Settings Panel

Users can configure voice behavior through the settings panel:

```
┌───────────────────────────────────────────────────────────────────┐
│  🎤 Voice Settings                              [Connected]       │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 🎯 Groq STT                                         [Active] │ │
│  │ Speech-to-Text pipeline. Reliable and accurate.              │ │
│  │ + Reliable  + Free tier  - No emotion detection              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 🔄 Hybrid                                                    │ │
│  │ Try OpenAI native, fallback to Groq if unavailable.         │ │
│  │ + Best of both  + Auto-fallback  - Requires OpenAI key      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ⚡ Native Voice                                              │ │
│  │ OpenAI Realtime API. Fastest with emotion detection.        │ │
│  │ + Sub-200ms latency  + Emotion detection  - Higher cost     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ─────────────────────────────────────────────────────────────── │
│                                                                   │
│  😊 Show Emotional Cues                                  [ON]   │
│                                                                   │
│  ┌─ Status ─────────────────────────────────────────────────┐   │
│  │ Active Provider: ● Groq Whisper                          │   │
│  │ Cue Detection:   Not available                           │   │
│  │ Strategy:        Groq STT                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Provider Architecture

```
                          VOICE MANAGER
                               │
            ┌──────────────────┴──────────────────┐
            │                                      │
            ▼                                      ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│  GroqWhisperProvider    │         │  OpenAIRealtimeProvider │
│  (groqWhisperProvider.js)│         │  (openaiRealtimeProvider.js)
│                         │         │                         │
│  supportsCues: false    │         │  supportsCues: true     │
│  latency: ~200ms        │         │  latency: <200ms        │
│  mode: batch            │         │  mode: streaming        │
│                         │         │                         │
│  processAudio(path)     │         │  streamAudio(chunk)     │
│  └→ transcribeWithGroq  │         │  └→ WebSocket send      │
│      └→ EnrichedTranscript │      │      └→ transcript + cues│
└─────────────────────────┘         └─────────────────────────┘
            │                                      │
            └──────────────────┬───────────────────┘
                               │
                               ▼
                    VoiceProviderInterface
                    (voiceProvider.js)
                               │
                    ┌──────────┴──────────┐
                    │                      │
             onTranscript()          onCue()
                    │                      │
                    └──────────┬───────────┘
                               │
                               ▼
                    VoiceTranscriptPanel
                    (VoiceTranscriptPanel.jsx)
```

### Switching Providers

```javascript
// Via VoiceSettingsPanel component
onStrategyChange={(newStrategy) => {
  // VOICE_STRATEGIES.GROQ_ONLY
  // VOICE_STRATEGIES.OPENAI_FIRST
  // VOICE_STRATEGIES.OPENAI_ONLY
  setVoiceStrategy(newStrategy);
}}

// Backend VoiceManager handles the switch
voiceManager.setStrategy('openai_first');
// Automatically reinitializes with new provider
```

---

## WebSocket Bridge Architecture

### Real-time Audio Streaming Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  useRealtimeVoice Hook                                        │   │
│  │  ├── isRecording, isSpeaking, isLunaSpeaking                 │   │
│  │  ├── startSession(), stopSession()                           │   │
│  │  ├── toggleRecording(), commit()                             │   │
│  │  └── userTranscripts[], lunaTranscripts[], cues[]            │   │
│  └──────────────────────┬───────────────────────────────────────┘   │
│                         │                                            │
│         ┌───────────────┼───────────────┐                           │
│         │               │               │                           │
│         ▼               ▼               ▼                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐                │
│  │ audioCapture│  │voiceWS       │  │AudioContext │                │
│  │             │  │(WebSocket)   │  │(Playback)   │                │
│  │ Mic → PCM16 │  │              │  │             │                │
│  │ VAD         │  │ send/receive │  │ PCM16 → Out │                │
│  └──────┬──────┘  └───────┬──────┘  └──────▲──────┘                │
│         │                 │                 │                        │
│         └────────►────────┴─────────────────┘                        │
│                           │ WebSocket                                │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            ▼ ws://host/voice
┌───────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  voiceWebSocketServer                                           │  │
│  │  ├── Client session management                                 │  │
│  │  ├── Audio routing to voiceManager                            │  │
│  │  └── Transcript/cue/audio broadcast back to client            │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
│                               │                                       │
│                               ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  voiceManager                                                   │  │
│  │  ├── Strategy: GROQ_ONLY | OPENAI_FIRST | OPENAI_ONLY         │  │
│  │  └── Routes to active provider                                 │  │
│  └────────────────────────────┬───────────────────────────────────┘  │
│                               │                                       │
│              ┌────────────────┴────────────────┐                     │
│              ▼                                  ▼                     │
│  ┌─────────────────────────┐     ┌─────────────────────────────┐    │
│  │ GroqWhisperProvider     │     │ OpenAIRealtimeProvider      │    │
│  │ (STT → Text → Claude)   │     │ (Native voice + cues)       │    │
│  └─────────────────────────┘     └─────────────────────────────┘    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

### WebSocket Protocol

```
CLIENT → SERVER:
─────────────────
{ type: 'start_session', profileId, sessionId?, strategy? }
{ type: 'audio', data: '<base64 PCM16>' }
{ type: 'commit' }           // End of utterance
{ type: 'end_session' }
{ type: 'set_strategy', strategy }

SERVER → CLIENT:
─────────────────
{ type: 'connected', clientId, availableStrategies }
{ type: 'session_started', sessionId, provider, supportsCues }
{ type: 'transcript', speaker, text, cues[], timestamp, provider }
{ type: 'audio', data: '<base64 PCM16>' }  // Luna's voice
{ type: 'cue', cue: { type, confidence, context } }
{ type: 'session_ended', transcripts }
{ type: 'error', message }
```

### Audio Format

- **Sample Rate**: 24kHz (OpenAI Realtime standard)
- **Channels**: Mono
- **Format**: PCM16 (signed 16-bit integer)
- **Chunk Size**: 4096 samples (~170ms per chunk)

---

## File References

### Core Components

| File | Purpose |
|------|---------|
| [conversationCache.js](../src/services/conversationCache.js) | Frontend modality-isolated message cache |
| [sessionCache.js](../functions/memory/sessionCache.js) | Backend session cache with modality tracking |
| [aiSoulPartnerService.js](../src/services/aiSoulPartnerService.js) | API layer with modality parameter |
| [AISoulPartnerChat.jsx](../src/components/aiSoulPartner/AISoulPartnerChat.jsx) | Main chat component |

### Voice Provider System

| File | Purpose |
|------|---------|
| [voiceProvider.js](../backend/voice/voiceProvider.js) | Voice provider abstraction interface |
| [voiceManager.js](../backend/voice/voiceManager.js) | Unified voice manager with strategy switching |
| [openaiRealtimeProvider.js](../backend/voice/openaiRealtimeProvider.js) | OpenAI Realtime API integration |
| [groqWhisperProvider.js](../backend/voice/groqWhisperProvider.js) | Groq Whisper STT provider |
| [VoiceSettingsPanel.jsx](../src/components/aiSoulPartner/VoiceSettingsPanel.jsx) | Voice settings UI with provider toggle |

### WebSocket Bridge (Real-time Streaming)

| File | Purpose |
|------|---------|
| [voiceWebSocketServer.js](../backend/voice/voiceWebSocketServer.js) | Backend WebSocket server for audio streaming |
| [voiceWebSocketService.js](../src/services/voiceWebSocketService.js) | Frontend WebSocket client with reconnection |
| [audioCapture.js](../src/services/audioCapture.js) | Microphone capture with VAD (voice activity detection) |
| [useRealtimeVoice.js](../src/hooks/useRealtimeVoice.js) | Unified hook for real-time voice communication |

### Transcript Components

| File | Purpose |
|------|---------|
| [VoiceTranscriptPanel.jsx](../src/components/aiSoulPartner/VoiceTranscriptPanel.jsx) | Side-by-side transcript view with cue display |
| [MomentumScrollControl.jsx](../src/components/aiSoulPartner/MomentumScrollControl.jsx) | Seesaw time navigation |

### Legacy/Existing

| File | Purpose |
|------|---------|
| [groqWhisper.js](../backend/stt/groqWhisper.js) | Original speech-to-text service |

---

## Cloud Run Production Deployment

As of December 28, 2024, voice processing runs on Cloud Run for production:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION VOICE INFRASTRUCTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   PRIMARY: Cloud Run WebSocket Server                                       │
│   ─────────────────────────────────                                        │
│   Endpoint: wss://luna-voice-backend-sjpjwnbsmq-uc.a.run.app               │
│                                                                             │
│   Benefits:                                                                 │
│   • API keys secured server-side (not exposed in browser)                  │
│   • Rate limiting enforced                                                 │
│   • Session affinity for WebSocket connections                             │
│   • Auto-scaling (0-10 instances)                                          │
│                                                                             │
│   FALLBACK: Browser-Based Processing                                        │
│   ────────────────────────────────                                         │
│   Activated when Cloud Run is unreachable                                  │
│                                                                             │
│   • Web Speech API for STT                                                 │
│   • Direct ElevenLabs API calls                                            │
│   • API keys exposed (less secure but functional)                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Health Check

```bash
curl https://luna-voice-backend-sjpjwnbsmq-uc.a.run.app/health
```

Returns service status, latency, and provider availability.

---

*"Two rivers from the same mountain, flowing to the same sea, never crossing paths."*

— GENESIS OS Philosophy
