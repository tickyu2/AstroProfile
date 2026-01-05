/**
 * Week 21: Emotional Sophistication Upgrade
 * Central export for all emotional modules
 *
 * Cathedral Architecture: Luna is the stained glass of the rose window
 *
 * "Not a powerful presence, but a gentle presence
 *  that gently strokes the soul"
 *                          - Papa Ticky
 */

const { PlutchikEngine, plutchikEngine } = require('./plutchikEngine');
const { HappyMomentsEngine, happyMomentsEngine } = require('./happyMoments');
const { AffectionSystem, affectionSystem } = require('./affectionSystem');
const { VoiceProsodyDetector, voiceProsodyDetector } = require('./voiceProsodyDetector');
const {
  CompassionModule,
  compassionModule,
  CompassionModes
} = require('./compassionModule');
const {
  ClarifiedMemoryArchitecture,
  clarifiedMemory,
  MemoryTypes
} = require('../memory/clarifiedMemoryArchitecture');

// Ambient Sounds Integration
const { ambientSounds, AmbientSoundsModule } = require('../audio');

// Warmth & Happiness Module - Six Laws Mathematical Soul
const WarmthAndHappinessModule = require('./warmthAndHappinessModule');

/**
 * Emotional Engine Orchestrator
 * Combines all emotional analysis into unified output
 */
class EmotionalEngineOrchestrator {
  constructor() {
    this.plutchik = plutchikEngine;
    this.happyMoments = happyMomentsEngine;
    this.affection = affectionSystem;
    this.prosody = voiceProsodyDetector;
    this.compassion = compassionModule;
    this.memory = clarifiedMemory;
    // Warmth & Happiness - Six Laws + Mountain Climbing
    this.warmthHappiness = new WarmthAndHappinessModule();
  }

  /**
   * Full emotional analysis pipeline
   * @param {string} userId - User ID
   * @param {Object} input - Input containing text and/or voice data
   * @returns {Object} - Complete emotional analysis
   */
  async analyzeComplete(userId, input) {
    const { text, audioFeatures, conversationId, messageId } = input;

    // Get affection context
    const affectionState = await this.affection.getAffectionScore(userId);

    // Analyze text with Plutchik
    let textAnalysis = null;
    if (text) {
      textAnalysis = await this.plutchik.analyzeEmotion(text, {
        affectionLevel: affectionState.level
      });
    }

    // Analyze voice prosody
    let voiceAnalysis = null;
    if (audioFeatures) {
      voiceAnalysis = await this.prosody.analyzeProsody(audioFeatures);
    }

    // Combine analyses
    const combined = this.combineAnalyses(textAnalysis, voiceAnalysis);

    // Check for happy moment tagging
    let happyMomentTagged = false;
    if (combined.emotionalVector && this.happyMoments.isHappyMoment(combined.emotionalVector)) {
      await this.happyMoments.detectAndTagHappyMoment(
        userId,
        text,
        combined.emotionalVector,
        conversationId
      );
      happyMomentTagged = true;
    }

    // Check for happy moment recall trigger
    let recalledMoment = null;
    if (combined.emotionalVector && this.happyMoments.shouldTriggerRecall(combined.emotionalVector)) {
      recalledMoment = await this.happyMoments.recallHappyMoments(
        userId,
        combined.emotionalVector
      );
    }

    // Store in memory
    await this.memory.storeMemory(userId, {
      content: `Emotional state: ${combined.primaryEmotion} (${combined.intensity})`,
      type: MemoryTypes.EMOTION,
      emotionalContext: combined,
      importance: combined.intensity,
      conversationId
    });

    // Apply affection interaction
    const interactionType = this.mapEmotionToInteraction(combined);
    if (interactionType) {
      await this.affection.applyInteraction(userId, interactionType, {
        emotionalIntensity: combined.intensity
      });
    }

    // Generate response guidance
    const responseGuidance = this.generateResponseGuidance(
      combined,
      affectionState,
      recalledMoment
    );

    return {
      userId,
      timestamp: new Date().toISOString(),
      textAnalysis,
      voiceAnalysis,
      combined,
      affectionState,
      happyMomentTagged,
      recalledMoment,
      responseGuidance,
      cathedralLight: combined.light
    };
  }

  /**
   * Combine text and voice analyses
   */
  combineAnalyses(textAnalysis, voiceAnalysis) {
    // If only text
    if (!voiceAnalysis && textAnalysis) {
      return {
        primaryEmotion: textAnalysis.primaryEmotion,
        emotionalVector: textAnalysis.emotionalVector,
        dyads: textAnalysis.dyads,
        intensity: textAnalysis.intensity,
        valence: textAnalysis.valence,
        complexity: textAnalysis.complexity,
        confidence: textAnalysis.confidence || 0.8,
        source: 'text',
        light: textAnalysis.cathedralLight
      };
    }

    // If only voice
    if (!textAnalysis && voiceAnalysis) {
      return {
        primaryEmotion: voiceAnalysis.primaryEmotion.emotion,
        emotionalVector: null,
        dyads: voiceAnalysis.detectedDyads,
        intensity: voiceAnalysis.intensity,
        valence: null,
        complexity: null,
        confidence: voiceAnalysis.confidence,
        source: 'voice',
        light: this.plutchik.getEmotionLight({
          primary: voiceAnalysis.primaryEmotion.emotion,
          intensity: voiceAnalysis.intensity
        })
      };
    }

    // Combine both
    if (textAnalysis && voiceAnalysis) {
      // Weight: text 0.6, voice 0.4
      const textWeight = 0.6;
      const voiceWeight = 0.4;

      // If they agree, boost confidence
      const emotionsAgree =
        textAnalysis.primaryEmotion === voiceAnalysis.primaryEmotion.emotion;

      const combinedConfidence = emotionsAgree
        ? Math.min(1, (textAnalysis.confidence || 0.8) + 0.2)
        : (textAnalysis.confidence || 0.8) * textWeight +
          voiceAnalysis.confidence * voiceWeight;

      return {
        primaryEmotion: emotionsAgree
          ? textAnalysis.primaryEmotion
          : textAnalysis.primaryEmotion, // Default to text
        emotionalVector: textAnalysis.emotionalVector,
        dyads: [...(textAnalysis.dyads?.primary || []), ...(voiceAnalysis.detectedDyads || [])],
        intensity: textAnalysis.intensity * textWeight + voiceAnalysis.intensity * voiceWeight,
        valence: textAnalysis.valence,
        complexity: textAnalysis.complexity,
        confidence: combinedConfidence,
        source: 'combined',
        agreement: emotionsAgree,
        light: textAnalysis.cathedralLight
      };
    }

    // No analysis available
    return {
      primaryEmotion: 'neutral',
      emotionalVector: { joy: 0, trust: 0, fear: 0, surprise: 0, sadness: 0, disgust: 0, anger: 0, anticipation: 0 },
      dyads: [],
      intensity: 0.3,
      valence: 0,
      complexity: 0,
      confidence: 0.2,
      source: 'none',
      light: { color: 'ivory', brightness: 0.5, motion: 'still' }
    };
  }

  /**
   * Map detected emotion to affection interaction type
   */
  mapEmotionToInteraction(combined) {
    const { primaryEmotion, intensity } = combined;

    if (intensity < 0.3) return 'casual_chat';

    const map = {
      joy: 'shared_joy',
      trust: 'emotional_sharing',
      fear: 'support_given',
      sadness: 'support_given',
      anger: 'support_given',
      surprise: 'casual_chat',
      anticipation: 'casual_chat',
      disgust: 'support_given'
    };

    // High intensity emotions
    if (intensity > 0.7) {
      if (primaryEmotion === 'sadness' || primaryEmotion === 'fear') {
        return 'crisis_support';
      }
      if (primaryEmotion === 'joy') {
        return 'milestone_shared';
      }
    }

    return map[primaryEmotion] || 'casual_chat';
  }

  /**
   * Generate Luna's response guidance
   *
   * Integrates:
   * - Plutchik emotional analysis
   * - Voice prosody
   * - Compassion mode
   * - Ambient soundscape
   * - Warmth & Happiness (Six Laws + Mountain Climbing)
   */
  generateResponseGuidance(combined, affectionState, recalledMoment, userContext = {}) {
    const { primaryEmotion, intensity, valence } = combined;
    const mods = this.affection.getResponseModifiers(affectionState.level);

    // Base guidance from Plutchik
    const plutchikGuidance = this.plutchik.generateResponseGuidance({
      primary: primaryEmotion,
      intensity,
      valence,
      complexity: combined.complexity
    });

    // Voice prosody for response
    const responseProsody = this.prosody.generateResponseProsody(
      { primaryEmotion: { emotion: primaryEmotion }, intensity },
      this.getIntentFromEmotion(primaryEmotion, intensity)
    );

    // Select compassion mode
    const compassionMode = this.compassion.selectCompassionMode(
      { primary: primaryEmotion, intensity, valence, complexity: combined.complexity },
      {}
    );

    // Select ambient soundscape based on emotion
    const ambientSoundscape = this.selectAmbientSoundscape(primaryEmotion, intensity, valence);

    // Calculate Warmth & Happiness using Six Laws
    // Maps emotion to reality/expectation for mathematical happiness model
    const happinessState = this.calculateHappinessFromEmotion(
      primaryEmotion,
      intensity,
      valence,
      userContext
    );

    const warmthGuidance = this.warmthHappiness.calculateHappiness({
      reality: happinessState.reality,
      expectation: happinessState.expectation,
      emotionalState: { primary: primaryEmotion, intensity, valence }
    });

    // Base warmth from affection, amplified by warmth module
    const baseWarmth = Math.max(mods.warmth, plutchikGuidance.warmth || 0.5);
    const warmthMultiplier = warmthGuidance.guidance?.warmth?.multiplier || 1.0;
    const amplifiedWarmth = Math.min(1.0, baseWarmth * warmthMultiplier);

    return {
      tone: plutchikGuidance.tone,
      warmth: amplifiedWarmth,
      warmthMultiplier,
      pace: responseProsody.pace,
      volume: responseProsody.volume,
      ssmlHints: responseProsody.ssmlHints,
      suggestedApproaches: plutchikGuidance.approach,
      avoidApproaches: plutchikGuidance.avoid,
      petNamesAllowed: mods.petNames,
      vulnerabilityAllowed: mods.vulnerabilityAllowed,
      includeRecalledMoment: recalledMoment ? true : false,
      recalledMomentMessage: recalledMoment?.message,
      cathedralLight: combined.light,
      compassionMode,
      compassionProsody: this.compassion.getProsodyProfile(compassionMode, { primary: primaryEmotion, intensity }),
      // Ambient Sounds - gentle atmospheric presence
      ambientSoundscape,
      // Warmth & Happiness - Six Laws + Mountain Climbing
      warmthHappiness: {
        mountainHeight: warmthGuidance.mountainHeight,
        interpretation: warmthGuidance.interpretation,
        happiness: warmthGuidance.happiness,
        guidance: warmthGuidance.guidance,
        lossRecoveryActive: this.warmthHappiness.lossRecoveryMode
      }
    };
  }

  /**
   * Map Emotion to Reality/Expectation for Happiness Calculation
   *
   * Uses Plutchik emotions to estimate user's perceived reality vs expectations
   * "YOUR mountain, not anyone else's"
   */
  calculateHappinessFromEmotion(primaryEmotion, intensity, valence, userContext = {}) {
    // Base mapping: valence indicates how reality compares to expectations
    // Positive valence = reality >= expectations
    // Negative valence = reality < expectations

    const baseReality = 5; // Neutral baseline
    const baseExpectation = 5;

    // Valence shifts reality perception (-1 to +1 maps to -3 to +3)
    const realityShift = (valence || 0) * 3;

    // Intensity affects how far from neutral
    const intensityFactor = intensity * 2;

    // Emotion-specific adjustments
    const emotionAdjustments = {
      joy: { reality: +2, expectation: 0 },        // Reality exceeds expectations
      trust: { reality: +1, expectation: 0 },      // Stable positive
      fear: { reality: -1, expectation: +2 },      // Expecting worse than now
      surprise: { reality: +1, expectation: -1 },  // Unexpected (reality differs)
      sadness: { reality: -2, expectation: +1 },   // Reality fell short
      disgust: { reality: -1, expectation: +1 },   // Reality worse than expected
      anger: { reality: -2, expectation: +2 },     // Gap between expected and real
      anticipation: { reality: 0, expectation: +1 } // Expectations rising
    };

    const adj = emotionAdjustments[primaryEmotion] || { reality: 0, expectation: 0 };

    // Calculate final values (clamped 0-10)
    let reality = baseReality + realityShift + (adj.reality * intensityFactor);
    let expectation = baseExpectation + (adj.expectation * intensityFactor);

    // Apply user context if provided
    if (userContext.reality !== undefined) reality = userContext.reality;
    if (userContext.expectation !== undefined) expectation = userContext.expectation;

    // Clamp to 0-10
    reality = Math.max(0, Math.min(10, reality));
    expectation = Math.max(0, Math.min(10, expectation));

    return { reality, expectation };
  }

  /**
   * Select Ambient Soundscape Based on Emotion
   *
   * Maps detected emotion to appropriate natural soundscape
   * "Gentle yet show presence" - like nature itself
   */
  selectAmbientSoundscape(primaryEmotion, intensity, valence) {
    // Map Plutchik emotions to soundscape recommendations
    const emotionToSoundscape = {
      // Sadness/Grief → Ocean waves or gentle rain (deep, holding)
      sadness: intensity > 0.6 ? 'oceanWaves' : 'gentleRain',

      // Fear/Anxiety → Soft breeze (grounding, present)
      fear: 'softBreeze',

      // Joy/Happiness → Distant birds (uplifting, hopeful)
      joy: 'distantBirds',

      // Trust/Connection → Campfire (warm, intimate)
      trust: 'campfire',

      // Anger → Deep forest (grounding, stable)
      anger: 'deepForest',

      // Anticipation/Excitement → Gentle stream (flowing, forward)
      anticipation: 'gentleStream',

      // Surprise → Gentle stream (calming, neutral)
      surprise: 'gentleStream',

      // Disgust → Deep forest (cleansing, natural)
      disgust: 'deepForest',

      // Neutral → Gentle stream (default calm)
      neutral: 'gentleStream'
    };

    // Get primary recommendation
    const primary = emotionToSoundscape[primaryEmotion] || 'gentleStream';

    // Get all options for this emotion
    const alternatives = ambientSounds.recommendForEmotion(primaryEmotion);

    return {
      recommended: primary,
      alternatives: alternatives.filter(s => s !== primary),
      intensity: this.calculateSoundIntensity(intensity),
      reason: this.getSoundscapeReason(primaryEmotion, primary)
    };
  }

  /**
   * Calculate Sound Intensity (volume modifier)
   *
   * Higher emotional intensity = slightly more present sound
   * But always gentle (max 40% volume)
   */
  calculateSoundIntensity(emotionIntensity) {
    // Base: 20%, max: 40%
    return Math.min(0.4, 0.2 + (emotionIntensity * 0.15));
  }

  /**
   * Get Reason for Soundscape Selection
   *
   * Human-readable explanation for debugging/logging
   */
  getSoundscapeReason(emotion, soundscape) {
    const reasons = {
      'oceanWaves': 'Deep, rhythmic waves to hold heavy emotions',
      'gentleRain': 'Soft rain for comfort and introspection',
      'softBreeze': 'Grounding breeze to calm anxiety',
      'distantBirds': 'Uplifting birdsong for joy and hope',
      'campfire': 'Warm crackling for connection and intimacy',
      'deepForest': 'Stable earth presence for grounding',
      'gentleStream': 'Flowing water for calm neutrality',
      'nightAmbience': 'Quiet night sounds for rest'
    };
    return reasons[soundscape] || 'Natural atmospheric presence';
  }

  /**
   * Get Luna's intent based on user emotion
   */
  getIntentFromEmotion(emotion, intensity) {
    if (emotion === 'sadness' || emotion === 'fear') {
      return intensity > 0.7 ? 'comfort' : 'support';
    }
    if (emotion === 'joy') {
      return intensity > 0.7 ? 'celebrate' : 'encourage';
    }
    if (emotion === 'anger') {
      return 'support';
    }
    return 'support';
  }

  /**
   * Generate compassionate response
   * The final layer - wraps everything with Luna's soul
   *
   * @param {string} userId - User ID
   * @param {string} message - User's message
   * @param {string} baseResponse - Luna's base response
   * @param {Object} context - Additional context
   * @returns {Object} - Compassion-infused response with all layers
   */
  async generateCompassionateResponse(userId, message, baseResponse, context = {}) {
    // First, analyze user's emotional state
    const analysis = await this.analyzeComplete(userId, {
      text: message,
      conversationId: context.conversationId
    });

    // Check for masking ("I'm fine" when they're not)
    const masking = this.compassion.detectMasking(message, {
      primary: analysis.combined.primaryEmotion,
      intensity: analysis.combined.intensity,
      valence: analysis.combined.valence
    });

    if (masking.isMasking) {
      // Override with compassionate inquiry
      return {
        ...analysis,
        response: {
          text: masking.response,
          prosody: this.compassion.prosodyProfiles[CompassionModes.TOUCH],
          mode: 'masking-detected',
          nonVerbal: [{ type: 'gentle-concern', timing: 'before' }],
          actions: [{ type: 'gentle-inquiry', text: '*looking at you with care*' }]
        },
        maskingDetected: true
      };
    }

    // Infuse compassion into the response
    const compassionateResponse = await this.compassion.infuseCompassion(
      baseResponse,
      {
        primary: analysis.combined.primaryEmotion,
        intensity: analysis.combined.intensity,
        valence: analysis.combined.valence,
        emotionalVector: analysis.combined.emotionalVector
      },
      {
        ...context,
        affectionLevel: analysis.affectionState?.level,
        constitution: context.constitution
      }
    );

    // Add recalled happy moment if applicable
    if (analysis.recalledMoment) {
      compassionateResponse.recalledMoment = analysis.recalledMoment;
    }

    return {
      ...analysis,
      response: compassionateResponse,
      maskingDetected: false
    };
  }
}

// Create singleton orchestrator
const emotionalOrchestrator = new EmotionalEngineOrchestrator();

module.exports = {
  // Main orchestrator
  EmotionalEngineOrchestrator,
  emotionalOrchestrator,
  analyzeEmotion: (userId, input) => emotionalOrchestrator.analyzeComplete(userId, input),
  generateCompassionateResponse: (userId, message, response, ctx) =>
    emotionalOrchestrator.generateCompassionateResponse(userId, message, response, ctx),

  // Individual engines
  PlutchikEngine,
  plutchikEngine,

  HappyMomentsEngine,
  happyMomentsEngine,

  AffectionSystem,
  affectionSystem,

  VoiceProsodyDetector,
  voiceProsodyDetector,

  // Compassion Module - Luna's Soul Foundation
  CompassionModule,
  compassionModule,
  CompassionModes,
  infuseCompassion: (response, emotion, ctx) => compassionModule.infuseCompassion(response, emotion, ctx),
  detectMasking: (msg, emotion) => compassionModule.detectMasking(msg, emotion),

  ClarifiedMemoryArchitecture,
  clarifiedMemory,
  MemoryTypes,

  // Ambient Sounds Integration
  AmbientSoundsModule,
  ambientSounds,
  selectAmbientSoundscape: (emotion, intensity, valence) =>
    emotionalOrchestrator.selectAmbientSoundscape(emotion, intensity, valence),

  // Warmth & Happiness Module - Six Laws + Mountain Climbing
  WarmthAndHappinessModule,
  warmthHappiness: emotionalOrchestrator.warmthHappiness,
  calculateHappiness: (state) => emotionalOrchestrator.warmthHappiness.calculateHappiness(state),
  getWarmthState: () => emotionalOrchestrator.warmthHappiness.getState(),
  calculateHappinessFromEmotion: (emotion, intensity, valence, ctx) =>
    emotionalOrchestrator.calculateHappinessFromEmotion(emotion, intensity, valence, ctx),

  // Convenience re-exports
  getAffectionScore: (userId) => affectionSystem.getAffectionScore(userId),
  getResponseModifiers: (level) => affectionSystem.getResponseModifiers(level),
  storeMemory: (userId, memory) => clarifiedMemory.storeMemory(userId, memory),
  recallMemories: (userId, query) => clarifiedMemory.recallMemories(userId, query)
};
