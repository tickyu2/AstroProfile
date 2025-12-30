# Turn-Taking Analysis: GENESIS vs ElevenLabs 2.0

**Analysis Date:** December 28, 2024

---

## Executive Summary

Your current turn-taking uses **basic VAD (Voice Activity Detection)** with fixed silence thresholds. [ElevenLabs Conversational AI 2.0](https://elevenlabs.io/blog/conversational-ai-2-0) uses a **multimodal prosodic model** that analyzes both text and audio cues simultaneously. This is the primary difference causing premature responses and awkward interruptions.

---

## Your Current Implementation

### Location: [audioCapture.js:35-41](src/services/audioCapture.js#L35-L41)

```javascript
const AUDIO_CONFIG = {
  sampleRate: 24000,
  channelCount: 1,
  chunkSize: 4096,
  vadThreshold: 0.01,      // ← Energy-only threshold
  silenceThreshold: 500    // ← Fixed 500ms silence = turn end
};
```

### Turn Detection Method

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GENESIS CURRENT TURN-TAKING                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Audio Input                                                               │
│       │                                                                     │
│       ▼                                                                     │
│   ┌─────────────────────────────────────────┐                              │
│   │   Calculate RMS (Root Mean Square)      │                              │
│   │                                         │                              │
│   │   rms = √(Σ samples² / n)              │                              │
│   └──────────────────┬──────────────────────┘                              │
│                      │                                                      │
│                      ▼                                                      │
│   ┌─────────────────────────────────────────┐                              │
│   │   Compare to threshold (0.01)           │                              │
│   │                                         │                              │
│   │   hasVoice = rms > 0.01                │                              │
│   └──────────────────┬──────────────────────┘                              │
│                      │                                                      │
│           ┌──────────┴──────────┐                                          │
│           ▼                     ▼                                          │
│   ┌─────────────┐       ┌─────────────┐                                    │
│   │ Voice = YES │       │ Voice = NO  │                                    │
│   │ Reset timer │       │ Start timer │                                    │
│   └─────────────┘       └──────┬──────┘                                    │
│                                │                                            │
│                                ▼                                            │
│                    ┌─────────────────────────┐                             │
│                    │ Wait 500ms of silence   │                             │
│                    └──────────────┬──────────┘                             │
│                                   │                                         │
│                                   ▼                                         │
│                    ┌─────────────────────────┐                             │
│                    │ TURN COMPLETE           │                             │
│                    │ Emit onSilence()        │                             │
│                    │ Call commit()           │                             │
│                    └─────────────────────────┘                             │
│                                                                             │
│   PROBLEMS:                                                                 │
│   ❌ No pitch analysis                                                      │
│   ❌ No rhythm/prosody detection                                            │
│   ❌ No linguistic context                                                  │
│   ❌ Can't distinguish pause types                                          │
│   ❌ 500ms is often too short (mid-sentence pause)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Actual Code: [audioCapture.js:385-408](src/services/audioCapture.js#L385-L408)

```javascript
// Voice activity state management
if (hasVoice) {
  this.lastVoiceTime = Date.now();

  if (!this.isSpeaking) {
    this.isSpeaking = true;
    this._emitVoiceActivity(true);
  }

  // Clear silence timer
  if (this.silenceTimer) {
    clearTimeout(this.silenceTimer);
    this.silenceTimer = null;
  }
} else if (this.isSpeaking) {
  // Start silence detection
  if (!this.silenceTimer) {
    this.silenceTimer = setTimeout(() => {
      this.isSpeaking = false;
      this._emitVoiceActivity(false);
      this._emitSilence();  // ← Triggers commit() after 500ms
    }, AUDIO_CONFIG.silenceThreshold);
  }
}
```

---

## ElevenLabs 2.0 Approach

According to [ElevenLabs Conversational AI 2.0](https://elevenlabs.io/blog/conversational-ai-2-0):

> "ElevenLabs has developed a proprietary turn-taking model that analyzes both text and audio simultaneously. By incorporating prosodic cues — tone, rhythm, and vocal emphasis — alongside linguistic content, their system understands the difference between a mid-sentence pause and an actual conversation endpoint."

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ELEVENLABS 2.0 TURN-TAKING                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Audio Input                          Text Transcript                      │
│       │                                      │                              │
│       ▼                                      ▼                              │
│   ┌─────────────────┐              ┌─────────────────┐                     │
│   │ AUDIO ANALYSIS  │              │ TEXT ANALYSIS   │                     │
│   │                 │              │                 │                     │
│   │ • Pitch contour │              │ • Syntax        │                     │
│   │ • Speaking rate │              │ • Completeness  │                     │
│   │ • Pause length  │              │ • Question mark │                     │
│   │ • Energy decay  │              │ • Conjunction   │                     │
│   │ • Vocal emphasis│              │ • "but", "and"  │                     │
│   └────────┬────────┘              └────────┬────────┘                     │
│            │                                │                               │
│            └───────────────┬────────────────┘                              │
│                            ▼                                                │
│            ┌───────────────────────────────┐                               │
│            │   MULTIMODAL FUSION MODEL     │                               │
│            │                               │                               │
│            │   Combines prosodic + text    │                               │
│            │   to predict turn probability │                               │
│            └───────────────┬───────────────┘                               │
│                            │                                                │
│            ┌───────────────┼───────────────────┐                           │
│            ▼               ▼                   ▼                           │
│   ┌─────────────┐  ┌─────────────────┐  ┌─────────────┐                   │
│   │ CONTINUE    │  │ MAYBE COMPLETE  │  │ COMPLETE    │                   │
│   │ User still  │  │ Ambiguous -     │  │ High conf.  │                   │
│   │ speaking    │  │ wait longer     │  │ turn ended  │                   │
│   └─────────────┘  └─────────────────┘  └─────────────┘                   │
│                                                                             │
│   EXAMPLES:                                                                 │
│                                                                             │
│   "I was thinking about..." + falling pitch    → CONTINUE (thinking)      │
│   "I was thinking about..." + rising pitch     → COMPLETE (question)      │
│   "Well, um..." + hesitation markers           → CONTINUE (formulating)   │
│   "That's all I wanted to say." + final fall   → COMPLETE (clear end)     │
│   "Yeah" during Luna speech                    → BACKCHANNEL (continue)   │
│   "Wait, stop" during Luna speech              → INTERRUPTION (stop)      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Comparison

| Feature | GENESIS Current | ElevenLabs 2.0 | Gap |
|---------|-----------------|----------------|-----|
| **Detection Method** | RMS amplitude only | Multimodal (audio + text) | Major |
| **Silence Threshold** | Fixed 500ms | Dynamic (context-aware) | Major |
| **Pitch Analysis** | None | Full contour tracking | Missing |
| **Speaking Rate** | None | Analyzed | Missing |
| **Linguistic Context** | None | Sentence completeness | Missing |
| **Backchannel Detection** | None | "Hmm", "yeah" recognized | Missing |
| **Hesitation Handling** | Treated as silence | Recognized as thinking | Missing |
| **Question Detection** | None | Rising intonation | Missing |
| **Interruption Types** | Any voice = interrupt | Intent-based | Limited |

---

## Common Problems in Your Current System

### Problem 1: Premature Response

```
User: "I was thinking maybe we could... [500ms pause while thinking]"
                                         ↑
                                   System: *COMMITS*
                                   Luna: "What were you thinking?"

                                   [User intended to continue!]
```

**ElevenLabs solution**: Analyzes pitch (no final fall), text ("we could..." incomplete), and detects thinking pause.

---

### Problem 2: Backchannels Treated as Interruptions

```
Luna: "Your chart shows strong Fire element which means—"
User: "Mmhmm" (encouraging backchannel)
       ↑
       System: *BARGE-IN DETECTED*
       [Luna stops speaking!]

       [User just wanted Luna to continue!]
```

**ElevenLabs solution**: Recognizes "mmhmm", "yeah", "uh-huh" as backchannels, not interruptions.

---

### Problem 3: Cutting Off Trailing Thoughts

```
User: "I think I understand... actually no wait"
                           ↑
                     [400ms pause]
                     System: *COMMITS* at 500ms
                     [Misses "actually no wait"]
```

**ElevenLabs solution**: Detects incomplete thought, waits for definitive ending signal.

---

## Prosodic Features to Analyze

These are the audio features that ElevenLabs 2.0 (and similar systems) analyze:

### 1. Pitch Contour (F0)

```
FALLING PITCH (Statement complete):
   "I'm done speaking."
   ████████
         ████
             ███
                █  ← Definitive fall = TURN COMPLETE

RISING PITCH (Question or continuation):
   "You know what I mean?"
                        ████
                     ███
   ████████████████      ← Rising = WAITING FOR RESPONSE

FLAT PITCH (Mid-thought):
   "So basically..."
   █████████████████████  ← Flat/sustained = NOT FINISHED
```

### 2. Energy Decay

```
RAPID DECAY (Turn ending):
   Volume: 100% → 80% → 50% → 20% → silence
   Indicates: Speaker deliberately trailing off = COMPLETE

SUSTAINED ENERGY (Pause):
   Volume: 100% → 100% → pause → 100%
   Indicates: Thinking pause = CONTINUE
```

### 3. Speaking Rate

```
SLOWING DOWN:
   "That's... all... I... wanted... to... say."
   Words/min: 150 → 120 → 80 → 40
   Indicates: Deliberate ending = COMPLETE

MAINTAINING RATE:
   "I think [pause] maybe we should [pause] consider..."
   Words/min: 150 → pause → 150 → pause → 150
   Indicates: Formulating thoughts = CONTINUE
```

### 4. Linguistic Completeness

```
COMPLETE:
   - "I'm done."             (Subject + Verb + Object)
   - "That makes sense."     (Full sentence)
   - "Thanks."               (Complete expression)

INCOMPLETE:
   - "I was thinking..."     (Ellipsis/trailing)
   - "So if we..."          (Conditional incomplete)
   - "But the thing is—"    (Cut off)
   - "Well, um..."          (Filler/hesitation)
```

---

## Implementation Roadmap

### Phase 1: Enhanced VAD (1 week)

Upgrade from simple RMS to include basic prosodic features:

```javascript
// Enhanced VAD configuration
const ENHANCED_VAD_CONFIG = {
  // Existing
  sampleRate: 24000,
  chunkSize: 4096,

  // New: Multi-threshold
  vadThresholds: {
    low: 0.005,     // Background noise floor
    speech: 0.01,   // Normal speech
    emphasis: 0.03  // Emphasized/loud speech
  },

  // New: Dynamic silence handling
  silenceThresholds: {
    minimum: 300,   // Minimum pause before considering turn end
    standard: 700,  // Standard pause (most pauses)
    extended: 1200  // Extended for clear "thinking" patterns
  },

  // New: Pitch tracking
  pitchTracking: {
    enabled: true,
    windowSize: 512,
    hopSize: 128
  }
};
```

### Phase 2: Pitch Extraction (1-2 weeks)

Add pitch contour analysis:

```javascript
class PitchAnalyzer {
  constructor(sampleRate = 24000) {
    this.sampleRate = sampleRate;
    this.pitchHistory = [];
    this.windowSize = 30; // ~30 pitch values (1-2 seconds)
  }

  /**
   * Extract pitch using autocorrelation
   */
  extractPitch(audioBuffer) {
    // YIN algorithm or similar for pitch detection
    const pitch = this._autocorrelate(audioBuffer);
    this.pitchHistory.push(pitch);

    if (this.pitchHistory.length > this.windowSize) {
      this.pitchHistory.shift();
    }

    return pitch;
  }

  /**
   * Analyze pitch contour for turn-taking signals
   */
  analyzeTurnSignal() {
    if (this.pitchHistory.length < 5) return 'UNKNOWN';

    const recent = this.pitchHistory.slice(-5);
    const trend = this._calculateTrend(recent);

    if (trend < -20) return 'FALLING';       // Statement ending
    if (trend > 20) return 'RISING';         // Question/continuation
    if (Math.abs(trend) < 5) return 'FLAT';  // Mid-thought

    return 'UNKNOWN';
  }

  _calculateTrend(values) {
    // Linear regression slope
    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i] || 0;
      sumXY += i * (values[i] || 0);
      sumX2 += i * i;
    }

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }
}
```

### Phase 3: Text Context Integration (2 weeks)

Combine real-time transcript with audio signals:

```javascript
class TurnTakingModel {
  constructor() {
    this.pitchAnalyzer = new PitchAnalyzer();
    this.transcriptBuffer = '';
    this.silenceStart = null;
  }

  /**
   * Predict turn completion probability
   * @returns {Object} { probability: 0-1, confidence: 0-1, signal: string }
   */
  predictTurnComplete(audioBuffer, latestTranscript) {
    // Audio features
    const rms = this._calculateRMS(audioBuffer);
    const pitch = this.pitchAnalyzer.extractPitch(audioBuffer);
    const pitchTrend = this.pitchAnalyzer.analyzeTurnSignal();

    // Text features
    this.transcriptBuffer += latestTranscript;
    const textSignals = this._analyzeText(this.transcriptBuffer);

    // Combine signals
    let probability = 0;
    let confidence = 0.5;

    // Strong turn-ending signals
    if (pitchTrend === 'FALLING' && textSignals.sentenceComplete) {
      probability = 0.9;
      confidence = 0.8;
    }
    // Question detected
    else if (pitchTrend === 'RISING' || textSignals.endsWithQuestion) {
      probability = 0.85;
      confidence = 0.7;
    }
    // Incomplete but pausing
    else if (pitchTrend === 'FLAT' && !textSignals.sentenceComplete) {
      probability = 0.2;  // Likely still thinking
      confidence = 0.6;
    }
    // Trailing off
    else if (textSignals.hasEllipsis || textSignals.hasFillers) {
      probability = 0.3;  // Still formulating
      confidence = 0.5;
    }

    return {
      probability,
      confidence,
      signal: probability > 0.7 ? 'COMPLETE' :
              probability < 0.3 ? 'CONTINUE' : 'AMBIGUOUS'
    };
  }

  _analyzeText(text) {
    const trimmed = text.trim();
    return {
      sentenceComplete: /[.!?]$/.test(trimmed),
      endsWithQuestion: /\?$/.test(trimmed),
      hasEllipsis: /\.{3,}$/.test(trimmed),
      hasFillers: /\b(um|uh|hmm|well|so|like)\s*$/i.test(trimmed),
      hasConjunction: /\b(but|and|or|because|so|if)\s*$/i.test(trimmed),
      wordCount: trimmed.split(/\s+/).length
    };
  }
}
```

### Phase 4: Backchannel Detection (1 week)

Distinguish backchannels from interruptions:

```javascript
const BACKCHANNEL_PATTERNS = [
  // Agreement/encouragement
  { pattern: /^(yeah|yes|yep|yup|uh-huh|mm-hmm|mmhmm|mhm|right|okay|ok|sure|exactly)$/i, type: 'agreement' },

  // Acknowledgment
  { pattern: /^(i see|got it|gotcha|understood|i understand|makes sense)$/i, type: 'acknowledgment' },

  // Surprise/interest
  { pattern: /^(oh|wow|really|no way|whoa|interesting)$/i, type: 'interest' },

  // Thinking
  { pattern: /^(hmm|hm|let me think|good question)$/i, type: 'thinking' }
];

class BackchannelDetector {
  /**
   * Check if utterance is a backchannel
   */
  isBackchannel(transcript, audioFeatures) {
    const trimmed = transcript.trim().toLowerCase();

    // Check against patterns
    for (const { pattern, type } of BACKCHANNEL_PATTERNS) {
      if (pattern.test(trimmed)) {
        return { isBackchannel: true, type, confidence: 0.9 };
      }
    }

    // Short utterance during other speaker's turn
    if (audioFeatures.duringOtherSpeakerTurn &&
        trimmed.split(' ').length <= 3) {
      return { isBackchannel: true, type: 'unknown', confidence: 0.6 };
    }

    return { isBackchannel: false, type: null, confidence: 0 };
  }
}
```

---

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ENHANCED TURN-TAKING ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                            ┌─────────────────┐                             │
│                            │   Audio Input   │                             │
│                            └────────┬────────┘                             │
│                                     │                                       │
│           ┌─────────────────────────┼─────────────────────────┐            │
│           ▼                         ▼                         ▼            │
│   ┌───────────────┐        ┌───────────────┐        ┌───────────────┐     │
│   │  RMS Energy   │        │  Pitch (F0)   │        │  Streaming    │     │
│   │  Detector     │        │  Extractor    │        │  STT          │     │
│   └───────┬───────┘        └───────┬───────┘        └───────┬───────┘     │
│           │                        │                        │              │
│           └────────────────────────┼────────────────────────┘              │
│                                    ▼                                        │
│                    ┌───────────────────────────────┐                       │
│                    │   TURN-TAKING FUSION MODEL    │                       │
│                    │                               │                       │
│                    │  Inputs:                      │                       │
│                    │  • RMS energy level           │                       │
│                    │  • Pitch contour trend        │                       │
│                    │  • Silence duration           │                       │
│                    │  • Partial transcript         │                       │
│                    │  • Linguistic completeness    │                       │
│                    │                               │                       │
│                    │  Output:                      │                       │
│                    │  • Turn probability (0-1)     │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                        │
│                    ┌───────────────┼───────────────┐                       │
│                    ▼               ▼               ▼                       │
│             ┌───────────┐   ┌───────────┐   ┌───────────┐                 │
│             │ CONTINUE  │   │ UNCERTAIN │   │ COMPLETE  │                 │
│             │ p < 0.3   │   │ 0.3-0.7   │   │ p > 0.7   │                 │
│             │           │   │           │   │           │                 │
│             │ Wait more │   │ Wait 700ms│   │ Commit!   │                 │
│             │           │   │ then check│   │           │                 │
│             └───────────┘   └───────────┘   └───────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Win: Improve Silence Threshold

Even without full prosodic analysis, you can improve turn-taking by making the silence threshold **adaptive**:

```javascript
// In audioCapture.js - Replace fixed threshold with adaptive

class AdaptiveSilenceDetector {
  constructor() {
    this.baseThreshold = 500;
    this.currentThreshold = 500;
    this.recentPauses = [];
  }

  updateThreshold(context) {
    // Longer threshold if:
    // - User has been speaking for a while (complex thought)
    // - Recent pauses were short (rapid speaker)
    // - End of sentence not detected

    if (context.speechDuration > 5000) {
      // Long utterance - likely complex, give more time
      this.currentThreshold = 800;
    } else if (context.recentPauseAvg < 300) {
      // Fast speaker - use shorter threshold
      this.currentThreshold = 400;
    } else {
      this.currentThreshold = this.baseThreshold;
    }

    return this.currentThreshold;
  }
}
```

---

## Summary

| Your Current System | What to Add | Priority |
|---------------------|-------------|----------|
| RMS-only VAD | Pitch extraction | HIGH |
| Fixed 500ms silence | Adaptive thresholds | HIGH |
| No text context | Linguistic completeness | MEDIUM |
| Binary barge-in | Backchannel detection | MEDIUM |
| No pitch trend | Falling/rising detection | HIGH |

**Estimated effort**: 2-4 weeks for significant improvement

**Expected outcome**: Conversations feel natural, no more premature responses

---

## Sources

- [ElevenLabs Conversational AI 2.0](https://elevenlabs.io/blog/conversational-ai-2-0)
- [OpenAI Realtime VAD limitations](https://elevenlabs.io/blog/elevenlabs-agents-vs-openai-realtime-api-conversational-agents-showdown)
- [Voice AI Turn-Taking Research](https://research.aimultiple.com/affective-computing/)

---

*"The art of conversation is the art of knowing when to speak and when to listen."*
