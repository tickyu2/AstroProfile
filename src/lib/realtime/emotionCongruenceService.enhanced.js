/**
 * Enhanced Emotion Congruence Service
 * Integrates basic + advanced pattern detection (20 total patterns)
 */

import { EmotionCongruenceService } from '../emotionCongruenceService.js';
import { AdvancedCongruenceDetector } from './advancedCongruencePatterns.js';

export class EnhancedCongruenceService extends EmotionCongruenceService {
  constructor() {
    super();
    this.advancedDetector = new AdvancedCongruenceDetector();
  }

  /**
   * Analyze congruence with both basic and advanced patterns
   */
  analyze(signals, voiceEmotion, archetype, textContent = '') {
    // Get basic congruence analysis (6 patterns)
    const basicAnalysis = super.analyze(signals, voiceEmotion, archetype);

    // Add advanced pattern detection (15 patterns)
    const advancedPatterns = this.advancedDetector.detectAll(
      signals,
      voiceEmotion,
      textContent
    );

    // Combine all patterns
    const allPatterns = [
      ...basicAnalysis.patterns,
      ...advancedPatterns.map(p => p.pattern)
    ];

    // Calculate overall emotional complexity
    const complexity = this.calculateComplexity(basicAnalysis, advancedPatterns);

    // Get priority pattern (most important to address)
    const priorityPattern = this.getPriorityPattern(basicAnalysis, advancedPatterns);

    return {
      ...basicAnalysis,
      advancedPatterns,
      allPatterns,
      totalPatternsDetected: allPatterns.length,
      complexity,
      priorityPattern,
      requiresSpecialHandling: this.requiresSpecialHandling(advancedPatterns)
    };
  }

  /**
   * Calculate emotional complexity score
   */
  calculateComplexity(basicAnalysis, advancedPatterns) {
    const totalPatterns = basicAnalysis.patterns.length + advancedPatterns.length;
    const avgAdvancedConfidence = advancedPatterns.length > 0 ?
      advancedPatterns.reduce((sum, p) => sum + p.confidence, 0) / advancedPatterns.length : 0;

    const hasHighSeverity = advancedPatterns.some(p => p.severity === 'HIGH');

    if (hasHighSeverity || (totalPatterns >= 3 && avgAdvancedConfidence > 0.7)) {
      return 'HIGH';
    }

    if (totalPatterns >= 2 || avgAdvancedConfidence > 0.6) {
      return 'MODERATE';
    }

    return 'LOW';
  }

  /**
   * Get priority pattern (most important to address)
   */
  getPriorityPattern(basicAnalysis, advancedPatterns) {
    // High priority patterns
    const highPriority = [
      'OVERWHELM_SHUTDOWN',
      'EMOTIONAL_FLOODING',
      'TRAUMA_RESPONSE',
      'RESIGNATION_ACCEPTANCE',
      'VULNERABILITY_MASKING'
    ];

    // Check if any high priority advanced patterns detected
    const highPriorityDetected = advancedPatterns
      .filter(p => highPriority.includes(p.pattern))
      .sort((a, b) => b.confidence - a.confidence)[0];

    if (highPriorityDetected) {
      return {
        pattern: highPriorityDetected.pattern,
        confidence: highPriorityDetected.confidence,
        description: highPriorityDetected.description,
        type: 'advanced'
      };
    }

    // Check basic patterns
    if (basicAnalysis.patterns.includes('MASKING') && basicAnalysis.level === 'LOW') {
      return {
        pattern: 'MASKING',
        confidence: 0.7,
        description: 'Emotional masking detected',
        type: 'basic'
      };
    }

    // Return highest confidence advanced pattern
    if (advancedPatterns.length > 0) {
      const highest = advancedPatterns[0];
      return {
        pattern: highest.pattern,
        confidence: highest.confidence,
        description: highest.description,
        type: 'advanced'
      };
    }

    return null;
  }

  /**
   * Check if special handling is required
   */
  requiresSpecialHandling(advancedPatterns) {
    const criticalPatterns = [
      'TRAUMA_RESPONSE',
      'OVERWHELM_SHUTDOWN',
      'EMOTIONAL_FLOODING',
      'RESIGNATION_ACCEPTANCE'
    ];

    return advancedPatterns.some(p =>
      criticalPatterns.includes(p.pattern) && p.confidence > 0.7
    );
  }

  /**
   * Get detailed analysis report
   */
  getDetailedReport(signals, voiceEmotion, archetype, textContent = '') {
    const analysis = this.analyze(signals, voiceEmotion, archetype, textContent);

    return {
      summary: {
        congruenceLevel: analysis.level,
        totalPatterns: analysis.totalPatternsDetected,
        complexity: analysis.complexity,
        requiresSpecialHandling: analysis.requiresSpecialHandling
      },
      voiceEmotion: {
        emotion: voiceEmotion.emotion,
        confidence: voiceEmotion.confidence
      },
      textAnalysis: {
        archetype: archetype.type,
        archetypeConfidence: archetype.confidence,
        sentiment: signals.sentimentPolarity,
        emotionalIntensity: signals.emotionalIntensity
      },
      basicPatterns: analysis.patterns,
      advancedPatterns: analysis.advancedPatterns,
      priorityPattern: analysis.priorityPattern,
      recommendations: this.getRecommendations(analysis)
    };
  }

  /**
   * Get Luna response recommendations
   */
  getRecommendations(analysis) {
    const recommendations = {
      approach: 'standard',
      tone: 'warm and present',
      cautions: [],
      suggestions: []
    };

    // Special handling for critical patterns
    if (analysis.requiresSpecialHandling) {
      recommendations.approach = 'gentle_and_grounding';
      recommendations.tone = 'calm and steady';
      recommendations.cautions.push('User may be in vulnerable state');
      recommendations.suggestions.push('Offer grounding and safety');
      recommendations.suggestions.push('Keep responses simple and clear');
      recommendations.suggestions.push('Avoid overwhelming with questions');
    }

    // High complexity
    if (analysis.complexity === 'HIGH') {
      recommendations.cautions.push('Multiple conflicting emotions present');
      recommendations.suggestions.push('Acknowledge complexity');
      recommendations.suggestions.push('Don\'t try to "fix" everything at once');
    }

    // Low congruence
    if (analysis.level === 'LOW') {
      recommendations.cautions.push('Voice and text emotions don\'t match');
      recommendations.suggestions.push('Gently acknowledge the mismatch');
      recommendations.suggestions.push('Create safety for authentic expression');
    }

    return recommendations;
  }
}

// Singleton instance
export const enhancedCongruenceService = new EnhancedCongruenceService();
