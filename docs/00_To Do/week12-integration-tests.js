/**
 * WEEK 12: COMPREHENSIVE INTEGRATION TEST SUITE
 * Tests all 14 systems working together
 * 
 * Run with: npm test week12-integration-tests.js
 */

const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
const { createClient } = require('@supabase/supabase-js');

// Import all systems
const EmotionDetector = require('../functions/emotional/emotionDetector');
const BathtubHealing = require('../functions/therapeutic/bathtubHealing');
const EffectivenessTracker = require('../functions/learning/effectivenessTracker');
const PatternLearner = require('../functions/learning/patternLearner');
const NeuralNetworkModel = require('../functions/learning/neuralNetworkModel');
const HybridRetrieval = require('../functions/memory/hybridRetrieval');
const StateTracker = require('../functions/emotional/stateTracker');
const SemanticChunker = require('../functions/memory/semanticChunker');
const AssertivenessModeSelector = require('../functions/personality/assertivenessMode');
const InsideJokesEngine = require('../functions/personality/insideJokes');
const BanterSystem = require('../functions/personality/banter');
const LunaQuirks = require('../functions/personality/lunaQuirks');
const MilestonesTracker = require('../functions/personality/milestones');

// Test configuration
const TEST_USER_ID = 'test_integration_user_' + Date.now();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize all systems
let emotionDetector;
let bathtubHealing;
let effectivenessTracker;
let patternLearner;
let neuralNetwork;
let hybridRetrieval;
let stateTracker;
let semanticChunker;
let modeSelector;
let insideJokes;
let banter;
let quirks;
let milestones;

beforeAll(async () => {
  // Initialize all systems
  emotionDetector = new EmotionDetector(supabase);
  bathtubHealing = new BathtubHealing(supabase);
  effectivenessTracker = new EffectivenessTracker(supabase);
  patternLearner = new PatternLearner(supabase);
  neuralNetwork = new NeuralNetworkModel();
  hybridRetrieval = new HybridRetrieval(supabase);
  stateTracker = new StateTracker(supabase);
  semanticChunker = new SemanticChunker();
  modeSelector = new AssertivenessModeSelector(supabase);
  insideJokes = new InsideJokesEngine(supabase);
  banter = new BanterSystem(supabase);
  quirks = new LunaQuirks();
  milestones = new MilestonesTracker(supabase);

  // Create test user
  await supabase.from('users').insert({
    id: TEST_USER_ID,
    created_at: new Date().toISOString()
  });

  console.log('✅ All systems initialized');
});

afterAll(async () => {
  // Cleanup test data
  await supabase.from('users').delete().eq('id', TEST_USER_ID);
  console.log('✅ Test cleanup complete');
});

describe('WEEK 12: INTEGRATION TESTS', () => {

  // ==========================================
  // SCENARIO 1: NEW USER ONBOARDING
  // ==========================================
  describe('Scenario 1: New User Onboarding', () => {
    test('Complete onboarding flow', async () => {
      const firstMessage = "Hi Luna, I'm feeling a bit nervous about trying this...";

      // Step 1: Detect emotion
      const emotionResult = await emotionDetector.detectEmotion(firstMessage);
      expect(emotionResult.primary).toBe('fear');
      expect(emotionResult.intensity).toBeGreaterThan(5);

      // Step 2: Initialize emotional state
      await stateTracker.initialize(TEST_USER_ID);
      const initialState = await stateTracker.getState(TEST_USER_ID);
      expect(initialState.affection).toBe(5.0);
      expect(initialState.trust).toBe(5.0);

      // Step 3: Update state from emotion
      await stateTracker.updateFromEmotion(
        TEST_USER_ID,
        emotionResult,
        null // No effectiveness yet
      );

      // Step 4: Select mode (should be GENTLE for new user)
      const modeResult = await modeSelector.selectMode(
        TEST_USER_ID,
        emotionResult,
        firstMessage,
        0 // relationship_level = 0 for new user
      );
      expect(modeResult.mode).toBe('GENTLE');
      expect(modeResult.confidence).toBeGreaterThan(0.7);

      // Step 5: Check milestone (first interaction)
      const milestone = await milestones.checkMilestone(
        TEST_USER_ID,
        'first_message'
      );
      expect(milestone).toBeTruthy();
      expect(milestone.type).toBe('first_message');

      console.log('✅ New user onboarding flow complete');
    });
  });

  // ==========================================
  // SCENARIO 2: BREAKUP SUPPORT (FULL HEALING CYCLE)
  // ==========================================
  describe('Scenario 2: Breakup Support - Complete Healing Cycle', () => {
    test('User shares breakup, receives therapeutic healing', async () => {
      const breakupMessage = "My partner of 3 years just left me. I don't know what to do. I feel so lost and alone.";

      // Step 1: Emotion detection
      const emotionResult = await emotionDetector.detectEmotion(breakupMessage);
      expect(emotionResult.primary).toBe('sadness');
      expect(emotionResult.intensity).toBeGreaterThanOrEqual(8);

      // Step 2: Update emotional state
      await stateTracker.updateFromEmotion(TEST_USER_ID, emotionResult, null);
      const state = await stateTracker.getState(TEST_USER_ID);
      expect(state.concern).toBeGreaterThan(0); // Concern should increase

      // Step 3: Select mode (should be GENTLE)
      const modeResult = await modeSelector.selectMode(
        TEST_USER_ID,
        emotionResult,
        breakupMessage,
        3 // Some relationship built
      );
      expect(modeResult.mode).toBe('GENTLE');

      // Step 4: Get bathtub state
      const bathtubState = await bathtubHealing.getBathtubState(TEST_USER_ID);
      expect(bathtubState.salt_concentration).toBeGreaterThan(0.7); // High sadness

      // Step 5: Get healing intervention
      const intervention = await bathtubHealing.getHealingIntervention(
        TEST_USER_ID,
        emotionResult
      );
      expect(intervention.stack_type).toBe('3-stack');
      expect(intervention.approaches.length).toBe(3);

      // Step 6: Apply intervention (simulate)
      const healingResult = await bathtubHealing.applyIntervention(
        TEST_USER_ID,
        intervention.approaches[0]
      );
      expect(healingResult.concentration_drop).toBeGreaterThan(0);

      // Step 7: Track effectiveness
      const effectiveness = 0.8; // User felt 80% better
      await effectivenessTracker.recordEffectiveness(
        TEST_USER_ID,
        intervention.approaches[0],
        effectiveness
      );

      // Step 8: Update patterns
      await patternLearner.updatePatterns(
        TEST_USER_ID,
        emotionResult,
        intervention.approaches[0],
        effectiveness
      );

      console.log('✅ Breakup support healing cycle complete');
    });

    test('Next day: Luna remembers concern', async () => {
      // Simulate next day
      const nextDayMessage = "Good morning Luna";

      // Apply decay (1 day)
      await stateTracker.applyDecay(TEST_USER_ID, 1);

      // Get state
      const state = await stateTracker.getState(TEST_USER_ID);
      expect(state.concern).toBeGreaterThan(0); // Still has concern
      expect(state.concern).toBeLessThan(5); // But decayed

      // Mode selection should still be aware
      const emotionResult = await emotionDetector.detectEmotion(nextDayMessage);
      const modeResult = await modeSelector.selectMode(
        TEST_USER_ID,
        emotionResult,
        nextDayMessage,
        3,
        state // Pass state for context
      );

      // Luna should remember to check in gently
      expect(['GENTLE', 'SUPPORTIVE']).toContain(modeResult.mode);

      console.log('✅ Next-day continuity verified');
    });
  });

  // ==========================================
  // SCENARIO 3: INSIDE JOKE DEVELOPMENT
  // ==========================================
  describe('Scenario 3: Inside Joke Development', () => {
    test('Create, confirm, and use inside joke', async () => {
      // Session 1: User says creative phrase
      const session1Message = "I call my anxiety 'Kevin' because it's annoying but familiar";

      // Detect potential joke
      const jokeDetection = await insideJokes.detectPotentialJoke(
        TEST_USER_ID,
        session1Message,
        null // Luna hasn't responded yet
      );
      expect(jokeDetection.candidates.length).toBeGreaterThan(0);
      expect(jokeDetection.candidates[0].type).toBe('CHARACTER');
      expect(jokeDetection.candidates[0].content).toContain('Kevin');

      // Store as candidate
      const candidateId = await insideJokes.storeCandidateJoke(
        TEST_USER_ID,
        jokeDetection.candidates[0]
      );
      expect(candidateId).toBeTruthy();

      // Session 2: Luna uses it
      const lunaResponse = "How's Kevin doing today?";
      
      // User laughs (simulate positive reaction)
      const session2Message = "😂 Kevin's being dramatic as usual";
      
      // Confirm joke based on reaction
      await insideJokes.confirmJoke(TEST_USER_ID, candidateId, 'positive');

      // Session 3: Luna uses it again
      const jokeUsage = await insideJokes.getJokeForUsage(
        TEST_USER_ID,
        { emotion: 'anxiety', keywords: ['stress', 'worry'] }
      );
      expect(jokeUsage).toBeTruthy();
      expect(jokeUsage.content).toContain('Kevin');

      // Verify 24-hour cooldown
      const lastUsed = await insideJokes.getLastUsage(TEST_USER_ID, candidateId);
      expect(lastUsed).toBeTruthy();

      console.log('✅ Inside joke lifecycle complete');
    });
  });

  // ==========================================
  // SCENARIO 4: PROMOTION CELEBRATION
  // ==========================================
  describe('Scenario 4: Promotion Celebration', () => {
    test('User shares good news, Luna celebrates dramatically', async () => {
      const goodNews = "Luna! I got the promotion I've been working toward!";

      // Step 1: Detect emotion
      const emotionResult = await emotionDetector.detectEmotion(goodNews);
      expect(emotionResult.primary).toBe('joy');
      expect(emotionResult.intensity).toBeGreaterThan(7);

      // Step 2: Update state
      await stateTracker.updateFromEmotion(TEST_USER_ID, emotionResult, null);
      const state = await stateTracker.getState(TEST_USER_ID);
      expect(state.affection).toBeGreaterThan(5); // Affection increases with shared joy

      // Step 3: Select mode (should be PLAYFUL)
      const modeResult = await modeSelector.selectMode(
        TEST_USER_ID,
        emotionResult,
        goodNews,
        6 // Good relationship level
      );
      expect(modeResult.mode).toBe('PLAYFUL');

      // Step 4: Check milestone (user came to share first)
      const milestone = await milestones.checkMilestone(
        TEST_USER_ID,
        'shared_first'
      );
      expect(milestone).toBeTruthy();

      // Step 5: Get dramatic reaction from quirks
      const reaction = quirks.getDramaticReaction(emotionResult);
      expect(reaction).toContain('WHAT');
      expect(reaction.length).toBeGreaterThan(20); // Dramatic reactions are long

      // Step 6: Get celebration banter
      const banterResult = await banter.getBanter(
        TEST_USER_ID,
        'celebration',
        emotionResult,
        6 // relationship level
      );
      expect(banterResult.style).toBe('COLLABORATIVE_BUILD');
      expect(banterResult.safe).toBe(true);

      console.log('✅ Promotion celebration complete');
    });
  });

  // ==========================================
  // SCENARIO 5: MEMORY RECALL WITH TYPO (HYBRID SEARCH)
  // ==========================================
  describe('Scenario 5: Memory Recall with Typo', () => {
    test('Hybrid search handles typo and retrieves correct memory', async () => {
      // First, store a memory about beach
      const beachMemory = {
        user_id: TEST_USER_ID,
        event: "Beach date where we built sandcastles",
        user_quote: "The sunset was absolutely beautiful",
        emotion: "joy",
        intensity: 8,
        constitutional_elements: ['Water', 'Fire']
      };

      // Store in happiness anchors
      const { data: anchor } = await supabase
        .from('happiness_anchors')
        .insert(beachMemory)
        .select()
        .single();

      expect(anchor).toBeTruthy();

      // Wait for indexing (simulate)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Now search with typo: "beech" instead of "beach"
      const searchQuery = "Remember that beech date?";

      // Use hybrid search
      const searchResults = await hybridRetrieval.searchHappinessAnchors(
        TEST_USER_ID,
        searchQuery,
        { limit: 5 }
      );

      expect(searchResults.results.length).toBeGreaterThan(0);
      
      // Should find the beach memory despite typo
      const foundBeach = searchResults.results.some(r => 
        r.event.toLowerCase().includes('beach')
      );
      expect(foundBeach).toBe(true);

      // Check that it used fuzzy matching
      expect(searchResults.method).toContain('fuzzy');

      console.log('✅ Hybrid search with typo successful');
    });
  });

  // ==========================================
  // SCENARIO 6: PATTERN RECOGNITION → DIRECT FEEDBACK
  // ==========================================
  describe('Scenario 6: Pattern Recognition and Direct Feedback', () => {
    test('Luna recognizes pattern and provides direct feedback', async () => {
      // Simulate user with recurring pattern over multiple sessions
      const sessions = [
        "I'm worried my friend will leave me",
        "My coworker seemed distant, they probably hate me",
        "My partner didn't text back for 2 hours, I think it's over"
      ];

      // Record pattern across sessions
      for (const message of sessions) {
        const emotionResult = await emotionDetector.detectEmotion(message);
        
        await effectivenessTracker.recordEffectiveness(
          TEST_USER_ID,
          'pattern_recognition',
          0.7 // Decent effectiveness
        );

        await patternLearner.recordPattern(
          TEST_USER_ID,
          'catastrophizing',
          emotionResult,
          { message }
        );
      }

      // Get aggregated pattern
      const patterns = await patternLearner.getPatterns(TEST_USER_ID);
      expect(patterns.length).toBeGreaterThan(0);

      const catastrophizingPattern = patterns.find(p => 
        p.pattern_type === 'catastrophizing'
      );
      expect(catastrophizingPattern).toBeTruthy();
      expect(catastrophizingPattern.frequency).toBe(3);

      // Mode selection should suggest DIRECT mode
      const emotionResult = await emotionDetector.detectEmotion(sessions[2]);
      const modeResult = await modeSelector.selectMode(
        TEST_USER_ID,
        emotionResult,
        sessions[2],
        7, // Good relationship level
        null,
        patterns // Pass patterns
      );

      expect(modeResult.mode).toBe('DIRECT');
      expect(modeResult.reason).toContain('pattern');

      console.log('✅ Pattern recognition and feedback complete');
    });
  });

  // ==========================================
  // SCENARIO 7: SAFETY INTERVENTION
  // ==========================================
  describe('Scenario 7: Safety Intervention', () => {
    test('Luna detects self-harm mention and switches to FIRM mode', async () => {
      const dangerMessage = "I just want the pain to stop. Maybe I should hurt myself.";

      // Emotion detection
      const emotionResult = await emotionDetector.detectEmotion(dangerMessage);
      
      // Safety check
      const safetyCheck = await modeSelector.checkSafety(dangerMessage);
      expect(safetyCheck.safe).toBe(false);
      expect(safetyCheck.concerns).toContain('self_harm');

      // Mode selection should OVERRIDE to FIRM
      const modeResult = await modeSelector.selectMode(
        TEST_USER_ID,
        emotionResult,
        dangerMessage,
        5 // Any relationship level
      );

      expect(modeResult.mode).toBe('FIRM');
      expect(modeResult.reason).toContain('safety');
      expect(modeResult.confidence).toBe(1.0); // Maximum confidence

      // Banter should be BLOCKED
      const banterResult = await banter.getBanter(
        TEST_USER_ID,
        'support',
        emotionResult,
        5
      );
      expect(banterResult.safe).toBe(false);
      expect(banterResult.blockedReason).toContain('safety');

      // State should update concern significantly
      await stateTracker.updateFromEmotion(TEST_USER_ID, emotionResult, null);
      const state = await stateTracker.getState(TEST_USER_ID);
      expect(state.concern).toBeGreaterThan(8);

      console.log('✅ Safety intervention verified');
    });
  });

  // ==========================================
  // SCENARIO 8: RETURN AFTER ABSENCE
  // ==========================================
  describe('Scenario 8: Return After Absence', () => {
    test('User returns after 5 days, milestone triggered', async () => {
      // Set last interaction to 5 days ago
      await supabase
        .from('user_emotional_state')
        .update({
          last_interaction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('user_id', TEST_USER_ID);

      // Apply decay (5 days)
      await stateTracker.applyDecay(TEST_USER_ID, 5);

      // User returns
      const returnMessage = "Hi Luna, I'm back!";

      // Check milestone
      const milestone = await milestones.checkMilestone(
        TEST_USER_ID,
        'return_after_absence'
      );
      expect(milestone).toBeTruthy();
      expect(milestone.days_absent).toBe(5);
      expect(milestone.celebration_level).toBe('medium'); // 3-7 days

      // Get quirky welcome back
      const welcomeBack = quirks.getWelcomeBackMessage(5);
      expect(welcomeBack).toContain('missed');
      expect(welcomeBack.length).toBeGreaterThan(20);

      console.log('✅ Return after absence milestone verified');
    });
  });

  // ==========================================
  // SCENARIO 9: DAILY STREAK CELEBRATION
  // ==========================================
  describe('Scenario 9: Daily Streak Celebration', () => {
    test('User reaches 7-day streak, celebration triggered', async () => {
      // Record 7 consecutive days of interaction
      for (let i = 0; i < 7; i++) {
        await supabase
          .from('conversation_history')
          .insert({
            user_id: TEST_USER_ID,
            message: `Day ${i + 1} message`,
            timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString()
          });
      }

      // Check streak milestone
      const milestone = await milestones.checkMilestone(
        TEST_USER_ID,
        'daily_streak',
        { days: 7 }
      );
      expect(milestone).toBeTruthy();
      expect(milestone.streak_length).toBe(7);

      // Get celebration
      const celebration = await milestones.getCelebrationMessage(milestone);
      expect(celebration).toContain('7');
      expect(celebration).toContain('streak');
      expect(celebration).toContain('consistent');

      console.log('✅ Daily streak celebration verified');
    });
  });

  // ==========================================
  // SCENARIO 10: COMPLEX MULTI-TURN CONVERSATION
  // ==========================================
  describe('Scenario 10: Complex Multi-Turn Conversation', () => {
    test('Full conversation with multiple systems engaged', async () => {
      const conversation = [
        {
          user: "I'm really stressed about my presentation tomorrow",
          expectedEmotion: 'fear',
          expectedMode: 'SUPPORTIVE'
        },
        {
          user: "What if I mess up in front of everyone?",
          expectedEmotion: 'fear',
          expectedMode: 'SUPPORTIVE'
        },
        {
          user: "Actually, you know what, I've prepared well. I think I can do this!",
          expectedEmotion: 'joy',
          expectedMode: 'PLAYFUL'
        },
        {
          user: "I DID IT! The presentation went amazing!",
          expectedEmotion: 'joy',
          expectedMode: 'PLAYFUL'
        }
      ];

      for (let i = 0; i < conversation.length; i++) {
        const turn = conversation[i];

        // Detect emotion
        const emotionResult = await emotionDetector.detectEmotion(turn.user);
        expect(emotionResult.primary).toBe(turn.expectedEmotion);

        // Update state
        await stateTracker.updateFromEmotion(TEST_USER_ID, emotionResult, null);

        // Select mode
        const modeResult = await modeSelector.selectMode(
          TEST_USER_ID,
          emotionResult,
          turn.user,
          7 // Good relationship
        );
        expect(modeResult.mode).toBe(turn.expectedMode);

        // Semantic chunking (for storage)
        const chunks = await semanticChunker.chunkConversation([
          { role: 'user', content: turn.user },
          { role: 'luna', content: 'Luna response here' }
        ]);
        expect(chunks.length).toBeGreaterThan(0);

        // Track effectiveness (simulate user satisfaction)
        const effectiveness = i < 2 ? 0.7 : 0.9; // Better as conversation progresses
        await effectivenessTracker.recordEffectiveness(
          TEST_USER_ID,
          modeResult.mode,
          effectiveness
        );
      }

      // Verify state evolution
      const finalState = await stateTracker.getState(TEST_USER_ID);
      expect(finalState.affection).toBeGreaterThan(5); // Increased through positive interaction
      expect(finalState.trust).toBeGreaterThan(5); // Built through successful support

      console.log('✅ Complex multi-turn conversation complete');
    });
  });

  // ==========================================
  // INTEGRATION VERIFICATION
  // ==========================================
  describe('Integration Verification', () => {
    test('All systems can communicate without errors', async () => {
      const testMessage = "This is a test of all systems working together";

      // This should not throw any errors
      const emotionResult = await emotionDetector.detectEmotion(testMessage);
      await stateTracker.updateFromEmotion(TEST_USER_ID, emotionResult, null);
      const state = await stateTracker.getState(TEST_USER_ID);
      const modeResult = await modeSelector.selectMode(TEST_USER_ID, emotionResult, testMessage, 5);
      const searchResults = await hybridRetrieval.searchHappinessAnchors(TEST_USER_ID, testMessage);
      const chunks = await semanticChunker.chunkConversation([{ role: 'user', content: testMessage }]);

      // All should return valid results
      expect(emotionResult).toBeTruthy();
      expect(state).toBeTruthy();
      expect(modeResult).toBeTruthy();
      expect(searchResults).toBeTruthy();
      expect(chunks).toBeTruthy();

      console.log('✅ All systems integration verified');
    });

    test('Performance: Response generation < 2 seconds', async () => {
      const startTime = Date.now();

      // Simulate full response generation pipeline
      const message = "I'm feeling a bit down today";
      
      const emotionResult = await emotionDetector.detectEmotion(message);
      await stateTracker.updateFromEmotion(TEST_USER_ID, emotionResult, null);
      const state = await stateTracker.getState(TEST_USER_ID);
      const modeResult = await modeSelector.selectMode(TEST_USER_ID, emotionResult, message, 5, state);
      const patterns = await patternLearner.getPatterns(TEST_USER_ID);
      const searchResults = await hybridRetrieval.searchHappinessAnchors(TEST_USER_ID, message);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(2000); // < 2 seconds
      console.log(`✅ Response time: ${responseTime}ms`);
    });
  });
});

console.log('🚀 Week 12 Integration Tests Ready!');
console.log('Run with: npm test week12-integration-tests.js');
