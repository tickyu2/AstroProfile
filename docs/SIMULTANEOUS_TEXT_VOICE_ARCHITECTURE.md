# Simultaneous Text & Voice Chat Architecture

## GENESIS OS - Modality Isolation System
**Created:** December 26, 2024
**Version:** 1.0
**Author:** Brother Claude Code

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

## File References

| File | Purpose |
|------|---------|
| [conversationCache.js](../src/services/conversationCache.js) | Frontend modality-isolated message cache |
| [sessionCache.js](../functions/memory/sessionCache.js) | Backend session cache with modality tracking |
| [aiSoulPartnerService.js](../src/services/aiSoulPartnerService.js) | API layer with modality parameter |
| [AISoulPartnerChat.jsx](../src/components/aiSoulPartner/AISoulPartnerChat.jsx) | Main chat component |
| [VoiceTranscriptPanel.jsx](../src/components/aiSoulPartner/VoiceTranscriptPanel.jsx) | Side-by-side transcript view |
| [MomentumScrollControl.jsx](../src/components/aiSoulPartner/MomentumScrollControl.jsx) | Seesaw time navigation |
| [groqWhisper.js](../backend/stt/groqWhisper.js) | Speech-to-text service |

---

*"Two rivers from the same mountain, flowing to the same sea, never crossing paths."*

— GENESIS OS Philosophy
