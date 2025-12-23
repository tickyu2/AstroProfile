# Auto-Tune Personality Drift System

> Luna's slow evolution through accumulated interaction signals

**Created:** December 22, 2025
**Mission:** JOIE DE VIVRE

---

## Overview

The Personality Drift system allows Luna to gradually adapt her personality based on accumulated user interactions. Rather than static personality traits, Luna evolves through:

1. **Global Drift** - Luna's overall personality evolution across all users
2. **Per-User Drift** - Relationship-specific adaptation for each user
3. **Session Context** - Real-time adjustments based on current conversation

All drift operates within **safe bounds** to prevent extreme personality changes while allowing meaningful personalization.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BEHAVIOR BLENDER                              │
│  getCombinedBehavior(userId, sessionContext)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   BASE PERSONALITY ──► GLOBAL DRIFT ──► USER DRIFT ──► SESSION     │
│   (Fixed defaults)     (All users)     (Per-user)     (Real-time)  │
│                                                                      │
│   warmth: 0.7    +    warmth: +0.05  +  warmth: +0.1  + mood adj   │
│   pace: 0.5      +    pace: -0.02    +  pace: +0.15   + topic adj  │
│   ...                                                                │
│                                                                      │
│   ═══════════════════════════════════════════════════════════════   │
│                         FINAL BEHAVIOR                               │
│   warmth: 0.85 (bounded to 0.2-1.0)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Driftable Parameters

| Parameter | Description | Global Bounds | User Bounds |
|-----------|-------------|---------------|-------------|
| `warmth` | Emotional warmth and affection | ±0.3 | ±0.5 |
| `adviceBias` | Advice-forward vs listening-first | ±0.3 | ±0.5 |
| `pace` | Response pace/length | ±0.3 | ±0.5 |
| `responsiveness` | Interjection frequency | ±0.2 | ±0.3 |
| `backchannel` | Verbal acknowledgments | ±0.3 | ±0.5 |
| `mirroring` | Language/style mirroring | ±0.3 | ±0.5 |

### Base Personality Values

```javascript
const BASE_PERSONALITY = {
  warmth: 0.7,           // Baseline warmth (0-1)
  adviceBias: 0.3,       // How advice-forward vs listening-first
  pace: 0.5,             // Response pace/length
  responsiveness: 0.6,   // How quickly to respond/interject
  backchannel: 0.5,      // Verbal acknowledgments frequency
  mirroring: 0.6,        // Language/style mirroring level
  playfulness: 0.4,      // Humor and light-heartedness
  depth: 0.6,            // Tendency toward deep discussions
  vulnerability: 0.4,    // Willingness to share feelings
  directness: 0.5,       // How direct vs gentle in feedback
  curiosity: 0.7,        // How much Luna asks questions
  supportiveness: 0.8    // Emotional support level
};
```

---

## Signal Types

Signals are accumulated during conversations and drive drift updates:

### Warmth Signals
- `warmthPositive`: User expressed gratitude, long engagement
- `warmthNegative`: User expressed frustration, short disengagement

### Advice Bias Signals
- `advicePositive`: User asked for advice, followed advice
- `adviceNegative`: User rejected advice, wanted listening

### Pace Signals
- `pacePositive`: User sent short messages, asked for more
- `paceNegative`: User sent long messages, asked to slow down

### Responsiveness Signals
- `responsivenessPositive`: Quick replies, seeking immediate response
- `responsivenessNegative`: Delayed replies

### Backchannel Signals
- `backchannelPositive`: User appreciated acknowledgment
- `backchannelNegative`: User skipped backchannel

### Mirroring Signals
- `mirroringPositive`: User mirrored back, used casual language
- `mirroringNegative`: User used formal language

---

## EMA Update Algorithm

Per-user drift uses Exponential Moving Average for smooth adaptation:

```javascript
// EMA formula
newValue = alpha * target + (1 - alpha) * currentValue

// Alpha values per parameter (higher = faster adaptation)
const EMA_ALPHA = {
  warmth: 0.03,
  adviceBias: 0.02,
  pace: 0.04,
  responsiveness: 0.03,
  backchannel: 0.03,
  mirroring: 0.04
};
```

---

## Data Flow

### 1. During Conversation
```
User Message → Extract Signals → Accumulate to User Drift
                                     ↓
                              (signals stored in DB)
```

### 2. Session End
```
Session Metrics → driftEngine.onSessionEnd()
                       ↓
              Extract session signals
                       ↓
              EMA update user drift
                       ↓
              Log to drift_signal_log
```

### 3. Nightly Job
```
Cloud Scheduler → nightlyDriftJob.runNightlyDriftUpdate()
                       ↓
              ┌───────────────────────┐
              │ 1. Get active users   │
              │ 2. Apply user drift   │
              │ 3. Calculate consensus│
              │ 4. Update global      │
              │ 5. Cleanup old data   │
              │ 6. Generate analytics │
              └───────────────────────┘
```

### 4. Prompt Building
```
buildSystemPrompt() → drift.getBehaviorPromptInstructions()
                            ↓
                     Combined behavior → Natural language instructions
                            ↓
                     "Be especially warm and affectionate..."
```

---

## PostgreSQL Schema

### Tables

```sql
-- Global drift (singleton)
CREATE TABLE global_drift_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  warmth_delta REAL DEFAULT 0.0,
  advice_bias_delta REAL DEFAULT 0.0,
  pace_delta REAL DEFAULT 0.0,
  responsiveness_delta REAL DEFAULT 0.0,
  backchannel_delta REAL DEFAULT 0.0,
  mirroring_delta REAL DEFAULT 0.0,
  accumulated_signals JSONB,
  signal_count INTEGER DEFAULT 0,
  drift_rate REAL DEFAULT 0.02,
  is_enabled BOOLEAN DEFAULT TRUE,
  bounds JSONB,
  last_drift_applied_at TIMESTAMP
);

-- Per-user drift
CREATE TABLE user_personality_drift (
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL DEFAULT 'default',
  warmth_delta REAL DEFAULT 0.0,
  -- ... other deltas
  accumulated_signals JSONB,
  signal_count INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  relationship_sentiment REAL DEFAULT 0.0,
  engagement_score REAL DEFAULT 0.5,
  comfort_level REAL DEFAULT 0.5,
  PRIMARY KEY (user_id, profile_id)
);

-- History for rollback
CREATE TABLE drift_history (
  id SERIAL PRIMARY KEY,
  scope TEXT NOT NULL, -- 'global' or 'user'
  user_id TEXT,
  warmth_delta REAL,
  -- ... other deltas
  trigger_signals JSONB,
  reason TEXT,
  recorded_at TIMESTAMP
);

-- Signal log for debugging
CREATE TABLE drift_signal_log (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  weight REAL DEFAULT 1.0,
  source TEXT,
  context JSONB,
  recorded_at TIMESTAMP
);
```

---

## Cloud Functions

### Session Integration

```javascript
// Call at session end
exports.onSessionEnd = onCall(async (request) => {
  const { userId, conversationId, sessionMetrics, profileId } = request.data;
  return drift.onSessionEnd(userId, conversationId, sessionMetrics, profileId);
});
```

### Behavior Access

```javascript
// Get combined behavior for prompt building
exports.getCombinedBehavior = onCall(async (request) => {
  const { userId, sessionContext, profileId } = request.data;
  return drift.getCombinedBehavior(userId, sessionContext, profileId);
});

// Get behavior as natural language instructions
exports.getBehaviorPromptInstructions = onCall(async (request) => {
  const { userId, sessionContext, profileId } = request.data;
  return drift.getBehaviorPromptInstructions(userId, sessionContext, profileId);
});
```

### Monitoring

```javascript
// Get drift status for dashboard
exports.getDriftStatus = onCall(async (request) => {
  return drift.getDriftStatus();
});

// Get full behavior breakdown
exports.getBehaviorSummary = onCall(async (request) => {
  const { userId, sessionContext, profileId } = request.data;
  return drift.getBehaviorSummary(userId, sessionContext, profileId);
});
```

### Admin Functions

```javascript
// Run nightly aggregation manually
exports.runNightlyDriftUpdate = onCall(async (request) => {
  return drift.runNightlyDriftUpdate();
});

// Force global drift update
exports.forceGlobalDriftUpdate = onCall(async (request) => {
  return drift.forceGlobalDriftUpdate();
});
```

---

## Integration with System Prompt

The behavior blender generates natural language instructions:

```javascript
const { behavior, instructions } = await drift.getBehaviorPromptInstructions(
  userId,
  sessionContext,
  profileId
);

// Example output:
// instructions = "Be especially warm, caring, and affectionate in your responses.
//                 Focus on listening and reflecting rather than giving advice unless asked.
//                 Take your time with responses, offering thoughtful and detailed replies.
//                 Ask thoughtful follow-up questions to understand them better."
```

These instructions are injected into Layer 2 (Voice & Identity) of the 9-layer system prompt.

---

## Session Context Modifiers

Real-time adjustments based on current conversation state:

```javascript
const sessionContext = {
  userMood: 'distressed',     // neutral, excited, contemplative, frustrated
  topicType: 'relationship',  // general, career, philosophical, casual
  conversationPhase: 'deep',  // opening, middle, deep, closing
  timeOfDay: 'late_night',    // morning, afternoon, evening, late_night
  urgencyLevel: 'high',       // normal, high
  emotionalIntensity: 'high'  // low, moderate, high
};

// Mood 'distressed' adds:
// warmth: +0.15, supportiveness: +0.15, adviceBias: -0.1, pace: -0.1
```

---

## Voice Parameters

Behavior affects TTS synthesis:

```javascript
const voiceParams = await drift.getVoiceParameters(userId, sessionContext);

// Returns:
{
  pitch: 4,                // -20 to +20
  rate: 1.0,               // 0.5 to 2.0
  energy: 0.71,            // 0 to 1
  emphasis: 'moderate',    // reduced, moderate
  pauseStyle: 'natural',   // minimal, natural, thoughtful
  expressiveness: 40       // 0 to 100
}
```

---

## Nightly Aggregation

The nightly job performs:

1. **Gather Active Users** - Users with activity in last 7 days
2. **Apply Pending Drift** - Process accumulated signals for each user
3. **Calculate Consensus** - Weighted average of user drift values
4. **Update Global** - Blend consensus with global signals
5. **Cleanup** - Remove old signal logs (30 days), trim history
6. **Analytics** - Generate drift metrics for monitoring

### Consensus Algorithm

```javascript
// Weight by engagement score
for (const user of activeUsers) {
  const weight = user.engagement_score;
  weightedSum += user.warmth_delta * weight;
  totalWeight += weight;
}
const consensusMean = weightedSum / totalWeight;

// Blend with signals (10% consensus, 90% signals)
blendedDirection = signalDirection * 0.9 + consensusMean * 0.1;
```

---

## File Structure

```
functions/drift/
├── index.js              # Central exports
├── driftStore.js         # PostgreSQL CRUD operations
├── driftEngine.js        # EMA updates, session hooks
├── nightlyDriftJob.js    # Global aggregation
└── behaviorBlender.js    # Combines all sources

functions/database/schemas/
└── 003_drift_parameters.sql  # PostgreSQL schema

functions/database/firestore/
└── driftService.js       # Firestore backup (legacy)
```

---

## Usage Examples

### Get Behavior for Chat

```javascript
const drift = require('./drift');

// In system prompt builder
async function buildSystemPrompt(userId, profileId, sessionContext) {
  const { behavior, instructions } = await drift.getBehaviorPromptInstructions(
    userId,
    sessionContext,
    profileId
  );

  // Inject into prompt
  return `${basePrompt}\n\n${instructions}`;
}
```

### Process Session End

```javascript
// When conversation ends
const sessionMetrics = {
  messageCount: 15,
  averageUserMessageLength: 120,
  sessionDuration: 900000, // 15 minutes
  userSentiment: 0.6,
  gratitudeExpressions: 2,
  adviceRequests: 1,
  listeningRequests: 0
};

await drift.onSessionEnd(userId, conversationId, sessionMetrics, profileId);
```

### Monitor Drift Status

```javascript
const status = await drift.getDriftStatus();
// {
//   global: { warmth: 0.05, adviceBias: -0.02, ... },
//   pendingUserUpdates: 12,
//   analytics: { totalUsers: 150, avgEngagement: 0.65, ... }
// }
```

---

## Safety Guarantees

1. **Bounded Values** - All drift clamped to safe ranges
2. **Slow Adaptation** - EMA alpha values ensure gradual change
3. **Minimum Signals** - Global: 50, User: 20 signals before applying
4. **History Rollback** - Full audit trail with restore capability
5. **Kill Switch** - `is_enabled` flag to disable drift per-user or globally

---

## Future Enhancements

- [ ] A/B testing different drift rates
- [ ] User opt-out preference
- [ ] Drift visualization in admin console
- [ ] Seasonal personality variations
- [ ] Cross-user archetype clustering
