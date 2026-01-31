/**
 * ============================================================================
 * STORY NARRATIVE ENGINE (叙事生成引擎)
 * ============================================================================
 *
 * Transforms structured chapter data into living narrative.
 * This is where the cathedral becomes a storytelling engine.
 *
 * Supports multiple narrative styles:
 * - Mythic: Archetypal, metaphor-rich
 * - Emotional: Heart-centered, intimate
 * - Poetic: Lyrical, evocative
 * - Practical: Clear, actionable
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ChapterArc,
  EmotionalTone,
  NarrativeStyle,
  OverallArc,
  StoryBeat,
  StoryChapter
} from './storyTypes';

import { NARRATIVE_STYLES } from './storyTypes';
import { ARC_CHINESE } from './storyChapters';
import { TONE_CHINESE } from './storyBeats';

// ============================================================================
// NARRATIVE TEMPLATES
// ============================================================================

/**
 * Chapter opening templates by arc type
 */
const CHAPTER_OPENINGS: Record<ChapterArc, Record<string, string[]>> = {
  awakening: {
    mythic: [
      'Like the first stirring of consciousness at dawn, something new emerges.',
      'The mists part, and a path begins to reveal itself.',
      'In the silence before the first word, potential gathers.'
    ],
    emotional: [
      'You sense something shifting, something opening within.',
      'A quiet knowing begins to surface in your heart.',
      'There is a freshness to this moment, a feeling of beginning.'
    ],
    poetic: [
      'Dawn breaks. The world holds its breath.',
      'Seeds stir beneath winter\'s ending grip.',
      'First light touches what was hidden.'
    ],
    practical: [
      'A new phase begins with fresh opportunities.',
      'This period marks the start of significant changes.',
      'New possibilities are emerging now.'
    ]
  },
  deepening: {
    mythic: [
      'The roots grow deeper, drawing from ancient wells.',
      'What began as spark now becomes flame.',
      'The journey descends into richer territory.'
    ],
    emotional: [
      'You feel the connection growing stronger, more real.',
      'Something profound is taking hold in your heart.',
      'The bond deepens with each shared moment.'
    ],
    poetic: [
      'Roots intertwine beneath the surface.',
      'The well deepens. Waters grow still.',
      'What was surface now becomes depth.'
    ],
    practical: [
      'The foundation strengthens during this period.',
      'Growth continues at a steady, sustainable pace.',
      'This is a time for building lasting structures.'
    ]
  },
  challenge: {
    mythic: [
      'The hero meets the threshold guardian.',
      'Fire tests what wishes to become gold.',
      'The storm arrives to reveal true foundations.'
    ],
    emotional: [
      'You may feel tested, uncertain, vulnerable.',
      'This is not punishment but invitation to grow.',
      'What challenges you also shapes you.'
    ],
    poetic: [
      'Storm clouds gather. Lightning speaks.',
      'The crucible heats. Metal remembers fire.',
      'Wind bends the tree to find its strength.'
    ],
    practical: [
      'Challenges arise that require attention and effort.',
      'This period tests your commitment and resilience.',
      'Obstacles appear, but they carry lessons.'
    ]
  },
  turningPoint: {
    mythic: [
      'At the crossroads, the path divides.',
      'The wheel turns, and a new direction emerges.',
      'What was before cannot be what comes after.'
    ],
    emotional: [
      'You stand at a threshold, feeling the weight of choice.',
      'Something fundamental is shifting within and around you.',
      'This moment asks you to choose who you will become.'
    ],
    poetic: [
      'The hinge of fate swings open.',
      'Crossroads. Midnight. Choice.',
      'What was certain dissolves into possibility.'
    ],
    practical: [
      'A significant turning point arrives.',
      'Decisions made now will shape what follows.',
      'This is a pivotal moment requiring clear choices.'
    ]
  },
  renewal: {
    mythic: [
      'Phoenix rises from the ashes of what was.',
      'Spring returns to land that knew only winter.',
      'The wound becomes the well of healing.'
    ],
    emotional: [
      'You feel life returning to places that were dormant.',
      'Hope stirs again, gentle but unmistakable.',
      'Healing moves through you like spring water.'
    ],
    poetic: [
      'Rain falls on parched earth. Seeds remember.',
      'The broken bowl is mended with gold.',
      'After winter\'s silence, the first bird sings.'
    ],
    practical: [
      'Recovery and renewal characterize this period.',
      'Energy returns after a challenging phase.',
      'Fresh starts become possible now.'
    ]
  },
  maturation: {
    mythic: [
      'The fruit ripens on the branch, heavy with sweetness.',
      'Wisdom settles like sediment in still water.',
      'What was student becomes teacher.'
    ],
    emotional: [
      'You feel a new groundedness, a quiet confidence.',
      'The lessons have taken root and bear fruit.',
      'There is wisdom here that you have earned.'
    ],
    poetic: [
      'Autumn light. Harvest time.',
      'The oak remembers being acorn, smiles.',
      'Years become rings, rings become strength.'
    ],
    practical: [
      'Maturity and wisdom characterize this phase.',
      'Past lessons now yield practical benefits.',
      'Experience translates into capability.'
    ]
  },
  expansion: {
    mythic: [
      'The horizon stretches beyond what was known.',
      'Wings unfurl, catching winds of possibility.',
      'The kingdom grows beyond its former borders.'
    ],
    emotional: [
      'You feel your world expanding, breathing deeper.',
      'Possibilities you couldn\'t imagine now feel within reach.',
      'Joy arrives in unexpected abundance.'
    ],
    poetic: [
      'Horizons widen. The sky has no edge.',
      'Wings spread. The thermal rises.',
      'What was a room becomes a world.'
    ],
    practical: [
      'Growth and expansion accelerate.',
      'Opportunities multiply during this period.',
      'This is a time for ambitious moves.'
    ]
  },
  integration: {
    mythic: [
      'The threads weave together into a greater tapestry.',
      'What was scattered now finds its pattern.',
      'The alchemist combines the elements.'
    ],
    emotional: [
      'You feel pieces coming together inside you.',
      'What was fragmented now finds wholeness.',
      'A deep sense of coherence emerges.'
    ],
    poetic: [
      'Rivers merge. The sea accepts all.',
      'Threads become cloth. Cloth becomes shelter.',
      'Many become one. One holds many.'
    ],
    practical: [
      'This is a time of synthesis and integration.',
      'Different aspects of life come into alignment.',
      'Consolidation strengthens your position.'
    ]
  },
  resolution: {
    mythic: [
      'The circle completes its revolution.',
      'The hero returns, transformed, carrying the elixir.',
      'What began in question ends in knowing.'
    ],
    emotional: [
      'You feel a sense of completion, of arrival.',
      'The journey reaches a resting place.',
      'Gratitude and peace fill the spaces between breaths.'
    ],
    poetic: [
      'Full circle. Home again, yet changed.',
      'The story closes. The teller smiles.',
      'End becomes beginning becomes end.'
    ],
    practical: [
      'Resolution and completion characterize this period.',
      'Goals reach their conclusion.',
      'This chapter of the journey comes to a close.'
    ]
  }
};

/**
 * Emotional tone descriptions
 */
const TONE_NARRATIVES: Record<EmotionalTone, Record<string, string>> = {
  hopeful: {
    mythic: 'Light gathers on the horizon, promising what is to come.',
    emotional: 'Hope rises in your heart like the morning sun.',
    poetic: 'Seeds beneath snow, dreaming of spring.',
    practical: 'Optimism is warranted during this time.'
  },
  joyful: {
    mythic: 'The cup overflows with the wine of celebration.',
    emotional: 'Joy fills you, warm and bright.',
    poetic: 'Laughter echoes. The heart dances.',
    practical: 'This is a genuinely positive period.'
  },
  passionate: {
    mythic: 'Fire burns bright in the heart of the forge.',
    emotional: 'Passion moves through you, alive and urgent.',
    poetic: 'Flames leap. Hearts race. Life burns.',
    practical: 'Energy and enthusiasm run high.'
  },
  tender: {
    mythic: 'The softest touch moves the deepest waters.',
    emotional: 'Tenderness opens you to what is most true.',
    poetic: 'Gentle rain. Soft hands. Quiet love.',
    practical: 'Gentleness and care mark this period.'
  },
  reflective: {
    mythic: 'The still pool reflects heaven\'s face.',
    emotional: 'You turn inward, seeking understanding.',
    poetic: 'Mirror lake. Moon watching moon.',
    practical: 'This is a time for reflection and contemplation.'
  },
  challenging: {
    mythic: 'The mountain does not move for the traveler.',
    emotional: 'You feel tested, but not abandoned.',
    poetic: 'Storm winds. Bent but unbroken.',
    practical: 'Challenges require effort and attention.'
  },
  transformative: {
    mythic: 'The caterpillar dissolves to become butterfly.',
    emotional: 'You are becoming someone new.',
    poetic: 'Chrysalis. Darkness. Wings forming.',
    practical: 'Significant personal change is underway.'
  },
  peaceful: {
    mythic: 'The sage rests in the garden of completion.',
    emotional: 'Peace settles into your bones.',
    poetic: 'Still water. Quiet sky. Full breath.',
    practical: 'Calm and stability characterize this time.'
  },
  bittersweet: {
    mythic: 'The autumn leaf knows both beauty and falling.',
    emotional: 'Joy and sorrow hold hands in your heart.',
    poetic: 'Sweet rain. Salt tears. Both are water.',
    practical: 'Mixed feelings accompany this period.'
  },
  triumphant: {
    mythic: 'The hero stands in the light of victory.',
    emotional: 'You have overcome, and the victory is sweet.',
    poetic: 'Summit reached. Flag planted. View earned.',
    practical: 'Success and achievement mark this time.'
  }
};

// ============================================================================
// NARRATIVE GENERATORS
// ============================================================================

/**
 * Get narrative style configuration
 */
function getStyleConfig(styleName: string): NarrativeStyle {
  return NARRATIVE_STYLES[styleName] || NARRATIVE_STYLES.mythic;
}

/**
 * Generate chapter opening
 */
function generateChapterOpening(
  arc: ChapterArc,
  style: NarrativeStyle
): string {
  const openings = CHAPTER_OPENINGS[arc][style.name];
  // Select based on randomness or could be deterministic
  return openings[0];
}

/**
 * Generate beat narrative
 */
function generateBeatNarrative(
  beat: StoryBeat,
  style: NarrativeStyle
): string {
  const toneNarrative = TONE_NARRATIVES[beat.emotionalTone][style.name];

  let narrative = toneNarrative;

  // Add intensity modifier
  if (beat.intensity >= 80) {
    narrative += style.name === 'mythic'
      ? ' The energies converge with exceptional force.'
      : style.name === 'emotional'
        ? ' You feel this deeply, unmistakably.'
        : style.name === 'poetic'
          ? ' Full tide. Full moon. Full heart.'
          : ' This is a particularly significant period.';
  } else if (beat.intensity <= 30) {
    narrative += style.name === 'mythic'
      ? ' The currents run quiet, asking for patience.'
      : style.name === 'emotional'
        ? ' Go gently here, with extra care.'
        : style.name === 'poetic'
          ? ' Whispers. Waiting. Patience.'
          : ' Proceed with caution and patience.';
  }

  return narrative;
}

/**
 * Generate chapter body narrative
 */
function generateChapterBody(
  beats: StoryBeat[],
  style: NarrativeStyle
): string {
  const parts: string[] = [];

  // Add beat narratives with transitions
  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];

    // Add transition if not first beat
    if (i > 0) {
      const transition = getTransition(beats[i - 1], beat, style);
      parts.push(transition);
    }

    // Add beat narrative
    parts.push(generateBeatNarrative(beat, style));
  }

  return parts.join(' ');
}

/**
 * Get transition between beats
 */
function getTransition(
  from: StoryBeat,
  to: StoryBeat,
  style: NarrativeStyle
): string {
  // Intensity change determines transition type
  const intensityChange = to.intensity - from.intensity;

  if (intensityChange > 15) {
    return style.name === 'mythic'
      ? 'The tide rises.'
      : style.name === 'emotional'
        ? 'And then, something shifts.'
        : style.name === 'poetic'
          ? 'Rising.'
          : 'Energy increases.';
  }

  if (intensityChange < -15) {
    return style.name === 'mythic'
      ? 'The wave crests and begins its descent.'
      : style.name === 'emotional'
        ? 'Gradually, things settle.'
        : style.name === 'poetic'
          ? 'Falling.'
          : 'Activity decreases.';
  }

  return style.name === 'mythic'
    ? 'The journey continues.'
    : style.name === 'emotional'
      ? 'And so it continues.'
      : style.name === 'poetic'
        ? 'Onward.'
        : 'The period progresses.';
}

/**
 * Generate chapter closing
 */
function generateChapterClosing(
  arc: ChapterArc,
  emotionalShift: { from: EmotionalTone; to: EmotionalTone },
  style: NarrativeStyle
): string {
  const toToneNarrative = TONE_NARRATIVES[emotionalShift.to][style.name];

  return style.name === 'mythic'
    ? `As this chapter closes, ${toToneNarrative.toLowerCase()}`
    : style.name === 'emotional'
      ? `By the end, ${toToneNarrative.toLowerCase()}`
      : style.name === 'poetic'
        ? `Ending: ${toToneNarrative}`
        : `The period concludes with ${toToneNarrative.toLowerCase()}`;
}

// ============================================================================
// MAIN CHAPTER NARRATIVE WRITER
// ============================================================================

/**
 * Write complete chapter narrative
 */
export function writeChapterNarrative(
  chapter: StoryChapter,
  styleName: string = 'mythic'
): { en: string; zh: string } {
  const style = getStyleConfig(styleName);

  // Generate English narrative
  const opening = generateChapterOpening(chapter.chapterArc, style);
  const body = generateChapterBody(chapter.beats, style);
  const closing = generateChapterClosing(chapter.chapterArc, chapter.emotionalShift, style);

  const narrative = `${opening}\n\n${body}\n\n${closing}`;

  // Generate Chinese narrative (simplified version)
  const zhOpening = `${ARC_CHINESE[chapter.chapterArc]}的篇章开启。`;
  const zhTone = TONE_CHINESE[chapter.emotionalShift.to];
  const zhClosing = `章节以${zhTone}的情调收尾。`;

  const narrativeChinese = `${zhOpening}${chapter.emotionalShift.descriptionChinese}${zhClosing}`;

  return { en: narrative, zh: narrativeChinese };
}

// ============================================================================
// OVERALL ARC NARRATIVES
// ============================================================================

/**
 * Overall arc descriptions
 */
const OVERALL_ARC_DESCRIPTIONS: Record<OverallArc, { en: string; zh: string }> = {
  heroJourney: {
    en: 'The Hero\'s Journey',
    zh: '英雄之旅'
  },
  loveStory: {
    en: 'A Love Story',
    zh: '爱情故事'
  },
  redemption: {
    en: 'A Tale of Redemption',
    zh: '救赎之旅'
  },
  coming_of_age: {
    en: 'Coming of Age',
    zh: '成长故事'
  },
  odyssey: {
    en: 'The Odyssey',
    zh: '奥德赛'
  },
  phoenix: {
    en: 'The Phoenix Rising',
    zh: '凤凰涅槃'
  },
  steadyClimb: {
    en: 'The Steady Climb',
    zh: '稳步攀升'
  },
  wavePattern: {
    en: 'Waves of Change',
    zh: '变化的波浪'
  },
  spiral: {
    en: 'The Spiral Path',
    zh: '螺旋之路'
  }
};

/**
 * Generate prologue based on overall arc
 */
export function generatePrologue(
  arc: OverallArc,
  themes: string[],
  styleName: string = 'mythic'
): { en: string; zh: string } {
  const arcDesc = OVERALL_ARC_DESCRIPTIONS[arc];
  const style = getStyleConfig(styleName);

  let prologue = '';
  let prologueChinese = '';

  if (style.name === 'mythic') {
    prologue = `This is ${arcDesc.en.toLowerCase()}—a journey through ${themes.slice(0, 3).join(', ')}. What follows is not mere prediction, but a map of the soul's terrain, drawn from the patterns written in time itself.`;
    prologueChinese = `这是一个${arcDesc.zh}——穿越${themes.slice(0, 3).join('、')}的旅程。以下不仅仅是预测，而是灵魂地形的地图，从时间本身书写的模式中绘制而成。`;
  } else if (style.name === 'emotional') {
    prologue = `Your story is ${arcDesc.en.toLowerCase()}. The chapters ahead will take you through ${themes.slice(0, 3).join(', ')}. This is your map, written in the language of stars and seasons.`;
    prologueChinese = `你的故事是${arcDesc.zh}。前方的篇章将带你穿越${themes.slice(0, 3).join('、')}。这是你的地图，用星辰与季节的语言书写。`;
  } else if (style.name === 'poetic') {
    prologue = `${arcDesc.en}.\n${themes.slice(0, 3).join('. ')}.\nThe story waits to be lived.`;
    prologueChinese = `${arcDesc.zh}。\n${themes.slice(0, 3).join('。')}。\n故事等待被活出。`;
  } else {
    prologue = `This forecast follows the pattern of ${arcDesc.en.toLowerCase()}, with major themes of ${themes.slice(0, 3).join(', ')}.`;
    prologueChinese = `此预测遵循${arcDesc.zh}的模式，主要主题包括${themes.slice(0, 3).join('、')}。`;
  }

  return { en: prologue, zh: prologueChinese };
}

/**
 * Generate epilogue based on final chapter
 */
export function generateEpilogue(
  finalChapter: StoryChapter,
  arc: OverallArc,
  styleName: string = 'mythic'
): { en: string; zh: string } {
  const style = getStyleConfig(styleName);
  const finalTone = finalChapter.emotionalShift.to;

  let epilogue = '';
  let epilogueChinese = '';

  if (style.name === 'mythic') {
    epilogue = `And so the story arrives at its current horizon. The ${OVERALL_ARC_DESCRIPTIONS[arc].en.toLowerCase()} continues beyond what can be seen, carrying forward the essence of ${finalTone}. What was seed becomes fruit. What was question becomes knowing. The journey goes on.`;
    epilogueChinese = `故事到达当前的地平线。${OVERALL_ARC_DESCRIPTIONS[arc].zh}继续向前，携带着${TONE_CHINESE[finalTone]}的本质。种子成果。疑问成知。旅程继续。`;
  } else if (style.name === 'emotional') {
    epilogue = `As you look toward what comes next, carry with you the ${finalTone} that this chapter has cultivated. Your story is still being written, and you hold the pen.`;
    epilogueChinese = `当你展望未来时，带上这一章节培养的${TONE_CHINESE[finalTone]}。你的故事仍在书写中，笔在你手中。`;
  } else if (style.name === 'poetic') {
    epilogue = `The page turns.\nThe ${finalTone} remains.\nTo be continued.`;
    epilogueChinese = `翻页。\n${TONE_CHINESE[finalTone]}留存。\n未完待续。`;
  } else {
    epilogue = `The forecast period concludes with ${finalTone} energy. Future developments will build upon this foundation.`;
    epilogueChinese = `预测期以${TONE_CHINESE[finalTone]}的能量结束。未来的发展将建立在此基础之上。`;
  }

  return { en: epilogue, zh: epilogueChinese };
}

/**
 * Generate story title
 */
export function generateStoryTitle(
  arc: OverallArc,
  themes: string[]
): { en: string; zh: string } {
  const arcDesc = OVERALL_ARC_DESCRIPTIONS[arc];
  const primaryTheme = themes[0] || 'destiny';

  return {
    en: `${arcDesc.en}: A Journey of ${primaryTheme.charAt(0).toUpperCase() + primaryTheme.slice(1)}`,
    zh: `${arcDesc.zh}：${primaryTheme}之旅`
  };
}
