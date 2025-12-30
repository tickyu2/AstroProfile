# GENESIS Turn-Taking System - Complete Flow Documentation

**Version:** 2.0
**Updated:** December 28, 2024
**Status:** Implemented

---

## Overview

The GENESIS turn-taking system provides intelligent, constitutional-aware conversation flow management. Unlike simple VAD (Voice Activity Detection) systems that use fixed silence thresholds, GENESIS combines:

1. **Prosodic Analysis** - Pitch contour, energy decay, speaking rate
2. **Linguistic Analysis** - Sentence completeness, filler words, turn-yield phrases
3. **Constitutional Awareness** - Personalized timing based on Enneagram type
4. **Turn-Yield Detection** - Explicit signals like "What do you think?" ("walkie-talkie" mode)

---

## Architecture Diagram

```
                                 USER SPEAKS
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AUDIO CAPTURE SERVICE                             │
│                         (audioCapture.js)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│   │   Microphone     │────▶│  Noise           │────▶│  PCM16           │   │
│   │   Stream         │     │  Suppression     │     │  Conversion      │   │
│   └──────────────────┘     └──────────────────┘     └────────┬─────────┘   │
│                                                               │              │
│                            ┌─────────────────────────────────┴──────────┐   │
│                            ▼                                            ▼   │
│                   ┌──────────────────┐                    ┌─────────────┐   │
│                   │  Voice Activity  │                    │  Send to    │   │
│                   │  Detection (VAD) │                    │  STT        │   │
│                   └────────┬─────────┘                    └─────────────┘   │
│                            │                                                 │
│              ┌─────────────┴──────────────┐                                 │
│              ▼                            ▼                                 │
│      ┌──────────────┐            ┌──────────────┐                          │
│      │  VOICE ON    │            │  VOICE OFF   │                          │
│      │  Reset timer │            │  Track       │                          │
│      │  Start turn  │            │  silence     │                          │
│      └──────────────┘            └──────┬───────┘                          │
│                                         │                                    │
│                                         ▼                                    │
│                           ┌─────────────────────────┐                       │
│                           │   TURN-TAKING MODEL     │◀── Partial Transcript │
│                           │   (turnTakingModel.js)  │    from STT           │
│                           └─────────────────────────┘                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TURN-TAKING MODEL                                  │
│                         (turnTakingModel.js)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   INPUTS:                                                                    │
│   ├── Audio buffer (Float32Array)                                           │
│   ├── Silence duration (ms)                                                 │
│   ├── Partial transcript (from STT)                                         │
│   └── User constitutional profile                                           │
│                                                                              │
│                            ┌─────────────────────────────────────────┐      │
│                            │         PROSODY ANALYZER                │      │
│                            │       (prosodyAnalyzer.js)              │      │
│                            ├─────────────────────────────────────────┤      │
│                            │  • YIN Pitch Detection (F0)             │      │
│                            │  • Pitch Trend: RISING/FALLING/FLAT     │      │
│                            │  • Energy Decay Rate                    │      │
│                            │  • Speaking Rate (syllables/sec)        │      │
│                            │  • Emphasis Detection                   │      │
│                            └───────────────┬─────────────────────────┘      │
│                                            │                                 │
│   ┌────────────────────────────────────────┼──────────────────────────────┐ │
│   │                                        ▼                              │ │
│   │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │ │
│   │  │  CONSTITUTIONAL  │  │  TURN-YIELD      │  │  LINGUISTIC        │  │ │
│   │  │  ADJUSTMENTS     │  │  DETECTION       │  │  COMPLETENESS      │  │ │
│   │  │                  │  │                  │  │                    │  │ │
│   │  │  Enneagram-based │  │  "What do you    │  │  Sentence endings  │  │ │
│   │  │  silence mult.   │  │  think?" etc.    │  │  Filler words      │  │ │
│   │  │  commit thresh.  │  │  "Over" "Done"   │  │  Conjunctions      │  │ │
│   │  └────────┬─────────┘  └────────┬─────────┘  └─────────┬──────────┘  │ │
│   │           │                     │                      │             │ │
│   │           └─────────────────────┼──────────────────────┘             │ │
│   │                                 ▼                                     │ │
│   │              ┌─────────────────────────────────┐                     │ │
│   │              │   CALCULATE TURN PROBABILITY    │                     │ │
│   │              │                                 │                     │ │
│   │              │   Silence contribution    0.40  │                     │ │
│   │              │   Prosodic signals        0.30  │                     │ │
│   │              │   Pitch trend             0.20  │                     │ │
│   │              │   Energy decay            0.15  │                     │ │
│   │              │   Linguistic complete     0.15  │                     │ │
│   │              │   Turn-yield boost    +0.25-0.50│                     │ │
│   │              │   Filler penalty         -0.20  │                     │ │
│   │              │   ────────────────────────────  │                     │ │
│   │              │   TOTAL: 0.0 - 1.0              │                     │ │
│   │              └───────────────┬─────────────────┘                     │ │
│   │                              │                                       │ │
│   └──────────────────────────────┼───────────────────────────────────────┘ │
│                                  ▼                                         │
│              ┌───────────────────────────────────────────┐                 │
│              │            MAKE DECISION                  │                 │
│              ├───────────────────────────────────────────┤                 │
│              │                                           │                 │
│              │   1. Strong turn-yield? ──▶ COMMIT        │                 │
│              │      ("What do you think?", "Over")       │                 │
│              │                                           │                 │
│              │   2. Below minimum silence? ──▶ CONTINUE  │                 │
│              │      (< 300ms)                            │                 │
│              │                                           │                 │
│              │   3. Backchannel detected? ──▶ CONTINUE   │                 │
│              │      ("yeah", "uh-huh")                   │                 │
│              │                                           │                 │
│              │   4. Weak turn-yield + pause? ──▶ COMMIT  │                 │
│              │      (question with 360ms+ silence)       │                 │
│              │                                           │                 │
│              │   5. High probability + threshold? ──▶ COMMIT              │
│              │      (prob >= 0.7, silence >= threshold)  │                 │
│              │                                           │                 │
│              │   6. Extended silence? ──▶ COMMIT         │                 │
│              │      (1.5x threshold with prob >= 0.5)    │                 │
│              │                                           │                 │
│              │   7. Approaching threshold? ──▶ WAIT      │                 │
│              │      (0.7x threshold)                     │                 │
│              │                                           │                 │
│              │   8. Default ──▶ CONTINUE                 │                 │
│              │                                           │                 │
│              └───────────────────────────────────────────┘                 │
│                                                                             │
│   OUTPUT: { action, probability, threshold, prosody, turnYield, reasoning }│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │         TURN ACTION                 │
                    ├─────────────────────────────────────┤
                    │                                     │
                    │   CONTINUE: Keep listening          │
                    │   ──────────────────────────        │
                    │   User still speaking or            │
                    │   thinking pause detected           │
                    │                                     │
                    │   WAIT: Probable end, wait more     │
                    │   ──────────────────────────        │
                    │   Close to threshold, ambiguous     │
                    │                                     │
                    │   COMMIT: Send for processing       │
                    │   ──────────────────────────        │
                    │   Turn complete, Luna responds      │
                    │                                     │
                    └─────────────────────────────────────┘
```

---

## File Structure

```
src/services/
├── audioCapture.js          # Microphone capture, VAD, orchestration
├── prosodyAnalyzer.js       # Pitch/energy/rate analysis
├── turnTakingModel.js       # Decision logic, constitutional awareness
├── noiseSuppressionService.js # Audio preprocessing
└── voiceOptimizationService.js # Quality presets
```

---

## Service Details

### 1. Audio Capture Service (`audioCapture.js`)

**Purpose:** Captures microphone audio, applies preprocessing, coordinates turn-taking

**Key Methods:**
```javascript
// Start full capture mode
await audioCapture.start();

// Start listening-only mode (for barge-in during TTS)
await audioCapture.startListening();

// Set user profile for constitutional awareness
audioCapture.setUserProfile(userProfile);

// Update partial transcript (from STT callbacks)
audioCapture.updatePartialTranscript(transcript);

// Register callbacks
audioCapture.onAudioData((pcm16) => {});
audioCapture.onVoiceActivity((isSpeaking) => {});
audioCapture.onSilence(() => {});
audioCapture.onBargeIn(() => {});
audioCapture.onTurnDecision((decision) => {});
```

**Processing Flow:**
1. Capture raw audio at 24kHz mono
2. Apply noise suppression (optional)
3. Calculate RMS for VAD
4. On voice detected: start utterance tracking
5. On silence detected: call turnTakingModel.decide()
6. Emit turn decision (CONTINUE/WAIT/COMMIT)

---

### 2. Prosody Analyzer (`prosodyAnalyzer.js`)

**Purpose:** Analyzes prosodic (non-verbal audio) features

**Signals Analyzed:**

| Signal | Description | Turn Implication |
|--------|-------------|------------------|
| **Pitch Trend** | Rising/Falling/Flat | Falling = statement end, Rising = question |
| **Energy Decay** | Volume trailing off | High decay = turn ending |
| **Speaking Rate** | Syllables per second | Slowing = deliberate ending |
| **Emphasis** | Volume spikes | Stress on important words |

**YIN Algorithm for Pitch:**
```javascript
// Pitch detection using autocorrelation
_detectPitch(audioBuffer) {
  // 1. Calculate difference function
  // 2. Cumulative mean normalized difference
  // 3. Find minimum below threshold
  // 4. Parabolic interpolation for accuracy
  return frequencyHz;
}
```

**Turn Signal Output:**
```javascript
{
  LIKELY_END,      // Falling pitch + energy decay + slow rate
  POSSIBLY_END,    // Falling pitch OR high energy decay
  THINKING,        // Flat pitch + sustained energy + slow
  CONTINUING       // Rising pitch OR normal/fast rate
}
```

---

### 3. Turn-Taking Model (`turnTakingModel.js`)

**Purpose:** Combines all signals to make turn decisions

#### Turn-Yield Phrases (Walkie-Talkie Mode)

**Strong Yield (Immediate Commit):**
```javascript
const STRONG_YIELD_PATTERNS = [
  'askingOpinion',      // "What do you think?"
  'askingThoughts',     // "What are your thoughts?"
  'askingView',         // "What's your opinion?"
  'askingAdvice',       // "What should I do?"
  'askingPerspective',  // "If you were me..."
  'prosAndCons',        // "What are the pros and cons?"
  'options',            // "What are my options?"
  'over',               // "Over", "I'm done", "That's all"
  'goAhead'             // "Luna", "Your turn", "Go ahead"
];
```

**Weak Yield (Boost Probability):**
```javascript
// Questions ending with "?"
// "Right?", "Yeah?", "Don't you think?"
// "So...", "And..." (inviting response)
```

#### Constitutional Adjustments by Enneagram

```javascript
const ENNEAGRAM_ADJUSTMENTS = {
  1: { silenceMultiplier: 1.1, commitThreshold: 0.70 },  // Reformers
  2: { silenceMultiplier: 1.0, commitThreshold: 0.65 },  // Helpers
  3: { silenceMultiplier: 0.9, commitThreshold: 0.60 },  // Achievers
  4: { silenceMultiplier: 1.3, commitThreshold: 0.80 },  // Individualists
  5: { silenceMultiplier: 1.4, commitThreshold: 0.85 },  // Investigators
  6: { silenceMultiplier: 1.1, commitThreshold: 0.70 },  // Loyalists
  7: { silenceMultiplier: 0.9, commitThreshold: 0.55 },  // Enthusiasts
  8: { silenceMultiplier: 0.95, commitThreshold: 0.60 }, // Challengers
  9: { silenceMultiplier: 1.2, commitThreshold: 0.75 }   // Peacemakers
};
```

**Example:** Type 5 (Investigator)
- Needs more thinking time
- Silence threshold: 600ms × 1.4 = 840ms
- Higher confidence required (0.85) before committing

#### Filler Word Detection

```javascript
const FILLER_PATTERNS = {
  thinking: /^(um+|uh+|er+|ah+|hmm+|let me think|hold on)$/i,
  backchannels: /^(yeah|yes|uh-huh|mhm|right|okay|got it)$/i,
  hesitation: /^(well|so|like|you know|i mean)$/i
};
```

**Effect:** Filler words apply -0.2 penalty to turn probability

#### Probability Calculation

```javascript
_calculateTurnProbability(prosody, silenceDurationMs, threshold) {
  let probability = 0;

  // 1. Silence duration (0-0.4)
  probability += (silenceDuration / threshold) * 0.4;

  // 2. Prosodic signals (0-0.3)
  if (prosody.turnSignal === LIKELY_END) probability += 0.3;
  if (prosody.turnSignal === POSSIBLY_END) probability += 0.2;
  if (prosody.turnSignal === THINKING) probability += 0.05;
  if (prosody.turnSignal === CONTINUING) probability -= 0.1;

  // 3. Pitch trend (0-0.2)
  if (pitch === FALLING) probability += 0.2 * confidence;
  if (pitch === RISING) probability -= 0.1;

  // 4. Energy decay (0-0.15)
  if (decayRate > 0.5) probability += 0.15;

  // 5. Filler penalty
  if (fillerDetected) probability -= 0.2;

  // 6. Linguistic completeness (0-0.15)
  probability += completeness * 0.15;

  // 7. Turn-yield boost
  if (strongYield) probability += 0.5;
  else if (weakYield) probability += 0.25;

  return clamp(probability, 0, 1);
}
```

---

## Silence Thresholds

| Threshold | Duration | When Used |
|-----------|----------|-----------|
| **Minimum** | 300ms | Never commit before this |
| **Question** | 400ms | After rising pitch |
| **Standard** | 600ms | Normal pause |
| **Extended** | 1000ms | Thinking pause (filler detected) |

These are then multiplied by the constitutional `silenceMultiplier`.

---

## Decision Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                         DECISION PRIORITY                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. STRONG TURN-YIELD + 300ms silence ─────────────────▶ COMMIT     │
│     "What do you think?", "Over", "Luna"                            │
│                                                                      │
│  2. Below 300ms silence ───────────────────────────────▶ CONTINUE   │
│     Too short, user might still be speaking                         │
│                                                                      │
│  3. Backchannel (3 words or less) ─────────────────────▶ CONTINUE   │
│     "Yeah", "Uh-huh" - acknowledgment, not turn                     │
│                                                                      │
│  4. WEAK TURN-YIELD + 360ms silence ───────────────────▶ COMMIT     │
│     Question ending with "?"                                        │
│                                                                      │
│  5. High probability + threshold exceeded ─────────────▶ COMMIT     │
│     prob >= commitThreshold AND silence >= threshold                │
│                                                                      │
│  6. Very high probability (≥90%) + 450ms silence ──────▶ COMMIT     │
│     Strong prosodic signals                                         │
│                                                                      │
│  7. Extended silence (1.5x threshold) + prob ≥50% ─────▶ COMMIT     │
│     Long pause, probably done                                       │
│                                                                      │
│  8. Approaching threshold (0.7x) ──────────────────────▶ WAIT       │
│     Getting close, wait a bit more                                  │
│                                                                      │
│  9. Default ───────────────────────────────────────────▶ CONTINUE   │
│     Keep listening                                                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Decision Output

```javascript
{
  action: 'commit' | 'wait' | 'continue',
  probability: 0.0 - 1.0,
  threshold: 600,  // Adjusted threshold in ms
  silenceDuration: 450,  // Current silence in ms
  prosody: {
    pitchTrend: 'falling',
    energyDecay: 0.6,
    turnSignal: 'likely_end'
  },
  modifiers: {
    fillerDetected: false,
    backchannelDetected: false,
    constitutionalMultiplier: 1.3
  },
  turnYield: {
    detected: true,
    strong: true,
    pattern: 'askingOpinion'
  },
  reasoning: ['Strong turn-yield detected: "askingOpinion" - immediate commit']
}
```

---

## Usage Example

```javascript
import { audioCapture } from './services/audioCapture';
import { turnTakingModel } from './services/turnTakingModel';

// Set user profile for constitutional awareness
audioCapture.setUserProfile({
  enneagramType: 5,
  processingStyle: 'internal'
});

// Start capture
await audioCapture.start();

// Listen for turn decisions
audioCapture.onTurnDecision((decision) => {
  console.log('Turn decision:', decision.action);
  console.log('Probability:', decision.probability);
  console.log('Reasoning:', decision.reasoning);

  if (decision.action === 'commit') {
    // User's turn is complete, send to LLM
    sendToLuna(currentTranscript);
  }

  if (decision.turnYield.strong) {
    // User explicitly asked for response
    console.log('User asked:', decision.turnYield.pattern);
  }
});

// Update transcript from STT
sttService.onPartialResult((text) => {
  audioCapture.updatePartialTranscript(text);
});
```

---

## Comparison: Before vs After

| Scenario | Before (Basic VAD) | After (GENESIS v2) |
|----------|-------------------|-------------------|
| "I was thinking..." (500ms pause) | COMMIT (too early) | CONTINUE (filler detected) |
| "What do you think?" | Wait 500ms | COMMIT (immediate, turn-yield) |
| "Yeah" (backchannel) | BARGE-IN | IGNORE (backchannel) |
| Type 5 user, 500ms pause | COMMIT | CONTINUE (needs 840ms) |
| "Well, um... let me see..." | COMMIT | CONTINUE (hesitation) |
| "That's all. Over." | Wait 500ms | COMMIT (immediate) |

---

## Configuration

```javascript
// In audioCapture.js
const AUDIO_CONFIG = {
  sampleRate: 24000,
  channelCount: 1,
  chunkSize: 4096,
  vadThreshold: 0.01,

  silenceThresholds: {
    minimum: 300,
    standard: 600,
    extended: 1000,
    question: 400
  },

  prosody: {
    enabled: true,
    windowSize: 512,
    analysisInterval: 3  // Analyze every 3 audio chunks
  }
};
```

---

## Debugging

Check turn-taking state:
```javascript
const stats = audioCapture.getTurnTakingStats();
console.log(stats);
// {
//   enabled: true,
//   prosodyAnalyzer: { frameCount, pitchHistoryLength, ... },
//   turnTakingModel: { isActive, silenceDuration, turnYield, ... },
//   audioChunksProcessed: 1234
// }
```

---

## Future Enhancements

1. **Emotion-aware thresholds** - Adjust based on detected user emotion
2. **Learning user patterns** - Adapt thresholds over conversation
3. **Multi-speaker diarization** - Handle multiple users
4. **Interruption intent classification** - Distinguish urgent vs casual interrupts

---

*"The best voice AI knows when to speak and when to listen."*
