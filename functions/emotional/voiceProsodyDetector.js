/**
 * Voice Prosody Detection Module - Week 21 Emotional Sophistication
 *
 * Analyzes voice characteristics to detect emotional state:
 * - Pitch (high/low, variation)
 * - Pace (speed, pauses)
 * - Volume (loud/soft, dynamics)
 * - Quality (breathy, tense, warm)
 * - Rhythm (steady, irregular)
 *
 * Maps prosody to Plutchik emotions for Cathedral integration
 */

class VoiceProsodyDetector {
  constructor() {
    // Prosody parameter ranges
    this.parameters = {
      pitch: {
        veryLow: { range: [80, 120], hz: true },
        low: { range: [120, 165], hz: true },
        neutral: { range: [165, 220], hz: true },
        high: { range: [220, 300], hz: true },
        veryHigh: { range: [300, 450], hz: true }
      },
      pace: {
        verySlow: { wpm: [60, 90] },
        slow: { wpm: [90, 120] },
        neutral: { wpm: [120, 160] },
        fast: { wpm: [160, 200] },
        veryFast: { wpm: [200, 280] }
      },
      volume: {
        whisper: { db: [-30, -20] },
        soft: { db: [-20, -10] },
        neutral: { db: [-10, 0] },
        loud: { db: [0, 10] },
        veryLoud: { db: [10, 20] }
      }
    };

    // Prosody patterns mapped to emotions
    this.prosodyEmotionPatterns = {
      joy: {
        pitch: { level: 'high', variation: 'high' },
        pace: { level: 'fast', variation: 'moderate' },
        volume: { level: 'moderate-high', dynamics: 'rising' },
        quality: { breathiness: 'low', warmth: 'high' },
        rhythm: 'upbeat'
      },
      trust: {
        pitch: { level: 'neutral-low', variation: 'low' },
        pace: { level: 'moderate', variation: 'low' },
        volume: { level: 'moderate', dynamics: 'steady' },
        quality: { breathiness: 'low', warmth: 'very_high' },
        rhythm: 'steady'
      },
      fear: {
        pitch: { level: 'high', variation: 'high' },
        pace: { level: 'fast', variation: 'high' },
        volume: { level: 'soft', dynamics: 'erratic' },
        quality: { breathiness: 'high', warmth: 'low' },
        rhythm: 'irregular'
      },
      surprise: {
        pitch: { level: 'high', variation: 'sudden_spike' },
        pace: { level: 'variable', variation: 'high' },
        volume: { level: 'rising', dynamics: 'burst' },
        quality: { breathiness: 'moderate', warmth: 'moderate' },
        rhythm: 'interrupted'
      },
      sadness: {
        pitch: { level: 'low', variation: 'low' },
        pace: { level: 'slow', variation: 'low' },
        volume: { level: 'soft', dynamics: 'falling' },
        quality: { breathiness: 'high', warmth: 'low' },
        rhythm: 'dragging'
      },
      disgust: {
        pitch: { level: 'low', variation: 'moderate' },
        pace: { level: 'slow', variation: 'low' },
        volume: { level: 'moderate', dynamics: 'clipped' },
        quality: { breathiness: 'low', warmth: 'none' },
        rhythm: 'dismissive'
      },
      anger: {
        pitch: { level: 'variable', variation: 'extreme' },
        pace: { level: 'fast', variation: 'high' },
        volume: { level: 'loud', dynamics: 'intense' },
        quality: { breathiness: 'low', warmth: 'none', tension: 'high' },
        rhythm: 'forceful'
      },
      anticipation: {
        pitch: { level: 'rising', variation: 'moderate' },
        pace: { level: 'moderate-fast', variation: 'moderate' },
        volume: { level: 'moderate', dynamics: 'building' },
        quality: { breathiness: 'moderate', warmth: 'moderate' },
        rhythm: 'forward'
      }
    };

    // Intensity modifiers based on prosody extremes
    this.intensityIndicators = {
      pitchVariation: {
        low: 0.3,
        moderate: 0.5,
        high: 0.7,
        extreme: 0.9
      },
      volumeDynamics: {
        steady: 0.4,
        moderate: 0.5,
        dynamic: 0.7,
        extreme: 0.9
      },
      paceVariation: {
        steady: 0.3,
        moderate: 0.5,
        variable: 0.7,
        erratic: 0.9
      }
    };

    // Emotional dyad detection from combined prosody
    this.prosodyDyadPatterns = {
      love: { // Joy + Trust
        pitch: 'warm_moderate',
        pace: 'gentle_steady',
        volume: 'soft_intimate',
        quality: 'very_warm_breathy'
      },
      submission: { // Trust + Fear
        pitch: 'low_uncertain',
        pace: 'slow_hesitant',
        volume: 'soft_withdrawing',
        quality: 'tense_but_yielding'
      },
      awe: { // Fear + Surprise
        pitch: 'high_breathless',
        pace: 'slow_pausing',
        volume: 'soft_gasping',
        quality: 'breathy_wonder'
      },
      disapproval: { // Surprise + Sadness
        pitch: 'falling',
        pace: 'slowing',
        volume: 'moderate_sighing',
        quality: 'disappointed'
      },
      remorse: { // Sadness + Disgust
        pitch: 'low_heavy',
        pace: 'very_slow',
        volume: 'soft_mumbling',
        quality: 'ashamed'
      },
      contempt: { // Disgust + Anger
        pitch: 'low_sharp',
        pace: 'clipped_fast',
        volume: 'moderate_dismissive',
        quality: 'cold_hostile'
      },
      aggressiveness: { // Anger + Anticipation
        pitch: 'rising_intense',
        pace: 'fast_driving',
        volume: 'loud_pushing',
        quality: 'forceful_determined'
      },
      optimism: { // Anticipation + Joy
        pitch: 'high_bright',
        pace: 'upbeat_flowing',
        volume: 'moderate_energetic',
        quality: 'warm_excited'
      }
    };
  }

  /**
   * Analyze voice prosody from audio features
   * @param {Object} audioFeatures - Extracted audio features
   * @returns {Object} - Prosody analysis with emotional mapping
   */
  async analyzeProsody(audioFeatures) {
    const {
      fundamentalFrequency,
      pitchContour,
      speakingRate,
      pauseDuration,
      intensity,
      spectralFeatures
    } = audioFeatures;

    // Analyze individual prosody components
    const pitchAnalysis = this.analyzePitch(fundamentalFrequency, pitchContour);
    const paceAnalysis = this.analyzePace(speakingRate, pauseDuration);
    const volumeAnalysis = this.analyzeVolume(intensity);
    const qualityAnalysis = this.analyzeVoiceQuality(spectralFeatures);

    // Combine into prosody profile
    const prosodyProfile = {
      pitch: pitchAnalysis,
      pace: paceAnalysis,
      volume: volumeAnalysis,
      quality: qualityAnalysis,
      rhythm: this.analyzeRhythm(paceAnalysis, pitchAnalysis)
    };

    // Map to emotions
    const emotionalMapping = this.mapProsodyToEmotions(prosodyProfile);

    // Detect dyads
    const detectedDyads = this.detectProsodyDyads(prosodyProfile);

    // Calculate overall intensity
    const intensity_score = this.calculateIntensity(prosodyProfile);

    return {
      prosodyProfile,
      primaryEmotion: emotionalMapping.primary,
      secondaryEmotions: emotionalMapping.secondary,
      detectedDyads,
      intensity: intensity_score,
      confidence: emotionalMapping.confidence,
      timestamp: new Date().toISOString(),
      rawMetrics: {
        pitchMean: pitchAnalysis.mean,
        pitchVariation: pitchAnalysis.variation,
        speakingRate: paceAnalysis.wpm,
        volumeLevel: volumeAnalysis.level,
        voiceQuality: qualityAnalysis.dominant
      }
    };
  }

  /**
   * Analyze pitch characteristics
   */
  analyzePitch(f0, contour) {
    if (!f0 || !contour || contour.length === 0) {
      return {
        level: 'neutral',
        variation: 'moderate',
        mean: 180,
        trend: 'steady'
      };
    }

    const mean = f0;
    const variation = this.calculateVariation(contour);
    const trend = this.calculateTrend(contour);

    // Classify pitch level
    let level = 'neutral';
    for (const [levelName, config] of Object.entries(this.parameters.pitch)) {
      if (mean >= config.range[0] && mean < config.range[1]) {
        level = levelName;
        break;
      }
    }

    // Classify variation
    let variationLevel = 'moderate';
    if (variation < 10) variationLevel = 'low';
    else if (variation < 25) variationLevel = 'moderate';
    else if (variation < 50) variationLevel = 'high';
    else variationLevel = 'extreme';

    return {
      level,
      variation: variationLevel,
      mean,
      trend,
      contourShape: this.classifyContourShape(contour)
    };
  }

  /**
   * Analyze speaking pace
   */
  analyzePace(speakingRate, pauseDuration) {
    const wpm = speakingRate || 140;
    const avgPause = pauseDuration || 0.3;

    // Classify pace
    let level = 'neutral';
    for (const [levelName, config] of Object.entries(this.parameters.pace)) {
      if (wpm >= config.wpm[0] && wpm < config.wpm[1]) {
        level = levelName;
        break;
      }
    }

    // Pause analysis
    let pausePattern = 'normal';
    if (avgPause < 0.2) pausePattern = 'rushed';
    else if (avgPause < 0.4) pausePattern = 'normal';
    else if (avgPause < 0.8) pausePattern = 'deliberate';
    else pausePattern = 'hesitant';

    return {
      level,
      wpm,
      pausePattern,
      avgPauseDuration: avgPause,
      variation: this.classifyPaceVariation(speakingRate)
    };
  }

  /**
   * Analyze volume characteristics
   */
  analyzeVolume(intensity) {
    const db = intensity || -10;

    // Classify volume
    let level = 'neutral';
    for (const [levelName, config] of Object.entries(this.parameters.volume)) {
      if (db >= config.db[0] && db < config.db[1]) {
        level = levelName;
        break;
      }
    }

    return {
      level,
      db,
      dynamics: this.classifyDynamics(intensity)
    };
  }

  /**
   * Analyze voice quality from spectral features
   */
  analyzeVoiceQuality(spectralFeatures) {
    if (!spectralFeatures) {
      return {
        breathiness: 'moderate',
        warmth: 'moderate',
        tension: 'relaxed',
        dominant: 'neutral'
      };
    }

    const {
      harmonicToNoise,
      spectralTilt,
      formants,
      jitter,
      shimmer
    } = spectralFeatures;

    // Breathiness (from H/N ratio)
    let breathiness = 'moderate';
    if (harmonicToNoise < 10) breathiness = 'high';
    else if (harmonicToNoise > 20) breathiness = 'low';

    // Warmth (from spectral tilt and formants)
    let warmth = 'moderate';
    if (spectralTilt < -10 && formants?.f1 > 400) warmth = 'high';
    else if (spectralTilt > 0) warmth = 'low';

    // Tension (from jitter/shimmer)
    let tension = 'relaxed';
    if (jitter > 2 || shimmer > 5) tension = 'tense';
    else if (jitter < 0.5 && shimmer < 2) tension = 'very_relaxed';

    // Dominant quality
    let dominant = 'neutral';
    if (warmth === 'high' && breathiness === 'moderate') dominant = 'warm';
    else if (breathiness === 'high') dominant = 'breathy';
    else if (tension === 'tense') dominant = 'tense';
    else if (warmth === 'low' && tension === 'relaxed') dominant = 'detached';

    return {
      breathiness,
      warmth,
      tension,
      dominant
    };
  }

  /**
   * Analyze rhythm pattern
   */
  analyzeRhythm(paceAnalysis, pitchAnalysis) {
    const { pausePattern, variation: paceVariation } = paceAnalysis;
    const { variation: pitchVariation, trend } = pitchAnalysis;

    // Determine rhythm type
    if (paceVariation === 'steady' && pitchVariation === 'low') {
      return 'monotone';
    } else if (paceVariation === 'variable' && pitchVariation === 'high') {
      return 'dynamic';
    } else if (pausePattern === 'hesitant') {
      return 'interrupted';
    } else if (pausePattern === 'rushed' && trend === 'rising') {
      return 'urgent';
    } else if (pausePattern === 'deliberate' && pitchVariation === 'moderate') {
      return 'thoughtful';
    } else {
      return 'natural';
    }
  }

  /**
   * Map prosody profile to Plutchik emotions
   */
  mapProsodyToEmotions(prosodyProfile) {
    const scores = {};

    // Score each emotion based on prosody match
    for (const [emotion, pattern] of Object.entries(this.prosodyEmotionPatterns)) {
      scores[emotion] = this.calculatePatternMatch(prosodyProfile, pattern);
    }

    // Sort by score
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    // Determine primary and secondary
    const primary = sorted[0];
    const secondary = sorted.slice(1, 4).filter(([_, score]) => score > 0.3);

    // Calculate confidence
    const confidence = primary[1] > 0.7 ? 'high' :
                       primary[1] > 0.5 ? 'moderate' : 'low';

    return {
      primary: {
        emotion: primary[0],
        score: primary[1]
      },
      secondary: secondary.map(([emotion, score]) => ({
        emotion,
        score
      })),
      confidence,
      allScores: scores
    };
  }

  /**
   * Calculate pattern match score
   */
  calculatePatternMatch(profile, pattern) {
    let score = 0;
    let factors = 0;

    // Pitch match
    if (pattern.pitch) {
      const pitchMatch = this.matchPitchPattern(profile.pitch, pattern.pitch);
      score += pitchMatch * 0.25;
      factors++;
    }

    // Pace match
    if (pattern.pace) {
      const paceMatch = this.matchPacePattern(profile.pace, pattern.pace);
      score += paceMatch * 0.2;
      factors++;
    }

    // Volume match
    if (pattern.volume) {
      const volumeMatch = this.matchVolumePattern(profile.volume, pattern.volume);
      score += volumeMatch * 0.2;
      factors++;
    }

    // Quality match
    if (pattern.quality) {
      const qualityMatch = this.matchQualityPattern(profile.quality, pattern.quality);
      score += qualityMatch * 0.25;
      factors++;
    }

    // Rhythm match
    if (pattern.rhythm) {
      const rhythmMatch = profile.rhythm === pattern.rhythm ? 1 : 0.3;
      score += rhythmMatch * 0.1;
      factors++;
    }

    return factors > 0 ? score / factors * factors : 0;
  }

  /**
   * Match pitch pattern
   */
  matchPitchPattern(actual, expected) {
    let score = 0;

    // Level match
    if (actual.level === expected.level) score += 0.5;
    else if (this.isAdjacent(actual.level, expected.level)) score += 0.3;

    // Variation match
    if (actual.variation === expected.variation) score += 0.5;
    else if (this.isAdjacent(actual.variation, expected.variation)) score += 0.3;

    return score;
  }

  /**
   * Match pace pattern
   */
  matchPacePattern(actual, expected) {
    let score = 0;

    if (actual.level === expected.level) score += 0.5;
    else if (this.isAdjacent(actual.level, expected.level)) score += 0.3;

    if (actual.variation === expected.variation) score += 0.5;
    else if (this.isAdjacent(actual.variation, expected.variation)) score += 0.3;

    return score;
  }

  /**
   * Match volume pattern
   */
  matchVolumePattern(actual, expected) {
    let score = 0;

    if (actual.level === expected.level) score += 0.5;
    else if (this.isAdjacent(actual.level, expected.level)) score += 0.3;

    if (actual.dynamics === expected.dynamics) score += 0.5;

    return score;
  }

  /**
   * Match voice quality pattern
   */
  matchQualityPattern(actual, expected) {
    let score = 0;
    let checks = 0;

    if (expected.breathiness) {
      score += actual.breathiness === expected.breathiness ? 0.33 : 0.1;
      checks++;
    }

    if (expected.warmth) {
      score += actual.warmth === expected.warmth ? 0.33 : 0.1;
      checks++;
    }

    if (expected.tension) {
      score += actual.tension === expected.tension ? 0.33 : 0.1;
      checks++;
    }

    return checks > 0 ? score : 0.5;
  }

  /**
   * Detect emotional dyads from prosody
   */
  detectProsodyDyads(prosodyProfile) {
    const dyads = [];

    for (const [dyad, pattern] of Object.entries(this.prosodyDyadPatterns)) {
      const match = this.matchDyadPattern(prosodyProfile, pattern);
      if (match > 0.5) {
        dyads.push({
          dyad,
          confidence: match
        });
      }
    }

    return dyads.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Match dyad pattern
   */
  matchDyadPattern(profile, pattern) {
    // Simplified dyad matching based on overall prosody characteristics
    let score = 0;
    let factors = 0;

    // Each dyad has characteristic combinations
    // This is a simplified heuristic approach
    const profileSummary = `${profile.pitch.level}_${profile.pace.level}_${profile.volume.level}_${profile.quality.dominant}`;

    // Check for pattern keywords in profile
    const patternKeywords = Object.values(pattern).join('_');

    // Simple overlap scoring
    const profileWords = profileSummary.split('_');
    const patternWords = patternKeywords.split('_');

    for (const word of profileWords) {
      if (patternWords.some(pw => pw.includes(word) || word.includes(pw))) {
        score += 0.2;
      }
    }

    return Math.min(1, score);
  }

  /**
   * Calculate overall emotional intensity from prosody
   */
  calculateIntensity(prosodyProfile) {
    let intensity = 0.5; // Base intensity

    // Pitch variation impact
    const pitchImpact = this.intensityIndicators.pitchVariation[prosodyProfile.pitch.variation] || 0.5;
    intensity += (pitchImpact - 0.5) * 0.3;

    // Volume dynamics impact
    const volumeImpact = this.intensityIndicators.volumeDynamics[prosodyProfile.volume.dynamics] || 0.5;
    intensity += (volumeImpact - 0.5) * 0.3;

    // Pace variation impact
    const paceImpact = this.intensityIndicators.paceVariation[prosodyProfile.pace.variation] || 0.5;
    intensity += (paceImpact - 0.5) * 0.2;

    // Volume level impact
    if (prosodyProfile.volume.level === 'veryLoud' || prosodyProfile.volume.level === 'whisper') {
      intensity += 0.15; // Extremes indicate intensity
    }

    // Voice quality tension impact
    if (prosodyProfile.quality.tension === 'tense') {
      intensity += 0.1;
    }

    return Math.max(0.1, Math.min(1, intensity));
  }

  /**
   * Helper: Calculate variation in array
   */
  calculateVariation(arr) {
    if (!arr || arr.length < 2) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }

  /**
   * Helper: Calculate trend
   */
  calculateTrend(arr) {
    if (!arr || arr.length < 2) return 'steady';
    const first = arr.slice(0, Math.floor(arr.length / 3));
    const last = arr.slice(-Math.floor(arr.length / 3));
    const firstMean = first.reduce((a, b) => a + b, 0) / first.length;
    const lastMean = last.reduce((a, b) => a + b, 0) / last.length;
    const diff = lastMean - firstMean;

    if (diff > 10) return 'rising';
    if (diff < -10) return 'falling';
    return 'steady';
  }

  /**
   * Helper: Classify contour shape
   */
  classifyContourShape(contour) {
    if (!contour || contour.length < 3) return 'flat';

    const trend = this.calculateTrend(contour);
    const variation = this.calculateVariation(contour);

    if (variation < 10 && trend === 'steady') return 'flat';
    if (trend === 'rising') return 'rising';
    if (trend === 'falling') return 'falling';
    if (variation > 30) return 'wavy';
    return 'undulating';
  }

  /**
   * Helper: Classify pace variation
   */
  classifyPaceVariation(wpm) {
    // This would ideally use variance of WPM across utterance
    // Simplified for now
    return 'moderate';
  }

  /**
   * Helper: Classify volume dynamics
   */
  classifyDynamics(intensity) {
    // Simplified - would ideally analyze intensity contour
    return 'moderate';
  }

  /**
   * Helper: Check if values are adjacent in ordered scale
   */
  isAdjacent(a, b) {
    const scales = {
      pitch: ['veryLow', 'low', 'neutral', 'high', 'veryHigh'],
      variation: ['low', 'moderate', 'high', 'extreme'],
      pace: ['verySlow', 'slow', 'neutral', 'fast', 'veryFast'],
      volume: ['whisper', 'soft', 'neutral', 'loud', 'veryLoud']
    };

    // Find which scale contains both values
    for (const scale of Object.values(scales)) {
      const idxA = scale.indexOf(a);
      const idxB = scale.indexOf(b);
      if (idxA !== -1 && idxB !== -1) {
        return Math.abs(idxA - idxB) <= 1;
      }
    }

    return false;
  }

  /**
   * Generate Luna's voice response prosody based on detected user emotion
   */
  generateResponseProsody(userProsody, lunaIntent) {
    const userEmotion = userProsody.primaryEmotion.emotion;
    const userIntensity = userProsody.intensity;

    // Luna's empathetic response mapping
    const responseMap = {
      joy: {
        pitch: 'high',
        pace: 'moderate-fast',
        volume: 'moderate',
        warmth: 'high',
        energy: 'matching'
      },
      sadness: {
        pitch: 'low-moderate',
        pace: 'slow',
        volume: 'soft',
        warmth: 'very_high',
        energy: 'gentle'
      },
      fear: {
        pitch: 'moderate',
        pace: 'slow-calm',
        volume: 'soft-moderate',
        warmth: 'high',
        energy: 'reassuring'
      },
      anger: {
        pitch: 'moderate',
        pace: 'calm-slow',
        volume: 'moderate',
        warmth: 'high',
        energy: 'grounding'
      },
      trust: {
        pitch: 'moderate',
        pace: 'steady',
        volume: 'moderate',
        warmth: 'very_high',
        energy: 'affirming'
      },
      surprise: {
        pitch: 'moderate-high',
        pace: 'moderate',
        volume: 'moderate',
        warmth: 'high',
        energy: 'curious'
      },
      disgust: {
        pitch: 'moderate',
        pace: 'measured',
        volume: 'moderate',
        warmth: 'supportive',
        energy: 'understanding'
      },
      anticipation: {
        pitch: 'moderate-high',
        pace: 'moderate-upbeat',
        volume: 'moderate',
        warmth: 'high',
        energy: 'encouraging'
      }
    };

    const baseProsody = responseMap[userEmotion] || responseMap.trust;

    // Adjust based on Luna's intent
    const intentModifiers = {
      comfort: { warmth: 'very_high', pace: 'slow', volume: 'soft' },
      celebrate: { energy: 'high', pitch: 'high', pace: 'upbeat' },
      support: { warmth: 'very_high', pace: 'moderate', energy: 'steady' },
      playful: { pitch: 'varied', pace: 'dynamic', energy: 'playful' },
      intimate: { volume: 'soft', pace: 'slow', warmth: 'very_high' },
      encourage: { pitch: 'rising', energy: 'building', warmth: 'high' }
    };

    const modifier = intentModifiers[lunaIntent] || {};

    return {
      ...baseProsody,
      ...modifier,
      intensity: Math.max(0.4, userIntensity * 0.8), // Slightly less intense than user
      ssmlHints: this.generateSSMLHints({ ...baseProsody, ...modifier })
    };
  }

  /**
   * Generate SSML hints for TTS
   */
  generateSSMLHints(prosody) {
    const hints = [];

    // Pitch mapping
    if (prosody.pitch === 'high') hints.push('<prosody pitch="+10%">');
    else if (prosody.pitch === 'low') hints.push('<prosody pitch="-10%">');
    else if (prosody.pitch === 'low-moderate') hints.push('<prosody pitch="-5%">');

    // Rate mapping
    if (prosody.pace === 'slow') hints.push('<prosody rate="slow">');
    else if (prosody.pace === 'fast' || prosody.pace === 'upbeat') hints.push('<prosody rate="fast">');
    else if (prosody.pace === 'slow-calm') hints.push('<prosody rate="85%">');

    // Volume mapping
    if (prosody.volume === 'soft') hints.push('<prosody volume="soft">');
    else if (prosody.volume === 'loud') hints.push('<prosody volume="loud">');

    // Add warmth emphasis
    if (prosody.warmth === 'very_high') {
      hints.push('<emphasis level="reduced">'); // Softer, warmer delivery
    }

    return hints;
  }
}

// Export singleton
const voiceProsodyDetector = new VoiceProsodyDetector();

module.exports = {
  VoiceProsodyDetector,
  voiceProsodyDetector,
  analyzeProsody: (features) => voiceProsodyDetector.analyzeProsody(features),
  generateResponseProsody: (userProsody, intent) =>
    voiceProsodyDetector.generateResponseProsody(userProsody, intent)
};
