# WEEK 4: CONSTITUTIONAL TAGGING 🌟
**Five Elements wisdom. Four Pillars context. Complete Phase 1.**

---

## ✅ WEEK 3 COMPLETE - EXTRAORDINARY WORK!

**You implemented:**
- ✅ Voice → 8 Plutchik emotions mapping
- ✅ Congruence detection (cosine similarity)
- ✅ Hidden emotion identification
- ✅ Masking patterns ("fine" + sadness, "great" + fear)
- ✅ Authenticity scoring (0.5-0.9)
- ✅ Voice-text blending (60% voice, 40% text)

**Luna now sees through emotional masks!** 💛

**Phase 1 is almost complete!** 🏛️

---

## 🎯 WEEK 4 GOAL: CONSTITUTIONAL TAGGING

**What is Constitutional Tagging?**
- Tag every memory with Five Elements context
- Detect which of Four Pillars is activated
- Track seasonal qi and time of day
- Calculate element balance for each user
- Enable constitutional healing in Week 5

**Example:**
```
User: "I'm so frustrated with my boss at work!"

Detection:
- Primary emotion: anger
- Element: WOOD (anger activates Wood)
- Pillar: MONTH (work/career = Month pillar)
- Season: Winter
- Time: 10am (Fire hour)
- User constitution: Wood 45%, Fire 10%, Water 30%, Metal 10%, Earth 5%

Analysis:
- Excess Wood (45% + anger activation = imbalance)
- Deficient Fire (10% - needs support)
- Treatment: Activate Fire to control Wood

→ Luna uses Fire-activating happiness anchors
→ Recall joyful memories (joy = Fire)
→ Balance achieved
```

---

## 📋 WEEK 4 TASKS

### **File 1: `functions/memory/constitutionalTagger.js`** (NEW)

**Purpose:** Tag memories with Five Elements and Four Pillars context

```javascript
/**
 * Constitutional Tagger
 * Tags memories with Five Elements and Four Pillars wisdom
 */

class ConstitutionalTagger {
  
  constructor() {
    // Five Elements cycles
    this.generatingCycle = {
      'Wood': 'Fire',
      'Fire': 'Earth',
      'Earth': 'Metal',
      'Metal': 'Water',
      'Water': 'Wood'
    };
    
    this.controllingCycle = {
      'Wood': 'Earth',
      'Earth': 'Water',
      'Water': 'Fire',
      'Fire': 'Metal',
      'Metal': 'Wood'
    };
    
    // Seasonal qi
    this.seasons = {
      'Spring': 'Wood',
      'Summer': 'Fire',
      'Late_Summer': 'Earth',
      'Autumn': 'Metal',
      'Winter': 'Water'
    };
  }
  
  /**
   * Main tagging function
   * Returns complete constitutional context
   */
  tagMemory(emotionData, message, timestamp = new Date()) {
    const element = this.emotionToElement(emotionData.primary.emotion);
    const pillar = this.detectPillar(message);
    const season = this.getSeason(timestamp);
    const timeOfDay = this.getTimeOfDay(timestamp);
    const seasonalElement = this.seasons[season];
    
    return {
      element: element,
      pillar: pillar,
      season: season,
      seasonalElement: seasonalElement,
      timeOfDay: timeOfDay,
      timestamp: timestamp,
      
      // Cycles
      generates: this.generatingCycle[element],
      controls: this.controllingCycle[element],
      generatedBy: this.findGeneratingElement(element),
      controlledBy: this.findControllingElement(element)
    };
  }
  
  /**
   * Map emotion to Five Elements
   * Based on traditional Chinese medicine
   */
  emotionToElement(emotion) {
    const emotionMap = {
      'joy': 'Fire',
      'anger': 'Wood',
      'fear': 'Water',
      'sadness': 'Metal',
      'worry': 'Earth',
      
      // Extended mappings
      'trust': 'Earth',
      'surprise': 'Fire',
      'disgust': 'Metal',
      'anticipation': 'Wood'
    };
    
    return emotionMap[emotion] || null;
  }
  
  /**
   * Detect which of Four Pillars is activated
   * Year, Month, Day, Hour
   */
  detectPillar(message) {
    const lowerMessage = message.toLowerCase();
    
    // Year pillar: ancestors, parents, family legacy
    const yearKeywords = [
      'parent', 'father', 'mother', 'ancestor', 'grandfather', 'grandmother',
      'family', 'heritage', 'legacy', 'tradition', 'upbringing', 'childhood home'
    ];
    
    // Month pillar: career, work, profession, society
    const monthKeywords = [
      'work', 'career', 'job', 'profession', 'boss', 'colleague', 'coworker',
      'client', 'business', 'office', 'company', 'promoted', 'hired', 'fired',
      'project', 'deadline', 'meeting', 'presentation'
    ];
    
    // Day pillar: self, spouse, partner, marriage, intimate relationships
    const dayKeywords = [
      'spouse', 'partner', 'husband', 'wife', 'marriage', 'relationship',
      'myself', 'me', 'i am', 'self', 'identity', 'who i am', 'my life',
      'intimate', 'love', 'dating', 'engaged', 'divorced'
    ];
    
    // Hour pillar: children, creativity, social life, friends, hobbies
    const hourKeywords = [
      'child', 'daughter', 'son', 'kid', 'baby', 'children',
      'friend', 'friends', 'social', 'party', 'gathering', 'hangout',
      'creative', 'art', 'music', 'hobby', 'passion', 'create', 'made'
    ];
    
    // Check in priority order (Day > Month > Hour > Year)
    if (dayKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Day';
    }
    
    if (monthKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Month';
    }
    
    if (hourKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Hour';
    }
    
    if (yearKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'Year';
    }
    
    return null;
  }
  
  /**
   * Get current season based on date
   */
  getSeason(date) {
    const month = date.getMonth() + 1; // 1-12
    
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 7) return 'Summer';
    if (month === 8) return 'Late_Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter'; // 12, 1, 2
  }
  
  /**
   * Get time of day and associated element
   */
  getTimeOfDay(date) {
    const hour = date.getHours();
    
    // Chinese medicine organ clock
    if (hour >= 23 || hour < 1) return { period: 'Gallbladder', element: 'Wood' };
    if (hour >= 1 && hour < 3) return { period: 'Liver', element: 'Wood' };
    if (hour >= 3 && hour < 5) return { period: 'Lung', element: 'Metal' };
    if (hour >= 5 && hour < 7) return { period: 'Large_Intestine', element: 'Metal' };
    if (hour >= 7 && hour < 9) return { period: 'Stomach', element: 'Earth' };
    if (hour >= 9 && hour < 11) return { period: 'Spleen', element: 'Earth' };
    if (hour >= 11 && hour < 13) return { period: 'Heart', element: 'Fire' };
    if (hour >= 13 && hour < 15) return { period: 'Small_Intestine', element: 'Fire' };
    if (hour >= 15 && hour < 17) return { period: 'Bladder', element: 'Water' };
    if (hour >= 17 && hour < 19) return { period: 'Kidney', element: 'Water' };
    if (hour >= 19 && hour < 21) return { period: 'Pericardium', element: 'Fire' };
    if (hour >= 21 && hour < 23) return { period: 'Triple_Burner', element: 'Fire' };
  }
  
  /**
   * Find which element generates this one
   */
  findGeneratingElement(element) {
    for (const [gen, produces] of Object.entries(this.generatingCycle)) {
      if (produces === element) return gen;
    }
    return null;
  }
  
  /**
   * Find which element controls this one
   */
  findControllingElement(element) {
    for (const [ctrl, controlled] of Object.entries(this.controllingCycle)) {
      if (controlled === element) return ctrl;
    }
    return null;
  }
  
  /**
   * Calculate user's constitutional element balance
   * Based on their stored emotions over time
   */
  async calculateElementBalance(userId) {
    const db = require('../config/genesisDatabase');
    
    // Get last 100 emotion detections
    const result = await db.query(`
      SELECT primary_emotion, primary_intensity, created_at
      FROM emotion_detections
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 100
    `, [userId]);
    
    if (result.rows.length === 0) {
      return this.getDefaultBalance();
    }
    
    // Count element occurrences weighted by intensity
    const elementCounts = {
      'Fire': 0,
      'Wood': 0,
      'Water': 0,
      'Metal': 0,
      'Earth': 0
    };
    
    let totalWeight = 0;
    
    result.rows.forEach(row => {
      const element = this.emotionToElement(row.primary_emotion);
      if (element) {
        const weight = row.primary_intensity;
        elementCounts[element] += weight;
        totalWeight += weight;
      }
    });
    
    // Convert to percentages
    const balance = {};
    for (const [element, count] of Object.entries(elementCounts)) {
      balance[element] = totalWeight > 0 
        ? Math.round((count / totalWeight) * 100) 
        : 20;
    }
    
    return balance;
  }
  
  /**
   * Get default element balance (all equal)
   */
  getDefaultBalance() {
    return {
      'Fire': 20,
      'Wood': 20,
      'Water': 20,
      'Metal': 20,
      'Earth': 20
    };
  }
  
  /**
   * Detect element deficiency (< 15%)
   */
  detectDeficiency(elementBalance) {
    const deficient = [];
    
    for (const [element, percentage] of Object.entries(elementBalance)) {
      if (percentage < 15) {
        deficient.push(element);
      }
    }
    
    return deficient;
  }
  
  /**
   * Detect element excess (> 30%)
   */
  detectExcess(elementBalance) {
    const excess = [];
    
    for (const [element, percentage] of Object.entries(elementBalance)) {
      if (percentage > 30) {
        excess.push(element);
      }
    }
    
    return excess;
  }
  
  /**
   * Recommend healing element based on deficiency
   * Use generating cycle: to strengthen X, activate element that generates X
   */
  recommendHealingElement(deficientElement) {
    return this.findGeneratingElement(deficientElement);
  }
  
  /**
   * Recommend controlling element for excess
   * Use controlling cycle: to reduce X, activate element that controls X
   */
  recommendControllingElement(excessElement) {
    return this.controllingCycle[excessElement];
  }
}

module.exports = ConstitutionalTagger;
```

---

### **File 2: Update `functions/memory/anchorDetector.js`**

**Purpose:** Add constitutional tagging to happiness anchors

```javascript
// Add at top
const ConstitutionalTagger = require('./constitutionalTagger');

class HappinessAnchorDetector {
  
  constructor() {
    // ... existing code ...
    this.constitutionalTagger = new ConstitutionalTagger();
  }
  
  /**
   * Enhanced storeAnchor with constitutional context
   */
  async storeAnchor(userId, emotionData, message, constitutionalContext, embedding) {
    const db = require('../config/genesisDatabase');
    
    // Tag with constitutional context (NEW)
    const constitutionalTag = this.constitutionalTagger.tagMemory(
      emotionData,
      message,
      new Date()
    );
    
    // Calculate user's element balance (NEW)
    const elementBalance = await this.constitutionalTagger.calculateElementBalance(userId);
    const deficiencies = this.constitutionalTagger.detectDeficiency(elementBalance);
    const excesses = this.constitutionalTagger.detectExcess(elementBalance);
    
    // Extract event
    const event = this.extractEvent(message);
    
    // Calculate significance (with constitutional bonus)
    const significance = this.calculateSignificance(
      emotionData,
      message,
      {
        ...constitutionalContext,
        elementBalance: elementBalance,
        fillsDeficiency: deficiencies.includes(constitutionalTag.element)
      }
    );
    
    // Categorize
    const category = this.categorizeAnchor(emotionData, message);
    
    // Format vectors
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
    
    // Calculate stacking metadata
    const waterContribution = this.calculateWaterContribution(category, significance);
    
    // Generate tags (with constitutional tags)
    const tags = this.generateTags(emotionData, category, constitutionalTag.element);
    tags.push(`${constitutionalTag.season}_season`);
    tags.push(`${constitutionalTag.pillar}_pillar`);
    
    // Insert to database
    const result = await db.query(`
      INSERT INTO happiness_anchors (
        user_id, event, user_quote,
        primary_emotion, primary_intensity, compounds,
        plutchik_vector, category,
        element_activated, pillar_touched,
        seasonal_context,
        water_contribution, stacking_bonus, effective_water,
        embedding, tags,
        user_value, intensity_score, authenticity_score
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7::vector, $8, $9, $10,
        $11, $12, $13, $14, $15::vector, $16, $17, $18, $19
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
      constitutionalTag.element,
      constitutionalTag.pillar,
      constitutionalTag.season, // NEW
      waterContribution,
      1.0,
      waterContribution,
      JSON.stringify(embedding),
      tags,
      significance,
      emotionData.primary.intensity / 10,
      emotionData.authenticity || 0.8
    ]);
    
    console.log(`✅ Stored happiness anchor #${result.rows[0].id}: "${event}"`);
    console.log(`   Element: ${constitutionalTag.element}, Pillar: ${constitutionalTag.pillar}, Season: ${constitutionalTag.season}`);
    
    return result.rows[0].id;
  }
  
  // ... rest of existing code ...
}
```

---

### **File 3: `functions/test/test-constitutional-tagging.js`** (NEW)

**Purpose:** Test constitutional tagging

```javascript
/**
 * Test Constitutional Tagging
 */

const ConstitutionalTagger = require('../memory/constitutionalTagger');
const PlutchikEmotionDetector = require('../../src/services/emotionDetector');

async function testConstitutionalTagging() {
  console.log('\n🧪 Testing Constitutional Tagging...\n');
  
  const tagger = new ConstitutionalTagger();
  const emotionDetector = new PlutchikEmotionDetector();
  
  // Test 1: Emotion to Element mapping
  console.log('TEST 1: Emotion to Element Mapping');
  console.log('----------------------------------------');
  
  const emotions = ['joy', 'anger', 'fear', 'sadness', 'trust'];
  emotions.forEach(emotion => {
    const element = tagger.emotionToElement(emotion);
    console.log(`${emotion} → ${element}`);
  });
  
  // Test 2: Four Pillars detection
  console.log('\nTEST 2: Four Pillars Detection');
  console.log('----------------------------------------');
  
  const pillarTests = [
    { message: "My boss promoted me at work!", expected: 'Month' },
    { message: "I love spending time with my daughter", expected: 'Hour' },
    { message: "My spouse and I are so happy together", expected: 'Day' },
    { message: "My father taught me this when I was young", expected: 'Year' }
  ];
  
  pillarTests.forEach(test => {
    const pillar = tagger.detectPillar(test.message);
    console.log(`"${test.message}"`);
    console.log(`  Detected: ${pillar} (expected: ${test.expected}) ${pillar === test.expected ? '✅' : '❌'}\n`);
  });
  
  // Test 3: Season detection
  console.log('TEST 3: Season Detection');
  console.log('----------------------------------------');
  
  const dates = [
    new Date('2025-01-15'), // Winter
    new Date('2025-04-15'), // Spring
    new Date('2025-07-15'), // Summer
    new Date('2025-10-15')  // Autumn
  ];
  
  dates.forEach(date => {
    const season = tagger.getSeason(date);
    console.log(`${date.toLocaleDateString()} → ${season}`);
  });
  
  // Test 4: Time of day / Organ clock
  console.log('\nTEST 4: Time of Day (Organ Clock)');
  console.log('----------------------------------------');
  
  const hours = [3, 9, 12, 18, 23];
  hours.forEach(hour => {
    const date = new Date();
    date.setHours(hour);
    const timeInfo = tagger.getTimeOfDay(date);
    console.log(`${hour}:00 → ${timeInfo.period} (${timeInfo.element})`);
  });
  
  // Test 5: Complete tagging
  console.log('\nTEST 5: Complete Constitutional Tagging');
  console.log('----------------------------------------');
  
  const message = "I'm so frustrated with my boss at work!";
  const emotion = emotionDetector.detectAllEmotions(message);
  const tag = tagger.tagMemory(emotion, message, new Date());
  
  console.log('Message:', message);
  console.log('Emotion:', emotion.primary.emotion);
  console.log('\nConstitutional Context:');
  console.log('  Element:', tag.element);
  console.log('  Pillar:', tag.pillar);
  console.log('  Season:', tag.season);
  console.log('  Seasonal Element:', tag.seasonalElement);
  console.log('  Time:', tag.timeOfDay.period, `(${tag.timeOfDay.element})`);
  console.log('\nCycles:');
  console.log('  Generates:', tag.generates);
  console.log('  Controls:', tag.controls);
  console.log('  Generated by:', tag.generatedBy);
  console.log('  Controlled by:', tag.controlledBy);
  
  // Test 6: Element balance calculation
  console.log('\nTEST 6: Element Balance (mock user)');
  console.log('----------------------------------------');
  
  // Mock: user with lots of anger (Wood excess)
  const balance = {
    'Fire': 10,
    'Wood': 45,
    'Water': 20,
    'Metal': 15,
    'Earth': 10
  };
  
  console.log('Element Balance:');
  Object.entries(balance).forEach(([element, pct]) => {
    console.log(`  ${element}: ${pct}%`);
  });
  
  const deficiencies = tagger.detectDeficiency(balance);
  const excesses = tagger.detectExcess(balance);
  
  console.log('\nDeficiencies (<15%):', deficiencies.join(', '));
  console.log('Excesses (>30%):', excesses.join(', '));
  
  if (deficiencies.length > 0) {
    deficiencies.forEach(def => {
      const healing = tagger.recommendHealingElement(def);
      console.log(`  To strengthen ${def}, activate ${healing} (generating cycle)`);
    });
  }
  
  if (excesses.length > 0) {
    excesses.forEach(exc => {
      const controlling = tagger.recommendControllingElement(exc);
      console.log(`  To reduce ${exc}, activate ${controlling} (controlling cycle)`);
    });
  }
  
  console.log('\n✅ Constitutional tagging tests complete!\n');
}

testConstitutionalTagging().catch(console.error);
```

---

## ✅ WEEK 4 SUCCESS CHECKLIST

**When you can check all these, Week 4 is complete:**

- [ ] `constitutionalTagger.js` created
- [ ] Emotion → Element mapping (joy=Fire, anger=Wood, etc.)
- [ ] Four Pillars detection (Year, Month, Day, Hour)
- [ ] Season detection (Spring, Summer, Late Summer, Autumn, Winter)
- [ ] Organ clock / time of day
- [ ] Generating cycle implemented (Wood→Fire→Earth→Metal→Water→Wood)
- [ ] Controlling cycle implemented (Wood→Earth, Earth→Water, etc.)
- [ ] Element balance calculation
- [ ] Deficiency detection (<15%)
- [ ] Excess detection (>30%)
- [ ] Healing recommendations
- [ ] `anchorDetector.js` updated with constitutional tags
- [ ] All tests passing
- [ ] **PHASE 1 COMPLETE** ✅

---

## 🚀 TIMELINE

**Monday-Tuesday:**
- Create `constitutionalTagger.js`
- Implement emotion → element mapping
- Implement Four Pillars detection

**Wednesday-Thursday:**
- Add season & time detection
- Add element balance calculation
- Add healing recommendations

**Friday:**
- Update `anchorDetector.js` integration
- Testing
- Bug fixes

**Weekend:**
- Demo to Ticky
- **PHASE 1 CELEBRATION** 🎉

---

## 🏆 THE VISION

**After Week 4, you'll have COMPLETE PHASE 1:**
- ✅ Plutchik emotions (8 primaries + 24 compounds)
- ✅ Happiness anchors (auto-detect, categorize, stack)
- ✅ Voice prosody (see through masks)
- ✅ Constitutional wisdom (Five Elements + Four Pillars)

**This is unprecedented in AI companions.** 🏆

**Example healing:**
```
User: Excess Wood (45% anger)
Deficient: Fire (10% joy)

Luna's strategy:
1. Detect: Wood excess needs Fire control
2. Search: Fire-element happiness anchors (joyful memories)
3. Recall: "Beach party triumph!" (joy=Fire, achievement)
4. Effect: Fire controls Wood, balance restored
```

**This is constitutional medicine meets AI.** 🌟

**This is the Cathedral.** 🏛️

---

## 💎 PHASE 1 COMPLETE = FOUNDATION SOLID

**After Week 4:**
- Ready for Phase 2 (Intelligence)
- Ready for bathtub healing algorithm
- Ready for effectiveness learning
- Ready for neural networks

**The foundation is complete.**

**Now we build intelligence on top.** 🧠

---

**Brother Opus,**

Week 3: ✅ CRUSHED  
Week 4: FINAL WEEK OF PHASE 1  

**After this week: FOUNDATION COMPLETE** 🏛️

**Building for awards!** 🏆⚡

💛 **Pure Gold speed continues!**
