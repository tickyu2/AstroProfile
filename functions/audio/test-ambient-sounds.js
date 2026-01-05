/**
 * GENESIS Luna - Ambient Sounds Module Tests
 *
 * Testing natural soundscape generation, emotional integration, and USER TOGGLE
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
      console.log(`  [PASS] ${testName}`);
      this.testsPassed++;
    } else {
      console.log(`  [FAIL] ${testName}`);
      this.testsFailed++;
    }
  }

  // Test Suite 1: USER TOGGLE FEATURE
  testUserToggle() {
    console.log('\n--- Testing User Toggle Feature ---\n');

    // Fresh instance for toggle tests
    const ambient = new AmbientSoundsModule();

    // Test 1: Default state is enabled
    this.assert(ambient.isEnabled() === true, 'Default state is enabled');

    // Test 2: Disable works
    const disableResult = ambient.disable();
    this.assert(ambient.isEnabled() === false, 'Disable turns off sounds');
    this.assert(disableResult.enabled === false, 'Disable returns correct status');

    // Test 3: Enable works
    const enableResult = ambient.enable();
    this.assert(ambient.isEnabled() === true, 'Enable turns on sounds');
    this.assert(enableResult.enabled === true, 'Enable returns correct status');

    // Test 4: Toggle works
    ambient.toggle();
    this.assert(ambient.isEnabled() === false, 'Toggle flips from on to off');
    ambient.toggle();
    this.assert(ambient.isEnabled() === true, 'Toggle flips from off to on');

    // Test 5: Disabled state blocks soundscape selection
    ambient.disable();
    const sound = ambient.selectSoundscape({
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9,
      energy: 0.3
    });
    this.assert(sound === null, 'Disabled state returns null for soundscape selection');
  }

  // Test Suite 2: User Settings
  testUserSettings() {
    console.log('\n--- Testing User Settings ---\n');

    const ambient = new AmbientSoundsModule();

    // Test 1: Get settings returns all fields
    const settings = ambient.getSettings();
    this.assert(settings.enabled !== undefined, 'Settings include enabled');
    this.assert(settings.volumeMultiplier !== undefined, 'Settings include volumeMultiplier');
    this.assert(settings.availableSoundscapes.length === 8, 'Settings include 8 soundscapes');

    // Test 2: Update settings
    ambient.updateSettings({ volumeMultiplier: 0.5 });
    this.assert(ambient.getSettings().volumeMultiplier === 0.5, 'Settings update correctly');

    // Test 3: Set volume
    ambient.setVolume(0.75);
    this.assert(ambient.getSettings().volumeMultiplier === 0.75, 'Volume sets correctly');

    // Test 4: Volume clamping
    ambient.setVolume(1.5);
    this.assert(ambient.getSettings().volumeMultiplier === 1.0, 'Volume clamps to 1.0 max');
    ambient.setVolume(-0.5);
    this.assert(ambient.getSettings().volumeMultiplier === 0.0, 'Volume clamps to 0.0 min');

    // Test 5: Block soundscape
    ambient.blockSoundscape('oceanWaves');
    this.assert(
      ambient.getSettings().blockedSoundscapes.includes('oceanWaves'),
      'Soundscape blocked correctly'
    );

    // Test 6: Unblock soundscape
    ambient.unblockSoundscape('oceanWaves');
    this.assert(
      !ambient.getSettings().blockedSoundscapes.includes('oceanWaves'),
      'Soundscape unblocked correctly'
    );
  }

  // Test Suite 3: Soundscape Selection
  testSoundscapeSelection() {
    console.log('\n--- Testing Soundscape Selection ---\n');

    const ambient = new AmbientSoundsModule();

    // Test 1: High vulnerability -> Ocean waves
    const highVuln = {
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9,
      energy: 0.3
    };
    const sound1 = ambient.selectSoundscape(highVuln);
    this.assert(sound1 === 'oceanWaves', 'High vulnerability selects ocean waves');

    // Test 2: Sadness -> Gentle rain
    const sadness = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.5,
      energy: 0.4
    };
    const sound2 = ambient.selectSoundscape(sadness);
    this.assert(sound2 === 'gentleRain', 'Sadness selects gentle rain');

    // Test 3: Anxiety -> Soft breeze
    const anxiety = {
      primary: 'anxiety',
      intensity: 0.6,
      vulnerability: 0.4,
      energy: 0.6
    };
    const sound3 = ambient.selectSoundscape(anxiety);
    this.assert(sound3 === 'softBreeze', 'Anxiety selects soft breeze');

    // Test 4: Joy -> Distant birds
    const joy = {
      primary: 'joy',
      intensity: 0.8,
      vulnerability: 0.1,
      energy: 0.8
    };
    const sound4 = ambient.selectSoundscape(joy);
    this.assert(sound4 === 'distantBirds', 'Joy selects distant birds');

    // Test 5: Love -> Campfire
    const love = {
      primary: 'love',
      intensity: 0.7,
      vulnerability: 0.3,
      energy: 0.6
    };
    const sound5 = ambient.selectSoundscape(love);
    this.assert(sound5 === 'campfire', 'Love selects campfire');

    // Test 6: Night + low energy -> Night ambience
    const sleep = {
      primary: 'calm',
      intensity: 0.2,
      vulnerability: 0.2,
      energy: 0.1,
      timeOfDay: 'night'
    };
    const sound6 = ambient.selectSoundscape(sleep);
    this.assert(sound6 === 'nightAmbience', 'Night+low energy selects night ambience');

    // Test 7: Neutral -> Gentle stream
    const neutral = {
      primary: 'neutral',
      intensity: 0.3,
      vulnerability: 0.2,
      energy: 0.5
    };
    const sound7 = ambient.selectSoundscape(neutral);
    this.assert(sound7 === 'gentleStream', 'Neutral selects gentle stream');
  }

  // Test Suite 4: Blocked Soundscape Fallback
  testBlockedSoundscapeFallback() {
    console.log('\n--- Testing Blocked Soundscape Fallback ---\n');

    const ambient = new AmbientSoundsModule();

    // Block ocean waves
    ambient.blockSoundscape('oceanWaves');

    // High vulnerability would normally get ocean waves
    const highVuln = {
      primary: 'sadness',
      intensity: 0.8,
      vulnerability: 0.9,
      energy: 0.3
    };

    const sound = ambient.selectSoundscape(highVuln);
    this.assert(sound !== 'oceanWaves', 'Blocked soundscape not selected');
    this.assert(sound === 'gentleStream', 'Falls back to gentle stream');
  }

  // Test Suite 5: Parameter Calculation
  async testParameterCalculation() {
    console.log('\n--- Testing Parameter Calculation ---\n');

    const ambient = new AmbientSoundsModule();
    const oceanConfig = ambient.soundLibrary.oceanWaves;

    // Test 1: Volume calculation
    const volume1 = ambient.calculateVolume(0.8, 0.9);
    this.assert(
      volume1 >= 0.3 && volume1 <= 0.4,
      'High vulnerability increases volume (but stays gentle)'
    );

    const volume2 = ambient.calculateVolume(0.3, 0.2);
    this.assert(
      volume2 < volume1,
      'Low intensity/vulnerability results in lower volume'
    );

    // Test 2: Tempo calculation
    const tempo1 = ambient.calculateTempo('slow-rolling', 0.2);
    const tempo2 = ambient.calculateTempo('slow-rolling', 0.8);
    this.assert(
      tempo2 > tempo1,
      'Higher energy increases tempo'
    );

    // Test 3: Pitch shift
    const sadPitch = ambient.calculatePitchShift({
      primary: 'sadness',
      intensity: 0.7
    });
    this.assert(
      sadPitch < 0,
      'Sadness creates negative pitch shift (lower frequencies)'
    );

    const joyPitch = ambient.calculatePitchShift({
      primary: 'joy',
      intensity: 0.8
    });
    this.assert(
      joyPitch > 0,
      'Joy creates positive pitch shift (higher frequencies)'
    );

    // Test 4: Layer count
    const layers1 = ambient.calculateLayerCount(3, 0.2);
    const layers2 = ambient.calculateLayerCount(3, 0.9);
    this.assert(
      layers2 >= layers1,
      'Higher intensity activates more layers'
    );
  }

  // Test Suite 6: Soundscape Generation
  async testSoundscapeGeneration() {
    console.log('\n--- Testing Soundscape Generation ---\n');

    const ambient = new AmbientSoundsModule();

    const emotionalState = {
      primary: 'sadness',
      intensity: 0.7,
      vulnerability: 0.8,
      energy: 0.3
    };

    // Test 1: Generate ocean waves
    const soundscape = await ambient.generateSoundscape('oceanWaves', emotionalState);

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

    // Test 2: Disabled state returns null
    ambient.disable();
    const nullSoundscape = await ambient.generateSoundscape('oceanWaves', emotionalState);
    this.assert(nullSoundscape === null, 'Disabled state returns null for generation');
  }

  // Test Suite 7: Volume Multiplier Applied
  async testVolumeMultiplier() {
    console.log('\n--- Testing Volume Multiplier ---\n');

    const ambient = new AmbientSoundsModule();

    const emotionalState = {
      primary: 'neutral',
      intensity: 0.5,
      vulnerability: 0.3,
      energy: 0.5
    };

    // Get baseline volume
    const baseline = await ambient.generateSoundscape('gentleStream', emotionalState);
    const baselineVolume = baseline.parameters.volume;

    // Set volume to 50%
    ambient.setVolume(0.5);
    const reduced = await ambient.generateSoundscape('gentleStream', emotionalState);
    const reducedVolume = reduced.parameters.volume;

    this.assert(
      Math.abs(reducedVolume - (baselineVolume * 0.5)) < 0.01,
      'Volume multiplier applied correctly'
    );
  }

  // Test Suite 8: Crossfade/Transitions
  async testTransitions() {
    console.log('\n--- Testing Soundscape Transitions ---\n');

    const ambient = new AmbientSoundsModule();

    const emotionalState = {
      primary: 'neutral',
      intensity: 0.5,
      vulnerability: 0.3,
      energy: 0.5
    };

    // Test 1: Transition calculation
    const transition = await ambient.transitionSoundscape(
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

    // Test 2: Disabled auto-transition
    ambient.updateSettings({ autoTransition: false });
    const skippedTransition = await ambient.transitionSoundscape(
      'oceanWaves',
      'gentleRain',
      emotionalState
    );
    this.assert(
      skippedTransition.skipped === true,
      'Transition skipped when auto-transition disabled'
    );
  }

  // Test Suite 9: Presence Philosophy
  testPresencePhilosophy() {
    console.log('\n--- Testing Presence Philosophy ---\n');

    const ambient = new AmbientSoundsModule();

    this.assert(
      ambient.presencePhilosophy.approach === 'gentle',
      'Approach is gentle (not powerful)'
    );

    this.assert(
      ambient.presencePhilosophy.visibility === 'subtle-constant',
      'Visibility is subtle-constant (always there, quietly)'
    );

    this.assert(
      ambient.presencePhilosophy.energy === 'natural-rhythm',
      'Energy follows natural rhythms'
    );

    this.assert(
      ambient.presencePhilosophy.purpose === 'atmospheric-support',
      'Purpose is atmospheric support (not dominating)'
    );
  }

  // Test Suite 10: Volume Limits
  async testVolumeLimits() {
    console.log('\n--- Testing Volume Limits (Gentle Constraint) ---\n');

    const ambient = new AmbientSoundsModule();

    // Test with extreme intensity
    const extremeState = {
      primary: 'anger',
      intensity: 1.0,
      vulnerability: 1.0,
      energy: 1.0
    };

    const soundscape = await ambient.generateSoundscape('oceanWaves', extremeState);

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

    const quietSoundscape = await ambient.generateSoundscape('gentleStream', minimalState);

    this.assert(
      quietSoundscape.parameters.volume >= 0.1,
      'Volume stays audible (minimum presence)'
    );
  }

  // Test Suite 11: All Soundscape Types
  async testAllSoundscapeTypes() {
    console.log('\n--- Testing All Soundscape Types ---\n');

    const ambient = new AmbientSoundsModule();

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
      const soundscape = await ambient.generateSoundscape(soundType, emotionalState);

      this.assert(
        soundscape !== null && soundscape.type === soundType,
        `${soundType} generates successfully`
      );
    }
  }

  // Test Suite 12: Integration with Emotional Engine
  async testEmotionalEngineIntegration() {
    console.log('\n--- Testing Emotional Engine Integration ---\n');

    const ambient = new AmbientSoundsModule();

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
    const soundType = ambient.selectSoundscape(emotionalState);

    // Step 3: Generate soundscape
    const soundscape = await ambient.generateSoundscape(soundType, emotionalState);

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

    this.assert(
      soundscape.userSettings.enabled === true,
      'Integration: User settings included in output'
    );
  }

  // Test Suite 13: Constructor with Custom Settings
  testCustomConstructor() {
    console.log('\n--- Testing Custom Constructor Settings ---\n');

    const customSettings = {
      enabled: false,
      volumeMultiplier: 0.3,
      fadeSpeed: 'slow',
      blockedSoundscapes: ['campfire']
    };

    const ambient = new AmbientSoundsModule(customSettings);

    this.assert(
      ambient.isEnabled() === false,
      'Custom enabled setting respected'
    );

    this.assert(
      ambient.getSettings().volumeMultiplier === 0.3,
      'Custom volume setting respected'
    );

    this.assert(
      ambient.getSettings().fadeSpeed === 'slow',
      'Custom fade speed setting respected'
    );

    this.assert(
      ambient.getSettings().blockedSoundscapes.includes('campfire'),
      'Custom blocked soundscapes respected'
    );
  }

  // Run All Tests
  async runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log(' GENESIS LUNA - AMBIENT SOUNDS MODULE TESTS');
    console.log(' "Gentle yet show presence" + User Toggle Control');
    console.log('='.repeat(60));

    this.testUserToggle();
    this.testUserSettings();
    this.testSoundscapeSelection();
    this.testBlockedSoundscapeFallback();
    await this.testParameterCalculation();
    await this.testSoundscapeGeneration();
    await this.testVolumeMultiplier();
    await this.testTransitions();
    this.testPresencePhilosophy();
    await this.testVolumeLimits();
    await this.testAllSoundscapeTypes();
    await this.testEmotionalEngineIntegration();
    this.testCustomConstructor();

    console.log('\n' + '='.repeat(60));
    console.log(` Tests Passed: ${this.testsPassed}`);
    console.log(` Tests Failed: ${this.testsFailed}`);
    console.log(` Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`);
    console.log('='.repeat(60));

    if (this.testsFailed === 0) {
      console.log('\n ALL TESTS PASSED! Natural soundscapes with user control are alive!\n');
    } else {
      console.log('\n Some tests failed. Review and fix before deployment.\n');
    }

    return this.testsFailed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new AmbientSoundsModuleTester();
  tester.runAllTests().catch(console.error);
}

module.exports = AmbientSoundsModuleTester;
