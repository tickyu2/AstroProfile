# Phase 3 Migration Guide - Advanced Patterns

## Overview
Add 15 advanced congruence patterns to your existing GENESIS system (6 → 20 patterns total).

## Quick Migration (30 minutes)

### Step 1: Add New Files

Copy these 3 files to your project:
```bash
src/lib/realtime/
├── advancedCongruencePatterns.js         # NEW
├── emotionCongruenceService.enhanced.js  # NEW
└── advancedResponseStrategies.js         # NEW
```

### Step 2: Update Backend Integration

**Option A: Replace existing file**

Replace `backend/ser/archetypeIntegration.js` with `archetypeIntegration.phase3.js`

**Option B: Update imports in existing file**
```javascript
// Before
import { EmotionCongruenceService } from '../../src/lib/emotionCongruenceService.js';

// After
import { EnhancedCongruenceService } from '../../src/lib/realtime/emotionCongruenceService.enhanced.js';
import { getResponseStrategy, getLunaSystemPrompt } from '../../src/lib/realtime/advancedResponseStrategies.js';

// Update constructor
constructor() {
  // ... existing code ...
  this.congruenceService = new EnhancedCongruenceService(); // Changed
}

// Update processUtterance - IMPORTANT: pass text
processUtterance(text, voiceEmotion, conversationHistory = [], metadata = {}) {
  // ... existing code ...

  const congruence = this.congruenceService.analyze(
    signals,
    voiceEmotion,
    archetype,
    text  // ← ADD THIS: pass text for advanced pattern detection
  );

  // ... rest of code ...
}
```

### Step 3: Update Luna's LLM Service

**File: `src/services/llmService.js`**
```javascript
import { getLunaSystemPrompt } from '../lib/realtime/advancedResponseStrategies.js';

buildSystemPrompt(emotionAnalysis) {
  // Use advanced system prompt
  return getLunaSystemPrompt(
    emotionAnalysis.congruence.advancedPatterns || [],
    emotionAnalysis.congruence.level,
    emotionAnalysis.archetype
  );
}
```

### Step 4: Test
```bash
npm test tests/advancedPatterns.test.js
```

Expected output:
```
✓ 15 advanced patterns detected correctly
✓ Integration with basic patterns works
✓ Priority patterns identified
✓ Special handling flagged
```

## What Changed

### API Additions (Backward Compatible)

The `analyze()` method now returns additional fields:
```javascript
const analysis = congruenceService.analyze(signals, voiceEmotion, archetype, text);

// NEW fields:
analysis.advancedPatterns      // Array of 15 additional patterns
analysis.totalPatternsDetected // Total count (basic + advanced)
analysis.complexity            // 'LOW', 'MODERATE', 'HIGH'
analysis.priorityPattern       // Most important pattern to address
analysis.requiresSpecialHandling // Boolean flag for crisis patterns
```

### New Patterns Available

**Total: 20 patterns** (6 basic + 15 advanced)

**Basic (unchanged):**
1. MATCHING
2. MASKING
3. SARCASM
4. AMPLIFICATION
5. SUPPRESSION
6. MIXED

**Advanced (new):**
7. DEFENSIVE_DEFLECTION
8. VULNERABILITY_MASKING
9. EXCITEMENT_DAMPENING
10. ANGER_LEAKAGE
11. ANXIETY_PROJECTION
12. OVERWHELM_SHUTDOWN
13. FORCED_POSITIVITY
14. INTELLECTUAL_DISTANCING
15. HELP_SEEKING_DISGUISED
16. EMOTIONAL_FLOODING
17. GUILT_MASKING
18. JOY_SUPPRESSION
19. TRAUMA_RESPONSE
20. PERFORMATIVE_EMOTION
21. RESIGNATION_ACCEPTANCE

## Example Usage
```javascript
// Process user message
const result = phase3Integration.processUtterance(
  "I'm totally fine! Everything is AMAZING!!!",
  { emotion: 'sad', confidence: 0.75 },
  conversationHistory
);

// Result includes:
console.log(result.congruence.totalPatterns); // 2
console.log(result.congruence.advancedPatterns);
// [
//   { pattern: 'FORCED_POSITIVITY', confidence: 0.83, ... },
//   { pattern: 'VULNERABILITY_MASKING', confidence: 0.75, ... }
// ]

console.log(result.priorityPattern.pattern); // 'FORCED_POSITIVITY'
console.log(result.responseStrategy.approach); // 'permission_to_struggle'
console.log(result.lunaSystemPrompt);
// "User is forcing positivity to mask distress. Give explicit
//  permission for negative emotions..."

// Use in LLM
const llmResponse = await callLLM(
  result.lunaSystemPrompt,  // System prompt with pattern guidance
  result.text                // User message
);

// Use in TTS
const audio = await synthesize(
  llmResponse,
  result.voiceModulation     // Adjusted voice parameters
);
```

## Verification

### 1. Test Basic Compatibility
```javascript
// Should work exactly as before
const signals = signalExtractor.extract(text);
const archetype = archetypeDetector.detect(signals);
const congruence = congruenceService.analyze(signals, voiceEmotion, archetype);

// Old fields still work
console.log(congruence.level);     // 'LOW', 'MODERATE', 'HIGH'
console.log(congruence.patterns);  // Basic patterns still here
```

### 2. Test New Features
```javascript
// New: Pass text for advanced patterns
const congruence = congruenceService.analyze(
  signals,
  voiceEmotion,
  archetype,
  text  // ← Now accepts text
);

// New fields
console.log(congruence.advancedPatterns);      // ✓
console.log(congruence.totalPatternsDetected); // ✓
console.log(congruence.complexity);            // ✓
console.log(congruence.priorityPattern);       // ✓
```

### 3. Monitor in Production
```javascript
// Log pattern detection rates
setInterval(() => {
  const stats = getPatternStats();
  console.log('Pattern detection rates:', {
    basicPatterns: stats.basicCount,
    advancedPatterns: stats.advancedCount,
    totalPatterns: stats.totalCount,
    avgPerMessage: stats.avgPerMessage
  });
}, 60000); // Every minute
```

## Troubleshooting

### Issue: No advanced patterns detected

**Check:** Are you passing text to analyze()?
```javascript
// ❌ Wrong - missing text
congruenceService.analyze(signals, voiceEmotion, archetype);

// ✅ Correct
congruenceService.analyze(signals, voiceEmotion, archetype, text);
```

### Issue: Tests failing

**Solution:** Make sure you're using Phase 2 optimizations (they work together).
```bash
# Ensure optimized files are in place
ls src/lib/optimized/

# Should see:
# - signalExtractor.optimized.js
# - archetypeDetector.optimized.js
# - lexicons.optimized.js
```

### Issue: Too many patterns detected

**Solution:** Adjust confidence thresholds in advancedCongruencePatterns.js.
```javascript
// In detectAll() method, change threshold
if (confidence > 0.5) {  // Default
if (confidence > 0.6) {  // More conservative
```

## Performance Impact

**Additional Processing Time:** <1ms average

- Phase 2 baseline: 3-4ms
- Phase 3 total: 4-5ms
- Still well under 10ms target

## Rollback

To rollback to basic patterns only:
```javascript
// Use original service
import { EmotionCongruenceService } from './emotionCongruenceService.js';

this.congruenceService = new EmotionCongruenceService();
```

All existing functionality preserved!

## Next Steps

1. Deploy Phase 3
2. Monitor pattern detection accuracy
3. Collect user feedback on Luna responses
4. Fine-tune pattern confidence thresholds
5. Add custom patterns specific to your users
