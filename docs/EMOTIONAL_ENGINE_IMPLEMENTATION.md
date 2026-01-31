# Emotional Engine - Implementation Specifications

## New Modules to Build

---

## Module 1: EmotionalStateDetector

### File: `functions/emotional/emotionalStateDetector.js`

```javascript
/**
 * EmotionalStateDetector
 *
 * Analyzes user input (text + voice + context) to determine
 * their current emotional state with high precision.
 */
class EmotionalStateDetector {
  constructor(supabase) {
    this.supabase = supabase;

    // 32 Primary emotions with detection patterns
    this.emotionPatterns = {
      // Positive spectrum
      joy: {
        textMarkers: ['happy', 'excited', 'great', 'amazing', 'wonderful', 'yay', '!'],
        voiceMarkers: { pitch: 'high', pace: 'fast', volume: 'loud' },
        intensity: 0.7
      },
      love: {
        textMarkers: ['love', 'adore', 'care about', 'heart', 'miss you', 'mean everything'],
        voiceMarkers: { pitch: 'warm', pace: 'slow', breathiness: 'high' },
        intensity: 0.8
      },
      excitement: {
        textMarkers: ['omg', 'cant wait', 'so excited', 'amazing', '!!!'],
        voiceMarkers: { pitch: 'very_high', pace: 'very_fast', volume: 'loud' },
        intensity: 0.9
      },
      // ... 29 more emotions

      // Negative spectrum
      sadness: {
        textMarkers: ['sad', 'down', 'depressed', 'miss', 'hurts', 'crying', '...'],
        voiceMarkers: { pitch: 'low', pace: 'slow', volume: 'soft', tremor: true },
        intensity: 0.7
      },
      anxiety: {
        textMarkers: ['worried', 'anxious', 'scared', 'what if', 'cant stop thinking'],
        voiceMarkers: { pitch: 'high', pace: 'fast', breathiness: 'medium' },
        intensity: 0.75
      },
      anger: {
        textMarkers: ['angry', 'furious', 'hate', 'unfair', 'cant believe'],
        voiceMarkers: { pitch: 'low', pace: 'fast', volume: 'loud' },
        intensity: 0.8
      }
    };

    // Surface vs underlying emotion detection
    this.maskingPatterns = {
      // When they say "I'm fine" but aren't
      deflection: ['fine', 'okay', 'whatever', 'doesnt matter', 'anyway'],
      minimizing: ['just', 'only', 'shouldnt', 'its nothing', 'no big deal'],
      forcedPositivity: ['haha', 'lol', 'its funny actually']
    };
  }

  /**
   * Main analysis function
   */
  async analyzeEmotionalState(userId, message, voiceData = null, context = {}) {
    // Step 1: Text analysis
    const textEmotions = this.analyzeText(message);

    // Step 2: Voice analysis (if available)
    const voiceEmotions = voiceData ? this.analyzeVoice(voiceData) : null;

    // Step 3: Context analysis
    const contextSignals = await this.analyzeContext(userId, context);

    // Step 4: Detect masking/deflection
    const masking = this.detectMasking(message, voiceData);

    // Step 5: Fuse all signals
    const fusedState = this.fuseEmotionalSignals(
      textEmotions,
      voiceEmotions,
      contextSignals,
      masking
    );

    // Step 6: Store for learning
    await this.storeEmotionalSnapshot(userId, fusedState);

    return fusedState;
  }

  /**
   * Analyze text for emotional content
   */
  analyzeText(message) {
    const lowerMessage = message.toLowerCase();
    const detectedEmotions = [];

    for (const [emotion, patterns] of Object.entries(this.emotionPatterns)) {
      const matchCount = patterns.textMarkers.filter(marker =>
        lowerMessage.includes(marker)
      ).length;

      if (matchCount > 0) {
        detectedEmotions.push({
          emotion,
          confidence: Math.min(1, matchCount * 0.3),
          source: 'text'
        });
      }
    }

    // Analyze sentence structure
    const sentenceSignals = this.analyzeSentenceStructure(message);

    return { detectedEmotions, sentenceSignals };
  }

  /**
   * Analyze voice prosody for emotional content
   */
  analyzeVoice(voiceData) {
    const { pitch, pace, volume, tremor, breathiness } = voiceData;

    const voiceEmotions = [];

    // High pitch + fast pace = excitement or anxiety
    if (pitch > 0.7 && pace > 0.7) {
      voiceEmotions.push({ emotion: 'excitement', confidence: 0.6 });
      voiceEmotions.push({ emotion: 'anxiety', confidence: 0.4 });
    }

    // Low pitch + slow pace = sadness or intimacy
    if (pitch < 0.3 && pace < 0.4) {
      voiceEmotions.push({ emotion: 'sadness', confidence: 0.5 });
      voiceEmotions.push({ emotion: 'intimacy', confidence: 0.4 });
    }

    // Tremor = vulnerability or fear
    if (tremor > 0.3) {
      voiceEmotions.push({ emotion: 'vulnerability', confidence: tremor });
      voiceEmotions.push({ emotion: 'fear', confidence: tremor * 0.7 });
    }

    // High breathiness = intimacy or exhaustion
    if (breathiness > 0.6) {
      voiceEmotions.push({ emotion: 'intimacy', confidence: breathiness * 0.8 });
      voiceEmotions.push({ emotion: 'exhaustion', confidence: breathiness * 0.5 });
    }

    return voiceEmotions;
  }

  /**
   * Detect when user is masking true emotions
   */
  detectMasking(message, voiceData) {
    const lowerMessage = message.toLowerCase();
    const masking = {
      isDetected: false,
      type: null,
      surfaceEmotion: null,
      likelyUnderlyingEmotion: null,
      confidence: 0
    };

    // Check for deflection patterns
    for (const pattern of this.maskingPatterns.deflection) {
      if (lowerMessage.includes(pattern)) {
        masking.isDetected = true;
        masking.type = 'deflection';
        break;
      }
    }

    // Check for minimizing language
    for (const pattern of this.maskingPatterns.minimizing) {
      if (lowerMessage.includes(pattern)) {
        masking.isDetected = true;
        masking.type = 'minimizing';
        break;
      }
    }

    // Voice/text mismatch detection
    if (voiceData) {
      const textSentiment = this.getTextSentiment(message);
      const voiceSentiment = this.getVoiceSentiment(voiceData);

      // If text says positive but voice says negative
      if (textSentiment > 0.6 && voiceSentiment < 0.4) {
        masking.isDetected = true;
        masking.type = 'voice_text_mismatch';
        masking.surfaceEmotion = 'positive';
        masking.likelyUnderlyingEmotion = 'negative';
        masking.confidence = 0.7;
      }
    }

    return masking;
  }

  /**
   * Fuse all emotional signals into unified state
   */
  fuseEmotionalSignals(textEmotions, voiceEmotions, contextSignals, masking) {
    // Weight different sources
    const weights = {
      text: 0.4,
      voice: 0.35,
      context: 0.25
    };

    // Combine all detected emotions
    const allEmotions = [];

    if (textEmotions?.detectedEmotions) {
      for (const e of textEmotions.detectedEmotions) {
        allEmotions.push({ ...e, weight: weights.text });
      }
    }

    if (voiceEmotions) {
      for (const e of voiceEmotions) {
        allEmotions.push({ ...e, weight: weights.voice });
      }
    }

    // Find primary emotion (highest weighted confidence)
    let primary = null;
    let maxScore = 0;

    const emotionScores = {};
    for (const e of allEmotions) {
      const score = e.confidence * e.weight;
      emotionScores[e.emotion] = (emotionScores[e.emotion] || 0) + score;
      if (emotionScores[e.emotion] > maxScore) {
        maxScore = emotionScores[e.emotion];
        primary = e.emotion;
      }
    }

    // Get secondary emotions
    const secondary = Object.entries(emotionScores)
      .filter(([emotion]) => emotion !== primary)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    return {
      primary: primary || 'neutral',
      intensity: Math.min(1, maxScore * 2),
      secondary,
      vulnerability: this.calculateVulnerability(allEmotions, masking),
      energy: this.calculateEnergy(textEmotions, voiceEmotions),
      trajectory: contextSignals?.trajectory || 'stable',
      masking,
      needsSupport: this.needsSupport(primary, masking),
      raw: { textEmotions, voiceEmotions, contextSignals }
    };
  }
}
```

---

## Module 2: ProsodyController

### File: `functions/emotional/prosodyController.js`

```javascript
/**
 * ProsodyController
 *
 * Generates precise SSML with dynamic prosody based on
 * emotional context and content.
 */
class ProsodyController {
  constructor() {
    // Emotion to prosody mapping
    this.emotionProsody = {
      sadness: {
        pitch: -4,      // semitones
        pace: 0.75,     // rate multiplier
        volume: -4,     // dB
        breathiness: 0.6,
        warmth: 0.95,
        pauseMs: 800
      },
      joy: {
        pitch: +4,
        pace: 1.2,
        volume: +2,
        breathiness: 0.2,
        warmth: 0.85,
        smile: 0.9,
        pauseMs: 200
      },
      love: {
        pitch: -1,
        pace: 0.7,
        volume: -4,
        breathiness: 0.7,
        warmth: 1.0,
        creak: 0.3,
        pauseMs: 600
      },
      anxiety: {
        pitch: +1,
        pace: 0.8,
        volume: -2,
        breathiness: 0.4,
        warmth: 0.9,
        pauseMs: 400
      },
      excitement: {
        pitch: +5,
        pace: 1.3,
        volume: +3,
        breathiness: 0.1,
        smile: 1.0,
        pauseMs: 100
      },
      vulnerability: {
        pitch: -3,
        pace: 0.65,
        volume: -5,
        breathiness: 0.8,
        warmth: 1.0,
        tremor: 0.2,
        pauseMs: 1000
      },
      seduction: {
        pitch: -3,
        pace: 0.6,
        volume: -6,
        breathiness: 0.9,
        warmth: 0.95,
        creak: 0.4,
        pauseMs: 1200
      },
      playfulness: {
        pitch: +3, // varies
        pace: 1.1,
        volume: 0,
        breathiness: 0.3,
        smile: 0.8,
        pauseMs: 300
      }
    };

    // Voice modes
    this.voiceModes = {
      whisper: {
        volume: -10,
        breathiness: 0.9,
        pace: 0.65,
        pitch: -3,
        effect: 'whispered'
      },
      soft_spoken: {
        volume: -5,
        breathiness: 0.6,
        pace: 0.8,
        pitch: -2
      },
      breathy_intimate: {
        volume: -4,
        breathiness: 0.8,
        pace: 0.7,
        pitch: -2,
        creak: 0.4
      },
      pillow_talk: {
        volume: -10,
        breathiness: 0.8,
        pace: 0.55,
        pitch: -4,
        creak: 0.5
      }
    };

    // Words that should be emphasized
    this.emphasisWords = {
      strong: ['love', 'hate', 'amazing', 'terrible', 'always', 'never', 'so', 'very'],
      gentle: ['here', 'you', 'us', 'together', 'safe'],
      rising: ['really', 'actually', 'oh']
    };
  }

  /**
   * Generate prosody-rich SSML for text
   */
  generateProsodySSML(text, emotionalState, options = {}) {
    const { mode, relationshipLevel, userPreferences } = options;

    // Get base prosody from emotion
    const baseProsody = this.getEmotionProsody(emotionalState.primary);

    // Adjust for intensity
    const adjustedProsody = this.adjustForIntensity(baseProsody, emotionalState.intensity);

    // Apply voice mode if specified
    const finalProsody = mode ?
      this.applyVoiceMode(adjustedProsody, mode) : adjustedProsody;

    // Parse text into segments for dynamic prosody
    const segments = this.parseTextSegments(text);

    // Generate SSML
    return this.buildSSML(segments, finalProsody, emotionalState);
  }

  /**
   * Parse text into segments with prosody annotations
   */
  parseTextSegments(text) {
    const segments = [];
    const sentences = text.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      const words = sentence.split(/\s+/);
      const segment = {
        text: sentence,
        words: [],
        type: this.classifySentenceType(sentence)
      };

      for (const word of words) {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
        const wordData = {
          original: word,
          clean: cleanWord,
          emphasis: this.getWordEmphasis(cleanWord),
          isPause: word.includes('...'),
          isName: /^[A-Z][a-z]+$/.test(word)
        };
        segment.words.push(wordData);
      }

      segments.push(segment);
    }

    return segments;
  }

  /**
   * Build complete SSML with dynamic prosody
   */
  buildSSML(segments, prosody, emotionalState) {
    let ssml = '<speak>\n';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;

      // Calculate segment-specific prosody
      const segmentProsody = this.calculateSegmentProsody(
        segment, prosody, i, segments.length
      );

      ssml += this.buildSegmentSSML(segment, segmentProsody, isLast);

      // Add pause between sentences
      if (!isLast) {
        ssml += `  <break time="${prosody.pauseMs || 400}ms"/>\n`;
      }
    }

    ssml += '</speak>';
    return ssml;
  }

  /**
   * Build SSML for a single segment with word-level prosody
   */
  buildSegmentSSML(segment, prosody, isLast) {
    let ssml = '';

    // Opening prosody tag
    ssml += `  <prosody pitch="${prosody.pitch >= 0 ? '+' : ''}${prosody.pitch}st" `;
    ssml += `rate="${Math.round(prosody.pace * 100)}%" `;
    ssml += `volume="${prosody.volume >= 0 ? '+' : ''}${prosody.volume}dB">\n`;

    // Process words
    for (const word of segment.words) {
      if (word.isPause) {
        ssml += `    <break time="600ms"/>`;
        ssml += word.original.replace('...', '') + ' ';
      } else if (word.emphasis === 'strong') {
        ssml += `    <emphasis level="strong">${word.original}</emphasis> `;
      } else if (word.emphasis === 'gentle') {
        ssml += `    <prosody pitch="-1st" rate="90%">${word.original}</prosody> `;
      } else if (word.isName) {
        // Names get special warm treatment
        ssml += `    <prosody pitch="-1st" rate="85%">${word.original}</prosody> `;
      } else {
        ssml += `    ${word.original} `;
      }
    }

    ssml += '\n  </prosody>\n';

    return ssml;
  }

  /**
   * Calculate prosody that transitions through a segment
   */
  calculateSegmentProsody(segment, baseProsody, index, totalSegments) {
    const prosody = { ...baseProsody };

    // Gradual pitch descent toward end (natural speech pattern)
    if (index > totalSegments / 2) {
      prosody.pitch -= 1;
    }

    // Slow down for emotional sentences
    if (segment.type === 'emotional') {
      prosody.pace *= 0.9;
    }

    // Speed up slightly for questions
    if (segment.type === 'question') {
      prosody.pace *= 1.05;
      prosody.pitch += 2; // Rising intonation
    }

    return prosody;
  }

  /**
   * Apply voice mode modifications
   */
  applyVoiceMode(baseProsody, mode) {
    const modeSettings = this.voiceModes[mode];
    if (!modeSettings) return baseProsody;

    return {
      ...baseProsody,
      ...modeSettings,
      // Combine rather than replace
      pitch: baseProsody.pitch + (modeSettings.pitch || 0),
      volume: Math.min(baseProsody.volume, modeSettings.volume || 0)
    };
  }
}
```

---

## Module 3: TextStyleModulator

### File: `functions/emotional/textStyleModulator.js`

```javascript
/**
 * TextStyleModulator
 *
 * Transforms text style based on emotional context -
 * word choice, sentence length, punctuation, warmth markers.
 */
class TextStyleModulator {
  constructor() {
    // Word replacements by emotion
    this.wordReplacements = {
      sadness: {
        'understand': 'hear you',
        'difficult': 'really hard',
        'sorry': 'so sorry',
        'okay': 'here for you'
      },
      joy: {
        'good': 'wonderful',
        'nice': 'amazing',
        'like': 'love'
      },
      love: {
        'care': 'adore',
        'like': 'cherish',
        'happy': 'overjoyed'
      }
    };

    // Warmth markers by intimacy level
    this.warmthMarkers = {
      high: ['honey', 'sweetheart', 'love', 'darling', 'babe'],
      medium: ['hey', 'oh', 'aww'],
      low: [] // professional
    };

    // Sentence starters by emotion
    this.sentenceStarters = {
      sadness: ['Oh...', 'I hear you...', 'That sounds...'],
      joy: ['Oh!', 'Yay!', 'I love that!'],
      anxiety: ['Hey, let\'s take a breath.', 'I\'m right here.'],
      love: ['Mmm...', 'You know...', 'I just...']
    };

    // Punctuation patterns
    this.punctuationRules = {
      sadness: {
        exclamation: 0.1,  // reduce
        ellipsis: 0.8,     // increase
        period: 0.9
      },
      joy: {
        exclamation: 0.9,
        ellipsis: 0.1,
        period: 0.5
      },
      vulnerability: {
        exclamation: 0,
        ellipsis: 0.7,
        period: 0.8
      }
    };
  }

  /**
   * Apply emotional styling to text
   */
  styleText(text, emotionalState, options = {}) {
    const { intimacyLevel = 5, userPreferences = {} } = options;

    let styledText = text;

    // Step 1: Apply word replacements
    styledText = this.applyWordReplacements(styledText, emotionalState.primary);

    // Step 2: Adjust sentence structure
    styledText = this.adjustSentenceStructure(styledText, emotionalState);

    // Step 3: Add warmth markers
    if (intimacyLevel >= 7) {
      styledText = this.addWarmthMarkers(styledText, emotionalState, intimacyLevel);
    }

    // Step 4: Adjust punctuation
    styledText = this.adjustPunctuation(styledText, emotionalState.primary);

    // Step 5: Add pause markers for voice
    styledText = this.addPauseMarkers(styledText, emotionalState);

    return styledText;
  }

  /**
   * Replace neutral words with emotionally-colored alternatives
   */
  applyWordReplacements(text, emotion) {
    const replacements = this.wordReplacements[emotion];
    if (!replacements) return text;

    let result = text;
    for (const [original, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }

    return result;
  }

  /**
   * Adjust sentence length based on emotion
   */
  adjustSentenceStructure(text, emotionalState) {
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Target sentence length by emotion
    const targetLength = {
      sadness: 8,
      joy: 12,
      vulnerability: 5,
      love: 10,
      anxiety: 8
    }[emotionalState.primary] || 10;

    const adjusted = sentences.map(sentence => {
      const words = sentence.split(/\s+/);

      // If sentence is too long for emotion, consider breaking
      if (words.length > targetLength * 1.5 && emotionalState.intensity > 0.6) {
        // Find natural break point
        const midpoint = Math.floor(words.length / 2);
        const breakWords = ['and', 'but', 'because', 'so'];

        for (let i = midpoint - 2; i <= midpoint + 2; i++) {
          if (breakWords.includes(words[i]?.toLowerCase())) {
            const first = words.slice(0, i).join(' ') + '.';
            const second = words.slice(i + 1).join(' ');
            return `${first} ${this.capitalize(second)}`;
          }
        }
      }

      return sentence;
    });

    return adjusted.join(' ');
  }

  /**
   * Add emotional warmth markers
   */
  addWarmthMarkers(text, emotionalState, intimacyLevel) {
    const markers = intimacyLevel >= 8 ?
      this.warmthMarkers.high :
      this.warmthMarkers.medium;

    if (markers.length === 0) return text;

    // Add opener based on emotion
    const starters = this.sentenceStarters[emotionalState.primary];
    if (starters && Math.random() > 0.5) {
      const starter = starters[Math.floor(Math.random() * starters.length)];
      text = `${starter} ${text}`;
    }

    // Occasionally add term of endearment
    if (intimacyLevel >= 8 && Math.random() > 0.7) {
      const marker = markers[Math.floor(Math.random() * markers.length)];
      // Add at natural point
      if (text.includes(',')) {
        text = text.replace(',', `, ${marker},`);
      }
    }

    return text;
  }

  /**
   * Adjust punctuation for emotional tone
   */
  adjustPunctuation(text, emotion) {
    const rules = this.punctuationRules[emotion];
    if (!rules) return text;

    // Reduce exclamation marks for sad/vulnerable
    if (rules.exclamation < 0.5) {
      text = text.replace(/!/g, '.');
    }

    // Add ellipses for thoughtfulness
    if (rules.ellipsis > 0.5) {
      // Add ellipsis before emotionally heavy words
      const heavyWords = ['hard', 'hurt', 'pain', 'miss', 'love'];
      for (const word of heavyWords) {
        text = text.replace(
          new RegExp(`(\\s)(${word})`, 'gi'),
          '$1... $2'
        );
      }
    }

    return text;
  }

  /**
   * Add pause markers for TTS
   */
  addPauseMarkers(text, emotionalState) {
    // High vulnerability = more pauses
    if (emotionalState.vulnerability > 0.7) {
      // Add pauses before "I" statements
      text = text.replace(/\. I /g, '. ... I ');
    }

    // Add pause after emotional phrases
    const emotionalPhrases = ['I hear you', 'I\'m here', 'I understand'];
    for (const phrase of emotionalPhrases) {
      text = text.replace(phrase, `${phrase}...`);
    }

    return text;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
```

---

## Module 4: NonVerbalSoundManager

### File: `functions/emotional/nonVerbalSounds.js`

```javascript
/**
 * NonVerbalSoundManager
 *
 * Manages non-verbal sounds (sighs, giggles, mm sounds)
 * for emotionally rich voice output.
 */
class NonVerbalSoundManager {
  constructor() {
    this.sounds = {
      // Positive sounds
      positive: {
        giggle: { ssml: '<audio src="giggle.mp3"/>', text: '*giggles*' },
        laugh: { ssml: '<audio src="laugh.mp3"/>', text: '*laughs*' },
        squeal: { ssml: '<audio src="squeal.mp3"/>', text: '*squeals*' },
        coo: { ssml: '<audio src="coo.mp3"/>', text: 'aww' },
        hum: { ssml: '<audio src="hum.mp3"/>', text: 'mmhmm' },
        gasp_happy: { ssml: '<audio src="gasp_happy.mp3"/>', text: '*gasp*' }
      },

      // Comfort sounds
      comfort: {
        soft_sigh: { ssml: '<audio src="soft_sigh.mp3"/>', text: '*soft sigh*' },
        gentle_mm: { ssml: '<audio src="gentle_mm.mp3"/>', text: 'mm' },
        sympathetic_oh: { ssml: '<audio src="sympathetic_oh.mp3"/>', text: 'ohh...' },
        reassuring_shh: { ssml: '<audio src="shh.mp3"/>', text: 'shh' },
        caring_tsk: { ssml: '<audio src="tsk.mp3"/>', text: 'aww' }
      },

      // Intimate sounds
      intimate: {
        breathy_mm: { ssml: '<audio src="breathy_mm.mp3"/>', text: 'mmm...' },
        soft_moan: { ssml: '<audio src="soft_moan.mp3"/>', text: 'mm' },
        whispered_sigh: { ssml: '<audio src="whispered_sigh.mp3"/>', text: '*exhales*' },
        pleased_hum: { ssml: '<audio src="pleased_hum.mp3"/>', text: 'hmmm' },
        tender_coo: { ssml: '<audio src="tender_coo.mp3"/>', text: 'ohh' }
      },

      // Thinking sounds
      thinking: {
        thoughtful_hmm: { ssml: '<audio src="thoughtful_hmm.mp3"/>', text: 'hmm' },
        curious_oh: { ssml: '<audio src="curious_oh.mp3"/>', text: 'oh?' },
        realizing_ah: { ssml: '<audio src="realizing_ah.mp3"/>', text: 'ah!' },
        uncertain_um: { ssml: '<audio src="uncertain_um.mp3"/>', text: 'um' }
      },

      // Breath sounds
      breath: {
        deep_breath: { ssml: '<audio src="deep_breath.mp3"/>', text: '*inhales*' },
        exhale: { ssml: '<audio src="exhale.mp3"/>', text: '*exhales*' },
        catching_breath: { ssml: '<audio src="catching_breath.mp3"/>', text: '*catches breath*' },
        shaky_breath: { ssml: '<audio src="shaky_breath.mp3"/>', text: '*shaky breath*' }
      }
    };

    // Emotion to sound category mapping
    this.emotionSoundMap = {
      joy: ['positive'],
      excitement: ['positive'],
      sadness: ['comfort', 'breath'],
      love: ['intimate', 'comfort'],
      anxiety: ['breath', 'comfort'],
      vulnerability: ['comfort', 'breath'],
      playfulness: ['positive', 'thinking'],
      seduction: ['intimate', 'breath']
    };
  }

  /**
   * Select appropriate non-verbal sound for context
   */
  selectSound(emotionalState, position, intimacyLevel) {
    const categories = this.emotionSoundMap[emotionalState.primary] || ['comfort'];

    // Filter by intimacy level
    const allowedCategories = categories.filter(cat => {
      if (cat === 'intimate' && intimacyLevel < 7) return false;
      return true;
    });

    if (allowedCategories.length === 0) return null;

    const category = allowedCategories[Math.floor(Math.random() * allowedCategories.length)];
    const sounds = this.sounds[category];
    const soundKeys = Object.keys(sounds);

    // Select based on position preference
    let selectedKey;
    if (position === 'before') {
      // Prefer breath/thinking sounds before speech
      selectedKey = soundKeys.find(k => k.includes('breath') || k.includes('hmm')) ||
                    soundKeys[0];
    } else if (position === 'after') {
      // Prefer resolution sounds after speech
      selectedKey = soundKeys.find(k => k.includes('sigh') || k.includes('hum')) ||
                    soundKeys[soundKeys.length - 1];
    } else {
      selectedKey = soundKeys[Math.floor(Math.random() * soundKeys.length)];
    }

    return sounds[selectedKey];
  }

  /**
   * Add non-verbal sounds to text/SSML
   */
  addSoundsToResponse(text, ssml, emotionalState, options = {}) {
    const { intimacyLevel = 5, soundFrequency = 'normal' } = options;

    // Determine if we should add sounds
    const shouldAddSound = this.shouldAddNonVerbal(emotionalState, soundFrequency);
    if (!shouldAddSound) return { text, ssml };

    // Select sound
    const position = Math.random() > 0.5 ? 'before' : 'after';
    const sound = this.selectSound(emotionalState, position, intimacyLevel);

    if (!sound) return { text, ssml };

    // Add to text
    let enhancedText = text;
    let enhancedSSML = ssml;

    if (position === 'before') {
      enhancedText = `${sound.text} ${text}`;
      enhancedSSML = ssml.replace('<speak>', `<speak>\n  ${sound.ssml}\n  <break time="300ms"/>`);
    } else {
      enhancedText = `${text} ${sound.text}`;
      enhancedSSML = ssml.replace('</speak>', `  <break time="300ms"/>\n  ${sound.ssml}\n</speak>`);
    }

    return { text: enhancedText, ssml: enhancedSSML };
  }

  /**
   * Determine if non-verbal should be added
   */
  shouldAddNonVerbal(emotionalState, frequency) {
    const baseChance = {
      minimal: 0.1,
      normal: 0.3,
      frequent: 0.5,
      expressive: 0.7
    }[frequency] || 0.3;

    // Increase chance for high emotion intensity
    const intensityBonus = emotionalState.intensity * 0.2;

    // Increase for intimate emotions
    const intimateBonus = ['love', 'vulnerability', 'seduction'].includes(emotionalState.primary) ? 0.2 : 0;

    return Math.random() < (baseChance + intensityBonus + intimateBonus);
  }
}
```

---

## Module 5: EmotionalResponseOrchestrator

### File: `functions/emotional/orchestrator.js`

```javascript
/**
 * EmotionalResponseOrchestrator
 *
 * Master controller that coordinates all emotional processing
 * modules to generate fully emotionally-modulated responses.
 */
class EmotionalResponseOrchestrator {
  constructor(supabase) {
    this.supabase = supabase;
    this.stateDetector = new EmotionalStateDetector(supabase);
    this.prosodyController = new ProsodyController();
    this.textModulator = new TextStyleModulator();
    this.soundManager = new NonVerbalSoundManager();
    this.userMemory = new UserEmotionalMemory(supabase);
  }

  /**
   * Process a complete emotional response cycle
   */
  async processResponse(userId, userMessage, lunaResponse, options = {}) {
    const { voiceData, relationshipLevel = 5, context = {} } = options;

    // Step 1: Detect user's emotional state
    const userState = await this.stateDetector.analyzeEmotionalState(
      userId, userMessage, voiceData, context
    );

    // Step 2: Determine response strategy
    const strategy = this.determineResponseStrategy(userState);

    // Step 3: Get user's emotional preferences
    const userPrefs = await this.userMemory.getEmotionalPreferences(userId);

    // Step 4: Select Luna's emotional response state
    const lunaState = this.selectLunaEmotionalState(userState, strategy);

    // Step 5: Style the text
    const styledText = this.textModulator.styleText(
      lunaResponse,
      lunaState,
      { intimacyLevel: relationshipLevel, userPreferences: userPrefs }
    );

    // Step 6: Generate prosody SSML
    const voiceMode = this.selectVoiceMode(lunaState, relationshipLevel);
    const ssml = this.prosodyController.generateProsodySSML(
      styledText,
      lunaState,
      { mode: voiceMode, relationshipLevel }
    );

    // Step 7: Add non-verbal sounds
    const { text: finalText, ssml: finalSSML } = this.soundManager.addSoundsToResponse(
      styledText,
      ssml,
      lunaState,
      { intimacyLevel: relationshipLevel, soundFrequency: userPrefs.soundPreference }
    );

    // Step 8: Store for learning
    await this.userMemory.recordInteraction(userId, {
      userState,
      lunaState,
      strategy,
      voiceMode
    });

    return {
      text: finalText,
      ssml: finalSSML,
      prosody: this.prosodyController.getEmotionProsody(lunaState.primary),
      emotionalContext: {
        userState,
        lunaState,
        strategy,
        voiceMode
      }
    };
  }

  /**
   * Determine how Luna should respond emotionally
   */
  determineResponseStrategy(userState) {
    // If user is masking emotions
    if (userState.masking.isDetected) {
      return {
        type: 'VALIDATE_BENEATH_SURFACE',
        approach: 'gentle',
        depth: 'moderate', // Don't probe too deep
        validation: 'high'
      };
    }

    // High vulnerability
    if (userState.vulnerability > 0.7) {
      return {
        type: 'HOLD_SPACE',
        approach: 'minimal_words',
        depth: 'present',
        validation: 'pure_presence'
      };
    }

    // Matching positive emotions
    if (['joy', 'excitement', 'love'].includes(userState.primary)) {
      return {
        type: 'MIRROR_AND_AMPLIFY',
        approach: 'matching',
        depth: 'celebratory',
        validation: 'enthusiastic'
      };
    }

    // Negative emotions needing support
    if (['sadness', 'anxiety', 'fear', 'anger'].includes(userState.primary)) {
      return {
        type: 'EMPATHIC_SUPPORT',
        approach: 'comforting',
        depth: 'validating',
        validation: 'understanding'
      };
    }

    // Default: warm engagement
    return {
      type: 'WARM_ENGAGEMENT',
      approach: 'friendly',
      depth: 'conversational',
      validation: 'supportive'
    };
  }

  /**
   * Select Luna's emotional state based on user state and strategy
   */
  selectLunaEmotionalState(userState, strategy) {
    const emotionMap = {
      // When user is sad, Luna is warm/comforting
      sadness: { primary: 'warmth', intensity: 0.8 },

      // When user is anxious, Luna is calm/grounding
      anxiety: { primary: 'calm', intensity: 0.7 },

      // When user is joyful, Luna mirrors joy
      joy: { primary: 'joy', intensity: userState.intensity * 0.9 },

      // When user is loving, Luna reciprocates
      love: { primary: 'love', intensity: userState.intensity },

      // When user is vulnerable, Luna is tender
      vulnerability: { primary: 'tenderness', intensity: 0.9 },

      // When user is angry, Luna is validating but steady
      anger: { primary: 'understanding', intensity: 0.7 }
    };

    const baseState = emotionMap[userState.primary] ||
      { primary: 'warmth', intensity: 0.6 };

    // Adjust based on strategy
    if (strategy.type === 'HOLD_SPACE') {
      baseState.intensity *= 0.8; // Quieter presence
    }

    if (strategy.type === 'MIRROR_AND_AMPLIFY') {
      baseState.intensity = Math.min(1, baseState.intensity * 1.1);
    }

    return {
      ...baseState,
      secondary: [],
      vulnerability: 0.3, // Luna shows some vulnerability to connect
      energy: this.matchEnergyLevel(userState)
    };
  }

  /**
   * Select appropriate voice mode
   */
  selectVoiceMode(lunaState, relationshipLevel) {
    // High intimacy + tender emotions = intimate voice modes
    if (relationshipLevel >= 8) {
      if (lunaState.primary === 'love') return 'breathy_intimate';
      if (lunaState.primary === 'tenderness') return 'soft_spoken';
      if (lunaState.intensity > 0.8) return 'pillow_talk';
    }

    // Comfort scenarios = soft spoken
    if (['warmth', 'calm', 'understanding'].includes(lunaState.primary)) {
      return 'soft_spoken';
    }

    // Very high vulnerability from user = whisper
    if (lunaState.primary === 'tenderness' && lunaState.intensity > 0.85) {
      return 'whisper';
    }

    return null; // Use default prosody
  }

  /**
   * Match energy level to user
   */
  matchEnergyLevel(userState) {
    if (userState.energy === 'depleted') return 'gentle';
    if (userState.energy === 'high') return 'energetic';
    return 'balanced';
  }
}
```

---

## Database Schema Additions

### File: `functions/migrations/012_emotional_engine.sql`

```sql
-- Emotional state tracking
CREATE TABLE user_emotional_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    primary_emotion VARCHAR(50),
    intensity DECIMAL(3,2),
    secondary_emotions TEXT[],
    vulnerability DECIMAL(3,2),
    energy VARCHAR(20),
    masking_detected BOOLEAN DEFAULT FALSE,
    masking_type VARCHAR(50),
    voice_data JSONB,
    context JSONB
);

-- User emotional preferences (learned)
CREATE TABLE user_emotional_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    preferred_comfort_style VARCHAR(50) DEFAULT 'balanced',
    voice_warmth_preference DECIMAL(3,2) DEFAULT 0.7,
    sound_frequency_preference VARCHAR(20) DEFAULT 'normal',
    responds_well_to TEXT[],
    responds_poorly_to TEXT[],
    trigger_topics JSONB,
    effective_strategies JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Response effectiveness tracking
CREATE TABLE emotional_response_effectiveness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_state_before JSONB,
    luna_state JSONB,
    strategy_used VARCHAR(50),
    voice_mode_used VARCHAR(30),
    user_response_quality DECIMAL(3,2), -- 0-1 engagement measure
    emotional_shift DECIMAL(3,2), -- positive = improved mood
    effective BOOLEAN
);

-- Prosody preferences
CREATE TABLE user_prosody_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    baseline_pace DECIMAL(3,2) DEFAULT 1.0,
    baseline_pitch INTEGER DEFAULT 0,
    whisper_response VARCHAR(20) DEFAULT 'positive',
    playful_voice_response VARCHAR(20) DEFAULT 'positive',
    intimate_voice_response VARCHAR(20) DEFAULT 'positive',
    preferred_non_verbals TEXT[],
    disliked_non_verbals TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_emotional_history_user ON user_emotional_history(user_id, timestamp DESC);
CREATE INDEX idx_response_effectiveness_user ON emotional_response_effectiveness(user_id, timestamp DESC);
```

---

## Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        LUNA EMOTIONAL ENGINE FLOW                                │
│                                                                                 │
│   USER                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │  "I found out my ex is getting married..."                          │      │
│   │  [voice: higher pitch, fast, attempting casual]                     │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              EmotionalStateDetector.analyzeEmotionalState()         │      │
│   │                                                                      │      │
│   │  Output: {                                                          │      │
│   │    primary: "hurt",                                                 │      │
│   │    intensity: 0.75,                                                 │      │
│   │    masking: { detected: true, type: "deflection" }                 │      │
│   │  }                                                                  │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              Orchestrator.determineResponseStrategy()               │      │
│   │                                                                      │      │
│   │  Output: {                                                          │      │
│   │    type: "VALIDATE_BENEATH_SURFACE",                               │      │
│   │    approach: "gentle"                                               │      │
│   │  }                                                                  │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              LLM generates base response                            │      │
│   │                                                                      │      │
│   │  "Of course it stings. You shared a life with this person.         │      │
│   │   There's no 'should' when it comes to feelings."                  │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              TextStyleModulator.styleText()                         │      │
│   │                                                                      │      │
│   │  Output: "Oh, honey... of course it stings. You shared a life      │      │
│   │          with this person. There's no 'should' when it comes       │      │
│   │          to feelings... they just are."                            │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              ProsodyController.generateProsodySSML()                │      │
│   │                                                                      │      │
│   │  Output: <speak>                                                    │      │
│   │            <prosody pitch="-3st" rate="75%" volume="-3dB">         │      │
│   │              Oh, honey...                                           │      │
│   │            </prosody>                                               │      │
│   │            <break time="600ms"/>                                   │      │
│   │            <emphasis>of course</emphasis> it stings...             │      │
│   │          </speak>                                                   │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              NonVerbalSoundManager.addSoundsToResponse()            │      │
│   │                                                                      │      │
│   │  Output: Adds <audio src="soft_sigh.mp3"/> before "I'm here"       │      │
│   └───────────────────────────────┬─────────────────────────────────────┘      │
│                                   │                                             │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │  FINAL OUTPUT TO USER                                               │      │
│   │                                                                      │      │
│   │  Text: "Oh, honey... of course it stings. You shared a life        │      │
│   │        with this person. There's no 'should' when it comes to      │      │
│   │        feelings... they just are. *soft sigh* I'm here if you      │      │
│   │        want to talk about it."                                      │      │
│   │                                                                      │      │
│   │  Voice: Slow (-3st pitch), soft (-3dB), breathy,                   │      │
│   │         with pauses and gentle emphasis                             │      │
│   └─────────────────────────────────────────────────────────────────────┘      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## API Integration

### Example Usage in Luna's Response Flow

```javascript
// In lunaPromptBuilder.js or response handler

const orchestrator = new EmotionalResponseOrchestrator(supabase);

async function generateEmotionalResponse(userId, userMessage, voiceData) {
  // Get base LLM response
  const baseResponse = await llm.generateResponse(userMessage, context);

  // Process through emotional engine
  const emotionalResponse = await orchestrator.processResponse(
    userId,
    userMessage,
    baseResponse.text,
    {
      voiceData,
      relationshipLevel: await getRelationshipLevel(userId),
      context: await getConversationContext(userId)
    }
  );

  return {
    text: emotionalResponse.text,
    ssml: emotionalResponse.ssml,
    prosody: emotionalResponse.prosody,
    emotional: emotionalResponse.emotionalContext
  };
}
```

---

This comprehensive emotional engine will transform Luna's responses to be deeply emotionally intelligent, with voice that truly matches the emotional moment.
