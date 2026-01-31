/**
 * ============================================================================
 * STORY BEATS ENGINE (情节节点引擎)
 * ============================================================================
 *
 * Converts timing windows into story beats.
 * Each timing window becomes a narrative moment with:
 * - Beat type classification
 * - Emotional tone derivation
 * - Intensity calculation
 * - Summary generation
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  BeatType,
  EmotionalTone,
  StoryBeat,
  TimingWindow,
  EnvironmentalContext,
  LifecycleContext,
  EventTriggerContext
} from './storyTypes';

// ============================================================================
// BEAT CLASSIFICATION
// ============================================================================

/**
 * Beat type thresholds based on score and lifecycle
 */
const BEAT_THRESHOLDS = {
  peak: 80,
  rising: 65,
  integration: 55,
  healing: 45,
  conflict: 35,
  turning: 25
};

/**
 * Lifecycle phases that indicate turning points
 */
const TURNING_PHASES = [
  'crisis', 'transformation', 'rebirth', 'awakening',
  '危机', '转化', '重生', '觉醒'
];

/**
 * Lifecycle phases that indicate conflict
 */
const CONFLICT_PHASES = [
  'challenge', 'test', 'trial', 'struggle',
  '挑战', '考验', '试炼', '奋斗'
];

/**
 * Lifecycle phases that indicate healing
 */
const HEALING_PHASES = [
  'recovery', 'healing', 'integration', 'acceptance',
  '恢复', '愈合', '整合', '接受'
];

/**
 * Classify a timing window into a beat type
 */
export function classifyBeat(
  score: number,
  lifecyclePhase: string,
  previousBeatType?: BeatType,
  isFirst?: boolean
): BeatType {
  // First beat is always an opening
  if (isFirst) {
    return 'opening';
  }

  // Check lifecycle phase for special classifications
  const phaseLower = lifecyclePhase.toLowerCase();

  if (TURNING_PHASES.some(p => phaseLower.includes(p.toLowerCase()))) {
    return 'turning';
  }

  if (CONFLICT_PHASES.some(p => phaseLower.includes(p.toLowerCase()))) {
    return 'conflict';
  }

  if (HEALING_PHASES.some(p => phaseLower.includes(p.toLowerCase()))) {
    return 'healing';
  }

  // Score-based classification
  if (score >= BEAT_THRESHOLDS.peak) {
    return 'peak';
  }

  if (score >= BEAT_THRESHOLDS.rising) {
    // If previous was peak, this is integration
    if (previousBeatType === 'peak') {
      return 'integration';
    }
    return 'rising';
  }

  if (score >= BEAT_THRESHOLDS.integration) {
    return 'integration';
  }

  if (score >= BEAT_THRESHOLDS.healing) {
    return 'healing';
  }

  if (score >= BEAT_THRESHOLDS.conflict) {
    return 'conflict';
  }

  // Low score after high score = turning point
  if (previousBeatType === 'peak' || previousBeatType === 'rising') {
    return 'turning';
  }

  return 'conflict';
}

// ============================================================================
// EMOTIONAL TONE DERIVATION
// ============================================================================

/**
 * Beat type to base emotional tone mapping
 */
const BEAT_TONE_MAP: Record<BeatType, EmotionalTone[]> = {
  opening: ['hopeful', 'tender', 'reflective'],
  rising: ['hopeful', 'joyful', 'passionate'],
  peak: ['triumphant', 'joyful', 'passionate'],
  conflict: ['challenging', 'reflective', 'bittersweet'],
  turning: ['transformative', 'reflective', 'bittersweet'],
  healing: ['peaceful', 'tender', 'hopeful'],
  integration: ['peaceful', 'tender', 'reflective'],
  resolution: ['triumphant', 'peaceful', 'joyful']
};

/**
 * Derive emotional tone from beat type and environmental score
 */
export function deriveTone(
  beatType: BeatType,
  environmentalScore: number
): EmotionalTone {
  const possibleTones = BEAT_TONE_MAP[beatType];

  // Environmental score influences which tone variant
  if (environmentalScore >= 70) {
    // High environmental support = more positive tone
    return possibleTones[0];
  } else if (environmentalScore >= 45) {
    // Mixed environment = middle tone
    return possibleTones[1] || possibleTones[0];
  } else {
    // Low environmental support = more reflective tone
    return possibleTones[2] || possibleTones[1] || possibleTones[0];
  }
}

/**
 * Emotional tone Chinese names
 */
export const TONE_CHINESE: Record<EmotionalTone, string> = {
  hopeful: '希望',
  joyful: '喜悦',
  passionate: '热烈',
  tender: '温柔',
  reflective: '沉思',
  challenging: '挑战',
  transformative: '蜕变',
  peaceful: '平和',
  bittersweet: '苦乐参半',
  triumphant: '胜利'
};

// ============================================================================
// BEAT SUMMARY GENERATION
// ============================================================================

/**
 * Beat type descriptions
 */
const BEAT_DESCRIPTIONS: Record<BeatType, { en: string; zh: string }> = {
  opening: {
    en: 'A new chapter begins, setting the stage for what is to come.',
    zh: '新篇章开启，为即将到来的一切铺设舞台。'
  },
  rising: {
    en: 'Momentum builds as energies align favorably.',
    zh: '能量顺势汇聚，势头渐起。'
  },
  peak: {
    en: 'A climactic moment arrives, bringing breakthrough potential.',
    zh: '高峰时刻来临，带来突破的可能。'
  },
  conflict: {
    en: 'Challenges arise, testing the foundation that has been built.',
    zh: '挑战浮现，考验已建立的根基。'
  },
  turning: {
    en: 'A pivotal shift changes the direction of the journey.',
    zh: '关键转折改变旅程的方向。'
  },
  healing: {
    en: 'A period of recovery and gentle integration unfolds.',
    zh: '修复与温和整合的时期展开。'
  },
  integration: {
    en: 'Lessons are absorbed and wisdom takes root.',
    zh: '汲取教训，智慧扎根。'
  },
  resolution: {
    en: 'A sense of completion and fulfillment emerges.',
    zh: '完成感与满足感浮现。'
  }
};

/**
 * Generate summary for a beat
 */
export function summarizeBeat(
  beatType: BeatType,
  lifecyclePhase: string,
  score: number
): { en: string; zh: string } {
  const base = BEAT_DESCRIPTIONS[beatType];

  // Add score-based modifier
  let modifier = { en: '', zh: '' };

  if (score >= 80) {
    modifier = {
      en: ' The energies are exceptionally supportive.',
      zh: '能量格外支持。'
    };
  } else if (score >= 60) {
    modifier = {
      en: ' Conditions are favorable for progress.',
      zh: '条件有利于前进。'
    };
  } else if (score <= 30) {
    modifier = {
      en: ' Extra care and patience are advised.',
      zh: '建议额外小心和耐心。'
    };
  }

  return {
    en: base.en + modifier.en,
    zh: base.zh + modifier.zh
  };
}

// ============================================================================
// INTENSITY CALCULATION
// ============================================================================

/**
 * Calculate beat intensity from multiple factors
 */
export function calculateBeatIntensity(
  timingScore: number,
  environmentalScore: number,
  eventScore: number
): number {
  // Weighted combination
  const baseIntensity =
    timingScore * 0.4 +
    environmentalScore * 0.3 +
    eventScore * 0.3;

  // Normalize to 0-100
  return Math.round(Math.max(0, Math.min(100, baseIntensity)));
}

// ============================================================================
// MAIN BEAT BUILDER
// ============================================================================

/**
 * Build story beats from timing windows
 */
export function buildStoryBeats(
  timing: TimingWindow[],
  environment: EnvironmentalContext,
  lifecycle: LifecycleContext,
  events: EventTriggerContext
): StoryBeat[] {
  const beats: StoryBeat[] = [];
  let previousBeatType: BeatType | undefined;

  for (let i = 0; i < timing.length; i++) {
    const window = timing[i];
    const isFirst = i === 0;

    // Classify this beat
    const beatType = classifyBeat(
      window.score,
      lifecycle.phase,
      previousBeatType,
      isFirst
    );

    // Derive emotional tone
    const emotionalTone = deriveTone(beatType, environment.environmentalScore);

    // Generate summary
    const summary = summarizeBeat(beatType, lifecycle.phase, window.score);

    // Calculate intensity
    const intensity = calculateBeatIntensity(
      window.score,
      environment.environmentalScore,
      events.overallActivation
    );

    // Determine time range
    const year = window.year;
    const month = window.month;
    const timeRange = month
      ? {
          start: `${year}-${String(month).padStart(2, '0')}-01`,
          end: `${year}-${String(month).padStart(2, '0')}-28`
        }
      : {
          start: `${year}-01-01`,
          end: `${year}-12-31`
        };

    // Build beat
    const beat: StoryBeat = {
      id: `beat-${year}${month ? `-${month}` : ''}`,
      timeRange,
      beatType,
      timingScore: window.score,
      environmentalScore: environment.environmentalScore,
      eventScore: events.overallActivation,
      lifecyclePhase: lifecycle.phase,
      emotionalTone,
      summary: summary.en,
      summaryChinese: summary.zh,
      keyEvents: window.events || [],
      intensity
    };

    beats.push(beat);
    previousBeatType = beatType;
  }

  return beats;
}

// ============================================================================
// BEAT ANALYSIS UTILITIES
// ============================================================================

/**
 * Find peak beats (climactic moments)
 */
export function findPeakBeats(beats: StoryBeat[]): StoryBeat[] {
  return beats.filter(b => b.beatType === 'peak');
}

/**
 * Find turning points
 */
export function findTurningPoints(beats: StoryBeat[]): StoryBeat[] {
  return beats.filter(b => b.beatType === 'turning');
}

/**
 * Get emotional arc of beats
 */
export function getEmotionalArc(beats: StoryBeat[]): EmotionalTone[] {
  return beats.map(b => b.emotionalTone);
}

/**
 * Calculate overall beat trajectory (rising, falling, stable)
 */
export function calculateBeatTrajectory(
  beats: StoryBeat[]
): 'rising' | 'falling' | 'stable' | 'volatile' {
  if (beats.length < 2) return 'stable';

  const firstHalf = beats.slice(0, Math.floor(beats.length / 2));
  const secondHalf = beats.slice(Math.floor(beats.length / 2));

  const firstAvg = firstHalf.reduce((sum, b) => sum + b.intensity, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, b) => sum + b.intensity, 0) / secondHalf.length;

  const diff = secondAvg - firstAvg;

  // Check for volatility (high variance)
  const allIntensities = beats.map(b => b.intensity);
  const mean = allIntensities.reduce((a, b) => a + b, 0) / allIntensities.length;
  const variance = allIntensities.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / allIntensities.length;

  if (variance > 400) {
    return 'volatile';
  }

  if (diff > 10) return 'rising';
  if (diff < -10) return 'falling';
  return 'stable';
}
