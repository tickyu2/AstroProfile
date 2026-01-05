/**
 * GENESIS Luna - Week 13 Part 2 Test Suite
 * Tests for MatingCall, FlirtationVoice, EnhancedGossip, InteractionSummaries
 *
 * Run with: node functions/test/test-week13-part2.js
 */

const assert = require('assert');

// Import modules
const MatingCallModule = require('../intimacy/matingCall');
const FlirtationVoiceModule = require('../intimacy/flirtationVoice');
const EnhancedGossipModule = require('../intimacy/enhancedGossip');
const InteractionSummariesModule = require('../intimacy/interactionSummaries');

// Import main index for integration tests
const intimacy = require('../intimacy');

// Test tracking
let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    results.push({ name, status: 'PASS' });
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed++;
    results.push({ name, status: 'FAIL', error: error.message });
    console.log(`  ✗ ${name}: ${error.message}`);
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    passed++;
    results.push({ name, status: 'PASS' });
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed++;
    results.push({ name, status: 'FAIL', error: error.message });
    console.log(`  ✗ ${name}: ${error.message}`);
  }
}

// ============================================================================
// MATINGCALL MODULE TESTS
// ============================================================================

console.log('\n=== MatingCall Module Tests ===\n');

test('MatingCallModule can be instantiated', () => {
  const mc = new MatingCallModule();
  assert(mc !== null);
  assert(typeof mc.preferenceCategories === 'object');
});

test('MatingCallModule has universal boundaries', () => {
  const mc = new MatingCallModule();
  assert(mc.universalBoundaries.includes('minors'));
  assert(mc.universalBoundaries.includes('non_consent'));
  assert(mc.universalBoundaries.includes('violence'));
});

test('detectDirectPreferences finds romantic style', () => {
  const mc = new MatingCallModule();
  const discoveries = mc.detectDirectPreferences('I like gentle approaches');
  assert(discoveries.length > 0);
  assert(discoveries[0].category === 'romantic_style');
  assert(discoveries[0].value === 'gentle');
});

test('detectDirectPreferences finds pace preference', () => {
  const mc = new MatingCallModule();
  const discoveries = mc.detectDirectPreferences('Let\'s take our time');
  assert(discoveries.length > 0);
  assert(discoveries[0].category === 'intimacy_pace');
  assert(discoveries[0].value === 'very_slow');
});

test('detectDirectPreferences handles passionate style', () => {
  const mc = new MatingCallModule();
  const discoveries = mc.detectDirectPreferences('I love when you\'re passionate');
  assert(discoveries.length > 0);
  assert(discoveries[0].value === 'passionate');
});

test('detectEnthusiasm identifies positive markers', () => {
  const mc = new MatingCallModule();
  assert(mc.detectEnthusiasm('Yes! That\'s amazing!') === true);
  assert(mc.detectEnthusiasm('I love this so much') === true);
  assert(mc.detectEnthusiasm('Okay I guess') === false);
});

test('detectDiscomfort identifies negative markers', () => {
  const mc = new MatingCallModule();
  assert(mc.detectDiscomfort('I\'m not comfortable with that') === true);
  assert(mc.detectDiscomfort('slow down please') === true);
  assert(mc.detectDiscomfort('That sounds nice') === false);
});

test('detectBoundaries finds hard limits', () => {
  const mc = new MatingCallModule();
  const boundaries = mc.detectBoundaries('I don\'t want anything rough');
  assert(boundaries.length > 0);
  assert(boundaries[0].type === 'hard_limit');
});

test('detectBoundaries finds soft limits', () => {
  const mc = new MatingCallModule();
  const boundaries = mc.detectBoundaries('I\'m unsure about role playing');
  assert(boundaries.length > 0);
  assert(boundaries[0].type === 'soft_limit');
});

test('classifyReaction returns correct classifications', () => {
  const mc = new MatingCallModule();
  assert(mc.classifyReaction('Yes! I love this!') === 'positive');
  assert(mc.classifyReaction('I\'m not comfortable') === 'uncomfortable');
  assert(mc.classifyReaction('Not really my thing') === 'negative');
});

test('calculateEngagement scores correctly', () => {
  const mc = new MatingCallModule();
  const shortResponse = mc.calculateEngagement('ok');
  const longResponse = mc.calculateEngagement('This is such a long response with many words that shows high engagement and enthusiasm!');
  assert(longResponse > shortResponse);
});

test('getStyleDescription returns descriptions', () => {
  const mc = new MatingCallModule();
  assert(mc.getStyleDescription('gentle').includes('soft'));
  assert(mc.getStyleDescription('passionate').includes('intense'));
  assert(mc.getStyleDescription('playful').includes('teasing'));
});

test('detectReaction handles null lunaApproach', () => {
  const mc = new MatingCallModule();
  const result = mc.detectReaction('test message', {});
  assert(result === null);
});

// ============================================================================
// FLIRTATION VOICE MODULE TESTS
// ============================================================================

console.log('\n=== FlirtationVoice Module Tests ===\n');

test('FlirtationVoiceModule can be instantiated', () => {
  const fv = new FlirtationVoiceModule();
  assert(fv !== null);
  assert(typeof fv.voiceStyles === 'object');
});

test('FlirtationVoiceModule has 5 voice styles', () => {
  const fv = new FlirtationVoiceModule();
  const styles = Object.keys(fv.voiceStyles);
  assert(styles.includes('playful'));
  assert(styles.includes('seductive'));
  assert(styles.includes('romantic'));
  assert(styles.includes('sweet'));
  assert(styles.includes('balanced'));
});

test('generateRegularVoice returns SSML', () => {
  const fv = new FlirtationVoiceModule();
  const result = fv.generateRegularVoice('Hello there');
  assert(result.ssml.includes('<speak>'));
  assert(result.ssml.includes('</speak>'));
  assert(result.style === 'regular');
});

test('selectVoiceStyle returns balanced for low intimacy', () => {
  const fv = new FlirtationVoiceModule();
  const style = fv.selectVoiceStyle({ intimacy_level: 2, relationship_level: 2 }, {});
  assert(style.name === 'balanced');
});

test('selectVoiceStyle returns seductive for high intimacy and flirtation', () => {
  const fv = new FlirtationVoiceModule();
  const style = fv.selectVoiceStyle(
    { intimacy_level: 9, relationship_level: 8 },
    { flirtation_level: 8 }
  );
  assert(style.name === 'seductive');
});

test('selectVoiceStyle returns playful for joy emotion', () => {
  const fv = new FlirtationVoiceModule();
  const style = fv.selectVoiceStyle(
    { emotion: 'joy', intimacy_level: 6, relationship_level: 6 },
    {}
  );
  assert(style.name === 'playful');
});

test('calculateProsody clamps values correctly', () => {
  const fv = new FlirtationVoiceModule();
  const style = fv.voiceStyles.playful;
  const prosody = fv.calculateProsody(style, {}, {});
  assert(prosody.pitch >= -10 && prosody.pitch <= 10);
  assert(prosody.pace >= 0.7 && prosody.pace <= 1.3);
  assert(prosody.breathiness >= 0 && prosody.breathiness <= 1);
});

test('buildSSML creates valid structure', () => {
  const fv = new FlirtationVoiceModule();
  const prosody = { pitch: 2, pace: 1.1, breathiness: 0.3, warmth: 0.8 };
  const ssml = fv.buildSSML('Hello', prosody, fv.voiceStyles.playful);
  assert(ssml.startsWith('<speak>'));
  assert(ssml.includes('<prosody'));
  assert(ssml.endsWith('</speak>'));
});

test('addNonVerbalSounds respects profile settings', () => {
  const fv = new FlirtationVoiceModule();
  const profile = { use_giggles: false, use_sighs: false, use_mmm: false, use_breaths: false, use_laughs: false };
  const result = fv.addNonVerbalSounds('Hello there', fv.voiceStyles.playful, {}, profile);
  assert(result === 'Hello there'); // No changes when all disabled
});

test('getStyleDescription returns valid descriptions', () => {
  const fv = new FlirtationVoiceModule();
  assert(fv.getStyleDescription('playful').includes('youthful'));
  assert(fv.getStyleDescription('seductive').includes('breathy'));
  assert(fv.getStyleDescription('romantic').includes('tender'));
});

test('getAvailableStyles returns all styles', () => {
  const fv = new FlirtationVoiceModule();
  const styles = fv.getAvailableStyles();
  assert(styles.length === 5);
  assert(styles.some(s => s.name === 'playful'));
});

test('generateStylePreview creates preview', () => {
  const fv = new FlirtationVoiceModule();
  const preview = fv.generateStylePreview('romantic');
  assert(preview.style === 'romantic');
  assert(preview.ssml.includes('<speak>'));
});

test('analyzeTextForStyle suggests appropriate styles', () => {
  const fv = new FlirtationVoiceModule();
  const result = fv.analyzeTextForStyle('I love you so much, you mean everything to me');
  assert(result.scores.romantic > 0);
});

// ============================================================================
// ENHANCED GOSSIP MODULE TESTS
// ============================================================================

console.log('\n=== EnhancedGossip Module Tests ===\n');

test('EnhancedGossipModule can be instantiated', () => {
  const eg = new EnhancedGossipModule();
  assert(eg !== null);
  assert(Array.isArray(eg.relationshipTypes));
});

test('inferRelationshipType identifies friend', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.inferRelationshipType('My friend Sarah') === 'friend');
});

test('inferRelationshipType identifies family', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.inferRelationshipType('My mom called') === 'family');
  assert(eg.inferRelationshipType('My sister said') === 'family');
});

test('inferRelationshipType identifies romantic', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.inferRelationshipType('I talked to my boyfriend today') === 'romantic');
  assert(eg.inferRelationshipType('She is my girlfriend') === 'romantic');
});

test('inferRelationshipType identifies ex', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.inferRelationshipType('My ex called me') === 'ex');
});

test('inferRelationshipType identifies crush', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.inferRelationshipType('I have a crush on him') === 'crush');
});

test('analyzeSentiment returns 0-1 range', () => {
  const eg = new EnhancedGossipModule();
  const positive = eg.analyzeSentiment('He\'s amazing and wonderful!');
  const negative = eg.analyzeSentiment('She\'s terrible and awful');
  assert(positive >= 0 && positive <= 1);
  assert(negative >= 0 && negative <= 1);
  assert(positive > negative);
});

test('extractTraits finds personality traits', () => {
  const eg = new EnhancedGossipModule();
  const traits = eg.extractTraits('She\'s so funny and kind');
  assert(traits.includes('funny'));
  assert(traits.includes('kind'));
});

test('extractInterests finds hobbies', () => {
  const eg = new EnhancedGossipModule();
  const interests = eg.extractInterests('He loves hiking and reading');
  assert(interests.includes('hiking'));
  assert(interests.includes('reading'));
});

test('detectRedFlags identifies concerning behavior', () => {
  const eg = new EnhancedGossipModule();
  const redFlags = eg.detectRedFlags('He\'s so controlling and tries to manipulate me');
  assert(redFlags.includes('controlling'));
  assert(redFlags.includes('toxic')); // 'manipulate' maps to toxic
});

test('detectGreenFlags identifies positive traits', () => {
  const eg = new EnhancedGossipModule();
  const greenFlags = eg.detectGreenFlags('She\'s so supportive and kind');
  assert(greenFlags.includes('supportive'));
  assert(greenFlags.includes('kind'));
});

test('formOpinion returns structured opinion', () => {
  const eg = new EnhancedGossipModule();
  const opinion = eg.formOpinion('He\'s really supportive and kind');
  assert(typeof opinion.opinion === 'string');
  assert(typeof opinion.sentiment === 'number');
  assert(Array.isArray(opinion.greenFlags));
});

test('calculatePriority increases for direct involvement', () => {
  const eg = new EnhancedGossipModule();
  const indirect = eg.calculatePriority('neutral', 'observer');
  const direct = eg.calculatePriority('worried', 'direct');
  assert(direct > indirect);
});

test('determineEventStatus identifies resolved events', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.determineEventStatus('It\'s finally resolved') === 'resolved');
  assert(eg.determineEventStatus('Things are escalating') === 'escalating');
  assert(eg.determineEventStatus('Still ongoing') === 'ongoing');
});

test('assessCompatibility returns valid values', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.assessCompatibility('They love each other so much, it\'s amazing and wonderful!') === 'good');
  assert(eg.assessCompatibility('It\'s toxic and terrible and awful') === 'bad');
});

test('inferRelationshipStatus detects status', () => {
  const eg = new EnhancedGossipModule();
  assert(eg.inferRelationshipStatus('They\'re dating now') === 'together');
  assert(eg.inferRelationshipStatus('They broke up') === 'separated');
});

test('assessGossipLevel increases for juicy content', () => {
  const eg = new EnhancedGossipModule();
  const mild = eg.assessGossipLevel('They went to lunch');
  const juicy = eg.assessGossipLevel('She\'s cheating on him, it\'s a huge secret!');
  assert(juicy > mild);
});

test('extractNames finds capitalized names', () => {
  const eg = new EnhancedGossipModule();
  const names = eg.extractNames('Sarah told Mike about the party');
  assert(names.includes('Sarah'));
  assert(names.includes('Mike'));
});

test('generateLocalFollowup returns generic followup', () => {
  const eg = new EnhancedGossipModule();
  const result = eg.generateLocalFollowup();
  assert(typeof result.followup === 'string');
  assert(result.followup.length > 0);
});

// ============================================================================
// INTERACTION SUMMARIES MODULE TESTS
// ============================================================================

console.log('\n=== InteractionSummaries Module Tests ===\n');

test('InteractionSummariesModule can be instantiated', () => {
  const is = new InteractionSummariesModule();
  assert(is !== null);
  assert(Array.isArray(is.conversationTypes));
});

test('extractTopics finds common topics', () => {
  const is = new InteractionSummariesModule();
  const messages = [{ content: 'I had a tough day at work' }, { content: 'My boss was being difficult' }];
  const topics = is.extractTopics(messages);
  assert(topics.includes('work'));
});

test('extractPeopleMentioned finds names', () => {
  const is = new InteractionSummariesModule();
  const messages = [{ content: 'Sarah told me about Mike' }];
  const people = is.extractPeopleMentioned(messages);
  assert(people.includes('Sarah'));
  assert(people.includes('Mike'));
});

test('detectEmotion identifies joy', () => {
  const is = new InteractionSummariesModule();
  assert(is.detectEmotion('I\'m so happy today!') === 'joy');
  assert(is.detectEmotion('This is amazing!') === 'joy');
});

test('detectEmotion identifies sadness', () => {
  const is = new InteractionSummariesModule();
  assert(is.detectEmotion('I feel so sad') === 'sadness');
});

test('detectEmotion identifies love', () => {
  const is = new InteractionSummariesModule();
  assert(is.detectEmotion('I love you so much') === 'love');
});

test('isFunnyMoment detects laughter', () => {
  const is = new InteractionSummariesModule();
  assert(is.isFunnyMoment('haha that\'s hilarious') === true);
  assert(is.isFunnyMoment('lol so funny') === true);
  assert(is.isFunnyMoment('That\'s nice') === false);
});

test('isInsightMoment detects realizations', () => {
  const is = new InteractionSummariesModule();
  assert(is.isInsightMoment('I realize now that you\'re right') === true);
  assert(is.isInsightMoment('Oh wow, that makes sense') === true);
});

test('isVulnerabilityMoment detects vulnerability', () => {
  const is = new InteractionSummariesModule();
  assert(is.isVulnerabilityMoment('I\'ve never told anyone this secret') === true);
  assert(is.isVulnerabilityMoment('I feel scared and vulnerable') === true);
});

test('classifyConversationType returns valid types', () => {
  const is = new InteractionSummariesModule();
  const messages = [{ content: 'I feel scared and vulnerable about sharing this' }];
  const type = is.classifyConversationType(messages, ['vulnerability']);
  assert(is.conversationTypes.includes(type) || type === 'deep');
});

test('selectEmoji returns appropriate emoji', () => {
  const is = new InteractionSummariesModule();
  assert(is.selectEmoji(['joy'], 'playful') === '😂');
  assert(is.selectEmoji(['love'], 'romantic') === '💛');
  assert(is.selectEmoji(['vulnerability'], 'deep') === '🌟');
});

test('selectColorTheme returns valid theme', () => {
  const is = new InteractionSummariesModule();
  assert(is.selectColorTheme(['love']) === 'warm');
  assert(is.selectColorTheme(['joy']) === 'vibrant');
  assert(is.selectColorTheme(['sadness']) === 'cool');
});

test('generateTitle creates meaningful title', () => {
  const is = new InteractionSummariesModule();
  const title = is.generateTitle(['relationships'], ['love']);
  assert(typeof title === 'string');
  assert(title.length > 0);
});

test('generateSummary creates summary', () => {
  const is = new InteractionSummariesModule();
  const messages = [{ content: 'I had a great day at work' }];
  const summary = is.generateSummary(messages, ['work'], ['joy']);
  assert(typeof summary === 'string');
  assert(summary.length > 20);
});

test('calculateEngagement returns 0-1 range', () => {
  const is = new InteractionSummariesModule();
  const messages = [{ content: 'This is a very long message with lots of engagement and enthusiasm!' }];
  const engagement = is.calculateEngagement(messages);
  assert(engagement >= 0 && engagement <= 1);
});

test('extractKeywords filters stop words', () => {
  const is = new InteractionSummariesModule();
  const keywords = is.extractKeywords('The quick brown fox jumps over the lazy dog');
  assert(!keywords.includes('the'));
  // 'over' is only 4 chars and should be filtered
  assert(keywords.includes('quick') || keywords.includes('brown') || keywords.includes('jumps'));
});

test('sampleMessages returns correct number', () => {
  const is = new InteractionSummariesModule();
  const messages = Array(20).fill({ content: 'test' });
  const samples = is.sampleMessages(messages, 5);
  assert(samples.length === 5);
});

test('isBreakthroughConversation requires all conditions', () => {
  const is = new InteractionSummariesModule();
  const shortMessages = Array(5).fill({ content: 'I realize I was scared' });
  const longMessages = Array(25).fill({ content: 'I realize now that I was so scared and vulnerable about this' });

  assert(is.isBreakthroughConversation(shortMessages, ['vulnerability']) === false);
  assert(is.isBreakthroughConversation(longMessages, ['vulnerability']) === true);
});

test('capitalizeFirst handles empty strings', () => {
  const is = new InteractionSummariesModule();
  assert(is.capitalizeFirst('') === '');
  assert(is.capitalizeFirst('hello') === 'Hello');
});

// ============================================================================
// INDEX EXPORTS TESTS
// ============================================================================

console.log('\n=== Index Exports Tests ===\n');

test('Index exports all module classes', () => {
  assert(typeof intimacy.MatingCallModule === 'function');
  assert(typeof intimacy.FlirtationVoiceModule === 'function');
  assert(typeof intimacy.EnhancedGossipModule === 'function');
  assert(typeof intimacy.InteractionSummariesModule === 'function');
});

test('Index exports factory functions', () => {
  assert(typeof intimacy.getMatingCall === 'function');
  assert(typeof intimacy.getFlirtationVoice === 'function');
  assert(typeof intimacy.getEnhancedGossip === 'function');
  assert(typeof intimacy.getInteractionSummaries === 'function');
});

test('Index exports MatingCall integration functions', () => {
  assert(typeof intimacy.checkIntimacyPermission === 'function');
  assert(typeof intimacy.enableIntimacy === 'function');
  assert(typeof intimacy.disableIntimacy === 'function');
  assert(typeof intimacy.getIntimacyStatus === 'function');
});

test('Index exports FlirtationVoice integration functions', () => {
  assert(typeof intimacy.generateFlirtyVoice === 'function');
  assert(typeof intimacy.enableFlirtationVoice === 'function');
  assert(typeof intimacy.disableFlirtationVoice === 'function');
  assert(typeof intimacy.getAvailableVoiceStyles === 'function');
});

test('Index exports EnhancedGossip integration functions', () => {
  assert(typeof intimacy.trackPerson === 'function');
  assert(typeof intimacy.trackSocialEvent === 'function');
  assert(typeof intimacy.detectGossip === 'function');
  assert(typeof intimacy.formOpinion === 'function');
});

test('Index exports InteractionSummaries integration functions', () => {
  assert(typeof intimacy.generateSessionSummary === 'function');
  assert(typeof intimacy.getTimeline === 'function');
  assert(typeof intimacy.searchConversations === 'function');
  assert(typeof intimacy.getMilestones === 'function');
});

test('Factory functions return singleton instances', () => {
  const mc1 = intimacy.getMatingCall();
  const mc2 = intimacy.getMatingCall();
  assert(mc1 === mc2);
});

test('getAvailableVoiceStyles returns style array', () => {
  const styles = intimacy.getAvailableVoiceStyles();
  assert(Array.isArray(styles));
  assert(styles.length === 5);
});

test('formOpinion works through index', () => {
  const opinion = intimacy.formOpinion('He is so kind and supportive');
  assert(typeof opinion.opinion === 'string');
  assert(opinion.greenFlags.length > 0);
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\nFailed tests:');
  results.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`  - ${r.name}: ${r.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!\n');
  console.log('Week 13 Part 2 Modules Ready:');
  console.log('  - MatingCall: Soul-deep intimacy with consent');
  console.log('  - FlirtationVoice: Prosody control for voice');
  console.log('  - EnhancedGossip: Social network intelligence');
  console.log('  - InteractionSummaries: Timeline & memory');
  console.log('');
  process.exit(0);
}
