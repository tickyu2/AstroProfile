/**
 * ============================================================================
 * MULTI-RELATIONSHIP STORY WEAVING ENGINE (多关系故事编织引擎)
 * ============================================================================
 *
 * The grand nave of the cathedral.
 * Weaves multiple destinies into a single story-world.
 *
 * Four Weaving Modes:
 * - Family (家族故事编织) - Multi-generational lineage
 * - Team (团队故事编织) - Organizational mission arc
 * - Polycule (多元关系故事编织) - Networked emotional ecosystem
 * - Generational (世代弧线编织) - Five-generation destiny arc
 *
 * This is not just "multiple stories."
 * It is one story told through many lives.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  WeavingMode,
  WeavingParticipant,
  WeavingEdge,
  WovenStoryBeat,
  WovenStoryChapter,
  WovenStory,
  WovenTheme,
  SystemicArc,
  WeavingEngineInput,
  WeavingEngineResult,
  WeavingOptions,
  WovenBeatType,
  BeatPattern,
  CollectiveArc,
  SystemicArcType,
  WeavingNetworkData,
  CollectiveTimelineData,
  GenerationalLadderData
} from './weavingTypes';

import {
  WEAVING_MODE_CHINESE,
  WOVEN_BEAT_TYPE_CHINESE,
  COLLECTIVE_ARC_CHINESE,
  SYSTEMIC_ARC_TYPE_CHINESE,
  ROLE_CHINESE
} from './weavingTypes';

import type { StoryBeat, PredictiveStory, EmotionalTone } from './storyTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

const TONE_CHINESE: Record<EmotionalTone, string> = {
  hopeful: '希望',
  joyful: '喜悦',
  tense: '紧张',
  melancholic: '忧郁',
  peaceful: '平静',
  passionate: '热情',
  anxious: '焦虑',
  reflective: '沉思'
};

const BEAT_COLORS: Record<WovenBeatType, string> = {
  convergence: '#22c55e',    // Green
  divergence: '#f59e0b',     // Amber
  resonance: '#3b82f6',      // Blue
  dissonance: '#ef4444',     // Red
  synchronicity: '#a855f7',  // Purple
  systemic_shift: '#fbbf24', // Gold
  pattern_repeat: '#6366f1', // Indigo
  pattern_break: '#ec4899',  // Pink
  generational_echo: '#14b8a6', // Teal
  healing_window: '#84cc16', // Lime
  bonding: '#10b981',        // Emerald
  fracturing: '#f87171',     // Light red
  reweaving: '#8b5cf6',      // Violet
  expansion: '#06b6d4',      // Cyan
  contraction: '#78716c'     // Stone
};

// ============================================================================
// STEP 1: COLLECT INDIVIDUAL STORY ENGINES
// ============================================================================

/**
 * Extract beats from all individual stories and tag with participant
 */
function collectIndividualBeats(
  participants: WeavingParticipant[]
): Array<StoryBeat & { participantId: string }> {
  const allBeats: Array<StoryBeat & { participantId: string }> = [];

  for (const participant of participants) {
    if (participant.individualStory?.beats) {
      for (const beat of participant.individualStory.beats) {
        allBeats.push({
          ...beat,
          participantId: participant.id
        });
      }
    }
  }

  return allBeats;
}

// ============================================================================
// STEP 2: ALIGN TIMELINES
// ============================================================================

/**
 * Align beats across stories by time
 */
function alignBeatsAcrossStories(
  beats: Array<StoryBeat & { participantId: string }>
): Array<StoryBeat & { participantId: string }> {
  // Sort by start time
  return beats.sort((a, b) =>
    new Date(a.timeRange.start).getTime() - new Date(b.timeRange.start).getTime()
  );
}

/**
 * Group aligned beats into time windows
 */
function groupBeatsIntoTimeWindows(
  beats: Array<StoryBeat & { participantId: string }>,
  windowSizeMonths: number = 6
): Array<{
  windowStart: string;
  windowEnd: string;
  beats: Array<StoryBeat & { participantId: string }>;
}> {
  if (beats.length === 0) return [];

  const windows: Array<{
    windowStart: string;
    windowEnd: string;
    beats: Array<StoryBeat & { participantId: string }>;
  }> = [];

  // Find the overall time range
  const startDate = new Date(beats[0].timeRange.start);
  const endDate = new Date(beats[beats.length - 1].timeRange.end);

  let windowStart = new Date(startDate);

  while (windowStart < endDate) {
    const windowEnd = new Date(windowStart);
    windowEnd.setMonth(windowEnd.getMonth() + windowSizeMonths);

    const windowBeats = beats.filter(beat => {
      const beatStart = new Date(beat.timeRange.start);
      return beatStart >= windowStart && beatStart < windowEnd;
    });

    if (windowBeats.length > 0) {
      windows.push({
        windowStart: windowStart.toISOString().split('T')[0],
        windowEnd: windowEnd.toISOString().split('T')[0],
        beats: windowBeats
      });
    }

    windowStart = windowEnd;
  }

  return windows;
}

// ============================================================================
// STEP 3: DETECT SHARED BEATS
// ============================================================================

/**
 * Detect collective beats where multiple participants align
 */
function detectCollectiveBeats(
  timeWindows: Array<{
    windowStart: string;
    windowEnd: string;
    beats: Array<StoryBeat & { participantId: string }>;
  }>,
  participants: WeavingParticipant[],
  mode: WeavingMode
): WovenStoryBeat[] {
  const wovenBeats: WovenStoryBeat[] = [];
  let beatCounter = 0;

  for (const window of timeWindows) {
    // Group beats by participant
    const byParticipant = new Map<string, Array<StoryBeat & { participantId: string }>>();
    for (const beat of window.beats) {
      if (!byParticipant.has(beat.participantId)) {
        byParticipant.set(beat.participantId, []);
      }
      byParticipant.get(beat.participantId)!.push(beat);
    }

    const involvedParticipants = Array.from(byParticipant.keys());
    const participantCount = involvedParticipants.length;

    // Determine beat type based on patterns
    const beatType = classifyWovenBeat(window.beats, participantCount, participants.length, mode);
    const pattern = detectBeatPattern(window.beats, byParticipant);
    const emotionalTone = deriveCollectiveEmotion(window.beats);
    const intensity = calculateCollectiveIntensity(window.beats, participantCount, participants.length);

    // Create participant roles map
    const participantRoles: Record<string, any> = {};
    for (const pId of involvedParticipants) {
      const p = participants.find(pp => pp.id === pId);
      if (p) {
        participantRoles[pId] = p.role;
      }
    }

    // Generate narrative
    const narrative = generateBeatNarrative(beatType, pattern, involvedParticipants, participants, mode);
    const summary = generateBeatSummary(beatType, participantCount, emotionalTone);

    beatCounter++;
    wovenBeats.push({
      id: `woven_beat_${beatCounter}`,
      participants: involvedParticipants,
      participantRoles,
      timeRange: {
        start: window.windowStart,
        end: window.windowEnd
      },
      beatType,
      beatTypeChinese: WOVEN_BEAT_TYPE_CHINESE[beatType],
      emotionalTone,
      emotionalToneChinese: TONE_CHINESE[emotionalTone],
      collectiveIntensity: intensity,
      pattern,
      summary,
      narrative,
      sourceBeats: window.beats.map(b => ({
        participantId: b.participantId,
        beatId: b.id
      }))
    });
  }

  return wovenBeats;
}

/**
 * Classify the type of woven beat
 */
function classifyWovenBeat(
  beats: Array<StoryBeat & { participantId: string }>,
  involvedCount: number,
  totalCount: number,
  mode: WeavingMode
): WovenBeatType {
  const ratio = involvedCount / totalCount;
  const avgIntensity = beats.reduce((sum, b) => sum + b.intensity, 0) / beats.length;

  // Check for turning points
  const hasTurningPoints = beats.some(b => b.type === 'turning' || b.type === 'crisis');
  const hasPeaks = beats.some(b => b.type === 'peak');
  const hasResolutions = beats.some(b => b.type === 'resolution');

  // High participation + high intensity = systemic event
  if (ratio > 0.7 && avgIntensity > 70) {
    if (hasTurningPoints) return 'systemic_shift';
    if (hasPeaks) return 'convergence';
    return 'resonance';
  }

  // Low participation during high-intensity = divergence
  if (ratio < 0.3 && avgIntensity > 60) {
    return 'divergence';
  }

  // Mode-specific classifications
  if (mode === 'family' || mode === 'generational') {
    if (hasTurningPoints && involvedCount >= 2) return 'generational_echo';
    if (hasResolutions) return 'healing_window';
  }

  if (mode === 'polycule') {
    if (hasPeaks) return 'bonding';
    if (hasTurningPoints) return 'reweaving';
  }

  if (mode === 'team') {
    if (ratio > 0.5 && avgIntensity > 50) return 'expansion';
    if (hasTurningPoints) return 'pattern_break';
  }

  // Default based on emotional tone
  const tones = beats.map(b => b.tone);
  if (tones.includes('tense') || tones.includes('anxious')) {
    return 'dissonance';
  }
  if (tones.includes('peaceful') || tones.includes('hopeful')) {
    return 'resonance';
  }

  return 'parallel' as unknown as WovenBeatType || 'resonance';
}

/**
 * Detect the pattern of how beats relate
 */
function detectBeatPattern(
  beats: Array<StoryBeat & { participantId: string }>,
  byParticipant: Map<string, Array<StoryBeat & { participantId: string }>>
): BeatPattern {
  const participantCount = byParticipant.size;

  if (participantCount === 1) return 'sequential';

  // Check if all beats are very close in time (shared experience)
  const startTimes = beats.map(b => new Date(b.timeRange.start).getTime());
  const timeSpread = Math.max(...startTimes) - Math.min(...startTimes);
  const daysSpread = timeSpread / (1000 * 60 * 60 * 24);

  if (daysSpread < 30) return 'shared';

  // Check for similar beat types (parallel)
  const types = beats.map(b => b.type);
  const uniqueTypes = new Set(types);
  if (uniqueTypes.size === 1) return 'parallel';

  // Check for opposite tones (polarized)
  const tones = beats.map(b => b.tone);
  const hasOpposites = (tones.includes('joyful') && tones.includes('melancholic')) ||
                       (tones.includes('peaceful') && tones.includes('anxious'));
  if (hasOpposites) return 'polarized';

  // Check for cascading (sequential triggers)
  const sortedBeats = [...beats].sort((a, b) =>
    new Date(a.timeRange.start).getTime() - new Date(b.timeRange.start).getTime()
  );
  let isCascading = true;
  for (let i = 1; i < sortedBeats.length; i++) {
    const gap = new Date(sortedBeats[i].timeRange.start).getTime() -
                new Date(sortedBeats[i-1].timeRange.end).getTime();
    if (gap < 0 || gap > 90 * 24 * 60 * 60 * 1000) {
      isCascading = false;
      break;
    }
  }
  if (isCascading && participantCount > 1) return 'cascading';

  return 'echoing';
}

/**
 * Derive collective emotional tone
 */
function deriveCollectiveEmotion(
  beats: Array<StoryBeat & { participantId: string }>
): EmotionalTone {
  const toneCounts: Record<string, number> = {};

  for (const beat of beats) {
    toneCounts[beat.tone] = (toneCounts[beat.tone] || 0) + beat.intensity;
  }

  let maxTone: EmotionalTone = 'reflective';
  let maxScore = 0;

  for (const [tone, score] of Object.entries(toneCounts)) {
    if (score > maxScore) {
      maxScore = score;
      maxTone = tone as EmotionalTone;
    }
  }

  return maxTone;
}

/**
 * Calculate collective intensity
 */
function calculateCollectiveIntensity(
  beats: Array<StoryBeat & { participantId: string }>,
  involvedCount: number,
  totalCount: number
): number {
  const avgIntensity = beats.reduce((sum, b) => sum + b.intensity, 0) / beats.length;
  const participationBonus = (involvedCount / totalCount) * 20;

  return Math.min(100, Math.round(avgIntensity + participationBonus));
}

/**
 * Generate narrative for a woven beat
 */
function generateBeatNarrative(
  beatType: WovenBeatType,
  pattern: BeatPattern,
  involvedIds: string[],
  participants: WeavingParticipant[],
  mode: WeavingMode
): string {
  const involvedNames = involvedIds
    .map(id => participants.find(p => p.id === id)?.name || 'Unknown')
    .join(', ');

  const narratives: Record<WovenBeatType, string> = {
    convergence: `${involvedNames} find their paths aligning. What was separate now moves as one.`,
    divergence: `The threads diverge here. ${involvedNames} experience different currents pulling them apart.`,
    resonance: `A chord strikes across the web. ${involvedNames} vibrate in harmony.`,
    dissonance: `Tension ripples through the system. ${involvedNames} feel the friction.`,
    synchronicity: `Meaningful coincidence: ${involvedNames} experience a moment of cosmic alignment.`,
    systemic_shift: `The entire system shifts. ${involvedNames} are caught in the turning of the wheel.`,
    pattern_repeat: `A familiar pattern resurfaces. ${involvedNames} recognize the echo from before.`,
    pattern_break: `Something breaks free. ${involvedNames} move beyond the old pattern.`,
    generational_echo: `Across generations, the same theme resonates. ${involvedNames} carry the ancestral thread.`,
    healing_window: `A window opens for healing. ${involvedNames} find an opportunity to repair.`,
    bonding: `The connection deepens. ${involvedNames} move closer together.`,
    fracturing: `Cracks appear. ${involvedNames} feel the strain between them.`,
    reweaving: `What was torn begins to mend. ${involvedNames} find their way back.`,
    expansion: `The network grows. ${involvedNames} open to new possibilities.`,
    contraction: `The circle tightens. ${involvedNames} consolidate what matters most.`
  };

  return narratives[beatType] || `${involvedNames} move through this moment together.`;
}

/**
 * Generate summary for a woven beat
 */
function generateBeatSummary(
  beatType: WovenBeatType,
  participantCount: number,
  tone: EmotionalTone
): string {
  return `${WOVEN_BEAT_TYPE_CHINESE[beatType]} (${beatType}): ${participantCount} participants, ${TONE_CHINESE[tone]} tone`;
}

// ============================================================================
// STEP 4: GROUP INTO COLLECTIVE CHAPTERS
// ============================================================================

/**
 * Group woven beats into chapters
 */
function groupCollectiveBeatsIntoChapters(
  beats: WovenStoryBeat[],
  participants: WeavingParticipant[],
  mode: WeavingMode
): WovenStoryChapter[] {
  if (beats.length === 0) return [];

  const chapters: WovenStoryChapter[] = [];
  const beatsPerChapter = Math.max(3, Math.ceil(beats.length / 5)); // Aim for ~5 chapters

  let chapterBeats: WovenStoryBeat[] = [];
  let chapterNumber = 1;

  for (let i = 0; i < beats.length; i++) {
    chapterBeats.push(beats[i]);

    // Check if we should close this chapter
    const shouldClose = chapterBeats.length >= beatsPerChapter ||
                        beats[i].beatType === 'systemic_shift' ||
                        i === beats.length - 1;

    if (shouldClose && chapterBeats.length > 0) {
      chapters.push(buildWovenChapter(chapterBeats, chapterNumber, participants, mode));
      chapterBeats = [];
      chapterNumber++;
    }
  }

  return chapters;
}

/**
 * Build a single woven chapter
 */
function buildWovenChapter(
  beats: WovenStoryBeat[],
  chapterNumber: number,
  participants: WeavingParticipant[],
  mode: WeavingMode
): WovenStoryChapter {
  // Determine time span
  const startDates = beats.map(b => new Date(b.timeRange.start));
  const endDates = beats.map(b => new Date(b.timeRange.end));
  const start = new Date(Math.min(...startDates.map(d => d.getTime())));
  const end = new Date(Math.max(...endDates.map(d => d.getTime())));

  // Derive collective arc
  const arc = deriveCollectiveArc(beats);

  // Find emotional shift
  const firstTone = beats[0].emotionalTone;
  const lastTone = beats[beats.length - 1].emotionalTone;
  const direction = deriveEmotionalDirection(beats);
  const intensity = Math.max(...beats.map(b => b.collectiveIntensity)) / 100;

  // Find protagonists (most active participants)
  const participantActivity: Record<string, number> = {};
  for (const beat of beats) {
    for (const pId of beat.participants) {
      participantActivity[pId] = (participantActivity[pId] || 0) + 1;
    }
  }
  const protagonists = Object.entries(participantActivity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  // Extract themes
  const themes = extractChapterThemes(beats, mode);

  // Generate title
  const { title, titleChinese } = generateChapterTitle(arc, chapterNumber, mode);

  // Generate narrative
  const narrative = generateChapterNarrative(beats, arc, protagonists, participants, mode);

  return {
    id: `woven_chapter_${chapterNumber}`,
    chapterNumber,
    title,
    titleChinese,
    timeSpan: {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    },
    beats,
    collectiveArc: arc,
    collectiveArcChinese: COLLECTIVE_ARC_CHINESE[arc],
    emotionalShift: {
      from: firstTone,
      to: lastTone,
      direction,
      intensity
    },
    protagonists,
    themes: themes.map(t => t.en),
    themesChinese: themes.map(t => t.zh),
    narrative
  };
}

/**
 * Derive the collective arc of a chapter
 */
function deriveCollectiveArc(beats: WovenStoryBeat[]): CollectiveArc {
  const beatTypes = beats.map(b => b.beatType);

  if (beatTypes.includes('convergence') || beatTypes.includes('bonding')) {
    return beats.some(b => b.collectiveIntensity > 80) ? 'peak' : 'gathering';
  }
  if (beatTypes.includes('divergence') || beatTypes.includes('fracturing')) {
    return 'dispersing';
  }
  if (beatTypes.includes('systemic_shift') || beatTypes.includes('pattern_break')) {
    return 'transforming';
  }
  if (beatTypes.includes('healing_window') || beatTypes.includes('reweaving')) {
    return 'integrating';
  }
  if (beatTypes.includes('expansion')) {
    return 'ascending';
  }
  if (beatTypes.includes('contraction')) {
    return 'descending';
  }

  return 'gathering';
}

/**
 * Derive emotional direction from beats
 */
function deriveEmotionalDirection(
  beats: WovenStoryBeat[]
): 'ascending' | 'descending' | 'stable' | 'volatile' {
  const intensities = beats.map(b => b.collectiveIntensity);
  const firstHalf = intensities.slice(0, Math.floor(intensities.length / 2));
  const secondHalf = intensities.slice(Math.floor(intensities.length / 2));

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const variance = Math.max(...intensities) - Math.min(...intensities);

  if (variance > 40) return 'volatile';
  if (secondAvg - firstAvg > 15) return 'ascending';
  if (firstAvg - secondAvg > 15) return 'descending';
  return 'stable';
}

/**
 * Extract themes for a chapter
 */
function extractChapterThemes(
  beats: WovenStoryBeat[],
  mode: WeavingMode
): Array<{ en: string; zh: string }> {
  const themes: Array<{ en: string; zh: string }> = [];

  const beatTypes = beats.map(b => b.beatType);

  if (beatTypes.includes('generational_echo')) {
    themes.push({ en: 'Ancestral patterns', zh: '祖先模式' });
  }
  if (beatTypes.includes('healing_window')) {
    themes.push({ en: 'Healing opportunity', zh: '疗愈机会' });
  }
  if (beatTypes.includes('pattern_break')) {
    themes.push({ en: 'Breaking free', zh: '突破束缚' });
  }
  if (beatTypes.includes('convergence')) {
    themes.push({ en: 'Coming together', zh: '汇聚' });
  }
  if (beatTypes.includes('transformation') || beatTypes.includes('systemic_shift')) {
    themes.push({ en: 'Transformation', zh: '蜕变' });
  }

  // Mode-specific themes
  if (mode === 'family') {
    themes.push({ en: 'Family bonds', zh: '家庭纽带' });
  } else if (mode === 'team') {
    themes.push({ en: 'Collective mission', zh: '集体使命' });
  } else if (mode === 'polycule') {
    themes.push({ en: 'Network dynamics', zh: '网络动态' });
  } else if (mode === 'generational') {
    themes.push({ en: 'Lineage wisdom', zh: '血脉智慧' });
  }

  return themes.slice(0, 3);
}

/**
 * Generate chapter title
 */
function generateChapterTitle(
  arc: CollectiveArc,
  chapterNumber: number,
  mode: WeavingMode
): { title: string; titleChinese: string } {
  const arcTitles: Record<CollectiveArc, { en: string; zh: string }> = {
    gathering: { en: 'The Gathering', zh: '聚集' },
    ascending: { en: 'The Rising', zh: '上升' },
    peak: { en: 'The Convergence', zh: '汇聚' },
    descending: { en: 'The Settling', zh: '沉淀' },
    dispersing: { en: 'The Divergence', zh: '分流' },
    transforming: { en: 'The Transformation', zh: '蜕变' },
    integrating: { en: 'The Integration', zh: '整合' },
    differentiating: { en: 'The Differentiation', zh: '分化' }
  };

  const modePrefix: Record<WeavingMode, { en: string; zh: string }> = {
    family: { en: 'Chapter', zh: '篇章' },
    team: { en: 'Act', zh: '幕' },
    polycule: { en: 'Movement', zh: '乐章' },
    generational: { en: 'Epoch', zh: '纪元' }
  };

  const prefix = modePrefix[mode];
  const arcTitle = arcTitles[arc];

  return {
    title: `${prefix.en} ${chapterNumber} — ${arcTitle.en}`,
    titleChinese: `${prefix.zh}${chapterNumber} — ${arcTitle.zh}`
  };
}

/**
 * Generate chapter narrative
 */
function generateChapterNarrative(
  beats: WovenStoryBeat[],
  arc: CollectiveArc,
  protagonistIds: string[],
  participants: WeavingParticipant[],
  mode: WeavingMode
): string {
  const protagonistNames = protagonistIds
    .map(id => participants.find(p => p.id === id)?.name || 'Unknown')
    .join(' and ');

  const narrativeTemplates: Record<CollectiveArc, string> = {
    gathering: `In this chapter, ${protagonistNames} find their paths drawing together. The threads of separate destinies begin to interweave, creating a shared fabric.`,
    ascending: `The collective energy rises. ${protagonistNames} climb toward a shared summit, each step bringing them closer to a moment of convergence.`,
    peak: `This is the climax of the collective arc. ${protagonistNames} reach the summit together, where all threads meet in a single point of light.`,
    descending: `Having reached the heights, ${protagonistNames} now descend with earned wisdom. The intensity softens but the connections remain.`,
    dispersing: `The threads loosen here. ${protagonistNames} move in different directions, each carrying a piece of the shared experience.`,
    transforming: `Everything changes. ${protagonistNames} undergo a collective metamorphosis, emerging as something new.`,
    integrating: `The fragments become whole. ${protagonistNames} weave their separate pieces into a coherent tapestry.`,
    differentiating: `Distinct voices emerge. ${protagonistNames} discover their unique contributions to the collective story.`
  };

  let narrative = narrativeTemplates[arc];

  // Add beat summaries
  const significantBeats = beats.filter(b => b.collectiveIntensity > 60);
  if (significantBeats.length > 0) {
    narrative += '\n\n';
    for (const beat of significantBeats.slice(0, 2)) {
      narrative += beat.narrative + ' ';
    }
  }

  return narrative.trim();
}

// ============================================================================
// STEP 5: GENERATE COLLECTIVE NARRATIVE
// ============================================================================

/**
 * Extract overarching themes
 */
function extractSystemThemes(
  participants: WeavingParticipant[],
  chapters: WovenStoryChapter[],
  mode: WeavingMode
): WovenTheme[] {
  const themes: WovenTheme[] = [];
  let themeCounter = 0;

  // Collect all themes from chapters
  const allThemes = chapters.flatMap(ch => ch.themes);
  const themeCounts: Record<string, number> = {};
  for (const theme of allThemes) {
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
  }

  // Create WovenTheme objects for recurring themes
  for (const [theme, count] of Object.entries(themeCounts)) {
    if (count >= 2) {
      themeCounter++;
      themes.push({
        id: `theme_${themeCounter}`,
        theme,
        themeChinese: getThemeChinese(theme),
        manifestations: participants.slice(0, 3).map(p => ({
          participantId: p.id,
          expression: `${p.name} experiences this through their ${p.role} role`
        })),
        emotionalQuality: 'reflective'
      });
    }
  }

  // Add mode-specific themes
  if (mode === 'generational' || mode === 'family') {
    themeCounter++;
    themes.push({
      id: `theme_${themeCounter}`,
      theme: 'Generational inheritance',
      themeChinese: '代际传承',
      manifestations: participants
        .filter(p => p.generation !== undefined)
        .map(p => ({
          participantId: p.id,
          expression: `Generation ${p.generation}: ${p.name}`
        })),
      generationalPattern: {
        repeatsAcross: participants.filter(p => p.generation !== undefined).map(p => p.generation!),
        evolutionDirection: 'transforming'
      },
      emotionalQuality: 'reflective'
    });
  }

  return themes.slice(0, 5);
}

function getThemeChinese(theme: string): string {
  const themeMap: Record<string, string> = {
    'Ancestral patterns': '祖先模式',
    'Healing opportunity': '疗愈机会',
    'Breaking free': '突破束缚',
    'Coming together': '汇聚',
    'Transformation': '蜕变',
    'Family bonds': '家庭纽带',
    'Collective mission': '集体使命',
    'Network dynamics': '网络动态',
    'Lineage wisdom': '血脉智慧',
    'Generational inheritance': '代际传承'
  };
  return themeMap[theme] || theme;
}

/**
 * Derive the systemic arc
 */
function deriveSystemArc(
  chapters: WovenStoryChapter[],
  mode: WeavingMode
): SystemicArc {
  if (chapters.length === 0) {
    return {
      type: 'integration',
      typeChinese: SYSTEMIC_ARC_TYPE_CHINESE['integration'],
      summary: 'The story is just beginning.',
      turningPoints: [],
      resolution: 'unfolding'
    };
  }

  // Analyze chapter arcs
  const arcs = chapters.map(ch => ch.collectiveArc);

  let type: SystemicArcType = 'integration';

  if (arcs.includes('transforming')) {
    type = 'transformation';
  } else if (arcs.filter(a => a === 'ascending').length > arcs.length / 2) {
    type = 'expansion';
  } else if (arcs.filter(a => a === 'descending').length > arcs.length / 2) {
    type = 'contraction';
  } else if (arcs.includes('integrating')) {
    type = 'integration';
  } else if (arcs.includes('differentiating')) {
    type = 'differentiation';
  }

  // Mode-specific adjustments
  if (mode === 'family' || mode === 'generational') {
    if (arcs.some(a => a === 'transforming')) {
      type = 'breakthrough';
    }
  }

  // Find turning points
  const turningPoints = chapters
    .filter(ch => ch.beats.some(b => b.beatType === 'systemic_shift' || b.beatType === 'pattern_break'))
    .map(ch => ({
      timestamp: ch.timeSpan.start,
      description: ch.title,
      participants: ch.protagonists
    }));

  // Determine resolution
  const lastChapter = chapters[chapters.length - 1];
  let resolution: 'unfolding' | 'resolved' | 'transforming' | 'recurring' = 'unfolding';

  if (lastChapter.collectiveArc === 'integrating') {
    resolution = 'resolved';
  } else if (lastChapter.collectiveArc === 'transforming') {
    resolution = 'transforming';
  } else if (lastChapter.beats.some(b => b.beatType === 'pattern_repeat')) {
    resolution = 'recurring';
  }

  return {
    type,
    typeChinese: SYSTEMIC_ARC_TYPE_CHINESE[type],
    summary: generateSystemArcSummary(type, mode),
    turningPoints,
    resolution
  };
}

function generateSystemArcSummary(type: SystemicArcType, mode: WeavingMode): string {
  const summaries: Record<SystemicArcType, string> = {
    healing: 'The system moves toward wholeness, old wounds finding their medicine.',
    expansion: 'The collective grows, reaching outward to embrace new possibilities.',
    contraction: 'The system consolidates, focusing energy on what truly matters.',
    transformation: 'A metamorphosis unfolds across the entire web of relationships.',
    repetition: 'Familiar patterns cycle through, waiting to be recognized.',
    breakthrough: 'Something breaks free from the old patterns, creating new pathways.',
    integration: 'Separate threads weave together into a coherent whole.',
    differentiation: 'Unique voices emerge from the collective, each finding their distinct tone.'
  };

  return summaries[type];
}

// ============================================================================
// STEP 6: MAIN WEAVING ENGINE
// ============================================================================

/**
 * Generate prologue for woven story
 */
function generateWovenPrologue(
  mode: WeavingMode,
  participants: WeavingParticipant[]
): string {
  const prologues: Record<WeavingMode, string> = {
    family: `This is the story of a family across time. ${participants.length} souls, bound by blood and history, weaving their destinies together. What echoes through the generations? What patterns repeat, what patterns break? The tapestry reveals itself.`,
    team: `This is the story of a collective mission. ${participants.length} individuals, drawn together by purpose, creating something greater than themselves. How do their paths converge? When does synergy peak? The arc unfolds.`,
    polycule: `This is the story of a love network. ${participants.length} hearts, connected in ways that transcend the simple dyad. How does the web breathe? Where does it strengthen, where does it strain? The dance reveals itself.`,
    generational: `This is the story of a lineage across five generations. From ancestor to descendant, ${participants.length} souls carry the thread of destiny. What wisdom passes down? What wounds seek healing? The saga continues.`
  };

  return prologues[mode];
}

/**
 * Generate epilogue for woven story
 */
function generateWovenEpilogue(
  mode: WeavingMode,
  systemicArc: SystemicArc
): string {
  const resolutionPhrases: Record<string, string> = {
    unfolding: 'The story continues to unfold, each moment adding new threads to the tapestry.',
    resolved: 'And so the threads find their resolution, woven into a pattern of wholeness.',
    transforming: 'The transformation continues, old forms giving way to new possibilities.',
    recurring: 'The pattern echoes still, awaiting the moment of recognition that will shift it.'
  };

  return `${systemicArc.summary}\n\n${resolutionPhrases[systemicArc.resolution]}`;
}

/**
 * Generate title for woven story
 */
function generateWovenTitle(
  mode: WeavingMode,
  participants: WeavingParticipant[]
): { title: string; titleChinese: string } {
  const primaryName = participants.find(p => p.role === 'self')?.name ||
                      participants[0]?.name || 'Unknown';

  const titles: Record<WeavingMode, { en: string; zh: string }> = {
    family: {
      en: `The ${primaryName} Family Tapestry`,
      zh: `${primaryName}家族织锦`
    },
    team: {
      en: `The Collective Journey`,
      zh: `集体之旅`
    },
    polycule: {
      en: `The Network of Hearts`,
      zh: `心之网络`
    },
    generational: {
      en: `The ${primaryName} Lineage Saga`,
      zh: `${primaryName}血脉传说`
    }
  };

  return titles[mode];
}

/**
 * Main weaving engine function
 */
export function weaveStories(input: WeavingEngineInput): WeavingEngineResult {
  try {
    const { mode, participants, relationships, options } = input;

    // Validate input
    if (!participants || participants.length < 2) {
      return {
        success: false,
        errors: [{
          code: 'INSUFFICIENT_PARTICIPANTS',
          message: 'At least 2 participants required for weaving'
        }]
      };
    }

    // Step 1: Collect individual beats
    const allBeats = collectIndividualBeats(participants);

    if (allBeats.length === 0) {
      return {
        success: false,
        errors: [{
          code: 'NO_STORY_DATA',
          message: 'No individual story data found for participants'
        }]
      };
    }

    // Step 2: Align timelines
    const alignedBeats = alignBeatsAcrossStories(allBeats);

    // Step 3: Group into time windows and detect collective beats
    const timeWindows = groupBeatsIntoTimeWindows(alignedBeats, 6);
    const wovenBeats = detectCollectiveBeats(timeWindows, participants, mode);

    // Step 4: Group into chapters
    const chapters = groupCollectiveBeatsIntoChapters(wovenBeats, participants, mode);

    // Step 5: Extract themes and derive systemic arc
    const themes = extractSystemThemes(participants, chapters, mode);
    const systemicArc = deriveSystemArc(chapters, mode);

    // Step 6: Generate complete woven story
    const { title, titleChinese } = generateWovenTitle(mode, participants);

    // Calculate time span
    const allStarts = wovenBeats.map(b => new Date(b.timeRange.start));
    const allEnds = wovenBeats.map(b => new Date(b.timeRange.end));
    const startDate = new Date(Math.min(...allStarts.map(d => d.getTime())));
    const endDate = new Date(Math.max(...allEnds.map(d => d.getTime())));
    const durationYears = Math.round((endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    const wovenStory: WovenStory = {
      id: `woven_${mode}_${Date.now()}`,
      mode,
      modeChinese: WEAVING_MODE_CHINESE[mode],
      title,
      titleChinese,
      participants,
      participantCount: participants.length,
      edges: relationships,
      chapters,
      timeSpan: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        durationYears
      },
      overarchingThemes: themes,
      systemicArc,
      prologue: generateWovenPrologue(mode, participants),
      epilogue: generateWovenEpilogue(mode, systemicArc),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return {
      success: true,
      story: wovenStory,
      warnings: []
    };

  } catch (error) {
    return {
      success: false,
      errors: [{
        code: 'WEAVING_ERROR',
        message: error instanceof Error ? error.message : 'Unknown weaving error'
      }]
    };
  }
}

// ============================================================================
// VISUALIZATION DATA GENERATORS
// ============================================================================

/**
 * Generate network graph data for visualization
 */
export function generateNetworkGraphData(
  story: WovenStory
): WeavingNetworkData {
  const nodes = story.participants.map((p, index) => ({
    id: p.id,
    label: p.name,
    labelChinese: p.nameChinese,
    size: calculateNodeSize(p, story),
    color: getNodeColor(p.role),
    level: p.generation,
    role: p.role
  }));

  const edges = story.edges.map(e => ({
    id: e.id,
    source: e.participants[0],
    target: e.participants[1],
    weight: e.weight,
    color: getEdgeColor(e.relationshipType),
    style: 'solid' as const,
    label: e.relationshipType
  }));

  return { nodes, edges };
}

function calculateNodeSize(p: WeavingParticipant, story: WovenStory): number {
  // Size based on activity in the story
  const beatCount = story.chapters.flatMap(ch => ch.beats)
    .filter(b => b.participants.includes(p.id)).length;

  return Math.min(50, Math.max(20, 20 + beatCount * 3));
}

function getNodeColor(role: string): string {
  const colors: Record<string, string> = {
    self: '#fbbf24',
    partner: '#f472b6',
    parent: '#60a5fa',
    child: '#34d399',
    sibling: '#a78bfa',
    founder: '#fbbf24',
    leader: '#f59e0b',
    primary: '#ec4899',
    default: '#94a3b8'
  };
  return colors[role] || colors.default;
}

function getEdgeColor(type: string): string {
  const colors: Record<string, string> = {
    romantic: '#ec4899',
    familial: '#60a5fa',
    collaborative: '#fbbf24',
    friendship: '#34d399',
    ancestral: '#a78bfa'
  };
  return colors[type] || '#94a3b8';
}

/**
 * Generate collective timeline data for visualization
 */
export function generateCollectiveTimelineData(
  story: WovenStory
): CollectiveTimelineData {
  const lanes = story.participants.map(p => ({
    participantId: p.id,
    participantName: p.name,
    beats: story.chapters.flatMap(ch =>
      ch.beats
        .filter(b => b.participants.includes(p.id))
        .map(b => ({
          id: b.id,
          start: b.timeRange.start,
          end: b.timeRange.end,
          type: b.beatType,
          color: BEAT_COLORS[b.beatType]
        }))
    )
  }));

  const sharedBeats = story.chapters.flatMap(ch =>
    ch.beats
      .filter(b => b.participants.length > 1)
      .map(b => ({
        id: b.id,
        start: b.timeRange.start,
        end: b.timeRange.end,
        participants: b.participants,
        type: b.beatType,
        color: BEAT_COLORS[b.beatType]
      }))
  );

  const chapterMarkers = story.chapters.map(ch => ({
    timestamp: ch.timeSpan.start,
    chapterNumber: ch.chapterNumber,
    title: ch.title
  }));

  return {
    timeRange: story.timeSpan,
    lanes,
    sharedBeats,
    chapterMarkers
  };
}

/**
 * Generate generational ladder data for visualization
 */
export function generateGenerationalLadderData(
  story: WovenStory
): GenerationalLadderData {
  // Group participants by generation
  const byGeneration = new Map<number, WeavingParticipant[]>();

  for (const p of story.participants) {
    const gen = p.generation ?? 0;
    if (!byGeneration.has(gen)) {
      byGeneration.set(gen, []);
    }
    byGeneration.get(gen)!.push(p);
  }

  const generationLabels: Record<number, { en: string; zh: string }> = {
    '-2': { en: 'Grandparents', zh: '祖父母' },
    '-1': { en: 'Parents', zh: '父母' },
    '0': { en: 'Self', zh: '自己' },
    '1': { en: 'Children', zh: '子女' },
    '2': { en: 'Grandchildren', zh: '孙子女' }
  };

  const generations = Array.from(byGeneration.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([level, participants]) => ({
      level,
      label: generationLabels[level.toString()]?.en || `Generation ${level}`,
      labelChinese: generationLabels[level.toString()]?.zh || `第${level}代`,
      participants: participants.map((p, i) => ({
        id: p.id,
        name: p.name,
        position: i
      }))
    }));

  // Generate arcs based on themes
  const arcs: GenerationalLadderData['arcs'] = [];
  let arcCounter = 0;

  for (const theme of story.overarchingThemes) {
    if (theme.generationalPattern) {
      const generations = theme.generationalPattern.repeatsAcross;
      for (let i = 0; i < generations.length - 1; i++) {
        const fromGen = byGeneration.get(generations[i]);
        const toGen = byGeneration.get(generations[i + 1]);

        if (fromGen && fromGen.length > 0 && toGen && toGen.length > 0) {
          arcCounter++;
          arcs.push({
            id: `arc_${arcCounter}`,
            fromParticipant: fromGen[0].id,
            toParticipant: toGen[0].id,
            theme: theme.theme,
            style: theme.generationalPattern.evolutionDirection === 'resolving' ? 'healing' :
                   theme.generationalPattern.evolutionDirection === 'transforming' ? 'break' :
                   'inheritance'
          });
        }
      }
    }
  }

  return { generations, arcs };
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export {
  WEAVING_MODE_CHINESE,
  WOVEN_BEAT_TYPE_CHINESE,
  COLLECTIVE_ARC_CHINESE,
  SYSTEMIC_ARC_TYPE_CHINESE,
  ROLE_CHINESE,
  BEAT_COLORS
};
