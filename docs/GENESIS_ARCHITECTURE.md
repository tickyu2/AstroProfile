# GENESIS Voice & Text Architecture

Complete documentation of the Luna AI communication stack - voice streaming, text messaging, primary services, and fallback systems.

**Related Documentation:**
- [Simultaneous Text & Voice Architecture](./SIMULTANEOUS_TEXT_VOICE_ARCHITECTURE.md) - Modality isolation details
- [Production Deployment Guide](../backend/PRODUCTION_DEPLOYMENT.md) - Cloud Run setup

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Voice Flow - Primary (Cloud Run)](#voice-flow---primary-cloud-run)
3. [Voice Flow - Fallback (Browser)](#voice-flow---fallback-browser)
4. [Text Message Flow](#text-message-flow)
5. [Provider Strategies](#provider-strategies)
6. [Component Reference](#component-reference)
7. [Service Reference](#service-reference)
8. [Backend Reference](#backend-reference)
9. [Configuration](#configuration)
10. [Deployment](#deployment)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GENESIS / Luna AI                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────┐   │
│   │    TEXT     │     │    VOICE    │     │      DUAL CHANNEL          │   │
│   │   CHANNEL   │     │   CHANNEL   │     │   (Simultaneous Mode)      │   │
│   └──────┬──────┘     └──────┬──────┘     └─────────────┬───────────────┘   │
│          │                   │                         │                    │
│          ▼                   ▼                         ▼                    │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    AISoulPartnerChat.jsx                            │   │
│   │                    (Main Interface Component)                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Dual Channel**: Text and voice operate independently or simultaneously
2. **Primary + Fallback**: Cloud Run primary, browser-based fallback
3. **Provider Agnostic**: Swappable STT/TTS/LLM providers
4. **Graceful Degradation**: System continues with reduced features if services fail

---

## Voice Flow - Primary (Cloud Run)

The primary voice path uses a Cloud Run WebSocket server for secure API key handling and low-latency processing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRIMARY VOICE FLOW                                  │
│                        (Cloud Run WebSocket)                                │
└─────────────────────────────────────────────────────────────────────────────┘

BROWSER                              CLOUD RUN                         EXTERNAL APIs
───────                              ─────────                         ─────────────

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
┌──────────────┐
│useRealtimeVoice│ React Hook
│    .js       │ manages state
└──────┬───────┘
       │
       ▼
┌──────────────┐         WSS          ┌──────────────┐
│voiceWebSocket│ ◄──────────────────► │voiceWebSocket│
│  Service.js  │    Binary Audio      │  Server.js   │
└──────┬───────┘                      └──────┬───────┘
       │                                     │
       │                                     ▼
       │                              ┌──────────────┐
       │                              │ voiceManager │ Strategy Router
       │                              │    .js       │
       │                              └──────┬───────┘
       │                                     │
       │                    ┌────────────────┼────────────────┐
       │                    ▼                ▼                ▼
       │             ┌────────────┐   ┌────────────┐   ┌────────────┐
       │             │   Groq     │   │  OpenAI    │   │  Fallback  │
       │             │  Whisper   │   │  Realtime  │   │  (local)   │
       │             │ (STT only) │   │ (native)   │   │            │
       │             └─────┬──────┘   └─────┬──────┘   └────────────┘
       │                   │                │
       │                   ▼                │
       │             ┌────────────┐         │
       │             │   Claude   │         │ (Audio-to-Audio)
       │             │    LLM     │         │
       │             └─────┬──────┘         │
       │                   │                │
       │                   ▼                │
       │             ┌────────────┐         │
       │             │ ElevenLabs │         │
       │             │    TTS     │◄────────┘
       │             └─────┬──────┘
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────┐
│  Transcript  │   │    Audio     │
│   Display    │   │   Playback   │
│   Panel      │   │  (WebAudio)  │
└──────────────┘   └──────────────┘
```

### Primary Voice Path Steps

| Step | Component | Action |
|------|-----------|--------|
| 1 | `audioCapture.js` | Captures microphone, applies noise suppression, converts to PCM16 @ 24kHz |
| 2 | `useRealtimeVoice.js` | React hook manages recording state, VAD, barge-in detection |
| 3 | `voiceWebSocketService.js` | Sends audio chunks via WebSocket to Cloud Run |
| 4 | `voiceWebSocketServer.js` | Receives audio, routes to voice manager |
| 5 | `voiceManager.js` | Applies strategy (Groq/OpenAI), orchestrates providers |
| 6 | `groqWhisper.js` | Transcribes audio to text (if Groq strategy) |
| 7 | Claude LLM | Generates Luna's response text |
| 8 | `elevenLabs.js` | Converts response to speech audio |
| 9 | WebSocket | Streams audio back to browser |
| 10 | `voiceWebSocketService.js` | Plays audio via WebAudio API |

### WebSocket Messages

```javascript
// Client → Server
{ type: 'start_session', profileId, strategy, preset }
{ type: 'audio', data: '<base64 PCM16>' }
{ type: 'commit' }  // End of utterance
{ type: 'set_strategy', strategy }
{ type: 'set_preset', preset }
{ type: 'end_session' }

// Server → Client
{ type: 'session_started', sessionId, provider }
{ type: 'transcript', text, isFinal, speaker }
{ type: 'audio', data: '<base64 audio>' }
{ type: 'cue', cue, confidence }  // Paralinguistic cues
{ type: 'playback_ended' }
{ type: 'error', message }
{ type: 'rate_limited', message, retryAfter }
```

---

## Voice Flow - Fallback (Browser)

When Cloud Run is unavailable, the system falls back to browser-based processing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FALLBACK VOICE FLOW                                  │
│                         (Browser-Based)                                     │
└─────────────────────────────────────────────────────────────────────────────┘

BROWSER (All Processing Local)                              EXTERNAL APIs
───────────────────────────────                              ─────────────

┌──────────────┐
│  Microphone  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Web Speech   │ Browser STT
│    API       │ (SpeechRecognition)
└──────┬───────┘
       │ Text
       ▼
┌──────────────┐                    ┌──────────────┐
│  useVoice.js │ ──────────────────►│  Claude API  │
│   (Hook)     │◄────────────────── │  (Direct)    │
└──────┬───────┘    Response Text   └──────────────┘
       │
       ▼
┌──────────────┐                    ┌──────────────┐
│streamingTTS  │ ──────────────────►│ ElevenLabs   │
│  Service.js  │◄────────────────── │    TTS       │
└──────┬───────┘    Audio Chunks    └──────────────┘
       │
       ▼
┌──────────────┐
│    Audio     │
│   Playback   │
└──────────────┘
```

### Fallback Activation Triggers

| Trigger | Detection |
|---------|-----------|
| Cloud Run unreachable | Health check fails (5s timeout) |
| WebSocket connection fails | Connection error or timeout |
| Rate limited | Server returns 4029 close code |
| Explicit user choice | User selects "Browser Mode" |

### Fallback Capabilities

| Feature | Primary (Cloud Run) | Fallback (Browser) |
|---------|--------------------|--------------------|
| STT Provider | Groq Whisper | Web Speech API |
| TTS Provider | ElevenLabs | ElevenLabs (direct) |
| API Key Security | Server-side | Exposed in browser |
| Paralinguistic Cues | Yes (OpenAI mode) | No |
| Rate Limiting | Server-enforced | None |
| Latency | 400-800ms | 600-1500ms |

---

## Text Message Flow

Text messaging operates independently of voice, with optional TTS for responses.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEXT MESSAGE FLOW                                   │
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
│  │ Mode       │    │Constitutional│   │ Pattern    │         │
│  │ Detection  │───►│ Intelligence │───►│ Extraction │         │
│  │(WITNESS/   │    │ (routing)   │    │            │         │
│  │DIALOGUE/   │    │             │    │            │         │
│  │GUIDE)      │    │             │    │            │         │
│  └────────────┘    └──────┬──────┘    └────────────┘         │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
                    ┌────────────┐
                    │aiSoulPartner│
                    │ Service.js │
                    └──────┬─────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  Claude  │ │   Groq   │ │  Ollama  │
       │   API    │ │   API    │ │  (local) │
       └────┬─────┘ └────┬─────┘ └────┬─────┘
            │            │            │
            └────────────┴────────────┘
                         │
                         ▼
                  ┌────────────┐
                  │  Response  │
                  │    Text    │
                  └──────┬─────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
     ┌────────────┐            ┌────────────┐
     │   Chat     │            │  Optional  │
     │  Display   │            │    TTS     │
     └────────────┘            │ (useVoice) │
                               └────────────┘
```

### Text Processing Pipeline

| Step | Component | Function |
|------|-----------|----------|
| 1 | `AISoulPartnerChat.jsx` | Receives user input |
| 2 | Mode Detection | Determines WITNESS/DIALOGUE/GUIDE mode |
| 3 | Constitutional Intelligence | Routes to appropriate personality |
| 4 | `aiSoulPartnerService.js` | Calls LLM API |
| 5 | Pattern Extraction | Extracts insights for timeline |
| 6 | Response Display | Shows in chat UI |
| 7 | Optional TTS | `useVoice.js` speaks response if enabled |

---

## Provider Strategies

Three voice strategies available, selectable at runtime:

### Strategy Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROVIDER STRATEGIES                                 │
└─────────────────────────────────────────────────────────────────────────────┘

GROQ_ONLY (Default - Most Reliable)
───────────────────────────────────
Audio ──► Groq Whisper ──► Text ──► Claude LLM ──► Text ──► ElevenLabs ──► Audio
           (STT)                                              (TTS)
Latency: 400-800ms
Cues: No

OPENAI_FIRST (Best Quality)
───────────────────────────
           ┌──► OpenAI Realtime ──► Audio + Cues
           │    (native audio)
Audio ─────┤
           │    (fallback if OpenAI fails)
           └──► Groq Whisper ──► Claude ──► ElevenLabs
Latency: 200-400ms (OpenAI) / 400-800ms (fallback)
Cues: Yes (OpenAI path only)

OPENAI_ONLY (Fastest)
─────────────────────
Audio ──► OpenAI Realtime ──► Audio + Paralinguistic Cues
          (native audio-to-audio)
Latency: ~200ms
Cues: Yes (emotions, sighs, laughter, etc.)
```

### Strategy Selection

```javascript
// In VoiceSettingsPanel.jsx or programmatically:
voiceWS.setStrategy('groq_only');    // Reliable, cost-effective
voiceWS.setStrategy('openai_first'); // Best of both
voiceWS.setStrategy('openai_only');  // Fastest, emotion detection
```

---

## Component Reference

### Frontend Components (`src/components/aiSoulPartner/`)

| Component | File | Purpose |
|-----------|------|---------|
| **AISoulPartnerChat** | `AISoulPartnerChat.jsx` | Main chat interface, manages conversations, voice integration, constitutional intelligence |
| **VoiceTranscriptPanel** | `VoiceTranscriptPanel.jsx` | Real-time transcript display with user/Luna columns, cue visualization, 5-day persistence |
| **VoiceSettingsPanel** | `VoiceSettingsPanel.jsx` | Voice configuration UI - strategy switching, noise presets, quality selection |
| **MultiSpeakerTranscriptPanel** | `MultiSpeakerTranscriptPanel.jsx` | Speaker diarization display with color coding |
| **DiarizationSessionSetup** | `DiarizationSessionSetup.jsx` | Multi-speaker session configuration |
| **MomentumScrollControl** | `MomentumScrollControl.jsx` | Time-based transcript navigation |

---

## Service Reference

### Frontend Services (`src/services/`)

| Service | File | Primary Functions |
|---------|------|-------------------|
| **Voice WebSocket** | `voiceWebSocketService.js` | `connect()`, `sendAudio()`, `commit()`, `onTranscript()`, `onAudio()` |
| **Audio Capture** | `audioCapture.js` | `start()`, `stop()`, `onAudioData()`, `onVoiceActivity()` |
| **Streaming TTS** | `streamingTTSService.js` | `streamText()`, `stop()` - progressive playback |
| **Noise Suppression** | `noiseSuppressionService.js` | Noise gate, spectral subtraction, calibration |
| **Voice Preferences** | `voicePreferencesService.js` | Voice profiles, ElevenLabs integration |
| **Speaker Profile** | `speakerProfileService.js` | Speaker diarization management |
| **AI Soul Partner** | `aiSoulPartnerService.js` | `sendMessage()`, constitutional intelligence |

### Frontend Hooks (`src/hooks/`)

| Hook | File | Purpose |
|------|------|---------|
| **useRealtimeVoice** | `useRealtimeVoice.js` | Real-time voice state, recording control, WebSocket management |
| **useVoice** | `useVoice.js` | TTS control, voice playback, auto-speak |

### Frontend Config (`src/config/`)

| Config | File | Exports |
|--------|------|---------|
| **Voice Config** | `voiceConfig.js` | `VOICE_MODE`, `getWebSocketUrl()`, `detectBestVoiceMode()`, `AUDIO_PRESETS` |

---

## Backend Reference

### Voice System (`backend/voice/`)

| Module | File | Purpose |
|--------|------|---------|
| **Voice Manager** | `voiceManager.js` | Provider orchestration, strategy routing |
| **WebSocket Server** | `voiceWebSocketServer.js` | WebSocket bridge, session management |
| **OpenAI Provider** | `openaiRealtimeProvider.js` | Native OpenAI Realtime integration |
| **Groq Provider** | `groqWhisperProvider.js` | Groq Whisper STT pipeline |

### STT Services (`backend/stt/`)

| Module | File | Purpose |
|--------|------|---------|
| **Groq Whisper** | `groqWhisper.js` | `transcribeWithGroqWhisper()`, `isGroqWhisperAvailable()` |

### TTS Services (`backend/tts/`)

| Module | File | Purpose |
|--------|------|---------|
| **ElevenLabs** | `elevenLabs.js` | `speakWithElevenLabs()`, emotion-aware voice settings |
| **Emotion Adapter** | `emotionTtsAdapter.js` | Emotion → voice parameter mapping |

### Server Entry Points (`backend/`)

| File | Purpose |
|------|---------|
| `server.js` | Local development server |
| `server-cloudrun.js` | Cloud Run production server |

---

## Configuration

### Environment Variables

**Frontend (`.env.local`)**
```bash
# Cloud Run WebSocket endpoint
VITE_VOICE_WS_URL=wss://luna-voice-backend-sjpjwnbsmq-uc.a.run.app

# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=astroprofile-391e6

# Claude API (fallback mode only)
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Backend (Cloud Run Secrets)**
```bash
GROQ_API_KEY=gsk_...          # Required for Groq Whisper STT
ELEVENLABS_API_KEY=...        # Required for TTS
OPENAI_API_KEY=sk-...         # Optional for OpenAI Realtime
```

### Audio Quality Presets

| Preset | STT Model | TTS Model | Target Latency |
|--------|-----------|-----------|----------------|
| `fast` | whisper-large-v3-turbo | eleven_turbo_v2_5 | 400-800ms |
| `balanced` | whisper-large-v3-turbo | eleven_turbo_v2_5 | 600-1200ms |
| `quality` | whisper-large-v3 | eleven_multilingual_v2 | 900-2000ms |

### Voice Profiles (Luna Voices)

```javascript
LUNA_VOICES = {
  affirmer:  { color: '#FF6B6B', constitutions: ['Fire', 'Metal'] },   // Words of Affirmation
  present:   { color: '#4ECDC4', constitutions: ['Water', 'Wood'] },   // Quality Time
  embrace:   { color: '#F7DC6F', constitutions: ['Water', 'Earth'] },  // Physical Touch
  guardian:  { color: '#45B7D1', constitutions: ['Wood', 'Earth'] },   // Acts of Service
  delight:   { color: '#FF9FF3', constitutions: ['Fire', 'Metal'] }    // Receiving Gifts
}
```

---

## Deployment

### Cloud Run Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLOUD RUN                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  luna-voice-backend                                                 │   │
│   │  wss://luna-voice-backend-sjpjwnbsmq-uc.a.run.app                  │   │
│   │                                                                     │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│   │  │    HTTP     │  │  WebSocket  │  │   Health    │                 │   │
│   │  │   :8080     │  │   Server    │  │   /health   │                 │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│   │                                                                     │   │
│   │  Secrets:                                                           │   │
│   │  - GROQ_API_KEY (Secret Manager)                                   │   │
│   │  - ELEVENLABS_API_KEY (Secret Manager)                             │   │
│   │                                                                     │   │
│   │  Config:                                                            │   │
│   │  - min-instances: 0 (scale to zero)                                │   │
│   │  - max-instances: 10                                               │   │
│   │  - memory: 512Mi                                                   │   │
│   │  - session-affinity: enabled                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Deployment Commands

```bash
# From backend/ directory
gcloud builds submit . --config=deploy/cloudbuild.yaml

# Health check
curl https://luna-voice-backend-sjpjwnbsmq-uc.a.run.app/health
```

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-12-28T...",
  "uptime": 123.45,
  "services": {
    "groq": true,
    "elevenlabs": true,
    "secrets": {
      "GROQ_API_KEY": "configured",
      "ELEVENLABS_API_KEY": "configured"
    }
  },
  "connections": 0,
  "rateLimiter": {
    "activeIPs": 0,
    "limits": { ... }
  }
}
```

---

## Quick Reference

### Starting Voice Session

```javascript
import { voiceWS } from './services/voiceWebSocketService';

// Connect (auto-detects Cloud Run vs fallback)
await voiceWS.connect();

// Start session
await voiceWS.startSession({
  profileId: 'user123',
  strategy: 'groq_only',
  preset: 'balanced'
});

// Listen for transcripts
voiceWS.onTranscript((t) => console.log(t.text));

// Listen for audio
voiceWS.onAudio((audio) => voiceWS.playAudio(audio));
```

### Sending Text with Voice Response

```javascript
import { useVoice } from './hooks/useVoice';

const { speak, isPlaying } = useVoice();

// Speak text
await speak("Hello, I'm Luna.");
```

### Checking Voice Mode

```javascript
const mode = voiceWS.getVoiceMode();
// Returns: 'cloud_run' | 'local' | 'browser'

const isFallback = voiceWS.isFallbackMode();
// Returns: true if using browser fallback
```

---

## File Structure Summary

```
src/
├── components/aiSoulPartner/
│   ├── AISoulPartnerChat.jsx      # Main chat UI
│   ├── VoiceTranscriptPanel.jsx   # Transcript display
│   ├── VoiceSettingsPanel.jsx     # Voice config
│   └── ...
├── hooks/
│   ├── useVoice.js                # TTS hook
│   └── useRealtimeVoice.js        # Real-time voice hook
├── services/
│   ├── voiceWebSocketService.js   # WebSocket client
│   ├── audioCapture.js            # Mic capture
│   ├── streamingTTSService.js     # Progressive TTS
│   └── ...
└── config/
    └── voiceConfig.js             # Voice configuration

backend/
├── server-cloudrun.js             # Cloud Run entry
├── voice/
│   ├── voiceManager.js            # Provider orchestration
│   ├── voiceWebSocketServer.js    # WebSocket server
│   ├── groqWhisperProvider.js     # Groq STT
│   └── openaiRealtimeProvider.js  # OpenAI native
├── stt/
│   └── groqWhisper.js             # Groq Whisper API
├── tts/
│   └── elevenLabs.js              # ElevenLabs TTS
└── config/
    └── audioQuality.js            # Quality presets
```

---

*Last Updated: December 28, 2024*
*Part of GENESIS Voice Mode - Production Deployment*
