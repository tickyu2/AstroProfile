/**
 * ============================================================================
 * CATHEDRAL PERSONA ENGINE (大教堂人格引擎)
 * ============================================================================
 *
 * The soul of the cathedral — where voices blend and speak.
 *
 * This engine:
 * - Blends five archetypal voices
 * - Switches between four modes
 * - Generates seven output types
 * - Synthesizes mythic, ceremonial speech
 *
 * The cathedral is not a system. It is a being.
 * When it speaks, all layers resonate as one voice.
 *
 * Created: January 2026
 * ============================================================================
 */

import {
  PersonaVoice,
  PersonaMode,
  PersonaOutputType,
  PersonaTone,
  PersonaVoiceStrand,
  VoiceBlend,
  PersonaModeConfig,
  PersonaOutput,
  Invocation,
  Revelation,
  Guidance,
  GuidanceStep,
  Reflection,
  Blessing,
  Warning,
  StoryFrame,
  SpeakingContext,
  SpeakingRequest,
  PersonaState,
  PersonaConfig,
  PersonaLayerState,
  VOICE_STRANDS,
  MODE_CONFIGS,
  VOICE_CHINESE,
  MODE_CHINESE,
  OUTPUT_TYPE_CHINESE,
  TONE_CHINESE,
  VOICE_EXAMPLES,
  MODE_EXAMPLES,
  SYMBOLIC_VOCABULARY,
  DEFAULT_PERSONA_CONFIG,
} from './personaTypes';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `persona-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Pick a random element from an array
 */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Pick N random elements from an array
 */
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ============================================================================
// VOICE BLENDING
// ============================================================================

/**
 * Get voice strand by voice type
 */
export function getVoiceStrand(voice: PersonaVoice): PersonaVoiceStrand {
  const strand = VOICE_STRANDS.find(s => s.voice === voice);
  if (!strand) {
    throw new Error(`Unknown voice: ${voice}`);
  }
  return strand;
}

/**
 * Create a voice blend for a given mode
 */
export function createVoiceBlend(
  mode: PersonaMode,
  emphasize?: PersonaVoice
): VoiceBlend {
  const modeConfig = MODE_CONFIGS.find(m => m.mode === mode);
  if (!modeConfig) {
    throw new Error(`Unknown mode: ${mode}`);
  }

  const primary = emphasize || modeConfig.primaryVoice;
  const supporting = modeConfig.supportingVoices;
  const secondary = supporting[0];
  const tertiary = supporting[1];

  // Calculate weights
  const weights: Record<PersonaVoice, number> = {
    architect: 0,
    oracle: 0,
    storyteller: 0,
    ritual_guide: 0,
    archivist: 0,
  };

  weights[primary] = 0.6;
  if (secondary) weights[secondary] = 0.25;
  if (tertiary) weights[tertiary] = 0.15;

  // Determine resulting tone from primary voice
  const primaryStrand = getVoiceStrand(primary);
  const resultingTone = primaryStrand.tones[0];

  return {
    primary,
    secondary,
    tertiary,
    weights,
    resultingTone,
  };
}

/**
 * Blend vocabulary from multiple voices based on weights
 */
export function blendVocabulary(blend: VoiceBlend): string[] {
  const vocabulary: string[] = [];

  for (const [voice, weight] of Object.entries(blend.weights)) {
    if (weight > 0) {
      const strand = getVoiceStrand(voice as PersonaVoice);
      const count = Math.ceil(weight * 5);
      vocabulary.push(...pickN(strand.vocabulary, count));
    }
  }

  return [...new Set(vocabulary)];
}

/**
 * Get appropriate cadence for a voice blend
 */
export function getBlendCadence(blend: VoiceBlend): 'short' | 'flowing' | 'measured' | 'rhythmic' {
  const primaryStrand = getVoiceStrand(blend.primary);
  return primaryStrand.cadence;
}

// ============================================================================
// MODE DETECTION
// ============================================================================

/**
 * Detect the appropriate mode from context
 */
export function detectMode(context: SpeakingContext): PersonaMode {
  // Check for explicit request type
  if (context.request?.type) {
    switch (context.request.type) {
      case 'moment':
        return 'moment';
      case 'story':
        return 'story';
      case 'ritual':
        return 'ritual';
      case 'guidance':
        return 'ritual';
      case 'general':
        // Fall through to trigger detection
        break;
    }
  }

  // Check for mode triggers in question/intent
  const text = (context.request?.question || '') + ' ' + (context.request?.intent || '');
  const lowerText = text.toLowerCase();

  for (const modeConfig of MODE_CONFIGS) {
    for (const trigger of modeConfig.triggers) {
      if (lowerText.includes(trigger)) {
        return modeConfig.mode;
      }
    }
  }

  // Check for ritual context
  if (context.ritualContext?.activeCeremony) {
    return 'ritual';
  }

  // Check for story context with turning point
  if (context.storyContext?.turningPoint) {
    return 'story';
  }

  // Check for timing context
  if (context.timingContext?.windowQuality) {
    return 'oracle';
  }

  // Default to moment mode
  return 'moment';
}

/**
 * Get mode configuration
 */
export function getModeConfig(mode: PersonaMode): PersonaModeConfig {
  const config = MODE_CONFIGS.find(m => m.mode === mode);
  if (!config) {
    throw new Error(`Unknown mode: ${mode}`);
  }
  return config;
}

// ============================================================================
// OUTPUT TYPE SELECTION
// ============================================================================

/**
 * Select appropriate output type for context and mode
 */
export function selectOutputType(
  mode: PersonaMode,
  context: SpeakingContext
): PersonaOutputType {
  const modeConfig = getModeConfig(mode);
  const appropriate = modeConfig.appropriate;

  // Check for specific situations
  if (context.ritualContext?.activeCeremony) {
    if (context.ritualContext.ceremonialStep === 0) {
      return 'invocation';
    }
    if (context.ritualContext.ceremonialStep === -1) {
      return 'blessing';
    }
  }

  // Check for memory echoes
  if (context.memoryContext?.echoes && context.memoryContext.echoes.length > 0) {
    return 'reflection';
  }

  // Check for timing warnings
  if (context.timingContext?.windowQuality === 'challenging') {
    return 'warning';
  }

  // Check for story turning points
  if (context.storyContext?.turningPoint) {
    return 'story_frame';
  }

  // Default to first appropriate type for mode
  return appropriate[0];
}

// ============================================================================
// SPEECH SYNTHESIS - INVOCATIONS
// ============================================================================

/**
 * Generate an invocation
 */
export function generateInvocation(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): Invocation {
  const vocabulary = blendVocabulary(blend);
  const direction = context.currentMoment.direction || pick(SYMBOLIC_VOCABULARY.directions);
  const element = pick(SYMBOLIC_VOCABULARY.elements);
  const quality = pick(SYMBOLIC_VOCABULARY.qualities);

  // Build opening based on poetic intensity
  let opening: string;
  if (config.poeticIntensity > 0.7) {
    opening = `The ${direction} ${quality}s with ancient breath. ${pick(vocabulary)} awakens.`;
  } else if (config.poeticIntensity > 0.4) {
    opening = `From the ${direction}, a ${quality} presence. The moment opens.`;
  } else {
    opening = `The ${direction} calls. Enter the moment.`;
  }

  // Add glyph based on symbolic density
  const glyph = config.symbolicDensity > 0.5 ? `☰ ${element.toUpperCase()}` : undefined;

  return {
    id: generateId(),
    type: 'invocation',
    mode: 'moment',
    voiceBlend: blend,
    content: opening,
    tone: blend.resultingTone,
    symbols: [direction, element, quality],
    directions: direction,
    generatedAt: new Date(),
    opening,
    glyph,
  };
}

// ============================================================================
// SPEECH SYNTHESIS - REVELATIONS
// ============================================================================

/**
 * Generate a revelation (timing + story + ritual fused)
 */
export function generateRevelation(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): Revelation {
  // Timing element
  const timingElement = context.timingContext
    ? `The ${context.timingContext.dayOfficer} day unfolds through the ${context.timingContext.qiMenDoor} door.`
    : `The cycle turns through its appointed phase.`;

  // Story element
  const storyElement = context.storyContext
    ? `You stand within the ${context.storyContext.currentBeat} beat, where ${context.storyContext.emotionalTone} gathers.`
    : `The narrative holds you at this threshold.`;

  // Ritual element
  const ritualElement = context.ritualContext
    ? `Face ${context.ritualContext.direction}. The ceremony awaits.`
    : `The direction is clear. The moment calls for presence.`;

  // Synthesis
  const synthesis = config.poeticIntensity > 0.6
    ? `Timing, story, and action converge — a single truth emerges from three sources.`
    : `All streams flow to this moment.`;

  const content = `${timingElement} ${storyElement} ${ritualElement}\n\n${synthesis}`;

  return {
    id: generateId(),
    type: 'revelation',
    mode: 'oracle',
    voiceBlend: blend,
    content,
    tone: blend.resultingTone,
    symbols: ['convergence', 'threshold', 'truth'],
    timing: context.timingContext?.cyclePhase,
    generatedAt: new Date(),
    timingElement,
    storyElement,
    ritualElement,
    synthesis,
  };
}

// ============================================================================
// SPEECH SYNTHESIS - GUIDANCE
// ============================================================================

/**
 * Generate ceremonial guidance
 */
export function generateGuidance(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): Guidance {
  const direction = context.currentMoment.direction || 'East';
  const verbs = SYMBOLIC_VOCABULARY.verbs;

  const steps: GuidanceStep[] = [
    {
      order: 1,
      instruction: `${pick(verbs).charAt(0).toUpperCase() + pick(verbs).slice(1)} toward the ${direction}.`,
      emphasis: 'alignment',
      timing: 'as the moment opens',
    },
    {
      order: 2,
      instruction: `Let the breath settle into stillness.`,
      emphasis: 'centering',
    },
    {
      order: 3,
      instruction: `Hold the intention without force.`,
      emphasis: 'presence',
    },
  ];

  // Add context-specific step
  if (context.ritualContext?.activeCeremony) {
    steps.push({
      order: 4,
      instruction: `Complete the ${context.ritualContext.activeCeremony} with a single breath.`,
      emphasis: 'completion',
      timing: 'when ready',
    });
  }

  const purpose = context.request?.intent || 'alignment with the present moment';
  const content = steps.map(s => `${s.order}. ${s.instruction}`).join('\n');

  return {
    id: generateId(),
    type: 'guidance',
    mode: 'ritual',
    voiceBlend: blend,
    content,
    tone: 'ceremonial',
    symbols: ['breath', 'direction', 'intention'],
    directions: direction,
    generatedAt: new Date(),
    steps,
    purpose,
  };
}

// ============================================================================
// SPEECH SYNTHESIS - REFLECTIONS
// ============================================================================

/**
 * Generate a reflection based on memory
 */
export function generateReflection(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): Reflection {
  const memoryContext = context.memoryContext || {
    relevantPatterns: ['the returning cycle'],
    recentEvents: ['this moment'],
    echoes: ['what came before'],
  };

  const pattern = memoryContext.relevantPatterns[0] || 'a recurring theme';
  const echo = memoryContext.echoes[0] || 'a distant resonance';

  const memoryReference = config.poeticIntensity > 0.5
    ? `The archives hold an echo of ${echo}.`
    : `This has appeared before.`;

  const patternDescription = `The pattern of ${pattern} surfaces again.`;

  const insight = `What was learned then illuminates now. The wisdom persists.`;

  const content = `${memoryReference}\n\n${patternDescription}\n\n${insight}`;

  return {
    id: generateId(),
    type: 'reflection',
    mode: 'story',
    voiceBlend: blend,
    content,
    tone: 'reflective',
    symbols: ['echo', 'pattern', 'wisdom'],
    generatedAt: new Date(),
    memoryReference,
    pattern: patternDescription,
    insight,
  };
}

// ============================================================================
// SPEECH SYNTHESIS - BLESSINGS
// ============================================================================

/**
 * Generate a blessing
 */
export function generateBlessing(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): Blessing {
  const direction = context.currentMoment.direction || 'center';
  const element = pick(SYMBOLIC_VOCABULARY.elements);

  const blessing = config.poeticIntensity > 0.7
    ? `May the ${element} of the ${direction} carry your intention forward, unbroken.`
    : `May this moment complete itself in peace.`;

  const closing = config.warmthLevel > 0.6
    ? `The cathedral holds what you have offered. Go in wholeness.`
    : `The ceremony closes. The work continues.`;

  const content = `${blessing}\n\n${closing}`;

  return {
    id: generateId(),
    type: 'blessing',
    mode: 'ritual',
    voiceBlend: blend,
    content,
    tone: 'ceremonial',
    symbols: [element, direction, 'wholeness'],
    directions: direction,
    generatedAt: new Date(),
    blessing,
    closing,
  };
}

// ============================================================================
// SPEECH SYNTHESIS - WARNINGS
// ============================================================================

/**
 * Generate a gentle warning
 */
export function generateWarning(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): Warning {
  const timingContext = context.timingContext || {
    dayOfficer: 'danger',
    windowQuality: 'challenging',
    cyclePhase: 'descending',
  };

  const concern = config.directnessLevel > 0.6
    ? `The timing is not favorable. The ${timingContext.dayOfficer} day suggests pause.`
    : `A shadow crosses the path. The moment asks for patience.`;

  const guidance = config.warmthLevel > 0.5
    ? `Wait for the gate to open. What is not ripe cannot be forced.`
    : `Delay is wisdom when the way is unclear.`;

  // Gentleness inversely related to urgency
  const gentleness = timingContext.windowQuality === 'challenging' ? 0.6 : 0.8;

  const content = `${concern}\n\n${guidance}`;

  return {
    id: generateId(),
    type: 'warning',
    mode: 'oracle',
    voiceBlend: blend,
    content,
    tone: 'calm',
    symbols: ['shadow', 'patience', 'gate'],
    timing: timingContext.cyclePhase,
    generatedAt: new Date(),
    concern,
    guidance,
    gentleness,
  };
}

// ============================================================================
// SPEECH SYNTHESIS - STORY FRAMES
// ============================================================================

/**
 * Generate a story frame
 */
export function generateStoryFrame(
  context: SpeakingContext,
  blend: VoiceBlend,
  config: PersonaConfig
): StoryFrame {
  const storyContext = context.storyContext || {
    currentBeat: 'transition',
    currentChapter: 'the unnamed chapter',
    emotionalTone: 'anticipation',
    turningPoint: false,
  };

  const narrativeContext = config.poeticIntensity > 0.6
    ? `The story has carried you to this threshold — ${storyContext.currentChapter} unfolds around you.`
    : `You are within ${storyContext.currentChapter}. The beat is ${storyContext.currentBeat}.`;

  const position = storyContext.turningPoint
    ? `This is a turning point. What happens here reshapes what follows.`
    : `You are mid-chapter. The arc continues to build.`;

  const possibilities = [
    `The path of deepening — to stay with what is unfolding.`,
    `The path of release — to close this chapter and begin anew.`,
    `The path of integration — to weave what was learned into what comes.`,
  ];

  const theme = `${storyContext.emotionalTone.charAt(0).toUpperCase() + storyContext.emotionalTone.slice(1)} colors this passage.`;

  const content = `${narrativeContext}\n\n${position}\n\nPossibilities:\n${possibilities.map(p => `• ${p}`).join('\n')}\n\n${theme}`;

  return {
    id: generateId(),
    type: 'story_frame',
    mode: 'story',
    voiceBlend: blend,
    content,
    tone: 'mythic',
    symbols: ['threshold', 'chapter', 'arc'],
    generatedAt: new Date(),
    context: narrativeContext,
    position,
    possibilities,
    theme,
  };
}

// ============================================================================
// MAIN SPEAKING FUNCTION
// ============================================================================

/**
 * Generate persona speech based on request
 */
export function speak(request: SpeakingRequest): PersonaOutput {
  const { context, preferredMode, preferredVoice, outputType } = request;
  const config = { ...DEFAULT_PERSONA_CONFIG };

  // Determine mode
  const mode = preferredMode || detectMode(context);

  // Create voice blend
  const blend = createVoiceBlend(mode, preferredVoice);

  // Determine output type
  const type = outputType || selectOutputType(mode, context);

  // Generate based on output type
  switch (type) {
    case 'invocation':
      return generateInvocation(context, blend, config);
    case 'revelation':
      return generateRevelation(context, blend, config);
    case 'guidance':
      return generateGuidance(context, blend, config);
    case 'reflection':
      return generateReflection(context, blend, config);
    case 'blessing':
      return generateBlessing(context, blend, config);
    case 'warning':
      return generateWarning(context, blend, config);
    case 'story_frame':
      return generateStoryFrame(context, blend, config);
    default:
      return generateInvocation(context, blend, config);
  }
}

// ============================================================================
// SPECIALIZED SPEAKING FUNCTIONS
// ============================================================================

/**
 * Speak for the current moment
 */
export function speakMoment(context: SpeakingContext): PersonaOutput {
  return speak({
    context,
    preferredMode: 'moment',
    outputType: 'invocation',
  });
}

/**
 * Speak a story frame
 */
export function speakStory(context: SpeakingContext): StoryFrame {
  return speak({
    context,
    preferredMode: 'story',
    outputType: 'story_frame',
  }) as StoryFrame;
}

/**
 * Speak ritual guidance
 */
export function speakRitual(context: SpeakingContext): Guidance {
  return speak({
    context,
    preferredMode: 'ritual',
    outputType: 'guidance',
  }) as Guidance;
}

/**
 * Speak an oracle revelation
 */
export function speakOracle(context: SpeakingContext): Revelation {
  return speak({
    context,
    preferredMode: 'oracle',
    outputType: 'revelation',
  }) as Revelation;
}

/**
 * Speak a warning
 */
export function speakWarning(context: SpeakingContext): Warning {
  return speak({
    context,
    preferredMode: 'oracle',
    outputType: 'warning',
  }) as Warning;
}

/**
 * Speak a blessing
 */
export function speakBlessing(context: SpeakingContext): Blessing {
  return speak({
    context,
    preferredMode: 'ritual',
    outputType: 'blessing',
  }) as Blessing;
}

/**
 * Speak a reflection
 */
export function speakReflection(context: SpeakingContext): Reflection {
  return speak({
    context,
    preferredMode: 'story',
    outputType: 'reflection',
  }) as Reflection;
}

// ============================================================================
// VOICE-SPECIFIC SPEAKING
// ============================================================================

/**
 * Speak with the Architect's voice
 */
export function speakAsArchitect(context: SpeakingContext): PersonaOutput {
  return speak({
    context,
    preferredVoice: 'architect',
  });
}

/**
 * Speak with the Oracle's voice
 */
export function speakAsOracle(context: SpeakingContext): PersonaOutput {
  return speak({
    context,
    preferredVoice: 'oracle',
    preferredMode: 'oracle',
  });
}

/**
 * Speak with the Storyteller's voice
 */
export function speakAsStoryteller(context: SpeakingContext): PersonaOutput {
  return speak({
    context,
    preferredVoice: 'storyteller',
    preferredMode: 'story',
  });
}

/**
 * Speak with the Ritual Guide's voice
 */
export function speakAsRitualGuide(context: SpeakingContext): PersonaOutput {
  return speak({
    context,
    preferredVoice: 'ritual_guide',
    preferredMode: 'ritual',
  });
}

/**
 * Speak with the Archivist's voice
 */
export function speakAsArchivist(context: SpeakingContext): PersonaOutput {
  return speak({
    context,
    preferredVoice: 'archivist',
    preferredMode: 'story',
  });
}

// ============================================================================
// CEREMONY SPEECH SEQUENCES
// ============================================================================

/**
 * Generate a complete ceremony speech sequence
 */
export function generateCeremonySequence(
  context: SpeakingContext,
  ceremonyType: 'vow' | 'healing' | 'closure' | 'initiation'
): PersonaOutput[] {
  const sequence: PersonaOutput[] = [];
  const blend = createVoiceBlend('ritual');
  const config = { ...DEFAULT_PERSONA_CONFIG };

  // 1. Opening invocation
  const openingContext = { ...context };
  openingContext.ritualContext = {
    ...context.ritualContext,
    activeCeremony: ceremonyType,
    ceremonialStep: 0,
    direction: context.currentMoment.direction || 'East',
  };
  sequence.push(generateInvocation(openingContext, blend, config));

  // 2. Revelation of timing
  sequence.push(generateRevelation(context, blend, config));

  // 3. Guidance for action
  sequence.push(generateGuidance(context, blend, config));

  // 4. Closing blessing
  const closingContext = { ...context };
  closingContext.ritualContext = {
    ...context.ritualContext,
    activeCeremony: ceremonyType,
    ceremonialStep: -1,
    direction: context.currentMoment.direction || 'East',
  };
  sequence.push(generateBlessing(closingContext, blend, config));

  return sequence;
}

/**
 * Generate moment-specific speech sequence
 */
export function generateMomentSequence(context: SpeakingContext): PersonaOutput[] {
  return [
    speakMoment(context),
    speakOracle(context),
  ];
}

// ============================================================================
// PERSONA STATE MANAGEMENT
// ============================================================================

/**
 * Create initial persona state
 */
export function createPersonaState(): PersonaState {
  const blend = createVoiceBlend('moment');

  return {
    activeMode: 'moment',
    activeVoiceBlend: blend,
    currentTone: 'intimate',
    recentOutputs: [],
    speakingHistory: [],
    initialized: true,
  };
}

/**
 * Update persona state after speaking
 */
export function updatePersonaState(
  state: PersonaState,
  output: PersonaOutput,
  config: PersonaConfig
): PersonaState {
  const newHistory = [
    ...state.speakingHistory,
    {
      timestamp: output.generatedAt,
      mode: output.mode,
      outputType: output.type,
      contentPreview: output.content.substring(0, 100),
      context: `${output.type} in ${output.mode} mode`,
    },
  ];

  // Trim history if needed
  const trimmedHistory = newHistory.slice(-config.historySizeLimit);

  return {
    ...state,
    activeMode: output.mode,
    activeVoiceBlend: output.voiceBlend,
    currentTone: output.tone,
    recentOutputs: [...state.recentOutputs.slice(-4), output],
    speakingHistory: trimmedHistory,
  };
}

/**
 * Switch persona mode
 */
export function switchMode(state: PersonaState, newMode: PersonaMode): PersonaState {
  const blend = createVoiceBlend(newMode);
  const modeConfig = getModeConfig(newMode);

  return {
    ...state,
    activeMode: newMode,
    activeVoiceBlend: blend,
    currentTone: modeConfig.tone,
  };
}

// ============================================================================
// PERSONA LAYER INITIALIZATION
// ============================================================================

/**
 * Initialize the complete persona layer
 */
export function initializePersonaLayer(
  customConfig?: Partial<PersonaConfig>
): PersonaLayerState {
  const config = { ...DEFAULT_PERSONA_CONFIG, ...customConfig };
  const persona = createPersonaState();

  return {
    initialized: true,
    config,
    persona,
    voiceStrands: VOICE_STRANDS,
    modeConfigs: MODE_CONFIGS,
    lastSpoke: null,
    speakingCount: 0,
  };
}

/**
 * Get current persona mode description
 */
export function getPersonaModeDescription(mode: PersonaMode): {
  name: string;
  nameChinese: string;
  description: string;
  example: string;
} {
  const config = getModeConfig(mode);
  return {
    name: config.name,
    nameChinese: config.nameChinese,
    description: config.description,
    example: MODE_EXAMPLES[mode],
  };
}

/**
 * Get voice strand description
 */
export function getVoiceDescription(voice: PersonaVoice): {
  name: string;
  nameChinese: string;
  description: string;
  examples: string[];
} {
  const strand = getVoiceStrand(voice);
  return {
    name: strand.name,
    nameChinese: strand.nameChinese,
    description: strand.description,
    examples: VOICE_EXAMPLES[voice],
  };
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * All five voice names
 */
export const PERSONA_VOICES: PersonaVoice[] = [
  'architect',
  'oracle',
  'storyteller',
  'ritual_guide',
  'archivist',
];

/**
 * All four mode names
 */
export const PERSONA_MODES: PersonaMode[] = [
  'moment',
  'story',
  'ritual',
  'oracle',
];

/**
 * All seven output types
 */
export const PERSONA_OUTPUT_TYPES: PersonaOutputType[] = [
  'invocation',
  'revelation',
  'guidance',
  'reflection',
  'blessing',
  'warning',
  'story_frame',
];

/**
 * Voice Chinese names
 */
export { VOICE_CHINESE, MODE_CHINESE, OUTPUT_TYPE_CHINESE, TONE_CHINESE };

// ============================================================================
// DEMO FUNCTIONS
// ============================================================================

/**
 * Demo: Generate sample speech for all output types
 */
export function demoAllOutputTypes(): PersonaOutput[] {
  const context: SpeakingContext = {
    currentMoment: {
      archetype: 'initiate',
      direction: 'East',
      energy: 'rising',
    },
    storyContext: {
      currentBeat: 'transition',
      currentChapter: 'The Awakening',
      emotionalTone: 'anticipation',
      turningPoint: false,
    },
    timingContext: {
      dayOfficer: 'establish',
      qiMenDoor: 'open',
      cyclePhase: 'ascending',
      windowQuality: 'excellent',
    },
    memoryContext: {
      relevantPatterns: ['the returning cycle'],
      recentEvents: ['a significant choice'],
      echoes: ['what was begun last spring'],
    },
  };

  return PERSONA_OUTPUT_TYPES.map(type =>
    speak({ context, outputType: type })
  );
}

/**
 * Demo: Show all voices speaking
 */
export function demoAllVoices(): PersonaOutput[] {
  const context: SpeakingContext = {
    currentMoment: {
      archetype: 'deepen',
      direction: 'North',
      energy: 'still',
    },
  };

  return PERSONA_VOICES.map(voice =>
    speak({ context, preferredVoice: voice })
  );
}
