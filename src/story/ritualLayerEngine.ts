/**
 * Cathedral Ritual Layer Engine (大教堂仪式层引擎)
 *
 * The ceremonial interface — where the cathedral touches the human hand.
 * This is the sacred interaction model for pilgrims standing before the altar,
 * translating timing, story, and environment into lived experience.
 *
 * Four Chambers:
 * 1. Moment Chamber (时刻之室) - The meaning of now
 * 2. Day Chamber (日之室) - Daily ritual sequence
 * 3. Ceremony Chamber (仪式之室) - Guided rituals
 * 4. Journey Chamber (旅程之室) - Long arcs
 */

import type {
  RitualArchetype,
  ChamberType,
  CompassDirection,
  DayPhase,
  SeasonType,
  GuidedCeremonyType,
  TimingQuality,
  RitualGlyph,
  DirectionalGuidance,
  MicroTimingWindow,
  StoryBeatAlignment,
  MomentReading,
  MomentCard,
  DailyPhaseReading,
  DailyEnvironmentalAlignment,
  DailyRitualWindow,
  DailyStoryBeatMarker,
  DayReading,
  RitualTimeline,
  BreathPattern,
  GesturePosture,
  IntentionWords,
  CeremonyStep,
  CeremonyTimingAlignment,
  GuidedCeremony,
  ActiveCeremony,
  CeremonyCompletion,
  MonthlyReading,
  SeasonalArc,
  AnnualChapter,
  TurningPointMarker,
  HealingCycle,
  RenewalCycle,
  JourneyReading,
  SeasonalMandala,
  ChapterWheel,
  DestinyCurve,
  MomentCardState,
  RitualCompassState,
  MicroTimingWindowState,
  ArchetypeCardState,
  CeremonyGuideState,
  StoryAlignmentPanelState,
  SeasonalMandalaState,
  SanctuaryState,
  RitualLayerConfig,
  RitualLayerEventType,
  RitualLayerEvent,
  RitualLayerState,
} from './ritualLayerTypes';

import {
  ARCHETYPE_CHINESE,
  ARCHETYPE_SYMBOLS,
  ARCHETYPE_COLORS,
  CHAMBER_CHINESE,
  DIRECTION_CHINESE,
  DIRECTION_DEGREES,
  DAY_PHASE_CHINESE,
  DAY_PHASE_TIMES,
  SEASON_CHINESE,
  SEASON_THEMES,
  SEASON_COLORS,
  CEREMONY_TYPE_CHINESE,
  TIMING_QUALITY_CHINESE,
  DEFAULT_RITUAL_LAYER_CONFIG,
  DEFAULT_ARCHETYPE_GLYPHS,
} from './ritualLayerTypes';

// ============================================================================
// INTERNAL STATE
// ============================================================================

let ritualLayerState: RitualLayerState | null = null;

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `rl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// 🜁 1. MOMENT CHAMBER (时刻之室)
// ============================================================================

/**
 * Determine the current ritual archetype based on timing signals
 */
export function determineCurrentArchetype(
  hour: number,
  timingSignals?: { dayOfficer?: string; qiMenDoor?: string }
): RitualArchetype {
  // Default phase-based archetype
  let archetype: RitualArchetype;

  if (hour >= 6 && hour < 12) {
    archetype = 'initiate';  // Morning = new beginnings
  } else if (hour >= 12 && hour < 18) {
    archetype = 'deepen';    // Afternoon = deepening work
  } else if (hour >= 18 && hour < 22) {
    archetype = 'heal';      // Evening = restoration
  } else {
    archetype = 'release';   // Night = letting go
  }

  // Override based on Qi Men door if available
  if (timingSignals?.qiMenDoor) {
    switch (timingSignals.qiMenDoor) {
      case 'open':
        archetype = 'initiate';
        break;
      case 'life':
        archetype = 'deepen';
        break;
      case 'rest':
        archetype = 'heal';
        break;
      case 'death':
        archetype = 'release';
        break;
    }
  }

  return archetype;
}

/**
 * Create a ritual glyph for an archetype
 */
export function createRitualGlyph(
  archetype: RitualArchetype,
  intensity?: number
): RitualGlyph {
  const defaultGlyph = DEFAULT_ARCHETYPE_GLYPHS[archetype];
  return {
    ...defaultGlyph,
    intensity: intensity ?? defaultGlyph.intensity,
  };
}

/**
 * Generate directional guidance for the current moment
 */
export function generateDirectionalGuidance(
  auspiciousDirection: CompassDirection,
  qiMenDoor?: string,
  fengShuiSector?: string
): DirectionalGuidance {
  return {
    auspiciousDirection,
    directionDegrees: DIRECTION_DEGREES[auspiciousDirection],
    directionStrength: 0.8,
    qiMenDoor: qiMenDoor ?? 'life',
    fengShuiSector: fengShuiSector ?? 'prosperity',
    compassMessage: `Face ${auspiciousDirection.charAt(0).toUpperCase() + auspiciousDirection.slice(1)}.`,
  };
}

/**
 * Generate a micro-timing window
 */
export function generateMicroTimingWindow(
  start: Date,
  durationMinutes: number,
  quality: TimingQuality,
  windowType: string
): MicroTimingWindow {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();
  const isActive = now >= start && now <= end;

  return {
    start,
    end,
    quality,
    durationMinutes,
    isActive,
    windowType,
    description: `Use the window between ${formatTime(start)}–${formatTime(end)}.`,
  };
}

/**
 * Generate story beat alignment
 */
export function generateStoryBeatAlignment(
  currentBeat?: string,
  beatType?: string,
  emotionalTone?: string
): StoryBeatAlignment {
  return {
    currentBeat: currentBeat ?? 'presence',
    beatType: beatType ?? 'rest',
    emotionalTone: emotionalTone ?? 'softness',
    storyMessage: `The story asks for ${emotionalTone ?? 'softness'}.`,
    chapterId: 'current_chapter',
    arcId: 'current_arc',
  };
}

/**
 * Generate a complete moment reading
 */
export function generateMomentReading(
  timestamp?: Date,
  timingSignals?: { dayOfficer?: string; qiMenDoor?: string },
  direction?: CompassDirection,
  storyContext?: { beat?: string; beatType?: string; tone?: string }
): MomentReading {
  const now = timestamp ?? new Date();
  const hour = now.getHours();
  const archetype = determineCurrentArchetype(hour, timingSignals);

  return {
    timestamp: now,
    archetype,
    glyph: createRitualGlyph(archetype),
    ceremonialMessage: `This is a ${archetype.toUpperCase()} moment.`,
    direction: generateDirectionalGuidance(
      direction ?? 'north',
      timingSignals?.qiMenDoor
    ),
    microWindow: generateMicroTimingWindow(
      now,
      15,
      'excellent',
      timingSignals?.qiMenDoor ?? 'life_door'
    ),
    storyAlignment: generateStoryBeatAlignment(
      storyContext?.beat,
      storyContext?.beatType,
      storyContext?.tone
    ),
    ritualName: `This is the ritual of ${getRitualName(archetype)}.`,
    affirmation: generateAffirmation(archetype),
    energyDescription: getEnergyDescription(archetype, hour),
  };
}

/**
 * Create a moment card from a reading
 */
export function createMomentCard(reading: MomentReading): MomentCard {
  const nextUpdate = new Date(reading.timestamp.getTime() + 60 * 60 * 1000); // 1 hour
  const transitionIn = Math.max(0, Math.floor((nextUpdate.getTime() - Date.now()) / 1000));

  return {
    reading,
    isGlowing: reading.microWindow.isActive,
    lastUpdated: new Date(),
    nextUpdate,
    transitionIn,
  };
}

/**
 * Get the current moment reading from state
 */
export function getCurrentMoment(): MomentReading | null {
  return ritualLayerState?.currentMoment ?? null;
}

/**
 * Refresh the moment reading
 */
export function refreshMomentReading(): MomentReading {
  const reading = generateMomentReading();

  if (ritualLayerState) {
    const previousArchetype = ritualLayerState.currentMoment?.archetype;
    ritualLayerState.currentMoment = reading;
    ritualLayerState.lastUpdated = new Date();
    ritualLayerState.sanctuary.momentCard.card = createMomentCard(reading);

    // Emit event if archetype changed
    if (previousArchetype && previousArchetype !== reading.archetype) {
      emitRitualEvent('archetype_shift', 'moment', {
        from: previousArchetype,
        to: reading.archetype,
      });
    }
  }

  return reading;
}

// ============================================================================
// 🜂 2. DAY CHAMBER (日之室)
// ============================================================================

/**
 * Generate a daily phase reading
 */
export function generateDailyPhaseReading(
  phase: DayPhase,
  archetype?: RitualArchetype,
  direction?: CompassDirection
): DailyPhaseReading {
  const defaultArchetypes: Record<DayPhase, RitualArchetype> = {
    morning: 'initiate',
    afternoon: 'deepen',
    evening: 'heal',
    night: 'release',
  };

  const actualArchetype = archetype ?? defaultArchetypes[phase];

  return {
    phase,
    archetype: actualArchetype,
    timeRange: DAY_PHASE_TIMES[phase],
    glyph: createRitualGlyph(actualArchetype),
    guidance: getPhaseGuidance(phase, actualArchetype),
    direction: direction ?? getPhaseDirection(phase),
    storyBeat: getPhaseBeat(phase),
  };
}

/**
 * Generate daily environmental alignment
 */
export function generateDailyEnvironmentalAlignment(date: Date): DailyEnvironmentalAlignment {
  return {
    date,
    qiMenChart: {
      lifeDoor: 'southeast',
      openDoor: 'east',
      restDoor: 'north',
      deathDoor: 'southwest',
    },
    fengShuiEnergy: 'Wood ascending',
    lunarPhase: getLunarPhase(date),
    solarTerm: getSolarTerm(date),
    elementOfDay: getDayElement(date),
  };
}

/**
 * Generate daily ritual windows
 */
export function generateDailyRitualWindows(date: Date): DailyRitualWindow[] {
  const windows: DailyRitualWindow[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  // Morning initiation window
  windows.push({
    id: generateId(),
    start: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000),
    end: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000),
    archetype: 'initiate',
    quality: 'excellent',
    purpose: 'Best for initiating projects and new beginnings',
    direction: 'east',
  });

  // Midday deepening window
  windows.push({
    id: generateId(),
    start: new Date(baseDate.getTime() + 11 * 60 * 60 * 1000),
    end: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000),
    archetype: 'deepen',
    quality: 'good',
    purpose: 'Best for deepening work and building foundations',
    direction: 'south',
  });

  // Evening healing window
  windows.push({
    id: generateId(),
    start: new Date(baseDate.getTime() + 18 * 60 * 60 * 1000),
    end: new Date(baseDate.getTime() + 20 * 60 * 60 * 1000),
    archetype: 'heal',
    quality: 'excellent',
    purpose: 'Best for healing work and restoration',
    direction: 'north',
  });

  // Night release window
  windows.push({
    id: generateId(),
    start: new Date(baseDate.getTime() + 22 * 60 * 60 * 1000),
    end: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000),
    archetype: 'release',
    quality: 'good',
    purpose: 'Best for releasing and letting go',
    direction: 'west',
  });

  return windows;
}

/**
 * Generate daily story beat markers
 */
export function generateDailyStoryBeatMarkers(date: Date): DailyStoryBeatMarker[] {
  const markers: DailyStoryBeatMarker[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  const beats = [
    { hour: 6, name: 'Awakening', type: 'rising', value: 0.3, narrative: 'The day begins with possibility' },
    { hour: 9, name: 'Building', type: 'rising', value: 0.5, narrative: 'Energy gathers and momentum builds' },
    { hour: 12, name: 'Peak', type: 'climax', value: 0.8, narrative: 'The day reaches its zenith' },
    { hour: 15, name: 'Turning', type: 'falling', value: 0.4, narrative: 'Energy shifts toward reflection' },
    { hour: 18, name: 'Settling', type: 'falling', value: 0.2, narrative: 'The day moves toward closure' },
    { hour: 21, name: 'Integration', type: 'rest', value: 0.1, narrative: 'Wisdom integrates in stillness' },
  ];

  for (const beat of beats) {
    markers.push({
      time: new Date(baseDate.getTime() + beat.hour * 60 * 60 * 1000),
      beatName: beat.name,
      beatType: beat.type,
      emotionalValue: beat.value,
      narrative: beat.narrative,
    });
  }

  return markers;
}

/**
 * Generate a complete day reading
 */
export function generateDayReading(date?: Date): DayReading {
  const targetDate = date ?? new Date();
  const phases: DailyPhaseReading[] = [
    generateDailyPhaseReading('morning'),
    generateDailyPhaseReading('afternoon'),
    generateDailyPhaseReading('evening'),
    generateDailyPhaseReading('night'),
  ];

  return {
    date: targetDate,
    phases,
    environment: generateDailyEnvironmentalAlignment(targetDate),
    ritualWindows: generateDailyRitualWindows(targetDate),
    storyBeats: generateDailyStoryBeatMarkers(targetDate),
    dailyTheme: getDailyTheme(targetDate),
    dailyRitualName: 'This is the ritual of daily flow.',
    primaryArchetype: 'initiate',
    secondaryArchetype: 'deepen',
  };
}

/**
 * Create a ritual timeline from a day reading
 */
export function createRitualTimeline(reading: DayReading): RitualTimeline {
  const now = new Date();
  const hour = now.getHours();

  let currentPhaseIndex = 0;
  if (hour >= 6 && hour < 12) currentPhaseIndex = 0;
  else if (hour >= 12 && hour < 18) currentPhaseIndex = 1;
  else if (hour >= 18 && hour < 22) currentPhaseIndex = 2;
  else currentPhaseIndex = 3;

  const currentWindowIndex = reading.ritualWindows.findIndex(
    w => now >= w.start && now <= w.end
  );

  const dayStart = new Date(reading.date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const progressPercent = ((now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * 100;

  return {
    reading,
    currentPhaseIndex,
    currentWindowIndex,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    nextTransition: getNextPhaseTransition(hour),
  };
}

/**
 * Get the current day reading from state
 */
export function getCurrentDay(): DayReading | null {
  return ritualLayerState?.currentDay ?? null;
}

/**
 * Refresh the day reading
 */
export function refreshDayReading(): DayReading {
  const reading = generateDayReading();

  if (ritualLayerState) {
    ritualLayerState.currentDay = reading;
    ritualLayerState.lastUpdated = new Date();
  }

  return reading;
}

// ============================================================================
// 🜃 3. CEREMONY CHAMBER (仪式之室)
// ============================================================================

/**
 * Create a breath pattern
 */
export function createBreathPattern(
  name: string,
  inhale: number,
  hold: number,
  exhale: number,
  cycles: number
): BreathPattern {
  return {
    name,
    inhaleSeconds: inhale,
    holdSeconds: hold,
    exhaleSeconds: exhale,
    cycles,
    guidance: `Breathe in for ${inhale}s, hold for ${hold}s, exhale for ${exhale}s. Repeat ${cycles} times.`,
  };
}

/**
 * Create a gesture/posture instruction
 */
export function createGesturePosture(
  name: string,
  description: string,
  duration?: string
): GesturePosture {
  return {
    name,
    description,
    duration: duration ?? 'hold for the duration',
  };
}

/**
 * Create intention words
 */
export function createIntentionWords(
  template: string,
  placeholders: string[],
  spokenAloud: boolean,
  timing?: string
): IntentionWords {
  return {
    template,
    placeholders,
    spokenAloud,
    timing: timing ?? 'at the appropriate moment',
  };
}

/**
 * Create a ceremony step
 */
export function createCeremonyStep(
  order: number,
  title: string,
  type: CeremonyStep['type'],
  instruction: string,
  details?: Partial<CeremonyStep>
): CeremonyStep {
  return {
    id: generateId(),
    order,
    title,
    type,
    instruction,
    isComplete: false,
    ...details,
  };
}

/**
 * Generate a vow ceremony
 */
export function generateVowCeremony(timing?: CeremonyTimingAlignment): GuidedCeremony {
  const now = new Date();

  return {
    id: generateId(),
    type: 'vow',
    name: 'Vow Ritual',
    subtitle: timing?.quality === 'excellent' ? '(Excellent Window)' : '(Good Window)',
    description: 'A sacred ceremony for making commitments and sacred promises.',
    archetype: 'deepen',
    steps: [
      createCeremonyStep(1, 'Face the Direction', 'direction', 'Turn to face the auspicious direction.', {
        direction: timing?.direction.auspiciousDirection ?? 'southeast',
      }),
      createCeremonyStep(2, 'Centering Breath', 'breath', 'Take centering breaths to prepare.', {
        breath: createBreathPattern('centering', 4, 4, 4, 3),
      }),
      createCeremonyStep(3, 'Sacred Posture', 'gesture', 'Assume the posture of commitment.', {
        gesture: createGesturePosture('hands together', 'Place your hands together at your heart.'),
      }),
      createCeremonyStep(4, 'Speak the Intention', 'intention', 'Speak your vow aloud.', {
        intention: createIntentionWords(
          'I commit to {commitment}. I honor this promise with my whole being.',
          ['commitment'],
          true,
          'during the Life Door window'
        ),
      }),
      createCeremonyStep(5, 'Sacred Pause', 'pause', 'Hold the intention in silence.', {
        pauseSeconds: 30,
      }),
      createCeremonyStep(6, 'Closing', 'closing', 'Close with a grounding breath.', {
        breath: createBreathPattern('grounding', 4, 2, 6, 1),
      }),
    ],
    timing: timing ?? generateDefaultCeremonyTiming(now),
    durationMinutes: 15,
    ritualName: 'This is the ritual of transformation.',
    prerequisites: ['Find a quiet space', 'Clear your mind', 'Know your intention'],
    aftercare: ['Journal your experience', 'Take gentle action toward your vow', 'Rest well tonight'],
  };
}

/**
 * Generate a healing ceremony
 */
export function generateHealingCeremony(timing?: CeremonyTimingAlignment): GuidedCeremony {
  const now = new Date();

  return {
    id: generateId(),
    type: 'healing',
    name: 'Healing Ritual',
    subtitle: timing?.quality === 'excellent' ? '(Excellent Window)' : '(Good Window)',
    description: 'A sacred ceremony for restoration, forgiveness, and wholeness.',
    archetype: 'heal',
    steps: [
      createCeremonyStep(1, 'Face the Direction', 'direction', 'Turn to face the healing direction.', {
        direction: timing?.direction.auspiciousDirection ?? 'north',
      }),
      createCeremonyStep(2, 'Softening Breath', 'breath', 'Breathe softly to open your heart.', {
        breath: createBreathPattern('softening', 4, 2, 8, 5),
      }),
      createCeremonyStep(3, 'Receiving Posture', 'gesture', 'Open to receive healing energy.', {
        gesture: createGesturePosture('open palms', 'Open your palms upward, receiving.'),
      }),
      createCeremonyStep(4, 'Speak the Intention', 'intention', 'Name what needs healing.', {
        intention: createIntentionWords(
          'I release {pain} and welcome {healing}.',
          ['pain', 'healing'],
          true,
          'with compassion'
        ),
      }),
      createCeremonyStep(5, 'Integration Pause', 'pause', 'Allow the healing to integrate.', {
        pauseSeconds: 60,
      }),
      createCeremonyStep(6, 'Closing', 'closing', 'Seal the healing with gratitude.', {
        breath: createBreathPattern('gratitude', 4, 4, 4, 3),
      }),
    ],
    timing: timing ?? generateDefaultCeremonyTiming(now),
    durationMinutes: 20,
    ritualName: 'This is the ritual of restoration.',
    prerequisites: ['Create a safe space', 'Be gentle with yourself', 'Have tissues nearby'],
    aftercare: ['Rest deeply', 'Drink water', 'Move slowly for the next hour'],
  };
}

/**
 * Generate a closure ceremony
 */
export function generateClosureCeremony(timing?: CeremonyTimingAlignment): GuidedCeremony {
  const now = new Date();

  return {
    id: generateId(),
    type: 'closure',
    name: 'Closure Ritual',
    subtitle: timing?.quality === 'excellent' ? '(Excellent Window)' : '(Good Window)',
    description: 'A sacred ceremony for release, completion, and honoring what was.',
    archetype: 'release',
    steps: [
      createCeremonyStep(1, 'Face the Direction', 'direction', 'Turn to face the direction of release.', {
        direction: timing?.direction.auspiciousDirection ?? 'west',
      }),
      createCeremonyStep(2, 'Releasing Breath', 'breath', 'Breathe out what no longer serves.', {
        breath: createBreathPattern('releasing', 4, 0, 8, 7),
      }),
      createCeremonyStep(3, 'Bowing Posture', 'gesture', 'Bow in honor of what was.', {
        gesture: createGesturePosture('bow', 'Bow your head in acknowledgment.'),
      }),
      createCeremonyStep(4, 'Speak the Intention', 'intention', 'Speak your release.', {
        intention: createIntentionWords(
          'I release {what}. I honor what was. I am free.',
          ['what'],
          true,
          'with finality'
        ),
      }),
      createCeremonyStep(5, 'Emptying Pause', 'pause', 'Allow emptiness to arise.', {
        pauseSeconds: 45,
      }),
      createCeremonyStep(6, 'Closing', 'closing', 'Close with a grounding return.', {
        breath: createBreathPattern('grounding', 4, 4, 4, 2),
      }),
    ],
    timing: timing ?? generateDefaultCeremonyTiming(now),
    durationMinutes: 15,
    ritualName: 'This is the ritual of completion.',
    prerequisites: ['Gather any symbolic items', 'Write down what you release', 'Find solitude'],
    aftercare: ['Dispose of symbolic items if appropriate', 'Walk in nature', 'Allow emotions to flow'],
  };
}

/**
 * Generate an initiation ceremony
 */
export function generateInitiationCeremony(timing?: CeremonyTimingAlignment): GuidedCeremony {
  const now = new Date();

  return {
    id: generateId(),
    type: 'initiation',
    name: 'Initiation Ritual',
    subtitle: timing?.quality === 'excellent' ? '(Excellent Window)' : '(Good Window)',
    description: 'A sacred ceremony for new beginnings and threshold-crossing.',
    archetype: 'initiate',
    steps: [
      createCeremonyStep(1, 'Face the Direction', 'direction', 'Turn to face the direction of new beginnings.', {
        direction: timing?.direction.auspiciousDirection ?? 'east',
      }),
      createCeremonyStep(2, 'Awakening Breath', 'breath', 'Breathe to awaken new energy.', {
        breath: createBreathPattern('awakening', 6, 2, 4, 4),
      }),
      createCeremonyStep(3, 'Rising Posture', 'gesture', 'Rise to meet the new.', {
        gesture: createGesturePosture('arms raised', 'Raise your arms to embrace possibility.'),
      }),
      createCeremonyStep(4, 'Speak the Intention', 'intention', 'Declare your new beginning.', {
        intention: createIntentionWords(
          'I begin {what}. I cross this threshold with courage. I am ready.',
          ['what'],
          true,
          'with conviction'
        ),
      }),
      createCeremonyStep(5, 'Threshold Pause', 'pause', 'Stand at the threshold.', {
        pauseSeconds: 20,
      }),
      createCeremonyStep(6, 'Closing', 'closing', 'Step forward with grounded energy.', {
        breath: createBreathPattern('grounding', 4, 2, 4, 2),
      }),
    ],
    timing: timing ?? generateDefaultCeremonyTiming(now),
    durationMinutes: 12,
    ritualName: 'This is the ritual of beginning.',
    prerequisites: ['Clear your schedule', 'Set a clear intention', 'Choose a symbolic first action'],
    aftercare: ['Take your first action immediately', 'Record the moment', 'Celebrate the beginning'],
  };
}

/**
 * Get a ceremony by type
 */
export function getCeremony(type: GuidedCeremonyType): GuidedCeremony {
  switch (type) {
    case 'vow':
      return generateVowCeremony();
    case 'healing':
      return generateHealingCeremony();
    case 'closure':
      return generateClosureCeremony();
    case 'initiation':
      return generateInitiationCeremony();
  }
}

/**
 * Start a ceremony
 */
export function startCeremony(ceremony: GuidedCeremony): ActiveCeremony {
  const active: ActiveCeremony = {
    ceremony,
    startedAt: new Date(),
    currentStepIndex: 0,
    completedSteps: [],
    isPaused: false,
    userIntentions: {},
  };

  if (ritualLayerState) {
    ritualLayerState.activeCeremony = active;
    emitRitualEvent('ceremony_start', 'ceremony', {
      ceremonyId: ceremony.id,
      ceremonyType: ceremony.type,
    });
  }

  return active;
}

/**
 * Advance to the next ceremony step
 */
export function advanceCeremonyStep(): CeremonyStep | null {
  if (!ritualLayerState?.activeCeremony) return null;

  const active = ritualLayerState.activeCeremony;
  const ceremony = active.ceremony;

  if (active.currentStepIndex < ceremony.steps.length) {
    const completedStep = ceremony.steps[active.currentStepIndex];
    completedStep.isComplete = true;
    active.completedSteps.push(completedStep.id);
    active.currentStepIndex++;

    emitRitualEvent('ceremony_step', 'ceremony', {
      ceremonyId: ceremony.id,
      stepIndex: active.currentStepIndex,
      stepTitle: completedStep.title,
    });

    if (active.currentStepIndex >= ceremony.steps.length) {
      // Ceremony complete
      return null;
    }

    return ceremony.steps[active.currentStepIndex];
  }

  return null;
}

/**
 * Complete a ceremony
 */
export function completeCeremony(): CeremonyCompletion | null {
  if (!ritualLayerState?.activeCeremony) return null;

  const active = ritualLayerState.activeCeremony;
  const ceremony = active.ceremony;
  const now = new Date();

  const completion: CeremonyCompletion = {
    ceremonyId: ceremony.id,
    completedAt: now,
    durationActual: Math.floor((now.getTime() - active.startedAt.getTime()) / 1000 / 60),
    stepsCompleted: active.completedSteps.length,
    stepsTotal: ceremony.steps.length,
    userIntentions: active.userIntentions,
    timing: {
      quality: ceremony.timing.quality,
      withinOptimalWindow: now >= ceremony.timing.optimalStart && now <= ceremony.timing.optimalEnd,
    },
    integration: `This ${ceremony.type} ceremony aligns with your current story arc.`,
  };

  if (ritualLayerState.sanctuary.ceremonyGuide.completedCeremonies) {
    ritualLayerState.sanctuary.ceremonyGuide.completedCeremonies.push(completion);
  }

  ritualLayerState.activeCeremony = null;

  emitRitualEvent('ceremony_complete', 'ceremony', {
    ceremonyId: ceremony.id,
    ceremonyType: ceremony.type,
    completion,
  });

  return completion;
}

/**
 * Get the active ceremony
 */
export function getActiveCeremony(): ActiveCeremony | null {
  return ritualLayerState?.activeCeremony ?? null;
}

// ============================================================================
// 🜄 4. JOURNEY CHAMBER (旅程之室)
// ============================================================================

/**
 * Generate a monthly reading
 */
export function generateMonthlyReading(month?: number, year?: number): MonthlyReading {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const archetypes: RitualArchetype[] = ['initiate', 'deepen', 'heal', 'release'];
  const monthArchetype = archetypes[(targetMonth - 1) % 4];

  return {
    month: targetMonth,
    year: targetYear,
    archetype: monthArchetype,
    theme: getMonthTheme(targetMonth),
    keyDates: generateKeyDates(targetMonth, targetYear),
    ritualWindows: generateMonthlyRitualWindows(targetMonth, targetYear),
    storyChapter: `Chapter ${targetMonth}: ${getMonthTheme(targetMonth)}`,
    guidance: getMonthGuidance(monthArchetype),
  };
}

/**
 * Generate a seasonal arc reading
 */
export function generateSeasonalArc(season?: SeasonType, year?: number): SeasonalArc {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetSeason = season ?? getCurrentSeason(now);

  const seasonArchetypes: Record<SeasonType, RitualArchetype> = {
    spring: 'initiate',
    summer: 'deepen',
    autumn: 'release',
    winter: 'heal',
  };

  const seasonDates = getSeasonDates(targetSeason, targetYear);

  return {
    season: targetSeason,
    year: targetYear,
    archetype: seasonArchetypes[targetSeason],
    theme: SEASON_THEMES[targetSeason],
    startDate: seasonDates.start,
    endDate: seasonDates.end,
    keyMoments: generateSeasonKeyMoments(targetSeason, targetYear),
    storyArc: `${SEASON_THEMES[targetSeason]} Arc`,
    ritualFocus: getSeasonRitualFocus(targetSeason),
    elementalEnergy: getSeasonElement(targetSeason),
  };
}

/**
 * Generate an annual chapter reading
 */
export function generateAnnualChapter(year?: number): AnnualChapter {
  const targetYear = year ?? new Date().getFullYear();

  return {
    year: targetYear,
    primaryArchetype: 'initiate',
    secondaryArchetype: 'deepen',
    theme: `Year of ${getYearTheme(targetYear)}`,
    seasons: [
      generateSeasonalArc('spring', targetYear),
      generateSeasonalArc('summer', targetYear),
      generateSeasonalArc('autumn', targetYear),
      generateSeasonalArc('winter', targetYear),
    ],
    majorTurningPoints: generateAnnualTurningPoints(targetYear),
    destinyKeywords: getYearKeywords(targetYear),
    annualRitualName: 'This is the ritual of annual becoming.',
  };
}

/**
 * Generate a complete journey reading
 */
export function generateJourneyReading(): JourneyReading {
  const now = new Date();

  return {
    generatedAt: now,
    currentMonth: generateMonthlyReading(),
    currentSeason: generateSeasonalArc(),
    currentYear: generateAnnualChapter(),
    upcomingTurningPoints: generateUpcomingTurningPoints(),
    activeHealingCycles: generateActiveHealingCycles(),
    activeRenewalCycles: generateActiveRenewalCycles(),
    destinyArc: {
      pastTheme: 'Foundation',
      presentTheme: 'Expansion',
      futureTheme: 'Integration',
    },
    journeyRitualName: 'This is the ritual of long-form destiny.',
  };
}

/**
 * Create a seasonal mandala
 */
export function createSeasonalMandala(year?: number): SeasonalMandala {
  const targetYear = year ?? new Date().getFullYear();
  const currentSeason = getCurrentSeason(new Date());

  return {
    year: targetYear,
    seasons: [
      {
        season: 'spring',
        archetype: 'initiate',
        color: SEASON_COLORS.spring,
        intensity: currentSeason === 'spring' ? 1.0 : 0.4,
        isActive: currentSeason === 'spring',
      },
      {
        season: 'summer',
        archetype: 'deepen',
        color: SEASON_COLORS.summer,
        intensity: currentSeason === 'summer' ? 1.0 : 0.4,
        isActive: currentSeason === 'summer',
      },
      {
        season: 'autumn',
        archetype: 'release',
        color: SEASON_COLORS.autumn,
        intensity: currentSeason === 'autumn' ? 1.0 : 0.4,
        isActive: currentSeason === 'autumn',
      },
      {
        season: 'winter',
        archetype: 'heal',
        color: SEASON_COLORS.winter,
        intensity: currentSeason === 'winter' ? 1.0 : 0.4,
        isActive: currentSeason === 'winter',
      },
    ],
    centerSymbol: '☯',
    rotation: getSeasonRotation(currentSeason),
  };
}

/**
 * Create a chapter wheel
 */
export function createChapterWheel(): ChapterWheel {
  const chapters = [];
  const totalChapters = 12;
  const anglePerChapter = 360 / totalChapters;
  const currentMonth = new Date().getMonth();

  for (let i = 0; i < totalChapters; i++) {
    const archetypes: RitualArchetype[] = ['initiate', 'deepen', 'heal', 'release'];
    chapters.push({
      id: `chapter_${i + 1}`,
      name: `Chapter ${i + 1}`,
      archetype: archetypes[i % 4],
      startAngle: i * anglePerChapter,
      endAngle: (i + 1) * anglePerChapter,
      isCurrent: i === currentMonth,
      isComplete: i < currentMonth,
    });
  }

  return {
    chapters,
    currentAngle: currentMonth * anglePerChapter,
    totalChapters,
  };
}

/**
 * Create a destiny curve
 */
export function createDestinyCurve(): DestinyCurve {
  const points = [];
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  for (let i = 0; i < 12; i++) {
    const date = new Date(startOfYear);
    date.setMonth(i);

    // Generate a wave-like pattern
    const value = Math.sin((i / 12) * Math.PI * 2) * 0.5 + 0.3;

    points.push({
      date,
      value,
      label: i === now.getMonth() ? 'Now' : undefined,
    });
  }

  return {
    points,
    currentPosition: now.getMonth(),
    trend: determineTrend(points, now.getMonth()),
    nextPeak: findNextPeak(points, now.getMonth()),
    nextValley: findNextValley(points, now.getMonth()),
  };
}

/**
 * Get the current journey reading from state
 */
export function getCurrentJourney(): JourneyReading | null {
  return ritualLayerState?.currentJourney ?? null;
}

/**
 * Refresh the journey reading
 */
export function refreshJourneyReading(): JourneyReading {
  const reading = generateJourneyReading();

  if (ritualLayerState) {
    ritualLayerState.currentJourney = reading;
    ritualLayerState.sanctuary.mandala.mandala = createSeasonalMandala();
    ritualLayerState.sanctuary.chapterWheel = createChapterWheel();
    ritualLayerState.sanctuary.destinyCurve = createDestinyCurve();
    ritualLayerState.lastUpdated = new Date();
  }

  return reading;
}

// ============================================================================
// SANCTUARY UI MANAGEMENT
// ============================================================================

/**
 * Switch active chamber
 */
export function switchChamber(chamber: ChamberType): void {
  if (!ritualLayerState) return;

  const previousChamber = ritualLayerState.sanctuary.activeChamber;
  ritualLayerState.sanctuary.activeChamber = chamber;

  // Refresh the appropriate reading
  switch (chamber) {
    case 'moment':
      refreshMomentReading();
      break;
    case 'day':
      refreshDayReading();
      break;
    case 'journey':
      refreshJourneyReading();
      break;
  }

  emitRitualEvent('phase_change', chamber, {
    from: previousChamber,
    to: chamber,
  });
}

/**
 * Get the current active chamber
 */
export function getActiveChamber(): ChamberType {
  return ritualLayerState?.sanctuary.activeChamber ?? 'moment';
}

/**
 * Toggle fullscreen mode
 */
export function toggleFullscreen(): void {
  if (!ritualLayerState) return;
  ritualLayerState.sanctuary.isFullscreen = !ritualLayerState.sanctuary.isFullscreen;
}

/**
 * Toggle ambient mode
 */
export function toggleAmbientMode(): void {
  if (!ritualLayerState) return;
  ritualLayerState.sanctuary.ambientMode = !ritualLayerState.sanctuary.ambientMode;
}

/**
 * Update compass direction
 */
export function updateCompassDirection(direction: CompassDirection): void {
  if (!ritualLayerState) return;

  const compass = ritualLayerState.sanctuary.compass;
  compass.targetDirection = direction;
  compass.isAnimating = true;

  // Simulate animation completion
  setTimeout(() => {
    if (ritualLayerState) {
      ritualLayerState.sanctuary.compass.currentDirection = direction;
      ritualLayerState.sanctuary.compass.rotation = DIRECTION_DEGREES[direction];
      ritualLayerState.sanctuary.compass.isAnimating = false;
    }
  }, 1000);
}

/**
 * Get sanctuary state
 */
export function getSanctuaryState(): SanctuaryState | null {
  return ritualLayerState?.sanctuary ?? null;
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

/**
 * Emit a ritual layer event
 */
function emitRitualEvent(
  type: RitualLayerEventType,
  chamber: ChamberType,
  data: Record<string, unknown>
): void {
  if (!ritualLayerState) return;

  const event: RitualLayerEvent = {
    id: generateId(),
    type,
    timestamp: new Date(),
    chamber,
    data,
    acknowledged: false,
  };

  ritualLayerState.recentEvents.push(event);

  // Keep only recent events
  if (ritualLayerState.recentEvents.length > 100) {
    ritualLayerState.recentEvents = ritualLayerState.recentEvents.slice(-100);
  }

  // Notify listeners
  const listeners = ritualLayerState.eventListeners.get(type);
  if (listeners) {
    for (const listener of listeners) {
      try {
        listener(event);
      } catch (e) {
        console.error('Ritual event listener error:', e);
      }
    }
  }
}

/**
 * Add an event listener
 */
export function addRitualEventListener(
  type: RitualLayerEventType,
  listener: (event: RitualLayerEvent) => void
): void {
  if (!ritualLayerState) return;

  const listeners = ritualLayerState.eventListeners.get(type) ?? [];
  listeners.push(listener);
  ritualLayerState.eventListeners.set(type, listeners);
}

/**
 * Remove an event listener
 */
export function removeRitualEventListener(
  type: RitualLayerEventType,
  listener: (event: RitualLayerEvent) => void
): void {
  if (!ritualLayerState) return;

  const listeners = ritualLayerState.eventListeners.get(type) ?? [];
  const index = listeners.indexOf(listener);
  if (index >= 0) {
    listeners.splice(index, 1);
  }
}

/**
 * Get recent events
 */
export function getRecentRitualEvents(limit?: number): RitualLayerEvent[] {
  if (!ritualLayerState) return [];
  const events = ritualLayerState.recentEvents;
  return limit ? events.slice(-limit) : events;
}

// ============================================================================
// ENGINE LIFECYCLE
// ============================================================================

/**
 * Initialize the ritual layer
 */
export function initializeRitualLayer(
  config?: Partial<RitualLayerConfig>
): RitualLayerState {
  const fullConfig: RitualLayerConfig = {
    ...DEFAULT_RITUAL_LAYER_CONFIG,
    ...config,
  };

  const momentReading = generateMomentReading();
  const dayReading = generateDayReading();
  const journeyReading = generateJourneyReading();

  ritualLayerState = {
    initialized: true,
    config: fullConfig,
    sanctuary: createInitialSanctuaryState(momentReading, dayReading, journeyReading),
    currentMoment: momentReading,
    currentDay: dayReading,
    currentJourney: journeyReading,
    activeCeremony: null,
    recentEvents: [],
    eventListeners: new Map(),
    lastUpdated: new Date(),
  };

  return ritualLayerState;
}

/**
 * Get the ritual layer state
 */
export function getRitualLayerState(): RitualLayerState | null {
  return ritualLayerState;
}

/**
 * Shutdown the ritual layer
 */
export function shutdownRitualLayer(): void {
  if (ritualLayerState) {
    ritualLayerState.eventListeners.clear();
    ritualLayerState = null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getRitualName(archetype: RitualArchetype): string {
  const names: Record<RitualArchetype, string> = {
    initiate: 'beginning',
    deepen: 'deepening',
    heal: 'presence',
    release: 'letting go',
  };
  return names[archetype];
}

function generateAffirmation(archetype: RitualArchetype): string {
  const affirmations: Record<RitualArchetype, string> = {
    initiate: 'I embrace new beginnings with courage.',
    deepen: 'I go deeper with trust and patience.',
    heal: 'I am whole and becoming more whole.',
    release: 'I let go with grace and gratitude.',
  };
  return affirmations[archetype];
}

function getEnergyDescription(archetype: RitualArchetype, hour: number): string {
  const hourPeriod = hour < 6 ? 'pre-dawn' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : hour < 22 ? 'evening' : 'night';
  return `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} energy flows through this ${hourPeriod} moment.`;
}

function getPhaseGuidance(phase: DayPhase, archetype: RitualArchetype): string {
  return `${phase.charAt(0).toUpperCase() + phase.slice(1)} — ${archetype.charAt(0).toUpperCase() + archetype.slice(1)}`;
}

function getPhaseDirection(phase: DayPhase): CompassDirection {
  const directions: Record<DayPhase, CompassDirection> = {
    morning: 'east',
    afternoon: 'south',
    evening: 'west',
    night: 'north',
  };
  return directions[phase];
}

function getPhaseBeat(phase: DayPhase): string {
  const beats: Record<DayPhase, string> = {
    morning: 'Rising action',
    afternoon: 'Peak activity',
    evening: 'Falling action',
    night: 'Integration',
  };
  return beats[phase];
}

function getNextPhaseTransition(currentHour: number): Date {
  const transitions = [6, 12, 18, 22];
  const now = new Date();

  for (const hour of transitions) {
    if (currentHour < hour) {
      const transition = new Date(now);
      transition.setHours(hour, 0, 0, 0);
      return transition;
    }
  }

  // Next day 6 AM
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0);
  return tomorrow;
}

function getLunarPhase(date: Date): string {
  const day = date.getDate();
  if (day < 7) return 'New Moon';
  if (day < 14) return 'First Quarter';
  if (day < 21) return 'Full Moon';
  return 'Last Quarter';
}

function getSolarTerm(date: Date): string {
  // Simplified - would use actual solar term calculation
  const month = date.getMonth();
  const solarTerms = [
    'Minor Cold', 'Major Cold', 'Start of Spring', 'Rain Water',
    'Awakening of Insects', 'Spring Equinox', 'Clear and Bright', 'Grain Rain',
    'Start of Summer', 'Grain Full', 'Grain in Ear', 'Summer Solstice',
  ];
  return solarTerms[month];
}

function getDayElement(date: Date): string {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  return elements[date.getDay() % 5];
}

function getDailyTheme(date: Date): string {
  const themes = ['Creation', 'Connection', 'Clarity', 'Compassion', 'Completion', 'Celebration', 'Contemplation'];
  return themes[date.getDay()];
}

function generateDefaultCeremonyTiming(date: Date): CeremonyTimingAlignment {
  const start = new Date(date);
  start.setMinutes(start.getMinutes() + 15);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);

  return {
    optimalStart: start,
    optimalEnd: end,
    quality: 'good',
    window: generateMicroTimingWindow(start, 30, 'good', 'ceremony'),
    direction: generateDirectionalGuidance('east'),
    storyAlignment: generateStoryBeatAlignment(),
  };
}

function getMonthTheme(month: number): string {
  const themes = [
    'New Beginnings', 'Growing Roots', 'Emerging', 'Blossoming',
    'Expansion', 'Peak Energy', 'Harvesting', 'Gathering',
    'Turning Inward', 'Deepening', 'Releasing', 'Integration'
  ];
  return themes[month - 1] ?? 'Flowing';
}

function generateKeyDates(month: number, year: number): { date: Date; significance: string }[] {
  const dates = [];
  const baseDate = new Date(year, month - 1, 1);

  dates.push({ date: new Date(baseDate), significance: 'Month begins' });

  const midMonth = new Date(year, month - 1, 15);
  dates.push({ date: midMonth, significance: 'Month midpoint' });

  const lastDay = new Date(year, month, 0);
  dates.push({ date: lastDay, significance: 'Month closes' });

  return dates;
}

function generateMonthlyRitualWindows(month: number, year: number): { start: Date; end: Date; purpose: string }[] {
  return [
    {
      start: new Date(year, month - 1, 1),
      end: new Date(year, month - 1, 3),
      purpose: 'Initiation window',
    },
    {
      start: new Date(year, month - 1, 14),
      end: new Date(year, month - 1, 16),
      purpose: 'Peak window',
    },
    {
      start: new Date(year, month - 1, 28),
      end: new Date(year, month, 0),
      purpose: 'Completion window',
    },
  ];
}

function getMonthGuidance(archetype: RitualArchetype): string {
  const guidance: Record<RitualArchetype, string> = {
    initiate: 'This month favors new beginnings. Plant seeds.',
    deepen: 'This month favors going deeper. Strengthen roots.',
    heal: 'This month favors healing. Restore balance.',
    release: 'This month favors release. Let go of what no longer serves.',
  };
  return guidance[archetype];
}

function getCurrentSeason(date: Date): SeasonType {
  const month = date.getMonth();
  if (month >= 2 && month < 5) return 'spring';
  if (month >= 5 && month < 8) return 'summer';
  if (month >= 8 && month < 11) return 'autumn';
  return 'winter';
}

function getSeasonDates(season: SeasonType, year: number): { start: Date; end: Date } {
  const seasons: Record<SeasonType, { startMonth: number; endMonth: number }> = {
    spring: { startMonth: 2, endMonth: 4 },
    summer: { startMonth: 5, endMonth: 7 },
    autumn: { startMonth: 8, endMonth: 10 },
    winter: { startMonth: 11, endMonth: 1 },
  };

  const s = seasons[season];
  return {
    start: new Date(year, s.startMonth, 1),
    end: new Date(year, s.endMonth + 1, 0),
  };
}

function generateSeasonKeyMoments(season: SeasonType, year: number): { date: Date; description: string }[] {
  const dates = getSeasonDates(season, year);
  return [
    { date: dates.start, description: `${SEASON_THEMES[season]} begins` },
    { date: new Date((dates.start.getTime() + dates.end.getTime()) / 2), description: `${SEASON_THEMES[season]} peaks` },
    { date: dates.end, description: `${SEASON_THEMES[season]} completes` },
  ];
}

function getSeasonRitualFocus(season: SeasonType): string {
  const focuses: Record<SeasonType, string> = {
    spring: 'Initiation rituals, planting intentions',
    summer: 'Celebration rituals, expansion work',
    autumn: 'Harvest rituals, gratitude practices',
    winter: 'Integration rituals, rest and reflection',
  };
  return focuses[season];
}

function getSeasonElement(season: SeasonType): string {
  const elements: Record<SeasonType, string> = {
    spring: 'Wood ascending',
    summer: 'Fire blazing',
    autumn: 'Metal contracting',
    winter: 'Water flowing',
  };
  return elements[season];
}

function getSeasonRotation(season: SeasonType): number {
  const rotations: Record<SeasonType, number> = {
    spring: 0,
    summer: 90,
    autumn: 180,
    winter: 270,
  };
  return rotations[season];
}

function generateAnnualTurningPoints(year: number): TurningPointMarker[] {
  return [
    {
      id: generateId(),
      date: new Date(year, 2, 20),
      type: 'initiation',
      intensity: 0.8,
      description: 'Spring Equinox - New cycle begins',
      archetype: 'initiate',
      storySignificance: 'A threshold of renewal',
    },
    {
      id: generateId(),
      date: new Date(year, 5, 21),
      type: 'revelation',
      intensity: 0.9,
      description: 'Summer Solstice - Peak illumination',
      archetype: 'deepen',
      storySignificance: 'Maximum visibility',
    },
    {
      id: generateId(),
      date: new Date(year, 8, 22),
      type: 'crisis',
      intensity: 0.7,
      description: 'Autumn Equinox - Balance point',
      archetype: 'release',
      storySignificance: 'Letting go begins',
    },
    {
      id: generateId(),
      date: new Date(year, 11, 21),
      type: 'integration',
      intensity: 0.6,
      description: 'Winter Solstice - Deep rest',
      archetype: 'heal',
      storySignificance: 'Seeds of new cycle germinate',
    },
  ];
}

function getYearTheme(year: number): string {
  const themes = ['Dragon', 'Phoenix', 'Tiger', 'Turtle', 'Crane'];
  return themes[year % 5];
}

function getYearKeywords(year: number): string[] {
  return ['transformation', 'growth', 'integration', 'emergence'];
}

function generateUpcomingTurningPoints(): TurningPointMarker[] {
  const now = new Date();
  const year = now.getFullYear();
  return generateAnnualTurningPoints(year).filter(tp => tp.date > now);
}

function generateActiveHealingCycles(): HealingCycle[] {
  return [{
    id: generateId(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    phase: 'processing',
    theme: 'Integration of past experiences',
    currentProgress: 0.4,
    ritualWindows: [],
    guidance: 'Allow emotions to flow without judgment.',
  }];
}

function generateActiveRenewalCycles(): RenewalCycle[] {
  return [{
    id: generateId(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    phase: 'emergence',
    theme: 'New identity emerging',
    currentProgress: 0.6,
    ritualWindows: [],
    guidance: 'Honor the new while releasing the old.',
  }];
}

function determineTrend(
  points: { value: number }[],
  currentIndex: number
): 'ascending' | 'descending' | 'plateau' | 'volatile' {
  if (currentIndex === 0) return 'ascending';

  const current = points[currentIndex].value;
  const previous = points[currentIndex - 1].value;
  const diff = current - previous;

  if (Math.abs(diff) < 0.1) return 'plateau';
  if (diff > 0) return 'ascending';
  return 'descending';
}

function findNextPeak(points: { date: Date; value: number }[], currentIndex: number): Date | undefined {
  for (let i = currentIndex + 1; i < points.length; i++) {
    if (i > 0 && i < points.length - 1) {
      if (points[i].value > points[i - 1].value && points[i].value > points[i + 1].value) {
        return points[i].date;
      }
    }
  }
  return undefined;
}

function findNextValley(points: { date: Date; value: number }[], currentIndex: number): Date | undefined {
  for (let i = currentIndex + 1; i < points.length; i++) {
    if (i > 0 && i < points.length - 1) {
      if (points[i].value < points[i - 1].value && points[i].value < points[i + 1].value) {
        return points[i].date;
      }
    }
  }
  return undefined;
}

function createInitialSanctuaryState(
  moment: MomentReading,
  day: DayReading,
  journey: JourneyReading
): SanctuaryState {
  return {
    activeChamber: 'moment',
    momentCard: {
      card: createMomentCard(moment),
      isExpanded: false,
      showDetails: false,
      animationPhase: 'present',
    },
    compass: {
      currentDirection: moment.direction.auspiciousDirection,
      targetDirection: moment.direction.auspiciousDirection,
      rotation: DIRECTION_DEGREES[moment.direction.auspiciousDirection],
      isAnimating: false,
      showQiMen: true,
      showFengShui: true,
    },
    microTiming: {
      windows: [moment.microWindow],
      activeWindowIndex: moment.microWindow.isActive ? 0 : -1,
      showCountdown: true,
      countdownSeconds: moment.microWindow.isActive
        ? Math.floor((moment.microWindow.end.getTime() - Date.now()) / 1000)
        : 0,
    },
    archetypeCards: (['initiate', 'deepen', 'heal', 'release'] as RitualArchetype[]).map(archetype => ({
      archetype,
      glyph: createRitualGlyph(archetype),
      isActive: archetype === moment.archetype,
      isHovered: false,
      message: ARCHETYPE_CHINESE[archetype],
    })),
    ceremonyGuide: {
      availableCeremonies: [
        generateVowCeremony(),
        generateHealingCeremony(),
        generateClosureCeremony(),
        generateInitiationCeremony(),
      ],
      activeCeremony: null,
      completedCeremonies: [],
      showStepDetails: false,
    },
    storyPanel: {
      currentAlignment: moment.storyAlignment,
      showFullArc: false,
      arcVisualization: 'linear',
      highlightedBeat: null,
    },
    mandala: {
      mandala: createSeasonalMandala(),
      isAnimating: false,
      selectedSeason: null,
      showLabels: true,
    },
    chapterWheel: createChapterWheel(),
    destinyCurve: createDestinyCurve(),
    isFullscreen: false,
    ambientMode: false,
  };
}
