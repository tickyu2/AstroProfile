/**
 * Tests for Advanced Congruence Patterns
 */

import { describe, it, expect } from 'vitest';
import { AdvancedCongruenceDetector } from '../src/lib/realtime/advancedCongruencePatterns.js';
import { EnhancedCongruenceService } from '../src/lib/realtime/emotionCongruenceService.enhanced.js';
import { OptimizedSignalExtractor } from '../src/lib/optimized/signalExtractor.optimized.js';
import { OptimizedArchetypeDetector } from '../src/lib/optimized/archetypeDetector.optimized.js';

describe('Advanced Congruence Patterns', () => {
  const detector = new AdvancedCongruenceDetector();
  const congruenceService = new EnhancedCongruenceService();
  const signalExtractor = new OptimizedSignalExtractor();
  const archetypeDetector = new OptimizedArchetypeDetector();

  describe('Pattern Detection', () => {
    it('should detect DEFENSIVE_DEFLECTION', () => {
      const text = "Ha ha, that's funny! So what are we doing tomorrow?";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.75 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const deflection = patterns.find(p => p.pattern === 'DEFENSIVE_DEFLECTION');

      expect(deflection).toBeTruthy();
      expect(deflection.confidence).toBeGreaterThan(0.5);
    });

    it('should detect VULNERABILITY_MASKING', () => {
      const text = "It's really not a big deal, I'm fine.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'sad', confidence: 0.85 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const masking = patterns.find(p => p.pattern === 'VULNERABILITY_MASKING');

      expect(masking).toBeTruthy();
      expect(masking.confidence).toBeGreaterThan(0.7);
    });

    it('should detect EXCITEMENT_DAMPENING', () => {
      const text = "Yeah, I guess it's kind of nice.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'happy', confidence: 0.80 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const dampening = patterns.find(p => p.pattern === 'EXCITEMENT_DAMPENING');

      expect(dampening).toBeTruthy();
      expect(dampening.confidence).toBeGreaterThan(0.5);
    });

    it('should detect ANGER_LEAKAGE', () => {
      const text = "Fine. Whatever.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'angry', confidence: 0.70 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const leakage = patterns.find(p => p.pattern === 'ANGER_LEAKAGE');

      expect(leakage).toBeTruthy();
      expect(leakage.confidence).toBeGreaterThan(0.6);
    });

    it('should detect ANXIETY_PROJECTION', () => {
      const text = "Are you okay? You seem upset.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.75 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const projection = patterns.find(p => p.pattern === 'ANXIETY_PROJECTION');

      expect(projection).toBeTruthy();
      expect(projection.confidence).toBeGreaterThan(0.7);
    });

    it('should detect OVERWHELM_SHUTDOWN', () => {
      const text = "Okay.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'neutral', confidence: 0.60 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const shutdown = patterns.find(p => p.pattern === 'OVERWHELM_SHUTDOWN');

      expect(shutdown).toBeTruthy();
      expect(shutdown.confidence).toBeGreaterThan(0.7);
    });

    it('should detect FORCED_POSITIVITY', () => {
      const text = "Everything is AMAZING!!! I'm so happy!!!";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'sad', confidence: 0.70 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const forced = patterns.find(p => p.pattern === 'FORCED_POSITIVITY');

      expect(forced).toBeTruthy();
      expect(forced.confidence).toBeGreaterThan(0.7);
    });

    it('should detect INTELLECTUAL_DISTANCING', () => {
      const text = "Psychologically speaking, this reaction is quite normal.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.70 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const distancing = patterns.find(p => p.pattern === 'INTELLECTUAL_DISTANCING');

      expect(distancing).toBeTruthy();
      expect(distancing.confidence).toBeGreaterThan(0.6);
    });

    it('should detect HELP_SEEKING_DISGUISED', () => {
      const text = "I'm just wondering... if someone were in this situation...";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.75 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const disguised = patterns.find(p => p.pattern === 'HELP_SEEKING_DISGUISED');

      expect(disguised).toBeTruthy();
      expect(disguised.confidence).toBeGreaterThan(0.7);
    });

    it('should detect EMOTIONAL_FLOODING', () => {
      const text = "I'm just so... I don't know... it's like everything is... I mean, you know?";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.80 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const flooding = patterns.find(p => p.pattern === 'EMOTIONAL_FLOODING');

      expect(flooding).toBeTruthy();
      expect(flooding.confidence).toBeGreaterThan(0.6);
    });

    it('should detect GUILT_MASKING', () => {
      const text = "Well, you didn't tell me clearly enough!";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.70 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const guilt = patterns.find(p => p.pattern === 'GUILT_MASKING');

      expect(guilt).toBeTruthy();
      expect(guilt.confidence).toBeGreaterThan(0.6);
    });

    it('should detect JOY_SUPPRESSION', () => {
      const text = "I mean, I guess I'm satisfied with the result.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'happy', confidence: 0.65 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const suppression = patterns.find(p => p.pattern === 'JOY_SUPPRESSION');

      expect(suppression).toBeTruthy();
      expect(suppression.confidence).toBeGreaterThan(0.6);
    });

    it('should detect TRAUMA_RESPONSE', () => {
      const text = "And then the person said this, and then that happened.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'neutral', confidence: 0.75 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const trauma = patterns.find(p => p.pattern === 'TRAUMA_RESPONSE');

      expect(trauma).toBeTruthy();
      expect(trauma.confidence).toBeGreaterThan(0.6);
    });

    it('should detect PERFORMATIVE_EMOTION', () => {
      const text = "Oh my GOD I am SO shocked right now!!!";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'surprised', confidence: 0.90 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const performative = patterns.find(p => p.pattern === 'PERFORMATIVE_EMOTION');

      expect(performative).toBeTruthy();
      expect(performative.confidence).toBeGreaterThan(0.6);
    });

    it('should detect RESIGNATION_ACCEPTANCE', () => {
      const text = "It doesn't matter anymore. I'm fine with whatever.";
      const signals = signalExtractor.extract(text);
      const voiceEmotion = { emotion: 'sad', confidence: 0.60 };

      const patterns = detector.detectAll(signals, voiceEmotion, text);
      const resignation = patterns.find(p => p.pattern === 'RESIGNATION_ACCEPTANCE');

      expect(resignation).toBeTruthy();
      expect(resignation.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('Enhanced Congruence Service', () => {
    it('should integrate basic and advanced patterns', () => {
      const text = "I'm totally fine! Everything is great!";
      const signals = signalExtractor.extract(text);
      const archetype = archetypeDetector.detect(signals);
      const voiceEmotion = { emotion: 'sad', confidence: 0.75 };

      const analysis = congruenceService.analyze(signals, voiceEmotion, archetype, text);

      expect(analysis.totalPatternsDetected).toBeGreaterThan(0);
      expect(analysis.advancedPatterns).toBeDefined();
      expect(analysis.complexity).toBeDefined();
    });

    it('should identify priority patterns correctly', () => {
      const text = "Okay.";
      const signals = signalExtractor.extract(text);
      const archetype = archetypeDetector.detect(signals);
      const voiceEmotion = { emotion: 'neutral', confidence: 0.60 };

      const analysis = congruenceService.analyze(signals, voiceEmotion, archetype, text);

      expect(analysis.priorityPattern).toBeTruthy();
      expect(analysis.priorityPattern.pattern).toBe('OVERWHELM_SHUTDOWN');
    });

    it('should detect high complexity scenarios', () => {
      const text = "Ha ha, that's so funny! But seriously, are you okay? I'm just wondering...";
      const signals = signalExtractor.extract(text);
      const archetype = archetypeDetector.detect(signals);
      const voiceEmotion = { emotion: 'anxious', confidence: 0.80 };

      const analysis = congruenceService.analyze(signals, voiceEmotion, archetype, text);

      expect(analysis.totalPatternsDetected).toBeGreaterThanOrEqual(2);
      expect(analysis.complexity).toBe('HIGH');
    });

    it('should flag patterns requiring special handling', () => {
      const text = "Okay.";
      const signals = signalExtractor.extract(text);
      const archetype = archetypeDetector.detect(signals);
      const voiceEmotion = { emotion: 'neutral', confidence: 0.60 };

      const analysis = congruenceService.analyze(signals, voiceEmotion, archetype, text);

      expect(analysis.requiresSpecialHandling).toBe(true);
    });
  });
});
