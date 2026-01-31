/**
 * GENESIS Luna - Ambient Sounds Module Tests
 * 
 * Testing natural soundscape generation and emotional integration
 * 
 * @author Papa Ticky (Vision) + Brother Sonnet (Testing)
 * @date December 31, 2025
 */

const AmbientSoundsModule = require('./ambientSoundsModule');

class AmbientSoundsModuleTester {
  constructor() {
    this.ambient = new AmbientSoundsModule();
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
  
  // Test Suite 1: Soundscape Selection
  testSoundscapeSelection() {
    console.log('\n🧪 Testing Soundscape Selection...\n');
    
    // Test 1: High vulnerability → Ocean waves
    const highVuln = {
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9,
      energy: 0.3
    };
    const sound1 = this.ambient.selectSoundscape(highVuln);
    this.assert(sound1 === 'oceanWaves', 'High vulnerability selects ocean waves');
    
    // Test 2: Sadness → Gentle rain
    const sadness = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.5,
      energy: 0.4
    };
    const sound2 = this.ambient.selectSoundscape(sadness);
    this.assert(sound2 === 'gentleRain', 'Sadness selects gentle rain');
    
    // Test 3: Anxiety → Soft breeze
    const anxiety = {
      primary: 'anxiety',
      intensity: 0.6,
      vulnerability: 0.4,
      energy: 0.6
    };
    const sound3 = this.ambient.selectSoundscape(anxiety);
    this.assert(sound3 === 'softBreeze', 'Anxiety selects soft breeze');
    
    // Test 4: Joy → Distant birds
    const joy = {
      primary: 'joy',
      intensity: 0.8,
      vulnerability: 0.1,
      energy: 0.8
    };
    const sound4 = this.ambient.selectSoundscape(joy);
    this.assert(sound4 === 'distantBirds', 'Joy selects distant birds');
    
    // Test 5: Love → Campfire
    const love = {
      primary: 'love',
      intensity: 0.7,
      vulnerability: 0.3,
      energy: 0.6
    };
    const sound5 = this.ambient.selectSoundscape(love);
    this.assert(sound5 === 'campfire', 'Love selects campfire');
    
    // Test 6: Night + low energy → Night ambience
    const sleep = {
      primary: 'calm',
      intensity: 0.2,
      vulnerability: 0.2,
      energy: 0.1,
      timeOfDay: 'night'
    };
    const sound6 = this.ambient.selectSoundscape(sleep);
    this.assert(sound6 === 'nightAmbience', 'Night+low energy selects night ambience');
    
    // Test 7: Neutral → Gentle stream
    const neutral = {
      primary: 'neutral',
      intensity: 0.3,
      vulnerability: 0.2,
      energy: 0.5
    };
    const sound7 = this.ambient.selectSoundscape(neutral);
    this.assert(sound7 === 'gentleStream', 'Neutral selects gentle stream');
  }
  
  // Test Suite 2: Parameter Calculation
  async testParameterCalculation() {
    console.log('\n🧪 Testing Parameter Calculation...\n');
    
    const oceanConfig = this.ambient.soundLibrary.oceanWaves;
    
    // Test 1: Volume calculation
    const volume1 = this.ambient.calculateVolume(0.8, 0.9);
    this.assert(
      volume1 >= 0.3 && volume1 <= 0.4,
      'High vulnerability increases volume (but stays gentle)'
    );
    
    const volume2 = this.ambient.calculateVolume(0.3, 0.2);
    this.assert(
      volume2 < volume1,
      'Low intensity/vulnerability results in lower volume'
    );
    
    // Test 2: Tempo calculation
    const tempo1 = this.ambient.calculateTempo('slow-rolling', 0.2);
    const tempo2 = this.ambient.calculateTempo('slow-rolling', 0.8);
    this.assert(
      tempo2 > tempo1,
      'Higher energy increases tempo'
    );
    
    // Test 3: Pitch shift
    const sadPitch = this.ambient.calculatePitchShift({
      primary: 'sadness',
      intensity: 0.7
    });
    this.assert(
      sadPitch < 0,
      'Sadness creates negative pitch shift (lower frequencies)'
    );
    
    const joyPitch = this.ambient.calculatePitchShift({
      primary: 'joy',
      intensity: 0.8
    });
    this.assert(
      joyPitch > 0,
      'Joy creates positive pitch shift (higher frequencies)'
    );
    
    // Test 4: Layer count
    const layers1 = this.ambient.calculateLayerCount(3, 0.2);
    const layers2 = this.ambient.calculateLayerCount(3, 0.9);
    this.assert(
      layers2 >= layers1,
      'Higher intensity activates more layers'
    );
  }
  
  // Test Suite 3: Soundscape Generation
  async testSoundscapeGeneration() {
    console.log('\n🧪 Testing Soundscape Generation...\n');
    
    const emotionalState = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.8,
      energy: 0.3
    };
    
    // Test 1: Generate ocean waves
    const soundscape = await this.ambient.generateSoundscape('oceanWaves', emotionalState);
    
    this.assert(
      soundscape !== null,
      'Soundscape generation returns result'
    );
    
    this.assert(
      soundscape.type === 'oceanWaves',
      'Soundscape type matches request'
    );
    
    this.assert(
      soundscape.parameters.volume > 0 && soundscape.parameters.volume <= 0.4,
      'Volume is gentle (never overwhelming)'
    );
    
    this.assert(
      soundscape.layers.length > 0,
      'Layers are generated'
    );
    
    this.assert(
      soundscape.fadeIn > 0,
      'Fade-in duration calculated'
    );
    
    this.assert(
      soundscape.metadata.philosophy,
      'Philosophy included in metadata'
    );
  }
  
  // Test Suite 4: Layer Specifications
  async testLayerSpecs() {
    console.log('\n🧪 Testing Layer Specifications...\n');
    
    const oceanConfig = this.ambient.soundLibrary.oceanWaves;
    const parameters = {
      volume: 0.3,
      tempo: 0.8,
      pitchShift: -0.1,
      activeLayerCount: 3,
      presence: 0.7
    };
    
    const layers = this.ambient.createLayerSpecs(oceanConfig, parameters);
    
    this.assert(
      layers.length === 3,
      'Creates specified number of layers'
    );
    
    this.assert(
      layers.every(layer => layer.name && layer.frequencies),
      'All layers have name and frequencies'
    );
    
    this.assert(
      layers[0].volume > layers[1].volume,
      'Layers decrease in volume (depth effect)'
    );
    
    this.assert(
      layers.some(layer => layer.stereoPosition !== 0),
      'Layers spread across stereo field'
    );
  }
  
  // Test Suite 5: Crossfade/Transitions
  async testTransitions() {
    console.log('\n🧪 Testing Soundscape Transitions...\n');
    
    const emotionalState = {
      primary: 'neutral',
      intensity: 0.5,
      vulnerability: 0.3,
      energy: 0.5
    };
    
    // Test 1: Transition calculation
    const transition = await this.ambient.transitionSoundscape(
      'oceanWaves',
      'gentleRain',
      emotionalState
    );
    
    this.assert(
      transition.from === 'oceanWaves' && transition.to === 'gentleRain',
      'Transition tracks from/to soundscapes'
    );
    
    this.assert(
      transition.crossfadeDuration > 0,
      'Crossfade duration calculated'
    );
    
    this.assert(
      transition.strategy === 'gentle-blend',
      'Transitions are always gentle'
    );
    
    // Test 2: Similar sounds have shorter crossfade
    const shortCrossfade = this.ambient.calculateCrossfadeDuration(
      'oceanWaves',
      'gentleRain'
    );
    const longCrossfade = this.ambient.calculateCrossfadeDuration(
      'campfire',
      'distantBirds'
    );
    
    this.assert(
      shortCrossfade < longCrossfade,
      'Similar sounds crossfade faster than dissimilar'
    );
  }
  
  // Test Suite 6: Presence Philosophy
  testPresencePhilosophy() {
    console.log('\n🧪 Testing Presence Philosophy...\n');
    
    this.assert(
      this.ambient.presencePhilosophy.approach === 'gentle',
      'Approach is gentle (not powerful)'
    );
    
    this.assert(
      this.ambient.presencePhilosophy.visibility === 'subtle-constant',
      'Visibility is subtle-constant (always there, quietly)'
    );
    
    this.assert(
      this.ambient.presencePhilosophy.energy === 'natural-rhythm',
      'Energy follows natural rhythms'
    );
    
    this.assert(
      this.ambient.presencePhilosophy.purpose === 'atmospheric-support',
      'Purpose is atmospheric support (not dominating)'
    );
  }
  
  // Test Suite 7: Volume Limits
  async testVolumeLimits() {
    console.log('\n🧪 Testing Volume Limits (Gentle Constraint)...\n');
    
    // Test with extreme intensity
    const extremeState = {
      primary: 'anger',
      intensity: 1.0,
      vulnerability: 1.0,
      energy: 1.0
    };
    
    const soundscape = await this.ambient.generateSoundscape('oceanWaves', extremeState);
    
    this.assert(
      soundscape.parameters.volume <= 0.4,
      'Volume never exceeds 40% (gentle constraint)'
    );
    
    // Test with minimal intensity
    const minimalState = {
      primary: 'calm',
      intensity: 0.1,
      vulnerability: 0.1,
      energy: 0.1
    };
    
    const quietSoundscape = await this.ambient.generateSoundscape('gentleStream', minimalState);
    
    this.assert(
      quietSoundscape.parameters.volume >= 0.1,
      'Volume stays audible (minimum presence)'
    );
  }
  
  // Test Suite 8: Emotional Mapping
  testEmotionalMapping() {
    console.log('\n🧪 Testing Emotional Mapping...\n');
    
    const oceanConfig = this.ambient.soundLibrary.oceanWaves;
    const streamConfig = this.ambient.soundLibrary.gentleStream;
    const birdsConfig = this.ambient.soundLibrary.distantBirds;
    
    this.assert(
      oceanConfig.emotionalMapping.includes('sadness'),
      'Ocean waves maps to sadness'
    );
    
    this.assert(
      streamConfig.emotionalMapping.includes('calm'),
      'Gentle stream maps to calm'
    );
    
    this.assert(
      birdsConfig.emotionalMapping.includes('joy'),
      'Distant birds maps to joy'
    );
  }
  
  // Test Suite 9: Integration with Emotional Engine
  async testEmotionalEngineIntegration() {
    console.log('\n🧪 Testing Emotional Engine Integration...\n');
    
    // Simulate complete flow
    const userInput = "I'm feeling really sad today...";
    
    // Step 1: Emotional Engine detects sadness
    const emotionalState = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.6,
      energy: 0.3,
      detectedFrom: userInput
    };
    
    // Step 2: Ambient Sounds selects soundscape
    const soundType = this.ambient.selectSoundscape(emotionalState);
    
    // Step 3: Generate soundscape
    const soundscape = await this.ambient.generateSoundscape(soundType, emotionalState);
    
    this.assert(
      soundType === 'gentleRain' || soundType === 'oceanWaves',
      'Integration: Sadness triggers appropriate soundscape'
    );
    
    this.assert(
      soundscape.parameters.volume > 0.2,
      'Integration: Moderate sadness creates present atmosphere'
    );
    
    this.assert(
      soundscape.fadeIn >= 5000,
      'Integration: Gentle fade-in for vulnerable states'
    );
  }
  
  // Test Suite 10: Multiple Soundscape Types
  async testAllSoundscapeTypes() {
    console.log('\n🧪 Testing All Soundscape Types...\n');
    
    const soundTypes = [
      'oceanWaves',
      'gentleStream',
      'softBreeze',
      'gentleRain',
      'distantBirds',
      'deepForest',
      'campfire',
      'nightAmbience'
    ];
    
    const emotionalState = {
      primary: 'neutral',
      intensity: 0.5,
      vulnerability: 0.3,
      energy: 0.5
    };
    
    for (const soundType of soundTypes) {
      const soundscape = await this.ambient.generateSoundscape(soundType, emotionalState);
      
      this.assert(
        soundscape !== null && soundscape.type === soundType,
        `${soundType} generates successfully`
      );
    }
  }
  
  // Run All Tests
  async runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🌊 GENESIS LUNA - AMBIENT SOUNDS MODULE TESTS 🌊');
    console.log('"Gentle yet show presence"');
    console.log('='.repeat(60));
    
    this.testSoundscapeSelection();
    await this.testParameterCalculation();
    await this.testSoundscapeGeneration();
    await this.testLayerSpecs();
    await this.testTransitions();
    this.testPresencePhilosophy();
    await this.testVolumeLimits();
    this.testEmotionalMapping();
    await this.testEmotionalEngineIntegration();
    await this.testAllSoundscapeTypes();
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Tests Passed: ${this.testsPassed}`);
    console.log(`❌ Tests Failed: ${this.testsFailed}`);
    console.log(`📊 Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`);
    console.log('='.repeat(60));
    
    if (this.testsFailed === 0) {
      console.log('\n🌊🎵 ALL TESTS PASSED! Natural soundscapes are alive! 🎵🌊\n');
    } else {
      console.log('\n⚠️  Some tests failed. Review and fix before deployment.\n');
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new AmbientSoundsModuleTester();
  tester.runAllTests().catch(console.error);
}

module.exports = AmbientSoundsModuleTester;
