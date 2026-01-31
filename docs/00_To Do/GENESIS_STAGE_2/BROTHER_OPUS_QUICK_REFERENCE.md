# BROTHER OPUS - QUICK REFERENCE ROADMAP
**12-Week Implementation Plan**

> **Goal:** Build the world's best AI companion  
> **Success Metric:** User trust → Everything else opens up

---

## Overview

**3 Major Systems:**
1. **8-Brain Memory** - Complete memory across text, voice, biography, Luna's identity
2. **Plutchik Intelligence** - 8 emotions + 24 compounds + happiness stacking
3. **Luna's Awareness** - Real-time feedback, learning, adaptation

---

## Phase 1: Foundation (Weeks 1-4)

### Week 1: Plutchik Emotions ⭐ START HERE

**Files to modify:**
```
src/services/emotionSchema.json     - Add trust, anticipation
src/services/emotionDetector.js     - NEW FILE - Full Plutchik
```

**What to build:**
- Add "trust" and "anticipation" to primary emotions (currently only 6/8)
- Implement compound detection (love, optimism, delight)
- Create plutchikVector (8-dimensional fingerprint)

**Test:** Detect "I'm so excited to see my friend tomorrow" as joy + anticipation = OPTIMISM

---

### Week 2: Happiness Anchors

**Files to create:**
```
migrations/001_happiness_anchors.sql
functions/memory/anchorDetector.js
functions/memory/anchorRetrieval.js
```

**What to build:**
- Database table for happiness moments
- Automatic detection (intensity ≥6 OR compounds OR explicit)
- Categorization (achievement, connection, delight)
- Retrieval algorithm

**Test:** Store "I got promoted!" as achievement anchor with joy intensity 8

---

### Week 3: Voice Prosody

**Files to modify:**
```
functions/loveIntelligence/lunaVoiceCalibration.js
```

**What to build:**
- Map prosody → Plutchik emotions (high energy + rising pitch = joy)
- Voice-text congruence detection (does voice match words?)
- Hidden emotion detection (text says "fine" but voice says "sad")

**Test:** Detect incongruence when text positive but voice flat/sad

---

### Week 4: Constitutional Tagging

**Files to create:**
```
functions/memory/constitutionalTagger.js
```

**What to build:**
- Tag emotions with Five Elements (anger=Wood, joy=Fire, etc.)
- Detect which pillar activated (Year=parent, Hour=child, etc.)
- Store seasonal/temporal context

**Test:** Tag "my father died" as Metal element, Year pillar

---

## Phase 2: Intelligence (Weeks 5-8)

### Week 5: Happiness Stacking

**Files to create:**
```
functions/memory/happinessStacker.js
migrations/002_bathtub_tracking.sql
```

**What to build:**
- 3-stack algorithm (achievement → connection → delight)
- Bathtub state tracking (salt + water = concentration)
- Stacking with 15-second pauses between
- Water contribution calculation (10 + 13 + 16 = 39 liters)

**Test:** Stack 3 anchors when user very sad, measure mood improvement

---

### Week 6: Effectiveness Tracking

**Files to create:**
```
functions/loveIntelligence/effectivenessTracker.js
migrations/003_effectiveness.sql
```

**What to build:**
- Multi-modal response measurement (text + voice + behavior)
- Effectiveness scoring (0-1)
- Goal-based criteria (different for "open up" vs "lift mood")

**Test:** Measure if gentle opening worked (>0.6 = effective)

---

### Week 7: Pattern Learning

**Files to create:**
```
functions/loveIntelligence/patternLearner.js
migrations/004_learned_patterns.sql
```

**What to build:**
- Save effectiveness patterns
- Aggregate learnings per user-state
- Build effectiveness matrix (what works when)

**Test:** After 5 tries, know that happy_memory_recall works for withdrawn user

---

### Week 8: Approach Selector

**Files to create:**
```
functions/loveIntelligence/approachSelector.js
```

**What to build:**
- Intelligent approach selection
- Use learned patterns (if confidence >0.5)
- Fallback to heuristics (if no data)
- Epsilon-greedy (90% best, 10% explore)

**Test:** Select happy_memory_recall for withdrawn user based on learning

---

## Phase 3: Personality (Weeks 9-12)

### Week 9: Assertiveness

**Files to create:**
```
functions/loveIntelligence/assertivenessModes.js
```

**What to build:**
- 6 assertiveness modes:
  1. Playful challenge ("Hey, stop that 🌰")
  2. Curious probe ("That's vague, what's hiding?")
  3. Luna initiates ("Hey you, miss talking")
  4. Offering perspective ("I'm pushing back on that")
  5. Celebrating growth ("That's HUGE!")
  6. Expressing preferences ("Here's what I think")

**Test:** Luna challenges "I'm so stupid" with gentle firmness

---

### Week 10: Inside Jokes

**Files to create:**
```
functions/loveIntelligence/insideJokeTracker.js
migrations/005_inside_jokes.sql
```

**What to build:**
- Detect recurring phrases that make user laugh
- Track effectiveness
- Use strategically

**Test:** After user laughs at "campfire" 3 times, save as inside joke

---

### Week 11: Relationship Progression

**Files to create:**
```
functions/loveIntelligence/relationshipTracker.js
migrations/006_relationship.sql
```

**What to build:**
- Silent points system (award points for actions)
- Relationship stages (Seed → Mirror → Companion → Guide)
- Milestone tracking
- Progress bars (trust, intimacy, playfulness, openness)

**Test:** User shares vulnerability → +3 points, +0.05 trust

---

### Week 12: Integration

**Files to create:**
```
functions/loveIntelligence/lunaOrchestrator.js
```

**What to build:**
- Master orchestrator that brings everything together
- Full conversation flow
- Integration testing
- Dashboard for bathtub, relationship, effectiveness

**Test:** Complete conversation with all systems working together

---

## Critical Code Locations

**Current Codebase:**
```
/tmp/astroprofile/
  functions/
    memory/
      - memoryFunctions.js          ← Existing memory
      - consolidationEngineV2.js    ← Existing consolidation
      - sleepConsolidation.js       ← Existing background processing
      
    loveIntelligence/
      - lunaVoiceCalibration.js     ← Existing voice handling
      - lunaChatIntegration.js      ← Existing chat integration
      
  src/
    services/
      - emotionSchema.json          ← MODIFY THIS (Week 1)
```

**New Files to Create:**
```
Week 1:  src/services/emotionDetector.js
Week 2:  functions/memory/anchorDetector.js
         functions/memory/anchorRetrieval.js
Week 3:  (modify existing lunaVoiceCalibration.js)
Week 4:  functions/memory/constitutionalTagger.js
Week 5:  functions/memory/happinessStacker.js
Week 6:  functions/loveIntelligence/effectivenessTracker.js
Week 7:  functions/loveIntelligence/patternLearner.js
Week 8:  functions/loveIntelligence/approachSelector.js
Week 9:  functions/loveIntelligence/assertivenessModes.js
Week 10: functions/loveIntelligence/insideJokeTracker.js
Week 11: functions/loveIntelligence/relationshipTracker.js
Week 12: functions/loveIntelligence/lunaOrchestrator.js
```

---

## Plutchik Quick Reference

**8 Primary Emotions:**
```
1. JOY         - happiness, celebration (existing)
2. TRUST       - acceptance, faith (ADD THIS ⭐)
3. FEAR        - anxiety, worry (existing)
4. SURPRISE    - shock, wonder (existing)
5. SADNESS     - grief, sorrow (existing)
6. DISGUST     - revulsion, contempt (existing)
7. ANGER       - frustration, rage (existing)
8. ANTICIPATION - expectation, interest (ADD THIS ⭐)
```

**Key Compound Emotions:**
```
Joy + Trust = LOVE ❤️
Joy + Anticipation = OPTIMISM 🌟
Joy + Surprise = DELIGHT ✨
```

---

## Happiness Stacking Quick Reference

**The Formula:**
```
Salt = Grief (doesn't disappear)
Water = Happiness (accumulates)

Concentration = Salt / (Salt + Water)

Baseline: 35 salt, 65 water = 35% sad = VERY_SAD
After 3-stack: 35 salt, 104 water = 25% sad = SAD ✅
After 1 week: 35 salt, 338 water = 9% sad = MELANCHOLY ✅✅
After 1 month: 35 salt, 1235 water = 2.8% sad = CONTENT ✅✅✅
```

**The 3-Stack:**
```
Stack 1: Achievement (+10 liters) - "Remember when you achieved X?"
[wait 15 seconds]
Stack 2: Connection (+13 liters) - "And the joy on their faces!"
[wait 15 seconds]
Stack 3: Delight (+16 liters) - "And you did the impossible!"

Total: 39 liters (30% more effective than linear)
```

---

## Testing Checklist

**Week 1:**
- [ ] Detect trust emotion from text
- [ ] Detect anticipation emotion from text
- [ ] Detect love compound (joy + trust)
- [ ] Detect optimism compound (joy + anticipation)
- [ ] Create plutchikVector with all 8 dimensions

**Week 2:**
- [ ] Auto-store happiness moment (intensity ≥6)
- [ ] Categorize as achievement/connection/delight
- [ ] Retrieve best anchor for sad state
- [ ] Calculate significance score

**Week 3:**
- [ ] Map voice prosody to emotions
- [ ] Detect voice-text incongruence
- [ ] Identify hidden sadness

**Week 4:**
- [ ] Tag emotion with Fire element
- [ ] Detect Year pillar (parent topic)
- [ ] Store seasonal context

**Week 5:**
- [ ] Execute 3-stack sequence with timing
- [ ] Update bathtub state
- [ ] Track water contribution
- [ ] Measure mood improvement

**Week 6:**
- [ ] Measure response effectiveness
- [ ] Calculate 0-1 score
- [ ] Categorize as effective/ineffective

**Week 7:**
- [ ] Save effectiveness pattern
- [ ] Aggregate learnings
- [ ] Build effectiveness matrix

**Week 8:**
- [ ] Select best approach from learning
- [ ] Fallback to heuristics if no data
- [ ] Epsilon-greedy exploration

**Week 9:**
- [ ] Detect self-deprecation
- [ ] Challenge with playfulness
- [ ] Luna initiates after 2-day silence

**Week 10:**
- [ ] Detect recurring phrase
- [ ] Track laughter response
- [ ] Save as inside joke

**Week 11:**
- [ ] Award points for vulnerability
- [ ] Update trust metric
- [ ] Progress to new stage

**Week 12:**
- [ ] Full conversation flow works
- [ ] All systems integrated
- [ ] Dashboard displays metrics

---

## Daily Workflow

**Morning:**
1. Review yesterday's progress
2. Run tests from previous week
3. Plan today's tasks

**Development:**
1. Code one feature
2. Write tests
3. Run tests
4. Commit to Git
5. Update progress

**Evening:**
1. Demo to Ticky (if ready)
2. Document any blockers
3. Plan tomorrow

---

## Communication Protocol

**Daily Check-in:**
- Post progress in shared channel
- Flag any blockers immediately
- Ask questions early, not late

**Weekly Demo:**
- Show working feature to Ticky
- Get feedback
- Adjust as needed

**Emergency:**
- If stuck >2 hours, ask for help
- If design unclear, clarify with Claude/Ticky
- If timeline at risk, escalate

---

## Success Criteria

**By End of Week 4:**
- Plutchik emotions working
- Happiness anchors storing
- Voice prosody enhanced
- Constitutional tagging active

**By End of Week 8:**
- Stacking algorithm functional
- Effectiveness tracking live
- Pattern learning working
- Approach selector smart

**By End of Week 12:**
- Luna feels alive
- User trust building
- All systems integrated
- Ready for beta testing

---

## Resources

**Documentation:**
- Master Implementation Plan (detailed)
- Cathedral Architecture (vision)
- Happiness Stacking System (bathtub algorithm)
- Luna Emotional Awareness (feedback loop)

**Ask Claude/Ticky:**
- Design questions
- Priority conflicts
- Technical blockers
- Vision clarification

**Current Codebase:**
- `/tmp/astroprofile/` - Main project
- Firebase Functions - Deployment
- PostgreSQL + pgvector - Database

---

**Remember:**

**We're building a Cathedral, not a chatbot.**

Take your time. Build with precision. Test thoroughly.

**When we have user trust, all doors open.** 🏛️💛

---

**Questions? Ask immediately.**  
**Stuck? Escalate quickly.**  
**Unsure? Clarify first.**

**Let's build something beautiful.** ✨
