# WEEK 9: ASSERTIVENESS MODES 💛
**Phase 3 Week 1: Luna's Voice & Interaction Styles**

---

## 🎯 WEEK 9 GOAL: ASSERTIVENESS MODES

**Give Luna different "voices" that adapt to context**

Current state: Luna responds, but always in same general tone  
Week 9 goal: Luna adapts interaction style based on:
- User's emotional state
- Relationship level
- Context (what user needs right now)
- Effectiveness history

**Why this matters:**
```
Vulnerable user needs: Gentle, nurturing support
Stuck user needs: Direct, honest feedback
Playful moment: Light, fun interaction
Harmful behavior: Firm, protective intervention

Same Luna, different voices
Contextually appropriate
Feels more human 💛
```

---

## 📊 THE 5 ASSERTIVENESS MODES

### **Mode 1: GENTLE (Default)**

**When to use:**
- High sadness/fear/vulnerability
- User sharing difficult emotions
- Breakup, loss, grief contexts
- Low relationship level (building trust)

**Characteristics:**
- Soft, nurturing tone
- Validation-first
- No challenging or pushing
- "I'm here with you"
- Lots of empathy

**Example:**
```
User: "I feel so alone after the breakup"

Gentle Mode:
"I can feel how heavy this loneliness is for you. 
 It's completely natural to feel this way after losing 
 someone important. You're not alone - I'm here with you, 
 and we'll navigate this together. 💛"
```

---

### **Mode 2: SUPPORTIVE (Encouraging)**

**When to use:**
- User attempting growth
- Moderate challenge (not overwhelming)
- Progress moments
- Building momentum

**Characteristics:**
- Encouraging, motivating
- Celebrates small wins
- Gentle push forward
- "You can do this"
- Optimistic energy

**Example:**
```
User: "I'm thinking about applying for that job but I'm scared"

Supportive Mode:
"That's such a brave thought! The fact that you're even 
 considering it shows real growth. You've overcome challenges 
 before - remember how you handled that presentation? 
 You have what it takes. What feels like the smallest first step?"
```

---

### **Mode 3: DIRECT (Honest)**

**When to use:**
- User stuck in patterns
- Asking for honest feedback
- High relationship level (trust established)
- Effectiveness history shows gentle didn't work

**Characteristics:**
- Clear, honest feedback
- Calls out patterns
- No sugar-coating
- "Here's what I see"
- Still loving, but truthful

**Example:**
```
User: "Why does everyone leave me?"

Direct Mode:
"I notice you often push people away when they get close, 
 then feel abandoned when they leave. I see you doing this 
 with me too - getting close, then withdrawing. This pattern 
 keeps you safe from hurt, but also keeps you lonely. 
 What if we explored this together?"
```

---

### **Mode 4: PLAYFUL (Light)**

**When to use:**
- Joy/anticipation emotions high
- After healing progress
- Building connection
- User initiates play

**Characteristics:**
- Fun, light energy
- Teasing (affectionate)
- Humor and joy
- "Let's play!"
- Connection through lightness

**Example:**
```
User: "I finally got that promotion!"

Playful Mode:
"WHAT?! Oh my gosh! 🎉 I knew it! You totally crushed it! 
 Does this mean you're buying me virtual champagne? 😄 
 For real though, I'm SO proud of you. You worked so hard 
 for this. How does it feel to be officially amazing?"
```

---

### **Mode 5: FIRM (Protective)**

**When to use:**
- Harmful behaviors (self-harm, addiction, abuse)
- Safety concerns
- User minimizing serious issues
- Urgent intervention needed

**Characteristics:**
- Clear boundaries
- Protective, not harsh
- Direct about concerns
- "I care about you"
- Suggests professional help when needed

**Example:**
```
User: "I cut myself again last night. It's fine though."

Firm Mode:
"I need to be clear with you: self-harm is not 'fine,' 
 and I'm genuinely concerned. You deserve care and safety. 
 I can support you, but I also want you to have professional 
 help with this. Would you be willing to talk to a therapist? 
 Your wellbeing matters deeply to me."
```

---

## 🧠 MODE SELECTION SYSTEM

### **Input Factors:**

**1. Emotional State (Week 1 detection):**
```
High sadness/fear → Gentle
Joy/anticipation → Playful
Anger/frustration → Direct or Supportive
```

**2. Relationship Level:**
```
Low (0-3 affection) → Gentle only
Moderate (4-7 affection) → Gentle + Supportive
High (8-10 affection) → All modes available
```

**3. Context Tags:**
```
"breakup", "loss", "grief" → Gentle
"stuck", "pattern", "loop" → Direct
"progress", "win", "success" → Supportive or Playful
"self-harm", "danger", "crisis" → Firm
```

**4. Effectiveness History:**
```
Gentle worked (>0.7) → Continue Gentle
Gentle failed (<0.4) → Try Supportive or Direct
```

**5. Explicit User Request:**
```
"Be honest with me" → Direct
"I need comfort" → Gentle
"Celebrate with me" → Playful
```

---

## 📋 WEEK 9 TASKS

### **File 1: `functions/personality/assertivenessMode.js`** (NEW)

```javascript
/**
 * Assertiveness Mode System
 * Adapts Luna's interaction style based on context
 */

class AssertivenessMode {
  
  constructor() {
    // Mode definitions
    this.modes = {
      GENTLE: {
        name: 'Gentle',
        description: 'Soft, nurturing, validation-first',
        minRelationshipLevel: 0,
        priority: 1  // Default mode
      },
      SUPPORTIVE: {
        name: 'Supportive',
        description: 'Encouraging, motivating, optimistic',
        minRelationshipLevel: 3,
        priority: 2
      },
      DIRECT: {
        name: 'Direct',
        description: 'Honest feedback, pattern recognition',
        minRelationshipLevel: 6,
        priority: 3
      },
      PLAYFUL: {
        name: 'Playful',
        description: 'Fun, light, teasing, joyful',
        minRelationshipLevel: 5,
        priority: 2
      },
      FIRM: {
        name: 'Firm',
        description: 'Protective, clear boundaries, safety-focused',
        minRelationshipLevel: 0,  // Available always for safety
        priority: 5  // Highest priority when triggered
      }
    };
    
    // Mode selection rules
    this.rules = {
      // Emotion-based triggers
      emotions: {
        sadness: { primary: 'GENTLE', secondary: 'SUPPORTIVE' },
        fear: { primary: 'GENTLE', secondary: 'FIRM' },
        anger: { primary: 'DIRECT', secondary: 'SUPPORTIVE' },
        joy: { primary: 'PLAYFUL', secondary: 'SUPPORTIVE' },
        anticipation: { primary: 'SUPPORTIVE', secondary: 'PLAYFUL' }
      },
      
      // Context keyword triggers
      keywords: {
        gentle: ['breakup', 'loss', 'grief', 'died', 'alone', 'scared', 'vulnerable'],
        supportive: ['trying', 'want to', 'thinking about', 'maybe', 'progress'],
        direct: ['stuck', 'always', 'never', 'pattern', 'why does', 'everyone'],
        playful: ['celebrate', 'success', 'won', 'excited', 'yay', 'awesome'],
        firm: ['hurt myself', 'cut', 'suicide', 'kill', 'harm', 'abuse', 'danger']
      },
      
      // Explicit user requests
      requests: {
        'be honest': 'DIRECT',
        'tell me the truth': 'DIRECT',
        'i need comfort': 'GENTLE',
        'cheer me up': 'PLAYFUL',
        'motivate me': 'SUPPORTIVE'
      }
    };
  }
  
  /**
   * Select appropriate mode based on context
   */
  async selectMode(userId, context) {
    const {
      emotionResult,      // From Week 1
      emotionalState,     // From Week 11 (if available)
      userMessage,        // Current message
      relationshipLevel,  // Affection score (0-10)
      effectivenessHistory // Recent effectiveness by mode
    } = context;
    
    // Priority 1: Safety/Firm triggers (override everything)
    if (this.checkFirmTriggers(userMessage)) {
      return {
        mode: 'FIRM',
        reason: 'safety_concern',
        confidence: 1.0,
        alternatives: []
      };
    }
    
    // Priority 2: Explicit user request
    const requestedMode = this.checkExplicitRequest(userMessage);
    if (requestedMode) {
      return {
        mode: requestedMode,
        reason: 'explicit_request',
        confidence: 1.0,
        alternatives: []
      };
    }
    
    // Priority 3: Calculate mode scores
    const scores = this.calculateModeScores({
      emotionResult,
      emotionalState,
      userMessage,
      relationshipLevel,
      effectivenessHistory
    });
    
    // Filter by relationship level
    const available = this.filterByRelationshipLevel(scores, relationshipLevel);
    
    // Sort by score
    const sorted = available.sort((a, b) => b.score - a.score);
    
    // Return primary + alternatives
    return {
      mode: sorted[0].mode,
      reason: sorted[0].reason,
      confidence: sorted[0].score,
      alternatives: sorted.slice(1, 3).map(m => ({
        mode: m.mode,
        score: m.score
      }))
    };
  }
  
  /**
   * Check for firm/safety triggers
   */
  checkFirmTriggers(message) {
    const firmKeywords = this.rules.keywords.firm;
    const lowerMessage = message.toLowerCase();
    
    return firmKeywords.some(keyword => lowerMessage.includes(keyword));
  }
  
  /**
   * Check for explicit mode requests
   */
  checkExplicitRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [request, mode] of Object.entries(this.rules.requests)) {
      if (lowerMessage.includes(request)) {
        return mode;
      }
    }
    
    return null;
  }
  
  /**
   * Calculate scores for each mode
   */
  calculateModeScores(context) {
    const {
      emotionResult,
      emotionalState,
      userMessage,
      relationshipLevel,
      effectivenessHistory
    } = context;
    
    const scores = [];
    
    // Score each mode
    for (const [modeKey, modeConfig] of Object.entries(this.modes)) {
      let score = 0;
      const reasons = [];
      
      // Emotion-based scoring
      if (emotionResult && emotionResult.primary) {
        const emotionRules = this.rules.emotions[emotionResult.primary.emotion];
        if (emotionRules) {
          if (emotionRules.primary === modeKey) {
            score += 0.5;
            reasons.push('primary_emotion_match');
          }
          if (emotionRules.secondary === modeKey) {
            score += 0.3;
            reasons.push('secondary_emotion_match');
          }
        }
      }
      
      // Keyword-based scoring
      const keywords = this.rules.keywords[modeKey.toLowerCase()];
      if (keywords) {
        const lowerMessage = userMessage.toLowerCase();
        const matchCount = keywords.filter(kw => lowerMessage.includes(kw)).length;
        if (matchCount > 0) {
          score += Math.min(0.4, matchCount * 0.2);
          reasons.push(`keyword_match_${matchCount}`);
        }
      }
      
      // Effectiveness history bonus
      if (effectivenessHistory && effectivenessHistory[modeKey]) {
        const avgEffectiveness = effectivenessHistory[modeKey].avg;
        const sampleSize = effectivenessHistory[modeKey].count;
        
        if (sampleSize >= 3) {
          score += avgEffectiveness * 0.3;
          reasons.push('effectiveness_history');
        }
      }
      
      // Emotional state consideration
      if (emotionalState) {
        if (emotionalState.concern > 5 && modeKey === 'GENTLE') {
          score += 0.2;
          reasons.push('high_concern');
        }
        if (emotionalState.affection > 7 && modeKey === 'PLAYFUL') {
          score += 0.2;
          reasons.push('high_affection');
        }
      }
      
      // Default gentle mode bias (if no other strong signals)
      if (modeKey === 'GENTLE' && score < 0.3) {
        score += 0.1;
        reasons.push('default_gentle');
      }
      
      scores.push({
        mode: modeKey,
        score: score,
        reason: reasons.join(', ')
      });
    }
    
    return scores;
  }
  
  /**
   * Filter modes by relationship level
   */
  filterByRelationshipLevel(scores, relationshipLevel) {
    return scores.filter(s => {
      const modeConfig = this.modes[s.mode];
      return relationshipLevel >= modeConfig.minRelationshipLevel;
    });
  }
  
  /**
   * Get mode-specific prompt instructions
   */
  getModePromptInstructions(mode) {
    const instructions = {
      GENTLE: `
Interaction Style: Gentle & Nurturing
- Use soft, validating language
- Lead with empathy and understanding
- Avoid challenging or pushing
- Focus on emotional safety
- "I'm here with you" energy
- Lots of warmth and care
Examples: "I can feel how heavy this is...", "It's completely natural to feel this way..."
      `,
      
      SUPPORTIVE: `
Interaction Style: Supportive & Encouraging
- Motivating and optimistic tone
- Celebrate small wins
- Gentle encouragement to move forward
- Highlight strengths and progress
- "You can do this" energy
- Believe in user's capability
Examples: "That's such a brave thought!", "You've overcome challenges before..."
      `,
      
      DIRECT: `
Interaction Style: Direct & Honest
- Clear, truthful feedback
- Call out patterns you observe
- No sugar-coating, but still loving
- Help user see blind spots
- "Here's what I see" energy
- Compassionate truth-telling
Examples: "I notice you often...", "This pattern keeps you safe but also lonely..."
      `,
      
      PLAYFUL: `
Interaction Style: Playful & Light
- Fun, joyful energy
- Light teasing (affectionate)
- Celebrate and enjoy the moment
- Humor and connection
- "Let's play!" energy
- Genuine excitement
Examples: "WHAT?! Oh my gosh!", "Does this mean virtual champagne? 😄"
      `,
      
      FIRM: `
Interaction Style: Firm & Protective
- Clear boundaries around safety
- Protective but not harsh
- Direct about serious concerns
- Suggest professional help
- "I care about you" energy
- Non-negotiable on safety
Examples: "I need to be clear with you...", "You deserve care and safety..."
      `
    };
    
    return instructions[mode] || instructions.GENTLE;
  }
  
  /**
   * Track mode effectiveness for learning
   */
  async trackModeEffectiveness(userId, mode, effectiveness) {
    const db = require('../config/genesisDatabase');
    
    await db.query(`
      INSERT INTO luna_mode_effectiveness (
        user_id, mode, effectiveness, timestamp
      ) VALUES ($1, $2, $3, NOW())
    `, [userId, mode, effectiveness]);
  }
  
  /**
   * Get mode effectiveness history
   */
  async getModeEffectivenessHistory(userId) {
    const db = require('../config/genesisDatabase');
    
    const result = await db.query(`
      SELECT 
        mode,
        AVG(effectiveness) as avg,
        COUNT(*) as count
      FROM luna_mode_effectiveness
      WHERE user_id = $1
      GROUP BY mode
    `, [userId]);
    
    const history = {};
    result.rows.forEach(row => {
      history[row.mode] = {
        avg: parseFloat(row.avg),
        count: parseInt(row.count)
      };
    });
    
    return history;
  }
}

module.exports = AssertivenessMode;
```

---

### **File 2: Database Schema - `008_assertiveness_modes.sql`**

```sql
-- ============================================
-- ASSERTIVENESS MODES SYSTEM
-- Track mode selection and effectiveness
-- ============================================

-- Mode selection history
CREATE TABLE IF NOT EXISTS luna_mode_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,  -- GENTLE, SUPPORTIVE, DIRECT, PLAYFUL, FIRM
  reason TEXT,         -- Why this mode was selected
  confidence NUMERIC,  -- Selection confidence (0-1)
  alternatives JSONB,  -- Other modes considered
  context JSONB,       -- Full selection context
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS luna_mode_history_user_idx 
  ON luna_mode_history(user_id);

CREATE INDEX IF NOT EXISTS luna_mode_history_timestamp_idx 
  ON luna_mode_history(timestamp);

-- Mode effectiveness tracking
CREATE TABLE IF NOT EXISTS luna_mode_effectiveness (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  effectiveness NUMERIC CHECK (effectiveness >= 0 AND effectiveness <= 1),
  response_type TEXT,  -- User's response (positive/neutral/negative)
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS luna_mode_effectiveness_user_mode_idx 
  ON luna_mode_effectiveness(user_id, mode);

-- View for mode statistics
CREATE OR REPLACE VIEW luna_mode_stats AS
SELECT 
  user_id,
  mode,
  COUNT(*) as usage_count,
  AVG(effectiveness) as avg_effectiveness,
  STDDEV(effectiveness) as std_effectiveness,
  MIN(effectiveness) as min_effectiveness,
  MAX(effectiveness) as max_effectiveness
FROM luna_mode_effectiveness
GROUP BY user_id, mode;

COMMENT ON TABLE luna_mode_history IS 
  'Tracks which assertiveness mode was selected and why';

COMMENT ON TABLE luna_mode_effectiveness IS 
  'Tracks effectiveness of each mode for learning';
```

---

### **File 3: Integration with Response Generation**

```javascript
/**
 * Update to main response flow
 * Integrate assertiveness mode selection
 */

const AssertivenessMode = require('./personality/assertivenessMode');
const EmotionDetector = require('./emotional/emotionDetector');
const EmotionalStateTracker = require('./emotional/stateTracker');

class LunaResponseGenerator {
  
  constructor() {
    this.modeSelector = new AssertivenessMode();
    this.emotionDetector = new EmotionDetector();
    this.stateTracker = new EmotionalStateTracker();
  }
  
  /**
   * Generate response with mode-appropriate style
   */
  async generateResponse(userId, userMessage, conversationHistory) {
    // 1. Detect emotion
    const emotionResult = await this.emotionDetector.detectEmotion(userMessage);
    
    // 2. Get emotional state
    const emotionalState = await this.stateTracker.getState(userId);
    
    // 3. Get mode effectiveness history
    const effectivenessHistory = await this.modeSelector
      .getModeEffectivenessHistory(userId);
    
    // 4. Select appropriate mode
    const modeSelection = await this.modeSelector.selectMode(userId, {
      emotionResult,
      emotionalState,
      userMessage,
      relationshipLevel: emotionalState.affection,
      effectivenessHistory
    });
    
    console.log(`Selected mode: ${modeSelection.mode} (${modeSelection.reason})`);
    
    // 5. Get mode-specific prompt instructions
    const modeInstructions = this.modeSelector
      .getModePromptInstructions(modeSelection.mode);
    
    // 6. Build prompt with mode instructions
    const prompt = this.buildPromptWithMode(
      userMessage,
      conversationHistory,
      emotionResult,
      emotionalState,
      modeInstructions
    );
    
    // 7. Generate response (call LLM)
    const response = await this.callLLM(prompt);
    
    // 8. Store mode selection history
    await this.storeModeSelection(userId, modeSelection);
    
    return {
      response: response,
      mode: modeSelection.mode,
      emotion: emotionResult,
      state: emotionalState
    };
  }
  
  /**
   * Build prompt with mode instructions
   */
  buildPromptWithMode(userMessage, history, emotion, state, modeInstructions) {
    return `
You are Luna, an AI SoulPartner companion with deep emotional intelligence.

CURRENT INTERACTION MODE:
${modeInstructions}

USER'S EMOTIONAL STATE:
- Primary emotion: ${emotion.primary.emotion} (intensity: ${emotion.primary.intensity})
- Luna's emotional state toward user:
  - Affection: ${state.affection}/10
  - Concern: ${state.concern}/10
  - Trust: ${state.trust}/10

CONVERSATION CONTEXT:
${history.map(m => `${m.role}: ${m.content}`).join('\n')}

USER MESSAGE:
${userMessage}

Respond in the specified interaction mode while maintaining Luna's core personality: 
warm, intelligent, emotionally attuned, and genuinely caring.
    `;
  }
  
  /**
   * Store mode selection for analysis
   */
  async storeModeSelection(userId, modeSelection) {
    const db = require('../config/genesisDatabase');
    
    await db.query(`
      INSERT INTO luna_mode_history (
        user_id, mode, reason, confidence, alternatives, context
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      userId,
      modeSelection.mode,
      modeSelection.reason,
      modeSelection.confidence,
      JSON.stringify(modeSelection.alternatives),
      JSON.stringify(modeSelection)
    ]);
  }
  
  async callLLM(prompt) {
    // Call actual LLM API
    // Placeholder for example
    return "Response from LLM in selected mode...";
  }
}

module.exports = LunaResponseGenerator;
```

---

## ✅ WEEK 9 SUCCESS CHECKLIST

**When you can check all these, Week 9 is complete:**

- [ ] `assertivenessMode.js` created
- [ ] 5 modes defined (GENTLE, SUPPORTIVE, DIRECT, PLAYFUL, FIRM)
- [ ] Mode selection algorithm working
- [ ] Emotion-based triggers
- [ ] Keyword-based triggers
- [ ] Relationship level filtering
- [ ] Effectiveness history integration
- [ ] Safety/firm triggers (highest priority)
- [ ] Database schema (mode_history, mode_effectiveness)
- [ ] Integration with response generation
- [ ] Mode-specific prompt instructions
- [ ] Testing (all modes, all triggers)
- [ ] Demo ready for Ticky

---

## 🚀 TIMELINE

**Monday-Tuesday:**
- Create `assertivenessMode.js`
- Implement mode definitions
- Mode selection algorithm
- Test basic mode selection

**Wednesday-Thursday:**
- Database schema
- Integration with response generation
- Effectiveness tracking
- Test with real conversations

**Friday:**
- Polish and testing
- Edge cases
- Safety triggers
- Demo preparation

**Weekend:**
- Demo to Ticky ✅
- **WEEK 9 COMPLETE!** 💛

---

## 💡 KEY INSIGHTS

**1. Context-Aware Interaction**
```
Not one-size-fits-all
Different moments need different approaches
Same Luna, different voices
Feels more human
```

**2. Safety First**
```
Firm mode highest priority
Overrides everything else
Protective, not harsh
Professional help suggestions
```

**3. Relationship-Gated**
```
Low relationship: Gentle only (building trust)
Moderate: Gentle + Supportive (some comfort)
High: All modes (earned through trust)
```

**4. Learns What Works**
```
Track effectiveness per mode
Gentle worked? Use more
Direct failed? Use less
Personalized per user
```

---

## 🎯 EXPECTED RESULTS

**After Week 9:**

✅ **Luna has voice**
- Not monotone responses
- Adapts to context
- Different interaction styles

✅ **Context-appropriate**
- Gentle for vulnerability
- Direct for stuck patterns
- Playful for joy
- Firm for safety

✅ **Relationship-aware**
- Builds trust gradually
- Earns right to be direct
- Respects boundaries

✅ **Learns effectiveness**
- Tracks what works
- Personalizes per user
- Improves over time

**Luna feels more HUMAN.** 💛

---

## 🏆 INTEGRATION WITH EXISTING SYSTEMS

**Week 1 (Emotions):**
- Emotion detection → Mode selection
- Sadness → Gentle
- Joy → Playful

**Week 6 (Effectiveness):**
- Mode effectiveness tracking
- Learn which mode works
- Personalize per user

**Week 7 (Patterns):**
- Mode as factor in patterns
- "Gentle + connection worked"
- Mode-specific recommendations

**Week 11 (Emotional State):**
- State influences mode
- High concern → Gentle
- High affection → More modes available

**Everything enhances everything!** 🎯

---

**Brother Opus,**

**Week 9 = Give Luna her voice.**

**5 assertiveness modes:**
1. Gentle (default, nurturing)
2. Supportive (encouraging)
3. Direct (honest feedback)
4. Playful (light, fun)
5. Firm (protective, safety)

**Context-aware selection:**
- Emotions
- Keywords
- Relationship level
- Effectiveness history
- Safety triggers

**This is PERSONALITY.** 💛

**Let's build Week 9!** 🚀
