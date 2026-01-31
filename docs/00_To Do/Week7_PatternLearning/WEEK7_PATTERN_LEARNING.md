# WEEK 7: PATTERN LEARNING 📊
**Phase 2 Week 3: Luna Recognizes Patterns**

---

## ✅ WEEK 6 COMPLETE - EXCEPTIONAL WORK!

**You built:**
- ✅ Multi-modal response detection (text + voice + behavior)
- ✅ Effectiveness scoring (0-1 with 4 components)
- ✅ Pattern recording (50D state vectors)
- ✅ Database integration (luna_approach_effectiveness table)
- ✅ 13/13 tests passing

**Luna now learns from every interaction!** 🔄

---

## 🎯 WEEK 7 GOAL: PATTERN LEARNING & AGGREGATION

**What is Pattern Learning?**

Week 6 stored individual effectiveness records:
```
Attempt 1: [SAD + breakup] → connection → 0.85 ✅
Attempt 2: [SAD + breakup] → achievement → 0.3 ❌
Attempt 3: [SAD + breakup] → connection → 0.9 ✅
```

Week 7 aggregates them into learned patterns:
```
Pattern: [SAD + breakup]
  - Connection: 0.875 avg (2 attempts) ✅ HIGH CONFIDENCE
  - Achievement: 0.3 avg (1 attempt) LOW CONFIDENCE
  
Recommendation: USE connection anchors
Confidence: MODERATE (2-9 attempts)
```

**The difference:**
- Week 6: Individual learning (one attempt at a time)
- Week 7: Pattern recognition (aggregate many attempts)

**Why this matters:**
- Individual attempts have noise
- Aggregated patterns reveal truth
- More data = more confidence
- Luna becomes WISE, not just learning

---

## 📋 WEEK 7 TASKS

### **File 1: `functions/learning/patternAggregator.js`** (NEW)

**Purpose:** Aggregate individual effectiveness records into learned patterns

```javascript
/**
 * Pattern Aggregator
 * Aggregates effectiveness records into learned patterns
 */

class PatternAggregator {
  
  constructor() {
    // Similarity threshold for grouping states
    this.similarityThreshold = 0.85; // Cosine similarity
    
    // Confidence levels based on sample size
    this.confidenceLevels = {
      LOW: { min: 1, max: 2 },
      MODERATE: { min: 3, max: 9 },
      HIGH: { min: 10, max: Infinity }
    };
  }
  
  /**
   * Aggregate patterns for a user
   * Looks at all effectiveness records and creates learned patterns
   */
  async aggregatePatternsForUser(userId) {
    const db = require('../config/genesisDatabase');
    
    // Get all effectiveness records for this user
    const records = await db.query(`
      SELECT * FROM luna_approach_effectiveness
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);
    
    if (records.rows.length === 0) {
      return { message: 'No patterns to aggregate yet', patterns: [] };
    }
    
    // Group similar states together
    const stateGroups = this.groupSimilarStates(records.rows);
    
    // For each state group, aggregate approach effectiveness
    const patterns = [];
    
    for (const stateGroup of stateGroups) {
      const pattern = await this.aggregateStateGroup(stateGroup, userId);
      patterns.push(pattern);
    }
    
    return { patterns: patterns, count: patterns.length };
  }
  
  /**
   * Group similar user states together
   * Uses vector similarity to cluster
   */
  groupSimilarStates(records) {
    const groups = [];
    
    for (const record of records) {
      // Find if this record belongs to an existing group
      let foundGroup = false;
      
      for (const group of groups) {
        // Calculate similarity with group representative
        const similarity = this.calculateSimilarity(
          record.user_state_vector,
          group.representative.user_state_vector
        );
        
        if (similarity >= this.similarityThreshold) {
          group.records.push(record);
          foundGroup = true;
          break;
        }
      }
      
      // Create new group if no match found
      if (!foundGroup) {
        groups.push({
          representative: record,
          records: [record]
        });
      }
    }
    
    return groups;
  }
  
  /**
   * Calculate cosine similarity between two state vectors
   */
  calculateSimilarity(vector1, vector2) {
    if (!vector1 || !vector2) return 0;
    
    // Parse if string (from database)
    const v1 = typeof vector1 === 'string' ? JSON.parse(vector1) : vector1;
    const v2 = typeof vector2 === 'string' ? JSON.parse(vector2) : vector2;
    
    // Cosine similarity
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      mag1 += v1[i] * v1[i];
      mag2 += v2[i] * v2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    return dotProduct / (mag1 * mag2);
  }
  
  /**
   * Aggregate all records in a state group
   * Returns learned pattern with approach rankings
   */
  async aggregateStateGroup(stateGroup, userId) {
    const records = stateGroup.records;
    
    // Create user-state signature (summary of what this state represents)
    const signature = this.createStateSignature(stateGroup.representative);
    
    // Group by approach type
    const approachGroups = {};
    
    records.forEach(record => {
      const approachType = record.approach_type;
      
      if (!approachGroups[approachType]) {
        approachGroups[approachType] = [];
      }
      
      approachGroups[approachType].push({
        effectiveness: record.effectiveness,
        verdict: record.verdict,
        details: record.approach_details
      });
    });
    
    // Calculate statistics for each approach
    const approachRankings = [];
    
    for (const [approachType, attempts] of Object.entries(approachGroups)) {
      const stats = this.calculateApproachStats(attempts);
      
      approachRankings.push({
        approachType: approachType,
        avgEffectiveness: stats.avg,
        sampleSize: stats.count,
        confidence: this.determineConfidence(stats.count),
        successRate: stats.successRate,
        verdict: stats.verdict,
        lastUsed: new Date() // Would track actual last usage in production
      });
    }
    
    // Sort by effectiveness
    approachRankings.sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);
    
    // Determine recommended approach
    const recommendedApproach = this.determineRecommendation(approachRankings);
    
    // Create avoid list
    const avoidApproaches = approachRankings
      .filter(a => a.avgEffectiveness < 0.4 && a.confidence !== 'LOW')
      .map(a => a.approachType);
    
    // Store aggregated pattern in database
    const patternId = await this.storeAggregatedPattern(
      userId,
      signature,
      stateGroup.representative.user_state_vector,
      approachRankings,
      recommendedApproach,
      avoidApproaches
    );
    
    return {
      id: patternId,
      signature: signature,
      approachRankings: approachRankings,
      recommendedApproach: recommendedApproach,
      avoidApproaches: avoidApproaches,
      totalAttempts: records.length
    };
  }
  
  /**
   * Create human-readable state signature
   */
  createStateSignature(representativeRecord) {
    const state = JSON.parse(representativeRecord.user_state);
    
    // Extract key features
    const emotionalState = state.bathtub?.state || 'UNKNOWN';
    const dominantEmotion = this.findDominantEmotion(state.emotions);
    const context = state.context || 'general';
    const timeOfDay = this.getTimeOfDay(state.temporal?.hour);
    
    return {
      emotionalState: emotionalState,
      dominantEmotion: dominantEmotion,
      context: context,
      timeOfDay: timeOfDay,
      description: `${emotionalState} with ${dominantEmotion}, ${context} context, ${timeOfDay}`
    };
  }
  
  /**
   * Find dominant emotion from plutchik vector
   */
  findDominantEmotion(emotions) {
    if (!emotions) return 'neutral';
    
    let maxEmotion = 'neutral';
    let maxValue = 0;
    
    for (const [emotion, value] of Object.entries(emotions)) {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    }
    
    return maxEmotion;
  }
  
  /**
   * Get time of day category
   */
  getTimeOfDay(hour) {
    if (!hour) return 'unknown';
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
  
  /**
   * Calculate statistics for approach attempts
   */
  calculateApproachStats(attempts) {
    const sum = attempts.reduce((acc, a) => acc + a.effectiveness, 0);
    const avg = sum / attempts.length;
    
    // Success rate (effectiveness >= 0.7)
    const successes = attempts.filter(a => a.effectiveness >= 0.7).length;
    const successRate = successes / attempts.length;
    
    // Overall verdict
    let verdict = 'NEUTRAL';
    if (avg >= 0.7) verdict = 'WORKED';
    if (avg < 0.4) verdict = 'FAILED';
    
    return {
      avg: avg,
      count: attempts.length,
      successRate: successRate,
      verdict: verdict
    };
  }
  
  /**
   * Determine confidence level based on sample size
   */
  determineConfidence(sampleSize) {
    if (sampleSize >= this.confidenceLevels.HIGH.min) return 'HIGH';
    if (sampleSize >= this.confidenceLevels.MODERATE.min) return 'MODERATE';
    return 'LOW';
  }
  
  /**
   * Determine recommended approach
   */
  determineRecommendation(approachRankings) {
    if (approachRankings.length === 0) return null;
    
    // Filter for WORKED or NEUTRAL with moderate+ confidence
    const candidates = approachRankings.filter(a => 
      (a.verdict === 'WORKED' || a.verdict === 'NEUTRAL') &&
      a.confidence !== 'LOW'
    );
    
    if (candidates.length === 0) {
      // Fall back to highest effectiveness, even if low confidence
      return approachRankings[0].approachType;
    }
    
    // Return highest effectiveness among candidates
    return candidates[0].approachType;
  }
  
  /**
   * Store aggregated pattern to database
   */
  async storeAggregatedPattern(
    userId,
    signature,
    stateVector,
    approachRankings,
    recommendedApproach,
    avoidApproaches
  ) {
    const db = require('../config/genesisDatabase');
    
    // Check if pattern already exists
    const existing = await db.query(`
      SELECT id FROM luna_learned_patterns
      WHERE user_id = $1 AND user_state_signature = $2
    `, [userId, JSON.stringify(signature)]);
    
    if (existing.rows.length > 0) {
      // Update existing pattern
      await db.query(`
        UPDATE luna_learned_patterns
        SET
          user_state_vector = $3::vector,
          approach_rankings = $4,
          recommended_approach = $5,
          avoid_approaches = $6,
          confidence = $7,
          sample_size = $8
        WHERE id = $1
      `, [
        existing.rows[0].id,
        userId,
        JSON.stringify(stateVector),
        JSON.stringify(approachRankings),
        recommendedApproach,
        avoidApproaches,
        this.determineOverallConfidence(approachRankings),
        approachRankings.reduce((sum, a) => sum + a.sampleSize, 0)
      ]);
      
      return existing.rows[0].id;
    } else {
      // Insert new pattern
      const result = await db.query(`
        INSERT INTO luna_learned_patterns (
          user_id, user_state_signature, user_state_vector,
          approach_rankings, recommended_approach, avoid_approaches,
          confidence, sample_size
        ) VALUES ($1, $2, $3::vector, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        userId,
        JSON.stringify(signature),
        JSON.stringify(stateVector),
        JSON.stringify(approachRankings),
        recommendedApproach,
        avoidApproaches,
        this.determineOverallConfidence(approachRankings),
        approachRankings.reduce((sum, a) => sum + a.sampleSize, 0)
      ]);
      
      return result.rows[0].id;
    }
  }
  
  /**
   * Determine overall confidence for pattern
   */
  determineOverallConfidence(approachRankings) {
    const totalSamples = approachRankings.reduce((sum, a) => sum + a.sampleSize, 0);
    
    if (totalSamples >= 10) return 'HIGH';
    if (totalSamples >= 3) return 'MODERATE';
    return 'LOW';
  }
}

module.exports = PatternAggregator;
```

---

### **File 2: `functions/learning/recommendationEngine.js`** (NEW)

**Purpose:** Recommend best approach based on learned patterns

```javascript
/**
 * Recommendation Engine
 * Suggests best approach based on learned patterns
 */

class RecommendationEngine {
  
  /**
   * Get recommendation for current user state
   */
  async getRecommendation(userId, currentState) {
    const db = require('../config/genesisDatabase');
    const PatternAggregator = require('./patternAggregator');
    
    const aggregator = new PatternAggregator();
    
    // Create state vector for current state
    const PatternRecorder = require('./patternRecorder');
    const recorder = new PatternRecorder();
    const currentStateVector = recorder.createStateVector(currentState);
    
    // Find similar learned patterns using vector similarity
    const similar = await db.query(`
      SELECT 
        id,
        user_state_signature,
        approach_rankings,
        recommended_approach,
        avoid_approaches,
        confidence,
        sample_size,
        1 - (user_state_vector <=> $2::vector) as similarity
      FROM luna_learned_patterns
      WHERE user_id = $1
      ORDER BY user_state_vector <=> $2::vector
      LIMIT 5
    `, [userId, JSON.stringify(currentStateVector)]);
    
    if (similar.rows.length === 0) {
      return {
        recommendation: null,
        reason: 'No learned patterns yet',
        confidence: 'NONE',
        fallback: this.getFallbackRecommendation(currentState)
      };
    }
    
    // Take most similar pattern
    const bestMatch = similar.rows[0];
    
    // Check if similarity is high enough (>0.8)
    if (bestMatch.similarity < 0.8) {
      return {
        recommendation: bestMatch.recommended_approach,
        reason: 'Moderate similarity to learned pattern',
        confidence: 'LOW',
        similarity: bestMatch.similarity,
        patternSignature: bestMatch.user_state_signature,
        approachRankings: bestMatch.approach_rankings
      };
    }
    
    return {
      recommendation: bestMatch.recommended_approach,
      reason: 'High similarity to learned pattern',
      confidence: bestMatch.confidence,
      similarity: bestMatch.similarity,
      patternSignature: bestMatch.user_state_signature,
      approachRankings: bestMatch.approach_rankings,
      avoidApproaches: bestMatch.avoid_approaches,
      sampleSize: bestMatch.sample_size
    };
  }
  
  /**
   * Get fallback recommendation when no patterns exist
   */
  getFallbackRecommendation(currentState) {
    // Use constitutional heuristics
    const elementBalance = currentState.elementBalance || {};
    
    // If Fire-deficient (low joy), prioritize connection
    if (elementBalance.Fire < 15) {
      return {
        approach: 'connection',
        reason: 'Fire deficiency suggests connection focus'
      };
    }
    
    // If Wood-excess (high anger), prioritize achievement
    if (elementBalance.Wood > 30) {
      return {
        approach: 'achievement',
        reason: 'Wood excess suggests achievement focus'
      };
    }
    
    // Default: balanced 3-stack
    return {
      approach: '3-stack',
      reason: 'Balanced approach for unknown state'
    };
  }
  
  /**
   * Get approach rankings for display
   */
  async getApproachRankings(userId, currentState) {
    const recommendation = await this.getRecommendation(userId, currentState);
    
    if (!recommendation.approachRankings) {
      return {
        rankings: [],
        message: 'No rankings available yet'
      };
    }
    
    return {
      rankings: recommendation.approachRankings,
      recommended: recommendation.recommendation,
      confidence: recommendation.confidence
    };
  }
}

module.exports = RecommendationEngine;
```

---

### **File 3: `functions/test/test-pattern-learning.js`** (NEW)

**Purpose:** Test pattern learning system

```javascript
/**
 * Test Pattern Learning & Aggregation
 */

const PatternAggregator = require('../learning/patternAggregator');
const RecommendationEngine = require('../learning/recommendationEngine');
const PatternRecorder = require('../learning/patternRecorder');
const EffectivenessCalculator = require('../learning/effectivenessCalculator');

async function testPatternLearning() {
  console.log('\n🧪 Testing Pattern Learning & Aggregation...\n');
  
  const aggregator = new PatternAggregator();
  const engine = new RecommendationEngine();
  const recorder = new PatternRecorder();
  const calculator = new EffectivenessCalculator();
  
  // Test 1: Record multiple effectiveness attempts
  console.log('TEST 1: Recording Multiple Attempts');
  console.log('----------------------------------------');
  
  const userId = 'test_user_patterns';
  
  // Simulate SAD + breakup state
  const sadBreakupState = {
    emotions: { joy: 0.2, trust: 0.3, sadness: 0.7 },
    elementBalance: { Fire: 10, Wood: 45, Water: 20, Metal: 15, Earth: 10 },
    bathtub: { salt: 35, water: 65, concentration: 35, state: 'SAD' },
    context: 'breakup',
    goal: 'reduce_sadness'
  };
  
  // Attempt 1: Connection approach (WORKED)
  console.log('Attempt 1: Connection approach');
  await recorder.recordPattern(
    userId,
    sadBreakupState,
    { type: 'connection', details: { anchors: ['connection-1', 'connection-2', 'connection-3'] } },
    {
      response: { overall: { responseType: 'positive', confidence: 0.9 } },
      effectiveness: { score: 0.85, verdict: 'WORKED' }
    }
  );
  console.log('  Effectiveness: 0.85 (WORKED) ✅\n');
  
  // Attempt 2: Achievement approach (FAILED)
  console.log('Attempt 2: Achievement approach');
  await recorder.recordPattern(
    userId,
    sadBreakupState,
    { type: 'achievement', details: { anchors: ['achievement-1', 'achievement-2', 'achievement-3'] } },
    {
      response: { overall: { responseType: 'negative', confidence: 0.8 } },
      effectiveness: { score: 0.3, verdict: 'FAILED' }
    }
  );
  console.log('  Effectiveness: 0.3 (FAILED) ❌\n');
  
  // Attempt 3: Connection approach again (WORKED)
  console.log('Attempt 3: Connection approach (again)');
  await recorder.recordPattern(
    userId,
    sadBreakupState,
    { type: 'connection', details: { anchors: ['connection-4', 'connection-5', 'connection-6'] } },
    {
      response: { overall: { responseType: 'positive', confidence: 0.85 } },
      effectiveness: { score: 0.9, verdict: 'WORKED' }
    }
  );
  console.log('  Effectiveness: 0.9 (WORKED) ✅\n');
  
  // Test 2: Aggregate patterns
  console.log('TEST 2: Aggregating Patterns');
  console.log('----------------------------------------');
  
  const aggregated = await aggregator.aggregatePatternsForUser(userId);
  
  console.log(`Found ${aggregated.patterns.length} learned pattern(s)\n`);
  
  aggregated.patterns.forEach((pattern, idx) => {
    console.log(`Pattern ${idx + 1}:`);
    console.log(`  State: ${pattern.signature.description}`);
    console.log(`  Total attempts: ${pattern.totalAttempts}`);
    console.log(`  Recommended approach: ${pattern.recommendedApproach}`);
    console.log(`  Avoid approaches: ${pattern.avoidApproaches.join(', ') || 'none'}`);
    console.log('\n  Approach Rankings:');
    
    pattern.approachRankings.forEach(ranking => {
      console.log(`    ${ranking.approachType}:`);
      console.log(`      Avg effectiveness: ${ranking.avgEffectiveness.toFixed(2)}`);
      console.log(`      Sample size: ${ranking.sampleSize}`);
      console.log(`      Confidence: ${ranking.confidence}`);
      console.log(`      Verdict: ${ranking.verdict}`);
    });
    
    console.log('');
  });
  
  // Test 3: Get recommendation
  console.log('TEST 3: Getting Recommendation');
  console.log('----------------------------------------');
  
  const recommendation = await engine.getRecommendation(userId, sadBreakupState);
  
  console.log('For state: SAD + breakup');
  console.log(`Recommended approach: ${recommendation.recommendation}`);
  console.log(`Confidence: ${recommendation.confidence}`);
  console.log(`Reason: ${recommendation.reason}`);
  console.log(`Similarity: ${recommendation.similarity?.toFixed(2) || 'N/A'}`);
  
  if (recommendation.approachRankings) {
    console.log('\nApproach rankings:');
    recommendation.approachRankings.forEach(r => {
      console.log(`  ${r.approachType}: ${r.avgEffectiveness.toFixed(2)} (${r.sampleSize} attempts, ${r.confidence} confidence)`);
    });
  }
  
  // Test 4: Vector similarity calculation
  console.log('\n\nTEST 4: Vector Similarity');
  console.log('----------------------------------------');
  
  const vector1 = recorder.createStateVector(sadBreakupState);
  const vector2 = recorder.createStateVector({
    ...sadBreakupState,
    emotions: { joy: 0.25, trust: 0.35, sadness: 0.65 } // Slightly different
  });
  
  const similarity = aggregator.calculateSimilarity(vector1, vector2);
  console.log(`Similarity between similar states: ${similarity.toFixed(3)}`);
  console.log(similarity >= 0.85 ? '  → Would be grouped together ✅' : '  → Would be separate groups');
  
  // Test 5: Confidence levels
  console.log('\n\nTEST 5: Confidence Levels');
  console.log('----------------------------------------');
  
  const testCases = [1, 3, 10, 20];
  testCases.forEach(sampleSize => {
    const confidence = aggregator.determineConfidence(sampleSize);
    console.log(`Sample size ${sampleSize} → ${confidence} confidence`);
  });
  
  console.log('\n✅ Pattern learning tests complete!\n');
}

testPatternLearning().catch(console.error);
```

---

## ✅ WEEK 7 SUCCESS CHECKLIST

**When you can check all these, Week 7 is complete:**

- [ ] `patternAggregator.js` created
- [ ] State grouping by similarity (cosine similarity >0.85)
- [ ] Approach aggregation (average effectiveness)
- [ ] Confidence determination (LOW/MODERATE/HIGH)
- [ ] State signature creation (human-readable)
- [ ] Pattern storage to database (luna_learned_patterns table)
- [ ] `recommendationEngine.js` created
- [ ] Recommendation based on vector similarity
- [ ] Fallback recommendations (constitutional heuristics)
- [ ] Approach rankings display
- [ ] All tests passing
- [ ] Demo ready for Ticky

---

## 🚀 TIMELINE

**Monday-Tuesday:**
- Create `patternAggregator.js`
- Implement state grouping
- Implement approach aggregation

**Wednesday-Thursday:**
- Create `recommendationEngine.js`
- Vector similarity search
- Fallback logic

**Friday:**
- Testing
- Bug fixes
- Integration

**Weekend:**
- Demo to Ticky ✅

---

## 💡 KEY INSIGHTS

**Why Pattern Aggregation Matters:**

**1. Truth emerges from aggregate data**
```
Individual attempts: Noisy, unreliable
  Attempt 1: connection → 0.85
  Attempt 2: connection → 0.6
  Attempt 3: connection → 0.95
  
Aggregated pattern: Clear signal
  Connection: 0.80 avg (3 attempts) ✅
  Confidence: MODERATE
  Verdict: USE
```

**2. Confidence increases with sample size**
```
1-2 attempts: LOW confidence (could be luck)
3-9 attempts: MODERATE confidence (pattern emerging)
10+ attempts: HIGH confidence (proven pattern)
```

**3. Similar states grouped intelligently**
```
State A: SAD + breakup + Fire-def + evening
State B: SAD + breakup + Fire-def + night

Similarity: 0.92 (>0.85 threshold)
→ Grouped together
→ Learn from both
→ More data, better patterns
```

---

## 🏆 THE VISION

**After Week 7, you'll have:**
- ✅ Pattern aggregation working
- ✅ Approach rankings by state
- ✅ Confidence levels (LOW/MODERATE/HIGH)
- ✅ Recommendation engine operational
- ✅ Vector similarity search
- ✅ Foundation for Week 8 (Neural Networks)

**This is where Luna becomes WISE.** 📚

**This is where Luna MASTERS healing.** 🏆

---

**Brother Opus,**

Week 6: ✅ CRUSHED (learning operational)  
Week 7: LET'S GO (wisdom accumulation)  

**Building aggregated intelligence!** 📊🧠

**Building for awards!** 🏆⚡

💛 **Pure Gold speed continues!**
