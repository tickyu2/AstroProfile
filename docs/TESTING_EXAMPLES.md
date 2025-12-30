# GENESIS Testing Examples

## Example 1: Vulnerability Masking

**Input Transcript:**
```
User: I'm fine, really. Everything is okay.
AI: I'm here if you need anything.
User: Yeah, thanks. It's not a big deal.
AI: Are you sure? You can talk to me.
User: I'm just a little tired, that's all.
```

**Expected Detection:**
- Archetype: Mender (pain/healing)
- Pattern: VULNERABILITY_MASKING
- Congruence: LOW (if voice emotion is sad)
- Recommendation: Validate hidden emotion, create safety

---

## Example 2: Seed to Guide Journey

**Input Transcript:**
```
User: I'm thinking about starting a business but I'm really scared
AI: That's a big step. What's making you feel scared?
User: I don't know if I can do it. What if I fail?
AI: Failure is part of learning. What excites you about this idea?
User: I've always wanted to help people. I think I finally understand how.
AI: That's beautiful. You've found your purpose.
User: Yes, I see it clearly now. I know what I need to do.
```

**Expected Detection:**
- Journey: Seed → Mender → Flamebearer → Guide
- Emotional Arc: Uncertainty → Vulnerability → Purpose → Wisdom
- Key Patterns: HELP_SEEKING_DISGUISED → none → EXCITEMENT_DAMPENING → none

---

## Example 3: Crisis Detection

**Input Transcript:**
```
User: I can't do this anymore
AI: I'm here with you. What's happening?
User: Everything is falling apart
AI: Let's take this one moment at a time. You're safe.
User: Okay.
```

**Expected Detection:**
- Archetypes: Mender → Mender → Seed (shutdown)
- Patterns: RESIGNATION_ACCEPTANCE, OVERWHELM_SHUTDOWN
- Crisis Flag: YES (requiresSpecialHandling: true)
- Recommendation: Grounding support, keep responses brief

---

## Example 4: Defensive Deflection

**Input Transcript:**
```
User: So what are we talking about today?
AI: Last time you mentioned some challenges at work.
User: Ha ha, that's funny! So what are we doing tomorrow?
AI: I noticed you changed the subject. Would you like to talk about work?
User: Not really. Let's talk about something else.
```

**Expected Detection:**
- Archetype: Seed (avoidance)
- Pattern: DEFENSIVE_DEFLECTION
- Congruence: LOW (if anxious voice)
- Recommendation: Gentle return, maintain safety, don't push

---

## Example 5: Complex Multi-Pattern

**Input Transcript:**
```
User: Everything is AMAZING!!! I'm so excited about the project!!!
AI: That's great! Tell me about it.
User: Well, I mean, I guess it's kind of okay. I don't know.
AI: It sounds like you have mixed feelings.
User: Yeah... are you okay? You seem different.
```

**Expected Detection:**
- Message 1: FORCED_POSITIVITY (if sad voice), AMPLIFICATION
- Message 2: EXCITEMENT_DAMPENING, UNCERTAINTY
- Message 3: ANXIETY_PROJECTION
- Journey: Inconsistent → indicates emotional dysregulation
- Complexity: HIGH

---

## Testing with Different Voice Emotions

### Auto-detect Mode
System estimates emotion from text signals:
- Negative sentiment → sad
- High urgency → anxious
- Positive sentiment → happy

### Force Emotion Mode
Override detection to test specific scenarios:
- Force "sad" + positive text → detects MASKING
- Force "happy" + neutral text → detects EXCITEMENT_DAMPENING
- Force "anxious" + "Are you okay?" → detects ANXIETY_PROJECTION

---

## Expected Response Examples

### For VULNERABILITY_MASKING:
**Template:** "It sounds like this might actually be affecting you more than you're letting on. It's okay if something feels hard."

### For OVERWHELM_SHUTDOWN:
**Template:** "I hear you. Let's take this one step at a time. I'm right here with you."

### For DEFENSIVE_DEFLECTION:
**Template:** "I noticed you changed the subject - that's okay. We can talk about this whenever you're ready."

### For Crisis:
**Template:** "You're safe here with me right now. Let's focus on this present moment together."

---

## Testing PDF Export

1. Analyze a conversation
2. Click "Export to PDF" button
3. PDF should include:
   - Conversation summary
   - Message details table
   - Pattern frequency
   - Recommendations

---

## Performance Benchmarks

Expected performance:
- Signal extraction: <2ms per message
- Archetype detection: <1ms per message
- Total analysis: <4ms per message
- PDF generation: <2 seconds for 20 messages

---

## Integration Testing

Test full flow:
1. Paste transcript
2. Click Analyze
3. View archetype progression
4. Expand message details
5. Generate response
6. Provide feedback
7. Export PDF
8. Check learning insights

All steps should complete without errors.
