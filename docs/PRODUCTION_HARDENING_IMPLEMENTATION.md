# GENESIS Luna - Production Hardening Implementation

## Final Review Document
**Date:** December 19, 2024
**Version:** Phase 4-5 Production Hardening
**Status:** Implementation Complete

---

## Executive Summary

This document details the production hardening implementations for GENESIS Luna, covering race condition prevention, memory retrieval optimization, voice system enhancements, and multilingual support.

---

## 1. Race Condition Prevention: Session Lock/Batch ID System

### Location
`functions/memory/sleepConsolidation.js`

### Problem Solved
During the 3 AM UTC nightly consolidation window, users in different time zones might be actively chatting. Without locking, the consolidation process could:
- Process entries that are still being written to
- Cause data loss or duplicate memories
- Create inconsistent state in the memory timeline

### Implementation

#### 1.1 Batch ID Generation
```javascript
function generateBatchId() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8);
  return `batch_${timestamp}_${random}`;
}
// Output example: "batch_20241219030000_x7k9m2"
```

#### 1.2 Entry Locking Mechanism
```javascript
async function lockEntriesForProcessing(collectionRef, batchId, limit = 100) {
  const staleThreshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes

  const snapshot = await collectionRef
    .where('consolidated', '==', false)
    .orderBy('timestamp', 'asc')
    .limit(limit)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Skip if locked by another active batch (within 30 minutes)
    if (data.processing_batch &&
        data.processing_started?.toDate() > staleThreshold) {
      continue; // Don't steal another batch's work
    }

    // Lock this entry
    batch.update(doc.ref, {
      processing_batch: batchId,
      processing_started: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}
```

#### 1.3 Entry Unlocking with Cleanup
```javascript
async function unlockEntries(entries, markConsolidated = true) {
  for (const entry of entries) {
    const update = {
      processing_batch: admin.firestore.FieldValue.delete(),
      processing_started: admin.firestore.FieldValue.delete()
    };

    if (markConsolidated) {
      update.consolidated = true;
      update.consolidated_at = admin.firestore.FieldValue.serverTimestamp();
    }

    batch.update(entry.ref, update);
  }
}
```

### Firestore Schema Changes
```
Entry Document:
├── content: string
├── timestamp: timestamp
├── consolidated: boolean
├── consolidated_at: timestamp (after processing)
├── processing_batch: string (during processing)
├── processing_started: timestamp (during processing)
└── sourceBatch: string (which batch created this memory)
```

### Safety Features
| Feature | Value | Purpose |
|---------|-------|---------|
| Stale Lock Threshold | 30 minutes | Auto-release abandoned locks |
| Failed Entry Handling | Release without marking | Retry on next run |
| Batch Tracking | sourceBatch field | Audit trail for debugging |

---

## 2. Vector Search Optimization: Sigmoid Decay Function

### Location
`functions/memory/memoryFunctions.js`

### Problem Solved
The previous LOG-based recency scoring had unpredictable decay rates. Memories from 2 days ago vs 7 days ago had similar scores, making it hard to tune retrieval relevance.

### Implementation

#### 2.1 Sigmoid Recency Calculator
```javascript
function calculateSigmoidRecency(hoursOld, config = {}) {
  const {
    midpointHours = 168,     // 7 days = half-life
    steepness = 0.02,        // Decay curve sharpness
    minScore = 0.2,          // Floor for old memories
    maxScore = 1.0,          // Ceiling for recent memories
    recentBoostHours = 24    // Full boost window
  } = config;

  // Very recent memories get max boost
  if (hoursOld < recentBoostHours) {
    return maxScore;
  }

  // Sigmoid: 1 / (1 + e^(steepness * (x - midpoint)))
  const sigmoid = 1 / (1 + Math.exp(steepness * (hoursOld - midpointHours)));

  // Scale to [minScore, maxScore]
  return minScore + (maxScore - minScore) * sigmoid;
}
```

#### 2.2 Combined Relevance Scoring
```javascript
function calculateRelevanceScore(vectorDistance, createdAt, options = {}) {
  const {
    importance = 0.5,
    accessCount = 0,
    isCoreMemory = false,
    recencyWeight = 0.3    // 30% recency, 70% semantic
  } = options;

  // Semantic similarity (1 - distance)
  const similarity = 1 - Math.min(1, vectorDistance);

  // Sigmoid recency
  const recencyScore = calculateSigmoidRecency(hoursOld);

  // Importance multiplier (0.8 to 1.5)
  const importanceMultiplier = 0.8 + (importance * 0.7);

  // Access boost (frequently accessed = more relevant)
  const accessBoost = Math.min(0.2, accessCount * 0.02);

  // Core memory boost (permanent memories always relevant)
  const coreBoost = isCoreMemory ? 0.3 : 0;

  // Weighted combination
  const baseScore = (similarity * 0.7) + (recencyScore * 0.3);
  return (baseScore * importanceMultiplier) + accessBoost + coreBoost;
}
```

### Decay Curve Visualization
```
Score
1.0 │████████████────────────────────────────
    │            ╲
0.8 │             ╲
    │              ╲
0.6 │               ╲
    │                ╲
0.4 │                 ╲────────────────────
    │
0.2 │──────────────────────────────────────── (floor)
    └────────────────────────────────────────
    0h   24h   7d      14d     30d     60d
         │     │
         │     └── Midpoint (50% score)
         └──────── Recent boost window
```

### Score Examples
| Memory Age | Recency Score | With Importance 0.8 | With Core Boost |
|------------|---------------|---------------------|-----------------|
| 1 hour     | 1.0           | 1.16               | 1.46           |
| 12 hours   | 1.0           | 1.16               | 1.46           |
| 3 days     | 0.78          | 0.90               | 1.20           |
| 7 days     | 0.50          | 0.58               | 0.88           |
| 14 days    | 0.31          | 0.36               | 0.66           |
| 30 days    | 0.22          | 0.25               | 0.55           |

---

## 3. Voice System: Activity Timeout (Vampire Prevention)

### Location
`src/services/voiceService.js`

### Problem Solved
Users leaving tabs open with background noise would continuously trigger VAD (Voice Activity Detection), draining Luna's energy and consuming API credits without actual engagement.

### Implementation

#### 3.1 Configuration
```javascript
const ACTIVITY_TIMEOUT_CONFIG = {
  inactivityTimeoutMs: 5 * 60 * 1000,  // 5 minutes
  warningTimeoutMs: 4 * 60 * 1000,     // Warn at 4 minutes
  sleepModeEnabled: true
};
```

#### 3.2 Activity Monitoring
```javascript
startActivityMonitoring() {
  // Track user interactions
  const activityEvents = ['keydown', 'mousedown', 'touchstart', 'click'];
  this.activityHandler = () => this.recordUserActivity();

  activityEvents.forEach(event => {
    document.addEventListener(event, this.activityHandler, { passive: true });
  });

  // Check every 30 seconds
  this.activityTimeoutTimer = setInterval(() => {
    this.checkInactivity();
  }, 30000);
}

checkInactivity() {
  const timeSinceActivity = Date.now() - this.lastUserActivityTime;

  // Warning at 4 minutes
  if (timeSinceActivity >= ACTIVITY_TIMEOUT_CONFIG.warningTimeoutMs) {
    this.onActivityWarning?.({
      timeUntilSleepMs: 60000,
      message: "Luna will sleep in 60 seconds due to inactivity"
    });
  }

  // Sleep at 5 minutes
  if (timeSinceActivity >= ACTIVITY_TIMEOUT_CONFIG.inactivityTimeoutMs) {
    this.enterSleepMode();
  }
}
```

#### 3.3 Sleep Mode
```javascript
enterSleepMode() {
  this.isSleeping = true;
  this.setMuted(true);  // Stop VAD triggers

  this.onSleepMode?.({
    reason: 'inactivity',
    message: 'Luna fell asleep. Click or speak to wake her up.'
  });

  this.setState(VOICE_STATES.IDLE);
}

wakeFromSleep() {
  this.isSleeping = false;
  this.lastUserActivityTime = Date.now();
  this.setMuted(false);

  if (this.isConnected) {
    this.setState(VOICE_STATES.LISTENING);
  }
}
```

### State Diagram
```
                    ┌─────────────┐
                    │   ACTIVE    │
                    │ (Listening) │
                    └──────┬──────┘
                           │
            5 min inactivity
                           │
                           ▼
                    ┌─────────────┐
                    │  SLEEPING   │
                    │ (Mic Muted) │
                    └──────┬──────┘
                           │
              User activity detected
                           │
                           ▼
                    ┌─────────────┐
                    │   ACTIVE    │
                    │ (Listening) │
                    └─────────────┘
```

---

## 4. Voice System: Audio Calibration

### Location
`src/services/voiceService.js`

### Problem Solved
Different users have different microphones and environments. A one-size-fits-all VAD threshold leads to:
- Quiet mics: Luna doesn't hear the user
- Noisy environments: Background noise triggers false positives

### Implementation

#### 4.1 Configuration
```javascript
const CALIBRATION_CONFIG = {
  calibrationDurationMs: 5000,  // 5 seconds
  sampleIntervalMs: 100,        // 50 samples
  noiseFloorMultiplier: 2.0,    // Threshold = noise * 2
  minThreshold: 0.05,           // Prevent too-sensitive
  maxThreshold: 0.5             // Prevent deaf mode
};
```

#### 4.2 Calibration Process
```javascript
async calibrateAudio() {
  this.isCalibrating = true;
  this.calibrationSamples = [];

  const sampleCount = 50; // 5000ms / 100ms

  return new Promise((resolve) => {
    const collectSample = () => {
      if (samplesCollected >= sampleCount) {
        resolve(this.calculateCalibratedThreshold());
        return;
      }

      const level = this.getAudioLevel();
      this.calibrationSamples.push(level);
      samplesCollected++;

      setTimeout(collectSample, 100);
    };

    collectSample();
  });
}

calculateCalibratedThreshold() {
  // Calculate average (noise floor)
  const average = samples.reduce((a, b) => a + b) / samples.length;

  // Calculate standard deviation
  const stdDev = Math.sqrt(
    samples.map(s => Math.pow(s - average, 2))
           .reduce((a, b) => a + b) / samples.length
  );

  // Noise floor = average + stdDev
  const noiseFloor = average + stdDev;

  // VAD threshold = noise floor * 2
  this.calibratedThreshold = Math.max(0.05, Math.min(0.5,
    noiseFloor * CALIBRATION_CONFIG.noiseFloorMultiplier
  ));

  return {
    success: true,
    noiseFloor,
    threshold: this.calibratedThreshold,
    recommendation: this.calibratedThreshold > 0.3
      ? 'Environment is noisy. Consider using headphones.'
      : 'Environment sounds good for voice chat.'
  };
}
```

### Calibration UI Flow
```
┌────────────────────────────────────────┐
│     🎤 Calibrating Audio...           │
│                                        │
│     [████████████░░░░░░░░] 60%        │
│                                        │
│     Please stay quiet for 5 seconds    │
└────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│     ✅ Calibration Complete           │
│                                        │
│     Noise Floor: 0.08                  │
│     VAD Threshold: 0.16                │
│                                        │
│     Environment sounds good! 🎉        │
└────────────────────────────────────────┘
```

---

## 5. Voice System: Filler Words (Latency Masking)

### Location
`src/services/voiceService.js`

### Problem Solved
Network latency between user speech and AI response creates awkward silence. This makes the conversation feel artificial and robotic.

### Implementation

#### 5.1 Configuration
```javascript
const FILLER_CONFIG = {
  enabled: true,
  maxFillerDurationMs: 800,
  fillerTypes: {
    thinking: ['hmm', 'let_me_see', 'well'],
    confirming: ['yes', 'i_see', 'okay'],
    transitioning: ['so', 'alright', 'now']
  }
};
```

#### 5.2 Synthetic Audio Generation
```javascript
createFillerBuffer(type) {
  const duration = type === 'hmm' ? 0.5 : 0.3;
  const frameCount = sampleRate * duration;
  const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;

    // Envelope: smooth fade in/out
    const envelope = Math.sin(Math.PI * t / duration);

    // Tone: low frequency hum
    const freq = type === 'hmm' ? 180 : 250;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.1;

    // Subtle noise for naturalness
    const noise = (Math.random() - 0.5) * 0.02;

    channelData[i] = (tone + noise) * envelope * 0.3;
  }

  return buffer;
}
```

#### 5.3 Playback Integration
```javascript
playFiller(type = 'thinking') {
  if (!FILLER_CONFIG.enabled || this.isPlayingFiller) return;

  const fillerOptions = FILLER_CONFIG.fillerTypes[type];
  const fillerName = fillerOptions[Math.floor(Math.random() * fillerOptions.length)];

  const buffer = this.fillerBuffers[fillerName];
  this.isPlayingFiller = true;

  const source = this.audioContext.createBufferSource();
  source.buffer = buffer;

  // Lower volume for fillers
  const fillerGain = this.audioContext.createGain();
  fillerGain.gain.value = 0.4;
  source.connect(fillerGain);
  fillerGain.connect(this.gainNode);

  source.onended = () => { this.isPlayingFiller = false; };
  source.start(0);
}
```

### Conversation Flow
```
User: "What's the weather like?"
       │
       ▼ (500ms network latency)
┌──────────────────────────────────────┐
│  Luna: "Hmm..."  (filler plays)      │
│         ↓                            │
│  Luna: "It's sunny today!"           │
└──────────────────────────────────────┘

Perceived latency: ~0ms (filler masks the wait)
```

---

## 6. Master Language Strategy (Phase 5 - Adaptive Localization)

### Location
`src/services/languageService.js`

### Problem Solved
Multilingual users lose emotional context when memories are translated. Direct translation loses cultural nuances like "saudade" or "wabi-sabi".

### Implementation

#### 6.1 Memory Schema
```javascript
buildMemorySchema(englishContent, originalText, languageCode) {
  return {
    // Core meaning in English (for reasoning/embeddings)
    content: englishContent,

    // Original user phrasing (emotional context)
    original_text: originalText,

    // Language metadata
    language_code: languageCode,
    language_name: SUPPORTED_LANGUAGES[languageCode]?.name,

    // Cultural preservation
    has_cultural_anchors: preservation.anchors.length > 0,
    cultural_anchors: preservation.anchors.map(a => a.term)
  };
}
```

#### 6.2 Cultural Anchors
```javascript
const CULTURAL_ANCHORS = {
  // Portuguese
  'saudade': { lang: 'pt', meaning: 'melancholic longing' },

  // Japanese
  'wabi-sabi': { lang: 'ja', meaning: 'beauty in imperfection' },
  'ikigai': { lang: 'ja', meaning: 'reason for being' },

  // Danish
  'hygge': { lang: 'da', meaning: 'cozy contentment' },

  // German
  'Weltschmerz': { lang: 'de', meaning: 'world-weariness' },

  // Spanish
  'duende': { lang: 'es', meaning: 'artistic spirit/magic' }
};
```

#### 6.3 Display Formatting
```javascript
formatMemoryForDisplay(memory) {
  const userLang = this.sessionLanguage;

  // Same language: show original
  if (memory.language_code === userLang && memory.original_text) {
    return {
      display: memory.original_text,
      source: 'original'
    };
  }

  // Different language: show English (Gemini translates in response)
  return {
    display: memory.content,
    source: 'master',
    original: memory.original_text
  };
}
```

### Example Flow
```
User (Spanish): "Extraño el sazón de mi abuela."

Stored:
{
  "content": "User feels nostalgic longing for grandmother's cooking",
  "original_text": "Extraño el sazón de mi abuela.",
  "language_code": "es",
  "has_cultural_anchors": true,
  "cultural_anchors": ["sazón"]
}

Retrieved (Spanish user): "Extraño el sazón de mi abuela."
Retrieved (English user): "User feels nostalgic longing for grandmother's cooking"
```

---

## 7. File Summary

| File | Changes | Purpose |
|------|---------|---------|
| `functions/memory/sleepConsolidation.js` | +150 lines | Batch locking system |
| `functions/memory/memoryFunctions.js` | +90 lines | Sigmoid decay scoring |
| `src/services/voiceService.js` | +350 lines | Activity timeout, calibration, fillers |
| `src/services/languageService.js` | +200 lines | Master language strategy |
| `src/services/memoryService.js` | +50 lines | Language-aware memory storage |
| `src/services/focusModeService.js` | Existing | Focus mode integration |
| `src/services/focusReportService.js` | Existing | Focus debrief generation |

---

## 8. Testing Checklist

### Race Condition Prevention
- [ ] Start consolidation while user is chatting
- [ ] Verify entries don't get double-processed
- [ ] Verify stale locks (>30 min) are released
- [ ] Check batch ID tracking in stored memories

### Sigmoid Decay
- [ ] Retrieve memories from different time periods
- [ ] Verify 24-hour memories score highest
- [ ] Verify 7-day memories score ~0.5
- [ ] Verify core memories maintain high scores

### Activity Timeout
- [ ] Leave voice session idle for 5 minutes
- [ ] Verify warning appears at 4 minutes
- [ ] Verify sleep mode activates at 5 minutes
- [ ] Verify wake on click/key/touch

### Audio Calibration
- [ ] Run calibration in quiet room
- [ ] Run calibration with background noise
- [ ] Verify threshold adjusts appropriately
- [ ] Verify recommendation message accuracy

### Filler Words
- [ ] Trigger filler on AI thinking
- [ ] Verify filler doesn't overlap with response
- [ ] Verify volume is lower than main audio
- [ ] Test all filler types

### Master Language Strategy
- [ ] Store memory in Spanish
- [ ] Retrieve as Spanish user (see original)
- [ ] Retrieve as English user (see translation)
- [ ] Verify cultural anchors preserved

---

## 9. Deployment Notes

### Firestore Indexes Required
```
Collection: users/{userId}/memory/{profileId}/user/session_buffer/entries
Index: consolidated ASC, timestamp ASC

Collection: users/{userId}/memory/{profileId}/soulpartner/session_observations/entries
Index: promoted ASC, timestamp ASC
```

### Cloud Run Configuration (Optional)
```yaml
# Reduce cold starts
min-instances: 1
max-instances: 10
cpu: 1
memory: 512Mi
```

### Environment Variables
```
GEMINI_API_KEY=your_key_here
```

---

## 10. Future Enhancements

1. **CSS Optimization**: Add `will-change: transform, opacity;` to ZenRingVisualizer
2. **Partial JSON Handling**: Handle streaming JSON from Gemini 3
3. **Pre-recorded Fillers**: Replace synthetic fillers with Luna's actual voice
4. **Adaptive Timeout**: Adjust timeout based on user engagement patterns

---

**Document prepared for final review.**
**All implementations complete and ready for production deployment.**
