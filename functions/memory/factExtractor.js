/**
 * Fact Extraction Engine for Brain 1B
 *
 * Extracts important facts from Brain 3 (text) and Brain 5 (audio)
 * in real-time, storing them in Brain 1B for later consolidation.
 *
 * The Person-Tie Rule: If a fact involves a PERSON or the USER'S LIFE,
 * it matters and should be extracted.
 *
 * Part of GENESIS 8-Brain Memory Architecture v3.0
 * Created: January 5, 2026
 */

// ============================================
// PATTERN DEFINITIONS
// ============================================

/**
 * Patterns that indicate life structure facts
 * These are ALWAYS extracted to Brain 1B
 */
const LIFE_STRUCTURE_PATTERNS = [
  // Employment
  { pattern: /\b(?:I|i)\s+(?:work|worked)\s+(?:at|for|with)\s+(.+?)(?:\.|,|$)/i, type: 'employment', extract: 'organization' },
  { pattern: /\b(?:my|My)\s+(?:job|work|career)\s+(?:is|at)\s+(.+?)(?:\.|,|$)/i, type: 'employment', extract: 'role' },
  { pattern: /\b(?:I'm|I am|i'm|i am)\s+(?:a|an)\s+([\w\s]+?)(?:\s+at|\s+for|\.|,|$)/i, type: 'profession', extract: 'role' },

  // Education
  { pattern: /\b(?:I|i)\s+(?:went|go|graduated)\s+(?:to|from)\s+(.+?)(?:\s+school|\s+university|\s+college|\.|,|$)/i, type: 'education', extract: 'school' },
  { pattern: /\b(?:I|i)\s+(?:studied|study|majored)\s+(?:in\s+)?(.+?)(?:\s+at|\.|,|$)/i, type: 'education', extract: 'field' },
  { pattern: /\b(?:my|My)\s+(?:school|university|college)\s+(?:is|was)\s+(.+?)(?:\.|,|$)/i, type: 'education', extract: 'school' },

  // Residence
  { pattern: /\b(?:I|i)\s+(?:live|lived|stay|moved)\s+(?:in|to|at)\s+(.+?)(?:\.|,|$)/i, type: 'residence', extract: 'location' },
  { pattern: /\b(?:I'm|I am)\s+(?:from|based in)\s+(.+?)(?:\.|,|$)/i, type: 'origin', extract: 'location' },

  // Family structure
  { pattern: /\b(?:I|i)\s+have\s+(\d+|a|an|one|two|three|four|five)\s+(daughter|son|kid|child|brother|sister|sibling)s?/i, type: 'family', extract: 'count_relation' },
  { pattern: /\b(?:my|My)\s+(wife|husband|spouse|partner|girlfriend|boyfriend|fiancé|fiancée)\s+(?:is\s+)?(\w+)?/i, type: 'partner', extract: 'relation_name' },
  { pattern: /\b(?:my|My)\s+(mom|mother|dad|father|parent)\s+(?:is|was|'s)\s+(.+?)(?:\.|,|$)/i, type: 'parent', extract: 'relation_info' },

  // Health
  { pattern: /\b(?:I'm|I am|i'm|i am)\s+allergic\s+to\s+(.+?)(?:\.|,|$)/i, type: 'health_allergy', extract: 'allergen' },
  { pattern: /\b(?:I|i)\s+(?:was|got|am)\s+diagnosed\s+with\s+(.+?)(?:\.|,|$)/i, type: 'health_diagnosis', extract: 'condition' },
  { pattern: /\b(?:I|i)\s+(?:have|had)\s+(diabetes|cancer|anxiety|depression|adhd|autism|asthma)/i, type: 'health_condition', extract: 'condition' },

  // Pets
  { pattern: /\b(?:my|My)\s+(dog|cat|pet|bird|fish|hamster|rabbit)\s+(?:named\s+)?(\w+)?/i, type: 'pet', extract: 'type_name' },
  { pattern: /\b(?:I|i)\s+have\s+(?:a|an)\s+(dog|cat|pet|bird)\s+(?:named\s+)?(\w+)?/i, type: 'pet', extract: 'type_name' },

  // Hobbies/Interests (strong indicators)
  { pattern: /\b(?:I|i)\s+(?:love|really love|enjoy|am passionate about)\s+(.+?)(?:\.|,|$)/i, type: 'passion', extract: 'interest' },
  { pattern: /\b(?:I've|I have)\s+been\s+(?:learning|studying|practicing)\s+(.+?)(?:\s+for|\.|,|$)/i, type: 'learning', extract: 'skill' },
  { pattern: /\b(?:I'm|I am)\s+(?:learning|studying|practicing)\s+(?:to\s+)?(.+?)(?:\.|,|$)/i, type: 'learning', extract: 'skill' },
  { pattern: /\bmy\s+(?:hobby|hobbies)\s+(?:is|are|include)\s+(.+?)(?:\.|,|$)/i, type: 'hobby', extract: 'activity' },
];

/**
 * Relationship action patterns
 * Indicates interaction with a named person
 */
const RELATIONSHIP_ACTION_PATTERNS = [
  // Positive interactions
  { pattern: /\b(?:had|have)\s+(?:lunch|dinner|breakfast|coffee|drinks)\s+with\s+(\w+)/i, sentiment: 'positive', action: 'social_meal' },
  { pattern: /\b(?:went|going)\s+(?:out|to)\s+(?:.+?)\s+with\s+(\w+)/i, sentiment: 'positive', action: 'outing' },
  { pattern: /\b(\w+)\s+(?:helped|helped me|gave me|bought me|sent me)/i, sentiment: 'positive', action: 'received_help' },
  { pattern: /\b(?:talking|talked|spoke|chatting)\s+(?:to|with)\s+(\w+)/i, sentiment: 'neutral', action: 'conversation' },
  { pattern: /\b(?:met|meeting|saw|seeing)\s+(?:with\s+)?(\w+)/i, sentiment: 'neutral', action: 'meeting' },

  // Negative interactions
  { pattern: /\b(?:fought|fighting|argued|arguing)\s+with\s+(\w+)/i, sentiment: 'negative', action: 'conflict' },
  { pattern: /\b(?:angry|mad|upset|frustrated)\s+(?:at|with)\s+(\w+)/i, sentiment: 'negative', action: 'frustration' },
  { pattern: /\b(\w+)\s+(?:upset me|made me angry|annoyed me|hurt me)/i, sentiment: 'negative', action: 'hurt' },

  // Relationship status
  { pattern: /\b(?:broke up|breaking up)\s+with\s+(\w+)/i, sentiment: 'negative', action: 'breakup' },
  { pattern: /\b(?:dating|seeing|with)\s+(\w+)\s+(?:now|for)/i, sentiment: 'positive', action: 'dating' },
  { pattern: /\b(?:married|engaged)\s+(?:to\s+)?(\w+)/i, sentiment: 'positive', action: 'commitment' },
];

/**
 * Words that are NOT proper names (filter these out)
 */
const NOT_NAMES = new Set([
  // Common words that might be capitalized
  'i', 'me', 'my', 'we', 'us', 'you', 'your', 'he', 'she', 'it', 'they', 'them',
  'the', 'a', 'an', 'this', 'that', 'these', 'those',
  'today', 'yesterday', 'tomorrow', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'morning', 'afternoon', 'evening', 'night',
  'work', 'home', 'school', 'office', 'hospital', 'church', 'store', 'mall',
  'good', 'bad', 'great', 'nice', 'fine', 'okay', 'ok',
  'just', 'really', 'very', 'so', 'too', 'also',
  'think', 'know', 'feel', 'want', 'need', 'like', 'love', 'hate',
  'going', 'doing', 'being', 'having', 'getting', 'making',
  'something', 'anything', 'nothing', 'everything', 'someone', 'anyone', 'everyone',
  'here', 'there', 'where', 'when', 'what', 'why', 'how',
  'maybe', 'probably', 'definitely', 'certainly',
  'yes', 'no', 'yeah', 'nope', 'yep',
  'lol', 'haha', 'hmm', 'umm', 'uh', 'oh', 'ah',
  'thanks', 'thank', 'please', 'sorry', 'hello', 'hi', 'hey', 'bye',
  'luna', 'brother', 'sonnet', 'genesis', // System names to ignore
]);

/**
 * Common relationship titles that precede names
 */
const RELATIONSHIP_PREFIXES = [
  'my', 'our', "my friend", "my best friend", "my colleague", "my coworker",
  "my boss", "my manager", "my teacher", "my professor", "my doctor",
  "my therapist", "my coach", "my mentor",
  "my mom", "my mother", "my dad", "my father", "my brother", "my sister",
  "my son", "my daughter", "my wife", "my husband", "my partner",
  "my girlfriend", "my boyfriend", "my fiancé", "my fiancée",
  "my grandma", "my grandmother", "my grandpa", "my grandfather",
  "my aunt", "my uncle", "my cousin", "my nephew", "my niece",
];

// ============================================
// CORE EXTRACTION FUNCTIONS
// ============================================

/**
 * Extract proper names from text using pattern matching
 * @param {string} text - Input text
 * @returns {Array} Array of {name, context, relationship}
 */
function extractProperNames(text) {
  const names = [];
  const words = text.split(/\s+/);

  // Pattern 1: Capitalized words that aren't at sentence start
  const capitalizedPattern = /(?<!\.\s)(?<!^\s*)(?<!:\s*)(?<!\?\s*)(?<!\!\s*)\b([A-Z][a-z]+)\b/g;
  let match;

  while ((match = capitalizedPattern.exec(text)) !== null) {
    const name = match[1].toLowerCase();
    if (!NOT_NAMES.has(name) && name.length > 1) {
      names.push({
        name: match[1],
        position: match.index,
        context: extractContext(text, match.index, match[1].length)
      });
    }
  }

  // Pattern 2: Names after relationship prefixes
  for (const prefix of RELATIONSHIP_PREFIXES) {
    const prefixPattern = new RegExp(`${prefix}\\s+([A-Z][a-z]+)`, 'gi');
    while ((match = prefixPattern.exec(text)) !== null) {
      const name = match[1];
      if (!NOT_NAMES.has(name.toLowerCase()) && name.length > 1) {
        const relationship = prefix.replace('my ', '').replace('our ', '');
        names.push({
          name: name,
          position: match.index,
          relationship: relationship,
          context: extractContext(text, match.index, match[0].length)
        });
      }
    }
  }

  // Pattern 3: Names in relationship action patterns
  for (const pattern of RELATIONSHIP_ACTION_PATTERNS) {
    const regex = new RegExp(pattern.pattern, 'gi');
    while ((match = regex.exec(text)) !== null) {
      const name = match[1];
      if (name && !NOT_NAMES.has(name.toLowerCase()) && /^[A-Z]/.test(name)) {
        names.push({
          name: name,
          position: match.index,
          action: pattern.action,
          sentiment: pattern.sentiment,
          context: match[0]
        });
      }
    }
  }

  // Deduplicate by name
  const uniqueNames = [];
  const seen = new Set();
  for (const item of names) {
    if (!seen.has(item.name.toLowerCase())) {
      seen.add(item.name.toLowerCase());
      uniqueNames.push(item);
    }
  }

  return uniqueNames;
}

/**
 * Extract context around a position in text
 */
function extractContext(text, position, length) {
  const start = Math.max(0, position - 30);
  const end = Math.min(text.length, position + length + 30);
  let context = text.slice(start, end);
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  return context;
}

/**
 * Extract life structure facts from text
 * @param {string} text - Input text
 * @returns {Array} Array of fact objects
 */
function extractLifeStructureFacts(text) {
  const facts = [];

  for (const pattern of LIFE_STRUCTURE_PATTERNS) {
    const match = text.match(pattern.pattern);
    if (match && match[1]) {
      const value = match[1].trim();

      // Skip very short or generic values
      if (value.length < 2 || value.toLowerCase() === 'something') continue;

      const fact = {
        type: pattern.type,
        value: value,
        extractedFrom: pattern.extract,
        context: match[0],
        confidence: 0.8
      };

      // Handle compound extractions (e.g., "2 daughters")
      if (pattern.extract === 'count_relation' && match[2]) {
        fact.count = parseCount(match[1]);
        fact.relation = match[2];
      }

      // Handle name extractions (e.g., "my wife Sarah")
      if (pattern.extract === 'relation_name' && match[2]) {
        fact.relation = match[1];
        fact.name = match[2];
      }

      // Handle pet with name
      if (pattern.extract === 'type_name') {
        fact.petType = match[1];
        if (match[2]) {
          fact.name = match[2];
          fact.confidence = 0.9; // Higher if named
        }
      }

      facts.push(fact);
    }
  }

  return facts;
}

/**
 * Convert word numbers to integers
 */
function parseCount(text) {
  const wordToNum = {
    'a': 1, 'an': 1, 'one': 1, 'two': 2, 'three': 3,
    'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8,
    'nine': 9, 'ten': 10
  };
  const lower = text.toLowerCase();
  return wordToNum[lower] || parseInt(text) || 1;
}

/**
 * Analyze sentiment of text around a name
 */
function analyzeSentiment(context) {
  const positive = ['love', 'great', 'amazing', 'wonderful', 'happy', 'helped', 'thanks', 'grateful', 'excited', 'glad'];
  const negative = ['hate', 'angry', 'upset', 'frustrated', 'annoyed', 'fought', 'argued', 'hurt', 'sad', 'worried'];

  const lower = context.toLowerCase();
  let score = 0;

  for (const word of positive) {
    if (lower.includes(word)) score += 0.2;
  }
  for (const word of negative) {
    if (lower.includes(word)) score -= 0.2;
  }

  if (score > 0.1) return 'positive';
  if (score < -0.1) return 'negative';
  return 'neutral';
}

/**
 * Check if statement should be skipped (transient content)
 */
function isTransientContent(text) {
  const transientPatterns = [
    /^(?:lol|haha|hmm|umm|uh|oh|ah)$/i,
    /^(?:yes|no|yeah|nope|yep|okay|ok)$/i,
    /^(?:hi|hey|hello|bye|goodbye)$/i,
    /^(?:thanks?|thank you|please|sorry)$/i,
    /^it'?s?\s+(?:hot|cold|raining|sunny|nice)\s+(?:today|outside)?$/i,
    /^what\s+time\s+is\s+it\??$/i,
    /^how\s+are\s+you\??$/i,
    /^i'?m?\s+(?:good|fine|okay|tired|hungry|sleepy)$/i,
    /^let\s+me\s+think/i,
    /^i\s+don'?t\s+know$/i,
  ];

  const trimmed = text.trim();

  // Too short
  if (trimmed.length < 5) return true;

  // Matches transient pattern
  for (const pattern of transientPatterns) {
    if (pattern.test(trimmed)) return true;
  }

  return false;
}

// ============================================
// MAIN EXTRACTION FUNCTION
// ============================================

/**
 * Extract all facts from a message
 * This is the main entry point called on each message
 *
 * @param {string} text - The message text
 * @param {string} source - 'brain3' (text) or 'brain5' (audio)
 * @param {Object} metadata - Additional context (userId, timestamp, etc.)
 * @returns {Object} Extraction result with facts array
 */
function extractFacts(text, source = 'brain3', metadata = {}) {
  // Skip transient content
  if (isTransientContent(text)) {
    return {
      extracted: false,
      reason: 'transient_content',
      facts: []
    };
  }

  const facts = [];
  const timestamp = metadata.timestamp || new Date().toISOString();

  // 1. Extract proper names (relationships)
  const names = extractProperNames(text);
  for (const nameInfo of names) {
    facts.push({
      id: generateFactId(),
      category: 'relationship',
      type: nameInfo.relationship || 'person',
      name: nameInfo.name,
      action: nameInfo.action || null,
      sentiment: nameInfo.sentiment || analyzeSentiment(nameInfo.context || text),
      context: nameInfo.context || text,
      source: source,
      timestamp: timestamp,
      confidence: nameInfo.relationship ? 0.9 : 0.7,
      mentions: 1
    });
  }

  // 2. Extract life structure facts
  const lifeFacts = extractLifeStructureFacts(text);
  for (const fact of lifeFacts) {
    facts.push({
      id: generateFactId(),
      category: 'life_structure',
      type: fact.type,
      value: fact.value,
      details: {
        count: fact.count,
        relation: fact.relation,
        name: fact.name,
        petType: fact.petType,
        extractedFrom: fact.extractedFrom
      },
      context: fact.context,
      source: source,
      timestamp: timestamp,
      confidence: fact.confidence,
      mentions: 1
    });
  }

  return {
    extracted: facts.length > 0,
    factCount: facts.length,
    facts: facts,
    originalText: text,
    source: source,
    timestamp: timestamp
  };
}

/**
 * Generate unique fact ID
 */
function generateFactId() {
  return `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// CONSOLIDATION HELPERS
// ============================================

/**
 * Merge multiple facts about the same entity
 * Used during nightly consolidation
 *
 * @param {Array} facts - Array of facts about same entity
 * @returns {Object} Consolidated fact
 */
function consolidateFacts(facts) {
  if (!facts || facts.length === 0) return null;
  if (facts.length === 1) return { ...facts[0], consolidated: true };

  // Group by category and type
  const base = { ...facts[0] };

  // Accumulate mentions
  base.mentions = facts.reduce((sum, f) => sum + (f.mentions || 1), 0);

  // Track sentiment over time
  const sentiments = facts.map(f => f.sentiment).filter(Boolean);
  if (sentiments.length > 0) {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    sentiments.forEach(s => sentimentCounts[s]++);
    base.sentimentHistory = sentimentCounts;
    base.sentiment = Object.entries(sentimentCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  // Calculate confidence based on mentions
  base.confidence = Math.min(0.95, 0.5 + (base.mentions * 0.1));

  // Keep all contexts
  base.contexts = facts.map(f => ({
    text: f.context,
    timestamp: f.timestamp,
    source: f.source
  }));

  // Select best embedding (prefer most recent with embedding)
  const factsWithEmbeddings = facts.filter(f => f.embedding && Array.isArray(f.embedding));
  if (factsWithEmbeddings.length > 0) {
    // Sort by timestamp (most recent first) and take the latest embedding
    const sorted = factsWithEmbeddings.sort((a, b) => {
      const timeA = new Date(a.embeddingUpdatedAt || a.embeddingCreatedAt || a.timestamp || 0);
      const timeB = new Date(b.embeddingUpdatedAt || b.embeddingCreatedAt || b.timestamp || 0);
      return timeB - timeA;
    });
    base.embedding = sorted[0].embedding;
    base.embeddingSource = 'consolidated';
    base.embeddingConsolidatedAt = new Date().toISOString();
  }

  // Mark as consolidated
  base.consolidated = true;
  base.consolidatedAt = new Date().toISOString();
  base.originalFactCount = facts.length;

  return base;
}

/**
 * Calculate promotion score for a fact
 * Used to determine if fact should move to Brain 2
 *
 * @param {Object} fact - The fact to score
 * @param {Object} options - Scoring options
 * @returns {number} Score between 0 and 1
 */
function calculatePromotionScore(fact, options = {}) {
  const weights = {
    frequency: 0.30,
    recency: 0.20,
    emotional: 0.25,
    confidence: 0.25
  };

  // Frequency score (mentions)
  const maxMentions = options.maxMentions || 10;
  const frequencyScore = Math.min(1, (fact.mentions || 1) / maxMentions);

  // Recency score (days since last mention)
  const daysSinceUpdate = options.daysSinceUpdate || 0;
  const recencyScore = Math.max(0, 1 - (daysSinceUpdate / 30));

  // Emotional score (based on sentiment intensity)
  let emotionalScore = 0.5; // neutral default
  if (fact.sentiment === 'positive' || fact.sentiment === 'negative') {
    emotionalScore = 0.8;
  }
  if (fact.sentimentHistory) {
    const total = Object.values(fact.sentimentHistory).reduce((a, b) => a + b, 0);
    const nonNeutral = (fact.sentimentHistory.positive || 0) + (fact.sentimentHistory.negative || 0);
    emotionalScore = total > 0 ? nonNeutral / total : 0.5;
  }

  // Confidence score (from extraction confidence)
  const confidenceScore = fact.confidence || 0.7;

  // Calculate weighted score
  const score =
    (frequencyScore * weights.frequency) +
    (recencyScore * weights.recency) +
    (emotionalScore * weights.emotional) +
    (confidenceScore * weights.confidence);

  return Math.round(score * 100) / 100;
}

/**
 * Determine if a fact should be promoted to Brain 2
 *
 * @param {Object} fact - The fact to evaluate
 * @param {Object} options - Evaluation options
 * @returns {Object} {shouldPromote, score, reason}
 */
function shouldPromoteToBrain2(fact, options = {}) {
  const score = calculatePromotionScore(fact, options);
  const threshold = options.threshold || 0.6;

  // High-value facts always promote
  const highValueTypes = ['partner', 'family', 'health_allergy', 'health_condition'];
  if (highValueTypes.includes(fact.type)) {
    return {
      shouldPromote: true,
      score: Math.max(score, 0.8),
      reason: 'high_value_type'
    };
  }

  // Named relationships always promote
  if (fact.category === 'relationship' && fact.name) {
    return {
      shouldPromote: true,
      score: Math.max(score, 0.7),
      reason: 'named_relationship'
    };
  }

  // Score-based decision
  if (score >= threshold) {
    return {
      shouldPromote: true,
      score: score,
      reason: 'meets_threshold'
    };
  }

  return {
    shouldPromote: false,
    score: score,
    reason: 'below_threshold'
  };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Main extraction
  extractFacts,

  // Component extractors (for testing)
  extractProperNames,
  extractLifeStructureFacts,
  isTransientContent,
  analyzeSentiment,

  // Consolidation
  consolidateFacts,
  calculatePromotionScore,
  shouldPromoteToBrain2,

  // Utilities
  generateFactId,
  parseCount,

  // Patterns (for extending)
  LIFE_STRUCTURE_PATTERNS,
  RELATIONSHIP_ACTION_PATTERNS,
  NOT_NAMES
};
