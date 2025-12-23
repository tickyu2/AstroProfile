# Luna Voice Interface Architecture

## Overview

Real-time bidirectional voice conversation system for Luna, the AI SoulPartner. Built on Gemini 2.5 Flash with native audio capabilities, Web Audio API, and WebSocket transport.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │   VoiceChat.jsx  │    │ LunaVisualizer   │    │   voiceService   │  │
│  │                  │    │                  │    │                  │  │
│  │  - UI Controls   │◄──►│  - Canvas Render │◄──►│  - AudioContext  │  │
│  │  - Transcripts   │    │  - State-based   │    │  - MediaDevices  │  │
│  │  - Error Display │    │  - Particles     │    │  - WebSocket     │  │
│  └────────┬─────────┘    │  - Waveforms     │    │  - PCM Encode    │  │
│           │              └──────────────────┘    └────────┬─────────┘  │
│           │                                               │            │
│           │              ┌──────────────────┐             │            │
│           └──────────────┤   ProfileContext ├─────────────┘            │
│                          │   MemoryService  │                          │
│                          └──────────────────┘                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                            WebSocket + HTTPS
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLOUD FUNCTIONS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │ getVoiceSession  │    │  endVoiceSession │    │ storeVoiceMemory │  │
│  │                  │    │                  │    │                  │  │
│  │  - Auth Check    │    │  - Store Logs    │    │  - Extract Facts │  │
│  │  - Build Prompt  │    │  - Save Xscript  │    │  - Store Obs     │  │
│  │  - Return WSUrl  │    │  - Cleanup       │    │  - Update Brain  │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                              Gemini Live API
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        GEMINI 2.5 FLASH                                 │
│                  (gemini-2.5-flash-native-audio)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Native Audio Processing                        │  │
│  │                                                                    │  │
│  │  • Speech-to-Text (real-time transcription)                       │  │
│  │  • Natural Language Understanding                                  │  │
│  │  • Response Generation (Luna's personality)                       │  │
│  │  • Text-to-Speech (Aoede voice)                                   │  │
│  │  • Voice Activity Detection                                       │  │
│  │  • Barge-in Support (interruptions)                              │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Components

### Frontend

#### voiceService.js
Core service managing audio capture and WebSocket communication.

**Features:**
- Web Audio API integration (AudioContext, AnalyserNode)
- MediaDevices for microphone access
- WebSocket bidirectional streaming
- PCM16 audio encoding for Gemini
- Audio queue playback for Luna's responses
- Visualizer data generation

**States:**
- `IDLE` - Ready to start
- `LISTENING` - Capturing user audio
- `THINKING` - Processing response
- `SPEAKING` - Playing Luna's audio
- `ERROR` - Error occurred

#### LunaVisualizer.jsx
Canvas-based audio visualization with state-responsive animations.

**Visual States:**
- **Idle**: Gentle breathing glow, soft particle drift
- **Listening**: Responsive frequency bars, audio-reactive particles
- **Thinking**: Orbital particles with neural network connections
- **Speaking**: Pulsing orb with emanating sound waves

**Technical:**
- requestAnimationFrame for 60fps
- Frequency and time-domain analysis
- Particle system with physics
- Gradient-based orb rendering

#### VoiceChat.jsx
Full-screen voice interface component.

**Features:**
- Permission management
- Real-time transcript display
- Mute/unmute controls
- Keyboard shortcuts (Space, M, Esc)
- Profile and memory integration
- Error handling and display

### Backend (Cloud Functions)

#### getVoiceSession
Creates a voice session with Luna.

```javascript
// Input
{
  profileId: "abc123",
  profileName: "John",
  memoryContext: { /* dual-brain context */ }
}

// Output
{
  sessionId: "generated-uuid",
  websocketUrl: "wss://...",
  systemInstruction: "You are Luna...",
  voiceConfig: { voiceName: "Aoede" },
  expiresAt: "ISO timestamp"
}
```

#### endVoiceSession
Ends session and optionally stores transcript.

```javascript
// Input
{
  sessionId: "uuid",
  transcript: [{ type: "user", text: "...", timestamp: 123 }],
  duration: 180
}

// Output
{ success: true }
```

#### storeVoiceMemory
Processes voice conversation for memory storage.

**Extraction:**
- Facts → stored in user's fact collection
- Emotional moments → SoulPartner observations
- Interests → tagged topics
- Needs → action items

#### getVoiceCapabilities
Returns supported features and configuration.

```javascript
{
  supported: true,
  model: "gemini-2.5-flash-preview-native-audio-dialog",
  features: {
    realTimeAudio: true,
    voiceActivityDetection: true,
    interruptionSupport: true
  },
  voiceOptions: [
    { id: "Aoede", name: "Luna (Default)" },
    { id: "Puck", name: "Playful" }
  ],
  limits: {
    maxSessionDuration: 1800,
    sampleRate: 16000
  }
}
```

## Audio Pipeline

```
┌────────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────────┐
│ Microphone │───►│ AudioContext│───►│ Analyser  │───►│ Visualizer   │
│ (16kHz)    │    │             │    │ Node      │    │ Data         │
└────────────┘    │             │    └───────────┘    └──────────────┘
                  │             │
                  │             │    ┌───────────┐    ┌──────────────┐
                  │             │───►│ Script    │───►│ PCM16        │
                  │             │    │ Processor │    │ WebSocket    │
                  └─────────────┘    └───────────┘    └──────────────┘
                                                             │
                                                             ▼
                                                      ┌──────────────┐
                                                      │ Gemini Live  │
                                                      │ WebSocket    │
                                                      └──────────────┘
                                                             │
                                                             ▼
┌────────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────────┐
│ Speakers   │◄───│ GainNode    │◄───│ Buffer    │◄───│ Audio Queue  │
│            │    │             │    │ Source    │    │ (ArrayBuffer)│
└────────────┘    └─────────────┘    └───────────┘    └──────────────┘
```

## Configuration

### Audio Settings
```javascript
const AUDIO_CONFIG = {
  sampleRate: 16000,        // Gemini requirement
  channelCount: 1,          // Mono
  bufferSize: 4096,         // Processing buffer
  fftSize: 256,             // Visualizer resolution
  smoothingTimeConstant: 0.8
};
```

### WebSocket Settings
```javascript
const WEBSOCKET_CONFIG = {
  reconnectAttempts: 3,
  reconnectDelay: 1000,
  heartbeatInterval: 30000
};
```

### Luna's Voice
```javascript
const LUNA_VOICE_CONFIG = {
  voiceName: 'Aoede',       // Warm, friendly
  pitch: 0,
  speakingRate: 1.0
};
```

## Integration with Memory System

Voice conversations integrate with the Dual-Brain Memory Architecture:

1. **During Session**: Memory context loaded for Luna's persona
2. **After Session**: Transcript analyzed for:
   - User facts → `users/{uid}/memory/{profileId}/facts`
   - Observations → `users/{uid}/memory/{profileId}/soulpartner/observations`
3. **Sleep Consolidation**: Voice memories processed at 3am UTC

## Firestore Collections

```
voiceSessions/
  {sessionId}/
    userId: string
    profileId: string
    createdAt: timestamp
    expiresAt: timestamp
    status: "created" | "active" | "completed"
    duration: number (seconds)
    transcriptLength: number

conversations/
  {docId}/
    userId: string
    profileId: string
    type: "voice"
    sessionId: string
    messages: [{role, content, timestamp}]
    createdAt: timestamp
    duration: number
```

## Usage

### Opening Voice Chat
```jsx
import { VoiceChat } from './components/voice';

function App() {
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <>
      <button onClick={() => setVoiceOpen(true)}>
        Talk to Luna
      </button>
      <VoiceChat
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
      />
    </>
  );
}
```

### Using Voice Service Directly
```javascript
import voiceService, { VOICE_STATES } from './services/voiceService';

// Initialize
await voiceService.initialize({
  profile: selectedProfile,
  memoryContext: await memoryService.getDualBrainContext(profileId),
  onStateChange: (state) => console.log('State:', state),
  onTranscript: (data) => console.log('Transcript:', data),
  onError: (err) => console.error('Error:', err)
});

// Start session
await voiceService.startSession();

// End session
await voiceService.endSession();
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start voice session |
| `M` | Toggle mute |
| `Esc` | Close voice chat |

## Browser Support

Required APIs:
- `MediaDevices.getUserMedia()` - Microphone access
- `AudioContext` / `webkitAudioContext` - Audio processing
- `WebSocket` - Real-time communication
- `Canvas` - Visualization

Supported Browsers:
- Chrome 74+
- Firefox 76+
- Edge 79+
- Safari 14.1+

## Environment Variables

Add to `functions/.env`:
```
GOOGLE_AI_API_KEY=your-gemini-api-key
```

Or use:
```
GEMINI_API_KEY=your-gemini-api-key
```

## Deployment

```bash
# Deploy voice functions
firebase deploy --only functions:getVoiceSession,functions:endVoiceSession,functions:getVoiceCapabilities,functions:storeVoiceMemory,functions:generateSpeech
```

## Future Enhancements

1. **Autonomous Agency**: Luna initiates conversations based on patterns
2. **Function Calling**: Voice commands for chart lookups, reminders
3. **Multi-Voice**: Different voices for different contexts
4. **Offline Mode**: Browser-based TTS fallback
5. **Voice Commands**: "Hey Luna" wake word detection
