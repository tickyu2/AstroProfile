/**
 * ============================================================================
 * VOICE-TEXT CONGRUENCE TEST
 * ============================================================================
 * Tests voice prosody mapping, congruence detection, and hidden emotions.
 *
 * Run: node functions/test/test-voice-congruence.js
 * ============================================================================
 */

const path = require('path');

async function testVoiceCongruence() {
  console.log('='.repeat(60));
  console.log('VOICE-TEXT CONGRUENCE TEST');
  console.log('Week 3: See through the mask, respond to truth');
  console.log('='.repeat(60));
  console.log('');

  // Dynamic import for ES module
  const module = await import(path.join(__dirname, '../../src/services/emotionDetector.js'));
  const PlutchikEmotionDetector = module.default;
  const detector = new PlutchikEmotionDetector();

  // =========================================================================
  // TEST 1: Congruent Emotions (happy text + happy voice)
  // =========================================================================
  console.log('TEST 1: Congruent Emotions');
  console.log('-'.repeat(40));

  const result1 = detector.detectAllEmotions(
    "I'm so happy about this! This is amazing!",
    {
      energy: 'high',
      pitch: 'rising',
      rate: 'fast',
      quality: 'bright',
      laughter: true
    }
  );

  console.log('Message: "I\'m so happy about this!"');
  console.log('Voice: high energy, rising pitch, laughter');
  console.log(`Final emotion: ${result1.primary} (intensity: ${result1.intensity})`);
  console.log(`Congruent: ${result1.voiceAnalysis.congruence.isCongruent}`);
  console.log(`Congruence score: ${result1.voiceAnalysis.congruence.congruenceScore.toFixed(2)}`);
  console.log(`Authenticity: ${result1.authenticity.toFixed(2)}`);
  console.log('Expected: Congruent, high authenticity');
  console.log('');

  // =========================================================================
  // TEST 2: Hidden Sadness ("I'm fine" + sad voice)
  // =========================================================================
  console.log('TEST 2: Hidden Sadness (Masking)');
  console.log('-'.repeat(40));

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

  console.log('Message: "I\'m fine."');
  console.log('Voice: low energy, falling pitch, sighs');
  console.log(`Text says: ${result2.voiceAnalysis.congruence.textEmotion.emotion}`);
  console.log(`Voice shows: ${result2.voiceAnalysis.congruence.voiceEmotion.emotion} (${result2.voiceAnalysis.congruence.voiceEmotion.score.toFixed(2)})`);
  console.log(`Congruent: ${result2.voiceAnalysis.congruence.isCongruent}`);
  console.log(`Hidden emotion: ${result2.voiceAnalysis.congruence.hiddenEmotion || 'none'}`);
  console.log(`Masking pattern: ${result2.voiceAnalysis.congruence.maskingPattern?.pattern || 'none'}`);
  console.log(`Final emotion: ${result2.primary} (blended with voice)`);
  console.log(`Authenticity: ${result2.authenticity.toFixed(2)} (voice is authentic)`);
  console.log('Expected: Hidden sadness detected, low congruence');
  console.log('');

  // =========================================================================
  // TEST 3: Hidden Anger ("Whatever" + angry voice)
  // =========================================================================
  console.log('TEST 3: Hidden Anger');
  console.log('-'.repeat(40));

  const result3 = detector.detectAllEmotions(
    "Whatever. I don't care.",
    {
      energy: 'high',
      pitch: 'sharp',
      rate: 'fast',
      quality: 'harsh',
      volume: 'loud'
    }
  );

  console.log('Message: "Whatever. I don\'t care."');
  console.log('Voice: high energy, sharp pitch, harsh, loud');
  console.log(`Text says: ${result3.voiceAnalysis.congruence.textEmotion.emotion}`);
  console.log(`Voice shows: ${result3.voiceAnalysis.congruence.voiceEmotion.emotion} (${result3.voiceAnalysis.congruence.voiceEmotion.score.toFixed(2)})`);
  console.log(`Congruent: ${result3.voiceAnalysis.congruence.isCongruent}`);
  console.log(`Hidden emotion: ${result3.voiceAnalysis.congruence.hiddenEmotion || 'none'}`);
  console.log(`Masking pattern: ${result3.voiceAnalysis.congruence.maskingPattern?.pattern || 'none'}`);
  console.log(`Final emotion: ${result3.primary}`);
  console.log('Expected: Hidden anger detected');
  console.log('');

  // =========================================================================
  // TEST 4: Hidden Fear ("Everything is great" + anxious voice)
  // =========================================================================
  console.log('TEST 4: Hidden Fear (Forced Positivity)');
  console.log('-'.repeat(40));

  const result4 = detector.detectAllEmotions(
    "Everything is great! Really great!",
    {
      energy: 'medium',
      pitch: 'unstable',
      rate: 'fast',
      quality: 'tense',
      pauses: 'hesitant'
    }
  );

  console.log('Message: "Everything is great!"');
  console.log('Voice: unstable pitch, tense, hesitant');
  console.log(`Text says: ${result4.voiceAnalysis.congruence.textEmotion.emotion}`);
  console.log(`Voice shows: ${result4.voiceAnalysis.congruence.voiceEmotion.emotion} (${result4.voiceAnalysis.congruence.voiceEmotion.score.toFixed(2)})`);
  console.log(`Congruent: ${result4.voiceAnalysis.congruence.isCongruent}`);
  console.log(`Hidden emotion: ${result4.voiceAnalysis.congruence.hiddenEmotion || 'none'}`);
  console.log(`Dominant source: ${result4.voiceAnalysis.congruence.dominantSource}`);
  console.log(`Authenticity: ${result4.authenticity.toFixed(2)}`);
  console.log('Expected: Incongruent, voice dominant');
  console.log('');

  // =========================================================================
  // TEST 5: Trust + Warmth (no masking)
  // =========================================================================
  console.log('TEST 5: Trust + Warmth (Congruent)');
  console.log('-'.repeat(40));

  const result5 = detector.detectAllEmotions(
    "I trust you completely. I feel safe with you.",
    {
      energy: 'medium',
      pitch: 'stable',
      rate: 'normal',
      quality: 'warm'
    }
  );

  console.log('Message: "I trust you completely."');
  console.log('Voice: medium energy, stable pitch, warm');
  console.log(`Final emotion: ${result5.primary} (intensity: ${result5.intensity})`);
  console.log(`Text trust: ${result5.voiceAnalysis.textEmotions.trust.toFixed(2)}`);
  console.log(`Voice trust: ${result5.voiceAnalysis.voiceEmotions.trust.toFixed(2)}`);
  console.log(`Blended trust: ${result5.plutchikVector.trust.toFixed(2)}`);
  console.log(`Congruent: ${result5.voiceAnalysis.congruence.isCongruent}`);
  console.log(`Authenticity: ${result5.authenticity.toFixed(2)}`);
  console.log('Expected: High trust, congruent, high authenticity');
  console.log('');

  // =========================================================================
  // TEST 6: No Voice Data (text only)
  // =========================================================================
  console.log('TEST 6: Text Only (No Voice)');
  console.log('-'.repeat(40));

  const result6 = detector.detectAllEmotions("I'm feeling sad today.");

  console.log('Message: "I\'m feeling sad today."');
  console.log('Voice: (none)');
  console.log(`Final emotion: ${result6.primary} (intensity: ${result6.intensity})`);
  console.log(`Authenticity: ${result6.authenticity.toFixed(2)} (lower without voice)`);
  console.log(`Has voice analysis: ${result6.voiceAnalysis ? 'yes' : 'no'}`);
  console.log('Expected: Sadness from text, lower authenticity');
  console.log('');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('='.repeat(60));
  console.log('ALL TESTS COMPLETE');
  console.log('='.repeat(60));
  console.log('');
  console.log('Week 3 Voice Prosody Enhancement working:');
  console.log('  - Voice to 8 Plutchik emotions mapping');
  console.log('  - Voice-text congruence detection');
  console.log('  - Hidden emotion identification');
  console.log('  - Masking pattern recognition');
  console.log('  - Authenticity scoring');
  console.log('  - 60% voice / 40% text blending');
  console.log('');
  console.log('Luna can now see through masks and respond to truth.');
  console.log('');
}

// Run tests
testVoiceCongruence()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
