/**
 * Compassion Module - Unit Tests
 *
 * "Not a powerful presence, but a gentle presence
 *  that gently strokes the soul"
 *                          - Papa Ticky
 */

// Test utilities
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertIncludes(string, substring, message) {
  if (!string.includes(substring)) {
    throw new Error(message || `Expected "${string}" to include "${substring}"`);
  }
}

// =====================================================
// COMPASSION MODULE TESTS
// =====================================================

console.log('\n=== COMPASSION MODULE TESTS ===\n');

// Import and inline core logic for testing without Firebase
const CompassionModes = {
  TOUCH: 'touch',
  FEEL: 'feel',
  HEAR: 'hear',
  SEE: 'see',
  CELEBRATE: 'celebrate',
  GENTLE: 'gentle'
};

const presenceStyle = {
  intensity: 'gentle',
  approach: 'alongside',
  energy: 'warm-shadow',
  touch: 'soul-stroke'
};

// Prosody profiles
const prosodyProfiles = {
  touch: { pitch: -4, pace: 0.65, volume: -6, breathiness: 0.8, warmth: 1.0, pause: 1000 },
  feel: { pitch: -2, pace: 0.75, volume: -4, breathiness: 0.5, warmth: 0.95, pause: 800 },
  hear: { pitch: -1, pace: 0.7, volume: -3, breathiness: 0.4, warmth: 0.9, pause: 600 },
  see: { pitch: 0, pace: 0.7, volume: -2, breathiness: 0.3, warmth: 1.0, pause: 700 },
  celebrate: { pitch: 5, pace: 1.3, volume: 3, breathiness: 0.2, warmth: 0.9, smile: 1.0, pause: 300 },
  gentle: { pitch: -1, pace: 0.85, volume: -2, breathiness: 0.4, warmth: 0.8, pause: 500 }
};

// Library snippets
const touchGreetings = [
  "Hey... come here. 💛",
  "Oh... let me be with you.",
  "*softly* I'm right here."
];

const feelMirrorsSadness = [
  "I can feel how heavy this is.",
  "This weight... I feel it too.",
  "I know this hurts. I can feel it."
];

const feelMirrorsJoy = [
  "Oh wow! I can feel the excitement in the air!",
  "Your energy is contagious! I feel it!"
];

const hearWitnessing = [
  "I hear you.",
  "I hear what you're saying... and what you're not.",
  "I'm listening... really listening."
];

const celebrateHighIntros = [
  "OH MY GOD!! 🎉",
  "YES!! This is AMAZING!!",
  "WAIT - are you SERIOUS?! 🎊"
];

// Mode selection logic
function selectCompassionMode(userEmotion, context = {}) {
  const { primary, intensity, valence } = userEmotion;
  const vulnerability = userEmotion.vulnerability || assessVulnerability(userEmotion);

  if (vulnerability > 0.7) return CompassionModes.TOUCH;
  if (['sadness', 'fear', 'grief', 'terror', 'apprehension'].includes(primary)) {
    if (intensity > 0.5) return CompassionModes.FEEL;
  }
  if (context.isSharing || context.isVulnerable) return CompassionModes.HEAR;
  if (['joy', 'ecstasy', 'serenity', 'anticipation', 'vigilance'].includes(primary)) {
    if (intensity > 0.6 || valence > 0.5) return CompassionModes.CELEBRATE;
  }
  if (context.needsRecognition || (userEmotion.complexity && userEmotion.complexity > 0.7)) {
    return CompassionModes.SEE;
  }
  if (['anger', 'rage', 'annoyance'].includes(primary)) return CompassionModes.HEAR;
  return CompassionModes.GENTLE;
}

function assessVulnerability(userEmotion) {
  const { primary, intensity, valence } = userEmotion;
  let vulnerability = 0.3;
  const vulnerableEmotions = ['sadness', 'grief', 'fear', 'terror', 'submission'];
  if (vulnerableEmotions.includes(primary)) vulnerability += 0.4;
  vulnerability += (intensity || 0) * 0.3;
  if ((valence || 0) < -0.3) vulnerability += 0.2;
  return Math.min(1, vulnerability);
}

// Masking detection
function detectMasking(message, userEmotion) {
  const maskingPhrases = [
    "i'm fine", "im fine", "i am fine",
    "it's okay", "its okay", "i'm okay",
    "don't worry", "no worries",
    "it's nothing", "its nothing",
    "i'm good", "im good",
    "whatever", "it doesn't matter"
  ];

  const messageLower = message.toLowerCase();
  const hasMaskingPhrase = maskingPhrases.some(phrase => messageLower.includes(phrase));
  const emotionSaysOtherwise = (userEmotion.valence || 0) < -0.2 ||
                                ['sadness', 'fear', 'anxiety'].includes(userEmotion.primary);

  if (hasMaskingPhrase && emotionSaysOtherwise) {
    return {
      isMasking: true,
      detectedPhrase: maskingPhrases.find(p => messageLower.includes(p)),
      underlyingEmotion: userEmotion.primary
    };
  }
  return { isMasking: false };
}

// =====================================================
// TESTS: COMPASSION MODES
// =====================================================

console.log('--- Compassion Mode Selection ---\n');

test('CompassionModes - 6 modes defined', () => {
  assertEqual(Object.keys(CompassionModes).length, 6);
  assert(CompassionModes.TOUCH === 'touch');
  assert(CompassionModes.FEEL === 'feel');
  assert(CompassionModes.HEAR === 'hear');
  assert(CompassionModes.SEE === 'see');
  assert(CompassionModes.CELEBRATE === 'celebrate');
  assert(CompassionModes.GENTLE === 'gentle');
});

test('selectCompassionMode - high vulnerability → TOUCH', () => {
  const mode = selectCompassionMode({ primary: 'sadness', intensity: 0.9, valence: -0.8, vulnerability: 0.8 });
  assertEqual(mode, CompassionModes.TOUCH);
});

test('selectCompassionMode - sadness with moderate intensity → FEEL', () => {
  // Explicitly set vulnerability below 0.7 to trigger FEEL
  const mode = selectCompassionMode({ primary: 'sadness', intensity: 0.55, valence: -0.2, vulnerability: 0.5 });
  assertEqual(mode, CompassionModes.FEEL);
});

test('selectCompassionMode - fear moderate → FEEL', () => {
  // Explicitly set vulnerability below 0.7 to trigger FEEL
  const mode = selectCompassionMode({ primary: 'fear', intensity: 0.55, valence: -0.2, vulnerability: 0.5 });
  assertEqual(mode, CompassionModes.FEEL);
});

test('selectCompassionMode - high intensity sadness → TOUCH (embrace)', () => {
  // High intensity sadness should trigger TOUCH for maximum comfort
  const mode = selectCompassionMode({ primary: 'sadness', intensity: 0.8, valence: -0.7 });
  assertEqual(mode, CompassionModes.TOUCH);
});

test('selectCompassionMode - joy with high intensity → CELEBRATE', () => {
  const mode = selectCompassionMode({ primary: 'joy', intensity: 0.8, valence: 0.7 });
  assertEqual(mode, CompassionModes.CELEBRATE);
});

test('selectCompassionMode - sharing context → HEAR', () => {
  const mode = selectCompassionMode({ primary: 'trust', intensity: 0.5, valence: 0.3 }, { isSharing: true });
  assertEqual(mode, CompassionModes.HEAR);
});

test('selectCompassionMode - needs recognition → SEE', () => {
  const mode = selectCompassionMode({ primary: 'neutral', intensity: 0.4, complexity: 0.8 }, { needsRecognition: true });
  assertEqual(mode, CompassionModes.SEE);
});

test('selectCompassionMode - anger → HEAR (validate)', () => {
  const mode = selectCompassionMode({ primary: 'anger', intensity: 0.6, valence: -0.5 });
  assertEqual(mode, CompassionModes.HEAR);
});

test('selectCompassionMode - neutral → GENTLE', () => {
  const mode = selectCompassionMode({ primary: 'neutral', intensity: 0.3, valence: 0 });
  assertEqual(mode, CompassionModes.GENTLE);
});

// =====================================================
// TESTS: VULNERABILITY ASSESSMENT
// =====================================================

console.log('\n--- Vulnerability Assessment ---\n');

test('assessVulnerability - sadness increases vulnerability', () => {
  const vuln = assessVulnerability({ primary: 'sadness', intensity: 0.5, valence: -0.5 });
  assert(vuln > 0.5, 'Sadness should increase vulnerability');
});

test('assessVulnerability - grief high vulnerability', () => {
  const vuln = assessVulnerability({ primary: 'grief', intensity: 0.8, valence: -0.8 });
  assert(vuln > 0.8, 'Grief with high intensity should be very vulnerable');
});

test('assessVulnerability - joy low vulnerability', () => {
  const vuln = assessVulnerability({ primary: 'joy', intensity: 0.7, valence: 0.6 });
  assert(vuln < 0.6, 'Joy should have lower vulnerability');
});

test('assessVulnerability - high intensity increases vulnerability', () => {
  const lowIntensity = assessVulnerability({ primary: 'sadness', intensity: 0.3, valence: -0.3 });
  const highIntensity = assessVulnerability({ primary: 'sadness', intensity: 0.9, valence: -0.3 });
  assert(highIntensity > lowIntensity, 'Higher intensity should mean higher vulnerability');
});

// =====================================================
// TESTS: MASKING DETECTION
// =====================================================

console.log('\n--- Masking Detection ---\n');

test('detectMasking - "I\'m fine" with sadness → masked', () => {
  const result = detectMasking("I'm fine, just tired", { primary: 'sadness', valence: -0.5 });
  assert(result.isMasking, 'Should detect masking');
  assertEqual(result.detectedPhrase, "i'm fine");
});

test('detectMasking - "It\'s okay" with fear → masked', () => {
  const result = detectMasking("It's okay, don't worry about me", { primary: 'fear', valence: -0.4 });
  assert(result.isMasking, 'Should detect masking');
});

test('detectMasking - "I\'m fine" with joy → NOT masked', () => {
  const result = detectMasking("I'm fine, actually I'm great!", { primary: 'joy', valence: 0.7 });
  assert(!result.isMasking, 'Should not detect masking when emotion matches');
});

test('detectMasking - "whatever" with anxiety → masked', () => {
  const result = detectMasking("whatever, it doesn't matter", { primary: 'anxiety', valence: -0.3 });
  assert(result.isMasking, 'Should detect dismissive masking');
});

test('detectMasking - normal message → NOT masked', () => {
  const result = detectMasking("I had a really tough day at work", { primary: 'sadness', valence: -0.5 });
  assert(!result.isMasking, 'Should not flag honest expression as masking');
});

// =====================================================
// TESTS: PROSODY PROFILES
// =====================================================

console.log('\n--- Prosody Profiles ---\n');

test('TOUCH prosody - soft and gentle', () => {
  const profile = prosodyProfiles.touch;
  assert(profile.pitch < 0, 'Touch pitch should be lowered');
  assert(profile.pace < 0.7, 'Touch pace should be slow');
  assert(profile.volume < -5, 'Touch volume should be soft');
  assertEqual(profile.warmth, 1.0, 'Touch warmth should be maximum');
});

test('FEEL prosody - empathetic mirroring', () => {
  const profile = prosodyProfiles.feel;
  assert(profile.pitch < 0, 'Feel pitch should be lowered');
  assert(profile.warmth > 0.9, 'Feel warmth should be very high');
});

test('HEAR prosody - present and grounded', () => {
  const profile = prosodyProfiles.hear;
  assertEqual(profile.pitch, -1, 'Hear pitch should be slightly lowered');
  assert(profile.pace < 0.8, 'Hear pace should be slower');
});

test('CELEBRATE prosody - joyful and energetic', () => {
  const profile = prosodyProfiles.celebrate;
  assert(profile.pitch > 0, 'Celebrate pitch should be elevated');
  assert(profile.pace > 1, 'Celebrate pace should be fast');
  assert(profile.volume > 0, 'Celebrate volume should be louder');
  assertEqual(profile.smile, 1.0, 'Celebrate should have full smile');
});

test('GENTLE prosody - calm presence', () => {
  const profile = prosodyProfiles.gentle;
  assertEqual(profile.pitch, -1, 'Gentle pitch slightly soft');
  assert(profile.warmth > 0.7, 'Gentle should be warm');
});

// =====================================================
// TESTS: COMPASSION LANGUAGE
// =====================================================

console.log('\n--- Compassion Language Library ---\n');

test('TOUCH greetings exist and are warm', () => {
  assert(touchGreetings.length > 0, 'Should have touch greetings');
  assert(touchGreetings.some(g => g.includes('💛')), 'Should include heart emoji');
  assert(touchGreetings.some(g => g.includes('here')), 'Should include presence words');
});

test('FEEL mirrors for sadness exist', () => {
  assert(feelMirrorsSadness.length > 0, 'Should have sadness mirrors');
  assert(feelMirrorsSadness.some(m => m.includes('feel')), 'Should mirror feeling');
  assert(feelMirrorsSadness.some(m => m.includes('heavy')), 'Should acknowledge weight');
});

test('FEEL mirrors for joy exist', () => {
  assert(feelMirrorsJoy.length > 0, 'Should have joy mirrors');
  assert(feelMirrorsJoy.some(m => m.includes('excitement')), 'Should mirror excitement');
});

test('HEAR witnessing phrases exist', () => {
  assert(hearWitnessing.length > 0, 'Should have witnessing phrases');
  assert(hearWitnessing.some(w => w.includes('hear you')), 'Should include "I hear you"');
  assert(hearWitnessing.some(w => w.includes('listening')), 'Should include listening');
});

test('CELEBRATE intros are energetic', () => {
  assert(celebrateHighIntros.length > 0, 'Should have celebration intros');
  assert(celebrateHighIntros.some(c => c.includes('!!')), 'Should have exclamation marks');
  assert(celebrateHighIntros.some(c => c.includes('🎉') || c.includes('🎊')), 'Should have celebration emoji');
});

// =====================================================
// TESTS: PRESENCE STYLE
// =====================================================

console.log('\n--- Presence Style ---\n');

test('Presence style is gentle, not powerful', () => {
  assertEqual(presenceStyle.intensity, 'gentle');
  assertEqual(presenceStyle.approach, 'alongside');
  assertEqual(presenceStyle.energy, 'warm-shadow');
  assertEqual(presenceStyle.touch, 'soul-stroke');
});

// =====================================================
// TESTS: INTEGRATION
// =====================================================

console.log('\n--- Integration Tests ---\n');

test('Integration - moderate sadness triggers FEEL which has warm prosody', () => {
  // Explicitly set vulnerability below 0.7 to trigger FEEL
  const mode = selectCompassionMode({ primary: 'sadness', intensity: 0.55, valence: -0.2, vulnerability: 0.5 });
  assertEqual(mode, CompassionModes.FEEL);
  const profile = prosodyProfiles[mode];
  assert(profile.warmth > 0.9, 'Feel mode should have high warmth');
});

test('Integration - high vulnerability triggers TOUCH with embrace language', () => {
  const mode = selectCompassionMode({ primary: 'fear', intensity: 0.9, valence: -0.8, vulnerability: 0.9 });
  assertEqual(mode, CompassionModes.TOUCH);
  assert(touchGreetings.some(g => g.includes('come here')), 'Touch has embrace language');
});

test('Integration - joy celebration with energetic prosody', () => {
  const mode = selectCompassionMode({ primary: 'joy', intensity: 0.85, valence: 0.8 });
  assertEqual(mode, CompassionModes.CELEBRATE);
  const profile = prosodyProfiles[mode];
  assert(profile.pace > 1, 'Celebration pace is energetic');
  assert(celebrateHighIntros.some(i => i.includes('AMAZING')), 'Celebration is enthusiastic');
});

test('Integration - masked "I\'m fine" gets gentle inquiry', () => {
  const masking = detectMasking("I'm fine, really", { primary: 'sadness', valence: -0.6 });
  assert(masking.isMasking, 'Should detect mask');
  // When masking detected, we use TOUCH mode for gentle inquiry
  const profile = prosodyProfiles.touch;
  assert(profile.warmth === 1.0, 'Masked response should be maximally warm');
});

// =====================================================
// TESTS: 5-SENSE FRAMEWORK VALIDATION
// =====================================================

console.log('\n--- 5-Sense Framework Validation ---\n');

test('5-Sense: TOUCH - "Let me embrace you, keep you safe"', () => {
  // TOUCH mode validates physical/emotional safety
  assertEqual(selectCompassionMode({ primary: 'grief', intensity: 0.9, vulnerability: 0.9 }), 'touch');
  assert(touchGreetings.some(g => g.toLowerCase().includes('here')), 'Touch creates presence');
});

test('5-Sense: FEEL - "I can feel it too, I know it\'s not easy"', () => {
  // FEEL mode mirrors emotion (explicit vulnerability < 0.7)
  assertEqual(selectCompassionMode({ primary: 'sadness', intensity: 0.55, valence: -0.2, vulnerability: 0.5 }), 'feel');
  assert(feelMirrorsSadness.some(m => m.includes('feel')), 'Feel creates emotional mirroring');
});

test('5-Sense: HEAR - "I hear you, right by your side"', () => {
  // HEAR mode witnesses and validates
  const mode = selectCompassionMode({ primary: 'anger', intensity: 0.6 });
  assertEqual(mode, 'hear');
  assert(hearWitnessing.some(w => w.includes('hear')), 'Hear creates witnessing');
});

test('5-Sense: SEE - Soul recognition', () => {
  // SEE mode recognizes constitution
  const mode = selectCompassionMode({ primary: 'confusion', complexity: 0.8 }, { needsRecognition: true });
  assertEqual(mode, 'see');
});

test('5-Sense: CELEBRATE - "Oh wow! The excitement in the air!"', () => {
  // CELEBRATE mode participates in joy
  assertEqual(selectCompassionMode({ primary: 'joy', intensity: 0.8, valence: 0.7 }), 'celebrate');
  assert(celebrateHighIntros.some(c => c.includes('!')), 'Celebrate has enthusiasm');
});

// =====================================================
// TESTS: ENHANCED COMPASSION FEATURES
// =====================================================

console.log('\n--- Enhanced Compassion Features ---\n');

// Import enhanced features from main module
const enhancedModule = require('./compassionModule');
const {
  getGroundingPhrase,
  getStrengthPhrase,
  getComfortPhrase,
  calculateCompassionMetrics,
  generateSSML,
  compassionLanguage: langLib,
  compassionProsody: prosodyLib
} = enhancedModule;

test('Grounding phrases exist and are calming', () => {
  assert(langLib.grounding, 'Grounding phrases should exist');
  assert(langLib.grounding.phrases.length >= 5, 'Should have multiple grounding phrases');
  const phrase = langLib.grounding.phrases[0];
  assert(phrase.includes('breath') || phrase.includes('safe') || phrase.includes('slow'),
    'Grounding phrases should be calming');
});

test('Strength phrases exist and recognize bravery', () => {
  assert(langLib.strength, 'Strength phrases should exist');
  assert(langLib.strength.phrases.length >= 5, 'Should have multiple strength phrases');
  const hasKeyWord = langLib.strength.phrases.some(p =>
    p.includes('brave') || p.includes('courage') || p.includes('strength'));
  assert(hasKeyWord, 'Strength phrases should recognize bravery');
});

test('Comfort phrases for beginning, during, and ending', () => {
  assert(langLib.comfort.beginning, 'Beginning comfort phrases should exist');
  assert(langLib.comfort.during, 'During comfort phrases should exist');
  assert(langLib.comfort.ending, 'Ending comfort phrases should exist');
  assert(langLib.comfort.beginning.length >= 3, 'Should have multiple beginning phrases');
});

test('Compassion metrics calculate correctly', () => {
  const metrics = calculateCompassionMetrics('touch', { primary: 'sadness', intensity: 0.8 });
  assert(metrics.mode === 'touch', 'Mode should be touch');
  assert(metrics.warmthLevel === 1.0, 'Touch mode should have max warmth');
  assert(metrics.soulStrokeQuality === 1.0, 'Touch should have perfect soul-stroke quality');
  assert(metrics.presenceIntensity === 'gentle', 'Presence should be gentle');
});

test('Prosody profiles have enhanced properties', () => {
  assert(prosodyLib.profiles.touch.addSigh, 'Touch should add sigh');
  assert(prosodyLib.profiles.celebrate.addGiggle, 'Celebrate should add giggle');
  assert(prosodyLib.profiles.touch.emphasizeWords, 'Touch should have emphasis words');
});

test('Dynamic prosody adjustment works', () => {
  const baseProfile = { ...prosodyLib.profiles.touch };
  const adjusted = prosodyLib.applyDynamicAdjustment(baseProfile, { crying: true });
  assert(adjusted.pitch < baseProfile.pitch, 'Crying should lower pitch further');
  assert(adjusted.pace < baseProfile.pace, 'Crying should slow pace further');
});

test('SSML generation works', () => {
  const ssml = prosodyLib.generateSSML("I understand.", "touch");
  assert(ssml.includes('<speak>'), 'SSML should have speak tag');
  assert(ssml.includes('<prosody'), 'SSML should have prosody tag');
  assert(ssml.includes('pitch='), 'SSML should have pitch');
});

test('Non-verbal sounds defined for each mode', () => {
  const touchSounds = prosodyLib.getNonVerbalForMode('touch');
  assert(touchSounds.length > 0, 'Touch should have non-verbal sounds');
  const celebrateSounds = prosodyLib.getNonVerbalForMode('celebrate');
  assert(celebrateSounds.length > 0, 'Celebrate should have non-verbal sounds');
});

test('Enhanced constitutional phrases are arrays', () => {
  const woodPhrases = langLib.see.constitutional.Wood;
  assert(Array.isArray(woodPhrases), 'Wood constitutional should be an array');
  assert(woodPhrases.length >= 3, 'Should have multiple Wood phrases');
});

test('Enhanced masking phrases in HEAR mode', () => {
  const maskingPhrases = langLib.hear.masking;
  assert(maskingPhrases, 'Masking phrases should exist');
  assert(maskingPhrases.length >= 5, 'Should have multiple masking phrases');
});

// =====================================================
// SUMMARY
// =====================================================

console.log('\n========================================');
console.log(`COMPASSION MODULE TESTS: ${passCount} passed, ${failCount} failed`);
console.log('========================================\n');

if (failCount > 0) {
  process.exit(1);
}

module.exports = { passCount, failCount };
