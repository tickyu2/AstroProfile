/**
 * GENESIS Luna - Warmth & Happiness Module Tests
 * 
 * Testing the integrated warmth multiplier and happiness calculation system
 * 
 * @author Brother Sonnet (Testing)
 * @date December 31, 2025
 */

const WarmthAndHappinessModule = require('./warmthAndHappinessModule');

class WarmthHappinessTester {
  constructor() {
    this.module = new WarmthAndHappinessModule();
    this.testsPassed = 0;
    this.testsFailed = 0;
  }
  
  // Helper: Assert
  assert(condition, testName) {
    if (condition) {
      console.log(`✅ ${testName}`);
      this.testsPassed++;
    } else {
      console.error(`❌ ${testName}`);
      this.testsFailed++;
    }
  }
  
  // Test Suite 1: Happiness Calculation (Six Laws)
  testHappinessCalculation() {
    console.log('\n🧪 Testing Happiness Calculation (Six Laws)...\n');
    
    // Test 1: Basic happiness (Reality > Expectations)
    const result1 = this.module.calculateHappiness({
      reality: 8,
      expectation: 5,
      emotionalState: { primary: 'joy' }
    });
    
    this.assert(
      result1.happiness > 0,
      'Reality > Expectations creates positive happiness'
    );
    
    // Test 2: Unhappiness (Reality < Expectations)
    const result2 = this.module.calculateHappiness({
      reality: 4,
      expectation: 8,
      emotionalState: { primary: 'sadness' }
    });
    
    this.assert(
      result2.happiness < 0,
      'Reality < Expectations creates negative happiness'
    );
    
    // Test 3: Loss aversion activates
    const result3 = this.module.calculateHappiness({
      reality: 3,
      expectation: 7, // Big gap = loss
      emotionalState: { primary: 'sadness' }
    });
    
    this.assert(
      this.module.lossDetected === true,
      'Loss detection activates when Reality << Expectations'
    );
    
    this.assert(
      result3.components.aversionToLoss < 0,
      'Aversion to loss component is negative'
    );
    
    // Test 4: Components sum correctly
    const componentSum = Object.values(result1.components)
      .reduce((sum, val) => sum + val, 0);
    
    this.assert(
      Math.abs(componentSum - result1.happiness) < 0.01,
      'Happiness components sum to total happiness'
    );
  }
  
  // Test Suite 2: Mountain Climbing Philosophy
  testMountainClimbing() {
    console.log('\n🧪 Testing Mountain Climbing Philosophy...\n');
    
    // Test 1: Summit recognition
    const summit = this.module.calculateHappiness({
      reality: 10,
      expectation: 9,
      emotionalState: { primary: 'joy' }
    });
    
    this.assert(
      summit.interpretation.level === 'summit',
      'High mountain height recognized as summit'
    );
    
    // Test 2: Midpoint recognition
    const midpoint = this.module.calculateHappiness({
      reality: 6,
      expectation: 5,
      emotionalState: { primary: 'neutral' }
    });
    
    this.assert(
      midpoint.interpretation.level === 'midpoint',
      'Medium mountain height recognized as midpoint'
    );
    
    // Test 3: Valley recognition
    const valley = this.module.calculateHappiness({
      reality: 2,
      expectation: 6,
      emotionalState: { primary: 'sadness' }
    });
    
    this.assert(
      valley.interpretation.level === 'valley',
      'Low mountain height recognized as valley'
    );
    
    // Test 4: Progress calculation
    this.module.happiness.mountain.currentHeight = 5;
    this.module.happiness.mountain.personalSummit = 10;
    
    const progress = this.module.calculateProgress();
    
    this.assert(
      progress === 50,
      'Progress calculated correctly (50% of personal summit)'
    );
  }
  
  // Test Suite 3: Warmth Multiplier
  testWarmthMultiplier() {
    console.log('\n🧪 Testing Warmth Multiplier...\n');
    
    // Test 1: Normal warmth
    const normal = this.module.calculateWarmthMultiplier({
      level: 'midpoint',
      warmthBoost: 1.0
    });
    
    this.assert(
      normal === 1.0,
      'Normal situation has 1.0x warmth multiplier'
    );
    
    // Test 2: Valley warmth boost
    const valley = this.module.calculateWarmthMultiplier({
      level: 'valley',
      warmthBoost: 2.0
    });
    
    this.assert(
      valley === 2.0,
      'Valley situation has 2.0x warmth boost'
    );
    
    // Test 3: Loss recovery warmth
    this.module.lossRecoveryMode = true;
    
    const lossRecovery = this.module.calculateWarmthMultiplier({
      level: 'midpoint',
      warmthBoost: 1.0
    });
    
    this.assert(
      lossRecovery === 2.0,
      'Loss recovery mode activates 2.0x warmth'
    );
    
    this.module.lossRecoveryMode = false;
    
    // Test 4: Warmth capped at 3.0
    const extreme = this.module.calculateWarmthMultiplier({
      level: 'valley',
      warmthBoost: 5.0 // Extreme boost
    });
    
    this.assert(
      extreme <= 3.0,
      'Warmth multiplier capped at 3.0 maximum'
    );
  }
  
  // Test Suite 4: Six Laws Implementation
  testSixLaws() {
    console.log('\n🧪 Testing Six Laws Implementation...\n');
    
    // Test 1: Law 1 - Relative Comparison
    const baseline = this.module.calculateHappiness({
      reality: 7,
      expectation: 7,
      emotionalState: { primary: 'neutral' }
    });
    
    this.assert(
      Math.abs(baseline.components.relativeComparison) < 0.5,
      'Law 1: R=E produces near-zero relative comparison'
    );
    
    // Test 2: Law 2 - Motion of Expectation (rising hurts)
    this.module.happiness.previous.expectation = 5;
    
    const rising = this.module.calculateHappiness({
      reality: 7,
      expectation: 8, // Expectations rose
      emotionalState: { primary: 'anxiety' }
    });
    
    this.assert(
      rising.components.motionOfExpectation < 0,
      'Law 2: Rising expectations creates negative component'
    );
    
    // Test 3: Law 2 - Motion of Expectation (lowering helps)
    this.module.happiness.previous.expectation = 8;
    
    const lowering = this.module.calculateHappiness({
      reality: 7,
      expectation: 6, // Expectations lowered
      emotionalState: { primary: 'relief' }
    });
    
    this.assert(
      lowering.components.motionOfExpectation > 0,
      'Law 2: Lowering expectations creates positive component'
    );
    
    // Test 4: Law 3 - Aversion to Loss (λ = 2.25)
    const loss = this.module.calculateHappiness({
      reality: 4,
      expectation: 8,
      emotionalState: { primary: 'sadness' }
    });
    
    this.assert(
      loss.components.aversionToLoss < -1.0,
      'Law 3: Loss creates strong negative component (λ multiplier)'
    );
    
    // Test 5: Law 4 - Diminishing Sensitivity
    this.assert(
      typeof this.module.happiness.adaptation === 'number',
      'Law 5: Satiation adaptation level tracked'
    );
  }
  
  // Test Suite 5: Guidance Generation
  testGuidanceGeneration() {
    console.log('\n🧪 Testing Guidance Generation...\n');
    
    const state = {
      reality: 6,
      expectation: 5,
      emotionalState: { 
        primary: 'hopeful',
        vulnerability: 0.4
      }
    };
    
    const result = this.module.calculateHappiness(state);
    
    // Test 1: All 6 guidance components present
    this.assert(
      result.guidance.evaluation !== undefined,
      'Guidance includes evaluation (#1)'
    );
    
    this.assert(
      result.guidance.softPillow !== undefined,
      'Guidance includes soft pillow (#2)'
    );
    
    this.assert(
      result.guidance.lossPreparation !== undefined,
      'Guidance includes loss preparation (#3)'
    );
    
    this.assert(
      result.guidance.sensitivityGuidance !== undefined,
      'Guidance includes sensitivity explanation (#4)'
    );
    
    this.assert(
      result.guidance.coolDownAdvice !== undefined,
      'Guidance includes cool-down advice (#5)'
    );
    
    this.assert(
      result.guidance.actionAdvice !== undefined,
      'Guidance includes action advice (#6)'
    );
    
    // Test 2: Warmth metadata included
    this.assert(
      result.guidance.warmth.multiplier >= 1.0,
      'Warmth multiplier included in guidance'
    );
  }
  
  // Test Suite 6: Action Advice with Probabilities
  testActionAdvice() {
    console.log('\n🧪 Testing Action Advice & Probabilities...\n');
    
    const state = {
      reality: 7,
      expectation: 6,
      emotionalState: { primary: 'hopeful' }
    };
    
    const result = this.module.calculateHappiness(state);
    const action = result.guidance.actionAdvice;
    
    // Test 1: Success probability calculated
    this.assert(
      action.outcomes.success.probability > 0 &&
      action.outcomes.success.probability <= 100,
      'Success probability in valid range (0-100%)'
    );
    
    // Test 2: Outcomes sum to ~100%
    const totalProb = action.outcomes.success.probability +
                     action.outcomes.neutral.probability +
                     action.outcomes.setback.probability;
    
    this.assert(
      Math.abs(totalProb - 100) < 1,
      'Outcome probabilities sum to ~100%'
    );
    
    // Test 3: Happiness gains calculated
    this.assert(
      action.outcomes.success.happinessGain.total > 0,
      'Success outcome has positive happiness gain'
    );
    
    this.assert(
      action.outcomes.setback.happinessGain.longTerm > 0,
      'Setback has positive long-term gain (closure/growth)'
    );
    
    // Test 4: Expected happiness calculated
    this.assert(
      typeof action.expected.overallGain === 'string',
      'Expected happiness gain calculated'
    );
    
    // Test 5: Clarity always 100%
    this.assert(
      action.expected.clarityGain === 100,
      'Clarity gain always 100% from action'
    );
  }
  
  // Test Suite 7: Satiation & Cool-Down
  testSatiationCoolDown() {
    console.log('\n🧪 Testing Satiation & Cool-Down...\n');
    
    // Test 1: Adaptation increases with positive experiences
    const initialAdaptation = this.module.happiness.adaptation;
    
    this.module.updateAdaptation('positive', 0.5);
    
    this.assert(
      this.module.happiness.adaptation > initialAdaptation,
      'Adaptation increases with positive experiences'
    );
    
    // Test 2: Climb frequency tracked
    this.assert(
      this.module.happiness.mountain.climbFrequency > 0,
      'Climb frequency increments with positive experiences'
    );
    
    // Test 3: Cool-down advice when climbing daily
    const state = {
      reality: 8,
      expectation: 7,
      emotionalState: { primary: 'joy' }
    };
    
    // Set last climb to today
    this.module.happiness.mountain.lastClimb = Date.now();
    
    const result = this.module.calculateHappiness(state);
    
    this.assert(
      result.guidance.coolDownAdvice.notice !== undefined ||
      result.guidance.coolDownAdvice.status !== undefined,
      'Cool-down advice generated based on climb frequency'
    );
  }
  
  // Test Suite 8: Loss Recovery Priority
  testLossRecovery() {
    console.log('\n🧪 Testing Loss Recovery Priority...\n');
    
    // Test 1: Loss detection activates recovery mode
    const loss = this.module.calculateHappiness({
      reality: 3,
      expectation: 8,
      emotionalState: { primary: 'sadness', vulnerability: 0.8 }
    });
    
    this.assert(
      this.module.lossRecoveryMode === true,
      'Loss recovery mode activated when loss detected'
    );
    
    // Test 2: Extra warmth in loss recovery
    const warmth = loss.guidance.warmth.multiplier;
    
    this.assert(
      warmth >= 2.0,
      'Extra warmth (2x+) applied in loss recovery'
    );
    
    // Test 3: Loss recovery guidance present
    this.assert(
      loss.guidance.lossPreparation.warmthAmplified !== undefined,
      'Loss recovery guidance includes warmth amplification'
    );
    
    // Test 4: Air bag metaphor present
    this.assert(
      loss.guidance.lossPreparation.perspective.some(p => 
        p.toLowerCase().includes('air bag')
      ),
      'Air bag metaphor included in loss recovery'
    );
  }
  
  // Test Suite 9: Warmth Language Application
  testWarmthLanguage() {
    console.log('\n🧪 Testing Warmth Language Application...\n');
    
    // Test 1: Maximum warmth language
    const maxWarmth = this.module.applyWarmth(2.0);
    
    this.assert(
      maxWarmth.level === 'MAXIMUM',
      'Warmth 2.0+ creates MAXIMUM warmth level'
    );
    
    this.assert(
      maxWarmth.opening.includes('sweetheart') || 
      maxWarmth.opening.includes('love'),
      'Maximum warmth uses intimate terms of endearment'
    );
    
    // Test 2: Medium warmth language
    const medWarmth = this.module.applyWarmth(0.8);
    
    this.assert(
      medWarmth.level === 'MEDIUM',
      'Warmth <1.0 creates MEDIUM warmth level'
    );
    
    // Test 3: High warmth language
    const highWarmth = this.module.applyWarmth(1.3);
    
    this.assert(
      highWarmth.level === 'HIGH',
      'Warmth 1.0-1.5 creates HIGH warmth level'
    );
    
    // Test 4: Different phrases for different warmth
    this.assert(
      maxWarmth.opening !== medWarmth.opening,
      'Different warmth levels use different language'
    );
  }
  
  // Test Suite 10: State Tracking
  testStateTracking() {
    console.log('\n🧪 Testing State Tracking...\n');
    
    const state1 = {
      reality: 6,
      expectation: 5,
      emotionalState: { primary: 'neutral' }
    };
    
    const state2 = {
      reality: 8,
      expectation: 6,
      emotionalState: { primary: 'joy' }
    };
    
    this.module.calculateHappiness(state1);
    this.module.calculateHappiness(state2);
    
    // Test 1: History tracked
    this.assert(
      this.module.happiness.history.length >= 2,
      'Happiness history tracked over time'
    );
    
    // Test 2: Previous state saved
    this.assert(
      this.module.happiness.previous.reality === 8,
      'Previous reality saved for comparison'
    );
    
    this.assert(
      this.module.happiness.previous.expectation === 6,
      'Previous expectation saved for motion detection'
    );
    
    // Test 3: Mountain state updated
    this.assert(
      this.module.happiness.mountain.currentHeight > 0,
      'Mountain height tracked'
    );
    
    // Test 4: Get state summary
    const summary = this.module.getState();
    
    this.assert(
      summary.happiness !== undefined &&
      summary.warmth !== undefined &&
      summary.mountain !== undefined,
      'State summary includes all components'
    );
  }
  
  // Test Suite 11: Integration Scenarios
  testIntegrationScenarios() {
    console.log('\n🧪 Testing Integration Scenarios...\n');
    
    // Scenario 1: New relationship (high expectations, early honeymoon)
    const newLove = this.module.calculateHappiness({
      reality: 9,
      expectation: 7,
      emotionalState: { 
        primary: 'joy',
        secondary: 'love',
        intensity: 0.9
      }
    });
    
    this.assert(
      newLove.happiness > 1,
      'Scenario: New love creates high happiness'
    );
    
    this.assert(
      newLove.interpretation.level === 'summit' ||
      newLove.interpretation.level === 'high-climb',
      'Scenario: New love puts user high on mountain'
    );
    
    // Scenario 2: Heartbreak (loss)
    const heartbreak = this.module.calculateHappiness({
      reality: 3,
      expectation: 9, // Expected relationship to continue
      emotionalState: {
        primary: 'sadness',
        secondary: 'grief',
        intensity: 0.9,
        vulnerability: 0.9
      }
    });
    
    this.assert(
      heartbreak.happiness < -1,
      'Scenario: Heartbreak creates deep unhappiness'
    );
    
    this.assert(
      heartbreak.guidance.warmth.multiplier >= 2.0,
      'Scenario: Heartbreak activates maximum warmth'
    );
    
    // Scenario 3: Stable relationship (adaptation setting in)
    this.module.updateAdaptation('positive', 0.8);
    this.module.updateAdaptation('positive', 0.8);
    this.module.updateAdaptation('positive', 0.8);
    
    const stable = this.module.calculateHappiness({
      reality: 7,
      expectation: 7,
      emotionalState: {
        primary: 'calm',
        secondary: 'love',
        intensity: 0.6
      }
    });
    
    this.assert(
      stable.components.satiation < 0,
      'Scenario: Stable relationship shows satiation effect'
    );
  }
  
  // Run All Tests
  async runAllTests() {
    console.log('\n' + '='.repeat(70));
    console.log('💛🔥🏔️ WARMTH & HAPPINESS MODULE TESTS 🏔️🔥💛');
    console.log('"Guidance with utmost warmth toward YOUR mountain"');
    console.log('='.repeat(70));
    
    this.testHappinessCalculation();
    this.testMountainClimbing();
    this.testWarmthMultiplier();
    this.testSixLaws();
    this.testGuidanceGeneration();
    this.testActionAdvice();
    this.testSatiationCoolDown();
    this.testLossRecovery();
    this.testWarmthLanguage();
    this.testStateTracking();
    this.testIntegrationScenarios();
    
    console.log('\n' + '='.repeat(70));
    console.log(`✅ Tests Passed: ${this.testsPassed}`);
    console.log(`❌ Tests Failed: ${this.testsFailed}`);
    console.log(`📊 Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`);
    console.log('='.repeat(70));
    
    if (this.testsFailed === 0) {
      console.log('\n💛🔥🏔️ ALL TESTS PASSED! Warmth + Happiness = JOIE DE VIVRE! 🏔️🔥💛\n');
    } else {
      console.log('\n⚠️  Some tests failed. Review and fix before deployment.\n');
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new WarmthHappinessTester();
  tester.runAllTests().catch(console.error);
}

module.exports = WarmthHappinessTester;
