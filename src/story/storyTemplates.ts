/**
 * ============================================================================
 * ARCHETYPAL STORY TEMPLATES (叙事原型模板)
 * ============================================================================
 *
 * The library of story-worlds.
 * Five narrative lenses that transform the same metaphysical truth
 * into completely different storytelling skins.
 *
 * Templates:
 * - Mythic (神话体) - Cosmic journey, trials, quests
 * - Romantic (浪漫体) - Love story, seasons of the heart
 * - Psychological (心理体) - Inner patterns, attachment dynamics
 * - Cinematic (电影体) - Film, scenes, acts
 * - Poetic (诗意体) - Living poem, stanzas, imagery
 *
 * Same metaphysics. Same timing. Same events.
 * Different story worlds.
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  StoryBeat,
  StoryChapter,
  PredictiveStory,
  EmotionalTone,
  BeatType,
  ChapterArc
} from './storyTypes';

// ============================================================================
// TYPES
// ============================================================================

/**
 * The five archetypal template styles
 */
export type TemplateStyle =
  | 'mythic'      // 神话体 - Cosmic journey
  | 'romantic'    // 浪漫体 - Love story
  | 'psychological' // 心理体 - Inner patterns
  | 'cinematic'   // 电影体 - Film narrative
  | 'poetic';     // 诗意体 - Living poem

/**
 * Template configuration
 */
export interface TemplateConfig {
  style: TemplateStyle;
  styleChinese: string;
  philosophy: string;
  tone: string[];
  structuralRules: {
    beats: string;      // What beats become
    chapters: string;   // What chapters become
    emotionalArcs: string; // What emotional arcs become
    environmental: string; // What environmental overlays become
  };
}

/**
 * Vocabulary mapping for each template
 */
export interface TemplateVocabulary {
  // Beat type transformations
  beatLabels: Record<BeatType, string>;

  // Emotional tone transformations
  toneLabels: Record<EmotionalTone, string>;

  // Chapter arc transformations
  arcLabels: Record<ChapterArc, string>;

  // Transition phrases
  transitions: {
    opening: string[];
    rising: string[];
    peak: string[];
    falling: string[];
    closing: string[];
  };

  // Environmental descriptors
  environmental: {
    auspicious: string[];
    neutral: string[];
    challenging: string[];
  };

  // Time references
  timeReferences: {
    beginning: string[];
    middle: string[];
    end: string[];
    turning: string[];
  };
}

/**
 * Transformed story output
 */
export interface TransformedStory {
  original: PredictiveStory;
  template: TemplateStyle;
  templateChinese: string;

  // Transformed elements
  title: string;
  titleChinese: string;
  prologue: string;
  epilogue: string;

  chapters: TransformedChapter[];

  // Metadata
  transformedAt: string;
}

export interface TransformedChapter {
  originalId: string;
  title: string;
  titleChinese: string;
  narrative: string;
  beats: TransformedBeat[];
}

export interface TransformedBeat {
  originalId: string;
  label: string;
  description: string;
  imagery: string;
}

// ============================================================================
// TEMPLATE CONFIGURATIONS
// ============================================================================

export const TEMPLATE_CONFIGS: Record<TemplateStyle, TemplateConfig> = {
  mythic: {
    style: 'mythic',
    styleChinese: '神话体',
    philosophy: 'The relationship is a cosmic journey. Every timing window is a trial, every event trigger a gate, every lifecycle phase a realm.',
    tone: ['Archetypal', 'Grand', 'Elemental', 'Timeless'],
    structuralRules: {
      beats: 'Beats become quests',
      chapters: 'Chapters become epochs',
      emotionalArcs: 'Emotional arcs become rites of passage',
      environmental: 'Environmental overlays become omens'
    }
  },

  romantic: {
    style: 'romantic',
    styleChinese: '浪漫体',
    philosophy: 'The relationship is a love story. Timing windows are emotional seasons, event triggers are heart-turns, lifecycle phases are chapters of intimacy.',
    tone: ['Warm', 'Emotional', 'Intimate', 'Sensory'],
    structuralRules: {
      beats: 'Beats become moments',
      chapters: 'Chapters become seasons of the heart',
      emotionalArcs: 'Emotional arcs become inner tides',
      environmental: 'Environmental overlays become moods'
    }
  },

  psychological: {
    style: 'psychological',
    styleChinese: '心理体',
    philosophy: 'The relationship is a mirror of inner patterns. Timing windows reveal attachment dynamics, event triggers activate shadow material, lifecycle phases show developmental arcs.',
    tone: ['Insightful', 'Analytical', 'Reflective', 'Grounded'],
    structuralRules: {
      beats: 'Beats become psychological activations',
      chapters: 'Chapters become developmental stages',
      emotionalArcs: 'Emotional arcs become regulation patterns',
      environmental: 'Environmental overlays become contextual pressures'
    }
  },

  cinematic: {
    style: 'cinematic',
    styleChinese: '电影体',
    philosophy: 'The relationship is a film. Timing windows are scenes, event triggers are plot twists, lifecycle phases are acts, emotional arcs are soundtracks.',
    tone: ['Visual', 'Dramatic', 'Rhythmic', 'Scene-driven'],
    structuralRules: {
      beats: 'Beats become scenes',
      chapters: 'Chapters become acts',
      emotionalArcs: 'Emotional arcs become score cues',
      environmental: 'Environmental overlays become lighting and setting'
    }
  },

  poetic: {
    style: 'poetic',
    styleChinese: '诗意体',
    philosophy: 'The relationship is a living poem. Timing windows are stanzas, event triggers are metaphors, lifecycle phases are movements, emotional arcs are currents of imagery.',
    tone: ['Lyrical', 'Symbolic', 'Evocative', 'Minimalist'],
    structuralRules: {
      beats: 'Beats become images',
      chapters: 'Chapters become movements',
      emotionalArcs: 'Emotional arcs become metaphors',
      environmental: 'Environmental overlays become natural symbols'
    }
  }
};

// ============================================================================
// TEMPLATE VOCABULARIES
// ============================================================================

const MYTHIC_VOCABULARY: TemplateVocabulary = {
  beatLabels: {
    opening: 'The Call',
    rising: 'The Ascent',
    peak: 'The Summit',
    falling: 'The Descent',
    turning: 'The Gate',
    crisis: 'The Trial',
    resolution: 'The Return',
    quiet: 'The Stillness'
  },

  toneLabels: {
    hopeful: 'Blessed',
    joyful: 'Triumphant',
    tense: 'Tested',
    melancholic: 'Shadowed',
    peaceful: 'Sacred',
    passionate: 'Elemental',
    anxious: 'Threshold',
    reflective: 'Wisdom-Touched'
  },

  arcLabels: {
    ascending: 'The Hero\'s Rise',
    descending: 'The Hero\'s Descent',
    stable: 'The Sacred Plateau',
    volatile: 'The Storm of Trials',
    climactic: 'The Final Battle'
  },

  transitions: {
    opening: [
      'In the beginning, before the stars aligned...',
      'The journey commences at the threshold of fate...',
      'Ancient forces stir as the path unfolds...'
    ],
    rising: [
      'The hero climbs toward destiny...',
      'Through trials of fire and water...',
      'Each step brings them closer to the sacred summit...'
    ],
    peak: [
      'At the crown of the mountain...',
      'Where heaven meets earth...',
      'The ultimate trial awaits...'
    ],
    falling: [
      'Descending now with wisdom earned...',
      'The return journey begins...',
      'Carrying treasures from the heights...'
    ],
    closing: [
      'And so the cycle completes...',
      'The eternal wheel turns once more...',
      'A new myth is written in the stars...'
    ]
  },

  environmental: {
    auspicious: ['The omens shine bright', 'Celestial blessing descends', 'The gods smile upon this path'],
    neutral: ['The cosmos holds its breath', 'Fate watches silently', 'The spirits remain veiled'],
    challenging: ['Dark omens gather', 'The shadow realm stirs', 'Ancient trials awaken']
  },

  timeReferences: {
    beginning: ['At the dawn of this epoch', 'When the first light breaks', 'As the journey begins'],
    middle: ['In the heart of the passage', 'At the crossroads of destiny', 'Where paths converge'],
    end: ['As the cycle closes', 'When the wheel completes its turn', 'At journey\'s end'],
    turning: ['A gate opens in the fabric of fate', 'The winds of change blow through', 'Destiny pivots']
  }
};

const ROMANTIC_VOCABULARY: TemplateVocabulary = {
  beatLabels: {
    opening: 'First Light',
    rising: 'Growing Closer',
    peak: 'Hearts Aligned',
    falling: 'The Quiet After',
    turning: 'Heart-Turn',
    crisis: 'Love\'s Test',
    resolution: 'Coming Home',
    quiet: 'Tender Stillness'
  },

  toneLabels: {
    hopeful: 'Dreaming',
    joyful: 'Dancing',
    tense: 'Trembling',
    melancholic: 'Yearning',
    peaceful: 'Nestled',
    passionate: 'Burning',
    anxious: 'Waiting',
    reflective: 'Remembering'
  },

  arcLabels: {
    ascending: 'Love Rising',
    descending: 'Letting Go',
    stable: 'Safe Harbor',
    volatile: 'Storm of Hearts',
    climactic: 'The Moment of Truth'
  },

  transitions: {
    opening: [
      'In this first breath of togetherness...',
      'Where love begins its gentle work...',
      'Two hearts find their way toward each other...'
    ],
    rising: [
      'Something tender unfolds between you...',
      'Love deepens with each passing day...',
      'Closer now, the distance dissolving...'
    ],
    peak: [
      'This is the moment hearts have waited for...',
      'All of love converges here...',
      'The fullness of what you share shines brightest now...'
    ],
    falling: [
      'The intensity softens into something gentler...',
      'Love settles like evening light...',
      'What remains is true and quiet...'
    ],
    closing: [
      'And so you rest in what you\'ve built...',
      'Love, having traveled far, finds home...',
      'The story continues in softer tones...'
    ]
  },

  environmental: {
    auspicious: ['The air feels charged with possibility', 'Everything conspires toward closeness', 'The world seems to bless your bond'],
    neutral: ['Life moves around you, steady', 'The rhythm of days continues', 'Ordinary moments hold you'],
    challenging: ['Something pulls at the seams', 'The weather of love shifts', 'Distance creeps in uninvited']
  },

  timeReferences: {
    beginning: ['In these first tender days', 'As love takes its first steps', 'When everything is new'],
    middle: ['In the heart of your season', 'As the story deepens', 'Where love does its real work'],
    end: ['As this chapter closes', 'When the season turns', 'In the quiet after'],
    turning: ['Something shifts between you', 'A truth rises to the surface', 'Hearts make their choice']
  }
};

const PSYCHOLOGICAL_VOCABULARY: TemplateVocabulary = {
  beatLabels: {
    opening: 'Initial Activation',
    rising: 'Pattern Emergence',
    peak: 'Peak Arousal',
    falling: 'Integration Phase',
    turning: 'Rupture Point',
    crisis: 'Shadow Activation',
    resolution: 'Repair Cycle',
    quiet: 'Baseline State'
  },

  toneLabels: {
    hopeful: 'Secure Attachment',
    joyful: 'Positive Affect',
    tense: 'Hypervigilance',
    melancholic: 'Grief Processing',
    peaceful: 'Regulated State',
    passionate: 'Arousal Spike',
    anxious: 'Anxious Activation',
    reflective: 'Mentalizing'
  },

  arcLabels: {
    ascending: 'Upward Regulation',
    descending: 'Downward Regulation',
    stable: 'Window of Tolerance',
    volatile: 'Dysregulation Pattern',
    climactic: 'Integration Crisis'
  },

  transitions: {
    opening: [
      'The relational field activates...',
      'Attachment patterns begin their familiar dance...',
      'Early dynamics set the template...'
    ],
    rising: [
      'As intimacy increases, so does vulnerability...',
      'Deeper layers of self emerge for witnessing...',
      'The relationship becomes a mirror...'
    ],
    peak: [
      'Core schemas are fully activated...',
      'This is the moment of maximum exposure...',
      'What was unconscious becomes visible...'
    ],
    falling: [
      'Integration begins as intensity decreases...',
      'New neural pathways solidify...',
      'The system returns toward baseline...'
    ],
    closing: [
      'A new relational pattern has been established...',
      'Earned security replaces old templates...',
      'The developmental arc completes this phase...'
    ]
  },

  environmental: {
    auspicious: ['External conditions support secure functioning', 'The environment holds the relationship', 'Resources are available for growth'],
    neutral: ['Contextual factors remain stable', 'The environment neither supports nor threatens', 'External pressures are manageable'],
    challenging: ['Environmental stressors tax the system', 'External pressures activate defenses', 'The context demands adaptive response']
  },

  timeReferences: {
    beginning: ['In this initial phase', 'As the developmental arc begins', 'During early attachment formation'],
    middle: ['At the midpoint of this cycle', 'As patterns crystallize', 'During the working-through phase'],
    end: ['As this developmental stage completes', 'In the integration phase', 'As the arc resolves'],
    turning: ['A familiar pattern resurfaces', 'The system encounters a choice point', 'Differentiation becomes possible']
  }
};

const CINEMATIC_VOCABULARY: TemplateVocabulary = {
  beatLabels: {
    opening: 'Opening Scene',
    rising: 'Rising Action',
    peak: 'Climax',
    falling: 'Falling Action',
    turning: 'Plot Twist',
    crisis: 'Dark Night',
    resolution: 'Resolution',
    quiet: 'Interlude'
  },

  toneLabels: {
    hopeful: 'Dawn Light',
    joyful: 'Golden Hour',
    tense: 'Edge of Seat',
    melancholic: 'Blue Hour',
    peaceful: 'Soft Focus',
    passionate: 'High Contrast',
    anxious: 'Handheld',
    reflective: 'Slow Motion'
  },

  arcLabels: {
    ascending: 'Act One Rising',
    descending: 'Act Three Descent',
    stable: 'Establishing Sequence',
    volatile: 'Montage of Chaos',
    climactic: 'The Final Act'
  },

  transitions: {
    opening: [
      'FADE IN: The story begins...',
      'The opening shot reveals...',
      'We begin with an establishing scene...'
    ],
    rising: [
      'The tension builds with each frame...',
      'CUT TO: The stakes increase...',
      'The music swells beneath...'
    ],
    peak: [
      'CLOSE-UP: This is the moment everything changes...',
      'The camera holds on their faces...',
      'All storylines converge in this scene...'
    ],
    falling: [
      'The score softens as resolution nears...',
      'DISSOLVE TO: The aftermath...',
      'The pace slows, but the weight remains...'
    ],
    closing: [
      'FADE TO BLACK: The credits roll on this chapter...',
      'The final shot lingers...',
      'END OF ACT...'
    ]
  },

  environmental: {
    auspicious: ['The lighting shifts to warm tones', 'The soundtrack turns hopeful', 'The frame opens up, breathes'],
    neutral: ['Standard coverage continues', 'The scene plays out in medium shots', 'Ambient sound fills the space'],
    challenging: ['Shadows creep into the frame', 'The score turns minor', 'Quick cuts increase the tension']
  },

  timeReferences: {
    beginning: ['In the opening sequence', 'As the first act unfolds', 'The establishing shots reveal'],
    middle: ['At the midpoint of the film', 'As Act Two deepens', 'The B-plot intersects'],
    end: ['In the final act', 'As the resolution approaches', 'The denouement begins'],
    turning: ['SMASH CUT: Everything changes', 'The inciting incident arrives', 'A revelation shifts the story']
  }
};

const POETIC_VOCABULARY: TemplateVocabulary = {
  beatLabels: {
    opening: 'First Verse',
    rising: 'Gathering',
    peak: 'Crescendo',
    falling: 'Fade',
    turning: 'The Pivot',
    crisis: 'The Storm',
    resolution: 'The Clearing',
    quiet: 'Stillness'
  },

  toneLabels: {
    hopeful: 'Spring-touched',
    joyful: 'Sun-drenched',
    tense: 'Taut as wire',
    melancholic: 'Dusk-colored',
    peaceful: 'River-calm',
    passionate: 'Fire-bright',
    anxious: 'Wind-stirred',
    reflective: 'Moon-lit'
  },

  arcLabels: {
    ascending: 'The Rising Tide',
    descending: 'The Falling Leaves',
    stable: 'The Still Lake',
    volatile: 'The Restless Sea',
    climactic: 'The Breaking Wave'
  },

  transitions: {
    opening: [
      'It begins like breath—',
      'In the space before words—',
      'Something stirs in the silence—'
    ],
    rising: [
      'Now it builds, layer upon layer—',
      'The current strengthens beneath—',
      'Like spring pushing through soil—'
    ],
    peak: [
      'Here: the fullest note—',
      'Where everything converges—',
      'The moment that holds all moments—'
    ],
    falling: [
      'And now, the gentling—',
      'What rises must settle—',
      'Petals falling, one by one—'
    ],
    closing: [
      'Until only this remains—',
      'The poem completes itself—',
      'Silence, holding everything—'
    ]
  },

  environmental: {
    auspicious: ['The wind carries sweetness', 'Light pools in unexpected places', 'The earth hums beneath'],
    neutral: ['The sky holds its color', 'Ordinary hours pass', 'Leaves turn in their time'],
    challenging: ['Storm-clouds gather at the horizon', 'The air grows heavy', 'Something trembles beneath the surface']
  },

  timeReferences: {
    beginning: ['At the first line', 'Before the story takes shape', 'In the white space before'],
    middle: ['In the heart of the verse', 'Where meaning gathers', 'At the volta'],
    end: ['As the final stanza forms', 'Where silence returns', 'At the poem\'s edge'],
    turning: ['The line breaks here', 'Something shifts in the meter', 'A new rhythm emerges']
  }
};

export const TEMPLATE_VOCABULARIES: Record<TemplateStyle, TemplateVocabulary> = {
  mythic: MYTHIC_VOCABULARY,
  romantic: ROMANTIC_VOCABULARY,
  psychological: PSYCHOLOGICAL_VOCABULARY,
  cinematic: CINEMATIC_VOCABULARY,
  poetic: POETIC_VOCABULARY
};

// ============================================================================
// TEMPLATE TRANSFORMERS
// ============================================================================

/**
 * Get a random item from an array
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Transform a beat using the template vocabulary
 */
function transformBeat(
  beat: StoryBeat,
  vocab: TemplateVocabulary,
  style: TemplateStyle
): TransformedBeat {
  const label = vocab.beatLabels[beat.type] || beat.type;
  const toneLabel = vocab.toneLabels[beat.tone] || beat.tone;

  // Generate imagery based on style
  let imagery: string;
  switch (style) {
    case 'mythic':
      imagery = `${toneLabel} forces gather as ${label.toLowerCase()} unfolds in the cosmic journey.`;
      break;
    case 'romantic':
      imagery = `This ${toneLabel.toLowerCase()} moment marks ${label.toLowerCase()} in your love story.`;
      break;
    case 'psychological':
      imagery = `${label} phase brings ${toneLabel.toLowerCase()} activation in the relational field.`;
      break;
    case 'cinematic':
      imagery = `SCENE: ${label}. The ${toneLabel.toLowerCase()} sequence plays out on screen.`;
      break;
    case 'poetic':
      imagery = `${toneLabel}—the ${label.toLowerCase()} arrives like a line breaking into meaning.`;
      break;
    default:
      imagery = beat.summary;
  }

  return {
    originalId: beat.id,
    label,
    description: beat.summary,
    imagery
  };
}

/**
 * Transform a chapter using the template vocabulary
 */
function transformChapter(
  chapter: StoryChapter,
  beats: StoryBeat[],
  vocab: TemplateVocabulary,
  style: TemplateStyle
): TransformedChapter {
  const arcLabel = vocab.arcLabels[chapter.arc] || chapter.arc;
  const chapterBeats = beats.filter(b =>
    b.timeRange.start >= chapter.timeSpan.start &&
    b.timeRange.end <= chapter.timeSpan.end
  );

  // Generate chapter title based on style
  let title: string;
  let titleChinese: string;

  switch (style) {
    case 'mythic':
      title = `Epoch ${chapter.id.split('_').pop()}: ${arcLabel}`;
      titleChinese = `纪元: ${chapter.titleChinese || chapter.title}`;
      break;
    case 'romantic':
      title = `Season of ${chapter.title}`;
      titleChinese = `心之季: ${chapter.titleChinese || chapter.title}`;
      break;
    case 'psychological':
      title = `Developmental Stage: ${chapter.title}`;
      titleChinese = `发展阶段: ${chapter.titleChinese || chapter.title}`;
      break;
    case 'cinematic':
      title = `Act ${chapter.id.split('_').pop()}: ${chapter.title}`;
      titleChinese = `幕: ${chapter.titleChinese || chapter.title}`;
      break;
    case 'poetic':
      title = `Movement: ${chapter.title}`;
      titleChinese = `乐章: ${chapter.titleChinese || chapter.title}`;
      break;
    default:
      title = chapter.title;
      titleChinese = chapter.titleChinese || chapter.title;
  }

  // Generate narrative based on emotional shift
  const transitionKey = chapter.emotionalShift.direction === 'ascending' ? 'rising' :
                        chapter.emotionalShift.direction === 'descending' ? 'falling' :
                        chapter.emotionalShift.intensity > 0.7 ? 'peak' : 'opening';

  const transitionPhrase = pickRandom(vocab.transitions[transitionKey]);
  const narrative = `${transitionPhrase}\n\n${chapter.narrative}`;

  return {
    originalId: chapter.id,
    title,
    titleChinese,
    narrative,
    beats: chapterBeats.map(b => transformBeat(b, vocab, style))
  };
}

/**
 * Generate transformed story title
 */
function generateTransformedTitle(
  story: PredictiveStory,
  style: TemplateStyle
): { title: string; titleChinese: string } {
  const baseTitle = story.metadata?.title || 'Your Story';

  switch (style) {
    case 'mythic':
      return {
        title: `The Saga of ${baseTitle}`,
        titleChinese: `${baseTitle}传说`
      };
    case 'romantic':
      return {
        title: `A Love Story: ${baseTitle}`,
        titleChinese: `爱的故事: ${baseTitle}`
      };
    case 'psychological':
      return {
        title: `The Inner Journey: ${baseTitle}`,
        titleChinese: `心灵之旅: ${baseTitle}`
      };
    case 'cinematic':
      return {
        title: `${baseTitle}: The Film`,
        titleChinese: `${baseTitle}: 电影版`
      };
    case 'poetic':
      return {
        title: `Verses of ${baseTitle}`,
        titleChinese: `${baseTitle}诗篇`
      };
    default:
      return {
        title: baseTitle,
        titleChinese: baseTitle
      };
  }
}

/**
 * Generate transformed prologue
 */
function generateTransformedPrologue(
  story: PredictiveStory,
  vocab: TemplateVocabulary,
  style: TemplateStyle
): string {
  const opening = pickRandom(vocab.transitions.opening);
  const config = TEMPLATE_CONFIGS[style];

  return `${opening}\n\n${config.philosophy}\n\n${story.prologue || ''}`;
}

/**
 * Generate transformed epilogue
 */
function generateTransformedEpilogue(
  story: PredictiveStory,
  vocab: TemplateVocabulary,
  style: TemplateStyle
): string {
  const closing = pickRandom(vocab.transitions.closing);

  return `${story.epilogue || ''}\n\n${closing}`;
}

// ============================================================================
// MAIN TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform a complete story into a specific archetypal template
 */
export function transformStory(
  story: PredictiveStory,
  style: TemplateStyle
): TransformedStory {
  const config = TEMPLATE_CONFIGS[style];
  const vocab = TEMPLATE_VOCABULARIES[style];

  const { title, titleChinese } = generateTransformedTitle(story, style);

  return {
    original: story,
    template: style,
    templateChinese: config.styleChinese,

    title,
    titleChinese,
    prologue: generateTransformedPrologue(story, vocab, style),
    epilogue: generateTransformedEpilogue(story, vocab, style),

    chapters: story.chapters.map(ch =>
      transformChapter(ch, story.beats, vocab, style)
    ),

    transformedAt: new Date().toISOString()
  };
}

/**
 * Transform a single beat description using a template
 */
export function transformBeatText(
  text: string,
  style: TemplateStyle,
  beatType: BeatType = 'turning'
): string {
  const vocab = TEMPLATE_VOCABULARIES[style];
  const timeRef = pickRandom(vocab.timeReferences.turning);

  switch (style) {
    case 'mythic':
      return `${timeRef}, ${text.toLowerCase()}. A hidden gate opens, testing the bond with a trial of transformation. What rises here is not conflict, but initiation.`;

    case 'romantic':
      return `${timeRef}. ${text} A truth rises to the surface—tender, vulnerable, asking to be spoken. This is the moment where hearts either open or retreat.`;

    case 'psychological':
      return `${timeRef}: a familiar pattern resurfaces—a tension that reveals unmet needs beneath the surface. This is a window for differentiation: understanding where each partner's emotional boundaries truly lie. ${text}`;

    case 'cinematic':
      return `${timeRef}: two characters standing at a crossroads, the light shifting, the music tightening. ${text} A choice is coming—and the camera lingers just long enough to feel it.`;

    case 'poetic':
      return `${timeRef}—charged, trembling, waiting to break. Something unspoken gathers between you, a quiet thunder asking to be heard. ${text}`;

    default:
      return text;
  }
}

/**
 * Get template info for display
 */
export function getTemplateInfo(style: TemplateStyle): {
  config: TemplateConfig;
  vocabulary: TemplateVocabulary;
  sampleTransformation: {
    original: string;
    transformed: string;
  };
} {
  const config = TEMPLATE_CONFIGS[style];
  const vocabulary = TEMPLATE_VOCABULARIES[style];

  const original = 'Mid-year brings a turning point with rising tension.';
  const transformed = transformBeatText(original, style, 'turning');

  return {
    config,
    vocabulary,
    sampleTransformation: {
      original,
      transformed
    }
  };
}

/**
 * Get all available templates
 */
export function getAllTemplates(): Array<{
  style: TemplateStyle;
  styleChinese: string;
  philosophy: string;
  tone: string[];
}> {
  return Object.values(TEMPLATE_CONFIGS).map(config => ({
    style: config.style,
    styleChinese: config.styleChinese,
    philosophy: config.philosophy,
    tone: config.tone
  }));
}

/**
 * Transform environmental overlay description
 */
export function transformEnvironmental(
  description: string,
  quality: 'auspicious' | 'neutral' | 'challenging',
  style: TemplateStyle
): string {
  const vocab = TEMPLATE_VOCABULARIES[style];
  const envPhrase = pickRandom(vocab.environmental[quality]);

  return `${envPhrase}. ${description}`;
}

/**
 * Generate a complete narrative passage in the template style
 */
export function generateTemplatedNarrative(
  input: {
    phase: 'opening' | 'rising' | 'peak' | 'falling' | 'closing';
    tone: EmotionalTone;
    content: string;
  },
  style: TemplateStyle
): string {
  const vocab = TEMPLATE_VOCABULARIES[style];
  const transition = pickRandom(vocab.transitions[input.phase]);
  const toneLabel = vocab.toneLabels[input.tone];

  return `${transition}\n\nThe ${toneLabel.toLowerCase()} quality of this time shapes everything. ${input.content}`;
}

// ============================================================================
// CHINESE LABELS
// ============================================================================

export const TEMPLATE_CHINESE: Record<TemplateStyle, string> = {
  mythic: '神话体',
  romantic: '浪漫体',
  psychological: '心理体',
  cinematic: '电影体',
  poetic: '诗意体'
};

export const TEMPLATE_DESCRIPTIONS_CHINESE: Record<TemplateStyle, string> = {
  mythic: '关系是一场宇宙之旅，每个时间窗口都是试炼，每个触发事件都是门户。',
  romantic: '关系是一个爱情故事，时间窗口是情感季节，事件是心灵转折。',
  psychological: '关系是内心模式的镜子，时间窗口揭示依恋动态，事件激活阴影材料。',
  cinematic: '关系是一部电影，时间窗口是场景，事件是情节转折，情感弧线是配乐。',
  poetic: '关系是一首活的诗，时间窗口是诗节，事件是隐喻，情感弧线是意象的流动。'
};
