/**
 * ===============================================================================
 * TURN-TAKING MODEL
 * ===============================================================================
 *
 * Intelligent turn-taking that combines:
 * - Prosodic analysis (pitch, energy, rate)
 * - Constitutional awareness (Enneagram, processing style)
 * - Linguistic completeness
 * - Filler word detection
 *
 * This creates PERSONALIZED turn-taking based on user's constitution.
 *
 * Part of: GENESIS Conversational AI v2
 * Created: December 28, 2024
 */

import { prosodyAnalyzer, TURN_SIGNAL, PITCH_TREND } from './prosodyAnalyzer';

/**
 * Turn-taking actions
 */
export const TURN_ACTION = {
  CONTINUE: 'continue',   // Keep listening, don't commit yet
  WAIT: 'wait',           // Probable end, wait a bit more
  COMMIT: 'commit'        // Commit the turn, send for processing
};

/**
 * Filler word patterns (extend silence when detected)
 */
const FILLER_PATTERNS = {
  thinking: /^(um+|uh+|er+|ah+|hmm+|let me (think|see)|hold on)$/i,
  backchannels: /^(yeah|yes|yep|uh-huh|mhm|mm-hmm|right|okay|i see|got it)$/i,
  hesitation: /^(well|so|like|you know|i mean)$/i
};

/**
 * Turn-yielding phrases - explicit signals that user wants AI to respond
 * These trigger IMMEDIATE turn commit (like "over" on a walkie-talkie)
 */
const TURN_YIELD_PATTERNS = {
  // Direct questions to AI
  askingOpinion: /what do you think\??$/i,
  askingThoughts: /what are your thoughts\??$/i,
  askingView: /what('s| is) your (opinion|view|take)\??$/i,
  askingAdvice: /what (would|should) (you|i) (do|say|think)\??$/i,
  askingPerspective: /if you were (me|in my (shoes|position|place))[\s,.]*/i,
  askingHelp: /can you help( me)?\??$/i,
  askingExplain: /can you explain( that| this)?\??$/i,

  // Comparative questions
  prosAndCons: /what are the pros and cons\??$/i,
  options: /what are (my|the) options\??$/i,
  differences: /what('s| is) the difference\??$/i,
  better: /which (one |is |would be )?(is )?better\??$/i,

  // Explicit turn markers (walkie-talkie style)
  over: /\b(over|your turn|go ahead|that's it|that's all|i'm done|done|finished)\b\.?$/i,
  goAhead: /\b(luna|what do you say|talk to me|respond|answer)\b\.?$/i,

  // Question endings with question marks
  questionMark: /\?$/,

  // Trailing "right?" or "yeah?" seeking confirmation
  seekingConfirmation: /\b(right|yeah|huh|no|correct|isn't it|don't you think)\?$/i,

  // "So..." or "And..." at the end (inviting response)
  invitingResponse: /\b(so+\.{2,}|and+\.{2,}|but+\.{2,})\s*$/i
};

/**
 * Strong turn-yield patterns - these trigger IMMEDIATE commit
 * (user is explicitly asking for a response)
 */
const STRONG_YIELD_PATTERNS = [
  'askingOpinion',
  'askingThoughts',
  'askingView',
  'askingAdvice',
  'askingPerspective',
  'prosAndCons',
  'options',
  'over',
  'goAhead'
];

/**
 * Constitutional adjustments by Enneagram type
 * Higher silenceMultiplier = wait longer before responding
 * Higher commitThreshold = need more confidence before committing
 */
const ENNEAGRAM_ADJUSTMENTS = {
  1: { silenceMultiplier: 1.1, commitThreshold: 0.70, description: 'Reformers - precise, need space to articulate' },
  2: { silenceMultiplier: 1.0, commitThreshold: 0.65, description: 'Helpers - emotionally attuned, responsive' },
  3: { silenceMultiplier: 0.9, commitThreshold: 0.60, description: 'Achievers - efficient, quick processing' },
  4: { silenceMultiplier: 1.3, commitThreshold: 0.80, description: 'Individualists - deep processing, emotional depth' },
  5: { silenceMultiplier: 1.4, commitThreshold: 0.85, description: 'Investigators - thinking pauses, need processing time' },
  6: { silenceMultiplier: 1.1, commitThreshold: 0.70, description: 'Loyalists - consider multiple angles' },
  7: { silenceMultiplier: 0.9, commitThreshold: 0.55, description: 'Enthusiasts - quick, energetic, fast-paced' },
  8: { silenceMultiplier: 0.95, commitThreshold: 0.60, description: 'Challengers - direct, assertive' },
  9: { silenceMultiplier: 1.2, commitThreshold: 0.75, description: 'Peacemakers - measured pace, thoughtful' }
};

/**
 * Processing style adjustments
 */
const PROCESSING_STYLE_ADJUSTMENTS = {
  'internal': { silenceMultiplier: 1.0, note: 'Processes internally before speaking' },
  'external': { silenceMultiplier: 1.25, note: 'Thinks by talking, needs more pause time' }
};

/**
 * Base silence thresholds (in milliseconds)
 */
const BASE_THRESHOLDS = {
  minimum: 300,     // Never commit before this
  standard: 600,    // Normal pause duration
  extended: 1000,   // Thinking pause
  question: 400     // After rising pitch (expecting response)
};

/**
 * Turn-Taking Model Class
 */
class TurnTakingModel {
  constructor() {
    // User profile for constitutional adjustments
    this.userProfile = null;
    this.constitutionalAdjustments = {
      silenceMultiplier: 1.0,
      commitThreshold: 0.7
    };

    // Current state
    this.currentSilenceDuration = 0;
    this.silenceStartTime = null;
    this.lastTranscript = '';
    this.fillerDetected = false;
    this.backchannelDetected = false;

    // Turn-yield detection (walkie-talkie style "over")
    this.turnYieldDetected = false;
    this.turnYieldStrong = false;  // Strong yield = immediate commit
    this.turnYieldPattern = null;  // Which pattern matched

    // Tracking
    this.turnHistory = [];
    this.isActive = false;
  }

  /**
   * Initialize with user profile for constitutional awareness
   * @param {Object} userProfile - User's constitutional profile
   */
  setUserProfile(userProfile) {
    this.userProfile = userProfile;
    this.constitutionalAdjustments = this._calculateConstitutionalAdjustments(userProfile);
    console.log('[TurnTaking] Constitutional adjustments:', this.constitutionalAdjustments);
  }

  /**
   * Calculate constitutional adjustments based on user profile
   * @private
   */
  _calculateConstitutionalAdjustments(profile) {
    const adjustments = {
      silenceMultiplier: 1.0,
      commitThreshold: 0.7,
      sources: []
    };

    if (!profile) return adjustments;

    // 1. Enneagram-based adjustments
    const enneagramType = this._extractEnneagramType(profile);
    if (enneagramType && ENNEAGRAM_ADJUSTMENTS[enneagramType]) {
      const ennAdj = ENNEAGRAM_ADJUSTMENTS[enneagramType];
      adjustments.silenceMultiplier *= ennAdj.silenceMultiplier;
      adjustments.commitThreshold = Math.max(adjustments.commitThreshold, ennAdj.commitThreshold);
      adjustments.sources.push(`Enneagram Type ${enneagramType}: ${ennAdj.description}`);
    }

    // 2. Processing style adjustments
    const processingStyle = this._extractProcessingStyle(profile);
    if (processingStyle && PROCESSING_STYLE_ADJUSTMENTS[processingStyle]) {
      const procAdj = PROCESSING_STYLE_ADJUSTMENTS[processingStyle];
      adjustments.silenceMultiplier *= procAdj.silenceMultiplier;
      adjustments.sources.push(`Processing style: ${processingStyle} - ${procAdj.note}`);
    }

    // 3. Witness need adjustments (from communication preferences)
    const witnessNeed = this._extractWitnessNeed(profile);
    if (witnessNeed > 0.6) {
      // High witness need = wait longer before responding
      adjustments.commitThreshold += 0.1;
      adjustments.sources.push(`High witness need (${Math.round(witnessNeed * 100)}%): wait longer before responding`);
    }

    return adjustments;
  }

  /**
   * Extract Enneagram type from profile
   * @private
   */
  _extractEnneagramType(profile) {
    // Try different profile structures
    if (profile.enneagramType) return parseInt(profile.enneagramType);
    if (profile.enneagram?.type) return parseInt(profile.enneagram.type);
    if (profile.constitutional_identity?.enneagram?.type) {
      return parseInt(profile.constitutional_identity.enneagram.type);
    }
    // Try to extract from string like "Type 4" or "4w5"
    const typeStr = profile.enneagram || profile.enneagramType || '';
    const match = typeStr.toString().match(/\b([1-9])\b/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Extract processing style from profile
   * @private
   */
  _extractProcessingStyle(profile) {
    const prefString = profile.communication_preferences?.processing_style ||
                       profile.processingStyle || '';

    if (/external/i.test(prefString)) return 'external';
    if (/internal/i.test(prefString)) return 'internal';
    return null;
  }

  /**
   * Extract witness need ratio from profile
   * @private
   */
  _extractWitnessNeed(profile) {
    const witnessPref = profile.communication_preferences?.needs_witness_vs_advice ||
                        profile.witnessNeed || '';

    // Parse strings like "70% witness, 30% advice"
    const match = witnessPref.toString().match(/(\d+)%?\s*witness/i);
    if (match) {
      return parseInt(match[1]) / 100;
    }

    // Direct number (0-1 or 0-100)
    if (typeof witnessPref === 'number') {
      return witnessPref > 1 ? witnessPref / 100 : witnessPref;
    }

    return 0.5; // Default neutral
  }

  /**
   * Start tracking a new utterance
   */
  startUtterance() {
    this.isActive = true;
    this.currentSilenceDuration = 0;
    this.silenceStartTime = null;
    this.lastTranscript = '';
    this.fillerDetected = false;
    this.backchannelDetected = false;
    this.turnYieldDetected = false;
    this.turnYieldStrong = false;
    this.turnYieldPattern = null;
    prosodyAnalyzer.reset();
  }

  /**
   * End current utterance tracking
   */
  endUtterance() {
    this.isActive = false;
    prosodyAnalyzer.stop();

    // Record in history
    this.turnHistory.push({
      transcript: this.lastTranscript,
      silenceDuration: this.currentSilenceDuration,
      timestamp: Date.now()
    });

    // Keep last 10 turns
    if (this.turnHistory.length > 10) {
      this.turnHistory.shift();
    }
  }

  /**
   * Update with partial transcript (from STT)
   * @param {string} transcript - Current partial transcript
   */
  updateTranscript(transcript) {
    this.lastTranscript = transcript;

    // Check for filler words in recent text
    const recentWords = transcript.split(/\s+/).slice(-3).join(' ');
    this.fillerDetected = this._checkForFillers(recentWords);
    this.backchannelDetected = this._checkForBackchannels(recentWords);

    // Check for turn-yielding phrases (walkie-talkie "over" detection)
    const yieldResult = this._checkForTurnYield(transcript);
    this.turnYieldDetected = yieldResult.detected;
    this.turnYieldStrong = yieldResult.strong;
    this.turnYieldPattern = yieldResult.pattern;

    if (this.turnYieldDetected) {
      console.log(`[TurnTaking] Turn-yield detected: "${yieldResult.pattern}" (strong: ${yieldResult.strong})`);
    }
  }

  /**
   * Check if text contains filler words
   * @private
   */
  _checkForFillers(text) {
    return FILLER_PATTERNS.thinking.test(text.trim()) ||
           FILLER_PATTERNS.hesitation.test(text.trim());
  }

  /**
   * Check if text is a backchannel
   * @private
   */
  _checkForBackchannels(text) {
    return FILLER_PATTERNS.backchannels.test(text.trim());
  }

  /**
   * Check for turn-yielding phrases (signals user wants AI to respond)
   * Returns: { detected: boolean, strong: boolean, pattern: string|null }
   * @private
   */
  _checkForTurnYield(transcript) {
    const trimmed = transcript.trim();

    // Check all turn-yield patterns
    for (const [patternName, regex] of Object.entries(TURN_YIELD_PATTERNS)) {
      if (regex.test(trimmed)) {
        return {
          detected: true,
          strong: STRONG_YIELD_PATTERNS.includes(patternName),
          pattern: patternName
        };
      }
    }

    return {
      detected: false,
      strong: false,
      pattern: null
    };
  }

  /**
   * Main decision function - should we commit the turn?
   *
   * @param {Float32Array} audioBuffer - Current audio chunk
   * @param {number} silenceDurationMs - How long silence has been detected
   * @returns {Object} Decision with action and reasoning
   */
  decide(audioBuffer, silenceDurationMs) {
    // Analyze prosody
    const prosody = prosodyAnalyzer.analyze(audioBuffer);

    // Track silence
    this.currentSilenceDuration = silenceDurationMs;

    // Calculate adjusted threshold
    const baseThreshold = this._getBaseThreshold(prosody);
    const adjustedThreshold = baseThreshold * this.constitutionalAdjustments.silenceMultiplier;

    // Calculate turn probability
    const turnProbability = this._calculateTurnProbability(prosody, silenceDurationMs, adjustedThreshold);

    // Make decision
    const decision = this._makeDecision(turnProbability, silenceDurationMs, adjustedThreshold);

    return {
      action: decision.action,
      probability: turnProbability,
      threshold: adjustedThreshold,
      silenceDuration: silenceDurationMs,
      prosody: {
        pitchTrend: prosody.pitch.trend,
        energyDecay: prosody.energy.decayRate,
        turnSignal: prosody.turnSignal
      },
      modifiers: {
        fillerDetected: this.fillerDetected,
        backchannelDetected: this.backchannelDetected,
        constitutionalMultiplier: this.constitutionalAdjustments.silenceMultiplier
      },
      turnYield: {
        detected: this.turnYieldDetected,
        strong: this.turnYieldStrong,
        pattern: this.turnYieldPattern
      },
      reasoning: decision.reasoning
    };
  }

  /**
   * Get base silence threshold based on prosody
   * @private
   */
  _getBaseThreshold(prosody) {
    // Question (rising pitch) = shorter threshold
    if (prosody.pitch.trend === PITCH_TREND.RISING) {
      return BASE_THRESHOLDS.question;
    }

    // Thinking signal = extended threshold
    if (prosody.turnSignal === TURN_SIGNAL.THINKING) {
      return BASE_THRESHOLDS.extended;
    }

    // Filler words = extended threshold
    if (this.fillerDetected) {
      return BASE_THRESHOLDS.extended;
    }

    // Likely end = minimum threshold
    if (prosody.turnSignal === TURN_SIGNAL.LIKELY_END) {
      return BASE_THRESHOLDS.minimum;
    }

    // Default
    return BASE_THRESHOLDS.standard;
  }

  /**
   * Calculate turn probability (0-1)
   * Higher = more likely the turn is over
   * @private
   */
  _calculateTurnProbability(prosody, silenceDurationMs, threshold) {
    let probability = 0;

    // 1. Silence duration contribution (0-0.4)
    const silenceRatio = Math.min(silenceDurationMs / threshold, 1.5);
    probability += silenceRatio * 0.4;

    // 2. Prosodic signals (0-0.3)
    switch (prosody.turnSignal) {
      case TURN_SIGNAL.LIKELY_END:
        probability += 0.3;
        break;
      case TURN_SIGNAL.POSSIBLY_END:
        probability += 0.2;
        break;
      case TURN_SIGNAL.THINKING:
        probability += 0.05;
        break;
      case TURN_SIGNAL.CONTINUING:
        probability -= 0.1;
        break;
    }

    // 3. Pitch trend contribution (0-0.2)
    switch (prosody.pitch.trend) {
      case PITCH_TREND.FALLING:
        probability += 0.2 * prosody.pitch.confidence;
        break;
      case PITCH_TREND.RISING:
        probability -= 0.1; // Question, might not be done
        break;
      case PITCH_TREND.FLAT:
        probability += 0.05; // Neutral
        break;
    }

    // 4. Energy decay contribution (0-0.15)
    if (prosody.energy.decayRate > 0.5) {
      probability += 0.15;
    } else if (prosody.energy.sustained) {
      probability -= 0.05;
    }

    // 5. Filler word penalty
    if (this.fillerDetected) {
      probability -= 0.2;
    }

    // 6. Linguistic completeness (simplified)
    if (this.lastTranscript) {
      const completeness = this._assessLinguisticCompleteness(this.lastTranscript);
      probability += completeness * 0.15;
    }

    // 7. Turn-yield phrase boost (walkie-talkie "over" detection)
    // This is a MAJOR signal that user wants AI to respond
    if (this.turnYieldDetected) {
      if (this.turnYieldStrong) {
        // Strong yield phrases like "What do you think?" = max probability
        probability += 0.5;
      } else {
        // Weak yield phrases like ending with "?" = moderate boost
        probability += 0.25;
      }
    }

    return Math.max(0, Math.min(1, probability));
  }

  /**
   * Assess linguistic completeness of transcript
   * @private
   */
  _assessLinguisticCompleteness(transcript) {
    const trimmed = transcript.trim();

    // Ends with sentence-final punctuation
    if (/[.!?]$/.test(trimmed)) {
      return 0.9;
    }

    // Ends with conjunction (incomplete)
    if (/\b(and|but|or|because|so|if|when|while)\s*$/i.test(trimmed)) {
      return 0.1;
    }

    // Very short utterances might be complete
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount <= 3) {
      return 0.7; // Short answers are often complete
    }

    // Default medium completeness
    return 0.5;
  }

  /**
   * Make final decision based on probability and thresholds
   * @private
   */
  _makeDecision(probability, silenceDurationMs, threshold) {
    const reasoning = [];

    // PRIORITY 1: Strong turn-yield phrases trigger IMMEDIATE commit
    // This is like "over" on a walkie-talkie - user explicitly asked for response
    // "What do you think?", "What are the pros and cons?", "Over", etc.
    if (this.turnYieldStrong && silenceDurationMs >= BASE_THRESHOLDS.minimum) {
      reasoning.push(`Strong turn-yield detected: "${this.turnYieldPattern}" - immediate commit`);
      return { action: TURN_ACTION.COMMIT, reasoning };
    }

    // Never commit before minimum threshold (unless strong turn-yield above)
    if (silenceDurationMs < BASE_THRESHOLDS.minimum) {
      reasoning.push(`Below minimum silence (${silenceDurationMs}ms < ${BASE_THRESHOLDS.minimum}ms)`);
      return { action: TURN_ACTION.CONTINUE, reasoning };
    }

    // Backchannel detected - don't commit (user is just acknowledging)
    if (this.backchannelDetected && this.lastTranscript.split(/\s+/).length <= 3) {
      reasoning.push('Backchannel detected - waiting for actual content');
      return { action: TURN_ACTION.CONTINUE, reasoning };
    }

    // PRIORITY 2: Weak turn-yield (questions ending with "?") with any silence
    // User asked a question - respond after minimal pause
    if (this.turnYieldDetected && silenceDurationMs >= BASE_THRESHOLDS.minimum * 1.2) {
      reasoning.push(`Turn-yield detected: "${this.turnYieldPattern}" - committing after brief pause`);
      return { action: TURN_ACTION.COMMIT, reasoning };
    }

    // High probability + exceeded threshold = commit
    if (probability >= this.constitutionalAdjustments.commitThreshold &&
        silenceDurationMs >= threshold) {
      reasoning.push(`High probability (${(probability * 100).toFixed(0)}%) and silence exceeded threshold`);
      return { action: TURN_ACTION.COMMIT, reasoning };
    }

    // Very high probability = commit even if threshold not fully reached
    if (probability >= 0.9 && silenceDurationMs >= BASE_THRESHOLDS.minimum * 1.5) {
      reasoning.push(`Very high probability (${(probability * 100).toFixed(0)}%)`);
      return { action: TURN_ACTION.COMMIT, reasoning };
    }

    // Extended silence with medium probability = commit
    if (silenceDurationMs >= threshold * 1.5 && probability >= 0.5) {
      reasoning.push(`Extended silence with medium probability`);
      return { action: TURN_ACTION.COMMIT, reasoning };
    }

    // Getting close to threshold = wait
    if (silenceDurationMs >= threshold * 0.7) {
      reasoning.push('Approaching threshold - waiting');
      return { action: TURN_ACTION.WAIT, reasoning };
    }

    // Default continue
    reasoning.push('Still listening');
    return { action: TURN_ACTION.CONTINUE, reasoning };
  }

  /**
   * Check if a transcript is a backchannel (for barge-in handling)
   * @param {string} transcript - The transcript to check
   * @returns {boolean} True if this is a backchannel
   */
  isBackchannel(transcript) {
    const trimmed = transcript.trim().toLowerCase();
    return FILLER_PATTERNS.backchannels.test(trimmed);
  }

  /**
   * Get recommended silence threshold for current state
   * (For use by audioCapture when not in active turn)
   */
  getRecommendedThreshold() {
    return BASE_THRESHOLDS.standard * this.constitutionalAdjustments.silenceMultiplier;
  }

  /**
   * Get current state for debugging/UI
   */
  getState() {
    return {
      isActive: this.isActive,
      silenceDuration: this.currentSilenceDuration,
      lastTranscript: this.lastTranscript,
      fillerDetected: this.fillerDetected,
      backchannelDetected: this.backchannelDetected,
      turnYield: {
        detected: this.turnYieldDetected,
        strong: this.turnYieldStrong,
        pattern: this.turnYieldPattern
      },
      constitutionalAdjustments: this.constitutionalAdjustments,
      turnHistoryLength: this.turnHistory.length
    };
  }

  /**
   * Reset the model
   */
  reset() {
    this.currentSilenceDuration = 0;
    this.silenceStartTime = null;
    this.lastTranscript = '';
    this.fillerDetected = false;
    this.backchannelDetected = false;
    this.turnYieldDetected = false;
    this.turnYieldStrong = false;
    this.turnYieldPattern = null;
    this.isActive = false;
    prosodyAnalyzer.reset();
  }
}

// Singleton instance
export const turnTakingModel = new TurnTakingModel();

export default turnTakingModel;
