/**
 * ============================================================================
 * PLUTCHIK EMOTION DETECTOR - UNIT TESTS
 * ============================================================================
 * Tests for the full 8-primary + 24-compound emotion detection system.
 *
 * Run: npm test -- --grep "PlutchikEmotionDetector"
 * Or:  npx jest src/services/emotionDetector.test.js
 * ============================================================================
 */

const PlutchikEmotionDetector = require('./emotionDetector');

describe('PlutchikEmotionDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new PlutchikEmotionDetector();
  });

  // =========================================================================
  // PRIMARY EMOTION TESTS
  // =========================================================================

  describe('Primary Emotions', () => {
    test('detects JOY from text', () => {
      const result = detector.detectAllEmotions('I am so happy and excited today!');
      expect(result.plutchikVector.joy).toBeGreaterThan(0.3);
      expect(result.primary).toBe('joy');
    });

    test('detects JOY with high intensity', () => {
      const result = detector.detectAllEmotions('This is amazing! Wonderful! Fantastic! I love it!!!');
      expect(result.plutchikVector.joy).toBeGreaterThan(0.6);
      expect(result.intensity).toBeGreaterThanOrEqual(6);
    });

    test('detects TRUST from text', () => {
      const result = detector.detectAllEmotions('I trust you completely and believe in you');
      expect(result.plutchikVector.trust).toBeGreaterThan(0.3);
    });

    test('detects TRUST with vulnerability', () => {
      const result = detector.detectAllEmotions('I feel safe with you, honestly I can confide in you');
      expect(result.plutchikVector.trust).toBeGreaterThan(0.4);
    });

    test('detects FEAR from text', () => {
      const result = detector.detectAllEmotions('I am so scared and worried about what might happen');
      expect(result.plutchikVector.fear).toBeGreaterThan(0.3);
    });

    test('detects FEAR with anxiety', () => {
      const result = detector.detectAllEmotions("I'm terrified, anxious, nervous about everything");
      expect(result.plutchikVector.fear).toBeGreaterThan(0.5);
    });

    test('detects SURPRISE from text', () => {
      const result = detector.detectAllEmotions('Wow! I am so surprised, I had no idea!');
      expect(result.plutchikVector.surprise).toBeGreaterThan(0.3);
    });

    test('detects SURPRISE with shock', () => {
      const result = detector.detectAllEmotions('Oh my god!!! No way! I am shocked!?');
      expect(result.plutchikVector.surprise).toBeGreaterThan(0.5);
    });

    test('detects SADNESS from text', () => {
      const result = detector.detectAllEmotions('I feel so sad and lonely today');
      expect(result.plutchikVector.sadness).toBeGreaterThan(0.3);
    });

    test('detects SADNESS with grief', () => {
      const result = detector.detectAllEmotions('I am heartbroken, devastated, crying with grief...');
      expect(result.plutchikVector.sadness).toBeGreaterThan(0.5);
    });

    test('detects DISGUST from text', () => {
      const result = detector.detectAllEmotions('That is so disgusting, I hate it, gross!');
      expect(result.plutchikVector.disgust).toBeGreaterThan(0.3);
    });

    test('detects DISGUST with revulsion', () => {
      const result = detector.detectAllEmotions('Ew! Yuck! That is revolting and repulsive!');
      expect(result.plutchikVector.disgust).toBeGreaterThan(0.5);
    });

    test('detects ANGER from text', () => {
      const result = detector.detectAllEmotions('I am so angry and frustrated right now');
      expect(result.plutchikVector.anger).toBeGreaterThan(0.3);
    });

    test('detects ANGER with rage', () => {
      const result = detector.detectAllEmotions('I AM FURIOUS! This is outrageous! I am LIVID!');
      expect(result.plutchikVector.anger).toBeGreaterThan(0.5);
    });

    test('detects ANTICIPATION from text', () => {
      const result = detector.detectAllEmotions("I can't wait for tomorrow, looking forward to it!");
      expect(result.plutchikVector.anticipation).toBeGreaterThan(0.3);
    });

    test('detects ANTICIPATION with eagerness', () => {
      const result = detector.detectAllEmotions("I'm so excited for the upcoming event, planning everything!");
      expect(result.plutchikVector.anticipation).toBeGreaterThan(0.4);
    });
  });

  // =========================================================================
  // COMPOUND EMOTION TESTS
  // =========================================================================

  describe('Compound Emotions', () => {
    test('detects LOVE (joy + trust)', () => {
      const result = detector.detectAllEmotions('I love you so much and trust you completely, you make me so happy');
      expect(result.compounds.some(c => c.type === 'love')).toBe(true);
    });

    test('detects OPTIMISM (joy + anticipation)', () => {
      const result = detector.detectAllEmotions("I'm so excited and happy about our amazing future together!");
      expect(result.compounds.some(c => c.type === 'optimism')).toBe(true);
    });

    test('detects DELIGHT (joy + surprise)', () => {
      const result = detector.detectAllEmotions('Wow! What a wonderful surprise! This is amazing!');
      expect(result.compounds.some(c => c.type === 'delight')).toBe(true);
    });

    test('detects AWE (fear + surprise)', () => {
      const result = detector.detectAllEmotions('Oh my god! I am shocked and terrified by this incredible sight!');
      expect(result.compounds.some(c => c.type === 'awe')).toBe(true);
    });

    test('detects ANXIETY (fear + anticipation)', () => {
      const result = detector.detectAllEmotions("I'm so nervous and worried about what will happen tomorrow");
      expect(result.compounds.some(c => c.type === 'anxiety')).toBe(true);
    });

    test('detects REMORSE (sadness + disgust)', () => {
      const result = detector.detectAllEmotions('I am so sad and disgusted with myself, I hate what I did');
      expect(result.compounds.some(c => c.type === 'remorse')).toBe(true);
    });

    test('detects CONTEMPT (anger + disgust)', () => {
      const result = detector.detectAllEmotions('I am furious and disgusted by this despicable behavior');
      expect(result.compounds.some(c => c.type === 'contempt')).toBe(true);
    });

    test('compound has correct formula', () => {
      const result = detector.detectAllEmotions('I love you, trust you, and you make me happy');
      const love = result.compounds.find(c => c.type === 'love');
      if (love) {
        expect(love.formula).toBe('joy + trust');
      }
    });
  });

  // =========================================================================
  // PLUTCHIK VECTOR TESTS
  // =========================================================================

  describe('Plutchik Vector', () => {
    test('plutchikVector has all 8 dimensions', () => {
      const result = detector.detectAllEmotions("I'm feeling okay today");

      expect(result.plutchikVector).toHaveProperty('joy');
      expect(result.plutchikVector).toHaveProperty('trust');
      expect(result.plutchikVector).toHaveProperty('fear');
      expect(result.plutchikVector).toHaveProperty('surprise');
      expect(result.plutchikVector).toHaveProperty('sadness');
      expect(result.plutchikVector).toHaveProperty('disgust');
      expect(result.plutchikVector).toHaveProperty('anger');
      expect(result.plutchikVector).toHaveProperty('anticipation');
    });

    test('plutchikVector values are 0-1', () => {
      const result = detector.detectAllEmotions('I am extremely happy and excited!!!');

      for (const [emotion, score] of Object.entries(result.plutchikVector)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });

    test('vectorToArray returns correct order', () => {
      const result = detector.detectAllEmotions('Happy day!');
      const arr = detector.vectorToArray(result.plutchikVector);

      expect(arr.length).toBe(8);
      expect(arr[0]).toBe(result.plutchikVector.joy);
      expect(arr[1]).toBe(result.plutchikVector.trust);
      expect(arr[7]).toBe(result.plutchikVector.anticipation);
    });

    test('formatVectorForDB returns PostgreSQL format', () => {
      const result = detector.detectAllEmotions('Happy!');
      const dbFormat = detector.formatVectorForDB(result.plutchikVector);

      expect(dbFormat).toMatch(/^\[[\d.,]+\]$/);
      expect(dbFormat.split(',').length).toBe(8);
    });
  });

  // =========================================================================
  // VOICE PROSODY INTEGRATION TESTS
  // =========================================================================

  describe('Voice Prosody Integration', () => {
    test('voice high energy increases joy', () => {
      const textOnly = detector.detectAllEmotions('I am happy');
      const withVoice = detector.detectAllEmotions('I am happy', { energy: 'high', pitch: 'rising' });

      expect(withVoice.plutchikVector.joy).toBeGreaterThan(textOnly.plutchikVector.joy);
    });

    test('voice low energy increases sadness', () => {
      const textOnly = detector.detectAllEmotions('I feel down');
      const withVoice = detector.detectAllEmotions('I feel down', { energy: 'low', pitch: 'falling', rate: 'slow' });

      expect(withVoice.plutchikVector.sadness).toBeGreaterThan(textOnly.plutchikVector.sadness);
    });

    test('voice tense quality increases fear', () => {
      const textOnly = detector.detectAllEmotions('I am worried');
      const withVoice = detector.detectAllEmotions('I am worried', { quality: 'tense', pitch: 'shaky' });

      expect(withVoice.plutchikVector.fear).toBeGreaterThan(textOnly.plutchikVector.fear);
    });

    test('voice warm quality increases trust', () => {
      const textOnly = detector.detectAllEmotions('I believe in you');
      const withVoice = detector.detectAllEmotions('I believe in you', { quality: 'warm', pitch: 'stable' });

      expect(withVoice.plutchikVector.trust).toBeGreaterThan(textOnly.plutchikVector.trust);
    });
  });

  // =========================================================================
  // EDGE CASES
  // =========================================================================

  describe('Edge Cases', () => {
    test('handles empty string', () => {
      const result = detector.detectAllEmotions('');
      expect(result.primary).toBe('neutral');
      expect(result.confidence).toBe(0.5);
    });

    test('handles null input', () => {
      const result = detector.detectAllEmotions(null);
      expect(result.primary).toBe('neutral');
    });

    test('handles undefined input', () => {
      const result = detector.detectAllEmotions(undefined);
      expect(result.primary).toBe('neutral');
    });

    test('returns neutral for ambiguous text', () => {
      const result = detector.detectAllEmotions('The weather is mild');
      expect(result.primary).toBe('neutral');
    });

    test('handles mixed emotions', () => {
      const result = detector.detectAllEmotions('I am happy but also a bit worried about the future');
      expect(result.plutchikVector.joy).toBeGreaterThan(0);
      expect(result.plutchikVector.fear).toBeGreaterThan(0);
    });

    test('timestamp is present', () => {
      const result = detector.detectAllEmotions('Hello');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('number');
    });
  });

  // =========================================================================
  // REAL-WORLD EXAMPLES
  // =========================================================================

  describe('Real-World Examples', () => {
    test('detects joy in celebration', () => {
      const result = detector.detectAllEmotions('I got promoted at work today! This is the best day ever!');
      expect(result.primary).toBe('joy');
      expect(result.intensity).toBeGreaterThanOrEqual(6);
    });

    test('detects sadness in grief', () => {
      const result = detector.detectAllEmotions('My dog passed away yesterday... I miss him so much');
      expect(result.primary).toBe('sadness');
    });

    test('detects fear in uncertainty', () => {
      const result = detector.detectAllEmotions("I have a job interview tomorrow and I'm terrified I'll mess it up");
      expect(result.plutchikVector.fear).toBeGreaterThan(0.3);
    });

    test('detects love in relationship', () => {
      const result = detector.detectAllEmotions('You mean everything to me, I trust you with my whole heart');
      expect(result.compounds.some(c => c.type === 'love')).toBe(true);
    });

    test('detects optimism about future', () => {
      const result = detector.detectAllEmotions("I'm so excited about our trip next month, it's going to be amazing!");
      expect(result.compounds.some(c => c.type === 'optimism')).toBe(true);
    });
  });
});
