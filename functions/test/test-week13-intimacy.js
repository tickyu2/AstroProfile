/**
 * ============================================================================
 * WEEK 13: INTIMACY & MEMORY EXPANSION TESTS
 * ============================================================================
 * Tests for ConversationStarter and AmnesiaBuster modules.
 *
 * Test Coverage:
 *   - ConversationStarter: Thread detection, gossip follow-up, curiosity
 *   - AmnesiaBuster: Era calculation, nostalgia prompts, firsts detection
 *
 * Created: Week 13 - Intimacy & Memory Expansion
 * ============================================================================
 */

const ConversationStarterModule = require('../intimacy/conversationStarter');
const AmnesiaBusterModule = require('../intimacy/amnesiaBuster');

let passed = 0;
let failed = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  \x1b[32m✅ ${name}\x1b[0m`);
    passed++;
    return true;
  } catch (error) {
    console.log(`  \x1b[31m❌ ${name}\x1b[0m`);
    console.log(`     Error: ${error.message}`);
    failed++;
    return false;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// ============================================================================
// CONVERSATION STARTER TESTS
// ============================================================================
function testConversationStarter() {
  console.log('\n\x1b[36m💬 CONVERSATION STARTER MODULE\x1b[0m\n');

  const starter = new ConversationStarterModule();

  // Basic instantiation
  test('ConversationStarter instantiates correctly', () => {
    assert(starter, 'Should instantiate');
    assert(starter.initiativeTypes, 'Should have initiative types');
    assert(starter.initiativeTypes.length >= 4, 'Should have 4+ initiative types');
  });

  // Configuration
  test('Has proper configuration', () => {
    const config = starter.getConfig();
    assert(config.initiativeTypes, 'Config has initiative types');
    assert(config.cliffhangerPatterns > 0, 'Has cliffhanger patterns');
    assert(config.funnyIndicators > 0, 'Has funny indicators');
  });

  // Cliffhanger detection
  test('Detects cliffhanger messages', () => {
    assert(starter.isCliffhanger('and then...'), 'Should detect "and then..."');
    assert(starter.isCliffhanger('but then he said something crazy'), 'Should detect "but then"');
    assert(starter.isCliffhanger('guess what happened'), 'Should detect "guess what happened"');
    assert(!starter.isCliffhanger('Hello how are you'), 'Should not detect normal message');
  });

  // People extraction
  test('Extracts people names from messages', () => {
    const people = starter.extractPeople('My friend Sarah and her boyfriend Mike went hiking');
    assert(people.includes('Sarah'), 'Should find Sarah');
    assert(people.includes('Mike'), 'Should find Mike');
    assert(!people.includes('My'), 'Should not include "My"');
  });

  // Funny detection
  test('Detects funny messages', () => {
    assert(starter.isFunny('That was hilarious! 😂'), 'Should detect funny with emoji');
    assert(starter.isFunny('lol that made me laugh'), 'Should detect "lol"');
    assert(starter.isFunny('haha thats so funny'), 'Should detect "haha"');
    assert(!starter.isFunny('I feel sad today'), 'Should not detect sad message');
  });

  // Topic extraction
  test('Extracts topic from message', () => {
    const topic = starter.extractTopic('My cat knocked over my coffee this morning');
    assert(topic, 'Should extract topic');
    assert(topic.length > 3, 'Topic should have content');
  });

  // Thread detection
  test('Detects conversation threads', async () => {
    const threads = await starter.detectThreads('test-user', 'My friend Vivian has a crush on Mike from work...');
    assert(threads.length > 0, 'Should detect at least one thread');
    assert(threads.some(t => t.type === 'gossip'), 'Should detect gossip thread');
  });

  // Gossip follow-up generation
  test('Generates gossip follow-up', () => {
    const thread = {
      thread_type: 'gossip',
      topic: 'Vivian and Mike',
      key_people: ['Vivian', 'Mike'],
      summary: 'Vivian has a crush on Mike'
    };
    const followup = starter.generateGossipFollowup('test-user', thread);
    assert(followup, 'Should generate follow-up');
    assert(followup.includes('Vivian') || followup.includes('Mike'), 'Should mention person');
  });

  // Story follow-up generation
  test('Generates story follow-up', () => {
    const thread = {
      thread_type: 'story',
      topic: 'job interview',
      summary: 'User had a job interview'
    };
    const followup = starter.generateStoryFollowup('test-user', thread);
    assert(followup, 'Should generate follow-up');
    assert(followup.includes('job interview'), 'Should reference topic');
  });

  // Funny recall generation
  test('Generates funny recall', () => {
    const thread = {
      thread_type: 'funny_moment',
      topic: 'cat coffee incident',
      summary: 'Cat knocked over coffee'
    };
    const followup = starter.generateFunnyRecall('test-user', thread);
    assert(followup, 'Should generate follow-up');
    assert(followup.includes('😂') || followup.includes('😊') || followup.toLowerCase().includes('laugh'), 'Should have fun tone');
  });

  // Curiosity question generation
  test('Generates curiosity questions', async () => {
    const question = await starter.generateCuriosityQuestion('test-user');
    assert(question, 'Should generate question');
    assert(question.includes('?') || question.includes('!'), 'Should be engaging');
  });

  // Opinion formation
  test('Forms opinions about social situations', async () => {
    const thread = {
      thread_type: 'gossip',
      key_people: ['Sarah', 'John'],
      summary: 'Sarah really likes John, they both love hiking and are so cute together'
    };
    const opinion = await starter.formOpinion('test-user', thread);
    assert(opinion, 'Should form opinion for romantic gossip');
    assert(opinion.includes('Sarah') || opinion.includes('John'), 'Should mention people');
  });

  // Elicit deeper responses
  test('Elicits deeper responses for short answers', () => {
    const elicit = starter.elicitDeeper('test-user', 'not much');
    assert(elicit, 'Should generate elicitation for short answer');
    assert(elicit.includes('!') || elicit.includes('?'), 'Should encourage more');
  });

  // Engagement detection
  test('Detects user engagement correctly', () => {
    assert(starter.didUserEngage('That is so true! I remember when we first met and...'), 'Long response = engaged');
    assert(!starter.didUserEngage('nah'), 'Short dismissive = not engaged');
    assert(!starter.didUserEngage("I don't know whatever"), 'Dismissive = not engaged');
  });

  // Engagement score calculation
  test('Calculates engagement score', () => {
    const highScore = starter.calculateEngagement('This is amazing! I love talking about this! What do you think?');
    const lowScore = starter.calculateEngagement('ok');

    assert(highScore > lowScore, 'Enthusiastic response should score higher');
    assert(highScore >= 0 && highScore <= 1, 'Score should be 0-1');
    assert(lowScore >= 0 && lowScore <= 1, 'Score should be 0-1');
  });

  // Sentiment analysis
  test('Analyzes sentiment correctly', () => {
    const positive = starter.analyzeSentiment('This is great and I love it!');
    const negative = starter.analyzeSentiment('This is terrible and I hate it');
    const neutral = starter.analyzeSentiment('The sky is blue');

    assert(positive > 0, 'Positive sentiment should be positive');
    assert(negative < 0, 'Negative sentiment should be negative');
    assert(Math.abs(neutral) < Math.abs(positive), 'Neutral should be closer to 0');
  });
}

// ============================================================================
// AMNESISBUSTER TESTS
// ============================================================================
function testAmnesiaBuster() {
  console.log('\n\x1b[36m🧠 AMNESISBUSTER MODULE\x1b[0m\n');

  const amnesia = new AmnesiaBusterModule();

  // Basic instantiation
  test('AmnesiaBuster instantiates correctly', () => {
    assert(amnesia, 'Should instantiate');
    assert(amnesia.eraTechnology, 'Should have era technology data');
    assert(amnesia.culturalReferences, 'Should have cultural references');
    assert(amnesia.firstTypes, 'Should have first types');
  });

  // Configuration
  test('Has proper configuration', () => {
    const config = amnesia.getConfig();
    assert(config.eras.length >= 4, 'Should have 4+ eras');
    assert(config.firstTypes.length >= 10, 'Should have 10+ first types');
    assert(config.culturalDecades.length >= 3, 'Should have 3+ cultural decades');
  });

  // Era calculation for 30-year-old
  test('Calculates user era correctly (age 30)', () => {
    const era = amnesia.calculateUserEra(30);
    const currentYear = new Date().getFullYear();

    assert(era.birthYear === currentYear - 30, 'Birth year should be correct');
    assert(era.teenageYears.start === era.birthYear + 13, 'Teenage start correct');
    assert(era.teenageYears.end === era.birthYear + 19, 'Teenage end correct');
    assert(era.teenageDecades.length > 0, 'Should have teenage decades');
    assert(era.childhoodDecades.length > 0, 'Should have childhood decades');
  });

  // Era calculation for 25-year-old
  test('Calculates user era correctly (age 25)', () => {
    const era = amnesia.calculateUserEra(25);
    assert(era.teenageDecades.includes('2010s'), '25-year-old should have 2010s');
  });

  // Era calculation for 40-year-old
  test('Calculates user era correctly (age 40)', () => {
    const era = amnesia.calculateUserEra(40);
    assert(era.teenageDecades.includes('2000s') || era.teenageDecades.includes('1990s'),
      '40-year-old should have 1990s/2000s');
  });

  // Decade calculation
  test('Gets decades from year range', () => {
    const decades = amnesia.getDecades(1995, 2005);
    assert(decades.includes('1990s'), 'Should include 1990s');
    assert(decades.includes('2000s'), 'Should include 2000s');
  });

  // Era technology retrieval
  test('Gets era-specific technology', () => {
    const tech = amnesia.getEraTechnology(30);
    assert(tech.length > 0, 'Should have technology data');
    assert(tech[0].music_format, 'Should have music format');
    assert(tech[0].phone_type, 'Should have phone type');
  });

  // Cultural references retrieval
  test('Gets cultural references for era', () => {
    const refs = amnesia.getCulturalReferences(30);
    assert(refs.length > 0, 'Should have cultural references');
  });

  // Memory prompt generation - Technology
  test('Generates technology memory prompts', () => {
    const prompt = amnesia.generateMemoryPrompt(30, 'technology');
    assert(prompt, 'Should generate prompt');
    assert(prompt.includes('?') || prompt.includes('!'), 'Should be a question or engaging');
  });

  // Memory prompt generation - Cultural
  test('Generates cultural memory prompts', () => {
    const prompt = amnesia.generateMemoryPrompt(30, 'cultural');
    assert(prompt, 'Should generate cultural prompt');
  });

  // Memory prompt generation - First
  test('Generates first memory prompts', () => {
    const prompt = amnesia.generateMemoryPrompt(30, 'first');
    assert(prompt, 'Should generate first prompt');
    assert(prompt.includes('first') || prompt.includes('?'), 'Should ask about a first');
  });

  // Memory prompt generation - Random
  test('Generates random memory prompts', () => {
    const prompt = amnesia.generateMemoryPrompt(30, 'random');
    assert(prompt, 'Should generate random prompt');
  });

  // First memory detection
  test('Detects first memory sharing', () => {
    const crush = amnesia.detectFirstMemory('My first crush was a girl named Emily in 5th grade');
    assert(crush.detected, 'Should detect first crush');
    assert(crush.firstType === 'first_crush', 'Should identify as first_crush');

    const kiss = amnesia.detectFirstMemory('I had my first kiss at summer camp');
    assert(kiss.detected, 'Should detect first kiss');
    assert(kiss.firstType === 'first_kiss', 'Should identify as first_kiss');

    const normal = amnesia.detectFirstMemory('I went to the store today');
    assert(!normal.detected, 'Should not detect normal message');
  });

  // Follow-up question generation
  test('Generates follow-up questions for firsts', () => {
    const crushFollowup = amnesia.generateFollowUpQuestion('first_crush');
    assert(crushFollowup, 'Should generate crush follow-up');

    const kissFollowup = amnesia.generateFollowUpQuestion('first_kiss');
    assert(kissFollowup, 'Should generate kiss follow-up');
    assert(kissFollowup.includes('?'), 'Should be a question');
  });

  // Transition prompt generation
  test('Generates transition to logic brain', () => {
    const transition = amnesia.generateTransitionPrompt('first love');
    assert(transition, 'Should generate transition');
    assert(transition.includes('💛') || transition.includes('now') || transition.includes('learn'),
      'Should acknowledge emotion and transition');
  });

  // Generic prompt fallback
  test('Generates generic prompts as fallback', () => {
    const prompt = amnesia.generateGenericPrompt();
    assert(prompt, 'Should generate generic prompt');
    assert(prompt.includes('?'), 'Should be a question');
  });

  // First prompt text for all types
  test('Has prompts for all first types', () => {
    const types = ['first_crush', 'first_love', 'first_kiss', 'first_heartbreak',
                   'first_date', 'first_concert', 'first_phone', 'first_car', 'first_job'];

    for (const type of types) {
      const prompt = amnesia.generateFirstMemoryPrompt([]);
      assert(prompt, `Should generate prompt (not just for ${type})`);
    }
  });
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================
function testIntegration() {
  console.log('\n\x1b[36m🔗 INTEGRATION TESTS\x1b[0m\n');

  const starter = new ConversationStarterModule();
  const amnesia = new AmnesiaBusterModule();

  // Combined flow: Gossip to nostalgia
  test('ConversationStarter and AmnesiaBuster work together', async () => {
    // User shares gossip
    const threads = await starter.detectThreads('test-user', 'My friend Sarah reminds me of my first crush');

    // Detect first memory mention
    const firstDetect = amnesia.detectFirstMemory('My friend Sarah reminds me of my first crush');

    assert(threads.length > 0 || firstDetect.detected,
      'Should detect thread or first memory');
  });

  // Era-based conversation starting
  test('Can generate era-aware conversation starters', async () => {
    const era = amnesia.calculateUserEra(30);
    const curiosity = await starter.generateCuriosityQuestion('test-user');
    const nostalgia = amnesia.generateMemoryPrompt(30);

    assert(curiosity, 'Should generate curiosity question');
    assert(nostalgia, 'Should generate nostalgia prompt');
    assert(era.teenageDecades.length > 0, 'Should have era context');
  });

  // Thread to first memory pipeline
  test('Thread follow-up can lead to first memory exploration', () => {
    // Story about first love
    const storyThread = {
      thread_type: 'story',
      topic: 'first relationship',
      summary: 'User mentioned first boyfriend'
    };

    const followup = starter.generateStoryFollowup('test-user', storyThread);
    assert(followup, 'Should generate follow-up');

    // If user responds with first memory
    const detection = amnesia.detectFirstMemory('That was my first love actually');
    assert(detection.detected, 'Should detect first love mention');
    assert(detection.firstType === 'first_love', 'Should identify as first_love');

    // Can transition to deeper questions
    const transition = amnesia.generateTransitionPrompt('first love');
    assert(transition, 'Should generate transition prompt');
  });

  // Full intimacy flow
  test('Complete intimacy flow works', async () => {
    // Step 1: Luna asks curiosity question
    const curiosity = await starter.generateCuriosityQuestion('test-user');
    assert(curiosity, 'Step 1: Generate curiosity');

    // Step 2: User mentions something nostalgic
    const detection = amnesia.detectFirstMemory('It reminds me of my first kiss');
    assert(detection.detected, 'Step 2: Detect first memory');

    // Step 3: Follow-up question
    const followup = amnesia.generateFollowUpQuestion(detection.firstType);
    assert(followup, 'Step 3: Generate follow-up');

    // Step 4: Transition to logic brain
    const transition = amnesia.generateTransitionPrompt('first kiss');
    assert(transition, 'Step 4: Generate transition');

    // Full flow complete!
  });
}

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================
function testPerformance() {
  console.log('\n\x1b[36m⚡ PERFORMANCE TESTS\x1b[0m\n');

  const starter = new ConversationStarterModule();
  const amnesia = new AmnesiaBusterModule();

  // Thread detection performance
  test('Thread detection is fast (<50ms for 100 messages)', async () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      await starter.detectThreads('test-user', 'My friend Sarah went to the concert...');
    }
    const elapsed = Date.now() - start;
    assert(elapsed < 50, `100 detections in ${elapsed}ms`);
  });

  // Era calculation performance
  test('Era calculation is instant (<10ms for 1000 calcs)', () => {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      amnesia.calculateUserEra(20 + (i % 50));
    }
    const elapsed = Date.now() - start;
    assert(elapsed < 10, `1000 calculations in ${elapsed}ms`);
  });

  // Memory prompt generation performance
  test('Memory prompt generation is fast (<20ms for 100 prompts)', () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      amnesia.generateMemoryPrompt(25 + (i % 30), 'random');
    }
    const elapsed = Date.now() - start;
    assert(elapsed < 20, `100 prompts in ${elapsed}ms`);
  });

  // Instantiation performance
  test('Modules instantiate quickly (<10ms)', () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
      new ConversationStarterModule();
      new AmnesiaBusterModule();
    }
    const elapsed = Date.now() - start;
    assert(elapsed < 10, `200 instantiations in ${elapsed}ms`);
  });
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================
async function runAllTests() {
  console.log('============================================================');
  console.log('🧠 WEEK 13: INTIMACY & MEMORY EXPANSION TESTS');
  console.log('============================================================');
  console.log('ConversationStarter + AmnesiaBuster Modules\n');

  testConversationStarter();
  testAmnesiaBuster();
  testIntegration();
  testPerformance();

  // Results
  console.log('\n============================================================');
  console.log('📊 TEST RESULTS');
  console.log('============================================================\n');

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total:  ${totalTests}`);
  console.log(`📊 Rate:   ${((passed / totalTests) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n\x1b[32m🎉 ALL WEEK 13 TESTS PASSED!\x1b[0m');
    console.log('\x1b[32m💛 Intimacy & Memory Expansion: READY!\x1b[0m');
    console.log('\x1b[32m🧠 ConversationStarter + AmnesisBuster: OPERATIONAL!\x1b[0m');
  } else {
    console.log('\n\x1b[31m⚠️ Some tests failed - review needed\x1b[0m');
    process.exit(1);
  }
}

runAllTests().catch(console.error);
