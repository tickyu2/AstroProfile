# WEEK 3: VOICE PROSODY ENHANCEMENT 🎤
**Map voice to emotions. Detect hidden feelings. Enhance authenticity.**

---

## ✅ WEEK 2 COMPLETE - EXCEPTIONAL WORK!

**You implemented:**
- ✅ Auto-detection of happiness moments
- ✅ Significance scoring (0-1 with bonuses)
- ✅ Smart categorization (achievement/connection/delight)
- ✅ Element & Pillar detection
- ✅ Stacking sequence selection
- ✅ pgvector semantic similarity
- ✅ Opposite anchor finding
- ✅ Bathtub algorithm preview (53 water from 3-stack!)

**The Cathedral grows stronger!** 🏛️

---

## 🎯 WEEK 3 GOAL: VOICE PROSODY ENHANCEMENT

**What is Voice Prosody Enhancement?**
- Map voice characteristics (energy, pitch, rate, quality) to all 8 Plutchik emotions
- Detect voice-text congruence (does voice match words?)
- Identify hidden emotions (text says "I'm fine" but voice says sadness)
- Enhance authenticity scoring for better anchor detection

**Example:**
```
User: "I'm fine." (text: neutral)
Voice: low energy, falling pitch, slow tempo, breathy quality

Detection:
- Text emotion: neutral (0.3)
- Voice emotion: sadness (0.85)
- Congruence: LOW (0.15)
- Hidden emotion: SADNESS detected!
- Authenticity: 0.85 (voice is authentic, text is masking)

→ Luna responds to the SADNESS, not the "I'm fine"
```

---

## 📋 WEEK 3 TASKS

### **File 1: `functions/loveIntelligence/voiceProsodyMapper.js`** (NEW)

**Purpose:** Map voice characteristics to Plutchik emotions

```javascript
/**
 * Voice Prosody to Plutchik Emotion Mapper
 * Maps voice characteristics to 8 primary emotions
 */

class VoiceProsodyMapper {
  
  /**
   * Map voice prosody to all 8 Plutchik emotions
   * Returns: { joy, trust, fear, surprise, sadness, disgust, anger, anticipation }
   */
  mapProsodyToEmotions(voiceProsody) {
    if (!voiceProsody) {
      return this.getNeutralVector();
    }
    
    const emotions = {
      joy: this.detectJoyFromVoice(voiceProsody),
      trust: this.detectTrustFromVoice(voiceProsody),
      fear: this.detectFearFromVoice(voiceProsody),
      surprise: this.detectSurpriseFromVoice(voiceProsody),
      sadness: this.detectSadnessFromVoice(voiceProsody),
      disgust: this.detectDisgustFromVoice(voiceProsody),
      anger: this.detectAngerFromVoice(voiceProsody),
      anticipation: this.detectAnticipationFromVoice(voiceProsody)
    };
    
    return emotions;
  }
  
  /**
   * JOY voice signature:
   * - High energy
   * - Rising pitch
   * - Fast tempo
   * - Clear/bright quality
   */
  detectJoyFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'high') score += 0.3;
    if (voice.energy === 'medium') score += 0.1;
    
    if (voice.pitch === 'rising') score += 0.25;
    if (voice.pitch === 'high') score += 0.15;
    
    if (voice.rate === 'fast') score += 0.2;
    if (voice.rate === 'normal') score += 0.1;
    
    if (voice.quality === 'clear' || voice.quality === 'bright') score += 0.15;
    
    // Laughter detection
    if (voice.laughter) score += 0.4;
    
    return Math.min(1, score);
  }
  
  /**
   * TRUST voice signature:
   * - Medium energy
   * - Stable pitch
   * - Moderate tempo
   * - Warm/smooth quality
   */
  detectTrustFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'medium') score += 0.25;
    if (voice.energy === 'high') score += 0.1;
    
    if (voice.pitch === 'stable') score += 0.3;
    
    if (voice.rate === 'normal') score += 0.2;
    
    if (voice.quality === 'warm' || voice.quality === 'smooth') score += 0.25;
    
    return Math.min(1, score);
  }
  
  /**
   * FEAR voice signature:
   * - Variable energy (medium-high)
   * - Unstable/shaky pitch
   * - Fast/irregular tempo
   * - Tense/strained quality
   */
  detectFearFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'high') score += 0.15;
    if (voice.energy === 'medium') score += 0.2;
    
    if (voice.pitch === 'unstable' || voice.pitch === 'shaky') score += 0.35;
    if (voice.pitch === 'rising') score += 0.15;
    
    if (voice.rate === 'fast') score += 0.2;
    if (voice.rate === 'irregular') score += 0.25;
    
    if (voice.quality === 'tense' || voice.quality === 'strained') score += 0.3;
    if (voice.quality === 'breathy') score += 0.15;
    
    // Pauses/hesitations indicate fear
    if (voice.pauses === 'frequent' || voice.pauses === 'hesitant') score += 0.2;
    
    return Math.min(1, score);
  }
  
  /**
   * SURPRISE voice signature:
   * - Sudden energy spike
   * - Pitch spike (high/rising suddenly)
   * - Rate change
   * - Sharp quality
   */
  detectSurpriseFromVoice(voice) {
    let score = 0;
    
    if (voice.energySpike) score += 0.4;
    if (voice.energy === 'high') score += 0.15;
    
    if (voice.pitchSpike || voice.pitch === 'sudden_high') score += 0.4;
    if (voice.pitch === 'rising') score += 0.15;
    
    if (voice.rateChange) score += 0.2;
    
    if (voice.quality === 'sharp') score += 0.15;
    
    return Math.min(1, score);
  }
  
  /**
   * SADNESS voice signature:
   * - Low energy
   * - Falling/low pitch
   * - Slow tempo
   * - Breathy/soft quality
   */
  detectSadnessFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'low') score += 0.35;
    if (voice.energy === 'very_low') score += 0.4;
    
    if (voice.pitch === 'falling') score += 0.25;
    if (voice.pitch === 'low') score += 0.3;
    
    if (voice.rate === 'slow') score += 0.25;
    if (voice.rate === 'very_slow') score += 0.3;
    
    if (voice.quality === 'breathy' || voice.quality === 'soft') score += 0.2;
    if (voice.quality === 'monotone') score += 0.15;
    
    // Sighs indicate sadness
    if (voice.sighs) score += 0.3;
    
    // Long pauses indicate sadness
    if (voice.pauses === 'long') score += 0.2;
    
    return Math.min(1, score);
  }
  
  /**
   * DISGUST voice signature:
   * - Variable energy
   * - Flat/descending pitch
   * - Sharp/harsh quality
   */
  detectDisgustFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'medium') score += 0.15;
    if (voice.energy === 'low') score += 0.2;
    
    if (voice.pitch === 'flat') score += 0.25;
    if (voice.pitch === 'descending') score += 0.2;
    
    if (voice.quality === 'sharp' || voice.quality === 'harsh') score += 0.3;
    if (voice.quality === 'tense') score += 0.15;
    
    return Math.min(1, score);
  }
  
  /**
   * ANGER voice signature:
   * - High energy
   * - Rising/sharp pitch
   * - Fast/forceful tempo
   * - Harsh/strained quality
   */
  detectAngerFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'high') score += 0.3;
    if (voice.energy === 'very_high') score += 0.4;
    
    if (voice.pitch === 'rising') score += 0.2;
    if (voice.pitch === 'sharp' || voice.pitch === 'high') score += 0.25;
    
    if (voice.rate === 'fast') score += 0.2;
    if (voice.rate === 'forceful') score += 0.25;
    
    if (voice.quality === 'harsh' || voice.quality === 'strained') score += 0.3;
    if (voice.quality === 'tense') score += 0.2;
    
    if (voice.volume === 'loud') score += 0.2;
    
    return Math.min(1, score);
  }
  
  /**
   * ANTICIPATION voice signature:
   * - Medium-high energy
   * - Rising pitch
   * - Increasing tempo
   * - Alert/eager quality
   */
  detectAnticipationFromVoice(voice) {
    let score = 0;
    
    if (voice.energy === 'high') score += 0.25;
    if (voice.energy === 'medium') score += 0.2;
    if (voice.energyIncreasing) score += 0.2;
    
    if (voice.pitch === 'rising') score += 0.3;
    
    if (voice.rate === 'fast') score += 0.15;
    if (voice.rate === 'increasing') score += 0.2;
    
    if (voice.quality === 'alert' || voice.quality === 'eager') score += 0.2;
    
    return Math.min(1, score);
  }
  
  /**
   * Get neutral emotion vector
   */
  getNeutralVector() {
    return {
      joy: 0,
      trust: 0,
      fear: 0,
      surprise: 0,
      sadness: 0,
      disgust: 0,
      anger: 0,
      anticipation: 0
    };
  }
}

module.exports = VoiceProsodyMapper;
```

---

### **File 2: `functions/loveIntelligence/emotionCongruenceDetector.js`** (NEW)

**Purpose:** Detect voice-text congruence and hidden emotions

```javascript
/**
 * Emotion Congruence Detector
 * Detects alignment between text emotion and voice emotion
 */

class EmotionCongruenceDetector {
  
  constructor() {
    this.congruenceThreshold = 0.3; // If difference > 0.3, emotions don't match
  }
  
  /**
   * Main congruence detection
   * Returns: {
   *   isCongruent: boolean,
   *   congruenceScore: 0-1,
   *   hiddenEmotion: string | null,
   *   dominantSource: 'text' | 'voice',
   *   authenticity: 0-1
   * }
   */
  detectCongruence(textEmotion, voiceEmotion) {
    if (!voiceEmotion) {
      // No voice data - trust text only
      return {
        isCongruent: true,
        congruenceScore: 1.0,
        hiddenEmotion: null,
        dominantSource: 'text',
        authenticity: 0.7 // Lower authenticity without voice confirmation
      };
    }
    
    // Find dominant emotion in each modality
    const textDominant = this.findDominantEmotion(textEmotion.plutchikVector);
    const voiceDominant = this.findDominantEmotion(voiceEmotion);
    
    // Calculate congruence score
    const congruenceScore = this.calculateCongruenceScore(
      textEmotion.plutchikVector, 
      voiceEmotion
    );
    
    // Determine if congruent
    const isCongruent = congruenceScore >= (1 - this.congruenceThreshold);
    
    // Detect hidden emotion
    let hiddenEmotion = null;
    if (!isCongruent) {
      // Voice emotion is stronger than text emotion
      if (voiceDominant.score > textDominant.score + 0.2) {
        hiddenEmotion = voiceDominant.emotion;
      }
    }
    
    // Determine dominant source
    const dominantSource = voiceDominant.score > textDominant.score ? 'voice' : 'text';
    
    // Calculate authenticity
    const authenticity = this.calculateAuthenticity(
      textEmotion,
      voiceEmotion,
      isCongruent
    );
    
    return {
      isCongruent,
      congruenceScore,
      hiddenEmotion,
      dominantSource,
      authenticity,
      textEmotion: textDominant,
      voiceEmotion: voiceDominant
    };
  }
  
  /**
   * Find dominant emotion from plutchik vector
   */
  findDominantEmotion(plutchikVector) {
    let maxEmotion = 'neutral';
    let maxScore = 0;
    
    for (const [emotion, score] of Object.entries(plutchikVector)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion;
      }
    }
    
    return { emotion: maxEmotion, score: maxScore };
  }
  
  /**
   * Calculate congruence score using cosine similarity
   * 1.0 = perfect match, 0.0 = completely different
   */
  calculateCongruenceScore(textVector, voiceVector) {
    const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];
    
    let dotProduct = 0;
    let textMagnitude = 0;
    let voiceMagnitude = 0;
    
    emotions.forEach(emotion => {
      const textVal = textVector[emotion] || 0;
      const voiceVal = voiceVector[emotion] || 0;
      
      dotProduct += textVal * voiceVal;
      textMagnitude += textVal * textVal;
      voiceMagnitude += voiceVal * voiceVal;
    });
    
    textMagnitude = Math.sqrt(textMagnitude);
    voiceMagnitude = Math.sqrt(voiceMagnitude);
    
    if (textMagnitude === 0 || voiceMagnitude === 0) {
      return 0;
    }
    
    return dotProduct / (textMagnitude * voiceMagnitude);
  }
  
  /**
   * Calculate authenticity score
   * Higher when voice and text align
   * Still high when voice is stronger (text masking is common)
   */
  calculateAuthenticity(textEmotion, voiceEmotion, isCongruent) {
    if (isCongruent) {
      return 0.9; // High authenticity when aligned
    }
    
    // Check if text is neutral but voice shows emotion
    const textNeutral = textEmotion.primary.emotion === 'neutral' || 
                        textEmotion.primary.intensity < 3;
    
    const voiceDominant = this.findDominantEmotion(voiceEmotion);
    const voiceStrong = voiceDominant.score > 0.6;
    
    if (textNeutral && voiceStrong) {
      // User is masking emotion - voice is more authentic
      return 0.85;
    }
    
    // Text and voice disagree - moderate authenticity
    return 0.5;
  }
  
  /**
   * Detect specific masking patterns
   */
  detectMaskingPattern(textMessage, textEmotion, voiceEmotion) {
    const patterns = {
      'fine_masking': {
        textKeywords: ['fine', 'okay', 'alright', "i'm good"],
        voiceEmotion: 'sadness',
        description: 'User says "fine" but voice shows sadness'
      },
      'happy_masking': {
        textKeywords: ['happy', 'great', 'awesome'],
        voiceEmotion: 'fear',
        description: 'User says happy but voice shows anxiety'
      },
      'calm_masking': {
        textKeywords: ['calm', 'no problem', 'whatever'],
        voiceEmotion: 'anger',
        description: 'User says calm but voice shows anger'
      }
    };
    
    const lowerMessage = textMessage.toLowerCase();
    const voiceDominant = this.findDominantEmotion(voiceEmotion);
    
    for (const [patternName, pattern] of Object.entries(patterns)) {
      const hasTextKeyword = pattern.textKeywords.some(kw => lowerMessage.includes(kw));
      const hasVoiceEmotion = voiceDominant.emotion === pattern.voiceEmotion && 
                              voiceDominant.score > 0.6;
      
      if (hasTextKeyword && hasVoiceEmotion) {
        return {
          pattern: patternName,
          description: pattern.description,
          confidence: voiceDominant.score
        };
      }
    }
    
    return null;
  }
}

module.exports = EmotionCongruenceDetector;
```

---

### **File 3: Update `src/services/emotionDetector.js`**

**Purpose:** Integrate voice prosody mapping and congruence detection

```javascript
// Add these imports at the top
const VoiceProsodyMapper = require('../../functions/loveIntelligence/voiceProsodyMapper');
const EmotionCongruenceDetector = require('../../functions/loveIntelligence/emotionCongruenceDetector');

class PlutchikEmotionDetector {
  
  constructor() {
    // ... existing code ...
    
    // Add these
    this.prosodyMapper = new VoiceProsodyMapper();
    this.congruenceDetector = new EmotionCongruenceDetector();
  }
  
  /**
   * Enhanced main detection with voice congruence
   */
  detectAllEmotions(text, voiceProsody = null) {
    // Detect from text (existing code)
    const textEmotions = {
      joy: this.detectJoy(text, null),
      trust: this.detectTrust(text, null),
      fear: this.detectFear(text, null),
      surprise: this.detectSurprise(text, null),
      sadness: this.detectSadness(text, null),
      disgust: this.detectDisgust(text, null),
      anger: this.detectAnger(text, null),
      anticipation: this.detectAnticipation(text, null)
    };
    
    // Detect from voice (NEW)
    let voiceEmotions = null;
    let congruenceAnalysis = null;
    
    if (voiceProsody) {
      voiceEmotions = this.prosodyMapper.mapProsodyToEmotions(voiceProsody);
      
      // Blend text + voice emotions
      const blendedEmotions = this.blendEmotions(textEmotions, voiceEmotions);
      
      // Detect congruence
      const textResult = {
        primary: this.findDominant(textEmotions),
        plutchikVector: textEmotions
      };
      
      congruenceAnalysis = this.congruenceDetector.detectCongruence(
        textResult,
        voiceEmotions
      );
      
      // Check for masking patterns
      const maskingPattern = this.congruenceDetector.detectMaskingPattern(
        text,
        textResult,
        voiceEmotions
      );
      
      if (maskingPattern) {
        congruenceAnalysis.maskingPattern = maskingPattern;
      }
      
      // Use blended emotions as primary
      const dominant = this.findDominant(blendedEmotions);
      const compounds = this.detectCompounds(blendedEmotions);
      
      return {
        primary: {
          emotion: dominant.emotion,
          intensity: Math.round(dominant.score * 10),
          confidence: dominant.score
        },
        compounds: compounds,
        plutchikVector: blendedEmotions,
        timestamp: Date.now(),
        
        // NEW: Voice analysis
        voiceAnalysis: {
          voiceEmotions: voiceEmotions,
          textEmotions: textEmotions,
          congruence: congruenceAnalysis
        },
        
        // NEW: Authenticity score
        authenticity: congruenceAnalysis.authenticity
      };
    }
    
    // No voice - use text only (existing behavior)
    const dominant = this.findDominant(textEmotions);
    const compounds = this.detectCompounds(textEmotions);
    
    return {
      primary: {
        emotion: dominant.emotion,
        intensity: Math.round(dominant.score * 10),
        confidence: dominant.score
      },
      compounds: compounds,
      plutchikVector: textEmotions,
      timestamp: Date.now(),
      authenticity: 0.7 // Lower without voice confirmation
    };
  }
  
  /**
   * Blend text and voice emotions
   * Voice gets 60% weight, text gets 40%
   * (Voice is harder to fake)
   */
  blendEmotions(textEmotions, voiceEmotions) {
    const blended = {};
    
    for (const emotion of Object.keys(textEmotions)) {
      blended[emotion] = 
        textEmotions[emotion] * 0.4 + 
        voiceEmotions[emotion] * 0.6;
    }
    
    return blended;
  }
  
  // ... rest of existing code ...
}
```

---

### **File 4: `functions/test/test-voice-congruence.js`** (NEW)

**Purpose:** Test voice-text congruence detection

```javascript
/**
 * Test Voice-Text Congruence Detection
 */

const PlutchikEmotionDetector = require('../../src/services/emotionDetector');

async function testVoiceCongruence() {
  console.log('\n🧪 Testing Voice-Text Congruence...\n');
  
  const detector = new PlutchikEmotionDetector();
  
  // Test 1: Congruent (happy text + happy voice)
  console.log('TEST 1: Congruent Emotions');
  console.log('----------------------------------------');
  
  const result1 = detector.detectAllEmotions(
    "I'm so happy about this!",
    {
      energy: 'high',
      pitch: 'rising',
      rate: 'fast',
      quality: 'bright',
      laughter: true
    }
  );
  
  console.log('Text emotion:', result1.voiceAnalysis.textEmotions);
  console.log('Voice emotion:', result1.voiceAnalysis.voiceEmotions);
  console.log('Congruent:', result1.voiceAnalysis.congruence.isCongruent);
  console.log('Congruence score:', result1.voiceAnalysis.congruence.congruenceScore.toFixed(2));
  console.log('Authenticity:', result1.authenticity.toFixed(2));
  
  // Test 2: Incongruent (neutral text + sad voice) - MASKING
  console.log('\nTEST 2: Hidden Sadness (Masking)');
  console.log('----------------------------------------');
  
  const result2 = detector.detectAllEmotions(
    "I'm fine.",
    {
      energy: 'low',
      pitch: 'falling',
      rate: 'slow',
      quality: 'breathy',
      sighs: true
    }
  );
  
  console.log('Text says: "fine"');
  console.log('Voice shows:', result2.voiceAnalysis.congruence.voiceEmotion);
  console.log('Congruent:', result2.voiceAnalysis.congruence.isCongruent);
  console.log('Hidden emotion:', result2.voiceAnalysis.congruence.hiddenEmotion);
  console.log('Masking pattern:', result2.voiceAnalysis.congruence.maskingPattern);
  console.log('Authenticity:', result2.authenticity.toFixed(2), '(voice is authentic, text is masking)');
  
  // Test 3: Incongruent (happy text + fearful voice)
  console.log('\nTEST 3: Forced Positivity');
  console.log('----------------------------------------');
  
  const result3 = detector.detectAllEmotions(
    "Everything is great!",
    {
      energy: 'medium',
      pitch: 'unstable',
      rate: 'fast',
      quality: 'tense',
      pauses: 'hesitant'
    }
  );
  
  console.log('Text says: great');
  console.log('Voice shows:', result3.voiceAnalysis.congruence.voiceEmotion);
  console.log('Congruent:', result3.voiceAnalysis.congruence.isCongruent);
  console.log('Dominant source:', result3.voiceAnalysis.congruence.dominantSource);
  console.log('Authenticity:', result3.authenticity.toFixed(2));
  
  // Test 4: Voice-only (strong emotion, neutral text)
  console.log('\nTEST 4: Anger (voice dominant)');
  console.log('----------------------------------------');
  
  const result4 = detector.detectAllEmotions(
    "Whatever.",
    {
      energy: 'very_high',
      pitch: 'sharp',
      rate: 'fast',
      quality: 'harsh',
      volume: 'loud'
    }
  );
  
  console.log('Text says: whatever (neutral)');
  console.log('Voice shows:', result4.voiceAnalysis.congruence.voiceEmotion);
  console.log('Final emotion:', result4.primary.emotion);
  console.log('Intensity:', result4.primary.intensity);
  console.log('Masking pattern:', result4.voiceAnalysis.congruence.maskingPattern);
  
  console.log('\n✅ Voice congruence tests complete!\n');
}

testVoiceCongruence().catch(console.error);
```

---

## ✅ WEEK 3 SUCCESS CHECKLIST

**When you can check all these, Week 3 is complete:**

- [ ] `voiceProsodyMapper.js` created
- [ ] All 8 emotions map from voice prosody
- [ ] Joy detected from high energy + rising pitch
- [ ] Sadness detected from low energy + falling pitch
- [ ] Fear detected from unstable pitch + tense quality
- [ ] `emotionCongruenceDetector.js` created
- [ ] Congruence score calculated (cosine similarity)
- [ ] Hidden emotions detected when voice ≠ text
- [ ] Masking patterns identified ("fine" + sad voice)
- [ ] Authenticity scoring works
- [ ] `emotionDetector.js` updated with voice integration
- [ ] Blended emotions (40% text + 60% voice)
- [ ] All tests passing
- [ ] Demo ready for Ticky

---

## 🚀 TIMELINE

**Monday-Tuesday:**
- Create `voiceProsodyMapper.js`
- Map all 8 emotions to voice characteristics
- Test individual emotion detection

**Wednesday-Thursday:**
- Create `emotionCongruenceDetector.js`
- Implement congruence scoring
- Detect masking patterns

**Friday:**
- Update `emotionDetector.js` with integration
- Integration testing
- Bug fixes

**Weekend:**
- Demo to Ticky ✅

---

## 💡 KEY INSIGHTS

**Why Voice Matters:**
- Voice is harder to fake than text
- "I'm fine" (text) vs sad voice = user needs help
- 60% voice weight because body doesn't lie

**Authenticity Scoring:**
- Congruent = 0.9 (both align)
- Masking = 0.85 (voice shows true emotion)
- Conflict = 0.5 (unclear)

**Masking Patterns:**
- "fine" + sadness = depression masking
- "great" + fear = anxiety masking
- "calm" + anger = suppressed anger

**This makes Luna SMART.** She sees through the mask and responds with compassion. 💛

---

## 🏆 THE VISION

**After Week 3, you'll have:**
- ✅ Complete voice-to-emotion mapping
- ✅ Hidden emotion detection
- ✅ Authenticity scoring for anchors
- ✅ Luna responds to TRUTH, not masks
- ✅ Foundation for therapeutic conversations

**This is what makes Luna BEST Emotional Responsiveness.** 🏆

**This is the Cathedral.** 🏛️

---

**Brother Opus,**

Week 2: ✅ CRUSHED  
Week 3: LET'S GO  

**Building for awards!** 🏆⚡

💛 **Pure Gold speed continues!**
