/**
 * journeyJournalingEngine.js
 * ==========================
 *
 * Reflection storage and retrieval for the Pilgrim Journey.
 * Part of the Liz Greene Cathedral - Phase 2: Transformative Journey
 *
 * Features:
 * - Chamber reflection storage
 * - Journey progress tracking
 * - Luna commentary on reflections
 * - Pattern recognition across reflections
 * - Export for therapeutic use
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// JOURNAL ENTRY STRUCTURE
// =============================================================================

/**
 * Create a new journal entry
 */
export function createJournalEntry({
  userId,
  chamberId,
  chamberName,
  prompt,
  reflection,
  emotionalState = null,
  insights = [],
  saturnPhase = null,
  transitContext = null
}) {
  return {
    id: generateEntryId(),
    userId,
    chamberId,
    chamberName,
    prompt,
    reflection,
    emotionalState,
    insights,
    saturnPhase,
    transitContext,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lunaResponse: null,
    tags: extractTags(reflection),
    wordCount: reflection?.split(/\s+/).length || 0
  };
}

/**
 * Generate unique entry ID
 */
function generateEntryId() {
  return `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract tags from reflection text
 */
function extractTags(text) {
  if (!text) return [];

  const emotionalKeywords = {
    fear: ['fear', 'afraid', 'scared', 'anxious', 'worry', 'terrified'],
    anger: ['anger', 'angry', 'frustrated', 'rage', 'annoyed', 'irritated'],
    sadness: ['sad', 'grief', 'loss', 'mourning', 'depressed', 'lonely'],
    joy: ['joy', 'happy', 'grateful', 'excited', 'love', 'peaceful'],
    confusion: ['confused', 'lost', 'uncertain', 'unsure', 'unclear'],
    insight: ['realize', 'understand', 'see now', 'clarity', 'aware']
  };

  const tags = [];
  const lowerText = text.toLowerCase();

  for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      tags.push(emotion);
    }
  }

  return tags;
}

// =============================================================================
// CHAMBER PROMPTS
// =============================================================================

export const CHAMBER_PROMPTS = {
  egoFormation: {
    chamberId: 'egoFormation',
    name: 'The Chamber of Ego Formation',
    prompts: [
      'Who did you believe you needed to become in order to survive childhood?',
      'What mask did you create to be loved? What did that mask cost you?',
      'If you could speak to your childhood self, what would you want them to know?',
      'What part of your authentic self did you hide to fit in?'
    ],
    lunaGuidance: 'This chamber holds the memories of who you pretended to be before you knew who you actually were.',
    saturnConnection: 'Saturn reveals the structures we built for survival. Some served us. Some imprisoned us.'
  },

  shadowMeeting: {
    chamberId: 'shadowMeeting',
    name: 'The Chamber of Shadow Meeting',
    prompts: [
      'What quality in others irritates you most? Where might this live in you?',
      'What do you criticize in yourself that you were once criticized for?',
      'If your shadow could speak, what would it say it needs from you?',
      'What have you pushed away that might actually contain a gift?'
    ],
    lunaGuidance: 'The shadow is not the enemy. It is the unlived self, waiting for acknowledgment.',
    saturnConnection: 'Saturn asks us to integrate what we have denied. The shadow becomes a teacher when faced.'
  },

  animaAnimus: {
    chamberId: 'animaAnimus',
    name: 'The Chamber of Anima/Animus',
    prompts: [
      'What qualities do you most seek in a partner that you have not developed in yourself?',
      'How has your inner masculine or feminine been wounded?',
      'What would wholeness within yourself look like?',
      'Where do you project your soul onto others instead of owning it?'
    ],
    lunaGuidance: 'The inner beloved is not found in another. It awakens when we stop searching and start embodying.',
    saturnConnection: 'Saturn teaches us that true partnership begins within. We cannot receive what we will not become.'
  },

  woundedHealer: {
    chamberId: 'woundedHealer',
    name: 'The Chamber of the Wounded Healer',
    prompts: [
      'What wound do you carry that, once healed, could help others?',
      'How has your suffering taught you compassion?',
      'What do you now understand because of what hurt you?',
      'If your wound had a gift to offer, what would it be?'
    ],
    lunaGuidance: 'Chiron teaches that our deepest wound becomes our greatest medicine—but only when we stop hiding it.',
    saturnConnection: 'Saturn structures our healing journey. The wound that is faced becomes wisdom that is built upon.'
  },

  saturnInitiation: {
    chamberId: 'saturnInitiation',
    name: 'The Chamber of Saturn Initiation',
    prompts: [
      'What have you been avoiding that life keeps bringing back to you?',
      'What would it mean to fully grow up in this area of your life?',
      'What responsibility have you been refusing that would actually set you free?',
      'Where do you need to become your own authority?'
    ],
    lunaGuidance: 'Saturn does not punish. Saturn reveals what was never solid. The initiation is the gift.',
    saturnConnection: 'This is Saturn\'s domain. Here we face the fear and find the foundation.'
  },

  midlifeDescend: {
    chamberId: 'midlifeDescend',
    name: 'The Chamber of Midlife Descent',
    prompts: [
      'What dreams did you abandon that still call to you?',
      'Who did you become that you never meant to be?',
      'What must die in you for what is truly alive to emerge?',
      'If you had five years left, what would you finally do?'
    ],
    lunaGuidance: 'The descent is not failure. It is the only path to the treasure buried in the depths.',
    saturnConnection: 'Saturn opposition marks the turning point. What we built in the first half is tested. What remains is real.'
  },

  transcendentFunction: {
    chamberId: 'transcendentFunction',
    name: 'The Chamber of Transcendent Function',
    prompts: [
      'What opposites within you have been at war?',
      'What would it look like for these opposites to dance instead of fight?',
      'What new possibility emerges when you hold both truths?',
      'Where might "and" replace "or" in your inner conflict?'
    ],
    lunaGuidance: 'The transcendent function is not compromise. It is the creative third that emerges when opposites meet.',
    saturnConnection: 'Saturn demands we stop splitting. Integration is the mature response to inner conflict.'
  },

  selfRealization: {
    chamberId: 'selfRealization',
    name: 'The Chamber of Self-Realization',
    prompts: [
      'If all your masks fell away, who would remain?',
      'What has this journey revealed about your true nature?',
      'What gift do you have to offer the world that only you can give?',
      'What does it mean to be fully, unapologetically yourself?'
    ],
    lunaGuidance: 'The Self is not achieved. It is remembered. It was always there, waiting.',
    saturnConnection: 'Saturn\'s final gift is authority—not over others, but over yourself. This is mastery.'
  }
};

// =============================================================================
// LUNA RESPONSE GENERATION
// =============================================================================

/**
 * Generate Luna's response to a journal entry
 */
export function generateLunaResponse(entry) {
  const { reflection, tags, chamberId, saturnPhase } = entry;
  const chamber = CHAMBER_PROMPTS[chamberId];

  // Analyze reflection depth
  const depth = analyzeReflectionDepth(reflection);

  // Build Luna's response
  let response = {
    acknowledgment: '',
    insight: '',
    question: '',
    blessing: ''
  };

  // Acknowledgment based on emotional content
  if (tags.includes('fear')) {
    response.acknowledgment = 'I hear the fear in your words. Fear often guards our most precious truths.';
  } else if (tags.includes('sadness')) {
    response.acknowledgment = 'There is grief here. Grief is love with nowhere to go—until we let it flow.';
  } else if (tags.includes('anger')) {
    response.acknowledgment = 'I sense fire here. Anger often protects something tender beneath.';
  } else if (tags.includes('insight')) {
    response.acknowledgment = 'Something is opening. This clarity has been waiting for you.';
  } else {
    response.acknowledgment = 'Thank you for bringing these words into the light.';
  }

  // Insight based on chamber
  response.insight = chamber?.lunaGuidance ||
    'Every reflection is a step toward wholeness. You are doing the work.';

  // Follow-up question based on depth
  if (depth < 30) {
    response.question = 'Can you say more? What might be hiding beneath the surface of these words?';
  } else if (depth < 60) {
    response.question = 'You\'re going deeper. What feeling arises when you read what you\'ve written?';
  } else {
    response.question = 'You\'ve touched something real. What does this understanding ask of you now?';
  }

  // Blessing based on Saturn phase
  if (saturnPhase === 'return-approaching') {
    response.blessing = 'The Return is near. May these reflections prepare your foundation.';
  } else if (saturnPhase === 'post-return') {
    response.blessing = 'You are building anew. May these words become mortar for what you create.';
  } else {
    response.blessing = 'May this reflection be a stone in the path of your becoming.';
  }

  return response;
}

/**
 * Analyze depth of reflection (0-100)
 */
function analyzeReflectionDepth(text) {
  if (!text) return 0;

  let score = 0;

  // Length factor (longer often = deeper)
  const words = text.split(/\s+/).length;
  score += Math.min(30, words / 5);

  // Emotional language
  const emotionalWords = ['feel', 'sense', 'realize', 'understand', 'remember', 'afraid', 'angry', 'sad', 'love', 'hope'];
  emotionalWords.forEach(word => {
    if (text.toLowerCase().includes(word)) score += 5;
  });

  // First person
  const firstPerson = (text.match(/\bI\b/g) || []).length;
  score += Math.min(15, firstPerson * 3);

  // Questions (self-inquiry)
  const questions = (text.match(/\?/g) || []).length;
  score += questions * 5;

  // Insight markers
  const insightMarkers = ['now I see', 'I realize', 'I understand', 'it\'s clear', 'I notice'];
  insightMarkers.forEach(marker => {
    if (text.toLowerCase().includes(marker)) score += 10;
  });

  return Math.min(100, score);
}

// =============================================================================
// JOURNEY PROGRESS TRACKING
// =============================================================================

/**
 * Calculate journey progress from entries
 */
export function calculateJourneyProgress(entries) {
  const chambers = Object.keys(CHAMBER_PROMPTS);
  const completedChambers = new Set();
  const chamberProgress = {};

  // Initialize all chambers
  chambers.forEach(chamber => {
    chamberProgress[chamber] = {
      entryCount: 0,
      totalWords: 0,
      averageDepth: 0,
      lastEntry: null,
      isComplete: false
    };
  });

  // Process entries
  entries.forEach(entry => {
    const chamber = chamberProgress[entry.chamberId];
    if (chamber) {
      chamber.entryCount++;
      chamber.totalWords += entry.wordCount || 0;
      chamber.lastEntry = entry.createdAt;

      // Consider chamber "complete" after 3 entries or 500+ words
      if (chamber.entryCount >= 3 || chamber.totalWords >= 500) {
        chamber.isComplete = true;
        completedChambers.add(entry.chamberId);
      }
    }
  });

  return {
    totalEntries: entries.length,
    totalWords: entries.reduce((sum, e) => sum + (e.wordCount || 0), 0),
    chambersVisited: new Set(entries.map(e => e.chamberId)).size,
    chambersCompleted: completedChambers.size,
    percentComplete: Math.round((completedChambers.size / chambers.length) * 100),
    chamberProgress,
    currentChamber: entries.length > 0 ? entries[entries.length - 1].chamberId : chambers[0]
  };
}

// =============================================================================
// PATTERN RECOGNITION
// =============================================================================

/**
 * Recognize patterns across journal entries
 */
export function recognizePatterns(entries) {
  if (entries.length < 3) {
    return { patterns: [], needsMoreData: true };
  }

  const patterns = [];

  // Emotional patterns
  const emotionCounts = {};
  entries.forEach(entry => {
    entry.tags?.forEach(tag => {
      emotionCounts[tag] = (emotionCounts[tag] || 0) + 1;
    });
  });

  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0];

  if (dominantEmotion && dominantEmotion[1] >= 3) {
    patterns.push({
      type: 'dominant_emotion',
      emotion: dominantEmotion[0],
      frequency: dominantEmotion[1],
      insight: getEmotionInsight(dominantEmotion[0])
    });
  }

  // Theme patterns (chambers most visited)
  const chamberCounts = {};
  entries.forEach(entry => {
    chamberCounts[entry.chamberId] = (chamberCounts[entry.chamberId] || 0) + 1;
  });

  const mostVisited = Object.entries(chamberCounts)
    .sort((a, b) => b[1] - a[1])[0];

  if (mostVisited && mostVisited[1] >= 2) {
    patterns.push({
      type: 'chamber_focus',
      chamber: mostVisited[0],
      visits: mostVisited[1],
      insight: getChamberFocusInsight(mostVisited[0])
    });
  }

  // Word frequency (excluding common words)
  const allWords = entries.map(e => e.reflection || '').join(' ').toLowerCase();
  const wordFreq = {};
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'for', 'on', 'with', 'that', 'this', 'it', 'i', 'my', 'me'];

  allWords.split(/\s+/).forEach(word => {
    const clean = word.replace(/[^\w]/g, '');
    if (clean.length > 3 && !stopWords.includes(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  const significantWords = Object.entries(wordFreq)
    .filter(([word, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (significantWords.length > 0) {
    patterns.push({
      type: 'recurring_themes',
      words: significantWords.map(([word, count]) => ({ word, count })),
      insight: 'These words appear frequently in your reflections. They may point to core themes in your journey.'
    });
  }

  return {
    patterns,
    needsMoreData: false,
    summary: generatePatternSummary(patterns)
  };
}

/**
 * Get insight for dominant emotion
 */
function getEmotionInsight(emotion) {
  const insights = {
    fear: 'Fear appears frequently in your reflections. This is often the guardian of our most important growth edges.',
    anger: 'Anger is a recurring theme. It often signals where boundaries have been crossed or needs have been unmet.',
    sadness: 'Grief weaves through your journey. This is sacred work—honoring what has been lost.',
    joy: 'Joy appears often. This suggests you are connecting with what truly matters to you.',
    confusion: 'Uncertainty is present. This often precedes breakthrough—the old map no longer works.',
    insight: 'You are experiencing many moments of clarity. The unconscious is speaking.'
  };
  return insights[emotion] || 'This emotion is significant in your journey.';
}

/**
 * Get insight for chamber focus
 */
function getChamberFocusInsight(chamberId) {
  const chamber = CHAMBER_PROMPTS[chamberId];
  return chamber
    ? `You are drawn repeatedly to ${chamber.name}. This area calls for your attention. ${chamber.saturnConnection}`
    : 'This chamber holds something important for you.';
}

/**
 * Generate pattern summary
 */
function generatePatternSummary(patterns) {
  if (patterns.length === 0) {
    return 'Continue your reflections. Patterns will emerge as you write more.';
  }

  const summaryParts = patterns.map(p => {
    if (p.type === 'dominant_emotion') {
      return `${p.emotion} is a dominant theme`;
    }
    if (p.type === 'chamber_focus') {
      return `you are focused on ${p.chamber}`;
    }
    if (p.type === 'recurring_themes') {
      return `recurring words include ${p.words.slice(0, 3).map(w => w.word).join(', ')}`;
    }
    return '';
  }).filter(Boolean);

  return `In your reflections, ${summaryParts.join('; ')}. These patterns point to where your psyche is working.`;
}

// =============================================================================
// EXPORT FOR THERAPEUTIC USE
// =============================================================================

/**
 * Export journal entries for therapeutic review
 */
export function exportJournalForTherapy(entries, format = 'text') {
  if (format === 'text') {
    let output = '=== PILGRIM JOURNEY JOURNAL ===\n\n';

    const grouped = {};
    entries.forEach(entry => {
      if (!grouped[entry.chamberId]) {
        grouped[entry.chamberId] = [];
      }
      grouped[entry.chamberId].push(entry);
    });

    for (const [chamberId, chamberEntries] of Object.entries(grouped)) {
      const chamber = CHAMBER_PROMPTS[chamberId];
      output += `\n### ${chamber?.name || chamberId} ###\n`;
      output += `${chamber?.lunaGuidance || ''}\n\n`;

      chamberEntries.forEach(entry => {
        output += `--- ${entry.createdAt} ---\n`;
        output += `Prompt: ${entry.prompt}\n\n`;
        output += `Reflection:\n${entry.reflection}\n\n`;
        if (entry.lunaResponse) {
          output += `Luna's Response:\n${entry.lunaResponse.acknowledgment}\n`;
          output += `${entry.lunaResponse.insight}\n\n`;
        }
      });
    }

    return output;
  }

  if (format === 'json') {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      entryCount: entries.length,
      chambers: CHAMBER_PROMPTS,
      entries
    }, null, 2);
  }

  return entries;
}

// =============================================================================
// FIRESTORE SCHEMA (for reference)
// =============================================================================

/**
 * Firestore Collection Schema:
 *
 * users/{userId}/journalEntries/{entryId}
 * {
 *   id: string,
 *   chamberId: string,
 *   chamberName: string,
 *   prompt: string,
 *   reflection: string,
 *   emotionalState: string | null,
 *   insights: string[],
 *   saturnPhase: string | null,
 *   transitContext: object | null,
 *   createdAt: timestamp,
 *   updatedAt: timestamp,
 *   lunaResponse: object | null,
 *   tags: string[],
 *   wordCount: number
 * }
 */

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  createJournalEntry,
  generateLunaResponse,
  calculateJourneyProgress,
  recognizePatterns,
  exportJournalForTherapy,
  CHAMBER_PROMPTS
};
