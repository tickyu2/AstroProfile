# WEEK 2: HAPPINESS ANCHORS 🌟
**Auto-detect joy moments. Store with semantic search. Stack for healing.**

---

## ✅ WEEK 1 COMPLETE - AMAZING WORK!

**You implemented:**
- ✅ 8 primary Plutchik emotions
- ✅ 24 compound emotions (love, optimism, delight, awe, anxiety, remorse, contempt)
- ✅ Voice prosody integration
- ✅ PostgreSQL vector formatting
- ✅ All tests passing

**Time to level up to Week 2!** 🚀

---

## 🎯 WEEK 2 GOAL: HAPPINESS ANCHORS

**What are Happiness Anchors?**
- Special joy moments stored for later recall
- Auto-detected when intensity ≥6 OR compounds present
- Categorized: achievement, connection, delight
- Semantic search using 768D embeddings
- Used in bathtub healing algorithm (Week 5)

**Example:**
```
User: "I just got promoted at work! My boss said I'm exceeding expectations!"

Detection:
- Primary: joy (intensity 9)
- Compounds: [optimism, delight]
- Category: achievement
- Element: Fire
- Pillar: Month (career)

→ Store as happiness anchor
→ Recall later when user is sad
→ Stack 3 anchors to dilute grief
```

---

## 📋 WEEK 2 TASKS

### **File 1: `functions/memory/anchorDetector.js`** (NEW)

**Purpose:** Auto-detect happiness moments and calculate significance

```javascript
/**
 * Happiness Anchor Detector
 * Auto-detects significant joy moments worth storing
 */

const PlutchikEmotionDetector = require('../../src/services/emotionDetector');

class HappinessAnchorDetector {
  
  constructor() {
    this.emotionDetector = new PlutchikEmotionDetector();
  }
  
  /**
   * Should this moment be stored as a happiness anchor?
   * Criteria: intensity ≥6 OR compounds present OR user explicitly sharing
   */
  shouldStoreAsAnchor(emotionData, message) {
    const hasHighIntensity = emotionData.primary.intensity >= 6;
    const hasCompounds = emotionData.compounds.length > 0;
    const userExplicitlySharing = this.detectExplicitSharing(message);
    
    return hasHighIntensity || hasCompounds || userExplicitlySharing;
  }
  
  /**
   * Detect if user is explicitly sharing a happy moment
   */
  detectExplicitSharing(message) {
    const sharingKeywords = [
      'i just', 'i got', 'i achieved', 'i finished', 'i completed',
      'i won', 'i made it', 'i did it', 'succeeded', 'accomplished',
      'my first time', 'finally', 'at last'
    ];
    
    const lowerMessage = message.toLowerCase();
    return sharingKeywords.some(kw => lowerMessage.includes(kw));
  }
  
  /**
   * Calculate anchor significance (0-1 scale)
   * Higher = more important to recall later
   */
  calculateSignificance(emotionData, message, constitutionalContext) {
    let significance = 0;
    
    // Base intensity contribution (0-1)
    significance += emotionData.primary.intensity * 0.1; // Max 1.0
    
    // Compound bonus
    if (emotionData.compounds.length > 0) {
      significance += 0.2; // Has compounds = important
      
      // Special compounds worth more
      const specialCompounds = ['love', 'optimism', 'delight'];
      const hasSpecial = emotionData.compounds.some(c => 
        specialCompounds.includes(c.type)
      );
      if (hasSpecial) significance += 0.15;
    }
    
    // Authenticity score (voice-text congruence)
    if (emotionData.authenticity && emotionData.authenticity > 0.8) {
      significance += 0.15;
    }
    
    // Constitutional activation bonus
    if (constitutionalContext) {
      // If this moment activates a deficient element, it's extra valuable
      const fillsDeficiency = this.checkElementDeficiency(
        constitutionalContext.elementActivated,
        constitutionalContext.userConstitution
      );
      
      if (fillsDeficiency) {
        significance += 0.20; // Very important for healing
      }
    }
    
    return Math.min(1.0, significance);
  }
  
  /**
   * Categorize anchor for stacking algorithm
   * achievement, connection, or delight
   */
  categorizeAnchor(emotionData, message) {
    const lowerMessage = message.toLowerCase();
    
    // Achievement keywords
    const achievementKeywords = [
      'achieved', 'accomplished', 'succeeded', 'finished', 'completed',
      'won', 'got promoted', 'earned', 'created', 'built', 'made'
    ];
    
    // Connection keywords
    const connectionKeywords = [
      'friend', 'love', 'family', 'together', 'connected', 'bonded',
      'shared', 'relationship', 'partner', 'daughter', 'son'
    ];
    
    // Delight keywords
    const delightKeywords = [
      'surprised', 'unexpected', 'wow', 'amazing', 'first time',
      'never thought', 'suddenly', 'out of nowhere'
    ];
    
    if (achievementKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'achievement';
    }
    
    if (connectionKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'connection';
    }
    
    if (delightKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'delight';
    }
    
    // Check compound emotions
    if (emotionData.compounds.some(c => c.type === 'love')) {
      return 'connection';
    }
    
    if (emotionData.compounds.some(c => c.type === 'optimism')) {
      return 'achievement';
    }
    
    if (emotionData.compounds.some(c => c.type === 'delight')) {
      return 'delight';
    }
    
    return 'other';
  }
  
  /**
   * Check if this emotion fills a constitutional deficiency
   */
  checkElementDeficiency(elementActivated, userConstitution) {
    if (!userConstitution) return false;
    
    // Example: If user lacks Fire (joy), and this activates Fire, it's valuable
    const elementPercentages = userConstitution.elements || {};
    
    const elementMap = {
      'Fire': 'Fire',
      'Water': 'Water',
      'Wood': 'Wood',
      'Metal': 'Metal',
      'Earth': 'Earth'
    };
    
    const element = elementMap[elementActivated];
    if (!element) return false;
    
    // If element is below 15%, it's deficient
    return elementPercentages[element] < 15;
  }
  
  /**
   * Store happiness anchor to database
   */
  async storeAnchor(userId, emotionData, message, constitutionalContext, embedding) {
    const db = require('../config/genesisDatabase');
    
    // Extract event from message
    const event = this.extractEvent(message);
    
    // Calculate significance
    const significance = this.calculateSignificance(
      emotionData, 
      message, 
      constitutionalContext
    );
    
    // Categorize
    const category = this.categorizeAnchor(emotionData, message);
    
    // Detect element and pillar
    const element = this.detectElement(emotionData);
    const pillar = this.detectPillar(message);
    
    // Calculate stacking metadata
    const waterContribution = this.calculateWaterContribution(category, significance);
    const stackingBonus = 1.0; // Will be calculated dynamically during stacking
    
    // Format Plutchik vector
    const plutchikArray = [
      emotionData.plutchikVector.joy,
      emotionData.plutchikVector.trust,
      emotionData.plutchikVector.fear,
      emotionData.plutchikVector.surprise,
      emotionData.plutchikVector.sadness,
      emotionData.plutchikVector.disgust,
      emotionData.plutchikVector.anger,
      emotionData.plutchikVector.anticipation
    ];
    
    // Generate tags
    const tags = this.generateTags(emotionData, category, element);
    
    // Insert to database
    const result = await db.query(`
      INSERT INTO happiness_anchors (
        user_id, event, user_quote,
        primary_emotion, primary_intensity, compounds,
        plutchik_vector, category,
        element_activated, pillar_touched,
        water_contribution, stacking_bonus, effective_water,
        embedding, tags,
        user_value, intensity_score, authenticity_score
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::vector, $8, $9, $10,
        $11, $12, $13, $14::vector, $15, $16, $17, $18
      )
      RETURNING id
    `, [
      userId,
      event,
      message,
      emotionData.primary.emotion,
      emotionData.primary.intensity,
      JSON.stringify(emotionData.compounds),
      JSON.stringify(plutchikArray),
      category,
      element,
      pillar,
      waterContribution,
      stackingBonus,
      waterContribution * stackingBonus, // effective_water
      JSON.stringify(embedding),
      tags,
      significance,
      emotionData.primary.intensity / 10,
      emotionData.authenticity || 0.8
    ]);
    
    console.log(`✅ Stored happiness anchor #${result.rows[0].id}: "${event}"`);
    
    return result.rows[0].id;
  }
  
  /**
   * Extract event description from message
   */
  extractEvent(message) {
    // Simple extraction - first sentence or up to 100 chars
    const firstSentence = message.split(/[.!?]/)[0];
    return firstSentence.slice(0, 100).trim();
  }
  
  /**
   * Detect element from emotion
   */
  detectElement(emotionData) {
    const emotionToElement = {
      'joy': 'Fire',
      'anger': 'Wood',
      'fear': 'Water',
      'sadness': 'Metal',
      'worry': 'Earth'
    };
    
    return emotionToElement[emotionData.primary.emotion] || null;
  }
  
  /**
   * Detect pillar from message content
   */
  detectPillar(message) {
    const lowerMessage = message.toLowerCase();
    
    // Year pillar: family, parents, ancestors
    if (/parent|father|mother|ancestor|family legacy/.test(lowerMessage)) {
      return 'Year';
    }
    
    // Month pillar: career, work, profession
    if (/work|career|job|profession|boss|colleague|promoted/.test(lowerMessage)) {
      return 'Month';
    }
    
    // Day pillar: self, spouse, partner, relationship
    if (/spouse|partner|myself|self|identity|relationship/.test(lowerMessage)) {
      return 'Day';
    }
    
    // Hour pillar: children, creativity, social, friends
    if (/child|daughter|son|creative|friend|social/.test(lowerMessage)) {
      return 'Hour';
    }
    
    return null;
  }
  
  /**
   * Calculate water contribution based on category and significance
   */
  calculateWaterContribution(category, significance) {
    const baseWater = {
      'achievement': 10,
      'connection': 13,
      'delight': 16
    };
    
    const base = baseWater[category] || 10;
    
    // Multiply by significance (0.5-1.0 range to avoid too much variation)
    return Math.round(base * (0.5 + significance * 0.5));
  }
  
  /**
   * Generate searchable tags
   */
  generateTags(emotionData, category, element) {
    const tags = ['HAPPY_ANCHOR'];
    
    tags.push(category);
    
    if (element) {
      tags.push(`${element}_element`);
    }
    
    if (emotionData.primary.intensity >= 8) {
      tags.push('high_intensity');
    }
    
    emotionData.compounds.forEach(c => {
      tags.push(`compound_${c.type}`);
    });
    
    return tags;
  }
}

module.exports = HappinessAnchorDetector;
```

---

### **File 2: `functions/memory/anchorRetrieval.js`** (NEW)

**Purpose:** Smart retrieval for happiness stacking

```javascript
/**
 * Happiness Anchor Retrieval
 * Select best anchors for current emotional state
 */

class HappinessAnchorRetrieval {
  
  /**
   * Select 3-anchor stacking sequence
   * Returns: [achievement_anchor, connection_anchor, delight_anchor]
   */
  async selectStackSequence(userId, currentState) {
    const db = require('../config/genesisDatabase');
    
    // Get all anchors for this user
    const allAnchors = await db.query(`
      SELECT * FROM happiness_anchors
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);
    
    if (allAnchors.rows.length === 0) {
      return null; // No anchors stored yet
    }
    
    // Filter by category
    const achievements = allAnchors.rows.filter(a => a.category === 'achievement');
    const connections = allAnchors.rows.filter(a => a.category === 'connection');
    const delights = allAnchors.rows.filter(a => a.category === 'delight');
    
    // Score each anchor for current state
    const scoredAchievements = achievements.map(a => ({
      ...a,
      score: this.scoreAnchor(a, currentState)
    })).sort((a, b) => b.score - a.score);
    
    const scoredConnections = connections.map(a => ({
      ...a,
      score: this.scoreAnchor(a, currentState)
    })).sort((a, b) => b.score - a.score);
    
    const scoredDelights = delights.map(a => ({
      ...a,
      score: this.scoreAnchor(a, currentState)
    })).sort((a, b) => b.score - a.score);
    
    // Select best from each category
    return {
      achievement: scoredAchievements[0] || null,
      connection: scoredConnections[0] || null,
      delight: scoredDelights[0] || null
    };
  }
  
  /**
   * Score anchor for current state
   * Higher score = better match for recall
   */
  scoreAnchor(anchor, currentState) {
    let score = 0;
    
    // Base intensity (max 10 points)
    score += anchor.primary_intensity;
    
    // Compound bonus (max 20 points)
    score += anchor.compounds.length * 5;
    
    // Freshness bonus (max 100 - recall_count * 2)
    // Avoid overusing same anchor
    score += Math.max(0, 100 - anchor.recall_count * 2);
    
    // Effectiveness history (max 50 points)
    if (anchor.effectiveness_history && anchor.effectiveness_history.length > 0) {
      const avgEffectiveness = anchor.effectiveness_history.reduce((sum, e) => 
        sum + e.effectiveness, 0
      ) / anchor.effectiveness_history.length;
      
      score += avgEffectiveness * 50;
    }
    
    // Constitutional match (max 30 points)
    if (currentState.constitutionalContext) {
      if (anchor.element_activated === currentState.constitutionalContext.deficientElement) {
        score += 30; // Fills deficiency!
      }
    }
    
    // Recency bonus (max 30 points)
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(anchor.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(0, 30 - daysSinceCreated);
    
    // Category-specific bonuses based on current state
    if (currentState.userState === 'helpless' && anchor.category === 'achievement') {
      score += 25; // Achievement counters helplessness
    }
    
    if (currentState.userState === 'lonely' && anchor.category === 'connection') {
      score += 40; // Connection counters loneliness
    }
    
    if (currentState.userState === 'withdrawn' && anchor.category === 'delight') {
      score += 35; // Delight breaks through walls
    }
    
    return score;
  }
  
  /**
   * Find similar anchors using vector similarity
   */
  async findSimilarAnchors(userId, queryEmotion, limit = 5) {
    const db = require('../config/genesisDatabase');
    
    // Format query vector
    const queryVector = [
      queryEmotion.joy || 0,
      queryEmotion.trust || 0,
      queryEmotion.fear || 0,
      queryEmotion.surprise || 0,
      queryEmotion.sadness || 0,
      queryEmotion.disgust || 0,
      queryEmotion.anger || 0,
      queryEmotion.anticipation || 0
    ];
    
    // Find similar using pgvector cosine similarity
    const result = await db.query(`
      SELECT 
        id, event, user_quote, category,
        primary_emotion, primary_intensity,
        1 - (plutchik_vector <=> $2::vector) as similarity
      FROM happiness_anchors
      WHERE user_id = $1
      ORDER BY plutchik_vector <=> $2::vector
      LIMIT $3
    `, [userId, JSON.stringify(queryVector), limit]);
    
    return result.rows;
  }
  
  /**
   * Update anchor recall tracking
   */
  async trackRecall(anchorId, effectiveness) {
    const db = require('../config/genesisDatabase');
    
    await db.query(`
      UPDATE happiness_anchors
      SET 
        recall_count = recall_count + 1,
        last_recalled = NOW(),
        effectiveness_history = 
          effectiveness_history || 
          jsonb_build_object(
            'timestamp', NOW(),
            'effectiveness', $2
          )::jsonb
      WHERE id = $1
    `, [anchorId, effectiveness]);
  }
}

module.exports = HappinessAnchorRetrieval;
```

---

### **File 3: `functions/test/test-happiness-anchors.js`** (NEW)

**Purpose:** Test anchor detection and storage

```javascript
/**
 * Test Happiness Anchor Detection & Storage
 */

const HappinessAnchorDetector = require('../memory/anchorDetector');
const HappinessAnchorRetrieval = require('../memory/anchorRetrieval');
const db = require('../config/genesisDatabase');

async function testHappinessAnchors() {
  console.log('\n🧪 Testing Happiness Anchors...\n');
  
  const detector = new HappinessAnchorDetector();
  const retrieval = new HappinessAnchorRetrieval();
  
  // Test case 1: Achievement anchor
  console.log('TEST 1: Achievement Anchor');
  console.log('----------------------------------------');
  
  const achievementMessage = "I just got promoted at work! My boss said I'm exceeding expectations!";
  const achievementEmotion = detector.emotionDetector.detectAllEmotions(achievementMessage);
  
  const shouldStore1 = detector.shouldStoreAsAnchor(achievementEmotion, achievementMessage);
  console.log(`Should store: ${shouldStore1}`);
  console.log(`Category: ${detector.categorizeAnchor(achievementEmotion, achievementMessage)}`);
  console.log(`Significance: ${detector.calculateSignificance(achievementEmotion, achievementMessage).toFixed(2)}`);
  
  // Generate dummy embedding (in production, use Claude/OpenAI API)
  const dummyEmbedding = Array.from({length: 768}, () => Math.random());
  
  const anchorId1 = await detector.storeAnchor(
    'test_user',
    achievementEmotion,
    achievementMessage,
    { elementActivated: 'Fire', userConstitution: { elements: { Fire: 10 } } },
    dummyEmbedding
  );
  
  console.log(`✅ Stored anchor #${anchorId1}\n`);
  
  // Test case 2: Connection anchor
  console.log('TEST 2: Connection Anchor');
  console.log('----------------------------------------');
  
  const connectionMessage = "Spent the most amazing day with my daughter. We laughed so much!";
  const connectionEmotion = detector.emotionDetector.detectAllEmotions(connectionMessage);
  
  const anchorId2 = await detector.storeAnchor(
    'test_user',
    connectionEmotion,
    connectionMessage,
    null,
    Array.from({length: 768}, () => Math.random())
  );
  
  console.log(`✅ Stored anchor #${anchorId2}\n`);
  
  // Test case 3: Delight anchor
  console.log('TEST 3: Delight Anchor');
  console.log('----------------------------------------');
  
  const delightMessage = "Wow! I just won the lottery! Never expected this!";
  const delightEmotion = detector.emotionDetector.detectAllEmotions(delightMessage);
  
  const anchorId3 = await detector.storeAnchor(
    'test_user',
    delightEmotion,
    delightMessage,
    null,
    Array.from({length: 768}, () => Math.random())
  );
  
  console.log(`✅ Stored anchor #${anchorId3}\n`);
  
  // Test retrieval: 3-stack sequence
  console.log('TEST 4: Retrieve Stacking Sequence');
  console.log('----------------------------------------');
  
  const sequence = await retrieval.selectStackSequence('test_user', {
    userState: 'sad',
    constitutionalContext: null
  });
  
  console.log('Stack sequence:');
  console.log(`  1. Achievement: "${sequence.achievement?.event}" (score: ${sequence.achievement?.score})`);
  console.log(`  2. Connection: "${sequence.connection?.event}" (score: ${sequence.connection?.score})`);
  console.log(`  3. Delight: "${sequence.delight?.event}" (score: ${sequence.delight?.score})`);
  
  // Test similarity search
  console.log('\nTEST 5: Semantic Similarity Search');
  console.log('----------------------------------------');
  
  const similar = await retrieval.findSimilarAnchors('test_user', {
    joy: 0.9,
    trust: 0.3,
    anticipation: 0.8
  }, 3);
  
  console.log(`Found ${similar.length} similar anchors:`);
  similar.forEach(a => {
    console.log(`  - "${a.event}" (similarity: ${a.similarity.toFixed(2)})`);
  });
  
  await db.closePool();
  console.log('\n✅ Happiness Anchor tests complete!\n');
}

testHappinessAnchors().catch(console.error);
```

---

## ✅ WEEK 2 SUCCESS CHECKLIST

**When you can check all these, Week 2 is complete:**

- [ ] `anchorDetector.js` created
- [ ] `shouldStoreAsAnchor()` works (intensity ≥6 OR compounds)
- [ ] `categorizeAnchor()` returns achievement/connection/delight
- [ ] `calculateSignificance()` scores 0-1
- [ ] `storeAnchor()` inserts to PostgreSQL
- [ ] `anchorRetrieval.js` created
- [ ] `selectStackSequence()` returns 3 anchors
- [ ] `scoreAnchor()` ranks by relevance
- [ ] `findSimilarAnchors()` uses pgvector similarity
- [ ] `trackRecall()` updates effectiveness history
- [ ] All tests passing
- [ ] Demo ready for Ticky

---

## 🚀 TIMELINE

**Monday-Tuesday:**
- Create `anchorDetector.js`
- Implement detection logic
- Test significance scoring

**Wednesday-Thursday:**
- Create `anchorRetrieval.js`
- Implement stacking selection
- Test semantic search

**Friday:**
- Integration testing
- Bug fixes

**Weekend:**
- Demo to Ticky ✅

---

## 💡 TIPS

**For embedding generation (768D vector):**
```javascript
// In production, use Claude API:
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1,
    messages: [{ 
      role: 'user', 
      content: `Generate semantic embedding for: "${message}"` 
    }]
  })
});

// For now, use dummy embeddings for testing:
const dummyEmbedding = Array.from({length: 768}, () => Math.random());
```

**For vector similarity:**
```sql
-- pgvector automatically creates efficient indexes
-- <=> operator finds cosine distance (0 = identical, 2 = opposite)
-- 1 - distance = similarity (0-1 scale)

SELECT 
  event,
  1 - (embedding <=> $1::vector) as similarity
FROM happiness_anchors
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

---

## 🏆 THE VISION

**After Week 2, you'll have:**
- ✅ Auto-detection of happiness moments
- ✅ Smart categorization (achievement/connection/delight)
- ✅ Semantic search using pgvector
- ✅ Recall tracking with effectiveness scores
- ✅ Foundation for bathtub healing (Week 5)

**This is what makes Luna special.**

**This is the Cathedral.** 🏛️

---

**Brother Opus,**

Week 1: ✅ CRUSHED  
Week 2: LET'S GO  

**Building for awards!** 🏆⚡

💛 **Pure Gold speed continues!**
