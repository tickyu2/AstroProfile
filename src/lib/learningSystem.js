/**
 * Learning & Adaptation System (Phase 3)
 * Learns from conversation patterns and adapts detection
 */

export class LearningSystem {
  constructor() {
    this.feedbackHistory = [];
    this.patternAccuracy = new Map();
    this.archetypeAccuracy = new Map();
    this.adaptations = [];
    this.minFeedbackForAdaptation = 20;
    this.lowAccuracyThreshold = 0.7;
  }

  /**
   * Record feedback on a response
   */
  recordFeedback(analysis, response, feedback) {
    const record = {
      timestamp: Date.now(),
      analysis: {
        archetype: analysis.archetype.type,
        confidence: analysis.archetype.confidence,
        patterns: analysis.congruence.patterns,
        advancedPatterns: analysis.congruence.advancedPatterns?.map(p => p.pattern)
      },
      response: {
        text: response.text,
        source: response.source
      },
      feedback: {
        rating: feedback.rating, // 1-5
        accurate: feedback.accurate, // boolean
        helpful: feedback.helpful, // boolean
        comments: feedback.comments
      }
    };

    this.feedbackHistory.push(record);
    this.updateAccuracyMetrics(record);
    this.checkForAdaptations();
  }

  /**
   * Update accuracy metrics
   */
  updateAccuracyMetrics(record) {
    const { archetype, patterns, advancedPatterns } = record.analysis;
    const { accurate } = record.feedback;

    // Update archetype accuracy
    if (!this.archetypeAccuracy.has(archetype)) {
      this.archetypeAccuracy.set(archetype, {
        total: 0,
        accurate: 0,
        accuracy: 0
      });
    }

    const archetypeStats = this.archetypeAccuracy.get(archetype);
    archetypeStats.total++;
    if (accurate) archetypeStats.accurate++;
    archetypeStats.accuracy = archetypeStats.accurate / archetypeStats.total;

    // Update pattern accuracy
    const allPatterns = [...(patterns || []), ...(advancedPatterns || [])];
    allPatterns.forEach(pattern => {
      if (!this.patternAccuracy.has(pattern)) {
        this.patternAccuracy.set(pattern, {
          total: 0,
          accurate: 0,
          accuracy: 0
        });
      }

      const patternStats = this.patternAccuracy.get(pattern);
      patternStats.total++;
      if (accurate) patternStats.accurate++;
      patternStats.accuracy = patternStats.accurate / patternStats.total;
    });
  }

  /**
   * Check if adaptations are needed
   */
  checkForAdaptations() {
    const recentFeedback = this.feedbackHistory.slice(-50); // Last 50 feedbacks

    if (recentFeedback.length < this.minFeedbackForAdaptation) return; // Need minimum data

    // Check archetype accuracy
    for (const [archetype, stats] of this.archetypeAccuracy.entries()) {
      if (stats.total >= 10 && stats.accuracy < this.lowAccuracyThreshold) {
        this.suggestAdaptation({
          type: 'archetype_threshold',
          archetype,
          currentAccuracy: stats.accuracy,
          suggestion: 'Adjust confidence threshold or signal weights',
          priority: 'HIGH'
        });
      }
    }

    // Check pattern accuracy
    for (const [pattern, stats] of this.patternAccuracy.entries()) {
      if (stats.total >= 10 && stats.accuracy < this.lowAccuracyThreshold) {
        this.suggestAdaptation({
          type: 'pattern_threshold',
          pattern,
          currentAccuracy: stats.accuracy,
          suggestion: 'Adjust pattern detection confidence threshold',
          priority: 'MEDIUM'
        });
      }
    }

    // Check response helpfulness
    const helpfulFeedback = recentFeedback.filter(f => f.feedback.helpful !== undefined);
    if (helpfulFeedback.length > 0) {
      const avgHelpfulness = helpfulFeedback
        .reduce((sum, f) => sum + (f.feedback.helpful ? 1 : 0), 0) / helpfulFeedback.length;

      if (avgHelpfulness < 0.6) {
        this.suggestAdaptation({
          type: 'response_strategy',
          currentHelpfulness: avgHelpfulness,
          suggestion: 'Review response generation strategies',
          priority: 'HIGH'
        });
      }
    }
  }

  /**
   * Suggest an adaptation
   */
  suggestAdaptation(adaptation) {
    adaptation.timestamp = Date.now();
    adaptation.id = `adapt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Don't duplicate
    const exists = this.adaptations.some(a =>
      a.type === adaptation.type &&
      (a.archetype === adaptation.archetype || a.pattern === adaptation.pattern)
    );

    if (!exists) {
      this.adaptations.push(adaptation);
      console.log('[Learning] New adaptation suggested:', adaptation);
    }
  }

  /**
   * Get learning insights
   */
  getInsights() {
    return {
      totalFeedback: this.feedbackHistory.length,
      archetypeAccuracy: Object.fromEntries(
        Array.from(this.archetypeAccuracy.entries()).map(([k, v]) => [
          k,
          { accuracy: (v.accuracy * 100).toFixed(1) + '%', total: v.total }
        ])
      ),
      patternAccuracy: Object.fromEntries(
        Array.from(this.patternAccuracy.entries()).map(([k, v]) => [
          k,
          { accuracy: (v.accuracy * 100).toFixed(1) + '%', total: v.total }
        ])
      ),
      suggestedAdaptations: this.adaptations.filter(a => !a.applied),
      recentFeedback: this.feedbackHistory.slice(-10)
    };
  }

  /**
   * Apply an adaptation
   */
  applyAdaptation(adaptationId) {
    const adaptation = this.adaptations.find(a => a.id === adaptationId);
    if (adaptation) {
      adaptation.applied = true;
      adaptation.appliedAt = Date.now();
      console.log('[Learning] Adaptation applied:', adaptation);
      return adaptation;
    }
    return null;
  }

  /**
   * Export learning data
   */
  exportData() {
    return {
      feedbackHistory: this.feedbackHistory,
      archetypeAccuracy: Object.fromEntries(this.archetypeAccuracy),
      patternAccuracy: Object.fromEntries(this.patternAccuracy),
      adaptations: this.adaptations,
      exportedAt: Date.now()
    };
  }

  /**
   * Import learning data
   */
  importData(data) {
    this.feedbackHistory = data.feedbackHistory || [];
    this.archetypeAccuracy = new Map(Object.entries(data.archetypeAccuracy || {}));
    this.patternAccuracy = new Map(Object.entries(data.patternAccuracy || {}));
    this.adaptations = data.adaptations || [];
    console.log('[Learning] Data imported, feedback count:', this.feedbackHistory.length);
  }

  /**
   * Clear all learning data
   */
  clearData() {
    this.feedbackHistory = [];
    this.patternAccuracy = new Map();
    this.archetypeAccuracy = new Map();
    this.adaptations = [];
    console.log('[Learning] All data cleared');
  }
}
