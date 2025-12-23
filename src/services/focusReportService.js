/**
 * Focus Report Service
 *
 * Generates "debrief" reports when Luna exits Focus Mode.
 * Transforms invisible cognitive work into tangible, scannable achievements.
 *
 * Report Structure (Result-First Hierarchy):
 * 1. Accomplishment Header - Single bolded sentence summarizing the win
 * 2. Logic Map - 3-step reasoning path from Thought Signatures
 * 3. Resource Vault - Links/references utilized
 * 4. Energy Delta - How much energy the task consumed
 *
 * Part of GENESIS Phase 4 - Advanced Voice Features
 * December 19, 2024
 */

import { focusModeService, FOCUS_MODES } from './focusModeService';
import { lunaEnergyService } from './lunaEnergyService';
import { memoryService } from './memoryService';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const REPORT_TYPES = {
  QUICK: 'quick',       // Brief summary for short sessions
  STANDARD: 'standard', // Normal focus report
  DETAILED: 'detailed'  // Comprehensive with full thought analysis
};

export const REPORT_STATUS = {
  GENERATING: 'generating',
  READY: 'ready',
  SAVED: 'saved',
  ERROR: 'error'
};

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS REPORT SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class FocusReportService {
  constructor() {
    // Session tracking
    this.currentSession = null;
    this.thoughtBuffer = [];      // Collect thought signatures during session
    this.messagesExchanged = [];  // Track messages for context
    this.topicsDiscussed = new Set();
    this.decisionsLogged = [];

    // Report storage
    this.recentReports = [];
    this.maxRecentReports = 10;

    // Callbacks
    this.onReportGenerated = null;
    this.onReportSaved = null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SESSION TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Start tracking a new focus session
   */
  startSession(sessionInfo = {}) {
    this.currentSession = {
      id: `focus_${Date.now()}`,
      startTime: Date.now(),
      startEnergy: lunaEnergyService.getEnergy(),
      focusMode: focusModeService.getMode(),
      ...sessionInfo
    };

    // Reset buffers
    this.thoughtBuffer = [];
    this.messagesExchanged = [];
    this.topicsDiscussed = new Set();
    this.decisionsLogged = [];

    console.log('📊 [FocusReport] Session started:', this.currentSession.id);
    return this.currentSession;
  }

  /**
   * Add a thought signature to the buffer
   */
  addThought(thoughtSignature, thinkingContent = null) {
    if (!this.currentSession) return;

    this.thoughtBuffer.push({
      signature: thoughtSignature,
      content: thinkingContent,
      timestamp: Date.now()
    });
  }

  /**
   * Add a message exchange for context
   */
  addMessage(userMessage, aiResponse, metadata = {}) {
    if (!this.currentSession) return;

    this.messagesExchanged.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: Date.now(),
      thinkingLevel: metadata.thinkingLevel,
      ...metadata
    });

    // Extract topics from messages (simple keyword extraction)
    this.extractTopics(userMessage);
    this.extractTopics(aiResponse);
  }

  /**
   * Log a decision point
   */
  logDecision(decision, reasoning = '') {
    if (!this.currentSession) return;

    this.decisionsLogged.push({
      decision,
      reasoning,
      timestamp: Date.now()
    });
  }

  /**
   * Simple topic extraction
   */
  extractTopics(text) {
    if (!text) return;

    // Extract potential topics (words > 5 chars, capitalized phrases, etc.)
    const words = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    words.forEach(word => {
      if (word.length > 4) {
        this.topicsDiscussed.add(word);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // REPORT GENERATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Generate a focus report when session ends
   */
  async generateReport(options = {}) {
    if (!this.currentSession) {
      return { success: false, error: 'No active session' };
    }

    const {
      type = REPORT_TYPES.STANDARD,
      userId = null,
      profileId = null,
      saveToMemory = true
    } = options;

    const session = this.currentSession;
    const endTime = Date.now();
    const duration = endTime - session.startTime;
    const endEnergy = lunaEnergyService.getEnergy();
    const energyConsumed = session.startEnergy - endEnergy;

    console.log('📊 [FocusReport] Generating report:', {
      sessionId: session.id,
      duration: Math.round(duration / 60000) + 'm',
      messages: this.messagesExchanged.length,
      thoughts: this.thoughtBuffer.length,
      energyConsumed
    });

    try {
      // Build the report
      const report = this.buildReport({
        session,
        endTime,
        duration,
        energyConsumed,
        endEnergy,
        type
      });

      // Save to memory if requested
      if (saveToMemory && userId && profileId) {
        await this.saveReportToMemory(userId, profileId, report);
      }

      // Store in recent reports
      this.recentReports.unshift(report);
      if (this.recentReports.length > this.maxRecentReports) {
        this.recentReports.pop();
      }

      // Clear session
      this.currentSession = null;

      // Notify listeners
      this.onReportGenerated?.(report);

      return {
        success: true,
        report
      };

    } catch (error) {
      console.error('📊 [FocusReport] Generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build the report structure
   */
  buildReport({ session, endTime, duration, energyConsumed, endEnergy, type }) {
    // Determine accomplishment based on session analysis
    const accomplishment = this.generateAccomplishment();

    // Build logic map from thought signatures
    const logicMap = this.buildLogicMap();

    // Compile resource vault
    const resourceVault = this.buildResourceVault();

    // Build energy delta
    const energyDelta = {
      start: session.startEnergy,
      end: endEnergy,
      consumed: energyConsumed,
      efficiency: this.calculateEfficiency(duration, energyConsumed)
    };

    // Format duration
    const durationFormatted = this.formatDuration(duration);

    // Generate summary stats
    const stats = {
      messagesExchanged: this.messagesExchanged.length,
      thoughtsProcessed: this.thoughtBuffer.length,
      decisionsLogged: this.decisionsLogged.length,
      topicsDiscussed: Array.from(this.topicsDiscussed).slice(0, 5)
    };

    // Build next steps
    const nextSteps = this.generateNextSteps();

    return {
      id: `report_${session.id}`,
      sessionId: session.id,
      type,
      status: REPORT_STATUS.READY,
      timestamp: endTime,

      // Core content
      accomplishment,
      logicMap,
      resourceVault,
      energyDelta,

      // Metadata
      duration: durationFormatted,
      durationMs: duration,
      focusMode: session.focusMode,
      stats,

      // Actionable
      nextSteps,
      decisions: this.decisionsLogged.slice(0, 3),

      // Raw data (for detailed view)
      raw: type === REPORT_TYPES.DETAILED ? {
        messages: this.messagesExchanged,
        thoughts: this.thoughtBuffer
      } : null
    };
  }

  /**
   * Generate accomplishment header
   */
  generateAccomplishment() {
    const messageCount = this.messagesExchanged.length;
    const topTopics = Array.from(this.topicsDiscussed).slice(0, 3);
    const decisionCount = this.decisionsLogged.length;

    if (messageCount === 0) {
      return {
        title: "Focus session completed",
        summary: "Ready for the next task."
      };
    }

    // Analyze the last AI response for summary
    const lastExchange = this.messagesExchanged[this.messagesExchanged.length - 1];
    const lastResponse = lastExchange?.ai || '';

    // Simple summary generation
    let title = "";
    if (decisionCount > 0) {
      title = `Made ${decisionCount} key decision${decisionCount > 1 ? 's' : ''}`;
    } else if (topTopics.length > 0) {
      title = `Deep dive on ${topTopics.slice(0, 2).join(' & ')}`;
    } else {
      title = `Processed ${messageCount} exchange${messageCount > 1 ? 's' : ''}`;
    }

    return {
      title,
      summary: lastResponse.slice(0, 150) + (lastResponse.length > 150 ? '...' : ''),
      topics: topTopics
    };
  }

  /**
   * Build logic map from thought signatures
   */
  buildLogicMap() {
    // If we have actual thinking content, analyze it
    const thoughtsWithContent = this.thoughtBuffer.filter(t => t.content);

    if (thoughtsWithContent.length === 0) {
      // Generate synthetic logic map based on message patterns
      return this.generateSyntheticLogicMap();
    }

    // Extract key reasoning steps (up to 3)
    const steps = thoughtsWithContent.slice(0, 3).map((thought, index) => ({
      step: index + 1,
      summary: this.summarizeThought(thought.content),
      timestamp: thought.timestamp
    }));

    return {
      steps,
      depth: thoughtsWithContent.length,
      hasFullThoughts: true
    };
  }

  /**
   * Generate synthetic logic map when thoughts aren't visible
   */
  generateSyntheticLogicMap() {
    const messages = this.messagesExchanged;

    if (messages.length === 0) {
      return { steps: [], depth: 0, hasFullThoughts: false };
    }

    // Create logic map from conversation flow
    const steps = [];

    // Step 1: Initial understanding
    if (messages[0]) {
      steps.push({
        step: 1,
        summary: `Understood request: "${messages[0].user.slice(0, 50)}..."`,
        type: 'understanding'
      });
    }

    // Step 2: Processing (middle of conversation)
    if (messages.length > 1) {
      const midPoint = Math.floor(messages.length / 2);
      steps.push({
        step: 2,
        summary: `Analyzed and processed ${messages.length - 1} follow-up${messages.length > 2 ? 's' : ''}`,
        type: 'processing'
      });
    }

    // Step 3: Conclusion
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      steps.push({
        step: 3,
        summary: `Delivered solution: "${lastMsg.ai.slice(0, 50)}..."`,
        type: 'conclusion'
      });
    }

    return {
      steps,
      depth: this.thoughtBuffer.length,
      hasFullThoughts: false
    };
  }

  /**
   * Summarize a thought to a brief statement
   */
  summarizeThought(content) {
    if (!content) return 'Processing...';

    // Take first sentence or first 100 chars
    const firstSentence = content.match(/^[^.!?]+[.!?]/);
    if (firstSentence && firstSentence[0].length < 100) {
      return firstSentence[0];
    }
    return content.slice(0, 100) + '...';
  }

  /**
   * Build resource vault
   */
  buildResourceVault() {
    const resources = [];

    // Extract any URLs mentioned in messages
    this.messagesExchanged.forEach(exchange => {
      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = (exchange.ai + ' ' + exchange.user).match(urlRegex) || [];
      urls.forEach(url => {
        if (!resources.find(r => r.url === url)) {
          resources.push({ type: 'link', url, source: 'conversation' });
        }
      });
    });

    // Add memory references if any
    // (This would integrate with actual memory system)

    return {
      links: resources.filter(r => r.type === 'link'),
      memories: resources.filter(r => r.type === 'memory'),
      count: resources.length
    };
  }

  /**
   * Calculate efficiency rating
   */
  calculateEfficiency(duration, energyConsumed) {
    // Efficiency = value delivered per energy unit
    // Simple heuristic: messages + decisions / energy
    const messagesValue = this.messagesExchanged.length * 1;
    const decisionsValue = this.decisionsLogged.length * 3;
    const totalValue = messagesValue + decisionsValue;

    if (energyConsumed === 0) return 'optimal';

    const ratio = totalValue / energyConsumed;
    if (ratio > 2) return 'excellent';
    if (ratio > 1) return 'good';
    if (ratio > 0.5) return 'moderate';
    return 'intensive';
  }

  /**
   * Format duration for display
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  /**
   * Generate next steps based on session
   */
  generateNextSteps() {
    const steps = [];

    // If decisions were made, suggest reviewing them
    if (this.decisionsLogged.length > 0) {
      steps.push({
        action: 'Review decisions',
        description: `${this.decisionsLogged.length} decision${this.decisionsLogged.length > 1 ? 's' : ''} logged`
      });
    }

    // If topics were discussed, suggest follow-up
    const topics = Array.from(this.topicsDiscussed);
    if (topics.length > 0) {
      steps.push({
        action: 'Continue exploring',
        description: topics.slice(0, 2).join(', ')
      });
    }

    // Energy-based suggestion
    const currentEnergy = lunaEnergyService.getEnergy();
    if (currentEnergy < 30) {
      steps.push({
        action: 'Take a break',
        description: 'Luna could use some rest before the next focus session'
      });
    }

    return steps.slice(0, 3);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MEMORY INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Save report to memory system
   */
  async saveReportToMemory(userId, profileId, report) {
    try {
      // Save as a special 'focus_report' type memory
      await memoryService.addMemory?.(userId, profileId, {
        type: 'focus_report',
        content: JSON.stringify({
          accomplishment: report.accomplishment,
          duration: report.duration,
          energyDelta: report.energyDelta,
          stats: report.stats
        }),
        metadata: {
          sessionId: report.sessionId,
          focusMode: report.focusMode,
          timestamp: report.timestamp
        }
      });

      report.status = REPORT_STATUS.SAVED;
      this.onReportSaved?.(report);

      console.log('📊 [FocusReport] Saved to memory:', report.id);

    } catch (error) {
      console.warn('📊 [FocusReport] Failed to save to memory:', error.message);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RETRIEVAL
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get recent reports
   */
  getRecentReports(limit = 5) {
    return this.recentReports.slice(0, limit);
  }

  /**
   * Get current session info
   */
  getCurrentSession() {
    if (!this.currentSession) return null;

    return {
      ...this.currentSession,
      currentDuration: Date.now() - this.currentSession.startTime,
      messagesCount: this.messagesExchanged.length,
      thoughtsCount: this.thoughtBuffer.length
    };
  }

  /**
   * Check if session is active
   */
  isSessionActive() {
    return this.currentSession !== null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════

  setOnReportGenerated(callback) {
    this.onReportGenerated = callback;
  }

  setOnReportSaved(callback) {
    this.onReportSaved = callback;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const focusReportService = new FocusReportService();

export default focusReportService;
