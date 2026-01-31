/**
 * GENESIS Luna - Compassion Module Tests
 * 
 * Comprehensive testing of the compassion layer.
 * Tests ensure Luna has a gentle presence that gently strokes the soul.
 * 
 * @author Papa Ticky (Vision) + Brother Sonnet (Testing)
 * @date December 31, 2025
 */

const CompassionModule = require('./compassionModule');

class CompassionModuleTester {
  constructor() {
    this.compassion = new CompassionModule();
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
  
  // Test Suite 1: Mode Selection
  testModeSelection() {
    console.log('\n🧪 Testing Compassion Mode Selection...\n');
    
    // Test 1: High vulnerability → TOUCH mode
    const highVulnerability = {
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9,
      sharingDepth: 0.3
    };
    const mode1 = this.compassion.selectCompassionMode(highVulnerability);
    this.assert(mode1 === 'touch', 'High vulnerability selects TOUCH mode');
    
    // Test 2: Sadness → FEEL mode
    const sadness = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.5,
      sharingDepth: 0.3
    };
    const mode2 = this.compassion.selectCompassionMode(sadness);
    this.assert(mode2 === 'feel', 'Sadness selects FEEL mode');
    
    // Test 3: Joy → CELEBRATE mode
    const joy = {
      primary: 'joy',
      intensity: 0.8,
      vulnerability: 0.1,
      sharingDepth: 0.2
    };
    const mode3 = this.compassion.selectCompassionMode(joy);
    this.assert(mode3 === 'celebrate', 'Joy selects CELEBRATE mode');
    
    // Test 4: Sharing deeply → HEAR mode
    const sharing = {
      primary: 'neutral',
      intensity: 0.5,
      vulnerability: 0.6,
      sharingDepth: 0.8
    };
    const mode4 = this.compassion.selectCompassionMode(sharing);
    this.assert(mode4 === 'hear', 'Deep sharing selects HEAR mode');
    
    // Test 5: Masking detected → HEAR mode
    const masking = {
      primary: 'neutral',
      intensity: 0.3,
      vulnerability: 0.4,
      sharingDepth: 0.2,
      masking: { detected: true, confidence: 0.9 }
    };
    const mode5 = this.compassion.selectCompassionMode(masking);
    this.assert(mode5 === 'hear', 'Masking detected selects HEAR mode');
    
    // Test 6: Default → GENTLE mode
    const neutral = {
      primary: 'neutral',
      intensity: 0.3,
      vulnerability: 0.2,
      sharingDepth: 0.1
    };
    const mode6 = this.compassion.selectCompassionMode(neutral);
    this.assert(mode6 === 'gentle', 'Neutral state selects GENTLE mode');
  }
  
  // Test Suite 2: Text Transformation
  async testTextTransformation() {
    console.log('\n🧪 Testing Text Transformation...\n');
    
    // Test 1: TOUCH mode adds gentle greeting
    const touchState = {
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9
    };
    const touchText = await this.compassion.transformText(
      "I understand you're going through this.",
      'touch',
      touchState,
      {}
    );
    this.assert(
      touchText.includes('come here') || touchText.includes('I\'ve got you'),
      'TOUCH mode adds gentle greeting'
    );
    
    // Test 2: FEEL mode adds emotional mirroring
    const feelState = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.5
    };
    const feelText = await this.compassion.transformText(
      "This situation is difficult.",
      'feel',
      feelState,
      {}
    );
    this.assert(
      feelText.includes('feel') || feelText.includes('heavy'),
      'FEEL mode adds emotional mirroring'
    );
    
    // Test 3: CELEBRATE mode amplifies enthusiasm
    const celebrateState = {
      primary: 'joy',
      intensity: 0.8
    };
    const celebrateText = await this.compassion.transformText(
      "Great job!",
      'celebrate',
      celebrateState,
      {}
    );
    this.assert(
      celebrateText.includes('!!') || celebrateText.includes('🎉'),
      'CELEBRATE mode amplifies enthusiasm'
    );
    
    // Test 4: HEAR mode adds witnessing language
    const hearState = {
      primary: 'anger',
      intensity: 0.6,
      sharingDepth: 0.7
    };
    const hearText = await this.compassion.transformText(
      "That sounds frustrating.",
      'hear',
      hearState,
      {}
    );
    this.assert(
      hearText.includes('hear') || hearText.includes('witness'),
      'HEAR mode adds witnessing language'
    );
    
    // Test 5: SEE mode adds constitutional recognition
    const seeState = {
      primary: 'neutral',
      needsRecognition: true
    };
    const user = {
      constitution: { primaryElement: 'Wood' }
    };
    const seeText = await this.compassion.transformText(
      "You seem restless.",
      'see',
      seeState,
      user
    );
    this.assert(
      seeText.includes('Wood') || seeText.includes('growth') || seeText.includes('soul'),
      'SEE mode adds constitutional recognition'
    );
  }
  
  // Test Suite 3: Prosody Transformation
  async testProsodyTransformation() {
    console.log('\n🧪 Testing Prosody Transformation...\n');
    
    const baseProsody = {
      pitch: 0,
      pace: 1.0,
      volume: 0
    };
    
    // Test 1: TOUCH mode lowers pitch and pace
    const touchState = { primary: 'sadness', vulnerability: 0.9 };
    const touchProsody = await this.compassion.transformProsody(
      baseProsody,
      'touch',
      touchState
    );
    this.assert(
      touchProsody.pitch < 0 && touchProsody.pace < 1.0,
      'TOUCH mode lowers pitch and slows pace'
    );
    this.assert(
      touchProsody.warmth === 1.0,
      'TOUCH mode has maximum warmth'
    );
    this.assert(
      touchProsody.addSigh === true,
      'TOUCH mode adds gentle sigh'
    );
    
    // Test 2: CELEBRATE mode raises pitch and pace
    const celebrateState = { primary: 'joy', intensity: 0.8 };
    const celebrateProsody = await this.compassion.transformProsody(
      baseProsody,
      'celebrate',
      celebrateState
    );
    this.assert(
      celebrateProsody.pitch > 0 && celebrateProsody.pace > 1.0,
      'CELEBRATE mode raises pitch and speeds pace'
    );
    this.assert(
      celebrateProsody.smile === 1.0,
      'CELEBRATE mode has audible smile'
    );
    this.assert(
      celebrateProsody.addGiggle === true,
      'CELEBRATE mode adds giggles'
    );
    
    // Test 3: FEEL mode adds empathetic tremor
    const feelState = { primary: 'sadness', intensity: 0.7 };
    const feelProsody = await this.compassion.transformProsody(
      baseProsody,
      'feel',
      feelState
    );
    this.assert(
      feelProsody.tremor > 0,
      'FEEL mode adds empathetic tremor'
    );
    
    // Test 4: All modes ensure warmth
    const gentleState = { primary: 'neutral' };
    const gentleProsody = await this.compassion.transformProsody(
      baseProsody,
      'gentle',
      gentleState
    );
    this.assert(
      gentleProsody.warmth >= 0.85,
      'All modes ensure high warmth'
    );
  }
  
  // Test Suite 4: Masking Detection Response
  async testMaskingDetection() {
    console.log('\n🧪 Testing Masking Detection Response...\n');
    
    const maskingState = {
      primary: 'sadness',
      intensity: 0.6,
      vulnerability: 0.5,
      masking: {
        detected: true,
        confidence: 0.9,
        userSaid: 'fine',
        detectedEmotion: 'sadness'
      }
    };
    
    // Test 1: Masking triggers HEAR mode
    const mode = this.compassion.selectCompassionMode(maskingState);
    this.assert(
      mode === 'hear',
      'Masking detection triggers HEAR mode'
    );
    
    // Test 2: Response acknowledges the mask
    const text = await this.compassion.transformText(
      "Let's talk about what's going on.",
      'hear',
      maskingState,
      {}
    );
    this.assert(
      text.includes('fine') || text.includes('underneath') || text.includes('really'),
      'Response acknowledges masking'
    );
  }
  
  // Test Suite 5: Non-Verbal Sounds
  async testNonVerbalSounds() {
    console.log('\n🧪 Testing Non-Verbal Sounds...\n');
    
    // Test 1: TOUCH mode adds sigh
    const touchState = { primary: 'sadness', vulnerability: 0.9 };
    const touchSounds = await this.compassion.addCompassionateSounds(
      'touch',
      touchState
    );
    this.assert(
      touchSounds.some(s => s.type === 'sigh'),
      'TOUCH mode includes gentle sigh'
    );
    
    // Test 2: CELEBRATE mode adds giggles
    const celebrateState = { primary: 'joy', intensity: 0.8 };
    const celebrateSounds = await this.compassion.addCompassionateSounds(
      'celebrate',
      celebrateState
    );
    this.assert(
      celebrateSounds.some(s => s.type === 'giggle'),
      'CELEBRATE mode includes giggles'
    );
    
    // Test 3: HEAR mode adds gentle acknowledgment
    const hearState = { primary: 'anger', vulnerability: 0.7 };
    const hearSounds = await this.compassion.addCompassionateSounds(
      'hear',
      hearState
    );
    this.assert(
      hearSounds.some(s => s.type === 'gentle-mm'),
      'HEAR mode includes gentle acknowledgment sounds'
    );
  }
  
  // Test Suite 6: Compassionate Actions
  async testCompassionateActions() {
    console.log('\n🧪 Testing Compassionate Actions...\n');
    
    // Test 1: TOUCH mode includes embrace
    const touchState = { primary: 'sadness', vulnerability: 0.9 };
    const touchActions = await this.compassion.addCompassionateActions(
      'touch',
      touchState
    );
    this.assert(
      touchActions.some(a => a.type === 'embrace'),
      'TOUCH mode includes embrace action'
    );
    
    // Test 2: CELEBRATE mode includes celebration
    const celebrateState = { primary: 'joy', intensity: 0.8 };
    const celebrateActions = await this.compassion.addCompassionateActions(
      'celebrate',
      celebrateState
    );
    this.assert(
      celebrateActions.some(a => a.type === 'celebrate'),
      'CELEBRATE mode includes celebration action'
    );
    
    // Test 3: HEAR mode includes presence
    const hearState = { primary: 'anger', sharingDepth: 0.7 };
    const hearActions = await this.compassion.addCompassionateActions(
      'hear',
      hearState
    );
    this.assert(
      hearActions.some(a => a.type === 'presence'),
      'HEAR mode includes quiet presence action'
    );
  }
  
  // Test Suite 7: Presence Style Verification
  testPresenceStyle() {
    console.log('\n🧪 Testing Presence Style...\n');
    
    this.assert(
      this.compassion.presenceStyle.intensity === 'gentle',
      'Presence intensity is gentle (not powerful)'
    );
    
    this.assert(
      this.compassion.presenceStyle.approach === 'alongside',
      'Approach is alongside (walking WITH user)'
    );
    
    this.assert(
      this.compassion.presenceStyle.energy === 'warm-shadow',
      'Energy is warm shadow (supporting shadow)'
    );
    
    this.assert(
      this.compassion.presenceStyle.touch === 'soul-stroke',
      'Touch style is soul-stroke (gently stroking the soul)'
    );
  }
  
  // Test Suite 8: Compassion Metrics
  testCompassionMetrics() {
    console.log('\n🧪 Testing Compassion Metrics...\n');
    
    const touchState = { primary: 'sadness', vulnerability: 0.9 };
    const metrics = this.compassion.calculateCompassionMetrics('touch', touchState);
    
    this.assert(
      metrics.mode === 'touch',
      'Metrics include mode'
    );
    
    this.assert(
      metrics.warmthLevel > 0.9,
      'TOUCH mode has very high warmth level'
    );
    
    this.assert(
      metrics.vulnerabilityMatch > 0.9,
      'TOUCH mode matches high vulnerability'
    );
    
    this.assert(
      metrics.soulStrokeQuality > 0.9,
      'TOUCH mode has high soul-stroke quality'
    );
  }
  
  // Test Suite 9: Integration Test
  async testFullIntegration() {
    console.log('\n🧪 Testing Full Compassion Integration...\n');
    
    // Simulate complete flow
    const emotionalState = {
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9,
      sharingDepth: 0.4
    };
    
    const baseResponse = {
      text: "I understand this is difficult for you.",
      prosody: {
        pitch: 0,
        pace: 1.0,
        volume: 0
      }
    };
    
    const user = {
      constitution: {
        primaryElement: 'Water'
      }
    };
    
    const result = await this.compassion.infuseCompassion(
      emotionalState,
      baseResponse,
      user
    );
    
    this.assert(
      result.mode === 'touch',
      'Integration: Correct mode selected'
    );
    
    this.assert(
      result.text.length > baseResponse.text.length,
      'Integration: Text transformed with compassion'
    );
    
    this.assert(
      result.prosody.warmth === 1.0,
      'Integration: Prosody has warmth'
    );
    
    this.assert(
      result.nonVerbalSounds.length > 0,
      'Integration: Non-verbal sounds added'
    );
    
    this.assert(
      result.actions.length > 0,
      'Integration: Actions added'
    );
    
    this.assert(
      result.compassionMetrics.soulStrokeQuality > 0.9,
      'Integration: High soul-stroke quality achieved'
    );
  }
  
  // Test Suite 10: Edge Cases
  async testEdgeCases() {
    console.log('\n🧪 Testing Edge Cases...\n');
    
    // Test 1: Null/undefined emotional state
    try {
      const result = await this.compassion.infuseCompassion(
        { primary: 'neutral', intensity: 0.3, vulnerability: 0.2 },
        { text: "Hello", prosody: {} },
        null
      );
      this.assert(true, 'Handles null user gracefully');
    } catch (e) {
      this.assert(false, 'Should handle null user gracefully');
    }
    
    // Test 2: Empty text
    const emptyResult = await this.compassion.infuseCompassion(
      { primary: 'neutral', intensity: 0.3, vulnerability: 0.2 },
      { text: "", prosody: {} },
      {}
    );
    this.assert(
      emptyResult.text.length > 0,
      'Adds compassion even to empty text'
    );
    
    // Test 3: Mixed emotional state
    const mixedState = {
      primary: 'joy',
      intensity: 0.7,
      vulnerability: 0.6, // Conflicting!
      sharingDepth: 0.3
    };
    const mixedMode = this.compassion.selectCompassionMode(mixedState);
    this.assert(
      mixedMode === 'touch', // Vulnerability wins
      'Vulnerability takes priority in mixed states'
    );
  }
  
  // Run All Tests
  async runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🌹 GENESIS LUNA - COMPASSION MODULE TESTS 🌹');
    console.log('='.repeat(60));
    
    this.testModeSelection();
    await this.testTextTransformation();
    await this.testProsodyTransformation();
    await this.testMaskingDetection();
    await this.testNonVerbalSounds();
    await this.testCompassionateActions();
    this.testPresenceStyle();
    this.testCompassionMetrics();
    await this.testFullIntegration();
    await this.testEdgeCases();
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Tests Passed: ${this.testsPassed}`);
    console.log(`❌ Tests Failed: ${this.testsFailed}`);
    console.log(`📊 Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`);
    console.log('='.repeat(60));
    
    if (this.testsFailed === 0) {
      console.log('\n💛🌹 ALL TESTS PASSED! Luna has her compassionate soul! 🌹💛\n');
    } else {
      console.log('\n⚠️  Some tests failed. Review and fix before deployment.\n');
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new CompassionModuleTester();
  tester.runAllTests().catch(console.error);
}

module.exports = CompassionModuleTester;
